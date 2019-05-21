<template>
    <page-dialog
        v-model="show"
        :title="title"
        size="mini"
       >
        <el-table
            :data="table"
            highlight-current-row
            height="450"
            >
            <div slot="empty" class="no-data-reminder">
                <i></i>
                无失败数据
            </div>
            <el-table-column label="账号简称" prop="name" width="180"></el-table-column>
            <el-table-column label="失败原因" prop="fail" width="180"></el-table-column>
        </el-table>
        <div slot="footer">
            <el-button size="mini" @click="show = false">关 闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
</style>
<script>
    export default {

        data() {
            return {
                show:this.value
            }
        },
        methods:{

        },
        watch:{
          show(val) {
              this.$emit('input', val);
          },
          value(val) {
              this.show = val;
          }
        },
        props:{
            value:{},
            title:{},
            table:{},
        }
    }
</script>
