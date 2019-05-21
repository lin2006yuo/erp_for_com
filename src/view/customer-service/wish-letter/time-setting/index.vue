<template>
    <div class="time-setting">
        <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
                prop="replyLevel"
                label="回复级别"
                width="180"
                align="center">
            </el-table-column>
            <el-table-column
                prop="priority"
                label="优先级"
                width="180"
                align="center">
            </el-table-column>
            <el-table-column
                label="时间"
                width="180"
                align="center">
                <template slot-scope="scope">{{ `${scope.row.time}小时`  }}</template>
            </el-table-column>
            <el-table-column
                prop="remarks"
                label="备注"
                align="center">
            </el-table-column>
            <el-table-column
                label="操作"
                width="180"
                align="center">
                <template slot-scope="scope">
                <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">修改</el-button>
            </template>
            </el-table-column>
        </el-table>
        <form-dialog v-model="visible" :row="row" :title="title"/>
    </div>
</template>
    

<script>

    /**
     * The custom HTML `<textarea>` component.
     *
     * @author Sébastien
     * @license MIT
     */
    export default {
        name: 'my-textarea',
        data () {
            return {
            tableData: [{
                replyLevel: '一级',
                priority: '紧急',
                time: 12,
                remarks: 'jkjkjkjkjk'
            }],
            visible: false,
            title: '修改',
            row: {}
            }
        },
        props: {},
        methods: {
            handleEdit(index, row) {
                console.log(index, row);
                this.row = row
                this.visible = true
                console.log(this.visible)
            },
        },
        components: {
            formDialog: require('./form-dialog.vue').default
        }
    }
</script>