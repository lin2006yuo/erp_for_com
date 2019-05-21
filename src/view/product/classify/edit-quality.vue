<template>
    <el-row class="edit-attr">
        <el-col :span="18">
            <div class="group" v-for="(group,gindex) in groups" :key="gindex"
                 v-if="group.action !== 'del'"
                 v-drag="{func:gdrag,params:gindex}" :data-group="gindex">
                <template v-if="group.editName">
                    <el-select class="inline" style="margin-top:-3px"
                               v-model="group.qc_group_id"
                    >
                        <el-option v-for="gi in filter_group_infos(group)"
                                   :key="gi.value"
                                   :label="gi.name" :value="gi.id"></el-option>
                    </el-select>
                    <el-button @click.native="blur_group_name(group)" type="primary" size="small">确定</el-button>
                </template>
                <label v-else @dblclick="edit_group_name(group)" class="group-label">
                    {{group_name(group)}}
                </label>
                <el-button type="danger" size="mini" @click.native="del_group(gindex)">删除分组</el-button>
                <ul class="attrs mt-xs">
                    <li class="attr" v-for="(attr,aindex) in group.items" :key="aindex"  v-drag="{func:adrag,params:gindex+'-'+aindex}" :data-key="gindex+'-'+aindex" >
                        <el-button type="danger" size="mini" @click.native="remove(gindex,aindex)" :plain="true" >删除</el-button>
                        <label class="label-width" :title="attr.name">{{attr.name}}</label>
                        <el-checkbox  class="hands"  v-model="attr.is_qc_required" @input="try_required_qc(attr)" label="是否必检"></el-checkbox>
                        <label-item class="inline" label="选择检具：">
                            <el-select :multiple="true" v-model="attr.check_tool">
                                <el-option v-for="tool in tools"
                                           :key="tool.id"
                                :label="tool.name" :value="tool.id"></el-option>
                            </el-select>
                        </label-item>
                    </li>
                </ul>
            </div>
            <el-card class="mt-xs">
                <request-button req-key="editQuality" @click="submit">提交</request-button>
                <el-button type="primary" @click.native="add_group"  size="mini">添加分组</el-button>
            </el-card>
        </el-col>
        <el-col :span="5"  class="ml-md">
            <ul class="attr-filter"  :class="cattributes.length===0?'bor':''"  style="padding-bottom:5px">
                <template v-for="attr in cattributes"   >
                    <template v-if="attr.use">

                        <span style="display:flex"  :key="`${attr.attribute_id}-${attr.use}`"  class=" use mt-xs ml-xs">
                             <el-button size="mini" style="flex:1">{{attr.name}}</el-button>
                            <i class="el-icon-circle-check" style="width:20px;line-height:26px;text-align:center;color:#008BCE"></i>
                        </span>

                    </template>
                    <template v-else>
                        <span style="display:flex"  :key="`${attr.attribute_id}`" v-drag="{func:ndrag,params:attr}"   class="mt-xs ml-xs">
                         <el-button size="mini" style="flex:1;margin-right:20px">{{attr.name}}</el-button>
                        </span>
                    </template>
                </template>
            </ul>
        </el-col>
    </el-row>
</template>
<style lang="stylus">
.edit-attr{
    .el-tag.el-tag--primary{
        margin-top: 6px;
    }
    .hands{
        cursor: default;
    }
    .c-label-item.inline{
        label{
         margin-top: -5px;
        }
    }
}
</style>
<script>

    import {api_set_quality,api_get_group_infos, api_get_checktool, api_set_attributes, api_save_quality} from '../../../api/categories';
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
                attributePageSize:10,
                attributeCount:0,
                groups:[],
                tools:[],
                group_infos:[]
            }

        },
        mounted(){
            this.init();
            this.$http(api_get_checktool).then(res=>{
                this.tools = res;
            }).catch(code=>{
                this.$message({
                    type:'error',
                    message:code.message || code
                })
            });
            this.$http(api_get_group_infos).then(res=>{
                this.group_infos = res;
            }).catch(code=>{
                this.$message({
                type:'error',
                message:code.message || code
            })
            })
        },
        methods:{
            reload(){
                this.init();
            },
            group_name(group){
                let find = this.group_infos.find(row=>row.id === group.qc_group_id);
                if(find){
                    return find.name;
                }else{
                    return "默认分组";
                }
            },
            filter_group_infos(group){
                return this.group_infos.filter(row=>{
                    return row.id === group.qc_group_id || !this.groups.find(row2=>{
                        return row.id === row2.qc_group_id
                    })
                });
            },
            submit(){
                let group = this.groups.map((row,sort)=>{
                    return {
                        sort,
                        qc_group_id:row.qc_group_id,
                        items:row.items.map(item=>{
                            return {
                                attribute_id:item.attribute_id,
                                is_qc_required:item.is_qc_required ? 1 : 0,
                                check_tool:item.check_tool
                            };
                        })
                    };
                });
                this.$http(api_save_quality, {category_id:this.attrId, group:group}).then(res=>{
                    this.$message({
                    type:'success',
                    message:"保存成功"
                })
                }).catch(code=>{
                    this.$message({
                    type:'error',
                    message:code.message || code
                    })
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('editQuality',false)
                    },300);
                })
            },
            handleSizeChange(){

            },
            handleCurrentChange(){

            },
            try_required_qc(row){
                if(row.is_qc_required){
                    let attr = this.cattributes.find(old=>{
                        return old.id === row.attribute_id
                    });
                    if(!attr.required){
                        row.is_qc_required = false;
                        this.$message({
                            type:'error',
                            message:'不是必填属性，不能必检'
                        })
                    }
                }
            },
            init(){
                this.$http(api_set_quality, this.attrId).then(res=>{
                    this.groups = res.map(row=>{
                        this.$set(row, 'action', 'modify');
                        row.items = row.items.map(item=>{
                            item.is_qc_required = item.is_qc_required ? true : false;
                            item.check_tool = item.check_tool || [];
                            return item;
                        });
                        return row;
                    });
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message||code
                    })
                });
                this.attributes = [];
                this.$http(api_set_attributes, this.attrId).then(res=>{
                    res.forEach(row=>{
                        row.attributes.forEach(rowAttr=>{
                            let attr = {
                                id:rowAttr.attribute_id,
                                required:!!rowAttr.required,
                                name:rowAttr.name,
                                alias:rowAttr.alias
                            };
                            this.attributes.push(attr);
                        })
                    })
                })
            },
            del_group(gindex){
                if(this.groups[gindex].action === 'add'){
                    this.groups[gindex].items=[];
                    this.groups.splice(gindex, 1);
                }else{
                    this.groups[gindex].action = "del";
                    this.groups[gindex].items=[];
                }
            },
            remove(gindex,aindex){
                this.groups[gindex].items.splice(aindex,1);
            },
            ndrag(el, key, target){
               // let target = document.elementFromPoint(event.pageX,event.pageY);
                let tkey = target.dataset.key;
                let attr = {
                    category_id:this.attrId,
                    attribute_id:key.id,
                    group_id:0,
                    alias:"",
                    sort:1,
                    is_qc_required:false,
                    name:key.name,
                    check_tool:[]
                };
                console.log(attr);
                if(tkey){
                    tkey = tkey.split("-");
                    let groupid = this.groups[parseInt(tkey[0])].group_id;
                    attr.group_id = groupid;
                    this.groups[parseInt(tkey[0])].items.splice(tkey[1],0,attr);
                }else{
                    let tkey = findGroup(target);
                    if(tkey){
                        let groupid = this.groups[parseInt(tkey)].group_id;
                        attr.group_id = groupid;
                        this.groups[parseInt(tkey)].items.push(attr)
                    }
                }
            },
            adrag(el, key, target){
                key = key.split("-");
                //let target = document.elementFromPoint(event.pageX,event.pageY);
                let tkey = target.dataset.key;
                if(tkey){
                    tkey = tkey.split("-");
                    let oattr = this.groups[parseInt(key[0])].items.splice(parseInt(key[1]),1);
                    this.groups[parseInt(tkey[0])].items.splice(tkey[1],0,oattr[0]);
                }else{
                    let tkey = findGroup(target);
                    if(tkey){
                        let oattr = this.groups[parseInt(key[0])].items.splice(parseInt(key[1]),1);
                        this.groups[parseInt(tkey)].items.push(oattr[0])
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
                    qc_group_id:"",
                    editName:true,
                    sort:1,
                    action:'add',
                    items:[]}
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
                    group.items.forEach(attr=>{
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
                    this.attributePageSize = res.pageSize;
                    this.attributePage= res.page;
                    this.attributeCount= res.count;
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
            labelItem:require('../../../components/label-item.vue').default,
            requestButton:require('@/global-components/request-button.vue').default,
        }
    }
</script>