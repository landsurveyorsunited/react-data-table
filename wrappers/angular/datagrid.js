'use strict';

/**
 * @ngdoc directive
 * @name datagrid.directive:datagrid
 * @description
 * # datagrid
 */
angular.module('datagrid', [])
  .directive('datagrid', function ($window) {
    return {
      template: '<div></div>',
      restrict: 'EA',
      scope: {
        data: '=',
        options: '='
      },
      link: function postLink(scope, element, attrs) {
        $window.React.render(React.createElement(ReactDataTable, {data: scope.data}), element[0]);
      }
    };
  });
