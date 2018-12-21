<template>
    <el-row class="c-location">
        <rainbow-header title="商品所在地" background-color="#0DA43D">
            <div class="fr mt-mini mr-sm" slot="header-right">
                <el-select class="inline width-lg"
                           :placeholder="placeholder"
                           v-model="form.list.mod_location"
                           :disabled="modLocationList&&modLocationList.length<=0"
                           @change="change_location"
                           filterable clearable>
                    <el-option
                        v-for="item in modLocationList"
                        :label="item.label"
                        :value="item.value"
                        :key="item.value"
                    ></el-option>
                </el-select>
                <el-button class="inline" type="primary" size="mini" @click.native="save_as">另存为</el-button>
            </div>
            <el-form :model="form" label-width="220px">
                <el-form-item label="商品所在地：" required>
                    <el-row>
                        <el-col :span="commonSpan">
                            <el-input v-model="form.list.location"></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="国家：" required>
                    <el-row>
                        <el-col :span="commonSpan">
                            <el-select v-model="form.list.country" filterable clearable>
                                <el-option v-for="item in locationList"
                                           :label="item.countrySn"
                                           :value="item.countrySn"
                                           :key="item.countrySn"
                                ></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="邮编：">
                    <el-row>
                        <el-col :span="commonSpan">
                            <el-input v-model="form.set.postal_code"></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
        </rainbow-header>
        <save-as v-model="dialog" @submit="submit"></save-as>
    </el-row>
</template>
<style lang="stylus" scoped>
</style>
<script>
    import {api_common_modeList,api_save_common_model,api_edit_model} from '../../../../../api/ebay-kandeng-public-module';
    export default{
        data(){
            return {
                modLocationList:[],
                dialog:false,
            }
        },
        created(){
            this.get_mode_location();
        },
        computed:{
            surplusCom(){
                return Number(23-this.commonSpan);
            },
            surplusLar(){
                return Number(23-this.largeSpan);
            },
            placeholder(){
                if(this.modLocationList.length<=0){
                    return "暂无数据";
                }else{
                    return "选择已有模板";
                }
            }
        },
        methods:{
            change_location(val){
                if(!val){
                    this.form.list.location = "";
                    this.form.list.country = "";
                    this.form.set.postal_code = "";
                    return;
                }
                 let params = {
                     model_type:"location",
                     id:val,
                 }
                 this.$http(api_edit_model,params).then(res=>{
                     this.form.list.location = res.data.location;
                     this.form.list.country = res.data.country;
                     this.form.set.postal_code = res.data.post_code;
                 }).catch(code=>{
                    console.log(code);
                 })
            },
            submit(val){
                let model_type = "location";
                let detail = [];
                let obj = {
                    type:model_type,
                    model_name:val,
                    location:this.form.list.location,
                    country:this.form.list.country,
                    postal_code:this.form.set.postal_code
                }
                detail.push(obj);
                let params = {
                    model_type:model_type,
                    detail:JSON.stringify(detail)
                }
                this.$http(api_save_common_model,params).then(res=>{
                    this.$message({
                        type:"success",
                        message:res.message||res,
                    })
                    this.dialog = false;
                    this.get_mode_location();//刷新商品所在地的数据
                }).catch(code=>{
                    this.$message({
                        type:"success",
                        message:code.message||code
                    })
                })
            },
            /*商品所在地*/
            get_mode_location(){
                this.$http(api_common_modeList,{model_type:"location"}).then(res=>{
                    this.modLocationList = res.data.map(row=>{
                        return {
                            label:row.model_name,
                            value:row.id
                        }
                    });
                }).catch(code=>{
                    console.log(code);
                })
            },
            save_as(){
                this.dialog = true;
            }
        },
        props:{
            form:{},
            locationList:{
                required:true,
                type:Array
            },
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
            saveAs:require('./save-as.vue').default,
            rainbowHeader:require('@/components/rainbow-header.vue').default,
        }
    }
</script>