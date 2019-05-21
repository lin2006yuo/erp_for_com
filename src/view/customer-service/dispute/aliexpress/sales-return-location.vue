<template>
    <page-dialog :title="title" v-model="show" @open="open" :close-on-click-modal="false">
        <div class="mt-sm ml-sm mr-sm">
            <div>注意：当双方都同意后，纠纷将会按照该方案执行，同意后无法取消，请确认是否同意该方案？</div>
            <div class="mb-sm">
                <label>退货地址：</label>
                <el-select v-model="return_address_id" filterable style="width: 440px;" placeholder="请选择" class="inline">
                    <el-option
                        :key="item.value"
                        v-for="item in locationList"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <request-button size="mini" @click.native="submit" req-key="api_post_ali_issue_add_solution" type="primary">提交</request-button>
            <el-button size="mini" @click.native="close">关 闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {
        api_dispute_cancel,
        api_dispute_inquiry,
        api_dispute_return,
        api_dispute_reasons,
        api_dispute_case,
        api_ali_issue_agree_solution,
        url_post_ali_issue_add_solution,
        api_ali_issue_get_process_id,
        api_ali_issue_get_refund_address_id
    } from '../../../../api/dispute'
    export default {
        data() {
            return {
                show: this.value,
                return_address_id:''
            }
        },
        methods: {
            open(){
                this.return_address_id = '';
            },
            submit() {
                if(this.return_address_id===''){
                    this.$reqKey('api_ali_issue_agree_solution',false);
                    return this.$message({type:'warning',message:'请选择退货地址！'});
                }
                this.$http(api_ali_issue_agree_solution,{solution_id:this.solutionId,return_address_id:this.return_address_id}).then(res=>{
                    this.$message({type:'success',message:res.message||res});
                    this.show = false;
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('api_ali_issue_agree_solution',false);
                    },200);
                });
            },
            close(){
                this.show = false;
            }
        },
        watch: {
            show(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.show = val;
            }
        },
        props: {
            value: {
                required: true,
                type: Boolean
            },
            title: {
                type: String
            },
            locationList:{
                type:Array,
                required:true
            },
            solutionId:{
                type:String,
                required:true
            }
        },
        components: {
            pageDialog: require('../../../../components/page-dialog.vue').default,
        }
    }
</script>
