<template>
    <div class="c-table-data">
        <ui-table v-loading="loading" :first-loading="firstLoading" element-loading-text="玩命加载中..." :has-data="tableData.list.length>0"
                  class="ebay"  @sort-click="sort_click" :body-height="38"
                  :heads="filterHeads"
        >
            <tbody>
            <template v-for="(data, index) in tableData.list">
                <tr :class="[clickData[index]?'active-color':'']" @click="addClass(index)" :key="index">
                    <!--SPU-->
                    <td >
                        <ui-tip :content="data.spu" :width="78" ></ui-tip>
                    </td>
                    <td>
                        <span>{{data.publish_time|fdatetime}}</span>
                    </td>
                    <!--开发员 -->
                    <td>
                        <ui-tip :content="data.developer" :width="68"></ui-tip>
                    </td>
                    <td>
                        <ui-tip :content="data.total_num" :width="68"></ui-tip>
                    </td>
                    <template v-for="(row,row_i) in tableData.list[index].statistics">
                        <td >
                            <span class='operate' @click="req(data,row)"> {{row.num}}</span>
                        </td>
                    </template>
                </tr>
            </template>
            </tbody>
        </ui-table>
        <el-pagination
                class="page-fixed"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page=tableData.page
                :page-sizes="[20,50,100,200,500]"
                :page-size=tableData.pageSize
                layout="total, sizes, prev, pager, next, jumper"
                :total=total>
        </el-pagination>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_info_channel} from '../../../api/shelf-statistics'
    export default {
        data() {
            return {
                clickData:[],
                infoData:[]
            }
        },
        mounted(){
            this.tableData.list.forEach(row=>{
                if(row){
                    this.clickData.push(false);
                }
            });
        },
        methods:{
            req(row,info){
                let params = {};
                    this.$set(params,'id',row.id);
                    this.$set(params,'channel_id',info.channel_id);
                this.$http(api_info_channel,params).then(res=>{
                    this.infoData=res;
                    this.$emit('get-info',row,this.infoData)
                })

            },
            addClass(index) {
                this.clickData = this.clickData.map(() => {
                    return false
                });
                this.clickData[index] = true
            },
            handleCurrentChange(val){
                this.$emit('current-change',val);
            },
            handleSizeChange(val){
                this.$emit('size-change',val);
            },
            //升降序
            sort_click(val) {
                this.$emit("sort-click", val);
            },
        },
        filters:{
            fdatetime(val) {
                return datef("YYYY-MM-dd", val)
            }
        },
        computed: {
            emptyText() {
                return this.firstLoading ? '请查询数据' : '暂无数据'
            },
            filterHeads(){
                let findHeads = this.tableData.list.find(row=>row.statistics.length>0);
                if(findHeads) {
                    let heads = findHeads.statistics.map(row => {
                        return {
                            label: row.name,
                            width: 4,
                        }
                    });
                    return [
                        {label: 'SPU', width: 5},
                        {label:'上架时间',width:5,isSort:true,order_type:'publish_time'},
                        {label: '开发员', width: 5},
                        {label:'刊登总数',width:5,isSort:true,order_type:'total_num'},
                        ...heads
                    ]
                }else {
                    return [
                        {label: 'SPU', width: 5},
                        {label: '开发员', width: 5}
                    ]
                }
            }
        },
        props:{
            platlist:{
                type:Array
            },
            tableData:{
                required:true,
                type:Object
            },
            loading:{
                required:true,
                type:Boolean,
            },
            total:{},
            firstLoading:{
                type: Boolean,
                require:true
            }
        },
        components: {
            uiTip:require('@/components/ui-tip.vue').default,
            uiTable: require("@/components/ui-table.vue").default,
        }
    }
</script>