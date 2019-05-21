<template>
    <page-dialog :title="title" v-model="show" size="small" @open="open" @close="close" :close-on-cilck-modal="false">
        <el-form :model="addData"
                 label-width="160px"
                 ref="addData"
                 :rules="rules">
            <el-form-item label="Payoneer邮箱：" prop="account_name">
                <el-col :span="18">
                    <el-input v-model="addData.account_name"
                              class="inline"
                              placeholder="请输入"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="登录密码：" prop="email_password">
                <el-col :span="18">
                    <el-input v-model="addData.email_password"
                              ref="email_password"
                              type="password"
                              class="inline"
                              placeholder="请输入"></el-input>
                    <img src="../../../../assets/eye.svg"
                         @mouseup="backPassword('email_password')"
                         @mousedown="lookPassword('email_password')"
                         style="vertical-align: middle;width: 20px;height: 20px;">
                </el-col>
            </el-form-item>
            <el-form-item label="注册名称：" prop="registered_name">
                <el-col :span="18">
                    <el-input v-model="addData.registered_name"
                              class="inline"
                              placeholder="请输入"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="公司名称：" prop="company_name">
                <el-col :span="18">
                    <el-input v-model="addData.company_name"
                              class="inline"
                              placeholder="请输入"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="账户持有人：" prop="belong">
                <el-col :span="18">
                    <el-input v-model="addData.belong"
                              class="inline"
                              placeholder="请输入"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="电话号码：" prop="phone">
                <el-col :span="18">
                    <el-input v-model="addData.phone"
                              type="number"
                              class="inline"
                              placeholder="请输入"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="生日：">
                <el-col :span="18">
                    <el-date-picker
                            v-model="addData.birthday"
                            class="inline"
                            type="date"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="客户ID：" prop="client_code">
                <el-col :span="18">
                    <el-input v-model="addData.client_code"
                              class="inline"
                              placeholder="请输入"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="密保答案：">
                <el-col :span="18">
                    <el-input v-model="addData.encrypted_data"
                              class="inline"
                              placeholder="请输入"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="操作人：" prop="operator_id">
                <el-col :span="18">
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
            <el-button size="mini" @click.native="keep" type="primary">确 定</el-button>
            <el-button size="mini" @click.native="show=false">取 消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_payoneer_add} from '@/api/payoneer';
    export default{
        data(){
            return{
                show:this.value,
                rules:{
                    account_name:[{required: true, message: 'Payoneer邮箱为必填项', trigger: 'blur'}],
                    email_password:[{required: true, message: '登录密码为必填项', trigger: 'blur'}],
                    registered_name:[{required: true, message: '注册名称为必填项', trigger: 'blur'}],
                    company_name:[{required: true, message: '公司名称为必填项', trigger: 'blur'}],
                    belong:[{required: true, message: '账户持有人为必填项', trigger: 'blur'}],
                    phone:[{required: true, message: '电话号码为必填项', trigger: 'blur'}],
                    client_code:[{required: true, message: '客户ID为必填项', trigger: 'blur'}],
                    operator_id:[{required: true, message: '操作人为必选项', trigger:"change",type:"number"}],
                },
                retype_visible: false
            }
        },
        methods:{
            open(){
            
            },
            close(){
                Object.keys(this.addData).forEach(key=>{
                    this.addData[key] = "";
                });
            },
            keep(){
                this.$refs.addData.validate((bool)=>{
                    if(bool){
                        let data = clone(this.addData);
                        data.birthday=this.addData.birthday?datef('YYYY-MM-dd', this.addData.birthday/1000):'';
                        this.$http(api_payoneer_add,data).then(succ=>{
                            this.$message({type:'success', message:succ.message||succ});
                            this.$emit('submit');
                            this.show = false;
                        }).catch(fail=>{
                            this.$message({type:'error', message:fail.message||fail});
                            this.show = true;
                        }).finally(()=>{
                            setTimeout(() => {
                                this.$reqKey('submitWF', false);
                            }, 300)
                        })
                    }else{
                        this.$reqKey('submitWF', false);
                    }
                })
            },
            lookPassword(type){
                this.$refs[type].$refs.input.type = 'text';
            },
            backPassword(type){
                this.$refs[type].$refs.input.type = 'password';
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
            pageDialog:require('@/components/page-dialog.vue').default
        }
    }
</script>