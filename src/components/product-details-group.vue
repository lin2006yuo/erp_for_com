<template>
    <div class="c-product-details-group" >
        <drag-drop v-model="itemData"
                   tag="ul"
                   @move="move_drap"
                   class="inline">
            <li
               v-for="(item,index) in itemData"
               :data-param="index"
               v-if="item.thumb||item.path"
               :key="`${index}${item.path}`"
               v-menu-context="editAble?menu_context(item):''"
                :class='["mr-sm","allli"]'>
                <img :src="url_join(item.path)"
                     height="100%"
                     width="100%"
                     @click="showBig?blow_up(item,item.is_default,index):'javascript';">
                <div v-if="item.is_default===1" class="mian-pic" title="主图"></div>
                <div v-if="item.is_default===2" class="detail-pic" title="详情图"></div>
                <div v-if="item.is_default===4" class="size-pic" title="附属图"></div>
                <!--<div class="tool" v-if="editAble"> SPU图hover显示隐藏图片底部灰色部分 -->
                <div class="tool">
                    <span class="btn-img el-icon-delete" v-if="editAble" @click="remove(item)"></span>
                    <span class="btn-img el-icon-edit" v-if="editAble" @click="change_image(item)"></span>
                    <span v-if="showBig" class="btn-img el-icon-search" @click="blow_up(item,index)" ></span>
                </div>
            </li>
        </drag-drop>
        <blowup-image v-model="imgDialog"
                      :img-path="imgPath"
                      :base-url="baseUrl"
                      :imgArr="cloneItemData"
                      :title="imgTitle"></blowup-image>
        <input type="file" ref="inputChange" hidden @change="mdf_change" :multiple="false">
    </div>
</template>
<style lang="stylus">
    .c-product-details-group{
        display: inline;
        word-wrap:break-word;
        .allli{
            height:100px;
            width:100px;
            display: inline-block;
            position:relative;
            border: 1px solid #CFCFCF;
            transition:all .3s ease;
            margin-top:15px;
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
    .mian-pic,.detail-pic,.size-pic{
        position: absolute;
        top: -15px;
        right: -9px;
        width:25px;
        height:25px;
    }
    .mian-pic{
        background: url(../assets/main.png) no-repeat center center;
        background-size:contain;
    }
    .detail-pic{
        background: url(../assets/detail.png) no-repeat center center;
        background-size:contain;
    }
    .size-pic{
        background: url(../assets/size.png) no-repeat center center;
        background-size:contain;
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
                curItem:{},
                cloneItemData:[]
            }
        },
        mounted(){
            this.cloneItemData = clone(this.itemData);
            this.cloneItemData.forEach(row=>{
                row.path = this.url_join(row.path,'_500x500.');
            });
        },
        methods:{
            url_join(path = '', size='_100x100.'){
                let isBlob = path.includes('blob:');
                if(isBlob) return path;
                let bl = path.includes('http');
                let index = path.lastIndexOf('.');
                let arr = [...path];
                arr.splice(index,1, size);
                let str = arr.join('');
                return bl?str:this.baseUrl+str;
            },
            move_drap(val,val2){
                this.$emit('move-drap',val);
            },
            menu_context(item,index){
                let curList = [];
                const detail_pic =  [{label:"设为详情图",action:function(){
                    this.establish_detail_pic(item,index);
                }}];
                const size_pic =  [{label:"设为附属图",action:function(){
                    this.establish_size_pic(item,index);
                }}];
                const mian_pic =  [{label:"设为主图",action:function(){
                    this.establish_main_pic(item,index);
                }}];
                switch(item.is_default){
                    case 1:
                        curList = [...detail_pic,...size_pic];
                        break;
                    case 2:
                        curList = [...mian_pic,...size_pic];
                        break;
                    case 4:
                        curList = [...mian_pic,...detail_pic];
                        break;
                }
                return curList;
            },
            establish_detail_pic(item){
                item.is_default = 2;
                this.$emit('establish-pic',item);
            },
            establish_main_pic(item){
                item.is_default = 1;
                this.$emit('establish-pic',item);
            },
            establish_size_pic(item,index){
                item.is_default = 4;
                this.$emit('establish-pic',item);
            },
            remove(item){
                this.$emit("remove",item)
            },
            change_image(item){
                this.curItem = item;
                this.$refs.inputChange.click();
            },
            mdf_change(ev){
                const files = ev.target.files;
                if (!files) {
                    return;
                }
                let fileArr = Array.prototype.slice.call(files);
                fileArr.forEach((file,index)=>{
                    let  reader = new FileReader();
                    reader.readAsDataURL(file) ;
                    reader.onload =(e)=> {
                        let imgs = e.target.result;
                        let path = URL.createObjectURL(file);
                        this.curItem.path = path;
                        this.curItem.thumb = path;
                        console.log(path,'path');
                        this.$set(this.curItem,'img',imgs);
                    }
                });
            },
            blow_up(item,is_default,index){

                this.imgDialog = true;
                this.imgPath = this.url_join(item.path,'_500x500.');
                console.log('this.imgPath',this.imgPath);
                switch(is_default){
                    case 1:
                        this.imgTitle = `主图：图${index+1}`;
                        break;
                    case 2:
                        this.imgTitle = `详情图：图${index+1}`;
                        break;
                    case 4:
                        this.imgTitle = `附属图：图${index+1}`;
                        break;
                }
            },
        },
        watch:{
            itemData(val){
                console.log(val,'itemData');
            },
        },
        props:{
            editAble:{
                default(){
                    return true;
                },
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
            itemData:{
                required:true,
            },
            curDefault:{
                required:true,
                type:Number,
            },
            multiple:{
                default(){
                    return true;
                }
            },
            character:{
                required:true,
                type:String,
            },
            baseUrl:{
                required:true,
                type:String,
            },
        },
        components: {
            dragDrop:require("../components/drag-drop").default,
            blowupImage:require("../components/blowup-image.vue").default,
        }
    }
</script>
