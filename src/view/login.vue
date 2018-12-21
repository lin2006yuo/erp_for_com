<template>
    <modal v-model="show" class="login">
        <div class="mask"></div>
        <!--<ui-canvas ref="canvas"></ui-canvas>-->
        <div class="content-login">
            <el-row :gutter="8">
                <el-col :span="12">
                    <div class="slogan">
                        <writing></writing>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="fr">
                        <div class="border-login">
                            <div class="login-title">
                                ERP登录系统
                            </div>
                            <div class="login-body">
                                <div class="input-data user-icon">
                                        <input class="input-box" type="text" v-model="account"
                                               ref="username" placeholder="请输入账号">
                                </div>
                                <div class="input-data password-icon">
                                    <input class="input-box" type="password" v-model="password" placeholder="请输入密码">
                                </div>
                                <div class="input-data verification-icon">
                                    <input class="input-box auth tl" v-model="authcode" @keyup.enter="enter" placeholder="请输入验证码">
                                    <img class="auth-code" @click="refresh_authcode" :src="authCode">
                                </div>
                                <div class="mt-sm">
                                    <el-checkbox class='fl' v-model="checkEnglish">English</el-checkbox>
                                    <!--<el-checkbox class='fr' v-model="remember">记住密码</el-checkbox>-->
                                </div>
                            </div>
                            <div class="sign-in" @click="login">
                                登录
                            </div>
                        </div>
                        <div class="company-name">
                            深圳市利朗达科技有限公司
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </modal>
</template>
<style lang="stylus">
    .login {
        height:100%;
        max-width:100%;
        background:url(../assets/home-page3.png) no-repeat;
        background-size:cover;
        background-position:bottom center;
        font-family:'微软雅黑',Consolas,Monaco,monospace;
        .mask{
            position: absolute;
            top: 60px;
            left: 60px;
            width:161px;
            height:51px;
            background:url(../assets/logo-2018-7-3.png) no-repeat;
            z-index: 555;
            /*position:absolute;
            top:0;
            left: 0;
            right:0;
            bottom:0;
            background-color:rgba(0,0,0,.1)*/
        }
        .content-login{
            position:absolute;
            top:12%;
            left:50%;
            height: 600px;
            width: 1200px;
            margin-left: -600px;
            z-index:9999;
            .slogan{
                margin-top:15%;
                h1{
                     font:normal 400% '微软雅黑',Consolas,Monaco,monospace;
                     color:#fff;
                 }
                @-webkit-keyframes type{
                    from { width: 0;}
                    to {width: 250px}
                }
                @keyframes type{
                    from { width: 0;}
                    to {width: 250px}
                }
                }
                }
        .company-name{
            margin-top:20px;
            font-size:18px;
            color:#E5E6E9;
            width: 437px;
            text-align:center;
        }
        .border-login {
            box-sizing: border-box;
            width: 415px;
            text-align:center;
            padding:44px;
            background:#fff;
            border-radius:5px;
            .login-title{
                font-size:25px;
                font-family:'微软雅黑',Consolas,Monaco,monospace;
                color:#00acac;
                position: relative;
                &:before, &:after {
                    content: '';                 /*CSS伪类用法*/
                    position: absolute;         /*定位背景横线的位置*/
                    top: 52%;
                    background: #00acac;       /*宽和高做出来的背景横线*/
                    width: 15%;
                    height: 2px;
                }
                &:before{
                    left: 8%;        /*调整背景横线的左右距离*/
                }
                &:after {
                    right: 8%;
                }
            }
            .sign-in{
                margin-top: 65px;
                height: 67px;
                line-height:50px;
                width:100%;
                background:url(../assets/sign-in-icon.png) no-repeat;
                background-size:cover;
                background-position:center;
                text-align:center;
                font-size:25px;
                color:#fff;
                cursor:pointer;
                transition:all 0.2s;
                &:hover{
                    background:url(../assets/sign-in-icon-active.png) no-repeat;
                    background-size:cover;
                    background-position:center;
                }
                &:active{
                    background:url(../assets/sign-in-icon-active.png) no-repeat;
                    background-size:cover;
                    background-position:center;
                }
            }
            .login-body{
                width:100%;
                margin-top: 30px;
                .input-data{
                    box-sizing: border-box;
                    width: 100%;
                    height: 48px;
                    margin-top: 45px;
                    border-bottom:2px solid #d1d1d1;
                    padding-left:48px;
                    position:relative;
                    &.user-icon{
                        background:url(../assets/user-new.png) no-repeat;
                        background-size:25px;
                        background-position:10px 8px;
                    }
                    &.password-icon{
                        background:url(../assets/password-new.png) no-repeat;
                        background-size:25px;
                        background-position:10px 8px;
                    }
                    &.verification-icon{
                        background:url(../assets/verification-new.png) no-repeat;
                        background-size:25px;
                        background-position:10px 8px;
                    }
                    .input-box{
                        box-sizing: border-box;
                        border: none;
                        outline: none;
                        width: 100%;
                        line-height: 44px;
                        color:#666;
                        display: inline-block;
                        font-size:16px;
                    }
                    :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
                        color: #d1d1d1;
                        font-size:14px;
                    }
                    ::-moz-placeholder { /* Mozilla Firefox 19+ */
                        color: #d1d1d1;
                        font-size:14px;
                    }
                    input:-ms-input-placeholder{
                        color: #d1d1d1;
                        font-size:14px;
                    }
                    input::-webkit-input-placeholder{
                              color: #d1d1d1;
                              font-size:14px;
                    }
                    .auth{
                        width:140px;
                        float:left;
                    }
                    .auth-code{
                        border-top-right-radius :3px;
                        border-bottom-right-radius :3px;
                        float: right;
                        height:100%;
                        /*height:100%;*/
                    }
                    .btn{
                        box-sizing: border-box;
                        border: none;
                        outline: none;
                        width: 100%;
                        height:100%;
                        padding: 0 22px;
                        line-height: 1;
                        background-color: #e4393c;
                        color:#fff;
                        opacity:1;
                        >span{
                            font:bold 200% Consolas,Monaco,monospace;
                        }
                        &:active{
                               color:#ddd;
                         }
                    }
                    .inimg{
                        width :18px;
                        height :21px;
                    }
                }
            }
            .el-card__body {
                background: url(../assets/yem.jpg) no-repeat 0px 0px;
            }
        }
    }
</style>
<script>
    import modal from '../components/modal.vue';
    import {login} from '../api/user';
    import {set_authorization} from '../auth';
    export default{
        data(){
            return {
                show: false,
                account: '',
                password: '',
                authcode: '',
                authCode: '',
                captcha: '',
                islogin: true,
                random: 0,
                isShow:true,
                checkEnglish:'',
                remember:'',
            }
        },
        mounted(){
            this.refresh_authcode();
            this.$refs.username.focus();
        },
        methods: {
            login(){
                let lang = this.checkEnglish?'en':'zh';
                sessionStorage.setItem('lang',lang);
                this.$http(login, {
                    username: this.account,
                    password: this.password,
                    code: this.authcode,
                    captcha: this.captcha,
                }).then(succ => {
                    set_authorization(succ.token);
                    this.$router.replace('/');
                    loadLanguageAsync(lang);
//                    this.$refs.canvas.animate = false;   登录页动画销毁
                }).catch(code => {
                    this.refresh_authcode();
                    this.$message({
                        type: 'error',
                        message: code.message || code
                    })
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('login', false);
                    }, 300)
                });
            },
            help(){
                this.islogin = false;
            },
            refresh_authcode(){
                fetch(`${config.apiHost}login/code`, {
                    mode: 'cors'
                }).then((res) => {
                    this.captcha = res.headers.get('Captcha');
                    res.blob().then((myBlob) => {
                        this.authCode = URL.createObjectURL(myBlob);
                    });
                });
            },
            enter(){
                this.login();
            }
        },
        computed: {},
        beforeDestroy(){},
        destroyed(){},
        components: {
            modal,
            writing:require("./writing.vue").default,
            uiCanvas:require("../components/ui-canvas.vue").default,
        }
    }
</script>
