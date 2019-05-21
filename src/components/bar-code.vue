<template>
    <div class="c-bar-code" :style="size" >
        <!--<img ref="img"  style="width: 100%;height: 100%">-->
     <canvas ref="img" style="width: 100%;height: 100%"></canvas>
    </div>
</template>
<style lang="stylus">
    .c-bar-code{
        height: 100%;
        width: 100%;
    }
</style>
<script>
    export default{
        data(){
            return {}
        },
        mounted(){
          this.$nextTick(()=>{
              // var JsBarcode = require('jsbarcode');
              this.gen_barcode();
          })
        },
        methods:{
            gen_barcode(val){
                JsBarcode(this.$refs.img, val || this.value,{ font:'fantasy',width:4, height:60, displayValue: this.showFont,fontSize:26, margin:3});
            }
        },
        props:{
            value:{},
            showFont:{
                type:Boolean,
                default:true,
            },
            size:{
                type:Object,
                default:function () {
                    return {
//                        minWidth:'250px',
//                        minHeight:'65px'
                    }
                }
            }
        },
        components: {}
    }
</script>
