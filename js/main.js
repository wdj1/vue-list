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

    // 挂载完成时，获取localStorage的值
    mounted: function () {
      this.list = ms.get('list') || this.list;
    },

    methods: {
      merge: function() {
        // 先判断当前输入内容(current)有没有id。如有，则说明该任务已存在,就更新它；如果没有就创建它。
        var is_update, id;
        is_update = id =  this.current.id;
        if (is_update) {
          // find方法迭代list数组
          var index = this.find_index(id);
          /*
          var index = this.list.findIndex(function (item) {
            return item.id == is_update;
          });
          */

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

      remove: function (id) {
        var index = this.find_index(id);
        // splice(index, howmany, items)
        // index     必需。整数，规定添加/删除项目的位置，使用负数可从数组结尾处规定位置。
        // howmany   必需。要删除的项目数量。如果设置为 0，则不会删除项目。
        // items     可选。向数组添加的新项目。
        this.list.splice(index, 1);
      },
      next_id: function () {
        return this.list.length + 1;
      },
      set_current: function (todo) {
        this.current = copy(todo);
      },
      reset_current: function () {
        this.set_current({});
      },
      find_index: function (id) {
        return this.list.findIndex(function(item) {
          return item.id == id;
        })
      },
      toggle_complete: function (id) {
        var i = this.find_index(id);
        Vue.set(this.list[i], 'completed', !this.list[i].completed);
        // this.list[i].completed = !this.list[i].completed;
      }
    },

    // 当list数组有数据变动时，存储到localStorage
    watch: {
      list: {
        deep: true,
        handler: function (n, o) {
          if (n) {
            ms.set('list', n);
          } else {
            ms.set('list', []);
          }
        }
      }
    }

  });

})();