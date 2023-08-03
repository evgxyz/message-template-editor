
import React from 'react';
import { MsgTemplate } from '@/units/msg-template';
import { TextAreaAutosize } from '@/components/common/TextAreaAutosize';
import css from './MsgTemplateArea.module.scss';

/* The message template area sub-component */

interface MsgTemplateAreaProps {
  template: MsgTemplate;
  focusControl: {
    focusNodeId: string,
    focusNodeRef: React.RefObject<HTMLTextAreaElement>
  };
  onCursorUpdate: (
    nodeId: string, 
    caretPos: number
  ) => void;
  onTextChange: (nodeId: string, caretPos: number, text: string) => void;
  onIfNodeDelete: (nodeId: string) => void;
}

/**
 * The message template area sub-component 
 */
export function MsgTemplateArea({
  template,
  focusControl: {
    focusNodeId, 
    focusNodeRef
  },
  onCursorUpdate,
  onTextChange,
  onIfNodeDelete
}: MsgTemplateAreaProps): JSX.Element {
//
  const textOnClick = function(
    ev: React.MouseEvent<HTMLTextAreaElement>, 
    nodeId: string
  ) {
    onCursorUpdate(nodeId, ev.currentTarget.selectionStart);
  }

  const textOnKeyUp = function(
    ev: React.KeyboardEvent<HTMLTextAreaElement>, 
    nodeId: string
  ) {
    if (caretMovingKeys.includes(ev.key)) {
      onCursorUpdate(nodeId, ev.currentTarget.selectionStart);
    }
  }

  const textOnChange = function(
    ev: React.ChangeEvent<HTMLTextAreaElement>, 
    nodeId: string
  ) {
    onTextChange(nodeId, ev.target.selectionStart, ev.target.value);
  }

  const ifNodeDeleteOnClick = function(nodeId: string) {
    onIfNodeDelete(nodeId);
  }

  function buildTemplateAreaREC(template: MsgTemplate): React.ReactNode {
    let elems: React.ReactNode[] = [];

    for (let node of template) {
      if (node.type === 'TEXT') {
        elems.push(
          <div 
            key={`${node.id}+${node.hash}`} 
            data-id={node.id} 
            data-hash={node.hash} 
            className={css['text-node']}
          >
            <TextAreaAutosize 
              value={node.text}
              ref={node.id == focusNodeId ? focusNodeRef : undefined}
              onClick={ev => textOnClick(ev, node.id)}
              onKeyUp={ev => textOnKeyUp(ev, node.id)}
              onChange={ev => textOnChange(ev, node.id)}
              className={css['textarea']}
            />
          </div>
        );
      } 
      else
      if (node.type === 'IF') {
        let ifNodeElems: React.ReactNode[] = [];

        ifNodeElems.push(
          <div 
            key={`${node.id}-cond`}
            className={[css['if-sect'], css['if-sect--cond']].join(' ')}
          >
            <div className={css['if-sect__left']}>
              <div className={css['if-sect__title']}>
                IF
              </div>
              <div className={css['if-sect__menu']}>
                <button 
                  onClick={() => ifNodeDeleteOnClick(node.id)}
                  className={'btn-icon btn-icon--delete'}
                />
              </div>
            </div>
            <div className={css['if-sect__body']}>
              { buildTemplateAreaREC(node.condBranch) }
            </div>
          </div>
        );

        ifNodeElems.push(
          <div 
            key={`${node.id}-then`} 
            className={[css['if-sect'], css['if-sect--then']].join(' ')}
          >
            <div className={css['if-sect__left']}>
              <div className={css['if-sect__title']}>
                THEN
              </div>
            </div>
            <div className={css['if-sect__body']}>
              { buildTemplateAreaREC(node.thenBranch) }
            </div>
          </div>
        );

        ifNodeElems.push(
          <div 
            key={`${node.id}-else`} 
            className={[css['if-sect'], css['if-sect--else']].join(' ')}
          >
            <div className={css['if-sect__left']}>
              <div className={css['if-sect__title']}>
                ELSE
              </div>
            </div>
            <div className={css['if-sect__body']}>
              { buildTemplateAreaREC(node.elseBranch) }
            </div>
          </div>
        );

        elems.push(
          <div 
            key={node.id} 
            data-id={node.id} 
            className={css['if-node']}
          >
            {ifNodeElems}
          </div>
        );
      }
    }

    return (
      <div className={css['branch']}>
        {elems}
      </div>
    );
  }

  return (
    <div className={css['body']}>
      { buildTemplateAreaREC(template) }
    </div>
  );
}

const caretMovingKeys = [
  'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 
  'Home', 'End', 'PageUp', 'PageDown'
];