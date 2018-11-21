import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";

import ClassDetails from "../../components/classList/classDetail";

import "./classDetail.styl";

export default class ClassDetailIndex extends Component {
  config = { navigationBarTitleText: "班级详情" };
  constructor(props) {
    super(props);
    this.state = {
      class_id: ""
    };
  }

  componentWillMount() {
    this.setState({
      class_id: this.$router.params.classId
    });
  }
  componentDidShow() {
    this.refs.classDetail.getData();
  }
  render() {
    return (
      <View className="class-detail">
        <ClassDetails classId={this.state.class_id} ref="classDetail" />
      </View>
    );
  }
}
