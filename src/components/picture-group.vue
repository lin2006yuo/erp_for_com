<template>
    <div class="c-picture-group">
        <div class="mb-sm" v-if="status!==3">
            <label class="inline">抓取图片地址：</label>
            <el-input class="inline"
                      :disabled="!channelValue"
                      style="width:60%"
                      v-model="comPath" placeholder="请输入地址"></el-input>
            <request-button  size="mini"
                        type="primary"
                        class="inline ml-sm"
                        :request="down_img">自动抓取图片</request-button>
        </div>
        <el-tabs :active-name="activeName"
                 type="border-card"
                 @tab-click="handleClick">
            <el-tab-pane
                    v-for="(item,index) in list"
                    :key="item.id"
                    :label="item.name"
                    :name="item.name">
                <picture-item
                        :edit-able="item.isEdit"
                        :baseUrl="baseUrl"
                        :channel-id="item.id"
                        :goods-id="goodsId"
                        :img-data="item.data"
                        @save="save"
                        @edit="edit"
                        @cancel-edit="cancelEdit"
                        v-if="item.id!==0&&item.show"></picture-item>
                <custom-image v-if="item.id===0"
                              :edit-able="item.isEdit"
                              :base-url="baseUrl"
                              :goods-id="goodsId"
                              :channel-id="item.id"
                              @save="save"
                              @cancel-edit="cancelEdit"
                              @edit="edit"
                              :imgs="item.data"></custom-image>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_server_img,api_server_path} from '../api/product-library';
    export default {
        data() {
            return {
                path:"",
                comPath:"",
                status:"",
                list:[],
                channelValue:"",
//                 $targetDirs = ['eBay' => 1, 'Amazon' => 2, 'Wish' => 3, 'AliExpress' => 4];
                channel:[
                    {id:1,name:"ebay平台",value:'eBay'},
                    {id:2,name:"亚马逊平台",value:'Amazon'},
                    {id:3,name:"wish平台",value:"Wish"},
                    {id:4,name:"速卖通平台",value:"AliExpress"},
                    {id:0,name:'自定义图片',value:""}
                ]
            }
        },
        created(){
            this.get_path();
        },
        watch:{
            activeName(val){
                console.log(val,'val');
            }
        },
        methods:{
            edit(val){
                let find = this.list.find(row=>row.id===val);
                if(!!find)this.$set(find,'isEdit',true);
            },
            cancelEdit(val){
                let find = this.list.find(row=>row.id===val);
                if(!!find)this.$set(find,'isEdit',false);
            },
            down_img(){
                return this.$http(api_server_img,{goods_id:this.goodsId,path:this.comPath}).then(res=>{
                    this.$message({type: "success", message: res.message || res})
                }).catch(code=>{
                    this.$message({type: "error", message: code.message || code})
                });
                return Promise.resolve();
            },
            get_path(){
                this.$http(api_server_path,{id:this.goodsId}).then(res=>{
                    this.status=res.status;
                    this.path=res.path||'';
                    console.log(this.path,'this.path=res.path');
                    this.get_cur_path();
                }).catch(code=>{
                    this.$message({type: "error", message: code.message || code})
                })
            },
            save(data,val){
                let find = this.list.find(row=>row.id===val);
                if(!!find)this.$set(find,'isEdit',false);
                this.$emit('save',data,val);
            },
            handleClick(val){
                let cur = this.channel.find(row=>row.name===val.name);
                if(!!cur) this.channelValue = cur.value;
                this.get_cur_path();
            },
            get_cur_path(){
                /*isTrue 为true则不需要再进行拼接
                * */
                let list = ['\\Wish','\\Amazon','\\eBay','\\AliExpress'];
                list.forEach(row=>{
                    if(this.path.includes(row)){
                        let pathList = this.path.split(row);
                        this.path = pathList[0];
                    }
                });
               this.comPath = !!this.channelValue?(this.path+'\\'+this.channelValue):this.path;
                console.log(this.comPath,'this.comPath');
                console.log(this.channelValue,'this.channelValue');
            },
            init_data(){
                this.list = [];
                this.channel.forEach(row=>{
                    let data=this.gain_channel_data(this.imgData,row.id);
                    let datas={
                        show:this.is_show(data),
                        name:row.name,
                        data,
                        id:row.id,
                        isEdit:this.editAble,
                    };
                    this.list.push(datas);
                });
                console.log(this.list,'this.list');
            },
            is_show(data){
                if(data&&data.spuImg&&(data.spuImg.images.length>0||data.skuImg.length>0)){
                    return true;
                }else{
                    return false;
                }
            },
            gain_channel_data(Array,channel_id){
                let imgData = window.clone(Array);
                let cur = {
                    spuImg:[],
                    skuImg:[]
                };
                imgData.forEach(row=>{
                    row.images = row.images.filter(res=>res.channel_id===channel_id);
                });
                if(channel_id===0){
                    cur =[];
                    imgData.forEach(row=>{
                        row.images.forEach(res=>{
                            cur.push(res);
                        });
                    });
                }else{
                    cur.spuImg = imgData.find(row=>row.sku_id===0);
                    cur.skuImg = imgData.filter(row=>{
                        let curList = [];
                        [1,2,4].forEach(res=>{
                            let cur = {
                                id:`add${new Date().getTime()}`,
                                sort:0,
                                sku_id:row.sku_id,
                                is_default:res,
                                path:"",
                            };
                            curList.push(cur);
                        });

                        if(row.images.length<=0){
                            row.images = clone(curList);
                        }
                        return row.sku_id!==0;
                    });
                }
                return cur;
            },
        },
        props:{
            activeName:{},
            imgData:{
                require:true,
                type:Array,
            },
            editAble:{
                type:Boolean,
                default(){
                    return true;
                },
            },
            isShow:{
                default(){
                    return false;
                }
            },
            isAdd:{
                default(){
                    return false;
                }
            },
            goodsId:{
                required:true,
            },
            baseUrl:{
                required:true,
                type:String
            },

        },
        components: {
            pictureItem:require('./picture-item.vue').default,
            customImage:require('./custom-image.vue').default,
            requestButton:require('@/global-components/request-button.vue').default,
        }
    }
</script>
