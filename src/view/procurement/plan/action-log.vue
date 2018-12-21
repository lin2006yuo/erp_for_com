<template>
    <div class="c-price-change.vue">
        <page-dialog title="操作日志" v-model="show" size="large" :close-on-click-modal="false">
            <div style="height: auto;">
                <el-table
                    :data="actionLog"
                    highlight-current-row
                    style="width: 100%">
                    <el-table-column
                        label="操作人"
                        prop="operater_user"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        label="日期"
                        inline-template
                        show-overflow-tooltip>
                        <span>{{row.operate_time|dataFilter}}</span>
                    </el-table-column>
                    <el-table-column
                        inline-template
                        label="操作状态"
                        show-overflow-tooltip>
                        <div>{{row.status|statusFilter}}</div>
                    </el-table-column>
                    <el-table-column
                        label="操作记录"
                        prop="operate_content"
                        show-overflow-tooltip>
                    </el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click.native="show=false">关闭</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import pageDialog from '../../../components/page-dialog.vue'
    export default{
        page:{
            devinfo:{
                frontEnd:'黎宏珍',
                backEnd:'刘志勇',
                createTime:'2017-10-13',
                updateTime:'2017-10-13'
            }
        },
        data(){
            return {
                show: false
            }
        },
        watch:{
            value(val){
                this.show = val;
            },
            show(val){
                this.$emit('input',val);
            }
        },
        filters:{
            dataFilter(val){
                return  datef('YYYY-MM-dd HH:mm:ss', val);
            },
            statusFilter(val){
                switch (val){
                    case 0:
                        return "未提交";
                        break;
                    case 1:
                        return "等待审核";
                        break;
                    case 2:
                        return "审核未通过";
                        break;
                    case 3:
                        return "取消采购";
                        break;
                    case 4:
                        return "等待下单";
                        break;
                }
            }
        },
        props:{
            value:{},
            actionLog:{
                required:true,
                type:Array
            }
        },
        components:{
            pageDialog
        }
    }
</script>

