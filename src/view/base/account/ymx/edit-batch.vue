<template>
    <page-dialog :title="title" v-model="show" size="small"
                 @open="open" @cloce="cloce" :close-on-cilck-modal="false">
        <el-form :model="batchData"
                 label-width="190px"
                 ref="batchData">
            <el-form-item  label="系统状态：">
                <el-col :span="14">
                    <el-switch v-model="batchData.status"
                               :on-text="status[0]"
                               on-color="#20a0ff"
                               :off-text="status[1]"
                               off-color="#C0CCDA"
                               @change="changStatus">
                    </el-switch>
                </el-col>
            </el-form-item>
            <el-form-item label="抓取Amazon Listing功能：">
                <el-col :span="14">
                    <el-select v-model="batchData.download_listing">
                        <el-option v-for="item in listingOptions"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value"
                        ></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="抓取Amazon订单功能：">
                <el-col :span="14">
                    <el-select v-model="batchData.download_order">
                        <el-option v-for="item in orderOptions"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value"
                        ></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="同步发货状态到Amazon功能：">
                <el-col :span="14">
                    <el-select v-model="batchData.sync_delivery">
                        <el-option v-for="item in syncDeliveryOptions"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value"
                        ></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="同步中差评到Amazon功能：">
                <el-col :span="14">
                    <el-select v-model="batchData.sync_feedback">
                        <el-option v-for="item in syncFeedbackOptions"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value">
                        </el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="同步健康数据：">
                <el-col :span="14">
                    <el-select v-model="batchData.download_health">
                        <el-option v-for="item in healthOptions"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
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
                listingOptions:[//抓取Amazon Listing功能
                    {label:"未启用",value:0},
                    {label:"1小时",value:60},
                    {label:"2小时",value:120},
                    {label:"3小时",value:180},
                    {label:"5小时",value:300},
                    {label:"6小时",value:360},
                    {label:"8小时",value:480},
                    {label:"10小时",value:600},
                    {label:"12小时",value:720},
                    {label:"24小时",value:1440}
                ],
                orderOptions:[//抓取Amazon订单功能
                    {label:"未启用",value:0},
                    {label:"30分钟",value:30},
                    {label:"60分钟",value:60},
                ],
                syncDeliveryOptions:[//同步发货状态到Amazon功能
                    {label:"未启用",value:0},
                    {label:"30分钟",value:30},
                    {label:"60分钟",value:60},
                ],
                syncFeedbackOptions:[//同步中差评到Amazon功能
                    {label:"未启用",value:0},
                    {label:"30分钟",value:30},
                    {label:"60分钟",value:60},
                ],
                healthOptions:[//同步健康数据
                    {label:"未启用",value:0},
                    {label:"1小时",value:60},
                    {label:"2小时",value:120},
                    {label:"3小时",value:180},
                    {label:"5小时",value:300},
                    {label:"6小时",value:360},
                    {label:"8小时",value:480},
                    {label:"10小时",value:600},
                    {label:"12小时",value:720},
                    {label:"24小时",value:1440}
                ],
            }
        },
        methods:{
            open(){
                this.batchData.status = this.batchData.status === 1;
            },
            cloce(){

            },
            keep(){
                this.$emit('set-clich',this.batchData);
            },
            changStatus(){//-----------------------修改启用或禁用事件
                let statusTitle = this.batchData.status ? '停用' : '启用';
                this.$confirm('您将'+statusTitle+'，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal:false,
                }).catch((code) => {
                    this.batchData.status = !this.batchData.status;
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
            batchData:{
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
