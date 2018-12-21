<template>
        <page class="p-index">
            <card-search class="mb-xs"
                         @search="search"
                         @select="select"
                         :clears="clears"
                         :search-data="searchData">
            </card-search>
            <el-button class="ml-sm mb-xs"
                       size="mini"
                       @click.native="keep"
                       type="primary">添加</el-button>
            <data-table :table-data="tableData"
                        :loading="loading"
                        :first-loading="firstLoading"
                        @current-change="handleCurrentChange"
                        @size-change="handleSizeChange"
                        :total="total"
                        @look-over="look_over"
                        @info="info"
                        @edit="edit">
            </data-table>
            <add-visable v-model="addEdit"
                         :judge="judge"
                         :celect.sync="celect"
                         :title="title"
                         :add-edit-data="addEditData"
                         @add-keep="add_keep">
            </add-visable>
        </page>
    </template>
    <style lang="stylus">

    </style>
    <script>
        import {api_channel,api_post_channel,api_put_channel} from '@/api/platform-management';
        export default{
            page:{
                devinfo:{
                    frontEnd:'汤敏',
                    backEnd:'何程',
                    createTime:'2018-9-12',
                    updateTime:'2018-9-14'
                }
            },
            data(){
                return{
                    searchData:{
                        status:'',
                        channelName:'',
                    },
                    clears:{
                        status:'',
                        channelName:''
                    },
                    tableData:{
                        list:[],
                        page:1,
                        pageSize:20,
                    },
                    total:0,
                    loading:false,
                    firstLoading: true,
                    addEditData:{},
                    title:'',
                    addEdit:false,
                    judge:true,
                    celect:'',
                }
            },

            refresh(){
                this.init();
            },
            methods:{
                search(){
                    this.init();
                },
                select(){
                    this.init();
                },
                init(){
                    let parmes = clone(this.searchData);
                    this.$set(parmes,'page',this.tableData.page);
                    this.$set(parmes,'pageSize',this.tableData.pageSize);
                    this.loading = true;
                    this.$http(api_channel,parmes).then(res=>{
                        res.data.forEach(row=>{
                           row.status =!row.status
                        });
                        this.total = res.count;
                        this.tableData.list = res.data;
                        this.loading = false;
                        this.firstLoading = false
                    });
                },
                keep(){
                    this.judge = true;
                    this.celect = '平台信息';
                    this.title='添加账号';
                    this.addEditData={
                        title:'',
                        name:'',
                        is_site:'',
                        delivery_deadline:'',
                        status:0,
                    },
                    this.addEdit = true;
                },
                add_keep(){
                    Object.keys(this.addEditData).forEach(key=>{
                        if(typeof this.addEditData[key] === 'string'){
                            this.addEditData[key] = this.addEditData[key].trim();
                        }
                    });
                    let data = clone(this.addEditData);
                    if(this.addEditData.hasOwnProperty('id')){
                        this.$http(api_put_channel,this.addEditData.id,data).then(res=>{
                            res.data.status = !res.data.status;
                            let find = this.tableData.list.find(row=>row.id === this.addEditData.id);
                            if(!!find) Object.assign(find,res.data);
                            this.$message({type: 'success', message:res.message});
                            this.addEdit = false;
                        }).catch(code=>{
                            this.$message({type:'error', message:code.message || code});
                        }).finally(()=>{
                            setTimeout(() => {
                                this.$reqKey('addKeep', false);
                            }, 300)
                        });
                    }else {
                        this.$http(api_post_channel,data).then(res=>{
                            this.$message({type:'success', message:res.message || res});
                            res.data.status = !res.data.status;
                            this.tableData.list.unshift(res.data);
                            this.total++;
                            this.$message({type: 'success', message:res.message});
                            this.init();
                            this.addEdit = false;
                        }).catch(code=>{
                            this.$message({type:'error', message:code.message || code});
                        }).finally(()=>{
                            setTimeout(() => {
                                this.$reqKey('addKeep', false);
                            }, 300)
                        });
                    }

                },
                look_over(row){
                    this.judge = false;
                    this.celect = '平台信息';
                    this.title = `查看：${row.title}平台信息`;
                    this.addEditData={
                        id:row.id,
                        title:row.title,
                        name:row.name,
                        is_site:row.is_site,
                        delivery_deadline:row.delivery_deadline,
                        status:row.status,
                        change_status:row.status?'启用':'停用',
                    };
                    if(!!row.update_time){
                        this.$set(this.addEditData,'update_time',row.update_time)
                    }
                    this.addEdit = true;
                },
                edit(row){
                    this.judge = true;
                    this.celect = '平台信息';
                    this.title = `编辑：${row.title}平台信息`;
                    let statu = row.status ? 0 : 1;
                    this.addEditData={
                        id:row.id,
                        title:row.title,
                        name:row.name,
                        is_site:row.is_site,
                        delivery_deadline:row.delivery_deadline,
                        status:statu,
                    };
                    if(!!row.create_time){
                        this.$set(this.addEditData,'create_time',row.create_time)
                    }
                    this.addEdit = true;
                },
                info(row){
                    this.addEdit = true;
                    this.judge = true;
                    this.title = `编辑：${row.title}平台信息`;
                    this.celect = '平台参数';
                    let statu = row.status ? 0 : 1;
                    this.addEditData={
                        id:row.id,
                        title:row.title,
                        name:row.name,
                        is_site:row.is_site,
                        delivery_deadline:row.delivery_deadline,
                        status:statu,
                    };
                },
                handleSizeChange(val) {//------------分页
                    this.tableData.page = 1;
                    this.tableData.pageSize = val;
                    this.init();
                },
                handleCurrentChange(val) {//------------分页
                    this.tableData.page = val;
                    this.init();
                },
            },
            components:{
                cardSearch:require('./card-search.vue').default,
                dataTable:require('./data-table.vue').default,
                addVisable:require('./add-visable.vue').default,
            }
        }
    </script>
