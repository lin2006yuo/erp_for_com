<template>
    <page-dialog :title="trendAction.title"
                 size="full"
                 class="p-pickings"
                 v-model="visible"
                 :close-on-click-modal="false">
        <label-buttons
                label=""
                class="inline"
                @select="change_look"
                :buttons="lookList">
        </label-buttons>
        <summary-information :trend-action="trendAction"
                             :information-visible="informationVisible"
                             v-show="informationVisible">
        </summary-information>
        <package-information :trend-action="trendAction"
                             :package-visible="packageVisible"
                             v-show="packageVisible">
        </package-information>
        <pickings-detail :trend-action="trendAction"
                         :pickings-visible="pickingsVisible"
                         v-show="pickingsVisible">
        </pickings-detail>
        <summary-pass :trend-action="trendAction"
                      :pass-visible="passVisible"
                      v-show="passVisible">
        </summary-pass>
        <div slot="footer">
            <el-button size="mini" @click="visible = false">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .p-pickings {
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
    }
</style>
<script>
    export default {
        data() {
            return {
                visible: false,
                lookList: [
                    {label: '汇总信息', value: 1},
                    {label: '包裹信息', value: 2},
                    {label: '商品信息', value: 3},
                    {label: '周转箱', value: 4}
                ],
                informationVisible: false,
                pickingsVisible: false,
                packageVisible: false,
                passVisible: false,
            }
        },
        mounted() {
        },
        methods: {
            change_look(select, data) {
                switch (data.value) {
                    case 1:
                        this.informationVisible = true;
                        this.packageVisible = false;
                        this.pickingsVisible = false;
                        this.passVisible = false;
                        break;
                    case 2:
                        this.informationVisible = false;
                        this.packageVisible = true;
                        this.pickingsVisible = false;
                        this.passVisible = false;
                        break;
                    case 3:
                        this.informationVisible = false;
                        this.packageVisible = false;
                        this.pickingsVisible = true;
                        this.passVisible = false;
                        break;
                    case 4:
                        this.informationVisible = false;
                        this.packageVisible = false;
                        this.pickingsVisible = false;
                        this.passVisible = true;
                        break;
                }
            }
        },
        computed: {},
        watch: {
            visible(val) {
                this.$emit('input', val);
            },
            value(val) {
                if (val) {
                    this.informationVisible = false;
                    this.packageVisible = false;
                    this.pickingsVisible = false;
                    this.passVisible = false;
                }
                this.visible = val;
            },
        },
        props: {
            value: {},
            trendAction: {},
            lookData: {}
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            labelButtons: require('@/components/label-buttons.vue').default,
            summaryInformation: require('./summary-information.vue').default,
            pickingsDetail: require('./pickings-detail.vue').default,
            packageInformation: require('./package-information.vue').default,
            summaryPass: require('./summary-pass').default
        },
    }
</script>
