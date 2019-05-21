<template>
  <div class="p-review-evaluate">
    <page-dialog title="回评" size="small" v-model="visible" :close-on-click-modal="false" @change="close_dialog">
      <div class="box-wripper">
        <div class="mb-sm">
          <el-radio class="radio" v-model="radio" label="1">好评</el-radio>
        </div>
        <div class="mb-sm">
          <el-checkbox v-model="is_random" label="随机从评选模块中挑选评选内容"></el-checkbox>
        </div>
        <div class="mb-sm">
          <label style="font-weight: bold;">选择评价模板</label>
          <el-select v-model="template_id" placeholder="请选择评价模板" class="inline" @change="change_temp">
            <el-option
              v-for="item in template"
              :label="item.template_name"
              :key="item.template_id"
              :value="item.template_id">
            </el-option>
          </el-select>
        </div>
        <div class="mb-sm">
          <el-form label-width="74px" ref="form" :rules="rules">
            <el-form-item  label="" required>
              <el-input class="inline" type="textarea" v-model="content" :autosize="{ minRows: 4, maxRows: 8}"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer">
        <el-button type="primary" size="mini" @click.native="submit" :disabled="content==''">确认</el-button>
        <el-button size="mini" @click.native="visible = false;">取消</el-button>
      </div>
    </page-dialog>
  </div>
</template>
<style lang="stylus">
  .p-review-evaluate{
  .box-wripper{
    padding:10px 10px 20px;
    border:1px solid #BDCDDC;
    background-color:#F1F6FC;
  }
  .el-form-item__label{
    font-weight: bold;
  }
  }

</style>
<script>
  import {api_getTemplates,api_tplContent,api_respond,api_batch_comment,api_comment} from '../../../api/eBay-estimate'
  import {api_msg_tpl_content, api_post_tpl_content} from '../../../api/smt-mail'
  export default{
    data(){
      return {
        visible:false,
        is_random:false,
        template_id:'',
        template:[],
        content:'',
        radio:'1',
        rules:{}

      }
    },
    created(){
    },
    mounted(){
      this.getTemplates()
    },
    methods: {
      //获取评价模板
      getTemplates(){
        let params = {
          type:1,
          channel_id:1,
          template_type:2
        };
        this.$http(api_getTemplates,params).then(res=>{
          this.template = res.data;
        }).catch(code=>{
          this.$message({message:code.message||code,type:'error'})
        })
      },
      //改变评价模板下拉框 获得评价内容放入textarea中
      change_temp(){
        if (!this.template_id) {
          return;
        } else {
          this.is_random = false;
        }
        let params = {
          order_id:this.order_id,
          search_type:'evaluate',
          channel_id:this.channel_id,
          template_id:this.template_id
        };
        this.getContent(params);
      },
      getContent(params){
        this.$http(api_msg_tpl_content,params).then(res=>{
          console.log(res);
          this.content = res.data;
        }).catch(code=>{
          this.$message({message:code.message||code,type:'error'})
        })
      },
      //确认提交
      submit(){
            let comment = {
              order_id:this.mdfid,
              text:this.content,
            };
            this.$http(api_post_tpl_content,comment).then(res=>{
              this.$message({
                message: res.message||res,
                type: 'success'
              });
              this.visible = false;
              this.$emit('review',this.index);
            }).catch(code=>{
                this.$message({message:code.message||code,type:'error'})
            })

      },
      //弹框关闭时 清空数据
      close_dialog(val){
        if (!val) {
          this.is_random = false;
          this.template_id = '';
          this.content = '';
          this.radio = '1';
        }
      }
    },
    filters: {},
    watch: {
      value(val){
        this.visible=val;
      },
      visible(val){
        this.$emit('input',val);
      },
      //监听 随机从评选模块中挑选评选内容 多选框 是否勾选
      is_random(val){
        if (val) {
          // 勾选则调接口获取模板内容
          this.template_id = '';
          let params = {
              search_id:this.mdfid,
              is_random:1,
              search_type:'order',
              channel_id:this.channel_id
          };
          this.getContent(params);
        } else {
          //清空
          this.content = '';
        }
      }
    },
    computed: {},
    props: {
      value:{},
      order_id:{},
      index:{},
      channel_id:{},
        mdfid:{}
    },
    components: {
      pageDialog:require('../../../components/page-dialog.vue').default,
    }
  }
</script>
