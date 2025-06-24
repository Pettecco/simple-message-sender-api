import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: '255' })
  content: string;

  @Column({ type: 'varchar', length: 50 })
  from: string;

  @Column({ type: 'varchar', length: 50 })
  to: string;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
