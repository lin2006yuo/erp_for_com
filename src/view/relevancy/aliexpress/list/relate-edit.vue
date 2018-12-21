<template>
    <page-dialog @open="open" :title="`编辑账号简称：${!!tableRow.account?tableRow.account.code : ''} 分类`" v-model="editFormVisible"
                 size="large" :close-on-click-modal="false">
        <el-row>
            <div>
                <div style="width: 30%;margin: 0 auto">
                    <div class="mt-xs mb-sm">
                        <label class="inline" style="width: 100px;text-align: right">速卖通账号简称：</label>
                        {{!!tableRow.account?tableRow.account.code : ''}}
                    </div>
                    <div class="mb-sm">
                        <label class="inline" style="width: 100px;text-align: right">准入行业类目：</label>
                        {{!!tableRow.alicategory?tableRow.alicategory.category_name_zh:''}}
                    </div>
                </div>
                <el-row class="mb-xs">
                    <div class="inline">
                        <el-button size="mini" type="primary" @click="packUp">全部收起</el-button>
                        <el-button size="mini" type="primary" @click="spread">全部展开</el-button>
                    </div>
                    <div class="inline ml-xs">
                        <el-input class="inline" placeholder="请输入内容" width="100px" v-model="filterText"></el-input>
                        <el-button class="inline" size="mini" type="primary" @click="search_word">搜索关键字</el-button>
                    </div>
                </el-row>
                <el-tree
                    class="filter-tree category"
                    :data="tree"
                    show-checkbox
                    :filter-node-method="filterNode"
                    ref="tree"
                    node-key="id"
                    @check-change="nodeCheckChange"
                    :default-expanded-keys="[]"
                    :default-checked-keys="default_checked"
                >
                </el-tree>
                <div>
                    <div style="text-align: right;margin-top: 10px;margin-bottom:3px;">
                        <el-button size="mini" type="primary" @click="edit_list">修改</el-button>
                        <el-button size="mini" @click.native="editFormVisible = false">取消</el-button>
                    </div>
                </div>
            </div>
        </el-row>

    </page-dialog>


</template>

<style lang="stylus">
    .category {
        height: 390px;
        overflow: auto;
    }

</style>

<script>
    import {api_get_categories} from '../../../../api/categories';
    import {api_aliexpress_classify, api_aliexpress_sale_list} from '../../../../api/publish-smt'

    import {
        api_aliexpre_list,
        api_add_aliexpre_list,
        api_del_aliexpre_list,
        api_edit_aliexpre_list,
        api_edit_publish
    } from '../../../../api/aliexpress-relevancy'

    export default {
        data() {
            return {
                editFormVisible: false,
                account: [],//账号列表
                categories: [],//准入行业类目
                default_checked: [],//默认选中
                filterText: '',
                edit_param: {
                    account: '',
                    category_id: '',
                    local_category: []
                },
                dels: [],
                adds: [],
            }
        },
        methods: {
            open(){
                this.adds = [];
                this.dels = [];
                this.getParan();
                this.filterText ='';
            },
            packUp() {
                let domArray = document.getElementsByClassName('el-tree-node__children');
                for (let i = 0; i < domArray.length; i++) {
                    domArray[i].style.display = 'none';
                }
            },
            spread() {
                let domArray = document.getElementsByClassName('el-tree-node__children');
                for (let i = 0; i < domArray.length; i++) {
                    domArray[i].style.display = 'block';
                }
            },
            nodeCheckChange(row, state, childState) {
                const find = this.edit_param.local_category.find(local => {
                    return local.local_category_id === row.id;
                });
                if (find) {
                    const delindex = this.dels.indexOf(find.id);
                    if (!state) {
                        if (delindex <= -1) {
                            this.dels.push(find.id);
                        }
                    } else {
                        if (delindex >= 0) {
                            this.dels.splice(delindex, 1);
                        }
                    }
                } else {
                    const index = this.adds.indexOf(row.id);
                    if (state) {
                        if (index <= -1) {
                            this.adds.push(row.id);
                        }
                    } else {
                        if (index >= 0) {
                            this.adds.splice(index, 1);
                        }
                    }
                }

//          console.log('add',this.adds);
//          console.log('del',this.dels);
            },
            getCheckedNodes() {
                let treeArr = this.$refs.tree.getCheckedNodes();
                if (treeArr.length <= 0) {
                    this.$message({
                        showClose: true,
                        type: "error",
                        message: "本地分类不能为空"
                    });
                    return false;
                } else {
                    return true;
                }

            },
            getParan() {
                if (this.editList.local_category !== null) {
                    this.edit_param.local_category = this.editList.local_category.map(
                        data => {
                            return {'id': data.id, 'local_category_id': data.local_category_id}
                        }
                    );
                    this.default_checked = this.edit_param.local_category.map(data => data.local_category_id);
                }
            },
            edit_list() {//编辑
                this.getCheckedNodes();
                if (this.getCheckedNodes()) {
                    this.$http(api_edit_publish,
                        {
                            account: [this.editList.account_id],
                            category_id: this.editList.category_id,
                            unchecked: this.dels,
                            checked: this.adds
                        }
                    ).then(res => {
                        this.$message({
                            showClose: true,
                            type: "success",
                            message: res.message
                        });
                        this.$emit("edit_list");
                        this.editFormVisible = false;
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    });
                }
            },

            filterNode(value, data) {//树形搜索
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },

            search_word() {
                this.$refs.tree.filter(this.filterText);
            }
        },
        computed: {},
        watch: {
            editFormVisible(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.editFormVisible = val;
            },
        },
        props: {
            value: {},
            editList: {
//        type:Object
            },
            tableRow: {},
            tree: {}
        },
        components: {
            pageDialog: require("../../../../components/page-dialog.vue").default
        }
    }
</script>
