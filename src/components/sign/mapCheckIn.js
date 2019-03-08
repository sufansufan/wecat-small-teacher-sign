import Taro, { Component } from '@tarojs/taro'
import { View, Map, CoverView, CoverImage } from '@tarojs/components'

import './mapCheckIn.styl'
// import reLocation from "../../asset/images/rel_bg.png";
import {
  setStorage,
  num2Date,
  getDistance,
  setTeacherSign
} from '../../utils/index'

import icPosition from '../../asset/images/ic_position.png'
import noSigninImg from '../../asset/images/no_signin.png'
import signinImg from '../../asset/images/signin.png'
import icLocation from '../../asset/images/ic_location.png'
import bomBg from '../../asset/images/sign_bom_bg.png'
import relBg from '../../asset/images/rel_bg.png'

export default class MapCheckIn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      latitude: 0,
      longitude: 0,
      location: '',
      scale: 16,
      mapImg: {
        icLocation,
        bomBg,
        relBg
      },
      signinImg: noSigninImg,
      time: '',
      setTimer: '',
      markers: [],
      circles: [],
      isSign: false,
      isOpened: false
    }
  }
  componentWillMount() {
    const { circles, markers } = this.state,
      { latitude, longitude, distance_range } = this.props.mapInfo
    circles.push({
      latitude,
      longitude,
      color: '#43a3f5DD',
      fillColor: '#7cb5ec88',
      radius: distance_range,
      strokeWidth: 1
    })
    markers.push({
      id: 0,
      latitude,
      longitude,
      name: '',
      iconPath: icPosition
    })
    this.setState({
      circles,
      markers
    })
  }
  componentDidMount() {
    this.getTime(this.props.mapInfo.nowDate)
    this.mapCtx = Taro.createMapContext('map', this.$scope)
    // this.mapCtx.moveToLocation();
    Taro.getLocation({
      type: 'gcj02'
    }).then(({ longitude, latitude }) => {
      this.setState({
        longitude,
        latitude
      })
      this.moveToLocation(longitude, latitude)
    })
  }
  getTime(date) {
    let dateNum = date,
      signTime = this.props.mapInfo.start_sign_datetime
    this.setState({
      setTimer: setInterval(() => {
        if (dateNum >= signTime && !this.state.isSign) {
          this.setState({ isSign: true })
        }
        this.setState({ time: num2Date((dateNum += 1000), 'hh:mm:ss') })
      }, 1000)
    })
  }
  getCenterLocation() {
    this.mapCtx.getCenterLocation({
      success({ longitude, latitude }) {}
    })
  }
  isGetDistance(longitude, latitude) {
    return getDistance(
      { longitude, latitude },
      this.state.circles[0],
      this.props.mapInfo.distance_range
    )
  }
  moveToLocation(longitude, latitude) {
    this.setState({
      scale: 16,
      signinImg: this.isGetDistance(longitude, latitude)
        ? signinImg
        : noSigninImg
      // longitude,
      // latitude,
      // location: `left: calc(100% / 2); margin-left: -29rpx; top: calc(100% / 2); margin-top: -37rpx;`
    })
    this.mapCtx.moveToLocation()
  }
  closeModel() {
    this.setState({
      isOpened: !this.state.isOpened
    })
  }
  sign(out = false) {
    const { longitude, latitude } = this.state,
      {
        mapInfo: { attend_class_id },
        params
      } = this.props
    // this.closeModel();
    setTeacherSign({
      attend_class_id,
      longitude,
      latitude,
      sign_remark: out ? '外勤签到' : '正常签到'
    }).then(() => {
      Taro.showToast({
        title: '签到成功',
        icon: 'success',
        mask: true,
        duration: 3000
      }).then(() => {
        setStorage('getIndexList', params)
        setTimeout(() => {
          Taro.redirectTo({
            url: '../class/studentSign?classId=' + attend_class_id
          })
        }, 2000)
      })
    })
  }
  teacherSign() {
    // const { longitude, latitude } = this.state;
    // if (!this.isGetDistance(longitude, latitude)) {
    //   this.closeModel();
    //   return;
    // }
    this.sign()
  }
  componentWillUnmount() {
    clearInterval(this.state.setTimer)
  }
  render() {
    const {
      latitude,
      longitude,
      markers,
      circles,
      location,
      scale,
      mapImg,
      signinImg,
      time,
      isSign,
      isOpened
    } = this.state
    const signBg = isSign ? (
      <CoverView class='sign-button'>
        <CoverImage class='bg' src={signinImg} />
        <CoverView class='text' onClick={this.teacherSign}>
          <CoverView class='p'>签到</CoverView>
          <CoverView class='p'>{time}</CoverView>
        </CoverView>
      </CoverView>
    ) : (
      <CoverView class='sign-button'>
        <CoverView class='bg no-sign' />
        <CoverView class='text'>
          <CoverView class='p'>签到</CoverView>
          <CoverView class='p'>{time}</CoverView>
        </CoverView>
      </CoverView>
    )
    return (
      <View className='map-container'>
        <Map
          id='map'
          class='map'
          latitude={latitude}
          longitude={longitude}
          markers={markers}
          circles={circles}
          scale={scale}
          showLocation
        >
          <CoverView class='ic-location' style={location}>
            {/* <CoverImage src={mapImg.icLocation} /> */}
          </CoverView>
          <CoverView class='bottom-bg'>
            <CoverImage src={mapImg.bomBg} />
          </CoverView>
          {signBg}
          <CoverView
            class='re-location'
            onClick={this.moveToLocation.bind(this, longitude, latitude)}
          >
            <CoverImage class='img' src={mapImg.relBg} />
          </CoverView>
          <CoverView
            style={{ display: isOpened ? 'block' : 'none' }}
            class='sign-model-box'
          >
            <CoverView class='sign-model'>
              <CoverView class='content'>
                <CoverView>您当前的位置不在签到范围内，</CoverView>
                <CoverView>是否继续签到？</CoverView>
              </CoverView>
              <CoverView class='btns'>
                <CoverView class='ok' onClick={this.sign.bind(this, true)}>
                  签到
                </CoverView>
                <CoverView class='cancel' onClick={this.closeModel}>
                  取消
                </CoverView>
              </CoverView>
            </CoverView>
          </CoverView>
        </Map>
        <View
          className='mask-bg'
          style={{ display: isOpened ? 'block' : 'none' }}
        />
      </View>
    )
  }
}
