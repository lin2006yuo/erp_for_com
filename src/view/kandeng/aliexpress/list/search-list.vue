<template>
    <div class="p-search">
        <search-card @search="search" :params="searchData" :clears="clears">
            <div class="mb-mini">
                <el-select v-sf.snType v-model="searchData.snType"
                           class="inline s-width-small">
                    <el-option
                        :key="item.value"
                        v-for="item in goods"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <order-input v-if="isMultiRow" v-model="searchData.snText"
                             class="inline mr-sm s-width-large"
                             v-sf.snText
                             @keydown="search"
                             placeholder="可批量搜索，Shift+回车换行..."></order-input>
                <el-input v-else placeholder="请输入搜索内容..."
                          v-sf.snText
                          @keydown.enter.native="search"
                          v-model="searchData.snText"
                          clearable
                          style="width:180px"
                          class="inline mr-sm enter-result"></el-input>
                <label>账号简码：</label>
                <param-account  v-sf.account_id  v-model="searchData.account_id"
                                type="smtPublishAccount"
                                url="get|aliexpress-accounts"
                                :fixResult="fixAccount"
                                placeholder="输入可搜索更多..."
                                class="inline mr-sm s-width-default">
                </param-account>
                <label>平台状态：</label>
                <el-select v-sf.status v-model="searchData.status"
                           placeholder="全部" class="inline mr-sm s-width-default">
                    <el-option
                        :key="item.id"
                        v-for="item in statusList"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
                <label class="inline">本地状态：</label>
                <el-select v-sf.local_status v-model="searchData.local_status"
                           placeholder="全部" clearable class="inline mr-sm s-width-small">
                    <el-option
                        v-for="item in sellStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <label class="inline mb-mini">刊登工具：</label>
                <el-select v-sf.application v-model="searchData.application"
                           placeholder="全部" clearable class="inline mr-sm s-width-small">
                    <el-option
                        v-for="item in appliList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <label class="inline mb-mini">销售员：</label>
                <param-account
                        class="inline s-width-small"
                        ref="paramSale"
                        placeholder="可输入搜索"
                        v-model="searchData.salesperson_id"
                        :param="{type:'sales',data:{content:''}}"
                        :fixUrl="true"
                        :fixResult="sale_fix_result"
                        type="memberShipSales"
                        url="get|user/:type/staffs">
                </param-account>
                <label class="ml-sm">价格变动：</label>
                <el-select class="inline width-xs"
                           v-sf.adjusted_price
                           v-model="searchData.cost_price_type">
                    <el-option v-for="item in priceChange"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
                <el-input  placeholder="金额幅度"
                           :disabled="disabledPrice"
                           v-sf.adjust_range
                           v-model="searchData.cost_price"
                           class="inline width-xs"></el-input>
            </div>
            <label>到期时间：</label>
            <el-select v-sf.expire_day v-model="searchData.expire_day"
                       placeholder="全部" clearable class="inline mr-sm s-width-middle">
                <el-option
                    :key="item.id"
                    v-for="item in expires"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
            <el-select class="inline ml-sm s-width-small"
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
            <el-date-picker class="inline date" v-sf.start v-model="searchData.start" type="date"
                            :picker-options="pickerstart" placeholder="开始时间"></el-date-picker>
            -
            <el-date-picker class="inline date mr-sm" v-sf.end v-model="searchData.end"
                            type="date" placeholder="结束时间" :picker-options="pickerend"></el-date-picker>
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
    import {api_aliexpress_product_status,api_aliexpress_expire_search} from "../../../../api/publish-smt"
    export default{
        data(){
            return {
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.searchData.end){
                            return  time.getTime() > this.searchData.end;
                        }else {
                            return false;
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.searchData.start){
                            return  time.getTime() < this.searchData.start;
                        }else {
                            return false;
                        }
                    }
                },
                goods:[
                    {
                        value: 'sku',
                        label: '本地SKU'
                    }, {
                        value: 'spu',
                        label: '本地SPU'
                    }, {
                        value: 'product_id',
                        label: '商品平台ID'
                    }, {
                        value: 'title',
                        label: '刊登标题'
                    },
                ],
                sellStatus:[
                    {label:"全部",value:""},
                    {label:"在售",value:1},
                    {label:"停售",value:2},
                    {label:"卖完下架",value:4},
                    {label:"缺货",value:5},
                ],
                snTypeList:[
                    {label:"更新时间",value:'last_updated'},
                    {label:"上传时间",value:'date_uploaded'},
                ],
                statusList:[],
                expires:[],
                appliList:[
                    {label:"全部",value:""},
                    {label:"erp刊登",value:1},
                    {label:"非erp刊登",value:0},
                ],
                priceChange:[
                    {label:'全部',value:0},
                    {label:'涨价',value:1},
                    {label:'降价',value:2},
                    {label:'无',value:3}
                ],
                disabledPrice:true,
            }
        },
        created(){
            this.get_status();
            this.get_expires();
        },
        methods:{
            //获取销售员
            sale_fix_result(res){
                return  res.map(row=>{
                    return {
                        value:row.id,
                        label:row.realname
                    }
                })
            },
            //获取产品状态
            get_status(){
                this.$http(api_aliexpress_product_status).then(res=> {
                    this.statusList = res;
                    this.searchData.status=res[0].id;
                }).catch(code=> {
                    console.log(code)
                })
            },
            get_expires(){
                this.$http(api_aliexpress_expire_search).then(res=> {
                    this.expires = [{name:"全部",id:""},...res];
//                    this.searchData.expire_day=res[0].id;
                }).catch(code=> {
                    console.log(code)
                })
            },
            fixAccount(res){
                return res.map(row=>{
                    return {
                        label:row.code,
                        value:row.account_id
                    }
                });
            },
            search(){
                this.$emit("search",this.searchData);
            }
        },
        computed:{
            isMultiRow() {
                return this.searchData.snType === 'spu' || this.searchData.snType === 'product_id'
            },
        },
        watch:{
            'searchData.cost_price_type'(val){
                if(val === 0 || val === ''){
                    this.disabledPrice = true;
                    this.searchData.cost_price = '';
                }else if(val === 3) {
                    this.disabledPrice = true;
                    this.searchData.cost_price = 0;
                }else{
                    this.searchData.cost_price = '';
                    this.disabledPrice = false;
                }
            },
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
            labelItem:require("@/components/label-item.vue").default,
            searchCard:require('@/components/search-card.vue').default,
            paramAccount:require("@/api-components/param-account.vue").default,
            orderInput:require('@/components/order-input').default,
        }
    }
</script>
