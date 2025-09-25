// users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';

type Field = 'all' | 'email' | 'phone';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>) {
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      return { message: 'Email address already in use. Unable to create account.', success: false};
    }
 
    const userCount = await this.userRepository.count();
    if (userCount === 0) {
    userData.role = 'Admin';  
    } 
    const user = this.userRepository.create(userData);
    await this.userRepository.save(user);
    return { message: 'User created', success: true, id: user.id};
  }
  
  async delete(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return { message: 'User not found', success: false };
    }
    await this.userRepository.remove(user);
    return { message: 'User deleted successfully', success: true };
  }

  async update(id: number, data: Partial<User>) {
    const existingUser = await this.userRepository.findOne({ where: { id } });

    if (data.email && data.email !== existingUser?.email) {
      const emailInUse = await this.userRepository.findOne({
        where: { email: data.email },
      });
      if (emailInUse) {
        return { message: 'Email address already in use. Unable to create account.', success: false};
      }
    }
    await this.userRepository.update(id, data);

    return { message: 'Account updated.', success: true};
  }

  findAll() {
    return this.userRepository.find();
  }

  async getUsers(page: number, limit: number, field?: string, search?: string) {
    const where: Record<string, any> = {};

    if (field && search) {
      if (field === 'email') {
        where.email = ILike(`%${search}%`);
      }
      if (field === 'phone') {
        where.phone = ILike(`%${search}%`);
      }
    }

    const [users, total] = await this.userRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' },
    });

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}