<template>
  <page-dialog title="预览" size="large"  v-model="modelVisible" :close-on-click-modal="false">

    <div v-html="previewHtml"></div>

    <el-button size="mini" @click.native="modelVisible = false">关闭</el-button>
  </page-dialog>
</template>

<style>

</style>

<script>
  export default{
    data(){
      return{
        modelVisible:false
      }
    },
    created(){

    },
    filters:{},
    mounted(){},
    updated(){},
    destroy(){},
    methods:{},
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
