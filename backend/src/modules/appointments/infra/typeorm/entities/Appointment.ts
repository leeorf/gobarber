import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';

@Entity('appointments')
class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  provider_id: string;

  /**
   * When using TypeORM, when we load a relationship between 2 tables
   * (either loading through the entity `eager/lazy` or through the repository
   * with `relations`), typeORM uses a strategy called Eager Loading.
   *
   * Imagine that we made a query that return a list of 10 appointments,
   * each appoint scheduled by a different user. Thus, we have 10 appointments,
   * with 10 different user_ids.
   *
   * Using Eager Loading,  instead of making 10 different queries using the
   * user_ids to return the users, it will only do one query with 10 user_ids.
   */

  /**
   * Using RelationOptions, we can use eager or lazy to load relation
   *
   * Eager relations are always loaded automatically when relation's owner entity
   * is loaded using find methods. In summary, it will load the relation like it or not
   *
   * Lazy relations are promises. When you call them they return promise which
   * resolve relation result then. In summary, it will load the relation when
   * we want. In this case we could do:
   *
   * const user = await appointment.user;
   */
  @ManyToOne(() => User)
  @JoinColumn({ name: 'provider_id' })
  provider: User;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('timestamp with time zone')
  date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Appointment;
