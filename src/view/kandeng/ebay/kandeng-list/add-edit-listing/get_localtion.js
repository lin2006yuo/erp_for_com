export const get_local = function(locationList){
    let cur = [];
    let checkList = ["Alaska/Hawaii","US Protectorates","APO/FPO","Africa",
        "Asia","Europe","Central America and Caribbean",
        "North America","Oceania",'Southeast Asia','South America','Middle East','PO Box'];
    checkList.forEach(row=>{
        // let curList = this.locationList.filter(res=>res.Region===row).map(res=>res.Location);
        let curList = locationList.filter(res=>res.Region===row).map(res=>res.Location);
        if(curList.length>0){
            cur = [...cur,...curList]
        }else{
            cur.push(row);
        }
    });
    return cur;
}