const app = getApp();
import service from "../../service/service";
import { getToken } from "../../service/api";
Page({

  data: {},
  onLoad: function (query) {
    
  },
  onShow(){
    app.login().then((res) => {
      app.globalData.code = res;
    }).catch(() => {
      wx.showToast({
        title: '网络异常！',
        icon: "none",
        duration: 1000
      });
    });

  },
//登陆页面  查看用户是否授权
  getUserInfo: function (userInfo) {
    // console.log(userInfo, " 查看用户授权信息")
    //查看用户是否授权 
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.record']) {
            // console.log('没有授权')
        }else{
          // console.log('授权过了')
        }
      }
    })
    //判断是点击授权  点击拒绝停在登录页面
    if (!userInfo.detail.rawData || !userInfo.detail.signature){
        wx.showModal({
          title: '提示',
          content: '您没有授权，不能查看祝福',
        })
        return false;
    }

    // 展示登录中加载提示
    wx.showLoading({
      title: "登录中",
      mask: true
    });

    // 调用服务端 API  获取token
    service({
      url: getToken.url,  
      method: "post",
      data: {
        code: app.globalData.code,
        rawData: userInfo.detail.rawData,
        signature: userInfo.detail.signature,
        encryptedData: userInfo.detail.encryptedData
      }
    })
    .then(response => {
      // console.log('LOGIN_success：', response.data)
        wx.hideLoading();
        if (response.status == 200) {
          // 把自定义登录状态 token 缓存到小程序缓存
          try {
            wx.setStorageSync('token', response.data.token);

          } catch (e) { 

          }
          wx.navigateBack({
            url: '/pages/home/index'
          })
        } else {
          // 登录如果服务端产生异常如果重新获取 code，因为code 只能使用一次
          app.login().then((res) => {
            app.globalData.code = res;
          }).catch(() => {
            wx.showToast({
              title: '网络异常！',
              icon: "none",
              duration: 1000
            });
          });
 
        }
      }
    ).catch(error => {
        // 服务端产生异常 重新获取code，因为code只能使用一次
        app.login().then((res) => {
          app.globalData.code = res;
        }).catch(() => {
          wx.showToast({
            title: '网络异常！',
            icon: "none",
            duration: 1000
          });
        });
    });
  }
});
