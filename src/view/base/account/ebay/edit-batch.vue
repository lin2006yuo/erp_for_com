<template>
    <page-dialog :title="title" v-model="show" size="small"
                 @open="open" @close="close" :close-on-cilck-modal="false">
        <el-form :model="addData"
                 label-width="190px"
                 ref="addData">
            <!--<el-form-item  label="系统状态：">-->
                <!--<el-col :span="14">-->
                    <!--<el-switch v-model="addData.status"-->
                               <!--:on-text="status[0]"-->
                               <!--on-color="#20a0ff"-->
                               <!--:off-text="status[1]"-->
                               <!--off-color="#C0CCDA"-->
                               <!--@change="changStatus">-->
                    <!--</el-switch>-->
                <!--</el-col>-->
            <!--</el-form-item>-->
            <el-form-item  label="系统状态：" prop="status">
                <el-col :span="14">
                    <el-select class="s-width-large"
                               v-model="addData.status">
                        <el-option v-for="item in statusList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item  label="账号状态："  prop="site_status">
                <el-col :span="14">
                    <el-select class="s-width-large"
                               v-model="addData.site_status">
                        <el-option v-for="item in accountStatus"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="抓取eBay订单功能：">
                <el-col :span="14">
                    <el-select v-model="addData.download_order">
                        <el-option v-for="item in healthList"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value"
                        ></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="抓取eBay站内信功能：">
                <el-col :span="14">
                    <el-select v-model="addData.download_message">
                        <el-option v-for="item in healthList"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value"
                        ></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="抓取eBay Listing功能：">
                <el-col :span="14">
                    <el-select v-model="addData.download_listing">
                        <el-option v-for="item in healthList"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value"
                        ></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="同步付款状态到eBay功能：">
                <el-col :span="14">
                    <el-select v-model="addData.sync_payment">
                        <el-option v-for="item in healthList"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value">
                        </el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="同步发货状态到eBay功能：">
                <el-col :span="14">
                    <el-select v-model="addData.sync_delivery">
                        <el-option v-for="item in healthList"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value"
                        ></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="同步eBay好评功能：">
                <el-col :span="14">
                    <el-select v-model="addData.sync_feedback">
                        <el-option v-for="item in healthList"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value"
                        ></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="同步健康数据：">
                <el-col :span="14">
                    <!--<el-switch v-model="addData.health_monitor"-->
                               <!--on-text="启用"-->
                               <!--off-text="停用"></el-switch>-->
                    <el-select v-model="addData.health_monitor">
                        <el-option v-for="item in healthList"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value"
                        ></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <request-button req-key="downloadAdd" @click.native="keep" type="primary">确定</request-button>
            <el-button size="mini" @click.native="show=false">关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>

    export default{
        data(){
            return{
                status:["启用","停用"],
                show:this.value,
                statusList:[
                    {label:'请选择',value:''},
                    {label:'已启用',value:1},
                    {label:'已停用',value:0},
                ],
                accountStatus:[
                    {label:'请选择',value:''},
                    {label:'运营中',value:1},
                    {label:'冻结中',value:3},
                    {label:'申诉中',value:4},
                ],
                healthList:[
                    {label:'请选择',value:''},
                    {label:'未启用',value:0},
                    {label:'30分钟',value:30},
                    {label:'1小时',value:60},
                    {label:'2小时',value:120},
                    {label:'3小时',value:180},
                    {label:'4小时',value:240},
                    {label:'5小时',value:300},
                    {label:'6小时',value:360},
                    {label:'7小时',value:420},
                    {label:'8小时',value:480},
                    {label:'9小时',value:540},
                    {label:'10小时',value:600},
                    {label:'11小时',value:660},
                    {label:'12小时',value:720},
                    {label:'24小时',value:1440}
                ],
            }
        },
        methods:{
            open(){
            },
            close(){

            },
            keep(){
                this.$emit('set-clich',this.addData);
            },
            changStatus(){//-----------------------修改启用或禁用事件
                let statusTitle = this.addData.status ? '停用' : '启用';
                this.$confirm('您将'+statusTitle+'，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal:false,
                }).catch((code) => {
                    this.addData.status = !this.addData.status;
                });
            },
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            }
        },
        props:{
            addData:{
                required:true,
                type:Object
            },
            value:{
                required:true,
                type:Boolean
            },
            title:{
                type:String
            }
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
        }
    }
</script>
