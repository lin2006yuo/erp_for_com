<template>
    <el-row class="p-title-price">
        <div class="p-titleBgcol">
            <span class="p-title-span">基本信息</span>
        </div>
        <div class="p-titleColour-price">
            <el-form :model="singleData" :rules="rules" ref="forms" label-width="159px">
                <el-form-item label="账号简称：" >
                    <el-tag type="success">{{singleData.account_code}}</el-tag>
                </el-form-item>
                <el-form-item label="引用类似产品：" >
                    <el-select :value="spuCate" filterable
                               @input="(val)=>{change_same_spu(val)}" placeholder="请选择" style="width: 200px;">
                        <el-option
                            v-for="(item,i) in singleData.same_spus"
                            :key="i"
                            :label="item.goods_spu"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="产品分类：" required prop="category_id">
                    <el-select :value="singleData.category_id"
                               @input="(val)=>{category_change(val)}" placeholder="请选择" class="inline" style="width: 850px;">
                        <el-option
                            :key="i"
                            v-for="(it,i) in singleData.categoryArray"
                            :label="it.name||it.category_name"
                            :value="it.category_id">
                            <span style="float: left">{{ it.name||it.category_name }}</span>
                            <span style="float: right; font-size: 13px">{{ it.id |cate_from }}</span>
                        </el-option>
                    </el-select>
                    <el-button size="mini" type="primary" @click="open_category" class="inline">选择平台产品分类</el-button>
                    <el-button size="mini" type="primary" @click="set_model" class="inline">设为模板</el-button>
                    <category-dialog v-model="categoryShow" :site=false channel="aliexpress" @submit="submit"></category-dialog>
                </el-form-item>
                <div v-if="singleData.attr_info&&singleData.attr_info.length>0" class="attrs mb-sm">
                    <!-- 品牌 -->
                    <brand v-model="brandshow" :account-id="singleData.account_id" :category-id="categoryId" @brand="get_brand"></brand>
                    <el-form  label-width="160px" >
                        <el-form-item  label="品牌：" class="mt-sm" required prop="brand_id">
                            <el-select v-model="singleData.brand_id" placeholder="请选择" class="inline" style="width:200px">
                                <el-option
                                    :key="i"
                                    v-for="(it,i) in singleData.brand"
                                    :label="it.name_zh"
                                    :value="it.id">
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click.native="click_brand" size="mini">品牌管理</el-button>
                        </el-form-item>
                        <!--控制是否显示，跟随适配机型：v-if="item.attribute_show_type_value&&item.isShow"-->
                        <el-form-item  :label="`${item.names_zh}：`"
                                       v-for="(item,item_i) in  singleData.attr_info"
                                       :key="item_i"
                                       :required="item.required===1"
                                       v-if="item.attribute_show_type_value&&item.isShow">
                            <el-select v-model="item.value" placeholder="请选择" class="inline" style="width:200px"
                                       v-if="item.attribute_show_type_value==='list_box'"  @change="attr_changes(item)">
                                <el-option
                                    :key="i"
                                    v-for="(it,i) in item.list_val"
                                    :label="`${it.name_zh}(${it.name_en})`"
                                    :value="it.id">
                                </el-option>
                            </el-select>
                            <el-input v-model="item.input" style="width:200px"
                                      class="inline"  v-if="item.attribute_show_type_value==='list_box'&&item.value===4"></el-input>
                            <el-input v-model="item.value" style="width:200px"
                                      class="inline"  v-if="item.attribute_show_type_value==='input'"></el-input>
                            <el-input-number size="small"
                                             class="inline"
                                             v-if="item.attribute_show_type_value==='interval'"
                                             v-model="item.value"
                                             :controls="false"
                                             style="width:200px">
                            </el-input-number>
                            <div v-if="item.attribute_show_type_value==='check_box'">
                                <el-row  >
                                    <el-col :span="6" v-for="(box,i) in item.list_val" :key="i">
                                        <el-checkbox v-model="box.isCheck">{{box.name_zh}}({{box.name_en}})</el-checkbox>
                                    </el-col>
                                </el-row>
                            </div>
                        </el-form-item>
                    </el-form>
                    <div class="ml-lg">
                        <hr style="height:1px;border:none;border-top:1px dashed #0066CC;" />
                        <el-row  v-for="(item,attIndex) in  singleData.attr_info"
                                 :key="attIndex"
                                 class="mb-xs"  v-if="!item.attribute_show_type_value">
                            <el-input v-model="item.name" style="width:200px"  class="inline"  ></el-input>
                            <el-input v-model="item.value" :maxlength="70" style="width:200px"  class="inline"  ></el-input>
                            <span>（{{item.value.length}}/70）</span>
                            <el-button type="text" size="mini" @click="del_attr(attIndex)">删除</el-button>
                        </el-row>
                    </div>
                    <el-row class="mb-sm mt-xs">
                        <el-button type="primary" @click="add_attr" class="ml-lg">添加属性</el-button>
                    </el-row>
                </div>
                <el-form-item label="刊登标题：" prop="title" required>
                    <el-input v-model="singleData.title" style="width:850px"  class="inline"  :maxlength="128"></el-input>
                    <span>（{{singleData.title.length}}/128）</span>
                    <el-button size="mini" type="primary" @click="change_up" class="inline">单词首字母大写</el-button>
                    <el-button size="mini" type="primary" @click="optimization" class="inline ml-sm">标题优化</el-button>
                    <title-optimization v-model="optimizationVisable"
                                        :singleData="singleData"
                                        @get-title="get_title"
                                        @get-tags="get_tags"></title-optimization>
                </el-form-item>
                <el-form-item label="最小计量单位："  required prop="productUnit" >
                    <el-select v-model="singleData.productUnit" placeholder="请选择" class="inline" style="width: 200px;">
                        <el-option
                            :key="i"
                            v-for="(item,i) in priceOptions"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="销售方式：" required prop="package_type">
                    <el-radio-group v-model="singleData.package_type" class="inline">
                        <el-radio  :label="0">按{{unitName}}出售</el-radio>
                        <el-radio   :label="1">打包出售</el-radio>
                    </el-radio-group>
                    <span>每包</span>
                    <input type="number"
                           min="2" max="100000"
                           v-model="singleData.lotNum"
                           onchange="if(this.value.length>0){this.value=this.value.replace(/^[^0-9]*|\D/g,'')}"
                           onkeyup="if(this.value.length<=5){this.value=this.value.replace(/\D/g,'')}else if(this.value.length>5){this.value=this.value.replace(/(\s|\S){6,}/g,100000)}"
                           onblur="if(this.value.length===1&&this.value<2){this.value=this.value.replace(/(^[^2-9]|\D){1,}/g,2)}"
                           onafterpaste="if(this.value<1){this.value=this.value.replace(/^[^2-9]*|\D/g,2)}else if(this.value.length>5){this.value=this.value.replace(/\d{6,}/g,100000)}"
                           class="inline"
                           style="width:100px" >
                    <span>{{unitName}}</span>
                </el-form-item>
                <el-form-item label="库存扣减方式：" required prop="reduceStrategy" >
                    <el-radio-group v-model="singleData.reduceStrategy">
                        <el-radio  label="payment_success_deduct">付款减库存</el-radio>
                        <el-radio  label="place_order_withhold">下单减库存</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="尺码表：" v-if="singleData.required_size_model===1" >
                    <el-select v-model="singleData.sizechart_id" placeholder="请选择" class="inline">
                        <el-option
                            :key="i"
                            v-for="(item,i) in singleData.sizes" class="inline"
                            :label="item.name"
                            :value="item.sizechart_id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发货期：" required prop="deliveryTime"  >
                    <el-input-number size="small"
                                     v-model="singleData.deliveryTime"
                                     style="width:200px"
                                     class="inline"
                                     :debounce="0"
                                     :controls="false"
                    >
                    </el-input-number>
                </el-form-item>
                <el-form-item label="产品有效期：">
                    <el-radio  v-model="singleData.wsValidNum" :label="14">14天</el-radio>
                    <el-radio  v-model="singleData.wsValidNum" :label="30">30天</el-radio>
                </el-form-item>
                <el-form-item label="产品分组："  v-if="isTime">
                    <ui-groups v-model="singleData.groupId"
                               :option="singleData.group" ></ui-groups>
                    <!--<ui-groups v-model="singleData.groupId" :option="singleData.group" ></ui-groups>-->
                    <i class="icon-refresh" title="获取最新产品分组" @click="rsync_group"></i>
                </el-form-item>
                <el-form-item label="产品运费模板："  required prop="freightTemplateId" >
                    <el-select v-model="singleData.freightTemplateId" placeholder="请选择" class="inline" style="width: 200px;">
                        <el-option
                            :key="i"
                            v-for="(item,i) in singleData.template"
                            :label="item.template_name"
                            :value="item.template_id">
                        </el-option>
                    </el-select>
                    <i class="icon-refresh" title="获取最新产品运费模板" @click="rsync_transport"></i>
                </el-form-item>
                <el-form-item label="服务模板："  required prop="promiseTemplateId">
                    <el-select v-model="singleData.promiseTemplateId" placeholder="请选择" class="inline" style="width: 200px;">
                        <el-option
                            :key="i"
                            v-for="(item,i) in singleData.server_template"
                            :label="item.template_name"
                            :value="item.template_id">
                        </el-option>
                    </el-select>
                    <i class="icon-refresh" title="获取最新服务模板" @click="rsync_promise"></i>
                </el-form-item>
                <el-form-item label="发货仓库："  >
                    <el-select v-model="singleData.warehouse_id" placeholder="请选择" class="inline" clearable style="width: 200px;">
                        <el-option
                            :key="i"
                            v-for="(item,i) in depot"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="定时刊登：" v-if="isTime">
                    <el-date-picker
                        v-model="singleData.plan_publish_time"
                        type="datetime"
                        placeholder="选择日期"
                        style="width: 200px;"
                        :picker-options="pickerOptions"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="销售员：">
                    <el-select v-model="singleData.salesperson_id" placeholder="请选择" class="inline" clearable style="width: 200px;">
                        <el-option
                            :key="i"
                            v-for="(item,i) in singleData.sales"
                            :label="item.realname"
                            :value="item.seller_id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
    </el-row>
</template>
<style lang="stylus">
    .p-title-price{
        .attrs{
            border: 1px solid #CCCCCC;
            background: #F6F6F6;
        }
        .p-input{
            display: inline-block;
            width: 50px;
        }
        .p-titleBgcol{
            background: #FAECE7;
            .p-title-span{
                color: #FFF;
                font-weight:bold;
                padding: 5px 10px;
                font-size: 1.7rem;
                background: #FFB732;
                display: inline-block;

            }
        }
        .p-titleColour-price{
            padding: 20px;
            border-left: 3px solid #FFB732;
            .el-form-item__error{
                width:200px;
            }
            .el-input--small .el-input__inner{
                height: 26px;
            }
        }
        .icon-refresh{
            display: inline-block;
            height:20px;
            width:20px;
            margin-left:5px;
            vertical-align: middle;
            cursor: pointer;
            background: url("../../../../assets/refresh1.png") no-repeat;
            &:hover{
                background: url("../../../../assets/refresh2.png") no-repeat;
            }
        }
    }
</style>
<script>
    import {
    	api_aliexpress_depot,
        api_aliexpress_productUnit,
        api_aliexpress_sku,
        api_aliexpress_sizeTemp,
        api_ali_save_publish_template,
        api_get_same_spu_attr,
        api_get_same_spu_cate,
        api_rsync_aliexpress_groups,
        api_rsync_aliexpress_transport,
        api_rsync_aliexpress_promise
    } from  "../../../../api/publish-smt"

    export default{
        data(){
            var checkNumber = (rule, value, callback) => {
                if (value===0) {
                    return callback(new Error('请输入大于0的数'));
                }else {
                    callback();
                }
            };
            return {
                priceOptions:[],
                depot:[],
                seller:[],
                brandshow:false,
                pickerOptions:{
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                rules:{
                    category_id:[{required: true, message: '请选择分类', trigger: 'blur,change'}],
                    brand_id:[{required: true, message: '请选择品牌', trigger: 'blur,change'}],
                    title:[{required: true, message: '请输入标题', trigger: 'blur,change'},],
                    productUnit:[{required: true, message: '请输入计量单位', trigger: 'blur ,change，',type:"number"},],
                    package_type:[{required: true, message: '请选择销售方式', trigger: 'blur,change',type:"number" }],
                    reduceStrategy:[{required: true, message: '请选择库存扣减方式', trigger: 'blur,change' }],
                    freightTemplateId:[{required: true, message: '请输入运费模板', trigger: 'blur，change',type:"number"}],
                    promiseTemplateId:[{required: true, message: '请输入服务模板', trigger: 'blur，change',type:"number"}],
                    deliveryTime:[{required: true, message: '请输入发货期', trigger: 'blur',type:"number"}]
                },
                categoryShow:false,
                spuCate: '',
                optimizationVisable:false,
            }
        },
        created(){
        },
        mounted(){
            this.$http(api_aliexpress_depot).then(res=>{
                this.depot=res;
                if(!this.singleData.warehouse_id){
                    this.singleData.warehouse_id=res[0].id;
                }
            }).catch(code=>{
                console.log(code)
            });
            this.$http(api_aliexpress_productUnit).then(res=>{
                this.priceOptions=res;
                if(!this.singleData.productUnit){
                    this.singleData.productUnit=res[0].id;
                }
            }).catch(code=>{
                console.log(code)
            })
        },
        computed: {
            unitName(){
                let find=this.priceOptions.find(row=>{
                    return row.id===this.singleData.productUnit
                })
                if(!!find){
                    return find.name
                }else {
                    return "包"
                }
            },
            categoryId(){
            	return parseInt(this.singleData.category_id);
            },
        },
        methods: {
            get_tags(val){
            	let find = this.singleData.title.indexOf("val");
                if(find>-1){
                    this.$message({type:"warning", message: "已存在"});
                }else{
                    this.singleData.title += ` ${val}`
                }
            },
            get_title(val){
            	this.singleData.title = val;
            },
            optimization(){
            	if(!this.singleData.category_id){
            		this.$message({type:"warning", message:"请先选择分类"});
            		return ;
                }
            	this.optimizationVisable = true;
            },
            change_same_spu(val){
            	this.spuCate = val;
                this.get_spu_attr(val);
                this.get_spu_cate(val);
                this.$emit('get_goods_id',val);
            },
            //获取attr
            get_spu_attr(val){
            	let data = {
                    id:val,
                    goods_id:this.id,
                    account_id:this.singleData.account_id,
                };
                this.$http(api_get_same_spu_attr, data).then(sku=> {
                    if(!sku) { return;}
                    this.organize_data(sku,true);
                }).catch(code=>{
                    this.$message({type: "error", message: code.message || code})
                })
            },
            //引用时
            get_spu_cate(val){
                this.$http(api_get_same_spu_cate, {id:val}).then(res=> {
                	let newCateId = res.category_id+"yin";
                	let obj = {
                        "category_id":newCateId,
                        "name":res.category_name_zh,
                        "id":res.id,
                    };
                    let find = this.singleData.categoryArray.find(row=>{
                    	if(row.category_id===newCateId){
                            if(!!row.id){
                            	return true;
                            }else{
                            	return false;
                            }
                        }else{
                            return false;
                        }
                    })
                    if(!find){
                        this.singleData.categoryArray.unshift(obj);
                    }
                    this.singleData.category_id = newCateId;
                }).catch(code=>{
                    this.$message({type: "error", message: code.message || code})
                })
            },
            click_brand(){
                this.brandshow=true;
            },
            //分组
            rsync_group(){
                this.$http(api_rsync_aliexpress_groups,{account_id:this.singleData.account_id}).then(res=>{
                    this.singleData.group=res.data.map(group=>{
                        let singlegroup={
                            value:group.group_id,
                            label:group.group_name
                        };
                        if(!!group.children){
                            singlegroup.children=group.children.map(child=>{
                                let childs={
                                    value:child.group_id,
                                    label:child.group_name
                                };
                                return  childs
                            })
                        }
                        return  singlegroup
                    });
                    let find = res.data.find(row=>{
                        return row.group_id === this.singleData.groupId
                    });
                    !find&&(this.singleData.groupId= "");
                    this.$message({type:"success",message: res.message || res});
                }).catch(code=>{
                    this.$message({type:"error", message: code.message || code});
                })
            },
            //运费
            rsync_transport(){
                this.$http(api_rsync_aliexpress_transport,{account_id:this.singleData.account_id}).then(res=>{
                    this.singleData.template=res.data;
                    let find = this.singleData.template.find(row=>{
                        return row.template_id ===this.singleData.freightTemplateId
                    })
                    !find&&(this.singleData.freightTemplateId= "");
                    this.$message({type:"success",message: res.message || res});
                }).catch(code=>{
                    this.$message({type:"error", message: code.message || code});
                })
            },
            //同步服务模板
            rsync_promise(){
                this.$http(api_rsync_aliexpress_promise,{account_id:this.singleData.account_id}).then(res=>{
                    this.singleData.server_template=res.data;
                    let find = res.data.find(row=>{
                        return row.template_id ===this.singleData.promiseTemplateId
                    })
                    !find&&(this.singleData.promiseTemplateId= "");
                    this.$message({type:"success",message: res.message || res});
                }).catch(code=>{
                    this.$message({type:"error", message: code.message || code});
                })
            },
            // 修改了分类后的数据
            submit(val){
                if(val instanceof Array){
                    let name = "";
                    let arr = window.clone(val);
                    let newId = arr.length&&arr[arr.length-1].category_id;
                    arr.forEach((row,i) =>{
                        let category_name = "";
                        if(i<arr.length-1){
                            category_name = row.category_name +">>";
                        }else{
                            category_name = row.category_name;
                        }
                        name+=category_name;
                    });
                    let find=this.singleData.categoryArray&&this.singleData.categoryArray.find(x=> {
                        if(x.category_id+'' === newId+''){
                            if(!x.id){
                                return true;
                            }else{
                                return false;
                            }
                        }else{
                            return false;
                        }
                    });
                    !find&&this.singleData.categoryArray.push({
                        "category_id":newId+'',
                        "name":name,
                        "required_size_model":arr[arr.length-1].required_size_model
                    });
                    this.category_change(newId);
                }else{
                    let find=this.singleData.categoryArray&&this.singleData.categoryArray.find(x=> {
                        if(x.category_id+'' === val.category_id+''){
                            if(!x.id){
                                return true;
                            }else{
                                return false;
                            }
                        }else{
                            return false;
                        }
                    });
                    !find&&this.singleData.categoryArray.push({
                        "category_id":val.category_id+'',
                        "name":val.category_name_zh,
                        "required_size_model":val.required_size_model
                    });
                    this.category_change(val.category_id);
                }
                this.categoryShow = false;
            },
            // 处理分类修改后的数据，请求属性
            category_change(value){
            	value += '';
            	if(value.indexOf("yin")===-1){
                    this.singleData.category_id = value+'';
                    this.ajax_sizeTemp(this.singleData.categoryArray);
                    this.ajax_sku();
                    this.spuCate = "";
                }else{
            		let find = this.singleData.categoryArray.find(row=> row.category_id+''===value+'');
            		find&&this.change_same_spu(find.id);
                }
            },
            init(){
            },
            open_category(){
                this.categoryShow=true;
            },
            // 设为模板
            set_model(){
                let flag = true;
                if(!this.singleData.category_id){
                    this.$message({type:"warning", message: '请先选择平台产品分类'});
                    flag = false;
                    return;
                }
                this.singleData.attr_info.forEach(item=>{
                    if(!!item.required){
                        switch(item.attribute_show_type_value){
                            case 'list_box':
                                if(!item.value||(item.value===4&&!item.input)){
                                    this.$message({type:"warning", message: '请填写正确的属性值！'});
                                    flag = false;
                                    return;
                                }
                                break;
                            case 'check_box':
                                let i=0;
                                item.list_val.findIndex(attr=>{
                                    if(!!attr.isCheck){
                                        i++;
                                    }
                                });
                                if(!i){
                                    this.$message({type:"warning", message: '请填写正确的属性值！'});
                                    flag = false;
                                    return;
                                }
                                break;
                            default:
                                if(!item.value){
                                    this.$message({type:"warning", message: '请填写正确的属性值！'});
                                    flag = false;
                                    return;
                                }
                                break;
                        }
                    }
                });
                if(flag){
                    this.$confirm(`您确定将当前SPU及所选平台产品分类，含该分类下的属性、属性值设为模板，以便下次刊登时，系统自动带出该数据吗？`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.singleData.attr = [];
                        this.singleData.attr_info.forEach(attr => {
                            let data_attr = {};
                            if (!attr.attribute_show_type_value && attr.name !== "") {
                                if (attr.value !== "") {
                                    data_attr.attrName = attr.name;
                                    data_attr.attrValue = attr.value;
                                }
                            }
                            if (attr.attribute_show_type_value === "input") {
                                if (attr.value !== "") {
                                    data_attr.attrNameId = attr.id;
                                    data_attr.attrValue = attr.value;
                                }
                            } else if (attr.attribute_show_type_value === "list_box") {
                                if (attr.value !== "") {
                                    data_attr.attrNameId = attr.id;
                                    data_attr.attrValueId = attr.value;
                                    if (attr.value === 4) {
                                        data_attr.attrValue = attr.input;
                                    }
                                }
                            } else if (attr.attribute_show_type_value === "interval") {
                                if (attr.value !== "") {
                                    data_attr.attrNameId = attr.id;
                                    data_attr.attrValue = attr.value;
                                }
                            } else {
                                let ids = [];
                                attr.list_val && attr.list_val.forEach(list => {
                                    if (list.isCheck) {
                                        ids.push(list.id)
                                    }
                                });
                                if (ids.length > 0) {
                                    data_attr.attrValueId = ids;
                                    data_attr.attrNameId = attr.id;
                                }
                            }
                            if (window.objlength(data_attr) !== 0) {
                                this.singleData.attr.push(data_attr)
                            }
                        });
                        let params = {
                            goods_id:this.id,
                            category_id:parseInt(this.singleData.category_id),
                            attr:this.singleData.attr,
                        };
                        this.ajax_set_model(params);
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消'
                        });
                    });
                }
            },
            ajax_set_model(data){
                this.$http(api_ali_save_publish_template, data).then(res=> {
                    this.$message({type:"success",message: res.message || res});
                }).catch(code=>{
                    this.$message({type: "error", message: code.message || code})
                })
            },
            sumbit(){
                let flag=false
                this.$refs.forms.validate((valid) => {
                    if (valid) {
                        flag=true
                    } else {
                        return false;
                    }
                });
                return flag
            },
            last(val){
                if(this.isCopy){  //复制时 选择分类
                    this.$emit("copy",this.singleData.categoryArray);
                    return;
                }
                if(!this.add){  //编辑 选择分类
                    this.$emit("classifys",this.singleData.categoryArray);
                    return;
                }
                this.ajax_sizeTemp(val);
                this.ajax_sku();
            },
            ajax_sizeTemp(newArr){
                if(newArr.length&&newArr[newArr.length-1].required_size_model&&newArr[newArr.length-1].required_size_model===1){
                    this.get_sizeTemp({category_id:parseInt(this.singleData.category_id),  account_id:this.singleData.account_id}).then(res=>{
                        this.$set(this.singeData,"sizes",res||[]);
                        this.$set(this.singeData,"sizechart_id","")
                    }).catch(code=>{
                        this.$message({type:"error", message: code.message || code});
                    })
                }
            },
            ajax_sku(){
                let postData={
                    category_id:parseInt(this.singleData.category_id),
                    goods_id:this.id,
                    account_id:this.singleData.account_id
                }
                this.get_sku(postData).then(sku=>{
                    if(!sku) { return;}
                    this.organize_data(sku,false);
                })
            },
            //处理数据
            organize_data(sku,status){
                let sku_attr_info= sku.sku_attr_info.map(skus => {
                    skus.list_val && skus.list_val.forEach(tags => {
                        tags.disable = false;
                    })
                    skus.is_checked = skus.required||skus.is_checked ? true : false;
                    return skus
                });
                let findDeliveryIndex= sku_attr_info.findIndex(its=>{
                    return its.names_en==='Ships From'
                });
                if(findDeliveryIndex!==-1){
                    this.$set(this.singleData,"delivery",[sku_attr_info[findDeliveryIndex]]);
                    sku_attr_info.splice(findDeliveryIndex,1)
                }else {
                    this.$set(this.singleData,"delivery",[])
                }
                this.$set(this.singleData,"sku_attr_info",sku_attr_info);
                sku.attr_info.attr= sku.attr_info.attr.map(rows=>{
                    if (rows.attribute_show_type_value === "check_box") {
                        rows.list_val = rows.list_val.map(box => {
                            if(rows.default_id&&box.id&&rows.default_id.includes(box.id)){
                                this.$set(box,'isCheck',true);
                            }else {
                                this.$set(box,'isCheck',false);
                            }
                            return box
                        })
                    } else if(rows.attribute_show_type_value === "input"||rows.attribute_show_type_value === "interval"){rows.value = rows.default_value;
                    }else  {
                        rows.value = rows.default_id;
                        if(rows.attribute_show_type_value === "list_box"&&rows.default_value){
                            rows.input=rows.default_value;
                        }
                    }
                    return rows
                });
                let attr_diy=sku.attr_info.diy_attr.map(row=>{
                    return {
                        name:row.attrName,
                        value:row.attrValue,
                    }
                });
                let attr_info=[...sku.attr_info.attr,...attr_diy];
                attr_info.forEach(row=>{
                        if(row.parent_attr_id===0){
                            this.$set(row,'isShow',true);
                        }else{
                            this.$set(row,'isShow',false);
                        }
                });
                this.$set(this.singleData,"attr_info",attr_info);
                this.$set(this.singleData,"brand_required",sku.brand_required);
                let local_attr=sku.local_attr.map(local=>{
                    local.disable=false;
                    return local
                })
                this.$set(this.singleData,"local_attr",local_attr);
                sku.aeopNationalQuoteConfiguration.forEach(it=>{
                    if(it.relative===undefined){
                        this.$set(it,'relative','');
                    }
                    if(it.percentage===undefined){
                        this.$set(it,'percentage','');
                    }
                    if(Math.abs(it.relative)>0||Math.abs(it.percentage)>0){
                        if(it.relative>=0||it.percentage>=0){
                            this.$set(it,"symbol",'0');
                        }else{
                            this.$set(it,"symbol",'1');
                            it.relative<0&&(it.relative = -it.relative);
                            it.percentage<0&&(it.percentage = -it.percentage);
                        }
                    }else{
                        this.$set(it,"symbol",'0');
                    }
                });
                sku.region_group_id_old = sku.region_group_id;
                sku.region_template_id_old = sku.region_template_id;
                sku.configuration_type_old = sku.configuration_type;
                sku.aeopNationalQuoteConfigurationOld = JSON.parse(JSON.stringify(sku.aeopNationalQuoteConfiguration));
                this.$set(this.singleData,'group_region',sku.group_region);
                this.$set(this.singleData,'region_template',sku.region_template);
                this.$set(this.singleData,'region_group_id',sku.region_group_id);
                this.$set(this.singleData,'region_group_id_old',sku.region_group_id_old);
                this.$set(this.singleData,'region_template_id',sku.region_template_id);
                this.$set(this.singleData,'region_template_id_old',sku.region_template_id_old);
                this.$set(this.singleData,'configuration_type',sku.configuration_type);
                this.$set(this.singleData,'configuration_type_old',sku.configuration_type_old);
                this.$set(this.singleData,'aeopNationalQuoteConfiguration',sku.aeopNationalQuoteConfiguration);
                this.$set(this.singleData,'aeopNationalQuoteConfigurationOld',sku.aeopNationalQuoteConfigurationOld);
                this.$set(this.singleData,"quote_config_status",sku.quote_config_status ? true : false);
                let listing_info = sku.listing_info.map(info => {
                    info.isCheck = true;
                    info.ipm_sku_stock=0;
                    info.sku_attributes.forEach(ali => {
                        if (ali.customized_name === 1) {
                            ali.custom_name = "";
//                                ali.custom_pic = "";
                        }
                    })
                    return info
                });
                this.$set(this.singleData,"imgs",sku.imgs);
                this.$set(this.singleData,"listing_info",listing_info);
                this.$set(this.singleData,"brand",sku.brand);
                sku.brand&&!sku.brand.length&&this.$set(this.singleData,"brand_id","");
                if(status){
                    sku.brand&&sku.brand.length&&this.$set(this.singleData,"brand_id",sku.brand_id);
                    this.$set(this.singleData,"freightTemplateId",sku.freight_template_id);
                    this.$set(this.singleData,"promiseTemplateId",sku.promise_template_id);
                    this.$set(this.singleData,"groupId",sku.group_id);
                }
                this.$emit('get-imgs',this.singleData);
            },
            get_sku(data){
                //参数 {goods_id：this.relevanceForm.id,category_id:id}
                return  this.$http(api_aliexpress_sku,data).then(res=>{
                    return  Promise.resolve(res);
                }).catch(code=>{
                    this.$message({type:"error", message: code.message || code});
                })
            },
            get_sizeTemp(data){
                return this.$http(api_aliexpress_sizeTemp, data).then(res => {
                    return Promise.resolve(res);
                }).catch(code => {
                    this.$message({type:"error", message: code.message || code});
                })
            },
            up_first_letter(str){
                return str.substring(0,1).toUpperCase( ) + str.substring(1);
            },
            change_up(){
                if(!this.singleData.title){
                    return
                }
                let name= this.singleData.title.split(/\s+/);
                name= name.map(row=>{
                    row=this.up_first_letter(row)
                    return row;
                });
                this.singleData.title=name.join(' ')
            },
            //添加属性
            add_attr(){
                let i=0;
                this.singleData.attr_info.forEach(row=>{
                    if(!row.attribute_show_type_value){
                        i++
                    }
                })
                if(i<=9){
                    this.singleData.attr_info.push({name:"",value:""})
                }else{
                	this.$message({type:"warning", message: "最多添加10个属性值"});
                }
            },
            // 删除自定义属性
            del_attr(index){
                this.singleData.attr_info.splice(index,1)
            },
            attr_changes(item){
                if(item.value===4){
                    this.$set(item,"input","");
                }
                this.singleData.attr_info.forEach(row=>{
                    if(row.parent_attr_id!==0){
                        if(row.parent_attr_id===item.value){
                            row.isShow = true;
                        }else{
                            row.isShow = false;
                            row.list_val.forEach(val=>{
                                val.isCheck = false;
                            });
                        }
                    }
                });
            },
            // 选择后的品牌
            get_brand(brand,flag){
                switch(flag){
                    case 0:
                        if(brand.length>0){
                            brand.forEach(row=>{
                                let find=this.singleData.brand.find(it=>{
                                    return it.id===row.id
                                });
                                !find&&this.singleData.brand.push(row);
                            });
                        }
                        break;
                    case 1:
                        this.$set(this.singleData,"brand",brand);
                        let find = this.singleData.brand.find(row=>{
                            return this.singleData.brand_id = row.id;
                        })
                        if(!find){
                            this.singleData.brand_id=this.singleData.brand[0].id;
                        }
                        break;
                    default:
                        break;
                }
            }
        },
        filters: {
            cate_from(val){
                return val ? "来自引用" : '';
            },
        },
        watch: {
            'singleData.package_type'(val){
                if(val){
                    if(this.singleData.lotNum<2){
                        this.singleData.lotNum = 2;
                    }
                    if(this.singleData.lotNum>100000){
                        this.singleData.lotNum = 100000;
                    }
                }
            }
        },
        props: {
            singleData:{
                require:true,
                type:Object,
            },
            id:{
                require:true,
                type:Number,
            },
            add:{
                require:true,
                type:Boolean,
            },
            isCopy:{
                required: true,
                type: Boolean
            },
            isTime:{
                default(){
                    return  true;
                }
            },
        },
        components: {
            brand:require("./brand.vue").default,
            classifyTree:require("./classify-tree.vue").default,
            uiGroups:require("../../../../components/ui-groups.vue").default,
            categoryDialog:require("../../ebay/category-dialog.vue").default,
            titleOptimization:require("./title-optimization.vue").default,
        }
    }
</script>
