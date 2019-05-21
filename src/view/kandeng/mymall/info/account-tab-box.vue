<template>
    <div style="margin: 0 10px">
        <el-tabs v-model="tabValue" type="border-card" closable @tab-remove="removeTab">
            <el-tab-pane v-for="(item, index) in tabData"
                         :key="index"
                         :label="item.tab_label"
                         :name="item.tab_label">
                <!-- 基本信息 -->
                <account-tab-base :account-info="item" @initial-uppercase="initial_uppercase(item)"></account-tab-base>
                <!-- sku设置 -->
                <account-tab-sku-set :account-info="item" :base-url="baseUrl" @delete-sku="delete_sku(item, $event)"
                                     :goods-id="goodsId" @add-sku="add_sku(item, $event)" :is-add="isAdd"
                                     @category-batch="category_batch(item, $event)"
                                     @check-all="check_all(item, $event)"></account-tab-sku-set>
                <!-- 图片与描述 -->
                <account-tab-describ :account-info="item" :base-url="baseUrl" :goods-id="goodsId"></account-tab-describ>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<style lang="stylus">

</style>
<script>

    export default{
        data(){
            return {
                tabData: [],
                tabValue: '0'
            }
        },
        methods: {
            init(){
            },
            // sku设置--批量修改属性
            category_batch(item, obj){
                item.variant.forEach(row => {
                    row[obj.field] = obj.value;
                })
            },
            // sku设置--添加sku
            add_sku(item, sku){
                item.variant.push(sku);
            },
            // sku设置--删除sku
            delete_sku(item, index){
                item.variant.splice(index, 1);
            },
            //  sku设置--多选框
            check_all(item, bool){
                item.variant.forEach(row => {
                    row.check = bool;
                })
            },
            // 删除账号
            removeTab(targetName){
                let tabs = this.tabData;
                let activeName = this.tabValue;
                if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.tab_label === targetName) {
                            let nextTab = tabs[index + 1] || tabs[index - 1];
                            if (nextTab) {
                                activeName = nextTab.tab_label;
                            }
                        }
                    });
                }
                this.tabValue = activeName;
                this.tabData = tabs.filter(tab => tab.tab_label !== targetName);
            },
            // 首字母大写
            initial_uppercase(item){
                if (!item.name) {
                    return
                }
                let name = item.name.split(/\s+/);
                name = name.map(row => {
                    row = this.up_first_letter(row);
                    return row;
                });
                item.name = name.join(' ')
            },
            up_first_letter(str){
                return str.substring(0, 1).toUpperCase() + str.substring(1);
            },
        },
        computed: {},
        watch: {
            value(val){
                this.tabData = val;
            },
            tabData(val){
                this.$emit('input', val)
            },
            tabName(val){
                this.tabValue = val;
            },
            tabValue(val){
                this.$emit('change-name', val);
            }
        },
        props: {
            value: {},
            tabName: {},
            goodsId: {},
            baseUrl: {},
            isAdd: {}
        },
        components: {
            accountTabBase: require('./account-tab-base.vue').default,
            accountTabSkuSet: require('./account-tab-sku-set.vue').default,
            accountTabDescrib: require('./account-tab-describ.vue').default,
        }
    }
</script>

