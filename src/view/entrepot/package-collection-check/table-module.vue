<template>
    <div class="p-package-review">
        <div class="table_head">
            <span class="ml-sm">当前集包信息</span>
        </div>
        <el-table :data="tableData"
                  v-resize="{height:40}"
                  v-loading="loading"
                  element-loading-text="玩命加载中"
                  class="scroll-bar"
                  highlightCurrentRow>
            <el-table-column
                    inline-template
                    label="集包单号">
                <div>
                    <img src="../../../assets/table-arrow.svg"
                         v-if="$index === 0"
                         style="width:20px;height: 15px;float: left;vertical-align: middle">
                    <ui-tip :content="row.code" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="集包重量（kg）">
                <div>
                    <ui-tip :content="row.package_weight" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="预估重量（kg）">
                <div>
                    <ui-tip :content="row.weight" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="正常差异范围（kg）">
                <div>
                    <ui-tip :content="`-${row.weight_left}~${row.weight_right}`"
                            :width="98">
                    </ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="差异重量（kg）">
                <div>
                    <ui-tip :content="row.weight_diff" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column
                    inline-template
                    label="状态">
                <div>
                    <ui-tip :content="row.status_txt" :width="98"></ui-tip>
                </div>
            </el-table-column>
        </el-table>
    </div>
</template>
<style lang="stylus">
    .p-package-review{
        .table_head{
            height:30px;
            line-height: 30px;
            border:1px solid #e0e6ed;
            background-color: #6295E9;
            color:white;
        }
        .c-label-item{

        }
        .c-label-item >*{
            vertical-align: baseline;
        }
    }

</style>
<script>
    import {api_put_package} from '../../../api/package-review'
    export default {
        data(){
            return {
                loading: false,
                tableData:[]
            }
        },
        mounted(){
        },
        methods: {
            async init(){
                this.loading = true;
                try {
                    let res = await this.$http(api_put_package, this.searchData);
                    res.data.package_weight = this.searchData.weight;
                    res.data.code = this.searchData.code;
                    let flag = this.tableData.findIndex(row=>{
                        return row.code === res.data.code;
                    });
                    if(flag === -1){
                        this.tableData.unshift(res.data);
                    } else {
                        this.tableData.splice(flag, 1, res.data);
                    }
                    this.searchData.weight = '';
                    this.searchData.code = '';
                    this.$emit('update-focus');
                    this.$message({type:"success",message:res.message||res});
                } catch (code){
                    this.$emit('warning', code.message || code);
                    this.$message({type:"error",message:code.message || code});
                } finally {
                    this.loading = false;
                }
            }
        },
        computed: {},
        watch: {},
        props: {
            searchData:{}
        },
        components: {
            uiTip:require('../../../components/ui-tip.vue').default
        },
    }
</script>
