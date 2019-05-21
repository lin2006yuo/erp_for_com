<template>
    <div class="c-table-data">
        <el-table
            class="scroll-bar"
            :data="tableData.lists"
            v-resize="{height:41}"
            v-loading="loading"
            element-loading-text="玩命加载中..."
            highlight-current-row>
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column label="站点" inline-template row-key="id" width="100">
                <div>{{row.site_text}}</div>
            </el-table-column>
            <el-table-column inline-template :label="type===2?'产品模板名称':'分类模板名称'">
                <ui-tip :content="row.name"></ui-tip>
            </el-table-column>
            <el-table-column inline-template label="对应亚马逊分类" v-if="type===1">
                <ui-tip :content="row.class_name"></ui-tip>
            </el-table-column>
            <el-table-column inline-template label="成功次数" width="100">
                <ui-tip :content="row.success_total" :class="[parseInt(row.success_total)>0?'color-success':'']"></ui-tip>
            </el-table-column>
            <el-table-column inline-template label="失败次数" width="100">
                <ui-tip :content="row.error_total" :class="[parseInt(row.success_total)>0?'error':'']"></ui-tip>
            </el-table-column>
            <el-table-column inline-template  label="状态" width="100">
                <div>
                    <el-switch
                            v-model="row.status"
                            @change="change_status(row,$event)"
                            on-text="启用"
                            off-text="停用">
                    </el-switch>
                </div>
            </el-table-column>
            <el-table-column label="是否默认模板" inline-template width="120">
                <span>{{row.default | filterDefault}}</span>
            </el-table-column>
            <el-table-column prop="create_name" label="创建人" width="120"></el-table-column>
            <el-table-column prop="create_time" label="创建时间" width="180"></el-table-column>
            <el-table-column inline-template label="操作" width="100">
                <div>
                    <span class="operate" @click="edit(row)">编辑</span>
                    <span>|</span>
                    <span class="operate" @click="delete_data(row)">删除</span>
                </div>
            </el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="size_change"
                @current-change="current_change"
                :current-page="tableData.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="tableData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableData.total">
        </el-pagination>
    </div>
</template>
<style lang="stylus">

</style>
<script>
import {api_amazon_template_status} from '../../../../api/product-category-api';
    export default {
        data() {
            return {}
        },
        filters:{
            filterStatus(val){
                return val?'启用':'停用';
            },
            filterDefault(val){
                return val?'是':'否';
            },
        },
        methods:{
            change_status(row,val){
                this.$confirm(`您将要更改 ${row.name} 状态, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let enable = val?1:0;
                    this.$http(api_amazon_template_status,row.id,enable).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        row.status = val;
                    }).catch(code=>{
                        row.status = !val;
                        this.$message({type:"error",message:code.message||code});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                    row.status = !val;
                });

            },
            edit(row){
                this.$emit('edit',row);
            },
            delete_data(row){
                this.$emit('delete-data',row);
            },
            size_change(val){
                this.$emit('size-change',val)
            },
            current_change(val){
                this.$emit('current-change',val)
            },
        },
        computed: {
            emptyText(){
                return this.firstLoading?'等待请求数据中...':'暂无数据'
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
            },
            type:{//类别，1产品，2分类
                required:true,
                type:Number
            },
            firstLoading: {
                type: Boolean,
                required: true
            }
        },
        components:{
            uiTip:require('../../../../components/ui-tip.vue').default
        }
    }
</script>