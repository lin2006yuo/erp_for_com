<template>
    <div>
        <search-card :params="searchData"
                     @search="$listeners['search']"
                     :clears="clears">
            <label-item label="SKU：">
                <el-input v-model="searchData.sku"
                          v-sf.sku
                          placeholder="请输入SKU"
                          class="inline"
                          @keyup.enter.native="init">
                </el-input>
            </label-item>

            <label-item label="货位：" class="ml-sm">
                <el-input v-model="searchData.warehouse_cargo"
                          v-sf.warehouse_cargo
                          placeholder="请输入货位"
                          @keyup.enter.native="init">
                </el-input>
            </label-item>
            <label-item label="分区功能：" class="ml-sm ">
                <el-select v-model="searchData.warehouse_area_id" class="inline width-sm" v-sf.warehouse_area_id>
                    <el-option v-for="(item, index) in areaList"
                               :key="index"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <label-item label="标记待入库时间：" class="ml-sm mr-sm">
                <el-date-picker
                        @keyup.enter.native="search"
                        type="date"
                        v-sf.date_start
                        placeholder="开始时间"
                        v-model="searchData.date_start"
                        class="inline date"
                        :picker-options="pickerStart"
                ></el-date-picker>
                <label>&nbsp;--&nbsp;</label>
                <el-date-picker
                        @keyup.enter.native="search"
                        type="date"
                        placeholder="结束时间"
                        v-sf.date_end
                        v-model="searchData.date_end"
                        class="inline date"
                        :picker-options="pickerEnd"
                ></el-date-picker>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    export default {
        data(){
            return {
                typeList:[
                    {label:'SKU',value:'sku'},
                    {label:'商品名称',value:'name'}
                ],
                pickerStart:{
                    disabledDate:(time)=>{
                        if(this.searchData.date_end){
                            return  time.getTime() > this.searchData.date_end
                        }else {
                            return false
                        }
                    }
                },
                pickerEnd:{
                    disabledDate:(time)=>{
                        if(this.searchData.date_start){
                            return time.getTime() < this.searchData.date_start
                        }else {
                            return false
                        }
                    }
                },
            }
        },
        props: {
            areaList: {},
            searchData: {},
            clears: {}
        },
        components: {
            labelItem:require('@/components/label-item.vue').default,
            searchCard:require('@/components/search-card.vue').default,
        },
    }
</script>
