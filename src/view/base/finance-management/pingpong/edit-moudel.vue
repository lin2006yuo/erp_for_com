<template>
    <page-dialog class="c-card-search-order" :title="title"
                 v-model="show" size="small"
                 @open="open" @close="close"
                 :close-on-cilck-modal="false">
        <el-form :model="editData"
                 label-width="190px"
                 ref="editData"
                 :rules="currentRules"
                 class="local-order-search">
            <el-form-item label="平台：" prop="channel_id">
                <el-col :span="20">
                    <super-select
                            v-if="senseDisabled"
                            class="inline"
                            v-model="editData.channel_id"
                            :storage-key="`channelidKey`"
                            :options="channelData"
                            @change="get_site($event,true)">
                    </super-select>
                    <span v-else>{{editData.channel}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="站点：" prop="site_code">
                <el-col :span="20">
                    <el-select :disabled="!siteOptions.length"
                               v-if="senseDisabled"
                               filterable clearable
                               multiple
                               :placeholder="sitePlaceholder"
                               @remove-tag="remove_tag"
                               class="inline local-order-input-no-margin local-order-self-width"
                               v-model="editData.site_code">
                        <el-option v-for="item in siteOptions"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value">
                        </el-option>
                    </el-select>
                    <span class="product-info" v-else>{{editData.site_code}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="账号简称：" prop="account_id" :show-message="!!accoutOptions.length">
                <el-col :span="20">
                    <super-select
                            class="inline"
                            :disabled="!accoutOptions.length"
                            v-if="senseDisabled"
                            v-model="editData.account_id"
                            :placeholder="accountPlaceholder"
                            :storage-key="`accountidKey`"
                            :options="accoutOptions">
                    </super-select>
                    <span v-else>{{editData.account_code}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="服务器IP地址：">
                <el-col :span="20" v-if="senseDisabled">
                    <el-input class="inline" v-model="editData.ip_address" disabled></el-input>
                    <el-button type="primary" size="mini" class="ml-sm" @click.native="dialogShow = true">选择服务器</el-button>
                </el-col>
                <el-col :span="20" v-else>
                    <span>{{editData.ip_address}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="收款账号：" prop="account_number">
                <el-col :span="20">
                    <el-input v-model="editData.account_number"
                              v-if="senseDisabled"
                              class="inline"
                              placeholder="请输入"></el-input>
                    <span v-else>{{editData.account_number}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="收款人名称：" prop="account_name">
                <el-col :span="20">
                    <el-input v-model="editData.account_name"
                              v-if="senseDisabled"
                              class="inline"
                              placeholder="请输入"></el-input>
                    <span v-else>{{editData.account_name}}</span>
                </el-col>
            </el-form-item>
            <el-form-item label="操作人：" prop="operator_id">
                <el-col :span="20">
                    <super-select
                            v-if="senseDisabled"
                            class="inline"
                            v-model="editData.operator_id"
                            :storage-key="`operatoridCreator`"
                            :options="creatorData">
                    </super-select>
                    <span v-else>{{editData.operator}}</span>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <request-button v-if="senseDisabled" req-key="submitPing" @click.native="keep" type="primary">确 定</request-button>
            <el-button v-if="senseDisabled" size="mini" @click.native="show=false">取 消</el-button>
            <el-button v-else size="mini" @click.native="show=false">关 闭</el-button>
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
            .product-info{
                word-wrap:break-word;
                display: inline-block;
                max-width: 300px;
            }
        }
    }
</style>
<script>
    import {api_get_channel} from '@/api/order-local';
    import {api_pingpong_save,api_channels_account} from '@/api/pingpong';
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
                    site_code:[
                        { required: true, message: '请选择站点', trigger: 'change', type:'array',}
                    ],
                    account_id:[
                        { required: true, message: '账号简称为必填', trigger: 'change',type:"number"}
                    ],
                    account_number:[
                        { required: true, message: '收款账号为必填', trigger: 'blur'},
                        // {validator:checkNumber,trigger: 'blur'}
                    ],
                    account_name:[
                        { required: true, message: '收款人名称为必填', trigger: 'blur'}
                    ],
                    operator_id:[
                        {required: true, message: '操作人为必选项', trigger:"change",type:"number"}
                    ]
                },
                siteOptions:[],
                accoutOptions:[],
                channelData:[],
                dialogShow: false,
            }
        },
        methods:{
            open(){
                this.$http(api_get_channel, {}).then(res => {
                    this.channelData = res;
                }).catch(code => {
                    console.log(code);
                });
                this.get_site(this.editData.channel_id);
            },
            close(){
                Object.keys(this.editData).forEach(key=>{
                    this.editData[key] = "";
                });
            },
            get_site(channel_id,bool){
                if(bool){
                    this.$set(this.editData,'site_code',[]);
                    this.$set(this.editData,'account_id','');
                }
                this.siteOptions=[];
                this.accoutOptions=[];
                this.$http(api_channels_account,{channel_id:channel_id}).then(res=>{
                    this.siteOptions=res.site;
                    this.accoutOptions =res.account;
                }).catch(error=>{
                    error&&this.$message({type:'error',message:error.message||error})
                });
            },
            remove_tag(item) {
                let index = this.editData.site_code.findIndex(row => row === item.value);
                if (index !==-1) {
                    this.editData.site_code.splice(index, 1);
                }
            },
            //选择服务器
            choose_server(obj){
                this.editData.ip_address = obj.ip;
                this.editData.server_id=obj.id;
            },
            keep(){
                this.$refs.editData.validate((bool)=>{
                    if(bool){
                        delete this.editData.ip_address;
                        this.$http(api_pingpong_save,this.editData.id,this.editData).then(succ=>{
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
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            }
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
                if(!this.editData.channel_id){
                    return "请先选择平台";
                }else if(!!this.editData.channel_id && !this.siteOptions.length){
                    return "该平台下暂无站点";
                }else if(this.editData.site_code.length > 0){
                    return ""
                }else {
                    return "请选择站点"
                }
            },
            accountPlaceholder(){
                if(!this.editData.site_code){
                    return "请先选择站点";
                }else if(!!this.editData.site_code && !this.accoutOptions.length){
                    return "该站点下暂无账号";
                }else{
                    return "请选择账号"
                }
            }
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            title:{},
            editData:{},
            senseDisabled:{},
            creatorData:{}
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
            chooseServer:require('../paypal/choose-server').default,
        }
    }
</script>