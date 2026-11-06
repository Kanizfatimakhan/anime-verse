import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const useDynamicTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [dominantColor, setDominantColor] = useState('rgba(124, 58, 237, 0.15)');

  // Safe no-op to avoid CORS crashes from fast-average-color
  const extractColor = () => {};
  const resetColor = () => {};

  return (
    <ThemeContext.Provider value={{ dominantColor, extractColor, resetColor }}>
      {children}
      <div 
        className="fixed inset-0 pointer-events-none z-[-1]"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${dominantColor} 0%, transparent 70%)`
        }}
      />
    </ThemeContext.Provider>
  );
};
