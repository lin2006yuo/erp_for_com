<template>
    <div>
        <label :style="labelStyle">{{label}}</label>
        <el-button :type="selectAll ? 'primary':'default'"
                   size="mini"
                   v-if="showAll"
                   :disabled="moreSelect"
                   @click="all">全部
        </el-button>
        <el-button v-for="(item, index) in buttonList"
                   :key="index"
                   size="mini"
                   :type="button_item(item)"
                   @click="button_select(item)">
            {{item.label || item.name}}{{item.count | filterButton}}
        </el-button>
        <el-checkbox v-model="moreSelect" v-if="buttonList.length > 0">启用多选</el-checkbox>
        <el-button type="primary" size="mini" v-if="moreSelect" @click="query">确定</el-button>
    </div>
</template>
<style lang="stylus">

</style>
<script>

    export default {
        name: 'select-more-button',
        data() {
            return {
                selectedList: [],//选中的列表
                selectAll: true,//全选
                moreSelect: false//多选
            }
        },
        filters: {
            filterButton(count) {
                if (count > 0) {
                    return `(${count})`
                } else {
                    return ''
                }
            }
        },
        mounted() {
        },
        //添加新的变量时请用xxxXx
        //添加新方法时请用xxx_xx
        methods: {
            all() {
                this.selectAll = true;
                this.selectedList.length = 0;
                this.query();
            },
            button_select(item) {
                if (!this.moreSelect) {
                    this.selectedList.length = 0;
                }
                let index = this.selectedList.findIndex(row => {
                    return item.value === row.value;
                });
                if (index === -1) {
                    this.selectAll = false;
                    this.selectedList.push(item);
                    if (!this.moreSelect) {
                        this.query();
                    }
                } else {
                    this.selectedList.splice(index, 1);
                }
            },
            button_item(item) {
                const select = 'primary';
                const def = 'default';
                if (this.selectedList.indexOfFun(row => item.value === row.value) >= 0) {
                    return select;
                }
                return def;
            },
            query() {
                this.$emit('query', this.selectedList);
            }
        },
        computed: {
            labelStyle() {
                let style = {
                    textAlign: this.labelAlign || 'right'
                };
                if (this.labelWidth) {
                    style.width = `${this.labelWidth}px`
                }
                return style;
            },
        },
        watch: {
            moreSelect(val) {
                if (val) {
                    this.selectAll = false;
                } else {
                    this.all();
                }
            },
            buttonList(val) {
                if(!this.showAll) {
                    this.button_select(val[0]);
                }
            }
        },
        props: {
            //传入的button数组[{label:'',value:''}]形式
            buttonList: {
                type: Array,
                required: true
            },
            label: {
                required: true,
                type: String
            },
            showAll: {
                type: Boolean,
                default() {
                    return true;
                }
            },
            labelWidth: {},
            labelAlign: {},
        },
        components: {}
    }
</script>
