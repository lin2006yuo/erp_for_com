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
        <label-item label="站点：" class="inline ml-sm">
            <el-select  v-model="searchData.site_name" class="inline width-xs" filterable>
                <el-option
                        :key="item.value"
                        v-for="item in siteLists"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </label-item>
        <label-item label="抓取时间：" class="inline ml-sm mr-sm el-date-editor__editor">
            <el-date-picker
                    class="date"
                    clearable
                    v-model="searchData.start_time"
                    type="date"
                    placeholder="开始时间"
                    @change="data_picker_b"
                    :picker-options="inputTimeStart">
            </el-date-picker>
            <span>&nbsp;--&nbsp;</span>
            <el-date-picker
                    class="date"
                    clearable
                    v-model="searchData.end_time"
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
    import {get_ebaysite, api_account_list} from '@/api/ebay-order';
    export default {
        name: "manageSearch",
        data() {
            return {
                searchData:this.value,
                accountLists:'',//账号简称
                siteLists:'',//站点
                inputTimeStart: {//开始时间
                    disabledDate: (time)=> {
                        if(this.searchData.end_time){
                            return time.getTime() > new Date(this.searchData.end_time).getTime();
                        }else{
                            return time.getTime()>Date.now();
                        }
                    }
                },
                inputTimeEnd: {//结束时间
                    disabledDate: (time)=> {
                        if (this.searchData.start_time) {
                            return time.getTime() < new Date(this.searchData.start_time).getTime()-24*60*60*1000|| time.getTime() > Date.now();
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
                //站点
                this.$http(get_ebaysite).then(res => {
                    if (res.length > 0) {
                        res = res.map(row => {
                            return {
                                label: row.code,
                                value: row.code
                            }
                        });
                        this.siteLists = [{label: "全部", value: ""}, ...res];
                        this.searchData.site_name = this.siteLists[0].value;
                    }
                }).catch(code => {
                    console.log(code);
                });
                //账号简称
                this.accountList = [];
                this.$http(api_account_list, {channel_id: 1, site_code: this.searchData.region}).then(res => {
                    // this.accountLists = res
                    // console.log('请选择账号简称:',res);
                    if (res.account.length > 0) {
                        // this.showAccount = false;
                        res = res.account;
                        this.accountLists = [{label: "全部", value: ""}, ...res];
                        this.searchData.account_id = this.accountLists[0].value;
                    } else {
                        this.$nextTick(() => {
                            // this.comHolder = "该站点下暂无账号简称";
                            // this.showAccount = true;
                        });
                        this.$set(this, "accountLists", [{label: "", value: ""}])
                    }
                }).catch(code => {
                    console.log(code);
                })
            },
            data_picker_b(val){
                this.searchData.start_time = val
            },
            data_picker_e(val){
                this.searchData.end_time = val
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
