import Taro, { Component } from "@tarojs/taro";

import { AtList, AtListItem, AtIcon } from "taro-ui";
// import { loginGoOut } from "../../utils/index";

export default class MyIndex extends Component {
  config = { navigationBarTitleText: "我的" };
  update() {
    // wx.getUpdateManager 在 1.9.90 才可用，请注意兼容
    const updateManager = Taro.getUpdateManager();
    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
      if (!res.hasUpdate) {
        Taro.showToast({
          title: "版本已最新",
          icon: "success"
        });
      }
    });

    updateManager.onUpdateReady(function() {
      Taro.showModal({
        title: "更新提示",
        content: "新版本已经准备好，是否马上重启小程序？",
        success: function(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          }
        }
      });
    });

    updateManager.onUpdateFailed(function() {
      // 新的版本下载失败
      Taro.showToast({
        title: "版本下载失败"
      });
    });
  }
  loginOut() {
    // Taro.removeStorageSync("token");
    Taro.reLaunch({ url: "/pages/login/login" });
    // loginGoOut();
  }
  render() {
    return (
      <AtList>
        <AtListItem
          title="检查更新"
          iconInfo={{ value: "download-cloud", color: "#3ea1f5", size: 24 }}
          onClick={this.update}
        />
        <AtListItem
          title="退出登录"
          iconInfo={{
            value: "external-link",
            color: "#3ea1f5",
            size: 20,
            customStyle: "margin-left: 3px"
          }}
          onClick={this.loginOut}
        />
      </AtList>
    );
  }
}
