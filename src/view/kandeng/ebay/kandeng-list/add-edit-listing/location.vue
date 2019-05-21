<template>
    <el-row class="c-location">
        <rainbow-header title="商品所在地" background-color="#0DA43D">
            <div class="fr mt-mini mr-sm" slot="header-right">
                <super-select class="inline width-lg"
                              :disabled="modLocationList&&modLocationList.length<=0"
                              @change="change_location"
                              v-model="form.list.mod_location"
                              :options="modLocationList"
                              :placeholder="placeholder"
                              storage-key="modLocationListDetail">
                </super-select>
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
                            <super-select v-model="form.list.country"
                                          :options="filterLocation"
                                          placehilder="输入搜索更多"
                                          storageKey="ebayCountry">
                            </super-select>
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
    import {api_get_combList,api_save_combList,api_edit_combList} from '../../../../../api/ebay-kandeng-public-module';
    export default{
        data(){
            return {
                modLocationList:[],
                dialog:false,
                filterLocation:[],//国家数据格式
            }
        },
        created(){
            this.filterLocation=this.locationList.map(val=>{return{label:val.countrySn,value:val.countrySn}});
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
                     type:"location",
                     id:val,
                 }
                 this.$http(api_edit_combList,params).then(res=>{
                     this.form.list.location = res.location;
                     this.form.list.country = res.country;
                     this.form.set.postal_code = res.post_code;
                 }).catch(code=>{
                    console.log(code);
                 })
            },
            submit(val){
                let type = "location";
                let detail = [];
                let obj = {
                    type:type,
                    model_name:val,
                    location:this.form.list.location,
                    country:this.form.list.country,
                    postal_code:this.form.set.postal_code
                }
                detail.push(obj);
                let params = {
                    type:type,
                    detail:JSON.stringify(obj)
                }
                this.$http(api_save_combList,params).then(res=>{
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
                this.$http(api_get_combList,{type:"location"}).then(res=>{
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
