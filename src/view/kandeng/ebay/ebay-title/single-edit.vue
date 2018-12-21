<template>
    <page-dialog v-model="dialog"
                 size="large"
                 :title="title"
                 :close-on-click-modal="false">
        <div class="batch-change-box">
            <div class="batch-change-img"  @click="clickImg(src)">
                <el-popover
                placement='right-start'
                width="200"
                trigger="hover"
                
                >
                <img v-lazy="overImg(src)"  width="200" height="200">
                <div slot="reference">
                        <img width="100" height="100" class="img-box" :src="src" >
                </div>
                </el-popover>
        </div>
        <div class="batch-change-title">
                <label lable="SPU标题：">
                    <div>{{form.title_zh}}</div> 
                    <div style="margin-left:57px;">{{comEnTitle}}
                        <b class="ml-lg" v-if="comEnTitle.length>=0">（ <span :class="[comEnTitle.length>75?'red':'']">{{comEnTitle.length}}</span>/75 ）</b>
                    </div>
                </label>
               
        <move-title :src="form.src" :source-data="form.sourceData" :style-prop="styleProp"></move-title>
       
        </div>
        </div>
        <div slot="footer">
            <request-button req-key="api_save_ebay_titles"
                            :mintime="300"
                            @click="submit">确定</request-button>
            <el-button size="mini"
                       @click.native="cancel">取消</el-button>
        </div>

        <el-dialog
            width="30%"
            title="详情"
            :visible.sync="clickImgSwitch"
            :modal-append-to-body='false'
            >
            <img style="max-width:630px"  width="100%" :src="dialog">
        </el-dialog>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {api_save_ebay_titles} from '@/api/ebay-title-key';
    export default{
        data(){
            return{
                dialog:'',
                styleProp:{
                    minHeight:'40px',
                    width:'100%',
                },
                clickImgSwitch:false,
            }
        },
        methods:{
            clickImg(src){
                this.dialog=src.replace('_60x60','_500x500');
                this.clickImgSwitch=true;
            },
            overImg(images){
                if(!!images){
                    return images.replace('_60x60','_200x200')
                }
                return ""
            },
            filter_name(list){
                return list.map(row=>row.name)
            },
            submit(){
                if(this.comEnTitle.length>75) return this.$message({type:'warning',message:'当前标题超出字符限制，请修改！'});
                let data = {
                    id:this.form.id||'',
                    titles:{
                        en:{
                            front:this.filter_name(this.form.sourceData.frontList),
                            middle:this.filter_name(this.form.sourceData.middleList),
                            back:this.filter_name(this.form.sourceData.backList),
                        }
                    }
                };
                this.$http(api_save_ebay_titles,this.form.goods_id,data).then(res => {
                    this.dialog = false;
                    this.$message({type:'success',message:res.message||res});
                    let copyData = clone(data);
                    this.$set(copyData,'goods_id',this.form.goods_id);
                    this.$emit('submit',[copyData]);
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code})
                }).finally(()=>{
                    this.$reqKey('api_save_ebay_titles',false)
                })
            },
            cancel(){
                this.dialog = false;
            }
        },
        computed:{
            comEnTitle(){
                let value = [];
                if(this.form&&this.form.sourceData){
                    value = [...this.form.sourceData.frontList,...this.form.sourceData.middleList,...this.form.sourceData.backList].map(row=>row.name);
                }
                return value.join(' ');
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
            form:{},
            title:{},
            src:{}
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
            moveTitle:require('./move-title.vue').default,
            labelItem:require('@/components/label-item.vue').default,
        }
    }
</script>