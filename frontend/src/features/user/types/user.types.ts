export type User = {
  id: string;
  email: string;
  displayName: string;
  status: string;
  createdAt: string;
};

export type UserResponse = {
  user: User;
};