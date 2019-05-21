<template>
    <el-table :data="tableData"
              v-loading="loading"
              v-resize="{height:41}"
              element-loading-text="玩命加载中..."
              highlight-current-row>
        <div slot="empty" class="no-data-reminder">
            <i></i>
            {{emptyText}}
        </div>

        <el-table-column prop="id" label="NO." width="70">

        </el-table-column>
        <el-table-column prop="keyword" label="关键词">

        </el-table-column>
        <el-table-column prop="channel" label="平台">

        </el-table-column>
        <el-table-column prop="account_code" label="账号简称">

        </el-table-column>
        <el-table-column prop="type_name" label="类型">

        </el-table-column>
        <el-table-column label="是否自动回复" inline-template>
            <span>{{row.auto_reply | respondFilter}}</span>

        </el-table-column>
        <el-table-column prop="buyer_id" label="买家ID/账号">

        </el-table-column>
        <el-table-column label="接收时间" inline-template>
            <span>{{row.receive_time | timeFilter}}</span>
        </el-table-column>
        <el-table-column label="操作" inline-template>
            <template>
                <span class="operate" @click="view(row)">查看内容</span>
            </template>
        </el-table-column>
    </el-table>

</template>

<script>
    export default {
        data() {
            return {}
        },
        computed: {
            emptyText() {
                return this.firstLoading?'等待请求数据中...':'暂无数据'
            },
        },
        methods: {
            view(row){
                this.$emit('get-form',row)
            },
        },
        filters: {
            timeFilter(val) {
                return val >0 ? datef('YYYY-MM-dd HH: mm: ss', val) : '- -';
            },
            respondFilter(val) {
                switch(val){
                    case 0:
                        return '否';
                        break;
                    case 1:
                        return '是';
                        break;
                    default:
                        return '- -'
                }
            },
        },
        props: {
            tableData: {required: true, type: Array},
            loading: {required: true, type: Boolean},
            firstLoading: {required: true, type: Boolean},
        },
        components: {},
    }
</script>

<style scoped>

</style>
