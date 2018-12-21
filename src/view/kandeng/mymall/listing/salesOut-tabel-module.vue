<template>
    <div class="p-saleOut-tabel">
        <div class="mt-xs mb-xs ml-sm">
            <el-button class="inline mb-mini" size="mini" type="primary"
                       v-for="(item,index) in btnslist" :key="index"  :disabled="!is_batch"
                       @click.native='clicked(item.status)'>{{item.name}}</el-button>
        </div>
        <ui-table
                v-loading="loading" :first-loading="firstLoading"
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
                            {label:'平台SPU',width:10},
                            {label:'本地SPU',width:10},
                            {label:'刊登标题',width:11},
                            {label:'账号简称',width:6},
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
                    <td>
                        <div style="position: relative">
                            <!--<span v-if="!data.local_parent_sku" @click="bind_sku(data, index)" class="operate">-->
                            <!--<i class="el-icon-information" style="position: absolute;top:5px;left: 20px" title="点击关联"></i>-->
                            <!--<ui-tip content="未关联" style="padding-left: 12px"></ui-tip>-->
                            <!--</span>--
                            <!--<ui-tip v-else :content="data.local_parent_sku"></ui-tip>-->
                            <ui-tip  :content="data.spu"></ui-tip>
                        </div>
                    </td>
                    <td>
                        <ui-tip :is-operate="true" :content="data.name" :width="90"
                                @cur-click="cur_click(data)"></ui-tip>
                    </td>
                    <td><ui-tip :content="data.account&&data.account.code" :width="80"></ui-tip></td>
                    <td><ui-tip :content="data.user&&data.user.realname" :width="80"></ui-tip></td>
                    <td><ui-tip :content="data.review_status" :width="80"></ui-tip></td>
                    <td><ui-tip :content="data.number_saves" :width="80"></ui-tip></td>
                    <td><ui-tip :content="data.number_sold" :width="80"></ui-tip></td>
                    <td><ui-tip :content="data.lock_update" :width="80"></ui-tip></td>
                    <td><ui-tip :content="data.date_uploaded" :width="80"></ui-tip></td>
                    <td><times :time="data.update_time"></times></td>
                    <td>
                        <trends-select  class="inline"
                                        @trigger="operate(data,$event)"
                                        :selects="operatesList"
                                        type="primary"></trends-select>
                    </td>
                </tr>
                <template v-if="data.show">
                    <tr style="font-weight:bold" :key="index" class="variant">
                        <td colspan="2" :rowspan="`${(data.variants.length)+1}`"></td>
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
                    </tr>
                    <tr v-for="(item, item_i) in data.variants" :key="item_i" class="variant">
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
                        <td colspan="2">
                            <span v-if="item.sku_id === ''" style="color: red">未关联</span>
                            <ui-tip v-else :content="item.sku_id" :width="98"></ui-tip>
                        </td>
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
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
        <action-log v-model="logVisable" :product-id="productId" type="mymall"></action-log>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_record_logs,url_record_logs,url_record_Synchronize,api_record_Synchronize,url_record_up,api_record_up,} from '@/api/mymall'
    import {api_edit_publish,url_edit_publish} from '@/api/publish-mymall-info'
    import {get_path} from '../../ebay/kandeng-list/add-edit-listing/get-path';
    export default {
        permission: {
            url_record_Synchronize,
            url_record_up,
            url_record_logs,
            url_edit_publish
        },
        data(){
            return{
                productId:'',
                logVisable:false,
                imgPath:'',
                imgDialog:false,
                btnList:[//----------------------------------------------操作按钮
                    // {name:'同步Listing',clickName:'',status:1,api:url_record_Synchronize},
                    {name:'批量上架',clickName:'',status:2,api:url_record_up},
                ],

                operates:[   {name:"编辑",api:url_edit_publish,action:function (row,action) {
                        this.$http(api_edit_publish, {id: row.id, status: "status"}).then(res => {
                            let params = {
                                goods_id: row.goods_id,
                                isEdit: true,
                                item: res,
                            };
                            this.$open(`/publish/mymall/getdata`, params)
                        });
                    }},
                    {name:"操作日志",api:url_record_logs,action:function (row,action) {
                            this.$http(api_record_logs, {product_id: row.product_id}).then(res => {
                                this.logVisable = true;
                                this.productId = row.product_id;
                            }).catch(code => {
                                this.$message({type: "error", code: code.message || code})
                            });
                        }}],
                checkAll:false
            }
        },
        methods:{
            get_path,
            operate(data,action){
                action.action.call(this,data,action)
            },
            // 单行选择
            check_row(){
                this.checkAll=!this.tableData.find(row=>!row.isCheck);
            },
            head_check(val){
                this.$emit('head-check',val)
            },
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
            // 排序
            sort_click(val){
                this.$emit('sort-click', val)
            },
            addClass(index){
                this.tableData.forEach(row=>{
                    row.heighLight=false;
                });
                this.tableData[index].heighLight=true
            },
            //获取sku
            show_detail(data){
                data.show =!data.show;
                // data.show&&this.operate_data_id(data,"id");
                // if(data.show){
                //     this.get_variations(data);
                // }
            },
            //获取子商品
            // get_variations(data){
            //     data.variants = [];
            //     this.$http('',{joom_product_id: data.id,}).then(res=>{
            //         data.variants = res;
            //     }).catch(code=>{
            //         this.$message({message:code.message||code,type:'error'})
            //     });
            // },
            // 捆绑 sku
            async bind_sku(data, index){
                this.index = index;
                this.tableData_item = data;
                let res = await this.$http(api_joom_list_variant,{joom_product_id: data.id,});
                this.channelSku = res.map(row=>{
                    return {
                        key:[{name:'颜色',field:'color'},{name:'尺寸',field:'size'}],
                        parant_id:row.product_id,
                        id:row.id,
                        sku:row.sku,
                        size:row.size,
                        color:row.color,
                        local:[
                            {local_sku_id:"",good_id:'',sku_id:'',quantity:1,local_sku:''}
                        ]
                    }
                });
                this.addGoodsVisible = true;
            },
            cur_click(row){ //连接跳转
                window.open("https://pandao.ru/product/"+row.product_id);
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
            clicked(status){//------------------------------------操作不同按钮执行的事件
                let data=this.tableData.filter(row=>row.isCheck);
                if(data.length===0){
                    this.$message({message:"请选择要批量修改的数据", type:'warning'});
                    return ;
                }
                this.selectedIds = window.clone(data);
                switch (status){
                    case 1:         //同步Listing
                        this.rsync(data);
                        break;
                    case 2:         //批量下架
                        this.batch_off(data);
                        break;
                    default:
                        break;
                }
            },
            //同步Listing
            rsync(data){
                let obj = {
                    ids:data.map(row=>row.id).join(","),
                };
                this.$confirm(`您将要对已选Listing执行同步, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return this.$http(api_record_Synchronize,obj).then(res=>{
                        this.$message({
                            type:"success",
                            message:res.message||res
                        });
                        return Promise.resolve();
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'})
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消同步'
                    });
                });
            },
            //批量上架
            batch_off(data){
                let obj = {
                    ids:data.map(row=>row.id).join(","),
                };
                this.$confirm(`您将要对已选Listing执行批量上架, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.operate_offline_data(data,obj);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消上架'
                    });
                });
            },
            //操作数据
            operate_offline_data(datas,obj){
                this.$http(api_record_up,obj).then(res=>{
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
                            this.$parent.total-=1;
                        })
                    } else if(datas instanceof Object){
                        let i = this.tableData.indexOfFun(old => {
                            return old.id===datas.id;
                        });
                        this.tableData.splice(i,1);
                        this.$parent.total-=1;
                    }
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                });
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
                return this.operates.filter(row=>{
                    return this.$hasPermission(row.api);
                })
            },
            is_batch(){
                return !!this.tableData.find(row=>row.isCheck);
            }
        },
        props:{
            firstLoading:{
                type: Boolean,
            },
            // checkAll:{
            //     type: Boolean,
            // },
            tableData:{
                type: Array,
            },
            loading:{
                type: Boolean,
            },
        },
        components:{
            blowupImage:require("../../../../components/blowup-image.vue").default,
            uiTable:require('../../../../components/ui-table.vue').default,
            uiTip:require('../../../../components/ui-tip.vue').default,
            trendsSelect:require('@/components/trends-select').default,
            actionLog:require('../../wish/list/action-log').default
        }
    }
</script>


