<template>
    <div class="c-account-apply-register">
        <!--{{register.accounts}}-->
        <el-form :model="register" ref="registerForm" label-width="120px">
            <el-row v-for="(item,index) in register.accounts" :key="index" class="mb-sm">
                <el-col :span="16">
                    <el-card class="mt-xs register-account-message"
                             :body-style="{position:'relative'}">
                        <div class="circle" v-if="index">
                            <div class="word">{{index}}</div>
                        </div>
                        <el-form-item label="账号全称：" required>
                            <el-col :span="18">
                                <span v-if="(flag||!flag)&&!isEdit">{{item.account_name}}</span>
                                <el-input v-model.trim="item.account_name"
                                          :disabled="register.status===5"
                                          v-else></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="账号密码：">
                            <el-col :span="18">
                                <span v-if="(flag||!flag)&&!isEdit">****</span>
                                <el-input v-model.trim="item.password"
                                          :type="item.password_type?'password':'text'"
                                          :disabled="!!(flag&&!item.is_eye)"
                                          v-else></el-input>
                            </el-col>
                            <img src="../../../assets/eye.svg"
                                 class="ml-sm"
                                 v-if="(!flag&&isEdit)||(flag&&item.is_eye&&isEdit)"
                                 @mouseup="item.password_type=true"
                                 @mousedown="item.password_type=false"
                                 style="vertical-align: middle;width: 20px;height: 20px;">
                            <el-button type="primary" size="mini"
                                       class="ml-sm"
                                       v-if="(flag&&!item.is_eye&&isEdit)||(!flag&&!isEdit)"
                                       :disabled="register.status===5"
                                       @click.native="show_password(item.id,index)">显示密码
                            </el-button>
                        </el-form-item>
                        <el-form-item label="店铺名称：">
                            <el-col :span="18">
                                <span v-if="(flag||!flag)&&!isEdit">{{item.shop_name}}</span>
                                <el-input v-model.trim="item.shop_name"
                                          :disabled="form.status===5"
                                          v-else></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="账号简称：" prop="phone">
                            <el-col :span="18">
                                <span v-if="(flag||!flag)&&!isEdit">{{item.account_code}}</span>
                                <el-input v-model.trim="item.account_code"
                                          :disabled="form.status===5"
                                          v-else></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="站点：">
                            <el-col :span="18">
                                <span v-if="(flag||!flag)&&!isEdit">{{site_code(item.site_code)}}</span>
                                <el-select v-model="item.site_code"
                                           filterable
                                           clearable
                                           :multiple="!!(form.channel_id===2)"
                                           :disabled="form.status===5"
                                           style="width:100%" v-else
                                           @change="select_site($event,index)">
                                    <el-option v-for="item in siteOptions"
                                               :label="item.label"
                                               :value="item.value"
                                               :key="item.value"
                                               :disabled="disabled_site(item,)">
                                    </el-option>
                                </el-select>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="邮箱：">
                            <el-col :span="18">
                                <span v-if="(flag||!flag)&&!isEdit">{{item.email_txt}}</span>
                                <el-input v-model.trim="item.email_txt"
                                          disabled v-else></el-input>
                            </el-col>
                            <el-button type="primary" size="mini"
                                       class="ml-sm" v-if="isEdit"
                                       :disabled="form.status===5"
                                       @click.native="open_email(index)">选择邮箱
                            </el-button>
                        </el-form-item>
                        <el-form-item label="信用卡：">
                            <el-col :span="18">
                                <span v-if="(flag||!flag)&&!isEdit">{{item.credit_card_txt}}</span>
                                <el-input v-model.trim="item.credit_card_txt"
                                          disabled v-else></el-input>
                            </el-col>
                            <el-button type="primary" size="mini"
                                       class="ml-sm" v-if="isEdit"
                                       :disabled="form.status===5"
                                       @click.native="open_credit_card(index)">选择信用卡
                            </el-button>
                        </el-form-item>
                        <!--收款账号开始-->
                        <el-row v-for="(row,i) in item.collection_data"
                                :key="i" class="mt-xs">
                            <el-col :span="19">
                                <el-card class="mt-xs register-gathering-message"
                                         :body-style="{position:'relative'}">
                                    <div class="circle" v-if="i">
                                        <div class="word">{{show_word(i)}}</div>
                                    </div>
                                    <el-form-item label="收款账号：">
                                        <span v-if="(flag||!flag)&&!isEdit">{{row.collection_account}}</span>
                                        <el-input v-model.trim="row.collection_account"
                                                  v-else></el-input>
                                    </el-form-item>
                                    <el-form-item label="收款账号平台：">
                                        <span v-if="(flag||!flag)&&!isEdit">{{row.collection_type}}</span>
                                        <el-input v-model.trim="row.collection_type"
                                                  v-else></el-input>
                                    </el-form-item>
                                    <!--:disabled="form.status===5"-->
                                    <el-form-item label="收款账号登录邮箱：">
                                        <span v-if="(flag||!flag)&&!isEdit">{{row.collection_email}}</span>
                                        <el-input v-model.trim="row.collection_email"
                                                  v-else></el-input>
                                    </el-form-item>
                                    <el-form-item label="收款方：">
                                        <span v-if="(flag||!flag)&&!isEdit">{{row.collection_name}}</span>
                                        <el-input v-model.trim="row.collection_name"
                                                  v-else></el-input>
                                    </el-form-item>
                                </el-card>
                            </el-col>
                            <template>
                                <span v-if="i&&isEdit" style="font-size: 20px;"
                                      class="ml-sm"
                                      @click="del_pay_info(item,i)">
                                    <i class="el-icon-delete"></i>
                                </span>
                                <!--v-if="i&&isEdit"-->
                                <!--v-if="item.collection_data.length>1&&isEdit"-->
                                <!--<el-button v-if="item.collection_data.length==1&&isEdit" type="primary"-->
                                           <!--size="mini" class="ml-sm"-->
                                           <!--@click.native="clear_pay_info(index)">清空-->
                                <!--</el-button>-->
                                <el-button v-if="!i&&isEdit" type="primary"
                                           size="mini" class="ml-sm"
                                           :disabled="form.status===5"
                                           @click.native="add_pay_info(item,index)"> 新增
                                </el-button>
                            </template>
                        </el-row>
                    </el-card>
                </el-col>
                <template>
                    <el-button v-if="!index&&isEdit" type="primary"
                               size="mini" class="ml-sm"
                               :disabled="form.status===5"
                               @click.native="add_account"> 新增
                    </el-button>
                    <span v-if="index&&isEdit" style="font-size: 20px;" class="ml-sm"
                          @click="del_account(index)">
                        <i class="el-icon-delete"></i>
                    </span>
                </template>
            </el-row>
            <el-form-item label="">
                <template v-if="(flag||!flag)&&!isEdit">
                    <el-button type="primary" size="mini"
                               :disabled="register.status===5"
                               @click.native="isEdit=true">编 辑
                    </el-button>
                </template>
                <template v-else>
                    <el-button size="mini" type="primary"
                               :disabled="register.status===5"
                               v-if="register.status<=2"
                               @click.native="submit('submit_register')">提交注册信息
                    </el-button>
                    <el-button size="mini" type="primary"
                               :disabled="register.status===5"
                               @click.native="submit('save')">确 定
                    </el-button>
                    <el-button size="mini" :disabled="register.status===5"
                               @click.native="cancel">取 消
                    </el-button>
                </template>
            </el-form-item>
        </el-form>
        <phone-email v-model="emailShow"
                     :label="`email`"
                     :channel-id="channel_id"
                     @export-data="get_email">
        </phone-email>
        <select-credit-card v-model="creditCardShow"
                            :titleCredit="addEditcardTitle"
                            @export-credit-card="get_credit_card">
        </select-credit-card>
        <retype-password v-model="passwordShow"
                         :retype-data="passwordData"
                         :password-url="passwordUrl"
                         @get-password="get_password">
        </retype-password>
        <!--收款账号弹框-->
        <!--<shroff-account-number v-model="accountNumberShow"-->
                               <!--:titleAccount="selectCardTitle"-->
                               <!--@checkAccountNumber="checkAccountInfor"></shroff-account-number>-->
    </div>
</template>

<style lang="stylus" scoped>
    .c-account-apply-register {

    .circle {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid #D2DCE5;
        color: #0CC3FB;
    }

    .word {
        width: 30px;
        height: 30px;
        text-align: center;
        line-height: 30px;
    }

    .register-account-message {

    .circle {
        position: absolute;
        left: 20px;
        top: 10px;
    }

    }
    }
</style>

<script>
    import {email} from '../../../define/validator_reg';
    import retypePassword from '@/view/base/account-information/retype-password';
    import phoneEmail from './phone-email';
    import selectCreditCard from './select-credit-card';
//    import shroffAccountNumber from './shroff-account-number';

    export default {
        name: "register-info",
        data() {
            return {
                passwordLine: '',
                emailShow: false,
                emailLine: '',//识别哪里打开email
                creditCardShow: false,
                creditCardLine: '',
                channel_id: 0,
                isEdit: false,
                passwordShow: false,
                passwordData: {},
                passwordUrl: 'get|account-apply/password',
                register: this.form,
                addEditcardTitle: '',
                accountNumberShow: false,
                selectFlag: 0,
                selectCardTitle:'',

            }
        },
        mounted() {
            this.passwordLine = '';
            this.emailShow = false;
            this.emailLine = '';
            this.creditCardShow = false;
            this.creditCardLine = '';
            if (this.flag === 1) {
                this.isEdit = false;
            } else {
                if (this.flag === 2) {
                    if (this.register.status >= 3) {
                        this.isEdit = false;
                    } else {
                        this.isEdit = true;
                    }
                } else {
                    this.isEdit = true;
                }
            }
            console.log(this.tempCardTitle);
        },
        methods: {
            add_account() {
                let obj = {
                    id: '',
                    account_name: '',
                    password: '',
                    password_type: true,
                    is_eye: !!this.flag,
                    shop_name: '',
                    account_code: '',
                    site_code: this.register.channel_id === 2 ? [] : '',
                    email_txt: '',
                    email_id: '',
                    credit_card_txt: '',
                    credit_card_id: '',
                    collection_data: [
                        {
                            collection_account: '',
                            collection_type: '',
                            collection_email: '',
                            collection_name: ''
                        }
                    ]
                };
                this.register.accounts.push(obj);
            },
            show_password(id, index) {
                this.passwordLine = index;
                this.passwordData = {
                    detail_id: id
                };
                this.passwordShow = true;
            },
            get_password(password) {
                this.$set(this.register.accounts[this.passwordLine], 'password', password);
                this.$set(this.register.accounts[this.passwordLine], 'password_type', false);
                this.passwordShow = false;
            },
            select_site(site, index) {
                if (this.register.channel_id === 2) {
                    if (site.length) {
                        let lastCurrent = site[site.length - 1];
                        let ind = this.multipleAmazon.findIndex(row => row.includes(lastCurrent));
                        if (ind !== -1) {
                            this.register.accounts[index].site_code = this.multipleAmazon[ind];
                        }
                    }
                }
            },
            disabled_site(item, index) {
                let condition = item.status === 1;
                let map = this.register.accounts.map(row => row.site_code);
                let includes = '';
                if (this.register.channel_id === 1) {
                    includes = map.includes(item.value);
                } else if (this.register.channel_id === 2) {
                    let maps = [];
                    if (map.length === 1) {
                        maps = map[0];
                    } else {
                        maps = map.reduce((pre, cur) => {
                            return [...pre, ...cur];
                        });
                    }
                    includes = maps.includes(item.value);
                }
                if (condition || includes) return true;
            },
            site_code(site) {
                return this.register.channel_id === 2 ? site.join(',') : site;
            },
            open_email(index) {
                this.emailLine = index;
                this.channel_id = this.register.channel_id ? this.register.channel_id : 0;
                this.emailShow = true;
            },
            get_email(row) {
                this.register.accounts[this.emailLine].email_txt = row.email;
                this.register.accounts[this.emailLine].email_id = row.id;
                this.emailShow = false;
            },
            open_credit_card(index) {
                this.creditCardLine = index;
                this.creditCardShow = true;
//                if(this.tempCardTitle.includes('添加')){
//                    this.addEditcardTitle='选择信用卡';
//                }else{
//                    this.addEditcardTitle=`为账号简称：${this.register.accounts[0].account_code}选择信用卡`;
//                }
                this.addEditcardTitle = `${this.register.accounts[0].account_code ? `为账号简称：${this.register.accounts[0].account_code}选择信用卡` : ''}`;
            },
            get_credit_card(row) {
                this.register.accounts[this.creditCardLine].credit_card_txt = row.card_number;
                this.register.accounts[this.creditCardLine].credit_card_id = row.id;
                this.creditCardShow = false;
            },
            del_account(index) {
                this.register.accounts.splice(index, 1);
            },
            //清空
            clear_pay_info(index) {
                Reflect.ownKeys(this.register.accounts[index].collection_data[0]).forEach(key => {
                    this.register.accounts[index].collection_data[0][key]='';
                });
            },
            //选择收款账号
            add_pay_info(row, index) {
                let obj={
                    collection_account:'',
                    collection_type:'',
                    collection_email:'',
                    collection_name:''
                };
                row.collection_data.push(obj);
                //this.accountNumberShow = true;
               // this.selectFlag = index;
                //title
                //this.selectCardTitle = `${this.register.accounts[index].account_name ? `为账号全称：${this.register.accounts[index].account_name}选择收款账号` : '请选择收款账号'}`;
            },
            //收款账号信息添加显示
            checkAccountInfor($event) {
                let temp = JSON.parse(JSON.stringify($event));
                if (this.register.accounts[this.selectFlag].collection_data[0].collection_account == '') {
                    this.register.accounts[this.selectFlag].collection_data = [];
                    temp.forEach(item => {
                        this.register.accounts[this.selectFlag].collection_data.push(item);
                    })
                } else {
                    temp.forEach(item => {
                        this.register.accounts[this.selectFlag].collection_data.push(item);
                    })
                }
            },
            del_pay_info(row, index) {
                row.collection_data.splice(index, 1);
            },
            show_word(index) {
                let arr = [{label: 'a', value: 1}, {label: 'b', value: 2}, {label: 'c', value: 3}, {
                    label: 'd',
                    value: 4
                },
                    {label: 'e', value: 5}, {label: 'f', value: 6}, {label: 'g', value: 7}, {label: 'h', value: 8},
                    {label: 'i', value: 9}, {label: 'j', value: 10}, {label: 'k', value: 11}, {label: 'l', value: 12},
                    {label: 'm', value: 13}, {label: 'n', value: 14}, {label: 'o', value: 15}, {label: 'p', value: 16},
                    {label: 'q', value: 17}, {label: 'r', value: 18}, {label: 's', value: 19}, {
                        label: 't',
                        value: 20
                    }, {label: 'u', value: 21},
                    {label: 'v', value: 22}, {label: 'w', value: 23}, {label: 'x', value: 24}, {
                        label: 'y',
                        value: 25
                    }, {label: 'z', value: 26}];
                let find = arr.find(row => row.value === index);
                return find.label;
            },
            submit(string) {
                let find = '';
                this.register.accounts.forEach(accounts => {
                    find = accounts.collection_data.find(collection => collection.collection_email && !email.test(collection.collection_email))
                });
                if (find) {
                    return this.$message({type: 'warning', message: '检测到有收款账号登录邮箱格式填写不正确,请检查邮箱格式'});
                }
                this.$emit('submit-register', string);
            },
            cancel() {
                if (!this.flag) {
                    if (this.register.register_submited) {
                        this.isEdit = false;
                    } else {
                        this.$set(this.register, 'accounts', [{
                            account_name: '',
                            password: '',
                            password_type: true,
                            shop_name: '',
                            account_code: '',
                            site_code: this.register.channel_id === 2 ? [] : '',
                            email_txt: '',
                            email_id: '',
                            credit_card_txt: '',
                            credit_card_id: '',
                            collection_data: [
                                {
                                    collection_account: '',
                                    collection_type: '',
                                    collection_email: '',
                                    collection_name: ''
                                }
                            ]
                        }]);
                    }
                } else {
                    this.isEdit = false;
                    this.$set(this.register, 'accounts', JSON.parse(JSON.stringify(this.everForm.accounts)));
                }
            }
        },
        props: {
            form: {},
            flag: {},
            siteOptions: Array,
            multipleAmazon: Array,
            everForm: Object,
            tempCardTitle: String
        },
        components: {
            phoneEmail, selectCreditCard, retypePassword
        }
    }
</script>

