<template>
    <div class="c-index">
        <search :search-data="searchData"
                :clears="clears"
                :site-list="siteList"
                @search="search"></search>
        <div class="mt-xs mb-xs ml-sm">
            <el-button class="inline" size="mini" type="primary"
                       v-for="(item,index) in btnslist" :key="index" @click.native='clicked(item.status)'>{{item.name}}</el-button>
        </div>
        <ui-table
            ref="table"
            v-loading="loading"
            element-loading-text="玩命加载中..."
            :has-data="tableData.length>0"
            v-model="checkAll"
            :body-height="41"
            @sort-click="sort_click"
            @check="head_check"
            :heads="[
                        {isCheck:true,width:2,},
                        {label:'产品图片',size:75},
                        {label:'本地SPU',width:10},
                        {label:'刊登标题',width:22},
                        {label:'账号简称',width:7},
                        {label:'站点',width:7},
                        {label:'出售方式',width:7},
                        {label:'价格',width:10},
                        {label:'刊登天数',width:6},
                        {label:'异常描述',width:15},
                        {label:'创建时间',width:14,isSort:true,order_type:'order_start_date'},
                        {label:'操作',size:110},
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
                        <ui-tip :content="data.spu" :width="98"></ui-tip>
                    </td>
                    <td><ui-tip :content="data.title" :width="88"></ui-tip></td>
                    <td><ui-tip :content="data.account_code" :width="80"></ui-tip></td>
                    <td>{{filterSite(data.site)}}</td>
                    <td>{{data.listing_type | filterWay}}</td>
                    <td v-if="data.variation">{{data.symbol}} {{data.rval_price}}</td>
                    <td v-if="(!data.variation)&&data.listing_type===1">{{data.symbol}} {{data.start_price}}</td>
                    <td v-if="(!data.variation)&&data.listing_type!==1">{{data.symbol}} {{data.start_price}}/{{data.reserve_price}}/{{data.buy_it_nowprice}}</td>
                    <td>{{data.listing_duration | filterDay}}</td>
                    <td>
                        <el-popover placement="left"
                                title="失败原因："
                                width="400"
                                trigger="hover">
                            <div>{{data.message}}</div>
                            <span slot="reference">
                                <el-button type="text">刊登失败</el-button>
                            </span>
                        </el-popover>
                    </td>
                    <td>{{data.create_date| filterTime}}</td>
                    <td>
                        <trends-select class="inline" @trigger="operate(data,$event)" :selects="operatesList" type="primary" width="100px"></trends-select>
                    </td>
                </tr>
                <template v-if="data.show&&data.varians&&data.varians.length">
                    <tr style="font-weight:bold" class="variant">
                        <td colspan="2" :rowspan="`${(data.varians&&data.varians.length)+1}`"></td>
                        <td>产品图片</td>
                        <td>平台SKU</td>
                        <td colspan="2">本地SKU</td>
                        <template v-for="tm1 in data.v_varkey">
                            <td>{{tm1}}</td>
                        </template>
                        <td>价格</td>
                        <td>可售量</td>
                        <td>本地状态</td>
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
                        <td><ui-tip :content="item. channel_map_code"></ui-tip></td>
                        <td colspan="2"><ui-tip :content="item.v_sku"></ui-tip></td>
                        <template v-for="(tm2,km2) in data.v_varkey">
                            <td><ui-tip :content="item.variation[tm2]"></ui-tip></td>
                        </template>
                        <td>{{data.symbol}} {{item.v_price}}</td>
                        <td>{{item.v_qty || 0}}</td>
                        <td>{{item.status | filterStatus}}</td>
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
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
    </div>
</template>
<style lang="stylus" scoped>

</style>
<script>
    import {api_listing_management,api_update_listing,api_ebay_variations,url_update_listing,url_save_listing} from '../../../../../api/ebay-kandeng-public-module';
    import {mapGetters} from 'vuex';
    import {operateList} from './action';//------操作按钮引入
    import {get_path} from '../add-edit-listing/get-path';
    export default{
        page:{
            devinfo:{
                frontEnd:'何伊莎',
                backEnd:'曾绍辉',
                createTime:'2017-6-30',
                updateTime:'2017-12-20'
            }
        },
        permission: {
            url_update_listing,url_save_listing
        },
        data(){
            return {
                searchData: {
                    searchChooese:"spu",
                    snText:"",
                    spu:"",
                    sku:"",
                    title:"",
                    account_id: "",
                    site: "",
                    listing_type:"",
                    listing_duration:"",
                    listing_status:4,
                    start_date: '',
                    end_date: '',
                    name: 'create'
                },
                clears:{
                    spu:"",
                    sku:"",
                    title:"",
                    listing_status:4,
                    searchChooese:"spu",
                    snText:"",
                },
                btnList:[//----------------------------------------------操作按钮
                    {name:'批量删除',clickName:'',status:1,api:url_update_listing},
                    {name:'一键展开列表',clickName:'',status:2},
                    {name:'一键关闭列表',clickName:'',status:3},
                ],
                title:{
                    select:"",
                    prefix:{isPre:false,pre:"",isSuf:false,suf:""},
                    find:{value:"",replace:""},
                    unite:""
                },
                accountList:[],
                option:"",
                flag:0,
                batchVisable:false,
                loading:true,
                tableData:[],
                checkAll:false,
                page:1,
                size:50,
                total:0,
                idList:[],
                selectIds:[],
                operateList:operateList,
                imgDialog: false,
                imgPath:"",
                order_start_date:"",
            }
        },
        created(){
            this.init()
        },
        methods:{
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
            sort_click(val){
                this.order_start_date = val.order;
                this.init();
            },
            init(){
                this.tableData = [];
                this.loading=true;
                let data = window.clone(this.searchData);
                data.snText = this.searchData.snText.trim();
                data.spu = this.searchData.searchChooese==="spu" ? data.snText : "";
                data.sku = this.searchData.searchChooese==="sku" ? data.snText : "";
                data.title = this.searchData.searchChooese==="title" ? data.snText : "";
                data.page = this.page;
                data.size = this.size;
                data.order_start_date = this.order_start_date;
                if (data.start_date) {
                    data.start_date = datef("YYYY-MM-dd",data.start_date/1000)
                }else {
                    data.start_date="";
                }
                if (data.end_date) {
                    data.end_date = datef("YYYY-MM-dd",data.end_date/1000)
                }else {
                    data.end_date="";
                };
                this.$http(api_listing_management,data).then(res=> {
                    res.data.forEach(row => {
                        row.num = "";
                        row.show = false;
                        row.isCheck = false;
                        row.heighLight = false;
                    });
                    this.tableData = res.data;
                    this.total = res.count;
                    this.loading = false;
                }).catch(code => {
                    this.$message({
                        type:"error",
                        message: code.message || code
                    });
                });
            },
            operate(data,options){
                options.action.call(this,data);
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
            clicked(status){//------------------------------------操作不同按钮执行的事件
                let data=this.tableData.filter(row=>row.isCheck);
                if(data.length===0){
                    this.$message({
                        message: '请选择操作的商品',
                        type: 'warning'
                    });
                    return;
                }
                switch (status) {
                    case 1:         //批量删除
                        this.batch_del();
                        break;
                    case 2:         //一键展开列表
                        this.batch_open();
                        break;
                    case 3:         //一键关闭列表
                        this.batch_close();
                        break;
                }
            },
            batch_del(){
                let arr = this.tableData.filter(row=>row.isCheck);
                let ids = arr.map(row=>row.id).join(",");
                let data = {
                    ids:ids,
                    action:"del"
                };
                this.operate_del(data,arr);
            },
            operate_del(data,arr){
                this.$confirm(`您将要对已选Listing执行删除, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_update_listing,data).then(res=>{
                        this.$message({
                            type:"success",
                            message:res.message||res
                        });
                        if(arr instanceof Array){
                            arr.forEach(row=>{
                                let index=this.tableData.indexOfFun(row,function (old,row) {
                                    return old.id===row.id;
                                });
                                this.tableData.splice(index,1);
                                this.total-=1;
                            });
                        } else if(arr instanceof Object){
                            let i = this.tableData.indexOfFun(arr,function (old,arr) {
                                return old.id===arr.id;
                            });
                            this.tableData.splice(i,1);
                            this.total-=1;
                        }
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'});
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            batch_open(){ //一键展开
                let arr = this.tableData.filter(row=> {return row.isCheck});
                if(!arr.length){
                    this.$message({
                        message: '请选择操作的商品',
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
                        message: '请选择操作的商品',
                        type: 'warning'
                    });
                    return;
                }
                arr.forEach(row=>{
                    row.show = false;
                });
            },
            addClass(index){
                this.tableData.forEach(row=>{
                    row.heighLight=false;
                });
                this.tableData[index].heighLight=true;
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
                let ids=data.map(x=>x.id);
                this.$http(api_ebay_variations,{ids:ids.join(",")}).then(res=>{
                    res.data.forEach(it=>{
                        let find = data.find(row=> {return Number(row.id)===Number(it.listing_id)});
                        if(find){
                            it.varians.forEach(va=>{
                                !!va.variation&&(va.variation=JSON.parse(va.variation));
                            });
                            this.$set(find,"varians",it.varians);
                            this.$set(find,"v_varkey",it.v_varkey);
                        }
                    });
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                });
            },
            check_row(){
                this.checkAll=!this.tableData.find(row=>!row.isCheck);
                this.selectIds = this.tableData.filter(row=>row.isCheck);
            },
            filterAccount(val){ // 过滤账号
                this.accountList = this.accounts("ebay");
                let name = "";
                this.accountList.forEach(row =>{
                    if(val === row.value){
                        name = row.label
                    }
                });
                return name;
            },
            filterSite(val){ // 过滤站点
                let name = "";
                this.siteList.forEach(row =>{
                    if(val === row.id){
                        name = row.label;
                    }
                });
                return name;
            },
            handleSizeChange(size){
                this.size=size;
                this.init();
            },
            handleCurrentChange(page){
                this.page=page;
                this.init();
            },
        },
        computed:{
            ...mapGetters({accounts:'api/getPublishAccount'}),
            btnslist(){
                return this.btnList.filter(row=>{
                    if(row.api){
                        return this.$hasPermission(row.api);
                    }else {
                        return true;
                    }
                });
            },
            operatesList(){
                return  operateList.filter(row=>{
                    return this.$hasPermission(row.api);
                })
            }
        },
        watch:{
        },
        filters:{
            filterTime(val){
                return val ? datef('YYYY-MM-dd HH:mm:ss',val) : "-- --" ;
            },
            filterWay(val){ // 过滤出售方式
                switch(val) {
                    case 1:
                        return "一口价";
                        break;
                    case 2:
                        return "拍卖";
                        break;
                    default:
                        break;
                }
            },
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
            filterStatus(val){ // 过滤状态
                switch(val){
                    case 0:
                        return `未出售`;
                        break;
                    case 1:
                        return `出售`;
                        break;
                    case 2:
                        return `停售`;
                        break;
                    case 3:
                        return `试卖`;
                        break;
                    case 4:
                        return `作废`;
                        break;
                    default:
                        break;
                }
            },
        },
        props:{
            siteList:{
                required:true,
                type:Array,
            }
        },
        components: {
            search:require("./search.vue").default,
            uiTable:require("../../../../../components/ui-table.vue").default,
            uiTip:require("../../../../../components/ui-tip.vue").default,
            trendsSelect:require('../../../../../components/trends-select.vue').default,
            blowupImage:require("../../../../../components/blowup-image.vue").default,
        }
    }
</script>
