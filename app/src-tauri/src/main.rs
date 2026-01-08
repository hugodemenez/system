// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod permissions;
mod bridge;
mod config;

use tauri::{
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
    Manager,
};
use std::sync::Mutex;

struct AppState {
    bridge_running: Mutex<bool>,
    tunnel_url: Mutex<Option<String>>,
    deployed_url: Mutex<Option<String>>,
}

#[tauri::command]
async fn check_config() -> Result<serde_json::Value, String> {
    let config = config::load_config().map_err(|e| e.to_string())?;
    
    Ok(serde_json::json!({
        "configured": config.auth_token.is_some() && config.anthropic_key.is_some(),
        "deployedUrl": config.deployed_url,
    }))
}

#[tauri::command]
async fn check_permissions() -> Result<serde_json::Value, String> {
    let results = permissions::check_all();
    Ok(serde_json::json!(results))
}

#[tauri::command]
async fn request_permission(permission: String) -> Result<(), String> {
    permissions::request(&permission).map_err(|e| e.to_string())
}

#[tauri::command]
async fn deploy(api_key: String, mode: String) -> Result<serde_json::Value, String> {
    // Save config
    let mut config = config::load_config().unwrap_or_default();
    config.anthropic_key = Some(api_key);
    config.mode = Some(mode.clone());
    config::save_config(&config).map_err(|e| e.to_string())?;
    
    if mode == "remote" {
        // Run wrangler deploy
        match bridge::deploy_to_cloudflare(&config).await {
            Ok(url) => {
                let mut config = config;
                config.deployed = Some(true);
                config.deployed_url = Some(url.clone());
                config::save_config(&config).map_err(|e| e.to_string())?;
                
                Ok(serde_json::json!({
                    "success": true,
                    "url": url,
                }))
            }
            Err(e) => Ok(serde_json::json!({
                "success": false,
                "error": e.to_string(),
            }))
        }
    } else {
        // Local mode - just save config
        Ok(serde_json::json!({
            "success": true,
        }))
    }
}

#[tauri::command]
async fn show_logs(app: tauri::AppHandle) -> Result<(), String> {
    // Open logs window or show in terminal
    Ok(())
}

#[tauri::command]
async fn show_preferences(app: tauri::AppHandle) -> Result<(), String> {
    // Show preferences window
    if let Some(window) = app.get_webview_window("main") {
        window.show().map_err(|e| e.to_string())?;
        window.set_focus().map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
async fn quit(app: tauri::AppHandle) -> Result<(), String> {
    app.exit(0);
    Ok(())
}

#[tauri::command]
async fn start_bridge(state: tauri::State<'_, AppState>) -> Result<(), String> {
    // Start bridge process
    bridge::start().await.map_err(|e| e.to_string())?;
    *state.bridge_running.lock().unwrap() = true;
    Ok(())
}

#[tauri::command]
async fn stop_bridge(state: tauri::State<'_, AppState>) -> Result<(), String> {
    bridge::stop().await.map_err(|e| e.to_string())?;
    *state.bridge_running.lock().unwrap() = false;
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .manage(AppState {
            bridge_running: Mutex::new(false),
            tunnel_url: Mutex::new(None),
            deployed_url: Mutex::new(None),
        })
        .setup(|app| {
            // Create system tray
            let menu = Menu::with_items(app, &[
                &MenuItem::with_id(app, "open", "Open SYSTEM", true, None::<&str>)?,
                &MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?,
            ])?;
            
            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .on_menu_event(|app, event| {
                    match event.id.as_ref() {
                        "open" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                        "quit" => {
                            app.exit(0);
                        }
                        _ => {}
                    }
                })
                .build(app)?;
            
            // Check if configured, if so start bridge
            if let Ok(config) = config::load_config() {
                if config.auth_token.is_some() && config.anthropic_key.is_some() {
                    // Already configured - start bridge in background
                    let app_handle = app.handle().clone();
                    tauri::async_runtime::spawn(async move {
                        if let Err(e) = bridge::start().await {
                            eprintln!("Failed to start bridge: {}", e);
                        }
                    });
                } else {
                    // Show onboarding window
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.show();
                    }
                }
            } else {
                // No config - show onboarding
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.show();
                }
            }
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            check_config,
            check_permissions,
            request_permission,
            deploy,
            show_logs,
            show_preferences,
            quit,
            start_bridge,
            stop_bridge,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
