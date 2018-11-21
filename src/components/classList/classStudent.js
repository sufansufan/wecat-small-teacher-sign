import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import PropTypes from "prop-types";

import StudentDef from "../../asset/images/student_default.png";
import StudentNv from "../../asset/images/student_nv.png";

import "./classDetail.styl";

export default class ClassStudent extends Component {
  constructor(props) {
    super(props);
    this.state = { studentData: [] };
  }
  componentDidUpdate() {
    this.setState({ studentData: this.props.students });
  }

  render() {
    let nullData = null;
    if (this.state.studentData.length === 0) {
      nullData = (
        <View className="data-null">
          <Text>暂无数据</Text>
        </View>
      );
    }
    const studentList = this.state.studentData.map((item, index) => (
      <View className="class-times class-stu" key={index}>
        <Image
          src={
            item.head_img_url
              ? item.head_img_url
              : item.sex
                ? StudentDef
                : StudentNv
          }
        />
        <View>
          <Text>{item.student_name}</Text>
        </View>
      </View>
    ));
    return (
      <View className="class-detail">
        <View className="class-list">
          {studentList}
          {nullData}
        </View>
      </View>
    );
  }
}
ClassStudent.PropTypes = {
  students: PropTypes.array
};
