import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

interface OnboardingProps {
  onComplete: (deployedUrl?: string) => void;
}

type Step = 'welcome' | 'permissions' | 'apikey' | 'mode' | 'cloudflare' | 'deploy' | 'complete';

interface Permission {
  id: string;
  name: string;
  description: string;
  granted: boolean;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<Step>('welcome');
  const [permissions, setPermissions] = useState<Permission[]>([
    { id: 'full_disk', name: 'Full Disk Access', description: 'Required to read iMessages', granted: false },
    { id: 'accessibility', name: 'Accessibility', description: 'Required for keyboard/mouse control', granted: false },
    { id: 'contacts', name: 'Contacts', description: 'Required for contact lookup', granted: false },
    { id: 'automation', name: 'Automation', description: 'Required to control apps', granted: false },
  ]);
  const [apiKey, setApiKey] = useState('');
  const [mode, setMode] = useState<'remote' | 'local'>('remote');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null);

  const stepIndex = ['welcome', 'permissions', 'apikey', 'mode', 'deploy', 'complete'].indexOf(step);
  const totalSteps = 5;

  async function checkPermissions() {
    try {
      const results = await invoke<Record<string, boolean>>('check_permissions');
      setPermissions(perms => perms.map(p => ({
        ...p,
        granted: results[p.id] || false,
      })));
    } catch (e) {
      console.error('Failed to check permissions:', e);
    }
  }

  async function requestPermission(permId: string) {
    try {
      await invoke('request_permission', { permission: permId });
      // Re-check after a delay
      setTimeout(checkPermissions, 1000);
    } catch (e) {
      console.error('Failed to request permission:', e);
    }
  }

  async function handleDeploy() {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await invoke<{ success: boolean; url?: string; error?: string }>('deploy', {
        apiKey,
        mode,
      });
      
      if (result.success && result.url) {
        setDeployedUrl(result.url);
        setStep('complete');
      } else {
        setError(result.error || 'Deployment failed');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Deployment failed');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="onboarding">
      <div className="logo">SYSTEM</div>
      <div className="tagline">control your mac from anywhere</div>
      
      <div className="steps">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div 
            key={i} 
            className={`step ${i < stepIndex ? 'completed' : ''} ${i === stepIndex ? 'active' : ''}`} 
          />
        ))}
      </div>

      <div className="content">
        {step === 'welcome' && (
          <>
            <h1 className="title">Welcome to SYSTEM</h1>
            <p className="description">
              Control your Mac from anywhere using AI. Let's get you set up.
            </p>
            <button className="button button-primary" onClick={() => { setStep('permissions'); checkPermissions(); }}>
              Get Started
            </button>
          </>
        )}

        {step === 'permissions' && (
          <>
            <h1 className="title">macOS Permissions</h1>
            <p className="description">
              SYSTEM needs permissions to control your Mac. Click each to grant access.
            </p>
            <div className="permissions">
              {permissions.map(perm => (
                <div 
                  key={perm.id}
                  className={`permission ${perm.granted ? 'granted' : ''}`}
                  onClick={() => !perm.granted && requestPermission(perm.id)}
                >
                  <div className="permission-icon">
                    {perm.granted ? '✓' : ''}
                  </div>
                  <div className="permission-info">
                    <div className="permission-name">{perm.name}</div>
                    <div className="permission-desc">{perm.description}</div>
                  </div>
                </div>
              ))}
            </div>
            <button 
              className="button button-primary" 
              onClick={() => setStep('apikey')}
            >
              Continue
            </button>
          </>
        )}

        {step === 'apikey' && (
          <>
            <h1 className="title">Anthropic API Key</h1>
            <p className="description">
              Enter your Anthropic API key to power the AI assistant.
            </p>
            <div className="input-group">
              <label className="input-label">API Key</label>
              <input 
                type="password"
                className="input"
                placeholder="sk-ant-..."
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
              />
            </div>
            <button 
              className="button button-primary" 
              onClick={() => setStep('mode')}
              disabled={!apiKey.startsWith('sk-ant-')}
            >
              Continue
            </button>
          </>
        )}

        {step === 'mode' && (
          <>
            <h1 className="title">Access Mode</h1>
            <p className="description">
              How do you want to access SYSTEM?
            </p>
            <div className="permissions">
              <div 
                className={`permission ${mode === 'remote' ? 'granted' : ''}`}
                onClick={() => setMode('remote')}
              >
                <div className="permission-icon">
                  {mode === 'remote' ? '✓' : ''}
                </div>
                <div className="permission-info">
                  <div className="permission-name">Remote</div>
                  <div className="permission-desc">Access from anywhere via Cloudflare</div>
                </div>
              </div>
              <div 
                className={`permission ${mode === 'local' ? 'granted' : ''}`}
                onClick={() => setMode('local')}
              >
                <div className="permission-icon">
                  {mode === 'local' ? '✓' : ''}
                </div>
                <div className="permission-info">
                  <div className="permission-name">Local</div>
                  <div className="permission-desc">Access from this computer only</div>
                </div>
              </div>
            </div>
            <button 
              className="button button-primary" 
              onClick={() => setStep('deploy')}
            >
              Continue
            </button>
          </>
        )}

        {step === 'deploy' && (
          <>
            <h1 className="title">{mode === 'remote' ? 'Deploy to Cloudflare' : 'Finalize Setup'}</h1>
            <p className="description">
              {mode === 'remote' 
                ? 'Ready to deploy SYSTEM to Cloudflare Workers.'
                : 'Ready to configure SYSTEM for local access.'
              }
            </p>
            {error && (
              <div className="status" style={{ borderColor: 'var(--error)' }}>
                <div className="status-dot error" />
                <span>{error}</span>
              </div>
            )}
            <button 
              className="button button-primary" 
              onClick={handleDeploy}
              disabled={isLoading}
            >
              {isLoading ? 'Setting up...' : (mode === 'remote' ? 'Deploy' : 'Complete Setup')}
            </button>
          </>
        )}

        {step === 'complete' && (
          <>
            <h1 className="title">Setup Complete!</h1>
            <p className="description">
              SYSTEM is ready. You can access it from the menu bar.
            </p>
            {deployedUrl && (
              <div className="menubar-url">
                {deployedUrl}
              </div>
            )}
            <button 
              className="button button-primary" 
              onClick={() => onComplete(deployedUrl || undefined)}
            >
              Open SYSTEM
            </button>
          </>
        )}
      </div>
    </div>
  );
}
