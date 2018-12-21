<template>
    <el-table :data="tableData.lists" border  class="mb-sm scroll-bar"  v-loading="loading"
              element-loading-text="玩命加载中..."
              @selection-change="selection_change"
              @sort-change="sort_change"
              :default-sort="{prop:'data',order:'descending'}"
    >
        <div slot="empty" class="no-data-reminder">
            <i></i>
            {{emptyText}}
        </div>
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column label="模板名称" min-width="60" prop="name"></el-table-column>
        <el-table-column label="产品物流属性" min-width="60" prop="transport_property"></el-table-column>
        <el-table-column label="售价区间" min-width="60" >
            <template slot-scope="scope">
                <span>${{scope.row.from_price}}-{{scope.row.to_price}}</span>
            </template>
        </el-table-column>
        <el-table-column label="创建人" min-width="60" prop="creator_name"></el-table-column>
        <el-table-column label="添加时间" sortable min-width="60" >
            <template slot-scope="scope">
                <span>{{scope.row.create_time|fdatetime}}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作" min-width="60">
            <template slot-scope="scope">
                <el-button @click.native="edit(scope.row)" type="text">编辑</el-button>
                <el-button @click.native="del(scope.row)" type="text">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    export default {
        data(){
            return{

            }
        },
        computed: {
            emptyText() {
                return this.firstTime ? '请查询数据' : '暂无数据'
            }
        },
        methods: {
            edit(val) {
                this.$emit('edit',val)
            },
            del(val){
                this.$emit('delet',val)
            },
            selection_change(val){
                this.$emit('selection-change',val)
            },
            sort_change(column){
                console.log(999);
                console.log(column);
                this.$emit('sort-change',column)
            }
        },
        filters:{
            fdatetime(val) {
                return datef("YYYY-MM-dd", val)
            }
        },
        props: {
            tableData: {

            },
            loading: {
                type: Boolean,
                default: false
            },
            firstTime: {
                type: Boolean,
                default: true
            }
        },
    }
</script>

<style scoped>

</style>