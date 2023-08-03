
import React, { useState } from 'react';
import { ModalWindow } from '@/components/app/ModalWindow';
import { MsgTemplateEditor } from '@/components/widgets/MsgTemplateEditor';
import { mockMsgTemplateJSON } from '@/mock-data';
import css from './MainPage.module.scss';

export function MainPage(): JSX.Element {
  
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [ , setRerender] = useState<number>(0);

  const editorOpenOnClick = function() {
    setIsEditorOpen(isEditorOpen => !isEditorOpen);
  }

  const editorOnClose = function() {
    setIsEditorOpen(false);
  }

  const editorOnSave = function(templateJSON: string) {
    localStorage.template = templateJSON;
  }

  const resetToDefaultOnClick = function() {
    localStorage.template = mockMsgTemplateJSON;
    setRerender(x => ++x);
  }

  return (
    <div className={css['body']}>
      <h1 className={css['title']}>
        Message Template Editor demo-page
      </h1>

      <div className={css['content']}>
        <div className={css['btn-box']}>
          <button onClick={editorOpenOnClick}>
            Open Message Template Editor
          </button>
       
          <button onClick={resetToDefaultOnClick}>
            Reset localStorage.template to default mock
          </button>
        </div>

        <div>
          localStorage.template:
          <pre style={{color: 'blue'}}>
            { JSON.stringify(getTemplateFromStorage(), null, 2) }
          </pre>
        </div>

        <ModalWindow isOpen={isEditorOpen} shading={true}>
          <MsgTemplateEditor 
            arrVarNames={getArrVarNamesFromStorage()}
            template={getTemplateFromStorage()}
            onSave={editorOnSave}
            onClose={editorOnClose}
          />
        </ModalWindow>
      </div>
    </div>
  );
}

const getArrVarNamesFromStorage = function() {
  return (
    localStorage.arrVarNames
    ? JSON.parse(localStorage.arrVarNames) 
    : ['firstname', 'lastname', 'company', 'position']
  );
}

const getTemplateFromStorage = function() {
  return (
    localStorage.template ? JSON.parse(localStorage.template) : null
  );
}
