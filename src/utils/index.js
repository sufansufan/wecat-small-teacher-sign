import Taro from "@tarojs/taro";
import {
  getOpenId,
  checkOpenId,
  sendCode,
  login,
  getSchedule,
  getTeacherSign,
  teacherClass,
  getClassDetail,
  getAttendClassInfo,
  teacherSign,
  allAignStudents,
  singleAignStudents,
  loginOut,
  queryDateTimes
} from "./api";

// Toast提示
export const Toast = params => {
  let defaultParams = {
    text: "",
    status: "success",
    duration: 3000,
    hasMask: false,
    isOpened: true
  };
  if (typeof data === "string") {
    defaultParams.text = params;
  } else {
    defaultParams = Object.assign({}, defaultParams, params);
  }
  return defaultParams;
};

// 设置缓存 默认异步
export const setStorage = (key, data = "", sync = false) => {
  if (typeof key === "object") {
    for (let i in key) {
      console.log(i, key[i]);
    }
    return;
  }
  Taro[sync ? "setStorageSync" : "setStorage"](
    sync
      ? (key, data)
      : {
          key,
          data
        }
  );
};

// 获取缓存 默认异步
export const getStorage = (key, sync = false) => {
  return Taro[sync ? "getStorageSync" : "getStorage"](sync ? key : { key });
};

let openId = null,
  toKen = null,
  userInfo = getStorage("userInfo", true);

// 获取微信登录凭证
export const wxLogin = async () => {
  try {
    const { code } = await Taro.login();
    return code;
  } catch (error) {
    console.log("微信获取临时凭证失败");
  }
};
// 验证登录信息
export const userLogin = async () => {
  try {
    await Taro.checkSession();
    if (!getStorage("token", true)) {
      throw new Error("本地没有缓存token");
    }
    Taro.switchTab({ url: "../pages/index/index" });
  } catch (error) {
    const code = await wxLogin(),
      res = await getOpenId({ code }),
      { openid, session_key } = res.data.open;
    toKen = session_key;
    openId = openid;
    Taro.setStorageSync("openid", openid);
    try {
      const checkRes = await checkOpenId({
        openId: openid
      });
      userInfo = checkRes.data;
      Taro.setStorageSync("userInfo", userInfo);
      Taro.setStorageSync("token", toKen);
      Taro.switchTab({ url: "../pages/index/index" });
    } catch (error) {
      Taro.redirectTo({ url: "../pages/login/login" });
    }
  }
};
// 获取验证码
export const bindPhone = async data => {
  try {
    const vcode = await sendCode(data);
    return vcode;
  } catch (error) {
    console.log("获取验证码失败");
    return {};
  }
};

// 绑定登录
export const bindLogin = async data => {
  try {
    Taro.showLoading({
      title: "登录中...",
      mask: true
    });
    const code = await wxLogin(),
      openRes = await getOpenId({ code });
    Taro.setStorageSync("token", openRes.data.open.session_key);
    Taro.setStorageSync("openid", openRes.data.open.openid);
    const res = await login(data);
    Taro.hideLoading();
    userInfo = res.data.user;
    Taro.setStorageSync("userInfo", res.data.user);
    Taro.showToast({
      title: "登录成功",
      icon: "success",
      duration: 2000,
      complete: () => {
        Taro.switchTab({ url: "../index/index" });
      }
    });
  } catch (error) {
    console.log(error, "绑定登录失败");
  }
};

// 查询课表
export const getScheduleList = async data => {
  try {
    const params = JSON.parse(JSON.stringify(data));
    params.teacher_id = userInfo.teacher_id;
    params.type = userInfo.type;
    delete params.uDate;
    return await getSchedule(params);
  } catch (error) {
    Taro.redirectTo({ url: "../login/login" });
    console.log("查询课表失败");
  }
};

// 获取教师签到信息
export const getTeacherSignList = async data => {
  try {
    const res = await getTeacherSign(data);
    if (res.code === "10000") {
      return res;
    } else {
      throw new Error(res);
    }
  } catch (error) {
    console.log("获取教师签到信息失败");
  }
};

// 教师签到
export const setTeacherSign = async data => {
  try {
    data.teacher_id = userInfo.teacher_id;
    data.type = userInfo.type;
    return await teacherSign(data);
  } catch (error) {
    console.log(error, "教师签到失败");
  }
};

//查询教师课表
export const getTeacherList = async data => {
  try {
    data.teacher_id = userInfo.teacher_id;
    data.type = userInfo.type;
    return await teacherClass(data);
  } catch (error) {
    console.log("查询教师课表失败");
  }
};

//查询班级详情
export const getClassDetailList = async data => {
  try {
    data.teacher_id = userInfo.teacher_id;
    data.type = userInfo.type;
    return await getClassDetail(data);
  } catch (error) {
    console.log("查询班级详情失败");
  }
};

//查询上课班级学生
export const getAttendClassList = async data => {
  try {
    if (userInfo.teacher_id) {
      data.teacher_id = userInfo.teacher_id;
    } else {
      data.staff_id = userInfo.staff_id;
    }
    data.type = userInfo.type;
    return await getAttendClassInfo(data);
  } catch (error) {
    console.log("查询上课班级学生失败");
  }
};
//给全部学生签到
export const teacherToStudentAllSign = async data => {
  try {
    if (userInfo.teacher_id) {
      data.teacher_id = userInfo.teacher_id;
    } else {
      data.staff_id = userInfo.staff_id;
    }
    data.type = userInfo.type;
    return await allAignStudents(data);
  } catch (error) {
    console.log("查询给全部学生签到失败");
    return {};
  }
};
//给单个学生签到
export const oneStudentSign = async data => {
  try {
    if (userInfo.teacher_id) {
      data.teacher_id = userInfo.teacher_id;
    } else {
      data.staff_id = userInfo.staff_id;
    }
    data.type = userInfo.type;
    return await singleAignStudents(data);
  } catch (error) {
    console.log("查询给全部学生签到失败");
  }
};

//行政课表
export const getAdminScheduleList = async data => {
  try {
    if (userInfo.staff_id) {
      data.staff_id = userInfo.staff_id;
    }
    data.type = userInfo.type;
    return await getSchedule(data);
  } catch (error) {
    Taro.redirectTo({ url: "../login/login" });
    console.log("查询行政课表失败");
    return {};
  }
};

//获取时段
export const getDateTimes = async data => {
  try {
    return await queryDateTimes(data);
  } catch (error) {
    console.log("查询时段失败");
  }
};
//退出登录
export const loginGoOut = async data => {
  try {
    return await loginOut(data);
  } catch (error) {
    console.log("退出登录失败");
  }
};
// 时间戳转时间
export const num2Date = (date, fmt = "yyyy-MM-dd h:m:s") => {
  date = new Date(date);
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  let hours = date.getHours(),
    minutes = date.getMinutes(),
    seconds = date.getSeconds(),
    o = {
      "M+": date.getMonth() + 1,
      "d+": date.getDate(),
      "h+": hours < 10 ? "0" + hours : hours,
      "m+": minutes < 10 ? "0" + minutes : minutes,
      "s+": seconds < 10 ? "0" + seconds : seconds
    };

  // 遍历这个对象
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return fmt;
};

// 数字转大写
export const num2font = num => {
  const font = ["十", "一", "二", "三", "四", "五", "六", "七", "八", "九"],
    remd = num % 10;
  if (num <= 10) {
    return font[remd];
  } else {
    if (num < 20) {
      return font[0] + font[remd];
    } else if (remd === 0) {
      return font[num / 10] + font[remd];
    } else {
      return font[(num / 10) | 0] + font[0] + font[remd];
    }
  }
};

export const getDistance = (a, b, r = 200) => {
  const iP = 6370996.81;
  if (!a || !b) return 0;
  a.longitude = PD(a.longitude, -180, 180);
  a.latitude = TD(a.latitude, -74, 74);
  b.longitude = PD(b.longitude, -180, 180);
  b.latitude = TD(b.latitude, -74, 74);
  const distance = Pe(
    TK(a.longitude),
    TK(b.longitude),
    TK(a.latitude),
    TK(b.latitude)
  );
  return distance <= r ? true : false;
  function Pe(a, b, c, d) {
    return (
      iP *
      Math.acos(
        Math.sin(c) * Math.sin(d) + Math.cos(c) * Math.cos(d) * Math.cos(b - a)
      )
    );
  }
  function TK(a) {
    return (Math.PI * a) / 180;
  }
  function PD(a, b, c) {
    for (; a > c; ) a -= c - b;
    for (; a < b; ) a += c - b;
    return a;
  }
  function TD(a, b, c) {
    var p = null;
    b != p && (a = Math.max(a, b));
    c != p && (a = Math.min(a, c));
    return a;
  }
};
