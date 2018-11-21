import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView } from "@tarojs/components";
import PropTypes from "prop-types";
import { getTeacherList } from "../../utils/index";

import { AtProgress, AtIcon } from "taro-ui";
import "taro-ui/dist/weapp/css/index.css";
import "./classList.styl";

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      data: {
        page: 0,
        count: 0,
        year: "",
        season: "",
        subject: "",
        grade: "",
        class_type: "",
        searchContent: ""
      },
      dataParam: [],
      addList: [],
      num: 0
    };
  }
  handleClick(classId) {
    Taro.navigateTo({
      url: "../../pages/class/classDetail?classId=" + classId
    });
  }
  getData(param, page) {
    this.state.dataParam.push(param);
    const season = Taro.getStorageSync("season"),
      subject = Taro.getStorageSync("subject"),
      grade = Taro.getStorageSync("grade"),
      classType = Taro.getStorageSync("classType"),
      data = {
        page: 0,
        limit: 5,
        particular_year: "2018",
        season: "",
        campus_id: "",
        class_type: "",
        grade: "",
        subject: "",
        searchContent: ""
      };
    const datas = Object.assign({}, data, ...this.state.dataParam);
    if (!page) {
      this.state.addList = [];
      this.setState({ num: 0 });
      datas.page = 0;
    }
    datas.season =
      (datas.season &&
        season.filter(item => item.value === datas.season)[0].code) ||
      "";
    datas.subject =
      (datas.subject &&
        subject.filter(item => item.value === datas.subject)[0].code) ||
      "";
    datas.grade =
      (datas.grade &&
        grade.filter(item => item.value === datas.grade)[0].code) ||
      "";
    datas.class_type =
      (datas.class_type &&
        classType.filter(item => item.value === datas.class_type)[0].code) ||
      "";
    getTeacherList(datas).then(res => {
      this.setState({ data: { count: res.data.count } });
      this.state.addList.push(...res.data.list);
      setTimeout(() => {
        Taro.hideLoading();
      }, 1000);
      this.setState({ dataList: this.state.addList });
      if (this.state.addList.length === 0) {
        Taro.showToast({ title: "暂无更多数据", duration: 2000, icon: "none" });
      }
    });
  }
  lowerEvent() {
    const userInfo = Taro.getStorageSync("userInfo");
    if (userInfo.type === "teacher") {
      if (this.state.addList.length === this.state.data.count) {
        Taro.showToast({ title: "暂无更多数据", duration: 1000 });
      } else if (this.state.addList.length < this.state.data.count) {
        Taro.showLoading({ title: "加载中", mask: true });
        this.getData({ page: (this.state.num += 1) }, "page");
      }
    }
  }
  render() {
    let nullData = null;
    if (this.state.dataList.length === 0) {
      nullData = (
        <View className="data-null">
          <Text>暂无数据</Text>
        </View>
      );
    }
    const classList = this.state.dataList.map((item, index) => {
      let courseType = null,
        coursebg = "";
      switch (item.classStatus) {
        case "1":
          coursebg = "class-type";
          courseType = "待开课";
          break;
        case "2":
          coursebg = "class-type class-begin";
          courseType = "进行中";
          break;
        case "3":
          courseType = "已结束";
          coursebg = "class-type class-end";
          break;
        default:
          break;
      }
      return (
        <View
          className="class-list"
          onClick={this.handleClick.bind(this, item.class_id)}
          key={index}
        >
          <View className="class-time">
            <Text>{item.time_name}</Text>
          </View>
          <View className="class-name">
            <Text>{item.class_name}</Text>
          </View>
          <View className="class-campus">
            <Text>{item.address}</Text>
          </View>
          <View className="class-progress">
            <View className="at-row">
              <View className="at-col at-col-4">
                <Text>
                  已完成:
                  {item.finishTimes}/{item.total_times}
                </Text>
              </View>
              <View className="at-col at-col-8 progress">
                <AtProgress
                  percent={(item.finishTimes / item.total_times) * 100}
                  isHidePercent
                />
              </View>
            </View>
          </View>
          <View className={coursebg}>
            <Text>{courseType}</Text>
          </View>
        </View>
      );
    });
    return (
      <ScrollView
        scrollY={this.props.scroll}
        className="scroll"
        lowerThreshold="10"
        onScrollToLower={this.lowerEvent}
      >
        <View className="class-box">
          {classList} {nullData}
        </View>
      </ScrollView>
    );
  }
}
List.PropTypes = {
  scroll: PropTypes.bool,
  onGetData: PropTypes.func,
  datsList: PropTypes.array
};
