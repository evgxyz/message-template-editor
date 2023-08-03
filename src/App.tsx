
import React, { useEffect } from 'react';
import { useAppEnv } from './hooks/appEnv';
import { MainPage } from '@/components/pages/MainPage';
import '@/styles/global.scss';

export default function App(): JSX.Element {

  const [appEnv, ] = useAppEnv();

  useEffect(() => {
    const numOpenModalWindows = Object.keys(appEnv.openModalWindows).length;
    document.body.style.overflow = numOpenModalWindows > 0 ? 'hidden' : 'auto';
    //console.log('openModalWindows:', appEnv.openModalWindows);
  }, [appEnv.openModalWindows]);

  return (
    <MainPage />
  );
}
