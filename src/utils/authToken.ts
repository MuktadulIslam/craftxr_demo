import { NextRequest } from 'next/server';
import { config } from '@/config';
import Cookies from 'js-cookie';

// Client-side functions (using js-cookie)
export const storeAccessToken = (accessToken: string): void => {
  Cookies.set(config.token.accessTokenName, accessToken, {
    expires: new Date(new Date().getTime() + config.token.accessTokenExpiry),
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    path: '/',
  });
};

export const storeRefreshToken = (refreshToken: string): void => {
  Cookies.set(config.token.refreshTokenName, refreshToken, {
    expires: new Date(new Date().getTime() + config.token.refreshTokenExpiry),
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    path: '/',
  });
};

export const storeTokens = (accessToken: string, refreshToken: string): void => {
  storeAccessToken(accessToken);
  storeRefreshToken(refreshToken);
};

export const getAccessToken = (): string | undefined => {
  const token = Cookies.get(config.token.accessTokenName);
  if (!token) return undefined;

  // Get the expiration date from cookie
  const tokenExpiry = Cookies.get(config.token.accessTokenName + '_expires');
  if (tokenExpiry && new Date() > new Date(tokenExpiry)) {
    // Token is expired
    return undefined;
  }

  return token;
};

export const getRefreshToken = (): string | undefined => {
  const token = Cookies.get(config.token.refreshTokenName);
  if (!token) return undefined;

  // Get the expiration date from cookie
  const tokenExpiry = Cookies.get(config.token.refreshTokenName + '_expires');
  if (tokenExpiry && new Date() > new Date(tokenExpiry)) {
    // Token is expired
    return undefined;
  }

  return token;
};

export const removeTokens = (): void => {
  Cookies.remove(config.token.accessTokenName, { path: '/' });
  Cookies.remove(config.token.refreshTokenName, { path: '/' });
};

// Server-side functions (for middleware)
export const getAccessTokenFromRequest = (request: NextRequest): string | undefined => {
  const token = request.cookies.get(config.token.accessTokenName)?.value;
  if (!token) return undefined;

  // Check if token is expired by examining cookie expiration
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const expiryMatch = cookieHeader.match(new RegExp(`${config.token.accessTokenName}_expires=([^;]+)`));
    if (expiryMatch && expiryMatch[1] && new Date() > new Date(expiryMatch[1])) {
      return undefined; // Token is expired
    }
  }

  return token;
};

export const getRefreshTokenFromRequest = (request: NextRequest): string | undefined => {
  const token = request.cookies.get(config.token.refreshTokenName)?.value;
  if (!token) return undefined;

  // Check if token is expired by examining cookie expiration
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const expiryMatch = cookieHeader.match(new RegExp(`${config.token.refreshTokenName}_expires=([^;]+)`));
    if (expiryMatch && expiryMatch[1] && new Date() > new Date(expiryMatch[1])) {
      return undefined; // Token is expired
    }
  }

  return token;
};

export const verifyAccessTokenFromRequest = (request: NextRequest): boolean => {
  try {
    const token = getAccessTokenFromRequest(request);
    return !!token;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
};

export const verifyRefreshTokenFromRequest = (request: NextRequest): boolean => {
  try {
    const token = getRefreshTokenFromRequest(request);
    return !!token;
  } catch (error) {
    console.error('Refresh token verification error:', error);
    return false;
  }
};

export const isAuthenticatedFromRequest = (request: NextRequest): boolean => {
  return verifyRefreshTokenFromRequest(request) || verifyAccessTokenFromRequest(request);
};

// For client-side authentication check
export const verifyAccessToken = (): boolean => {
  try {
    const token = getAccessToken();
    return !!token;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
};

export const verifyRefreshToken = (): boolean => {
  try {
    const token = getRefreshToken();
    return !!token;
  } catch (error) {
    console.error('Refresh token verification error:', error);
    return false;
  }
};

export const isAuthenticated = (): boolean => {
  return verifyRefreshToken() || verifyAccessToken();
};