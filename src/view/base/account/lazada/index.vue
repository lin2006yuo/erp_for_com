<template>
    <page class="p-index">
        <search-card @search="search" @enter="search" :params="paramsData" :clears="clears">
            <div>
                <label-buttons
                    label="状态："
                    :buttons="userStatus"
                    @select="changeSelect"
                    class="inline">
                </label-buttons>
                <div class="inline mb-mini">
                    <label class="inline ml-sm">授权状态：</label>
                    <el-select
                        class="inline width-xs"
                        v-sf.authorization
                        v-model="paramsData.authorization"
                        placeholder="请选择">
                        <el-option
                            v-for="item in authorList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <el-select class="inline s-width-small"
                       v-sf.snType
                       v-model="paramsData.snType">
                <el-option v-for="item in conditionList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
            <el-input class="inline"
                      v-sf.snText
                      :placeholder="`请输入${changeLabel}...`"
                      v-model="paramsData.snText"
                      @input="keyword"></el-input>
            <el-select class="inline s-width-large ml-sm"
                       v-sf.taskName
                       v-model="paramsData.taskName"
                       @change="change_taskName"
                       filterable>
                <el-option
                    v-for="res in taskNameList"
                    :label="res.label"
                    :value="res.value"
                    :key="res.value"
                ></el-option>
            </el-select>
            <el-select v-model="paramsData.taskCondition"
                       class="inline"
                       style="width:60px"
                       v-sf.taskCondition
                       filterable>
                <el-option
                    v-for="res in taskList"
                    :label="res.label"
                    :value="res.value"
                    :key="res.value"></el-option>
            </el-select>
            <el-select v-model="paramsData.taskTime"
                       class="inline s-width-small"
                       v-sf.taskTime
                       filterable>
                <el-option
                    v-for="res in taskTimeList"
                    :label="res.label"
                    :value="res.value"
                    :key="res.value"
                ></el-option>
            </el-select>
            <label class="inline ml-sm  mr-sm">站点：</label>
            <el-select class="inline s-width-small mr-sm"
                       v-sf.site
                       v-model="paramsData.site" filterable clearable>
                <el-option v-for="item in siteList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
        </search-card>
        <permission tag="ElButton"
                    :route="apis.url_lazada_account"
                    class="mt-xs mb-xs ml-sm"
                    size="mini"
                    type="primary"
                    @click="add_form">添加</permission>
        <el-button size="mini"
                   :disabled="selectData.length <= 0"
                   @click.native="batchSetup"
                   type="primary"
                   class="ml-sm">批量设置</el-button>
        <data-table
            :lazadaList="lazadaList"
            :add-edit-site-list="addEditSiteList"
            :loading="loading"
            @look-over="look_over"
            @edit="edit_row"
            @add-member="add_member"
            @save-member="save_member"
            @cur-delete="cur_delete"
            @sort-change="sort_change"
            @size-change="handleSizeChange"
            @selection-change="selectionChange"
            @current-change="handleCurrentChange">
        </data-table>
        <add-form v-model="addEditVisable"
                  :edit="edit"
                  :title="title"
                  :add-edit-site-list="addEditSiteList"
                  :add-edit-data="addEditData"
                  @add-lazada="add_lazada"></add-form>
        <add-code v-model="code_info"
                  :edit="edit"
                  :title="title"
                  :add-code-form="addCodeForm"></add-code>
        <edit-batch v-model="settingUp"
                    :title="title"
                    :add-edit-data="addEditData"
                    @set-clich="setClich"></edit-batch>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {
    	api_lazada_site,
        url_lazada_account,
        api_get_lazada_account,
        api_lazada_account_edit,
        api_lazada_account,
        api_put_lazada_account,
        api_add_lazada_account,
        api_get_lazada_download,
        api_lazada_authorization} from '../../../../api/lazada';
	export default{
        page:{
            devinfo:{
                frontEnd:'汤敏',
                backEnd:'蓝术术',
                createTime:'2018-5-19',
                updateTime:'2018-5-22'
            }
        },
        permission:{
            url_lazada_account
        },
        refresh(){
            this.init();
        },
		data(){
			return {
                title:'',
                edit:true,
                userStatus:[
                    {name:"全部",status:0},
                    {name:"已启用",status:1},
                    {name:"已停用", status:2}
                ],
                authorList: [
                	{value: '',label: '全部'},
                    {value: '0',label: '未授权'},
                    {value: '1',label: '已授权'},
                ],
                conditionList:[
                    {value: 'account_name',label: '账户'},
                    {value:'code',label: '简称'}
                ],
                taskNameList:[
                    {label:"抓取Listing数据",value:'download_listing'},
                    {label:"抓取订单数据",value:'download_order'},
                    {label:"同步发货状态",value:'sync_delivery'},
                ],
                taskList:[
                    {label:"=",value:'eq'},
                    {label:"<",value:'lt'},
                    {label:">",value:'gt'},
                ],
                paramsData:{
//                    page:1,
                    authorization:"",
                    snType:'account_name',
                    snText:'',
                    taskName:'download_listing',
                    taskCondition:'eq',
                    taskTime:'',
                    site:'',
                },
                clears:{
                    snType:'account_name',
                    taskName:'download_listing',
                    taskCondition:'eq',
                },
                total:0,
                loading:true,
                fSelect:0,
                siteList:[],
                addEditVisable:false,
                addEditSiteList:[],
                addEditData:{//添加/编辑/查看
                    code:"",
                    account_name:"",
                    site:'',
                    download_listing:0,
                    download_order:0,
                    sync_delivery:0,
                    merchant_id:'',
                    access_key_id :'',
                    secret_key:'',
                    sync_feedback:0,
                },
                addCodeForm:{
                	href:'',
                },
                lazadaList:{
                    list:[],
                    page:1,
                    pageSize:20,
                    total:0,
                },
                code_info:false,
                sort_field: "",
                sort_type:'',
                selectData:[],
                settingUp:false
            }
		},
        mounted(){
            this.get_site();
        },
        methods:{
            selectionChange(select){
                this.selectData = select.map(row=>{
                    return row.id;
                });
            },
            batchSetup(){
                this.settingUp = true;
                this.title="批量设置";
                this.addEditData = {
                    status:1,
                    download_listing:0,
                    download_order:0,
                    sync_delivery:0,
                }
            },
            setClich(val){
                this.settingUp = false;
                val.status = val.status ? 1 : 0;
                let params = val;
                this.$set(params,"ids",this.selectData);
                this.$http(api_get_lazada_download,params).then(res=>{
                    this.init();
                    this.$message({type:'success',message: res.message});
                }).catch(code=>{
                    this.$message({type: 'error', message: code.message||code,});
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('downloadAdd',false);
                    }, 300)
                })
            },
            look_over(row){
                this.title=`查看：${row.name}账号信息`;
                this.edit=false;
                this.addEditVisable = true;
                let url = api_get_lazada_account;
                this.get_form_data(url,row.id);
            },
            edit_row(row){
                this.title=`编辑：${row.name}账号信息`;
                this.edit=true;
                this.addEditVisable = true;
                let url = api_get_lazada_account;
                this.get_form_data(url,row.id);
            },
            get_form_data(url,id){
                this.$http(url,id).then(res=>{
                    this.addEditData = res;
                }).catch(code=>{
                    console.log('code',code)
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('addFormLazada',false);
                    }, 300)
                })
            },
            add_member(row){
                this.title=`授权：${row.name}账号信息`;
                this.edit=true;
                this.code_info = true;
                this.addCodeForm = row;
                this.$set(this.addCodeForm,'authorization_code','')
            },
//			状态/全部、启用、停用
            changeSelect(select){
                this.fSelect = this.userStatus[select].status;
                if (select === 0) {
                    delete this.paramsData.status;
                    this.init();
                }
                if (select === 1) {
                    this.paramsData.status = 1;
                    this.init();
                }
                if (select === 2) {
                    this.paramsData.status = 0;
                    this.init();
                }
            },
//           输入
            keyword(){
                this.paramsData.snText = this.paramsData.snText.replace(/\s*/g,'')
            },
//           抓取数据
            change_taskName(){
                this.paramsData.taskTime = '';
            },
            get_site(){
                this.$http(api_lazada_site).then(res=>{
                    res = res.map(row=>{
                        return {
                            label:row.name,
                            value:row.county_id,
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
//          list列表函数
            init(){
                this.loading = true;
                let params = window.clone(this.paramsData);
                this.$set(params,'page',this.lazadaList.page);
                this.$set(params,'pageSize',this.lazadaList.pageSize);
                this.sort_field && (this.$set(params,'sort_field', this.sort_field));
                this.sort_type && (this.$set(params,'sort_type',this.sort_type));
                if(params.site === ''){
                    delete params.site;
                }
                this.$http(api_lazada_account,params).then(res => {
                    res.data.forEach(res=>{
                        res.status = res.status === 1;
                    });
                    this.lazadaList.list = res.data;
                    this.lazadaList.total = res.count;
                    this.loading = false
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                })
            },
//           增加打开弹窗
            add_form(){
                this.addEditVisable = true;
                this.title='添加账号';
                this.edit=true;
                this.addEditData = {
                    code:"",
                    account_name:"",
                    server_id:'',
                    site:'',
                    download_listing:0,
                    download_order:0,
                    sync_delivery:0,
                    merchant_id:'',
                    access_key_id :'',
                    secret_key:'',
                    sync_feedback:0,
                }
            },
            add_lazada(){
                Object.keys(this.addEditData).forEach(key=>{
                    if(typeof this.addEditData[key] === 'string'){
                        this.addEditData[key] = this.addEditData[key].trim();
                    }
                })
                if(this.addEditData.hasOwnProperty('id')){//更新
                    this.$http(api_put_lazada_account,this.addEditData.id,this.addEditData).then(res=>{
                        this.addEditVisable = false;
                        let find = this.lazadaList.list.find(row=> Number(row.id)===Number(res.id));
                        if(!!find) Object.assign(res.data,find);
                        this.init();
                    }).catch(code=>{
                        this.$message({
                            type:'error',
                            message:code.message || code
                        })
                    }).finally(()=>{
                        setTimeout(() => {
                            this.$reqKey('addFormLazada',false);
                        }, 300)
                    })
                }else{//添加
                    this.$http(api_add_lazada_account,this.addEditData).then(res=>{
                        res.data.status = res.data.status === 1;
                        this.addEditVisable = false;
                        this.$message({type:'success',message: res.message});
                        this.lazadaList.list.unshift(res.data);
                        this.total ++;
                    }).catch(code=>{
                        this.$message({
                            type:'error',
                            message:code.message || code
                        })
                    }).finally(()=>{
                        setTimeout(() => {
                            this.$reqKey('addFormLazada',false);
                        }, 300)
                    })
                }
            },
            sort_change(val){//------------------ 表格排序
                if (val.column instanceof Object) {
                    let sort_label = val.column.label;
                    switch (sort_label) {
                        case "简称":
                            this.sort_field = "code";
                            break;
                        case "账户名称":
                            this.sort_field = "name";
                            break;
                        case "Lazada账户":
                            this.sort_field = "lazada_name";
                            break;
                        case "站点":
                            this.sort_field = "site";
                            break;
                    }
                    this.sort_type = val.order === "descending" ? "desc" : "asc";
                    this.init();
                }
            },
            save_member(){
                this.init();
            },
            cur_delete(){
                this.init();
            },
            handleSizeChange(val) {//------------分页
                this.lazadaList.page = 1;
                this.lazadaList.pageSize = val;
                this.init();
            },
            handleCurrentChange(val) {//------------分页
                this.lazadaList.page = val;
                this.init();
            },
            search(){
                this.init();
            },
        },
        computed: {
            changeLabel(){
                if (this.paramsData.snType === 'account_name') {
                    return `账户`;
                } else {
                    return `简称`;
                }
            },
            taskTimeList(){
                let list1 = [
                    {label: "全部", value: ''},
                    {label:"未启用",value:0},
                    {label:"1小时",value:60},
                    {label:"2小时",value:120},
                    {label:"3小时",value:180},
                    {label:"5小时",value:300},
                    {label:"6小时",value:360},
                    {label:"8小时",value:480},
                    {label:"10小时",value:600},
                    {label:"12小时",value:720},
                    {label:"24小时",value:1440}
                ];
                let list2 = [
                    {label: "全部", value: ''},
                    {label:"未启用",value:0},
                    {label:"1小时",value:60},
                    {label:"2小时",value:120},
                    {label:"3小时",value:180},
                    {label:"5小时",value:300},
                    {label:"6小时",value:360},
                    {label:"8小时",value:480},
                    {label:"10小时",value:600},
                    {label:"12小时",value:720},
                    {label:"24小时",value:1440}
                ];
                return this.paramsData.taskName==='download_listing'?list2:list1;
            },
        },
		components: {
            addCode:require('./add-code.vue').default,
            dataTable:require('./data-table.vue').default,
            addForm:require('./add-form.vue').default,
            editBatch:require('./edit-batch.vue').default,
            labelButtons:require('../../../../components/label-buttons.vue').default,
            searchCard:require('../../../../components/search-card.vue').default
        }
	}
</script>
