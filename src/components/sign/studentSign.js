import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, Input, Button } from "@tarojs/components";
import {
  getAttendClassList,
  teacherToStudentAllSign,
  oneStudentSign
} from "../../utils/index";
import { AtModal, AtModalContent, AtModalAction, ScrollView } from "taro-ui";
import "./studentSign.styl";

import StudentDef from "../../asset/images/student_default.png";
import StudentNv from "../../asset/images/student_nv.png";

export default class SinnInfo extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      sign: "",
      isOpened: false,
      repairOpened: false,
      dataStatus: false,
      dataList: [],
      attendClass: {},
      dateObj: { year: "", month: "", day: "" },
      repairReason: "",
      repairtime: "",
      studentObj: {},
      registerArr: [],
      getData: this.getData.bind(this)
    };
  }
  componentWillMount() {
    this.getData();
  }
  getData() {
    getAttendClassList({
      attend_class_id: this.props.classId
    }).then(res => {
      if (res.data.students.length === 0) {
        this.setState({ dataStatus: true });
        Taro.showToast({
          title: "暂无更多数据",
          duration: 2000,
          icon: "none"
        });
      }
      let remarkArr = [];
      res.data.students.forEach((item, index) => {
        remarkArr[index] = {
          mend_register_remark: item.mend_register_remark || "",
          mend_register_time: item.mend_register_time || ""
        };
      });
      this.setState({
        dataList: res.data.students,
        attendClass: res.data.attendClass,
        registerArr: remarkArr
      });
    });
  }
  xuanZuoClick() {
    let classInfo = { ...this.state.attendClass, list: this.state.dataList };
    Taro.navigateTo({
      url: `./choiceSeat?classInfo=${JSON.stringify(classInfo)}`
    });
  }
  dialogDisplay() {
    this.setState({
      isOpened: !this.state.isOpened
    });
  }
  allSign() {
    teacherToStudentAllSign({
      attend_class_id: this.props.classId
    }).then(res => {
      if (res.code === "10000") {
        Taro.showToast({
          title: "全部签到成功",
          icon: "success",
          duration: 2000,
          complete: () => {
            this.dialogDisplay();
            this.getData();
          }
        });
      }
    });
  }
  singleSign(param, val, index) {
    this.state.dataList.forEach((item, n) => {
      if (n === index || n === param.num) {
        if (item.roll_call_status == val) {
          return;
        } else {
          Taro.showLoading({ title: "请求中", mask: true });
          const repairTime =
            this.state.dateObj.year +
            "-" +
            this.state.dateObj.month +
            "-" +
            this.state.dateObj.day;
          const dataObj = {
            student_attend_class_id: param.student_attend_class_id,
            roll_call_status: val || param.roll_call_status,
            is_mend_register: val ? false : true,
            mend_register_remark: val ? "" : this.state.repairReason,
            mend_register_time: val
              ? ""
              : this.state.dateObj.year
                ? repairTime
                : "",
            seat_x: param.seat_x || "",
            seat_y: param.seat_y || ""
          };
          oneStudentSign(dataObj).then(res => {
            if (res.code === "10000") {
              Taro.hideLoading();
              if (!val) {
                this.repairClose();
              }
              let dataLists = this.state.dataList.map((item, num) => {
                if (val) {
                  if (num === index) {
                    item.roll_call_status = val;
                    item.mend_register_remark = "";
                    item.mend_register_time = "";
                    item.is_mend_register = false;
                  }
                  this.state.registerArr.map((o, n) => {
                    if (n === num) {
                      o.mend_register_remark = "";
                      // o.mend_register_time = "";
                    }
                    return o;
                  });
                } else {
                  this.state.registerArr.map((o, n) => {
                    if (n === param.num) {
                      o.mend_register_remark = this.state.repairReason || "";
                      o.mend_register_time = repairTime || "";
                    }
                    return o;
                  });
                  this.setState({ registerArr: this.state.registerArr });
                  if (
                    item.roll_call_status === param.roll_call_status &&
                    num === param.num
                  ) {
                    item.is_mend_register = true;
                    item.mend_register_remark = this.state.repairReason || "";
                    item.mend_register_time = this.state.dateObj.year
                      ? repairTime
                      : "";
                  }
                }
                return item;
              });
              this.setState({ dataList: dataLists });
            }
          });
        }
      }
    });
  }
  repairOpen(param, index) {
    if (
      param.roll_call_status === "01702" ||
      param.roll_call_status === "01703" ||
      param.roll_call_status === null
    ) {
      Taro.showToast({
        title: "只有请假状态和旷课状态可以补签",
        icon: "none",
        duration: 2000
      });
      return;
    }
    if (param.mend_register_time) {
      this.setState({
        studentObj: Object.assign({}, param, {
          num: index
        }),
        repairOpened: !this.state.repairOpened,
        repairReason: this.state.registerArr[index].mend_register_remark,
        dateObj: {
          ...this.setDate(
            new Date(this.state.registerArr[index].mend_register_time)
          )
        }
      });
    } else {
      this.setState({
        studentObj: Object.assign({}, param, {
          num: index
        }),
        repairOpened: !this.state.repairOpened,
        repairReason: this.state.registerArr[index].mend_register_remark,
        dateObj: {
          ...this.setDate(new Date())
        }
      });
    }
  }
  repairClose() {
    this.setState({
      repairOpened: !this.state.repairOpened
    });
  }
  onDateChange(e) {
    this.setState({
      dateObj: {
        ...this.setDate(new Date(e.detail.value))
      }
    });
  }
  setDate(date) {
    const year = date.getFullYear(),
      month = date.getMonth() + 1,
      day = date.getDate();
    return { year, month, day };
  }
  repairReason(e) {
    this.setState({
      repairReason: e.detail.value
    });
  }
  render() {
    let nullData = null;
    if (this.state.dataStatus) {
      nullData = (
        <View className="data-null">
          <Text>暂无数据</Text>
        </View>
      );
    }
    const signList = this.state.dataList.map((item, index) => {
      let signIn = "",
        late = "",
        leave = "",
        absenteeism = "",
        buqian = "";
      switch (item.roll_call_status) {
        case null:
          signIn = "sign-default";
          late = "sign-default";
          leave = "sign-default";
          absenteeism = "sign-default";
          buqian = "sign-default disabled";
          break;
        case "01701":
          signIn = "sign-default disabled";
          late = "sign-default disabled";
          leave = "sign-default disabled";
          absenteeism = "sign-default absenteeism";
          buqian = "sign-default disabled";
          if (item.is_mend_register) {
            buqian = "sign-default buqian";
          }
          break;
        case "01702":
          signIn = "sign-default sign";
          late = "sign-default disabled";
          leave = "sign-default disabled";
          absenteeism = "sign-default disabled";
          buqian = "sign-default disabled";
          break;
        case "01703":
          signIn = "sign-default disabled";
          late = "sign-default late";
          leave = "sign-default disabled";
          absenteeism = "sign-default disabled";
          buqian = "sign-default disabled";
          break;
        case "01704":
          signIn = "sign-default disabled";
          late = "sign-default disabled";
          leave = "sign-default leave";
          absenteeism = "sign-default disabled";
          buqian = "sign-default disabled";
          if (item.is_mend_register) {
            buqian = "sign-default buqian";
          }
          break;
        default:
          break;
      }
      return (
        <View className="student" key={index}>
          <View>
            <View className="student-img">
              <Image
                src={
                  item.head_img_url
                    ? item.head_img_url
                    : item.sex
                      ? StudentDef
                      : StudentNv
                }
              />
            </View>
            <View className="student-name">
              <Text>{item.student_name}</Text>
              <Text className="student-pinyin">
                ({item.student_name_pinyin})
              </Text>
            </View>
          </View>
          <View className="sign-type">
            <View
              className={signIn}
              onClick={this.singleSign.bind(this, item, "01702", index)}
            >
              <Text>签到</Text>
            </View>
            <View
              className={late}
              onClick={this.singleSign.bind(this, item, "01703", index)}
            >
              <Text>迟到</Text>
            </View>
            <View
              className={leave}
              onClick={this.singleSign.bind(this, item, "01704", index)}
            >
              <Text>请假</Text>
            </View>
            <View
              className={absenteeism}
              onClick={this.singleSign.bind(this, item, "01701", index)}
            >
              <Text>旷课</Text>
            </View>
            <View
              className={buqian}
              onClick={this.repairOpen.bind(this, item, index)}
            >
              <Text>补签</Text>
            </View>
          </View>
        </View>
      );
    });
    return (
      <View className="student-sign">
        <View className="sign-hander">
          <View>
            <Text>签到</Text>
          </View>
          <View className="hander-right">
            <View className="all-sign" onClick={this.dialogDisplay}>
              <Text>全部签到</Text>
            </View>
            <View className="all-sign xuanzuo" onClick={this.xuanZuoClick}>
              <Text>选座模式</Text>
            </View>
          </View>
        </View>
        {nullData}
        <View className="student-list">{signList}</View>
        <AtModal isOpened={isOpened}>
          <AtModalContent>
            <View className="sign-font">是否全部签到</View>
          </AtModalContent>
          <AtModalAction class="sign-btn">
            <Button className="sign-in-btn" onClick={this.allSign}>
              签到
            </Button>
            <Button className="cancel-btn" onClick={this.dialogDisplay}>
              取消
            </Button>
          </AtModalAction>
        </AtModal>
        <AtModal isOpened={repairOpened}>
          <AtModalContent>
            <View className="repair-box">
              <View className="repair-reason">
                <Text>补签原因：</Text>
                <Input
                  name="yuanyin"
                  type="text"
                  placeholder="补签原因"
                  onChange={this.repairReason}
                  value={this.state.repairReason}
                />
              </View>
              <View className="repair-time">
                <Text>补签时间：</Text>
                <Picker
                  mode="date"
                  onChange={this.onDateChange}
                  className="date-box"
                >
                  <Text>
                    {dateObj.year}-{dateObj.month}-{dateObj.day}
                  </Text>
                  <Text className="current-date" />
                </Picker>
              </View>
            </View>
          </AtModalContent>
          <AtModalAction class="sign-btn">
            <Button
              className="sign-in-btn"
              onClick={this.singleSign.bind(this, this.state.studentObj, "")}
            >
              补签
            </Button>
            <Button className="cancel-btn" onClick={this.repairClose}>
              取消
            </Button>
          </AtModalAction>
        </AtModal>
      </View>
    );
  }
}
