<template>
    <div class='p-batch-setting'>
        <page-dialog :title="title" v-model="showDialog" size="large" :close-on-click-modal="false" >
            <el-table
                    :data="payments"
                    border
                    style="width: 100%"
                    height="400"
            >
                <el-table-column
                        prop="trading_time"
                        label="日期">
                </el-table-column>
                <el-table-column
                        prop="payment_id"
                        label="付款ID">
                </el-table-column>
                <el-table-column
                        prop="supplier"
                        label="付款提供商">
                </el-table-column>
                <el-table-column
                        prop="trading_status"
                        label="付款状态">
                </el-table-column>
                <el-table-column
                        prop="money"
                        label="金额">
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click.native="showDialog=false">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus" scoped>
</style>
<script>
    export default {
        data() {
            return {
                showDialog:false,
            }
        },
        created() {
        },
        mounted() {
        },
        computed: {},
        methods: {
        },
        watch: {
            value(val){
                this.showDialog = val;
            },
            showDialog(val){
                this.$emit('input',val);
            },
        },
        filters: {},
        props: {
            value:{
                type:Boolean,
                default(){
                    return false;
                },
            },
            title:{

            },
            payments:{

            }
        },
        components: {
            pageDialog: require('@/components/page-dialog').default,
        }
    }
</script>

