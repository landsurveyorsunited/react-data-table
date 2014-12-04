'use strict';

/**
 * @ngdoc controller
 * @name datagrid.controller:home
 * @description
 * # home
 */
angular.module('datagrid')
  .controller('home', function ($scope, $window) {
    $scope.data = $window.data;
  });
