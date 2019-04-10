<template>
    <page-dialog title="添加预报"
                 size="large"
                 class="p-set-weight"
                 v-model="visible"
                 :close-on-click-modal="false">
        <span class="ml-sm desc">以下包裹重新设置预估重量：</span>
        <el-table class="mt-xs scroll-bar"
                  v-resize="{height: 120}"
                  :data="copyData"
                  highlight-current-row>
            <el-table-column label="包裹号" inline-template>
                <ui-tip :is-operate="true" :content="row.package_number"
                        @cur-click="parcel_information(row.package_number)" :width="98"></ui-tip>
            </el-table-column>
            <el-table-column label="重量(g)" prop="package_weight">

            </el-table-column>
            <el-table-column label="预估重量(g)" prop="estimated_weight">
            </el-table-column>
            <el-table-column label="新预估重量(g)" inline-template>
                <el-input v-model="row.new_weight">
                </el-input>
            </el-table-column>
        </el-table>
        <div slot="footer">
            <request-button req-key="setWeight" @click="set_weight">确定</request-button>
            <el-button size="mini" @click.native="visible = false">取消</el-button>
        </div>
    </page-dialog>
</template>

<style lang="stylus">
    .desc {
        height: 28px;
        line-height 28px;
        font-size: 1.6rem;
    }
</style>

<script>
    import {api_get_package, url_package} from '../../../api/shipment'

    export default {
        page: {},
        permission: {
            url_package
        },
        data() {
            return {
                visible: false,
                copyData: [],
            }
        },
        created() {
            this.init_data(this.tableData);
        },
        methods: {
            init_data(data) {
                this.copyData = window.clone(data);
                this.copyData.forEach(res => {
                    this.$set(res, 'new_weight', '');
                });
            },
            set_weight() {
                if (!this.validate()) {
                    this.$message({type: 'error', message: '新预估重量值有误，请重新填写'});
                    setTimeout(() => {
                        this.$reqKey('setWeight', false);
                    }, 300);
                    return;
                }
                let params = this.copyData.map(res => {
                    typeof res.new_weight === 'string' && (res.new_weight = res.new_weight.trim());
                    return {
                        package_id: res.package_id,
                        weight: res.new_weight
                    }
                });
                this.$emit('set-weight', {data: params});
            },
            validate() {
                return this.copyData.every(res => {
                    let weight = res.new_weight;
                    if (weight === '') return false;
                    if (isNaN(Number(weight))) return false;
                    return true;
                })
            },
            parcel_information(order) {
                this.$emit('parcel-information', order)
            },
        },
        watch: {
            tableData(val) {
                console.log('table data change', val);
                this.init_data(val);
            },
            visible(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.visible = val;
            }
        },
        props: {
            value: {},
            tableData: {},
        },
        components: {
            pageDialog: require('../../../components/page-dialog.vue').default,
            uiTip: require('../../../components/ui-tip.vue').default,
        }
    }
</script>
