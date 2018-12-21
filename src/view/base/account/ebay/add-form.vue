<template>
    <el-row class="p-add-form">
        <page-dialog title="添加账号"
                     v-model="addFormVisible"
                     @close="close"
                     :close-on-click-modal="false"
                     size="small">
            <el-form :model="addData"
                     :rules="rules"
                     label-width="160px"
                     ref="formOne">
                <el-form-item label="ebay用户名："
                              prop="account_name" required>
                    <el-col :span="spanWidth_12">
                        <el-input v-model="addData.account_name"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="简称：" prop="code">
                    <el-col :span="spanWidth_8">
                        <el-input v-model="addData.code"></el-input>
                    </el-col>
                    <el-col :span="spanWidth_16"
                            style="color:red">（10位内英文字符,不能以数字结尾）</el-col>
                </el-form-item>
                <el-form-item label="站点：" required prop="site_id">
                    <el-checkbox-group v-model="addData.site_id" class="check">
                        <el-checkbox :label="item.code"
                                     v-for="item in siteData"
                                     :key="item.code">
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="抓取eBay订单功能：">
                    <el-col :span="spanWidth_8">
                        <el-select v-model="addData.download_order">
                            <el-option v-for="item in crawl"
                                       :label="item.label"
                                       :value="item.value"
                                       :key="item.value"
                            ></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="抓取eBay站内信功能：">
                    <el-col :span="spanWidth_8">
                        <el-select v-model="addData.download_message">
                            <el-option v-for="item in station"
                                       :label="item.label"
                                       :value="item.value"
                                       :key="item.value"
                            ></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="抓取eBay Listing功能：">
                    <el-col :span="spanWidth_8">
                        <el-select v-model="addData.download_listing">
                            <el-option v-for="item in publish"
                                       :label="item.label"
                                       :value="item.value"
                                       :key="item.value"
                            ></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="同步付款状态到eBay功能：">
                    <el-col :span="spanWidth_8">
                        <el-select v-model="addData.sync_payment">
                            <el-option v-for="item in payment"
                                       :label="item.label"
                                       :value="item.value"
                                       :key="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="同步发货状态到eBay功能：">
                    <el-col :span="spanWidth_8">
                        <el-select v-model="addData.sync_delivery">
                            <el-option v-for="item in ship"
                                       :label="item.label"
                                       :value="item.value"
                                       :key="item.value"
                            ></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="同步eBay好评功能：">
                    <el-col :span="spanWidth_8">
                        <el-select v-model="addData.sync_feedback">
                            <el-option v-for="item in praise"
                                       :label="item.label"
                                       :value="item.value"
                                       :key="item.value"
                            ></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="同步健康数据：">
                    <el-col :span="spanWidth_8">
                        <!--<el-switch v-model="addData.health_monitor"-->
                                   <!--on-text="启用"-->
                                   <!--off-text="停用"></el-switch>-->
                        <el-select   v-model="addData.health_monitor">
                            <el-option   v-for="item in healthList"
                                         :label="item.label"
                                         :value="item.value"
                                         :key="item.value"
                            ></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="账户环境：">
                    <el-col :span="spanWidth_8">
                        <el-select   v-model="addData.type">
                            <el-option   v-for="item in envir"
                                         :label="item.label"
                                         :value="item.value"
                                         :key="item.value"
                            ></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <request-button req-key='addFormKey' @click="add_form">确定</request-button>
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
    import pageDialog from "../../../../components/page-dialog.vue"
    import {account_ebay_addform} from '../../../../api/account-ebay'   //引入添加接口
    import {get_ebaysite} from "../../../../api/ebay-order"
    export default{
    	refresh(){

        },
        data(){
            var checkcode = (rule, value, callback) => {
                let check=/[0-9]{1}$/g;
                let chinese=/[\u4E00-\u9FA5\uF900-\uFA2D]/g;
                if (!value) {
                    return callback(new Error('请输入代码'));
                }
                setTimeout(() => {
                    if (check.test(value)) {
                    callback(new Error('最后一位不能为数字，请重新输入！'));
                  }else if(chinese.test(value)) {
                        callback(new Error('不能输入汉字！'))
                    }else {
                        callback();
                    }
            }, 300);
            };
            return{

                spanWidth_16:16,
                spanWidth_12:12,
                spanWidth_8:8,
                addFormVisible:false,
                siteData:[],
                addData:{
                    code:"",
                    account_name:"",
                    site_id:[],
                    server_id:'',
                    download_order:0,
                    download_message:0,
                    download_listing:0,
                    sync_payment:0,
                    sync_delivery:0,
                    sync_feedback:0,
                    type:1,
                    health_monitor:0,
                },
                rules:{
                    code:[
                        { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' },
                        { validator: checkcode, trigger: 'blur,change' }
                    ],
                    account_name:[
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                    ],
                    site_id:[
                        { required: true, message: '请选择站点', trigger: 'blur',type:"array" },
                    ],
                },
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
                downloadLists:[
                    {label:"未启用",value:0},
                    {label:"6小时",value:360},
                    {label:"12小时",value:720},
                    {label:"24小时",value:1440},
                ],
                envir:[
                    {label:"正式",value:1},
                    {label:"测试",value:0}],

                crawl:[
                    {label:"未启用",value:0},
                    {label:"30分钟",value:30}],

                station:[
                    {label:"未启用",value:0},
                    {label:"30分钟",value:30}],
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
                    {label:"30分钟",value:30}],
                ipList:[],
            }
        },
        created(){},
        mounted(){
            this.get_ebaysite()
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
            //打开页面初始化
            close(val){
                if(!val){
                    this.addData={
                        code:"",
                        account_name:"",
                        server_id:"",
                        site_id:[],
                        download_order:0,
                        download_message:0,
                        download_listing:0,
                        sync_payment:0,
                        sync_delivery:0,
                        sync_feedback:0,
                        type:1,
                        health_monitor:0,
                    }
                }
            },
            //添加数据
            add_form(){
                this.$refs.formOne.validate((valid) => {
                    if (valid) {
                        this.submit();
                    }else{
                        setTimeout(() => {
                            this.$reqKey('addFormKey', false);
                        }, 300)
                    }
                });
            },
            submit(){
                let params = clone(this.addData);
                Object.keys(params).forEach(key=>{
                   if(typeof params[key] === 'string'){
                       params[key] = params[key].trim();
                   }
                });
                this.$http(account_ebay_addform,params).then(res=>{
                    this.$message({
                        type: 'success',
                        message: res.message||res,
                    });
                    this.addFormVisible = false;
                    this.$emit("add-update",res.id,this.addData);
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('addFormKey', false);
                    }, 300)
                })
            },
            cannel_form(){
                this.addFormVisible = false
            }
        },
        watch:{
            addFormVisible(val){
                this.$emit('input',val);
            },
            value(val){
                this.addFormVisible = val;
            }
        },
        props:{

            value: {}
        },
        components:{
            pageDialog,
            requestButton:require('../../../../global-components/request-button').default
        }
    }
</script>
