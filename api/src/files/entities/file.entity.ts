import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('files')
export class File {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  @Index()
  userId: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  filename: string;

  @Column({ name: 'original_name' })
  originalName: string;

  @Column()
  path: string;

  @Column('bigint')
  size: number;

  @Column({ name: 'mime_type' })
  mimeType: string;

  @Column({ name: 'storage_path' })
  storagePath: string;

  @Column()
  bucket: string;

  @Column({ name: 'is_public', default: false })
  isPublic: boolean;

  @Column({ type: 'text', nullable: true })
  tags: Record<string, string> | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'is_trashed', default: false })
  @Index()
  isTrashed: boolean;

  @Column({ name: 'trashed_at', type: 'timestamp', nullable: true })
  trashedAt: Date | null;
}