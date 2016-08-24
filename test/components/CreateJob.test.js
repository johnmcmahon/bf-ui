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

import React from 'react'
import {shallow} from 'enzyme'
import expect, {createSpy} from 'expect'
import {CreateJob} from 'app/components/CreateJob'

describe('<CreateJob/>', () => {
  let _props

  beforeEach(() => {
    _props = {
      algorithms:               [],
      bbox:                     [0, 0, 0, 0],
      catalogApiKey:            'test-catalog-api-key',
      cloudCover:               10,
      dateFrom:                 '2016-01-01',
      dateTo:                   '2016-12-31',
      filter:                   '',
      filters:                  [],
      isCreating:               false,
      isSearching:              false,
      jobName:                  'test-name',
      searchError:              null,
      selectedImage:            {
        id:         'test-id',
        properties: {},
      },
      onCatalogApiKeyChange:    createSpy(),
      onClearBbox:              createSpy(),
      onJobSubmit:              createSpy(),
      onNameChange:             createSpy(),
      onResetName:              createSpy(),
      onSearchCloudCoverChange: createSpy(),
      onSearchDateChange:       createSpy(),
      onSearchFilterChange:     createSpy(),
      onSearchSubmit:           createSpy(),
    }
  })

  it('renders', () => {
    const wrapper = shallow(
      <CreateJob
        algorithms={_props.algorithms}
        bbox={_props.bbox}
        catalogApiKey={_props.catalogApiKey}
        cloudCover={_props.cloudCover}
        dateFrom={_props.dateFrom}
        dateTo={_props.dateTo}
        searchError={_props.searchError}
        filter={_props.filter}
        filters={_props.filters}
        isCreating={_props.isCreating}
        isSearching={_props.isSearching}
        jobName={_props.jobName}
        selectedImage={_props.selectedImage}
        onCatalogApiKeyChange={_props.onCatalogApiKeyChange}
        onClearBbox={_props.onClearBbox}
        onJobSubmit={_props.onJobSubmit}
        onNameChange={_props.onNameChange}
        onResetName={_props.onResetName}
        onSearchCloudCoverChange={_props.onSearchCloudCoverChange}
        onSearchDateChange={_props.onSearchDateChange}
        onSearchFilterChange={_props.onSearchFilterChange}
        onSearchSubmit={_props.onSearchSubmit}
      />
    )
    expect(wrapper.find('.CreateJob-root').length).toEqual(1)
    expect(wrapper.find('.CreateJob-placeholder').length).toEqual(0)
    expect(wrapper.find('.CreateJob-search').length).toEqual(1)
    expect(wrapper.find('.CreateJob-details').length).toEqual(1)
    expect(wrapper.find('.CreateJob-algorithms').length).toEqual(1)
  })

  it('shows placeholder if bbox does not exist', () => {
    const wrapper = shallow(
      <CreateJob
        algorithms={_props.algorithms}
        bbox={null}
        catalogApiKey={_props.catalogApiKey}
        cloudCover={_props.cloudCover}
        dateFrom={_props.dateFrom}
        dateTo={_props.dateTo}
        searchError={_props.searchError}
        filter={_props.filter}
        filters={_props.filters}
        isCreating={_props.isCreating}
        isSearching={_props.isSearching}
        jobName={_props.jobName}
        selectedImage={null}
        onCatalogApiKeyChange={_props.onCatalogApiKeyChange}
        onClearBbox={_props.onClearBbox}
        onJobSubmit={_props.onJobSubmit}
        onNameChange={_props.onNameChange}
        onResetName={_props.onResetName}
        onSearchCloudCoverChange={_props.onSearchCloudCoverChange}
        onSearchDateChange={_props.onSearchDateChange}
        onSearchFilterChange={_props.onSearchFilterChange}
        onSearchSubmit={_props.onSearchSubmit}
      />
    )
    expect(wrapper.find('.CreateJob-placeholder').length).toEqual(1)
  })

  it('hides imagery search if no bbox exists', () => {
    const wrapper = shallow(
      <CreateJob
        algorithms={_props.algorithms}
        bbox={null}
        catalogApiKey={_props.catalogApiKey}
        cloudCover={_props.cloudCover}
        dateFrom={_props.dateFrom}
        dateTo={_props.dateTo}
        searchError={_props.searchError}
        filter={_props.filter}
        filters={_props.filters}
        isCreating={_props.isCreating}
        isSearching={_props.isSearching}
        jobName={_props.jobName}
        selectedImage={null}
        onCatalogApiKeyChange={_props.onCatalogApiKeyChange}
        onClearBbox={_props.onClearBbox}
        onJobSubmit={_props.onJobSubmit}
        onNameChange={_props.onNameChange}
        onResetName={_props.onResetName}
        onSearchCloudCoverChange={_props.onSearchCloudCoverChange}
        onSearchDateChange={_props.onSearchDateChange}
        onSearchFilterChange={_props.onSearchFilterChange}
        onSearchSubmit={_props.onSearchSubmit}
      />
    )
    expect(wrapper.find('.CreateJob-search').length).toEqual(0)
  })

  it('hides job details if no image is selected', () => {
    const wrapper = shallow(
      <CreateJob
        algorithms={_props.algorithms}
        bbox={_props.bbox}
        catalogApiKey={_props.catalogApiKey}
        cloudCover={_props.cloudCover}
        dateFrom={_props.dateFrom}
        dateTo={_props.dateTo}
        searchError={_props.searchError}
        filter={_props.filter}
        filters={_props.filters}
        isCreating={_props.isCreating}
        isSearching={_props.isSearching}
        jobName={_props.jobName}
        selectedImage={null}
        onCatalogApiKeyChange={_props.onCatalogApiKeyChange}
        onClearBbox={_props.onClearBbox}
        onJobSubmit={_props.onJobSubmit}
        onNameChange={_props.onNameChange}
        onResetName={_props.onResetName}
        onSearchCloudCoverChange={_props.onSearchCloudCoverChange}
        onSearchDateChange={_props.onSearchDateChange}
        onSearchFilterChange={_props.onSearchFilterChange}
        onSearchSubmit={_props.onSearchSubmit}
      />
    )
    expect(wrapper.find('.CreateJob-details').length).toEqual(0)
  })

  it('hides algorithms if no image is selected', () => {
    const wrapper = shallow(
      <CreateJob
        algorithms={_props.algorithms}
        bbox={_props.bbox}
        catalogApiKey={_props.catalogApiKey}
        cloudCover={_props.cloudCover}
        dateFrom={_props.dateFrom}
        dateTo={_props.dateTo}
        searchError={_props.searchError}
        filter={_props.filter}
        filters={_props.filters}
        isCreating={_props.isCreating}
        isSearching={_props.isSearching}
        jobName={_props.jobName}
        selectedImage={null}
        onCatalogApiKeyChange={_props.onCatalogApiKeyChange}
        onClearBbox={_props.onClearBbox}
        onJobSubmit={_props.onJobSubmit}
        onNameChange={_props.onNameChange}
        onResetName={_props.onResetName}
        onSearchCloudCoverChange={_props.onSearchCloudCoverChange}
        onSearchDateChange={_props.onSearchDateChange}
        onSearchFilterChange={_props.onSearchFilterChange}
        onSearchSubmit={_props.onSearchSubmit}
      />
    )
    expect(wrapper.find('.CreateJob-algorithms').length).toEqual(0)
  })
})
