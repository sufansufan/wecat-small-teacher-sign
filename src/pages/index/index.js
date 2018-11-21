import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";

import Calendar from "../../components/calendar/calendar";
import AdminTimeTable from "../../components/classList/administration/adminTimeTable";

export default class Index extends Component {
  config = { navigationBarTitleText: "课表" };
  constructor(props) {
    super(props);
    this.state = { tableType: "", getList: false };
  }
  componentWillMount() {
    this.setState({
      tableType: Taro.getStorageSync("userInfo").type
    });
  }

  componentWillUnmount() {}

  componentDidShow() {
    const params = Taro.getStorageSync("getIndexList");
    if (params) {
      this.setState({
        getList: params
      });
      Taro.removeStorage({ key: "getIndexList" });
    }
  }
  componentDidHide() {}
  render() {
    return (
      <View>
        {this.state.tableType === "teacher" ? (
          <Calendar getList={this.state.getList} />
        ) : (
          <AdminTimeTable />
        )}
      </View>
    );
  }
}
