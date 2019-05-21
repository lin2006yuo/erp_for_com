<template>
    <div class="infringement-dialog-page">
        <!--新增侵权记录弹窗-->
        <page-dialog
            :title="InfringementTitle"
            v-model="InfringementDialog"
            size="small"
            :height="'40%'"
            :width="'500px'"
        >
            <div style="box-sizing: border-box;padding:15px 30px;">
                <div style="text-align:center">
                    <el-form  status-icon  ref="ruleForm2" label-width="75px" class="demo-ruleForm">
                        <el-form-item  class="form-item">
                            <div style="width:70px;text-align:right">
                                <span style="color:red;">*</span>
                                <span>平台：</span>
                            </div>
                            <div style="flex: 1;">
                                <select-remote class="s-width-default"
                                               @change="change_channel"
                                               :all="false"
                                               v-model="channelName"
                                               :remote="channel_remote">
                                </select-remote>
                            </div>
                        </el-form-item>
                        <el-form-item class="form-item">
                            <div style="width:70px;text-align:right">
                                <span style="color:red;">*</span>
                                <span>站点：</span>
                            </div>
                            <div style="flex:1;" >
                                <el-select :disabled="siteCodeOptions.length<=1"
                                           class="s-width-middle"
                                           filterable clearable
                                           :placeholder="sitePlaceholder"
                                           v-model="siteCode">
                                    <el-option v-for="item in siteCodeOptions"
                                               :label="item.label"
                                               :value="item.value"
                                               :key="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </el-form-item>
                        <el-form-item class="form-item">
                            <div style="width:70px;text-align:right;box-sizing: border-box;padding-right:5px;">
                                <span style="color:red;">*</span><span>账号简称:</span>
                            </div>
                            <div style="flex:1;">
                                <el-select :disabled="accountFlag"
                                           filterable
                                           clearable
                                           remote
                                           :remote-method="remoteMethod"
                                           :placeholder="accountPlaceholder"
                                           class="s-width-small"
                                           v-model="accountName">
                                    <el-option v-for="item in accountNameOptions2"
                                               :label="item.label"
                                               :value="item.value"
                                               :key="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </el-form-item>
                        <el-form-item class="form-item">
                            <div style="width:70px;text-align:right">
                                <span style="color:red;">*</span>
                                <span>侵权时间：</span>
                            </div>
                            <div style="flex:1;">
                                <el-date-picker
                                    v-model="tortTime"
                                    type="date"
                                    placeholder="选择日期"
                                    :picker-options="pickerOptions"
                                >
                                </el-date-picker>
                            </div>
                        </el-form-item>
                        <el-form-item  class="form-item">
                            <div style="width:70px;text-align:right;box-sizing: border-box;padding-right:5px;">
                                <span style="color:red;">*</span><span>侵权描述:</span>
                            </div>
                            <div style="flex:1;">
                                <el-select v-model="describeType" >
                                    <el-option
                                        v-for="item in describeTypeArr"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"
                                    >
                                    </el-option>
                                </el-select>
                                <el-input
                                    v-if="describeType==='text'"
                                    style="display:block;padding-top:5px;"
                                    type="textarea"
                                    :rows="2"
                                    placeholder="请输入内容"
                                    v-model="remark">
                                </el-input>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
                <div style="text-align:right">
                    <el-button type="primary" @click="add_Infringement">确 定</el-button>
                    <el-button @click="InfringementDialog=false">取 消</el-button>
                </div>
            </div>
        </page-dialog>
    </div>
</template>

<style lang="stylus" >
    .infringement-dialog-page{
        .el-form-item__content{
            width:100% !important;
            display:flex;
            margin-left:0px !important;
        }
        .el-select{
            width:100% !important;
            .el-input{
                width:100% !important;
                input{
                    width:100% !important;
                }
            }
        }
    }
</style>

<script>
    import {
        api_account_list,
        api_get_channel,
    } from '../../../api/order-local';
    import {url_put_Infringement,url_delete_Infringement,api_get_channel_categories,api_put_Infringement,api_delete_Infringement} from  "../../../api/product-library";

    export default {
        data(){
            return {
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                InfringementTitle:'新增侵权记录',
                InfringementDialog:false,
                channelName:"",
                siteCode:"",
                siteCodeOptions:[],
                accountName:"",
                accountNameOptions:[],
                accountNameOptions2:[],
                tortTime:"",
                remark:"",
                changeChannelNumber:0,
                accountID:"",
                describeType:'text',//侵权描述类型
                describeTypeArr:[{label:'自定义',value:'text'},{label:'图片侵权',value:'图片侵权'},{label:'品牌侵权',value:'品牌侵权'},{label:'知识产权侵权',value:'知识产权侵权'},{label:'外观专利侵权',value:'外观专利侵权'},{label:'禁售产品',value:'禁售产品'}],
            }
        },
        methods:{
            change_channel(){
                this.changeChannelNumber++;
                console.log("平台改变了:"+this.changeChannelNumber);
                if(this.changeChannelNumber>1){
                    this.siteCode="";
                    this.accountName="";
                }
            },
            //进行匹配搜索，节流下拉框数据
            remoteMethod(query) {
                if (query !== '' && (typeof query)==="string") {
                    setTimeout(() => {
                        this.accountNameOptions2 = this.accountNameOptions.filter(item => {
                            return item.label.toLowerCase()
                                .indexOf(query.toLowerCase()) > -1;
                        });
                    }, 200);
                } else {
                    this.accountNameOptions2=this.accountNameOptions.slice(0,50);
                }
            },
            //获取相应的站点
            get_account_site(channel_id){
                if(!channel_id){
                    this.accountNameOptions = [{label:"",value:""}];
                    this.siteCodeOptions = [{label:"",value:""}];
                    return
                }
                this.$http(api_account_list,{channel_id:channel_id}).then(res=>{
                    if(res.site.length===0){
                        this.siteCodeOptions = [{label:"",value:""}]
                    }else{
                        this.siteCodeOptions = [...res.site];
                    }
                    if(res.account.length===0){
                        this.accountNameOptions = [{label:"",value:""}]
                    }else{
                        this.accountNameOptions = [...res.account];
                        this.accountNameOptions2=this.accountNameOptions.slice(0,50);
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            channel_remote(callback){
                return this.$http(api_get_channel,{}).then(res=>{
                    callback(res);
                    console.log(res);
                }).catch(code=>{
                    console.log(code);
                });
            },
            add_Infringement() {
                let data = {
                    goods_id: this.goodsId,
                    channel_id: this.channelName,
                    account_id: this.accountName,
                    site_code: this.siteCode,
                    remark: this.remark,
                    tort_time: new Date(this.tortTime).toLocaleDateString(),
                }
                if(this.describeType!=="text"){  //非自定义
                    data.remark = this.describeType;
                }
                if (this.channelName && (this.siteCode||this.sitePlaceholder==="该平台下暂无站点") && this.accountName && this.tortTime && (this.remark||this.describeType!=='text')) {
                    this.$http(api_put_Infringement, this.goodsId, data)
                        .then(res => {
                            this.$emit('change-show',false);
                            console.log(this.InfringementDialog);
                            this.channelName = "";
                            this.siteCode = "";
                            this.remark = "";
                            this.tortTime = "";
                            this.accountName = "";
                            this.$message({
                                type:"success",
                                message:"添加成功"
                            })
                            this.$emit('updata-data');
                        })
                        .catch(err => {
                            this.$message({
                                type:"error",
                                message:err.message
                            })
                            console.log('出错了' + err);
                        })
                }else {
                    if (!this.channelName) {
                        this.$message({type: "error", message: "平台不能为空"});
                    } else if (!this.siteCode &&this.sitePlaceholder!=="该平台下暂无站点") {
                        this.$message({type: "error", message: "站点不能为空"});
                    } else if (!this.accountName) {
                        this.$message({type: "error", message: "账号简称不能为空"});
                    } else if (!this.tortTime) {
                        this.$message({type: "error", message: "创建时间不能为空"});
                    } else if (!this.remark&&this.describeType==='text') {
                        this.$message({type: "error", message: "侵权记录不能为空"});
                    }
                }
            },
        },
        computed:{
            sitePlaceholder(){
                if(this.channelName<=0){
                    return "请先选择平台";
                }else if(this.siteCodeOptions.length<=1){
                    return "该平台下暂无站点";
                }else{
                    return "请选择站点"
                }
            },
            accountPlaceholder(){
                if(this.channelName==="" && this.siteCode===""){
                    return "请先选择平台";
                }else if(this.accountNameOptions.length<=1){
                    return "该平台下暂无账号";
                }else if(this.channelName!=="" && this.siteCode===""&&this.sitePlaceholder!=="该平台下暂无站点" ){
                    return "请先选择站点"
                }else{
                    return "请选择账号"
                }
            },
            accountFlag(){
                if(this.siteCode==="" && this.sitePlaceholder!=="该平台下暂无站点"){
                    return true;
                }else if(this.sitePlaceholder==="该平台下暂无站点"){
                    return false;
                }else if(this.accountNameOptions.length<=1){
                    return true;
                }
            }
        },
        watch:{
            channelName(val) {
                this.get_account_site(val);
            },
            InfringementDialog(val){
                this.channelName = "";
                this.siteCode = "";
                this.remark = "";
                this.tortTime = "";
                this.accountName = "";
                this.changeChannelNumber=0;
                this.describeType='text';
                this.$emit('change-show',val);
            },
            show(val){
                this.InfringementDialog=val;
            },

        },
        props:{
            show:{

            },
            goodsId:{

            }
        },
        components:{
            "page-dialog":require("../../../components/page-dialog").default,
            selectRemote:require('../../../components/select-remote.vue').default,
        }
    }
</script>
