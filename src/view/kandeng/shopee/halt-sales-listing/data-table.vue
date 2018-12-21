<template>
    <div class="c-data-table">
        <ui-table
            v-loading="loading"
            element-loading-text="玩命加载中..."
            :has-data="tableData.length>0"
            :body-height="41"
            :first-loading="firstLoading"
            @check="head_check"
            :heads="[
                {isCheck:true,width:2},
                {label:'主图',size:75},
                {label:'商品ID',width:10},
                {label:'平台SPU',width:10},
                {label:'本地SPU',width:10},
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
                    <td><ui-tip :content="data.spu"></ui-tip></td>
                    <td><ui-tip :content="data.name" :width="74"></ui-tip></td>
                    <td><ui-tip v-if='data.account' :content="data.account.code" :width="80"></ui-tip></td>
                    <td><ui-tip :content="data.seller_name" :width="80"></ui-tip></td>
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
                        <td>销售价[RM]</td>
                        <td>可售量</td>
                        <td colspan="2">本地状态</td>
                        <td :colspan="`${6-data.variants.length}`" :rowspan="`${data.variants.length+1}`"></td>
                    </tr>
                    <tr v-for="(item, item_i) in data.variants" :key="item_i" class="variant">
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
        <action-log v-model="logVisable" :product-id="productId" type="mymall"></action-log>
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {get_path} from '../../ebay/kandeng-list/add-edit-listing/get-path';
    import  {api_shopee_publish,url_shopee_publish,} from "../../../../api/shopee-publish"
    export default{
        permission: {url_shopee_publish,},
        data(){
            return {
                checkAll:false,
                logVisable:false,
                productId:'',
                operates:[
                    {name:"编辑",api:url_shopee_publish,action:function (row,action) {
                        this.$http(api_shopee_publish, {id: row.id, status: "status"}).then(res => {
                            let params = {
                                goods_id: row.goods_id,
                                isEdit: true,
                                curPage:'haltSale',
                                id:row.id,
                                item: res,
                            };
                            this.$open(`/shopee/info-detail?id=${params.curPage}${params.goods_id}`, params)
                        });
                    }},
                    {name:"操作日志",api:url_shopee_publish,action:function (row,action) {
                        this.$http(api_shopee_publish, {product_id: row.product_id}).then(res => {
                            this.logVisable = true;
                            this.productId = row.product_id;
                        }).catch(code => {
                            this.$message({type: "error", code: code.message || code})
                        });
                    }},
                ],
                title:'',
                selectedIds:[],
                thecode:'',
                imgDialog:false,
                imgPath:'',
            }
        },
        methods:{
            operate(data,action){
                action.action.call(this,data,action)
            },
            //获取sku
            show_detail(data){
                data.show =!data.show;
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
                if(image.includes('http')){
                    if(size===500){
                        return image;
                    }
                }
                return this.get_path(image,`_${size}x${size}.`, base_url||this.baseUrl);
            },
        },
        computed:{
            operatesList(){
                return this.operates.filter(row=>{
                    return this.$hasPermission(row.api);
                })
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
            trendsSelect:require('@/components/trends-select.vue').default,
            uiTip:require('../../../../components/ui-tip.vue').default,
            actionLog:require('../../wish/list/action-log.vue').default,
            blowupImage:require("@/components/blowup-image.vue").default,
        }
    }
</script>
