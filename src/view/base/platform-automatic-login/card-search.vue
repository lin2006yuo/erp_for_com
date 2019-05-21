<template>
   <div>
      <search-card @search="search" :clears="clears" :params="form">
        <div>
            <label-buttons  class="inline" 
                            label="类型：" 
                            v-sf.status 
                            :buttons="buttons" 
                            @select="status_select">
            </label-buttons>
        </div>
          <label-item label="平台类型：">
              <super-select
                      class="s-width-default"
                      v-model="form.relation_module"
                      :storage-key="`relationModule`"
                      :options="relationModule">
              </super-select>
          </label-item>
          <label-item label="平台：" class="ml-sm">
              <super-select
                      class="s-width-default"
                      v-model="form.channel_id"
                      :storage-key="`channelKeylist`"
                      :options="channelList"
                      @change="change">
              </super-select>
          </label-item>
          <label-item label="站点：" class="ml-sm">
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
    import {api_get_channel,api_account_list} from '@/api/platform-automatic-login'
    export default {
        refresh(){
            this.siteOptions=[{label:"",value:""}];
        },
        data() {
            return {
                siteOptions:[{label:"请先选择平台",value:""}],
                channelList:[],
                buttons:[
                    {label:'全部',value:0},
                    {label:'登录',value:1},
                    {label:'验证',value:2},
                ],
                relationModule:[
                    {label:'全部',value:''},
                    {label:'基础资料',value:0},
                    {label:'paypal',value:1},
                    {label:'邮局',value:2},
                    {label:'海卖助手',value:3}
                ]
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
            status_select(val){
                this.$emit("status-select",val)
            }
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
            labelButtons:require('@/components/label-buttons.vue').default,
            labelItem:require('@/components/label-item.vue').default,
            selectRemote:require('@/components/select-remote.vue').default,
        }
    }
</script>

