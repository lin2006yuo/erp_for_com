<template>
    <page-dialog v-model="show" @open="open" size="large" title="修改产品分组" :close-on-click-modal="false">
        <ui-list-check @get="get" :option="groups"></ui-list-check>
        <p>小提示：最多可以同时选择3项</p>
        <el-row class="mb-xs">
            <el-col :span="3" class="text-right">
                定时提交修改：
            </el-col>
            <el-col :span="21">
                <el-date-picker
                    v-model="cron_time"
                    type="datetime"
                    placeholder="选择日期时间">
                </el-date-picker>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="3" class="text-right">
                修改备注：
            </el-col>
            <el-col :span="21">
                <el-input
                    type="textarea"
                    :rows=4
                    style="width:35%"
                    placeholder="请输入内容"
                    v-model="remark">
                </el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-button size="mini"
                       @click.native="look"
                       type="primary"
                       class="mt-sm mb-sm fr">预览</el-button>
        </el-row>
        <el-table
            :data="selectedIds"
            style="width: 100%">
            <el-table-column
                prop="product_id"
                label="商品ID"
            >
            </el-table-column>
            <el-table-column
                prop="group_name"
                label="修改前"
            >
            </el-table-column>
            <el-table-column
                prop="groupNewname"
                label="修改后">
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <request-button :mintime="200" :request="keep" req-key="keep_submit">保存待同步平台</request-button>
            <el-button size="mini" @click.native="close" >关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">

</style>
<script>
    import {
        api_aliexpress_team,
        api_aliexpress_batch_group,
    } from "../../../../../api/publish-smt"
	export default{
		data(){
			return {
                show:this.value,
                groups:[],
                group_id:[],
                groupName:"",
                cron_time:"",
                remark:"",
            }
		},
        methods:{
		    open(){
                this.groupName="";
                this.cron_time="";
                this.remark="";
                this.get_groups();
            },
            close(){
                this.show=false;
            },
            get(val){
                this.group_id=val;
            },
            get_groups(){
                this.$http(api_aliexpress_team,{account_id:this.accountId}).then(res=>{
                    this.groups=res.map(row=>{
                        let group={
                            value:row.group_id,
                            label:row.group_name,
                        };
                        if(!!row.children){
                            group.children=row.children.map(child=>{
                                let data={
                                    value:child.group_id,
                                    label:child.group_name,
                                    disable:false,
                                    check:false
                                };
                                return  data;
                            });
                        }else {
                            group.disable=false;
                            group.check=false;
                        }
                        return group;
                    });
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                })
            },
            look(){
                if(this.group_id.length===0){
                    this.$reqKey('keep_submit',false);
                    this.$message({type:"warning",message:"请选择商品分组"});
                    return  false;
                }
                let name=[];
                this.group_id.forEach(row=>{
                    this.groups.forEach(group=>{
                        if(group.children){
                            group.children.forEach(child=>{
                                if(child.value===row){
                                	this.groupName = child.label;
                                    name.push(child.label);
                                }
                            })
                        }else {
                            if(group.value===row){
                                this.groupName = group.label;
                                name.push(group.label);
                            }
                        }
                    })
                });
                this.selectedIds.forEach(row=>{
                    this.$set(row,"groupNewname",name.join("|"));
                    this.$set(row,"groupNewid",this.group_id.join(","));
                });
                return true;
            },
            keep(){
                let flag=this.look();
                if(this.cron_time && this.cron_time instanceof Object){
                    this.cron_time = datef("YYYY-MM-dd HH:mm:ss",this.cron_time/1000);
                }else if(!this.cron_time){
                    this.cron_time = "";
                }
                if(flag){
                    let data=[];
                    this.selectedIds.forEach(row=>{
                        data.push({id:row.id,group_id:row.groupNewid})
                    });
                    let params = {
                    	data:data,
                        cron_time:this.cron_time || 0,
                        remark:this.remark.trim(),
                    };
                    return this.$http(api_aliexpress_batch_group,params).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        this.$emit('change-data',this.groupName);
                        this.show=false
                        return Promise.resolve();
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'})
                    }).finally(()=>{
                        setTimeout(()=>{
                            this.$reqKey('keep_submit',false);
                        },200);
                    });
                }
            },
        },
        watch: {
            value(val){
                this.show=val;
            },
            show(val){
                this.$emit("input",val)
            },
        },
        props:{
			value:{},
            accountId:{},
            selectedIds:{
            	required:true,
            }
        },
		components: {
            uiListCheck:require("../../../../../components/ui-list-check.vue").default,
            pageDialog:require('../../../../../components/page-dialog.vue').default
        }
	}
</script>

