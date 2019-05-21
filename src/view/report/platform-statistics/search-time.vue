<template>
    <div class="c-search-list">
        <search-card :params="searchData" @search="search" :clears="clears" >
            <label-buttons label="平台：" @select="change_status" :buttons="saleStatus" :max='14'></label-buttons>
            <label class="inline">刊登时间：</label>
            <el-date-picker
                    v-model="searchData.start_time"
                    type="date"
                    placeholder="开始时间"
                    class="inline date"
                    v-sf.start_time
                    :picker-options="pickerstart">
            </el-date-picker>
            <label>&nbsp;--&nbsp;</label>
            <el-date-picker
                    v-model="searchData.end_time"
                    type="date"
                    placeholder="结束时间"
                    class="inline date"
                    v-sf.end_time
                    :picker-options="pickerend">
            </el-date-picker>
            <label-item class="ml-sm" label="开发员：">
                <param-account
                        v-model="searchData.developer_id"
                        class="s-width-default"
                        :fixResult="development_fix_result"
                        type="memberShipSales"
                        placeholder="请选择/输入..."
                        url="get|user/development/staffs">
                </param-account>
            </label-item>
            <label-item label="SPU：">
                <order-input class="width-super mr-sm"
                             v-model="searchData.spu"
                             @keydown="key_down"
                             placeholder="可批量搜索，Shift+回车换行..."
                ></order-input>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">
    .c-search-list{
        z-index :999;
    .el-card{
        overflow: inherit;
    }
    }
</style>
<script>
    import {api_get_channels} from '../../../api/platform-statistics'
    export default {
        data() {
            return {
                saleStatus:[],
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.searchData.end_time){
                            return  time.getTime() > this.searchData.end_time;
                        }else {
                            return false
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.searchData.start_time){
                            return  time.getTime() < this.searchData.start_time;
                        }else {
                            return false
                        }
                    }
                },
            }
        },
        mounted(){
            this.init_status();
        },
        methods:{
            development_fix_result(res) {
                return res.map(row => {
                    return {
                        value: row.id,
                        label: row.realname
                    }
                })
            },
            key_down() {
                this.search();
            },
            search(){
                this.$emit('search');
            },
            init_status(){
                this.$http(api_get_channels).then(res=>{
                    this.saleStatus = res.filter(item=> item.value !== 5&&item.value !== 6&&item.value !== 9&&item.value !== 10&&item.value !== 11&&item.value !== 12&&item.value !== 13&&item.value !== 14
                    &&item.value!==15&&item.value!==18&&item.value!==19&&item.value!==20&&item.value!==22&&item.value!==23&&item.value!==34
                    );
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            change_status(index){
                this.$emit('change-status',this.saleStatus[index].value,this.saleStatus[index].label);
            },
        },
        props:{
            searchData:{
                required:true,
                type:Object
            },
            clears:{}
        },
        components: {
            labelButtons: require('@/components/label-buttons.vue').default,
            searchCard: require('@/components/search-card.vue').default,
            labelItem:require('@/components/label-item.vue').default,
            orderInput: require("@/components/order-input.vue").default,
            paramAccount: require('@/api-components/param-account').default,
        }
    }
</script>