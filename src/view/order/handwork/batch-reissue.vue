<template>
    <page class="p-dialog-batch-reissue-search">
        <page-dialog :title="title" v-model="showDialog" size="full" :height="'90%'" @open="open" :close-on-click-modal="true">
            <div class="mb-sm">
                <search-card :params="formData" :clears="clears" @search="search">
                    <el-select v-model="formData.snType"
                               class="inline s-width-default"
                               v-sf.snType
                               filterable>
                        <el-option
                            v-for="res in typeList"
                            :label="res.label"
                            :value="res.value"
                            :key="res.value"
                        ></el-option>
                    </el-select>
                    <order-input v-model="formData.snText"
                                 class="inline width-super mr-sm"
                                 v-sf.snText
                                 @keydown="search"
                                 placeholder="可批量搜索，Shift+回车换行..."></order-input>
                    <i class="inline ml-xs" slot="reset"></i>
                </search-card>
                <el-table
                    v-resize="{height:105}"
                    class="scroll-bar mt-sm"
                    highlight-current-row
                    :data="tableData"
                    style="width:100%;"
                    @selection-change="select_change"
                    v-loading="loading"
                    element-loading-text="玩命加载中..."
                >
                    <div slot="empty" class="no-data-reminder">
                        <i></i>
                        {{emptyText}}
                    </div>
                    <el-table-column type="selection" width="30"></el-table-column>
                    <el-table-column label="包裹号" min-width="80" inline-template>
                        <div class="p-table-list-td-text" @click="click_number(row.number)" :title="row.number"><span class="operate">{{row.number}}</span></div>
                    </el-table-column>
                    <el-table-column label="订单号" min-width="120" inline-template>
                        <div class="p-table-list-td-text" @click="get_order_detail(row)" :title="row.order_number"><span class="operate">{{row.order_number}}</span></div>
                    </el-table-column>
                    <el-table-column label="平台/站点"
                                     min-width="45"
                                     inline-template>
                        <div>
                            <div class="p-table-list-td-text inline" :title="row.channel_name">{{row.channel_name}}</div>/
                            <div class="p-table-list-td-text inline" :title="row.site_code">{{row.site_code}}</div>
                        </div>
                    </el-table-column>
                    <el-table-column
                        min-width="45"
                        label="账号简称" inline-template>
                        <div class="p-table-list-td-text" :title="row.account_name">{{row.account_name}}</div>
                    </el-table-column>
                    <el-table-column
                        min-width="40"
                        label="销售员" inline-template>
                        <div class="p-table-list-td-text" :title="row.seller">{{row.seller}}</div>
                    </el-table-column>
                    <el-table-column label="运输方式" inline-template>
                        <div class="p-table-list-td-text" :title="row.shipping_name">{{row.shipping_name}}</div>
                    </el-table-column>
                    <el-table-column label="发货仓库"
                                     min-width="40"
                                     inline-template>
                        <div class="p-table-list-td-text" :title="row.warehouse_name">{{row.warehouse_name}}</div>
                    </el-table-column>
                    <el-table-column
                        min-width="40"
                        label="目的地" inline-template>
                        <div class="p-table-list-td-text" :title="row.country_cn_name">{{row.country_cn_name}}</div>
                    </el-table-column>
                    <el-table-column
                        min-width="80"
                        label="物流商单号" inline-template>
                        <div class="p-table-list-td-text" :title="row.process_code">{{row.process_code}}</div>
                    </el-table-column>
                    <el-table-column label="跟踪单号" inline-template min-width="80">
                        <div class="p-table-list-td-text" :title="row.shipping_number">{{row.shipping_number}}</div>
                    </el-table-column>
                </el-table>

            </div>
            <el-row slot="footer" style="line-height: 27px;" class="dialog-footer">
                <el-button type="primary" size="mini" class="inline ml-xs" @click.native="keep">创建补发单</el-button>
                <el-button size="mini" class="inline" @click.native="close">关 闭</el-button>
            </el-row>
            <batch-remark v-model="remarkDialog" :title="remarkTitle" :reason-list="reasonList" @get-reason="get_reason" @submit="submit"></batch-remark>
            <parcel-information
                v-model="informationVisble"
                @view-order="view_order"
                :order="order"
                @close-parcel="close_parcel"
            ></parcel-information>
            <form-mdf ref="formMdf"
                      :mdfid="mdfid"
                      v-model="mdfValue"
                      :is-edit="is_edit"
                      :is-package="is_package"
                      @close-dialog="close_dialog"
                      @click-number="click_number_mdf"
                      :title="mdfTitle"></form-mdf>
        </page-dialog>
    </page>
</template>
<style lang="stylus">
    .p-dialog-batch-reissue-search{
        .el-table__empty-block {
            position: relative;
            min-height: auto;
            text-align: center;
            width: 100%;
            height: 100%;
        }.scroll-bar > .el-table__body-wrapper {
             overflow-x: hidden;
             overflow-y: auto;
             height 615px;
         }
        .page-dialog .dialog__body{
            padding: 0px 10px 5px 10px;
            color: #475669;
            font-size: 1.2rem;
            overflow-x: hidden;
            overflow-y: scroll;
            box-sizing: border-box;
            height: 100%;
        }
        .el-card {
            border: 1px solid #D3DCE6;
            border-radius: 4px;
            background-color: #fff;
            overflow: visible;
            box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, .12), 0px 0px 6px 0px rgba(0, 0, 0, .04);
        }
        .p-table-list-td-text{
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

</style>
<script>
    import {api_get_manual_orders_package_list,api_manual_orders_batch_replacement} from '@/api/handwork';
    import {mapActions} from 'vuex'
    import {get_reason} from '@/api/after-sale';
    import {api_get_packages_error} from '@/api/error-info-solution'
    export default {
        page:{
            devinfo:{
                frontEnd:'覃宏峰',
                backEnd:'蓝术术',
                createTime:'2018-10-18',
                updateTime:'2018-10-19'
            }
        },
        data() {
            return {
                showDialog: this.value,
                formData:{
                    snType:'tracking',
                    snText:''
                },
                typeList:[
                    {label:'追踪号',value:'tracking'},
                    {label:'包裹号',value:"number"},
                    {label:'物流商单号',value:'process_code'}
                    ],
                clears:{
                    snType:'tracking',
                    snText:''
                },
                tableData:[],
                firstLoading:true,
                loading:false,
                selectList:[],
                remarkDialog:false,
                remarkTitle:'',
                reasonList:[],
                informationVisble:false,
                order:{},
                mdfTitle:'',
                mdfid:0,
                mdfValue:false,
                is_package:false,
                isShow:false,
                is_edit: {
                    edit: false
                },
            }
        },
        mounted(){
            this.get_reason();
        },
        methods: {
            open(){
                this.formData.snType = 'tracking';
                this.formData.snText = '';
                this.tableData = [];
            },
            search(){
                if(!this.formData.snText){
                    let find = this.typeList.find(row=>row.value===this.formData.snType);
                    this.$message({type:'warning',message:`请输入${find.label}!`});
                    return
                }
                this.loading = true;
                let data = {
                    snType:this.formData.snType,
                    snText:JSON.stringify(this.formData.snText.trim().split('\n').map(row=>row.trim()).filter(row=>!!row))
                };
                this.$http(api_get_manual_orders_package_list,data).then(res=>{
                    this.tableData = res;
                    this.loading = false;
                    this.firstLoading = false;
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                })
            },
//            获取原因
            get_reason() {
                this.$http(get_reason).then(res => {
                    this.reasonList = res.map(row => {
                        return {
                            label: row.remark,
                            value: row.id,
                        }
                    });
                }).catch(code => {
                    console.log(code);
                })
            },
            select_change(val){
                this.selectList = val;
            },
            close() {
                this.showDialog = false;
            },
            keep(){
                if(this.selectList.length===0){
                    this.$message({type:'warning',message:`请勾选需要创建补发手工单的数据！`});
                    return
                }
                this.remarkDialog = true;
                this.remarkTitle = '批量补发手工单';
            },
            submit(data){
                data.package_ids = JSON.stringify(this.selectList.map(row=>row.package_id));
                this.$http(api_manual_orders_batch_replacement,data).then(res=>{
                    this.$message({type:`success`,message:res.message||res});
                    this.remarkDialog = false;
                    this.showDialog = false;
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('url_manual_orders_batch_replacement',false);
                    },200);
                })
            },
            click_number(val) {
                if (this.$hasPermission(this.apis.url_package)) {
                    this.order.id = val;
                    this.informationVisble = true;
                } else {
                    this.$message({
                        type: 'error',
                        message: '没有查看包裹详情详情的权限'
                    });
                }
            },
            view_order(val) {
                this.mdfValue = true;
                this.mdfid = val.mdfid;
                this.mdfTitle = val.mdfTitle;
                this.informationVisble = false;
                this.isShow = true;
                this.$refs.formMdf.require_server(this.mdfid)
            },
            close_parcel() {
                this.isShow = false;
            },
            click_number_mdf(val) {
                this.order = val.orderData;
                this.informationVisble = val.informationVisble;
            },
            close_dialog(val) {
                if (this.isShow) this.informationVisble = true;
            },
            get_order_detail(row) {
                if (this.$hasPermission(this.apis.url_info)) {
                    this.$refs.formMdf.require_server(row.order_id);
                    this.mdfTitle = `查看订单号: ${row.order_number} 信息`;
                    this.mdfid = row.order_id;
                    this.mdfValue = true;
                    this.is_package = false;
                } else {
                    this.$message({
                        type: 'error',
                        message: '没有查看订单号详情的权限'
                    });
                }
            },
            ...mapActions({
                set_printerList: 'api/set_printerList'
            })
        },
        computed:{
            emptyText() {
                return this.firstLoading?'请查询数据':'暂无数据'
            }
        },
        filters:{
            filterDate(val,YMD){
                return val?datef(YMD?'YYYY-MM-dd':'YYYY-MM-dd HH:mm:ss',val):'-- --';
            },
            filterPrice(val){
                if(val){
                    return parseFloat(val).toFixed(2);
                }else{
                    return "";
                }
            }
        },
        watch: {
            showDialog(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.showDialog = val;
            },
        },
        props: {
            value: {
                required: true,
                type: Boolean
            },
            title:{
                required:true,
                type: String
            }
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            searchCard:require('@/components/search-card').default,
            labelItem:require('@/components/label-item').default,
            orderInput:require('@/components/order-input.vue').default,
            batchRemark:require('./batch-remark').default,
            parcelInformation: require('@/view/entrepot/placeorder/parcel-information.vue').default,
            formMdf: require("../local/form-mdf.vue").default,
        }
    }
</script>
