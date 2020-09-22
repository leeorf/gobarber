import {
  ObjectID,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  ObjectIdColumn,
} from 'typeorm';

@Entity('notifications')
class Notification {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  content: string;

  @Column('uuid')
  recipient_id: string;

  /* We pass the default here because for MongoDB we don't have migrations,
  so we can't define a default value for a field in the database. We define
  all default values inside the application itself
  */
  @Column({ default: false })
  read: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Notification;
