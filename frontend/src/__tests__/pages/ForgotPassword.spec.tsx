import { fireEvent, render, waitFor } from '@testing-library/react';
import React, { ReactNode } from 'react';
import MockAdapter from 'axios-mock-adapter';

import ForgotPassword from '../../pages/ForgotPassword';

import api from '../../services/api';

const mockedAddToast = jest.fn();

const apiMock = new MockAdapter(api);

jest.mock('react-router-dom', () => {
  return {
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('ForgotPassword Page', () => {
  beforeEach(() => {
    mockedAddToast.mockClear();
  });

  it('should be able to reset the password', async () => {
    const { getByPlaceholderText, getByTestId } = render(<ForgotPassword />);

    const emailField = getByPlaceholderText('E-mail');

    const buttonElement = getByTestId('button-element');

    fireEvent.change(emailField, {
      target: {
        value: 'johndoe@example.com',
      },
    });

    fireEvent.click(buttonElement);

    apiMock.onPost('/password/forgot').reply(200);

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
        }),
      );
    });
  });

  it('should not be able to reset the password with wrong credentials', async () => {
    const { getByPlaceholderText, getByTestId } = render(<ForgotPassword />);

    const emailField = getByPlaceholderText('E-mail');

    const buttonElement = getByTestId('button-element');

    fireEvent.change(emailField, {
      target: {
        value: 'no-valid-email',
      },
    });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedAddToast).not.toHaveBeenCalled();
    });
  });

  it('should display an error if forgot password service fails', async () => {
    const { getByPlaceholderText, getByTestId } = render(<ForgotPassword />);

    const emailField = getByPlaceholderText('E-mail');

    const buttonElement = getByTestId('button-element');

    fireEvent.change(emailField, {
      target: {
        value: 'johndoe@example.com',
      },
    });

    fireEvent.click(buttonElement);

    apiMock.onPost('/password/forgot').reply(400);

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });
});
