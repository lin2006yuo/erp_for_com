<template>
    <div class="target-schedule-dialog">
        <page-dialog title="销售额目标" :titleCenter="titleCenter" v-model="show" width="900px" :close-on-click-modal="false">
            <el-table
                :data="tableData"
                border
                style="width: 100%;margin:20px 10px 10px 0;">
                <el-table-column
                    width="80"
                    prop="department"
                    label="部门"
                >
                </el-table-column>
                <el-table-column
                    width="80"
                    prop="user_id"
                    label="销售员"
                >
                </el-table-column>
                <el-table-column
                    width="179"
                    prop="target_amount"
                    label="本月销售额目标($)">
                </el-table-column>
                <el-table-column
                    width="179"
                    prop="actual_amount"
                    label="本月已完成额($)">
                </el-table-column>
                <el-table-column
                    width="80"
                    label="昨日进度">
                    <template slot-scope="scope">
                        <div>
                            {{parseFloat(scope.row.rate_yesterday).toFixed(2)}}%
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    width="80"
                    label="当前进度">
                    <template slot-scope="scope">
                        <div>
                            {{parseFloat(scope.row.rate).toFixed(2)}}%
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    width="100"
                    prop="ranking"
                    label="部门排名">
                </el-table-column>
                <el-table-column
                    width="100"
                    label="较昨日排名">
                    <template  slot-scope="scope">
                       <div>
                           <span class="icon" v-if="scope.row.is_promote===1"><img src="../../assets/icon_up.svg" alt="上升"></span>
                           <span class="icon" v-if="scope.row.is_promote===2"><img src="../../assets/icon_under.svg" alt="下降"></span>
                           {{scope.row.ranking_yesterday}}
                       </div>
                    </template>
                </el-table-column>
            </el-table>
            <div v-if="tableData[0]" :class="{'marked-words':true,'red':tableData[0].is_promote===2,'green':tableData[0].is_promote===1}">
                {{tableData[0].message}}
            </div>
            <div slot="footer">
                <el-button type="primary" @click="show = false">确定</el-button>
            </div>
        </page-dialog>
    </div>
</template>

<style lang="stylus">
    .target-schedule-dialog{
        .marked-words{
            padding-top:20px;
            text-align:center;
            font-weight:bolder;
        }
        .red {
            color:red;
        }
        .green {
            color:green;
        }
        .icon{
            display: inline-block;
            width:1rem;
            height:1rem;
            img{
                width:100%;
                height:100%;
            }
        }
    }

</style>

<script>
    import {api_user_ranking} from '@/api/user';
    export default {
        data(){
            return {
                show:this.value,
                titleCenter: true,
                tableData:[]
            }
        },
        mounted(){
            this.get_user_ranking();
        },
        methods:{
            get_user_ranking(){
                console.log('执行一次');
                this.$http(api_user_ranking)
                    .then(res=>{
                        console.log('目标',res);
                        if(res.user_id){
                            this.show = true;
                            this.tableData.push(res);
                        }
                    })
                    .catch(err=>{
                        console.log(err);
                    })
            }
        },
        watch:{
            value(val){
                this.show=val;
            },
            show(val){
                this.$emit('change-show',val);
            }
        },
        props:{
            value: {
                required: true,
                type: Boolean
            },
        },
        components:{
            pageDialog: require('@/components/page-dialog.vue').default,
        }
    }
</script>


