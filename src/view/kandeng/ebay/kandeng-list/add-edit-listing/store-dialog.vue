<template>
    <div class="c-store-box">
        <page-dialog v-model="dialog" size="large" title="选择商店分类" :close-on-click-modal="false">
            <div v-if="storeList.length>0">
                <div class="confirm-box" v-if="currentName">
                    <span>当前分类：您已选择分类【&nbsp;{{currentName}}&nbsp;】，请点击【确定】继续！</span>
                </div>
                <div class="ml-mini">
                    <store-box
                            :data="storeList"
                            :account-id="accountId"
                            :request="[]"
                            @last="last"
                            which-one="store"
                    ></store-box>
                </div>
            </div>
            <div v-else class="t-center">
                暂无数据...
            </div>

            <div slot="footer">
                <el-button type="primary" size="mini" class="inline" @click.native="submit">确定</el-button>
                <el-button size="mini" class="inline" @click.native="dialog = false">取消</el-button>
            </div>
        </page-dialog>
    </div>
</template>
<style lang="stylus">
    .c-store-box{
        .confirm-box{
            box-sizing:border-box;
            margin:10px 10px;
            /*width:100%;*/
            padding:10px 15px;
            border: 1px solid #61A840;
            border-radius: 3px;
            color:#095210;
            background-color:#E9FDC1 ;
        }
    }

</style>
<script>
import {api_get_custom_category} from '../../../../../api/ebay-kandeng-public-module'
    export default{
        data(){
            return {
                dialog:false,
                storeList:[],
                nameList:[],
            }
        },
        computed:{
            currentName(){
                if(this.nameList.length>0){
                    return this.nameList.map(row=>row.name).join(">>")
                }else {
                    return ""
                }
            }
        },
        watch:{
            dialog(val){
                this.$emit("input",val);
            },
            value(val){
                this.dialog = val;
                this.nameList = [];
                this.get_store_category();
            },
        },
        methods:{
            submit(){
                this.$emit("submit",this.nameList,this.currentName);
            },
            get_store_category(){
                let params = {
                    account:this.accountId,
                    parent_id:0
                };
                this.$http(api_get_custom_category,params).then(res=>{
                    res.data.forEach((row)=>{
                        this.$set(row,"show",false);
                    });
                    this.storeList  = res.data;
                }).catch(code=>{
                    console.log(code);
                })
            },
            last(val){
                this.nameList = val;
            },
        },
        props:{
            value:{},
            accountId:{
                required:true
            }
        },
        components: {
            storeBox:require('./store-box.vue').default,
            pageDialog:require('../../../../../components/page-dialog.vue').default,
        }
    }
</script>