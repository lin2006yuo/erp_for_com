<template>
    <div class="c-add-category">
        <page-dialog :title="title" v-model="dialog" size="small" :close-on-click-modal="false">
            <el-form :model="form" label-width="150px" :rules="rules" ref="curForm">
                <el-form-item label="类型：">
                    <el-select class="inline width-super" v-model="form.type" filterable clearable>
                        <el-option
                            v-for="item in selectData"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名称分类：" prop="model_name">
                    <el-input class="inline width-super" v-model="form.model_name"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <permission tag="ElButton"
                            :route="apis.url_save_cateList"
                            type="primary"
                            size="mini"
                            class="inline"
                            @click.native="submit">确认</permission>
                <el-button size="mini" class="inline" @click.native="cancel">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import{api_save_cateList,url_save_cateList} from '../../../../api/ebay-kandeng-public-module';
    export default{
        permission:{
            url_save_cateList
        },
        data(){
            return {
                dialog:this.value,
                selectData:[
                    {label:"listing分类",value:1},
                    {label:"范本分类",value:2},
                ],
                rules:{
                    'model_name':[
                        {required:true,message:"名称分类为必填项",trigger:"change,blur"}
                    ]
                }
            }
        },
        watch:{
            dialog(val){
                this.$emit("input",val);
            },
            value(val){
                this.dialog = val;
            }
        },
        methods:{
            submit(){
                this.$refs.curForm.validate((bool)=>{
                    if(bool){
                        let clone =window.clone(this.form);
                        let detail = [];
                        detail.push(clone);
                        let params = {
                            model_type: "cate",
                        };
                        params.detail = JSON.stringify(detail);
                        return this.$http(api_save_cateList, params).then(res => {
                            this.$emit("submit",clone,res.data);
                            this.$message({
                                type: "success",
                                message: res.message ||res
                            });
                            this.dialog = false;
                            return Promise.resolve();
                        }).catch(code => {
                            this.$message({
                                type: "error",
                                message: code.message || code
                            })
                        })
                    }
                });
            },
            cancel(){
                this.dialog = false;
            },
        },
        props:{
            value:{},
            form:{},
            title:{}
        },
        components: {
            pageDialog:require('../../../../components/page-dialog.vue').default,
        }
    }
</script>
