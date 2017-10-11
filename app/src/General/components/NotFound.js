import React from 'react';
import { injectIntl } from 'react-intl';

const NotFound = (props) => {
  const pageNotFound = props.intl.formatMessage({ id: 'general.pageNotFound' });
  const noPage = props.intl.formatMessage({ id: 'general.noPage' });

  return (
    <div className="not-found">
      <h1>{pageNotFound}</h1>
      <p>{noPage}</p>
    </div>
  );
};

export default injectIntl(NotFound);
