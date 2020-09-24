import { uuid } from 'uuidv4';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserToken from '../../infra/typeorm/entities/UserToken';

class FakeUserTokensRepository implements IUserTokensRepository {
  private userTokens: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.userTokens.push(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = this.userTokens.find(
      findToken => token === findToken.token,
    );

    return userToken;
  }

  public async deleteToken(token: UserToken): Promise<void> {
    const indexToRemove = this.userTokens.findIndex(
      userToken => userToken === token,
    );

    this.userTokens.splice(indexToRemove, 1);
  }
}

export default FakeUserTokensRepository;
