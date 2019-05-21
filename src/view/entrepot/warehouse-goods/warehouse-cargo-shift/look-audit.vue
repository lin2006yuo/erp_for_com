<template>
    <page-dialog :title="action.title"
                 size="large"
                 @open="open"
                 class="p-warehouse-cargo-shift"
                 v-model="visible"
                 :close-on-click-modal="false">
        <table class="right-table mt-sm" cellpadding="0" cellspacing="0">
            <tr>
                <td width="150">上架单号</td>
                <td width="150">{{formData.code}}</td>
                <td width="150">总数</td>
                <td width="150">{{formData.total_quantity}}</td>
                <td widht="150">状态</td>
                <td width="150">{{formData.status | statusFilter}}</td>
            </tr>
            <tr>
                <td width="150">创建人</td>
                <td width="150">{{formData.creator}}</td>
                <td width="150">创建时间</td>
                <td width="150">{{formData.create_time | filterTime}}</td>
                <td width="150"></td>
                <td width="150"></td>
            </tr>
            <tr>
                <td width="150">审核人</td>
                <td width="150">{{formData.auditor}}</td>
                <td width="150">审核时间</td>
                <td width="150">{{formData.audit_time| filterTime}}</td>
                <td width="150">审核备注</td>
                <td width="150">{{formData.remark}}</td>
            </tr>
            <tr>
                <td width="150">操作人</td>
                <td width="150">{{formData.shift_id}}</td>
                <td width="150">开始时间</td>
                <td width="150">{{formData.start_time | filterTime}}</td>
                <td width="150">结束时间</td>
                <td width="150">{{formData.end_time | filterTime}}</td>
            </tr>
        </table>
        <div class="border-box mt-sm">
            <el-table
                    :data="formData.details"
                    height="400"
                    class="scroll-bar"
                    highlightCurrentRow>
                <el-table-column
                        inline-template
                        label="图片">
                    <div>
                        <el-popover
                                placement="right"
                                width="200"
                                trigger="hover">
                            <img v-lazy="sku_image(row.thumb)" width="200px" height="200px">
                            <div slot="reference">
                                <img v-lazy="row.thumb" width="60" height="60" style="vertical-align: middle;">
                            </div>
                        </el-popover>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        label="SKU">
                    <div>
                        <ui-tip :content="row.sku" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        label="商品名称">
                    <div>
                        <span>{{row.spu_name}}</span>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        label="数量">
                    <div>
                        <ui-tip :content="row.quantity" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        label="原货位">
                    <div>
                        <ui-tip :content="row.old_code" :width="98"></ui-tip>
                    </div>
                </el-table-column>
                <el-table-column
                        inline-template
                        label="新货位">
                    <div>
                        <ui-tip :content="row.new_code" :width="98"></ui-tip>
                    </div>
                </el-table-column>
            </el-table>
        </div>
        <div class="mt-sm" v-if="action.operation === 'audit'">
            <label>备注：</label>
            <el-input v-model="remark" placeholder="审核不通过时，备注为必填" type="textarea" :rows="4"></el-input>
        </div>
        <div slot="footer">
            <el-button size="mini"
                       @click="visible = false"
                       v-if="action.operation === 'look'">关闭</el-button>
            <div v-else>
                <el-button size="mini"
                           type="primary"
                           @click.native="audit_pass">审核通过</el-button>
                <el-button size="mini"
                           @click.native="audit_reject">审核不通过</el-button>
            </div>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .p-warehouse-cargo-shift{
        .border-box{
            border-left:1px solid #d3dce6;
            border-top:1px solid #d3dce6;
            border-right:1px solid #d3dce6;
        }
        .right-table{
            width: 100%;
            border:1px solid #d3dce6;
            td{
                text-align: center;
                border-bottom:1px solid #d3dce6;
                border-right:1px solid #d3dce6;
                height:26px;
            }
            td:nth-child(2n+1){
                background-color: #f5f7fa;
            }
        }
    }
</style>
<script>
    export default {
        data(){
            return {
                visible: false,
                remark:''
            }
        },
        filters:{
            filterTime(val){
                return datef("YYYY-MM-dd HH:mm:ss", val);
            },
            statusFilter(val){
                const statusName = new Map()
                    .set(-1, '作废')
                    .set(0, '待审核')
                    .set(1, '待处理')
                    .set(2, '移位中')
                    .set(3, '已完成');
                return statusName.get(val)
            }
        },
        methods: {
            open(){
                this.remark = ''
            },
            sku_image(image){
                return image.replace('60x60', '200x200');
            },
            //审核通过
            audit_pass(){
                this.$emit('single-audit', this.formData, this.remark, 'pass')
            },
            //审核不通过
            audit_reject(){
                if(!this.remark){
                    this.$message({type: 'warning', message: '审核不通过时必须填写备注'});
                    return
                }
                this.$emit('single-audit', this.formData, this.remark, 'reject')
            }
        },
        watch: {
            visible(val){
                this.$emit('input', val);
            },
            value(val) {
                this.visible = val;
            },
        },
        props: {
            value:{
                type: Boolean,
                required: true
            },
            action:{
                type: Object,
                required: true
            },
            formData:{
                type: Object,
                required: true
            },
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default,
            uiTip:require('@/components/ui-tip.vue').default
        },
    }
</script>
