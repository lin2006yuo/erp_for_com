<template>
    <div class="wish-wishPublish-list">
        <search ref="search"
                :param-list="paramList"
                :account-list="accountList"
                :user-list="userList"
                @search="search"></search>
        <div class="mt-xs mb-xs ml-sm">
            <!-- 批量操作列表 -->
            <el-button class="inline mb-mini" size="mini" type="primary"
                       v-for="(item,index) in btnslist" :key="index"
                       @click.native='clicked(item.status)'>{{item.name}}</el-button>
        </div>
        <ui-table
            v-loading="loading"
            element-loading-text="玩命加载中..."
            :has-data="tableData.length>0"
            v-model="checkAll"
            :body-height="41"
            @check="head_check"
            @sort-click="sort_click"
            :heads="[
                        {isCheck:true,width:2},
                        {label:'主图',size:75},
                        {label:'平台产品ID',width:10},
                        {label:'平台SPU',width:7},
                        {label:'本地SPU',width:7},
                        {label:'刊登标题',width:11},
                        {label:'平台账号',width:6},
                        {label:'平台店铺',width:6},
                        {label:'销售员',width:6},
                        {label:'审核状态',width:7},
                        {label:'已收藏',width:7,isSort:true,order_type:'number_saves'},
                        {label:'已售量',width:7,isSort:true,order_type:'number_sold'},
                        {label:'修改状态',width:6},
                        {label:'上传时间',width:9,isSort:true,order_type:'date_uploaded'},
                        {label:'更新时间',width:9,isSort:true,order_type:'update_time'},
                        {label:'操作',size:120}
                       ]">
            <tbody>
            <template v-for="(data, index) in tableData">
                <tr :class="[data.show ? 'active' : '',data.heighLight?'active-color':'',data.listing_status===5?'redborder':'']" @click="addClass(index)"
                    :key="data.id">
                    <td><el-checkbox v-model="data.isCheck" @change="check_row"></el-checkbox></td>
                    <td>
                        <el-popover placement="right" trigger="hover">
                            <img v-lazy="main_img(data.main_image,200)"
                                 @click="search_img(data.main_image)"
                                 width="200px" height="200px">
                            <span slot="reference">
                                  <img v-lazy="main_img(data.main_image,100)"
                                       @click="search_img(data.main_image)"
                                       height="60px" width="60px" style="border:none">
                            </span>
                        </el-popover>
                    </td>
                    <td>
                        <i @click="show_detail(data)" :class="[data.show? 'minus':'plus','fl']"></i>
                        <ui-tip :content="data.product_id" :width="70"></ui-tip>
                    </td>
                    <td style="position: relative">
                        <ui-tip :content="data.parent_sku"></ui-tip>
                    </td>
                    <td> <!-- 本地sku-->
                        <ui-tip :content="data.local_parent_sku" :width="88"></ui-tip>
                    </td>
                    <td>
                        <ui-tip :is-operate="true" :content="data.name" :width="90"
                                @cur-click="cur_click(data)"></ui-tip>
                    </td>
                    <td><ui-tip :content="data.account_name" :width="80"></ui-tip></td>
                    <td><ui-tip :content="data.shop_name" :width="80"></ui-tip></td>
                    <td><ui-tip :content="data.sellor" :width="80"></ui-tip></td>
                    <td><ui-tip :content="data.review_status_text" :width="80"></ui-tip></td>
                    <td><ui-tip :content="data.number_saves" :width="80"></ui-tip></td>
                    <td><ui-tip :content="data.number_sold" :width="80"></ui-tip></td>
                    <td><ui-tip :content="data.lock_update" :width="80"></ui-tip></td>
                    <td><ui-tip :content="data.date_uploaded" :width="80"></ui-tip></td>
                    <td><ui-tip :content="data.update_time" :width="80"></ui-tip></td>
                    <td>
                        <trends-select  class="inline"
                                        @trigger="operate(data,$event)"
                                        :selects="operatesList"
                                        type="primary"></trends-select>
                    </td>
                </tr>
                <template v-if="data.show">
                    <tr style="font-weight:bold" :key="index" class="variant">
                        <td colspan="2" :rowspan="`${(data.varians.length)+1}`"></td>
                        <td>产品图片</td>
                        <td colspan="2">平台SKU</td>
                        <td colspan="2">本地SKU</td>
                        <td>颜色</td>
                        <td>尺寸</td>
                        <td>销售价</td>
                        <td>运费</td>
                        <td>可售量</td>
                        <td>发货期</td>
                        <td>平台状态</td>
                        <td>本地状态</td>
                        <td :colspan="9" :rowspan="`${(data.varians.length)+1}`"></td>
                    </tr>
                    <tr v-for="(item, item_i) in data.varians" :key="item_i" class="variant">
                        <td>
                            <el-popover placement="right" trigger="hover">
                                <img v-lazy="main_img(item.main_image,'200',item.base_url)"
                                     @click="search_img(item.main_image,item.base_url)"
                                     width="200px" height="200px">
                                <span slot="reference">
                                  <img v-lazy="main_img(item.main_image,'100',item.base_url)"
                                       @click="search_img(item.main_image,item.base_url)"
                                       height="60px" width="60px" style="border:none">
                                </span>
                            </el-popover>
                        </td>
                        <td colspan="2"><ui-tip :content="item.sku" :width="98"></ui-tip></td>
                        <td colspan="2"><ui-tip :content="item.sku_id" :width="98"></ui-tip></td>
                        <td>{{item.color}}</td>
                        <td>{{item.size}}</td>
                        <td>{{item.price}}</td>
                        <td>{{item.shipping || 0}}</td>
                        <td>{{item.inventory}}</td>
                        <td>{{item.shipping_time}}</td>
                        <td>{{item.enabled}}</td>
                        <td>{{item.sell_status}}</td>
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
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>

    </div>
</template>
<style lang="stylus">
    .wish-wishPublish-list{
    }
</style>
<script>
    import {
        api_joom_listing_list,
        api_joom_list_variant,
        api_joom_list_enable,
        api_joom_listing_sync,
        url_joom_list_enable
    } from "../../../../api/publish-joom";
    import {get_path} from '../../ebay/kandeng-list/add-edit-listing/get-path';
    import {operateList} from './action';
    export default{
        permission: {
            url_joom_list_enable
        },
        data(){
            return{
                btnList:[//----------------------------------------------操作按钮
                    {name:'批量上架',clickName:'',status:1,api:url_joom_list_enable},
                ],
                tableData:[],
                loading:false,
                firstLoading:true,
                page:1,
                pageSize:50,
                total:0,
                paramList:{
                    account_id:"",
                    shop_id:"",
                    create_id:"",
                    review_status:"",
                    min_text:"",
                    max_text:"",
                    variant_enabled:"",
                    lock_update:"",
                    sell_status:"",
                    sectionType:"price",
                    min_time:"",
                    max_time:"",
                    snType:"local_sku",
                    snText:"",
                },
                enabled:0,
                checkAll:false,
                imgDialog:false,
                imgPath:"",
                order:{
                    order:"",
                    sort:"",
                },
                operateList:operateList,
                baseUrl:"",

            }
        },
        mounted(){
        	this.init();
        },
        methods:{
            cur_click(row){ //连接跳转
                window.open("https://www.joom.com/en/products/"+row.product_id);
            },
            init(){
                let data = window.clone(this.paramList);
                data.page = this.page;
                data.pageSize = this.pageSize;
                data.enabled = this.enabled;
                if(data.max_time) {
                    data.max_time = datef("YYYY-MM-dd",data.max_time/1000)
                }else {
                    data.max_time="";
                }
                if(data.min_time) {
                    data.min_time = datef("YYYY-MM-dd",data.min_time/1000)
                }else {
                    data.min_time="";
                }
                Object.assign(data,this.order);
                this.loading = true;
                this.$http(api_joom_listing_list,data).then(res=>{
                    res.data.forEach(row => {
                        row.num = "";
                        row.show = false;
                        row.isCheck = false;
                        row.heighLight = false;
                        this.$set(row,"varians",[]);
                    });
                    this.baseUrl = res.base_url;
                    this.tableData = res.data;
                    this.total = res.count;
                    this.loading = false;
                }).catch(code=>{
                    this.$message({type:"error", message: code.message || code});
                })
            },
            search(){
                this.init();
            },
            //获取sku
            show_detail(data){
                data.show =!data.show;
//                data.show&&this.operate_data_id(data,"id");
                if(data.show){
                    this.get_variations(data);
                }
            },
            //数据处理（获取子商品）  暂时不用
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
                this.$http(api_joom_list_variant,{joom_product_id: data.id,}).then(res=>{
                    data.varians = res;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                });
            },
            clicked(status){//------------------------------------操作不同按钮执行的事件
                let data=this.tableData.filter(row=>row.isCheck);
                if(data.length===0){
                    this.$message({message:"请选择要批量修改的数据", type:'warning'});
                    return ;
                }
                this.selectedIds = window.clone(data);
                switch (status){
                    case 1:         //批量上架
                        this.batch_online(data);
                        break;
                    default:
                        break;
                }
            },
            //批量上架
            batch_online(data){
                let obj = {
                    product_ids:data.map(row=>row.product_id).join(","),
                };
                this.$confirm(`您将要对已选Listing执行批量上架, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.operate_online_data(data,obj);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消上架'
                    });
                });
            },
            //单个上架
            operate_online(data){
                this.$confirm(`您将要对已选Listing执行批量上架, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.operate_online_data(data,{product_ids:data.product_id+''});
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消上架'
                    });
                });
            },
            //操作数据
            operate_online_data(datas,obj){
                this.$http(api_joom_list_enable,obj).then(res=>{
                    this.$message({
                        type:"success",
                        message:res.message||res
                    });
                    if(datas instanceof Array){
                        datas.forEach(row=>{
                            let index=this.tableData.indexOfFun(old => {
                                return old.id===row.id;
                            });
                            this.tableData.splice(index,1);
                            this.total-=1;
                        })
                    } else if(datas instanceof Object){
                        let i = this.tableData.indexOfFun(old => {
                            return old.id===datas.id;
                        });
                        this.tableData.splice(i,1);
                        this.total-=1;
                    }
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                });
            },
            handleSizeChange(size){
                this.pageSize=size;
                this.init();
            },
            handleCurrentChange(page){
                this.page=page;
                this.init();
            },
            check_row(){
                this.checkAll=!this.tableData.find(row=>!row.isCheck);
            },
            sort_click(val){
                this.order.sort = val.order;
                this.order.order = val.order_type;
//                let curData = JSON.stringify(clone(this.searchData));
//                sessionStorage.setItem('aliSearchData',curData);
                this.init();
            },
            head_check(val){
                this.tableData.forEach(row=>{
                    row.isCheck=val;
                });
            },
            //处理图片
            get_path,
            main_img(image,size,base_url){
                if(image.includes('http')){
                    if(size===500){
                        return image;
                    }
                    if(image.includes('original')){
                        return image.replace('_original.',`_${size}_${size}.`);
                    }
                }
                return this.get_path(image,`_${size}x${size}.`, base_url||this.baseUrl);
            },
            search_img(image,base_url){
                this.imgPath = this.main_img(image,500,base_url);
                this.imgDialog = true;
            },
            // 高亮
            addClass(index){
                this.tableData.forEach(row=>{
                    row.heighLight=false;
                });
                this.tableData[index].heighLight=true
            },
            operate(data,options){
                options.action.call(this,data);
            },
        },
        computed:{
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
                let list=operateList.filter(row=>{
                    return row.status.includes(2)
                })
                return list.filter(row=>{
                    return this.$hasPermission(row.api)
                })
            }
        },
        props:{
            accountList:{
                required: true,
                type: Array
            },
            userList:{
                required: true,
                type: Array
            }
        },
        components:{
            search:require('./search.vue').default,
            uiTable:require('../../../../components/ui-table.vue').default,
            uiTip:require('../../../../components/ui-tip.vue').default,
            blowupImage:require("../../../../components/blowup-image.vue").default,
            trendsSelect:require('../../../../components/trends-select.vue').default,
        }
    }
</script>
