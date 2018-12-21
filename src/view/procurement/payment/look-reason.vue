<template>
  <div>
      <page-dialog :title="title" v-model="addFormVisible">
          <div class="mt-sm mb-xs">
              <div><span class="c-red">*</span> &nbsp请填写审核不通过的批注</div>
          </div>
          <el-input type="textarea" :maxlength="1200" :placeholder="reason"
                    :autosize="{ minRows: 4, maxRows: 6}"  v-model="addData.remark">
          </el-input>
          <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click.native="addFormVisible = false">取 消</el-button>
          <request-button req-key="batch_failed" @click="add_ymx">确 定</request-button>
          </div>
      </page-dialog>
  </div>
</template>
<style lang="stylus">
</style>
<script>
    export default{
        data(){
            return{
                addFormVisible:false,
                rules:{
                    account_id:[
                        {required: true, message: '请选择账号简称', trigger: 'change',type:'blur'}
                    ],
                }
            }
        },
        created(){},
        watch: {
            addFormVisible(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.addFormVisible = val;
            }
        },
        methods: {
            add_ymx(){
                this.$emit('add_ymx')
            }
        },
        computed: {},
        props: {
            title:{required:true, type: String},
            reason:{required:true, type: String},
            value:{
                type:Boolean,
                required:true
            },
            addData:{
                required:true,
                type:Object
            },
        },
        components: {
            pageDialog: require('@/components/page-dialog.vue').default,
            requestButton: require('../../../global-components/request-button').default,
        }
    }
</script>
