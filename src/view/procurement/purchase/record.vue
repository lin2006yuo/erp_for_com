<template>
    <div>
        <page-dialog title="" size="large" @open="open" v-model="visible" :close-on-click-modal="false">
            <el-card>
                <p class="tracking">
                    <span>查看采购单:{{recordData.order_code}}的到货记录</span>
                </p>
                <span>
                    采购单：
                    <span class="mr-sm">{{recordData.order_code}}</span>
                    采购员：
                    <span class="mr-sm">{{recordData.purchaser}}</span>
                    状态：
                    <span>{{recordData.status | statusFilter}}</span>
                </span>
                <el-table
                        :data="recordData.skus"
                        border
                        width="100%"
                        class="mt-xs scroll-bar"
                        max-height="400">
                    <el-table-column
                            width="70"
                            label="图片">
                        <template slot-scope="scope">
                            <el-popover
                                    placement="right"
                                    trigger="hover">
                                <img v-lazy="sku_image(scope.row.thumb)"
                                     width="200px"
                                     height="200px">
                                <span slot="reference">
                                    <img v-lazy="scope.row.thumb"
                                         v-if="scope.row.thumb"
                                         height="60px" width="60px"
                                         style="border:none">
                                </span>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="SKU/别名"
                            inline-template>
                        <div>
                            <ui-tip :content="row.sku" :width="98"></ui-tip>
                            <ui-tip :content="row.sku_alias|filterAlias" :width="98"></ui-tip>
                        </div>
                    </el-table-column>
                    <el-table-column
                            width="150"
                            label="名称"
                            inline-template>
                        <div>
                            <ui-tip :content="row.sku_name" :width="98"></ui-tip>
                        </div>
                    </el-table-column>
                    <el-table-column
                            width="100"
                            label="采购数量"
                            inline-template>
                        <div>
                            <ui-tip :content="row.qty" :width="98" v-if="row.qty"></ui-tip>
                            <ui-tip :content="row.purchase_qty" :width="98" v-else></ui-tip>
                        </div>
                    </el-table-column>
                    <el-table-column
                            label="本次数量"
                            inline-template>
                        <div>
                            <ui-tip :content="row.expected_int_qty" :width="98" v-if="row.expected_int_qty"></ui-tip>
                            <ui-tip :content="row.accepted_goods_qty" :width="98" v-else></ui-tip>
                        </div>
                    </el-table-column>
                    <el-table-column
                            width="140"
                            label="到货时间"
                            inline-template>
                        <span v-if="row.arrive_time_str">{{row.arrive_time_str}}</span>
                        <span v-else>{{row.create_time | dataFilter}}</span>
                    </el-table-column>
                    <el-table-column
                            width="100"
                            label="录入员"
                            inline-template>
                        <div>
                            <ui-tip :content="row.operator_name" :width="98"></ui-tip>
                        </div>
                    </el-table-column>
                    <el-table-column
                            label="运单号"
                            inline-template>
                        <div>
                            <ui-tip :content="row.tracking_number" :width="98"></ui-tip>
                        </div>
                    </el-table-column>
                </el-table>
                <span v-if="recordData.partial_arrival_status !== 0 || recordData.status === 21"
                      class="mt-sm">操作日志</span>
                <el-table
                        v-if="recordData.partial_arrival_status !== 0 || recordData.status === 21"
                        :data="recordData.actionLog"
                        max-height="200"
                        style="width: 100%">
                    <el-table-column
                            label="备注内容"
                            inline-template>
                        <div>
                            <ui-tip :content="row.operate_content" :width="98"></ui-tip>
                        </div>
                    </el-table-column>
                    <el-table-column
                            label="操作流程"
                            width="180"
                            inline-template>
                        <div>
                            <ui-tip :content="row.status|statusFilter" :width="98"></ui-tip>
                        </div>
                    </el-table-column>
                    <el-table-column
                            prop="operater_user"
                            label="备注人"
                            width="100"
                            inline-template>
                        <div>
                            <ui-tip :content="row.operater_user" :width="98"></ui-tip>
                        </div>
                    </el-table-column>
                    <el-table-column
                            prop="operate_time"
                            inline-template
                            width="180"
                            label="备注时间">
                        <span>{{row.operate_time|dataFilter}}</span>
                    </el-table-column>
                </el-table>
                <el-row class="mt-sm" v-if="(recordData.partial_arrival_status === 0 || recordData.partial_arrival_status === 3) && recordData.status === 11 && recordData.act !== 'view'">
                    <label class="inline">采购单实际运费：</label>
                    <ui-limit-number v-model="shipping_cost"
                                     style="min-width: 50px;"
                                     placeholder="负数表示折扣金额..."
                                     :nagetive="true"
                                     :limit="3"
                                     class="inline">
                    </ui-limit-number>
                    <span class="inline">{{recordData.currency_code}}&nbsp;&nbsp;(原运费：{{recordData.shipping_cost}} {{recordData.currency_code}})</span>
                    <label class="inline ml-sm">图片附件：</label>
                    <image-upload :thumbnail-mode="true" label="上传附件" class="inline"  ref="images" :init="file"></image-upload>
                </el-row>
                <el-row>
                    <el-input
                        type="textarea"
                        class="mt-sm"
                        :autosize="{ minRows: 5, maxRows: 8}"
                        placeholder="请添加备注"
                        v-model="textarea">
                    </el-input>
                </el-row>
            </el-card>
            <div slot="footer" class="dialog-footer">
                <el-button @click="confirm"
                           v-if="recordData.act !== 'view'&&(recordData.partial_arrival_status !==2)">
                    {{recordData.partial_arrival_status | confirmBtn}}
                </el-button>
                <!--常用备注   一直存在页面-->
                <div v-if="showApproval_remark" class="remark-boxR">
                    <el-form>
                        <el-form-item label="备注信息">
                            <el-input type="textarea" v-model="approval_remark"></el-input>
                        </el-form-item>
                        <div class="fr">
                            <button class="small-button submit"
                                    type="button"
                                    @click="submit_approval">提交
                            </button>
                            <button class="small-button cancel"
                                    type="button"
                                    @click="cancel_approval">取消
                            </button>
                        </div>
                    </el-form>
                </div>
                <el-button @click="cancel">{{recordData | cancelBtn}}</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style>
    .search-table td {
        height:30px;
    }
    .search-table{
        width: 100%;
    }
    .tracking{
        position: absolute;
        top:0;
        z-index: 999;
    }
    .remark-boxR {
        width: 190px;
        height: 115px;
        position: absolute;
        bottom: 40px;
        right: 5px;
        border: 1px solid #ddd;
        border-radius: 5px;
        background-color: #fff;
        padding: 0 5px;
        z-index: 999;
    }
</style>
<script>
    import {api_not_waiting} from "@/api/purchase";
    export default {
        data(){
            return {
                visible: false,//本弹框是否显示
                showApproval_remark: false,//不审批填写备注弹框是否显示
                textarea: '',//不等待剩余备注内容
                show_remark: true,//不等待剩余备注是否显示
                approval_remark: '',//审批不通过内容
                file:[],
                shipping_cost:''
            }
        },
        filters: {
            filterAlias(val){
                return Array.isArray(val)?val.join(','):val
            },
            isFinsh(val){
                if(val === 1){
                    return "已完结";
                } else {
                    return "未完结";
                }
            },
            confirmBtn(val){
                if(val === 1){
                    return "审核通过"
                } else if(val === 0){
                    return "不等待剩余";
                } else if(val === 3){
                    return "不等待剩余";
                }
            },
            cancelBtn(val){
                if(val.act === "view" || val.partial_arrival_status !== 1){
                    return "关 闭"
                } else{
                    return "审核不通过";
                }
            },
            dataFilter(val){
                return  datef('YYYY-MM-dd HH:mm:ss', val);
            },
            statusFilter(val){
                switch (val){
                    case 10:
                        return "等待到货";
                        break;
                    case 11:
                        return "部分到货等待剩余";
                        break;
                    case 20:
                        return "部分到货不等待剩余";
                        break;
                    case 21:
                        return "全部到货";
                        break;
                    case -1:
                        return "已作废";
                        break;
                    case 5:
                        return "未申请付款";
                        break;
                    case 6:
                        return "已申请付款";
                        break;
                    case 7:
                        return "已取消付款";
                        break;
                    case 8:
                        return "已付款";
                        break;
                    case 9:
                        return "部分付款";
                        break;
                }
            },
        },
        methods: {
            open(){
                this.file = [];
                this.textarea = '';
            },
            sku_image(images){
                if(!!images){
                    return images.replace('_60x60.','_200x200.');
                }
                return ""
            },
            confirm(){
                let param = null;
                if(this.recordData.partial_arrival_status === 1){
                    param = {
                        purchase_order_id:this.recordData.purchase_order_code.slice(2),
                        action:'pass'
                    };
                } else {
                    if(this.shipping_cost === ''){
                        this.$message({
                            type: 'warning',
                            message: "采购单实际运费必填！"
                        });
                        return false;
                    }
                    if(Number(this.shipping_cost)>Number(this.recordData.shipping_cost)){
                        this.$message({
                            type: 'warning',
                            message: "采购单实际运费不能大于原运费！"
                        });
                        return false;
                    }
                    if(this.file.length===0){
                        this.$message({
                            type: 'warning',
                            message: "请提交图片附件"
                        });
                        return false;
                    }
                    if(this.file.length>0){
                        let size = this.file.map(row=>row.size).reduce((size,imgSize)=>size+=imgSize);
                        const MEGABYTE = 1048576;
                        if(size>MEGABYTE){
                            this.$message({type:'warning',message:'附件过大，请选择1M以内的图片！'});
                            return
                        }
                    }
                    if(this.textarea === ''){
                        this.$message({
                            type: 'warning',
                            message: "请填写备注信息"
                        });
                        return false;
                    }
                    param = {
                        purchase_order_id:this.recordData.purchase_order_code.slice(2),
                        remark:this.textarea,
                        file:this.file,
                        action:'apply',
                        shipping_cost:this.shipping_cost
                    }
                }
                this.$http(api_not_waiting, param).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message||res
                    });
                    this.visible = false;
                    this.$emit('update-confirm',param);
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    });
                });
            },
            cancel(){
                if(this.recordData.act !== "view" && this.recordData.partial_arrival_status === 1){
                    this.showApproval_remark = true;
                } else {
                    this.visible = false;
                }
            },
            submit_approval(){
                if(this.approval_remark === ''){
                    this.$message({
                        type: 'warning',
                        message: "请填写备注信息"
                    });
                    return false;
                }
                let param = {
                    purchase_order_id:this.recordData.purchase_order_code.slice(2),
                    remark:this.approval_remark,
                    action:'refuse'
                };
                this.$http(api_not_waiting, param).then(res => {
                    this.$message({
                        type: 'success',
                        message:  res.message||res
                    });
                    this.visible = false;
                    this.$emit('update-confirm',param);
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            cancel_approval(){
                this.showApproval_remark = false;
            }
        },
        watch: {
            visible(val){
                this.$emit('input',val);
                this.showApproval_remark = false;
            },
            value(val) {
                this.visible = val;
            },
        },
        props: {
            value:{},
            recordData:{
                required:true,
                type:Object
            },
        },
        components: {
            pageDialog:require("@/components/page-dialog.vue").default,
            imageUpload:require("../../customer-service/smt/inbox/image-upload.vue").default,
            uiTip: require('@/components/ui-tip.vue').default,
            uiLimitNumber: require("@/components/ui-limit-number.vue").default,
        },
    }
</script>
