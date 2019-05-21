<template>
    <page-dialog v-model="show"
                 title="产品分配设置"
                 :size="size"
                 @close="close"
                 @open="open"
                 :close-on-click-modal="false">
        <el-row>
            <!-- 左半部分 -->
            <el-col :span="showContent?6:24">
                <el-card>
                    <div slot="header">
                        <el-checkbox label="仅显示勾选项" v-model="showChecked"></el-checkbox>
                        <el-checkbox label="显示选项内容" v-model="showContent"></el-checkbox>
                    </div>
                    <div class="container-platfrom-config">
                        <div class="check-wrapper-platform-config"
                             :class="{ 'checkbox-wrapper-padding':menuType===item.value}"
                             v-for="item of distributionOption"
                             :key="item.label"
                             >
                            <el-checkbox :value="selectItem(item)" @change="selectItemChange($event,item)"></el-checkbox>
                            <span class="ml-sm pointer" @click.stop="checkbox_change(item)">{{item.label}}</span>
                        </div>
                    </div>
                </el-card>
            </el-col>

            <!-- 右半部分 -->
            <el-col :span="18" v-show="showContent">
                <el-card>
                    <!-- 标题栏 -->
                    <div slot="header">
                        <el-row>
                            <el-col :span="6">
                                <div style="padding-bottom:0.15rem">{{title}}</div>
                            </el-col>
                            <!-- 产品关联类型 -->
                            <el-col :span="18">
                                <el-col :span="6">
                                    <el-radio class="radio" v-show="menuType===5"
                                              v-model="saveData.category_relation_type" :label="1">账号
                                    </el-radio>
                                </el-col>
                                <el-col :span="18">
                                    <el-radio class="radio" v-show="menuType===5"
                                              v-model="saveData.category_relation_type" :label="2">部门
                                    </el-radio>
                                </el-col>
                            </el-col>
                        </el-row>
                    </div>

                    <div class="container-platfrom-config">
                        <el-col :span="24" v-show="!fullWidth">
                            <div class="container-platfrom-config">
                                <!-- 产品状态设置 -->
                                <div v-show="menuType===1">
                                    <div class="checkbox-wrapper">
                                        <el-checkbox v-model="productStatusCheckAll"
                                                     @change="check_all">全选
                                        </el-checkbox>
                                    </div>
                                    <el-checkbox-group v-model="saveData.product_status">
                                        <div class="checkbox-wrapper " v-for="item of productStatus" :key="item.value">
                                            <el-checkbox :label="item.value">{{item.label}}</el-checkbox>
                                        </div>
                                    </el-checkbox-group>
                                </div>

                                <!-- 受限产品分类设置 -->
                                <div v-show="menuType===2">
                                    <div class="checkbox-wrapper">
                                        <el-checkbox v-model="firstCategoriesCheckAll"
                                                     @change="check_all">全选
                                        </el-checkbox>
                                    </div>
                                    <el-checkbox-group v-model="saveData.ban_category" class="restricted-product-classification">
                                        <div class="checkbox-wrapper" v-for="item of firstCategories" :key="item.value">
                                            <el-checkbox :label="item.value">{{item.label}}</el-checkbox>
                                        </div>
                                    </el-checkbox-group>
                                </div>
                            </div>
                        </el-col>

                        <!-- 受限制的账号。-->
                        <el-col :span="24" v-show="fullWidth">
                            <div class="container-platfrom-config">
                                <!-- 受限账号 -->
                                <div v-if="menuType===3">
                                    <!-- 站点列表 -->
                                    <select-account
                                        :select="saveData.ban_account_id"
                                        :accountList="limitedAccountOptions"
                                        :siteOptions="siteOptions"
                                        :saveData="saveData"
                                        :rowId="rowId"
                                        :siteAccountIdList="siteAccountIdList"
                                    >
                                    </select-account>
                                </div>

                                <!-- 产品刊登覆盖率设置 -->
                                <div v-show="menuType===4">
                                    <el-form :inline="true" :model="saveData" :rules="rules" ref="ruleForm1">
                                        <el-form-item label="最小覆盖率：" prop="coverage_rate_min">
                                            <el-input style="width:300px"
                                                      v-model.number="saveData.coverage_rate_min"
                                                      placeholder="请输入最小覆盖率"></el-input>
                                        </el-form-item>
                                    </el-form>
                                </div>


                                <!-- 产品分类关联设置 -->
                                <div v-if="menuType===5">
                                    <!-- 左部导航栏 -->
                                    <el-col :span="6" class="scroll relation-height-config">
                                        <el-menu v-show="menuType===5"
                                                 default-active="0"
                                                 @select="menu_select">
                                            <template v-for="(type,index) of firstCategories">
                                                <el-menu-item :index="index.toString()" :key="index">{{type.label}}
                                                </el-menu-item>
                                            </template>
                                        </el-menu>
                                    </el-col>

                                    <!-- 右部内容区 -->
                                    <el-col :span="18" class="relation-height-config">
                                        <div class="card-wrapper">
                                            <el-row class="standard-line">
                                                <el-col :span="20">
                                                    <el-input v-show="saveData.category_relation_type===2"
                                                              v-model="searchAccountDep" style="width:300px"></el-input>
                                                    <!--<el-input v-show="saveData.category_relation_type===1"-->
                                                    <!--v-model="searchAccountAcc" style="width:300px"></el-input>-->
                                                    <order-input v-model="searchAccountAcc"
                                                                 v-show="saveData.category_relation_type===1"
                                                                 class="inline width-super mr-sm"
                                                                 @keydown.enter="search_account(2, saveData.category_relation_type)"
                                                                 placeholder="可批量搜索，Shift+回车换行..."></order-input>
                                                    <el-button type="primary" size="mini"
                                                               @click.native="search_account(2,saveData.category_relation_type)">
                                                        搜索
                                                    </el-button>
                                                </el-col>
                                                <el-col :span="4">
                                                    <el-checkbox v-model="showChecked_"
                                                                 v-show="saveData.category_relation_type===1"
                                                                 @change="show_checked_">仅显示勾选项
                                                    </el-checkbox>
                                                </el-col>
                                            </el-row>
                                            <!-- 账号 -->
                                            <el-row class="height-scroll-account"
                                                    v-show="saveData.category_relation_type===1">
                                                <el-checkbox-group v-model="accountList" @change="accountList_change">
                                                    <div class="account-display-flex">
                                                        <template v-for="account of accountOption">
                                                            <div class="checkbox-wrapper inline" :key="account.value">
                                                                <el-checkbox :label="account.value"
                                                                >{{account.label}}
                                                                </el-checkbox>
                                                            </div>
                                                        </template>
                                                    </div>
                                                </el-checkbox-group>
                                            </el-row>
                                            <!-- 部门 -->
                                            <el-row v-show="saveData.category_relation_type===2" class="platfrom-config-department-tree">
                                                <el-tree :data="departmentOptions"
                                                         :props="defaultProps"
                                                         ref="tree"
                                                         node-key="department_id"
                                                         :filter-node-method="filterNode"
                                                         show-checkbox
                                                         @check-change="department_select">
                                                </el-tree>
                                            </el-row>
                                        </div>
                                    </el-col>
                                </div>

                                <!-- 每日刊登均值 -->
                                <div v-show="menuType===6">
                                    <el-form :inline="true" :model="saveData" :rules="rules" ref="ruleForm2">
                                        <el-form-item label="每日刊登均值：" prop="publish_value_min">
                                            <el-input v-model.number="saveData.publish_value_min"></el-input>
                                        </el-form-item>
                                        <el-form-item label=" ~ "></el-form-item>
                                        <el-form-item prop="publish_value_est">
                                            <el-input v-model.number="saveData.publish_value_est"></el-input>
                                        </el-form-item>
                                    </el-form>
                                </div>
                                <!-- 受限人员职位设置 -->
                                <div v-show="menuType===7">
                                    <div class="checkbox-wrapper">
                                        <el-checkbox v-model="limitedMemberCheckAll"
                                                     @change="check_all">全选
                                        </el-checkbox>
                                    </div>
                                    <el-checkbox-group v-model="saveData.allow_position">
                                        <div class="checkbox-wrapper" v-for="item of limitedMemberOptions"
                                             :key="item.value">
                                            <el-checkbox :label="item.value">{{item.label}}</el-checkbox>
                                        </div>
                                    </el-checkbox-group>
                                </div>
                                <!-- 其它设置 -->
                                <div v-show="menuType===8">
                                    <label-item label="占比计算方式：" class="ml-md inline">
                                        <el-select v-model="saveData.proportion_type"
                                                   style="width:300px"
                                                   @change="caculating_type_change">
                                            <el-option v-for="type in caculatingTypeOptions"
                                                       :label="type.label"
                                                       :value="type.value"
                                                       :key="type.value">
                                            </el-option>
                                        </el-select>
                                    </label-item>
                                    <set-proportion ref="setProportion"
                                                    :id="rowId"
                                                    @submit-distribution="submit_distribution"
                                                    v-show="proportionVisible">
                                    </set-proportion>
                                </div>
                            </div>
                        </el-col>


                    </div>
                </el-card>
            </el-col>
        </el-row>
        <div slot="footer">
            <el-button type="primary" size="mini" @click.native="submit">确定</el-button>
            <el-button size="mini" @click.native="close">关 闭</el-button>
        </div>
    </page-dialog>
</template>

<script>
    import {
        api_get_distribution,
        api_get_first_categories,
        api_get_sites,
        api_get_accounts,
        api_get_deps,
        api_get_position,
        api_put_distribution,
        api_get_channel_distribution,
        api_import_excel
    } from '../../../api/platform-management.js'
    import {setTimeout} from 'timers';

    export default {
        data() {
            let validateNum = (rule, value, callback) => {
                if (/^[1-9][0-9]*$/.test(value)) {
                    callback();
                } else {
                    callback(new Error('请输入正整数'));
                }
            };
            return {
                checkboxSettingList: [],
                distributionOptions: [
                    {label: '产品状态设置', value: 1},
                    {label: '产品分类关联设置', value: 5},
                    {label: '产品刊登覆盖率设置', value: 4},
                    {label: '每日刊登数均值设置', value: 6},
                    {label: '参与人员职位设置', value: 7},
                    {label: '受限产品分类设置', value: 2},
                    {label: '受限账号设置', value: 3},
                    {label: '其它设置', value: 8},
                ],

                productStatus: [],//储存所有选项数据的数组
                productStatusCheckAll: false,//全选开关

                firstCategories: [],
                firstCategoriesCheckAll: false,

                siteOptions: [],
                siteCheckAll: false,

                accountOption: [],
                accountOptions: [],//产品关联页面账号列表

                limitedAccountAll: [],//所有账号value列表，用于设置全选
                limitedAccountOptions: [],//受限账号页面账号列表
                limitedAccounts: [],//所有账号列表
                limitedAccountCheckAll: false,

                limitedMemberOptions: [],
                limitedMemberCheckAll: false,

                accountList: [],
                emptySaveData: {
                    item: [1],
                    product_status: [],  // 产品状态。
                    ban_category: [],    // 受限产品。，分类设置。
                    ban_site: [],
                    ban_account_id: [],
                    coverage_rate_min: '',
                    category_relation_type: 1,
                    category_department: [],
                    category_account: [],
                    publish_value_min: '',
                    publish_value_est: '',
                    allow_position: [],
                    proportion_type: 0
                },
                saveData: {
                    item: [1],
                    product_status: [],  // 产品状态。
                    ban_category: [],    // 受限产品。，分类设置。
                    ban_site: [],
                    ban_account_id: [],
                    coverage_rate_min: '',
                    category_relation_type: 1,
                    category_department: [],
                    category_account: [],
                    publish_value_min: '',
                    publish_value_est: '',
                    allow_position: [],
                    proportion_type: 0
                },
                tabPosition: 'top',
                menuType: 1,//控制右半边显示的页面
                categoryId: 1,
                departmentId: [],
                proportionVisible: false,
                checked: '',
                searchResult: '',
                searchAccount: '',
                searchAccountAcc: '',
                searchAccountDep: '',
                showChecked: false,//左半边卡片仅显示勾选项开关
                showChecked_: false,//产品分类关联页面仅显示勾选项开关
                showContent: true,
                canDelete: true,
                canSearch: false,
                baseType: '1',
                caculatingTypeOptions: [
                    {label: '按照部门人数占比自动计算', value: 0},
                    {label: '自定义设置', value: 1},
                ],
                departmentData: [],
                departmentOptions: [],
                departmentOption: [],
                defaultProps: {
                    label: 'department_name',
                    children: 'child'
                },
                rules: {
                    coverage_rate_min: [{validator: validateNum, trigger: 'change'}],
                    publish_value_min: [{validator: validateNum, trigger: 'change'}],
                    publish_value_est: [{validator: validateNum, trigger: 'change'}],
                },
                size: {
                    width: "70%"
                },
                siteAccountIdList: {},   // 分配设置站点对应的account list id;
            };
        },
        created() {
            this.saveData = clone(this.emptySaveData);
        },
        methods: {
            open() {
                this.get_distribution();
                this.get_first_categories();
                this.get_sites();
                this.get_accounts();
                this.get_deps();
                this.get_position();
                this.get_channel_distribution();
            },
            close() {
                this.show = false;
                this.menuType = 1;
                this.categoryId = 1;
                this.accountList = [];
                this.saveData = clone(this.emptySaveData);
                this.showChecked = false;
                this.showContent = true;
            },
            /** 确定选中项。 */
            selectItem(item) {
                return this.saveData.item.includes(item.value);
            },
            /** 改变选中项。 */
            selectItemChange(e, item) {
                if (e.target.checked) {
                    this.saveData.item.push(item.value);
                } else {
                    let index = this.saveData.item.findIndex(key1 => key1 === item.value);
                    this.saveData.item.splice(index, 1);
                }
            },
            /** 产品状态设置-获取展示的产品状态--*/
            get_distribution() {
                this.$http(api_get_distribution)
                    .then(res => {
                        this.productStatus = res;
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            /** 获取一级分类. */
            get_first_categories() {
                this.$http(api_get_first_categories)
                    .then(res => {
                        this.firstCategories = res;
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            /** 得到站点.*/
            get_sites() {
                this.$http(api_get_sites, this.rowId)
                    .then(res => {
                        this.siteOptions = res;
                        let objSite = {};
                        res.forEach(item => {
                            objSite[item.label] = [];
                        });
                        this.siteAccountIdList = objSite;
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            get_accounts() {
                this.$http(api_get_accounts, this.rowId)
                    .then(res => {
                        this.accountOption = res.length > 500 ? clone(res).slice(0, 500) : clone(res);
                        this.accountOptions = clone(res);
                        this.limitedAccountOptions = res.map(item => {
                            item.show = true;
                            item.type = 'default'
                            return item;
                        });
                        this.limitedAccounts = res.map(item => {
                            item.show = true;
                            item.type = 'default';
                            return item;
                        });
                        this.limitedAccountAll = this.limitedAccountOptions.map(item => {
                            return item.value
                        });
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            get_deps() {
                this.$http(api_get_deps, this.rowId)
                    .then(res => {
                        this.departmentOptions = clone(res);
                        this.departmentOption = clone(res);
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            get_position() {
                this.$http(api_get_position)
                    .then(res => {
                        this.limitedMemberOptions = res;
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            /** 获取初始数据. */
            get_channel_distribution() {
                this.$http(api_get_channel_distribution, this.rowId)
                    .then(res => {
                        if (res.item.length === 0) {
                            res.item = [1]
                        }
                        this.saveData = res;
                        this.menu_select(0);
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            submit() {
                if (this.validate()) {
                    //自定义占比
                    if (this.saveData.proportion_type === 1) {
                        //先提交自定义占比，成功后再提交其他数据
                        this.$refs.setProportion.set_proportion();
                    }
                    //自动分配
                    else if (this.saveData.proportion_type === 0) {
                        this.submit_distribution();
                    }
                }
            },
            submit_distribution() {
                this.$http(api_put_distribution, this.rowId, this.saveData)
                    .then(res => {
                        this.$message({type: 'success', message: res.message});
                        setTimeout(() => {
                            this.show = false;
                        }, 300);
                    })
                    .catch(err => {
                        this.$message({type: 'error', message: err.message});
                    })
            },
            validate() {
                let ruleForm1 = true;
                let ruleForm2 = true;

                if (this.saveData.publish_value_min > this.saveData.publish_value_est) {
                    this.$message({type: 'warning', message: '每日刊登均值左边不得大于右边！'});
                    return false;
                }

                if (this.saveData.item.includes(4)) {
                    this.$refs["ruleForm1"].validate((valid) => {
                        if (!valid) {
                            ruleForm1 = false;
                        }
                    })
                }
                if (this.saveData.item.includes(6)) {
                    this.$refs["ruleForm2"].validate((valid) => {
                        if (!valid) {
                            ruleForm2 = false;
                        }
                    })
                }
                return (ruleForm1 && ruleForm2);
            },
            /** 切换选中项 */
            checkbox_change(item) {
                this.menuType = item.value;
            },
            accountList_change() {
                //判断储存当前页面账号数据的对象是否存在
                let child = this.saveData.category_account.find(item => {
                    return item.category_id == this.categoryId;
                });
                //若存在，直接改变account_id
                if (child) {
                    child.account_id = this.accountList;
                } else {
                    //若不存在，新建对象
                    let myChild = {category_id: this.categoryId, account_id: this.accountList};
                    this.saveData.category_account.push(myChild);
                }
            },
            // 产品分类关联设置导航栏点击事件
            menu_select(key) {
                this.categoryId = this.firstCategories[key].value;
                this.show_checked_();

                // 回填选择账号
                this.handle_account();
                // 回填选择部门。
                this.handle_department();
            },
            // 账号页面的处理逻辑
            handle_account() {
                //判断saveData里对应当前categoryId的账号对象是否存在
                let child = this.saveData.category_account.find(item => {
                    return item.category_id == this.categoryId;
                });
                //若存在，读取account_id,找到对应的label，推入accountList
                if (child) {
                    this.accountList = child.account_id;
                }
                //若不存在，清空accountList
                else {
                    this.accountList = [];
                }
            },
            //部门页面的处理逻辑
            handle_department() {
                //判断saveData里对应当前categoryId的部门对象是否存在
                //切换页面后，禁止自动删除原页面数据
                this.canDelete = false;

                let child = this.saveData.category_department.find(item => {
                    return item.category_id === this.categoryId;
                });
                //若存在,读取department_id,将对应的部门节点设置为选中
                if (child) {
                    this.$refs.tree.setCheckedKeys(child.department_id);
                    this.departmentId = child.department_id;
                }
                //若不存在,清空节点(已选中的节点会触发自身的点击事件)
                else {
                    this.$refs.tree.setCheckedKeys([]);
                    this.departmentId = [];
                }
                //设置延时，待自动触发的删除事件完毕后，允许手动删除
                setTimeout(() => {
                    this.canDelete = true;
                }, 500);

            },
            department_select(data, checked, indeterminate) {
                //若节点被选中,将其id推入数组
                if (checked) {
                    if (!this.departmentId.includes(data.department_id)) {
                        this.departmentId.push(data.department_id);
                    }
                }
                //若节点被取消,从数组中删除对应的id
                //切换页面后，原页面的数据会被自动删除
                //原因是更改节点选中状态会触发点击事件
                //canDelete用于阻止这种行为
                else {
                    if (this.canDelete) {
                        let index = this.departmentId.indexOf(data.department_id);
                        if (index >= 0) {
                            this.departmentId.splice(index, 1);
                        }
                    } else {
                        console.log("拒绝删除");
                        return
                    }
                }
                //判断储存当前页面选中部门的对象是否存在
                let child = this.saveData.category_department.find(item => {
                    return item.category_id === this.categoryId;
                });
                //若存在,直接改变department_id
                if (child) {
                    child.department_id = this.departmentId;
                }
                //若不存在，创建新对象
                else {
                    let myChild = {category_id: this.categoryId, department_id: this.departmentId};
                    this.saveData.category_department.push(myChild);
                }
            },
            select_account() {
                console.log("更新已选择的受限账号");
            },
            check_all(event, index) {
                switch (this.menuType) {
                    //产品状态
                    case 1:
                        this.saveData.product_status = event.target.checked ? this.productStatus.map(item => {
                            return item.value
                        }) : [];
                        break;
                    //分类设置
                    case 2:
                        this.saveData.ban_category = event.target.checked ? this.firstCategories.map(item => {
                            return item.value
                        }) : [];
                        break;
                    //站点
                    case 3:
                        if (index === 0) {
                            let sites = [];
                            this.siteOptions.forEach(item => {
                                sites.push(item.value);
                            })
                            if (event.target.checked) {
                                this.site_change(true, sites);
                            } else {
                                this.site_change(false, sites);
                            }
                            // this.saveData.ban_site = event.target.checked ? this.siteOptions.map(item=>{return item.value}) : [];
                            break;
                        }
                    //受限职位
                    case 7:
                        this.saveData.allow_position = event.target.checked ? this.limitedMemberOptions.map(item => {
                            return item.value
                        }) : [];
                        break;
                }
            },
            show_checked_() {
                //账号
                if (this.saveData.category_relation_type === 1) {
                    let checkedAccount = [];
                    if (this.showChecked_) {
                        //找出当前页面选中的账号
                        let findCategory = this.saveData.category_account.find(item => {
                            return item.category_id === this.categoryId;
                        });
                        if (findCategory) {
                            let checkedList = findCategory.account_id;
                            checkedList.forEach(checked => {
                                let checkedItem = this.accountOptions.find(option => {
                                    return option.value === checked;
                                });
                                checkedAccount.push(checkedItem);
                            });
                            this.accountOption = this.outPutList(checkedAccount);
                        } else {
                            this.accountOption = []
                        }
                    } else {
                        this.accountOption = this.outPutList(this.accountOptions);
                    }
                }
            },
            caculating_type_change(val) {
                if (val == 1) {
                    this.proportionVisible = true;
                } else {
                    this.proportionVisible = false;
                }
            },
            /** 得到站点后获得所有的站点对应的账号做一个缓存. */
            site_change(key, obj) {
                let params = {
                    site: [key]
                };
                this.$http(api_get_accounts, this.rowId, params)
                    .then(res => {
                        obj[key] = res.map(item => item.value);
                    })
                    .catch(err => {
                        console.log(err.message)
                    })
            },
            search_account(searchType, relationType) {
                if (searchType === 2) {
                    //账号
                    if (relationType === 1) {
                        if (!this.searchAccountAcc.trim()) {
                            this.accountOption = this.outPutList(this.limitedAccounts);
                            return;
                        } else {
                            this.accountOption = this.findList(this.searchAccountAcc);
                        }
                    }
                    //部门
                    if (relationType === 2) {
                        this.$refs.tree.filter(this.searchAccountDep);
                    }
                }
            },
            /** 输出500条数据。*/
            outPutList(list) {
                let list1 = clone(list);
                return list1.length > 500 ? list1.slice(0, 500) : list1;
            },
            /** 找到批量搜索到的内容  */
            findList(str) {
                let curString = str.replace(new RegExp(' ', 'gm'), '\n');
                let cur = curString.split('\n').filter(row => !!row);
                let list = [];
                cur.forEach(item => {
                    let filterList = this.limitedAccounts.filter(account => {
                        if (account.label.includes(item)) {
                            return item;
                        }
                    });
                    [].push.apply(list, filterList);
                });
                return list;
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.department_name.includes(this.searchAccountDep);
            },
        },
        computed: {
            title() {
                switch (this.menuType) {
                    case 1:
                        return '产品状态'
                        break;
                    case 2:
                        return '受限产品分类设置'
                        break;
                    case 3:
                        return '受限帐号'
                        break;
                    case 4:
                        return '产品刊登覆盖率'
                        break;
                    case 5:
                        return '产品分类关联设置'
                        break;
                    case 6:
                        return '销售员每日刊登数量设置'
                        break;
                    case 7:
                        return '受限人员职位'
                        break;
                    case 8:
                        return '其他设置'
                        break;
                }
            },
            show: {
                get() {
                    return this.value;
                },
                set(val) {
                    this.$emit("input", val);
                }
            },
            fullWidth() {
                const fullWidthType = [3, 4, 5, 6, 7, 8];
                return fullWidthType.includes(this.menuType);
            },
            distributionOption() {
                let checkedList = [];
                /**
                 *只显示已勾选项
                 *(distributionOptions):所有选项
                 *(saveData.item):已勾选项id数组
                 *(checkedList):已勾选项
                 */
                if (this.showChecked) {
                    this.saveData.item.forEach(item => {
                        let checked = this.distributionOptions.find(option => {
                            return item === option.value;
                        })
                        checkedList.push(checked);
                    })
                    return checkedList;
                } else {
                    return this.distributionOptions;
                }
            },

        },
        watch: {
            siteAccountIdList(val) {
                for (let key in val) {
                    this.site_change(key, val);
                }
            }
        },
        props: {
            value: Boolean,
            rowId: {}
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            setProportion: require('./set-proportion.vue').default,
            limitedAccount: require('./limited-account.vue').default,
            selectAccount: require("./select-account").default,
            orderInput: require("../../../components/order-input.vue").default,
        }
    }
</script>

<style lang="stylus" scoped>
    .vta-top
        vertical-align top

    .el-card__body
        height 584px

    .scroll
        overflow-y: scroll
        overflow-x: hidden

    .el-checkbox-group
        .el-checkbox
            margin-left 15px

    label
    .el-button
    .el-input
    .el-checkbox
        display inline-block
        vertical-align middle

    .standard-line
        margin-bottom 15px

        .el-col
            line-height 26px

    .container-platfrom-config
        height 550px
        max-height 550px

        .checkbox-wrapper
            margin-bottom 12px

    .card-wrapper
        padding 1px 5px 0 30px

    .import-button
        width 40px
        height 24px
        position relative
        text-align center
        border-radius 3px;
        color #fff
        background-color #33B2FC
        border 1px solid #33B2FC;
        cursor pointer

        &:hover
            background-color #2ba5e2
        input
            width 100%
            height 100%
            position absolute
            left 0
            top 0
            opacity 0
            z-index -10

    .relation-height-config {
        height 530px;
        max-height 530px;
    }
    .account-display-flex {
        display flex;
        flex-wrap wrap;
        .checkbox-wrapper {
            width 33%;
            flex 0 0 33%
        }
    }
    .check-wrapper-platform-config{
        display flex
        align-items center;
        padding 6px 2px;
    }
    .checkbox-wrapper-padding{
        background #eff2f7
    }
    .height-scroll-account {
        height 480px;
        overflow auto
    }
    .restricted-product-classification{
        display flex
        flex-wrap wrap
        .checkbox-wrapper{
            width 33%;
            flex  0 0 33%;
        }
    }
    .platfrom-config-department-tree{
        height 450px;
        overflow auto
    }
</style>
