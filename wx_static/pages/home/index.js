const app = getApp();
import { getBless } from "../../service/api";
import service from "../../service/service";

Page({

  data: {
    bless:''
  },
  onLoad: function (query) {
    

  },
  onShow() {

    //判断是否登陆过
    if (!wx.getStorageSync("token")) {

      //没有token  进入登陆页面
      wx.redirectTo({
        url: "/pages/login/index"
      });
      return;
    } else {

      //存在token  请求祝福
      service({
        url: getBless.url,
        data: {
          
        },
        method: "POST",
      })
        .then(response => {

          wx.hideLoading();
          //如果状态吗为200  那么token有效 否则清空token  并返回登录
          if (response.status == 200) {
            // 存储到data  显示到页面
            this.setData({
              bless: response.data.bless
            })
          } else {
            wx.setStorage({
              key: "token",
              data: '',

            });
            wx.redirectTo({
              url: "/pages/login/index"
            });

          }
        }
        )
        .catch(error => {
          // console.log('getbless_fail')
          wx.showToast({
            title: '网络异常！'
          });
        });


    }

  },

});
