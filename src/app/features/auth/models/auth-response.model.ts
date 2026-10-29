import { User } from '../../../core/models/user.model';

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}
