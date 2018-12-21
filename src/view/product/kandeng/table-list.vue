<template>
    <el-row class="p-table-list">
        <el-table :data="publishList"  @selection-change="selection_change" border height="750">
            <el-table-column type="selection" width="35" align="center"></el-table-column>
            <el-table-column  inline-template label="图片" width="100" align="center">
                <img :src="row.picture" style="width:100%;"/>
            </el-table-column>
            <el-table-column property="sku" label="SKU" width="180" align="center" show-tooltip-when-overflow></el-table-column>
            <el-table-column property="name" label="商品名称" width="180" align="center" show-tooltip-when-overflow></el-table-column>
            <el-table-column property="time" label="产品状态/更新时间" width="140" align="center" show-tooltip-when-overflow></el-table-column>
            <el-table-column property="classify" label="店铺分类" width="140" align="center" show-tooltip-when-overflow></el-table-column>
            <el-table-column property="site" label="站点" width="65" align="center" show-tooltip-when-overflow></el-table-column>
            <el-table-column property="price" label="价格" width="85" align="center" sortable></el-table-column>
            <el-table-column property="sales" label="销量" width="85" align="center" sortable></el-table-column>
            <el-table-column property="visits" label="访问量" width="98" align="center" sortable></el-table-column>
            <el-table-column property="amount" label="可售量" width="98" align="center" sortable></el-table-column>
            <el-table-column property="collection" label="收藏量" width="98" align="center" sortable></el-table-column>
            <el-table-column property="supplynum" label="自动补货数量"align="center"></el-table-column>
            <el-table-column inline-template label="操作" align="center">
                <el-select v-model="row.num" @input="check(row,row.num)" placeholder="操作">
                    <el-option
                            :key="item.value"
                            v-for="item in operateList"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-table-column>
        </el-table>
    </el-row>
</template>
<style lang="stylus">

</style>
<script>
    import {operateList} from './action';//------操作按钮引入
    export default{
        data(){
            return {
                operateList:operateList,
            }
        },
        props:{
            publishList:{
                required:true,
                type:Array
            }
        },
        methods:{
            check(row,num){//---------------------查看按钮
                /* let operate = operateList.find(operate=>{return operate.value === num});*/
                let operate = operateList.find(function (operate) {
                    return operate.value === num
                });
                operate.action.call(this, row);

            },
            selection_change(muiSelected){
                this.$emit("selection-change",muiSelected);
            }
        },

        components: {

    }
    }
</script>
