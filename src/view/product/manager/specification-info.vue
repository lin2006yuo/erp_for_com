<template>
    <el-row class="c-specification-info">
        <!--编辑状态显示-->
        <div v-if="editAble">
            <card v-for="(items,items_i) in specData"
                  :must-fill="items.required"
                  :label="items.name"
                  :key="items_i">
                <template v-if='show_item(items)'>
                    <el-col class="mb-xs" :span="4"
                            v-if="items.is_alias===0"
                            v-for="(item,index) in get_select(items)"
                            :key="index">
                        <el-checkbox-group v-model="item.selected"
                                           @change.native="change_pro(items,index)"
                                           style="height:27px;line-height:25px;overflow:hidden">
                            <el-checkbox>
                                <span class="color-box" v-if="!(item.icon==='')"></span>
                                <span>{{item.value}}</span>
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-col>
                    <el-col :span="4" v-if="items.is_alias===0">
                        <el-select v-model="items.selectValue"
                                   filterable clearable
                                   @change="change_value(items,$event)"
                                   class="inline width-sm">
                            <el-option
                                    v-for="res in get_options(items)"
                                    :label="res.label"
                                    :value="res.value"
                                    :key="res.value"
                            ></el-option>
                        </el-select>
                    </el-col>
                </template>
                <template v-else>
                    <el-col class="mb-xs"
                            :span="4"
                            v-if="items.is_alias===0"
                            v-for="(item,index) in items.attribute_value"
                            :key="index">
                        <el-checkbox-group v-model="item.selected"
                                           @change.native="change_pro(items,index)"
                                           style="height:27px;line-height:25px;overflow:hidden">
                            <el-checkbox>
                                <span class="color-box" v-if="!(item.icon==='')"></span>
                                <span>{{item.value}}</span>
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-col>
                </template>
                <el-col class="mb-xs" :span="4"
                        v-if="items.is_alias===1&&item.selected"
                        v-for="(item,index) in items.attribute_value"
                        :key="index">
                    <el-checkbox-group v-model="item.selected"
                                       @change.native="change_pro(items,index)"
                                       style="height:27px;line-height:25px;overflow:hidden">
                        <el-checkbox>
                            <span class="color-box" v-if="!(item.icon==='')"></span>
                            <el-input class="inline width-xs"  v-model="item.value"></el-input>
                        </el-checkbox>
                    </el-checkbox-group>
                </el-col>
                <input  class="inline el-input__inner width-xs"
                        v-if="items.is_alias===1"
                        @keyup.enter="add_user_defined(items)"
                        v-model="items.newValue"
                        placeholder="自定义输入框">
            </card>
            <card label=""></card>
        </div>

        <!--产品开发-->
        <div v-if="curPage==='product'">
            <table class="mt-md template" border="1" cellpadding="0" cellspacing="0"
                   style="width:100%;line-height:26px;text-align:center;">
                <tr style="font-weight:600 ;">
                    <th style="padding :2px 5px;width:35px">
                        <el-checkbox v-model="checked"></el-checkbox>
                    </th>
                    <th style="min-width:100px">SKU/SKU别名</th>
                    <th v-for="item in lookspecData.headers " :key="item.name"> {{item.name}}</th>
                    <th style="min-width:140px">采购价/销售价(CNY)</th>
                    <th style="min-width:90px">净重/毛重(g)</th>
                    <th style="min-width:95px">长/宽/高(mm)</th>
                </tr>
                <tbody>
                <tr v-for="(list,index) in  lookspecData.lists" :key="index">
                    <td>
                        <el-checkbox v-model="list.enabled"></el-checkbox>
                    </td>
                    <td style="padding:1px">
                        <ui-input :edit="editAble" v-model="list.sku"
                                  :disabled="true"></ui-input>
                        <ui-input :edit="editAble" v-model="list.alias_sku"
                                  :disabled="!list.enabled"></ui-input>
                    </td>
                    <td v-for="item in lookspecData.headers" :key="item.attribute_id" style="min-width:75px">
                        <el-select :value="get_value(item,list)"
                                   @input="(val)=>{set_value(item,list,val)}"
                                   filterable clearable>
                            <el-option
                                v-for="res in get_value(item,list,'options')"
                                :label="res.value"
                                :value="res.value"
                                :key="res.value"
                            ></el-option>
                        </el-select>
                    </td>
                    <!--采购价/销售价(CNY)-->
                    <td>
                        <ui-input :edit="editAble" v-model="list.cost_price"
                                  @focus="focus_cost_price"
                                  @input="change(index)"
                                  :disabled="!list.enabled"></ui-input>
                        <ui-input :edit="editAble" v-model="list.retail_price" @input="change(index)"
                                  :disabled="!list.enabled"></ui-input>
                    </td>
                    <!--净重/毛重(g)-->
                    <td style="position:relative">
                        <ui-input :edit="editAble" v-model="list.weight" @input="change(index)"
                                  :disabled="!list.enabled"></ui-input>
                        <ui-input :edit="editAble" v-model="list.net_weight" @input="change(index)"
                                  :disabled="!list.enabled"></ui-input>
                        <i v-if='list.weight' style='position:absolute;top:16px;right:11px'
                           @click="sync_weight(list)"
                           class="aircraft-icon" title="同步"></i>
                    </td>
                    <!--长/宽/高(mm)-->
                    <td>
                        <!--长-->
                        <ui-input :edit="editAble" v-model="list.length"
                                  @input="change(index)"
                                  :disabled="!list.enabled"></ui-input>
                        <!--宽-->
                        <ui-input :edit="editAble" v-model="list.width"
                                  @input="change(index)"
                                  :disabled="!list.enabled"></ui-input>
                        <!--高-->
                        <ui-input :edit="editAble" v-model="list.height"
                                  @input="change(index)"
                                  :disabled="!list.enabled"></ui-input>
                    </td>
                </tr>
                <tr>
                    <td :colspan="lineNumber" class="left">
                        <el-button type="primary"
                                   size="mini"
                                   class="mt-mini mb-mini mr-lg fr"
                                   @click.native="add_sku">添加SKU</el-button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>

        <!--商品管理table-->
        <div v-if="curPage==='management'">
            <!--编辑状态下 表格-->
            <table class="mt-md  template "  border="1" cellpadding="0" cellspacing="0"
                   style="width:100%;line-height:26px;text-align:center;" v-if="editAble&&lookspecData.lists&&lookspecData.lists.length>0">
                <tr style="font-weight:600 ;">
                    <th style="padding :2px 5px;width:35px">
                        <el-checkbox v-model="checked"></el-checkbox>
                    </th>
                    <th width="80px">id</th>
                    <th width="80px">sku</th>
                    <!--<th>sku名称</th>-->
                    <th width="180px">sku别名</th>
                    <th width="150px">产品型号</th>
                    <th v-for="item in lookspecData.headers " :key="item.name"> {{item.name}}</th>
                    <th>成本价(RMB)</th>
                    <th>跌价金额(CNY)</th>
                    <th>零售价(USD)</th>
                    <th>净重/毛重(g)</th>
                    <th>商品尺寸长/宽/高(cm)</th>
                    <th>包装尺寸长/宽/高(cm)</th>
                    <th>自动校准</th>
                </tr>
                <tbody>
                <tr v-for="(list,index) in  lookspecData.lists" :key="index">
                    <td>
                        <el-checkbox v-model="list.enabled"></el-checkbox>
                    </td>
                    <th v-copy>{{list.id}}</th>
                    <td>{{list.sku}}</td>
                    <td style="padding:1px">
                        <div v-if="list.alias_sku.length!==0" v-for="(it,i) in  list.alias_sku" :key="i">
                            <el-input :edit="editAble" v-model="list.alias_sku[i]" class="input-width  inline"
                                      @input="change(index)" :disabled="!list.enabled"></el-input>
                            <span class="el-icon-minus  inline"
                                  style="z-index:1000"
                                  v-if='list.enabled'
                                  @click="del_sku_name(i,index)"></span>
                        </div>
                        <span class="el-icon-plus inline"
                              v-if='list.enabled'
                              @click="add_name(index)"></span>
                    </td>
                    <td>
                        <ui-input :edit="editAble" v-model="list.product_type" @input="change(index)"
                                  :disabled="!list.enabled"></ui-input>
                        <!--<span v-if="list.product_type!==''">{{list.product_type}}</span>-->
                    </td>
                    <td v-for="item in lookspecData.headers" :key="item.attribute_id" style="min-width:75px">
                        <el-select :value="get_value(item,list)"
                                   @input="(val)=>{set_value(item,list,val)}"
                                   filterable clearable>
                            <el-option
                                    v-for="res in get_value(item,list,'options')"
                                    :label="res.value"
                                    :value="res.value"
                                    :key="res.value"
                            ></el-option>
                        </el-select>
                    </td>
                    <td style="padding:1px">
                        <ui-input :edit="editAble" v-model="list.cost_price" @input="change(index)" class="inline" style="width:120px"
                                  :disabled="!list.enabled"></ui-input>
                        <el-button v-if="list.enabled" type="primary" size="mini" @click="synchro(['cost_price'],index)">同步</el-button>
                    </td>
                    <td>
                        <el-input v-model="list.discount_value" disabled></el-input>
                    </td>
                    <td style="padding:1px">
                        <ui-input :edit="editAble" v-model="list.retail_price" @input="change(index)" class="inline width-xs"
                                  :disabled="!list.enabled"></ui-input>
                        <el-button v-if="list.enabled" type="primary" size="mini" @click="synchro(['retail_price'],index)">同步</el-button>
                    </td>
                    <td style="padding:1px">
                        <div class="inline" style="width:120px">
                            <ui-input :edit="editAble" v-model="list.net_weight" @input="change(index)" class="inline width-xs"
                                      :disabled="!list.enabled"></ui-input>
                            <ui-input :edit="editAble" v-model="list.weight" @input="change(index)" class="inline width-xs"
                                      :disabled="!list.enabled"></ui-input>
                        </div>
                        <el-button v-if="list.enabled" type="primary" size="mini"  @click="synchro(['net_weight','weight'],index)">同步</el-button>
                    </td>
                    <td style="padding:1px">
                       <div class="inline" style="width:120px">
                           <!--长-->
                           <ui-input :edit="editAble" v-model="list.net_length"
                                     @input="change(index)"
                                     :disabled="!list.enabled"></ui-input>
                           <!--宽-->
                           <ui-input :edit="editAble" v-model="list.net_width"
                                     @input="change(index)"
                                     :disabled="!list.enabled"></ui-input>
                           <!--高-->
                           <ui-input :edit="editAble" v-model="list.net_height"
                                     @input="change(index)"
                                     :disabled="!list.enabled"></ui-input>
                       </div>
                        <el-button v-if="list.enabled" type="primary" size="mini"  @click="synchro(['net_length','net_width','net_height'],index)">同步</el-button>
                    </td>
                    <td>
                        <div class="inline" style="width:120px">
                            <!--长-->
                            <ui-input :edit="editAble" v-model="list.length"
                                      @input="change(index)"
                                      :disabled="!list.enabled"></ui-input>
                            <!--宽-->
                            <ui-input :edit="editAble" v-model="list.width"
                                      @input="change(index)"
                                      :disabled="!list.enabled"></ui-input>
                            <!--高-->
                            <ui-input :edit="editAble" v-model="list.height"
                                      @input="change(index)"
                                      :disabled="!list.enabled"></ui-input>
                        </div>
                        <el-button v-if="list.enabled" type="primary" size="mini"  @click="synchro(['length','width','height'],index)">同步</el-button>
                    </td>
                    <td>
                        <el-switch v-model="list.checkbox"
                                   on-text="启用"
                                   off-text="停用"
                                   @change="calibration(list,$event)"
                                   :disabled="!list.enabled" ></el-switch>
                        <div v-if="list.auto_update_time">{{list.auto_update_time | filterTime}}</div>
                    </td>
                </tr>
                <tr>
                    <td :colspan="lineNumber" class="left">
                        <el-button type="primary"
                                   size="mini"
                                   class="mt-mini mb-mini mr-lg fr"
                                   @click.native="add_sku">添加SKU</el-button>
                    </td>
                </tr>
                </tbody>
            </table>
            <el-button type="primary"
                       v-if="lookspecData.lists&&lookspecData.lists.length<=0&&editAble"
                       size="mini"
                       class="mt-mini mb-mini mr-lg fr"
                       @click.native="add_sku">添加SKU</el-button>
            <!--查看状态-->
            <table class="mt-md template t-center"
                   v-if="!editAble&&lookspecData.lists&&lookspecData.lists.length>0"
                   style="text-align: center;">
                <tr style="font-weight:600 ">
                    <th>id</th>
                    <th>sku编码</th>
                    <!--<th>sku名称</th>-->
                    <th>sku别名</th>
                    <th>产品型号</th>
                    <th v-for="(item,index) in lookspecData.headers " :key="index"> {{item.name}}</th>
                    <th>成本价(RMB)</th>
                    <th>跌价金额(CNY)</th>
                    <th>零售价(USD)</th>
                    <th>净重/毛重(g)</th>
                    <th>商品尺寸长/宽/高(cm)</th>
                    <th>包装尺寸长/宽/高(cm)</th>
                    <th>自动校准</th>
                </tr>
                <tbody>
                <tr v-for="(list,index) in  lookspecData.lists" :key="index">
                    <td>{{list.id}}</td>
                    <td>{{list.sku}}</td>
                    <td>
                        <div>
                            <p v-for="skuname in list.alias_sku" :key="skuname">{{skuname}}</p>
                        </div>
                    </td>
                    <td>{{list.product_type}}</td>
                    <td v-for="(item ,i) in lookspecData.headers" :key="i">
                        {{get_value(item,list)}}
                    </td>
                    <td>
                        <span v-if="list.cost_price !==''">{{parseFloat(list.cost_price).toFixed(2)}}</span>
                    </td>
                    <td>
                        <span>{{list.discount_value}}</span>
                    </td>
                    <td>
                        <span v-if="list.retail_price !==''">{{parseFloat(list.retail_price).toFixed(2)}}</span>
                    </td>
                    <td>
                        <span v-if="list.weight!==''&&list.net_weight!==''">{{parseFloat(list.net_weight).toFixed(2)}}/{{parseFloat(list.weight).toFixed(2)}}</span>
                    </td>
                    <td>
                        <span v-if="list.net_length!==''||list.net_width!==''||list.net_height!==''">
                            {{list.net_length}}/{{list.net_width}}/{{list.net_height}}
                        </span>
                    </td>
                    <td>
                        <span v-if="list.length!==''||list.width!==''||list.height!==''">
                            {{list.length}}/{{list.width}}/{{list.height}}
                        </span>
                    </td>
                    <td>
                        <div>{{list.auto_update_time | filterCheck}}</div>
                        <div v-if="list.auto_update_time">{{list.auto_update_time | filterTime}}</div>
                    </td>
                </tr>
                </tbody>
            </table>
            <div style="width: 100%;height: 100px;"  v-if="!editAble&&(!lookspecData.lists||lookspecData.lists.length===0)">
                <p style="margin: 10px auto;width: 50px">暂无数据</p>
            </div>
        </div>
        <div style="margin:5px 0  0 50px" v-if="!isAdd">
            <div v-if="editAble">
                <permission tag="ElButton" size="mini" type="primary"
                            @click="batch_delete" :route="apis.url_batch_delete">批量删除SKU</permission>
                <request-button req-key="specification" @click="keep_">保 存</request-button>
                <el-button size="mini" @click="cancel_">取 消</el-button>
            </div>
            <el-button size="mini" type="primary" v-else @click="edit">编 辑</el-button>
        </div>
    </el-row>
</template>
<style lang="stylus">
    .c-specification-info {
        .el-checkbox__label {
            display: inline-block;
        }
        .color-box {
            width: 25px;
            height: 25px;
            display: inline-block;
            border: 1px solid #ddd;
            vertical-align: middle;
        }
        .page-card .card-label {
            margin-top: 20px;
        }
        .page-card .body {
            display: inline-block;
        }
        .input-width {
            width: 120px;
        }
        .spec-hidden{
            vertical-align:middle;
            max-width:130px;
            display: inline-block;
            text-overflow: ellipsis;
            word-break: keep-all;
            white-space: nowrap;
            overflow:hidden;
        }
    }
</style>
<script>
    import card from '../../../components/card.vue';
    import uiInput  from "../../../components/ui-input.vue";
    import {api_batch_delete,url_batch_delete} from  "../../../api/product-library"
    export default{
        permission:{
            url_batch_delete,
        },
        data(){
            return {
                showUserDefined:false,
                curValue:"",
            }
        },
        filters:{
            filterCheck(val){
                let date = Number(val);
                if(!Number(val)){
                    return '启用';
                }else{
                    return `停用`;
                }
            },
            filterTime(val){
                return datef('YYYY-MM-dd',Number(val));
            },
        },
        computed: {
            lineNumber(){
                return 10+this.lookspecData.headers.length;
            },
            comHeader:{
                get(){
                   return this.specData.filter(res=>{
                       return !!res.attribute_value.find(row=>row.selected)
                   }).map(res=>{
                       let options = res.attribute_value.filter(res=>res.selected);
                        return {
                            name:res.name,
                            attribute_id:res.attribute_id,
                            options:options
                        }
                    })
                }
            },
            checked:{
                get(){
                    return !this.lookspecData.lists.find(row=>!row.enabled);
                },
                set(val){
                    console.log(val,'val');
                    this.lookspecData.lists.forEach(row=>{
                        this.$set(row,'enabled',val);
                    })
                }
            },
        },
        methods: {
            synchro(arr,index){
                arr.forEach(el=>{
                    this.lookspecData.lists.forEach(ro=>{
                        if(ro.enabled){
                            ro[el]=this.lookspecData.lists[index][el];
                        }
                    })
                })
            },
            focus_cost_price(){

            },
            /*同步净重
            * */
            sync_weight(data){
                if(!data.enabled)return;
                this.lookspecData.lists = this.lookspecData.lists.map(row=>{
                    if(row.enabled)this.$set(row,'weight',data.weight);
                    return row
                });
            },
            calibration(list,val){
                if(val===true){
                    list.auto_update_time = 0;
                }else{
                    let find = this.oldSpecData.find(row=>Number(row.id)===Number(list.id));
                    if(find){
                        if(find.auto_update_time){
                            list.auto_update_time = find.auto_update_time ;
                        }else{
                            list.auto_update_time = new Date().getTime()/1000;
                        }
                    }
                }
            },
            batch_delete(){
                let ids = this.lookspecData.lists.filter(row=>row.enabled).map(row=>row.id);
                if(ids.length<=0)return this.$message({type:'warning',message:'请选择需要删除的sku'});
                this.$confirm('您将删除此产品SKU的状态，确认此操作吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false,
                }).then(() => {
                    this.$http(api_batch_delete,{ids:ids}).then(res => {
                        this.$message({type:'success',message:res.message||res});
                        ids.forEach(row=>{
                            let findIndex = this.lookspecData.lists.findIndex(item=>item.id===row);
                            if(findIndex>-1)this.lookspecData.lists.splice(findIndex,1);
                        });
                    }).catch(code => {
                        this.$message({type:'error',message:code.message||code});
                    })
                });

            },
            get_value(item,list,name){
                 let find = list.attributes.find(row=>parseInt(item.attribute_id)===parseInt(row.attribute_id));
                 if(!!find){
                     if(name==='options'){
                         return find.options;
                     }else{
                         return find.attribute_value||find.value;
                     }
                 }
            },
            set_value(item,list,val){
                 let find = list.attributes.find(row=>parseInt(row.attribute_id)===parseInt(item.attribute_id));
                 find.attribute_value = val;
            },
            show_item(item){
                 let nameList = ['电流','电压','色温','规格','尺码'];
                 let list = nameList.filter(row=>item.name.includes(row));
                 if(list.length>0)return false;
                 return true
            },
            get_select(items){
                 return items.attribute_value.filter(row=>row.selected);
            },
            get_options(items){
                 let list = items.attribute_value.filter(row=>!row.selected).map(res=>{
                     return {
                         label:res.value,
                         value:res.value
                     }
                 });
                 return list;
            },
            change_value(items,val){
                 let find,findIndex = items.attribute_value.findIndex(row=>row.value===val);
                 if(findIndex>-1) find = items.attribute_value.splice(findIndex,1)[0];
                 if(!!find){
                     find.selected = true;
                     items.attribute_value.push(find);
                     items.selectValue = '';
                     this.get_header_options(items,val);
                 }
            },
            change_pro(item,index){
                 let val = item.attribute_value[index].value;
                 this.get_header_options(item,val);
            },
            add_user_defined(items){
                 if(!items.newValue)return this.$message({type:"warning",message:`请填写内容后再点击添加`});
                 let find = items.attribute_value.find(row=>row.value===items.newValue);
                 if(!!find){
                     find.selected = true;
                 }else{
                     let obj = {id:0,icon:"",selected:true,value:items.newValue,attribute_id:items.attribute_id};
                     items.attribute_value.push(obj);
                 }
                 this.get_header_options(items,items.newValue);
                 items.newValue = '';
            },
            add_sku(){
                 let length = this.lookspecData.lists.length;
                 let lastLine = length>0?clone(this.lookspecData.lists[length-1]):{attributes:[]};
                 lastLine.attributes.forEach(row=>{
                     row.attribute_value ='';
                 });
                 let obj = {
                     enabled:true,
                     id:0,
                     sku:'',
                     alias_sku:this.curPage==='product'?'':[],
                     attributes:lastLine.attributes,
                     cost_price:'',
                     retail_price:'',
                     weight:'',
                     length:'',
                     width:'',
                     height:'',
                     checkbox:true,
                     auto_update_time:0,
                 };
                 this.lookspecData.lists.push(obj);
            },
            get_header_options(item,val){
                this.lookspecData.headers = this.comHeader;//获取列表头部
                let firstLine = this.lookspecData.lists[0];
                if(!!firstLine){
                    let attrLength = firstLine.attributes.length;
                    let headerLength= this.lookspecData.headers.length;
                    if(attrLength!==headerLength){
                        this.lookspecData.headers.forEach(res=>{
                            this.lookspecData.lists.forEach(row=>{
                                let findAttr = row.attributes.find(item=>item.attribute_id===res.attribute_id);
                                if(!!findAttr){
                                    findAttr.options = res.options;
                                }else{
                                    let objAttr = {
                                        attribute_value:val,
                                        attribute_id:res.attribute_id,
                                        options:res.options,
                                    };
                                    row.attributes.push(objAttr);
                                }
                            })
                        });
                    }else{
                        let findOption = this.lookspecData.headers.find(row=>parseInt(row.attribute_id)===parseInt(item.attribute_id));//找到对应属性类的下拉框数据
                        if(!!findOption){//若存在下拉框数据，则存在这个属性类
                            this.lookspecData.lists.forEach(row=>{
                                let find = row.attributes.find(res=>parseInt(res.attribute_id)===parseInt(item.attribute_id));
                                if(find){//如果属性类的对应值已存在，更新下拉框的值
                                    find.options = findOption.options;
                                }else{//不存在则添加一个属性类的对应值
                                    let obj = {
                                        attribute_value:val,
                                        attribute_id:item.attribute_id,
                                        options:findOption.options,
                                    };
                                    row.attributes.push(obj);
                                }
                            });
                        }else{//若不存在属性类，则要清除对应值的内容
                            this.lookspecData.lists.forEach(row=>{
                                let index = row.attributes.findIndex(res=>parseInt(res.attribute_id)===parseInt(item.attribute_id));
                                row.attributes.splice(index,1);
                            });
                        }
                    }
                }

            },
            keep_(){
                for (let i of this.lookspecData.lists){
                    if(i.enabled){
                        if(i.net_length==''){
                           return this.$message({type:"info",message:"商品尺寸长必填"})
                        }
                        if(i.net_width==''){
                            return this.$message({type:"info",message:"商品尺寸宽必填"})
                        }
                        if(i.net_height==''){
                            return this.$message({type:"info",message:"商品尺寸高必填"})
                        }
                        if(i.length==''){
                            return this.$message({type:"info",message:"包装尺寸长必填"})
                        }
                        if(i.width==''){
                            return this.$message({type:"info",message:"包装尺寸宽必填"})
                        }
                        if(i.height==''){
                            return this.$message({type:"info",message:"包装尺寸高必填"})
                        }
                    }
                }
                this.$emit("keep")
            },
            cancel_(){
                this.$emit("cancel")
            },
            edit_more(){
                this.$emit("more")
            },
            change(index){
                this.$emit("table-change", index)
            },
            add_name(i){
                this.lookspecData.lists[i].alias_sku.push("");
                this.change(i)
            },
            del_sku_name(i, index){
                this.lookspecData.lists[index].alias_sku.splice(i,1);
                this.change(index)
            },
            edit(){
                this.$emit("edit")
            },
        },
        props: {
            curPage:{
                type:String,
                default(){
                    return 'management';
                }
            },
            lookspecData: {
                default(){
                    return {};
                }
            },
            oldSpecData:{
                type: Array
            },
            specData: {
                required: true,
                type: Array
            },
            editAble: {
                required: true,
                type: Boolean
            },
            isAdd: {
                default(){
                    return false;
                }
            }
        },
        components: {
            card,
            uiInput,
            requestButton:require('@/global-components/request-button.vue').default,
//            uiAutocomplete:require("../../../components/ui-autocomplete.vue").default,
        }
    }
</script>
