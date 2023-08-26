//@flow
import { useEffect, useRef, useState } from 'react';

const useWindowSize = (): {
  isMobile: boolean,
  isSmallMobile: boolean,
  size: number
} => {
  const ref = useRef<TimeoutID | null>(null);
  const [windowSize, setWindowSize] = useState<number>(() => window.screen.width);

  const eventHandler = () => {
    if (ref.current) clearTimeout(ref.current);
    ref.current = setTimeout(() => {
      setWindowSize(window.screen.width);
    }, 100);
  };

  useEffect(() => {
    window.addEventListener('resize', eventHandler);
    return () => window.removeEventListener('resize', eventHandler);
  }, []);

  return {
    size: windowSize,
    isMobile: windowSize < 1024,
    isSmallMobile: windowSize < 375
  };
};

export default useWindowSize;
