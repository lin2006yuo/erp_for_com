<template>
    <el-row class="p-edit">
        <page-dialog :title="title"
                     v-model="editFormVisible"
                     size="small" :close-on-click-modal="false">
            <el-form :model="editData" ref="editForm" label-width="190px"  :rules="rules">
                <el-form-item label="Amazon用户名：" prop="account_name">
                    <el-col :span="14">
                        <el-input v-model="editData.account_name"
                                  :disabled="true"
                                  v-if="!isView">
                        </el-input>
                        <span v-if="isView">{{editData.account_name}}</span>
                    </el-col>
                </el-form-item>
                <el-form-item label="简称："  prop="code">
                    <el-col :span="14">
                        <el-input v-model="editData.code" v-if="!isView" disabled></el-input>
                        <span v-if="isView">{{editData.code}}</span>
                    </el-col>
                </el-form-item>
                <el-form-item label="站点：" prop="site">
                    <el-col :span="14">
                        <el-select :value="editData.site" disabled v-if="!isView" @input="(val)=>{currentSel(val)}" >
                            <el-option v-for="item in addEditSiteList"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                        <span v-if="isView">{{editData.site}}</span>
                    </el-col>
                </el-form-item>
                <el-form-item label="抓取Amazon Listing功能：">
                    <el-col :span="14">
                        <el-select  v-model="editData.download_listing" v-if="!isView">
                            <el-option v-for="item in downloadList"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                        <span v-if="isView">{{editData.download_listing | filterHour}}</span>
                    </el-col>
                </el-form-item>
                <el-form-item label="抓取Amazon订单功能：">
                    <el-col :span="14">
                        <el-select  v-model="editData.download_order" v-if="!isView">
                            <el-option v-for="item in downloadList"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                        <span v-if="isView">{{editData.download_order | filterHour}}</span>
                    </el-col>
                </el-form-item>
                <el-form-item label="同步发货状态到Amazon功能：">
                    <el-col :span="14">
                        <el-select v-model="editData.sync_delivery" v-if="!isView">
                            <el-option v-for="item in downloadList"
                                       v-if="!isView"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                        <span v-if="isView">{{editData.sync_delivery | filterHour}}</span>
                    </el-col>
                </el-form-item>
                <el-form-item label="同步中差评到Amazon功能：">
                    <el-col :span="14">
                        <el-select v-model="editData.sync_feedback" v-if="!isView">
                            <el-option v-for="item in downloadList"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                        <span v-if="isView">{{editData.sync_feedback | filterHour}}</span>
                    </el-col>
                </el-form-item>
                <el-form-item label="同步健康数据：">
                    <el-col :span="14">
                        <el-select v-model="editData.download_health" v-if="!isView">
                            <el-option v-for="item in downloadList"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                        <span v-if="isView">{{editData.download_health | filterHour}}</span>
                    </el-col>
                </el-form-item>

                <el-form-item label="账号使用情况考核：">
                    <el-col :span="14">
                        <el-select v-model="editData.assessment_of_usage" v-if="!isView">
                            <el-option v-for="item in accountList"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                        <span v-if="isView">{{editData.assessment_of_usage | filterTime3}}</span>
                    </el-col>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <request-button req-key="editYmx"
                           @click="edit_ymx"
                           v-if="!isView">确定</request-button>
                <el-button size="mini" :type='isView?"primary":""' @click.native="editFormVisible=false">
                    {{!isView ? '取 消':'关 闭'}}
                </el-button>
            </div>
        </page-dialog>
    </el-row>
</template>
<style lang="stylus">
    .edit-red-color{
        color: #FF4949;
    }
</style>
<script>
    import pageDialog from '../../../../components/page-dialog.vue';
    import {ymx_update,ymx_site_accredit} from '../../../../api/ymx';
    export default{
        data(){
            return {
                typeList:[
                    {label:'自授权',value:0},
                    {label:'第三方授权',value:1}
                ],
                accountList: [
                    {label:"启用",value:0},
                    {label:"未启动",value:1},
                ],
                editFormVisible:false,
                downloadList:[
                    {label:"未启用",value:0},
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
                site:[
                    {label:"US",value:'US'},
                    {label:"CA",value:'CA'},
                    {label:"DE",value:'DE'},
                    {label:"ES",value:'ES'},
                    {label:"FR",value:'FR'},
                    {label:"IT",value:'IT'},
                    {label:"JP",value:'JP'},
                    {label:"UK",value:'UK'}
                ],
                rules:{
                    account_name:[
                        {required: true, message: 'Amazon用户名为必填项', trigger: 'change' }
                    ],
                    password:[
                        {required: true, message: '登录密码为必填项', trigger: 'change'}
                    ],
                    site:[
                        {required: true, message: '站点为必填项', trigger: 'change'}
                    ],
                    access_key_id:[
                        {required: true, message: 'API密码为必填项', trigger: 'change'}
                    ],
                    merchant_id:[
                        {required: true, message: 'API用户名为必填项', trigger: 'change'}
                    ],
                    secret_key:[
                        {required: true, message: 'API签名为必填项', trigger: 'change'}
                    ],
                    code:[
                        {required: true, message: '简称为必填项', trigger: 'change'}
                    ],
                    developer_access_key_id:[
                        {required: true, message: '第三方API密码为必填项', trigger: 'change'}
                    ],
                    auth_token:[
                        {required: true, message: '第三方授权Token为必填项', trigger: 'change'}
                    ],
                    developer_secret_key:[
                        {required: true, message: '第三方API签名为必填项', trigger: 'change'}
                    ],
                }
            }
        },
        created(){},
        filters:{
            filterType(val){
                return val === 0? '自授权' : '第三方授权';
            },
            filterTime3(val) {
                if (val === 1) {
                    return '未启用';
                } else if (val === 0) {
                    return '启用'
                }
            },
            filterHour(val){
                if(!val)return '未启用';
                if(val === 30)return `${Number(val)}分钟`;
                return `${Number(val)/60}小时`
            },
        },
        methods:{
            currentSel(val){
                this.editData.site = val;
                this.doSomething()
            },
            currentSel2(val){
                this.editData.authorization_type = val;
                this.doSomething();
            },
            doSomething(){
                if(this.editData.authorization_type===1){
                    this.$http(ymx_site_accredit,this.editData.site).then(res => {
                        if(res.ack===1){
                            this.editData.developer_access_key_id = res.data.developer_access_key_id;
                            this.editData.developer_secret_key = res.data.developer_secret_key;
                        }else{
                            this.$message({type: "error", message: res.message || code});
                            this.editData.authorization_type = 0;
                        }
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code})
                    })
                }else{
                    this.editData.authorization_type = 0;
                }
            },
            edit_ymx(){//---------------保存按钮
                this.$refs.editForm.validate((bool)=>{
                    if(bool){
                        Object.keys(this.editData).forEach(key=>{
                            if(typeof this.editData[key] === 'string'){
                                this.editData[key] = this.editData[key].trim();
                            }
                        });
                        let params = clone(this.editData);
                        this.$http(ymx_update,this.editData.id,params).then(res=>{
                            this.$message({type: "success", message: res.message || res})
                            this.editFormVisible=false;
                            this.$emit('edit_ymx',this.editData.id,params);
                        }).catch(code=>{
                            this.$message({type: "error", message: code.message || code})
                        }).finally(()=>{
                            setTimeout(() => {
                                this.$reqKey('editYmx', false);
                            }, 300)
                        })
                    }else{
                        setTimeout(() => {
                            this.$reqKey('editYmx', false);
                        }, 300)
                    }
                });
            }
        },
        computed:{
            isShow(){
               if(this.editData){
                    return this.editData.authorization_type ===1
               }
            },
            isView(){
                return this.action.name === 'view';
            },
        },
        watch:{
            editFormVisible(val){
                this.$emit('input',val);
            },
            value(val){
                this.editFormVisible = val;
            }
        },
        props:{
            value:{},
            editData:{
                required:true,
                type:Object
            },
            title:{
                required:true,
                type:String
            },
            action:{
                require:true,
                type:Object
            },
            addEditSiteList:{
                required:true,
                type:Array
            },
        },
        components: {
            pageDialog
        }
    }
</script>
