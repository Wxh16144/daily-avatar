import { render, useState, useEffect } from 'react';
import type { BaseConfigManager } from '@/lib/configManager/Base';

import { Panel } from '@/components/Panel';
import { Settings } from '@/components/Settings';

interface AppProps {
  configManager: BaseConfigManager
}

export function App({ configManager }: AppProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showPanel, setShowPanel] = useState(true);

  if (!showPanel) {
    return (
      <div class="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowPanel(true)}
          class="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg transition duration-200"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
      </div>
    );
  }

  if (showSettings) {
    return (
      <Settings
        configManager={configManager}
        onClose={() => setShowSettings(false)}
      />
    );
  }

  return (
    <Panel
      configManager={configManager}
      onSettingsClick={() => setShowSettings(true)}
      onClose={() => setShowPanel(false)}
    />
  )
}