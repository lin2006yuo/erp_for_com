<template>
    <span :class="!!$slots.default?'':'rule1'">
        <span :class="$slots.default?'rule1-parent' : ''" :title="form.title" v-if="polyType(form.child)&&!form.child.url">
            <i v-if="$slots.default"  :class="[showChild?'el-icon-caret-bottom':'el-icon-caret-right','mr-lg']" @click="showChild = !showChild"></i><el-checkbox name="Fruit" v-model="selected_id" :label="form.title"></el-checkbox>
        </span>
        <el-select class="inline condition" v-if="condition.length > 1&&polyType(form.child)&&!form.child.url" v-model="operator.sel" style="width:200px">
            <el-option v-for="item in condition" :key="item_value(item)" :label="item_label(item)" :value="item_value(item)"></el-option>
        </el-select>
        <div v-if="!polyType(form.child)&&form.child.url" style="margin-top:5px">
            <el-select class="inline condition" v-model="selectVal" @change="changeSelect(selectVal)" style="width:200px">
                 <el-option v-for="item in condition" :key="item_value(item)" :label="item_label(item)" :value="item_value(item)"></el-option>
            </el-select>
            <el-card class="rule1-select-tag">
                <el-tag v-for="tag in selected_id" :key="tag.shortname">
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
        <span v-if="condition.length === 1">
            {{item_label(condition[0])}}
        </span>
        <div class="rule1-child" v-if="$slots.default&&polyType(form.child)&&!form.child.url" v-show="showChild">
            <slot></slot>
        </div>
        <p class="rule-desc" v-if="form.desc">{{form.desc}}</p>
    </span>
</template>
<style lang="stylus">
    .rule1-parent{
        font-size:16px;
        display: block;
        border-top:2px solid #4e92ce;
        >.el-checkbox{
            >.el-checkbox__label{
                font-size:1.3rem;
                font-weight:bold;
            }
        }
    }
    .rule1-child{
        padding:10px;
    }
    .rule1{
        width:33%;
        display: inline-block;
        label{
            display: inline-block;
            width: 95%;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
    }
    .rule1 + .rule1{
        width:33%;
        display: inline-block;
        label{
            display: inline-block;
            width: 95%;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
    }
    .rule-check{
        padding: 0;
        margin: 0px;
        line-height: 26px;
        vertical-align: middle;
        background: #fff;
    }
    .rule1-select-tag{
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
</style>
<script>

    export default{
        data(){
            return{
             /*   input:this.value,*/
                mailLists:[],
                selected_id:this.value||[],
                tables:{
                    page:1,
                    pageSize:50,
                    carrier_id:''
                },
                url:'',
                total:0,
                selectVal:'',
                showChild:false,
            }
        },
        methods:{
            item_label(item){
                return Object.values(item)[0];
            },
            item_value(item){
                return Object.keys(item)[0];
            },
            polyType(data){
                if(data instanceof Array){
                    return true
                }else{
                    return false
                }
            },
            /*-----获取邮件方式*/
            changeSelect(data){
                console.log('changeData',data);
                if(this.form.child.url){
                    this.url=this.form.child.url;
                    this.tables.carrier_id=data;
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
                        this.$refs.table.toggleRowSelection(row,selected)
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
        computed:{
            condition(){
                if(this.form.condition instanceof Array){
                    let tempArr=[];
                   this.form.condition.forEach(item=>{
                       let obj = {};
                        obj[item.id]=item.shortname;
                       tempArr.push(obj)
                    });
                    return tempArr;

                }else{
                    return objToArray(this.form.condition, (val,key) =>{
                        let obj = {};
                        obj[key] = val;
                        return obj;
                    });
                }
            }
        },
        watch:{
            selected_id(val){
                this.$emit('input',val);
            },
            value(val){
                if(typeof val[0] === 'string'){
                    if(val.length>0){
                        this.selected_id = true;
                    }
                }else{
                    this.selected_id = val;
                }

            },
            form(form){
            }
        },
        props:{
            form:{},
            value:{},
            operator:{}
        },
        components:{

        }
    }
</script>
