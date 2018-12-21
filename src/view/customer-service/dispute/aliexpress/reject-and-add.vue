<template>
    <page-dialog :title="title" v-model="show" @open="open" :close-on-click-modal="false">
        <div class="ml-sm mr-sm">
            <div class="mt-xs">注意：若您只想保留一个方案，请直接“修改”原有方案。</div>
            <div class="mt-xs">
                <label>您期望的解决方案</label>
                <div class="mt-xs">
                    <el-radio-group v-model="editData.solution_type">
                        <el-radio :label="`refund`">仅退款/拒绝退款</el-radio>
                        <br>
                        <el-radio :disabled="isRefund" :label="`return_and_refund`">退货退款</el-radio>
                    </el-radio-group>
                </div>
            </div>
            <div v-if="!isRefund&&editData.solution_type==='return_and_refund'" class="mb-sm">
                <label>退货地址：</label>
                <el-select v-model="editData.return_address_id" filterable style="width: 440px;" placeholder="请选择" class="inline">
                    <el-option
                        :key="item.value"
                        v-for="item in locationList"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="mt-xs">
                <label>退款金额  USD</label>
                <ui-limit-number v-model="editData.refund_money_post"
                                 style="width:80px"
                                 :limit="4"
                                 class="inline"
                                 :min="0">
                </ui-limit-number>
            </div>
            <div class="mt-mini">
                金额范围为 <span style="color: red;">0.00 - {{disputeData.refund_money_max}}</span>,  拒绝退款请填写0<br>
                汇率转换后 {{disputeData.refund_money_max_local_currency}} 0.00 - {{disputeData.refund_money_max_local}}
            </div>
            <div class="mt-xs">
                <label>请详细描述您的问题（必填）:</label>
                <el-input
                    type="textarea"
                    :rows="3"
                    :maxlength="500"
                    :minlength="5"
                    placeholder="必填，5-500字符。请填写方案备注或其它要求。"
                    v-model="editData.content">
                </el-input>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <request-button @click.native="submit" req-key="api_post_ali_issue_add_solution">提交</request-button>
            <el-button size="mini" @click.native="close">关 闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_post_ali_issue_add_solution,api_post_ali_issue_edit_solution} from '../../../../api/dispute'
    export default {
        data() {
            return {
                show: this.value,
            }
        },
        methods: {
            open(){},
            submit() {
                if(this.editData.solution_type===''){
                    this.$reqKey('api_post_ali_issue_add_solution',false);
                    return this.$message({type:'warning',message:'请填选择解决方案！'});
                }
                if(this.editData.refund_money_post.trim()===''){
                    this.$reqKey('api_post_ali_issue_add_solution',false);
                    return this.$message({type:'warning',message:'请填写退款金额！'});
                }
                if(this.editData.content.trim()===''){
                    this.$reqKey('api_post_ali_issue_add_solution',false);
                    return this.$message({type:'warning',message:'请填写方案备注或其它要求！'});
                }else if(this.editData.content.trim().length<5||this.editData.content.trim().length>500){
                    this.$reqKey('api_post_ali_issue_add_solution',false);
                    return this.$message({type:'warning',message:'方案备注或要求需在5~500字符内！'});
                }
                if(this.editData.solution_type==='return_and_refund'&&this.editData.return_address_id===''){
                    this.$reqKey('api_post_ali_issue_add_solution',false);
                    return this.$message({type:'warning',message:'请选择退货地址！'});
                }
                let data = {
                    buyer_login_id:this.disputeData.buyer_login_id,
                    issue_id:this.disputeData.issue_id,
                    refund_amount:this.editData.refund_money_post.trim(),
                    refund_amount_currency:'USD',
                    solution_context:this.editData.content.trim(),
                    add_solution_type:this.editData.solution_type
                };
                this.editData.solution_type==='return_and_refund'&&(data.return_good_address_id = this.editData.return_address_id);
                if(this.isEdit){
                    data.modify_seller_solution_id = this.disputeData.solution.seller.find(row=>row.solution_id).solution_id;
                }else{
                    data.buyer_solution_id = this.disputeData.solution.buyer.find(row=>row.is_default===1).solution_id;
                }
                let url = this.isEdit?api_post_ali_issue_edit_solution:api_post_ali_issue_add_solution;
                this.$http(url,data).then(res=>{
                    this.$message({type:'success',message:res.message||res});
                    this.show = false;
                    this.$emit('has-solution-add',res.data);
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('api_post_ali_issue_add_solution',false);
                    },200);
                });
            },
            close(){
                this.show = false;
            }
        },
        computed:{
            isEdit(){
                return this.editData.type==='edit'
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
            disputeData:{
                type:Object
            },
            editData:{},
            isRefund:{
                type:Boolean,
                required:true
            },
            locationList:{
                type:Array,
                required:true
            }
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            uiLimitNumber:require('@/components/ui-limit-number').default,
        }
    }
</script>
