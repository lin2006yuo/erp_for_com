<template>
    <page>
        <search-module @init-data="init_data"
                       ref="search_module">
        </search-module>
        <el-button type="primary"
                   size="mini"
                   @click="add"
                   class="ml-sm mt-xs">添加周转箱
        </el-button>
        <request-button req-key="batch_print" @click="batch_print"
                        :disabled="this.selectId.length === 0">打印标签
        </request-button>
        <request-button :disabled="this.selectId.length === 0" req-key="batch_remove" @click.native="batch_remove">批量释放</request-button>
        <table-module :search-data="searchData"
                      :newItem="new_item"
                      class="mt-xs"
                      @select-id="select_id"
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
    import {api_print_turnover,api_batch_remove} from '@/api/turnover-box';
    export default {
        page:{
            devinfo:{
                frontEnd:'张明亮,张志勇',
                backEnd:'赖永凤',
                createTime:'2017-11-14',
                updateTime:'2018-6-7'
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
                    type:'',
                    start_num:'',
                    end_num:'',
                    color:'',
                    status:0,
                },
                selectId:[],
                action:{},
                new_item:{}
            }
        },
        mounted(){
            if(window.objlength(this.param)!==0){
                this.$refs.search_module.searchData.turnover_box_num = this.param.id;
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
                this.action = {title:'添加周转箱', value:'add'};
                Object.keys(this.editData).forEach(key=>{
                    this.editData[key] = "";
                });
                this.editData.status = 0;
                this.editData.warehouse_id = this.searchData.warehouse_id;
                this.visible = true;
            },
            newData(data){
                this.new_item = data;
            },
            batch_print() {
                let ids = this.selectId;
                this.$http(api_print_turnover, {ids: ids}).then(res => {
                    this.$refs.table_module.print_turnover(res);
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey(`batch_print`, false);
                    }, 200);
                })
            },
            batch_remove(){//批量释放
                let remove_info = this.selectId.map(item=>{
                    return {id:item,is_force:0}
                })
                this.$http(api_batch_remove, {remove_info: remove_info}).then(res => {
                    console.log('批量释放：',res);
                    if(res.force_info.length!==0){
                        remove_info.forEach(row=>{
                            if(res.force_info.some(item=>item.id===row.id)) row.is_force = 1;
                        });
                        this.constraint_remove(remove_info,res.force_info);
                    }else{
                        this.$message({type: "success", message: res.message || res})
                    }
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                }).finally(() => {
                    setTimeout(() => {
                        this.$reqKey(`batch_remove`, false);
                    }, 200);
                })
            },
            constraint_remove(remove_info,force_info){//强制释放
                let force = force_info.map(row=>row.num).join(',');
                this.$confirm(`是否需要强制释放${force}的周转箱？`)
                    .then(_ => {
                            this.$http(api_batch_remove, {remove_info: remove_info}).then(res=>{
                                this.$message({type: "success", message: res.message || res})
                            }).catch(err=>{
                                this.$message({type: "error", message: err.message || err})
                            })
                    })
                    .catch(_ => {
                        this.$message({type: "error", message: _ })
                    });
            },
            select_id(data) {
                this.selectId = data;
                console.log('this.selectId', this.selectId);
            },
        },
        computed: {},
        watch: {
            param(val){
                if(window.objlength(val)!==0){
                    this.$refs.search_module.searchData.turnover_box_num = val.id;
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
