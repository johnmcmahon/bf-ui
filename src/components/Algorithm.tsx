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

const styles: any = require('./Algorithm.css')

import * as React from 'react'
import {
  REQUIREMENT_BANDS,
  REQUIREMENT_CLOUDCOVER,
} from '../constants'

interface Props {
  algorithm: beachfront.Algorithm
  imageProperties: beachfront.SceneMetadata
  isSelected?: boolean
  isSubmitting?: boolean
  warningHeading?: string
  warningMessage?: string
  onSelect?(algorithm: beachfront.Algorithm)
  onSubmit?(algorithm: beachfront.Algorithm)
}

export const Algorithm = ({
  algorithm,
  imageProperties,
  isSelected,
  isSubmitting,
  warningHeading,
  warningMessage,
  onSelect,
  onSubmit,
}: Props) => (
  <div className={[
    styles.root,
    isSubmitting ? styles.isSubmitting : '',
    algorithm.requirements.every(r => isCompatible(r, imageProperties)) ? styles.isCompatible : styles.isNotCompatible,
    isSelected ? styles.isSelected : '',
    onSelect ? styles.isSelectable : '',
  ].join(' ')}>
    <section className={styles.header} onClick={onSelect && (() => !isSelected && onSelect(algorithm))}>
      {onSelect && (
        <span className={styles.selectionIndicator}>
          <input
            type="radio"
            readOnly={true}
            checked={isSelected}
          />
        </span>
      )}
      <span className={styles.name}>
        <span>{algorithm.name}</span>
      </span>
      <span className={styles.warningIndicator}>
        <i className="fa fa-warning"/>
      </span>
    </section>

    <section className={styles.details}>
      <div className={styles.description}>{algorithm.description}</div>

      <div className={styles.controls}>
        <div className={styles.compatibilityWarning}>
          <h4><i className="fa fa-warning"/> {warningHeading || 'Incompatible Image Selected'}</h4>
          <p>{warningMessage || "The image you've selected does not meet all of this algorithm's requirements.  You can run it anyway but it may not produce the expected results."}</p>
        </div>

        {onSubmit && (
          <button
            className={styles.startButton}
            disabled={isSubmitting}
            onClick={() => onSubmit(algorithm)}
            >
            {isSubmitting ? 'Starting' : 'Run Algorithm'}
          </button>
        )}
      </div>

      <div className={styles.requirements}>
        <h4>Image Requirements</h4>
        <table>
          <tbody>
          {algorithm.requirements.map(r => (
            <tr key={r.name} className={isCompatible(r, imageProperties) ? styles.met : styles.unmet}>
              <th>{r.name}</th>
              <td>{r.description}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </section>
  </div>
)

//
// Helpers
//

function isCompatible(requirement, imageProperties) {
  switch (requirement.name) {
    case REQUIREMENT_BANDS:
      return requirement.literal.split(',').every(s => imageProperties.bands[s])
    case REQUIREMENT_CLOUDCOVER:
      return imageProperties.cloudCover <= requirement.literal
    default:
      return false
  }
}