/* eslint-disable */
let k
var d3Tree = {
    genTree: (g, data, patIndex = -1) => {
        if (patIndex === -1) k = -1
        data.forEach(node => {
            //self
            let selfIndex = ++k
            g.setNode(selfIndex, {
                label: node.value ||  node.operator || node.type  ,
                class: "type-" + (node.operator ? 'Operator' : node.type)
            });
            if (selfIndex) {
                //向上回连,root无
                g.setEdge(patIndex, selfIndex);
            }
            if (node.child && node.child.length) {
                //child
                d3Tree.genTree(g, node.child, selfIndex)
            }
        })
    },
    destroyTree: (g) => {
        g.nodes().forEach(n => g.removeNode(n))
    }
}


export default d3Tree
/* eslint-enable */
