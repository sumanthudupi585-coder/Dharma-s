import React, { useEffect } from 'react';

export default function SwipeNavigator({ containerRef, onPrev, onNext, threshold = 60, verticalTolerance = 40 }) {
  useEffect(() => {
    const el = containerRef?.current || document;
    let startX = 0;
    let startY = 0;
    let tracking = false;

    const onTouchStart = (e) => {
      const t = e.touches ? e.touches[0] : e;
      startX = t.clientX;
      startY = t.clientY;
      tracking = true;
    };
    const onTouchMove = (e) => {
      if (!tracking) return;
      const t = e.touches ? e.touches[0] : e;
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (Math.abs(dy) > verticalTolerance) {
        tracking = false; // vertical scroll; cancel
      }
      if (Math.abs(dx) > threshold) {
        tracking = false;
        if (dx < 0) onNext && onNext(); else onPrev && onPrev();
      }
    };
    const onTouchEnd = () => { tracking = false; };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });

    // Pointer events for desktop trackpads
    el.addEventListener('pointerdown', onTouchStart, { passive: true });
    el.addEventListener('pointermove', onTouchMove, { passive: true });
    el.addEventListener('pointerup', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('pointerdown', onTouchStart);
      el.removeEventListener('pointermove', onTouchMove);
      el.removeEventListener('pointerup', onTouchEnd);
    };
  }, [containerRef, onPrev, onNext, threshold, verticalTolerance]);

  return null;
}
