<template>
    <page-dialog :title="batchTitle" v-model="show" size="small"
                 @open="open" @close="close" :close-on-cilck-modal="false">
        <el-form :model="batchData"
                 label-width="190px"
                 ref="batchData">
            <el-form-item  label="系统状态：">
                <el-col :span="14">
                    <el-select v-model="batchData.is_invalid">
                        <el-option v-for="item in statusData"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value"
                        ></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item  label="账号状态：">
                <el-col :span="14">
                    <el-select v-model="batchData.site_status">
                        <el-option v-for="item in siteData"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value"
                        ></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="抓取Paytm订单功能：">
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
            <el-form-item label="同步发货状态到Paytm功能：">
                <el-col :span="14">
                    <el-select v-model="batchData.sync_delivery">
                        <el-option v-for="item in orderOptions"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value"
                        ></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="抓取Listing数据：">
                <el-col :span="14">
                    <el-select v-model="batchData.download_listing">
                        <el-option v-for="item in orderOptions"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value"
                        ></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <request-button req-key="downloadAdd" @click.native="keep" type="primary">确 定</request-button>
            <el-button size="mini" @click.native="show=false">关 闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    input[type='checkbox']{
        vertical-align:middle;
    }
</style>
<script>

    export default{
        data(){
            return{
                statusData:[
                    {label:'启用',value:1},
                    {label:'停用',value:0}
                ],
                siteData:[
                    {label:'运营中',value:1},
                    {label:'冻结中',value:3},
                    {label:'申诉中',value:4},
                ],
                show:this.value,
                orderOptions:[
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
                ]
            }
        },
        methods:{
            open(){

            },
            close(){
                Object.keys(this.batchData).forEach(key=>{
                    this.batchData[key] = "";
                });
            },
            keep(){
                this.$emit('set-clich',this.batchData);
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
            batchTitle:{
                type:String
            }
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
        }
    }
</script>
