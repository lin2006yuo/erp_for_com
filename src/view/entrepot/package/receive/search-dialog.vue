<template>
    <div>
        <page-dialog title="运单号" v-model="visible" size="tiny" :close-on-click-modal="false" class="receive-search">
            <label class="t-left">运单号：</label>
            <el-select v-model="parcelCode" placeholder="请选择" class="inline">
                <el-option
                        :key="item"
                        v-for="item in purchaseNote"
                        :label="item"
                        :value="item">
                </el-option>
            </el-select>
            <div slot="footer" class="dialog-footer t-center mt-md">
                <el-button @click.native="sure_tracking" class="mr-md" type="primary" size="mini">确认</el-button>
                <el-button @click.native="visible = false" size="mini">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>

<style lang="stylus">
    .receive-search .inner{
        width: 300px;
        height: 150px;
        margin:0 auto;
        top:30% !important;
        left:0 !important;
        right:0 !important;
        bottom: 0 !important;
        position: fixed !important;
        text-align: center;
    }
    .receive-search .dialog__body{
        line-height: 50px;
        height: 50px;
    }
</style>

<script>
    export default {
        data(){
            return {
                parcelCode:'',
                visible:false
            }
        },
        mounted(){},
        methods: {
            sure_tracking(){
                this.$emit("select-tracking", this.parcelCode);
                this.visible = false;
            }
        },
        computed: {},
        watch: {
            visible(val){
                this.$emit('input',val);
            },
            value(val) {
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
