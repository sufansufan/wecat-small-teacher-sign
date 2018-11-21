import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import AdminTimeTable from "../../../components/classList/administration/adminTimeTable";
import "./timeTable.styl";

export default class TimeTable extends Component {
  constructor() {
    navigationBarTitleText: "课表";
  }
  render() {
    return (
      <View>
        <AdminTimeTable />
      </View>
    );
  }
}
