<template>
    <el-row class="edit-attr">
        <el-col :span="18">
            <div class="group" v-for="(group,gindex) in groups"
                 :key="gindex"
                 v-if="group.action !== 'del'" v-drag="{func:gdrag,params:gindex}" :data-group="gindex">
                <el-input class="inline"
                          v-if="group.editName"
                          v-model="group.name"
                          @blur="blur_group_name(group)"
                >
                </el-input>
                <label v-else @dblclick="edit_group_name(group)" class="group-label">
                    {{group.name}}
                </label>
                <el-button type="danger" size="mini" @click.native="del_group(gindex)" :disabled="group.isUsed">删除分组</el-button>
                <ul class="attrs  mt-xs">
                    <li class="attr drag-public drag-public-right" v-for="(attr,aindex) in group.attributes"
                        :key="aindex"
                        v-drag="{func:adrag,params:gindex+'-'+aindex}" :data-key="gindex+'-'+aindex" >
                        <el-button type="danger" size="mini" @click.native="remove(gindex,aindex)" :plain="true" :disabled="attr.isUsed">删除</el-button>
                        <label class="label-width">
                            <div style="max-width: 80%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap">
                                <ui-tip :content="attr.name" :width="98"></ui-tip>
                            </div>
                        </label>
                        <el-input class="inline" v-model="attr.alias"></el-input>
                        <el-checkbox class="hands" v-model="attr.required" label="是否必填"></el-checkbox>
                        <el-checkbox class="hands" v-model="attr.sku" label="是否为SKU"></el-checkbox>
                        <el-checkbox class="hands" v-model="attr.gallery" label="是否为图片"></el-checkbox>
                        <el-popover
                                v-model="attr.showPopver"
                                placement="top"
                                trigger="click">
                            <div style="max-width:700px;  max-height: 100px;overflow-y: auto;">
                                <el-tag v-for="attrValue in attr_value(attr)"
                                        :key="attr_value.value"
                                        class="btn"
                                        style="margin:0 3px 3px 0px;"
                                        @click.native="click_attr(attr, attrValue)"
                                        type="primary">
                                    {{attrValue.value}}
                                    <i @click.stop="()=>{}" v-if="check_attr(attr, attrValue)" class="el-icon-circle-check"></i>
                                </el-tag>
                            </div>
                            <el-button slot="reference"
                                       type="primary"
                                       size="mini"
                                       @click.native="set_attr(attr)">{{attr.showPopver ? '确定' : '属性值'}}</el-button>
                        </el-popover>
                        <div class="ver"  >
                            <el-tag v-for="attrValue in attr.attribute_value" :key="attrValue.value" style="margin-left:3px;margin-top:2px;color: #000000;background: none;border: 1px solid #ccc;">
                                {{attrValue.value}}
                            </el-tag>
                        </div>
                    </li>
                </ul>
            </div>
            <el-card class="mt-xs">
                <request-button req-key="editAttr" @click="submit">提交</request-button>
                <el-button type="primary" @click.native="add_group"  size="mini">添加分组</el-button>
            </el-card>
        </el-col>
        <el-col :span="5"  class="ml-md">
            <el-input v-model="filter" placeholder="输入属性名搜索"></el-input>
            <ul class="attr-filter"  :class="cattributes.length===0?'bor':''" style="padding-bottom:5px">
                <template v-for="attr in cattributes" >
                    <template  v-if="attr.use">
                        <li style="display:flex"  :key="`${attr.id}-${attr.use}`"  class="use mt-xs ml-xs">
                            <div  style="flex:1;text-align: center;border: 1px solid #e2e2e2;border-radius: 4px;padding: 0 4px;" class="fixed" :title="attr.name">{{attr.name}}</div>
                            <i class="el-icon-circle-check" style="width:20px;line-height:26px;text-align:center;color:#008BCE"></i>
                        </li>
                    </template>
                    <template v-else>
                        <li style="display:flex"  :key="`${attr.id}`" v-drag="{func:ndrag,params:attr}"   class="mt-xs ml-xs">
                            <div  style="flex:1;margin-right:20px;text-align: center;border: 1px solid #e2e2e2;border-radius: 4px;padding: 0 4px;"  class="fixed" :title="attr.name">{{attr.name}}</div>
                        </li>
                    </template>
                </template>
            </ul>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="attributePage"
                    :page-size="attributePageSize"
                    layout="total, prev, pager, next"
                    :total="attributeCount">
            </el-pagination>
        </el-col>
    </el-row>
</template>
<style lang="stylus">
    .edit-attr{
        .el-popover{
            max-width: 700px;
        }
        .attr{
            cursor: pointer;
        }
        .ver{
            display: inline-block;
            vertical-align: top;
            max-width:600px;
            word-break: break-all; word-wrap:break-word;
        }
        .use{
            cursor: default;
            .el-button:hover{
                cursor: default;
            }
        }
        .fixed {
             max-width: 179px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

        }
        .hands{
            cursor: default;
        }
    }

</style>
<script>

    import {api_get_attribute_dict,api_get_attribute_value} from '../../../api/attribute';
    import {api_set_attributes,api_save_attributes} from '../../../api/categories';
    let findGroup = (child) =>{
        if(!child){
            return false;
        }
        if(child.dataset && child.dataset.group){
            return child.dataset.group;
        }else{
            return findGroup(child.parentNode);
        }
    };
    export default{
        data(){
            return{
                filter:"",
                attributes:[],
                attributePage:1,
                attributePageSize:13,
                attributeCount:0,
                groups:[],
                vals:[]
            }

        },
        mounted(){
            let params = {
                name:'',
                page:this.attributePage,
                pageSize:this.attributePageSize
            };
            this.$http(api_get_attribute_dict, params).then(res=>{
                this.attributePageSize =parseInt( res.pageSize);
                this.attributePage=parseInt(res.page) ;
                this.attributeCount=parseInt(res.count) ;
                this.attributes= res.data;
            });
            this.init();
        },
        methods:{
            reload(){
            },
            set_attr(attr){
                let proc = (bool) =>{
                    if(bool){
                        let attribute_value_popver = attr.attribute_value.map(a=>{
                            return {id:a.id,value:a.value,icon:a.icon};
                        });
                        this.$set(attr, 'attribute_value_popver', attribute_value_popver);
                    }else{
                        let attribute_value = attr.attribute_value_popver.map(a=>{
                            return {id:a.id,value:a.value,icon:a.icon};
                        });
                        attr.attribute_value = attribute_value;
                        this.$delete(attr, 'attribute_value_popver');
                    }
                };
                // attr.showPopver取反的原因是：当点击button 时 attr.showPopver还没改变，后面才改变。
                proc(!attr.showPopver);
            },
            check_attr(attr, value){
                let popver = attr.attribute_value_popver || [];
                return !!popver.find(row=>row.id === value.id);
            },
            attr_value(attr){
                return this.vals[attr.attribute_id] || [];
            },
            click_attr(attr, value){
                console.log(attr);
                let index = attr.attribute_value_popver.indexOfFun(row=>{return row.id === value.id});
                if(index >= 0){
                    attr.attribute_value_popver.splice(index, 1);
                }else{
                    attr.attribute_value_popver.push({id:value.id,value:value.value});
                }
            },
            submit(){
                let groups = this.groups.map((group,index)=>{
                    let tgrop = {
                        name:group.name,
                        sort:index,
                        group_id:group.group_id,
                        action:group.action,
                        isUsed:group.isUsed,
                        attributes:group.attributes.map(attr=>{
                            let tattr = {
                                attribute_id:attr.attribute_id,
                                alias:attr.alias,
                                required:attr.required ? 1 : 0,
                                sku:attr.sku ? 1 : 0,
                                gallery:attr.gallery ? 1 : 0,
                                attribute_value:attr.attribute_value.map(val=>val.id),
                            };
                            return tattr;
                        })
                    };
                    return tgrop;
                });
                this.$http(api_save_attributes, {category_id:this.attrId,group:groups}).then(res=>{
                    this.$message({
                        type:'success',
                        message:"保存成功"
                    });
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    })
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('editAttr',false);
                    },300);
                })
            },
            handleSizeChange(val){
                this.attributePageSize=val;
                let params = {
                    name:this.filter,
                    page:this.attributePage,
                    pageSize:this.attributePageSize
                };
                this.$http(api_get_attribute_dict, params).then(res=>{
                this.attributeCount=  parseInt(res.count);
                this.attributes= res.data;
            })
            },
            handleCurrentChange(val){
                this.attributePage=val;
                let params = {
                    name:this.filter,
                    page:this.attributePage,
                    pageSize:this.attributePageSize
                };
                this.$http(api_get_attribute_dict, params).then(res=>{
                    this.attributeCount=  parseInt(res.count);
                this.attributes= res.data;
            })
            },
            init(){
                this.$http(api_set_attributes, this.attrId).then(res=>{
                    this.groups = res.map(row=>{
                        this.$set(row,'action','modify');
                        row.attributes = row.attributes.map(attr=>{
                            attr.required = !!attr.required;
                            attr.sku = !!attr.sku;
                            attr.showPopver = false;
                            attr.gallery = !!attr.gallery;
                            attr.isUsed = !!attr.isUsed;
                            this.init_attr_value(attr.attribute_id);
                            return attr;
                        });
                        return row;
                    });
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message||code
                    })
                })
            },
            init_attr_value(attrId){
                this.$http(api_get_attribute_value, attrId).then(res=>{
                    this.$set(this.vals, attrId, res);
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    });
                })
            },
            del_group(gindex){
                if(this.groups[gindex].action === 'add'){
                    this.groups[gindex].attributes=[];
                    this.groups.splice(gindex, 1);
                }else{
                    this.groups[gindex].action = "del";
                    this.groups[gindex].attributes=[];
                }

            },
            remove(gindex,aindex){
                this.groups[gindex].attributes.splice(aindex,1);
            },
            ndrag(el, key, target){
                //let target = document.elementFromPoint(event.pageX,event.pageY);
                console.log("test",target )
                let tkey = target.dataset.key;
                let attr = {
                    category_id:this.attrId,
                    attribute_id:key.id,
                    group_id:0,
                    alias:"",
                    sort:1,
                    search:"1",
                    sku:false,
                    gallery:false,
                    required:false,
                    name:key.name,
                    showPopver:false,
                    attribute_value:[]
                };
                this.init_attr_value(attr.attribute_id);
                if(tkey){
                    tkey = tkey.split("-");
                    this.groups[parseInt(tkey[0])].attributes.splice(tkey[1],0,attr);
                }else{
                    let tkey = findGroup(target);
                    if(tkey){
                        this.groups[parseInt(tkey)].attributes.push(attr)
                    }
                }
            },
            adrag(el, key, target){
                key = key.split("-");
                // let target = document.elementFromPoint(event.pageX,event.pageY);
                let tkey = target.dataset.key;
                if(tkey){
                    tkey = tkey.split("-");
                    let oattr = this.groups[parseInt(key[0])].attributes.splice(parseInt(key[1]),1);
                    this.groups[parseInt(tkey[0])].attributes.splice(tkey[1],0,oattr[0]);
                }else{
                    let tkey = findGroup(target);
                    if(tkey){
                        let oattr = this.groups[parseInt(key[0])].attributes.splice(parseInt(key[1]),1);
                        this.groups[parseInt(tkey)].attributes.push(oattr[0])
                    }
                }
            },
            gdrag(el, key, target){
                // let target = document.elementFromPoint(event.pageX,event.pageY);
                let tkey = findGroup(target);
                if(tkey){
                    tkey = parseInt(tkey);
                    let ogroup = this.groups[key];
                    let ngroup = this.groups[tkey];
                    this.groups.splice(tkey,1,ogroup);
                    this.groups.splice(key,1,ngroup);
                }
            },
            add_group(){
                this.groups.push({
                    group_id:0,
                    name:`分组${this.groups.length+1}`,
                    sort:1,
                    action:'add',
                    attributes:[]}
                );
            },
            edit_group_name(group){
                if(group.editName === undefined){
                    this.$set(group, "editName", false);
                }
                group.editName = !group.editName;
            },
            blur_group_name(group){
                group.editName = false;
            }
        },
        computed:{
            attrs(){
                let attrs = [];
                this.groups.forEach(group=>{
                    group.attributes.forEach(attr=>{
                        attrs.push(attr)
                    })
                });
                return attrs;
            },
            cattributes(){
                let attrs = [];
                this.attributes.forEach(attr=>{
                    let use = !!this.attrs.find(row=>row.attribute_id === attr.id);
                    this.$set(attr, "use", use);
                    attrs.push(attr);
                });
                return attrs;
            }
        },
        watch:{
            filter(val){
                let params = {
                    name:this.filter,
                    page:this.attributePage,
                    pageSize:this.attributePageSize
                };
                this.$http(api_get_attribute_dict, params).then(res=>{
                    this.attributePageSize = parseInt(res.pageSize);
                    this.attributePage= parseInt(res.page) ;
                    this.attributeCount=  parseInt(res.count);
                    this.attributes= res.data;
                })
            },
            value(val){
                this.show = val;
            },
            show(val){
                this.$emit("input", val);
            }
        },
        props:{
            value:{},
            attrId:{}
        },
        components:{
            uiTip:require("../../../components/ui-tip.vue").default,
            requestButton:require('@/global-components/request-button.vue').default,
        }
    }
</script>
