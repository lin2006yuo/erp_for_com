<template>
  <page-dialog title="预览" size="large"  v-model="modelVisible" :close-on-click-modal="false">

    <div v-html="previewHtml"></div>
<div style="text-align: right">
  <el-button size="mini" @click="closePreview">关闭</el-button>
</div>
  </page-dialog>
</template>

<style lang="stylus">
  .product-list-box{
    padding:50px;
  }


</style>

<script>
  export default{
    data(){
      return{
        modelVisible:false,
      }
    },
    created(){

    },
    filters:{},
    mounted(){
    },
    updated(){},
    destroy(){},
    methods:{
      closePreview(){
        this.modelVisible = false;
      }
    },
    computed:{},
    watch:{
      modelVisible(val){
        this.$emit('input',val);
      },
      value(val){
        this.modelVisible = val;
      }
    },
    props:{
      value:{},
      previewHtml:{
          type:String
      }
    },
    components:{
      pageDialog: require("../../../../components/page-dialog.vue").default
    }
  }
</script>
