<template>
    <page class="p-dialog">
        <page-dialog :title="title" v-model="dialog" size="small" :close-on-click-modal="false" @change="change_dialog">
            <div style="width: 100%;text-align: center;">
                <label-item label="预警数量：" class="mb-xs label_one" v-if="valueShow===1">
                    <integer-input v-model="number" :min="1"></integer-input>
                </label-item>
                <label-item label="原货位：" class="mb-xs dis_block" v-if="valueShow===2">
                    <el-select  v-model="from_cargo_id"
                                :disabled="!!fromCargoId"
                                filterable
                                clearable
                                class="inline width-sm"
                                style="width: 170px;">
                        <el-option
                            :key="item.id"
                            v-for="item in cargoList"
                            :label="item.label"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </label-item>
                <label-item label="新货位：" class="mb-xs dis_block" v-if="valueShow===2">
                    <warehouse-cargo v-model="to_cargo_id" :params-data="paramsData"  style="width: 170px;"></warehouse-cargo>
                </label-item>
                <label-item label="数   量： " class="mb-xs dis_block" v-if="valueShow===2">
                    <integer-input v-model="quantity" :min="1" style="width: 170px;"></integer-input>
                </label-item>
            </div>
            <div slot="footer" class="dialog-footer">
                <request-button req-key="change_alert" @click="save" v-if="valueShow===1">保存</request-button>
                <request-button req-key="shiftAdd" @click="get_shift" v-if="valueShow===2">确定</request-button>
                <el-button size="mini" @click.native="dialog=false" v-if="valueShow==1">关闭</el-button>
                <el-button size="mini" @click.native="dialog=false" v-if="valueShow===2">取消</el-button>
            </div>
        </page-dialog>
    </page>
</template>
<style lang="stylus">
    .label_one{
        display:block;
        margin-top :50px;
        margin-bottom :50px;
    }
    .dis_block{
        display:block;
        margin :25px;
    }
</style>
<script>
    import {api_get_channel} from '@/api/request-note';
    import {warehouse_cargo_lists} from '@/api/local';
    export default{
        data(){
            return {
                dialog:false,
                number:'',
                quantity:'',
                channel_id:'',
                from_cargo_id:'',
                to_cargo_id:'',
                quantity:'',
                params:{},
                cargoList:[]
            }
        },
        mounted(){

        },
        methods: {
            save(){
            	if(!this.number){
            		this.$message({type:'warning',message:`请输入预警数量`});
                    this.$reqKey(`change_alert`, false);
            		return ;
                }
            	this.dialog = false;
                this.$emit('save-alert',this.number)
            },
            get_shift(){
                if(!this.from_cargo_id){
                    this.$message({type:'warning',message:`请输入原货位`});
                    this.$reqKey(`shiftAdd`, false);
                    return ;
                }
                if(!this.from_cargo_id){
                    this.$message({type:'warning',message:`请输入新货位`});
                    this.$reqKey(`shiftAdd`, false);
                    return ;
                }
                if(!this.quantity){
                    this.$message({type:'warning',message:`请输入数量`});
                    this.$reqKey(`shiftAdd`, false);
                    return ;
                }else if(Number(this.quantity)===0){
                    this.$message({type:'warning',message:`数量不能为0`});
                    this.$reqKey(`shiftAdd`, false);
                    return ;
                }
            	let data = {
                    from_cargo_id :this.from_cargo_id,
                    to_cargo_id :this.to_cargo_id,
                    quantity :this.quantity,
                };
//            	console.log("移库",data);
                this.$emit('get-shift',data);
            },
            submit(){
            	let data = {
                    quantity:this.quantity,
                    channel_id:this.channel_id,
                };
                this.$emit('save-apply',data)
            },
            change_dialog(val){
//            	console.log("pdd-order",this.fromCargoId);
            	if(this.fromCargoId){
                    this.from_cargo_id = this.fromCargoId;
                }else{
                    this.from_cargo_id = '';
                }
                this.to_cargo_id = '';
                this.quantity = '';
                this.number = '';
            }
        },
        filters: {},
        watch: {
            dialog(val){
                this.$emit('input',val)
            },
            value(val){
                this.dialog = val;
                this.number = '';
                this.quantity = '';
                this.to_cargo_id = '';
            },
            alertQuantity(val){
            	if(val){
            		this.number = val;
                }
            },
            paramsOldData(val){
            	if(val){
                    this.$http(warehouse_cargo_lists,this.paramsOldData).then(res=>{
                        this.cargoList = res.map(row=>{
                            return {
                                id:row.id,
                                label:row.code,
                            }
                        });
//                        console.log('this.cargoList',this.cargoList);
                    });
                }
            }
        },
        computed: {},
        props: {
            value:{},
            title:{},
            valueShow:{},
            alertQuantity:{},
            fromCargoId:{},
            paramsData:{},
            paramsOldData:{},
        },
        components: {
            RequestButton: require('@/global-components/request-button').default,
            labelItem:require('@/components/label-item.vue').default,
            pageDialog:require('@/components/page-dialog.vue').default,
            warehouseCargo:require('@/api-components/warehouse-cargo.vue').default,
            integerInput:require('@/components/integer-input.vue').default,
        }
    }
</script>
