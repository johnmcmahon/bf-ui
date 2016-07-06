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
import LoadingAnimation from './LoadingAnimation'
import StaticMinimap from './StaticMinimap'
import Slider from './Slider'
import styles from './ImagerySearch.css'

export default class ImagerySearch extends Component {
  static propTypes = {
    bbox:               React.PropTypes.array.isRequired,
    catalogApiKey:      React.PropTypes.string,
    cloudCover:         React.PropTypes.number.isRequired,
    dateFrom:           React.PropTypes.string.isRequired,
    dateTo:             React.PropTypes.string.isRequired,
    error:              React.PropTypes.object,
    isSearching:        React.PropTypes.bool.isRequired,
    onApiKeyChange:     React.PropTypes.func.isRequired,
    onDateChange:       React.PropTypes.func.isRequired,
    onClearBbox:        React.PropTypes.func.isRequired,
    onCloudCoverChange: React.PropTypes.func.isRequired,
    onSubmit:           React.PropTypes.func.isRequired
  }

  constructor() {
    super()
    this._emitApiKeyChange = this._emitApiKeyChange.bind(this)
    this._emitDateChange = this._emitDateChange.bind(this)
    this._handleSubmit = this._handleSubmit.bind(this)
  }

  componentDidMount() {
    this.refs.dateFrom.value = this.props.dateFrom
    this.refs.dateTo.value = this.props.dateTo
    this.refs.apiKey.value = this.props.catalogApiKey || ''
  }

  render() {
    const {error, bbox, cloudCover, isSearching} = this.props
    return (
      <form className={`${styles.root} ${isSearching ? styles.isSearching : ''}`} onSubmit={this._handleSubmit}>
        <h2>Search for Imagery</h2>
        <div className={styles.minimap}>
          <StaticMinimap bbox={bbox}/>
          <div className={styles.clearBbox} onClick={this.props.onClearBbox}>
            <i className="fa fa-times-circle"/> Clear
          </div>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            <h4><i className="fa fa-warning"/> Search failed</h4>
            <p>Could not search the image catalog because of an error.</p>
            <pre>{error.stack}</pre>
          </div>
        )}
        <h3>Catalog</h3>
        <label className={styles.field}>
          <span>Provider</span>
          <select disabled={true}>
            <option>Planet Labs (LANDSAT)</option>
          </select>
        </label>
        <label className={styles.field}>
          <span>API Key</span>
          <input ref="apiKey" type="password" disabled={isSearching} onChange={this._emitApiKeyChange} />
        </label>

        <h3>Date/Time</h3>
        <label className={styles.field}>
          <span>From</span>
          <input ref="dateFrom" type="date" disabled={isSearching} onChange={this._emitDateChange} />
        </label>
        <label className={styles.field}>
          <span>To</span>
          <input ref="dateTo" type="date" disabled={true} />
        </label>

        <h3>Cloud Cover</h3>
        <Slider
          className={styles.slider}
          value={cloudCover}
          onChange={this.props.onCloudCoverChange}
        />

        <div className={styles.controls}>
          <button disabled={!this._canSubmit}>Search for imagery</button>
        </div>

        <div className={styles.loadingMask}>
          <LoadingAnimation className={styles.loadingAnimation}/>
        </div>
      </form>
    )
  }

  //
  // Internals
  //

  get _canSubmit() {
    return this.props.isSearching === false
        && this.props.catalogApiKey
        && this.props.dateFrom
        && this.props.dateTo
  }

  _emitApiKeyChange() {
    this.props.onApiKeyChange(this.refs.apiKey.value)
  }

  _emitDateChange() {
    const {dateFrom, dateTo} = this.refs
    this.props.onDateChange(dateFrom.value, dateTo.value)
  }

  _handleSubmit(event) {
    event.preventDefault()
    event.stopPropagation()
    this.props.onSubmit()
  }
}