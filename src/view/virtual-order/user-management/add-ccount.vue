<template>
    <page-dialog :title="title" v-model="show" size="small" @open="open" @cloce="cloce" :close-on-cilck-modal="false">
        <el-form :model="addEditData"
                 :rules="rules"
                 label-width="190px"
                 ref="addEditData">
            <el-form-item label="账号用户名：" prop="username">
                <el-col :span="14">
                    <el-input v-model="addEditData.username"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item v-if="edit" label="账号密码：" prop="password">
                <el-col :span="14">
                    <el-input v-model="addEditData.password"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="联系邮箱：" prop="email">
                <el-col :span="14">
                    <el-input v-model="addEditData.email"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="国家：" prop="country">
                <el-col :span="14">
                    <el-select v-model="addEditData.country" default-first-option filterable clearable>
                        <el-option
                                v-for="(res, index) in countryList"
                                :label="res.country_cn_name"
                                :value="res.country_code"
                                :key="res.country_code+index"
                        ></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="城市：" prop="city">
                <el-col :span="14">
                    <el-input placeholder="完整填写英文城市名称" v-model="addEditData.city"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="返款人姓名：" prop="refund_name">
                <el-col :span="14">
                    <el-input placeholder="填写返款人姓名" v-model="addEditData.refund_name"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="返款账号：" prop="refund_account">
                <el-col :span="14">
                    <el-input placeholder="填写返款账号" v-model="addEditData.refund_account"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="返款方式：" prop="refund_type">
                <el-col :span="14">
                    <el-select v-model="addEditData.refund_type" placeholder="请选择">
                        <el-option
                                v-for="item in refundTypeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="返款币种：" prop="refund_currency">
                <el-col :span="14">
                    <el-select v-model="addEditData.refund_currency" placeholder="请选择" default-first-option filterable clearable>
                        <el-option
                                v-for="items in currencyOptions"
                                :key="items.value"
                                :label="items.label"
                                :value="items.value">
                        </el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="接收任务平台：" required>
                <el-col :span="14">
                    <channel-checkbox v-for="item in addEditData.platform"
                                      :key="item.channel_id"
                                      :form="item"></channel-checkbox>
                </el-col>
            </el-form-item>
            <el-form-item v-if="edit" label="">
                <el-button class="inline ml-lg mt-sm" type="warning" @click.native="submit">立即注册</el-button>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" v-if="!edit">
            <el-button size="mini" @click.native="keep" type="primary">确定</el-button>
            <el-button size="mini" @click.native="show=false">关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_virtual_country,api_get_currency_type} from '@/api/api-user-management';
    export default{
        data(){
            return{
                show:this.value,
                countryList:[],
                rules:{
                    username:[
                        {required: true, message: '账号用户名为必填项', trigger: 'change'},
                    ],
                    password:[
                        {required: true, message: '账号密码为必填', trigger: 'change'},
                    ],
                    email:[
                        {required: true, message: '联系邮箱为必填', trigger: 'change'},
                    ],
                    country:[
                        {required: true, message: '国家为必填', trigger: 'change'},
                    ],
                    city:[
                        {required: true, message: '城市为必填', trigger: 'change'},
                    ],
                    refund_name:[
                        {required: true, message: '返款人姓名为必填', trigger: 'change'},
                    ],
                    refund_account:[
                        {required: true, message: '返款账号为必填', trigger: 'change'},
                    ],
                    refund_type:[
                        {required: true, message: '返款方式为必填', trigger: 'change', type: 'number'},
                    ],
                    refund_currency:[
                        {required: true, message: '返款币种为必填', trigger: 'change'},
                    ]
                },
                refundTypeList:[
                    {label: 'Paypal', value: 1},
                    {label: '微信', value: 2},
                    {label: '支付宝', value: 3},
                ],
                currencyOptions:[],
            }
        },
        mounted(){
            this.get_country();
            this.get_currency_type()
        },
        methods:{
            open(){
            
            },
            cloce(){
            
            },
            get_country(){
                this.$http(api_virtual_country).then(res => {
                    this.countryList = res
                }).catch(code => {
                    console.log(code);
                })
            },
            submit(){
                this.$refs.addEditData.validate((b)=>{
                    if(b){
                        this.$emit('submit');
                    }
                });
            },
            keep(){
                this.$refs.addEditData.validate((b)=>{
                    if(b){
                        this.$emit('keep');
                    }
                });
            },
            get_currency_type(){//获取货币类型
                this.$http(api_get_currency_type,{}).then(res => {
                    this.currencyOptions = res.map(row => {
                        return {
                            label: row.code,
                            value: row.code
                        }
                    })
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
        props:{
            value:{
                required:true,
                type:Boolean
            },
            addEditData:{
                required:true,
                type:Object,
            },
            title:{
                required:true,
                type:String,
            },
            edit:{
                required:true,
                type:Boolean,
            }
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
            labelItem:require('@/components/label-item.vue').default,
            channelCheckbox:require('./channel-checkbox.vue').default,
        }
    }
</script>