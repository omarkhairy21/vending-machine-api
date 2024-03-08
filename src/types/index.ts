import { Request } from 'express';

export interface CustomRequest extends Request {
  user: {
    id: number;
    role: string;
  };
}

export interface TokenPayload {
  username: string;
  userId: number;
  role: string;
}
