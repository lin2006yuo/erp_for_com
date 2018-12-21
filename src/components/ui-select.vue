<script>
    import Vue from "vue"
    export  default{
        name:'ui-select',
        extends:Vue.component('ElSelect'),
        methods:{
            getOption(value) {
                let option;
                for (let i = this.cachedOptions.length - 1; i >= 0; i--) {
                    const cachedOption = this.cachedOptions[i];
                    if (cachedOption.value === value) {
                        option = cachedOption;
                        break;
                    }
                }
                if (option) return option;
                const label = typeof value === 'string' || typeof value === 'number'
                    ? value : '';
                let newOption = {
                    value: value,
                    currentLabel: label
                };
                if (this.multiple) {
                    newOption.hitState = false;
                }
                return newOption;
            },
        }
    }
</script>