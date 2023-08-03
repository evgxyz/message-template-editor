/**
 * Context wrapper for common global variables of the application 
 */

import React, { createContext, useContext, useState } from 'react';

type AppEnv = {
  openModalWindows: {[id: string]: boolean};
};

const appEnvDefault: AppEnv = {
  openModalWindows: {}
};

type AppEnvContextValue = [
  AppEnv,
  React.Dispatch<React.SetStateAction<AppEnv>> | null | undefined
];

const appEnvContextValueDefault: AppEnvContextValue = [
  appEnvDefault,
  undefined
]

const AppEnvContext = createContext(appEnvContextValueDefault);

type AppEnvProviderProps = {
  children: React.ReactNode,
}

export function AppEnvProvider({children}: AppEnvProviderProps) {

  const [appEnv, setAppEnv] = useState<AppEnv>(appEnvDefault);

  return (
    <AppEnvContext.Provider value={[appEnv, setAppEnv]}>
      {children}
    </AppEnvContext.Provider>
  )
}

/**
 * Hook for gettibg and setting global variables of the application
 * @returns [appEnv, setAppEnv]
 */
export function useAppEnv(): [
  AppEnv, 
  React.Dispatch<React.SetStateAction<AppEnv>>
] {
  
  const [appEnv, setAppEnv] = useContext<AppEnvContextValue>(AppEnvContext);

  const setAppEnvSafe = function(appEnv: React.SetStateAction<AppEnv>) {
    if (setAppEnv) setAppEnv(appEnv);
  }

  return [ 
    appEnv, 
    setAppEnvSafe 
  ];
}
