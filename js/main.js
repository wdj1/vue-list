;(function() {
  'use strict';

  new Vue({
    el:'#main',
    data: {
      list: [],
      current: {}
    },
    methods: {
      add: function() {
        // 判断title值是否为空，如果为空，则return
        var title = this.current.title;
        if(!title && title != 0) return;

        // 把current对象拷贝赋值给todo，再push到list数组中
        var todo = Object.assign({}, this.current);
        this.list.push(todo);
      },
      update: function() {

      },
      remove: function() {

      }
    }
  })
})();