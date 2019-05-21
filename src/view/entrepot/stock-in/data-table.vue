<template>
    <div class="c-data-table">
        <ui-table  v-loading="isLoading" element-loading-text="玩命加载中..." :has-data="dataTable.list.length>0" :body-height="41" v-model="checkAll" @check="check_all"
            :heads="[
                {isCheck:true,width:2},
                {label:'入库单号',width:14},
                {label:'来源单号',width:14},
                {label:'入库类型',width:8},
                {label:'仓库',width:8},
                {label:'创建人',width:6},
                {label:'状态',width:6},
                {label:'审核人',width:6},
                {label:'创建时间',width:11},
                {label:'更新时间',width:11},
                {label:'操作',width:10},
            ]"
        >
            <tbody>
                <template v-for="(data,index) in dataTable.list">
                    <tr :class="[clickData[index]?'active-color':'']" @click="addClass(index)">
                        <!--isCheck-->
                        <td>
                            <el-checkbox v-model="data.isCheck" @change="check_box"></el-checkbox>
                        </td>
                        <!--入库单号-->
                        <td class="t-left" v-copy>
                            <plus-minus @show-detail="show_detail(data)" :show="data.show" :title="tipTitle"></plus-minus>
                            {{data.code}}
                        </td>
                        <!--来源单号-->
                        <td v-copy>{{data.original_code}}</td>
                        <!--入库类型-->
                        <td>{{data.type}}</td>
                        <!--仓库-->
                        <td>{{data.warehouse}}</td>
                        <!--创建人-->
                        <td>{{data.creator}}</td>
                        <!--状态-->
                        <td>{{data.status | filterStatus}}</td>
                        <!--审核人-->
                        <td>{{data.auditor}}</td>
                        <!--创建时间-->
                        <td>{{data.create_time | filterTime}}</td>
                        <!--更新时间-->
                        <td>{{data.update_time | filterTime}}</td>
                        <!--操作-->
                        <td>
                            <permission tag="span"
                                        v-if="data.status == 1"
                                        class="operate"
                                        @click="do_stock_in(data)"
                                        :route="apis.url_do_stock_in">入库</permission>
                            <permission tag="span"
                                        v-if="data.status == 1"
                                        :route="apis.url_do_stock_in">|</permission>
                            <permission tag="span"
                                        v-if="data.status == 0"
                                        class="operate"
                                        @click="audit(data)"
                                        :route="apis.url_post_stock_in_audit">审核</permission>
                            <permission tag="span"
                                        v-if="data.status == 0"
                                        :route="apis.url_post_stock_in_audit">|</permission>
                            <permission tag="span"
                                        v-if="data.status == 0"
                                        class="operate"
                                        @click="cur_delete(data)"
                                        :route="apis.url_del">删除</permission>
                            <permission tag="span"
                                        v-if="data.status == 0"
                                        :route="apis.url_del">|</permission>
                            <permission tag="span"
                                        class="operate"
                                        @click="look_over(data)"
                                        :route="apis.url_stock_lookup">查看</permission>
                        </td>
                    </tr>
                    <template v-if="data.show">
                        <tr style="font-weight:bold">
                           <td :rowspan="data.details.length+1"></td>
                           <td>SKU</td>
                           <td colspan="2">商品名称</td>
                           <td>入库数量</td>
                           <td>实际入库数量</td>
                           <td>单价</td>
                           <td colspan="4">备注</td>
                        </tr>
                        <tr v-if="data.details.length > 0" v-for="good in data.details">
                            <!--SKU-->
                            <td v-copy>{{good.sku}}</td>
                            <!--商品名称-->
                            <td colspan="2">{{good.goodsName}}</td>
                            <!--入库数量-->
                            <td>{{good.quantity}}</td>
                            <!--实际入库数量-->
                            <td>{{good.actual_quantity}}</td>
                            <!--单价-->
                            <td>{{good.price | filterPrice}}</td>
                            <!--备注-->
                            <td colspan="4">{{good.remark}}</td>
                        </tr>
                        <tr v-else>
                            <td colspan="10">居然没有明细</td>
                        </tr>
                    </template>
                </template>
            </tbody>
        </ui-table>
        <el-pagination
                class="page-fixed"
                @size-change="size_change"
                @current-change="current_change"
                :current-page="dataTable.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="dataTable.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="dataTable.total">
        </el-pagination>
    </div>
</template>
<style lang="stylus">

</style>
<script>
import {url_stock_lookup,url_do_stock_in,url_del,url_post_stock_in_audit} from "@/api/stock-in"
    export default{
        permission: {
            url_stock_lookup,url_del,url_do_stock_in,url_post_stock_in_audit
        },
        data(){
            return{
                clickData:[],
                checkAll:false,
                tipTitle:"点击可查看 平台SKU，SKU，商品名称，ItemID，数量，出售价 等信息",
            }
        },
        created(){
            this.clickData.push(false);
        },
        filters:{
            filterTime(val){
                return val?datef("YYYY-MM-dd HH:mm:ss",val):"-- --";
            },
            filterPrice(val){
                if(val) return parseFloat(val).toFixed(2);
            },
            filterStatus(val){
                switch (val){//0 草稿，1 已审 ，2 ，已入库，3，部份入库
                    case 1:
                        return "已审";
                    case 2:
                        return "已入库";
                    case 3:
                        return "部份出库";
                    case 0:
                        return "草稿";
                }
            },
            type(val){
                switch (val){
                    case 11:
                        return '采购入库';
                    case 12:
                        return '调拨入库';
                    case 13:
                        return '盘盈入库';
                    case 14:
                        return '销售退款入库';
                    case 15:
                        return '退回入库';
                    case 16:
                        return '期初入库';
                    default:
                        return '未定义';
                }
            }
        },
        methods:{
//        	  -------------------------------------------------------  审核
            audit(val){
                this.$emit("look-over",val,true);
            },
//            -------------------------------------------------------  入库
            do_stock_in(val){
                this.$emit("stock-in",val);
            },
//            -------------------------------------------------------  查看
            look_over(val){
                this.$emit("look-over",val,false);
            },
//            -------------------------------------------------------  删除
            cur_delete(data){
                this.$emit("cur-delete", data);
            },
//            -------------------------------------------------------  修改
            mdf(){
                this.$emit("mdf");
            },
//            -------------------------------------------------------  全选
            check_all(val){
                this.dataTable.list.forEach(row=>{
                    row.isCheck = val;
                })
            },
//            -------------------------------------------------------  多选
            check_box(){
                let cur = this.dataTable.list;
                if(cur.length>0){
                    let isCheckAll = !cur.find(row=>!row.isCheck);
                    this.checkAll = isCheckAll;
                }

            },
//            -------------------------------------------------------  添加class
            addClass(index){
                this.clickData=this.clickData.map(()=>{
                    return  false
                })
                this.clickData[index]=true
            },
//            -------------------------------------------------------  是否有详情
            show_detail(data){
                data.show = !data.show;
            },
//            -------------------------------------------------------  分页
            size_change(size){
                this.checkAll = false;
                this.$emit("size-change",size);
            },
            current_change(page){
                this.checkAll = false;
                this.$emit("current-change",page);
            },
        },
        watch:{

        },
        props:{
            dataTable:{
                type:Object,
                required:true
            },
            isLoading:{
                type:Boolean,
                required:true
            },
        },
        components:{
            uiTable:require('@/components/ui-table.vue').default,
            plusMinus:require('@/components/plus-minus').default,
        }
    }
</script>
