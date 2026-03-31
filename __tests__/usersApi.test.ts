const mockGet = jest.fn();

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: jest.fn(() => ({ get: mockGet })),
    isAxiosError: (value: unknown) =>
      Boolean(value && typeof value === 'object' && 'isAxiosError' in value),
  },
}));

const { fetchUsersRequest } = require('../src/services/usersApi');

describe('fetchUsersRequest', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('falls back to fetch when axios reports a network error', async () => {
    mockGet.mockRejectedValueOnce({
      isAxiosError: true,
      message: 'Network Error',
      code: 'ERR_NETWORK',
    });

    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [
        {
          id: 1,
          name: 'Leanne Graham',
          username: 'Bret',
          email: 'leanne@example.com',
          phone: '1-770-736-8031 x56442',
          website: 'hildegard.org',
          company: {
            name: 'Romaguera-Crona',
            catchPhrase: 'Multi-layered client-server neural-net',
            bs: 'harness real-time e-markets',
          },
          address: {
            street: 'Kulas Light',
            suite: 'Apt. 556',
            city: 'Gwenborough',
            zipcode: '92998-3874',
            geo: { lat: '-37.3159', lng: '81.1496' },
          },
        },
      ],
    });

    const users = await fetchUsersRequest(1, 10);

    expect(users).toHaveLength(1);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://jsonplaceholder.typicode.com/users?_page=1&_limit=10',
      expect.objectContaining({ method: 'GET' }),
    );
  });
});
