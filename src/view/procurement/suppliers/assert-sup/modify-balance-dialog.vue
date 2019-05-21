<template>
    <div class="c-batch-remark">
        <page-dialog :title="`批量修改结算方式`" v-model="dialog" @open="open" size="small" :close-on-click-modal="false">
            <div style="text-align: center">
                <el-form :model="form" ref="form" :rules="rules">
                    <el-row class="mt-sm">
                        <el-form-item prop="balance_type">
                            <label>修改结算方式为：</label>
                            <el-select v-model="form.balance_type" class="inline" ref="balance_type">
                                <el-option v-for="(item, index) in balanceLists" :key="index" :label="item.name"
                                           :value="item.label"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
                </el-form>
            </div>
            <div slot="footer">
                <request-button req-key="update_balance_type" :mintime="200" @click.native="submit">确定</request-button>
                <el-button size="mini"
                           @click.native="dialog = false"
                           class="inline">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    export default {
        data() {
            return {
                dialog:this.value,
                rules:{
                    balance_type:[{required: "true", message: "请选择要修改的结算方式", trigger: "blur",type:'number'}]
                }
            }
        },
        methods:{
            open(){

            },
            submit(){
                this.$emit('submit',this.$refs.balance_type._data.selectedLabel);
            },
        },
        computed:{
            balanceLists(){
                let data=this.balanceList.concat();
                data.splice(1,2);
                return data
            }
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
            },
        },
        props:{
            value:{
                required:true,
                type:Boolean
            },
            form:{
                required:true,
                type:Object
            },
            balanceList:{

            }
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default,
            labelItem:require('@/components/label-item').default,
            purchaser:require('@/api-components/purchaser').default,
        }
    }
</script>
