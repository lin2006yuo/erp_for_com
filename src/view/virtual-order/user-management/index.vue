<template>
        <page class="p-index">
            <card-search
                    @search="search"
                    :search-data="searchData"
                    :clears="clears"></card-search>
            <el-button size="mini"
                       class="ml-sm mt-xs mb-xs"
                       type="primary"
                       @click="add_data">添加</el-button>
            <data-table :table-data="tableData"
                        :loading="loading"
                        @add-edit="addEdit"
                        @change-pwd="changePwd"
                        :total="total"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"></data-table>
            <add-ccount v-model="addManage" :title="title" :add-edit-data="addEditData" @submit="submit" :edit="edit" @keep="keep"></add-ccount>
            <add-reset v-model="resetData" :save-data="saveData"></add-reset>
        </page>
    </template>
    <style lang="stylus">

    </style>
    <script>
        import {api_user_list,api_user_add,api_user_info,api_user_editor} from '@/api/api-user-management';
        export default{
            page:{
                devinfo:{
                    frontEnd:'汤敏',
                    backEnd:'李佰敏',
                    createTime:'2018-8-20',
                    updateTime:'2018-8-22'
                }
            },
            data(){
                return{
                    searchData:{
                        username:'',
                        email:'',
                        status:'',
                        date_start:'',
                        date_end:'',
                    },
                    clears:{},
                    loading:false,
                    addManage:false,
                    tableData:{
                        list:[],
                        page:1,
                        pageSize:20,
                    },
                    addEditData:{},
                    title:'',
                    edit:false,
                    saveData:{},
                    resetData:false,
                    total:0
                }
            },
            refresh(){
                this.init();
            },
            mounted(){
                this.init();
            },
            methods:{
                search(){
                    this.init();
                },
                init(){
                    let parems = this.searchData;
                    this.loading = true;
                    Object.keys(this.searchData).forEach(key=>{
                        if(typeof this.searchData[key] === 'string'){
                            this.searchData[key] = this.searchData[key].trim();
                        }
                    });
                    this.$http(api_user_list,parems).then(res=>{
                        res.data.forEach(res=>{
                            res.status = res.status === 1;
                        });
                        this.tableData.list = res.data;
                        this.loading = false;
                        this.total = res.count
                    });
                },
                add_data(){
                    this.addManage = true;
                    this.edit = true;
                    this.title = '添加账号';
                    this.addEditData ={
                        username:'',
                        password:'',
                        email:'',
                        country:'',
                        city:'',
                        refund_name: '',
                        refund_account: '',
                        refund_type: '',
                        refund_currency: '',
                        platform:[
                            {channel_name:'亚马逊',channel_id:2,account_name:'',account_user:'',value:'',is_vip_prime:false},
                            {channel_name:'Ebay',channel_id:1,account_name:'',account_user:'',value:''},
                            {channel_name:'速卖通',channel_id:4,account_name:'',account_user:'',value:''},
                            {channel_name:'Wish',channel_id:3,account_name:'',account_user:'',value:''},
                        ],
                    }
                },
                submit(){
                    let params = clone(this.addEditData);
                    let platform = params.platform.filter(row=>!!row.value).map(row=>{
                        delete row.value;
                        delete row.channel_name;
                        if(row.channel_id===2)row.is_vip_prime = row.is_vip_prime===false?0:1;
                        return row;
                    });
                    if(platform.length<=0)return this.$message({type:'warning',message:'至少选择一个接收任务平台,并将数据填写完成'});
                    this.$set(params,'platform',platform);
                    this.$http(api_user_add,params).then(res => {
                        this.$message({type:'success',message:`${res.message}`||`${res}`});
                        this.addManage = false;
                        this.init();
                    }).catch(code => {
                        this.$message({type:'error',message:`${code.message}`||`${code}`})
                    })
                },
                addEdit(row){
                    this.$http(api_user_info,{userId:row.id}).then(res=>{
                        this.title = `编辑：${row.username}账号用户名`;
                        this.addManage = true;
                        this.edit = false;
                        this.addEditData = {
                            username:res.username,
                            email:res.email,
                            country:res.country,
                            city:res.city,
                            id:res.id,
                            refund_name: res.refund_name,
                            refund_account: res.refund_account,
                            refund_type: res.refund_type,
                            refund_currency: res.refund_currency,
                            platform:[
                                {channel_name:'亚马逊',channel_id:2,account_name:'',account_user:'',value:'',is_vip_prime:false},
                                {channel_name:'Ebay',channel_id:1,account_name:'',account_user:'',value:''},
                                {channel_name:'速卖通',channel_id:4,account_name:'',account_user:'',value:''},
                                {channel_name:'Wish',channel_id:3,account_name:'',account_user:'',value:''},
                            ],
                        };
                        this.addEditData.platform.forEach(row=>{
                            res.platform.forEach(item=>{
                                if(row.channel_id === item.channel_id){
                                    if(item.channel_id===2)row.is_vip_prime = item.is_vip_prime === 1?true:false;
                                    row.account_name = item.account_name;
                                    row.account_user = item.account_user;
                                    row.value = true;
                                }
                            })
                        });
                    });
                },
                keep(){
                    let params = clone(this.addEditData);
                    let platform = params.platform.filter(row=>!!row.value).map(row=>{
                        delete row.value;
                        delete row.channel_name;
                        if(row.channel_id===2)row.is_vip_prime = row.is_vip_prime===false?0:1;
                        return row;
                    });
                    if(platform.length<=0)return this.$message({type:'warning',message:'至少选择一个接收任务平台,并将数据填写完成'});
                    this.$set(params,'platform',platform);
                    this.$http(api_user_editor,params).then(res => {
                        this.$message({type:'success',message:`${res.message}`||`${res}`});
                        this.addManage = false;
                        this.init();
                    }).catch(code => {
                        this.$message({type:'error',message:`${code.message}`||`${code}`})
                    })
                },
                changePwd(row){
                    this.resetData = true;
                    this.saveData = {
                        new_pwd:'',
                        userId:row,
                    }
                },
                handleCurrentChange(val) {//------------分页
                    this.tableData.page = val;
                    this.init();
                },
                handleSizeChange(val) {//------------分页
                    this.tableData.page = 1;
                    this.tableData.pageSize = val;
                    this.init();
                },
            },
            components:{
                cardSearch:require('./card-search.vue').default,
                dataTable:require('./data-table.vue').default,
                addCcount:require('./add-ccount.vue').default,
                addReset:require('./add-reset.vue').default,
            }
        }
    </script>