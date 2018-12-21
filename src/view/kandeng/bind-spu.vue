<template>
    <page-dialog  v-model="show"  title="图片"
                  size="large" :close-on-click-modal="false" class="p-bind-spu">
        <el-row class="mb-xs">
            <el-button @click.native="addlistVisable=true" >添加产品</el-button>
        </el-row>
        <add-goods v-model="addlistVisable" @selected="selected"></add-goods>
        <table class="template" >
            <thead>
            <tr>
                <th>图片</th>
                <th>本地SKU</th>
                <th>SKU别名</th>
                <th >属性1</th>
                <th >属性2</th>
                <th >属性3</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in filterLocal" :key="item.sku">
                <td>
                    <el-popover placement="right" trigger="hover">
                        <img  v-lazy="item.thumb"      width="150px" height="150px">
                        <span   slot="reference"   >
                                  <img v-lazy="item.thumb" height="26px" width="26px" style="border:none">
                            </span>
                    </el-popover>
                </td>
                <td>{{item.sku}}</td>
                <td>{{item.spu_name}}</td>
                <td v-for="attr in 3" > {{get_attr(item,attr)}}</td>
            </tr>
            </tbody>
        </table>
        <el-row>
            <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="page"
                    :page-size="10"
                    class="fr"
                    layout="total, prev, pager, next"
                    :total="localSku.data.length">
            </el-pagination>
        </el-row>
        <el-row>关联产品</el-row>

        <table  class="template" v-if="channelSku.length&&isMultiattribute" style="width: 100%">
            <thead>
            <tr >
                <th style="width: 230px" >平台SKU</th>
                <th   v-for="item in channelSku[0].key " :key="item.name">{{item.name}}</th>
                <th >本地SKU 与 数量</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in channelSku" >
                <td  style="width: 230px">{{item.sku}}</td>
                <td   v-for="field in item.key" :key="field.field">{{item[field.field]}}</td>
                <td style="width: 300px;">
                    <div style="padding: 2px 5px;text-align: left">
                        <div v-for="(local,local_i) in item.local" :key="local_i" class="inline">
                            <el-select v-model="local.local_sku_id"
                                       placeholder="请选择"
                                       @change="change_local(local)"
                                       class="inline width-lg">
                                <el-option
                                        v-for="sku in localSku.data"
                                        :key="sku.id"
                                        :label="sku.sku"
                                        :value="sku.id">
                                </el-option>
                            </el-select>
                            <el-input v-model="local.quantity" class="inline width-xs" placeholder="请输入数量"></el-input>
                            <i class="el-icon-close" @click="del_local(item,local_i)" v-if="item.local&&item.local.length>1"></i>
                        </div>
                        <i class="el-icon-plus" @click="add_bind(item.local)"></i>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
        <template v-for="item in channelSku" v-if="!isMultiattribute">
            <el-form :model="item" label-width="120px">
                <el-form-item label="平台SKU：">{{item.listing_sku}}</el-form-item>
                <el-form-item label="本地SKU/数量：">
                    <div v-for="(local,local_i) in item.local" :key="local_i">
                        <el-select v-model="local.local_sku_id"
                                   placeholder="请选择"
                                   @change="change_local(local)"
                                   class="inline width-lg">
                            <el-option
                                    v-for="sku in localSku.data"
                                    :key="sku.id"
                                    :label="sku.sku"
                                    :value="sku.id">
                            </el-option>
                        </el-select>
                        <el-input v-model="local.quantity" class="inline width-xs" placeholder="请输入数量"></el-input>
                        <div class="delete-icon" @click="del_local(item,local_i)" v-if="item.local&&item.local.length>1"></div>
                        <div class="add-icon" @click="add_bind(item.local)" v-if="item.local.length&&(local_i+1)===item.local.length"></div>
                    </div>
                </el-form-item>
            </el-form>
        </template>
        <div>注意：如某个平台SKU需要关联多个本地SKU，则第一个本地SKU将作为主产品,其余作为捆绑产品</div>
        <div slot="footer">
            <el-button v-if="!isEbay" size="mini"  type="primary"  @click="valids">确定</el-button>
            <el-button v-else size="mini"  type="primary"  @click="valids_ebay">确定</el-button>
            <el-button size="mini" @click.native="show=false">关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus" scoped>
.p-bind-spu{

}
</style>
<script>
    import {api_add_goods} from "../../api/supplier-quote"
    import {api_sku_relation} from "../../api/kandeng"
    export default{
        data(){
            return {
                show:false,
                addlistVisable:false,
                page:1,
            }
        },
        computed:{
            filterLocal(){
                return this.localSku.data.slice((this.page-1)*10,this.page*10)
            }
        },
        methods:{
            del_local(item ,index){
                item.local.splice(index,1)
            },
            valids(){
               let data =this.channelSku.map(row=>{
                  let local=row.local.filter(item=>!!item.local_sku_id).map(item=>item.local_sku_id).sort();
                   return  local.join(',');
               });
               let find=data.find(row=>!!row);
               if(find===undefined) return this.$message({type:'warning',message:"平台SKU必须要绑定一项"});
                    //提交数据
                let datas=this.channelSku.map(row=>{
                    delete  row.key;
                    return row
                }).filter(row=>{
                    let localList = clone(row.local).filter(res=>res.local_sku_id&&res.quantity);
                    return localList.length>0;
                });

                this.$http(api_sku_relation,{data:datas,platform:this.type}).then(res=>{
                    this.$message({type: "success", message: res.message || res});
                    this.show=false;
                    console.log('触发条件');
                    this.$emit("refresh", datas)
                }).catch(code=>{
                    this.$message({type: "error", message: code.message || code})
                })
            },
            valids_ebay(){
                let data =this.channelSku.map(row=>{
                    let local=row.local.filter(item=>!!item.local_sku_id).map(item=>item.local_sku_id).sort();
                    return  local.join(',');
                });
                let find=data.find(row=>!!row);
                if(find===undefined) return this.$message({type:'warning',message:"平台SKU必须要绑定一项"});
                //提交数据
                let datas=this.channelSku.map(row=>{
                    delete  row.key;
                    return row
                }).filter(row=>{
                    let localList = clone(row.local).filter(res=>res.local_sku_id&&res.quantity);
                    return localList.length>0;
                });
                this.$emit("valids-ebay",datas);
            },
            add_bind(item){
                item.push( {local_sku_id:"",good_id:'',sku_id:'',quantity:1,local_sku:''})
            },
            handleCurrentChange(val){
              this.page=val;
            },
            change_local(item){
                let find=this.localSku.data.find(row=>{
                    return row.id===item.local_sku_id;
                });
                if(!!find){
                    item.sku_id=find.sku_id;
                    item.goods_id=find.goods_id;
                    item.good_id=find.goods_id;
                    item.local_sku=find.sku;
                }
            },
            get_attr(item,attr){
                let attrArray=[]
                this.localSku.keys.forEach(row=>{
                        if(item[row]){
                            attrArray.push(row)
                        }
                })
                if(attrArray[attr-1]){
                    return `${attrArray[attr-1]}:${item[attrArray[attr-1]]}`
                }else {
                    return '--'
                }
            },
            selected(val){
              let spu=val.map(row=>row.spu).join(',');
                    this.$http(api_add_goods,{page:1,pageSize:100,snType:'spu',snText:spu}).then(res=>{
                        this.localSku.data=this.localSku.data.concat(res.data);
                        res.keys.forEach(item=>{
                            let find=this.localSku.keys.find(attr=>{
                                return item ===attr;
                            })
                            !find&&this.localSku.keys.push(item);
                        })
                    }).catch(code=>{
                        this.$message({type: "error", message: code.message || code})
                    })
            },
        },
        watch:{
            value(val){
                this.show=val;
            },
            show(val){
                this.$emit('input',val)
            }
        },
        props:{
          value:{},
          localSku:{
              required:true,
              type:Object,
              default(){
                  return {
                      data:[]
                  }
              },
          },
          channelSku:{
              required:true,
              type:Array
          },
          type:{
              required:true,
              type:String
          },
          isEbay:{
              type:Boolean,
              default(){
                 return false
              }
          },
          isMultiattribute:{
              type:Boolean,
              default(){
                  return true
              }
          },
        },
        components: {
            pageDialog:require("../../components/page-dialog.vue").default,
            addGoods:require("./wish/info/add-goods.vue").default
        }
    }
</script>
