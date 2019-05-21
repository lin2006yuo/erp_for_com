<template>
    <el-row>
        <div class="absolute-f" v-if="edit">
            <span class="bold">原始地址</span>
            <el-button :disabled="oldSource instanceof Array" class="inline absolute-c" size="mini" type="primary" @click.native="use_source">使用</el-button>
            <el-card class="mt-xs">
                <div  v-if="oldSource instanceof Array">数据为空...</div>
                <div v-else>
                    <div><label class="bold mb-xs">收件人：</label><span>{{oldSource.consignee}}</span></div>
                    <div><label class="bold mb-xs">详细地址：</label><span>{{oldSource.address}} <span v-if="form.source_address.address2">/{{oldSource.address2}}</span>{{oldSource.city}} {{oldSource.province}}  {{oldSource.zipcode}}  {{oldSource.country_code}}</span></div>
                    <div><label class="bold mb-xs">电话：</label><span>{{oldSource.tel}}</span></div>
                </div>
            </el-card>
        </div>
        <div class="absolute-f" v-if="edit&&form.channel_name==='ebay'" style="top:140px">
            <span class="bold">PayPal地址：</span>
            <el-button :disabled="paypalSource instanceof Array" class="inline absolute-c" size="mini" type="primary" @click.native="use_paypal_source">使用</el-button>
            <el-card class="mt-xs">
                <div  v-if="paypalSource instanceof Array">数据为空...</div>
                <div v-else>
                    <div><label class="bold mb-xs">收件人：</label><span>{{paypalSource.consignee}}</span></div>
                    <div><label class="bold mb-xs">详细地址：</label><span>{{paypalSource.address}} <span v-if="form.paypal_address.address2">/{{paypalSource.address2}}</span>{{paypalSource.city}} {{paypalSource.province}}  {{paypalSource.zipcode}}  {{paypalSource.country_code}}</span></div>
                    <div><label class="bold mb-xs">电话：</label><span>{{paypalSource.tel}}</span></div>
                </div>
            </el-card>
        </div>
        <el-form label-width="120px" :model="form" ref="form" :rules="edit?rules:notRules">
        <el-form-item label="买家ID：">
            <el-input v-if="edit" v-model="form.buyer" :disabled="true" class="width-super"></el-input>
            <span v-else>{{form.buyer}}</span>
        </el-form-item>
        <el-form-item label="收货人：" prop="consignee">
            <el-input v-if="edit" v-model="form.consignee" class="width-super"></el-input>
            <span v-else>{{form.consignee}}</span>
        </el-form-item>
        <el-form-item label="地址1：" prop="address">
            <el-input v-if="edit" v-model="form.address" class="width-super"></el-input>
            <span v-else>{{form.address}}</span>
        </el-form-item>
          <el-form-item label="地址2：">
            <el-input v-if="edit" v-model="form.address2" class="width-super"></el-input>
            <span v-else>{{form.address2}}</span>
          </el-form-item>
        <el-form-item  label="城市：" :prop="form.country_code!=='JP'?'city':''">
            <el-input v-if="edit" v-model="form.city" class="width-super"></el-input>
            <span v-else>{{form.city}}</span>
        </el-form-item>
        <el-form-item label="省/州：">
            <el-input v-if="edit" v-model="form.province" class="width-super"></el-input>
            <span v-else>{{form.province}}</span>
        </el-form-item>
        <el-form-item label="国家：" prop="country_code">
            <el-select ref="country"
                       v-mouse-side.mousewheel="()=>{$refs.country.visible=false}"
                       v-if="edit"  filterable clearable
                       v-model="form.country_code"
                       class="width-super" >
                <el-option
                        :key="item.country_code"
                        v-for="item in countryList"
                        :label="item.country_en_name"
                        :value="item.country_code">
                </el-option>
            </el-select>
            <span v-else>{{countryTitle}}</span>
        </el-form-item>
        <el-form-item label="邮编：" prop="zipcode">
            <el-input v-if="edit" v-model="form.zipcode" class="width-lg"></el-input>
            <span v-else>{{form.zipcode}}</span>
        </el-form-item>
        <el-form-item label="联系电话：" prop="tel">
            <el-input v-if="edit" v-model="form.tel" class="width-super"></el-input>
            <span v-else>{{form.tel}}</span>
        </el-form-item>
        <el-form-item label="手机号：">
            <el-input v-if="edit" v-model="form.mobile" class="width-super"></el-input>
            <span v-else>{{form.mobile}}</span>
        </el-form-item>
        <el-form-item label="买家邮件：" prop="email">
            <el-input v-if="edit" v-model="form.email" class="width-super"></el-input>
            <span v-else>{{form.email}}</span>
        </el-form-item>
        <el-form-item label="" v-if="form.hasOwnProperty('is_apply')">
            <el-checkbox :disabled='!edit' v-model="form.is_apply">应用到所有合并订单</el-checkbox>
        </el-form-item>
        <el-row v-if="showBtn">
            <el-col :span="24">
                <!--权限  编辑-->
                <permission
                        tag="ElButton"
                        :route="apis.url_update"
                        class="fr"
                        v-if="!edit"
                        size="mini"
                        type="primary"
                        @click.native="do_edit"
                >编辑</permission>
                <div v-else class="fr">
                    <el-button size="mini" type="primary" @click.native="submit">保存</el-button>
                    <el-button size="mini" @click.native="cancel">取消</el-button>
                </div>
            </el-col>
        </el-row>
    </el-form>
    </el-row>
</template>
<style lang="stylus">
    .absolute-f{
        position:absolute;
        top:12px;
        right:30px;
        width:200px;
        z-index:999;
        .absolute-c{
            position:absolute;
            top:-7px;
            right:1px;
        }
        .bold{
            font-weight: bold;
        }
    }
</style>
<script>
    import {api_update,api_get_country,api_use_paypal_source} from '@/api/order-local';
    import {url_update} from '@/api/order-local';
    import {email,integer,extraReg,chinese} from '../../../../define/validator_reg';
    export default{
        permission:{
            url_update
        },
        data(){
            let checkEmail = (rule,value,callback)=>{
                if(value){
                    return !email.test(value) ? callback(new Error("邮箱格式有误，请重新输入!")):callback();
                }else{
                    return callback();
                }
            };
            let checkNumber = (rule,value,callback)=>{
                if(value){
                    return !integer.test(value)?callback(new Error("手机号输入有误，请重新输入！")):callback()
                }else{
                    return callback();
                }

            };
            let checkTel  = (rule,value,callback)=>{
                if(value){
                    return !extraReg.test(value)?callback(new Error("号码输入有误，请重新输入！")):callback()
                }else{
                    return callback();
                }

            };
            let checkChinese = (rule,value,callback)=>{
                if(value){
                    return chinese.test(value)?callback(new Error("不允许输入中文，请更正！")):callback();
                } else {
                    return callback();
                }
            };
            return{
                edit:false,
                countryList:[],
                oldform:{},
                rules:{
                    consignee:[
                        {required:true,message:"收件人不能为空",trigger:"blur"}
                    ],
                    address:[
                        {required:true,message:"详细地址不能为空",trigger:"blur"}
                    ],
                    city:[
                        {required:true,message:"城市不能为空",trigger:"blur"}
                    ],
                    country_code:[
                        {required:true,message:"国家不能为空",trigger:"blur"}
                    ],
                    // tel:[
                    //     {validator:checkTel,trigger:"blur"}
                    // ],
                    zipcode:[
                        {validator:checkChinese,trigger:"blur,change"}
                    ],
                    // mobile:[
                    //     {validator:checkTel,trigger:"blur"}
                    // ],
                    email:[
                        {validator:checkEmail,trigger:"blur"}
                    ]
                },
                notRules:{
                    consignee:[
                        {required:false}
                    ],
                    address:[
                        {required:false}
                    ],
                    city:[
                        {required:false}
                    ],
                    country_code:[
                        {required:false}
                    ],
                    tel:[
                        {validator:''}
                    ],
                    zipcode:[
                        {validator:''}
                    ],
                    mobile:[
                        {validator:''}
                    ],
                    email:[
                        {validator:''}
                    ]
                },
            }
        },
        created(){
            this.get_country();
        },
        computed:{
            oldSource(){
                return this.form.source_address;
            },
            paypalSource(){
                return this.form.paypal_address;
            },
            countryTitle(){
                if(this.countryList instanceof Array){
                    let cur = this.countryList.findRet(row=>{
                        if(row.country_code===this.form.country_code){
                            return row.country_en_name;
                        }
                    });
                    return cur;
                }
            },
        },
        methods:{
            use_source(){
                this.form.buyer = this.oldform.buyer;
                this.form.consignee = this.oldSource.consignee;
                this.form.address = this.oldSource.address;
                this.form.address2 = this.oldSource.address2;
                this.form.tel = this.oldSource.tel;
                this.form.mobile = this.oldSource.mobile;
                this.form.email = this.oldSource.email;
                this.form.zipcode = this.oldSource.zipcode;
                this.form.province = this.oldSource.province;
                this.form.city = this.oldSource.city;
                this.form.country_code = this.oldSource.country_code;
                this.form.source_address = this.oldform.source_address;
            },
            use_paypal_source(){
                this.$http(api_use_paypal_source,this.id,{address:this.paypalSource}).then(res=>{
                    this.form.buyer = this.oldform.buyer;
                    this.form.consignee = this.paypalSource.consignee;
                    this.form.address = this.paypalSource.address;
                    this.form.tel = this.paypalSource.tel;
                    this.form.mobile = this.paypalSource.mobile;
                    this.form.email = this.paypalSource.email;
                    this.form.zipcode = this.paypalSource.zipcode;
                    this.form.province = this.paypalSource.province;
                    this.form.city = this.paypalSource.city;
                    this.form.country_code = this.paypalSource.country_code;
                    this.form.source_address = this.oldform.source_address;
                    this.$message({type:'success',message:res.message||res});
                }).catch(code=>{
                    this.$message({message:code.message || code, type:'error'})
                })
            },
            do_edit(){
                for(let i in this.form){
                    this.form.hasOwnProperty(i) && (this.oldform[i] = this.form[i]);
                }
                this.edit = true;
            },
            submit_params(isTrue){
              if(!this.form.tel&&!this.form.mobile)return this.$message({message:"请至少填写一种联系方式", type:'warning'});
              this.$refs.form.validate((bool)=>{
                if(bool){
                  let updates = {
                      consignee:this.form.consignee.trim(),
                      address:this.form.address.trim(),
                      mobile:this.form.mobile.trim(),
                      email:this.form.email.trim(),
                      zipcode:this.form.zipcode.trim(),
                      tel:this.form.tel.trim(),
                      province: this.form.province.trim(),
                      city: this.form.city.trim(),
                      country_code: this.form.country_code,
                  };
                  updates.address2 = this.form.address2.trim();
                  let params = {
                    order_address:updates,
                  };
                  if(this.form.is_apply) this.$set(params,'is_apply',this.form.is_apply);
                  if(isTrue){
                    params.confirm = true;
                  }
                  this.$http(api_update, this.id, params).then(res=>{
                    this.$message({
                      type:"success",
                      message:res.message
                    });
                    this.edit = false;
                    this.$emit('submit',updates);
                  }).catch(code=>{
                        if(code.hasOwnProperty("code")&&code.code==="confirm"){
                          this.$confirm(`${code.message}`, '提示', {
                            confirmButtonText: '继续',
                            cancelButtonText: '取消',
                            type: 'warning'
                          }).then(() => {
                            this.submit_params(true);
                          })
                        }else{
                          this.$message({
                            type: 'error',
                            message: code.message || code
                          })
                        }
                      })
                }
              })
            },
            submit(){
              this.submit_params(false);
            },
            cancel(){
                this.edit = false;
                for(let i in this.oldform){
                    this.oldform.hasOwnProperty(i) && (this.form[i] = this.oldform[i]);
                }
                this.$refs.form.validate(bool=>{

                });
            },
            get_country(){
                this.$http(api_get_country,{}).then(res=>{
                    this.countryList = res;
                }).catch(code=>{
                    console.log(code);
                });
            }
        },
        props:{
            form:{
                required:true,
            },
            id:{},
            showBtn:{
                default(){
                   return true;
                }
            }
        },
        components:{

        }
    }
</script>
