<template>
  <page-dialog class="contact-buyer" size="small" title="给买家发送消息" v-model="visible" :close-on-click-modal="false">
    <label>模板分组：</label>
    <el-select class="inline" v-model="searchData.tempGroup" @change="select_template_group">
      <el-option v-for="item in tempGroup" :label="item.group_name" :value="item.id" :key="item.id"></el-option>
    </el-select>
    <br><br>
    <label class="mt-sm">模板编号：</label>
    <el-select class="inline" v-model="searchData.selectTemplate" @change="select_msg_text">
      <el-option v-for="item in templates" :label="item.template_name" :value="item.template_id" :key="item.template_id"></el-option>
    </el-select>
    <br><br>
    <label class="mt-sm">模板内容：</label>
    <el-input class="inline" v-model="msgText" type="textarea" :rows="5" style="width: 455px"></el-input>
    <div class="t-right" style="padding: 10px;">
      <el-button type="primary" size="mini" @click="post_message">发送</el-button>
      <el-button type="primary" size="mini" @click="cancel">取消</el-button>
    </div>
  </page-dialog>
</template>

<style lang="stylus">

</style>
<script>
  import {api_reply, api_template_groups, api_templates, api_aliexpress_msg, api_msg_tpl_content, api_ebay_send} from '../../../api/smt-mail'
    export default{
        page: {},
        refresh(){
            this.searchData = {};
            this.init();
        },
        data(){
            return {
              searchData:{
                  tempGroup:'',
                  selectTemplate:''
              },
              visible:false,
              msgText:'',
              tempGroup:[],
              templates:[]
            }
        },
        methods: {
          init(){

          },
          cancel(){
            this.visible=false;
          },
          get_temp_groups(){
              this.$http(api_template_groups,{template_type:1,channel_id:this.channel_id}).then(res=>{
                  this.tempGroup=res.data;
              }).catch(code=>{
                  this.$message({
                      type:"error",
                      message:code.message || code
                  })
              })
          },
          post_message(){
              if(this.msgText===''){
                  this.$message({
                      type:"error",
                      message:"回复内容不能为空"
                  });
                  return
              }
              switch (this.channel_id){
                case 4:
                  this.$http(api_reply,{order_id:this.mdfid,content:this.msgText}).then(res=>{
                    this.$message({
                      type: 'success',
                      message: res.message || res
                    });
                    this.visible = false;
                  }).catch(code=>{
                    this.$message({
                      type:"error",
                      message:code.message || code
                    })
                  });
                  break;
                case 1:
                    this.$http(api_ebay_send, {order_id:this.mdfid,text:this.msgText}).then(res=>{
                      this.$message({
                        type: 'success',
                        message: res.message || res
                      });
                      this.visible = false;
                    }).catch(code=>{
                        this.$message({
                            type:"error",
                            message:code.message || code
                        });
                    });
                    break;
              }
          },
          select_template_group(){
              this.$http(api_templates,{channel_id:this.channel_id,template_type:1,group_id:this.searchData.tempGroup}).then(res=>{
                 this.templates = res.data;
              });
              this.searchData.selectTemplate = '';
              this.msgText = '';
          },
          select_msg_text(){

              this.$http(api_msg_tpl_content,{template_id:this.searchData.selectTemplate,search_id:this.mdfid,search_type: 'order',channel_id:this.channel_id}).then(res=>{
                  this.msgText = res.data;
              });

//              switch (this.channel_id)
//              {
//                case 4:
//                  this.$http(api_aliexpress_msg,{id:this.order_id,code:this.searchData.selectTemplate,type:1}).then(res=>{
//                    console.log(res);
//                    this.msgText = res.content;
//                  });
//                  break;
//                case 1:
//                  this.$http(api_msg_tpl_content,{template_no:this.searchData.selectTemplate,search_id:this.order_id,search_type: 'order',channel_id:this.channel_id}).then(res=>{
//                    this.msgText = res.data;
//                  });
//                  break;
//              }
          }
        },
        computed: {},
        watch: {
          visible(val){
              this.$emit('input',val);
          },
            value(val){
                this.visible = val;
                if(val){
                  this.searchData={
                      tempGroup:'',
                      selectTemplate:''
                  };
                  this.msgText = '';
                    this.get_temp_groups();
                }
            }
        },
        props: {
            value:{},
            order_id:{},
            channel_id:{},
            mdfid:{}
        },
        components: {
          pageDialog: require('../../../components/page-dialog.vue').default
        }
    }
</script>

