<template>
    <div class="ymx-setting-p-log">
        <page-dialog v-model="show" :title="`查看账户：${title} 的操作日志`"  :close-on-click-modal="false">
            <el-table
                    :data="logData"
                    class="scroll-bar"
                    style="width: 100%">
                <el-table-column
                        prop="id"
                        label="ID"
                        width="50">
                </el-table-column>
                <el-table-column
                        inline-template
                        width="100"
                        label="操作人">
                    <span>{{row.operator.realname}}</span>
                </el-table-column>
                <el-table-column
                        inline-template
                        width="120"
                        label="操作时间">
                   <times :time="row.time"></times>
                </el-table-column>
                <el-table-column
                        prop="remark"
                        label="操作内容">
                </el-table-column>
            </el-table>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    export default{
        data(){
            return {
                show:false,
            }
        },
        created(){
        },
        mounted(){
        },
        computed: {},
        methods: {},
        filters: {},
        watch: {
            show(val){
                this.$emit("input",val)
            },
            value(val){
                this.show=val;
            }
        },
        props: {
            value:{},
            title:{},
            logData:{},
        },
        components: {
            pageDialog:require("../../../components/page-dialog.vue").default
        }
    }
</script>
