<template>
    <el-table border
              highlight-current-row
              :data="form.log"
              style="width: 100%;">
        <el-table-column
                width="90"
                prop="operator"
                label="操作人">
        </el-table-column>
        <el-table-column
                label="操作时间"
                width="150"
                inline-template>
            <div>{{row.create_time|fmsdatetime}}</div>
        </el-table-column>
        <el-table-column
                label="操作内容"
                prop="remark"
                inline-template>
            <div v-for="(content,index) in row.remark" :key="index">
                {{content}}
            </div>
        </el-table-column>
    </el-table>
</template>

<style lang="stylus" scoped>

</style>

<script>
    export default {
        name: "operation-log",
        props: {
            form:{},
            flag:{}
        },
    }
</script>

