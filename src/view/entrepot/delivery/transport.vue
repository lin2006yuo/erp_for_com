<template>
    <el-card class="p-transport">
        <mailling-tree
            :transportData="transportData"
            @node-click="handle_node_click"
            @hiddenLeft="emit_hidden_left"
            :titleNode="titleNode"
            @title-click="clearTransport"
        >
        <slot name="all_data" slot="all_data"></slot>
        </mailling-tree>
    </el-card>
</template>
<style lang="stylus">
.p-transport{
    .el-card__body{
        padding: 0 !important;
    }
    .simulate{
        box-sizing:border-box;
        display:inline-block;
        text-align:center;
        color:#fff;
        width:100%;
        height:32px;
        padding:0 5px;
        line-height:32px;
        font-size:1.2rem;
        background:#6495ED;
        border:1px solid #6495ED;
        border-top-left-radius:4px;
        border-top-right-radius:4px;
        border-bottom:1px solid transparent;
    }
}
</style>
<script>
    export default{
        data(){
            return{
                defaultProps:{
                    children: 'children',
                    label: 'label'
                },
                treeid:"",
                selected:[]
            }
        },
        methods: {
            //点击tree时
            handle_node_click(data) {
                this.$emit("node-click",data);
            },
            node_click(i){
                console.log("i",i)
            },
            emit_hidden_left(){
                this.$emit('hidden-left');
            },
            clearTransport(){
                this.$emit('title-click');
            }
        },
        props:{
            transportData:{
                required:true,
                type:Array
            },
            titleNode: {
                type: String,
                default(){
                    return '选择邮寄方式';
                }
            }
        },
        components:{
            maillingTree: require('@/components/mailling-tree.vue').default
        }
    }
</script>
