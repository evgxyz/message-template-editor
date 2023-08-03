
import React, { useEffect, useState, useRef } from 'react';
import { ModalWindow } from '@/components/app/ModalWindow';
import { 
  MsgTemplateRaw, MsgTemplate, MsgTemplateNode,
  msgTemplatefirstTextNodeId,
  msgTemplateFromRaw, 
  msgTemplateChangeText, msgTemplateInsertStr,
  msgTemplateInsertIfNode, msgTemplateDeleteIfNode, msgTemplateStringify  
} from '@/units/msg-template';
import { VarNamesMenu } from './VarNamesMenu';
import { MsgTemplateArea } from './MsgTemplateArea';
import { useFocusLoop } from '@/hooks/focusLoop';
import { MsgPreview } from '@/components/widgets/MsgPreview';
import css from './MsgTemplateEditor.module.scss';

/* The message template editor component */

interface MsgTemplateEditorProps {
  arrVarNames: string[] | null | undefined;
  template: MsgTemplateRaw | null | undefined;
  onSave: (templateJSON: string) => void;
  onClose: () => void;
}

type CursorPos = {
  nodeId: string;
  caretPos: number;
}

const initCursorPos: CursorPos = {
  nodeId: msgTemplatefirstTextNodeId,
  caretPos: 0
};

type FocusPos = {
  nodeId: string;
  caretPos: number;
}

const initFocusPos: FocusPos = {
  nodeId: msgTemplatefirstTextNodeId,
  caretPos: 0
}

type TemplateEditor = {
  template: MsgTemplate;
  cursorPos: CursorPos;
  focusPos: FocusPos;
}

/** 
 * The message template editor component
 */
export function MsgTemplateEditor({
  arrVarNames,
  template,
  onSave,
  onClose,
}: MsgTemplateEditorProps): JSX.Element {
//
  const [templateEditor, setTemplateEditor] = 
    useState<TemplateEditor>(() => ({
      template: msgTemplateFromRaw(template ??= []),
      cursorPos: structuredClone(initCursorPos),
      focusPos: structuredClone(initFocusPos)
    }));

  const focusNodeRef = useRef<HTMLTextAreaElement>(null);

  const varNamesMenuStatFocusRef = useRef<HTMLDivElement>(null);

  const [
    focusLoopStartRef, focusLoopStartOnKeyDown, 
    focusLoopEndRef, focusLoopEndOnKeyDown
  ] = useFocusLoop<HTMLButtonElement, HTMLButtonElement>();

  const [isModified, setIsModified] = useState<boolean>(false);

  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  useEffect(() => {
    if (focusNodeRef.current) {
      focusNodeRef.current.focus();
      focusNodeRef.current.selectionStart = templateEditor.focusPos.caretPos;
      focusNodeRef.current.selectionEnd = templateEditor.focusPos.caretPos;
    }
  }, [templateEditor.focusPos]);

  const onCursorUpdate = function(
    nodeId: string, 
    caretPos: number
  ) {
    setTemplateEditor(templateEditor => ({
      ...templateEditor,
      cursorPos: {
        nodeId,
        caretPos
      }
    }));
  }

  const onVarNameInsert = function(varNamePatt: string) {
    setTemplateEditor(templateEditor => {
      const template = msgTemplateInsertStr(
        templateEditor.template, 
        templateEditor.cursorPos.nodeId, 
        templateEditor.cursorPos.caretPos,
        varNamePatt
      );

      const cursorPos: CursorPos = {
        ...templateEditor.cursorPos,
        caretPos: templateEditor.cursorPos.caretPos + varNamePatt.length
      }

      const focusPos: FocusPos = {
        nodeId: templateEditor.cursorPos.nodeId, 
        caretPos: cursorPos.caretPos
      }

      return {
        template,
        cursorPos,
        focusPos
      };
    });

    setIsModified(true);
  }

  const onTextChange = function(nodeId: string, caretPos: number, text: string) {
    setTemplateEditor(templateEditor => ({
      ...templateEditor,
      template: msgTemplateChangeText(templateEditor.template, nodeId, text),
      cursorPos: {
        nodeId,
        caretPos
      }
    }));

    setIsModified(true);
  }

  const onIfNodeInsert = function() {
    setTemplateEditor(templateEditor => {
      const insertIfNodeResult = 
        msgTemplateInsertIfNode(
          templateEditor.template, 
          templateEditor.cursorPos.nodeId, 
          templateEditor.cursorPos.caretPos
        );

      if (insertIfNodeResult === false) {
        return templateEditor;
      }

      const {template} = insertIfNodeResult;

      return {
        ...templateEditor,
        template
      };
    });

    setIsModified(true);
  }

  const onIfNodeDelete = function(nodeId: string) {
    setTemplateEditor(templateEditor => {
      const deleteIfNodeResult = 
        msgTemplateDeleteIfNode(templateEditor.template, nodeId);

      if (deleteIfNodeResult === false) {
        return templateEditor;
      }

      const {template, activeNodeId, activeCaretPos} = deleteIfNodeResult;
      
      const cursorPos: CursorPos = {
        nodeId: activeNodeId,
        caretPos: activeCaretPos
      }

      const focusPos: FocusPos = {
        nodeId: activeNodeId, 
        caretPos: activeCaretPos
      }

      return {
        template,
        cursorPos,
        focusPos
      };
    });

    setIsModified(true);
  }

  const editorOnKeyDown = function(ev: React.KeyboardEvent<HTMLDivElement>) {
    if (ev.altKey) {
      if (ev.code === 'KeyI') {
        ev.preventDefault();
        onIfNodeInsert();
      }
      else 
      if (ev.code === 'KeyV') {
        ev.preventDefault();
        varNamesMenuStatFocusRef.current?.focus();
      }
    }
  }

  const previewOnClick = function() {
    setIsPreviewOpen(true);
  }

  const previewOnClose = function() {
    setIsPreviewOpen(false);
    
    setTemplateEditor(templateEditor => ({
      ...templateEditor,
      focusPos: structuredClone(initFocusPos)
    }));
  }

  const saveOnClick = function() {
    if (confirm('Save template?')) {
      onSave(msgTemplateStringify(templateEditor.template));
      setIsModified(false);
    }
  }

  const closeOnClick = function() {
    if (!isModified || confirm('Close without saving?')) {
      onClose()
    }
  }

  return (
    <>
      <div className={css['body']} onKeyDown={editorOnKeyDown}>
        <div className={css['header']}>
          <div className={css['title']}>
            Message Template Editor
          </div>

          <div className={css['top-menu']}>
            <div className={css['block-menu']}>
              <button 
                ref={focusLoopStartRef} onKeyDown={focusLoopStartOnKeyDown}
                onClick={onIfNodeInsert}
              >
                IF-THEN-ELSE
              </button>
            </div>

            <div className={css['var-names-menu']}>
              <VarNamesMenu 
                arrVarNames={arrVarNames}
                onVarNameInsert={onVarNameInsert}
                startFocusRef={varNamesMenuStatFocusRef}
              />
            </div>
          </div>
        </div>

        <div className={css['scroll-area']}>
          <div className={css['content']}>
            <MsgTemplateArea 
              template={templateEditor.template}
              focusControl={{
                focusNodeId: templateEditor.focusPos.nodeId, 
                focusNodeRef
              }}
              onCursorUpdate={onCursorUpdate}
              onTextChange={onTextChange}
              onIfNodeDelete={onIfNodeDelete}
            />
          </div>
        </div>

        <div className={css['footer']}>
          <div className={css['btn-menu']}>
            <button onClick={previewOnClick}>
              Preview
            </button>

            <button onClick={saveOnClick}>
              Save
            </button>

            <button 
              ref={focusLoopEndRef} onKeyDown={focusLoopEndOnKeyDown} 
              onClick={closeOnClick}
            >
              Close
            </button>
          </div>
        </div>
      </div>
      
      <ModalWindow isOpen={isPreviewOpen}>
        <MsgPreview 
          arrVarNames={arrVarNames}
          template={templateEditor.template}
          onClose={previewOnClose}
        />
      </ModalWindow>
    </>
  );
}
