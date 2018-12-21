<template>
    <div class="c-big-component">
      <label for="" style="line-height: 30px;">{{label}}</label>
      <slot></slot>
    </div>
</template>
<style lang="stylus">
.c-big-component{
  border: 1px solid #A2B8CE;
  background: #D6E9F2;
  padding:0 10px 10px;
}
</style>
<script>

    export default{
        data(){
            return {
            }
        },
      props:{
        label:{
          required:true,
          type:String
        }
      },
        components: {
        }
    }
</script>
