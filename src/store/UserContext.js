import React, { createContext, PureComponent } from 'react';

const UserContext = createContext();
const { Provider, Consumer } = UserContext;

class UserProvider extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      rejectedRoutes: []
    };
  }

  handleLogin = async user => {
    this.setState({ currentUser: user });
  };

  handleLogout = async () => {
    this.setState({
      currentUser: null,
      rejectedRoutes: []
    });
  };

  handleUpdate = async user => {
    this.setState({ currentUser: user });
  };

  rejectRoute = route => {
    const { rejectedRoutes } = this.state;
    this.setState({
      rejectedRoutes: [...rejectedRoutes, route]
    });
  };

  getLastRejectedUrl = (success, error) => {
    if (this.state.rejectedRoutes.length > 0) {
      const route = [...this.state.rejectedRoutes].pop();
      success(route);
    } else {
      error();
    }
  };

  render() {
    return (
      <Provider
        value={{
          user: this.state.currentUser,
          onLogin: this.handleLogin,
          onLogout: this.handleLogout,
          onUpdate: this.handleUpdate,
          rejectedRoutes: this.state.rejectedRoutes,
          rejectRoute: this.rejectRoute,
          getLastRejectedUrl: this.getLastRejectedUrl
        }}>
        {this.props.children}
      </Provider>
    );
  }
}

function withUserContext(ComposedComponent) {
  return function WithUserContext(props) {
    return <Consumer>{contextValues => <ComposedComponent {...props} {...contextValues} />}</Consumer>;
  };
}

export { UserProvider, Consumer as UserConsumer, UserContext, withUserContext };
