import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";

import ChoiceSeat from "../../components/sign/choiceSeat";

export default class ClassChoiceSeat extends Component {
  config = {
    navigationBarTitleText: "选座模式"
  };
  render() {
    return (
      <View>
        <ChoiceSeat classInfo={this.$router.params.classInfo} />
      </View>
    );
  }
}
