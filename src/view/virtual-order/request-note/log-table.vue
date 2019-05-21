<template>
    <div class="c-log-table">
        <page-dialog title="查看操作日志" v-model="dialog" @open="open"
                     size="large" :close-on-click-modal="false">
            <el-table
                class="scroll-bar"
                :data="logData"
                v-loading="loading"
                element-loading-text="玩命加载中..."
                highlight-current-row
            >
                <el-table-column label="操作人" prop="creator" width="120px"></el-table-column>
                <el-table-column label="操作时间" inline-template width="150px">
                    <div>
                        <times  v-if="row.created_time" :time="row.created_time"></times>
                        <label v-else>-- --</label>
                    </div>
                </el-table-column>
                <el-table-column label="操作状态" prop="status_txt" width="120px"></el-table-column>
                <el-table-column label="操作事项" inline-template>
                    <ui-tip :content="row.remark"></ui-tip>
                </el-table-column>
            </el-table>
            <div slot="footer">
                <el-button size="mini" class="inline" @click.native="dialog = false">关闭</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_open_log} from '../../../api/request-note';
    export default {
        data() {
            return {
                dialog:this.value,
                logData:[],
                loading:false,
            }
        },
        watch:{
            dialog(val){
                this.$emit("input",val);
            },
            value(val){
                this.dialog = val;
            }
        },
        methods:{
            open(){
                this.get_log_data();
            },
            get_log_data(){
                this.$http(api_open_log,this.curId).then(res=>{
                    this.logData = res;
                }).catch(code=>{
                    console.log(code);
                })
            },
        },
        props:{
            value:{},
            curId:{
                require:true
            }
        },
        components: {
            uiTip:require('../../../components/ui-tip.vue').default,
            pageDialog:require('../../../components/page-dialog.vue').default,
        }
    }
</script>