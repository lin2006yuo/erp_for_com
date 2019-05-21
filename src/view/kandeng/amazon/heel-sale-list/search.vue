<template>
    <div class="search-content">
        <search-card :params="searchData" :clears="clears" @search="search" class="mb-mini">
            <el-select class="inline s-width-default mb-mini" v-model="searchData.search_type" v-sf.search_type :placeholder="$t('ymx-heel-sale-list.clues4')">
                <el-option v-for="(item, index) in snType" :value="item.value" :label="item.label"
                           :key="index"></el-option>
            </el-select>
            <order-input v-model="searchData.search_content"
                         class="inline width-super mr-sm mb-mini"
                         v-sf.search_content
                         :placeholder="$t('ymx-heel-sale-list.clues2')"
                         @keydown="search"></order-input>
            <label-item :label="$t('ymx-heel-sale-list.site')+'：'" class="mb-mini">
                <!--<el-select v-model="searchData.site"-->
                           <!--class="inline s-width-middle mr-sm"-->
                           <!--v-sf.site-->
                           <!--@change="change_site"-->
                           <!--default-first-option-->
                           <!--filterable clearable>-->
                    <!--<el-option-->
                            <!--v-for="res in siteList"-->
                            <!--:label="res.label"-->
                            <!--:value="res.value"-->
                            <!--:key="res.value"-->
                    <!--&gt;</el-option>-->
                <!--</el-select>-->
                <super-select
                    v-model="searchData.site"
                    class="inline s-width-middle mr-sm"
                    v-sf.site
                    @change="change_site"
                    :clearable="true"
                    :placeholder="'请选择/输入...'"
                    :options="siteList"
                    :storageKey="'amazon_heel_sale_list_site'"
                ></super-select>
            </label-item>
            <label-item :label="$t('ymx-heel-sale-list.accountName')+'：'" class="mb-mini">
                <!--<el-select class="inline s-width-default mr-sm" v-model="searchData.account_id" :placeholder="$t('ymx-heel-sale-list.clues3')" v-sf.account_id-->
                           <!--:disabled="isHasSite" filterable>-->
                    <!--<el-option v-for="(item, index) in account"-->
                               <!--:value="item.account_id"-->
                               <!--:label="item.account_name"-->
                               <!--:key="item.account_id"></el-option>-->
                <!--</el-select>-->
                <super-select
                    v-model="searchData.account_id"
                    class="inline s-width-default mr-sm"
                    v-sf.account_id
                    @change="change_site"
                    :clearable="true"
                    :disabled="isHasSite"
                    :placeholder="$t('ymx-heel-sale-list.clues3')"
                    :options="account"
                    :storageKey="'amazon_heel_sale_list_account_id'"
                ></super-select>
            </label-item>
            <label-item :label="$t('ymx-heel-sale-list.uploadStatus')+'：'" class="mb-mini">
                <el-select v-model="searchData.status"
                           class="inline s-width-default mr-sm"
                           v-sf.status
                           :placeholder="$t('ymx-heel-sale-list.clues4')"
                           default-first-option
                           filterable clearable>
                    <el-option
                            v-for="res in statusList"
                            :label="res.label"
                            :value="res.value"
                            :key="res.value"
                    ></el-option>
                </el-select>
            </label-item>
            <label-item :label="$t('ymx-heel-sale-list.createPerson')+'：'" class="mb-mini">
                <!--<param-account-->
                    <!--class="width-sm mr-sm"-->
                    <!--ref="paramSale"-->
                    <!--v-model="searchData.saler_id"-->
                    <!--v-sf.saler_id-->
                    <!--:param="{type:'sales',data:{content:''}}"-->
                    <!--:fixResult="sale_fix_result"-->
                    <!--type="memberShipSales"-->
                    <!--:placeholder="$t('ymx-list.pse')"-->
                    <!--url="get|user/sales/staffs">-->
                <!--</param-account>-->
                <super-select
                    v-model="searchData.saler_id"
                    class="width-sm mr-sm"
                    v-sf.saler_id
                    :clearable="true"
                    :placeholder="$t('ymx-list.pse')"
                    :options="createPerson"
                    :storageKey="'amazon_heel_sale_list_saler_id'"
                ></super-select>
            </label-item>
            <label-item :label="$t('ymx-heel-sale-list.timingRule')+'：'" class="mb-mini">
                <!--<param-account-->
                    <!--v-model="searchData.rule_id"-->
                    <!--:oldValue="searchData"-->
                    <!--class="s-width-default"-->
                    <!--type="saleRule"-->
                    <!--:fixResult="fixRule"-->
                    <!--:placeholder="$t('ymx-heel-sale-list.selectEnter')"-->
                    <!--:param="{rule_name: '',status: 0, page: 1, pageSize: 10000000}"-->
                    <!--url="get|publish/amazon/up-lower-rule-list"></param-account>-->
                <el-input v-model="searchData.rule_name"  @keyup.native.enter="search"  class="s-width-middle mr-sm"   :placeholder="$t('ymx-heel-sale-list.supportSearch')" ></el-input>
            </label-item>
            <label-item :label="$t('ymx-heel-sale-list.creationTime')+'：'" class="mb-mini">
                <el-date-picker
                        v-model="searchData.star_time"
                        type="date"
                        size="small"
                        :placeholder="$t('ymx-heel-sale-list.startDate')"
                        class="inline date"
                        v-sf.star_time
                        @change="data_picker_b"
                        :picker-options="inputTimeStart">
                </el-date-picker>
                <label>&nbsp;--&nbsp;</label>
                <el-date-picker
                        v-model="searchData.end_time"
                        type="date"
                        size="small"
                        :placeholder="$t('ymx-heel-sale-list.endDate')"
                        class="inline date mr-sm"
                        v-sf.end_time
                        @change="data_picker_e"
                        :picker-options="inputTimeEnd">
                </el-date-picker>
            </label-item>
        </search-card>
    </div>
</template>
<style lang="stylus">
    .search-content{
        z-index :999;
        .el-card{
            overflow: inherit;
        }
        .el-date-editor{
            width:125px !important;
        }
    }
</style>
<script>
    import {api_get_amazon_account} from '../../../../api/amazon-publish-list';
    import {api_get_seller} from '../../../../api/platform-statistics';
    export default {
        data() {
            return {
                //类型
                snType:[
                    {label:this.$t('ymx-heel-sale-list.asin'),value:1},
                    {label:this.$t('ymx-heel-sale-list.platformSku'),value:4}
                ],
                //状态 :0:;1:;2:
                statusList:[
                    {label:this.$t('ymx-heel-sale-list.noGrab'),value:0},
                    {label:this.$t('ymx-heel-sale-list.grabbed'),value:1},
                    {label:this.$t('ymx-heel-sale-list.defeats'),value:2},
                    {label:this.$t('ymx-heel-sale-list.uploading'),value:3},
                    {label:this.$t('ymx-heel-sale-list.cancelled'),value:4}
                ],
                account:[],
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
                        if (this.searchData.star_time) {
                            return time.getTime() < new Date(this.searchData.star_time).getTime()-24*60*60*1000|| time.getTime() > Date.now();
                        } else {
                            return time.getTime() > Date.now();
                        }
                    }
                },
                createPerson:[]
            }
        },
        mounted(){
          this.get_create_person();
        },
        methods:{
            search(){
                this.$emit('search');
            },
            data_picker_b(val){
                this.searchData.star_time = val
            },
            data_picker_e(val){
                this.searchData.end_time = val
            },
            get_account(){
                this.$http(api_get_amazon_account,{site: this.searchData.site}).then(res => {
                    // this.account = [{account_name: this.$t('ymx-heel-sale-list.all'), account_id: ''},...res];
                    this.account = res.map(item=>{
                        return {
                            label:item.account_name,
                            value:item.account_id
                        }
                    });
                    // this.searchData.account_id = this.account[0].account_id
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    });
                    // this.account.splice(0, this.account.length);
                })
            },
            get_create_person(){
                this.$http(api_get_seller,{type:'sales',data:{content:''}})
                    .then(res=>{
                        this.createPerson = res.map(item=>{
                            return {
                                label:item.realname,
                                value:item.id
                            }
                        })
                    })
                    .catch(err=>{
                        this.$message({
                            type:'error',
                            message:err.message|| err
                        })
                    })
            },
            change_site(val){
                if (!!val) {
                    this.get_account();
                } else {
                    // this.account = [{account_name: '', account_id: ''}];
                    this.account = [];
                    this.searchData.account_id = ''
                }
            },
            sale_fix_result(val){
                return val.map(row=>{
                    return {
                        value:row.id,
                        label:row.realname
                    }
                })
            },
            //获取定时规则
            fixRule(res){
                let list = res.data.map(row => {
                    return {
                        label: row.rule_name,
                        value: row.id
                    }
                });
                return list
            },
        },
        computed: {
            isHasSite(){
                return !this.searchData.site;
            },
        },
        props:{
            searchData:{
                required:true,
                type:Object
            },
            clears:{
                required:true,
                type:Object
            },
            siteList:{
                required: true,
                type: Array,
            }
        },
        components: {
            searchCard:require('@/components/search-card.vue').default,
            labelItem:require('@/components/label-item.vue').default,
            paramAccount:require('@/api-components/param-account.vue').default,
            orderInput:require("@/components/order-input.vue").default,

        }
    }
</script>
