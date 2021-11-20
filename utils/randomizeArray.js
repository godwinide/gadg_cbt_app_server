const randomizeArray = arr => {
    let newArr =  [...arr];
    for(let i=0; i<newArr.lenth; i++){
        const randomPos = Math.floor(Math.random() * arr.length);
        [newArr[i], newArr[randomPos]] = [newArr[randomPos], newArr[i]];
    }
}

module.exports = randomizeArray;