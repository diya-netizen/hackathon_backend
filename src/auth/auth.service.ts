import { Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user || user.password !== password) {
      return{ message: 'User Email or Password incorrect. Please try again!!', success: false };
    }
    else if (user.status !== 'Active') 
    {
      return{ message: 'Your account is not active. Please contact admin.', success: false };
    }
    
    return{ message: 'Login successful', success: true , user};
  }

  async getMyUser(id: number) {
    return this.userRepo.findOne({ where: { id } });
  }
}