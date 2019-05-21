<template>
    <div class="order_list">
        <ul>
            <li v-for="order in orders">
                <span>{{order.id}}</span>
                <span>{{order.name}}</span>
                <span>{{order.status}}</span>
            </li>
        </ul>
    </div>
</template>
<style lang="stylus">

</style>
<script>

    import order_status from '../define/order_status';
    export default{
        data(){
            return {
                orders:[
                    {id:1,name:'111',status:order_status.status1},
                    {id:1,name:'111',status:order_status.status1},
                    {id:1,name:'111',status:order_status.status1},
                    {id:1,name:'111',status:order_status.status1},
                ]
            }
        },
        components: {}
    }
</script>
