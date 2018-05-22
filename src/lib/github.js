var octokit = require('@octokit/rest')();

class Github {
    queryLabels(name, owner, callback) {
        var per_page = 100;
        var marker = 'per_page='+ per_page+'&page=';
        var arr = [];

        function _getLabels(name, owner, per_page, page, callback) {
            octokit.issues.getLabels({ owner: owner, repo: name, per_page: per_page, page: page }, callback);
        }

        function handleError (error) {
            console.error('error when getting labels ' + error);
            callback([]);
        }

        function handleResult(data) {
            for (var i = 0; i < data.length; i++) {
                arr.push(data[i].name);
            }
        }

        _getLabels(name, owner, per_page, 1, function (error, result) {
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
                    promises.push(new Promise(function(resolve, reject) {
                        _getLabels(name, owner, per_page, i, function (error, result) {
                            if (error) {
                                reject(error);
                            }else {
                                resolve(result.data);
                            }
                        })
                    }));
                }

                Promise.all(promises).then(function (values) {
                    for(var i = 0; i < values.length; i++) {
                        handleResult(values[i]);
                    }
                    callback(arr);
                }).catch(handleError);
            }
        })
    }
}

export default Github;