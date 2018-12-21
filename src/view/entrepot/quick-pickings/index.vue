<template>
    <page>
        <label-item label="请选择仓库：" class="mb-xs mt-sm">
            <el-select v-model="warehouse_id" @change="change_depot" class="inline width-sm">
                <el-option
                    :key="item.value"
                    v-for="item in warehouses"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
        </label-item>
        <el-tabs v-model="activeName">
            <el-tab-pane label="包裹列表" name="1">
                <package-information v-if="activeName === '1'"
                                     ref="activeName1"
                                     :warehouse-id="warehouse_id">
                </package-information>
            </el-tab-pane>
            <el-tab-pane label="SKU列表" name="2">
                <pickings-detail v-if="activeName === '2'"
                                 :warehouse-id="warehouse_id"
                                 ref="activeName2">
                </pickings-detail>
            </el-tab-pane>
        </el-tabs>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {entrepot_picking} from '@/api/pickings'
    export default {
        page:{},
        refresh(){
            switch (this.activeName){
                case '1':
                    this.$refs.activeName1.search();
                    break;
                case '2':
                    this.$refs.activeName2.init();
                    break;
            }
        },
        data(){
            return {
                warehouses:[],
                warehouse_id:2,
                activeName:'1'
            }
        },
        mounted(){
            this.init_warehouse();
        },
        methods: {
            init_warehouse(){
                this.$http(entrepot_picking).then(res => {
                    this.warehouses = res.map(item => {
                        return {label: item.name, value: item.id};
                    });
                }).catch(code => {
                    this.$message({type:"error",message:code.message || code});
                })
            },
            change_depot(){

            }
        },
        computed: {},
        watch: {},
        props: {},
        components: {
            packageInformation:require('./package-information').default,
            pickingsDetail:require('./pickings-detail').default,
            labelItem:require('@/components/label-item.vue').default,
        },
    }
</script>
