<template>
    <el-row class="p-attribute-set-wish">
        <div class="p-titleBgcol">
            <span class="p-attribute">{{label}}</span>
        </div>
        <div class="p-titleColour-attribute">
            <el-row class="mb-sm" >
                <el-button type="primary" size="mini"
                           @click="add_sku"
                           v-if="curModel==='has'||add">添加SKU</el-button>
                <el-button type="primary" @click.native="priceVisible=true" size="mini" class="ml-sm">价格计算器</el-button>
            </el-row>
            <table class="template">
                <tr>
                    <th width="35px">
                    </th>
                    <th width="140px">SKU</th>
                    <th>捆绑/打包销售</th>
                    <th width="90px">展图</th>
                    <th width="100px">参考颜色</th>
                    <th width="130px">颜色</th>
                    <th width="70px">参考尺寸</th>
                    <th width="160px">尺寸</th>
                    <th width="70px">成本价</th>
                    <!--<th width="80px" v-if="showRef">参考吊牌价</th>-->
                    <th width="85px" class="required-sign">吊牌价($)</th>
                    <!--<th width="75px" v-if="showRef">参考销售价</th>-->
                    <th width="85px" class="required-sign">销售价($)</th>
                    <th width="90px" class="required-sign">数量</th>
                    <th width="140px" class="required-sign">发货期</th>
                    <th width="60px">重量(g)</th>
                    <!--<th width="60px" v-if="showRef">参考运费</th>-->
                    <th width="85px" class="required-sign">运费($)</th>
                    <th width="80px">操作</th>
                </tr>
                <tbody>
                    <tr>
                        <!--多选-->
                        <th>
                            <el-checkbox v-model="checkAll"></el-checkbox>
                        </th>
                        <!--SKU-->
                        <th></th>
                        <!--捆绑/打包销售-->
                        <th></th>
                        <!--展图-->
                        <th>
                            <span class="operate" @click="delete_pic">删除</span>
                            <span class="ml-sm operate"
                                  v-if="!trueId||isCopy"
                                  @click="random_click">随机</span>
                        </th>
                        <!--参考颜色-->
                        <th></th>
                        <!--颜色-->
                        <th>
                            <ui-autocomplete
                                    class="inline-input relative"
                                    v-model="mdfColor"
                                    :fetch-suggestions="querySearch"
                                    placeholder="请输入内容"
                                    @blur="blur_change('mdfColor',mdfColor)"
                            ></ui-autocomplete>
                        </th>
                        <!--参考尺寸-->
                        <th></th>
                        <!--尺寸-->
                        <th>
                            <el-input type="text"
                                   style="width:90px"
                                   class="inline"
                                   @blur="blur_change('mdfSize',mdfSize)"
                                   v-model="mdfSize"></el-input>
                            <el-button size="mini" @click="change_new_size" type="primary" class="inline" >选择</el-button>
                        </th>
                        <!--成本价-->
                        <th></th>
                        <!--参考吊牌价-->
                        <!--<th v-if="showRef"></th>-->
                        <!--吊牌价-->
                        <th>
                            <ui-limit-number class="input-width"
                                             v-model="msrp"
                                             @blur="blur_change('msrp',msrp)"
                                             :limit="2"></ui-limit-number>
                        </th>
                        <!--参考销售价-->
                        <!--<th v-if="showRef"></th>-->
                        <!--销售价-->
                        <th>
                            <ui-limit-number class="input-width"
                                             v-model="price"
                                             @blur="blur_change('price',price)"
                                             :limit="2"></ui-limit-number>
                        </th>
                        <!--数量-->
                        <th>
                            <integer-zero-input v-model="count"
                                                class="input-width"
                                                @blur="blur_change('count',count)"
                                                :min="0"></integer-zero-input>
                        </th>
                        <!--发货期-->
                        <th>
                            <integer-input
                                    v-model="ship_s"
                                    class="inline style-width-60"
                                    :min="2"
                                    :max="get_max_number(ship_e)"
                                    @blur="blur_change('ship_s',ship_s)"
                            ></integer-input>
                            <integer-input
                                    v-model="ship_e"
                                    class="inline style-width-60"
                                    :min="get_min_number(ship_s)"
                                    @blur="blur_change('ship_e',ship_e)"
                            ></integer-input>
                        </th>
                        <!--重量-->
                        <th></th>
                        <!--参考运费-->
                        <!--<th v-if="showRef"></th>-->
                        <!--运费-->
                        <th>
                            <ui-limit-number class="input-width"
                                             v-model="shipping"
                                             @blur="blur_change('shipping',shipping)"
                                             :limit="2"></ui-limit-number>
                        </th>
                        <!--操作-->
                        <th></th>
                    </tr>
                    <tr v-for="(row,index) in tableData" :key="`${row.sku}${index}`">
                        <!--多选-->
                        <td>
                            <el-checkbox v-model="row.isCheck"></el-checkbox>
                        </td>
                        <!--SKU-->
                        <td>
                            <!--<el-input v-model="row.sku" style="width: 95px;"></el-input>-->
                            <ui-tip :content="row.sku" :width="95"></ui-tip>
                        </td>
                        <!--捆绑/打包销售-->
                        <td>
                            <span class="operate" @click="bundling_sales(row)">{{row.combine_sku}}</span>
                        </td>
                        <!--展图-->
                        <td>
                            <div @click="change_row_image(row)">
                                <img :src="get_path(row.main_image,'_100x100.',baseUrl)"
                                     v-if="row.main_image"
                                     height="26px"
                                     width="26px">
                                <p style="display: inline-block;vertical-align: top">
                                    <i class="el-icon-edit mdfhove"></i>
                                </p>
                            </div>
                        </td>
                        <!--参考颜色-->
                        <td>{{row.ref_color}}</td>
                        <!--颜色-->
                        <td class="relative">
                            <ui-autocomplete
                                    class="inline-input relative"
                                    v-model="row.color"
                                    :fetch-suggestions="querySearch"
                                    placeholder="请输入内容"
                                    @blur="color_blur(row)"
                                    @select="handleSelect(row)"
                            ></ui-autocomplete>
                            <error-icon-tips :content="colorContent"
                                             v-if="row.error_color"
                                             width="200"
                                             placement="right"></error-icon-tips>
                        </td>
                        <!--参考尺寸-->
                        <td>{{row.ref_size}}</td>
                        <!--尺寸-->
                        <td class="relative">
                            <el-input v-model="row.size"
                                      @blur="size_blur(row)"
                                      class="inline "
                                      @input="color_input(row)"
                                      style="width:90px"
                            ></el-input>
                            <el-button size="mini" @click="change_size(row)" type="primary" class="inline" >选择</el-button>
                            <error-icon-tips :content="sizeContent"
                                             v-if="row.error_size"
                                             class="move-right"
                                             width="250"
                                             placement="right"></error-icon-tips>
                        </td>
                        <!--成本价-->
                        <td>
                            <div>{{row.cost_price | fitlerPrice}}</div>
                        </td>
                        <!--参考吊牌价-->
                        <!--<td v-if="showRef">{{caluc_reference_msrp(row)}}</td>-->
                        <!--吊牌价-->
                        <td>
                            <ui-limit-number class="input-width"
                                             @blur="can_change(row,'msrp')"
                                             v-model="row.msrp"
                                             :limit="2"></ui-limit-number>
                        </td>
                        <!--参考销售价-->
                        <!--<td v-if="showRef">{{caluc_reference_price(row)}}</td>-->
                        <!--销售价-->
                        <td>
                            <ui-limit-number class="input-width"
                                             @blur="can_change(row,'price')"
                                             v-model="row.price"
                                             :limit="2"></ui-limit-number>
                        </td>
                        <!--数量-->
                        <td>
                            <integer-zero-input v-model="row.inventory"
                                             class="input-width"
                                             @blur="can_change(row,'inventory')"
                                             :min="0"></integer-zero-input>
                        </td>
                        <!--发货期-->
                        <td>
                            <integer-input
                                    v-model="row.shipping_time[0]"
                                    class="inline style-width-60"
                                    :min="2"
                                    :max="get_max_number(row.shipping_time[1])"
                                    @blur="blur_one_s(row.shipping_time[0],row)"
                            ></integer-input>
                            <integer-input
                                    v-model="row.shipping_time[1]"
                                    class="inline style-width-60"
                                    :min="get_min_number(row.shipping_time[0])"
                                    @blur="blur_one_e(row.shipping_time[1],row)"
                            ></integer-input>
                        </td>
                        <!--重量-->
                        <td>{{row.weight}}</td>
                        <!--参考运费-->
                        <!--<td v-if="showRef">{{caluc_reference_shipping(row)}}</td>-->
                        <!--运费-->
                        <td>
                            <ui-limit-number class="input-width"
                                             @change="can_change(row,'shipping')"
                                             v-model="row.shipping"
                                             :limit="2"></ui-limit-number>
                        </td>
                        <!--操作-->
                        <td>
                            <span  v-if="(!add)&&(row.status===1)">
                                  <span v-for="(act,act_i) in enableList" :key="act_i">
                                        <span  @click="enable_click(act,row)" :class="[act.name===row.enabled||isPromoted===1?'opeate-disable':'','operate']">{{act.name}}</span>
                                        <span v-if="(enable.length-1)!==act_i">|</span>
                                    </span>
                            </span>
                            <i class="el-icon-delete2  mdfhove" v-else  @click="del_row(row)"></i>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div  class="mt-sm red bold-font">
                <div class="mb-xs">注意：1、产品属性值中“颜色”跟“尺寸”，请至少保证其中一项是全部符合平台刊登规则要求的；</div>
                <div style="margin-left:36px" v-if="showRef">2、当前的“参考销售价”及“参考运费”利润率为：{{grossProfit}}，允许降价刊登的幅度为：{{reduction}}；</div>
            </div>
        </div>
        <add-goods v-model="addlistVisable"   @add-goods="selected"></add-goods>
        <bundling-sales v-model="bundingDialog"
                        :data="transferData"
                        :is-fixed-price-item="true"
                        channel="3"
                        @submit="submit"></bundling-sales>
        <wish-size  v-model="sizeVisable"  :add="add"  @selected="selecte_size" ></wish-size>
        <price-calculation v-model="priceVisible"
                           :platform-information="platformInformation"></price-calculation>
        <mdf-img v-model="picVisable"
                 :img-form="imgTemp"
                 :cur-sku="skuName"
                 :show-tips="false"
                 :goods-id="goodId"
                 :channel_id="3"
                 @mdfimg-submit="mdfimg_submit"
                 :base-url="baseUrl"></mdf-img>
    </el-row>
</template>
<style lang="stylus">
    .p-attribute-set-wish{
        .style-width-60{
            width:60px;
        }
        .move-right{
            >.error-icon{
                right:58px !important;
            }
        }
        p{
            margin: 0!important;
        }
        .input-width{
            width: 90%;
        }
        .error{
            color: red;
        }
        .mdfhove:hover{
                color: #20A0FF;
                cursor: pointer;
        }
        .p-titleBgcol{
            background: #FAECE7;
            .p-attribute{
                color: #FFF;
                font-weight:bold;
                font-size: 1.7rem;
                padding: 5px 10px;
                background: #74BA4E;
                display: inline-block;
            }
        }
        .p-titleColour-attribute{
            padding: 20px;
            border-left: 3px solid #FF6C36;
        }
        .opeate-disable{
            background-color: #cccccc;
            color: #fff;
            cursor: not-allowed;
        }
    }

</style>
<script>
    import {api_pricing_rules} from "../../../../api/publish-smt";
    import {api_wish_color,api_wish_disable_sku,url_wish_disable_sku,url_wish_enable_sku,api_wish_enable_sku} from "../../../../api/kandeng";
    import {api_ref_price} from '../../../../api/publish-smt';
    import {get_path,random_img} from '../../ebay/kandeng-list/add-edit-listing/get-path';
    export default{
        permission:{
            url_wish_disable_sku,url_wish_enable_sku
        },
        data(){
            return {
                skuName:'',
                cloneTableData:[],
                colorContent:['缺少颜色值或颜色值有误！','提示：请添加或更正颜色值，可增加或减少单词间的空格、更改单词大小写、或检查单词拼写是否有误，以快速更正错误。'],
                sizeContent:['缺少尺寸值或尺寸值有误！','请添加或更正当前尺寸值'],
                grossProfit:'10%',
                reduction:'5%',
                showRef:true,
                priceVisible:false,
                addlistVisable:false,
                picVisable:false,
                sizeVisable:false,
                temp:{},
                imgTemp:{},
                price:"",
                mdfSize:"",
                mdfColor:"",
                count:"",
                shipping:"",
                msrp:"",
                ship_s:"",
                ship_e:"",
                colors:[],
                references:[],
                platformInformation:{
                    platform:4,
                    platform_name: 'Wish'
                },
                goodId:"",
                bundingDialog:false,
                transferData:[],
                enable:[
                    {name:'上架',api:url_wish_enable_sku,action(item,opeate){
                        this.$confirm(`您将${opeate.name} ${item.sku}`, '提示', {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning"
                        }).then(() => {
                            this.$http(api_wish_enable_sku,{sku:item.variant_id}).then(res=>{
                                this.$message({type: "success", message: res.message || res});
                                item.enabled='上架';
                            }).catch(code=>{
                                this.$message({type: "error", message: code.message || code})
                            })
                        }).catch(() => {
                            this.$message({
                                type: "info",
                                message: "已取消"
                            })
                        })
                    }},
                    {name:'下架',api:url_wish_disable_sku,action(item,opeate){
                        this.$confirm(`您将${opeate.name} ${item.sku}`, '提示', {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning"
                        }).then(() => {
                            this.$http(api_wish_disable_sku,{sku:item.variant_id}).then(res=>{
                                this.$message({type: "success", message: res.message || res});
                                item.enabled='下架';
                            }).catch(code=>{
                                this.$message({type: "error", message: code.message || code})
                            })
                        }).catch(() => {
                            this.$message({
                                type: "info",
                                message: "已取消"
                            })
                        })
                    }},
                ]
            }
        },
        mounted(){
            this.get_colors();
            this.init_reference(this.tableData.map(row=>row.sku_id));
            this.cloneTableData = clone(this.tableData);
        },
        methods:{
            get_path,
            random_img,
            random_click(){
                this.tableData.forEach(row=>{
                   if(!row.d_imgs)return;
                   row.d_imgs = random_img(row.d_imgs);
                   row.main_image = row.d_imgs[0].path;
                })
            },
            mdfimg_submit(val){
                let curObj = this.tableData.find(row=>row.sku===val.sku);
                if(!!curObj){
                    curObj.main_image = val.path[0].path;
                    curObj.d_imgs = val.path;
                }
            },
            /*
                * 促销产品特性
                *   1、不允许提高“吊牌价”、“销售价”、“运费”；（可降不可升）
                *   2、不允许降低“库存”；（可升不可降）
                *   3、不允许下架；
                * */
            can_change(row,name){
                console.log('CEHSI');
                if(this.isPromoted===1){
                    let find = this.cloneTableData.find(res=>res.sku_id===row.sku_id);
                    if(!!find){
                        if(!row[name]){
                            row[name] = find[name];
                        }
                        if(name==='msrp'||name==='price'||name==='shipping'){
                            if(find[name]<row[name]){
                                row[name] = clone(find[name]);
                                return this.$message({type:"warning",message:'促销产品不允许提高【吊牌价】【销售价】【运费】'});
                            }
                        }else if(name==='inventory'){
                            if(find[name]>row[name]){
                                row[name] = clone(find[name]);
                                return this.$message({type:"warning",message:'促销产品不允许降低产品数量'});
                            }
                        }
                    }
                }
            },
            transit_change(name,val,row){
                let cur = true;
                if(this.isPromoted===1) {
                    if (name === 'msrp' || name === 'price' || name === 'shipping') {
                        if (val > row[name]) {
                            cur = false;
                            return this.$message({type: "warning", message: '促销产品不允许提高【吊牌价】【销售价】【运费】'});
                        }
                    } else if (name === 'inventory') {
                        if (val < row[name]) {
                            cur = false;
                            return this.$message({type: "warning", message: '促销产品不允许降低产品数量'});
                        }
                    }
                }
                return cur;
            },
            //点击   捆绑/打包销售
            bundling_sales(row){
                this.curRow = window.clone(row);
                this.bundingDialog = true;
                let combine_sku_arr = window.clone(row.combine_sku);
                combine_sku_arr = combine_sku_arr.split("|");
                this.transferData = [];
                if(combine_sku_arr.length>0){
                    combine_sku_arr.forEach(it=>{
                        let cur = it.split("*");
                        let obj = {
                            id:row.id,
                            goods_id:row.goods_id,
                            local_sku:cur[0],
                            quantity:cur[1]
                        };
                        this.transferData.push(obj);
                    })
                }
            },
            //提交   捆绑/打包销售 映射重新提交的数据
            submit(val,val2){
                let cur = this.tableData.find(row=>{return row.id === this.curRow.id});
                if(!!cur){
                    cur.combine_sku = val;
                    this.transferData = val2;
                    this.$message({type:"success",message:"捆绑成功！"})
                }
                this.bundingDialog = false;
            },
            blur_change(name,val){
                if(!val)return;
                this.tableData.forEach(row=>{
                    if(row.isCheck){
                        switch(name){
                            case 'msrp':
                                this.transit_change('msrp',val,row)&&(row.msrp = val);
                                this.msrp = '';
                                break;
                            case 'price':
                                this.transit_change('price',val,row)&&(row.price = val);
                                this.price = '';
                                break;
                            case 'count':
                                this.transit_change('inventory',val,row)&&(row.inventory = val);
                                this.count = '';
                                break;
                            case 'ship_s':
                                row.shipping_time.splice(0,1,val);
                                this.ship_s = '';
                                break;
                            case 'ship_e':
                                row.shipping_time.splice(1,1,val);
                                this.ship_e = '';
                                break;
                            case 'shipping':
                                this.transit_change('shipping',val,row)&&(row.shipping = val);
                                this.shipping = '';
                                break;
                            case 'mdfSize':
                                row.size = val;
                                this.mdfSize = '';
                                break;
                            case 'mdfColor':
                                row.color = val;
                                this.color_blur(row);
                                this.mdfColor = '';
                                break;
                        }
                    }

                });
            },
            delete_pic(){
                if(this.tableData&&this.tableData.length){
                    let filterList = this.tableData.filter(row=>!!row.isCheck);
                    if(filterList.length<=0) return this.$message({type:"warning",message:"请先选择要操作的数据"});
                    this.$confirm('此操作将删除当前SKU列表中已勾选数据的展图,确认进行此操作吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        filterList.forEach(row=>{
                            row.main_image = '';
                        })
                    }).catch(code=>{
                        this.$message({
                            type:'info',
                            message:"已取消删除"
                        })
                    });
                }
            },
            blur_one_s(value,row){
            	let find = this.tableData.find(x=>{
            		return x.id===row.id;
                });
                if(!!find&&!!row.shipping_time[1]&&Number(value)>=Number(row.shipping_time[1])){
                    this.$set(find.shipping_time,0,Number(row.shipping_time[1])-1+'');
                }
            },
            blur_one_e(value,row){
                let find = this.tableData.find(x=>{
                    return x.id===row.id;
                });
                if(!!find&&!!row.shipping_time[0]&&Number(value)<=Number(row.shipping_time[0])){
                    this.$set(find.shipping_time,1,Number(row.shipping_time[0])+1+'');
                }
            },
            blur_batch_s(value){
        		if(!!this.ship_e&&Number(value)>=Number(this.ship_e)){
        			this.ship_s = Number(this.ship_e)-1;
                }
            },
            blur_batch_e(value){
                if(!!this.ship_s&&Number(value)<=Number(this.ship_s)){
                    this.ship_e = Number(this.ship_s)+1;
                }
            },
            get_min_number(val){
                let cur = 0;
                if(!!val){
                    cur = parseInt(val)+1;
                }
                return cur;
            },
            get_max_number(val){
                if(!val) return 999;
                let cur = 0;
                if(!!val){
                    cur = parseInt(val)-1;
                }
                return cur;
            },
//            batch_mdf(){
//                let cur = this.tableData.find(row=>!!row.isCheck);
//                if(!!cur){
//                    this.price&&this.change_price();
//                    this.msp&&this.change_msp();
//                    this.count&&this.change_count();
//                    this.shipping&&this.change_shipping();
//                    this.ship_s&&this.ship_e&&this.change_ship();
//                }else {
//                    this.$message({type: "info", message: '请选择要修改的SKU'})
//                }
//            },
            clear_img(){
                let cur = this.tableData.find(row=>!!row.isCheck);
                if(!!cur){
                    this.tableData.forEach(row=>{
                        row.isCheck&&(row.main_image='');
                    })
                }else {
                    this.$message({type: "info", message: '请选择要修改的SKU'})
                }
            },
            enable_click(act,item){
                if(item.enabled===act.name||this.isPromoted===1){
                    return
                }
                act.action.call(this,item,act)
            },
            cellClick(row, column){
                switch (column.columnKey){
                    case 'ref-price':
                        const price = this.caluc_reference_price(row);
                        if(price){
                            row.price = price;
                        }
                        break;
                    case 'ref-msrp':
                        const msrp = this.caluc_reference_msrp(row);
                        if(msrp){
                            row.msrp = msrp;
                        }
                        break;
                    case 'ref-shipping':
                        const shipping = this.caluc_reference_shipping(row);
                        if(shipping){
                            row.shipping = shipping;}
                        break;
                }
            },
            headerClick(column,event){
                this.tableData.forEach(row => this.cellClick(row, column))
            },
            caluc_reference_price(row){
                let ref = null;
                if(ref = this.get_reference(row.sku_id)){
                    return ref.sale_price;
                }else{
                    return '';
                }
            },
            caluc_reference_msrp(row){
                let ref = null;
                if(ref = this.get_reference(row.sku_id)){
                    return ref.tag_price;
                }else{
                    return '';
                }
            },
            caluc_reference_shipping(row){
                let ref = null;
                if(ref = this.get_reference(row.sku_id)){
                    return ref.shipping_fee;
                }else{
                    return ''
                }
            },
            get_reference(sku_id){
                if(!sku_id){
                    return '';
                }
                return this.references.find(ref=>{
                    return ref.channel_id === this.channelId
                        && ref.account_id === this.accountId
                        && Number(ref.sku_id) === Number(sku_id);
                });
            },
            init_reference(skuIds){
                const params = {
                    channel_id:this.channelId,
                    account_id:this.accountId,
                    sku_id:skuIds.filter(row=>!!row),
                };
                this.$http(api_ref_price, params).then(res=>{
                    if(!res||(res instanceof Array)){
                        this.showRef=false;
                        this.$forceUpdate();
                        return
                    }
                    this.showRef=true;
                    for(let key in res ){
                        const find = this.references.find(ref=>{
                            return Number(ref.sku_id) === Number(key);
                        });
                        this.reduction=res[key].reduction;
                        this.grossProfit=res[key].gross_profit;
                        (!res[key].reduction)&&(!res[key].gross_profit)&&(this.showRef=false);
                        if(!find){
                            this.references.push(Object.assign(res[key],{
                                channel_id:this.channelId,
                                account_id:this.accountId,
                                sku_id:key,
                            }))
                        }
                    }
                })
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
            handleSelect(item){
              setTimeout(()=>{
                  this.color_blur(item)
              },300)
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
                return !!find
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
            change_size(row){
                this.isNewChange = false;
                this.temp=row;
                this.sizeVisable=true;
            },
            change_new_size(){
                this.isNewChange = true;
                this.sizeVisable=true;
            },
            change_price(){
                this.tableData.forEach(row=>{
                    row.isCheck&&(row.price=this.price);
                })
            },
//            change_msp(){
//                this.tableData.forEach(row=>{
//                    row.isCheck&&(row.msrp=this.msp);
//                })
//            },
            change_ship(){
                this.tableData.forEach(row=>{
                    if(row.isCheck){
                        row.shipping_time.splice(0,1,this.ship_s);
                        row.shipping_time.splice(1,1,this.ship_e)
                    }
                })
            },
            change_shipping(){
                if(!this.shipping){
                    this.$message({
                        message: '请输入运费',
                        type: 'warning'
                    });
                    return ;
                }
                this.tableData.forEach(row=>{
                    row.isCheck&&(row.shipping=this.shipping);
                })
            },
            change_count(){
                this.tableData.forEach(row=>{
                    row.isCheck&&(row.inventory=this.count);
                })
            },
            del_row(row){
                let index=this.tableData.indexOfFun(row,function (old,row) {
                      return old.id===row.id
                });
                this.tableData.splice(index,1)
            },
            add_sku(){
                this.addlistVisable=true;
            },
            /*处理刊登定价*/
            price_field(PricingRules,skuId,field){
                let priceField = '';
                if(PricingRules&&PricingRules[skuId]&&PricingRules[skuId].total_price){
                    priceField = parseFloat(PricingRules[skuId][field])<=0?'':PricingRules[skuId][field];
                }
                return priceField;
            },
            async selected(val,data){
                let Size = "";
                let Color = "";
                let curColor = [];
                let curSize = "";
                if(data.keys&&data.keys.length>0){
                    Size = data.keys.find(row=>row.indexOf("Size")>0);
                    Color = data.keys.find(row=>row.indexOf("Color")>0);
                }
                if(val.length>0){
                    let ids = val.map(row=>row.goods_id);
                    this.$emit('sku-submit',ids);
                    let skuIdList = val.map(row=>row.sku_id);
                    let PricingRules = await this.$http(api_pricing_rules,{
                        channel_id:3,
                        account_id:this.accountId,
                        site_code:0,
                        sku_id:skuIdList,
                    });

                    val.forEach(row=>{
                        if(!!Color)curColor = row[Color].split("|");
                        if(!!Size)curSize = row[Size];
                        let data={
                            isCheck:true,
                            error_size:false,
                            goods_id:row.goods_id,
                            error_color:false,
                            sku:row.sku,
                            cost_price:row.cost_price,
                            color:curColor[1]||"",
                            ref_color:curColor[1]||"",
                            size:curSize,
                            ref_size:curSize,
                            weight:row.weight,
                            price:this.price_field(PricingRules,row.sku_id,'sale_price'),
                            msrp:this.price_field(PricingRules,row.sku_id,'tag_price'),
                            inventory:999,
                            shipping_time:[5,15],
                            shipping:this.price_field(PricingRules,row.sku_id,'shipping_fee'),
                            main_image:row.thumb,
                            combine_sku:`${row.sku}*1`,
                            id:Date.now(),
                        };
                        this.tableData.push(data);
                    })
                }
            },
            selecte_size(val){
                if(this.isNewChange){
                    this.mdfSize = val;
                    this.blur_change('mdfSize',this.mdfSize);
                }else{
                    this.temp.size=val;
                }
            },
            change_row_image(row){
                this.skuName = row.sku.includes('|')?row.sku.split('|')[0]:row.sku;
                this.picVisable=true;
                this.goodId = row.goods_id || this.goodsId;
                this.imgTemp = clone(row);
                this.imgTemp.path = clone(row.d_imgs);
                delete this.imgTemp.d_imgs;
            },
        },
        computed:{
            checkAll:{
                get(){
                    let cur= this.tableData.find(row=> !row.isCheck);
                    return !cur;
                },
                set(val){
                    this.tableData.forEach(row=>{
                        row.isCheck = !!val;
                    })
                }
            },
            enableList(){
                return  this.enable.filter(row=>{
                    return this.$hasPermission(row.api)
                })
            },
            batchMin(){
            	return Number(this.ship_s)+1;
            },
            batchMax(){
                return Number(this.ship_e)-1;
            }
        },
        filters:{
            fitlerPrice(val){
                return val?parseFloat(val).toFixed(2):val;
            }
        },
        watch:{
            trueId(val){
                console.log(val,'trueId');
            },
            tableData(){
                const sku_ids = this.tableData.map(row=>row.sku_id);
                this.init_reference(sku_ids);
            },
        },
        props:{
            isPromoted:{//是否为促销产品
                required:true,
                type:Number
            },
            curModel:{//当前模块
                required: true,
                type: String
            },
            trueId:{
                required:true,
            },
            baseUrl:{
                required:true,
                type:String
            },
            label:{
                required:true,
                type:String
            } ,
            add:{
                required:true,
                type:Boolean
            } ,
            tableData:{
                required:true,
                type:Array
            },
            channelId:{
                required:true,
                type:Number
            },
            accountId:{
                required:true,
                type:Number
            },
            id:{
                required:true,
            },
            spu:{
                required:true,
            },
            goodsId:{
                required:true,
                type:[String,Number]
            },
            isCopy:{
                type:Boolean
            }
        },
        components: {
            addGoods:require('../../../../api-components/add-goods.vue').default,
            bundlingSales:require('../../ebay/kandeng-list/add-edit-listing/bundling-sales.vue').default,
            wishSize:require("./wish-size.vue").default,
            uiAutocomplete:require("../../../../components/ui-autocomplete.vue").default,
            priceCalculation:require("../../../base/publish-rules/price-calculation.vue").default,
            uiLimitNumber:require('../../../../components/ui-limit-number.vue').default,
            integerInput:require('../../../../components/integer-input.vue').default,
            errorIconTips:require('../../../../components/error-icon-tips.vue').default,
            mdfImg:require('../../ebay/kandeng-list/add-edit-listing/mdf-img.vue').default,
            uiTable:require('../../../../components/ui-table.vue').default,
            uiTip:require('../../../../components/ui-tip.vue').default,
            integerZeroInput:require('../../../../components/integer-zero-input').default
        }
    }
</script>
