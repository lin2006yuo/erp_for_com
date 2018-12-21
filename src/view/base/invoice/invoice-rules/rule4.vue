<template>
    <div>
        <span v-if="form.condition"
              v-for="item in form.condition">{{item}}</span>
       <!-- <textarea-format v-if="!url" v-model="format"></textarea-format>-->
        <!--<uimui-select :request="url" v-model="format"></uimui-select>-->
        <selects :request="url"   v-model="format" ></selects>
        <span v-if="form.unit">{{form.unit}}</span>
        <p class="rule-desc" v-if="form.desc">{{form.desc}}</p>
    </div>
</template>
<style lang="stylus">

</style>
<script>

    export default{
        data(){
            return{
//                format:this.value,
                format:this.value||[],
                options:[],
                loading:false,
                multiple:true
            }
        },
        methods:{
            item_label(item){
                return Object.values(item)[0];
            },
            item_value(item){
                return Object.keys(item)[0];
            },
        },
        computed:{
            condition(){
                if(typeof this.form.condition === 'array'){
                    return this.form.condition;
                }else{
                    return objToArray(this.form.condition, (val,key) =>{
                        let obj = {};
                        obj[key] = val;
                        return obj;
                    });
                }
            },
            url(){
                if(this.form.url !== ''){
                    return this.form.url;
                }else{
                    return false;
                }
            },
        },
        watch:{
            value(val){
                if(val instanceof Array){
                    this.format = val;
                }else {
                    this.format=val.split(",")
                }



            },
            format(val){
                this.$emit('input', val);
            }
        },
        props:{
            form:{},
            value:{},
            operator:{},
        },
        components:{
            selects:require('../../parcel-declare/selects.vue').default,
            textareaFormat:require('../../../../components/textarea-format.vue').default,
            uimuiSelect:require('../../../../components/uimui-select.vue').default,
        }
    }
</script>