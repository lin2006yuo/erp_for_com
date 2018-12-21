<template>
    <div class="classify-card">
        <label @click="edit"  class="label">
            <span>{{label}}</span>
            <i :class="[isEdit?'el-icon-caret-top':'el-icon-caret-bottom']"></i>
        </label>
        <div   v-if="isEdit"  >
            <!--平台-->
            <ul class="plats">
                <li v-if="isEdit" v-for="plat in plats"   @click="click_plat(plat)">
                    <label> {{plat.name}}</label>
                    <span>>></span>
                </li>
            </ul>
            <!--站点-->
            <ul class="sites"  v-if='showPlat.sites'>
                <li  v-for="site in showPlat.sites" v-if="showPlat.show"
                     @click="clickShow(showPlat.sites, site)">
                    <label>{{site.name}}</label>
                    <span>>></span>
                </li>
            </ul>
            <!--站点下分类-->
            <classify-detail
                    v-if="showPlat.is_site===1&&showClass.classify"
                    class="classity"
                    ref="detail"
                    :classifys="showClass.classify"
                    :request="request_calc()"
                    @last="last">
            </classify-detail>
            <!--无站点  平台下分类-->
            <classify-detail
                             v-if="showPlat.is_site===0&&showPlat.classify"
                             :classifys="showPlat.classify"
                             class="classity"
                             ref="codedetail"
                             :request="request_calc()"
                             @last="last">
            </classify-detail>
        </div>
    </div>
</template>
<style lang="stylus">
    .classify-card{
        display: inline-block;
        position: relative;
        background: white;
        .label{
            position: relative;
            display: inline-block;
            white-space: nowrap;
            min-width: 250px;
            line-height: 20px;
            padding: 3px 30px 3px 8px;
            border: 1px solid #cccccc;
            border-radius: 4px;
            > i{
                    position: absolute;
                  top:0;
                 right: 0;
                 padding: 8px;
             }
        }
        >div{

         }
        .plats{
            display: inline-block;
            border: 1px solid #D3DCE6;
            height: 250px;
            width: 100px;
            overflow-y: auto;
            >li{
                position: relative;
                line-height: 20px;
                padding: 3px 26px 3px 8px;
                >label{
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
        .sites{
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
        .classity{
            display: inline-block;
        }
        .show{
            background: #58B7FF;
        }

        @keyframes up {
            from {height:0;}
            to {height:300px;}
        }
    }
</style>
<script>
    import {api_get_channel_categories,api_get_channel_platform,api_get_channel_site_classify,api_get_channel_classify,api_get_channel_site} from "../api/categories"
    export default{
        data(){
            return{
                isEdit:false,
                plats:[],
                requests:[],
                showPlat:{},
                showClass:{},
                siteClass:{},
            }
        },

        mounted(){

        },

        methods:{
            last(val,req){
                req.push({label: val.category_name, id: val.category_id})
                this.$emit("input",{id:val.category_id,req:req})
                this.isEdit=false;
            },
            request_calc(){
                let req = this.requests;
                return req;
            },
            edit(){
                this.isEdit = !this.isEdit;
                if(this.isEdit&&this.plats.length===0){
                    this.$http(api_get_channel_categories).then(res=>{
                        res.forEach(row=>{
                            if(row.is_site){
                                row.sites="";
                            }
                            row.show=false;
                            return row;
                        });
                        this.$set(this,"plats",res)
                        this.show_all();
                    }).catch(code=>{
                        console.log(code)
                        this.$message({
                            type:'error',
                            message:code.message || code
                        });
                    });
                }

            },
            show_all(){
                if(this.value.req.length!==0){
                    let channel=this.value.req[0]
                    let index= this.plats.indexOfFun(channel,function (old,channel) {
                        return old.id===channel.id;
                    });
                    this.click_all_plat(this.plats[index]);
                }
            },
            //有值时  展开平台用
            click_all_plat(plat){
                this.showPlat=plat;
                let index= this.plats.indexOfFun(plat, function(row,plat){
                    return row.id===plat.id
                })
                if(this.plats[index].show){
                    return ;
                };
                this.plats.forEach(row=>{
                    row.show=false
                })
                this.plats[index].show=true;
                this.requests=[{label:plat.name,is_site:plat.is_site,id:plat.id}];
                if( plat.is_site===1){
                    if(plat.sites===""){
                        this.$http(api_get_channel_platform,plat.name).then(res=>{
                            this.$set(plat,"sites",res);
                            let parent=plat.sites;
                            let childs=plat.sites.find(row=>{
                                return  row.id===this.value.req[1].id
                            })
                            this.clickShow_all(parent,childs);
                        }).catch(code=>{
                            console.log(code)
                        });
                    }
                }else {
                    this.$http(api_get_channel_platform,plat.name).then(res=>{
                        this.$set(plat,"classify",res);
                        let parent=plat.classify;
                        let childs=plat.classify.find(row=>{
                            return  row.category_id===this.value.req[1].id
                        })
                        this.$nextTick(()=>{
                            this.$refs.codedetail.clickShow_all.call(this,parent,childs,this.value.req,1)
                        })
                    }).catch(code=>{
                        this.$message({
                            type:'error',
                            message:code.message || code
                        });
                    });
                }

            },
            //有值时  展开站点用
            clickShow_all(parent, child){
                this.showClass=child;
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
                let requests=window.clone(this.requests);
                    this.requests=[requests[0],{id:child.id,code:child.code,label:child.name}];
                    this.$http(api_get_channel_site,this.value.req[0].label,child.code).then(res=>{
                        this.$set(child,"classify",res);
                        let childclass=  res.find(row=>{
                            return row.category_id===this.value.req[2].id
                        });
                        this.$nextTick(()=>{
                            this.$refs.detail.clickShow_all.call(this,child.classify,childclass,this.value.req,2)
                        })
                    }).catch(code=>{
                        console.log(code)
                    })
            },
            //点击 平台
            click_plat(plat){
                this.showPlat=plat;
                this.showClass={};
                let index= this.plats.indexOfFun(plat, function(row,plat){
                    return row.id===plat.id
                })
                this.plats.forEach(row=>{
                    row.show=false
            })
                this.plats[index].show=true;
                this.requests=[{label:plat.name,is_site:plat.is_site,id:plat.id}];
                if( plat.is_site===1){
                    if(plat.sites===""){
                        this.$http(api_get_channel_platform,plat.name).then(res=>{
                            this.$set(plat,"sites",res);

                    }).catch(code=>{
                            this.$message({
                            type:'error',
                            message:code.message || code
                        });
                    });
                    }else {
                        plat.sites.forEach(row=>{
                            row.show=false
                    })
                    }
                }else {
                    this.$http(api_get_channel_platform,plat.name).then(res=>{
                        this.$set(plat,"classify",res);
                         }).catch(code=>{
                            this.$message({
                            type:'error',
                          message:code.message || code
                        });
                     });
                }
            },

            // 点击站点
            clickShow(parent, child){
                this.showClass=child;
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
                let requests=window.clone(this.requests)
                this.requests=[requests[0],{id:child.id,code:child.code,label:child.name}];
                if(child.classify&&child.classify.length>0){
                    child.classify.forEach(row=>{
                        row.show=false;
                })
                }else {
                    this.$http(api_get_channel_site,this.requests[0].label,child.code).then(res=>{
                        this.$set(child,"classify",res)
                }).catch(code=>{
                        console.log(code)
                })
                }

            }
        },
        computed:{
            showDetail(){

            },
            label:{
                get(){
                    let arr=[]
                    if(this.value.req.length>0){
                        arr=this.value.req.map((row,index)=>{
                                    return row.label
                                })
                    }
                    let name=arr.join(">>")
                    return  name||"空";
                },
                set(){

                     }
            }
        },
        watch:{

        },
        props:{
            //id:label/id:label/id:label/   ebay:ebay平台,us:美国,1:服装，2：茶梅 /"
            value:{
                required:true,
//                type:String
            }
        },
        components:{
            classifyDetail:require('./classify-detail.vue').default
        }
    }
</script>
