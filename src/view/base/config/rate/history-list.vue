<template>
    <page-dialog :title="titleName" v-model="show" size="large" :close-on-click-modal="false">
        <el-table
                v-resize="{height:141}"
                :data="table.data"
                border
                style="position: relative"
                highlight-current-row
                v-loading = "loading"
                element-loading-text="玩命加载中..."
        >
            <el-table-column label="时间" align="center" inline-template>
                <span>{{row.create_time}}</span>
            </el-table-column>
            <el-table-column label="官方汇率" prop="official_rate" align="center"></el-table-column>
            <el-table-column label="我的汇率" prop="system_rate" align="center"></el-table-column>
        </el-table>
        <el-row class="mt-xs">
            <el-pagination
                    class="fr"
                    @size-change="size_change"
                    @current-change="current_change"
                    :current-page="table.page"
                    :page-sizes="[20, 50, 100, 200,500]"
                    :page-size="table.pageSize"
                    layout="total,prev, pager, next, jumper"
                    :total="table.count">
            </el-pagination>
        </el-row>
        <el-row slot="footer">
            <el-button @click="show=false" size="mini">关闭</el-button>
        </el-row>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_history} from '../../../../api/rate';
    export default{
        data(){
            return{
                table:{
                    page:1,
                    pageSize:20,
                    data:[],
                    count:0,
                },
                show:this.value,
                res:{},
                loading:true,
                titleName:"汇率历史记录"
            }
        },
        methods:{
            size_change(size){
                this.table.pageSize = size;
                this.get_historyData();
            },
            current_change(page){
                this.table.page = page;
                this.get_historyData()
            },
            get_historyData(){
                this.loading = true;
                this.$http(api_history, this.code,{page:this.table.page,pageSize:this.table.pageSize}).then(res=>{
                    this.loading = false;
                    this.table.data = res.data;
                    this.table.count = res.count;
                }).catch(code=>{
                    console.log(code);
                    setTimeOut(()=>{
                        this.loading = false;
                    },300)
                })
            },
            ftime(time){
                return datef("YYYY-MM-dd HH:mm:ss", time);
            }
        },
        watch:{
            value(val){
                this.show = val;
            },
            show(val){
                this.$emit('input', val);
            },
            code(val){
                if(val){
                    this.get_historyData();
                }
            },
        },
        props:{
            code:{},
            value:{},
        },
        components:{
            pageDialog:require('../../../../components/page-dialog.vue').default
        }
    }
</script>
