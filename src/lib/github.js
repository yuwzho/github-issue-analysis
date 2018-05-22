var octokit = require('@octokit/rest')();

class Github {
    queryLabels(name, owner, callback) {
        octokit.issues.getLabels({ owner: owner, repo: name, per_page: 100, page: 1 }, function (error, result) {
            if (error) {
                console.error('error when getting labels ' + error);
                callback([]);
            } else {
                var arr = [];
                for (var i = 0; i < result.data.length; i++) {
                    arr.push(result.data[i].name);
                }
                callback(arr);
            }
        })
    }
}

export default Github;