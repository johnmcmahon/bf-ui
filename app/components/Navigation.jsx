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
import Link from 'react-router/lib/Link'
import styles from './Navigation.css'
import brand from '../images/brand-experiment2.svg'
import brandSmall from '../images/brand-small.svg'

export default class Navigation extends Component {
  static propTypes = {
    currentLocation: React.PropTypes.object
  }

  render() {
    const {currentLocation} = this.props
    return (
      <nav className={`${styles.root} ${this._classForAtHome}`}>
        <Link to={{...currentLocation, pathname: '/about'}}>
          <img className={styles.brand} src={brand} alt="Beachfront"/>
        </Link>
        <ul>
          <li className={styles.home}>
            <Link className={styles.linkHome} activeClassName={styles.active} onlyActiveOnIndex={true} to={{...currentLocation, pathname: '/'}}>
              <img className={styles.complexIcon} src={brandSmall} alt="Beachfront"/>
              <svg className={styles.icon} viewBox="0 0 30 70"><path d="M3,14.9981077 C3,8.37173577 8.37112582,3 15,3 C21.627417,3 27,8.37134457 27,14.9981077 L27,54.0018923 C27,60.6282642 21.6288742,66 15,66 C8.372583,66 3,60.6286554 3,54.0018923 L3,14.9981077 Z M3,33.1954106 L27,40 L27,35.3445904 L3.00000003,28.5400009 L3,33.1954106 Z" fillRule="evenodd"/></svg>
            </Link>
          </li>
          <li>
            <Link className={styles.linkJobs} activeClassName={styles.active} to={{...currentLocation, pathname: '/jobs'}}>
              <svg className={styles.icon} viewBox="0 0 40 40"><path d="M18.6472679,30.9004414 C17.0742988,31.6153263 15.326892,32.0134896 13.4864891,32.0134896 C6.59039157,32.0134896 1,26.423098 1,19.5270005 C1,12.6309031 6.59039157,7.04051148 13.4864891,7.04051148 C20.3825865,7.04051148 25.9729781,12.6309031 25.9729781,19.5270005 C25.9729781,23.906071 23.7187425,27.7586365 20.3073925,29.9875759 L19.5283021,31.4228536 C19.2276319,31.2596452 18.933767,31.0853307 18.6472679,30.9004414 Z M25.9729781,33.0540304 C28.2952253,33.0540304 30.5347841,32.4672868 32.522869,31.3651345 L31.5138434,29.5450335 C29.8325817,30.4770895 27.9399216,30.9729488 25.9729781,30.9729488 L25.9729781,33.0540304 Z M35.2364537,29.3844632 C36.9030713,27.8177137 38.1520772,25.8525815 38.853682,23.6693423 L36.8723932,23.0326361 C36.2791817,24.878579 35.2222034,26.5415835 33.8110379,27.8681882 L35.2364537,29.3844632 Z M39.4744742,20.3644432 C39.4911759,20.091318 39.4997049,19.8170197 39.5,19.5417969 C39.5000084,17.4980992 39.0522322,15.5285324 38.1984956,13.7307632 L36.3186189,14.6234917 C37.0404453,16.1434888 37.4189257,17.8082544 37.4189191,19.5406772 C37.4186692,19.7731548 37.4114342,20.0058377 37.3972728,20.2374215 L39.4744742,20.3644432 Z M36.3844125,10.8903689 C34.9230819,9.13054482 33.0372872,7.76274646 30.9046674,6.9274153 L30.1456705,8.86515209 C31.949392,9.57165627 33.5459027,10.7296322 34.7833619,12.2198565 L36.3844125,10.8903689 Z M27.6449032,6.10238385 C27.1023404,6.03545058 26.5538206,6.00113798 26.0014012,6 C24.2347237,5.99996911 22.5363133,6.3286073 20.948647,6.96409905 L21.7219874,8.89615623 C23.0642039,8.3589101 24.5001664,8.08105493 25.9992408,8.0810793 C26.4657406,8.08204246 26.930604,8.11112195 27.3901021,8.16780793 L27.6449032,6.10238385 Z M17.9948296,8.6021266 C16.1486212,9.95248557 14.6676901,11.7518731 13.7022721,13.8268963 L15.5891314,14.7047699 C16.4059575,12.9491231 17.6600914,11.4253028 19.2234178,10.2818502 L17.9948296,8.6021266 Z M12.6765461,17.0277829 C12.5259095,17.8338286 12.4483611,18.6562553 12.4460037,19.4878933 C12.4459452,20.9777347 12.6748504,22.4042734 13.1234207,23.7650309 L15.0998826,23.1134952 C14.7206428,21.9630549 14.5270348,20.7564886 14.5270811,19.4908807 C14.5290758,18.7885902 14.594745,18.0921472 14.7222113,17.4100837 L12.6765461,17.0277829 Z M18.6472679,30.9004414 C19.2255699,30.637614 19.7802939,30.3319764 20.3073925,29.9875759 L20.5211097,29.5938557 C18.8195019,28.6701972 17.3743622,27.3252726 16.3293107,25.6950403 L14.5773067,26.818153 C15.6270497,28.4557038 17.0180634,29.8490511 18.6472679,30.9004414 Z M22.6571775,32.6444124 C23.7182837,32.9118652 24.8140202,33.050234 25.926871,33.0539533 L25.9338262,30.9728834 C24.9904871,30.9697307 24.0632058,30.8526342 23.1658082,30.6264444 L22.6571775,32.6444124 Z"/></svg>
              <span className={styles.label}>Jobs</span>
            </Link>
          </li>
          <li>
            <Link className={styles.linkCreateJob} activeClassName={styles.active} to={{pathname: '/create-job', hash: currentLocation.hash}}>
              <svg className={styles.icon} viewBox="0 0 40 40"><path d="M23,17 L23,6 L17,6 L17,17 L6,17 L6,23 L17,23 L17,34 L23,34 L23,23 L34,23 L34,17 L23,17 Z"/></svg>
              <span className={styles.label}>Create Job</span>
            </Link>
          </li>
          <li>
            <Link className={styles.linkProductLines} activeClassName={styles.active} to={{pathname: '/product-lines', hash: currentLocation.hash}}>
              <svg className={styles.icon} viewBox="0 0 40 40"><rect x="10" y="10" width="20" height="20"/></svg>
              <span className={styles.label}>View Product Lines</span>
            </Link>
          </li>
          <li>
            <Link className={styles.link} activeClassName={styles.active} to={{pathname: '/create-product-line', hash: currentLocation.hash}}>
              <svg className={styles.icon} viewBox="0 0 40 40"><circle cx="20" cy="20" r="10"/></svg>
              <span className={styles.label}>Create Product Line</span>
            </Link>
          </li>
          <li>
            <Link className={styles.linkHelp} activeClassName={styles.active} to={{...currentLocation, pathname: '/help'}}>
              <svg className={styles.icon} viewBox="0 0 40 40"><path d="M20,39 C30.4934102,39 39,30.4934102 39,20 C39,9.50658975 30.4934102,1 20,1 C9.50658975,1 1,9.50658975 1,20 C1,30.4934102 9.50658975,39 20,39 Z M18.1015625,28.2021484 L23.0488281,28.2021484 L23.0488281,33 L18.1015625,33 L18.1015625,28.2021484 Z M15.3457031,9.54199219 C16.6516992,8.70084215 18.2565009,8.28027344 20.1601562,8.28027344 C22.6614708,8.28027344 24.7394123,8.87792371 26.394043,10.0732422 C28.0486736,11.2685607 28.8759766,13.0393763 28.8759766,15.3857422 C28.8759766,16.8245515 28.5162796,18.0364534 27.796875,19.0214844 C27.3763,19.6191436 26.5683654,20.3828079 25.3730469,21.3125 L24.1943359,22.2255859 C23.5524056,22.7236353 23.1263031,23.3046842 22.9160156,23.96875 C22.7832025,24.389325 22.7112631,25.0423133 22.7001953,25.9277344 L18.2177734,25.9277344 C18.28418,24.0572823 18.4612616,22.7651403 18.7490234,22.0512695 C19.0367853,21.3373988 19.7783143,20.5156296 20.9736328,19.5859375 L22.1855469,18.6396484 C22.5839864,18.3408188 22.9049467,18.0143247 23.1484375,17.6601562 C23.591148,17.0514292 23.8125,16.3818396 23.8125,15.6513672 C23.8125,14.8102171 23.566246,14.043786 23.0737305,13.3520508 C22.581215,12.6603156 21.6819727,12.3144531 20.3759766,12.3144531 C19.092116,12.3144531 18.1818061,12.7405556 17.6450195,13.5927734 C17.108233,14.4449912 16.8398438,15.3303991 16.8398438,16.2490234 L12.0419922,16.2490234 C12.1748054,13.0947108 13.2760313,10.8590561 15.3457031,9.54199219 Z" fillRule="evenodd"/></svg>
              <span className={styles.label}>Help</span>
            </Link>
          </li>
        </ul>
      </nav>
    )
  }

  get _classForAtHome() {
    const {pathname} = this.props.currentLocation
    return pathname === '/' || pathname === 'login' ? styles.atHome : ''
  }
}
