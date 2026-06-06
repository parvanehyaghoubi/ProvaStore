import { createContext, useContext, useReducer, useEffect } from 'react';

// ─── Initial State ─────────────────────────────────────────────────────────────
const initialState = {
    theme: localStorage.getItem('theme') || 'light',       // 'light' | 'dark'
    viewMode: localStorage.getItem('viewMode') || 'grid',  // 'grid' | 'list'
    selectedCategory: 'all',
    searchQuery: '',
    sortBy: 'default',                                      // 'default' | 'price-asc' | 'price-desc' | 'name'
};

// ─── Action Types ──────────────────────────────────────────────────────────────
export const APP_ACTIONS = {
    TOGGLE_THEME: 'TOGGLE_THEME',
    SET_VIEW_MODE: 'SET_VIEW_MODE',
    SET_CATEGORY: 'SET_CATEGORY',
    SET_SEARCH: 'SET_SEARCH',
    SET_SORT: 'SET_SORT',
};

// ─── Reducer ───────────────────────────────────────────────────────────────────
function appReducer(state, action) {
    switch (action.type) {
        case APP_ACTIONS.TOGGLE_THEME:
            return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };

        case APP_ACTIONS.SET_VIEW_MODE:
            return { ...state, viewMode: action.payload };

        case APP_ACTIONS.SET_CATEGORY:
            return { ...state, selectedCategory: action.payload };

        case APP_ACTIONS.SET_SEARCH:
            return { ...state, searchQuery: action.payload };

        case APP_ACTIONS.SET_SORT:
            return { ...state, sortBy: action.payload };

        default:
            return state;
    }
}

// ─── Context ───────────────────────────────────────────────────────────────────
const AppContext = createContext(null);

// ─── Provider ──────────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    // Sync theme to <html> class and localStorage
    useEffect(() => {
        const root = document.documentElement;
        if (state.theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', state.theme);
    }, [state.theme]);

    // Persist viewMode
    useEffect(() => {
        localStorage.setItem('viewMode', state.viewMode);
    }, [state.viewMode]);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
}

// ─── Custom Hook ───────────────────────────────────────────────────────────────
export function useAppContext() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within AppProvider');
    }
    return context;
}
