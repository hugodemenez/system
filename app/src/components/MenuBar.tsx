import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-shell';

interface MenuBarProps {
  bridgeRunning: boolean;
  tunnelUrl: string | null;
  deployedUrl: string | null;
}

export default function MenuBar({ bridgeRunning, tunnelUrl, deployedUrl }: MenuBarProps) {
  const url = deployedUrl || tunnelUrl || 'http://localhost:8787';
  
  async function handleOpenUI() {
    await open(url);
  }

  async function handleCopyUrl() {
    await navigator.clipboard.writeText(url);
  }

  async function handleViewLogs() {
    await invoke('show_logs');
  }

  async function handlePreferences() {
    await invoke('show_preferences');
  }

  async function handleQuit() {
    await invoke('quit');
  }

  return (
    <div className="menubar">
      <div className="menubar-header">
        <span className="menubar-logo">SYSTEM</span>
        <div className="menubar-status">
          <div className={`status-dot ${bridgeRunning ? 'running' : 'error'}`} />
          <span>{bridgeRunning ? 'Running' : 'Stopped'}</span>
        </div>
      </div>

      {deployedUrl && (
        <div className="menubar-url">{deployedUrl}</div>
      )}

      <div className="menubar-item" onClick={handleOpenUI}>
        <span className="menubar-item-icon">🌐</span>
        <span>Open Web UI</span>
      </div>

      <div className="menubar-item" onClick={handleCopyUrl}>
        <span className="menubar-item-icon">📋</span>
        <span>Copy URL</span>
      </div>

      <div className="menubar-divider" />

      <div className="menubar-item" onClick={handleViewLogs}>
        <span className="menubar-item-icon">📄</span>
        <span>View Logs</span>
      </div>

      <div className="menubar-item" onClick={handlePreferences}>
        <span className="menubar-item-icon">⚙️</span>
        <span>Preferences</span>
      </div>

      <div className="menubar-divider" />

      <div className="menubar-item" onClick={handleQuit}>
        <span className="menubar-item-icon">🚪</span>
        <span>Quit</span>
      </div>
    </div>
  );
}
