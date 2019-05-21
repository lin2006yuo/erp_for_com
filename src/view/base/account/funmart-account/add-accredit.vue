<template>
    <page-dialog :title="title" v-model="show" size="small" @open="open" @close="close" :close-on-cilck-modal="false">
        <el-form :model="indentImpower"
                 label-width="190px"
                 ref="indentImpower"
                 :rules="rules">
            <el-form-item label="name：" prop="name">
                <el-col :span="14">
                    <el-input v-model="indentImpower.name"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="phone：" prop="phone">
                <el-col :span="14">
                    <el-input v-model="indentImpower.phone" disabled></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="email：" prop="email">
                <el-col :span="14">
                    <el-input v-model="indentImpower.email" disabled></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="secrect：" prop="secrect">
                <el-col :span="14">
                    <el-input v-model="indentImpower.secrect"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label=" appkey：" prop="appkey">
                <el-col :span="14">
                    <el-input v-model="indentImpower.appkey"></el-input>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <request-button req-key="addImpower" @click.native="keep">获取token</request-button>
            <el-button size="mini" @click.native="show=false">取 消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_funmart_authorize} from '@/api/funmart-account';
    export default{
        data(){
            return{
                show:this.value,
                rules:{
                    name:[
                        {required: true, message: 'name必填项', trigger: 'change'}
                    ],
                    phone:[
                        {required: true, message: 'phone为必填项', trigger: 'change' }
                    ],
                    email:[
                        {required: true, message: 'email为必填项', trigger: 'change' }
                    ],
                    secrect:[
                        {required: true, message: 'secrect为必填项', trigger: 'change' }
                    ],
                    appkey:[
                        {required: true, message: 'appkey为必填项', trigger: 'change' }
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
                    if(valid) {
                        this.$http(api_funmart_authorize,this.indentImpower.id, this.indentImpower).then(res => {
                            this.$message({type: 'success', message: res.message});
                            this.$emit('submit');
                            this.show = false;
                        }).catch(code => {
                            this.$message({type: 'error', message: code.message || code,});
                        }).finally(() => {
                            setTimeout(() => {
                                this.$reqKey('addImpower', false);
                            }, 300)
                        });
                    }else{
                        this.$reqKey('addImpower', false);
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
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
        }
    }
</script>
