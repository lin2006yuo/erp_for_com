<template>
    <div class="c-classify">
           <div  @click="shows" class="classify-show " >
               <span >{{label}}</span>
               <i  :class="[show?'el-icon-caret-bottom':'el-icon-caret-left',,'middle']" ></i>
           </div>
        <trees  v-if="show"  ref="trees" :treeData="treeData" class="tree" @last="last"  :request="[]"></trees>
    </div>
</template>
<style lang="stylus">
.c-classify{
    position: relative;
    top:0;
    left:0;
    z-index: 101;
    .classify-show{
                position: relative;
                line-height: 20px;
                display: inline-block;
                min-width: 200px;
                border-radius:4px;
                border:1px solid #C0CCDA;
                color:#1f2d3d;
                background-color:#fff;
                box-sizing:border-box;
                height: 26px;
                padding:3px 10px;
        >span{
            display: inline-block;
        min-width: 200px;
            margin-right: 26px;

        }
            .middle{
                position: absolute;
                padding: 7px 10px;
                top: 0;
                right: 0;
            }


    }
    .tree{
        position: absolute;
        left: 0;
        top:26px;
        border: 1px solid #d1dbe5;
    }
}
</style>
<script>
    import {api_aliexpress_classify} from "../../../../../api/publish-smt"
    export default{
        data(){
            return {
                show:false,
                treeData:[]
            }
        },
        created(){
            console.log("name", this.name)
        },
        mounted(){

        },
        computed:{
            label(){
                if(this.name){
                    return this.name.map(row=>row.category_name).join(">>")
                }else {
                    return "空"
                }


            }
        },
        methods:{
            shows(){
                this.show=!this.show
                if(this.show&&this.treeData.length===0){
                    this.$http(api_aliexpress_classify).then(res=>{
                        this.treeData=res;
                        if(this.name){
                            this.shows_all();
                        }
                    }).catch(code=>{
                        console.log(code)
                    })
                }

            },
            last(val){
                this.$emit("last",val);
                this.show=false;
            },
            shows_all(){
                if(this.name.length!==0){
                    let  p=this.treeData.find(row=>{
                        return row.category_id===this.name[0].category_id
                    })
                    this.$refs.trees.click_cate_all(p,this.name,0);
                }
            },
        },
        filters:{
        },
        watch:{
        },
        props:{
            name:{
                require:true,
                default(){
                    return  []
                }
            }
        },
        components:{
        trees:require("./trees.vue").default
        }
    }
</script>
