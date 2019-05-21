<template>
    <div class="p-batch-publish">
        <page-dialog title="从产品库批量刊登" size="full" @open="open" v-model="show" :close-on-click-modal="false">
            <el-form :model="form" :rules="rules" ref="ruleForm" label-width="90px">
                <el-form-item label="平台账号：" class="inline" required  prop="account">
                    <el-select v-model="form.account"
                               class="inline"
                               filterable
                               @change="selected_account"
                               placeholder="请选择类型">
                        <el-option
                                :key="item.id"
                                v-for="item in options"
                                :label="item.code"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发货仓库：" class="inline">
                    <el-select v-model="form.depot"
                               class="inline"
                               placeholder="请选择"
                               @change="selected_depot">
                        <el-option
                                :key="item.name"
                                v-for="item in warehouseList"
                                :label="item.name"
                                :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="定时刊登：" class="inline">
                    <el-date-picker
                            v-model="form.cron_time"
                            type="datetime"
                            class="inline date"
                            placeholder="选择日期"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="销售员：" class="inline">
                    <span>{{form.realname}}</span>
                </el-form-item>
            </el-form>
            <el-row class="mt-sm mb-xs">
                <el-button size="mini" type="primary"  class="inline"
                           @click.native="addlistVisable=true">从产品库添加产品</el-button>
            </el-row>
            <publish-img v-model="picVisable" @submit="mdf_img"
                         :channel="3" :id="ids" :multiple="false"></publish-img>
            <add-goods v-model="addlistVisable" @selected="selected"></add-goods>
            <ui-table :has-data="tableData.length>0"
                      v-loading="loadingAll"
                      element-loading-text="玩命加载中..."
                      :body-height="550"
                      :isFix="true"
                      v-model="checkAll" @check="checkAllBox"
                       :heads="[
                        {isCheck:true,width:2},
                        {label:'本地SPU/图片',width:8},
                        {label:'刊登标题/标签/描述',width:26},
                        {label:'本地SKU',width:6},
                        {label:'展图',width:4},
                        {label:'颜色',width:8},
                        {label:'尺寸',width:9},
                        {label:'吊牌价',width:5},
                        {label:'销售价',width:5},
                        {label:'数量',width:5},
                        {label:'发货期',width:12},
                        {label:'运费',width:5},
                        {label:'操作',width:4}
                       ]">
                <tr>
                    <!--checkbox-->
                    <th></th>
                    <!--本地SPU/图片-->
                    <th></th>
                    <!--刊登标题/标签/描述-->
                    <th></th>
                    <!--本地SKU-->
                    <th></th>
                    <!--展图-->
                    <th></th>
                    <!--颜色-->
                    <th>
                        <ui-autocomplete
                                class="inline"
                                v-model="mdfColor"
                                :fetch-suggestions="querySearch"
                                placeholder="请输入内容"
                                @blur="blur_change('color',mdfColor)"
                        ></ui-autocomplete>
                    </th>
                    <!--尺寸-->
                    <th>
                        <el-input v-model="mdfSize"
                                  @blur="blur_change('size',mdfSize)"
                                  class="inline"
                                  style="width:90px"
                        ></el-input>
                        <el-button size="mini"
                                   @click="change_mdfSize(mdfSize)"
                                   type="primary" class="inline" >选择</el-button>
                    </th>
                    <!--吊牌价-->
                    <th>
                        <ui-limit-number v-model="msrp"
                                         :limit="2" @blur="blur_change('msrp',msrp)"
                                         class="inline"></ui-limit-number>
                    </th>
                    <!--销售价-->
                    <th>
                        <ui-limit-number v-model="price"
                                         :limit="2" @blur="blur_change('price',price)"
                                         class="inline"></ui-limit-number>
                    </th>
                    <!--数量-->
                    <th>
                        <integer-zero-input v-model="inventory"
                                            :min="0" class="inline"
                                            @blur="blur_change('inventory',inventory)"></integer-zero-input>
                        <!--<integer-input v-model="inventory"-->
                                       <!--:min="0" @blur="blur_change('inventory',inventory)"-->
                                       <!--class="inline"></integer-input>-->
                    </th>
                    <!--发货期-->
                    <th>
                        <integer-input v-model="b_shipping_time"
                                       @blur="blur_change('b_shipping_time',b_shipping_time)"
                                       class="inline" :min="1" style='width:80px !important'></integer-input>&nbsp;-&nbsp;<integer-input
                            v-model="e_shipping_time"
                            @blur="blur_change('e_shipping_time',e_shipping_time)"
                            :min="1" width="50px" class="inline" style='width:80px !important'></integer-input>
                    </th>
                    <!--运费-->
                    <th>
                        <ui-limit-number v-model="shipping"
                                         :limit="2" @blur="blur_change('shipping',shipping)"
                                         class="inline mb-mini"></ui-limit-number>
                    </th>
                    <!--操作-->
                    <th>
                        <span class="operate" @click="delete_all">删除</span>
                    </th>
                </tr>
                <template v-for="(row,index)  in tableData">
                    <tr>
                        <td><el-checkbox v-model="row.isCheck" @change="checkBox(row)"></el-checkbox></td>
                        <!--本地SPU/图片-->
                        <td>
                            <div class="mt-xs">{{row.parent_sku}}</div>
                            <div class="mb-xs">
                                <img v-if="row.images&&row.images.length>0" :src="get_path(row.images[0].path,'_100x100.',row.baseUrl)" height="100px" width="100px">
                                <el-button type="primary"
                                           size="mini"
                                           @click.native="mdf_imgs(row,index)"
                                           class="inline">添加图片</el-button>
                            </div>
                        </td>
                        <!--刊登标题/标签/描述-->
                        <td class="t-left">
                            <div class="public-style"
                                 title="双击更改标题"
                                 @dblclick='dbl_mdf("name",row)'>
                                <template v-if="!row.showInput">
                                    <span v-if="!!row.name">{{row.name}}</span>
                                    <span v-else>点击添加标题</span>
                                </template>
                                <template v-else>
                                    <limit-input
                                            @blur-change="blur_name(row,$event)"
                                            v-model="row.name"
                                            :is-textarea="true"
                                            :show-number="false"
                                            :custom-autosize="{minRows: 2, maxRows: 4}"
                                            :maxlength="9999"
                                            :cur-span="23"
                                    ></limit-input>
                                </template>
                            </div>
                            <div class="public-style tag-box-dotted"
                                 :title="row.tags.length>0?'双击修改标签':''"
                                 @dblclick='dbl_mdf("tags",row)'>
                                <template v-if="row.tags.length>0">
                                    <el-tag class="mr-xs mb-mini"
                                            type="success"
                                            v-for="item in row.tags" :key="item.name">{{item.name}}</el-tag>
                                </template>
                                <span v-else class="forbid-choose">双击添加标签</span>
                            </div>
                            <div class="public-style"
                                 :title="!!row.description?'双击修改描述':''"
                                 @dblclick='dbl_mdf("description",row)'>
                                <span v-if="row.description!==''">{{row.description | filterDes}}</span>
                                <span v-else class="forbid-choose">双击添加描述</span>
                            </div>
                        </td>
                        <!--本地SKU-->
                        <td>
                            <template v-for="res in row.variant">
                                <div class="mb-mini local-sku" v-copy>{{res.sku}}</div>
                            </template>
                        </td>
                        <!--展图-->
                        <td>
                            <template v-for="res in row.variant">
                                <div>
                                    <img :src="get_path(res.main_image,'_100x100.',row.baseUrl)"  height="26px" width="26px">
                                    <i class="el-icon-edit vertical_super" @click="mdf_child_imgs(row,res)"></i>
                                </div>
                            </template>
                        </td>
                        <!--颜色-->
                        <td class="relative">
                            <template v-for="res in row.variant">
                                <!--<el-input v-model="res.color" class="inline mb-mini"></el-input>-->
                                <ui-autocomplete
                                        class="inline mb-mini"
                                        v-model="res.color"
                                        :fetch-suggestions="querySearch"
                                        placeholder="请输入内容"
                                        @blur="color_blur(res)"
                                        @select="handleSelect(res)"
                                ></ui-autocomplete>
                                <error-icon-tips :content="colorContent"
                                                 v-if="res.error_color"
                                                 class="mb-mini"
                                                 width="200"
                                                 placement="right"></error-icon-tips>
                            </template>
                        </td>
                        <!--尺寸-->
                        <td class="relative">
                            <template v-for="res in row.variant">
                                <el-input v-model="res.size"
                                          @blur="size_blur(res)"
                                          class="inline mb-mini"
                                          @input="color_input(res)"
                                          style="width:90px"
                                ></el-input>
                                <el-button size="mini"
                                           @click="change_size(res)"
                                           type="primary" class="inline mb-mini">选择</el-button>
                                <error-icon-tips :content="sizeContent"
                                                 v-if="res.error_size"
                                                 class="move-right mb-mini"
                                                 width="250"
                                                 placement="right"></error-icon-tips>

                            </template>
                        </td>
                        <!--吊牌价-->
                        <td>
                            <template v-for="res in row.variant">
                                <ui-limit-number v-model="res.msrp" :limit="2" class="inline mb-mini"></ui-limit-number>
                            </template>
                        </td>
                        <!--销售价-->
                        <td>
                            <template v-for="res in row.variant">
                                <ui-limit-number  v-model="res.price" :limit="2" class="inline mb-mini"></ui-limit-number>
                            </template>
                        </td>
                        <!--数量-->
                        <td>
                            <template v-for="res in row.variant">
                                <integer-zero-input v-model="res.inventory"
                                                    :min="0" class="inline mb-mini"></integer-zero-input>
                            </template>
                        </td>
                        <!--发货期-->
                        <td>
                            <div v-for="res in row.variant" class="mb-mini">
                                <integer-input v-model="res.shipping_time[0]"
                                               class="inline" :min="1" style='width:80px !important'></integer-input>&nbsp;-&nbsp;<integer-input
                                    v-model="res.shipping_time[1]"
                                    :min="1" width="50px" class="inline" style='width:80px !important'></integer-input>
                            </div>
                        </td>
                        <!--运费-->
                        <td>
                            <template v-for="res in row.variant">
                                <ui-limit-number v-model="res.shipping" :limit="2" class="inline mb-mini"></ui-limit-number>
                            </template>
                        </td>
                        <td>
                            <span  class='operate'
                                   @click="del_spu(index)">删除</span>
                        </td>
                    </tr>
                </template>
            </ui-table>
            <mdf-tags v-model="mdfTagsDialog"
                      :form="curRow"
                      :title="curTitle"
                      :module="curModule"></mdf-tags>
            <mdf-img v-model="showSpuImg"
                     :goodsId="ids"
                     :img-form="spuTemplate"
                     :show-tips="false"
                     :img-number="20"
                     @mdfimg-submit="mdfimg_submit"
                     :base-url="baseUrl"></mdf-img>
            <wish-size  v-model="sizeVisable"
                        :add="true"
                        @selected="selecte_size" ></wish-size>
            <div slot="footer" class="dialog-footer">
                <request-button
                    :mintime="200"
                    req-key="valids_submit"
                    @click.native="valids">保存并刊登到平台</request-button>
                <request-button
                    :mintime="200"
                    req-key="valids_submit"
                    v-if="tableData.length>0"
                    @click.native="save_as_draft">保存为草稿</request-button>
                <el-button size="mini" @click.native="show=false">关   闭</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .local-sku{
        height:26px;
        line-height:26px;
        &:hover{
            color:#1d8ce0;
            cursor:default;
        }
    }
    .move-right{
        >.error-icon{
            right:58px !important;
        }
    }
    .vertical_super{
        vertical-align:super;
    }
    .public-style{
        padding:5px 8px;
        transition:all .2s;
        cursor:default;
        &:hover{
            background-color:#B9E7FF;
        }
    }
    .tag-box-dotted{
        border-top:1px dashed #ddd;
        border-bottom:1px dashed #ddd;
    }

</style>
<script>
    import {warehouse_type} from "../../../../api/product_create";
    import {api_wish_color,
        api_wish_channel,
        api_product_getData,
        api_wish_saveMany,
        api_wish_product_save} from "../../../../api/kandeng";
    import {get_path} from '../../ebay/kandeng-list/add-edit-listing/get-path';
    export default{
        data(){
            let check=(rule, value, callback)=>{
                if(!value[0]&&!value[1]){
                    return callback(new Error('请输入交期'));
                }else {
                  return  callback();
                }
            };
            return {
                loadingAll:false,
                colorContent:['缺少颜色值或颜色值有误！','提示：请添加或更正颜色值，可增加或减少单词间的空格、更改单词大小写、或检查单词拼写是否有误，以快速更正错误。'],
                sizeContent:['缺少尺寸值或尺寸值有误！','请添加或更正当前尺寸值'],
                sizeVisable:false,
                mdfColor:"",
                mdfSize:"",
                b_shipping_time:"",
                e_shipping_time:"",
                inventory:"",
                price:"",
                msrp:"",
                shipping:"",
                baseUrl:"",
                curRow:{},
                curTitle:"",
                curModule:"",
                mdfTagsDialog:false,
                mdfDesDialog:false,
                checkAll:false,
                ids:0,
                showSpuImg:false,
                imgIndex:0,
                tempData:{},
                spuTemplate:{},
                picVisable:false,
                show:false,
                addlistVisable:false,
                form:{
                    account:"",
                    depot:"中山仓",
                    realname:"",
                    cron_time:"",
                },
                tableData:[],
                oldData:[],
                options:[],
                warehouseList:[],
                rules:{
                    account:[ { required: true, message: '请选择账号', trigger: 'blur,change',type:"number" },],
                    time:[{validator: check, trigger: 'blur,change'}],
                    number:[
                        {type:'number',required:true,message:"可售数为必填项，请补充完整",trigger:'change'}
                    ]
                },
                cron_time:"",
                colors:""
            }
        },
        mounted(){
            this.$http(warehouse_type).then(res=>{
                this.warehouseList=res;
            }).catch(code=>{
                console.log(code)
            });
            this.$http(api_wish_channel).then(res=>{
                this.options=res.data;
            }).catch(code=>{
                console.log(code)
            });
            this.get_colors();
        },
        methods: {
            open(){
                this.tableData=[];
                this.form = {
                    account:"",
                    depot:"中山仓",
                    realname:"",
                    cron_time:"",
                }
            },
            get_path,
            mdfimg_submit(val){
                this.curRowImage.images = val.path;
            },
            delete_all(){
                this.$confirm(`此操作将会删除表格中所有的产品数据，确认进行此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false,
                }).then(() => {
                    this.tableData = [];
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            save_as_draft(){//保存为草稿箱
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        let params = this.get_params(true);
                        this.$http(api_wish_saveMany,params).then(res=>{
                            this.$message({type:"success",message:res.message||res});
                            this.show = false;
                        }).catch(code=>{
                            this.$message({type:"warning",message:code.message||code});
                        }).finally(()=>{
                            setTimeout(()=>{
                                this.$reqKey('valids_submit',false);
                            },200);
                        });
                    } else {
                        this.$reqKey('valids_submit',false);
                        return false;
                    }
                });
            },
            blur_change(name,val){
                if(!val)return;
                this.tableData.forEach(row=>{
                    if(row.isCheck){
                        row.variant.forEach(res=>{
                            if(name==='b_shipping_time'){
                                res.shipping_time.splice(0,1,val);
                            }else if(name==='e_shipping_time'){
                                res.shipping_time.splice(1,1,val);
                            }else if(name==='color'){
                                res[name] = val;
                                this.verify_color(val,res);
                            }else{
                                res[name] = val;
                            }
                        });
                    }
                });
                switch (name){
                    case 'color':
                        this.mdfColor = '';
                        break;
                    case 'size':
                        this.mdfSize = '';
                        break;
                    case 'msrp':
                        this.msrp = '';
                        break;
                    case 'price':
                        this.price = '';
                        break;
                    case 'inventory':
                        this.inventory = '';
                        break;
                    case 'b_shipping_time':
                        this.b_shipping_time = '';
                        break;
                    case 'e_shipping_time':
                        this.e_shipping_time = '';
                        break;
                    case 'shipping':
                        this.shipping = '';
                        break;
                }
            },
            change_size(row){
                this.isNewChange = false;
                this.temp=row;
                this.sizeVisable=true;
            },
            change_mdfSize(){
                this.isNewChange = true;
                this.sizeVisable=true;
            },
            selecte_size(val){
                if(this.isNewChange){
                    this.mdfSize = val;
                    this.blur_change('size',this.mdfSize);
                }else{
                    this.temp.size=val;
                }
            },
            querySearch(queryString,cb){
                let colors=this.colors;
                let results=queryString?colors.filter(this.createFilter(queryString)):colors;
                cb(results)
            },
            createFilter(queryString){
                return (item)=>{
                    return (item.value.indexOf((queryString.toLowerCase()))===0)
                }
            },
            color_blur(item){
                if(item.color===""&&item.size===""){
                    item.error_size=true;
                    item.error_color=true;
                }else if(item.size===""&&item.color!==""){
                    let bool_color=this.verify_color(item.color,item);
                    if(bool_color){
                        item.error_size=false;
                        item.error_color=false;
                    }else{
                        item.error_size=true;
                        item.error_color=true
                    }
                }else  if(item.size!==""&&item.color===""){
                    let bool_size=this.verify_size(item.size);
                    if(bool_size){
                        item.error_size=false;
                        item.error_color=false;
                    }else{
                        item.error_size=true;
                        item.error_color=true
                    }
                }else {
                    let bool_color=this.verify_color(item.color,item) ;
                    let bool_size=this.verify_size(item.size);
                    bool_size&&(item.error_size=false);
                    !bool_size&&(item.error_size=true);
                    bool_color&&(item.error_color=false);
                    !bool_color&&(item.error_color=true);
                }

            },
            size_blur(item){
                this.color_blur(item);
            },
            color_input(item){
                if(item.color===""&&item.size===""){
                    item.error_size=true
                    item.error_color=true
                }else if(item.size===""&&item.color!==""){
                    let bool_color=this.verify_color(item.color,item)
                    if(bool_color){
                        item.error_size=false;
                        item.error_color=false;
                    }else{
                        item.error_size=true
                        item.error_color=true
                    }
                }else  if(item.size!==""&&item.color===""){
                    let bool_size=this.verify_size(item.size)
                    if(bool_size){
                        item.error_size=false;
                        item.error_color=false;
                    }else{
                        item.error_size=true
                        item.error_color=true
                    }
                }else {
                    let bool1=this.verify_size(item.size);
                    let bool2=this.verify_color(item.color,item);
                    if(bool1===true&&bool2===true){
                        item.error_size=false;
                        item.error_color=false;
                    }else if(bool1===false&&bool2===true){
                        item.error_size=true
                        item.error_color=false
                    }else if(bool1===true&&bool2===false){
                        item.error_size=false;
                        item.error_color= true;
                    }else {
                        item.error_size=true
                        item.error_color=true;
                    }
                }
            },
            verify_size(str){
                let custom_format=/^[a-zA-Z0-9][\ ]*([a-zA-Z0-9.\-&\'\"\(\)\[\]\/][\ ]*)*$/gi;
                if(str.match(custom_format)&&str.length<=50)return true;
                return  false
            },
            verify_color(color,item){
                let find = '';
                if(color.includes('&')){
                    let newColorList = color.split('&');
                    let findList = [];
                    newColorList.forEach(res=>{
                        let obj = this.colors.find(row=>{
                            return row.value.toLowerCase().trim().includes(res.toLowerCase().trim());
                        })
                        findList.push(!!obj);
                    });
                    if(!color.includes(' & ')) item.color = newColorList.join(' & ');
                    find = !findList.find(row=>!row);
                }else{
                    find=this.colors.find((row,index)=>{
                        return row.value.toLowerCase().trim()===color.toLowerCase().trim();
                    })
                }
                return !!find;
            },
            handleSelect(item){
                setTimeout(()=>{
                    this.color_blur(item)
                },300)
            },
            get_colors(){
                let storage=window.sessionStorage;
                if(storage.publish_wish_colors){
                    let a=window.sessionStorage.getItem("publish_wish_colors");
                    this.colors=JSON.parse(a)
                }else {
                    this.$http(api_wish_color).then(res=>{
                        this.colors=res.data.map(row=>{
                            return {
                                value:row.color_value
                            }
                        });
                        storage.setItem("publish_wish_colors",JSON.stringify(this.colors))
                    }).catch(code=>{
                        console.log(code)
                    })
                }
            },
            dbl_mdf(module_name,row){
                this.curRow = row;
                switch (module_name){
                    case 'description':
                        this.curTitle = '修改描述内容';
                        this.curModule = 'description';
                        this.mdfTagsDialog = true;
                        break;
                    case 'name':
                        row.showInput = true;
                        break;
                    case 'tags':
                        this.curTitle = '修改标签';
                        this.curModule = 'tags';
                        this.mdfTagsDialog = true;
                        break;
                }
            },
            blur_name(row,Bool){
                if(!Bool)row.showInput = false;
            },
            selected_depot(){
                let type = this.warehouseList.find(res=>{
                    return res.name === this.form.depot;
                }).type;
                this.form.realname = '';
                this.$http(api_wish_channel,{type:type}).then(res=>{
                	if(res.data.length>0){
                        this.form.realname = res.data.find(res=>{
                            return res.id === this.form.account;
                        }).realname;
                    }
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    });
                });
            },
            selected_account(){
                if(!!this.form.realname){
                    this.form.realname = this.options.find(res=>{
                        return res.id === this.form.account;
                    }).realname;
                }

            },
            checkBox(data){
                let datas =this.tableData;
                if(datas.length > 0){
                    let isAllCheck = !datas.find(row=>!row.isCheck);
                    this.checkAll = isAllCheck;
                }
            },
            checkAllBox(val){
                this.tableData.forEach(row=>{
                    row.isCheck = val;
                });
            },
            del_spu(index){
                this.tableData.splice(index,1)
            },
            mdf_img(val){
                    this.tempData.main_image=val[0].path;
            },
            mdf_imgs(item,i){
                this.curRowImage = item;
                this.ids=item.goods_id;
                this.$set(this.spuTemplate,'path',clone(item.images));
                this.baseUrl = item.baseUrl;
                this.showSpuImg=true;
            },
            mdf_child_imgs(item,row){
                this.ids=item.goods_id;
                this.picVisable=true;
                this.tempData=row;
            },
            selected(val){
                val.forEach(row=>{
                    let find=this.tableData.find(item=>{
                       return  item.goods_id===row.id;
                    });
                    if(!find){
                        this.loadingAll = true;
                        this.$http(api_product_getData,{goods_id:row.id}).then(res=>{
                            this.loadingAll = false;
                            let data=res.data.vars[0];
                            let tags = data.tags.map(row=>row.name);
                            let baseUrl = res.data.base_url;
                            let variant =  data.variant.map(row=>{
                                    let shipping_time = !!row.shipping_time?row.shipping_time.split('-'):[5,15];
                                    row.msrp=0;
                                    row.inventory = 999;
                                    this.$set(row,'shipping_time',shipping_time);
                                    return row
                                });
                            let tab_s={
                                isCheck:true,
                                goods_id:row.id,
                                image:data.images[0]||"",
                                images:data.images,
                                parent_sku:res.data.parent_sku,
                                description:data.description,
                                name:data.name,
                                tags:tags,
                                baseUrl:baseUrl,
                                variant:variant,
                                showInput:false,
                            };
                            this.tableData.push(tab_s);
                            this.checkBox();
                        }).catch(code=>{
                            this.loadingAll = false;
                            console.log(code)
                        })
                    }else {
                        this.$message({type: "warning", message:`${row.spu}已存在` })
                    }
                })
            },
            keep(){
                let data = this.get_params(false);
                if(typeof data ==='boolean'){
                    this.$reqKey('valids_submit',false);
                    return;
                }
                this.$http(api_wish_product_save,data).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.show=false;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('valids_submit',false);
                    },200);
                })

            },
            get_params(isDraft){//参数 isDraft 判断是否为‘保存为草稿箱’操作，如果是，可以不用判断必填项
                let data={
                    account_id:this.form.account,
                    depot:this.form.depot,
                    uid:10
                };
                data.cron_time = this.form.cron_time?datef("YYYY-MM-dd HH:mm:ss", this.form.cron_time/1000):"";
                data.sku=window.clone(this.tableData);
                if(isDraft){
                    if(data.sku.length>0){
                        data.sku.forEach(row=>{
                            row.variant.forEach(it=>{
                                it.shipping_time = it.shipping_time.join('-');
                            });
                            row.tags=row.tags.map(row=>{
                                return  row.name
                            }).join(",");
                        })
                    }
                    return data;
                }else{
                    let flag = true;
                    let singFlag=[];
                    let flags =[];
                    let isFlag = [];
                    let listing = true;
                    let colFlag="";
                    data.sku.forEach(row=>{
                        //                    size 为第一个位置，color为第二个位置
                        if(!!row.variant){
                            row.variant.forEach(item=>{
                                item.color = item.color.trim();
                                item.size = item.size.trim();
                            });
                        }
                        if(row.variant.length>1){
                            row.variant.forEach(item=>{
                                if(item.color===""&&item.size===""){
                                    item.error_size=true;
                                    item.error_color=true;
                                    isFlag.push(false);
                                    singFlag.push([false,false])
                                }else if(item.size===""&&item.color!==""){
                                    let bool_color=this.verify_color(item.color,item);
                                    if(bool_color){
                                        item.error_size=false;
                                        item.error_color=false;
                                        isFlag.push(true)
                                        singFlag.push([false,true])
                                    }else{
                                        item.error_size=true
                                        item.error_color=true
                                        isFlag.push(false)
                                        singFlag.push([false,false])
                                    }
                                }else  if(item.size!==""&&item.color===""){
                                    let bool_size=this.verify_size(item.size);
                                    if(bool_size){
                                        item.error_size=false;
                                        item.error_color=false;
                                        isFlag.push(true);
                                        singFlag.push([true,false])
                                    }else{
                                        item.error_size=true;
                                        item.error_color=true;
                                        isFlag.push(false);
                                        singFlag.push([false,false])
                                    }
                                }else {
                                    let bool1=this.verify_size(item.size);
                                    let bool2=this.verify_color(item.color,item);
                                    if(bool1===true&&bool2===true){
                                        item.error_size=false;
                                        item.error_color=false;
                                        isFlag.push(true)
                                        singFlag.push([true,true])
                                    }else if(bool1===false&&bool2===true){
                                        item.error_size=true
                                        item.error_color=false
                                        isFlag.push(false)
                                        singFlag.push([false,true])
                                    }else if(bool1===true&&bool2===false){
                                        item.error_size=false;
                                        item.error_color= true;
                                        isFlag.push(false)
                                        singFlag.push([true,false])
                                    }else {
                                        item.error_size=true
                                        item.error_color=true;
                                        isFlag.push(false)
                                        singFlag.push([false,false])
                                    }
                                }
                            });
                            //                        singFlag 验证
                            let singA=this.verifys(singFlag,0);
                            let singB=this.verifys(singFlag,1);
                            if(!singA&&!singB)  colFlag={count:row.account_code,flag:true};
                            flags.push(isFlag);
                        }else if(row.variant.length===1){
                            isFlag.push(true);
                            flags.push(isFlag);
                        }
                    });
                    flags.forEach(row=>{
                        row.forEach(item=>{
                            if(!item){
                                listing=false;
                            }
                        })
                    });

                    if(listing){
                        data.sku.forEach(row=>{
                            if(row.variant.length>1){ //单属性产品不用限制颜色和尺寸必填一个；多属性需要限制
                                row.variant.forEach(res=>{
                                    if(!res.size&&!res.color){
                                        this.$reqKey('valids_submit',false);
                                        flag = false;
                                        return this.$message({type:"warning",message:"多属性产品，每条SKU颜色和尺寸至少填写一个"});
                                    }
                                })
                            }
                            let cur = row.variant.find(it=>{//判断 吊牌价，销售价，数量，运费 是否填写
                                let shipping = it.shipping;
                                let msrp = it.msrp;
                                let price = it.price;
                                let inventory = it.inventory;
                                let main_image= it.main_image;
                                return (parseFloat(shipping)===0||shipping==='')|| (parseFloat(msrp)===0||msrp==='')||(parseFloat(price)===0||price==='')||inventory===''||!main_image
                            });

                            if(cur){
                                this.$reqKey('valids_submit',false);
                                flag = false;
                                return this.$message({type:"warning",message:"新添产品的吊牌价，销售价，数量，运费为必填项且SKU展图不能为空，请补充完整"});
                            }
                            let curShippingTime = row.variant.find(it=>{ //判断发货期是否完整且符合逻辑
                                let isTrue = false;
                                if(it.shipping_time.findIndex(it=>!it)>-1){
                                    isTrue = true;
                                }else{
                                    if(parseInt(it.shipping_time[0])>=parseInt(it.shipping_time[1])) isTrue = true;
                                    if(parseInt(it.shipping_time[0])<2||parseInt(it.shipping_time[1])<5) isTrue = true;
                                }
                                return isTrue
                            });

                            if(curShippingTime){
                                this.$reqKey('valids_submit',false);
                                flag = false;
                                return this.$message({type:"warning",message:"发货期为必填项；且按照由小到大的顺序填写；且左侧数据应大于2，右侧数据应大于5。"})
                            }else{
                                row.variant.forEach(res=>{
                                    res.shipping_time = res.shipping_time.join('-');
                                })
                            }

                            if(row.images.length<=0){//判断主图以及图库 是否存在
                                this.$reqKey('valids_submit',false);
                                flag = false;
                                return this.$message({type:"warning",message:"图片库不能为空，请至少选择1张图片"});
                            }else{
                                row.images= row.images.map(it=>{
                                    return it.path
                                });
                            }
                            if(!row.name||row.tags.length<=0||!row.description){//判断  刊登标题/标签/描述
                                this.$reqKey('valids_submit',false);
                                flag = false;
                                return this.$message({type:"warning",message:"刊登标题，标签，描述为必填项，请补充完整，且刊登标题字数不能超过80字"});
                            }else{
                                row.tags = row.tags.map(it=>it.name).join(',');
                            }
                        })
                        return !flag?flag:data;
                    }else{
                        this.$reqKey('valids_submit',false);
                        this.$message({
                            type:"warning",
                            message:"sku信息请输入正确的颜色和尺寸"
                        });
                        return  false
                    }
                }
            },
            verifys(singFlag,index){
                let flag=true;
                for(let i=0;i<singFlag.length;i++){
                    if(!singFlag[i][index]){
                        flag=false
                    }
                }
                return flag
            },
            valids(){
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        this.keep();
                    } else {
                        this.$reqKey('valids_submit',false);
                        return false;
                    }
                });
            },
//            change_dialog(val){
//                if(!val){
//                    this.tableData=[];
//                    this.price="";
//                    this.shipping="";
//                    this.msrp="";
//                    this.form={
//                        account:"",
//                        depot:"中山仓",
//                        realname:"",
//                        number:999,
//                        time:[5,15],
//                        cron_time:"",
//                        title:{value:"",label:""},
//                        price:{value:"",label:"",isInt:false},
//                        msrp:{
//                            isUp:false,multiple:{value:"",label:"",isInt:false},up:{value:"",label:"",isInt:false}
//                        }}
//                }
//            }
        },
        filters: {
            filterDes(val){
                return val.length>158?`${val.substring(0,158)}`:val;
            },
        },
        watch: {
            show(val){
                this.$emit("input", val)
            },
            value(val){
                this.show=val;
            },
        },
        props: {
            value:{}
        },
        components: {
            addGoods:require('../info/add-goods.vue').default,
            pageDialog:require("../../../../components/page-dialog.vue").default,
            uiTable:require("../../../../components/ui-table.vue").default,
            publishImg:require('../../publish-img.vue').default,
            mdfImg:require('../../ebay/kandeng-list/add-edit-listing/mdf-img.vue').default,
            integerInput:require('../../../../components/integer-input.vue').default,
            uiLimitNumber:require('../../../../components/ui-limit-number.vue').default,
            mdfTags:require('./mdf-tags.vue').default,
            limitInput:require('../../ebay/kandeng-list/add-edit-listing/limit-input.vue').default,
            uiAutocomplete:require('../../../../components/ui-autocomplete').default,
            errorIconTips:require('../../../../components/error-icon-tips.vue').default,
            wishSize:require('../info/wish-size.vue').default,
            integerZeroInput:require('../../../../components/integer-zero-input').default,
        }
    }
</script>
