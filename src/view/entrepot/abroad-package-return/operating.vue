<template>
    <page-dialog :title="action.title"
                 size="large"
                 v-model="visible"
                 class="p-parcel-returned-manage"
                 :close-on-click-modal="false">
        <table class="right-table" cellpadding="0" cellspacing="0">
            <tr>
                <td width="150">退货单号</td>
                <td width="150">{{operatingData.return_number}}</td>
                <td width="150">跟踪号</td>
                <td width="150">{{operatingData.shipping_number}}</td>
            </tr>
            <tr>
                <td width="150">退款类型</td>
                <td width="150">{{operatingData.return_type}}</td>
                <td width="150">创建时间</td>
                <td width="150">{{operatingData.create_time}}</td>
            </tr>
            <tr>
                <td width="150">退货原因</td>
                <td colspan="3">{{operatingData.return_reason}}</td>
            </tr>
        </table>
        <tab-item label="包裹信息" :def="true" class="mt-sm" id="package" v-if="!!operatingData.package">
            <table class="right-table" cellpadding="0" cellspacing="0">
                <tr>
                    <td width="150">包裹号</td>
                    <td width="150">
                        <ui-tip :is-operate="true"
                                :content="operatingData.package.package_number"
                                :width="98"
                                @cur-click="parcel_information(operatingData.package)">
                        </ui-tip>
                    </td>
                    <td width="150">订单号</td>
                    <td width="150">
                        <ui-tip :is-operate="true"
                                :content="operatingData.package.order_number"
                                :width="98"
                                @cur-click="show_order(operatingData.package)">
                        </ui-tip>
                    </td>
                </tr>
                <tr>
                    <td width="150">平台</td>
                    <td width="150">{{operatingData.package.channel_name}}</td>
                    <td width="150">站点</td>
                    <td width="150">{{operatingData.package.site_code}}</td>
                </tr>
                <tr>
                    <td width="150">邮寄方式</td>
                    <td width="150">{{operatingData.package.shipping_name}}</td>
                    <td width="150">国家</td>
                    <td width="150">{{operatingData.package.country_code}}</td>
                </tr>
                <tr>
                    <td width="150">发货仓库</td>
                    <td width="150">{{operatingData.package.warehouse_name}}</td>
                    <td width="150">发货时间 </td>
                    <td width="150">{{operatingData.package.shipping_time | filterTime}}</td>
                </tr>
            </table>
        </tab-item>
        <tab-item label="已退回的商品信息" :def="true" class="mt-sm" id="info">
            <el-table
                :data="operatingData.detail"
                height="120"
                v-loading="loading"
                element-loading-text="玩命加载中"
                class="scroll-bar"
                highlight-current-row>
                <el-table-column

                    label="SKU"
                    prop="sku"
                >
                </el-table-column>
                <el-table-column

                    label="商品名称"
                    prop="spu_name"
                >
                </el-table-column>
                <el-table-column

                    label="图片"
                    prop="pic"
                    width="40"
                >
                    <template slot-scope="scope">
                        <el-popover
                            placement="right"
                            trigger="hover">
                            <img :src="scope.row.thumb" width="150px" height="150px">
                            <span slot="reference">
                                    <img :src="scope.row.thumb" v-if="scope.row.thumb" height="26px" width="26px" style="border:none;vertical-align: middle">
                                </span>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column

                    label="单价"
                    prop="sku_price"
                >
                </el-table-column>
                <el-table-column

                    label="总数量"
                    prop="quantity"
                >
                </el-table-column>
                <el-table-column
                    inline-template
                    label="入库数量"
                    prop="in_num"
                    width="250"
                >
                    <div>
                        <span>良品：</span><el-input :disabled="true" :value="row.good_quantity"  class="storage_order_input"  ></el-input>
                        <span>次品：</span><el-input :disabled="true" :value="row.defective_quantity" class="storage_order_input"  ></el-input>
                    </div>
                </el-table-column>
            </el-table>
        </tab-item>
        <div slot="footer">
            <el-button @click.native="visible = false" size="mini">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .p-parcel-returned-manage{
        .border-box{
            border-left:1px solid #d3dce6;
            border-top:1px solid #d3dce6;
            border-right:1px solid #d3dce6;
        }
        .storage_order_input {
            display: inline-block;
            width: 50px;
        }
        .right-table{
            width: 100%;
            border-collapse:collapse;
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
        .table_head{
            height:32px;
            line-height: 32px;
            border:1px solid #e0e6ed;
            background-color: #6295E9;
            color:white;
        }
        .c-label-item{

        }
        .c-label-item >*{
            vertical-align: baseline;
        }
        .el-col-8{
            height:30px;
        }
        .tab-item{
            .body{
                padding:0;
            }
        }
        .el_card_remark{
            .remark-sale-look {
                overflow-y: hidden;
                width: 190px;
                height: 140px;
                position: absolute;
                bottom: 50px;
                right: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
                background: #fff;
                padding: 0 5px;
                z-index: 999;
                .remark-sale-header {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 25px;
                    padding-left: 10px;
                    padding-top: 5px;
                    background-color: #fff;
                }
                .remark-sale-body {
                    overflow-y: auto;
                    position: absolute;
                    top: 30px;
                    left: 0;
                    right: 0;
                    bottom: 30px;
                    padding: 0 5px;
                }
                .remark-sale-footer {
                    position: absolute;
                    height: 25px;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    padding-bottom: 5px;
                    padding-right: 5px;
                    background-color: #fff;
                }
            }
        }
    }
</style>
<script>
    import {api_post_waitreissued, api_post_waitstorage, api_post_note} from '@/api/package-return'
    export default {
        data(){
            return {
                visible: false,
                loading: false,
                shippingVisible: false,
                showRemark:false,
                remark_content:''
            }
        },
        mounted(){
        },
        filters:{
            filterTime(val){
                return datef("YYYY-MM-dd HH:mm:ss",val);
            },
        },
        methods: {
            parcel_information(row){
                this.$emit('parcel-information', row);
            },
            show_order(row){
                this.$emit('show-order',row);
            },
            mark_reissued(){
                this.$emit('mark-reissued', this.action, this.operatingData.package);
            },
            mark_warehouse(){
                this.$emit('mark-warehouse', this.action, this.operatingData.package.package_number);
            },
            remark(){
                this.showRemark = true;
            },
            saveMark(){
                typeof this.remark_content === 'string' && (this.remark_content = this.remark_content.trim());
                this.$http(api_post_note, this.operatingData.id, {note:this.remark_content}).then(res=>{

                    this.remark_content = '';
                    this.$message({type:"success",message:res.message || res});
                    this.showRemark = false;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey(`saveMarkAdd`, false);
                    },200);
                });
            }
        },
        computed: {
            isLook(){
                return this.action.value === 'look';
            }
        },
        watch: {
            visible(val){
                this.$emit('input',val);
            },
            value(val) {
                if(val){
                    this.showRemark = false;
                    this.remark_content = '';
                }
                this.visible = val;
            },
        },
        props: {
            value:{},
            action:{},
            operatingData:{}
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default,
            labelItem:require('@/components/label-item.vue').default,
            uiTip:require('@/components/ui-tip.vue').default,
            tabItem:require('@/components/tab-item.vue').default,
        },
    }
</script>
