/*global config*/
import React from 'react';
import { render } from 'react-dom';
import { createHistory } from 'history';
import { Router, useRouterHistory } from 'react-router';
import routes from './routes';
import { getUsernameFromCookie } from './components/Helpers.js';

if (!config.apiRoot) {
  console.warn('You need to set your apiRoot via localStorage');
  console.warn('e.g. localStorage["apiRootOverride"] = "https://path.to-api.com/v1/api"');
}

const browserHistory = useRouterHistory(createHistory) ({
  basename: config.appRoot
});

render(
  <Router history={browserHistory}>
    {routes}
  </Router>,
  document.getElementById('app')
);
