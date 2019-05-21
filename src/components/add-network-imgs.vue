<template>
    <div class="c-add-network-imgs">
        <page-dialog v-model="dialog" :title="$t('ymx-detail.addNetPic')" size="small">
            <div class="mt-sm mb-sm">
                <label>{{$t('ymx-detail.picAddress')}}</label>
                <el-input v-model="imgUrl"
                          class="inline"
                          style="width:80%"
                          type="textarea"
                          :autosize="{ minRows: 4}"
                          :placeholder="$t('ymx-detail.multipleTips')"></el-input>
            </div>
            <div slot="footer">
                <el-button  type="primary" size="mini" @click="add_url">{{$t('ymx-detail.confirm')}}</el-button>
                <el-button   size="mini" @click.native="dialog=false">{{$t('ymx-detail.cancel')}}</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    export default {
        data() {
            return {
                dialog:this.value,
                imgUrl:"",
            }
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
                val&&(this.imgUrl = '');
            },
        },
        methods:{
            add_url(){
                if(!this.imgUrl)return this.$message({type:"warning",message:this.$t('ymx-detail.correctTips')});
                let reg = /^(http:\/\/|https:\/\/).+(\.(jpg|png|bmp|jpeg)$)/;
                let cur  = this.imgUrl.split("|");
                let isTrue = true;
                cur = cur.map(row=>row.trim());
                cur.forEach(row=>{
                    if(!reg.test(row))isTrue = false;
                });
                if(!isTrue)return this.$message({type:"warning",message:this.$t("ymx-detail.addhttp")});
                this.dialog = false;
                this.$emit('add-url',cur);
            },
        },
        props:{
            value:{}
        },
        components: {
            pageDialog: require('./page-dialog.vue').default,
        }
    }
</script>