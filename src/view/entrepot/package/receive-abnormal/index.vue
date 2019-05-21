<template>
    <page>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="po缺失" name="1">
                <po-defect :warehouse-list="warehouseList" v-if="activeName === '1'"></po-defect>
            </el-tab-pane>
            <el-tab-pane label="未拆异常" name="2">
                <long-not-opened :warehouse-list="warehouseList" v-if="activeName === '2'"></long-not-opened>
            </el-tab-pane>
        </el-tabs>
    </page>
</template>

<script>

    import {api_warehouses} from '@/api/global';

    export default {
        data() {
            return {
                activeName: '1',
                warehouseList: [],
            }
        },
        mounted() {
            this.init_warehouse();
        },
        methods: {
            handleClick() {
                switch (this.activeName) {
                    case '1':
                        break;
                }
            },
            init_warehouse() {
                this.$http(api_warehouses).then(res => {
                    this.warehouseList = res;
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code,
                    })
                })
            },
        },
        components: {
            poDefect: require('./po-defect/index').default,
            longNotOpened: require('./long-not-opened/index').default
        }
    }
</script>

<style lang="stylus"></style>
