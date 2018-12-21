<template>
    <page class="p-effective" v-loading="loading">
        <label class="inline ml-sm">可发货平台：</label>
        <el-checkbox v-model="items.enabled"
                     class="inline mb-xs"
                     :disabled="!editable" v-for="items in effData.channels"
                     :key="items.id">{{items.title}}
        </el-checkbox>
        <div v-if="editable" class="shipping-copy mb-sm ml-sm">
            <label-item label="运输方式：" :label-width="80">
                <el-cascader
                        clearable
                        filterable
                        placeholder="请选择/输入运输方式"
                        class="inline shipping-width"
                        v-model="shipping"
                        expand-trigger="hover"
                        :options="shippingList"
                ></el-cascader>
            </label-item>
            <request-button req-key="copyShipping" type="primary" @click.native="copy_shipping" size="mini"
                            class="inline ml-sm">复制物流报价信息
            </request-button>
        </div>
        <el-card>
            <el-form ref="form1" :model="effData" label-width="180px">
                <el-form-item label="按时效分类：">
                    <span>{{effData.period}}</span>
                    <el-select v-model="effData.period_type"
                               ref="period"
                               v-mouse-side.mousewheel="()=>{$refs.period.visible=false}"
                               placeholder="请选择"
                               class="inline width-lg"
                               :disabled="!editable">
                        <el-option
                                v-for="(item,item_i) in classifys"
                                :key="`${item.value}-${item_i}`"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="过期天数：">
                    <div style="height:30px">
                        <el-input-number v-model="effData.effective_days" :min="0" size="small"
                                         :disabled="!editable"></el-input-number>
                        <span class="c-red">(0代表永不过期)</span>
                    </div>
                </el-form-item>
                <el-form-item label="适用于物流属性：">
                    <el-checkbox v-model="it.enabled" v-if="editable"
                                 v-for="it in effData.allow_properties" :key="it.name">{{it.name}}
                    </el-checkbox>
                    <el-tag type="success" v-if="!editable&&it.enabled" class="ml-xs"
                            v-for="it in effData.allow_properties" :key="it.name">{{it.name}}
                    </el-tag>
                </el-form-item>
                <el-form-item label="禁用物流属性：">
                    <el-checkbox v-model="it.enabled" v-if="editable"
                                 v-for="it in effData.deny_properties" :key="it.name">{{it.name}}
                    </el-checkbox>
                    <el-tag type="success" v-if="!editable&&it.enabled" class="ml-xs"
                            v-for="it in effData.deny_properties" :key="it.name">{{it.name}}
                    </el-tag>
                </el-form-item>
            </el-form>
        </el-card>
        <el-form ref="form2" :model="effData" label-width="80px" class="mt-sm">
            <el-row>
                <el-col :span="18">
                    <el-form-item label="运费折扣：">
                        <el-input v-model="effData.shipping_fee_discount"
                                  @blur="ship_discount" :step="0.1"
                                  class="inline width-xs" :min="0" :max="2"
                                  :disabled="!editable" type="number">
                        </el-input>
                        <span class="c-red">
                                (请注意，无折扣时请输入1,  8折时,请输入0.8)
                            </span>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="运费币种：">
                        <el-select v-model="effData.currency_code"
                                   ref="currency"
                                   v-mouse-side.mousewheel="()=>{$refs.currency.visible=false}"
                                   placeholder="请选择"
                                   class="width-md"
                                   :disabled="!editable">
                            <el-option
                                    :key="item.code"
                                    v-for="item in moneys"
                                    :label="item.name"
                                    :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-card>
            <el-row style="overflow-y: auto">
                <div class="mb-xs">
                    <span>邮寄方式配送范围及收费模型：</span>
                    <el-radio-group v-model="effData.arriveable_type" @change="change_type">
                        <el-radio class="radio"
                                  v-for="item in arriveableTypeList"
                                  :key="item.value"
                                  :label="item.value"
                                  :disabled="!editable">
                            {{item.label}}
                        </el-radio>
                    </el-radio-group>
                </div>
                <div style="padding-bottom: 5px;" v-if="effData.arriveable_type!==0">
                    <label style="width:84px;">Excel导入：</label>
                    <el-button type="primary" size="mini" :disabled="!editable" @click="excelVisible=true">
                        选择上传的Excel表格
                    </el-button>
                    <el-button type="primary" size="mini" @click="download_file">
                        {{file_url}}
                    </el-button>
                </div>
                <!--全球可达(相同运费)-->
                <div v-if="effData.arriveable_type===0"
                     class="mb-xs" v-for="(item,index) in effData.details_0"
                     :key="`${index}+0+${item}`">
                    <rainbow-header title="全球可达(相同费用)" background-color="#EB5405">
                        <span class="custom-label">运费计算公式：</span>
                        <el-checkbox v-model="item.is_registered_fee"
                                     :disabled="!editable" class="inline">挂号费
                        </el-checkbox>
                        <el-checkbox v-model="item.is_volumn_weight"
                                     :disabled="!editable" class="inline">计算材积
                        </el-checkbox>
                        <el-checkbox v-model="item.is_oli_additional"
                                     :disabled="!editable" class="inline">附加费
                        </el-checkbox>
                        <el-checkbox v-model="item.is_stage_fee"
                                     :disabled="!editable" class="inline">分段收费
                        </el-checkbox>
                        <el-form :model="item" label-width="90px">
                            <el-form-item label="可达天数：">
                                <span>最快</span>
                                <el-input v-model="item.earliest_days"
                                          class="inline input-width"
                                          :disabled="!editable"
                                          @blur="change_earliest(item,index)"
                                >
                                </el-input>
                                <span>天</span>
                                <span>最慢</span>
                                <el-input v-model="item.latest_days"
                                          class="inline input-width"
                                          :disabled="!editable"
                                          @blur="chang_latest(item,index)"
                                >
                                </el-input>
                                <span>天</span>
                            </el-form-item>
                            <el-form-item label="最小限重：">
                                <integer-input v-model="curDetail2.min_weight"
                                               :min="1"
                                               @blur="min_weight_change"
                                               class="inline input-width"
                                               :disabled="!editable">
                                </integer-input>
                                g
                            </el-form-item>
                            <el-form-item label="最大限重：">
                                <integer-input v-model="item.max_weight"
                                               :min="1"
                                               @blur="max_weight_change"
                                               class="inline s-width-default"
                                               :disabled="!editable">
                                </integer-input>
                                g
                                <span class="c-red">
                                         （0代表不限重）   同买家的多个订单合并包裹时总重量超过该值将会生成多个包裹
                                    </span>
                            </el-form-item>
                            <el-form-item label="挂号费：" v-if="item.is_registered_fee">
                                <el-input v-model="item.registered_fee"
                                          @blur="change_fee(item,'registered_fee')"
                                          :disabled="!editable" class="inline input-width">
                                </el-input>
                                <span>元</span>
                            </el-form-item>
                            <el-form-item label="材积：" v-if="item.is_volumn_weight">
                                <span>材积(kg)=长(cm)*宽(cm)*高(cm)÷</span>
                                <el-input v-model="item.volumn_weight"
                                          @blur="change_fee(item,'volumn_weight')"
                                          :disabled="!editable" class="inline input-width">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="附加费率：" v-if="item.is_oli_additional">
                                <el-input v-model="item.oli_additional_fee"
                                          @blur="change_fee(item,'oli_additional_fee')"
                                          :disabled="!editable" class="inline input-width">
                                </el-input>
                                <span>%</span>
                            </el-form-item>
                            <el-form-item label="首重：" v-if="!item.is_stage_fee">
                                <span>每</span>
                                <integer-input v-model="item.first_weight"
                                               :min="1"
                                               :disabled="!editable"
                                               class="inline input-width">
                                </integer-input>
                                <span> g  收取</span>
                                <el-input-number v-model="item.first_fee"
                                                 :controls="false"
                                                 @blur="change_fee(item,'first_fee')"
                                                 :disabled="!editable"
                                                 class="inline input-width">
                                </el-input-number>
                                <span>元</span>
                            </el-form-item>

                            <el-form-item label="续重：" v-if="!item.is_stage_fee">
                                <span>每</span>
                                <integer-input v-model="item.additional_weight"
                                               :min="1"
                                               :disabled="!editable"
                                               class="inline input-width">
                                </integer-input>
                                <span> g  收取</span>
                                <el-input-number v-model="item.additional_fee"
                                                 :controls="false"
                                                 @blur="change_fee(item,'additional_fee')"
                                                 :disabled="!editable"
                                                 class="inline input-width">
                                </el-input-number>
                                <span>元</span>
                            </el-form-item>
                            <el-form-item label-width="10px" v-if="item.is_stage_fee">
                                <table>
                                    <tr v-for="(sub,i) in item.stages" :key="i">
                                        <td>分组{{i+1}}</td>
                                        <td>
                                            <integer-input v-model="sub.start_weight"
                                                           :min="0"
                                                           :disabled="!editable"
                                                           class="inline  s-width-default">
                                            </integer-input>
                                            <span>克＜重量≤</span>
                                            <integer-input v-model="sub.end_weight"
                                                           :min="1"
                                                           :disabled="!editable" class="inline s-width-default"
                                                           @blur="change_end(index,i)">
                                            </integer-input>
                                            <div class="inline">
                                                <el-select :disabled="!editable"
                                                           v-model="sub.stage_fee_type" placeholder="请选择"
                                                           class="sel-width inline">
                                                    <el-option
                                                            :key="item.value"
                                                            v-for="item in options"
                                                            :label="item.label"
                                                            :value="item.value">
                                                    </el-option>
                                                </el-select>
                                            </div>
                                            <div class="inline"
                                                 :disabled="!editable"
                                                 v-if="sub.stage_fee_type==='D'">
                                                <div>每
                                                    <integer-input v-model="sub.additional_weight"
                                                                   :min="1"
                                                                   class="inline input-width">
                                                    </integer-input>
                                                    克
                                                    <el-input v-model="sub.additional_fee"
                                                              @blur="change_fee(sub,'additional_fee')"
                                                              class="inline input-width">
                                                    </el-input>
                                                    元
                                                </div>
                                            </div>
                                            <div class="inline" v-if="sub.stage_fee_type==='A'">
                                                <div class="inline">首重
                                                    <integer-input v-model="sub.first_weight"
                                                                   :min="1"
                                                                   :disabled="!editable"
                                                                   class="inline input-width"
                                                                   @blur="change_first(index,i)">
                                                    </integer-input>
                                                    克
                                                    <el-input v-model="sub.first_fee"
                                                              :disabled="!editable"
                                                              @blur="change_fee(sub,'first_fee')"
                                                              class="inline input-width">
                                                    </el-input>
                                                    元
                                                </div>
                                                <div class="inline">续重每
                                                    <integer-input v-model="sub.additional_weight"
                                                                   :min="1"
                                                                   :disabled="!editable"
                                                                   class="inline input-width">
                                                    </integer-input>
                                                    克
                                                    <el-input v-model="sub.additional_fee"
                                                              @blur="change_fee(sub,'additional_fee')"
                                                              :disabled="!editable"
                                                              class="inline input-width">
                                                    </el-input>
                                                    元
                                                </div>
                                            </div>
                                            <div class="inline" v-if="sub.stage_fee_type==='F'">
                                                <div>
                                                    <el-input v-model="sub.fixed_fee"
                                                              @blur="change_fee(sub,'fixed_fee')"
                                                              :disabled="!editable"
                                                              class="inline input-width">
                                                    </el-input>
                                                    元
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span>处理费：</span>
                                            <el-input v-model="sub.handle_fee"
                                                      @blur="change_fee(sub,'handle_fee')"
                                                      :disabled="!editable"
                                                      class="inline"
                                                      style="width: 60px;">
                                            </el-input>
                                        </td>
                                        <td>
                                            <el-button type="danger" size="mini" :disabled="!editable"
                                                       @click="del_stage(index,i)">删除
                                            </el-button>
                                        </td>
                                    </tr>
                                </table>
                                <el-row>
                                    <el-button type="primary" :disabled="!editable" @click="add_stage(index)">添加分段
                                    </el-button>
                                    <el-button type="primary" :disabled="!editable" @click="clear_stage(index)">
                                        清空分段
                                    </el-button>
                                    <el-button type="primary" :disabled="!editable" @click="batch_add_stage(index)">
                                        excel复制导入
                                    </el-button>
                                    <el-button type="primary" :disabled="!editable" @click="download">excel模板下载
                                    </el-button>
                                </el-row>
                                <el-row v-if="!!item.batchAdd" class="mt-sm" :gutter="20">
                                    <el-col :span="18">
                                        <el-input
                                                :disabled="!editable"
                                                type="textarea"
                                                :autosize="{ minRows: 8}"
                                                placeholder="请输入内容"
                                                v-model="textarea">
                                        </el-input>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-button type="primary" :disabled="!editable" @click="batch_stage(index)">
                                            导入
                                        </el-button>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                        </el-form>
                    </rainbow-header>
                </div>
                <tabs class="relative">
                    <tab-head v-if="navsList&&navsList.length>0"
                              :navs="navsList" @click-nav="click_nav"
                              @delete-curnav='delete_curnav($event)'
                              :is-fixed="false"
                              :needShowAll="false" :show-close="showClose">
                        <!--全球可达(不同运费)-->
                        <div v-if="effData.arriveable_type===1">
                            <rainbow-header v-if='navsList[curIndex]'
                                            :title="navsList[curIndex].label"
                                            :key='effData.arriveable_type' background-color="#ABCD05">
                                <el-card v-if="curIndex!==0">
                                    <el-row>
                                        <span> 到达目的国家列表</span>
                                        <el-button type="primary" size="mini" :disabled="!editable"
                                                   @click="add_country">
                                            编辑
                                        </el-button>
                                    </el-row>
                                    <el-row>
                                        <span v-for="(country,i) in curDetail2.locations "
                                              :key="`${country.country_cn_name}+${i}`">
                                            {{country.country_cn_name}}
                                        </span>
                                    </el-row>
                                </el-card>
                                <el-card>
                                    <el-form :model="curDetail2" label-width="164px">
                                        <el-form-item label="适用于物流属性：" v-if="show_properties(curDetail2)">
                                            <el-checkbox v-model="it.enabled" v-if="editable"
                                                         v-for="it in curDetail2.allow_properties" :key="it.name">
                                                {{it.name}}
                                            </el-checkbox>
                                            <el-tag type="success" v-if="!editable&&it.enabled" class="ml-xs"
                                                    v-for="it in curDetail2.allow_properties" :key="it.name">{{it.name}}
                                            </el-tag>
                                        </el-form-item>
                                        <el-form-item label="禁用物流属性：" v-if="showdeny(curDetail2)">
                                            <el-checkbox v-model="it.enabled" v-if="editable"
                                                         v-for="it in curDetail2.deny_properties" :key="it.name">
                                                {{it.name}}
                                            </el-checkbox>
                                            <el-tag type="success" v-if="!editable&&it.enabled" class="ml-xs"
                                                    v-for="it in curDetail2.allow_properties" :key="it.name">{{it.name}}
                                            </el-tag>
                                        </el-form-item>
                                    </el-form>
                                    <el-row>
                                        <span class="custom-label">运费计算公式：</span>
                                        <el-checkbox v-model="curDetail2.is_registered_fee"
                                                     :disabled="!editable" class="inline">挂号费
                                        </el-checkbox>
                                        <el-checkbox v-model="curDetail2.is_volumn_weight"
                                                     :disabled="!editable" class="inline">计算材积
                                        </el-checkbox>
                                        <el-checkbox v-model="curDetail2.is_oli_additional"
                                                     :disabled="!editable" class="inline">附加费
                                        </el-checkbox>
                                        <el-checkbox v-model="curDetail2.is_stage_fee"
                                                     :disabled="!editable" class="inline">分段收费
                                        </el-checkbox>

                                        <el-form :model="curDetail2" label-width="90px">
                                            <el-form-item label="可达天数：">
                                                <span>最快</span>
                                                <el-input v-model="curDetail2.earliest_days"
                                                          class="inline input-width"
                                                          :disabled="!editable"
                                                          @blur="change_earliest(curDetail2)"
                                                >
                                                </el-input>
                                                <span>天</span>
                                                <span>最慢</span>
                                                <el-input v-model="curDetail2.latest_days"
                                                          class="inline input-width"
                                                          :disabled="!editable"
                                                          @blur="chang_latest(curDetail2)"
                                                >
                                                </el-input>
                                                <span>天</span>
                                            </el-form-item>
                                            <el-form-item label="最小限重：">
                                                <integer-input v-model="curDetail2.min_weight"
                                                               :min="1"
                                                               @blur="min_weight_change"
                                                               class="inline input-width"
                                                               :disabled="!editable">
                                                </integer-input>
                                                g
                                            </el-form-item>
                                            <el-form-item label="最大限重：">
                                                <integer-input v-model="curDetail2.max_weight"
                                                               :min="1"
                                                               @blur="max_weight_change"
                                                               class="inline s-width-default"
                                                               :disabled="!editable">
                                                </integer-input>
                                                g
                                                <span class="c-red">
                                                     （0代表不限重）   同买家的多个订单合并包裹时总重量超过该值将会生成多个包裹
                                                </span>
                                            </el-form-item>
                                            <el-form-item label="挂号费：" v-if="curDetail2.is_registered_fee">
                                                <el-input v-model="curDetail2.registered_fee"
                                                          @blur="change_fee(curDetail2, 'registered_fee')"
                                                          :disabled="!editable" class="inline input-width">
                                                </el-input>
                                                <span>元</span>
                                            </el-form-item>
                                            <el-form-item label="材积：" v-if="curDetail2.is_volumn_weight">
                                                <span>材积(kg)=长(cm)*宽(cm)*高(cm)÷</span>
                                                <integer-input v-model="curDetail2.volumn_weight"
                                                               :min="1"
                                                               :disabled="!editable" class="inline input-width">
                                                </integer-input>
                                            </el-form-item>
                                            <el-form-item label="附加费率：" v-if="curDetail2.is_oli_additional">
                                                <el-input v-model="curDetail2.oli_additional_fee"
                                                          @blur="change_fee(curDetail2, 'oli_additional_fee')"
                                                          :disabled="!editable" class="inline input-width">
                                                </el-input>
                                                <span>%</span>
                                            </el-form-item>
                                            <el-form-item label="首重：" v-if="!curDetail2.is_stage_fee">
                                                <span>每</span>
                                                <integer-input v-model="curDetail2.first_weight"
                                                               :min="1"
                                                               :disabled="!editable" class="inline input-width">
                                                </integer-input>
                                                <span> g  收取</span>
                                                <el-input v-model="curDetail2.first_fee"
                                                          @blur="change_fee(curDetail2, 'first_fee')"
                                                          :disabled="!editable" class="inline input-width">
                                                </el-input>
                                                <span>元</span>
                                            </el-form-item>
                                            <el-form-item label="续重：" v-if="!curDetail2.is_stage_fee">
                                                <span>每</span>
                                                <integer-input v-model="curDetail2.additional_weight"
                                                               :min="1"
                                                               :disabled="!editable" class="inline input-width">
                                                </integer-input>
                                                <span> g  收取</span>
                                                <el-input v-model="curDetail2.additional_fee"
                                                          @blur="change_fee(curDetail2, 'additional_fee')"
                                                          :disabled="!editable" class="inline input-width">
                                                </el-input>
                                                <span>元</span>
                                            </el-form-item>
                                            <el-form-item label-width="10px" v-if="curDetail2.is_stage_fee">
                                                <table>
                                                    <tr v-for="(sub,i) in curDetail2.stages" :key="i">
                                                        <td>分组{{i+1}}</td>
                                                        <td>
                                                            <integer-input v-model="sub.start_weight"
                                                                           :min="0"
                                                                           :disabled="!editable"
                                                                           class="inline s-width-default">
                                                            </integer-input>
                                                            <span>克＜重量≤</span>
                                                            <integer-input v-model="sub.end_weight"
                                                                           :min="1"
                                                                           :disabled="!editable"
                                                                           class="inline s-width-default"
                                                                           @blur="change_end(i)">
                                                            </integer-input>
                                                            <div class="inline">
                                                                <el-select :disabled="!editable"
                                                                           v-model="sub.stage_fee_type"
                                                                           placeholder="请选择"
                                                                           class="sel-width inline">
                                                                    <el-option
                                                                            v-for="item in options"
                                                                            :key="item.value"
                                                                            :label="item.label"
                                                                            :value="item.value">
                                                                    </el-option>
                                                                </el-select>
                                                            </div>
                                                            <div class="inline"
                                                                 :disabled="!editable"
                                                                 v-if="sub.stage_fee_type==='D'">
                                                                <div>每
                                                                    <integer-input v-model="sub.additional_weight"
                                                                                   :min="1"
                                                                                   class="inline input-width">
                                                                    </integer-input>
                                                                    克
                                                                    <el-input v-model="sub.additional_fee"
                                                                              @blur="change_fee(sub, 'additional_fee')"
                                                                              class="inline input-width">
                                                                    </el-input>
                                                                    元
                                                                </div>
                                                            </div>
                                                            <div class="inline" v-if="sub.stage_fee_type==='A'">
                                                                <div class="inline">首重
                                                                    <integer-input v-model="sub.first_weight"
                                                                                   :min="1"
                                                                                   :disabled="!editable"
                                                                                   class="inline input-width"
                                                                                   @blur="change_first(i)">
                                                                    </integer-input>
                                                                    克
                                                                    <el-input v-model="sub.first_fee"
                                                                              @blur="change_fee(sub, 'first_fee')"
                                                                              :disabled="!editable"
                                                                              class="inline input-width">
                                                                    </el-input>
                                                                    元
                                                                </div>
                                                                <div class="inline">续重每
                                                                    <integer-input v-model="sub.additional_weight"
                                                                                   :min="1"
                                                                                   :disabled="!editable"
                                                                                   class="inline input-width">
                                                                    </integer-input>
                                                                    克
                                                                    <el-input v-model="sub.additional_fee"
                                                                              @blur="change_fee(sub, 'additional_fee')"
                                                                              :disabled="!editable"
                                                                              class="inline input-width"></el-input>
                                                                    元
                                                                </div>
                                                            </div>
                                                            <div class="inline" v-if="sub.stage_fee_type==='F'">
                                                                <el-input v-model="sub.fixed_fee"
                                                                          @blur="change_fee(sub, 'fixed_fee')"
                                                                          :disabled="!editable"
                                                                          class="inline input-sm">
                                                                </el-input>
                                                                元
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span>处理费：</span>
                                                            <el-input v-model="sub.handle_fee"
                                                                      @blur="change_fee(sub, 'handle_fee')"
                                                                      :disabled="!editable"
                                                                      class="inline"
                                                                      style="width: 60px;">
                                                            </el-input>
                                                        </td>
                                                        <td>
                                                            <el-button type="danger" size="mini" :disabled="!editable"
                                                                       @click="del_stage(i)">删除
                                                            </el-button>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <el-row>
                                                    <el-button type="primary" :disabled="!editable" @click="add_stage">
                                                        添加分段
                                                    </el-button>
                                                    <el-button type="primary" :disabled="!editable"
                                                               @click="clear_stage">
                                                        清空分段
                                                    </el-button>
                                                    <el-button type="primary" :disabled="!editable"
                                                               @click="batch_add_stage">excel复制导入
                                                    </el-button>
                                                    <el-button type="primary" :disabled="!editable" @click="download">
                                                        excel模板下载
                                                    </el-button>
                                                </el-row>
                                                <el-row v-if="!!curDetail2.batchAdd" class="mt-sm" :gutter="20">
                                                    <el-col :span="18">
                                                        <el-input
                                                                :disabled="!editable"
                                                                type="textarea"
                                                                :autosize="{ minRows: 8}"
                                                                placeholder="请输入内容"
                                                                v-model="textarea">
                                                        </el-input>
                                                    </el-col>
                                                    <el-col :span="4">
                                                        <el-button type="primary" :disabled="!editable"
                                                                   @click="batch_stage">导入
                                                        </el-button>
                                                    </el-col>
                                                </el-row>
                                            </el-form-item>
                                        </el-form>
                                    </el-row>
                                </el-card>
                            </rainbow-header>
                        </div>
                        <!--非全球可达-->
                        <div v-if="effData.arriveable_type===2">
                            <rainbow-header v-if='navsList[curIndex]' :title="navsList[curIndex].label"
                                            :key='effData.arriveable_type' background-color="#33B2FC">
                                <el-card>
                                    <el-form :model="curDetail2" label-width="164px">
                                        <el-form-item label="适用于物流属性：" v-if="show_properties(curDetail2)">
                                            <el-checkbox v-model="it.enabled" v-if="editable"
                                                         v-for="it in curDetail2.allow_properties" :key="it.name">
                                                {{it.name}}
                                            </el-checkbox>
                                            <el-tag type="success" v-if="!editable&&it.enabled" class="ml-xs"
                                                    v-for="it in curDetail2.allow_properties" :key="it.name">{{it.name}}
                                            </el-tag>
                                        </el-form-item>
                                        <el-form-item label="禁用物流属性：" v-if="showdeny(curDetail2)">
                                            <el-checkbox v-model="it.enabled" v-if="editable"
                                                         v-for="it in curDetail2.deny_properties" :key="it.name">
                                                {{it.name}}
                                            </el-checkbox>
                                            <el-tag type="success" v-if="!editable&&it.enabled" class="ml-xs"
                                                    v-for="it in curDetail2.allow_properties" :key="it.name">{{it.name}}
                                            </el-tag>
                                        </el-form-item>
                                    </el-form>
                                    <el-row>
                                        <span> 到达目的国家列表</span>
                                        <el-button type="primary" size="mini" :disabled="!editable"
                                                   @click="add_country">
                                            编辑
                                        </el-button>
                                    </el-row>
                                    <el-row>
                                        <span v-for="(country,i) in curDetail2.locations"
                                              :key="`${country.country_cn_name}+${i}`">
                                            {{country.country_cn_name}}
                                        </span>
                                    </el-row>
                                </el-card>
                                <el-card>
                                    <span class="custom-label">运费计算公式：</span>
                                    <el-checkbox v-model="curDetail2.is_registered_fee"
                                                 :disabled="!editable" class="inline">挂号费
                                    </el-checkbox>
                                    <el-checkbox v-model="curDetail2.is_volumn_weight"
                                                 :disabled="!editable" class="inline">计算材积
                                    </el-checkbox>
                                    <el-checkbox v-model="curDetail2.is_oli_additional"
                                                 :disabled="!editable" class="inline">附加费
                                    </el-checkbox>
                                    <el-checkbox v-model="curDetail2.is_stage_fee"
                                                 :disabled="!editable" class="inline">分段收费
                                    </el-checkbox>
                                    <el-form :model="curDetail2" label-width="90px">
                                        <el-form-item label="可达天数：">
                                            <span>最快</span>
                                            <el-input v-model="curDetail2.earliest_days"
                                                      class="inline input-width"
                                                      :disabled="!editable"
                                                      @blur="change_earliest(curDetail2)"
                                            >
                                            </el-input>
                                            <span>天</span>
                                            <span>最慢</span>
                                            <el-input v-model="curDetail2.latest_days"
                                                      class="inline input-width"
                                                      :disabled="!editable"
                                                      @blur="chang_latest(curDetail2)"
                                            >
                                            </el-input>
                                            <span>天</span>
                                        </el-form-item>
                                        <el-form-item label="最小限重：">
                                            <integer-input v-model="curDetail2.min_weight"
                                                           :min="1"
                                                           @blur="min_weight_change"
                                                           class="inline input-width"
                                                           :disabled="!editable">
                                            </integer-input>
                                            g
                                        </el-form-item>
                                        <el-form-item label="最大限重：">
                                            <integer-input v-model="curDetail2.max_weight"
                                                           :min="1"
                                                           @blur="max_weight_change"
                                                           class="inline s-width-default"
                                                           :disabled="!editable">
                                            </integer-input>
                                            g
                                            <span class="c-red">
                                             （0代表不限重）   同买家的多个订单合并包裹时总重量超过该值将会生成多个包裹
                                        </span>
                                        </el-form-item>
                                        <el-form-item label="挂号费：" v-if="curDetail2.is_registered_fee">
                                            <el-input v-model="curDetail2.registered_fee"
                                                      @blur="change_fee(curDetail2, 'registered_fee')"
                                                      :disabled="!editable" class="inline input-width">
                                            </el-input>
                                            <span>元</span>
                                        </el-form-item>
                                        <el-form-item label="材积：" v-if="curDetail2.is_volumn_weight">
                                            <span>材积(kg)=长(cm)*宽(cm)*高(cm)÷</span>
                                            <integer-input v-model="curDetail2.volumn_weight"
                                                           :min="1"
                                                           :disabled="!editable" class="inline input-width">
                                            </integer-input>
                                        </el-form-item>
                                        <el-form-item label="附加费率：" v-if="curDetail2.is_oli_additional">
                                            <el-input v-model="curDetail2.oli_additional_fee"
                                                      @blur="change_fee(curDetail2, 'oli_additional_fee')"
                                                      :disabled="!editable" class="inline input-width">
                                            </el-input>
                                            <span>%</span>
                                        </el-form-item>
                                        <el-form-item label="首重：" v-if="!curDetail2.is_stage_fee">
                                            <span>每</span>
                                            <integer-input v-model="curDetail2.first_weight"
                                                           :min="1"
                                                           :disabled="!editable" class="inline input-width">
                                            </integer-input>
                                            <span> g  收取</span>
                                            <el-input v-model="curDetail2.first_fee"
                                                      @blur="change_fee(curDetail2, 'oli_additional_fee')"
                                                      :disabled="!editable" class="inline input-width">
                                            </el-input>
                                            <span>元</span>
                                        </el-form-item>
                                        <el-form-item label="续重：" v-if="!curDetail2.is_stage_fee">
                                            <span>每</span>
                                            <integer-input v-model="curDetail2.additional_weight"
                                                           :min="1"
                                                           :disabled="!editable" class="inline input-width">
                                            </integer-input>
                                            <span> g  收取</span>
                                            <el-input v-model="curDetail2.additional_fee"
                                                      @blur="change_fee(curDetail2, 'additional_fee')"
                                                      :disabled="!editable" class="inline input-width">
                                            </el-input>
                                            <span>元</span>
                                        </el-form-item>
                                        <el-form-item label-width="10px" v-if="curDetail2.is_stage_fee">
                                            <table>
                                                <tr v-for="(sub,i) in curDetail2.stages" :key="i">
                                                    <td>分组{{i+1}}</td>
                                                    <td>
                                                        <integer-input v-model="sub.start_weight"
                                                                       :min="0"
                                                                       :disabled="!editable"
                                                                       class="inline  s-width-default">
                                                        </integer-input>
                                                        <span>克＜重量≤</span>
                                                        <integer-input v-model="sub.end_weight"
                                                                       :min="1"
                                                                       :disabled="!editable"
                                                                       class="inline s-width-default"
                                                                       @blur="change_end(i)">
                                                        </integer-input>
                                                        <div class="inline">
                                                            <el-select :disabled="!editable"
                                                                       v-model="sub.stage_fee_type" placeholder="请选择"
                                                                       class="sel-width inline">
                                                                <el-option
                                                                        v-for="option in options"
                                                                        :key="option.value"
                                                                        :label="option.label"
                                                                        :value="option.value">
                                                                </el-option>
                                                            </el-select>
                                                        </div>
                                                        <div class="inline"
                                                             :disabled="!editable"
                                                             v-if="sub.stage_fee_type==='D'">
                                                            <div>每
                                                                <integer-input v-model="sub.additional_weight"
                                                                               :min="1"
                                                                               class="inline input-width">
                                                                </integer-input>
                                                                克
                                                                <el-input v-model="sub.additional_fee"
                                                                          @blur="change_fee(sub, 'additional_fee')"
                                                                          class="inline input-width">
                                                                </el-input>
                                                                元
                                                            </div>
                                                        </div>
                                                        <div class="inline" v-if="sub.stage_fee_type==='A'">
                                                            <div>首重
                                                                <integer-input v-model="sub.first_weight"
                                                                               :min="1"
                                                                               :disabled="!editable"
                                                                               class="inline input-width"
                                                                               @blur="change_first(i)">
                                                                </integer-input>
                                                                克
                                                                <el-input v-model="sub.first_fee"
                                                                          :disabled="!editable"
                                                                          @blur="change_fee(sub, 'first_fee')"
                                                                          class="inline input-width">
                                                                </el-input>
                                                                元
                                                            </div>
                                                            <div>续重每
                                                                <integer-input v-model="sub.additional_weight"
                                                                               :min="1"
                                                                               :disabled="!editable"
                                                                               class="inline input-width">
                                                                </integer-input>
                                                                克
                                                                <el-input v-model="sub.additional_fee"
                                                                          @blur="change_fee(sub, 'additional_fee')"
                                                                          :disabled="!editable" class="inline
                                                                       input-width"></el-input>
                                                                元
                                                            </div>
                                                        </div>
                                                        <div class="inline" v-if="sub.stage_fee_type==='F'">
                                                            <div>
                                                                <el-input v-model="sub.fixed_fee"
                                                                          @blur="change_fee(sub, 'fixed_fee')"
                                                                          :disabled="!editable"
                                                                          class="inline width-sm">
                                                                </el-input>
                                                                元
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span>处理费：</span>
                                                        <el-input v-model="sub.handle_fee"
                                                                  @blur="change_fee(sub, 'handle_fee')"
                                                                  :disabled="!editable"
                                                                  class="inline"
                                                                  style="width: 60px;">
                                                        </el-input>
                                                    </td>
                                                    <td>
                                                        <el-button type="danger" size="mini" :disabled="!editable"
                                                                   @click="del_stage(i)">删除
                                                        </el-button>
                                                    </td>
                                                </tr>
                                            </table>
                                            <el-row>
                                                <el-button type="primary" :disabled="!editable" @click="add_stage">
                                                    添加分段
                                                </el-button>
                                                <el-button type="primary" :disabled="!editable" @click="clear_stage">
                                                    清空分段
                                                </el-button>
                                                <el-button type="primary" :disabled="!editable"
                                                           @click="batch_add_stage">excel复制导入
                                                </el-button>
                                                <el-button type="primary" :disabled="!editable" @click="download">
                                                    excel模板下载
                                                </el-button>
                                            </el-row>
                                            <el-row v-if="!!curDetail2.batchAdd" class="mt-sm" :gutter="20">
                                                <el-col :span="18">
                                                    <el-input
                                                            :disabled="!editable"
                                                            type="textarea"
                                                            :autosize="{ minRows: 8}"
                                                            placeholder="请输入内容"
                                                            v-model="textarea">
                                                    </el-input>
                                                </el-col>
                                                <el-col :span="4">
                                                    <el-button type="primary" :disabled="!editable"
                                                               @click="batch_stage">导入
                                                    </el-button>
                                                </el-col>
                                            </el-row>
                                        </el-form-item>
                                    </el-form>
                                </el-card>
                            </rainbow-header>
                        </div>
                    </tab-head>
                </tabs>
                <div v-show="effData.arriveable_type!==0" class="mt-xs">
                    <el-button type="primary" size="mini" :disabled="!editable" @click="add_details">添加分区</el-button>
                </div>
                <add-country ref="addCountry" v-model="countryVisible" @get-country="get_country"></add-country>
            </el-row>
        </el-card>
        <import-excel v-model="excelVisible" :id="effData.id" :arrive_type="effData.arriveable_type"
                      @files-success="files_success"></import-excel>
    </page>
</template>
<style lang="stylus">
    .p-effective {
        .title {
            box-sizing: border-box;
            padding: 3px 8px;
            height: 30px;
            line-height: 19px;
            background-color: #6495ED;
            color: #fff;
            font-weight: bold;
        }
        .input-width {
            width: 60px;
        }
        .input-sm {
            width: 60px;
        }
        .sel-width {
            width: 165px;
        }
        .custom-label {
            width: 90px;
            display: inline-block;
            text-align: right;
        }
        .shipping-width {
            width: 300px;
        }
    }
</style>
<script>
    import {api_get_currency, api_copy_shipping, api_shipping_list, api_effective} from "@/api/setLogistics"
    import {api_get_shipping} from "@/api/common";
    import {downloadFile} from '@/lib/http';

    import mouseKey from '@/lib/mouse-key';

    export default {
        data() {
            return {
                loading: false,
                arriveableTypeList: [
                    {label: '全球可达(相同运费)', value: 0},
                    {label: '全球可达(不同运费)', value: 1},
                    {label: '非全球可达', value: 2},
                ],
//                curTitle:'',
                curIndex: 0,
                textarea: '',
                file_url: '下载导入模板',
                excelVisible: false,
                countryVisible: false,
                downExcelUrl: config.apiHost + 'downfile',
                classifys: [
                    {label: "无时效", value: 0},
                    {label: "经济型物流", value: 1},
                    {label: "标准型物流", value: 2},
                    {label: "特快型物流", value: 3},
                ],
                moneys: [],
                options: [
                    {label: "分段内按单位重量收费", value: "D"},
                    {label: "分段内首重+续重", value: "A"},
                    {label: "分段内固定收费", value: "F"},
                ],
                shipping: this.shippingId,
                shippingList: [],
                tempsData: {
                    zero: [{
                        earliest_days: "",
                        latest_days: "",
                        shipping_method_id: "",
                        first_weight: "",
                        first_fee: '',
                        additional_weight: '',
                        additional_fee: '',
                        max_weight: '',
                        is_volumn_weight: false,
                        volumn_weight: '',
                        is_oli_additional: false,
                        oli_additional_fee: '',
                        is_stage_fee: false,
                        is_registered_fee: false,
                        registered_fee: '',
                        stages: [],
                    }],
                    one: [{
                        earliest_days: "",
                        latest_days: "",
                        shipping_method_id: "",
                        first_weight: "",
                        first_fee: '',
                        additional_weight: '',
                        additional_fee: '',
                        max_weight: '',
                        is_volumn_weight: false,
                        volumn_weight: '',
                        is_oli_additional: false,
                        oli_additional_fee: "",
                        is_stage_fee: false,
                        is_registered_fee: false,
                        registered_fee: '',
                        stages: [],
                        allow_properties: [],
                        deny_properties: [],
                    },
                        {
                            earliest_days: "",
                            latest_days: "",
                            shipping_method_id: "",
                            first_weight: "",
                            first_fee: '',
                            additional_weight: '',
                            additional_fee: '',
                            max_weight: '',
                            is_volumn_weight: false,
                            volumn_weight: '',
                            is_oli_additional: false,
                            oli_additional_fee: '',
                            is_stage_fee: false,
                            is_registered_fee: false,
                            registered_fee: '',
                            stages: [],
                            locations: [],
                            allow_properties: [],
                            deny_properties: [],
                        }
                    ],
                    two: []
                },
                effData: {},
            }
        },
        mounted() {
//            this.curTitle = this.navsList[this.curIndex].label;
            this.get_currency();
            this.get_shipping();
            this.effData = this.effectiveData;
            mouseKey('ctrl+f', (e) => {
                e.stopPropagation();
                this.$findView({
                    query: (string) => {
                        return [];
                    },
                    find: (res) => {

                    }
                });
                return false;
            })
        },
        beforeDestroy() {
            mouseKey.unbind('ctrl+f');
        },
        methods: {
            show_close() {
            },
            change_type(val) {
                this.$nextTick(() => {
                    this.curIndex = 0;
                });
            },
            get_local_(locations) {
                if (!locations) return;
                let list = locations.map(row => row.country_cn_name).join(',');
                return list;
            },
            click_nav(item, index) {
                this.curIndex = index;
//                this.curTitle = item.label;
            },
            delete_curnav(index) {
                if (this.effData.arriveable_type === 1 && index === 0) return this.$message({
                    type: 'warning',
                    message: '默认模板不允许删除'
                });
                let det = "details_" + this.effData.arriveable_type;
                let detailsSource = this.effData[det];
                console.log(detailsSource, 'detailsSource');
                this.curIndex = 0;
                detailsSource.splice(index, 1);
            },
            files_success(id) {
                this.$emit('files-success', id);
            },
            show_properties(item) {
                if (item.allow_properties && item.allow_properties.length > 0) {
                    if (!this.editable) {
                        let find = item.allow_properties.find(row => row.enabled);
                        return !!find
                    } else {
                        return true
                    }
                }
            },
            showdeny(item) {
                if (item.deny_properties && item.deny_properties.length > 0) {
                    if (!this.editable) {
                        let find = item.deny_properties.find(row => row.enabled);
                        return !!find
                    } else {
                        return true
                    }
                }
            },
            download_file() {
                let url = this.downExcelUrl;
                let code = {
                    code: 'carriage'
                };
                downloadFile({
                    url: url,
                    get: code,
                    fileName: this.file_url,
                    suffix: '.xls',
                })
            },
            //折扣
            ship_discount() {
                let data = Number(this.effData.shipping_fee_discount);
                if (data > 2) {
                    this.effData.shipping_fee_discount = 2;
                } else if (data <= 0) {
                    this.effData.shipping_fee_discount = 0;
                } else {
                    this.effData.shipping_fee_discount = data.toFixed(2);
                }
            },
            //输入首重
            change_first(i) {
                let first = this.curDetail2.stages[i].first_weight;
                let endWight = this.curDetail2.stages[i].end_weight;
                if (Number(first) > Number(endWight)) {
                    this.curDetail2.stages[i].first_weight = endWight;
                }
            },
            //删除分段收费
            del_stage(i) {
                let length = this.curDetail2.stages.length;
                if (i === 0) {    //删除第一个
                    if (length === 1) {
                    } else {
                        this.curDetail2.stages[i + 1].start_weight = 0;
                    }
                } else if (i === (this.curDetail2.stages.length - 1)) {  //删除最后
                    this.curDetail2.stages[i - 1].end_weight = this.curDetail2.stages[i].end_weight;
                } else {//删除中间
                    this.curDetail2.stages[i + 1].start_weight = this.curDetail2.stages[i - 1].end_weight
                }
                this.curDetail2.stages.splice(i, 1)
            },
            //添加分段收费
            add_stage(index) {
                let det = "details_" + this.effData.arriveable_type;
                let length = this.curDetail2.stages.length;

                let obj = {
                    "start_weight": "",
                    "end_weight": "",
                    "stage_fee_type": "A",
                    "fixed_fee": "0.0000",
                    "first_weight": 0,
                    "first_fee": "0",
                    "additional_weight": 0,
                    "additional_fee": "0",
                    "stage_fee_text": "分段内首重+续重",
                    'handle_fee': "0"
                };
                this.curDetail2.stages.push(obj);
                let stages = this.curDetail2.stages;
                if (length === 0) {
                    stages[length].start_weight = this.curDetail2.min_weight;
                    stages[length].end_weight = this.curDetail2.max_weight;
                } else {
                    stages[length].end_weight = this.curDetail2.max_weight;
                    stages[length].start_weight = stages[length - 1].end_weight;
                }
            },
            //
            batch_add_stage(index) {
                let det = "details_" + this.effData.arriveable_type;
                this.effData[det] && this.effData[det].forEach(row => {
                    this.$set(row, 'batchAdd', false)
                });
                if (!this.curDetail2.batchAdd) {
                    this.curDetail2.batchAdd = true;
                } else {
                    this.curDetail2.batchAdd = false;
                    this.textarea = '';
                }
            },
            batch_stage(index) {
                if (!this.textarea) {
                    this.$message({type: 'info', message: "请输入导入内容"})
                }
                let text = this.textarea.split("\n").filter(row => {
                    return !!row
                }).map(row => row.trim());
                let flag = true;
                text = text.map(row => {
                    let arr = row.split(/\s+/);
                    arr.length !== 9 && (flag = false)
                    return arr
                });
                if (flag) {
                    let stages = [];
                    text.forEach(row => {
                        let obj = {
                            "start_weight": row[0],
                            "end_weight": row[1],
                            "stage_fee_type": row[2],
                            "fixed_fee": row[7],
                            "first_weight": row[3],
                            "first_fee": row[4],
                            "additional_weight": row[5],
                            "additional_fee": row[6],
                            'handle_fee': row[8],
                        };
                        stages.push(obj)
                    });
                    let det = "details_" + this.effData.arriveable_type;
                    this.$set(this.curDetail2, 'stages', stages);
                    this.curDetail2.batchAdd = false;
                    this.textarea = '';
                }
            },
            download() {
                let url = config.apiHost + `downfile`;
                let code = {
                    code: 'stage_fee'
                };
                downloadFile({
                    url: url,
                    get: code,
                    fileName: 'excel模板下载',
                    suffix: '.xls',
                })
            },
            clear_stage() {
                this.$set(this.curDetail2, 'stages', []);
            },
            //修改重量
            change_end(i) {
                let length = this.curDetail2.stages.length;
                if (length > 1 && length !== i + 1) {
                    this.curDetail2.stages[i + 1].start_weight = this.curDetail2.stages[i].end_weight
                }
            },
            change_fee(item, key) {//修改费用通用
                let fee = Number(item[key]);
                if (isNaN(fee) || fee < 0) {
                    item[key] = 0;
                } else {
                    item[key] = fee;
                }
            },
            //添加分区
            add_details() {
                let det = "details_" + this.effData.arriveable_type;
                let allow = clone(this.effData.allow_properties).map(row => {
                    row.enabled = false;
                    return row;
                });
                let deny = clone(this.effData.deny_properties).map(row => {
                    row.enabled = false;
                    return row;
                });
                this.effData[det].push({
                    earliest_days: "",
                    latest_days: "",
                    shipping_method_id: "",
                    first_weight: "",
                    first_fee: '',
                    additional_weight: '',
                    additional_fee: '',
                    max_weight: '',
                    is_volumn_weight: false,
                    volumn_weight: '',
                    is_oli_additional: false,
                    oli_additional_fee: '',
                    is_stage_fee: false,
                    is_registered_fee: false,
                    registered_fee: '',
                    stages: [],
                    locations: [],
                    allow_properties: allow,
                    deny_properties: deny,
                });
                let length = this.effData[det].length;
                this.curIndex = length - 1;
            },
            //删除分区
            del_details(index) {
                let det = "details_" + this.effData.arriveable_type;
                this.effData[det].splice(index, 1)
            },
            //添加国家
            add_country(index) {
                this.countryVisible = true;
                let det = "details_" + this.effData.arriveable_type;
                let country = this.clone(this.curDetail2.locations);
                this.$refs.addCountry.checkedList = country;
                this.$refs.addCountry.number = this.curIndex;
            },
            get_country(index, arry) {
                let det = "details_" + this.effData.arriveable_type;
                this.curDetail2.locations = arry;
            },
            clone(obj) {
                let o;
                if (typeof obj === "object") {
                    if (obj === null) {
                        o = null;
                    } else {
                        if (obj instanceof Array) {
                            o = [];
                            for (let i = 0, len = obj.length; i < len; i++) {
                                o.push(this.clone(obj[i]));
                            }
                        } else {
                            o = {};
                            for (let j in obj) {
                                o[j] = this.clone(obj[j]);
                            }
                        }
                    }
                } else {
                    o = obj;
                }
                return o;
            },
            //币种
            get_currency() {
                this.$http(api_get_currency).then(res => {
                    this.moneys = [];
                    for (let i in res) {
                        this.moneys.push(res[i])
                    }
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                })
            },
            change_earliest(item, index) {
                if (Number(item.earliest_days) < 0) {
                    item.earliest_days = 0
                }
                if (item.latest_days && Number(item.earliest_days) > Number(item.latest_days)) {
                    item.earliest_days = Number(item.latest_days);
                }
                typeof item.earliest_days === "string" && (item.earliest_days = item.earliest_days.trim());

            },
            chang_latest(item) {
                if (Number(item.latest_days) < 0) {
                    item.latest_days = 0
                }
                if (item.earliest_days && Number(item.earliest_days) > Number(item.latest_days)) {
                    item.latest_days = Number(item.earliest_days);
                }
                typeof item.latest_days === 'string' && (item.latest_days = item.latest_days.trim());
            },
            get_shipping() {
                this.$http(api_shipping_list).then(res => {
                    if (res.length <= 0) {
                        this.shippingList = [];
                        return
                    }
                    let list = res.map(row => {
                        return row.carrier_id
                    });
                    list = this.carrier_unique(list).map(carrier_id => {
                        let label = res.find(row => row.carrier_id === carrier_id);
                        return {
                            label: label.carrier_name,
                            value: carrier_id
                        }
                    });
                    this.shippingList = list.map(row => {
                        row.children = this.get_children(row, res);
                        return row
                    });
                }).catch(code => {
                    console.log(code);
                });
            },
            carrier_unique(arr) {
                let res = [];
                let json = {};
                for (let i = 0; i < arr.length; i++) {
                    if (!json[arr[i]]) {
                        res.push(arr[i]);
                        json[arr[i]] = 1;
                    }
                }
                return res;
            },
            get_children(row, res) {
                let child = [];
                res.forEach(item => {
                    if (row.value === item.carrier_id) {
                        child.push({
                            label: item.shortname,
                            value: item.shipping_method_id
                        })
                    }
                });
                return child
            },
            copy_shipping() {
                if (this.shipping.length !== 2) {
                    this.message({
                        type: 'error',
                        message: '请先选择要复制到的邮寄方式！'
                    });
                    this.$reqKey('copyShipping', false);
                    return;
                }
                let to_name = this.get_shipping_name(this.shippingId);
                let from_name = this.get_shipping_name(this.shipping);
                let data = {
                    from_shipping_id: this.shipping[1],
                    to_shipping_id: this.shippingId[1]
                };
                this.$confirm(`您将复制[${from_name}]报价信息到[${to_name}], 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false
                }).then(() => {
                    this.$http(api_copy_shipping, data).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.message || res
                        });
                        this.loading = true;
                        this.get_effective();
                    }).catch(code => {
                        this.$message({
                            type: 'error',
                            message: code.message || code
                        });
                    }).finally(() => {
                        setTimeout(() => {
                            this.$reqKey('copyShipping', false);
                        }, 200);
                    })
                }).catch(() => {
                    this.$reqKey('copyShipping', false);
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            get_shipping_name(shipping) {
                let carrier = this.shippingList.find(row => Number(row.value) === Number(shipping[0]));
                let shipping_name = carrier.children.find(row => Number(row.value) === Number(shipping[1])).label;
                console.log(`shipping name`, carrier, shipping_name);
                return `${carrier.label}>>${shipping_name}`;
            },
            get_effective() {
                this.$http(api_effective, this.effData.id).then(res => {
                    this.loading = false;
                    res.details.length !== 0 && res.details.forEach(row => {
                        row.is_volumn_weight = !!row.is_volumn_weight;
                        row.is_oli_additional = !!row.is_oli_additional;
                        row.is_stage_fee = !!row.is_stage_fee;
                        row.is_registered_fee = !!row.is_registered_fee;

                    });
                    switch (res.arriveable_type) {
                        case 0:
                            res.details_0 = res.details;
                            res.details_1 = this.clone(this.tempsData.one);
                            res.details_2 = this.clone(this.tempsData.two);
                            break;
                        case  1:
                            res.details_0 = this.clone(this.tempsData.zero);
                            res.details_1 = res.details;
                            res.details_2 = this.clone(this.tempsData.two);
                            break;
                        case  2:
                            res.details_0 = this.clone(this.tempsData.zero);
                            res.details_1 = this.clone(this.tempsData.one);
                            res.details_2 = res.details;
                            break;
                    }
                    this.effData = res;
                }).catch(code => {
                    this.loading = false;
                    this.$message({
                        type: "error",
                        message: code.message || code
                    });
                });
            },
            min_weight_change() {
                let val = this.curDetail2.min_weight;
                if (this.curDetail2.max_weight && Number(val) > Number(this.curDetail2.max_weight)) {
                    this.$message({
                        type: 'error',
                        message: '数量设置错误，请重新填写'
                    });
                    return;
                }
                if (this.curDetail2.stages.length !== 0) {
                    let stage = this.curDetail2.stages[0];
                    if (Number(val) > Number(stage.end_weight)) {
                        this.$message({
                            type: 'error',
                            message: '设置超出分租范围，请重新分组再修改最小限重'
                        });
                        this.curDetail2.min_weight = stage.start_weight;
                        return;
                    } else {
                        console.log(`start stage`, stage);
                        stage.start_weight = val;
                    }
                }
            },
            max_weight_change() {
                let val = this.curDetail2.max_weight;
                if (this.curDetail2.min_weight && Number(val) < Number(this.curDetail2.min_weight)) {
                    this.$message({
                        type: 'error',
                        message: '数量设置错误，请重新填写'
                    });
                    return;
                }
                if (this.curDetail2.stages.length !== 0) {
                    let stage = this.curDetail2.stages[this.curDetail2.stages.length - 1];
                    if (Number(val) < Number(stage.start_weight)) {
                        this.$message({
                            type: 'error',
                            message: '设置超出分组范围，请重新分组再修改最大限重'
                        });
                        this.curDetail2.max_weight = stage.end_weight;
                        return;
                    } else {
                        console.log(`start stage`, stage);
                        stage.end_weight = val;
                    }
                }
            }
        },
        computed: {
            showClose() {
                if (this.effData.arriveable_type === 2) {
                    return true;
                } else if (this.effData.arriveable_type === 1) {
                    return this.effData.details_1.length > 2 ? true : false
                }
            },
            curDetail2: {
                get() {
                    let curObj = {};
                    let det = "details_" + this.effData.arriveable_type;
                    let effData = this.effData[det];
                    console.log(effData, 'effData');
                    if (effData.length > 0) {
                        curObj = effData[this.curIndex];
                    }
                    console.log(curObj, 'curObj');
                    return curObj;
                },
                set(val) {
                    let det = "details_" + this.effData.arriveable_type;
                    this.effData[det][this.curIndex] = val;
                },
            },
            navsList() {
                let det = "details_" + this.effData.arriveable_type;
                let effData = this.effData[det];
                console.log(this.effData.arriveable_type, 'this.effData.arriveable_type');
                console.log(det, 'det');
                console.log(effData, 'effData');
                if (!effData) return [];
                let navs = effData.map((row, index) => {
                    switch (this.effData.arriveable_type) {
                        case 1:
                            if (row.locations) {
                                let list = row.locations.map(row => row.country_cn_name).join(',');
                                return {
                                    label: `分组${index + 1}: ${list}`,
                                    action: `${index}+1+${row.id}`,
                                }
                            } else {
                                return {
                                    label: `默认分组`,
                                    action: `${index}+1+${row.id}`,
                                }
                            }
                        case 2:
                            let list = row.locations.map(row => row.country_cn_name).join(',');
                            return {
                                label: `分组${index + 1}: ${list}`,
                                action: `${index}+2+${row.id}`,
                            };
                    }
                });
                console.log(navs, 'navs');
                return this.effData.arriveable_type === 0 ? [] : navs;
            },
        },
        watch: {
            shippingId(val) {
                this.shipping = val;
                console.log('shipping change', val, this.shipping);
            },
            effectiveData: {
                deep: true,
                handler(val) {
                    this.effData = val;
                }
            },
            effData: {
                deep: true,
                handler(val) {
                    this.$emit('effective-change', val)
                }
            }
        },
        props: {
            effectiveData: {},
            editable: {
                required: true,
                type: Boolean
            },
            shippingId: {},
        },
        components: {
            uiCard: require('@/components/ui-card').default,
            labelItem: require('@/components/label-item.vue').default,
            addCountry: require('./add-country.vue').default,
            importExcel: require('./import-excel.vue').default,
            tabs: require('@/components/tabs.vue').default,
            tabHead: require('@/components/tab-head.vue').default,
            tabItem: require('@/components/tab-item.vue').default,
            rainbowHeader: require('@/components/rainbow-header.vue').default,
            integerInput: require('@/components/integer-input.vue').default,
        }
    }
</script>
