import { paging } from './util';

var octokit = require('@octokit/rest')();

var userCache = {}

class Github {

  auth(option, callback) {
    try {
      octokit.authenticate(option);
    }
    catch (err) {
      callback(err.message)
    }
  }

  searchDetail(options, callback) {
    var per_page = 100;
    var name = options.name;
    var owner = options.owner;
    var queryString = options.queryString;

    function _getIssues(page, callback) {
      octokit.search.issues({ q: queryString + '+repo:' + owner + '/' + name, sort: 'created', per_page: per_page, page: page }, callback);
    }

    function _getTotalNumber(result) {
      var count = result.data.total_count;
      return Math.ceil(count / per_page);
    }

    function _filter(values) {
      return values.items;
    }

    paging(_getIssues, _getTotalNumber, _filter, function(values, error) {
      var count = values.length;
      values.forEach(item => {
        Github.getUser(item.user.login, function(info) {
          item.user = info;
          count--;
          if (count === 0) {
            console.log(values)
            callback(values, error);
          }
        })
      });
    })
  }

  static getUser(user, callback) {
    if (userCache[user] === 'waiting') {
      setTimeout(() => {
        Github.getUser(user, callback);
      }, 2000);
      return;
    } else if (userCache[user]){
      callback(userCache[user])
      return;
    }

    userCache[user] = 'waiting';
    octokit.users.getForUser({ username: user }, function (error, result) {
      if (error) {
        console.error(error)
        callback(null, error)
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
    function _getLabels(page, callback) {
      octokit.issues.getLabels({ owner: owner, repo: name, per_page: per_page, page: page }, callback);
    }

    function _getTotalNumber(response) {
      var pageId = 1;
      var ref = response.meta.link;
      if (ref) {
        var index = ref.lastIndexOf(marker);
        var endIndex = ref.indexOf('>', index);
        pageId = parseInt(ref.substring(index + marker.length, endIndex));
      }
      return pageId;
    }

    paging(_getLabels, _getTotalNumber, null, function (values, error) {
      var results = [];
      for (var i = 0; i < values.length; i++) {
        results.push(values[i].name);
      }
      callback(results, error);
    });
  }
}

export default Github;
