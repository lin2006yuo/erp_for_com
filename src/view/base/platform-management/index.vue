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
                        @edit="edit"
                        @proportion="proportion"
                        @distribution="set_distribution">
            </data-table>
            <add-visable v-model="addEdit"
                         :judge="judge"
                         :is-amazon.sync="isAmazon"
                         :celect.sync="celect"
                         :title="title"
                         :add-edit-data="addEditData"
                         :row-id="rowId"
                         @add-keep="add_keep"
                         @refresh="init">
            </add-visable>
<!--             分配设置-->
            <!--<set-distribution  v-model="setDistributionVisible"-->
                               <!--:row-id="rowId">-->
            <!--</set-distribution>-->

            <!-- 分配设置2 -->
            <set-distribution2  v-model="setDistributionVisible"
                               :row-id="rowId">
            </set-distribution2>

        </page>
    </template>
    <style lang="stylus">

    </style>
    <script>
        import {
            api_get_channel,
            api_channel,
            api_post_channel,
            api_put_channel,
            api_get_channel_config,
            // api_put_config,
            api_delete_config
        } from '@/api/platform-management';
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
                    rowId:0,
                    total:0,
                    loading:false,
                    firstLoading: true,
                    addEditData:{},
                    systemList:{},
                    title:'',
                    addEdit:false,
                    isAmazon:false,
                    judge:true,
                    setProportionVisiable:false,
                    setDistributionVisible:false,
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
                        // delivery_deadline:'',
                        status:0,
                        duplication: false
                    };
                    this.addEdit = true;
                },
                add_keep(obj){
                    // Object.keys(this.addEditData).forEach(key=>{
                    //     if(typeof this.addEditData[key] === 'string'){
                    //         this.addEditData[key] = this.addEditData[key].trim();
                    //     }
                    // });
                    // let data = clone(this.addEditData);
                    let data=obj;
                    data.duplication = data.duplication ? 1 : 0;
                    if(this.addEditData.hasOwnProperty('id')){
                        this.$http(api_put_channel,this.addEditData.id,data).then(res=>{
                            res.data.status = !res.data.status;
                            let find = this.tableData.list.find(row=>row.id === this.addEditData.id);
                            if(!!find) Object.assign(find,res.data);
                            this.$message({type: 'success', message:res.message});
                            this.addEdit = false;
                            this.isAmazon=false;
                        }).catch(code=>{
                            this.$message({type:'error', message:code.message || code});
                        })
                        //     .finally(()=>{
                        //     setTimeout(() => {
                        //         this.$reqKey('addKeep', false);
                        //     }, 300)
                        // });
                    }else {
                        this.$http(api_post_channel,data).then(res=>{
                            this.$message({type:'success', message:res.message || res});
                            //已经重新调接口了这部分多余
                            // res.data.status = !res.data.status;
                            // this.tableData.list.unshift(res.data);
                            // this.total++;
                            // this.$message({type: 'success', message:res.message});
                            this.init();
                            this.addEdit = false;
                        }).catch(code=>{
                            this.$message({type:'error', message:code.message || code});
                        })
                        //     .finally(()=>{
                        //     setTimeout(() => {
                        //         this.$reqKey('addKeep', false);
                        //     }, 300)
                        // });
                    }
                }, 
                
                look_over(row){
                    this.judge = false;                   
                    this.isAmazon=row.id===2?true:false;
                    this.celect = '平台信息';
                    this.title = `查看：${row.title}${row.title.indexOf("平台")===-1?'平台':''}信息`;
                    // if(row.title.indexOf("平台")===-1){
                    //     this.title = `编辑：${row.title}平台信息`
                    // }else{
                    //     this.title = `编辑：${row.title}信息`
                    // }
                    this.$http(api_get_channel,row.id).then((res)=>{
                        this.addEditData={...res, duplication: res.duplication ? true : false};
                        if(!!row.update_time){
                            this.$set(this.addEditData,'update_time',row.update_time)
                        }
                        this.addEdit = true;
                    });
                },
                edit(row){
                    this.isAmazon=row.id===2?true:false;
                    this.judge = true;
                    this.celect = '平台信息';
                    this.rowId=row.id;
                    this.title = `编辑：${row.title}${row.title.indexOf("平台")===-1?'平台':''}信息`;
                    // if(row.title.indexOf("平台")===-1){
                    //     this.title = `编辑：${row.title}平台信息`
                    // }else{
                    //     this.title = `编辑：${row.title}信息`
                    // }
                    let statu = row.status ? 0 : 1;                    
                     this.$http(api_get_channel,row.id).then((res)=>{
                        this.addEditData={...res, duplication: res.duplication ? true : false};
                         if(!!row.create_time){
                             this.$set(this.addEditData,'create_time',row.create_time)
                         }
                         this.addEdit = true;
                    });
                },
                info(row){
                    this.isAmazon=row.id===2?true:false;
                    this.judge = true;
                    this.rowId=row.id;
                    // //获取平台参数信息
                    // this.get_channel_system_list(row);
                    this.title = `编辑：${row.title}${row.title.indexOf("平台")===-1?'平台':''}信息`;
                    // if(row.title.indexOf("平台")===-1){
                    //     this.title = `编辑：${row.title}平台信息`
                    // }
                    // else{
                    //     this.title = `编辑：${row.title}信息`
                    // }
                    this.celect = '平台参数';
                    let statu = row.status ? 0 : 1;
                    this.$http(api_get_channel,row.id).then((res)=>{
                        this.addEditData = {...res, duplication: res.duplication ? true : false};
                        this.addEdit = true;
                    });
                },
                proportion(row){
                    if(row.title.indexOf("平台")===-1){
                        this.title = `${row.title}平台产品分配占比设置`;
                    }
                    else{
                        this.title = `${row.title}产品分配占比设置`;
                    }
                    this.setProportionVisiable=true;          
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
                //分配设置
                set_distribution(row){
                    this.rowId=row.id;
                    this.setDistributionVisible=true;
                }
            },
            components:{
                cardSearch:require('./card-search.vue').default,
                dataTable:require('./data-table.vue').default,
                addVisable:require('./add-visable.vue').default,
                setDistribution2:require('./set-distribution2').default
            }
        }
    </script>
