<template>
    
</template>

<script>
    export default {
        name: "pattern"
    }
    import {BookBuilder} from './builder'


    //调用建造者类
    const book = new BookBuilder()
        .withName("高效能人士的七个习惯")
        .withAuthor('史蒂芬·柯维')
        .withPrice(51)
        .withCategory('励志').build()


</script>

<style scoped>

</style>
