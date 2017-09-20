import React from 'react';
import PropTypes from 'prop-types';
import TextInput from '../../General/components/TextInput.js';


const FormClass = ({ data }) => {
  const { onChange, onSubmit, formId, fieldNb, name, type, text, values } = data;
  console.log('values', values);
  const TextInputDisplay = [];
  for (let i = 0; i < fieldNb; i += 1) {
    TextInputDisplay.push(
      (<TextInput
        key={i}
        currentValue={values[i]}
        name={name[i]}
        type={type[i]}
        text={text[i]}
        onChange={onChange}
      />),
    );
  }
  return (
    <form id={formId} onSubmit={onSubmit}>
      {TextInputDisplay}
      <input
        type="submit"
        className="btn btn-default"
        value="Save"
      />
    </form>
  );
};

FormClass.PropTypes = {
  status: PropTypes.boolean,
  data: React.PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    formId: PropTypes.string.isRequired,
    fieldNb: PropTypes.number.isRequired,
    values: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.arrayOf(PropTypes.string),
    type: PropTypes.arrayOf(PropTypes.string),
    text: PropTypes.arrayOf(PropTypes.string),
  }),
};


export default FormClass;
