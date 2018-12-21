<template>
    <div class="select-img">
        <page-dialog :title="title" v-model="visible" @open="open" @close="close" size="large" :close-on-click-modal="false">
            <el-radio-group v-model="curRadio"
                            @change="change_radio"
                            class="mb-xs"
                            fill="#20a0ff"
                            text-color="#fff">
                <el-radio-button :label="1">本地图库</el-radio-button>
                <el-radio-button :label="0">自定义图库</el-radio-button>
            </el-radio-group>
            <el-card>
                <div>
                    <label-buttons class="inline"
                                   v-if="curRadio"
                                   :buttons="channes"
                                   @select="select_channel"
                                   label="所属平台："
                                   :max="40"
                                   :labelWidth="60"></label-buttons>
                    <div class="inline" v-if="!curRadio&&!showLocalBtn">
                        <el-button type="primary"
                                   size="mini"
                                   @click.native="add_local">添加电脑图片
                        </el-button>
                        <el-button  @click.native="add_network" type="primary" size="mini">添加网络图片</el-button>
                    </div>
                    <!--按照SKU筛选-->
                    <label-item label="SKU：" class="ml-lg">
                        <el-select v-model="sku_id"
                                   @change="select_sku"
                                   filterable clearable>
                            <el-option
                                v-for="(res,index) in skuList"
                                :label="res"
                                :value="res"
                                :key="index"
                            ></el-option>
                        </el-select>
                    </label-item>
                    <el-checkbox-group class="inline fr" v-model="checkList" @change="change_txt">
                        <el-checkbox class="mian-pic-p selelct-img" :label="1">主图</el-checkbox>
                        <el-checkbox class="detail-pic-p selelct-img" :label="2">细节图</el-checkbox>
                        <el-checkbox class="size-pic-p selelct-img" :label="4">附属图</el-checkbox>
                    </el-checkbox-group>
                </div>
            </el-card>
            <drag-drop tag="ul" v-model="showImg">
                <li class="img-item"
                    v-for="(item, index) in showImg"
                    :key="index"
                    v-if="item.path||item.thumb"
                    @click="select_img(index)">
                    <el-checkbox class="checkbox" v-model="item.checked"></el-checkbox>
                    <img v-lazy="url_join(item.path)" :key="index"
                         width="100%"
                         height="100px"
                         :title="item.alt+item.is_default">
                    <div class="skuTitle">{{item.alt|filterTitle}}</div>
                    <div v-if="item.is_default===1" class="mian-pic" title="主图"></div>
                    <div v-if="item.is_default===2" class="detail-pic" title="详情图"></div>
                    <div v-if="item.is_default===4" class="size-pic" title="附属图"></div>
                    <div class="tool">
                        <i class="btn el-icon-search" @click.stop="search_img(item.path)"></i>
                    </div>
                </li>
            </drag-drop>
            <div class="inline mt-sm">
                <span>已勾选(
                    <span class="bold-font red">{{count}}</span>
                    <span class="bold-font">/{{showImg.length}}</span>)
                张</span>
                <el-checkbox v-model="isShowChecked" @change="showChecked">只显示已勾选</el-checkbox>
                <el-button @click="selectAll" size="mini" type="primary" :disabled="editImg">{{isSelectAll ? '全不选' : '全选'}}</el-button>
                <el-button @click="random" size="mini" type="primary">随机排序</el-button>
                <el-button v-if="curRadio&&showLocalBtn" @click="add_local" size="mini" type="primary">添加本地图片</el-button>
            </div>
            <div slot="footer">
                <el-button size="mini" type="primary" @click="add">确定</el-button>
                <el-button size="mini" @click="cancel">取消</el-button>
            </div>
            <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
            <input type="file" ref="input" hidden @change="handleChange" :multiple="true" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg">
            <add-network-imgs v-model="addVisible" @add-url="add_url"></add-network-imgs>
        </page-dialog>
    </div>
</template>

<style lang="stylus" type="text/stylus" scoped>
    .select-img {
        .img-item {
            display: inline-block;
            width: 100px;
            height: 115px;
            border: 1px solid #ddd;
            /*overflow: hidden;*/
            position: relative;
            margin: 15px 5px 5px;
            vertical-align: middle
            img {
                vertical-align: middle;
                width: 100%;
            }
            .skuTitle{
                box-sizing:border-box;
                border-top:1px dotted #ddd;
                position: absolute;
                left:0;
                bottom:0;
                height:15px;
                line-height:14px;
                width:100%;
                text-align:center;
            }
            .checkbox {
                position: absolute;
                top: 0;
                right: 0;
            }
            .is-master-map {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 30%;
                background-color: rgba(255, 15, 7, 0.8);
                text-align: center;
                color: #fff;
            }
        }
        .img-item:hover {
            .tool {
                display: block;
            }
        }
        .mian-pic, .detail-pic, .size-pic {
            position: absolute;
            top: -15px;
            right: -9px;
            width: 25px;
            height: 25px;
        }
        .mian-pic {
            background: url(../assets/main.png) no-repeat center center;
            background-size: contain;
        }
        .detail-pic {
            background: url(../assets/detail.png) no-repeat center center;
            background-size: contain;
        }
        .size-pic {
            background: url(../assets/size.png) no-repeat center center;
            background-size: contain;
        }
        .selelct-img {
            padding-right: 30px;
        }
        .mian-pic-p {
            background: url(../assets/main.png) no-repeat right center;
            background-size: contain;
        }
        .detail-pic-p {
            background: url(../assets/detail.png) no-repeat right center;
            background-size: contain;
        }
        .size-pic-p {
            background: url(../assets/size.png) no-repeat right center;
            background-size: contain;
        }
        .tool {
            position: absolute;
            bottom: 15px;
            left: 0;
            width: 100%;
            height: 30%;
            background-color: rgba(0, 0, 0, 0.6);
            text-align: center;
            display: none;
            .btn {
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
            .btn .i {
                color: #fff;
                display: block;
                font-size: 25px;
                line-height: inherit;
                margin: 0 auto 5px;
            }
            .btn:hover {
                transform: translateY(-2px);
            }
        }
    }
</style>
<script>
    import {api_git_img,api_get_thumb,api_get_self_image} from '../api/amazon-publish';
    import {api_ali_listing_img_self_up} from "../api/publish-smt";
    export default {
        data() {
            return {
//                id:132027,
                sku_id:'',
                addVisible:false,
                imgUrl:"",
                webUrl:false,
                curRadio: 1,
                visible: false,
                isShowChecked: false,
                isShowCheckedArr: [],
                localImage:[],
                customImage:[],
                isSelectAll: false,
                channel_id: 0,
                is_default: '',
                imageAll: [],
                filterImg: [],
                showImg: [],
                checkList: [1, 2, 4],
                channes: [
                    {
                        name: '全部',
                        value: 0
                    },
                    {
                        name: 'ebay',
                        value: 1
                    },
                    {
                        name: 'wish',
                        value: 2
                    },
                    {
                        name: '速卖通',
                        value: 3
                    },
                    {
                        name: '亚马逊',
                        value: 4
                    },

                ],
                imgPath: '',
                imgDialog: false,
                baseUrl: ''
            }
        },
        filters:{
            filterTitle(val){
                if(!val)return;
                let list = val.split('-');
                return list[0]?list[0].replace('.jpg',''):'';
            }
        },
        methods: {
            open(){
                this.init();
                this.random();
//                this.init_other();
            },
            close(){
                this.isSelectAll = '';
            },
            change_radio(val){
                let curImage = val?this.localImage:this.customImage;
                this.showImg = this.img_sort(curImage);
                this.change_txt(this.checkList);
            },
            handleClick(val) {
                console.log(val.name);
            },
            url_join(path = '', size = '_200x200.') {
                let isBlob = path.includes('blob:');
                if (isBlob) return path;
                let bl = path.includes('http');
                let index = path.lastIndexOf('.');
                let arr = [...path];
                arr.splice(index, 1, size);
                let str = arr.join('');
                return bl ? str : this.baseUrl + str;
            },
            add_local() {
                this.$refs.input.click();
            },
            add_network(){
                this.addVisible = true;
            },
            add_url(val){
                let cur = window.clone(val).map(row=>{
                    return {
                        url:row
                    }
                });
                this.callback(cur);
                this.$emit('add-url',val);
                this.visible = false;
            },
            callback(imgs){
                let id = this.id instanceof Array?this.id[0]:this.id;
                let params = {
                    goods_id:id,
                    images:imgs,
                    channel_id:this.channelId,
                    channel_sku:this.spu,
                    account_id:this.account
                };
                if(this.limitImg&&this.imgCount===this.limitCount){
                    this.$message({type:'warning',message:`最多只能上传${this.limitCount}张图片！`});
                    return
                }
                this.$http(api_ali_listing_img_self_up,params).then(res=>{
                    this.$message({type: "success", message: res.message || res});
                    if(!res.path)return this.$message({type:"warning",message:"path为空"});
                    this.$emit('call-back',res);
                }).catch(code=>{
                    this.$message({type: "error", message: code.message || code})
                });
            },
            handleChange(ev) {
                const files = ev.target.files;
                if (!files) {
                    return;
                }
                let images = [];
                let timer = null;
                let fileArr = Array.prototype.slice.call(files);
                fileArr.forEach((file, index) => {
                    file.uid = Date.now() + this.tempIndex++;
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = (e) => {
                        let imgs = e.target.result;
                        let path = URL.createObjectURL(file);
                        let i = {
                            name:file.name,
                            image:imgs
                        };
                        images.push(i);
                        this.visible = false;
                        if(this.curRadio===1){
                            this.$emit('handleChange', imgs, path);
                        }
                    };
                });
                if(this.curRadio===0){
                    timer=setInterval(()=>{
                        if( fileArr.length===images.length){
                            this.callback(images);
                            clearInterval(timer)
                        }
                    },100);
                }
            },
            search_img(image) {
                this.imgPath = this.url_join(image, '_500x500.');
                this.imgDialog = true;
            },
            showChecked(val) {
                if (this.isShowChecked) {
                    this.isShowCheckedArr = window.clone(this.showImg);
                    this.showImg = this.isShowCheckedArr.filter(item => {
                        return item.checked
                    })
                } else {
                    this.showImg = this.isShowCheckedArr;
                }
            },
            selectAll() {
                this.isSelectAll = !this.isSelectAll;
                this.showImg.forEach(item => {
                    item.checked = this.isSelectAll;
                })
            },
            add() {
                let arr = this.showImg.filter((item) => {
                    return item.checked;
                });
                this.$emit('add', arr);
                this.visible = false;
            },
            cancel() {
                this.visible = false;
            },
            init() {
                if(this.isKandeng){//刊登平台使用
                    let params = {
                        goods_id:this.id
                    };
                    this.$http(api_get_thumb,params).then(res => {
                        if(res.length>0){
                            this.init_kandeng_data(res);
                        }else{
                            console.log('无图片数据');
                        }
                    })
                }else{
                    this.$http(api_git_img, this.id).then(res => {
                        this.init_data(res);
                    })
                }
            },
            init_other(){
                let params = {
                    goods_id:this.id
                };
                this.$http(api_get_self_image,params).then(res=>{
//                    console.log(res,'res');
                }).catch(code=>{
//                    console.log(code,'code');
                })
            },
            init_data(res){
                let arr = [];
                res.forEach(item => {
                    item.images.forEach(it=>{
                        this.$set(it,"base_url",item.baseUrl);
                    });
                    arr = [...arr, ...item.images];
                    this.baseUrl = item.baseUrl;
                });
                arr.forEach(res => {
                    this.$set(res, 'checked', false);
                });
                this.imageAll = arr;
                // console.log('this.imageAll',this.imageAll);
                this.localImage = this.imageAll.filter(row=>row.channel_id!==0);
                this.customImage = this.imageAll.filter(row=>row.channel_id===0);
                let curImage = this.curRadio?this.localImage:this.customImage;
                this.showImg = this.img_sort(curImage);
                this.sku_id = this.curSku;
                this.select_sku();
            },
            init_kandeng_data(arr){
                arr.forEach(res => {
                    this.$set(res, 'checked', false);
                });
                this.baseUrl = arr[0].baseUrl;
                this.imageAll = arr;
                this.localImage = this.imageAll.filter(row=>row.channel_id!==0);
                this.customImage = this.imageAll.filter(row=>row.channel_id===0);
                let curImage = this.curRadio?this.localImage:this.customImage;
                this.showImg = this.img_sort(curImage);
            },
            select_img(index) {
                if(this.editImg){
                    let isTrue = this.showImg[index].checked;
                    if(isTrue){
                        this.showImg[index].checked = false
                    }else {
                        let find = null;
                        while (find !== -1){
                            find = this.showImg.findIndex(item=>{
                                return item.checked;
                            });
                            if(find !== -1){
                                this.showImg[find].checked = false;
                            }
                        }
                        this.showImg[index].checked = true;
                    }
                }else {
                    this.showImg[index].checked = !this.showImg[index].checked;
                }
            },
            arr_random(arr = []) {
                arr.sort(function () {
                    return Math.random() - 0.5;
                });
                console.log(arr,'arr');
                return this.img_sort(arr);
            },
            random() {
                this.showImg = this.arr_random(this.showImg);
            },
            change_txt(section) {
                let curImage = this.curRadio?this.localImage:this.customImage;
                this.filterImg = window.clone(curImage);
                this.txt_filter(section);
                if(this.curRadio){this.channel_filter(this.channel_id);}
                this.filter_sku();//过滤SKU
                this.showImg = this.img_sort(this.filterImg);
            },
            select_channel(index) {
                this.filterImg = window.clone(this.localImage);
                this.channel_filter(index);//过滤平台
                this.txt_filter(this.checkList);//过滤图片类型
                this.filter_sku();//过滤SKU
                this.showImg = this.img_sort(this.filterImg);
            },
            select_sku(val){
                let curImage = this.curRadio?this.localImage:this.customImage;
                this.filterImg = clone(curImage);
                if(this.curRadio){this.channel_filter(this.channel_id);}//过滤平台
                this.txt_filter(this.checkList);//过滤图片类型
                this.filter_sku();//过滤SKU
                this.showImg = this.img_sort(this.filterImg);
            },
            filter_sku(){
                let list = this.filterImg.filter(row=>row.sku===this.sku_id);


                this.filterImg = !this.sku_id?this.filterImg:this.filterImg.filter(row=>row.sku===this.sku_id);
            },
            img_sort(imgArr) {
                //is_default < is_default
                return imgArr.sort(function(img1, img2){
                    return img1.is_default||5 - img2.is_default||5;
                });
            },

            channel_filter(index) {
                this.channel_id = index;
                if (index === 0) {

                } else {
                    this.filterImg = this.filter(this.filterImg, (item) => {
                        return index === item.channel_id;
                    });
                }
            },
            txt_filter(section) {
                let arr = [];
                section.forEach(item => {
                    let result = this.filter(this.filterImg, (row) => {
                        return item === row.is_default;
                    });
                    arr = [...arr, ...result];
                });
                this.filterImg = arr;
            },
            filter(arr = [], callback) {
                return arr.filter(callback)
            }
        },
        computed: {
            count() {
                let i = 0;
                this.showImg.forEach(item => {
                    if (item.checked) {
                        i++;
                    }
                });
                return i;
            },
            skuList(){
                let curImage = this.curRadio?this.localImage:this.customImage;
                let list = curImage.filter(row=>!!row.sku).map(row=>{
                    return row.sku
                });
                return [...new Set(list)];
            },
        },
        watch: {
            value(val) {
                this.visible = val;
            },
            visible(val) {
                this.$emit('input', val)
            }
        },
        props: {
            value: {},
            curSku:{//非必填，用于初始化 根据sku过滤图片 的操作；
                type:String,
            },
            isKandeng:{
                type:Boolean,
                default(){
                    return false;
                }
            },
            id: {
                required: true,
                type: [Number, String,Array]
            },
            showLocalBtn: {
                type: Boolean,
                default() {
                    return false
                }
            },
            title: {
                type: String,
                default() {
                    return '添加图片'
                }
            },
            editImg: {

            },
            channelId:{//平台id
                default(){
                    return "";
                }
            },
            spu:{
                default(){
                    return "";
                }
            },
            account:{
                default(){
                    return "";
                }
            },
            //已添加数量
            imgCount:{
                type:Number,
                default(){
                    return 0
                }
            },
            //是否限制上传图片数量
            limitImg:{
                default(){
                    return false
                }
            },
            //限制上传图片的数量，
            limitCount:{
                type:Number,
                default(){
                    return 60
                }
            }

        },
        components: {
            dragDrop: require('./drag-drop').default,
            pageDialog: require('./page-dialog.vue').default,
            labelButtons: require('./label-buttons.vue').default,
            blowupImage: require("./blowup-image.vue").default,
            addNetworkImgs:require('./add-network-imgs.vue').default,
            labelItem:require('./label-item.vue').default,
        },
    }
</script>

