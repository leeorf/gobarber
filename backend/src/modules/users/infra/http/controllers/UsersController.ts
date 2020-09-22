import { Request, Response } from 'express';
import { container } from 'tsyringe';
/*
classToClass take one or more classes and apply what was used from class transformer.
In this case Exclude and Expose from src/modules/users/infra/typeorm/entities/User.ts
*/
import { classToClass } from 'class-transformer';
import CreateUserService from '@modules/users/services/CreateUserService';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    return response.json(classToClass(user));
  }
}
