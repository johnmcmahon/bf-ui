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

const styles = require('./CreateProductLine.css')

import * as React from 'react'
import * as moment from 'moment'
import {AlgorithmList} from './AlgorithmList'
import {CatalogSearchCriteria} from './CatalogSearchCriteria'
import {NewProductLineDetails} from './NewProductLineDetails'
import {create} from '../api/productLines'
import {
  SOURCE_DEFAULT,
} from '../constants'

interface Props {
  algorithms:        beachfront.Algorithm[]
  bbox:              [number, number, number, number]
  catalogApiKey:     string

  onCatalogApiKeyChange(apiKey: string)
  onClearBbox()
  onProductLineCreated(productLine: beachfront.ProductLine)
}

interface State {
  algorithm?:              beachfront.Algorithm
  cloudCover?:             number
  dateStart?:              string
  dateStop?:               string
  error?:                  any
  isCreating?:             boolean
  name?:                   string
  shouldAutogenerateName?: boolean
  source?:                 string
}

export class CreateProductLine extends React.Component<Props, State> {
  constructor() {
    super()
    this.state = {
      algorithm:  null,
      cloudCover: 10,
      dateStart:  moment().format('YYYY-MM-DD'),
      dateStop:   '',
      isCreating: false,
      name:       '',
      shouldAutogenerateName: true,
      source: SOURCE_DEFAULT,
    }
    this.handleAlgorithmSelect = this.handleAlgorithmSelect.bind(this)
    this.handleSourceChange = this.handleSourceChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  render() {
    return (
      <div className={`${styles.root} ${this.canSubmit ? styles.canSubmit : ''}`}>
        <header>
          <h1>Create Product Line</h1>
        </header>
        <ul>
          {!this.props.bbox ? (
            <li className={styles.placeholder}>
              <h3>Draw bounding box to set AOI</h3>
            </li>
          ) : (
            <li>
              <h2>Source Imagery</h2>
              <CatalogSearchCriteria
                apiKey={this.props.catalogApiKey}
                bbox={this.props.bbox}
                cloudCover={this.state.cloudCover}
                source={this.state.source}
                onApiKeyChange={this.props.onCatalogApiKeyChange}
                onClearBbox={this.props.onClearBbox}
                onCloudCoverChange={cloudCover => this.setState({ cloudCover })}
                onSourceChange={this.handleSourceChange}
              />
              <NewProductLineDetails
                name={this.state.name}
                dateStart={this.state.dateStart}
                dateStop={this.state.dateStop}
                onDateChange={(dateStart, dateStop) => this.setState({ dateStart, dateStop })}
                onNameChange={name => this.setState({ name, shouldAutogenerateName: !name })}
              />
              <AlgorithmList
                algorithms={this.props.algorithms}
                sceneMetadata={{
                  cloudCover: this.state.cloudCover,
                } as any}
                selectedId={this.state.algorithm ? this.state.algorithm.id : null}
                onSelect={this.handleAlgorithmSelect}
                warningHeading="Check Image Search Filters"
                warningMessage={`
                  Current image search filters may yield imagery that do not meet all of this
                  algorithm's requirements.  You can continue anyway, but it may not produce
                  the expected results.
                `}
              />
            </li>
          )}
        </ul>
        <div className={styles.controls}>
          {this.canSubmit && (
            <div className={styles.submitButton} onClick={this.handleSubmit}>
              Create Product Line
            </div>
          )}
        </div>
      </div>
    )
  }

  private get canSubmit() {
    return this.props.bbox
        && this.state.algorithm
        && this.state.dateStart
        && this.state.name
  }

  private handleAlgorithmSelect(algorithm: beachfront.Algorithm) {
    this.setState({
      name: this.state.shouldAutogenerateName ? generateName(this.state.source, algorithm) : this.state.name,
      algorithm,
    })
  }

  private handleSourceChange(source: string) {
    this.setState({
      name: this.state.shouldAutogenerateName ? generateName(source, this.state.algorithm) : this.state.name,
      source,
    })
  }

  private handleSubmit() {
    create({
      algorithmId:   this.state.algorithm.id,
      bbox:          this.props.bbox,
      category:      null,
      dateStart:     this.state.dateStart,
      dateStop:      this.state.dateStop,
      maxCloudCover: this.state.cloudCover,
      name:          this.state.name,
    })
      .then(this.props.onProductLineCreated)
      .catch(error => {
        this.setState({ error })
        throw error
      })
  }
}

//
// Helpers
//

function generateName(source: string, algorithm: beachfront.Algorithm) {
  return algorithm ? `${source}_${algorithm.name}`.toUpperCase() : ''
}
