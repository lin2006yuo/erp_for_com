export const get_path = function(path = '', size='_200x200.',baseUrl){
    let sizeList = ['_100x100.','_200x200.','_60x60.','_500x500.','_800x800.'];
    let isBlob = path.includes('blob:');
    if(isBlob) return path;//从本地添加的情况
    let bl = path.includes('http');
    let b2 = sizeList.find(row=>path.includes(row));
    if(bl&&b2) return path;
    let index = path.lastIndexOf('.');
    let arr = [...path];
    arr.splice(index,1, size);
    let str = arr.join('');
    bl&&!b2&&(path = str);//有http无size的情况
    return bl?path:baseUrl+str;
};

export const random_img = function (Array) {
    let arr1 = [];
    let arrOther =[];
    Array.forEach(item=>{
        if(item.is_default === 1){
            arr1.push(item)
        }else {
            arrOther.push(item);
        }
    });
    let n = Math.floor(Math.random()*arr1.length);
    let spliceArr = arr1.splice(n,1);
    let newArr = [...arr1.concat(arrOther)];
    newArr.sort(function(){
        return Math.random()-0.5;
    });
    return [...spliceArr, ...newArr];
};
