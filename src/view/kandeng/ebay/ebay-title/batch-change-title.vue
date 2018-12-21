<template>
    <page-dialog v-model="dialog" :title="comTitle"
                 size="large"
                 :close-on-click-modal="false">
        <div class="mt-lg">
            <card-component style="overflow: inherit;" v-for="(item,index) in detailList"
                            :key="item.value" class="mt-sm"
                            @close-cur="close_cur(index)">
                <div class="batch-change-box">
                    <div class="batch-change-img" @click="clickImg(item.thumb)">
                            <div class="mb-mini">SPU:【{{item.spu}}】</div>
                            <el-popover
                                placement="right"
                                width="200"
                                trigger="hover">
                                <img v-lazy="overImg(item.thumb)" width="200" height="200">
                                <div slot="reference">
                                    <img width="100" height="100" class="img-box" :src="item.thumb">
                                 </div>
                            </el-popover>
                            
                    </div>
                    <div class="batch-change-title">
                        <label label="SPU标题：">
                            <div>{{item.title_zh}}</div>
                            <div style="margin-left:57px">{{get_enTitle(item)}}
                                <b class="ml-lg" v-if="get_enTitle(item).length>=0">（ <span :class="[get_enTitle(item).length>75?'red':'']">{{get_enTitle(item).length}}</span>/75 ）</b>
                            </div>
                        </label>
                        <div>
                           
                            <move-title class='mt-sm' :source-data="item.sourceData" ></move-title>
                        </div>
                    </div>
                </div>
            </card-component>
        </div>
        <div slot="footer">
            <request-button req-key="api_batch_save_title"
                            :mintime="300"
                            @click="submit">确定</request-button>
            <el-button size="mini" @click.native="close_dialog">关闭</el-button>
        </div>



         <el-dialog
            width="30%"
            title="详情"
            :visible.sync="clickImgSwitch"
            :modal-append-to-body='false'
            >
            <img style="max-width:630px"  width="100%" :src="src">
        </el-dialog>
    </page-dialog>
</template>
<style lang="stylus">
    .batch-change-box{
        display:flex
        min-height:150px;
        .batch-change-img{
            text-align:center;
            box-sizing:border-box;
            width:140px;
            position:relative
            .img-box{
                position:absolute;
                top:50%;
                left:50%;
                margin-top:-50px;
                margin-left:-50px;
            }
        }
        .batch-change-title{
            flex:1
        }
    }
</style>



<script>
    import {api_batch_save_title} from '@/api/ebay-title-key';
    export default{
        data(){
            return{
                clickImgSwitch:false,
                src:'',
                dialog:this.value,
                cardList:[
                    {label:'cehs1',value:1},
                    {label:'cehs2',value:2},
                    {label:'cehs3',value:3},
                ],
            }
        },
        methods:{
            clickImg(src){
                this.src=src.replace('.jpg','_500x500.jpg');
                this.clickImgSwitch=true;
            },
            overImg(images){
                if(!!images){
                    return images.replace('_60x60','_200x200');
                }
                return ""
            },
            get_enTitle(item){
                let value = [];
                if(item&&item.sourceData){
                    value = [...item.sourceData.frontList,...item.sourceData.middleList,...item.sourceData.backList].map(row=>row.name);
                }
                return value.join(' ');
            },
            close_dialog(){
                this.dialog = false;
            },
            submit(){
                let find = this.detailList.find(row=>{
                    return this.get_enTitle(row)&&this.get_enTitle(row).length>75
                });
                if(find){
                    return this.$message({type:'warning',message:`SPU：${find.spu}，最新标题字符数已超过75个，当前字符数为${this.get_enTitle(find).length},请修改！`});
                }
                let data = this.detailList.map(row=>{
                    let titles = {
                        en:{
                            front:row.sourceData.frontList.map(item=>item.name),
                            middle:row.sourceData.middleList.map(item=>item.name),
                            back:row.sourceData.backList.map(item=>item.name)
                        }
                    };
                    return {
                        id:row.id,
                        goods_id:row.goods_id,
                        titles:titles
                    }
                });
                this.$http(api_batch_save_title,{data:data}).then(res => {
                    this.$message({type:'success',message:res.message||res});
                    this.$emit('submit',data);
                    this.dialog = false;
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    this.$reqKey('api_batch_save_title',false)
                })
            },
            close_cur(index){
                this.detailList.splice(index,1)
            },
        },
        computed:{
            comTitle(){
                return '批量标题修改';
            },
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
            }
        },
        props:{
            value:{},
            detailList:{}
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
            cardComponent:require('./card-component.vue').default,
            tag:require('./tag.vue').default,
            moveTitle:require('./move-title.vue').default,
            labelItem:require('@/components/label-item.vue').default,
        }
    }
</script>