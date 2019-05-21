<template>
        <page class="p-index">
            <card-search class="mb-xs"
                         :clears="clears"
                         :search-data="searchData"
                         @change-select="change_select"
                         @key-word="key_word"
                         @search="search"></card-search>
            <!--<el-button class="ml-sm mb-xs"-->
                       <!--size="mini"-->
                       <!--type="primary"-->
                       <!--@click="add_form">添加</el-button>-->
            <el-button size="mini"
                       :disabled="selectData.length <= 0"
                       @click.native="batchSetup"
                       type="primary"
                       class="mt-xs mb-xs">批量设置</el-button>
            <data-table :loading="loading"
                        :table-data="tableData"
                        :first-loading="firstLoading"
                        @look-over="look_over"
                        @sort-change="sort_change"
                        @edit="edit"
                        @log-form="log_form"
                        @add-accredit="add_accredit"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :total="total"
                        @selection-change="selectionChange"></data-table>
            <log-record
                v-model="logDialog"
                :log-data="logForm"
                :title="title"
            ></log-record>
            <add-form
                    v-model="addFormcon"
                    :title="title"
                    :addedit="addedit"
                    :add-edit-data="addEditData"
                    @add-vova="add_vova"></add-form>
            <add-accredit
                    v-model="authorizaTion"
                    :title="title"
                    :indent-impower="indentImpower"
                    @add-impower="add_impower"></add-accredit>
            <edit-batch v-model="settingUp"
                        :batch-title="batchTitle"
                        :batch-data="batchData"
                        @set-clich="setClich"></edit-batch>
        </page>
    </template>
    <style lang="stylus">

    </style>
    <script>
        import {api_vova_account,
            api_add_vova_account,
            api_put_vova_account,
            api_get_vova_account,
            api_token_vova_account,
            api_vova_account_log,
            api_vova_post_batch_set,
            api_token_vova} from '@/api/vova-account';
        export default{
            data(){
                return{
                    searchData:{
                        status:'',
                        site_status:'',         //账号状态
                        time_type:'register',   //时间类型
                        start_time:'', //开始时间
                        end_time:'',	//截止时间
                        seller_id:'', //销售员id
                        customer_id:'',//客服id
                        authorization:'',
                        snType:'code',
                        snText:'',
                        taskName:'download_listing',
                        taskCondition:'eq',
                        taskTime:'',
                    },
                    clears:{
                        site_status:'',         //账号状态
                        time_type:'register',   //时间类型
                        start_time:'', //开始时间
                        end_time:'',	//截止时间
                        seller_id:'', //销售员id
                        customer_id:'',//客服id
                        snType:'account_name',
                        taskName:'download_listing',
                        taskCondition:'eq',
                    },
                    tableData:{
                        list:[],
                        page:1,
                        pageSize:20,
                    },
                    total:0,
                    loading:false,
                    firstLoading:true,
                    addFormcon:false,
                    addedit:false,
                    title:'',
                    addEditData:{
                        id:0,
                        code:'',
                        account_name:'',
                        download_order:'',
                        sync_delivery:'',
                        download_listing:'',
                    },
                    authorizaTion:false,
                    indentImpower:{
                        id:'',
                        access_key_id:'',
                        secret_key:'',
                        // merchant_id:'',
                        // jinhua_id:'',
                        // nanjing_id:'',
                    },
                    sort_type:'',
                    sort_val:'',
                    selectData:[],
                    logForm:[],
                    logDialog:false,
                    settingUp:false,
                    batchTitle:'',
                    batchData:{
                        is_invalid:'',
                        site_status:'',
                        download_order:'',
                        sync_delivery:'',
                        download_listing:'',
                    }
                }
            },
            refresh(){
                this.init();
            },
            methods:{
                change_select(){
                    this.init();
                },
                search(){
                    this.init();
                },
                init(){
                    let params = window.clone(this.searchData);
                    this.sort_type && (this.$set(params,'sort_type', this.sort_type));
                    this.sort_val && (this.$set(params,'sort_val',this.sort_val));
                    params.start_time?params.start_time = datef('YYYY-MM-dd', params.start_time / 1000):'';
                    params.end_time?params.end_time = datef('YYYY-MM-dd', params.end_time / 1000):'';
                    this.loading = true;
                    this.$set(params,'page',this.tableData.page);
                    this.$set(params,'pageSize',this.tableData.pageSize);
                    this.$http(api_vova_account,params).then(res=>{
                        res.data.forEach(res=>{
                            res.status = res.status === 1;
                        });
                        this.loading = false;
                        this.firstLoading = false;
                        this.tableData.list = res.data;
                        this.total = res.count;
                    }).catch(code=>{
                        this.$message({type: 'error', message: code.message||code,});
                    })
                },
                key_word(){
                    this.searchData.snText = this.searchData.snText.replace(/\s*/g,'')
                },
                add_form(){//---添加
                    this.addEditData={
                        id:0,
                        code:'',
                        account_name:'',
                        download_order:0,
                        sync_delivery:0,
                        download_listing:0,
                    }
                    this.addFormcon = true;
                    this.title = '添加账号';
                    this.addedit = true;
                },
                log_form(row){   //-日志
                    this.$http(api_vova_account_log,row.id).then(res => {
                        this.title=`账号简称:${row.account_name}的操作日志`;
                        this.logDialog=true;
                        this.logForm=res
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message||code,
                        });
                    });
                },
                add_vova(){
                    Object.keys(this.addEditData).forEach(key=>{
                        if(typeof this.addEditData[key] === 'string'){
                            this.addEditData[key] = this.addEditData[key].trim();
                        }
                    });
                    if(this.addEditData.id != 0){//更新
                        this.$http(api_put_vova_account,this.addEditData).then(res=>{
                            this.addFormcon = false;
                            let find = this.tableData.list.find(row=> Number(row.id)===Number(res.id));
                            if(!!find) Object.assign(res.data,find);
                            this.init();
                        }).catch(code=>{
                            this.$message({type: 'error', message: code.message||code,});
                        }).finally(()=>{
                            setTimeout(() => {
                                this.$reqKey('addFormvova',false);
                            }, 300)
                        })
                    }else{//------添加
                        this.$http(api_add_vova_account,this.addEditData).then(res=>{
                            res.data.status = res.data.status === 1;
                            this.addFormcon = false;
                            this.$message({type:'success',message: res.message});
                            this.tableData.list.unshift(res.data);
                            this.total ++;
                        }).catch(code=>{
                            this.$message({
                                type: 'error',
                                message: code.message||code,
                            });
                        }).finally(()=>{
                            setTimeout(() => {
                                this.$reqKey('addFormvova',false);
                            }, 300)
                        })
                    }
                },
                selectionChange(val){
                    this.selectData = val.map(row=>{
                        return row.id
                    });
                },
                batchSetup(){
                    this.settingUp = true;
                    this.batchData={
                        status:'',
                        site_status:'',
                        download_order:'',
                        sync_delivery:'',
                        download_listing:'',
                    };
                    this.batchTitle = "批量设置";
                },
                setClich(val){
                    val.status!==''&&( val.status = val.status ? 1 : 0);
                    let params = val;
                    this.$set(params,'id',this.selectData.join(','));
                    this.$http(api_vova_post_batch_set,params).then(res=>{
                        this.settingUp = false;
                        this.init();
                        this.$message({type:'success',message: res.message});
                    }).catch(code => {
                        this.$message({type:'error',message:code.message||code});
                    }).finally(()=>{
                        setTimeout(() => {
                            this.$reqKey('downloadAdd',false);
                        }, 300)
                    })
                },
                look_over(row){//---查看
                    this.title=`查看：${row.account_name}账号信息`;
                    this.addedit = false;
                    this.addFormcon = true;
                    let url = api_get_vova_account;
                    this.get_form_data(url,row.id);
                },
                edit(row){//---编辑
                    this.title=`编辑：${row.account_name}账号信息`;
                    this.addedit = true;
                    this.addFormcon = true;
                    let url = api_get_vova_account;
                    this.get_form_data(url,row.id);
                },
                get_form_data(url,id){
                    this.$http(url,id).then(res=>{
                        this.addEditData = res;
                    }).catch(code=>{
                        console.log('code',code)
                    }).finally(()=>{
                        this.$reqKey('addFormvova',false);
                    })
                },
                add_accredit(row){//---授权
                    this.title=`给账号：${row.account_name}授权`;
                    this.authorizaTion = true;
                    this.$http(api_token_vova_account,row.id).then(res=>{
                        Object.assign(this.indentImpower,res);
                    })
                },
                add_impower(){
                    Object.keys(this.indentImpower).forEach(key=>{
                        if(typeof this.indentImpower[key] === 'string'){
                            this.indentImpower[key] = this.indentImpower[key].trim();
                        }
                    });
                    this.$http(api_token_vova,this.indentImpower).then(res=>{
                        this.authorizaTion = false;
                        this.$message({type:'success',message:res.message});
                        this.init();
                        if(!!find) Object.assign(res.data,find);
                    }).catch(code=>{
                        this.$message({type: 'error', message: code.message||code,});
                    }).finally(()=>{
                        setTimeout(() => {
                            this.$reqKey('addVova',false);
                        }, 300)
                    })
                },
                sort_change(){//---排序
                    if (val.column instanceof Object) {
                        let sort_label = val.column.label;
                        switch (sort_label) {
                            case "简称":
                                this.sort_type = "code";
                                break;
                            case "帐号名称":
                                this.sort_type = "account_name";
                                break;
                        }
                        this.sort_val = val.order === "descending" ? "2" : "1";
                        this.init();
                    }
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
                cardSearch: require('./card-search.vue').default,
                dataTable:require('./data-table.vue').default,
                addForm: require('./add-form.vue').default,
                addAccredit: require('./add-accredit.vue').default,
                editBatch:require('./edit-batch').default,
                logRecord:require('../look-log.vue').default,
            }
        }
    </script>
