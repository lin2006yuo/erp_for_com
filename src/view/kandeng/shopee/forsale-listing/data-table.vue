<template>
    <div class="c-data-table">
        <div class="mt-xs mb-xs ml-sm">
            <el-button
                class="inline mb-mini"
                size="mini"
                type="primary"
                v-for="(item,index) in btnslist"
                :key="index"
                :disabled="!is_batch"
                @click.native='clicked(item.status)'>{{item.name}}</el-button>
        </div>
        <ui-table
            v-loading="loading"
            element-loading-text="玩命加载中..."
            :first-loading="firstLoading"
            :has-data="tableData.length>0"
            :body-height="41"
            @check="head_check"
            :heads="[
                {isCheck:true,width:2},
                {label:'主图',size:75},
                {label:'商品ID',width:10},
                {label:'平台SPU',width:10},
                {label:'刊登标题',width:11},
                {label:'账号简称',width:6},
                {label:'销售员',width:6},
                {label:'已收藏',width:7,isSort:true,order_type:'number_saves'},
                {label:'已售量',width:7,isSort:true,order_type:'number_sold'},
                {label:'上传时间',width:9,isSort:true,order_type:'date_uploaded'},
                {label:'更新时间',width:9},
                {label:'操作',size:120}
                ]">
            <tbody>
            <template v-for="(data, index) in tableData">
                <tr :class="[data.show ? 'active' : '',data.heighLight?'active-color':'',data.listing_status===5?'redborder':'']" @click="addClass(index)"
                    :key="data.id">
                    <td><el-checkbox v-model="data.isCheck" @change="check_row"></el-checkbox></td>
                    <td>
                        <el-popover placement="right" trigger="hover">
                            <img v-lazy="main_img(data.images,200)"
                                 @click="search_img(data.images)"
                                 width="200px" height="200px">
                            <span slot="reference">
                                <img v-lazy="main_img(data.images,100)"
                                     @click="search_img(data.images)"
                                     height="60px" width="60px" style="border:none">
                            </span>
                        </el-popover>
                    </td>
                    <td>
                        <i @click="show_detail(data)" :class="[data.show? 'minus':'plus','fl']"></i>
                        <ui-tip :content="data.item_id" :width="80"></ui-tip>
                    </td>
                    <td><ui-tip :content="data.item_sku"></ui-tip></td>
                    <td><ui-tip :content="data.name" :width="74"></ui-tip></td>
                    <td><ui-tip v-if='data.account' :content="data.account.code" :width="60"></ui-tip></td>
                    <td><ui-tip :content="data.sellername" :width="80"></ui-tip></td>
                    <td><ui-tip :content="data.likes" :width="80"></ui-tip></td>
                    <td><ui-tip :content="data.sales" :width="80"></ui-tip></td>
                    <td><times :time="data.create_time" :width="80"></times></td>
                    <td><times :time="data.update_time"></times></td>
                    <td>
                        <trends-select
                            class="inline"
                            @trigger="operate(data,$event)"
                            :selects="operatesList"
                            type="primary"></trends-select>
                    </td>
                </tr>
                <template v-if="data.show">
                    <tr style="font-weight:bold" :key="index" class="variant">
                        <td colspan="2" :rowspan="`${(data.variants.length)+1}`"></td>
                        <td colspan="2">平台SKU</td>
                        <td colspan="1">本地SKU</td>
                        <td colspan="2">商品规格属性</td>
                        <td>销售价[{{data.currency}}]</td>
                        <td>可售量</td>
                        <td colspan="2">本地状态</td>
                        <td :colspan="`${6-data.variants.length}`" :rowspan="`${data.variants.length+1}`"></td>
                    </tr>
                    <tr v-for="(item, item_i) in data.variants" :key="item.id"  class="variant">
                        <td colspan="2"><ui-tip :content="item.variation_sku" :width="98"></ui-tip></td>
                        <td colspan="1"><ui-tip :content="item.local_sku" :width="98"></ui-tip></td>
                        <td colspan="2">{{item.name}}</td>
                        <td>{{item.price}}</td>
                        <td>{{item.stock}}</td>
                        <td colspan="2">{{item.sku_sale_status}}</td>
                    </tr>
                </template>
            </template>
            </tbody>
        </ui-table>
        <stock-add v-model="stockaddEdit" @change-stock="change_stock" :selected-ids="selectedIds" :title="title"></stock-add>
        <price-add v-model="priceaddEdit" :selected-ids="selectedIds" :title="title"></price-add>
        <weight-add v-model="weightaddEdit" :selected-ids="selectedIds" :title="title"></weight-add>
        <logistics-add v-model="logisticsaddEdit" :selected-ids="selectedIds" :thecode="thecode" :title="title"></logistics-add>
        <discount-add v-model="discountaddEdit" :selected-ids="selectedIds" :thecode="thecode" :title="title"></discount-add>
        <action-log v-model="logVisable" :product-id="productId" type="shopee"></action-log>
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {get_path} from '../../ebay/kandeng-list/add-edit-listing/get-path';
    import  {api_shopee_publish,api_logs_publish,api_batch_setting,api_batch_del_item,
        url_shopee_publish,url_batch_setting,url_logs_publish,url_batch_del_item} from "../../../../api/shopee-publish"
	export default{
        permission: {url_shopee_publish, url_batch_setting,url_logs_publish,url_batch_del_item},
		data(){
			return {
                checkAll:false,
                logVisable:false,
                productId:'',
                btnList:[//------------操作按钮
                    {name:'同步Listing',clickName:'',status:1,api:url_batch_setting},
                    {name:'批量改可售量',clickName:'',status:2,api:url_batch_setting},
                    {name:'批量改价格',clickName:'',status:3,api:url_batch_setting},
                    {name:'批量改重量',clickName:'',status:4,api:url_batch_setting},
                    {name:'批量改物流方式',clickName:'',status:5,api:url_batch_setting},
                    {name:'批量设置折扣',clickName:'',status:6,api:url_batch_setting},
                    {name:'批量下架',clickName:'',status:7,api:url_batch_del_item},
                ],
                operates:[
                	{name:"编辑",api:url_shopee_publish,action:function (row,action) {
                            let params = {
                                goods_id: row.goods_id,
                                account_id:row.account_id,
                                curPage: 'onSale',
                                spu:row.spu,
                                id:row.id,
                            };
                            this.$open(`/shopee/info-detail`, params)
                    }},
                    {name:"操作日志",api:url_logs_publish,action:function (row,action) {
                        this.logVisable = true;
                        this.productId = row.item_id;
                    }},
                ],
                title:'',
                stockaddEdit:false,
                priceaddEdit:false,
                weightaddEdit:false,
                logisticsaddEdit:false,
                discountaddEdit:false,
                selectedIds:[],
                thecode:'',
                imgDialog:false,
                imgPath:'',
            }
		},
        methods:{
            change_stock(val){
                val.forEach(row=>{
                    let find = this.selectedIds.find(res=>res.variation_sku===row.variation_sku)
                    if(!!find)find.stock = row.stock;
                });
            },
            operate(data,action){
                action.action.call(this,data,action)
            },
            //获取sku
            show_detail(data){
                data.show =!data.show;
            },
            clicked(status){//------------------------------------操作不同按钮执行的事件
                let data=this.tableData.filter(row=>row.isCheck);
                if(data.length===0) return this.$message({message:"请选择要批量修改的数据", type:'warning'});
                switch (status){
                    case 1:         //同步Listing
                        this.rsyncProduct_off(data);
                        break;
                    case 2:         //批量改可售量
                        this.stock_off(data);
                        break;
                    case 3:         //批量改价格
                        this.price_off(data);
                        break;
                    case 4:         //批量改重量
                        this.weight_off(data);
                        break;
                    case 5:         //批量改物流方式
                        this.logistics_off(data);
                        break;
                    case 6:         //批量设置折扣
                        this.discount_off(data);
                        break;
                    case 7:         //批量下架
                        this.batch_del_item(data);
                        break;
                    default:
                        break;
                }
            },
            batch_del_item(data){
                let params = data.map(row=>{
                    return {
                        account_id:row.account_id,
                        item_id:row.item_id
                    }
                });
                this.$http(api_batch_del_item,{data:params}).then(res => {
                    this.$message({type:'success',message:res.message||res});
                    data.forEach(row=>{
                        let index = this.tableData.findIndex(item=>item.id === row.id)
                        this.tableData.splice(index,1)
                    });

                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                })
            },
            rsyncProduct_off(data){
                let datas =[];
                data.forEach(item=>{
                	let dataTable = {
                        item_id:item.item_id
                    }
                    datas.push(dataTable);
                })
                let params = {
                    field:'rsyncProduct',
                    data:datas
                }
                this.$confirm(`您将要对已选Listing执行同步, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return this.$http(api_batch_setting,params).then(res=>{
                        this.$message({type:"success", message:res.message||res});
                        return Promise.resolve();
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'})
                    })
                }).catch(() => {
                    this.$message({type: 'info', message: '已取消同步'});
                });
            },
            stock_off(data){
                this.title = `批量改可售量`;
                this.stockaddEdit = true;
                let variants = [];
                data.forEach(row=>{
                    row.variants.forEach(res=>{
                    	this.$set(res,'item_sku',row.item_sku);
                    	this.$set(res,'item_id',row.item_id);
                    });
                    variants = [...variants,...row.variants]
                });
                this.selectedIds = variants;
            },
            price_off(data){
                this.title = `批量改价格`;
                let pricelist = [];
                data.forEach(row=>{
                	row.variants.forEach(res=>{
                		this.$set(res,'item_sku',row.item_sku);
                		this.$set(res,'item_id',row.item_id);
                		this.$set(res,'stock',row.stock);
                		this.$set(res,'newprice','');
                    });
                	pricelist = [...pricelist,...row.variants];
                });
                this.selectedIds = pricelist;
                this.priceaddEdit = true;
            },
            weight_off(data){
                this.title = `批量改重量`;
                let weightlist = [];
                data.forEach(row=>{
                	row.variants.forEach(res=>{
                        this.$set(res,'item_sku',row.item_sku);
                		this.$set(res,'item_id',row.item_id);
                		this.$set(res,'weight',row.weight);
                		this.$set(res,'newweight','');
                    })
                    weightlist = [...weightlist,...row.variants];
                });
                this.weightaddEdit = true;
                this.selectedIds =  weightlist;
            },
            logistics_off(data){
                this.title = `批量改物流方式`;
                let list = data.map(row=>{
                    return !!row.account?row.account.code:''
                });
                list =[...new Set(list)];
                if(list.length>1)return this.$message({type:"warning", message:'请勾选相同账号的Listing！'});
                this.thecode = list[0];
                let datas =[];
                data.forEach(item=>{
                    let dataTable = [];
                    if(item.variants.length>0){
                        item.variants.forEach(res=>{
                            this.$set(res,'item_id',item.item_id);
                            this.$set(res,'account_id',item.account_id);
                        });
                        dataTable = [...item.variants];
                    }else {
                        let account = {
                            item_id:item.item_id,
                            account_id:item.account_id,
                        }
                        dataTable = [account];
                    }

                    datas = [...datas,...dataTable];
                });
                this.logisticsaddEdit = true;
                this.selectedIds =  datas;
            },
            discount_off(data){
                this.title = `批量设置折扣`;
                let list = data.map(row=>{
                	return !!row.account?row.account.code:'';
                });
                list = [...new Set(list)];
                if(list.length>1)return this.$message({type:"warning", message:'请勾选相同账号的Listing！'});
                this.thecode = list[0];
                this.discountaddEdit = true;
                this.selectedIds =  data;
            },
            addClass(index){
                this.tableData.forEach(row=>{
                    row.heighLight=false;
                });
                this.tableData[index].heighLight=true
            },
            head_check(val){
                this.tableData.forEach(row=>{
                    row.isCheck=val;
                });
            },
            // 单行选择
            check_row(){
                this.checkAll=!this.tableData.find(row=>!row.isCheck);
            },
            search_img(image,base_url){
                this.imgPath = this.main_img(image,500,base_url);
                this.imgDialog = true;
            },
            get_path,
            main_img(image,size,base_url){
                if(image){
                    image = JSON.parse(image);
                    let curImage = image[0];
                    if(curImage.includes('http')){
                          return curImage;
                        // if(curImage.includes('original')){
                        //     return curImage.replace('_original.',`_${size}_${size}.`);
                        // }
                    }else{
                        return this.get_path(curImage,`_${size}x${size}.`, base_url||this.baseUrl);
                    }
                }else{
                    return '';
                }
            },
        },
        computed:{
            btnslist(){
                let list = this.btnList.filter(row=>{
                    if(row.api){
                        return this.$hasPermission(row.api);
                    }else {
                        return true;
                    }
                });
                return list
            },
            operatesList(){
                return this.operates.filter(row=>{
                    return this.$hasPermission(row.api);
                })
            },
            is_batch(){
                return !!this.tableData.find(row=>row.isCheck);
            },
        },
        props:{
            tableData:{
                required:true,
                type:Array
            },
            loading:{
		    	typle:Boolean,
            },
            firstLoading: {
                type: Boolean,
                required: true
            }
        },
		components: {
            uiTable:require('../../../../components/ui-table.vue').default,
            trendsSelect:require('@/components/trends-select').default,
            uiTip:require('../../../../components/ui-tip.vue').default,
            actionLog:require('../../wish/list/action-log').default,
            stockAdd:require('./stock-add.vue').default,
            priceAdd:require('./price-add.vue').default,
            weightAdd:require('./weight-add.vue').default,
            logisticsAdd:require('./logistics-add.vue').default,
            discountAdd:require('./discount-add.vue').default,
            blowupImage:require("@/components/blowup-image.vue").default,
        }
	}
</script>
