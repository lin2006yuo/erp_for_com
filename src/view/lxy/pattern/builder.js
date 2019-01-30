
//书籍建造者类
export class BookBuilder {
    constructor() {
        this.name = '';
        this.author = '';
        this.price = 0;
        this.category = '';

        Object.keys(this).forEach(key => {
            const withName = `with${key.substring(0, 1).toUpperCase()}${key.substring(1)}`;
            this[withName] = value => {
                this[key] = value;
                return this;
            }
        })
    }

    //调用建造者
    build() {
        const keysNoWithers = Object.keys(this).filter(key => typeof this[key] !== 'function');
        return keysNoWithers.reduce((returnValue, key) => {
            return {
                ...returnValue,
                [key]: this[key]
            }
        }, {})
    }
}

