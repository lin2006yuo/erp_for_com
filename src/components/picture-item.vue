<template>
    <div class="c-picture-group">
        <div class="picture-group-content" ref="groupContent">
            <div>
                <label class="mr-lg">SPU图</label>
                <span class="mr-sm operate"
                      v-if="editAble"
                      v-for="item in handleList"
                      @click="click_handle(item,imgData.spuImg.images)"
                      :key="item.value">{{item.label}}</span>
            </div>
            <picture-detail
                    :edit-able="editAble"
                    ref="spuPictureDetail"
                    :base-url="baseUrl"
                    v-if='imgData.spuImg.images'
                    :imgs="imgData.spuImg.images"></picture-detail>
            <template v-if="!!imgData.skuImg" v-for="(item,index) in imgData.skuImg">
                    <span class="content-label">
                        <label>SKU:{{item.name}}</label>
                        <span class="mr-sm operate"
                              v-if="editAble"
                              v-for="it in handleList"
                              @click="click_handle(it,item.images,index)"
                              :key="it.value">{{it.label}}</span>
                    </span>
                <picture-detail ref="skuPictureDetail"
                                :edit-able="editAble"
                                :base-url="baseUrl"
                                :imgs="item.images"></picture-detail>
            </template>
            <div v-if="showBtn">
                <div v-if="editAble">
                    <el-button type="primary"
                               size="mini"
                               class="inline mt-sm"
                               @click.native="save">确定</el-button>
                    <el-button size="mini"
                               class="inline mt-sm"
                               @click.native="cancel">取消</el-button>
                </div>
                <el-button type="primary"
                           v-else
                           size="mini"
                           @click.native="edit"
                           class="inline">编辑</el-button>
            </div>

        </div>
        <select-img :id="goodsId"
                    :show-local-btn="true"
                    @handleChange="add_local_img"
                    @add="add_online_img"
                    v-model="selectImgDialog"></select-img>
    </div>
</template>
<style lang="stylus">
    .c-picture-group{
        margin:5px;
        .picture-group-title{
            padding-left:8px;
            box-sizing:border-box;
            display:inline-block;
            width:100%;
            height:35px;
            border-radius:4px;
            font-size:1.4rem;
            font-weight:bold;
            line-height:35px;
            box-shadow:0 2px 10px #ddd;
            transition:all .2s;
            &:hover{
                box-shadow:0 2px 10px #aaa;
            }
        }
        .display-none{
            display:none;
        }
        .picture-group-content{
            box-sizing:border-box;
            padding-left:20px;
            transition:all .2s;
            .content-label{
                display:inline-block;
                padding-top:10px;
            }
        }
    }

</style>
<script>

    export default {
        data() {
            return {
                curValue:"",
                curList:[],
                curId:-1,
                selectImgDialog:false,
                handleList:[
                    {label:"添加主图",value:1,action:function(Array,index){
                        this.spu_sku_handle(1,Array);
                    }},
                    {label:"添加详情图",value:2,action:function(Array,index){
                        this.spu_sku_handle(2,Array);
                    }},
                    {label:"添加附属图",value:4,action:function(Array,index){
                        this.spu_sku_handle(4,Array);
                    }},
                ],
            }
        },
        methods:{
            save(){
                let data = [];
                let data2 = [];
                this.$refs.spuPictureDetail.list&&this.$refs.spuPictureDetail.list.forEach(row=>{
                    row.data.forEach(res=>{
                        data.push(res);
                    })
                });
                console.log(data,'data');
                this.$refs.skuPictureDetail&&this.$refs.skuPictureDetail.forEach(row=>{
                    row.list.forEach(res=>{
                        res.data.forEach(it=>{
                            data2.push(it);
                        })
                    });
                });
                console.log(data2,'data2');
                let allData = [...data,...data2];
                allData.forEach((row,index)=>{
                    row.id = typeof row.id==='string'?0:row.id;
                    row.sort = index;
                });
                allData =  allData.map(row=>{
                    let cur = {
                        id:row.id,
                        sort:row.sort,
                        sku_id:row.sku_id,
                        goods_id:this.goodsId,
                        is_default:row.is_default,
                        channel_id:this.channelId,
                    };
                    if(row.hasOwnProperty('img'))cur.image = row.img;
                    return cur;
                }).filter(row=>!!row.id||!!row.image);
                this.$emit("save",allData,this.channelId);
            },
            cancel(){
                this.$emit('cancel-edit',this.channelId);
            },
            edit(){
                this.$emit('edit',this.channelId);
            },
            spu_sku_handle(value,Array,index){
                this.curValue = value;
                this.curList = Array;
                this.selectImgDialog = true;
            },
            click_handle(item,Array,i){
                this.curId = i===undefined?this.curId:i;
                item.action.call(this,Array);
            },
            add_local_img(imgs,path){
                this.insert_picture(imgs,path);
            },
            insert_picture(imgs,path){
                let params = {};
                if(this.curList.length>0){
                    params.id = 'add'+new Date().getTime();
                    params.sku_id = this.curList[0].sku_id;
                    params.sort = this.curList[0].sort;
                    params.is_default = this.curValue;
                    params.img =imgs;
                    params.path = path;
                }
                this.curList.push(params);
                this.get_detail_init();
            },
            add_online_img(img){
                if(this.curList.length>0){
                    img.forEach(row=>{
                        let params = {
                            id:row.id,
                            channel_id:row.channel_id,
                            goods_id:row.goods_id,
                            is_default:this.curValue,
                            path:row.path,
                        };
                        this.curList.push(params);
                    });
                }
                this.get_detail_init();
            },
            get_detail_init(){
                if(this.curId===-1){
                    this.$refs.spuPictureDetail.get_data();
                }else{
                    this.$refs.skuPictureDetail[this.curId].get_data();
                }
            },
        },
        props:{
            baseUrl:{
                require:true,
                type:String
            },
            imgData:{
                require:true,
            },
            multiple:{
                type:Boolean,
                default(){
                    return true;
                },
            },
            showBtn:{
                type:Boolean,
                default(){
                    return true;
                },
            },
            editAble:{
                type:Boolean,
                default(){
                    return true;
                },
            },
            channelId:{
                required:true,
            },
            goodsId:{
                required:true,
            },
        },
        components: {
            pictureDetail:require('../components/picture-detail.vue').default,
            selectImg:require('./select-img.vue').default,
        }
    }
</script>
