Array.prototype.MyReduce=function(fun,begin_value=0){
    let sum = begin_value;
    for (let i = 0; i < this.length; i++) {
        sum += fun(this[i],i,this);
    }
    return sum;
}

var m = new Map([[1, 'x'], [2, 'y'], [3, 'z']]);
m.forEach(function (value, key, map) {
    console.log(value,key);
});

// console.log([1,3,4].MyReduce((value,index,arr)=>{
//     console.log(arr[index])
//     return value*index;
// }))