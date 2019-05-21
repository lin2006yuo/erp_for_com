<template>
    <div class="c-data-table">
        <el-row class="shipment-data-table mt-xs">
            <!-- 表格 -->
            <el-col :span="24">
                <ui-table
                    v-loading="loading"  element-loading-text="玩命加载中..." :body-height="40" :first-loading="firstLoading"
                    :has-data="shopeeList&&shopeeList.length>0"
                    :heads="[
                                {label:'图片',width:10},
                                {label:'本地SPU',width:10},
                                {label:'产品中文名称',width:25},
                                {label:'产品英文名称',width:25},
                                {label:'发货仓库',width:9},
                                {label:'本地分类',width:8},
                                {label:'创建时间',width:8},
                                {label:'操作',width:5},
                            ]">
                    <tbody>
                    <tr v-for="(row, index) in shopeeList" :key="`${row.goods_id}-${index}`">
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
                        <td class="relative">
                            <span class="copyright" title="侵权提示" v-if="!!row.tort_flag" @click="get_RightRocord(row)">侵权</span>
                            <span :class="copyright(row)" title="侵权提示" v-if="!!row.is_discounting" @click="discount(row)">跌价</span>
                            <ui-tip :content="row.spu"></ui-tip></td>
                        <td><ui-tip :content="row.name" ></ui-tip></td>
                        <td><ui-tip :content="row.packing_en_name" ></ui-tip></td>
                        <td><ui-tip :content="get_warehouse(row.warehouse_id)"></ui-tip></td>
                        <td><ui-tip :content="row.category" ></ui-tip></td>
                        <td><times :time="row.publish_time"></times></td>
                        <td>
                            <el-button size="mini" @click="publish(row)" type="primary" >刊登</el-button>
                        </td>
                    </tr>
                    </tbody>
                </ui-table>
            </el-col>
        </el-row>
        <fanseright-dialog v-model="copyrightShow"
                           :look-tip="false"
                           :spu-name="spuName"
                           :tableData="tableData"></fanseright-dialog>
        <subsidy-diaog
            v-model="subDiaog"
            :title="title"
            :datavalue="datavalue"
        ></subsidy-diaog>
    </div>
</template>
<style lang="stylus" scoped>
    .copyright{
        position absolute;
        left 0;
        top:0;
        width: 30px;
        color red;
        height: 16px;
        cursor: pointer;
        line-height: 16px;
        display: inline-block;
        vertical-align: middle;
        border:1px solid red;
    }
    .top{
        top:18px;
        border: 1px solid #660033;
        color:#660033;
    }
    .notop{
        top:0px
    }
</style>
<script>
    import {api_get_goods_description,api_get_discount} from '@/api/product-library';
	export default{
		data(){
			return {
                spuName:'',
                copyrightShow:false,
                tableData:[],
                showedit:false,
                goodsId:0,
                spu:'',
                editAble:false,
                subDiaog:false,
                title:'',
                datavalue:[],
            }
		},
        methods:{
		    /*获取侵权记录*/
            get_RightRocord(data){
                this.spuName=data.spu
                this.$http(api_get_goods_description, data.id, {page: 1, page_size: 50})
                    .then(res => {
                        this.copyrightShow=true;
                        this.tableData=res.list;
                    }).catch(err => {
                    console.log(err + '出错了');
                })
            },
            discount(data){
                this.$http(api_get_discount,{goods_id:data.goods_id}).then(res=>{
                    this.title=`${data.spu}补贴信息`;
                    this.datavalue=res.data.map(row=>{
                        let discount_price='',discount_scale='';
                        if(row.discount_type===1){
                            discount_price=row.discount_value
                        }
                        if(row.discount_type===2){
                            discount_scale=row.discount_value;
                        }
                        return{
                            sku:row.sku,
                            inventory_price:row.inventory_price,
                            last_purchase_price:row.last_purchase_price,
                            new_price:row.new_price,
                            discount_price,
                            discount_scale,
                            discount:row.discount_num+'/'+row.sell_num,
                            valid_time:this.dateFilter(new Date(row.valid_time).getTime()/1000)+'-'+this.dateFilter(new Date(row.over_time).getTime()/1000),
                            warehouse:row.warehouse,
                            status:row.status,
                            status_text:row.status_text,
                            remark:row.remark,
                        }
                    })
                    this.subDiaog=true;
                })
            },
            copyright(row){
                if(!!row.tort_flag){
                    return 'copyright top'
                }else{
                    return 'copyright top notop'
                }
            },
            dateFilter(val){
                return datef('YYYY-MM-dd', val);
            },
            large_img(image){
                this.imgPath = image.replace('_60x60.','_500x500.');
                this.imgDialog = true;
            },
            middle_img(image){
                return image.replace('_60x60.','_200x200.');
            },
            publish(row){
                let params = {
                    goods_id: row.goods_id,
                    account_id:this.searchData.account_id,
                    curPage: 'not',//尚未编辑刊登
                    spu:row.spu,
                    id:row.id,
                };
                this.$open(`/shopee/info-detail?id=${params.curPage}${params.goods_id}`, params);
            },
            get_warehouse(id){
                let find = this.warehouseList.find(row=>row.id===id);
                return find?find.name:'暂无对应仓库'
            }
        },
        props:{
            loading:{
                type:Boolean,
            },
            shopeeList:{
                required:true,
            	type:Array
            },
            firstLoading:{
                type: Boolean,
            },
            searchData:{
                type: Object,
            },
            warehouseList:{
                type: Array,
                required:true
            }
        },
		components: {
            lookEdit:require('./look-edit.vue').default,
            uiTip: require("../../../../components/ui-tip.vue").default,
            uiTable:require('../../../../components/ui-table.vue').default,
            fanserightDialog:require("../../ebay/kandeng-list/not-yet/fanseright-dialog").default,
            subsidyDiaog:require("@/view/kandeng/ymx/subsidy-diaog.vue").default,
        }
	}
</script>
