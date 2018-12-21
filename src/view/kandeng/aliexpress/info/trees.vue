<template>
    <div class="c-treess">
        <ul class="ul">
            <li  v-for="cate in  treeData" class="li"   :class="cate.show?'show':''"  @click="click_cate(treeData,cate)">
                <label >{{cate.category_name_zh||cate.category_name}}</label>
                <i v-if="cate.category_isleaf===0" class="iconRight">>></i>
            </li>
        </ul>
        <trees ref="details"  :treeData="single.child"  v-if="single.child&&single.child.length>0"
                 class="class-tree" @last="last" @change-btn="change_btn"  :request="request_calc()"></trees>
    </div>
</template>
<style lang="stylus">
    .c-treess{
        display: inline-block;
        vertical-align: top;
        .ul{
            background: white;
            display: inline-block;
            height: 204px;
            min-width:160px;
            overflow-y: auto;
            overflow-x: visible;
            border: 1px solid #ddd;
            vertical-align: top;
            .li{
                padding: 8px 30px 8px 10px;
                -ms-text-overflow: ellipsis;
                text-overflow: ellipsis;
                margin-left:-3px;
                position: relative;
                >label{
                white-space: nowrap;
                 }
                &:hover{
                    background-color: #e4e8f1;
                }
                .iconRight{
                    margin-top:4px;
                    position: absolute;
                    top: 0;
                    right: 0;
                    padding: 3px 10px;
                        }
            }
        }
        .class-tree{
            display: inline-block;
        }
        .show{
            background: #20a0ff;
            color: white;
        }
    }

</style>
<script>
    import {api_aliexpress_classify} from "../../../../api/publish-smt"
    export default{
        name:"trees",
        data(){
            return {
            }
        },
        computed:{
            single:{
                get(){
                    let find=this.treeData.find(row=>{
                                return row.show===true
                            })
                    return find||{}
                },
                set(){
                }
            }
        },
        methods:{
            last(val){
                this.$emit("last",val)
            },
            change_btn(val){
                this.$emit("change-btn",val);
            },
            request_calc(){
                let ret =window.clone(this.request);
                ret.push({category_id:this.single.category_id,category_name:this.single.category_name_zh,required_size_model:this.single.required_size_model})
                return ret;
            },
            click_cate_all(child,req,i){
                    this.single=child;
                if(child.show === true){
                    return ;
                }
                if(child.show === undefined){
                    this.$set(child, 'show', true);
                }else{
                    child.show = true;
                }
                this.$http(api_aliexpress_classify,{category_id:req[i].category_id}).then(res=>{
                    this.$set(child, "child", res)
                let a=i+1;
                if(a<req.length){
                    let  p=child.child.find(row=>{
                                return row.category_id===req[a].category_id
                            })
                    this.$nextTick(()=>{
                        this.$refs.details.click_cate_all.call(this,p,req,a)
                    })
                }
                })
            },
            click_cate(parent,child){
                if(child.show === true){
                    return ;
                };
                parent.forEach(c =>{
                    if(c.show === true){
                        c.show = false;
                    }
                });
                if(child.show === undefined){
                    this.$set(child, 'show', true);
                }else{
                    child.show = true;
                };
                this.single=child;
                if(child.category_isleaf==0){
                    this.$emit("change-btn",true);
                    this.$http(api_aliexpress_classify,{category_id:child.category_id}).then(res=>{
                        this.$set(child,"child",res);
                    }).catch(code=>{
                        console.log(code)
                    })
                }else {
                    this.$emit("change-btn",false);
                    this.$emit("last",this.request_calc())
                }
            },

        },
        props:{
            treeData:{
                require:true,
                type:Array
            },
            request:{
                type:Array,
                require:true
            }
        },
        components: {}
    }
</script>
