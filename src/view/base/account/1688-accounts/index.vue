<template>
    <page class="p-index">
        <card-search :form="form"
                     :clears="clears"
                     @click-button="click_button"
                     @search="search"></card-search>
        <permission tag="ElButton"
                    size="mini"
                    type="primary"
                    @click.native="add"
                    class="inline mt-xs ml-sm"
                    :route="apis.url_add_accountlist">添加</permission>
        <permission tag="ElButton"
                    size="mini"
                    type="primary"
                    @click.native="batchSetup"
                    :disabled="selectData.length <= 0"
                    class="inline mt-xs ml-sm"
                    :route="apis.url_post_batch_set">批量设置</permission>
        <!--添加/编辑/查看-->
        <add-edit v-model="showAddEditor"
                  :is-edit="isEdit"
                  @update-new="update_new"
                  @add-new="add_new"
                  :form="addForm"
                  :title="curTitle"></add-edit>
        <!--授权-->
        <get-author-code v-model="authorCodeDialog"
                         :title="authorCodeTitle"
                         :form="authorCodeForm"></get-author-code>
        <!--列表-->
        <data-table :tableParams='tableParams'
                    :loading="loading"
                    :first-loading="firstLoading"
                    @look="look"
                    @edit="edit"
                    @author-code="author_code"
                    @change-size="change_size"
                    @change-page="change_page"
                    @sort-change="sort_change"
                    @selection-change="selectionChange"
                    class="mt-xs"></data-table>
        <!--批量开启-->
        <edit-batch v-model="settingUp"
                    :batch-title="batchTitle"
                    :batch-data="batchData"
                    @set-clich="setClich"></edit-batch>
    </page>
</template>
<style lang="stylus" scoped>

</style>
<script>
    import {api_get_accountlist,api_look_accountlist,api_1688_post_batch_set} from '../../../../api/1688-accounts';
    import {url_add_accountlist,url_post_batch_set} from '../../../../api/1688-accounts';
    export default {
        permission:{
            url_add_accountlist,
            url_post_batch_set
        },
        page:{
            devinfo:{
                frontEnd:'王月如',
                backEnd:'刘志勇',
                createTime:'2018-01-19',
                updateTime:''
            }
        },
        refresh(){
            this.init();
        },
        data() {
            return {
                firstLoading: true,
                authorCodeTitle:"",
                loading:false,
                authorCodeDialog:false,
                curTitle:"",
                isEdit:true,
                showAddEditor:false,
                sort_field:'',
                sort_type:'',
//                搜索
                form:{
                    is_invalid:"",
                    enabled:"",
                    is_authorization:"",
                    account_name:"",
                    code:"",
                    type:"account_name",
                    text:"",
                },
//                添加编辑
                addForm:{
                    code:"",
                    account_name:"",
                    membership:"",
                    enabled:"",
                    is_invalid:false,
                    order_prefix:"",
                },
//                授权
                authorCodeForm:{
                    client_id:"",
                    client_secret:"",
                    code:"",
                },
                clears:{
                    type:"account_name",
                },
                tableParams:{
                    page:1,
                    pageSize:50,
                    count:0,
                    list:[],
                },
                settingUp: false,//批量设置弹框开关
                batchTitle: '',//批量设置弹框标题
                batchData:{},//批量设置弹框数据
                selectData:[],//被选中列表
            }
        },
        created(){
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
                    is_stop:false,
                    is_start:false,
                    membership:''
                }
            },
            setClich(val){
                if(val.is_stop === false&&val.is_start === false&&val.membership === ''){
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
                    this.$http(api_1688_post_batch_set,params).then(res=>{
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
            author_code(row){
                this.authorCodeTitle = `给：${row.account_name}账号 授权`;
                this.authorCodeDialog = true;
                this.authorCodeForm = {
                    client_id:!!row.client_id?row.client_id:'',
                    client_secret:row.client_secret,
                    id:row.id,
                } ;
                console.log(this.authorCodeForm,'form');
            },
            update_new(res){
                let find = this.tableParams.list.find(it=>Number(it.id)===Number(res.id));
                console.log(find,find);
                if(!!find) Object.assign(find,res)
            },
            sort_change(val){
                if(!val.column)return;
                switch(val.column.label){
                    case '简称':
                        this.sort_field = 'code';
                        break;
                    case '1688账号':
                        this.sort_field = 'account_name';
                        break;
                    case '失效时间':
                        this.sort_field = 'expiry_time';
                        break;
                    default:
                        this.sort_field = '';
                }
                this.sort_type = val.order==='ascending'?'asc':'desc';
                this.init();
            },
            change_size(size){
                this.tableParams.pageSize = size;
                this.init();
            },
            change_page(page){
                this.tableParams.page = page;
                this.init();
            },
            add_new(res){
                this.tableParams.list.unshift(res);
            },
            add(){
                this.showAddEditor = true;
                this.isEdit = true;
                this.curTitle = '添加账号';
                this.addForm = {
                    code:"",
                    account_name:"",
                    membership:"",
                    enabled:"",
                    is_invalid:false,
                    order_prefix:"",
                }
            },
            look(row){
                this.isEdit = false;
                this.showAddEditor = true;
                this.curTitle = `查看账号：${row.account_name} 信息`;
                this.get_add_form(row);

            },
            edit(row){
                this.isEdit = true;
                this.showAddEditor = true;
                this.curTitle = `编辑账号：${row.account_name} 信息`;
                this.get_add_form(row);
            },
            get_add_form(row){
                this.$http(api_look_accountlist,row.id).then(res=>{
                    res.is_invalid = res.is_invalid?true:false;
                    this.addForm = res;
                }).catch(code=>{
                    console.log(code);
                })
            },
            search(){
                this.init();
            },
            click_button(val){
                this.form.is_invalid = val;
                this.init();

            },
            init(){
                let params = clone(this.form);
                this.$set(params,'page',this.tableParams.page);
                this.$set(params,'pageSize',this.tableParams.pageSize);
                this.sort_field&&this.$set(params,'sort_field',this.sort_field);
                this.sort_type&&this.$set(params,'sort_type',this.sort_type);
                this.loading = true;
                this.$http(api_get_accountlist,params).then(res=>{
                    this.loading = false;
                    this.firstLoading = false;
                    res.data.forEach(it=>{
                        it.is_invalid = it.is_invalid?true:false;
                    })
                    this.tableParams.count = res.count;
                    this.tableParams.list = res.data;
                }).catch(code=>{
                    console.log(code);
                })
            }
        },
        components: {
            cardSearch:require('./card-search.vue').default,
            dataTable:require('./data-table').default,
            addEdit:require('./add-edit').default,
            getAuthorCode:require('./get-author-code.vue').default,
            editBatch:require('./edit-batch').default
        }
    }
</script>
