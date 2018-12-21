<template>
    <div class="p-search-reply-template">
        <search-card  :params="searchData" @search="search" @enter="search" :clears="clears">
            <el-row>
                <label-buttons label="模板类型：" :buttons="handles" @select="select_handles" class="inline" v-sf.template_type></label-buttons>
                <label-buttons label="平台：" :buttons="boxs" @select="select_boxs" class="inline ml-sm" v-sf.channel_id></label-buttons>
            </el-row>
            <div class="inline">
                <label>{{name}}分组：</label>
                <el-select v-model="searchData.group_id" placeholder="请选择" class="inline  mr-sm s-width-middle" v-sf.group_id>
                    <el-option
                            :key="item.value"
                            v-for="item in teams"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="searchData.search_key" placeholder="请选择" class="inline s-width-default"  v-sf.search_key>
                    <el-option
                            :key="item.value"
                            v-for="item in types"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-input v-model="searchData.search_val" :placeholder="`请输入${changeLabel}...`" class="inline mr-sm" v-sf.search_val></el-input>
                <!--<permission tag="ElButton" :route="apis.url_reply_list" size="mini" @click="search" type="primary" class="inline ml-xs">搜索</permission>-->
                <!--<el-button size="mini" @click="clear" class="inline ml-sm">清空搜索</el-button>-->
            </div>
        </search-card>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {
        api_reply_channel,
        api_reply_types,
        api_reply_team,

        url_reply_list
    } from "../../../api/reply-template"
    export default{
        permission:{
            url_reply_list
        },
        data(){
            return{
                handles:[],
                boxs:[],
                types:[
                    {label:"模板编号",value:"template_no"},
                    {label:"模板名称",value:"template_name"},
                ],
                name:"回复模板",
                teams:[],
                clears:{}
            }
        },
        created(){
            this.get_types();
            this.get_channel();
        },
        mounted(){
            this.clears=clone(this.searchData)
        },
        computed:{
        },
        methods:{
            init_status_btn(){
                let curBtn = this.handles;
                let boxsBtn = this.boxs;
                this.handles = [];
                this.boxs = [];
                this.$nextTick(()=>{
                    this.handles = curBtn;
                    this.boxs = boxsBtn;
                });
            },
            select_handles(val){
                this.name=this.handles[val].name;
                this.searchData.template_type=this.handles[val].value;
                let data={
                    template_type:this.searchData.template_type,
                    channel_id:this.searchData.channel_id
                };
                this.get_team(data);
                this.searchData.group_id="";
                this.$emit("reflash")
            },
            select_boxs(val){
                this.searchData.channel_id=this.boxs[val].value;
                let data={
                    template_type:this.searchData.template_type,
                    channel_id:this.searchData.channel_id
                };
                this.get_team(data);
                this.searchData.group_id="";
                this.$emit("reflash")
            },
            search(){
                this.$emit("reflash")
            },
            clear(){
                this.$emit("clear")
            },
            //获取平台
            get_channel(){
                this.boxs=[];
                this.$http(api_reply_channel).then(res=>{
                this.boxs=res.map(row=>{
                    return {name:row.title,value:row.id}
                });
                }).catch(code=>{
                    console.log(code)
                })
            },
            //获取分组
            get_team(data){
                this.teams=[];
                this.$http(api_reply_team,data).then(res=>{
                    this.teams=res.data.map(row=>{
                        return {
                            value:row.id,
                            label:row.group_name
                        }
                    })
                    this.$emit("change-click",data)
                    this.teams.unshift({label:"全部",value:""})
                }).catch(code=>{
                    console.log(code)
                })
            },
            //获取模板类型
            get_types(){
                this.handles=[];
                this.$http(api_reply_types).then(res=>{
                    this.handles = res.data.map(row=>{
                       return  {
                           name:row.name,
                           value:row.id,
                       }
                   })
                }).catch(code=>{
                    console.log(code)
                })
            }
        },
        filters:{
        },
        watch:{
        },
        computed:{
            changeLabel(){
                let find = this.types.find(res=>{
                    return this.searchData.search_key === res.value;
                });
                if(!!find){
                    return find.label;
                }
            }
        },
        props:{
            searchData:{
                require:true,
                type:Object
            }
        },
        components:{
            labelButtons:require("../../../components/label-all-buttons.vue").default,
            searchCard:require("../../../components/search-card.vue").default
        }
    }
</script>
