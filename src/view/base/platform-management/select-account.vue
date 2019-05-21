<template>
    <div>
        <div class="mb-md">
            <el-row>
                <label-item label="站点：">
                    <el-checkbox-group v-model="saveData.ban_site" style="display:inline-block">
                        <el-checkbox    v-for="item of siteOptions"
                                        :label="item.value"
                                        :key="item.value"
                                        @change="siteChange($event, item)">{{item.label}}
                        </el-checkbox>
                    </el-checkbox-group>
                </label-item>
            </el-row>
            <el-row class="mb-sm mt-sm">
                <label-buttons @select="changeSelect" label="状态：" :buttons="userStatus"
                               :default-index="defaultIndex"></label-buttons>
                <span v-show="selectLength">已选择账号数量：{{selectLength}}条</span>
            </el-row>
            <el-row class="account-float-import">
                <label-item label="账号：">
                    <!--<el-input v-model="search" class="mr-sm" @keydown.enter="searchFilter"></el-input>-->

                    <order-input v-model="search"
                                 class="inline width-super mr-sm"
                                 @keydown.enter="searchFilter"
                                 placeholder="可批量搜索，Shift+回车换行..."></order-input>

                    <el-button size="mini" type="primary" @click="searchFilter">搜索</el-button>
                    <el-button size="mini" type="primary" class="mr-lg button-float" @click="importAccount">导入</el-button>
                </label-item>
            </el-row>
        </div>

        <div class="mb-md height-overflow">
            <el-row>
                <el-button class="mb-mini"
                           size="mini"
                           @click="selectToggle(item.value)"
                           :class="{'ml-xs': index === 0}" v-for="(item, index) in list"
                           :key="index" :type="select.includes(item.value) ? 'primary' : 'default'">
                    {{item.label}}
                </el-button>
            </el-row>
        </div>
        <!--:export-api=""  下载模板的api待詹老师提供。 -->
        <import-excel v-model="showImport"
                      @files-update="files_update"
                      :import-api="api_export_excel"
                      :export-api="api_export_excel"
                      :api-function="apiFunction"
                      :select-list="selectedList">
        </import-excel>

        <!-- 导入结果弹框 -->
        <result-table
             v-model="resultDialog"
             :table="table"
             :title="title"
          ></result-table>
    </div>
</template>

<script>
    import {api_import_excel, api_export_excel} from '../../../api/platform-management.js'
    export default {
        data() {
            return {
                userStatus: [
                    {name: "全部", status: 0},
                    {name: "已选中", status: 1},
                    {name: "未选中", status: 2},
                ],
                defaultIndex: 0,
                search: "",
                filter: [],
                status: -1,
                showImport:false,
                selectedList:[],
                resultDialog: false,
                table:[],
                title:'',
            }
        },
        methods: {
            api_export_excel,
            api_import_excel,
            searchFilter() {
                // this.filter = this.search.trim();
                let curString = this.search.replace(new RegExp(' ', 'gm'), '\n');
                this.filter = curString.split('\n').filter(row => !!row);

            },
            apiFunction(data) {
                return new Promise((resolve, reject) => {
                    this.$http(api_import_excel, this.rowId, data).then(res => {
                        resolve({
                           status: 200,
                           data:res
                        });
                    }).catch(code => {
                        this.$message({type: 'error', message: err.message});
                    });
                });
            },
            /** 导出之后的操作。 */
            files_update(res) {
                console.log(res);
                // 关闭导入弹框。
                setTimeout(() => {
                    //  导出的数据显示
                    this.resultDialog = true;
                    this.table = res.error;
                    this.title = `导入结果：成功(${res.message.length}), 失败(${res.error.length})`;
                //  把导入成功的数据加入到已选择的数据之中;
                    res.message.forEach(id => {
                        if (!~this.select.indexOf(id)) {
                            this.select.push(id);
                        }
                    });
                    debugger;
                    setTimeout(() => {
                        this.select.unshift("asdf");
                        this.select.shift();
                    }, 80)
                }, 300);
            },
            /** 选择站点 */
            siteChange(e, item) {
                if (e.target.checked) {
                    [].push.apply(this.select, this.siteAccountIdList[item.label]);
                } else {
                    // 删除这个站点下所有已选择的账号。
                    this.siteAccountIdList[item.label].forEach(item => {
                        if (this.select.includes(item)) {
                            let index = this.select.findIndex(id => id === item);
                            this.select.splice(index, 1);
                        }
                    });
                }
                setTimeout(() => {
                    this.select.unshift("asdf");
                    this.select.shift();
                }, 80)
            },
            changeSelect(val) {
                this.status = val;
            },
            selectToggle(value) {
                if (!~this.select.indexOf(value)) {
                    this.select.push(value);
                } else {
                    let index = this.select.findIndex(item => item === value);
                    this.select.splice(index, 1);
                }
            },
            /** 导入账号. */
            importAccount() {
                this.showImport = true;
            },
        },
        computed: {
            selectLength() {
               return this.select.length;
            },
            list() {
                let module = [];
                this.accountList.forEach(item => {
                    if (this.filter.length) {
                        // 过滤为true的。--- 如果每一个都不包含的话,就继续。
                        let list = this.filter.map(search => item.label.includes(search)).filter(kk => kk);
                        if (!list.length) {
                            return;
                        }
                    }
                    if (this.status === 0) {
                        module.push(item);
                    } else if (this.status === 1) {
                        if (this.select.includes(item.value)) {
                            console.log()
                            module.push(item);
                        }
                    } else if (this.status === 2) {
                        if (!this.select.includes(item.value)) {
                            module.push(item);
                        }
                    } else {
                        module.push(item);
                    }
                });
                if (module.length > 500) {
                    return module.slice(0, 500);
                } else {
                    return module;
                }
            }
        },
        props: {
            select: {
                /** 包括选中的id数量。 */
                type: Array,
                require: true,
            },
            rowId:{},
            saveData:{},
            accountList: {},   // 整个账号数据.
            siteOptions:{},  // 整个站点list数据 --- 站点下的账号Id缓存
            siteAccountIdList:{},  // 得到所有的站点下面的账号数据。
        },
        components: {
            labelButtons: require('../../../components/label-buttons.vue').default,
            labelItem: require('../../../components/label-item.vue').default,
            importExcel: require('./import-excel').default,
            resultTable: require("./result-table").default,
            orderInput: require("../../../components/order-input.vue").default,
        }
    }
</script>

<style lang="stylus" scoped>
    .height-overflow {
        height: 390px;
        overflow auto
    }
    .account-float-import{
        display block;
        .c-label-item{
            width 100%
        }
        .button-float{
            float right
        }
    }
</style>
