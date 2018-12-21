<template>
    <el-row class="p-rate-table">
        <ui-table
             class="mt-xs"
             :body-height="41"
             v-loading="loading"
             element-loading-text="玩命加载中..."
             :has-data="tableData.lists.length>0"
             :heads="[
                {label:'代码',width:12},
                {label:'符号',width:11},
                {label:'名称',width:15},
                {label:'官方汇率',width:12},
                {label:'我的汇率',width:12},
                {label:'是否是主货币',width:12},
                {label:'最后更新时间',width:14},
                {label:'操作',width:12}
             ]"
        >
            <draggable  v-if="tableData.lists.length>0"  v-model="tableData.lists" tag="tbody" @update="draggable_change(tableData.lists)">
                <tr v-for="(item,index) in tableData.lists" :key="item.id" :class="[clickData[index]?'active-color':'']" @click="addClass(index)">
                    <!--代码-->
                    <td>
                        <ui-tip :content="item.code" :width="98"></ui-tip>
                    </td>
                    <!--符号-->
                    <td>
                        <ui-tip :content="item.symbol" :width="98"></ui-tip>
                    </td>
                    <!--名称-->
                    <td class="drag-public drag-public-right">
                        <ui-tip :content="item.name" :width="98"></ui-tip>
                    </td>
                    <!--官方汇率-->
                    <td>
                        <ui-tip :content="item.official_rate" :width="98"></ui-tip>
                    </td>
                    <!--我的汇率-->
                    <td>
                        <div>
                            <div v-if="!item.edit" :class="item.editContext ? 'edit-context' : ''" @dblclick="edit(item)">{{item.system_rate}}</div>
                            <template v-else>
                                <el-input class="inline" :value="item.system_rate" @input="(val)=>{input(val,item)}"></el-input>
                                <div class="inline opearate">
                                    <i class="el-icon-circle-check" @click="submit(item)"></i>
                                    <i class="el-icon-circle-close" @click="cancel(item)"></i>
                                </div>
                            </template>
                        </div>
                    </td>
                    <!--是否是主货币-->
                    <td>{{item.main}}</td>
                    <!--最后更新时间-->
                    <td>
                        <ui-tip :content="filterTime(item.official_update_time)" :width="98"></ui-tip>
                    </td>
                    <!--操作-->
                    <td>
                        <permission
                                tag="span"
                                :route="apis.url_history"
                                class="operate"
                                v-if="!item.main"
                                @click="history(item)">历史记录</permission>
                    </td>
                </tr>
            </draggable>
        </ui-table>
        <el-pagination
                class="page-fixed"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="tableData.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="tableData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableData.total">
        </el-pagination>
        <history-list v-model="showHistory" :code="code" ref="history"></history-list>
    </el-row>
</template>
<style lang="stylus">
    .edit-context{
        color: red;
    }
    .p-rate-table{
        .el-table__body-wrapper{
            overflow-x: hidden;
        }
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        .opearate{
            i:hover{
                color: #54b5f8;
            }
            i:active{
                color: #418dbe;
            }
        }
    }
</style>
<script>
    import {api_change} from '../../../../api/rate';
    import {url_history} from '../../../../api/rate';
    export default{
        permission:{
            url_history
        },
        data(){
            return {
                showHistory:false,
                code:0,
                isDrag:false,
                sortList:[],
                clickData:[],
            }
        },
        mounted(){
            for(let i=0;i<this.tableData.lists.length;i++){
                this.clickData.push(false)
            }
        },
        methods:{
            filterTime(val){
                return val?datef('YYYY-MM-dd HH:mm:ss',val):'-- --';
            },
            addClass(index){
                this.clickData=this.clickData.map(()=>{
                    return  false
                })
                this.clickData[index]=true
            },
//           拖动排序
            draggable_change(data){
                this.isDrag = true;
                this.sortList = [];
                data.forEach((row,i)=>{
                    this.sortList.push({id:row.id,sort:i});
                });
                this.$nextTick(()=>{
                    this.$emit("draggable-change",this.sortList);
                })
            },
            edit(row){
                if(!row.main){
                    this.$set(row, "old", row.system_rate);
                    this.$set(row, "edit",true);
                }else{
                    this.$message({
                        type:'error',
                        message:'主货币无法修改汇率'
                    })
                }

            },
            input(val, row){
                row.system_rate = val;
                if(row.editContext === undefined){
                    this.$set(row, 'editContext',false);
                }
                row.editContext = true;
            },
            submit(row){
                this.$http(api_change, row.id, row.system_rate).then(res=>{
                    row.edit = false;
                    row.editContext = false;
                }).catch(code=>{
                    row.editContext = true;
                })
            },
            cancel(row){
                row.system_rate = row.old;
                row.edit = false;
                row.editContext = false;
            },
            handleSizeChange(pageSize){
                this.$emit('page-size',pageSize);
            },
            handleCurrentChange(page){
                this.$emit('page', page);
            },
            history(row){
                this.$refs.history.titleName=row.name+"汇率的历史记录"
                this.showHistory = true;
                this.code = row.id;
            },
            ftime(time){
                return datef("YYYY-MM-dd HH:mm:ss", time);
            }
        },
        watch:{
            showHistory(val){
                if(!val){
                    this.code = 0;
                }
            }
        },
        props:{
            tableData:{
                required:true,
                type:Object
            },
            loading:{
                required:true,
                type:Boolean
            }
        },
        components: {
            historyList:require('./history-list.vue').default,
            uiTable:require('../../../../components/ui-table.vue').default,
            draggable:require('../../../../components/drag-drop').default,
            uiTip:require('../../../../components/ui-tip.vue').default,
        }
    }
</script>
