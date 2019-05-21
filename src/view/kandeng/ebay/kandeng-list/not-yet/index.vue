<template>
    <div class="c-not-yet">
        <search-card @search="search"
                     @enter="search"
                     :params="params"
                     :clears="clears"
                     :is-search="isSearch">
            <label class="inline ml-sm mb-mini">{{$t('ebay-list.site')}}：</label>
            <el-select class="inline s-width-default mb-mini"
                       v-model="params.site"
                       :placeholder="$t('ebay-list.SelectSite')" filterable clearable>
                <el-option
                    :key="item.value"
                    v-for="item in siteList"
                    :label="item.label"
                    :value="item.id"
                ></el-option>
            </el-select>
            <label class="inline ml-sm mb-mini">{{$t('ebay-list.account')}}：</label>
            <super-select class="inline mr-sm mb-mini s-width-default"
                          v-model="params.account"
                          :options="accountList"
                          :disabled="accountList.length<=0"
                          storageKey="ebayAccount">
            </super-select>
            <el-select class="inline s-width-default mb-mini" v-model="params.snType">
                <el-option
                    :key="item.value"
                    v-for="item in snTypeList"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
            <order-input v-model="params.snText"
                         v-if="params.snType==='spu'"
                         class="inline mr-sm width-super mb-mini"
                         v-sf.snText
                         @keydown.native="enter_search"
                         :placeholder="$t('ebay-list.searchTip')"></order-input>
            <el-input v-sf.snText v-else v-model="params.snText" @keydown="search"
                      :placeholder="$t('ebay-list.fuzzySearch')"
                      class="inline mr-sm width-super mb-mini"></el-input>
            <label class="mb-mini">{{$t('ebay-list.pc')}}：</label>
                <el-cascader
                    clearable
                    expand-trigger="hover"
                    class="mr-sm mb-mini"
                    v-model="params.category_id"
                    :options="categoryTree"
                    change-on-select
                ></el-cascader>
            <br />
            <label class="mb-mini">{{$t('ebay-list.PDate')}}：</label>
            <el-date-picker class="inline date" v-sf.start_date v-model="params.start_date" type="date"
                            :picker-options="pickerstart" :placeholder="$t('ebay-list.sTime')"></el-date-picker>
            -
            <el-date-picker class="inline date mr-sm" v-sf.end_date
                            v-model="params.end_date" type="date"
                            :placeholder="$t('ebay-list.eTime')"
                            :picker-options="pickerend"></el-date-picker>
            <label class="mb-mini">{{$t('ebay-list.IsThereTemplate')}}：</label>
            <el-select class="inline s-width-mini mb-mini"
                       v-model="params.draft_flag"
                       filterable clearable>
                <el-option
                    :key="item.value"
                    v-for="item in draft_record"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
        </search-card>
        <ui-table
            ref="table" class="mt-sm"
            v-loading="loading"  :element-loading-text="$t('ebay-list.playLoad')" :body-height="41" :first-loading="firstLoading"
            :has-data="table&&table.length>0"
            :heads="[
                        {label:$t('ebay-list.image'),width:10},
                        {label:$t('ebay-list.localspu'),width:10},
                        {label:$t('ebay-list.zhName'),width:20},
                        {label:$t('ebay-list.enName'),width:20},
                        {label:$t('ebay-list.localClass'),width:10},
                        {label:$t('ebay-list.salesStatus'),width:10},
                        {label:$t('ebay-list.PDate'),width:10},
                        {label:$t('ebay-list.operat'),width:10},
                       ]">
            <tbody>
            <template>
                <tr v-for="(row,index) in table" :key="row.id">
                    <td>
                        <el-popover
                            placement="right"
                            trigger="hover">
                            <img v-lazy="middle_img(row.thumb,'_60x60.')"  @click="large_img(row.thumb)" width="200px" height="200px">
                            <span slot="reference">
                              <img v-lazy="row.thumb" height="60px" width="60px" @click="large_img(row.thumb)" style="border:none">
                            </span>
                        </el-popover>
                    </td>
                    <!--本地spu-->
                    <td class="relative">
                        <span class="copyright tip_icon" :title="$t('ebay-list.tipRight')" v-if="!!row.tort_flag" @click="get_RightRocord(row)">{{$t('ebay-list.Right')}}</span>
                        <span :class="['tip_icon','draft_icon',!!row.tort_flag&&!!row.draft_flag?'draft_icontop':'']" :title="$t('ebay-list.ModelMarker')" v-if="!!row.draft_flag">{{$t('ebay-list.model')}}</span>
                        <span class="tip_icon price_icon" :class="classObject(row)" v-if="!!row.discount_flag" @click="get_priceDown(row)">跌价</span>
                        <ui-tip :is-operate="true" :content="row.spu" :width="98"
                                @cur-click="distribution(row)"></ui-tip>
                    </td>
                    <td><ui-tip :content="row.name" :width="90"></ui-tip></td>
                    <td><ui-tip :content="row.en_title" :width="90"></ui-tip></td>
                    <td><ui-tip :content="row.category_name" :width="90"></ui-tip></td>
                    <td><span :class="[row.platform_sale_status==='禁止上架'?'red':'']">{{row.platform_sale_status}}</span></td>
                    <td><times :time="row.publish_time"></times></td>
                    <td>
                        <permission tag="ElButton"  size="mini" type="primary"
                                    @click.native='publish(row)' :route="apis.url_get_unpublished">{{$t('ebay-list.up')}}</permission>
                    </td>
                </tr>
            </template>
            </tbody>
        </ui-table>
        <el-pagination
            class="page-fixed"
            @size-change="size_change"
            @current-change="current_change"
            :current-page="page"
            :page-sizes="[20, 50, 100, 200,500]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="count">
        </el-pagination>
        <look-edit v-model="lookVisable"
                   :showedit="showedit"
                   :goodsId="goodsId"
                   :spu="spu" ref="looks"
                   :child-active-name="activeName"
                   @reflash="reflash"
                   :edit-able="editAble"
                   @change-data="change_data"></look-edit>
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="$t('ebay-list.viewLarger')"></blowup-image>
        <fanseright-dialog v-model="copyrightShow"
                           :look-tip="false"
                           :spu-name="spuName"
                           :tableData="tableData"></fanseright-dialog>
        <price-down-dialog v-model="priceDownShow" :title="priceTitle" :priceDownData="priceDownData"></price-down-dialog>
    </div>
</template>
<style lang="stylus" scoped>
    .c-not-yet{
        .el-card{
            overflow: inherit;
        }
        .draft_icon{
            color green;
            border:1px solid green;
        }
        .draft_icontop{
            top: 18px!important;
        }
        .price_icontop{
            top: 36px!important;
        }
        .price_icon{
            color #660033;
            border:1px solid #660033;
        }
        .tip_icon{
            position absolute;
            display: inline-block;
            vertical-align: middle;
            cursor: pointer;
            left 0;
            top:0;
            height: 16px;
            line-height: 16px;
        }
        .copyright{
            color red;
            border:1px solid red;
        }
    }
</style>
<script >
    import {api_get_unpublished,url_get_unpublished,api_get_account} from '../../../../../api/ebay-kandeng-public-module';
    import {api_get_goods_description} from '@/api/product-library';
    import {api_joom_category_tree,} from '../../../../../api/joom-set-classify'
    export default{
        permission: {
            url_get_unpublished
        },
        page:{
            devinfo:{
                frontEnd:'王月如',
                backEnd:'曾绍辉',
                createTime:'2017-6-30',
                updateTime:'2017-10-10'
            }
        },
        data(){
            return {
                priceDownData:{},
                priceDownShow:false,
                priceTitle:'',
                spuName:'',
                copyrightShow:false,
                tableData:[],
                table:[],
                accountList:[],
                snTypeList:[
                    {label:this.$t('ebay-list.localspu'),value:"spu"},
                    {label:this.$t('ebay-list.itemName'),value:"name"},
                    {label:this.$t('ebay-list.localsku'),value:"sku"},
                ],
                loading:false,
                page:1,
                pageSize:50,
                count:0,
                draft_record:[{label:this.$t('ebay-list.all'),value:''},{label:this.$t('ebay-list.yes'),value:1},{label:this.$t('ebay-list.no'),value:0}],
                params:{
                    draft_flag:'',
                    snType:"spu",
                    snText:"",
                    account:"",
                    site:"",
                    category_id:[],
                    start_date:"",
                    end_date:""
                },
                clears:{
                    category_id:[],
                    snType:"spu",
                },
                firstLoading:true,
                lookVisable:false,
                showedit:false,
                activeName:'ebay平台',
                goodsId:0,
                spu:"",
                accountId:"",
                imgDialog: false,
                imgPath:"",
                parentClick:true,
                categoryTree: [],
                editAble:false,
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.params.end_date){
                            return  time.getTime() > this.params.end_date;
                        }else {
                            return false;
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.params.start_date){
                            return  time.getTime() < this.params.start_date;
                        }else {
                            return false;
                        }
                    }
                },
            }
        },
        mounted(){
//            this.init()
            this.get_category_tree();
        },
        filters:{
            filertTime(val){
                return val?datef('YYYY-MM-dd',val):'-- --'
            }
        },
        watch:{
            "params.site"(val){
                this.get_account();
            }
        },
        computed:{
            comPlaceholder(){
                if(this.params.site!==""&&this.accountList.length<=0){
                    return this.$t('ebay-list.noCount');
                }else if(this.params.site!==""&&this.accountList.length>0){
                    return this.$t('ebay-list.inputSearch');
                }else{
                    return this.$t('ebay-list.detailSite');
                }
            },
            isSearch(){
                return !this.params.account;
            },
        },
        methods:{
            classObject(row){
                if(!!row.tort_flag&&!!row.draft_flag){
                    return 'price_icontop';
                }else if(!row.tort_flag&&!row.draft_flag){
                    return '';
                }else {
                    return 'draft_icontop';
                }
            },
            //获取跌价补贴信息
            get_priceDown(data){
                this.priceDownData=data;
                this.priceDownShow=true;
                this.priceTitle=`${data.spu}补贴信息`;
            },
            //获取侵权记录
            get_RightRocord(data){
                this.spuName=data.spu;
                this.$http(api_get_goods_description, data.id, {page: 1, page_size: 50})
                    .then(res => {
                        this.copyrightShow=true;
                        this.tableData=res.list;
                    }).catch(err => {
                        console.log(err + '出错了');
                    })
            },
            get_category_tree(){
                this.$http(api_joom_category_tree).then(res => {
                    this.categoryTree = this.data_format(res.data);
                });
            },
            data_format(val){
                if (val.length === 0) {
                    return null
                }
                return val.map(item => {
                    return {
                        label: item.title,
                        value: item.id,
                        children: this.data_format(item.childs)
                    }
                });
            },
            change_data(){},
            reflash(){},
            middle_img(image){
                return image.replace('_60x60.','_200x200.');
            },
            large_img(image){
                this.imgPath = image.replace('_60x60.','_500x500.');
                this.imgDialog = true;
            },
            distribution(data){
                this.lookVisable = true;
                this.goodsId = data.id;
                this.spu = data.spu;
                this.showedit = true;
                this.$nextTick(()=>{
//                    this.$refs.looks.editAble = true;
                    this.$refs.looks.titleName = `${this.$t('ebay-list.viewSpu')}${data.spu}  `;
                })
            },
            publish(data){
                let find = this.siteList.find(it=>it.id===this.params.site);
                let params={
                    siteList:this.siteList,
                    draft_flag:data.draft_flag,
                    id:data.id,
                    goods_id:data.goods_id,
                    isAdd:true,
                    isCopy:false,
                    isCopyListing:false,
                    curPage:'notYet',
                    default_account_id:this.params.account,
                    default_site_id:this.params.site,
                    site_code:find.value
                };//---查看标示id为1
                this.$open(`/add-listing?id=${data.id}`,params)
            },
            enter_search(e){
                if(!e.shiftKey && e.keyCode === 13){
                    this.search()
                }
            },
            search(e){
                this.firstLoading = false;
                this.init();
            },
            size_change(size){
                this.pageSize = size;
                this.init();
            },
            current_change(page){
                this.page = page;
                this.init();
            },
            //  列表
            init(){
                if(this.params.site===''&&!this.params.account)return;
                let params = {
                    draft_flag:this.params.draft_flag,
                    page: this.page,
                    pageSize: this.pageSize,
                    snType: this.params.snType,
                    snText: this.params.snText,
                    account: this.params.account,
                    site: this.params.site,
                    category_id:this.params.category_id.length<=1?this.params.category_id.join(','):this.params.category_id[this.params.category_id.length-1],
                    start_date:this.params.start_date ? datef("YYYY-MM-dd",this.params.start_date/1000) : '',
                    end_date:this.params.end_date ? datef("YYYY-MM-dd",this.params.end_date/1000) : '',
                };
                if(this.params.snType==='spu'){
                    let snText = this.params.snText.replace(new RegExp('\n', 'gm'), '\n');
                    let cur = snText.split('\n').filter(row=>!!row);
                    if(cur&&cur.length>1){
                        params.snText = cur.map(row=>row.trim());
                    }else if(cur&&cur.length===1){
                        params.snText =  this.params.snText.trim();
                    }
                }else{ // 产品名称&&本地SKU 不支持批量搜索
                    params.snText =  this.params.snText;
                }
                this.loading = true;
                this.$http(api_get_unpublished, params).then(res => {
                    this.loading = false;
                    this.table = res.data;
                    this.count = res.count;
                }).catch(code => {
                    console.log(code);
                    setTimeout(() => {
                        this.loading = false;
                    }, 200);
                });
            },
            get_account(){//获取账号
                this.accountList = [];
                this.params.account = "";
                if(this.params.site==="")return;
                this.$http(api_get_account,{site:this.params.site}).then(res=>{
                    this.accountList = res.data.map(row=>{
                        return {
                            label:row.code,
                            value:row.id
                        };
                    });
                    this.params.account = this.accountList[0].value;

                }).catch(code=>{
                    console.log(code);
                })
            },
        },
        props:{
            siteList:{
                required:true,
                type:Array
            },
        },
        components: {
            paramAccount:require("../../../../../api-components/param-account.vue").default,
            searchCard:require('../../../../../components/search-card.vue').default,
            uiTip:require('../../../../../components/ui-tip.vue').default,
            uiTable:require("../../../../../components/ui-table.vue").default,
            lookEdit:require("../../../../product/manager/look-edit.vue").default,
            blowupImage:require("../../../../../components/blowup-image.vue").default,
            orderInput:require("../../../../../components/order-input.vue").default,
            uiGroups: require("../../../../../components/ui-groups.vue").default,
            fanserightDialog:require("./fanseright-dialog").default,
            priceDownDialog:require("./price-down-dialog").default,
        }
    }
</script>
