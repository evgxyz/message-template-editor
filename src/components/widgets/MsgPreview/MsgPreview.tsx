
import React, { useEffect, useState } from 'react';
import { MsgTemplate, VarValues, generateMsg } from '@/units/msg-template';
import { InputTextLabeled } from '@/components/common/InputTextLabeled';
import { useFocusLoop } from '@/hooks/focusLoop';
import css from './MsgPreview.module.scss';

interface MsgPreviewProps {
  arrVarNames: string[] | null | undefined;
  template: MsgTemplate | null | undefined;
  onClose: () => void;
}

export function MsgPreview({
  arrVarNames,
  template,
  onClose
}: MsgPreviewProps): JSX.Element {
//
  const [values, setValues] = useState<VarValues>(
    () => Object.fromEntries(
      (arrVarNames ?? []).map(varName => [varName, ''])
    )
  );

  const varValueOnChangeHandler = function(
    ev: React.ChangeEvent<HTMLInputElement>, 
    varName: string
  ) {
    setValues(values => ({
      ...values,
      [varName]: ev.target.value
    }));
  }

  const [
    focusLoopStartRef, focusLoopStartOnKeyDown, 
    focusLoopEndRef, focusLoopEndOnKeyDown
  ] = useFocusLoop<HTMLInputElement, HTMLButtonElement>();

  useEffect(() => {
    focusLoopStartRef.current?.focus()
  }, []);

  return (
    <div className={css['body']}>
      <div className={css['header']}>
        <div className={css['title']}>
          Message Preview
        </div>
      </div>

      <div className={css['scroll-area']}>
        <div className={css['content']}>
          <div className={css['message']}>
            { generateMsg(template, values) }
          </div>
        </div>
      </div>

      <div className={css['footer']}>
        <div className={css['var-panel']}>
          {
            Object.entries(values).map(([varName, varValue], index) => 
              <InputTextLabeled 
                key={varName}
                ref={index == 0 ? focusLoopStartRef : undefined}
                label={`{${varName}}`} 
                value={varValue}
                onChange={ev => varValueOnChangeHandler(ev, varName)}
                onKeyDown={index == 0 ? focusLoopStartOnKeyDown : undefined}
              />
            )
          }
        </div>

        <div className={css['btn-menu']}>
          <button 
            ref={focusLoopEndRef} 
            onKeyDown={focusLoopEndOnKeyDown}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
