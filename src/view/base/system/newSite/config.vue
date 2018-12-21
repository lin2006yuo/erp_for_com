<template>
    <div   class="config-site-p-config">
            <table width="100%" style="border-collapse: collapse;" class="template">
                <tr v-for="item in systemData" :key="item.title">
                    <th style="width: 31%"> <span>{{item.title}}({{item.name}})</span> </th>
                    <td  v-if="item.type===1">
                        <el-input v-model="item.value"  class="inline"></el-input>
                        <span>{{item.remark}}</span>
                    </td>
                    <td  v-if="item.type===2">
                        <el-input
                                type="textarea"
                                :autosize="{ minRows: 2, maxRows: 4}"
                                placeholder="请输入内容"
                                v-model="item.value" style="width: 360px;" class="inline">
                        </el-input>
                        <span>{{item.remark}}</span>
                    </td>
                    <td  v-if="item.type===3">
                        <div v-if="item.choose_type===0&&!is_show(item)">
                            <el-radio-group v-model="item.choose">
                                <el-radio  v-for="radio in item.setting"
                                           :label="radio.value"
                                           :key="radio.value">{{radio.key}}</el-radio>
                            </el-radio-group>
                            <template v-for="radio in item.setting"  >
                                <div v-if="item.choose===radio.value&&radio.child.length>0">
                                        <span v-if="radio.choose_type===1">
                                                <el-checkbox  v-for="child in radio.child"   :key="child.key"  v-model="child.checked">{{child.key}}</el-checkbox>
                                        </span>
                                        <span v-else>
                                             <el-radio-group v-model="radio.choose">
                                              <el-radio  v-for="child in radio.child" :label="child.value" :key="child.value">{{child.key}}</el-radio>
                                             </el-radio-group>
                                        </span>
                                 </div>
                            </template>
                        </div>
                        <div v-else-if="item.choose_type===0&&is_show(item)">
                            <el-switch
                                    @change="change_switch(item,$event)"
                                    v-model="item.choose"
                                    :on-text="item.setting[0].key"
                                    :off-text="item.setting[1].key">
                            </el-switch>
                        </div>
                        <div v-else>
                            <el-checkbox  v-for="child in item.setting" :key="child.key" v-model="child.checked">{{child.key}}</el-checkbox>
                            <template  v-for="child in item.setting"  >
                                <div  v-if="child.checked&&child.child.length>0" >
                                    <span v-if="child.choose_type===1">
                                                <el-checkbox  v-for="child in child.child" :key="child.key"  v-model="child.checked">{{child.key}}</el-checkbox>
                                        </span>
                                    <span v-else>
                                             <el-radio-group v-model="child.choose">
                                              <el-radio  v-for="radio in child.child" :label="radio.value" :key="radio.value">{{radio.key}}</el-radio>
                                             </el-radio-group>
                                        </span>
                                </div>
                            </template>
                        </div>
                    </td>
                </tr>
            </table>
        <div  class="mt-sm ml-sm">
            <permission tag="requestButton"
                        :mintime="300"
                        :route="apis.url_system_update"
                        :request="submit" class="inline">提交</permission>
        </div>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {system_update,url_system_update} from  "../../../../api/system"
    export default{
        permission:{
            url_system_update
        },
        data(){
            return {
            }
        },
        methods: {
            is_show(item){
                let list = ["tort_ebay","tort_amazon","tort_wish","tort_aliexpress","tort_pandao","tort_joom","tort_shopee"];
                return list.includes(item.name);
            },
            change_switch(item,val){
                let title= '';
                if(val===false){
                    title = `您将关闭${item.name}平台侵权商品自动下架，确认该操作吗？`
                }else{
                    title = `您将开启${item.name}平台侵权商品自动下架，确认该操作吗？`
                }
                this.$confirm(`${title}`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    item.choose = val
                }).catch(() => {
                    item.choose = !val;
                });
            },
            submit(){
                let data=[];
                window.clone(this.systemData).forEach(row=>{
                        let  temp={};
                        temp.type=row.type;
                        temp.name=row.name;
                        temp.choose_type=row.choose_type;
                       switch (row.type){
                           case 1:
                            temp.value=row.value;
                                break;
                           case 2:
                               temp.value=row.value;
                               break;
                           case 3:
                               if(row.choose_type){
                                   temp.value=[];
                                    row.setting.forEach(item=>{
                                            if(item.checked){
                                                let child={value:item.value};
                                                if(item.choose_type){
                                                    child.child=item.child.filter(child=> child.checked)
                                                    child.child=child.child.map(child=>{
                                                        return {key:child.key, value:child.value}
                                                    })
                                                    }else {
                                                    if(item.choose){
                                                            let find=item.child.find(child=>{
                                                                return  child.value===item.choose;
                                                            })
                                                        if(!!find){
                                                            child.child=[find]
                                                        }else {
                                                            child.child=[];
                                                        }
                                                    }else {
                                                        child.child=[];
                                                    }
                                                }
                                                temp.value.push(child)
                                            }
                                    })
                               }else {
                                   if(this.is_show(row)){
                                       row.choose = row.choose?'1':'0';
                                   }
                                   if(row.choose){
                                       let find=row.setting.find(item=>{
                                           return  item.value===row.choose
                                       });
                                    if(!!find){
                                           if(find.choose_type){
                                               let childs=find.child.filter(child=>child.checked)
                                               find.child=childs.map(child=>{
                                                   return {
                                                       key:child.key,
                                                       choose_type:child.choose_type,
                                                       value:child.value,
                                                   }
                                               })
                                           }else {
                                               let find2=  find.child.find(child=>{
                                                   return find.choose===child.value
                                               });
                                               find2&&(find.child=[find])
                                               !find2&&(find.child=[])
                                           }
                                        temp.value={value:find.value,child:find.child}
                                    }else {
                                        temp.value=''
                                    }
                                   }else {
                                       temp.value=''
                                   }
                               }
                               break;
                       }
                    data.push(temp);
                });
                let postdata={};
                data.forEach(row=>{
                    postdata[row.name]=row.value
                })
                return this.$http(system_update,this.id,postdata).then(res=>{
                    this.$message({type: "success", message: res.message || res})
                    return Promise.resolve()
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                })
            }
        },
        props: {
            systemData:{},
            id:{},
        },
        components: {
            requestButton:require('../../../../global-components/request-button').default
        }
    }
</script>
