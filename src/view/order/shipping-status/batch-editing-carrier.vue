<template>
    <div class="c-batch-editing-carrier">
        <page-dialog :title="'批量修改Carrier'" v-model="dialog" :loading="loading" @open="open" :width="`500px`" :close-on-click-modal="false">
            <div class="c-batch-editing-carrier-item">
                <div class="inline c-batch-editing-carrier-mark">*</div>
                <label-item label="上传Carrier：" class="inline mr-sm">
                    <el-input v-model="uploadingCarrier" placeholder="请输入Carrier" ></el-input>
                </label-item>
            </div>
            <div slot="footer">
                <request-button
                    :mintime="200"
                    req-key="url_orders_batch_change_warehouse"
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
    .c-batch-editing-carrier{
        .c-batch-editing-carrier-item{
            margin: 10px;
            margin-left: 110px;
            .c-batch-editing-carrier-mark{
                position: relative;
                top: 6px;
                color: red;
            }
        }
    }
</style>
<script>
    import {api_get_warehouse} from '../../../api/common';
    export default {
        data() {
            return {
                dialog:this.value,
                loading:false,
                uploadingCarrier:''
            }
        },
        methods:{
            open(){
                this.uploadingCarrier = '';
            },
            submit(){
                this.$reqKey('url_orders_batch_change_warehouse',false);
                if(!this.uploadingCarrier.trim()){
                    return this.$message({type:"warning",message:'请填写上传Carrier！'});
                }
                this.$emit('submit',this.uploadingCarrier.trim());
            },
        },
        watch:{
            dialog(val){
                this.$reqKey('url_batch_remark',false);
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
            },
        },
        props:{
            value:{}
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default,
            labelItem:require('@/components/label-item').default
        }
    }
</script>
