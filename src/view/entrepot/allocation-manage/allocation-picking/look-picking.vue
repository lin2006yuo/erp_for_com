<template>
    <page-dialog v-model="visible"
                 class="c-look-allocation-picking"
                 @open="open" size="full"
                 @close="close" :title="action.title">
        <label-buttons
                label=""
                class="inline"
                @select="change_look"
                :buttons="lookList">
        </label-buttons>
        <summary-information :look-data="lookData"
                             v-show="activeName === 'information'">
        </summary-information>
        <pickings-detail :trend-action="action"
                         :show="activeName === 'pickings'"
                         v-show="activeName === 'pickings'">
        </pickings-detail>
        <summary-pass :trend-action="action"
                      :show="activeName === 'pass'"
                      v-show="activeName === 'pass'">
        </summary-pass>
        <div slot="footer">
            <el-button size="mini" @click.native="visible = false">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .c-look-allocation-picking {
        .right-table {
            width: 100%;
            font-size: 1.5rem;
            border: 1px solid #d3dce6;
            td {
                text-align: center;
                border-bottom: 1px solid #d3dce6;
                border-right: 1px solid #d3dce6;
                height: 33px;
            }
            td:nth-child(2n+1) {
                font-weight: 700;
                background-color: #f5f7fa;
            }
        }
        .pagination {
            position: absolute;
            right: 5px;
            bottom: 5px;
        }
    }
</style>
<script>
    import {api_look_allocation_picking} from "@/api/allocation-picking";

    export default {
        data() {
            return {
                visible: this.value,
                activeName: 'information',
                lookList: [
                    {label: '汇总信息', value: 'information'},
                    {label: '商品信息', value: 'pickings'},
                    {label: '周转箱', value: 'pass'}
                ],
                lookData: {},
            }
        },
        methods: {
            open() {
                this.activeName = 'information';
                this.$http(api_look_allocation_picking, this.action.id).then(res => {
                    this.lookData = res;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                });
            },
            close() {
                this.activeName = 'information';
            },
            change_look(index, item) {
                this.activeName = item.value;
            }
        },
        watch: {
            value(val) {
                this.visible = val;
            },
            visible(val) {
                this.$emit('input', val);
            }
        },
        props: {
            value: {},
            action: {},
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            labelButtons: require('@/components/label-buttons.vue').default,
            summaryInformation: require('./summary-information.vue').default,
            pickingsDetail: require('./pickings-detail.vue').default,
            summaryPass: require('./summary-pass').default
        }
    }
</script>