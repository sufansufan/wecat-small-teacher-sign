import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";

import "./class.styl";

import ClassList from "../../components/classList/classList"

export default class ClassIndex extends Component {
  config = {
    navigationBarTitleText: "班级",
    backgroundTextStyle: "dark",
    enablePullDownRefresh: true,
    onReachBottomDistance: "20px"
  };
  onPullDownRefresh() {
    const userInfo = Taro.getStorageSync("userInfo");
    if (userInfo.type === "teacher") {
      this.refs.classMap.getData();
      setTimeout(() => {
        Taro.stopPullDownRefresh();
      }, 1000);
    } else {
      Taro.stopPullDownRefresh();
    }
  }
  componentDidShow() {
    const userInfo = Taro.getStorageSync("userInfo");
    userInfo.type === "teacher" ? this.refs.classMap.getData() : "";
  }
  render() {
    return (
      <View className="class">
        <ClassList ref="classMap" />
      </View>
    );
  }
}
