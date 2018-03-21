let _spy = {}

export const getClient = jest.fn()

export function createSpy(props) {
  _spy = {
    'get': jest.fn(),
    'post': jest.fn(),
    ...props,
  }

  getClient.mockReturnValue(_spy)

  return _spy
}

export function mockGet(response) {
  _spy = {get: null}
  getClient.mockReturnValue(_spy)

  if (response.status > 399) {
    _spy.get = jest.fn(() => Promise.reject({response}))
    return
  }
  _spy.get = jest.fn(() => Promise.resolve(response))

}

export function destroySpy() {
  getClient.mockReset()  // or .mockClear()???
  _spy = {}
}

export function mockInitialize(response) {
  return response
}
