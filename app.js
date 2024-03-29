﻿(function () {
    'use strict';

    angular
        .module('app')
        .config(config)
        .run(run);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
              abstract: true,
              templateUrl: 'home/home.view.html',
              controller: 'HomeController',
              controllerAs: 'vm',
              resolve:{
                currentUser: ['UserService', '$rootScope', function(UserService, $rootScope){
                  return UserService.GetByUsername($rootScope.globals.currentUser.username);
                }],
                isUserAdmin: function(){
                  return function(username){
                    return username === "admin@admin";
                  }
                }
              }
            })
            .state('app.home', {
              url: '/',
              templateUrl: 'home/home/home-info.view.html'
            })
            .state('app.admin', {
              url: '/admin',
              templateUrl: 'home/admin/all-users.view.html',
              controller: 'AllUsersController',
              controllerAs: 'vm',
              resolve:{
                allUsers: ['UserService', function(UserService){
                  return UserService.GetAll();
                }]
              }
            })
            .state('app.all-posts',{
              abstract: true,
              url: '/all-posts',
              templateUrl: 'home/all-posts/all-posts.view.html',
              controller: 'AllPostsController',
              controllerAs: 'vm'
            })
            .state('app.all-posts.list-all-posts', {
              url:'/list-all-posts',
              templateUrl: 'home/all-posts/list-all-posts.view.html'
            })
            .state('app.all-posts.view-post', {
              url:'/view-post',
              templateUrl: 'home/all-posts/view-post.view.html'
            })

            .state('app.my-post', {
                abstract: true,
                templateUrl: 'home/my-post/my-post.view.html',
                url:'/my-post',
                controller: 'MyPostController',
                controllerAs: 'vm',
            })
            .state('app.my-post.create-post', {
              url: '/create-post',
              templateUrl: 'home/my-post/create-post.view.html',
            })
            .state('app.my-post.update-post', {
              url: '/update-post',
              templateUrl: 'home/my-post/update-post.view.html',
            })
            .state('app.my-post.list-posts', {
              url: '/list-posts',
              templateUrl: 'home/my-post/list-posts.view.html'
            })


            .state('login', {
                url: '/login',
                controller: 'LoginController',
                templateUrl: 'login/login.view.html',
                controllerAs: 'vm'
            })

            .state('register', {
                url: '/register',
                controller: 'RegisterController',
                templateUrl: 'register/register.view.html',
                controllerAs: 'vm'
            });

            $urlRouterProvider.otherwise('/login');
    }

    run.$inject = ['$rootScope', '$location', '$cookies', '$http'];
    function run($rootScope, $location, $cookies, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookies.getObject('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });
    }

})();
