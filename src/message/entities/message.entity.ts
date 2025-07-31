import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: '255' })
  content: string;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  // Muitos recados podem ser enviados a uma única pessoa
  @ManyToOne(() => User)
  @JoinColumn({ name: 'from' })
  from: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'to' })
  to: User;
}
