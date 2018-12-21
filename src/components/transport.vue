<template>
    <el-card class="p-transport">
        <div class="c-tree">
            <div class="el-table__header-wrapper">
                <div class="goods-part">
                    <div class="classify_logo">
                        <i></i>
                        <span class="color-white" style="text-align:left;" @click="clearTransport">{{titleNode}}</span>
                    </div>
                    <div @click.stop="hiddenTree" class="butoon-left">
                        <i class="arrow-btn"></i>
                    </div>
                </div>
                <slot name="all_data"></slot>
            </div>
            <div class="transport-multi" v-if="isShowBtn">
                <el-checkbox v-model="isChecked">启用多选</el-checkbox>
                <el-button type="primary" class="ml-sm" @click="multi_sure" :disabled="!isChecked" size="mini">确定
                </el-button>
            </div>
            <el-checkbox v-if="isChecked"
                         v-model="checkedAll"
                         @change="change_checkedAll"
                         class="ml-sm mb-xs">全选
            </el-checkbox>
            <div v-resize="{height:40}" class="el-table__body-wrapper" v-loading="loading" style="overflow-y:auto;overflow-x:hidden;">
                <el-tree @node-click="handle_node_click"
                         @check-change="handle_check_change"
                         v-show="isChecked"
                         :show-checkbox="true"
                         :default-checked-keys="checkedTree"
                         highlight-current
                         node-key="id"
                         ref="tree"
                         :expand-on-click-node="false"
                         :data="transportData"></el-tree>
                <el-tree @node-click="handle_node_click"
                         v-show="!isChecked"
                         :show-checkbox="false"
                         highlight-current
                         :expand-on-click-node="false"
                         :data="transportData"></el-tree>
            </div>
        </div>
    </el-card>
</template>
<style lang="stylus">
    .p-transport {
        .el-card__body {
            padding: 0 !important;
        }
        .transport-multi {
            padding: 0 10px;
            line-height: 3rem;
        }
        .simulate {
            box-sizing: border-box;
            display: inline-block;
            text-align: center;
            color: #fff;
            width: 100%;
            height: 32px;
            padding: 0 5px;
            line-height: 32px;
            font-size: 1.2rem;
            background: #6495ED;
            border: 1px solid #6495ED;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
            border-bottom: 1px solid transparent;
        }
        .el-tree-node__label {
            display: inline;
            white-space: normal;
        }
        .el-tree-node__content {
            line-height: 26px;
            height: auto;
        }
    }
</style>
<script>
    export default {
        data() {
            return {
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                treeid: "",
                selected: [],
                checkedTree: [],
                isChecked: false,
                checkedAll: false
            }
        },
        mounted() {
            this.hiddenTree();
        },
        methods: {
            //点击tree时
            handle_node_click(data) {
                if (this.isChecked) {// 多选点击label关联checkedBox
                    if (!data.children) {
                        let selected = this.get_selected();
                        let checked = !selected.find(row => row.id === data.id);
                        this.$refs.tree.setChecked(data, checked, true);
                    }
                    return;
                }
                this.$emit("node-click", data);
            },
            handle_check_change(data, checked) {
                if (!checked) {
                    this.checkedAll = false;
                } else {
                    let selected = this.get_selected();
                    this.checkedAll = selected.length === this.nodeIds.length;
                }
            },
            get_selected() {
                return this.$refs.tree.getCheckedNodes(true);
            },
            hiddenTree() {
                this.$emit('hidden-left');
            },
            clearTransport() {
                if (!this.isChecked) {
                    this.$emit('title-click');
                }
            },
            change_checkedAll() {
                if (this.checkedAll) {
                    this.transportData.forEach(row => {
                        row.children.forEach(item => {
                            this.checkedTree.push(item.id);
                        })
                    });
                    this.$nextTick(() => {
                        this.$refs.tree.setCheckedKeys(this.checkedTree);
                    });
                } else {
                    this.checkedTree.length = 0;
                    this.$refs.tree.setCheckedKeys(this.checkedTree);
                }
            },
            multi_sure() {
                this.selected = this.get_selected();
                this.$emit('node-click', this.selected.map(row => row.id));
            }
            /**
             * TODO:点击事件和多选事件
             */
        },
        computed: {
            nodeIds() {
                let nodeIds = [];
                this.transportData.map(transport => {
                    transport.children.map(row => {
                        nodeIds.push(row.id);
                    })
                });
                return nodeIds;
            }
        },
        props: {
            transportData: {
                required: true,
                type: Array
            },
            titleNode: {
                type: String,
                default() {
                    return '运输方式';
                }
            },
            loading: {
                required: true,
                type: Boolean,
                default() {
                    return false;
                }
            },
            isShowBtn:{//是否展示多选按钮
                type:Boolean,
                default(){
                    return true;
                }
            }
        },
        components: {
            maillingTree: require('@/components/mailling-tree.vue').default
        }
    }
</script>
