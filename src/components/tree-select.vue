<template>
    <div class="tree-select" v-checkout-side="close">
        <div class="tree-header" @click="show=true">{{title}}</div>
        <div v-show="show" style="z-index: 9999;position: absolute; top: 22px; right: 0;">
            <tree-panel :selects="selects" @node-click="$emit('node-click', $event)" :childrens="childrens" :node-key="nodeKey"></tree-panel>
        </div>
    </div>
</template>

<script>
    export default {
        name: "tree-select",
        data(){
            return {
                show:false
            }
        },
        methods:{
            close(){
                this.show = false;
            }
        },
        computed:{
            title(){
                return this.titleStyle(this.selectNodes) || this.placeholder;
            },
            selectNodes() {
                const calc = function (childrens, selects, nodes = []) {
                    let index = selects.shift();
                    if (index !== undefined) {
                        let children = childrens[index];
                        if (children) {
                            nodes.push(children);
                            calc(children.childrens, selects, nodes)
                        }
                    }
                    return nodes;
                };
                return calc(this.childrens, this.selects.concat())
            }
        },
        props:{
            childrens:{
                required:true,
                type:Array
            },
            selects:{
                required:true,
                type:Array
            },
            titleStyle:{
                type:Function,
                default(selectNodes){
                    return selectNodes.map(node =>{
                        return node.label
                    }).join(this.titleDelimiter);
                }
            },
            titleDelimiter:{
                default(){
                    return " > ";
                }
            },
            nodeKey:{
            },
            placeholder:{
                default(){
                    return `请选择...`;
                }
            }
        },
        components:{
            treePanel:require('./tree-panel').default
        }
    }
</script>

<style scoped lang="stylus">
    .tree-select{
        position: relative;
        display: inline-block;
        background-color: #FFF;
        color: #000;
        .tree-header{
            border:1px solid #d2d4d8;
            color: #5da9ff;
        }
    }
</style>