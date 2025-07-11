import { UserProfile } from "./user";

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  refresh: string;
  access: string;
}

export interface RefreshResponse {
  refresh: string;
  access: string;
};

export interface UpdateAccessTokenRequest {
  refresh: string;
}

export interface VerifyTokenRequest {
  token: string;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
}


export interface SignUpCredentials {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  profile_picture: string;
  designation: string;
  department_name: string;
}
export interface SignUpResponse {
  message: string;
  status_code: number;
}

export interface UserSignUpFormData extends SignUpCredentials {
  confirm_password: string
}


export interface TokenGenerationRequest {
    institute: string;
    max_users: number;
}

export interface TokenGenerationResponse {
    message: string;
    invitation_code: string;
}