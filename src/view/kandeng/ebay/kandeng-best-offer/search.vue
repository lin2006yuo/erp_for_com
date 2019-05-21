<template>
    <div style="overflow: visible">
        <search-card @search="search" @enter="search" :params="params" :clears="clears" @init-params="initParams">
            <label class="inline">账号简称：</label>
            <super-select v-sf.accountId
                          class="inline s-width-default"
                          v-model="params.accountId"
                          placeholder="输入搜索更多"
                          :options="accountList"
                          storageKey="ebayAccount">
            </super-select>
            <label class="inline ml-sm">相关Item：</label>
            <order-input v-model="params.itemId"
                         class="inline mr-sm width-super"
                         v-sf.itemId
                         @keydown.native="enter_search"
                         :placeholder="$t('ebay-list.searchTip')"></order-input>
            <label class="inline ml-sm">状态：</label>
            <el-select v-sf.status v-model="params.status"
                       class="inline s-width-default">
                <el-option v-for="item in statusList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
            <label class="mb-mini ml-sm">发起时间：</label>
            <el-date-picker class="inline date" v-sf.dateStart v-model="params.dateStart" type="date"
                            :picker-options="pickerstart" :placeholder="$t('ebay-list.sTime')"></el-date-picker>
            -
            <el-date-picker class="inline date mr-sm" v-sf.dateEnd
                            v-model="params.dateEnd" type="date"
                            :placeholder="$t('ebay-list.eTime')"
                            :picker-options="pickerend"></el-date-picker>
            <label class="inline ml-sm">数量：</label>
            <el-input class="inline s-width-default" v-sf.number
                      v-model="params.number" placeholder=""></el-input>
        </search-card>
    </div>
</template>

<script>
    import {api_get_account} from '@/api/ebay-kandeng-public-module';
    export default {
        name: "search",
        data(){
            return{
                statusList:[{label:'全部',value:''},{label:'未处理',value:0},{label:'已处理',value:1},{label:'已延期',value:2},],
                accountList:[],
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.params.dateEnd){
                            return  time.getTime() > this.params.dateEnd;
                        }else {
                            return false;
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.params.dateStart){
                            return  time.getTime() < this.params.dateStart;
                        }else {
                            return false;
                        }
                    }
                },
            }
        },
        mounted(){
            this.get_account();
        },
        methods:{
            get_account(){//账号简称
                this.accountList = [];
                this.params.accountId = "";
                this.$http(api_get_account).then(res=>{
                    this.accountList = res.data.map(row=>{
                        return {
                            label:row.code,
                            value:row.id
                        };
                    });
                }).catch(code=>{
                    console.log(code);
                })
            },
            initParams(){
                this.$emit('secondClear')
            },
            enter_search(e){
                if(!e.shiftKey && e.keyCode === 13){
                    this.$emit("search",this.params);
                }
            },
            search(){
                this.$emit("search",this.params);
            },
        },
        props:{
            params:{
              type:Object,
              required:true,
            },
            clears:{},
        },
        components:{
            searchCard:require('../../../../components/search-card.vue').default,
            orderInput:require("../../../../components/order-input.vue").default,
        }
    }
</script>

<style lang="stylus">
    .el-card{
        overflow: inherit;
    }
</style>
