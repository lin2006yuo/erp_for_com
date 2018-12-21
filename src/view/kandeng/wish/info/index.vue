<template>
    <page class="p-index-wish-publish over-flow-auto">
        <!--关联商品信息-->
        <relevance-goods
                v-loading="loading"
                element-loading-text="玩命加载中..."
                :is-promoted="isPromoted"
                label="关联商品信息"
                :add="isAdd"
                :cur-model="curModel"
                :id="goodsId"
                :true-id="trueId"
                :is-copy="isCopy"
                :isTime="param.isTime"
                :spu="spu"
                :relevanceForm="relevanceData"
                ref="goods">
        </relevance-goods>
        <div class="page-fixed mt-lg">
            <el-button size="mini" v-if="isAdd"
                       type="primary"
                       class="p-wish-btn"
                       :disabled="isSubmit"
                       @click.native="all_apply">应用到所有</el-button>
            <el-button size="mini"
                       class="p-wish-btn"
                       type="primary"
                       :disabled="isSubmit"
                       @click.native="save" >保存为草稿</el-button>
            <el-button size="mini"
                       v-if="isAdd"
                       class="p-wish-btn"
                       type="primary"
                       :disabled="isSubmit"
                       @click.native="publish" >提交刊登</el-button>
            <el-button size="mini"
                       v-if="!isAdd"
                       type="primary"
                       class="p-wish-btn"
                       :disabled="isSubmit"
                       @click.native="update">提交刊登</el-button>
            <el-button size="mini"
                       class="p-wish-btn"
                       @click.native="cancel">取消</el-button>
        </div>
    </page>
</template>
<style lang="stylus">
    .p-index-wish-publish{
    .card{
        margin-left: 0;
    }
    .p-wish-btn{
        margin-right: 20px;
    }
    }
</style>
<script>
    import relevanceGoods from './relevance-goods.vue' //-----关联商品信息引入
    import {api_product_getData,api_wish_save,api_wish_rsync,api_wish_add,api__wish_update,api_wish_color,api_wish_channel} from '../../../../api/kandeng';
    import {mapGetters} from "vuex";
    import {api_git_img} from '../../../../api/amazon-publish';
    export default{
        page: {
            multiple: true,
            beforeClose(){
                if(!this.isChange){
                    return true
                }else {
                    return this.$confirm(`检测到有数据更改但未保存，此操作将会丢失已更改的最新数据，仍然进行此操作吗?`, '提示', {
                        confirmButtonText: '继续离开',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        return true
                    }).catch(code=>{
                        return false
                    })
                }
            }
        },
        data(){
            return {
                isSubmit:false,
                trueId:"",
                imagDataList:[],
                baseUrl:"",
                spu:"",
                dataId:0,
                isPromoted:0,
                relevanceData: {
                    channel_id:0,
                },
//                添加
                isAdd:false,
//                当前模块
                curModel:"",
//                复制
                isCopy:false,
                goodsId:0,
                colors:[],
                loading:false,
                isChange:false,
                dataParams:{},
                channels:[],
            }
        },
        async created(){
            if(window.objlength(this.param)!==0){
                this.curModel = this.param.curModel;
                this.dataId=this.param.id;
                this.isAdd=this.param.isAdd;
                this.isCopy=this.param.isCopy;
                this.isPromoted = !!this.param.is_promoted?this.param.is_promoted:0;
                this.goodsId=!!this.param.goods_id?this.param.goods_id:0;
                let default_account_id=this.param.default_account_id;
                //添加状态  查看编辑 //复制状态
                if(this.isCopy){
                    this.dataParams={id:this.dataId,status:"copy"};  //复制 的参数
                    let imgRes = await this.get_img(this.goodsId);
                    this.imagDataList = [];
                    if(!!imgRes||imgRes.length>0) {
                        imgRes.forEach(row => {
                            this.imagDataList = [...this.imagDataList, ...row.images];
                        });
                        this.baseUrl = imgRes[0].baseUrl;
                    }
                }else {
                    if(this.isAdd){
                        this.dataParams={goods_id:this.dataId,status:"add"};  //添加参数
                    }else {
                        this.dataParams={id:this.dataId,status:"edit"};      //编辑参数
                    }
                }
                this.loading=true;
                this.isChange=false;
                this.$http(api_product_getData,this.dataParams).then(res=>{
                    this.relevanceData = this.action(res.data,default_account_id);
                    setTimeout(()=>{
                        this.loading=false;
                    },100)
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    })
                })
            }
            this.get_colors();
        },
        methods:{
            all_apply(){
                return this.$confirm('您确定要将当前页面内容全部覆盖到其他已选的平台帐号中吗？,此操作将会覆盖其他已选帐号中的数据', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let tab=this.$refs.goods.currentTab;
                    let find=this.relevanceData.vars.find(row=>{
                        return row.account_code===tab;
                    });
                    if(!!find){
                        let flag = true;
                        let cur = this.relevanceData.vars.map((row,row_i)=>{
                            if(row.tags.length>10){
                                this.$message({type:"warning",message:"【标签】数量最多为10个，现已超出限制，请更改！"});
                                flag = false;
                            }else{
                                let pastData = window.clone(row);
                                row = window.clone(find);
                                row.account_code=pastData.account_code;
                                row.account_name=pastData.account_name;
                                row.accountid=pastData.accountid;
                                this.$message({type:"success",message:"应用成功！"});
                                return row
                            }
                        });
                        if(!!flag) this.relevanceData.vars = cur;
                    }else {
                        this.$message({message:"请选择应用的账号", type:'warning'})
                    }
                    return Promise.resolve();
                }).catch(() => {

                });
            },
            get_colors(){
                let storage=window.sessionStorage;
                if(storage.publish_wish_colors){
                    let a=window.sessionStorage.getItem("publish_wish_colors");
                    this.colors=JSON.parse(a);
                }else {
                    this.$http(api_wish_color).then(res=>{
                        this.colors=res.data.map(item=>{
                            return {
                                value:item.color_value
                            }
                        });
                        storage.setItem("publish_wish_colors",JSON.stringify(this.colors))
                    }).catch(code=>{
                        console.log(code)
                    })
                }
            },
            get_data(isDraft){//参数 isDraft 判断是否为‘保存为草稿箱’操作，如果是true，可以不用判断必填项
                let post_data=clone(this.relevanceData);
                if(isDraft){
                    if(post_data.vars.length>0){
                        post_data.vars.forEach(row=>{
                            row.shipping_time = row.shipping_time.join('-');
                            row.variant.forEach(it=>{
                                it.shipping_time = it.shipping_time.join('-');
                            });
                            row.tags=row.tags.map(row=>{
                                return  row.name
                            }).join(",");
                        })
                    }
                    return post_data;
                }else{
                    let flags=[];
                    let listing=true;
                    let colFlag="";
                    post_data.uid=this.currentUser.user_id;
                    post_data.vars.forEach((row,row_index)=>{
                        let flag=[];
                        let singFlag=[];
                        //                    size 为第一个位置，color为第二个位置
                        if(!!row.variant){
                            row.variant.forEach(item=>{
                                item.color = item.color.trim();
                                item.size = item.size.trim();
                                item.msrp = item.msrp.trim();
                                item.price = item.price.trim();
                                item.shipping = item.shipping.trim()
                            });
                        }
                        if(row.variant.length>1){
                            row.variant.forEach(item=>{
                                if(item.color===""&&item.size===""){
                                    item.error_size=true;
                                    item.error_color=true;
                                    flag.push(false);
                                    singFlag.push([false,false])
                                }else if(item.size===""&&item.color!==""){
                                    let bool_color=this.verify_color(item.color,item);
                                    if(bool_color){
                                        item.error_size=false;
                                        item.error_color=false;
                                        flag.push(true)
                                        singFlag.push([false,true])
                                    }else{
                                        item.error_size=true
                                        item.error_color=true
                                        flag.push(false)
                                        singFlag.push([false,false])
                                    }
                                }else  if(item.size!==""&&item.color===""){
                                    let bool_size=this.verify_size(item.size);
                                    if(bool_size){
                                        item.error_size=false;
                                        item.error_color=false;
                                        flag.push(true);
                                        singFlag.push([true,false])
                                    }else{
                                        item.error_size=true;
                                        item.error_color=true;
                                        flag.push(false);
                                        singFlag.push([false,false])
                                    }
                                }else {
                                    let bool1=this.verify_size(item.size);
                                    let bool2=this.verify_color(item.color,item);
                                    if(bool1===true&&bool2===true){
                                        item.error_size=false;
                                        item.error_color=false;
                                        flag.push(true)
                                        singFlag.push([true,true])
                                    }else if(bool1===false&&bool2===true){
                                        item.error_size=true
                                        item.error_color=false
                                        flag.push(false)
                                        singFlag.push([false,true])
                                    }else if(bool1===true&&bool2===false){
                                        item.error_size=false;
                                        item.error_color= true;
                                        flag.push(false)
                                        singFlag.push([true,false])
                                    }else {
                                        item.error_size=true
                                        item.error_color=true;
                                        flag.push(false)
                                        singFlag.push([false,false])
                                    }
                                }
                            });
                            //                        singFlag 验证
                            let singA=this.verifys(singFlag,0);
                            let singB=this.verifys(singFlag,1);
                            if(!singA&&!singB)  colFlag={count:row.account_code,flag:true};
                            flags.push(flag);
                        }else if(row.variant.length===1){
                            flag.push(true);
                            flags.push(flag);
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
                        let curFlag = true;
                        post_data.vars.forEach((row,index)=>{
                            row.shipping_time=row.shipping_time.join("-");
                            if(row.images.length<=0){
                                curFlag = false;
                                return this.$message({type:"warning",message:"【刊登图片】要求必填，请至少添加一张图片！"})
                            }
                            if(row.tags.length>10){
                                curFlag = false;
                                return this.$message({type:"warning",message:"【标签】数量最多为10个，现已超出限制，请更改！"})
                            }
                            row.tags=row.tags.map(row=>{
                                return  row.name
                            }).join(",");
                            if(this.relevanceData.vars[index].cron_time){
                                row.cron_time=datef("YYYY-MM-dd HH:mm:ss",this.relevanceData.vars[index].cron_time/1000);
                            }else {
                                row.cron_time=""
                            }
                            row.images= row.images.map(it=>{
                                return  it.path;
                            });
                            row.images = row.images.length>20?row.images.splice(0,20):row.images;
                            row.variant.forEach((item,index)=>{
                                //                            2018年1月5日，需求改变，去掉展图必填的要求
                                //                            if(!item.main_image){
                                //                                curFlag = false;
                                //                                return this.$message({type:"warning",message:"【展图】要求必填，请完善*标必填部分"});
                                //                            }
                                if(!item.msrp){
                                    curFlag = false;
                                    return this.$message({type:"warning",message:`【${row.account_code}】账号【吊牌价】要求必填，请完善*标必填部分`});
                                }
                                if(!item.price){
                                    curFlag = false;
                                    return this.$message({type:"warning",message:`【${row.account_code}】【销售价】要求必填，请完善*标必填部分`});
                                }
                                if(item.inventory===''){
                                    curFlag = false;
                                    return this.$message({type:"warning",message:`【${row.account_code}】【数量】要求必填，请完善*标必填部分`});
                                }
                                if(!item.shipping){
                                    curFlag = false;
                                    return this.$message({type:"warning",message:`【${row.account_code}】【运费】要求必填，请完善*标必填部分`});
                                }
                                console.log(item.shipping_time,'item.shipping_time');
                                if(item.shipping_time.findIndex(row=>!row)>-1){
                                    curFlag = false;
                                    return this.$message({type:"warning",message:`【${row.account_code}】【发货周期数】要求必填，请完善*标必填部分`});
                                }

                                if(parseInt(item.shipping_time[0])<2||parseInt(item.shipping_time[1])<5){
                                    curFlag = false;
                                    return this.$message({type:"warning",message:`【${row.account_code}】发货周期数据有误，左侧数据应大于等于2，右侧数据应大于等于5`})
                                }

                                if(parseInt(item.shipping_time[0])>parseInt(item.shipping_time[1])){
                                    curFlag = false;
                                    return this.$message({type:"warning",message:`【${row.account_code}】发货周期数据有误，左侧数据应小于右侧数据`})
                                }else{
                                    item.shipping_time=item.shipping_time.join("-");
                                }
                            });
                        });
                        return !curFlag?curFlag:post_data;
                    }else {
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
            verify_size(str){
                let custom_format=/^[a-zA-Z0-9][\s]*([a-zA-Z0-9.\-&\'\"\(\)\[\]\/][\s]*)*$/gi;
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


                return !!find
            },
            publish(){//api_wish_add
                let arr = this.$refs.goods.submit();
                if(!arr.find(row=>!row)){
                    let data=this.get_data(false);
                    if(typeof data==='object'){
                        this.isSubmit = true;
                        return this.$http(api_wish_add,data).then(res=>{
                            this.$message({
                                message: res.message||res,
                                type: 'success'
                            });
                            this.isSubmit = false;
                            sessionStorage.setItem('wishInfoId',data.goods_id);
                            this.$close('/kandeng/wish/info');
                            return Promise.resolve();
                        }).catch(code=>{
                            this.$message({message:code.message||code,type:'error'});
                            this.isSubmit = false;
                        })
                    }
                }else{
                    this.$message({message:"请输入标题与价格中的必填项", type:'warning'});
                    this.isSubmit = false;
                }
            },
            save(){//保存为草稿箱不做必填限制
                let data=this.get_data(true);
                let boolen = data.vars[0].variant.some(row=>row.sku.length===0||row.sku.length>20);
                if(boolen){
                    this.$message({message:'长度不能小于0和大于20',type:'warning'})
                }else {
                    this.isSubmit = true;
                    return this.$http(api_wish_save,data).then(res=>{
                        this.$message({
                            message: res.message||res,
                            type: 'success'
                        });
                        this.isSubmit = false;
                        this.$close('/kandeng/wish/info');
                        return Promise.resolve();
                    }).catch(code=>{
                        this.isSubmit = false;
                        this.$message({message:code.message||code,type:'error'});
                    })
                }
            },
            cancel(){//--取消
                this.$close('/kandeng/wish/info');//关闭当前页
            },
            checks(){
                console.log(this.relevanceData)
            },
            update(){ //api__wish_update
                let arr = this.$refs.goods.submit();
                if(!arr.find(row=>!row)){
                    let data=this.get_data(false);
                    if(typeof data==='object'){
                        this.isSubmit = true;
                        return this.$http(api__wish_update,data).then(res=>{
                            this.$message({
                                message: res.message||res,
                                type: 'success'
                            });
                            this.isSubmit = false;
                            this.$close('/kandeng/wish/info');
                            return Promise.resolve();
                        }).catch(code=>{
                            this.$message({message:code.message||code,type:'error'});
                            this.isSubmit = false;
                        })
                    }
                }else{
                    this.$message({message:"请输入标题与价格中的必填项", type:'warning'});
                    this.isSubmit = false;
                }
            },
            action(data,accountId){
                this.spu=data.parent_sku;
//                this.goods_id=data.goods_id;
                this.trueId = data.id||0;
                if(!!accountId){
                    this.$set(data,"default_account_id",accountId);
                    this.get_channel(data.parent_sku,data.warehouse_type).then(_=>{
                        let findList = this.channels.filter(row=>accountId===row.id);
                        if(findList.length<=0) {
                            this.$message({type: "warning", message: "请先绑定平台账号与销售员的关系！"});
                        }else{
                            this.$refs.goods.keep_channel(this.channels,findList);
                        }
                    });
                }
                data.vars&&data.vars.forEach((row,i)=>{
                    if(this.isCopy){
                        row.images = this.imagDataList;
                        row.base_url = this.baseUrl;
                    }
                    row.index=i+"";
                    if(!row.shipping_time){
                        row.shipping_time=["",""]
                    }else {
                        row.shipping_time=row.shipping_time.split("-")
                    }
                    row.cron_time= row.cron_time>0?row.cron_time*1000:'';
                    if(row.variant){
                        let name=row.variant.map(ant=>ant.sku_id).join(",");
                        row.variant.forEach((item,index)=>{
                            this.$set(item,'isCheck',true);
                            if(this.isAdd){
                                item.inventory = item.inventory?item.inventory:999;
                            }
                            item.error_color=false;
                            item.error_size=false;
                            item.ref_color= item.color;
                            item.ref_size= item.size;
                            item.shipping_time = !item.shipping_time?[5,15]:item.shipping_time.split("-");
                        })
                    }
                });
                this.$refs.goods.tempData=window.clone(data.vars[0]);
                if(this.isCopy){
                    data.vars=[];
                }else {
                    if(this.isAdd&& data.source==="original"){
                        data.vars=[];
                    }else {
                        this.$refs.goods.currentTab=data.vars[0].account_code
                    }
                }
                return data;
            },
            get_channel(parent_sku,warehouse_type){
                return this.$http(api_wish_channel,{spu:parent_sku,type:warehouse_type}).then(res=> {
                    this.channels = res.data.map(row=> {
                        row.disabled = false;
                        return row
                    });
                    return Promise.resolve()
                }).catch(code=> {
                    console.log(code)
                });
            },
            get_img(id){
                return this.$http(api_git_img,id).then(res=>{
                    return res
                }).catch(code=>{
                    console.log(code);
                })
            },
        },
        watch:{
            async param(val){
                if(window.objlength(val)!==0){
                    this.dataId=val.id;
                    this.isAdd=val.isAdd;
                    this.curModel = val.curModel;
                    this.isCopy=val.isCopy;
                    this.goodsId = !!val.goods_id?val.goods_id:0;
//                    let default_account_id=val.default_account_id;
                    let dataParams;
                    //添加状态  查看编辑 //复制状态
                    if(this.isCopy){
                        dataParams={id:this.dataId,status:"copy"};  //复制 的参数
                        let imgRes = await this.get_img(this.goodsId);
                        this.imagDataList = [];
                        if(!!imgRes||imgRes.length>0) {
                            imgRes.forEach(row => {
                                this.imagDataList = [...this.imagDataList, ...row.images];
                            });
                            this.baseUrl = imgRes[0].baseUrl;
                        }
                    }else {
                        if(this.isAdd){
                            dataParams={goods_id:this.dataId,status:"add"};  //添加参数
                        }else {
                            dataParams={id:this.dataId,status:"edit"};      //编辑参数
//                            default_account_id = "";
                        }
                    }
                    this.isChange=false;
                    this.loading=true;
                    this.$http(api_product_getData,dataParams).then(res=>{
                        this.relevanceData= this.action(res.data);
//                        this.relevanceData= this.action(res.data,default_account_id);
                        setTimeout(()=>{
                            this.loading=false;
                        },150)
                    }).catch(code=>{
                        this.$message({
                            type:'error',
                            message:code.message || code
                        })
                    })
                }
            },
            'relevanceData.vars':{
                deep:true,
                handler(val){
                    if(!this.loading&&val&&val.length){
                        this.isChange=true
                    }
                }
            }
        },
        computed:{
            ...mapGetters({currentUser:'user/info'}),
        },

        components:{
            relevanceGoods,
        }
    }
</script>
