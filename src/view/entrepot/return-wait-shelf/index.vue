<template>
    <page>
        <search-module @init-data="init_data"
                       ref="search_module">
        </search-module>
        <div class="mt-xs ml-sm">
            <request-button :disabled="!selectData.length"
                            req-key="apiAddEdit5"
                            @click="putaway">上架
            </request-button>
            <el-button type="primary"
                       size="mini"
                       :disabled="!selectData.length"
                       @click="print">打印
            </el-button>
        </div>
        <table-module :search-data="searchData"
                      @select-check="selectCheck"
                      class="mt-xs"
                      ref="table_module">
        </table-module>
        <preview v-model="previewVisible" :select-data="selectData" :preview-action="previewAction"></preview>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_reback_shelves_batch,api_change_into_grounding} from '../../../api/reback-shelves';
    export default {
        page:{
            devinfo:{
                frontEnd:'黎宏珍',
                backEnd:'刘志勇',
                createTime:'2017-12-21',
                updateTime:'2017-12-21'
            },
        },
        refresh(){
            this.$refs.search_module.init();
        },
        data(){
            return {
                searchData:{},
                select:[],
                previewVisible:false,
                previewAction:{},
                selectData:[]
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
            putaway(){
                let find = this.selectData.find(row=>!row.quantity);
                if(find){
                    this.$message({type:'warning',message:'您选择的上架商品中包含数量为0的情况，上架的数量不能为0，请重新选择！'});
                    setTimeout(()=>{
                        this.$reqKey(`apiAddEdit5`, false);
                    },200);
                    return;
                }else{
                    let select =this.selectData.map(row=>{
                        return {
                            id:row.cargo_goods_id,
                            quantity:row.quantity
                        }
                    });
                    this.$confirm(`您将上架这${select.length}个商品,确认此操作吗？`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$http(api_change_into_grounding, {data:select}).then(res=>{
                            this.$message({type:"success",message:res.message||res});
                            // this.select = [];
                            this.$refs.table_module.delete_goods(res.data);
                        }).catch(code=>{
                            this.$message({type:"error",message:code.message || code});
                        })
                    }).catch(() => {
                        this.$message({type: 'info',message: '已取消'});
                    }).finally(()=>{
                        setTimeout(()=>{
                            this.$reqKey(`apiAddEdit5`, false);
                        },200);
                    });
                }
            },
            selectCheck(select){
                this.selectData = select;
            },
            print(){
                this.previewVisible = true;
                this.previewAction = {
                    title:'打印'
                }
            }
        },
        components: {
            searchModule:require('./search-module.vue').default,
            tableModule:require('./table-module.vue').default,
            preview:require('./preview.vue').default,
            requestButton:require('../../../global-components/request-button.vue').default,
        },
    }
</script>
