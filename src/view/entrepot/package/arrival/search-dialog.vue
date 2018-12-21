<template>
    <div>
        <page-dialog title="运单号"
                     v-model="visible"
                     size="small"
                     :close-on-click-modal="false"
                     class="arrivals">
            <label class="t-left">运单号：</label>
            <el-select v-model="parcelCode" placeholder="请选择" class="inline">
                <el-option
                        v-for="(item, index) in purchaseNote"
                        :label="item.tracking_number"
                        :value="item.purchase_parcel_code"
                        :key="index">
                </el-option>
            </el-select>
            <div slot="footer" class="dialog-footer mt-sm">
                <el-button @click.native="search_again" type="primary" size="mini">确认</el-button>
                <el-button @click.native="visible = false" size="mini">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .arrivals .inner{
        width: 280px;
        height: 150px;
        text-align: center;
    }
    .arrivals .dialog__body{
        height: 50px;
    }
</style>
<script>
    export default {
        data(){
            return {
                parcelCode:'',
                visible: false,
                againData:{
                    s_bill_type:3,
                    s_bill_number:'',
                },
            }
        },
        methods: {
            search_again(){
                this.againData.s_bill_number = this.parcelCode;
                this.$emit("refresh", this.againData);
                this.visible = false;
            },
        },
        computed: {},
        watch: {
            visible(val){
                this.$emit('input',val);
            },
            value(val) {
                if(!val){
                    this.purchaseNote.length = 0;
                }
                this.visible = val;
            }
        },
        props: {
            value:{},
            purchaseNote:{},
        },
        components: {
            pageDialog:require("@/components/page-dialog.vue").default
        },
    }
</script>
