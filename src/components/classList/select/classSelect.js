import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import PropTypes from "prop-types";

import "./classSelect.styl";

export default class ClassSelect extends Component {
  constructor(props) {
    super(...props);
  }
  componentWillMount() {}
  componentDidMount() {}
  componentWillUpdate() {}
  componentDidUpdate() {}

  componentDidShow() {}

  componentDidHide() {}
  selectValue(val) {
    if (this.props.yearStatus) {
      this.props.onSelectYear(val);
    } else if (this.props.commonStatus) {
      this.props.onSelectCommon(val);
      this.props.onScrolls();
    }
  }
  render() {
    let selectStyle = null;
    if (this.props.yearStatus) {
      selectStyle = "year-bg";
    } else if (this.props.commonStatus) {
      if (this.props.status) {
        selectStyle = "class-long-bg";
      } else {
        selectStyle = "class-short-bg";
      }
    } else {
      selectStyle = "";
    }
    return (
      <View className={selectStyle}>
        <ScrollView
          scrollY
          style="height: 200px;"
          scrollWithAnimation
          className={
            this.props.yearStatus || this.props.commonStatus
              ? "class-select"
              : "class-select hide"
          }
        >
          {this.props.data.map((item, index) => (
            <View key={index} onClick={this.selectValue.bind(this, item.value)}>
              <Text
                className={
                  this.props.yearValue == item.value ||
                  this.props.commonValue == item.value
                    ? "font-active"
                    : ""
                }
              >
                {item.value}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
}
ClassSelect.PropTypes = {
  yearStatus: PropTypes.bool,
  onSelectYear: PropTypes.func,
  yearValue: PropTypes.string,
  commonStatus: PropTypes.bool,
  onSelectCommon: PropTypes.func,
  commonValue: PropTypes.string,
  status: PropTypes.string,
  onScrolls: PropTypes.func,
  data: PropTypes.array
};
ClassSelect.defaultProps = {
  yearStatus: false,
  onSelectYear: () => {},
  yearValue: "",
  commonStatus: false,
  onSelectCommon: () => {},
  commonValue: "",
  data: []
};
