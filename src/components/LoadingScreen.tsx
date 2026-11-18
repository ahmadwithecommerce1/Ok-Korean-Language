import { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onLoaded?: () => void;
}

export function LoadingScreen({ onLoaded }: LoadingScreenProps) {
  const [mounted, setMounted] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Disappear after 2 seconds with smooth fade-out
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2000);

    // Completely unmount from DOM after the 500ms fade transition finishes (2.5s total)
    const unmountTimer = setTimeout(() => {
      setMounted(false);
      onLoaded?.();
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, [onLoaded]);

  if (!mounted) return null;

  return (
    <div
      id="global-loader"
      className={`fixed inset-0 z-[9999] bg-[#0a0a0a] flex items-center justify-center transition-opacity duration-500 select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <span className="loader"></span>
    </div>
  );
}
