<template>
    <div class="c-table-data">
        <ui-table
            v-loading="loading" :first-loading="firstLoading"
            element-loading-text="玩命加载中..."
            :has-data="tableData.length>0"
            v-model="checkAll"
            :body-height="65"
            @check="head_check"
            @sort-click="sort_click"
            :heads="[
                        {isCheck:true,width:2},
                        {label:'主图',size:75},
                        {label:'平台产品ID',width:8},
                        {label:'平台SPU',width:6},
                        {label:'本地SPU',width:6},
                        {label:'刊登标题',width:12},
                        {label:'平台账号',width:6},
                        {label:'平台店铺',width:6},
                        {label:'销售员',width:6},
                        {label:'审核状态',width:5},
                        {label:'已收藏',width:5},
                        {label:'已售量',width:6,isSort:true,order_type:'order_sold_quantity'},
                        {label:'修改状态',width:5},
                        {label:'更新时间',width:8,isSort:true,order_type:'order_start_date'},
                        {label:'上传时间',width:8,isSort:true,order_type:'order_start_date'},
                        {label:'操作',size:120}
                       ]">
            <tbody>

            <!--<template v-for="(data, index) in tableData">-->
                <!--<tr :class="[data.show ? 'active' : '',data.heighLight?'active-color':'',data.listing_status===5?'redborder':'']" @click="addClass(index)"-->
                    <!--:key="data.id">-->
                    <!--<td><el-checkbox v-model="data.isCheck" @change="check_row"></el-checkbox></td>-->
                    <!--<td>-->
                        <!--<el-popover placement="right" trigger="hover">-->
                            <!--<img v-lazy="data.img"-->
                                 <!--@click="search_img(data.img)"-->
                                 <!--width="200px" height="200px">-->
                            <!--<span slot="reference">-->
                                  <!--<img v-lazy="data.img"-->
                                       <!--@click="search_img(data.img)"-->
                                       <!--height="60px" width="60px" style="border:none">-->
                            <!--</span>-->
                        <!--</el-popover>-->
                    <!--</td>-->
                    <!--<td>-->
                        <!--<i @click="show_detail(data)" v-if="data.variation" :class="[data.show? 'minus':'plus','fl']"></i>-->
                        <!--<i class="plus" style="background: none" v-else></i>-->
                        <!--<ui-tip :content="data.item_id"></ui-tip>-->
                    <!--</td>-->
                    <!--<td style="position: relative">-->
                         <!--<span @click="bind_spu(data)" class="operate" v-if="data.goods_id===0">-->
                             <!--<i class="el-icon-information" style="position: absolute;top:9px;left: 5px" title="点击关联"></i>-->
                            <!--<ui-tip :content="data.spu||'未关联'" style="padding-left: 12px"></ui-tip>-->
                        <!--</span>-->
                        <!--<ui-tip :content="data.spu" v-else></ui-tip>-->
                    <!--</td>-->
                    <!--<td><ui-tip :content="data.title" :width="88"></ui-tip></td>-->
                    <!--<td><ui-tip :content="data.account_code" :width="80"></ui-tip></td>-->
                    <!--<td>{{filterSite(data.site)}}</td>-->
                    <!--<td>{{data.listing_type | way}}</td>-->
                    <!--<td v-if="data.variation">{{data.symbol}} {{data.rval_price}}</td>-->
                    <!--<td v-if="(!data.variation)&&data.listing_type===1">{{data.symbol}} {{data.start_price}}</td>-->
                    <!--<td v-if="(!data.variation)&&data.listing_type!==1">{{data.symbol}} {{data.start_price}}/{{data.reserve_price}}/{{data.buy_it_nowprice}}</td>-->
                    <!--<td>{{data.symbol}} {{data.insertion_fee}}</td>-->
                    <!--<td>{{data.listing_duration | filterDay}}</td>-->
                    <!--<td><ui-tip :content='data.sold_quantity'></ui-tip></td>-->
                    <!--<td>{{data.hit_count}}</td>-->
                    <!--<td>{{data.watch_count}}</td>-->
                    <!--<td><times :time="data.start_date"></times></td>-->
                    <!--<td><times :time="data.end_date"></times></td>-->
                    <!--<td>{{data.listing_status |filterStatus}}</td>-->
                    <!--<td><ui-tip :content='data.listing_cate'></ui-tip></td>-->
                    <!--<td>-->
                        <!--&lt;!&ndash;<trends-select  class="inline" @trigger="operate(data,$event)" :selects="operatesList" type="primary"></trends-select>&ndash;&gt;-->
                    <!--</td>-->
                <!--</tr>-->
                <!--<template v-if="data.show&&data.varians&&data.varians.length">-->
                    <!--<tr style="font-weight:bold" >-->
                        <!--<td colspan="2" :rowspan="`${(data.varians&&data.varians.length)+1}`"></td>-->
                        <!--<td>产品图片</td>-->
                        <!--<td colspan="2">平台SKU</td>-->
                        <!--<td colspan="2">本地SKU</td>-->
                        <!--<template v-for="tm1 in data.v_varkey" v-if="data.v_varkey">-->
                            <!--<td>{{tm1}}</td>-->
                        <!--</template>-->
                        <!--<td>价格</td>-->
                        <!--<td>可售量</td>-->
                        <!--<td>本地状态</td>-->
                        <!--<td v-if="data.v_varkey" :colspan="`${9-(data.v_varkey&&data.v_varkey.length)}`" :rowspan="`${(data.varians&&data.varians.length)+1}`"></td>-->
                        <!--<td :colspan="9" :rowspan="`${(data.varians&&data.varians.length)+1}`" v-else></td>-->
                    <!--</tr>-->
                    <!--<tr v-for="(item,item_i) in data.varians" :key="item_i" v-if="data.varians">-->
                        <!--<td>-->
                            <!--<el-popover placement="right" trigger="hover">-->
                                <!--<img v-lazy="sku_image(item.path)"-->
                                     <!--@click="search_sku_img(item.path)"-->
                                     <!--width="200px" height="200px">-->
                                <!--<span slot="reference">-->
                                  <!--<img v-lazy="sku_image(item.path)"-->
                                       <!--@click="search_sku_img(item.path)"-->
                                       <!--height="60px" width="60px" style="border:none">-->
                                <!--</span>-->
                            <!--</el-popover>-->
                        <!--</td>-->
                        <!--<td colspan="2"><ui-tip :content="item.channel_map_code" :width="98"></ui-tip></td>-->
                        <!--<td colspan="2"><ui-tip :content="item.v_sku" :width="98"></ui-tip></td>-->
                        <!--<template v-for="(tm2,km2) in data.v_varkey">-->
                            <!--<td><ui-tip :content="item.variation[tm2]" :width="98"></ui-tip></td>-->
                        <!--</template>-->
                        <!--<td>{{data.symbol}} {{item.v_price}}</td>-->
                        <!--<td>{{item.v_qty || 0}}</td>-->
                        <!--<td>{{item.status | filterSalesStatus}}</td>-->
                    <!--</tr>-->
                <!--</template>-->
            <!--</template>-->
            </tbody>
        </ui-table>
    </div>
</template>
<style lang="stylus">

</style>
<script>

	export default{
		data(){
			return {
                tableData:[],
                checkAll:false,
            }
		},
        methods:{
            sort_click(){},
            head_check(){},
        },
        props:{
			loading:{},
            firstLoading:{},
        },
		components: {
            uiTable:require('../../../../components/ui-table.vue').default,
        }
	}
</script>
