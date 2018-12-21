<template>
    <div class="p-package-return">
        <el-card v-resize="{height:45}">
            <div class="type">
                <span>退回类型：</span>
                <span class="red">{{tableData.return_type}}</span>
            </div>
            <table class="right-table mt-sm" cellpadding="0" cellspacing="0">
                <tr>
                    <td width="150" class="pr-sm">面单号</td>
                    <td class="pl-xs">{{tableData.shipping_number}}</td>
                </tr>
                <tr>
                    <td width="150" class="pr-sm">包裹号</td>
                    <td class="pl-xs">
                        <ui-tip :is-operate="true"
                                :content="tableData.number"
                                :width="98"
                                @cur-click="parcel_information(tableData.number)">
                        </ui-tip>
                    </td>
                </tr>
                <tr>
                    <td width="150" class="pr-sm">订单号</td>
                    <td class="pl-xs">
                        <ui-tip :is-operate="true"
                                :content="tableData.order_number"
                                :width="98"
                                @cur-click="show_order(tableData)">
                        </ui-tip>
                    </td>
                </tr>
                <tr>
                    <td width="150" class="pr-sm">邮寄方式 </td>
                    <td class="pl-xs">{{tableData.shipping_id}}</td>
                </tr>
                <tr>
                    <td width="150" class="pr-sm">国家</td>
                    <td class="pl-xs">{{tableData.country_code}}</td>
                </tr>
                <tr>
                    <td width="150" class="pr-sm">发货时间</td>
                    <td class="pl-xs">{{tableData.shipping_time | filterTime}}</td>
                </tr>
                <tr>
                    <td width="150" class="pr-sm">退回原因</td>
                    <td class="pl-xs">{{tableData.reason}}</td>
                </tr>
                <tr>
                    <td width="150" class="pr-sm">格子编号</td>
                    <td class="pl-xs">{{tableData.lattice_number}}</td>
                </tr>
            </table>
            <el-button type="primary"
                       size="mini"
                       @click="markWarehouse"
                       v-if="!!tableData.is_storage"
                       class="mt-sm">入 库
            </el-button>
        </el-card>
        <form-mdf ref="formMdf"
                  :mdfid="mdfid"
                  v-model="mdfValue"
                  @close-dialog="close_dialog"
                  @click-number="click_number"
                  :is-edit="false"
                  :title="mdfTitle">
        </form-mdf>
        <parcel-information
                @close-parcel="close_parcel"
                v-model="informationVisble"
                @view-order="view_order"
                :order="order">
        </parcel-information>
        <add-storage-order v-model="storageVisible"
                           :return-deal="returnDeal"
                           :storage-data="storageData"
                           :storage-action="storageAction">
        </add-storage-order>
    </div>
</template>
<style lang="stylus">
    .p-package-return{
        .type span{
            font-size: 2rem;
        }
        .pl-xs{
            padding-left:10px;
        }
        .pr-sm{
            padding-right:10px;
        }
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
                height:33px;
            }
            td:nth-child(2n+1){
                background-color: #f5f7fa;
            }
        }
    }
</style>
<script>
    import {api_get_package, url_package} from '@/api/shipment'
    import {url_info} from '@/api/order-local'
    import {api_post_package, api_get_info} from '@/api/package-return'
    export default {
        permission: {
            url_package,url_info
        },
        data() {
            return {
                tableData:{},
                informationVisble:false,
                order:{},
                mdfTitle: "",
                mdfValue: false,
                mdfid: 0,
                storageVisible:false,
                storageData:[],
                storageAction:{},
                returnDeal:false,
                isShow:false,
            }
        },
        filters:{
            filterTime(val){
                return datef("YYYY-MM-dd HH:mm:ss",val);
            },
        },
        methods: {
            view_order(val){
                this.mdfValue = true;
                this.mdfid = val.mdfid;
                this.mdfTitle = val.mdfTitle;
                this.informationVisble = false;
                this.isShow=true;
                this.$refs.formMdf.require_server(this.mdfid)
            },
            click_number(val){
                this.order = val.orderData;
                this.informationVisble = true;
            },
            close_dialog(val){
                if(this.isShow) this.informationVisble = true;
            },
            close_parcel(){
                this.isShow = false;
            },
            init(){
                this.tableData = [];
                this.$http(api_post_package, this.searchData).then(res=>{
                    this.tableData = res;
                    this.$emit('pack-data', this.tableData);
                    // this.$emit('right-init');
                }).catch(code=>{
                    this.$emit('warning', code.message);
                })
            },
            parcel_information(order){
                if (this.$hasPermission(this.apis.url_package)) {
                    this.$http(api_get_package, order).then(res=>{
                        this.order.id = order;
                        this.informationVisble = true;
                    }).catch(code => {
                        this.$message({type:"error",message:code.message || code});
                        this.informationVisble = false;
                    });
                } else {
                    this.$message({
                        type: 'error',
                        message: '没有查看包裹详情详情的权限'
                    });
                }
            },
            show_order(row) {
                console.log(row);
                if (this.$hasPermission(this.apis.url_info)) {
                    this.$refs.formMdf.require_server(row.order_id);
                    this.mdfTitle = `查看订单号: ${row.order_number} 信息`;
                    this.mdfid = row.order_id;
                    this.mdfValue = true;
                } else {
                    this.$message({
                        type: 'error',
                        message: '没有查看订单号详情的权限'
                    });
                }
            },
            markWarehouse(){
                this.returnDeal = true;
                this.storageAction = {
                    mean:'入',
                    title:'生成入库单号',
                    id:this.tableData.package_return_id
                };
                this.$http(api_get_info, this.tableData.package_return_id).then(res=>{
                    res.detail = res.detail.map(row=>{
                        this.$set(row, 'quantity', row.sku_quantity);
                        return row;
                    });
                    this.storageData = {
                        warehouse_id:this.searchData.warehouse_id,
                        warehouse_type:15,
                        package_return_number:this.tableData.package_return_number,
                        details:res.detail,
                        remark:''
                    };
                    this.storageVisible = true;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                });
            },
        },
        watch: {},
        props: {
            searchData:{}
        },
        components: {
            uiTip:require('@/components/ui-tip.vue').default,
            parcelInformation:require('../placeorder/parcel-information.vue').default,
            formMdf: require("../../order/local/form-mdf.vue").default,
            addStorageOrder:require('../package-return/add-storage-order').default
        }
    }
</script>
