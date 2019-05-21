<template>
    <div class="c-extract-keyword">
        <page-dialog v-model="dialog" :title="title" size="small" :close-on-click-modal="false" @close="close"
                     @open="open">
            <label-item label="核心关键词：">
                <el-input v-model="keyword" class="width-super" placeholder="请输入关键词..."></el-input>
                <el-button type="primary" size="mini" class="inline ml-sm" @click.native="search">搜索</el-button>
                <el-button size="mini" class="inline ml-sm" @click.native="clears">清空</el-button>
            </label-item>
            <el-table
                ref="table"
                class="scroll-bar mt-sm"
                :data="tableData"
                v-loading="loading"
                element-loading-text="玩命加载中..."
                highlight-current-row
                height="350"
                @row-click="row_click"
                @selection-change="selection_change"
            >
                <el-table-column type="selection"></el-table-column>
                <el-table-column label="关键词" inline-template>
                    <div>{{row}}</div>
                </el-table-column>
            </el-table>
            <div slot="footer">
                <el-button type="primary" size="mini" class="inline" @click.native="add_data">添加</el-button>
                <el-button size="mini" class="inline" @click.native="close_dialog">关闭</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_wish_tags, api_joom_tags} from "../../../../api/kandeng"

    export default {
        data() {
            return {
                dialog: this.value,
                loading: false,
                tableData: [],
                selectData: [],
                keyword: '',
            }
        },
        watch: {
            dialog(val) {
                this.$emit("input", val);
            },
            value(val) {
                this.dialog = val;
                // if(val){
                //     this.keyword = '';
                //     this.tableData = [];
                // }
            },
        },
        computed: {
            neededLength() {
                let cur = 10;
                if (this.oldTags && this.oldTags.length > 0) {
                    cur = 10 - this.oldTags.length;
                }
                return cur;
            },
        },
        methods: {
            open() {
                this.keyword = this.keywordInfo;
            },
            close() {
                this.keyword = '';
                this.tableData = [];
                this.$emit('keyword-clear');
            },
            /*点击行*/
            row_click(row, event, col) {
                if (row.disabled) {
                    return;
                }
                this.$refs.table.toggleRowSelection(row);
            },
            search() {
                this.init();
            },
            init() {
                if (!this.keyword) return this.$message({type: "warning", message: "请输入要搜索的关键词"});
                this.loading = true;
                if (this.isJoom) {
                    return this.$http(api_joom_tags, {keyword: this.keyword}).then(res => {
                        this.tableData = res.tags;
                        this.loading = false;
                        return Promise.resolve();
                    }).catch(code => {
                        this.loading = false;
                    })

                } else {
                    let params = {
                        q: this.keyword,
                    };
                    return this.$http(api_wish_tags, params).then(res => {
                        this.tableData = res;
                        this.loading = false;
                        return Promise.resolve();
                    }).catch(code => {
                        this.loading = false;
                        this.$message({type: 'error', message: code.message || code});
                    })
                }
            },
            clears() {
                this.keyword = "";
                this.tableData = [];
            },
            selection_change(val) {
                this.selectData = val;
            },
            add_data() {
                if (this.neededLength === 0) return this.$message({
                    type: "warning",
                    message: "核心关键词最多添加10个，请删除一部分后，再进行此操作"
                });
                if (this.selectData.length <= 0) return this.$message({type: "warning", message: "请选择要添加的关键词"});
                if (this.selectData.length <= this.neededLength) {
                    this.dialog = false;
                    return this.$emit("add-data", this.selectData)
                }
                this.$confirm(`当前核心关键词最多只能添加${this.neededLength}个，您当前已选择${this.selectData.length}个，默认只会添加前${this.neededLength}个，确定进行此操作吗`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false,
                }).then(() => {
                    let newSelect = this.selectData.slice(0, this.neededLength);
                    this.$emit("add-data", newSelect);
                    this.dialog = false;
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                })
            },
            close_dialog() {
                if (this.selectData.length <= 0 || this.neededLength === 0) return this.dialog = false;
                this.$confirm("检测到您已选择部分关键词，执行当前操作将会丢失已选数据,确认进行此操作吗？", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false,
                }).then(() => {
                    this.dialog = false;
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                })
            },
        },
        props: {
            value: {},
            keywordInfo: {
                require: true,
                type: [String, Number],
            },
            title: {},
            oldTags: {},
            isJoom: {
                default() {
                    return false
                }
            }
        },
        components: {
            pageDialog: require('../../../../components/page-dialog.vue').default,
            labelItem: require('../../../../components/label-item.vue').default,
        }
    }
</script>
