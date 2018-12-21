<template>
        <page class="p-index">
            <card-search class="mb-xs"
                         :clears="clears"
                         :search-data="searchData"
                         @change-select="change_select"
                         @key-word="key_word"
                         @search="search"></card-search>
            <el-button class="ml-sm mb-xs"
                       size="mini"
                       type="primary"
                       @click="add_form">添加</el-button>
            <el-button size="mini"
                       :disabled="selectData.length <= 0"
                       @click.native="batchSetup"
                       type="primary"
                       class="ml-sm">批量设置</el-button>
            <data-table :loading="loading"
                        :table-data="tableData"
                        :first-loading="firstLoading"
                        @look-over="look_over"
                        @sort-change="sort_change"
                        @edit="edit"
                        @add-accredit="add_accredit"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :total="total"
                        @selection-change="selectionChange"></data-table>
            <add-form
                    v-model="addFormcon"
                    :title="title"
                    :addedit="addedit"
                    :add-edit-data="addEditData"
                    @add-zoodmall="add_zoodmall"></add-form>
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
        import {api_zoodmall_account,
            api_add_zoodmall_account,
            api_put_zoodmall_account,
            api_get_zoodmall_account,
            api_token_zoodmall_account,
            api_token_zoodmall,
            api_zoodmall_post_batch_set} from '@/api/zoodmall-account';
        export default{
            page:{
                devinfo:{
                    frontEnd:'汤敏',
                    backEnd:'蓝术术',
                    createTime:'2018-8-30',
                    updateTime:'2018-8-30'
                }
            },
            data(){
                return{
                    searchData:{
                        status:'',
                        authorization:'',
                        snType:'code',
                        snText:'',
                        taskName:'download_listing',
                        taskCondition:'eq',
                        taskTime:'',
                    },
                    clears:{
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
                    firstLoading: true,
                    addFormcon:false,
                    addedit:false,
                    title:'',
                    addEditData:{
                        id:0,
                        code:'',
                        acccount_name:'',
                        download_order:0,
                        sync_delivery:0,
                        download_listing:0,
                    },
                    authorizaTion:false,
                    indentImpower:{
                        id:'',
                        client_id:'',
                        client_secret:'',
                    },
                    sort_type:'',
                    sort_val:'',
                    selectData:[],
                    settingUp:false,
                    batchTitle:'',
                    batchData:{
                        is_invalid:1,
                        download_order:0,
                        sync_delivery:0,
                        download_listing:0,
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
                    this.loading = true;
                    this.$set(params,'page',this.tableData.page);
                    this.$set(params,'pageSize',this.tableData.pageSize);
                    this.$http(api_zoodmall_account,params).then(res=>{
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
                add_form(){//---添加
                    this.addFormcon = true;
                    this.title = '添加账号';
                    this.addedit = true;
                },
                add_zoodmall(){
                    Object.keys(this.addEditData).forEach(key=>{
                        if(typeof this.addEditData[key] === 'string'){
                            this.addEditData[key] = this.addEditData[key].trim();
                        }
                    });
                    if(this.addEditData.id != 0){//更新
                        this.$http(api_put_zoodmall_account,this.addEditData).then(res=>{
                            this.addFormcon = false;
                            let find = this.tableData.list.find(row=> Number(row.id)===Number(res.id));
                            if(!!find) Object.assign(res.data,find);
                            this.init();
                        }).catch(code=>{
                            this.$message({type: 'error', message: code.message||code,});
                        }).finally(()=>{
                            setTimeout(() => {
                                this.$reqKey('addFormzoodmall',false);
                            }, 300)
                        })
                    }else{//------添加
                        this.$http(api_add_zoodmall_account,this.addEditData).then(res=>{
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
                                this.$reqKey('addFormzoodmall',false);
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
                    this.batchTitle = "批量设置";
                },
                setClich(val){
                    val.is_invalid = val.is_invalid ? 1 : 0;
                    let params = val;
                    this.$set(params,'id',this.selectData.join(','));
                    this.$http(api_zoodmall_post_batch_set,params).then(res=>{
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
                key_word(){
                    this.searchData.snText = this.searchData.snText.replace(/\s*/g,'')
                },
                sort_change(val){//---排序
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
                look_over(row){//---查看
                    this.title=`查看：${row.account_name}账号信息`;
                    this.addedit = false;
                    this.addFormcon = true;
                    let url = api_get_zoodmall_account;
                    this.get_form_data(url,row.id);
                },
                edit(row){//---编辑
                    this.title=`编辑：${row.account_name}账号信息`;
                    this.addedit = true;
                    this.addFormcon = true;
                    let url = api_get_zoodmall_account;
                    this.get_form_data(url,row.id);
                },
                get_form_data(url,id){
                    this.$http(url,id).then(res=>{
                        this.addEditData = res;
                    }).catch(code=>{
                        console.log('code',code)
                    }).finally(()=>{
                        this.$reqKey('addFormzoodmall',false);
                    })
                },
                add_accredit(row){//---授权
                    this.title=`给账号：${row.account_name}授权`;
                    this.authorizaTion = true;
                    this.$http(api_token_zoodmall_account,row.id).then(res=>{
                        this.indentImpower= {
                            id:res.id,
                            client_id:res.client_id,
                            client_secret:res.client_secret,
                        }
                    })
                },
                add_impower(){
                    Object.keys(this.indentImpower).forEach(key=>{
                        if(typeof this.indentImpower[key] === 'string'){
                            this.indentImpower[key] = this.indentImpower[key].trim();
                        }
                    });
                    this.$http(api_token_zoodmall,this.indentImpower).then(res=>{
                        this.$message({type:'success', message:res.message});
                        this.init();
                        this.authorizaTion = false;
                    }).catch(code=>{
                        this.$message({type: 'error', message: code.message||code,});
                    }).finally(()=>{
                        setTimeout(() => {
                            this.$reqKey('addObtain',false);
                        }, 300)
                    })
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
                dataTable:require('./data-table.vue').default,
                cardSearch: require('./card-search.vue').default,
                addForm: require('./add-form.vue').default,
                addAccredit:require('./add-accredit.vue').default,
                editBatch:require('./edit-batch').default
            }
        }
    </script>