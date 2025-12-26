import { Header } from './Header';
import { StatusList } from './StatusList';
import { ProgressBar } from './ProgressBar';
import { UpdateControl } from './UpdateControl';
import { Footer } from './Footer';

export function Panel() {
  return (
    <div class="fixed bottom-4 right-4 z-50 w-64">
      <div class="bg-white/95 backdrop-blur-md rounded-xl panel-style overflow-hidden hover:bg-white">
        <Header />
        
        <div class="p-4 space-y-4">
          <StatusList />
          <ProgressBar />
          <UpdateControl />
        </div>

        <Footer />
      </div>
    </div>
  );
}
