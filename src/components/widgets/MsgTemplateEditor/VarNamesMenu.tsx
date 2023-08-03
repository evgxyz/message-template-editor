
import React, { useState, createRef, useEffect } from 'react';
import { composeRefs } from '@/units/compose-refs';
import css from './VarNamesMenu.module.scss';

interface VarNamesMenuProps {
  arrVarNames: string[] | null | undefined;
  onVarNameInsert: (varNamePatt: string) => void;
  startFocusRef: React.RefObject<HTMLDivElement>
}

export function VarNamesMenu({
  arrVarNames,
  onVarNameInsert,
  startFocusRef
}: VarNamesMenuProps): JSX.Element {

  const [refs, setRefs] = useState<(React.RefObject<HTMLDivElement>)[]>([]);

  useEffect(() => {
    setRefs(refs => 
      (arrVarNames ?? [])
        .map((_idle, index) => refs[index] ?? createRef<HTMLDivElement>())
    );
  }, [arrVarNames?.length]);

  const varNameOnClick = function(varNamePatt: string) {
    onVarNameInsert(varNamePatt);
  }

  const varNameOnKeyDown = function(
    ev: React.KeyboardEvent<HTMLDivElement>,
    varNamePatt: string,
    index: number
  ) {
    if (ev.key === 'ArrowLeft') {
      if (arrVarNames) {
        ev.preventDefault();
        refs[index > 0 ? index - 1 : arrVarNames.length - 1].current?.focus();
      }
    }
    else
    if (ev.key === 'ArrowRight') {
      if (arrVarNames) {
        ev.preventDefault();
        refs[index < arrVarNames.length - 1 ? index + 1 : 0].current?.focus();
      }
    }
    else
    if (ev.key === 'Enter') {
      ev.preventDefault();
      onVarNameInsert(varNamePatt);
    }
  }

  return (
    <div className={css['body']}>
      { 
        (arrVarNames ?? []).map((varName, index) => {
          const varNamePatt = `{${varName}}`;
          return (
            <div 
              tabIndex={0}
              key={varName} 
              ref={index == 0 ? composeRefs(startFocusRef, refs[index]) : refs[index]}
              className={css['var-name']}
              onClick={() => varNameOnClick(varNamePatt)}
              onKeyDown={ev => varNameOnKeyDown(ev, varNamePatt, index)}
            >
              {varNamePatt}
            </div>
          )
        })
      }
    </div>
  );
}
