/**
 * Copyright 2016, RadiantBlue Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
import {Sinon} from 'sinon'
import * as session from '../../src/api/session'
import * as geoserver from '../../src/api/geoserver'

jest.unmock('../../src/api/session')

interface FakeClient {
  get: Sinon.SinonStub,
  post: Sinon.SinonStub,
  put: Sinon.SinonStub,
  delete: Sinon.SinonStub,
}

describe('GeoServer Service', () => {
  let client: FakeClient

  beforeEach(() => {
    client = session.getClient()
    client.get = jest.fn()
  })

  afterEach(() => {
    // Don't do anything for now
  })

  describe('discover()', () => {
    it('returns WMS URL', () => {
      client.get.mockReturnValue(resolve({geoserver: 'test-wms-url'}))
      return geoserver.lookup()
        .then(descriptor => {
          expect(descriptor.wmsUrl).toBe('test-wms-url/wms')
        })
    })

    it('fails to return wms url', () => {
      client.get.mockRejectedValue(new Error('Failure'))
      return geoserver.lookup()
        .catch(error => {
          expect(error.message).toBe('Failure')
        })
    })
  })
  })
//
// Helpers
//

function resolve(data) {
  return Promise.resolve({
    data,
  })
}

function reject(err, response = {}): Promise<void> {
  return Promise.reject(Object.assign(new Error(err), {
    response,
  }))
}

