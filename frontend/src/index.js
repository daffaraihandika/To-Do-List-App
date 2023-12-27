import React from 'react';
import ReactDOM from 'react-dom';
import 'assets/css/App.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import AuthLayout from 'layouts/auth';
import AdminLayout from 'layouts/dashboard';
import RtlLayout from 'layouts/rtl';
import { ChakraProvider } from '@chakra-ui/react';
import theme from 'theme/theme';
import { ThemeEditorProvider } from '@hypertheme-editor/chakra-ui';
import SignIn from 'views/auth/signIn';
import SignUp from 'views/auth/signup';
import axios from 'axios';

axios.defaults.withCredentials = true;

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <React.StrictMode>
      <ThemeEditorProvider>
        <Router>
          <Switch>
            <Route path="/auth" component={AuthLayout} />
            <Route path="/rtl" component={RtlLayout} />
            <Route path="/dashboard" component={AdminLayout} />
            <Route path="/signin" component={SignIn} />
            <Route path="/signup" component={SignUp} />
            <Redirect from='/' to='/signin' />
          </Switch>
        </Router>
      </ThemeEditorProvider>
    </React.StrictMode>
  </ChakraProvider>,
  document.getElementById('root')
);
