<template>
    <page class="p-effective">
        <el-card>
            <el-form ref="form1" :model="effData" label-width="180px">
                <el-form-item label="按时效分类：">
                    <span>  {{effData. period}}</span>
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
                    <el-radio class="radio" v-model="effData.arriveable_type"
                              :disabled="!editable" :label="0">
                        全球可达(相同运费)
                    </el-radio>
                    <el-radio class="radio"
                              v-model="effData.arriveable_type"
                              :disabled="!editable" :label="1">
                        全球可达(不同运费)
                    </el-radio>
                    <el-radio class="radio"
                              v-model="effData.arriveable_type"
                              :disabled="!editable"
                              :label="2">非全球可达
                    </el-radio>
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
                <ui-card v-if="effData.arriveable_type===0"
                         class="mb-xs" v-for="(item,index) in effData.details_0"
                         :key="`${index}+0+${item}`">
                    <el-row>
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
                            <el-form-item label="最大限重：">
                                <el-input v-model="item.max_weight"
                                          class="inline input-width"
                                          :disabled="!editable">
                                </el-input>
                                g
                                <span class="c-red">
                                         （0代表不限重）   同买家的多个订单合并包裹时总重量超过该值将会生成多个包裹
                                    </span>
                            </el-form-item>
                            <el-form-item label="挂号费：" v-if="item.is_registered_fee">
                                <el-input v-model="item.registered_fee"
                                          :disabled="!editable" class="inline input-width">
                                </el-input>
                                <span>元</span>
                            </el-form-item>
                            <el-form-item label="材积：" v-if="item.is_volumn_weight">
                                <span>材积(kg)=长(cm)*宽(cm)*高(cm)÷</span>
                                <el-input v-model="item.volumn_weight"
                                          :disabled="!editable" class="inline input-width">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="附加费率：" v-if="item.is_oli_additional">
                                <el-input v-model="item.oli_additional_fee"
                                          :disabled="!editable" class="inline input-width">
                                </el-input>
                                <span>%</span>
                            </el-form-item>
                            <el-form-item label="首重：" v-if="!item.is_stage_fee">
                                <span>每</span>
                                <el-input-number v-model="item.first_weight"
                                                 :controls="false"
                                                 :disabled="!editable"
                                                 class="inline input-width">
                                </el-input-number>
                                <span> g  收取</span>
                                <el-input-number v-model="item.first_fee"
                                                 :controls="false"
                                                 :disabled="!editable"
                                                 class="inline input-width">
                                </el-input-number>
                                <span>元</span>
                            </el-form-item>

                            <el-form-item label="续重：" v-if="!item.is_stage_fee">
                                <span>每</span>
                                <el-input-number v-model="item.additional_weight"
                                                 :controls="false"
                                                 :disabled="!editable"
                                                 class="inline input-width">
                                </el-input-number>
                                <span> g  收取</span>
                                <el-input-number v-model="item.additional_fee"
                                                 :controls="false"
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
                                            <el-input v-model="sub.start_weight"
                                                      :disabled="!editable"
                                                      class="inline  input-width">
                                            </el-input>
                                            <span>克＜重量≤</span>
                                            <el-input v-model="sub.end_weight"
                                                      :disabled="!editable" class="inline input-width"
                                                      @blur="change_end(index,i)">
                                            </el-input>
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
                                                                    <span>每
                                                                        <el-input v-model="sub.additional_weight"
                                                                                  class="inline input-width">
                                                                        </el-input>克
                                                                        <el-input v-model="sub.additional_fee"
                                                                                  class="inline input-width">
                                                                        </el-input>元
                                                                    </span>
                                            </div>
                                            <div class="inline" v-if="sub.stage_fee_type==='A'">
                                                                    <span>首重
                                                                    <el-input v-model="sub.first_weight"
                                                                              :disabled="!editable"
                                                                              class="inline input-width"
                                                                              @blur="change_first(index,i)">
                                                                    </el-input>克
                                                                        <el-input v-model="sub.first_fee"
                                                                                  :disabled="!editable"
                                                                                  class="inline input-width">
                                                                        </el-input>元
                                                                    </span>
                                                <span>续重每
                                                                    <el-input v-model="sub.additional_weight"
                                                                              :disabled="!editable"
                                                                              class="inline input-width">
                                                                    </el-input>
                                                        克<el-input v-model="sub.additional_fee"
                                                                   :disabled="!editable" class="inline
                                                                   input-width"></el-input>元
                                                                    </span>
                                            </div>
                                            <div class="inline" v-if="sub.stage_fee_type==='F'">
                                                                    <span>
                                                                    <el-input v-model="sub.fixed_fee"
                                                                              :disabled="!editable"
                                                                              class="inline input-width">
                                                                    </el-input>元
                                                                    </span>
                                            </div>
                                        </td>
                                        <td>
                                            <span>处理费：</span>
                                            <el-input v-model="sub.handle_fee"
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
                    </el-row>
                </ui-card>
                <ui-card v-if="effData.arriveable_type===2"
                         class="mb-xs" v-for="(item,index) in effData.details_2"
                         :def-hidden="true"
                         :key="`${index}+1+${item}`">
                    <div slot="header" >
                        <span class="title"> 分组{{index+1}}</span>
                        <el-button type="primary" size="mini"
                                   @click="del_details(index)">删除此分区
                        </el-button>
                    </div>
                    <el-card>
                        <el-form :model="item" label-width="164px">
                            <el-form-item label="适用于物流属性：" v-if="show_properties(item)">
                                <el-checkbox v-model="it.enabled" v-if="editable"
                                             v-for="it in item.allow_properties" :key="it.name">{{it.name}}
                                </el-checkbox>
                                <el-tag type="success" v-if="!editable&&it.enabled" class="ml-xs"
                                        v-for="it in item.allow_properties" :key="it.name">{{it.name}}
                                </el-tag>
                            </el-form-item>
                            <el-form-item label="禁用物流属性：" v-if="showdeny(item)">
                                <el-checkbox v-model="it.enabled" v-if="editable"
                                             v-for="it in item.deny_properties" :key="it.name">{{it.name}}
                                </el-checkbox>
                                <el-tag type="success" v-if="!editable&&it.enabled" class="ml-xs"
                                        v-for="it in item.allow_properties" :key="it.name">{{it.name}}
                                </el-tag>
                            </el-form-item>
                        </el-form>
                        <el-row>
                            <span> 到达目的国家列表</span>
                            <el-button type="primary" size="mini" :disabled="!editable" @click="add_country(index)">
                                编辑
                            </el-button>
                        </el-row>
                        <el-row>
                                    <span v-for="(country,i) in item.locations"
                                          :key="`${country.country_cn_name}+${i}`">
                                        {{country.country_cn_name}}
                                    </span>
                        </el-row>
                    </el-card>
                    <el-card>
                        <el-row>
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
                                <el-form-item label="最大限重：">
                                    <el-input v-model="item.max_weight"
                                              class="inline input-width"
                                              :disabled="!editable">
                                    </el-input>
                                    g
                                    <span class="c-red">
                                         （0代表不限重）   同买家的多个订单合并包裹时总重量超过该值将会生成多个包裹
                                    </span>
                                </el-form-item>
                                <el-form-item label="挂号费：" v-if="item.is_registered_fee">
                                    <el-input v-model="item.registered_fee"
                                              :disabled="!editable" class="inline input-width">
                                    </el-input>
                                    <span>元</span>
                                </el-form-item>
                                <el-form-item label="材积：" v-if="item.is_volumn_weight">
                                    <span>材积(kg)=长(cm)*宽(cm)*高(cm)÷</span>
                                    <el-input v-model="item.volumn_weight"
                                              :disabled="!editable" class="inline input-width">
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="附加费率：" v-if="item.is_oli_additional">
                                    <el-input v-model="item.oli_additional_fee"
                                              :disabled="!editable" class="inline input-width">
                                    </el-input>
                                    <span>%</span>
                                </el-form-item>
                                <el-form-item label="首重：" v-if="!item.is_stage_fee">
                                    <span>每</span>
                                    <el-input v-model="item.first_weight"
                                              :disabled="!editable" class="inline input-width">
                                    </el-input>
                                    <span> g  收取</span>
                                    <el-input v-model="item.first_fee"
                                              :disabled="!editable" class="inline input-width">
                                    </el-input>
                                    <span>元</span>
                                </el-form-item>

                                <el-form-item label="续重：" v-if="!item.is_stage_fee">
                                    <span>每</span>
                                    <el-input v-model="item.additional_weight"
                                              :disabled="!editable" class="inline input-width">
                                    </el-input>
                                    <span> g  收取</span>
                                    <el-input v-model="item.additional_fee"
                                              :disabled="!editable" class="inline input-width">
                                    </el-input>
                                    <span>元</span>
                                </el-form-item>
                                <el-form-item label-width="10px" v-if="item.is_stage_fee">
                                    <table>
                                        <tr v-for="(sub,i) in item.stages" :key="i">
                                            <td>分组{{i+1}}</td>
                                            <td>
                                                <el-input v-model="sub.start_weight"
                                                          :disabled="!editable"
                                                          class="inline  input-width">
                                                </el-input>
                                                <span>克＜重量≤</span>
                                                <el-input v-model="sub.end_weight"
                                                          :disabled="!editable" class="inline input-width"
                                                          @blur="change_end(index,i)">
                                                </el-input>
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
                                                                    <span>每
                                                                        <el-input v-model="sub.additional_weight"
                                                                                  class="inline input-width">
                                                                        </el-input>克
                                                                        <el-input v-model="sub.additional_fee"
                                                                                  class="inline input-width">
                                                                        </el-input>元
                                                                    </span>
                                                </div>
                                                <div class="inline" v-if="sub.stage_fee_type==='A'">
                                                                    <span>首重
                                                                    <el-input v-model="sub.first_weight"
                                                                              :disabled="!editable"
                                                                              class="inline input-width"
                                                                              @blur="change_first(index,i)">
                                                                    </el-input>克
                                                                        <el-input v-model="sub.first_fee"
                                                                                  :disabled="!editable"
                                                                                  class="inline input-width">
                                                                        </el-input>元
                                                                    </span>
                                                    <span>续重每
                                                                    <el-input v-model="sub.additional_weight"
                                                                              :disabled="!editable"
                                                                              class="inline input-width">
                                                                    </el-input>
                                                        克<el-input v-model="sub.additional_fee"
                                                                   :disabled="!editable" class="inline
                                                                   input-width"></el-input>元
                                                                    </span>
                                                </div>
                                                <div class="inline" v-if="sub.stage_fee_type==='F'">
                                                                    <span>
                                                                    <el-input v-model="sub.fixed_fee"
                                                                              :disabled="!editable"
                                                                              class="inline width-sm">
                                                                    </el-input>元
                                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <span>处理费：</span>
                                                <el-input v-model="sub.handle_fee"
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
                                        <el-button type="primary" :disabled="!editable" @click="add_stage(index)">
                                            添加分段
                                        </el-button>
                                        <el-button type="primary" :disabled="!editable" @click="clear_stage(index)">
                                            清空分段
                                        </el-button>
                                        <el-button type="primary" :disabled="!editable"
                                                   @click="batch_add_stage(index)">excel复制导入
                                        </el-button>
                                        <el-button type="primary" :disabled="!editable" @click="download">
                                            excel模板下载
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
                                            <el-button type="primary" :disabled="!editable"
                                                       @click="batch_stage(index)">导入
                                            </el-button>
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                            </el-form>
                        </el-row>
                    </el-card>
                </ui-card>
                <ui-card v-if="effData.arriveable_type===1" class="mb-xs" v-for="(item,index) in effData.details_1"
                         :key="`${index}+2+${item}`">
                    <div class="title" v-if="index===0">
                        <span>默认分区</span>
                    </div>
                    <div class="title" v-if="index!==0">
                        <span> 分组{{index+1}}</span>
                        <el-button type="primary" size="mini" v-show="effData.details_1.length>=3" class="fr"
                                   @click="del_details(index)" v-if="editable">删除此分区
                        </el-button>
                    </div>
                    <el-card v-if="index!==0">
                        <el-row>
                            <span> 到达目的国家列表</span>
                            <el-button type="primary" size="mini" :disabled="!editable" @click="add_country(index)">
                                编辑
                            </el-button>
                        </el-row>
                        <el-row>
                                <span v-for="(country,i) in item.locations " :key="`${country.country_cn_name}+${i}`">
                                    {{country.country_cn_name}}
                                </span>
                        </el-row>
                    </el-card>
                    <el-card>
                        <el-form :model="item" label-width="164px">
                            <el-form-item label="适用于物流属性：" v-if="show_properties(item)">
                                <el-checkbox v-model="it.enabled" v-if="editable"
                                             v-for="it in item.allow_properties" :key="it.name">{{it.name}}
                                </el-checkbox>
                                <el-tag type="success" v-if="!editable&&it.enabled" class="ml-xs"
                                        v-for="it in item.allow_properties" :key="it.name">{{it.name}}
                                </el-tag>
                            </el-form-item>
                            <el-form-item label="禁用物流属性：" v-if="showdeny(item)">
                                <el-checkbox v-model="it.enabled" v-if="editable"
                                             v-for="it in item.deny_properties" :key="it.name">{{it.name}}
                                </el-checkbox>
                                <el-tag type="success" v-if="!editable&&it.enabled" class="ml-xs"
                                        v-for="it in item.allow_properties" :key="it.name">{{it.name}}
                                </el-tag>
                            </el-form-item>
                        </el-form>
                        <el-row>
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
                                <el-form-item label="最大限重：">
                                    <el-input v-model="item.max_weight"
                                              class="inline input-width"
                                              :disabled="!editable">
                                    </el-input>
                                    g
                                    <span class="c-red">
                                     （0代表不限重）   同买家的多个订单合并包裹时总重量超过该值将会生成多个包裹
                                </span>
                                </el-form-item>
                                <el-form-item label="挂号费：" v-if="item.is_registered_fee">
                                    <el-input v-model="item.registered_fee"
                                              :disabled="!editable" class="inline input-width">
                                    </el-input>
                                    <span>元</span>
                                </el-form-item>
                                <el-form-item label="材积：" v-if="item.is_volumn_weight">
                                    <span>材积(kg)=长(cm)*宽(cm)*高(cm)÷</span>
                                    <el-input v-model="item.volumn_weight"
                                              :disabled="!editable" class="inline input-width">
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="附加费率：" v-if="item.is_oli_additional">
                                    <el-input v-model="item.oli_additional_fee"
                                              :disabled="!editable" class="inline input-width">
                                    </el-input>
                                    <span>%</span>
                                </el-form-item>
                                <el-form-item label="首重：" v-if="!item.is_stage_fee">
                                    <span>每</span>
                                    <el-input v-model="item.first_weight"
                                              :disabled="!editable" class="inline input-width">
                                    </el-input>
                                    <span> g  收取</span>
                                    <el-input v-model="item.first_fee"
                                              :disabled="!editable" class="inline input-width">
                                    </el-input>
                                    <span>元</span>
                                </el-form-item>

                                <el-form-item label="续重：" v-if="!item.is_stage_fee">
                                    <span>每</span>
                                    <el-input v-model="item.additional_weight"
                                              :disabled="!editable" class="inline input-width">
                                    </el-input>
                                    <span> g  收取</span>
                                    <el-input v-model="item.additional_fee"
                                              :disabled="!editable" class="inline input-width">
                                    </el-input>
                                    <span>元</span>
                                </el-form-item>
                                <el-form-item label-width="10px" v-if="item.is_stage_fee">
                                    <table>
                                        <tr v-for="(sub,i) in item.stages" :key="i">
                                            <td>分组{{i+1}}</td>
                                            <td>
                                                <el-input v-model="sub.start_weight"
                                                          :disabled="!editable"
                                                          class="inline  input-width">
                                                </el-input>
                                                <span>克＜重量≤</span>
                                                <el-input v-model="sub.end_weight"
                                                          :disabled="!editable" class="inline input-width"
                                                          @blur="change_end(index,i)">
                                                </el-input>
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
                                                                <span>每
                                                                    <el-input v-model="sub.additional_weight"
                                                                              class="inline input-width">
                                                                    </el-input>克
                                                                    <el-input v-model="sub.additional_fee"
                                                                              class="inline input-width">
                                                                    </el-input>元
                                                                </span>
                                                </div>
                                                <div class="inline" v-if="sub.stage_fee_type==='A'">
                                                                <span>首重
                                                                <el-input v-model="sub.first_weight"
                                                                          :disabled="!editable"
                                                                          class="inline input-width"
                                                                          @blur="change_first(index,i)">
                                                                </el-input>克
                                                                    <el-input v-model="sub.first_fee"
                                                                              :disabled="!editable"
                                                                              class="inline input-width">
                                                                    </el-input>元
                                                                </span>
                                                    <span>续重每
                                                                <el-input v-model="sub.additional_weight"
                                                                          :disabled="!editable"
                                                                          class="inline input-width">
                                                                </el-input>
                                                    克<el-input v-model="sub.additional_fee"
                                                               :disabled="!editable" class="inline
                                                               input-width"></el-input>元
                                                                </span>
                                                </div>
                                                <div class="inline" v-if="sub.stage_fee_type==='F'">
                                                                <span>
                                                                <el-input v-model="sub.fixed_fee"
                                                                          :disabled="!editable"
                                                                          class="inline input-sm">
                                                                </el-input>元
                                                                </span>
                                                </div>


                                            </td>
                                            <td>
                                                <span>处理费：</span>
                                                <el-input v-model="sub.handle_fee"
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
                                        <el-button type="primary" :disabled="!editable" @click="add_stage(index)">
                                            添加分段
                                        </el-button>
                                        <el-button type="primary" :disabled="!editable" @click="clear_stage(index)">
                                            清空分段
                                        </el-button>
                                        <el-button type="primary" :disabled="!editable"
                                                   @click="batch_add_stage(index)">excel复制导入
                                        </el-button>
                                        <el-button type="primary" :disabled="!editable" @click="download">
                                            excel模板下载
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
                                            <el-button type="primary" :disabled="!editable"
                                                       @click="batch_stage(index)">导入
                                            </el-button>
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                            </el-form>
                        </el-row>
                    </el-card>
                </ui-card>
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
    }
</style>
<script>
    import {api_get_currency} from "../../../api/setLogistics"
    import {downloadFile} from '../../../lib/http';

    import mouseKey from '@/lib/mouse-key';

    export default {
        data() {
            return {
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
            }
        },
        mounted() {
            this.get_currency()
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
            change_first(index, i) {
                let det = "details_" + this.effData.arriveable_type;
                let first = this.effData[det][index].stages[i].first_weight;
                let endWight = this.effData[det][index].stages[i].end_weight;
                if (Number(first) > Number(endWight)) {
                    this.effData[det][index].stages[i].first_weight = endWight;
                }
            },
            //删除分段收费
            del_stage(index, i) {
                let det = "details_" + this.effData.arriveable_type;
                let length = this.effData[det][index].stages.length;
                if (i === 0) {    //删除第一个
                    if (length === 1) {
                    } else {
                        this.effData[det][index].stages[i + 1].start_weight = 0;
                    }
                } else if (i === (this.effData[det][index].stages.length - 1)) {  //删除最后
                    this.effData[det][index].stages[i - 1].end_weight = this.effData[det][index].stages[i].end_weight;
                } else {//删除中间
                    this.effData[det][index].stages[i + 1].start_weight = this.effData[det][index].stages[i - 1].end_weight
                }
                this.effData[det][index].stages.splice(i, 1)
            },
            //添加分段收费
            add_stage(index) {
                let det = "details_" + this.effData.arriveable_type;
                let length = this.effData[det][index].stages.length;
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
                this.effData[det][index].stages.push(obj);
                let stages = this.effData[det][index].stages;
                if (length === 0) {
                    stages[length].start_weight = 0;
                    stages[length].end_weight = this.effData[det][index].max_weight;
                } else {
                    stages[length].end_weight = this.effData[det][index].max_weight;
                    stages[length].start_weight = stages[length - 1].end_weight;
                }

            },
            //
            batch_add_stage(index) {
                let det = "details_" + this.effData.arriveable_type;
                this.effData[det] && this.effData[det].forEach(row => {
                    this.$set(row, 'batchAdd', false)
                });
                if (!this.effData[det][index].batchAdd) {
                    this.effData[det][index].batchAdd = true;
                } else {
                    this.effData[det][index].batchAdd = false;
                    this.textarea = '';
                }
            },
            batch_stage(index) {
                if (!this.textarea) {
                    this.$message({type: 'info', message: "请输入导入内容"})
                }
                let text = this.textarea.split("\n").filter(row => {
                    return !!row
                });
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
                    this.$set(this.effData[det][index], 'stages', stages);
                    this.effData[det][index].batchAdd = false;
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
            clear_stage(index) {
                let det = "details_" + this.effData.arriveable_type;
                this.$set(this.effData[det][index], 'stages', []);
            },
            //修改重量
            change_end(index, i) {
                let det = "details_" + this.effData.arriveable_type;
                let length = this.effData[det][index].stages.length;
                if (length > 1 && length !== i + 1) {
                    this.effData[det][index].stages[i + 1].start_weight = this.effData[det][index].stages[i].end_weight
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
                let country = this.clone(this.effData[det][index].locations);
                this.$refs.addCountry.checkedList = country;
                this.$refs.addCountry.number = index;
            },
            get_country(index, arry) {
                let det = "details_" + this.effData.arriveable_type;
                this.effData[det][index].locations = arry;
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

            },
            chang_latest(item, index) {
                if (Number(item.latest_days) < 0) {
                    item.latest_days = 0
                }
                if (item.earliest_days && Number(item.earliest_days) > Number(item.latest_days)) {
                    item.latest_days = Number(item.earliest_days);
                }
            },
        },
        props: {
            effData: {},
            editable: {
                required: true,
                type: Boolean
            }

        },
        components: {
            uiCard: require('@/components/ui-card').default,
            labelItem: require('../../../components/label-item.vue').default,
            addCountry: require('./add-country.vue').default,
            importExcel: require('./import-excel.vue').default
        }
    }
</script>
