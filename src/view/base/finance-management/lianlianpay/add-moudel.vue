<template>
    <page-dialog class="c-card-search-order" :title="title"
                 v-model="show" size="small"
                 @open="open" @close="close"
                 :close-on-cilck-modal="false">
        <el-form :model="addData"
                 label-width="190px"
                 ref="addData"
                 :rules="currentRules"
                 class="local-order-search">
            <el-form-item label="平台：" prop="channel_id">
                <el-col :span="20">
                    <super-select
                            class="inline"
                            v-model="addData.channel_id"
                            :storage-key="`channelidKey`"
                            :options="channelData"
                            @change="get_site">
                    </super-select>
                </el-col>
            </el-form-item>
            <el-form-item label="站点：" prop="site_code" :show-message="!!siteOptions.length">
                <el-col :span="20">
                    <el-select :disabled="!siteOptions.length"
                               filterable clearable
                               multiple
                               :placeholder="sitePlaceholder"
                               @remove-tag="remove_tag"
                               class="inline local-order-input-no-margin local-order-self-width"
                               v-model="addData.site_code">
                        <el-option v-for="item in siteOptions"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value">
                        </el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="账号简称：" prop="account_id" :show-message="!!accoutOptions.length">
                <el-col :span="20">
                    <super-select
                            class="inline"
                            :disabled="!accoutOptions.length"
                            v-model="addData.account_id"
                            :placeholder="accountPlaceholder"
                            :storage-key="`accountidKey`"
                            :options="accoutOptions">
                    </super-select>
                </el-col>
            </el-form-item>
            <el-form-item label="服务器IP地址：">
                <el-col :span="20">
                    <el-input class="inline" v-model="addData.ip_address" disabled></el-input>
                    <el-button type="primary" size="mini" class="ml-sm" @click.native="dialogShow = true">选择服务器</el-button>
                </el-col>
            </el-form-item>
            <el-form-item label="收款账号：" prop="lianlian_account">
                <el-col :span="20">
                    <el-input v-model="addData.lianlian_account"
                              class="inline"
                              placeholder="请输入"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="收款人名称：" prop="lianlian_name">
                <el-col :span="20">
                    <el-input v-model="addData.lianlian_name"
                              class="inline"
                              placeholder="请输入"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="操作人：" prop="operator_id">
                <el-col :span="20">
                    <super-select
                            class="inline"
                            v-model="addData.operator_id"
                            :storage-key="`operatoridCreator`"
                            :options="creatorData">
                    </super-select>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <request-button req-key="submitPing" @click.native="keep" type="primary">确 定</request-button>
            <el-button size="mini" @click.native="show=false">取 消</el-button>
        </div>
        <choose-server v-model="dialogShow" @choose-server="choose_server"></choose-server>
    </page-dialog>
</template>
<style lang="stylus">
    .c-card-search-order{
        .el-card{
            overflow: inherit;
        }
        .local-order-search{
            .el-select__tags{
                height: 50px!important;
                max-width: 148px!important
                overflow-y: auto;
                >span{
                    white-space: inherit;
                }
            }
            .local-order-input-no-margin {
                .el-select__input {
                    width: 196px !important;
                    margin-left: 4px !important;
                }
            }
        }
    }
</style>
<script>
    import {api_get_channel} from '@/api/order-local';
    import {api_lianlianpay_add,api_channels_account} from '@/api/lianlianpay';
    // import {extraReg} from '@/define/validator_reg'
    export default{
        data(){
            // var checkNumber= (rule,value,callback)=>{
            //     if(value){
            //         return !extraReg.test(value)?callback(new Error("收款账号为数字，请重新输入！")):callback()
            //     }else{
            //         return callback();
            //     }
            // };
            return{
                show:this.value,
                rules:{
                    channel_id: [
                        { required: true, message: '请选择平台', trigger: 'change', type:'number', min:1 }
                    ],
                    lianlian_account:[
                        { required: true, message: '收款账号为必填', trigger: 'blur'},
                        // {validator:checkNumber,trigger: 'blur'}
                    ],
                    lianlian_name:[
                        { required: true, message: '收款人名称为必填', trigger: 'blur'}
                    ],
                    operator_id:[
                        {required: true, message: '操作人为必选项', trigger:"change",type:"number"}
                    ],
                    site_code:[
                        {required: true, message: '站点为必选项', trigger:"change",type:"array"}
                    ],
                    account_id:[
                        {required: true, message: '账号简称为必选项', trigger:"change",type:"number"}
                    ],
                },
                siteOptions:[],
                accoutOptions:[],
                dialogShow: false,
                channelData:[],

            }
        },
        methods:{
            open(){
                this.siteOptions=[];
                this.accoutOptions=[];
                this.$http(api_get_channel, {}).then(res => {
                    this.channelData = res;
                }).catch(code => {
                    console.log(code);
                });
            },
            close(){
                Object.keys(this.addData).forEach(key=>{
                    this.addData[key] = "";
                });
            },
            get_site(channel_id){
                this.$set(this.addData,'site_code',[]);
                this.$set(this.addData,'account_id','');
                this.$http(api_channels_account,{channel_id:channel_id}).then(res=>{
                    this.siteOptions=res.site.length?[...res.site]:res.site;
                    this.accoutOptions =res.account.length?[...res.account]:res.account;
                }).catch(error=>{
                    error&&this.$message({type:'error',message:error.message||error})
                });
            },
            keep(){
                this.$refs.addData.validate((bool)=>{
                    if(bool){
                        let data = clone(this.addData);
                        delete data.ip_address;
                        this.$http(api_lianlianpay_add,data).then(succ=>{
                            this.$message({type:'success', message:succ.message||succ});
                            this.$emit('submit');
                            this.show = false;
                        }).catch(fail=>{
                            this.$message({type:'error', message:fail.message||fail});
                            this.show = true;
                        }).finally(()=>{
                            setTimeout(() => {
                                this.$reqKey('submitPing', false);
                            }, 300)
                        })
                    }else{
                        this.$reqKey('submitPing', false);
                    }
                })
            },
            remove_tag(item) {
                let index = this.addData.site_code.findIndex(row => row === item.value);
                if (index  !==-1) {
                    this.addData.site_code.splice(index, 1);
                }
            },
            //选择服务器
            choose_server(obj){
                this.addData.ip_address = obj.ip;
                this.addData.server_id=obj.id;
            },
        },
        computed:{
            currentRules(){
                if(this.siteOptions.length){
                    this.rules.site_code.forEach(row=>{this.$set(row,'required',true)});
                }else if(!this.siteOptions.length){
                    this.rules.site_code.forEach(row=>{this.$set(row,'required',false)})
                }
                if(this.accoutOptions.length){
                    this.rules.account_id.forEach(row=>{this.$set(row,'required',true);this.$set(row,'type','number');});
                }else if(!this.accoutOptions.length){
                    this.rules.account_id.forEach(row=>{this.$set(row,'required',false);this.$set(row,'type','string');})
                }
                return this.rules;
            },
            sitePlaceholder(){
                if(!this.addData.channel_id){
                    return "请先选择平台";
                }else if(!!this.addData.channel_id && !this.siteOptions.length){
                    return "该平台下暂无站点";
                }else if(this.addData.site_code.length > 0){
                    return ""
                }else {
                    return "请选择站点"
                }
            },
            accountPlaceholder(){
                if(!this.addData.site_code){
                    return "请先选择站点";
                }else if(!!this.addData.site_code && !this.accoutOptions.length){
                    return "该站点下暂无账号";
                }else{
                    return "请选择账号"
                }
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
            value:{
                required:true,
                type:Boolean
            },
            addData:{},
            title:{},
            creatorData:{}
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
            chooseServer:require('../paypal/choose-server').default,
            scrollSelect:require('@/components/scroll-select.vue').default,
        }
    }
</script>