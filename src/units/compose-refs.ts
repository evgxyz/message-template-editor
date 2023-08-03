
import { RefCallback, MutableRefObject } from 'react';

type MutableRefArr<T> = Array<RefCallback<T> | MutableRefObject<T> | null | undefined>;

export function composeRefs<T>(...refs: MutableRefArr<T>): RefCallback<T> {
  return (val: T) => {
    for (let ref of refs) {
      if (typeof ref === 'function') {
        ref(val);
      } 
      else 
      if (ref) {
        ref.current = val;
      }
    };
  };
}
