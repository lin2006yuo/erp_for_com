<template>
    <div class="inline">
        <label-item label="账号简称：" class="inline">
            <el-select v.sf="account_id"
                       v-model="search_data.account_id"
                       class="inline s-width-middle"
                       filterable clearable>
                <el-option
                        :key="item.value"
                        v-for="item in accountLists"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </label-item>
        <label-item label="登录验证状态：" class="inline ml-sm">
            <el-select v.sf="health_status"  v-model="search_data.health_status" class="inline s-width-middle">
                <el-option
                        :key="item.value"
                        v-for="item in health_status"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </label-item>
        <label-item label="抓取时间：" class="inline ml-sm mr-sm">
            <el-date-picker
                    class="date"
                    clearable
                    v.sf="time_start"
                    v-model="search_data.time_start"
                    type="date"
                    placeholder="开始时间"
                    @change="data_picker_b"
                    :picker-options="inputTimeStart">
            </el-date-picker>
            <span>&nbsp;--&nbsp;</span>
            <el-date-picker
                    class="date"
                    clearable
                    v.sf="time_end"
                    v-model="search_data.time_end"
                    type="date"
                    placeholder="结束时间"
                    @change="data_picker_e"
                    :picker-options="inputTimeEnd">
            </el-date-picker>
        </label-item>
    </div>
</template>
<style lang="stylus" scoped>

</style>
<script>
    // api_aliexpress_account_health_account

    import  {api_aliexpress_account_health_account} from '@/api/monitor-manage'
    import {get_ebaysite, api_account_list} from '@/api/ebay-order';
    export default {
        data() {
            return {
                search_data:this.value,
                accountLists:'',//账号简称
                health_status:[
                    {label:'全部',value:''},
                    {label:'帐号资料不完整',value:0},
                    {label:'有效',value:1},
                    {label:'无效',value:2},
                    {label:'连不上服务器',value:3},
                ],
                inputTimeStart: {//开始时间
                    disabledDate: (time)=> {
                        if(this.search_data.time_end){
                            return time.getTime() > new Date(this.search_data.time_end).getTime();
                        }else{
                            return time.getTime()>Date.now();
                        }
                    }
                },
                inputTimeEnd: {//结束时间
                    disabledDate: (time)=> {
                        if (this.search_data.time_start) {
                            return time.getTime() < new Date(this.search_data.time_start).getTime()-24*60*60*1000|| time.getTime() > Date.now();
                        } else {
                            return time.getTime() > Date.now();
                        }
                    }
                },
            }
        },
        computed: {},
        filters: {},
        mounted() {
            this.request()
        },
        methods: {
            request(){
                //账号简称
                this.accountList = [];
                this.$http(api_aliexpress_account_health_account).then(res => {
                    if (res.account.length > 0) {
                        // this.showAccount = false;
                        res = res.account;
                        this.accountLists = [{label: "全部", value: ""}, ...res];
                        this.search_data.account_id = this.accountLists[0].value;
                    } else {
                        this.$set(this, "accountLists", [{label: "", value: ""}])
                    }
                }).catch(code => {
                    console.log(code);
                })
            },
            data_picker_b(val){
                this.search_data.time_start = val
            },
            data_picker_e(val){
                this.search_data.time_end = val
            },
        },
        watch: {
            value(val){
                this.search_data = val;
            },
            search_data(val){
                this.$emit('input',val)
            }
        },
        props: {
            value:{
                type:Object,
            }
        },
        components: {
            labelItem:require('@/components/label-item.vue').default,
        }
    }
</script>
