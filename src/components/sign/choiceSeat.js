import Taro, { Component } from "@tarojs/taro";
import {
  View,
  Text,
  ScrollView,
  MovableArea,
  MovableView
} from "@tarojs/components";

import "./choiceSeat.styl";

import { setStorage, oneStudentSign } from "../../utils/index";

import txMan from "../../asset/images/student_default.png";
import txWomen from "../../asset/images/student_nv.png";

let oL = 0,
  oT = 0;
export default class ClassChoiceSeat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activedItem: {},
      classInfo: {},
      seatList: [],
      scrollLeft: "",
      pos: {
        x: 0,
        y: 0
      },
      lastTapTime: 0,
      updateParentData: false
    };
  }
  componentWillMount() {
    let classInfo = JSON.parse(this.props.classInfo),
      index = classInfo.list.findIndex(item => item.seat_x === -1),
      activedItem = index === -1 ? null : classInfo.list.splice(index, 1)[0];
    this.setState({
      classInfo,
      activedItem
    });
    let seatList = Array.from(new Array(64), () => ({
      student_id: "",
      student_name: "",
      head_img_url: "",
      sex: "",
      student_attend_class_id: "",
      student_attend_class_type: "",
      student_name_pinyin: "",
      actived: false
    }));
    const listScreen = JSON.parse(JSON.stringify(classInfo));
    seatList = seatList.map((item, index) => {
      item.index = index;
      item.seat_x = (index % 8) + 1;
      item.seat_y = Math.ceil((index % 8 === 0 ? index + 1 : index) / 8);
      let onSeat = null;
      listScreen.list.forEach((v, i) => {
        if (item.seat_x === v.seat_x && item.seat_y === v.seat_y) {
          listScreen.list.splice(i, 1);
          onSeat = v;
          onSeat.actived = true;
        }
      });
      return onSeat || item;
    });
    this.setState({
      classInfo: listScreen,
      seatList
    });
  }
  query() {
    return Taro.createSelectorQuery().in(this.$scope);
  }
  onScroll(e) {
    const { scrollTop, scrollLeft } = e.target;
    oL = scrollLeft;
    oT = scrollTop;
  }
  touchEnd(e) {
    const { clientX, clientY } = e.changedTouches[0];
    let minIndex = 65,
      minValue = 1000;
    this.query()
      .selectAll(".seat-list")
      .boundingClientRect()
      .exec(res => {
        const list = res[0],
          rL = list[0].left;
        list.forEach((item, index) => {
          let smalldistance = Math.sqrt(
            Math.pow(clientX - 5 - item.left - rL - oL, 2) +
              Math.pow(clientY - 5 - item.top, 2)
          );
          if (smalldistance < minValue) {
            minValue = smalldistance;
            minIndex = index;
          }
        });
        let { seatList, activedItem } = this.state,
          signParams = {},
          targetSeat = JSON.parse(JSON.stringify(seatList[minIndex])),
          moveItem = Object.assign({}, seatList[minIndex], activedItem);
        moveItem.seat_x = targetSeat.seat_x;
        moveItem.seat_y = targetSeat.seat_y;
        if (seatList[minIndex].student_id) {
          signParams = {
            item: moveItem,
            type: "toggle",
            tItem: targetSeat
          };
        } else {
          signParams = {
            item: moveItem,
            type: "up"
          };
        }
        this.studentSign(signParams).then(() => {
          activedItem.seat_x = seatList[minIndex].seat_x;
          activedItem.seat_y = seatList[minIndex].seat_y;
          activedItem.actived = true;
          seatList[minIndex] = activedItem;
        });

        this.setState(
          {
            moveDisplay: false,
            pos: {
              x: 1,
              y: 1
            }
          },
          () => {
            this.setState({
              moveDisplay: true,
              pos: {
                x: 0,
                y: 0
              }
            });
          }
        );
      });
  }
  studentSign(params = {}) {
    let { classInfo, activedItem } = this.state,
      { item, type, tItem } = params,
      {
        student_attend_class_id,
        roll_call_status,
        is_mend_register,
        mend_register_remark,
        mend_register_time,
        seat_x,
        seat_y
      } = item;
    roll_call_status
      ? (roll_call_status === "01701" || roll_call_status === "01704") &&
        (is_mend_register = true)
      : (roll_call_status = "01702");
    if (type === "down") Taro.showLoading({ title: "座位移出中", mask: true });
    else Taro.showLoading({ title: "座位签到中", mask: true });
    return oneStudentSign({
      student_attend_class_id,
      roll_call_status,
      is_mend_register,
      mend_register_remark,
      mend_register_time,
      seat_x,
      seat_y
    }).then(() => {
      Taro.hideLoading();
      if (type === "up") {
        Taro.showToast({
          title: "座位签到成功",
          icon: "success"
        });
        let nextStudent = classInfo.list.shift() || null;
        activedItem = nextStudent;
        this.setState({
          classInfo,
          activedItem
        });
      } else if (type === "toggle") {
        tItem.seat_x = -1;
        tItem.seat_y = -1;
        let tParams = {
          item: tItem,
          type: "down"
        };
        activedItem.actived = false;
        activedItem = tItem;
        this.studentSign(tParams);
        this.setState({
          activedItem
        });
      }
      setStorage("updateParentData", true);
    });
  }
  seatItemClick(item, index, e) {
    if (!item.student_id) return;
    let { seatList, classInfo, activedItem, lastTapTime } = this.state,
      curTime = e.timeStamp,
      lastTime = lastTapTime;
    if (curTime - lastTime > 0) {
      if (curTime - lastTime < 300) {
        const { seat_x, seat_y } = seatList[index];
        seatList[index] = {
          student_id: "",
          student_name: "",
          head_img_url: "",
          sex: "",
          seat_x,
          seat_y,
          student_attend_class_id: "",
          student_attend_class_type: "",
          student_name_pinyin: "",
          actived: false
        };
        if (activedItem) {
          classInfo.list.unshift(item);
        } else {
          activedItem = item;
        }
        item.seat_x = -1;
        item.seat_y = -1;
        this.studentSign({
          item,
          type: "down"
        });
        this.setState({
          classInfo,
          activedItem,
          seatList
        });
        setStorage("updateParentData", true);
      }
    }
    this.setState({
      lastTapTime: curTime
    });
  }
  puTongClick() {
    Taro.navigateBack({ delta: 1 }).then(() => {
      setStorage("updateParentData", true);
    });
  }
  toggerActived(item, index) {
    let { classInfo, activedItem } = this.state;
    item = JSON.parse(JSON.stringify(item));
    classInfo.list[index] = activedItem;
    activedItem = item;
    this.setState({
      classInfo,
      activedItem
    });
  }
  movableScale(e) {
    return false;
  }
  scrollTouchEnd(e) {
    this.query()
      .select(".seat-list")
      .boundingClientRect()
      .exec(res => {
        let { left } = res[0],
          scrollLeft = left - 10 + "Px";
        this.setState({ scrollLeft });
      });
  }
  render() {
    const {
      scrollLeft,
      seatList,
      pos: { x, y },
      classInfo,
      activedItem
    } = this.state;
    return (
      <View className="choice-seat">
        <View className="sign-class">
          <View>
            <View className="class-campus">
              <Image src="../../asset/images/class_address.png" />
              <Text>
                {classInfo.campus_name}-{classInfo.classroom_name}-
                {classInfo.teacher_name}
              </Text>
            </View>
            <View className="class-campus class-last">
              <Image src="../../asset/images/class_times.png" />
              <Text>{classInfo.time}</Text>
            </View>
          </View>
        </View>
        <View className="pattern">
          <View className="pattern-sign">
            <Text>签到</Text>
          </View>
          <View className="pattern-putong" onClick={this.puTongClick}>
            <Text>普通模式</Text>
          </View>
        </View>
        <MovableArea className="seat">
          {activedItem && (
            <MovableView
              x={x}
              y={y}
              className="move-item"
              direction="all"
              animation={false}
              onTouchEnd={this.touchEnd}
            >
              {activedItem && <Image src={activedItem.sex ? txMan : txWomen} />}
            </MovableView>
          )}
          <ScrollView
            scrollX
            scrollY
            onScroll={this.onScroll}
            scrollTop="9999"
            onTouchEnd={this.scrollTouchEnd}
          >
            <View className="ruler" style={{ right: scrollLeft }}>
              {Array.from("87654321").map(item => (
                <Text key={item}>{item}</Text>
              ))}
            </View>
            <View className="seat-box">
              {seatList.map((item, index) => (
                <View
                  className={item.actived ? "seat-list actived" : "seat-list"}
                  key={item.index || item.student_id}
                  onClick={this.seatItemClick.bind(this, item, index)}
                >
                  <View className="seat-img">
                    {item.sex !== "" && (
                      <Image src={item.sex ? txMan : txWomen} />
                    )}
                  </View>
                  <View className="seat-name">
                    <Text>{item.student_name}</Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
          <View className="platform" style={{ left: scrollLeft }}>
            <View className="platform-content" />
          </View>
          <View className="footer">
            {activedItem ? (
              <View className="select-student">
                <View className="student-box">
                  <View className="student-name-box">
                    <Text className="student-name">
                      {activedItem.student_name}
                    </Text>
                    <Text className="student-pinyin">
                      {activedItem.student_name_pinyin}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View className="no-txt">暂无学生</View>
            )}
            <ScrollView scrollX>
              <View className="list">
                {classInfo.list.map((item, index) => (
                  <View key={item.student_id} className="student-list">
                    <View
                      className="list-img"
                      onClick={this.toggerActived.bind(this, item, index)}
                    >
                      <Image src={item.sex ? txMan : txWomen} />
                    </View>
                    <View className="list-name">
                      <Text>{item.student_name}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </MovableArea>
      </View>
    );
  }
}
