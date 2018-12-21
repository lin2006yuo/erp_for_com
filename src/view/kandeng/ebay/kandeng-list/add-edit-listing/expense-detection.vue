<template>
    <div class="c-expense-detection">
        <page-dialog v-model="dialog" title="提示" size="small" class="dialog-box">
            <div class="expense-box">
                <div class="expense-box-line">
                    <span>Listing Fee</span>
                    <span class="fr">{{objData.listing_fee}}</span>
                </div>
                <div class="expense-box-noline">
                    <span>Lnsertion Fee</span>
                    <span class="fr">{{objData.insertion_fee}}</span>
                </div>
            </div>
            <div slot="footer">
                <el-button type="primary" size="mini" class="inline" @click.native="dialog = false">关闭</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus" scoped>
    .dialog-box{
        >.inner{
            >.dialog__body{
                width:400px;
                height:150px;
                margin:0 auto;
                position:relative;
            }
        }
        .expense-box{
            width:200px;
            position: absolute;
            top:35%;
            left:50%;
            transform: translate(-50%,-50%);
            .expense-box-line{
                border-bottom:1px solid #000000;
                padding:5px;
            }
            .expense-box-noline{
                padding:5px;
            }
            span{
                font-size:1.3rem;
            }
        }
    }
</style>
<script>

    export default {
        data() {
            return {
                dialog:this.value,
            }
        },
        watch:{
            dialog(val){
                this.$emit("input",val);
            },
            value(val){
                this.dialog = val;
                console.log(this.objData,'objData');
            },

        },
        props:{
            value:{},
            objData:{}
        },
        components: {
            pageDialog:require('../../../../../components/page-dialog.vue').default,
        }
    }
</script>