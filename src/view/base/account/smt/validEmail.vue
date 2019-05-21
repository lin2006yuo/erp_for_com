<template>
    <el-row class="p-validEmail">
        <page-dialog :title="`账户${account_name}客户的邮箱`" v-model="emailDialog" size="large">
            <el-card class="box-card">
                <div slot="header" class="bing-email-header">
                    <el-row :span="24">
                        <el-col :span="3" >您的姓名</el-col>
                        <el-col :span="3">电子邮箱</el-col>
                        <el-col :span="3">主邮箱</el-col>
                        <el-col :span="2">邮箱状态</el-col>
                        <el-col :span="2">用户名</el-col>
                        <el-col :span="2">密码</el-col>
                        <el-col :span="3">发送邮件服务器</el-col>
                        <el-col :span="3">发送服务器端口号</el-col>
                        <el-col :span="3">操作</el-col>
                    </el-row>
                </div>
                <el-row :span="24"   style="text-align: center; margin-top: 5px;" v-for="(item, index) in bindData"
                        :key="index"
                >
                    <el-col :span="3"  > <el-input  v-model="bindData[index].name"></el-input></el-col>
                    <el-col :span="3"><el-input  v-model="bindData[index].email"></el-input></el-col>
                    <el-col :span="3"><el-input  v-model="bindData[index].indexemail"></el-input></el-col>
                    <el-col :span="2">{{bindData[index].status}}</el-col>
                    <el-col :span="2"><el-input  v-model="bindData[index].username"></el-input></el-col>
                    <el-col :span="2"><el-input  v-model="bindData[index].psd"></el-input></el-col>
                    <el-col :span="3"><el-input  v-model="bindData[index].emailserver"></el-input></el-col>
                    <el-col :span="3"><el-input  v-model="bindData[index].serverport"></el-input></el-col>
                    <el-col :span="3">  <span @click="verification">{{operating[1]}}</span> |<span @click="del_data(index)">{{operating[0]}}</span></el-col>
                </el-row>

                <el-row     style="text-align: center; margin-top: 40px;">
                    <el-col :span="2"> <el-button class="inline" type="primary" size="mini" @click="add_email">添加邮箱</el-button>  </el-col>
                    <el-col :span="3">
                        <el-checkbox v-model="checkedOne" >姓名是否使用账户名称</el-checkbox>
                    </el-col>
                    <el-col :span="6" >
                        <el-checkbox v-model="checkedTwo" >如果服务器支持，就使用STARTTLS加密传输</el-checkbox>
                    </el-col>
                    <el-col :span="3" >
                        使用以下加密连接类型：
                    </el-col>
                    <el-col :span="3" >
                        <el-select class="inline" v-model="bindData.encode">
                            <el-option
                                    :key="item.value"
                                    v-for="item in options"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>

                <el-row style=" margin-top: 20px;background:#FF9933">
                    <div>
                        <span style="font-weight:700">邮件账户密码风险条款:</span> 因请求SMTP服务时账号密码必须明文提交，通途必须明文存储您的 密码，通途在此仅承诺不主动泄露您的账号密码，因不可抗力因素造成的账号密码泄露,需要 您自行承担责任与损失，仅致以无奈的歉意.
                    </div>
                    <div style="text-align: center">
                        <el-checkbox v-model="checkedThree" >如果服务器支持，就使用STARTTLS加密传输</el-checkbox>
                    </div>
                </el-row>
            </el-card>

            <el-card class="box-card">
                <el-row :span="24"   style=" background:#2B78E4">
                    <el-col :span=24 style="color:#ffffff;text-align: left"  >高级设置  如不能理解，请保留默认值，已防账户关联。</el-col>
                </el-row>
                <el-row :span="24"  style="text-align: left"  >
                    <div>主动给客户发邮件时，系统将根据订单中记录的卖家邮箱为您选择发信的邮箱账号。如果订单中未提供卖家的邮箱信息，系统将：</div>
                    <div>
                        <el-radio-group v-model="radioOne">
                            <el-radio :label="3" >报告邮件发送失败(默认)</el-radio>
                            <el-radio  :label="6" >使用主邮箱进行发送(设置主邮箱后可选)</el-radio>
                        </el-radio-group>
                    </div>
                </el-row>

                <el-row :span="24"  style="text-align: left"  >
                    <div>回复买家来信时，系统将自动在以上的邮箱账号中搜索买家来信收件人对应的账号进行发信，如果未找到对应的邮箱，系统将：</div>
                    <div>
                        <el-radio-group v-model="radioTwo">
                            <el-radio :label="3" >报告邮件发送失败(默认)</el-radio>
                            <el-radio  :label="6" >使用主邮箱进行发送(设置主邮箱后可选)</el-radio>
                        </el-radio-group>
                    </div>
                </el-row>
            </el-card>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="mini" @click.native="emailDialog = false" disabled title="功能尚未开发">保 存</el-button>
                <el-button size="mini" @click.native="emailDialog = false">取 消</el-button>
            </div>

        </page-dialog>

    </el-row>
</template>
<style lang="stylus">
    .bing-email-header{
        margin: -8px;
        padding: 5px;
        text-align: center;
        background:#2B78E4;
        color:#ffffff;
    }
</style>
<script>

    export default{
        data(){
            return{
                radioOne:3,
                radioTwo:3,
                checkedOne:true,
                checkedTwo:true,
                checkedThree:true,
                emailDialog:false,
                operating:["删除","验证"],
                options: [{
                    value: '选项1',
                    label: '无'
                }, {
                    value: '选项2',
                    label: 'SSL'
                }, {
                    value: '选项3',
                    label: 'TLS'
                }]

            }
        },
        mounted(){
            this.emailDialog=this.value
        },
        watch:{
            emailDialog(val){
                this.$emit("input",val)
            },
            value(val){
                this.emailDialog=val
            }
        },
        props:{
            bindData:{
                required:true,
                type:Array
            },
            value:{},
            account_name:''
        },
        methods:{
            verification(){
                console.log("验证")
            },
            del_data(index){

                console.log(this.bindData.length)
                if(this.bindData.length==1){

                }else {
                    this.bindData.splice(index,1)
                    this.$emit("del_data",this.bindData)
                }
            },
            add_email(){
                console.log("添加邮箱");
                this.bindData.push({name:"", email:"", indexemail:"", status:"未验证", username:"", psd:"",emailserver:"", serverport:"", encode:"选项一"
                })
                this.$emit("change_bind",this.bindData)
            }

        },

        components:{
            pageDialog:require('../../../../components/page-dialog.vue').default
        }
    }
</script>
