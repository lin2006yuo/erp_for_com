<template>
    <div class="c-batch-buyer">
        <page-dialog :title="title" v-model="dialog" size="small" :close-on-click-modal="false" @open="open">
            <div class="label-buyer">
                <el-form :model="data" ref="numberValidateForm">
                        <el-form-item label="修改采购员为：" prop="purchaser_id" class="form_purchaser"
                                      :rules="[
                                          { required: true, message: '采购员名称不能为空',type:'array', trigger: 'blur,change'},
                                        ]"
                        >
                            <el-cascader
                                filterable
                                clearable
                                placeholder="请选择/搜索"
                                class="inline"
                                change-on-select
                                ref="purchaser"
                                expand-trigger="hover"
                                v-model="data.purchaser_id"
                                :options="purchase"
                            ></el-cascader>
                        </el-form-item>
                </el-form>
            </div>
            <div slot="footer">
                <request-button type="primary"
                                req-key="set_buyer"
                           @click.native="submit('numberValidateForm')"
                           class="inline">确定</request-button>
                <el-button size="mini"
                           @click.native="dialog = false"
                           class="inline">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .c-batch-buyer{

        .label-buyer{
            text-align center;
            .el-form-item__content {
                line-height 0;
            }
            .form_purchaser{
                display :flex;
                flex-flow :row wrap;
                justify-content :center;
                align-items :center;
            }
            .label-buyer-item{
                margin-left -40px;
            }
        }
    }
</style>
<script>
    export default {
        data() {
            return {
                dialog:this.value,
                data:{
                    purchaser_id:[],
                },
            }
        },
        methods:{
            open(){

            },
            submit(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(!this.data.purchaser_id){
                            this.$reqKey('set_buyer',false);
                            return this.$message({type:"warning",message:'请选择采购员！'});
                        }
                        this.$emit('submit',this.data.purchaser_id,this.$refs.purchaser.currentLabels[0]);
                    } else {
                       this.$message({type:"warning",message:'请选择采购员！'});
                        this.$reqKey('set_buyer',false);
                    }
                });
            },
        },
        computed:{
            purchase(){
                return this.purchaseList.splice(1,this.purchaseList.length-1);
            },
        },
        watch:{
            dialog(val){
                this.$reqKey('set_buyer',false);
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
                if(val){
                    this.data.purchaser_id = [];
                }
            },
        },
        props:{
            value:{},
            title:{},
            purchaseList:{}
        },
        components: {
            pageDialog:require('../../../components/page-dialog.vue').default,
            paramAccount:require('../../../api-components/param-account.vue').default,
            labelItem:require('../../../components/label-item.vue').default,
            labelSelect: require('@/components/label-select').default,
        }
    }
</script>
