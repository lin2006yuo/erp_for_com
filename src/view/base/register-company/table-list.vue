<template>
    <div>
        <el-table :data="tableData.data"
                  border
                  v-loading="loading"
                  v-resize="{height:41}"
                  element-loading-text="玩命加载中"
                  empty-text="暂无数据"
                  align="center">
            <el-table-column label="No."
                             width="40"
                             prop="id">
            </el-table-column>
            <el-table-column label="公司法人"
                             prop="corporation">
            </el-table-column>
            <el-table-column label="法人身份证号"
                             prop="corporation_identification">
            </el-table-column>
            <el-table-column label="工商代理"
                             prop="ic_agent">
            </el-table-column>
            <el-table-column label="注册状态"
                             prop="status_txt">
            </el-table-column>
            <el-table-column label="添加人">
                <template slot-scope="scope">
                    <el-popover placement="right"
                                width="200"
                                trigger="hover"
                                :open-delay="500">
                        <span v-text="scope.row.department_name"></span>
                        <span slot="reference">{{scope.row.creator_txt}}</span>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="添加时间"
                             prop="create_time_txt">
            </el-table-column>
            <el-table-column label="操作"
                             prop="evidence_word">
                <template slot-scope="scope">
                    <span v-for="(item,index) in show_operation(scope.row)"
                          :key="item.id">
                        <span v-if="index!==0" class="ml-mini mr-mini">|</span>
                        <span @click="operates(scope.row,item)"
                              class="operate">{{item.label}}
                        </span>
                    </span>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="$emit('change-size',$event)"
                @current-change="$emit('change-page',$event)"
                :current-page=tableData.page
                :page-sizes="[20,50,100,200,500]"
                :page-size=tableData.pageSize
                layout="total,sizes,prev,pager,next,jumper"
                :total=tableData.count>
        </el-pagination>
    </div>
</template>

<style lang="stylus" scoped>

</style>

<script>
    export default {
        name: "table-list",
        data() {
            return {
                operations:[
                    {label:'查看',id:1,action(row){this.$emit('operate',row,'look-over')}},
                    {label:'处理',id:2,action(row){this.$emit('operate',row,'deal-with')}},
                ]
            }
        },
        methods: {
            show_operation(row){
                return this.operations.filter(operate=>{
                    switch (operate.id){
                        case 1:
                            return true;
                        case 2:
                            let arr=['已作废','注册完成'];
                            return !arr.includes(row.status_txt);
                    }
                })
            },
            operates(row,operate){
                operate.action.call(this,row,operate);
            }
        },
        props: {
            tableData:{
                default(){
                    return {
                        data:[],
                        page:1,
                        pageSize:50,
                        total:0
                    }
                }
            },
            loading:Boolean
        },
    }
</script>

