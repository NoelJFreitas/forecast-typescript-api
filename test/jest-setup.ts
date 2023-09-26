import { SetupServer } from '@src/server';
import supertest, { SuperTest } from 'supertest';

beforeAll(() => {
  const server = new SetupServer();
  server.init();
  global.testRequest = supertest(server.getApp());
});
