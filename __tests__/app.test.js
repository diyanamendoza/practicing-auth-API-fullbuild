const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

// mock user for testing
const mockUser = {
  email: 'test@example.com',
  password: '12345',
};

// create agent for cookie persistence
const agent = request.agent(app);

describe('backend routes', () => {
  beforeAll(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('creates a new user', async () => {
    const res = await request(app).post('/api/v1/users').send(mockUser);
    const { email } = mockUser;

    expect(res.body).toEqual({
      id: expect.any(String),
      email,
    });
  });

  it('logs a user in', async () => {
    const res = await agent.post('/api/v1/users/sessions').send(mockUser);

    expect(res.body).toEqual({
      message: 'You are now logged in.',
    });
  });

  it('allows a logged in user to view secrets', async () => {
    const res = await agent.get('/api/v1/secrets');

    expect(res.body).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(String),
          createdAt: expect.any(String),
          title: 'can i tell you',
          description: 'a secret?',
        },
      ])
    );
  });

  it('allows a logged in user to post a secret', async () => {
    const res = await agent
      .post('/api/v1/secrets')
      .send({ title: 'sample title', description: 'sample description' });

    expect(res.body).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      title: 'sample title',
      description: 'sample description',
    });
  });

  it('logs a user out', async () => {
    const res = await agent.delete('/api/v1/users/sessions').send(mockUser);

    expect(res.body).toEqual({
      success: true,
      message: 'You are now logged out.',
    });
  });

  it('does not allow a logged out user to view secrets', async () => {
    const res = await agent.get('/api/v1/secrets');

    expect(res.body).toEqual({
      message: 'You must be signed in to continue',
      status: 401,
    });
  });

  it('does not allow a logged out user to post secrets', async () => {
    const res = await agent
      .post('/api/v1/secrets')
      .send({ title: 'sample title', description: 'sample description' });

    expect(res.body).toEqual({
      message: 'You must be signed in to continue',
      status: 401,
    });
  });
});
