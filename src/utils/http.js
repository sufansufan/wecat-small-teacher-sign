import Taro from "@tarojs/taro";

// 后端是否支持json格式
// const contentType = "application/x-www-form-urlencoded";
const contentType = "application/json";
const basePath = "https://mobile.pxxedu.com/pxxteachersapp/home";
// const basePath = "http://192.168.1.188:8080/pxxteachersapp/home";
let params = { openId: null };
export default class Http {
  noNeedToken = ["mockFakeApi"];
  get(url, data) {
    return this.commonHttp("GET", url, data);
  }
  post(url, data) {
    if (!params.openId) {
      params.openId = Taro.getStorageSync("openid");
    }

    data = Object.assign({}, data, params);
    return this.commonHttp("POST", basePath + url, data);
  }

  async commonHttp(method, url, data) {
    return new Promise(async (resolve, reject) => {
      Taro.showNavigationBarLoading();
      try {
        const res = await Taro.request({
          url,
          method,
          data,
          header: {
            "content-type": contentType
          }
        });
        Taro.hideNavigationBarLoading();
        switch (res.statusCode) {
          case 200:
            switch (res.data.code) {
              case "10000":
                return resolve(res.data);
              default:
                setTimeout(() => {
                  Taro.showToast({
                    title: res.data.errmsg,
                    icon: "none",
                    duration: 3000
                  });
                }, 500);
                reject(new Error(res.data.errmsg));
            }
          default:
            Taro.showToast({
              title: res.data.errmsg,
              icon: "none",
              duration: 3000
            });
            reject(new Error(res.data.errmsg));
        }
      } catch (error) {
        Taro.hideNavigationBarLoading();
        reject(new Error("网络请求出错"));
      }
    });
  }
}
