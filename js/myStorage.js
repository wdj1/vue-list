/* myStorage.js */
;(function () {
  window.ms = {
    set: set,
    get: get,
  };

  function set(key, val) {
    // 用JSON把数组和对象转换成字符串
    localStorage.setItem(key, JSON.stringify(val));
  }

  function get(key) {
    var json = localStorage.getItem(key);
    if (json) {
      return JSON.parse(json);
    }
  }
})();


// ms.set('name',  '王花花');
// var name = ms.get('name');
// console.log('name:', name);