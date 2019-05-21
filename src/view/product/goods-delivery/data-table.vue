<template>
    <div>
        <ui-table
            ref="table"
            v-loading="loading"
            element-loading-text="玩命加载中..."
            :body-height="41"
            :first-loading="firstLoading"
            :has-data="tableData.length>0"
            v-model="checkAll"
            @check="head_check"
            :heads="tableHead">
            <tbody>
            <template v-for="(item,index) in tableData">
                <tr :key="index">
                    <td>
                        <el-checkbox v-model="item.check" @change="change_check(item,$event)"></el-checkbox>
                    </td>
                    <td>
                        {{item.update_time}}
                    </td>
                    <td>
                       {{item.sku}}
                    </td>
                    <td>
                        <ui-tip :content="item.goods_name"></ui-tip>
                    </td>
                    <td>
                        <ui-tip :content="item.status"></ui-tip>
                    </td>
                    <td>
                        <ui-tip :content="item.goods_category"></ui-tip>
                    </td>
                    <td>
                        <ui-tip :content="item.push_status"></ui-tip>
                    </td>
                    <td>
                        <ui-tip :content="item.log"></ui-tip>
                    </td>
                    <td>
                        <ui-tip :content="item.push_time"></ui-tip>
                    </td>
                </tr>
            </template>
            </tbody>
        </ui-table>
        <el-pagination
            class="page-fixed"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="searchData.page"
            :page-sizes="[10,50,100,200]"
            :page-size="searchData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    export default {
        data(){
            return {
                tableHead:[
                    {isCheck:true,width:2},
                    {label:'更新时间',width:10},
                    {label:'SKU',width:10},
                    {label:"产品中文名称",width:21},
                    {label:"SKU状态",width:5},
                    {label:"分类",width:10},
                    {label:"推送结果",width:7},
                    {label:"日志",width:25},
                    {label:"执行时间",width:10},
                ],
                checkAll:this.value,
            }
        },
        methods:{
            head_check(val){
                this.tableData.forEach(item=>{
                    this.$set(item,"check",val);
                })
            },
            handleSizeChange(val){
                this.$set(this.searchData,'pageSize',val);
                this.$emit('init');
            },
            handleCurrentChange(val){
                this.$set(this.searchData,'page',val);
                this.$emit('init');
            },
            change_check(item,event){
              this.checkAll = !this.tableData.find(item=>{
                    return !item.check;
                });
            }
        },
        watch:{
            value(val){
                this.checkAll = val;
            },
            checkAll(val){
                this.$emit('change-ckeck-all',val);
            }
        },
        components:{
            uiTable:require("@/components/ui-table.vue").default,
            uiTip:require("@/components/ui-tip.vue").default,
        },
        props:{
            tableData:{
                type:Array,
            },
            searchData:{

            },
            firstLoading:{
                type:Boolean,
                default:()=>{
                    return false;
                }
            },
            loading:{
                type:Boolean,
                default:()=>{
                    return false;
                }
            },
            total:{

            },
            value:{

            }
        }
    }
</script>

