<template>
    <div class="c-classify-detail"  >
        <ul class="classifys">
            <li v-for="classify in classifys"
                @click="clickShow(classifys, classify)">
                <label    >{{classify.category_name}} </label>
                <span v-if="classify.is_leaf==0">>></span>
            </li>
        </ul>
        <classify-detail  ref="details" v-if="showClassify.child&&showClassify.child.length>0" :classifys="showClassify.child" :request="request_calc(showClassify)" @last="last" >
        </classify-detail>
    </div>
</template>
<style lang="stylus">
    .c-classify-detail{
        display:  inline-block;
        height: 250px;
        .classifys{
                        display: inline-block;
                        height: 250px;
                        width: 150px;
                        overflow-y:auto;
                        border: 1px solid #D3DCE6;
                >li{
                     position: relative;
                     line-height: 20px;
                     padding: 3px 26px 3px 8px;
                >label{
                     display: inline-block;
                     width: 100%;
                     white-space: nowrap;
                     height: 100%;
                     overflow: hidden;
                     text-overflow: ellipsis;
                 }
                >span{
                     position: absolute;
                     line-height: 26px;
                     top:0;
                     right: 0;
                 }
                &:hover{
                     background: #D3DCE6;
                 }
                }
        }


        .show{
            background:  #58B7FF;
        }

    }
</style>
<script>
 import {api_get_channel_site_classify,api_get_channel_classify} from "../api/categories"
    export default{
        name:'classify-detail',
        data(){
            return{
            }
        },
        computed:{
            showClassify:{
                get(){
                    let find=this.classifys.find(row=>{
                        return row.show===true
                    })
                    return find||{}
                },
                set(){
                }
            }

        },
        methods:{
            last(val,req){
                this.$emit("last",val,req)
            },
            request_calc(classify){
                let ret =window.clone(this.request)
                    ret.push({label: classify.category_name, id: classify.category_id})
                return ret;
            },
            //参数  1.父节点 2 本节点   3.请求的数组  4.请求中第 i个
            clickShow_all(parent, child,req,i){
                this.showClassify=child;
                if(child.show === true){
                    return ;
                }
//                parent.forEach(c =>{
//                    if(c.show === true){
//                    c.show = false;
//                 }
//                 });
                if(child.show === undefined){
                    this.$set(child, 'show', true);
                }else{
                    child.show = true;
                };
                if(req[0].is_site){
                    this.$http(api_get_channel_site_classify, req[0].label, req[1].code, child.category_id).then(res=> {
                        this.$set(child, "child", res)
                        let a=i+1;
                        if(a<req.length){
                            let  p=child.child.find(row=>{
                                return row.category_id===req[a].id
                            })
                            this.$nextTick(()=>{
                                this.$refs.details.clickShow_all.call(this,child.child,p,req,a)
                            })
                        }
                    }).catch(code=> {
                        console.log(code)
                    })
                }else {
                    //无站点时 请求
                    this.$http(api_get_channel_classify, req[0].label, child.category_id).then(res=> {
                        this.$set(child, "child", res)
                        let a=i+1;
                        if(a<req.length){
                            let  p=child.child.find(row=>{
                                return row.category_id===req[a].id
                            })
                            this.$nextTick(()=>{
                                this.$refs.details.clickShow_all.call(this,child.child,p,req,a)
                            })
                        }
                    }).catch(code=> {
                        console.log(code)
                    })
                }
            },
            clickShow(parent, child){
                this.showClassify=child;
                if(child.show === true){
                    return ;
                }
                parent.forEach(c =>{
                    if(c.show === true){
                        c.show = false;
                    }
                });
                if(child.show === undefined){
                    this.$set(child, 'show', true);
                }else{
                    child.show = true;
                }
                if(child.child&&child.child.length>0){
                    child.child.forEach(row=>{
                        row.show=false;
                    })
                }else {
                    this.doafter(child);
                }

            },
            doafter(classify){
                //是否是最底层
                if(!classify.is_leaf) {
                    if(this.request[0].is_site){
                        //有站点时请求
                    this.$http(api_get_channel_site_classify, this.request[0].label, this.request[1].code, classify.category_id).then(res=> {
                        this.$set(classify, "child", res)
                    }).catch(code=> {
                        console.log(code)
                    })
                         }else {
                        //                        无站点请求数据
                        this.$http(api_get_channel_classify,this.request[0].label,classify.category_id ).then(res=>{
                            this.$set(classify, "child", res)
                        }).catch(code=>{
                            console.log(code.message||code)
                        })
                         }
                    }else {
                    this.$emit("last",classify,this.request)
                    }
            }
        },
        props:{
            // [{label:'',id:1,type:x},{label:''}]
            request:{
            },
            classifys:{
                required:true,
            }
        },
        components:{

        }
    }
</script>
