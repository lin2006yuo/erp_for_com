<template>
    <div class="p-search">
        <search-card @search="search" :params="searchData" :clears="clears">
            <div class="mb-mini">
                <el-select class="inline width-sm"
                           v-model="searchData.nType"
                           v-sf.nType>
                    <el-option :label="item.label"  :value="item.value" :key="item.value" v-for="item in optionsss"></el-option>
                </el-select>
                <order-input v-if="isMultiRow" v-model="searchData.nContent"
                             class="inline mr-sm s-width-large"
                             v-sf.nContent
                             @keydown="search"
                             placeholder="可批量搜索，Shift+回车换行..."></order-input>
                <el-input v-else class="inline mr-sm" style="width:180px" placeholder="请输入搜索内容..."
                           v-model="searchData.nContent"
                          @keydown.enter.native="search"
                           v-sf.nContent></el-input>
                <label> 账号简称：</label>
                <param-account  v-model="searchData.accountVal"
                                v-sf.accountVal
                                type="wishPublishAccount"
                                 url="get|publish/wish/getSellers"
                                 :fixResult="fixAccount"
                                 placeholder="全部"
                                 class="has-inline s-width-default mr-sm">
                </param-account>
                <label class="inline">审核状态：</label>
                <el-select  class="inline mr-sm s-width-small"
                            v-model="searchData.review_status"
                            v-sf.review_status clearable>
                    <el-option
                        :key="item.value"
                        v-for="item in goods"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <label class="inline">平台状态：</label>
                <el-select v-model="searchData.enabled"
                           v-sf.enabled clearable
                           class="inline mr-sm s-width-small">
                    <el-option
                        :key="item.value"
                        v-for="item in stautess"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <label class="inline">WishExpress：</label>
                <el-select v-sf.wish_express
                           v-model="searchData.wish_express"
                           filterable
                           class="inline mr-sm s-width-small">
                    <el-option
                        :key="item.value"
                        v-for="item in expressList"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <label class="inline">是否促销：</label>
                <el-select class="inline s-width-small"
                           v-model="searchData.is_promoted"
                           v-sf.is_promoted
                           filterable>
                    <el-option
                            v-for="res in promotedList"
                            :label="res.label"
                            :value="res.value"
                            :key="res.value"
                    ></el-option>
                </el-select>
                <label class="ml-sm">是否出单：</label>
                <el-select v-model="searchData.number_sold"
                           v-sf.number_sold
                           class="inline s-width-small"
                           filterable>
                    <el-option
                        v-for="res in numberSoldList"
                        :label="res.label"
                        :value="res.value"
                        :key="res.value"
                    ></el-option>
                </el-select>
                <label class="inline">本地状态：</label>
                <el-select v-sf.sell_status
                           v-model="searchData.sell_status"
                           clearable class="inline mr-sm s-width-small">
                    <el-option
                        v-for="item in sellStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <el-select v-sf.searchPrice
                       v-model="searchData.searchPrice"
                       class="inline s-width-small">
                <el-option
                        v-for="res in priceList"
                        :label="res.label"
                        :value="res.value"
                        :key="res.value"
                ></el-option>
            </el-select>
            <ui-limit-number class="inline s-width-small"
                             v-model="searchData.minPrice"
                             v-sf.minPrice
                             :limit="2"
                             :placeholder="complaceholder"
            ></ui-limit-number>&nbsp;--&nbsp;<ui-limit-number
                class="inline s-width-small"
                v-model="searchData.maxPrice"
                v-sf.maxPrice
                :limit="2"
                :placeholder="complaceholder"></ui-limit-number>
            <label class="ml-sm">销售员：</label>
            <el-select v-model="searchData.uid"
                       class="inline s-width-small"
                       v-sf.uid
                       filterable clearable>
                <el-option
                    v-for="res in sellerList"
                    :label="res.label"
                    :value="res.value"
                    :key="res.value"
                ></el-option>
            </el-select>
            <label class="ml-sm">刊登工具：</label>
            <el-select v-model="searchData.application"
                       class="inline width-sm"
                       filterable clearable>
                <el-option
                    v-for="res in applicationList"
                    :label="res.label"
                    :value="res.value"
                    :key="res.value"
                ></el-option>
            </el-select>
            <label class="ml-sm">价格变动：</label>
            <el-select class="inline width-xs"
                       v-sf.adjusted_price
                       v-model="searchData.adjusted_price">
                <el-option v-for="item in priceChange"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
            <el-input  placeholder="金额幅度"
                       :disabled="disabledPrice"
                       v-sf.adjust_range
                       v-model="searchData.adjust_range"
                       class="inline width-xs"></el-input>
            <el-select class="inline ml-sm width-xs"
                       v-model="searchData.ntime"
                       v-sf.ntime
                       filterable>
                <el-option
                    v-for="res in snTypeList"
                    :label="res.label"
                    :value="res.value"
                    :key="res.value"
                ></el-option>
            </el-select>
            <el-date-picker class="inline" style="width:120px"
                            v-model="searchData.start_time"
                            v-sf.start_time
                             type="date"
                            :picker-options="pickerstart"
                            placeholder="开始时间">
            </el-date-picker>&nbsp;--&nbsp;<el-date-picker class="inline mr-sm"
                                                           :picker-options="pickerend"
                                                           style="width:120px"
                                                           v-model="searchData.end_time"
                                                           v-sf.end_time
                                                           type="date" placeholder="结束时间"></el-date-picker>
        </search-card>
    </div>
</template>
<style lang="stylus">
    .td-ul{
        text-decoration: underline;
    }
    .p-search {
        position: relative;
        height: 100%;
        .el-card{
            overflow: visible;
        }
    }
</style>
<script>
    import {api_aliexpress_product_status,api_aliexpress_expire_search} from "../../../../api/publish-smt";
    import {api_get_wish_users} from "../../../../api/kandeng"
    export default{
        data(){
            return {
                numberSoldList:[
                    {label:"全部",value:""},
                    {label:"售出",value:1},
                    {label:"未售出",value:0},
                ],
                applicationList:[
                    {label:'erp刊登',value:1},
                    {label:'非erp刊登',value:0},
                ],
                snTypeList:[
                    {label:"更新时间",value:'last_updated'},
                    {label:"上传时间",value:'date_uploaded'},
                ],
                promotedList:[
                    {label:"全部",value:''},
                    {label:"是",value:1},
                    {label:"否",value:0},
                ],
                sellerList:[],
                priceList:[
                    {label:"总售价",value:"total"},
                    {label:"销售价",value:"price"},
                    {label:"运费",value:"shipping"},
                ],
                goods:[
                    {label:"全部",value:""},
                    {label:"已批准",value:1},
                    {label:"被拒绝",value:2},
                    {label:"待审核",value:3},
                ],
                stautess:[
                    {label:"全部",value:""},
                    {label:"上架",value:1},
                    {label:"下架",value:0},
                ],
                sellStatus:[
                    {label:"全部",value:""},
                    {label:"在售",value:1},
                    {label:"停售",value:2},
                    {label:"卖完下架",value:4},
                    {label:"缺货",value:5},
                ],
                optionsss:[
                    {label:"平台产品ID",value:"product_id"},
                    {label:"本地SPU",value:"spu"},
                    {label:"平台SKU",value:"sku"},
                    {label:"本地SKU",value:"local_sku"},
                    {label:"商品刊登标题",value:"name"},
                ],
                expressList:[
                    {value: '', label: '全部'},
                    {value: 1, label: '是'},
                    {value: 0, label: '否'},
                ],
                accountOption:[
                    {label:"账号",value:"full"},
                    {label:"简称",value:"short"},
                ],
                priceChange:[
                    {label:'全部',value:0},
                    {label:'涨价',value:1},
                    {label:'降价',value:2},
                    {label:'无',value:3}
                ],
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.searchData.end_time){
                            return  time.getTime() > this.searchData.end_time;
                        }else {
                            return false;
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.searchData.start_time){
                            return  time.getTime() < this.searchData.start_time;
                        }else {
                            return false;
                        }
                    }
                },
                disabledPrice:true,
            }
        },
        created(){
            this.get_wish_users();
        },
        methods:{
            get_wish_users(){
                this.$http(api_get_wish_users).then(res=>{
                    this.sellerList = res.map(row=>{
                        return {
                            label:row.realname,
                            value:row.id
                        }
                    });
                }).catch(code=>{
                    console.log(code,'code');
                })
            },
            fixAccount(res){
                return res.data.map(row=>{
                    return {
                        label:row.code,
                        value:row.id,
                    }
                })
            },
            search(){
                if (this.searchData.start_time){
                    let params = new Date(this.searchData.start_time).getTime()/1000;
                    this.searchData.start_time = datef("YYYY-MM-dd",params);
                }
                if (this.searchData.end_time) {
                    let params = new Date(this.searchData.end_time).getTime()/1000;
                    this.searchData.end_time = datef("YYYY-MM-dd",params);
                }
                this.$emit("search",this.searchData);
            },
        },
        computed:{
            complaceholder(){
                switch(this.searchData.searchPrice){
                    case 'total':
                        return '销售价+运费';
                        break;
                    case 'price':
                        return '销售价';
                        break;
                    case 'shipping':
                        return '运费';
                        break;
                }
            },
            isMultiRow(){
                return this.searchData.nType === 'product_id' || this.searchData.nType === 'spu' || this.searchData.nType === 'local_sku'
            }
        },
        watch:{
            'searchData.adjusted_price'(val){
                if(val === 1){
                    this.disabledPrice = true;
                    this.searchData.adjust_range = '';
                }else if(val === 4) {
                    this.disabledPrice = true;
                    this.searchData.adjust_range = 0;
                }else{
                    this.searchData.adjust_range = '';
                    this.disabledPrice = false;
                }
            },
            "searchData.accountType"(val){
                this.searchData.accountVal = "";
            }
        },
        props:{
            searchData: {
                required:true,
                type:Object,
            },
            clears: {
                required:true,
                type:Object,
            },
        },
        components:{
            labelItem:require("../../../../components/label-item.vue").default,
            searchCard:require('../../../../components/search-card.vue').default,
            paramAccount:require("../../../../api-components/param-account.vue").default,
            uiLimitNumber:require('../../../../components/ui-limit-number.vue').default,
            orderInput:require('@/components/order-input').default,
        }
    }
</script>
