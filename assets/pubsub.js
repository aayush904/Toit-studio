let subscribers = {};

function subscribe(eventName, callback) {
  if (subscribers[eventName] === undefined) {
    subscribers[eventName] = [];
  }

  subscribers[eventName] = [...subscribers[eventName], callback];

  return function unsubscribe() {
    subscribers[eventName] = subscribers[eventName].filter((cb) => {
      return cb !== callback;
    });
  };
}

function publish(eventName, data) {
  if (subscribers[eventName]) {
    const promises = subscribers[eventName]
      .map((callback) => callback(data))
    return Promise.all(promises);
  } else {
    return Promise.resolve()
  }
}

function testConsole() {
  if (typeof console === 'undefined') {
    return false;
  }
  return ['log', 'warn', 'error'].some((method) => {
    return typeof console[method] === 'function';
  });
}