import Taro, { Component } from "@tarojs/taro";
import { View, Text, Input } from "@tarojs/components";
import { AtIcon } from "taro-ui";

import List from "./list";
import ClassSelect from "./select/classSelect";
import ConstantList from "./constant/constantList";

import "taro-ui/dist/weapp/css/index.css";
import "./classList.styl";
import "./select/classSelect.styl";

export default class ClassList extends Component {
  constructor() {
    super();
    this.state = {
      data: {
        particular_year: "2018",
        season: "",
        grade: "",
        subject: "",
        classType: "",
        Value: ""
      },
      yearData: [
        { value: new Date().getFullYear() - 1 },
        { value: new Date().getFullYear() },
        { value: new Date().getFullYear() + 1 }
      ],
      yearStatus: false,
      scroll: true,
      dataList: [],
      tableType: ""
    };
  }
  componentWillMount() {
    const userInfo = Taro.getStorageSync("userInfo");
    this.setState({ tableType: userInfo.type });
  }
  yearClick() {
    this.setState({ yearStatus: !this.state.yearStatus });
  }
  selectYear(val) {
    this.setState({
      yearStatus: !this.state.yearStatus,
      data: { particular_year: val }
    });
    this.getData({ particular_year: val });
  }
  searchValue(e) {
    this.getData({ searchContent: e.detail.value });
  }
  scrollEvent() {
    this.setState({ scroll: !this.state.scroll });
  }
  getData(param) {
    this.refs.classList.getData(param);
  }
  render() {
    return (
      <View className="class-box">
        <View className="search">
          <View>
            <View className="at-row">
              <View className="at-col at-col-3">
                <View className="class-year" onClick={this.yearClick}>
                  <Text>{this.state.data.particular_year}</Text>
                </View>
              </View>
              <View className="at-col at-col-9 search-class">
                <AtIcon value="search" size="15" color="#aaaaaa" />
                <Input
                  placeholder="搜索"
                  placeholder-style="color:#aaaaaa;font-size: 14px;"
                  className="class-input"
                  onBlur={this.searchValue}
                />
              </View>
            </View>
          </View>
          <ClassSelect
            yearStatus={this.state.yearStatus}
            onSelectYear={this.selectYear}
            yearValue={this.state.data.particular_year}
            data={this.state.yearData}
          />
        </View>
        <View className="common-type">
          <ConstantList
            onScroll={this.scrollEvent}
            status="1"
            onGetData={this.getData}
          />
        </View>
        <View className="class-list-box">
          <List scroll={this.state.scroll} ref="classList" />
        </View>
        {this.state.tableType === "staff" ? (
          <View className="table-mask">
            <Text>行政老师暂无班级信息</Text>
          </View>
        ) : (
          ""
        )}
      </View>
    );
  }
}
