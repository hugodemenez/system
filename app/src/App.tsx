import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import Onboarding from './components/Onboarding';
import MenuBar from './components/MenuBar';

type AppMode = 'onboarding' | 'menubar';

interface AppState {
  mode: AppMode;
  configured: boolean;
  bridgeRunning: boolean;
  tunnelUrl: string | null;
  deployedUrl: string | null;
}

function App() {
  const [state, setState] = useState<AppState>({
    mode: 'onboarding',
    configured: false,
    bridgeRunning: false,
    tunnelUrl: null,
    deployedUrl: null,
  });

  useEffect(() => {
    // Check if already configured
    checkConfig();
  }, []);

  async function checkConfig() {
    try {
      const config = await invoke<{ configured: boolean; deployedUrl?: string }>('check_config');
      if (config.configured) {
        setState(s => ({ 
          ...s, 
          mode: 'menubar', 
          configured: true,
          deployedUrl: config.deployedUrl || null,
        }));
      }
    } catch (e) {
      console.error('Failed to check config:', e);
    }
  }

  function handleOnboardingComplete(deployedUrl?: string) {
    setState(s => ({ 
      ...s, 
      mode: 'menubar', 
      configured: true,
      deployedUrl: deployedUrl || null,
    }));
  }

  if (state.mode === 'onboarding') {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <MenuBar 
      bridgeRunning={state.bridgeRunning}
      tunnelUrl={state.tunnelUrl}
      deployedUrl={state.deployedUrl}
    />
  );
}

export default App;
