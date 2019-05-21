<template>
    <div class="c-category-box">
        <ul class="category-box">
            <li  @click="cur_category(data,item,index)" v-for="(item,index) in data" :class="[item.show?'highlight':'']">{{item.name}}</li>
        </ul>

        <template>
            <store-box :data="curData.children"
                       :account-id="accountId"
                       v-if="curData.children&&curData.children.length>0"
                       :request="get_request()"
                       @last="last"
                       which-one="category"
            ></store-box>
        </template>
    </div>
</template>
<style lang="stylus">
    .c-category-box{
        display: inline;
        word-wrap:break-word;
        ul.category-box{
            /*padding:8px 10px;*/
            box-sizing: border-box;
            /*margin-left:10px;*/
            width:237px;
            display: inline-block;
            border:1px solid #ddd;
            height: 200px;
            overflow-y: auto;
            li{
                height:26px;
                line-height:26px;
                padding:0 10px;
                &:active{
                    /*background-color:#2e90fe ;*/
                    /*color:#fff;*/
                }
                &:hover{
                     background-color:#e5e9f2 ;
                 }
            }
            .highlight{
                background-color:#2e90fe ;
                color:#fff;
                &:hover{
                     background-color:#2e90fe;
                 }
            }
        }
    }
</style>
<script>
    import {api_get_categorys} from '../../../../../api/ebay-kandeng-public-module';
    import {api_get_custom_category} from '../../../../../api/ebay-kandeng-public-module';
    export default{
        name:"store-box",
        data(){
            return {
                curData:{},
                curCategoryName:"",
            }
        },
        computed:{
            current(){
                let find=this.data.find(row=>{
                    return row.show;
                })
                if(!!find){
                    return find
                }else {
                    return ""
                }
            }
        },
        methods:{
            last(val){
                this.$emit("last",val);
            },
            get_request(){
                let request=window.clone(this.request);
                return  [...request,{parent_id:this.current.category_id,name:this.current.name}]
            },
            cur_category(data,item,index){
                /*取消其他行的高亮*/
                let cur = data.find((row,i)=>{
                    if(i!==index&&row.hasOwnProperty("show")){
                        return row.show === true;
                    }
                });
                if(cur) cur.show = false;
                /*高亮当前行*/
                item.show = true;
                console.log(this.accountId,'this.accountId');
                /*调用子级数据*/
                let params = {
                    parent_id:item.category_id,
                    account:this.accountId,
                }
                this.$set(item,'children',[]);
                this.curData = item;
                this.$http(api_get_custom_category,params).then(res=>{
                    res.data.forEach(re=>{
                        this.$set(re,'show',false);
                    })
                    item.children = res.data;
                    if(item.children.length<=0){
                        this.$emit("last",this.get_request());
                    }
                    this.curData = item;
                    /*当前选择的分类*/
                }).catch(code=>{
                    console.log("code",code);
                })
            },
        },
        props:{
            data:{},
            accountId:{},
            request:{
                type:Array,
                required:true
            },
            whichOne:{
//                required:true
            }
        },
        components: {}
    }
</script>