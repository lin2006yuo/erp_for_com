<template>
    <div class="c-search-time">
        <search-card @search="search" :params="searchData" :clears="clears">
            <div class="mb-mini">
                <label-item label="平台：">
                    <select-remote class="width-sm"
                                   v-sf.channel_id
                                   v-model="searchData.channel_id"
                                   :remote="channel_remote">
                    </select-remote>
                </label-item>
                <label-item label="站点：" class="ml-xs">
                    <el-select :disabled="siteOptions.length<=1"
                               class="width-sm"
                               v-sf.site_code
                               filterable clearable
                               :placeholder="sitePlaceholder"
                               v-model="searchData.site_code">
                        <el-option v-for="item in siteOptions"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value">
                        </el-option>
                    </el-select>
                </label-item>
                <label-item label="账号简称：" class="ml-sm">
                    <el-select :disabled="accoutOptions.length<=1"
                               class="width-sm"
                               v-sf.account_id
                               filterable clearable
                               :placeholder="accountPlaceholder"
                               v-model="searchData.account_id">
                        <el-option v-for="item in accoutOptions"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value">
                        </el-option>
                    </el-select>
                </label-item>
                <label-item label="仓库：" class="ml-sm">
                    <el-select class="width-sm"
                               v-model="searchData.warehouse_id"
                               v-sf.warehouse_id
                               filterable clearable>
                        <el-option v-for="item in warehouseList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </label-item>
                <label-item label="货品：" class="ml-sm">
                    <div class="inline list-position">
                        <span v-for="(item, index) in goods_list">
                            <span v-if="index < 2">
                                <span>{{item.spu_name}}</span>
                                <span v-if="index < 1 && goods_list.length > 1">,</span>
                            </span>
                        </span>
                        <span v-if="goods_list.length >= 2">
                                ...
                        </span>
                        <div class="list-child">
                            <span class="child-name" v-for="item in goods_list">
                                <span>{{item.spu_name}}</span>
                            </span>
                        </div>
                    </div>
                    <span class="operate ml-sm" @click="select_goods">选择货品</span>
                    <span class="operate ml-mini" @click="clear_goods">清空货品</span>
                </label-item>
            </div>

                <label-item label="商品分类：">
                    <el-cascader :options="options"
                                 class="width-sm"
                                 placeholder="可以输入搜索"
                                 size="small"
                                 filterable
                                 change-on-select
                                 expand-trigger="hover"
                                 v-model="searchData.category_id">
                    </el-cascader>
                </label-item>
                <label-item label="开发人员：" class="ml-sm">
                    <param-account
                            class="width-sm"
                            ref="paramDevelopment"
                            v-model="searchData.developer_id"
                            :fixUrl="true"
                            :fixResult="development_fix_result"
                            placeholder="请选择/输入..."
                            type="memberShipDeveloper"
                            url="get|user/development/staffs"
                            v-sf.developer_id>
                    </param-account>
                </label-item>
                <label-item class="ml-sm">
                    <el-select v-model="searchData.snDate"
                               class="width-xs mr-sm"
                               v-sf.snDate>
                        <el-option v-for="type in time_type_list"
                                   :key="type.value"
                                   :label="type.label"
                                   :value="type.value">
                        </el-option>
                    </el-select>
                    <el-date-picker
                            v-model="searchData.date_b"
                            type="date"
                            placeholder="选择日期"
                            class="inline date"
                            v-sf.date_b
                            :picker-options="inputTimeStart">
                    </el-date-picker>
                    <label>&nbsp;--&nbsp;</label>
                    <el-date-picker
                            v-model="searchData.date_e"
                            type="date"
                            placeholder="选择日期"
                            class="inline date"
                            v-sf.date_e
                            :picker-options="inputTimeEnd">
                    </el-date-picker>
                </label-item>
                <label-item label="币种：" class="ml-sm mr-sm">
                    <el-select v-model="searchData.currency_code"
                               class="width-xs"
                               v-sf.currency_code>
                        <el-option v-for="type in currency_list"
                                   :key="type.value"
                                   :label="type.label"
                                   :value="type.value">
                        </el-option>
                    </el-select>
                </label-item>
        </search-card>
        <add-goods v-model="goodsDialog" @add-goods="goods_submit"></add-goods>
    </div>
</template>
<style lang="stylus" scoped>
    .list-position{
        position :relative;
        cursor:default
        .list-child{
            padding :3px 4px;
            position :absolute;
            background :#fff;
            border :1px solid #c6c6c6;
            border-radius:3px;
            z-index :55;
            display :none;
            height:300px;
            overflow :auto;
            .child-name{
                display :flex;
                flex-direction :column;
                align-items :stretch;
                word-break: keep-all;
                white-space:nowrap;
            }
        }
    }
    .list-position:hover .list-child{
        display :block;
    }
    .c-search-time{
        .el-card{
            overflow: inherit;
        }
    }
</style>
<script>
    import {api_get_channel, api_account_list} from  '../../../api/report-channel'
    import {api_get_currency} from '../../../api/commodity-sales'
    import {api_get_categories} from '../../../api/stock-control'
    export default {
        data(){
            return {
                siteOptions:[{label:"",value:""}],
                accoutOptions:[{label:"",value:""}],

                time_type_list:[
                    {label:'发货日期',value:'shipping_time'},
                    {label:'付款日期',value:'pay_time'}
                ],
                development_list:[],
                currency_list:[{label:'全部', value:''}],
                goods_list:[],
                inputTimeStart: {
                    disabledDate: (time)=> {
                        if(this.searchData.date_e){
                            return time.getTime() > this.searchData.date_e;
                        }else {
                            return false
                        }
                    }
                },//开始时间
                inputTimeEnd: {
                    disabledDate: (time)=> {
                        if(this.searchData.date_b){
                            return time.getTime() < this.searchData.date_b;
                        }else {
                            return false
                        }
                    }
                },//结束时间
                goodsDialog:false,
                options: [],
                thisType:'',
            }
        },
        mounted(){
            this.get_site(this.searchData.channel_id);
            this.$refs.paramDevelopment.init();
            this.get_currency();
            this.categories_init();
        },
        methods: {
            development_fix_result(res){
                return  res.map(row=>{
                    return {
                        value:row.id,
                        label:row.realname
                    }
                })
            },
            get_currency(){
                this.$http(api_get_currency).then(res=>{
                    let res_currency_list = res.map(row=>{
                        return {label:row.code, value:row.code}
                    });
                    this.currency_list.push(...res_currency_list);
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                })
            },
            categories_init(){
                this.$http(api_get_categories).then(res=>{
                    this.options = res.map(row=>{
                        return {
                            value:row.id,
                            label:row.title,
                            children:row.childs.map(ch=>{
                                return {
                                    value:ch.id,
                                    label:ch.title,
                                }
                            })
                        }
                    });
                    let cur = {label:"全部",value:""};
                    this.options.unshift(cur);
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                })
            },
            channel_remote(callback){
                return this.$http(api_get_channel,{}).then(res=>{
                    callback(res);
                }).catch(code=>{
                    console.log(code);
                });
            },
            get_site(channel_id){
                if(!channel_id)return this.siteOptions = [{label:"",value:""}];
                this.$http(api_account_list,{channel_id:channel_id}).then(res=>{
                    if(res.site.length<=0){
                        if(res.account.length>0){
                            res = res.account;
                            this.accoutOptions = [{label:"全部",value:""},...res];
                        }else{
                            this.accoutOptions = [{label:"",value:""}];
                        }
                        this.siteOptions = [{label:"",value:""}]
                    }else{
                        res = res.site;
                        this.siteOptions = [{label:"全部",value:""},...res];
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            get_account(channel_id,site_code){
                if(!channel_id||!site_code)return this.accoutOptions = [{label:"",value:""}];
                this.$http(api_account_list,{channel_id:channel_id,site_code:site_code}).then(res=>{
                    if(res.account.length>0){
                        res = res.account;
                        this.accoutOptions = [{label:"全部",value:""},...res];
                    }else{
                        this.accoutOptions = [{label:"",value:""}];
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            search(){
                this.$emit('search');
            },
            select_goods(){
                this.goodsDialog = true;
            },
            clear_goods(){
                this.goods_list = [];
                this.searchData.sku_ids = [];
            },
            //子组件添加商品传过来的
            goods_submit(val){
                this.goods_list = val;
                this.searchData.sku_ids = this.goods_list.map(row=>{
                    return row.sku_id;
                });
            },
        },
        computed: {
            accountPlaceholder(){
                if((this.searchData.site_code<=0&&this.accoutOptions.length>1) || this.searchData.site_code>0){
                    return "请选择账号";
                }else if(this.searchData.site_code<=0){
                    return "请先选择站点";
                }else if(this.accoutOptions.length<=1){
                    return "该站点下暂无账号";
                }
            },
            sitePlaceholder(){
                if(this.searchData.channel_id<=0){
                    return "请先选择平台";
                }else if(this.siteOptions.length<=1){
                    return "该平台下暂无站点";
                }else{
                    return "请选择站点"
                }
            },
        },
        watch: {
            'searchData.channel_id'(val){
                this.searchData.site_code ='';
                this.searchData.account_id = "";
                this.siteOptions = [{label:"",value:""}];
                this.accoutOptions = [{label:"",value:""}];
                this.get_site(val);
            },
            'searchData.site_code'(val){
                this.searchData.account_id = "";
                this.get_account(this.searchData.channel_id,val);
            },
        },
        props: {
            searchData:{
            	type:Object
            },
            clears:{
            	type:Object
            },
            warehouseList:{
            	type:Array
            }
        },
        components: {
            labelItem:require('../../../components/label-item.vue').default,
            selectRemote:require('../../../components/select-remote.vue').default,
            addGoods:require('../../../api-components/add-goods.vue').default,
            paramAccount:require('../../../api-components/param-account.vue').default,
            searchCard:require('../../../components/search-card.vue').default
        },
    }
</script>
