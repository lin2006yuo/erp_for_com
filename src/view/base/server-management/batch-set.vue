<template>
    <div>
        <page-dialog title="批量设置上报周期"
                     size="small"
                     v-model="showDialog"
                     @open="open"
                     :close-on-click-modal="false">
            <el-form class="mt-sm">
                <el-form-item label="上报周期：" label-width="200px">
                    <el-col :span="12">
                        <integer-input v-model="reporting_cycle" :min="1"></integer-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click.native="confirm">确定</el-button>
                <el-button size="mini" @click.native="showDialog = false">取 消</el-button>
            </div>
        </page-dialog>
    </div>
</template>

<style scoped>

</style>

<script>
    export default {
        data(){
          return{
              showDialog: this.value,
              reporting_cycle: 0
          }
        },
        methods:{
            open(){
              this.reporting_cycle = 0
            },
            confirm(){
                this.$emit('confirm',this.reporting_cycle)
            }
        },
        watch: {
            showDialog(val){
                this.$emit('input',val);
            },
            value(val) {
                this.showDialog = val;
            },
        },
        props: {
            value:{}
        },
        components: {
            pageDialog:require("../../../components/page-dialog.vue").default,
            integerInput:require('../../../components/integer-input.vue').default,
        }
    }
</script>