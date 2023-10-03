import { useDispatch } from 'react-redux';

import useJwt from '@src/auth/jwt/useJwt';
import { handleLogout } from '..';

export default function useAuthentication() {
  const dispatch = useDispatch();

  const logout = () => {
    useJwt.logout();
    dispatch(handleLogout());
  };

  return { logout };
}
