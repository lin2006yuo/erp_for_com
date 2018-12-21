<template>
    <div class="c-picture-component">
        <drag-drop v-model="imgs" tag="ul">
            <li  v-for="(item,index) in imgs"
                 :key="index"
                 :class='["mr-sm","allli",(index===0&&showMain)?"diffli":""]'
            >
                <img :src="item.thumb||item.path" height="100%" width="100%" title="点击图片可查看大图" @click="showBig?blow_up(item,index):'javascript';">
                <div  v-if="index===0&&showMain" class="mainMap">橱窗图</div>
                <div class="tool">
                    <span class="btn-img el-icon-delete" @click="remove(item)"></span>
                    <span class="btn-img el-icon-edit" @click="change_image(item)"></span>
                    <span v-if="showBig" class="btn-img el-icon-search" @click="blow_up(item,index)" ></span>
                </div>
            </li>
        </drag-drop>
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="imgTitle"></blowup-image>
    </div>
</template>
<style lang="stylus" scoped>
    .c-picture-component{
        .allli{
            height:100px;
            width:100px;
            display: inline-block;
            position:relative;
            border: 1px solid #CFCFCF;
            transition:all .3s ease;
            &:hover{
                transform:scale(1.1);
                box-shadow:0 0 5px #ccc;
                z-index:1;
            }
            &:hover .tool{
                height:30px;
            }
        }

        .diffli{
            height:125px!important;
            width:125px!important;
        }
        .c-titleBgcol{
            background: #FAECE7;
            .c-title-span{
                color: #FFF;
                font-weight:bold;
                padding: 5px 10px;
                font-size: 1.7rem;
                background: #ABCD05;
                display: inline-block;
            }
        }
        .mainMap{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 25px;
            background: rgba(250, 172, 171, 0.8);
            text-align: center;
            vertical-align: middle;
            color: white!important;
            font-weight: 800;
        }
        .c-titleColour-price{
            padding: 20px;
            border-left: 3px solid #ABCD05;
        }
        .tool {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 0;
            background-color: rgba(0, 0, 0, .5);
            text-align: center;
            overflow :hidden;
            transition:all .3s ease;
             .btn-img{
                 box-sizing:border-box;
                 width:22px;
                 height:22px;
                 display: inline-block;
                 color: #fff;
                 font-size: 1.3rem;
                 cursor: pointer;
                 margin:5px 2px;
                 overflow:hidden;
                 line-height:22px;
                 &:hover{
                     border-radius:2px;
                     background-color:rgba(0,0,0,.55);
                 }
                 &:active{
                     background-color:rgba(0,0,0,.9);
                 }
                 >.i{
                     color: #fff;
                 }
             }
        }
    }
    .mainMap{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 25px;
        background: rgba(250, 172, 171, 0.8);
        text-align: center;
        vertical-align: middle;
        color: white!important;
        font-weight: 800;
    }
</style>
<script>
    export default {
        data() {
            return {
                tempImg:{},
                isAdd:false,
                imgPath:"",
                imgDialog:false,
                imgTitle:"",
            }
        },
        methods:{
            remove(item){
                let index = -1;
                if(!!item.thumb){
                    index = this.imgs.findIndex(row=>{return row.thumb===item.thumb});
                }else{
                    index = this.imgs.findIndex(row=>{return row.path===item.path});
                }
                if(!!index||index===0) this.imgs.splice(index,1);
                this.$emit("remove")
            },
            change_image(item){
                this.$emit("change-image",item);
            },
            blow_up(item,index){
                this.imgDialog = true;
                this.imgPath = !!item.thumb?item.thumb:item.path;
                if(this.showMain){
                    this.imgTitle = index===0?`橱窗图`:`图${index}`;
                }else{
                    this.imgTitle= `图${index+1}`
                }
            },
        },
        props:{
            imgs:{
                required:true,
                type:Array
            },
            showMain:{
                default(){
                    return false
                },
            },
            showBig:{
                default(){
                    return false
                }
            },
        },
        components: {
            dragDrop:require("../../../../../components/drag-drop").default,
            blowupImage:require("../../../../../components/blowup-image.vue").default,

        }
    }
</script>
