export interface RegisterResponse {
  user: {
    id: string;
    email: string;
    displayName: string;
  };
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    displayName: string;
  };
}