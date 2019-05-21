<template>
    <div class="p-paypal-reques">
        <el-card v-loading="uploading" style="border: 0;">
            <page>
                <div class="box-attr">
                    <div class="attr-now">
                        <div class="label_">纠纷ID：</div>
                        <div class="detail_">{{disputeData.dispute_id}}</div>
                    </div>
                    <div class="attr-now">
                        <div class="label_">发起时间：</div>
                        <div class="detail_">{{disputeData.dispute_create_time|fdateTime}}</div>
                    </div>
                    <div class="attr-now">
                        <div class="label_">买家纠纷提起原因：</div>
                        <div class="detail_">{{disputeData.reason_text}}</div>
                    </div>
                    <div class="attr-now">
                        <div class="label_">纠纷状态：</div>
                        <div class="detail_">{{disputeData.status_text}}</div>
                    </div>
                </div>

                <!--您的回复-->
                <!--<div class="mt-xs" v-if="disputeData.doc.length>0">-->
                    <!--<div class="tabs-label ml-xs">您的回复</div>-->
                    <!--<div class="box-attr">-->
                        <!--<div class="attr-now" v-for="(item,index) in disputeData.doc" :key="index">-->
                            <!--<div class="label_">新增日期：</div>-->
                            <!--<div class="detail_">-->
                                <!--{{item.update_time | fdateTime}}-->
                            <!--</div>-->
                            <!--<div class="label_">调解方案：</div>-->
                            <!--<div class="detail_">-->
                                <!--{{item.evidence_type_text}}-->
                            <!--</div>-->
                        <!--</div>-->
                    <!--</div>-->
                <!--</div>-->

                <!--您与买家的对话-->
                <div class="mt-xs" v-if="disputeData.message.length>0">
                    <div class="tabs-label ml-xs">您与买家的对话</div>
                    <div class="box-attr">
                        <div class="attr-now" v-for="(item,index) in disputeData.message" :key="index">
                            <div class="label_">{{item.posted_by | posterFilter}}：</div>
                            <div class="detail_">
                                <div>{{item.content}}</div>
                                <div>{{item.time_posted}}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!--档案  只有在paypal审核中未经权限存取中才有-->
                <div class="mt-xs" v-if="paypal_audit && reason_unauthorized">
                    <div class="tabs-label ml-xs">档案</div>
                    <div class="box-attr">
                        【<span @click="isAddArchives = true" style="color: deepskyblue">新增</span>】
                        <div v-if="isAddArchives">
                            <h2>将你的资料传送至Paypal</h2>
                            <div class="mt-xs">
                                <label>选择档案：</label>
                                <file-upload
                                        :thumbnail-mode="true"
                                        label="上传附件"
                                        class="inline"
                                        :multiple="false"
                                        @handle-change="handle_change"
                                        :image="{width:'100px',height:'100px'}"
                                        ref="images"
                                        :init="file" ></file-upload>
                                <span class="ml-sm red">支持格式：GIF、JPG、PNG或PDF 档案</span>
                            </div>
                            <div class="mt-xs">
                                <label>类型：</label>
                                <el-select v-model="archivesType"
                                           class="s-width-large inline"
                                           @change="select_archives_type">
                                    <el-option v-for="item in archivesTypeGroup"
                                               :key="item.value"
                                               :value="item.value"
                                               :label="item.label"></el-option>
                                </el-select>
                            </div>
                            <div class="mt-xs">
                                <label>说明：</label>
                                <el-input type="textarea" :rows="5" v-model="archivesNote"></el-input>
                            </div>
                            <el-button type="primary" @click.native="add_archives" class="mt-xs">确定上传</el-button>
                        </div>
                        <!--已上传的档案(paypal审查中提交的档案)-->
                        <div v-if="disputeData.evidences.length > 0">
                            <div>已上传的文件</div>
                            <el-table
                                    class="scroll-bar"
                                    :data="disputeData.evidences"
                                    border
                                    height="200"
                                    highlight-current-row>
                                <el-table-column label="发送时间" width="80" show-overflow-tooltip inline-template>
                                    <div>{{row.date}}</div>
                                </el-table-column>
                                <el-table-column label="档案类型" inline-template show-overflow-tooltip width="145">
                                    <div>{{row.evidence_type}}</div>
                                </el-table-column>
                                <el-table-column label="文件名" inline-template>
                                    <div>
                                        <div>{{row.note}}</div>
                                    </div>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </div>

                <!--操作日志-->
                <div class="mt-xs">
                    <div class="tabs-label ml-xs">操作日志</div>
                    <el-table
                            class="scroll-bar"
                            :data="disputeData.record"
                            border
                            height="200"
                            highlight-current-row>
                        <el-table-column label="操作人" width="80" show-overflow-tooltip inline-template>
                            <ui-tip :content="row.operator"></ui-tip>
                        </el-table-column>
                        <el-table-column label="操作时间" inline-template show-overflow-tooltip width="145">
                            <div>{{row.update_time|fdateTime}}</div>
                        </el-table-column>
                        <el-table-column label="操作内容" inline-template>
                            <div>
                                <div>{{row.operate_type}}</div>
                            </div>
                        </el-table-column>
                        <el-table-column label="执行状态" inline-template show-overflow-tooltip>
                            <div>
                                <span>{{row.status | statusFilter}}</span>
                                <span>{{row.error_message | messageFilter}}</span>
                            </div>
                        </el-table-column>
                    </el-table>
                </div>

                <!--回复-->
                <div class="mt-xs" v-if="isEditIssue&&disputeData.operation.length>0">
                    <div class="tabs-label ml-xs">回复</div>
                    <div class="box-regues">
                        <el-radio-group v-model="radioValue" @change="change_radio">
                            <!--需要回复: 未收到物品 未授权 重复交易-->
                            <div v-if="need_reply && (reason_unauthorized || reason_not_received || reason_repeat)">
                                <el-radio class="radio" label="refundEnd" v-if="acceptClaim">我会退款给买家，并且结束此纠纷</el-radio>
                                <el-radio class="radio" label="goodsAndService" v-if="provideEvidence">我已运送商品或提供服务</el-radio>
                                <el-radio class="radio" label="refunded" v-if="provideEvidence">我已退款</el-radio>
                            </div>
                            <!--需要回复: 说明不符-->
                            <div v-if="need_reply && reason_describe_error">
                                <el-radio class="radio" label="refundEnd" v-if="acceptClaim">我将发放全额退款，买家可以保留物品</el-radio>
                                <el-radio class="radio" label="refundAll2" v-if="acceptClaim">我将发放全额退款，买家必须退还物品</el-radio>
                                <el-radio class="radio" label="refundPart" v-if="acceptClaim">我将发放部分退款</el-radio>
                                <el-radio class="radio" label="refunded" v-if="provideEvidence">我已经发放了退款</el-radio>
                                <el-radio class="radio" label="disagree" v-if="provideEvidence">我不同意补偿申请，我想提交其他信息</el-radio>
                            </div>
                            <!--等待买家回复: 说明不符-->
                            <div v-if="wait_buyer_reply && reason_describe_error">
                                <el-radio class="radio" label="submitFile" v-if="provideEvidence">提交证明文件</el-radio>
                            </div>
                            <!--买家讯息: 未收到物品-->
                            <div v-if="message_from_buyer && reason_not_received">
                                <el-radio class="radio" label="sendMsg" v-if="sendMessage">向买家发送讯息</el-radio>
                                <el-radio class="radio" label="refundEnd" v-if="acceptClaim">提供全额退款</el-radio>
                            </div>
                            <!--买家讯息: 说明不符-->
                            <div v-if="message_from_buyer && reason_describe_error">
                                <el-radio class="radio" label="sendMsg" v-if="sendMessage">向买家发送讯息</el-radio>
                                <el-radio class="radio" label="refundEnd" v-if="acceptClaim">退款并关闭</el-radio>
                                <el-radio class="radio" label="sendPlan" v-if="makeOffer">传送调解方案</el-radio>
                            </div>
                            <!--paypal审查中: 已取消订单但是仍被收取费用-->
                            <div v-if="paypal_audit && reason_cancel">
                                <el-radio class="radio" label="refundEnd" v-if="acceptClaim">退款给买家</el-radio>
                            </div>
                        </el-radio-group>
                    </div>
                    <!--提交证明文件（等待买家回复说明不符情况）-->
                    <div class="regues-detail" v-if="radioValue === 'submitFile'">
                        <div class="ml-sm">
                            <h2>提交证明文件</h2>
                            <div class="mb-sm">注意：你可以提交有助我们解决你纠纷的任何资料</div>
                            <div class="mb-sm">
                                <label>选择文件：</label>
                                <file-upload
                                        :thumbnail-mode="true"
                                        label="上传附件"
                                        class="inline"
                                        @handle-change="handle_change"
                                        :multiple="false"
                                        :image="{width:'100px',height:'100px'}"
                                        ref="images"
                                        :init="file" ></file-upload>
                                <span class="ml-sm red">支持格式：GIF、JPG、PNG、PDF </span>
                            </div>
                            <el-button type="primary" @click.native="submit_evidence(5)">提交</el-button>
                        </div>
                    </div>
                    <!--发放全额退款，买家可以保留物品/退款并关闭/我会退款给买家，并结束此纠纷-->
                    <div class="regues-detail" v-if="radioValue === 'refundEnd'">
                        <div class="ml-sm">
                            <h2>退款给买家</h2>
                            <div class="mb-sm">注意：我们会从您的Paypal余额中扣除争议金额，并结束此事件</div>
                            <div class="mb-sm">
                                <span class="mr-lg">您需要退还的金额</span>
                                <span style="font-weight: bold">{{disputeData.currency}} {{disputeData.dispute_amount}}</span>
                            </div>
                            <div class="mb-sm">
                                <span class="mr-lg">Paypal需要退还的费用</span>
                                <span style="font-weight: bold">{{disputeData.currency}} 0</span>
                            </div>
                            <div class="mb-sm">
                                <span class="mr-lg">退款总额</span>
                                <span style="font-weight: bold">{{disputeData.currency}} {{disputeData.dispute_amount}}</span>
                            </div>
                            <el-button type="primary" @click.native="issue_refund(1)">发放退款</el-button>
                        </div>
                    </div>
                    <!--发放全额退款，买家必须退还物品-->
                    <div class="regues-detail" v-if="radioValue === 'refundAll2'">
                        <div class="ml-sm">
                            <h2>退款给买家</h2>
                            <div class="mb-sm">注意：争议金额将从您的Paypal余额中退还</div>
                            <div class="mb-sm">提示：物品退回后，我们会立即处理退款</div>
                            <div class="mb-sm">
                                <label>退货地址：</label>
                                <el-select v-model="returnAddress"
                                           class="inline"
                                           style="width: 300px"
                                           @change="select_address">
                                    <el-option v-for="item in addressGroup"
                                               :key="item.value"
                                               :value="item.value"
                                               :label="item.label"></el-option>
                                </el-select>
                                <el-button type="text" @click.native="showDialog = true">添加地址</el-button>
                            </div>
                            <div class="mb-sm">
                                <span class="mr-lg">您需要退还的金额</span>
                                <span style="font-weight: bold">{{disputeData.currency}} {{disputeData.dispute_amount}}</span>
                            </div>
                            <div class="mb-sm">
                                <span class="mr-lg">Paypal需要退还的费用</span>
                                <span style="font-weight: bold">{{disputeData.currency}} 0</span>
                            </div>
                            <div class="mb-sm">
                                <span class="mr-lg">退款总额</span>
                                <span style="font-weight: bold">{{disputeData.currency}} {{disputeData.dispute_amount}}</span>
                            </div>
                            <el-button type="primary" @click.native="issue_refund(2)">发放退款</el-button>
                        </div>
                    </div>
                    <!--发放部分退款-->
                    <div class="regues-detail" v-if="radioValue === 'refundPart'">
                        <div class="ml-sm">
                            <h2>输入部分退款金额</h2>
                            <div class="mb-sm">
                                <label>退款金额：</label>
                                <el-input type="number"
                                          v-model="refundPartAmount"
                                          class="inline"
                                          min="0"></el-input>
                                <span>{{disputeData.currency}}</span>
                                <span class="ml-sm">不可高于：{{disputeData.dispute_amount}}{{disputeData.currency}}</span>
                            </div>
                            <div class="mb-sm">
                                退款详情：您输入的退款金额将于买家要求的金额进行对照。
                                如果金额一致，补偿申请将自动结束。
                                如果您提供的部分退款低于买家的要求，买家可以
                                选择接受或拒绝您的提议。
                            </div>
                            <div class="mb-sm">
                                <div class="mb-xs">请选择您的退货地址</div>
                                <el-select v-model="returnAddress"
                                           class="s-width-large"
                                           @change="select_address">
                                    <el-option v-for="item in addressGroup"
                                               :key="item.value"
                                               :value="item.value"
                                               :label="item.label"></el-option>
                                </el-select>
                                <el-button type="text" @click.native="showDialog = true">添加地址</el-button>
                            </div>
                            <div class="mb-sm">
                                <label>备注：</label>
                                <el-input type="textarea" :rows="5" v-model="remark"></el-input>
                            </div>
                            <el-button type="primary" @click.native="issue_refund(3)">发放退款</el-button>
                        </div>
                    </div>
                    <!--我已发放退款-->
                    <div class="regues-detail" v-if="radioValue === 'refunded'">
                        <div class="ml-sm">
                            <div class="mt-xs">
                                <label style="font-weight: bold">请选择您的退款方式：</label>
                                <el-select v-model="refundWay"
                                           class="inline"
                                           style="width: 220px"
                                           @change="select_refund_way">
                                    <el-option v-for="item in refundWayGroup"
                                               :key="item.value"
                                               :value="item.value"
                                               :label="item.label"></el-option>
                                </el-select>
                            </div>
                            <div v-if="refundWay === 1">
                                <h2>搜索已退款的交易</h2>
                                <div>
                                    <label>退款日期：</label>
                                    <el-date-picker
                                            type="date"
                                            placeholder="开始时间"
                                            v-model="searchRefundData.startDate"
                                            :picker-options="pickerstart"
                                            class="inline date"></el-date-picker>
                                    <span>&nbsp;--&nbsp;</span>
                                    <el-date-picker
                                            type="date"
                                            placeholder="结束时间"
                                            v-model="searchRefundData.endDate"
                                            :picker-options="pickerend"
                                            class="inline date"></el-date-picker>
                                    <el-button class="inline ml-sm" type="primary" size="mini" @click.native="get_refunded_order">搜索</el-button>
                                </div>
                                <div>
                                    <h3>所有账户活动</h3>
                                    <el-table
                                            class="mb-sm scroll-bar"
                                            v-resize="{height:41}"
                                            :data="refundOrderGroup"
                                            height="250"
                                            border
                                            highlight-current-row
                                            v-loading="tableLoading"
                                            element-loading-text="拼命加载中"
                                            @selection-change="handle_selection_change">
                                        <el-table-column
                                                type="selection"
                                                width="50">
                                        </el-table-column>
                                        <el-table-column label="退款日期" prop="payment_date"></el-table-column>
                                        <el-table-column label="收款人邮箱" prop="receiver_email"></el-table-column>
                                        <el-table-column label="退款金额" inline-template>
                                            <span>{{row.amt}}{{row.currency}}</span>
                                        </el-table-column>
                                    </el-table>
                                    <el-button type="primary" v-if="refundOrderGroup.length > 0" size="mini" @click.native="submit_evidence(1)">提交</el-button>
                                </div>
                            </div>
                            <div v-if="refundWay === 2">
                                <h2>提交证明文件</h2>
                                <div>您应提交收据，或者其他显示出退还给买家金额的资料</div>
                                <div class="mt-sm mb-sm">
                                    <label>选择文件：</label>
                                    <file-upload
                                            :thumbnail-mode="true"
                                            label="上传附件"
                                            class="inline"
                                            :multiple="false"
                                            @handle-change="handle_change"
                                            :image="{width:'100px',height:'100px'}"
                                            ref="images"
                                            :init="file" ></file-upload>
                                    <span class="ml-sm red">支持格式：GIF、JPG、PNG、PDF </span>
                                </div>
                                <div class="mb-sm">
                                    <label>备注：</label>
                                    <el-input type="textarea" :rows="5" v-model="remark"></el-input>
                                </div>
                                <el-button type="primary" size="mini" @click.native="submit_evidence(2)">提交</el-button>
                            </div>
                        </div>
                    </div>
                    <!--我已运送商品和提供服务(未收到物品和未授权的处理方式有点不一样)-->
                    <div class="regues-detail" v-if="radioValue === 'goodsAndService'">
                        <div class="ml-sm">
                            <div class="mt-sm" v-if="reason_unauthorized">
                                <label>请选择运送的商品或提供的服务：</label>
                                <el-select v-model="evidence"
                                           class="inline"
                                           style="width: 300px"
                                           @change="select_service">
                                    <el-option v-for="item in evidenceType"
                                               :key="item.value"
                                               :value="item.value"
                                               :label="item.label"></el-option>
                                </el-select>
                            </div>
                            <div class="mb-sm">
                                <h2 v-if="reason_not_received || reason_repeat">提交追踪资料</h2>
                                <h2 v-else>{{evidence | evidenceFilter}}</h2>
                                <div class="mt-sm mb-sm">
                                    <span v-if="reason_unauthorized">
                                        提示：{{evidence === 1 ? '请告诉我们所收到商品的状态。我们会审核此资料，判断此个案是否符合（卖家交易安全保障）的资格' : '请提供你手上可协助解决问题的资料'}}
                                    </span>
                                    <span v-if="reason_not_received || reason_repeat">
                                        提示：为协助我们尽快解决此次索偿，您可以提供商品的追踪资料。您可以提供最多5个追踪编号和货运公司名称。
                                    </span>
                                </div>
                                <div v-if="evidence === 1 || reason_not_received || reason_repeat">
                                    <div v-for="(obj,index) in trackData" :key="index" class="mb-xs">
                                        <el-input type="text"
                                                  placeholder="请输入追踪编号"
                                                  v-model="obj.tracking_number"
                                                  class="inline"></el-input>
                                        <el-select v-model="obj.shipping_type"
                                                   placeholder="请选择运输方式"
                                                   class="inline"
                                                   filterable
                                                   clearable
                                                   default-first-option
                                                   style="width: 300px">
                                            <el-option v-for="item in shippingTypeGroup"
                                                       :key="item.value"
                                                       :value="item.value"
                                                       :label="item.label"></el-option>
                                        </el-select>
                                        <el-button type="danger"
                                                   size="mini"
                                                   class="inline"
                                                   @click.native="delete_track(index)"
                                                   v-if="(reason_not_received || reason_repeat)&&trackData.length !== 1">删除</el-button>
                                        <el-button type="primary"
                                                   size="mini"
                                                   class="inline"
                                                   @click.native="add_track"
                                                   v-if="(reason_not_received || reason_repeat)&&index === trackData.length-1"
                                                   :disabled="trackData.length >= 5">添加</el-button>
                                    </div>
                                </div>
                                <div class="mt-sm mb-sm">
                                    <span>加入证明文件：</span>
                                    <file-upload
                                            :thumbnail-mode="true"
                                            label="上传附件"
                                            class="inline"
                                            :multiple="false"
                                            @handle-change="handle_change"
                                            :image="{width:'100px',height:'100px'}"
                                            ref="images"
                                            :init="file" ></file-upload>
                                </div>
                                <div class="mb-sm">
                                    <label>备注：</label>
                                    <el-input type="textarea" :rows="5" v-model="remark"></el-input>
                                </div>
                                <el-button type="primary" size="mini" @click.native="submit_evidence(reason_not_received ? 3 : 4)">提交</el-button>
                            </div>
                        </div>
                    </div>
                    <!--我不同意补偿申请，我想提交其他信息-->
                    <div class="regues-detail" v-if="radioValue === 'disagree'">
                        <div class="ml-sm">
                            <h2>提供更多资料</h2>
                            <div class="mb-sm">如果您对买家的索偿完全或部分不同意，您可以提供更多资料，分别处理各个问题。</div>
                            <div class="mb-sm">
                                <label>选择文件：</label>
                                <file-upload
                                        :thumbnail-mode="true"
                                        label="上传附件"
                                        class="inline"
                                        :multiple="false"
                                        @handle-change="handle_change"
                                        :image="{width:'100px',height:'100px'}"
                                        ref="images"
                                        :init="file" ></file-upload>
                                <span class="ml-sm red">支持格式：GIF、JPG、PNG、PDF </span>
                            </div>
                            <div class="mb-sm">
                                <div class="mb-xs">请选择您的退货地址</div>
                                <el-select v-model="returnAddress"
                                           class="s-width-large"
                                           @change="select_address">
                                    <el-option v-for="item in addressGroup"
                                               :key="item.value"
                                               :value="item.value"
                                               :label="item.label"></el-option>
                                </el-select>
                                <el-button type="text" @click.native="showDialog = true">添加地址</el-button>
                            </div>
                            <div class="mb-sm">
                                <label>备注：</label>
                                <el-input type="textarea" :rows="5" v-model="remark"></el-input>
                            </div>
                            <el-button type="primary" @click.native="submit_evidence(6)">提交</el-button>
                        </div>
                    </div>
                    <!--向买家发送信息-->
                    <div class="regues-detail" v-if="radioValue === 'sendMsg'">
                        <div class="ml-sm">
                            <h2>{{disputeData.buyer_name}}：你好</h2>
                            <div class="mb-sm">
                                <el-input type="textarea" v-model="message" :rows="5" placeholder="向买家发送友好讯息"></el-input>
                            </div>
                            <el-button type="primary" class="inline" @click.native="send_message">寄出</el-button>
                        </div>
                    </div>
                    <!--传送调解方案-->
                    <div class="regues-detail" v-if="radioValue === 'sendPlan'">
                        <div class="ml-sm">
                            <div class="mt-sm">
                                <label>调解方案：</label>
                                <el-select v-model="plan"
                                           class="inline"
                                           style="width: 300px"
                                           @change="select_plan">
                                    <el-option v-for="item in planGroup"
                                               :key="item.value"
                                               :value="item.value"
                                               :label="item.label"></el-option>
                                </el-select>
                            </div>
                            <div class="mb-sm">
                                <h2>{{plan | planFilter}}</h2>
                                <div v-if="plan === 4" class="mt-sm">
                                    你提议向买家发送替换品而无需退还原本的物品
                                </div>
                                <div v-else>
                                    <label>退款金额：</label>
                                    <el-input type="number"
                                              v-model="planRefundAmount"
                                              class="inline"
                                              min="0"></el-input>
                                    <span>{{disputeData.currency}}</span>
                                    <span style="color: gray;" class="ml-sm">不填金额退全款，填写金额退部分</span>
                                </div>
                                <div class="mt-sm" v-if="plan === 2">
                                    <label>退货地址：</label>
                                    <el-select v-model="returnAddress"
                                               class="inline"
                                               style="width: 300px"
                                               @change="select_address">
                                        <el-option v-for="item in addressGroup"
                                                   :key="item.value"
                                                   :value="item.value"
                                                   :label="item.label"></el-option>
                                    </el-select>
                                </div>
                                <div class="mt-sm mb-sm">
                                    <label>备注：</label>
                                    <el-input type="textarea" :rows="4" v-model="planRemark"></el-input>
                                </div>
                                <el-button type="primary" @click.native="transfer_plan">传送调解方案</el-button>
                            </div>
                        </div>
                    </div>
                </div>
                <add-address v-model="showDialog" @add-address="add_address"></add-address>
            </page>
        </el-card>
    </div>
</template>

<style lang="stylus">
    .p-paypal-reques {

        table.template td, .el-table td, table.template th, .el-table th {
            padding: 0;
        }

        .el-card__body {
            padding: 0;
        }
        .tabs-label {
            font-weight: bold;
        }
        .box-attr {
            margin-bottom: 10px;
            border: 1px solid #BDCDDC;
            padding: 8px;
            box-sizing: border-box;
            .attr-now {
                display: flex;
                align-items: center;
                padding: 5px;
                .label_ {
                    display: inline-block;
                    width: 110px;
                    text-align: right;
                    font-weight: bold;
                }
                .detail_ {
                    width: 488px;
                    word-break: break-all;
                }
            }
        }
        .span_ {
            color: red;
            font-weight: bold;
        }
        .box-regues {
            padding: 5px 5px 0 5px;
            border: 1px solid #BDCDDC;
            background-color: #F1F6FC;
            .radio {
                display: block;
                margin-left: 0;
                padding-bottom: 8px;
            }
            .regues-detail {
                margin: 5px 0;
                .dispute-content {
                    margin-bottom: 5px;
                    display: flex;
                    align-items: center;
                    label {
                        display: inline-block;
                        padding: 0 5px;
                    }
                    .address {
                        width: 60px;
                        text-align: right;
                    }
                    .data-picker {
                        width: 153px;
                    }
                }
            }
        }
    }
</style>

<script>
    import {
        api_get_paypal_address,
        api_post_send_message,
        api_get_paypal_refund_order,
        api_post_add_address,
        api_post_make_offer,
        api_post_acknowledge_return_item,
        api_get_paypal_carriers,
        api_post_appeal,
        api_post_accept_claim,
        api_post_provide_evidence
    } from '@/api/paypal-dispute';
    export default {
        permission:{

        },
        data() {
            return {
                now:new Date().getTime(),
                intervalTime:null,
                uploading: false,
                orderNumber: "",
                isTrigger: false,
                radioValue: '',
                showDialog: false,
                returnAddress: '',//退货地址
                addressGroup: [],//退货地址下拉框数据,
                refundPartAmount: '',//部分退款金额
                remark: '',//备注
                refundWay: 1,//退款方式
                refundWayGroup: [//退款方式下拉框数据
                    {label: '我已通过Paypal退款', value: 1},
                    {label: '我已退款，但并非通过Paypal', value: 2},
                ],
                tableLoading: false,
                refundOrderGroup: [],//已退款交易数据,
                searchRefundData: {
                    startDate: '',
                    endDate: '',
                    page: 1,
                    pageSize: 50
                },
                refundCheckList: [],
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.searchRefundData.startDate){
                            return  time.getTime() > this.searchRefundData.endDate
                        }else {
                            return false
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.searchRefundData.startDate){
                            return time.getTime() < this.searchRefundData.startDate
                        }else {
                            return false
                        }
                    }
                },
                message: '',//向买家发送友好讯息,
                isAddArchives: false,//是否显示新增档案内容
                file: [],//上传的文件,
                archivesType: '',//档案类型
                archivesNote: '',//档案说明
                archivesTypeGroup: [
                    {label: '运送证明', value: 1},
                    {label: '退款证明', value: 2},
                    {label: '交货签名证明', value: 3},
                    {label: '退货证明', value: 19},
                    {label: '其他', value: 22}
                ],
                plan: 1,//调解方案
                planRefundAmount: '',//退款金额
                planRemark: '',//调解方案详情
                planGroup: [//调解方案下拉框数据
                    {label: '全额或者部分退款，买家保留物品', value: 1},
                    {label: '全额或者部分退款，买家退还物品', value: 2},
                    {label: '部分退款，更换货品', value: 3},
                    {label: '发送替换物品', value: 4}
                ],
                evidence: 1,
                evidenceType:[//运送商品或提供服务
                    {label: '商品', value: 1},
                    {label: '服务', value: 2},
                ],
                trackData:[//追踪编号和运输方式
                    {tracking_number: '',shipping_type: ''}
                ],
                shippingTypeGroup: []//物流名称/运输方式
            }
        },
        filters:{
            fdateTime(val) {
                return datef("YYYY-MM-dd HH:mm:ss",val);
            },
            statusFilter(val){
                const statusArr = new Map()
                    .set(0, '未发送')
                    .set(1, '完成')
                    .set(2, '发送中')
                    .set(3, '失败')
                    .set(4, '测试默认成功');
                return statusArr.get(val)
            },
            messageFilter(val){
                return val ? '，'+val : ''
            },
            evidenceFilter(val){
                const evidenceArr = new Map()
                    .set(1, '提交有关你履行的责任资料')
                    .set(2, '提交证明文件');
                return evidenceArr.get(val)
            },
            planFilter(val){
                const planArr = new Map()
                    .set(1, '全额或者部分退款，买家保留物品调解方案')
                    .set(2, '全额或者部分退款，买家退还物品调解方案')
                    .set(3, '部分退款，更换货品调解方案')
                    .set(4, '替换物品调解方案');
                return planArr.get(val)
            },
            posterFilter(val) {
                const posterArr = new Map()
                    .set('BUYER', '买家')
                    .set('SELLER', '卖家')
                    .set('PAYPAL', 'Paypal');
                return posterArr.get(val)
            }
        },
        mounted(){
            if(this.disputeData.due_date*1000-this.now>0) {
                this.count_down_interval();
            }
            this.get_address();
            this.get_carries()
        },
        methods:{
            change_radio(val){
                this.file = [];
                this.refundPartAmount = '';
                this.returnAddress = '';
                this.remark = '';
                this.message = '';
                this.refundWay = 1;
                if(val === 'sendPlan'){
                    this.plan = 1
                }
                this.trackData = [
                    {tracking_number: '',shipping_type: ''}
                ]
            },
            add_track(){
                this.trackData.push({tracking_number: '', shipping_type: ''});
            },
            delete_track(index){
                this.trackData.splice(index,1)
            },
            // sku_image(image){
            //     return image.replace('60x60','200x200');
            // },
            // search_img(image){
            //     window.open(image.replace('60x60','500x500'));
            // },
            count_down_interval(){
                this.intervalTime = setInterval(()=>{
                    this.now = new Date().getTime();
                },1000);
            },
            add_address(data){
                this.$set(data, 'account_id', this.disputeData.account_id);
                this.$http(api_post_add_address, data).then(res => {
                    this.$message({type: 'success', message: res.message});
                    this.showDialog = false;
                    this.get_address()
                }).catch(code => {
                    this.$message({type: 'error', message: code.message||code})
                })
            },
            //发送讯息
            send_message(){
                let data = {
                    id: this.disputeData.id,
                    message: this.message
                };
                if(!this.message){
                    this.$message({type: 'warning', message: '请填写信息内容'});
                    return
                }
                this.$http(api_post_send_message,data).then(res => {
                    this.$message({type: 'success', message: res.message});
                    this.$emit('close-dialog')
                }).catch(code => {
                    this.$http({type:'error', message: code.message||code})
                })
            },
            //新增档案
            add_archives(){
                if(!this.archivesType||this.file.length === 0){
                    this.$message({type: 'warning', message: '请先选择上传的文件和档案类型'});
                    return
                }
                let params = {
                    id: this.disputeData.id,
                    evidence_type: this.archivesType,
                    file: this.file[0].file
                };
                this.$confirm('确定上传该档案吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_post_appeal, params).then(res => {
                        this.$message({type: 'success', message: res.message});
                        this.isAddArchives = false
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message||code})
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            //传送调解方案
            transfer_plan(){
                  let params = {
                      id: this.disputeData.id,
                      offer_amount: this.planRefundAmount,
                      offer_type: this.plan,
                      address_id: this.returnAddress,
                      note: this.planRemark
                  };
                  this.$http(api_post_make_offer, params).then(res => {
                      this.$message({type: 'success', message: res.message});
                      this.$emit('close-dialog')
                  }).catch(code => {
                      this.$message({type: 'error', message: code.message||code})
                  })
            },
            //发放退款
            issue_refund(type){
                let params = {
                    id: this.disputeData.id,
                    refund_amount: '',
                    address_id: '',
                    note: ''
                };
                //type 为 1 代表全退款，买家可以保留物品，不用填写地址
                //type 为 2 代表全额退款，买家必须退还物品，需要填写地址
                //type 为 3 代表部分退款，需要填写部分退款金额，需要填写地址
                if(type !== 1){
                    if(!this.returnAddress) {
                        this.$message({type: 'warning', message: '请选择退货地址'});
                        return
                    }else{
                        params.address_id = this.returnAddress
                    }
                }
                if(type === 3){
                    if(!this.refundPartAmount || this.refundPartAmount === '0'){
                        this.$message({type: 'warning', message: '部分退款金额不能为空或为0'});
                        return
                    }
                    if(+this.refundPartAmount > +this.disputeData.dispute_amount){
                        this.$message({type: 'warning', message: '部分退款金额不能大于最高退款金额'});
                        return
                    }
                    params.refund_amount = this.refundPartAmount;
                    params.note = this.remark
                }
                this.$confirm('确定发放退款吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_post_accept_claim,params).then(res => {
                        this.$message({type: 'success', message: res.message});
                        this.$emit('close-dialog')
                    }).catch(code => {
                        this.$message({type: 'error', message: code.message||code})
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });

            },
            //提交证明文件
            submit_evidence(type){
                //type为1时代表我已退款中的通过paypal退款操作；
                //type为2时代表我已退款中的并非通过paypal退款操作；
                //type为3时代表未收到物品（reason_int === 1）情况下我已运输商品或提供服务操作(可以选择多个追踪编号和运输方式)
                //type为4时代表其他情况下我已运输商品或提供服务操作(商品和服务操作有些不同)
                //type为5代表等待买家回复与说明不符时的提交证明文件操作
                //type为6代表我不同意补偿申请，想提交其他信息
                if(this.file.length === 0){
                    this.$message({type: 'warning', message: '请先上传证据文件'});
                    return
                }
                let params = {
                    id: this.disputeData.id,
                    address_id: '',
                    note: this.remark,
                    carrier_name: '',
                    tracking_number: '',
                    refund_ids: '',
                    evidence_type: 22,
                    file: this.file[0].file
                };
                switch(type){
                    case 1:
                        params.refund_ids = this.refundCheckList.length === 1 ? this.refundCheckList[0].txn_id : this.refundCheckList.map(row => row.txn_id);
                        break;
                    case 2:
                        params.evidence_type = 2;
                        break;
                    case 3:
                        this.trackData.forEach(row => {
                            if(!row.tracking_number || !row.shipping_type){
                                this.$message({type: 'warning', message: '追踪编号和运输方式不可为空'});
                                return
                            }
                        });
                        params.tracking_number = this.trackData.map(row => row.tracking_number);
                        params.carrier_name = this.trackData.map(row => row.shipping_type);
                        params.evidence_type = 22;
                        break;
                    case 4:
                        if(this.evidence === 1){
                            params.tracking_number = this.trackData[0].tracking_number;
                            params.carrier_name = this.trackData[0].shipping_type;
                            params.evidence_type = 3
                        }else{
                            params.evidence_type = 22
                        }
                        break;
                    case 6:
                        if(!this.returnAddress){
                            this.$message({type: 'warning', message: '请选择退货地址'});
                            return
                        }
                        params.address_id = this.returnAddress;
                        break
                }
                this.$http(api_post_provide_evidence, params).then(res => {
                    this.$message({type: 'success', message: res.message});
                    this.$emit('close-dialog')
                }).catch(code => {
                    this.$message({type: 'error', message: code.message||code})
                })
            },
            handle_change(val){
                this.file = val
            },
            //切换档案类型
            select_archives_type(){

            },
            //切换收获地址
            select_address(){

            },
            //切换退款方式
            select_refund_way(){
                this.file = [];
                this.remark = '';
                this.refundCheckList = []
            },
            //切换调解方案
            select_plan(){
                this.planRefundAmount = '';
                this.planRemark = ''
            },
            //切换商品或服务
            select_service(){
                this.file = [];
                this.remark = '';
                this.trackData = [
                    {tracking_number: '',shipping_type: ''}
                ]
            },
            //获取地址
            get_address(){
                this.$http(api_get_paypal_address,this.disputeData.account_id).then(res => {
                    this.addressGroup = res.data
                }).catch(code => {
                    this.$message({type: 'error', message: code.message||code})
                })
            },
            //获取已退款交易
            get_refunded_order(){
                this.tableLoading = true;
                let data = clone(this.searchRefundData);
                if (!!data.startDate) {
                    data.startDate = datef('YYYY-MM-dd', data.startDate/1000)
                } else {
                    data.startDate = ''
                }
                if (!!data.endDate) {
                    data.endDate = datef('YYYY-MM-dd', data.endDate/1000)
                } else {
                    data.endDate = ''
                }
                this.$http(api_get_paypal_refund_order,{id: this.disputeData.id},data).then(res => {
                    this.refundOrderGroup = res.data;
                    this.tableLoading = false;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message||code})
                })
            },
            //已退款交易多选
            handle_selection_change(val){
                this.refundCheckList = val
            },
            //获取物流名称
            get_carries(){
                this.$http(api_get_paypal_carriers).then(res => {
                    this.shippingTypeGroup = res.data
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code})
                })
            },
            //检测是否存在某个词
            is_exist(val){
                if(this.disputeData.operation.indexOf(val) !== -1){
                    return true
                }else{
                    return false
                }
            }
        },
        computed:{
            acceptClaim(){
                return this.is_exist('accept_claim')
            },
            provideEvidence(){
                return this.is_exist('provide_evidence')
            },
            sendMessage(){
                return this.is_exist('send_message')
            },
            makeOffer(){
                return this.is_exist('make_offer')
            },
            message_from_buyer(){
                return this.disputeData.status === 'OPEN' ? true : false
            },
            wait_buyer_reply(){
                return this.disputeData.status === 'WAITING_FOR_BUYER_RESPONSE' ? true : false
            },
            need_reply(){
                return this.disputeData.status === 'WAITING_FOR_SELLER_RESPONSE' ? true : false
            },
            paypal_audit(){
                return this.disputeData.status === 'UNDER_REVIEW' ? true : false
            },
            reason_other(){
                return this.disputeData.reason_int === 0 ? true : false
            },
            reason_not_received(){
                return this.disputeData.reason_int === 1 ? true : false
            },
            reason_describe_error(){
                return this.disputeData.reason_int === 2 ? true : false
            },
            reason_unauthorized(){
                return this.disputeData.reason_int === 3 ? true : false
            },
            reason_repeat(){
                return this.disputeData.reason_int === 5 ? true : false
            },
            reason_cancel(){
                return this.disputeData.reason_int === 8 ? true : false
            },
            filterCountDown(){
                if(this.disputeData.seller_response_due_date*1000-this.now>0) {
                    let sec = this.disputeData.seller_response_due_date*1000 - this.now;
                    sec = Math.max(sec, 0);
                    let d = parseInt(sec / 1000 / 60 / 60 / 24, 10);
                    let h = parseInt(sec / 1000 / 60 / 60 % 24, 10);
                    let m = parseInt(sec / 1000 / 60 % 60, 10);
                    let s = parseInt(sec / 1000 % 60, 10);
                    `${m}`.length===1&&(m='0'+m);
                    `${s}`.length===1&&(s='0'+s);
                    return `${d}天${h}时${m}分${s}秒`;
                }else{
                    return false
                }
            }
        },
        destroyed(){
            clearInterval(this.intervalTime);
        },
        props: {
            disputeData: {
                type: Object
            },
            formData: {},
            isEditIssue:{
                type:Boolean,
                required:true
            }
        },
        components: {
            uiTip: require('@/components/ui-tip.vue').default,
            fileUpload: require('./file-upload').default,
            times: require('@/components/times.vue').default,
            addAddress: require('./add-address').default
        }
    }
</script>