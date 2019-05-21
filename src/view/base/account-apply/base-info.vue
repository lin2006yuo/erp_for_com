<template>
    <div>
        <el-form :model="tempForm"
                 ref="baseForm"
                 label-width="100px"
                 class="c-account-apply-base">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="创建时间：">
                        <span v-if="(flag||!flag)&&!isEdit">{{tempForm.create_time|fymd}}</span>
                        <el-date-picker v-model="tempForm.create_time"
                                        type="date" style="width: 100%"
                                        disabled v-else>
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="注册人：">
                        <span v-if="(flag||!flag)&&!isEdit">{{tempForm.register_txt}}</span>
                        <super-select v-model="tempForm.register_id"
                                      :options="creatorData"
                                      :storage-key="`accountApplyBaseCreator`"
                                      class="width-super"
                                      :disabled="tempForm.status===5"
                                      v-else>
                        </super-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="平台：" prop="channel_id"
                                  :rules="[{required:true,type:'number',message:'请选择平台',trigger:'change'}]">
                        <span v-if="(flag||!flag)&&!isEdit">{{tempForm.channel_txt}}</span>
                        <el-select v-model="tempForm.channel_id"
                                   :disabled="tempForm.status===5||!!flag"
                                   placeholder="请输入/请选择"
                                   style="width: 100%" v-else
                                   @change="$emit('get-site',$event,tempForm.company_type)">
                            <el-option v-for="item in channelData"
                                       :label="item.label"
                                       :value="item.value"
                                       :key="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <!--<el-row>-->
            <!--<el-col :span="24">-->
            <!--<el-form-item label="公司类型：">-->
            <!--<span v-if="(flag||!flag)&&!isEdit">{{companyTypes}}</span>-->
            <!--<el-select v-model="tempForm.company_type"-->
            <!--:disabled="tempForm.status===5"-->
            <!--@change="$emit('get-site',tempForm.channel_id,$event)"-->
            <!--style="width: 100%" v-else>-->
            <!--<el-option-->
            <!--v-for="item in companyType"-->
            <!--:key="item.value"-->
            <!--:label="item.label"-->
            <!--:value="item.value">-->
            <!--</el-option>-->
            <!--</el-select>-->
            <!--</el-form-item>-->
            <!--</el-col>-->
            <!--</el-row>-->
            <el-row>
                <el-col :span="20">
                    <el-form-item label="公司名称：" prop="company_id"
                                  :rules="[{required:true,type:'number',message:'请选择公司',trigger:'change'}]">
                        <span v-if="(flag||!flag)&&!isEdit">{{tempForm.company_name}}</span>
                        <el-input v-model="tempForm.company_name"
                               :placeholder="placeholder"
                               :disabled="true"
                               style="width: 100%"
                               v-else>
                            </el-input>
                    </el-form-item>
                </el-col>
                <!--选择公司-->
                <el-col :span="4" v-if="isEdit">
                    <el-button type="primary" size="mini" class="ml-sm"
                               :disabled="!tempForm.channel_id || tempForm.status===5"
                               @click.native="open_company">选择公司
                    </el-button>
                </el-col>
            </el-row>
            <template v-if="!tempForm.company_type">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="营业执照图片：">
                            <span v-if="!businessLicence.length&&(!flag||flag===2)&&isEdit"
                                  class="disabled">
                                <i class="el-icon-upload2"></i>上传附件
                            </span>
                            <span v-if="!businessLicence.length&&(flag||!flag)&&!isEdit">
                                没有图片
                            </span>
                            <upload-img v-if="businessLicence.length"
                                        :images="businessLicence"
                                        :edit="false">
                            </upload-img>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="公司注册号：">
                            <span v-if="(flag||!flag)&&!isEdit">{{tempForm.register_number}}</span>
                            <el-input v-model="tempForm.register_number"
                                      disabled v-else></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="公司地址+邮编：">
                    <span v-if="(flag||!flag)&&!isEdit">{{tempForm.company_address}}</span>
                    <el-input v-model="tempForm.company_address"
                              disabled v-else></el-input>
                </el-form-item>
            </template>
            <el-row>
                <el-col :span="12">
                    <el-form-item :label="`${tempForm.company_type?'':'法人'}姓名：`">
                        <span v-if="(flag||!flag)&&!isEdit">{{tempForm.corporation}}</span>
                        <el-input v-model="tempForm.corporation"
                                  disabled v-else></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="`${tempForm.company_type?'':'法人'}身份证号：`">
                        <span v-if="(flag||!flag)&&!isEdit">{{tempForm.corporation_id}}</span>
                        <el-input v-model="tempForm.corporation_id"
                                  disabled v-else></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="身份证正面照：">
                        <span v-if="!IDFront.length&&(!flag||flag===2)&&isEdit" class="disabled">
                             <i class="el-icon-upload2"></i>上传附件
                        </span>
                        <span v-if="!IDFront.length&&(flag||!flag)&&!isEdit">
                            没有图片
                        </span>
                        <upload-img v-if="IDFront.length"
                                    :images="IDFront"
                                    :edit="false">
                        </upload-img>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="身份证反面照：">
                        <span v-if="!IDBack.length&&(!flag||flag===2)&&isEdit" class="disabled">
                            <i class="el-icon-upload2"></i>上传附件
                        </span>
                        <span v-if="!IDBack.length&&(flag||!flag)&&!isEdit">没有图片</span>
                        <upload-img :images="IDBack"
                                    :edit="false">
                        </upload-img>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="法人地址+邮编：">
                <span v-if="(flag||!flag)&&!isEdit">{{tempForm.corporation_address}}</span>
                <el-input v-model="tempForm.corporation_address"
                          disabled v-else></el-input>
            </el-form-item>
            <el-row>
                <el-col :span="20">
                    <el-form-item label="服务器：" prop="server_id">
                        <span v-if="(flag||!flag)&&!isEdit">{{tempForm.service_ip}}</span>
                        <el-input v-model="tempForm.service_ip"
                                  :disabled="!tempForm.company_id||(!!tempForm.company_id&&!!tempForm.ip_disabled)"
                                  v-else>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4" v-if="isEdit">
                    <el-button type="primary" size="mini" class="ml-sm"
                               :disabled="tempForm.status===5"
                               @click.native="open_server">选择服务器
                    </el-button>
                </el-col>
            </el-row>
            <el-form-item label="注册用IP：" prop="register_ip"
                          v-if="tempForm.channel_id===''||tempForm.channel_id===2">
                <span v-if="(flag||!flag)&&!isEdit">{{tempForm.register_ip}}</span>
                <el-input v-model.trim="tempForm.register_ip"
                          :disabled="tempForm.status===5"
                          v-else></el-input>
            </el-form-item>
            <el-row>
                <el-col :span="20">
                    <el-form-item label="手机号：" prop="phone"
                                  :show-message="!tempForm.phone"
                                  :rules="[{required:true,message:'请选择手机号',trigger:'blur'}]">
                        <span v-if="(flag||!flag)&&!isEdit">{{tempForm.phone}}</span>
                        <el-input v-model="tempForm.phone" disabled v-else></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4" v-if="isEdit">
                    <el-button type="primary" size="mini" class="ml-sm"
                               :disabled="tempForm.status===5"
                               @click="phoneShow=true">选择手机号
                    </el-button>
                </el-col>
            </el-row>
            <el-form-item label="">
                <template v-if="(flag||!flag)&&!isEdit">
                    <el-button type="primary" size="mini"
                               :disabled="tempForm.status===5"
                               @click.native="isEdit=true">编 辑
                    </el-button>
                </template>
                <template v-else>
                    <el-button type="primary" size="mini"
                               :disabled="tempForm.status===5"
                               @click="submit">确 定
                    </el-button>
                    <el-button size="mini"
                               :disabled="tempForm.status===5"
                               @click="cancel">取 消
                    </el-button>
                </template>
            </el-form-item>
        </el-form>
        <select-service v-model="serviceShow"
                        :channel-id="channelId"
                        @export-service="get_service">
        </select-service>
        <phone-email v-model="phoneShow"
                     :label="`phone`"
                     @export-data="get_phone">
        </phone-email>
        <check-company v-model="companyShow"
                       :channel-id="channelId"
                       @export-company="get_company">
        </check-company>
    </div>
</template>

<script>
    import scrollSelect from '@/components/scroll-select.vue';
    import uploadImg from '@/components/upload-img';
    import selectService from './select-service';
    import phoneEmail from './phone-email';
    import checkCompany from './check-company';
    import {api_get_company_data} from '@/api/account-information';

    export default {
        name: "base-info",
        data() {
            return {
                tempForm: this.form,
                channelData: [
                    {label: 'ebay', value: 1, name: 'ebay'},
                    {label: '亚马逊平台', value: 2, name: 'amazon'}
                ],
                companyType: [
                    {label: '企业', value: 0},
                    {label: '个人', value: 1}
                ],
                businessLicence: [],
                IDFront: [],
                IDBack: [],
                serviceShow: false,
                phoneShow: false,
                companyShow: false,
                isEdit: false,
                channelId: 0
            }
        },
        mounted() {
            this.init_base();
        },
        watch: {
            'tempForm.company_name': {
                handler() {
                    this.get_company_info(this.tempForm.company_id)
                },
                deep:true
            }
        },
        computed: {
            placeholder() {
                if (!this.tempForm.channel_id) {
                    return '请先选择平台';
                } else if (this.tempForm.company_type === '') {
                    return '请先选择公司类型';
                } else {
                    return '请选择';
                }
            },
            companyTypes() {
                let find = this.companyType.find(row => row.value === this.tempForm.company_type);
                if (find) {
                    return find.label;
                }
            }
        },
        methods: {
            init_base() {
                this.businessLicence = [];
                this.IDFront = [];
                this.IDBack = [];
                if (this.flag) {
                    this.isEdit = false;
                } else {
                    this.isEdit = true;
                }
                if (this.flag) {
                    if (this.tempForm.charter_url) {
                        this.businessLicence = [{name: this.tempForm.charter_url}];
                    }
                    if (this.tempForm.corporation_id_front) {
                        this.IDFront = [{name: this.tempForm.corporation_id_front}];
                    }
                    if (this.tempForm.corporation_id_contrary) {
                        this.IDBack = [{name: this.tempForm.corporation_id_contrary}];
                    }
                }
            },
            test() {
                console.log(1);
            },
            get_company_info(company_id) {
                this.$http(api_get_company_data, company_id).then(res => {
                    this.$set(this, 'businessLicence', res.charter_url ? [{name: res.charter_url}] : []);
                    this.$set(this.tempForm, 'register_number', res.company_registration_number);
                    this.$set(this.tempForm, 'company_address', res.company_address_zip);
                    this.$set(this.tempForm, 'corporation', res.corporation);
                    this.$set(this.tempForm, 'corporation_id', res.corporation_identification);
                    this.$set(this, 'IDFront', res.corporation_id_front ? [{name: res.corporation_id_front}] : []);
                    this.$set(this, 'IDBack', res.corporation_id_contrary ? [{name: res.corporation_id_contrary}] : []);
                    this.$set(this.tempForm, 'corporation_address', res.corporation_address_zip);
                }).catch(error => {
                    console.error(error);
                });
                this.$emit('site-info', true);
            },
            open_server() {
                this.channelId = this.tempForm.channel_id ? this.tempForm.channel_id : 0;
                this.serviceShow = true;
            },
            open_company() {
                this.channelId = this.tempForm.channel_id ? this.tempForm.channel_id : 0;
                this.companyShow = true;
            },
            get_service(row) {
                this.$set(this.tempForm, 'server_id', row.id);
                this.$set(this.tempForm, 'service_ip', row.name);
                this.serviceShow = false;
            },
            get_phone(row) {
                this.$set(this.tempForm, 'phone_id', row.id);
                this.$set(this.tempForm, 'phone', row.phone);
                this.phoneShow = false;
            },
            //回传选中公司
            get_company(row) {
                this.$set(this.tempForm, 'company_id', row.id);
                this.$set(this.tempForm, 'company_name', row.company);
                this.companyShow = false;
            },
            submit() {
                this.$refs.baseForm.validate(valid => {
                    if (valid) {
                        let data = {
                            register_id: this.tempForm.register_id,
                            channel_id: this.tempForm.channel_id,
                            company_id: this.tempForm.company_id,
                            server_id: this.tempForm.service_ip ? this.tempForm.server_id : '',
                            register_ip: this.tempForm.register_ip,
                            phone_id: this.tempForm.phone_id
                        };
                        this.$emit('submit-base', data);
                    } else {
                        console.error('验证不通过');
                    }
                })
            },
            cancel() {
                if (!this.flag) {
                    if (this.tempForm.id) {//已保存
                        this.isEdit = false;
                    } else {//未保存
                        this.$set(this.tempForm, 'register_txt', '');
                        this.$set(this.tempForm, 'register_id', '');
                        this.$set(this.tempForm, 'channel_id', '');
                        this.$set(this.tempForm, 'company_type', '');
                        this.$set(this.tempForm, 'company_id', '');
                        this.$set(this.tempForm, 'company_name', '');
                        this.$set(this.tempForm, 'phone_id', '');
                        this.$set(this.tempForm, 'phone', '');
                        this.$set(this.tempForm, 'server_id', '');
                        this.$set(this.tempForm, 'service_ip', '');
                        this.$set(this.tempForm, 'register_ip', '');
                    }
                } else {
                    this.isEdit = false;
                    // this.$set(this.tempForm,'register_txt',this.everForm.register_txt);
                    // this.$set(this.tempForm,'register_id',this.everForm.register_id);
                    // this.$set(this.tempForm,'channel_id',this.everForm.channel_id);
                    // this.$set(this.tempForm,'company_type',this.everForm.company_type);
                    // this.$set(this.tempForm,'company_id',this.everForm.company_id);
                    // this.$set(this.tempForm,'phone_id',this.everForm.phone_id);
                    // this.$set(this.tempForm,'phone',this.everForm.phone);
                    // this.$set(this.tempForm,'server_id',this.everForm.server_id);
                    // this.$set(this.tempForm,'service_ip',this.everForm.service_ip);
                    // this.$set(this.tempForm,'register_ip',this.everForm.register_ip);
                }
            },
        },
        props: {
            form: {
                type: Object,
                required: true
            },
            creatorData: Array,
            companyData: Array,
            flag: {},
            everForm: {
                type: Object
            },
        },
        components: {
            scrollSelect, uploadImg, selectService, phoneEmail, checkCompany
        },
    }
</script>
