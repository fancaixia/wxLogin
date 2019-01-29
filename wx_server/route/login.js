const express = require('express')
const route_login = express.Router();
const jwt = require('jsonwebtoken');
const http = require('https');  
const qs = require('querystring');  
const wxconfig = require('../config')


let blesses = ['妈呀！咋又胖了呢','又帅了哦','么么哒']


let database= [];  //模拟数据库

const createToken = (rawData,openid)=>{

    let token = jwt.sign({
        "nickName":rawData.nickName,
        "gender":rawData.gender,
        "language":rawData.language,
        "city":rawData.city,
        "province":rawData.province,
        "country":rawData.country,
    }, openid, {
        expiresIn: 2*60*60   //token过期时间两小时
    });
    return token;
}

route_login.post('/login',(_req,_res)=>{

    // console.log(_req.body, " 页面传入参数")
    //通过前端的code  和 appid  secret  grant_type  获取 openid  session_key
    // https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
    var data = {  
        appid: wxconfig.appid,  
        secret: wxconfig.secret,
        js_code: _req.body.code,  
        grant_type:'authorization_code'
    } 
    var content = qs.stringify(data);  
    var options = {  
        hostname: 'api.weixin.qq.com',  
        port: '',  
        path: '/sns/jscode2session?' + content,  
        method: 'GET' ,
        header: {
            "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
        }, 
    };  

    var req = http.request(options, function (res) {  

        res.on('data', function (_data) {  

            let newdata = JSON.parse(_data.toString())
            const openid = newdata.openid;
            const token = createToken(_req.body.rawData,openid); 
            //检测datebase  是否为空  空的话直接添加 
            if(database.length <= 0){
                database.push({openid,token,session_key:newdata.session_key,})
                _res.send({status:200,data:{token,},}).end();
                return false;
            }
            //不为空 遍历database 检测是否存在 openid  存在的话更新token  否则插入 {openid,token,session_key}
            let openidFlag = false;   //是否存在openid标记
            database.forEach((item,index)=>{
                if(item.openid == openid){
                    item.token = token;
                    openidFlag = true
                }
            })
            if(!openidFlag){
                database.push({openid,token,session_key:newdata.session_key,})
            }
            _res.send({status:200,data:{token,},}).end();
            
        });  
        
    });  
      
    req.on('error', function (e) {  
        console.log('problem with request: ' + e.message);  
    });  

    req.end();
    

})
route_login.post('/bless',(req,res)=>{

    // let clienttoken = req.body.token;
    let clienttoken = req.headers.token;
    console.log(clienttoken, " :clinettoken")

    //检测 token 时，数据库中查找 token  没有就返回token失效  有的话就使用token对应openid 解密
    let tokenFlag = false;  //是否存在token标记
    database.forEach((item,index)=>{
        if(item.token == clienttoken){
            tokenFlag = true;
            //解密token
            jwt.verify(clienttoken, item.openid, function (err, decoded) {
                if (err){
                    res.send({status:0,data:{errmsg:'token失效'},}).end();
                }else if(decoded){

                    res.send({status:200,data:{bless:blesses[Math.floor(Math.random()*blesses.length)]}}).end()
                }
            })
        }
    })

    if(!tokenFlag){
        res.send({status:0,data:{errmsg:'token失效'},}).end();
    }
   
    
})


module.exports= route_login;