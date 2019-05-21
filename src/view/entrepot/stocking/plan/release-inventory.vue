<template>
    <page-dialog
            size="large"
            v-model="show"
            :close-on-cilck-modal="false"
            title="释放库存">
        <el-table
                class="mt-xs scroll-bar"
                v-resize="{height:41}"
                :data="releaseList"
                border
                highlight-current-row>
            <el-table-column label="SKU" prop="sku">

            </el-table-column>
            <el-table-column label="分配数量" prop="allocated_qty">

            </el-table-column>
            <el-table-column label="剩余可用数量" prop="available_qty">

            </el-table-column>
            <el-table-column label="释放数量" inline-template>
                <div>
                    <integer-zero-input class="width-sm inline"
                                   :min="0"
                                   :max="row.available_qty"
                                   v-model="row.release_qty"></integer-zero-input>
                </div>
            </el-table-column>
        </el-table>
        <div slot="footer">
            <div>
                <el-button size="mini"
                           type="primary"
                           @click.native="submit">提交</el-button>
                <el-button size="mini"
                           @click.native="show = false">关闭</el-button>
            </div>
        </div>
    </page-dialog>
</template>

<script>
    export default {
        data() {
            return {
                show: this.value,
                releaseList: []
            }
        },
        methods: {
            submit(){
                let zero = this.releaseList.some(row => +row.release_qty === 0);
                if(zero){
                    this.$message({type: 'warning', message: '释放数量不能为0且不能大于剩余可用数量'});
                    return
                }
                let more = this.releaseList.some(row => +row.release_qty > +row.available_qty);
                if(more){
                    this.$message({type: 'warning', message: '释放数量不能大于剩余可用数量'});
                    return
                }
                this.$emit('confirm-release', this.releaseList)

            }
        },
        watch: {
            show(val){
                this.$emit('input', val);
                console.log(this.releaseList)
            },
            value(val){
                this.show = val
            }
        },
        props: {
            value:{
                required: true,
                type: Boolean
            },
            checkList:{
                required: true,
                type: Array
            }
        },
        components:{
            pageDialog: require('@/components/page-dialog').default,
            integerZeroInput: require('@/components/integer-zero-input').default
        }
    }
</script>

<style scoped>

</style>