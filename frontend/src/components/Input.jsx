import React from 'react';
import TextError from './TextError';
import { Field, ErrorMessage, FastField } from 'formik';


const Input = (props) => {
  const {label, name, ...rest} = props;
  return (
    <div>
        <label htmlFor={name}>{label}</label>
        <FastField id={name} name={name} {...rest}></FastField>
        <ErrorMessage name={name} component={TextError}/>
    </div>
  )
}

export default Input