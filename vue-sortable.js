;(function () {

  var vSortable = {}
  var Sortable = typeof require === 'function'
      ? require('sortablejs')
      : window.Sortable

  if (!Sortable) {
    throw new Error('[vue-sortable] cannot locate Sortable.js.')
  }

  // exposed global options
  vSortable.config = {}

  vSortable.install = function (Vue) {
      Vue.directive('sortable', {
          bind: function(el, binding, vnode) {
              var data = binding.value;
              var options = {
                  onUpdate: function(evt) {
                      var sort = [];    //每个位置上存放的item的index
                      data.forEach(function(item, index) {
                          sort[item.select_sort-1] = index;
                      });
                      var operateItem = sort.splice(evt.oldIndex, 1);
                      sort.splice(evt.newIndex, 0, operateItem[0]);
                      for(var i=0,len=sort.length; i<len; i++) {
                          data[sort[i]].select_sort = i+1;
                      }
                  }
              };

              var sortable = new Sortable(el, options)

              if (this.arg && !this.vm.sortable) {
                  this.vm.sortable = {}
              }

              //  Throw an error if the given ID is not unique
              if (this.arg && this.vm.sortable[this.arg]) {
                  console.warn('[vue-sortable] cannot set already defined sortable id: \'' + this.arg + '\'')
              } else if( this.arg ) {
                  this.vm.sortable[this.arg] = sortable
              }
          }
      });

  }

  if (typeof exports == "object") {
    module.exports = vSortable
  } else if (typeof define == "function" && define.amd) {
    define([], function () {
      return vSortable
    })
  } else if (window.Vue) {
    window.vSortable = vSortable
    Vue.use(vSortable)
  }

})()
