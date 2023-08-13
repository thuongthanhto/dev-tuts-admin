const apiUrl = import.meta.env.VITE_API_URL;

// ** Auth Endpoints
export default {
  loginEndpoint: `${apiUrl}/auth/signin`,
  registerEndpoint: `${apiUrl}/auth/signup`,
  refreshEndpoint: '/jwt/refresh-token',
  logoutEndpoint: '/jwt/logout',

  // ** This will be prefixed in authorization header with token
  // ? e.g. Authorization: Bearer <token>
  tokenType: 'Bearer',

  // ** Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'accessToken',
  storageRefreshTokenKeyName: 'refreshToken',
};
