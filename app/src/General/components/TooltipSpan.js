import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

const TooltipSpan = (props) => {
  const { id, text, className } = props;

  const tooltip = (
    <Tooltip id={id}>{text}</Tooltip>
  );

  return (
    <OverlayTrigger placement="bottom" overlay={tooltip}>
      <span className={className} />
    </OverlayTrigger>
  );
};

export default TooltipSpan;
