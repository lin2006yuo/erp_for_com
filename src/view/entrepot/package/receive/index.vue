<template>
    <page>
        <el-tabs v-model="activeName" @tab-click="handle_click">
            <el-tab-pane label="包裹接收" name="1">
                <receive ref="receive" v-if="activeName === '1'"></receive>
            </el-tab-pane>
            <el-tab-pane label="待接收条目" name="2">
                <wait-receive ref="wait" v-if="activeName === '2'" @search-id="search_id"></wait-receive>
            </el-tab-pane>
        </el-tabs>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    export default {
        page: {},
        activated() {//当切换到当前页面时触发这个回调。
            this.$refs.receive.$refs.waybill.$refs.input.focus();
            let component = this;
            document.onkeydown = function (event) {
                let e = event || window.event || arguments.callee.caller.arguments[0];
                if (e && e.keyCode === 113) { // 按 F2
                    component.onkeyF2();
                }
            };
        },
        deactivated() {//当切换到其它页面时触发这个回调。
        },
        data() {
            return {
                activeName: '1'
            }
        },
        mounted() {
            !isEmpty(this.param) && this.has_param();
        },
        methods: {
            handle_click() {
                switch (this.activeName) {
                    case '1':
                        break;
                    case '2':
                }
            },
            search_id(row) {
                this.activeName = '1';
                this.$nextTick(() => {
                    this.$refs.receive.radio.searchPurchase = true;
                    this.$refs.receive.searchData.purchase = row.id;
                    this.$refs.receive.purchase_search(this.$refs.receive.searchData);
                });
            },
            has_param() {
                this.$nextTick(() => {
                    this.$refs.receive.box_id = this.param.box_id;
                    this.activeName = '1';
                    this.$refs.receive.waybillSelect();
                });
            }
        },
        watch: {
            param(val) {
                this.$nextTick(() => {
                    this.$refs.receive.box_id = val.box_id;
                    this.activeName = '1';
                    this.$refs.receive.waybillSelect();
                });
            }
        },
        props: {},
        components: {
            receive: require('./receive').default,
            waitReceive: require('./wait-receive').default
        }
    }
</script>
