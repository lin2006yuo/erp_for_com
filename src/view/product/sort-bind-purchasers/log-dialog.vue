<template>
    <page-dialog size="large" v-model="dialog" :close-on-click-modal="false" :title="title">
        <div class="log">
        <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
        label="操作时间"
        width="200">
            <template slot-scope="scope">
                <span>{{scope.row.create_time|fdatetime}}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作人" prop="operator" >

        </el-table-column>
        <el-table-column
        label="操作内容"
        prop="title"
        >
        </el-table-column>
        </el-table>
        <div slot="footer" class="foot">
            <el-button @click="close">关闭</el-button>
        </div>
        </div>
    </page-dialog>
</template>

<script>
    export default {
        data() {
            return {
                dialog: this.value
            }
        },
        methods: {
            close() {
                this.dialog=false;
            }
        },
        filters:{
            fdatetime(val) {
                return datef("YYYY-MM-dd HH:mm:ss", val)
            }
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;

            },
        },
        props:{
            title:{},
            value:{},
            tableData:{}
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
        }
    }
</script>

<style scoped>
.foot{
        position: absolute;
        right: 10px;
        bottom: 10px;
    }
</style>