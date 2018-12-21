<template>
    <div class="c-add-edit">
        <page-dialog :title="title" v-model="dialog" size="large"
                     width="500px" :close-on-click-modal="false">
            <el-form :model="form" ref='form' label-width="160px" :rules="rules">
                <el-form-item label="1688用户名：" prop="account_name">
                    <el-row>
                        <el-col :span="14">
                            <el-input v-model="form.account_name" :disabled="editAccount"></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="简称：" prop="code">
                    <el-row>
                        <el-col :span="14">
                            <el-input v-model="form.code" :disabled="!isEdit"></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="会员身份：" prop="membership">
                    <el-row>
                        <el-col :span="14">
                            <el-select v-model="form.membership"
                                       filterable :disabled="!isEdit">
                                <el-option
                                        v-for="res in membershipList"
                                        :label="res.label"
                                        :value="res.value"
                                        :key="res.value"
                                ></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="订单后缀：" prop="order_prefix">
                    <el-row>
                        <el-col :span="14">
                            <el-input v-model="form.order_prefix"
                                      :disabled="!isEdit"></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="是否启用：">
                    <el-row>
                        <el-col :span="14">
                            <el-switch v-model="form.is_invalid"
                                       :disabled="!isEdit"
                                       onText="启用"
                                       offText="停用"></el-switch>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <template v-if="isEdit">
                    <request-button
                            req-key="addEditKey"
                            @click="add_new" :timeout="300"
                            class="inline">确定</request-button>
                    <el-button size="mini" class="inline" @click.native="dialog = false">取消</el-button>
                </template>
                <template v-else>
                    <el-button size="mini" type="primary" class="inline" @click.native="dialog = false">关闭</el-button>
                </template>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_add_accountlist,api_update_accountlist} from '../../../../api/1688-accounts'
    import {integer}from '../../../../define/validator_reg';
    export default {
        data() {
            let validatePrefix = (rules,value,callback)=>{
                if(value){
                    if(!integer.test(value)){
                        return callback(new Error('订单后缀只能为非负整数！'))
                    }else if(value.length!==4){
                        return callback(new Error('订单后缀必须为4位数！'))
                    }else{
                        return callback();
                    }
                }else{
                    callback();
                }
            };
            return {
                dialog:this.value,
                membershipList:[
                    {label:"企业单位",value:1},
                    {label:"事业单位或社会团体",value:2},
                    {label:"个体经营",value:3},
                    {label:"个人",value:4},
                ],
                rules:{
                    code:[
                        {required:true,message:"简称为必填项",trigger:'change'},
                    ],
                    account_name:[
                        {required:true,message:"1688用户名为必填项",trigger:'change'},
                    ],
                    membership:[
                        {required:true,message:"会员身份为必填项",type:'number',trigger:'change'},
                    ],
                    order_prefix:[
                        {required:true,message:"订单后缀为必填项，且只能输入4位数字",trigger:'change'},
                        {validator:validatePrefix,trigger:'blur'},
                    ]
                }
            }
        },
        methods:{
            add_new(){
                return this.$refs.form.validate((b)=>{
                    if(b){
                        Object.keys(this.form).forEach(key=>{
                            if(typeof this.form[key] === 'string'){
                                this.form[key] = this.form[key].trim();
                            }
                        });
                        let params = clone(this.form);
                        params.is_invalid = params.is_invalid?1:0;
                        if(params.hasOwnProperty('id')){//编辑==>更新
                            this.$http(api_update_accountlist,params.id,params).then(res=>{
                                this.$message({type:"success",message:res.message||res});
                                this.dialog = false;
                                this.$emit('update-new',res.data);
                            }).catch(code=>{
                                this.$message({type:"error",message:code.message||code});
                            }).finally(()=>{
                                this.$reqKey('addEditKey',false)
                            })
                        }else{//添加
                            this.$http(api_add_accountlist,params).then(res=>{
                                this.$message({type:"success",message:res.message||res});
                                this.dialog = false;
                                this.$emit('add-new',res.data);
                            }).catch(code=>{
                                this.$message({type:"error",message:code.message||code});
                            }).finally(()=>{
                                this.$reqKey('addEditKey',false)
                            })
                        }
                    }else{
                        this.$reqKey('addEditKey', false);
                    }
                });
            },
        },
        computed:{
            buttonName(){
                if(this.form){
                    /*
                    * */
                    return this.form.hasOwnProperty('id')?'保存':'添加';
                }
            },
            editAccount(){
                if(this.form){
                    /*
                    * 1688账户名查看&编辑状态下 不可更改；
                    * */
                    return !!this.form.hasOwnProperty('id');
                }
            },
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
            },
        },
        props:{
            value:{},
            title:{},
            form:{
                required:true,
                type:Object
            },
            isEdit:{
                required:true,
                type:Boolean
            },
        },
        components: {
            pageDialog:require('../../../../components/page-dialog.vue').default,
        }
    }
</script>
