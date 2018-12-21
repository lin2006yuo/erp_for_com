<template>
   <div>
      <search-card @search="search" :clears="clears" :params="form">
          <label-item label="平台：" class="ml-sm">
              <el-select v-model="form.channel_id" v-sf.channel_id class="width-super" @change="change" filterable clearable>
                  <el-option v-for="item in channelList"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value"
                  >
                  </el-option>
              </el-select>
          </label-item>
          <label-item label="站点：" class="ml-xs">
              <el-select :disabled="siteOptions.length<=1"
                         class="s-width-middle"
                         filterable clearable
                         v-model="form.channel_site">
                  <el-option v-for="item in siteOptions"
                             :label="item.label"
                             :value="item.value"
                             :key="item.value">
                  </el-option>
              </el-select>
          </label-item>
      </search-card>
   </div>
</template>

<style scoped>

</style>

<script>
    import {api_get_channel,api_account_list} from '../../../api/platform-automatic-login'
    export default {
        refresh(){
            this.siteOptions=[{label:"",value:""}];
        },
        data() {
            return {
                siteOptions:[{label:"请先选择平台",value:""}],
                channelList:[],
            }
        },
        mounted(){
            this.channel_remote();
        },
        methods: {
            change(val){
                if(!!val){
                    this.siteOptions = [{label: "请选择", value: ""}];
                }else {
                    this.siteOptions=[{label:"请先选择平台",value:""}]
                }
            },
            search(){
                this.$emit("search");
            },
            channel_remote(){
                this.$http(api_get_channel).then(res=>{
                    this.channelList = res;
                    this.channelList.unshift({label:'请选择',value:''})
                }).catch(code=>{
                    this.$message({message:code.message, type:'error'});
                });
            },
            get_site(channel_id){
                if(!channel_id)return this.siteOptions = [{label:"",value:""}];
                this.$http(api_account_list,{channel_id:channel_id}).then(res=>{
                    if(res.site.length<=0){
                        this.siteOptions = [{label:"该平台暂无站点",value:""}]
                    }else{
                        res = res.site;
                        this.siteOptions = [{label:"请选择",value:""},...res];
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
        },
        watch:{
            "form.channel_id"(val) {
                this.form.channel_site = '';
                this.siteOptions = [{label: "请选择", value: ""}];
                this.get_site(val);
            },
        },
        props:{
            form:{},
            clears:{},
        },
        components: {
            searchCard:require('@/components/search-card.vue').default,
            labelItem:require('@/components/label-item.vue').default,
            selectRemote:require('@/components/select-remote.vue').default,
        }
    }
</script>

