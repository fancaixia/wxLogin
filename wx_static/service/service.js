//获取应用实例
const app = getApp();
const service = options => {

  wx.showNavigationBarLoading();

  options = {
    dataType: "json",
    ...options,
    method: options.method ? options.method.toUpperCase() : "GET",
    header:{
      token: wx.getStorageSync("token") || '',
    }
  };
  const result = new Promise(function(resolve, reject) {
    //做一些异步操作
    const optionsData = {
      success: res => {
        wx.hideNavigationBarLoading();
        resolve(res.data);
      },
      fail: error => {
        wx.hideNavigationBarLoading();
        reject(error);
      },
      ...options
    };
    wx.request(optionsData);
  });
  return result;
};

export default service;
