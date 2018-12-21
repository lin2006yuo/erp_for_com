<template>
    <div>
        <card label="产品信息">
            <el-form class="form-style" label-width="150px" style="padding-bottom: 50px;" :model="fromData"
                     :rules="rules"
                     ref="formRule">
                <el-form-item label="本地分类：" required>
                    <span>{{selectProduct.title}}</span>
                    <el-button v-if="isEdit" size="mini" type="primary" @click="edit_product">编辑</el-button>
                </el-form-item>
                <el-form-item label="平台分类：">
                    <span>{{!!viewClass?'viewClass':'暂无字段'}}</span>
                    <el-button  v-if="isEdit" type="primary" size="mini" @click="addClassify = true">添加平台分类</el-button>
                </el-form-item>
                <el-form-item label="开发平台：" required prop="dev_platform">
                    <el-select class="inline" style="width: 150px;" v-if="isEdit"
                               v-model="fromData.dev_platform">
                        <el-option v-for="(item, index) in terrace" :label="item.label" :value="item.name"
                                   :key="index"></el-option>
                    </el-select>
                    <span v-else>{{fromData.dev_platform}}</span>
                </el-form-item>

                <el-form-item label="产品标题：" required prop="title">
                    <el-input class="inline" v-if="isEdit || isDisposeEdit" v-model="fromData.title"></el-input>
                    <span v-else>{{fromData.title}}</span>
                </el-form-item>
                <el-form-item label="产品图片：" required>
                    <img-upload v-if="isEdit" v-model="fromData.images" :thumbnailMode="true" :image="{width:'80px',height:'80px'}"></img-upload>
                    <div v-else><img v-for="(img, index) in fromData.images" :key="index" :src="host+img.path" style="height: 80px;width: 80px;padding: 5px;"></div>
                </el-form-item>

                <div v-if="isComplete">
                    <el-form-item label="是否需要拍照：">
                        <el-select v-if="isDisposeEdit" style="width: 150px;" v-model="fromData.is_photo">
                            <el-option v-for="(item, index) in isLarge" :key="index" :value="item.value"
                                       :label="item.label"></el-option>
                        </el-select>
                        <span v-else>{{fromData.is_photo===1?'是':'否'}}</span>
                    </el-form-item>
                    <el-form-item label="拍照要求：">
                        <el-input v-if="isDisposeEdit" style="width: 150px;" v-model="fromData.photo_remark" type="textarea"></el-input>
                        <span v-else>{{fromData.photo_remark}}</span>
                    </el-form-item>
                    <el-form-item label="未处理图片路径：">
                        <el-input v-if="isDisposeEdit" style="width: 150px;" v-model="fromData.undisposed_img_url"></el-input>
                        <span>{{fromData.undisposed_img_url}}</span>
                    </el-form-item>
                    <el-form-item label="SPU：">
                        <el-input style="width: 150px;display: inline-block" :disabled="true" v-model="spuNum"></el-input>
                        <label>(系统自动生成)</label>
                    </el-form-item>
                </div>

                <el-form-item label="品牌：" required prop="brand_id">
                    <el-select class="inline" v-if="isEdit" v-model="fromData.brand_id">
                        <el-option v-for="(item, index) in productBrand" :label="item.label" :value="item.value"
                                   :key="index"></el-option>
                    </el-select>
                    <span v-else>{{this.readBrand}}</span>
                </el-form-item>

                <div v-if="isComplete">
                    <el-form-item label="是否授权：" required>
                        <el-select class="inline"  v-if="isDisposeEdit" v-model="fromData.is_impower">
                            <el-option style="width: 150px;" v-for="(item, index) in power" :value="item.value" :key="index"
                                       :label="item.label"></el-option>
                        </el-select>
                        <span v-else>{{fromData.is_impower}}</span>
                    </el-form-item>
                </div>

                <el-form-item label="产品侵权风险：" required prop="tort_id">
                    <el-select class="inline" v-if="isEdit || isDisposeEdit" v-model="fromData.tort_id">
                        <el-option v-for="(item, index) in productTort" :value="item.value" :key="index"
                                   :label="item.label"></el-option>
                    </el-select>
                    <span v-else>{{readTort}}</span>
                </el-form-item>
                <div>
                    <el-form-item label="采购价（CNY）：" class="inline" required prop="purchase_price">
                        <el-input type="number" class="inline" style="width: 80px;" v-if="isEdit"
                                  v-model="fromData.purchase_price"></el-input>
                        <span v-else>{{fromData.purchase_price}}</span>
                    </el-form-item>
                    <el-form-item label="最低限价（CNY）：" class="inline ml-sm" required prop="lowest_sale_price">
                        <el-input type="number" class="inline" style="width: 80px;" v-if="isEdit"
                                  v-model="fromData.lowest_sale_price"></el-input>
                        <span v-else>{{fromData.lowest_sale_price}}</span>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="建议售价（CNY）：" class="inline" required prop="advice_price">
                        <el-input type="number" class="inline" style="width: 80px;" v-if="isEdit"
                                  v-model="fromData.advice_price"></el-input>
                        <span v-else>{{fromData.advice_price}}</span>
                    </el-form-item>
                    <el-form-item label="竞争对手售价（CNY）：" class="inline ml-sm">
                        <el-input type="number" class="inline" style="width: 80px;" v-if="isEdit"
                                  v-model="fromData.competitor_price"></el-input>
                        <span v-else>{{fromData.competitor_price}}</span>
                    </el-form-item>
                </div>
                <el-form-item label="本平台预估毛利率：" required prop="gross_profit">
                    <el-input type="number" class="inline" style="width: 80px;" v-if="isEdit"
                              v-model="fromData.gross_profit"></el-input>
                    <span v-else>{{fromData.gross_profit}}</span>
                    <span>%</span>
                </el-form-item>
                <el-form-item label="产品物流属性：" required prop="properties">
                    <el-checkbox-group v-model="propertie" v-if="isEdit || isDisposeEdit" @change="propertiesSet">
                        <el-checkbox v-for="(item, index) in fromData.properties" :key="index"
                                     :label="item.value">{{item.name}}
                        </el-checkbox>
                    </el-checkbox-group>
                    <el-tag style="margin: 0 5px" v-else v-for="(item, index) in fromData.properties" :key="index" v-show="item.enabled">
                        {{item.name}}
                    </el-tag>
                </el-form-item>
                <el-form-item label="商品尺寸：" class="input-box" required>
                    <label>长：</label>
                    <el-input type="number" class="inline" style="width: 60px" v-if="isEdit || isDisposeEdit"
                              v-model="fromData.length"></el-input>
                    <span v-else>{{fromData.length}}</span>
                    <label>cm</label>
                    <label class="ml-xs">宽：</label>
                    <el-input type="number" class="inline" style="width: 60px" v-if="isEdit || isDisposeEdit"
                              v-model="fromData.width"></el-input>
                    <span v-else>{{fromData.width}}</span>
                    <label>cm</label>
                    <label class="ml-xs">高：</label>
                    <el-input type="number" class="inline" style="width: 60px" v-if="isEdit || isDisposeEdit"
                              v-model="fromData.height"></el-input>
                    <span v-else>{{fromData.height}}</span>
                    <label>cm</label>
                    <label class="ml-xs">体积重：</label>
                    <el-input class="inline" type="number" style="width: 80px" v-if="isEdit"
                              v-model="volume_weight" disabled></el-input>
                    <span v-else>{{volume_weight}}</span>
                    <label>g</label>
                </el-form-item>
                <div>
                    <el-form-item label="产品净重：" class="inline" required prop="net_weight">
                        <el-input type="number" class="inline" style="width: 60px" v-if="isEdit || isDisposeEdit"
                                  v-model="fromData.net_weight"></el-input>
                        <span v-else>{{fromData.net_weight}}</span>
                        <label>g</label>
                    </el-form-item>
                    <el-form-item label="产品毛重：" class="inline" required label-width="90px" prop="weight">
                        <el-input type="number" class="inline" style="width: 60px" v-if="isEdit"
                                  v-model="fromData.weight"></el-input>
                        <span v-else>{{fromData.weight}}</span>
                        <label>g</label>
                    </el-form-item>
                </div>
                <el-form-item label="产品是否自带包装：" required prop="is_packing">
                    <el-select class="inline" v-if="isEdit" v-model="fromData.is_packing">
                        <el-option v-for="(item, index) in isHavePack" :key="index" :value="item.value"
                                   :label="item.label"></el-option>
                    </el-select>
                    <span v-else>{{fromData.is_packing===0?'否':'是'}}</span>
                </el-form-item>


                <div v-if="isComplete">
                    <el-form-item label="前置打包材料：" class="inline">
                        <el-select :disabled="!isDisposeEdit" style="width: 150px;" v-model="fromData.packing_id">
                            <el-option v-for="(item, index) in packMaterials" :key="index" :value="item.value"
                                       :label="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="后置打包材料：" class="inline">
                        <el-select :disabled="!isDisposeEdit" style="width: 150px;" v-model="fromData.packing_back_id">
                            <el-option v-for="(item, index) in packMaterials" :key="index" :value="item.value"
                                       :label="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                </div>


                <el-form-item label="产品单位：">
                    <el-select class="inline" v-if="isEdit" v-model="fromData.unit_id">
                        <el-option v-for="(item, index) in proUnit" :key="index" :value="item.value"
                                   :label="item.label"></el-option>
                    </el-select>
                    <span v-else>{{readUnit}}</span>
                </el-form-item>


                <div v-if="isComplete">
                    <el-form-item label="默认仓库：" required>
                        <el-select :disabled="!isDisposeEdit" style="width: 150px;" v-model="fromData.warehouse_id">
                            <el-option v-for="(item, index) in warehouse" :key="index" :value="item.id"
                                       :label="item.name"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="是否存在于多仓库：">
                        <el-select v-if="isDisposeEdit" style="width: 150px;" v-model="fromData.is_multi_warehouse">
                            <el-option v-for="(item, index) in isLarge" :key="index" :value="item.value"
                                       :label="item.label"></el-option>
                        </el-select>
                        <span v-else>{{fromData.is_multi_warehouse===1?"是":"否"}}</span>
                    </el-form-item>

                    <el-form-item label="是否需要取样：">
                        <el-select  v-if="isDisposeEdit"  style="width: 150px;" v-model="fromData.is_sampling">
                            <el-option v-for="(item, index) in isLarge" :key="index" :value="item.value"
                                       :label="item.label"></el-option>
                        </el-select>
                        <span v-else>{{fromData.is_sampling===1?"是":"否"}}</span>
                    </el-form-item>
                </div>

                <el-form-item label="平台连接：">
                    <el-input class="inline" style="width: 300px" v-if="isEdit"
                              v-model="fromData.source_url"></el-input>
                    <span v-else>{{fromData.source_url}}</span>
                    <el-button type="primary" size="mini" @click="open_link(fromData.source_url)">打开平台链接</el-button>
                </el-form-item>
                <el-form-item label="采购连接：">
                    <div v-if="isEdit">
                        <div style="padding-bottom: 3px;" v-for="(item,index) in purchase_url" :key="index">
                            <el-input style="width:300px" class="inline"
                                      v-model="purchase_url[index]"></el-input>
                            <el-button size="mini" type="primary" @click="open_link(purchase_url[index])">打开采购链接</el-button>
                            <el-button size="mini" type="danger" class="el-icon-delete"
                                       v-show="purchase_url.length>1" @click="del_link(index)"
                            ></el-button>
                        </div>
                        <el-button size="mini" @click="add_link" type="primary" class="mt-xs">
                            添加链接
                        </el-button>
                    </div>
                    <div v-else>
                        <div style="padding-bottom: 3px;" v-for="(item, index) in fromData.purchase_url" :key="index">
                            <span>{{item}}</span>
                            <el-button size="mini" type="primary" @click="open_link(item)">打开采购链接</el-button>
                        </div>
                    </div>

                </el-form-item>
                <el-form-item label="销售平台状态：" required>
                    <div style="width: 600px; font-size: 0" v-if="isEdit">
                        <div class="channl_status" v-for="(item,index) in terrace" :key="index">
                            <label class="inline" style="width: 80px">{{item.label}}：</label>
                            <el-select class="inline" style="width: 105px;" v-model="fromData.platform_sale[index].value_id"
                                       @change="select_channl_status(index)">
                                <el-option v-for="(item, index) in terraceStatus" :key="index" :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div style="width: 600px;" v-else>
                        <div class="channl_status" v-for="(item, index) in fromData.platform_sale" :key="index">
                            {{item.title}}：{{item.value}}
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="产品标签：" required>
                    <div style="width: 600px" v-if="isEdit">
                        <el-tag
                            v-for="(tag, index) in dynamicTags"
                            :key="index"
                            :closable="true"
                            :close-transition="false"
                            @close="handleClose(tag)">
                            {{tag}}
                        </el-tag>
                        <el-input
                            class="input-new-tag inline"
                            v-if="inputVisible"
                            v-model="inputValue"
                            ref="saveTagInput"
                            size="mini"
                            @keyup.enter.native="handleInputConfirm"
                            @blur="handleInputConfirm">
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                    </div>
                    <el-tag style="margin: 0 5px" v-else v-for="(item, index) in fromData.tags" :key="index">
                        {{item}}
                    </el-tag>
                </el-form-item>
                <el-form-item label="产品描述：" required prop="description">
                    <el-input type="textarea" style="width: 600px;" :rows="4" v-if="isEdit"
                              v-model="fromData.description"></el-input>
                    <span v-else>{{fromData.description}}</span>
                </el-form-item>
                <el-form-item label="开发备注：">
                    <el-input type="textarea" style="width: 600px;" :rows="4" v-if="isEdit || isDisposeEdit"
                              v-model="fromData.developer_note"></el-input>
                    <span v-else>{{fromData.developer_note}}</span>
                </el-form-item>
            </el-form>
        </card>
        <div v-if="isEdit && !isDispose"
             style="position: absolute;bottom: 0;width: 100%;text-align: right;padding: 10px 20px;background: #fff;right: 30px;">
            <el-button type="primary" size="mini" @click="create_submit">保存</el-button>
            <el-button type="primary" size="mini" @click="dispose_goods">提交审核</el-button>
            <el-button size="mini" @click="visible_hide">取消</el-button>
        </div>
        <div v-else style="position: absolute;bottom: 0;width: 100%;text-align: right;padding: 10px 20px;background: #fff;right: 30px;">
            <el-button v-if="isDispose" type="primary" size="mini" v-for="(item,index) in disposeBtn" :key="index"
                       @click="disposeClick(item)">{{item.btn_name}}
            </el-button>
            <el-button size="mini" @click="visible_hide">{{isDispose?'取消':'关闭'}}</el-button>
            <el-card style="position: absolute;bottom:50px;right:0;" v-if="remark">
                <p style="text-align: left">备注信息：</p>
                <el-input type="textarea" :rows="3" v-model="remarkText"></el-input>
                <el-button type="primary" size="mini" @click="disposeSubmit">提交</el-button>
                <el-button size="mini" @click="visible_hide">取消</el-button>
            </el-card>
        </div>
        <add-classify v-model="addClassify" @getclass="get_class"></add-classify>
    </div>
</template>

<style lang="stylus">
    .p-create-product {
    .skuw{width:60px;}
    .supplier {

    label {
        display: inline-block;
        width: 80px;
        text-align: right;
    }

    }
    .form-style {

    .el-select, .el-input {
        /*width: 150px;*/
    }

    }
    .img-ment-table {

    td {
        padding: 10px;
    }

    }
    .channl_status {
        display: inline-block;
        width: 198px;
        /*border: 1px solid #ddd;*/
        height: 31px;
        line-height: 30px;
        font-size: 1.2rem;
        border-right: 0;
        vertical-align: middle;

    label {
        text-align: right;
    }

    }
    }
</style>

<script>
    import {
        api_channel,
        publish_edit_unit,
        publish_edit_packing,
        publish_edit_tag,
        publish_edit_brand,
        publish_edit_tort,
        publish_edit_plat,
        publish_skuinfo,
        publish_edit_property
    } from  '../../../api/product-library'
    import { warehouse_type} from '../../../api/product_create'
    import {api_goods_pre_dev, api_dispose, api_update_goods} from '../../../api/plan-exploit'

    export default{
        data(){
            return {
               // images:[],
//                propertie:[],
                host:config.apiHost,
                addClassify:false,
                viewClass:'',
                skusList: [],
                skuData: {},
                url: config.apiHost + 'supplier-offer/supplier',
                addDialog: false,
                addForm: {},
                balanceList: [],
                isAddSuppler: false,
                newIntroDialog: true,
                isPhoto: '1',
                photoText: '',
                photoPath: '',
                spuNum: '',
                isPower: '',
                power: [{label: '请选择', value: ''}, {label: '是', value: '1'}, {label: '否', value: '0'}],
                perPack: '',
                postPack: '',
                packMaterials: [],
                warehouseId: '',
                warehouse: [],
                defaultWarehouse: [{label: '请选择', value: ''}],
                isLargeId: '1',
                isLarge: [{label: '是', value: 1}, {label: '否', value: 0}],
                isSampling: '1',
                requireList: [],
                supplierId: '',
                productAttr: [],//属性
                productGoodsdev: [],//规格
                selectAttr: [],
                selectDev: [],
                selectSkuList: [],

                visible: false,
                remark: false,
                terrace: [],
                productBrand: [],
                productTort: [],
                isHavePack: [
                    {label: '是', value: 1},
                    {label: '否', value: 0}
                ],
                proUnit: [],
                terraceStatus: [],
                dynamicTags: [],//标签
                physicalProperty: [],//物流属性
                inputVisible: false,
                inputValue: '',
                purchase_url: [],
                channl_status: [
                    {
                        id: 1,
                        name: "ebay",
                        title: "eBay平台",
                        value_id: 1,
                        value: ''
                    },
                    {
                        id: 2,
                        name: "amazon",
                        title: "亚马逊平台",
                        value_id: 1,
                        value: ''
                    },
                    {
                        id: 3,
                        name: "wish",
                        title: "Wish平台",
                        value_id: 1,
                        value: ''
                    },
                    {
                        id: 4,
                        name: "aliExpress",
                        title: "速卖通平台",
                        value_id: 1,
                        value: ''
                    }
                ],
                readBrand: '',
                readTort: '',
                readUnit: '',
                disposeStatu: {},
                remarkText: '',
                imgRequirement: {},
                rules: {
                    dev_platform: [{required: true, message: '请选择平台', trigger: 'change', type: 'string'}],
                    title: [{required: true, message: '请输入标题', trigger: 'blur'}],
                    brand_id: [{required: true, message: '请选择品牌', trigger: 'change', type: 'number'}],
                    tort_id: [{required: true, message: '请选择侵权风险', trigger: 'change', type: 'number'}],
                    purchase_price: [{required: true, message: '请输入采购价', trigger: 'blur'}],
                    lowest_sale_price: [{required: true, message: '不能为空', trigger: 'blur'}],
                    advice_price: [{required: true, message: '不能为空', trigger: 'blur'}],
                    gross_profit: [{required: true, message: '请输入平台预估毛利润', trigger: 'blur'}],
                    //properties: [{required: true, message: '请选择物流属性', trigger: 'change', type: 'array'}],
                    net_weight: [{required: true, message: '不能为空', trigger: 'blur'}],
                    weight: [{required: true, message: '不能为空', trigger: 'blur'}],
                    is_packing: [{required: true, message: '请选择是否自带包装', trigger: 'change', type: 'number'}],
                    description: [{required: true, message: '请输入产品描述', trigger: 'blur'}]
                }
            }
        },
        filters: {

        },
        mounted(){
            this.unit_init();

//            this.get_properote();

        },
        updated(){

        },
        methods: {
            init(){
                if (!this.rules_from()) {
                    return
                }
                if(this.propertie.length === 0){
                    this.$message({
                        type:"error",
                        message:"物流属性不能为空"
                    });
                    return
                }
                if (this.fromData.height === '' || this.fromData.width === '' || this.fromData.length === '') {
                    this.$message({
                        type: "error",
                        message: "请将产品尺寸填写完整！"
                    });
                    return
                }
                console.log(this.fromData.images);
                if(this.fromData.images.length === 0){
                    this.$message({
                        type:"error",
                        message: "请上传产品图片"
                    });
                    return;
                }
                let thumb = [];
                let goods_img = [];
                this.fromData.images.forEach(img=>{
                    if(img.id){
                        goods_img.push({id:img.id,path:img.path});
                    }else {
                        thumb.push(img.image);
                    }
                });
                this.$set(this.fromData,'thumb',thumb);
                this.$set(this.fromData, 'goods_img', goods_img);
                this.fromData.category_id = this.selectProduct.value;
               // this.fromData.platform_sale = this.channl_status;
                this.fromData.tags = this.dynamicTags;
                this.fromData.purchase_url = this.purchase_url;
                let process = ``;
                if(this.fromData.audit === 1){
                    process = `待开发主管审核`;
                }else{
                    process = `未提交`;
                }
                let category = this.selectProduct.title;
                category = category.replace('>>','>');
                if(this.isCreate){
                    this.$http(api_goods_pre_dev, this.fromData).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.message || res
                        });
                        let create_time = Date.parse(new Date);
                        create_time = create_time/1000;
                        create_time = datef("YYYY-MM-dd HH:mm:ss",create_time);
                        let data = {
                            code : res.data.code,
                            title : this.fromData.title,
                            category : category,
                            creator : res.data.creator,
                            create_time : create_time,
                            process : process,
                        };
                        this.$emit('add-good',data,res.data.id);
                    }).catch(code => {
                        this.$message({
                            type: "error",
                            message: code.message || code
                        })
                    })
                }else {
                    this.$http(api_update_goods, this.fromData.id, this.fromData).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.message || res
                        });
                        let data = {
                        	id : this.fromData.id,
                            category : category,
                            process : process,
                            title : this.fromData.title,
                        };
                        this.$emit('add-good',data);
                    }).catch(code => {
                        this.$message({
                            type: "error",
                            message: code.message || code
                        })
                    })
                }

            },
            create_submit(){
                this.fromData.audit = 0;
                this.init();
            },
            dispose_goods(){
                this.fromData.audit = 1;
                this.init();
            },
//            get_properote(){
//                this.fromData.properties.forEach(res=>{
//                    if(res.enabled){
//                        this.propertie.push(res.value);
//                    }
//                });
//            },
            propertiesSet(val){//产品物流属性数据整理
//                let arr = [];
//                this.propertie.forEach(row => {
//                    let index = this.physicalProperty.findIndex(res => {
//                        return res.value === row;
//                    });
//                    arr.push({field: this.physicalProperty[index].field, value: this.physicalProperty[index].value});
//                });
//                this.fromData.properties = arr;
            },

            rules_from(){//表单验证
                let bl = false;
                this.$refs.formRule.validate((valid) => {
                    bl = !!valid;
                });
                return bl;
            },
            edit_product(){//编辑商品分类
                this.$emit('edit-product')
            },

            //审核按钮事件
            disposeClick(item){
                this.disposeStatu = item;
                this.remark = true;
            },
            disposeSubmit(){
                let data = {};
                data.id = this.id;
                data.code = this.disposeStatu.code;
                data.remark = this.remarkText;
                this.$http(api_dispose, data).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.remark = false;
                    this.visible = false;
                    this.remarkText = '';
                    this.$emit('dispose-goods',data)
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    });
                    this.remarkText = '';
                    this.remark = false;
                })
            },
            select_channl_status(index){
                let id = this.fromData.platform_sale[index].value_id;
                let label = '';
                //console.log(id);
                this.terraceStatus.forEach(res => {
                    if (res.value === id) {
                        label = res.label;
                    }
                });
                this.fromData.platform_sale[index].value = label;
                //console.log(this.channl_status);
            },

//            select_img(val){
//                this.fromData.thumb = val.map(res => {
//                    return res.image
//                });
//            },

            //增加标签事件
            handleClose(tag) {
                this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
            },
            showInput() {
                this.inputVisible = true;
                this.$nextTick( ()=> {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            handleInputConfirm() {
                let inputValue = this.inputValue;
                if (inputValue) {
                    this.dynamicTags.push(inputValue);
                }
                this.inputVisible = false;
                this.inputValue = '';
            },

            //打开链接
            open_link(url){
                if(url.trim().length === 0){
                    this.$message({
                        type:"error",
                        message:'还没有链接'
                    });
                    return false;
                }else {
                    let b = url.substring(0, 7);
                    if (b === "http://" || b === "https:/") {
                        try{
                            window.open(url);
                        }catch (err){
                            this.$message({
                                type:"error",
                                message:"无法打开该链接"
                            })
                        }

                    } else {
                        try{
                            window.open(`http://${url}`);
                        }catch (err){
                            this.$message({
                                type:"error",
                                message:"无法打开该链接"
                            })
                        }

                    }
                }
            },
            //添加链接
            add_link(){
                //console.log("添加链接");
                this.purchase_url.push("");
            },
            //删除链接
            del_link(index){
                this.$confirm(`删除第${index + 1}个链接, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.purchase_url.splice(index, 1);
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },

            visible_hide(){
               this.$emit('visible-hide');
            },
            // 平台分类
            get_class(val){
                console.log(val);
                let arr = val.map(item=>{
                    return item.label
                });
                this.viewClass = arr.join('>>');
            },

            //数据请求
            unit_init(){
                this.$http(publish_edit_packing).then(res => {
                    this.packMaterials = res.map(row => {
                        return {
                            value: row.id,
                            label: row.name
                        }
                    })
                });
                this.$http(warehouse_type).then(res => {
                    this.warehouse = res;
                });
                this.$http(api_channel).then(res => {
                    this.terrace = res.map(row => {
                        return {
                            label: row.title,
                            value: row.id,
                            name: row.name
                        }
                    })
                });
                this.$http(publish_edit_unit).then(res => {//单位
                    this.proUnit = res.map(row => {
                        return {
                            label: row.name,
                            value: row.id
                        }
                    });
                    if (!this.isEdit) {
                        let index = this.proUnit.findIndex(row => {
                            return this.fromData.unit_id === row.value;
                        });
                        this.readUnit = this.proUnit[index].label;
                    }
                }).catch(code => {

                });
                this.$http(publish_edit_tag).then(res => {
                    this.dynamicTags = res.map(row => {
                        return row.name;
                    });
                }).catch(code => {

                });
                this.$http(publish_edit_brand).then(res => {
                    this.productBrand = res.map(row => {
                        return {
                            label: row.name,
                            value: row.id
                        }
                    });
                    if (!this.isEdit) {
                        let index = this.productBrand.findIndex(row => {
                            return this.fromData.brand_id === row.value;
                        });
                        this.readBrand = this.productBrand[index].label;
                    }
                }).catch(code => {

                });
                this.$http(publish_edit_tort).then(res => {
                    this.productTort = res.map(row => {
                        return {
                            label: row.name,
                            value: row.id
                        }
                    });
                    if (!this.isEdit) {
                        let index = this.productTort.findIndex(row => {
                            return this.fromData.tort_id === row.value;
                        });
                        this.readTort = this.productTort[index].label;
                    }
                }).catch(code => {

                });
                this.$http(publish_edit_plat).then(res => {//平台状态
                    this.terraceStatus = res.map(row => {
                        return {
                            label: row.name,
                            value: row.id
                        }
                    })
                }).catch(code => {

                });
                if(this.isCreate){
                    this.$http(publish_edit_property).then(res => {
                        this.fromData.properties = res;
//                    this.physicalProperty = res.map(row => {
////                        return {
////                            label: row.name,
////                            value: row.value,
////                            field: row.field,
////                            enabled: false
////                        }
//                    })
                    }).catch(code => {

                    });
                }

            }
        },
        computed: {
            propertie:{
                get(){
                    let propertie=[];
                    this.fromData.properties&&this.fromData.properties.forEach(res=>{
                        if(res.enabled){
                            propertie.push(res.value);
                        }
                    });
                    return propertie;
                },
                set(val){
                    console.log("test",val );
                    this.fromData.properties.forEach(row=>{
                        let find=val.find(item=>{
                            return row.value===item;
                        });
                        row.enabled=!!find;
                    })
                }
            },
            volume_weight(){
                let vw = this.fromData.width*this.fromData.height*this.fromData.length/6;
                this.fromData.volume_weight = vw;
                return vw.toFixed(0);
            }

        },
        watch: {

        },
        props: {
            selectProduct: {
                required: true
            },
            disposeBtn:{},
            isEdit: {},
            isDispose: {},
            fromData:{},
            id: {},
            isComplete:{},
            isDisposeEdit:{
                default(){
                    return false
                }
            },
            isCreate:{
                default(){
                    return false
                }
            }
        },
        components: {
            card: require("../../../components/card.vue").default,
            uiSelect: require('../../../components/ui-select.vue').default,
            selectText: require('../../../components/select-text.vue').default,
            uiLimitNumber: require('../../../components/ui-limit-number.vue').default,
            //imgUpload: require('./img-upload.vue').default,
            imgUpload: require('./img-upload.vue').default,
            scroll: require('../../../components/scroll.vue').default,
            add: require('../../procurement/suppliers/assert-sup/add.vue').default,
            addClassify: require('../classify/add-classify.vue').default
        }
    }
</script>

