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

import {getClient} from './session'

export interface ParamsCreateProductline {
  algorithmId: string
  bbox: [number, number, number, number]
  category: string
  dateStart: string
  dateStop: string
  maxCloudCover: number
  name: string
}

export function create({
  algorithmId,
  bbox,
  category,
  dateStart,
  dateStop,
  maxCloudCover,
  name,
}: ParamsCreateProductline): Promise<beachfront.ProductLine> {
  const [minX, minY, maxX, maxY] = bbox
  return getClient().post<ResponseProductLineCreated>('/v0/productline', {
    algorithm_id:      algorithmId,
    category:          category,
    max_cloud_cover:   maxCloudCover,
    min_x:             minX,
    min_y:             minY,
    max_x:             maxX,
    max_y:             maxY,
    name:              name,
    spatial_filter_id: null,
    start_on:          dateStart,
    stop_on:           dateStop,
  })
    .then(response => response.data.product_line)
    .catch(err => {
      console.error('(productLines:create) failed:', err)
      throw err
    })
}

export function fetchJobs({
  productLineId,
  sinceDate,
  algorithms,
}) {
  return getClient().get<ResponseJobListing>(`/v0/job/by_productline/${productLineId}`)
    .then(response => response.data.jobs.features)
    .catch(err => {
      console.error('(productLines:fetchJobs) failed:', err)
      throw err
    })
}

export function fetchProductLines(): Promise<beachfront.ProductLine[]> {
  return getClient().get<ResponseProductLineList>('/v0/productline')
    .then(response => response.data.product_lines.features)
    .catch(err => {
      console.error('(productLines:fetchProductLines) failed:', err)
      throw err
    })
}

//
// Helpers
//

interface ResponseProductLineCreated {
  product_line: beachfront.ProductLine
}

interface ResponseProductLineList {
  product_lines: {
    features: beachfront.ProductLine[]
  }
}

interface ResponseJobListing {
  jobs: {
    features: beachfront.Job[]
  }
}
