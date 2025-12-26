import { Header } from './Header';
import { StatusList } from './StatusList';
import { ProgressBar } from './ProgressBar';
import { UpdateControl } from './UpdateControl';
import { Footer } from './Footer';

export function Panel() {
  return (
    <div class="fixed bottom-4 right-4 z-50 w-80" style={{ position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 2147483647, width: '20rem' }}>
      <div 
        class="daily-avatar-panel bg-white/98 backdrop-blur-sm rounded-xl border-2 border-gray-300 overflow-hidden"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: '0.75rem',
          border: '2px solid #d1d5db',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}
      >
        <Header />
        
        <div class="p-4 space-y-3">
          <StatusList />
          <ProgressBar />
          <UpdateControl />
        </div>

        <Footer />
      </div>
    </div>
  );
}
