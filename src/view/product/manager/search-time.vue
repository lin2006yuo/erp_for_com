<template>
    <div class="product-search">
        <search-card @search="submit" :params="searchData" :clears="clears">
            <label-buttons label="产品状态：" @select="change_status" :buttons="saleStatus"></label-buttons>
            <el-select v-sf.snType
                       v-model="searchData.snType"
                       placeholder="模糊搜索"
                       class="inline snType s-width-default">
                <el-option v-for="item in form.selectListP"
                           :key="item.value"
                           :value="item.value"
                           :label="item.label"></el-option>
            </el-select>
            <template>
                <el-input v-sf.snText v-if='searchData.snType!=="sku"&&searchData.snType!=="spu"'
                          v-model="searchData.snText"
                          :placeholder="`请输入${changeLabel}...`"
                          class="inline width-super"></el-input>
                <order-input v-model="searchData.snText"
                             class="inline width-super"
                             v-else
                             v-sf.batchText
                             @keydown="submit"
                             placeholder="可批量搜索，Shift+回车换行..."></order-input>
            </template>
            <label-item class="ml-sm" label="供应商：">
                <supplier class="inline s-width-default"
                          v-sf.supplier_id
                          :placeHolder="true"
                          v-model="searchData.supplier_id"></supplier>
            </label-item>
            <label-item class="ml-sm" label="采购员：">
                <purchaser  class="inline s-width-default"
                            v-sf.purchaser_id
                           v-model="searchData.purchaser_id"
                           default-first-option>
                </purchaser>
            </label-item>
            <label-item class="ml-sm" label="开发员：">
                <param-account
                        class="s-width-default"
                        ref="paramDevelopment"
                        v-model="searchData.developer_id"
                        v-sf.developer_id
                        :fixResult="development_fix_result"
                        type="memberShipSales"
                        placeholder="请选择/输入..."
                        url="get|user/development/staffs">
                </param-account>
            </label-item>
            <label-item class='ml-sm' label="是否查无图：">
                <el-select v-model="searchData.without_img"
                           class="inline s-width-small"
                           filterable>
                    <el-option
                        v-for="res in withoutList"
                        :label="res.label"
                        :value="res.value"
                        :key="res.value"
                    ></el-option>
                </el-select>
            </label-item>
            <el-select v-sf.dateType v-model="searchData.dateType" class="inline s-width-small ml-sm">
                <el-option value="sellTime" label="出售时间"></el-option>
                <el-option value="stopTime" label="停售时间"></el-option>
            </el-select>
            <el-date-picker type="date" placeholder="开始时间" v-sf.date_start v-model="searchData.date_start"
                            :picker-options="pickerstart"
                            class="inline date"></el-date-picker>
            &nbsp;&nbsp;--&nbsp;
            <el-date-picker type="date" placeholder="结束时间" v-sf.date_end v-model="searchData.date_end"
                            :picker-options="pickerend"
                            class="inline date mr-sm"></el-date-picker>
    </search-card>
    </div>
</template>
<style lang="stylus">
    .product-search{
        .el-card{
            overflow: inherit;
        }
    }
    /*.c-search-time {

        .snType {
            width: 145px;
        }
        .dates {
            width: 100px;
        }
        .search {
            margin-bottom: 8px;
        }
    }*/
</style>
<script>
    import labelButtons  from '../../../components/label-buttons.vue'
    export default{
        data(){
            return {
                withoutList:[
                    {label:"查所有",value:0},
                    {label:"查无图",value:1},
                ],
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.searchData.date_end){
                            return  time.getTime() > this.searchData.date_end
                        }else {
                            return false
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.searchData.date_start){
                            return time.getTime() < this.searchData.date_start
                        }else {
                            return false
                        }
                    }
                },
                saleStatus: [
                    {name: "全部商品", value: 0},
                    {name: "在售", value: 1},
                    {name: "停售", value: 2},
                    {name: "待发布", value: 3},
                    {name: "卖完下架", value: 4},
                    {name: "缺货", value: 5},
                    {name: "部份在售", value: 6},
                ],
//                params:{
//                    snType:"sku",
//                    supplier_id:'',
//                    purchaser_id:'',
//                    developer_id:'',
//                    snText:"",
//                    category_id:'',
//                    dateType:"sellTime",
//                    date_start:"",
//                    date_end:"",
//                    without_img:0,
//                },
                clears:{
                    without_img:0,
                    snType:"sku",
                    dateType:"sellTime",
                },
                form: {
                    selectListP: [
                        {label: "商品名称", value: "name"},
                        {label: "商品中文报关名", value: "declareName"},
                        {label: "商品英文报关名", value: "declareEnName"},
                        {label: "中文配货名称", value: "packingName"},
                        {label: "英文配货名称", value: "packingEnName"},
                        {label: "SKU", value: "sku"},
                        {label: "SPU", value: "spu"},
                        {label: "别名", value: "alias"},
                    ],

                }
            }
        },
        methods: {
            development_fix_result(res){
                return res.map(row=>{
                    return {
                        value:row.id,
                        label:row.realname
                    }
                })
            },
            submit(){
//                Object.assign(this.searchData,this.params);
                this.$emit("submit")
            },
            change_status(select){
                this.$emit("change-sale", this.saleStatus[select].value)
            },
            clear(){
                this.$emit("clear")
            },
        },
        computed:{
            changeLabel(){
                let find = this.form.selectListP.find(res=>{
                    return res.value === this.searchData.snType;
                });
                if(!!find){
                    return find.label;
                }
            }
        },
        props: {
            searchData: {
                required: true,
                type: Object
            }
        },
        components: {
            labelButtons,
            supplier:require('../../../api-components/supplier.vue').default,
            searchCard:require('../../../components/search-card.vue').default,
            orderInput:require('../../../components/order-input.vue').default,
            labelItem:require('../../../components/label-item.vue').default,
            purchaser:require('../../../api-components/purchaser.vue').default,
            paramAccount:require('../../../api-components/param-account.vue').default,
        }
    }
</script>

