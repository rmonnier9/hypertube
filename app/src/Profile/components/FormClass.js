import React from 'react';
// import PropTypes from 'prop-types';
import TextInput from '../../General/components/TextInput.js';
import SubmitForm from '../../General/components/SubmitForm.js';

const FormClass = ({ data }) => {
  if (data.formId === null) return null;

  const { onChange, onSubmit, formId, name, type, text } = data;
  const TextInputDisplay = [];
  for (let i = 0; i < name.length; i += 1) {
    TextInputDisplay.push(
      (<TextInput
        key={i}
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
      <SubmitForm
        className="btn btn-default submit-button"
        value="Save"
      />
    </form>
  );
};

// FormClass.PropTypes = {
//   status: PropTypes.boolean,
//   data: React.PropTypes.shape({
//     onChange: PropTypes.func.isRequired,
//     onSubmit: PropTypes.func.isRequired,
//     formId: PropTypes.string.isRequired,
//     fieldNb: PropTypes.number.isRequired,
//     values: PropTypes.arrayOf(PropTypes.string),
//     name: PropTypes.arrayOf(PropTypes.string),
//     type: PropTypes.arrayOf(PropTypes.string),
//     text: PropTypes.arrayOf(PropTypes.string),
//   }),
// };

export default FormClass;
