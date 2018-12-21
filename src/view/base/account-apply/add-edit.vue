<template>
    <div>
        <page-dialog :title="action.title"
                     @open="open"
                     v-model="visible"
                     size="large"
                     class="p-account-information"
                     :close-on-click-modal="false">
    <div>
        <el-form label-width="330px" class="form-header-fixed" :model="editData" ref="editForm">
            <el-form-item label="当前账号状态：" class="mt-xs mb-xs">
                <el-steps :space="100" :active="editData.status">
                    <el-step
                        v-for="(item,index) in statusList"
                        :status="statusType(item)"
                        :key="index"
                        :title="item.title"></el-step>
                </el-steps>
            </el-form-item>
        </el-form>
        <!--<div class="tabs-content form-body-scroll">-->
            <!--<div class="tabs-content-pane card">-->
                <!--<el-tabs type="card" :active-name="actionName" ref="tabs" @tab-click="tab_click">-->
                    <!--<el-tab-pane key="base-info" name="base-info" label="基本信息" class="roll-height">-->
                        <!--<el-form label-width="200px" :model="editData" ref="editForm">-->
                            <!--<el-form-item label="发起日期：">-->
                                <!--<el-date-picker-->
                                    <!--v-model="editData.initiate_time"-->
                                    <!--:editable="false"-->
                                    <!--type="date"-->
                                    <!--placeholder="选择日期"-->
                                    <!--:disabled="notRegister"-->
                                    <!--:picker-options="initiateTime"-->
                                    <!--class="inline date">-->
                                <!--</el-date-picker>-->
                            <!--</el-form-item>-->
                            <!--<el-form-item label="负责人：">-->
                                <!--<scroll-select v-model="accounts" style="width:158px" class="inline"-->
                                               <!--textAlign="left"-->
                                               <!--:disabled="notRegister"-->
                                               <!--ref="creater"-->
                                               <!--:remote="urlCreater"-->
                                               <!--:fix-params="fix_params_account"-->
                                               <!--:fixResult="fix_result_account">-->
                                <!--</scroll-select>-->
                            <!--</el-form-item>-->
                            <!--<el-form-item label="平台：">-->
                                <!--<select-remote v-model="editData.channel_id"-->
                                               <!--:all="false"-->
                                               <!--:disabled="notRegister"-->
                                               <!--@load="load"-->
                                               <!--:remote="channel_remote">-->
                                <!--</select-remote>-->
                            <!--</el-form-item>-->
                            <!--<el-form-item label="站点：">-->
                                <!--<el-select :disabled="siteOptions.length===0||notRegister"-->
                                           <!--filterable clearable-->
                                           <!--multiple-->
                                           <!--class="inline"-->
                                           <!--:placeholder="sitePlaceholder"-->
                                           <!--v-model="editData.site_code">-->
                                    <!--<el-option v-for="item in siteOptions"-->
                                               <!--:label="item.label"-->
                                               <!--:value="item.value"-->
                                               <!--:key="item.value">-->
                                    <!--</el-option>-->
                                <!--</el-select>-->
                            <!--</el-form-item>-->
                            <!--<el-form-item label="品类：">-->
                                <!--<el-col :span="col11">-->
                                    <!--<el-input type="text"-->
                                              <!--:disabled="notRegister"-->
                                              <!--v-model="editData.breed"></el-input>-->
                                <!--</el-col>-->
                            <!--</el-form-item>-->
                            <!--<el-form-item label="服务器：">-->
                                <!--<scroll-select v-model="serverIp" style="width:200px" class="inline"-->
                                               <!--textAlign="left"-->
                                               <!--:disabled="notRegister"-->
                                               <!--ref="ip"-->
                                               <!--:remote="urlIp"-->
                                               <!--:fix-params="fix_params_ip"-->
                                               <!--:fixResult="fix_result_ip">-->
                                <!--</scroll-select>-->
                                <!--<div v-if="editData.channel_id !== 0 && alreadyBind.length > 0">-->
                                    <!--<span>该服务器已绑定{{channelName}}账号：</span>-->
                                    <!--<span v-for="(item, index) in alreadyBind"-->
                                          <!--:key="index"-->
                                          <!--class="mr-xs error">-->
                            <!--{{item.account_code}}-->
                        <!--</span>-->
                                <!--</div>-->
                            <!--</el-form-item>-->
                            <!--<el-form-item label="服务器类型：">-->
                                <!--<el-col :span="col11">-->
                                    <!--<el-input type="text"-->
                                              <!--:disabled="notRegister"-->
                                              <!--v-model="editData.server_type"></el-input>-->
                                <!--</el-col>-->
                            <!--</el-form-item>-->
                            <!--<el-form-item label="公司名称：">-->
                                <!--<el-col :span="col11">-->
                                    <!--<el-input type="text"-->
                                              <!--:disabled="notRegister"-->
                                              <!--v-model="editData.company"></el-input>-->
                                <!--</el-col>-->
                                <!--<div class="inline img_lazy" v-if="isAdd">-->
                                    <!--<el-popover-->
                                        <!--v-if="editData.charter_url"-->
                                        <!--placement="right"-->
                                        <!--width="200"-->
                                        <!--trigger="hover">-->
                                    <!--</el-popover>-->
                                    <!--<image-upload :thumbnail-mode="true"-->
                                                  <!--label="上传公司的营业执照"-->
                                                  <!--class="inline ml-xs"-->
                                                  <!--v-if="!notRegister"-->
                                                  <!--:multiple="false"-->
                                                  <!--ref="images"-->
                                                  <!--:init="file"></image-upload>-->
                                <!--</div>-->
                                <!--<div class="inline" v-if="!isAdd">-->
                                    <!--<img v-lazy="`http://${editData.charter_url}`" style="width:100px;height:100px"/>-->
                                <!--</div>-->
                            <!--</el-form-item>-->
                            <!--<el-form-item label="公司类型：">-->
                                <!--<el-col :span="col11">-->
                                    <!--<el-input type="text"-->
                                              <!--:disabled="notRegister"-->
                                              <!--v-model="editData.company_type"></el-input>-->
                                <!--</el-col>-->
                            <!--</el-form-item>-->
                            <!--<el-form-item label="法人姓名：">-->
                                <!--<el-col :span="col11">-->
                                    <!--<el-input type="text"-->
                                              <!--:disabled="notRegister"-->
                                              <!--v-model="editData.corporation"></el-input>-->
                                <!--</el-col>-->
                                <!--<div class="inline img_lazy" v-if="isAdd">-->
                                    <!--<el-popover-->
                                        <!--v-if="editData.corporation_id_front"-->
                                        <!--placement="right"-->
                                        <!--width="200"-->
                                        <!--trigger="hover">-->
                                    <!--</el-popover>-->
                                    <!--<image-upload-->
                                        <!--:thumbnail-mode="true"-->
                                        <!--v-if="!notRegister"-->
                                        <!--label="上传本人的正面身份证"-->
                                        <!--class="inline ml-xs"-->
                                        <!--:multiple="true"-->
                                        <!--ref="images"-->
                                        <!--:init="two"></image-upload>-->
                                <!--</div>-->
                                <!--<div class="inline img_lazy" v-if="isAdd">-->
                                    <!--<el-popover-->
                                        <!--v-if="editData.corporation_id_contrary"-->
                                        <!--placement="right"-->
                                        <!--width="200"-->
                                        <!--trigger="hover">-->
                                    <!--</el-popover>-->
                                    <!--<image-upload-->
                                        <!--:thumbnail-mode="true"-->
                                        <!--label="上传本人的反面身份证"-->
                                        <!--class="inline ml-xs"-->
                                        <!--v-if="!notRegister"-->
                                        <!--:multiple="true"-->
                                        <!--ref="images"-->
                                        <!--:init="three"></image-upload>-->
                                <!--</div>-->
                                <!--<div class="inline" v-if="!isAdd">-->
                                    <!--<img v-lazy="`http://${editData.corporation_id_front}`" style="width:100px;height:100px"/>-->
                                    <!--<img v-lazy="`http://${editData.corporation_id_contrary}`" style="width:100px;height:100px;margin-left:30px;"/>-->
                                <!--</div>-->
                            <!--</el-form-item>-->
                            <!--<el-form-item label="信用卡：">-->
                                <!--<el-col :span="col11">-->
                                    <!--<el-input-->
                                        <!--type="text"-->
                                        <!--:disabled="notRegister"-->
                                        <!--v-model="editData.credit_card"></el-input>-->
                                <!--</el-col>-->
                            <!--</el-form-item>-->
                            <!--<el-form-item label="VAT：">-->
                            <!--<el-col :span="col11">-->
                                <!--<el-input-->
                                    <!--type="text"-->
                                    <!--:disabled="notRegister"-->
                                    <!--v-model="editData.vat_"></el-input>-->
                            <!--</el-col>-->
                        <!--</el-form-item>-->
                        <!--</el-form>-->
                    <!--</el-tab-pane>-->
                    <!--<el-tab-pane key="provider-info" name="register-info" label="注册信息" class="roll-height" >-->
                        <!--<el-form label-width="200px" :model="editData" ref="editForm">-->
                        <!--<el-row>-->
                            <!--<el-col :span="12">-->
                                <!--<el-form-item label="注册日期：" title="注册日期">-->
                                    <!--<el-date-picker-->
                                        <!--v-model="editData.register_time" :disabled="hasRegister"-->
                                        <!--:picker-options="initiateTime"-->
                                        <!--type="date"-->
                                        <!--:editable="false"-->
                                        <!--placeholder="选择日期"-->
                                        <!--class="inline date">-->
                                    <!--</el-date-picker>-->
                                <!--</el-form-item>-->
                            <!--</el-col>-->
                            <!--<el-col :span="12">-->
                                <!--<el-form-item label="注册邮箱：">-->
                                    <!--<el-col :span="col11">-->
                                        <!--<el-input v-model="editData.email" :disabled="hasRegister"></el-input>-->
                                    <!--</el-col>-->
                                <!--</el-form-item>-->
                            <!--</el-col>-->
                        <!--</el-row>-->
                        <!--<el-row>-->
                            <!--<el-col :span="12">-->
                                <!--<el-form-item label="电话号码：">-->
                                    <!--<el-col :span="col11">-->
                                        <!--<el-input v-model="editData.phone" :disabled="hasRegister"></el-input>-->
                                    <!--</el-col>-->
                                <!--</el-form-item>-->
                            <!--</el-col>-->
                            <!--<el-col :span="12">-->
                                <!--<el-form-item label="邮箱密码：">-->
                                    <!--<el-input v-model="editData.email_password"-->
                                              <!--ref="email"-->
                                              <!--type="password"-->
                                              <!--class="inline"-->
                                              <!--:disabled="isEditEmitPassword">-->
                                    <!--</el-input>-->
                                    <!--<span @mouseup="backPassword('email')"-->
                                          <!--v-if="isAdd||editData.status<=2||!isShowEmailPassword"-->
                                          <!--@mousedown="lookPassword('email')">-->
                        <!--<img src="../../../assets/eye.svg"-->
                             <!--alt=""-->
                             <!--style="vertical-align: middle;width: 20px;height: 20px;">-->
                        <!--</span>-->
                                    <!--<el-button type="primary"-->
                                               <!--size="mini"-->
                                               <!--v-else-->
                                               <!--class="ml-sm"-->
                                               <!--@click="viewPassword('email')">显示密码-->
                                    <!--</el-button>-->
                                <!--</el-form-item>-->
                            <!--</el-col>-->
                        <!--</el-row>-->
                        <!--<el-row>-->
                            <!--<el-col :span="12">-->
                                <!--<el-form-item label="公司注册号：">-->
                                    <!--<el-col :span="col11">-->
                                        <!--<el-input type="text"-->
                                                  <!--v-model="editData.company_registration_number"-->
                                                  <!--:disabled="hasRegister"></el-input>-->
                                    <!--</el-col>-->
                                <!--</el-form-item>-->
                            <!--</el-col>-->
                            <!--<el-col :span="12">-->
                                <!--<el-form-item label="帐号全称：">-->
                                    <!--<el-col :span="col11">-->
                                        <!--<el-input type="text"-->
                                                  <!--v-model="editData.account_name"-->
                                                  <!--:disabled="hasRegister"></el-input>-->
                                    <!--</el-col>-->
                                <!--</el-form-item>-->
                            <!--</el-col>-->
                        <!--</el-row>-->
                        <!--<el-row>-->
                            <!--<el-col :span="12">-->
                                <!--<el-form-item label="公司成立时间：">-->
                                    <!--<el-date-picker-->
                                        <!--v-model="editData.company_time"-->
                                        <!--:picker-options="registerTime"-->
                                        <!--:disabled="hasRegister"-->
                                        <!--:editable="false"-->
                                        <!--type="date"-->
                                        <!--placeholder="选择日期"-->
                                        <!--class="inline date">-->
                                    <!--</el-date-picker>-->
                                <!--</el-form-item>-->
                            <!--</el-col>-->
                            <!--<el-col :span="12">-->
                                <!--<el-form-item label="店铺密码：">-->
                                    <!--<el-input type="password"-->
                                              <!--ref="account"-->
                                              <!--class="inline"-->
                                              <!--v-model="editData.password"-->
                                              <!--:disabled="isEditPassword">-->
                                    <!--</el-input>-->
                                    <!--<img src="../../../assets/eye.svg"-->
                                         <!--v-if="isAdd||editData.status<=2||!isShowPassword"-->
                                         <!--@mouseup="backPassword('account')"-->
                                         <!--@mousedown="lookPassword('account')"-->
                                         <!--style="vertical-align: middle;width: 20px;height: 20px;">-->
                                    <!--<el-button type="primary"-->
                                               <!--size="mini"-->
                                               <!--class="ml-sm"-->
                                               <!--v-else-->
                                               <!--@click="viewPassword('account')">显示密码-->
                                    <!--</el-button>-->
                                <!--</el-form-item>-->
                            <!--</el-col>-->
                        <!--</el-row>-->
                        <!--<el-row>-->
                            <!--<el-col :span="12">-->
                                <!--<el-form-item label="公司地址+邮编：">-->
                                    <!--<el-col :span="col11">-->
                                        <!--<el-input type="text"-->
                                                  <!--v-model="editData.company_address" :disabled="hasRegister"></el-input>-->
                                    <!--</el-col>-->
                                <!--</el-form-item>-->
                            <!--</el-col>-->
                            <!--<el-col :span="12">-->
                                <!--<el-form-item label="收款账号：">-->
                                    <!--<el-col :span="col11" class="more-select">-->
                                        <!--<el-input type="text"-->
                                                  <!--v-model="editData.collection_account[0]"-->
                                                  <!--:disabled="hasRegister"-->
                                                  <!--v-if="!isEbay">-->
                                        <!--</el-input>-->
                                        <!--<el-select class="inline"-->
                                                   <!--:class="{inputNomargin: editData.collection_account.length > 0}"-->
                                                   <!--:disabled="hasRegister"-->
                                                   <!--v-model="editData.collection_account"-->
                                                   <!--multiple filterable-->
                                                   <!--v-if="isEbay"-->
                                                   <!--placeholder="请选择/可以多选">-->
                                            <!--<el-option-->
                                                <!--v-for="item in paypalOption"-->
                                                <!--:key="item.value"-->
                                                <!--:label="item.label"-->
                                                <!--:value="item.value">-->
                                            <!--</el-option>-->
                                        <!--</el-select>-->
                                    <!--</el-col>-->
                                <!--</el-form-item>-->
                            <!--</el-col>-->
                        <!--</el-row>-->
                        <!--<el-row>-->
                            <!--<el-col :span="12">-->
                                <!--<el-form-item label="法人身份证号：">-->
                                    <!--<el-col :span="col11">-->
                                        <!--<el-input type="text"-->
                                                  <!--v-model="editData.corporation_identification"-->
                                                  <!--:disabled="hasRegister"></el-input>-->
                                    <!--</el-col>-->
                                <!--</el-form-item>-->
                            <!--</el-col>-->
                            <!--<el-col :span="12">-->
                                <!--<el-form-item label="收款账号平台：">-->
                                    <!--<el-col :span="col11">-->
                                        <!--<el-input type="text"-->
                                                  <!--v-model="editData.collection_type"-->
                                                  <!--:disabled="hasRegister"></el-input>-->
                                    <!--</el-col>-->
                                <!--</el-form-item>-->
                            <!--</el-col>-->
                        <!--</el-row>-->
                        <!--<el-row>-->
                            <!--<el-col :span="12">-->
                                <!--<el-form-item label="法人地址+邮编：">-->
                                    <!--<el-col :span="col11">-->
                                        <!--<el-input type="text"-->
                                                  <!--v-model="editData.corporation_address"-->
                                                  <!--:disabled="hasRegister"></el-input>-->
                                    <!--</el-col>-->
                                <!--</el-form-item>-->
                            <!--</el-col>-->
                            <!--<el-col :span="12">-->
                                <!--<el-form-item label="收款账号登录邮箱：">-->
                                    <!--<el-col :span="col11">-->
                                        <!--<el-input type="text"-->
                                                  <!--v-model="editData.collection_email"-->
                                                  <!--:disabled="hasRegister"></el-input>-->
                                    <!--</el-col>-->
                                <!--</el-form-item>-->
                            <!--</el-col>-->
                        <!--</el-row>-->
                        <!--</el-form>-->
                    <!--</el-tab-pane>-->
                    <!--<el-tab-pane key="specification-info" name="examine-info" label="审核"  class="roll-height">-->
                        <!--<el-form label-width="200px" :model="editData" ref="editForm">-->
                        <!--<el-form-item label="地址账单：">-->
                            <!--<el-col :span="col11">-->
                                <!--<el-input-->
                                    <!--type="text"-->
                                    <!--:disabled="hasAudit"-->
                                    <!--v-model="editData.address_billing"></el-input>-->
                            <!--</el-col>-->
                        <!--</el-form-item>-->
                        <!--<el-form-item label="收款证明：">-->
                            <!--<el-col :span="col11">-->
                                <!--<el-input type="text" :disabled="hasAudit" v-model="editData.grant_receipt"></el-input>-->
                            <!--</el-col>-->
                        <!--</el-form-item>-->
                        <!--<el-form-item label="备注：">-->
                            <!--<el-col :span="col11">-->
                                <!--<el-input type="textarea"  :rows="2" :disabled="hasAudit" v-model="editData.reMarks"></el-input>-->
                            <!--</el-col>-->
                        <!--</el-form-item>-->
                        <!--</el-form>-->
                    <!--</el-tab-pane>-->
                    <!--<el-tab-pane key="product-attr" name="register-result" label="注册结果"  class="roll-height">-->
                        <!--<el-form label-width="200px" :model="editData" ref="editForm">-->
                        <!--<el-form-item label="完成日期：">-->
                            <!--<el-date-picker-->
                                <!--v-model="editData.fulfill_time"-->
                                <!--:disabled="hasEnrollResults"-->
                                <!--type="date"-->
                                <!--:editable="false"-->
                                <!--placeholder="选择日期"-->
                                <!--class="inline date">-->
                            <!--</el-date-picker>-->
                        <!--</el-form-item>-->
                        <!--<el-form-item label="账号简称：">-->
                            <!--<el-col :span="col11">-->
                                <!--<el-input type="text"-->
                                          <!--:disabled="hasEnrollResults"-->
                                          <!--v-model="editData.account_code">-->
                                <!--</el-input>-->
                            <!--</el-col>-->
                        <!--</el-form-item>-->
                        <!--<el-form-item label="账号ID：">-->
                            <!--<el-col :span="col11">-->
                                <!--<el-input type="text"-->
                                          <!--:disabled="hasEnrollResults"-->
                                          <!--v-model="editData.account_show_id">-->
                                <!--</el-input>-->
                            <!--</el-col>-->
                        <!--</el-form-item>-->
                        <!--</el-form>-->
                    <!--</el-tab-pane>-->
                    <!--<el-tab-pane key="remark-msg" name="remark-operation" label="分配运营"  class="roll-height">-->
                        <!--<el-form label-width="200px" :model="editData" ref="editForm">-->
                        <!--<el-form-item label="分配的运营负责人：">-->
                            <!--<el-col :span="col11">-->
                                <!--<scroll-select v-model="servicePrincipal" style="width:158px" class="inline"-->
                                               <!--textAlign="left"-->
                                               <!--:disabled="hasAssigning"-->
                                               <!--:size="20"-->
                                               <!--ref="creater"-->
                                               <!--:remote="urlServicePrincipal"-->
                                               <!--:fix-params="service_params_account"-->
                                               <!--:fixResult="fix_result_account">-->
                                <!--</scroll-select>-->
                            <!--</el-col>-->
                        <!--</el-form-item>-->
                        <!--</el-form>-->
                    <!--</el-tab-pane>-->
                <!--</el-tabs>-->
            <!--</div>-->
        <!--</div>-->
        <el-form label-width="200px" class="form-body-scroll"  :model="editData" ref="editForm">
                <div class="account-title">基本信息</div>
                <el-form-item label="发起日期：">
                    <el-date-picker
                        v-model="editData.initiate_time"
                        :editable="false"
                        type="date"
                        placeholder="选择日期"
                        :disabled="notRegister"
                        :picker-options="initiateTime"
                        class="inline date">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="负责人：">
                    <scroll-select v-model="accounts" style="width:158px" class="inline"
                                   textAlign="left"
                                   :disabled="notRegister"
                                   ref="creater"
                                   :remote="urlCreater"
                                   :fix-params="fix_params_account"
                                   :fixResult="fix_result_account">
                    </scroll-select>
                </el-form-item>
                <el-form-item label="平台：">
                    <select-remote v-model="editData.channel_id"
                                   :all="false"
                                   :disabled="notRegister"
                                   @load="load"
                                   :remote="channel_remote">
                    </select-remote>
                </el-form-item>
                <el-form-item label="站点：">
                    <el-select :disabled="siteOptions.length===0||notRegister"
                               filterable clearable
                               multiple
                               class="inline"
                               :placeholder="sitePlaceholder"
                               v-model="editData.site_code">
                        <el-option v-for="item in siteOptions"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="品类：">
                    <el-col :span="col11">
                        <el-input type="text"
                                  :disabled="notRegister"
                                  v-model="editData.breed"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="服务器：">
                    <scroll-select v-model="serverIp" style="width:200px" class="inline"
                                   textAlign="left"
                                   :disabled="notRegister"
                                   ref="ip"
                                   :remote="urlIp"
                                   :fix-params="fix_params_ip"
                                   :fixResult="fix_result_ip">
                    </scroll-select>
                    <div v-if="editData.channel_id !== 0 && alreadyBind.length > 0">
                        <span>该服务器已绑定{{channelName}}账号：</span>
                        <span v-for="(item, index) in alreadyBind"
                              :key="index"
                              class="mr-xs error">
                            {{item.account_code}}
                        </span>
                    </div>
                </el-form-item>
                <el-form-item label="服务器类型：">
                    <el-col :span="col11">
                        <el-input type="text"
                                  :disabled="notRegister"
                                  v-model="editData.server_type"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="公司名称：">
                    <el-col :span="col11">
                        <el-input type="text"
                                  :disabled="notRegister"
                                  v-model="editData.company"></el-input>
                    </el-col>
                    <div class="inline img_lazy" v-if="isAdd">
                        <el-popover
                            v-if="editData.charter_url"
                            placement="right"
                            width="200"
                            trigger="hover">
                        </el-popover>
                        <image-upload :thumbnail-mode="true"
                                      label="上传公司的营业执照"
                                      class="inline ml-xs"
                                      v-if="!notRegister"
                                      :multiple="false"
                                      ref="images"
                                      :init="file"></image-upload>
                    </div>
                    <div class="inline" v-if="!isAdd">
                        <img v-lazy="`http://${editData.charter_url}`" style="width:100px;height:100px"/>
                    </div>
                </el-form-item>
                <el-form-item label="公司类型：">
                    <el-col :span="col11">
                        <el-input type="text"
                                  :disabled="notRegister"
                                  v-model="editData.company_type"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="法人姓名：">
                    <el-col :span="col11">
                        <el-input type="text"
                                  :disabled="notRegister"
                                  v-model="editData.corporation"></el-input>
                    </el-col>
                    <div class="inline img_lazy" v-if="isAdd">
                        <el-popover
                            v-if="editData.corporation_id_front"
                            placement="right"
                            width="200"
                            trigger="hover">
                        </el-popover>
                        <image-upload
                            :thumbnail-mode="true"
                            v-if="!notRegister"
                            label="上传本人的正面身份证"
                            class="inline ml-xs"
                            :multiple="true"
                            ref="images"
                            :init="two"></image-upload>
                    </div>
                    <div class="inline img_lazy" v-if="isAdd">
                        <el-popover
                            v-if="editData.corporation_id_contrary"
                            placement="right"
                            width="200"
                            trigger="hover">
                        </el-popover>
                        <image-upload
                            :thumbnail-mode="true"
                            label="上传本人的反面身份证"
                            class="inline ml-xs"
                            v-if="!notRegister"
                            :multiple="true"
                            ref="images"
                            :init="three"></image-upload>
                    </div>
                    <div class="inline" v-if="!isAdd">
                        <img v-lazy="`http://${editData.corporation_id_front}`" style="width:100px;height:100px"/>
                        <img v-lazy="`http://${editData.corporation_id_contrary}`" style="width:100px;height:100px;margin-left:30px;"/>
                    </div>
                </el-form-item>
                <el-form-item label="信用卡：">
                    <el-col :span="col11">
                        <el-input
                            type="text"
                            :disabled="notRegister"
                            v-model="editData.credit_card"></el-input>
                    </el-col>
                </el-form-item>
                <!--<el-form-item label="VAT：">-->
                    <!--<el-col :span="col11">-->
                        <!--<el-input-->
                            <!--type="text"-->
                            <!--:disabled="notRegister"-->
                            <!--v-model="editData.vat_"></el-input>-->
                    <!--</el-col>-->
                <!--</el-form-item>-->
                <div class="account-title">注册信息</div>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="注册日期：" title="注册日期">
                            <el-date-picker
                                v-model="editData.register_time" :disabled="hasRegister"
                                :picker-options="initiateTime"
                                type="date"
                                :editable="false"
                                placeholder="选择日期"
                                class="inline date">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="注册邮箱：">
                            <el-col :span="col11">
                                <el-input v-model="editData.email" :disabled="hasRegister"></el-input>
                            </el-col>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="电话号码：">
                            <el-col :span="col11">
                                <el-input v-model="editData.phone" :disabled="hasRegister"></el-input>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="邮箱密码：">
                            <el-input v-model="editData.email_password"
                                      ref="email"
                                      type="password"
                                      class="inline"
                                      :disabled="isEditEmitPassword">
                            </el-input>
                            <span @mouseup="backPassword('email')"
                                  v-if="isAdd||editData.status<=2||!isShowEmailPassword"
                                  @mousedown="lookPassword('email')">
                        <img src="../../../assets/eye.svg"
                             alt=""
                             style="vertical-align: middle;width: 20px;height: 20px;">
                        </span>
                            <el-button type="primary"
                                       size="mini"
                                       v-else
                                       class="ml-sm"
                                       @click="viewPassword('email')">显示密码
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="公司注册号：">
                            <el-col :span="col11">
                                <el-input type="text"
                                          v-model="editData.company_registration_number"
                                          :disabled="hasRegister"></el-input>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="帐号全称：">
                            <el-col :span="col11">
                                <el-input type="text"
                                          v-model="editData.account_name"
                                          :disabled="hasRegister"></el-input>
                            </el-col>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="公司成立时间：">
                            <el-date-picker
                                v-model="editData.company_time"
                                :picker-options="registerTime"
                                :disabled="hasRegister"
                                :editable="false"
                                type="date"
                                placeholder="选择日期"
                                class="inline date">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="店铺密码：">
                            <el-input type="password"
                                      ref="account"
                                      class="inline"
                                      v-model="editData.password"
                                      :disabled="isEditPassword">
                            </el-input>
                            <img src="../../../assets/eye.svg"
                                 v-if="isAdd||editData.status<=2||!isShowPassword"
                                 @mouseup="backPassword('account')"
                                 @mousedown="lookPassword('account')"
                                 style="vertical-align: middle;width: 20px;height: 20px;">
                            <el-button type="primary"
                                       size="mini"
                                       class="ml-sm"
                                       v-else
                                       @click="viewPassword('account')">显示密码
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="公司地址+邮编：">
                            <el-col :span="col11">
                                <el-input type="text"
                                          v-model="editData.company_address" :disabled="hasRegister"></el-input>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="收款账号：">
                            <el-col :span="col11" class="more-select">
                                <el-input type="text"
                                          v-model="editData.collection_account[0]"
                                          :disabled="hasRegister"
                                          v-if="!isEbay">
                                </el-input>
                                <el-select class="inline"
                                           :class="{inputNomargin: editData.collection_account.length > 0}"
                                           :disabled="hasRegister"
                                           v-model="editData.collection_account"
                                           multiple filterable
                                           v-if="isEbay"
                                           placeholder="请选择/可以多选">
                                    <el-option
                                        v-for="item in paypalOption"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-col>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="法人身份证号：">
                            <el-col :span="col11">
                                <el-input type="text"
                                          v-model="editData.corporation_identification"
                                          :disabled="hasRegister"></el-input>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="收款账号平台：">
                            <el-col :span="col11">
                                <el-input type="text"
                                          v-model="editData.collection_type"
                                          :disabled="hasRegister"></el-input>
                            </el-col>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="法人地址+邮编：">
                            <el-col :span="col11">
                                <el-input type="text"
                                          v-model="editData.corporation_address"
                                          :disabled="hasRegister"></el-input>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="收款账号登录邮箱：">
                            <el-col :span="col11">
                                <el-input type="text"
                                          v-model="editData.collection_email"
                                          :disabled="hasRegister"></el-input>
                            </el-col>
                        </el-form-item>
                    </el-col>
                </el-row>

                <div class="account-title">审核</div>
                <el-form-item label="地址账单：">
                    <el-col :span="col11">
                        <el-input
                            type="text"
                            :disabled="hasAudit"
                            v-model="editData.address_billing"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="收款证明：">
                    <el-col :span="col11">
                        <el-input type="text" :disabled="hasAudit" v-model="editData.grant_receipt"></el-input>
                    </el-col>
                </el-form-item>
                <!--<el-form-item label="备注：">
                    <el-col :span="col11">
                        <el-input type="textarea"  :rows="2" :disabled="hasAudit" v-model="editData.reMarks"></el-input>
                    </el-col>
                </el-form-item>-->
                <div class="account-title">注册结果</div>
                    <el-form-item label="完成日期：">
                    <el-date-picker
                    v-model="editData.fulfill_time"
                    :disabled="hasEnrollResults"
                    type="date"
                    :editable="false"
                    placeholder="选择日期"
                    class="inline date">
                    </el-date-picker>
                    </el-form-item>
                    <el-form-item label="账号简称：">
                    <el-col :span="col11">
                    <el-input type="text"
                    :disabled="hasEnrollResults"
                    v-model="editData.account_code">
                    </el-input>
                    </el-col>
                    </el-form-item>
                    <el-form-item label="账号ID：">
                    <el-col :span="col11">
                    <el-input type="text"
                    :disabled="hasEnrollResults"
                    v-model="editData.account_show_id">
                    </el-input>
                    </el-col>
                    </el-form-item>
                <div class="account-title">分配运营</div>
                <el-form-item label="分配的运营负责人：">
                    <el-col :span="col11">
                        <scroll-select v-model="servicePrincipal" style="width:158px" class="inline"
                                       textAlign="left"
                                       :disabled="hasAssigning"
                                       :size="20"
                                       ref="creater"
                                       :remote="urlServicePrincipal"
                                       :fix-params="service_params_account"
                                       :fixResult="fix_result_account">
                        </scroll-select>
                    </el-col>
                </el-form-item>
            </el-form>
    </div>
            <div slot="footer">
                <!--<el-button size="mini" type="primary" v-if="activeName==='examine-info'">审核通过</el-button>-->
                <!--<el-button size="mini" type="primary" v-if="activeName==='examine-info'">审核未通过</el-button>-->
                <request-button req-key="sureKey" @click="sure" v-if="activeName!=='examine-info'">确定</request-button>
                <el-button @click.native="visible = false" size="mini" >取消</el-button>
            </div>
        </page-dialog>
        <retype-password v-model="retype_visible"
                         :retype-data="retypeData"
                         :password-url="passwordUrl"
                         @get-password="get_password">
        </retype-password>
    </div>
</template>
<style lang="stylus">
    .p-account-information{
        .p-add-product{
            padding:0;
            padding-left: 20px;
            .el-tabs.el-tabs--card{
                width: 100%;
            }
            .el-tab-pane{
                display: block;
            }

        }
        .form-header-fixed{
            position: fixed;
            width: 57%;
            background: #fff;
            z-index: 1000;
            margin-left: -9px;
            box-shadow: 0 1px 1px 0 rgba(0,0,0,0.12);
        }
        .form-body-scroll{
            padding-top:75px;
        }
        .dialog__body{
            /*max-height:770px !important;*/
        }
        .el-form-item{
            margin-bottom: 5px;
        }
        .account-title{
            height: 20px;
            line-height: 20px;
            margin-bottom: 6px;
            padding: 0 10px;
            box-shadow: 0 2px 4px 0 rgba(0,0,0,0.12);
        }
        .inputNomargin {
            .el-select__input {
                width: 1px !important;
                margin-left: 0 !important;
            }
        }
        .more-select{
            .el-select__tags {
                height: 30px !important;
                max-width: 170px !important;
                overflow-y: auto;
                overflow-x: hidden;
            }
        }
        .el-form-item__error{
            position: static;
            display: inline-block;
            line-height: 26px;
            margin-left: 10px;
        }
        .img_lazy{
            ul{
                li{
                    margin-top :0;
                }
            }
        }
        .el-select__tags{
            height: 50px!important;
            max-width: 176.6px!important;
            overflow-y: auto;
            >span{
                white-space: inherit;
            }
        }
    }
</style>
<script>
    import {api_get_channel, api_account_list} from  '../../../api/report-channel';
    import {api_get_server} from '../../../api/server-management';
    import {api_add_account, api_updata_account, api_get, api_get_already} from '../../../api/account-apply'
    import {email,chinese,phone} from '../../../define/validator_reg'
    import {mapActions,mapGetters} from 'vuex';
    import ElTabPane from "element-ui/packages/tabs/src/tab-pane";
    export default {
        data(){
            var checkEmail = (rule, value, callback) => {
                if(!value){
                    callback(new Error('请输入邮箱'));
                } else if (!email.test(value)) {
                    callback(new Error('请输入正确的邮箱'));
                } else {
                    callback();
                }
            };
            let checkChinese = (rule,value,callback)=>{
                if(value){
                    return chinese.test(value)?callback(new Error("不允许出现中文！")):callback();
                }else{
                    callback();
                }
            };
            return {
                activeName:'',
                actionName:'base-info',
                col11:11,
                channelList:[],
                channelName:'',
                siteOptions:[],
                // statusOption:[],
                paypalOption:[],
                visible: false,
                retype_visible:false,
                retypeData:{
                    type:'',
                    account_id:'',
                    password:''
                },
                urlCreater:'get|user',
                urlIp:'get|servers',
                urlServicePrincipal:'get|account-apply/user',
                passwordUrl:'get|account-apply/password',
                isShowEmailPassword:true,
                isShowPassword:true,
                oldPassword:'',
                oldEmailPassword:'',
                alreadyBind:[],
                file:[],
                two:[],
                three:[],
                statusList:[
                    {title:'新增',active:0},
                    {title:'已注册',active:1},
                    {title:'审核中',active:2},
                    {title:'注册成功',active:3},
                    {title:'已交接',active:4},
                ],
                initiateTime: {
                    disabledDate: (time)=> {
                        return time.getTime() < new Date(new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()).getTime()-1);
                    }
                },
                registerTime:{
                    disabledDate: (time)=> {
                        return time.getTime() > new Date(new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()).getTime()-1);
                    }
                }
            }
        },
        mounted(){
            this.get_paypal();
        },
        methods: {
            tab_click(val){
                this.activeName=val.name;
               /* this.action=val.name;
                if(val.name==="base-info"){

                }else if(val.name==="specification-info"){
                    this.specification_init();
                }else if(val.name==="product-attr"){
                    this.attribute_init()
                }else if(val.name==="product-desc"){
                    this.description_init()
                }else if(val.name==="provider-info"){

                }else  if(val.name==="remark-msg"){
                    this.log_init()
                }else  if(val.name==="qc-msg"){
                    this.quality_edit();
                }else  if(val.name==="product-img"){
                    this.img_init();
                }*/

            },
            verification_data(){
                if(this.editData.initiate_time===''){
                    this.$reqKey('sureKey',false);
                    this.$message({type:"warning", message:"请选择发起日期！"});
                    return false
                }
                if(this.editData.initiate_man===''||this.editData.initiate_man_name===''){
                    this.$reqKey('sureKey',false);
                    this.$message({type:"warning", message:"请选择负责人！"});
                    return false
                }
                if(this.editData.channel_id===0){
                    this.$reqKey('sureKey',false);
                    this.$message({type:"warning", message:"请选择平台！"});
                    return false
                }//site_code
                if(this.editData.channel_id===1||this.editData.channel_id===2){
                    if(this.editData.site_code.length===0){
                        this.$reqKey('sureKey',false);
                        this.$message({type:"warning", message:"请选择站点！"});
                        return false
                    }
                }
                if(this.editData.breed.trim()===''){
                    this.$reqKey('sureKey',false);
                    this.$message({type:"warning", message:"品类不能为空！"});
                    return false
                }
                if(this.editData.server_type.trim()===''){
                    this.$reqKey('sureKey',false);
                    this.$message({type:"warning", message:"服务器类型不能为空！"});
                    return false
                }
                if(this.editData.server_id===''||this.editData.server_name===''){
                    this.$reqKey('sureKey',false);
                    this.$message({type:"warning", message:"请选择服务器！"});
                    return false
                }
                if(this.editData.company.trim()===''){
                    this.$reqKey('sureKey',false);
                    this.$message({type:"warning", message:"公司名称不能为空！"});
                    return false
                }
                if(this.file.length===0&&!this.editData.charter_url){
                    this.$reqKey('sureKey',false);
                    this.$message({type:"warning", message:"请上传公司的营业执照！"});
                    return false
                }else{
                    if(this.file.length>0){
                        let size = this.file.map(row=>row.size).reduce((size,imgSize)=>size+=imgSize);
                        const MEGABYTE = 1048576;
                        if(size>MEGABYTE){
                            this.$reqKey('sureKey',false);
                            this.$message({type:'warning',message:'公司营业执照图片过大，请选择1M以内的图片！'});
                            return
                        }
                    }
                }
                if(this.editData.company_type.trim()===''){
                    this.$reqKey('sureKey',false);
                    this.$message({type:"warning", message:"请输入公司类型！"});
                    return false
                }
                if(this.editData.corporation.trim()===''){
                    this.$reqKey('sureKey',false);
                    this.$message({type:"warning", message:"请输入法人姓名！"});
                    return false
                }
                if(this.two.length===0&&!this.editData.corporation_id_front){
                    this.$reqKey('sureKey',false);
                    this.$message({type:"warning", message:"请上传本人的正面身份证！"});
                    return false
                }else{
                    if(this.two.length>0) {
                        let size = this.two.map(row => row.size).reduce((size, imgSize) => size += imgSize);
                        const MEGABYTE = 1048576;
                        if (size > MEGABYTE) {
                            this.$reqKey('sureKey', false);
                            this.$message({type: 'warning', message: '正面身份证图片过大，请选择1M以内的图片！'});
                            return
                        }
                    }
                }
                if(this.three.length===0&&!this.editData.corporation_id_contrary){
                    this.$reqKey('sureKey',false);
                    this.$message({type:"warning", message:"上传本人的反面身份证！"});
                    return false
                }else{
                    if(this.three.length>0) {
                        let size = this.three.map(row => row.size).reduce((size, imgSize) => size += imgSize);
                        const MEGABYTE = 1048576;
                        if (size > MEGABYTE) {
                            this.$reqKey('sureKey', false);
                            this.$message({type: 'warning', message: '反面身份证图片过大，请选择1M以内的图片！'});
                            return
                        }
                    }
                }
                if(!!this.editData.credit_card){
                    if(/[^\d]/.test(this.editData.credit_card.trim())){
                        this.$reqKey('sureKey',false);
                        this.$message({type:"warning", message:"请输入正确的信用卡账号！"});
                        return false
                    }else{
                        this.editData.credit_card = this.editData.credit_card.trim();
                    }
                }
                if(!this.editData.has_initiate){
                    if(!this.hasRegister){
                        if(this.editData.register_time==='') {
                            this.$reqKey('sureKey', false);
                            this.$message({type: "warning", message: "请选择注册日期！"});
                            return false
                        }
                        if(!email.test(this.editData.email)) {
                            this.$reqKey('sureKey', false);
                            this.$message({type: "warning", message: "请输正确入注册邮箱！"});
                            return false
                        }
                        if(!(phone.test(this.editData.phone)||/^\d{3,4}-?\d{7,8}$/.test(this.editData.phone))) {
                            this.$reqKey('sureKey', false);
                            this.$message({type: "warning", message: "请输入正确的电话号码！"});
                            return false
                        }
                        if(this.editData.email_password==='') {
                            this.$reqKey('sureKey', false);
                            this.$message({type: "warning", message: "请输入邮箱密码！"});
                            return false
                        }
                        if(this.editData.email_password.length<6) {
                            this.$reqKey('sureKey', false);
                            this.$message({type: "warning", message: "邮箱密码请输入6位以上！"});
                            return false
                        }
                        if(this.editData.company_registration_number.trim()==='') {
                            this.$reqKey('sureKey', false);
                            this.$message({type: "warning", message: "请输入公司注册号！"});
                            return false
                        }
                        if(this.editData.account_name.trim()==='') {
                            this.$reqKey('sureKey', false);
                            this.$message({type: "warning", message: "请输入店铺名！"});
                            return false
                        }
                        if(this.editData.company_time==='') {
                            this.$reqKey('sureKey', false);
                            this.$message({type: "warning", message: "请选择公司成立时间！"});
                            return false
                        }
                        if(this.editData.password==='') {
                            this.$reqKey('sureKey', false);
                            this.$message({type: "warning", message: "请输入店铺密码！"});
                            return false
                        }
                        if(this.editData.password.length<6) {
                            this.$reqKey('sureKey', false);
                            this.$message({type: "warning", message: "店铺密码请输入6位以上！"});
                            return false
                        }
                        if(this.editData.company_address.trim()==='') {
                            this.$reqKey('sureKey', false);
                            this.$message({type: "warning", message: "请输入公司地址和邮编！"});
                            return false
                        }
                        if(this.editData.collection_account[0]==='') {
                            this.$reqKey('sureKey', false);
                            this.$message({type: "warning", message: "请输入收款账号！"});
                            return false
                        }
                        if(this.editData.corporation_identification.trim()==='') {
                            this.$reqKey('sureKey', false);
                            this.$message({type: "warning", message: "请输入法人身份证号！"});
                            return false
                        }else{
                            if(!/^\d{15}(\d{2}[0-9Xx])?$/.test(this.editData.corporation_identification.trim())){
                                this.$reqKey('sureKey', false);
                                this.$message({type: "warning", message: "请正确输入法人身份证号！"});
                                return false
                            }else{
                                this.editData.corporation_identification = this.editData.corporation_identification.trim()
                            }
                        }
                        if(this.editData.collection_type.trim()==='') {
                            this.$reqKey('sureKey', false);
                            this.$message({type: "warning", message: "请输入收款账号平台！"});
                            return false
                        }
                        if(this.editData.corporation_address.trim()==='') {
                            this.$reqKey('sureKey', false);
                            this.$message({type: "warning", message: "请输入法人地址+邮编！"});
                            return false
                        }
                        if(!email.test(this.editData.collection_email)) {
                            this.$reqKey('sureKey', false);
                            this.$message({type: "warning", message: "请输入正确收款账号登录邮箱！"});
                            return false
                        }
                    }
                    if(!this.hasEnrollResults){
                        if(this.editData.fulfill_time==='') {
                            this.$reqKey('sureKey', false);
                            this.$message({type: "warning", message: "请选择完成日期！"});
                            return false
                        }
                        if(this.editData.account_code==='') {
                            this.$reqKey('sureKey', false);
                            this.$message({type: "warning", message: "请输入账号简称！"});
                            return false
                        }
                        if(this.editData.account_show_id==='') {
                            this.$reqKey('sureKey', false);
                            this.$message({type: "warning", message: "请输入账号ID！"});
                            return false
                        }
                    }
                    if(!this.hasAssigning){
                        if(this.editData.use_account_name===''||this.editData.use_account_id==='') {
                            this.$reqKey('sureKey', false);
                            this.$message({type: "warning", message: "请选择分配的运营负责人！"});
                            return false
                        }
                    }
                }
                return true
            },
            statusType(item){
                if(this.editData.status===0&&item.active===0){
                    return 'process'
                }else{
                    if(item.active<this.editData.status){
                        return 'success';
                    }else if(item.active===this.editData.status){
                        switch (this.editData.type_status) {
                            case '':
                                return '';
                                break
                            case 0:
                                if(this.editData.status===3){
                                    item.title = '注册失败'
                                }
                                return 'error';
                                break
                            case 1:
                                return 'process';
                                break
                        }
                    }else{
                        return ''
                    }
                }
            },
            open(){
                this.file = [];
                this.two = [];
                this.three = [];
                this.isShowPassword = true;
                this.isShowEmailPassword = true;
                this.oldPassword = window.clone(this.editData.password);
                this.oldEmailPassword = window.clone(this.editData.email_password);
                if(this.editData.channel_id===1||this.editData.channel_id===2){
                    this.get_site(this.editData.channel_id);
                }
            },
            channel_remote(callback){
                return this.$http(api_get_channel,{}).then(res=>{
                    callback(res);
                }).catch(code=>{
                    console.log(code);
                });
            },
            load(list){
                this.channelList = list;
            },
            get_site(channel_id){
                this.$http(api_account_list,{channel_id:channel_id}).then(res=>{
                    if(res.site.length===0){
                        this.siteOptions = []
                    }else{
                        res = res.site;
                        this.siteOptions = [...res];
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            get_paypal(){
                let param = {
                    page: 1,
                    pageSize: 1000,
                    is_invalid:0,
                    snType:'account_name',
                    snDate:'create_date'
                };
                this.$http(api_get, param).then(res=>{
                    this.paypalOption = res.data.map(row=>{
                        return {
                            label:row.account_name,
                            value:row.id
                        }
                    });
                }).catch(code=>{
                    console.log(code);
                })
            },
            lookPassword(type){
                this.$refs[type].$refs.input.type = 'text';
            },
            backPassword(type){
                this.$refs[type].$refs.input.type = 'password';
            },
            viewPassword(type){
                if(!this.isAdd||this.editData.status>1){
                    this.retypeData = {
                        account_id: this.editData.id,
                        type:type
                    };
                    this.retype_visible = true;
                }
            },
            transferTime(param, timeName){
                let data = clone(param);
                if(this.action.value === 'add'){
                    if(data[timeName]){
                        data[timeName]=datef('YYYY-MM-dd', param[timeName].getTime()/1000);
                    }else {
                        data[timeName]='';
                    }
                } else {
                    if(data[timeName]){
                        data[timeName]=datef('YYYY-MM-dd', param[timeName]/1000);
                    }else {
                        data[timeName]='';
                    }
                }
                return data[timeName];
            },
            //账号参数
            fix_params_account({page,pageSize,keyword}){
                return {
                    page:page,
                    pageSize:pageSize,
                    snType:"department_id",
                    snText:333,
                    status:1
                };
            },
            service_params_account(params){
                return {
                    page:params.page,
                    pageSize:params.pageSize,
                    snType:'realname',
                    snText:params.keyword?params.keyword:''
                }
            },
            //账号结果
            fix_result_account(res){
                return {
                    options: res.data.map(row => {
                        return {
                            label: row.realname,
                            value: row.id
                        }
                    }),
                    page: res.page,
                    count: res.count,
                }
            },
            fix_params_ip({page,pageSize,keyword}){
                return {
                    page:page,
                    pageSize:pageSize,
                    name:keyword||"",
                };
            },
            fix_result_ip(res){
                return {
                    options: res.data.map(row => {
                        return {
                            label:`${row.ip}(${row.name})`,
                            value: row.id
                        }
                    }),
                    page: res.page,
                    count: res.count,
                }
            },
            sure(){
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        if(!this.verification_data()){
                            this.$reqKey('sureKey',false);
                            return
                        }
                        let data = clone(this.editData);
                        if(this.file.length===0){
                            this.editData.charter_url&&(delete data.charter_url)
                        }else{
                            data.charter_url=this.file[0].image
                        }
                        if(this.two.length===0){
                            this.editData.corporation_id_front&&(delete data.corporation_id_front)
                        }else{
                            data.corporation_id_front=this.two[0].image
                        }
                        if(this.three.length===0){
                            this.editData.corporation_id_contrary&&(delete data.corporation_id_contrary)
                        }else{
                            data.corporation_id_contrary=this.three[0].image
                        }
                        this.editData.site_code.length>0?(data.site_code = data.site_code.join(',')):(data.site_code = '');
                        delete data.id;
                        data.initiate_time = this.transferTime(this.editData, 'initiate_time');
                        data.register_time = this.transferTime(this.editData,'register_time');
                        data.company_time = this.transferTime(this.editData, 'company_time');
                        data.fulfill_time = this.transferTime(this.editData, 'fulfill_time');
                        if(this.action.value === 'add'){
                            this.$http(api_add_account, data).then(res=>{
                                this.$emit('submit',res);
                                this.$message({type:"success",message:res.message||res});
                                this.visible = false;
                            }).catch(code=>{
                                this.$message({type:"error",message:code.message || code});
                            }).finally(()=>{
                                setTimeout(() => {
                                    this.$reqKey('sureKey', false);
                                }, 300)
                            })
                        } else {
                            if(data.password === this.oldPassword){
                                delete data.password;
                            }
                            if(data.email_password === this.oldEmailPassword){
                                delete data.email_password;
                            }
                            this.$http(api_updata_account, this.editData.id, data).then(res=>{
                                this.$emit('submit',res,this.editData.id);
                                this.$message({type:"success",message:res.message||res});
                                this.visible = false;
                            }).catch(code=>{
                                this.$message({type:"error",message:code.message || code});
                            }).finally(()=>{
                                setTimeout(() => {
                                    this.$reqKey('sureKey', false);
                                }, 300)
                            })
                        }
                    } else {
                        this.$reqKey('sureKey',false);
                        this.$message({type:"error", message:"信息未填写完整！"});
                    }
                });
            },
            get_password(password, type){
                this.$refs[type].$refs.input.type = 'text';
                if(type === 'account'){
                    this.isShowPassword = false;
                    this.editData.password = password;
                } else {
                    this.isShowEmailPassword = false;
                    this.editData.email_password = password;
                }
            },
            get_alreadyBind(){
                if(!!this.editData.server_id && this.editData.channel_id !== 0){
                    let data = {
                        channel_id:this.editData.channel_id,
                        server_id:this.editData.server_id
                    };
                    this.$http(api_get_already, data).then(res=>{
                        this.alreadyBind = res;
                        this.channelList.find(row=>{
                            if(row.value === this.editData.channel_id){
                                this.channelName = row.label;
                            }
                        })
                    }).catch(code=>{
                        this.$message({type:"error",message:code.message || code});
                    })
                }
            }
        },
        computed: {
            notRegister(){
                return !this.editData.has_initiate
            },
            hasRegister(){
                if(this.action.value==='add'){
                    return false
                }else{
                    if(this.editData.has_initiate){
                        return false
                    }else{
                        return this.editData.status===0
                    }
                }
            },
            isEditPassword(){
                if(this.isShowPassword){
                    return this.hasRegister||this.editData.status>2
                }else{
                    return this.isShowPassword
                }
            },
            isEditEmitPassword(){
                if(this.isShowEmailPassword){
                    return this.hasRegister||this.editData.status>2
                }else{
                    return this.isShowEmailPassword
                }
            },
            hasAudit(){
                if(this.action.value==='add'){
                    return false
                }else{
                    if(this.editData.has_initiate){
                        return false
                    }else{
                        return this.editData.status<=1
                    }
                }
            },
            hasEnrollResults(){
                if(this.action.value==='add'){
                    return false
                }else{
                    if(this.editData.has_initiate){
                        return false
                    }else{
                        return this.editData.status<=2
                    }
                }
            },
            hasAssigning(){
                if(this.action.value==='add'){
                    return false
                }else{
                    if(this.editData.has_initiate){
                        return false
                    }else{
                        return this.editData.status<=3
                    }
                }
            },
            sitePlaceholder(){
                if(this.editData.site_code.length>0){
                    return "";
                }else if(this.siteOptions.length===0){
                    return "该平台下暂无站点";
                }else{
                    return "请选择站点"
                }
            },
            isEbay(){
                if(!this.editData.collection_account){
                    this.editData.collection_account[0] = '';
                }
                return this.editData.channel_id === 1;
            },
            isAdd(){
                return this.action.value === 'add';
            },
            accounts:{
                get(){
                    return {label:this.editData.initiate_man_name,
                        value:this.editData.initiate_man}
                },
                set(val){
                    this.editData.initiate_man_name = val.label;
                    this.editData.initiate_man = val.value;
                }
            },
            servicePrincipal:{
                get(){
                    return {label:this.editData.use_account_name,
                        value:this.editData.use_account_id}
                },
                set(val){
                    this.editData.use_account_name = val.label;
                    this.editData.use_account_id = val.value;
                }
            },
            serverIp:{
                get(){
                    return {label:this.editData.server_name,
                        value:this.editData.server_id}
                },
                set(val){
                    this.editData.server_name = val.label;
                    this.editData.server_id = val.value;
                }
            }
        },
        watch: {
            visible(val){
                this.$emit('input',val);
            },
            value(val) {
                this.visible = val;
            },
            "editData.channel_id"(val){
                if(val===1||val===2){
                    this.get_site(val);
                }else{
                    this.siteOptions = [];
                    this.editData.site_code = [];
                }
                this.get_alreadyBind();
            },
            'editData.server_id'(val){
                this.get_alreadyBind();
            }
        },
        props: {
            value:{},
            action:{},
            editData:{
                required:true,
                type:Object,
            },
            searchData:{}
        },
        components: {
            ElTabPane,
            pageDialog:require("../../../components/page-dialog.vue").default,
            selectRemote:require('../../../components/select-remote.vue').default,
            retypePassword:require('./retype-password.vue').default,
            scrollSelect:require('../../../components/scroll-select.vue').default,
            requestButton:require('../../../global-components/request-button').default,
            imageUpload:require("../../customer-service/smt/inbox/image-upload.vue").default,
        },
    }
</script>
