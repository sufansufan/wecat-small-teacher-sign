import Taro, { Component } from "@tarojs/taro";
import { View, Text, Button, Picker } from "@tarojs/components";
import {
  AtIcon,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction
} from "taro-ui";

import { getScheduleList } from "../../utils/index";

import "taro-ui/dist/weapp/css/index.css";
import "./calendar.styl";

export default class Calendar extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      isOpened: false,
      defaultWeek: 0,
      defaultDate: new Date(),
      dateObj: {
        year: "",
        month: "",
        day: "",
        firstday: "",
        monday: "",
        sunday: ""
      },
      dateSel: "",
      dateList: [],
      times: [
        "7:00",
        "8:00",
        "9:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00"
      ],
      checkDate: [],
      checkInfo: {},
      params: {}
    };
  }
  componentDidMount() {
    this.getData();
  }
  componentDidUpdate() {
    if (this.props.getList) {
      this.getData(JSON.parse(this.props.getList));
      this.props.getList = false;
    }
  }
  getData(weeks = 0, uDate = null) {
    const date = this.state.defaultDate; // && new Date("2018/10/28 10:10:00");
    let { params } = this.state;
    params = {
      weeks,
      choseDate: date,
      uDate
    };
    if (typeof weeks === "object") {
      params = weeks;
      uDate = params.uDate;
    }
    this.setState({
      params
    });
    Taro.showLoading({ title: "获取上课信息中", mask: true });
    getScheduleList(params).then(res => {
      Taro.hideLoading();
      let list = res ? res.data.list : [];
      list = list.map(item => {
        let rt = new Date(item.start_datetime),
          minutes = rt.getMinutes();
        item.year = rt.getFullYear();
        item.date = rt.getMonth() + 1 + "." + rt.getDate();
        item.week = ["周天", "周一", "周二", "周三", "周四", "周五", "周六"][
          rt.getDay()
        ];
        item.time = rt.getHours() + ":00"; //+ (minutes < 10 ? "0" + minutes : minutes);
        return item;
      });
      this.setState(
        {
          checkDate: list
        },
        () => {
          this.setDate(uDate || date, list);
        }
      );
    });
  }
  onDateChange = e => {
    let date = new Date(e.detail.value),
      { defaultWeek } = this.state;
    defaultWeek = 0;
    this.setState(
      {
        defaultWeek,
        defaultDate: date
      },
      () => {
        this.getData(0, date);
      }
    );
  };
  getDate = date => {
    const year = date.getFullYear(),
      month = date.getMonth() + 1,
      day = date.getDate();
    return { year, month, day };
  };
  formatDate = date => {
    const dateObj = this.getDate(date),
      { year, month, day } = dateObj,
      week = ["周天", "周一", "周二", "周三", "周四", "周五", "周六"][
        date.getDay()
      ];
    return {
      id: year + month + day,
      year,
      label: week,
      date: month + "." + day
    };
  };
  addDate = (date, n) => {
    date.setDate(date.getDate() + n);
    return date;
  };
  setDate = (date, data = []) => {
    date = new Date(date);
    const weekList = [],
      dateList = [],
      day = date.getDay() || 7,
      week = day - 1,
      sunday = this.addDate(date, week * -1),
      firstday = new Date(sunday);
    for (var i = 0; i < 7; i++) {
      let o = this.formatDate(i == 0 ? sunday : this.addDate(sunday, 1));
      weekList.push(o);
    }
    this.state.times.forEach(t => {
      weekList.map(item => (item.time = t));
      dateList.push(JSON.parse(JSON.stringify(weekList)));
    });
    data.forEach(item => {
      this.state.times.forEach((time, ind) => {
        weekList.forEach(({ year, date }, index) => {
          if (item.time === time && date === item.date && year === +item.year) {
            let list = dateList[ind][index];
            list.info =
              this.state.checkDate.find(
                v => v.week === list.label && v.time === list.time
              ) || {};
            list.actived = true;
          }
        });
      });
    });
    const dateObj = this.getDate(firstday);
    this.setState({
      dateList,
      dateObj: {
        firstday,
        monday: weekList[0].date,
        sunday: weekList[weekList.length - 1].date,
        ...dateObj
      }
    });
  };
  changeWeek = num => {
    const date = this.addDate(this.state.dateObj.firstday, num);
    let { defaultWeek } = this.state;
    num > 0 ? (defaultWeek += 1) : (defaultWeek -= 1);
    this.getData(defaultWeek, date);
    this.setState({
      defaultWeek
    });
  };
  dialogDisplay(info) {
    this.setState(propState => {
      let update = {
        info: propState.checkInfo,
        isOpened: !this.state.isOpened
      };
      if (!info.type) {
        update.checkInfo = info;
      }
      return update;
    });
  }
  signIn(status) {
    let url = `../../pages/class/sign?classInfo=${JSON.stringify(
      this.state.checkInfo
    )}&params=${JSON.stringify(this.state.params)}`;
    if (status === "01702" || status === "01703") {
      url = `../../pages/class/studentSign?classId=${this.state.checkInfo.id}`;
    }
    Taro.navigateTo({
      url
    }).then(() => {
      this.setState({
        isOpened: !this.state.isOpened
      });
    });
  }
  render() {
    const { dateList, times, dateObj, isOpened, checkInfo } = this.state;
    const weekList = dateList[0].map(item => (
      <View className="th" key={item.id}>
        <Text>{item.label}</Text>
        <Text>{item.date}</Text>
      </View>
    ));
    const tableList = times.map((time, ind) => (
      <View className="tr" key={ind}>
        <View className="td">{time}</View>
        {dateList[ind].map((date, index) => {
          return date.actived ? (
            <View
              key={index}
              className={
                date.info.sign_in_status ? "td actived checked" : "td actived"
              }
              onClick={this.dialogDisplay.bind(this, date.info)}
            />
          ) : (
            <View key={index} className="td" />
          );
        })}
      </View>
    ));
    return (
      <View className="index">
        <View className="index-calendar">
          <View className="top-icon" />
          <View className="calendar" id="calendar">
            <View className="at-row">
              <View
                className="at-col left-btn"
                onClick={this.changeWeek.bind(this, -7)}
              >
                <AtIcon value="chevron-left" size="24" color="#3ea1f5" />
                <Text>上一周</Text>
              </View>
              <View className="at-col">
                <Picker mode="date" onChange={this.onDateChange}>
                  <Text className="current-date">
                    {dateObj.year}年{dateObj.month}月
                  </Text>
                  <View className="select-day">
                    <Text>
                      {dateObj.monday} - {dateObj.sunday}
                    </Text>
                  </View>
                </Picker>
              </View>
              <View
                className="at-col right-btn"
                onClick={this.changeWeek.bind(this, 7)}
              >
                <Text>下一周</Text>
                <AtIcon value="chevron-right" size="24" color="#3ea1f5" />
              </View>
            </View>
            <View className="calendar-table">
              <View className="tr">
                <View className="th">
                  <Text>时间</Text>
                </View>
                {weekList}
              </View>
              {tableList}
            </View>
            <AtModal isOpened={isOpened}>
              <AtModalHeader>{checkInfo.class_name}</AtModalHeader>
              <AtModalContent>
                <View className="tleft">
                  上课老师：
                  {checkInfo.teacher_name}
                </View>
                <View className="tleft">
                  开课日期：
                  {checkInfo.attent_class_date}
                </View>
                <View className="tleft">
                  上课时间：
                  {checkInfo.attent_class_time}
                </View>
                <View className="tleft">
                  上课地点：
                  {checkInfo.campus_name}
                </View>
              </AtModalContent>
              <AtModalAction class="sign-btn">
                <Button
                  className="sign-in-btn"
                  onClick={this.signIn.bind(this, checkInfo.sign_in_status)}
                >
                  签到
                </Button>
                <Button className="cancel-btn" onClick={this.dialogDisplay}>
                  取消
                </Button>
              </AtModalAction>
            </AtModal>
          </View>
        </View>
      </View>
    );
  }
}
