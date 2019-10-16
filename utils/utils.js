exports.log = (msg, ...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.info('');
    console.info(msg, args.join(', '));
    args.forEach(item => console.info(item));
    console.info('***************************************');
  }
};
