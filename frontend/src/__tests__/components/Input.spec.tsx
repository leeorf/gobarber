import '@testing-library/jest-dom';

import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';

import Input from '../../components/Input';

jest.mock('@unform/core', () => {
  return {
    useField: () => ({
      fieldName: 'email',
      defaultValue: '',
      error: '',
      registerField: jest.fn(),
    }),
  };
});

describe('Input component', () => {
  it('should be able to render an input', () => {
    const { getByPlaceholderText } = render(
      <Input name="email" placeholder="E-mail" />,
    );

    expect(getByPlaceholderText('E-mail')).toBeTruthy();
  });

  it('should be able to highlight border on input focus and undo this when on input blur', async () => {
    /**
     * When we can not use any "getBy" query to select the element we want, we can
     * use the "getByTestId".
     * Inside the code we want to test (in this case inside src/components/Input/index.tsx),
     * we can set a prop called data-testid and put any thing we want to have
     * this element as a reference to our test
     */
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="E-mail" />,
    );

    const inputElement = getByPlaceholderText('E-mail');
    const inputContainerElement = getByTestId('input-container');

    /**
     * Every change in the state of a component is asynchronous. As instant as it
     * seems, behind the scenes React takes a few milliseconds to change the com-
     * ponent state. So, if something is asynchronous, we need to use the "waitFor"
     * method
     */
    fireEvent.focus(inputElement);

    await waitFor(() => {
      expect(inputContainerElement).toHaveStyle('border-color: #ff9000;');
      expect(inputContainerElement).toHaveStyle('color: #ff9000;');
    });

    fireEvent.blur(inputElement);

    await waitFor(() => {
      expect(inputContainerElement).not.toHaveStyle('border-color: #ff9000;');
      expect(inputContainerElement).not.toHaveStyle('color: #ff9000;');
    });
  });

  it('should be able to keep border highlighted when input is on blur but it is filled', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="E-mail" />,
    );

    const inputElement = getByPlaceholderText('E-mail');
    const inputContainerElement = getByTestId('input-container');

    fireEvent.change(inputElement, {
      target: { value: 'johndoe@example.com' },
    });

    fireEvent.blur(inputElement);

    await waitFor(() => {
      expect(inputContainerElement).toHaveStyle('color: #ff9000;');
    });
  });

  // it('should be able to show an icon', () => {});

  // it('should be able to show error tooltip when erros happens', () => {});
});
