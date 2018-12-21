<template>
    <page class="p-generate-order">
        <search-module @init-data="init_data"
                       ref="search_module">
        </search-module>
        <el-button type="primary" size="mini" class="mt-xs ml-sm" @click="add">添加播种车</el-button>
        <table-module :search-data="searchData"
                      @edit="edit"
                      :newItem="new_item"
                      class="mt-xs"
                      ref="table_module">
        </table-module>
        <add-edit :edit-data="editData"
                  v-model="visible"
                  @newData="newData"
                  ref="add_edit"
                  :searchData="searchData"
                  :action="action">
        </add-edit>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_edit_shelf} from '../../../api/sorting-shelf'
    export default {
        page:{
            devinfo:{
                frontEnd:'张明亮',
                backEnd:'赖永凤',
                createTime:'2017-11-9',
                updateTime:'2017-11-9'
            },
        },
        refresh(){
            this.$refs.search_module.init();
        },
        data(){
            return {
                searchData:{},
                tableData:[],
                visible:false,
                editData:{
                    name:'',
                    warehouse_id:'',
                    row_column:[],
                    is_default:'',
                    remark:'',
                    status:'',
                    is_sure:0,
                    rowList1: [],
                    colList1: [],
                    rowList2: [],
                    colList2: [],
                    rowList3: [],
                    colList3: [],
                },
                action:{},
                new_item:{}
            }
        },
        mounted(){
        },
        methods: {
            init_data(searchData){
                this.searchData = searchData;
                this.$nextTick(()=>{
                    this.$refs.table_module.init();
                });
            },
            add(){
                this.action = {title:'添加播种车', value:'add'};
                Object.keys(this.editData).forEach(key=>{
                    this.editData[key] = "";
                });
                this.editData.is_default = 0;
                this.editData.status = 0;
                this.editData.row_column = [
                    {row:'',column:''},
                    {row:'',column:''},
                    {row:'',column:''}
                ];
                this.editData.is_sure = 0;
                this.editData.warehouse_id = this.searchData.warehouse_id;
                this.editData.rowList1 = [];
                this.editData.colList1 = [];
                this.editData.rowList2 = [];
                this.editData.colList2 = [];
                this.editData.rowList3 = [];
                this.editData.colList3 = [];
                this.visible = true;
            },
            edit(row){
                this.action = {title:`编辑播种车${row.name}`, value:'edit'};
                this.$http(api_edit_shelf, row.id).then(res=>{
                    this.editData = res;
                    this.visible = true;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                });
            },
            newData(data){
                this.new_item = data;
            },
        },
        computed: {},
        watch: {},
        props: {},
        components: {
            searchModule:require('./search-module.vue').default,
            tableModule:require('./table-module.vue').default,
            addEdit:require('./add-edit.vue').default
        },
    }
</script>
