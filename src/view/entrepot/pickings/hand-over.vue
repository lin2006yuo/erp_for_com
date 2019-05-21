<template>
    <page-dialog :title="trendAction.title"
                 size="small"
                 v-model="visible"
                 @open="open"
                 @close="close"
                 :close-on-click-modal="false">
        <label-item :label="`${label}：`">
            <super-select class="width-sm inline ml-xs"
                          v-model="searchData.shipper_id"
                          :options="shipperList"
                          storage-key="staffs"
                          placeholder="请选择/输入..."></super-select>
            <!--<param-account
                    v-model="searchData.shipper_id"
                    :param="{data:{content:''}}"
                    :fixUrl="true"
                    :fixResult="sale_fix_result"
                    type="warehouseUser"
                    placeholder="请选择/输入..."
                    url="get|user/warehouse/staffs">
            </param-account>-->
        </label-item>
        <div slot="footer">
            <el-button size="mini" @click="query" type="primary">确定</el-button>
            <el-button size="mini" @click="visible = false">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_pickings_shipper} from '@/api/pickings';
    import {api_warehouse_staffs} from "@/api/warehouse-cargo";

    export default {
        data() {
            return {
                visible: false,
                searchData: {
                    shipper_id: ''
                }
            }
        },
        methods: {
            open(){
                this.$nextTick(() => {
                    this.searchData.shipper_id = this.shipperId ? this.shipperId : ''
                });
            },
            close() {
                this.searchData.shipper_id = '';
            },
            query() {
                if(this.searchData.shipper_id === '') {
                    this.$message({type: 'error', message: `请选择${this.label}`});
                    return;
                }
                let person = this.shipperList.filter(row => row.value === this.searchData.shipper_id)[0];
                if(this.trendAction.value === 'batchHand'){
                    this.$emit('batch-hand', this.searchData.shipper_id);
                    return
                }
                this.$http(api_pickings_shipper, this.trendAction.id, {shipper_id: this.searchData.shipper_id}).then(res => {
                    if(this.trendAction.value === 'hand') {
                        this.$emit('hand', this.trendAction.id, person);
                    } else{
                        this.$emit('init');
                    }
                    this.$message({type: "success", message: res.message || res});
                    this.visible = false;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            sale_fix_result(res) {
                return res.map(row => {
                    return {
                        value: row.id,
                        label: row.realname
                    }
                })
            },
        },
        computed: {
            label() {
                if(this.trendAction.value === 'assign'){
                    return '拣货人'
                }else{
                    return '转接人'
                }
            }
        },
        watch: {
            visible(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.visible = val;
            },
        },
        props: {
            value: {},
            trendAction: {},
            shipperId: {},
            shipperList: {}
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            labelItem: require('@/components/label-item').default,
            paramAccount: require('@/api-components/param-account').default,
        },
    }
</script>
