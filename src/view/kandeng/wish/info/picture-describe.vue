<template>
    <el-row class="p-picture-describe-wish">
        <div class="p-titleBgcol">
            <span class="p-picture-describe">{{label}}</span>
        </div>
        <div class="p-picture">
            <el-form :model="pictureData" ref="picture" label-width="135px">
                <el-form-item label="刊登图片：" required>
                    <img-add v-model="pictureData.images"
                             @save-meitu="save_meitu(pictureData.images,$event)"
                             :is-kandeng="true"
                             :defaultRandom="!trueId||isCopy"
                             :show-random-btn="!trueId||isCopy"
                             :need-clear-all="true"
                             picSize="_200x200."
                             :channel_id="3"
                             :showBigPic = true
                             :base-url="baseUrl"
                             :img-number="20"
                             :image="imgStyle"
                             :show-satch-mg="false"
                             :id="especialIds">
                    </img-add>
                    <div class="p-upload__notice">注意:第一张默认为主图，支持拖动排序。像素建议为800*800的图片,最多可选20张图，每张图片大小不超过2M。</div>
                </el-form-item>
                <el-form-item label="内容描述：">
                    <el-input
                            type="textarea"
                            :autosize="{ minRows: 30}"
                            placeholder="请输入内容"
                            v-model="pictureData.description">
                    </el-input>
                </el-form-item>
            </el-form>
            <publish-img v-model="picVisable" @submit="selected"
                         :channel="channelId"  :account="pictureData.accountid"
                         :id="id" :multiple="multiple" :spu="spu"></publish-img>
        </div>
    </el-row>
</template>
<style lang="stylus">
    .p-picture-describe-wish{
        .p-titleBgcol{
            background: #FAECE7;
            .p-picture-describe{
                color: #FFF;
                font-weight:bold;
                font-size: 1.7rem;
                padding: 5px 10px;
                background: #FFB732;
                display: inline-block;
            }
        }
        .p-picture{
            .el-form-item__label{
                margin-top: 25px;
            }
            padding: 50px;
            border-left: 3px solid #FFB732;
            .p-upload__notice{
                color: red;
            }
        }
    }
</style>
<script>
    import htmlEditor from '../../../../components/html-editor.vue'; //-----文本编辑器引入
    export default{
        data(){
            return {
                flag:0,
                multiple:false,
                editor:"0",
                picVisable:false,
                tempImg:{},
                isAdd:false,
                imgStyle:{
                    width:'130px',
                    height:'130px'
                }
            }
        },
        methods:{
            save_meitu(imgList,obj){
                if(imgList[obj.curIndex])imgList[obj.curIndex].path = obj.newPath;
            },
            add_pic(){
                this.multiple=true;
                this.flag=1;
                this.picVisable=true;
            },
            selected(val){
                switch (this.flag){
                    case 1:
                        val.forEach(row=>{
                            if(this.pictureData.images.length<20){
                                this.pictureData.images.push({path:row.path})
                            }
                        });
                        break;
                    case 2:
                        this.tempImg.path=val[0].path;
                        break;
                }
            },
            change_image(image){
                this.tempImg=image;
                this.picVisable=true;
                this.multiple=false;
                this.flag=2;
            },
            remove(image){
                let index = this.pictureData.images.indexOfFun(row=>row.path === image.path);
                this.pictureData.images.splice(index, 1);
            },
            out(image){
                image.timer = setTimeout(()=>{
                    this.$set(image,"show",false)
                },300);
            },
            over(image){
                image.timer = setTimeout(()=>{
                    this.$set(image,"show",true)
                },300);
            }
        },
        props:{
            especialIds:{//多个商品情况下传入img-add组件的id
                require: true,
                type: Array,
            },
            id:{
                required:true,
            },
            trueId:{
                required:true,
                type:[String,Number]
            },
            isCopy:{
                type:Boolean
            },
            pictureData:{
                required:true,
                type:Object
            },
            label:{
                required:true,
                type:String
            } ,
            channelId:{
                required:true,
            },
            spu:{
                required:true,
            },
            baseUrl:{
                required:true,
                type:String
            },
        },
        components: {
            htmlEditor,
            imageUpload:require('./image-upload.vue').default,
            dragDrop:require("../../../../components/drag-drop"),
            publishImg:require('../../publish-img.vue').default,
            pictureComponent:require('../../ebay/kandeng-list/add-edit-listing/picture-component.vue').default,
            imgAdd:require('../../../../components/img-add.vue').default,
        }
    }
</script>
