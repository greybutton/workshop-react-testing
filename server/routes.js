import Router from 'koa-router';

export default (router) => {
  const defaultState = {
    key: 'value',
  };

  const state = { ...defaultState };

  const apiRouter = new Router();

  return router
    .get('root', '/', (ctx) => {
      ctx.render('index', { gon: state });
    })
    .use('/api/v1', apiRouter.routes(), apiRouter.allowedMethods());
};
