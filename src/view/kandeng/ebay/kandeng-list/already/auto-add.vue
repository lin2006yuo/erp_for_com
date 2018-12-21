<template>
    <page-dialog v-model="show" size="small" title="自动补货设置" class="p-batch-edit"
                 :close-on-click-modal="false">
      <el-row class="auto-add">
        <el-col :span="8" style="text-align: right">
          <label for="">自动补在线数量：</label>
        </el-col>
        <el-col :span="16">
          <el-radio class="radio" v-model="autoAdd" label="1">卖出多少，即补多少</el-radio><br />
          <el-radio class="radio" v-model="autoAdd" label="0">不补</el-radio>
        </el-col>
      </el-row>
      <div class="tips">
        <p>小提示：SKU为停售、卖完下架、缺货产品不自动补货；</p>
        <p>【拍卖】产品不支持自动补充功能！</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <request-button req-key="autoAdd" @click="keep" :mintime="300">确定</request-button>
        <el-button size="mini" @click.native="close" >关闭</el-button>
      </div>
    </page-dialog>
</template>
<style lang="stylus">
  .p-batch-edit{
    .auto-add{
      padding-top: 20px;
      label{
        line-height 30px;
      }
    }
    .tips{
      padding-top: 50px;
      text-align: center;
    }
    .dialog-footer{
      text-align:center;
    }
    .icon-red{
      color: red;
      font-weight :bolder;
      padding: 0px 3px;
    }
  }
</style>
<script>
    import {api_ebay_replenishment} from "../../../../../api/ebay-kandeng-operated"
    export default{
        data(){
            return{
              show:this.value,
              autoAdd:"",
            }
        },
        methods:{
          keep(){
            let arr =[];
            this.selectIds.forEach(row=>{
              if( row.isCheck){
                arr.push({
                  "id":row.id,
                  "replen":this.autoAdd
                })
              }
            });
            this.$http(api_ebay_replenishment,{data:arr}).then(res=>{
              this.$message({
                type:"success",
                message:res.message||res
              });
              this.show = false;
            }).catch(code=>{
              this.$message({message:code.message||code,type:'error'})
            }).finally(()=>{
                this.$reqKey('autoAdd',false)
            })
          },
          close(){
            this.show=false;
          },
        },
        watch:{
          value(val){
            this.show=val;
          },
          show(val){
            this.$emit("input",val)
          }
        },
        props:{
          value:{},
          selectIds:{
            required:true,
            type:Array
          }
        },
        components:{
            pageDialog:require("../../../../../components/page-dialog.vue").default
        }
    }
</script>
