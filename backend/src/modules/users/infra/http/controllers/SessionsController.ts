import { Request, Response } from 'express';
import { container } from 'tsyringe';
/*
classToClass take one or more classes and apply what was used from class transformer.
In this case Exclude and Expose from src/modules/users/infra/typeorm/entities/User.ts
*/
import { classToClass } from 'class-transformer';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUser = container.resolve(AuthenticateUserService);

    const { user, token } = await authenticateUser.execute({
      email,
      password,
    });

    return response.json({ user: classToClass(user), token });
  }
}
