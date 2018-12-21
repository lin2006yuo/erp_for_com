<template>
    <div class="mt-sm mb-sm">
        <div class="inline">
            <request-button :request="goto_fba">{{$t('ymx-list.fba')}}</request-button>
            <el-button type="primary" size="mini" @click="goto_self">{{$t('ymx-list.selfShips')}}</el-button>
            <el-button type="primary" size="mini" @click="open_time_up_lower">{{$t('ymx-list.openRegular')}}</el-button>
            <el-button type="primary" size="mini" @click="close_time_up_lower">{{$t('ymx-list.closeRegular')}}</el-button>
            <el-button type="primary" size="mini" @click="grab_listing">{{$t('ymx-list.grab')}}</el-button>
            <el-button type="primary" size="mini" @click="update_price">{{$t('ymx-list.editMdfPrice')}}</el-button>
            <el-button type="primary" size="mini" @click="update_quantity">{{$t('ymx-list.mdfquan')}}</el-button>
            <el-button type="primary" size="mini" @click="asin_inspect">{{$t('ymx-list.verifi')}}</el-button>
        </div>
        <el-select class="width-lg inline" v-model="selectButton" :placeholder="$t('ymx-list.moreEdit')">
            <el-option v-for="item in buttonArr" :key="item.value" :label="item.label" :value="item.value" @click.native="more_update(item)"></el-option>
        </el-select>
        <page-dialog :title="$t('ymx-list.editPrice')" v-model="priceVisible" size="small" :close-on-click-modal="false">
            <el-select class="inline width-md" v-model="updatePriceTypeValue">
                <el-option v-for="(item, index) in updatePriceType" :label="item.label" :value="item.value" :key="index"></el-option>
            </el-select>
            <el-input class="inline"  v-model="updatePriceValue" :placeholder="$t('ymx-list.negativeNum')" @blur="computed_result_update_price"></el-input>
            <span v-show="updatePriceTypeValue===2">%</span>
            <table class="pi-liang" style="width: 100%;margin-top: 30px;" cellspacing="0">
                <tr style="background-color: #eff2f7">
                    <td style="width: 30%">{{$t('ymx-list.platsku')}}</td>
                    <td>{{$t('ymx-list.before')}}</td>
                    <td>{{$t('ymx-list.after')}}</td>
                </tr>
                <tr v-for = "(item, index) in theNewDate">
                    <td>{{item.seller_sku}}</td>
                    <td>{{item.price}}</td>
                    <td>
                        <el-input  v-model="item.newPrice"></el-input>
                    </td>
                </tr>
            </table>
            <div style="text-align: right;  margin-top: 10px;">
                <el-button type="primary" size="mini" :disabled="judge" @click="update_price_affirm">{{$t('common.confirm')}}</el-button>
                <el-button size="mini" @click="priceVisible = false">{{$t('common.cancel')}}</el-button>
            </div>
        </page-dialog>
        <page-dialog :title="$t('ymx-list.mdfquan')" v-model="updateQuantityVisible" size="small" :close-on-click-modal="false">
            <span>{{$t('ymx-list.mdfQuantity')}}：</span><el-input class="inline" v-model="updateQuantityValue" placeholder="请输入一个整数" @blur="computed_result_update_quantity"></el-input>
            <table class="pi-liang" style="width: 100%;margin-top: 30px;" cellspacing="0">
                <tr style="background-color: #eff2f7">
                    <td style="width: 30%">{{$t('ymx-list.platsku')}}</td>
                    <td>{{$t('ymx-list.before')}}</td>
                    <td>{{$t('ymx-list.after')}}</td>
                </tr>
                <tr v-for="(item, index) in selectProduct">
                    <td>{{item.seller_sku}}</td>
                    <td>{{item.quantity}}</td>
                    <td>
                        <el-input v-model="item.newQuantity"></el-input>
                    </td>
                </tr>
            </table>
            <div style="text-align: right; margin-top: 10px;">
                <el-button type="primary" size="mini" @click="update_quantity_affirm">{{$t('common.confirm')}}</el-button>
                <el-button size="mini" @click="updateQuantityVisible = false">{{$t('common.cancel')}}</el-button>
            </div>
        </page-dialog>

        <page-dialog :title="$t('ymx-list.bulkTitle')" v-model="updateTitleVisible" size="large" :close-on-click-modal="false">
            <table class="pi-liang" style="width: 100%;margin-top: 30px;" cellspacing="0">
                <tr style="background-color: #eff2f7">
                    <td style="width: 30%">{{$t('ymx-list.platsku')}}</td>
                    <td>{{$t('ymx-list.upTitle')}}</td>
                </tr>
                <tr v-for = "(item, index) in selectProduct">
                    <td>{{item.seller_sku}}</td>
                    <td>
                        <el-input v-model="item.new_item_name"></el-input>
                        <span style="line-height: 30px;padding-left: 10px;">{{item.item_name}}</span>
                    </td>
                </tr>
            </table>
            <div style="margin-top: 20px;">
                <label>{{$t('ymx-list.find')}}：</label><el-input class="inline" v-model="title_find"></el-input>
                <label>{{$t('ymx-list.replace2')}}：</label><el-input class="inline" v-model="title_replace" @blur="replace_find"></el-input>
            </div>
            <div style="text-align: right; margin-top: 10px;">
                <el-button type="primary" size="mini" @click="update_title_affirm">{{$t('common.confirm')}}</el-button>
                <el-button size="mini" @click="updateTitleVisible = false">{{$t('common.cancel')}}</el-button>
            </div>
        </page-dialog>
        <page-dialog :title="$t('ymx-list.rulesTiming')" v-model="upLowRuleVisible" size="large" :close-on-click-modal="false" @open="open">
            <label-item :label="`${$t('ymx-list.ruleName')}：`" class="ml-sm mr-sm">
                <el-input v-model="searchData.rule_name" class="s-width-middle" @keyup.native.enter="search_rule"></el-input>
            </label-item>
            <el-button type="primary" size="mini" class="inline" @click.native="search_rule">{{$t('common.search')}}</el-button>
            <el-table
                    class="scroll-bar mt-sm"
                    :height="540"
                    v-resize="{height:41}"
                    :data="tableData.lists"
                    highlight-current-row>
                <el-table-column width="50">
                    <template slot-scope="scope">
                        <el-radio v-model="ruleRadio" :label="scope.row.id" @change.native="getRuleRow(scope.$index,scope.row.id)">&nbsp;</el-radio>
                    </template>
                </el-table-column>

                <el-table-column type="expand">
                    <template slot-scope="props">
                        <table class="template">
                            <tr style="background-color: floralwhite">
                                <td colspan="2">
                                    <el-checkbox v-model="props.row.monday_up_lower.is_check" disabled>{{$t('ymx-list.mon')}}</el-checkbox>
                                </td>
                                <td colspan="2">
                                    <el-checkbox v-model="props.row.tuesday_up_lower.is_check" disabled>{{$t('ymx-list.tue')}}</el-checkbox>
                                </td>
                                <td colspan="2">
                                    <el-checkbox v-model="props.row.wednesday_up_lower.is_check" disabled>{{$t('ymx-list.wed')}}</el-checkbox>
                                </td>
                                <td colspan="2">
                                    <el-checkbox v-model="props.row.thursday_up_lower.is_check" disabled>{{$t('ymx-list.thur')}}</el-checkbox>
                                </td>
                                <td colspan="2">
                                    <el-checkbox v-model="props.row.friday_up_lower.is_check" disabled>{{$t('ymx-list.fri')}}</el-checkbox>
                                </td>
                                <td colspan="2">
                                    <el-checkbox v-model="props.row.saturday_up_lower.is_check" disabled>{{$t('ymx-list.sat')}}</el-checkbox>
                                </td>
                                <td colspan="2">
                                    <el-checkbox v-model="props.row.sunday_up_lower.is_check" disabled>{{$t('ymx-list.sun')}}</el-checkbox>
                                </td>
                            </tr>
                            <tr style="background-color: floralwhite">
                                <td>{{$t('ymx-list.display')}}</td>
                                <td>{{$t('ymx-list.remove')}}</td>
                                <td>{{$t('ymx-list.display')}}</td>
                                <td>{{$t('ymx-list.remove')}}</td>
                                <td>{{$t('ymx-list.display')}}</td>
                                <td>{{$t('ymx-list.remove')}}</td>
                                <td>{{$t('ymx-list.display')}}</td>
                                <td>{{$t('ymx-list.remove')}}</td>
                                <td>{{$t('ymx-list.display')}}</td>
                                <td>{{$t('ymx-list.remove')}}</td>
                                <td>{{$t('ymx-list.display')}}</td>
                                <td>{{$t('ymx-list.remove')}}</td>
                                <td>{{$t('ymx-list.display')}}</td>
                                <td>{{$t('ymx-list.remove')}}</td>
                            </tr>
                            <tr v-for="(item, index) in props.row.monday_up_lower.up_lower_tme" :key="index" style="background-color: floralwhite">
                                <td><span>{{props.row.monday_up_lower.up_lower_tme[index].up_time}}</span></td>
                                <td><span>{{props.row.monday_up_lower.up_lower_tme[index].lower_time}}</span></td>
                                <td><span>{{props.row.tuesday_up_lower.up_lower_tme[index].up_time}}</span></td>
                                <td><span>{{props.row.tuesday_up_lower.up_lower_tme[index].lower_time}}</span></td>
                                <td><span>{{props.row.wednesday_up_lower.up_lower_tme[index].up_time}}</span></td>
                                <td><span>{{props.row.wednesday_up_lower.up_lower_tme[index].lower_time}}</span></td>
                                <td><span>{{props.row.thursday_up_lower.up_lower_tme[index].up_time}}</span></td>
                                <td><span>{{props.row.thursday_up_lower.up_lower_tme[index].lower_time}}</span></td>
                                <td><span>{{props.row.friday_up_lower.up_lower_tme[index].up_time}}</span></td>
                                <td><span>{{props.row.friday_up_lower.up_lower_tme[index].lower_time}}</span></td>
                                <td><span>{{props.row.saturday_up_lower.up_lower_tme[index].up_time}}</span></td>
                                <td><span>{{props.row.saturday_up_lower.up_lower_tme[index].lower_time}}</span></td>
                                <td><span>{{props.row.sunday_up_lower.up_lower_tme[index].up_time}}</span></td>
                                <td><span>{{props.row.sunday_up_lower.up_lower_tme[index].lower_time}}</span></td>
                            </tr>
                        </table>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('ymx-list.ruleName')" prop="rule_name"></el-table-column>
                
                <el-table-column :label="$t('ymx-list.ruleValidity')">
                    <template slot-scope="scope">
                        <span>{{scope.row.start_time}}--{{scope.row.end_time}}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('ymx-list.founder')" prop="username"></el-table-column>
            </el-table>
            <div style="text-align: right; margin-top: 10px;">
                <el-pagination
                        class="mb-sm"
                        @size-change="size_change"
                        @current-change="current_change"
                        :current-page="tableData.page"
                        :page-sizes="[20, 50, 100, 200,500]"
                        :page-size=tableData.pageSize
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="tableData.total">
                </el-pagination>
                <el-button type="primary" size="mini" @click="open_rule_affirm">{{$t('common.confirm')}}</el-button>
                <el-button size="mini" @click="upLowRuleVisible = false">{{$t('common.cancel')}}</el-button>
            </div>
        </page-dialog>
        <asin-inspect v-model="inspectDialog" cur-platform="wish"></asin-inspect>
    </div>
</template>

<style lang="stylus">
    .pi-liang{
        td{
            border-left: 1px solid #aaa;
            border-top: 1px solid #aaa;
            padding:5px;
        }
        tr:last-child{
            td{
                border-bottom: 1px solid #aaa;
            }
        }
        tr{
            td:last-child{
                border-right: 1px solid #aaa;
            }
        }
    }
</style>
<script>
import {api_edit_listing,api_amazon_batch} from '../../../../api/amazon-publish-list';
import {api_up_lower_rule_list, api_open_time_up_lower, api_close_time_up_lower} from '@/api/up-lower-rule-list'
import {api_amazon_listing_grab} from '@/api/heel-sale-complaint-management'
    export default{
        data(){
            return {
                theNewDate:[],
                loading:false,
                buttonArr:[
                    {
                        value:1,
                        label:this.$t('ymx-list.editTitle')
                    }
                ],
                selectButton:'',
                priceVisible: false,
                updateQuantityVisible: false,
                updatePriceValue:'',
                updatePriceTypeValue:1,
                updatePriceType: [
                    {label:this.$t('ymx-list.inAmount'), value:1},
                    {label:this.$t('ymx-list.inGain'), value:2},
                    {label:this.$t('ymx-list.uniform'), value:3}
                ],
                updateQuantityValue: '',
                updateTitleVisible: false,
                title_find:'',
                title_replace:'',
                edit_type:{
                    price:'price',
                    quantity:'quantity',
                    itemname:'itemname',
                    fulfillment_type:'fulfillment_type'
                },
                //开启定时上下架弹框数据
                upLowRuleVisible: false,
                searchData: {
                    status: 0,
                    rule_name: '',
                    page: 1,
                    pageSize: 50
                },
                tableData: {
                    lists: [],
                    total: 0,
                    page: 1,
                    pageSize: 50
                },
                selectList: [],
                ruleRadio: '',
                ruleId: '',
                inspectDialog:false
            }
        },
        created(){

        },
        filters: {},
        mounted(){
        },
        updated(){

        },
        destroy(){

        },
        methods: {
            init(data={}){
               return   this.$http(api_edit_listing, data).then(res=>{
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    return Promise.resolve()
                }).catch(code=>{
                    this.$message({
                        type:"error",
                        message:code.message || code
                    })
                });
            },
            goto_fba(){
                if(this.selectProduct.length === 0){
                    return this.$message({
                        type:"error",
                        message:this.$t('ymx-list.fbaTip')
                    });
                }

                return this.$confirm(this.$t('ymx-list.fbaTip2'), this.$t('ymx-list.tips'), {
                    confirmButtonText: this.$t('common.confirm'),
                    cancelButtonText: this.$t('common.cancel'),
                    type: 'warning'
                }).then(() => {
                    let result =  this.selectProduct.map(item=>{
                        return {
                            amazon_listing_id:item.amazon_listing_id,
                            account_id:item.account_id,
                            new_value:2,
                            old_value:item.fulfillment_type
                        }
                    });

                    let parameter = {
                        type:this.edit_type.fulfillment_type,
                        data:result
                    };

                    this.selectProduct.forEach(item=>{
                        item.fulfillment_type = 1;
                    });

                    return this.init(parameter)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.$t('ymx-list.cancelTip')
                    });
                });
            },
            goto_self(){
                if(this.selectProduct.length === 0){
                    this.$message({
                        type:"error",
                        message:this.$t('ymx-list.fbaTip')
                    });
                    return
                }
                this.$confirm(this.$t('ymx-list.selfTip'), this.$t('ymx-list.tips'), {
                    confirmButtonText: this.$t('common.confirm'),
                    cancelButtonText: this.$t('common.cancel'),
                    type: 'warning'
                }).then(() => {

                    let result =  this.selectProduct.map(item=>{
                        return {
                            amazon_listing_id:item.amazon_listing_id,
                            account_id:item.account_id,
                            new_value:1,
                            old_value:item.fulfillment_type
                        }
                    });

                    let parameter = {
                        type:this.edit_type.fulfillment_type,
                        data:result
                    };

                    this.selectProduct.forEach(item=>{
                        item.fulfillment_type = 2;
                    });

                    this.init(parameter)

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.$t('ymx-list.cancelTip')
                    });
                });
            },
            update_price(){
                if(this.selectProduct.length === 0){
                    this.$message({
                        type:"error",
                        message:this.$t('ymx-list.fbaTip')
                    });
                    return
                }
                let ids = this.selectProduct.map(row=>row.id).join(',')
                this.theNewDate=clone(this.selectProduct);
                this.$http(api_amazon_batch,{ids:ids}).then((res)=>{

                   res.forEach((el,index)=>{
                       this.theNewDate[index].price=el.price;
                   })
                })
                this.theNewDate.forEach(item=>{
                    this.$set(item,'newPrice', '');
                });
                this.priceVisible = true;
            },
            update_quantity(){
                if(this.selectProduct.length === 0){
                    this.$message({
                        type:"error",
                        message:this.$t('ymx-list.fbaTip')
                    });
                    return
                }
                let find = this.selectProduct.find(item=>{
                   return item.fulfillment_type === 2 ;
                });
                if(!!find){
                    this.$confirm(this.$t('ymx-list.FBATip'), this.$t('ymx-list.tips'), {
                        confirmButtonText: this.$t('common.confirm'),
                        cancelButtonText: this.$t('common.cancel'),
                        type: 'warning'
                    }).then(() => {
                        this.$emit('filter-fba');
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: this.$t('ymx-list.cancelTip')
                        });
                    });
                }else {
                    this.selectProduct.forEach(item=>{
                        this.$set(item,'newQuantity', '');
                    });
                    this.updateQuantityVisible = true;
                }
            },
            more_update(item){
                if(this.selectProduct.length === 0){
                    this.$message({
                        type:"error",
                        message:this.$t('ymx-list.fbaTip')
                    });
                    return
                }

                switch (item.value){
                    case 1:
                        this.selectProduct.forEach(item=>{
                            this.$set(item, 'new_item_name', item.item_name);
                        });
                        this.updateTitleVisible = true;
                        break;

                }

            },
            detector(){
                let account_id = this.selectProduct[0].account_id;
                let index = this.selectProduct.findIndex(item=>{
                    return item.account_id !== account_id
                });
                return index===-1
            },

            computed_result_update_price(){
                switch (this.updatePriceTypeValue){
                    case 1:
                        this.theNewDate.forEach(item=>{
                            item.newPrice = (Number(item.price) + Number(this.updatePriceValue)).toFixed(2);
                        });
                        break;
                    case 2:
                        this.theNewDate.forEach(item=>{
                            item.newPrice = (Number(item.price) * (1 + this.updatePriceValue/100)).toFixed(2);
                        });
                        break;
                    case 3:
                        this.theNewDate.forEach(item=>{
                            item.newPrice = Number(this.updatePriceValue)
                        });
                        break;
                }
            },
            computed_result_update_quantity(){
                this.selectProduct.forEach(item=>{
                    item.newQuantity = Number(this.updateQuantityValue);
                });


            },
            async update_price_affirm(){
                this.selectProduct=clone(this.theNewDate);
                let result =  this.selectProduct.map(item=>{
                    return {
                        amazon_listing_id:item.amazon_listing_id,
                        account_id:item.account_id,
                        new_value:item.newPrice,
                        old_value:item.price
                    }
                });

                let parameter = {
                    type:this.edit_type.price,
                    data:result
                };

                await this.init(parameter);
                this.selectProduct
                console.log(this.selectProduct)
                this.priceVisible = false;  
                this.updatePriceValue = '';
            },
            async update_quantity_affirm(){

                let result =  this.selectProduct.map(item=>{
                    return {
                        amazon_listing_id:item.amazon_listing_id,
                        account_id:item.account_id,
                        new_value:item.newQuantity,
                        old_value:item.quantity
                    }
                });

                let parameter = {
                    type:this.edit_type.quantity,
                    data:result
                };
                await this.init(parameter);
                this.updateQuantityVisible = false;
                this.updateQuantityValue = '';
            },
            async update_title_affirm(){
                this.selectProduct=clone(this.theNewDate);
                let result =  this.selectProduct.map(item=>{
                    return {
                        amazon_listing_id:item.amazon_listing_id,
                        account_id:item.account_id,
                        new_value:item.new_item_name,
                        old_value:item.item_name
                    }
                });

                let parameter = {
                    type:this.edit_type.itemname,
                    data:result
                };

               await this.init(parameter);

                this.updateTitleVisible = false;
                this.title_find='';
                this.title_replace='';
            },
            replace_find(){
                if(this.title_find === ''){
                    this.$message({
                        type:"error",
                        message:this.$t('ymx-list.selectSearch')
                    });
                }else{
                    let reg = new RegExp(this.title_find,'g');
                    this.selectProduct.forEach(item=>{
                        console.log(this.title_replace);
                        item.new_item_name = item.new_item_name.replace(reg, this.title_replace);
                    })
                }

            },
            open_time_up_lower(){//-----开启定时上下架规则
                if(this.selectProduct.length === 0){
                    this.$message({
                        type:"error",
                        message:this.$t('ymx-list.regularTip')
                    });
                    return
                }
                this.upLowRuleVisible = true;
            },
            close_time_up_lower(){//-----关闭定时上下架
                if(this.selectProduct.length === 0){
                    this.$message({
                        type:"error",
                        message:this.$t('ymx-list.regularTip')
                    });
                    return
                }
                this.$confirm(this.$t('ymx-list.closeTip'), this.$t('ymx-list.tips'), {
                    confirmButtonText: this.$t('common.confirm'),
                    cancelButtonText: this.$t('common.cancel'),
                    type: 'warning'
                }).then(() => {
                    let data = {
                        id: ''
                    };
                    data.id = this.selectProduct.map(row => row.id);
                    this.$http(api_close_time_up_lower,data).then(res => {
                        this.$message({type: 'success', message: res.message})
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message||code})
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.$t('ymx-list.cancelTip')
                    });
                });
            },
            search_rule(){//----搜索上下架规则
                this.up_lower_init()
            },
            open(){//---打开弹框的回调函数
                this.ruleRadio = '';
                this.ruleId = '';
                this.up_lower_init()
            },
            up_lower_init(){//--请求上下架规则列表
                let data = window.clone(this.searchData);
                data.page = this.tableData.page;
                data.pageSize = this.tableData.pageSize;
                this.$http(api_up_lower_rule_list, data).then(res => {
                    res.data.forEach(row => {
                        for(let key in row){
                            if(key.indexOf('up_lower') !== -1){
                                row[key] = JSON.parse(row[key]);
                                row[key].is_check = row[key].is_check === 0 ? false : true
                            }
                        }
                    });
                    this.tableData.lists = res.data;
                    this.tableData.page = +res.page;
                    this.tableData.pageSize = +res.pageSize;
                    this.tableData.total = +res.count;
                }).catch(code => {
                    console.log(code);
                })
            },
            current_change(page){
                this.tableData.page = page;
                this.init()
            },
            size_change(size){
                this.tableData.pageSize = size;
                this.init()
            },
            getRuleRow(index, id){//-----获取规则ID
                this.ruleId = id;
            },
            open_rule_affirm(){//----确定开启
                let data = {
                    id: '',
                    rule_id: ''
                };
                data.id = this.selectProduct.map(row => row.id);
                data.rule_id = this.ruleId;
                this.$http(api_open_time_up_lower, data).then(res => {
                    this.$message({type: 'success', message: res.message})
                    this.upLowRuleVisible = false;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message||code})
                })
            },
            grab_listing(){//----跟卖投诉抓取
                if(this.selectProduct.length === 0){
                    this.$message({
                        type:"error",
                        message:this.$t('ymx-list.regularTip')
                    });
                    return
                }
                this.$confirm(this.$t('ymx-list.grabTip'), this.$t('ymx-list.tips'), {
                    confirmButtonText: this.$t('common.confirm'),
                    cancelButtonText: this.$t('common.cancel'),
                    type: 'warning'
                }).then(() => {
                    let data = {
                        id: ''
                    };
                    data.id = this.selectProduct.map(row => row.id).join(',');
                    this.$http(api_amazon_listing_grab,data).then(res => {
                        this.$message({type: 'success', message: res.message})
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message||code})
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.$t('ymx-list.cancelTip')
                    });
                });
            },
            asin_inspect(){
                this.inspectDialog = true;
            }
        },
        computed: {
            judge(){
                 return !!this.selectProduct.find(row=>row.newPrice==='')
                
            }
        },
        watch: {},
        props: {
            selectProduct:{
                required:true,
                type:Array
            }
        },
        components: {
            pageDialog: require('../../../../components/page-dialog.vue').default,
            requestButton:require('../../../../global-components/request-button.vue').default,
            labelItem:require('@/components/label-item.vue').default,
            asinInspect:require('./asin-inspect').default,
        }
    }
</script>

