
import React from 'react';
import ReactDOM from 'react-dom';

interface ModalWindowPortalProps {
  children: React.ReactNode;
}

const modalWindowPortal = 
  document.getElementById('modal-window-root') as HTMLElement;

export function ModalWindowPortal({children}: ModalWindowPortalProps) {
  return (
    ReactDOM.createPortal(children, modalWindowPortal)
  );
}
