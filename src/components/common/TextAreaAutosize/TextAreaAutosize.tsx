
import React, { useEffect, useId, useRef } from 'react';
import { composeRefs } from '@/units/compose-refs';

type TextAreaAutosizeProps = React.ComponentPropsWithoutRef<'textarea'>;

/**
 * Textarea with auto-resizing by height depending on the content.
 * This component can take react-ref parameter
 */
export const TextAreaAutosize = React.forwardRef<HTMLTextAreaElement, TextAreaAutosizeProps>(
  ({onChange = () => {}, ...props}, ref) => {
    
    const taRef = useRef<HTMLTextAreaElement>(null);

    function taResize() {
      if (taRef.current) {
        const elem = taRef.current;

        elem.style.height = 'auto';

        const compStyle = window.getComputedStyle(elem);

        let newHeight;
        
        if (compStyle.getPropertyValue('box-sizing') === 'content-box') {
          newHeight = 
            elem.scrollHeight
            - parseFloat(compStyle.getPropertyValue('padding-top'))
            - parseFloat(compStyle.getPropertyValue('padding-bottom'))
        } 
        else { //box-sizing === border-box
          newHeight = 
            elem.scrollHeight
            + parseFloat(compStyle.getPropertyValue('border-top-width'))
            + parseFloat(compStyle.getPropertyValue('border-bottom-width'))
        }

        elem.style.height = `${newHeight}px`;
      }
    }

    useEffect(() => {
      taResize();
    }, []);

    const taOnChange = function(ev: React.ChangeEvent<HTMLTextAreaElement>) {
      taResize();
      onChange(ev);
    }

    return (
      <textarea 
        style={{resize: 'none', minHeight: '2em'}}
        {...props} 
        ref={composeRefs(taRef, ref)} 
        onChange={taOnChange} 
      />
    );
  }
);
