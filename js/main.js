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
      remove: function(id) {
        // splice(index, howmany, items)
        // index     必需。整数，规定添加/删除项目的位置，使用负数可从数组结尾处规定位置。
        // howmany   必需。要删除的项目数量。如果设置为 0，则不会删除项目。
        // items     可选。向数组添加的新项目。
        this.list.splice(id, 1);
      }
    }
  })
})();