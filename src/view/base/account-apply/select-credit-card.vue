<template>
    <page-dialog :title="lastCardTitle"
                 v-model="show"
                 width="70%"
                 @change="open_dialog">
        <el-row class="mb-xs mt-xs ml-sm">
            <label-item label="信用卡卡号：" >
                <el-input v-model.trim="searchData.snText" class="width-super"></el-input>
            </label-item>
            <el-button size="mini" type="primary"
                       @click.native="get_table_list">搜索
            </el-button>
        </el-row>
        <el-table :data="tableData"
                  v-loading="loading"
                  highlight-current-row
                  element-loading-text="玩命加载中"
                  empty-text="暂无数据"
                  @row-click="row_click">
            <el-table-column label="单选"
                             width="70">
                <template slot-scope="scope">
                    <el-radio class="radio" v-model="singleCheck"
                              :label="scope.row.id"
                              @change.native="change(scope.row)">&nbsp
                    </el-radio>
                </template>
            </el-table-column>
            <el-table-column label="信用卡" prop="card_number">
            </el-table-column>
            <el-table-column label="卡主姓名" prop="card_master">
            </el-table-column>
            <el-table-column label="银行" prop="bank">
            </el-table-column>
            <el-table-column label="信用卡类别" prop="card_category">
            </el-table-column>
            <el-table-column label="被绑定账号数" >
                <template slot-scope="scope">
                    <span :class="[scope.row.account_count?'operate':'disabled']"
                          @click="look_detail(scope.row)">
                        {{scope.row.account_count}}
                    </span>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                class="mt-sm"
                style="float: right"
                @size-change="size_change"
                @current-change="page_change"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
        <el-row slot="footer" class="dialog-footer">
            <el-button size="mini"
                       type="primary"
                       @click.native="submit">确 定
            </el-button>
            <el-button size="mini" @click.native="show=false">关 闭
            </el-button>
        </el-row>
        <page-dialog v-model="accountDetailShow"
                     width="70%"
                     :title="`查看当前信用卡：${accountTitle}的绑定账号详情`">
            <el-table :data="accountData"
                      highlightCurrentRow>
                <el-table-column label="平台" prop="channel"></el-table-column>
                <el-table-column label="站点" prop="site_code"></el-table-column>
                <el-table-column label="账号简称" prop="account_name"></el-table-column>
                <el-table-column label="公司名称" prop="company"></el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click.native="accountDetailShow=false">关  闭</el-button>
            </div>
        </page-dialog>
    </page-dialog>
</template>

<script>
    import {api_get_credit_card_info,api_get_current_credit_card_detail} from '@/api/account-apply';
    export default {
        name: "select-credit-card",
        data() {
            return {
                show:this.value,
                searchData:{
                    snType:'card_number',
                    snText:'',
                    page:1,
                    pageSize:20,
                },
                total:0,
                tableData:[],
                loading:false,
                singleCheck:'',
                obj:{},
                accountDetailShow:false,
                accountTitle:'',
                accountData:[],
                lastCardTitle:'',
            }
        },
        watch:{
            show(val){
                this.$emit('input',val);
            },
            value(val){
                this.show=val;
            }
        },
        methods: {
            open_dialog(is_open){
                if(is_open){
                    console.log(this.titleCredit)
                    if(this.titleCredit!==''){
                        this.lastCardTitle=this.titleCredit
                    }else{
                        this.lastCardTitle='选择信用卡'
                    }
                    this.searchData={
                        snType:'card_number',
                        snText:'',
                        page:1,
                        pageSize:20,
                    };
                    this.total=0;
                    this.obj={};
                    this.singleCheck='';
                    this.get_table_list();
                    this.accountDetailShow=false;
                    this.accountTitle='';
                    this.accountData=[];
                }
            },
            get_table_list(){
                this.loading=true;
                this.$http(api_get_credit_card_info,this.searchData).then(res=>{
                    this.tableData=res.data;
                    this.total=res.count;
                    this.loading=false;
                }).catch( error =>{
                    this.loading=false;
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            change(row){
                this.singleCheck=row.id;
                this.obj=row;
            },
            row_click(row,event, column){
                this.change(row);
            },
            look_detail(row){
                if(!row.account_count)return;
                this.$http(api_get_current_credit_card_detail,row.id).then(res=>{
                    this.accountTitle=row.card_number;
                    this.accountData=res;
                    this.accountDetailShow=true;
                }).catch( error =>{
                    error&&this.$message({type:'error', message:error.message||error});
                });
            },
            size_change(size){
                this.$set(this.searchData,'pageSize',size);
                this.get_table_list();
            },
            page_change(page){
                this.$set(this.searchData,'page',page);
                this.get_table_list();
            },
            submit(){
                if(!this.singleCheck)return this.$message({type:'warning',message:'请先选择信用卡'});
                this.$emit('export-credit-card',this.obj);
            }
        },
        props: {
            value:Boolean,
            titleCredit:String
        },
        components: {
            labelItem:require('@/components/label-item.vue').default,
        },
    }
</script>
