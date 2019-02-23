import cookies from 'js-cookie';

const cookie = {
  set: (field, value) => cookies.set(field, value),
  get: field => cookies.get(field),
};

export default cookie;
