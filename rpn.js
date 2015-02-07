function rpn(data){
  var i = 0;

  while(i < data.length){
    console.log('processing item ', i, ' of ', data);
    switch(data[i]){
      case '+':
        var newItem = data[i - 2] + data[i - 1];

        data.splice(i - 2, 3, newItem);
        console.log('reducing with addition to ', data);
        i -= 2;
        break;

      case '-':
        var newItem = data[i - 2] - data[i - 1];

        data.splice(i - 2, 3, newItem);
        console.log('reducing with addition to ', data);
        i -= 2;
        break;

      default:
        ++i;
    }



  }


}

var input = [1,2,3,'+', '-'] ;

console.log('rpn: ', rpn(input));
