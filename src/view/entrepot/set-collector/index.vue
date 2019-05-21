<template>
    <page class="p-set-collector">
        <el-row>
            <el-col :span="12">
                <collector-list ref="collectorList"
                                @get-collector-info="get_collector_info"
                                @add="add_click"></collector-list>
            </el-col>
            <el-col :span="12">
                <card-list ref="cardList"
                           @cancel="cancel"
                           @add="add" :loading="loading" :collector-info="collectorInfo"
                           @update="update"
                           :but-mark="butMark"
                           :shipping-list="shippingList"></card-list>
            </el-col>
        </el-row>
    </page>
</template>

<style lang="stylus">

</style>

<script>
    import {api_get_collector_info, api_updata_collector, api_get_shipping_by_collector} from "@/api/collector";

    export default {
        page: {
            devinfo: {
                frontEnd: '张志勇',
                backEnd: '赖永凤',
                createTime: '2018-8-3',
                updateTime: ''
            },
        },
        refresh() {
            this.$refs.collectorList.init();
        },
        data() {
            return {
                collectorInfo: {},
                shippingList: [],
                loading: false,
                butMark: false,
            }
        },
        methods: {
            get_collector_info(id) {
                this.butMark = false;
                this.loading = true;
                this.$http(api_get_collector_info, id).then(res => {
                    this.collectorInfo = res;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                });
                this.get_shipping_list(id);
            },
            get_shipping_list(id) {
                this.$http(api_get_shipping_by_collector, id).then(res => {
                    this.shippingList = res;
                    this.shippingList.forEach(row => {
                        row.status = row.status === 1 ? true : false;
                    });
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                }).finally(() => {
                    this.loading = false;
                })
            },
            add() {
                this.butMark = false;
                this.$refs.collectorList.init();
            },
            cancel() {
                this.butMark = false;
            },
            update(info) {
                console.log(`update`, info);
                this.$refs.collectorList.update(info);
            },
            add_click() {//点击添加按钮触发
                this.butMark = true;
                this.$refs.cardList.activeName = 'collectorInfo';
            }
        },
        components: {
            collectorList: require('./collector-list.vue').default,
            cardList: require('./card-list.vue').default
        }
    }
</script>
