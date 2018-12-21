<template>
    <div class="p-ali-request">
        <el-card v-loading="uploading" style="border: 0;">
            <page>
                <div class="box-attr">
                    <div class="attr-now">
                        <div class="label_">纠纷ID：</div>
                        <div class="detail_">{{disputeData.issue_id}}</div>
                    </div>
                    <div class="attr-now">
                        <div class="label_">发起时间：</div>
                        <div class="detail_">{{disputeData.create_time|fdateTime}}</div>
                    </div>
                    <div class="attr-now">
                        <div class="label_">买家纠纷提起原因：</div>
                        <div class="detail_">{{disputeData.reason_cn}}</div>
                    </div>
                    <div class="attr-now">
                        <div class="label_">纠纷状态：</div>
                        <div class="detail_">{{filterStatus}}</div>
                    </div>
                    <template v-if="disputeData.issue_status==='finish'&&disputeData.solution.seller&&disputeData.solution.seller.length>0">
                        <div class="attr-now" style="padding: 0 5px;">
                            <div class="label_">提醒：</div>
                            <div class="detail_">纠纷已处理完成</div>
                        </div>
                    </template>
                    <template v-else-if="disputeData.issue_status!=='finish'&&disputeData.solution.seller&&disputeData.solution.seller.length>0">
                        <div class="attr-now" style="padding: 0 5px;">
                            <div class="label_"></div>
                            <div class="detail_">您已回应买家，尚未与买家达成一致。您可以继续通过“拒绝并新增方案”，“同意”买家方案，“上传证据”，“修改”已有方案的备注等方式来解决此纠纷。若双方未能在响应时  间内达成一致，平台会介入协助双方处理纠纷。</div>
                        </div>
                    </template>
                    <template v-else-if="disputeData.issue_status==='processing'&&filterCountDown" >
                        <div class="attr-now" style="padding: 0 5px;">
                            <div class="label_"></div>
                            <div class="detail_">买家已提起纠纷，请您务必在</div>
                        </div>
                        <div class="attr-now">
                            <div class="label_"></div>
                            <div class="detail_"><span style="color:red;">{{filterCountDown}}</span>内处理。否则，系统将会根据买家提出的退款金额或退货请求执行。您可以通过“拒绝并新增方案”，“同意”买家方案，“上传证据”来处理纠纷。请您查看 详情，并主动和买家协商解决此纠纷。</div>
                        </div>
                    </template>
                    <div v-else class="attr-now">
                        <div class="label_"></div>
                        <div class="detail_">平台介入处理</div>
                    </div>
                </div>
                <div>
                    <span class="tabs-label">买家方案</span>
                    <div class="box-attr">
                        <div v-for="row in disputeData.solution.buyer">
                            <div class="attr-now">
                                <div class="label_">{{`买家方案${row.is_default===1?'(默认方案)':''}`}}</div>
                            </div>
                            <div class="attr-now">
                                <div class="label_">方案：</div>
                                <div class="detail_">{{filterType(row)}}</div>
                            </div>
                            <div class="attr-now">
                                <div class="label_">纠纷状态：</div>
                                <div class="detail_">{{row.status|filterBuyerStatus}}</div>
                            </div>
                            <div class="attr-now">
                                <div class="label_">备注：</div>
                                <div class="detail_">{{row.content}}</div>
                            </div>
                            <div class="attr-now" v-if="row.solution_owner==='buyer'&&row.status==='wait_seller_accept'&&isEditIssue">
                                <div class="label_"></div>
                                <div class="detail_">
                                    <permission class="ml-sm inline"
                                                tag="ElButton"
                                                type="primary"
                                                size="mini"
                                                :disabled="row.status!=='wait_seller_accept'||hasReached"
                                                :route="apis.url_post_ali_issue_add_solution"
                                                @click="agree_scheme(row)">同意
                                    </permission>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <template>
                    <template v-if="disputeData.solution.seller&&disputeData.solution.seller.length>0">
                        <div v-for="item in disputeData.solution.seller">
                            <span class="tabs-label">我的方案</span>
                            <div class="box-attr">
                                <div class="attr-now">
                                    <div class="label_">卖家方案</div>
                                </div>
                                <div class="attr-now">
                                    <div class="label_">方案：</div>
                                    <div class="detail_">{{filterType(item)}}</div>
                                </div>
                                <div class="attr-now">
                                    <div class="label_">备注：</div>
                                    <div class="detail_">{{item.content}}</div>
                                </div>
                                <div class="attr-now" v-if="isEditIssue">
                                    <div class="label_"></div>
                                    <div class="detail_">
                                        <permission class="ml-sm inline"
                                                    tag="ElButton"
                                                    type="primary"
                                                    size="mini"
                                                    :disabled="hasReached"
                                                    :route="apis.url_post_ali_issue_edit_solution"
                                                    @click="reject_add(item)">修改
                                        </permission>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <div v-else>
                        <span class="tabs-label">我的方案</span>
                        <div class="box-attr">
                            <div class="attr-now">
                                <div class="label_">等待您提供方案</div>
                            </div>
                            <div class="attr-now">
                                <div class="label_" style="width: 319px;">您可以同意买家方案/拒绝并新增一个方案来响应纠纷。</div>
                            </div>
                        </div>
                    </div>
                </template>
                <div v-if="isEditIssue">
                    <permission class="ml-sm inline"
                                tag="ElButton"
                                type="primary"
                                size="mini"
                                :disabled="hasReached||disputeData.solution.seller.length>0"
                                :route="apis.url_post_ali_issue_add_solution"
                                @click="reject_add('add')">拒绝并新增退款方案</permission>
                    <image-upload
                        @handle-change="imageChange"
                        v-if="disputeData.solution.seller.length>0&&!hasReached"
                        :show-thumb="false"
                        :thumbnail-mode="true"
                        label="上传附件"
                        class="inline ml-sm"
                        :multiple="false"
                        ref="images"
                        :init="file"></image-upload>
                    <div class="inline" v-else>
                        <el-button
                            class="ml-sm inline"
                            type="primary"
                            size="mini"
                            disabled
                            @click="upload_img">上传附件</el-button>
                        <div v-if="!hasReached" class="ml-sm inline"><span class="fl"><img style="width:17px;" src="../../../../assets/exclamation.svg"></span><span class="fl">请先“拒绝并新增方案后”再上传证据</span><div class="clearFloat"></div></div>
                    </div>
                </div>
            </page>
            <div class="mt-xs">
                <div class="tabs-label ml-xs">证据</div>
                <div class="box-attr" style="min-height: 80px;">
                    <el-row>
                        <el-col :span="12">
                            <div>买家证据</div>
                            <template  v-if="item.file_path.length>0&&item.submit_member_type==='buyer'" v-for="item in tableData">
                                <div v-for="src in item.file_path" class="inline mt-mini ml-mini mr-mini">
                                    <el-popover
                                        placement="right"
                                        trigger="hover">
                                        <img v-lazy="sku_image(src)" width="200px" height="200px">
                                        <span slot="reference">
                                                    <img v-lazy="src"
                                                         @click="search_img(src)"
                                                         height="60px"
                                                         width="60px"
                                                         style="border:none">
                                                </span>
                                    </el-popover>
                                </div>
                            </template>
                        </el-col>
                        <el-col :span="12">
                            <div>卖家证据</div>
                            <template v-if="item.file_path.length>0&&item.submit_member_type==='seller'" v-for="item in tableData">
                                <div v-for="src in item.file_path" class="inline mt-mini ml-mini mr-mini">
                                    <el-popover
                                        placement="right"
                                        trigger="hover">
                                        <img v-lazy="sku_image(src)" width="200px" height="200px">
                                        <span slot="reference">
                                            <img v-lazy="src"
                                                 @click="search_img(src)"
                                                 height="60px"
                                                 width="60px"
                                                 style="border:none">
                                        </span>
                                    </el-popover>
                                </div>
                            </template>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div>
                <div class="tabs-label ml-xs">订单留言(仅供双方沟通和协商。纠纷解决方案，关键信息等其他证据，“请到我的方案”区响应)</div>
                <div class="box-attr">
                    <el-row>
                        <el-col :span="16">
                            <div class="ml-xs">信息内容</div>
                        </el-col>
                        <el-col :span="8">
                            <div class="ml-xs">插入表情</div>
                        </el-col>
                    </el-row>
                    <el-row class="mt-xs mb-xs">
                        <emotions-textarea ref="emotionText" v-model="textarea" :emotions-width="`135%`" :emotions="emotions"></emotions-textarea>
                    </el-row>
                    <el-row>
                        <label class="inline ml-xs">上传图片：</label>
                        <image-upload
                            class="inline"
                            ref="imageUpload"
                            :thumbnail-mode="true"
                            :multiple="false"
                            :image="{width:'100px',height:'100px'}"
                            :init="imgInit"></image-upload>
                        <div style="padding-left: 66px;">最多上传1个文件，单个不超过5MB，支持JPG、JPEG、GIF、PNG、BMP</div>
                        <div style="padding-left: 66px;">
                            <permission class="inline"
                                        tag="request-button"
                                        req-key="url_post_ali_issue_add_solution_msg"
                                        :mintime="300"
                                        :disabled="textarea.length===0"
                                        :route="apis.url_aliexpress_msg_add_msg"
                                        @click="send_mag">发送</permission>
                        </div>
                    </el-row>
                </div>
            </div>
            <div class="request-message-list">
                <div class="tabs-label ml-xs">消息记录</div>
                <div class="box-attr">
                    <el-row class="mb-xs">
                        <div class="fr">
                            <el-select v-model="msgDetail.rank"
                                       placeholder="请选择"
                                       class="inline ml-sm" style="width:90px">
                                <el-option
                                    v-for="(it,it_i) in flagArr"
                                    :key="`${it.id}${it_i}`"
                                    @click.native="clickOption(it)"
                                    :label="it.name"
                                    :value="it.id">
                                </el-option>
                            </el-select>
                        </div>
                    </el-row>
                    <el-row class="box-attr-message">
                        <div v-if="msgList.length===0">暂无数据</div>
                        <div v-for="(data,data_i) in msgList" :key="`${data.gmt_create}${data_i}`" @click="message_click(data)">
                            <el-card :class="['mb-xs',data.is_own===0?'buyer-background':'',data.isCheck?'right-active':'','pointer']">
                                <el-row class="mb-xs">
                                    <span v-if="data.is_own===0"  class="buyer">买</span>
                                    <span v-if="data.is_own===1" class="seller">卖</span>
                                    <div class="inline" style="color:#3300FF">{{data.sender_name}}</div>
                                    <div class="inline fr">{{data.gmt_create|fdateTime}}</div>
                                </el-row>
                                <div class="el-row">
                                    <div  class="inline" style="width: 93%;">
                                        <div  v-html="data.content"></div>
                                        <ul  v-if="data.img&&data.img.length">
                                            <li v-for="image in data.img" class='inline'  @click="scale_image(image)" >
                                                <img v-lazy="image.s_path" alt="">
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="inline fr" v-if="data.product_img">
                                        <el-popover
                                            placement="right"
                                            width="200"
                                            trigger="hover">
                                            <img v-lazy="sku_image(data.product_img)" width="200" height="200">
                                            <span slot="reference">
                                            <img v-lazy="data.product_img" width="60" height="60">
                                        </span>
                                        </el-popover>
                                    </div>
                                </div>
                                <div class="inline" v-if="data.file_path.length>0"
                                     v-for="(img,img_i) in data.file_path" :key="`${img.sPath}${img_i}`" style="margin-top:5px">
                                    <el-popover
                                        placement="bottom-start"
                                        trigger="hover">
                                        <img :src="img.lPath" width="300px" height="400px">
                                        <span slot="reference">
                                             <img :src="img.sPath" width="50px" height="26px" style="cursor: -webkit-zoom-in;">
                                    </span>
                                    </el-popover>
                                </div>
                            </el-card>
                        </div>
                    </el-row>
                </div>
            </div>
            <div>
                <div class="tabs-label ml-xs">纠纷历史</div>
            </div>
            <el-table
                class="mt-xs scroll-bar"
                :data="tableData"
                border
                :height="tableHeight"
                highlight-current-row>
                <el-table-column label="操作人" width="80" show-overflow-tooltip inline-template>
                    <ui-tip :content="filterMember(row)"></ui-tip>
                </el-table-column>
                <el-table-column label="操作时间" inline-template show-overflow-tooltip width="145">
                    <div>{{row.gmt_create|fdateTime}}</div>
                </el-table-column>
                <el-table-column label="操作内容" inline-template>
                    <div>
                        <div>{{row.action_type}}</div>
                        <div :title="row.content" style="word-break: keep-all;">{{row.content}}</div>
                        <template v-for="(item,index) in row.file_path" v-if="row.file_path.length>0">
                            <div :key="index"
                                 class="inline mt-mini ml-mini mr-mini">
                                <el-popover
                                    placement="right"
                                    trigger="hover">
                                    <img v-lazy="sku_image(item)" width="200px" height="200px">
                                    <span slot="reference">
                                        <img v-lazy="item"
                                             @click="search_img(item)"
                                             height="60px" width="60px" style="border:none">
                                        </span>
                                </el-popover>
                            </div>
                        </template>
                    </div>
                </el-table-column>
            </el-table>
        </el-card>
        <reject-and-add
            v-model="rejectAddVisibility"
            :dispute-data="disputeData"
            @has-solution-add="has_solution_add"
            :location-list="locationList"
            :is-refund="isRefund"
            :edit-data="editData"
            :title="rejectAddTitle"></reject-and-add>
        <sales-return-location
            :title="`同意方案`"
            v-model="locationVisibility"
            :solution-id="solutionId"
            :location-list="locationList"></sales-return-location>
        <blowup-image v-model="showBigDailog"
                      :title="blowUpTitle"
                      :imgPath="curImgPath"></blowup-image>
    </div>
</template>
<style lang="stylus">
    .p-ali-request {
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
            .box-attr-message{
                max-height: 380px;
                overflow-y: scroll;
                border: 1px solid #bdcddc;
                box-sizing: border-box;
                padding:2px;
                border-radius:3px;
            }
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
            margin-top: 5px;
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
        .request-message-list{
            .buyer{
                display: inline-block;
                background:#FF0000 ;
                color: #FFFFEF;
                line-height: 20px;
                font-weight: 600;
                font-size: 1.25rem;
                padding: 2px 5px;
                border-radius: 4px;
            }
            .seller{
                display: inline-block;
                background:#FFCC06 ;
                color: #1F77A2;
                line-height: 20px;
                font-weight: 600;
                font-size: 1.25rem;
                padding: 2px 5px;
                border-radius: 4px;
            }
            .right-active{
                border-radius: 4px;
                border: 1px solid #5E93FF!important;
                box-shadow: 0 0 7px #5E93FF;
                &:hover{
                    background: #d0e5cb;
                }
            }
            .buyer-background{
                background: #d0e5cb;
            }
            .el-card__body {
                padding: 10px;
            }
        }
    }

</style>
<script>
    import {
        api_dispute_cancel,
        api_dispute_inquiry,
        api_dispute_return,
        api_dispute_case,
        api_ali_issue_agree_solution,
        api_post_ali_issue_upload_images,
        api_ali_issue_get_process_id,
        api_ali_issue_get_refund_address_id,
        url_post_ali_issue_edit_solution,
        url_post_ali_issue_add_solution,
        url_aliexpress_msg_add_msg,
        api_aliexpress_msg_add_msg,
        api_aliexpress_msg_order_order_on
    } from '../../../../api/dispute'
    import {api_replay,api_aliexpress_msg_list,api_level,api_changelevel} from '@/api/smt-mail'

    export default {
        permission:{
            url_post_ali_issue_add_solution,
            url_post_ali_issue_edit_solution,
            url_aliexpress_msg_add_msg
        },
        data() {
            return {
                addDialog: false,
                isTrigger: false,
                orderNumber: "",
                now:new Date().getTime(),
                intervalTime:null,
                file:[],
                rejectAddVisibility:false,
                rejectAddTitle:'',
                tableData:[],
                locationVisibility:false,
                locationList:[],
                solutionId:'',
                editData:{
                    solution_type:'',
                    refund_money_post:'',
                    content:'',
                    type:'add'
                },
                uploading:false,
                msgList:[],
                textarea:'',
                emotions:require('../../../../lib/emotions').default,
                imgInit:[],
                showBigDailog:false,
                blowUpTitle:'',
                curImgPath:'',
                flagArr:[],
                msgDetail:{}
            }
        },
        mounted() {
            this.get_process();
            if(this.disputeData.expire_time*1000-this.now>0) {
                this.countDownInterval();
            }
            this.levelFun();
        },
        methods: {
            levelFun(){
                this.flagArr = [];
                this.$http(api_level).then(res=>{
                    this.flagArr = res
                }).catch(code=>{this.$message({message:code.message||code,type:'error'})})
            },
            /*改变优先级*/
            clickOption(){
                this.$http(api_changelevel,this.msgDetail.id,this.msgDetail.rank).then(res=>{
                    this.$message({
                        type:'success',
                        message: `操作成功`
                    });
                }).catch(code=>{this.$message({message:code.message||code,type:'error'})})
            },
            get_message(order_on){
                this.msgList = [];
                this.$http(api_aliexpress_msg_order_order_on,order_on).then(res=>{
                    if(!!res.data&&res.data[0]) {
                        this.msgDetail = res.data[0];
                        this.$http(api_aliexpress_msg_list, this.msgDetail.id).then(res => {
                            this.msgList = res;
                            if (!!this.$refs.emotionText) {
                                this.msgList.forEach(row => {
                                    row.content = this.$refs.emotionText.replaceImg(row.content);
                                });
                            }
                        }).catch(code => {
                            console.log(code);
                        });
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            message_click(data){
                this.msgList.forEach(row=>{
                    this.$set(row,'isCheck',false)
                });
                data.isCheck = true;
            },
            scale_image(image){
                this.showBigDailog=true;
                this.curImgPath=image.l_path;
            },
            sku_image(images){
                if(!!images){
                    return images.replace('_60x60.','_200x200.');
                }
                return ""
            },
            imageChange(){
                let size = this.file.map(row=>row.size).reduce((size,imgSize)=>size+=imgSize);
                const MEGABYTE = 2097152;
                if(size>MEGABYTE){
                    this.$refs.images.remove(this.file);
                    this.$message({type:'warning',message:'附件过大，请选择2M以内的图片！'});
                    return
                }
                this.uploading = true;
                this.$message({type:'info',message:'图片正在上传'});
                this.$http(api_post_ali_issue_upload_images,{img:this.file[0].image,issue_id:this.disputeData.issue_id}).then(res=>{
                    this.disputeData = res.data;
                    this.tableData = res.process;
                    this.uploading = false;
                    this.$message({type:'success',message:res.message||res});
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    this.$refs.images.remove(this.file);
                });
            },
            search_img(image){
                window.open(image.replace('60x60','500x500'));
            },
            has_solution_add(data){
                this.disputeData = data;
                this.tableData = data.process;
            },
            get_process(){
                this.$http(api_ali_issue_get_process_id,this.disputeData.issue_id).then(res=>{
                    this.tableData = res;
                }).catch(code=>{
                    console.log(code);
                });
            },
            countDownInterval(){
                this.intervalTime = setInterval(()=>{
                    this.now = new Date().getTime();
                },1000);
            },
            filterType(item){
                switch (item.solution_type){
                    case 'refund':
                        return `仅退款 US $${item.refund_money_post}(${item.refund_money})`;
                        break
                    case 'return_and_refund':
                        return `退货并退款 US $${item.refund_money_post}(${item.refund_money})`;
                        break
                }
            },
            agree_scheme(item){
                if(item.solution_type==='refund'){
                    this.$confirm(`注意：当双方都同意后，纠纷将会按照该方案执行，同意后无法取消，请确认是否同意该方案？`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(()=>{
                        this.$http(api_ali_issue_agree_solution,{solution_id:item.solution_id}).then(res=>{
                            this.$message({type:'success',message:res.message||res});
                            this.disputeData = res.data;
                            this.$emit('issue-agree-solution',res.data);
                        }).catch(code=>{
                            this.$message({type:'error',message:code.message||code});
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '取消操作'
                        });
                    });
                }else{
                    this.init_location();
                    this.solutionId = item.solution_id;
                    this.locationVisibility = true;
                }
            },
            init_location(){
                this.$http(api_ali_issue_get_refund_address_id,this.disputeData.account_id).then(res=>{
                    this.locationList = res.map(row=>{
                        return {
                            value:row.address_id,
                            label:`${row.country?row.country:''}${row.province?row.province:''}${row.city?row.city:''}${row.county?row.county:''}${row.street?row.street:''}${row.street_address?row.street_address:''}`
                        }
                    });
                }).catch(code=>{
                    console.log(code);
                })
            },
            reject_add(item){
                if(item!=='add'){
                    this.editData.solution_type = item.solution_type;
                    this.editData.refund_money_post = item.refund_money_post;
                    this.editData.content = item.content;
                    this.editData.return_address_id = item.return_address_id;
                    this.editData.type = 'edit';
                    this.rejectAddVisibility = true;
                    this.rejectAddTitle = '编辑方案';
                    if(this.isRefund){
                        this.init_location();
                    }
                }else {
                    this.editData = {
                        solution_type:'',
                        refund_money_post:'',
                        content:'',
                        type:'add'
                    };
                    this.rejectAddVisibility = true;
                    this.rejectAddTitle = '拒绝并新增方案';
                    if(this.isRefund){
                        this.init_location();
                    }
                }
            },
            filterMember(row){
                switch (row.submit_member_type) {
                    case 'seller':
                        return '卖家';
                        break
                    case 'buyer':
                        return'买家'+row.buyer_login_id;
                        break
                    case 'waiter':
                        return '客服';
                        break
                }
            },
            upload_img(){},
            send_mag(){
                if(!this.textarea){
                    this.$reqKey('url_post_ali_issue_add_solution_msg',false);
                    return this.$message({type:'warning',message:'请输入回复内容！'});
                }
                let api;
                let data = {
                    content:this.textarea
                };
                this.imgInit.length>0&&(data.img = this.imgInit[0].image);
                if(this.msgList.length>0){
                    data.channel_id = this.msgDetail.channel_id;
                    api  = api_replay
                }else{
                    data.order_no = this.disputeData.order_id;
                    api = api_aliexpress_msg_add_msg;
                }
                this.$http(api,data).then(res=>{
                    this.$message({
                        type:'success',
                        message: res.message||res
                    });
                    this.textarea = '';
                    this.get_message(this.disputeData.order_id);
                    this.imgInit.length>0&&this.$refs.imageUpload.remove(this.imgInit);
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('url_post_ali_issue_add_solution_msg',false);
                    },200);
                })
            }
        },
        filters: {
            fdateTime(val) {
                return datef("YYYY-MM-dd HH:mm:ss",val);
            },
            filterBuyerStatus(status){
                switch (status){
                    case 'wait_buyer_and_seller_accept':
                        return '待买卖家双方接受';
                        break
                    case 'wait_buyer_accept':
                        return '待买家接受';
                        break
                    case 'wait_seller_accept':
                        return '待卖家接受';
                        break
                    case 'reached':
                        return '达成';
                        break
                    case 'buyer_refused':
                        return '买家拒绝';
                        break
                    case 'seller_accept_and_buyer_refused':
                        return '卖家接受买家拒绝(针对平台方案)';
                        break
                    case 'perform':
                        return '执行';
                        break
                }
            }
        },
        computed: {
            hasReached(){
                return !!(this.disputeData.solution.buyer.find(row=>row.status==='reached')||this.disputeData.solution.seller.find(row=>row.status==='reached'))
            },
            isRefund(){
                return !!this.disputeData.solution.buyer.find(row=>row.is_default===1&&row.solution_type==='refund')
            },
            tableHeight() {
                if (this.disputeData.state !== 'CLOSED') {
                    if (this.cancel || this.inquiry || this.refundable || this.upgrade) {
                        return 180;
                    } else {
                        return 300;
                    }
                } else {
                    return 450;
                }
            },
            filterStatus(){
                switch (this.disputeData.issue_status){
                    case 'processing':
                        return '协商中';
                        break
                    case 'canceled_issue':
                        return '纠纷取消';
                        break
                    case 'finish':
                        return '纠纷完结';
                        break
                }
            },
            filterCountDown(){
                if(this.disputeData.expire_time*1000-this.now>0) {
                    let sec = this.disputeData.expire_time*1000 - this.now;
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
        watch:{
            'disputeData.order_id':{
                handler(val){
                    if(val){
                        this.get_message(val);
                    }else{
                        this.msgList = [];
                    }
                },
                immediate:true
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
            imageUpload: require('../../smt/inbox/image-upload.vue').default,
            times: require('@/components/times.vue').default,
            rejectAndAdd:require('./reject-and-add').default,
            salesReturnLocation:require('./sales-return-location').default,
            emotionsTextarea:require('../../smt/inbox/emotions-textarea').default,
            blowupImage:require('@/components/blowup-image').default,
        }
    }
</script>
