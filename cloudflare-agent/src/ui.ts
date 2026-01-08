/**
 * SYSTEM Chat UI
 * 
 * A minimal OS-style interface for remote computer control.
 * Departure Mono for titles/buttons, Uncut Sans for body.
 */

export const chatHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="theme-color" content="#0a0a0a">
  <title>SYSTEM</title>
  <style>
    @font-face {
      font-family: 'Departure Mono';
      src: url('/DepartureMono-Regular.otf') format('opentype');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
    
    @font-face {
      font-family: 'Uncut Sans';
      src: url('/UncutSans-Variable.ttf') format('truetype');
      font-weight: 100 900;
      font-style: normal;
      font-display: swap;
    }

    *, *::before, *::after { box-sizing: border-box; }
    body, h1, h2, p, div, header, form, button, textarea, span { margin: 0; padding: 0; }

    :root {
      --bg: #0a0a0a;
      --bg-subtle: #111;
      --bg-panel: #0e0e0e;
      --bg-elevated: #181818;
      --border: #1a1a1a;
      --border-bright: #2a2a2a;
      --text: #999;
      --text-bright: #e0e0e0;
      --text-dim: #555;
      --accent: #6a9;
      --accent-dim: #354;
      --red: #a54;
      --purple: #a5a;
      --sidebar-width: 220px;
      
      --font-body: 'Uncut Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      --font-mono: 'Departure Mono', 'SF Mono', monospace;
    }

    [data-theme="light"] {
      --bg: #f4f2ef;
      --bg-subtle: #eae8e5;
      --bg-panel: #efede9;
      --bg-elevated: #fff;
      --border: #ddd9d4;
      --border-bright: #ccc8c3;
      --text: #666;
      --text-bright: #1a1a1a;
      --text-dim: #999;
      --accent: #3a7a5a;
      --accent-dim: #6a9a7a;
      --red: #a54a3a;
      --purple: #7a5a8a;
    }

    html, body { height: 100%; overflow: hidden; }

    body {
      font-family: var(--font-body);
      font-size: 14px;
      font-weight: 400;
      background: var(--bg);
      color: var(--text);
      display: flex;
      flex-direction: column;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }

    body::before {
      content: '';
      position: fixed;
      inset: 0;
      pointer-events: none;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      opacity: 0.035;
      z-index: 1000;
    }
    
    [data-theme="light"] body::before {
      opacity: 0.045;
    }

    /* Header */
    header {
      padding: 0 16px;
      height: 48px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
      background: var(--bg);
      z-index: 10;
    }

    .header-left { display: flex; align-items: center; gap: 12px; }
    
    .sidebar-toggle {
      width: 32px;
      height: 32px;
      background: transparent;
      color: var(--text-dim);
      border: 1px solid var(--border);
      border-radius: 6px;
      cursor: pointer;
      font-size: 18px;
      line-height: 1;
      font-family: var(--font-body);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s;
      padding: 0;
      padding-bottom: 4px;
    }
    .sidebar-toggle:hover { color: var(--text); border-color: var(--border-bright); }

    .logo { 
      font-family: var(--font-mono); 
      font-size: 13px; 
      color: var(--text-bright); 
      letter-spacing: -0.5px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .logo-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent);
      flex-shrink: 0;
    }
    .logo-dot.offline { background: var(--red); }
    
    .header-right { display: flex; align-items: center; gap: 8px; }
    
    .header-btn {
      width: 32px;
      height: 32px;
      background: transparent;
      color: var(--text-dim);
      border: 1px solid var(--border);
      border-radius: 6px;
      font-family: var(--font-mono);
      font-size: 12px;
      cursor: pointer;
      transition: all 0.15s;
      display: flex;
      align-items: center;
      padding-bottom:3px;
      justify-content: center;
    }
    .header-btn:hover { color: var(--text); border-color: var(--border-bright); background: var(--bg-subtle); }
    
    .auth-hidden { display: none; }

    /* Auth Screen */
    .auth { flex: 1; display: flex; flex-direction: column; }
    .auth.hidden { display: none; }
    .auth:not(.hidden) ~ .main-wrapper { display: none; }

    .auth-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
    }

    .auth-hero {
      text-align: center;
      margin-bottom: 48px;
    }
    
    .auth-logo {
      width: 64px;
      margin: 0 auto 24px;
    }
    
    .auth-logo svg {
      width: 100%;
      height: auto;
      display: block;
    }
    
    .auth-logo-dark { display: block; }
    .auth-logo-light { display: none; }
    
    [data-theme="light"] .auth-logo-dark { display: none; }
    [data-theme="light"] .auth-logo-light { display: block; }
    
    .auth-title {
      font-family: var(--font-mono);
      font-size: 64px;
      font-weight: normal;
      color: var(--text-bright);
      letter-spacing: -3px;
      margin-bottom: 12px;
    }
    
    .auth-subtitle {
      font-size: 15px;
      color: var(--text-dim);
      font-weight: 400;
    }

    #auth-form { 
      display: flex; 
      flex-direction: column;
      align-items: center;
      gap: 12px; 
      width: 100%; 
      max-width: 280px;
    }
    
    .auth-label { display: none; }
    
    #token {
      width: 100%;
      height: 44px;
      padding: 0 14px;
      background: var(--bg-subtle);
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--text-bright);
      font-family: var(--font-body);
      font-size: 14px;
      outline: none;
      text-align: center;
    }
    #token:focus { border-color: var(--border-bright); background: var(--bg-elevated); }
    #token::placeholder { color: var(--text-dim); }

    #auth-btn {
      width: 100%;
      padding: 12px 20px;
      background: var(--text-bright);
      color: var(--bg);
      border: none;
      border-radius: 8px;
      font-family: var(--font-mono);
      font-size: 12px;
      cursor: pointer;
      transition: all 0.15s;
    }
    #auth-btn:hover { opacity: 0.9; }
    #auth-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    
    .auth-error { color: var(--red); font-size: 13px; min-height: 20px; }

    .auth-footer {
      padding: 20px;
      text-align: center;
      color: var(--text-dim);
      font-size: 12px;
    }
    .auth-footer a { color: var(--text); text-decoration: none; }
    .auth-footer a:hover { color: var(--text-bright); }

    /* Main Layout */
    .main-wrapper { flex: 1; display: flex; overflow: hidden; }
    
    /* Sidebar - collapsible on all screens */
    .sidebar {
      width: var(--sidebar-width);
      background: var(--bg-panel);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      transition: margin-left 0.2s ease, transform 0.2s ease;
    }
    
    .sidebar.collapsed {
      margin-left: calc(var(--sidebar-width) * -1);
    }
    
    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        z-index: 200;
        transform: translateX(-100%);
        margin-left: 0 !important;
      }
      .sidebar.visible { transform: translateX(0); }
      .sidebar-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        z-index: 199;
        display: none;
      }
      .sidebar-overlay.visible { display: block; }
    }
    
    .sidebar-header {
      padding: 12px 16px;
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .sidebar-title { 
      font-family: var(--font-mono);
      font-size: 11px; 
      text-transform: uppercase; 
      letter-spacing: 0.5px; 
      color: var(--text-dim); 
    }
    .sidebar-close {
      display: none;
      background: none;
      border: none;
      color: var(--text-dim);
      font-size: 18px;
      cursor: pointer;
      padding: 4px;
      font-family: var(--font-body);
    }
    .sidebar-close:hover { color: var(--text); }
    @media (max-width: 768px) { .sidebar-close { display: block; } }
    
    .new-chat-btn {
      margin: 12px;
      padding: 10px 12px;
      background: var(--bg-subtle);
      color: var(--text);
      border: 1px solid var(--border);
      border-radius: 8px;
      font-family: var(--font-mono);
      font-size: 11px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.15s;
    }
    .new-chat-btn:hover { background: var(--bg-elevated); color: var(--text-bright); border-color: var(--border-bright); }
    
    .conversations-list {
      flex: 1;
      overflow-y: auto;
      padding: 8px;
    }
    
    .conv-item {
      padding: 10px 12px;
      margin-bottom: 4px;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 2px;
      transition: all 0.15s;
    }
    .conv-item:hover { background: var(--bg-subtle); border-color: var(--border); }
    .conv-item.active { background: var(--bg-subtle); border-color: var(--accent-dim); }
    .conv-item.active .conv-title { color: var(--accent); }
    
    .conv-title {
      font-size: 13px;
      color: var(--text-bright);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .conv-preview {
      font-size: 11px;
      color: var(--text-dim);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .conv-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 4px;
    }
    .conv-time { font-size: 10px; color: var(--text-dim); }
    .conv-delete {
      opacity: 0;
      background: none;
      border: none;
      color: var(--red);
      font-size: 14px;
      cursor: pointer;
      padding: 2px 4px;
      transition: opacity 0.15s;
      font-family: var(--font-body);
    }
    .conv-item:hover .conv-delete { opacity: 0.6; }
    .conv-delete:hover { opacity: 1 !important; }
    
    .conversations-empty {
      padding: 20px;
      text-align: center;
      color: var(--text-dim);
      font-size: 12px;
    }
    
    /* Sidebar footer */
    .sidebar-footer {
      padding: 12px;
      border-top: 1px solid var(--border);
    }
    
    .sidebar-footer-btn {
      width: 100%;
      padding: 10px 12px;
      background: transparent;
      color: var(--text-dim);
      border: 1px solid var(--border);
      border-radius: 8px;
      font-family: var(--font-mono);
      font-size: 11px;
      cursor: pointer;
      transition: all 0.15s;
    }
    .sidebar-footer-btn:hover { 
      color: var(--red); 
      border-color: var(--red);
      background: rgba(170, 85, 68, 0.1);
    }

    /* Main Chat Area */
    .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; position: relative; }
    .chat { flex: 1; display: flex; flex-direction: column; min-width: 0; }
    .chat.hidden { display: none; }

    .messages { 
      flex: 1; 
      overflow-y: auto; 
      padding: 20px; 
    }
    
    /* OS-Style Welcome */
    .welcome { 
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
    }
    
    .welcome-header {
      text-align: center;
      margin-bottom: 48px;
    }
    
    .welcome-logo {
      width: 32px;
      margin: auto;
      margin-bottom: 16px;
    }
    
    .welcome-logo svg {
      width: 100%;
      height: auto;
      display: block;
    }
    
    /* Show white logo in dark mode, black in light mode */
    .welcome-logo-dark { display: block; }
    .welcome-logo-light { display: none; }
    
    [data-theme="light"] .welcome-logo-dark { display: none; }
    [data-theme="light"] .welcome-logo-light { display: block; }
    
    .welcome h1 { 
      font-family: var(--font-mono);
      font-size: 28px; 
      font-weight: normal; 
      color: var(--text-bright); 
      letter-spacing: -1px;
      margin-bottom: 8px; 
    }
    .welcome p { 
      font-size: 14px; 
      color: var(--text-dim);
    }
    
    /* App Grid - OS style icons */
    .app-grid {
      display: grid;
      grid-template-columns: repeat(4, 72px);
      gap: 20px;
      margin-bottom: 48px;
    }
    
    @media (max-width: 400px) {
      .app-grid {
        grid-template-columns: repeat(3, 72px);
        gap: 16px;
      }
    }
    
    .app-icon {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      border-radius: 12px;
      transition: all 0.15s;
    }
    .app-icon:hover { 
      background: var(--bg-subtle);
    }
    .app-icon:active {
      transform: scale(0.95);
    }
    
    .app-icon-img {
      width: 48px;
      height: 48px;
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      transition: all 0.15s;
      filter: grayscale(1) contrast(1.5) brightness(1.1);
      position: relative;
      overflow: hidden;
    }
    
    /* Wrapper for emoji to isolate dither effect */
    .app-icon-emoji {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      isolation: isolate;
    }
    
    /* 4x4 Bayer ordered dither pattern - masked to emoji */
    .app-icon-emoji::before {
      content: '';
      position: absolute;
      inset: -4px;
      z-index: 1;
      /* 4x4 Bayer matrix dither pattern - each cell has opacity based on threshold */
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Crect x='0' y='0' width='2' height='2' fill='%23000' opacity='0'/%3E%3Crect x='2' y='0' width='2' height='2' fill='%23000' opacity='0.53'/%3E%3Crect x='4' y='0' width='2' height='2' fill='%23000' opacity='0.13'/%3E%3Crect x='6' y='0' width='2' height='2' fill='%23000' opacity='0.67'/%3E%3Crect x='0' y='2' width='2' height='2' fill='%23000' opacity='0.8'/%3E%3Crect x='2' y='2' width='2' height='2' fill='%23000' opacity='0.27'/%3E%3Crect x='4' y='2' width='2' height='2' fill='%23000' opacity='0.93'/%3E%3Crect x='6' y='2' width='2' height='2' fill='%23000' opacity='0.4'/%3E%3Crect x='0' y='4' width='2' height='2' fill='%23000' opacity='0.2'/%3E%3Crect x='2' y='4' width='2' height='2' fill='%23000' opacity='0.73'/%3E%3Crect x='4' y='4' width='2' height='2' fill='%23000' opacity='0.07'/%3E%3Crect x='6' y='4' width='2' height='2' fill='%23000' opacity='0.6'/%3E%3Crect x='0' y='6' width='2' height='2' fill='%23000' opacity='1'/%3E%3Crect x='2' y='6' width='2' height='2' fill='%23000' opacity='0.47'/%3E%3Crect x='4' y='6' width='2' height='2' fill='%23000' opacity='0.87'/%3E%3Crect x='6' y='6' width='2' height='2' fill='%23000' opacity='0.33'/%3E%3C/svg%3E");
      background-size: 8px 8px;
      image-rendering: pixelated;
      mix-blend-mode: multiply;
      pointer-events: none;
      opacity: 0.6;
      /* Mask to center area where emoji is */
      -webkit-mask-image: radial-gradient(circle at center, black 40%, transparent 70%);
      mask-image: radial-gradient(circle at center, black 40%, transparent 70%);
    }
    
    /* Dot pattern overlay for extra texture - also masked */
    .app-icon-emoji::after {
      content: '';
      position: absolute;
      inset: -2px;
      z-index: 2;
      /* Ordered dot grid */
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Ccircle cx='2' cy='2' r='1' fill='%23000' opacity='0.4'/%3E%3C/svg%3E");
      background-size: 4px 4px;
      image-rendering: pixelated;
      pointer-events: none;
      -webkit-mask-image: radial-gradient(circle at center, black 35%, transparent 65%);
      mask-image: radial-gradient(circle at center, black 35%, transparent 65%);
    }
    
    [data-theme="light"] .app-icon-emoji::before {
      opacity: 0.4;
    }
    
    [data-theme="light"] .app-icon-emoji::after {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Ccircle cx='2' cy='2' r='1' fill='%23000' opacity='0.2'/%3E%3C/svg%3E");
    }
    
    .app-icon:hover .app-icon-img {
      border-color: var(--border-bright);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      filter: grayscale(0.3) contrast(1.2);
    }
    
    .app-icon:hover .app-icon-emoji::before,
    .app-icon:hover .app-icon-emoji::after {
      opacity: 0.2;
    }
    
    .app-icon-label { 
      font-family: var(--font-body);
      font-size: 11px; 
      color: var(--text);
      text-align: center;
      max-width: 64px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* Scheduled tasks widget */
    .tasks-widget {
      width: 100%;
      max-width: 320px;
    }
    
    .tasks-widget-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      padding: 0 4px;
    }
    
    .tasks-widget-title {
      font-family: var(--font-mono);
      font-size: 10px;
      color: var(--text-dim);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .tasks-widget-action {
      font-size: 11px;
      color: var(--text-dim);
      background: none;
      border: none;
      cursor: pointer;
      font-family: var(--font-body);
    }
    .tasks-widget-action:hover { color: var(--text); }
    
    .tasks-widget-list {
      background: var(--bg-panel);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
    }
    
    .tasks-widget-item {
      padding: 10px 14px;
      display: flex;
      align-items: center;
      gap: 10px;
      border-bottom: 1px solid var(--border);
    }
    .tasks-widget-item:last-child { border-bottom: none; }
    
    .tasks-widget-icon {
      width: 28px;
      height: 28px;
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }
    
    .tasks-widget-info { flex: 1; min-width: 0; }
    
    .tasks-widget-desc {
      font-size: 12px;
      color: var(--text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tasks-widget-time {
      font-family: var(--font-mono);
      font-size: 10px;
      color: var(--text-dim);
    }
    
    .tasks-widget-empty {
      padding: 24px;
      text-align: center;
      color: var(--text-dim);
      font-size: 12px;
    }

    /* Messages */
    .msg { 
      margin-bottom: 16px; 
      max-width: 700px;
      margin-left: auto;
      margin-right: auto;
    }
    .msg-line { display: flex; align-items: flex-start; gap: 12px; }
    .msg-who { 
      flex-shrink: 0; 
      width: 28px; 
      font-family: var(--font-mono);
      font-size: 11px; 
      color: var(--text-dim); 
      text-align: right; 
    }
    .msg.user .msg-who { color: var(--text-dim); }
    .msg.assistant .msg-who { color: var(--accent); }
    .msg.system .msg-who { color: var(--red); }
    .msg-text { flex: 1; min-width: 0; word-wrap: break-word; color: var(--text); font-size: 14px; }
    .msg.user .msg-text { color: var(--text-bright); }
    .msg.typing .msg-text::after { content: '▊'; animation: blink 1s infinite; color: var(--accent); }
    @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }

    .tool-call { 
      margin: 8px 0; 
      padding: 12px 14px; 
      background: var(--bg-subtle); 
      border: 1px solid var(--border); 
      border-radius: 8px;
      font-size: 12px; 
    }
    .tool-name { 
      font-family: var(--font-mono);
      color: var(--accent); 
      margin-bottom: 6px; 
      font-size: 11px;
    }
    .tool-result { color: var(--text); white-space: pre-wrap; word-break: break-word; }
    .tool-result.error { color: var(--red); }
    .tool-image { margin-top: 8px; }
    .tool-image img { max-width: 100%; border: 1px solid var(--border); border-radius: 8px; cursor: pointer; transition: transform 0.2s; }
    .tool-image img:hover { transform: scale(1.01); }
    .tool-image img.fullscreen { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(1); max-width: 95vw; max-height: 95vh; z-index: 1000; border: 2px solid var(--accent); box-shadow: 0 0 50px rgba(0,0,0,0.8); border-radius: 8px; }
    .image-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 999; display: none; }
    .image-overlay.active { display: block; }

    .scheduled-task { margin: 8px 0; padding: 12px 14px; background: var(--bg-subtle); border: 1px solid var(--border); border-radius: 8px; font-size: 12px; }
    .scheduled-when { font-family: var(--font-mono); color: var(--purple); margin-bottom: 4px; font-size: 11px; }

    /* Notifications */
    .msg.system-notification { 
      background: linear-gradient(135deg, rgba(102, 170, 153, 0.1), rgba(102, 170, 153, 0.02)); 
      border-left: 2px solid var(--accent); 
      padding: 12px 16px; 
      margin: 8px 0; 
      border-radius: 8px;
      animation: slideIn 0.3s ease-out; 
    }
    .notification-content { display: flex; flex-direction: column; gap: 4px; }
    .notification-title { color: var(--accent); font-weight: 500; font-size: 13px; }
    .notification-message { color: var(--text-bright); font-size: 14px; }
    .notification-time { color: var(--text-dim); font-size: 11px; }
    .msg.scheduled { border-left: 2px solid var(--purple); background: linear-gradient(135deg, rgba(165, 90, 165, 0.1), rgba(165, 90, 165, 0.02)); }
    .msg.scheduled .msg-who { color: var(--purple); }
    @keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

    .msg-text code { 
      background: var(--bg-subtle); 
      padding: 2px 6px; 
      font-family: var(--font-mono);
      font-size: 12px; 
      border: 1px solid var(--border); 
      border-radius: 4px;
    }
    .msg-text pre { 
      background: var(--bg-subtle); 
      padding: 12px 14px; 
      margin: 8px 0; 
      overflow-x: auto; 
      border: 1px solid var(--border);
      border-radius: 8px;
    }
    .msg-text pre code { background: none; padding: 0; border: none; }
    .msg-text strong { color: var(--text-bright); font-weight: 500; }
    .msg-text ul, .msg-text ol { margin: 8px 0; padding-left: 20px; }

    /* Input Area */
    .input-area { 
      padding: 16px 20px; 
      padding-bottom: max(16px, env(safe-area-inset-bottom, 16px));
      border-top: 1px solid var(--border); 
      background: var(--bg);
    }
    .input-row { 
      display: flex; 
      align-items: flex-end; 
      gap: 12px;
      max-width: 700px;
      margin: 0 auto;
    }
    .input-prompt { 
      font-family: var(--font-mono);
      color: var(--accent); 
      font-size: 14px; 
      line-height: 22px; 
      flex-shrink: 0; 
    }
    #input {
      flex: 1;
      background: transparent;
      border: none;
      color: var(--text-bright);
      font-family: var(--font-body);
      font-size: 14px;
      line-height: 22px;
      resize: none;
      outline: none;
      min-height: 22px;
      max-height: 120px;
    }
    #input::placeholder { color: var(--text-dim); }
    
    @supports (height: 100dvh) { .app { height: 100dvh; } }
  </style>
</head>
<body>
  <header>
    <div class="header-left">
      <button class="sidebar-toggle" id="sidebar-toggle">☰</button>
      <div class="logo"><span class="logo-dot" id="status-dot"></span>SYSTEM</div>
    </div>
    <div class="header-right">
      <button class="header-btn" id="theme-toggle" title="Toggle theme">◐</button>
    </div>
  </header>

  <div class="auth" id="auth">
    <div class="auth-content">
      <div class="auth-hero">
        <div class="auth-logo auth-logo-dark">
          <svg width="600" height="240" viewBox="0 0 600 240" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M536 0C571.346 0 600 28.6538 600 64V176C600 211.346 571.346 240 536 240H64C28.6538 240 0 211.346 0 176V64C0 28.6538 28.6538 0 64 0H536ZM70 42C54.536 42 42 54.536 42 70V170C42 185.464 54.536 198 70 198H530C545.464 198 558 185.464 558 170V70C558 54.536 545.464 42 530 42H70Z" fill="white"/><path d="M154 84H86C84.8954 84 84 84.8954 84 86V154C84 155.105 84.8954 156 86 156H154C155.105 156 156 155.105 156 154V86C156 84.8954 155.105 84 154 84Z" fill="url(#a1)"/><path d="M274 84H206C204.895 84 204 84.8954 204 86V154C204 155.105 204.895 156 206 156H274C275.105 156 276 155.105 276 154V86C276 84.8954 275.105 84 274 84Z" fill="url(#a2)"/><path d="M394 84H326C324.895 84 324 84.8954 324 86V154C324 155.105 324.895 156 326 156H394C395.105 156 396 155.105 396 154V86C396 84.8954 395.105 84 394 84Z" fill="url(#a3)"/><path d="M514 84H446C444.895 84 444 84.8954 444 86V154C444 155.105 444.895 156 446 156H514C515.105 156 516 155.105 516 154V86C516 84.8954 515.105 84 514 84Z" fill="url(#a4)"/><path opacity="0.08" d="M156 120H84V156H156V120Z" fill="black"/><path opacity="0.08" d="M276 120H204V156H276V120Z" fill="black"/><path opacity="0.08" d="M396 120H324V156H396V120Z" fill="black"/><path opacity="0.08" d="M516 120H444V156H516V120Z" fill="black"/><mask id="ma1" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="240"><path d="M536 0H64C28.6538 0 0 28.6538 0 64V176C0 211.346 28.6538 240 64 240H536C571.346 240 600 211.346 600 176V64C600 28.6538 571.346 0 536 0Z" fill="white"/></mask><g mask="url(#ma1)"><path d="M558.904 120H41.0959C18.3993 120 0 146.863 0 180C0 213.137 18.3993 240 41.0959 240H558.904C581.601 240 600 213.137 600 180C600 146.863 581.601 120 558.904 120Z" fill="url(#a5)"/></g><defs><linearGradient id="a1" x1="84" y1="84" x2="84" y2="156" gradientUnits="userSpaceOnUse"><stop stop-color="white"/><stop offset="0.6" stop-color="white"/><stop offset="1" stop-color="#E9E9E9"/></linearGradient><linearGradient id="a2" x1="204" y1="84" x2="204" y2="156" gradientUnits="userSpaceOnUse"><stop stop-color="white"/><stop offset="0.6" stop-color="white"/><stop offset="1" stop-color="#E9E9E9"/></linearGradient><linearGradient id="a3" x1="324" y1="84" x2="324" y2="156" gradientUnits="userSpaceOnUse"><stop stop-color="white"/><stop offset="0.6" stop-color="white"/><stop offset="1" stop-color="#E9E9E9"/></linearGradient><linearGradient id="a4" x1="444" y1="84" x2="444" y2="156" gradientUnits="userSpaceOnUse"><stop stop-color="white"/><stop offset="0.6" stop-color="white"/><stop offset="1" stop-color="#E9E9E9"/></linearGradient><linearGradient id="a5" x1="0" y1="120" x2="0" y2="240" gradientUnits="userSpaceOnUse"><stop stop-color="white" stop-opacity="0"/><stop offset="0.2" stop-opacity="0.1"/><stop offset="1" stop-opacity="0.55"/></linearGradient></defs></svg>
        </div>
        <div class="auth-logo auth-logo-light">
          <svg width="600" height="240" viewBox="0 0 600 240" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M536 0C571.346 0 600 28.6538 600 64V176C600 211.346 571.346 240 536 240H64C28.6538 240 0 211.346 0 176V64C0 28.6538 28.6538 0 64 0H536ZM70 42C54.536 42 42 54.536 42 70V170C42 185.464 54.536 198 70 198H530C545.464 198 558 185.464 558 170V70C558 54.536 545.464 42 530 42H70Z" fill="black"/><path d="M154 84H86C84.8954 84 84 84.8954 84 86V154C84 155.105 84.8954 156 86 156H154C155.105 156 156 155.105 156 154V86C156 84.8954 155.105 84 154 84Z" fill="url(#b1)"/><path d="M274 84H206C204.895 84 204 84.8954 204 86V154C204 155.105 204.895 156 206 156H274C275.105 156 276 155.105 276 154V86C276 84.8954 275.105 84 274 84Z" fill="url(#b2)"/><path d="M394 84H326C324.895 84 324 84.8954 324 86V154C324 155.105 324.895 156 326 156H394C395.105 156 396 155.105 396 154V86C396 84.8954 395.105 84 394 84Z" fill="url(#b3)"/><path d="M514 84H446C444.895 84 444 84.8954 444 86V154C444 155.105 444.895 156 446 156H514C515.105 156 516 155.105 516 154V86C516 84.8954 515.105 84 514 84Z" fill="url(#b4)"/><path opacity="0.08" d="M156 120H84V156H156V120Z" fill="black"/><path opacity="0.08" d="M276 120H204V156H276V120Z" fill="black"/><path opacity="0.08" d="M396 120H324V156H396V120Z" fill="black"/><path opacity="0.08" d="M516 120H444V156H516V120Z" fill="black"/><mask id="mb1" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="240"><path d="M536 0C571.346 0 600 28.6538 600 64V176C600 211.346 571.346 240 536 240H64C28.6538 240 0 211.346 0 176V64C0 28.6538 28.6538 0 64 0H536ZM70 42C54.536 42 42 54.536 42 70V170C42 185.464 54.536 198 70 198H530C545.464 198 558 185.464 558 170V70C558 54.536 545.464 42 530 42H70Z" fill="black"/></mask><g mask="url(#mb1)"><path d="M558.904 120H41.0959C18.3993 120 0 146.863 0 180C0 213.137 18.3993 240 41.0959 240H558.904C581.601 240 600 213.137 600 180C600 146.863 581.601 120 558.904 120Z" fill="url(#b5)"/></g><defs><linearGradient id="b1" x1="84" y1="84" x2="84" y2="156" gradientUnits="userSpaceOnUse"><stop/><stop offset="0.6"/><stop offset="1" stop-color="#888888"/></linearGradient><linearGradient id="b2" x1="204" y1="84" x2="204" y2="156" gradientUnits="userSpaceOnUse"><stop/><stop offset="0.6"/><stop offset="1" stop-color="#888888"/></linearGradient><linearGradient id="b3" x1="324" y1="84" x2="324" y2="156" gradientUnits="userSpaceOnUse"><stop/><stop offset="0.6"/><stop offset="1" stop-color="#888888"/></linearGradient><linearGradient id="b4" x1="444" y1="84" x2="444" y2="156" gradientUnits="userSpaceOnUse"><stop/><stop offset="0.6"/><stop offset="1" stop-color="#888888"/></linearGradient><linearGradient id="b5" x1="0" y1="120" x2="0" y2="240" gradientUnits="userSpaceOnUse"><stop stop-opacity="0"/><stop offset="0.2" stop-color="#7D7D7D" stop-opacity="0.1"/><stop offset="1" stop-color="#777777" stop-opacity="0.55"/></linearGradient></defs></svg>
        </div>
        <h1 class="auth-title">SYSTEM</h1>
        <p class="auth-subtitle">Remote computer control</p>
      </div>
      <form id="auth-form" onsubmit="return false;">
        <label class="auth-label" for="token">API Secret</label>
        <input type="password" id="token" placeholder="Enter API secret" autocomplete="off">
        <button type="submit" id="auth-btn">Connect</button>
      </form>
      <div class="auth-error" id="auth-err"></div>
    </div>
    <div class="auth-footer">
      <a href="https://github.com/ygwyg/system" target="_blank">Documentation</a>
    </div>
  </div>

  <div class="main-wrapper" id="main-wrapper">
    <div class="sidebar-overlay" id="sidebar-overlay"></div>
    <div class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <span class="sidebar-title">History</span>
        <button class="sidebar-close" id="sidebar-close">×</button>
      </div>
      <button class="new-chat-btn" id="new-chat-btn">+ New Session</button>
      <div class="conversations-list" id="conversations-list">
        <div class="conversations-empty">No sessions yet</div>
      </div>
      <div class="sidebar-footer">
        <button class="sidebar-footer-btn" id="disconnect-btn">Disconnect</button>
      </div>
    </div>

    <div class="main" id="main">
      <div class="chat" id="chat">
        <div class="messages" id="msgs">
          <div class="welcome" id="welcome">
            <div class="welcome-header">
              <div class="welcome-logo welcome-logo-dark">
                <svg width="600" height="240" viewBox="0 0 600 240" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M536 0C571.346 0 600 28.6538 600 64V176C600 211.346 571.346 240 536 240H64C28.6538 240 0 211.346 0 176V64C0 28.6538 28.6538 0 64 0H536ZM70 42C54.536 42 42 54.536 42 70V170C42 185.464 54.536 198 70 198H530C545.464 198 558 185.464 558 170V70C558 54.536 545.464 42 530 42H70Z" fill="white"/>
<path d="M154 84H86C84.8954 84 84 84.8954 84 86V154C84 155.105 84.8954 156 86 156H154C155.105 156 156 155.105 156 154V86C156 84.8954 155.105 84 154 84Z" fill="url(#paint0_linear_1402_192)"/>
<path d="M274 84H206C204.895 84 204 84.8954 204 86V154C204 155.105 204.895 156 206 156H274C275.105 156 276 155.105 276 154V86C276 84.8954 275.105 84 274 84Z" fill="url(#paint1_linear_1402_192)"/>
<path d="M394 84H326C324.895 84 324 84.8954 324 86V154C324 155.105 324.895 156 326 156H394C395.105 156 396 155.105 396 154V86C396 84.8954 395.105 84 394 84Z" fill="url(#paint2_linear_1402_192)"/>
<path d="M514 84H446C444.895 84 444 84.8954 444 86V154C444 155.105 444.895 156 446 156H514C515.105 156 516 155.105 516 154V86C516 84.8954 515.105 84 514 84Z" fill="url(#paint3_linear_1402_192)"/>
<path opacity="0.08" d="M156 120H84V156H156V120Z" fill="black"/>
<path opacity="0.08" d="M276 120H204V156H276V120Z" fill="black"/>
<path opacity="0.08" d="M396 120H324V156H396V120Z" fill="black"/>
<path opacity="0.08" d="M516 120H444V156H516V120Z" fill="black"/>
<mask id="mask0_1402_192" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="240">
<path d="M536 0H64C28.6538 0 0 28.6538 0 64V176C0 211.346 28.6538 240 64 240H536C571.346 240 600 211.346 600 176V64C600 28.6538 571.346 0 536 0Z" fill="white"/>
</mask>
<g mask="url(#mask0_1402_192)">
<path d="M558.904 120H41.0959C18.3993 120 0 146.863 0 180C0 213.137 18.3993 240 41.0959 240H558.904C581.601 240 600 213.137 600 180C600 146.863 581.601 120 558.904 120Z" fill="url(#paint4_linear_1402_192)"/>
</g>
<defs>
<linearGradient id="paint0_linear_1402_192" x1="84" y1="84" x2="84" y2="156" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="0.6" stop-color="white"/>
<stop offset="1" stop-color="#E9E9E9"/>
</linearGradient>
<linearGradient id="paint1_linear_1402_192" x1="204" y1="84" x2="204" y2="156" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="0.6" stop-color="white"/>
<stop offset="1" stop-color="#E9E9E9"/>
</linearGradient>
<linearGradient id="paint2_linear_1402_192" x1="324" y1="84" x2="324" y2="156" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="0.6" stop-color="white"/>
<stop offset="1" stop-color="#E9E9E9"/>
</linearGradient>
<linearGradient id="paint3_linear_1402_192" x1="444" y1="84" x2="444" y2="156" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="0.6" stop-color="white"/>
<stop offset="1" stop-color="#E9E9E9"/>
</linearGradient>
<linearGradient id="paint4_linear_1402_192" x1="0" y1="120" x2="0" y2="240" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0"/>
<stop offset="0.2" stop-opacity="0.1"/>
<stop offset="1" stop-opacity="0.55"/>
</linearGradient>
</defs>
</svg>

              </div>
              <div class="welcome-logo welcome-logo-light">
                <svg width="600" height="240" viewBox="0 0 600 240" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M536 0C571.346 0 600 28.6538 600 64V176C600 211.346 571.346 240 536 240H64C28.6538 240 0 211.346 0 176V64C0 28.6538 28.6538 0 64 0H536ZM70 42C54.536 42 42 54.536 42 70V170C42 185.464 54.536 198 70 198H530C545.464 198 558 185.464 558 170V70C558 54.536 545.464 42 530 42H70Z" fill="black"/>
<path d="M154 84H86C84.8954 84 84 84.8954 84 86V154C84 155.105 84.8954 156 86 156H154C155.105 156 156 155.105 156 154V86C156 84.8954 155.105 84 154 84Z" fill="url(#paint0_linear_1402_214)"/>
<path d="M274 84H206C204.895 84 204 84.8954 204 86V154C204 155.105 204.895 156 206 156H274C275.105 156 276 155.105 276 154V86C276 84.8954 275.105 84 274 84Z" fill="url(#paint1_linear_1402_214)"/>
<path d="M394 84H326C324.895 84 324 84.8954 324 86V154C324 155.105 324.895 156 326 156H394C395.105 156 396 155.105 396 154V86C396 84.8954 395.105 84 394 84Z" fill="url(#paint2_linear_1402_214)"/>
<path d="M514 84H446C444.895 84 444 84.8954 444 86V154C444 155.105 444.895 156 446 156H514C515.105 156 516 155.105 516 154V86C516 84.8954 515.105 84 514 84Z" fill="url(#paint3_linear_1402_214)"/>
<path opacity="0.08" d="M156 120H84V156H156V120Z" fill="black"/>
<path opacity="0.08" d="M276 120H204V156H276V120Z" fill="black"/>
<path opacity="0.08" d="M396 120H324V156H396V120Z" fill="black"/>
<path opacity="0.08" d="M516 120H444V156H516V120Z" fill="black"/>
<mask id="mask0_1402_214" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="240">
<path d="M536 0C571.346 0 600 28.6538 600 64V176C600 211.346 571.346 240 536 240H64C28.6538 240 0 211.346 0 176V64C0 28.6538 28.6538 0 64 0H536ZM70 42C54.536 42 42 54.536 42 70V170C42 185.464 54.536 198 70 198H530C545.464 198 558 185.464 558 170V70C558 54.536 545.464 42 530 42H70Z" fill="black"/>
</mask>
<g mask="url(#mask0_1402_214)">
<path d="M558.904 120H41.0959C18.3993 120 0 146.863 0 180C0 213.137 18.3993 240 41.0959 240H558.904C581.601 240 600 213.137 600 180C600 146.863 581.601 120 558.904 120Z" fill="url(#paint4_linear_1402_214)"/>
</g>
<defs>
<linearGradient id="paint0_linear_1402_214" x1="84" y1="84" x2="84" y2="156" gradientUnits="userSpaceOnUse">
<stop/>
<stop offset="0.6"/>
<stop offset="1" stop-color="#888888"/>
</linearGradient>
<linearGradient id="paint1_linear_1402_214" x1="204" y1="84" x2="204" y2="156" gradientUnits="userSpaceOnUse">
<stop/>
<stop offset="0.6"/>
<stop offset="1" stop-color="#888888"/>
</linearGradient>
<linearGradient id="paint2_linear_1402_214" x1="324" y1="84" x2="324" y2="156" gradientUnits="userSpaceOnUse">
<stop/>
<stop offset="0.6"/>
<stop offset="1" stop-color="#888888"/>
</linearGradient>
<linearGradient id="paint3_linear_1402_214" x1="444" y1="84" x2="444" y2="156" gradientUnits="userSpaceOnUse">
<stop/>
<stop offset="0.6"/>
<stop offset="1" stop-color="#888888"/>
</linearGradient>
<linearGradient id="paint4_linear_1402_214" x1="0" y1="120" x2="0" y2="240" gradientUnits="userSpaceOnUse">
<stop stop-opacity="0"/>
<stop offset="0.2" stop-color="#7D7D7D" stop-opacity="0.1"/>
<stop offset="1" stop-color="#777777" stop-opacity="0.55"/>
</linearGradient>
</defs>
</svg>

              </div>
              <h1>SYSTEM</h1>
              <p>What would you like to do?</p>
            </div>
            
            <div class="app-grid">
              <button class="app-icon" data-cmd="take a screenshot">
                <div class="app-icon-img"><span class="app-icon-emoji">📷</span></div>
                <span class="app-icon-label">Screenshot</span>
              </button>
              <button class="app-icon" data-cmd="play music">
                <div class="app-icon-img"><span class="app-icon-emoji">🎵</span></div>
                <span class="app-icon-label">Music</span>
              </button>
              <button class="app-icon" data-cmd="open Safari">
                <div class="app-icon-img"><span class="app-icon-emoji">🌐</span></div>
                <span class="app-icon-label">Safari</span>
              </button>
              <button class="app-icon" data-cmd="what's the volume?">
                <div class="app-icon-img"><span class="app-icon-emoji">🔊</span></div>
                <span class="app-icon-label">Volume</span>
              </button>
              <button class="app-icon" data-cmd="show notifications">
                <div class="app-icon-img"><span class="app-icon-emoji">🔔</span></div>
                <span class="app-icon-label">Notify</span>
              </button>
              <button class="app-icon" data-cmd="what apps are running?">
                <div class="app-icon-img"><span class="app-icon-emoji">📊</span></div>
                <span class="app-icon-label">Activity</span>
              </button>
              <button class="app-icon" data-cmd="search for recent downloads">
                <div class="app-icon-img"><span class="app-icon-emoji">📁</span></div>
                <span class="app-icon-label">Finder</span>
              </button>
              <button class="app-icon" data-cmd="create a new note">
                <div class="app-icon-img"><span class="app-icon-emoji">📝</span></div>
                <span class="app-icon-label">Notes</span>
              </button>
            </div>
            
            <div class="tasks-widget" id="tasks-widget">
              <div class="tasks-widget-header">
                <span class="tasks-widget-title">Scheduled</span>
                <button class="tasks-widget-action" id="tasks-refresh">↻</button>
              </div>
              <div class="tasks-widget-list" id="tasks-widget-list">
                <div class="tasks-widget-empty">No scheduled tasks</div>
              </div>
            </div>
          </div>
        </div>
        <div class="input-area">
          <div class="input-row">
            <span class="input-prompt">></span>
            <textarea id="input" placeholder="Type a command..." rows="1"></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    const API = '/agents/system-agent';
    let token = sessionStorage.getItem('system_token') || '';
    let activeConversationId = null;
    let conversations = [];
    let sidebarCollapsed = localStorage.getItem('sidebar_collapsed') === 'true';
    
    const $ = id => document.getElementById(id);
    const auth = $('auth'), chat = $('chat'), msgs = $('msgs'), input = $('input');
    const welcome = $('welcome'), authErr = $('auth-err');
    const authBtn = $('auth-btn'), tokenInput = $('token');
    const sidebar = $('sidebar'), sidebarOverlay = $('sidebar-overlay');
    const conversationsList = $('conversations-list');
    const themeToggle = $('theme-toggle');
    const sidebarToggle = $('sidebar-toggle');
    const tasksWidgetList = $('tasks-widget-list');

    // Theme
    const savedTheme = localStorage.getItem('system_theme') || 'dark';
    if (savedTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    
    themeToggle.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      if (isLight) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('system_theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('system_theme', 'light');
      }
    });
    
    // Sidebar toggle (works on all screen sizes)
    function updateSidebarState() {
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('collapsed');
      } else {
        sidebar.classList.toggle('collapsed', sidebarCollapsed);
      }
    }
    
    updateSidebarState();
    window.addEventListener('resize', updateSidebarState);
    
    sidebarToggle.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.toggle('visible');
        sidebarOverlay.classList.toggle('visible');
      } else {
        sidebarCollapsed = !sidebarCollapsed;
        localStorage.setItem('sidebar_collapsed', sidebarCollapsed);
        updateSidebarState();
      }
    });
    
    $('sidebar-close').addEventListener('click', closeSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);
    
    function closeSidebar() {
      sidebar.classList.remove('visible');
      sidebarOverlay.classList.remove('visible');
    }

    if (token) verify();

    $('auth-form').addEventListener('submit', tryAuth);
    tokenInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); tryAuth(); }
    });
    
    async function tryAuth() {
      const t = tokenInput.value.trim();
      if (!t) return authErr.textContent = 'Token required';
      
      authBtn.disabled = true;
      authErr.textContent = 'Connecting...';
      
      try {
        const res = await fetch(API + '/conversations', { headers: { Authorization: 'Bearer ' + t } });
        if (res.ok) {
          token = t;
          sessionStorage.setItem('system_token', token);
          showChat();
        } else if (res.status === 401) {
          authErr.textContent = 'Invalid token';
        } else {
          authErr.textContent = 'Connection failed';
        }
      } catch {
        authErr.textContent = 'Connection failed';
      }
      authBtn.disabled = false;
    }

    async function verify() {
      try {
        const res = await fetch(API + '/conversations', { headers: { Authorization: 'Bearer ' + token } });
        if (res.ok) showChat();
        else logout(res.status === 401 ? 'Token expired' : 'Verification failed');
      } catch { logout('Connection failed'); }
    }

    async function showChat() {
      auth.classList.add('hidden');
      chat.classList.remove('hidden');
      setOnline(true);
      input.focus();
      
      await loadConversations();
      await createNewConversation();
      loadTasksWidget();
      
      setTimeout(connectWebSocket, 500);
      
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }

    function setOnline(on) {
      const dot = document.getElementById('status-dot');
      if (dot) {
        dot.classList.toggle('offline', !on);
      }
    }
    
    function logout(message) {
      if (ws) { ws.close(); ws = null; }
      if (wsReconnectTimer) { clearTimeout(wsReconnectTimer); wsReconnectTimer = null; }
      
      sessionStorage.removeItem('system_token');
      token = '';
      activeConversationId = null;
      conversations = [];
      
      chat.classList.add('hidden');
      auth.classList.remove('hidden');
      tokenInput.value = '';
      authErr.textContent = message || '';
      
      resetChatUI();
    }
    
    function resetChatUI() {
      msgs.innerHTML = '';
      msgs.appendChild(createWelcomeElement());
      bindWelcomeCommands();
    }
    
    function createWelcomeElement() {
      const div = document.createElement('div');
      div.className = 'welcome';
      div.id = 'welcome';
      div.innerHTML = \`
        <div class="welcome-header">
          <div class="welcome-logo welcome-logo-dark">
            <svg width="600" height="240" viewBox="0 0 600 240" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M536 0C571.346 0 600 28.6538 600 64V176C600 211.346 571.346 240 536 240H64C28.6538 240 0 211.346 0 176V64C0 28.6538 28.6538 0 64 0H536ZM70 42C54.536 42 42 54.536 42 70V170C42 185.464 54.536 198 70 198H530C545.464 198 558 185.464 558 170V70C558 54.536 545.464 42 530 42H70Z" fill="white"/><path d="M154 84H86C84.8954 84 84 84.8954 84 86V154C84 155.105 84.8954 156 86 156H154C155.105 156 156 155.105 156 154V86C156 84.8954 155.105 84 154 84Z" fill="url(#c1)"/><path d="M274 84H206C204.895 84 204 84.8954 204 86V154C204 155.105 204.895 156 206 156H274C275.105 156 276 155.105 276 154V86C276 84.8954 275.105 84 274 84Z" fill="url(#c2)"/><path d="M394 84H326C324.895 84 324 84.8954 324 86V154C324 155.105 324.895 156 326 156H394C395.105 156 396 155.105 396 154V86C396 84.8954 395.105 84 394 84Z" fill="url(#c3)"/><path d="M514 84H446C444.895 84 444 84.8954 444 86V154C444 155.105 444.895 156 446 156H514C515.105 156 516 155.105 516 154V86C516 84.8954 515.105 84 514 84Z" fill="url(#c4)"/><path opacity="0.08" d="M156 120H84V156H156V120Z" fill="black"/><path opacity="0.08" d="M276 120H204V156H276V120Z" fill="black"/><path opacity="0.08" d="M396 120H324V156H396V120Z" fill="black"/><path opacity="0.08" d="M516 120H444V156H516V120Z" fill="black"/><mask id="mc1" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="240"><path d="M536 0H64C28.6538 0 0 28.6538 0 64V176C0 211.346 28.6538 240 64 240H536C571.346 240 600 211.346 600 176V64C600 28.6538 571.346 0 536 0Z" fill="white"/></mask><g mask="url(#mc1)"><path d="M558.904 120H41.0959C18.3993 120 0 146.863 0 180C0 213.137 18.3993 240 41.0959 240H558.904C581.601 240 600 213.137 600 180C600 146.863 581.601 120 558.904 120Z" fill="url(#c5)"/></g><defs><linearGradient id="c1" x1="84" y1="84" x2="84" y2="156" gradientUnits="userSpaceOnUse"><stop stop-color="white"/><stop offset="0.6" stop-color="white"/><stop offset="1" stop-color="#E9E9E9"/></linearGradient><linearGradient id="c2" x1="204" y1="84" x2="204" y2="156" gradientUnits="userSpaceOnUse"><stop stop-color="white"/><stop offset="0.6" stop-color="white"/><stop offset="1" stop-color="#E9E9E9"/></linearGradient><linearGradient id="c3" x1="324" y1="84" x2="324" y2="156" gradientUnits="userSpaceOnUse"><stop stop-color="white"/><stop offset="0.6" stop-color="white"/><stop offset="1" stop-color="#E9E9E9"/></linearGradient><linearGradient id="c4" x1="444" y1="84" x2="444" y2="156" gradientUnits="userSpaceOnUse"><stop stop-color="white"/><stop offset="0.6" stop-color="white"/><stop offset="1" stop-color="#E9E9E9"/></linearGradient><linearGradient id="c5" x1="0" y1="120" x2="0" y2="240" gradientUnits="userSpaceOnUse"><stop stop-color="white" stop-opacity="0"/><stop offset="0.2" stop-opacity="0.1"/><stop offset="1" stop-opacity="0.55"/></linearGradient></defs></svg>
          </div>
          <div class="welcome-logo welcome-logo-light">
            <svg width="600" height="240" viewBox="0 0 600 240" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M536 0C571.346 0 600 28.6538 600 64V176C600 211.346 571.346 240 536 240H64C28.6538 240 0 211.346 0 176V64C0 28.6538 28.6538 0 64 0H536ZM70 42C54.536 42 42 54.536 42 70V170C42 185.464 54.536 198 70 198H530C545.464 198 558 185.464 558 170V70C558 54.536 545.464 42 530 42H70Z" fill="black"/><path d="M154 84H86C84.8954 84 84 84.8954 84 86V154C84 155.105 84.8954 156 86 156H154C155.105 156 156 155.105 156 154V86C156 84.8954 155.105 84 154 84Z" fill="url(#d1)"/><path d="M274 84H206C204.895 84 204 84.8954 204 86V154C204 155.105 204.895 156 206 156H274C275.105 156 276 155.105 276 154V86C276 84.8954 275.105 84 274 84Z" fill="url(#d2)"/><path d="M394 84H326C324.895 84 324 84.8954 324 86V154C324 155.105 324.895 156 326 156H394C395.105 156 396 155.105 396 154V86C396 84.8954 395.105 84 394 84Z" fill="url(#d3)"/><path d="M514 84H446C444.895 84 444 84.8954 444 86V154C444 155.105 444.895 156 446 156H514C515.105 156 516 155.105 516 154V86C516 84.8954 515.105 84 514 84Z" fill="url(#d4)"/><path opacity="0.08" d="M156 120H84V156H156V120Z" fill="black"/><path opacity="0.08" d="M276 120H204V156H276V120Z" fill="black"/><path opacity="0.08" d="M396 120H324V156H396V120Z" fill="black"/><path opacity="0.08" d="M516 120H444V156H516V120Z" fill="black"/><mask id="md1" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="240"><path d="M536 0C571.346 0 600 28.6538 600 64V176C600 211.346 571.346 240 536 240H64C28.6538 240 0 211.346 0 176V64C0 28.6538 28.6538 0 64 0H536ZM70 42C54.536 42 42 54.536 42 70V170C42 185.464 54.536 198 70 198H530C545.464 198 558 185.464 558 170V70C558 54.536 545.464 42 530 42H70Z" fill="black"/></mask><g mask="url(#md1)"><path d="M558.904 120H41.0959C18.3993 120 0 146.863 0 180C0 213.137 18.3993 240 41.0959 240H558.904C581.601 240 600 213.137 600 180C600 146.863 581.601 120 558.904 120Z" fill="url(#d5)"/></g><defs><linearGradient id="d1" x1="84" y1="84" x2="84" y2="156" gradientUnits="userSpaceOnUse"><stop/><stop offset="0.6"/><stop offset="1" stop-color="#888888"/></linearGradient><linearGradient id="d2" x1="204" y1="84" x2="204" y2="156" gradientUnits="userSpaceOnUse"><stop/><stop offset="0.6"/><stop offset="1" stop-color="#888888"/></linearGradient><linearGradient id="d3" x1="324" y1="84" x2="324" y2="156" gradientUnits="userSpaceOnUse"><stop/><stop offset="0.6"/><stop offset="1" stop-color="#888888"/></linearGradient><linearGradient id="d4" x1="444" y1="84" x2="444" y2="156" gradientUnits="userSpaceOnUse"><stop/><stop offset="0.6"/><stop offset="1" stop-color="#888888"/></linearGradient><linearGradient id="d5" x1="0" y1="120" x2="0" y2="240" gradientUnits="userSpaceOnUse"><stop stop-opacity="0"/><stop offset="0.2" stop-color="#7D7D7D" stop-opacity="0.1"/><stop offset="1" stop-color="#777777" stop-opacity="0.55"/></linearGradient></defs></svg>
          </div>
          <h1>SYSTEM</h1>
          <p>システム</p>
        </div>
        
        <div class="app-grid">
          <button class="app-icon" data-cmd="take a screenshot">
            <div class="app-icon-img"><span class="app-icon-emoji">📷</span></div>
            <span class="app-icon-label">Screenshot</span>
          </button>
          <button class="app-icon" data-cmd="play music">
            <div class="app-icon-img"><span class="app-icon-emoji">🎵</span></div>
            <span class="app-icon-label">Music</span>
          </button>
          <button class="app-icon" data-cmd="open Safari">
            <div class="app-icon-img"><span class="app-icon-emoji">🌐</span></div>
            <span class="app-icon-label">Safari</span>
          </button>
          <button class="app-icon" data-cmd="what's the volume?">
            <div class="app-icon-img"><span class="app-icon-emoji">🔊</span></div>
            <span class="app-icon-label">Volume</span>
          </button>
          <button class="app-icon" data-cmd="show notifications">
            <div class="app-icon-img"><span class="app-icon-emoji">🔔</span></div>
            <span class="app-icon-label">Notify</span>
          </button>
          <button class="app-icon" data-cmd="what apps are running?">
            <div class="app-icon-img"><span class="app-icon-emoji">📊</span></div>
            <span class="app-icon-label">Activity</span>
          </button>
          <button class="app-icon" data-cmd="search for recent downloads">
            <div class="app-icon-img"><span class="app-icon-emoji">📁</span></div>
            <span class="app-icon-label">Finder</span>
          </button>
          <button class="app-icon" data-cmd="create a new note">
            <div class="app-icon-img"><span class="app-icon-emoji">📝</span></div>
            <span class="app-icon-label">Notes</span>
          </button>
        </div>
        
        <div class="tasks-widget" id="tasks-widget">
          <div class="tasks-widget-header">
            <span class="tasks-widget-title">Scheduled</span>
            <button class="tasks-widget-action" id="tasks-refresh">↻</button>
          </div>
          <div class="tasks-widget-list" id="tasks-widget-list">
            <div class="tasks-widget-empty">No scheduled tasks</div>
          </div>
        </div>
      \`;
      return div;
    }
    
    function bindWelcomeCommands() {
      document.querySelectorAll('.app-icon').forEach(btn => {
        btn.addEventListener('click', () => { 
          input.value = btn.dataset.cmd; 
          input.focus();
        });
      });
      
      const tasksRefresh = document.getElementById('tasks-refresh');
      if (tasksRefresh) {
        tasksRefresh.addEventListener('click', loadTasksWidget);
      }
    }
    
    async function loadTasksWidget() {
      const list = document.getElementById('tasks-widget-list');
      if (!list || !token) return;
      
      try {
        const res = await fetch(API + '/schedules', { headers: { Authorization: 'Bearer ' + token } });
        if (!res.ok) throw new Error();
        const data = await res.json();
        
        if (data.schedules?.length > 0) {
          list.innerHTML = data.schedules.slice(0, 4).map(s => 
            '<div class="tasks-widget-item">' +
            '<div class="tasks-widget-icon">⏰</div>' +
            '<div class="tasks-widget-info">' +
            '<div class="tasks-widget-desc">' + esc(s.payload?.description || s.payload?.tool || 'Task') + '</div>' +
            '<div class="tasks-widget-time">' + formatTime(s.time) + '</div>' +
            '</div></div>'
          ).join('');
        } else {
          list.innerHTML = '<div class="tasks-widget-empty">No scheduled tasks</div>';
        }
      } catch {
        list.innerHTML = '<div class="tasks-widget-empty">No scheduled tasks</div>';
      }
    }

    // Conversations
    async function loadConversations() {
      try {
        const res = await fetch(API + '/conversations', { headers: { Authorization: 'Bearer ' + token } });
        if (!res.ok) throw new Error();
        const data = await res.json();
        conversations = data.conversations || [];
        activeConversationId = data.activeId;
        renderConversationsList();
      } catch {
        conversations = [];
        renderConversationsList();
      }
    }
    
    function renderConversationsList() {
      if (conversations.length === 0) {
        conversationsList.innerHTML = '<div class="conversations-empty">No sessions yet</div>';
        return;
      }
      
      conversationsList.innerHTML = conversations.map(c => {
        const isActive = c.id === activeConversationId;
        const timeAgo = formatTimeAgo(c.updatedAt);
        return '<div class="conv-item' + (isActive ? ' active' : '') + '" data-id="' + esc(c.id) + '">' +
          '<div class="conv-title">' + esc(c.title) + '</div>' +
          '<div class="conv-preview">' + esc(c.preview) + '</div>' +
          '<div class="conv-meta">' +
            '<span class="conv-time">' + timeAgo + '</span>' +
            '<button class="conv-delete" data-id="' + esc(c.id) + '">×</button>' +
          '</div>' +
        '</div>';
      }).join('');
      
      conversationsList.querySelectorAll('.conv-item').forEach(item => {
        item.addEventListener('click', (e) => {
          if (e.target.classList.contains('conv-delete')) return;
          switchToConversation(item.dataset.id);
        });
      });
      
      conversationsList.querySelectorAll('.conv-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          deleteConversation(btn.dataset.id);
        });
      });
    }
    
    async function createNewConversation() {
      try {
        const res = await fetch(API + '/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
          body: JSON.stringify({})
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        activeConversationId = data.id;
        await loadConversations();
        resetChatUI();
        closeSidebar();
        input.focus();
      } catch {
        console.error('Failed to create conversation');
      }
    }
    
    async function switchToConversation(convId) {
      if (convId === activeConversationId) {
        closeSidebar();
        return;
      }
      
      try {
        const res = await fetch(API + '/conversations/' + convId + '/activate', {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + token }
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        activeConversationId = data.id;
        
        conversationsList.querySelectorAll('.conv-item').forEach(item => {
          item.classList.toggle('active', item.dataset.id === convId);
        });
        
        renderConversationHistory(data.history || []);
        closeSidebar();
      } catch {
        console.error('Failed to switch conversation');
      }
    }
    
    async function deleteConversation(convId) {
      if (!confirm('Delete this session?')) return;
      
      try {
        const res = await fetch(API + '/conversations/' + convId, {
          method: 'DELETE',
          headers: { Authorization: 'Bearer ' + token }
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        
        if (convId === activeConversationId) {
          activeConversationId = data.activeId;
          if (activeConversationId) {
            await switchToConversation(activeConversationId);
          } else {
            await createNewConversation();
          }
        }
        
        await loadConversations();
      } catch {
        alert('Failed to delete session');
      }
    }
    
    function renderConversationHistory(history) {
      if (history.length === 0) {
        resetChatUI();
        return;
      }
      
      msgs.innerHTML = '';
      
      for (const msg of history) {
        if (typeof msg.content === 'string') {
          addMsg(msg.role === 'user' ? 'user' : 'assistant', msg.content);
        }
      }
      
      msgs.scrollTop = msgs.scrollHeight;
    }
    
    function formatTimeAgo(timestamp) {
      const diff = Date.now() - timestamp;
      const mins = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);
      
      if (mins < 1) return 'now';
      if (mins < 60) return mins + 'm ago';
      if (hours < 24) return hours + 'h ago';
      if (days < 7) return days + 'd ago';
      return new Date(timestamp).toLocaleDateString();
    }

    $('new-chat-btn').addEventListener('click', createNewConversation);
    $('disconnect-btn').addEventListener('click', () => logout());

    // WebSocket
    let ws = null;
    let wsReconnectTimer = null;
    
    function connectWebSocket() {
      if (!token || ws) return;
      
      const wsUrl = API.replace('https://', 'wss://').replace('http://', 'ws://');
      
      try {
        ws = new WebSocket(wsUrl);
        
        ws.onopen = () => {
          setOnline(true);
          ws.send(JSON.stringify({ type: 'auth', token: token }));
        };
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            handleWSMessage(data);
          } catch {}
        };
        
        ws.onclose = () => {
          ws = null;
          if (token) wsReconnectTimer = setTimeout(connectWebSocket, 3000);
        };
        
        ws.onerror = () => { ws = null; };
      } catch {}
    }
    
    function handleWSMessage(data) {
      if (data.type === 'notification') {
        addSystemNotification(data.payload.title || 'Notification', data.payload.message);
      } else if (data.type === 'scheduled_result') {
        addScheduledResult(data.payload);
        loadTasksWidget();
      } else if (data.type === 'chat') {
        addResponse(data.payload);
      } else if (data.type === 'bridge_status') {
        setOnline(data.payload.online);
      }
    }
    
    function addSystemNotification(title, message) {
      const div = document.createElement('div');
      div.className = 'msg system-notification';
      div.innerHTML = '<div class="notification-content"><div class="notification-title">' + esc(title) + '</div><div class="notification-message">' + esc(message) + '</div><div class="notification-time">' + new Date().toLocaleTimeString() + '</div></div>';
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
      
      if (Notification.permission === 'granted') {
        new Notification(title, { body: message });
      }
    }
    
    function addScheduledResult(payload) {
      const div = document.createElement('div');
      div.className = 'msg assistant scheduled';
      let html = '<div class="msg-line"><span class="msg-who">cron</span><span class="msg-text">' + esc(payload.description) + '</span></div>';
      html += '<div class="tool-call"><div class="tool-name">' + esc(payload.tool) + '</div><div class="tool-result ' + (payload.success ? '' : 'error') + '">' + esc(payload.result) + '</div>';
      if (payload.image && payload.image.data) {
        html += '<div class="tool-image"><img src="data:' + (payload.image.mimeType || 'image/png') + ';base64,' + payload.image.data + '" alt="Screenshot" /></div>';
      }
      html += '</div>';
      div.innerHTML = html;
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
    }

    // Chat
    async function send() {
      const text = input.value.trim();
      if (!text) return;
      
      const welcomeEl = $('welcome');
      if (welcomeEl) welcomeEl.remove();
      addMsg('user', text);
      
      input.value = '';
      input.style.height = '22px';
      input.blur();
      
      setTimeout(() => {
        if (window.innerWidth > 768) input.focus();
        msgs.scrollTop = msgs.scrollHeight;
      }, 50);
      
      const typing = addMsg('assistant', '', true);
      
      try {
        const res = await fetch(API + '/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
          body: JSON.stringify({ message: text })
        });
        
        typing.remove();
        
        if (res.ok) {
          const data = await res.json();
          addResponse(data);
          setOnline(true);
          loadConversations();
          loadTasksWidget();
        } else if (res.status === 401) {
          logout('Session expired');
        } else {
          const err = await res.json().catch(() => ({}));
          addMsg('system', err.error || 'Error');
        }
      } catch {
        typing.remove();
        addMsg('system', 'Connection failed');
        setOnline(false);
      }
    }

    function addMsg(type, text, isTyping = false) {
      const div = document.createElement('div');
      div.className = 'msg ' + type + (isTyping ? ' typing' : '');
      const who = type === 'user' ? 'you' : type === 'system' ? 'sys' : '>';
      div.innerHTML = '<div class="msg-line"><span class="msg-who">' + who + '</span><span class="msg-text">' + (type === 'assistant' ? md(text) : esc(text)) + '</span></div>';
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
      return div;
    }

    function addResponse(data) {
      const div = document.createElement('div');
      div.className = 'msg assistant';
      
      let msg = (data.message || '').replace(/^(Done!?|Sure!?)\\s*/i, '').trim();
      let html = '<div class="msg-line"><span class="msg-who">></span><span class="msg-text">' + md(msg) + '</span></div>';
      
      if (data.actions && data.actions.length > 0) {
        for (const action of data.actions) {
          html += '<div class="tool-call"><div class="tool-name">' + esc(action.tool) + '</div><div class="tool-result ' + (action.success ? '' : 'error') + '">' + esc(action.result) + '</div>';
          if (action.image && action.image.data) {
            html += '<div class="tool-image"><img src="data:' + (action.image.mimeType || 'image/png') + ';base64,' + action.image.data + '" alt="Screenshot" /></div>';
          }
          html += '</div>';
        }
      } else if (data.action) {
        html += '<div class="tool-call"><div class="tool-name">' + esc(data.action.tool) + '</div><div class="tool-result ' + (data.action.success ? '' : 'error') + '">' + esc(data.action.result) + '</div>';
        if (data.action.image && data.action.image.data) {
          html += '<div class="tool-image"><img src="data:' + (data.action.image.mimeType || 'image/png') + ';base64,' + data.action.image.data + '" alt="Screenshot" /></div>';
        }
        html += '</div>';
      }
      if (data.scheduled) {
        html += '<div class="scheduled-task"><div class="scheduled-when">Scheduled: ' + esc(data.scheduled.when) + '</div><div>' + esc(data.scheduled.description) + '</div></div>';
      }
      
      div.innerHTML = html;
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
    }

    function esc(s) { return s ? String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') : ''; }
    
    function md(text) {
      if (!text) return '';
      let h = esc(text);
      h = h.replace(/\`\`\`(\\w*)\\n([\\s\\S]*?)\`\`\`/g, '<pre><code>$2</code></pre>');
      h = h.replace(/\`([^\`]+)\`/g, '<code>$1</code>');
      h = h.replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>');
      h = h.replace(/\\*(.+?)\\*/g, '<em>$1</em>');
      h = h.replace(/^- (.+)$/gm, '<li>$1</li>');
      h = h.replace(/\\n/g, '<br>');
      return h;
    }

    input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } });
    input.addEventListener('input', () => { 
      input.style.height = '22px';
      input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    });
    
    input.addEventListener('focus', () => {
      setTimeout(() => msgs.scrollTop = msgs.scrollHeight, 300);
    });

    // Image expand
    const overlay = document.createElement('div');
    overlay.className = 'image-overlay';
    document.body.appendChild(overlay);
    
    msgs.addEventListener('click', e => {
      const img = e.target;
      if (img.tagName === 'IMG' && img.closest('.tool-image')) {
        if (img.classList.contains('fullscreen')) {
          img.classList.remove('fullscreen');
          overlay.classList.remove('active');
        } else {
          img.classList.add('fullscreen');
          overlay.classList.add('active');
        }
      }
    });
    
    overlay.addEventListener('click', () => {
      document.querySelectorAll('.tool-image img.fullscreen').forEach(img => img.classList.remove('fullscreen'));
      overlay.classList.remove('active');
    });

    bindWelcomeCommands();

    function formatTime(t) {
      if (!t) return 'unknown';
      if (typeof t === 'string' && t.includes(' ')) {
        const p = t.split(' ');
        if (p.length === 5 && p[0] === '0' && p[1] !== '*') {
          const h = parseInt(p[1]);
          return 'daily ' + (h % 12 || 12) + (h >= 12 ? 'pm' : 'am');
        }
        return t;
      }
      try { return new Date(t).toLocaleString(); } catch { return t; }
    }
  </script>
</body>
</html>`;

