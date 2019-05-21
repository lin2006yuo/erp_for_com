<template>
    <page-dialog @open="open" v-model="show" size="large" title="修改标题">
        <el-row>
            <el-col :span="8" style="width: 150px;">
                <el-radio  v-model="title.select" label="1">添加前后缀</el-radio>
            </el-col>
            <el-col :span="16">
                <el-row class="mb-xs">
                    <el-checkbox v-model="title.prefix.isPre" :disabled="title.select!=='1'">前缀</el-checkbox>
                    <el-input v-model="title.prefix.pre" placeholder="请输入内容" :disabled="!(title.select==='1'&&title.prefix.isPre)"
                              class="inline" style="width:400px"
                    ></el-input>
                </el-row>
                <el-row class="mb-xs">
                    <el-checkbox v-model="title.prefix.isSuf" :disabled="title.select!=='1'">后缀</el-checkbox>
                    <el-input v-model="title.prefix.suf" placeholder="请输入内容" :disabled="!(title.select==='1'&&title.prefix.isSuf)"
                              class="inline" style="width:400px"></el-input>
                </el-row>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="8" style="width: 150px;">
                <el-radio  v-model="title.select" label="2">查找并替换</el-radio>
            </el-col>
            <el-col :span="16">
                <el-row class="mb-xs" style="padding:0 18px">
                    查找 <el-input v-model="title.find.value" placeholder="请输入内容" :disabled="title.select!=='2'"
                                 class="inline" style="width:400px"></el-input>
                </el-row>
                <el-row  class="mb-xs" style="padding:0 18px">
                    替换 <el-input v-model="title.find.replace" placeholder="请输入内容" :disabled="title.select!=='2'"
                                 class="inline" style="width:400px"></el-input>
                </el-row>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="8" style="width: 150px;">
                <el-radio  v-model="title.select" label="3">统一修改为</el-radio>
            </el-col>
            <el-col :span="16" style="padding-left: 45px;">
                <el-input v-model="title.unite" placeholder="请输入内容" :disabled="title.select!=='3'"
                          class="inline" style="width:400px"></el-input>
            </el-col>
        </el-row>
        <el-row class="mb-xs">
            <el-radio  v-model="title.select" label="5">首字母改大写</el-radio>
        </el-row>
        <el-row class="mb-xs" v-if="ebayStatus==='already'">
            <el-col :span="8" class="text-right"  style="width: 150px;">
                定时提交修改：
            </el-col>
            <el-col :span="16">
                <el-date-picker
                    v-model="title.cron_time"
                    type="datetime"
                    placeholder="选择日期时间">
                </el-date-picker>
            </el-col>
        </el-row>
        <el-row v-if="ebayStatus==='already'">
            <el-col :span="8" class="text-right" style="width: 150px;">
                修改备注：
            </el-col>
            <el-col :span="16">
                <el-input
                    type="textarea"
                    :rows=4
                    style="width:50%"
                    placeholder="请输入内容"
                    v-model="title.remark">
                </el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-button size="mini"
                       @click.native="title_preview"
                       type="primary"
                       class="mt-sm mb-sm fr">预览</el-button>
        </el-row>
        <el-table
            :data="selectedIds"
            style="width: 100%">
            <el-table-column label="商品ID" inline-template v-if="type==='title'">
                <span>{{ row.item_id ? row.item_id : row.id }}</span>
            </el-table-column>
            <el-table-column v-else
                prop="product_id"
                label="商品ID"
            >
            </el-table-column>
            <el-table-column
                :prop="type"
                label="修改前"
            >
            </el-table-column>
            <el-table-column
                :prop="newType"
                label="修改后">
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="keep" type="primary" v-if="ebayStatus==='already'">保存待同步平台</el-button>
            <el-button size="mini" @click.native="keep" type="primary" v-else>确定</el-button>
            <el-button size="mini" @click.native="close" >关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .text-right{
        text-align: right;
        padding-right:5px;
    }
</style>
<script>
    import {api_aliexpress_batch_product} from "../../../api/publish-smt"
    import {api_wish_batch_edit} from "../../../api/kandeng"
    import {api_edit_ebay_title} from "../../../api/ebay-kandeng-operated"
    import {api_up_title} from "../../../api/ebay-kandeng-public-module"
    export default{
        data(){
            return{
                show:this.value,
                title:{
                    select:"",
                    prefix:{isPre:false,pre:"",isSuf:false,suf:""},
                    find:{value:"",replace:""},
                    unite:"",
                    cron_time:"",
                    remark:"",
                },
                newType:`new${this.up_first_letter(this.type)}`,
            }
        },
        methods:{
            open(){
                this.init();
            },
            init(){
                this.title = {
                    select:"",
                    prefix:{isPre:false,pre:"",isSuf:false,suf:""},
                    find:{value:"",replace:""},
                    unite:"",
                    cron_time:"",
                    remark:"",
                };
            },
            //  标题修改预览
            title_preview(){
                if(!this.title.select){
                    this.$message({type:'warning',message:"请选择修改方式"});
                    return;
                }
                let flag=true;
                switch (this.title.select){
                    case "1":      //选择前缀 或者后缀
                        if(this.title.prefix.isPre&&this.title.prefix.isSuf){
                            this.selectedIds.forEach(row=>{
                                this.$set(row,this.newType,this.title.prefix.pre+row[this.type]+this.title.prefix.suf);
                            });
                        }else if(this.title.prefix.isPre&&!this.title.prefix.isSuf){
                            this.selectedIds.forEach(row=>{
                                this.$set(row,this.newType,this.title.prefix.pre+row[this.type]);
                            });
                        }else if(!this.title.prefix.isPre&&this.title.prefix.isSuf){
                            this.selectedIds.forEach(row=>{
                                this.$set(row,this.newType,row[this.type]+this.title.prefix.suf);
                            });
                        }else {
                            flag=false;
                            this.$message({type:'warning',message:"请选择加前缀或后缀"});
                        }
                        break;
                    case "2":   //查找替换
                        if(this.title.find.value===""){
                            flag=false;
                            this.$message({type:'warning',message:"请选择要替换的内容"});
                        }else {
                            this.selectedIds.forEach(row=>{
                                let reg=new RegExp(this.title.find.value,"g");
                                let name=row[this.type].replace(reg,this.title.find.replace);
                                this.$set(row,this.newType,name);
                            })
                        }
                        break;
                    case "3":  //统一修改
                        if(this.title.unite===""){
                            flag=false;
                            this.$message({type:'warning',message:"请选择要替换的内容"});
                        }else {
                            this.selectedIds.forEach(row=>{
                                this.$set(row,this.newType,this.title.unite);
                            });
                        }
                        break;
                    case "4": //过滤重复词
                        break;
                    case "5": //首字母大写
                        this.selectedIds.forEach(row=>{
                            let name= row[this.type].split(/\s+/);
                            name= name.map(rows=>{
                                rows=this.up_first_letter(rows);
                                return rows;
                            });
                            this.$set(row,this.newType,name.join(' '));
                        });
                        break;
                }
                return flag;
            },
            up_first_letter(str){  //首字母大写
                return str.substring(0,1).toUpperCase( ) + str.substring(1);
            },
            //保存标题
            keep(){
                let flag=this.title_preview();
                if(flag){
                    if(this.title.cron_time && this.title.cron_time instanceof Object){
                        this.title.cron_time = datef("YYYY-MM-dd HH:mm:ss",this.title.cron_time/1000);
                    }else if(!this.title.cron_time){
                        this.title.cron_time = "";
                    }
                    if(this.type==="name"){ //wish
                        let table=this.selectedIds.map(row=>{
                            return {
                            	product_id:row.product_id,
                                name:row[this.newType],
                            };
                        });
                        let data={
                        	type:'name',
                            data:table,
                            cron_time:this.title.cron_time,
                            remark:this.title.remark,
                        };
                        this.operate_ajax(api_wish_batch_edit,data);
                    } else if(this.type==="subject"){ //aliexpress
                        let data= this.selectedIds.map(row=>{
                            return {
                                product_id:row.id,
                                value:row[this.newType],
                            }
                        });
                        let postData={
                            type:"title",
                            data:data,
                            cron_time:this.title.cron_time,
                            remark:this.title.remark,
                        };
                        this.operate_ajax(api_aliexpress_batch_product,postData);
                    } else if(this.type==="title"){ //ebay
                        let data= this.selectedIds.map(row=>{
                            if(this.ebayStatus==='already'){
                                return {
                                    item_id:row.item_id,
                                    site:row.site,
                                    listing_sku:row.listing_sku,
                                    title:row.newTitle,
                                    old_title:row.title,
                                    account_id:row.account_id,
                                    cron_time:this.title.cron_time,
                                    remark:this.title.remark,
                                };
                            }else{
                                return {
                                    id:row.id,
                                    title:row.newTitle
                                }
                            }
                        });
                        let postData={
                            data:data,
                        };
                        if(this.ebayStatus==='already'){
                            this.operate_ajax(api_up_title,postData);
                        } else{
                            this.operate_ajax(api_edit_ebay_title,postData);
                        }

                    }
                }
            },
            operate_ajax(api,data){
                this.$http(api,data).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.$emit('change-data',data.data);
                    this.show=false;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                });
            },
            close(){
                this.show =false;
            },
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            },
        },
        computed:{
        },
        props:{
            value:{
                required:true,
            },
            selectedIds:{
                required:true,
                type:Array,
            },
            type:{
            },
            ebayStatus:{
                required:true,
                type:String,
            }
        },
        components:{
            pageDialog:require('../../../components/page-dialog.vue').default
        }
    }
</script>
