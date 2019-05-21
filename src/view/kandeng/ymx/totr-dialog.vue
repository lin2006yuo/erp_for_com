<template>
    <el-dialog
    title="提示"
    :visible.sync="dialog" width="20%" top="300px" class="tort-box">
    <div class="el-message-box__content">
        <div class="el-message-box__status el-icon-warning"></div>
        <div class="el-message-box__message" style="margin-left: 50px">
            <p>【{{totrvalue.name}}】中【{{totrvalue.bool?totrvalue.bool:totrvalue.bol}}】有商标侵权风险，建议删除。</p>
            <p style="font-weight:600;">PS:确定该词无影响请选择忽略，否则请点击确定后修订内容再刊登。</p>
        </div>
    </div>
        <div class="el-dialog__footer" >
            <el-button size="min" @click="check">忽略</el-button>
            <el-button size="min" type="primary" @click="dialog=false">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        data(){
            return{
                dialog:false
            }
        },
        methods:{
            check(){
                this.dialog=false;
                this.$emit("check",this.totrvalue)
            }
        },
        watch:{
          value(val){
              this.dialog=val;
          },
            dialog(val){
              this.$emit("input",val)
            }
        },
        props:{
            value:{},
            totrvalue:{},
        }
    }
</script>

<style lang="stylus">
    .tort-box{
        .el-dialog--small{
            width:620px
        }
        p{
            line-height:30px;
        }
    }
</style>
