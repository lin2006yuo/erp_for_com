<template>
    <div class="node-tree-select">
        <div @click="is_close" class="select">
            <span class="ml-sm">{{label}}</span>
            <i  :class="[show?'el-icon-caret-bottom':'el-icon-caret-left','middle']" ></i>
        </div>
        <node-tree class="node-tree1" v-if="show" v-model="value_" @last="last" :child_ids="child_ids" :tree="tree"></node-tree>
    </div>
</template>
<style lang="stylus">
    .node-tree-select{
        position: relative;
        left: 0;
        top:0;
        .node-tree1{
            position: absolute;
            top:28px;
            left:0;
            overflow-x: hidden;
            z-index: 100;
        }
        overflow-y: auto;
        .select{
            width: 100%;
            border:1px solid #C0CCDA;
            border-radius: 4px;
            position: relative;
            height: 26px;
            left: 0;
            top:0;
            >span{
                display: inline-block;
                width: 80%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        .middle{
        display: block;
        position: absolute;
        top:0;
        right: 0;
        line-height: 26px;
        z-index: 103;
         }
        .el-icon-caret-left:before{
              position:absolute;
              right: 7px;
          }
        .el-icon-caret-bottom:before{
            position:absolute;
            right: 7px;
        }
    }
</style>
<script>

    export default{
        data(){
            return{
                value_:this.value,
                show:false,
            }
        },
        methods:{
            last(child){
                this.show = false;
                this.value_ = child.id;
            },
            is_close(){
                this.show=!this.show;
            },
        },
        computed:{
            child_ids(){
                return this.tree.child_ids || [];
            },
            label(){
                let names = [];
                let caluc = (pid) =>{
                    let child = this.tree[pid];
                    if(child){
                        names.push(child.title);
                        child.pid > 0 && caluc(child.pid)
                    }
                };
                caluc(this.value_);
                return names.reverse().join(this.sep) || "无";
            }
        },
        watch:{
            value_(val){
                this.$emit('input', val);
            },
            value(val){
                this.value_ = val;
            }
        },
        props:{
            value:{},
            tree:{},
            sep:{
                default(){
                    return ">>";
                }
            }
        },
        components:{
            nodeTree:require('./node-tree.vue').default
        }
    }
</script>