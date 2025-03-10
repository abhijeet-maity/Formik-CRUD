import React from 'react';
import { ErrorMessage, FastField } from 'formik';
import TextError from './TextError';
// import "./App.css";


function Textarea(props) {
  const {label, name, ...rest} = props;
  return (
    <div className='form-control'>
        <label htmlFor={name}>{label}</label>
        <FastField as="textarea" id={name} name={name} {...rest} />
        <ErrorMessage name={name} component={TextError} />
    </div>
  )
}

export default Textarea
