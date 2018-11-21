import Taro, { Component } from "@tarojs/taro";

import { AtActivityIndicator } from "taro-ui";

import { userLogin } from "../utils/index";

export default class Loading extends Component {
  componentWillMount() {
    userLogin();
  }

  render() {
    return <AtActivityIndicator mode="center" content="Loading..." />;
  }
}
