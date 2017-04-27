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

const styles: any = require('./JobStatus.css')

import * as React from 'react'
import * as moment from 'moment'
import {Link} from './Link'
import {FileDownloadLink} from './FileDownloadLink'
import {Timestamp} from './Timestamp'

import {
  STATUS_SUCCESS,
  STATUS_RUNNING,
  STATUS_ERROR,
  STATUS_TIMED_OUT,
  DOWNLOAD_GEOJSON,
  DOWNLOAD_LANDSAT,
} from '../constants'

interface Props {
  className?: string
  isActive: boolean
  job: beachfront.Job
  onForgetJob(jobId: string)
  onNavigate(loc: {pathname: string, search: string, hash: string })
}

interface State {
  downloadJsonProgress?: number,
  isDownloadingJson?: boolean
  downloadRasterProgress?: number,
  isDownloadingRaster?: boolean
  isExpanded?: boolean
  isRemoving?: boolean
}

export class JobStatus extends React.Component<Props, State> {
  constructor() {
    super()
    this.state = {
      downloadJsonProgress: 0,
      isDownloadingJson: false,
      downloadRasterProgress: 0,
      isDownloadingRaster: false,
      isExpanded: false,
      isRemoving: false,
    }
    this.emitOnForgetJob        = this.emitOnForgetJob.bind(this)
    this.handleDownloadJsonComplete = this.handleDownloadJsonComplete.bind(this)
    this.handleDownloadJsonError    = this.handleDownloadJsonError.bind(this)
    this.handleDownloadJsonProgress = this.handleDownloadJsonProgress.bind(this)
    this.handleDownloadJsonStart    = this.handleDownloadJsonStart.bind(this)
    this.handleDownloadRasterComplete = this.handleDownloadRasterComplete.bind(this)
    this.handleDownloadRasterError    = this.handleDownloadRasterError.bind(this)
    this.handleDownloadRasterProgress = this.handleDownloadRasterProgress.bind(this)
    this.handleDownloadRasterStart    = this.handleDownloadRasterStart.bind(this)
    this.handleExpansionToggle  = this.handleExpansionToggle.bind(this)
    this.handleForgetToggle     = this.handleForgetToggle.bind(this)
  }

  render() {
    const {id, properties} = this.props.job
    const downloadPercentage = `${this.state.downloadJsonProgress || 0}%`
    return (
      <li className={`${styles.root} ${this.aggregatedClassNames}`}>
        <div className={styles.details} onClick={this.handleExpansionToggle}>
          <h3 className={styles.title}>
            <i className={`fa fa-chevron-right ${styles.caret}`}/>
            <span>{segmentIfNeeded(properties.name)}</span>
          </h3>

          <div className={styles.summary}>
            <span className={styles.status}>{properties.status}</span>
            <Timestamp
              className={styles.timer}
              timestamp={properties.created_on}
            />
          </div>

          <div className={styles.progressBar} title={downloadPercentage}>
            <div className={styles.puck} style={{width: downloadPercentage}}/>
          </div>

          <div className={styles.metadata} onClick={e => e.stopPropagation()}>
            <dl>
              <dt>Algorithm</dt>
              <dd>{properties.algorithm_name}</dd>
              <dt>Scene ID</dt>
              <dd>{normalizeSceneId(properties.scene_id)}</dd>
              <dt>Captured On</dt>
              <dd>{moment(properties.scene_time_of_collect).utc().format('MM/DD/YYYY HH:mm z')}</dd>
              <dt>Sensor</dt>
              <dd>{properties.scene_sensor_name}</dd>
            </dl>
            <div className={styles.removeToggle}>
              <button onClick={this.handleForgetToggle}>
                Remove this Job
              </button>
            </div>
            <div className={styles.removeWarning}>
              <h4>
                <i className="fa fa-warning"/> Are you sure you want to remove this job from your list?
              </h4>
              <button onClick={this.emitOnForgetJob}>Remove this Job</button>
              <button onClick={this.handleForgetToggle}>Cancel</button>
            </div>
          </div>
        </div>

        <div className={styles.controls}>
          <Link
            pathname="/"
            search={'?jobId=' + id}
            title="View on Map"
            onClick={this.props.onNavigate}>
            <i className="fa fa-globe"/>
          </Link>
          {properties.status === STATUS_SUCCESS && (
            <FileDownloadLink
              jobId={id}
              filename={properties.name + '.geojson'}
              className={styles.download}
              type={DOWNLOAD_GEOJSON}
              url={`/v0/job/${id}.geojson`}
              onProgress={this.handleDownloadJsonProgress}
              onStart={this.handleDownloadJsonStart}
              onComplete={this.handleDownloadJsonComplete}
              onError={this.handleDownloadJsonError}
            />
          )}
          {properties.status === STATUS_SUCCESS && (
            <FileDownloadLink
              jobId={id}
              filename={properties.name}
              className={styles.download}
              type={DOWNLOAD_LANDSAT}
              url="http://landsat-pds.s3.amazonaws.com/L8/139/045/LC81390452014295LGN00/index.html"
              onProgress={this.handleDownloadRasterProgress}
              onStart={this.handleDownloadRasterStart}
              onComplete={this.handleDownloadRasterComplete}
              onError={this.handleDownloadRasterError}
            />
          )}
        </div>
      </li>
    )
  }

  //
  // Internals
  //

  private get aggregatedClassNames() {
    return [
      this.classForActive,
      this.classForDownloadingJson,
      this.classForDownloadingRaster,
      this.classForExpansion,
      this.classForLoadingJson,
      this.classForLoadingRaster,
      this.classForRemoving,
      this._classForStatus,
    ].filter(Boolean).join(' ')
  }

  private get classForActive() {
    return this.props.isActive ? styles.isActive : ''
  }

  private get classForDownloadingJson() {
    return this.state.isDownloadingJson ? styles.isDownloading : ''
  }

  private get classForDownloadingRaster() {
    return this.state.isDownloadingRaster ? styles.isDownloading : ''
  }

  private get classForExpansion() {
    return this.state.isExpanded ? styles.isExpanded : ''
  }

  private get classForLoadingJson() {
    return (this.state.isDownloadingJson) ? styles.isLoading : ''
  }

  private get classForLoadingRaster() {
    return (this.state.isDownloadingRaster) ? styles.isLoading : ''
  }

  private get classForRemoving() {
    return this.state.isRemoving ? styles.isRemoving : ''
  }

  private get _classForStatus() {
    switch (this.props.job.properties.status) {
      case STATUS_SUCCESS: return styles.succeeded
      case STATUS_RUNNING: return styles.running
      case STATUS_TIMED_OUT: return styles.timedOut
      case STATUS_ERROR: return styles.failed
      default: return ''
    }
  }

  private emitOnForgetJob() {
    this.props.onForgetJob(this.props.job.id)
  }

  private handleDownloadJsonProgress(loadedBytes, totalBytes) {
    this.setState({
      downloadJsonProgress: Math.floor((loadedBytes / totalBytes) * 100),
    })
  }

  private handleDownloadJsonStart() {
    this.setState({ isDownloadingJson: true })
  }

  private handleDownloadJsonComplete() {
    this.setState({ isDownloadingJson: false })
  }

  private handleDownloadJsonError(err) {
    this.setState({ isDownloadingJson: false })
    console.error('Download failed: ' + err.stack)
  }

  private handleDownloadRasterProgress(loadedBytes, totalBytes) {
    this.setState({
      downloadRasterProgress: Math.floor((loadedBytes / totalBytes) * 100),
    })
  }

  private handleDownloadRasterStart() {
    this.setState({ isDownloadingRaster: true })
  }

  private handleDownloadRasterComplete() {
    this.setState({ isDownloadingRaster: false })
  }

  private handleDownloadRasterError(err) {
    this.setState({ isDownloadingRaster: false })
    console.error('Download failed: ' + err.stack)
  }

  private handleExpansionToggle() {
    this.setState({
      isExpanded: !this.state.isExpanded,
      isRemoving: false,
    })
  }

  private handleForgetToggle() {
    this.setState({ isRemoving: !this.state.isRemoving })
  }
}

//
// Helpers
//

function normalizeSceneId(sceneId) {
  return sceneId.replace(/^(rapideye|planetscope|landsat):/, '')
}

function segmentIfNeeded(s: string) {
  return s.length > 30 ? s.replace(/(\W)/g, '$1 ') : s
}
