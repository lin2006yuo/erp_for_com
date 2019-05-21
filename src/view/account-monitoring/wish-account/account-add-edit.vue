<template>
  <page-dialog class="p-add-edit"
               :title="status===1?`添加账号`:`授权${monitoringData.username}账号`"
               v-model="visible" size="small"
               :close-on-click-modal="false">
    <el-form label-width="200px" :model="formData" :rules="rules">
      <el-form-item label="账号全称：">
        <el-select class="inline"
                   v-if="status===1"
                   v-model="formData.account_id">
          <el-option v-for="item in channelList"
                     :key="item.id" :value="item.id" :label="item.account_name"
                     @click.native="click_account(item)"></el-option>
        </el-select>
        <span v-else>{{monitoringData.username}}</span>
      </el-form-item>
      <el-form-item label="账号密码：" prop="password" v-model="formData.accountPwd">
        <input class="inline el-input__inner"
               v-model="formData.password" type="password" style="width:150px;background-color: #fff!important;">
      </el-form-item>
      <el-form-item label="授权验证码：" prop="tfa_token">
        <el-input v-model="formData.tfa_token" class="inline"></el-input>
        <el-button size="mini" type="primary" @click="get_mobile_code" class="inline">获取短信验证码</el-button>
      </el-form-item>
      <el-form-item label="代理服务器地址：">
        <el-input class="inline" v-model="formData.proxy_ip"></el-input>
      </el-form-item>
      <el-form-item label="端口号：">
        <el-input class="inline" v-model="formData.proxy_port"></el-input>
      </el-form-item>
      <el-form-item label="访问协议：">
        <el-select class="inline" v-model="formData.proxy_protocol">
          <el-option v-for="item in proxyProtocol" :key="item.value" :value="item.value"
                     :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="代理账号：">
        <el-input class="inline" v-model="formData.proxy_user"></el-input>
      </el-form-item>
      <el-form-item label="访问密码：">
        <el-input class="inline" v-model="formData.proxy_passwd"></el-input>
      </el-form-item>
    </el-form>
    <div class="t-right card">
      <el-button type="primary" size="mini" @click="init">确定</el-button>
      <el-button size="mini" @click="visible=false">取消</el-button>
    </div>
  </page-dialog>
</template>

<style lang="stylus">
  .p-add-edit {

  .el-input, .el-select {
    width: 150px;
  }

  }
</style>
<script>
  import {api_wish_shop_auth, api_mobile_code} from '../../../api/account-monitoring'
  export default{
    page: {},
    refresh(){
      this.searchData = {};
      this.init();
    },
    data(){
      return {
        formData: {
          account_id: '',//账号id
          username: '',//用户名
          password: '',//密码
          tfa_token: '',//授权验证码
          proxy_ip: '',//代理服务器ip
          proxy_port: '',//代理服务器端口
          proxy_user: '',//代理服务器用户名
          proxy_passwd: '',//代理服务器密码
          proxy_protocol: ''//代理服务器协议
        },
        rules: {
          password: {required: true, message: '该选项不能为空', trigger: 'blur'},
          tfa_token: {required: true, message: '该选项不能为空', trigger: 'blur'}
        },
        proxyProtocol: [
          {label: 'HTTP', value: 'HTTP'},
          {label: 'SOCKS4', value: 'SOCKS4'},
          {label: 'SOCKS5', value: 'SOCKS5'},
          {label: 'SOCKS4A', value: 'SOCKS4A'},
          {label: 'CURLPROXY_SOCKS5_HOSTNAME', value: 'CURLPROXY_SOCKS5_HOSTNAME'}
        ],
        visible: false
      }
    },
    created(){

    },
    filters: {},
    mounted(){

    },
    updated(){

    },
    destroy(){

    },
    methods: {
      init(){
        this.$http(api_wish_shop_auth, this.formData).then(res => {
          this.$message({
            type: 'success',
            message: res.message || res
          });
        }).catch(code => {
          this.$message({
            type: "error",
            message: code.message || code
          })
        })
      },
      get_mobile_code(){
        this.$http(api_mobile_code, {username:this.formData.username}).then(res => {
          this.$message({
            type: 'success',
            message: res.message || res
          })
        }).catch(code => {
        });
        this.$message({
          type: "error",
          message: code.message || code
        });
      },
      click_account(row){
        this.formData.username = row.account_name;
      }
    },
    computed: {},
    watch: {
      visible(val){
        this.$emit('input', val);
      },
      value(val){
        this.visible = val;
        if(!!val){
            if(this.status===2){
              this.formData = {
                account_id: this.monitoringData.account_id,//账号id
                username: this.monitoringData.username,//用户名
                password: this.monitoringData.password,//密码
                tfa_token: this.monitoringData.tfa_token,//授权验证码
                proxy_ip: this.monitoringData.proxy_ip,//代理服务器ip
                proxy_port: this.monitoringData.proxy_port,//代理服务器端口
                proxy_user: this.monitoringData.proxy_user,//代理服务器用户名
                proxy_passwd: this.monitoringData.proxy_passwd,//代理服务器密码
                proxy_protocol: this.monitoringData.proxy_protocol//代理服务器协议
              }
            }else {
              this.formData = {
                account_id: '',//账号id
                username: '',//用户名
                password: '',//密码
                tfa_token: '',//授权验证码
                proxy_ip: '',//代理服务器ip
                proxy_port: '',//代理服务器端口
                proxy_user: '',//代理服务器用户名
                proxy_passwd: '',//代理服务器密码
                proxy_protocol: ''//代理服务器协议
              }
            }
        }
      }
    },
    props: {
      value: {},
      status: {
        type: Number
      },
      channelList: {
        type: Array
      },
      monitoringData: {
          type: Object
      }
    },
    components: {
      pageDialog: require("../../../components/page-dialog.vue").default
    }
  }
</script>

