<template>
    <page class="buyer-p-index">
        <search-card @search="search" @enter="search" :params="searchData" :clears="clears">
            <label-item label="平台：">
                <select-remote class="s-width-default" v-sf.channel_id v-model="searchData.channel_id"
                               :remote="channel_remote"></select-remote>
            </label-item>
            <label-item label="账号简称：" class="ml-sm">
                <el-select class="s-width-default" filterable clearable v-sf.account_id
                           v-model="searchData.account_id" :placeholder="accoutPlaceholder"
                           :disabled="searchData.channel_id<=0">
                    <el-option v-for="item in accoutOptions"
                               :label="item.label"
                               :value="item.value"
                               :key="item.value">
                    </el-option>
                </el-select>
            </label-item>
            <el-select v-sf.snType v-model="searchData.snType" @change="change_label"
                       class="inline s-width-small ml-sm">
                <el-option v-for="item in searchList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
            <el-input v-sf.snText v-model="searchData.snText" :placeholder="`请输入${changeLabel}...`" class="inline width-super enter-result mr-sm"></el-input>
        </search-card>
        <data-table
                :is-load="isLoad"
                :first-loading="firstLoading"
                @add-list="add_list"
                @update-list="update_list"
                @update-delete="update_delete"
                @update-address="update_address"
                @batch-import="batch_import"
                :tables="tables">
        </data-table>
        <el-pagination
                class="page-fixed"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
        <add-edit ref="addEdit"
                  v-model="add_dialog"
                  :address-id="addressId"
                  :title-name="titleName"
                  :mark-id="markId"
                  @update-data="update_data"
                  @base-add="base_add"></add-edit>
        <import-excel v-model="showImport"
                      @files-update="init"
                      :export-api="export_transfer_template"
                      :import-api="import_transfer"
                      :select-list="checkData"></import-excel>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_channel,api_account_list} from '../../../api/order-local';
    import {api_buyers_list, api_buyers, api_addresses, api_buyer_batch_import, api_get_import_template} from '../../../api/buyer';

    export default {
    	page:{
            devinfo:{
                frontEnd:'黎宏珍',
                backEnd:'张文宇',
                createTime:'2017-8-5',
                updateTime:'2017-8-22'
            }
        },
        refresh(){
            this.init();
        },
        data() {
            return {
                export_transfer_template: api_get_import_template,
                import_transfer: api_buyer_batch_import,
                firstLoading:true,
                accoutOptions: [{label: "", value: ""}],
                isLoad: false,
                add_dialog: false,
                markId: 0,
                addressId: '',
                changeLabel: '买家ID',
                total: 0,
                searchData: {
                    channel_id: 0,
                    account_id: "",
                    snType: "buyer_id",
                    snText: "",
                    page: 1,
                    pageSize: 50
                },
                clears: {
                    channel_id: 0,
                    snType: "buyer_id",
                    page: 1,
                    pageSize: 50
                },
                searchList: [
                    {
                        label: '买家ID',
                        value: 'buyer_id',
                    },
                    {
                        label: '联系方式',
                        value: 'link',
                    },
                ],
                tables: {
                    page: 1,
                    pageSize: 50,
                    totalSize: 0,
                    lists: []
                },
                titleName: '',
                showImport: false,
                checkData: []
            }
        },
        created() {
            this.init();
        },
        methods: {
    	    batch_import(row){
    	        this.checkData = row.map(item => item.id).join(',');
    	        this.showImport = true
            },
            change_label(val){
            	if(val==='buyer_id'){
                    this.changeLabel = `买家ID`;
                }else if(val==='link'){
                    this.changeLabel = `联系方式`;
                }
            },
            channel_remote(callback) {
                return this.$http(api_get_channel, {}).then(res => {
                    callback(res);
                }).catch(code => {
                    console.log(code);
                });
            },
            get_site(channel_id) {
                this.$http(api_account_list, {channel_id: channel_id}).then(res => {
                        if (res.account.length > 0) {
                            res = res.account;
                            this.accoutOptions = [{label: "全部", value: ""}, ...res];
                        } else {
                            this.accoutOptions = [{label: "", value: ""}];
                        }
                }).catch(code => {
                    console.log(code);
                })
            },
            init() {
                this.isLoad = true;
                this.$http(api_buyers_list, this.searchData).then(res => {
                    this.total = res.count;
                    this.tables.lists = res.data;
                    this.isLoad = false;
                    this.firstLoading = false;
                }).catch(code => {
                    this.isLoad = false;
                    console.log(code.message);
                });
            },
            update_data(id) {
                this.$http(api_buyers, id).then(data => {
                    this.tables.lists.forEach(res=>{
                        if(res.id===id){
                        	Object.assign(res,data.basic);
                            res.channel_id = data.basic.channel_name;
                            res.account_id = data.basic.account_name;
                        }
                    });
                });
            },
            update_delete(){
            	this.total--;
            },
            search() {
                this.init();
            },
            clear_search() {
                this.tables.page = '';
                this.tables.pageSize = '';
                this.searchData.channel_id = '';
                this.searchData.account_id = '';
                this.searchData.snType = 'buyer_id';
                this.searchData.snText = '';
                this.init();
            },
            add_list(val) {
                this.titleName = '添加买家信息';
                this.$refs.addEdit.activeName = 'base_info';
                this.markId = 0;
                if(this.$refs.addEdit.activeName === 'base_info'&&this.markId === 0){
                    this.add_dialog = val;
                }else{
                    this.$refs.addEdit.activeName = 'base_info';
                    this.markId = 0;
                }
            },
            handle_size_change(val) {
                this.searchData.pageSize = val;
                this.init()
            },
            handle_current_change(val) {
                this.searchData.page = val;
                this.init()
            },
            update_list(val) {
                this.addressId = val.id;
                this.$http(api_buyers, val.id).then(res => {
                    this.$refs.addEdit.baseInfo = res;
                    console.log("修改",res);
                    this.$refs.addEdit.activeName = 'base_info';
                })
                this.$http(api_addresses, {id: val.id}).then(res => {
                    this.$refs.addEdit.addressManagement = res;
                })
                this.titleName = `修改账号：${val.account_id} 的买家信息`;
                this.markId = 1;
                this.add_dialog = true;
            },
            update_address(val) {
                this.addressId = val.id;
                console.log("this.addressId",this.addressId);
                this.$http(api_buyers, val.id).then(res => {
                    this.$refs.addEdit.baseInfo = res;
                });
                this.$http(api_addresses, {id: val.id}).then(res => {
                    this.$refs.addEdit.addressManagement = res;
                    this.$refs.addEdit.activeName = 'address_management';
                });
                this.titleName = `修改账号：${val.account_id} 的买家信息`;
                this.markId = 1;
                this.add_dialog = true;
            },
            base_add(val){
            	console.log("新增",val);
                this.account_list(val);
                this.channel_list(val);
                let timestamp = Date.parse(new Date());
                timestamp = timestamp / 1000;
                val.create_time =  timestamp;
                this.tables.lists.unshift(val);
                this.total++;
            },
            account_list(val){
                this.$http(api_account_list, {channel_id: val.channel_id}).then(res => {
                    let account = res.account;
                    account.forEach(data=>{
                        if(data.value === val.account_id){
                            val.account_id = data.label;
                            console.log("val.account_id",val.account_id);
                        }
                    })
                }).catch(code => {
                    console.log(code);
                });

            },
            channel_list(val){
                switch(val.channel_id){
                    case 1:
                        val.channel_id = 'ebay';
                        break;
                    case 2:
                        val.channel_id = 'amazon';
                        break;
                    case 3:
                        val.channel_id = 'wish';
                        break;
                    case 4:
                        val.channel_id = 'aliExpress';
                        break;
                }
            }
        },
        watch: {
            'searchData.channel_id'(val) {
                this.get_site(val);
            }
        },
        computed: {
            accoutPlaceholder(){
            	if(this.accoutOptions.length<=1){
                    return "请先选择平台";
                }else{
                    return `请选择账号简称`;
                }
            }
        },
        components: {
            dataTable: require('./data-table.vue').default,
            addEdit: require('./add-edit.vue').default,
            labelItem: require('../../../components/label-item.vue').default,
            selectRemote: require('../../../components/select-remote.vue').default,
            searchCard:require('../../../components/search-card.vue').default,
            importExcel: require('./import-excel.vue').default,
        }
    }
</script>
