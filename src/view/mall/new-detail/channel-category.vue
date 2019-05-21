<template>
    <div class="c-channel-classify">
        <el-form :model="form" label-width="120px" ref="formData">
            <el-form-item label="销售平台状态：">
                <table class="template">
                    <tr>
                        <th v-for="item in form.platform_sale" :key="item.name">{{item.name}}</th>
                    </tr>
                    <tr>
                        <td v-for="item in form.platform_sale" :key="item.name">
                            <el-select v-model="item.value_id" v-if="baseEdit">
                                <el-option
                                        v-for="res in platformList"
                                        :label="res.name"
                                        :value="res.id"
                                        :key="res.id"
                                ></el-option>
                            </el-select>
                            <span v-else>{{get_name(item)}}</span>
                        </td>
                    </tr>
                </table>
            </el-form-item>
            <el-form-item label="平台分类：" required>
                <el-row v-for="(item,i) in form.categoryMap" :key="i" class="mb-xs">
                    <span class="platform-product inline">{{item.label}}</span>
                    <template v-if="baseEdit">
                        <el-button type="primary" size="mini" class="inline" @click.native="edit(item,i)">编辑</el-button>
                        <el-button type="danger" size="mini" class="inline" @click.native="cur_del">删除</el-button>
                    </template>
                </el-row>
                <el-button type="primary" size="mini"
                           class="inline"
                           v-if="baseEdit"
                           @click.native="add_channel_classify">添加平台分类</el-button>
            </el-form-item>
            <el-form-item label="">
                <div class="mt-sm" v-if="baseEdit">
                    <request-button req-key='channelCate' class="inline" @click="keep_edit">确定</request-button>
                    <el-button size="mini" class="inline" @click.native="cancel_edit">取消</el-button>
                </div>
                <el-button type="primary" size="mini"
                           class="inline mt-sm"
                           v-else
                           @click.native="edit_page">编辑</el-button>
            </el-form-item>
        </el-form>
        <add-classify v-model="addDialog"
                      @getclass="mdf_classify"
                      ref="classify"></add-classify>
    </div>
</template>
<style lang="stylus">
    .platform-product{
        max-width: 600px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &:hover{
            cursor: pointer;
        }
    }
</style>
<script>
    import {api_goods_category_map} from '../../../api/product-library';
    export default {
        data() {
            return {
                addDialog:false,
                isAdd:false,
                classify_index:"",
            }
        },
        watch:{
            form(val){
                console.log("form",val);
            }
        },
        methods:{
            get_name(item){
            	let find = this.platformList.find(row=>item.value_id===row.id);
            	if(find){
                    return find.name;
                }
                return item.value;
            },
            edit_page(){
                this.$emit("edit");
            },
            keep_edit(){
                if(this.form.categoryMap.length<=0) return this.$message({type:"warning",message:"平台分类为必填项，请至少添加一条数据"});
                this.$http(api_goods_category_map,this.id,{platform:this.form.categoryMap}).then(res=>{
                    this.$emit("save");
                }).catch(code=>{
                    this.$message({type:"error",message:code.message||code});
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('channelCate', false);
                    }, 300)
                });
            },
            cancel_edit(){
                this.$emit("cancel");
            },
            add_channel_classify(){
                this.isAdd = true;
                this.addDialog = true;
                this.$refs.classify.isAdd=true;
                this.$refs.classify.plat = this.form.categoryMap;
                this.$nextTick(() => {
                    this.$refs.classify.req = []
                });
            },
            edit(item,i){
                this.isAdd = false;
                this.classify_index = i;
                this.$refs.classify.index=i;
                this.$refs.classify.plat=this.form.categoryMap;
                this.$refs.classify.isAdd=false;
                if (item.path && item.path !== "") {
                    this.$refs.classify.req = JSON.parse(item.path);
                } else {
                    this.$refs.classify.req = [];
                }
                this.addDialog = true;
                this.$nextTick(()=>{
                    this.$refs.classify.$refs.addclass.edit()
                })
            },
            cur_del(i){
                this.form.categoryMap.splice(i,1);
            },
            mdf_classify(mdf){
                let length=mdf.length;
                let label = mdf.map(lable=>lable.label);
                let data = {
                    label: label.join(">>"),
                    path: JSON.stringify(mdf),
                    channel_id: mdf[0].id,
                    channel_category_id: mdf[length-1].id
                };

                if(mdf[1].code){
                    data.site_id=mdf[1].id;
                }else {
                    data.site_id=0;
                }

                if (this.isAdd) {
                    this.form.categoryMap.push(data);
                }else {
                    this.form.categoryMap.splice(this.classify_index,1,data);
                }
            },
        },
        props:{
            form:{
                required:true,
            },
            id:{
                required:true,
            },
            platformList:{
                required:true,
            },
            baseEdit:{ //true为编辑，false为查看
                require:true,
            },
        },
        components: {
            addClassify: require("../../product/classify/add-classify.vue").default,
            uiTip:require('../../../components/ui-tip.vue').default,
        }
    }
</script>
