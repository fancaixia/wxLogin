//app.js
App({
  globalData: {},
  onLaunch: function(e) {
    //项目启动时判断有没有登陆  没有登陆则调用wx.login 获取code
    this.login().then((res)=>{
        this.globalData.code = res;
    }).catch(()=>{
      wx.showToast({
        title: '网络异常！',
        icon: "none",
        duration: 1000
      });

    });
   
  },
  login: function() {
    return new Promise((resolve,reject)=>{
      let token = wx.getStorageSync("token") || "";
      // 登录接口，没有token，那么获取到 code 存到 data 里面，使用code向服务器端获取token
      if (!token) {
        wx.login({
          success: codeInfo => {
            // console.log("code: ",codeInfo);
            let code = codeInfo.code;
            resolve(code)
           
          },
          fail(err){
            reject(err)
          }
        });
      } 

    })
   
  },

});