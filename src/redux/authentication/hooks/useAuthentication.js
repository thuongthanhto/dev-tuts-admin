import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import useJwt from '@src/auth/jwt/useJwt';
import { handleLogout } from '..';

export default function useAuthentication() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    await useJwt.logout();
    dispatch(handleLogout());
    navigate('/login', { replace: true });
  };

  return { logout };
}
