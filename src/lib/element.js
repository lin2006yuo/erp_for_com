function keepAddClas(className){
    if(this.classList){
        this.classList.add(className);
    }else{
        this.setAttribute('class', className);
    }
}

HTMLElement.prototype.loadClose = function(){
    if(this.lastElementChild){
        if(this.lastElementChild.classList.contains('req-loading')){
            this.style.position = this.__oldPosition;
            this.removeChild(this.lastElementChild)
        }
    }
};

HTMLElement.prototype.loadOpen = function(){
    this.loadClose();
    this.__oldPosition = this.style.position;
    this.style.position = 'relative';
    let div = document.createElement('div');
    div.classList.add('req-loading');
    this.appendChild(div);
};

HTMLElement.prototype.addClass = function(classes){
    switch (classes.constructor.name){
        case 'Array':
            classes.forEach(className =>{
                keepAddClas.call(this, className);
                for(const item of this.classList){
                    // console.log(item);
                }
            });
            break;
        case 'Object':
            for(const className in classes){
                if(classes.hasOwnProperty(className)){
                    if(classes[className]){
                        keepAddClas.call(this, className);
                    }
                }
            }
            break;
        case 'String':
            classes = classes.split(' ');
            this.addClass(classes);
            break;
        default:
            console.log(`addClass fail ${classes.constructor.name}`);
    }
};

HTMLElement.prototype.remClass = function(classes){
    // console.log(`remClass:${JSON.stringify(classes)}`);
    switch (classes.constructor.name){
        case 'Array':
            classes.forEach(className =>{
                className = className.trim();
                this.classList.remove(className);
            });
            break;
        case 'Object':
            for(const className in classes){
                if(classes.hasOwnProperty(className)){
                    if(classes[className]){
                        this.classList.remove(className);
                    }
                }
            }
            break;
        case 'String':
            classes = classes.split(' ');
            this.remClass(classes);
            break;
        default:
            console.log(`addClass fail ${classes.constructor.name}`);
    }
};
HTMLElement.prototype.toggleClass=function (classes) {
    switch (classes.constructor.name){
        case 'Array':
            classes.forEach(className =>{
                className = className.trim();
                this.classList.toggle(className);
            });
            break;
        case 'Object':
            for(const className in classes){
                if(classes.hasOwnProperty(className)){
                    if(classes[className]){
                        this.classList.toggle(className);
                    }
                }
            }
            break;
        case 'String':
            classes = classes.split(' ');
            this.toggleClass(classes);
            break;
        default:
            console.log(`toggleClass fail ${classes.constructor.name}`);
    }

};
HTMLElement.prototype.hasClass=function (name) {
        if(this.classList){
            let flag=false;
            [...this.classList].forEach(row=>{
                    if(row===name){
                        flag=true;
                    }
            });
            return flag
        }else {
            return false
        }
}