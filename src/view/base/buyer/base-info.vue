<template>
    <div class="c-base_info">
        <el-form label-position="right" label-width="700px" :model="baseData" :rules="rules" ref="base">
            <el-form-item label="平台：" required prop="channel_id">
                    <select-remote class="width-sm"
                                   v-model="baseData.channel_id"
                                   :remote="channel_remote"></select-remote>
            </el-form-item>
            <el-form-item label="账号简称：">
                <el-select filterable clearable v-model="baseData.account_id" :placeholder="accoutPlaceholder" :disabled="baseData.channel_id<=0" class="width-sm">
                    <el-option v-for="item in accoutOptions"
                               :label="item.label"
                               :value="item.value"
                               :key="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="邮箱地址：" prop="email">
                <el-input v-model="baseData.email" class="inline"></el-input>
            </el-form-item>
            <el-form-item label="名称：">
                <el-input v-model="baseData.name" class="inline"></el-input>
            </el-form-item>
            <el-form-item label="买家ID：" prop="buyer_id" required>
                <el-input v-model="baseData.buyer_id" class="inline"></el-input>
            </el-form-item>
            <el-form-item label="手机号：" prop="mobile">
                <el-input v-model="baseData.mobile" class="inline"></el-input>
            </el-form-item>
            <el-form-item label="电话：" prop="tel">
                <el-input v-model="baseData.tel" class="inline"></el-input>
            </el-form-item>
            <el-form-item label="是否刷单：">
                <el-radio-group v-model="baseData.is_scalping">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="状态：">
                <el-radio-group v-model="baseData.status">
                    <el-radio :label="0">正常</el-radio>
                    <el-radio :label="1">异常</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <el-row class="mb-sm">
            <el-col :span="11" class="text-right">
                <permission tag="request-button" :route="apis.url_add_buyers" req-key="baseInfoSub"
                            class="inline" @click="submit" v-if="markId === 0">确定</permission>
                <permission tag="requestButton" :route="apis.url_update_buyers" class="inline" :request="update" v-else>确定</permission>
            </el-col>
            <el-col :span="12" :offset="1" class="text-left">
                <el-button size="mini" class="inline" @click="cancel_add" v-if="markId === 0">取消</el-button>
                <el-button size="mini" class="inline" @click="cancel_update" v-else>取消</el-button>
            </el-col>
        </el-row>
    </div>
</template>
<style lang="stylus">
    .text-right{
        text-align: right;
    }
    .text-left{
        text-align: left;
    }
</style>
<script>
    import {api_get_channel,api_account_list} from '../../../api/order-local';
    import {api_update_buyers,api_add_buyers,api_buyers,url_update_buyers,url_add_buyers} from '../../../api/buyer';
    export default{
        permission:{
            url_update_buyers,
            url_add_buyers,
        },
        page:{
            devinfo:{
                frontEnd:'黎宏珍',
                backEnd:'张文宇',
                createTime:'2017-8-5',
                updateTime:'2017-8-22'
            }
        },
        data(){
            var checkcode = (rule, value, callback) => {
                let check=/^[0-9]*$/;
                setTimeout(() => {
                    if (check.test(value)) {
                        callback();
                    }else {
                        callback(new Error('请输入数字！'));
                    }
                }, 300);
            };
            return{
                baseData:{
                    channel_id:0,
                    account_id:'',
                    email:'',
                    name:'',
                    buyer_id:'',
                    mobile:'',
                    tel:'',
                    is_scalping:0,
                    status:0,
                },
                scalpingList:[
                    {label:'是',value:1},
                    {label:'否',value:0}
                ],
                statusList:[
                    {label:'正常',value:0},
                    {label:'异常',value:1}
                ],
                accoutOptions:[{label:"",value:""}],
                rules:{
                    channel_id:[
                        {required:true,message:'请输入平台',trigger:'blur'}
                    ],
                    buyer_id:[
                        {required:true,message:'请输入买家ID',trigger:'blur'}
                    ],
                    mobile:[
                        {validator: checkcode,trigger: 'blur' }
                    ],
                    tel:[
                        {validator: checkcode,trigger: 'blur' }
                    ],
                    email:[
                        {type: 'email', message: '请输入正确的邮箱地址',trigger: 'blur,change'}
                    ]
                }

            }
        },
        methods:{
            channel_remote(callback){
                return this.$http(api_get_channel,{}).then(res=>{
                    callback(res);
                }).catch(code=>{
                    console.log(code);
                });
            },
            get_site(channel_id){
                if(!channel_id)return this.siteOptions = [{label:"",value:""}];
                this.$http(api_account_list,{channel_id:channel_id}).then(res=>{
                    if(res.account.length>0){
                        res = res.account;
                        this.accoutOptions = [{label:"全部",value:0},...res];
                    }else{
                        this.accoutOptions = [{label:"",value:""}];
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            submit(){
            	if(!this.baseData.channel_id){
                    this.$reqKey('baseInfoSub', false);
                    return this.$message({type:'error',message:`请选择平台`});
                }else if(!this.baseData.buyer_id){
                    this.$reqKey('baseInfoSub', false);
                    return this.$message({type:'error',message:`请输入买家ID`});
                }else{
                	this.list_channel(this.baseData);
                	this.list_account(this.baseData);
                	this.$delete(this.baseData,'create_time');
                	this.$delete(this.baseData,'id');
                	this.$delete(this.baseData,'account_name');
                	this.$delete(this.baseData,'channel_name');
                	this.$delete(this.baseData,'id');
                    this.$http(api_add_buyers,{basic:this.baseData}).then(res=>{
                        this.$message({type:'success',message:res.message || res});
                        this.$emit("address-add",res.id);
                        this.$set(this.baseData,"id",res.id);
                        this.$emit("base-add",this.baseData);
                    }).catch(code=>{
                        this.$message({
                            type:'error',
                            message:code.message || code
                        })
                    }).finally(()=>{
                        setTimeout(() => {
                            this.$reqKey('baseInfoSub', false);
                        }, 300)
                    });
                }
            },
            update(){
                let id = this.baseData.id;
                let data =  {
                    channel_id:this.baseData.channel_id,
                    account_id:this.baseData.account_id,
                    email:this.baseData.email,
                    status:this.baseData.status,
                    is_scalping:this.baseData.is_scalping,
                    tel:this.baseData.tel,
                    mobile:this.baseData.mobile,
                    buyer_id:this.baseData.buyer_id,
                    name:this.baseData.name,
                };
                return this.$http(api_update_buyers,id,{basic:data}).then(res=>{
                    this.$emit("update-data",this.baseData.id);
                    this.$message({type:'success',message:res.message || res});
                    return Promise.resolve();
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    })
                });
            },
            cancel_add(){
                this.baseData = {
                        channel_id:0,
                        account_id:'',
                        email:'',
                        name:'',
                        buyer_id:'',
                        mobile:'',
                        tel:'',
                        is_scalping:0,
                        status:0,
                }
            },
            cancel_update(){
                this.$http(api_buyers, this.baseData.id).then(res => {
                    this.baseData = res.basic;
                })
            },
            list_channel(val){
                switch(val.channel_id){
                    case 'ebay':
                        val.channel_id = 1;
                        break;
                    case 'amazon':
                        val.channel_id = 2;
                        break;
                    case 'wish':
                        val.channel_id = 3;
                        break;
                    case 'aliExpress':
                        val.channel_id = 4;
                        break;
                }
            },
            list_account(val){
                this.$http(api_account_list, {channel_id: val.channel_id}).then(res => {
                    let account = res.account;
                    account.forEach(data=>{
                        if(data.label === val.account_id){
                            val.account_id = data.value;
                            console.log("更新前val.account_id",val.account_id);
                        }
                    })
                }).catch(code => {
                    console.log(code);
                });
            }
        },
        watch:{
            'baseInfo'(val){
                if(val){
                    this.baseData = val.basic;
                }
            },
            'baseData.channel_id'(val){
                this.get_site(val);
            }
        },
        computed: {
            accoutPlaceholder(){
                if(this.accoutOptions.length<=1){
                    return "请先选择平台";
                }else{
                    return `请选择账号简称`;
                }
            }
        },
        props:{
            baseInfo:{},
            markId:{},
        },
        components:{
            labelItem:require('../../../components/label-item.vue').default,
            selectRemote:require('../../../components/select-remote.vue').default,
            requestButton:require('../../../global-components/request-button').default
        }
    }
</script>

