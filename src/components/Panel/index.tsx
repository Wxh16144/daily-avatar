import { Header } from './Header';
import { StatusList } from './StatusList';
import { ProgressBar } from './ProgressBar';
import { UpdateControl } from './UpdateControl';
import { Footer } from './Footer';

export function Panel() {
  return (
    <div class="fixed bottom-4 right-4 z-50 w-80">
      <div class="bg-white backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden">
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
