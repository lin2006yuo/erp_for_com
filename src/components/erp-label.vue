<template>
    <label :class="type">
        <gen-form :form-items="form"></gen-form>
    </label>
</template>
<style lang="stylus">
    .required{

    }
</style>
<script>

    import genForm from './gen-form';
    export default{
        data(){
            return{
                form:{
                    inputs:[
                        {
                            name:'name',
                            title:'名字',
                            type:'text',
                            required:true
                        },
                        {
                            name:'age',
                            title:'年齡',
                            type:'text',
                            default:100
                        },
                        {
                            name:'size',
                            title:'尺寸',
                            type:'text'
                        },
                        {
                            name:'submit',
                            title:'提交',
                            type:'submit'
                        },
                        {
                            name:'select1',
                            title:"select1",
                            type:'select',
                            options:[
                                {label:'o1',value:1},
                                {label:'o2',value:2},
                                {label:'o3',value:3},
                                {label:'o4',value:4},
                                {label:'o5',value:5},
                            ]
                        }
                    ],
                    model:{
                        name:11,
                        age:12,
                        select1:1,
                        size:100
                    }
                }
            }
        },
        props:{
            type:{
                default(){
                    return 'text';
                }
            }
        },
        components:{
            genForm
        }
    }
</script>