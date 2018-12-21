<template>
    <page class="p-index">
        <card-search
            class="mb-xs"
            :clears="clears"
            :search-data="searchData"
            :site-list="siteList"
            @change-select="change_select"
            @key-word="key_word"
            @change-taskName="change_taskName"
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
        <data-table
            :loading="loading"
            :walmartList="walmartList"
            :first-loading="firstLoading"
            @look-over="look_over"
            @edit="edit_row"
            @add-accredit="add_accredit"
            @sort-change="sort_change"
            @current-change="handleCurrentChange"
            @selection-change="selectionChange"
            @size-change="handleSizeChange"></data-table>
        <el-pagination
            class="page-fixed"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page=walmartList.page
            :page-sizes="[20,50,100,200,500]"
            :page-size=walmartList.pageSize
            layout="total, sizes, prev, pager, next, jumper"
            :total=walmartList.total>
        </el-pagination>
        <add-form
            v-model="addEditwalmart"
            :add-edit-site-list="addEditSiteList"
            :title="title"
            :edit="edit"
            :add-edit-data="addEditData"
            @add-walmart="add_walmart"></add-form>
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
    import {
        api_token_walmart,
    	api_walmart_account,
        api_add_walmart_account,
        api_get_walmart_account,
        api_put_walmart_account,
        api_token_walmart_account,
        api_walmart_post_batch_set} from '../../../../api/walmart-account';
    import {api_walmart_site} from '../../../../api/walmart-account';
    export default{
        page:{
            devinfo:{
                frontEnd:'汤敏',
                backEnd:'李佰敏',
                createTime:'2018-6-15',
                updateTime:'2018-6-16'
            }
        },
        data(){
            return {
                firstLoading: true,
                searchData:{
                    authorization:"",
                    snType:'account_name',
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
                addEditwalmart:false,
                title:'',
                edit:true,
                loading:true,
                walmartList:{
                    list:[],
                    page:1,
                    pageSize:20,
                    total:0,
                },
                addEditData:{
                    code:'',
                    site:'',
                    acccount_name:'',
                    download_order:0,
                    sync_delivery:0,
                    download_listing:0
                },
                authorizaTion:false,
                indentImpower:{
                    id:'',
                    email:'',
                    client_id:'',
                    client_secret:'',
                    password:'',
                    account_name:'',
                },
                commodityImpower:{
                    id:'',
                    client_id_cat:'',
                    client_secret_cat:'',
                    account_name:'',
                },
                sort_type:'',
                sort_val:'',
                siteList:[],
                addEditSiteList:[],
                settingUp: false,//批量设置弹框开关
                batchTitle: '',//批量设置弹框标题
                batchData:{},//批量设置弹框数据
                selectData:[],//被选中列表
            }
        },
        refresh(){
            this.init();
        },
        methods:{
            selectionChange(val){
                this.selectData = val.map(row=>{
                    return row.id
                });
            },
            batchSetup(){
                this.settingUp = true;
                this.batchTitle = "批量设置";
                this.batchData = {
                    // is_invalid:1,
                    is_stop:false,
                    is_start:false,
                    download_order:'',
                    sync_delivery:'',
                    download_listing:'',
                }
            },
            setClich(val){
                if(val.is_stop === false&&val.is_start === false&&val.download_order === ''&&val.sync_delivery===''&&val.download_listing === ''){
                    this.$message({type: 'warning',message: '请至少修改一项数据'});
                    this.$reqKey('downloadAdd',false);
                }else{
                    this.settingUp = false;
                    let params = {};
                    if(val.is_stop === true){
                        this.$set(params,'is_invalid',0)
                    }else if(val.is_start === true){
                        this.$set(params,'is_invalid',1)
                    }
                    for(let key in val){
                        if(key !== 'is_stop'&&key !== 'is_start'&&val[key] !== ''){
                            this.$set(params,key,val[key])
                        }
                    }
                    this.$set(params,'ids',this.selectData.join(','));
                    this.$http(api_walmart_post_batch_set,params).then(res=>{
                        this.init();
                        this.$message({type:'success',message: res.message});
                    }).catch(code => {
                        this.$message({type:'error',message:code.message||code});
                    }).finally(()=>{
                        setTimeout(() => {
                            this.$reqKey('downloadAdd',false);
                        }, 300)
                    })
                }
            },
            search(){
                this.init();
            },
            change_select(){//----------------状态/全部、启用、停用
                this.init();
            },
            key_word(){//----------------出入框
                this.searchData.snText = this.searchData.snText.replace(/\s*/g,'')
            },
            change_taskName(){//----------------抓取数据
                this.searchData.download_value = '';
            },
            init(){
                let params = window.clone(this.searchData);
                this.$set(params,'page',this.walmartList.page);
                this.$set(params,'pageSize',this.walmartList.pageSize);
                if(params.authorization === ''){
                    delete params.authorization
                };
                this.sort_type && (this.$set(params,'sort_type', this.sort_type));
                this.sort_val && (this.$set(params,'sort_val',this.sort_val));
                this.loading = true;
                this.$http(api_walmart_account,params).then(res=>{
                    res.data.forEach(res=>{
                        res.status = res.status === 1;
                    });
                    this.walmartList.list= res.data;
                    this.walmartList.total = res.count;
                    this.loading = false;
                    this.firstLoading = false
                });
                this.$http(api_walmart_site).then(res=>{
                    res = res.map(row=>{
                        return {
                            label:row.name,
                            value:row.site,
                        }
                    });
                    this.addEditSiteList = clone(res);
                    this.siteList = res;
                    this.siteList.unshift({label:'全部',value:''});
                }).catch(code=>{
                    this.$message({
                        type: 'error',
                        message: code.message||code,
                    });
                })
            },
            add_form(){//添加
                this.addEditwalmart = true;
                this.title = '添加账号';
                this.edit = true;
                this.addEditData ={
                    code:'',
                    acccount_name:'',
                    site:'',
                    download_order:0,
                    sync_delivery:0,
                    download_listing:0,
                }
            },
            add_walmart(){//添加
                Object.keys(this.addEditData).forEach(key=>{
                    if(typeof this.addEditData[key] === 'string'){
                        this.addEditData[key] = this.addEditData[key].trim();
                    }
                });
                if(this.addEditData.hasOwnProperty('id')){//更新
                    this.$http(api_put_walmart_account,this.addEditData).then(res=>{
                        this.addEditwalmart = false;
                        let find = this.walmartList.list.find(row=> Number(row.id)===Number(res.id));
                        if(!!find) Object.assign(res.data,find);
                        this.init();
                    }).catch(code=>{
                        this.$message({
                            type: 'error',
                            message: code.message||code,
                        });
                    }).finally(()=>{
                        setTimeout(() => {
                            this.$reqKey('addFormwalmart',false);
                        }, 300)
                    })
                }else{//------添加
                    this.$http(api_add_walmart_account,this.addEditData).then(res=>{
                        res.data.status = res.data.status === 1;
                        this.addEditwalmart = false;
                        this.$message({type:'success',message: res.message});
                        this.walmartList.list.unshift(res.data);
                        this.total ++;
                    }).catch(code=>{
                        this.$message({
                            type: 'error',
                            message: code.message||code,
                        });
                    }).finally(()=>{
                        setTimeout(() => {
                            this.$reqKey('addFormwalmart',false);
                        }, 300)
                    })
                }
            },
            look_over(row){
                this.title=`查看：${row.account_name}账号信息`;
                this.edit=false;
                this.addEditwalmart = true;
                let url = api_get_walmart_account;
                this.get_form_data(url,row.id);
            },
            edit_row(row){
                this.title=`编辑：${row.account_name}账号信息`;
                this.edit=true;
                this.addEditwalmart = true;
                let url = api_get_walmart_account;
                this.get_form_data(url,row.id);
            },
            get_form_data(url,id){
                this.$http(url,id).then(res=>{
                    this.addEditData = res;
                }).catch(code=>{
                    console.log('code',code)
                }).finally(()=>{
                    this.$reqKey('addFormwalmart',false);
                })
            },
            add_accredit(row){//订单授权
                this.title=`给账号：${row.account_name}授权`;
                this.authorizaTion = true;
                this.$http(api_token_walmart_account,row.id).then(res=>{
                    Object.assign(this.indentImpower,res);
                })
            },
            add_impower(){
                Object.keys(this.indentImpower).forEach(key=>{
                    if(typeof this.indentImpower[key] === 'string'){
                        this.indentImpower[key] = this.indentImpower[key].trim();
                    }
                });
                this.$http(api_token_walmart,this.indentImpower).then(res=>{
                    this.$message({
                        type:'success',
                        message:res.message
                    });
                    this.init();
                    this.authorizaTion = false;
                }).catch(code=>{
                    this.$message({
                        type: 'error',
                        message: code.message||code,
                    });
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('addObtain',false);
                    }, 300)
                })
            },
            sort_change(val){//------------------ 表格排序
                if (val.column instanceof Object) {
                    let sort_label = val.column.label;
                    switch (sort_label) {
                        case "简称":
                            this.sort_type = "code";
                            break;
                        case "帐号名称":
                            this.sort_type = "account_name";
                            break;
                        case "站点":
                            this.sort_type = "site";
                            break;
                        case "密钥有效期":
                            this.sort_type = "expiry_time";
                            break;
                    }
                    this.sort_val = val.order === "descending" ? "2" : "1";
                    this.init();
                }
            },
            handleSizeChange(val) {//------------分页
                this.walmartList.page = 1;
                this.walmartList.pageSize = val;
                this.init();
            },
            handleCurrentChange(val) {//------------分页
                this.walmartList.page = val;
                this.init();
            },

        },
        components: {
            addAccredit:require('./add-accredit.vue').default,
            addForm:require('./add-form.vue').default,
            dataTable:require('./data-table.vue').default,
            cardSearch: require('./card-search.vue').default,
            editBatch:require('./edit-batch').default
        }
    }
</script>
