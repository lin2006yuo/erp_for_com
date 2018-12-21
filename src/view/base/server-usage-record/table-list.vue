<template>
    <div>
        <el-table class="scroll-bar"
                  :data="table.list"
                  v-loading="loading"
                  element-loading-text="玩命加载中..."
                  highlight-current-row>
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>>
            <el-table-column label="NO." prop="id" width="100"></el-table-column>
            <el-table-column label="服务器名" prop="server_id"></el-table-column>
            <el-table-column label="外网IP" prop="ip"></el-table-column>
            <el-table-column label="记录时间" inline-template width="200">
                <span>{{row.create_time }}</span>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                key: ''
            }
        },
        computed:{
            emptyText() {
                return this.firstTime?'等待查询数据中...':'暂无数据'
            },
        },
        filters:{
            fdatetime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val)
            }
        },
        props:{
            firstTime:{},
            loading:{},
            table:{}
        }
    }
</script>

<style scoped>

</style>