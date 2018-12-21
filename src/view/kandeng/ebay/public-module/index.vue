    <template>
        <page class="p-index">
            <search-card @search="search" @enter="search" :params="params" :clears="clears">
                <label class="inline ml-lg">模块名称：</label>
                <el-input class="inline width-super mr-sm" v-sf.name v-model="params.name" placeholder="请输入模块名称"></el-input>
            </search-card>
            <!--添加 && 删除 -->
            <div class="mt-xs mb-xs ml-sm">
                <permission tag="ElButton"
                            :route="apis.url_save_common_model"
                            class="inline"
                            type="primary"
                            @click.native="add" size="mini">添加</permission>
            </div>
            <!--点击添加出现的添加弹框-->
            <add-module
                    ref="addModule"
                    :title="title"
                    :model-type="modelType"
                    v-model="addModuleDialog"
                    :siteList="siteList"
                    :form="add_edit_form"
                    :location-list="locationList"
                    :country-list="countryList"
                    @change-model-type="change_model_type"
                    @add-new-module="add_new_module"
            ></add-module>
            <!--获取公共模块列表-->
            <el-row :gutter="8">
                <!--左侧公用模块类型-->
                <el-col :span="4">
                    <el-card class="ebay-kandeng-card" v-resize="{height:10}">
                        <div slot="header" style="color: #ffffff;">公用模块类型</div>
                        <div>
                            <table class="template">
                                <tbody>
                                    <tr v-for="(item,index) in moduleTypeList" :key="index"  :class="[clickData[index]?'active-color':'']" @click="click_left_row(item,index)">
                                        <td class="align-left">{{item.label}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </el-card>
                </el-col>
                <!--右侧列表-->
                <el-col :span="20">
                    <el-card class="ebay-kandeng-card">
                        <div slot="header">
                            <!-- TODO 全选所有页功能已完成,但是未做全删除功能,所以暂时隐藏该功能 -->
                            <div style="display:none;">
                                <el-checkbox label="所有页全选" v-model="checkAll" @change="selection_all_data(checkAll)"></el-checkbox>
                            </div>
                        </div>
                        <el-table
                            class="scroll-bar"
                            :data="data.tableList"
                            @select="select_one"
                            v-resize="{height:41}"
                            @selection-change="selection_all"
                            v-loading="loading"
                            element-loading-text="玩命加载中..."
                            highlight-current-row
                        >
                            <div slot="empty" class="no-data-reminder">
                                <i></i>
                                {{emptyText}}
                            </div>
                            <el-table-column type="selection" width="35px"></el-table-column>
                            <el-table-column label="模板名称" prop="model_name"></el-table-column>
                            <el-table-column label="站点" inline-template>
                                <div>{{filterStatus(row.site)}}</div>
                            </el-table-column>
                            <el-table-column label="公用模块类型" prop="model_type"></el-table-column>
                            <el-table-column label="更新时间" inline-template>
                                <times :time="row.update_time"></times>
                            </el-table-column>
                            <el-table-column label="操作" inline-template>
                                <div>
                                    <permission tag="span"
                                                :route="apis.url_save_common_model"
                                                class="operate"
                                                @click="edit_module(row)">编辑</permission>
                                    <span v-if="showLine">|</span>
                                    <permission tag="span"
                                                v-if="row.model_type==='trans'"
                                                :route="apis.url_delete_trans"
                                                class="operate"
                                                @click="cur_delete(row)">删除</permission>
                                    <permission v-else tag="span"
                                                :route="apis.url_delete_model"
                                                class="operate"
                                                @click="cur_delete(row)">删除</permission>
                                </div>
                            </el-table-column>
                        </el-table>
                        <el-pagination
                                class="fr"
                                @size-change="size_change"
                                @current-change="page_change"
                                :current-page="data.page"
                                :page-sizes="[20, 50, 100, 200,500]"
                                :page-size="data.pageSize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="data.count">
                        </el-pagination>
                    </el-card>
                </el-col>
            </el-row>
        </page>
    </template>
    <style lang="stylus">
        .ebay-kandeng-tree{
            box-sizing:border-box;
            color:#fff;
            width:100%;
            height:26px;
            padding:0 5px;
            line-height: 32px;
            font-size:1.2rem;
            display:inline-block;
            background:#6495ED;
            border:1px solid #6495ED;
            border-top-left-radius:4px;
            border-top-right-radius:4px;
            border-bottom:1px solid transparent;
        }
        .ebay-kandeng-card>.el-card__header{
            background: #6495ED;
            padding: 3px 5px;
            height: 32px;
            line-height: 26px;
            .el-checkbox__label {
                color: #fff;
            }
        }
    </style>
    <script>
        import {api_common_modeList,
            api_get_ebay_site,
            api_delete_model,
            api_delete_trans,
            api_edit_model,
            api_get_trans,
            api_get_locations,
            api_get_countrys} from '../../../../api/ebay-kandeng-public-module';
        import {url_save_common_model,url_delete_model,url_delete_trans} from '../../../../api/ebay-kandeng-public-module';
        import {get_local} from '../kandeng-list/add-edit-listing/get_localtion';
        export default{
            permission:{
                url_save_common_model,
                url_delete_model,
                url_delete_trans
            },
            page:{},
            refresh(){
                this.model_type = "sale";
                this.params.name = "";
                this.data = {
                        page:1,
                        pageSize:50,
                        count:0,
                };
                this.clickData_methods(0);
                this.get_common_modeList();
            },
            data(){
                return{
                    /*搜索列表字段*/
                    moduleTypeList:[
                        {label:"销售说明",value:"sale",disabled:true},
                        {label:"接受买家还价(Best Offer)",value:"bargaining"},
                        {label:"备货时间",value:"choice"},
                        {label:"不运送地区",value:"exclude"},
                        {label:"橱窗展示(Gallery)图片",value:"gallery"},
                        {label:"自提(Local Pickup)",value:"pickup"},
                        {label:"商品所在地",value:"location"},
                        {label:"私人物品",value:"individual"},
                        {label:"数量",value:"quantity"},
                        {label:"收款选项",value:"receivables"},
                        {label:"买家限制",value:"refuse"},
                        {label:"退货",value:"returngoods"},
                        {label:"物流设置",value:"trans"},
                    ],
                    data:{
                        tableList:[],
                        page:1,
                        pageSize:50,
                        count:0,
                    },
                    checkAll:false,
                    batchId:[],
                    loading:false,
                    firstLoading: true,
                    siteList:[],
                    model_type:"sale",
                    name:"",
                    /*添加字段*/
                    addModuleDialog:false,
                    /*左侧表格样式数据*/
                    clickData:[],
                    title:"",
                    modelType:"",
                    countryList:[],
                    locationList:[],
                    add_edit_form:{
                        model_type:"",
                        site:"",
                        model_name:"",
                        /*销售说明*/
                        payment:"",
                        delivery_detail:"",
                        terms_of_sales:"",
                        about_us:"",
                        contact_us:"",
                        /*备货时间*/
                        choice_date:"",
                        /*接受买家还价*/
                        best_offer:0,
                        accept_lowest_price:"",
                        reject_lowest_price:"",
                        /*收款方式*/
                        pay_method:[],
                        auto_pay:false,
                        payment_instructions:"",
                        /*数量*/
                        quantity:"",
                        /*自提*/
                        local_pickup:false,
                        /*私有*/
                        individual_listing:1,
                        /*计数器*/
                        //                counter:"",
                        /*不送达地区*/
                        exclude:[],
                        /*橱窗展示*/
                        picture_gallery:0,
                        /*发货地*/
                        location:"",
                        country:"",
                        post_code:"",
                        /*退货策略*/
                        return_policy:"",
                        return_type:"",
                        return_time:"",
                        restocking_fee_code:"",
                        extension:false,
                        return_shipping_option:"",
                        return_description:"",
                        /*买家限制*/
                        refuse:0,
                        link_paypal:false,
                        registration:false,
                        strikes:false,
                        strikes_count:"",
                        strikes_period:"",
                        credit:false,
                        violations:false,
                        violations_count:"",
                        violations_period:"",
                        requirements_feedback_score:"",
                        requirements:false,
                        requirements_max_count:"",
                        minimum_feedback:false,
                        minimum_feedback_score:"",
                        /*物流设置*/
                        /*物流方式*/
                        trans:[
                            {inter:0,trans_code:"",cost:"",add_cost:"",extra_cost:"",location:[]},
                            {inter:1,trans_code:"",cost:"",add_cost:"",extra_cost:"",is_all_location:false,location:[]},
                        ],
                    },
                    params:{
                        name:"",
                    },
                    clears:{}
                }
            },
            mounted(){
                for(let i=0;i<this.moduleTypeList.length;i++){
                    this.clickData.push(false);
                    this.clickData[0] = true;
                }
            },
            created(){
                this.get_common_modeList();
                this.get_ebay_site();
                this.get_ebay_countrys();
                this.get_ebay_location();

            },
            filters:{

            },
            computed:{
                showLine(){
                    return (this.$hasPermission(url_save_common_model)&&this.$hasPermission(url_delete_model))||(this.$hasPermission(url_save_common_model)&&this.$hasPermission(url_delete_trans));
                },
                emptyText(){
                    return this.firstLoading?'等待请求数据中...':'暂无数据'
                }
            },
            methods:{
                get_local,
                /*列表搜索&清除搜索*/
                search(){
                    this.get_common_modeList();
                },

                /*添加&删除*/
                add(){
                    this.title = "添加公用模板";
                    this.addModuleDialog = true;
                    this.add_edit_form = {
                        model_type:"",
                        model_name:"",
                        site:"",
                        payment:"",
                        delivery_detail:"",
                        about_us:"",
                        contact_us:"",
                        terms_of_sales:"",
                        choice_date:"",
                        best_offer:0,
                        accept_lowest_price:"",
                        reject_lowest_price:"",
                        pay_method:[],
                        auto_pay:false,
                        payment_instructions:"",
                        quantity:"",
                        local_pickup:false,
                        individual_listing:1,
                        picture_gallery:0,
                        location:"",
                        country:"",
                        post_code:"",
                        exclude:this.get_local(this.locationList),
                        return_policy:"",
                        return_type:"",
                        return_time:"",
                        restocking_fee_code:"",
                        extension:false,
                        return_shipping_option:"",
                        return_description:"",
                        refuse:0,
                        link_paypal:false,
                        registration:false,
                        strikes:false,
                        strikes_count:"",
                        strikes_period:"",
                        credit:false,
                        violations:false,
                        violations_count:"",
                        violations_period:"",
                        requirements_feedback_score:"",
                        requirements:false,
                        requirements_max_count:"",
                        minimum_feedback:false,
                        minimum_feedback_score:"",
                        //默认没有国际运输方式
                        trans:[
                            {inter:0,trans_code:"",cost:"",add_cost:"",extra_cost:"",location:[]},
//                            {inter:1,trans_code:"",cost:"",add_cost:"",extra_cost:"",is_all_location:false,location:this.get_local(this.locationList)},
                        ],
                    };
                },
                cur_del(){},
                change_model_type(){},
                add_new_module(val){
                    this.model_type=val;
                    let index = this.moduleTypeList.findIndex(row=>row.value===val);
                    if(index!==-1){
                        this.clickData_methods(index);
                    }
                    this.get_common_modeList();
                },
                clickData_methods(index){
                    this.clickData = this.clickData.map(()=>{
                        return false;
                    });
                    this.clickData[index] = true;
                },
                /*右侧全选所有页*/
                selection_all_data(val){
                    this.batchId = [];
                    if(val){
                        this.data.tableList.forEach((row)=>{
                            this.batchId.push(row.id);
                            this.$message({type:"success",message:`已全选所有页，共计：${this.batchId.length}条数据`});
                        });
                    }else{
                        this.$message({type:"success",message:`已取消全选`});
                    }
                },

                /*公用列表模块  右侧table多选框*/
                selection_all(val){
                    this.batchId = [];
                    if(val.length>0){
                        val.forEach((row)=>{
                            this.batchId.push(row.id);
                        })
                    }
                    console.log("selection_all",val);
                },
                select_one(val){
                    this.batchId = [];
                    if(val.length>0){
                        val.forEach((row)=>{
                            this.batchId.push(row.id);
                        })
                    }
                    console.log("select_one",val);
                },
                /*编辑*/
                edit_module(row){
                    this.title = `编辑模板：${row.model_name} 信息`;
                    this.addModuleDialog = true;
                    this.edit_model(row);
                },
                /*删除*/
                cur_delete(row){
                    this.delete_model(row);
                },

                /*列表翻页*/
                size_change(size){
                    this.data.pageSize = size;
                    this.get_common_modeList();
                },
                page_change(page){
                    this.data.page = page;
                    this.get_common_modeList();
                },

                /*点击左侧公用模板类型*/
                click_left_row(item,index){
                    this.clickData_methods(index);
                    this.model_type = this.moduleTypeList[index].value;
                    this.get_common_modeList();
                },

                //获取公共模块列表   API
                get_common_modeList(){
                    let params = {
                        model_type:this.model_type,
                        name:this.params.name.trim(),
                        size:this.data.pageSize,
                        page:this.data.page
                    };
                    this.loading = true;
                    this.$http(api_common_modeList,params).then(res=>{
                        this.loading = false;
                        this.firstLoading = false;
                        this.data.tableList = res.data;
                        this.data.count = res.count;
                    }).catch(code=>{
                        console.log(code);
                        setTimeout(()=>{
                            this.loading = false;
                            this.firstLoading = false;
                        },200);
                    })
                },

                //获取Ebay站点   API
                get_ebay_site(){
                    this.siteList = [];
                    this.$http(api_get_ebay_site).then(res=>{
                        this.siteList = res.data;
                    }).catch(code=>{
                        console.log(code);
                    })
                },

                /*编辑   API*/
                edit_model(row){
                    let params = {
                        model_type:row.model_type,
                        id:row.id,
                    };
                    if(row.model_type!=='trans'){
                        this.$http(api_edit_model,params).then(res=>{
                            if(!!res.data.extension){res.data.extension = res.data.extension?true:false}
                            if(!!res.data.local_pickup){res.data.local_pickup = res.data.local_pickup?true:false}
                            if(!!res.data.auto_pay){res.data.auto_pay = res.data.auto_pay?true:false}
                            if(!!res.data.pay_method){res.data.pay_method = JSON.parse(res.data.pay_method)}
                            if(!!res.data.link_paypal){res.data.link_paypal = res.data.link_paypal?true:false}
                            if(!!res.data.registration){res.data.registration = res.data.registration?true:false}
                            if(!!res.data.violations){res.data.violations = res.data.violations?true:false}
                            if(!!res.data.strikes){res.data.strikes = res.data.strikes?true:false}
                            if(!!res.data.credit){res.data.credit = res.data.credit?true:false}
                            if(!!res.data.requirements){res.data.requirements = res.data.requirements?true:false}
                            if(!!res.data.minimum_feedback){res.data.minimum_feedback = res.data.minimum_feedback?true:false}
                            if(!!res.data.exclude){res.data.exclude = JSON.parse(res.data.exclude)}
                            if(!!res.data.quantity) res.data.quantity = String(res.data.quantity);
                            this.modelType = res.data.model_type;
                            this.add_edit_form = res.data;
                            let curForm = window.clone(res.data);
                            this.$nextTick(()=>{
                                for(let i in curForm){
                                    this.add_edit_form[i] = curForm[i];
                                }
                                this.$nextTick(()=>{
                                    for(let i in curForm){
                                        this.add_edit_form[i] = curForm[i];
                                    }
                                    this.$refs.addModule.get_edit_data();
                                });
                            });
                        }).catch(code=>{
                              console.log("code",code);
                        });
                    }else{
                        this.$http(api_get_trans,params).then(res=>{
                            let transList = res.data.trans;
                            let obj1 = {inter:0,trans_code:"",cost:"",add_cost:"",extra_cost:"",location:[]};
                            if(transList.length<=0){
                                // 默认没有国际运输方式
                                res.data.trans=[...obj1];
                            }else if(transList.length===1){
                                let cloneData = transList;
                                if(cloneData[0].inter===1){
                                    transList.push(obj1);
                                    transList.forEach(row=>{
                                        if(!!row.location&&row.inter===1) {
                                            if(row.location==="Worldwide"){
                                                row.location = this.get_local(this.locationList);
                                            }else{
                                                row.location = JSON.parse(row.location)
                                            }
                                        }
                                    })
                                }
                            }else{
                                res.data.trans.forEach(row=>{
                                    if(!!row.location) {
                                        if(row.location==="Worldwide"){
                                            row.location = this.get_local(this.locationList);
                                        }else{
                                            row.location = JSON.parse(row.location)
                                        }
                                    }
                                })
                            }
                            this.modelType = res.data.model_type;
                            let curForm = window.clone(res.data);
                            this.add_edit_form = res.data;
                            this.$nextTick(()=>{
                                for(let i in curForm){
                                    this.add_edit_form[i] = curForm[i];
                                }
                                this.$nextTick(()=>{
                                    for(let i in curForm){
                                        this.add_edit_form[i] = curForm[i];
                                    }
                                    this.$nextTick(()=>{
                                        this.$refs.addModule.get_edit_data();
                                    });
                                });
                            });
                        }).catch(code=>{
                            console.log("trans",code);
                        });

                    }
                },

                //删除  API
                delete_model(row){
                    this.$confirm(`您将删除${row.model_name}模块组合,确认此操作吗？`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let params = {
                            model_type:row.model_type,
                            id:row.id,
                        };
                        /*删除物流  单独接口*/
                        if(row.model_type==='trans'){
                            this.$http(api_delete_trans,params).then(res=>{
                                this.$message(res.message);
                            }).catch(code=>{
                                this.$message({message:code.message,type:'error'});
                            });
                            return;
                        }
                        this.delete_public_data(params);
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消'
                        });
                    });
                },
                delete_public_data(params,isTrue){
                    /*删除  公共接口*/
                    if(isTrue)this.$set(params,'confirm',true);
                    this.$http(api_delete_model,params).then(res=>{
                        if(res.request_confirm){
                            this.$confirm(`${res.message}`, '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                this.delete_public_data(params,true)
                            });
                        }else{
                            this.$message(res.message);
                            let index = this.data.tableList.findIndex(row=>Number(row.id)===Number(params.id));
                            if(index>-1)this.data.tableList.splice(index,1);
                            this.$set(this.data,'count',this.data.count-1)
                        }
                    }).catch(code=>{
                        this.$message({message:code.message,type:'error'});
                    })
                },
                //过滤  列表站点
                filterStatus(val){
                    let cur = this.siteList.find((row)=>{
                        if(row.siteid === val) return row;
                    })
                    if(!!cur)return  cur.name;
                    return '该模块下无站点';
                },
                /*获取Ebay国家代码  适用于商品所在地*/
                get_ebay_countrys(){
                    this.countryList = [];
                    this.$http(api_get_countrys).then(res=>{
                    this.countryList = res.data;
                    }).catch(code=>{
                        console.log("res",code);
                    });
                },
                /*获取Ebay国家代码  适用于物流方式*/
                get_ebay_location(){
                    this.locationList = [];
                    this.$http(api_get_locations).then(res=>{
                        this.locationList = res.data;
                    }).catch(code=>{
                        console.log("res",code);
                    });
                },

            },
            components:{
                addModule:require('./add-module.vue').default,
                searchCard:require('../../../../components/search-card.vue').default,
            }
        }
    </script>
