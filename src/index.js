/* global BUGSNAG_API_KEY */
/* global DEPLOYMENT_ENV */
import React from 'react';
import ReactDOM from 'react-dom';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';

import Root from './containers/Root';

const deploymentEnv = DEPLOYMENT_ENV || 'local';
Bugsnag.start({
  apiKey: BUGSNAG_API_KEY,
  plugins: [new BugsnagPluginReact()],
  enabledReleaseStages: ['production', 'staging', 'dev', 'pr_app'],
  releaseStage: deploymentEnv
});

const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React);

ReactDOM.render(
  <ErrorBoundary>
    <Root />
  </ErrorBoundary>,
  document.getElementById('root')
);
