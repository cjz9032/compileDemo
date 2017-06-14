<template>
<div style="height:100vh;overflow:hidden;flex-direction: column;    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;display: flex;">
    <div style="padding:15px">
        <input type="text" name="" value="" v-model="expresstion">
        <br> tokenResult : {{tokenResult}}
        <br> parserResult : {{parserResult}}
        <br> lispResult : {{lispResult}}
        <br> calcResult : {{calcResult}}
        <br>
    </div>
    <div style="flex: 1 1 auto;
    order: 0;overflow-y:auto">
        <svg id="svg-canvas" width=100% height=600></svg>
    </div>
</div>
</template>

<script>
import parser from './utils/parser'
import tokenizer from './utils/tokenizer'
import d3 from 'd3'
import dagreD3 from 'dagreD3'
import d3Tree from './utils/d3-tree'
import transformer from './utils/transformer'
import calc from './utils/calc'


import _ from 'underscore'

export default {
    name: 'app',
    data() {
        return {
            expresstion: "",
            calcResult:'',
            lispResult:'',
            g: null
        }
    },
    computed: {
        tokenResult () {
            let r = Object.assign(tokenizer(this.expresstion))
            r.err = r.error.message
            delete r.error
            return r
        },
        parserResult () {
            let r = Object.assign(parser(this.tokenResult.words))
            r.err = r.error.message
            delete r.error
            delete r.node
            return r
        }
    },
    watch: {
        expresstion (n) {
            if(!this.parserResult.err){
              let r = Object.assign(parser(this.tokenResult.words))
              //trans
              var obj = transformer(Object.assign(r.node))
              this.lispResult = obj
              //calc
              this.calcResult = calc(Object.assign(r.node))
              this.nodes = [r.node]
              this.rerenderTree()
            }
        }
    },
    methods: {
        rerenderTree: _.debounce(function() {
            //mock
            var treeData = this.nodes
            let g = this.g
            //clear
            d3Tree.destroyTree(g)
            if (treeData && treeData.length) {
                //setNode
                d3Tree.genTree(g, treeData)
                //style
                g.nodes().forEach(function(v) {
                    var node = g.node(v);
                    node.rx = node.ry = 5;
                });
                // renderer
                var render = new dagreD3.render();
                var svg = d3.select("svg"),
                    svgGroup = svg.append("g");
                render(d3.select("svg g"), g);
                // container style
                var xCenterOffset = (svg[0][0].clientWidth - g.graph().width) / 2
              //  svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20)")
                svg.attr("height", g.graph().height + 40)
            }
        }, 500)
    },
    mounted() {
        //create
        this.g = new dagreD3.graphlib.Graph()
            .setGraph({})
            .setDefaultEdgeLabel(function() {
                return {};
            })
        this.expresstion = '(-1+2)*3' //1+2
        //  this.rerenderTree()
    }
}
</script>

<style lang="scss">
body {
    margin: 0;
}
input {
    padding: 5px 8px;
    font-size: 16px;
}

svg {
    .node {
        &.type-Number {
            > rect {
                fill: #00ffd0;
            }
        }
        &.type-Operator {
            > rect {
                fill: #f9ac0f;
            }
        }
        rect {
            stroke: #999;
            fill: #fff;
            stroke-width: 1.5px;
        }
    }
    .edgePath path {
        stroke: #333;
        stroke-width: 1.5px;
    }
    text {
        font-weight: 300;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serf;
        font-size: 14px;
    }
}
</style>
