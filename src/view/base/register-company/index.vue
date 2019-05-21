<template>
    <page>
        <search :buttons="buttonStatus"
                :search-data="searchData"
                :clears="clears"
                @search="init">
        </search>
        <el-row class="mt-xs mb-xs ml-sm">
            <el-button type="primary" size="mini" @click.native="add">添加</el-button>
        </el-row>
        <table-list :table-data="tableData"
                    :loading="loading"
                    @operate="operate"
                    @change-page="change_page"
                    @change-size="change_size">
        </table-list>
        <add-edit-dialog v-model="addEditShow"
                         :title="title"
                         :flag="flag"
                         :dialog-form="form"
                         :status-list="buttonStatus"
                         @refresh="init">
        </add-edit-dialog>
    </page>
</template>

<style lang="stylus" scoped>

</style>

<script>
    import addEditDialog from './add-edit-dialog';
    import {actions} from './action';
    export default {
        name: "index",
        data() {
            return {
                buttonStatus:[],
                searchData:{
                    status:'',
                    corporation:'',
                    corporation_identification:'',
                    create_time_st:'',
                    create_time_nd:''
                },
                clears:{
                    status:'',
                    corporation:'',
                    corporation_identification:'',
                    create_time_st:'',
                    create_time_nd:''
                },
                tableData:{
                    data:[],
                    page:1,
                    pageSize:50,
                    total:0
                },
                loading:false,
                addEditShow:false,
                title:'',
                flag:0,
                form:{
                    status:0,
                    corporation:'',
                    corporation_identification:'',
                    id_date_st:'',
                    id_date_nd:'',
                    corporation_id_front:[],
                    corporation_id_contrary:[],
                    corporation_address_zip:'',
                    legal_remark:'',
                    ic_agent:'',
                    id:0,
                    type:'',
                    source:'',
                    company:'',
                    company_registration_number:'',
                    business_term_st:'',
                    business_term_nd:'',
                    company_time:'',
                    company_address_zip:'',
                    charter_url:[],
                    corporate_settlement:'',
                    agency_settlement:'',
                    has_seal:'',
                    settlement_remark:'',
                    log:[],
                },
                actions:new actions(),
                corporation:false,
                company:false
            }
        },
        mounted() {
            this.actions.get_register_status(this);
            this.init();
        },
        methods: {
            init(){
                this.actions.register_init(this);
            },
            add(){
                this.deal_with_form();
                this.$set(this.form,'status',1);
                this.$set(this.form,'status_text','接收法人资料');
                this.$set(this.form,'id',0);
                this.title='添加公司资料';
                this.flag=0;
                this.addEditShow=true;
            },
            deal_with_form(){
                Object.getOwnPropertyNames(this.form).forEach(key=>{
                    this.form[key]='';
                });
                this.form.log=[];
                this.form.corporation_id_front=[];
                this.form.corporation_id_contrary=[];
                this.form.charter_url=[];
            },
            operate(row,string){
                this.deal_with_form();//清空上一条的字段值
                this.actions.operate(this,row,string);
            },
            change_page(page){
                this.$set(this.tableData,'page',page);
                this.init();
            },
            change_size(size){
                this.$set(this.tableData,'pageSize',size);
                this.init();
            }
        },
        components: {
            search:require('./search').default,
            tableList:require('./table-list').default,
            addEditDialog,
        },
    }
</script>

