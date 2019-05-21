<template>
    <div v-resize="{height:40}" class="c-tree">
        <div class="el-table__header-wrapper">
            <div class="goods-part">
                <div class="classify_logo">
                    <i></i>
                    <span  class="color-white" style="text-align:left;" @click="clearTransport">{{titleNode}}</span>
                </div>
                <div @click.stop="hiddenTree" class="butoon-left">
                    <i class="arrow-btn"></i>
                </div>
            </div>
            <slot name="all_data"></slot>
        </div>
        <div class="el-table__body-wrapper" style="overflow-y:auto;overflow-x:hidden;">
            <tree  @node-click="handle_node_click" :tree="transportData"></tree>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        transportData: {
            required:true,
            type:Array
        },
        titleNode: {
            required: true,
            type: String
        }
    },
    methods: {
        handle_node_click(item) {
            this.$emit('node-click', item);
        },
        hiddenTree() {
            this.$emit('hiddenLeft');
        },
        clearTransport(){
            this.$emit('title-click');
        }
    },
    components : {
        tree:require("./tree.vue").default,
    }
}
</script>
