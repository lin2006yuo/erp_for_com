<template>
    <page-dialog :title="title" v-model="show" size="small" @open="open" @close="close" :close-on-cilck-modal="false">
        <el-form :model="indentImpower"
                 label-width="190px"
                 ref="indentImpower"
                 :rules="rules">
            <el-form-item label="API秘钥：" prop="token_key">
                <el-col :span="14">
                    <el-input v-model="indentImpower.token_key"></el-input>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <request-button req-key="addImpower" @click.native="keep">确 定</request-button>
            <el-button size="mini" @click.native="show=false">取 消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_oberlo_authorize} from '@/api/oberlo-account';
    export default{
        data(){
            return{
                show:this.value,
                rules:{
                    token_key:[
                        {required: true, message: 'API账户必填项', trigger: 'change'}
                    ]
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
                this.$refs.indentImpower.validate(valid=> {
                    if (valid) {
                        this.$http(api_oberlo_authorize, this.indentImpower).then(res => {
                            this.$message({type: 'success', message: res.message});
                            this.$emit('submit');
                            this.show = false;
                        }).catch(code => {
                            this.$message({type: 'error', message: code.message || code,});
                        }).finally(() => {
                            setTimeout(() => {
                                this.$reqKey('addImpower', false);
                            }, 300)
                        })
                    }else {
                        this.$reqKey('addImpower',false)
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
