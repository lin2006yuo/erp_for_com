<template>
    <page-dialog :title="title" v-model="show" size="small" @open="open" @cloce="cloce" :close-on-cilck-modal="false">
        <el-form :model="commodityImpower"
                 label-width="190px"
                 ref="commodityImpower"
                 :rules="rules">
            <el-form-item label="账号ID：" prop="client_id">
                <el-col :span="14">
                    <el-input v-model="commodityImpower.client_id"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="账号秘钥：" prop="client_secret">
                <el-col :span="14">
                    <el-input v-model="commodityImpower.client_secret"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="实时Code：" prop="updateCode">
                <el-col :span="14">
                    <el-input v-model="updateCode"></el-input>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <request-button req-key="addGain" @click.native="keep">获取token</request-button>
            <el-button size="mini" @click.native="cloce">关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_authori} from '@/api/yandex';
    export default{
        data(){
            return{
                show:this.value,
                updateCode:'',
                rules:{
                    client_id:[
                        {required: true, message: '账号ID为必填项', trigger: 'change'}
                    ],
                    client_secret:[
                        {required: true, message: '商品授权账号秘钥为必填项', trigger: 'change' }
                    ],
                    updateCode:[
                        {required:true,message:'实时Code为必填',trigger:'change'}
                    ]
                },
            }
        },
        methods:{
            open(){

            },
            cloce(){
                this.show=false
                this.updateCode=''
            },
            keep(){
                Object.keys(this.commodityImpower).forEach(key=>{
                    if(typeof this.commodityImpower[key] === 'string'){
                        this.commodityImpower[key] = this.commodityImpower[key].trim();
                    }
                });
                let code = {codes:this.updateCode}
                let params = Object.assign(this.commodityImpower,code)
                this.$http(api_authori,params).then(res=>{
                    this.$message({type:'success', message:res.message
                    });
                    this.show = false;
                }).catch(code=>{
                    this.$message({type: 'error', message: code.message||code,
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
