use std::collections::HashMap;
use std::process::Command;

/// Check all macOS permissions
pub fn check_all() -> HashMap<String, bool> {
    let mut results = HashMap::new();
    
    results.insert("full_disk".to_string(), check_full_disk_access());
    results.insert("accessibility".to_string(), check_accessibility());
    results.insert("contacts".to_string(), check_contacts());
    results.insert("automation".to_string(), check_automation());
    
    results
}

/// Request a specific permission (opens System Settings)
pub fn request(permission: &str) -> Result<(), Box<dyn std::error::Error>> {
    let url = match permission {
        "full_disk" => "x-apple.systempreferences:com.apple.preference.security?Privacy_AllFiles",
        "accessibility" => "x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility",
        "contacts" => "x-apple.systempreferences:com.apple.preference.security?Privacy_Contacts",
        "automation" => "x-apple.systempreferences:com.apple.preference.security?Privacy_Automation",
        _ => return Err("Unknown permission".into()),
    };
    
    Command::new("open")
        .arg(url)
        .spawn()?;
    
    Ok(())
}

/// Check Full Disk Access by trying to read Messages database
fn check_full_disk_access() -> bool {
    let home = std::env::var("HOME").unwrap_or_default();
    let db_path = format!("{}/Library/Messages/chat.db", home);
    
    let output = Command::new("sqlite3")
        .args([&db_path, "SELECT 1 LIMIT 1"])
        .output();
    
    match output {
        Ok(o) => o.status.success(),
        Err(_) => false,
    }
}

/// Check Accessibility permission
fn check_accessibility() -> bool {
    let output = Command::new("osascript")
        .args(["-e", "tell application \"System Events\" to return name of first process"])
        .output();
    
    match output {
        Ok(o) => o.status.success(),
        Err(_) => false,
    }
}

/// Check Contacts access
fn check_contacts() -> bool {
    let output = Command::new("osascript")
        .args(["-e", "tell application \"Contacts\" to return count of people"])
        .output();
    
    match output {
        Ok(o) => o.status.success(),
        Err(_) => false,
    }
}

/// Check Automation permission
fn check_automation() -> bool {
    let output = Command::new("osascript")
        .args(["-e", "tell application \"System Events\" to get name of first application process whose frontmost is true"])
        .output();
    
    match output {
        Ok(o) => o.status.success(),
        Err(_) => false,
    }
}
