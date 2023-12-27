import React from 'react';
import { createRoot } from 'react-dom/client';
import 'assets/css/App.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import AuthLayout from 'layouts/auth';
import AdminLayout from 'layouts/admin';
import RtlLayout from 'layouts/rtl';
import { ChakraProvider } from '@chakra-ui/react';
import theme from 'theme/theme';
import { ThemeEditorProvider } from '@hypertheme-editor/chakra-ui';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import SignUp from 'views/auth/signup';
import SignIn from 'views/auth/signIn';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <ChakraProvider theme={theme}>
    <React.StrictMode>
      <ThemeEditorProvider>
        <Router>
          <Switch>
            <Route path={`/auth`} component={AuthLayout} />
            <Route path={`/rtl`} component={RtlLayout} />
            <Route path={`/signup`} component={SignUp} />
            <Route path={`/signin`} component={SignIn} />
            <Route path={`/admin`} component={AdminLayout} />
            <Redirect from='/' to='/admin/default' />
          </Switch>
        </Router>
      </ThemeEditorProvider>
    </React.StrictMode>
  </ChakraProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
