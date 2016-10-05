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

import * as moment from 'moment'
import {getClient} from './session'
import {importByDataId, importByJobId} from '../utils/import-job-record'
import * as worker from './workers/jobs'
import {
  JOBS_WORKER_INTERVAL,
  JOBS_WORKER_JOB_TTL,
  SCHEMA_VERSION,
} from '../config'

import {
  REQUIREMENT_BANDS,
  STATUS_RUNNING,
  TYPE_JOB,
} from '../constants'

interface ParamsCreateJob {
  algorithm: beachfront.Algorithm
  catalogApiKey: string
  executorServiceId: string
  name: string
  scene: beachfront.Scene
}

export function createJob({
  catalogApiKey,
  executorServiceId,
  name,
  algorithm,
  scene,
}: ParamsCreateJob): Promise<beachfront.Job> {
  const client = getClient()
  return client.post('execute-service', {
    dataInputs: {
      body: {
        content: JSON.stringify({
          algoType:      algorithm.type,
          bands:         algorithm.requirements.find(a => a.name === REQUIREMENT_BANDS).literal.split(','),
          dbAuthToken:   catalogApiKey,
          jobName:       name,
          metaDataURL:   scene.properties.link,
          pzAuthToken:   client.sessionToken,
          pzAddr:        client.gateway,
          svcURL:        algorithm.url,
          tideURL:       'https://bf-tideprediction.stage.geointservices.io/',  // HACK
        }),
        type:     'body',
        mimeType: 'application/json',
      },
    },
    dataOutput: [
      {
        mimeType: 'application/json',
        type:     'text',
      },
    ],
    serviceId: executorServiceId,
  })
    .then(id => ({
      id,
      geometry: scene.geometry,
      properties: {
        __schemaVersion__: SCHEMA_VERSION,
        algorithmName:     algorithm.name,
        createdOn:         moment().toISOString(),
        name:              name,
        sceneCaptureDate:  moment(scene.properties.acquiredDate).toISOString(),
        sceneId:           scene.id,
        sceneSensorName:   scene.properties.sensorName,
        status:            STATUS_RUNNING,
        type:              TYPE_JOB,
      },
      type: 'Feature',
    }))
    .catch(err => {
      console.error('(jobs:create) could not execute:', err)
      throw err
    })
}

interface ParamsImportJob {
  jobId?: string
  dataId?: string
  algorithms: beachfront.Algorithm[]
}

export function importJob({
  jobId,
  dataId,
  algorithms,
}: ParamsImportJob) {
  const client = getClient()
  const algorithmNames = generateAlgorithmNamesHash(algorithms)
  const promise = dataId
    ? importByDataId(client, dataId, algorithmNames)
    : importByJobId(client, jobId, algorithmNames)
  return promise
    .catch(err => {
      console.error('(jobs:importJob) failed:', err)
      throw err
    })
}

export function startWorker({
  getRecords,
  onTerminate,
  onUpdate,
  onError,
}: {
  getRecords(): beachfront.Job[]
  onTerminate(): void
  onUpdate(job: beachfront.Job): void
  onError(error: any): void
}) {
  worker.start({
    client:   getClient(),
    interval: JOBS_WORKER_INTERVAL,
    ttl:      JOBS_WORKER_JOB_TTL,
    onError,
    onTerminate,

    getRunningJobs() {
      return getRecords().filter(j => j.properties.status === STATUS_RUNNING)
    },

    onUpdate(jobId, status, geojsonDataId, wmsLayerId, wmsUrl) {
      const record = getRecords().find(j => j.id === jobId)
      const updatedRecord = Object.assign({}, record, {
        properties: Object.assign({}, record.properties, {
          detectionsDataId:  geojsonDataId,
          detectionsLayerId: wmsLayerId,
          status:            status,
        }),
      })
      onUpdate(updatedRecord)
    },
  })
}

export function stopWorker() {
  worker.terminate()
}

function generateAlgorithmNamesHash(algorithms): Map<string, string> {
  const hash = new Map<string, string>()
  for (const algorithm of algorithms) {
    hash[algorithm.url] = algorithm.name
  }
  return hash
}
