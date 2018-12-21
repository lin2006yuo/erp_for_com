<template>
    <el-row class="p-add-form">
        <page-dialog title="添加账号"
                     v-model="addFormVisible"
                     size="small"
                     @close="closing"
                     :close-on-click-modal="false">
            <el-form :model="addData"
                     :rules="rules"
                     label-width="190px"
                     ref="addData">
                <el-form-item label="Amazon用户名：" prop="account_name">
                    <el-col :span="14">
                        <el-input v-model="addData.account_name"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="登录密码：">
                    <el-col :span="14">
                        <el-input v-model="addData.password"
                                  type="password">
                        </el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="简称：" prop="code">
                    <el-col :span="14">
                        <el-input v-model="addData.code"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="站点：" prop="site">
                    <el-col :span="14">
                        <el-select :value="addData.site" @input="(val)=>{currentSel(val)}">
                            <el-option v-for="item in addEditSiteList"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="API用户名：" prop="merchant_id">
                    <el-col :span="14">
                        <el-input v-model="addData.merchant_id"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="授权类型：" prop="authorization_type">
                    <el-col :span="14">
                        <el-select :value="addData.authorization_type" :disabled="!addData.site"  @input="(val)=>{currentSel2(val)}" placeholder="请先选择站点">
                            <el-option v-for="item in typeList"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="API密码：" prop="access_key_id" v-if="!isShow">
                    <el-col :span="14">
                        <el-input v-model="addData.access_key_id"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="API签名：" prop="secret_key" v-if="!isShow">
                    <el-col :span="20">
                        <el-input type="textarea"
                                  :autosize="{ minRows: 2, maxRows: 4}"
                                  v-model="addData.secret_key">
                        </el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="第三方API密码：" prop="developer_access_key_id" v-if="isShow">
                    <el-col :span="14">
                        <el-input v-model="addData.developer_access_key_id"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="第三方API签名：" prop="developer_secret_key" v-if="isShow">
                    <el-col :span="20">
                        <el-input type="textarea"
                                  :autosize="{ minRows: 2, maxRows: 4}"
                                  v-model="addData.developer_secret_key">
                        </el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="第三方授权Token：" prop="auth_token" v-if="isShow">
                    <el-col :span="14">
                        <el-input v-model="addData.auth_token"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="抓取Amazon Listing功能：">
                    <el-col :span="14">
                        <el-select v-model="addData.download_listing">
                            <el-option v-for="item in downloadList"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="抓取Amazon订单功能：">
                    <el-col :span="14">
                        <el-select v-model="addData.download_order">
                            <el-option v-for="item in crawl"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="同步发货状态到Amazon功能：">
                    <el-col :span="14">
                        <el-select v-model="addData.sync_delivery">
                            <el-option v-for="item in station"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="同步中差评到Amazon功能：">
                    <el-col :span="14">
                        <el-select v-model="addData.sync_feedback">
                            <el-option v-for="item in station"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="同步健康数据：">
                    <el-col :span="14">
                        <el-select v-model="addData.download_health">
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
                <request-button req-key="addFormYmx" @click="add_ymx">确 定</request-button>
                <el-button size="mini" @click.native="cancel">取 消</el-button>
            </div>
        </page-dialog>
    </el-row>
</template>
<style lang="stylus">

</style>
<script>
    import pageDialog from '../../../../components/page-dialog.vue';
    import {ymx_site_accredit} from '../../../../api/ymx';
    export default{
        data(){
            return{
                addFormVisible:false,
                crawl:[
                    {label:"未启用",value:0},
                    {label:"30分钟",value:30},
                    {label:"60分钟",value:60}
                      ],
                downloadList:[
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
                station:[
                    {label:"未启用",value:0},
                    {label:"30分钟",value:30},
                    {label:"60分钟",value:60}
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
                typeList:[
                    {label:'自授权',value:0},
                    {label:'第三方授权',value:1}
                ],
                feedback:[
                    {label:"US",value:'US'},
                ],
                rules:{
                    account_name:[
                        {required: true, message: 'Amazon用户名为必填项', trigger: 'change' }
                    ],
//                    password:[
//                        {required: true, message: '登录密码为必填项', trigger: 'change'}
//                    ],
                    site:[
                        {required: true, message: '站点为必填项', trigger: 'change'}
                    ],
                    // authorization_type:[
                    //     {required: true, message: '授权类型为必填项', trigger: 'select'}
                    // ],
                    access_key_id:[
                        {required: true, message: 'API密码为必填项', trigger: 'change'}
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
                    merchant_id:[
                        {required: true, message: 'API用户名为必填项', trigger: 'change'}
                    ],
                    secret_key:[
                        {required: true, message: 'API签名为必填项', trigger: 'change'}
                    ],

                    code:[
                        {required: true, message: '简称为必填项', trigger: 'change'}
                    ]
                }
            }
        },
        created(){},
        methods:{
            currentSel(val){
                this.addData.site = val;
                this.doSomething()
            },
            currentSel2(val){
                this.addData.authorization_type = val;
                this.doSomething();
            },
            doSomething(){
                if(this.addData.authorization_type===1){
                    this.$http(ymx_site_accredit,this.addData.site).then(res => {
                        if(res.ack===1){
                            this.addData.developer_access_key_id = res.data.developer_access_key_id;
                            this.addData.developer_secret_key = res.data.developer_secret_key;
                        }else{
                            this.$message({type: "error", message: res.message || code});
                                this.addData.authorization_type = 0;
                        }
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code})
                    })
                }else{
                     this.addData.authorization_type = 0;
                }
            },
            add_ymx(){//-------------添加
                this.$refs.addData.validate((bool)=>{
                    if(bool){
                        this.$emit('add_ymx');//-------事件抛出
                    }else{
                        setTimeout(() => {
                            this.$reqKey('addFormYmx', false);
                        }, 300)
                    }
                });
            },
            cancel(){//-----------取消
                this.addFormVisible = false
            },
            closing(){//-------------------------清空

            }
        },
        computed:{
            isShow(){
                if(this.addData){
                    return this.addData.authorization_type ===1
                }
            },
            isAdd(){//-----校验
                if (!this.addData.code) {
                    return true
                }
                if (!this.addData.account_name) {
                    return true
                }
                if (!this.addData.site) {
                    return true
                }
                if (!this.addData.merchant_id) {
                    return true
                }
                if (!this.addData.access_key_id) {
                    return true
                }
                if (!this.addData.developer_access_key_id) {
                    return true
                }
                if (!this.addData.auth_token) {
                    return true
                }
                if (!this.addData.authorization_type) {
                    return true
                }
                if (!this.addData.secret_key) {
                    return true
                }
                if (!this.addData.developer_secret_key) {
                    return true
                }
                return false
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
            value: {},
            addData:{
                required:true,
                type:Object
            },
            addEditSiteList:{
                required:true,
                type:Array
            },
        },
        components:{
            pageDialog,
            requestButton:require('../../../../global-components/request-button').default
        }
    }
</script>
