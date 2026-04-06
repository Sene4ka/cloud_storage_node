import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = this.repo.create(userData);
    return this.repo.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
        isVerified: true,
        is2FAEnabled: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByIdWithPassword(id: string): Promise<User | null> {
    return this.repo.findOne({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
        isVerified: true,
        is2FAEnabled: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.repo.count({ where: { email } });
    return count > 0;
  }

  async update(id: string, updates: Partial<User>): Promise<User> {
    await this.repo.update(id, updates);
    const updated = await this.findById(id);
    if (!updated) throw new NotFoundException('User not found after update');
    return updated;
  }
}