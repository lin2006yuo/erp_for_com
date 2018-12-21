<template>
    <search-card @search="search" @enter="search" :params="forsaleList" :clears="clears" style="overflow:initial;">
        <div class="mb-mini">
            <el-select v-sf.snType
                       filterable
                       v-model="forsaleList.snType"
                       class="inline s-width-default">
                <el-option v-for="item in goods" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-input placeholder="请输入搜索内容..." v-sf.snText v-model="forsaleList.nContent" class="inline mr-sm s-width-middle" ></el-input>
            <label-item label="账号简称：" class="mr-sm">
                <param-account v-sf.account_id  v-model="forsaleList.account_id"
                               type="shopeeAccount"
                               url="get|publish/shopee/accounts"
                               clearabled
                               :refresh="true"
                               :fixResult="fixAccount"
                               placeholder="全部"
                               class="s-width-default">
                </param-account>
            </label-item>
        </div>
        <label-item label="销售员：" class="mr-sm">
            <el-select class="inline s-width-default"
                       filterable
                       clearable
                       v-sf.create_id
                       v-model="forsaleList.create_id">
                <el-option v-for="item in userList"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
            </el-select>
        </label-item>
        <label-item label="本地状态：" class="mr-sm">
            <el-select class="inline s-width-default"
                       v-sf.sell_status
                       v-model="forsaleList.spu_status">
                <el-option v-for="item in saleList"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
            </el-select>
        </label-item>
        <label-item label="刊登工具：" class="mr-sm">
            <el-select class="inline s-width-default"
                       v-sf.tool
                       v-model="forsaleList.application">
                <el-option v-for="item in toolsList"
                           :label="item.label"
                           :value="item.value"
                           :key="item.value">
                </el-option>
            </el-select>
        </label-item>
        <label-item label="上传时间：" class="mr-sm">
            <el-date-picker class="inline date" v-sf.start_time
                            v-model="forsaleList.start_time" type="date"
                            :picker-options="pickerstart" placeholder="开始时间"></el-date-picker>
            <span>&nbsp;&nbsp; -- &nbsp;&nbsp;</span>
            <el-date-picker class="inline date" v-sf.end_time
                            v-model="forsaleList.end_time" type="date"
                            :picker-options="pickerend" placeholder="结束时间"></el-date-picker>
        </label-item>
    </search-card>
</template>
<style lang="stylus">
</style>
<script>
    import {api_get_shopee_sellers} from '../../../../api/shopee-publish';
    export default{
        data(){
            return {
                clears:{},
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.forsaleList.end_time){
                            return  time.getTime() > this.forsaleList.end_time;
                        }else {
                            return false
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.forsaleList.start_time){
                            return  time.getTime() < this.forsaleList.start_time;
                        }else {
                            return false
                        }
                    }
                },
                goods:[
                    {
                        label: '本地SPU',
                        value: 'spu',
                    },
                    {
                        label: '本地SKU',
                        value: 'local_sku',
                    },
                    {
                        label: '平台SKU',
                        value: 'sku',
                    },
                    {
                        label: '平台产品ID',
                        value: 'product_id',
                    },
                    {
                        label: '刊登标题',
                        value: 'name',
                    },
                ],
                userList:[],
                saleList:[ //本地状态
                    {label:"全部",value:""},
                    {label:"在售",value:1},
                    {label:"停售",value:2},
                    {label:"卖完下架",value:3},
                    {label:"缺货",value:4},
                ],
                toolsList:[//刊登工具
                    {label:"全部",value:""},
                    {label:"ERP刊登",value:'1'},
                    {label:"非ERP刊登",value:'0'},
                ],
            }
        },
        mounted(){
            this.search();
        },
        created(){
            this.get_seller();
        },
        methods:{
            get_seller(){
                this.$http(api_get_shopee_sellers).then(res=>{
                    this.userList=res.map(row=>{
                        return {
                            label:row.realname,
                            value:row.id,
                        }
                    });
                }).catch(code => {
                    this.$message({type:"error",code:code.message||code})
                });
            },
            fixAccount(res){
                console.log('test',res);
                return res.map(row=>{
                    return {
                        label:row.account_name,
                        value:row.account_id,
                    }
                })
            },
            search(){
                this.$emit("search",this.forsaleList);
            },
            select_account(val){
                if(val === ''){
                    this.forsaleList.shop_id = '';
                    this.shopList = [];

                }else {
                    this.forsaleList.shop_id = '';
                    this.get_joom_store();
                }
            },
            //获取店铺列表
            get_joom_store(){
                this.$http('', {joom_account_id:this.forsaleList.account_id}).then(res => {
                    this.shopList = [{label: '全部', value: ''}, ...res.data];
                })
            },
        },
        props:{
            forsaleList:{
                required:true,
                type:Object
            }
        },
        components: {
            paramAccount:require("@/api-components/param-account.vue").default,
            searchCard:require('../../../../components/search-card.vue').default,
            labelItem:require('../../../../components/label-item.vue').default,
        }
    }
</script>
