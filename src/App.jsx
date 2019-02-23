import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Main from './components/Main';

export default (gon) => {
  ReactDOM.render(
    <Main gon={gon} />,
    document.getElementById('root'),
  );
};
