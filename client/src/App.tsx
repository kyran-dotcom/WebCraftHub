import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { HelmetProvider } from 'react-helmet-async';
import { queryClient } from './lib/queryClient';
import Layout from './components/Layout';
import Home from './pages/Home';
import { ThemeProvider } from './components/ui/theme-provider';

// Lazy load game components
const IncrementalGame = lazy(() => import('./pages/IncrementalGame'));
const ChessGame = lazy(() => import('./pages/ChessGame'));
const DrivingGame = lazy(() => import('./pages/DrivingGame'));
const NotFound = lazy(() => import('./pages/not-found'));

// Fallback loading component
const Loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <ThemeProvider defaultTheme="dark" storageKey="mathsk-theme">
          <Router>
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="games/incremental" element={<IncrementalGame />} />
                  <Route path="games/chess" element={<ChessGame />} />
                  <Route path="games/driving" element={<DrivingGame />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Suspense>
          </Router>
          <Toaster position="top-right" />
        </ThemeProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
