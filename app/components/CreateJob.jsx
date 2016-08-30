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

import React, {Component} from 'react'
import moment from 'moment'
import AlgorithmList from './AlgorithmList'
import ImagerySearch from './ImagerySearch'
import NewJobDetails from './NewJobDetails'
import {createJob} from '../api/jobs'
import styles from './CreateJob.css'

export const createSearchCriteria = () => ({
  cloudCover: 10,
  dateFrom:   moment().subtract(30, 'days').format('YYYY-MM-DD'),
  dateTo:     moment().format('YYYY-MM-DD'),
  filter:     '',
})

export class CreateJob extends Component {
  static propTypes = {
    algorithms:               React.PropTypes.array.isRequired,
    bbox:                     React.PropTypes.arrayOf(React.PropTypes.number),
    catalogApiKey:            React.PropTypes.string,
    executorServiceId:        React.PropTypes.string.isRequired,
    searchCriteria:           React.PropTypes.shape({
      cloudCover:               React.PropTypes.number.isRequired,
      dateFrom:                 React.PropTypes.string.isRequired,
      dateTo:                   React.PropTypes.string.isRequired,
      filter:                   React.PropTypes.string,
    }).isRequired,
    filters:                  React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    isSearching:              React.PropTypes.bool.isRequired,
    onCatalogApiKeyChange:    React.PropTypes.func.isRequired,
    onClearBbox:              React.PropTypes.func.isRequired,
    onJobCreated:             React.PropTypes.func.isRequired,
    onSearchCriteriaChange:   React.PropTypes.func.isRequired,
    onSearchSubmit:           React.PropTypes.func.isRequired,
    searchError:              React.PropTypes.object,
    selectedImage:            React.PropTypes.object,
    sessionToken:             React.PropTypes.string.isRequired,
  }

  constructor() {
    super()
    this.state = {
      isCreating: false,
      name: '',
      shouldAutogenerateName: true,
    }
    this._handleCreateJob = this._handleCreateJob.bind(this)
    this._handleNameChange = this._handleNameChange.bind(this)
    this._handleSearchCloudCoverChange = this._handleSearchCloudCoverChange.bind(this)
    this._handleSearchDateChange = this._handleSearchDateChange.bind(this)
    this._handleSearchFilterChange = this._handleSearchFilterChange.bind(this)
  }

  componentDidMount() {
    const shorelinefilter = this.props.filters.find(f => /(coast|shore)line/i.test(f.name))
    if (shorelinefilter) {
      this._handleSearchFilterChange(shorelinefilter.id)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.shouldAutogenerateName && nextProps.selectedImage && nextProps.selectedImage !== this.props.selectedImage) {
      this.setState({ name: nextProps.selectedImage.id.replace(/^landsat:/, '') })
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
                onCloudCoverChange={this._handleSearchCloudCoverChange}
                onDateChange={this._handleSearchDateChange}
                onFilterChange={this._handleSearchFilterChange}
                onSubmit={this.props.onSearchSubmit}
              />
            </li>
          )}
          {this.props.bbox && this.props.selectedImage && (
            <li className={styles.details}>
              <NewJobDetails
                name={this.state.name}
                onNameChange={this._handleNameChange}
              />
            </li>
          )}
          {this.props.bbox && this.props.selectedImage && (
            <li className={styles.algorithms}>
              <AlgorithmList
                algorithms={this.props.algorithms}
                imageProperties={this.props.selectedImage.properties}
                isSubmitting={this.state.isCreating}
                onSubmit={this._handleCreateJob}
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

  _handleCreateJob(algorithm) {
    createJob({
      algorithm,
      catalogApiKey:     this.props.catalogApiKey,
      executorServiceId: this.props.executorServiceId,
      image:             this.props.selectedImage,
      name:              this.state.name,
      sessionToken:      this.props.sessionToken,
    })
      .then(job => {
        // Reset Search Criteria
        this.props.onSearchCriteriaChange(createSearchCriteria())

        // Release the job
        this.props.onJobCreated(job)
      })
  }

  _handleSearchCloudCoverChange(cloudCover) {
    this.props.onSearchCriteriaChange(Object.assign({}, this.props.searchCriteria, {
      cloudCover: parseInt(cloudCover, 10),
    }))
  }

  _handleSearchDateChange(dateFrom, dateTo) {
    this.props.onSearchCriteriaChange(Object.assign({}, this.props.searchCriteria, {
      dateFrom,
      dateTo,
    }))
  }

  _handleSearchFilterChange(filter) {
    this.props.onSearchCriteriaChange(Object.assign({}, this.props.searchCriteria, {
      filter,
    }))
  }


  _handleNameChange(name) {
    this.setState({
      name,
      shouldAutogenerateName: !name,
    })
  }
}
