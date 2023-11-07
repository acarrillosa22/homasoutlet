import { useState, useEffect } from 'react';
import React from 'react';
import { Alert } from 'reactstrap';
import "./alert.css";
function CustomAlert({ isOpen, texto,tipo}) {
    const [visible, setVisible] = useState(isOpen);
    const onDismiss = () => {
      setVisible(false);
    };
  return (
    <Alert className='custom-alert' color={tipo} isOpen={visible} toggle={onDismiss}>
         <h4 className="alert-heading">{texto}</h4>
    </Alert>
  );
};

export default CustomAlert;