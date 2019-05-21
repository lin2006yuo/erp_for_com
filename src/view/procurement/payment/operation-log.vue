<template>
    <div>
        <page-dialog v-model="show" title="操作日志" size="large">
            <el-table border
                      :data="checkList"
                      style="width: 100%;">
                <el-table-column width="90" label="操作人" prop="operator">
                </el-table-column>
                <el-table-column label="日期" width="150" prop="operate_date">
                </el-table-column>
                <el-table-column label="操作状态" width="120" prop="operate_status">
                </el-table-column>
                <el-table-column label="操作记录" prop="operate_content">
                </el-table-column>
            </el-table>
            <div slot="footer">
                <el-button size="mini" @click.native="show = false">关闭</el-button>
            </div>
        </page-dialog>
    </div>
</template>

<style lang="stylus">

</style>

<script>
    export default {
        data(){
            return{
                show: false,
            }
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            }
        },
        props: {
            value: {},
            checkList: {
                required: true,
                type: Array
            },
        },
        components: {
            pageDialog:require('../../../components/page-dialog.vue').default
        }
    }
</script>

