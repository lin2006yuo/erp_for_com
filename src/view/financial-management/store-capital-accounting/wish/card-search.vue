<template>
    <search-card :params="searchData" :clears="clears" @search="search">
        <label-item label="账号简称：">
            <param-account  v-model="searchData.account_ids"
                            type="wishPublishAccount"
                            url="get|publish/wish/getSellers"
                            :fixResult="fixAccount"
                            placeholder="全部"
                            class="has-inline s-width-default mr-sm">
            </param-account>
        </label-item>
        <label-item class="ml-sm" label="销售员：">
            <el-select v-model="searchData.seller_id"
                       class="inline s-width-small"
                       filterable clearable>
                <el-option
                        v-for="res in sellerList"
                        :label="res.label"
                        :value="res.value"
                        :key="res.value"
                ></el-option>
            </el-select>
        </label-item>
        <label-item label="选择日期范围：" class="ml-sm">
            <el-date-picker
                    class="inline date"
                    v-model="searchData.date_s"
                    :picker-options="pickerstart"
                    placeholder="开始时间">
            </el-date-picker><span>&nbsp;--&nbsp;</span><el-date-picker
                class="inline date mr-sm"
                v-model="searchData.date_e"
                :picker-options="pickerend"
                placeholder="结束时间">
        </el-date-picker>
        </label-item>
    </search-card>
</template>

<style scoped>

</style>

<script>
    import {api_get_wish_users} from '@/api/wish-cash-account'
    export default {
        data() {
            return {
                sellerList:[],
                key: '',
                pickerstart: {
                    disabledDate: (time) => {
                        if (this.searchData.date_e) {
                            return time.getTime() > this.searchData.date_e;
                        } else {
                            return false;
                        }
                    }
                },

                pickerend: {
                    disabledDate: (time) => {
                        if (this.searchData.date_s&&time.getTime() < this.searchData.date_s) {
                            return time.getTime() < this.searchData.date_s;
                        } else {
                            return time.getTime() > Date.now();
                        }
                    }
                },
            }
        },
        mounted(){
            this.get_wish_users()
        },
        methods: {
            search() {
                this.$emit('search')
            },
            get_wish_users(){
                this.$http(api_get_wish_users).then(res=>{
                    this.sellerList = res.map(row=>{
                        return {
                            label:row.realname,
                            value:row.id
                        }
                    });
                }).catch(code=>{
                    console.log(code,'code');
                })
            },
            fixAccount(res){
                return res.data.map(row=>{
                    return {
                        label:row.code,
                        value:row.id,
                    }
                })
            },
        },
        props:{
            searchData:{},
            clears:{}
        },
        components:{
            searchCard:require('@/components/search-card').default,
            labelItem:require('@/components/label-item').default,
            paramAccount:require("@/api-components/param-account").default,
        }
    }
</script>

