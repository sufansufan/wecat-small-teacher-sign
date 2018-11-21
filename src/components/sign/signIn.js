import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";

import "./signIn.styl";

import { num2font, num2Date, getTeacherSignList } from "../../utils/index";

import MapCheckIn from "./mapCheckIn";

export default class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {},
      mapInfo: null
    };
  }

  componentWillMount() {
    const info = JSON.parse(this.props.info.classInfo);
    getTeacherSignList({
      attend_class_id: info.id
    }).then(res => {
      const { attendClass, organAbout } = res.data;
      info.class_sequence = num2font(attendClass.class_sequence);
      this.setState({
        info,
        mapInfo: {
          attend_class_id: info.id,
          nowDate: attendClass.nowDate,
          start_sign_datetime: attendClass.start_sign_datetime,
          ...organAbout
        }
      });
    });
  }

  render() {
    const { info, mapInfo } = this.state,
      startTime = mapInfo && num2Date(mapInfo.start_sign_datetime);
    return (
      <View className="sign">
        <View className="sign-class">
          <View>
            <View className="class-name">
              <Text>{info.class_name}</Text>
            </View>
            <View className="class-campus">
              <Image src="../../asset/images/class_times.png" />
              <Text>
                开始签到时间：
                {startTime}
              </Text>
            </View>
            <View className="class-campus class-last">
              <Image src="../../asset/images/class_address.png" />
              <Text>{info.campus_name}</Text>
            </View>
          </View>
          <View className="sign-times">
            <Text>第{info.class_sequence}节</Text>
          </View>
        </View>
        <View className="sign-map">
          {mapInfo && (
            <MapCheckIn mapInfo={mapInfo} params={this.props.info.params} />
          )}
        </View>
      </View>
    );
  }
}
