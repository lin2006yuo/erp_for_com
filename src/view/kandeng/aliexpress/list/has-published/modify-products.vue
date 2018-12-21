<template>
    <page-dialog v-model="show" size="large" @open="open" title="修改产品信息模块" :close-on-click-modal="false">
        <div>
            <p>
                <label class="has-inline text-right" style="width: 100px;"> 关联产品模块：</label>
                <el-select v-model="information.relation" class="inline"  placeholder="请选择">
                    <el-option
                        v-for="item in customTemplate.relation"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-radio class="radio" v-model="information.relation_position" label="top">顶部</el-radio>
                <el-radio class="radio" v-model="information.relation_position" label="bottom">底部</el-radio>
            </p>
            <p>
                <label class="has-inline text-right" style="width: 100px;"> 自定义信息模块：</label>
                <el-select v-model="information.custom" class="inline"  placeholder="请选择">
                    <el-option
                        v-for="item in customTemplate.custom"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-radio class="radio" v-model="information.custom_position" label="top">顶部</el-radio>
                <el-radio class="radio" v-model="information.custom_position" label="bottom">底部</el-radio>
            </p>
            <p>
                <label class="has-inline text-right" style="width: 100px;"> 定时提交修改：</label>
                <el-date-picker
                    v-model="information.cron_time"
                    type="datetime"
                    class="has-inline"
                    placeholder="选择日期时间">
                </el-date-picker>
            </p>
            <p>
                <label class="has-inline text-right" style="width: 100px;"> 修改备注：</label>
                <el-input
                    type="textarea"
                    :rows=4
                    style="width:35%"
                    placeholder="请输入内容"
                    v-model="information.remark">
                </el-input>
            </p>
        </div>
        <div>
            <el-button size="mini"
                       @click.native="look"
                       type="primary"
                       class="mt-sm mb-sm fr">预览</el-button>
        </div>
        <el-table
            :data="selectedIds"
            style="width: 100%">
            <el-table-column
                prop="product_id"
                label="商品ID"
            >
            </el-table-column>
            <el-table-column
                inline-template
                label="修改前"
            >
                <div>
                    <p>
                        <span>关联产品模块:{{row.relation_name}}</span>
                        <span>位置:{{row.relation_position}}</span>
                    </p>
                    <p>
                        <span>自定义信息模块:{{row.custom_name}}</span>
                        <span>位置:{{row.custom_position}}</span>
                    </p>
                </div>
            </el-table-column>
            <el-table-column inline-template label="修改后">
                <div>
                    <p>
                        <span>关联产品模块:{{row.relation_name_new}}</span>
                        <span>位置:{{row.relation_position_new|positionFilter}}</span>
                    </p>
                    <p>
                        <span>自定义信息模块:{{row.custom_name_new}}</span>
                        <span>位置:{{row.custom_position_new|positionFilter}}</span>
                    </p>
                </div>
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="keep" type="primary">保存待同步平台</el-button>
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
    import {
    	api_ali_custom_template_keep,
        api_ali_custom_template
    } from "../../../../../api/publish-smt"
    export default{
        data(){
            return{
                show:this.value,
                information:{
                    custom:"",
                    relation:"",
                    custom_position:"bottom",
                    relation_position:"top",
                    cron_time:"",
                    remark:""
                },
                customTemplate:{
                    custom:[],
                    relation:[],
                },
                relation:"",
                custom:""
            }
        },
        created(){
        },
        filters:{
            positionFilter(val){
                if(val==="top"){
                    return "顶部"
                }else if(val==="bottom"){
                    return "底部"
                }else {
                    return "未定义"
                }
            }
        },
        methods:{
            open(){
                this.clear();
                this.get_custom_template()
            },
            clear(){
                this.information = {
                    custom:"",
                    relation:"",
                    custom_position:"bottom",
                    relation_position:"top",
                    cron_time:"",
                    remark:""
                };
                this.customTemplate = {
                    custom:[],
                    relation:[],
                }
            },
            get_custom_template(){
                this.$http(api_ali_custom_template,{account_id:this.accountId}).then(res=>{
                    this.customTemplate=res;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                })

            },
            look(){
                let status=""
                if(this.information.custom&&this.information.relation){
                    status=1
                }else  if(this.information.custom&&!this.information.relation){
                    status=2
                }else  if(!this.information.custom&&this.information.relation){
                    status=3
                } else {
                    this.$message({type: "warning", message:"请选择关联模块或自定义模块"});
                    return false ;
                }
                switch (status){
                    case 1:
                        this.selectedIds.forEach(row=>{
                            let custom=this.customTemplate.custom.find(row=>{
                                return row.id===this.information.custom
                            }).name
                            let relation=this.customTemplate.relation.find(row=>{
                                return row.id===this.information.relation
                            }).name
                            this.$set(row,"custom_name_new",custom)
                            this.$set(row,"relation_name_new",relation)
                            this.$set(row,"custom_position_new",this.information.custom_position)
                            this.$set(row,"relation_position_new",this.information.relation_position)
                            this.custom = custom;
                            this.relation = relation;
                        })
                        break;
                    case 2:
                        this.selectedIds.forEach(row=>{
                            let custom=this.customTemplate.custom.find(row=>{
                                return row.id===this.information.custom
                            }).name
                            this.$set(row,"custom_name_new",custom)
                            this.$set(row,"relation_name_new",row.relation_name)
                            this.$set(row,"custom_position_new",this.information.custom_position)
                            this.$set(row,"relation_position_new",row.relation_position)
                            this.custom = custom;
                            this.relation = row.relation_name;
                        })
                        break;
                    case 3:
                        this.selectedIds.forEach(row=>{
                            let relation=this.customTemplate.relation.find(row=>{
                                return row.id===this.information.relation
                            }).name
                            this.$set(row,"custom_name_new",row.custom_name)
                            this.$set(row,"relation_name_new",relation)
                            this.$set(row,"custom_position_new",row.custom_position)
                            this.$set(row,"relation_position_new",this.information.relation_position)
                            this.custom = row.custom_name;
                            this.relation = relation;
                        })
                        break;
                }
                return true
            },
            keep(){
                let flag=this.look();
                if(this.information.cron_time && this.information.cron_time instanceof Object){
                    this.information.cron_time = datef("YYYY-MM-dd HH:mm:ss",this.information.cron_time/1000);
                }else if(!this.information.cron_time){
                    this.information.cron_time = "";
                }
                if(flag){
                    let postData=[];
                    if(this.information.custom&&this.information.relation){
                        this.selectedIds.forEach(row=>{
                            let parm={
                                id:row.id,
                                relation_template_id:this.information.relation,
                                relation_template_postion:this.information.relation_position,
                                custom_template_id:this.information.custom,
                                custom_template_postion:this.information.custom_position,
                            }
                            postData.push(parm)
                        })
                    }else  if(this.information.custom&&!this.information.relation){
                        this.selectedIds.forEach(row=>{
                            let parm={
                                id:row.id,
                                custom_template_id:this.information.custom,
                                custom_template_postion:this.information.custom_position,
                            }
                            postData.push(parm)
                        })
                    }else  if(!this.information.custom&&this.information.relation) {
                        this.selectedIds.forEach(row=>{
                            let parm={
                                id:row.id,
                                relation_template_id:this.information.relation,
                                relation_template_postion:this.information.relation_position,
                            }
                            postData.push(parm)
                        })
                    }
                    let params = {
                    	data:postData,
                        cron_time:this.information.cron_time || 0,
                        remark:this.information.remark.trim(),
                    };
                    this.$http(api_ali_custom_template_keep,params).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        postData.forEach(row=>{
                            this.$set(row,"custom",this.custom)
                            this.$set(row,"relation",this.relation)
                        })
                        this.$emit('change-data',postData)
                        this.show=false
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'})
                    })
                }
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
            }
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
            accountId:{
            }
        },
        components:{
            pageDialog:require('../../../../../components/page-dialog.vue').default
        }
    }
</script>
