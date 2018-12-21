<template>
    <page>
        <el-col :span="14">
            <left-div @push-data="pushData"
                      @print="print"
                      :param="copyParams"
                      :channels="channels"
                      ref="left"></left-div>
        </el-col>
        <el-col :span="10">
            <right-div class="ml-sm"
                       :collections="historyCollections"
                       @print="print">
            </right-div>
        </el-col>
        <collection-print-dialog v-model="showDialog"
                                 ref="printDialog"
                                 @add-history="addHistory"
                                 @push-data="pushData"
                                 @finish="finish"
                                 :print-data="printData"
                                 :printer.sync="printer">
        </collection-print-dialog>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {mapActions} from 'vuex';

    export default {
        activated() {//当切换到当前页面时触发这个回调。
            this.$refs.left.shippingNumberFocus();
        },
        page: {
            devinfo: {
                frontEnd: '张明亮,张志勇',
                backEnd: '詹熏欣',
                createTime: '2017-11-27',
                updateTime: '2018-6-14'
            },
            multiple: true,
            beforeClose() {
                let arr = [];
                if (this.isEmpty) {
                    this.set_collectionList(arr);
                    return true
                } else {
                    return this.$confirm(`还有未集包完成的包裹，确定退出?`, '提示', {
                        confirmButtonText: '退出',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.set_collectionList(arr);
                        return true
                    }).catch(code => {
                        return false
                    })
                }
            }
        },
        data() {
            return {
                showDialog: false,
                printData: {},
                printer: 0,
                historyCollections: [],
                channels: [],
                copyParams: {},
            }
        },
        mounted() {
            this.copyParams = this.param;
        },
        methods: {
            ...mapActions({
                set_collectionList: 'api/set_collectionList',
            }),
            addHistory(history) {
                const index = this.historyCollections.findIndex(row => history.id === row.id);
                if (index < 0) {
                    this.historyCollections.unshift(history);
                }
            },
            finish(collectId) { // 确定集结完成
                let index = this.channels.findIndex(row => {
                    return row.id === collectId;
                });
                if (index !== -1) {
                    this.channels.splice(index, 1);
                }
                //向VUEX中存放正在处理的面单号的数组
                this.set_collectionList(this.channels);
                this.$refs.left.shippingNumberFocus();
            },
            pushData(data) {
                let flag = this.historyCollections.find(row => {
                    return row.id === data.id;
                });
                if (!flag) {
                    this.historyCollections.unshift(data);
                }
            },
            change_status(data, status) {

                let index = this.historyCollections.findIndex(row => {
                    return row.id === data.id;
                });
                let item = this.historyCollections[index];
                item.status = status;
                this.historyCollections.splice(index, 1, item);
            },
            print(item, row, printer) {// 右边打印的数据 传给 左边;
                const printData = Object.assign({}, item, row);
                this.printData.id = printData.id;
                this.printData.package_weight = printData.package_weight;
                this.printData.collect_type = printData.collect_type;
                this.printData.collect_label = printData.collect_label;
                this.printData.collect_weight = printData.collect_weight;
                this.printData.creator = printData.creator;
                this.printData.quantity = printData.quantity;
                this.printData.code = printData.code;
                this.printData.creator_id = printData.creator_id;
                this.printData.packing_time = printData.packing_time || datef("YYYY-MM-dd HH:mm:ss", new Date().getTime() / 1000);
                this.printer = printer;
                this.printData.collector_name = printData.collector_name;
                this.printData.shipping_name = printData.shipping_name;
                this.showDialog = true;
            }
        },
        computed: {
            isEmpty() {
                return this.channels.length <= 0;
            }
        },
        watch: {
            param(val) {
                this.copyParams = val;
            }
        },
        components: {
            leftDiv: require('./left-div.vue').default,
            rightDiv: require('./right-div.vue').default,
            collectionPrintDialog: require('./collection-print-dialog').default
        },
    }
</script>
