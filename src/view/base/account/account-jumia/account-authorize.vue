<template>
    <page-dialog v-model="show" 
                 size="small"
                 :title="title" 
                 class="c-joom-add"
                 @open="open">
        <el-form ref="form" 
                 :model="form" 
                 label-width="140px"
                 :rules="rules">
            <el-form-item label="client_id：" prop="client_id">
                <el-input v-model="form.client_id" style="width:270px" :disabled="isLook" class="inline"></el-input>
            </el-form-item>
            <el-form-item label="client_secret：" prop="client_secret">
                <el-input v-model="form.client_secret" style="width:270px" :disabled="isLook" class="inline"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" size="mini" @click="submitPermit" v-if="!isLook">确定</el-button>
            <el-button size="mini" @click.native="show=false">关   闭</el-button>
        </div>
    </page-dialog>
</template>

<script>
import {api_jumia_permit,api_jumia_account_look} from '../../../../api/jumia-account'

export default {
  data(){
    return{
      rules:{
        client_id:{required:true, message: '必填项不能为空', trigger: 'blur'},
        client_secret:{required:true, message: '必填项不能为空', trigger: 'blur'}
      },
      show:this.value,
      form:{ 
            id:'',              
            client_id:'',
            client_secret:'',                      
      },
    }
  },
  
  methods:{
    open(){
       this.$http(api_jumia_account_look,this.id)
        .then(res=>{
          this.form.id=res.id;
          this.form.client_id = res.client_id;
          this.form.client_secret=res.client_secret;        
        })
        .catch(code=>{
          this.$message({type:"error", message: code.message || code});
        })
    },
    submitPermit(){
      this.$refs['form'].validate(valid=>{
        if (valid) {
          // console.log(this.form,'this.form');
          this.$http(api_jumia_permit,this.form)
            .then(res=>{
              this.$message({type:'success',message:'授权成功'});
              this.show=false;
              this.$emit("status-change",1);
            })
            .catch(error=>{
              this.$message({type:'error',message:error.message});
              this.show=false;
            })
          } else {
              return false
          }
      })
     
    }
  },
  watch:{
          show(val){
              this.$emit('input', val);
          },
          value(val){
              this.show = val;
          },
        },
  props:{
          value:{
            required:true,
            type:Boolean
          },
          title:{
            required:true,
          },
          id:{},
          isLook:{
            default(){
            	return false;
            }
          },
        },
         
  components:{
    pageDialog:require('../../../../components/page-dialog.vue').default,
    requestButton:require('../../../../global-components/request-button').default
  }
}
</script>

<style lang="stylus">
   
</style>