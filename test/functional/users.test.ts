import { User } from '@src/models/user';

describe('users functional tests', () => {
  describe('When creating a new user', () => {
    beforeEach(async () => {
      await User.deleteMany({});
    });

    it('should successfully create a new user', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        password: '1234',
      };

      const response = await global.testRequest.post('/users').send(newUser);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(newUser));
    });
  });
});
