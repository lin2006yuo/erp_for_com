<template>
    <page-dialog v-model="show" size="large" title="批量修改主图" class="c-action-images" :close-on-click-modal="false">
        <table class="table">
            <tr>
                <th>ItemID</th>
                <th>刊登主图（第一张图片自动被用作橱窗图）</th>
            </tr>
            <tr v-for="(item, i) in tableData">
                <td v-if="item.images" class="item-images">
                    {{item.item_id}}<br/>
                    ({{item.images.length}}/12)
                </td>
                <td>
                    <change-picture :imgs="item.imgs"
                                    :item-data="item"
                                    @change-image="change_image"
                                    @add-pic="add_pic"
                                    :id="item.goods_id"
                                    :index="i"
                                    :title="title"
                                    :show-main="false">
                    </change-picture>
                </td>
            </tr>
        </table>
        <el-row class="mb-xs">
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
        <el-row>
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
        <publish-img v-model="picVisable" @submit="selected"
                     :channel="1" :account="accountId"
                     :id="goodsId" :multiple="multiple" :spu="spuId"></publish-img>
        <div slot="footer" class="dialog-footer">
            <request-button @click="keep" :mintime="300" req-key="actionImage">保存待同步平台</request-button>
            <el-button size="mini" @click.native="close" >关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .c-action-images{
        .table{
            width:87%;
            margin: 10px auto;
            border-collapse: collapse;
            th{
                border:1px solid #e0e6ed;
                line-height: 30px;
            }
            td{
                border:1px solid #e0e6ed;
                position:relative;
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
                    width:6%;
                    text-align: center;
                }
            }
        }
        .out-ul{
            margin: 5px 49px;
            width: 750px;
            height: 102px;
            overflow: hidden;
            position: relative;
        }
        .totalUl{
            position:absolute;
            left:0;
            top:0;
            list-style:none;
        }
        .el-icon-plus{
            width:100px;
            height:100px;
            line-height:100px;
            text-align :center;
            color:#CFCFCF;
        }
        .allli{
            height:100px;
            width:100px;
            float: left;
            position:relative;
            border:1px solid #CFCFCF;
            margin-right :6px;
            &:last-chid{
                margin-right:0;
            }
        }
        .tool {
            background-color: rgba(0, 0, 0, 0.72);
            text-align: center;
            display: flex;
            justify-content: space-around;
            .btn{
                display: inline-block;
                color: #fff;
                font-size: 1.25rem;
                cursor: pointer;
                vertical-align: middle;
                transition: transform 300ms cubic-bezier(0.23, 1, 0.32, 1) 100ms, opacity 300ms cubic-bezier(0.23, 1, 0.32, 1) 100ms;
                margin-top: 5%;
            }
            .btn .i{
                color: #fff;
                display: block;
                font-size: 24px;
                line-height: inherit;
                margin: 0 auto 5px;
            }
            .btn:hover{
                transform: translateY(-2px);
            }
            .btn:not(:first-child){
                margin-left: 20px;
            }
        }
    }
</style>
<script>
    import {api_get_ebay_product_images,api_update_ebay_product_images} from "../../../../../api/ebay-kandeng-operated"
    import {api_up_images} from "../../../../../api/ebay-kandeng-public-module"
    export default{
        data(){
            return{
                show:this.value,
                tableData:[],
                picVisable:false,
                isAdd:false,
                goodsId:"",
                spuId:"",
                newId:"",
                multiple:false,
                title:"images",
                tempImg:{},
                cron_time:"",
                remark:"",
            }
        },
        methods:{
            init(){
                let data = this.selectIds.map(row =>row.item_id).join(";")
                this.$http(api_get_ebay_product_images,{data:data}).then(res=>{
                    this.tableData = res.data;
                    this.tableData.forEach(row =>{
                        row.width = (row.images.length+1) * 108 + 'px';
                        this.$set(row, "preDisabled", true);
                        this.$set(row, "nextDisabled", true);
                        this.$set(row, "old_images", row.images);
                        if((row.images.length+1) > 7){
                            this.$set(row, "nextDisabled", false);
                        }
                        this.selectIds.forEach(inner =>{
                            if(row.item_id===inner.item_id){
                                this.$set(row,"goods_id",inner.goods_id);
                                this.$set(row, "account_id", inner.account_id);
                                this.$set(row, "listing_sku", inner.listing_sku);
                                this.$set(row, "site", inner.site);
                            }
                        });
                    })
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                })
            },
            add_pic(item){
                if(!!item.goods_id){
                    this.isAdd=true;
                    this.picVisable=true;
                    this.multiple=true;
                    this.goodsId = item.goods_id;
                    this.spuId = item.spu;
                    this.newId = item.id;
                }else{
                	this.$message({type:"info", message:"未关联产品，无法操作"});
//                	return;
                }
            },
            selected(val){
                if(this.isAdd) {
                    val.forEach(row => {
                        this.tableData.forEach(x => {
                            if(this.newId===x.id && x.images.length>=12){
                                return this.$message({type:"warning",message:"此处最多上传12张图片！"});
                            }
                            if (row.goods_id === x.goods_id && x.images.length < 12) {
                                x.images.push({path: row.path});
                                x.width = (x.images.length+1) * 108 + 'px';
                            }
                            if(x.images.length===7){
                                this.$set(x, "nextDisabled", false);
                            }
                        })
                    })
                }else{
                    this.tempImg.path=this.title==='images' ? val[0].path : val[0].original_path;
                    this.tempImg.thumb=val[0].thumb;
                }
            },
            change_image(image,item){
                if(!!item.goods_id){
                    this.picVisable=true;
                    this.tempImg=image;
                    this.isAdd=false;
                    this.multiple = false;
                    this.goodsId = item.goods_id;
                    this.spuId = item.spu;
                }else{
                    this.$message({type:"info", message:"未关联产品，无法操作"});
//                	return;
                }

            },
            remove(image,item){
                this.tableData.forEach(row =>{
                    if(row.item_id === item.item_id){
                        let index = row.images.indexOfFun(img=>img.eps_path === image.eps_path);
                        row.images.splice(index, 1);

                    }
                })
            },
            //保存
            keep(){
                let arr =[];
                if(this.cron_time && this.cron_time instanceof Object){
                    this.cron_time = datef("YYYY-MM-dd HH:mm:ss",this.cron_time/1000);
                }else if(!this.cron_time){
                    this.cron_time = "";
                }
                this.tableData.map(row=>{
                    let obj = {
                        item_id:row.item_id,
                        site:row.site,
                        listing_sku:row.listing_sku,
                        images:row.images.map(x => (x.path ? x.path :x.eps_path)).join(";"),
                        old_images:row.old_images.map(x => (x.path ? x.path :x.eps_path)).join(";"),
                        account_id:row.account_id,
                        cron_time:this.cron_time,
                        remark:this.remark
                    };
                    arr.push(obj);
                });
                this.$http(api_up_images,{data:arr}).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.$emit('change-data',arr);
                    this.show=false;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                }).finally(()=>{
                    this.$reqKey('actionImage',false)
                })
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
                if(!!val){
                	this.init();
                	this.cron_time = "";
                    this.remark = "";
                }

            },
        },
        computed:{
        },
        props:{
            value:{
                required:true,
            },
            selectIds:{},
            accountId:{}
        },
        components:{
            pageDialog:require('../../../../../components/page-dialog.vue').default,
            dragDrop:require("../../../../../components/drag-drop").default,
            publishImg:require('../../../publish-img.vue').default,
            changePicture:require('../model-management/change-picture.vue').default
        }
    }
</script>
