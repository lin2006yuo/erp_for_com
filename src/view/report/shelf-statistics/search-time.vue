<template>
    <div class="c-search-time">
        <search-card :params="searchData" @search="search" :clears="clears" >
            <label class="inline">上架时间：</label>
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
                        class="s-width-default"
                        v-model="searchData.developer_id"
                        v-sf.developer_id
                        :fixResult="development_fix_result"
                        type="memberShipSales"
                        placeholder="请选择/输入..."
                        url="get|user/development/staffs">
                </param-account>
            </label-item>
            <label-item label="SPU：" class="ml-sm">
                <order-input v-model="searchData.spu"
                    class="inline width-super mr-sm"
                    @keydown='key_down'
                    v-sf.connd_value
                    placeholder="可批量搜索，Shift+回车换行..."></order-input>
            </label-item>
            <label class="inline ml-sm">
            <el-select v-model="searchData.channel_id" v-sf.channel_id>
                <el-option v-for="item in list"
                :label="item.name"
                :value="item.channel_id"
                :key="item.channel_id"
                >

                </el-option>
            </el-select>
            </label>
            <label-item label="" class="mr-md">
                    <el-input  v-model="searchData.total_b" style="width: 80px;"  type="number" @blur="from_p" @input="tb" placeholder="最小值"></el-input>
                    <span> -</span>
                    <span>- </span>
                    <el-input  v-model="searchData.total_e" style="width:80px"  type="number" @blur="to_p" @input="te" placeholder="最大值"></el-input>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus" scoped>
    .c-search-time{
        .el-card{
            overflow: inherit;
        }
    }
</style>
<script>
    export default {
        data() {
            return {
                clears:{},
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.searchData.end_time){
                            return  time.getTime() > this.searchData.end_time;
                        }else {
                            return false
                        }
                    },
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
                countryList:[
                    {label:'全部',value:0},
                    {label:'哈哈',value:1},
                ],
            }
        },
        methods:{
            tb(){
                this.searchData.total_b = this.searchData.total_b.replace(/\D/g,'')
            },
            te(){
                this.searchData.total_e = this.searchData.total_e.replace(/\D/g,'')
            },
            from_p(){
                if(this.searchData.total_b>this.searchData.total_e){
                    this.$emit('update:tip','最大值输入有误');
                    //this.$message({type:"warning",message:'最小值不能大于最大值',duration:1500});
                }else {
                    this.$emit('update:tip','');
                    this.searchData.total_b=Number(this.searchData.total_b)
                }
            },
            to_p(){
                if(this.searchData.total_b>this.searchData.total_e){
                    this.$emit('update:tip','最大值输入有误');
                    //this.$message({type:"warning",message:'最大值不能小于最小值',duration:1500});
                }else {
                    this.$emit('update:tip','');
                    this.searchData.total_e = Number(this.searchData.total_e)
                }
            },
            key_down(){
                this.search();
            },
            development_fix_result(res) {
                return res.map(row => {
                    return {
                        value: row.id,
                        label: row.realname
                    }
                })
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
            list:{},
            tip:{}
        },
        components: {
            orderInput:require("@/components/order-input.vue").default,
            labelItem:require('@/components/label-item.vue').default,
            searchCard: require('@/components/search-card.vue').default,
            paramAccount: require('@/api-components/param-account').default,
        }
    }
</script>