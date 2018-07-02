;(function() {
  'use strict';

  function copy(obj) {
    return Object.assign({}, obj);
  }

  new Vue({
    el:'#main',
    data: {
      list: [],
      current: {}
    },
    methods: {
      merge: function() {
        // 先判断当前输入内容(current)有没有id。如有，则说明该任务已存在,就更新它；如果没有就创建它。
        var is_update = this.current.id;
        if (is_update) {
          // find方法迭代list数组
          var index = this.list.findIndex(function(item) {
            return item.id == is_update;
          });

          Vue.set(this.list, index, copy(this.current));
        } else {
          // 判断title值是否为空，如果为空，则return
          var title = this.current.title;
          if (!title && title != 0) return;

          // 把current对象拷贝赋值给todo，再push到list数组中
          var todo = copy(this.current);
          todo.id = this.next_id()
          this.list.push(todo);
        }
        this.reset_current();
      },
      remove: function(id) {
        // splice(index, howmany, items)
        // index     必需。整数，规定添加/删除项目的位置，使用负数可从数组结尾处规定位置。
        // howmany   必需。要删除的项目数量。如果设置为 0，则不会删除项目。
        // items     可选。向数组添加的新项目。
        this.list.splice(id, 1);
      },
      next_id: function() {
        return this.list.length + 1;
      },
      set_current: function(todo) {
        this.current = copy(todo);
      },
      reset_current: function() {
        this.set_current({});
      }
    }
  })
})();