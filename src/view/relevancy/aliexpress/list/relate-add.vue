<template>
    <page-dialog @open="open" class="p-relate-add" title="添加" v-model="addFormVisible" size="large" :close-on-click-modal="false">
        <el-form :rules="rule" ref="form" :model="add_param">
            <div style="width: 33%;margin: 0 auto">
                <el-form-item label="速卖通账号简称：" label-width="110px" prop="account">
                    <permission class="inline" tag="ElSelect" :route="apis.url_get_account" v-model="add_param.account"
                                multiple
                                filterable>
                        <el-option
                            v-for="item in account"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </permission>
                </el-form-item>
                <el-form-item label=" 准入行业类目：" label-width="110px" prop="category_id">
                    <permission class="inline" tag="ElSelect" :route="apis.url_aliexpress_classify"
                                v-model="add_param.category_id"
                                placeholder="请选择" filterable>
                        <el-option
                            v-for="item in categories"
                            :key="item.category_id"
                            :label="item.category_name_zh"
                            :value="item.category_id">
                        </el-option>
                    </permission>
                </el-form-item>
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
            <permission
                tag="ElTree"
                :route="apis.url_get_categories"
                prop="local_category"
                class="filter-tree category"
                :data="tree"
                show-checkbox
                :props="defaultProps"
                :filter-node-method="filterNode"
                ref="tree"></permission>
            <p style="color:red" v-show="treeParam">本地分类不能为空</p>
            <el-form-item style="margin-bottom: 3px;">
                <div style="text-align: right;margin-top: 10px;">
                    <permission tag="request-button"
                                :route="apis.url_add_aliexpre_list"
                                :mintime="200"
                                req-key="url_add_aliexpre_list"
                                @click="add_list('form')">确定
                    </permission>
                    <el-button size="mini" @click="addFormVisible = false">取消</el-button>
                </div>


            </el-form-item>

        </el-form>

    </page-dialog>


</template>

<style lang="stylus">
    .p-relate-add {
        .category {
            height: 370px;
            overflow: auto;
        }

        .el-select__tags {
            height: 30px !important;
            max-width: 150.4px !important;
            overflow-y: auto;
            overflow-x: hidden;
            > span {
                white-space: inherit;
            }
        }
    }

</style>

<script>
    import {api_get_categories, url_get_categories} from '../../../../api/categories';
    import {
        api_aliexpress_classify,
        api_aliexpress_sale_list,
        url_aliexpress_sale_list,
        url_aliexpress_classify
    } from '../../../../api/publish-smt'


    import {
        api_aliexpre_list,
        api_add_aliexpre_list,
        api_del_aliexpre_list,
        api_edit_aliexpre_list,
        url_add_aliexpre_list
    } from '../../../../api/aliexpress-relevancy'

    import {api_get_account, url_get_account} from '../../../../api/handwork'

    export default {
        permission: {
            url_aliexpress_sale_list,
            url_aliexpress_classify,
            url_get_categories,
            url_add_aliexpre_list,
            url_get_account
        },
        data() {
            return {
                rule: {
                    account: [
                        {required: true, message: '请选择账号简称', trigger: 'change', type: "array"},
                    ],
                    category_id: [
                        {required: true, message: '请选择行业类目', trigger: 'change', type: 'number'}
                    ],
                    local_category: [
                        {required: true, message: '请选择本地分类', trigger: 'change', type: 'array'}
                    ]
                },
                addFormVisible: false,
                account: [],//账号列表
                categories: [],//准入行业类目
                param: false,//表单验证状态,
                treeParam: false,
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                default_checked: [],//默认选中
                filterText: '',
                add_param: {
                    account: [],
                    category_id: '',
                    local_category: []
                }
            }
        },
        created() {

        },
        mounted() {

        },
        updated() {

        },
        destroy() {

        },
        methods: {
            open(){
                this.add_param.account = [];
                this.add_param.category_id=[];
                this.category_id = "";
                this.local_category = [];
                this.getAccount();
                this.getCategories();
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.param = true;
                    } else {
                        this.param = false;
                    }

                    if (this.add_param.local_category.length === 0) {
                        this.treeParam = true;
                        this.param = false;
                    } else {
                        this.treeParam = false;
                        this.param = true;
                    }
                });
            },
            packUp() {
                let domArray = document.getElementsByClassName('el-tree-node__children');
                for (let i = 0; i < domArray.length; i++) {
                    domArray[i].style.display = 'none';
                }
            },
            spread() {
                let domArray = document.getElementsByClassName('el-tree-node__children')
                for (let i = 0; i < domArray.length; i++) {
                    domArray[i].style.display = 'block';
                }
            },
            getCheckedNodes() {
                this.add_param.local_category = this.$refs.tree.getCheckedNodes().map(data => data.id);
            },
            getCategories() {//行业类目
                this.$http(api_aliexpress_classify).then(res => {
                    this.categories = res;
                }).catch(code => {
                    this.$message({
                        showClose: true,
                        type: "error",
                        message: code.message || code
                    })
                });
            },
            getAccount() {//获取速卖通账号简称
                this.$http(api_get_account, {channel_id: 4}).then(res => {
                    //console.log(res.account);
                    this.account = res.account.map(row => {
                        row.disabled = false;
                        return row;
                    });
                }).catch(code => {
                    this.$message({
                        showClose: true,
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            add_list(formName) {
                this.getCheckedNodes();
                this.submitForm(formName);
                if (this.param) {
                    this.$http(api_add_aliexpre_list, this.add_param).then(res => {
                        this.$message({
                            showClose: true,
                            type: "success",
                            message: res.message
                        });
                        this.addFormVisible = false;
                        this.$emit("add_list");
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code});
                    }).finally(()=>{
                        setTimeout(()=>{
                            this.$reqKey('url_add_aliexpre_list',false);
                        },200);
                    });
                }else{
                    this.$reqKey('url_add_aliexpre_list',false);
                }
            },

            filterNode(value, data) {//树形搜索
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
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
            addFormVisible(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.addFormVisible = val;
            },

        },
        props: {
            value: {},
            tree: {}
        },
        components: {
            pageDialog: require("../../../../components/page-dialog.vue").default
        }
    }
</script>
