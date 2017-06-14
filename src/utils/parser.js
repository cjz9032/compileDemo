/* eslint-disable */
function parser(token) {
    var result = {
        node: [],
        error: {}
    };
    //util
    var util = (function() {
        var _util = {}
        var i = 0

        _util.isLastWord = function() {
            return !_util.nextWord();
        }

        _util.nextWord = function() {
            return token[i++];
        }

        _util.isNumber = function(w) {
            return !window.isNaN(w)
        }

        _util.handleUnmatched = function() {
            i--
            return i >= 0
        }

        _util.handleError = function(str) {
            throw new Error(str + ' postition at ' + i + ' word')
        }


        _util.tree = {
            Node: function({
                type,
                value,
                operator = '',
                child = []
            }) {
                this.type = type;
                this.operator = operator;
                this.child = child;
                this.value = value;
            },
            setNode: function(node, patNode) {
                var curNode = new _util.tree.Node(node)
                if (patNode) {
                    patNode.child.push(curNode)
                }
                return curNode
            }
        }

        return _util
    })()


    try {
        let root = util.tree.setNode({
            type: 'root'
        })
        result.node = root
        Expr({
            node: root
        })
        return result
    } catch (err) {
        result.error = err;
        return result
    }


    //上下无关，所以都只需要 返回结果即可

    /**
     * Expr -> Term  ExprTail
     **/
    function Expr({
        node: patNode
    } = {}) {
        let node = util.tree.setNode({
            type: 'Expr'
        }, patNode)
        return Term({
            node
        }) && ExprTail({
            node
        })
    }

    /**
     * ExprTail -> + Term  ExprTail
     *          |  - Term  ExprTail
     *          |  null
     **/
    function ExprTail({
        node: patNode
    } = {}) {
        let node = util.tree.setNode({
            type: 'ExprTail'
        }, patNode)
        let word = util.nextWord()
        if (['+', '-'].indexOf(word) > -1) {
          let nodeOp = util.tree.setNode({
              type: 'Operator',
              operator:word
          }, node)
            return Term({
                node
            }) && ExprTail({
                node
            })
        } else {
            return util.handleUnmatched()
        }
    }

    /**
     * Term -> Factor  TermTail
     **/
    function Term({
        node: patNode
    } = {}) {
        let node = util.tree.setNode({
            type: 'Term'
        }, patNode)
        return Factor({
            node
        }) && TermTail({
            node
        })
    }

    /**
     * TermTail -> * Factor TermTail
     *          |  / Factor TermTail
     *          |  null
     **/
    function TermTail({
        node: patNode
    } = {}) {
        let node = util.tree.setNode({
            type: 'TermTail'
        }, patNode)
        let word = util.nextWord()
        if (['*', '/'].indexOf(word) > -1) {
            let nodeOp = util.tree.setNode({
                type: 'Operator',
                operator:word
            }, node)

            return Factor({
                node
            }) && TermTail({
                node
            })
        } else {
            return util.handleUnmatched()
        }
    }

    /**
     * Factor -> (Expr)
     *        |  num
     **/
    function Factor({
        node: patNode
    } = {}) {
        let node = util.tree.setNode({
            type: 'Factor'
        }, patNode)
        let word = util.nextWord()
        if (word === '(') {
            // 1.'(expr)'
            if (Expr({
                    node
                })) {
                var wordEnding = util.nextWord()
                if (wordEnding !== ')') {
                    util.handleError('need ")"')
                }
                return true
            } else {
                util.handleError('need expr')
            }
        } else if (util.isNumber(word)) {
            // 2.num
            let nodeN = util.tree.setNode({
                type: 'Number',
                value: word
            }, node)
            return true
        } else {
            util.handleError('unknow error')
        }
    }
}

//console.log(parser(['(', '1', '+', '2', ')', '*', '3'])) //=> true
export default parser
/* eslint-enable */
