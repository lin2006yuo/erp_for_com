<template>
    <div class="c-batch-remark">
        <page-dialog :title="title" v-model="dialog" @open="open" size="small" :close-on-click-modal="false">
            <el-row class="mt-sm" style="text-align: center;">
                <label>到货交期统一为：</label>
                <ui-limit-number
                    v-model="number"
                    :limit="0"
                    placeholder="请输入到货交期..."
                    :min="0"
                    class="inline enter-result s-width-default"></ui-limit-number>
            </el-row>
            <div slot="footer">
                <el-button type="primary"
                           size="mini"
                           @click.native="submit"
                           class="inline">确定</el-button>
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
                number:''
            }
        },
        methods:{
            open(){
                this.number = '';
            },
            submit(){
                if(this.number===''){
                    this.$message({type:'warning',message:'请填写到货交期后再提交！'});
                    return
                }
                this.$emit('batch-setting',this.number);
            },
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
            value:{},
            title:{}
        },
        components: {
            uiLimitNumber:require('@/components/ui-limit-number').default,
            pageDialog:require('@/components/page-dialog.vue').default
        }
    }
</script>
