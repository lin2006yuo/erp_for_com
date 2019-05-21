<template>
    <page-dialog v-model="show"
                 size="large"
                 @open="open"
                 width="67%"
                 :title="title"
                 :close-on-click-modal="false">
        <label  class="inline font-14 relative_">详情描述：</label>
        <div class="relative__">
            <kindeditor :editor-text="descData.description"
                        :id="descData.goods_id"
                        :can-replace="false"
                        :showAddPicNormal="false"
                        @content-change="editor_content_change"
                        :editor-id="editorId"></kindeditor>
        </div>

        <div slot="footer">
            <request-button req-key="save-desc"
                            :mintime="300"
                            @click="submit">确定</request-button>
            <el-button size="mini"
                       @click.native="show=false">取消</el-button>
        </div>
    </page-dialog>
</template>

<script>
    import {api_save_goods_desc,} from  '@/api/ebay-title-key'
    export default {
        name: "desc-dialog",
        data(){
            return{
                show:false,
                description:'',
                especialIds:this.descData.goods_id
            }
        },
        watch:{
          value(val){
              this.show=val;
          },
          show(val){
              this.$emit('input',val)
          }
        },
        computed:{
            editorId(){
                return `${this.descData.goods_id}${this.descData.goods_id}`
            },
        },
        methods:{
            open(){
            },
            submit(){
                let data_ = {data:[this.descData]};
                this.$http(api_save_goods_desc,data_).then(res=>{
                    this.$message({
                        type:"success",
                        message:  res.message||res
                    });
                    this.show=false;
                }).catch(code=>{
                    this.$message({
                        type:"warning",
                        message:  code.message||code
                    });
                }).finally(()=>{
                    this.$reqKey('save-desc',false)
                })
            },
            editor_content_change(val){
                this.descData.description = val;
            },
        },
        components:{
            kindeditor:require('@/components/kindeditor.vue').default,
        },
        props:{
            value:{},
            title:{},
            descData:{}
        }
    }
</script>

<style scoped>
.font-14{font-size: 14px;}
.relative__{
    position: relative;
    left: 75px;
    top: -10px;
}
.relative_{
    position: relative;
    top: 10px;
}
</style>
