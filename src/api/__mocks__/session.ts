let _client

export function getClient() {
  if (!_client) {
    _client = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      defaults: {
        baseURL: '/test-api-root',
        timeout: 10000,
      },
    }
  }
  return _client
}

export function initialize(): boolean {
  _client = null
  return true
}
