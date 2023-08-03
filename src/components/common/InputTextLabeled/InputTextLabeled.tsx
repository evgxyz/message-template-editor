
import React, { useId } from 'react';
import css from './InputTextLabeled.module.scss';

type InputProps = React.ComponentPropsWithoutRef<'input'>;

interface InputTextLabeledProps extends InputProps {
  label: string
}

export const InputTextLabeled = 
  React.forwardRef<HTMLInputElement, InputTextLabeledProps>(
//
  ({label = '', ...props}, ref) => {
    const id = useId();
    
    return (
      <div className={css['wrapper']}>

        <div className={css['label-box']}>
          <div className={css['border-overlay']}></div>
          <label htmlFor={id} className={css['label']}>
            {label}
          </label>
        </div>

        <div className={css['input-block']}>
          <input type='text' id={id} ref={ref} {...props} />
        </div>
      </div>
    )
  }
);