import { injectable, inject } from 'tsyringe';
import { classToClass } from 'class-transformer';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import User from '@modules/users/infra/typeorm/entities/User';

interface IRequestDTO {
  user_id: string;
}

@injectable()
class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ user_id }: IRequestDTO): Promise<User[]> {
    /**
     * <User[]> is a Type argument. This way we can set recover to return
     * whatever we want. See recover() methods definition on ICacheProvider.ts
     * */
    let users = await this.cacheProvider.recover<User[]>(
      `providers-list:${user_id}`,
    );

    if (!users) {
      // The method findAllProviders is not very clear what we need to pass to
      // the method. So we are going to pass the argument as an object
      users = await this.usersRepository.findAllProviders({
        except_user_id: user_id,
      });

      /**
       * We need to make a cache for a specific provider, otherwise, for every
       * user trying to list the providers service, we are going to share the
       * same cache. Remember that we retrieve a list of providers except the user
       * who is logged in, thus the cache needs to be different for each user
       *
       * On Redis a colon (:) means that we are creating a sublevel
       */
      await this.cacheProvider.save(
        `providers-list:${user_id}`,
        classToClass(users),
      );
    }

    return users;
  }
}

export default ListProvidersService;
