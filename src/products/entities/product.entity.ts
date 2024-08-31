import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'float', nullable: false })
  price: number;

  @Column({ type: 'boolean', default: false })
  isApproved: boolean;

  @ManyToOne(() => User, (user) => user.products) // Define the relationship
  user: User;

  @CreateDateColumn() // Automatically manages createdAt timestamp
  createdAt: Date;

  @UpdateDateColumn() // Automatically manages updatedAt timestamp
  updatedAt: Date;
}
