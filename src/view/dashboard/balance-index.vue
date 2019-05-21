<template>
    <ui-card class="c-balance-index"  height='330px'>
        <span slot="header" class="title">
            {{curTitle}}（{{curDate}}）
            <span class="operate ml-sm" @click="refresh_list">刷新列表</span>
            <span class="operate ml-sm" @click="look_detail">查看详情</span>
            <span class="operate ml-sm" @click="export_data">导出</span>
        </span>
        <div class="mb-sm">
            <el-radio v-model="radio" label="1" disabled>亚马逊</el-radio>
        </div>
        <el-table
            class="scroll-bar" 
            :data="tableData"
            v-loading="loading"
            element-loading-text="玩命加载中..."
            highlight-current-row>
            <el-table-column label='账号总数' prop="accounts"></el-table-column>
            <el-table-column label='总余额(CNY)' prop="balanceSum"></el-table-column>
            <el-table-column label='上次转账总金额(CNY)' prop="transferSum"></el-table-column>
        </el-table>
        <div class="rate-tips"><span class="high-light-tips">！</span>按今日汇率换算</div>
        <balance-detail v-model="detailDialog" :curDate="curDate"></balance-detail>

    </ui-card>
</template>
<style lang="stylus">
    .rate-tips{
        margin-top:10px;
        color:gray;
        font-size:1.2rem;
        font-weight:bold;
        text-decoration:underline;
        .high-light-tips{
            color: #ff511f;
            font-size:1.3rem;
        }
    }
</style>
<script>
    import {api_balance_list} from '@/api/balance-data';
    export default{
        data(){
            return{
                tableData:[],
                loading:false,
                detailDialog:false,
                radio:'1'
            }
        },
        mounted(){
            this.init(false);
        },
        methods:{
            export_data(){
                this.$message({type:'warning',message:'暂无接口'})
            },
            init(isRefresh){
                this.loading = true;
                this.$http(api_balance_list,{times:this.curDate}).then(res=>{
                    this.tableData = [res];
                    if(isRefresh)this.$message({type:'success',message:'刷新成功'});
                }).catch(code=>{
                    console.log(code);
                }).finally(()=>{
                    this.loading = false;
                })
            },
            refresh_list(){
                this.init(true)
            },
            look_detail(){
                this.detailDialog = true
            },
        },
        computed:{
            curTitle(){
                return '账号余额'
            },
            curDate(){
                return datef('YYYY-MM-dd',Date.now()/1000);
            }
        },
        props:{

        },
        components:{
            uiCard:require('@/components/ui-card.vue').default,
            balanceDetail:require('./balance-detail.vue').default,
        }
    }
</script>
