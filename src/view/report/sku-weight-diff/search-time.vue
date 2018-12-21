<template>
    <div class="c-search-time">
        <search-card :params="searchData" @search="search" :clears="clears" >
            <el-row class="mb-xs">
                <el-select v-model="searchData.snType" class="width-xs inline">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
          
                <label-item label="">
                    <order-input v-model="searchData.snText"
                        class="inline width-super mr-sm"
                        @keydown='key_down'
                        v-sf.connd_value
                        placeholder="可批量搜索，Shift+回车换行..."></order-input>
                </label-item>                
                <label>选择重量范围(g) : </label>        
                <label-item label="" class="mr-md">
                    <el-input  v-model="searchData.weight_st" style="width: 100px;"  type="number"  placeholder="重量开始值"></el-input>
                    <label>&nbsp;--&nbsp;</label>
                    <el-input  v-model="searchData.weight_nd" style="width:100px"  type="number" @blur="to_p" placeholder="重量结束值"></el-input>
                </label-item>
            </el-row>

            <span>自动校准</span>
            <el-select v-model="searchData.is_auto_update_weight" class="width-xs inline">
                <el-option
                    v-for="item in options2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            
            <label class="inline margin-left">校准时间：</label>
            <el-date-picker
                    v-model="searchData.auto_update_time_st"
                    type="date"
                    placeholder="开始时间"
                    class="inline date"
             >
            </el-date-picker>
            <label>&nbsp;--&nbsp;</label>
            <el-date-picker
                    v-model="searchData.auto_update_time_nd"
                    type="date"
                    placeholder="结束时间"
                    class="inline date"
                >
            </el-date-picker>
        </search-card>
    </div>
</template>
<style lang="stylus" scoped>
    .c-search-time{
        .el-card{
            overflow: inherit;
        }
    }
    .margin-left{
        margin-left 9.5%
    }
</style>
<script>
    export default {
        data() {
            return {
                clears:{},
                options: [
                    {label: 'SKU', value: 'sku'}
                    // {label: 'SKU别名', value: 1}
                ],
                options2: [
                    {label: '全部', value: ''},
                    {label: '开启', value: 1},
                    {label: '关闭', value: 0}
                ]
            }
        },
        methods:{
            to_p () {
                if ((this.searchData.weight_st - 0) > (this.searchData.weight_nd - 0)) {
                    this.$message({type:"warning",message: '最大值不能小于最小值',duration:1500});
                }
            },
            key_down(){
                this.search();
            },
            search(){
                this.$emit('search');
            },
        },
        props:{
            searchData:{
                required:true,
                type:Object
            },
        },
        components: {
            orderInput:require("@/components/order-input.vue").default,
            labelItem:require('@/components/label-item.vue').default,
            searchCard: require('@/components/search-card.vue').default,
            paramAccount: require('@/api-components/param-account').default,
        }
    }
</script>