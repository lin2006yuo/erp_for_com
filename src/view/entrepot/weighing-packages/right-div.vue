<template>
    <div class="p-weighing-packages">
        <div class="table_head">
            <span class="ml-sm">集包列表</span>
            <span class="fr mr-sm">
                <span>打印机：</span>
                <select-printer v-model="printer" class="inline width-lg"></select-printer>
            </span>
        </div>
        <el-table :data="collections"
                  v-resize="{height:10}"
                  v-loading="loading"
                  element-loading-text="玩命加载中"
                  class="scroll-bar"
                  highlight-current-row>
            <el-table-column
                    inline-template
                    min-width="100"
                    label="集包单号">
                <div>
                    <ui-tip :content="row.code" :width="98" class="inline"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="120"
                    label="邮寄方式">
                <div>
                    <ui-tip :content="row.shipping_name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="集包袋重量(g)">
                <div>
                    <ui-tip :content="row.collect_weight" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="60"
                    label="包裹数量">
                <div>
                    <ui-tip :content="row.quantity" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    min-width="60"
                    label="包裹重量(g)">
                <div>
                    <ui-tip :content="row.package_weight" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    min-width="60"
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text"
                               class="operat-color"
                               @click="print(scope.row)">打印
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_package_collection} from '../../../api/weighing-packages';
    export default {
        data(){
            return {
                loading:false,
                printer:'',
                printData:{},
            }
        },
        mounted(){
        },
        methods: {
            print(row){
                this.$http(api_package_collection, row.id, {type:4}).then(res=>{
                    this.$emit('print', res, {
                        code: row.code,
                        id: row.id,
                    }, this.printer);
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                });
            }
        },
        computed: {},
        props: {
            collections:{
                type:Array
            }
        },
        components: {
            uiTip:require('@/components/ui-tip.vue').default,
            selectPrinter:require('@/components/select-printer.vue').default,
        },
    }
</script>
