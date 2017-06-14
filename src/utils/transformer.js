function transformer(root) {
    return transformExpr(root.child[0])
}

function transformExpr(Expr) {
    var result = transformTerm(Expr.child[0]);
    var tailNode = Expr.child[1]
    while (tailNode.child.length ) {
        var operator =tailNode.child[0].operator;
        var lastParam = transformTerm(tailNode.child[1]);
        result = `(${operator} ${result} ${lastParam})`;
        tailNode = tailNode.child[2];
    }
    return result;
}

function transformTerm(Term) {
    var result = transformFactor(Term.child[0]);
    var tailNode = Term.child[1]
    while (tailNode.child.length ) {
        var operator =tailNode.child[0].operator;
        var lastParam = transformFactor(tailNode.child[1]);
        result = `(${operator} ${result} ${lastParam})`;
        tailNode = tailNode.child[2];
    }

    return result;
}

function transformFactor(Factor) {
    let type =Factor.child[0].type;
    if (type == 'Expr') {
        return transformExpr(Factor.child[0]);
    }else if(type == 'Number'){
        return Factor.child[0].value
    }
    else{
      return Factor.child[0]
    }
}

module.exports = transformer;
