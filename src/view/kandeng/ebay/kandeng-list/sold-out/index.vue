<template>
    <el-row class="c-has-yet">
        <search :search-data="searchData"
                :site-list="siteList"
                :clears="clears"
                @secondClear="secondClear"
                :price="price"
                @search="search"></search>
        <div class="mt-xs mb-xs ml-sm">
            <el-button class="inline" size="mini" type="primary"
                       v-for="(item,index) in btnslist" :key="index" @click.native='clicked(item.status)'>{{item.name}}</el-button>
            <el-button type="primary" size="mini" class="inline"
                       @click.native="batch_open_close">{{buttonTitle}}</el-button>
        </div>
        <action-common-module v-model="actionCommonModuleShow"
                              :select-ids="selectIds"
                              :title="actionCommonName"
                              :site-list="siteList"
                              :can-change-site="canChangeSite"
                              :ebay-status="ebayStatus"></action-common-module>
        <batch-online v-model="onlineVisable" ref="online" @change-status="change_status"></batch-online>
        <ui-table
            ref="table"
            @sort-click="sort_click"
            v-loading="loading" :element-loading-text="$t('common.playLoad')"
            :has-data="tableData.length>0" v-model="checkAll" :body-height="41"  @check="head_check"
            :heads="[
                        {isCheck:true,width:2},
                        {label:$t('ebay-list.image'),width:5},
                        {label:'ItemID',width:8},
                        {label:$t('ebay-list.localspu'),width:5},
                        {label:$t('ebay-list.upTitle'),width:8},
                        {label:$t('ebay-list.account'),width:5},
                        {label:$t('ebay-list.site'),width:4},
                        {label:$t('ebay-list.saleType'),width:5},
                        {label:$t('ebay-list.price'),width:7},
                        {label:$t('ebay-list.UploadPrice'),width:6},
                        {label:$t('ebay-list.UploadDays'),width:6},
                        {label:$t('ebay-list.soldQuan'),width:5,isSort:true,order_type:'order_sold_quantity'},
                        {label:$t('ebay-list.pageviews'),width:4},
                        {label:$t('ebay-list.CollectionNumber'),width:4},
                        {label:$t('ebay-list.UploadTime'),width:8,isSort:true,order_type:'order_publish_date'},
                        {label:$t('ebay-list.eTime'),width:8},
                        {label:$t('ebay-list.ListingCategory'),width:5},
                        {label:'操作人',size:80},
                        {label:$t('ebay-list.operat'),width:5}
                       ]">
            <tbody>
            <template v-for="(data, index) in tableData">
                <tr :class="[data.show ? 'active' : '',data.heighLight?'active-color':'',data.listing_status===5?'redborder':'']"   @click="addClass(index)"  :key="data.id"  >
                    <td><el-checkbox v-model="data.isCheck" @change="check_row"  ></el-checkbox></td>
                    <td>
                        <el-popover placement="right" trigger="hover">
                            <img v-lazy="data.img"
                                 @click="search_img(data.img)"
                                 width="200px" height="200px">
                            <span slot="reference">
                                  <img v-lazy="data.img"
                                       @click="search_img(data.img)"
                                       height="60px" width="60px" style="border:none">
                            </span>
                        </el-popover>
                    </td>
                    <td>
                        <i @click="show_detail(data)" v-if="data.variation" :class="[data.show? 'minus':'plus','fl']"></i>
                        <i class="plus" style="background: none" v-else></i>
                        <ui-tip :content="data.item_id"></ui-tip>
                    </td>
                    <td><ui-tip :content="data.spu" ></ui-tip> </td>
                    <td><ui-tip :content="data.title" :width="88"></ui-tip></td>
                    <td><ui-tip :content="data.account_code" :width="88"></ui-tip></td>
                    <td>{{filterSite(data.site)}}</td>
                    <td>{{ filterWay(data.listing_type)}}</td>
                    <td v-if="data.variation">{{data.symbol}} {{data.rval_price}}</td>
                    <td v-if="(!data.variation)&&data.listing_type===1">{{data.symbol}} {{data.start_price}}</td>
                    <td v-if="(!data.variation)&&data.listing_type!==1">{{data.symbol}} {{data.start_price}}/{{data.reserve_price}}/{{data.buy_it_nowprice}}</td>
                    <td>{{data.symbol}} {{data.insertion_fee}}</td>
                    <td>{{data.listing_duration | filterDay}}</td>
                    <td><ui-tip :content='data.sold_quantity'></ui-tip></td>
                    <td>{{data.hit_count}}</td>
                    <td>{{data.watch_count}}</td>
                    <td>{{data.start_date}}</td>
                    <td>{{data.end_date}}</td>
                    <td><ui-tip :content='data.listing_cate'></ui-tip></td>
                    <td>{{data.end_user_name}}</td>
                    <td>
                        <trends-select  class="inline" @trigger="operate(data,$event)" :selects="operatesList" type="primary" width="100px"></trends-select>
                    </td>
                </tr>
                <template v-if="data.show&&data.varians&&data.varians.length">
                    <tr style="font-weight:bold" class="variant">
                        <td colspan="2" :rowspan="`${(data.varians&&data.varians.length)+1}`"></td>
                        <td>{{$t('ebay-list.image')}}</td>
                        <td colspan="2">{{$t('ebay-list.platsku')}}</td>
                        <td colspan="2">{{$t('ebay-list.localsku')}}</td>
                        <template v-for="tm1 in data.v_varkey">
                            <td>{{tm1}}</td>
                        </template>
                        <td>{{$t('ebay-list.price')}}</td>
                        <td>{{$t('ebay-list.quantity')}}</td>
                        <td>{{$t('ebay-list.localStatus')}}</td>
                        <td v-if="data.v_varkey" :colspan="`${9-(data.v_varkey&&data.v_varkey.length)}`" :rowspan="`${(data.varians&&data.varians.length)+1}`"></td>
                        <td :colspan="9" :rowspan="`${(data.varians&&data.varians.length)+1}`" v-else></td>
                    </tr>
                    <tr v-for="(item,item_i) in data.varians" :key="item_i" class="variant">
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
                        <td colspan="2"><ui-tip :content="item.channel_map_code"></ui-tip></td>
                        <td colspan="2"><ui-tip :content="item.v_sku"></ui-tip></td>
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
        <el-pagination
            class="page-fixed"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[20, 50, 100, 200,500]"
            :page-size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="$t('ebay-list.viewLarger')"></blowup-image>
    </el-row>

</template>
<style lang="stylus" scoped>
</style>
<script>
    import {api_listing_management,api_update_listing,api_ebay_variations,url_update_listing,batch_change_site,url_bulk_heavy_listing,url_save_listing} from '../../../../../api/ebay-kandeng-public-module';
    import {operateList} from './action';//------操作按钮引入
    import {mapGetters} from 'vuex';
    import {get_path} from '../add-edit-listing/get-path';
    export default{
        permission: {
            url_update_listing,url_bulk_heavy_listing,url_save_listing,batch_change_site
        },
        page:{
            devinfo:{
                frontEnd:'何伊莎',
                backEnd:'曾绍辉',
                createTime:'2017-06-30',
                updateTime:'2017-12-20'
            }
        },
        data(){
            return {
                actionCommonModuleShow:false,
                ebayStatus:'soldOut',
                actionCommonName:'',
                canChangeSite:false,
                order:{
                    order_sold_quantity:"",  //排序
                    order_publish_date:"",
                },
                price:{
                    name:'',
                    num:''
                },
                searchData: {
                    price:'',
                    transport_property:'',
                    searchChooese:"itemID",
                    snText:"",
                    item_id:"",
                    spu:"",
                    sku:"",
                    title:"",
                    listing_sku:"",
                    account_id: "",
                    site: "",
                    listing_type:"",
                    listing_duration:"",
                    replen:"",
                    goods_type:"",
                    work_off:"",
                    sales_status:"",
                    restart:"",
                    category:"",
                    promotion_id:"",
                    paypal_emailaddress:"",
                    picture_gallery:"",
                    location:"",
                    quantity:"",
                    best_offer:"",
                    return_time:"",
                    sub_title:"",
                    dispatch_max_time:"",
                    listing_cate:"",
                    user_id:"",
                    listing_status:"9,11",
                    application:"",
                    name:"start",
                    start_date: "",
                    end_date:"",
                },
                clears:{
                    item_id:"",
                    spu:"",
                    sku:"",
                    title:"",
                    listing_sku:"",
                    searchChooese:"itemID",
                    name:"start",
                    user_id:"",
                    listing_status:"9,11",
                },
                btnList:[//----------------------------------------------操作按钮
                    {name:this.$t('ebay-list.BatchReload'),clickName:'',status:1,api:url_bulk_heavy_listing,},
                    {name:this.$t('ebay-list.BulkDelete'),clickName:'',status:2,api:url_update_listing,},
                    {name:this.$t('ebay-list.EditAccountandSite'),clickName:'',status:3,api:batch_change_site},
                ],
                option:"",
                accountId:"",
                onlineVisable:false,
                loading:true,
                tableData:[],
                checkAll:false,
                page:1,
                size:50,
                total:0,
                selectIds:[],
                imgDialog: false,
                imgPath:""
            }
        },
        created(){
            this.init()
        },
        methods:{
            filterWay(value){
                switch(value) {
                    case 1:
                        return this.$t('ebay-list.FixedPrice')
                        break;
                    case 2:
                        return this.$t('ebay-list.Auction');
                        break;
                    default:
                        break;
                }
            },
            secondClear(){
                this.price.name='';
                this.price.num='';
            },
            batch_open_close(){ //一键展开
                this.isOpen=!this.isOpen;
                this.tableData.forEach(row=>{
                    row.show = this.isOpen;
                });
                if(this.isOpen===true) this.operate_data_id(this.tableData,"ids");
            },
            sort_click(val){
                this.order.order_sold_quantity = "";
                this.order.order_publish_date = "";
                this.order[val.order_type]=val.order;
                let curData = JSON.stringify(clone(this.searchData));
                sessionStorage.setItem('ebaySearchData',curData);
                this.init();
            },
            get_path,
            search_img(image){
                if(image.includes('http')){
                    this.imgPath = this.get_path(image,'.',this.baseUrl);
                }else{
                    this.imgPath = this.get_path(image,'_500x500.',this.baseUrl);
                }
                this.imgDialog = true;
            },
            sku_image(item,size){
                if(item.mainde_path){
                    if(item.mainde_path.includes('http')){
                        return this.get_path(item.mainde_path,`.`,item.base_url)|| '';
                    }
                    return this.get_path(item.mainde_path,`_${size}x${size}.`,item.base_url);
                }
                return '';
            },
            search_sku_img(images){
                this.imgPath = this.sku_image(images,500);
                this.imgDialog = true;
            },
            init(){
                this.tableData = [];
                this.loading=true;
                let data = window.clone(this.searchData);
//                data.snText = this.searchData.snText.trim();
                let curString = data.snText.replace(new RegExp(' ','gm'),'\n');
                let cur = curString.split('\n').filter(row=>!!row);
                data.snText = cur&&cur.length?cur.map(row=>row.trim()):"";
                data.order_sold_quantity = this.order.order_sold_quantity;
                data.order_publish_date = this.order.order_publish_date;
                data.item_id = this.searchData.searchChooese==="itemID" ? data.snText : "";
                data.spu = this.searchData.searchChooese==="spu" ? data.snText : "";
                data.sku = this.searchData.searchChooese==="sku" ? data.snText : "";
                data.listing_sku = this.searchData.searchChooese==="listing_sku" ? data.snText : "";
                data.title = this.searchData.searchChooese==="title" ? data.snText : "";
                data.page = this.page;
                data.size = this.size;
                data.price = this.price.name+','+this.price.num;
                if (this.searchData.start_date) {
                    data.start_date = datef("YYYY-MM-dd",this.searchData.start_date/1000)
                }else {
                    data.start_date="";
                }
                if (this.searchData.end_date) {
                    data.end_date = datef("YYYY-MM-dd",this.searchData.end_date/1000)
                }else {
                    data.end_date="";
                }
                switch (data.return_time){
                    case 'Days_14':
                        data.return_time = 1;
                        break;
                    case 'Days_30':
                        data.return_time = 2;
                        break;
                    case 'Days_60':
                        data.return_time = 3;
                        break;
                    case 'Months_1':
                        data.return_time = 4;
                        break;
                    default:
                        break;
                }
                this.$http(api_listing_management,data).then(res=> {
                    if(res.data instanceof Array!==true){
                        res.data.listings.forEach(row => {
                            row.num = "";
                            row.show = false;
                            row.isCheck = false;
                            row.heighLight = false;
                        });
                        this.tableData = res.data.listings;
                        this.total = res.data.count;
                    }else {
                        this.tableData=[];
                        this.total=0;
                    }

                    this.loading = false;
                }).catch(code => {
                    this.$message({
                        type:"error",
                        message: code.message || code
                    });
                })
            },
            operate(data,options){
                options.action.call(this,data);
            },
            change_status(arr){
            	arr.forEach(row =>{
                    let index=this.tableData.indexOfFun(row,function (old,row) {
                        return old.id===row
                    });
                    this.$set(this.tableData[index],'listing_status',5)
                })
            },
            search(data){
                this.searchData = data;
                this.init();
            },
            head_check(val){
                this.flag=1;
                this.tableData.forEach(row=>{
                    row.isCheck=val;
                });
                this.selectIds = this.tableData.filter(row=>row.isCheck);
            },
            addClass(index){
                this.tableData.forEach(row=>{
                    row.heighLight=false;
                });
                this.tableData[index].heighLight=true
            },
            show_detail(data){
                data.show =!data.show;data.show&&this.operate_data_id(data,"id");
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
                let ids=data.map(x=>x.id);
                this.$http(api_ebay_variations,{ids:ids}).then(res=>{
                    let data_ = []
                    Object.keys(res.data).forEach(key=>{
                        let find = data.find(row=>{return Number(row.id)===Number(key)});
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
                            // this.$set(find,"v_varkey",it.v_varkey);
                        }
                        data_.push(res.data[key])
                    })
                    return Promise.resolve();
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                });
            },
            clicked(status){//------------------------------------操作不同按钮执行的事件
                let data=this.tableData.filter(row=>row.isCheck);
                if(data.length===0){
                    this.$message({
                        message: this.$t('ebay-list.pleaseSelectOperationData'),
                        type: 'warning'
                    });
                    return;
                }
                switch (status){
                    case 1:         //批量重上
                        this.$refs.online.tableData=window.clone(data);
                        this.onlineVisable = true;
                        break;
                    case 2:         //批量删除
                        this.batch_del();
                        break;
                    case 3:         //批量修改站点/账号
                        this.change_site_account();
                        break;
                }
            },
            change_site_account(){//批量修改站点/账号
                this.actionCommonModuleShow=true;
                this.actionCommonName= this.$t('ebay-list.EditAccountandSite');
                this.canChangeSite = true;
                this.selectIds = this.tableData.filter(row=>row.isCheck);
            },
            batch_del(){
                let arr = this.tableData.filter(row=>row.isCheck);
                let ids = arr.map(row=>row.id);
                console.log(ids,'ids')
                let data = {
                    ids:ids,
                }
                this.opreate_del(data,arr);
            },
            opreate_del(data,arr){
                this.$confirm(this.$t('ebay-list.Ifdeleted'), this.$t('ebay-list.tips'), {
                    confirmButtonText: this.$t('ebay-list.yes'),
                    cancelButtonText: this.$t('ebay-list.no'),
                    type: 'warning'
                }).then(() => {
                    this.$http(api_update_listing,data).then(res=>{
                        this.$message({
                            type:"success",
                            message:res.message||res
                        })
                        this.init()
                        // if(arr instanceof Array){
                        //     arr.forEach(row=>{
                        //         let index=this.tableData.indexOfFun(row,function (old,row) {
                        //             return old.id===row.id
                        //         });
                        //         this.tableData.splice(index,1)
                        //         this.total-=1;
                        //     })
                        // } else if(arr instanceof Object){
                        //     let i = this.tableData.indexOfFun(arr,function (old,arr) {
                        //         return old.id===arr.id
                        //     });
                        //     this.tableData.splice(i,1)
                        //     this.total-=1;
                        // }
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'})
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.$t('ebay-list.cancelTip')
                    });
                });
            },
            batch_open(){
                let arr = this.tableData.filter(row=> {return row.isCheck});
                if(!arr.length){
                    this.$message({
                        message:this.$t('ebay-list.pleaseSelectOperationData'),
                        type: 'warning'
                    });
                    return;
                }
                arr.forEach(row=>{
                    row.show = true;
                });
                this.operate_data_id(arr,"ids");
            },
            batch_close(){ //一键关闭
                let arr = this.tableData.filter(row=> {return row.isCheck});
                if(!arr.length){
                    this.$message({
                        message: this.$t('ebay-list.pleaseSelectOperationData'),
                        type: 'warning'
                    });
                    return;
                }
                arr.forEach(row=>{
                    row.show = false;
                });
            },
            check_row(){
                this.checkAll=!this.tableData.find(row=>!row.isCheck);
                this.selectIds = this.tableData.filter(row=>row.isCheck);
            },
            handleSizeChange(size){
                this.size=size;
                this.init()
            },
            handleCurrentChange(page){
                this.page=page;
                this.init()
            },
            filterAccount(val){ // 过滤账号
                this.accountList = this.accounts("ebay");
                let name = "";
                this.accountList.forEach(row =>{
                    if(val === row.value){
                        name = row.label
                    }
                })
                return name
            },
            filterSite(val){ // 过滤站点
                let name = ""
                this.siteList.forEach(row =>{
                    if(val === row.id){
                        name = row.label;
                    }
                })
                return name
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
            operateList,
        },
        filters:{
            filterDay(val){
                switch (val){
                    case 1:
                        return "GTC";
                        break;
                    case 2:
                        return 1;
                        break;
                    case 3:
                        return 3;
                        break;
                    case 4:
                        return 5;
                        break;
                    case 5:
                        return 7;
                        break;
                    case 6:
                        return 10;
                        break;
                    case 7:
                        return 30;
                        break;
                    default:
                        break;
                }
            },
        },
        computed:{
            buttonTitle(){
                return this.isOpen?this.$t('ebay-list.closeList'):this.$t('ebay-list.openList')
            },
            ...mapGetters({accounts:'api/getPublishAccount'}),
            btnslist(){
                return this.btnList.filter(row=>{
                    if(row.api){
                        return this.$hasPermission(row.api)
                    }else {
                        return true
                    }
                })
            },
            operatesList(){
                return  this.operateList().filter(row=>{
                    return this.$hasPermission(row.api)
                })
            }
        },
        watch:{
            'price.name'(val){
                if(val===''){
                    this.price.num='';
                }
            }
        },
        props:{
            siteList:{
                required:true,
                type:Array,
            }
        },
        components: {
            search:require("./../already/search.vue").default,
            uiTable:require("../../../../../components/ui-table.vue").default,
            uiTip:require("../../../../../components/ui-tip.vue").default,
            trendsSelect:require('../../../../../components/trends-select.vue').default,
            batchOnline:require("./batch-online.vue").default,
            blowupImage:require("../../../../../components/blowup-image.vue").default,
            actionCommonModule:require("../already/action-common-module.vue").default,
        }
    }
</script>
