import Http from "./http";

const http = new Http();

// 获取openId
export const getOpenId = data => http.post("/login/code/getOpenId", data);

//  验证openId
export const checkOpenId = data =>
  http.post("/login/code/checkOpenIdForTeacher", data);

// 发送验证码
export const sendCode = data => http.post("/login/code/sendCode", data);

// 登录
export const login = data => http.post("/login/login/teacherLogin", data);

// 查询常量
export const sysconstList = data =>
  http.post("/common/sysconst/querySysconsts", data);

//获取教师班级列表
export const teacherClass = data =>
  http.post("/class/class/queryPxxClass", data);

// 查询课表
export const getSchedule = data =>
  http.post("/schedule/schedule/getSchedule", data);

// 获取教师签到信息
export const getTeacherSign = data =>
  http.post("/schedule/attendClass/getTeacherSign", data);

// 教师签到
export const teacherSign = data =>
  http.post("/schedule/attendClass/teacherSign", data);

//班级详情
export const getClassDetail = data =>
  http.post("/class/class/getPxxClassInfo", data);

//学生签到信息
export const getAttendClassInfo = data =>
  http.post("/class/attendClass/getAttendClassInfo", data);

//给学生全部签到
export const allAignStudents = data =>
  http.post("/schedule/attendClass/teacherToStudentAllSign", data);

//给单个学生签到
export const singleAignStudents = data =>
  http.post("/schedule/attendClass/teacherToStudentSinglelSign", data);

//获取上课时间段
export const queryDateTimes = data =>
  http.post("/common/sysconst/queryDateTimes", data);

//退出登录
export const loginOut = data => http.post("/login/login/LoginOut", data);
