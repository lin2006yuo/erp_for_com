<template>
    <page-dialog :title="title" v-model="show" size="small" @open="open" @close="close" :close-on-cilck-modal="false">
        <el-form :model="indentImpower"
                 label-width="190px"
                 ref="indentImpower"
                 :rules="rules">
            <el-form-item label="账号类型：" prop="mode">
                <el-col :span="14">
                    <el-select v-model="indentImpower.mode" :disabled="modeData">
                        <el-option v-for="item in typeOptions"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="邮箱：" prop="email">
                <el-col :span="14">
                    <el-input v-model="indentImpower.email"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="账号ID：" prop="client_id">
                <el-col :span="14">
                    <el-input v-model="indentImpower.client_id"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="账号密钥：" prop="client_secret">
                <el-col :span="14">
                    <el-input v-model="indentImpower.client_secret"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="Paytm账号：">
                <el-col :span="14">
                    <el-input disabled v-model="indentImpower.account_name"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="账号密码：">
                <el-col :span="14">
                    <el-input v-model="indentImpower.password"></el-input>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <request-button req-key="addObtain" @click.native="keep">获取token</request-button>
            <el-button size="mini" @click.native="show=false">取  消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_token_paytm} from '../../../../api/paytm';
    export default{
        data(){
            return{
                typeOptions: [
                    {label: '本地仓', value: 0},
                    {label: '海外仓', value: 1}
                ],
                show:this.value,
                rules:{
                    mode:[
                        {required: true, message: '账号类型为必选', trigger: 'change',type:"number"}
                    ],
                    email:[
                        {required: true, message: '邮箱为必填项', trigger: 'change'}
                    ],
                    client_id:[
                        {required: true, message: '账号ID为必填项', trigger: 'change' }
                    ],
                    client_secret:[
                        {required: true, message: '账号密钥为必填项', trigger: 'change' }
                    ],
                },
            }
        },
        methods:{
            open(){

            },
            close(){
                Object.keys(this.indentImpower).forEach(key=>{
                    this.indentImpower[key] = "";
                });
            },
            keep(){
                this.$refs.indentImpower.validate(valid=>{
                    if(valid){
                        Object.keys(this.indentImpower).forEach(key=>{
                           if(typeof this.indentImpower[key] === 'string'){
                               this.indentImpower[key] = this.indentImpower[key].trim();
                           }
                        });
                        this.$http(api_token_paytm,this.indentImpower).then(res=>{
                            this.$message({type:'success', message:res.message});
                            this.show = false;
                        }).catch(code=>{
                            this.$message({type: 'error', message: code.message||code,});
                        }).finally(()=>{
                            setTimeout(() => {
                                this.$reqKey('addObtain',false);
                            }, 300)
                        })
                    }else{
                        this.$reqKey('addObtain',false)
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
        props:{
            value:{
                required:true,
                type:Boolean
            },
            title:{
                type:String
            },
            indentImpower:{
            	require:true,
                type:Object
            },
            modeData:{
                required:true,
                type:Boolean
            }
        },
        components:{
            pageDialog:require('../../../../components/page-dialog.vue').default,
        }
    }
</script>
