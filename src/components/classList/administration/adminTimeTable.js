import Taro, { Component } from "@tarojs/taro";
import { View, Text, Input } from "@tarojs/components";
import { AtIcon, ScrollView } from "taro-ui";
import {
  getAdminScheduleList,
  num2Date,
  num2font,
  getDateTimes
} from "../../../utils/index";

import ConstantList from "../constant/constantList";

import "taro-ui/dist/weapp/css/index.css";
import "./adminTimeTable.styl";

export default class AdminTimetable extends Component {
  static options = { addGlobalClass: true };
  constructor() {
    super(...arguments);
    this.state = {
      dateObj: { year: "", month: "", day: "", week: "", timeShamp: "" },
      dataList: [],
      count: 0,
      num: 0,
      addList: [],
      dataParam: [],
      timeStepData: []
    };
  }
  componentWillMount() {
    this.setState({
      dateObj: { ...this.getDate(new Date()) }
    });
    this.getData({
      classdate: num2Date(new Date(), "yyyy-MM-dd")
    });
    this.getTimeStep(new Date());
  }
  getData(param, page) {
    const subject = Taro.getStorageSync("subject"),
      grade = Taro.getStorageSync("grade"),
      classType = Taro.getStorageSync("classType"),
      dataTime = Taro.getStorageSync("dataTime"),
      type = Taro.getStorageSync("userInfo").type;
    if (type !== "staff") return;
    this.state.dataParam.push(param);
    const data = {
      page: 0,
      limit: 5,
      classdate: "",
      grade: "",
      subject: "",
      class_type: "",
      time_id: "",
      searchContent: ""
    };
    const datas = Object.assign({}, data, ...this.state.dataParam);
    if (page !== "page") {
      this.state.addList = [];
      this.setState({ num: 0 });
      datas.page = 0;
    }
    datas.time_id =
      datas.time_id === "不限"
        ? (datas.time_id = "")
        : (datas.time_id &&
            dataTime.find(item => item.time_name === datas.time_id).time_id) ||
          "";
    datas.subject =
      (datas.subject &&
        subject.find(item => item.value === datas.subject).code) ||
      "";
    datas.grade =
      (datas.grade && grade.find(item => item.value === datas.grade).code) ||
      "";
    datas.class_type =
      (datas.class_type &&
        classType.find(item => item.value === datas.class_type).code) ||
      "";
    getAdminScheduleList(datas).then(res => {
      if (res.data) {
        Taro.hideLoading();
        this.state.addList.push(...res.data.list);
        this.setState({
          dataList: this.state.addList,
          count: res.data.count
        });
      }
    });
  }
  onDateChange = e => {
    this.setState({
      dateObj: {
        ...this.getDate(new Date(e.detail.value))
      }
    });
    this.getData({
      classdate: num2Date(new Date(e.detail.value), "yyyy-MM-dd")
    });
    this.getTimeStep(new Date(e.detail.value));
  };
  getDate = date => {
    const year = date.getFullYear(),
      month = date.getMonth() + 1,
      day = date.getDate(),
      weekNum = date.getDay(),
      timeShamp = date.getTime(),
      weekList = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六"
      ];
    let week = weekList.filter((item, index) => index === weekNum)[0];
    return { year, month, day, week, timeShamp };
  };
  changeDay = val => {
    this.setState({
      dateObj: {
        ...this.getDate(new Date(this.state.dateObj.timeShamp + val))
      }
    });
    this.getData({
      classdate: num2Date(this.state.dateObj.timeShamp + val, "yyyy-MM-dd")
    });
    this.getTimeStep(this.state.dateObj.timeShamp + val);
  };
  lowerEvent() {
    if (this.state.addList.length === this.state.count) {
      Taro.showToast({
        title: "暂无更多数据",
        duration: 1000
      });
    } else if (this.state.addList.length < this.state.count) {
      Taro.showLoading({
        title: "加载中",
        mask: true
      });
      this.getData({ page: (this.state.num += 1) }, "page");
    }
  }
  searchValue(e) {
    this.getData({ searchContent: e.detail.value });
  }
  classClick(val) {
    Taro.navigateTo({
      url: "../../pages/class/studentSign?classId=" + val
    });
  }
  getTimeStep(val) {
    getDateTimes({
      classdate: num2Date(val, "yyyy-MM-dd")
    }).then(res => {
      let data = res.data.list;
      data.map((item, index) => {
        item.code = item.time_id;
        item.value = item.time_name;
      });
      Taro.setStorageSync("dataTime", data);
      this.setState({ timeStepData: data });
    });
  }
  render() {
    const listNull =
      this.state.addList.length === 0 ? (
        <View className="data-null">
          <Text>暂无数据</Text>
        </View>
      ) : (
        ""
      );
    const list = this.state.addList.map((item, index) => (
      <View
        className="class-box"
        key={index}
        onClick={this.classClick.bind(this, item.id)}
      >
        <View className="calss-name">
          <Text>{item.class_name}</Text>
        </View>
        <View className="class-detail">
          <View>
            <Text>第{num2font(item.class_sequence)}节</Text>
            <Text>
              {item.start_time} - {item.end_time}
            </Text>
          </View>
          <View>
            <Text>
              {item.actual_student_number}/{item.pre_student_number}
            </Text>
          </View>
        </View>
      </View>
    ));
    return (
      <View className="admin-table">
        <View className="at-row">
          <View
            className="at-col left-btn"
            onClick={this.changeDay.bind(this, -(24 * 60 * 60 * 1000))}
          >
            <AtIcon value="chevron-left" size="24" color="#3ea1f5" />
            <Text>上一天</Text>
          </View>
          <View className="at-col">
            <Picker mode="date" onChange={this.onDateChange}>
              <Text className="current-date">
                {dateObj.year}年{dateObj.month}月{dateObj.day}日
              </Text>
              <View className="select-day">
                <Text>{dateObj.week}</Text>
                <View clsssName="select-calendar" />
              </View>
            </Picker>
          </View>
          <View
            className="at-col left-btn"
            onClick={this.changeDay.bind(this, +(24 * 60 * 60 * 1000))}
          >
            <Text>下一天</Text>
            <AtIcon value="chevron-right" size="24" color="#3ea1f5" />
          </View>
        </View>
        <View className="search">
          <AtIcon value="search" size="15" color="#aaaaaa" />
          <Input
            placeholder="搜索"
            placeholder-style="color:#aaaaaa;font-size: 14px;"
            className="class-input"
            onBlur={this.searchValue}
          />
        </View>
        <View>
          <ConstantList
            onGetData={this.getData}
            timeStepData={this.state.timeStepData}
          />
        </View>
        <ScrollView
          className="class-list"
          scrollY="true"
          onScrollToLower={this.lowerEvent}
        >
          {list}
          {listNull}
        </ScrollView>
        <View className="count">
          <Text>共计 {count}</Text>
        </View>
      </View>
    );
  }
}
