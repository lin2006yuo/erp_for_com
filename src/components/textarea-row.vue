<template>
    <div class="c-textarea-row">
        <div  class="outDiv" :style="outStyle">
            <div ref="rows" class="rows" >{{textarea}}</div>
        </div>
        <el-input
                type="textarea"
                :rows="textRows"
                ref="area"
                placeholder="请输入内容"
                v-model="textarea"
                @input="change"

        >
            <!--style="   position: absolute!important;top: 1.11px;left: 0;"-->
        </el-input>
    </div>
</template>
<style lang="stylus">
.c-textarea-row{
    width: 100%;
    overflow: hidden;
    position: relative;
    .outDiv{
        padding:5px 8px;
        /*visibility: hidden;*/
        .rows{
        width: 100%;
        display:block;
        line-height: 26px;
        font-size: 1.2rem;
        white-space: normal;
        word-wrap:break-word;
        word-break:break-all;
    }
        .el-textarea{

        }
    }


}
</style>
<script>

    export default{
        data(){
            return {
                textarea:"",
                vals:"",
                tempVal:"",
            }
        },
        methods:{
            change(val){
                this.$nextTick(()=>{
                    let el=this.$refs.rows.getBoundingClientRect();
                    let els=this.$refs.rows
                    if(el.height>this.rows*26){
                        this.textarea=this.tempVal.substring(0,this.tempVal.length-1);
                        els.innerHTML=this.textarea;
                    }else {
                        this.tempVal=val;
                        els.innerHTML=val;
//                        if(val.indexOf("\n")==-1){
//                            this.vals=val;
//                            els.innerHTML=val;
//                        }else {
//                            let da=val.replace(/\n/g,"<br/>")
//                                els.innerHTML=da;
//                        }

                    }
                })
            },

        },
        computed:{
          textRows(){
              return this.rows+2
          },
            outStyle(){
                return {
                    height:(this.rows+2)*26+"px"
                }
            }
        },
        watch:{
              value(val){
                  this.textarea=val;
              },
            textarea(val){
                this.$emit("input",val)
            }
        },
        props:{
          rows:{
              require:true,
              type:Number
          },
            value:{

            }
        },
        components: {}
    }
</script>