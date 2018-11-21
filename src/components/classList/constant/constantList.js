import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { sysconstList } from "../../../utils/api";
import { getDateTimes, num2Date } from "../../../utils/index";

import PropTypes from "prop-types";
import ClassSelect from "../select/classSelect";

import "taro-ui/dist/weapp/css/index.css";
import "./constantList.styl";

import ArrowImg from "../../../asset/images/select_jiantou.png";
import DownArrow from "../../../asset/images/down_arrow.png";
export default class ConstantList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      season: { status: false, value: "季节" },
      subject: { status: false, value: "科目" },
      grade: { status: false, value: "年级" },
      classType: { status: false, value: "班型" },
      timeStep: { status: false, value: "时段" },
      data: []
    };
  }
  componentWillMount() {}
  componentDidUpdate() {}
  commonClick = val => {
    this.props.onScroll();
    switch (val) {
      case "timeStep":
        this.setState({
          timeStep: {
            status: !this.state.timeStep.status,
            value: this.state.timeStep.value
          }
        });
        this.repeatClick(val);
        let timeData = this.props.timeStepData;
        if (timeData[0].value !== "不限") {
          timeData.unshift({
            code: "",
            value: "不限"
          });
        }
        this.setState({ data: timeData });
        if (!this.state.timeStep.status) {
          /* getDateTimes({
            classdate: num2Date(this.props.date, "yyyy-MM-dd")
          }).then(res => {
            let data = res.data.list;
            data.map((item, index) => {
              item.code = item.time_id;
              item.value = item.time_name;
            });
            data.unshift({
              code: "",
              value: "不限"
            });
            Taro.setStorageSync("dataTime", data);
            this.setState({ data: data });
          }); */
        }
        break;
      case "season":
        this.setState({
          season: {
            status: !this.state.season.status,
            value: this.state.season.value
          }
        });
        this.repeatClick(val);
        if (!this.state.season.status) {
          if (Taro.getStorageSync("season").length === 0) {
            sysconstList({
              sysconstType: "Season"
            }).then(res => {
              let data = res.data.list[0].list;
              data.unshift({
                code: "",
                value: "不限"
              });
              this.setState({ data: data });
              Taro.setStorageSync("season", data);
            });
          } else {
            this.setState({ data: Taro.getStorageSync("season") });
          }
        }
        break;
      case "subject":
        this.setState({
          subject: {
            status: !this.state.subject.status,
            value: this.state.subject.value
          }
        });
        this.repeatClick(val);
        if (!this.state.subject.status) {
          if (Taro.getStorageSync("subject").length === 0) {
            sysconstList({
              sysconstType: "Subject"
            }).then(res => {
              let data = res.data.list[0].list;
              data.unshift({
                code: "",
                value: "不限"
              });
              this.setState({ data: data });
              Taro.setStorageSync("subject", data);
            });
          } else {
            this.setState({ data: Taro.getStorageSync("subject") });
          }
        }
        break;
      case "grade":
        this.setState({
          grade: {
            status: !this.state.grade.status,
            value: this.state.grade.value
          }
        });
        this.repeatClick(val);
        if (!this.state.grade.status) {
          if (Taro.getStorageSync("grade").length === 0) {
            sysconstList({
              sysconstType: "Grade"
            }).then(res => {
              let data = res.data.list[0].list;
              data.unshift({
                code: "",
                value: "不限"
              });
              this.setState({ data: data });
              Taro.setStorageSync("grade", data);
            });
          } else {
            this.setState({ data: Taro.getStorageSync("grade") });
          }
        }
        break;
      case "classType":
        this.setState({
          classType: {
            status: !this.state.classType.status,
            value: this.state.classType.value
          }
        });
        this.repeatClick(val);
        if (!this.state.classType.status) {
          if (Taro.getStorageSync("classType").length === 0) {
            sysconstList({
              sysconstType: "ClassType"
            }).then(res => {
              let data = res.data.list[0].list;
              data.unshift({
                code: "",
                value: "不限"
              });
              this.setState({ data: data });
              Taro.setStorageSync("classType", data);
            });
          } else {
            this.setState({ data: Taro.getStorageSync("classType") });
          }
        }
        break;
      default:
        break;
    }
  };
  repeatClick = val => {
    for (let key in this.state) {
      if (key !== val) {
        this.setState({
          [key]: {
            status: false,
            value: this.state[key].value
          }
        });
      }
    }
  };
  selectTimeStep = val => {
    this.setState({
      timeStep: {
        status: !this.state.timeStep.status,
        value: val === "不限" ? "时段" : val
      }
    });
    this.props.onGetData({ time_id: val });
  };
  selectSeason = val => {
    this.setState({
      season: {
        status: !this.state.season.status,
        value: val === "不限" ? "季节" : val
      }
    });
    this.props.onGetData({ season: val });
  };
  selectSubject = val => {
    this.setState({
      subject: {
        status: !this.state.subject.status,
        value: val === "不限" ? "科目" : val
      }
    });
    this.props.onGetData({ subject: val });
  };
  selectGrade = val => {
    this.setState({
      grade: {
        status: !this.state.grade.status,
        value: val === "不限" ? "年级" : val
      }
    });
    this.props.onGetData({ grade: val });
  };
  selectClassType = val => {
    this.setState({
      classType: {
        status: !this.state.classType.status,
        value: val === "不限" ? "班型" : val
      }
    });
    this.props.onGetData({ class_type: val });
  };
  scrollEvents() {
    this.props.onScroll();
  }
  render() {
    let codedaima = null;
    if (this.props.status) {
      codedaima = (
        <View
          className="at-col options-type"
          onClick={this.commonClick.bind(this, "season")}
        >
          <Text
            className={this.state.season.value === "季节" ? "" : "sysconst-bg"}
          >
            {this.state.season.value}
          </Text>
          <View className="type-img">
            <Image
              src={this.state.season.value === "季节" ? ArrowImg : DownArrow}
            />
          </View>
        </View>
      );
    } else {
      codedaima = (
        <View
          className="at-col options-type"
          onClick={this.commonClick.bind(this, "timeStep")}
        >
          <Text
            className={
              this.state.timeStep.value === "时段" ? "" : "sysconst-bg"
            }
          >
            {this.state.timeStep.value}
          </Text>
          <View className="type-img">
            <Image
              src={this.state.timeStep.value === "时段" ? ArrowImg : DownArrow}
            />
          </View>
        </View>
      );
    }
    return (
      <View>
        <View className="options">
          <View className="at-row">
            {codedaima}
            <View
              className="at-col options-type"
              onClick={this.commonClick.bind(this, "subject")}
            >
              <Text
                className={
                  this.state.subject.value === "科目" ? "" : "sysconst-bg"
                }
              >
                {this.state.subject.value}
              </Text>
              <View className="type-img">
                <Image
                  src={
                    this.state.subject.value === "科目" ? ArrowImg : DownArrow
                  }
                />
              </View>
            </View>
            <View
              className="at-col options-type"
              onClick={this.commonClick.bind(this, "grade")}
            >
              <Text
                className={
                  this.state.grade.value === "年级" ? "" : "sysconst-bg"
                }
              >
                {this.state.grade.value}
              </Text>
              <View className="type-img">
                <Image
                  src={this.state.grade.value === "年级" ? ArrowImg : DownArrow}
                />
              </View>
            </View>
            <View
              className="at-col options-type"
              onClick={this.commonClick.bind(this, "classType")}
            >
              <Text
                className={
                  this.state.classType.value === "班型" ? "" : "sysconst-bg"
                }
              >
                {this.state.classType.value}
              </Text>
              <View className="type-img">
                <Image
                  src={
                    this.state.classType.value === "班型" ? ArrowImg : DownArrow
                  }
                />
              </View>
            </View>
            <ClassSelect
              commonStatus={this.state.timeStep.status}
              onSelectCommon={this.selectTimeStep}
              commonValue={this.state.timeStep.value}
              status={this.props.status}
              onScrolls={this.scrollEvents}
              data={this.state.data}
            />
            <ClassSelect
              commonStatus={this.state.season.status}
              onSelectCommon={this.selectSeason}
              commonValue={this.state.season.value}
              status={this.props.status}
              onScrolls={this.scrollEvents}
              data={this.state.data}
            />
            <ClassSelect
              commonStatus={this.state.subject.status}
              onSelectCommon={this.selectSubject}
              commonValue={this.state.subject.value}
              status={this.props.status}
              onScrolls={this.scrollEvents}
              data={this.state.data}
            />
            <ClassSelect
              commonStatus={this.state.grade.status}
              onSelectCommon={this.selectGrade}
              commonValue={this.state.grade.value}
              status={this.props.status}
              onScrolls={this.scrollEvents}
              data={this.state.data}
            />
            <ClassSelect
              commonStatus={this.state.classType.status}
              onSelectCommon={this.selectClassType}
              commonValue={this.state.classType.value}
              status={this.props.status}
              onScrolls={this.scrollEvents}
              data={this.state.data}
            />
          </View>
        </View>
      </View>
    );
  }
}
ConstantList.PropTypes = {
  onScroll: PropTypes.func,
  status: PropTypes.string,
  onGetData: PropTypes.func,
  timeStepData: PropTypes.array
};
