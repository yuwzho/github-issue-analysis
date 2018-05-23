var octokit = require('@octokit/rest')();

var  userCache = {}
 
class Github {

  auth(option) {
    octokit.authenticate(option);
  }

  searchDetail(name, owner, labels, callback) {
    var per_page = 100;
    var queryString = '';

    var getUser = this.getUser;

    for (var i = 0; i < labels.length; i++) {
      queryString = queryString + 'label:' + labels[i] + '+';
    }
    var arr = [];

    function _getIssues(page, callback) {
      octokit.search.issues({ q: queryString + 'user:' + owner + '+repo:' + name, sort: 'created', per_page: per_page, page: page }, callback);
    }

    function handleError(error) {
      console.error('Error when getting issues ' + error);
      callback(error);
    }

    function handleResult(items) {
      arr = arr.concat(items);
    }

    function _getUser(item, callback) {
      if (!item.user) {
        console.log(item)
      }
      getUser(item.user.login, function (info) {
        item.user = info;
        callback(item)
      })
    }

    function figureUsers(items, callback) {
      var promises = [];
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        promises.push(new Promise(function (resolve/*, reject*/) {
          _getUser(item, resolve)
        }))
      }

      Promise.all(promises).then(callback).catch(handleError);
    }

    _getIssues(1, function (error, results) {
      var totalCount = results.data.total_count;
      handleResult(results.data.items);
      var promises = [];
      for (var i = 2; i < totalCount / per_page + 1; i++) {
        promises.push(new Promise(function (resolve, reject) {
          _getIssues(i, function (error, result) {
            if (error) {
              reject(error);
            } else {
              resolve(result.data.items);
            }
          })
        }))
      }

      Promise.all(promises).then(function (values) {
        for (var i = 0; i < values.length; i++) {
          handleResult(values[i]);
        }

        figureUsers(arr, callback);
      }).catch(handleError);
    })
  }

  getUser(user, callback) {

    if (userCache[user]) {
      return userCache[user]
    }
    octokit.users.getForUser({ username: user }, function (error, result) {
      if (error) {
        console.error(error)
      }
      if (result) {
        userCache[user] = result.data;
        callback(result.data);
      }
    });
  }

  queryLabels(name, owner, callback) {
    var per_page = 100;
    var marker = 'per_page=' + per_page + '&page=';
    var arr = [];

    function _getLabels(page, callback) {
      octokit.issues.getLabels({ owner: owner, repo: name, per_page: per_page, page: page }, callback);
    }

    function handleError(error) {
      console.error('error when getting labels ' + error);
      callback([]);
    }

    function handleResult(data) {
      for (var i = 0; i < data.length; i++) {
        arr.push(data[i].name);
      }
    }

    _getLabels(1, function (error, result) {
      if (error) {
        handleError(error)
      } else {
        handleResult(result.data);

        var ref = result.meta.link;
        var index = ref.lastIndexOf(marker);
        var endIndex = ref.indexOf('>', index);
        var pageId = parseInt(ref.substring(index + marker.length, endIndex), 1);
        var promises = [];

        for (var i = 2; i <= pageId; i++) {
          promises.push(new Promise(function (resolve, reject) {
            _getLabels(i, function (error, result) {
              if (error) {
                reject(error);
              } else {
                resolve(result.data);
              }
            })
          }));
        }

        Promise.all(promises).then(function (values) {
          for (var i = 0; i < values.length; i++) {
            handleResult(values[i]);
          }
          callback(arr);
        }).catch(handleError);
      }
    })
  }
}

export default Github;