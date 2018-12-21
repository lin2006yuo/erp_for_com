<template>
    <page-dialog :title="trendAction.title"
                 size="small"
                 v-model="visible"
                 :close-on-click-modal="false">
        <label-item :label="`${label}：`">
            <param-account
                    v-model="searchData.shipper_id"
                    :param="{data:{content:''}}"
                    :fixUrl="true"
                    :fixResult="sale_fix_result"
                    type="warehouseUser"
                    placeholder="请选择/输入..."
                    url="get|user/warehouse/staffs">
            </param-account>
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
    import {api_pickings_shipper} from '../../../api/pickings'

    export default {
        data() {
            return {
                visible: false,
                searchData: {
                    shipper_id: '',
                    user_name: ''
                },
            }
        },
        mounted() {
        },
        methods: {
            query() {
                if(this.searchData.shipper_id === '') {
                    this.$message({type: 'error', message: `请选择${this.label}`});
                    return;
                }
                this.$http(api_pickings_shipper, this.trendAction.id, {shipper_id: this.searchData.shipper_id}).then(res => {
                    if(this.trendAction.value === 'hand') {
                        this.$emit('hand', this.trendAction.id, this.searchData.user_name);
                    } else {
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
                return this.trendAction.value === 'hand' ? '转接人' : '拣货人';
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
        },
        components: {
            pageDialog: require('../../../components/page-dialog.vue').default,
            labelItem: require('../../../components/label-item').default,
            paramAccount: require('../../../api-components/param-account').default
        },
    }
</script>
