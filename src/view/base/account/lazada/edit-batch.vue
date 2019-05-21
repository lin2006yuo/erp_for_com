<template>
    <page-dialog :title="title" v-model="show" size="small"
                 @open="open" @close="close" :close-on-cilck-modal="false">
        <el-form :model="addEditData"
                 label-width="190px"
                 ref="addEditData">
            <el-form-item  label="系统状态：">
                <el-col :span="14">
                    <el-select v-model="addEditData.status">
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
                    <el-select v-model="addEditData.site_status">
                        <el-option v-for="item in siteData"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value"
                        ></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="抓取Lazada订单功能：">
                <el-col :span="14">
                    <el-select v-model="addEditData.download_order">
                        <el-option v-for="item in downloadList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="同步发货状态到Lazada功能：">
                <el-col :span="14">
                    <el-select v-model="addEditData.sync_delivery">
                        <el-option v-for="item in downloadList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="抓取Listing数据：">
                <el-col :span="14">
                    <el-select v-model="addEditData.download_listing">
                        <el-option v-for="item in downloadList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <request-button req-key="downloadAdd" @click.native="keep" type="primary">确 定</request-button>
            <el-button size="mini" @click.native="show=false">取 消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

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
                downloadList:[
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
                this.addEditData.status = this.addEditData.status === 1;
            },
            close(){

            },
            keep(){
                this.$emit('set-clich',this.addEditData);
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
        props:{
            addEditData:{
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
