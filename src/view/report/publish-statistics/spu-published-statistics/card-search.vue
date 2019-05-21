<template>
    <div class="c-search-time">
        <search-card @search="search" :clears="clears" :params="searchData" >
            <div class="mb-mini">
                <el-select class="s-width-small inline mr-xs" v-model="searchData.date_type">
                    <el-option v-for="item in time" :label="item.label" :value="item.value" :key="item.value"></el-option>
                </el-select>
                <el-date-picker
                        class="inline date"
                        v-model="searchData.start_date"
                        type="date"
                        placeholder="开始时间"
                        :picker-options="pickerstart"
                ></el-date-picker>&nbsp;--&nbsp;<el-date-picker
                    class="inline mr-lg date"
                    v-model="searchData.end_date"
                    type="date"
                    placeholder="结束时间"
                    :picker-options="pickerend"
            ></el-date-picker>



                <el-select v-model="searchData.channel_num" class="inline mr-xs ml-md" style="width: 114px">
                    <el-option v-for="item in channel_type"
                               :label="item.label"
                               :value="item.value"
                               :key="item.value"
                    >

                    </el-option>
                </el-select>
                <label-item label="" class="mr-md">
                    <el-input  v-model="searchData.min_num" style="width: 80px;"  type="number" @blur="from_p" @input="tb" placeholder="最小值" min="0"></el-input>
                    <span>&nbsp;--&nbsp;</span>
                    <el-input  v-model="searchData.max_num" style="width:80px"  type="number" @blur="to_p" @input="te" placeholder="最大值" min="0"></el-input>
                </label-item>
            </div>


            <div class="inline">
                <label-item label="平台：" style="margin-right: 40px">
                    <el-select v-model="searchData.channel_id" filterable class="width-md">
                        <el-option  v-for="res in channelList"
                                    :label="res.name"
                                    :value="res.channel"
                                    :key="res.name"></el-option>
                    </el-select>
                </label-item>
                <label-item label="" class="mr-xs" style="width: 82px">
                    <el-select v-model="searchData.select_type" >
                        <el-option v-for="item in type" :label="item.label" :value="item.value" :key="item.value"></el-option>
                    </el-select>
                </label-item>
                    <order-input v-model="searchData.snText"
                                 class="inline width-super mr-sm"
                                 @keydown='key_down'
                                 style="margin-right: 40px"
                                 placeholder="可批量搜索，Shift+回车换行..."></order-input>
                <label-item label="开发员：" style="margin-right: 41px">
                    <!--<super-select-->
                        <!--:storage-key="developer_m"-->
                        <!--:options="developerMixinOptions"-->
                        <!--v-model="searchData.developer_id"-->
                    <!--&gt;</super-select>-->
                    <select-account
                        v-model="searchData.developer_id"
                        type="developer"
                    ></select-account>
                </label-item>
            </div>
        </search-card>
    </div>
</template>

<style lang="stylus">
    .c-search-time{
    .el-card{
        overflow: inherit;
    }
    }
</style>

<script>
    import {api_get_channel} from '@/api/published-statistics-spu'
    export default {
        data() {
            return {
                select_arr:[],
                time:[
                    {label:'上架时间',value:'shelf'},
                    {label:'刊登时间',value:'publish'}
                ],
                type:[
                    {label:'SPU',value:'spu'},
                    {label:'分类',value:'local_category'}
                ],
                channel_type:[
                    {label:'刊登总数',value:'total'},
                    {label:'ebay平台',value:'ebay'},
                    {label:'亚马逊平台',value:'amazon'},
                    {label:'wish平台',value:'wish'},
                    {label:'速卖通平台',value:'aliexpress'},
                    {label:'joom平台',value:'joom'},
                    {label:'mymall平台',value:'mymall'},
                    {label:'shopee平台',value:'shopee'}
                ],
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.searchData.end_date){
                            return time.getTime()>this.searchData.end_date;
                        }else{
                            return false
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.searchData.start_date){
                            return time.getTime()<this.searchData.start_date;
                        }else{
                            return false;
                        }
                    }
                }
            }
        },
        created(){

        },
        methods: {
            // get_channel(){
            //     this.$http(api_get_channel).then(res=>{
            //         res=res.filter(row=>{
            //             return row.value ===1||row.value===2||row.value ===3||row.value===4||row.value===6||row.value===7||row.value===8||row.value===9
            //         })
            //         this.channelList = [{label:"全部",value:""},...res];
            //     }).catch(code=>{
            //         console.log(code);
            //     })
            // },
            search() {
                this.$emit('search')
            },
            key_down(){
                this.search()
            },
            tb(){
                 this.searchData.min_num = this.searchData.min_num.replace(/\D/g,'')
            },
            te(){
                this.searchData.max_num = this.searchData.max_num.replace(/\D/g,'')
            },
            from_p(){
                if(this.searchData.min_num>this.searchData.max_num && this.searchData.max_num !== ""){
                    this.$emit('update:tip','最大值输入有误');
                    //this.$message({type:"warning",message:'最小值不能大于最大值',duration:1500});
                }else {
                    this.$emit('update:tip','');

                }
            },
            to_p(){
                if(this.searchData.min_num>this.searchData.max_num && this.searchData.max_num !== ""){
                    this.$emit('update:tip','最大值输入有误');
                    //this.$message({type:"warning",message:'最大值不能小于最小值',duration:1500});
                }else {
                    this.$emit('update:tip','');

                }
            },
            development_fix_result(res) {
                return res.map(row => {
                    return {
                        value: row.id,
                        label: row.realname
                    }
                })
            },
        },
        props:{
            clears:{},
            searchData:{},
            list:{},
            tip:{},
            channelList:{}
        },
        components:{
            labelItem:require('@/components/label-item').default,
            orderInput:require("@/components/order-input.vue").default,
            paramAccount: require('@/api-components/param-account').default,
            selectAccount: require('@/api-components/select-account').default
        }
    }
</script>

