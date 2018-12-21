<template>
  <div class="c-evaluate">
    <page-dialog :title="pForm.title" size="small" v-model="dialog" :close-on-click-modal="false">
      <div class="box-wripper">
        <div class="mb-sm" v-if="!pForm.isAddTo">
          <span class="bold-font">给买家评分：</span>
          <star :amount="amount" @add-star="add_star"></star>
          <el-checkbox class="ml-sm" v-model="form.is_full_mark" label="默认5星" @change="full_mark(form.is_full_mark)"></el-checkbox>
        </div>
        <div class="mb-sm" v-if="!pForm.isAddTo">
          <el-checkbox v-model="form.is_random" label="随机从评选模块中挑选评选内容" @change="random(form.is_random)"></el-checkbox>
        </div>
        <div class="mb-sm" v-if="!pForm.isAddTo">
          <label-select label="选择评价模板：" fontWeight="bold" v-model="form.tmp_id" :lists="templateList" @change="change_template"></label-select>
        </div>
        <div class="mb-sm">
          <el-form label-width="74px" :model="form" ref="form" :rules="rules">
            <el-form-item class="evaluate-form" label="评价内容：" prop="content">
              <el-input class="inline" type="textarea" v-model="form.content" :autosize="{ minRows: 4, maxRows: 8}"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer">
        <el-button type="primary" size="mini" @click.native="submit">确认</el-button>
        <el-button size="mini" @click.native="dialog = false;">取消</el-button>
      </div>
    </page-dialog>
  </div>
</template>
<style lang="stylus">
  .c-evaluate{
  .box-wripper{
    padding:10px 10px 20px;
    border:1px solid #BDCDDC;
    background-color:#F1F6FC;
  }
  .evaluate-form{
  .el-form-item__label{
    font-weight:bold;
  }
  }

  }
</style>
<script>
  import {api_get_templates,api_get_tmpContent,api_post_evaluate,api_post_batch,api_post_content} from '../../../api/smt-estimate';
  export default{
    data(){
      return {
        templateList:[],
        dialog:this.value,
        form:{
          is_full_mark:true,
          is_random:false,
          content:"",
          tmp_id:"",
        },
        amount:5,
        rules:{
          content:[
            {required:true,message:"请完善评价内容!",trigger:"blur,change"}
          ]
        }
      }
    },
    created(){
      this.get_templates();
    },
    watch:{
      dialog(val){
        this.$emit("input",val);
      },
      value(val){
        this.dialog = val;
        if(val){
          this.amount = 5;
          this.form = {
            is_full_mark:true,
            is_random:false,
            content:"",
            tmp_id:"",
          };
        }
      },
      amount(val){
        this.form.is_full_mark= val<5?false:true
      }
    },
    methods:{
      random(val){
        this.form.tmp_id = "";
        if(!val) {return this.form.content = ""}
        this.get_tmpContent();
      },
      change_template(val){
        if(!val) return;
        this.form.is_random = false;
        this.get_tmpContent();
      },
      add_star(val){
        this.amount = val;
      },
      full_mark(val){
        this.amount = val?5:0;
      },
      submit(){
        if(!this.amount)return this.$message({type:"warning",message:"评分不能为0，请至少给一颗星的评分"});
        this.$refs.form.validate((b)=>{
          if(b){
            if(!this.pForm.isAddTo){
              if(this.pForm.isAll==-1){
                this.post_evaluate();
              }else{
                this.batch_all_submit();
              }
            }else{
              this.add_post_evaluate();
            }
          }
        })
      },

//            ----------------------------------------------  API
      /*模板*/
      get_templates(){
        let params = {
          type:1,
          channel_id:4,
          template_type:2
        }
        this.$http(api_get_templates,params).then(res=>{
          let cur  = res.data.map(row=>{
            return {
              label:row.template_name,
              value:row.template_id,
            }
          })
          this.templateList = [{label:"请选择模板",value:0},...cur];
        }).catch(code=>{
          console.log(code);
        })
      },
      /*模板内容*/
      get_tmpContent(){
        let params = {
          order_id:this.pForm.orderId,
          is_random:this.form.is_random?1:0,
          tmp_id:this.form.tmp_id
        }
        this.$http(api_get_tmpContent,params).then(res=>{
          this.$set(this.form,'content',res.content)
        }).catch(code=>{
          console.log(code);
        })
      },
      /*回评*/
      post_evaluate(){
        let params = {
          id:this.pForm.id,
          score:this.amount,
          content:this.form.content
        }
        this.$http(api_post_evaluate,params).then(res=>{
          this.$message({type:"success",message:res.message||res})
          this.dialog = false;
          this.$emit("submit");
        }).catch(code=>{
          this.$message({type:"error",message:code.message || code})
          this.dialog = true;
        })
      },
      /*批量回评*/
      batch_all_submit(){
        let ids = this.pForm.id.join(",");
        let params = {
          ids:ids,
          score:this.amount,
          content:this.form.content,
          is_all:this.pForm.isAll,
        }
        this.$http(api_post_batch,params).then(res=>{
          this.$message({type:"success",message:res.message||res})
          this.dialog = false;
          this.$emit("submit");
        }).catch(code=>{
          this.$message({type:"error",message:code.message || code})
          this.dialog = true;
        })
      },
      /*追评*/
      add_post_evaluate(){
        let parmas = {
          id:this.pForm.id,
          content:this.form.content
        }
        this.$http(api_post_content,parmas).then(res=>{
          this.$emit("submit");
          this.$message({type:"success",message:res.message||res})
          this.dialog = false;
        }).catch(code=>{
          this.$message({type:"error",message:code.message || code})
        })
      }
    },
    props:{
      value:{},
      pForm:{
        required:true,
        type:Object
      },
    },
    components: {
      pageDialog:require('../../../components/page-dialog.vue').default,
      labelSelect:require('../../../components/label-select.vue').default,
      star:require('./star.vue').default,
    }
  }
</script>
