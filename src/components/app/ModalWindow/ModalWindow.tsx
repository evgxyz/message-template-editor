
import React, { useEffect, useId } from 'react';
import { ModalWindowPortal } from './ModalWindowPortal';
import { useAppEnv } from '@/hooks/appEnv';
import css from './ModalWindow.module.scss';

interface ModalWindowProps {
  children: React.ReactNode;
  isOpen: boolean;
  shading?: boolean;
}

export function ModalWindow({
  children,
  isOpen, 
  shading = false
}: ModalWindowProps): JSX.Element {

  const [ , setAppEnv] = useAppEnv();

  const id = useId();

  useEffect(() => {
    setAppEnv(appEnv => {
      const openModalWindows = {...appEnv.openModalWindows};
      if (isOpen) {
        openModalWindows[id] = isOpen
      } else {
        delete openModalWindows[id];
      }
      return {
        ...appEnv, 
        openModalWindows
      }
    });

    return () => {
      setAppEnv(appEnv => {
        const openModalWindows = {...appEnv.openModalWindows};
        delete openModalWindows[id];
        return {
          ...appEnv, 
          openModalWindows
        }
      });
    }
  }, [isOpen]);

  if (!isOpen) return <></>;
  
  return (
    <ModalWindowPortal>
      <div className={[css['overlay'], shading ? css['shading'] : ''].join(' ')}>
        <div className={css['wrapper']}>
          {children}
        </div>
      </div>
    </ModalWindowPortal>
  );
}
