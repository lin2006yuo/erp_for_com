<template>
        <page-dialog title="图片"
                     size="large"
                     v-model="show"
                     :close-on-click-modal="false" >
            <el-row>
                <el-button @click.native="showImg=true" type="primary"  :disabled="image.length>=20" size="mini" class="mb-sm">添加图片</el-button>
            </el-row>
            <drag-drop  v-model="image" tag="ul"  class="ui-img">
                <li v-for="(item,index) in image">
                    <img :src="item.path" alt="item.path" height="100" width="100">
                    <span @click="del(index)"> 删除</span>
                </li>
            </drag-drop>
            <publish-img v-model="showImg" :id="id"  :channel="4"  @submit="get_img" ></publish-img>
            <div> <span style="font-weight: 600">注意：</span> <span >第一张默认为<span style="color: red">主图</span>，支持拖动排序。最多可以选<span style="color: red">20</span>张图。</span></div>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click.native="keep" type="primary"  >保  存</el-button>
                <el-button size="mini" @click.native="show=false" >关   闭</el-button>
            </div>
        </page-dialog>
</template>
<style lang="stylus" scoped>
.ui-img{
    margin-left: 10px;
    padding:5px 0  5px  10px;
>li{
    margin: 0 5px 5px 0;
    position: relative;
    list-style: none;
    display: inline-block;
    top: 0;
    transition: all 0.2s linear;
    &:hover{
         box-shadow: 0 0 10px #AA67D5;
        transform:scale(1.1,1.1) ;
        >span{
             opacity:1
         }
     }
    left: 0;
    >span{
         position: absolute;
        display: block;
        width: 100%;
        text-align: center;
        opacity: 0;
         background-color: rgba(0, 0, 0, 0.3);
        left: 0;
        bottom: 0;
        &:hover{
        cursor: pointer;
         }
     }
 }
}
</style>
<script>

    export default{
        data(){
            return {
                show:false,
                showImg:false
            }
        },
        created(){
        },
        mounted(){
        },
        computed: {},
        methods: {
            del(index){
                this.image.splice(index,1)
            },
            add(){

            },
            keep(){
                this.$emit('selected',this.image);
                this.show=false;
            },
            get_img(imgs){
                imgs.forEach(row=>{
                    if(this.image.length<20){
                         this.image.push({path:row.path})
                    }
                })
            }
        },
        filters: {},
        watch: {
            show(val){
                this.$emit("input", val)
            },
            value(val){
                this.show=val;
            }
        },
        props: {
            value:{},
            image:{

            },
            id:{
                require:true,
            },
        },
        components: {
            dragDrop:require("../../../../components/drag-drop"),
            publishImg:require("../../publish-img.vue").default,
            pageDialog:require("../../../../components/page-dialog.vue")
        }
    }
</script>