<template>
    <page-dialog title="设置备货周期" v-model="formVisible"
                 size="small"
                 :close-on-click-modal="false">
        <el-form :model="formData"
                 ref="formData"
                 label-width="200px">
            <el-form-item label="采购交期：">
                <el-col :span="20">
                    <ui-limit-number v-model="formData.purchase_delivery" class="inline" style="width:120px;"
                                     :limit="1"></ui-limit-number>
                </el-col>
            </el-form-item>

            <el-form-item label="内耗天数：">
                <el-col :span="20">
                    <ui-limit-number v-model="formData.internal_friction_days" class="inline" style="width:120px;"
                                     :limit="1"></ui-limit-number>
                </el-col>
            </el-form-item>

            <el-form-item label="FBA在途天数：">
                <el-col :span="20">
                    <ui-limit-number v-model="formData.intransit_days" class="inline" style="width:120px;"
                                     :limit="1"></ui-limit-number>
                </el-col>
            </el-form-item>

            <el-form-item label="FBA安全库存天数：">
                <el-col :span="20">
                    <ui-limit-number v-model="formData.safe_inventory_days" class="inline" style="width:120px;"
                                     :limit="1"></ui-limit-number>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="confirm" type="primary">确定</el-button>
            <el-button size="mini" @click.native="formVisible = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    export default{
        data(){
            return {
                formVisible:false
            }
        },
        methods:{
            confirm(){
                this.$emit('set-stock-cycle')
            }
        },
        watch:{
            formVisible(val){
                this.$emit('input',val)
            },
            value(val){
                this.formVisible = val;
            },
        },
        props:{
            value: {},
            formData: {}
        },
        components: {
            pageDialog: require('@/components/page-dialog').default,
            uiLimitNumber: require('@/components/ui-limit-number').default
        }
    }
</script>
