<template>
    <el-row class="aliexpress-has-published">
        <search-list :search-data="searchData" :clears="clears" @search="search"></search-list>
        <div class="mt-sm mb-sm ml-sm">
            <request-button req-key="clicked_submit" :mintime="200" v-for="(item,index) in btnList" :key="index"
                       @click.native='clicked(item.status)' >{{item.name}}</request-button>
            <request-button req-key="output_format_submit" :mintime="200" @click.native="output_format">导出为小平台格式</request-button>
            <el-button type="primary" size="mini" class=""
                       @click.native="change_price_yet">已更改价格</el-button>
            <permission tag="ElButton"
                        :route="apis.url_post_publish_express_batch_copy"
                        size="mini"
                        type="primary"
                        @click.native="batch_copy">批量复制
            </permission>
            <el-select v-model="option" placeholder="请选择更多操作" style="bottom: 2px;" class="inline ml-sm has-inline s-width-middle">
                <el-option v-for="item in optionsChange" :key="item.value" :label="item.label" :value="item.value" @click.native="process(item)"></el-option>
            </el-select>
        </div>
        <!--table数据-->
        <ui-table
            ref="table"
            v-loading="loading"
            element-loading-text="玩命加载中..."
            :body-height="41"
            :first-loading="firstLoading"
            :has-data="tableData.length>0"
            v-model="checkAll"
            @check="head_check"
            @sort-click="sort_click"
            :heads="[
                        {isCheck:true,width:2,},
                        {label:'产品图片',size:75},
                        {label:'商品平台ID',width:9},
                        {label:'本地SPU',width:8},
                        {label:'刊登标题',width:18},
                        {label:'运费模板',width:8},
                        {label:'账号简码',width:8},
                        {label:'产品分组',width:7},
                        {label:'销售员',width:4},
                        {label:'平台产品状态',width:6},
                        {label:'零售价',width:5,isSort:true,order_type:'price'},
                        {label:'批发价',width:5,isSort:true,order_type:'wholesale'},
                        {label:'可售量',width:5,isSort:true,order_type:'stock'},
                        {label:'修改状态',width:5},
                        {label:'更新时间/上传时间',width:10,isSort:true,order_type:'date_uploaded'},
                        {label:'操作',size:120},
                       ]">
            <tbody>
            <template v-for="(data, index) in tableData">
                <tr :class="[data.show ? 'active' : '',data.heighLight?'active-color':'',data.lock_update===2?'redborder':'']"  @click="addClass(index)"  :key="data.id">
                    <td><el-checkbox v-model="data.isCheck" @change="check_row"></el-checkbox></td>
                    <td>
                        <el-popover placement="right" trigger="hover">
                            <img v-lazy="small_img(data.main_img,'_250x250.')"  @click="search_img(data.main_img,'')" width="200px" height="200px">
                            <span slot="reference">
                              <img v-lazy="small_img(data.main_img,'_120x120.')" height="60px" width="60px" @click="search_img(data.main_img)" style="border:none">
                            </span>
                        </el-popover>
                    </td>
                    <td><i @click="show_detail(data)" :class="[data.show? 'minus':'plus','fl']" title="点击展开菜单"></i><ui-tips :content="data.product_id"></ui-tips> </td>
                    <td style="position: relative">
                         <span @click="bind_spu(data)" class="operate" v-if="data.goods_id===0&&data.product_sku.length">
                             <i class="el-icon-information" style="position: absolute;left: 5px" title="点击关联"></i>
                            <ui-tips :content="data.goods_spu||'未关联'"  style="padding-left: 12px"></ui-tips>
                        </span>
                        <ui-tips :content="data.goods_spu" v-else></ui-tips>
                    </td>
                    <td>
                        <ui-tips :is-operate="true" :content="data.subject" :width="96"
                                @cur-click="cur_click(data)"></ui-tips>
                    </td>
                    <td><ui-tips :content="data.freight_template_name" :width="65"></ui-tips></td>
                    <td><ui-tips :content="data.account_code" :width="65"></ui-tips></td>
                    <td><ui-tips :content="data.group_name" :width="65"></ui-tips></td>
                    <td><ui-tips :content="data.seller" ></ui-tips></td>
                    <td>{{data.product_status_type}}</td>
                    <td><ui-tips :content='`$ ${data.price}`'></ui-tips></td>
                    <td><ui-tips :content='get_wholesale_price(data)'></ui-tips></td>
                    <td>{{data.stock}}</td>
                    <td>{{data.lock_update|lockFilter}}</td>
                    <td>
                        <div>
                            <div>
                                <times v-if="hasUpdateTime(data)" :time="data.update_time"></times>
                                <label v-else>-- --</label>
                            </div>
                            <div>
                                <times v-if="hasCreateTime(data)" :time="data.goods.create_time"></times>
                                <label v-else>-- --</label>
                            </div>
                        </div>
                    </td>
                    <td>
                        <trends-select  class="inline" @trigger="check(data,$event)" :selects="operateList" type="primary"></trends-select>
                    </td>
                </tr>
                <template v-if="data.show">
                    <tr style="font-weight:bold" :key="data.id" class="variant">
                        <td colspan="2" :rowspan="`${data.product_sku.length+1}`"></td>
                        <td>SKU图片</td>
                        <td >平台SKU</td>
                        <td>本地SKU</td>
                        <td v-for="attr in data.used_attr" :key="attr">{{attr}}</td>
                        <td>成本价</td>
                        <td>销售价</td>
                        <td>批发价</td>
                        <td>可售量</td>
                        <td colspan="2"> 本地状态</td>
                        <td :colspan="`${6-data.used_attr.length}`" :rowspan="`${data.product_sku.length+1}`"></td>
                    </tr>
                    <tr v-for="(item,item_i) in data.product_sku" :key="`${item.id}${item_i}`" class="variant">
                        <td>
                            <el-popover placement="right" trigger="hover">
                                <img v-lazy="product_img(item,'_250x250.')"  @click="search_img_sku(item)" width="200px" height="200px">
                                <span slot="reference">
                                  <img v-lazy="product_img(item,'_120x120.')" height="60px" width="60px" @click="search_img_sku(item)" style="border:none">
                                </span>
                            </el-popover>
                        </td>
                        <td><ui-tips :content="item.sku_code" ></ui-tips></td>
                        <td><ui-tips :content="item.local_sku" ></ui-tips></td>
                        <td v-for="(attr,attr_i) in  data.used_attr" :key="attr_i">{{data.listing_attr_val[attr_i][item_i]}}</td>
                        <td>
                            <div>{{item.pre_cost}}</div>
                            <div class="costclass" v-if="Number(item.current_cost)>Number(item.pre_cost)">
                                <span>涨价：{{(Number(item.current_cost)-Number(item.pre_cost)).toFixed(2)}}</span>
                            </div>
                            <div class="priceclass" v-if="Number(item.current_cost)<Number(item.pre_cost)">
                                <span>降价：{{(Number(item.pre_cost)-Number(item.current_cost)).toFixed(2)}}</span>
                            </div>
                        </td>
                        <td>$ {{item.sku_price}}</td>
                        <td>{{get_wholesale(data,item)}}</td>
                        <td>{{item.ipm_sku_stock}}</td>
                        <td colspan="2">{{item.local_status}}</td>
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
            :page-sizes="[20, 50, 100, 200]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <bind-spu v-model="bindVisable" :channel-sku="channelSku"
                  :local-sku="localSku" type="aliExpress" @refresh="update">
        </bind-spu>
        <add-goods v-model="addlistVisable" @selected="selecteds"></add-goods>
        <action-log v-model="logVisable" :product-id="productId" type="aliExpress"></action-log>
        <modify-group v-model="groupVisable" :selected-ids="selectedIds" :account-id="accountId" @change-data="change_group"></modify-group>
        <modify-delivery v-model="deliveryVisable" :selected-ids="selectedIds" @change-data="change_delivery"></modify-delivery>
        <extended-period v-model="periodVisable" :selected-ids="selectedIds"></extended-period>
        <modify-title v-model="titleVisable" :selected-ids="selectedIds" :type="type" @change-data="change_title" :ebay-status="published"></modify-title>
        <modify-unit v-model="unitVisable" :selected-ids="selectedIds" @change-data="change_unit"></modify-unit>
        <modify-weight v-model="weightVisable" :selected-ids="selectedIds" @change-data="change_weight"></modify-weight>
        <modify-size v-model="sizeVisable" :selected-ids="selectedIds" @change-data="change_size"></modify-size>
        <modify-products v-model="productsVisable" :selected-ids="selectedIds" :account-id="accountId" @change-data="change_product"></modify-products>
        <modify-service v-model="serviceVisable" :selected-ids="selectedIds" :account-id="accountId" @change-data="change_service"></modify-service>
        <modify-freight v-model="freightVisable" :selected-ids="selectedIds" :account-id="accountId" @change-data="change_freight"></modify-freight>
        <modify-price v-model="priceVisable" :selected-ids="selectedIds" @change-data="change_price"></modify-price>
        <modify-quantity v-model="quantityVisable" :selected-ids="selectedIds" @change-data="change_quantity"></modify-quantity>
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
        <accounts v-model="accountsDialog" :accounts="accounts" :is-request="isRequest" @selected="selected_change"></accounts>
    </el-row>
</template>
<style lang="stylus">
    .aliexpress-has-published{
        .redborder{
            background-color: rgba(250, 172, 171, 0.5)!important;
        }
    }
    .costclass{
        background: red;
        color:#fff;
        border-radius:2px;
    }
    .priceclass{
        background: #00CC66;
        color:#fff;
        border-radius:2px;
    }
</style>
<script>
    import {
        api_aliexpress_list,
        api_aliexpress_batch_online,
        api_aliexpress_batch_offline,
        api_aliexpress_rsync,
        api_aliexpress_rsync_update,
        api_get_change_cost_price,
        api_post_publish_express_batch_copy,
        url_aliexpress_batch_online,
        url_aliexpress_batch_product,
        url_aliexpress_edit_product,
        url_post_publish_express_batch_copy
    } from "../../../../api/publish-smt"
    import {operateList,btnList} from './action';//------操作按钮引入
    import {api_windows_list, api_set_window_products} from '../../../../api/aliexpress-windows'
    import {api_add_goods} from "../../../../api/supplier-quote"
    import {get_path} from '../../ebay/kandeng-list/add-edit-listing/get-path';
    import {api_aliexpress_output_format,api_express_get_accounts} from '../../../../api/publish-smt.js';
    import {downloadFile} from '../../../../lib/http';
    export default{
        permission: {
            url_aliexpress_batch_online,
            url_aliexpress_batch_product,
            url_aliexpress_edit_product,
            url_post_publish_express_batch_copy
        },
        data(){
            return {
                firstLoading:true,
                page:1,
                pageSize:50,
                total:0,
                checkAll:false,
                bindVisable:false,
                loading:false,
                option:"",
                tableData:[],
                addlistVisable:false,
                expires:[],
                searchData:{
                    ntime:'date_uploaded',
                    account_id: "",
                    status: "",
                    snType:"spu",
                    snText: "",
                    local_status: "",
                    start: "",
                    expire_day:"",
                    end: "",
                    order_type:'',
                    order_sort:'',
                    application:'',
                    salesperson_id:'',
                    cost_price_type:0,
                    cost_price:'',
                },
                clears:{
                    ntime:'date_uploaded',
                    snType:"sku",
                    cost_price_type:0,
                },
                idList:[],
                flag:0,
                selectedIds:[],
                accountId:"",
                groupVisable:false,
                deliveryVisable:false,
                periodVisable:false,
                titleVisable:false,
                unitVisable:false,
                weightVisable:false,
                sizeVisable:false,
                productsVisable:false,
                serviceVisable:false,
                freightVisable:false,
                priceVisable:false,
                quantityVisable:false,
                productId:'',
                logVisable:false,
                type:"",
                published:"already",
                channelSku:[],
                localSku:{
                    data:[]
                },
                baseUrl:"",
                imgDialog: false,
                imgPath:"",
                accountsDialog:false,
                accounts:[],
                isRequest:false
            }
        },
        mounted(){
            this.get_accounts();
            this.init();
        },
        computed:{
            ids(){
                return this.tableData.filter(row=>row.isCheck).map(row=>row.id);
            },
            btnList(){
                return btnList.filter(row=>{
                    return this.$hasPermission(row.api);
                });
            },
            optionsChange(){
                return this.options.filter(row=>{
                    return this.$hasPermission(row.api);
                });
            },
            operateList(){
                let list=operateList.filter(row=>{
                    return row.status.includes(1);
                });
                return list.filter(row=>{
                    return this.$hasPermission(row.api);
                });
            }
        },
        methods:{
            get_accounts(){
                this.$http(api_express_get_accounts).then(res=>{
                    this.accounts = res;
                }).catch(code=>{
                    console.log(code)
                });
            },
            batch_copy(){
                if(this.ids.length===0){
                    this.$message({type: "warning", message: '请勾选需要复制的数据！'});
                    return
                }
                this.accountsDialog = true;
            },
            selected_change(ids){
                if(ids.length===0){
                    this.$reqKey('url_post_publish_express_batch_copy',false);
                    this.$message({type: "warning", message: '请选择账号！'});
                    return
                }
                this.isRequest = true;
                let data = {
                    product_ids:this.ids.join(','),
                    account_ids:ids.map(row=>row.account_id).join(',')
                };
                this.$http(api_post_publish_express_batch_copy,data).then(res=>{
                    this.$message({type:'success',message:res.message||res});
                    this.accountsDialog = false;
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('url_post_publish_express_batch_copy',false);
                        this.isRequest = false;
                    },200);
                })
            },
            hasUpdateTime(data){
                return data.update_time>=0
            },
            hasCreateTime(data){
                return data.goods&&data.goods.create_time>=0
            },
            cur_click(row){ //连接跳转
                window.open("https://www.aliexpress.com/item/detail/"+row.product_id+".html");
            },
            get_path,
            small_img(path,size){
                if(path.includes('http')){
                	return size ? `${path}${size}jpg` : path;
                }else{
                	let newSize = size ? size : '_500x500.';
                	return this.get_path(path,newSize,this.baseUrl);
                }
            },
            search_img(path,size){
                this.imgPath = this.small_img(path,size,this.baseUrl);
                this.imgDialog = true;
            },
            search_img_sku(item){
            	let data = this.product_img(item);
                this.search_img(data);
            },
        	//子sku图片
            product_img(item,size){
            	let img = "";
            	if(item.sku_attr&&item.sku_attr.length){
                    img = item.sku_attr[0].skuImage;
                }
                if(img){
                    return this.small_img(img,size,this.baseUrl);
                }
                return img;
            },
            filter_path(data){
            	if(typeof data==='string'){
                    if(data.includes('http')){
                        return data;
                    }else{
                    	return this.baseUrl + data;
                    }
                }
                return data;
            },
            selecteds(val){
                let spu=val.map(row=> row.spu).join(',');
                this.$http(api_add_goods,{page:1,pageSize:100,snType:'spu',snText:spu}).then(res=>{
                    this.localSku=res;
                    this.bindVisable=true;
                }).catch(code=>{
                    this.$message({type: "error", message: code.message || code});
                })
            },
            update(){
                let find=this.tableData.find(row=>{return row.product_id===this.channelSku[0].parant_id});
                find &&(find.goods_id=this.channelSku[0].local[0].good_id);
                find&&find.product_sku.forEach(row=>{
                    let sku=this.channelSku.find(item=>{return item.id===row.vid});
                    sku&&this.$set(row,'skumap',{sku_id:sku.local[0].sku_id,sku_code:sku.local[0].local_sku})
                })
            },
            bind_spu(data){
                if(data.product_sku.length){
                    this.addlistVisable=true;
                    this.channelSku=window.clone(data.product_sku).map((row,row_i)=>{
                       let obj={
                            parant_id:row.product_id,
                            id:row.id,
                            sku:row.sku_code,
                            local:[
                                {local_sku_id:"",good_id:'',sku_id:'',quantity:1,local_sku:''}
                            ]
                        };
                        obj.key=data.used_attr.map((item,index)=>{
                           obj[`color${index}`]=data.listing_attr_val[index][row_i];
                            return {name:item,field:`color${index}`};
                        });
                        return obj;
                    });
                }else {
                    //todo 无sku时
                }
            },
            change_listing_status(val,attr){
                val.forEach(out=>{
                    let find = this.tableData.find( row =>{
                        return row[attr] === out[attr];
                    });
                    if(!!find){
                        find.lock_update = 1;
                    }
                });
            },
            change_group(val){
            	this.selectedIds.forEach(out_row =>{
                    this.tableData.forEach(row=>{
                    	if(out_row.id===row.id){
                            row.lock_update = 1;
                        }
                    });
                });
            },
            change_delivery(val){
                this.change_listing_status(val,"id");
            },
            change_title(val){
                val.forEach(out_row =>{
                    this.tableData.forEach(row=>{
                        if(out_row.product_id===row.id){
                            row.lock_update = 1;
                        }
                    });
                });
            },
            change_unit(val,name){
                val.forEach(out_row =>{
                    this.tableData.forEach(row=>{
                        if(out_row===row.id){
                            row.lock_update = 1;
                        }
                    });
                });
            },
            change_weight(val){
                val.forEach(out_row =>{
                    this.tableData.forEach(row=>{
                        if(out_row.product_id===row.id){
                            row.lock_update = 1;
                        }
                    });
                });
            },
            change_size(val,size){
                val.forEach(out_row =>{
                    this.tableData.forEach(row=>{
                        if(out_row===row.id){
                            row.lock_update = 1;
                        }
                    });
                });
            },
            change_product(val){
                this.change_listing_status(val,"id");
            },
            change_service(val,name){
                val.forEach(out_row =>{
                    this.tableData.forEach(row=>{
                        if(out_row.product_id===row.id){
                            row.lock_update = 1;
                        }
                    });
                });
            },
            change_freight(val,name){
                val.forEach(out_row =>{
                    this.tableData.forEach(row=>{
                        if(out_row.product_id===row.id){
                            row.lock_update = 1;
                        }
                    });
                });
            },
            change_price(val){
                this.change_listing_status(val,"product_id");
            },
            change_price_yet(){
                let checkRows = this.tableData.filter(row => row.isCheck);
                let productIds = checkRows.map(row => row.product_id);
                productIds = productIds.join(',');
                if(productIds.length === 0){
                    return this.$message({type: 'warning', message: '请勾选需要导出的数据'});
                }
                this.$confirm(`将去除勾选的价格变动提醒, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return this.$http(api_get_change_cost_price,{productIds}).then(res=>{
                        this.$message({type:"success", message:res.message||res
                        });
                        return Promise.resolve();
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'})
                    })
                }).catch(() => {
                    this.$message({type: 'info', message: '已取消同步'});
                });
            },

            change_quantity(val){
                this.selectedIds.forEach(out_row =>{
                    this.tableData.forEach(row=>{
                        if(out_row.product_id===row.product_id){
                            row.stock = parseFloat(val) * row.product_sku.length;
                            row.lock_update = 1;
                        }
                    });
                });
            },
            get_wholesale_price(data){
                if(data.is_wholesale===1){
                    return `$ ${data.wholesale_price}`;
                }else {
                    return "不支持";
                }
            },
            sort_click(val){
                this.searchData.order_sort=val.order;
                this.searchData.order_type=val.order_type;
                let curData = JSON.stringify(this.searchData);
                sessionStorage.setItem('aliSearchData',curData);
                this.init();
            },
            get_wholesale(data,item){
                if(data.is_wholesale===1){
                    return `$ ${item.wholesale_price}`;
                }else {
                    return "不支持";
                }
            },
            check_row(){
                this.checkAll=!this.tableData.find(row=>!row.isCheck);
            },
            head_check(val){
                this.tableData.forEach(row=>{
                    row.isCheck=val;
                });
            },
            addClass(index){
                this.tableData.forEach(row=>{
                    row.heighLight=false;
                });
                this.tableData[index].heighLight=true
            },
            show_detail(data){
                data.show =!data.show;
            },
            //初始化
            init(){
                let curObj = sessionStorage.getItem("aliSearchData");
                if(!curObj)return;
                let curData = JSON.parse(curObj);
                this.searchData = clone(curData);
                this.loading=true;
                let data = window.clone(this.searchData);
                if (data.start) {
                    data.start = datef("YYYY-MM-dd",data.start/1000)
                }else {
                    data.start="";
                }
                if (data.end) {
                    data.end = datef("YYYY-MM-dd",data.end/1000)
                }else {
                    data.end="";
                }
                data.snText=data.snText.trim();
                if(data.snType==='title'){
                    data.snText = data.snText.trim();
                }else{
                    let curString = data.snText.replace(new RegExp(' ','gm'),'\n');
                    let cur = curString.split('\n').filter(row=>!!row);
                    if(cur&&cur.length>1){
                        data.snText = cur.map(row=>{
                            return row.trim();
                        }).join(',');
                    }else if(cur&&cur.length===1){
                        data.snText =  data.snText.trim();
                    }
                }
                data.page=this.page;
                data.pageSize=this.pageSize;
                this.$http(api_aliexpress_list,data).then(res=>{
                    res.data.forEach(row=>{
                        row.num="";
                        row.show=false;
                        row.isCheck=false;
                        row.heighLight=false;
                    });
                    this.tableData=res.data;
                    this.baseUrl=res.base_url;
                    this.total=res.count;
                    this.loading=false;
                }).catch(code=>{
                    console.log(code);
                })
            },

            get_ckeckArr(checkList){
                let arr =[];
                checkList.forEach(row=>{
                    arr.push(row.product_id);
                });
                return arr;
            },
            batch_online(checkList){
                let arr = this.get_ckeckArr(checkList);
                let ids = arr.join(";");
                this.$confirm(`您将要对已选Listing执行批量上架, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_aliexpress_batch_online,{productIds:ids}).then(res=>{
                        this.$message({
                            type:"success",
                            message:res.message||res
                        });
                        this.operate_offline(arr,"上架");
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'});
                    }).finally(()=>{
                        setTimeout(()=>{
                            this.$reqKey('clicked_submit',false);
                        },200);
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消上架'
                    });
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('clicked_submit',false);
                    },200);
                });
            },
            operate_offline(arr,status){
                arr.forEach(out_row =>{
                    this.tableData.forEach(row=>{
                        if(out_row===row.product_id){
                            this.$set(row,'product_status_type',status);
                            this.$set(row,'lock_update',1);
                        }
                    });
                });
            },
            batch_offline(checkList){
                let arr = this.get_ckeckArr(checkList);
                let ids=arr.join(";");
                this.$confirm(`您将要对已选Listing执行批量下架, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_aliexpress_batch_offline,{productIds:ids}).then(res=>{
                        this.$message({
                            type:"success",
                            message:res.message||res
                        });
                        this.operate_offline(arr,"下架");
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'});
                    }).finally(()=>{
                        setTimeout(()=>{
                            this.$reqKey('clicked_submit',false);
                        })
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消下架'
                    });
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('clicked_submit',false);
                    })
                });
            },
            rsync(){
                let arr =[];
                this.tableData.forEach(row=>{
                    if( row.isCheck){arr.push(row.product_id);}
                });
                if(arr.length===0){
                    this.$reqKey('clicked_submit',false);
                    this.$message({
                        message: '请选择同步的商品',
                        type: 'warning'
                    });
                    return;
                }
                let ids=arr.join(";");
                this.$confirm(`您将要对已选Listing执行同步, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_aliexpress_rsync,{product_ids:ids}).then(res=>{
                        this.$message({
                            type:"success",
                            message:res.message||res
                        });
                        this.init();
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'})
                    }).finally(()=>{
                        setTimeout(()=>{
                            this.$reqKey('clicked_submit',false);
                        },200);
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消同步'
                    });
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('clicked_submit',false);
                    },200);
                });
            },
            rsync_update(){
                let arr =[];
                this.tableData.forEach(row=>{
                    if( row.isCheck){arr.push(row.product_id);}
                });
                if(arr.length===0){
                    this.$reqKey('clicked_submit',false);
                    this.$message({
                        message: '请选择上传的商品',
                        type: 'warning'
                    });
                    return;
                }
                let ids=arr.join(";");
                this.$confirm(`您将要对已选Listing执行上传, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_aliexpress_rsync_update,{product_ids:ids}).then(res=>{
                        this.$message({
                            type:"success",
                            message:res.message||res
                        });
                        this.init();
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'});
                    }).finally(()=>{
                        setTimeout(()=>{
                            this.$reqKey('clicked_submit',false);
                        },200);
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消上传'
                    });
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('clicked_submit',false);
                    },200);
                });
            },
            clicked(status){//------------------------------------操作不同按钮执行的事件
                let data=this.tableData.filter(row=>row.isCheck);
                if(data.length===0){
                    this.$reqKey('clicked_submit',false);
                    this.$message({message:"请选择要批量修改的数据", type:'error'});
                    return ;
                }
                switch (status){
                    case 1:         //批量上架
                        this.batch_online(data);
                        break;
                    case 2:         //批量下架
                        this.batch_offline(data);
                        break;
                    case 3:         //定时
                        this.$reqKey('clicked_submit',false);
                        break;
                    case 4:         //修改产品分组  flage=9
                        this.$reqKey('clicked_submit',false);
                        let isSame=this.juge_same();
                        if(isSame){
                            this.selectedIds = window.clone(data);
                            this.accountId = data[0].account_id;
                            this.groupVisable=true;
                        }else {
                            this.$message({type:"warning",message:"请选择相同店铺修改"});
                        }
                        break;
                    case 5:         //修改发货期 flage=10
                        this.$reqKey('clicked_submit',false);
                        let isSames=this.juge_same();
                        if(isSames){
                            this.flag=10;
                            this.selectedIds = window.clone(data);
                            this.deliveryVisable=true;
                        }else {
                            this.$message({type:"warning",message:"请选择相同店铺修改"});
                        }
                        break;
                    case 6:         //延长有效期  flage=11
                        this.$reqKey('clicked_submit',false);
                        this.flag=11;
                        this.selectedIds = window.clone(data);
                        this.periodVisable=true;
                        break;
                    case 7:         //同步listing
                        this.rsync();
                        break;
                    case 8:         //上传listing
                        this.rsync_update();
                        break;
                    case 9:
                        let isSet = this.juge_same();
                        if(isSet){
                            let arr=[];
                            this.tableData.forEach(row=>{
                                if(row.isCheck){
                                    arr.push({
                                        id:row.id,
                                        product_id:row.product_id,
                                        account_id:row.account_id
                                    });
                                }
                            });
                            this.$http(api_windows_list,{
                                account_id:arr[0].account_id,// arr的每一个元素的account_id相同
                                left_count:'',
                                page:1,
                                pageSize:50,
                            }).then(res=>{
                            	if(res.data.length === 0){
                                    this.$reqKey('clicked_submit',false);
                            	    this.$message({
                            	        type:"error",
                            	        message:"暂无橱窗推荐数据"
                            	    });
                            	    return false;
                                }
                                if(arr.length>res.data[0].window_count){
                                    this.$reqKey('clicked_submit',false);
                                    this.$message({
                                        type:"error",
                                        message:`请注意：正在使用的橱窗数${res.data[0].used_count},剩余可用橱窗数${res.data[0].window_count - res.data[0].used_count}`
                                    });
                                }else {
                                    this.$confirm(`被设为橱窗推荐的产品，有效期为7个自然日。在此期间不可以取消推荐，您确定继续设置为橱窗推荐吗？`, '橱窗推荐', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消'
                                    }).then(() => {
                                        this.$http(api_set_window_products,{data:arr}).then(res2=>{
                                            this.$message({
                                                type: 'success',
                                                message: res2.message || res2
                                            });
                                        }).catch(code3=>{
                                            this.$message({type: "error", message: code3.message || code3});
                                        }).finally(()=>{
                                            setTimeout(()=>{
                                                this.$reqKey('clicked_submit',false);
                                            },200);
                                        });
                                    }).catch((code2) => {
                                        this.$message({type: "info", message: '已取消'});
                                    }).finally(()=>{
                                        setTimeout(()=>{
                                            this.$reqKey('clicked_submit',false);
                                        },200);
                                    });
                                }
                            }).catch(code=>{
                                this.$message({type: "error", message: code.message || code});
                            }).finally(()=>{
                                setTimeout(()=>{
                                    this.$reqKey('clicked_submit',false);
                                },200);
                            });
                        }else {
                            this.$reqKey('clicked_submit',false);
                            this.$message({type:"warning",message:"请选择相同店铺修改"});
                        }
                        break;
                }
            },
            output_format(){         //导出为小平台格式
                let arr=[];
                let dataList=this.tableData.filter(row=>row.isCheck);
                if(dataList.length===0){
                    this.$reqKey('output_format_submit',false);
                    this.$message({message:"请选择要导出的数据", type:'error'});
                    return ;
                };
                dataList.forEach(row => {arr.push(row.id)});
                let ids=arr.join(';');
                let data = {ids};
                return this.$http(api_aliexpress_output_format,data).then(res=>{
                    let url = config.apiHost+'downloadFile/downExportFile';
                    let data = {
                        file_code:res.file_code,
                    };
                    downloadFile({
                        url:url,
                        get:data,
                        fileName:res.file_name,
                        suffix:'.csv',
                    });
                    return Promise.resolve();
                }).catch(code=>{
                    console.log(code);
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('output_format_submit',false);
                    },200);
                });

            },
            juge_same(){
                let arr=[],flag=true;
                this.tableData.forEach(row=>{
                    if(row.isCheck){
                        arr.push(row.account_id);
                    }
                });
                let temp=arr[0];
                arr.forEach(row=>{
                    if(row!==temp){
                        this.$reqKey('clicked_submit',false);
                        flag=false;
                    }
                });
                return  flag;
            },
            process(option){//--------------操作更多按钮的事件处理
                if(option.status===0){
                    return;
                }
                let data=this.tableData.filter(row=>row.isCheck);
                if(data.length===0){
                    this.$message({message:"请选择要批量修改的数据", type:'error'});
                    return ;
                }
                this.selectedIds = window.clone(data);
                switch (option.status){
                    case 1:  //修改标题
                        this.titleVisable = true;
                        this.type = "subject";
                        break;
                    case 2:  //修改单位
                        this.unitVisable = true;
                        break;
                    case 3:  //修改重量
                        this.weightVisable = true;
                        break;
                    case 4://修改尺寸
                        this.sizeVisable = true;
                        break;
                    case 5://修改产品信息模块
                        if(!this.juge_same()){
                            this.$message({type:"warning",message:"请选择相同店铺修改"});
                            return ;
                        }
                        this.accountId=data[0].account_id;
                        this.productsVisable = true;
                        break;
                    case 6:     //修改服务模板
                        if(!this.juge_same()){
                            this.$message({type:"warning",message:"请选择相同店铺修改"});
                            return ;
                        }
                        this.accountId=data[0].account_id;
                        this.serviceVisable = true;
                        break;
                    case 7:     //修改运费模板
                        if(!this.juge_same()){
                            this.$message({type:"warning",message:"请选择相同店铺修改"});
                            return ;
                        }
                        this.accountId=data[0].account_id;
                        this.freightVisable = true;
                        break;
                    case 8://修改零售价
                        let skus=[];
                        data.forEach(rows=>{
                            skus=skus.concat(rows.product_sku);
                        });
                        this.selectedIds=window.clone(skus);
                        this.priceVisable = true;
                        break;
                    case 12://修改可售数量
                        this.quantityVisable = true;
                        break;
                }
//                this.flag=option.status;
            },
            check(row,num){//---------------------查看按钮
                let operate = operateList.find(function (operate) {
                    return operate.value === num.value
                });
                operate.action.call(this, row,1);
            },
            handleSizeChange(val){
                this.pageSize=val;
                this.init();
            },
            handleCurrentChange(val){
                this.page=val;
                this.init();
            },
            search(data){
                this.firstLoading = false;
            	this.searchData = data;
            	if(data.start instanceof Object){
                    data.start= data.start.getTime();
                }
                if(data.end instanceof Object){
                    data.end= data.end.getTime();
                }
                let curData = JSON.stringify(data);
                sessionStorage.setItem('aliSearchData',curData);
                this.init();
            },
        },
        filters:{
            lockFilter(val){
            	switch(val){
                    case 1:
                        return "待同步";
                        break;
                    case 2:
                        return "更新异常";
                        break;
                    default:
                        return "--";
                    	break;
                }
            }
        },
        props:{
            options:{
                required:true,
                type:Array
            },
        },
        components: {
            uiTable:require("../../../../components/ui-table.vue").default,
            uiTips:require("../../../../components/ui-tip.vue").default,
            trendsSelect:require('../../../../components/trends-select.vue').default,
            searchList:require('./search-list.vue').default,
            actionLog:require("../../wish/list/action-log.vue").default,
            modifyGroup:require('./has-published/modify-group.vue').default,
            modifyDelivery:require('./has-published/modify-delivery.vue').default,
            extendedPeriod:require('./has-published/extended-period.vue').default,
            modifyTitle:require('../../list-operate/modify-title.vue').default,
            modifyUnit:require('./has-published/modify-unit.vue').default,
            modifyWeight:require('./has-published/modify-weight.vue').default,
            modifySize:require('./has-published/modify-size.vue').default,
            modifyProducts:require('./has-published/modify-products.vue').default,
            modifyService:require('./has-published/modify-service.vue').default,
            modifyFreight:require('./has-published/modify-freight.vue').default,
            modifyPrice:require('./has-published/modify-price.vue').default,
            modifyQuantity:require('./has-published/modify-quantity.vue').default,
            bindSpu:require("../../bind-spu.vue").default,
            addGoods:require('../../wish/info/add-goods.vue').default,
            blowupImage:require("../../../../components/blowup-image.vue").default,
            accounts: require("../info/accounts.vue").default,
        }
    }
</script>
