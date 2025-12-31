import { useStore } from '@/store';
import { Panel } from '@/components/Panel';
import { Settings } from '@/components/Settings';
import { DataRefresher } from '@/components/DataRefresher';
import { AvatarTrigger } from '@/components/Trigger/AvatarTrigger';
import { NotificationList } from '@/components/Notification';
import { AvatarAutoUpdater } from './components/AvatarAutoUpdater';

export function App() {
  const { ui: { showSettings, showPanel } } = useStore();

  function render() {
    if (showSettings) return <Settings />;
    if (showPanel) return <Panel />;

    return <AvatarTrigger />;
  }

  return (
    <>
      <DataRefresher />
      <AvatarAutoUpdater />
      <NotificationList />
      {render()}
    </>
  );
}