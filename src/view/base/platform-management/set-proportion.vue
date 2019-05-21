<template>
   <div class="mt-md">
        <el-table :data="tableData">
            <div slot="empty">
                暂无数据
                <div class="inline">
                    <div class="add-icon inline" @click="add_a_row">
                    </div>
                </div>
            </div>
            <el-table-column label="部门">
                <template slot-scope="scope">
                    <el-select v-if="!scope.row.department_name"
                               v-model="scope.row.department_id"
                               placeholder="请选择"
                               @visible-change="get_dep_info">
                        <el-option v-for="dep of deps"
                                   :label="dep.label"
                                   :value="dep.value"
                                   :key="dep.value">
                        </el-option>
                    </el-select>
                    <span v-else>{{scope.row.department_name}}</span>
                </template>
            </el-table-column>
            <el-table-column label="产品数占比" prop="proportion" inline-template>
                <template>
                    <div class="long" v-if="edit">
                        <el-input v-model="row.product_proportion"></el-input>
                    </div>
                    <span v-else>{{row.product_proportion}}</span>
                    <span>%</span>
                </template>               
            </el-table-column>
            <el-table-column label="预计利润率">
                <el-table-column label="本部" prop="in" inline-template>
                    <template>
                        <div class="long" v-if="edit">
                            <el-input   v-model="row.profit_in"></el-input>
                        </div>
                        <span v-else>{{row.profit_in}}</span>
                        <span>%</span>
                    </template>
                </el-table-column>
                <el-table-column label="外部" prop="out" inline-template>
                    <template>
                        <div class="long" v-if="edit">
                            <el-input  v-if="edit" v-model="row.profit_out"></el-input>
                        </div>
                        <span v-else>{{row.profit_out}}</span>
                        <span>%</span>
                    </template>                 
                </el-table-column>
            </el-table-column>
            <el-table-column label="随机抽取产品数" prop="random" inline-template>
                <template>
                    <div class="inline" v-if="edit">
                        <div class="short">
                            <el-input v-model="row.product_count"></el-input>
                        </div>
                        <div class="inline">
                            <div class="delete-icon inline" 
                                v-if="true"
                                @click="reduce_a_row($index)">
                            </div>
                            <div class="add-icon inline" 
                                v-if="$index===tableData.length-1"
                                @click="add_a_row(row)">
                            </div>
                            <div class="holder" v-else></div>
                        </div>
                    </div>
                    <span v-else>{{row.product_count}}</span>       
                </template>                
            </el-table-column>                    
        </el-table>
        <div class="mt-md">
            <!-- <permission tag="ElButton"
                        class="fr ml-sm" 
                        :route="apis.url_post_proportion" 
                        size="mini" type="primary" 
                        v-if="tableData.length!=0&&edit" 
                        @click="set_proportion" >确定
            </permission> -->
            <!-- <el-button size="mini" class="fr ml-sm" v-if="tableData.length!=0&&edit" @click.native="close">关 闭</el-button> -->
            <el-button size="mini" class="fr ml-sm" v-if="!edit" @click.native="show_edit">编 辑</el-button>
        </div>
    </div>
</template>

<style lang="stylus" scoped>
    .holder
        width:20px
        height:20px
        display:inline-block
    .long
        display:inline-block
        width:60%
    .short
        display:inline-block
        width:40%
    .add-icon,.delete-icon
        cursor:pointer
</style>

<script>
import {
    url_post_proportion,
    api_get_departments,
    api_get_proportion,
    api_post_proportion
} from '@/api/platform-management';
import { setTimeout } from 'timers';
export default {
    permission:{
        url_post_proportion
    },
    beforeMount(){
        //获取占比信息
        this.$http(api_get_proportion,this.id)
            .then((res)=>{
                this.tableData=res;
                this.num=res.length-1;
            })
    },
    data(){
        return{
            tableData:[],
            dep:'',
            deps:[],
            num:0,
            edit:false
        }
    },
    methods:{
        set_proportion(){
            let data=this.tableData.map((item=>{
                return {
                    id:parseInt(item.id),
                    department_id:parseInt(item.department_id),
                    product_proportion:parseInt(item.product_proportion),
                    profit_in:parseInt(item.profit_in),
                    profit_out:parseInt(item.profit_out),
                    product_count:parseInt(item.product_count)
                }
            }))
            let list={lists:data};
            
            if(this.validate(data)){
                this.$http(api_post_proportion,this.id,list)
                    .then((res)=>{
                        console.log("占比设置保存成功");
                        this.edit=false;
                        this.$emit("submit-distribution");
                    })
                    .catch((code)=>{
                        this.$message({type:'error',message:code.message||code});
                    })
            }
            else{
                this.$message({type:'warning',message:'必填项不能为空！'});
            }
        },
        add_a_row(){
            // this.get_dep_info();
            let newRow={
                id:0,
                department_id:'',
                product_proportion:'',
                profit_in:'',
                profit_out:'',
                product_count:3
            };
            this.tableData.push(newRow);
            this.edit=true;
        },
        reduce_a_row(index){
            this.tableData.splice(index,1);
            this.addIcon=true;
        },
        //验证必填项是否为空
        validate(data){  
            for(let i=0;i<data.length;i++){
                let keys=Object.keys(data[i]);
                
                for(let j=0;j<keys.length;j++){
                    let key=keys[j];
                    
                    if(!data[i][key]&&data[i][key]!=0){     //排除值为0的情况
                        return false;
                    }
                }
            }
            return true
        },
        get_dep_info(val){  //获取下拉框部门信息
            console.log(val);
            if(val){
                this.deps=[];
                this.$http(api_get_departments,this.id)
                    .then((res)=>{
                        this.remove_duplicate_dep(res);
                })
            }
        },
        //过滤重复的部门
        remove_duplicate_dep(res){
            res.forEach(item=>{
                for(let i=0;i<this.tableData.length;i++){
                    
                    let values=Object.values(this.tableData[i]);
                    
                    if(values.includes(item.id)){
                        break;
                    }
                    else if(i===this.tableData.length-1){
                        this.deps.push({label:item.name,value:item.id});
                    }
                }
            })
        },
        show_edit(){
            this.edit=true;
        }
    },
    computed:{
        show:{
            get(){
                return this.value;
            },
            set(val){
                this.$emit("input",val)
            }
        }
    },
    props:{
        value:{
            type:Boolean,
            require:true
        },
        title:{
            type:String,
            require:true
        },
        id:{}
    },
    components: {
        pageDialog: require('@/components/page-dialog.vue').default,
    }
}
</script>
