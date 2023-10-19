import { Controller, Post } from '@overnightjs/core';
import { User } from '@src/models/user';
import { Request, Response } from 'express';
import { BaseController } from '.';
import AuthService from '@src/services/auth';

@Controller('users')
export class UsersController extends BaseController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const user = new User(req.body);
      const newUser = await user.save();
      res.status(201).send(newUser);
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error as Error);
    }
  }

  @Post('authenticate')
  public async authenticate(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).send({ code: 401, error: 'user not found' });
      return;
    }
    if (!(await AuthService.comparePasswords(password, user.password))) {
      res.status(401).send({ code: 401, error: 'password does not match' });
      return;
    }

    const token = AuthService.generateToken(user.toJSON());
    res.status(200).send({ token: token });
  }
}
