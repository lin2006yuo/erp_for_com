<template>
    <ui-card>
        <span slot="header" class="title">
            {{curTitle}}（{{curDate}}）
            <span class="operate ml-sm" @click="refresh_list">刷新列表</span>
            <span class="operate ml-sm" @click="look_detail">查看详情</span>
        </span>
        <el-table
            class="scroll-bar"
            :data="tableData"
            v-loading="loading"
            v-resize="{height:41}"
            element-loading-text="玩命加载中..."
            highlight-current-row>
            <el-table-column label='部门' prop="name"></el-table-column>
            <el-table-column label='负责人' prop="leader_name"></el-table-column>
            <el-table-column label='销售额目标(＄)' prop="target_amount"></el-table-column>
            <el-table-column label='已完成(＄)' prop="actual_amount"></el-table-column>
            <el-table-column label='进度' inline-template>
                <div>{{row.rate}}%</div>
            </el-table-column>
        </el-table>
        <monthly-target-detail v-model="dialog"
                               :cur-date="curDate"></monthly-target-detail>
    </ui-card>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_monthly_target} from '@/api/monthly-target';
    export default {
        data() {
            return {
                tableData:[],
                loading:false,
                dialog:false,
            }
        },
        mounted(){
            let refresh = false;
            this.init(refresh);
        },
        methods:{
            look_detail(){
                this.dialog = true;
            },
            refresh_list(){
                let refresh = true;
                this.init(refresh);
            },
            init(refresh){
                let dateList = this.curDate.split("-");
                let params = {
                    year:dateList[0],
                    monthly:dateList[1],
                    info:0,
                };
                this.loading = true;
                this.$http(api_get_monthly_target,params).then(res => {
                    this.tableData = res;
                    if(refresh)this.$message({type:'success',message:`${this.curTitle}加载完成...`})
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code})
                }).finally(()=>{
                    this.loading = false;
                })
            }
        },
        computed:{
            curDate(){
                let date = new Date().getTime()/1000;
                return datef('YYYY-MM-dd',date);
            },
            curTitle(){
                return '销售额月度目标进度';
            }
        },
        props:{

        },
        components: {
            uiCard:require('@/components/ui-card.vue').default,
            monthlyTargetDetail:require('./monthly-target-detail.vue').default,
        }
    }
</script>