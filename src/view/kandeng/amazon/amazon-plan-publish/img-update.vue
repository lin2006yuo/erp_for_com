<template>
    <div>
        <div class="p-images-box">
            <drag-drop v-model="images" tag="ul" v-if="thumbnailMode" class="image-thums im">
                <li class="image border-n"
                    :style="imageStyle"
                    v-for="(image,index) in images"
                    :key="index"
                    @click="click_img(index)"
                    @mouseover="over(image)" @mouseout="out(image)" >
                    <img :src="image.path" >
                    <div class="tool">
                        <span class="btn">
                             <i class="el-icon-delete" @click.stop="remove(image)"></i>
                        </span>
                        <span class="btn">
                            <i class="el-icon-edit" @click.stop="mdf_img(image)"></i>
                        </span>
                        <span class="btn">
                            <i class="el-icon-search" @click.stop="search_img(image)"></i>
                        </span>
                    </div>
                    <div class="isMasterMap" v-if="index===0">
                        <span>主图</span>
                    </div>
                    <el-checkbox v-show="image.checked" :value="image.checked" class="checkbox"></el-checkbox>
                </li>
                <li class="image add-button" :style="imageStyle" @click="$refs.input.click();" v-if="!isShowAdd">
                    <i class="el-icon-plus"></i>
                    <span class="addImg"> 添加图片</span>
                </li>
            </drag-drop>
        </div>
        <input type="file" ref="inputTwo" hidden @change="mdf_change" :multiple="false" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg">
        <input type="file" ref="input" hidden @change="handleChange" :multiple="multiple" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg">
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
    </div>
</template>
<style lang="stylus" scoped>

    .checkbox{
        position: absolute;
        top: 0;
        right: 0;
    }
    .isMasterMap{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 30%;
        background-color: rgba(255, 15, 7, 0.8);
        text-align: center;
        span{
            color:#fff;
        }
    }
    .p-images-box{
        overflow: hidden;
    .uploadall{
        position: absolute;
        left:0;
        bottom:0;
        right:0;
        height:32px;
        line-height:32px;
    &:hover{
         background-color: rgba(0, 0, 0, 0.72);
         color: #fff;
     }
    }
    position: relative;
    .image-thums.im{
        border:none;
        display: inline-block;
    }
    .image:hover{
    .tool{
        display: block;
    }
    }
    .image{
        vertical-align: middle;
        /*margin:5px;*/
        display: inline-block;
        position: relative;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    img{
        width:100%;
        height:100%;
    }
    .tool{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 30%;
        background-color: rgba(0, 0, 0, 0.6);
        text-align: center;
        display:none;
    .btn{
        display: inline-block;
        color: #fff;
        font-size: 1.2rem;
        cursor: pointer;
        vertical-align: middle;
        transition: transform 300ms cubic-bezier(0.23, 1, 0.32, 1) 100ms, opacity 300ms cubic-bezier(0.23, 1, 0.32, 1) 100ms;
        margin-top: 1%;
        width: 10px;
        border: 0;
    }
    .btn .i{
        color: #fff;
        display: block;
        font-size: 25px;
        line-height: inherit;
        margin: 0 auto 5px;
    }
    .btn:hover{
        transform: translateY(-2px);
    }
    .image-status{
        border-radius: 50%;
        border:2px solid gainsboro;
        color: #fff;
        position: absolute;
        right: 0;
        top:0;
        padding: 2px;
    }
    }
    }
    .border-n{
        border: none;
        margin: 0 5px 5px 0;
    }
    .add-button{
        /*position: absolute;*/
        top:0;
        right:0;
        margin: 0;
        /*width:100%;*/
        height:100%;
        display: inline-block;
        text-align: center;
        cursor: pointer;
    &:hover{
         background-color: rgba(42,73,52,0.2);
     }
    &:active{
         background-color: rgba(42,73,52,0.35);
     }
    &::after{
         vertical-align: middle;
         content: '';
         width:0;
         height:0;
         display: inline-block;
     }
    i{
        margin-top: 35%;
        font-size: 1rem;
        font-weight: 600;
    }
    .addImg{
        display: block;
        font-size: 1.5rem;
        font-weight: 600;
    }
    }
    }

</style>
<script>
    export default {
        data(){
            return {
                tempIndex:0,
                mdfIndex:0,
                imgDialog: false,
                imgPath:'',
            }
        },
        methods:{
            test(){
                console.log("test", this.images);
            },
            click_img(index){
                if(index === 0){return}

                let isTrue = this.images[index].checked;
                if(isTrue){
                    this.images[index].checked = false
                }else {
                    let find = null;
                    while (find !== -1){
                        find = this.images.findIndex(item=>{
                            return item.checked;
                        });
                        if(find !== -1){
                            this.images[find].checked = false;
                        }
                        console.log("test", find);
                    }
                    this.images[index].checked = true;
                }
            },
            search_img(image){
                this.imgPath = image.path;
                this.imgDialog = true;
            },
            upload(){
                this.images.forEach(image=>this.upimage(image));
            },
            upimage(image){
            },
            remove(image){
                let index = this.images.findIndex(row=>row.uid === image.uid);
                this.images.splice(index, 1);
            },
            mdf_img(image){
                let index = this.images.findIndex(row=>row.uid === image.uid);
                this.mdfIndex=index;
                this.$refs.inputTwo.click();
            },
            mdf_change(ev){
                const files = ev.target.files;
                if (!files) {
                    return;
                }
                let fileArr = Array.prototype.slice.call(files);
                fileArr.forEach((file,index)=>{
                    file.uid = Date.now() + this.mdfIndex;
                    let  reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload =(e)=> {
                        let  imgs = e.target.result;
                        let parm = {
                            uid:file.uid,
                            name:file.name,
                            size:file.size,
                            image: imgs,
                            show:false,
                            checked: false
                        };
                        if (this.thumbnailMode) {
                            try {
                                parm.path = URL.createObjectURL(file);
                            } catch (err) {
                                console.error(err);
                                return;
                            }
                        }
                        this.images.splice(this.mdfIndex,1,parm);
                    }
                });
            },
            handleChange(ev){
                const files = ev.target.files;
                if (!files) {
                    return;
                }
                let fileArr = Array.prototype.slice.call(files);
                fileArr.forEach((file,index)=>{
                    file.uid = Date.now() + this.tempIndex++;
                    let  reader = new FileReader();
                    reader.readAsDataURL(file) ;
                    reader.onload =(e)=> {
                        let  imgs = e.target.result;
                        let parm = {
                            uid:file.uid,
                            name:file.name,
                            size:file.size,
                            image: imgs,
                            show:false,
                            checked: false
                        };
                        if (this.thumbnailMode) {
                            try {
                                parm.path = URL.createObjectURL(file);
                            } catch (err) {
                                console.error(err);
                                return;
                            }
                        }
                        this.images.push(parm);
                    }
                });

            },
            out(image){
                if(!this.edit){
                    image.timer = setTimeout(()=>{
                        image.show=false;
                    },300);
                }
            },
            over(image){
                if(!this.edit){
                    clearTimeout(image.timer);
                    image.show=true
                }
            }
        },
        computed:{
            imageStyle(){
                return {
                    width: this.image.width || 'auto',
                    height: this.image.height || 'auto',
                }
            },
            isShowAdd(){
                return this.images.length>=9;
            },
            images:{
                get(){
                    return this.init || [];
                },
                set(val){
                    console.log("test", val);
                    if(val.length>9){
                        val.splice(9, val.length-9);
                    }
                }
            }
        },
        props:{
            init:{},
            thumbnailMode:{
                type:Boolean,
                default(){
                    return true;
                }
            },
            image:{
                type:Object,
                default(){
                    return {
                        width:'100px',height:'100px'
                    };
                }
            },
            multiple:{
                type:Boolean,
                default(){
                    return true;
                }
            },
            edit:{
                type:Boolean,
                default(){
                    return false;
                }
            }
        },
        components:{
            dragDrop:require('../../../../components/drag-drop').default,
            blowupImage:require("../../../../components/blowup-image.vue").default,
        }
    }
</script>
