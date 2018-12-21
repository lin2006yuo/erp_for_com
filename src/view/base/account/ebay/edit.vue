
<template>
    <el-row class="p-add-form">
        <page-dialog :title="titlename"
                     v-model="editVisible"
                     :close-on-click-modal="false"
                     size="small">
            <el-form :model="editDatatwo"
                     :rules="rules"
                     label-width="160px"
                     ref="formOne">
                <el-form-item label="ebay用户名："
                              prop="account_name">
                    <el-col :span="12">
                        <el-input v-model="editDatatwo.account_name" disabled></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="简称："
                              prop="code" required>
                    <el-col :span="8">
                        <el-input v-model="editDatatwo.code"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="站点：" required prop="site_id">
                        <el-checkbox-group v-model="editDatatwo.site_id" class="check">
                            <el-checkbox :label="item.code"
                                         v-for="item in siteData"
                                         :key="item.code"
                            ></el-checkbox>
                        </el-checkbox-group>
                </el-form-item>
                <el-form-item label="抓取eBay订单功能：">
                    <el-col :span="8">
                        <el-select  v-model="editDatatwo.download_order">
                            <el-option v-for="item in crawl"
                                       :label="item.label"
                                       :value="item.value"
                                       :key="item.value"
                            ></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="抓取eBay站内信功能：">
                    <el-col :span="8">
                        <el-select v-model="editDatatwo.download_message">
                            <el-option v-for="item in station"
                                       :label="item.label"
                                       :value="item.value"
                                       :key="item.value"
                            ></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="抓取eBay Listing功能：">
                    <el-col :span="8">
                        <el-select v-model="editDatatwo.download_listing">
                            <el-option v-for="item in publish"
                                       :label="item.label"
                                       :value="item.value"
                                       :key="item.value"
                            ></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="同步付款状态到eBay功能：">
                    <el-col :span="8">
                        <el-select v-model="editDatatwo.sync_payment">
                            <el-option v-for="item in payment"
                                       :label="item.label"
                                       :value="item.value"
                                       :key="item.value"
                            ></el-option>
                        </el-select>
                    </el-col>

                </el-form-item>
                <el-form-item label="同步发货状态到eBay功能：">
                    <el-col :span="8">
                        <el-select v-model="editDatatwo.sync_delivery">
                            <el-option v-for="item in ship"
                                       :label="item.label"
                                       :value="item.value"
                                       :key="item.value"
                            ></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="同步eBay好评功能：">
                    <el-col :span="8">
                        <el-select v-model="editDatatwo.sync_feedback">
                            <el-option v-for="item in praise"
                                       :label="item.label"
                                       :value="item.value"
                                       :key="item.value"
                            ></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="同步健康数据：">
                    <el-col :span="8">
                        <el-select v-model="editDatatwo.health_monitor">
                            <el-option   v-for="item in healthList"
                                         :label="item.label"
                                         :value="item.value"
                                         :key="item.value"
                            ></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="账户环境：">
                    <el-col :span="8">
                        <el-select v-model="editDatatwo.type">
                            <el-option v-for="item in envir"
                                       :label="item.label"
                                       :value="item.value"
                                       :key="item.value"
                            ></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <request-button req-key="ebayUpdata" @click="add_form">确定</request-button>
                <el-button @click="cannel_form" size="mini">取 消</el-button>
            </div>
        </page-dialog>
    </el-row>
</template>
<style lang="stylus">
    .p-add-form{
        .inner{
            width:600px !important;
        }
        .el-form-item{
            margin-bottom:12px;
        }
        .check .el-checkbox{
            width:120px;
            margin:0;
        }
    }
</style>
<script>
    import  pageDialog from "../../../../components/page-dialog.vue"
    import  {account_ebay_updata} from '../../../../api/account-ebay'  //引入更新接口
    import {get_ebaysite} from "../../../../api/ebay-order"
    export default{
        data(){
            return{
                siteData:[],
                rules:{
                    code:[
                        { required: true, message: '请输入简称', trigger: 'blur' },
                        { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' },
//                        { validator: checkcode, trigger: 'change' }
                    ],
                    account_name:[
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                    ],
                    site_id:[
                        { required: true, message: '请选择站点', trigger: 'blur',type:"array" },
                    ],
                },
                editVisible:false,
                envir:[
                    {label:"正式",value:1},
                    {label:"测试",value:0}],
                crawl:[
                    {label:"未启用",value:0},
                    {label:"30分钟",value:30}],
                station:[
                    {label:"未启用",value:0},
                    {label:"30分钟",value:30}],
                healthList:[
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
                    {label:'24小时',value:1440},
                ],
                publish:[
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
                payment:[
                    {label:"未启用",value:0},
                    {label:"30分钟",value:30}],
                ship:[
                    {label:"未启用",value:0},
                    {label:"30分钟",value:30}],
                praise:[
                    {label:"未启用",value:0},
                    {label:"30分钟",value:30}]
            }
        },
        created(){},
        mounted(){
            this.get_ebaysite()
        },
        computed:{
            titlename(){
                return  `编辑账户：${this.editDatatwo.account_name} 信息`
            }
        },
        methods:{
            get_ebaysite(){
                this.$http(get_ebaysite).then(res=>{
                    if(res.length>0){
                        this.siteData =res;
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            add_form(){
                this.$refs.formOne.validate((valid) => {
                    if (valid) {
                        let check=/[0-9]{1}$/g;
                        if(check.test(this.editDatatwo.code)){
                            this.$message({type: "warning", message:'code最后一位不能为数字'})
                        }else {
                            this.submit();
                        }
                    } else {
                        this.$reqKey('ebayUpdata', false);
                    }
                });
            },
            //更新数据
            submit(){
                let data={
                    code:this.editDatatwo.code,
                    account_name:this.editDatatwo.account_name,
                    site_id:this.editDatatwo.site_id,
                    download_order:this.editDatatwo.download_order,
                    download_message:this.editDatatwo.download_message,
                    download_listing:this.editDatatwo.download_listing,
                    sync_payment:this.editDatatwo.sync_payment,
                    sync_delivery:this.editDatatwo.sync_delivery,
                    sync_feedback:this.editDatatwo.sync_feedback,
                    type:this.editDatatwo.type,
                    health_monitor:this.editDatatwo.health_monitor,
                };
                this.$http(account_ebay_updata,this.editDatatwo.id,data).then(res=>{
                    this.$message({
                        type: 'success',
                        message: res.message||res,
                    });
                    this.editVisible = false;
                    this.$emit("edit-update",this.editDatatwo.id,data);
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code,});
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('ebayUpdata', false);
                    }, 300)
                })
            },
            cannel_form(){
                this.editVisible = false
            }
        },
        watch:{
            editVisible(val){
                this.$emit('input',val);
            },
            value(val){
                this.editVisible = val;
            }
        },
        props:{
            editDatatwo:{
                required:true,
                type:Object
            },
            value: {}
        },
        components:{
            pageDialog
        }
    }
</script>
