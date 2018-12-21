<template>
    <page class="p-search-index">
        <div class="left-box">
            <search-table
                    class="card"
                    @row-click="row_click"
                    @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange"
                    :table-data="tables"
                    :loading="isLoad"></search-table>
        </div>
        <div  class="right-box">
            <form-mdf
                    class="mt-xs"
                    ref="formMdf"
                    :select-row="selectRow"
                    :forms="forms"
                    :cancelId="cancelId"
                    @change-status="cur_operate"
                    @cur-operate="cur_operate"
                    @click-number="click_number"
                    @init-require="init_require"></form-mdf>
        </div>
        <parcel-information
                v-model="informationVisble"
                :order="orderData"
                @view-order="view_order"
        ></parcel-information>
    </page>
</template>
<style lang="stylus" >
    .p-search-index{
        .left-box{
            position:absolute;
            top:0;
            left:0;
            width:50%;
            bottom:0;
            overflow-y: hidden;
        }
        .right-box{
            position:absolute;
            top:0;
            left:50%;
            right:0;
            bottom:0;
            overflow-x: auto;
        }
        .left-main-empty{
            text-align: center;
            position: absolute;
            top:25%;
            left:50%;
            margin-left:-42px;
        }
    }
</style>
<script>
    import {api_info} from '../../../api/order-local';

    import dataTable from './data-table.vue';
    import {api_get, api_status_list,api_account_list,api_get_seller,api_get_channel} from '../../../api/order-local';
    import {api_get_channel_categories} from '../../../api/categories';
    import {api_get_warehouse, api_get_shipping} from '../../../api/common';
    import {url_info,url_update,url_cancel_invalid} from '../../../api/order-local';
    export default {
        permission:{
            url_info,
            url_update,
            url_cancel_invalid
        },
        page: {
            multiple: true,
        },
        refresh() {
            this.form.snType = "order_num";
            this.form.connd_value = '';
            this.init();
        },
        data() {
            return {
                cancelId:'',
                isLoad: false,
                forms:{},
                selectRow:"",
                tables: {
                    page: 1,
                    pageSize: 50,
                    totalSize: 0,
                    lists: []
                },
                form: {
                    snType: 'order_num',
                    connd_value: '',
                    sort_field: "",
                    sort_type: "",
                },
                informationVisble:false,
                orderData:{},
            }
        },
        mounted(){
            if(this.param.key){
                this.form.snType = this.param.key;
                this.form.connd_value = this.param.value;
            }
            this.init();
       },
        methods:{
            click_number(val){
                this.orderData = val.orderData;
                this.informationVisble = val.informationVisble;
            },
            view_order(){
                this.informationVisble = false;
            },
            cur_operate(selectRow){
                this.require_server(selectRow);
            },
            row_click(val){
                this.selectRow = val.id;
            },
            require_server(val){
                this.$delete(this.forms, val);
                this.$http(api_info, val).then(res=>{
                    this.cancelId =res.id;
                    this.$refs.formMdf.status_operation(res);
                    this.$refs.formMdf.formData = res.customer.source;
                    this.$nextTick(()=>{
                        this.$set(this.forms,val, res);
                    })
                }).catch(code=>{
                    console.log(code)
                });
                this.$refs.formMdf.get_speed(val);
            },
            change_status_(){
//                this.init();
            },
            init_require(){
                this.require_server(this.selectRow)
            },
            init(){
                if(!this.form.connd_value)return;
                this.isLoad = true;
                let params = {
                    full_text:1,
                    page:this.tables.page,
                    pageSize:this.tables.pageSize
                };
                this.form.sort_field && (params.sort_field = this.form.sort_field);
                this.form.sort_type && (params.sort_type = this.form.sort_type);
                params.snType = this.form.snType;
                params.snText = this.form.connd_value.trim();
                this.$http(api_get, params).then(res=>{
                    this.selectRow = res.data.length > 0 ? res.data[0].id : 0;
                    this.tables.totalSize=res.count;
                    let lists = res.data.map(row=>{
                        row.isCheck = false;
                        row.show = false;
                        return row;
                    });
                    this.tables.lists = lists;
                    this.isLoad = false;
                }).catch(code=>{
                    this.isLoad = false;
                    console.log(code.message);
                });
            },
//            表格升降序
            sort_click(val){
                switch(val.label){
                    case "付款状态":
                        this.form.sort_field = "pay_time";
                        break;
                    case "支付总额":
                        this.form.sort_field = "pay_fee";
                        break;
                    case "目的地":
                        this.form.sort_field = "country_code";
                        break;
                    case "下单时间":
                        this.form.sort_field = "order_time";
                        break;
                }
                this.form.sort_type = val.order;
                this.init();
            },
            handleSizeChange(val){
                this.tables.pageSize = val;
                this.init()
            },
            handleCurrentChange(val){
                this.tables.page = val;
                this.init();
            }
        },
        watch:{
            param(val){
                if(val.key){
                    this.form.snType = val.key;
                    this.form.connd_value = val.value;
                }
                this.init();
            },
            selectRow(val){
                if(val){
                    this.require_server(val);
                }
            }

        },
        components:{
            cardSearch:require('./card-search.vue').default,
            dataTable,
            searchTable:require('./search-table.vue').default,
            formMdf:require('../pending/form-mdf.vue').default,
            parcelInformation:require('../../entrepot/placeorder/parcel-information.vue').default,
        }
    }
</script>
