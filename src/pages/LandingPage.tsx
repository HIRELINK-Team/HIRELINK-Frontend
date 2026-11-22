import { useEffect, useRef, useState } from 'react';

/** Hosts the standalone landing without leaking its styles into the service. */
export default function LandingPage() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [source] = useState(() => `/landing/index.html${window.location.hash}`);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    let removeFrameListener = () => {};
    const handleLoad = () => {
      removeFrameListener();
      const frameWindow = frame.contentWindow;
      if (!frameWindow) return;
      const handleFrameHashChange = () => {
        if (window.location.hash !== frameWindow.location.hash) {
          window.history.pushState(null, '', `/${frameWindow.location.hash}`);
        }
      };
      frameWindow.addEventListener('hashchange', handleFrameHashChange);
      removeFrameListener = () =>
        frameWindow.removeEventListener('hashchange', handleFrameHashChange);
    };
    const handleHistoryChange = () => {
      const frameWindow = frame.contentWindow;
      if (frameWindow && frameWindow.location.hash !== window.location.hash) {
        frameWindow.location.hash = window.location.hash || '#home';
      }
    };
    frame.addEventListener('load', handleLoad);
    window.addEventListener('popstate', handleHistoryChange);
    window.addEventListener('hashchange', handleHistoryChange);
    return () => {
      removeFrameListener();
      frame.removeEventListener('load', handleLoad);
      window.removeEventListener('popstate', handleHistoryChange);
      window.removeEventListener('hashchange', handleHistoryChange);
    };
  }, []);

  return (
    <iframe
      ref={frameRef}
      title="HIRELINK 서비스 소개"
      src={source}
      className="block h-dvh w-full border-0"
    />
  );
}
