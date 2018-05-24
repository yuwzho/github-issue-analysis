function paging(call, getTotalNumber, filter, callback) {
  function createPromise(i) {
    return new Promise(function (resolve, reject) {
      call(i, function (error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result.data);
        }
      })
    });
  }

  var data = [];
  call(1, function (error, result) {
    if (error) {
      callback([], error);
      return;
    }

    data = filter ? filter(result.data) : result.data;
    var promises = [];
    var totalPage = getTotalNumber(result);
    for (var i = 2; i <= totalPage; i++) {
      promises.push(createPromise(i));
    }

    if (promises.length === 0) {
        callback(data);
        return;
    }

    Promise.all(promises).then(function (values) {
      for (var i = 0; i < values.length; i++) {
        var value = filter ? filter(values[i]) : values[i];
        data = data.concat(value);
      }
      callback(data);
    }).catch(function (error) {
      callback([], error);
    });
  })
}

export { paging }