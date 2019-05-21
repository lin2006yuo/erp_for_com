<template>
    <div class="c-price-change-self">
        <page-dialog title="操作日志" v-model="show" size="large" :close-on-click-modal="false">
            <div style="height: auto;">
                <el-table
                    :data="actionLog"
                    highlight-current-row
                    style="width: 100%">
                    <el-table-column
                        label="操作人"
                        prop="operater_user"
                        width="200">
                    </el-table-column>
                    <el-table-column
                        label="日期"
                        inline-template
                        width="200">
                        <span>{{row.operate_time|dataFilter}}</span>
                    </el-table-column>
                    <el-table-column
                        inline-template
                        label="操作状态"
                        width="200">
                        <div>{{row.status|statusFilter}}</div>
                    </el-table-column>
                    <el-table-column
                        label="操作记录"
                        inline-template
                        width="480">
                        <span class="p-table-list-td-text">{{row.operate_content}}</span>
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
    .c-price-change-self{
        .p-table-list-td-text {
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

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
                    case 10:
                        return "等待到货";
                        break;
                    case 11:
                        return "部分到货等待剩余";
                        break;
                    case 15:
                        return "不等待剩余待审";
                        break;
                    case 20:
                        return "部分到货不等待剩余";
                        break;
                    case 21:
                        return "全部到货";
                        break;
                    case 0:
                        return "等待下单";
                        break;
                    case -1:
                        return "已作废";
                        break;
                    case 5:
                        return "未申请付款";
                        break;
                    case 6:
                        return "已申请付款";
                        break;
                    case 7:
                        return "已取消付款";
                        break;
                    case 8:
                        return "已付款";
                        break;
                    case 9:
                        return "部分付款";
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

