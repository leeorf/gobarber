import React from 'react';
import { render } from '@testing-library/react';
import SignIn from '../../pages/SignIn';

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
    useHistory: jest.fn(),
    /**
     * React.ReactNode is a generic type that means any content that a React com-
     * ponent could receive (string, JSX, etc...)
     */
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

describe('SignIn Page', () => {
  it('should be able to sign in', () => {
    /**
     * First we need to render the component to be able to manipulate it as
     * we want
     */
    const { debug } = render(<SignIn />);

    /**
     * Debug is a method to display the HTML
     */
    debug();
  });
});
