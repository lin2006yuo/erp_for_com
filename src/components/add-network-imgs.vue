<template>
    <div class="c-add-network-imgs">
        <page-dialog v-model="dialog" title="添加网络图片" size="small">
            <div class="mt-sm mb-sm">
                <label>图片地址：</label>
                <el-input v-model="imgUrl"
                          class="inline"
                          style="width:80%"
                          type="textarea"
                          :autosize="{ minRows: 4}"
                          placeholder="多个地址以 | 隔开"></el-input>
            </div>
            <div slot="footer">
                <el-button  type="primary" size="mini" @click="add_url">确定</el-button>
                <el-button   size="mini" @click.native="dialog=false">取消</el-button>
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
                if(!this.imgUrl)return this.$message({type:"warning",message:"请输入正确的图片地址后再提交！"});
                let reg = /^(http:\/\/|https:\/\/).+(\.(jpg|png|bmp|jpeg)$)/;
                let cur  = this.imgUrl.split("|");
                let isTrue = true;
                cur = cur.map(row=>row.trim());
                cur.forEach(row=>{
                    if(!reg.test(row))isTrue = false;
                });
                if(!isTrue)return this.$message({type:"warning",message:"请添加以http或https开头，并以.jpg或.png或.bmp或.jpeg为结尾的图片"});
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