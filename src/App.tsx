import React, { Suspense, lazy } from 'react';
import { useAppState, useAppDispatch, AppProvider } from './context/AppContext';
import { setTab } from './context/actions';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Sliders, 
  TrendingDown, 
  BookOpen, 
  Leaf 
} from 'lucide-react';
import type { TabId } from './types';

// Lazy load heavy components for optimized chunk splitting
const Dashboard = lazy(() => import('./components/Dashboard').then(module => ({ default: module.Dashboard })));
const Tracker = lazy(() => import('./components/Tracker').then(module => ({ default: module.Tracker })));
const Simulator = lazy(() => import('./components/Simulator').then(module => ({ default: module.Simulator })));
const RankingEngine = lazy(() => import('./components/RankingEngine').then(module => ({ default: module.RankingEngine })));
const Methodology = lazy(() => import('./components/Methodology').then(module => ({ default: module.Methodology })));

const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[300px] w-full">
    <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-500 border-t-transparent" />
    <span className="text-gray-400 text-xs mt-4 tracking-wider">Loading view...</span>
  </div>
);

export const AppContent: React.FC = () => {
  const { currentTab } = useAppState();
  const dispatch = useAppDispatch();

  const handleTabChange = (tabName: TabId) => {
    dispatch(setTab(tabName));
  };

  const navItems: ReadonlyArray<{ id: TabId; label: string; icon: typeof LayoutDashboard }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tracker', label: 'Tracker', icon: PlusCircle },
    { id: 'simulator', label: 'Simulator', icon: Sliders },
    { id: 'recs', label: 'Priorities', icon: TrendingDown },
    { id: 'methodology', label: 'Methodology', icon: BookOpen }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-tr from-darkbg-950 via-darkbg-900 to-darkbg-950 text-gray-100 flex flex-col font-sans antialiased selection:bg-emerald-500/20 selection:text-emerald-300">
      
      {/* Skip to main content link for screenreaders */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-emerald-500 text-darkbg-950 px-4 py-2 rounded-lg font-bold z-50 focus:ring-2 focus:ring-emerald-400"
      >
        Skip to main content
      </a>

      {/* Global Breathtaking Header */}
      <header className="sticky top-0 z-40 w-full bg-darkbg-950/80 backdrop-blur-md border-b border-darkbg-700/35 shadow-glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleTabChange('dashboard')}>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight font-sans text-gray-150 flex items-center gap-1">
                Carbon Future <span className="text-emerald-400 font-semibold">Simulator</span>
              </h1>
              <p className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold mt-0.5">Offline Footprint twin</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isSelected = currentTab === item.id || (item.id === 'recs' && currentTab === 'recs');
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.08)]'
                      : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-darkbg-800/40'
                  }`}
                  aria-current={isSelected ? 'page' : undefined}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content" className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 focus:outline-none">
        <Suspense fallback={<LoadingFallback />}>
          {currentTab === 'dashboard' && <Dashboard />}
          {currentTab === 'tracker' && <Tracker />}
          {currentTab === 'simulator' && <Simulator />}
          {currentTab === 'recs' && <RankingEngine />}
          {currentTab === 'methodology' && <Methodology />}
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="w-full bg-darkbg-950/40 border-t border-darkbg-700/20 py-5 text-center text-xxs text-gray-500 tracking-wide font-sans">
        <p>© 2026 Carbon Future Simulator. Built for offline-first privacy. No user tracking or cloud synchronization.</p>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
