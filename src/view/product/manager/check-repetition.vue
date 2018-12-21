<template>
    <page-dialog v-model="dialog" title="SKU图片查重" @open="open">
        <div class="image-box">
            <div v-if='!path' class="image-box-tip" title="点击添加图片" @click="add_pic"></div>
            <img v-else :src="path" width="100%" height="100%" @click="add_pic" title="点击更换图片">
        </div>
        <input type="file" ref="input" hidden @change="handleChange" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg">
        <div slot="footer">
            <el-button type="primary" size="mini" class="inline"
                       @click.native="check_repetition">开始查重</el-button>
            <el-button size="mini" class="inline" @click.native="cancel">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .image-box{
        box-sizing:border-box;
        margin-top:20px;
        margin-bottm:20px;
        text-align:center;
        margin-left:175px;
        width:190px;
        height:190px;
        border:1px solid #ddd;
        .image-box-tip{
            width:100%;
            height:100%;
            text-align:center;
            background: url("../../../../src/assets/add-image-icon.png") no-repeat center;
            background-position: center center;
            background-size: 35% 35%;
        }
    }
</style>
<script>
    import {api_get_phash} from '../../../api/product-library'
    export default {
        data() {
            return {
                dialog:this.value,
                phash:'',
                path:0,
            }
        },
        methods:{
            open(){
                this.path = '';
                this.phash = 0;
            },
            check_repetition(){
                if(this.phash===0)return this.$message({type:'warning',message:'图片对比尚未结束，请等待...'});
                this.dialog = false;
                this.$emit('confirm-repetition',this.phash)
            },
            cancel(){
                this.dialog = false;
            },
            handleChange(ev){
                const files = ev.target.files;
                if (!files)return;
                let timer = null;
                let fileArr = Array.prototype.slice.call(files);
                fileArr.forEach((file, index) => {
                    file.uid = Date.now();
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = (e) => {
                        let img = e.target.result;
                        this.path = img;
                        this.get_phash(img)
                    };
                });
            },
            get_phash(img){
                this.$http(api_get_phash,{file:img}).then(res => {
                    this.phash = res.phash;
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                })
            },
            add_pic(){
                this.$refs.input.click();
            },
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
            }
        },
        props:{
            value:{},
        },
        components: {
            pageDialog:require('@/components/page-dialog.vue').default,
        }
    }
</script>
