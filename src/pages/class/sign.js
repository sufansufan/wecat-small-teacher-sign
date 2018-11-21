import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";

import SignIn from "../../components/sign/signIn";

export default class ClassSignIn extends Component {
  config = {
    navigationBarTitleText: "签到"
  };

  render() {
    return (
      <View className="class-detail">
        <SignIn info={this.$router.params} />
      </View>
    );
  }
}
