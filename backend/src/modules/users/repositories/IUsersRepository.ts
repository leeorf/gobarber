import User from '../infra/typeorm/entities/User';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '../dtos/IFindAllProvidersDTO';

export default interface IUsersRepository {
  // Method to be called on appointments domain.
  // The method findAllProviders is not very clear what we need to pass to
  // the method. So we are going to pass the argument as an object
  // Every time we use an object, we create a DTO
  findAllProviders(data: IFindAllProvidersDTO): Promise<User[]>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  // As we are going to receive more than one information on create()
  // we create a dto.
  create(data: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
}
