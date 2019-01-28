/**
 * 接口定义
 */
import config from "../config";
// 登录注册接口
const getToken = {
  url: config.serverHost + "/api/login",

};
//获取祝福
const getBless = {
  url: config.serverHost + "/api/bless",

};

export {
  getToken,
  getBless,
};