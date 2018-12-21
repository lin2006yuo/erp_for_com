<template>
    <div class="c-move-title">
        <table class="template">
            <tr>
                <th width="30px">前</th>
                <td width="100px">
                    <input style="border:none;outline:none;font-size:1.1rem"
                           @keyup.enter="add_word(newFront,'front')"
                           v-model="newFront"
                           placeholder="请输入,按Enter添加"/>
                </td>
                <td class="t-left">
                    <draggable-tag v-model="sourceData.frontList"
                                    :styleProp="styleProp"
                                   :options="{group:'listOne'}"></draggable-tag>
                </td>
            </tr>
            <tr>
                <th width="30px">中</th>
                <td width="100px">
                    <input style="border:none;outline:none;font-size:1.1rem"
                           @keyup.enter="add_word(newMiddle,'middle')"
                           v-model="newMiddle"
                           placeholder="请输入,按Enter添加"/>
                </td>
                <td class="t-left">
                    <draggable-tag v-model="sourceData.middleList"
                                   :styleProp="styleProp"
                                   :options="{group:'listOne'}"></draggable-tag>
                </td>
            </tr>
            <tr>
                <th width="30px">后</th>
                <td width="100px">
                    <input style="border:none;outline:none;font-size:1.1rem"
                           @keyup.enter="add_word(newBack,'back')"
                           v-model="newBack"
                           placeholder="请输入,按Enter添加"/>
                </td>
                <td class="t-left">
                    <draggable-tag v-model="sourceData.backList"
                                   :styleProp="styleProp"
                                   :options="{group:'listOne'}"></draggable-tag>
                </td>
            </tr>
        </table>
    </div>
</template>
<style lang="stylus">

</style>
<script>

    export default{
        data(){
            return{
                newMiddle:'',
                newFront:'',
                newBack:'',
                frontList:[
                    {name:'ceshi',id:1}
                ],
                middleList:[
                    {name:'中',id:1}
                ],
                backList:[],
            }
        },
        methods:{
            to_upper_case(x){
                x = x.toString();
                return x.substr(0,1).toUpperCase()+x.substr(1)
            },
            add_word(val,name){
                let value = val.split(' ').filter(row=>!!row).map(row=>{
                    return {
                        time:0,
                        name:this.to_upper_case(row.trim()),
                        isSign:false,
                    }
                });
                switch(name){
                    case 'front':
                        this.sourceData.frontList = [...this.sourceData.frontList,...value];
                        this.newFront = '';
                        break;
                    case 'middle':
                        this.sourceData.middleList = [...this.sourceData.middleList,...value];
                        this.newMiddle = '';
                        break;
                    case 'back':
                        this.sourceData.backList = [...this.sourceData.backList,...value];
                        this.newBack = '';
                        break;
                }
            },
        },
        props:{
            sourceData:{},
            styleProp:{
                default(){
                    return {
                        minHeight:'26px',
                        width:'100%',
                    }
                }

            }
        },
        components:{
            draggableTag:require('./draggable-tag.vue').default,
        }
    }
</script>