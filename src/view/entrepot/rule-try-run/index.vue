<template>
    <page class="p-index over-flow-auto">
        <search-name class='mb-sm' :clears="clearsData" @search="search"
                     :search-data="searchData"></search-name>
        <!--列表-->
        <el-table
            v-resize="{height:30}"
            class="scroll-bar custom-table"
            :data="tableData.list"
            v-loading="loading"
            element-loading-text="玩命加载中...">
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
                <el-table-column v-for="(item,index) in tableDataTitle"
                                 :key="`${index}-${item}`"
                                 :label="item" align="left"
                                 inline-template>
                    <div v-if="row[item] instanceof Array">
                        <div v-for="(it,it_i) in row[item]" :key="`${it_i}-${it}`">{{it}}</div>
                    </div>
                    <div v-else>
                        <div v-for="(it,it_i) in Object.keys(row[item])" :key="`${it_i}-${it}`">{{it}}：{{row[item][it]}}</div>
                    </div>
                </el-table-column>
        </el-table>
    </page>
</template>
<style lang="stylus">
    .custom-table{
        &.el-table td{
            vertical-align:top !important;
        }
    }
</style>
<script>
    import {api_get_list} from '@/api/rule-try-run';
    export default{
        data(){
            return{
                firstLoading:true,
                loading:false,
                clearsData:{},
                searchData:{
                    order_number:'',
                    rule_type:[],
                },
                tableData:{
                    list:[],
                    page:1,
                    pageSize:50,
                },
                tableDataTitle:[],
            }
        },
        mounted(){
//            this.init();
        },
        methods:{
            search(){
                this.init();
            },
            init(){
                this.tableData.list = [];
                this.loading = true;
                this.$http(api_get_list,this.searchData).then(res => {
                    console.log(Object.keys(res.message),'res.message');


                    if(res.message&&Object.keys(res.message).length>0){
                        let objKeys = Object.keys(res.message);
                        let obj = {
//                            shipping:res.message.shipping,
                            order:res.order,
                            detail:res.detail[0]?res.detail[0]:''
                        };
                        objKeys.forEach(row=>{
                            obj[row] = res.message[row];
                        });
                        this.tableDataTitle = Object.keys(obj);
                        console.log(this.tableDataTitle,'tableDataTitle');
                        this.tableData.list.push(obj);
                        this.loading = false;
                        this.firstLoading = false
                    }else{
                        this.$message({type:'success',message:res.message||res});
                    }
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                    this.loading = false;
                    this.firstLoading = false
                })
            }
        },
        computed: {
            emptyText() {
                return this.firstLoading?'等待查询数据中...':'暂无数据'
            },
        },
        components:{
            searchName:require('./search-name.vue').default,
        }
    }
</script>
