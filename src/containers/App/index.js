// @flow
import React from 'react';

import withAuthorization from '../../enhancers/withAuthorization';

type AppPropsType = {|
  children: React$Node
|};

const App = (props: AppPropsType) => <div className="App">{props.children}</div>;

export default withAuthorization(App);
