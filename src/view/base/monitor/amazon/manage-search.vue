<template>
    <div class="inline">
        <label-item label="账号简称：" class="inline">
            <el-select  v-model="searchData.account_id" class="inline width-xs" filterable>
                <el-option
                        :key="item.value"
                        v-for="item in accountLists"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </label-item>
        <label-item label="登录验证状态：" class="inline ml-sm">
            <el-select  v-model="searchData.health_status" class="inline width-xs">
                <el-option
                        :key="item.value"
                        v-for="item in statusLists"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </label-item>

        <label-item label="抓取时间：" class="inline ml-sm mr-sm el-date-editor__editor">
            <el-date-picker
                    class="date"
                    clearable
                    v-model="searchData.time_start"
                    type="date"
                    placeholder="开始时间"
                    @change="data_picker_b"
                    :picker-options="inputTimeStart">
            </el-date-picker>
            <span>&nbsp;--&nbsp;</span>
            <el-date-picker
                    class="date"
                    clearable
                    v-model="searchData.time_end"
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

    import { api_account_list } from '../../../../api/monitor-amazon';
    export default {
        name: "manageSearch",
        data() {
            return {
                searchData:this.value,
                accountLists:'',//账号简称
                statusLists:[
                    {
                        label: '全部',
                        value: ''
                    },
                    {
                        label: '账号资料不完整',
                        value: 0
                    },
                    {
                        label: '有效',
                        value: 1
                    },
                    {
                        label: '无效',
                        value: 2
                    },
                    {
                        label: '连不上服务器',
                        value: 3
                    }
                ],
                inputTimeStart: {//开始时间
                    disabledDate: (time)=> {
                        if(this.searchData.time_end){
                            return time.getTime() > new Date(this.searchData.time_end).getTime();
                        }else{
                            return time.getTime()>Date.now();
                        }
                    }
                },
                inputTimeEnd: {//结束时间
                    disabledDate: (time)=> {
                        if (this.searchData.time_start) {
                            return time.getTime() < new Date(this.searchData.time_start).getTime()-24*60*60*1000|| time.getTime() > Date.now();
                        } else {
                            return time.getTime() > Date.now();
                        }
                    }
                },
            }
        },
        mounted() {
            this.request()
        },
        methods: {
            request(){
                //账号简称
                this.accountList = [];
                this.$http(api_account_list, {channel_id: 2}).then(res => {
                    if(res.account.length<=0){
                        this.accountLists = [{label:"",value:""}]
                    }else{
                        res = res.account;
                        this.accountLists = [{label:"全部",value:""},...res];
                    }
                }).catch(code => {
                    console.log(code);
                });
            },
            data_picker_b(val){
                this.searchData.time_start = val
            },
            data_picker_e(val){
                this.searchData.time_end = val
            },
        },
        watch: {
            value(val){
                this.searchData = val;
            },
            searchData(val){
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
