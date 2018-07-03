;(function() {
  'use strict';

  var Event = new Vue();

  var alert_sound = document.getElementById('alert-sound');

  function copy(obj) {
    return Object.assign({}, obj);
  }

  Vue.component('task', {
    template: '#task-tpl',
    props: ['todo'],
    methods: {
      action: function (name, params) {
        Event.$emit(name, params);
      }
    }
  })

  new Vue({
    el:'#main',
    data: {
      list: [],
      last_id: 0,
      current: {}
    },

    // 挂载完成时，获取localStorage的值
    mounted: function () {
      var me = this;
      this.list = ms.get('list') || this.list;
      this.last_id = ms.get('last_id') || this.last_id;

      // 每隔1秒执行一次 check_alerts
      setInterval(function () {
        // 检查当前是否有要提醒的任务
        me.check_alerts();
      }, 1000);

      Event.$on('toggle_complete', function (id) {
        if (id) {
          me.toggle_complete(id);
        }
      });
      Event.$on('toggle_detail', function (id) {
        if (id) {
          me.toggle_detail(id);
        }
      });
      Event.$on('set_current', function (id) {
        if (id) {
          me.set_current(id);
        }
      });
      Event.$on('remove', function (id) {
        if (id) {
          me.remove(id);
        }
      });

    },

    methods: {
      check_alerts: function () {
        var me = this;
        this.list.forEach(function (row, i) {
          var alert_at = row.alert_at;
          if (!alert_at || row.alert_confirmed) return;

          // 把 alert_at 变成Date对象
          // getTime() 获取时间戳（从1970年1月1日至指定的时间一共过去了多少毫秒）
          var alert_at = (new Date(alert_at)).getTime();
          var now = (new Date()).getTime();

          if (now >= alert_at) {
            alert_sound.play();
            // 0.01秒之后再执行弹出提醒
            setTimeout(function() {
              var confirmed = confirm(row.title);
              Vue.set(me.list[i], 'alert_confirmed', confirmed);
            },10);

            // var confirmed = confirm(row.title);
            // Vue.set(me.list[i], 'alert_confirmed', confirmed);
          }
        })
      },
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
          this.last_id++;
          ms.set('last_id', this.last_id);
          todo.id = this.last_id;
          this.list.push(todo);
        }
        this.reset_current();
      },

      toggle_detail: function (id) {
        var index = this.find_index(id);
        this.list[index].show_detail;
        Vue.set(this.list[index], 'show_detail', !this.list[index].show_detail);
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

        // 如果任务已完成，则不显示任务描述
        if (this.list[i].completed && this.list[i].show_detail) {
          this.toggle_detail(id);
        }
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