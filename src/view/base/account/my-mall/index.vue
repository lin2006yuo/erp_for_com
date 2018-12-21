    <template>
        <page class="p-index">
            <search-card :form="searchForm"
                         :clears="clears"
                         @change-select="change_select"
                         @select="select"
                         @search="search"></search-card>
            <div class="ml-sm mt-xs mb-xs">
                <permission tag="ElButton" @click.native="add"
                            type="primary" size="mini" class="inline"
                            :route="apis.url_add_pandao_account" >添加</permission>
                <permission tag="ElButton"
                            size="mini"
                            type="primary"
                            @click.native="batchSetup"
                            :disabled="selectData.length <= 0"
                            class="inline"
                            :route="apis.url_post_batch_set">批量设置</permission>
            </div>
            <table-data :tableData="tableData"
                        @look-over="look_over"
                        @change-size="change_size"
                        @sort-change="sort_change"
                        @do-authorization="do_authorization"
                        @selection-change="selectionChange"
                        @edit="edit"
                        :load="loading"
                        :firstLoading="firstLoading"></table-data>
            <add-edit v-model="addEditDialog"
                      :edit='isEdit'
                      :form="form"
                      @add-update="add_update"
                      :title="addEditTitle"></add-edit>
            <authorization v-model="authorDialog" :form="authorForm"></authorization>
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
        	api_pandao_account,
            api_look_pandao_account,
            url_add_pandao_account,
            api_add_pandao_account,
            api_update_pandao_account,
            url_post_batch_set,
            api_mymall_post_batch_set
        } from '../../../../api/my-mall';
        export default{
            permission:{
                url_add_pandao_account,
                url_post_batch_set
            },
            data(){
                return{
                    firstLoading:true,
                    addEditDialog:false,
                    authorDialog:false,
                    isEdit:false,
                    sort_field:'',
                    sort_type:'',
                    authorForm:{
                        client_id:'',
                        client_secret:'',
                        username:'',
                        password:'',
                    },
                    form:{
                        code:'',
                        account_name:'',
                        download_order:0,
                        sync_listing:0,
                    },
                    searchForm:{
                        is_authorization:'',
                        is_invalid:'',
                        snType:'code',
                        snText:'',
                    },
                    clears:{
                        snType:'code',
                    },
                    tableData:{
                        list:[],
                        page:1,
                        pageSize:50,
                        count:0,
                    },
                    loading:false,
                    addEditTitle:'',
                    settingUp: false,//批量设置弹框开关
                    batchTitle: '',//批量设置弹框标题
                    batchData:{},//批量设置弹框数据
                    selectData:[],//被选中列表
                }
            },
            mounted(){
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
                        download_order:'',
                        sync_listing:'',
                    }
                },
                setClich(val){
                    if(val.is_stop === false&&val.is_start === false&&val.download_order === ''&&val.sync_listing ===''){
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
                        this.$http(api_mymall_post_batch_set,params).then(res=>{
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
                sort_change(val){
                    if(!val.column)return;
                    this.sort_type = val.order==='descending'?'DESC':'ASC';
                    switch(val.column.label){
                        case '简称':
                            this.sort_field = 'code';
                            break;
                        case 'MyMall账号':
                            this.sort_field = 'account_name';
                            break;
                        case '密钥有效期':
                            this.sort_field = 'expiry_time';
                            break;
                        default:
                            this.sort_field = '';
                    }
                    this.init();
                },
                change_select(){
                    this.init();
                },
                select(){
                    this.init();
                },
                add_update(obj){
                    let index = this.tableData.list.findIndex(row=>Number(row.id)===Number(obj.id));
                    obj.is_invalid = !!Number(obj.is_invalid);
                    if(index>-1) return this.tableData.list.splice(index,1,obj);
                    this.tableData.list.unshift(obj);
                    this.tableData.count++;
                },
                add(){
                    this.addEditDialog = true;
                    this.isEdit = true;
                    this.addEditTitle = '添加账号';
                    this.form = {
                        code:'',
                        account_name:'',
                        download_order:0,
                        sync_listing:0,
                    }
                },
                change_size(size){
                    this.tableData.pageSize = size;
                },
                change_page(page){
                    this.tableData.page = page;
                },
                look_over(row){
                    this.addEditDialog = true;
                    this.isEdit = false;
                    this.addEditTitle = `查看：${row.account_name} 账号`;
                    this.get_form(row);
                },
                edit(row){
                    this.addEditDialog = true;
                    this.isEdit = true;
                    this.addEditTitle = `编辑：${row.account_name} 账号`;
                    this.get_form(row);
                },
                do_authorization(row){
                    this.authorDialog = true;
                    this.$set(this.authorForm,'id',row.id);
                    this.authorForm.username= row.account_name;
                    this.authorForm.password= '';
                    if(!row.is_authorization){
                        this.authorForm.client_id = '';
                        this.authorForm.client_secret= '';
                    }else{
                        this.authorForm.client_id = row.client_id;
                        this.authorForm.client_secret= row.client_secret;
                    }
                },
                get_form(row){
                    this.$http(api_look_pandao_account,row.id).then(res => {
                        this.form = res;
                    }).catch(code => {
                        console.log(code);
                    })
                },
                search(){
                    this.init();
                },
                init(){
                    this.loading = true;
                    let params = clone(this.searchForm);
                    params.page = this.tableData.page;
                    params.pageSize = this.tableData.pageSize;
                    if(this.sort_field)this.$set(params,'sort_field',this.sort_field);
                    if(this.sort_type)this.$set(params,'sort_type',this.sort_type);
                    this.$http(api_pandao_account,params).then(res => {
                        res.data.forEach(row=>{
                            row.is_invalid = !!row.is_invalid
                        });
                        this.tableData.list = res.data;
                        this.tableData.count = res.count;
                        this.loading = false;
                        this.firstLoading = false
                    }).catch(code => {
                        console.log(code,'code');
                    })
                },
            },
            props:{

            },
            components:{
                searchCard:require('./search-card.vue').default,
                tableData:require('./table-data.vue').default,
                addEdit:require('./add-edit.vue').default,
                authorization:require('./authorization.vue').default,
                editBatch:require('./edit-batch').default
            }
        }
    </script>
