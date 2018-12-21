<template>
    <page-dialog :title="title" v-model="show" size="small" @open="open" @cloce="cloce" :close-on-cilck-modal="false">
        <el-form :model="commodityImpower"
                 label-width="190px"
                 ref="commodityImpower"
                 :rules="rules">
            <el-form-item label="账号ID：" prop="client_id_cat">
                <el-col :span="14">
                    <el-input v-model="commodityImpower.client_id_cat"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="商品授权账号秘钥：" prop="client_secret_cat">
                <el-col :span="14">
                    <el-input v-model="commodityImpower.client_secret_cat"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="Paytm账号：">
                <el-col :span="14">
                    <el-input disabled v-model="commodityImpower.account_name"></el-input>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <request-button req-key="addGain" @click.native="keep">获取token</request-button>
            <el-button size="mini" @click.native="show=false">关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_tokencat_paytm} from '../../../../api/paytm';
    export default{
        data(){
            return{
                show:this.value,
                rules:{
                    client_id_cat:[
                        {required: true, message: '账号ID为必填项', trigger: 'change'}
                    ],
                    client_secret_cat:[
                        {required: true, message: '商品授权账号秘钥为必填项', trigger: 'change' }
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
                this.commodityImpower.client_id_cat = this.commodityImpower.client_id_cat.trim();
                this.commodityImpower.client_secret_cat = this.commodityImpower.client_secret_cat.trim();
                this.$http(api_tokencat_paytm,this.commodityImpower).then(res=>{
                    this.$message({
                        type:'success',
                        message:res.message
                    });
                    this.show = false;
                }).catch(code=>{
                    this.$message({
                        type: 'error',
                        message: code.message||code,
                    });
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('addGain',false);
                    }, 300)
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
            commodityImpower:{
                require:true,
                type:Object,
            }
        },
        components:{
            pageDialog:require('../../../../components/page-dialog.vue').default,
        }
    }
</script>
