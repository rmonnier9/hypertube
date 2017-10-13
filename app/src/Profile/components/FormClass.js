import React from 'react';
import TextInput from '../../General/components/TextInput.js';
import SubmitForm from '../../General/components/SubmitForm.js';

const FormClass = ({ form, onChange, onSubmit }) => {
  if (form.formId === null) return null;

  const { formId, name, type, id } = form;
  const TextInputDisplay = [];
  for (let i = 0; i < name.length; i += 1) {
    TextInputDisplay.push(
      (<TextInput
        key={i}
        name={name[i]}
        type={type[i]}
        id={id[i]}
        onChange={onChange}
      />),
    );
  }
  return (
    <form id={formId} onSubmit={onSubmit}>
      {TextInputDisplay}
      <SubmitForm
        className="btn btn-default submit-button"
        id="general.save"
      />
    </form>
  );
};

export default FormClass;
