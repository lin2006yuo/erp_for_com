<template>
    <div class="c-draft-record">
        <search-card @search="search"
                     @enter="search"
                     :params="params"
                     :clears="clears">
            <el-select class="inline s-width-default mb-mini" v-model="params.snType">
                <el-option
                    :key="item.value"
                    @change="clearSnText"
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
            <!--站点-->
            <label class="mb-mini">{{$t('ebay-list.site')}}：</label>
            <el-select class="inline s-width-default mb-mini"
                       v-model="params.site_id"
                       :placeholder="$t('ebay-list.SelectSite')" filterable clearable>
                <el-option
                    :key="item.value"
                    v-for="item in siteList"
                    :label="item.label"
                    :value="item.id"
                ></el-option>
            </el-select>
            <label class="ml-sm mb-mini">{{$t('ebay-list.pc')}}：</label>
            <el-cascader
                clearable
                expand-trigger="hover"
                class="mr-sm mb-mini"
                v-model="params.category_id"
                :options="categoryTree"
                change-on-select
            ></el-cascader>
            <label class="mb-mini">创建时间：</label>
            <el-date-picker class="inline date" v-sf.start_date v-model="params.start_time" type="date"
                            :picker-options="pickerstart" :placeholder="$t('ebay-list.sTime')"></el-date-picker>
            -
            <el-date-picker class="inline date mr-sm" v-sf.end_date
                            v-model="params.end_time" type="date"
                            :placeholder="$t('ebay-list.eTime')"
                            :picker-options="pickerend"></el-date-picker>
        </search-card>
        <div class="mt-xs mb-xs ml-sm">
            <el-button class="inline" size="mini" type="primary"
                       @click.native='clicked()'>复制/转站点账号</el-button>
            <el-button type="primary"
                       size="mini"
                       class="ml-xs inline"
                       :loading="btnloading"
                       @click.native="batch_open_close">{{buttonTitle}}</el-button>
        </div>
        <ui-table
            ref="table" class="mt-sm"
            v-loading="loading"
            v-model="checkAll"
            @check="head_check"
            :element-loading-text="$t('ebay-list.playLoad')"
            :body-height="41"
            :first-loading="firstLoading"
            :has-data="table&&table.length>0"
            :heads="[
                        {isCheck:true,width:2},
                        {label:$t('ebay-list.image'),width:8},
                        {label:$t('ebay-list.localspu'),width:10},
                        {label:$t('ebay-list.zhName'),width:20},
                        {label:$t('ebay-list.upTitle'),width:20},
                        {label:$t('ebay-list.site'),width:10},
                        {label:$t('ebay-list.localClass'),width:10},
                        {label:$t('ebay-list.cTime'),width:10},
                        {label:$t('ebay-list.operat'),width:10},
                       ]">
            <tbody>
            <template v-for="(data,index) in table">
                <tr :class="[data.show ? 'active' : '']"
                    :key="data.id">
                    <td><el-checkbox v-model="data.isCheck" @change="check_row"></el-checkbox></td>
                    <td  class="relative">
                        <i @click="show_detail(data)" v-if="data.variation" :class="[data.show? 'minus':'plus','fl','absolute']"></i>
                        <i class="plus" style="background: none" v-else></i>
                        <el-popover
                            placement="right"
                            trigger="hover">
                            <img v-lazy="sku_image(data,200)"
                                 @click="search_img(data.thumb)" width="200px" height="200px">
                            <span slot="reference">
                              <img v-lazy="sku_image(data,60)"
                                   height="60px" width="60px"
                                   @click="search_img(data.thumb)"
                                   style="border:none">
                            </span>
                        </el-popover>
                    </td>
                    <!--本地spu-->
                    <td>
                        <ui-tip :is-operate="true" :content="data.spu"
                                @cur-click="distribution(data)"></ui-tip>
                    </td>
                    <td><ui-tip :content="data.name" ></ui-tip></td>
                    <!--刊登标题-->
                    <td><ui-tip :content="data.title" ></ui-tip></td>
                    <!--站点-->
                    <td>{{filterSite(data.site_id)}}</td>
                    <!--本地分类-->
                    <td><ui-tip :content="data.category_name" ></ui-tip></td>
                    <!--创建时间-->
                    <td><ui-tip :content="data.create_time" ></ui-tip></td>
                    <td>
                        <permission tag="ElButton"  size="mini" type="primary"
                                    @click.native='publish(data)' :route="apis.url_get_ebay_drafts">{{$t('ebay-list.edit')}}</permission>
                    </td>
                </tr>
                <template v-if="data.show&&data.varians&&data.varians.length">
                    <tr style="font-weight:bold" class="variant">
                        <td colspan="1" :rowspan="`${(data.varians&&data.varians.length)+1}`"></td>
                        <td>{{$t('ebay-list.image')}}</td>
                        <td colspan="1">{{$t('ebay-list.platsku')}}</td>
                        <td colspan="1">{{$t('ebay-list.localsku')}}</td>
                        <template v-for="tm1 in data.v_varkey">
                            <td>{{tm1}}</td>
                        </template>
                        <td>{{$t('ebay-list.price')}}</td>
                        <td>{{$t('ebay-list.quantity')}}</td>
                        <td>{{$t('ebay-list.localStatus')}}</td>
                        <td v-if="data.v_varkey" :colspan="`${7-(data.v_varkey&&data.v_varkey.length)}`" :rowspan="`${(data.varians&&data.varians.length)+1}`"></td>
                        <td :colspan="7" :rowspan="`${(data.varians&&data.varians.length)+1}`" v-else></td>
                    </tr>
                    <tr v-for="(item,item_i) in data.varians" :key="`${item_i}${item.id}`" class="variant">
                        <td>
                            <el-popover placement="right" trigger="hover">
                                <img v-lazy="sku_image(item,200)"
                                     @click="search_sku_img(item)"
                                     width="200px" height="200px">
                                <span slot="reference">
                                  <img v-lazy="sku_image(item,60)"
                                       @click="search_sku_img(item)"
                                       height="60px" width="60px" style="border:none">
                                </span>
                            </el-popover>
                        </td>
                        <td colspan="1"><ui-tip :content="item.channel_map_code"></ui-tip></td>
                        <td colspan="1"><ui-tip :content="item.v_sku"></ui-tip></td>
                        <template v-for="(tm2,km2) in data.v_varkey">
                            <td><ui-tip :content="item.variation[tm2]"></ui-tip></td>
                        </template>
                        <td>{{data.symbol}} {{item.v_price}}</td>
                        <td>{{item.v_qty || 0}}</td>
                        <td>{{filterSalesStatus(item.status)}}</td>
                    </tr>
                </template>
            </template>
            </tbody>
        </ui-table>
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="$t('ebay-list.viewLarger')"></blowup-image>
        <action-common-module v-model="actionCommonModuleShow"
                              :select-ids="selectIds"
                              :title="actionCommonName"
                              :site-id="siteId"
                              :site-list="siteList"
                              :site-name="siteName"
                              :can-change-site="canChangeSite"
                              :ebay-status="ebayStatus"></action-common-module>
        <look-edit v-model="lookVisable"
                   :showedit="showedit"
                   :goodsId="goodsId"
                   :spu="spu" ref="looks"
                   :child-active-name="activeName"
                   @reflash="reflash"
                   :edit-able="editAble"
                   @change-data="change_data"></look-edit>
        <el-pagination
            class="page-fixed"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[20, 50, 100, 200, 500]"
            :page-size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
</template>
<style lang="stylus">
    .c-draft-record{
        .el-card{
            overflow: inherit;
        }
        .absolute{
            margin-top 25px;
        }
    }
</style>
<script>
    import {api_joom_category_tree,} from '../../../../../api/joom-set-classify'
    import {api_get_ebay_drafts,url_get_ebay_drafts,api_ebay_variations} from '@/api/ebay-kandeng-public-module'
    import {get_path} from '../add-edit-listing/get-path';
    export default {
        name: "index",
        permission: {
            url_get_ebay_drafts
        },
        data(){
            return{
                imgPath:'',
                imgDialog:false,
                ebayStatus:"draftList",
                canChangeSite:false,
                siteName:"",
                siteId:"",
                actionCommonName:'',
                selectIds:[],
                checkAll:false,
                actionCommonModuleShow:false,
                page:1,
                size:50,
                total:0,
                isOpen:false,
                lookVisable:false,
                editAble:false,
                goodsId:0,
                spu:"",
                showedit:false,
                activeName:'ebay平台',
                btnloading:false,
                loading:false,
                table:[],
                flag:0,
                firstLoading:true,
                categoryTree:[],
                clears:{
                    snType:"spu",
                    category_id:[],
                    snText:'',
                    site_id:'',
                },
                snTypeList:[
                    {label:this.$t('ebay-list.localspu'),value:"spu"},
                    {label:this.$t('ebay-list.localsku'),value:"sku"},
                ],
                params:{
                    start_time:'',
                    end_time:'',
                    snType:'spu',
                    snText:'',
                    site_id:'',
                    category_id:[]
                },
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
            this.get_category_tree();
            this.init();
        },
        computed:{
            buttonTitle(){
                return this.isOpen?this.$t('ebay-list.closeList'):this.$t('ebay-list.openList');
            },
        },
        methods:{
            get_path,
            change_data(){},
            reflash(){},
            clearSnText(){
                this.params.snText='';
            },
            enter_search(e){
                if(!e.shiftKey && e.keyCode === 13){
                    this.search()
                }
            },
            middle_img(item,size){
                if(item.img){
                    if(item.img.includes('http')){
                        return this.get_path(item.img,`.`,item.base_url)|| '';
                    }
                    return this.get_path(item.img,`_${size}x${size}.`,item.base_url);
                }
                return '';
            },
            sku_image(item,size){
                if(item.thumb){
                    if(item.thumb.includes('http')){
                        return this.get_path(item.thumb,`.`,item.base_url)|| '';
                    }
                    return this.get_path(item.thumb,`_${size}x${size}.`,item.base_url);
                }
                return '';
            },
            search_img(image){
                if(image.includes('http')){
                    this.imgPath = this.get_path(image,'.',this.baseUrl);
                }else{
                    this.imgPath = this.get_path(image,'_500x500.',this.baseUrl);
                }
                this.imgDialog = true;
            },
            head_check(val){
                this.flag=1;
                if(this.table.length>0){
                    this.table.forEach(row=>{
                        row.isCheck=val;
                    });
                    this.selectIds = this.table.filter(row=>row.isCheck);
                    this.ids = [];
                    this.table.forEach(row=>{
                        if(row.isCheck){
                            this.ids.push(row.id);
                        }
                    });
                }

            },
            check_row(){
                this.checkAll=!this.table.find(row=>!row.isCheck);
                this.selectIds = this.table.filter(row=>row.isCheck);
                this.ids = [];
                this.table.forEach(row=>{
                    if(row.isCheck){
                        this.ids.push(row.id);
                    }
                });
            },
            filterSite(val){ // 过滤站点
                let name = "";
                this.siteList.forEach(row =>{
                    if(val === row.id){
                        name = row.label;
                    }
                });
                return name
            },
            handleSizeChange(size){
                this.size=size;
                this.init();
            },
            handleCurrentChange(page){
                this.page=page;
                this.init();
            },
            init(){
                let data = JSON.parse(JSON.stringify(this.params));
                delete data.snType;
                delete data.snText;
                if(this.params.snType==='spu'){
                    let snText = this.params.snText.replace(new RegExp('\n', 'gm'), '\n');
                    let cur = snText.split('\n').filter(row=>!!row);
                    if(cur&&cur.length>1){
                        data.spu = cur.map(row=>row.trim()).join(',');
                    }else if(cur&&cur.length===1){
                        data.spu =  this.params.snText.trim();
                    }
                }else {
                    data.spu =''
                }
                data.start_time=this.params.start_time ? datef("YYYY-MM-dd",this.params.start_time/1000) : '',
                data.end_time=this.params.end_time ? datef("YYYY-MM-dd",this.params.end_time/1000) : '',
                data.sku = this.params.snType==='sku'?this.params.snText:'';
                data.category_id=this.params.category_id.length<=1?this.params.category_id.join(','):this.params.category_id[this.params.category_id.length-1],
                data.pageSize=this.size;
                data.page=this.page;
                this.loading = true;
                this.$http(api_get_ebay_drafts,data).then(res => {
                    if(!!res.count){
                        res.data.forEach(row => {
                            row.show = false;
                            row.isCheck = false;
                        });
                        this.table = res.data;
                        this.total = res.count;
                    }else{
                        this.table=[]
                    }
                    this.loading = false;

                }).catch(code=>{
                    this.$message({type: 'error',message:code.message || code});
                })
            },
            clicked(){//复制/转站点账号
                let data;
                    data = this.table.filter(row=>row.isCheck);
                    if(data.length===0){
                        this.$message({
                            message: this.$t('ebay-list.regularTip'),
                            type: 'warning'
                        });
                        return;
                    }
                this.actionCommonModuleShow = true;
                this.canChangeSite = true;
                this.actionCommonName='复制/转站点账号'
            },
            batch_open_close(){ //一键展开
                this.isOpen=!this.isOpen;
                this.table.forEach(row=>{
                    row.show = this.isOpen;
                });
                if(this.isOpen===true) this.operate_data_id(this.table,"ids");

            },
            distribution(data){
                this.lookVisable = true;
                this.goodsId = data.id;
                this.spu = data.spu;
                this.showedit = true;
                this.$nextTick(()=>{
                    this.$refs.looks.titleName = `查看SPU：${data.spu}  `;
                })
            },
            filterSalesStatus(val){
                //产品本地状态 0-未出售 1-出售 2-停售 3-试卖 4-作废
                switch (val){
                    case 0:
                        return this.$t('ebay-list.Unsold');
                        break;
                    case 1:
                        return this.$t('ebay-list.sell');
                        break;
                    case 2:
                        return this.$t('ebay-list.Inactive');
                        break;
                    case 3:
                        return this.$t('ebay-list.TrialSale');
                        break;
                    case 4:
                        return this.$t('ebay-list.zuofei');
                        break;
                    default:
                        break;
                }
            },
            search_sku_img(images){
                this.imgPath = this.sku_image(images,500);
                this.imgDialog = true;
            },
            show_detail(data){
                data.show =!data.show;
                data.show&&this.operate_data_id(data,"id");
            },
            //数据处理（获取子商品）
            operate_data_id(data,status){
                switch (status){
                    case 'id':
                        let arr = [];
                        arr.push(data);
                        this.get_variations(arr);
                        break;
                    case 'ids':
                        this.get_variations(data);
                        break;
                    default:
                        break;
                }
            },
            //获取子商品
            get_variations(data){
                let ids=data.map(x=>x.listing_id);
                this.$http(api_ebay_variations,{ids:ids}).then(res=>{
                    let data_ = []
                    Object.keys(res.data).forEach(key=>{
                        let find = data.find(row=>{return Number(row.listing_id)===Number(key)});
                        if(find){
                            res.data[key].forEach(va=>{
                                !!va.variation&&(va.variation=JSON.parse(va.variation));
                            })
                            this.$set(find,"varians",res.data[key]);
                            let varkey = res.data[key][0].variation;
                            let v_varkey=[];
                            for(var p in varkey){
                                v_varkey.push(p)
                            }
                            this.$set(find,"v_varkey",v_varkey);
                        }
                        data_.push(res.data[key])
                    })
                    return Promise.resolve();
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                });
            },
            publish(data){
                let find = this.siteList.find(it=>it.id===this.params.site);
                console.log(find,'find');
                let params={
                    id:data.listing_id,
                    goods_id:data.goods_id,
                    isAdd:false,
                    isCopy:false,
                    isTemplate:true,
                    isCopyListing:false,
                    curPage:'draftList',
                    default_site_id:this.params.site_id,
                };//---查看标示id为1
                this.$open(`/add-listing?id=${data.id}`,params)
            },
            search(e){
                this.firstLoading = false;
                this.init();
            },
            // 产品分类
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
        },
        props:{
            siteList:{
                required:true,
                type:Array
            },
        },
        components:{
            lookEdit:require("../../../../product/manager/look-edit.vue").default,
            actionCommonModule:require("../already/action-common-module.vue").default,
            blowupImage:require("../../../../../components/blowup-image.vue").default,
            searchCard:require('../../../../../components/search-card.vue').default,
            orderInput:require("../../../../../components/order-input.vue").default,
        }
    }
</script>


