import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";

import { getStorage } from "../../utils/index";

import StudentSign from "../../components/sign/studentSign";
export default class ClassStudentSign extends Component {
  config = {
    navigationBarTitleText: "签到",
    backgroundTextStyle: "dark",
    enablePullDownRefresh: true,
    onReachBottomDistance: "0px"
  };
  onPullDownRefresh() {
    this.refs.studentSign.getData();
    Taro.stopPullDownRefresh();
    /*     setTimeout(() => {

    }, 1000); */
  }
  componentDidShow() {
    const params = getStorage("updateParentData", true);
    if (params) {
      this.refs.studentSign.getData();
      Taro.removeStorage({ key: "updateParentData" });
    }
  }
  render() {
    return (
      <View>
        <StudentSign classId={this.$router.params.classId} ref="studentSign" />
      </View>
    );
  }
}
