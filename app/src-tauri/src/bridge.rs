use crate::config::Config;
use std::process::{Child, Command, Stdio};
use std::sync::Mutex;
use once_cell::sync::Lazy;

static BRIDGE_PROCESS: Lazy<Mutex<Option<Child>>> = Lazy::new(|| Mutex::new(None));
static TUNNEL_PROCESS: Lazy<Mutex<Option<Child>>> = Lazy::new(|| Mutex::new(None));

/// Start the bridge server
pub async fn start() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    // Check if already running
    if let Some(ref mut child) = *BRIDGE_PROCESS.lock().unwrap() {
        if child.try_wait()?.is_none() {
            return Ok(()); // Already running
        }
    }
    
    // Get the project root (parent of app/)
    let current_dir = std::env::current_dir()?;
    let project_root = current_dir.parent().unwrap_or(&current_dir);
    
    // Start bridge using node
    let child = Command::new("node")
        .arg("dist/bridge/http-server.js")
        .current_dir(project_root)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()?;
    
    *BRIDGE_PROCESS.lock().unwrap() = Some(child);
    
    // Give it a moment to start
    tokio::time::sleep(tokio::time::Duration::from_secs(2)).await;
    
    Ok(())
}

/// Stop the bridge server
pub async fn stop() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    if let Some(mut child) = BRIDGE_PROCESS.lock().unwrap().take() {
        child.kill()?;
    }
    
    if let Some(mut child) = TUNNEL_PROCESS.lock().unwrap().take() {
        child.kill()?;
    }
    
    Ok(())
}

/// Start cloudflared tunnel
pub async fn start_tunnel() -> Result<String, Box<dyn std::error::Error + Send + Sync>> {
    // Check if already running
    if let Some(ref mut child) = *TUNNEL_PROCESS.lock().unwrap() {
        if child.try_wait()?.is_none() {
            return Err("Tunnel already running".into());
        }
    }
    
    let child = Command::new("cloudflared")
        .args(["tunnel", "--url", "http://localhost:3000"])
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()?;
    
    *TUNNEL_PROCESS.lock().unwrap() = Some(child);
    
    // TODO: Parse the tunnel URL from output
    // For now, return a placeholder
    Ok("https://tunnel.trycloudflare.com".to_string())
}

/// Deploy to Cloudflare Workers
pub async fn deploy_to_cloudflare(config: &Config) -> Result<String, Box<dyn std::error::Error + Send + Sync>> {
    // Get the project root
    let current_dir = std::env::current_dir()?;
    let project_root = current_dir.parent().unwrap_or(&current_dir);
    let agent_dir = project_root.join("cloudflare-agent");
    
    // Ensure dependencies are installed
    let npm_install = Command::new("npm")
        .arg("install")
        .current_dir(&agent_dir)
        .output()?;
    
    if !npm_install.status.success() {
        return Err("Failed to install dependencies".into());
    }
    
    // Deploy with wrangler
    let mut deploy_cmd = Command::new("npx");
    deploy_cmd
        .args(["wrangler", "deploy"])
        .current_dir(&agent_dir)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped());
    
    // Set account ID if available
    if let Some(account_id) = &config.cloudflare_account_id {
        deploy_cmd.env("CLOUDFLARE_ACCOUNT_ID", account_id);
    }
    
    let output = deploy_cmd.output()?;
    
    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("Deploy failed: {}", stderr).into());
    }
    
    let stdout = String::from_utf8_lossy(&output.stdout);
    
    // Extract URL from output
    let url = stdout
        .lines()
        .find(|line| line.contains("workers.dev"))
        .and_then(|line| {
            line.split_whitespace()
                .find(|word| word.contains("workers.dev"))
        })
        .map(|s| s.trim().to_string())
        .ok_or("Could not find deployed URL")?;
    
    // Set secrets
    let secrets = [
        ("ANTHROPIC_API_KEY", config.anthropic_key.as_deref().unwrap_or("")),
        ("BRIDGE_AUTH_TOKEN", config.auth_token.as_deref().unwrap_or("")),
        ("API_SECRET", &config.auth_token.as_deref().unwrap_or("")[..32.min(config.auth_token.as_deref().unwrap_or("").len())]),
        ("BRIDGE_URL", "http://localhost:3000"),
    ];
    
    for (name, value) in secrets {
        let mut secret_cmd = Command::new("sh");
        secret_cmd
            .args(["-c", &format!("echo '{}' | npx wrangler secret put {}", value, name)])
            .current_dir(&agent_dir)
            .stdout(Stdio::null())
            .stderr(Stdio::null());
        
        if let Some(account_id) = &config.cloudflare_account_id {
            secret_cmd.env("CLOUDFLARE_ACCOUNT_ID", account_id);
        }
        
        let _ = secret_cmd.output(); // Ignore errors for secrets
    }
    
    Ok(url)
}
