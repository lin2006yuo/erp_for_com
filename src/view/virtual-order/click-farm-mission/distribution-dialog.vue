<template>
    <page>
        <page-dialog :title="isBuyer?'指定买家':'指定负责人'" v-model="distributionDialogShow" size="small" :close-on-click-modal="false" @close="close">
            <el-row type="flex" class="row-bg" justify="center">
                <label-item :label="isBuyer?'指定买家：':'指定负责人：'" class="mr-sm" style="margin: 10px auto">
                    <el-select  class="inline s-width-default" v-model="personID" filterable>
                        <el-option v-for="item in listOptions"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value"></el-option>
                    </el-select>
                </label-item>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" type="primary" @click.native="get_shift(personID)">确定</el-button>
                <el-button size="mini" @click.native="distributionDialogShow = false">取消</el-button>
            </div>
        </page-dialog>
    </page>
</template>
<style scoped lang="stylus">

</style>
<script>
    export default {
        name: "distribution-dialog",
        data(){
            return {
                distributionDialogShow: this.value,
                personID: ''
            }
        },
        methods: {
            close(){
                this.personID = ''
            },
            get_shift(val){
                this.$emit('confirm',val)
            }
        },
        watch: {
            value(val){
                this.distributionDialogShow = val;
            },
            distributionDialogShow(val){
                this.$emit('input',val);
            }
        },
        props: {
            value:{
                type:Boolean,
                default(){
                    return false;
                }
            },
            listOptions: {
                type: Array
            },
            isBuyer: {
                type: Boolean
            }
        },
        components: {
            pageDialog: require('@/components/page-dialog').default,
            labelItem:require('../../../components/label-item.vue').default,
        }
    }
</script>