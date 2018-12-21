<template>
    <page-dialog title="批量修改范本标题" v-model="dialog" @open="open"
                 size="large" :close-on-click-modal="false">
        <el-table
            class="scroll-bar mb-lg"
            highlight-current-row
            :data="tableData"
        >
            <el-table-column label="范本ID" inline-template width="200">
                <ui-tip :content="row.id" :width="95"></ui-tip>
            </el-table-column>
            <el-table-column label="SPU" inline-template width="150">
                <ui-tip :content="row.spu" :width="95"></ui-tip>
            </el-table-column>
            <el-table-column label="范本名称" inline-template>
                <limit-input v-model="row.draft_name"
                             :is-textarea="false"
                             :maxlength="maxLength"
                             :cur-span="22"></limit-input>
            </el-table-column>
        </el-table>
        <label-item label="查找：" class="ml-lg">
            <el-input v-model="searchData" class="width-super"></el-input>
        </label-item>
        <label-item label="替换为：" class="ml-sm">
            <el-input v-model="replaceData" class="width-super"></el-input>
        </label-item>
        <el-button type="primary" size="mini" class="inline ml-sm" @click.native="replace_cur">替换</el-button>
        <div slot="footer">
            <request-button class="inline" :disabled="canUse" reqKey=""
                            @click.native="submit">确定</request-button>
            <el-button size="mini" class="inline" @click.native="dialog = false">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus" scoped>

</style>
<script>
    import {
        api_up_draftname,
    } from '../../../../../api/ebay-kandeng-public-module';
    export default {
        data() {
            return {
                dialog:this.value,
                searchData:"",
                replaceData:"",
                maxLength:32,
            }
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
            }
        },
        methods:{
            open(){
                this.searchData = "";
                this.replaceData = "";
            },
            replace_cur(){
                if(!this.searchData&&!this.replaceData)return this.$message({type:"warning",message:"数据不存在，无法更换"});
                let reg = new RegExp(this.searchData,'g');
                this.tableData.forEach((row,index)=>{
                    if(reg.test(row.draft_name)){
                        row.draft_name = row.draft_name.replace(reg,this.replaceData);
                    }
                    if(index===this.tableData.length-1)this.$message({type:"success",message:"替换成功！"})
                })
            },
            submit(){
                this.$http(api_up_draftname,{data:this.tableData}).then(res=>{
                    this.$message({type:"success",message: res.message || res});
                    this.$emit('change-data',this.tableData);
                    this.dialog = false;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                })
            },
        },
        computed:{
            canUse(){
            	let flag = false;
                this.tableData.forEach((row)=>{
                    if(row.draft_name.length > this.maxLength){
                    	flag = true;
                    	return ;
                    }
                })
                return flag;
            }
        },
        props:{
            value:{},
            tableData:{
                required:true,
                type:Array,
            },
        },
        components: {
            pageDialog:require('../../../../../components/page-dialog.vue').default,
            labelItem:require('../../../../../components/label-item.vue').default,
            uiTip:require('../../../../../components/ui-tip.vue').default,
            limitInput:require('../add-edit-listing/limit-input.vue').default,
        }
    }
</script>
