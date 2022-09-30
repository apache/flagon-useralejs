window.userale.filter(function (log) {
    var type_array = ['mouseup', 'mouseover', 'mousedown', 'keydown', 'dblclick', 'blur', 'focus', 'input', 'wheel'];
    var logType_array = ['interval'];
    return !type_array.includes(log.type) && !logType_array.includes(log.logType);
  });


  