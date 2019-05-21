<template>
    <page-dialog v-model="visible" @open="open" @close="close" title="拦截包裹">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item label="拦截原因：" prop="reason">
                <el-select v-model="ruleForm.reason" clearable
                           placeholder="请选择拦截原因" class="s-width-large" >
                    <el-option v-for="item in reasonList"
                               :key="item.value"
                               :label="item.remark"
                               :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
                <el-input type="textarea" v-model="ruleForm.remark" :rows="4" placeholder="请输入备注"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <permission tag="request-button"
                        @click.native="sure('ruleForm')"
                        req-key="api_package_intercept"
                        class="inline ml-sm"
                        :route="apis.url_package_intercept">确定
            </permission>
            <el-button size="mini" @click.native="visible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_order_hold_reason} from "@/api/order-intercept";
    import {api_package_intercept, url_package_intercept} from "@/api/packages";

    export default {
        permission: {
            url_package_intercept
        },
        data() {
            return {
                visible: false,
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
        methods: {
            open() {
            },
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
            sure(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let data= {
                            reason:this.ruleForm.reason,
                            remark:this.ruleForm.remark,
                            package_ids:this.selectList.map(row => row.id),
                        };
                        this.$http(api_package_intercept,data).then(res=> {
                            this.$message({
                                type:"success",
                                message: res.message || res
                            });
                            this.visible = false;
                        }).catch(code => {
                            this.$message({
                                type:"error",
                                message: code.message || code
                            });
                        }).finally(()=> {
                            setTimeout(()=> {
                                this.$reqKey('api_package_intercept', false);
                            }, 200);
                        });
                    } else {
                        return false;
                    }
                });
            },
            close() {
                this.ruleForm.reason = '';
                this.ruleForm.remark = '';
            }
        },
        watch: {
            value(val) {
                this.visible = val;
            },
            visible(val) {
                this.$emit('input', val);
            }
        },
        props: {
            value: {},
            selectList: {},
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            requestButton: require('@/global-components/request-button.vue').default,
        }
    }
</script>