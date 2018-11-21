import Taro, { Component } from "@tarojs/taro";
import "@tarojs/async-await";
import Loading from "./pages/loading";
import "taro-ui/dist/weapp/css/index.css";
import "./app.styl";
class App extends Component {
  config = {
    pages: [
      "pages/loading",
      "pages/login/login",
      "pages/index/index",
      "pages/class/administration/timetable",
      "pages/class/class",
      "pages/my/my",
      "pages/class/classDetail",
      "pages/class/sign",
      "pages/class/studentSign",
      "pages/class/choiceSeat"
    ],
    window: {
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#3ea1f5",
      navigationBarTitleText: "教师端签到",
      navigationBarTextStyle: "#fff"
    },
    tabBar: {
      color: "#626567",
      selectedColor: "#2A8CE5",
      backgroundColor: "#fff",
      borderStyle: "#e5e5e5",
      list: [
        {
          pagePath: "pages/index/index",
          text: "课表",
          iconPath: "./asset/images/bom_btn1.png",
          selectedIconPath: "./asset/images/bom_btn1_hover.png"
        },
        {
          pagePath: "pages/class/class",
          text: "班级",
          iconPath: "./asset/images/bom_btn2.png",
          selectedIconPath: "./asset/images/bom_btn2_hover.png"
        },
        {
          pagePath: "pages/my/my",
          text: "我的",
          iconPath: "./asset/images/bom_btn3.png",
          selectedIconPath: "./asset/images/bom_btn3_hover.png"
        }
      ]
    }
  };

  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  componentCatchError() {}

  render() {
    return <Loading />;
  }
}

Taro.render(<App />, document.getElementById("app"));
