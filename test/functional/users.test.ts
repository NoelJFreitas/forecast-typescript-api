import { User } from '@src/models/user';
import AuthService from '@src/services/auth';

describe('users functional tests', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('When creating a new user', () => {
    it('should successfully create a new user with encrypted password', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        password: '1234',
      };

      const response = await global.testRequest.post('/users').send(newUser);

      expect(response.status).toBe(201);
      await expect(
        AuthService.comparePasswords(newUser.password, response.body.password)
      ).resolves.toBeTruthy();
      expect(response.body).toEqual(
        expect.objectContaining({
          ...newUser,
          ...{ password: expect.any(String) },
        })
      );
    });

    it('should return 400 when there is a validation error', async () => {
      const newUser = {
        email: 'john.doe@gmail.com',
        password: '1234',
      };

      const response = await global.testRequest.post('/users').send(newUser);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        code: 422,
        error: 'User validation failed: name: Path `name` is required.',
      });
    });

    it('should return 409 when the email already exists', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        password: '1234',
      };

      await global.testRequest.post('/users').send(newUser);
      const response = await global.testRequest.post('/users').send(newUser);

      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        code: 409,
        error: 'User validation failed: email: already exists in the database.',
      });
    });
  });

  describe('when authentication a user', () => {
    it('should generate a token for a valid user', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        password: '1234',
      };

      await new User(newUser).save();
      const response = await global.testRequest
        .post('/users/authenticate')
        .send({ email: newUser.email, password: newUser.password });

      expect(response.body).toEqual(
        expect.objectContaining({ token: expect.any(String) })
      );
    });

    it('should return UNAUTHORIZED if the user with the give email is not found', async () => {
      const response = await global.testRequest
        .post('/users/authenticate')
        .send({ email: 'some-email@gmail.com', password: '123' });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ code: 401, error: 'user not found' });
    });

    it('should return UNAUTHORIZED if the user is found but the password does not match', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        password: '1234',
      };

      await new User(newUser).save();
      const response = await global.testRequest
        .post('/users/authenticate')
        .send({ email: 'john.doe@gmail.com', password: 'wrong password' });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        code: 401,
        error: 'password does not match',
      });
    });
  });
});
