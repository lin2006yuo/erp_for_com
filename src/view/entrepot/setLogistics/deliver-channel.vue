<template>
    <page class="c-logistics-deliver-channel">
        <el-row>
            <ui-table element-loading-text="玩命加载中..."
                      ref="table"
                      :has-data="channelData.channels.length>0"
                      class="local"
                      v-model="checkAll"
                      @check="change_all"
                      :body-height="65"
                      :heads="[
                        {isCheck:true,width:5},
                        {label:'可发货平台',width:15},
                        {label:'价格区间(买家付款总额)',width:50},
                        {label:'站点',width:30}
                        ]">
                <tbody>
                <template v-for="(row,index) in channelData.channels">
                    <tr :key="index">
                        <td>
                            <el-checkbox v-model="row.enabled" @change="change(row)"></el-checkbox>
                        </td>
                        <td>
                            <plus-minus class="fl"
                                        @show-detail="show(index,row)"
                                        :show="row.siteShow"
                                        :title="tipTitle"
                                        v-if="row.use_site === 1"></plus-minus>
                            <div>{{row.channel_name}}</div>
                        </td>
                        <td>
                            <div v-if="row.use_site === 0 && row.content.length !== 0">
                                <integer-input v-model.number="row.content[0].min"
                                               class="inline"
                                               :disabled="!row.enabled"
                                               :min="0"
                                ></integer-input>
                                <label class="inline">&nbsp;—&nbsp;</label>
                                <integer-input v-model.number="row.content[0].max"
                                               :min="0"
                                               :disabled="!row.enabled"
                                               class="inline"
                                ></integer-input>
                                <span class="ml-lg">币种： </span>
                                <el-select v-model="row.content[0].currency"
                                           placeholder="请选择币种"
                                           :disabled="!row.enabled"
                                           class="fr right-log  width-lg">
                                    <el-option v-for="item in currencyList"
                                               :key="item.code"
                                               :label="item.code"
                                               :value="item.code"
                                               filterable
                                               clearable>
                                        <span style="float: left">{{ item.code }}</span>
                                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-if="row.use_site === 1">
                                <el-button size="mini"
                                           type="primary"
                                           class="inline width-super" @click.native="change_add_site(row)"
                                           :disabled="!row.enabled">添加站点
                                </el-button>
                            </div>
                        </td>
                        <td>
                            <div v-if="row.has_site">
                                <span>是否开启站点配置： </span>
                                <el-radio-group v-model="row.use_site" class="ml-lg" :disabled="!row.enabled"
                                                @change="change_use_site(row)">
                                    <el-radio :label=1>是</el-radio>
                                    <el-radio :label=0>否</el-radio>
                                </el-radio-group>
                            </div>
                        </td>
                    </tr>
                    <template v-if="row.use_site === 1 && row.siteShow">
                        <tr>
                            <th></th>
                            <th>站点</th>
                            <th>价格区间(买家付款总额)</th>
                            <th>操作</th>
                        </tr>
                        <tr v-for="(item,index) in row.content " v-if="item.site_code != ''">
                            <td></td>
                            <td>{{item.site_code}}</td>
                            <td>
                                <div>
                                    <integer-input class="inline"
                                                   v-model.number="item.min"
                                                   :min="0"></integer-input>
                                    <label class="inline">&nbsp;—&nbsp;</label>
                                    <integer-input class="inline"
                                                   v-model.number="item.max"
                                                   :min="0"></integer-input>
                                    <span class="ml-lg">币种： </span>
                                    <el-select v-model="item.currency"
                                               placeholder="请选择币种"
                                               class="fr  right-log  width-lg">
                                        <el-option v-for="item in currencyList"
                                                   :key="item.code"
                                                   :label="item.code"
                                                   :value="item.code"
                                                   filterable
                                                   clearable>
                                            <span style="float: left">{{ item.code }}</span>
                                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
                                        </el-option>
                                    </el-select>
                                </div>
                            </td>
                            <td>
                                <el-button size="mini" type="primary" @click="deleteSite(row,index)">删除</el-button>
                            </td>
                        </tr>
                    </template>
                </template>
                </tbody>
            </ui-table>
        </el-row>
        <site-edit v-model="siteVisible"
                   @ready-edit="changeInit"
                   :site-data="siteData"
                   :site-list="siteList"
        ></site-edit>
    </page>
</template>

<style lang="stylus">
    .c-logistics-deliver-channel {
        .local {
            .bg-alert {
                line-height: 30px;
                color: red;
                font-weight: bold;
            }
            .ui-table-body {
                .template.secTable {
                    table-layout: fixed;
                    td {
                        .right-log {
                            right: 130px
                        }
                        .local-hidden-id {
                            vertical-align: middle;
                            margin: 0 0;
                            display: inline-block;
                            width: 130px;
                            text-overflow: ellipsis;
                            word-break: keep-all;
                            white-space: nowrap;
                            overflow: hidden;
                        }
                        .local-hidden {
                            vertical-align: middle;
                            margin: 0 0;
                            display: inline-block;
                            width: 110px;
                            padding: 0 5px;
                            text-overflow: ellipsis;
                            word-break: keep-all;
                            white-space: nowrap;
                            overflow: hidden;
                        }
                        .local-hidden-xs {
                            vertical-align: middle;
                            margin: 0 0;
                            display: inline-block;
                            width: 73px;
                            padding: 0 5px;
                            text-overflow: ellipsis;
                            word-break: keep-all;
                            white-space: nowrap;
                            overflow: hidden;
                        }
                    }
                }
            }
        }
    }
</style>

<script>
    import {api_get_currency} from "@/api/shipment";
    import {api_account_list} from "@/api/setLogistics"

    export default {
        data() {
            return {
                currencyList: [],//币种下拉数据
                tipTitle: '点击可查看 站点 , 价格区间 , 操作',//图标hover内容
                checkAll: false,//全选的状态
                siteVisible: false,//弹窗状态
                curChannel: '',//当前选择添加站点的平台
                siteData: {},//弹窗数据
                siteList: [],//站点数据
            }
        },
        mounted() {
            this.get_currency_list();
            this.channelData.channels.groupNum = 2
        },
        methods: {

            //全选按钮
            change_all(val) {
                let data = [];
                this.channelData.channels.forEach(row => {
                    row.enabled = val;
                    data.push(row)
                })
            },
            //    每一列单选
            change(row) {
                if (this.channelData.channels.length > 0) {
                    let notCheckAll = !this.channelData.channels.find(row => !row.enabled);
                    this.checkAll = notCheckAll;
                }
                row.use_site = 0;
            },
            //    获取币种的数据
            get_currency_list() {
                this.$http(api_get_currency).then(res => {
                    this.currencyList = res;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            //是否出现下拉内容
            show(index, row) {
                row.siteShow = !row.siteShow;
            },
            //添加站点弹窗
            change_add_site(row) {
                this.$http(api_account_list, {channel_id: row.channel_id}).then(res => {
                    this.siteList = res.site.map(row => {
                        return {
                            enabled: false,
                            min: '',
                            max: '',
                            currency: '',
                            site_code: row.value,
                        };
                    });
                    row.content.forEach(item => {
                        let site = this.siteList.find(siteItem => siteItem.site_code === item.site_code);
                        if (site) {
                            Object.assign(site, item);
                        }
                    });
                    // this.siteData = clone(row);
                    this.siteVisible = true;
                    this.curChannel = row;
                    /*this.siteList.forEach(siteItem => {
                        row.content.forEach(item=>{
                            if (item.site_code===siteItem.value){
                                this.$set(siteItem,"enabled",item.enabled);
                                this.$set(siteItem,"min",item.min);
                                this.$set(siteItem,"max",item.max);
                                this.$set(siteItem,"currency",item.currency);
                            }
                        })
                    });*/
                });
                // this.siteData = clone(row);
                // this.siteVisible = true;
            },
            //抛出事件
            changeInit(value) {
                this.$set(this.curChannel, 'content', value);
                /*this.channelData.channels.forEach(item => {
                    if (item.channel_id === value.channel_id) {
                        this.$set(item, 'content', value.content);
                    }
                })*/
            },
            //    删除事件
            deleteSite(row, index) {
                row.content.splice(index, 1);
                /*for (let dele = 0; dele < row.content.length; dele++) {
                    if (row.content[dele].site_code === item.site_code) {
                        row.content[dele].enabled = false;
                        row.content.splice(dele, 1);
                    }
                }*/
            },
            //    单选框
            change_use_site(row) {
                if (row.use_site === 0) {
                    row.content.splice(0, row.content.length, {min: '', max: '', site_code: '', currency: ''})
                } else {
                    this.$set(row, 'content', []);
                }
            },
        },
        computed: {},
        watch: {},
        props: {
            channelData: {},
            editable: {}
        },
        components: {
            labelItem: require('@/components/label-item.vue').default,
            integerInput: require('@/components/integer-input.vue').default,
            uiTable: require('@/components/ui-table.vue').default,
            plusMinus: require('@/components/plus-minus.vue').default,
            siteEdit: require('./site-edit.vue').default,
        }
    }
</script>
