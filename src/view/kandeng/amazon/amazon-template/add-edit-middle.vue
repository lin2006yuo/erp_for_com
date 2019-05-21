<template>
    <ui-table
        :body-height="150"
        :heads="[
        {label:'NO',width:7},
        {label:'优先级',width:13},
        {label:'属性名称',width:25},
        {label:'自定义显示名称',width:25},
        {label:'属性设置',width:22},
        {label:'删除',width:8},
        ]"
    >
        <draggable v-if="form.detail.length>0" v-model="form.detail" tag="tbody" @update="draggable_change(form.detail)">
            <tr v-for="(item,index) in form.detail"
                :class="[clickData[index]?'active-color':'']"
                :key='item.amazon_element_relation_id'
                @click="add_class(index)">
                <td>{{item.amazon_element_relation_id}}[{{index+1}}]</td>
                <td class="drag-public drag-public-right">
                    <span v-if="index!==0" class="invoice invoice-up inline" @click="let_up(index)"></span>
                    <span v-if="index !==form.detail.length-1" class="invoice invoice-down inline" @click="let_down(index)"></span>
                    <el-popover
                            v-model="item.isTurn"
                            placement="top"
                            trigger="click">
                        <div style="width:200px;text-align: center;" >
                            <el-row>
                                <span>跳转到</span>
                                <input class="inline el-input__inner" style="width:60px" v-model="item.number" type="number" min="0" onkeyup="this.value=this.value.replace(/\D/g,'')"onafterpaste="this.value=this.value.replace(/\D/g,'')" >
                                <span>行</span>
                                <el-button size="mini" @click.native="turnClose(index)" type="primary" class="inline ml-xs">确定</el-button>
                            </el-row>
                        </div>
                        <span class="invoice invoice-turn inline" slot="reference"></span>
                    </el-popover>
                </td>
                <td>
                    {{item.element_name}}
                    <!--<ui-tip :content="" :width="98"></ui-tip>-->
                </td>
                <td>
                    <el-input v-model="item.name" @change="change_name"></el-input>
                </td>
                <td>
                    <el-checkbox v-model="item.required">是否必填</el-checkbox>
                    <el-checkbox  v-if="type===1&&(form.variant&&form.variant.length>0)" v-model="item.sku">是否为变体属性</el-checkbox>
                </td>
                <td>
                    <span class="operate" @click="delete_(index)">删除</span>
                </td>
            </tr>
        </draggable>
    </ui-table>
</template>
<style lang="stylus">

</style>
<script>

    export default {
        data() {
            return {
                clickData:[],
            }
        },
        mounted(){
            for(let i=0;i<this.form.detail.length;i++){
                this.clickData.push(false)
            }
        },
        methods:{
            change_name(val){
                console.log(val,'val');
            },
            delete_(index){
                this.form.detail.splice(index,1);
            },
            mounted_data(){
                for(let i=0;i<this.form.detail.length;i++){
                    this.clickData.push(false)
                }
            },
            add_class(index){
                this.clickData=this.clickData.map(()=>{
                    return  false
                });
                this.clickData[index]=true
            },
            draggable_change(list){
                console.log(list,'list');
            },
            let_up(index){
                let data = this.form.detail.splice(index-1,1);
                this.form.detail.splice(index,0,data[0]);
                this.$nextTick(()=>{
                    this.add_class(index-1);
                })
            },
            let_down(index){
                let data = this.form.detail.splice(index+1,1);
                this.form.detail.splice(index,0,data[0]);
                this.$nextTick(()=>{
                    this.add_class(index+1);
                })
            },
            turnClose(index){
                let i = this.form.detail[index].number;
                let maxNumber = this.form.detail.length;
                if(i<=0){
                    return this.$message({type: "warning", message: "请输入大于0的数字！"})
                }else if(i>maxNumber){
                    return this.$message({type: "warning", message: `请输入1-${maxNumber}范围内的数字！`})
                }else if(index ===i-1){
                    return this.$message({type: "warning", message: "已在当前行！"})
                }else{
                    this.form.detail[index].isTurn = false;
                    let data = this.form.detail.splice(index,1);
                    this.form.detail.splice(i-1,0,data[0]);
                    this.add_class(i-1);
                }
            },
        },
        props:{
            form:{
                required:true,
                type:Object
            },
            type:{
                required:true,
                type:Number
            }
        },
        components: {
            uiTable:require('../../../../components/ui-table.vue').default,
            uiTip:require('../../../../components/ui-tip.vue').default,
            draggable:require('../../../../components/drag-drop').default,
        }
    }
</script>