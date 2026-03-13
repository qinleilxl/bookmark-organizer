import { createContext, useContext, useState, useEffect } from "react";

const LocaleContext = createContext();

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState("zh");

  useEffect(() => {
    (async () => {
      const result = await chrome.storage.local.get(["locale"]);
      if (result.locale) {
        setLocale(result.locale);
      } else {
        // Try to detect from browser language
        const browserLang = navigator.language?.toLowerCase() || "";
        const detected = browserLang.startsWith("zh") ? "zh" : "en";
        setLocale(detected);
        await chrome.storage.local.set({ locale: detected });
      }
    })();
  }, []);

  const changeLocale = async (newLocale) => {
    setLocale(newLocale);
    await chrome.storage.local.set({ locale: newLocale });
  };

  return (
    <LocaleContext.Provider value={{ locale, changeLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
