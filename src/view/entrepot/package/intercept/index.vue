<template>
    <page-dialog title="拦截包裹" v-model="show" size="small" :close-on-click-modal="false">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item label="拦截原因：" prop="reason">
                <el-select v-model="ruleForm.reason" clearable placeholder="请选择拦截原因" style="width:160px" >
                    <el-option v-for="item in reasonList" :key="item.value" :label="item.remark" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
                <el-input type="textarea" v-model="ruleForm.remark" :rows="4" placeholder="请输入备注" style="width:270px"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button type="primary" size="mini" @click.native="submit_form('ruleForm')">确定</el-button>
            <el-button size="mini" @click="show = false">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
</style>
<script>
    import labelItem from '../../../../components/label-item.vue';
    import {api_order_hold_reason,api_order_hold_status} from "../../../../api/order-intercept";
    export default{
        data(){
            return {
                show:this.value,
                reasonList:[],
                ruleForm: {
                    reason: '',
                    remark: '',
                },
                rules: {
                    reason: [
                        { required: true, message: '请选择拦截原因', trigger: 'change' }
                    ],
                    remark: []
                }
            }
        },
        mounted(){
            this.get_reason();
        },
        methods:{
            get_reason(){
                this.$http(api_order_hold_reason).then(res=> {
                    this.reasonList = res;
                }).catch(code => {
                    this.$message({
                        type:"error",
                        message: code.message || code
                    });
                });
            },
            submit_form(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                    	let data= {
                            reason:this.ruleForm.reason,
                            remark:this.ruleForm.remark,
                            package_id:this.packageId,
                        }
                        this.$http(api_order_hold_status,data).then(res=> {
                            this.$message({
                                type:"success",
                                message: res.message || res
                            });
                            this.show = false;
                        }).catch(code => {
                            this.$message({
                                type:"error",
                                message: code.message || code
                            });
                        });
                    } else {
                        return false;
                    }
                });
            },
        },
        computed:{

        },
        watch: {
            value(val){
                this.show = val;
                if(!!val){
                    this.ruleForm = {
                        reason: '',
                        remark: '',
                    };
                }
            },
            show(val){
                this.$emit('input', val);
            },
        },
        props: {
            value:{
                required:true,
            },
            packageId:{
                required:true,
            }
        },
        components: {
            labelItem,
            pageDialog: require('../../../../components/page-dialog.vue').default
        }
    }
</script>
