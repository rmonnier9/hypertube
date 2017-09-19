import React from 'react';

const SubmitForm = props => (
  <input
    type="submit"
    className="btn btn-default"
    value={props.value}
  />
);

export default SubmitForm;
