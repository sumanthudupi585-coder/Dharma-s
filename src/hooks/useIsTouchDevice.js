import { useEffect, useState } from 'react';

export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const onTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
    setIsTouch(!!onTouch);
  }, []);
  return isTouch;
}
