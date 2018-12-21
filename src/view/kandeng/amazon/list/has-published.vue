<template>
    <div class="amazon-publish-table">
        <has-published-search-card @search="search"
                                   :siteList="siteList"
                                   :total="total"></has-published-search-card>
        <div class="ml-sm">
            <permission tag="hasPublishedMidleButton" :route="apis.url_edit_listing"
                        :select-product="selectProduct" @edit-affirm="edit_affirm" @filter-fba="filter_fba"></permission>
        </div>
        <ui-table v-loading="loading"  :element-loading-text="isPlayloading"
                  :body-height="41" :first-loading="firstLoading"
                  :has-data="tableData.length>0" v-model="checkAll" @check="head_check" @sort-click="sort_click"
                  :heads="[
                        {isCheck:true,width:2},
                        {label:$t('ymx-list.image'),width:5},
                        {label:$t('ymx-list.status'),width:5},
                        {label:$t('ymx-list.platsku'),width:6,isSort:true,order_by:'seller_sku'},
                        {label:$t('ymx-list.localsku'),width:6},
                        {label:'ASIN',width:5,isSort:true,order_by:'asin1'},
                        {label:$t('ymx-list.upTitle'),width:7},
                        {label:$t('ymx-list.acc'),width:4},
                        {label:$t('ymx-list.site'),width:4},
                        {label:$t('ymx-list.saleType'),width:5},
                        {label:$t('ymx-list.shipType'),width:5},
                        {label:$t('ymx-list.sellPrice'),width:5,isSort:true,order_by:'price'},
                        {label:$t('ymx-list.soldQuan'),width:4},
                        {label:$t('ymx-list.quantity'),width:5},
                        {label:$t('ymx-list.pageviews'),width:5},
                        {label:$t('ymx-list.localStatus'),width:5},
                        {label:$t('ymx-list.editStatus'),width:5},
                        {label:$t('ymx-list.update'),width:6,isSort:true,order_by:'modify_time'},
                        {label:$t('ymx-list.operat'),size:100},
                       ]">
            <tbody>
            <template v-for="(data, index) in tableData">
                <tr :key="data.id" :class="{'high-light': data.highLight}" @click="row_click(index)">
                    <td><el-checkbox v-model="data.isChecked" @change="check_row"></el-checkbox></td>
                    <td>
                        <el-popover placement="right" trigger="hover">
                            <img v-lazy="get_img(data)" width="200px" height="200px">
                            <span slot="reference">
                                  <img v-lazy="get_img(data)" height="60px" width="60px" style="border:none">
                            </span>
                        </el-popover>
                    </td>
                    <td> <!--状态-->
                        <span>{{seller_status(data.seller_status)}}</span>
                    </td>
                    <td><!--平台SKU-->
                        <ui-tip :content="data.seller_sku"></ui-tip>
                    </td>
                    <td><!--本地SKU-->
                        <span v-if="!data.sku_quantity" @click="bind_sku(data)" class="operate">
                            <i class="el-icon-information" style="position: absolute;top:5px;left: 0" title="点击关联"></i>
                            <ui-tip :content="$t('ymx-list.interrelated')" style="padding-left: 12px"></ui-tip>
                        </span>
                        <ui-tip v-else :content="data.sku_quantity"></ui-tip>
                    </td>
                    <td><!--ASIN-->
                        <ui-tip :content="data.asin1"></ui-tip>
                    </td>
                    <td><!--刊登标题-->
                        <ui-tip :content="data.item_name"></ui-tip>
                    </td>
                    <td><!--账号-->
                        <ui-tip :content="data.account_name"></ui-tip>
                    </td>
                    <td><!--站点-->
                        <ui-tip :content="data.site"></ui-tip>
                    </td>
                    <td><!--销售类型-->
                        <span>{{seller_type(data.seller_type)}}</span>
                    </td>
                    <td><!--发货类型-->
                        <span>{{fulfillment_type(data.fulfillment_type)}}</span>
                    </td>
                    <td> <!--销售价-->
                        <ui-tip :content="data.price"></ui-tip>
                    </td>
                    <td><!--已售量-->
                        <ui-tip :content="data.sku_saled_qty"></ui-tip>
                    </td>
                    <td><!--可售量-->
                        <ui-tip :content="data.quantity"></ui-tip>
                    </td>
                    <td><!--浏览量-->
                        <ui-tip :content="data.view_num"></ui-tip>
                    </td>
                    <td><!--本地状态-->
                        <span>{{sku_status(data.sku_status)}}</span>
                    </td>
                    <td><!--修改状态-->
                        <span>{{modify_status(data.modify_status)}}</span>
                    </td>
                    <td><!--更新时间-->
                        <times :time="data.modify_time"></times>
                    </td>
                    <td><!--操作-->
                        <trends-select class="inline" type="primary"
                                       :selects="operateList" @trigger="check(data,$event)"></trends-select>
                    </td>
                </tr>
            </template>
            </tbody>
        </ui-table>
        <has-published-log v-model="logVisible" :amazon-listing-id="amazon_listing_id"></has-published-log>
        <has-published-content v-model="contentVisible" :id="id" :account-id="account_id" :amazon-listing-id="amazon_listing_id"></has-published-content>
        <page-dialog :title="`关联平台SKU：${seller_sku}`" v-model="skuVisible" size="small" :close-on-click-modal="false">
            <el-button type="primary" size="mini" @click="add_sku">{{$t('ymx-list.add')}}</el-button>
            <el-table border :data="selectGoods">
                <el-table-column prop="local_sku" :label="$t('ymx-list.localsku')"></el-table-column>
                <el-table-column prop="value" :label="$t('ymx-list.quan')">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.quantity"></el-input>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('ymx-list.operat')">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" @click="delete_sku(scope.$index)">{{$t('ymx-list.del')}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer">
                <el-button type="primary" size="mini" @click="save_sku">{{$t('common.confirm')}}</el-button>
                <el-button size="mini" @click="skuVisible = false">{{$t('common.cancel')}}</el-button>
            </div>
        </page-dialog>
        <add-goods v-model="addGoodsVisible" @add-goods="select_goods"></add-goods>
        <change-published-image v-model="changeImageDialog" :row-data="rowData"></change-published-image>
    </div>
</template>

<style lang="stylus">
    .amazon-publish-table{
        .width-100{
            width:100px;
        }
        .high-light{
            background-color: rgba(173,227,255, 0.5);
        }
        .el-input__inner{
            height: 26px!important;
        }
        .operate{
            position: relative;
        }
    }
</style>
<script>
    import {
        api_has_publish_list, api_amazon_logs, api_bind_sku,
        url_edit_listing
    } from '../../../../api/amazon-publish-list';
    import {operateList} from './action';
    export default{
        permission:{
            url_edit_listing
        },
        data(){
            return {
                searchData: {
                    page:1,
                    pageSize:50,
                    snType: '',
                    snText: '',
                    site: '',
                    account: '',
                    salesType: '',
                    state: '',
                    deliveryType: '',
                    nativeState: '',
                    timeType: 'update',
                    start: '',
                    end: '',
                    order_by:'',
                    sort:'',
                    is_erp:'0'
                },
                total:0,
                tableData:[],
                loading: false,
                firstLoading: true,
                checkAll:false,
                logVisible: false,
                contentVisible: false,
                amazon_listing_id:'',
                id:'',
                account_id:'',
                addGoodsVisible: false,
                skuVisible: false,
                selectGoods:[],
                seller_sku:'',
                changeImageDialog:false,
                rowData:{},
            }
        },
        created(){

        },
        filters: {
            // seller_status(val){
            //     return val===1?this.$t('ymx-list.isList'):val===2?this.$t('ymx-list.isSaleOff'):val===3?this.$t('ymx-list.isDeleted'):'-';
            // },
            // modify_status(val){
            //     return val===1?'待同步':val===2?'更新异常':'-'
            // }
        },
        methods: {
             modify_status(val){
                return val===1?this.$t('ymx-list.isSynchronized'):val===2?this.$t('ymx-list.isAnomaly'):'-'
            },
            seller_status(val){
                return val===1?this.$t('ymx-list.isList'):val===2?this.$t('ymx-list.isSaleOff'):val===3?this.$t('ymx-list.isDeleted'):'-';
            },
            fulfillment_type(val){
                return val === 1?this.$t('ymx-list.seller2'):val===2?'FBA':'-';
            },
            sku_status(val){
                return val===1?this.$t('ymx-list.active'):val===2?this.$t('ymx-list.Inactive'):val===3?this.$t('ymx-list.soldOut'):val===4?this.$t('ymx-list.outStock'):'-';
            },
            seller_type(val){
                return val===1?this.$t('ymx-list.selfSupport'):val===2?this.$t('ymx-list.hijack'):'-';
            },
            get_img(row){
                if(/^http/.test(row.image_url)){
                    return     row.image_url
                }else {
                    if(/^\//.test(row.image_url)){
                        return row.base_url+row.image_url.slice(1)
                    }else {
                        return row.base_url+row.image_url
                    }
                }
            },
            init(){
                let parameter = window.clone(this.searchData);
                if(parameter.start_time instanceof Date){
                    parameter.start_time = datef("YYYY-MM-dd HH:mm:ss", parameter.start_time.getTime()/1000);
                }
                if(parameter.end_time instanceof Date){
                    parameter.end_time = datef("YYYY-MM-dd HH:mm:ss", parameter.end_time.getTime()/1000);
                }
                let splitText = this.split_search(parameter.search_content);
                parameter.search_content = splitText&&splitText.length?splitText.map(row=>row.trim()):'';
                this.loading = true;
                this.firstLoading = false;
                this.$http(api_has_publish_list, parameter).then(res=>{
                    this.total = res.count || 0;
                    this.tableData = res.data || [];
                    this.tableData.forEach(item=>{
                        this.$set(item, 'isChecked', false);
                        this.$set(item, 'highLight', false);
                    });
                    this.loading = false;
                }).catch (code=>{
                    this.$message({
                        type:"error",
                        message:code.message || code
                    })
                });
            },
            split_search(data){
                let curString = data.replace(new RegExp(' ','gm'),'\n');
                let cur = curString.split('\n').filter(row=>!!row);
                return cur
            },
            check(row,num){
                let operate = operateList.find(function (operate) {
                    return operate.value === num.value
                });
                operate.action.call(this, row);
            },
            search(val){
                this.searchData = val;
                this.init();
            },
            row_click(index){
                this.tableData.forEach(row=>{
                    row.highLight = false;
                });
                this.tableData[index].highLight = true;
            },
            check_row(){
                this.checkAll=!this.tableData.find(row=>!row.isChecked);
            },
            head_check(val){
                this.tableData.forEach(row=>{
                    row.isChecked=val;
                });
            },
            edit_affirm(val){// 没用启用的方法
                val.forEach(res=>{
                    this.tableData.find( item =>{
                        if(res.amazon_listing_id === item.amazon_listing_id){
                            item = res;
                            return true;
                        }
                    });
                })
            },
            filter_fba(){// 当修改可售量是过滤掉fba订单
                this.selectProduct.forEach(item=>{
                    if(item.fulfillment_type===2){
                        this.tableData.find(row=>{
                            if(row.id === item.id){
                                row.isChecked = false;
                                return true;
                            }
                        })
                    }
                })
            },
            bind_sku(data){
                this.seller_sku = data.seller_sku;
                this.id = data.id;
                this.addGoodsVisible = true;
                this.selectGoods = [];
            },
            select_goods(val){
                let arr = val.map(item=>{
                    return {
                        local_sku: item.sku,
                        goods_id: item.goods_id,
                        sku_id: item.sku_id,
                        quantity: ''
                    }
                });
                arr.forEach((item)=>{
                  let find = this.selectGoods.find(row=>{
                       return item.local_sku === row.sku
                   });
                  if(!!find){
                      this.$message({
                          type: 'info',
                          message: `${find.sku}${this.$t('ymx-list.existed')}`
                      });
                  }else {
                      this.selectGoods.push(item);
                  }
                });
                this.skuVisible = true;
            },
            save_sku(){
                let parameters = this.selectGoods.map(item=>{
                    return {
                        id:this.id,
                        sku:this.seller_sku,
                        local:[item]
                    }
                });
                this.$http(api_bind_sku, {data: parameters, platform:'amazon'}).then(res=>{
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    let sku_arr = parameters.map(item=>{
                        return item.local[0].local_sku + '*' + item.local[0].quantity
                    });
                    let sku_id_arr = parameters.map(item=>{
                        return item.local[0].sku_id;
                    });
                    let sku_str = sku_arr.join(',');
                    let index =this.tableData.findIndex(item=>{
                        return item.id === this.id;
                    });
                    this.tableData[index].sku_quantity = sku_str;
                    this.tableData[index].goods_id = parameters[parameters.length-1].local[0].goods_id;
                    this.skuVisible = false;
                }).catch(code=>{
                    this.$message({
                        type:"error",
                        message:code.message || code
                    })
                })
            },
            sort_click(val){
                console.log(val);
                this.searchData.sort = val.order;
                this.searchData.order_by = val.order_by;
                this.init();
            },
            add_sku(){
                this.addGoodsVisible = true
            },
            delete_sku(index){
                this.selectGoods.split(index, 1);
            },
            test(){
                console.log(this.selectProduct)
            }
        },
        computed: {
            isPlayloading(){
                return this.$t('ymx-list.playLoad')
            },
            operateList(){
                return operateList;
            },
            selectProduct(){
                return this.tableData.filter(item=>{
                    return item.isChecked;
                })
            }
        },
        watch: {},
        props: {
            siteList:{
                required: true,
                type: Array,
            }
        },
        components: {
            hasPublishedSearchCard: require('./has-published-search-card.vue').default,//只传入一个total和抛出一个查询字段和值的对象
            uiTable:require("../../../../components/ui-table.vue").default,
            uiTip:require("../../../../components/ui-tip.vue").default,
            trendsSelect:require('../../../../components/trends-select.vue').default,
            hasPublishedMidleButton: require('./has-published-midle-button.vue').default,
            hasPublishedLog: require('./has-published-log.vue').default,
            hasPublishedContent: require('./has-published-content.vue').default,
            addGoods:require("../../../../api-components/add-goods.vue").default,
            pageDialog: require('../../../../components/page-dialog.vue').default,
            changePublishedImage:require('./change-published-image.vue').default,
        }
    }
</script>

