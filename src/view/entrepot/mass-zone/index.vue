<template>
    <page>
        <search-module @init-data="init_data"
                       ref="search_module">
        </search-module>
        <el-button type="primary"
                   size="mini"
                   @click="add"
                   class="ml-sm mt-xs">添加集结区
        </el-button>
        <table-module :search-data="searchData"
                      :newItem="new_item"
                      class="mt-xs"
                      ref="table_module">
        </table-module>
        <add-edit :edit-data="editData"
                  v-model="visible"
                  @newData="newData"
                  :searchData="searchData"
                  :action="action">
        </add-edit>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    export default {
        page:{
            devinfo:{
                frontEnd:'张明亮',
                backEnd:'赖永凤',
                createTime:'2017-11-14',
                updateTime:'2017-11-24'
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
                    warehouse_id:'',
                    start_num:'',
                    end_num:'',
                },
                action:{},
                new_item:{}
            }
        },
        mounted(){
            if(window.objlength(this.param)!==0){
                this.$refs.search_module.searchData.mass_zone_num = this.param.id;
                this.$refs.search_module.init();
            }
        },
        methods: {
            init_data(searchData){
                this.searchData = searchData;
                this.$nextTick(()=>{
                    this.$refs.table_module.init();
                });
            },
            add(){
                this.action = {title:'添加集结区', value:'add'};
                Object.keys(this.editData).forEach(key=>{
                    this.editData[key] = "";
                });
                this.editData.warehouse_id = this.searchData.warehouse_id;
                this.visible = true;
            },
            newData(data){
                this.new_item = data;
            },
        },
        computed: {},
        watch: {
            param(val){
                if(window.objlength(val)!==0){
                    this.$refs.search_module.searchData.mass_zone_num = val.id;
                    this.$refs.search_module.init();
                }
            }
        },
        props: {},
        components: {
            searchModule:require('./search-module.vue').default,
            tableModule:require('./table-module.vue').default,
            addEdit:require('./add-edit.vue').default
        },
    }
</script>
