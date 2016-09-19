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

const styles: any = require('./CreateJob.css')

import * as React from 'react'
import * as moment from 'moment'
import {AlgorithmList} from './AlgorithmList'
import {ImagerySearch} from './ImagerySearch'
import {NewJobDetails} from './NewJobDetails'
import {createJob} from '../api/jobs'

export interface SearchCriteria {
  cloudCover: number
  dateFrom: string
  dateTo: string
  filter: string
}

interface Props {
  algorithms: beachfront.Algorithm[]
  bbox: number[]
  catalogApiKey: string
  executorServiceId: string
  filters: {id: string, name: string}[]
  isSearching: boolean
  searchError: any
  searchCriteria: SearchCriteria
  selectedScene: beachfront.Scene
  onCatalogApiKeyChange(apiKey: string)
  onClearBbox()
  onJobCreated(job: beachfront.Job)
  onSearchCriteriaChange(criteria: SearchCriteria)
  onSearchSubmit()
}

interface State {
  isCreating?: boolean
  name?: string
  shouldAutogenerateName?: boolean
}

export const createSearchCriteria = (): SearchCriteria => ({
  cloudCover: 10,
  dateFrom:   moment().subtract(30, 'days').format('YYYY-MM-DD'),
  dateTo:     moment().format('YYYY-MM-DD'),
  filter:     '',
})

export class CreateJob extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isCreating: false,
      name: props.selectedScene ? generateName(props.selectedScene.id) : '',
      shouldAutogenerateName: true,
    }
    this.handleCreateJob = this.handleCreateJob.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleSearchCloudCoverChange = this.handleSearchCloudCoverChange.bind(this)
    this.handleSearchDateChange = this.handleSearchDateChange.bind(this)
    this.handleSearchFilterChange = this.handleSearchFilterChange.bind(this)
  }

  componentDidMount() {
    const shorelineFilter = this.props.filters.find(f => /(coast|shore)line/i.test(f.name))
    if (shorelineFilter) {
      this.handleSearchFilterChange(shorelineFilter.id)
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.state.shouldAutogenerateName && nextProps.selectedScene && nextProps.selectedScene !== this.props.selectedScene) {
      this.setState({ name: generateName(nextProps.selectedScene.id) })
    }
  }

  render() {
    return (
      <div className={styles.root}>
        <header>
          <h1>Create Job</h1>
        </header>
        <ul>
          {this.props.bbox && (
            <li className={styles.search}>
              <ImagerySearch
                bbox={this.props.bbox}
                catalogApiKey={this.props.catalogApiKey}
                cloudCover={this.props.searchCriteria.cloudCover}
                dateFrom={this.props.searchCriteria.dateFrom}
                dateTo={this.props.searchCriteria.dateTo}
                error={this.props.searchError}
                filter={this.props.searchCriteria.filter}
                filters={this.props.filters}
                isSearching={this.props.isSearching}
                onApiKeyChange={this.props.onCatalogApiKeyChange}
                onClearBbox={this.props.onClearBbox}
                onCloudCoverChange={this.handleSearchCloudCoverChange}
                onDateChange={this.handleSearchDateChange}
                onFilterChange={this.handleSearchFilterChange}
                onSubmit={this.props.onSearchSubmit}
              />
            </li>
          )}
          {this.props.bbox && this.props.selectedScene && (
            <li className={styles.details}>
              <NewJobDetails
                name={this.state.name}
                onNameChange={this.handleNameChange}
              />
            </li>
          )}
          {this.props.bbox && this.props.selectedScene && (
            <li className={styles.algorithms}>
              <AlgorithmList
                algorithms={this.props.algorithms}
                imageProperties={this.props.selectedScene.properties}
                isSubmitting={this.state.isCreating}
                onSubmit={this.handleCreateJob}
              />
            </li>
          )}

          {!this.props.bbox && (
            <li className={styles.placeholder}>
              <h3>Draw bounding box to search for imagery</h3>
              <p>or</p>
              <button className={styles.uploadButton}>
                <i className="fa fa-upload"/> Upload my own image
              </button>
            </li>
          )}
        </ul>
      </div>
    )
  }

  private handleCreateJob(algorithm) {
    createJob({
      algorithm,
      catalogApiKey:     this.props.catalogApiKey,
      executorServiceId: this.props.executorServiceId,
      scene:             this.props.selectedScene,
      name:              this.state.name,
    })
      .then(job => {
        // Reset Search Criteria
        this.props.onSearchCriteriaChange(createSearchCriteria())

        // Release the job
        this.props.onJobCreated(job)
      })
  }

  private handleSearchCloudCoverChange(cloudCover) {
    this.props.onSearchCriteriaChange(Object.assign({}, this.props.searchCriteria, {
      cloudCover: parseInt(cloudCover, 10),
    }))
  }

  private handleSearchDateChange(dateFrom, dateTo) {
    this.props.onSearchCriteriaChange(Object.assign({}, this.props.searchCriteria, {
      dateFrom,
      dateTo,
    }))
  }

  private handleSearchFilterChange(filter) {
    this.props.onSearchCriteriaChange(Object.assign({}, this.props.searchCriteria, {
      filter,
    }))
  }

  private handleNameChange(name) {
    this.setState({
      name,
      shouldAutogenerateName: !name,
    })
  }
}

//
// Helpers
//

function generateName(sceneId): string {
  return sceneId.replace(/^landsat:/, '')
}
