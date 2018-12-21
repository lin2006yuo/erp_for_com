<template>
    <el-row class="c-others">
        <rainbow-header title="其他" background-color="#920784">
            <el-form :model="form" label-width="220px">
                <el-form-item label="Listing分类：">
                    <el-row>
                        <el-col :span="commonSpan">
                            <el-select v-model="form.list.listing_cate" filterable clearable>
                                <el-option
                                        v-for="item in listingList"
                                        :label="item.model_name"
                                        :value="item.value"
                                        :key="item.id"
                                ></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="范本分类：">
                    <el-row>
                        <el-col :span="commonSpan">
                            <el-select v-model="form.list.model_cate" filterable clearable>
                                <el-option
                                        v-for="item in modelCateList"
                                        :label="item.model_name"
                                        :value="item.value"
                                        :key="item.id"
                                ></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
        </rainbow-header>
    </el-row>
</template>
<style lang="stylus" scoped>
</style>
<script>
    import {api_common_modeList} from '../../../../../api/ebay-kandeng-public-module';
    export default{
        data(){
            return {
                modelCateList:[],
                listingList:[]
            }
        },
        created(){
            this.get_modelList();
        },
        methods:{
            get_modelList(){
                this.$http(api_common_modeList,{model_type:"cate"}).then(res=>{
                    if(res.data.length>0){
                        this.listingList = [];
                        this.modelCateList = [];
                        res.data.forEach(row=>{
                            let cur;
                            if(row.type===1){
                                cur = {
                                    model_name:row.model_name,
                                    value:row.model_name
                                }
                                this.listingList.push(cur);
                            }else if(row.type===2){
                                cur = {
                                    model_name:row.model_name,
                                    value:row.model_name
                                }
                                this.modelCateList.push(cur);
                            }
                        })
                    }
                }).catch(code=>{
                    console.log(code);
                })
            }
        },
        props:{
            form:{},
            commonSpan:{
                require:true,
                type:Number
            },
            largeSpan:{
                require:true,
                type:Number
            }
        },
        components: {
            rainbowHeader:require('@/components/rainbow-header.vue').default,
        }
    }
</script>