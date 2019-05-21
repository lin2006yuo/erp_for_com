<template>
    <page-dialog
    v-model="dialog"
    title="错误信息"
    >
        <el-table
            :data="datavalue"
            style="width: 100%">
            <el-table-column
                prop="row"
                label="错误行数">
            </el-table-column>
            <el-table-column
                prop="item_id"
                label="错误信息">
            </el-table-column>
        </el-table>
    </page-dialog>
</template>

<script>
    export default {
        data(){
            return{
                dialog:false
            }
        },
        watch: {
            value(val) {
                this.dialog = val
            },
            dialog(val) {
                this.$emit('input', val)
            }
        },
        props:{
          value:{
              type:Boolean,
              require:true
          },
          datavalue:{
              type:Array,
              require:true
          }
        },
        components:{
            pageDialog:require('@/components/page-dialog').default
        }
    }
</script>

<style scoped>

</style>
