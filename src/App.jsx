import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Main from './components/Main';
import cookie from './cookies';

export default (gon) => {
  ReactDOM.render(
    <Main gon={gon} cookie={cookie} />,
    document.getElementById('root'),
  );
};
