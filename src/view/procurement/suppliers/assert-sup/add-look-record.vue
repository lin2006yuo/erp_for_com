<template>
    <page class="p-dialog-error-info-search">
        <page-dialog :title="title" v-model="show" @open="open"  left="30%" size="small"
                     :close-on-click-modal="false">
            <el-form :model="lookEditData" ref="lookEditData" :rules="rules"  class="mb-sm">
                <el-row>
                    <el-col >
                        <el-form-item label="洽谈时间：" :prop="!isAdd?'discuss_time':''">
                            <el-date-picker
                                class="inline date"
                                v-model="lookEditData.discuss_time"
                                v-if="!isAdd"
                                style="width: 178px;"
                                type="date"
                                placeholder="洽谈时间"></el-date-picker>
                            <times v-else :time="lookEditData.discuss_time"></times>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <el-form-item label="洽谈方式：" :prop="!isAdd?'discuss_way':''">
                            <label-select
                                :edit="!isAdd"
                                v-model="lookEditData.discuss_way"
                                :lists="wayList"
                                clearable
                            ></label-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="showOtherDiscussWay">
                    <el-col :span="20">
                        <el-form-item :prop="!isAdd?'other_discuss_way':''">
                            <ui-input class="left-distance" v-model="lookEditData.other_discuss_way" placeholder="其它洽谈方式" :edit="!isAdd"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <el-form-item label="谈成项目：" :prop="!isAdd?'make_project':''">
                            <label-select
                                :edit="!isAdd"
                                v-model="lookEditData.make_project"
                                :lists="pictureList"
                                @change="picture_change"
                                clearable
                            ></label-select>
                            <el-row class="mt-mini">
                                <el-tag
                                    v-for="item in selectPicture"
                                    :key="item.value"
                                    :closable="true"
                                    class="mr-xs"
                                    @close="close_pictur(item)"
                                    type="gray">
                                    {{item.label}}
                                </el-tag>
                            </el-row>
                            <span v-if="isAdd" class="ml-lg">{{filter_pictur(lookEditData.make_project)}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="showOtherMakeProject">
                    <el-col :span="20">
                        <el-form-item :prop="!isAdd?'other_make_project':''">
                            <ui-input class="left-distance" v-model="lookEditData.other_make_project" placeholder="其它谈成项目"  :edit="!isAdd"></ui-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <el-form-item
                            :show-message="!isAdd"
                            label="报销凭证：" :prop="!isAdd?'expense_reimbursement_voucher':''">
                            <image-upload v-model="lookEditData.expense_reimbursement_voucher"
                                          @remove-img="remove_expense_reimbursement_voucher"
                                          :download-img="downloadImg"
                                          :is-look="isAdd"
                                          :show-download="true"
                                          :maximum="10"
                                          :maximize="1048576*5"
                                          class="inline"
                                          ref="images-file"></image-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col >
                        <el-form-item
                            :show-message="!isAdd"
                            label="现场图片：" :prop="!isAdd?'expense_reimbursement_voucher':''">
                            <image-upload v-model="lookEditData.scene_picture"
                                          @remove-img="remove_scene_picture"
                                          :download-img="downloadImg"
                                          :is-look="isAdd"
                                          :show-download="true"
                                          :maximum="5"
                                          :maximize="1048576*5"
                                          class="inline"
                                          ref="images-file"></image-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col >
                        <el-form-item  :prop="!isAdd?'content':''" label="洽谈详情：">
                            <div v-if="!isAdd">
                                <el-input class="inline" type="textarea" :autosize="{ minRows: 7}" v-model="lookEditData.content" placeholder="请填写洽谈内容"></el-input>
                            </div>
                            <div v-else class="breakAll">
                                <span>{{lookEditData.content}}</span>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer">
                <request-button v-if="!isAdd" req-key="url_add_discuss_record" @click.native="add('lookEditData')">确定
                </request-button>
                <el-button size="mini" class="inline" @click.native="close">取消</el-button>
            </div>
        </page-dialog>
    </page>
</template>
<style lang="stylus">
    .p-dialog-error-info-search {
        .page-dialog .dialog__body {
            padding: 0 10px 5px 10px;
            color: #475669;
            font-size: 1.2rem;
            overflow-x: hidden;
            overflow-y: auto !important;
            box-sizing: border-box;
            max-height: 70%;
            .input-nomargin {
                .el-select__input {
                    width: 1px !important;
                    margin-left: 0 !important;
                }
            }
            .mt-sm {
                margin-bottom 60px;
                max--height: 520px;
            }
            .opration_content{
                word-break: break-all;
            }
            .suppliers-record-content{
                min-height :200px;
            }
            .left-distance{
                margin-left :69.47px;
            }
        }
    }

</style>
<script>
    import {
        api_get_way,
        api_get_picture
    } from '../../../../api/assert-sup';
    export default {
        page: {
            devinfo: {
                frontEnd: '覃宏峰',
                backEnd: '蓝术术',
                createTime: '2017-1-9',
                updateTime: '2017-9-26'
            }
        },
        data() {
            return {
                input_nomargin: "input-nomargin",
                show: this.value,
                showOtherMakeProject:false,
                showOtherDiscussWay:false,
                wayList:[],
                pictureList:[],
                selectPicture:[],
                rules:{
                    discuss_time:[
                        { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                    ],
                    discuss_way:[
                        {required: "true", message: "洽谈方式不能为空", trigger: "blur,change",type: "number"}
                    ],
                    other_discuss_way:[
                        {required: "true", message: "其它洽谈方式不能为空",trigger: "blur",typ:'string'}
                    ],
                    make_project:[
                        {type:'array',required: "true", message: "谈成项目不能为空", trigger: "blur,change"}
                    ],
                    other_make_project:[
                        {required: "true", message: "其它谈成项目不能为空", trigger: "blur",typ:'string'}
                    ],
                    expense_reimbursement_voucher:[
                        {required: "true", message: "报销凭证不能为空", trigger: "blur,change",type:'array'}
                    ],
                    scene_picture:[
                        {required: "true", message: "现场图片不能为空", trigger: "blur,change",type:'array'}
                    ],
                    content: [
                        {required: "true", message: "洽谈详情不能为空", trigger: "blur,change",type:'string'},
                        {required: "true", min:200,message: "请最少输入200个字节", trigger: "blur,change",type:'string'}
                    ]
                }
            }
        },
        created(){
            this.get_picture_type();
            this.get_way_type()
        },
        methods: {
            open() {
                this.selectPicture=[];
                this.get_picture_type();
            },
            close() {
                this.show = false;
            },
            add(formName){
                this.$refs[formName].validate((valid)=>{
                    if (valid){
                        this.$emit('update-discuss-data',this.lookEditData);
                    }else {
                        this.$message({type:'error',message:'还有必填项没被选择'});
                        this.$reqKey('url_add_discuss_record', false);
                        return false
                    }
                })

            },
            picture_change(val){
                this.pictureList.forEach(row=>{
                    if (row.value===val){
                        row.disabled=true,
                        this.selectPicture.push(row)
                    }
                });
            },
            close_pictur(item){
                let index = this.selectPicture.findIndex(row=>row.value===item.value);
                this.pictureList.forEach(row=>{
                    if (row.value===item.value){
                        row.disabled=false;
                    }
                });
                if(index>-1){
                    this.selectPicture.splice(index,1);
                    this.lookEditData.make_project(index,1)
                }
            },
            filter_pictur(data){
                let val=[];
                data.forEach(row=>{
                    this.pictureList.forEach(item=>{

                        if (row===item.value){
                            val.push(item.label)
                        }
                    })
                });
                return val.join('/')
            },
            get_picture_type() {
                this.$http(api_get_picture).then(res => {
                    this.pictureList = res.map(row => {
                        return {
                            value: row.label,
                            label: row.name,
                            disabled:false,
                        }
                    });
                }).catch(code => {
                    console.log(code);
                })
            },
            get_way_type() {
                this.$http(api_get_way).then(res => {
                    this.wayList = res.map(row => {
                        return {
                            value: row.label,
                            label: row.name
                        }
                    });
                }).catch(code => {
                    console.log(code);
                })
            },
            downloadImg(file){
                downloadFile({
                    url:`${config.apiHost}supplier/download-image`,
                    get: {file: file},
                    fileName: file.slice(file.lastIndexOf('/') - 1, file.lastIndexOf('.')),
                    suffix: file.slice(file.lastIndexOf('.'))
                });
            },
            remove_expense_reimbursement_voucher(arr){
                this.removeExpenseReimbursementVoucher.push(...arr);
            },
            remove_scene_picture(arr){
                this.removeScenePicture.push(...arr);
            },

        },
        watch: {
            show(val) {
                this.$emit('input', val);
            },
            selectPicture(val){
                this.lookEditData.make_project=val.map(row=>row.value)
            },
            value(val) {
                this.show = val;
            },
            "lookEditData.discuss_way":{
                immediate: true,
                handler(val) {
                    if (!!val&&val===6) {
                        this.showOtherDiscussWay=true
                    }else{
                        this.showOtherDiscussWay=false
                    }
                }
            },
            "lookEditData.make_project":{
                immediate: true,
                handler(val) {
                    if (!!val){
                        this.showOtherMakeProject=val.some(row=>row===9)
                    }
                }
            }
        },
        computed: {
            emptyText() {
                return this.firstLoading ? '等待查询数据中...' : '暂无数据'
            }
        },
        filters:{
            filterDate(val){
                return val?datef('YYYY-MM-dd',val/1000):'-- --';

            },
            filterName(val){
                return val?val:'--';
            }
        },
        props: {
            lookEditData:{
                type: Object
            },
            value: {
                required: true,
                type: Boolean
            },
            isAdd:{
                required: true,
                type: Boolean
            },
            title:{
                required: true,
                type: String
            },
            removeScenePicture:{
                type:Array,
                default:[]
            },
            removeExpenseReimbursementVoucher:{
                type:Array,
                default:[]
            }
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            searchCard: require('@/components/search-card').default,
            uiInput: require('@/components/ui-input').default,
            labelSelect: require('@/components/label-select').default,
            requestButton: require('@/global-components/request-button').default,
            imageUpload: require("./image-upload").default,
            labelItem: require('@/components/label-item').default
        }
    }
</script>
