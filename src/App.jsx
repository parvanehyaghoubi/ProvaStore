import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { store } from './store/store';
import { AppProvider } from './context/AppContext';

import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/HomePage';
import CartPage from './components/Cart/CartPage';
import ProductDetails from './components/ProductDetails/ProductDetails';
import SettingsPage from './components/Settings/SettingsPage';

// ─── React Query Client ────────────────────────────────────────────────────────
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 2,
            staleTime: 5 * 60 * 1000, // 5 min
        },
    },
});

export default function App() {
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <AppProvider>
                    <BrowserRouter>
                        <div className="min-h-screen bg-amber-50 dark:bg-gray-950 transition-colors duration-300">
                            <Navbar />

                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/cart" element={<CartPage />} />
                                <Route path="/product/:id" element={<ProductDetails />} />
                                <Route path="/settings" element={<SettingsPage />} />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </div>

                        {/* Toast notifications */}
                        <Toaster
                            position="bottom-right"
                            toastOptions={{
                                className: '',
                                style: {
                                    background: 'var(--toast-bg, #fff)',
                                    color: 'var(--toast-color, #1f2937)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(0,0,0,0.06)',
                                    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                                    fontSize: '14px',
                                    fontFamily: '"DM Sans", sans-serif',
                                },
                                success: {
                                    iconTheme: { primary: '#f1701e', secondary: '#fff' },
                                },
                            }}
                        />
                    </BrowserRouter>
                </AppProvider>
            </QueryClientProvider>
        </Provider>
    );
}

function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in">
            <span className="text-8xl mb-6">404</span>
            <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Page not found
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
                The page you're looking for doesn't exist.
            </p>
            <a href="/" className="btn-primary px-8 py-3 font-semibold">
                Go Home
            </a>
        </div>
    );
}
