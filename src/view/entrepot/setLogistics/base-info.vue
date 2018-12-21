<template>
    <page class="p-base-info">
        <el-form ref="form1" :model="baseData" label-width="180px">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="名称：">
                        <ui-input v-model="baseData.shortname" :edit="editable"></ui-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="物流商：">
                        <span>{{baseData.carrier}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="接收方指定代码：">
                        <span>{{baseData.code}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="抓取上网开始时间：">
                        <integer-input v-model="baseData.online_start" :min="1" :disabled="!editable"
                                       class="inline"></integer-input>&nbsp;&nbsp;天
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="抓取上网结束时间：">
                        <integer-input v-model="baseData.online_end" :min="1" :disabled="!editable"
                                       class="inline"></integer-input>&nbsp;&nbsp;天
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="上网标志：">
                        <integer-input v-model="baseData.online_record_number" :disabled="!editable" :min="1"
                                       class="inline"></integer-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="妥投标志：">
                        <span>{{baseData.delivered_mark | filterNumber}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="妥投截止时间：">
                        <integer-input v-model="baseData.delivered_end" :min="1" :disabled="!editable"
                                       class="inline"></integer-input>&nbsp;&nbsp;天
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="是否允许导入更新跟踪号：">
                        <el-radio-group v-model="baseData.is_update_tracking_number">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="跟踪号：">
                <span style="color:#008BCE">{{baseData.has_tracking_number}}跟踪号</span>
                <span style="margin-left:30px;display:inline-block;"> 获取跟踪方式：
                    <span style="color:#008BCE">{{baseData.access_tracking_number_method}}
                    </span>
                </span>
            </el-form-item>
            <el-form-item label="同步发货状态时提交的信息：">
                <table class="template">
                    <template v-for="item in baseData.channels">
                        <tr>
                            <td>{{item.code}}</td>
                            <td v-for="(col,col_i) in cols" style="padding: 3px " :key="col_i">
                                <span v-if="item.info[col-1]">{{item.info[col-1].name}}：</span>
                                <div v-if="item.info[col-1]&&item.info[col-1].type==='select'" class="inline width-lg">
                                    <el-select v-model="item.info[col-1].value" filterable clearable
                                               :disabled="!editable">
                                        <el-option v-for="(carray,index) in  item.info[col-1].selects" :key="index"
                                                   :label="carray.name" :value="carray.code"></el-option>
                                    </el-select>
                                </div>
                                <ui-input v-model="item.info[col-1].value"
                                          v-if="item.info[col-1]&&item.info[col-1].type==='input'" :edit="editable"
                                          @change="channel_change(item, col)"
                                          class="inline width-lg"></ui-input>
                            </td>
                        </tr>
                    </template>
                </table>
            </el-form-item>

            <el-form-item label="备注：">
                <el-input v-model="baseData.remark" :disabled="!editable" type="textarea" :rows="2"
                          placeholder="请输入内容"></el-input>
            </el-form-item>

            <el-form-item label="打印方式：">
                <div>
                    <el-radio class="radio" v-model="baseData.printed_online" :label="1" :disabled="!editable">在线打印
                    </el-radio>
                    <el-radio class="radio" v-model="baseData.printed_online" :label="0" :disabled="!editable">线外打印
                    </el-radio>
                </div>
            </el-form-item>
            <el-form-item label="是否需要退货：">
                <div>
                    <el-radio class="radio" v-model="baseData.is_need_return" :disabled="!editable" :label="1">是
                    </el-radio>
                    <el-radio class="radio" v-model="baseData.is_need_return" :disabled="!editable" :label="0">否
                    </el-radio>
                </div>
            </el-form-item>
            <el-form-item label="是否平台物流：">
                <div>
                    <el-radio class="radio" v-model="baseData.is_platform_shipping" :disabled="!editable" :label="1">是
                    </el-radio>
                    <el-radio class="radio" v-model="baseData.is_platform_shipping" :disabled="!editable" :label="0">否
                    </el-radio>
                </div>
            </el-form-item>

            <el-form-item label="获取跟踪号的时机：">
                <el-radio-group v-model="baseData.get_tracking_number_time">
                    <el-radio class="radio" :disabled="!editable" :label="1">下单后
                    </el-radio>
                    <el-radio class="radio" :disabled="!editable" :label="2">交运后
                    </el-radio>
                    <el-radio class="radio" :disabled="!editable" :label="3">发货后
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="可用于仓库：">
                <el-checkbox v-model="items.enabled" :disabled="!editable" v-for="items in baseData.warehouses"
                             :key="items.name">{{items.name}}
                </el-checkbox>
            </el-form-item>
            <el-form-item label="地址最大长度：">
                <el-row>
                    <el-col :span="curSpan">
                        <ui-input type="Number" v-model="baseData.address_max_length" :edit="editable"></ui-input>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="物流揽收模式：">
                <el-row>
                    <el-col :span="curSpan">
                        <el-select v-model="baseData.delivery_mode" placeholder="请选择" class="s-width-large"
                                   :disabled="!editable">
                            <el-option
                                    v-for="item in delivery_modes"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="揽收商：">
                <el-row>
                    <el-col :span="curSpan">
                        <el-select v-model="baseData.collector_id" placeholder="请选择" class="s-width-large"
                                   :disabled="!editable">
                            <el-option
                                    v-for="item in collectorList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="状态：">
                        <span>{{baseData.status === 0 ? '停用': '启用'}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="baseData.status === 0">
                    <el-form-item label="停用时间：">
                        <span>{{baseData.stop_pickup_time | timeFilter}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <card label="">
            <div class="mb-xs" style="margin-left: 69px;">
                <span>附加信息：</span>
                <el-checkbox-group v-model="baseData.is_sender_address" class="inline">
                    <el-checkbox label="寄件人信息" :disabled="!editable"></el-checkbox>
                </el-checkbox-group>
            </div>
            <el-form :model="baseData" :rules="rules" ref="form2" label-width="150px"
                     v-show="baseData.is_sender_address" class="form1" style="margin-left:50px;">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="name：" prop="sender_name" required>
                            <ui-input v-model="baseData.sender_name" class="inline" :edit="editable"></ui-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="Company：" prop="sender_company" required>
                            <ui-input v-model="baseData.sender_company" class="inline" :edit="editable"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="Country：" prop="sender_country" required>
                            <ui-input v-model="baseData.sender_country" class="inline" :edit="editable"></ui-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="State：" prop="sender_state" required>
                            <ui-input v-model="baseData.sender_state" class="inline" :edit="editable"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="City：" prop="sender_city" required>
                            <ui-input v-model="baseData.sender_city" class="inline" :edit="editable"></ui-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="Distric：" prop="sender_district" required>
                            <ui-input v-model="baseData.sender_district" class="inline" :edit="editable"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item label="Street：" prop="sender_street" required>
                        <ui-input v-model="baseData.sender_street"
                                  style="width:60%" :edit="editable"></ui-input>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="Zip Code：" prop="sender_zipcode" required>
                            <ui-input v-model="baseData.sender_zipcode" class="inline" :edit="editable"></ui-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="Mobile：" prop="sender_mobile" required>
                            <ui-input v-model="baseData.sender_mobile" type="Number" class="inline"
                                      :edit="editable"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="Phone：" prop="sender_phone" required>
                            <ui-input v-model="baseData.sender_phone" type="Number" class="inline"
                                      :edit="editable"></ui-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="Email：" prop="sender_email" required>
                            <ui-input v-model="baseData.sender_email" class="inline" :edit="editable"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </card>
        <card label="">
            <div class="mb-xs" style="margin-left: 69px;">
                <label class="c-red">{{baseData.delivery_mode|methFilter}}：</label>
                <el-checkbox-group v-model="baseData.is_pickup_address" class="inline">
                    <el-checkbox label="揽收人信息" :disabled="!editable"></el-checkbox>
                </el-checkbox-group>

            </div>
            <el-form :model="baseData" :rules="rules" ref="form3" label-width="150px"
                     v-show="baseData.is_pickup_address" class="form1">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="揽收人名称：" prop="pickup_name" required>
                            <ui-input v-model="baseData.pickup_name" class="inline" :edit="editable"></ui-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="揽收人公司：" prop="pickup_company" required>
                            <ui-input v-model="baseData.pickup_company" class="inline" :edit="editable"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="揽收人国家：" prop="pickup_country" required>
                            <ui-input v-model="baseData.pickup_country" class="inline" :edit="editable"></ui-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="揽收人省/州：" prop="pickup_state" required>
                            <ui-input v-model="baseData.pickup_state" class="inline" :edit="editable"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="揽收人城市：" prop="pickup_city" required>
                            <ui-input v-model="baseData.pickup_city" class="inline" :edit="editable"></ui-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="揽收人行政区：" prop="pickup_district" required>
                            <ui-input v-model="baseData.pickup_district" class="inline" :edit="editable"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="揽收人街道：" prop="pickup_street" required>
                            <ui-input v-model="baseData.pickup_street" class="inline" :edit="editable"></ui-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="揽收人邮箱：" prop="pickup_email" required>
                            <ui-input v-model="baseData.pickup_email" class="inline" :edit="editable"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="揽收人邮编：" prop="pickup_zip_code" required>
                            <ui-input v-model="baseData.pickup_zip_code" class="inline" :edit="editable"
                                      type="number"></ui-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="揽收人电话：" prop="pickup_mobile" required>
                            <ui-input v-model="baseData.pickup_mobile" class="inline" :edit="editable"
                                      type="number"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </card>
        <card label="">
            <div class="mb-xs" style="margin-left: 69px;">
                <span>退货信息：</span>
                <el-checkbox-group v-model="baseData.is_return_address" class="inline">
                    <el-checkbox label="退货人信息" :disabled="!editable"></el-checkbox>
                </el-checkbox-group>
            </div>
            <el-form :model="baseData" :rules="rules" ref="form4" label-width="150px" class="form1"
                     v-show="baseData.is_return_address">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="退货联系人名称：" prop="return_name" required>
                            <ui-input v-model="baseData.return_name" class="inline" :edit="editable"></ui-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="退货联系人公司：" prop="return_company" required>
                            <ui-input v-model="baseData.return_company" class="inline" :edit="editable"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="退货联系人国家：" prop="return_country" required>
                            <ui-input v-model="baseData.return_country" class="inline" :edit="editable"></ui-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="退货联系人省/州：" prop="return_province" required>
                            <ui-input v-model="baseData.return_province" class="inline" :edit="editable"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="退货联系人城市：" prop="return_city" required>
                            <ui-input v-model="baseData.return_city" class="inline" :edit="editable"></ui-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="退货联系人区：" prop="return_district" required>
                            <ui-input v-model="baseData.return_district" class="inline" :edit="editable"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="退货联系人街道：" prop="return_street" required>
                            <ui-input v-model="baseData.return_street" class="inline" :edit="editable"></ui-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="退货联系人邮箱：" prop="return_email" required>
                            <ui-input v-model="baseData.return_email" class="inline" :edit="editable"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="退货联系人邮编：" prop="return_postcode" required>
                            <ui-input v-model="baseData.return_postcode" class="inline" :edit="editable"
                                      type="number"></ui-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="退货联系人手机：" prop="return_mobile" required>
                            <ui-input v-model="baseData.return_mobile" class="inline" :edit="editable"
                                      type="number"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </card>
    </page>
</template>
<style lang="stylus">
    .p-base-info {
        padding: 5px 35px 5px 0;
        .form1 {
            .el-row {
                margin-bottom: 8px;
            }
        }
        .account {
            display: inline-block;
            width: 80px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: right;
        }
    }
</style>
<script>
    import {chinese} from '@/define/validator_reg';
    import {api_collector_list} from "@/api/collector";

    export default {
        data() {
            let checkChinese = (rule, value, callback) => {
                if (value) {
                    return chinese.test(value) ? callback(new Error("不允许出现中文！")) : callback();
                } else {
                    callback();
                }
            };
            return {
                curSpan: 5,
                declaredInfoList: [{label: "需要", value: 1}, {label: "不需要", value: 0}],
                labelUsedNumber: [{label: "跟踪号", value: 1}, {label: "物流商单号", value: 2}],
                labelUsedType: [{label: "自制模板", value: 1}, {label: "物流商API接口获取", value: 2}],
                depots: [
                    {label: "全部自营仓库"},
                    {label: "东莞仓"},
                    {label: "欧洲FBA仓"},
                    {label: "美国加拿大FBA仓"},
                    {label: "德国FBA仓"},
                    {label: "金华仓"},
                    {label: "谷仓美东仓"},
                    {label: "谷仓英国仓"},
                ],
                delivery_modes: [
                    {label: '上门揽收', value: 0},
                    {label: '卖家自送', value: 1},
                    {label: '中邮揽收', value: 2},
                ],
                rules: {
                    return_name: [{required: true, message: '请输入退货人姓名', trigger: 'blur'},],
                    return_company: [{required: true, message: '请输入退货人公司', trigger: 'blur'},],
                    return_country: [{required: true, message: '请输入退货人国家', trigger: 'blur'},],
                    return_province: [{required: true, message: '请输入退货人省/州', trigger: 'blur'},],
                    return_city: [{required: true, message: '请输入退货人城市', trigger: 'blur'},],
                    return_district: [{required: true, message: '请输入退货人区', trigger: 'blur'},],
                    return_street: [{required: true, message: '请输入退货人街道', trigger: 'blur'},],
                    return_postcode: [{required: true, message: '请输入退货人邮编', trigger: 'blur'},
                        {validator: checkChinese, trigger: 'blur'}
                    ],
                    return_mobile: [{required: true, message: '请输入退货人手机', trigger: 'blur'},
                    ],
                    return_email: [{required: true, message: '请输入退货人邮箱', trigger: 'blur'},
                        {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change'}],
                    pickup_name: [{required: true, message: '请输入揽件人姓名', trigger: 'blur'},],
                    pickup_company: [{required: true, message: '请输入揽件人公司', trigger: 'blur'},],
                    pickup_country: [{required: true, message: '请输入揽件人国家', trigger: 'blur'},],
                    pickup_state: [{required: true, message: '请输入揽件人省/州', trigger: 'blur'},],
                    pickup_city: [{required: true, message: '请输入揽件人城市', trigger: 'blur'},],
                    pickup_district: [{required: true, message: '请输入揽件人区', trigger: 'blur'},],
                    pickup_street: [{required: true, message: '请输入揽件人街道', trigger: 'blur'},],
                    pickup_zip_code: [
                        {required: true, message: '请输入揽件人邮编', trigger: 'blur'}],
                    pickup_mobile: [
                        {required: true, message: '请输入揽件人电话', trigger: 'blur'},
                    ],
                    pickup_email: [{required: true, message: '请输入揽件人邮箱', trigger: 'blur'},
                        {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change'}],
                    sender_name: [{required: true, message: '请输入寄件人姓名', trigger: 'blur'},],
                    sender_company: [{required: true, message: '请输入寄件人公司', trigger: 'blur'},],
                    sender_country: [{required: true, message: '请输入寄件人国家', trigger: 'blur'},],
                    sender_state: [{required: true, message: '请输入寄件人省/州', trigger: 'blur'},],
                    sender_city: [{required: true, message: '请输入寄件人城市', trigger: 'blur'},],
                    sender_district: [{required: true, message: '请输入寄件人区', trigger: 'blur'},],
                    sender_street: [{required: true, message: '请输入寄件人街道', trigger: 'blur'},],
                    sender_zipcode: [{required: true, message: '请输入寄件人邮编', trigger: 'blur'},
                        {validator: checkChinese, trigger: 'blur'}
                    ],
                    sender_mobile: [{required: true, message: '请输入寄件人手机', trigger: 'blur'},
                    ],
                    sender_phone: [{required: true, message: '请输入寄件人电话', trigger: 'blur'},
                    ],
                    sender_email: [{required: true, message: '请输入寄件人邮箱', trigger: 'blur'},
                        {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change'}],
                },
                collectorList: [],
            }
        },
        mounted() {
            this.get_collector_list();
        },
        methods: {
            get_collector_list() {
                this.$http(api_collector_list).then(res => {
                    this.collectorList = res.map(row => {
                        return {
                            value: row.id,
                            label: row.name,
                        };
                    });
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                })
            },
            get_name(item) {
                if (!item || !item.selects) {
                    return ""
                }
                let find = item.selects.find(row => {
                    return item.value === row.code
                });
                if (!!find) {
                    return find.code
                } else {
                    return ""
                }
            },
            submit() {
                let flag = [true, true, true, true];
                this.$refs.form1.validate((valid) => {
                    if (valid) {
                        flag[0] = true
                    } else {
                        return false
                    }
                });
                if (this.baseData.is_sender_address) {
                    this.$refs.form2.validate((valid) => {
                        if (valid) {
                            flag[1] = true
                        } else {
                            flag[1] = false
                        }
                    });
                }
                if (this.baseData.is_pickup_address) {
                    this.$refs.form3.validate((valid) => {
                        if (valid) {
                            flag[2] = true
                        } else {
                            flag[2] = false
                        }
                    });
                }
                if (this.baseData.is_return_address) {
                    this.$refs.form4.validate((valid) => {
                        if (valid) {
                            flag[3] = true
                        } else {
                            flag[3] = false
                        }
                    });
                }
                return flag
            },
            channel_change(item, col) {
                if (typeof item.info[col - 1].value === 'string') {
                    item.info[col - 1].value = item.info[col - 1].value.trim();
                }
            }
        },
        filters: {
            methFilter(val) {
                if (val) {
                    return "卖家自送"
                }
                return "上门揽货"
            },
            filterNumber(val) {
                if (val === 0) {
                    return '';
                } else {
                    return val;
                }
            },
            timeFilter(val) {
                return datef('YYYY-MM-dd HH:mm:ss', val);
            }
        },
        computed: {
            cols() {
                let col = 0;
                this.baseData.channels.forEach(row => {
                    let length = row.info.length;
                    if (length > col) {
                        col = length
                    }
                });
                return col;
            },
            comSpan() {
                return 24 - this.curSpan;
            },
        },
        props: {
            baseData: {},
            editable: {
                required: true,
                type: Boolean
            },
            shippingMethod: {
                type: Array
            }
        },
        components: {
            card: require('@/components/card.vue').default,
            uiInput: require('@/components/ui-input.vue').default,
            selectText: require("@/components/select-text.vue").default,
            uiLimitNumber: require('@/components/ui-limit-number.vue').default,
            integerInput: require('@/components/integer-input.vue').default,
        }
    }
</script>
