import React, { useEffect } from 'react';
import {
  FiAlertCircle,
  FiXCircle,
  FiCheckCircle,
  FiInfo,
} from 'react-icons/fi';

import { ToastMessage, useToast } from '../../../hooks/toast';

import { Container } from './styles';

interface ToastProps {
  message: ToastMessage;
  style: object;
}

const icons = {
  info: <FiInfo size={24} />,
  error: <FiAlertCircle size={24} />,
  success: <FiCheckCircle size={24} />,
};

const Toast: React.FC<ToastProps> = ({ message, style }) => {
  const { removeToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(message.id);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [removeToast, message.id]);

  return (
    <Container
      type={message.type}
      /**
       * When we pass a custom attribute to to a HTML element on the DOM, we
       * need to pass it in lowercase.
       * The warning when this happens:
       *
       * Warning: React does not recognize the `propName` prop on a DOM element.
       * If you intentionally want it to appear in the DOM as a custom attribute,
       * spell it as lowercase `proname` instead.
       */

      /**
       * When we pass a boolean prop to a component, we need to be careful to not
       * pass boolean to the HTML element, because HTML doest not understand
       * boolean.
       * The warning when this happens is:
       * Warning: Received `true` for a non-boolean attribute `propName`.
       *
       * To fix this, we transform a boolean into a number. True will be represented
       * as 1 and false as 0
       */
      hasdescription={Number(!!message.description)}
      style={style}
    >
      {icons[message.type || 'info']}

      <div>
        <strong>{message.title}</strong>
        {message.description && <p>{message.description}</p>}
      </div>

      <button type="button" onClick={() => removeToast(message.id)}>
        <FiXCircle size={18} />
      </button>
    </Container>
  );
};

export default Toast;
