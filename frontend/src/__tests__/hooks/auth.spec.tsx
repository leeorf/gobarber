import { renderHook, act } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';
import { AuthProvider, useAuth } from '../../hooks/auth';
import api from '../../services/api';

// Axios adapter that allows to easily mock requests
const apiMock = new MockAdapter(api);

describe('Auth hook', () => {
  it('should be able to sign in', async () => {
    const apiResponse = {
      user: {
        id: 'id',
        name: 'John Doe',
        email: 'johndoe@example.com',
      },
      token: 'token',
    };

    apiMock.onPost('sessions').reply(200, apiResponse);

    /**
     * To see if a function is called we can use "spyOn". In this case we want to
     * know if localStorage.setItem was called.
     *
     * But here we need to care because behing the scenes either localStorage and
     * sessionStorage are just alias. Actually behing the scenes what is used is
     * a JavaScript class called "Storage". To access the class "Storage" we
     * use "Storage.prototype".
     * Like this we can know if the "setItem" function of our browser API was called
     */

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    /**
     * Without the AuthProvider, our useAuth hooks just return in result.current
     * an empty object because the hooks relies on the context. If we call the
     * useAuth and we don't use a context to wrap the hook.
     *
     * Inside src/hooks/auth.tsx we have:
     * const AuthContext = createContext<AuthContextInterface>({} as AuthContextInterface);
     *
     * That is, we are initializing the AuthConext with an empty oject, and this
     * object will only have value when the AuthProvider is used
     *
     * In summary AuthProvider is the one that is going to fulfill the object, thus
     * we need to use it as a wrapper
     */
    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    result.current.signIn({
      email: 'johndoe@example.com',
      password: '123456',
    });

    /**
     * When we are dealing with hooks, instead of "waitFor" from @testing-library/react
     * we use the "waitForNextUpdate" from @testing-library/react-hooks
     *
     * "waitForNextUpdate" will be watching the variable result.current waiting
     * for any value to change
     *
     * We can use "waitForValueToChange" to watch an specific value. In this case
     * we could watch the result.current.user
     */

    await waitForNextUpdate();

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:token',
      apiResponse.token,
    );
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(apiResponse.user),
    );
    expect(result.current.user.email).toEqual('johndoe@example.com');
  });

  it('should be able to retrieve data from the storage if the user logged in before', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementationOnce(key => {
      switch (key) {
        case '@GoBarber:token':
          return 'token';
        case '@GoBarber:user':
          return JSON.stringify({
            user: {
              id: 'id',
              name: 'John Doe',
              email: 'johndoe@example.com',
            },
          });
        default:
          return null;
      }
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user.email).toEqual('johndoe@example.com');
  });

  it('should be able to sign out', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementationOnce(key => {
      switch (key) {
        case '@GoBarber:token':
          return 'token';
        case '@GoBarber:user':
          return JSON.stringify({
            user: {
              id: 'id',
              name: 'John Doe',
              email: 'johndoe@example.com',
            },
          });
        default:
          return null;
      }
    });

    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    /**
     * When we trigger a sync function that change any state, it is not a good
     * idea to wait with "waitForNextUpdate"
     * Instead we use the "act"
     */
    act(() => {
      result.current.signOut();
    });

    expect(removeItemSpy).toHaveBeenCalledTimes(2);
    /**
     * Note that is not the user.email that is falsy, but the user. Because in
     * "src/hooks/auth.tsx", when we do a signOut, we set the state as an empty
     * objet
     *
     * setData({} as AuthState);
     */
    expect(result.current.user).toBeFalsy();
  });

  it('should be able to update user data', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const user = {
      id: 'id',
      avatar_url: 'avatar.jpg',
      name: 'John Doe',
      email: 'johndoe@example.com',
    };

    /**
     * Again, updateUser is not a async function, so we need to use "act"
     */
    act(() => {
      result.current.updateUser(user);
    });

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(user),
    );
    expect(result.current.user).toEqual(user);
  });
});
