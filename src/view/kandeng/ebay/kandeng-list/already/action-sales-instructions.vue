<template>
    <page-dialog v-model="show" size="large" @open="open"
                 title="批量修改销售说明" :close-on-click-modal="false">
      <el-row>
        <el-col :span="8" class="text-right">
          <label class="inline">销售说明：</label>
        </el-col>
        <el-col :span="16">
          <el-select v-model="salesDetial" placeholder="请选择" clearable class="has-inline mr-md" filterable style="width:200px">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-button size="mini"
                   @click.native="title_preview"
                   type="primary"
                   class="mt-sm mb-sm fr">预览</el-button>
      </el-row>
      <el-table :data="selectIds" style="width: 100%">
        <el-table-column prop="item_id" label="商品ID">
        </el-table-column>
        <el-table-column prop="title" label="修改前">
        </el-table-column>
        <el-table-column prop="newTitle" label="修改后">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click.native="keep" type="primary">保存待同步平台</el-button>
        <el-button size="mini" @click.native="close" >关   闭</el-button>
      </div>
    </page-dialog>
</template>
<style lang="stylus">
  .text-right{
    text-align: right;
    padding-right:5px;
  }
</style>
<script>
  import {api_edit_ebay_product_auction_price} from "../../../../../api/ebay-kandeng-operated"
  export default{
      data(){
          return{
            show:this.value,
            salesDetial:"",
            options:[]
          }
      },
      methods:{
        open(){
            this.salesDetial = "";
        },
        // 预览
        title_preview(){
          if(!this.salesDetial){
            this.$message({type:'warning',message:"请选择销售说明"})
            return;
          }
          let flag=true;
          switch (this.title.select){
            case "1":      //选择前缀 或者后缀
              if(this.title.prefix.isPre&&this.title.prefix.isSuf){
                this.selectIds.forEach(row=>{
                  this.$set(row,"newTitle",this.title.prefix.pre+row.title+this.title.prefix.suf)
                })
              }else if(this.title.prefix.isPre&&!this.title.prefix.isSuf){
                this.selectIds.forEach(row=>{
                  this.$set(row,"newTitle",this.title.prefix.pre+row.title)
                })
              }else if(!this.title.prefix.isPre&&this.title.prefix.isSuf){
                this.selectIds.forEach(row=>{
                  this.$set(row,"newTitle",row.title+this.title.prefix.suf)
                })
              }else {
                flag=false
                this.$message({type:'warning',message:"请选择加前缀或后缀"})
              }
              break;
            case "2":   //查找替换
              if(this.title.find.value===""){
                flag=false
                this.$message({type:'warning',message:"请选择要替换的内容"})
              }else {
                this.selectIds.forEach(row=>{
                  let reg=new RegExp(this.title.find.value,"g")
                  let name=row.title.replace(reg,this.title.find.replace)
                  this.$set(row,"newTitle",name)
                })
              }
              break;
            case "3":  //统一修改
              if(this.title.unite===""){
                flag=false
                this.$message({type:'warning',message:"请选择要替换的内容"})
              }else {
                this.selectIds.forEach(row=>{
                  this.$set(row,"newTitle",this.title.unite)
                })
              }
              break;
            case "4": //过滤重复词
              break;
            case "5": //首字母大写
              this.selectIds.forEach(row=>{
                let name= row.title.split(/\s+/);
                name= name.map(rows=>{
                  rows=this.up_first_letter(rows)
                  return rows;
                });
                this.$set(row,"newTitle",name.join(' '))
              })
              break;
          }
          return flag
        },
        up_first_letter(str){  //首字母大写
          return str.substring(0,1).toUpperCase( ) + str.substring(1);
        },
        //保存标题
        keep(){
          let flag=this.title_preview();
          if(flag){
            let data= this.selectIds.map(row=>{
              return {
                id:row.id,
                title:row.newTitle
              }
            })
            let postData={
              type:"title",
              data:data,
            }
            this.$http(api_edit_ebay_title,postData).then(res=>{
              this.$message({type:"success",message:res.message||res});
              this.show=false
            }).catch(code=>{
              this.$message({message:code.message||code,type:'error'})
            })
          }
        },
        close(){
          this.show=false;
        },
      },
      watch:{
          show(val){
              this.$emit('input', val);
          },
          value(val){
              this.show = val;
          }
      },
      computed:{
      },
      props:{
          value:{
            required:true,
          },
          selectIds:{},
      },
      components:{
          pageDialog:require('../../../../../components/page-dialog.vue').default
      }
    }
</script>
