<template>
    <el-row class="p-add-gsMap">
        <page-dialog :title="titleName" v-model="dialogVisible"
                     size="small" @open="open"
                     :close-on-click-modal="false"  >
            <div v-loading="isLoad">
                <el-form :model="gsMapForm" :rules="rules" label-width="150px">
                    <el-form-item label="平台："   prop="channel_id"    required>
                        <el-col  :span="10">
                            <el-select :value="gsMapForm.channel_id"  @input="change_channel" v-if="isEdit">
                                <el-option v-for="type in channelList" :key="type.value" :label="type.label" :value="type.value"></el-option>
                            </el-select>
                            <div  v-else>{{gsMapForm.channel}}</div>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="账号：" required>
                        <el-col :span="10">
                            <div v-if="isEdit">
                                <param-account
                                        ref="paramAccount"
                                        v-model="gsMapForm.account_id"
                                        :disabled="!gsMapForm.channel_id"
                                        :refresh="true"
                                        :param="accountParam"
                                        :fixResult="fix_result_account"
                                        type="skuMapAccount"
                                        url="get|sku-map/account">
                                </param-account>
                            </div>
                            <div  v-else>{{gsMapForm.account}}</div>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="平台sku：" required>
                        <el-col :span="10" v-if="isEdit">
                            <el-input v-model="gsMapForm.channel_sku"  :disabled="markId!==0"></el-input>
                        </el-col>
                        <span v-else>{{gsMapForm.channel_sku}}</span>
                    </el-form-item>
                </el-form>
                <el-row class="mb-sm" v-if="isEdit">
                    <el-button size="mini" @click.native="add_sku" type="primary">添加</el-button>
                </el-row>
                <el-table
                        :data="gsMapForm.sku"
                        height="300"
                        class="scroll-bar"
                        style="width: 100%">
                    <el-table-column
                            prop="sku_code"
                            label="SKU"
                            >
                    </el-table-column>
                    <el-table-column
                            inline-template
                            label="关联数量"
                            >
                        <div>
                            <el-input-number
                                    v-if="isEdit"
                                    size="small"
                                    :controls="false"
                                    :debounce="0"
                                    v-model="row.quantity"
                                    :min="1" :max="999999">
                            </el-input-number>
                            <span v-else>{{row.quantity}}</span>
                        </div>
                    </el-table-column>
                    <el-table-column
                            v-if="isEdit"
                            inline-template
                            label="操作">
                        <span class="operate" @click="del_sku(row)">删除</span>
                    </el-table-column>
                </el-table>
            </div>
            <add-goods v-model="addVisable" @add-goods="add_good"></add-goods>
            <div slot="footer" class="dialog-footer">
                <div v-if="isEdit" style="display: inline;">
                    <permission tag="request-button"
                                :route="apis.url_add"
                                req-key="del_code"
                                @click="confirm"
                                :disabled="gsMapForm.sku.length <= 0||!gsMapForm.channel_sku"
                                v-if="markId===0">保存</permission>
                    <permission tag="request-button"
                                req-key="editConfirm"
                                :route="apis.url_update"
                                @click="edit_confirm" v-else>保存</permission>
                </div>
                <el-button size="mini" @click="cannel">取 消</el-button>
            </div>
        </page-dialog>
    </el-row>
</template>
<style lang="stylus">
    .p-add-gsMap{
       .page-dialog .dialog__body{
           overflow-y: inherit;
       }
    .el-dragger{
        width: 100px;
        height:100px;
    }
    .page-dialog .inner{
        overflow: visible;
    }
        .dialog__body{
            overflow-y:visible;
        }
    }
</style>
<script>
    import pageDialog from '../../../components/page-dialog.vue'
    import scrollSelect from  "../../../components/scroll-select.vue"
    import {api_add,api_update,api_get_channel,api_del_code,url_del_code,url_update,url_add} from '../../../api/goods-sku-map'
    import uiInput from "../../../components/ui-input.vue"
    import {mapGetters} from 'vuex';
    export default{
    	permission:{
            url_del_code,
            url_update,
            url_add
        },
        data(){
            var checkcode = (rule, value, callback) => {
                if(value<=0||value>100){
                    callback(new Error('请输入1~100内的数字'))
                }else if(value==""){
                    callback(new Error('数量不能为空'))
                }
            };
            return {
                urlaccount:'get|sku-map/account',
                channelList:[],
                dialogVisible:false,
                firstOpen:false,
                rules:{
//                    quantity:[{ validator: checkcode, trigger: 'change' }],
                    channel_sku:[{ required: true, message: '平台sku不能为空', trigger: 'blur'  }],
                    channel_id:[{ required: true, message: '平台不能为空', trigger: 'change' ,type:"number"}]
                },
                selects:false,
                accountData:[],
                loading:false,
                skuList:[],
                addVisable:false,
                accountParam:{
                    channel_id:1,
                    content:''
                },
            }
        },
        mounted(){
            this.channel_init()
        },
        methods:{
            open(){
                this.firstOpen=true;
                this.gsMapForm.account_id=""
            },
            change_channel(val){
                this.accountParam.channel_id=val;
                this.gsMapForm.channel_id=val;
                this.$refs.paramAccount.init('');
            },
            del_sku(row){
                let index=this.gsMapForm.sku.findIndex(item=>{
                    return  item.sku_id===row.sku_id;
                });
                this.gsMapForm.sku.splice(index,1)
            },
            add_sku(){
                this.addVisable=true;
            },
            add_good(val){
                val.forEach(row=>{
                    let find=this.gsMapForm.sku.find(item=>{
                        return  item.sku_id===row.sku_id;
                    })
                    if(!find){
                        this.gsMapForm.sku.push({sku_id:row.sku_id,sku_code:row.sku,quantity:1})
                    }else {
                        this.$message({type: "warning", message: `${row.sku}已存在`})
                    }

                })
            },
            //账号参数
            fix_params_account({page,pageSize,keyword}){
                    return {
                        page:page,
                        pageSize:pageSize,
                        content:keyword||"",
                        channel_id:this.gsMapForm.channel_id,
                    };
            },
            //sku参数
            fix_params_sku({page,pageSize,keyword}){
                return {
                    page:page,
                    pageSize:pageSize,
                    content:keyword,
                };
            },
            //账号结果
            fix_result_account(res){
                return res.data.map(row=>{
                    return {
                        label: row.account_name,
                        value: row.id
                    }
                })
            },
            //sku结果
            fix_result_sku(res){
                return {
                    options: res.data.map(row => {
                        return {
                            label: row.sku,
                            value: row.id
                        }
                    }),
                    page: res.page,
                    count: res.count,
                }
            },
            //请求平台
            channel_init(){
                this.$http(api_get_channel).then(res=>{
                    this.channelList=res;
                }).catch(code=>{
                    console.log(code)
                    })
            },

            confirm(){//-----------保存
                if(this.gsMapForm.channel_id&&this.gsMapForm.account_id){}else {
                    this.$message({message:'带*号的为必填项，请完善信息！',type:'warning'});
                    this.$reqKey('del_code', false);
                    return
                }
                if(!this.gsMapForm.sku||this.gsMapForm.sku.length==0){
                    this.$message({message:'请选择关联的本地sku',type:'warning'});
                    this.$reqKey('del_code', false);
                    return
                }
                if(!this.gsMapForm.channel_sku){
                    this.$http(api_del_code).then(data=>{
                        this.posts(data.data);
                    }).catch(code=>{
                        console.log(code)
                    }).finally(()=>{
                        setTimeout(() => {
                            this.$reqKey('del_code', false);
                        }, 300)
                    })
                }else {
                    this.posts(this.gsMapForm.channel_sku);
                }
            },
            posts(data){
                let arr = {
                    channel_id: this.gsMapForm.channel_id,
                    account_id: this.gsMapForm.account_id,
                    channel_sku:data,
                    sku: this.gsMapForm.sku
                };
                this.$http(api_add, arr).then(res => {
                    this.$message({type: "success", message: res.message || res})
                    this.dialogVisible = false;
                    this.$set(arr,'account_name',this.getParamAccount("skuMapAccount",arr.account_id));
                    arr.channel_id&&(arr.channel_id=this.channelList.find(item=>{
                        return item.value===arr.channel_id
                    }).label);
                    this.$emit("reload",parseInt(res.id),arr);
                }).catch(code => {
                    this.$message({type: "error",message: code.message||code});
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('del_code', false);
                    }, 300)
                });
            },
            //-----------------------------------------------更新
            edit_confirm(){
                if(this.gsMapForm.channel_id&&this.gsMapForm.account_id){}else {
                    this.$message({type:'warning',message:'带*号的为必填项，请完善信息！'});
                    this.$reqKey('editConfirm', false);
                    return
                }
                if(!this.gsMapForm.sku||this.gsMapForm.sku.length==0){
                    this.$message({type:'warning',message:'请选择关联的本地sku'});
                    this.$reqKey('editConfirm', false);
                    return
                }
                if(!this.gsMapForm.channel_sku){
                    this.$http(api_del_code).then(data=>{
                        this.edit_post(data.data);
                    }).catch(code=>{
                        this.$message({type:'error',message:code.message||code});
                    }).finally(()=>{
                        setTimeout(() => {
                            this.$reqKey('editConfirm', false);
                        }, 300)
                    })
                }else {
                    this.edit_post(this.gsMapForm.channel_sku);
                }
            },
            edit_post(data){
                let  arr={
                    channel_id:this.gsMapForm.channel_id,
                    account_id:this.gsMapForm.account_id,
                    channel_sku:data,
                    sku:this.gsMapForm.sku
                };
                this.$http(api_update,this.markId,arr).then(res=>{
                    this.$message({type: "success", message: res.message || res});
                    this.dialogVisible=false;
                    this.$set(arr,'account_name',this.getParamAccount("skuMapAccount",arr.account_id));
                    arr.channel_id=(this.channelList.find(item=>{
                        return item.value===arr.channel_id
                    })).label;
                    this.$emit("update",this.markId,arr);
                }).catch(code=>{
                    this.$message({type: "error", message: code.message || code});
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('editConfirm', false);
                    }, 300)
                })
            },
            cannel(){
                this.dialogVisible=false
            },
        },
        computed:{
            ...mapGetters({getParamAccount:'api/getParamAccount'}),
//            accounts:{
//                get(){
//                    console.log("account",this.gsMapForm.account)
//                    console.log("account_id",this.gsMapForm.account_id)
//                    return {label:this.gsMapForm.account, value:this.gsMapForm.account_id}
//                },
//                set(val){
//                    console.log("accounts",val)
//                    this.gsMapForm.account=val.label;
//                    this.gsMapForm.account_id=val.value;
//                }
//            },
            isDisable(){
                if(this.gsMapForm.channel_id&&this.isAdd){
                    return false
                }else {
                    return true
                }

            }

        },
        watch:{
            dialogVisible(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialogVisible = val;

            },
        },
        props:{
            value:{},
            gsMapForm:{
                required:true,
                type:Object
            },
            markId:{
                required:true,
                type:Number
            },
            isEdit:{
                required:true,
                type:Boolean
            },
            titleName:{
                required:true,
                type:String
            },
            isAdd:{
                type:Boolean,
                default(){
                    return  false;
                }
            },
            isLoad:{
                type:Boolean,
                default(){
                    return  false;
                }
            }
        },
        components: {
            pageDialog,
            uiInput,
            scrollSelect,
            addGoods:require("../../../api-components/add-goods.vue").default,
            paramAccount:require('../../../api-components/param-account.vue').default
        }
    }
</script>
