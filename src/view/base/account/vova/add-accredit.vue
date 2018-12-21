<template>
    <page-dialog :title="title" v-model="show" size="small" @open="open" @cloce="cloce" :close-on-cilck-modal="false">
        <el-form :model="indentImpower"
                 label-width="190px"
                 ref="indentImpower"
                 :rules="rules">
            <el-form-item label="账号ID：" prop="access_key_id">
                <el-col :span="14">
                    <el-input v-model="indentImpower.access_key_id"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="账号秘钥：" prop="secret_key">
                <el-col :span="14">
                    <el-input v-model="indentImpower.secret_key"></el-input>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <request-button req-key="addVova" @click.native="keep">获取token</request-button>
            <el-button size="mini" @click.native="show=false">关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    export default{
        data(){
            return{
                show:this.value,
                rules:{
                    access_key_id:[
                        {required: true, message: '订单授权账号ID必填项', trigger: 'change'}
                    ],
                    secret_key:[
                        {required: true, message: '订单授权账号秘钥为必填项', trigger: 'change' }
                    ],
                },
            }
        },
        methods:{
            open(){

            },
            cloce(){

            },
            keep(){
                this.$emit('add-impower');
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
