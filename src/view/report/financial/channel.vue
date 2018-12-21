<template>
    <page>
        <el-card>
            <label-buttons label="平台：" :buttons="channels" @select="change">
                <el-button type="primary" @click.native="search">查询</el-button>
            </label-buttons>
        </el-card>

        <el-table :data="lists"   v-resize="{height:65}">
            <el-table-column property="code" label="账号简称">
            </el-table-column>
            <el-table-column property="month" label="月份销售额">
            </el-table-column>
            <el-table-column property="month_avg_ten" label="月份平均每10天销售额">
            </el-table-column>
            <el-table-column property="realname" label="销售员">
            </el-table-column>
            <el-table-column property="groupname" label="组长">
            </el-table-column>
            <el-table-column property="last_ten" label="上个旬 销售额">
            </el-table-column>
            <el-table-column property="target_amount" label="目标销售额">
            </el-table-column>
            <el-table-column property="amount" label="销售额">
            </el-table-column>
        </el-table>
    </page>
</template>
<style lang="stylus">

</style>
<script>

    import {api_get_channel_categories} from '../../../api/categories';
    import {api_report_channel} from '../../../api/report-channel';
    export default{
        page:{

        },
        name:'report-financial-account',
        data(){
            return{
                channel:0,
                channels:[],
                lists:[]
            }
        },
        mounted(){
            this.init_deps();
        },
        methods:{
            init_deps(){
                this.$http(api_get_channel_categories).then(res=>{
                    this.channels = res.map(row=>{
                        return {
                            name:row.title,
                            value:row.id
                        }
                    });
                })
            },
            search(){
                this.$http(api_report_channel,this.channel).then(res=>{
                    this.lists = res;
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    })

                })
            },
            change(i,item){
                this.channel = item.value;
            }
        },
        components:{
            labelItem:require('../../../components/label-item.vue').default,
            labelButtons:require('../../../components/label-buttons.vue').default,
        }
    }
</script>
