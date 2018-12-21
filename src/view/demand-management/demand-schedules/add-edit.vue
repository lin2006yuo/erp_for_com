<template>
    <div>
        <page-dialog :title="action.title"
                     @open="open"
                     v-model="visible"
                     size="full"
                     class="d-demand-schedules-add-edit"
                     :close-on-click-modal="false">
            <div>
                <el-form label-width="80px" class="form-body-scroll"  :model="editData" ref="editForm">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item class="inline" label="需求概述：" title="需求概述">
                                <el-input type="text"
                                          style="width: 790px;display: inline-block;"
                                          v-model="editData.summary"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5">
                            <el-form-item class="inline" label="功能模块：" title="功能模块">
                            <el-input type="text"
                                      class="inline"
                                      style="width: 120px"
                                      v-model="editData.module"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <label class="inline">需求优先级：</label>
                            <el-select v-model="editData.priority"
                                       class="inline enter-result s-width-default">
                                <el-option v-for="item in priorityList"
                                           :label="item.label"
                                           :value="item.value"
                                           :key="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="5">
                            <label class="inline">需求分类：</label>
                            <el-select v-model="editData.type"
                                       class="inline enter-result s-width-default">
                                <el-option v-for="item in typeList"
                                           :label="item.label"
                                           :value="item.value"
                                           :key="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5">
                            <el-form-item class="inline" label="编号：" title="编号">
                                <el-input style="width: 120px;display: inline-block;" type="number" disabled :placeholder="action.valse==='add'?'系统自动获取':''" v-model="editData.id" ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <label class="inline label-margin-left-eight">版本号：</label>
                            <el-input :disabled="isEdit" class="inline" style="width: 120px" v-model="editData.version"></el-input>
                        </el-col>
                        <el-col :span="5">
                            <label class="inline">需求状态：</label>
                            <el-select v-model="editData.status"
                                       :disabled="isEdit"
                                       class="inline enter-result s-width-default">
                                <el-option v-for="item in statusList"
                                           :label="item.label"
                                           :value="item.value"
                                           :key="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="需求详情：">
                                <el-col :span="8">
                                    <kindeditor :editor-text="editData.content"
                                                :show-add-pic-normal="false"
                                                :show-add-pic-local="true"
                                                :width="`618%`"
                                                :height="`403px`"
                                                :id="editData.id"
                                                :add_img_btn="addImgBtn"
                                                @content-change="editor_content_change"
                                                :editor-id="`pictureData_index_id_trueId_channelId_spu`"></kindeditor>
                                </el-col>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="需求提出人：">
                                <el-col :span="24">
                                    <scroll-select v-model="raiserUser" style="width:104px" class="inline"
                                                   :disabled="isEdit"
                                                   textAlign="left"
                                                   :remote="urlCreate"
                                                   :fix-params="fix_params_account"
                                                   :fixResult="fix_result_account">
                                    </scroll-select>
                                </el-col>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <label class="inline label-margin-left-eight">需求提出时间：</label>
                            <el-date-picker
                            v-model="editData.raise_time"
                            :disabled="isEdit"
                            type="date"
                            :editable="false"
                            placeholder="选择日期"
                            class="inline date">
                            </el-date-picker>
                        </el-col>
                        <el-col :span="6">
                            <label class="inline label-margin-left-seven">计划上线时间：</label>
                            <el-date-picker
                                v-model="editData.plan_listing_time"
                                :disabled="isEdit"
                                type="date"
                                :editable="false"
                                placeholder="选择日期"
                                class="inline date">
                            </el-date-picker>
                        </el-col>
                        <el-col :span="6">
                            <label class="inline label-margin-left-eight">实际上线时间：</label>
                            <el-date-picker
                                v-model="editData.listing_time"
                                :disabled="isEdit"
                                type="date"
                                :editable="false"
                                placeholder="选择日期"
                                class="inline date">
                            </el-date-picker>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="需求负责人：">
                                <el-col :span="24">
                                    <scroll-select v-model="leadingUser" style="width:104px" class="inline"
                                                   textAlign="left"
                                                   :disabled="isEdit"
                                                   ref="creater"
                                                   :remote="urlCreate"
                                                   :fix-params="fix_params_account"
                                                   :fixResult="fix_result_account">
                                    </scroll-select>
                                </el-col>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <label class="inline">需求计划完成时间：</label>
                            <el-date-picker
                                v-model="editData.plan_complete_time"
                                :disabled="isEdit"
                                type="date"
                                :editable="false"
                                placeholder="选择日期"
                                class="inline date">
                            </el-date-picker>
                        </el-col>
                        <el-col :span="6">
                            <label class="inline">需求完成百分比：</label>
                            <ui-limit-number v-model="editData.plan_percent"
                                             :limit="2"
                                             :disabled="isEdit"
                                             style="width: 120px"
                                             class="inline"
                                             :max="100"
                                             :min="0">
                            </ui-limit-number>
                        </el-col>
                        <el-col :span="6">
                            <label class="inline">需求实际完成时间：</label>
                            <el-date-picker
                                v-model="editData.real_complete_time"
                                :disabled="isEdit"
                                type="date"
                                :editable="false"
                                placeholder="选择日期"
                                class="inline date">
                            </el-date-picker>
                            <el-button
                                size="mini"
                                v-if="!isEdit"
                                @click.native="liftBtn(handleBtn(editData.leading_status),'leading')"
                                :type="handleBtn(editData.leading_status)==='开启'?'primary':'warning'">{{handleBtn(editData.leading_status)}}</el-button>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="开发负责人：">
                                <el-col :span="24">
                                    <scroll-select v-model="developerUser" style="width:104px" class="inline"
                                                   :disabled="isEdit"
                                                   textAlign="left"
                                                   ref="creater"
                                                   :remote="urlCreate"
                                                   :fix-params="fix_params_account"
                                                   :fixResult="fix_result_account">
                                    </scroll-select>
                                    <scroll-select v-model="fronterUser" style="width:104px" class="inline"
                                                   :disabled="isEdit"
                                                   textAlign="left"
                                                   ref="creater"
                                                   :remote="urlCreate"
                                                   :fix-params="fix_params_account"
                                                   :fixResult="fix_result_account">
                                    </scroll-select>
                                </el-col>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <label class="inline">开发计划完成时间：</label>
                            <el-date-picker
                                v-model="editData.plan_developer_time"
                                :disabled="isEdit"
                                type="date"
                                :editable="false"
                                placeholder="选择日期"
                                class="inline date">
                            </el-date-picker>
                        </el-col>
                        <el-col :span="6">
                            <label class="inline">开发完成百分比：</label>
                            <ui-limit-number v-model="editData.developer_percent"
                                             :disabled="isEdit"
                                             style="width: 120px"
                                             :limit="2"
                                             class="inline"
                                             :max="100"
                                             :min="0">
                            </ui-limit-number>
                        </el-col>
                        <el-col :span="6">
                            <label class="inline">开发实际完成时间：</label>
                            <el-date-picker
                                v-model="editData.real_developer_time"
                                :disabled="isEdit"
                                type="date"
                                :editable="false"
                                placeholder="选择日期"
                                class="inline date">
                            </el-date-picker>
                            <el-button
                                size="mini"
                                v-if="!isEdit"
                                @click.native="liftBtn(handleBtn(editData.developer_status),'developer')"
                                :type="handleBtn(editData.developer_status)==='开启'?'primary':'warning'">{{handleBtn(editData.developer_status)}}</el-button>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="测试负责人：">
                                <el-col :span="24">
                                    <scroll-select v-model="testUser" style="width:104px" class="inline"
                                                   :disabled="isEdit"
                                                   textAlign="left"
                                                   ref="creater"
                                                   :remote="urlCreate"
                                                   :fix-params="fix_params_account"
                                                   :fixResult="fix_result_account">
                                    </scroll-select>
                                </el-col>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <label class="inline">测试计划完成时间：</label>
                            <el-date-picker
                                v-model="editData.plan_test_time"
                                :disabled="isEdit"
                                type="date"
                                :editable="false"
                                placeholder="选择日期"
                                class="inline date">
                            </el-date-picker>
                        </el-col>
                        <el-col :span="6">
                            <label class="inline">测试完成百分比：</label>
                            <ui-limit-number v-model="editData.test_percent"
                                             :disabled="isEdit"
                                             style="width: 120px"
                                             :limit="2"
                                             class="inline"
                                             :max="100"
                                             :min="0">
                            </ui-limit-number>
                        </el-col>
                        <el-col :span="6">
                            <label class="inline">测试实际完成时间：</label>
                            <el-date-picker
                                v-model="editData.real_test_time"
                                :disabled="isEdit"
                                type="date"
                                :editable="false"
                                placeholder="选择日期"
                                class="inline date">
                            </el-date-picker>
                            <el-button
                                size="mini"
                                v-if="!isEdit"
                                @click.native="liftBtn(handleBtn(editData.test_status),'test')"
                                :type="handleBtn(editData.test_status)==='开启'?'primary':'warning'">{{handleBtn(editData.test_status)}}</el-button>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="备注：">
                                <el-input :disabled="isEdit" style="width: 88.5%;" type="textarea" v-model="editData.remark"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div slot="footer">
                <!--常用备注   一直存在页面-->
                <remark-edit :title="remarkTitle"
                             @close-remark="close_remark('leading')"
                             @submit-remark="remark_submit('leading')"
                             v-model="editData.leading_stop_remark"
                             v-if="showLeadingRemark"></remark-edit>
                <remark-edit :title="remarkTitle"
                             @close-remark="close_remark('developer')"
                             @submit-remark="remark_submit('developer')"
                             v-model="editData.developer_stop_remark"
                             v-if="showDeveloperRemark"></remark-edit>
                <remark-edit :title="remarkTitle"
                             @close-remark="close_remark('test')"
                             @submit-remark="remark_submit('test')"
                             v-model="editData.test_stop_remark"
                             v-if="showTestRemark"></remark-edit>
                <request-button req-key="api_add_progress" :mintime="200" @click="save">确定</request-button>
                <el-button @click.native="visible = false" size="mini">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .d-demand-schedules-add-edit{
        .form-body-scroll{
            padding-top:15px;
            color: #1f2d3d;
            .form-item-label-margin.el-form-item{
                >label.el-form-item__label{
                    margin-left:152px;
                }
            }
            label.label-margin-left-eight{
                margin-left: 24px;
            }
            label.label-margin-left-seven{
                margin-left: 12px;
            }
        }
        .el-form-item{
            margin-bottom: 5px;
        }
    }
</style>
<script>
    import {
        api_add_progress
    } from '../../../api/demand-schedules'
    export default {
        data(){
            return {
                visible: false,
                typeList:[
                    {label:'新增功能',value:0},
                    {label:'功能优化',value:1},
                    {label:'BUG处理',value:2}
                    ],
                statusList:[
                    {label:'未开始',value:0},
                    {label:'已计划',value:1},
                    {label:'需要设计',value:2},
                    {label:'待研发',value:3},
                    {label:'研发中',value:4},
                    {label:'研发完毕',value:5},
                    {label:'测试中',value:6},
                    {label:'测试完毕',value:7},
                    {label:'已发布',value:8},
                    {label:'已作废',value:9},
                    ],
                priorityList:[
                    {label:'低',value:0},
                    {label:'中',value:1},
                    {label:'高',value:2}
                ],
                addImgBtn:{
                    'position': 'absolute',
                    'top':'1px',
                    'left':'572px',
                    'z-index':'1000',
                },
                raiserList:[],
                leadingList:[],
                developerList:[],
                urlCreate:'get|user',
                initiateTime: {
                    disabledDate: (time)=> {
                        return time.getTime() < new Date(new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()).getTime()-1);
                    }
                },
                registerTime:{
                    disabledDate: (time)=> {
                        return time.getTime() > new Date(new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()).getTime()-1);
                    }
                },
                causeWickets:false,
                showLeadingRemark:false,
                showDeveloperRemark:false,
                showTestRemark:false,
                remarkTitle:''
            }
        },
        methods: {
            handleBtn(status){
                return status===0?'开启':'暂停'
            },
            open(){},
            liftBtn(btn,type){
                if(btn==='暂停'){
                    if(type==='test'){
                        this.remarkTitle = '请填写暂停测试原因：';
                        this.showTestRemark = true;
                        this.showDeveloperRemark = false;
                        this.showLeadingRemark = false;
                    }else if(type==='developer'){
                        this.remarkTitle = '请填写暂停开发原因：';
                        this.showDeveloperRemark = true;
                        this.showTestRemark = false;
                        this.showLeadingRemark = false;
                    }else{
                        this.remarkTitle = '请填写暂停需求原因：';
                        this.showLeadingRemark = true;
                        this.showDeveloperRemark = false;
                        this.showTestRemark = false;
                    }
                }else{
                    if(type==='test'){
                    	this.editData.test_stop_remark = '';
                    	this.editData.test_status = 1;
                    	this.$message({type:'info',message:'开启成功！点击确定保存！'});
                    }else if(type==='developer'){
                        this.editData.developer_stop_remark = '';
                        this.editData.developer_status = 1;
                        this.$message({type:'info',message:'开启成功！点击确定保存！'});
                    }else{
                        this.editData.leading_stop_remark = '';
                        this.editData.leading_status = 1;
                        this.$message({type:'info',message:'开启成功！点击确定保存！'});
                    }
                }
            },
            remark_submit(type){
                if(type==='test'){
                    this.editData.test_status = 0;
                    this.showTestRemark= false;
                    this.$message({type:'info',message:'暂停成功！点击确定保存！'});
                }else if(type==='developer'){
                    this.editData.developer_status = 0;
                    this.showDeveloperRemark = false;
                    this.$message({type:'info',message:'暂停成功！点击确定保存！'});
                }else{
                    this.editData.leading_status = 0;
                    this.showLeadingRemark = false;
                    this.$message({type:'info',message:'暂停成功！点击确定保存！'});
                }
            },
            close_remark(type){
                if(type==='test'){
                    this.showTestRemark= false;
                }else if(type==='developer'){
                    this.showDeveloperRemark = false;
                }else{
                    this.showLeadingRemark = false;
                }
            },
            editor_content_change(val){
                this.editData.content = val;
            },
            init_params(){
                let data = window.clone(this.editData);
                data.raise_time = this.transferTime(this.editData, 'raise_time');
                data.plan_listing_time = this.transferTime(this.editData,'plan_listing_time');
                data.listing_time = this.transferTime(this.editData, 'listing_time');
                data.plan_complete_time = this.transferTime(this.editData, 'plan_complete_time');
                data.real_complete_time = this.transferTime(this.editData, 'real_complete_time');
                data.plan_developer_time = this.transferTime(this.editData, 'plan_developer_time');
                data.real_developer_time = this.transferTime(this.editData, 'real_developer_time');
                data.plan_test_time = this.transferTime(this.editData, 'plan_test_time');
                data.real_test_time = this.transferTime(this.editData, 'real_test_time');
                return data
            },
            save(){
                let data = this.init_params();
                this.$http(api_add_progress,data).then(res=>{
                    this.$message({type:'success',message:res.message||res});
                    this.$emit('save-success');
                    this.visible = false;
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('api_add_progress',false);
                    },200);
                });
            },
            transferTime(param, timeName){
                if(this.action.value === 'add'){
                    if(param[timeName]){
                        return datef('YYYY-MM-dd', param[timeName].getTime()/1000);
                    }else {
                        if(this.editData.can_delete!==1&& timeName==='raise_time'){
                            return datef('YYYY-MM-dd', new Date()/1000);
                        }
                        return '';
                    }
                } else {
                    if(param[timeName]){
                        return datef('YYYY-MM-dd', param[timeName]/1000);
                    }else {
                        return '';
                    }
                }
            },
            fix_params_account({page,pageSize,keyword}){
                return {
                    page:page,
                    pageSize:pageSize,
                    snType:'realname',
                    snText:keyword?keyword:''

                };
            },
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
        },
        computed:{
            isEdit(){
                return this.editData.can_delete!==1
            },
            testUser:{
                get(){
                    return {label:this.editData.tester,
                        value:this.editData.test_id}
                },
                set(val){
                    this.editData.tester = val.label;
                    this.editData.test_id = val.value;
                }
            },
            developerUser:{
                get(){
                    return {label:this.editData.developer,
                        value:this.editData.developer_id}
                },
                set(val){
                    this.editData.developer = val.label;
                    this.editData.developer_id = val.value;
                }
            },
            fronterUser:{
                get(){
                    return {label:this.editData.fronter,
                        value:this.editData.fronter_id}
                },
                set(val){
                    this.editData.fronter = val.label;
                    this.editData.fronter_id = val.value;
                }
            },
            leadingUser:{
                get(){
                    return {label:this.editData.leading,
                        value:this.editData.leading_id}
                },
                set(val){
                    this.editData.leading = val.label;
                    this.editData.leading_id = val.value;
                }
            },
            raiserUser:{
                get(){
                    return {label:this.editData.raiser,
                        value:this.editData.raiser_id}
                },
                set(val){
                    this.editData.raiser = val.label;
                    this.editData.raiser_id = val.value;
                }
            }
        },
        watch: {
            visible(val){
                this.$emit('input',val);
                if(!val){
                    this.showTestRemark= false;
                    this.showDeveloperRemark = false;
                    this.showLeadingRemark = false;
                }
            },
            value(val) {
                this.visible = val;
            },
        },
        props: {
            value:{
                required:true,
                type: Boolean,
            },
            action:{
                required:true,
                type: Object,
            },
            editData:{
                required:true,
                type: Object,
            }
        },
        components: {
            pageDialog:require("../../../components/page-dialog.vue").default,
            kindeditor:require('@/components/kindeditor.vue').default,
            imageUpload:require("../../customer-service/smt/inbox/image-upload.vue").default,
            scrollSelect:require('../../../components/scroll-select.vue').default,
            uiLimitNumber:require('@/components/ui-limit-number').default,
            remarkEdit:require('./remark-edit').default
        },
    }
</script>
