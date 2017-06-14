function tokenizer(str) {
    var token = ''
    var result ={words:[],error:{}}

    var lastStatus
    var changeStatus = function (s){
      lastStatus = s
    }
    //存储上次token,设置新的token
    var changeToken = function (c){
      token && result.words.push(token)
      token = c
    }
    //replace spaces
    str=str.replace(/\s/ig,"");
    try{
      str.split('').forEach((char, index) => {
          if (!isTargetChar(char)) {
              result.error = new Error('tokens at ' + index + ' char error')
              //跳出循环
              throw result.error
          }
          if (isNumber(char)) {
              if (lastStatus != 'char') {
                  changeToken(char)
              } else if( lastStatus === 'char'){
                //当前word未结束 无需change
                  token += char
              }
              changeStatus('char')
          }
          if (isOperator(char)) {
              //如果上个状态是数字,说明是操作符,否则是正负数
              //但其他如js中,也允许'+-+1,-+-1',很奇怪,先只处理正负数的'-1,+1'
              changeToken(char)
              if (lastStatus === 'char') {
                changeStatus('op')
              }else if(lastStatus !== 'char' && isTermOperator(char)){
                //符号数的符号
                changeStatus('char')
              }

          }
          if (isParenthe(char)) {
              changeToken(char)
              changeStatus('paren')
          }
          //尾部转存后结束
          if (index == str.length - 1) {
              changeToken('')
          }
      })
    }catch(e){
      //为了控制流,不是真的异常..不处理
    }

    return result
}

function isNumber(char) {
    return !isNaN(char)
}

function isOperator(char) {
    return ['+', '-', '*', '/'].indexOf(char) != -1
}

function isTermOperator(char) {
    return ['+', '-'].indexOf(char) != -1
}

function isParenthe(char) {
    return ['(', ')'].indexOf(char) != -1
}

function isTargetChar(char) {
    return isNumber(char) || isOperator(char) || isParenthe(char)
}

module.exports = tokenizer
