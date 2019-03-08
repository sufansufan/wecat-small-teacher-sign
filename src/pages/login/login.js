import Taro, { Component } from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components'
import { AtForm, AtInput } from 'taro-ui'

import { bindPhone, bindLogin } from '../../utils/index'

import './login.styl'

import logo from '../../asset/images/logo_pxx.png'

export default class Login extends Component {
  config = { navigationBarTitleText: '手机号验证' }

  constructor() {
    this.state = {
      phone: '',
      code: '',
      selectedList: [],
      roleType: true,
      checkCode: false,
      timeNum: 60
    }
  }

  handleChange = val => {}
  typeClick = val => {
    if (
      (this.state.roleType && val === '老师') ||
      (!this.state.roleType && val === '行政')
    ) {
      return false
    } else {
      this.setState({
        roleType: !this.state.roleType
      })
    }
  }
  codeStatus = () => {
    const { roleType, phone, timeNum } = this.state
    if (phone.length !== 11) {
      Taro.showToast({
        title: '请填写11位手机号',
        icon: 'none'
      })
      return
    }
    let num = 59
    this.setState({ checkCode: true })
    let time = setInterval(() => {
      this.setState({ timeNum: num-- })
      if (this.state.timeNum === 1) {
        this.setState({ checkCode: false, timeNum: 60 })
        clearInterval(time)
      }
    }, 1000)
    bindPhone({
      type: roleType ? 'teacher' : 'staff',
      phone
    }).then(res => {
      if (res.code === '10000') {
        Taro.showToast({
          title: '验证码已发送',
          icon: 'success'
        })
      } else {
        this.setState({ checkCode: false, timeNum: 60 })
        clearInterval(time)
      }
    })
  }
  assignVal(name, val) {
    this.setState({
      [name]: val
    })
  }
  onSubmit() {
    const { roleType, code, phone } = this.state
    if (!phone) {
      Taro.showToast({
        title: '请填写手机号',
        icon: 'none'
      })
      return
    } else if (!code) {
      Taro.showToast({
        title: '请填写验证码',
        icon: 'none'
      })
      return
    }
    bindLogin({
      type: roleType ? 'teacher' : 'staff',
      phone,
      code
    })
  }
  render() {
    const vCodeHtm = null
    if (this.state.checkCode) {
      vCodeHtm = (
        <Text className="text-disabled">
          {this.state.timeNum}
          s后重试
        </Text>
      )
    } else {
      vCodeHtm = <Text onClick={this.codeStatus}>获取验证码</Text>
    }
    return (
      <View className="entry">
        <View className="logo">
          <Image src={logo} />
        </View>
        <View className="form">
          <AtForm
            onSubmit={this.onSubmit.bind(this)}
            onReset={this.onReset.bind(this)}
          >
            <AtInput
              name="phone"
              type="number"
              placeholder="请输入手机号码"
              maxlength="11"
              placeholderStyle="color:#aeaeae"
              value={this.state.phone}
              onChange={this.assignVal.bind(this, 'phone')}
            >
              <View className="yan-zheng-ma">{vCodeHtm}</View>
            </AtInput>
            <AtInput
              name="code"
              type="number"
              maxlength="6"
              placeholder="请输入验证码"
              placeholderStyle="color:#aeaeae"
              value={this.state.code}
              onChange={this.assignVal.bind(this, 'code')}
            />
            <View className="radio">
              <View onClick={this.typeClick.bind(this, '老师')}>
                <View className="radio-default">
                  <View
                    className={this.state.roleType === true ? 'actived' : ''}
                  />
                </View>
                <View>
                  <Text
                    className={
                      this.state.roleType === true ? 'teacher-actived' : ''
                    }
                  >
                    老师
                  </Text>
                </View>
              </View>
              <View onClick={this.typeClick.bind(this, '行政')}>
                <View className="radio-default">
                  <View
                    className={this.state.roleType === false ? 'actived' : ''}
                  />
                </View>
                <View>
                  <Text
                    className={
                      this.state.roleType === false ? 'teacher-actived' : ''
                    }
                  >
                    行政
                  </Text>
                </View>
              </View>
            </View>
            <View className="form-button">
              <Button onClick={this.onSubmit}>确认</Button>
            </View>
          </AtForm>
        </View>
      </View>
    )
  }
}
