<template>
    <page-dialog title="添加大货渠道"
                 size="small"
                 @open="open"
                 v-model="visible"
                 minHeight="400px"
                 :close-on-click-modal="false">
        <el-row :gutter="20">
            <el-col :span="16">
                <el-input class="mt-sm" v-model="carrierName" placeholder="请输入关键字进行搜索筛选" @keydown.native.enter="search"></el-input>
            </el-col>
            <el-col :span="8">
                <el-button type="primary" size="mini" class="inline mt-sm" icon="search" @click.native="search">搜索</el-button>
            </el-col>
        </el-row>
        <el-row class="mt-sm">
            <el-tree :data="shippingList"
                    show-checkbox
                    node-key="id"
                    ref="tree"
                    highlight-current
                    :filter-node-method="filterNode"
                    :props="defaultProps">
            </el-tree>
        </el-row>
        <div slot="footer">
            <el-button size="mini"
                       type="primary"
                       @click.native="save">确认</el-button>
            <el-button size="mini"
                       @click.native="visible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    export default {
        data(){
            return {
                visible: false,
                carrierName: '',
                defaultProps: {
                    children: 'children',
                    label: 'label'
                }
            }
        },
        mounted(){

        },
        methods: {
            open(){
                this.carrierName = ''
            },
            search(){
                this.$refs.tree.filter(this.carrierName)
            },
            filterNode(value, data, node) {
                if (!value) return true;
                if(data.label.indexOf(value) !== -1){
                    return true
                }else if(node.level === 2 && node.parent.data.label.indexOf(value) !== -1){
                    return true
                }else{
                    return false
                }
            },
            save(){
                let arr = this.$refs.tree.getCheckedNodes(true);
                if(arr.length === 0){
                    this.$message({type: 'warning', message: '请至少选择一项邮寄方式'});
                    return
                }
                let ids = arr.map(row => row.id);
                this.$emit('add-channel', ids)
            }
        },
        watch: {
            visible(val){
                this.$emit('input', val);
            },
            value(val) {
                this.visible = val;
            },
        },
        props: {
            value:{
                type: Boolean,
                required: true
            },
            shippingList: {
                type: Array,
                required: true
            }
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            uiTip: require('@/components/ui-tip.vue').default,
            labelItem: require('@/components/label-item').default
        },
    }
</script>
