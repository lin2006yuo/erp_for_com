<template>
    <page class="c-demand-schedules-index">
        <card-search @search="search" :type-list="typeList" :status-list="statusList" :btn-val="btnVal" :form="searchData" :clears="clears"></card-search>
        <div class="mt-sm">
            <permission class="ml-sm inline"
                        tag="request-button"
                        type="primary"
                        size="mini"
                        req-key="url_internal_letters_delete_received_letters"
                        :mintime="200"
                        :route="apis.url_internal_letters_delete_received_letters"
                        @click="batch_del">批量删除
            </permission>
            <permission class="ml-sm inline"
                        tag="request-button"
                        req-key="url_put_internal_letters_read"
                        :mintime="200"
                        :route="apis.url_put_internal_letters_read"
                        @click="allRead">批量标记已读
            </permission>
        </div>
        <table-module class="mt-sm"
                      :type-list="typeList"
                      :loading="loading"
                      :first-loading="firstLoading"
                      @selection-change="selection_change"
                      @mark-read="mark_read"
                      :table-data="tableData"></table-module>
        <el-pagination
            class="page-fixed"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[20, 50, 100, 200,500]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </page>
</template>
<style lang="stylus">
    .c-demand-schedules-index{
        .el-dropdown .el-button-group {
            display: inline-block;
            position: relative;
            top: 1px;
        }
    }
</style>
<script>
    import {
        api_get_internal_letter_get_all_type,
        api_get_internal_letter_pull_received_letters,
        url_put_internal_letters_read,
        api_put_internal_letters_read,
        api_internal_letters_delete_received_letters,
        url_internal_letters_delete_received_letters
    } from '../../../api/system-notice-inbox'
    export default {
        page:{
            devinfo:{
                frontEnd:'覃宏峰',
                backEnd:'邓海波',
                createTime:'2018-8-22',
                updateTime:'2018-8-31'
            }
        },
        data() {
            return {
                firstLoading:true,
                loading:false,
                btnVal:{
                    read:''
                },
                searchData:{
                    type:'',
                    send_id:'',
                    snText:'',
                    btime:'',
                    etime:''
                },
                clears:{
                    type:'',
                    // read:'',
                    send_id:'',
                    snText:'',
                    btime:'',
                    etime:''
                },
                typeList:[],
                page:1,
                pageSize:20,
                total:0,
                tableData:[],
                ids:[],
                statusList:[
                    {label:'全部',value:'',count:0},
                    {label:'未读',value:0,count:0},
                    {label:'已读',value:1,count:0}
                ],
            }
        },
        permission:{
            url_internal_letters_delete_received_letters,
            url_put_internal_letters_read
        },
        refresh(){
            this.init();
        },
        mounted(){
            this.get_mes_type();
            this.init();
        },
        methods:{
            mark_read(){
                this.statusList.forEach(row=>{
                    if(row.value===0){
                        row.count -= 1;
                    }
                    if(row.value===1){
                        row.count += 1;
                    }
                });
                let length = this.statusList.filter(row=>row.value===0).length;
                sessionStorage.setItem('messageCount',length);
            },
            get_mes_type(){
                this.$http(api_get_internal_letter_get_all_type).then(res=>{
                    this.typeList = [{label:'全部',value:''},...res];
                }).catch(code=>{
                    console.log(code);
                });
            },
            init_params(){
                let data = window.clone(this.searchData);
                if(!!data.btime){
                    data.btime = datef('YYYY-MM-dd', this.searchData.btime.getTime()/1000);
                }else{
                    delete data.btime;
                }
                if(!!data.etime){
                    data.etime = datef('YYYY-MM-dd', this.searchData.etime.getTime()/1000);
                }else{
                    delete data.etime;
                }
                if(data.snText.trim()){
                    data.snText.trim();
                }else{
                    delete data.snText;
                }
                data.type===''&&delete data.type;
                this.btnVal.read!==''&&(data.read = this.btnVal.read);
                data.send_id===''&&delete data.send_id;
                data.page = this.page;
                data.pageSize = this.pageSize;
                return data
            },
            init(){
                let data = this.init_params();
                this.loading = true;
                this.$http(api_get_internal_letter_pull_received_letters,data).then(res=>{
                    this.tableData = res.data;
                    this.total = res.count;
                    this.loading = false;
                    this.firstLoading = false;
                    this.statusList.forEach(row=>{
                        row.value===''&&(row.count = res.inbox_count);
                        row.value===0&&(row.count = res.unread);
                        row.value===1&&(row.count = res.inbox_count-res.unread);
                    });
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                })
            },
            search(){
                this.init()
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.init()
            },
            handleCurrentChange(val) {
                this.page = val;
                this.init();
            },
            selection_change(selects){
                this.ids = selects.map(row=>row.letter_text_id);
            },
            batch_del(){
                if(this.ids.length===0){
                    this.$reqKey('url_internal_letters_delete_received_letters',false);
                    return this.$message({type:'warning',message:'请选择要操作的数据！'});
                }
                this.$confirm(`您将删除已勾选的数据，确定进行此操作?`,'提示',{
                    confirmButtonText:"确定",
                    cancelButtonText:"取消",
                    type:"warning"
                }).then(()=> {
                    this.delete_data(this.ids);
                }).catch(() => {
                    this.$reqKey('url_internal_letters_delete_received_letters',false);
                    this.$message({
                        type: "info",
                        message: "已取消"
                    })
                });
            },
            delete_data(ids){
                this.$http(api_internal_letters_delete_received_letters,{letter_ids:ids}).then(res=>{
                    ids.forEach(id=>{
                        let delIndex = this.tableData.findIndex(row=>row.letter_text_id===id);
                        if(delIndex>=0){
                            this.statusList.forEach(row=>{
                                row.value===''&&(row.count -=1 );
                                this.tableData[delIndex].read===row.value&&(row.count -= 1);
                                this.tableData[delIndex].read===row.value&&(row.count -= 1);
                            });
                            this.tableData.splice(delIndex,1);
                            this.total -=1;
                        }
                    });
                    this.ids = [];
                    this.$message({type:'success',message:res.message||res});
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('url_internal_letters_delete_received_letters',false);
                    },200);
                });
            },
            allRead(){
                if(this.ids.length===0){
                    this.$reqKey('url_put_internal_letters_read',false);
                    return this.$message({type:'warning',message:'请选择要操作的数据！'});
                }
                let data = {
                    letter_ids:this.ids
                };
                this.$http(api_put_internal_letters_read,data).then(res=>{
                    this.$message({type:'success',message:res.message||res});
                    data.letter_ids.forEach(id=>{
                        let findIndex = -1;
                        let find = this.tableData.find((row,index)=>{
                            if(row.letter_text_id===id){
                                findIndex = index;
                                return true
                            }
                        });
                        if(!!find){
                            if(this.btnVal.read===0){
                                this.tableData.splice(findIndex,1);
                            }else{
                                find.read = 1;
                            }
                            this.statusList.forEach(row=>{
                                row.value===0&&(row.count -= 1);
                                row.value===1&&(row.count += 1);
                            });
                        }
                    });
                    this.ids = [];
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('url_put_internal_letters_read',false);
                    },200);
                });
            },
        },
        components: {
            cardSearch:require('./card-search').default,
            tableModule:require('./table-module').default
        }
    }
</script>
