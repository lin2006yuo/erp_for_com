<template>
    <page-dialog title="添加货币" v-model="addDialog" size="small"
                 top="5%" :close-on-click-modal="false"  @close="close">
        <el-row>
                <el-form   :model="form"  :rules="rules" ref="ruleForm" label-width="120px">
                    <el-form-item label="货币代码：" required  prop="code">
                        <el-input class="inline" v-model="form.code"></el-input>
                    </el-form-item>
                    <el-form-item label="货币符号：" required  prop="symbol">
                        <el-input class="inline" v-model="form.symbol"></el-input>
                    </el-form-item>
                    <el-form-item label="货币名称：" required  prop="name">
                        <el-input class="inline" v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="我的汇率：" required  prop="system_rate">
                        <el-input class="inline" v-model="form.system_rate"></el-input>
                        <el-button v-if="form.code" size="mini" type="primary" @click="get_official_rate">获取官方汇率</el-button>
                    </el-form-item>
                </el-form>
        </el-row>
        <el-row slot="footer">
            <request-button @click="save" req-key="saveRate">确定</request-button>
            <el-button @click.native="cancel" size="mini">取消</el-button>
        </el-row>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>

    import {api_add,api_select} from '../../../../api/rate';
    export default{
        data(){
            return {
                addDialog:this.value,
                form:{
                    name:"",
                    code:"",
                    symbol:"",
                    system_rate:""
                },
                rules:{
                    name:[ { required: true, message: '请输入货币名称', trigger: 'blur' },],
                    code:[ { required: true, message: '请输入货币代码', trigger: 'blur' },],
                    symbol:[ { required: true, message: '请输入货币符号', trigger: 'blur' },],
                    system_rate:[ { required: true, message: '请输入汇率', trigger: 'blur' },],
                }
            }
        },
        mounted(){
            this.addDialog=this.value;
            this.init();
        },
        methods:{
            cancel(){
                this.addDialog=false;
            },
            save(){
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        this.$http(api_add, this.form).then(res=>{
                            this.addDialog = false;
                            this.$emit('update');
                        }).catch(code=>{
                            this.$message({
                                type:'error',
                                message:code.message || code
                            })
                        }).finally(()=>{
                            setTimeout(() => {
                                this.$reqKey('saveRate', false);
                            }, 300)
                        })
                    } else {
                        this.$reqKey('saveRate',false)
                    }
                });


            },
            init(){
            },
            get_official_rate(){
                this.$http(api_select, this.form.code).then(res=>{
                    this.form.system_rate = res.message;
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message||code
                    });
                })
            },
            close(){
                this.form={
                    name:"",
                    code:"",
                    symbol:"",
                    system_rate:""
                };
            }
        },
        computed:{
        },
        watch:{
            addDialog(val){
                this.$emit("input",val);
            },
            value(val){
                this.addDialog=val;
            }
        },

        props:{
            value:{},
        },
        components: {
            pageDialog:require('../../../../components/page-dialog.vue').default,
            requestButton:require('../../../../global-components/request-button').default
        }
    }
</script>
