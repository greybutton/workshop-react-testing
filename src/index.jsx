import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

export default (gon) => {
  ReactDOM.render(
    <App gon={gon} />,
    document.getElementById('root'),
  );
};
