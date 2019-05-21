<template>
    <el-row class="invoice-rules">
        <page-dialog :title="`选择发票规则`" v-model="rulesDialog" width="30%" >
            <el-form class="mt-sm">
                <el-form-item label="选择发票规则：">
                    <el-select v-model="rule_id"
                               class="inline mr-sm"
                               style="width: 240px;"
                               filterable clearable>
                        <el-option
                            :key="item.id"
                            v-for="item in rulesList"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button  @click="click_button" type="primary" size="mini">确 定</el-button>
            </div>
        </page-dialog>
    </el-row>
</template>
<style lang="stylus">
    .invoice-rules{
    }
</style>
<script>
    export default{
        data(){
            return {
                rulesDialog: false,
                rule_id: 0
            }
        },
        watch:{
            rulesDialog(val){
                this.$emit("input",val)
            },
            value(val){
                this.rulesDialog = val
            }

        },
        mounted(){
            this.rulesDialog = this.value;
        },
        methods: {
            click_button(){
                this.$emit('sure_click',this.rule_id);
            }
        },
        props:{
            value:{},
            rulesList:{
                required:true,
                type:Array
            }
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default,
            uiTip:require('@/components/ui-tip').default,
        }
    }
</script>
