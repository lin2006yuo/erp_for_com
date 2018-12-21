<template>
    <ul class="c-hide-handle">
        <li class="print" @click="settingPrinter">打印机设置</li>
        <li class="print" @click="click_print">下载打印机</li>
        <li class="change-pwd" @click="click_pwd">修改密码</li>
        <li class="personal-center" @click="click_personal">个人中心</li>
        <li class="email-icon" @click="open_email">邮箱 <b class="red" v-if="">({{messageCount}})</b></li>
        <li class="update-version" @click="click_version">版本更新</li>
        <li class="other">其他信息</li>
        <li class="help">帮助</li>
        <li class="help" @click="set_up">设置</li>
        <li class="quit" @click="click_quit">退出登陆</li>
    </ul>

</template>
<style lang="stylus" scoped>
.c-hide-handle{
    margin-left:-10px;
    margin-right:-10px;
    >li{
        box-sizing:border-box;
        width:100%;
        height:26px;
        line-height:26px;
        padding-left:45%;
        &.print{
            background-image:url('../assets/print.svg');
            background-size:18px;
            background-repeat:no-repeat;
            background-position:20% center;
        }
        &.change-pwd{
            background-image:url('../assets/change-pwd.svg');
            background-size:18px;
            background-repeat:no-repeat;
            background-position:20% center;
        }
        &.personal-center{
            background-image:url('../assets/personal-center.svg');
            background-size:18px;
            background-repeat:no-repeat;
            background-position:20% center;
        }
        &.email-icon{
            background-image:url('../assets/email2.svg');
            background-size:18px;
            background-repeat:no-repeat;
            background-position:20% center;
        }
        &.other{
            background-image:url('../assets/other.svg');
            background-size:18px;
            background-repeat:no-repeat;
            background-position:20% center;
        }
        &.quit{
            background-image:url('../assets/quit.svg');
            background-size:18px;
            background-repeat:no-repeat;
            background-position:20% center;
        }
        &.help{
            background-image:url('../assets/help.svg');
            background-size:18px;
            background-repeat:no-repeat;
            background-position:20% center;
        }
        &.update-version{
            background-image:url('../assets/update-version.svg');
            background-size:18px;
            background-repeat:no-repeat;
            background-position:20% center;
        }
        &:hover{
            background-color:#e5e9f2;
            cursor:pointer;
        }

    }

}
</style>
<script>
    import {api_get_printer} from '../api/print';
    import {mapActions} from 'vuex';
    export default {
        data() {
            return {
                messageCount:"",
            }
        },
        mounted(){
            this.get_number();
            this.timer2 = setInterval(this.get_number,3000);
        },
        destroyed(){
            clearInterval(this.timer2);
        },
        methods:{
            ...mapActions({
                set_info:'user/set_info',
                switcher:'menu-nav/switcher',
                nav_closeall:'menu-nav/nav_closeall',
            }),
            /*打开邮箱*/
            open_email(){
                this.$open('/internal-letters/received-letters');
            },
            get_number(){
                this.messageCount = sessionStorage.getItem('messageCount');
            },
            settingPrinter(){
                this.$open('/setting-printer')
            },
            click_print(){
                this.$http(api_get_printer).then(res=>{
                    this.downUrl = config.apiHost + res.url;
                    window.open(config.apiHost+res.url);
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                });
            },
            click_personal(){
                let param = {key:this.connd,value:this.conndValue};
                this.$open('/test',param);
            },
            click_pwd(){
                this.$emit('click-pwd');
            },
            set_up(){
                this.$emit('set-up');
            },
            click_quit(){
                this.newColor="#aaa";
                this.$alert('退出登录', '系统提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                        switch (action){
                            case 'confirm':
                                this.nav_closeall();
                                setTimeout(()=>{
                                    this.$router.replace('/login');
                                },1000);
                                break;
                            default:
                                console.log(`${action}`);
                        }
                    }
                });
            },
            click_version(){
                this.$emit('click-version');
            },
        },
        components: {}
    }
</script>