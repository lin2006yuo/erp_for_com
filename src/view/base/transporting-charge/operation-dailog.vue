<template>
    <page-dialog    v-model="show"
                    :title="title"
                    :close-on-cilck-modal="false"
                    @open="open"
                    @close="close">      
        <el-form    :model="dialogData"
                    label-position="right" 
                    label-width="180px"
                    ref="add"
                    :rules="rules">
            <el-form-item label="月份：" prop="date">
                    <el-date-picker v-model="dialogData.date"
                                    type="month"
                                    size="small"
                                    placeholder="选择日期">
                    </el-date-picker>
            </el-form-item>
            <el-form-item label="发货仓库：" prop="warehouse_id">
                <el-col :span="14">
                    <el-select v-model="dialogData.warehouse_id" filterable placeholder="请选择">
                        <el-option  v-for="item in warehouses"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id+''">
                        </el-option>
                    </el-select>  
                </el-col>
            </el-form-item>
            <el-form-item label="物流商：" prop="carrier_id">
                <el-col :span="14">
                    <el-select v-model="dialogData.carrier_id" filterable placeholder="请选择">
                        <el-option  v-for="item in carriers"
                                    :key="item.id"
                                    :label="item.fullname"
                                    :value="item.id+''">
                        </el-option>
                    </el-select>
                </el-col> 
            </el-form-item>
            <el-form-item label="币种：" prop="currency_code">
                <el-col :span="8">
                    <el-select v-model="dialogData.currency_code" filterable placeholder="请选择">
                        <el-option  v-for="item in currency"
                                    :key="item.id"
                                    :label="item.code"
                                    :value="item.code">
                        </el-option>
                    </el-select> 
                </el-col>               
            </el-form-item>
            <el-form-item label="转运费标准：" prop="fee">
                <el-col :span="8">
                    <el-input v-model="dialogData.fee" placeholder="请输入"></el-input>
                </el-col>
                <el-col :span="2">
                    <span>&nbsp;&nbsp;/KG</span>
                </el-col>    
            </el-form-item>
            <el-form-item label="状态：">
                <el-switch	v-model="dialogData.status"
                            :on-value="0"
                            :off-value="1"
                            @click.native="status_click"
							on-text="启用"
							off-text="停用">
				</el-switch>
            </el-form-item>
        </el-form>            
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" type="primary" @click.native="add">确定</el-button>
            <el-button size="mini" @click.native="close">取消</el-button>
        </div>  
   </page-dialog>
</template>

<script>
import {
    api_get_warehouse,
    api_get_carrier,
    api_post_transfer_fee
} from '@/api/transporting-charge.js'
import { setTimeout } from 'timers';
export default {
    mounted(){
        this.init();
    },
    data(){
        let validateNum=(rule,value,callback)=>{
            if(/^[0-9]+[.]?[0-9]*$/.test(value)){
                callback();
            }
            else{
                return callback(new Error('只允许输入数字'))
            }
        }

        return{
            warehouses:[],
            carriers:[],
            rules:{
                date:[
                    {type:'date',required:true,message:'必填项不能为空',trigger:'change'}
                ],
                warehouse_id:[
                    {required:true,message:'必填项不能为空',trigger:'change'}
                ],
                currency_code:[
                    {required:true,message:'必填项不能为空',trigger:'change'}
                ],
                carrier_id:[
                    {required:true,message:'必填项不能为空',trigger:'change'}
                ],
                fee:[
                    {required:true,message:'必填项不能为空',trigger:'change'},
                    {validator:validateNum,trigger:'change'}
                ],
            }
        }
    },
    methods:{
        open(){},
        close(){
           this.show=false;
        },
        init(){
            this.get_warehouse();
            this.get_carrier();
        },
        get_warehouse(){
            this.$http(api_get_warehouse,{pageSize:200})
                .then(res=>{
                    console.log("获取仓库列表:",res);
                    this.warehouses=res.data;
                })
                .catch(err=>{
                    console.log(err.message);
                })
        },
        get_carrier(){
            this.$http(api_get_carrier,{pageSize:200})
                .then(res=>{
                    console.log("获取物流商:",res);
                    this.carriers=res.data;
                })
                .catch(err=>{
                    console.log(err.message);
                })
        },
        add(){
            this.$refs.add.validate(valid=>{
                if(valid){
                    this.add_charge();
                }
                else{return}
            })
        },
        add_charge(){
            // console.log("dialogData:",this.dialogData);
            let data=clone(this.dialogData);
            data.carrier_id=data.carrier_id-0;
            data.fee=data.fee-0;
            data.warehouse_id=data.warehouse_id-0;
            console.log("时间:",data.date);
            data.date=datef("YYYY-MM-dd HH:mm:ss",(new Date(data.date).getTime())/1000);
            console.log("data:",data);

            this.$http(api_post_transfer_fee,data)
                .then(res=>{
                    console.log("res",res);
                    this.$message({type:'success',message:res.data.message})
                    this.$emit("refresh");
                    setTimeout(()=>{
                        this.show=false;
                    },300)})
                .catch(error=>{
                    this.$message({type:'error',message:error.message});
                })
        },
        status_click(e){
            e.preventDefault();
        }
    },
    props:{
        title:{},
        value:{
            required:true,
            type:Boolean
        },
        dialogData:{
            required:true,
            type:Object
        },
        currency:{}
    },
    computed:{
        show:{
            get(){
                return this.value;
            },
            set(val){
                this.$emit('input',val);
            }
        }
    },
    filters:{
		dateFilter(val){
			return datef('YYYY-MM-dd HH:mm:ss',val);
		}
	},
    components:{
        pageDialog:require('@/components/page-dialog').default
    }
}
</script>

<style>

</style>


