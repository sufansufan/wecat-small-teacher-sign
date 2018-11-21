import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { AtTabs, AtTabsPane, AtButton } from "taro-ui";
import { getClassDetailList } from "../../utils/index";

import ClassStudent from "./classStudent";

import ClassAddress from "../../asset/images/class_address.png";
import ClassStep from "../../asset/images/class_step.png";
import ClassTimes from "../../asset/images/class_times.png";

import "./classDetail.styl";

export default class ClassDetail extends Component {
  static options = { addGlobalClass: true };
  constructor(props) {
    super(props);
    this.state = { current: 0, attendList: [], dataList: {}, studentList: [] };
  }
  getData() {
    getClassDetailList({ class_id: this.props.classId }).then(res => {
      this.setState({
        attendList: res.data.attendClasses,
        dataList: res.data.pxxClass,
        studentList: res.data.students
      });
    });
  }
  handleClick() {
    this.state.current === 0
      ? this.setState({
          current: 1
        })
      : this.setState({ current: 0 });
  }
  timesClick(item) {
    item.campus_name = this.state.dataList.campus_name;
    if (item.teacher_id !== this.state.dataList.teacher_id) {
      return;
    }
    if (item.sign_in_status) {
      Taro.navigateTo({
        url: "../class/studentSign?classId=" + item.id
      });
    } else {
      Taro.navigateTo({
        url: `../class/sign?classInfo=${JSON.stringify(item)}`
      });
    }
  }
  render() {
    const classTimes = this.state.attendList.map((item, index) => (
      <View
        className={
          item.sign_in_status
            ? "class-times class-times-actived"
            : "class-times"
        }
        onClick={this.timesClick.bind(this, item)}
        key={index}
      >
        {item.teacher_id !== dataList.teacher_id ? (
          <Text className="class-list-teacher">{item.teacher_name}</Text>
        ) : null}
        <Text className="class-index">{item.class_sequence}</Text>
        <View>
          <Text className="class-date">{item.classdate}</Text>
        </View>
      </View>
    ));
    return (
      <View className="class-detail">
        <View className="class-header">
          <View className="class-name">
            <Text>{dataList.class_name}</Text>
          </View>
          <View className="class-teacher">
            <Text>
              主讲老师：
              {dataList.teacher_name}
            </Text>
          </View>
          <View className="class-campus">
            <Image src={ClassAddress} />
            <Text>{dataList.campus_name}</Text>
          </View>
          <View className="class-campus">
            <Image src={ClassStep} />
            <Text>{dataList.attent_class_date}</Text>
          </View>
          <View className="class-campus">
            <Image src={ClassTimes} />
            <Text>{dataList.attent_class_time}</Text>
          </View>
        </View>
        <View className="class-foot">
          <AtTabs
            current={this.state.current}
            tabList={[{ title: "课节" }, { title: "学员" }]}
            onClick={this.handleClick}
            className="class-tab"
            swipeable={false}
          >
            <AtTabsPane current={this.state.current} index={0}>
              <View className="class-list">{classTimes}</View>
            </AtTabsPane>
            <AtTabsPane current={this.state.current} index={1}>
              <ClassStudent students={this.state.studentList} />
            </AtTabsPane>
          </AtTabs>
        </View>
      </View>
    );
  }
}
