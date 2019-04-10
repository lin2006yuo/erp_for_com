<template>
    <div >
        <div v-if="arrayObj.length">
            <label for="">{{arrayObj[0].name}}</label>
            <button @click="handleClickObj">change name</button>
        </div>
        <div v-if="array.length">
            <label for="">{{array[0]}}</label>
            <button @click="handleClick">change</button>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            arrayObj: '',
            array: ''
        }
    },
    mounted() {
        this.arrayObj = [{ name: 'lxy', age: 1 }, { name: 'xwq', age: 2 }]
        this.array = [1, 2, 3, 4]
    },
    methods: {
        handleClickObj() {
            this.arrayObj[0].name = 'lll'
        },
        handleClick() {
            this.array[0] = 4
        }
    }
}
</script>