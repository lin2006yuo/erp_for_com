<template>
    <div class="config-site-p-config">
        <el-row class="mt-xs mb-xs">
            <permission tag="ElButton" type="primary" size="mini" @click="add_system" :route="apis.url_system_config">
                添加配置
            </permission>
            <!--<permission tag="ElButton" @click="add_config" :route="apis.url_add_warehouse_config"></permission>-->
        </el-row>
        <div class="config-table scroll">
            <table width="100%"
                   style="border-collapse: collapse;" class="template scroll-bar">
                <template>
                    <tr v-for="(item, key) in systemInfo" :key="key">
                        <th style="width: 50%"><span>{{item.title}}({{key}})</span></th>
                        <td v-if="item.type === 'enabled_radios'">
                            <el-radio-group v-model="systemData.warehouse[key]">
                                <el-radio v-for="radio in enabledRadios" :label="radio.value" :key="radio.value">
                                    {{radio.label}}
                                </el-radio>
                            </el-radio-group>
                        </td>
                        <td v-if="item.type === 'sure_radios'">
                            <el-radio-group v-model="systemData.warehouse[key]">
                                <el-radio v-for="radio in sureRadios" :label="radio.value" :key="radio.value">
                                    {{radio.label}}
                                </el-radio>
                            </el-radio-group>
                        </td>
                        <td v-if="item.type === 'radio'">
                            <el-radio-group v-model="systemData.warehouse[key]">
                                <el-radio :label="0">
                                    否
                                </el-radio>
                                <el-radio :label="1">
                                    是
                                </el-radio>
                            </el-radio-group>
                        </td>
                        <td v-if="item.type === 'input'">
                            <integer-input v-model="systemData.warehouse[key]" :min="0"
                                           class="inline mt-xs mb-xs"></integer-input>
                            <span>{{item.remark}}</span>
                        </td>
                        <td v-if="item.type === 'section'">
                            <label-item v-for="(section, sectionKey) in systemData.warehouse[key]"
                                        class="inline mr-sm mt-xs mb-xs"
                                        :key="sectionKey"
                                        :label="`${item.remark}${sectionKey}：`">
                                <integer-input v-model="section.start" :min="0" class="width-mini"></integer-input>
                                <label>&nbsp;--&nbsp;</label>
                                <integer-input v-model="section.end" :min="0" class="width-mini"></integer-input>
                            </label-item>
                        </td>
                        <td width="55">
                            <permission tag="span" class="disabled"
                                        :route="apis.url_delete_warehouse_config">
                                删除
                            </permission>
                        </td>
                    </tr>
                </template>
                <template>
                    <tr v-for="item in systemData.config" :key="item.title">
                        <th style="width: 20%"><span>{{item.title}}({{item.name}})</span></th>
                        <td v-if="item.type===1">
                            <el-input v-model="item.value" class="inline"></el-input>
                            <span>{{item.remark}}</span>
                        </td>
                        <td v-if="item.type===2">
                            <el-input
                                    type="textarea"
                                    :autosize="{ minRows: 2, maxRows: 4}"
                                    placeholder="请输入内容"
                                    v-model="item.value" style="width: 360px;" class="inline">
                            </el-input>
                            <span>{{item.remark}}</span>
                        </td>
                        <td v-if="item.type===3">
                            <div v-if="item.choose_type===0&&!is_show(item)">
                                <el-radio-group v-model="item.choose">
                                    <el-radio v-for="radio in item.setting"
                                              :label="radio.value"
                                              :key="radio.value">{{radio.key}}
                                    </el-radio>
                                </el-radio-group>
                                <template v-for="radio in item.setting">
                                    <div v-if="item.choose===radio.value&&radio.child.length>0">
                                        <span v-if="radio.choose_type===1">
                                                <el-checkbox v-for="child in radio.child" :key="child.key"
                                                             v-model="child.checked">{{child.key}}</el-checkbox>
                                        </span>
                                        <span v-else>
                                             <el-radio-group v-model="radio.choose">
                                              <el-radio v-for="child in radio.child" :label="child.value"
                                                        :key="child.value">{{child.key}}</el-radio>
                                             </el-radio-group>
                                        </span>
                                    </div>
                                </template>
                            </div>
                            <div v-else-if="item.choose_type===0&&is_show(item)">
                                <el-switch
                                        @change="change_switch(item,$event)"
                                        v-model="item.choose"
                                        :on-text="item.setting[0].key"
                                        :off-text="item.setting[1].key">
                                </el-switch>
                            </div>
                            <div v-else>
                                <el-checkbox v-for="child in item.setting" :key="child.key" v-model="child.checked">
                                    {{child.key}}
                                </el-checkbox>
                                <template v-for="child in item.setting">
                                    <div v-if="child.checked&&child.child.length>0">
                                    <span v-if="child.choose_type===1">
                                                <el-checkbox v-for="child in child.child" :key="child.key"
                                                             v-model="child.checked">{{child.key}}</el-checkbox>
                                        </span>
                                        <span v-else>
                                             <el-radio-group v-model="child.choose">
                                              <el-radio v-for="radio in child.child" :label="radio.value"
                                                        :key="radio.value">{{radio.key}}</el-radio>
                                             </el-radio-group>
                                        </span>
                                    </div>
                                </template>
                            </div>
                        </td>
                        <td width="55">
                            <permission tag="span" class="operate"
                                        @click="delete_config(item)"
                                        :route="apis.url_delete_warehouse_config">
                                删除
                            </permission>
                        </td>
                    </tr>
                </template>
            </table>
        </div>
        <div class="mt-sm ml-sm">
            <permission tag="requestButton"
                        :mintime="300"
                        :route="apis.url_warehouse_config"
                        :request="submit" class="inline">提交
            </permission>
        </div>
        <system-config v-model="systemVisible" @search="$listeners['search']" :id="id"></system-config>
    </div>
</template>
<style lang="stylus">
    .config-site-p-config {
        table.template th, .el-table th {
            background: #eff2f7;
        }
        .scroll {
            overflow: hidden auto;
        }
    }
</style>
<script>
    import {
        api_warehouse_config,
        api_delete_warehouse_config,
        url_warehouse_config,
        url_system_config,
        url_add_warehouse_config,
        url_delete_warehouse_config,
    } from "@/api/storeManagement";

    export default {
        permission: {
            url_warehouse_config,
            url_system_config,
            url_add_warehouse_config,
            url_delete_warehouse_config,
        },
        data() {
            return {
                enabledRadios: [
                    {value: 0, label: '不设置'},
                    {value: 1, label: '允许'},
                    {value: 2, label: '不允许'},
                ],
                sureRadios: [
                    {value: 0, label: '不设置'},
                    {value: 1, label: '是'},
                    {value: 2, label: '否'},
                ],
                systemInfo: {
                    /*singleOrMore: {
                        title: '允许单品多件包裹与单品单件包裹进入同一张拣货单？',
                        remark: '',
                        type: 'enabled_radios',
                    },
                    moreCarrier: {
                        title: '允许不同物流商的包裹进入同一张拣货单？',
                        remark: '',
                        type: 'enabled_radios',
                    },*/
                    is_auto_check: {
                        title: '是否触发自动复核成功',
                        remark: '',
                        type: 'sure_radios',
                    },
                    test_print: {
                        title: '是否测试打印',
                        remark: '',
                        type: 'sure_radios',
                    },
                    /*bind_picking: {
                        title: '每人最多可以同时绑定？拣货单',
                        remark: '',
                        type: 'input',
                    },
                    picking_max_quantity: {
                        title: '默认每张拣货单最大货品数',
                        remark: '',
                        type: 'input',
                    },
                    package_weight_min_deviation: {
                        title: '包裹重量误差最大值',
                        remark: '',
                        type: 'input',
                    },
                    package_weight_max_deviation: {
                        title: '包裹重量误差最小值',
                        remark: '',
                        type: 'input',
                    },
                    collection_weight_min_deviation: {
                        title: '集包重量误差最小值',
                        remark: '',
                        type: 'input',
                    },
                    collection_weight_max_deviation: {
                        title: '集包重量误差最大值',
                        remark: '',
                        type: 'input',
                    },
                    single_manual_value: {
                        title: '单品多件阀值',
                        remark: '',
                        type: 'input',
                    },
                    is_allow_stop: {
                        title: '是否允许结束含有未包包裹的拣货单或周转箱',
                        remark: '',
                        type: 'input',
                    },*/
                    shelf_days: {
                        title: '包裹预接收到上架的天数',
                        remark: '',
                        type: 'input',
                    },
                    is_divide_platform: {
                        title: '是否支持平台分库存',
                        remark: '',
                        type: 'radio',
                    },
                    weight_interval: {
                        title: '集包数重量区间（g）',
                        remark: '区间',
                        type: 'section'
                    }
                },
                systemVisible: false,
                addVisible: false,
            }
        },
        methods: {
            is_show(item) {
                let list = ["tort_ebay", "tort_amazon", "tort_wish", "tort_aliexpress", "tort_pandao", "tort_joom", "tort_shopee"];
                return list.includes(item.name);
            },
            change_switch(item, val) {
                let title = '';
                if (val === false) {
                    title = `您将关闭${item.name}平台侵权商品自动下架，确认该操作吗？`
                } else {
                    title = `您将开启${item.name}平台侵权商品自动下架，确认该操作吗？`
                }
                this.$confirm(`${title}`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    item.choose = val
                }).catch(() => {
                    item.choose = !val;
                });
            },
            submit() {
                let postData = clone(this.systemData);
                if (!this.validate(postData)) {
                    this.$message({type: 'error', message: '集包数重量区间设置有误，请检查！'});
                    return;
                }
                let data = this.get_params(postData);
                return this.$http(api_warehouse_config, this.id, data).then(res => {
                    this.$message({type: "success", message: res.message || res});
                    return Promise.resolve()
                }).catch(code => {
                    this.$message({message: code.message || code, type: 'error'});
                })
            },
            get_params(postData) {
                let data = {};
                Object.assign(data, postData.warehouse);
                let configData = [];

                window.clone(postData.config).forEach(row=>{
                    let  temp={};
                    temp.type=row.type;
                    temp.name=row.name;
                    temp.choose_type=row.choose_type;
                    switch (row.type){
                        case 1:
                            temp.value=row.value;
                            break;
                        case 2:
                            temp.value=row.value;
                            break;
                        case 3:
                            if(row.choose_type){
                                temp.value=[];
                                row.setting.forEach(item=>{
                                    if(item.checked){
                                        let child={value:item.value};
                                        if(item.choose_type){
                                            child.child=item.child.filter(child=> child.checked)
                                            child.child=child.child.map(child=>{
                                                return {key:child.key, value:child.value}
                                            })
                                        }else {
                                            if(item.choose){
                                                let find=item.child.find(child=>{
                                                    return  child.value===item.choose;
                                                })
                                                if(!!find){
                                                    child.child=[find]
                                                }else {
                                                    child.child=[];
                                                }
                                            }else {
                                                child.child=[];
                                            }
                                        }
                                        temp.value.push(child)
                                    }
                                })
                            }else {
                                if(this.is_show(row)){
                                    row.choose = row.choose?'1':'0';
                                }
                                if(row.choose){
                                    let find=row.setting.find(item=>{
                                        return  item.value===row.choose
                                    });
                                    if(!!find){
                                        if(find.choose_type){
                                            let childs=find.child.filter(child=>child.checked)
                                            find.child=childs.map(child=>{
                                                return {
                                                    key:child.key,
                                                    choose_type:child.choose_type,
                                                    value:child.value,
                                                }
                                            })
                                        }else {
                                            let find2=  find.child.find(child=>{
                                                return find.choose===child.value
                                            });
                                            find2&&(find.child=[find])
                                            !find2&&(find.child=[])
                                        }
                                        temp.value={value:find.value,child:find.child}
                                    }else {
                                        temp.value=''
                                    }
                                }else {
                                    temp.value=''
                                }
                            }
                            break;
                    }
                    configData.push(temp);
                });
                configData.forEach(row => {
                    data[row.name] = row.value;
                });
                return data;
            },
            validate(data) {
                if (Object.values(data.warehouse.weight_interval).some(({start, end}) => {
                    return Number(start) > Number(end)
                })) {
                    return false;
                } else {
                    return Object.values(data.warehouse.weight_interval).reduce((flag, {start, end}) => {
                        if (flag.result === false) {
                            return flag
                        } else {
                            if (flag.end > start) {
                                flag.result = false;
                                return flag;
                            } else {
                                flag.start = start;
                                flag.end = end;
                                return flag;
                            }
                        }
                    }, {start: 0, end: 0, result: true}).result;
                }
            },
            add_system() {
                this.systemVisible = true;
            },
            /*add_config() {
                this.addVisible = true;
            },*/
            delete_config(item) {
                this.$confirm(`您将删除${item.title}参数,确认此操作吗？`, '提示', {
                    type: 'warning',
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                }).then(() => {
                    this.$http(api_delete_warehouse_config, {config_id: item.id}).then(res => {
                        this.$message({type: 'success', message: res.message || res});
                        this.$emit('search', this.id);
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message || code});
                    });
                }).catch(() => {
                    this.$message({type: 'info', message: '已取消'});
                });
            }
        },
        props: {
            systemData: {},
            id: {},
        },
        components: {
            requestButton: require('@/global-components/request-button').default,
            integerInput: require('@/components/integer-input.vue').default,
            labelItem: require('@/components/label-item.vue').default,
            systemConfig: require('./system-config.vue').default,
        }
    }
</script>
