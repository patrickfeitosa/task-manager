// Framework-free so both the Server Component layout (inlines the script) and the client
// `useTheme` hook (reads/writes the same key) can import it.
export const THEME_STORAGE_KEY = 'theme';

// Runs before first paint so there is no flash of the wrong theme. A saved choice wins,
// otherwise the OS preference.
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(!t){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.classList.toggle('dark',t==='dark')}catch(e){}})()`;
