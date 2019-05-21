<template>
    <page class="p-dialog">
        <page-dialog :title="title" v-model="showDialog" size="small" :close-on-click-modal="false" @close="close">
            <h4 class="title">每日服务分</h4>
            <el-table
                    :data="tableData_.to_serve_score"
                    border
                    style="width: 100%">
                <el-table-column
                        prop="date"
                        label="操作">
                </el-table-column>
                <el-table-column
                        prop="grade"
                        width="120"
                        label="分数">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="监控值">
                    <template slot-scope="scope">
                        <div class="center">
                            <span><=</span>
                            <el-input-number :debounce="1000" class="s-width-mini ml-sm" :controls="false" v-model="scope.row.name"></el-input-number>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <h4 class="title" style="margin-top: 10px;">我的处罚</h4>
            <el-table
                    :data="tableData_.to_punish"
                    border
                    style="width: 100%">
                <el-table-column
                        prop="date"
                        label="操作">
                </el-table-column>
                <el-table-column
                        prop="grade"
                        width="120"
                        label="分数">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="监控值">
                    <template slot-scope="scope">
                        <div class="center">
                            <span>>=</span>
                            <el-input-number :debounce="1000" class="s-width-mini ml-sm" :controls="false" v-model="scope.row.name"></el-input-number>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" type="primary" @click.native="get_shift">确定</el-button>
                <el-button size="mini" @click.native="showDialog=false">取消</el-button>
            </div>
        </page-dialog>
    </page>
</template>
<style lang="stylus" scoped>
    .title{
        margin: 0;
        margin-bottom: 8px;
    }
    .center{
        display: flex;
        justify-content: center;
    }
</style>
<script>

    import  {api_aliexpress_account_health_set_one} from '@/api/monitor-manage'
    export default {
        data() {
            return {
                title:'查看与编辑',
                showDialog:this.value,
                tableData_: {
                    to_serve_score:[
                        {
                            date: '总分',
                            grade:'',
                            type:'today_score',
                            name: '',
                        }, {
                            date: '成交不卖率',
                            grade:'',
                            type:'back_transaction_rate',
                            name: '',
                        }, {
                            date: '未收到货物纠纷提起率',
                            grade:'',
                            type:'not_cargo_dispute_rate',
                            name: '',
                        }, {
                            date: '货不对版纠纷提起率',
                            grade:'',
                            type:'error_cargo_dispute_rate',
                            name: '',
                        }, {
                            date: 'DSR商品描述',
                            grade:'',
                            type:'dsr_description',
                            name: '',
                        }, {
                            date: 'DSR卖家服务',
                            grade:'',
                            type:'dsr_service',
                            name: '',
                        }, {
                            date: 'DSR物流',
                            grade:'',
                            type:'dsr_shipping',
                            name: '',
                        }, {
                            date: '48小时发货率',
                            grade:'',
                            type:'forty_eight_deliver',
                            name: '',
                        }
                    ],//服务分
                    to_punish: [
                        {
                            date: '商品信息质量违规',
                            grade:'',
                            type:'outlaw_quality',
                            name: '',
                        },
                        {
                            date: '知识产权禁限售违规',
                            grade:'',
                            type:'outlaw_property',
                            name: '',
                        },
                        {
                            date: '交易违规及其他',
                            grade:'',
                            type:'outlaw_trancation',
                            name: '',
                        },
                        {
                            date: '知识产权严重违规',
                            grade:'',
                            type:'severity_outlaw_property',
                            name: '',
                        }
                    ],//处罚
                },
            }
        },
        computed: {},
        filters: {},
        mounted() {
        },
        methods: {
            get_shift(){//确定
                let monitoringData = {};
                this.tableData_.to_punish.forEach(row=>monitoringData[row.type+''] = row.name);
                this.tableData_.to_serve_score.forEach(row=>monitoringData[row.type+''] = row.name);
                monitoringData['account_id'] = this.account_id;
                this.$http(api_aliexpress_account_health_set_one,monitoringData).then(res=>{
                    Object.assign(this.currentData.goal,monitoringData);
                    this.showDialog = false;
                    this.$message({type: "success", message: res.message});
                }).catch(err=>{
                    this.$message({type: "error", message: err.message});
                })
            },
            close(){
            },
        },
        watch: {
            value(val){
                this.showDialog = val;
            },
            showDialog(val){
                this.$emit('input',val);
            },
            currentData(val){
                this.$nextTick(()=>{
                    this.tableData_.to_serve_score.forEach(row=>{if(val[row.type]) {
                        row.grade = val[row.type];
                        row.name = val.goal[row.type];
                    }});
                    this.tableData_.to_punish.forEach(row=>{if(val[row.type]){
                        row.grade = val[row.type];
                        row.name = val.goal[row.type];
                    }});
                })
            },
        },
        props: {
            value:{
                type:Boolean,
                default(){
                    return false;
                },
            },
            currentData:Object,
            account_id:'',
        },
        components: {
            pageDialog: require('@/components/page-dialog').default,
        }
    }
</script>
