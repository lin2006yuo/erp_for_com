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
                        <td><ui-tip :content="row.spu"></ui-tip></td>
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
    </div>
</template>
<style lang="stylus">

</style>
<script>

	export default{
		data(){
			return {
                showedit:false,
                goodsId:0,
                spu:'',
                editAble:false,
                title:'',
            }
		},
        methods:{
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
        }
	}
</script>
