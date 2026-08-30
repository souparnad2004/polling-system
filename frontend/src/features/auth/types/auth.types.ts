export type RegisterResponse = {
  user: {
    id: string;
    email: string;
    displayName: string;
    status: string;
    createdAt: string;
  };
};

export type LoginResponse = {
  user: {
    id: string;
    email: string;
    displayName: string;
    status: string;
    createdAt: string;
  };
};

export type User = {
  id: string;
  email: string;
  displayName: string;
  status: string;
  createdAt: string;
};
