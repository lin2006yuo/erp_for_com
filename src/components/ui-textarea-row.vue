<template>
    <div class="p-ui-textarea-row">
        <!--<label  class="mb-xs">限制{{row}}行,还可以输入{{remain()}}行</label>-->
        <el-input
                ref="hidden"
                class="hidden"
                type="textarea"
                :autosize="true"
                :value="textareahidden">
        </el-input>
        <el-input
                type="textarea"
                :rows="row"
                placeholder="请输入内容"
                v-model="textarea"
                @change="change">
        </el-input>
    </div>
</template>
<style lang="stylus">
    .p-ui-textarea-row{
        position: relative;
        .hidden{
            position: absolute;
            top:-999px;
            left: -999px;
            z-index: -999;
        }

    }
</style>
<script>
    export default{
        data(){
            return {
                textarea:this.value,
                row_height:0,
                temp:"",
            }
        },
        computed: {
            textareahidden(){
                return this.textarea+"1"
            }
        },
        methods: {
            remain(){
                let length=this.row-this.row_height;
                return  length
            },
            change(e){
                let el=this.$refs.hidden.$el.getBoundingClientRect();
                let row=Math.round((el.height-12)/17);
                      if(row<=this.row){
                        this.row_height=row;
                        this.temp=this.textarea;
                      }else {
                          this.row_height=this.row;
                          this.textarea="";
                          this.$nextTick(()=>{
                              this.textarea=this.temp.substring(0,this.temp.length-1);
                          })
                      }
            },
            deletes(){
            }
        },
        filters: {},
        watch: {
            textarea(val){
                this.$emit("input",val)
            },
            value(val){
                this.textarea=val;
            },
        },
        props: {
            value:{},
            row:{
                type: Number,
                default(){
                    return 5;
                },
            }
        },
        components: {}
    }
</script>
