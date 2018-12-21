

export const getItem = (key, def = false) => {
    let val = localStorage.getItem(key);
    if(val) {
        return JSON.parse(val);
    }else{
        return def;
    }
};

export const setItem = (key, val) =>{
    localStorage.setItem(key, JSON.stringify(val));
};

export const delItem = (key) => {
    localStorage.removeItem(key);
};