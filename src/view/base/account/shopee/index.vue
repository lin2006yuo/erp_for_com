<template>
    <page class="p-index">
        <card-search class="mb-xs"
                     :search-data="searchData"
                     :clears="clears"
                     :site-list="siteList"
                     @search="search"
                     @change-select="change_select"
                     @key-word="key_word"
                     @change-taskName="change_taskName">
        </card-search>
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
            :shopeeList="shopeeList"
            :first-loading="firstLoading"
            @look-over="look_over"
            @edit="edit_row"
            @sort-change="sort_change"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            @selection-change="selectionChange">
        </data-table>
        <add-form v-model="addEditVisable"
                  :edit="edit"
                  :title="title"
                  :add-edit-data="addEditData"
                  :add-edit-site-list="addEditSiteList"
                  @add-shopee="add_shopee"></add-form>
        <edit-batch v-model="settingUp"
                    :batch-title="batchTitle"
                    :batch-data="batchData"
                    @set-clich="setClich"></edit-batch>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_shopee_account,api_get_shopee_account,api_post_shopee_chang,api_shopee_site,api_shopee_post_batch_set} from '../../../../api/shopee';
    export default{
        page:{
            devinfo:{
                frontEnd:'汤敏',
                backEnd:'詹熏欣',
                createTime:'2018-5-22',
                updateTime:'2018-5-24'
            }
        },
        data(){
            return {
                firstLoading: true,
                searchData:{
                    authorization:'',
                    sn_type:'name',
                    sn_text:'',
                    download_type:'download_listing',
                    download_value:'',
                    download_exec:'0',
                    platform_status:0,
                    site:'',
                },
                clears:{
                    sn_type:'name',
                    download_type:'download_listing',
                    download_exec:'0',
                    platform_status:0,
                },
                addEditVisable:false,
                edit:true,
                title:'',
                loading:true,
                shopeeList:{
                	list:[],
                    page:1,
                    pageSize:20,
                    total:0,
                },
                addEditSiteList:[],
                addEditData:{
                    name:'',
                    code:'',
                    shop_id:'',
                    partner_id:'',
                    key:'',
                    download_order:0,
                    sync_delivery:0,
                    download_listing:0,
                    site:'',
                    is_TH: 0
                },
                order_field: "",
                order_val:'',
                siteList:[],
                settingUp: false,//批量设置弹框开关
                batchTitle: '',//批量设置弹框标题
                batchData:{},//批量设置弹框数据
                selectData:[],//被选中列表
            }
        },
        refresh(){
            this.init();
        },
        mounted(){
            this.change_site()
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
                    // platform_status:1,
                    is_stop:false,
                    is_start:false,
                    download_order:'',
                    sync_delivery:'',
                    download_listing:'',
                }
            },
            setClich(val){
                if(val.is_stop === false&&val.is_start === false&&val.download_order === ''&&val.sync_delivery ===''&&val.download_listing === ''){
                    this.$message({type: 'warning',message: '请至少修改一项数据'});
                    this.$reqKey('downloadAdd',false);
                }else{
                    this.settingUp = false;
                    let params = {};
                    if(val.is_stop === true){
                        this.$set(params,'platform_status',0)
                    }else if(val.is_start === true){
                        this.$set(params,'platform_status',1)
                    }
                    for(let key in val){
                        if(key !== 'is_stop'&&key !== 'is_start'&&val[key] !== ''){
                            this.$set(params,key,val[key])
                        }
                    }
                    this.$set(params,'ids',this.selectData.join(','));
                    this.$http(api_shopee_post_batch_set,params).then(res=>{
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
                this.searchData.sn_text = this.searchData.sn_text.replace(/\s*/g,'')
            },
            change_taskName(){//----------------抓取数据
                this.searchData.download_value = '';
            },
            change_site(){//----------------站点
                this.$http(api_shopee_site).then(res=>{
                    res = res.map(row=>{
                    	return {
                    		label:row.name,
                            value:row.code,
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
            add_form(){//----------------添加
                this.title='添加账号';
                this.edit=true;
                this.addEditData={
                    name:'',
                    code:'',
                    shop_id:'',
                    partner_id:'',
                    site:'',
                    key:'',
                    download_order:0,
                    sync_delivery:0,
                    download_listing:0,
                    is_TH: 0
                },
                this.addEditVisable = true;
            },
            look_over(row){//----------------查看
                this.title=`查看：${row.name}账号信息`;
                this.edit=false;
                this.$http(api_get_shopee_account,row.id).then(res=>{
                    this.addEditData = res;
                })
                this.addEditVisable = true;
            },
            edit_row(row){//----------------编辑
                this.title=`编辑：${row.name}账号信息`;
                this.edit=true;
                this.$http(api_get_shopee_account,row.id).then(res=>{
                    res.partner_id = String(res.partner_id);
                    res.shop_id = String(res.shop_id);
                    res.site = String(res.site);
                    res.is_TH = Number(res.is_TH);
                    this.addEditData = res;
                })
                this.addEditVisable = true;
            },
            init(){
                this.loading = true;
                let searchData = window.clone(this.searchData);
                this.order_field && (this.$set(searchData,'order_field', this.order_field));
                this.order_val && (this.$set(searchData,'order_val',this.order_val));
                this.$set(searchData,'page',this.shopeeList.page);
                this.$set(searchData,'pageSize',this.shopeeList.pageSize);
                if(searchData.site === ''){
                    delete searchData.site;
                };
                this.$http(api_shopee_account,searchData).then(res=>{
                    res.list.forEach(res=>{
                        res.platform_status = res.platform_status === 1;
                    })
                    this.shopeeList.list = res.list;
                    this.shopeeList.total = res.count;
                    this.loading = false;
                    this.firstLoading = false
                })
            },
            add_shopee(){//----------------确定保存
                Object.keys(this.addEditData).forEach(key=>{
                    if(typeof this.addEditData[key] === 'string'){
                        this.addEditData[key] = this.addEditData[key].trim();
                    }
                });
                let data = clone(this.addEditData);
                data.shop_id = Number(data.shop_id);
                data.partner_id = Number(data.partner_id);
                this.$http(api_post_shopee_chang,data).then(res=>{
                    res.data.platform_status = res.data.platform_status === 1;
                    this.$message({type:'success', message:res.message || res});
                    if(this.addEditData.hasOwnProperty('id')){
                        let find = this.shopeeList.list.find(row=> row.id === this.addEditData.id);
                        if(!!find) Object.assign(find,res.data);
                    }else{
                        this.shopeeList.list.unshift(res.data);
                        this.total++;
                    }
                    this.addEditVisable = false;

                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    });
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('addFormShopee', false);
                    }, 300)
                });
            },
            sort_change(val){//------------------ 表格排序
                if (val.column instanceof Object) {
                    let sort_label = val.column.label;
                    switch (sort_label) {
                        case "简称":
                            this.order_field = "code";
                            break;
                        case "账户名称":
                            this.order_field = "name";
                            break;
                        case "shopid":
                            this.order_field = "shop_id";
                            break;
                        case "站点":
                            this.order_field = "site";
                            break;
                    }
                    this.order_val = val.order === "descending" ? "desc" : "asc";
                    this.init();
                }
            },
            handleSizeChange(val) {//------------分页
                this.shopeeList.page = 1;
                this.shopeeList.pageSize = val;
                this.init();
            },
            handleCurrentChange(val) {//------------分页
                this.shopeeList.page = val;
                this.init();
            },
        },

        components: {
            cardSearch: require("./card-search.vue").default,
            dataTable:require('./data-table.vue').default,
            addForm:require('./add-form.vue').default,
            editBatch:require('./edit-batch').default
        }
    }
</script>
