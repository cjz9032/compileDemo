function calc(root) {
    return calcExpr(root.child[0])
}


function calcExpr(Expr) {
    var result = calcTerm(Expr.child[0]);
    var tailNode = Expr.child[1]
    //递归expr尾节点
    while (tailNode.child.length ) {
        var operator =tailNode.child[0].operator;
        var lastParam = calcTerm(tailNode.child[1]);
        //传入左,合并,再次做为左
        result = _calcStr(operator, result, lastParam)
        tailNode = tailNode.child[2];
    }
    return result;
}

function calcTerm(Term) {
    var result = calcFactor(Term.child[0]);
    var tailNode = Term.child[1]
    //递归expr尾节点
    while (tailNode.child.length ) {
        var operator =tailNode.child[0].operator;
        var lastParam = calcFactor(tailNode.child[1]);
        //传入左,合并,再次做为左
        result = _calcStr(operator, result, lastParam)
        tailNode = tailNode.child[2];
    }

    return result;
}

function calcFactor(Factor) {
    let type = Factor.child[0].type;
    if (type == 'Expr') {
        return calcExpr(Factor.child[0]);
    } else if (type == 'Number') {
        return Factor.child[0].value
    } else {
        return Factor.child[0]
    }
}

//计算表达式
function _calcStr(op, l, r) {
    l=_parseNum(l)
    r=_parseNum(r)
    var result = 0
    switch (op) {
        case '+':
            result = l + r;
            break;
        case '-':
            result = l - r;
            break;
        case '*':
            result = l * r;
            break;
        case '/':
            result = l / r;
    }
    return result
}

//转换数字
function _parseNum(str) {
    return str*1
}

module.exports = calc;
