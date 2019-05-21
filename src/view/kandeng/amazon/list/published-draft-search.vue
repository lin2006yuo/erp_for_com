<template>
    <div class="c-published-draft-search">
        <search-card @search="search_list" @enter="search_list"
                     :params="searchData" :clears="clearsData">
            <label-item label="">
                <el-select v-model="searchData.type" class="s-width-default mr-xs"
                           v-sf.type default-first-option filterable clearable>
                    <el-option
                            v-for="res in typeList"
                            :label="res.label"
                            :value="res.value"
                            :key="res.value"
                    ></el-option>
                </el-select>
                <!--<el-input class='width-super' v-sf.content v-model="searchData.content" :placeholder="$t('ymx-list.searchTip')"></el-input>-->
                <order-input v-if="searchData.type!=='title'" class='width-super' style="width: 200px!important;" v-sf.content v-model="searchData.content" @keydown.enter.native="search_list" :placeholder="getplac"></order-input>
                <el-input
                    v-else
                    class='width-super'
                    style="width: 200px!important;"
                    v-sf.content
                    v-model="searchData.content"
                    :placeholder="getplac"
                    @keydown.enter.native="search_list"
                >
                </el-input>
            </label-item>
            <!--账号简称-->
            <label-item class="ml-sm" :label="`${$t('ymx-list.account')}：`">
                <!--<el-select v-model="searchData.account_id" class="s-width-small"-->
                           <!--remote  :remote-method="remote_method"-->
                           <!--v-sf.account_id default-first-option filterable clearable>-->
                    <!--<el-option-->
                            <!--v-for="res in options"-->
                            <!--:label="res.account_name"-->
                            <!--:value="res.account_id"-->
                            <!--:key="res.account_id"-->
                    <!--&gt;</el-option>-->
                <!--</el-select>-->
                <super-select
                    class="s-width-small"
                    v-sf.account_id
                    v-model="searchData.account_id"
                    :options="options"
                    :clearable="true"
                    :storageKey="'published_draft_account'"
                ></super-select>
            </label-item>
            <label-item class="ml-sm mr-sm" :label="`${$t('ymx-list.time')}：`">
                <el-date-picker
                        v-sf.time_start
                        v-model="searchData.time_start"
                        class="date" type="date"
                        :placeholder="$t('ymx-list.sDate')">
                </el-date-picker>
                <span>&nbsp;--&nbsp;</span>
                <el-date-picker
                        v-sf.time_end
                        v-model="searchData.time_end"
                        class="date" type="date"
                        :placeholder="$t('ymx-list.eDate')">
                </el-date-picker>
            </label-item>

        </search-card>
    </div>
</template>
<style lang="stylus">
    .c-published-draft-search{
        .el-card {
            overflow:visible !important;
        }
    }
</style>
<script>
    import {api_get_amazon_account} from '@/api/amazon-publish-list';
    export default {
        data() {
            return {
                accountList:[],
                options:[],
                typeList:[
                    {label:this.$t('ymx-list.localspu'),value:'spu'},
                    {label:this.$t('ymx-list.localsku'),value:'sku'},
                    {label:this.$t('ymx-list.platsku'),value:'publish_sku'},
                    {label:this.$t('ymx-list.upTitle'),value:'title'},
                    {label:'UPC',value:'upc'},
                ],
            }
        },
        mounted(){
            this.get_account();
        },
        methods:{
            get_account(){
                this.$http(api_get_amazon_account).then(res => {
                    this.accountList = res;
                    // this.options = res.split(1,50);
                   res.forEach(item=>{
                       this.options.push({label:item.account_name,value:item.account_id});
                   })
                    console.log('options',this.options);
                }).catch(code => {
                    console.log(code,'code');
                })
            },
            remote_method(query){
                if (query !== '') {
                    setTimeout(() => {
                        this.options = this.accountList.filter(item => {
                            return item.account_name.toLowerCase()
                                .indexOf(query.toLowerCase()) > -1;
                        });
                    }, 200);
                } else {
                    this.options = this.accountList.split(1,50);
                }
            },
            search_list(){
                if(this.searchData.type!=='title'){
                    let str=this.searchData.content;
                    str=str.replace(new RegExp('\n','gm')," ");
                    str=str.replace(new RegExp(' ','gm'),",");
                    str=str.replace(/,{1,}/g,",");
                    this.$emit('search-list',str);
                }else{
                    this.$emit('search-list');
                }
            },
        },
        computed:{
          getplac(){
              return this.searchData.type=='title'? this.$t('ymx-list.Fuzzy')+'...':this.$t('ymx-list.searchTip');
            }
        },
        props:{
            searchData:{
                type:Object,
                required:true
            },
            clearsData:{
                type:Object,
                required:true
            },
        },
        components: {
            searchCard:require('@/components/search-card.vue').default,
            labelItem:require('@/components/label-item.vue').default,
            orderInput:require("@/components/order-input.vue").default,
        }
    }
</script>
