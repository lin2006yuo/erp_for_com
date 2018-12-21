<template>
    <div class="c-not-yet">
        <search-card @search="search"
                     @enter="search"
                     :params="params"
                     :clears="clears"
                     :is-search="isSearch">
            <label class="inline ml-sm mb-mini">站&nbsp;&nbsp;&nbsp;&nbsp;点：</label>
            <el-select class="inline s-width-default mb-mini"
                       v-model="params.site"
                       placeholder="请选择站点" filterable clearable>
                <el-option
                    :key="item.value"
                    v-for="item in siteList"
                    :label="item.label"
                    :value="item.id"
                ></el-option>
            </el-select>
            <label class="inline ml-sm mb-mini">账号简介：</label>
            <el-select v-model="params.account"
                       class="inline mr-sm mb-mini s-width-default"
                       :placeholder="comPlaceholder"
                       filterable clearable
                       :disabled="accountList.length<=0" >
                <el-option v-for="item in accountList"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
            </el-select>
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
                         @keydown="search"
                         placeholder="可批量搜索，Shift+回车换行..."></order-input>
            <el-input v-sf.snText v-else v-model="params.snText" @keydown="search"
                      placeholder="产品名称&本地SKU支持模糊搜索..."
                      class="inline mr-sm width-super mb-mini"></el-input>
            <label class="ml-sm mb-mini">产品分类：</label>
            <ui-groups class="mr-sm mb-mini" v-model="params.category_id" v-sf.category_id
                       :parent-click="parentClick"
                       :option="categoryTree"></ui-groups>
            <br />
            <label class="mb-mini">发布时间：</label>
            <el-date-picker class="inline date" v-sf.start_date v-model="params.start_date" type="date"
                            :picker-options="pickerstart" placeholder="开始时间"></el-date-picker>
            -
            <el-date-picker class="inline date mr-sm" v-sf.end_date
                            v-model="params.end_date" type="date"
                            placeholder="结束时间" :picker-options="pickerend"></el-date-picker>

        </search-card>
        <ui-table
            ref="table" class="mt-sm"
            v-loading="loading"  element-loading-text="玩命加载中..." :body-height="41" :first-loading="firstLoading"
            :has-data="table&&table.length>0"
            :heads="[
                        {label:'产品图片',width:10},
                        {label:'本地SPU',width:10},
                        {label:'产品中文名称',width:20},
                        {label:'产品英文名称',width:20},
                        {label:'本地分类',width:10},
                        {label:'销售平台状态',width:10},
                        {label:'发布时间',width:10},
                        {label:'操作',width:10},
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
                    <td>
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
                                    @click.native='publish(row)' :route="apis.url_get_unpublished">刊登</permission>
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
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
    </div>
</template>
<style lang="stylus" scoped>
    .c-not-yet{
        .el-card{
            overflow: inherit;
        }
    }

</style>
<script >
    import {api_get_unpublished,url_get_unpublished} from '../../../../../api/ebay-kandeng-public-module';
    import {api_get_account} from '../../../../../api/ebay-kandeng-public-module';
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
                table:[],
                accountList:[],
                snTypeList:[
                    {label:"本地SPU",value:"spu"},
                    {label:"产品名称",value:"name"},
                    {label:"本地SKU",value:"sku"},
                ],
                loading:false,
                page:1,
                pageSize:50,
                count:0,
                params:{
                    snType:"spu",
                    snText:"",
                    account:"",
                    site:"",
                    category_id:"",
                    start_date:"",
                    end_date:""
                },
                clears:{
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
                    return "当前站点下暂无账号";
                }else if(this.params.site!==""&&this.accountList.length>0){
                    return "请选择账号";
                }else{
                    return "请先选择具体站点";
                }
            },
            isSearch(){
                return !this.params.account;
            },
        },
        methods:{
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
                    this.$refs.looks.titleName = `查看SPU：${data.spu}  `;
                })
            },
            publish(data){
                let find = this.siteList.find(it=>it.id===this.params.site);
                console.log(find,'find');
                let params={
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
            search(){
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
                    page: this.page,
                    pageSize: this.pageSize,
                    snType: this.params.snType,
                    snText: this.params.snText,
                    account: this.params.account,
                    site: this.params.site,
                    category_id:this.params.category_id,
                    start_date:this.params.start_date ? datef("YYYY-MM-dd",this.params.start_date/1000) : '',
                    end_date:this.params.end_date ? datef("YYYY-MM-dd",this.params.end_date/1000) : '',
                };
                if(this.params.snType==='spu'){
                    let snText = this.params.snText.replace(new RegExp('\n', 'gm'), '\n');
                    let cur = snText.split('\n').filter(row=>!!row);
                    console.log(cur,'cur');
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
            get_account(){
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
                    if(this.accountList.length>0){
                        this.params.account = this.accountList[0].value;
                    }
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
        }
    }
</script>
