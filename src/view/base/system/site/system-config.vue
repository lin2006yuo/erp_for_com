<template>
    <div class="p-system-config">
        <tab-form>
            <el-form ref="systemForm">
                <table width="100%" style="border-collapse: collapse;">
                    <tr v-for="item in sysData" :key="item.title">
                        <th>{{item.title}}({{item.name}})</th>
                        <td v-if="item.type===1">
                            <el-input v-model="item.value" style="width: 200px;" class="inline"></el-input>
                            <span>{{item.remark}}</span>
                        </td>
                        <td  v-if="item.type===(2||5)">
                            <el-input
                                    type="textarea"
                                    :autosize="{ minRows: 2, maxRows: 4}"
                                    placeholder="请输入内容"
                                    v-model="item.value" style="width: 360px;" class="inline">
                            </el-input>
                            <span>{{item.remark}}</span>
                        </td>
                        <td v-if="item.type===3">
                          <div v-if="item.choose_type===1">
                                <el-checkbox-group v-model="item.valueTrue" @change="select_checkbox(item.valueTrue)">
                                    <el-checkbox v-for="(data,index) in item.setting"
                                            :key="index"
                                            :label="data.key">{{data.value}}
                                    </el-checkbox>
                                    <div v-for="(data,index) in item.setting" :key="index">
                                    <el-radio-group v-model="data.changeValue" style="margin-top: 15px">
                                      <el-radio v-for="(it,index) in data.child"
                                                :key="it.value"
                                                :label="it.key"
                                                v-if="it.choose_type===0">{{it.value}}</el-radio>
                                    </el-radio-group>
                                    <el-checkbox-group v-model="data.changeValue">
                                      <el-checkbox v-for="(it,index) in data.child"
                                                   :key="it.value"
                                                   :label="it.key"
                                                   v-if="it.choose_type===1">{{it.value}}</el-checkbox>
                                    </el-checkbox-group>
                                    <div v-for="it in data.child" class="inline">
                                      <div v-if="it.type==='1'">
                                        <el-input v-model="it.value" style="width: 200px;" class="inline"></el-input>
                                      </div>
                                      <div v-if="it.type==='2'">
                                        <el-input
                                          type="textarea"
                                          :autosize="{ minRows: 2, maxRows: 4}"
                                          placeholder="请输入内容"
                                          v-model="it.value" style="width: 360px;" class="inline">
                                        </el-input>
                                      </div>
                                    </div>
                                  </div>
                                </el-checkbox-group>
                          </div>
                          <div v-else>
                                <el-radio-group v-model="item.valueTrue">
                                      <el-radio v-for="(data,index) in item.setting"
                                                :key="data.value"
                                                :label="data.key">{{data.value}}
                                      </el-radio>
                                </el-radio-group>
                                <div v-for="(data,index) in item.setting" :key="index" v-if="item.valueTrue===`${data.key}`">
                                        <el-radio-group v-model="data.changeValue" style="margin-top: 15px">
                                          <el-radio v-for="(it,index) in data.child"
                                                    :key="it.value"
                                                    :label="it.key"
                                                    v-if="it.choose_type===0">{{it.value}}</el-radio>
                                        </el-radio-group>
                                        <el-checkbox-group v-model="data.changeValue">
                                          <el-checkbox v-for="(it,index) in data.child"
                                                       :key="it.value"
                                                       :label="it.key"
                                                       v-if="it.choose_type===1">{{it.value}}</el-checkbox>
                                        </el-checkbox-group>
                                        <div v-for="it in data.child" class="inline">
                                                <div v-if="it.type==='1'">
                                                  <el-input v-model="it.value" style="width: 200px;" class="inline"></el-input>
                                                </div>
                                                <div v-if="it.type==='2'">
                                                  <el-input
                                                    type="textarea"
                                                    :autosize="{ minRows: 2, maxRows: 4}"
                                                    placeholder="请输入内容"
                                                    v-model="it.value" style="width: 360px;" class="inline">
                                                  </el-input>
                                                </div>
                                          </div>
                                  </div>
                          </div>
                        </td>
                        <td v-if="item.type===4">
                            <el-checkbox-group v-model="item.value">
                                <el-checkbox  v-for="(it,index) in item.setting"
                                              :key="index"
                                              :label="index">{{it}}</el-checkbox>
                            </el-checkbox-group>
                            <span>{{item.remark}}</span>
                        </td>
                    </tr>
                </table>
                <div class="submit">
                    <permission tag="ElButton" :route="apis.url_system_update"type="primary" @click="submit">提交</permission>
                </div>
            </el-form>
        </tab-form>
    </div>
</template>
<style lang="stylus">
    .el-tab-pane{
        display:block;
    }
</style>
<script>
    import tabForm  from './tab-form.vue'
    import {system_list,system_update,url_system_update} from  "../../../../api/system"
    export default{
    	  permission:{
          url_system_update
        },
        data(){
            return {
                isInit:false,
                tempData:null,
                temp:{},
                childCheckbox:[],
            }
        },
        created(){
        },
        mounted(){
        },
        methods: {
            select_checkbox(val){

            },
            submit(){
                console.log("this.groupId",this.groupId);
                console.log("this.sysData",this.sysData);
                let updateObj = {};
                let childs = {};
                let childData =[];
                let childList =[];
                console.log(this.sysData);
               let newSysData = window.clone(this.sysData);
                newSysData.forEach(data=>{
                    if(data.type===4){
                        data.value=data.value.join(',')
                    }
                  if(data.type===3) {
                        if(data.choose_type===1){
                              data.setting.forEach(item => {
                                  item.child.forEach(param => {
                                        if((data.valueTrue.indexOf(item.key)!==-1&&param.choose_type===0)||(data.valueTrue.indexOf(item.key)!==-1&&param.choose_type===1)){
                                            if (item.changeValue.indexOf(param.key)!==-1) {
                                                  childs = {
                                                    key: param.key,
                                                    value: param.value,
                                                  }
                                                  childList.push(childs);
                                                }
                                        }else if(data.valueTrue.indexOf(item.key)!==-1&&param.choose_type===''){
                                            childs = {
                                              key: param.key,
                                              value: param.value,
                                            }
                                            childList.push(childs);
                                        }
                                  })
                                  updateObj[data.name]={
                                    value:data.valueTrue,
                                    child:childList
                                  }
                              })
                        }else if(data.choose_type===0){
                                data.setting.forEach(item => {
                                          if (item.key === data.valueTrue) {
                                                item.child.forEach(param => {
                                                    if(item.changeValue.indexOf(param.key)!==-1&&param.choose_type===1){
                                                    	childs = {
                                                            key: param.key,
                                                            value: param.value,
                                                          }
                                                          childData.push(childs);
                                                    }else if(param.choose_type===''){
                                                          childs = {
                                                            key: param.key,
                                                            value: param.value,
                                                          }
                                                          childData.push(childs);
                                                    }else if(param.choose_type===0){
                                                          if (item.changeValue === param.key) {
                                                                childs = {
                                                                  key: param.key,
                                                                  value: param.value,
                                                                }
                                                                childData.push(childs);
                                                          }
                                                    }
                                                })

                                          }

                                })
                              }

                          updateObj[data.name]={
                              value:data.valueTrue,
                              child:childData
                          }
                          childData = [];
                          }else{
                                updateObj[data.name]=data.value;
                        }
                });
                this.$http(system_update,this.groupId,updateObj).then(res=>{
                    this.$message({type: "success", message: res.message || res})
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                })
            },
            init(name){
                console.log(`init ${name}  ${this.isInit}`);
                if(!this.isInit){
                    this.isInit = true;
                  this.content_init(name)
                }
            },
            content_init(name){
                this.$http(system_list,name).then(res=>{
                  console.log("res",res);
                this.tempData=res;
            }).catch(code=>{

                })
            }
        },
        filters: {},
        watch: {},
        computed: {
          sysData(){
            if (this.tempData) {
              console.log("computed")
              this.tempData.list.forEach(data => {
                  if(data.valueTrue===undefined){
                      this.$set(data,"valueTrue",'')
                  }else if(data.type===3) {
                      if (data.value === '') {
                          data.valueTrue = '';
                      }
                  }
                  if (data.setting instanceof Array) {
                      if(data.type===3&&data.choose_type===0){
                          console.log("data.value.child",data.value.child);
                          if(data.value.child){
                              data.valueTrue = data.value.value;
                          }else{
                              data.valueTrue = data.value;
                          }
                      }else if(data.type===3&&data.choose_type===1){
                          let itemValue = [];
                          if(data.value instanceof Array){
                              data.value.forEach(res=>{
                                  if(itemValue.indexOf(res.key)===-1){
                                      itemValue.push(res.key);
                                  }else{
                                      itemValue = [];
                                  }
                              })
                          }
                          data.valueTrue = itemValue;
                      }
                      data.setting.forEach(row => {
                          let changeValue = row.changeValue;
                          if (row.changeValue === undefined && row.child.length>0) {
                              this.$set(row, "changeValue", this.childCheckbox);
                          } else {
                              row.changeValue = changeValue;
                          }
                      })
                  }else{
                      data.setting = [];
                  }

              })
              return this.tempData.list
            } else {
              this.systemData.list.forEach(data => {
                    console.log("data.valueTrue",data.valueTrue);
                })
              return this.systemData.list
            }
          },
            groupId(){
                if(this.tempData){
                    return this.tempData.group_id
                }else {
                    return this.systemData.group_id
                }
            }
        },
        props: {
            systemData:{}
        },
        components: {
          tabForm
        }
    }
</script>
