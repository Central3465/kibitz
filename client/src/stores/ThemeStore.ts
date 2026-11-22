import { create } from "zustand";

import LocalStorageKey from "@/constants/LocalStorageKey";

export type ThemePreference = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

const themeColours: Record<ResolvedTheme, string> = {
    dark: "#14171c",
    light: "#ffffff"
};

const systemQuery = "(prefers-color-scheme: light)";

function readPreference(): ThemePreference {
    try {
        const stored = localStorage.getItem(LocalStorageKey.THEME);

        if (stored == "light" || stored == "dark") return stored;
    } catch {
        // Storage may be unavailable (private mode etc.)
    }

    return "system";
}

function resolveTheme(preference: ThemePreference): ResolvedTheme {
    if (preference != "system") return preference;

    return window.matchMedia(systemQuery).matches ? "light" : "dark";
}

function applyTheme(theme: ResolvedTheme) {
    document.documentElement.dataset.theme = theme;

    document.querySelector("meta[name=theme-color]")
        ?.setAttribute("content", themeColours[theme]);
}

interface ThemeStore {
    preference: ThemePreference;
    theme: ResolvedTheme;

    setPreference: (preference: ThemePreference) => void;
    toggleTheme: () => void;
}

const initialPreference = readPreference();

const useThemeStore = create<ThemeStore>((set, get) => ({
    preference: initialPreference,
    theme: resolveTheme(initialPreference),

    setPreference(preference) {
        try {
            if (preference == "system") {
                localStorage.removeItem(LocalStorageKey.THEME);
            } else {
                localStorage.setItem(LocalStorageKey.THEME, preference);
            }
        } catch {
            // Theme still applies for this page view
        }

        const theme = resolveTheme(preference);
        applyTheme(theme);

        set({ preference, theme });
    },

    toggleTheme() {
        get().setPreference(get().theme == "dark" ? "light" : "dark");
    }
}));

applyTheme(useThemeStore.getState().theme);

// Follow the operating system theme when no preference is set
window.matchMedia(systemQuery).addEventListener("change", () => {
    const { preference } = useThemeStore.getState();
    if (preference != "system") return;

    const theme = resolveTheme(preference);
    applyTheme(theme);

    useThemeStore.setState({ theme });
});

export default useThemeStore;
