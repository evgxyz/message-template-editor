
import React, { useRef } from 'react';

type FocusElement = 
  HTMLDivElement | 
  HTMLButtonElement | 
  HTMLInputElement | 
  HTMLTextAreaElement |
  HTMLSelectElement;

/**
 * Hook for looping focus in a certain area
 * @returns [focusLoopStartRef, focusLoopStartOnKeyDown, focusLoopEndRef, focusLoopEndOnKeyDown]
 */
export function useFocusLoop<
  Element1 extends FocusElement, 
  Element2 extends FocusElement
>(): [
  React.RefObject<Element1>, 
  (ev: React.KeyboardEvent<Element1>) => void,
  React.RefObject<Element2>,
  (ev: React.KeyboardEvent<Element2>) => void
] {
  const focusLoopStartRef = useRef<Element1>(null);
  const focusLoopEndRef = useRef<Element2>(null);

  const focusLoopStartOnKeyDown = function(ev: React.KeyboardEvent<Element1>) {
    if (ev.key === 'Tab' && ev.shiftKey) {
      if (focusLoopEndRef.current) {
        ev.preventDefault();
        focusLoopEndRef.current.focus();
      }
    }
  }

  const focusLoopEndOnKeyDown = function(ev: React.KeyboardEvent<Element2>) {
    if (ev.key === 'Tab' && !ev.shiftKey) {
      if (focusLoopStartRef.current) {
        ev.preventDefault();
        focusLoopStartRef.current.focus();
      }
    }
  }

  return [
    focusLoopStartRef,
    focusLoopStartOnKeyDown,
    focusLoopEndRef,
    focusLoopEndOnKeyDown
  ]
}
