import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  passwordHash: string;

  @Column()
  name: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: false })
  is2FAEnabled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  checkPassword(plainPassword: string): boolean {
    const bcrypt = require('bcrypt');
    return bcrypt.compareSync(plainPassword, this.passwordHash);
  }
}