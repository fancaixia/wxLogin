const express = require('express')
const route_login = express.Router();
const jwt = require('jsonwebtoken');
const http = require('https');  
const qs = require('querystring');  
const wxconfig = require('../config')


let blesses = ['妈呀！咋又胖了呢','又帅了哦','么么哒']


let database={};  //模拟数据库
//openid为下标  例：
//{o6w2f4iCeCQja1t_kXD0tTVRCLTQ:{token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uX2tleSI6IktXMENxQVRXQi9KRDZ1SEdua21aVVE9PSIsImlhdCI6MTU0ODY0MTE4NCwiZXhwIjoxNTQ4NjQxNzg0fQ.5rFuKXzvNW7D6a9Lq4K9SpHFk28T_yWODSibix5WTwY'}}


const createToken = (session_key,openid)=>{

    let token = jwt.sign({
        session_key: session_key,
    }, openid, {
        expiresIn:10*60   //token过期时间
    });
    return token;
}

route_login.post('/login',(_req,_res)=>{

    // console.log(req.body, " 页面传入参数")
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
            //根据返回值创建token   session_key为加密主题openid为密钥
            const token = createToken(newdata.session_key,openid); 
            //遍历database  检测是否存在openid  存在的话更新token  否则插入 openid:{token,}
            if(database[openid]){
                database[openid][token]=token
            }else{
                database[openid]=({token,})
            }

            _res.send({status:200,data:{token,openid,},}).end();
            
        });  
        
    });  
      
    req.on('error', function (e) {  
        console.log('problem with request: ' + e.message);  
    });  

    req.end();
    

})
route_login.post('/bless',(req,res)=>{

    let clienttoken = req.body.token;
    let openid = req.body.openid;

    //检测token时，数据库中查找 openid ，没有就返回前台token失效（前台返回登录）
    //数据库存在 openid ，那么就使用token和openid解密  解密成功更新数据库openid对应token
    // openid = openid.replace(/\"/g,'')

    if(database[openid]){
        //解密token
        jwt.verify(clienttoken, openid, function (err, decoded) {
            if (err){

                res.send({status:0,data:{errmsg:'token失效'},}).end();
            }else if(decoded){

                res.send({status:200,data:{bless:blesses[Math.floor(Math.random()*blesses.length)]}}).end()
            }
        })
    }else{
        
        res.send({status:0,data:{errmsg:'token失效'},}).end();
    }
  
    
})


module.exports= route_login;