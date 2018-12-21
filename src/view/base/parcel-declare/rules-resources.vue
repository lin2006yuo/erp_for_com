<template>
    <page class="p-rules-resources">
        <h6 style="margin:0 0 5px 0">{{rightData.title}}</h6>
        <div v-for="(item, index) in rightData.data" >
            <!--复选-->
            <!--<div v-if="rightData.type==1&&item.type==''" class="checkClass">
                <div :class="[item.child.length>0?'firstBox':'']">
                    <el-checkbox v-model="item.checked" >{{item.title}}</el-checkbox>
                </div>
                <el-checkbox  v-for="child in item.child" class="checkbox"  v-model="child.checked"  @change="changeOne(item)">{{child.title}}</el-checkbox>
            </div>-->
            <div v-if="rightData.type==1&&item.type==''" class="checkClass">
                <div v-if="item.child.length>0">
                    <el-checkbox v-model="item.checked" class="title-checkbox">{{item.title}}</el-checkbox>
                    <el-collapse >
                        <el-collapse-item>
                            <template slot="title">
                            </template>
                            <el-checkbox  v-for="child in item.child" class="checkbox"  v-model="child.checked"  @change="changeOne(item)">{{child.title}}</el-checkbox>
                        </el-collapse-item>
                    </el-collapse>
                </div>
                <div v-if="item.child.length==0">
                    <el-checkbox v-model="item.checked" >{{item.title}}</el-checkbox>
                </div>
            </div>

            <!--单选框-->
            <div v-if="item.type==2||(rightData.type==2&&item.type=='')">
                <el-radio class="radio" v-model="rightData.radio" :label="item.key">{{item.title}}</el-radio>
            </div>
            <!--下拉框-->
            <div v-if="item.type==1">
                <el-select v-model="item.val" class="inline" @change="changeSelect(item)" clearable>
                    <el-option
                            :key="index"
                            v-for="(list,index) in item.condition"
                            :label="list"
                            :value="index">
                    </el-option>
                </el-select>
                <div v-if="!polyType(item.child)&&item.child.url" style="margin-top:5px">
                    <el-card class="select-tag">
                        <el-tag v-for="tag in selected_id">
                            {{tag.shortname}}
                            <i class="el-icon-circle-close" @click="remove(tag)"></i>
                        </el-tag>
                    </el-card>
                    <el-table ref="table" :data="mailLists" border style="width: 100%;" height="225" @select="selectOne" @select-all="select_all">
                        <el-table-column width="35" type="selection" align="center" ></el-table-column>
                        <el-table-column prop="shortname" label="名称" width="150" show-overflow-tooltip align="center"></el-table-column>
                        <el-table-column prop="code" label="代码" show-overflow-tooltip align="center"></el-table-column>
                        <el-table-column prop="name" label="物流商" show-overflow-tooltip align="center"></el-table-column>
                        <el-table-column prop="period_type" label="类型" show-overflow-tooltip align="center"></el-table-column>
                        <el-table-column  label="状态" inline-template align="center">
                            <div>{{ row.is_add }}</div>
                        </el-table-column>
                    </el-table>
                    <div style="text-align:right;margin-top:10px">
                        <el-pagination
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page=tables.page
                                :page-sizes="[20, 50, 100, 200,500]"
                                :page-size=tables.pageSize
                                layout="total, sizes, prev, pager, next, jumper"
                                :total=total>
                        </el-pagination>
                    </div>
                </div>
                <label style="color:red">{{item.desc}}</label>
            </div>
            <!--文本框-->
            <div v-if="item.type==3">
                <el-input v-model="item.val" class="inline"></el-input>
                <label>{{item.unit}}</label>
                <label style="color:red">{{item.desc}}</label>
            </div>
            <!--复选+下拉框或者文本框-->
            <div v-if="item.type==5" style="margin-top: 5px;">
                <el-checkbox v-model="item.checked">{{item.title}}</el-checkbox>
                <el-select v-model="item.operator" class="inline" v-if="!polyType(item.condition)">
                    <el-option
                            :key="index"
                            v-for="(list,index) in item.condition"
                            :label="list"
                            :value="index">
                    </el-option>
                </el-select>
                <el-input v-model="item.val" class="inline"></el-input>
                <label>{{item.unit}}</label>
                <label style="color:red">{{item.desc}}</label>
            </div>
            <!--多文本框-->
            <div v-if="item.type==4">
                <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="item.val" class="inline" style="width:200px" v-if="item.url==''">
                </el-input>
                <selects :request="item.url" v-model="item.val"  v-else></selects>
                <label>{{item.unit}}</label>
                <label style="color:red">{{item.desc}}</label>
            </div>
            <!--复选+两文本框-->
            <div v-if="item.type==7">
                <el-checkbox v-model="item.checked" >{{item.title}}</el-checkbox>
                <el-input v-model="item.val" class="inline"></el-input>
                <el-input v-model="item.other" class="inline"></el-input>
                <label>{{item.unit}}</label>
                <label style="color:red">{{item.desc}}</label>
            </div>
            <!--树形-->
            <div v-if="item.type==8">
                <node-tree :select="select" @change="change" :child="child" :data="data"></node-tree>
            </div>
        </div>
    </page>
</template>
<style lang="stylus">
    .p-rules-resources{
        padding: 0 10px 5px 20px;
        .checkClass{
            position: relative;
            .el-checkbox + .el-checkbox{
                margin-left: 0px!important;
            }
            .checkbox{
                width: 33.3333%;
                display: inline-block;
            }
          /*  .firstBox{
                padding: 5px 0 5px 0;
                border-bottom: 2px solid;
                margin-bottom: 5px;
                margin-left: -10px;
            }*/
            .el-collapse-item__header{
                padding-left: 0;
            }
            .el-collapse-item__content{
                padding: 10px 0px 10px 30px;
            }
            .title-checkbox{
                position: absolute;
                top: 0;
                left: 20px;
            }
            .el-collapse-item__header__arrow:hover{
                color: red;
            }
        }
        .el-table__body-wrapper{
            overflow-x: hidden;
        }
        .select-tag{
            margin: 5px 0;
            min-height: 50px;
            .el-tag{
                margin:0 5px 5px 0;
                .el-icon-circle-close{
                    cursor: pointer;
                }
                .el-icon-circle-close:hover{
                    color: red;
                }
            }
        }
    }
</style>
<script>
    import nodeTree from './node-tree.vue'
    import http from '../../../lib/http';
    export default{
        data(){
            return {
                data:{},
                child:{},
                select:[],
                mailLists:[],
                selected_id:[],
                tables:{
                    page:1,
                    pageSize:50,
                    carrier_id:''
                },
                url:'',
                total:0
            }
        },
        created(){

        },
        mounted(){
            let url = config.apiHost+'categories';//---暂时写死如果需要更改接口需要修改该URL
            let request = () =>{
                return http('GET', url);
            };
            this.$http(request).then(res=>{
                this.data = res;
                this.child =res;
            }).catch(code=>{
                console.error(code);
            })
        },
        methods: {
            filterMethod(value){
                console.log(value)
            },
            polyType(data){
                if(data instanceof Array){
                    return true
                }else{
                    return false
                }
            },
            /*---------全选*/
            changeOne(data){
                data.checked=!!data.child.find(val=>val.checked)
            },
            /*----分类树形*/
            change(){
                if(this.data.child_ids){
                    let check = [];
                    let childs = (ids) =>{
                        ids.forEach(id=>{
                            if(this.data[id].child_ids.length > 0){
                                childs(this.data[id].child_ids);
                            }else{
                                if(this.data[id].check){
                                    check.push(id);
                                }
                            }
                        })
                    };
                    childs(this.data.child_ids);
                    this.select=check;
                    console.log(this.select);
                }
            },
            /*-----获取邮件方式*/
            changeSelect(data){
                console.log('changeData',data);
                if(!this.polyType(data.child)&&data.child.url){
                    console.log('!!!!!!!!!!!data',JSON.stringify(data));
                    this.url=data.child.url;
                    this.tables.carrier_id=data.val;
                    this.serverFun(this.url,this.tables)
                }
            },
            serverFun(url,params){
                let request = () =>{
                    return http('GET',config.apiHost+url,params);
                };
                this.$http(request).then(res=>{
                    console.log(res);
                    this.mailLists=res.data;
                    this.refresh_rows();
                    this.total=res.count;

                }).catch(code=>{
                    console.error(code);
                })
            },
            refresh_rows(){
                this.$nextTick(()=>{
                    console.log(this.selected_id);
                    this.mailLists.forEach(row=>{
                        let selected=!!this.selected_id.find(obj=>obj.id===row.id);
                        this.$refs.table[0].toggleRowSelection(row,selected)
                    });
                })
            },
            handleSizeChange(val) {//---------------分页每页显示条数
                console.log(val);
                this.tables.pageSize = val;
                this.serverFun(this.url,this.tables)
            },
            handleCurrentChange(val) {//------------分页当前页
                this.tables.page = val;
                this.serverFun(this.url,this.tables)
            },
            selectOne(selection,row){
                console.log('8888888888888',selection,row);
                let isSelect = !!selection.find(obj=>obj.id===row.id);
                if(isSelect){
                    this.selected_id.push(row);
                }else{
                    this.selected_id.forEach((data,index)=>{
                        if(data.id===row.id){
                            this.selected_id.splice(index,1)
                        }
                    })
                }
                console.log(this.selected_id)
            },
            select_all(selection){
                console.log('99999999999999',selection);
                console.log('aaaaa',this.selected_id);
                let tampArr=[];
                this.selected_id.forEach(id=>{
                    tampArr.push(id.id)
                });
                console.log(tampArr);
                    if(selection.length>0){
                        selection.forEach(item=>{
                            if(tampArr.indexOf(item.id)===-1){
                                this.selected_id.push(item)
                            }
                        })
                    }else{
                        console.log('bbbbb',this.mailLists);
                        this.mailLists.forEach(row=>{
                            this.selected_id.forEach((data,index)=>{
                                if(row.id===data.id){
                                    this.selected_id.splice(index,1);
                                }
                            })
                        })
                    }
                console.log('99999999999999',this.selected_id);
            },
            remove(tag){
                console.log(tag);
                console.log(this.selected_id);
                this.selected_id.forEach((data,index)=>{
                    if(tag.id===data.id){
                        this.selected_id.splice(index,1);
                        this.refresh_rows();
                    }
                })
            }
            /*-------------------end*/
        },
        filters: {},
        watch: {
            'rightData.data'(data){
                data.forEach(item=>{
                    if(item.type==1&&item.val&&!this.polyType(item.child)&&item.child.url){
                        this.serverFun(this.url,this.tables)
                    }
                })
            },
        },
        computed: {},
        props: {
            rightData:{},
            markId:{}
        },
        components: {
            nodeTree,
            selects:require('./selects.vue').default
        }
    }
</script>
