<template>
    <div>
        <el-table border
                  highlight-current-row
                  :data="form.log"
                  style="width: 100%;">
            <el-table-column
                    width="90"
                    label="操作人"
                    inline-template>
                <el-popover placement="right"
                            width="200"
                            trigger="hover"
                            :open-delay="500">
                    <span v-text="row.department_name"></span>
                    <span slot="reference">{{row.operator}}</span>
                </el-popover>
            </el-table-column>
            <el-table-column
                    label="操作时间"
                    width="150"
                    inline-template>
                <div>{{row.create_time|fmsdatetime}}</div>
            </el-table-column>
            <el-table-column
                    label="操作内容"
                    prop="remark">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        name: "operation-info",
        props: {
            form:Object
        },
    }
</script>

