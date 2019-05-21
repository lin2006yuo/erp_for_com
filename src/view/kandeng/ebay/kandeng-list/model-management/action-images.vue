<template>
    <page-dialog v-model="show" size="full" title="批量修改主图" @open="open"
                 class="c-action-images" :close-on-click-modal="false">
        <table class="table">
            <tr>
                <th v-if="status==='1'">SPU/ItemID</th>
                <th v-else>SPU</th>
                <th>刊登主图（第一张图片自动被用作橱窗图）</th>
            </tr>
            <tr v-for="(item,key, i) in tableData">
                <td v-if="status==='1'">
                    {{item.spu}} / {{item.item_id}}<br/>
                    ({{item.imgs.length}}/12)
                </td>
                <td v-else>
                    {{item.spu}}<br/>
                    ({{item.imgs.length}}/12)
                </td>
                <td class="item-images">
                    <change-picture :imgs="item.imgs"
                                    :item-data="item"
                                    @change-image="change_image"
                                    @add-pic="add_pic"
                                    :id="item.goods_id"
                                    :status="status"
                                    :index="i"
                                    :title="title"
                                    :show-main="false"></change-picture>
                </td>
            </tr>
        </table>
        <el-row class="mb-xs" v-if="status==='1'">
            <el-col :span="4" class="text-right">
                定时提交修改：
            </el-col>
            <el-col :span="20">
                <el-date-picker
                    v-model="cron_time"
                    type="datetime"
                    placeholder="选择日期时间">
                </el-date-picker>
            </el-col>
        </el-row>
        <el-row  v-if="status==='1'">
            <el-col :span="4" class="text-right">
                修改备注：
            </el-col>
            <el-col :span="20">
                <el-input
                    type="textarea"
                    :rows=4
                    style="width:50%"
                    placeholder="请输入内容"
                    v-model="remark">
                </el-input>
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <request-button @click="keep" :mintime="300" req-key="actionImageKey">{{$t('common.confirm')}}</request-button>
            <el-button size="mini" @click.native="close" >关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .c-action-images{
        .table{
            width:90%;
            margin: 10px auto;
            border-collapse: collapse;
            th{
                border:1px solid #e0e6ed;
                line-height: 30px;
            }
            td{
                border:1px solid #e0e6ed;
                position:relative;
                text-align: center;
                .c-images{
                    margin: 3px;
                }
                .pre-btn{
                    padding: 0 5px;
                    height: 102px;
                    line-height: 102px;
                    position: absolute;
                    left: 5px;
                    top: 6px;
                }
                .next-btn{
                    padding: 0 5px;
                    height: 102px;
                    line-height: 102px;
                    position: absolute;
                    top:6px;
                    right:5px;
                }
                &.item-images{
                    width:1310px;
                    text-align: left;
                }
            }
        }

    }
</style>
<script>
    import {api_getDraft_imgs,api_upDraft_imgs,api_up_images} from "../../../../../api/ebay-kandeng-public-module"
    import {api_get_ebay_product_images,api_update_ebay_product_images} from "../../../../../api/ebay-kandeng-operated"
    export default{
        data(){
            return{
                show:this.value,
                tableData:[],
                picVisable:false,
                isAdd:false,
                goodsId:"",
                newId:"",
                multiple:false,
                showMain:true,
                tempImg:{},
                title:"imgs",
                cron_time:"",
                remark:"",
            }
        },
        methods:{
            open(){
                this.init_img();
                this.cron_time = "";
                this.remark = "";
            },
            /*新版本请求数据接口已刊登和刊登记录1个接口*/
            init_img(){
                let data = this.selectIds.map(row =>row.id).join(";");
                this.$http(api_get_ebay_product_images,{data:data}).then(res=>{
                    this.tableData = res.data;
                    this.tableData.forEach(row=>{
                        let find = this.selectIds.find(inner=>Number(row.id)===Number(inner.id));
                        if(find)this.$set(row,"goods_id",find.goods_id);
                    });
                }).catch(code=>{
                    this.$message({type:'success',message:code.message||code})
                })
            },
            add_pic(item){
                this.isAdd=true;
                this.picVisable=true;
                this.multiple=true;
                this.newId = item.id;
            },
            selected(val){
                if(this.isAdd) {
                    val.forEach(row => {
                        for(let key in this.tableData){
                            if(this.newId===key&&this.tableData[key].imgs.length>=12){
                            	return this.$message({type:"warning",message:"此处最多上传12张图片！"});
                            }else{
                            	if(this.newId===key){
                                    let find = this.tableData[key].imgs.find(inner=>{
                                            return inner.id === row.id
                                    })
                                    if(!find){
                                        this.tableData[key].imgs.push(row);
                                    }
                                }
                            }
                        }
                    })
                }else{
                    this.tempImg.path=val[0].original_path;
                }
            },
            change_image(image,item){
                this.picVisable=true;
                this.tempImg=image;
                this.isAdd=false;
                this.multiple = false;
            },
            operate_img(image){
                let img = image.path||image.thumb;
                return img.includes("http")?img:(image.base_url+img);
            },
            //保存
            keep(){
                this.cron_time = this.cron_time?datef("YYYY-MM-dd HH:mm:ss",this.cron_time/1000):'';
                let arr = this.tableData.map(row=>{
                    let opreateImgs = row.imgs.map(x =>this.operate_img(x));
                    let obj = {
                        id: row.id,
                        imgs:opreateImgs,
                    };
                    if(this.status==='1'){
                        this.$set(obj,'cron_time',this.cron_time);
                        this.$set(obj,'remark',this.remark);
                    }
                    return obj;
                });
                let url = this.status==='1'?api_up_images:api_upDraft_imgs;
                this.$http(url,{data:arr}).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.$emit('change-data',arr);
                    this.show=false;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                }).finally(()=>{
                    this.$reqKey('actionImageKey',false)
                });
            },
            close(){
                this.show=false;
            },
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            }
        },
        props:{
            value:{
                required:true,
            },
            selectIds:{},
            accountId:{},
            status:{
                default(){
                    return '1' //1是已刊登，2是范本
                }
            }
        },
        components:{
            pageDialog:require('../../../../../components/page-dialog.vue').default,
            dragDrop:require("../../../../../components/drag-drop").default,
            changePicture:require('./change-picture.vue').default
        }
    }

</script>
