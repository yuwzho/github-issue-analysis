import uuid from 'uuid';
import ga from 'react-ga';

const pkg = require('../../package.json');
const googleAnalticsKey = 'UA-119750904-1';

const userProperties = {
  project: getAppName(),
  userId: getUserId(),
  version: getAppVersion()
};

ga.initialize(googleAnalticsKey);

function tracePageView() {
  ga.set(userProperties);
  ga.ga('send', 'pageview');
}

function getAppName() {
  return pkg.name;
}

function getAppVersion() {
  return pkg.version;
}

function getUserId() {
  var id = localStorage.getItem('userId');
  if (!id) {
    id = uuid.v1().toString();
    localStorage.setItem('userId', id);
  }
  return id;
}

export {
  tracePageView
}