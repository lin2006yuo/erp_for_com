<template>
    <ul class="c-tree-ul">
        <li v-for="item in tree">
           <div :class="[item === current ? 'current' : '','par-tree']"
                @click="node_click(item)"
                class="tree-left">
               <i v-if="item.children && item.children.length > 0"
                  :class="[item.show ? 'el-icon-caret-bottom' : 'el-icon-caret-right']"
                  @click.stop="show_click(item)"
                  :title="item.show ? '收起菜单':'展开菜单'">
               </i>
               <span class="treelis" >{{item.label}}</span>
           </div>
           <tree v-if="item.show"
                 :tree="item.children || []"
                 @node-click="node_click"
                 v-model="current"></tree>
        </li>
    </ul>
</template>
<style lang="stylus">
    .c-tree-ul{
        >li{
            line-height: 26px;
            font-size: 1.2rem;
            cursor: pointer;
            .par-tree{
                i{
                    display: inline-block;
                    margin-left: 2px;
                }
                &:hover{
                    // background-color: #1fa6c2;
                    background-color: #e4e8f1;
                }
            }
            .c-tree-ul{
                background :#F1F5F9;
            }

        }
        .current{
            // background-color: #1b6d85;
            // color: #FFF;
            // font-size:18px;
            background-color: #d6dbe5;
        }
        .treelis{
            padding-left:8px;
            display: inline-block;
        }
        & .el-icon-caret-right,
        & .el-icon-caret-bottom {
            color: #999;
        }
        ul ul .tree-left{
            padding-left: 15px;
        }
        ul ul ul .tree-left{
            padding-left: 30px;
        }
    }
</style>
<script>

    export default{
        name:'tree',
        data(){
            return{
                current:this.value,
            }
        },
        methods:{
            show_click(item){
                if(item.show === undefined){
                    this.$set(item, 'show', false);
                }
                item.show = !item.show;
            },
            node_click(item){
                this.$emit('node-click',item);
                this.current = item;
            }
        },
        mounted(){
            this.tree.map(row=>{
                row.show === undefined && this.$set(row,'show',false);
            })
        },
        watch:{
            current(val){
                this.$emit('input',val);
            },
            value(val){
                this.current = val;
            },
            tree(new_,old_){
                if(new_.length !== old_.length){
                    this.tree.map(row=>{
                        row.show === undefined && this.$set(row,'show',false);
                    })
                }
            }
        },
        props:{
            tree:{
                required:true,
                type:Array
            },
            value:{}
        }
    }
</script>
