import '@testing-library/jest-dom';

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import SignIn from '../../pages/SignIn';

const mockedHistoryPush = jest.fn();
const mockedSignIn = jest.fn();
const mockedAddToast = jest.fn();

/**
 * If we have any functionality that needs to be wrapped by a Provider, such as
 * useHistory and Link that must be inside a <Router> we need to do a mock
 *
 * Here we are mocking the "import { Link, useHistory } from 'react-router-dom'"
 * and we are saying what will be executed. In this case we are returning:
 * - useHistory function as a empty function
 *
 */
jest.mock('react-router-dom', () => {
  return {
    /**
     * mockReturnValue accepts a value that will be returned whenever the mock
     * function is called
     * */
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    /**
     * React.ReactNode is a generic type that means any content that a React com-
     * ponent could receive (string, JSX, etc...)
     */
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      signIn: mockedSignIn,
    }),
  };
});

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('SignIn Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
  });

  it('should be able to sign in', async () => {
    /**
     * First we need to render the component to be able to manipulate it as
     * we want
     * Here we render the component and do queries based on what we want to
     * grab
     */
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    /**
     * We use fireEvent to simulate any action that the user could do inside our
     * application
     *
     * Usually the events are related to the listeners that we use. For example:
     *
     * We listen an event "onChange" on the input, so we fire a event called "change"
     * We listen an event "onBlur" on the input, so we fire a event called "blur"
     */
    /**
     * Notice that we don't pass the text to the emailField, because when we
     * use the "onChange", we actually receive an event, and on this event we have
     * a target and this target has a value
     *
     * onChange={event => event.targe.value}
     *
     * Because of this, we don't pass the text, we pass an object that represents
     * the event, and this event has a targe that has a value
     */
    fireEvent.change(emailField, { target: { value: 'johndoe@example.com' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });

    fireEvent.click(buttonElement);

    /**
     * When we test a component, we need to test the visual feedback that the
     * user will see, and not what happens behind the scenes.
     *
     * expect is a synchronous code, and inside our component we have a async
     * function. To overcome this problem we use "waitFor" to  run the callback
     * a variable number of times until pass. The default interval is 50ms, and
     * the default timeout is 1000ms
     */
    await waitFor(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should not be able to sign in with invalid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'not-valid-email' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('should display an error if signin fails', async () => {
    mockedSignIn.mockImplementationOnce(() => {
      throw new Error();
    });

    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'johndoe@example.com' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });
});
