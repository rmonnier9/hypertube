import React from 'react';

const SubmitForm = props => (
  <input
    type="submit"
    className={props.className}
    value={props.value}
  />
);

export default SubmitForm;
