<template>
    <div class="c-batch-buyer">
        <page-dialog :title="title" v-model="dialog" size="small" :close-on-click-modal="false">
            <div class="label-buyer">
                <label-item class="label-buyer-item inline mt-md mb-md" label="选择新采购员：">
                    <purchaser class="inline s-width-default"
                               ref="purchaser"
                               v-model="purchaser_id"
                               default-first-option>
                    </purchaser>
                </label-item>
            </div>
            <div slot="footer">
                <request-button type="primary"
                                req-key="set_buyer"
                           @click.native="submit"
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
                purchaser_id:''
            }
        },
        methods:{
            submit(){
                if(!this.purchaser_id){
                    this.$reqKey('set_buyer',false);
                    return this.$message({type:"warning",message:'请选择采购员！'});
                }
                this.$emit('submit',this.purchaser_id,this.$refs.purchaser.filter);
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
                    this.purchaser_id = '';
                }
            },
        },
        props:{
            value:{},
            title:{}
        },
        components: {
            pageDialog:require('../../../components/page-dialog.vue').default,
            paramAccount:require('../../../api-components/param-account.vue').default,
            labelItem:require('../../../components/label-item.vue').default,
            purchaser:require('../../../api-components/purchaser.vue').default,
        }
    }
</script>
