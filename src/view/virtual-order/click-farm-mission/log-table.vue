<template>
    <div class="c-log-table">
        <page-dialog title="查看操作日志" v-model="dialog" @open="open"
                     size="large" :close-on-click-modal="false">
            <el-table
                    class="scroll-bar"
                    :data="logData"
                    v-loading="loading"
                    element-loading-text="玩命加载中..."
                    highlight-current-row>
                <el-table-column label="操作人" prop="operator" width="120px"></el-table-column>
                <el-table-column label="操作时间" width="150px">
                    <!--<div>-->
                        <!--<times v-if="row.create_time" :time="row.create_time"></times>-->
                        <!--<label v-else>&#45;&#45; &#45;&#45;</label>-->
                    <!--</div>-->
                    <template slot-scope="scope">
                        <span>{{ scope.row.create_time*1000|fdatetime }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作状态" width="120px">
                    <template slot-scope="scope">
                        <span>{{ scope.row.type|filterType }}</span>
                    </template>
                </el-table-column>
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
    import {api_get_mission_log} from '../../../api/click-farm-mission';
    export default {
        data() {
            return {
                dialog:this.value,
                logData:[],
                loading:false,
            }
        },
        filters:{
            filterType(val){
                if(val === 0){
                    return '新增'
                }else if(val === 1){
                    return '修改'
                }else{
                    return '删除'
                }
            }
        },
        methods:{
            open(){
                this.get_log_data();
            },
            get_log_data(){
                this.$http(api_get_mission_log,this.curId).then(res=>{
                    this.logData = res;
                }).catch(code=>{
                    console.log(code);
                })
            },
        },
        watch:{
            dialog(val){
                this.$emit("input",val);
            },
            value(val){
                this.dialog = val;
            }
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