var http = require('http')
var querystring = require('querystring')
var fs = require('fs')
var path = require('path')
var filePath = path.normalize('./iloveu.mp3')

function getTTS(opt,cb){
  fs.exists(filePath, function(exists) {
    new Promise(function (resolve, reject) {
      if(exists){
        resolve()
      }else{
        genTTS(opt).then(function () {
         resolve()
        })
      }
    })
    .then(function (){
      cb(filePath)
      return filePath
    })
  })
}



function genTTS(opt){
  return new Promise(function (resolve, reject) {
    var postData = querystring.stringify(Object.assign({
      'lan': 'cte',
      'ie': 'UTF-8',
      'spd': 5,
      'text': '林溪儿'
    },opt))

    var options = {
      'method': 'GET',
      'hostname': 'tts.baidu.com',
      'path': '/text2audio?' + postData
    }
    var req = http.request(options, function (res) {
      var chunks = []
      res.on('data', function (chunk) {
        chunks.push(chunk)
      })
      res.on('end', function () {
        var body = Buffer.concat(chunks)
        // fs模块写文件
        fs.writeFileSync(filePath, body)
        resolve("Hello World!");
      })
    })
    req.end()
  });
}

module.exports = getTTS
