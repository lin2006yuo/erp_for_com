<template>
    <div class="c-right-page">
      <slot name="title">
        <span style="line-height: 26px;">自动生成后需尽快保存本页，否则可能导致无法及时占用库存</span>
        <el-button type="primary" size="mini" @click.native="rebuild" class="fr">重新生成</el-button>
      </slot>
      <slot></slot>
      <slot name="footer"></slot>
    </div>
</template>
<style lang="stylus">
.c-right-page{
  margin-left:5px;
  .detail{
    border: 1px solid #A2B8CE;
    background: #D6E9F2;
    padding:0 10px 10px;
  }
}
</style>
<script>

    export default{
        data(){
            return {}
        },
        props:{
        },
        components: {
        }
    }
</script>
