<template>
    <div class="box">
    <el-dialog
        :title="`${title} 侵权记录`"
        width="40%"
        @close="close"
        :visible.sync="show"
    >
        <el-table :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="拼命加载中……">
            <el-table-column prop="channel_name" label="平台"></el-table-column>
            <el-table-column prop="site_code" label="站点"></el-table-column>
            <el-table-column prop="account_name" label="账号"></el-table-column>
            <el-table-column prop="tort_time" label="时间"></el-table-column>
            <el-table-column prop="remark" label="描述"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <slot></slot>
        </span>
        <div v-if="count>20" class="block" style="text-align: right">
            <el-pagination
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-size="20"
                layout="total, prev, pager, next"
                :total="count">
            </el-pagination>
        </div>
    </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "tort-table",
        data() {
            return {
                currentPage:1,
                show:this.value,
                loading:this.isloading,
            }
        },
        methods:{
            handleCurrentChange(val){
                this.$emit('handleCurrentChange',val)
            },
            close(){
                this.currentPage = 1;
            },
        },
        watch:{
            show(val){
                this.$emit('input',val)
            },
            value(val){
                this.show=val
            },
            isloading(val){
                this.loading = val
            },
            loading(val){
                this.$emit('update:isloading',val)
            }
        },
        props: {
            count:{
                default:0
            },
            tableData:Array,
            value:Boolean,
            isloading:Boolean,
            title:String,
        }
    }
</script>

<style lang="stylus">
    .box{
    >.el-dialog__header{
        padding: 20px 20px;
        box-shadow: 0 2px 4px 0 rgba(0,0,0,0.12), 0px 0px 6px 0px rgba(0,0,0,0.04);
    }}
</style>
