use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    pub auth_token: Option<String>,
    pub anthropic_key: Option<String>,
    pub mode: Option<String>,
    pub deployed: Option<bool>,
    pub deployed_url: Option<String>,
    pub cloudflare_account_id: Option<String>,
    #[serde(default)]
    pub extensions: Vec<serde_json::Value>,
}

/// Get the path to the config file (in the main project directory)
fn config_path() -> Result<PathBuf, Box<dyn std::error::Error>> {
    // Look for bridge.config.json in the project root
    // When running from app/, we need to go up one level
    let current_dir = std::env::current_dir()?;
    
    // Try current directory first
    let config_file = current_dir.join("bridge.config.json");
    if config_file.exists() {
        return Ok(config_file);
    }
    
    // Try parent directory (when running from app/)
    if let Some(parent) = current_dir.parent() {
        let config_file = parent.join("bridge.config.json");
        if config_file.exists() {
            return Ok(config_file);
        }
    }
    
    // Default to current directory
    Ok(current_dir.join("bridge.config.json"))
}

/// Load configuration from bridge.config.json
pub fn load_config() -> Result<Config, Box<dyn std::error::Error>> {
    let path = config_path()?;
    
    if !path.exists() {
        return Ok(Config::default());
    }
    
    let content = fs::read_to_string(path)?;
    let config: Config = serde_json::from_str(&content)?;
    
    Ok(config)
}

/// Save configuration to bridge.config.json
pub fn save_config(config: &Config) -> Result<(), Box<dyn std::error::Error>> {
    let path = config_path()?;
    let content = serde_json::to_string_pretty(config)?;
    fs::write(path, content)?;
    Ok(())
}
