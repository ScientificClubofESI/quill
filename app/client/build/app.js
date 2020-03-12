var app = angular.module('reg', [
  'ui.router',
  'chart.js',
]);

app
  .config([
    '$httpProvider',
    function($httpProvider){

      // Add auth token to Authorization header
      $httpProvider.interceptors.push('AuthInterceptor');

    }])
  .run([
    'AuthService',
    'Session',
    function(AuthService, Session){

      // Startup, login if there's  a token.
      var token = Session.getToken();
      if (token){
        AuthService.loginWithToken(token);
      }

  }]);

angular.module('reg')
    .constant('EVENT_INFO', {
        NAME: 'Hackit 2020',
    })
    .constant('DASHBOARD', {
        UNVERIFIED: 'You should have received an email asking you verify your email. Click the link in the email and you can start your application!',
        INCOMPLETE_TITLE: 'You still need to complete your application!',
        INCOMPLETE: 'If you do not complete your application before the [APP_DEADLINE], you will not be considered for the admissions lottery!',
        SUBMITTED_TITLE: 'Your application has been submitted!',
        SUBMITTED: 'Feel free to edit it at any time. However, once registration is closed, you will not be able to edit it any further.\nAdmissions will be determined by a random lottery. Please make sure your information is accurate before registration is closed!',
        CLOSED_AND_INCOMPLETE_TITLE: 'Unfortunately, registration has closed, and the lottery process has begun.',
        CLOSED_AND_INCOMPLETE: 'Because you have not completed your profile in time, you will not be eligible for the lottery process.',
        ADMITTED_AND_CAN_CONFIRM_TITLE: 'You must confirm by [CONFIRM_DEADLINE].',
        ADMITTED_AND_CANNOT_CONFIRM_TITLE: 'Your confirmation deadline of [CONFIRM_DEADLINE] has passed.',
        ADMITTED_AND_CANNOT_CONFIRM: 'Although you were accepted, you did not complete your confirmation in time.\nUnfortunately, this means that you will not be able to attend the event, as we must begin to accept other applicants on the waitlist.\nWe hope to see you again next year!',
        CONFIRMED_NOT_PAST_TITLE: 'You can edit your confirmation information until [CONFIRM_DEADLINE]',
        DECLINED: 'We\'re sorry to hear that you won\'t be able to make it to Hackit 2020! :(\nMaybe next year! We hope you see you again soon.',
    })
    .constant('TEAM',{
        NO_TEAM_REG_CLOSED: 'Unfortunately, it\'s too late to enter the lottery with a team.\nHowever, you can still form teams on your own before or during the event!',
    });


angular.module('reg')
  .config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    function(
      $stateProvider,
      $urlRouterProvider,
      $locationProvider) {

    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/404");
    
    // Set up de states
    $stateProvider
      .state('login', {
        url: "/login",
        templateUrl: "views/login/login.html",
        controller: 'LoginCtrl',
        data: {
          requireLogin: false,
          requireLogout: true
        },
        resolve: {
          'settings': ["SettingsService", function(SettingsService){
            return SettingsService.getPublicSettings();
          }]
        }
      })
      .state('home', {
        url: "/",
        templateUrl: "views/login/login.html",
        controller: 'LoginCtrl',
        data: {
          requireLogin: false,
          requireLogout: true
        },
        resolve: {
          'settings': ["SettingsService", function(SettingsService){
            return SettingsService.getPublicSettings();
          }]
        }
      })

      // .state('home', {
      //   url: "/",
      //   templateUrl: "views/home/home.html",
      //   controller: 'HomeCtrl',
      //   data: {
      //     requireLogin: false
      //   },
      //   resolve: {
      //     'settings': function(SettingsService){
      //       return SettingsService.getPublicSettings();
      //     }
      //   }
      // })

      .state('app', {
        views: {
          '': {
            templateUrl: "views/base.html",
            controller: "BaseCtrl",
          },
          'sidebar@app': {
            templateUrl: "views/sidebar/sidebar.html",
            controller: 'SidebarCtrl',
            resolve: {
              settings: ["SettingsService", function(SettingsService) {
                return SettingsService.getPublicSettings();
              }]
            }
          }
        },
        data: {
          requireLogin: true
        }
      })
      .state('app.dashboard', {
        url: "/dashboard",
        templateUrl: "views/dashboard/dashboard.html",
        controller: 'DashboardCtrl',
        resolve: {
          currentUser: ["UserService", function(UserService){
            return UserService.getCurrentUser();
          }],
          settings: ["SettingsService", function(SettingsService){
            return SettingsService.getPublicSettings();
          }]
        },
      })
      .state('app.application', {
        url: "/application",
        templateUrl: "views/application/application.html",
        controller: 'ApplicationCtrl',
        data: {
          requireVerified: true
        },
        resolve: {
          currentUser: ["UserService", function(UserService){
            return UserService.getCurrentUser();
          }],
          settings: ["SettingsService", function(SettingsService){
            return SettingsService.getPublicSettings();
          }]
        }
      })
      .state('app.confirmation', {
        url: "/confirmation",
        templateUrl: "views/confirmation/confirmation.html",
        controller: 'ConfirmationCtrl',
        data: {
          requireAdmitted: true
        },
        resolve: {
          currentUser: ["UserService", function(UserService){
            return UserService.getCurrentUser();
          }]
        }
      })
      .state('app.challenges', {
        url: "/challenges",
        templateUrl: "views/challenges/challenges.html",
        controller: 'ChallengesCtrl',
        data: {
          requireVerified: true
        },
        resolve: {
          currentUser: ["UserService", function(UserService){
            return UserService.getCurrentUser();
          }],
          settings: ["SettingsService", function(SettingsService){
            return SettingsService.getPublicSettings();
          }]
        }
      })
      .state('app.team', {
        url: "/team",
        templateUrl: "views/team/team.html",
        controller: 'TeamCtrl',
        data: {
          requireVerified: true
        },
        resolve: {
          currentUser: ["UserService", function(UserService){
            return UserService.getCurrentUser();
          }],
          settings: ["SettingsService", function(SettingsService){
            return SettingsService.getPublicSettings();
          }]
        }
      })
      .state('app.admin', {
        views: {
          '': {
            templateUrl: "views/admin/admin.html",
            controller: 'adminCtrl'
          }
        },
        data: {
          requireAdmin: true
        }
      })
      .state('app.checkin', {
        url: '/checkin',
        templateUrl: 'views/checkin/checkin.html',
        controller: 'CheckinCtrl',
        data: {
          requireVolunteer: true
        }
      })
      .state('app.admin.stats', {
        url: "/admin",
        templateUrl: "views/admin/stats/stats.html",
        controller: 'AdminStatsCtrl'
      })
      .state('app.admin.mail', {
        url: "/admin/mail",
        templateUrl: "views/admin/mail/mail.html",
        controller: 'AdminMailCtrl'
      })
      .state('app.admin.challenges', {
        url: "/admin/challenges",
        templateUrl: "views/admin/challenges/challenges.html",
        controller: 'adminChallengesCtrl'
      })
      .state('app.admin.challenge', {
        url: "/admin/challenges/:id",
        templateUrl: "views/admin/challenge/challenge.html",
        controller: 'adminChallengeCtrl',
        resolve: {
          'challenge': ["$stateParams", "ChallengeService", function($stateParams, ChallengeService){
            return ChallengeService.get($stateParams.id);
          }]
        }
      })
      .state('app.admin.marketing', {
        url: "/admin/marketing",
        templateUrl: "views/admin/marketing/marketing.html",
        controller: 'adminMarketingCtrl'
      })
      .state('app.admin.users', {
        url: "/admin/users?" +
          '&page' +
          '&size' +
          '&query',
        templateUrl: "views/admin/users/users.html",
        controller: 'AdminUsersCtrl'
      })
      .state('app.admin.user', {
        url: "/admin/users/:id",
        templateUrl: "views/admin/user/user.html",
        controller: 'AdminUserCtrl',
        resolve: {
          'user': ["$stateParams", "UserService", function($stateParams, UserService){
            return UserService.get($stateParams.id);
          }]
        }
      })
      .state('app.admin.settings', {
        url: "/admin/settings",
        templateUrl: "views/admin/settings/settings.html",
        controller: 'AdminSettingsCtrl',
      })
      .state('app.admin.teams', {
        url: "/admin/teams",
        templateUrl: "views/admin/teams/teams.html",
        controller: 'AdminTeamCtrl',
        data: {
          requireVerified: true
        },
        resolve: {
          currentUser: ["UserService", function(UserService){
            return UserService.getCurrentUser();
          }],
          settings: ["SettingsService", function(SettingsService){
            return SettingsService.getPublicSettings();
          }]
        }
      })
      .state('reset', {
        url: "/reset/:token",
        templateUrl: "views/reset/reset.html",
        controller: 'ResetCtrl',
        data: {
          requireLogin: false
        }
      })
      .state('verify', {
        url: "/verify/:token",
        templateUrl: "views/verify/verify.html",
        controller: 'VerifyCtrl',
        data: {
          requireLogin: false
        }
      })
      .state('404', {
        url: "/404",
        templateUrl: "views/404.html",
        data: {
          requireLogin: false
        }
      });

    $locationProvider.html5Mode({
      enabled: true,
    });

  }])
  .run([
    '$rootScope',
    '$state',
    'Session',
    function(
      $rootScope,
      $state,
      Session ){

      $rootScope.$on('$stateChangeSuccess', function() {
         document.body.scrollTop = document.documentElement.scrollTop = 0;
      });

      $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {

        var requireLogin = toState.data.requireLogin;
        var requireLogout = toState.data.requireLogout;
        var requireAdmin = toState.data.requireAdmin;
        var requireVolunteer = toState.data.requireVolunteer;
        var requireVerified = toState.data.requireVerified;
        var requireAdmitted = toState.data.requireAdmitted;
  
        if (requireLogin && !Session.getToken()) {
          event.preventDefault();
          $state.go('home');
        }
  
        if (requireLogout && Session.getToken()) {
          event.preventDefault();
          $state.go('app.dashboard');
        }
        
        if (requireAdmin && !Session.getUser().admin) {
          event.preventDefault();           
          $state.go('app.dashboard');
        }
  
        if (requireVolunteer && !Session.getUser().volunteer && requireAdmin && !Session.getUser().admin) {
          event.preventDefault();           
          $state.go('app.dashboard');
        }
  
        if (requireVerified && !Session.getUser().verified) {
          event.preventDefault();           
          $state.go('app.dashboard');
        }
  
        if (requireAdmitted && !Session.getUser().status.admitted) {
          event.preventDefault();           
          $state.go('app.dashboard');
        }
  

      });

    }]);

angular.module('reg')
  .factory('AuthInterceptor', [
    'Session',
    function(Session){
      return {
          request: function(config){
            var token = Session.getToken();
            if (token){
              config.headers['x-access-token'] = token;
            }
            return config;
          }
        };
    }]);

angular.module('reg')
  .service('Session', [
    '$rootScope',
    '$window',
    function($rootScope, $window){

    this.create = function(token, user){
      $window.localStorage.jwt = token;
      $window.localStorage.userId = user._id;
      $window.localStorage.currentUser = JSON.stringify(user);
      $rootScope.currentUser = user;
    };

    this.destroy = function(onComplete){
      delete $window.localStorage.jwt;
      delete $window.localStorage.userId;
      delete $window.localStorage.currentUser;
      $rootScope.currentUser = null;
      if (onComplete){
        onComplete();
      }
    };

    this.getToken = function(){
      return $window.localStorage.jwt;
    };

    this.getUserId = function(){
      return $window.localStorage.userId;
    };

    this.getUser = function(){
      return JSON.parse($window.localStorage.currentUser);
    };

    this.setUser = function(user){
      $window.localStorage.currentUser = JSON.stringify(user);
      $rootScope.currentUser = user;
    };

  }]);
angular.module('reg')
  .factory('Utils', [
    function(){
      return {
        isRegOpen: function(settings){
          return Date.now() > settings.timeOpen && Date.now() < settings.timeClose;
        },
        isAfter: function(time){
          return Date.now() > time;
        },
        formatTime: function(time){

          if (!time){
            return "Invalid Date";
          }

          date = new Date(time);
          // Hack for timezone
          return moment(date).format('dddd, MMMM Do YYYY, h:mm a') +
            " " + date.toTimeString().split(' ')[2];

        }
      };
    }]);

(function($) {
    jQuery.fn.extend({
        html5_qrcode: function(qrcodeSuccess, qrcodeError, videoError) {
            return this.each(function() {
                var currentElem = $(this);

                var height = currentElem.height();
                var width = currentElem.width();

                if (height == null) {
                    height = 250;
                }

                if (width == null) {
                    width = 300;
                }

                // var vidElem = $('<video width="' + width + 'px" height="' + height + 'px"></video>').appendTo(currentElem);
                var vidElem = $('<video width="' + width + 'px" height="' + height + 'px" autoplay playsinline></video>').appendTo(currentElem);
                var canvasElem = $('<canvas id="qr-canvas" width="' + (width - 2) + 'px" height="' + (height - 2) + 'px" style="display:none;"></canvas>').appendTo(currentElem);

                var video = vidElem[0];
                var canvas = canvasElem[0];
                var context = canvas.getContext('2d');
                var localMediaStream;

                var scan = function() {
                    if (localMediaStream) {
                        context.drawImage(video, 0, 0, 307, 250);

                        try {
                            qrcode.decode();
                        } catch (e) {
                            qrcodeError(e, localMediaStream);
                        }

                        $.data(currentElem[0], "timeout", setTimeout(scan, 500));

                    } else {
                        $.data(currentElem[0], "timeout", setTimeout(scan, 500));
                    }
                };//end snapshot function

                window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
                navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

                var successCallback = function(stream) {
                    // video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
                    video.srcObject = stream;
                    localMediaStream = stream;
                    $.data(currentElem[0], "stream", stream);

                    video.play();
                    $.data(currentElem[0], "timeout", setTimeout(scan, 1000));
                };

                // Call the getUserMedia method with our callback functions
                if (navigator.getUserMedia) {
                    navigator.getUserMedia({video: { facingMode: "environment" } }, successCallback, function(error) {
                        videoError(error, localMediaStream);
                    });
                } else {
                    console.log('Native web camera streaming (getUserMedia) not supported in this browser.');
                    // Display a friendly "sorry" message to the user
                }

                qrcode.callback = function (result) {
                    qrcodeSuccess(result, localMediaStream);
                };
            }); // end of html5_qrcode
        },
        html5_qrcode_stop: function() {
            return this.each(function() {
                //stop the stream and cancel timeouts
                $(this).data('stream').getVideoTracks().forEach(function(videoTrack) {
                    videoTrack.stop();
                });

                clearTimeout($(this).data('timeout'));
            });
        }
    });
})(jQuery);


function ECB(count,dataCodewords){this.count=count,this.dataCodewords=dataCodewords,this.__defineGetter__("Count",function(){return this.count}),this.__defineGetter__("DataCodewords",function(){return this.dataCodewords})}function ECBlocks(ecCodewordsPerBlock,ecBlocks1,ecBlocks2){this.ecCodewordsPerBlock=ecCodewordsPerBlock,ecBlocks2?this.ecBlocks=new Array(ecBlocks1,ecBlocks2):this.ecBlocks=new Array(ecBlocks1),this.__defineGetter__("ECCodewordsPerBlock",function(){return this.ecCodewordsPerBlock}),this.__defineGetter__("TotalECCodewords",function(){return this.ecCodewordsPerBlock*this.NumBlocks}),this.__defineGetter__("NumBlocks",function(){for(var total=0,i=0;i<this.ecBlocks.length;i++)total+=this.ecBlocks[i].length;return total}),this.getECBlocks=function(){return this.ecBlocks}}function Version(versionNumber,alignmentPatternCenters,ecBlocks1,ecBlocks2,ecBlocks3,ecBlocks4){this.versionNumber=versionNumber,this.alignmentPatternCenters=alignmentPatternCenters,this.ecBlocks=new Array(ecBlocks1,ecBlocks2,ecBlocks3,ecBlocks4);for(var total=0,ecCodewords=ecBlocks1.ECCodewordsPerBlock,ecbArray=ecBlocks1.getECBlocks(),i=0;i<ecbArray.length;i++){var ecBlock=ecbArray[i];total+=ecBlock.Count*(ecBlock.DataCodewords+ecCodewords)}this.totalCodewords=total,this.__defineGetter__("VersionNumber",function(){return this.versionNumber}),this.__defineGetter__("AlignmentPatternCenters",function(){return this.alignmentPatternCenters}),this.__defineGetter__("TotalCodewords",function(){return this.totalCodewords}),this.__defineGetter__("DimensionForVersion",function(){return 17+4*this.versionNumber}),this.buildFunctionPattern=function(){var dimension=this.DimensionForVersion,bitMatrix=new BitMatrix(dimension);bitMatrix.setRegion(0,0,9,9),bitMatrix.setRegion(dimension-8,0,8,9),bitMatrix.setRegion(0,dimension-8,9,8);for(var max=this.alignmentPatternCenters.length,x=0;max>x;x++)for(var i=this.alignmentPatternCenters[x]-2,y=0;max>y;y++)0==x&&(0==y||y==max-1)||x==max-1&&0==y||bitMatrix.setRegion(this.alignmentPatternCenters[y]-2,i,5,5);return bitMatrix.setRegion(6,9,1,dimension-17),bitMatrix.setRegion(9,6,dimension-17,1),this.versionNumber>6&&(bitMatrix.setRegion(dimension-11,0,3,6),bitMatrix.setRegion(0,dimension-11,6,3)),bitMatrix},this.getECBlocksForLevel=function(ecLevel){return this.ecBlocks[ecLevel.ordinal()]}}function buildVersions(){return new Array(new Version(1,new Array,new ECBlocks(7,new ECB(1,19)),new ECBlocks(10,new ECB(1,16)),new ECBlocks(13,new ECB(1,13)),new ECBlocks(17,new ECB(1,9))),new Version(2,new Array(6,18),new ECBlocks(10,new ECB(1,34)),new ECBlocks(16,new ECB(1,28)),new ECBlocks(22,new ECB(1,22)),new ECBlocks(28,new ECB(1,16))),new Version(3,new Array(6,22),new ECBlocks(15,new ECB(1,55)),new ECBlocks(26,new ECB(1,44)),new ECBlocks(18,new ECB(2,17)),new ECBlocks(22,new ECB(2,13))),new Version(4,new Array(6,26),new ECBlocks(20,new ECB(1,80)),new ECBlocks(18,new ECB(2,32)),new ECBlocks(26,new ECB(2,24)),new ECBlocks(16,new ECB(4,9))),new Version(5,new Array(6,30),new ECBlocks(26,new ECB(1,108)),new ECBlocks(24,new ECB(2,43)),new ECBlocks(18,new ECB(2,15),new ECB(2,16)),new ECBlocks(22,new ECB(2,11),new ECB(2,12))),new Version(6,new Array(6,34),new ECBlocks(18,new ECB(2,68)),new ECBlocks(16,new ECB(4,27)),new ECBlocks(24,new ECB(4,19)),new ECBlocks(28,new ECB(4,15))),new Version(7,new Array(6,22,38),new ECBlocks(20,new ECB(2,78)),new ECBlocks(18,new ECB(4,31)),new ECBlocks(18,new ECB(2,14),new ECB(4,15)),new ECBlocks(26,new ECB(4,13),new ECB(1,14))),new Version(8,new Array(6,24,42),new ECBlocks(24,new ECB(2,97)),new ECBlocks(22,new ECB(2,38),new ECB(2,39)),new ECBlocks(22,new ECB(4,18),new ECB(2,19)),new ECBlocks(26,new ECB(4,14),new ECB(2,15))),new Version(9,new Array(6,26,46),new ECBlocks(30,new ECB(2,116)),new ECBlocks(22,new ECB(3,36),new ECB(2,37)),new ECBlocks(20,new ECB(4,16),new ECB(4,17)),new ECBlocks(24,new ECB(4,12),new ECB(4,13))),new Version(10,new Array(6,28,50),new ECBlocks(18,new ECB(2,68),new ECB(2,69)),new ECBlocks(26,new ECB(4,43),new ECB(1,44)),new ECBlocks(24,new ECB(6,19),new ECB(2,20)),new ECBlocks(28,new ECB(6,15),new ECB(2,16))),new Version(11,new Array(6,30,54),new ECBlocks(20,new ECB(4,81)),new ECBlocks(30,new ECB(1,50),new ECB(4,51)),new ECBlocks(28,new ECB(4,22),new ECB(4,23)),new ECBlocks(24,new ECB(3,12),new ECB(8,13))),new Version(12,new Array(6,32,58),new ECBlocks(24,new ECB(2,92),new ECB(2,93)),new ECBlocks(22,new ECB(6,36),new ECB(2,37)),new ECBlocks(26,new ECB(4,20),new ECB(6,21)),new ECBlocks(28,new ECB(7,14),new ECB(4,15))),new Version(13,new Array(6,34,62),new ECBlocks(26,new ECB(4,107)),new ECBlocks(22,new ECB(8,37),new ECB(1,38)),new ECBlocks(24,new ECB(8,20),new ECB(4,21)),new ECBlocks(22,new ECB(12,11),new ECB(4,12))),new Version(14,new Array(6,26,46,66),new ECBlocks(30,new ECB(3,115),new ECB(1,116)),new ECBlocks(24,new ECB(4,40),new ECB(5,41)),new ECBlocks(20,new ECB(11,16),new ECB(5,17)),new ECBlocks(24,new ECB(11,12),new ECB(5,13))),new Version(15,new Array(6,26,48,70),new ECBlocks(22,new ECB(5,87),new ECB(1,88)),new ECBlocks(24,new ECB(5,41),new ECB(5,42)),new ECBlocks(30,new ECB(5,24),new ECB(7,25)),new ECBlocks(24,new ECB(11,12),new ECB(7,13))),new Version(16,new Array(6,26,50,74),new ECBlocks(24,new ECB(5,98),new ECB(1,99)),new ECBlocks(28,new ECB(7,45),new ECB(3,46)),new ECBlocks(24,new ECB(15,19),new ECB(2,20)),new ECBlocks(30,new ECB(3,15),new ECB(13,16))),new Version(17,new Array(6,30,54,78),new ECBlocks(28,new ECB(1,107),new ECB(5,108)),new ECBlocks(28,new ECB(10,46),new ECB(1,47)),new ECBlocks(28,new ECB(1,22),new ECB(15,23)),new ECBlocks(28,new ECB(2,14),new ECB(17,15))),new Version(18,new Array(6,30,56,82),new ECBlocks(30,new ECB(5,120),new ECB(1,121)),new ECBlocks(26,new ECB(9,43),new ECB(4,44)),new ECBlocks(28,new ECB(17,22),new ECB(1,23)),new ECBlocks(28,new ECB(2,14),new ECB(19,15))),new Version(19,new Array(6,30,58,86),new ECBlocks(28,new ECB(3,113),new ECB(4,114)),new ECBlocks(26,new ECB(3,44),new ECB(11,45)),new ECBlocks(26,new ECB(17,21),new ECB(4,22)),new ECBlocks(26,new ECB(9,13),new ECB(16,14))),new Version(20,new Array(6,34,62,90),new ECBlocks(28,new ECB(3,107),new ECB(5,108)),new ECBlocks(26,new ECB(3,41),new ECB(13,42)),new ECBlocks(30,new ECB(15,24),new ECB(5,25)),new ECBlocks(28,new ECB(15,15),new ECB(10,16))),new Version(21,new Array(6,28,50,72,94),new ECBlocks(28,new ECB(4,116),new ECB(4,117)),new ECBlocks(26,new ECB(17,42)),new ECBlocks(28,new ECB(17,22),new ECB(6,23)),new ECBlocks(30,new ECB(19,16),new ECB(6,17))),new Version(22,new Array(6,26,50,74,98),new ECBlocks(28,new ECB(2,111),new ECB(7,112)),new ECBlocks(28,new ECB(17,46)),new ECBlocks(30,new ECB(7,24),new ECB(16,25)),new ECBlocks(24,new ECB(34,13))),new Version(23,new Array(6,30,54,74,102),new ECBlocks(30,new ECB(4,121),new ECB(5,122)),new ECBlocks(28,new ECB(4,47),new ECB(14,48)),new ECBlocks(30,new ECB(11,24),new ECB(14,25)),new ECBlocks(30,new ECB(16,15),new ECB(14,16))),new Version(24,new Array(6,28,54,80,106),new ECBlocks(30,new ECB(6,117),new ECB(4,118)),new ECBlocks(28,new ECB(6,45),new ECB(14,46)),new ECBlocks(30,new ECB(11,24),new ECB(16,25)),new ECBlocks(30,new ECB(30,16),new ECB(2,17))),new Version(25,new Array(6,32,58,84,110),new ECBlocks(26,new ECB(8,106),new ECB(4,107)),new ECBlocks(28,new ECB(8,47),new ECB(13,48)),new ECBlocks(30,new ECB(7,24),new ECB(22,25)),new ECBlocks(30,new ECB(22,15),new ECB(13,16))),new Version(26,new Array(6,30,58,86,114),new ECBlocks(28,new ECB(10,114),new ECB(2,115)),new ECBlocks(28,new ECB(19,46),new ECB(4,47)),new ECBlocks(28,new ECB(28,22),new ECB(6,23)),new ECBlocks(30,new ECB(33,16),new ECB(4,17))),new Version(27,new Array(6,34,62,90,118),new ECBlocks(30,new ECB(8,122),new ECB(4,123)),new ECBlocks(28,new ECB(22,45),new ECB(3,46)),new ECBlocks(30,new ECB(8,23),new ECB(26,24)),new ECBlocks(30,new ECB(12,15),new ECB(28,16))),new Version(28,new Array(6,26,50,74,98,122),new ECBlocks(30,new ECB(3,117),new ECB(10,118)),new ECBlocks(28,new ECB(3,45),new ECB(23,46)),new ECBlocks(30,new ECB(4,24),new ECB(31,25)),new ECBlocks(30,new ECB(11,15),new ECB(31,16))),new Version(29,new Array(6,30,54,78,102,126),new ECBlocks(30,new ECB(7,116),new ECB(7,117)),new ECBlocks(28,new ECB(21,45),new ECB(7,46)),new ECBlocks(30,new ECB(1,23),new ECB(37,24)),new ECBlocks(30,new ECB(19,15),new ECB(26,16))),new Version(30,new Array(6,26,52,78,104,130),new ECBlocks(30,new ECB(5,115),new ECB(10,116)),new ECBlocks(28,new ECB(19,47),new ECB(10,48)),new ECBlocks(30,new ECB(15,24),new ECB(25,25)),new ECBlocks(30,new ECB(23,15),new ECB(25,16))),new Version(31,new Array(6,30,56,82,108,134),new ECBlocks(30,new ECB(13,115),new ECB(3,116)),new ECBlocks(28,new ECB(2,46),new ECB(29,47)),new ECBlocks(30,new ECB(42,24),new ECB(1,25)),new ECBlocks(30,new ECB(23,15),new ECB(28,16))),new Version(32,new Array(6,34,60,86,112,138),new ECBlocks(30,new ECB(17,115)),new ECBlocks(28,new ECB(10,46),new ECB(23,47)),new ECBlocks(30,new ECB(10,24),new ECB(35,25)),new ECBlocks(30,new ECB(19,15),new ECB(35,16))),new Version(33,new Array(6,30,58,86,114,142),new ECBlocks(30,new ECB(17,115),new ECB(1,116)),new ECBlocks(28,new ECB(14,46),new ECB(21,47)),new ECBlocks(30,new ECB(29,24),new ECB(19,25)),new ECBlocks(30,new ECB(11,15),new ECB(46,16))),new Version(34,new Array(6,34,62,90,118,146),new ECBlocks(30,new ECB(13,115),new ECB(6,116)),new ECBlocks(28,new ECB(14,46),new ECB(23,47)),new ECBlocks(30,new ECB(44,24),new ECB(7,25)),new ECBlocks(30,new ECB(59,16),new ECB(1,17))),new Version(35,new Array(6,30,54,78,102,126,150),new ECBlocks(30,new ECB(12,121),new ECB(7,122)),new ECBlocks(28,new ECB(12,47),new ECB(26,48)),new ECBlocks(30,new ECB(39,24),new ECB(14,25)),new ECBlocks(30,new ECB(22,15),new ECB(41,16))),new Version(36,new Array(6,24,50,76,102,128,154),new ECBlocks(30,new ECB(6,121),new ECB(14,122)),new ECBlocks(28,new ECB(6,47),new ECB(34,48)),new ECBlocks(30,new ECB(46,24),new ECB(10,25)),new ECBlocks(30,new ECB(2,15),new ECB(64,16))),new Version(37,new Array(6,28,54,80,106,132,158),new ECBlocks(30,new ECB(17,122),new ECB(4,123)),new ECBlocks(28,new ECB(29,46),new ECB(14,47)),new ECBlocks(30,new ECB(49,24),new ECB(10,25)),new ECBlocks(30,new ECB(24,15),new ECB(46,16))),new Version(38,new Array(6,32,58,84,110,136,162),new ECBlocks(30,new ECB(4,122),new ECB(18,123)),new ECBlocks(28,new ECB(13,46),new ECB(32,47)),new ECBlocks(30,new ECB(48,24),new ECB(14,25)),new ECBlocks(30,new ECB(42,15),new ECB(32,16))),new Version(39,new Array(6,26,54,82,110,138,166),new ECBlocks(30,new ECB(20,117),new ECB(4,118)),new ECBlocks(28,new ECB(40,47),new ECB(7,48)),new ECBlocks(30,new ECB(43,24),new ECB(22,25)),new ECBlocks(30,new ECB(10,15),new ECB(67,16))),new Version(40,new Array(6,30,58,86,114,142,170),new ECBlocks(30,new ECB(19,118),new ECB(6,119)),new ECBlocks(28,new ECB(18,47),new ECB(31,48)),new ECBlocks(30,new ECB(34,24),new ECB(34,25)),new ECBlocks(30,new ECB(20,15),new ECB(61,16))))}function PerspectiveTransform(a11,a21,a31,a12,a22,a32,a13,a23,a33){this.a11=a11,this.a12=a12,this.a13=a13,this.a21=a21,this.a22=a22,this.a23=a23,this.a31=a31,this.a32=a32,this.a33=a33,this.transformPoints1=function(points){for(var max=points.length,a11=this.a11,a12=this.a12,a13=this.a13,a21=this.a21,a22=this.a22,a23=this.a23,a31=this.a31,a32=this.a32,a33=this.a33,i=0;max>i;i+=2){var x=points[i],y=points[i+1],denominator=a13*x+a23*y+a33;points[i]=(a11*x+a21*y+a31)/denominator,points[i+1]=(a12*x+a22*y+a32)/denominator}},this.transformPoints2=function(xValues,yValues){for(var n=xValues.length,i=0;n>i;i++){var x=xValues[i],y=yValues[i],denominator=this.a13*x+this.a23*y+this.a33;xValues[i]=(this.a11*x+this.a21*y+this.a31)/denominator,yValues[i]=(this.a12*x+this.a22*y+this.a32)/denominator}},this.buildAdjoint=function(){return new PerspectiveTransform(this.a22*this.a33-this.a23*this.a32,this.a23*this.a31-this.a21*this.a33,this.a21*this.a32-this.a22*this.a31,this.a13*this.a32-this.a12*this.a33,this.a11*this.a33-this.a13*this.a31,this.a12*this.a31-this.a11*this.a32,this.a12*this.a23-this.a13*this.a22,this.a13*this.a21-this.a11*this.a23,this.a11*this.a22-this.a12*this.a21)},this.times=function(other){return new PerspectiveTransform(this.a11*other.a11+this.a21*other.a12+this.a31*other.a13,this.a11*other.a21+this.a21*other.a22+this.a31*other.a23,this.a11*other.a31+this.a21*other.a32+this.a31*other.a33,this.a12*other.a11+this.a22*other.a12+this.a32*other.a13,this.a12*other.a21+this.a22*other.a22+this.a32*other.a23,this.a12*other.a31+this.a22*other.a32+this.a32*other.a33,this.a13*other.a11+this.a23*other.a12+this.a33*other.a13,this.a13*other.a21+this.a23*other.a22+this.a33*other.a23,this.a13*other.a31+this.a23*other.a32+this.a33*other.a33)}}function DetectorResult(bits,points){this.bits=bits,this.points=points}function Detector(image){this.image=image,this.resultPointCallback=null,this.sizeOfBlackWhiteBlackRun=function(fromX,fromY,toX,toY){var steep=Math.abs(toY-fromY)>Math.abs(toX-fromX);if(steep){var temp=fromX;fromX=fromY,fromY=temp,temp=toX,toX=toY,toY=temp}for(var dx=Math.abs(toX-fromX),dy=Math.abs(toY-fromY),error=-dx>>1,ystep=toY>fromY?1:-1,xstep=toX>fromX?1:-1,state=0,x=fromX,y=fromY;x!=toX;x+=xstep){var realX=steep?y:x,realY=steep?x:y;if(1==state?this.image[realX+realY*qrcode.width]&&state++:this.image[realX+realY*qrcode.width]||state++,3==state){var diffX=x-fromX,diffY=y-fromY;return Math.sqrt(diffX*diffX+diffY*diffY)}if(error+=dy,error>0){if(y==toY)break;y+=ystep,error-=dx}}var diffX2=toX-fromX,diffY2=toY-fromY;return Math.sqrt(diffX2*diffX2+diffY2*diffY2)},this.sizeOfBlackWhiteBlackRunBothWays=function(fromX,fromY,toX,toY){var result=this.sizeOfBlackWhiteBlackRun(fromX,fromY,toX,toY),scale=1,otherToX=fromX-(toX-fromX);0>otherToX?(scale=fromX/(fromX-otherToX),otherToX=0):otherToX>=qrcode.width&&(scale=(qrcode.width-1-fromX)/(otherToX-fromX),otherToX=qrcode.width-1);var otherToY=Math.floor(fromY-(toY-fromY)*scale);return scale=1,0>otherToY?(scale=fromY/(fromY-otherToY),otherToY=0):otherToY>=qrcode.height&&(scale=(qrcode.height-1-fromY)/(otherToY-fromY),otherToY=qrcode.height-1),otherToX=Math.floor(fromX+(otherToX-fromX)*scale),result+=this.sizeOfBlackWhiteBlackRun(fromX,fromY,otherToX,otherToY),result-1},this.calculateModuleSizeOneWay=function(pattern,otherPattern){var moduleSizeEst1=this.sizeOfBlackWhiteBlackRunBothWays(Math.floor(pattern.X),Math.floor(pattern.Y),Math.floor(otherPattern.X),Math.floor(otherPattern.Y)),moduleSizeEst2=this.sizeOfBlackWhiteBlackRunBothWays(Math.floor(otherPattern.X),Math.floor(otherPattern.Y),Math.floor(pattern.X),Math.floor(pattern.Y));return isNaN(moduleSizeEst1)?moduleSizeEst2/7:isNaN(moduleSizeEst2)?moduleSizeEst1/7:(moduleSizeEst1+moduleSizeEst2)/14},this.calculateModuleSize=function(topLeft,topRight,bottomLeft){return(this.calculateModuleSizeOneWay(topLeft,topRight)+this.calculateModuleSizeOneWay(topLeft,bottomLeft))/2},this.distance=function(pattern1,pattern2){return xDiff=pattern1.X-pattern2.X,yDiff=pattern1.Y-pattern2.Y,Math.sqrt(xDiff*xDiff+yDiff*yDiff)},this.computeDimension=function(topLeft,topRight,bottomLeft,moduleSize){var tltrCentersDimension=Math.round(this.distance(topLeft,topRight)/moduleSize),tlblCentersDimension=Math.round(this.distance(topLeft,bottomLeft)/moduleSize),dimension=(tltrCentersDimension+tlblCentersDimension>>1)+7;switch(3&dimension){case 0:dimension++;break;case 2:dimension--;break;case 3:throw"Error"}return dimension},this.findAlignmentInRegion=function(overallEstModuleSize,estAlignmentX,estAlignmentY,allowanceFactor){var allowance=Math.floor(allowanceFactor*overallEstModuleSize),alignmentAreaLeftX=Math.max(0,estAlignmentX-allowance),alignmentAreaRightX=Math.min(qrcode.width-1,estAlignmentX+allowance);if(3*overallEstModuleSize>alignmentAreaRightX-alignmentAreaLeftX)throw"Error";var alignmentAreaTopY=Math.max(0,estAlignmentY-allowance),alignmentAreaBottomY=Math.min(qrcode.height-1,estAlignmentY+allowance),alignmentFinder=new AlignmentPatternFinder(this.image,alignmentAreaLeftX,alignmentAreaTopY,alignmentAreaRightX-alignmentAreaLeftX,alignmentAreaBottomY-alignmentAreaTopY,overallEstModuleSize,this.resultPointCallback);return alignmentFinder.find()},this.createTransform=function(topLeft,topRight,bottomLeft,alignmentPattern,dimension){var bottomRightX,bottomRightY,sourceBottomRightX,sourceBottomRightY,dimMinusThree=dimension-3.5;null!=alignmentPattern?(bottomRightX=alignmentPattern.X,bottomRightY=alignmentPattern.Y,sourceBottomRightX=sourceBottomRightY=dimMinusThree-3):(bottomRightX=topRight.X-topLeft.X+bottomLeft.X,bottomRightY=topRight.Y-topLeft.Y+bottomLeft.Y,sourceBottomRightX=sourceBottomRightY=dimMinusThree);var transform=PerspectiveTransform.quadrilateralToQuadrilateral(3.5,3.5,dimMinusThree,3.5,sourceBottomRightX,sourceBottomRightY,3.5,dimMinusThree,topLeft.X,topLeft.Y,topRight.X,topRight.Y,bottomRightX,bottomRightY,bottomLeft.X,bottomLeft.Y);return transform},this.sampleGrid=function(image,transform,dimension){var sampler=GridSampler;return sampler.sampleGrid3(image,dimension,transform)},this.processFinderPatternInfo=function(info){var topLeft=info.TopLeft,topRight=info.TopRight,bottomLeft=info.BottomLeft,moduleSize=this.calculateModuleSize(topLeft,topRight,bottomLeft);if(1>moduleSize)throw"Error";var dimension=this.computeDimension(topLeft,topRight,bottomLeft,moduleSize),provisionalVersion=Version.getProvisionalVersionForDimension(dimension),modulesBetweenFPCenters=provisionalVersion.DimensionForVersion-7,alignmentPattern=null;if(provisionalVersion.AlignmentPatternCenters.length>0)for(var bottomRightX=topRight.X-topLeft.X+bottomLeft.X,bottomRightY=topRight.Y-topLeft.Y+bottomLeft.Y,correctionToTopLeft=1-3/modulesBetweenFPCenters,estAlignmentX=Math.floor(topLeft.X+correctionToTopLeft*(bottomRightX-topLeft.X)),estAlignmentY=Math.floor(topLeft.Y+correctionToTopLeft*(bottomRightY-topLeft.Y)),i=4;16>=i;i<<=1){alignmentPattern=this.findAlignmentInRegion(moduleSize,estAlignmentX,estAlignmentY,i);break}var points,transform=this.createTransform(topLeft,topRight,bottomLeft,alignmentPattern,dimension),bits=this.sampleGrid(this.image,transform,dimension);return points=null==alignmentPattern?new Array(bottomLeft,topLeft,topRight):new Array(bottomLeft,topLeft,topRight,alignmentPattern),new DetectorResult(bits,points)},this.detect=function(){var info=(new FinderPatternFinder).findFinderPattern(this.image);return this.processFinderPatternInfo(info)}}function FormatInformation(formatInfo){this.errorCorrectionLevel=ErrorCorrectionLevel.forBits(formatInfo>>3&3),this.dataMask=7&formatInfo,this.__defineGetter__("ErrorCorrectionLevel",function(){return this.errorCorrectionLevel}),this.__defineGetter__("DataMask",function(){return this.dataMask}),this.GetHashCode=function(){return this.errorCorrectionLevel.ordinal()<<3|dataMask},this.Equals=function(o){var other=o;return this.errorCorrectionLevel==other.errorCorrectionLevel&&this.dataMask==other.dataMask}}function ErrorCorrectionLevel(ordinal,bits,name){this.ordinal_Renamed_Field=ordinal,this.bits=bits,this.name=name,this.__defineGetter__("Bits",function(){return this.bits}),this.__defineGetter__("Name",function(){return this.name}),this.ordinal=function(){return this.ordinal_Renamed_Field}}function BitMatrix(width,height){if(height||(height=width),1>width||1>height)throw"Both dimensions must be greater than 0";this.width=width,this.height=height;var rowSize=width>>5;0!=(31&width)&&rowSize++,this.rowSize=rowSize,this.bits=new Array(rowSize*height);for(var i=0;i<this.bits.length;i++)this.bits[i]=0;this.__defineGetter__("Width",function(){return this.width}),this.__defineGetter__("Height",function(){return this.height}),this.__defineGetter__("Dimension",function(){if(this.width!=this.height)throw"Can't call getDimension() on a non-square matrix";return this.width}),this.get_Renamed=function(x,y){var offset=y*this.rowSize+(x>>5);return 0!=(1&URShift(this.bits[offset],31&x))},this.set_Renamed=function(x,y){var offset=y*this.rowSize+(x>>5);this.bits[offset]|=1<<(31&x)},this.flip=function(x,y){var offset=y*this.rowSize+(x>>5);this.bits[offset]^=1<<(31&x)},this.clear=function(){for(var max=this.bits.length,i=0;max>i;i++)this.bits[i]=0},this.setRegion=function(left,top,width,height){if(0>top||0>left)throw"Left and top must be nonnegative";if(1>height||1>width)throw"Height and width must be at least 1";var right=left+width,bottom=top+height;if(bottom>this.height||right>this.width)throw"The region must fit inside the matrix";for(var y=top;bottom>y;y++)for(var offset=y*this.rowSize,x=left;right>x;x++)this.bits[offset+(x>>5)]|=1<<(31&x)}}function DataBlock(numDataCodewords,codewords){this.numDataCodewords=numDataCodewords,this.codewords=codewords,this.__defineGetter__("NumDataCodewords",function(){return this.numDataCodewords}),this.__defineGetter__("Codewords",function(){return this.codewords})}function BitMatrixParser(bitMatrix){var dimension=bitMatrix.Dimension;if(21>dimension||1!=(3&dimension))throw"Error BitMatrixParser";this.bitMatrix=bitMatrix,this.parsedVersion=null,this.parsedFormatInfo=null,this.copyBit=function(i,j,versionBits){return this.bitMatrix.get_Renamed(i,j)?versionBits<<1|1:versionBits<<1},this.readFormatInformation=function(){if(null!=this.parsedFormatInfo)return this.parsedFormatInfo;for(var formatInfoBits=0,i=0;6>i;i++)formatInfoBits=this.copyBit(i,8,formatInfoBits);formatInfoBits=this.copyBit(7,8,formatInfoBits),formatInfoBits=this.copyBit(8,8,formatInfoBits),formatInfoBits=this.copyBit(8,7,formatInfoBits);for(var j=5;j>=0;j--)formatInfoBits=this.copyBit(8,j,formatInfoBits);if(this.parsedFormatInfo=FormatInformation.decodeFormatInformation(formatInfoBits),null!=this.parsedFormatInfo)return this.parsedFormatInfo;var dimension=this.bitMatrix.Dimension;formatInfoBits=0;for(var iMin=dimension-8,i=dimension-1;i>=iMin;i--)formatInfoBits=this.copyBit(i,8,formatInfoBits);for(var j=dimension-7;dimension>j;j++)formatInfoBits=this.copyBit(8,j,formatInfoBits);if(this.parsedFormatInfo=FormatInformation.decodeFormatInformation(formatInfoBits),null!=this.parsedFormatInfo)return this.parsedFormatInfo;throw"Error readFormatInformation"},this.readVersion=function(){if(null!=this.parsedVersion)return this.parsedVersion;var dimension=this.bitMatrix.Dimension,provisionalVersion=dimension-17>>2;if(6>=provisionalVersion)return Version.getVersionForNumber(provisionalVersion);for(var versionBits=0,ijMin=dimension-11,j=5;j>=0;j--)for(var i=dimension-9;i>=ijMin;i--)versionBits=this.copyBit(i,j,versionBits);if(this.parsedVersion=Version.decodeVersionInformation(versionBits),null!=this.parsedVersion&&this.parsedVersion.DimensionForVersion==dimension)return this.parsedVersion;versionBits=0;for(var i=5;i>=0;i--)for(var j=dimension-9;j>=ijMin;j--)versionBits=this.copyBit(i,j,versionBits);if(this.parsedVersion=Version.decodeVersionInformation(versionBits),null!=this.parsedVersion&&this.parsedVersion.DimensionForVersion==dimension)return this.parsedVersion;throw"Error readVersion"},this.readCodewords=function(){var formatInfo=this.readFormatInformation(),version=this.readVersion(),dataMask=DataMask.forReference(formatInfo.DataMask),dimension=this.bitMatrix.Dimension;dataMask.unmaskBitMatrix(this.bitMatrix,dimension);for(var functionPattern=version.buildFunctionPattern(),readingUp=!0,result=new Array(version.TotalCodewords),resultOffset=0,currentByte=0,bitsRead=0,j=dimension-1;j>0;j-=2){6==j&&j--;for(var count=0;dimension>count;count++)for(var i=readingUp?dimension-1-count:count,col=0;2>col;col++)functionPattern.get_Renamed(j-col,i)||(bitsRead++,currentByte<<=1,this.bitMatrix.get_Renamed(j-col,i)&&(currentByte|=1),8==bitsRead&&(result[resultOffset++]=currentByte,bitsRead=0,currentByte=0));readingUp^=!0}if(resultOffset!=version.TotalCodewords)throw"Error readCodewords";return result}}function DataMask000(){this.unmaskBitMatrix=function(bits,dimension){for(var i=0;dimension>i;i++)for(var j=0;dimension>j;j++)this.isMasked(i,j)&&bits.flip(j,i)},this.isMasked=function(i,j){return 0==(i+j&1)}}function DataMask001(){this.unmaskBitMatrix=function(bits,dimension){for(var i=0;dimension>i;i++)for(var j=0;dimension>j;j++)this.isMasked(i,j)&&bits.flip(j,i)},this.isMasked=function(i,j){return 0==(1&i)}}function DataMask010(){this.unmaskBitMatrix=function(bits,dimension){for(var i=0;dimension>i;i++)for(var j=0;dimension>j;j++)this.isMasked(i,j)&&bits.flip(j,i)},this.isMasked=function(i,j){return j%3==0}}function DataMask011(){this.unmaskBitMatrix=function(bits,dimension){for(var i=0;dimension>i;i++)for(var j=0;dimension>j;j++)this.isMasked(i,j)&&bits.flip(j,i)},this.isMasked=function(i,j){return(i+j)%3==0}}function DataMask100(){this.unmaskBitMatrix=function(bits,dimension){for(var i=0;dimension>i;i++)for(var j=0;dimension>j;j++)this.isMasked(i,j)&&bits.flip(j,i)},this.isMasked=function(i,j){return 0==(URShift(i,1)+j/3&1)}}function DataMask101(){this.unmaskBitMatrix=function(bits,dimension){for(var i=0;dimension>i;i++)for(var j=0;dimension>j;j++)this.isMasked(i,j)&&bits.flip(j,i)},this.isMasked=function(i,j){var temp=i*j;return(1&temp)+temp%3==0}}function DataMask110(){this.unmaskBitMatrix=function(bits,dimension){for(var i=0;dimension>i;i++)for(var j=0;dimension>j;j++)this.isMasked(i,j)&&bits.flip(j,i)},this.isMasked=function(i,j){var temp=i*j;return 0==((1&temp)+temp%3&1)}}function DataMask111(){this.unmaskBitMatrix=function(bits,dimension){for(var i=0;dimension>i;i++)for(var j=0;dimension>j;j++)this.isMasked(i,j)&&bits.flip(j,i)},this.isMasked=function(i,j){return 0==((i+j&1)+i*j%3&1)}}function ReedSolomonDecoder(field){this.field=field,this.decode=function(received,twoS){for(var poly=new GF256Poly(this.field,received),syndromeCoefficients=new Array(twoS),i=0;i<syndromeCoefficients.length;i++)syndromeCoefficients[i]=0;for(var dataMatrix=!1,noError=!0,i=0;twoS>i;i++){var eval=poly.evaluateAt(this.field.exp(dataMatrix?i+1:i));syndromeCoefficients[syndromeCoefficients.length-1-i]=eval,0!=eval&&(noError=!1)}if(!noError)for(var syndrome=new GF256Poly(this.field,syndromeCoefficients),sigmaOmega=this.runEuclideanAlgorithm(this.field.buildMonomial(twoS,1),syndrome,twoS),sigma=sigmaOmega[0],omega=sigmaOmega[1],errorLocations=this.findErrorLocations(sigma),errorMagnitudes=this.findErrorMagnitudes(omega,errorLocations,dataMatrix),i=0;i<errorLocations.length;i++){var position=received.length-1-this.field.log(errorLocations[i]);if(0>position)throw"ReedSolomonException Bad error location";received[position]=GF256.addOrSubtract(received[position],errorMagnitudes[i])}},this.runEuclideanAlgorithm=function(a,b,R){if(a.Degree<b.Degree){var temp=a;a=b,b=temp}for(var rLast=a,r=b,sLast=this.field.One,s=this.field.Zero,tLast=this.field.Zero,t=this.field.One;r.Degree>=Math.floor(R/2);){var rLastLast=rLast,sLastLast=sLast,tLastLast=tLast;if(rLast=r,sLast=s,tLast=t,rLast.Zero)throw"r_{i-1} was zero";r=rLastLast;for(var q=this.field.Zero,denominatorLeadingTerm=rLast.getCoefficient(rLast.Degree),dltInverse=this.field.inverse(denominatorLeadingTerm);r.Degree>=rLast.Degree&&!r.Zero;){var degreeDiff=r.Degree-rLast.Degree,scale=this.field.multiply(r.getCoefficient(r.Degree),dltInverse);q=q.addOrSubtract(this.field.buildMonomial(degreeDiff,scale)),r=r.addOrSubtract(rLast.multiplyByMonomial(degreeDiff,scale))}s=q.multiply1(sLast).addOrSubtract(sLastLast),t=q.multiply1(tLast).addOrSubtract(tLastLast)}var sigmaTildeAtZero=t.getCoefficient(0);if(0==sigmaTildeAtZero)throw"ReedSolomonException sigmaTilde(0) was zero";var inverse=this.field.inverse(sigmaTildeAtZero),sigma=t.multiply2(inverse),omega=r.multiply2(inverse);return new Array(sigma,omega)},this.findErrorLocations=function(errorLocator){var numErrors=errorLocator.Degree;if(1==numErrors)return new Array(errorLocator.getCoefficient(1));for(var result=new Array(numErrors),e=0,i=1;256>i&&numErrors>e;i++)0==errorLocator.evaluateAt(i)&&(result[e]=this.field.inverse(i),e++);if(e!=numErrors)throw"Error locator degree does not match number of roots";return result},this.findErrorMagnitudes=function(errorEvaluator,errorLocations,dataMatrix){for(var s=errorLocations.length,result=new Array(s),i=0;s>i;i++){for(var xiInverse=this.field.inverse(errorLocations[i]),denominator=1,j=0;s>j;j++)i!=j&&(denominator=this.field.multiply(denominator,GF256.addOrSubtract(1,this.field.multiply(errorLocations[j],xiInverse))));result[i]=this.field.multiply(errorEvaluator.evaluateAt(xiInverse),this.field.inverse(denominator)),dataMatrix&&(result[i]=this.field.multiply(result[i],xiInverse))}return result}}function GF256Poly(field,coefficients){if(null==coefficients||0==coefficients.length)throw"System.ArgumentException";this.field=field;var coefficientsLength=coefficients.length;if(coefficientsLength>1&&0==coefficients[0]){for(var firstNonZero=1;coefficientsLength>firstNonZero&&0==coefficients[firstNonZero];)firstNonZero++;if(firstNonZero==coefficientsLength)this.coefficients=field.Zero.coefficients;else{this.coefficients=new Array(coefficientsLength-firstNonZero);for(var i=0;i<this.coefficients.length;i++)this.coefficients[i]=0;for(var ci=0;ci<this.coefficients.length;ci++)this.coefficients[ci]=coefficients[firstNonZero+ci]}}else this.coefficients=coefficients;this.__defineGetter__("Zero",function(){return 0==this.coefficients[0]}),this.__defineGetter__("Degree",function(){return this.coefficients.length-1}),this.__defineGetter__("Coefficients",function(){return this.coefficients}),this.getCoefficient=function(degree){return this.coefficients[this.coefficients.length-1-degree]},this.evaluateAt=function(a){if(0==a)return this.getCoefficient(0);var size=this.coefficients.length;if(1==a){for(var result=0,i=0;size>i;i++)result=GF256.addOrSubtract(result,this.coefficients[i]);return result}for(var result2=this.coefficients[0],i=1;size>i;i++)result2=GF256.addOrSubtract(this.field.multiply(a,result2),this.coefficients[i]);return result2},this.addOrSubtract=function(other){if(this.field!=other.field)throw"GF256Polys do not have same GF256 field";if(this.Zero)return other;if(other.Zero)return this;var smallerCoefficients=this.coefficients,largerCoefficients=other.coefficients;if(smallerCoefficients.length>largerCoefficients.length){var temp=smallerCoefficients;smallerCoefficients=largerCoefficients,largerCoefficients=temp}for(var sumDiff=new Array(largerCoefficients.length),lengthDiff=largerCoefficients.length-smallerCoefficients.length,ci=0;lengthDiff>ci;ci++)sumDiff[ci]=largerCoefficients[ci];for(var i=lengthDiff;i<largerCoefficients.length;i++)sumDiff[i]=GF256.addOrSubtract(smallerCoefficients[i-lengthDiff],largerCoefficients[i]);return new GF256Poly(field,sumDiff)},this.multiply1=function(other){if(this.field!=other.field)throw"GF256Polys do not have same GF256 field";if(this.Zero||other.Zero)return this.field.Zero;for(var aCoefficients=this.coefficients,aLength=aCoefficients.length,bCoefficients=other.coefficients,bLength=bCoefficients.length,product=new Array(aLength+bLength-1),i=0;aLength>i;i++)for(var aCoeff=aCoefficients[i],j=0;bLength>j;j++)product[i+j]=GF256.addOrSubtract(product[i+j],this.field.multiply(aCoeff,bCoefficients[j]));return new GF256Poly(this.field,product)},this.multiply2=function(scalar){if(0==scalar)return this.field.Zero;if(1==scalar)return this;for(var size=this.coefficients.length,product=new Array(size),i=0;size>i;i++)product[i]=this.field.multiply(this.coefficients[i],scalar);return new GF256Poly(this.field,product)},this.multiplyByMonomial=function(degree,coefficient){if(0>degree)throw"System.ArgumentException";if(0==coefficient)return this.field.Zero;for(var size=this.coefficients.length,product=new Array(size+degree),i=0;i<product.length;i++)product[i]=0;for(var i=0;size>i;i++)product[i]=this.field.multiply(this.coefficients[i],coefficient);return new GF256Poly(this.field,product)},this.divide=function(other){if(this.field!=other.field)throw"GF256Polys do not have same GF256 field";if(other.Zero)throw"Divide by 0";for(var quotient=this.field.Zero,remainder=this,denominatorLeadingTerm=other.getCoefficient(other.Degree),inverseDenominatorLeadingTerm=this.field.inverse(denominatorLeadingTerm);remainder.Degree>=other.Degree&&!remainder.Zero;){
    var degreeDifference=remainder.Degree-other.Degree,scale=this.field.multiply(remainder.getCoefficient(remainder.Degree),inverseDenominatorLeadingTerm),term=other.multiplyByMonomial(degreeDifference,scale),iterationQuotient=this.field.buildMonomial(degreeDifference,scale);quotient=quotient.addOrSubtract(iterationQuotient),remainder=remainder.addOrSubtract(term)}return new Array(quotient,remainder)}}function GF256(primitive){this.expTable=new Array(256),this.logTable=new Array(256);for(var x=1,i=0;256>i;i++)this.expTable[i]=x,x<<=1,x>=256&&(x^=primitive);for(var i=0;255>i;i++)this.logTable[this.expTable[i]]=i;var at0=new Array(1);at0[0]=0,this.zero=new GF256Poly(this,new Array(at0));var at1=new Array(1);at1[0]=1,this.one=new GF256Poly(this,new Array(at1)),this.__defineGetter__("Zero",function(){return this.zero}),this.__defineGetter__("One",function(){return this.one}),this.buildMonomial=function(degree,coefficient){if(0>degree)throw"System.ArgumentException";if(0==coefficient)return zero;for(var coefficients=new Array(degree+1),i=0;i<coefficients.length;i++)coefficients[i]=0;return coefficients[0]=coefficient,new GF256Poly(this,coefficients)},this.exp=function(a){return this.expTable[a]},this.log=function(a){if(0==a)throw"System.ArgumentException";return this.logTable[a]},this.inverse=function(a){if(0==a)throw"System.ArithmeticException";return this.expTable[255-this.logTable[a]]},this.multiply=function(a,b){return 0==a||0==b?0:1==a?b:1==b?a:this.expTable[(this.logTable[a]+this.logTable[b])%255]}}function URShift(number,bits){return number>=0?number>>bits:(number>>bits)+(2<<~bits)}function FinderPattern(posX,posY,estimatedModuleSize){this.x=posX,this.y=posY,this.count=1,this.estimatedModuleSize=estimatedModuleSize,this.__defineGetter__("EstimatedModuleSize",function(){return this.estimatedModuleSize}),this.__defineGetter__("Count",function(){return this.count}),this.__defineGetter__("X",function(){return this.x}),this.__defineGetter__("Y",function(){return this.y}),this.incrementCount=function(){this.count++},this.aboutEquals=function(moduleSize,i,j){if(Math.abs(i-this.y)<=moduleSize&&Math.abs(j-this.x)<=moduleSize){var moduleSizeDiff=Math.abs(moduleSize-this.estimatedModuleSize);return 1>=moduleSizeDiff||moduleSizeDiff/this.estimatedModuleSize<=1}return!1}}function FinderPatternInfo(patternCenters){this.bottomLeft=patternCenters[0],this.topLeft=patternCenters[1],this.topRight=patternCenters[2],this.__defineGetter__("BottomLeft",function(){return this.bottomLeft}),this.__defineGetter__("TopLeft",function(){return this.topLeft}),this.__defineGetter__("TopRight",function(){return this.topRight})}function FinderPatternFinder(){this.image=null,this.possibleCenters=[],this.hasSkipped=!1,this.crossCheckStateCount=new Array(0,0,0,0,0),this.resultPointCallback=null,this.__defineGetter__("CrossCheckStateCount",function(){return this.crossCheckStateCount[0]=0,this.crossCheckStateCount[1]=0,this.crossCheckStateCount[2]=0,this.crossCheckStateCount[3]=0,this.crossCheckStateCount[4]=0,this.crossCheckStateCount}),this.foundPatternCross=function(stateCount){for(var totalModuleSize=0,i=0;5>i;i++){var count=stateCount[i];if(0==count)return!1;totalModuleSize+=count}if(7>totalModuleSize)return!1;var moduleSize=Math.floor((totalModuleSize<<INTEGER_MATH_SHIFT)/7),maxVariance=Math.floor(moduleSize/2);return Math.abs(moduleSize-(stateCount[0]<<INTEGER_MATH_SHIFT))<maxVariance&&Math.abs(moduleSize-(stateCount[1]<<INTEGER_MATH_SHIFT))<maxVariance&&Math.abs(3*moduleSize-(stateCount[2]<<INTEGER_MATH_SHIFT))<3*maxVariance&&Math.abs(moduleSize-(stateCount[3]<<INTEGER_MATH_SHIFT))<maxVariance&&Math.abs(moduleSize-(stateCount[4]<<INTEGER_MATH_SHIFT))<maxVariance},this.centerFromEnd=function(stateCount,end){return end-stateCount[4]-stateCount[3]-stateCount[2]/2},this.crossCheckVertical=function(startI,centerJ,maxCount,originalStateCountTotal){for(var image=this.image,maxI=qrcode.height,stateCount=this.CrossCheckStateCount,i=startI;i>=0&&image[centerJ+i*qrcode.width];)stateCount[2]++,i--;if(0>i)return NaN;for(;i>=0&&!image[centerJ+i*qrcode.width]&&stateCount[1]<=maxCount;)stateCount[1]++,i--;if(0>i||stateCount[1]>maxCount)return NaN;for(;i>=0&&image[centerJ+i*qrcode.width]&&stateCount[0]<=maxCount;)stateCount[0]++,i--;if(stateCount[0]>maxCount)return NaN;for(i=startI+1;maxI>i&&image[centerJ+i*qrcode.width];)stateCount[2]++,i++;if(i==maxI)return NaN;for(;maxI>i&&!image[centerJ+i*qrcode.width]&&stateCount[3]<maxCount;)stateCount[3]++,i++;if(i==maxI||stateCount[3]>=maxCount)return NaN;for(;maxI>i&&image[centerJ+i*qrcode.width]&&stateCount[4]<maxCount;)stateCount[4]++,i++;if(stateCount[4]>=maxCount)return NaN;var stateCountTotal=stateCount[0]+stateCount[1]+stateCount[2]+stateCount[3]+stateCount[4];return 5*Math.abs(stateCountTotal-originalStateCountTotal)>=2*originalStateCountTotal?NaN:this.foundPatternCross(stateCount)?this.centerFromEnd(stateCount,i):NaN},this.crossCheckHorizontal=function(startJ,centerI,maxCount,originalStateCountTotal){for(var image=this.image,maxJ=qrcode.width,stateCount=this.CrossCheckStateCount,j=startJ;j>=0&&image[j+centerI*qrcode.width];)stateCount[2]++,j--;if(0>j)return NaN;for(;j>=0&&!image[j+centerI*qrcode.width]&&stateCount[1]<=maxCount;)stateCount[1]++,j--;if(0>j||stateCount[1]>maxCount)return NaN;for(;j>=0&&image[j+centerI*qrcode.width]&&stateCount[0]<=maxCount;)stateCount[0]++,j--;if(stateCount[0]>maxCount)return NaN;for(j=startJ+1;maxJ>j&&image[j+centerI*qrcode.width];)stateCount[2]++,j++;if(j==maxJ)return NaN;for(;maxJ>j&&!image[j+centerI*qrcode.width]&&stateCount[3]<maxCount;)stateCount[3]++,j++;if(j==maxJ||stateCount[3]>=maxCount)return NaN;for(;maxJ>j&&image[j+centerI*qrcode.width]&&stateCount[4]<maxCount;)stateCount[4]++,j++;if(stateCount[4]>=maxCount)return NaN;var stateCountTotal=stateCount[0]+stateCount[1]+stateCount[2]+stateCount[3]+stateCount[4];return 5*Math.abs(stateCountTotal-originalStateCountTotal)>=originalStateCountTotal?NaN:this.foundPatternCross(stateCount)?this.centerFromEnd(stateCount,j):NaN},this.handlePossibleCenter=function(stateCount,i,j){var stateCountTotal=stateCount[0]+stateCount[1]+stateCount[2]+stateCount[3]+stateCount[4],centerJ=this.centerFromEnd(stateCount,j),centerI=this.crossCheckVertical(i,Math.floor(centerJ),stateCount[2],stateCountTotal);if(!isNaN(centerI)&&(centerJ=this.crossCheckHorizontal(Math.floor(centerJ),Math.floor(centerI),stateCount[2],stateCountTotal),!isNaN(centerJ))){for(var estimatedModuleSize=stateCountTotal/7,found=!1,max=this.possibleCenters.length,index=0;max>index;index++){var center=this.possibleCenters[index];if(center.aboutEquals(estimatedModuleSize,centerI,centerJ)){center.incrementCount(),found=!0;break}}if(!found){var point=new FinderPattern(centerJ,centerI,estimatedModuleSize);this.possibleCenters.push(point),null!=this.resultPointCallback&&this.resultPointCallback.foundPossibleResultPoint(point)}return!0}return!1},this.selectBestPatterns=function(){var startSize=this.possibleCenters.length;if(3>startSize)throw"Couldn't find enough finder patterns";if(startSize>3){for(var totalModuleSize=0,i=0;startSize>i;i++)totalModuleSize+=this.possibleCenters[i].EstimatedModuleSize;for(var average=totalModuleSize/startSize,i=0;i<this.possibleCenters.length&&this.possibleCenters.length>3;i++){var pattern=this.possibleCenters[i];Math.abs(pattern.EstimatedModuleSize-average)>.2*average&&(this.possibleCenters.remove(i),i--)}}return this.possibleCenters.Count>3,new Array(this.possibleCenters[0],this.possibleCenters[1],this.possibleCenters[2])},this.findRowSkip=function(){var max=this.possibleCenters.length;if(1>=max)return 0;for(var firstConfirmedCenter=null,i=0;max>i;i++){var center=this.possibleCenters[i];if(center.Count>=CENTER_QUORUM){if(null!=firstConfirmedCenter)return this.hasSkipped=!0,Math.floor((Math.abs(firstConfirmedCenter.X-center.X)-Math.abs(firstConfirmedCenter.Y-center.Y))/2);firstConfirmedCenter=center}}return 0},this.haveMultiplyConfirmedCenters=function(){for(var confirmedCount=0,totalModuleSize=0,max=this.possibleCenters.length,i=0;max>i;i++){var pattern=this.possibleCenters[i];pattern.Count>=CENTER_QUORUM&&(confirmedCount++,totalModuleSize+=pattern.EstimatedModuleSize)}if(3>confirmedCount)return!1;for(var average=totalModuleSize/max,totalDeviation=0,i=0;max>i;i++)pattern=this.possibleCenters[i],totalDeviation+=Math.abs(pattern.EstimatedModuleSize-average);return.05*totalModuleSize>=totalDeviation},this.findFinderPattern=function(image){var tryHarder=!1;this.image=image;var maxI=qrcode.height,maxJ=qrcode.width,iSkip=Math.floor(3*maxI/(4*MAX_MODULES));(MIN_SKIP>iSkip||tryHarder)&&(iSkip=MIN_SKIP);for(var done=!1,stateCount=new Array(5),i=iSkip-1;maxI>i&&!done;i+=iSkip){stateCount[0]=0,stateCount[1]=0,stateCount[2]=0,stateCount[3]=0,stateCount[4]=0;for(var currentState=0,j=0;maxJ>j;j++)if(image[j+i*qrcode.width])1==(1&currentState)&&currentState++,stateCount[currentState]++;else if(0==(1&currentState))if(4==currentState)if(this.foundPatternCross(stateCount)){var confirmed=this.handlePossibleCenter(stateCount,i,j);if(confirmed)if(iSkip=2,this.hasSkipped)done=this.haveMultiplyConfirmedCenters();else{var rowSkip=this.findRowSkip();rowSkip>stateCount[2]&&(i+=rowSkip-stateCount[2]-iSkip,j=maxJ-1)}else{do j++;while(maxJ>j&&!image[j+i*qrcode.width]);j--}currentState=0,stateCount[0]=0,stateCount[1]=0,stateCount[2]=0,stateCount[3]=0,stateCount[4]=0}else stateCount[0]=stateCount[2],stateCount[1]=stateCount[3],stateCount[2]=stateCount[4],stateCount[3]=1,stateCount[4]=0,currentState=3;else stateCount[++currentState]++;else stateCount[currentState]++;if(this.foundPatternCross(stateCount)){var confirmed=this.handlePossibleCenter(stateCount,i,maxJ);confirmed&&(iSkip=stateCount[0],this.hasSkipped&&(done=haveMultiplyConfirmedCenters()))}}var patternInfo=this.selectBestPatterns();return qrcode.orderBestPatterns(patternInfo),new FinderPatternInfo(patternInfo)}}function AlignmentPattern(posX,posY,estimatedModuleSize){this.x=posX,this.y=posY,this.count=1,this.estimatedModuleSize=estimatedModuleSize,this.__defineGetter__("EstimatedModuleSize",function(){return this.estimatedModuleSize}),this.__defineGetter__("Count",function(){return this.count}),this.__defineGetter__("X",function(){return Math.floor(this.x)}),this.__defineGetter__("Y",function(){return Math.floor(this.y)}),this.incrementCount=function(){this.count++},this.aboutEquals=function(moduleSize,i,j){if(Math.abs(i-this.y)<=moduleSize&&Math.abs(j-this.x)<=moduleSize){var moduleSizeDiff=Math.abs(moduleSize-this.estimatedModuleSize);return 1>=moduleSizeDiff||moduleSizeDiff/this.estimatedModuleSize<=1}return!1}}function AlignmentPatternFinder(image,startX,startY,width,height,moduleSize,resultPointCallback){this.image=image,this.possibleCenters=new Array,this.startX=startX,this.startY=startY,this.width=width,this.height=height,this.moduleSize=moduleSize,this.crossCheckStateCount=new Array(0,0,0),this.resultPointCallback=resultPointCallback,this.centerFromEnd=function(stateCount,end){return end-stateCount[2]-stateCount[1]/2},this.foundPatternCross=function(stateCount){for(var moduleSize=this.moduleSize,maxVariance=moduleSize/2,i=0;3>i;i++)if(Math.abs(moduleSize-stateCount[i])>=maxVariance)return!1;return!0},this.crossCheckVertical=function(startI,centerJ,maxCount,originalStateCountTotal){var image=this.image,maxI=qrcode.height,stateCount=this.crossCheckStateCount;stateCount[0]=0,stateCount[1]=0,stateCount[2]=0;for(var i=startI;i>=0&&image[centerJ+i*qrcode.width]&&stateCount[1]<=maxCount;)stateCount[1]++,i--;if(0>i||stateCount[1]>maxCount)return NaN;for(;i>=0&&!image[centerJ+i*qrcode.width]&&stateCount[0]<=maxCount;)stateCount[0]++,i--;if(stateCount[0]>maxCount)return NaN;for(i=startI+1;maxI>i&&image[centerJ+i*qrcode.width]&&stateCount[1]<=maxCount;)stateCount[1]++,i++;if(i==maxI||stateCount[1]>maxCount)return NaN;for(;maxI>i&&!image[centerJ+i*qrcode.width]&&stateCount[2]<=maxCount;)stateCount[2]++,i++;if(stateCount[2]>maxCount)return NaN;var stateCountTotal=stateCount[0]+stateCount[1]+stateCount[2];return 5*Math.abs(stateCountTotal-originalStateCountTotal)>=2*originalStateCountTotal?NaN:this.foundPatternCross(stateCount)?this.centerFromEnd(stateCount,i):NaN},this.handlePossibleCenter=function(stateCount,i,j){var stateCountTotal=stateCount[0]+stateCount[1]+stateCount[2],centerJ=this.centerFromEnd(stateCount,j),centerI=this.crossCheckVertical(i,Math.floor(centerJ),2*stateCount[1],stateCountTotal);if(!isNaN(centerI)){for(var estimatedModuleSize=(stateCount[0]+stateCount[1]+stateCount[2])/3,max=this.possibleCenters.length,index=0;max>index;index++){var center=this.possibleCenters[index];if(center.aboutEquals(estimatedModuleSize,centerI,centerJ))return new AlignmentPattern(centerJ,centerI,estimatedModuleSize)}var point=new AlignmentPattern(centerJ,centerI,estimatedModuleSize);this.possibleCenters.push(point),null!=this.resultPointCallback&&this.resultPointCallback.foundPossibleResultPoint(point)}return null},this.find=function(){for(var startX=this.startX,height=this.height,maxJ=startX+width,middleI=startY+(height>>1),stateCount=new Array(0,0,0),iGen=0;height>iGen;iGen++){var i=middleI+(0==(1&iGen)?iGen+1>>1:-(iGen+1>>1));stateCount[0]=0,stateCount[1]=0,stateCount[2]=0;for(var j=startX;maxJ>j&&!image[j+qrcode.width*i];)j++;for(var currentState=0;maxJ>j;){if(image[j+i*qrcode.width])if(1==currentState)stateCount[currentState]++;else if(2==currentState){if(this.foundPatternCross(stateCount)){var confirmed=this.handlePossibleCenter(stateCount,i,j);if(null!=confirmed)return confirmed}stateCount[0]=stateCount[2],stateCount[1]=1,stateCount[2]=0,currentState=1}else stateCount[++currentState]++;else 1==currentState&&currentState++,stateCount[currentState]++;j++}if(this.foundPatternCross(stateCount)){var confirmed=this.handlePossibleCenter(stateCount,i,maxJ);if(null!=confirmed)return confirmed}}if(0!=this.possibleCenters.length)return this.possibleCenters[0];throw"Couldn't find enough alignment patterns"}}function QRCodeDataBlockReader(blocks,version,numErrorCorrectionCode){this.blockPointer=0,this.bitPointer=7,this.dataLength=0,this.blocks=blocks,this.numErrorCorrectionCode=numErrorCorrectionCode,9>=version?this.dataLengthMode=0:version>=10&&26>=version?this.dataLengthMode=1:version>=27&&40>=version&&(this.dataLengthMode=2),this.getNextBits=function(numBits){var bits=0;if(numBits<this.bitPointer+1){for(var mask=0,i=0;numBits>i;i++)mask+=1<<i;return mask<<=this.bitPointer-numBits+1,bits=(this.blocks[this.blockPointer]&mask)>>this.bitPointer-numBits+1,this.bitPointer-=numBits,bits}if(numBits<this.bitPointer+1+8){for(var mask1=0,i=0;i<this.bitPointer+1;i++)mask1+=1<<i;return bits=(this.blocks[this.blockPointer]&mask1)<<numBits-(this.bitPointer+1),this.blockPointer++,bits+=this.blocks[this.blockPointer]>>8-(numBits-(this.bitPointer+1)),this.bitPointer=this.bitPointer-numBits%8,this.bitPointer<0&&(this.bitPointer=8+this.bitPointer),bits}if(numBits<this.bitPointer+1+16){for(var mask1=0,mask3=0,i=0;i<this.bitPointer+1;i++)mask1+=1<<i;var bitsFirstBlock=(this.blocks[this.blockPointer]&mask1)<<numBits-(this.bitPointer+1);this.blockPointer++;var bitsSecondBlock=this.blocks[this.blockPointer]<<numBits-(this.bitPointer+1+8);this.blockPointer++;for(var i=0;i<numBits-(this.bitPointer+1+8);i++)mask3+=1<<i;mask3<<=8-(numBits-(this.bitPointer+1+8));var bitsThirdBlock=(this.blocks[this.blockPointer]&mask3)>>8-(numBits-(this.bitPointer+1+8));return bits=bitsFirstBlock+bitsSecondBlock+bitsThirdBlock,this.bitPointer=this.bitPointer-(numBits-8)%8,this.bitPointer<0&&(this.bitPointer=8+this.bitPointer),bits}return 0},this.NextMode=function(){return this.blockPointer>this.blocks.length-this.numErrorCorrectionCode-2?0:this.getNextBits(4)},this.getDataLength=function(modeIndicator){for(var index=0;;){if(modeIndicator>>index==1)break;index++}return this.getNextBits(qrcode.sizeOfDataLengthInfo[this.dataLengthMode][index])},this.getRomanAndFigureString=function(dataLength){var length=dataLength,intData=0,strData="",tableRomanAndFigure=new Array("0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":");do if(length>1){intData=this.getNextBits(11);var firstLetter=Math.floor(intData/45),secondLetter=intData%45;strData+=tableRomanAndFigure[firstLetter],strData+=tableRomanAndFigure[secondLetter],length-=2}else 1==length&&(intData=this.getNextBits(6),strData+=tableRomanAndFigure[intData],length-=1);while(length>0);return strData},this.getFigureString=function(dataLength){var length=dataLength,intData=0,strData="";do length>=3?(intData=this.getNextBits(10),100>intData&&(strData+="0"),10>intData&&(strData+="0"),length-=3):2==length?(intData=this.getNextBits(7),10>intData&&(strData+="0"),length-=2):1==length&&(intData=this.getNextBits(4),length-=1),strData+=intData;while(length>0);return strData},this.get8bitByteArray=function(dataLength){var length=dataLength,intData=0,output=new Array;do intData=this.getNextBits(8),output.push(intData),length--;while(length>0);return output},this.getKanjiString=function(dataLength){var length=dataLength,intData=0,unicodeString="";do{intData=getNextBits(13);var lowerByte=intData%192,higherByte=intData/192,tempWord=(higherByte<<8)+lowerByte,shiftjisWord=0;shiftjisWord=40956>=tempWord+33088?tempWord+33088:tempWord+49472,unicodeString+=String.fromCharCode(shiftjisWord),length--}while(length>0);return unicodeString},this.__defineGetter__("DataByte",function(){for(var output=new Array,MODE_NUMBER=1,MODE_ROMAN_AND_NUMBER=2,MODE_8BIT_BYTE=4,MODE_KANJI=8;;){var mode=this.NextMode();if(0==mode){if(output.length>0)break;throw"Empty data block"}if(mode!=MODE_NUMBER&&mode!=MODE_ROMAN_AND_NUMBER&&mode!=MODE_8BIT_BYTE&&mode!=MODE_KANJI)throw"Invalid mode: "+mode+" in (block:"+this.blockPointer+" bit:"+this.bitPointer+")";if(dataLength=this.getDataLength(mode),dataLength<1)throw"Invalid data length: "+dataLength;switch(mode){case MODE_NUMBER:for(var temp_str=this.getFigureString(dataLength),ta=new Array(temp_str.length),j=0;j<temp_str.length;j++)ta[j]=temp_str.charCodeAt(j);output.push(ta);break;case MODE_ROMAN_AND_NUMBER:for(var temp_str=this.getRomanAndFigureString(dataLength),ta=new Array(temp_str.length),j=0;j<temp_str.length;j++)ta[j]=temp_str.charCodeAt(j);output.push(ta);break;case MODE_8BIT_BYTE:var temp_sbyteArray3=this.get8bitByteArray(dataLength);output.push(temp_sbyteArray3);break;case MODE_KANJI:var temp_str=this.getKanjiString(dataLength);output.push(temp_str)}}return output})}GridSampler={},GridSampler.checkAndNudgePoints=function(image,points){for(var width=qrcode.width,height=qrcode.height,nudged=!0,offset=0;offset<points.Length&&nudged;offset+=2){var x=Math.floor(points[offset]),y=Math.floor(points[offset+1]);if(-1>x||x>width||-1>y||y>height)throw"Error.checkAndNudgePoints ";nudged=!1,-1==x?(points[offset]=0,nudged=!0):x==width&&(points[offset]=width-1,nudged=!0),-1==y?(points[offset+1]=0,nudged=!0):y==height&&(points[offset+1]=height-1,nudged=!0)}nudged=!0;for(var offset=points.Length-2;offset>=0&&nudged;offset-=2){var x=Math.floor(points[offset]),y=Math.floor(points[offset+1]);if(-1>x||x>width||-1>y||y>height)throw"Error.checkAndNudgePoints ";nudged=!1,-1==x?(points[offset]=0,nudged=!0):x==width&&(points[offset]=width-1,nudged=!0),-1==y?(points[offset+1]=0,nudged=!0):y==height&&(points[offset+1]=height-1,nudged=!0)}},GridSampler.sampleGrid3=function(image,dimension,transform){for(var bits=new BitMatrix(dimension),points=new Array(dimension<<1),y=0;dimension>y;y++){for(var max=points.length,iValue=y+.5,x=0;max>x;x+=2)points[x]=(x>>1)+.5,points[x+1]=iValue;transform.transformPoints1(points),GridSampler.checkAndNudgePoints(image,points);try{for(var x=0;max>x;x+=2){var xpoint=4*Math.floor(points[x])+Math.floor(points[x+1])*qrcode.width*4,bit=image[Math.floor(points[x])+qrcode.width*Math.floor(points[x+1])];qrcode.imagedata.data[xpoint]=bit?255:0,qrcode.imagedata.data[xpoint+1]=bit?255:0,qrcode.imagedata.data[xpoint+2]=0,qrcode.imagedata.data[xpoint+3]=255,bit&&bits.set_Renamed(x>>1,y)}}catch(aioobe){throw"Error.checkAndNudgePoints"}}return bits},GridSampler.sampleGridx=function(image,dimension,p1ToX,p1ToY,p2ToX,p2ToY,p3ToX,p3ToY,p4ToX,p4ToY,p1FromX,p1FromY,p2FromX,p2FromY,p3FromX,p3FromY,p4FromX,p4FromY){var transform=PerspectiveTransform.quadrilateralToQuadrilateral(p1ToX,p1ToY,p2ToX,p2ToY,p3ToX,p3ToY,p4ToX,p4ToY,p1FromX,p1FromY,p2FromX,p2FromY,p3FromX,p3FromY,p4FromX,p4FromY);return GridSampler.sampleGrid3(image,dimension,transform)},Version.VERSION_DECODE_INFO=new Array(31892,34236,39577,42195,48118,51042,55367,58893,63784,68472,70749,76311,79154,84390,87683,92361,96236,102084,102881,110507,110734,117786,119615,126325,127568,133589,136944,141498,145311,150283,152622,158308,161089,167017),Version.VERSIONS=buildVersions(),Version.getVersionForNumber=function(versionNumber){if(1>versionNumber||versionNumber>40)throw"ArgumentException";return Version.VERSIONS[versionNumber-1]},Version.getProvisionalVersionForDimension=function(dimension){if(dimension%4!=1)throw"Error getProvisionalVersionForDimension";try{return Version.getVersionForNumber(dimension-17>>2)}catch(iae){throw"Error getVersionForNumber"}},Version.decodeVersionInformation=function(versionBits){for(var bestDifference=4294967295,bestVersion=0,i=0;i<Version.VERSION_DECODE_INFO.length;i++){var targetVersion=Version.VERSION_DECODE_INFO[i];if(targetVersion==versionBits)return this.getVersionForNumber(i+7);var bitsDifference=FormatInformation.numBitsDiffering(versionBits,targetVersion);bestDifference>bitsDifference&&(bestVersion=i+7,bestDifference=bitsDifference)}return 3>=bestDifference?this.getVersionForNumber(bestVersion):null},PerspectiveTransform.quadrilateralToQuadrilateral=function(x0,y0,x1,y1,x2,y2,x3,y3,x0p,y0p,x1p,y1p,x2p,y2p,x3p,y3p){var qToS=this.quadrilateralToSquare(x0,y0,x1,y1,x2,y2,x3,y3),sToQ=this.squareToQuadrilateral(x0p,y0p,x1p,y1p,x2p,y2p,x3p,y3p);return sToQ.times(qToS)},PerspectiveTransform.squareToQuadrilateral=function(x0,y0,x1,y1,x2,y2,x3,y3){return dy2=y3-y2,dy3=y0-y1+y2-y3,0==dy2&&0==dy3?new PerspectiveTransform(x1-x0,x2-x1,x0,y1-y0,y2-y1,y0,0,0,1):(dx1=x1-x2,dx2=x3-x2,dx3=x0-x1+x2-x3,dy1=y1-y2,denominator=dx1*dy2-dx2*dy1,a13=(dx3*dy2-dx2*dy3)/denominator,a23=(dx1*dy3-dx3*dy1)/denominator,new PerspectiveTransform(x1-x0+a13*x1,x3-x0+a23*x3,x0,y1-y0+a13*y1,y3-y0+a23*y3,y0,a13,a23,1))},PerspectiveTransform.quadrilateralToSquare=function(x0,y0,x1,y1,x2,y2,x3,y3){return this.squareToQuadrilateral(x0,y0,x1,y1,x2,y2,x3,y3).buildAdjoint()};var FORMAT_INFO_MASK_QR=21522,FORMAT_INFO_DECODE_LOOKUP=new Array(new Array(21522,0),new Array(20773,1),new Array(24188,2),new Array(23371,3),new Array(17913,4),new Array(16590,5),new Array(20375,6),new Array(19104,7),new Array(30660,8),new Array(29427,9),new Array(32170,10),new Array(30877,11),new Array(26159,12),new Array(25368,13),new Array(27713,14),new Array(26998,15),new Array(5769,16),new Array(5054,17),new Array(7399,18),new Array(6608,19),new Array(1890,20),new Array(597,21),new Array(3340,22),new Array(2107,23),new Array(13663,24),new Array(12392,25),new Array(16177,26),new Array(14854,27),new Array(9396,28),new Array(8579,29),new Array(11994,30),new Array(11245,31)),BITS_SET_IN_HALF_BYTE=new Array(0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4);FormatInformation.numBitsDiffering=function(a,b){return a^=b,BITS_SET_IN_HALF_BYTE[15&a]+BITS_SET_IN_HALF_BYTE[15&URShift(a,4)]+BITS_SET_IN_HALF_BYTE[15&URShift(a,8)]+BITS_SET_IN_HALF_BYTE[15&URShift(a,12)]+BITS_SET_IN_HALF_BYTE[15&URShift(a,16)]+BITS_SET_IN_HALF_BYTE[15&URShift(a,20)]+BITS_SET_IN_HALF_BYTE[15&URShift(a,24)]+BITS_SET_IN_HALF_BYTE[15&URShift(a,28)]},FormatInformation.decodeFormatInformation=function(maskedFormatInfo){var formatInfo=FormatInformation.doDecodeFormatInformation(maskedFormatInfo);return null!=formatInfo?formatInfo:FormatInformation.doDecodeFormatInformation(maskedFormatInfo^FORMAT_INFO_MASK_QR)},FormatInformation.doDecodeFormatInformation=function(maskedFormatInfo){for(var bestDifference=4294967295,bestFormatInfo=0,i=0;i<FORMAT_INFO_DECODE_LOOKUP.length;i++){var decodeInfo=FORMAT_INFO_DECODE_LOOKUP[i],targetInfo=decodeInfo[0];if(targetInfo==maskedFormatInfo)return new FormatInformation(decodeInfo[1]);var bitsDifference=this.numBitsDiffering(maskedFormatInfo,targetInfo);bestDifference>bitsDifference&&(bestFormatInfo=decodeInfo[1],bestDifference=bitsDifference)}return 3>=bestDifference?new FormatInformation(bestFormatInfo):null},ErrorCorrectionLevel.forBits=function(bits){if(0>bits||bits>=FOR_BITS.Length)throw"ArgumentException";return FOR_BITS[bits]};var L=new ErrorCorrectionLevel(0,1,"L"),M=new ErrorCorrectionLevel(1,0,"M"),Q=new ErrorCorrectionLevel(2,3,"Q"),H=new ErrorCorrectionLevel(3,2,"H"),FOR_BITS=new Array(M,L,H,Q);DataBlock.getDataBlocks=function(rawCodewords,version,ecLevel){if(rawCodewords.length!=version.TotalCodewords)throw"ArgumentException";for(var ecBlocks=version.getECBlocksForLevel(ecLevel),totalBlocks=0,ecBlockArray=ecBlocks.getECBlocks(),i=0;i<ecBlockArray.length;i++)totalBlocks+=ecBlockArray[i].Count;for(var result=new Array(totalBlocks),numResultBlocks=0,j=0;j<ecBlockArray.length;j++)for(var ecBlock=ecBlockArray[j],i=0;i<ecBlock.Count;i++){var numDataCodewords=ecBlock.DataCodewords,numBlockCodewords=ecBlocks.ECCodewordsPerBlock+numDataCodewords;result[numResultBlocks++]=new DataBlock(numDataCodewords,new Array(numBlockCodewords))}for(var shorterBlocksTotalCodewords=result[0].codewords.length,longerBlocksStartAt=result.length-1;longerBlocksStartAt>=0;){var numCodewords=result[longerBlocksStartAt].codewords.length;if(numCodewords==shorterBlocksTotalCodewords)break;longerBlocksStartAt--}longerBlocksStartAt++;for(var shorterBlocksNumDataCodewords=shorterBlocksTotalCodewords-ecBlocks.ECCodewordsPerBlock,rawCodewordsOffset=0,i=0;shorterBlocksNumDataCodewords>i;i++)for(var j=0;numResultBlocks>j;j++)result[j].codewords[i]=rawCodewords[rawCodewordsOffset++];for(var j=longerBlocksStartAt;numResultBlocks>j;j++)result[j].codewords[shorterBlocksNumDataCodewords]=rawCodewords[rawCodewordsOffset++];for(var max=result[0].codewords.length,i=shorterBlocksNumDataCodewords;max>i;i++)for(var j=0;numResultBlocks>j;j++){var iOffset=longerBlocksStartAt>j?i:i+1;result[j].codewords[iOffset]=rawCodewords[rawCodewordsOffset++]}return result},DataMask={},DataMask.forReference=function(reference){if(0>reference||reference>7)throw"System.ArgumentException";return DataMask.DATA_MASKS[reference]},DataMask.DATA_MASKS=new Array(new DataMask000,new DataMask001,new DataMask010,new DataMask011,new DataMask100,new DataMask101,new DataMask110,new DataMask111),GF256.QR_CODE_FIELD=new GF256(285),GF256.DATA_MATRIX_FIELD=new GF256(301),GF256.addOrSubtract=function(a,b){return a^b},Decoder={},Decoder.rsDecoder=new ReedSolomonDecoder(GF256.QR_CODE_FIELD),Decoder.correctErrors=function(codewordBytes,numDataCodewords){for(var numCodewords=codewordBytes.length,codewordsInts=new Array(numCodewords),i=0;numCodewords>i;i++)codewordsInts[i]=255&codewordBytes[i];var numECCodewords=codewordBytes.length-numDataCodewords;try{Decoder.rsDecoder.decode(codewordsInts,numECCodewords)}catch(rse){throw rse}for(var i=0;numDataCodewords>i;i++)codewordBytes[i]=codewordsInts[i]},Decoder.decode=function(bits){for(var parser=new BitMatrixParser(bits),version=parser.readVersion(),ecLevel=parser.readFormatInformation().ErrorCorrectionLevel,codewords=parser.readCodewords(),dataBlocks=DataBlock.getDataBlocks(codewords,version,ecLevel),totalBytes=0,i=0;i<dataBlocks.Length;i++)totalBytes+=dataBlocks[i].NumDataCodewords;for(var resultBytes=new Array(totalBytes),resultOffset=0,j=0;j<dataBlocks.length;j++){var dataBlock=dataBlocks[j],codewordBytes=dataBlock.Codewords,numDataCodewords=dataBlock.NumDataCodewords;Decoder.correctErrors(codewordBytes,numDataCodewords);for(var i=0;numDataCodewords>i;i++)resultBytes[resultOffset++]=codewordBytes[i]}var reader=new QRCodeDataBlockReader(resultBytes,version.VersionNumber,ecLevel.Bits);return reader},qrcode={},qrcode.imagedata=null,qrcode.width=0,qrcode.height=0,qrcode.qrCodeSymbol=null,qrcode.debug=!1,qrcode.sizeOfDataLengthInfo=[[10,9,8,8],[12,11,16,10],[14,13,16,12]],qrcode.callback=null,qrcode.decode=function(src){if(0==arguments.length){var canvas_qr=document.getElementById("qr-canvas"),context=canvas_qr.getContext("2d");return qrcode.width=canvas_qr.width,qrcode.height=canvas_qr.height,qrcode.imagedata=context.getImageData(0,0,qrcode.width,qrcode.height),qrcode.result=qrcode.process(context),null!=qrcode.callback&&qrcode.callback(qrcode.result),qrcode.result}var image=new Image;image.onload=function(){var canvas_qr=document.createElement("canvas"),context=canvas_qr.getContext("2d"),canvas_out=document.getElementById("out-canvas");if(null!=canvas_out){var outctx=canvas_out.getContext("2d");outctx.clearRect(0,0,320,240),outctx.drawImage(image,0,0,320,240)}canvas_qr.width=image.width,canvas_qr.height=image.height,context.drawImage(image,0,0),qrcode.width=image.width,qrcode.height=image.height;try{qrcode.imagedata=context.getImageData(0,0,image.width,image.height)}catch(e){return qrcode.result="Cross domain image reading not supported in your browser! Save it to your computer then drag and drop the file!",void(null!=qrcode.callback&&qrcode.callback(qrcode.result))}try{qrcode.result=qrcode.process(context)}catch(e){console.log(e),qrcode.result="error decoding QR Code"}null!=qrcode.callback&&qrcode.callback(qrcode.result)},image.src=src},qrcode.decode_utf8=function(s){return decodeURIComponent(escape(s))},qrcode.process=function(ctx){var start=(new Date).getTime(),image=qrcode.grayScaleToBitmap(qrcode.grayscale());if(qrcode.debug){for(var y=0;y<qrcode.height;y++)for(var x=0;x<qrcode.width;x++){var point=4*x+y*qrcode.width*4;qrcode.imagedata.data[point]=(image[x+y*qrcode.width],0),qrcode.imagedata.data[point+1]=(image[x+y*qrcode.width],0),qrcode.imagedata.data[point+2]=image[x+y*qrcode.width]?255:0}ctx.putImageData(qrcode.imagedata,0,0)}var detector=new Detector(image),qRCodeMatrix=detector.detect();qrcode.debug&&ctx.putImageData(qrcode.imagedata,0,0);for(var reader=Decoder.decode(qRCodeMatrix.bits),data=reader.DataByte,str="",i=0;i<data.length;i++)for(var j=0;j<data[i].length;j++)str+=String.fromCharCode(data[i][j]);var end=(new Date).getTime(),time=end-start;return console.log(time),qrcode.decode_utf8(str)},qrcode.getPixel=function(x,y){if(qrcode.width<x)throw"point error";if(qrcode.height<y)throw"point error";return point=4*x+y*qrcode.width*4,p=(33*qrcode.imagedata.data[point]+34*qrcode.imagedata.data[point+1]+33*qrcode.imagedata.data[point+2])/100,p},qrcode.binarize=function(th){for(var ret=new Array(qrcode.width*qrcode.height),y=0;y<qrcode.height;y++)for(var x=0;x<qrcode.width;x++){var gray=qrcode.getPixel(x,y);ret[x+y*qrcode.width]=th>=gray?!0:!1}return ret},qrcode.getMiddleBrightnessPerArea=function(image){for(var numSqrtArea=4,areaWidth=Math.floor(qrcode.width/numSqrtArea),areaHeight=Math.floor(qrcode.height/numSqrtArea),minmax=new Array(numSqrtArea),i=0;numSqrtArea>i;i++){minmax[i]=new Array(numSqrtArea);for(var i2=0;numSqrtArea>i2;i2++)minmax[i][i2]=new Array(0,0)}for(var ay=0;numSqrtArea>ay;ay++)for(var ax=0;numSqrtArea>ax;ax++){minmax[ax][ay][0]=255;for(var dy=0;areaHeight>dy;dy++)for(var dx=0;areaWidth>dx;dx++){var target=image[areaWidth*ax+dx+(areaHeight*ay+dy)*qrcode.width];target<minmax[ax][ay][0]&&(minmax[ax][ay][0]=target),target>minmax[ax][ay][1]&&(minmax[ax][ay][1]=target)}}for(var middle=new Array(numSqrtArea),i3=0;numSqrtArea>i3;i3++)middle[i3]=new Array(numSqrtArea);for(var ay=0;numSqrtArea>ay;ay++)for(var ax=0;numSqrtArea>ax;ax++)middle[ax][ay]=Math.floor((minmax[ax][ay][0]+minmax[ax][ay][1])/2);return middle},qrcode.grayScaleToBitmap=function(grayScale){for(var middle=qrcode.getMiddleBrightnessPerArea(grayScale),sqrtNumArea=middle.length,areaWidth=Math.floor(qrcode.width/sqrtNumArea),areaHeight=Math.floor(qrcode.height/sqrtNumArea),bitmap=new Array(qrcode.height*qrcode.width),ay=0;sqrtNumArea>ay;ay++)for(var ax=0;sqrtNumArea>ax;ax++)for(var dy=0;areaHeight>dy;dy++)for(var dx=0;areaWidth>dx;dx++)bitmap[areaWidth*ax+dx+(areaHeight*ay+dy)*qrcode.width]=grayScale[areaWidth*ax+dx+(areaHeight*ay+dy)*qrcode.width]<middle[ax][ay]?!0:!1;
    return bitmap},qrcode.grayscale=function(){for(var ret=new Array(qrcode.width*qrcode.height),y=0;y<qrcode.height;y++)for(var x=0;x<qrcode.width;x++){var gray=qrcode.getPixel(x,y);ret[x+y*qrcode.width]=gray}return ret},Array.prototype.remove=function(from,to){var rest=this.slice((to||from)+1||this.length);return this.length=0>from?this.length+from:from,this.push.apply(this,rest)};var MIN_SKIP=3,MAX_MODULES=57,INTEGER_MATH_SHIFT=8,CENTER_QUORUM=2;qrcode.orderBestPatterns=function(patterns){function distance(pattern1,pattern2){return xDiff=pattern1.X-pattern2.X,yDiff=pattern1.Y-pattern2.Y,Math.sqrt(xDiff*xDiff+yDiff*yDiff)}function crossProductZ(pointA,pointB,pointC){var bX=pointB.x,bY=pointB.y;return(pointC.x-bX)*(pointA.y-bY)-(pointC.y-bY)*(pointA.x-bX)}var pointA,pointB,pointC,zeroOneDistance=distance(patterns[0],patterns[1]),oneTwoDistance=distance(patterns[1],patterns[2]),zeroTwoDistance=distance(patterns[0],patterns[2]);if(oneTwoDistance>=zeroOneDistance&&oneTwoDistance>=zeroTwoDistance?(pointB=patterns[0],pointA=patterns[1],pointC=patterns[2]):zeroTwoDistance>=oneTwoDistance&&zeroTwoDistance>=zeroOneDistance?(pointB=patterns[1],pointA=patterns[0],pointC=patterns[2]):(pointB=patterns[2],pointA=patterns[0],pointC=patterns[1]),crossProductZ(pointA,pointB,pointC)<0){var temp=pointA;pointA=pointC,pointC=temp}patterns[0]=pointA,patterns[1]=pointB,patterns[2]=pointC};
angular.module('reg')
  .factory('AuthService', [
    '$http',
    '$rootScope',
    '$state',
    '$window',
    'Session',
    function($http, $rootScope, $state, $window, Session) {
      var authService = {};

      function loginSuccess(data, cb, volunteer){
        // Winner winner you get a token
        if(!volunteer) {Session.create(data.token, data.user);}

        if (cb){
          cb(data.user);
        }
      }

      function loginFailure(data, cb, volunteer){
        if(!volunteer) {$state.go('home');}
        if (cb) {
          cb(data);
        }
      }

      authService.loginWithPassword = function(email, password, onSuccess, onFailure) {
        return $http
          .post('/auth/login', {
            email: email,
            password: password
          })
          .then(response => {
            loginSuccess(response.data, onSuccess);
          }, response => {
            loginFailure(response.data, onFailure);
          });
      };

      authService.loginWithToken = function(token, onSuccess, onFailure){
        return $http
          .post('/auth/login', {
            token: token
          })
          .then(response => {
            loginSuccess(response.data, onSuccess);
          }, response => {
            if (response.status === 400) {
              Session.destroy(loginFailure);
            }
          });
      };

      authService.logout = function(callback) {
        // Clear the session
        Session.destroy(callback);
        $state.go('home');
      };

      authService.register = function(email, password, onSuccess, onFailure ,volunteer) {
        return $http
          .post('/auth/register', {
            email: email,
            password: password,
            volunteer: volunteer,
          })
          .then(response => {
            loginSuccess(response.data, onSuccess, volunteer);
          }, response => {
            loginFailure(response.data, onFailure, volunteer);
          });
      };

      authService.verify = function(token, onSuccess, onFailure) {
        return $http
          .get('/auth/verify/' + token)
          .then(response => {
            Session.setUser(response.data);
            if (onSuccess) {
              onSuccess(response.data);
            }
          }, response => {
            if (onFailure) {
              onFailure(response.data);
            }
          });
      };

      authService.resendVerificationEmail = function(onSuccess, onFailure){
        return $http
          .post('/auth/verify/resend', {
            id: Session.getUserId()
          });
      };

      authService.sendResetEmail = function(email){
        return $http
          .post('/auth/reset', {
            email: email
          });
      };

      authService.resetPassword = function(token, pass, onSuccess, onFailure){
        return $http
          .post('/auth/reset/password', {
            token: token,
            password: pass
          })
          .then(onSuccess, onFailure);
      };

      return authService;
    }
  ]);

angular.module('reg').factory("ChallengeService", [
    "$http",
    function($http) {
      var challenges = "/api/challenges";
      var base = challenges + "/";
  
      return {
        // ----------------------
        // Basic Actions
        // ----------------------

        create: function(cData) {
            return $http.post(challenges + "/create", {
              cData: cData
            });
          },


        update: function(id, cData) {
            return $http.post(base + id + "/update", {
              cData: cData
            });
          },


        remove: function(id) {
            return $http.post(base + id + "/remove");
        },

        get: function(id) {
            return $http.get(base + id);
        },
        
        getAll: function() {
            return $http.get(base);
        },

        getAnswer: function(id) {
          return $http.get(base + id + "/answer");
        },

  
      };
    }
  ]);
  
angular.module('reg').factory("MarketingService", [
    "$http",
    function($http) {
      var marketing = "/api/marketing";
      var base = marketing + "/";
  
      return {
        // ----------------------
        // Basic Actions
        // ----------------------

        createTeam: function(teamData) {
            return $http.post(marketing + "/createTeam", {
              teamData: teamData
            });
          },
        
        getAll: function() {
            return $http.get(base);
        },

        sendFriendInvite: function(username,teammate){
          return $http.post(marketing + "/sendInvite", {
            username: username,
            teammate: teammate
          });
        }
  
      };
    }
  ]);
  
angular.module('reg') 
  .factory('SettingsService', [
  '$http',
  function($http){

    var base = '/api/settings/';

    return {
      getPublicSettings: function(){
        return $http.get(base);
      },
      updateRegistrationTimes: function(open, close){
        return $http.put(base + 'times', {
          timeOpen: open,
          timeClose: close,
        });
      },
      updateConfirmationTime: function(time){
        return $http.put(base + 'confirm-by', {
          time: time
        });
      },
      updateStartTime: function(time){
        return $http.put(base + 'timeStart', {
          time: time
        });
      },
      getWhitelistedEmails: function(){
        return $http.get(base + 'whitelist');
      },
      updateWhitelistedEmails: function(emails){
        return $http.put(base + 'whitelist', {
          emails: emails
        });
      },
      updateWaitlistText: function(text){
        return $http.put(base + 'waitlist', {
          text: text
        });
      },
      updateAcceptanceText: function(text){
        return $http.put(base + 'acceptance', {
          text: text
        });
      },

      updateHostSchool: function(hostSchool){
        return $http.put(base + 'hostSchool', {
          hostSchool: hostSchool
        });
      },

      updateConfirmationText: function(text){
        return $http.put(base + 'confirmation', {
          text: text
        });
      },
      updateAllowMinors: function(allowMinors){
        return $http.put(base + 'minors', { 
          allowMinors: allowMinors 
        });
      },
    };

  }
  ]);

angular.module('reg').factory("SolvedCTFService", [
    "$http",
    function($http) {
      var CTF = "/api/CTF";
      var base = CTF + "/";
  

      return {
        // ----------------------
        // Basic Actions
        // ----------------------

        solve: function(challenge, user, answer, onSuccess, onFailure) {
            return $http.post(CTF + "/solve", {
                challenge: challenge, 
                user : user,
                answer : answer,
            })
            .then(response => {
              onSuccess(challenge);
            }, response => {
              onFailure(response.data);
            });
          },
        
        getAll: function() {
            return $http.get(CTF);
        },
    
      };
    }
  ]);
  
angular.module('reg').factory("TeamService", [
    "$http",
    function($http) {
      var teams = "/api/teams";
      var base = teams + "/";
  
      return {
        // ----------------------
        // Basic Actions
        // ----------------------

        create: function(teamData) {
            return $http.post(teams + "/create", {
              teamData: teamData
            });
        },

        getAll: function() {
          return $http.get(base);
        },

        update: function(id, cData) {
          return $http.post(base + id + "/update", {
            cData: cData
          });
        },

        join: function(id, newuser) {
          return $http.post(base + id + "/updatejoined", {
            newjoinRequest: newuser
          });
        },

        removejoin: function(id, index, user) {
          return $http.get(base + id)
          .then(team => {
            team.data.joinRequests.splice(index, 1);
            if (!(user==false)){
              $http.post(teams + "/sendRefusedTeam", {
                id: user.id,
              });
            }
            return $http.post(base + id + "/updatejoined", {
              newjoinRequests: team.data.joinRequests
            });
          })
        },

        acceptMember: function(id, newuser,maxTeamSize) {
          return $http.get(base + id)
          .then(team => {
            if (team.data.members.length>=maxTeamSize){ return 'maxTeamSize' }

            team.data.members.push(newuser)
            $http.post(teams + "/sendAcceptedTeam", {
              id: newuser.id,
            });
            return $http.post(base + id + "/updateMembers", {
              newMembers: team.data.members,
            });
          })
        },

        removemember: function(id, index, userID) {
          return $http.get(base + id)
          .then(team => {
            var removedUser = team.data.members[index]
            if (index==0){return "removingAdmin"}
            team.data.members.splice(index, 1);
            if (!userID){
              $http.post(teams + "/sendAdminRemovedTeam", {
                id: team.data.members[0].id,
                member: removedUser.name
              });  
            }else{
              $http.post(teams + "/sendRemovedTeam", {
                id: userID,
              });  
            }
            return $http.post(base + id + "/updateMembers", {
              newMembers: team.data.members,
            });
          })
        },


        remove: function(id) {
            return $http.post(base + id + "/remove");
        },

        get: function(id) {
          return $http.get(base + id);
        },
        
        toggleCloseTeam: function(id, status) {
          return $http.post(base + id + "/toggleCloseTeam", {
            status: status
          });
        },

        toggleHideTeam: function(id, status) {
          return $http.post(base + id + "/toggleHideTeam", {
            status: status
          });
        },

        getSelectedTeams: function(text,skillsFilters) {
          return $http.get( teams + "?" + $.param({
                text: text,
                search: true,
                skillsFilters: skillsFilters ? skillsFilters : {}
              })
          );
        }, 
  


      };
    }
  ]);
  
angular.module("reg").factory("UserService", [
  "$http",
  "Session",
  function($http, Session) {
    var users = "/api/users";
    var base = users + "/";

    return {
      // ----------------------
      // Basic Actions
      // ----------------------
      getCurrentUser: function() {
        return $http.get(base + Session.getUserId());
      },

      get: function(id) {
        return $http.get(base + id);
      },

      getAll: function() {
        return $http.get(base);
      },

      getPage: function(page, size, text,statusFilters,NotstatusFilters) {
        return $http.get( users + "?" + $.param({
              text: text,
              page: page ? page : 0,
              size: size ? size : 20,
              statusFilters: statusFilters ? statusFilters : {},
              NotstatusFilters: NotstatusFilters ? NotstatusFilters : {}

            })
        );
      },

      updateProfile: function(id, profile) {
        return $http.put(base + id + "/profile", {
          profile: profile
        });
      },

      updateConfirmation: function(id, confirmation) {
        return $http.put(base + id + "/confirm", {
          confirmation: confirmation
        });
      },

      updateAll: function(id, user) {
        return $http.put(base + id + "/updateall", {
          user: user
        });
      },

      declineAdmission: function(id) {
        return $http.post(base + id + "/decline");
      },

      // -------------------------
      // Admin Only
      // -------------------------

      getStats: function() {
        return $http.get(base + "stats");
      },

      getTeamStats: function() {
        return $http.get(base + "teamStats");
      },

      admitUser: function(id) {
        return $http.post(base + id + "/admit");
      },
      rejectUser: function(id) {
        return $http.post(base + id + "/reject");
      },
      softAdmittUser: function(id) {
        return $http.post(base + id + "/softAdmit");
      },

      softRejectUser: function(id) {
        return $http.post(base + id + "/softReject");
      },

      sendBasicMail: function(id , email) {
        return $http.post(base + id + "/sendBasicMail",JSON.stringify(email));
      },

      checkIn: function(id) {
        return $http.post(base + id + "/checkin");
      },

      checkOut: function(id) {
        return $http.post(base + id + "/checkout");
      },

      removeUser: function(id) {
        return $http.post(base + id + "/removeuser");
      },

      makeAdmin: function(id) {
        return $http.post(base + id + "/makeadmin");
      },

      removeAdmin: function(id) {
        return $http.post(base + id + "/removeadmin");
      },

      massReject: function() {
        return $http.post(base + "massReject");
      },

      getRejectionCount: function() {
        return $http.get(base + "rejectionCount");
      },

      getLaterRejectedCount: function() {
        return $http.get(base + "laterRejectCount");
      },

      massRejectRest: function() {
        return $http.post(base + "massRejectRest");
      },

      getRestRejectionCount: function() {
        return $http.get(base + "rejectionCountRest");
      },

      reject: function(id) {
        return $http.post(base + id + "/reject");
      },

      sendLaggerEmails: function() {
        return $http.post(base + "sendlagemails");
      },

      sendRejectEmails: function() {
        return $http.post(base + "sendRejectEmails");
      },

      sendRejectEmailsRest: function() {
        return $http.post(base + "sendRejectEmailsRest");
      },

      sendRejectEmail: function(id) {
        return $http.post(base + id + "/rejectEmail");
      },

      sendPasswordResetEmail: function(email) {
        return $http.post(base + "sendResetEmail", { email: email });
      },



    };
  }
]);

angular.module('reg')
  .controller('adminChallengeCtrl',[
    '$scope',
    '$http',
    'challenge',
    'ChallengeService',
    function($scope, $http, challenge, ChallengeService){
      $scope.selectedchallenge = challenge.data;
      
      ChallengeService.getAnswer(challenge.data._id).then(response => {
        $scope.selectedchallenge.answer = response.data.answer;
      });

      $scope.togglePassword = function () { $scope.typePassword = !$scope.typePassword; };


      $scope.updateChallenge = function(){
        ChallengeService
          .update($scope.selectedchallenge._id, $scope.selectedchallenge)
          .then(response => {
            $selectedchallenge = response.data;
            swal("Updated!", "Challenge updated.", "success");
          }, response => {
            swal("Oops, you forgot something.");
          });  
      };

    }]);

angular.module("reg").controller("adminChallengesCtrl", [
  "$scope",
  "$state",
  "$stateParams",
  "ChallengeService",
  function($scope, $state, $stateParams, ChallengeService) {

    $scope.challenges = [];

    // Semantic-UI moves modal content into a dimmer at the top level.
    // While this is usually nice, it means that with our routing will generate
    // multiple modals if you change state. Kill the top level dimmer node on initial load
    // to prevent this.
    $(".ui.dimmer").remove();
    // Populate the size of the modal for when it appears, with an arbitrary Challenge.

    function refreshPage() {
      ChallengeService.getAll().then(response => {
        $scope.challenges = response.data;
      });
    }

    refreshPage();

    $scope.goChallenge = function($event, challenge) {

      $event.stopPropagation();
      $state.go("app.admin.challenge", {
        id: challenge._id
      });
    }

    $scope.createChallenge = function() {

      swal("Write the challenge title:", {
        buttons: {cancel: {text: "Cancel",value: null,visible: true}, yes: {text: "Next input",value: true,visible: true} },
        content: {element: "input", attributes: {placeholder: "Give this challenge a sexy name..",type: "text"} },
      })
      .then((title) => { if (!title) {return;}
        swal("Enter the challenge description:", {
          buttons: {cancel: {text: "Cancel",value: null,visible: true}, yes: {text: "Next input",value: true,visible: true} },
          content: {element: "input", attributes: {placeholder: "Describe this challenge so that people can get the idea..",type: "text"} },
          })
        .then((description) => { if (!description) {return;}
          swal("Enter the challenge dependency (LINK):", {
            buttons: {cancel: {text: "Cancel",value: null,visible: true}, yes: {text: "Next input",value: true,visible: true} },
            content: {element: "input", attributes: {placeholder: "http://www.example.com/Challenge42.zip",type: "text"} },
            })
          .then((dependency) => { if (!dependency) {return;}
            swal("Enter the answer:", {
              buttons: {cancel: {text: "Cancel",value: null,visible: true}, yes: {text: "Next input",value: true,visible: true} },
              content: {element: "input", attributes: {placeholder: "shhhh this si super secret bro",type: "text"} },
              })
            .then((answer) => { if (!answer) {return;}
              swal("Enter the number of points for this challenge:", {
                buttons: {cancel: {text: "Cancel",value: null,visible: true}, yes: {text: "Next input",value: true,visible: true} },
                content: {element: "input", attributes: {placeholder: "Points awarded to challenge solvers",type: "number"} },
                })
              .then((points) => { if (!points) {return;}
  
                cData = {
                  title:title,
                  description:description,
                  dependency:dependency,
                  answer:answer,
                  points:points,
                }
                ChallengeService.create(cData).then(response => {
                });
                refreshPage();
              });
            });
          });
        });
      });
      
    };

    $scope.removeChallenge = function($event, challenge, index) {
      $event.stopPropagation();
      swal({
        buttons: {
          cancel: {
            text: "Cancel",
            value: null,
            visible: true
          },
          accept: {
            className: "danger-button",
            closeModal: false,
            text: "Yes, remove them",
            value: true,
            visible: true
          }
        },
        dangerMode: true,
        icon: "warning",
        text: "You are about to remove " + challenge.title + "!",
        title: "Whoa, wait a minute!"
      }).then(value => {
        if (!value) {
          return;
        }

        swal({
          buttons: {
            cancel: {
              text: "Cancel",
              value: null,
              visible: true
            },
            yes: {
              className: "danger-button",
              closeModal: false,
              text: "Yes, remove this challenge",
              value: true,
              visible: true
            }
          },
          dangerMode: true,
          title: "Are you sure?",
          text: "Remember, this power is a privilege.",
          icon: "warning"
        }).then(value => {
          if (!value) {
            return;
          }

          ChallengeService.remove(challenge._id).then(response => {
            $scope.challenges[index] = response.data;
            swal(
              "Removed",
              response.data.title + " has been removed.",
              "success"
            );
          });
          refreshPage();
        });
      });
    };

  }
]);

angular.module("reg").controller("AdminMailCtrl", [
  "$scope",
  "$state",
  "$stateParams",
  "UserService",
  function($scope, $state, $stateParams, UserService) {
    $scope.pages = [];
    $scope.users = [];

    // Semantic-UI moves modal content into a dimmer at the top level.
    // While this is usually nice, it means that with our routing will generate
    // multiple modals if you change state. Kill the top level dimmer node on initial load
    // to prevent this.
    $(".ui.dimmer").remove();
    // Populate the size of the modal for when it appears, with an arbitrary user.



    UserService.getPage($stateParams.page, $stateParams.size, $stateParams.query, $scope.statusFilters)
    .then(response => {
      $scope.users= response.data.users;
    });

    $scope.sendEmail = function() {
      var filteredUsers = $scope.users.filter(
        u => u.verified
    );

      if ($scope.statusFilters.completedProfile) {
        filteredUsers = filteredUsers.filter(
          u => u.status.completedProfile
      )}

      if ($scope.statusFilters.admitted) {
        filteredUsers = filteredUsers.filter(
          u => u.status.admitted
      )}

      if ($scope.statusFilters.confirmed) {
        filteredUsers = filteredUsers.filter(
          u => u.status.confirmed
      )}

      if ($scope.statusFilters.declined) {
        filteredUsers = filteredUsers.filter(
          u => u.status.declined
      )}

      if ($scope.statusFilters.checkedIn) {
        filteredUsers = filteredUsers.filter(
          u => u.status.checkedIn
      )}

      var message = $(this).data("confirm");

      swal({
        title: "Whoa, wait a minute!",
        text: `You're about to send this email to ${
          filteredUsers.length
        } selected user(s).`,
        icon: "warning",
        buttons: ["Cancel", "Yes, send the emails"],
        dangerMode: true
      }).then(willSend => {
        email = { subject:$scope.subject , title:$scope.title, body:$scope.body }

        if (willSend) {
          if (filteredUsers.length) {
            filteredUsers.forEach(user => {
              UserService.sendBasicMail(user.id,email);
            });
            swal(
              "Sending!",
              `Sending emails to ${
                filteredUsers.length
              } users!`,
              "success"
            );
          } else {
            swal("Whoops", "You can't send or accept 0 users!", "error");
          }
        }
      });
    };

  }
]);

angular.module("reg").controller("adminMarketingCtrl", [
  "$scope",
  "$state",
  "$stateParams",
  "MarketingService",
  function($scope, $state, $stateParams, MarketingService) {

    // Semantic-UI moves modal content into a dimmer at the top level.
    // While this is usually nice, it means that with our routing will generate
    // multiple modals if you change state. Kill the top level dimmer node on initial load
    // to prevent this.
    $(".ui.dimmer").remove();
    // Populate the size of the modal for when it appears, with an arbitrary user.




    $scope.createTeams = function(){

      if ($scope.body && $scope.event){
        swal({
          title: "Whoa, wait a minute!",
          text: `You're about to add these teams emails to the marketing database`,
          icon: "warning",
          buttons: ["Cancel", "Yes, Add teams"],
          dangerMode: true
        }).then(value => {
          if (value) {
            var teams = $scope.body.split(';');
            teams.forEach(team => {
              teamData = {
                event:$scope.event,
                members:team.replace(' ','').split(',')
              }
              MarketingService.createTeam(teamData);
            });
            swal("Added", "Teams added to database.", "success");
            $scope.body=""
          }
        });
      }
      else {
        swal("ERROR!", "All fields are required.", "error");
      }
    }


    
  }
]);

angular.module('reg')
  .controller('AdminSettingsCtrl', [
    '$scope',
    '$sce',
    'SettingsService',
    function($scope, $sce, SettingsService){

      $scope.settings = {};
      SettingsService
        .getPublicSettings()
        .then(response => {
          updateSettings(response.data);
        });

      function updateSettings(settings){
        $scope.loading = false;
         // Format the dates in settings.
        settings.timeOpen = new Date(settings.timeOpen);
        settings.timeClose = new Date(settings.timeClose);
        settings.timeConfirm = new Date(settings.timeConfirm);
        settings.timeStart = new Date(settings.timeStart);

        $scope.settings = settings;
      }

      // Additional Options --------------------------------------

      $scope.updateAllowMinors = function () {
        SettingsService
          .updateAllowMinors($scope.settings.allowMinors)
          .then(response => {
            $scope.settings.allowMinors = response.data.allowMinors;
            const successText = $scope.settings.allowMinors ?
              "Minors are now allowed to register." :
              "Minors are no longer allowed to register."
            swal("Looks good!", successText, "success");
          });
      };

      // Whitelist --------------------------------------

      SettingsService
        .getWhitelistedEmails()
        .then(response => {
          $scope.whitelist = response.data.join(", ");
        });

        $scope.updateWhitelist = function(){
          SettingsService
            .updateWhitelistedEmails($scope.whitelist.replace(/ /g, '').split(','))
            .then(response => {
              swal('Whitelist updated.');
              $scope.whitelist = response.data.whitelistedEmails.join(", ");
            });
        };

      // Registration Times -----------------------------

      $scope.formatDate = function(date){
        if (!date){
          return "Invalid Date";
        }

        // Hack for timezone
        return moment(date).format('dddd, MMMM Do YYYY, h:mm a') +
          " " + date.toTimeString().split(' ')[2];
      };

      // Take a date and remove the seconds.
      function cleanDate(date){
        return new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          date.getMinutes()
        );
      }

      $scope.updateRegistrationTimes = function(){
        // Clean the dates and turn them to ms.
        var open = cleanDate($scope.settings.timeOpen).getTime();
        var close = cleanDate($scope.settings.timeClose).getTime();

        if (open < 0 || close < 0 || open === undefined || close === undefined){
          return swal('Oops...', 'You need to enter valid times.', 'error');
        }
        if (open >= close){
          swal('Oops...', 'Registration cannot open after it closes.', 'error');
          return;
        }

        SettingsService
          .updateRegistrationTimes(open, close)
          .then(response => {
            updateSettings(response.data);
            swal("Looks good!", "Registration Times Updated", "success");
          });
      };

      // Confirmation Time -----------------------------

      $scope.updateConfirmationTime = function(){
        var confirmBy = cleanDate($scope.settings.timeConfirm).getTime();

        SettingsService
          .updateConfirmationTime(confirmBy)
          .then(response => {
            updateSettings(response.data);
            swal("Sounds good!", "Confirmation Date Updated", "success");
          });
      };

      // Event Start Time -----------------------------

      $scope.updateStartTime = function(){
        var startBy = cleanDate($scope.settings.timeStart).getTime();

        SettingsService
          .updateStartTime(startBy)
          .then(response => {
            updateSettings(response.data);
            swal("Sounds good!", "Event Start Date Updated", "success");
          });
      };


      // Acceptance / Confirmation Text ----------------

      var converter = new showdown.Converter();

      $scope.markdownPreview = function(text){
        return $sce.trustAsHtml(converter.makeHtml(text));
      };

      $scope.updateWaitlistText = function(){
        var text = $scope.settings.waitlistText;
        SettingsService
          .updateWaitlistText(text)
          .then(response => {
            swal("Looks good!", "Waitlist Text Updated", "success");
            updateSettings(response.data);
          });
      };

      $scope.updateHostSchool = function(){
        var hostSchool = $scope.settings.hostSchool;
        SettingsService
          .updateHostSchool(hostSchool)
          .then(response => {
            swal("Looks good!", "Host School Updated", "success");
            updateSettings(response.data);
          });
      };

    
      $scope.updateAcceptanceText = function(){
        var text = $scope.settings.acceptanceText;
        SettingsService
          .updateAcceptanceText(text)
          .then(response => {
            swal("Looks good!", "Acceptance Text Updated", "success");
            updateSettings(response.data);
          });
      };

      $scope.updateConfirmationText = function(){
        var text = $scope.settings.confirmationText;
        SettingsService
          .updateConfirmationText(text)
          .then(response => {
            swal("Looks good!", "Confirmation Text Updated", "success");
            updateSettings(response.data);
          });
      };

    }]);



angular.module('reg')
.controller('AdminTeamCtrl', [
  '$scope',
  '$state',
  '$timeout',
  'currentUser',
  'settings',
  'Utils',
  'UserService',
  'TeamService',
  'TEAM',
  function ($scope, $state, $timeout, currentUser, settings, Utils, UserService, TeamService, TEAM) {
    // Get the current user's most recent data. 
    var Settings = settings.data;

    $scope.regIsOpen = Utils.isRegOpen(Settings);

    $scope.user = currentUser.data;

    function isTeamMember(teams, Userid) {
      var test = false;
      teams.forEach(team => {
        team.members.forEach(member => {
          if (member.id == Userid) test = true;
        });
      });
      return test;
    }

    function selectMember(memberId) {
      UserService.get(memberId).then(response => {
        user = response.data
        $scope.selectedUser = user;
        $scope.selectedUser.sections = generateSections(user);
      });
      console.log(user);
      $(".long.user.modal").modal("show");
    }

    function generateSections(user) {
      return [
        {
          name: "Profile",
          fields: [
            {
              name: "Gender",
              value: user.profile.gender
            },
            {
              name: "School",
              value: user.profile.school
            },
            {
              name: "Github",
              value: user.profile.github
            },
            {
              name: "Linkedin",
              value: user.profile.linkedin
            },
          ]
        },
      ];
    }

    function formatTime(time) {
      if (time) {
        return moment(time).format("MMMM Do YYYY, h:mm:ss a");
      }
    }

    $scope.selectMember = selectMember;


    $scope.isjoined = function (team) {
      var test = false;
      team.joinRequests.forEach(member => {
        if (member.id == currentUser.data._id) test = true;
      })
      return test;
    }

    TeamService.getAll().then(teams => {
      console.log(teams.data);

      $scope.isTeamAdmin = false;
      $scope.isTeamMember = false;
      teams.data.forEach(team => {
        team.isMaxteam = false;

        if (team.members.length >= Settings.maxTeamSize) {
          team.isColosed = true;
          team.isMaxteam = true;
        }

        if (team.members[0].id == currentUser.data._id) {
          team.joinRequests.forEach(member => {
            if (isTeamMember(teams.data, member.id)) {
              member.unavailable = true;
            } else { member.unavailable = false }
          });
          $scope.userAdminTeam = team;
          $scope.isTeamAdmin = true;
        } else {
          team.members.forEach(member => {
            if (member.id == currentUser.data._id) {
              $scope.userMemberTeam = team;
              $scope.isTeamMember = true;
            }
          })
        }
      })
      
      $scope.teams = teams.data;

    });


    $scope.createTeam = function () {

      teamData = {
        description: $scope.newTeam_description,
        members: [{ id: currentUser.data._id, name: currentUser.data.profile.name, skill: $scope.newTeam_Adminskill }],
        skills: { code: $scope.skillcode, design: $scope.skilldesign, hardware: $scope.skillhardware, idea: $scope.skillidea },
        isColosed: false,
      }
      console.log(teamData);
      console.log($scope.newTeam_Adminskill);

      TeamService.create(teamData);
      $state.reload();
    };


    $scope.ShowcreateTeam = function () {
      $scope.ShowNewTeamFrom = true;
      $scope.skillcode = true
      $scope.skilldesign = true
      $scope.skillhardware = true
      $scope.skillidea = true
      $scope.newTeam_Adminskill = "code"
    }


    $scope.ShowJoinTeam = function(){
      $scope.ShowJoinTeamFrom = true;  
    }


    $scope.joinTeamCode = function () {

      teamID = $scope.newTeam_Code;
      newTeam_skill= $scope.newTeam_skill;

      newuser= {id:currentUser.data._id, name:currentUser.data.profile.name, skill:newTeam_skill};
      TeamService.join(teamID,newuser); 
      swal(
        "Joined",
        "You have appliced to join this team, wait for the Team-Admin to accept your application.",
        "success"
      );  
      $state.reload();
 
    }
    
    $scope.joinTeam = function (team) {

      var value;
      const select = document.createElement('select');
      select.className = 'select-custom'


      var option = document.createElement('option');
      option.disabled = true;
      option.innerHTML = 'Select a skill';
      option.value = "code"
      select.appendChild(option);


      if (team.skills.code) {
        option = document.createElement('option');
        option.innerHTML = 'Code';
        option.value = "code"
        select.appendChild(option);
      }
      if (team.skills.design) {
        option = document.createElement('option');
        option.innerHTML = 'Design';
        option.value = "design"
        select.appendChild(option);
      }
      if (team.skills.hardware) {
        option = document.createElement('option');
        option.innerHTML = 'Hardware';
        option.value = "hardware"
        select.appendChild(option);
      }
      if (team.skills.idea) {
        option = document.createElement('option');
        option.innerHTML = 'Idea';
        option.value = "idea"
        select.appendChild(option);
      }

      select.onchange = function selectChanged(e) {
        value = e.target.value
      }

      swal({
        title: "Please select your skill to join",

        content: {
          element: select,
        }
      }).then(function () {

        newuser = { id: currentUser.data._id, name: currentUser.data.profile.name, skill: value };
        TeamService.join(team._id, newuser);
        swal(
          "Joined",
          "You have appliced to join this team, wait for the Team-Admin to accept your application.",
          "success"
        );
        $state.reload();
      })
    }


    $scope.acceptMember = function (teamID, member, index) {

      swal({
        title: "Whoa, wait a minute!",
        text: "You are about to accept " + member.name + " to your team! This will send him a notification email and will show in the public teams page.",
        icon: "warning",
        buttons: {
          cancel: {
            text: "Cancel",
            value: null,
            visible: true
          },
          checkIn: {
            className: "danger-button",
            closeModal: false,
            text: "Yes, let him in",
            value: true,
            visible: true
          }
        }
      }).then(value => {
        if (!value) {
          return;
        }
        TeamService.acceptMember(teamID, member, Settings.maxTeamSize).then(response => {
          if (response == "maxTeamSize") {
            swal(
              "Error",
              "Maximum number of members (" + Settings.maxTeamSize + ") reached",
              "error"
            );
          } else {
            TeamService.removejoin(teamID, index, false).then(response2 => {
              swal(
                "Accepted",
                member.name + " has been accepted to your team.",
                "success"
              );
              $state.reload();
            });
          }
        });
      });
    }



    $scope.refuseMember = function (teamID, member, index) {
      swal({
        title: "Whoa, wait a minute!",
        text: "You are about to refuse " + member.name + " from your team! This will send him a notification email.",
        icon: "warning",
        buttons: {
          cancel: {
            text: "Cancel",
            value: null,
            visible: true
          },
          checkIn: {
            className: "danger-button",
            closeModal: false,
            text: "Yes, refuse him",
            value: true,
            visible: true
          }
        }
      }).then(value => {
        if (!value) {
          return;
        }
        TeamService.removejoin(teamID, index, member).then(response => {
          swal(
            "Refused",
            member.name + " has been refused from your team.",
            "success"
          );
          $state.reload();
        });
      });
    }


    $scope.removeMemberfromTeam = function (teamID, member, index) {
      swal({
        title: "Whoa, wait a minute!",
        text: "You are about to remove " + member.name + " from your team! This will send him a notification email.",
        icon: "warning",
        buttons: {
          cancel: {
            text: "Cancel",
            value: null,
            visible: true
          },
          checkIn: {
            className: "danger-button",
            closeModal: false,
            text: "Yes, remove him",
            value: true,
            visible: true
          }
        }
      }).then(value => {
        if (!value) {
          return;
        }
        TeamService.removemember(teamID, index, member.id).then(response => {
          if (response == "removingAdmin") {
            swal(
              "Error",
              "You can't remove the Team Admin, But you can close the team.",
              "error"
            );
          } else {
            TeamService.removejoin(teamID, index, false).then(response2 => {
              swal(
                "Removed",
                member.name + " has been removed from your team.",
                "success"
              );
              $state.reload();
            });
          }
        });
      });
    }



    $scope.removeTeam = function (team) {
      swal({
        title: "Whoa, wait a minute!",
        text: "You are about to remove this team with all it's members! This will send them a notification email. You need to find another team to work with.",
        icon: "warning",
        buttons: {
          cancel: {
            text: "Cancel",
            value: null,
            visible: true
          },
          checkIn: {
            className: "danger-button",
            closeModal: false,
            text: "Yes, remove team",
            value: true,
            visible: true
          }
        }
      }).then(value => {
        if (!value) {
          return;
        }

        email = {
          subject: "Your team has been removed",
          title: "Time for a backup plan",
          body: "The team you have been part (Member/requested to join) of has been removed. Please check your dashboard and try to find another team to work with before the hackathon starts."
        }

        TeamService.remove(team._id).then(response => {
          team.members.forEach(user => {
            UserService.sendBasicMail(user.id, email);
          });
          team.joinRequests.forEach(user => {
            UserService.sendBasicMail(user.id, email);
          });

          swal(
            "Removed",
            "Team has been removed.",
            "success"
          );
          $state.reload();
        });
      });
    }


    $scope.leaveTeam = function (team) {
      swal({
        title: "Whoa, wait a minute!",
        text: "You are about to leave your team! This will send the admin a notification email.",
        icon: "warning",
        buttons: {
          cancel: {
            text: "Cancel",
            value: null,
            visible: true
          },
          checkIn: {
            className: "danger-button",
            closeModal: false,
            text: "Yes, remove him",
            value: true,
            visible: true
          }
        }
      }).then(value => {
        if (!value) {
          return;
        }
        var index = 0;
        team.members.forEach(member => {
          if (member.id == currentUser.data._id) {
            TeamService.removemember(team._id, index).then(response => {
              swal(
                "Removed",
                "You have successfully left this team. Please find another team or create your own.",
                "success"
              );
              $state.reload();
            });

          }
          index++;
        })
      });
    }


    $scope.canceljoinTeam = function (team) {
      swal({
        title: "Whoa, wait a minute!",
        text: "You are about to cancel your request to join this team!",
        icon: "warning",
        buttons: {
          cancel: {
            text: "No",
            value: null,
            visible: true
          },
          checkIn: {
            className: "danger-button",
            closeModal: false,
            text: "Yes, Cancel",
            value: true,
            visible: true
          }
        }
      }).then(value => {
        if (!value) {
          return;
        }
        var index = 0;

        team.joinRequests.forEach(member => {
          if (member.id == currentUser.data._id) {
            TeamService.removejoin(team._id, index, false).then(response => {
              swal(
                "Removed",
                "You have successfully canceled you request to join this team. Please find another team or create your own.",
                "success"
              );
              $state.reload();
            });

          }
          index++;
        })
      });
    }


    $scope.toggleCloseTeam = function (teamID, status) {
      if (status == true) {
        text = "You are about to Close this team. This won't allow other members to join your team!"
      } else { text = "You are about to reopen this team. This will allow other members to join your team!" }

      swal({
        title: "Whoa, wait a minute!",
        text: text,
        icon: "warning",
        buttons: {
          cancel: {
            text: "No",
            value: null,
            visible: true
          },
          checkIn: {
            className: "danger-button",
            closeModal: false,
            text: "Yes",
            value: true,
            visible: true
          }
        }
      }).then(value => {
        if (!value) {
          return;
        }
        TeamService.toggleCloseTeam(teamID, status).then(response => {
          swal(
            "Done",
            "Operation successfully Completed.",
            "success"
          );
          $state.reload();
        });
      });
    }



    $scope.toggleHideTeam = function (teamID, status) {
      if (status == true) {
        text = "You are about to Hide this team. This won't allow other members to see your team!"
      } else { text = "You are about to Show this team. This will allow other members to see your team!" }

      swal({
        title: "Whoa, wait a minute!",
        text: text,
        icon: "warning",
        buttons: {
          cancel: {
            text: "No",
            value: null,
            visible: true
          },
          checkIn: {
            className: "danger-button",
            closeModal: false,
            text: "Yes",
            value: true,
            visible: true
          }
        }
      }).then(value => {
        if (!value) {
          return;
        }
        TeamService.toggleHideTeam(teamID, status).then(response => {
          swal(
            "Done",
            "Operation successfully Completed.",
            "success"
          );
          $state.reload();
        });
      });
    }

    $scope.$watch("queryText", function (queryText) {
      TeamService.getSelectedTeams(queryText, $scope.skillsFilters).then(
        response => {
          $scope.teams = response.data.teams;
        }
      );
    });

    $scope.applyskillsFilter = function () {
      TeamService.getSelectedTeams($scope.queryText, $scope.skillsFilters).then(
        response => {
          $scope.teams = response.data.teams;
        }
      );
    };





  }]);

angular.module('reg') .config(['ChartJsProvider', function (ChartJsProvider) {
  // Configure all charts
  ChartJsProvider.setOptions({
    chartColors: ['#9B66FE', '#FF6484', '#FEA03F', '#FBD04D', '#4DBFC0', '#33A3EF', '#CACBCF'],
    responsive: true
  });
}])
.controller('AdminStatsCtrl',[
    '$scope',
    'UserService',
    function($scope, UserService){
      
      UserService
        .getStats()
        .then(stats => {
          $scope.stats = stats.data; 

          // Meals 
          labels=[]
          for (let i = 0; i < stats.data.live.meal.length; i++) {
            labels.push('Meal '+(i+1))      
          }
          $scope.meals = { 
            labels : labels,
            series : ['Meals'],
            data : stats.data.live.meal,
            options : {
              "scales":{
                "xAxes":[{"ticks":{beginAtZero:true,max:stats.data.total}}]
              },
              title: {
                display: true,
                text: 'Meals Consumed'
              }
            }
           }
           
          // Workshops 
          labels=[]
          for (let i = 0; i < stats.data.live.workshop.length; i++) {
            labels.push('Workshop '+(i+1))      
          }
          $scope.workshops = { 
            labels : labels,
            series : ['Workshops'],
            data : stats.data.live.workshop,
            options:{
              elements: {
                line: {
                  borderWidth: 0.5,                
                },
              },
              title: {
                display: true,
                text: 'Workshops attendance'
              }
            }
           }

          // clubs
          $scope.clubs = {
            labels : stats.data.source.clubsLabels,
            series : ['Clubs'],
            data : stats.data.source.clubs,
            options:{
              elements: {
                line: {
                  borderWidth: 0.5,                
                },
              },
              title: {
                display: true,
                text: 'Applicants via Clubs'
              },
              legend: {
                display: true,
                position: 'right',
              },
            }
           }

           // Get the most active club
           var arr =stats.data.source.clubs
           var max = arr[0];
           var maxIndex = 0;
           for (var i = 1; i < arr.length; i++) {
               if (arr[i] > max) {
                   maxIndex = i;
                   max = arr[i];
               }
           }

           $scope.firstClub = stats.data.source.clubsLabels[maxIndex]

       


          // sources 
          $scope.source = {
            labels : ['Facebook','Email','Clubs'],
            series : ['Sources'],
            data : stats.data.source.general,
            options:{
              elements: {
                line: {
                  borderWidth: 0.5,                
                },
              },
              title: {
                display: true,
                text: 'Applicants sources'
              },
              legend: {
                display: true,
                position: 'right',
              },
            }
           }



          $scope.loading = false;
        });  


      UserService
        .getTeamStats()
        .then(teamstats => {
          $scope.teamstats = teamstats.data; 
        });  


      $scope.fromNow = function(date){
        return moment(date).fromNow();
      };


      Chart.defaults.global.colors = [
        {
          backgroundColor: 'rgba(52, 152, 219, 0.5)',
          pointBackgroundColor: 'rgba(52, 152, 219, 0.5)',
          pointHoverBackgroundColor: 'rgba(151,187,205,0.5)',
          borderColor: 'rgba(0,0,0,0',
          pointBorderColor: '#fff',
          pointHoverBorderColor: 'rgba(151,187,205,0.5)'
        }
      ]        


      $scope.sendLaggerEmails = function(){
        swal({
          title: "Are you sure?",
          text: "This will send an email to every user who has not submitted an application. Are you sure?.",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, send.",
          closeOnConfirm: false
          }, function(){
            UserService
              .sendLaggerEmails()
              .then(function(){
                sweetAlert('Your emails have been sent.');
            });
          });
      };

      $scope.sendRejectEmails = function(){
        swal({
          title: "Are you sure?",
          text: "This will send an email to every user who has been rejected. Are you sure?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, send.",
          closeOnConfirm: false
          }, function(){
            UserService
              .sendRejectEmails()
              .then(function(){
                sweetAlert('Your emails have been sent.');
            });
          });
      };

      $scope.sendRejectEmailsRest = function(){
        UserService
          .getLaterRejectedCount()
          .success(function(count) {
            swal({
              title: "Are you sure?",
              text: `This will send rejection email to ${count} users.`,
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes, reject.",
              closeOnConfirm: false
              }, function(){
    
                UserService
                  .sendRejectEmailsRest()
                  .then(function(){
                    sweetAlert('Your emails have been sent.');
                });
            })
          })
      };

      $scope.massReject = function() {
        UserService
          .getRejectionCount()
          .success(function(count) {
            swal({
              title: "Are you sure?",
              text: `This will reject ${count} users.`,
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes, reject.",
              closeOnConfirm: false
              }, function(){
    
                UserService
                  .massReject()
                  .then(function(){
                    sweetAlert('Mass Rejection successful.');
                });
            })
          })
      }

      $scope.massRejectRest = function() {
        UserService
          .getRestRejectionCount()
          .success(function(count) {
            swal({
              title: "Are you sure?",
              text: `This will reject ${count} users.`,
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes, reject.",
              closeOnConfirm: false
              }, function(){
    
                UserService
                  .massRejectRest()
                  .then(function(){
                    sweetAlert('Mass Rejection successful.');
                });
            })
          })
      }




    }]);

angular.module('reg')
  .controller('AdminUserCtrl',[
    '$scope',
    '$http',
    'user',
    'UserService',
    function($scope, $http, User, UserService){
      $scope.selectedUser = User.data;

      // Populate the school dropdown
      populateSchools();

      function populateSchools(){

        $http
          .get('/assets/schools.json')
          .then(function(res){
            var schools = res.data;
            var email = $scope.selectedUser.email.split('@')[1];

            if (schools[email]){
              $scope.selectedUser.profile.school = schools[email].school;
              $scope.autoFilledSchool = true;
            }

          });
      }


      $scope.updateProfile = function(){
        UserService
          .updateProfile($scope.selectedUser._id, $scope.selectedUser.profile)
          .then(response => {
            $selectedUser = response.data;
            swal("Updated!", "Profile updated.", "success");
          }, response => {
            swal("Oops, you forgot something.");
          });
      };


      $scope.updateConfirmation = function(){
        UserService
          .updateConfirmation($scope.selectedUser._id, $scope.selectedUser.confirmation)
          .then(response => {
            $selectedUser = response.data;
            swal("Updated!", "Confirmation updated.", "success");
          }, response => {
            swal("Oops, you forgot something.");
          });
      };


      $scope.updateAllUser = function(){

        UserService
          .updateAll($scope.selectedUser._id, $scope.selectedUser)
          .then(response => {
            $selectedUser = response.data;
            swal("Updated!", "ALL Profile updated.", "success");
          }, response => {
            swal("Oops, you forgot something.");
          });  
      };





    }]);

angular.module("reg").controller("AdminUsersCtrl", [
  "$scope",
  "$state",
  "$stateParams",
  "UserService",
  'AuthService',
  function($scope, $state, $stateParams, UserService, AuthService) {
    $scope.pages = [];
    $scope.users = [];

    // Semantic-UI moves modal content into a dimmer at the top level.
    // While this is usually nice, it means that with our routing will generate
    // multiple modals if you change state. Kill the top level dimmer node on initial load
    // to prevent this.
    $(".ui.dimmer").remove();
    // Populate the size of the modal for when it appears, with an arbitrary user.
    $scope.selectedUser = {};
    $scope.selectedUser.sections = generateSections({
      status: "",
      confirmation: {
        dietaryRestrictions: []
      },
      profile: ""
    });

    function updatePage(data) {
      $scope.users = data.users;
      $scope.currentPage = data.page;
      $scope.pageSize = data.size;

      var p = [];
      for (var i = 0; i < data.totalPages; i++) {
        p.push(i);
      }
      $scope.pages = p;
    }

    UserService.getPage($stateParams.page, $stateParams.size, $stateParams.query, $scope.statusFilters)
    .then(response => {

      updatePage(response.data);
    });

    $scope.$watch("queryText", function(queryText) {
      UserService.getPage($stateParams.page, $stateParams.size, queryText, $scope.statusFilters).then(
        response => {
          updatePage(response.data);
        }
      );
    });


    $scope.applyStatusFilter = function () {
      UserService
        .getPage($stateParams.page, $stateParams.size, $scope.queryText, $scope.statusFilters,$scope.NotstatusFilters).then(
          response => {
            updatePage(response.data);
        });
    };


    $scope.goToPage = function(page) {
      $state.go("app.admin.users", {
        page: page,
        size: $stateParams.size || 20
      });
    };

    $scope.goUser = function($event, user) {
      $event.stopPropagation();

      $state.go("app.admin.user", {
        id: user._id
      });
    };


    $scope.acceptUser = function($event, user, index) {
      $event.stopPropagation();
      swal({
        buttons: {
          cancel: {
            text: "Cancel",
            value: null,
            visible: true
          },
          accept: {
            className: "danger-button",
            closeModal: false,
            text: "Yes, accept them",
            value: true,
            visible: true
          }
        },
        dangerMode: true,
        icon: "warning",
        text: "You are about to accept " + user.profile.name + "!",
        title: "Whoa, wait a minute!"
      }).then(value => {
        if (!value) {
          return;
        }
        swal({
          buttons: {
            cancel: {
              text: "Cancel",
              value: null,
              visible: true
            },
            yes: {
              className: "danger-button",
              closeModal: false,
              text: "Yes, accept this user",
              value: true,
              visible: true
            }
          },
          dangerMode: true,
          title: "Are you sure?",
          text:
            "Your account will be logged as having accepted this user. " +
            "Remember, this power is a privilege.",
          icon: "warning"
        }).then(value => {
          if (!value) {
            return;
          }
          
          UserService.softAdmittUser(user._id).then(response => {
            $scope.users[index] = response.data;
            swal(
              "Accepted",
              response.data.profile.name + " has been admitted.",
              "success"
            );
            $state.reload();
          });
        });
      });
    };



    $scope.rejecttUser = function($event, user, index) {
      $event.stopPropagation();
      swal({
        buttons: {
          cancel: {
            text: "Cancel",
            value: null,
            visible: true
          },
          accept: {
            className: "danger-button",
            closeModal: false,
            text: "Yes, reject them",
            value: true,
            visible: true
          }
        },
        dangerMode: true,
        icon: "warning",
        text: "You are about to reject " + user.profile.name + "!",
        title: "Whoa, wait a minute!"
      }).then(value => {
        if (!value) {
          return;
        }

        swal({
          buttons: {
            cancel: {
              text: "Cancel",
              value: null,
              visible: true
            },
            yes: {
              className: "danger-button",
              closeModal: false,
              text: "Yes, reject this user",
              value: true,
              visible: true
            }
          },
          dangerMode: true,
          title: "Are you sure?",
          text:
            "Your account will be logged as having rejected this user. " +
            "Remember, this power is a privilege.",
          icon: "warning"
        }).then(value => {
          if (!value) {
            return;
          }
          
          UserService.softRejectUser(user._id).then(response => {
            $scope.users[index] = response.data;
            swal(
              "Rejected",
              response.data.profile.name + " has been rejected.",
              "success"
            );
            $state.reload();
          });
        });
      });
    };




    $scope.removeUser = function($event, user, index) {
      $event.stopPropagation();


      swal({
        buttons: {
          cancel: {
            text: "Cancel",
            value: null,
            visible: true
          },
          accept: {
            className: "danger-button",
            closeModal: false,
            text: "Yes, remove them",
            value: true,
            visible: true
          }
        },
        dangerMode: true,
        icon: "warning",
        text: "You are about to remove " + user.profile.name + "!",
        title: "Whoa, wait a minute!"
      }).then(value => {
        if (!value) {
          return;
        }

        swal({
          buttons: {
            cancel: {
              text: "Cancel",
              value: null,
              visible: true
            },
            yes: {
              className: "danger-button",
              closeModal: false,
              text: "Yes, remove this user",
              value: true,
              visible: true
            }
          },
          dangerMode: true,
          title: "Are you sure?",
          text:
            "Your account will be logged as having removed this user. " +
            "Remember, this power is a privilege.",
          icon: "warning"
        }).then(value => {
          if (!value) {
            return;
          }

          UserService.removeUser(user._id).then(response => {
            $scope.users[index] = response.data;
            swal(
              "Removed",
              response.data.profile.name + " has been removed.",
              "success"
            );
            $state.reload();
          });
        });
      });
    };

    $scope.sendAcceptanceEmails = function() {
      const filterSoftAccepted = $scope.users.filter(
        u => u.status.softAdmitted && !u.status.admitted
      );

      var message = $(this).data("confirm");

      swal({
        title: "Whoa, wait a minute!",
        text: `You're about to send acceptance emails (and accept) ${
          filterSoftAccepted.length
        } user(s).`,
        icon: "warning",
        buttons: ["Cancel", "Yes, accept them and send the emails"],
        dangerMode: true
      }).then(willSend => {
        if (willSend) {
          if (filterSoftAccepted.length) {
            filterSoftAccepted.forEach(user => {
              UserService.admitUser(user._id); 
            });
            swal(
              "Sending!",
              `Accepting and sending emails to ${
                filterSoftAccepted.length
              } users!`,
              "success"
            );
          } else {
            swal("Whoops", "You can't send or accept 0 users!", "error");
          }
        }
      });
    };



    $scope.sendRejectionEmails = function() {
      const filterSoftRejected = $scope.users.filter(
        u => u.status.softRejected
      );

      var message = $(this).data("confirm");

      swal({
        title: "Whoa, wait a minute!",
        text: `You're about to send rejection emails (and reject) ${
          filterSoftRejected.length
        } user(s).`,
        icon: "warning",
        buttons: ["Cancel", "Yes, reject them and send the emails"],
        dangerMode: true
      }).then(willSend => {
        if (willSend) {
          if (filterSoftRejected.length) {
            filterSoftRejected.forEach(user => {
              UserService.rejectUser(user._id); 
            });
            swal(
              "Sending!",
              `Rejecting and sending emails to ${
                filterSoftRejected.length
              } users!`,
              "success"
            );
          } else {
            swal("Whoops", "You can't send or reject 0 users!", "error");
          }
        }
      });
    };


    $scope.exportUsers = function(){
      var columns = ["N°", "Gender", "Full Name","School"];
      var rows = [];
      UserService.getAll().then(users => {
        var i=1;
        users.data.forEach(user => {
          rows.push([i++,user.profile.gender,user.profile.name,user.profile.school])
        });
        var doc = new jsPDF('p', 'pt');


        var totalPagesExp = "{total_pages_count_string}";

        var pageContent = function (data) {
            // HEADER
            doc.setFontSize(20);
            doc.setTextColor(40);
            doc.setFontStyle('normal');
            // if (base64Img) {
            //     doc.addImage(base64Img, 'JPEG', data.settings.margin.left, 15, 10, 10);
            // }
            doc.text("Participants List", data.settings.margin.left + 15, 22);
    
            // FOOTER
            var str = "Page " + data.pageCount;
            // Total page number plugin only available in jspdf v1.0+
            if (typeof doc.putTotalPages === 'function') {
                str = str + " of " + totalPagesExp;
            }
            doc.setFontSize(10);
            var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
            doc.text(str, data.settings.margin.left, pageHeight  - 10);
        };
        
        doc.autoTable(columns, rows, {
            addPageContent: pageContent,
            margin: {top: 30},
            theme: 'grid'
        });
        if (typeof doc.putTotalPages === 'function') {
          doc.putTotalPages(totalPagesExp);
        }
        doc.save('Participants List.pdf');
      })
    }


    $scope.toggleAdmin = function($event, user, index) {
      $event.stopPropagation();

      if (!user.admin) {
        swal({
          title: "Whoa, wait a minute!",
          text: "You are about make " + user.profile.name + " an admin!",
          icon: "warning",
          buttons: {
            cancel: {
              text: "Cancel",
              value: null,
              visible: true
            },
            confirm: {
              text: "Yes, make them an admin",
              className: "danger-button",
              closeModal: false,
              value: true,
              visible: true
            }
          }
        }).then(value => {
          if (!value) {
            return;
          }

          UserService.makeAdmin(user._id).then(response => {
            $scope.users[index] = response.data;
            swal("Made", response.data.profile.name + " an admin.", "success");
            $state.reload();
          });
        });
      } else {
        UserService.removeAdmin(user._id).then(response => {
          $scope.users[index] = response.data;
          swal("Removed", response.data.profile.name + " as admin", "success");
          $state.reload();
        });
      }
    };

    function formatTime(time) {
      if (time) {
        return moment(time).format("MMMM Do YYYY, h:mm:ss a");
      }
    }

    $scope.rowClass = function(user) {
      if (user.admin) {
        return "admin";
      }
      if (user.status.confirmed) {
        return "positive";
      }
      if (user.status.admitted && !user.status.confirmed) {
        return "warning";
      }
    };

    function selectUser(user) {
      $scope.selectedUser = user;
      $scope.selectedUser.sections = generateSections(user);
      $(".long.user.modal").modal("show");
    }

    function generateSections(user) {
      return [
        {
          name: "Basic Info",
          fields: [
            {
              name: "Created On",
              value: formatTime(user.timestamp)
            },
            {
              name: "Last Updated",
              value: formatTime(user.lastUpdated)
            },
            {
              name: "Confirm By",
              value: formatTime(user.status.confirmBy) || "N/A"
            },
            {
              name: "Checked In",
              value: formatTime(user.status.checkInTime) || "N/A"
            },
            {
              name: "Email",
              value: user.email
            }
          ]
        },
        {
          name: "Profile",
          fields: [
            {
              name: "Name",
              value: user.profile.name
            },
            {
              name: "Gender",
              value: user.profile.gender
            },
            {
              name: "School",
              value: user.profile.school
            },
            {
              name: "Graduation Year",
              value: user.profile.graduationYear
            },
            {
              name: "Hackathons visited",
              value: user.profile.howManyHackathons
            },
            {
              name: "Description",
              value: user.profile.description
            },
            {
              name: "Essay",
              value: user.profile.essay
            },
            {
              name: "Major",
              value: user.profile.major
            },
            {
              name: "Github",
              value: user.profile.github
            },
            {
              name: "Facebook",
              value: user.profile.facebook
            },
            {
              name: "Linkedin",
              value: user.profile.linkedin
            },
            {
              name:"CV link",
              value: user.profile.cvLink
            },
          ]
        },
        {
          name: "Confirmation",
          fields: [
            {
              name: "Phone Number",
              value: user.confirmation.phoneNumber
            },
            {
              name: "Needs Hardware",
              value: user.confirmation.wantsHardware,
              type: "boolean"
            },
            {
              name: "Hardware Requested",
              value: user.confirmation.hardware
            },
            {
              name:"National Card ID",
              value: user.confirmation.nationalCardID
            }
          ]
        },
        {
          name: "Travel",
          fields: [
            {
              name: "Additional Notes",
              value: user.confirmation.notes
            }
          ]
        }
      ];
    }

    function onSuccess() {
      swal("Updated!", "New Volunteer Added.", "success");
      $state.reload();
    }

    function onError(data){
      swal("Try again!", data.message, "error")
    }

    $scope.addVolunteer = function(){

      swal("Write the challenge title:", {
        buttons: {cancel: {text: "Cancel",value: null,visible: true}, yes: {text: "Invite",value: true,visible: true} },
        content: {element: "input", attributes: {placeholder: "example@gmail.com",type: "text"} },
      }).then((mail) => { if (!mail) {return;} 
        AuthService.register(
          mail, "hackathon", onSuccess, onError, true)
      });
    };



    $scope.selectUser = selectUser;
  }
]);
angular.module('reg')
  .service('settings', function() {})
  .controller('BaseCtrl', [
    '$scope',
    'EVENT_INFO',
    function($scope, EVENT_INFO){

      $scope.EVENT_INFO = EVENT_INFO;

    }]);

angular.module('reg')
  .controller('adminCtrl', [
    '$scope',
    'UserService',
    function($scope, UserService){
      $scope.loading = true;
    }]);
angular.module('reg')
  .controller('ApplicationCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    '$http',
    'currentUser',
    'settings',
    'Session',
    'UserService',
    'MarketingService',
    function ($scope, $rootScope, $state, $http, currentUser, settings, Session, UserService, MarketingService) {

      // Set up the user
      $scope.user = currentUser.data;

      // Is the student from HostSchool?
      $scope.isHostSchool = $scope.user.email.split('@')[1] == settings.data.hostSchool;

      // If so, default them to adult: true
      if ($scope.isHostSchool) {
        $scope.user.profile.adult = true;
      }

      // Populate the school dropdown
      populateSchools();
      _setupForm();

      populateWilayas();
      populateClubs();

      $scope.regIsClosed = Date.now() > settings.data.timeClose;

      function populateSchools() {
        $http
          .get('/assets/schools.json')
          .then(function (res) {
            var schools = res.data;
            var email = $scope.user.email.split('@')[1];

            if (schools[email]) {
              $scope.user.profile.school = schools[email].school;
              $scope.autoFilledSchool = true;
            }
          });

        $http
          .get('/assets/schools.csv')
          .then(function (res) {
            $scope.schools = res.data.split('\n');
            $scope.schools.push('Other');

            var content = [];

            for (i = 0; i < $scope.schools.length; i++) {
              $scope.schools[i] = $scope.schools[i].trim();
              content.push({ title: $scope.schools[i] })
            }

            $('#school.ui.search')
              .search({
                source: content,
                cache: true,
                onSelect: function (result, response) {
                  $scope.user.profile.school = result.title.trim();
                }
              })
          });
      }


      function populateWilayas() {
        $http
          .get('/assets/wilayas.csv')
          .then(function (res) {
            $scope.wilayas = res.data.split('\n');
            $scope.wilayas.push('Other');

            var content = [];

            for (i = 0; i < $scope.wilayas.length; i++) {
              $scope.wilayas[i] = $scope.wilayas[i].trim();
              content.push({ title: $scope.wilayas[i] })
            }

            $('#wilaya.ui.search')
              .search({
                source: content,
                cache: true,
                onSelect: function (result, response) {
                  $scope.user.profile.wilaya = result.title.trim();
                }
              })
          });
      }


      function populateClubs() {
        $http
          .get('/assets/clubs.csv')
          .then(function (res) {
            $scope.clubs = res.data.split('\n');
            $scope.clubs.push('Other');

            var content = [];

            for (i = 0; i < $scope.clubs.length; i++) {
              $scope.clubs[i] = $scope.clubs[i].trim();
              content.push({ title: $scope.clubs[i] })
            }

            $('#club.ui.search')
              .search({
                source: content,
                cache: true,
                onSelect: function (result, response) {
                  $scope.club = result.title.trim();
                }
              })
          });
        if ($scope.user.profile.source != undefined) {
          $scope.UserSource = $scope.user.profile.source.split('#')[0];
          $scope.club = $scope.user.profile.source.split('#')[1];
        }
      }


      function removeDuplicates(myArr, prop) {
        return myArr.filter((obj, pos, arr) => {
          return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
        });
      }

      function sendMarketingEmails() {
        MarketingService.getAll().then(teams => {
          var emails = [];
          teams.data.forEach(team => {
            var isTeammate = false;
            team.members.forEach(member => {
              if (member == currentUser.data.email) {
                isTeammate = true;
              }
            });
            if (isTeammate) {
              team.members.forEach(member => {
                if (!(member == currentUser.data.email)) {
                  emails.push({ email: member, event: team.event })
                }
              });
            }
          });
          removeDuplicates(emails, 'email').forEach(teammate => {
            MarketingService.sendFriendInvite(currentUser.data.profile.name, teammate)
          });
        })
      }


      function _updateUser(e) {

        //Check if User's first submission
        var sendMail = true;
        if (currentUser.data.status.completedProfile) { sendMail = false }

        // Get user Source
        if ($scope.UserSource != '2') { $scope.user.profile.source = $scope.UserSource }
        else { $scope.user.profile.source = $scope.UserSource + "#" + $scope.club }

        UserService
          .updateProfile(Session.getUserId(), $scope.user.profile)
          .then(response => {
            swal("Awesome!", "Your application has been saved.", "success").then(value => {
              if (sendMail) { sendMarketingEmails(); }
              $state.go("app.dashboard");
            });
          }, response => {
            swal("Uh oh!", "Something went wrong.", "error");
          });

      }

      function isMinor() {
        return !$scope.user.profile.adult;
      }

      function minorsAreAllowed() {
        return settings.data.allowMinors;
      }

      function minorsValidation() {
        // Are minors allowed to register?
        if (isMinor() && !minorsAreAllowed()) {
          return false;
        }
        return true;
      }

      function _setupForm() {
        // Custom minors validation rule
        $.fn.form.settings.rules.allowMinors = function (value) {
          return minorsValidation();
        };

        // Semantic-UI form valid ation
        $('.ui.form').form({
          on: 'blur',
          inline: true,
          fields: {
            name: {
              identifier: 'name',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your name.'
                }
              ]
            },
            school: {
              identifier: 'school',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your school name.'
                }
              ]
            },
            Wilaya: {
              identifier: 'Wilaya',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your wilaya name.'
                }
              ]
            },
            year: {
              identifier: 'year',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please select your graduation year.'
                }
              ]
            },
            gender: {
              identifier: 'gender',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please select a gender. '
                }
              ]
            },
            howManyHackathons: {
              identifier: 'howManyHackathons',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please select how many hackathons you have attended.'
                }
              ]
            },
            adult: {
              identifier: 'adult',
              rules: [
                {
                  type: 'allowMinors',
                  prompt: 'You must be an adult, or an ESI student.'
                }
              ]
            },
            study: {
              identifier: 'study',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your major .'
                }
              ]
            },
            description: {
              identifier: 'description',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please describe yourself .'
                }
              ]
            },
            essay: {
              identifier: 'essay',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please tell us about your motivation .'
                }
              ]
            },
            linkedin: {
              identifier: 'linkedin',
              rules: [
                {
                  type: 'url',
                  prompt: 'Please enter a valid Linkedin URL .'
                }
              ]
            },
            facebook: {
              identifier: 'facebook',
              rules: [
                {
                  type: 'url',
                  prompt: 'Please enter a valid Facebook URL .'
                }
              ]
            },
            github: {
              identifier: 'github',
              rules: [
                {
                  type: 'url',
                  prompt: 'Please enter a valid GitHub URL .'
                }
              ]
            },
            UserSource: {
              identifier: 'UserSource',
              rules: [
                {
                  type: 'empty',
                  prompt: 'How did you hear about us ?'
                }
              ]
            },
            cvLink: {
              identifier: 'cvLink',
              rules: [
                {
                  type: 'url',
                  prompt: 'You must add a link to your CV.'
                }
              ]
            }
          }
        });
      }

      $scope.submitForm = function () {
        if ($('.ui.form').form('is valid')) {
          // $('.ui.submit.button').click();
          _updateUser();
        } else {
          swal("Uh oh!", "Please Fill The Required Fields", "error");
        }
      };
    }]);

angular.module('reg')
  .controller('ChallengesCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    '$http',
    'currentUser',
    'Session',
    'ChallengeService',
    'UserService',
    'SolvedCTFService',
    function($scope, $rootScope, $state, $http, currentUser, Session, ChallengeService, UserService, SolvedCTFService) {

      
      SolvedCTFService.getAll().then(response => {
        solvedChallenges= response.data.filter(s => s.user==currentUser.data._id)
      });

      

      ChallengeService.getAll().then(response => {
        $scope.challenges = response.data;
      });



      function onSuccess(challenge) {
        swal("Awesome!", "That's correct, and you just earned +"+ challenge.points +" points.", "success")
        $state.reload()

      }

      function onError(data){
        swal("Try again!", data.message, "error") 
      }


      $scope.solveChallenge = function(challenge,answer, isenter) {
        if (isenter){
          SolvedCTFService.solve(challenge,currentUser,answer,onSuccess,onError);
        }else{
          SolvedCTFService.solve(challenge,currentUser,answer,onSuccess);
        }
        
      }

      
      $scope.showChallenge = function(challenge) {

        ChallengeService.get(challenge._id).then(response => {

          swal(response.data.title, response.data.description)

        })
      }




      SolvedCTFService.getAll().then(response => {
        allChallenges= response.data
        var Result =[]

        allChallenges.forEach(element => {
          userChallenges = allChallenges.filter(s => s.user==element.user)
          var pointsCount = 0;

          userChallenges.forEach(challenge => { pointsCount+=challenge.points });
          
          UserService.get(element.user).then(user =>{

            var grade=[]
            grade[2019] = "3CS"
            grade[2020] = "2CS"
            grade[2021] = "1CS"
            grade[2022] = "2CP"
            grade[2023] = "1CP"

            if (pointsCount>0) {Result.push({ id:user.data._id, name: user.data.profile.name, grade: grade[user.data.profile.graduationYear] ,points: pointsCount})}

          })

          allChallenges = allChallenges.filter(s => s.user!==element.user)
        });

        $scope.Result = Result;
      });
    

      $scope.rowClass = function(user) {
        
        if (user.id==currentUser.data._id) {
          return "admin";
        }
      };
  
      

    }]);

angular.module('reg')
.controller('CheckinCtrl', [
  '$scope',
  '$state',
  '$stateParams',
  'UserService',
  function($scope, $state, $stateParams, UserService){
    $('#reader').html5_qrcode(function(userID){
          //Change the input fields value and send post request to the backend
          
          UserService.get(userID).then(response => {

            user =response.data;

            if (!user.status.checkedIn) {
              swal({
                title: "Whoa, wait a minute!",
                text: "You are about to check in " + user.profile.name + "!",
                icon: "warning",
                buttons: {
                  cancel: {
                    text: "Cancel",
                    value: null,
                    visible: true
                  },
                  checkIn: {
                    className: "danger-button",
                    closeModal: false,
                    text: "Yes, check them in",
                    value: true,
                    visible: true
                  }
                }
              }).then(value => {
                if (!value) {
                  return;
                }
      
                UserService.checkIn(user._id).then(response => {
                  $scope.queryText = user.email;
                  swal(
                    "Checked in",
                    user.profile.name + " has been checked in.",
                    "success"
                  );
                });
              });
            } else {
              swal(
                "Already checkedIn",
                user.profile.name + " has been checked-in at: "+ formatTime(user.status.checkInTime),
                "warning"
              );
          }
          });

        },
      function(error){
      }, function(videoError){
        //the video stream could be opened
      }
    );
    $scope.pages = [];
    $scope.users = [];
    $scope.sortBy = 'timestamp'
    $scope.sortDir = false

    $scope.filter = deserializeFilters($stateParams.filter);
    $scope.filter.text = $stateParams.query || "";

    function deserializeFilters(text) {
      var out = {};
      if (!text) return out;
      text.split(",").forEach(function(f){out[f]=true});
      return (text.length===0)?{}:out;
    }

    function serializeFilters(filters) {
      var out = "";
      for (var v in filters) {if(typeof(filters[v])==="boolean"&&filters[v]) out += v+",";}
      return (out.length===0)?"":out.substr(0,out.length-1);
    }

    // Semantic-UI moves modal content into a dimmer at the top level.
    // While this is usually nice, it means that with our routing will generate
    // multiple modals if you change state. Kill the top level dimmer node on initial load
    // to prevent this.
    $('.ui.dimmer').remove();
    // Populate the size of the modal for when it appears, with an arbitrary user.
    $scope.selectedUser = {};
    $scope.selectedUser.sections = generateSections({
      status: "",
      confirmation: {
        dietaryRestrictions: []
      },
      profile: ""
    });

    function updatePage(data) {
      $scope.users = data.users;
      $scope.currentPage = data.page;
      $scope.pageSize = data.size;

      var p = [];
      for (var i = 0; i < data.totalPages; i++) {
        p.push(i);
      }
      $scope.pages = p;
    }

    UserService.getPage($stateParams.page, $stateParams.size, $stateParams.query, $scope.statusFilters)
    .then(response => {

      updatePage(response.data);
    });

    $scope.$watch("queryText", function(queryText) {
      UserService.getPage($stateParams.page, $stateParams.size, queryText, $scope.statusFilters).then(
        response => {
          updatePage(response.data);
        }
      );
    });


    $scope.applyStatusFilter = function () {
      UserService
        .getPage($stateParams.page, $stateParams.size, $scope.queryText, $scope.statusFilters).then(
          response => {
            updatePage(response.data);
        });
    };


    $scope.goToPage = function(page) {
      $state.go("app.admin.users", {
        page: page,
        size: $stateParams.size || 20
      });
    };

    $scope.checkIn = function($event, user, index) {
      $event.stopPropagation();

      if (!user.status.checkedIn) {
        swal({
          title: "Whoa, wait a minute!",
          text: "You are about to check in " + user.profile.name + "!",
          icon: "warning",
          buttons: {
            cancel: {
              text: "Cancel",
              value: null,
              visible: true
            },
            checkIn: {
              className: "danger-button",
              closeModal: false,
              text: "Yes, check them in",
              value: true,
              visible: true
            }
          }
        }).then(value => {
          if (!value) {
            return;
          }

          UserService.checkIn(user._id).then(response => {
            $scope.users[index] = response.data;
            swal(
              "Checked in",
              response.data.profile.name + " has been checked in.",
              "success"
            );
            $state.reload();
          });
        });
      } else {
        swal(
          "Already checkedIn",
          user.profile.name + " has been checked-in at: "+ formatTime(user.status.checkInTime),
          "warning"
        );
      }
    };

    function formatTime(time) {
      if (time) {
        return moment(time).format("MMMM Do YYYY, h:mm:ss a");
      }
    }

    $scope.rowClass = function(user) {
      if (user.admin) {
        return "admin";
      }
      if (user.status.confirmed) {
        return "positive";
      }
      if (user.status.admitted && !user.status.confirmed) {
        return "warning";
      }
    };

    function selectUser(user) {
      $scope.selectedUser = user;
      $scope.selectedUser.sections = generateSections(user);
      $(".long.user.modal").modal("show");
    }

    function generateSections(user) {
      return [
        {
          name: "Basic Info",
          fields: [
            {
              name: "Created On",
              value: formatTime(user.timestamp)
            },
            {
              name: "Last Updated",
              value: formatTime(user.lastUpdated)
            },
            {
              name: "Confirm By",
              value: formatTime(user.status.confirmBy) || "N/A"
            },
            {
              name: "Checked In",
              value: formatTime(user.status.checkInTime) || "N/A"
            },
            {
              name: "Email",
              value: user.email
            }
          ]
        },
        {
          name: "Profile",
          fields: [
            {
              name: "Name",
              value: user.profile.name
            },
            {
              name: "Gender",
              value: user.profile.gender
            },
            {
              name: "School",
              value: user.profile.school
            },
            {
              name: "Graduation Year",
              value: user.profile.graduationYear
            },
            {
              name: "Hackathons visited",
              value: user.profile.howManyHackathons
            },
            {
              name: "Description",
              value: user.profile.description
            },
            {
              name: "Essay",
              value: user.profile.essay
            },
            {
              name: "Major",
              value: user.profile.major
            },
            {
              name: "Github",
              value: user.profile.github
            },
            {
              name: "Facebook",
              value: user.profile.facebook
            },
            {
              name: "Linkedin",
              value: user.profile.linkedin
            }
          ]
        },
        {
          name: "Confirmation",
          fields: [
            {
              name: "Phone Number",
              value: user.confirmation.phoneNumber
            },
            {
              name: "Needs Hardware",
              value: user.confirmation.wantsHardware,
              type: "boolean"
            },
            {
              name: "Hardware Requested",
              value: user.confirmation.hardware
            }
          ]
        },
        {
          name: "Travel",
          fields: [
            {
              name: "Additional Notes",
              value: user.confirmation.notes
            }
          ]
        }
      ];
    }
    $scope.selectUser = selectUser;
  }]);
angular.module('reg')
  .controller('ConfirmationCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'currentUser',
    'Utils',
    'UserService',
    function($scope, $rootScope, $state, currentUser, Utils, UserService){

      // Set up the user
      var user = currentUser.data;
      $scope.user = user;

      $scope.pastConfirmation = Date.now() > user.status.confirmBy;

      $scope.formatTime = Utils.formatTime;

      _setupForm();

      $scope.fileName = user._id + "_" + user.profile.name.split(" ").join("_");

      // -------------------------------
      // All this just for dietary restriction checkboxes fml

      var dietaryRestrictions = {
        'Vegetarian': false,
        'Vegan': false,
        'Halal': false,
        'Kosher': false,
        'Nut Allergy': false
      };

      if (user.confirmation.dietaryRestrictions){
        user.confirmation.dietaryRestrictions.forEach(function(restriction){
          if (restriction in dietaryRestrictions){
            dietaryRestrictions[restriction] = true;
          }
        });
      }

      $scope.dietaryRestrictions = dietaryRestrictions;

      // -------------------------------

      function _updateUser(e){
        var confirmation = $scope.user.confirmation;
        // Get the dietary restrictions as an array
        var drs = [];
        Object.keys($scope.dietaryRestrictions).forEach(function(key){
          if ($scope.dietaryRestrictions[key]){
            drs.push(key);
          }
        });
        confirmation.dietaryRestrictions = drs;

        UserService
          .updateConfirmation(user._id, confirmation)
          .then(response => {
            swal("Woo!", "You're confirmed!", "success").then(value => {
              $state.go("app.dashboard");
            });
          }, response => {
            swal("Uh oh!", "Something went wrong.", "error");
          });
      }

      function _setupForm(){
        // Semantic-UI form validation
        $('.ui.form').form({
          fields: {
            shirt: {
              identifier: 'shirt',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please give us a shirt size!'
                }
              ]
            },
            phone: {
              identifier: 'phone',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter a phone number.'
                }
              ]
            },
            signatureCodeOfConduct: {
              identifier: 'signatureCodeOfConduct',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please type your digital signature.'
                }
              ]
            },
            nationalCardID: {
              identifier: 'nationalCardID',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please type your National Card ID.'
                }
              ]
            },
          }
        });
      }

      $scope.submitForm = function(){
        if ($('.ui.form').form('is valid')){
          _updateUser();
        } else {
          swal("Uh oh!", "Please Fill The Required Fields", "error");
        }
      };

    }]);

angular.module('reg')
  .controller('DashboardCtrl', [
    '$rootScope',
    '$scope',
    '$sce',
    'currentUser',
    'settings',
    'Utils',
    'AuthService',
    'UserService',
    'EVENT_INFO',
    'DASHBOARD',
    function($rootScope, $scope, $sce, currentUser, settings, Utils, AuthService, UserService, EVENT_INFO, DASHBOARD){
      var Settings = settings.data;
      var user = currentUser.data;
      $scope.user = user;
      $scope.timeClose = Utils.formatTime(Settings.timeClose);
      $scope.timeConfirm = Utils.formatTime(Settings.timeConfirm);

      $scope.DASHBOARD = DASHBOARD;

      for (var msg in $scope.DASHBOARD) {
        if ($scope.DASHBOARD[msg].includes('[APP_DEADLINE]')) {
          $scope.DASHBOARD[msg] = $scope.DASHBOARD[msg].replace('[APP_DEADLINE]', Utils.formatTime(Settings.timeClose));
        }
        if ($scope.DASHBOARD[msg].includes('[CONFIRM_DEADLINE]')) {
          $scope.DASHBOARD[msg] = $scope.DASHBOARD[msg].replace('[CONFIRM_DEADLINE]', Utils.formatTime(user.status.confirmBy));
        }
      }

      // Is registration open?
      var regIsOpen = $scope.regIsOpen = Utils.isRegOpen(Settings);

      // Is it past the user's confirmation time?
      var pastConfirmation = $scope.pastConfirmation = Utils.isAfter(user.status.confirmBy);

      $scope.dashState = function(status){
        var user = $scope.user;
        switch (status) {
          case 'unverified':
            return !user.verified;
          case 'openAndIncomplete':
            return regIsOpen && user.verified && !user.status.completedProfile;
          case 'openAndSubmitted':
            return regIsOpen && user.status.completedProfile && !user.status.admitted;
          case 'closedAndIncomplete':
            return !regIsOpen && !user.status.completedProfile && !user.status.admitted;
          case 'closedAndSubmitted': // Waitlisted State
            return !regIsOpen && user.status.completedProfile && !user.status.admitted;
          case 'admittedAndCanConfirm':
            return !pastConfirmation &&
              user.status.admitted &&
              !user.status.confirmed &&
              !user.status.declined;
          case 'admittedAndCannotConfirm':
            return pastConfirmation &&
              user.status.admitted &&
              !user.status.confirmed &&
              !user.status.declined;
          case 'confirmed':
            return user.status.admitted && user.status.confirmed && !user.status.declined;
          case 'declined':
            return user.status.declined;
        }
        return false;
      };

      $scope.showWaitlist = !regIsOpen && user.status.completedProfile && !user.status.admitted;

      $scope.resendEmail = function(){
        AuthService
          .resendVerificationEmail()
          .then(response => {
            swal("Check your Inbox!", "Your email has been sent.", "success"); 
            
          });
      };

      // $scope.printConfirmation =function(ImageURL){

      //   html2canvas($('#qrCode'), {
      //     allowTaint: true,
      //     onrendered: function (canvas) {
      //         var imgData = canvas.toDataURL("image/jpeg", 1.0);
      //         var pdf = new jsPDF('p', 'mm', 'a0');
  
      //         pdf.addImage(imgData, 'JPEG', 0, 0);
      //         pdf.save("Current Data2.pdf")
      //     }
      // });
      
      // }


      // -----------------------------------------------------
      // Text!
      // -----------------------------------------------------
      var converter = new showdown.Converter();
      $scope.acceptanceText = $sce.trustAsHtml(converter.makeHtml(Settings.acceptanceText));
      $scope.confirmationText = $sce.trustAsHtml(converter.makeHtml(Settings.confirmationText));
      $scope.waitlistText = $sce.trustAsHtml(converter.makeHtml(Settings.waitlistText));

      $scope.declineAdmission = function(){

      swal({
        title: "Whoa!",
        text: "Are you sure you would like to decline your admission? \n\n You can't go back!",
        icon: "warning",
        buttons: {
          cancel: {
            text: "Cancel",
            value: null,
            visible: true
          },
          confirm: {
            text: "Yes, I can't make it",
            value: true,
            visible: true,
            className: "danger-button"
          }
        }
      }).then(value => {
        if (!value) {
          return;
        }

        UserService
          .declineAdmission(user._id)
          .then(response => {
            $rootScope.currentUser = response.data;
            $scope.user = response.data;
          });
      });
    };
  }]);

angular.module('reg')
  .controller('HomeCtrl', [
    '$rootScope',
    '$scope',
    '$http',
    '$state',
    'settings',
    'Utils',
    'AuthService',
    'EVENT_INFO',
    function($rootScope, $scope, $http, $state, settings, Utils, AuthService, EVENT_INFO){
      $scope.loading = true;

      $scope.EVENT_INFO = EVENT_INFO;

      var Settings = settings.data;
      $scope.regIsOpen = Utils.isRegOpen(Settings);


      // Is registration open?
      var Settings = settings.data;
      $scope.regIsOpen = Utils.isRegOpen(Settings);

      // Start state for login
      $scope.loginState = 'login';

      function onSuccess() {
        $state.go('app.dashboard');
      }

      function onError(data){
        $scope.error = data.message;
      }

      function resetError(){
        $scope.error = null;
      }

      $scope.login = function(){
        resetError();
        AuthService.loginWithPassword(
          $scope.email, $scope.password, onSuccess, onError);
      };

      $scope.register = function(){
        resetError();
        AuthService.register(
          $scope.email, $scope.password, onSuccess, onError);
      };

      $scope.setLoginState = function(state) {
        $scope.loginState = state;
      };

      $scope.sendResetEmail = function() {
        var email = $scope.email;
        AuthService.sendResetEmail(email);
        swal("Don't sweat!", "An email should be sent to you shortly.", "success");
      };




      $scope.loading = false;

    }]);

angular.module('reg')
  .controller('LoginCtrl', [
    '$scope',
    '$http',
    '$state',
    'settings',
    'Utils',
    'AuthService',
    'EVENT_INFO',
    function($scope, $http, $state, settings, Utils, AuthService, EVENT_INFO){

      $scope.EVENT_INFO = EVENT_INFO;

      // Is registration open?
      var Settings = settings.data;
      $scope.regIsOpen = Utils.isRegOpen(Settings);

      // Start state for login
      $scope.loginState = 'login';

      function onSuccess() {
        $state.go('app.dashboard');
      }

      function onError(data){
        $scope.error = data.message;
      }

      function resetError(){
        $scope.error = null;
      }

      $scope.login = function(){
        resetError();
        AuthService.loginWithPassword(
          $scope.email, $scope.password, onSuccess, onError);
      };

      $scope.register = function(){
        resetError();
        AuthService.register(
          $scope.email, $scope.password, onSuccess, onError);
      };

      $scope.setLoginState = function(state) {
        $scope.loginState = state;
      };

      $scope.sendResetEmail = function() {
        var email = $scope.email;
        AuthService.sendResetEmail(email);
        swal("Don't sweat!", "An email should be sent to you shortly.", "success");
      };

    }
  ]);

angular.module('reg')
  .controller('ResetCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    'AuthService',
    function($scope, $stateParams, $state, AuthService){
      var token = $stateParams.token;

      $scope.loading = true;

      $scope.changePassword = function(){
        var password = $scope.password;
        var confirm = $scope.confirm;

        if (password !== confirm){
          $scope.error = "Passwords don't match!";
          $scope.confirm = "";
          return;
        }

        AuthService.resetPassword(
          token,
          $scope.password,
          message => {
            swal("Neato!", "Your password has been changed!", "success").then(value => {
              $state.go("home");
            });
          },
          data => {
            $scope.error = data.message;
            $scope.loading = false;
        });
      };
    }]);

angular.module('reg')
  .service('settings', function() {})
  .controller('SidebarCtrl', [
    '$rootScope',
    '$scope',
    'SettingsService',
    'Utils',
    'AuthService',
    'Session',
    'EVENT_INFO',
    function($rootScope, $scope, SettingsService, Utils, AuthService, Session, EVENT_INFO){

      var user = $rootScope.currentUser;

      $scope.EVENT_INFO = EVENT_INFO;

      $scope.pastConfirmation = Utils.isAfter(user.status.confirmBy);
      //$scope.pastSatart = Utils.isAfter(settings.timeStart);

      SettingsService
      .getPublicSettings()
      .then(response => {
        $scope.pastSatart = Utils.isAfter(response.data.timeStart)
      });

      $scope.logout = function(){
        AuthService.logout();
      };

      $scope.showSidebar = false;
      $scope.toggleSidebar = function(){
        $scope.showSidebar = !$scope.showSidebar;
      };

      // oh god jQuery hack
      $('.item').on('click', function(){
        $scope.showSidebar = false;
      });

    }]);



angular.module('reg')
  .controller('TeamCtrl', [
    '$scope',
    '$state',
    '$timeout',
    'currentUser',
    'settings',
    'Utils',
    'UserService',
    'TeamService',
    'TEAM',
    function ($scope, $state, $timeout, currentUser, settings, Utils, UserService, TeamService, TEAM) {
      // Get the current user's most recent data.
      var Settings = settings.data;

      $scope.regIsOpen = Utils.isRegOpen(Settings);

      $scope.user = currentUser.data;

      function isTeamMember(teams, Userid) {
        var test = false;
        teams.forEach(team => {
          team.members.forEach(member => {
            if (member.id == Userid) test = true;
          });
        });
        return test;
      }

      function selectMember(memberId) {
        UserService.get(memberId).then(response => {
          user = response.data
          $scope.selectedUser = user;
          $scope.selectedUser.sections = generateSections(user);
        });
        console.log(user);
        $(".long.user.modal").modal("show");
      }

      function generateSections(user) {
        return [
          {
            name: "Profile",
            fields: [
              {
                name: "Gender",
                value: user.profile.gender
              },
              {
                name: "School",
                value: user.profile.school
              },
              {
                name: "Github",
                value: user.profile.github
              },
              {
                name: "Linkedin",
                value: user.profile.linkedin
              },
            ]
          },
        ];
      }

      function formatTime(time) {
        if (time) {
          return moment(time).format("MMMM Do YYYY, h:mm:ss a");
        }
      }

      $scope.selectMember = selectMember;


      $scope.isjoined = function (team) {
        var test = false;
        team.joinRequests.forEach(member => {
          if (member.id == currentUser.data._id) test = true;
        })
        return test;
      }

      TeamService.getAll().then(teams => {
        $scope.isTeamAdmin = false;
        $scope.isTeamMember = false;
        teams.data.forEach(team => {
          team.isMaxteam = false;

          if (team.members.length >= Settings.maxTeamSize) {
            team.isColosed = true;
            team.isMaxteam = true;
          }

          if (team.members[0].id == currentUser.data._id) {
            team.joinRequests.forEach(member => {
              if (isTeamMember(teams.data, member.id)) {
                member.unavailable = true;
              } else { member.unavailable = false }
            });
            $scope.userAdminTeam = team;
            $scope.isTeamAdmin = true;
          } else {
            team.members.forEach(member => {
              if (member.id == currentUser.data._id) {
                $scope.userMemberTeam = team;
                $scope.isTeamMember = true;
              }
            })
          }
        })
        $scope.teams = teams.data;

      });


      $scope.createTeam = function () {

        teamData = {
          description: $scope.newTeam_description,
          members: [{ id: currentUser.data._id, name: currentUser.data.profile.name, skill: $scope.newTeam_Adminskill }],
          skills: { code: $scope.skillcode, design: $scope.skilldesign, hardware: $scope.skillhardware, idea: $scope.skillidea },
          isColosed: false,
        }
        console.log(teamData);
        console.log($scope.newTeam_Adminskill);

        TeamService.create(teamData);
        $state.reload();
      };


      $scope.ShowcreateTeam = function () {
        $scope.ShowNewTeamFrom = true;
        $scope.skillcode = true
        $scope.skilldesign = true
        $scope.skillhardware = true
        $scope.skillidea = true
        $scope.newTeam_Adminskill = "code"
      }


      $scope.ShowJoinTeam = function(){
        $scope.ShowJoinTeamFrom = true;  
      }


      $scope.joinTeamCode = function () {

        teamID = $scope.newTeam_Code;
        newTeam_skill= $scope.newTeam_skill;

        newuser= {id:currentUser.data._id, name:currentUser.data.profile.name, skill:newTeam_skill};
        TeamService.join(teamID,newuser).then( e=>         
          swal(
          "Joined",
          "You have appliced to join this team, wait for the Team-Admin to accept your application.",
          "success"
        )
        ).catch(err=> 
          swal(
            "Team not found",
            "The team code you entered doesn't exist.",
            "error"
          )
          ); 
        $state.reload();
      }
      
      $scope.joinTeam = function (team) {

        var value;
        const select = document.createElement('select');
        select.className = 'select-custom'


        var option = document.createElement('option');
        option.disabled = true;
        option.innerHTML = 'Select a skill';
        option.value = "code"
        select.appendChild(option);


        if (team.skills.code) {
          option = document.createElement('option');
          option.innerHTML = 'Code';
          option.value = "code"
          select.appendChild(option);
        }
        if (team.skills.design) {
          option = document.createElement('option');
          option.innerHTML = 'Design';
          option.value = "design"
          select.appendChild(option);
        }
        if (team.skills.hardware) {
          option = document.createElement('option');
          option.innerHTML = 'Hardware';
          option.value = "hardware"
          select.appendChild(option);
        }
        if (team.skills.idea) {
          option = document.createElement('option');
          option.innerHTML = 'Idea';
          option.value = "idea"
          select.appendChild(option);
        }

        select.onchange = function selectChanged(e) {
          value = e.target.value
        }

        swal({
          title: "Please select your skill to join",

          content: {
            element: select,
          }
        }).then(function () {

          newuser = { id: currentUser.data._id, name: currentUser.data.profile.name, skill: value };
          console.log(team._id);
          
          TeamService.join(team._id, newuser).then( e=>         
            swal(
            "Joined",
            "You have appliced to join this team, wait for the Team-Admin to accept your application.",
            "success"
          )
          ).catch(err=> 
            swal(
              "Team not found",
              "The team code you entered doesn't exist.",
              "error"
            )
            ); 
          $state.reload();
        })
      }


      $scope.acceptMember = function (teamID, member, index) {

        swal({
          title: "Whoa, wait a minute!",
          text: "You are about to accept " + member.name + " to your team! This will send him a notification email and will show in the public teams page.",
          icon: "warning",
          buttons: {
            cancel: {
              text: "Cancel",
              value: null,
              visible: true
            },
            checkIn: {
              className: "danger-button",
              closeModal: false,
              text: "Yes, let him in",
              value: true,
              visible: true
            }
          }
        }).then(value => {
          if (!value) {
            return;
          }
          TeamService.acceptMember(teamID, member, Settings.maxTeamSize).then(response => {
            if (response == "maxTeamSize") {
              swal(
                "Error",
                "Maximum number of members (" + Settings.maxTeamSize + ") reached",
                "error"
              );
            } else {
              TeamService.removejoin(teamID, index, false).then(response2 => {
                swal(
                  "Accepted",
                  member.name + " has been accepted to your team.",
                  "success"
                );
                $state.reload();
              });
            }
          });
        });
      }



      $scope.refuseMember = function (teamID, member, index) {
        swal({
          title: "Whoa, wait a minute!",
          text: "You are about to refuse " + member.name + " from your team! This will send him a notification email.",
          icon: "warning",
          buttons: {
            cancel: {
              text: "Cancel",
              value: null,
              visible: true
            },
            checkIn: {
              className: "danger-button",
              closeModal: false,
              text: "Yes, refuse him",
              value: true,
              visible: true
            }
          }
        }).then(value => {
          if (!value) {
            return;
          }
          TeamService.removejoin(teamID, index, member).then(response => {
            swal(
              "Refused",
              member.name + " has been refused from your team.",
              "success"
            );
            $state.reload();
          });
        });
      }


      $scope.removeMemberfromTeam = function (teamID, member, index) {
        swal({
          title: "Whoa, wait a minute!",
          text: "You are about to remove " + member.name + " from your team! This will send him a notification email.",
          icon: "warning",
          buttons: {
            cancel: {
              text: "Cancel",
              value: null,
              visible: true
            },
            checkIn: {
              className: "danger-button",
              closeModal: false,
              text: "Yes, remove him",
              value: true,
              visible: true
            }
          }
        }).then(value => {
          if (!value) {
            return;
          }
          TeamService.removemember(teamID, index, member.id).then(response => {
            if (response == "removingAdmin") {
              swal(
                "Error",
                "You can't remove the Team Admin, But you can close the team.",
                "error"
              );
            } else {
              TeamService.removejoin(teamID, index, false).then(response2 => {
                swal(
                  "Removed",
                  member.name + " has been removed from your team.",
                  "success"
                );
                $state.reload();
              });
            }
          });
        });
      }



      $scope.removeTeam = function (team) {
        swal({
          title: "Whoa, wait a minute!",
          text: "You are about to remove this team with all it's members! This will send them a notification email. You need to find another team to work with.",
          icon: "warning",
          buttons: {
            cancel: {
              text: "Cancel",
              value: null,
              visible: true
            },
            checkIn: {
              className: "danger-button",
              closeModal: false,
              text: "Yes, remove team",
              value: true,
              visible: true
            }
          }
        }).then(value => {
          if (!value) {
            return;
          }

          email = {
            subject: "Your team has been removed",
            title: "Time for a backup plan",
            body: "The team you have been part (Member/requested to join) of has been removed. Please check your dashboard and try to find another team to work with before the hackathon starts."
          }

          TeamService.remove(team._id).then(response => {
            team.members.forEach(user => {
              UserService.sendBasicMail(user.id, email);
            });
            team.joinRequests.forEach(user => {
              UserService.sendBasicMail(user.id, email);
            });

            swal(
              "Removed",
              "Team has been removed.",
              "success"
            );
            $state.reload();
          });
        });
      }


      $scope.leaveTeam = function (team) {
        swal({
          title: "Whoa, wait a minute!",
          text: "You are about to leave your team! This will send the admin a notification email.",
          icon: "warning",
          buttons: {
            cancel: {
              text: "Cancel",
              value: null,
              visible: true
            },
            checkIn: {
              className: "danger-button",
              closeModal: false,
              text: "Yes, remove him",
              value: true,
              visible: true
            }
          }
        }).then(value => {
          if (!value) {
            return;
          }
          var index = 0;
          team.members.forEach(member => {
            if (member.id == currentUser.data._id) {
              TeamService.removemember(team._id, index).then(response => {
                swal(
                  "Removed",
                  "You have successfully left this team. Please find another team or create your own.",
                  "success"
                );
                $state.reload();
              });

            }
            index++;
          })
        });
      }


      $scope.canceljoinTeam = function (team) {
        swal({
          title: "Whoa, wait a minute!",
          text: "You are about to cancel your request to join this team!",
          icon: "warning",
          buttons: {
            cancel: {
              text: "No",
              value: null,
              visible: true
            },
            checkIn: {
              className: "danger-button",
              closeModal: false,
              text: "Yes, Cancel",
              value: true,
              visible: true
            }
          }
        }).then(value => {
          if (!value) {
            return;
          }
          var index = 0;

          team.joinRequests.forEach(member => {
            if (member.id == currentUser.data._id) {
              TeamService.removejoin(team._id, index, false).then(response => {
                swal(
                  "Removed",
                  "You have successfully canceled you request to join this team. Please find another team or create your own.",
                  "success"
                );
                $state.reload();
              });

            }
            index++;
          })
        });
      }


      $scope.toggleCloseTeam = function (teamID, status) {
        if (status == true) {
          text = "You are about to Close this team. This won't allow other members to join your team!"
        } else { text = "You are about to reopen this team. This will allow other members to join your team!" }

        swal({
          title: "Whoa, wait a minute!",
          text: text,
          icon: "warning",
          buttons: {
            cancel: {
              text: "No",
              value: null,
              visible: true
            },
            checkIn: {
              className: "danger-button",
              closeModal: false,
              text: "Yes",
              value: true,
              visible: true
            }
          }
        }).then(value => {
          if (!value) {
            return;
          }
          TeamService.toggleCloseTeam(teamID, status).then(response => {
            swal(
              "Done",
              "Operation successfully Completed.",
              "success"
            );
            $state.reload();
          });
        });
      }



      $scope.toggleHideTeam = function (teamID, status) {
        if (status == true) {
          text = "You are about to Hide this team. This won't allow other members to see your team!"
        } else { text = "You are about to Show this team. This will allow other members to see your team!" }

        swal({
          title: "Whoa, wait a minute!",
          text: text,
          icon: "warning",
          buttons: {
            cancel: {
              text: "No",
              value: null,
              visible: true
            },
            checkIn: {
              className: "danger-button",
              closeModal: false,
              text: "Yes",
              value: true,
              visible: true
            }
          }
        }).then(value => {
          if (!value) {
            return;
          }
          TeamService.toggleHideTeam(teamID, status).then(response => {
            swal(
              "Done",
              "Operation successfully Completed.",
              "success"
            );
            $state.reload();
          });
        });
      }

      $scope.$watch("queryText", function (queryText) {
        TeamService.getSelectedTeams(queryText, $scope.skillsFilters).then(
          response => {
            $scope.teams = response.data.teams;
          }
        );
      });

      $scope.applyskillsFilter = function () {
        TeamService.getSelectedTeams($scope.queryText, $scope.skillsFilters).then(
          response => {
            $scope.teams = response.data.teams;
          }
        );
      };





    }]);

angular.module('reg')
  .controller('VerifyCtrl', [
    '$scope',
    '$stateParams',
    'AuthService',
    function($scope, $stateParams, AuthService){
      var token = $stateParams.token;

      $scope.loading = true;

      if (token) {
        AuthService.verify(token,
          function(user){
            $scope.success = true;
            $scope.loading = false;
          },
          function(err){
            $scope.loading = false;
          });
      }
    }]);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnN0YW50cy5qcyIsInJvdXRlcy5qcyIsImludGVyY2VwdG9ycy9BdXRoSW50ZXJjZXB0b3IuanMiLCJtb2R1bGVzL1Nlc3Npb24uanMiLCJtb2R1bGVzL1V0aWxzLmpzIiwicXJzY2FubmVyL2h0bWw1LXFyY29kZS5taW4uanMiLCJxcnNjYW5uZXIvanNxcmNvZGUtY29tYmluZWQubWluLmpzIiwic2VydmljZXMvQXV0aFNlcnZpY2UuanMiLCJzZXJ2aWNlcy9DaGFsbGVuZ2VTZXJ2aWNlLmpzIiwic2VydmljZXMvTWFya2V0aW5nU2VydmljZS5qcyIsInNlcnZpY2VzL1NldHRpbmdzU2VydmljZS5qcyIsInNlcnZpY2VzL1NvbHZlZENURlNlcnZpY2UuanMiLCJzZXJ2aWNlcy9UZWFtU2VydmljZS5qcyIsInNlcnZpY2VzL1VzZXJTZXJ2aWNlLmpzIiwiYWRtaW4vY2hhbGxlbmdlL2FkbWluQ2hhbGxlbmdlQ3RybC5qcyIsImFkbWluL2NoYWxsZW5nZXMvYWRtaW5DaGFsbGVuZ2VzQ3RybC5qcyIsImFkbWluL21haWwvYWRtaW5NYWlsQ3RybC5qcyIsImFkbWluL21hcmtldGluZy9hZG1pbk1hcmtldGluZ0N0cmwuanMiLCJhZG1pbi9zZXR0aW5ncy9hZG1pblNldHRpbmdzQ3RybC5qcyIsImFkbWluL3RlYW1zL2FkbWluVGVhbXNDdHJsLmpzIiwiYWRtaW4vc3RhdHMvYWRtaW5TdGF0c0N0cmwuanMiLCJhZG1pbi91c2VyL2FkbWluVXNlckN0cmwuanMiLCJhZG1pbi91c2Vycy9hZG1pblVzZXJzQ3RybC5qcyIsIkJhc2VDdHJsLmpzIiwiYWRtaW4vYWRtaW5DdHJsLmpzIiwiYXBwbGljYXRpb24vYXBwbGljYXRpb25DdHJsLmpzIiwiY2hhbGxlbmdlcy9jaGFsbGVuZ2VzQ3RybC5qcyIsImNoZWNraW4vY2hlY2tpbkN0cmwuanMiLCJjb25maXJtYXRpb24vY29uZmlybWF0aW9uQ3RybC5qcyIsImRhc2hib2FyZC9kYXNoYm9hcmRDdHJsLmpzIiwiaG9tZS9Ib21lQ3RybC5qcyIsImxvZ2luL2xvZ2luQ3RybC5qcyIsInJlc2V0L3Jlc2V0Q3RybC5qcyIsInNpZGViYXIvc2lkZWJhckN0cmwuanMiLCJ0ZWFtL3RlYW1DdHJsLmpzIiwidmVyaWZ5L3ZlcmlmeUN0cmwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxNQUFBLFFBQUEsT0FBQSxPQUFBO0VBQ0E7RUFDQTs7O0FBR0E7R0FDQSxPQUFBO0lBQ0E7SUFDQSxTQUFBLGNBQUE7OztNQUdBLGNBQUEsYUFBQSxLQUFBOzs7R0FHQSxJQUFBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsYUFBQSxRQUFBOzs7TUFHQSxJQUFBLFFBQUEsUUFBQTtNQUNBLElBQUEsTUFBQTtRQUNBLFlBQUEsZUFBQTs7Ozs7QUN0QkEsUUFBQSxPQUFBO0tBQ0EsU0FBQSxjQUFBO1FBQ0EsTUFBQTs7S0FFQSxTQUFBLGFBQUE7UUFDQSxZQUFBO1FBQ0Esa0JBQUE7UUFDQSxZQUFBO1FBQ0EsaUJBQUE7UUFDQSxXQUFBO1FBQ0EsNkJBQUE7UUFDQSx1QkFBQTtRQUNBLGdDQUFBO1FBQ0EsbUNBQUE7UUFDQSw2QkFBQTtRQUNBLDBCQUFBO1FBQ0EsVUFBQTs7S0FFQSxTQUFBLE9BQUE7UUFDQSxvQkFBQTs7OztBQ2xCQSxRQUFBLE9BQUE7R0FDQSxPQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7TUFDQTtNQUNBO01BQ0EsbUJBQUE7OztJQUdBLG1CQUFBLFVBQUE7OztJQUdBO09BQ0EsTUFBQSxTQUFBO1FBQ0EsS0FBQTtRQUNBLGFBQUE7UUFDQSxZQUFBO1FBQ0EsTUFBQTtVQUNBLGNBQUE7VUFDQSxlQUFBOztRQUVBLFNBQUE7VUFDQSxnQ0FBQSxTQUFBLGdCQUFBO1lBQ0EsT0FBQSxnQkFBQTs7OztPQUlBLE1BQUEsUUFBQTtRQUNBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsWUFBQTtRQUNBLE1BQUE7VUFDQSxjQUFBO1VBQ0EsZUFBQTs7UUFFQSxTQUFBO1VBQ0EsZ0NBQUEsU0FBQSxnQkFBQTtZQUNBLE9BQUEsZ0JBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FtQkEsTUFBQSxPQUFBO1FBQ0EsT0FBQTtVQUNBLElBQUE7WUFDQSxhQUFBO1lBQ0EsWUFBQTs7VUFFQSxlQUFBO1lBQ0EsYUFBQTtZQUNBLFlBQUE7WUFDQSxTQUFBO2NBQ0EsOEJBQUEsU0FBQSxpQkFBQTtnQkFDQSxPQUFBLGdCQUFBOzs7OztRQUtBLE1BQUE7VUFDQSxjQUFBOzs7T0FHQSxNQUFBLGlCQUFBO1FBQ0EsS0FBQTtRQUNBLGFBQUE7UUFDQSxZQUFBO1FBQ0EsU0FBQTtVQUNBLDZCQUFBLFNBQUEsWUFBQTtZQUNBLE9BQUEsWUFBQTs7VUFFQSw4QkFBQSxTQUFBLGdCQUFBO1lBQ0EsT0FBQSxnQkFBQTs7OztPQUlBLE1BQUEsbUJBQUE7UUFDQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLFlBQUE7UUFDQSxNQUFBO1VBQ0EsaUJBQUE7O1FBRUEsU0FBQTtVQUNBLDZCQUFBLFNBQUEsWUFBQTtZQUNBLE9BQUEsWUFBQTs7VUFFQSw4QkFBQSxTQUFBLGdCQUFBO1lBQ0EsT0FBQSxnQkFBQTs7OztPQUlBLE1BQUEsb0JBQUE7UUFDQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLFlBQUE7UUFDQSxNQUFBO1VBQ0EsaUJBQUE7O1FBRUEsU0FBQTtVQUNBLDZCQUFBLFNBQUEsWUFBQTtZQUNBLE9BQUEsWUFBQTs7OztPQUlBLE1BQUEsa0JBQUE7UUFDQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLFlBQUE7UUFDQSxNQUFBO1VBQ0EsaUJBQUE7O1FBRUEsU0FBQTtVQUNBLDZCQUFBLFNBQUEsWUFBQTtZQUNBLE9BQUEsWUFBQTs7VUFFQSw4QkFBQSxTQUFBLGdCQUFBO1lBQ0EsT0FBQSxnQkFBQTs7OztPQUlBLE1BQUEsWUFBQTtRQUNBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsWUFBQTtRQUNBLE1BQUE7VUFDQSxpQkFBQTs7UUFFQSxTQUFBO1VBQ0EsNkJBQUEsU0FBQSxZQUFBO1lBQ0EsT0FBQSxZQUFBOztVQUVBLDhCQUFBLFNBQUEsZ0JBQUE7WUFDQSxPQUFBLGdCQUFBOzs7O09BSUEsTUFBQSxhQUFBO1FBQ0EsT0FBQTtVQUNBLElBQUE7WUFDQSxhQUFBO1lBQ0EsWUFBQTs7O1FBR0EsTUFBQTtVQUNBLGNBQUE7OztPQUdBLE1BQUEsZUFBQTtRQUNBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsWUFBQTtRQUNBLE1BQUE7VUFDQSxrQkFBQTs7O09BR0EsTUFBQSxtQkFBQTtRQUNBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsWUFBQTs7T0FFQSxNQUFBLGtCQUFBO1FBQ0EsS0FBQTtRQUNBLGFBQUE7UUFDQSxZQUFBOztPQUVBLE1BQUEsd0JBQUE7UUFDQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLFlBQUE7O09BRUEsTUFBQSx1QkFBQTtRQUNBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsWUFBQTtRQUNBLFNBQUE7VUFDQSxrREFBQSxTQUFBLGNBQUEsaUJBQUE7WUFDQSxPQUFBLGlCQUFBLElBQUEsYUFBQTs7OztPQUlBLE1BQUEsdUJBQUE7UUFDQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLFlBQUE7O09BRUEsTUFBQSxtQkFBQTtRQUNBLEtBQUE7VUFDQTtVQUNBO1VBQ0E7UUFDQSxhQUFBO1FBQ0EsWUFBQTs7T0FFQSxNQUFBLGtCQUFBO1FBQ0EsS0FBQTtRQUNBLGFBQUE7UUFDQSxZQUFBO1FBQ0EsU0FBQTtVQUNBLHdDQUFBLFNBQUEsY0FBQSxZQUFBO1lBQ0EsT0FBQSxZQUFBLElBQUEsYUFBQTs7OztPQUlBLE1BQUEsc0JBQUE7UUFDQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLFlBQUE7O09BRUEsTUFBQSxtQkFBQTtRQUNBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsWUFBQTtRQUNBLE1BQUE7VUFDQSxpQkFBQTs7UUFFQSxTQUFBO1VBQ0EsNkJBQUEsU0FBQSxZQUFBO1lBQ0EsT0FBQSxZQUFBOztVQUVBLDhCQUFBLFNBQUEsZ0JBQUE7WUFDQSxPQUFBLGdCQUFBOzs7O09BSUEsTUFBQSxTQUFBO1FBQ0EsS0FBQTtRQUNBLGFBQUE7UUFDQSxZQUFBO1FBQ0EsTUFBQTtVQUNBLGNBQUE7OztPQUdBLE1BQUEsVUFBQTtRQUNBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsWUFBQTtRQUNBLE1BQUE7VUFDQSxjQUFBOzs7T0FHQSxNQUFBLE9BQUE7UUFDQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLE1BQUE7VUFDQSxjQUFBOzs7O0lBSUEsa0JBQUEsVUFBQTtNQUNBLFNBQUE7Ozs7R0FJQSxJQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7TUFDQTtNQUNBO01BQ0EsU0FBQTs7TUFFQSxXQUFBLElBQUEsdUJBQUEsV0FBQTtTQUNBLFNBQUEsS0FBQSxZQUFBLFNBQUEsZ0JBQUEsWUFBQTs7O01BR0EsV0FBQSxJQUFBLHFCQUFBLFVBQUEsT0FBQSxTQUFBLFVBQUE7O1FBRUEsSUFBQSxlQUFBLFFBQUEsS0FBQTtRQUNBLElBQUEsZ0JBQUEsUUFBQSxLQUFBO1FBQ0EsSUFBQSxlQUFBLFFBQUEsS0FBQTtRQUNBLElBQUEsbUJBQUEsUUFBQSxLQUFBO1FBQ0EsSUFBQSxrQkFBQSxRQUFBLEtBQUE7UUFDQSxJQUFBLGtCQUFBLFFBQUEsS0FBQTs7UUFFQSxJQUFBLGdCQUFBLENBQUEsUUFBQSxZQUFBO1VBQ0EsTUFBQTtVQUNBLE9BQUEsR0FBQTs7O1FBR0EsSUFBQSxpQkFBQSxRQUFBLFlBQUE7VUFDQSxNQUFBO1VBQ0EsT0FBQSxHQUFBOzs7UUFHQSxJQUFBLGdCQUFBLENBQUEsUUFBQSxVQUFBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsT0FBQSxHQUFBOzs7UUFHQSxJQUFBLG9CQUFBLENBQUEsUUFBQSxVQUFBLGFBQUEsZ0JBQUEsQ0FBQSxRQUFBLFVBQUEsT0FBQTtVQUNBLE1BQUE7VUFDQSxPQUFBLEdBQUE7OztRQUdBLElBQUEsbUJBQUEsQ0FBQSxRQUFBLFVBQUEsVUFBQTtVQUNBLE1BQUE7VUFDQSxPQUFBLEdBQUE7OztRQUdBLElBQUEsbUJBQUEsQ0FBQSxRQUFBLFVBQUEsT0FBQSxVQUFBO1VBQ0EsTUFBQTtVQUNBLE9BQUEsR0FBQTs7Ozs7Ozs7QUMvVEEsUUFBQSxPQUFBO0dBQ0EsUUFBQSxtQkFBQTtJQUNBO0lBQ0EsU0FBQSxRQUFBO01BQ0EsT0FBQTtVQUNBLFNBQUEsU0FBQSxPQUFBO1lBQ0EsSUFBQSxRQUFBLFFBQUE7WUFDQSxJQUFBLE1BQUE7Y0FDQSxPQUFBLFFBQUEsb0JBQUE7O1lBRUEsT0FBQTs7Ozs7QUNWQSxRQUFBLE9BQUE7R0FDQSxRQUFBLFdBQUE7SUFDQTtJQUNBO0lBQ0EsU0FBQSxZQUFBLFFBQUE7O0lBRUEsS0FBQSxTQUFBLFNBQUEsT0FBQSxLQUFBO01BQ0EsUUFBQSxhQUFBLE1BQUE7TUFDQSxRQUFBLGFBQUEsU0FBQSxLQUFBO01BQ0EsUUFBQSxhQUFBLGNBQUEsS0FBQSxVQUFBO01BQ0EsV0FBQSxjQUFBOzs7SUFHQSxLQUFBLFVBQUEsU0FBQSxXQUFBO01BQ0EsT0FBQSxRQUFBLGFBQUE7TUFDQSxPQUFBLFFBQUEsYUFBQTtNQUNBLE9BQUEsUUFBQSxhQUFBO01BQ0EsV0FBQSxjQUFBO01BQ0EsSUFBQSxXQUFBO1FBQ0E7Ozs7SUFJQSxLQUFBLFdBQUEsVUFBQTtNQUNBLE9BQUEsUUFBQSxhQUFBOzs7SUFHQSxLQUFBLFlBQUEsVUFBQTtNQUNBLE9BQUEsUUFBQSxhQUFBOzs7SUFHQSxLQUFBLFVBQUEsVUFBQTtNQUNBLE9BQUEsS0FBQSxNQUFBLFFBQUEsYUFBQTs7O0lBR0EsS0FBQSxVQUFBLFNBQUEsS0FBQTtNQUNBLFFBQUEsYUFBQSxjQUFBLEtBQUEsVUFBQTtNQUNBLFdBQUEsY0FBQTs7OztBQ3JDQSxRQUFBLE9BQUE7R0FDQSxRQUFBLFNBQUE7SUFDQSxVQUFBO01BQ0EsT0FBQTtRQUNBLFdBQUEsU0FBQSxTQUFBO1VBQ0EsT0FBQSxLQUFBLFFBQUEsU0FBQSxZQUFBLEtBQUEsUUFBQSxTQUFBOztRQUVBLFNBQUEsU0FBQSxLQUFBO1VBQ0EsT0FBQSxLQUFBLFFBQUE7O1FBRUEsWUFBQSxTQUFBLEtBQUE7O1VBRUEsSUFBQSxDQUFBLEtBQUE7WUFDQSxPQUFBOzs7VUFHQSxPQUFBLElBQUEsS0FBQTs7VUFFQSxPQUFBLE9BQUEsTUFBQSxPQUFBO1lBQ0EsTUFBQSxLQUFBLGVBQUEsTUFBQSxLQUFBOzs7Ozs7QUNuQkEsQ0FBQSxTQUFBLEdBQUE7SUFDQSxPQUFBLEdBQUEsT0FBQTtRQUNBLGNBQUEsU0FBQSxlQUFBLGFBQUEsWUFBQTtZQUNBLE9BQUEsS0FBQSxLQUFBLFdBQUE7Z0JBQ0EsSUFBQSxjQUFBLEVBQUE7O2dCQUVBLElBQUEsU0FBQSxZQUFBO2dCQUNBLElBQUEsUUFBQSxZQUFBOztnQkFFQSxJQUFBLFVBQUEsTUFBQTtvQkFDQSxTQUFBOzs7Z0JBR0EsSUFBQSxTQUFBLE1BQUE7b0JBQ0EsUUFBQTs7OztnQkFJQSxJQUFBLFVBQUEsRUFBQSxtQkFBQSxRQUFBLGlCQUFBLFNBQUEscUNBQUEsU0FBQTtnQkFDQSxJQUFBLGFBQUEsRUFBQSxvQ0FBQSxRQUFBLEtBQUEsa0JBQUEsU0FBQSxLQUFBLHVDQUFBLFNBQUE7O2dCQUVBLElBQUEsUUFBQSxRQUFBO2dCQUNBLElBQUEsU0FBQSxXQUFBO2dCQUNBLElBQUEsVUFBQSxPQUFBLFdBQUE7Z0JBQ0EsSUFBQTs7Z0JBRUEsSUFBQSxPQUFBLFdBQUE7b0JBQ0EsSUFBQSxrQkFBQTt3QkFDQSxRQUFBLFVBQUEsT0FBQSxHQUFBLEdBQUEsS0FBQTs7d0JBRUEsSUFBQTs0QkFDQSxPQUFBOzBCQUNBLE9BQUEsR0FBQTs0QkFDQSxZQUFBLEdBQUE7Ozt3QkFHQSxFQUFBLEtBQUEsWUFBQSxJQUFBLFdBQUEsV0FBQSxNQUFBOzsyQkFFQTt3QkFDQSxFQUFBLEtBQUEsWUFBQSxJQUFBLFdBQUEsV0FBQSxNQUFBOzs7O2dCQUlBLE9BQUEsTUFBQSxPQUFBLE9BQUEsT0FBQSxhQUFBLE9BQUEsVUFBQSxPQUFBO2dCQUNBLFVBQUEsZUFBQSxVQUFBLGdCQUFBLFVBQUEsc0JBQUEsVUFBQSxtQkFBQSxVQUFBOztnQkFFQSxJQUFBLGtCQUFBLFNBQUEsUUFBQTs7b0JBRUEsTUFBQSxZQUFBO29CQUNBLG1CQUFBO29CQUNBLEVBQUEsS0FBQSxZQUFBLElBQUEsVUFBQTs7b0JBRUEsTUFBQTtvQkFDQSxFQUFBLEtBQUEsWUFBQSxJQUFBLFdBQUEsV0FBQSxNQUFBOzs7O2dCQUlBLElBQUEsVUFBQSxjQUFBO29CQUNBLFVBQUEsYUFBQSxDQUFBLE9BQUEsRUFBQSxZQUFBLG1CQUFBLGlCQUFBLFNBQUEsT0FBQTt3QkFDQSxXQUFBLE9BQUE7O3VCQUVBO29CQUNBLFFBQUEsSUFBQTs7OztnQkFJQSxPQUFBLFdBQUEsVUFBQSxRQUFBO29CQUNBLGNBQUEsUUFBQTs7OztRQUlBLG1CQUFBLFdBQUE7WUFDQSxPQUFBLEtBQUEsS0FBQSxXQUFBOztnQkFFQSxFQUFBLE1BQUEsS0FBQSxVQUFBLGlCQUFBLFFBQUEsU0FBQSxZQUFBO29CQUNBLFdBQUE7OztnQkFHQSxhQUFBLEVBQUEsTUFBQSxLQUFBOzs7O0dBSUE7OztBQ2xGQSxTQUFBLElBQUEsTUFBQSxjQUFBLENBQUEsS0FBQSxNQUFBLE1BQUEsS0FBQSxjQUFBLGNBQUEsS0FBQSxpQkFBQSxRQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsUUFBQSxLQUFBLGlCQUFBLGdCQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsZ0JBQUEsU0FBQSxTQUFBLG9CQUFBLFVBQUEsVUFBQSxDQUFBLEtBQUEsb0JBQUEsb0JBQUEsVUFBQSxLQUFBLFNBQUEsSUFBQSxNQUFBLFVBQUEsV0FBQSxLQUFBLFNBQUEsSUFBQSxNQUFBLFdBQUEsS0FBQSxpQkFBQSxzQkFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLHNCQUFBLEtBQUEsaUJBQUEsbUJBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxvQkFBQSxLQUFBLFlBQUEsS0FBQSxpQkFBQSxZQUFBLFVBQUEsQ0FBQSxJQUFBLElBQUEsTUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEtBQUEsU0FBQSxPQUFBLElBQUEsT0FBQSxLQUFBLFNBQUEsR0FBQSxPQUFBLE9BQUEsUUFBQSxLQUFBLFlBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxVQUFBLFNBQUEsUUFBQSxjQUFBLHdCQUFBLFVBQUEsVUFBQSxVQUFBLFVBQUEsQ0FBQSxLQUFBLGNBQUEsY0FBQSxLQUFBLHdCQUFBLHdCQUFBLEtBQUEsU0FBQSxJQUFBLE1BQUEsVUFBQSxVQUFBLFVBQUEsV0FBQSxJQUFBLElBQUEsTUFBQSxFQUFBLFlBQUEsVUFBQSxvQkFBQSxTQUFBLFVBQUEsY0FBQSxFQUFBLEVBQUEsRUFBQSxTQUFBLE9BQUEsSUFBQSxDQUFBLElBQUEsUUFBQSxTQUFBLEdBQUEsT0FBQSxRQUFBLE9BQUEsUUFBQSxjQUFBLGFBQUEsS0FBQSxlQUFBLE1BQUEsS0FBQSxpQkFBQSxnQkFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLGdCQUFBLEtBQUEsaUJBQUEsMEJBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSwwQkFBQSxLQUFBLGlCQUFBLGlCQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsaUJBQUEsS0FBQSxpQkFBQSxzQkFBQSxVQUFBLENBQUEsT0FBQSxHQUFBLEVBQUEsS0FBQSxnQkFBQSxLQUFBLHFCQUFBLFVBQUEsQ0FBQSxJQUFBLFVBQUEsS0FBQSxvQkFBQSxVQUFBLElBQUEsVUFBQSxXQUFBLFVBQUEsVUFBQSxFQUFBLEVBQUEsRUFBQSxHQUFBLFVBQUEsVUFBQSxVQUFBLEVBQUEsRUFBQSxFQUFBLEdBQUEsVUFBQSxVQUFBLEVBQUEsVUFBQSxFQUFBLEVBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxLQUFBLHdCQUFBLE9BQUEsRUFBQSxFQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsd0JBQUEsR0FBQSxFQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxHQUFBLElBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxHQUFBLEdBQUEsR0FBQSxVQUFBLFVBQUEsS0FBQSx3QkFBQSxHQUFBLEVBQUEsRUFBQSxFQUFBLEdBQUEsT0FBQSxVQUFBLFVBQUEsRUFBQSxFQUFBLEVBQUEsVUFBQSxJQUFBLFVBQUEsVUFBQSxFQUFBLEVBQUEsVUFBQSxHQUFBLEdBQUEsS0FBQSxjQUFBLElBQUEsVUFBQSxVQUFBLFVBQUEsR0FBQSxFQUFBLEVBQUEsR0FBQSxVQUFBLFVBQUEsRUFBQSxVQUFBLEdBQUEsRUFBQSxJQUFBLFdBQUEsS0FBQSxvQkFBQSxTQUFBLFFBQUEsQ0FBQSxPQUFBLEtBQUEsU0FBQSxRQUFBLFlBQUEsU0FBQSxlQUFBLENBQUEsT0FBQSxJQUFBLE1BQUEsSUFBQSxRQUFBLEVBQUEsSUFBQSxNQUFBLElBQUEsU0FBQSxFQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxRQUFBLEVBQUEsSUFBQSxNQUFBLEVBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsUUFBQSxFQUFBLElBQUEsTUFBQSxFQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFFBQUEsRUFBQSxJQUFBLE1BQUEsRUFBQSxJQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxRQUFBLEVBQUEsSUFBQSxNQUFBLEVBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFFBQUEsRUFBQSxJQUFBLE1BQUEsRUFBQSxJQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxRQUFBLEVBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxJQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsUUFBQSxFQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsUUFBQSxFQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxJQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxJQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxJQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxJQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE9BQUEsU0FBQSxxQkFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxDQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsaUJBQUEsU0FBQSxPQUFBLENBQUEsSUFBQSxJQUFBLElBQUEsT0FBQSxPQUFBLElBQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLENBQUEsSUFBQSxFQUFBLE9BQUEsR0FBQSxFQUFBLE9BQUEsRUFBQSxHQUFBLFlBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxJQUFBLE9BQUEsR0FBQSxDQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsS0FBQSxZQUFBLE9BQUEsRUFBQSxHQUFBLENBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxLQUFBLGNBQUEsS0FBQSxpQkFBQSxTQUFBLFFBQUEsUUFBQSxDQUFBLElBQUEsSUFBQSxFQUFBLFFBQUEsT0FBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLElBQUEsQ0FBQSxJQUFBLEVBQUEsUUFBQSxHQUFBLEVBQUEsUUFBQSxHQUFBLFlBQUEsS0FBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFFBQUEsR0FBQSxDQUFBLEtBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxZQUFBLFFBQUEsR0FBQSxDQUFBLEtBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxjQUFBLEtBQUEsYUFBQSxVQUFBLENBQUEsT0FBQSxJQUFBLHFCQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQSxTQUFBLE1BQUEsQ0FBQSxPQUFBLElBQUEscUJBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLE1BQUEsU0FBQSxlQUFBLEtBQUEsT0FBQSxDQUFBLEtBQUEsS0FBQSxLQUFBLEtBQUEsT0FBQSxPQUFBLFNBQUEsU0FBQSxNQUFBLENBQUEsS0FBQSxNQUFBLE1BQUEsS0FBQSxvQkFBQSxLQUFBLEtBQUEseUJBQUEsU0FBQSxNQUFBLE1BQUEsSUFBQSxJQUFBLENBQUEsSUFBQSxNQUFBLEtBQUEsSUFBQSxJQUFBLE9BQUEsS0FBQSxJQUFBLElBQUEsT0FBQSxHQUFBLE1BQUEsQ0FBQSxJQUFBLEtBQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxLQUFBLEtBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxJQUFBLE9BQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxPQUFBLE1BQUEsQ0FBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLE1BQUEsRUFBQSxDQUFBLEVBQUEsTUFBQSxJQUFBLE1BQUEsRUFBQSxDQUFBLEVBQUEsTUFBQSxFQUFBLEVBQUEsTUFBQSxFQUFBLE1BQUEsR0FBQSxJQUFBLEdBQUEsTUFBQSxDQUFBLElBQUEsTUFBQSxNQUFBLEVBQUEsRUFBQSxNQUFBLE1BQUEsRUFBQSxFQUFBLEdBQUEsR0FBQSxNQUFBLEtBQUEsTUFBQSxNQUFBLE1BQUEsT0FBQSxRQUFBLFFBQUEsS0FBQSxNQUFBLE1BQUEsTUFBQSxPQUFBLFFBQUEsUUFBQSxHQUFBLE1BQUEsQ0FBQSxJQUFBLE1BQUEsRUFBQSxNQUFBLE1BQUEsRUFBQSxNQUFBLE9BQUEsS0FBQSxLQUFBLE1BQUEsTUFBQSxNQUFBLE9BQUEsR0FBQSxPQUFBLEdBQUEsTUFBQSxFQUFBLENBQUEsR0FBQSxHQUFBLElBQUEsTUFBQSxHQUFBLE1BQUEsT0FBQSxJQUFBLElBQUEsT0FBQSxJQUFBLE1BQUEsT0FBQSxJQUFBLE1BQUEsT0FBQSxLQUFBLEtBQUEsT0FBQSxPQUFBLE9BQUEsU0FBQSxLQUFBLGlDQUFBLFNBQUEsTUFBQSxNQUFBLElBQUEsSUFBQSxDQUFBLElBQUEsT0FBQSxLQUFBLHlCQUFBLE1BQUEsTUFBQSxJQUFBLEtBQUEsTUFBQSxFQUFBLFNBQUEsT0FBQSxJQUFBLE9BQUEsRUFBQSxVQUFBLE1BQUEsT0FBQSxNQUFBLFVBQUEsU0FBQSxHQUFBLFVBQUEsT0FBQSxRQUFBLE1BQUEsQ0FBQSxPQUFBLE1BQUEsRUFBQSxRQUFBLFNBQUEsT0FBQSxTQUFBLE9BQUEsTUFBQSxHQUFBLElBQUEsU0FBQSxLQUFBLE1BQUEsTUFBQSxDQUFBLElBQUEsT0FBQSxPQUFBLE9BQUEsTUFBQSxFQUFBLEVBQUEsVUFBQSxNQUFBLE9BQUEsTUFBQSxVQUFBLFNBQUEsR0FBQSxVQUFBLE9BQUEsU0FBQSxNQUFBLENBQUEsT0FBQSxPQUFBLEVBQUEsUUFBQSxTQUFBLE9BQUEsU0FBQSxPQUFBLE9BQUEsR0FBQSxTQUFBLEtBQUEsTUFBQSxNQUFBLENBQUEsU0FBQSxPQUFBLE9BQUEsUUFBQSxLQUFBLHlCQUFBLE1BQUEsTUFBQSxTQUFBLFVBQUEsT0FBQSxHQUFBLEtBQUEsMEJBQUEsU0FBQSxRQUFBLGFBQUEsQ0FBQSxJQUFBLGVBQUEsS0FBQSxpQ0FBQSxLQUFBLE1BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLGFBQUEsR0FBQSxLQUFBLE1BQUEsYUFBQSxJQUFBLGVBQUEsS0FBQSxpQ0FBQSxLQUFBLE1BQUEsYUFBQSxHQUFBLEtBQUEsTUFBQSxhQUFBLEdBQUEsS0FBQSxNQUFBLFFBQUEsR0FBQSxLQUFBLE1BQUEsUUFBQSxJQUFBLE9BQUEsTUFBQSxnQkFBQSxlQUFBLEVBQUEsTUFBQSxnQkFBQSxlQUFBLEVBQUEsQ0FBQSxlQUFBLGdCQUFBLElBQUEsS0FBQSxvQkFBQSxTQUFBLFFBQUEsU0FBQSxXQUFBLENBQUEsTUFBQSxDQUFBLEtBQUEsMEJBQUEsUUFBQSxVQUFBLEtBQUEsMEJBQUEsUUFBQSxhQUFBLEdBQUEsS0FBQSxTQUFBLFNBQUEsU0FBQSxTQUFBLENBQUEsT0FBQSxNQUFBLFNBQUEsRUFBQSxTQUFBLEVBQUEsTUFBQSxTQUFBLEVBQUEsU0FBQSxFQUFBLEtBQUEsS0FBQSxNQUFBLE1BQUEsTUFBQSxRQUFBLEtBQUEsaUJBQUEsU0FBQSxRQUFBLFNBQUEsV0FBQSxXQUFBLENBQUEsSUFBQSxxQkFBQSxLQUFBLE1BQUEsS0FBQSxTQUFBLFFBQUEsVUFBQSxZQUFBLHFCQUFBLEtBQUEsTUFBQSxLQUFBLFNBQUEsUUFBQSxZQUFBLFlBQUEsVUFBQSxDQUFBLHFCQUFBLHNCQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUEsV0FBQSxLQUFBLEVBQUEsWUFBQSxNQUFBLEtBQUEsRUFBQSxZQUFBLE1BQUEsS0FBQSxFQUFBLEtBQUEsUUFBQSxPQUFBLFdBQUEsS0FBQSxzQkFBQSxTQUFBLHFCQUFBLGNBQUEsY0FBQSxnQkFBQSxDQUFBLElBQUEsVUFBQSxLQUFBLE1BQUEsZ0JBQUEsc0JBQUEsbUJBQUEsS0FBQSxJQUFBLEVBQUEsY0FBQSxXQUFBLG9CQUFBLEtBQUEsSUFBQSxPQUFBLE1BQUEsRUFBQSxjQUFBLFdBQUEsR0FBQSxFQUFBLHFCQUFBLG9CQUFBLG1CQUFBLEtBQUEsUUFBQSxJQUFBLGtCQUFBLEtBQUEsSUFBQSxFQUFBLGNBQUEsV0FBQSxxQkFBQSxLQUFBLElBQUEsT0FBQSxPQUFBLEVBQUEsY0FBQSxXQUFBLGdCQUFBLElBQUEsdUJBQUEsS0FBQSxNQUFBLG1CQUFBLGtCQUFBLG9CQUFBLG1CQUFBLHFCQUFBLGtCQUFBLHFCQUFBLEtBQUEscUJBQUEsT0FBQSxnQkFBQSxRQUFBLEtBQUEsZ0JBQUEsU0FBQSxRQUFBLFNBQUEsV0FBQSxpQkFBQSxVQUFBLENBQUEsSUFBQSxhQUFBLGFBQUEsbUJBQUEsbUJBQUEsY0FBQSxVQUFBLElBQUEsTUFBQSxrQkFBQSxhQUFBLGlCQUFBLEVBQUEsYUFBQSxpQkFBQSxFQUFBLG1CQUFBLG1CQUFBLGNBQUEsSUFBQSxhQUFBLFNBQUEsRUFBQSxRQUFBLEVBQUEsV0FBQSxFQUFBLGFBQUEsU0FBQSxFQUFBLFFBQUEsRUFBQSxXQUFBLEVBQUEsbUJBQUEsbUJBQUEsZUFBQSxJQUFBLFVBQUEscUJBQUEsNkJBQUEsSUFBQSxJQUFBLGNBQUEsSUFBQSxtQkFBQSxtQkFBQSxJQUFBLGNBQUEsUUFBQSxFQUFBLFFBQUEsRUFBQSxTQUFBLEVBQUEsU0FBQSxFQUFBLGFBQUEsYUFBQSxXQUFBLEVBQUEsV0FBQSxHQUFBLE9BQUEsV0FBQSxLQUFBLFdBQUEsU0FBQSxNQUFBLFVBQUEsVUFBQSxDQUFBLElBQUEsUUFBQSxZQUFBLE9BQUEsUUFBQSxZQUFBLE1BQUEsVUFBQSxZQUFBLEtBQUEseUJBQUEsU0FBQSxLQUFBLENBQUEsSUFBQSxRQUFBLEtBQUEsUUFBQSxTQUFBLEtBQUEsU0FBQSxXQUFBLEtBQUEsV0FBQSxXQUFBLEtBQUEsb0JBQUEsUUFBQSxTQUFBLFlBQUEsR0FBQSxFQUFBLFdBQUEsS0FBQSxRQUFBLElBQUEsVUFBQSxLQUFBLGlCQUFBLFFBQUEsU0FBQSxXQUFBLFlBQUEsbUJBQUEsUUFBQSxrQ0FBQSxXQUFBLHdCQUFBLG1CQUFBLG9CQUFBLEVBQUEsaUJBQUEsS0FBQSxHQUFBLG1CQUFBLHdCQUFBLE9BQUEsRUFBQSxJQUFBLElBQUEsYUFBQSxTQUFBLEVBQUEsUUFBQSxFQUFBLFdBQUEsRUFBQSxhQUFBLFNBQUEsRUFBQSxRQUFBLEVBQUEsV0FBQSxFQUFBLG9CQUFBLEVBQUEsRUFBQSx3QkFBQSxjQUFBLEtBQUEsTUFBQSxRQUFBLEVBQUEscUJBQUEsYUFBQSxRQUFBLElBQUEsY0FBQSxLQUFBLE1BQUEsUUFBQSxFQUFBLHFCQUFBLGFBQUEsUUFBQSxJQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLENBQUEsaUJBQUEsS0FBQSxzQkFBQSxXQUFBLGNBQUEsY0FBQSxHQUFBLE1BQUEsSUFBQSxPQUFBLFVBQUEsS0FBQSxnQkFBQSxRQUFBLFNBQUEsV0FBQSxpQkFBQSxXQUFBLEtBQUEsS0FBQSxXQUFBLEtBQUEsTUFBQSxVQUFBLFdBQUEsT0FBQSxPQUFBLE1BQUEsaUJBQUEsSUFBQSxNQUFBLFdBQUEsUUFBQSxVQUFBLElBQUEsTUFBQSxXQUFBLFFBQUEsU0FBQSxrQkFBQSxJQUFBLGVBQUEsS0FBQSxTQUFBLEtBQUEsT0FBQSxVQUFBLENBQUEsSUFBQSxLQUFBLENBQUEsSUFBQSxxQkFBQSxrQkFBQSxLQUFBLE9BQUEsT0FBQSxLQUFBLHlCQUFBLE9BQUEsU0FBQSxrQkFBQSxXQUFBLENBQUEsS0FBQSxxQkFBQSxxQkFBQSxRQUFBLFlBQUEsRUFBQSxHQUFBLEtBQUEsU0FBQSxFQUFBLFdBQUEsS0FBQSxpQkFBQSx1QkFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLHVCQUFBLEtBQUEsaUJBQUEsV0FBQSxVQUFBLENBQUEsT0FBQSxLQUFBLFdBQUEsS0FBQSxZQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEscUJBQUEsV0FBQSxFQUFBLFVBQUEsS0FBQSxPQUFBLFNBQUEsRUFBQSxDQUFBLElBQUEsTUFBQSxFQUFBLE9BQUEsS0FBQSxzQkFBQSxNQUFBLHNCQUFBLEtBQUEsVUFBQSxNQUFBLFVBQUEsU0FBQSxxQkFBQSxRQUFBLEtBQUEsS0FBQSxDQUFBLEtBQUEsc0JBQUEsUUFBQSxLQUFBLEtBQUEsS0FBQSxLQUFBLEtBQUEsS0FBQSxLQUFBLGlCQUFBLE9BQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxPQUFBLEtBQUEsaUJBQUEsT0FBQSxVQUFBLENBQUEsT0FBQSxLQUFBLE9BQUEsS0FBQSxRQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsdUJBQUEsU0FBQSxVQUFBLE1BQUEsT0FBQSxDQUFBLEdBQUEsU0FBQSxPQUFBLE9BQUEsRUFBQSxPQUFBLEVBQUEsT0FBQSxLQUFBLHlDQUFBLEtBQUEsTUFBQSxNQUFBLEtBQUEsT0FBQSxPQUFBLElBQUEsUUFBQSxPQUFBLEVBQUEsSUFBQSxHQUFBLFFBQUEsVUFBQSxLQUFBLFFBQUEsUUFBQSxLQUFBLEtBQUEsSUFBQSxNQUFBLFFBQUEsUUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLEVBQUEsS0FBQSxLQUFBLE9BQUEsSUFBQSxLQUFBLEtBQUEsR0FBQSxFQUFBLEtBQUEsaUJBQUEsUUFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLFFBQUEsS0FBQSxpQkFBQSxTQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsU0FBQSxLQUFBLGlCQUFBLFlBQUEsVUFBQSxDQUFBLEdBQUEsS0FBQSxPQUFBLEtBQUEsT0FBQSxLQUFBLG1EQUFBLE9BQUEsS0FBQSxRQUFBLEtBQUEsWUFBQSxTQUFBLEVBQUEsRUFBQSxDQUFBLElBQUEsT0FBQSxFQUFBLEtBQUEsU0FBQSxHQUFBLEdBQUEsT0FBQSxJQUFBLEVBQUEsUUFBQSxLQUFBLEtBQUEsUUFBQSxHQUFBLEtBQUEsS0FBQSxZQUFBLFNBQUEsRUFBQSxFQUFBLENBQUEsSUFBQSxPQUFBLEVBQUEsS0FBQSxTQUFBLEdBQUEsR0FBQSxLQUFBLEtBQUEsU0FBQSxJQUFBLEdBQUEsSUFBQSxLQUFBLEtBQUEsU0FBQSxFQUFBLEVBQUEsQ0FBQSxJQUFBLE9BQUEsRUFBQSxLQUFBLFNBQUEsR0FBQSxHQUFBLEtBQUEsS0FBQSxTQUFBLElBQUEsR0FBQSxJQUFBLEtBQUEsTUFBQSxVQUFBLENBQUEsSUFBQSxJQUFBLElBQUEsS0FBQSxLQUFBLE9BQUEsRUFBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEtBQUEsS0FBQSxHQUFBLEdBQUEsS0FBQSxVQUFBLFNBQUEsS0FBQSxJQUFBLE1BQUEsT0FBQSxDQUFBLEdBQUEsRUFBQSxLQUFBLEVBQUEsS0FBQSxLQUFBLG1DQUFBLEdBQUEsRUFBQSxRQUFBLEVBQUEsTUFBQSxLQUFBLHNDQUFBLElBQUEsTUFBQSxLQUFBLE1BQUEsT0FBQSxJQUFBLE9BQUEsR0FBQSxPQUFBLEtBQUEsUUFBQSxNQUFBLEtBQUEsTUFBQSxLQUFBLHdDQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsT0FBQSxFQUFBLElBQUEsSUFBQSxJQUFBLE9BQUEsRUFBQSxLQUFBLFFBQUEsRUFBQSxLQUFBLE1BQUEsRUFBQSxJQUFBLEtBQUEsS0FBQSxRQUFBLEdBQUEsS0FBQSxJQUFBLEdBQUEsSUFBQSxTQUFBLFVBQUEsaUJBQUEsVUFBQSxDQUFBLEtBQUEsaUJBQUEsaUJBQUEsS0FBQSxVQUFBLFVBQUEsS0FBQSxpQkFBQSxtQkFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLG1CQUFBLEtBQUEsaUJBQUEsWUFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLFlBQUEsU0FBQSxnQkFBQSxVQUFBLENBQUEsSUFBQSxVQUFBLFVBQUEsVUFBQSxHQUFBLEdBQUEsV0FBQSxJQUFBLEVBQUEsV0FBQSxLQUFBLHdCQUFBLEtBQUEsVUFBQSxVQUFBLEtBQUEsY0FBQSxLQUFBLEtBQUEsaUJBQUEsS0FBQSxLQUFBLFFBQUEsU0FBQSxFQUFBLEVBQUEsWUFBQSxDQUFBLE9BQUEsS0FBQSxVQUFBLFlBQUEsRUFBQSxHQUFBLGFBQUEsRUFBQSxFQUFBLGFBQUEsR0FBQSxLQUFBLHNCQUFBLFVBQUEsQ0FBQSxHQUFBLE1BQUEsS0FBQSxpQkFBQSxPQUFBLEtBQUEsaUJBQUEsSUFBQSxJQUFBLGVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLElBQUEsZUFBQSxLQUFBLFFBQUEsRUFBQSxFQUFBLGdCQUFBLGVBQUEsS0FBQSxRQUFBLEVBQUEsRUFBQSxnQkFBQSxlQUFBLEtBQUEsUUFBQSxFQUFBLEVBQUEsZ0JBQUEsZUFBQSxLQUFBLFFBQUEsRUFBQSxFQUFBLGdCQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsZUFBQSxLQUFBLFFBQUEsRUFBQSxFQUFBLGdCQUFBLEdBQUEsS0FBQSxpQkFBQSxrQkFBQSx3QkFBQSxnQkFBQSxNQUFBLEtBQUEsaUJBQUEsT0FBQSxLQUFBLGlCQUFBLElBQUEsVUFBQSxLQUFBLFVBQUEsVUFBQSxlQUFBLEVBQUEsSUFBQSxJQUFBLEtBQUEsVUFBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLEdBQUEsS0FBQSxJQUFBLGVBQUEsS0FBQSxRQUFBLEVBQUEsRUFBQSxnQkFBQSxJQUFBLElBQUEsRUFBQSxVQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsZUFBQSxLQUFBLFFBQUEsRUFBQSxFQUFBLGdCQUFBLEdBQUEsS0FBQSxpQkFBQSxrQkFBQSx3QkFBQSxnQkFBQSxNQUFBLEtBQUEsaUJBQUEsT0FBQSxLQUFBLGlCQUFBLEtBQUEsK0JBQUEsS0FBQSxZQUFBLFVBQUEsQ0FBQSxHQUFBLE1BQUEsS0FBQSxjQUFBLE9BQUEsS0FBQSxjQUFBLElBQUEsVUFBQSxLQUFBLFVBQUEsVUFBQSxtQkFBQSxVQUFBLElBQUEsRUFBQSxHQUFBLEdBQUEsbUJBQUEsT0FBQSxRQUFBLG9CQUFBLG9CQUFBLElBQUEsSUFBQSxZQUFBLEVBQUEsTUFBQSxVQUFBLEdBQUEsRUFBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLFVBQUEsRUFBQSxHQUFBLE1BQUEsSUFBQSxZQUFBLEtBQUEsUUFBQSxFQUFBLEVBQUEsYUFBQSxHQUFBLEtBQUEsY0FBQSxRQUFBLHlCQUFBLGFBQUEsTUFBQSxLQUFBLGVBQUEsS0FBQSxjQUFBLHFCQUFBLFVBQUEsT0FBQSxLQUFBLGNBQUEsWUFBQSxFQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsVUFBQSxFQUFBLEdBQUEsTUFBQSxJQUFBLFlBQUEsS0FBQSxRQUFBLEVBQUEsRUFBQSxhQUFBLEdBQUEsS0FBQSxjQUFBLFFBQUEseUJBQUEsYUFBQSxNQUFBLEtBQUEsZUFBQSxLQUFBLGNBQUEscUJBQUEsVUFBQSxPQUFBLEtBQUEsY0FBQSxLQUFBLHFCQUFBLEtBQUEsY0FBQSxVQUFBLENBQUEsSUFBQSxXQUFBLEtBQUEsd0JBQUEsUUFBQSxLQUFBLGNBQUEsU0FBQSxTQUFBLGFBQUEsV0FBQSxVQUFBLFVBQUEsS0FBQSxVQUFBLFVBQUEsU0FBQSxnQkFBQSxLQUFBLFVBQUEsV0FBQSxJQUFBLElBQUEsZ0JBQUEsUUFBQSx1QkFBQSxVQUFBLENBQUEsRUFBQSxPQUFBLElBQUEsTUFBQSxRQUFBLGdCQUFBLGFBQUEsRUFBQSxZQUFBLEVBQUEsU0FBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLEVBQUEsRUFBQSxHQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsTUFBQSxFQUFBLFVBQUEsTUFBQSxRQUFBLElBQUEsSUFBQSxFQUFBLFVBQUEsVUFBQSxFQUFBLE1BQUEsTUFBQSxJQUFBLEVBQUEsRUFBQSxJQUFBLE1BQUEsZ0JBQUEsWUFBQSxFQUFBLElBQUEsS0FBQSxXQUFBLGNBQUEsRUFBQSxLQUFBLFVBQUEsWUFBQSxFQUFBLElBQUEsS0FBQSxhQUFBLEdBQUEsR0FBQSxXQUFBLE9BQUEsZ0JBQUEsWUFBQSxTQUFBLEVBQUEsWUFBQSxJQUFBLFdBQUEsQ0FBQSxFQUFBLEdBQUEsY0FBQSxRQUFBLGVBQUEsS0FBQSxzQkFBQSxPQUFBLFFBQUEsU0FBQSxhQUFBLENBQUEsS0FBQSxnQkFBQSxTQUFBLEtBQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxVQUFBLEVBQUEsSUFBQSxLQUFBLFNBQUEsRUFBQSxJQUFBLEtBQUEsS0FBQSxFQUFBLElBQUEsS0FBQSxTQUFBLFNBQUEsRUFBQSxFQUFBLENBQUEsT0FBQSxJQUFBLEVBQUEsRUFBQSxJQUFBLFNBQUEsYUFBQSxDQUFBLEtBQUEsZ0JBQUEsU0FBQSxLQUFBLFVBQUEsQ0FBQSxJQUFBLElBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsS0FBQSxTQUFBLEVBQUEsSUFBQSxLQUFBLEtBQUEsRUFBQSxJQUFBLEtBQUEsU0FBQSxTQUFBLEVBQUEsRUFBQSxDQUFBLE9BQUEsSUFBQSxFQUFBLElBQUEsU0FBQSxhQUFBLENBQUEsS0FBQSxnQkFBQSxTQUFBLEtBQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxVQUFBLEVBQUEsSUFBQSxLQUFBLFNBQUEsRUFBQSxJQUFBLEtBQUEsS0FBQSxFQUFBLElBQUEsS0FBQSxTQUFBLFNBQUEsRUFBQSxFQUFBLENBQUEsT0FBQSxFQUFBLEdBQUEsR0FBQSxTQUFBLGFBQUEsQ0FBQSxLQUFBLGdCQUFBLFNBQUEsS0FBQSxVQUFBLENBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxVQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLEtBQUEsU0FBQSxFQUFBLElBQUEsS0FBQSxLQUFBLEVBQUEsSUFBQSxLQUFBLFNBQUEsU0FBQSxFQUFBLEVBQUEsQ0FBQSxNQUFBLENBQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxTQUFBLGFBQUEsQ0FBQSxLQUFBLGdCQUFBLFNBQUEsS0FBQSxVQUFBLENBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxVQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLEtBQUEsU0FBQSxFQUFBLElBQUEsS0FBQSxLQUFBLEVBQUEsSUFBQSxLQUFBLFNBQUEsU0FBQSxFQUFBLEVBQUEsQ0FBQSxPQUFBLElBQUEsUUFBQSxFQUFBLEdBQUEsRUFBQSxFQUFBLElBQUEsU0FBQSxhQUFBLENBQUEsS0FBQSxnQkFBQSxTQUFBLEtBQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxVQUFBLEVBQUEsSUFBQSxLQUFBLFNBQUEsRUFBQSxJQUFBLEtBQUEsS0FBQSxFQUFBLElBQUEsS0FBQSxTQUFBLFNBQUEsRUFBQSxFQUFBLENBQUEsSUFBQSxLQUFBLEVBQUEsRUFBQSxNQUFBLENBQUEsRUFBQSxNQUFBLEtBQUEsR0FBQSxHQUFBLFNBQUEsYUFBQSxDQUFBLEtBQUEsZ0JBQUEsU0FBQSxLQUFBLFVBQUEsQ0FBQSxJQUFBLElBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsS0FBQSxTQUFBLEVBQUEsSUFBQSxLQUFBLEtBQUEsRUFBQSxJQUFBLEtBQUEsU0FBQSxTQUFBLEVBQUEsRUFBQSxDQUFBLElBQUEsS0FBQSxFQUFBLEVBQUEsT0FBQSxJQUFBLENBQUEsRUFBQSxNQUFBLEtBQUEsRUFBQSxJQUFBLFNBQUEsYUFBQSxDQUFBLEtBQUEsZ0JBQUEsU0FBQSxLQUFBLFVBQUEsQ0FBQSxJQUFBLElBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsS0FBQSxTQUFBLEVBQUEsSUFBQSxLQUFBLEtBQUEsRUFBQSxJQUFBLEtBQUEsU0FBQSxTQUFBLEVBQUEsRUFBQSxDQUFBLE9BQUEsSUFBQSxDQUFBLEVBQUEsRUFBQSxHQUFBLEVBQUEsRUFBQSxFQUFBLElBQUEsU0FBQSxtQkFBQSxNQUFBLENBQUEsS0FBQSxNQUFBLE1BQUEsS0FBQSxPQUFBLFNBQUEsU0FBQSxLQUFBLENBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxVQUFBLEtBQUEsTUFBQSxVQUFBLHFCQUFBLElBQUEsTUFBQSxNQUFBLEVBQUEsRUFBQSxFQUFBLHFCQUFBLE9BQUEsSUFBQSxxQkFBQSxHQUFBLEVBQUEsSUFBQSxJQUFBLFdBQUEsQ0FBQSxFQUFBLFFBQUEsQ0FBQSxFQUFBLEVBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxDQUFBLElBQUEsS0FBQSxLQUFBLFdBQUEsS0FBQSxNQUFBLElBQUEsV0FBQSxFQUFBLEVBQUEsSUFBQSxxQkFBQSxxQkFBQSxPQUFBLEVBQUEsR0FBQSxLQUFBLEdBQUEsT0FBQSxRQUFBLENBQUEsR0FBQSxHQUFBLENBQUEsUUFBQSxJQUFBLElBQUEsU0FBQSxJQUFBLFVBQUEsS0FBQSxNQUFBLHNCQUFBLFdBQUEsS0FBQSxzQkFBQSxLQUFBLE1BQUEsY0FBQSxLQUFBLEdBQUEsU0FBQSxNQUFBLE1BQUEsV0FBQSxHQUFBLE1BQUEsV0FBQSxHQUFBLGVBQUEsS0FBQSxtQkFBQSxPQUFBLGdCQUFBLEtBQUEsb0JBQUEsTUFBQSxlQUFBLFlBQUEsRUFBQSxFQUFBLEVBQUEsZUFBQSxPQUFBLElBQUEsQ0FBQSxJQUFBLFNBQUEsU0FBQSxPQUFBLEVBQUEsS0FBQSxNQUFBLElBQUEsZUFBQSxJQUFBLEdBQUEsRUFBQSxTQUFBLEtBQUEsMENBQUEsU0FBQSxVQUFBLE1BQUEsY0FBQSxTQUFBLFVBQUEsZ0JBQUEsTUFBQSxLQUFBLHNCQUFBLFNBQUEsRUFBQSxFQUFBLEVBQUEsQ0FBQSxHQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUEsQ0FBQSxJQUFBLEtBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxNQUFBLEVBQUEsRUFBQSxFQUFBLE1BQUEsS0FBQSxNQUFBLElBQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSxNQUFBLEtBQUEsTUFBQSxLQUFBLEVBQUEsS0FBQSxNQUFBLElBQUEsRUFBQSxRQUFBLEtBQUEsTUFBQSxFQUFBLElBQUEsQ0FBQSxJQUFBLFVBQUEsTUFBQSxVQUFBLE1BQUEsVUFBQSxNQUFBLEdBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxLQUFBLEtBQUEsbUJBQUEsRUFBQSxVQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsTUFBQSxLQUFBLHVCQUFBLE1BQUEsZUFBQSxNQUFBLFFBQUEsV0FBQSxLQUFBLE1BQUEsUUFBQSx3QkFBQSxFQUFBLFFBQUEsTUFBQSxRQUFBLENBQUEsRUFBQSxNQUFBLENBQUEsSUFBQSxXQUFBLEVBQUEsT0FBQSxNQUFBLE9BQUEsTUFBQSxLQUFBLE1BQUEsU0FBQSxFQUFBLGVBQUEsRUFBQSxRQUFBLFlBQUEsRUFBQSxFQUFBLGNBQUEsS0FBQSxNQUFBLGNBQUEsV0FBQSxRQUFBLEVBQUEsRUFBQSxjQUFBLE1BQUEsbUJBQUEsV0FBQSxRQUFBLEVBQUEsRUFBQSxVQUFBLE9BQUEsY0FBQSxXQUFBLEVBQUEsRUFBQSxVQUFBLE9BQUEsY0FBQSxXQUFBLElBQUEsaUJBQUEsRUFBQSxlQUFBLEdBQUEsR0FBQSxHQUFBLGlCQUFBLEtBQUEsOENBQUEsSUFBQSxRQUFBLEtBQUEsTUFBQSxRQUFBLGtCQUFBLE1BQUEsRUFBQSxVQUFBLFNBQUEsTUFBQSxFQUFBLFVBQUEsU0FBQSxPQUFBLElBQUEsTUFBQSxNQUFBLFFBQUEsS0FBQSxtQkFBQSxTQUFBLGFBQUEsQ0FBQSxJQUFBLFVBQUEsYUFBQSxPQUFBLEdBQUEsR0FBQSxVQUFBLE9BQUEsSUFBQSxNQUFBLGFBQUEsZUFBQSxJQUFBLElBQUEsSUFBQSxPQUFBLElBQUEsTUFBQSxXQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsSUFBQSxHQUFBLFVBQUEsRUFBQSxJQUFBLEdBQUEsYUFBQSxXQUFBLEtBQUEsT0FBQSxHQUFBLEtBQUEsTUFBQSxRQUFBLEdBQUEsS0FBQSxHQUFBLEdBQUEsVUFBQSxLQUFBLHNEQUFBLE9BQUEsUUFBQSxLQUFBLG9CQUFBLFNBQUEsZUFBQSxlQUFBLFdBQUEsQ0FBQSxJQUFBLElBQUEsRUFBQSxlQUFBLE9BQUEsT0FBQSxJQUFBLE1BQUEsR0FBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLElBQUEsQ0FBQSxJQUFBLElBQUEsVUFBQSxLQUFBLE1BQUEsUUFBQSxlQUFBLElBQUEsWUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsSUFBQSxHQUFBLElBQUEsWUFBQSxLQUFBLE1BQUEsU0FBQSxZQUFBLE1BQUEsY0FBQSxFQUFBLEtBQUEsTUFBQSxTQUFBLGVBQUEsR0FBQSxjQUFBLE9BQUEsR0FBQSxLQUFBLE1BQUEsU0FBQSxlQUFBLFdBQUEsV0FBQSxLQUFBLE1BQUEsUUFBQSxjQUFBLGFBQUEsT0FBQSxHQUFBLEtBQUEsTUFBQSxTQUFBLE9BQUEsR0FBQSxZQUFBLE9BQUEsUUFBQSxTQUFBLFVBQUEsTUFBQSxhQUFBLENBQUEsR0FBQSxNQUFBLGNBQUEsR0FBQSxhQUFBLE9BQUEsS0FBQSwyQkFBQSxLQUFBLE1BQUEsTUFBQSxJQUFBLG1CQUFBLGFBQUEsT0FBQSxHQUFBLG1CQUFBLEdBQUEsR0FBQSxhQUFBLEdBQUEsQ0FBQSxJQUFBLElBQUEsYUFBQSxFQUFBLG1CQUFBLGNBQUEsR0FBQSxhQUFBLGVBQUEsZUFBQSxHQUFBLGNBQUEsbUJBQUEsS0FBQSxhQUFBLE1BQUEsS0FBQSxpQkFBQSxDQUFBLEtBQUEsYUFBQSxJQUFBLE1BQUEsbUJBQUEsY0FBQSxJQUFBLElBQUEsRUFBQSxFQUFBLEVBQUEsS0FBQSxhQUFBLE9BQUEsSUFBQSxLQUFBLGFBQUEsR0FBQSxFQUFBLElBQUEsSUFBQSxHQUFBLEVBQUEsR0FBQSxLQUFBLGFBQUEsT0FBQSxLQUFBLEtBQUEsYUFBQSxJQUFBLGFBQUEsYUFBQSxVQUFBLEtBQUEsYUFBQSxhQUFBLEtBQUEsaUJBQUEsT0FBQSxVQUFBLENBQUEsT0FBQSxHQUFBLEtBQUEsYUFBQSxLQUFBLEtBQUEsaUJBQUEsU0FBQSxVQUFBLENBQUEsT0FBQSxLQUFBLGFBQUEsT0FBQSxJQUFBLEtBQUEsaUJBQUEsZUFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLGVBQUEsS0FBQSxlQUFBLFNBQUEsT0FBQSxDQUFBLE9BQUEsS0FBQSxhQUFBLEtBQUEsYUFBQSxPQUFBLEVBQUEsU0FBQSxLQUFBLFdBQUEsU0FBQSxFQUFBLENBQUEsR0FBQSxHQUFBLEVBQUEsT0FBQSxLQUFBLGVBQUEsR0FBQSxJQUFBLEtBQUEsS0FBQSxhQUFBLE9BQUEsR0FBQSxHQUFBLEVBQUEsQ0FBQSxJQUFBLElBQUEsT0FBQSxFQUFBLEVBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxPQUFBLE1BQUEsY0FBQSxPQUFBLEtBQUEsYUFBQSxJQUFBLE9BQUEsT0FBQSxJQUFBLElBQUEsUUFBQSxLQUFBLGFBQUEsR0FBQSxFQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsUUFBQSxNQUFBLGNBQUEsS0FBQSxNQUFBLFNBQUEsRUFBQSxTQUFBLEtBQUEsYUFBQSxJQUFBLE9BQUEsU0FBQSxLQUFBLGNBQUEsU0FBQSxNQUFBLENBQUEsR0FBQSxLQUFBLE9BQUEsTUFBQSxNQUFBLEtBQUEsMENBQUEsR0FBQSxLQUFBLEtBQUEsT0FBQSxNQUFBLEdBQUEsTUFBQSxLQUFBLE9BQUEsS0FBQSxJQUFBLG9CQUFBLEtBQUEsYUFBQSxtQkFBQSxNQUFBLGFBQUEsR0FBQSxvQkFBQSxPQUFBLG1CQUFBLE9BQUEsQ0FBQSxJQUFBLEtBQUEsb0JBQUEsb0JBQUEsbUJBQUEsbUJBQUEsS0FBQSxJQUFBLElBQUEsUUFBQSxJQUFBLE1BQUEsbUJBQUEsUUFBQSxXQUFBLG1CQUFBLE9BQUEsb0JBQUEsT0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEtBQUEsUUFBQSxJQUFBLG1CQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsV0FBQSxFQUFBLG1CQUFBLE9BQUEsSUFBQSxRQUFBLEdBQUEsTUFBQSxjQUFBLG9CQUFBLEVBQUEsWUFBQSxtQkFBQSxJQUFBLE9BQUEsSUFBQSxVQUFBLE1BQUEsVUFBQSxLQUFBLFVBQUEsU0FBQSxNQUFBLENBQUEsR0FBQSxLQUFBLE9BQUEsTUFBQSxNQUFBLEtBQUEsMENBQUEsR0FBQSxLQUFBLE1BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQSxNQUFBLEtBQUEsSUFBQSxJQUFBLGNBQUEsS0FBQSxhQUFBLFFBQUEsY0FBQSxPQUFBLGNBQUEsTUFBQSxhQUFBLFFBQUEsY0FBQSxPQUFBLFFBQUEsSUFBQSxNQUFBLFFBQUEsUUFBQSxHQUFBLEVBQUEsRUFBQSxRQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsT0FBQSxjQUFBLEdBQUEsRUFBQSxFQUFBLFFBQUEsRUFBQSxJQUFBLFFBQUEsRUFBQSxHQUFBLE1BQUEsY0FBQSxRQUFBLEVBQUEsR0FBQSxLQUFBLE1BQUEsU0FBQSxPQUFBLGNBQUEsS0FBQSxPQUFBLElBQUEsVUFBQSxLQUFBLE1BQUEsVUFBQSxLQUFBLFVBQUEsU0FBQSxPQUFBLENBQUEsR0FBQSxHQUFBLE9BQUEsT0FBQSxLQUFBLE1BQUEsS0FBQSxHQUFBLEdBQUEsT0FBQSxPQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsS0FBQSxhQUFBLE9BQUEsUUFBQSxJQUFBLE1BQUEsTUFBQSxFQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxTQUFBLEtBQUEsYUFBQSxHQUFBLFFBQUEsT0FBQSxJQUFBLFVBQUEsS0FBQSxNQUFBLFVBQUEsS0FBQSxtQkFBQSxTQUFBLE9BQUEsWUFBQSxDQUFBLEdBQUEsRUFBQSxPQUFBLEtBQUEsMkJBQUEsR0FBQSxHQUFBLFlBQUEsT0FBQSxLQUFBLE1BQUEsS0FBQSxJQUFBLElBQUEsS0FBQSxLQUFBLGFBQUEsT0FBQSxRQUFBLElBQUEsTUFBQSxLQUFBLFFBQUEsRUFBQSxFQUFBLEVBQUEsUUFBQSxPQUFBLElBQUEsUUFBQSxHQUFBLEVBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLFNBQUEsS0FBQSxhQUFBLEdBQUEsYUFBQSxPQUFBLElBQUEsVUFBQSxLQUFBLE1BQUEsVUFBQSxLQUFBLE9BQUEsU0FBQSxNQUFBLENBQUEsR0FBQSxLQUFBLE9BQUEsTUFBQSxNQUFBLEtBQUEsMENBQUEsR0FBQSxNQUFBLEtBQUEsS0FBQSxjQUFBLElBQUEsSUFBQSxTQUFBLEtBQUEsTUFBQSxLQUFBLFVBQUEsS0FBQSx1QkFBQSxNQUFBLGVBQUEsTUFBQSxRQUFBLDhCQUFBLEtBQUEsTUFBQSxRQUFBLHdCQUFBLFVBQUEsUUFBQSxNQUFBLFFBQUEsQ0FBQSxVQUFBLE1BQUE7SUFDQSxJQUFBLGlCQUFBLFVBQUEsT0FBQSxNQUFBLE9BQUEsTUFBQSxLQUFBLE1BQUEsU0FBQSxVQUFBLGVBQUEsVUFBQSxRQUFBLCtCQUFBLEtBQUEsTUFBQSxtQkFBQSxpQkFBQSxPQUFBLGtCQUFBLEtBQUEsTUFBQSxjQUFBLGlCQUFBLE9BQUEsU0FBQSxTQUFBLGNBQUEsbUJBQUEsVUFBQSxVQUFBLGNBQUEsTUFBQSxPQUFBLElBQUEsTUFBQSxTQUFBLFlBQUEsU0FBQSxNQUFBLFVBQUEsQ0FBQSxLQUFBLFNBQUEsSUFBQSxNQUFBLEtBQUEsS0FBQSxTQUFBLElBQUEsTUFBQSxLQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEtBQUEsU0FBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLEdBQUEsTUFBQSxHQUFBLFdBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxLQUFBLFNBQUEsS0FBQSxTQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxNQUFBLEdBQUEsSUFBQSxHQUFBLEVBQUEsS0FBQSxLQUFBLElBQUEsVUFBQSxLQUFBLElBQUEsTUFBQSxNQUFBLElBQUEsSUFBQSxJQUFBLE1BQUEsR0FBQSxJQUFBLEdBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxVQUFBLEtBQUEsSUFBQSxNQUFBLE1BQUEsS0FBQSxpQkFBQSxPQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsT0FBQSxLQUFBLGlCQUFBLE1BQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxNQUFBLEtBQUEsY0FBQSxTQUFBLE9BQUEsWUFBQSxDQUFBLEdBQUEsRUFBQSxPQUFBLEtBQUEsMkJBQUEsR0FBQSxHQUFBLFlBQUEsT0FBQSxLQUFBLElBQUEsSUFBQSxhQUFBLElBQUEsTUFBQSxPQUFBLEdBQUEsRUFBQSxFQUFBLEVBQUEsYUFBQSxPQUFBLElBQUEsYUFBQSxHQUFBLEVBQUEsT0FBQSxhQUFBLEdBQUEsWUFBQSxJQUFBLFVBQUEsS0FBQSxlQUFBLEtBQUEsSUFBQSxTQUFBLEVBQUEsQ0FBQSxPQUFBLEtBQUEsU0FBQSxJQUFBLEtBQUEsSUFBQSxTQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxLQUFBLDJCQUFBLE9BQUEsS0FBQSxTQUFBLElBQUEsS0FBQSxRQUFBLFNBQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLEtBQUEsNkJBQUEsT0FBQSxLQUFBLFNBQUEsSUFBQSxLQUFBLFNBQUEsS0FBQSxLQUFBLFNBQUEsU0FBQSxFQUFBLEVBQUEsQ0FBQSxPQUFBLEdBQUEsR0FBQSxHQUFBLEVBQUEsRUFBQSxHQUFBLEVBQUEsRUFBQSxHQUFBLEVBQUEsRUFBQSxLQUFBLFNBQUEsQ0FBQSxLQUFBLFNBQUEsR0FBQSxLQUFBLFNBQUEsSUFBQSxNQUFBLFNBQUEsUUFBQSxPQUFBLEtBQUEsQ0FBQSxPQUFBLFFBQUEsRUFBQSxRQUFBLEtBQUEsQ0FBQSxRQUFBLE9BQUEsR0FBQSxDQUFBLE1BQUEsU0FBQSxjQUFBLEtBQUEsS0FBQSxvQkFBQSxDQUFBLEtBQUEsRUFBQSxLQUFBLEtBQUEsRUFBQSxLQUFBLEtBQUEsTUFBQSxFQUFBLEtBQUEsb0JBQUEsb0JBQUEsS0FBQSxpQkFBQSxzQkFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLHNCQUFBLEtBQUEsaUJBQUEsUUFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLFFBQUEsS0FBQSxpQkFBQSxJQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsSUFBQSxLQUFBLGlCQUFBLElBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxJQUFBLEtBQUEsZUFBQSxVQUFBLENBQUEsS0FBQSxTQUFBLEtBQUEsWUFBQSxTQUFBLFdBQUEsRUFBQSxFQUFBLENBQUEsR0FBQSxLQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsWUFBQSxLQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsV0FBQSxDQUFBLElBQUEsZUFBQSxLQUFBLElBQUEsV0FBQSxLQUFBLHFCQUFBLE9BQUEsR0FBQSxnQkFBQSxlQUFBLEtBQUEscUJBQUEsRUFBQSxNQUFBLENBQUEsR0FBQSxTQUFBLGtCQUFBLGVBQUEsQ0FBQSxLQUFBLFdBQUEsZUFBQSxHQUFBLEtBQUEsUUFBQSxlQUFBLEdBQUEsS0FBQSxTQUFBLGVBQUEsR0FBQSxLQUFBLGlCQUFBLGFBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxhQUFBLEtBQUEsaUJBQUEsVUFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLFVBQUEsS0FBQSxpQkFBQSxXQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsV0FBQSxTQUFBLHFCQUFBLENBQUEsS0FBQSxNQUFBLEtBQUEsS0FBQSxnQkFBQSxHQUFBLEtBQUEsV0FBQSxDQUFBLEVBQUEsS0FBQSxxQkFBQSxJQUFBLE1BQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxHQUFBLEtBQUEsb0JBQUEsS0FBQSxLQUFBLGlCQUFBLHVCQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEscUJBQUEsR0FBQSxFQUFBLEtBQUEscUJBQUEsR0FBQSxFQUFBLEtBQUEscUJBQUEsR0FBQSxFQUFBLEtBQUEscUJBQUEsR0FBQSxFQUFBLEtBQUEscUJBQUEsR0FBQSxFQUFBLEtBQUEsdUJBQUEsS0FBQSxrQkFBQSxTQUFBLFdBQUEsQ0FBQSxJQUFBLElBQUEsZ0JBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLElBQUEsQ0FBQSxJQUFBLE1BQUEsV0FBQSxHQUFBLEdBQUEsR0FBQSxNQUFBLE1BQUEsQ0FBQSxFQUFBLGlCQUFBLE1BQUEsR0FBQSxFQUFBLGdCQUFBLE1BQUEsQ0FBQSxFQUFBLElBQUEsV0FBQSxLQUFBLE1BQUEsQ0FBQSxpQkFBQSxvQkFBQSxHQUFBLFlBQUEsS0FBQSxNQUFBLFdBQUEsR0FBQSxPQUFBLEtBQUEsSUFBQSxZQUFBLFdBQUEsSUFBQSxxQkFBQSxhQUFBLEtBQUEsSUFBQSxZQUFBLFdBQUEsSUFBQSxxQkFBQSxhQUFBLEtBQUEsSUFBQSxFQUFBLFlBQUEsV0FBQSxJQUFBLHFCQUFBLEVBQUEsYUFBQSxLQUFBLElBQUEsWUFBQSxXQUFBLElBQUEscUJBQUEsYUFBQSxLQUFBLElBQUEsWUFBQSxXQUFBLElBQUEscUJBQUEsYUFBQSxLQUFBLGNBQUEsU0FBQSxXQUFBLElBQUEsQ0FBQSxPQUFBLElBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsR0FBQSxLQUFBLG1CQUFBLFNBQUEsT0FBQSxRQUFBLFNBQUEsd0JBQUEsQ0FBQSxJQUFBLElBQUEsTUFBQSxLQUFBLE1BQUEsS0FBQSxPQUFBLE9BQUEsV0FBQSxLQUFBLHFCQUFBLEVBQUEsT0FBQSxHQUFBLEdBQUEsTUFBQSxRQUFBLEVBQUEsT0FBQSxRQUFBLFdBQUEsS0FBQSxJQUFBLEdBQUEsRUFBQSxFQUFBLE9BQUEsSUFBQSxLQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsUUFBQSxFQUFBLE9BQUEsUUFBQSxXQUFBLElBQUEsVUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLEVBQUEsR0FBQSxXQUFBLEdBQUEsU0FBQSxPQUFBLElBQUEsS0FBQSxHQUFBLEdBQUEsTUFBQSxRQUFBLEVBQUEsT0FBQSxRQUFBLFdBQUEsSUFBQSxVQUFBLFdBQUEsS0FBQSxJQUFBLEdBQUEsV0FBQSxHQUFBLFNBQUEsT0FBQSxJQUFBLElBQUEsRUFBQSxPQUFBLEVBQUEsS0FBQSxHQUFBLE1BQUEsUUFBQSxFQUFBLE9BQUEsUUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLEdBQUEsS0FBQSxPQUFBLElBQUEsS0FBQSxLQUFBLEdBQUEsQ0FBQSxNQUFBLFFBQUEsRUFBQSxPQUFBLFFBQUEsV0FBQSxHQUFBLFVBQUEsV0FBQSxLQUFBLElBQUEsR0FBQSxHQUFBLE1BQUEsV0FBQSxJQUFBLFNBQUEsT0FBQSxJQUFBLEtBQUEsS0FBQSxHQUFBLE1BQUEsUUFBQSxFQUFBLE9BQUEsUUFBQSxXQUFBLEdBQUEsVUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLFdBQUEsSUFBQSxTQUFBLE9BQUEsSUFBQSxJQUFBLGdCQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsT0FBQSxFQUFBLEtBQUEsSUFBQSxnQkFBQSwwQkFBQSxFQUFBLHdCQUFBLElBQUEsS0FBQSxrQkFBQSxZQUFBLEtBQUEsY0FBQSxXQUFBLEdBQUEsS0FBQSxLQUFBLHFCQUFBLFNBQUEsT0FBQSxRQUFBLFNBQUEsd0JBQUEsQ0FBQSxJQUFBLElBQUEsTUFBQSxLQUFBLE1BQUEsS0FBQSxPQUFBLE1BQUEsV0FBQSxLQUFBLHFCQUFBLEVBQUEsT0FBQSxHQUFBLEdBQUEsTUFBQSxFQUFBLFFBQUEsT0FBQSxRQUFBLFdBQUEsS0FBQSxJQUFBLEdBQUEsRUFBQSxFQUFBLE9BQUEsSUFBQSxLQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsRUFBQSxRQUFBLE9BQUEsUUFBQSxXQUFBLElBQUEsVUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLEVBQUEsR0FBQSxXQUFBLEdBQUEsU0FBQSxPQUFBLElBQUEsS0FBQSxHQUFBLEdBQUEsTUFBQSxFQUFBLFFBQUEsT0FBQSxRQUFBLFdBQUEsSUFBQSxVQUFBLFdBQUEsS0FBQSxJQUFBLEdBQUEsV0FBQSxHQUFBLFNBQUEsT0FBQSxJQUFBLElBQUEsRUFBQSxPQUFBLEVBQUEsS0FBQSxHQUFBLE1BQUEsRUFBQSxRQUFBLE9BQUEsUUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLEdBQUEsS0FBQSxPQUFBLElBQUEsS0FBQSxLQUFBLEdBQUEsQ0FBQSxNQUFBLEVBQUEsUUFBQSxPQUFBLFFBQUEsV0FBQSxHQUFBLFVBQUEsV0FBQSxLQUFBLElBQUEsR0FBQSxHQUFBLE1BQUEsV0FBQSxJQUFBLFNBQUEsT0FBQSxJQUFBLEtBQUEsS0FBQSxHQUFBLE1BQUEsRUFBQSxRQUFBLE9BQUEsUUFBQSxXQUFBLEdBQUEsVUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLFdBQUEsSUFBQSxTQUFBLE9BQUEsSUFBQSxJQUFBLGdCQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsT0FBQSxFQUFBLEtBQUEsSUFBQSxnQkFBQSwwQkFBQSx3QkFBQSxJQUFBLEtBQUEsa0JBQUEsWUFBQSxLQUFBLGNBQUEsV0FBQSxHQUFBLEtBQUEsS0FBQSxxQkFBQSxTQUFBLFdBQUEsRUFBQSxFQUFBLENBQUEsSUFBQSxnQkFBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLFFBQUEsS0FBQSxjQUFBLFdBQUEsR0FBQSxRQUFBLEtBQUEsbUJBQUEsRUFBQSxLQUFBLE1BQUEsU0FBQSxXQUFBLEdBQUEsaUJBQUEsR0FBQSxDQUFBLE1BQUEsV0FBQSxRQUFBLEtBQUEscUJBQUEsS0FBQSxNQUFBLFNBQUEsS0FBQSxNQUFBLFNBQUEsV0FBQSxHQUFBLGlCQUFBLENBQUEsTUFBQSxVQUFBLENBQUEsSUFBQSxJQUFBLG9CQUFBLGdCQUFBLEVBQUEsTUFBQSxDQUFBLEVBQUEsSUFBQSxLQUFBLGdCQUFBLE9BQUEsTUFBQSxFQUFBLElBQUEsTUFBQSxRQUFBLENBQUEsSUFBQSxPQUFBLEtBQUEsZ0JBQUEsT0FBQSxHQUFBLE9BQUEsWUFBQSxvQkFBQSxRQUFBLFNBQUEsQ0FBQSxPQUFBLGlCQUFBLE1BQUEsQ0FBQSxFQUFBLE9BQUEsR0FBQSxDQUFBLE1BQUEsQ0FBQSxJQUFBLE1BQUEsSUFBQSxjQUFBLFFBQUEsUUFBQSxxQkFBQSxLQUFBLGdCQUFBLEtBQUEsT0FBQSxNQUFBLEtBQUEscUJBQUEsS0FBQSxvQkFBQSx5QkFBQSxPQUFBLE1BQUEsQ0FBQSxFQUFBLE1BQUEsQ0FBQSxHQUFBLEtBQUEsbUJBQUEsVUFBQSxDQUFBLElBQUEsVUFBQSxLQUFBLGdCQUFBLE9BQUEsR0FBQSxFQUFBLFVBQUEsS0FBQSx1Q0FBQSxHQUFBLFVBQUEsRUFBQSxDQUFBLElBQUEsSUFBQSxnQkFBQSxFQUFBLEVBQUEsRUFBQSxVQUFBLEVBQUEsSUFBQSxpQkFBQSxLQUFBLGdCQUFBLEdBQUEsb0JBQUEsSUFBQSxJQUFBLFFBQUEsZ0JBQUEsVUFBQSxFQUFBLEVBQUEsRUFBQSxLQUFBLGdCQUFBLFFBQUEsS0FBQSxnQkFBQSxPQUFBLEVBQUEsSUFBQSxDQUFBLElBQUEsUUFBQSxLQUFBLGdCQUFBLEdBQUEsS0FBQSxJQUFBLFFBQUEsb0JBQUEsU0FBQSxHQUFBLFVBQUEsS0FBQSxnQkFBQSxPQUFBLEdBQUEsTUFBQSxPQUFBLEtBQUEsZ0JBQUEsTUFBQSxFQUFBLElBQUEsTUFBQSxLQUFBLGdCQUFBLEdBQUEsS0FBQSxnQkFBQSxHQUFBLEtBQUEsZ0JBQUEsS0FBQSxLQUFBLFlBQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxLQUFBLGdCQUFBLE9BQUEsR0FBQSxHQUFBLElBQUEsT0FBQSxFQUFBLElBQUEsSUFBQSxxQkFBQSxLQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUFBLElBQUEsT0FBQSxLQUFBLGdCQUFBLEdBQUEsR0FBQSxPQUFBLE9BQUEsY0FBQSxDQUFBLEdBQUEsTUFBQSxxQkFBQSxPQUFBLEtBQUEsV0FBQSxDQUFBLEVBQUEsS0FBQSxNQUFBLENBQUEsS0FBQSxJQUFBLHFCQUFBLEVBQUEsT0FBQSxHQUFBLEtBQUEsSUFBQSxxQkFBQSxFQUFBLE9BQUEsSUFBQSxHQUFBLHFCQUFBLFFBQUEsT0FBQSxHQUFBLEtBQUEsNkJBQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxlQUFBLEVBQUEsZ0JBQUEsRUFBQSxJQUFBLEtBQUEsZ0JBQUEsT0FBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQSxJQUFBLFFBQUEsS0FBQSxnQkFBQSxHQUFBLFFBQUEsT0FBQSxnQkFBQSxpQkFBQSxpQkFBQSxRQUFBLHFCQUFBLEdBQUEsRUFBQSxlQUFBLE1BQUEsQ0FBQSxFQUFBLElBQUEsSUFBQSxRQUFBLGdCQUFBLElBQUEsZUFBQSxFQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxRQUFBLEtBQUEsZ0JBQUEsR0FBQSxnQkFBQSxLQUFBLElBQUEsUUFBQSxvQkFBQSxTQUFBLE1BQUEsSUFBQSxpQkFBQSxnQkFBQSxLQUFBLGtCQUFBLFNBQUEsTUFBQSxDQUFBLElBQUEsVUFBQSxDQUFBLEVBQUEsS0FBQSxNQUFBLE1BQUEsSUFBQSxLQUFBLE9BQUEsT0FBQSxLQUFBLE9BQUEsTUFBQSxNQUFBLEtBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxjQUFBLENBQUEsU0FBQSxPQUFBLGFBQUEsTUFBQSxVQUFBLElBQUEsSUFBQSxLQUFBLENBQUEsRUFBQSxXQUFBLElBQUEsTUFBQSxHQUFBLEVBQUEsTUFBQSxFQUFBLEtBQUEsR0FBQSxDQUFBLEtBQUEsR0FBQSxNQUFBLENBQUEsV0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEVBQUEsSUFBQSxJQUFBLGFBQUEsRUFBQSxFQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsR0FBQSxNQUFBLEVBQUEsRUFBQSxPQUFBLE9BQUEsSUFBQSxFQUFBLGVBQUEsZUFBQSxXQUFBLHFCQUFBLEdBQUEsSUFBQSxFQUFBLGNBQUEsR0FBQSxHQUFBLGFBQUEsR0FBQSxLQUFBLGtCQUFBLFlBQUEsQ0FBQSxJQUFBLFVBQUEsS0FBQSxxQkFBQSxXQUFBLEVBQUEsR0FBQSxHQUFBLFVBQUEsR0FBQSxNQUFBLEVBQUEsS0FBQSxXQUFBLEtBQUEsS0FBQSxtQ0FBQSxDQUFBLElBQUEsUUFBQSxLQUFBLGNBQUEsUUFBQSxXQUFBLEtBQUEsR0FBQSxRQUFBLFdBQUEsR0FBQSxNQUFBLEVBQUEsS0FBQSxPQUFBLENBQUEsR0FBQSxVQUFBLEtBQUEsR0FBQSxDQUFBLE1BQUEsRUFBQSxFQUFBLE9BQUEsUUFBQSxJQUFBLGFBQUEsRUFBQSxXQUFBLEdBQUEsRUFBQSxXQUFBLEdBQUEsRUFBQSxXQUFBLEdBQUEsRUFBQSxXQUFBLEdBQUEsRUFBQSxXQUFBLEdBQUEsT0FBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsRUFBQSxXQUFBLEdBQUEsRUFBQSxhQUFBLE9BQUEsV0FBQSxFQUFBLHFCQUFBLFdBQUEsZ0JBQUEsR0FBQSxLQUFBLGtCQUFBLFlBQUEsQ0FBQSxJQUFBLFVBQUEsS0FBQSxxQkFBQSxXQUFBLEVBQUEsTUFBQSxZQUFBLE1BQUEsV0FBQSxHQUFBLEtBQUEsYUFBQSxLQUFBLGtDQUFBLElBQUEsWUFBQSxLQUFBLHFCQUFBLE9BQUEsT0FBQSxrQkFBQSxhQUFBLElBQUEsa0JBQUEsY0FBQSxTQUFBLGlCQUFBLEtBQUEsS0FBQSxvQkFBQSxDQUFBLEtBQUEsRUFBQSxLQUFBLEtBQUEsRUFBQSxLQUFBLEtBQUEsTUFBQSxFQUFBLEtBQUEsb0JBQUEsb0JBQUEsS0FBQSxpQkFBQSxzQkFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLHNCQUFBLEtBQUEsaUJBQUEsUUFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLFFBQUEsS0FBQSxpQkFBQSxJQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsTUFBQSxLQUFBLEtBQUEsS0FBQSxpQkFBQSxJQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsTUFBQSxLQUFBLEtBQUEsS0FBQSxlQUFBLFVBQUEsQ0FBQSxLQUFBLFNBQUEsS0FBQSxZQUFBLFNBQUEsV0FBQSxFQUFBLEVBQUEsQ0FBQSxHQUFBLEtBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxZQUFBLEtBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxXQUFBLENBQUEsSUFBQSxlQUFBLEtBQUEsSUFBQSxXQUFBLEtBQUEscUJBQUEsT0FBQSxHQUFBLGdCQUFBLGVBQUEsS0FBQSxxQkFBQSxFQUFBLE1BQUEsQ0FBQSxHQUFBLFNBQUEsdUJBQUEsTUFBQSxPQUFBLE9BQUEsTUFBQSxPQUFBLFdBQUEsb0JBQUEsQ0FBQSxLQUFBLE1BQUEsTUFBQSxLQUFBLGdCQUFBLElBQUEsTUFBQSxLQUFBLE9BQUEsT0FBQSxLQUFBLE9BQUEsT0FBQSxLQUFBLE1BQUEsTUFBQSxLQUFBLE9BQUEsT0FBQSxLQUFBLFdBQUEsV0FBQSxLQUFBLHFCQUFBLElBQUEsTUFBQSxFQUFBLEVBQUEsR0FBQSxLQUFBLG9CQUFBLG9CQUFBLEtBQUEsY0FBQSxTQUFBLFdBQUEsSUFBQSxDQUFBLE9BQUEsSUFBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLEdBQUEsS0FBQSxrQkFBQSxTQUFBLFdBQUEsQ0FBQSxJQUFBLElBQUEsV0FBQSxLQUFBLFdBQUEsWUFBQSxXQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFdBQUEsV0FBQSxLQUFBLFlBQUEsTUFBQSxDQUFBLEVBQUEsTUFBQSxDQUFBLEdBQUEsS0FBQSxtQkFBQSxTQUFBLE9BQUEsUUFBQSxTQUFBLHdCQUFBLENBQUEsSUFBQSxNQUFBLEtBQUEsTUFBQSxLQUFBLE9BQUEsT0FBQSxXQUFBLEtBQUEscUJBQUEsV0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEVBQUEsSUFBQSxJQUFBLEVBQUEsT0FBQSxHQUFBLEdBQUEsTUFBQSxRQUFBLEVBQUEsT0FBQSxRQUFBLFdBQUEsSUFBQSxVQUFBLFdBQUEsS0FBQSxJQUFBLEdBQUEsRUFBQSxHQUFBLFdBQUEsR0FBQSxTQUFBLE9BQUEsSUFBQSxLQUFBLEdBQUEsR0FBQSxDQUFBLE1BQUEsUUFBQSxFQUFBLE9BQUEsUUFBQSxXQUFBLElBQUEsVUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLFdBQUEsR0FBQSxTQUFBLE9BQUEsSUFBQSxJQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUEsR0FBQSxNQUFBLFFBQUEsRUFBQSxPQUFBLFFBQUEsV0FBQSxJQUFBLFVBQUEsV0FBQSxLQUFBLElBQUEsR0FBQSxHQUFBLE1BQUEsV0FBQSxHQUFBLFNBQUEsT0FBQSxJQUFBLEtBQUEsS0FBQSxHQUFBLENBQUEsTUFBQSxRQUFBLEVBQUEsT0FBQSxRQUFBLFdBQUEsSUFBQSxVQUFBLFdBQUEsS0FBQSxJQUFBLEdBQUEsV0FBQSxHQUFBLFNBQUEsT0FBQSxJQUFBLElBQUEsZ0JBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsT0FBQSxFQUFBLEtBQUEsSUFBQSxnQkFBQSwwQkFBQSxFQUFBLHdCQUFBLElBQUEsS0FBQSxrQkFBQSxZQUFBLEtBQUEsY0FBQSxXQUFBLEdBQUEsS0FBQSxLQUFBLHFCQUFBLFNBQUEsV0FBQSxFQUFBLEVBQUEsQ0FBQSxJQUFBLGdCQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLFFBQUEsS0FBQSxjQUFBLFdBQUEsR0FBQSxRQUFBLEtBQUEsbUJBQUEsRUFBQSxLQUFBLE1BQUEsU0FBQSxFQUFBLFdBQUEsR0FBQSxpQkFBQSxHQUFBLENBQUEsTUFBQSxTQUFBLENBQUEsSUFBQSxJQUFBLG9CQUFBLENBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLElBQUEsRUFBQSxJQUFBLEtBQUEsZ0JBQUEsT0FBQSxNQUFBLEVBQUEsSUFBQSxNQUFBLFFBQUEsQ0FBQSxJQUFBLE9BQUEsS0FBQSxnQkFBQSxPQUFBLEdBQUEsT0FBQSxZQUFBLG9CQUFBLFFBQUEsU0FBQSxPQUFBLElBQUEsaUJBQUEsUUFBQSxRQUFBLHFCQUFBLElBQUEsTUFBQSxJQUFBLGlCQUFBLFFBQUEsUUFBQSxxQkFBQSxLQUFBLGdCQUFBLEtBQUEsT0FBQSxNQUFBLEtBQUEscUJBQUEsS0FBQSxvQkFBQSx5QkFBQSxPQUFBLE9BQUEsTUFBQSxLQUFBLEtBQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxPQUFBLEtBQUEsT0FBQSxPQUFBLEtBQUEsT0FBQSxLQUFBLE9BQUEsTUFBQSxRQUFBLFFBQUEsUUFBQSxHQUFBLFdBQUEsSUFBQSxNQUFBLEVBQUEsRUFBQSxHQUFBLEtBQUEsRUFBQSxPQUFBLEtBQUEsT0FBQSxDQUFBLElBQUEsRUFBQSxTQUFBLElBQUEsRUFBQSxNQUFBLEtBQUEsR0FBQSxFQUFBLEVBQUEsS0FBQSxHQUFBLElBQUEsV0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEVBQUEsSUFBQSxJQUFBLEVBQUEsT0FBQSxLQUFBLEdBQUEsQ0FBQSxNQUFBLEVBQUEsT0FBQSxNQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsYUFBQSxFQUFBLEtBQUEsR0FBQSxDQUFBLEdBQUEsTUFBQSxFQUFBLEVBQUEsT0FBQSxPQUFBLEdBQUEsR0FBQSxhQUFBLFdBQUEscUJBQUEsR0FBQSxHQUFBLGFBQUEsQ0FBQSxHQUFBLEtBQUEsa0JBQUEsWUFBQSxDQUFBLElBQUEsVUFBQSxLQUFBLHFCQUFBLFdBQUEsRUFBQSxHQUFBLEdBQUEsTUFBQSxVQUFBLE9BQUEsVUFBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxFQUFBLFdBQUEsR0FBQSxFQUFBLGFBQUEsT0FBQSxXQUFBLEVBQUEscUJBQUEsR0FBQSxjQUFBLGVBQUEsV0FBQSxnQkFBQSxJQUFBLEdBQUEsS0FBQSxrQkFBQSxZQUFBLENBQUEsSUFBQSxVQUFBLEtBQUEscUJBQUEsV0FBQSxFQUFBLE1BQUEsR0FBQSxNQUFBLFVBQUEsT0FBQSxXQUFBLEdBQUEsR0FBQSxLQUFBLGdCQUFBLE9BQUEsT0FBQSxLQUFBLGdCQUFBLEdBQUEsS0FBQSwyQ0FBQSxTQUFBLHNCQUFBLE9BQUEsUUFBQSx1QkFBQSxDQUFBLEtBQUEsYUFBQSxFQUFBLEtBQUEsV0FBQSxFQUFBLEtBQUEsV0FBQSxFQUFBLEtBQUEsT0FBQSxPQUFBLEtBQUEsdUJBQUEsdUJBQUEsR0FBQSxRQUFBLEtBQUEsZUFBQSxFQUFBLFNBQUEsSUFBQSxJQUFBLFFBQUEsS0FBQSxlQUFBLEVBQUEsU0FBQSxJQUFBLElBQUEsVUFBQSxLQUFBLGVBQUEsR0FBQSxLQUFBLFlBQUEsU0FBQSxRQUFBLENBQUEsSUFBQSxLQUFBLEVBQUEsR0FBQSxRQUFBLEtBQUEsV0FBQSxFQUFBLENBQUEsSUFBQSxJQUFBLEtBQUEsRUFBQSxFQUFBLEVBQUEsUUFBQSxFQUFBLElBQUEsTUFBQSxHQUFBLEVBQUEsT0FBQSxPQUFBLEtBQUEsV0FBQSxRQUFBLEVBQUEsS0FBQSxDQUFBLEtBQUEsT0FBQSxLQUFBLGNBQUEsT0FBQSxLQUFBLFdBQUEsUUFBQSxFQUFBLEtBQUEsWUFBQSxRQUFBLEtBQUEsR0FBQSxRQUFBLEtBQUEsV0FBQSxFQUFBLEVBQUEsQ0FBQSxJQUFBLElBQUEsTUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEtBQUEsV0FBQSxFQUFBLElBQUEsT0FBQSxHQUFBLEVBQUEsT0FBQSxLQUFBLENBQUEsS0FBQSxPQUFBLEtBQUEsY0FBQSxRQUFBLFNBQUEsS0FBQSxXQUFBLEdBQUEsS0FBQSxlQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUEsZUFBQSxHQUFBLFNBQUEsS0FBQSxXQUFBLElBQUEsS0FBQSxXQUFBLEtBQUEsV0FBQSxRQUFBLEVBQUEsS0FBQSxXQUFBLElBQUEsS0FBQSxXQUFBLEVBQUEsS0FBQSxZQUFBLEtBQUEsR0FBQSxRQUFBLEtBQUEsV0FBQSxFQUFBLEdBQUEsQ0FBQSxJQUFBLElBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxLQUFBLFdBQUEsRUFBQSxJQUFBLE9BQUEsR0FBQSxFQUFBLElBQUEsZUFBQSxDQUFBLEtBQUEsT0FBQSxLQUFBLGNBQUEsUUFBQSxTQUFBLEtBQUEsV0FBQSxHQUFBLEtBQUEsZUFBQSxJQUFBLGdCQUFBLEtBQUEsT0FBQSxLQUFBLGVBQUEsU0FBQSxLQUFBLFdBQUEsRUFBQSxHQUFBLEtBQUEsZUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLEVBQUEsU0FBQSxLQUFBLFdBQUEsRUFBQSxHQUFBLElBQUEsT0FBQSxHQUFBLEVBQUEsUUFBQSxHQUFBLFNBQUEsS0FBQSxXQUFBLEVBQUEsSUFBQSxJQUFBLGVBQUEsQ0FBQSxLQUFBLE9BQUEsS0FBQSxjQUFBLFFBQUEsR0FBQSxTQUFBLEtBQUEsV0FBQSxFQUFBLElBQUEsT0FBQSxLQUFBLGVBQUEsZ0JBQUEsZUFBQSxLQUFBLFdBQUEsS0FBQSxXQUFBLENBQUEsUUFBQSxHQUFBLEVBQUEsS0FBQSxXQUFBLElBQUEsS0FBQSxXQUFBLEVBQUEsS0FBQSxZQUFBLEtBQUEsT0FBQSxHQUFBLEtBQUEsU0FBQSxVQUFBLENBQUEsT0FBQSxLQUFBLGFBQUEsS0FBQSxPQUFBLE9BQUEsS0FBQSx1QkFBQSxFQUFBLEVBQUEsS0FBQSxZQUFBLElBQUEsS0FBQSxjQUFBLFNBQUEsY0FBQSxDQUFBLElBQUEsSUFBQSxNQUFBLElBQUEsQ0FBQSxHQUFBLGVBQUEsT0FBQSxFQUFBLE1BQUEsUUFBQSxPQUFBLEtBQUEsWUFBQSxPQUFBLHFCQUFBLEtBQUEsZ0JBQUEsU0FBQSxLQUFBLHdCQUFBLFNBQUEsV0FBQSxDQUFBLElBQUEsT0FBQSxXQUFBLFFBQUEsRUFBQSxRQUFBLEdBQUEsb0JBQUEsSUFBQSxNQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxLQUFBLEdBQUEsR0FBQSxPQUFBLEVBQUEsQ0FBQSxRQUFBLEtBQUEsWUFBQSxJQUFBLElBQUEsWUFBQSxLQUFBLE1BQUEsUUFBQSxJQUFBLGFBQUEsUUFBQSxHQUFBLFNBQUEsb0JBQUEsYUFBQSxTQUFBLG9CQUFBLGNBQUEsUUFBQSxPQUFBLEdBQUEsU0FBQSxRQUFBLEtBQUEsWUFBQSxHQUFBLFNBQUEsb0JBQUEsU0FBQSxRQUFBLFNBQUEsT0FBQSxHQUFBLE9BQUEsU0FBQSxLQUFBLGdCQUFBLFNBQUEsV0FBQSxDQUFBLElBQUEsT0FBQSxXQUFBLFFBQUEsRUFBQSxRQUFBLEdBQUEsR0FBQSxRQUFBLEdBQUEsUUFBQSxLQUFBLFlBQUEsSUFBQSxJQUFBLFVBQUEsU0FBQSxLQUFBLEdBQUEsVUFBQSxTQUFBLEtBQUEsUUFBQSxHQUFBLEdBQUEsUUFBQSxRQUFBLEtBQUEsWUFBQSxHQUFBLEdBQUEsVUFBQSxTQUFBLEtBQUEsUUFBQSxHQUFBLEdBQUEsU0FBQSxRQUFBLEtBQUEsWUFBQSxHQUFBLFFBQUEsR0FBQSxTQUFBLGNBQUEsT0FBQSxHQUFBLE9BQUEsU0FBQSxLQUFBLGlCQUFBLFNBQUEsV0FBQSxDQUFBLElBQUEsT0FBQSxXQUFBLFFBQUEsRUFBQSxPQUFBLElBQUEsTUFBQSxHQUFBLFFBQUEsS0FBQSxZQUFBLEdBQUEsT0FBQSxLQUFBLFNBQUEsZUFBQSxPQUFBLEdBQUEsT0FBQSxRQUFBLEtBQUEsZUFBQSxTQUFBLFdBQUEsQ0FBQSxJQUFBLE9BQUEsV0FBQSxRQUFBLEVBQUEsY0FBQSxHQUFBLEVBQUEsQ0FBQSxRQUFBLFlBQUEsSUFBQSxJQUFBLFVBQUEsUUFBQSxJQUFBLFdBQUEsUUFBQSxJQUFBLFNBQUEsQ0FBQSxZQUFBLEdBQUEsVUFBQSxhQUFBLEVBQUEsYUFBQSxPQUFBLFNBQUEsTUFBQSxTQUFBLE1BQUEsU0FBQSxNQUFBLGVBQUEsT0FBQSxhQUFBLGNBQUEsZUFBQSxPQUFBLEdBQUEsT0FBQSxlQUFBLEtBQUEsaUJBQUEsV0FBQSxVQUFBLENBQUEsSUFBQSxJQUFBLE9BQUEsSUFBQSxNQUFBLFlBQUEsRUFBQSxzQkFBQSxFQUFBLGVBQUEsRUFBQSxXQUFBLElBQUEsQ0FBQSxJQUFBLEtBQUEsS0FBQSxXQUFBLEdBQUEsR0FBQSxLQUFBLENBQUEsR0FBQSxPQUFBLE9BQUEsRUFBQSxNQUFBLEtBQUEsbUJBQUEsR0FBQSxNQUFBLGFBQUEsTUFBQSx1QkFBQSxNQUFBLGdCQUFBLE1BQUEsV0FBQSxLQUFBLGlCQUFBLEtBQUEsY0FBQSxLQUFBLGFBQUEsUUFBQSxLQUFBLFdBQUEsSUFBQSxHQUFBLFdBQUEsS0FBQSxjQUFBLE1BQUEsV0FBQSxFQUFBLEtBQUEsd0JBQUEsV0FBQSxPQUFBLE1BQUEsS0FBQSxZQUFBLElBQUEsSUFBQSxTQUFBLEtBQUEsZ0JBQUEsWUFBQSxHQUFBLElBQUEsTUFBQSxTQUFBLFFBQUEsRUFBQSxFQUFBLEVBQUEsU0FBQSxPQUFBLElBQUEsR0FBQSxHQUFBLFNBQUEsV0FBQSxHQUFBLE9BQUEsS0FBQSxJQUFBLE1BQUEsS0FBQSxzQkFBQSxJQUFBLElBQUEsU0FBQSxLQUFBLHdCQUFBLFlBQUEsR0FBQSxJQUFBLE1BQUEsU0FBQSxRQUFBLEVBQUEsRUFBQSxFQUFBLFNBQUEsT0FBQSxJQUFBLEdBQUEsR0FBQSxTQUFBLFdBQUEsR0FBQSxPQUFBLEtBQUEsSUFBQSxNQUFBLEtBQUEsZUFBQSxJQUFBLGlCQUFBLEtBQUEsaUJBQUEsWUFBQSxPQUFBLEtBQUEsa0JBQUEsTUFBQSxLQUFBLFdBQUEsSUFBQSxTQUFBLEtBQUEsZUFBQSxZQUFBLE9BQUEsS0FBQSxXQUFBLE9BQUEsU0FBQSxZQUFBLEdBQUEsWUFBQSxvQkFBQSxTQUFBLE1BQUEsT0FBQSxDQUFBLElBQUEsSUFBQSxNQUFBLE9BQUEsTUFBQSxPQUFBLE9BQUEsT0FBQSxPQUFBLENBQUEsRUFBQSxPQUFBLEVBQUEsT0FBQSxPQUFBLFFBQUEsT0FBQSxRQUFBLEVBQUEsQ0FBQSxJQUFBLEVBQUEsS0FBQSxNQUFBLE9BQUEsU0FBQSxFQUFBLEtBQUEsTUFBQSxPQUFBLE9BQUEsSUFBQSxHQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsT0FBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLE9BQUEsS0FBQSw2QkFBQSxPQUFBLENBQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxPQUFBLFFBQUEsRUFBQSxPQUFBLENBQUEsR0FBQSxHQUFBLFFBQUEsT0FBQSxRQUFBLE1BQUEsRUFBQSxPQUFBLENBQUEsR0FBQSxDQUFBLEdBQUEsR0FBQSxPQUFBLE9BQUEsR0FBQSxFQUFBLE9BQUEsQ0FBQSxHQUFBLEdBQUEsU0FBQSxPQUFBLE9BQUEsR0FBQSxPQUFBLEVBQUEsT0FBQSxDQUFBLEdBQUEsT0FBQSxDQUFBLEVBQUEsSUFBQSxJQUFBLE9BQUEsT0FBQSxPQUFBLEVBQUEsUUFBQSxHQUFBLE9BQUEsUUFBQSxFQUFBLENBQUEsSUFBQSxFQUFBLEtBQUEsTUFBQSxPQUFBLFNBQUEsRUFBQSxLQUFBLE1BQUEsT0FBQSxPQUFBLElBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLE9BQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxPQUFBLEtBQUEsNkJBQUEsT0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsT0FBQSxRQUFBLEVBQUEsT0FBQSxDQUFBLEdBQUEsR0FBQSxRQUFBLE9BQUEsUUFBQSxNQUFBLEVBQUEsT0FBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLEdBQUEsT0FBQSxPQUFBLEdBQUEsRUFBQSxPQUFBLENBQUEsR0FBQSxHQUFBLFNBQUEsT0FBQSxPQUFBLEdBQUEsT0FBQSxFQUFBLE9BQUEsQ0FBQSxLQUFBLFlBQUEsWUFBQSxTQUFBLE1BQUEsVUFBQSxVQUFBLENBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxVQUFBLFdBQUEsT0FBQSxJQUFBLE1BQUEsV0FBQSxHQUFBLEVBQUEsRUFBQSxVQUFBLEVBQUEsSUFBQSxDQUFBLElBQUEsSUFBQSxJQUFBLE9BQUEsT0FBQSxPQUFBLEVBQUEsR0FBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLEdBQUEsRUFBQSxPQUFBLEdBQUEsQ0FBQSxHQUFBLEdBQUEsR0FBQSxPQUFBLEVBQUEsR0FBQSxPQUFBLFVBQUEsaUJBQUEsUUFBQSxZQUFBLG9CQUFBLE1BQUEsUUFBQSxHQUFBLENBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLENBQUEsSUFBQSxPQUFBLEVBQUEsS0FBQSxNQUFBLE9BQUEsSUFBQSxLQUFBLE1BQUEsT0FBQSxFQUFBLElBQUEsT0FBQSxNQUFBLEVBQUEsSUFBQSxNQUFBLEtBQUEsTUFBQSxPQUFBLElBQUEsT0FBQSxNQUFBLEtBQUEsTUFBQSxPQUFBLEVBQUEsS0FBQSxPQUFBLFVBQUEsS0FBQSxRQUFBLElBQUEsSUFBQSxFQUFBLE9BQUEsVUFBQSxLQUFBLE9BQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxPQUFBLFVBQUEsS0FBQSxPQUFBLEdBQUEsRUFBQSxPQUFBLFVBQUEsS0FBQSxPQUFBLEdBQUEsSUFBQSxLQUFBLEtBQUEsWUFBQSxHQUFBLEVBQUEsSUFBQSxNQUFBLE9BQUEsQ0FBQSxLQUFBLDZCQUFBLE9BQUEsTUFBQSxZQUFBLFlBQUEsU0FBQSxNQUFBLFVBQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLFFBQUEsUUFBQSxRQUFBLFFBQUEsUUFBQSxRQUFBLFFBQUEsUUFBQSxDQUFBLElBQUEsVUFBQSxxQkFBQSw2QkFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsUUFBQSxRQUFBLFFBQUEsUUFBQSxRQUFBLFFBQUEsUUFBQSxTQUFBLE9BQUEsWUFBQSxZQUFBLE1BQUEsVUFBQSxZQUFBLFFBQUEsb0JBQUEsSUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxPQUFBLE9BQUEsT0FBQSxPQUFBLE9BQUEsT0FBQSxPQUFBLE9BQUEsT0FBQSxPQUFBLE9BQUEsT0FBQSxPQUFBLE9BQUEsT0FBQSxPQUFBLFFBQUEsUUFBQSxTQUFBLGdCQUFBLFFBQUEsb0JBQUEsU0FBQSxjQUFBLENBQUEsR0FBQSxFQUFBLGVBQUEsY0FBQSxHQUFBLEtBQUEsb0JBQUEsT0FBQSxRQUFBLFNBQUEsY0FBQSxJQUFBLFFBQUEsa0NBQUEsU0FBQSxVQUFBLENBQUEsR0FBQSxVQUFBLEdBQUEsRUFBQSxLQUFBLDBDQUFBLEdBQUEsQ0FBQSxPQUFBLFFBQUEsb0JBQUEsVUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLENBQUEsS0FBQSw4QkFBQSxRQUFBLHlCQUFBLFNBQUEsWUFBQSxDQUFBLElBQUEsSUFBQSxlQUFBLFdBQUEsWUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLFFBQUEsb0JBQUEsT0FBQSxJQUFBLENBQUEsSUFBQSxjQUFBLFFBQUEsb0JBQUEsR0FBQSxHQUFBLGVBQUEsWUFBQSxPQUFBLEtBQUEsb0JBQUEsRUFBQSxHQUFBLElBQUEsZUFBQSxrQkFBQSxpQkFBQSxZQUFBLGVBQUEsZUFBQSxpQkFBQSxZQUFBLEVBQUEsRUFBQSxlQUFBLGdCQUFBLE9BQUEsR0FBQSxlQUFBLEtBQUEsb0JBQUEsYUFBQSxNQUFBLHFCQUFBLDZCQUFBLFNBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxDQUFBLElBQUEsS0FBQSxLQUFBLHNCQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxLQUFBLEtBQUEsc0JBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxLQUFBLE9BQUEsS0FBQSxNQUFBLE9BQUEscUJBQUEsc0JBQUEsU0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsQ0FBQSxPQUFBLElBQUEsR0FBQSxHQUFBLElBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEtBQUEsR0FBQSxJQUFBLElBQUEscUJBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxFQUFBLEVBQUEsSUFBQSxJQUFBLEdBQUEsR0FBQSxJQUFBLEdBQUEsR0FBQSxJQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxHQUFBLEdBQUEsWUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsQ0FBQSxJQUFBLElBQUEsSUFBQSxLQUFBLFlBQUEsSUFBQSxDQUFBLElBQUEsSUFBQSxJQUFBLEtBQUEsWUFBQSxJQUFBLHFCQUFBLEdBQUEsR0FBQSxJQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxLQUFBLHFCQUFBLHNCQUFBLFNBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLENBQUEsT0FBQSxLQUFBLHNCQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxnQkFBQSxJQUFBLG9CQUFBLE1BQUEsMEJBQUEsSUFBQSxNQUFBLElBQUEsTUFBQSxNQUFBLEdBQUEsSUFBQSxNQUFBLE1BQUEsR0FBQSxJQUFBLE1BQUEsTUFBQSxHQUFBLElBQUEsTUFBQSxNQUFBLEdBQUEsSUFBQSxNQUFBLE1BQUEsR0FBQSxJQUFBLE1BQUEsTUFBQSxHQUFBLElBQUEsTUFBQSxNQUFBLEdBQUEsSUFBQSxNQUFBLE1BQUEsR0FBQSxJQUFBLE1BQUEsTUFBQSxHQUFBLElBQUEsTUFBQSxNQUFBLEdBQUEsSUFBQSxNQUFBLE1BQUEsSUFBQSxJQUFBLE1BQUEsTUFBQSxJQUFBLElBQUEsTUFBQSxNQUFBLElBQUEsSUFBQSxNQUFBLE1BQUEsSUFBQSxJQUFBLE1BQUEsTUFBQSxJQUFBLElBQUEsTUFBQSxNQUFBLElBQUEsSUFBQSxNQUFBLEtBQUEsSUFBQSxJQUFBLE1BQUEsS0FBQSxJQUFBLElBQUEsTUFBQSxLQUFBLElBQUEsSUFBQSxNQUFBLEtBQUEsSUFBQSxJQUFBLE1BQUEsS0FBQSxJQUFBLElBQUEsTUFBQSxJQUFBLElBQUEsSUFBQSxNQUFBLEtBQUEsSUFBQSxJQUFBLE1BQUEsS0FBQSxJQUFBLElBQUEsTUFBQSxNQUFBLElBQUEsSUFBQSxNQUFBLE1BQUEsSUFBQSxJQUFBLE1BQUEsTUFBQSxJQUFBLElBQUEsTUFBQSxNQUFBLElBQUEsSUFBQSxNQUFBLEtBQUEsSUFBQSxJQUFBLE1BQUEsS0FBQSxJQUFBLElBQUEsTUFBQSxNQUFBLElBQUEsSUFBQSxNQUFBLE1BQUEsS0FBQSxzQkFBQSxJQUFBLE1BQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsR0FBQSxrQkFBQSxpQkFBQSxTQUFBLEVBQUEsRUFBQSxDQUFBLE9BQUEsR0FBQSxFQUFBLHNCQUFBLEdBQUEsR0FBQSxzQkFBQSxHQUFBLFFBQUEsRUFBQSxJQUFBLHNCQUFBLEdBQUEsUUFBQSxFQUFBLElBQUEsc0JBQUEsR0FBQSxRQUFBLEVBQUEsS0FBQSxzQkFBQSxHQUFBLFFBQUEsRUFBQSxLQUFBLHNCQUFBLEdBQUEsUUFBQSxFQUFBLEtBQUEsc0JBQUEsR0FBQSxRQUFBLEVBQUEsS0FBQSxzQkFBQSxHQUFBLFFBQUEsRUFBQSxNQUFBLGtCQUFBLHdCQUFBLFNBQUEsaUJBQUEsQ0FBQSxJQUFBLFdBQUEsa0JBQUEsMEJBQUEsa0JBQUEsT0FBQSxNQUFBLFdBQUEsV0FBQSxrQkFBQSwwQkFBQSxpQkFBQSxzQkFBQSxrQkFBQSwwQkFBQSxTQUFBLGlCQUFBLENBQUEsSUFBQSxJQUFBLGVBQUEsV0FBQSxlQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsMEJBQUEsT0FBQSxJQUFBLENBQUEsSUFBQSxXQUFBLDBCQUFBLEdBQUEsV0FBQSxXQUFBLEdBQUEsR0FBQSxZQUFBLGlCQUFBLE9BQUEsSUFBQSxrQkFBQSxXQUFBLElBQUEsSUFBQSxlQUFBLEtBQUEsaUJBQUEsaUJBQUEsWUFBQSxlQUFBLGlCQUFBLGVBQUEsV0FBQSxHQUFBLGVBQUEsZ0JBQUEsT0FBQSxHQUFBLGVBQUEsSUFBQSxrQkFBQSxnQkFBQSxNQUFBLHFCQUFBLFFBQUEsU0FBQSxLQUFBLENBQUEsR0FBQSxFQUFBLE1BQUEsTUFBQSxTQUFBLE9BQUEsS0FBQSxvQkFBQSxPQUFBLFNBQUEsT0FBQSxJQUFBLEVBQUEsSUFBQSxxQkFBQSxFQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEscUJBQUEsRUFBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLHFCQUFBLEVBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxxQkFBQSxFQUFBLEVBQUEsS0FBQSxTQUFBLElBQUEsTUFBQSxFQUFBLEVBQUEsRUFBQSxHQUFBLFVBQUEsY0FBQSxTQUFBLGFBQUEsUUFBQSxRQUFBLENBQUEsR0FBQSxhQUFBLFFBQUEsUUFBQSxlQUFBLEtBQUEsb0JBQUEsSUFBQSxJQUFBLFNBQUEsUUFBQSxvQkFBQSxTQUFBLFlBQUEsRUFBQSxhQUFBLFNBQUEsY0FBQSxFQUFBLEVBQUEsRUFBQSxhQUFBLE9BQUEsSUFBQSxhQUFBLGFBQUEsR0FBQSxNQUFBLElBQUEsSUFBQSxPQUFBLElBQUEsTUFBQSxhQUFBLGdCQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsYUFBQSxPQUFBLElBQUEsSUFBQSxJQUFBLFFBQUEsYUFBQSxHQUFBLEVBQUEsRUFBQSxFQUFBLFFBQUEsTUFBQSxJQUFBLENBQUEsSUFBQSxpQkFBQSxRQUFBLGNBQUEsa0JBQUEsU0FBQSxvQkFBQSxpQkFBQSxPQUFBLG1CQUFBLElBQUEsVUFBQSxpQkFBQSxJQUFBLE1BQUEsb0JBQUEsSUFBQSxJQUFBLDRCQUFBLE9BQUEsR0FBQSxVQUFBLE9BQUEsb0JBQUEsT0FBQSxPQUFBLEVBQUEscUJBQUEsR0FBQSxDQUFBLElBQUEsYUFBQSxPQUFBLHFCQUFBLFVBQUEsT0FBQSxHQUFBLGNBQUEsNEJBQUEsTUFBQSxzQkFBQSxzQkFBQSxJQUFBLElBQUEsOEJBQUEsNEJBQUEsU0FBQSxvQkFBQSxtQkFBQSxFQUFBLEVBQUEsRUFBQSw4QkFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxnQkFBQSxFQUFBLElBQUEsT0FBQSxHQUFBLFVBQUEsR0FBQSxhQUFBLHNCQUFBLElBQUEsSUFBQSxFQUFBLG9CQUFBLGdCQUFBLEVBQUEsSUFBQSxPQUFBLEdBQUEsVUFBQSwrQkFBQSxhQUFBLHNCQUFBLElBQUEsSUFBQSxJQUFBLE9BQUEsR0FBQSxVQUFBLE9BQUEsRUFBQSw4QkFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLGdCQUFBLEVBQUEsSUFBQSxDQUFBLElBQUEsUUFBQSxvQkFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLE9BQUEsR0FBQSxVQUFBLFNBQUEsYUFBQSxzQkFBQSxPQUFBLFFBQUEsU0FBQSxHQUFBLFNBQUEsYUFBQSxTQUFBLFVBQUEsQ0FBQSxHQUFBLEVBQUEsV0FBQSxVQUFBLEVBQUEsS0FBQSwyQkFBQSxPQUFBLFNBQUEsV0FBQSxZQUFBLFNBQUEsV0FBQSxJQUFBLE1BQUEsSUFBQSxZQUFBLElBQUEsWUFBQSxJQUFBLFlBQUEsSUFBQSxZQUFBLElBQUEsWUFBQSxJQUFBLFlBQUEsSUFBQSxZQUFBLElBQUEsYUFBQSxNQUFBLGNBQUEsSUFBQSxNQUFBLEtBQUEsTUFBQSxrQkFBQSxJQUFBLE1BQUEsS0FBQSxNQUFBLGNBQUEsU0FBQSxFQUFBLEVBQUEsQ0FBQSxPQUFBLEVBQUEsR0FBQSxRQUFBLEdBQUEsUUFBQSxVQUFBLElBQUEsbUJBQUEsTUFBQSxlQUFBLFFBQUEsY0FBQSxTQUFBLGNBQUEsaUJBQUEsQ0FBQSxJQUFBLElBQUEsYUFBQSxjQUFBLE9BQUEsY0FBQSxJQUFBLE1BQUEsY0FBQSxFQUFBLEVBQUEsYUFBQSxFQUFBLElBQUEsY0FBQSxHQUFBLElBQUEsY0FBQSxHQUFBLElBQUEsZUFBQSxjQUFBLE9BQUEsaUJBQUEsR0FBQSxDQUFBLFFBQUEsVUFBQSxPQUFBLGNBQUEsZ0JBQUEsTUFBQSxJQUFBLENBQUEsTUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsaUJBQUEsRUFBQSxJQUFBLGNBQUEsR0FBQSxjQUFBLElBQUEsUUFBQSxPQUFBLFNBQUEsS0FBQSxDQUFBLElBQUEsSUFBQSxPQUFBLElBQUEsZ0JBQUEsTUFBQSxRQUFBLE9BQUEsY0FBQSxRQUFBLE9BQUEsd0JBQUEscUJBQUEsVUFBQSxPQUFBLGdCQUFBLFdBQUEsVUFBQSxjQUFBLFVBQUEsUUFBQSxTQUFBLFdBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxXQUFBLE9BQUEsSUFBQSxZQUFBLFdBQUEsR0FBQSxpQkFBQSxJQUFBLElBQUEsWUFBQSxJQUFBLE1BQUEsWUFBQSxhQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsV0FBQSxPQUFBLElBQUEsQ0FBQSxJQUFBLFVBQUEsV0FBQSxHQUFBLGNBQUEsVUFBQSxVQUFBLGlCQUFBLFVBQUEsaUJBQUEsUUFBQSxjQUFBLGNBQUEsa0JBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxpQkFBQSxFQUFBLElBQUEsWUFBQSxnQkFBQSxjQUFBLEdBQUEsSUFBQSxPQUFBLElBQUEsc0JBQUEsWUFBQSxRQUFBLGNBQUEsUUFBQSxNQUFBLE9BQUEsUUFBQSxPQUFBLEdBQUEsT0FBQSxVQUFBLEtBQUEsT0FBQSxNQUFBLEVBQUEsT0FBQSxPQUFBLEVBQUEsT0FBQSxhQUFBLEtBQUEsT0FBQSxNQUFBLENBQUEsRUFBQSxPQUFBLHFCQUFBLENBQUEsQ0FBQSxHQUFBLEVBQUEsRUFBQSxHQUFBLENBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxDQUFBLEdBQUEsR0FBQSxHQUFBLEtBQUEsT0FBQSxTQUFBLEtBQUEsT0FBQSxPQUFBLFNBQUEsSUFBQSxDQUFBLEdBQUEsR0FBQSxVQUFBLE9BQUEsQ0FBQSxJQUFBLFVBQUEsU0FBQSxlQUFBLGFBQUEsUUFBQSxVQUFBLFdBQUEsTUFBQSxPQUFBLE9BQUEsTUFBQSxVQUFBLE1BQUEsT0FBQSxPQUFBLFVBQUEsT0FBQSxPQUFBLFVBQUEsUUFBQSxhQUFBLEVBQUEsRUFBQSxPQUFBLE1BQUEsT0FBQSxRQUFBLE9BQUEsT0FBQSxPQUFBLFFBQUEsU0FBQSxNQUFBLE9BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQSxRQUFBLE9BQUEsT0FBQSxJQUFBLE1BQUEsSUFBQSxNQUFBLE1BQUEsT0FBQSxVQUFBLENBQUEsSUFBQSxVQUFBLFNBQUEsY0FBQSxVQUFBLFFBQUEsVUFBQSxXQUFBLE1BQUEsV0FBQSxTQUFBLGVBQUEsY0FBQSxHQUFBLE1BQUEsV0FBQSxDQUFBLElBQUEsT0FBQSxXQUFBLFdBQUEsTUFBQSxPQUFBLFVBQUEsRUFBQSxFQUFBLElBQUEsS0FBQSxPQUFBLFVBQUEsTUFBQSxFQUFBLEVBQUEsSUFBQSxLQUFBLFVBQUEsTUFBQSxNQUFBLE1BQUEsVUFBQSxPQUFBLE1BQUEsT0FBQSxRQUFBLFVBQUEsTUFBQSxFQUFBLEdBQUEsT0FBQSxNQUFBLE1BQUEsTUFBQSxPQUFBLE9BQUEsTUFBQSxPQUFBLEdBQUEsQ0FBQSxPQUFBLFVBQUEsUUFBQSxhQUFBLEVBQUEsRUFBQSxNQUFBLE1BQUEsTUFBQSxRQUFBLE1BQUEsRUFBQSxDQUFBLE9BQUEsT0FBQSxPQUFBLGtIQUFBLEtBQUEsTUFBQSxPQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUEsU0FBQSxHQUFBLENBQUEsT0FBQSxPQUFBLE9BQUEsUUFBQSxTQUFBLE1BQUEsRUFBQSxDQUFBLFFBQUEsSUFBQSxHQUFBLE9BQUEsT0FBQSx5QkFBQSxNQUFBLE9BQUEsVUFBQSxPQUFBLFNBQUEsT0FBQSxTQUFBLE1BQUEsSUFBQSxLQUFBLE9BQUEsWUFBQSxTQUFBLEVBQUEsQ0FBQSxPQUFBLG1CQUFBLE9BQUEsS0FBQSxPQUFBLFFBQUEsU0FBQSxJQUFBLENBQUEsSUFBQSxNQUFBLENBQUEsSUFBQSxNQUFBLFVBQUEsTUFBQSxPQUFBLGtCQUFBLE9BQUEsYUFBQSxHQUFBLE9BQUEsTUFBQSxDQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsRUFBQSxPQUFBLE9BQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLEVBQUEsT0FBQSxNQUFBLElBQUEsQ0FBQSxJQUFBLE1BQUEsRUFBQSxFQUFBLEVBQUEsT0FBQSxNQUFBLEVBQUEsT0FBQSxVQUFBLEtBQUEsUUFBQSxNQUFBLEVBQUEsRUFBQSxPQUFBLE9BQUEsR0FBQSxPQUFBLFVBQUEsS0FBQSxNQUFBLElBQUEsTUFBQSxFQUFBLEVBQUEsT0FBQSxPQUFBLEdBQUEsT0FBQSxVQUFBLEtBQUEsTUFBQSxHQUFBLE1BQUEsRUFBQSxFQUFBLE9BQUEsT0FBQSxJQUFBLEVBQUEsSUFBQSxhQUFBLE9BQUEsVUFBQSxFQUFBLEdBQUEsSUFBQSxTQUFBLElBQUEsU0FBQSxPQUFBLGFBQUEsU0FBQSxTQUFBLE9BQUEsT0FBQSxJQUFBLGFBQUEsT0FBQSxVQUFBLEVBQUEsR0FBQSxJQUFBLElBQUEsT0FBQSxRQUFBLE9BQUEsYUFBQSxNQUFBLEtBQUEsT0FBQSxTQUFBLElBQUEsR0FBQSxFQUFBLEVBQUEsRUFBQSxLQUFBLE9BQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLEVBQUEsS0FBQSxHQUFBLE9BQUEsSUFBQSxLQUFBLE9BQUEsYUFBQSxLQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsQ0FBQSxJQUFBLE1BQUEsVUFBQSxLQUFBLElBQUEsTUFBQSxPQUFBLFFBQUEsSUFBQSxNQUFBLE9BQUEsWUFBQSxNQUFBLE9BQUEsU0FBQSxTQUFBLEVBQUEsRUFBQSxDQUFBLEdBQUEsT0FBQSxNQUFBLEVBQUEsS0FBQSxjQUFBLEdBQUEsT0FBQSxPQUFBLEVBQUEsS0FBQSxjQUFBLE9BQUEsTUFBQSxFQUFBLEVBQUEsRUFBQSxPQUFBLE1BQUEsRUFBQSxFQUFBLENBQUEsR0FBQSxPQUFBLFVBQUEsS0FBQSxPQUFBLEdBQUEsT0FBQSxVQUFBLEtBQUEsTUFBQSxHQUFBLEdBQUEsT0FBQSxVQUFBLEtBQUEsTUFBQSxJQUFBLElBQUEsR0FBQSxPQUFBLFNBQUEsU0FBQSxHQUFBLENBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxNQUFBLE9BQUEsTUFBQSxPQUFBLFFBQUEsRUFBQSxFQUFBLEVBQUEsT0FBQSxPQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxFQUFBLE9BQUEsTUFBQSxJQUFBLENBQUEsSUFBQSxLQUFBLE9BQUEsU0FBQSxFQUFBLEdBQUEsSUFBQSxFQUFBLEVBQUEsT0FBQSxPQUFBLElBQUEsS0FBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLE9BQUEsS0FBQSxPQUFBLDJCQUFBLFNBQUEsTUFBQSxDQUFBLElBQUEsSUFBQSxZQUFBLEVBQUEsVUFBQSxLQUFBLE1BQUEsT0FBQSxNQUFBLGFBQUEsV0FBQSxLQUFBLE1BQUEsT0FBQSxPQUFBLGFBQUEsT0FBQSxJQUFBLE1BQUEsYUFBQSxFQUFBLEVBQUEsWUFBQSxFQUFBLElBQUEsQ0FBQSxPQUFBLEdBQUEsSUFBQSxNQUFBLGFBQUEsSUFBQSxJQUFBLEdBQUEsRUFBQSxZQUFBLEdBQUEsS0FBQSxPQUFBLEdBQUEsSUFBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLElBQUEsSUFBQSxHQUFBLEVBQUEsWUFBQSxHQUFBLEtBQUEsSUFBQSxJQUFBLEdBQUEsRUFBQSxZQUFBLEdBQUEsS0FBQSxDQUFBLE9BQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxFQUFBLFdBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxHQUFBLEVBQUEsVUFBQSxHQUFBLEtBQUEsQ0FBQSxJQUFBLE9BQUEsTUFBQSxVQUFBLEdBQUEsR0FBQSxDQUFBLFdBQUEsR0FBQSxJQUFBLE9BQUEsT0FBQSxPQUFBLE9BQUEsSUFBQSxJQUFBLEtBQUEsT0FBQSxJQUFBLElBQUEsR0FBQSxRQUFBLE9BQUEsT0FBQSxJQUFBLElBQUEsS0FBQSxPQUFBLElBQUEsSUFBQSxHQUFBLFNBQUEsSUFBQSxJQUFBLE9BQUEsSUFBQSxNQUFBLGFBQUEsR0FBQSxFQUFBLFlBQUEsR0FBQSxLQUFBLE9BQUEsSUFBQSxJQUFBLE1BQUEsYUFBQSxJQUFBLElBQUEsR0FBQSxFQUFBLFlBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxHQUFBLEVBQUEsWUFBQSxHQUFBLEtBQUEsT0FBQSxJQUFBLElBQUEsS0FBQSxNQUFBLENBQUEsT0FBQSxJQUFBLElBQUEsR0FBQSxPQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsT0FBQSxRQUFBLE9BQUEsa0JBQUEsU0FBQSxVQUFBLENBQUEsSUFBQSxJQUFBLE9BQUEsT0FBQSwyQkFBQSxXQUFBLFlBQUEsT0FBQSxPQUFBLFVBQUEsS0FBQSxNQUFBLE9BQUEsTUFBQSxhQUFBLFdBQUEsS0FBQSxNQUFBLE9BQUEsT0FBQSxhQUFBLE9BQUEsSUFBQSxNQUFBLE9BQUEsT0FBQSxPQUFBLE9BQUEsR0FBQSxFQUFBLFlBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxHQUFBLEVBQUEsWUFBQSxHQUFBLEtBQUEsSUFBQSxJQUFBLEdBQUEsRUFBQSxXQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsR0FBQSxFQUFBLFVBQUEsR0FBQSxLQUFBLE9BQUEsVUFBQSxHQUFBLEdBQUEsQ0FBQSxXQUFBLEdBQUEsSUFBQSxPQUFBLE9BQUEsVUFBQSxVQUFBLEdBQUEsR0FBQSxDQUFBLFdBQUEsR0FBQSxJQUFBLE9BQUEsT0FBQSxPQUFBLElBQUEsSUFBQSxDQUFBLEVBQUEsQ0FBQTtJQUNBLE9BQUEsUUFBQSxPQUFBLFVBQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsTUFBQSxPQUFBLE1BQUEsT0FBQSxRQUFBLEVBQUEsRUFBQSxFQUFBLE9BQUEsT0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsRUFBQSxPQUFBLE1BQUEsSUFBQSxDQUFBLElBQUEsS0FBQSxPQUFBLFNBQUEsRUFBQSxHQUFBLElBQUEsRUFBQSxFQUFBLE9BQUEsT0FBQSxLQUFBLE9BQUEsS0FBQSxNQUFBLFVBQUEsT0FBQSxTQUFBLEtBQUEsR0FBQSxDQUFBLElBQUEsS0FBQSxLQUFBLE1BQUEsQ0FBQSxJQUFBLE1BQUEsR0FBQSxLQUFBLFFBQUEsT0FBQSxLQUFBLE9BQUEsRUFBQSxLQUFBLEtBQUEsT0FBQSxLQUFBLEtBQUEsS0FBQSxLQUFBLE1BQUEsS0FBQSxPQUFBLElBQUEsU0FBQSxFQUFBLFlBQUEsR0FBQSxtQkFBQSxFQUFBLGNBQUEsRUFBQSxPQUFBLGtCQUFBLFNBQUEsU0FBQSxDQUFBLFNBQUEsU0FBQSxTQUFBLFNBQUEsQ0FBQSxPQUFBLE1BQUEsU0FBQSxFQUFBLFNBQUEsRUFBQSxNQUFBLFNBQUEsRUFBQSxTQUFBLEVBQUEsS0FBQSxLQUFBLE1BQUEsTUFBQSxNQUFBLE9BQUEsU0FBQSxjQUFBLE9BQUEsT0FBQSxPQUFBLENBQUEsSUFBQSxHQUFBLE9BQUEsRUFBQSxHQUFBLE9BQUEsRUFBQSxNQUFBLENBQUEsT0FBQSxFQUFBLEtBQUEsT0FBQSxFQUFBLElBQUEsQ0FBQSxPQUFBLEVBQUEsS0FBQSxPQUFBLEVBQUEsSUFBQSxJQUFBLE9BQUEsT0FBQSxPQUFBLGdCQUFBLFNBQUEsU0FBQSxHQUFBLFNBQUEsSUFBQSxlQUFBLFNBQUEsU0FBQSxHQUFBLFNBQUEsSUFBQSxnQkFBQSxTQUFBLFNBQUEsR0FBQSxTQUFBLElBQUEsR0FBQSxnQkFBQSxpQkFBQSxnQkFBQSxpQkFBQSxPQUFBLFNBQUEsR0FBQSxPQUFBLFNBQUEsR0FBQSxPQUFBLFNBQUEsSUFBQSxpQkFBQSxnQkFBQSxpQkFBQSxpQkFBQSxPQUFBLFNBQUEsR0FBQSxPQUFBLFNBQUEsR0FBQSxPQUFBLFNBQUEsS0FBQSxPQUFBLFNBQUEsR0FBQSxPQUFBLFNBQUEsR0FBQSxPQUFBLFNBQUEsSUFBQSxjQUFBLE9BQUEsT0FBQSxRQUFBLEVBQUEsQ0FBQSxJQUFBLEtBQUEsT0FBQSxPQUFBLE9BQUEsT0FBQSxLQUFBLFNBQUEsR0FBQSxPQUFBLFNBQUEsR0FBQSxPQUFBLFNBQUEsR0FBQTtBQ0ZBLFFBQUEsT0FBQTtHQUNBLFFBQUEsZUFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLE9BQUEsWUFBQSxRQUFBLFNBQUEsU0FBQTtNQUNBLElBQUEsY0FBQTs7TUFFQSxTQUFBLGFBQUEsTUFBQSxJQUFBLFVBQUE7O1FBRUEsR0FBQSxDQUFBLFdBQUEsQ0FBQSxRQUFBLE9BQUEsS0FBQSxPQUFBLEtBQUE7O1FBRUEsSUFBQSxHQUFBO1VBQ0EsR0FBQSxLQUFBOzs7O01BSUEsU0FBQSxhQUFBLE1BQUEsSUFBQSxVQUFBO1FBQ0EsR0FBQSxDQUFBLFdBQUEsQ0FBQSxPQUFBLEdBQUE7UUFDQSxJQUFBLElBQUE7VUFDQSxHQUFBOzs7O01BSUEsWUFBQSxvQkFBQSxTQUFBLE9BQUEsVUFBQSxXQUFBLFdBQUE7UUFDQSxPQUFBO1dBQ0EsS0FBQSxlQUFBO1lBQ0EsT0FBQTtZQUNBLFVBQUE7O1dBRUEsS0FBQTs7YUFFQTs7Ozs7TUFLQSxZQUFBLGlCQUFBLFNBQUEsT0FBQSxXQUFBLFVBQUE7UUFDQSxPQUFBO1dBQ0EsS0FBQSxlQUFBO1lBQ0EsT0FBQTs7V0FFQSxLQUFBOzthQUVBOzs7Ozs7O01BT0EsWUFBQSxTQUFBLFNBQUEsVUFBQTs7UUFFQSxRQUFBLFFBQUE7UUFDQSxPQUFBLEdBQUE7OztNQUdBLFlBQUEsV0FBQSxTQUFBLE9BQUEsVUFBQSxXQUFBLFdBQUEsV0FBQTtRQUNBLE9BQUE7V0FDQSxLQUFBLGtCQUFBO1lBQ0EsT0FBQTtZQUNBLFVBQUE7WUFDQSxXQUFBOztXQUVBLEtBQUE7O2FBRUE7Ozs7O01BS0EsWUFBQSxTQUFBLFNBQUEsT0FBQSxXQUFBLFdBQUE7UUFDQSxPQUFBO1dBQ0EsSUFBQSxrQkFBQTtXQUNBLEtBQUE7Ozs7O2FBS0E7Ozs7Ozs7TUFPQSxZQUFBLDBCQUFBLFNBQUEsV0FBQSxVQUFBO1FBQ0EsT0FBQTtXQUNBLEtBQUEsdUJBQUE7WUFDQSxJQUFBLFFBQUE7Ozs7TUFJQSxZQUFBLGlCQUFBLFNBQUEsTUFBQTtRQUNBLE9BQUE7V0FDQSxLQUFBLGVBQUE7WUFDQSxPQUFBOzs7O01BSUEsWUFBQSxnQkFBQSxTQUFBLE9BQUEsTUFBQSxXQUFBLFVBQUE7UUFDQSxPQUFBO1dBQ0EsS0FBQSx3QkFBQTtZQUNBLE9BQUE7WUFDQSxVQUFBOztXQUVBLEtBQUEsV0FBQTs7O01BR0EsT0FBQTs7OztBQy9HQSxRQUFBLE9BQUEsT0FBQSxRQUFBLG9CQUFBO0lBQ0E7SUFDQSxTQUFBLE9BQUE7TUFDQSxJQUFBLGFBQUE7TUFDQSxJQUFBLE9BQUEsYUFBQTs7TUFFQSxPQUFBOzs7OztRQUtBLFFBQUEsU0FBQSxPQUFBO1lBQ0EsT0FBQSxNQUFBLEtBQUEsYUFBQSxXQUFBO2NBQ0EsT0FBQTs7Ozs7UUFLQSxRQUFBLFNBQUEsSUFBQSxPQUFBO1lBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBLFdBQUE7Y0FDQSxPQUFBOzs7OztRQUtBLFFBQUEsU0FBQSxJQUFBO1lBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7UUFHQSxLQUFBLFNBQUEsSUFBQTtZQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUE7OztRQUdBLFFBQUEsV0FBQTtZQUNBLE9BQUEsTUFBQSxJQUFBOzs7UUFHQSxXQUFBLFNBQUEsSUFBQTtVQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsS0FBQTs7Ozs7Ozs7QUN0Q0EsUUFBQSxPQUFBLE9BQUEsUUFBQSxvQkFBQTtJQUNBO0lBQ0EsU0FBQSxPQUFBO01BQ0EsSUFBQSxZQUFBO01BQ0EsSUFBQSxPQUFBLFlBQUE7O01BRUEsT0FBQTs7Ozs7UUFLQSxZQUFBLFNBQUEsVUFBQTtZQUNBLE9BQUEsTUFBQSxLQUFBLFlBQUEsZUFBQTtjQUNBLFVBQUE7Ozs7UUFJQSxRQUFBLFdBQUE7WUFDQSxPQUFBLE1BQUEsSUFBQTs7O1FBR0Esa0JBQUEsU0FBQSxTQUFBLFNBQUE7VUFDQSxPQUFBLE1BQUEsS0FBQSxZQUFBLGVBQUE7WUFDQSxVQUFBO1lBQ0EsVUFBQTs7Ozs7Ozs7QUN4QkEsUUFBQSxPQUFBO0dBQ0EsUUFBQSxtQkFBQTtFQUNBO0VBQ0EsU0FBQSxNQUFBOztJQUVBLElBQUEsT0FBQTs7SUFFQSxPQUFBO01BQ0EsbUJBQUEsVUFBQTtRQUNBLE9BQUEsTUFBQSxJQUFBOztNQUVBLHlCQUFBLFNBQUEsTUFBQSxNQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQSxTQUFBO1VBQ0EsVUFBQTtVQUNBLFdBQUE7OztNQUdBLHdCQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsY0FBQTtVQUNBLE1BQUE7OztNQUdBLGlCQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsYUFBQTtVQUNBLE1BQUE7OztNQUdBLHNCQUFBLFVBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBOztNQUVBLHlCQUFBLFNBQUEsT0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsYUFBQTtVQUNBLFFBQUE7OztNQUdBLG9CQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsWUFBQTtVQUNBLE1BQUE7OztNQUdBLHNCQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsY0FBQTtVQUNBLE1BQUE7Ozs7TUFJQSxrQkFBQSxTQUFBLFdBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBLGNBQUE7VUFDQSxZQUFBOzs7O01BSUEsd0JBQUEsU0FBQSxLQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQSxnQkFBQTtVQUNBLE1BQUE7OztNQUdBLG1CQUFBLFNBQUEsWUFBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsVUFBQTtVQUNBLGFBQUE7Ozs7Ozs7O0FDM0RBLFFBQUEsT0FBQSxPQUFBLFFBQUEsb0JBQUE7SUFDQTtJQUNBLFNBQUEsT0FBQTtNQUNBLElBQUEsTUFBQTtNQUNBLElBQUEsT0FBQSxNQUFBOzs7TUFHQSxPQUFBOzs7OztRQUtBLE9BQUEsU0FBQSxXQUFBLE1BQUEsUUFBQSxXQUFBLFdBQUE7WUFDQSxPQUFBLE1BQUEsS0FBQSxNQUFBLFVBQUE7Z0JBQ0EsV0FBQTtnQkFDQSxPQUFBO2dCQUNBLFNBQUE7O2FBRUEsS0FBQTs7ZUFFQTs7Ozs7UUFLQSxRQUFBLFdBQUE7WUFDQSxPQUFBLE1BQUEsSUFBQTs7Ozs7OztBQzFCQSxRQUFBLE9BQUEsT0FBQSxRQUFBLGVBQUE7SUFDQTtJQUNBLFNBQUEsT0FBQTtNQUNBLElBQUEsUUFBQTtNQUNBLElBQUEsT0FBQSxRQUFBOztNQUVBLE9BQUE7Ozs7O1FBS0EsUUFBQSxTQUFBLFVBQUE7WUFDQSxPQUFBLE1BQUEsS0FBQSxRQUFBLFdBQUE7Y0FDQSxVQUFBOzs7O1FBSUEsUUFBQSxXQUFBO1VBQ0EsT0FBQSxNQUFBLElBQUE7OztRQUdBLFFBQUEsU0FBQSxJQUFBLE9BQUE7VUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUEsV0FBQTtZQUNBLE9BQUE7Ozs7UUFJQSxNQUFBLFNBQUEsSUFBQSxTQUFBO1VBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBLGlCQUFBO1lBQ0EsZ0JBQUE7Ozs7UUFJQSxZQUFBLFNBQUEsSUFBQSxPQUFBLE1BQUE7VUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBO1dBQ0EsS0FBQTs7Ozs7Ozs7Ozs7OztRQWFBLGNBQUEsU0FBQSxJQUFBLFFBQUEsYUFBQTtVQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUE7V0FDQSxLQUFBOzs7Ozs7Ozs7Ozs7O1FBYUEsY0FBQSxTQUFBLElBQUEsT0FBQSxRQUFBO1VBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQTtXQUNBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQXFCQSxRQUFBLFNBQUEsSUFBQTtZQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQTs7O1FBR0EsS0FBQSxTQUFBLElBQUE7VUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBOzs7UUFHQSxpQkFBQSxTQUFBLElBQUEsUUFBQTtVQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQSxvQkFBQTtZQUNBLFFBQUE7Ozs7UUFJQSxnQkFBQSxTQUFBLElBQUEsUUFBQTtVQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQSxtQkFBQTtZQUNBLFFBQUE7Ozs7UUFJQSxrQkFBQSxTQUFBLEtBQUEsZUFBQTtVQUNBLE9BQUEsTUFBQSxLQUFBLFFBQUEsTUFBQSxFQUFBLE1BQUE7Z0JBQ0EsTUFBQTtnQkFDQSxRQUFBO2dCQUNBLGVBQUEsZ0JBQUEsZ0JBQUE7Ozs7Ozs7Ozs7O0FDOUdBLFFBQUEsT0FBQSxPQUFBLFFBQUEsZUFBQTtFQUNBO0VBQ0E7RUFDQSxTQUFBLE9BQUEsU0FBQTtJQUNBLElBQUEsUUFBQTtJQUNBLElBQUEsT0FBQSxRQUFBOztJQUVBLE9BQUE7Ozs7TUFJQSxnQkFBQSxXQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQSxRQUFBOzs7TUFHQSxLQUFBLFNBQUEsSUFBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUE7OztNQUdBLFFBQUEsV0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBOzs7TUFHQSxTQUFBLFNBQUEsTUFBQSxNQUFBLEtBQUEsY0FBQSxrQkFBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLFFBQUEsTUFBQSxFQUFBLE1BQUE7Y0FDQSxNQUFBO2NBQ0EsTUFBQSxPQUFBLE9BQUE7Y0FDQSxNQUFBLE9BQUEsT0FBQTtjQUNBLGVBQUEsZ0JBQUEsZ0JBQUE7Y0FDQSxrQkFBQSxtQkFBQSxtQkFBQTs7Ozs7O01BTUEsZUFBQSxTQUFBLElBQUEsU0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsS0FBQSxZQUFBO1VBQ0EsU0FBQTs7OztNQUlBLG9CQUFBLFNBQUEsSUFBQSxjQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQSxLQUFBLFlBQUE7VUFDQSxjQUFBOzs7O01BSUEsV0FBQSxTQUFBLElBQUEsTUFBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsS0FBQSxjQUFBO1VBQ0EsTUFBQTs7OztNQUlBLGtCQUFBLFNBQUEsSUFBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQTs7Ozs7OztNQU9BLFVBQUEsV0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUE7OztNQUdBLGNBQUEsV0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUE7OztNQUdBLFdBQUEsU0FBQSxJQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOztNQUVBLFlBQUEsU0FBQSxJQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOztNQUVBLGdCQUFBLFNBQUEsSUFBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQTs7O01BR0EsZ0JBQUEsU0FBQSxJQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7TUFHQSxlQUFBLFNBQUEsS0FBQSxPQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBLGlCQUFBLEtBQUEsVUFBQTs7O01BR0EsU0FBQSxTQUFBLElBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUE7OztNQUdBLFVBQUEsU0FBQSxJQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7TUFHQSxZQUFBLFNBQUEsSUFBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQTs7O01BR0EsV0FBQSxTQUFBLElBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUE7OztNQUdBLGFBQUEsU0FBQSxJQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7TUFHQSxZQUFBLFdBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBOzs7TUFHQSxtQkFBQSxXQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQTs7O01BR0EsdUJBQUEsV0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUE7OztNQUdBLGdCQUFBLFdBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBOzs7TUFHQSx1QkFBQSxXQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQTs7O01BR0EsUUFBQSxTQUFBLElBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUE7OztNQUdBLGtCQUFBLFdBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBOzs7TUFHQSxrQkFBQSxXQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQTs7O01BR0Esc0JBQUEsV0FBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUE7OztNQUdBLGlCQUFBLFNBQUEsSUFBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQTs7O01BR0Esd0JBQUEsU0FBQSxPQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxrQkFBQSxFQUFBLE9BQUE7Ozs7Ozs7OztBQ3BKQSxRQUFBLE9BQUE7R0FDQSxXQUFBLHFCQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFFBQUEsT0FBQSxXQUFBLGlCQUFBO01BQ0EsT0FBQSxvQkFBQSxVQUFBOztNQUVBLGlCQUFBLFVBQUEsVUFBQSxLQUFBLEtBQUEsS0FBQTs7OztNQUlBLE9BQUEsaUJBQUEsWUFBQSxFQUFBLE9BQUEsZUFBQSxDQUFBLE9BQUE7OztNQUdBLE9BQUEsa0JBQUEsVUFBQTtRQUNBO1dBQ0EsT0FBQSxPQUFBLGtCQUFBLEtBQUEsT0FBQTtXQUNBLEtBQUE7OzthQUdBOzs7Ozs7O0FDdEJBLFFBQUEsT0FBQSxPQUFBLFdBQUEsdUJBQUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFNBQUEsUUFBQSxRQUFBLGNBQUEsa0JBQUE7O0lBRUEsT0FBQSxhQUFBOzs7Ozs7SUFNQSxFQUFBLGNBQUE7OztJQUdBLFNBQUEsY0FBQTtNQUNBLGlCQUFBLFNBQUEsS0FBQTs7Ozs7SUFLQTs7SUFFQSxPQUFBLGNBQUEsU0FBQSxRQUFBLFdBQUE7O01BRUEsT0FBQTtNQUNBLE9BQUEsR0FBQSx1QkFBQTtRQUNBLElBQUEsVUFBQTs7OztJQUlBLE9BQUEsa0JBQUEsV0FBQTs7TUFFQSxLQUFBLDhCQUFBO1FBQ0EsU0FBQSxDQUFBLFFBQUEsQ0FBQSxNQUFBLFNBQUEsT0FBQSxLQUFBLFNBQUEsT0FBQSxLQUFBLENBQUEsTUFBQSxhQUFBLE9BQUEsS0FBQSxTQUFBO1FBQ0EsU0FBQSxDQUFBLFNBQUEsU0FBQSxZQUFBLENBQUEsYUFBQSxvQ0FBQSxNQUFBOztPQUVBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUF3Q0EsT0FBQSxrQkFBQSxTQUFBLFFBQUEsV0FBQSxPQUFBO01BQ0EsT0FBQTtNQUNBLEtBQUE7UUFDQSxTQUFBO1VBQ0EsUUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7VUFFQSxRQUFBO1lBQ0EsV0FBQTtZQUNBLFlBQUE7WUFDQSxNQUFBO1lBQ0EsT0FBQTtZQUNBLFNBQUE7OztRQUdBLFlBQUE7UUFDQSxNQUFBO1FBQ0EsTUFBQSw2QkFBQSxVQUFBLFFBQUE7UUFDQSxPQUFBO1NBQ0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbkdBLFFBQUEsT0FBQSxPQUFBLFdBQUEsaUJBQUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFNBQUEsUUFBQSxRQUFBLGNBQUEsYUFBQTtJQUNBLE9BQUEsUUFBQTtJQUNBLE9BQUEsUUFBQTs7Ozs7O0lBTUEsRUFBQSxjQUFBOzs7OztJQUtBLFlBQUEsUUFBQSxhQUFBLE1BQUEsYUFBQSxNQUFBLGFBQUEsT0FBQSxPQUFBO0tBQ0EsS0FBQTs7OztJQUlBLE9BQUEsWUFBQSxXQUFBO01BQ0EsSUFBQSxnQkFBQSxPQUFBLE1BQUE7UUFDQTs7O01BR0EsSUFBQSxPQUFBLGNBQUEsa0JBQUE7UUFDQSxnQkFBQSxjQUFBO1VBQ0E7OztNQUdBLElBQUEsT0FBQSxjQUFBLFVBQUE7UUFDQSxnQkFBQSxjQUFBO1VBQ0E7OztNQUdBLElBQUEsT0FBQSxjQUFBLFdBQUE7UUFDQSxnQkFBQSxjQUFBO1VBQ0E7OztNQUdBLElBQUEsT0FBQSxjQUFBLFVBQUE7UUFDQSxnQkFBQSxjQUFBO1VBQ0E7OztNQUdBLElBQUEsT0FBQSxjQUFBLFdBQUE7UUFDQSxnQkFBQSxjQUFBO1VBQ0E7OztNQUdBLElBQUEsVUFBQSxFQUFBLE1BQUEsS0FBQTs7TUFFQSxLQUFBO1FBQ0EsT0FBQTtRQUNBLE1BQUE7OztRQUdBLE1BQUE7UUFDQSxTQUFBLENBQUEsVUFBQTtRQUNBLFlBQUE7U0FDQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDL0RBLFFBQUEsT0FBQSxPQUFBLFdBQUEsc0JBQUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFNBQUEsUUFBQSxRQUFBLGNBQUEsa0JBQUE7Ozs7OztJQU1BLEVBQUEsY0FBQTs7Ozs7O0lBTUEsT0FBQSxjQUFBLFVBQUE7O01BRUEsSUFBQSxPQUFBLFFBQUEsT0FBQSxNQUFBO1FBQ0EsS0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUEsQ0FBQSxVQUFBO1VBQ0EsWUFBQTtXQUNBLEtBQUE7Ozs7Ozs7Ozs7Ozs7OztXQWVBO1FBQ0EsS0FBQSxVQUFBLDRCQUFBOzs7Ozs7Ozs7QUMxQ0EsUUFBQSxPQUFBO0dBQ0EsV0FBQSxxQkFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsUUFBQSxNQUFBLGdCQUFBOztNQUVBLE9BQUEsV0FBQTtNQUNBO1NBQ0E7U0FDQSxLQUFBOzs7O01BSUEsU0FBQSxlQUFBLFNBQUE7UUFDQSxPQUFBLFVBQUE7O1FBRUEsU0FBQSxXQUFBLElBQUEsS0FBQSxTQUFBO1FBQ0EsU0FBQSxZQUFBLElBQUEsS0FBQSxTQUFBO1FBQ0EsU0FBQSxjQUFBLElBQUEsS0FBQSxTQUFBO1FBQ0EsU0FBQSxZQUFBLElBQUEsS0FBQSxTQUFBOztRQUVBLE9BQUEsV0FBQTs7Ozs7TUFLQSxPQUFBLG9CQUFBLFlBQUE7UUFDQTtXQUNBLGtCQUFBLE9BQUEsU0FBQTtXQUNBLEtBQUE7Ozs7Ozs7Ozs7O01BV0E7U0FDQTtTQUNBLEtBQUE7Ozs7UUFJQSxPQUFBLGtCQUFBLFVBQUE7VUFDQTthQUNBLHdCQUFBLE9BQUEsVUFBQSxRQUFBLE1BQUEsSUFBQSxNQUFBO2FBQ0EsS0FBQTs7Ozs7Ozs7TUFRQSxPQUFBLGFBQUEsU0FBQSxLQUFBO1FBQ0EsSUFBQSxDQUFBLEtBQUE7VUFDQSxPQUFBOzs7O1FBSUEsT0FBQSxPQUFBLE1BQUEsT0FBQTtVQUNBLE1BQUEsS0FBQSxlQUFBLE1BQUEsS0FBQTs7OztNQUlBLFNBQUEsVUFBQSxLQUFBO1FBQ0EsT0FBQSxJQUFBO1VBQ0EsS0FBQTtVQUNBLEtBQUE7VUFDQSxLQUFBO1VBQ0EsS0FBQTtVQUNBLEtBQUE7Ozs7TUFJQSxPQUFBLDBCQUFBLFVBQUE7O1FBRUEsSUFBQSxPQUFBLFVBQUEsT0FBQSxTQUFBLFVBQUE7UUFDQSxJQUFBLFFBQUEsVUFBQSxPQUFBLFNBQUEsV0FBQTs7UUFFQSxJQUFBLE9BQUEsS0FBQSxRQUFBLEtBQUEsU0FBQSxhQUFBLFVBQUEsVUFBQTtVQUNBLE9BQUEsS0FBQSxXQUFBLGtDQUFBOztRQUVBLElBQUEsUUFBQSxNQUFBO1VBQ0EsS0FBQSxXQUFBLDZDQUFBO1VBQ0E7OztRQUdBO1dBQ0Esd0JBQUEsTUFBQTtXQUNBLEtBQUE7Ozs7Ozs7O01BUUEsT0FBQSx5QkFBQSxVQUFBO1FBQ0EsSUFBQSxZQUFBLFVBQUEsT0FBQSxTQUFBLGFBQUE7O1FBRUE7V0FDQSx1QkFBQTtXQUNBLEtBQUE7Ozs7Ozs7O01BUUEsT0FBQSxrQkFBQSxVQUFBO1FBQ0EsSUFBQSxVQUFBLFVBQUEsT0FBQSxTQUFBLFdBQUE7O1FBRUE7V0FDQSxnQkFBQTtXQUNBLEtBQUE7Ozs7Ozs7OztNQVNBLElBQUEsWUFBQSxJQUFBLFNBQUE7O01BRUEsT0FBQSxrQkFBQSxTQUFBLEtBQUE7UUFDQSxPQUFBLEtBQUEsWUFBQSxVQUFBLFNBQUE7OztNQUdBLE9BQUEscUJBQUEsVUFBQTtRQUNBLElBQUEsT0FBQSxPQUFBLFNBQUE7UUFDQTtXQUNBLG1CQUFBO1dBQ0EsS0FBQTs7Ozs7O01BTUEsT0FBQSxtQkFBQSxVQUFBO1FBQ0EsSUFBQSxhQUFBLE9BQUEsU0FBQTtRQUNBO1dBQ0EsaUJBQUE7V0FDQSxLQUFBOzs7Ozs7O01BT0EsT0FBQSx1QkFBQSxVQUFBO1FBQ0EsSUFBQSxPQUFBLE9BQUEsU0FBQTtRQUNBO1dBQ0EscUJBQUE7V0FDQSxLQUFBOzs7Ozs7TUFNQSxPQUFBLHlCQUFBLFVBQUE7UUFDQSxJQUFBLE9BQUEsT0FBQSxTQUFBO1FBQ0E7V0FDQSx1QkFBQTtXQUNBLEtBQUE7Ozs7Ozs7Ozs7QUN4S0EsUUFBQSxPQUFBO0NBQ0EsV0FBQSxpQkFBQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFVBQUEsUUFBQSxRQUFBLFVBQUEsYUFBQSxVQUFBLE9BQUEsYUFBQSxhQUFBLE1BQUE7O0lBRUEsSUFBQSxXQUFBLFNBQUE7O0lBRUEsT0FBQSxZQUFBLE1BQUEsVUFBQTs7SUFFQSxPQUFBLE9BQUEsWUFBQTs7SUFFQSxTQUFBLGFBQUEsT0FBQSxRQUFBO01BQ0EsSUFBQSxPQUFBO01BQ0EsTUFBQSxRQUFBOzs7OztNQUtBLE9BQUE7OztJQUdBLFNBQUEsYUFBQSxVQUFBO01BQ0EsWUFBQSxJQUFBLFVBQUEsS0FBQTs7Ozs7TUFLQSxRQUFBLElBQUE7TUFDQSxFQUFBLG9CQUFBLE1BQUE7OztJQUdBLFNBQUEsaUJBQUEsTUFBQTtNQUNBLE9BQUE7UUFDQTtVQUNBLE1BQUE7VUFDQSxRQUFBO1lBQ0E7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLFFBQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLFFBQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLFFBQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLFFBQUE7Ozs7Ozs7SUFPQSxTQUFBLFdBQUEsTUFBQTtNQUNBLElBQUEsTUFBQTtRQUNBLE9BQUEsT0FBQSxNQUFBLE9BQUE7Ozs7SUFJQSxPQUFBLGVBQUE7OztJQUdBLE9BQUEsV0FBQSxVQUFBLE1BQUE7TUFDQSxJQUFBLE9BQUE7TUFDQSxLQUFBLGFBQUEsUUFBQTs7O01BR0EsT0FBQTs7O0lBR0EsWUFBQSxTQUFBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQW9DQSxPQUFBLGFBQUEsWUFBQTs7TUFFQSxXQUFBO1FBQ0EsYUFBQSxPQUFBO1FBQ0EsU0FBQSxDQUFBLEVBQUEsSUFBQSxZQUFBLEtBQUEsS0FBQSxNQUFBLFlBQUEsS0FBQSxRQUFBLE1BQUEsT0FBQSxPQUFBO1FBQ0EsUUFBQSxFQUFBLE1BQUEsT0FBQSxXQUFBLFFBQUEsT0FBQSxhQUFBLFVBQUEsT0FBQSxlQUFBLE1BQUEsT0FBQTtRQUNBLFdBQUE7O01BRUEsUUFBQSxJQUFBO01BQ0EsUUFBQSxJQUFBLE9BQUE7O01BRUEsWUFBQSxPQUFBO01BQ0EsT0FBQTs7OztJQUlBLE9BQUEsaUJBQUEsWUFBQTtNQUNBLE9BQUEsa0JBQUE7TUFDQSxPQUFBLFlBQUE7TUFDQSxPQUFBLGNBQUE7TUFDQSxPQUFBLGdCQUFBO01BQ0EsT0FBQSxZQUFBO01BQ0EsT0FBQSxxQkFBQTs7OztJQUlBLE9BQUEsZUFBQSxVQUFBO01BQ0EsT0FBQSxtQkFBQTs7OztJQUlBLE9BQUEsZUFBQSxZQUFBOztNQUVBLFNBQUEsT0FBQTtNQUNBLGVBQUEsT0FBQTs7TUFFQSxTQUFBLENBQUEsR0FBQSxZQUFBLEtBQUEsS0FBQSxLQUFBLFlBQUEsS0FBQSxRQUFBLE1BQUEsTUFBQTtNQUNBLFlBQUEsS0FBQSxPQUFBO01BQ0E7UUFDQTtRQUNBO1FBQ0E7O01BRUEsT0FBQTs7OztJQUlBLE9BQUEsV0FBQSxVQUFBLE1BQUE7O01BRUEsSUFBQTtNQUNBLE1BQUEsU0FBQSxTQUFBLGNBQUE7TUFDQSxPQUFBLFlBQUE7OztNQUdBLElBQUEsU0FBQSxTQUFBLGNBQUE7TUFDQSxPQUFBLFdBQUE7TUFDQSxPQUFBLFlBQUE7TUFDQSxPQUFBLFFBQUE7TUFDQSxPQUFBLFlBQUE7OztNQUdBLElBQUEsS0FBQSxPQUFBLE1BQUE7UUFDQSxTQUFBLFNBQUEsY0FBQTtRQUNBLE9BQUEsWUFBQTtRQUNBLE9BQUEsUUFBQTtRQUNBLE9BQUEsWUFBQTs7TUFFQSxJQUFBLEtBQUEsT0FBQSxRQUFBO1FBQ0EsU0FBQSxTQUFBLGNBQUE7UUFDQSxPQUFBLFlBQUE7UUFDQSxPQUFBLFFBQUE7UUFDQSxPQUFBLFlBQUE7O01BRUEsSUFBQSxLQUFBLE9BQUEsVUFBQTtRQUNBLFNBQUEsU0FBQSxjQUFBO1FBQ0EsT0FBQSxZQUFBO1FBQ0EsT0FBQSxRQUFBO1FBQ0EsT0FBQSxZQUFBOztNQUVBLElBQUEsS0FBQSxPQUFBLE1BQUE7UUFDQSxTQUFBLFNBQUEsY0FBQTtRQUNBLE9BQUEsWUFBQTtRQUNBLE9BQUEsUUFBQTtRQUNBLE9BQUEsWUFBQTs7O01BR0EsT0FBQSxXQUFBLFNBQUEsY0FBQSxHQUFBO1FBQ0EsUUFBQSxFQUFBLE9BQUE7OztNQUdBLEtBQUE7UUFDQSxPQUFBOztRQUVBLFNBQUE7VUFDQSxTQUFBOztTQUVBLEtBQUEsWUFBQTs7UUFFQSxVQUFBLEVBQUEsSUFBQSxZQUFBLEtBQUEsS0FBQSxNQUFBLFlBQUEsS0FBQSxRQUFBLE1BQUEsT0FBQTtRQUNBLFlBQUEsS0FBQSxLQUFBLEtBQUE7UUFDQTtVQUNBO1VBQ0E7VUFDQTs7UUFFQSxPQUFBOzs7OztJQUtBLE9BQUEsZUFBQSxVQUFBLFFBQUEsUUFBQSxPQUFBOztNQUVBLEtBQUE7UUFDQSxPQUFBO1FBQ0EsTUFBQSw2QkFBQSxPQUFBLE9BQUE7UUFDQSxNQUFBO1FBQ0EsU0FBQTtVQUNBLFFBQUE7WUFDQSxNQUFBO1lBQ0EsT0FBQTtZQUNBLFNBQUE7O1VBRUEsU0FBQTtZQUNBLFdBQUE7WUFDQSxZQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOzs7U0FHQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUEyQkEsT0FBQSxlQUFBLFVBQUEsUUFBQSxRQUFBLE9BQUE7TUFDQSxLQUFBO1FBQ0EsT0FBQTtRQUNBLE1BQUEsNkJBQUEsT0FBQSxPQUFBO1FBQ0EsTUFBQTtRQUNBLFNBQUE7VUFDQSxRQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOztVQUVBLFNBQUE7WUFDQSxXQUFBO1lBQ0EsWUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7O1NBR0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7OztJQWdCQSxPQUFBLHVCQUFBLFVBQUEsUUFBQSxRQUFBLE9BQUE7TUFDQSxLQUFBO1FBQ0EsT0FBQTtRQUNBLE1BQUEsNkJBQUEsT0FBQSxPQUFBO1FBQ0EsTUFBQTtRQUNBLFNBQUE7VUFDQSxRQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOztVQUVBLFNBQUE7WUFDQSxXQUFBO1lBQ0EsWUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7O1NBR0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBMkJBLE9BQUEsYUFBQSxVQUFBLE1BQUE7TUFDQSxLQUFBO1FBQ0EsT0FBQTtRQUNBLE1BQUE7UUFDQSxNQUFBO1FBQ0EsU0FBQTtVQUNBLFFBQUE7WUFDQSxNQUFBO1lBQ0EsT0FBQTtZQUNBLFNBQUE7O1VBRUEsU0FBQTtZQUNBLFdBQUE7WUFDQSxZQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOzs7U0FHQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUE4QkEsT0FBQSxZQUFBLFVBQUEsTUFBQTtNQUNBLEtBQUE7UUFDQSxPQUFBO1FBQ0EsTUFBQTtRQUNBLE1BQUE7UUFDQSxTQUFBO1VBQ0EsUUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7VUFFQSxTQUFBO1lBQ0EsV0FBQTtZQUNBLFlBQUE7WUFDQSxNQUFBO1lBQ0EsT0FBQTtZQUNBLFNBQUE7OztTQUdBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBdUJBLE9BQUEsaUJBQUEsVUFBQSxNQUFBO01BQ0EsS0FBQTtRQUNBLE9BQUE7UUFDQSxNQUFBO1FBQ0EsTUFBQTtRQUNBLFNBQUE7VUFDQSxRQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOztVQUVBLFNBQUE7WUFDQSxXQUFBO1lBQ0EsWUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7O1NBR0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBd0JBLE9BQUEsa0JBQUEsVUFBQSxRQUFBLFFBQUE7TUFDQSxJQUFBLFVBQUEsTUFBQTtRQUNBLE9BQUE7YUFDQSxFQUFBLE9BQUE7O01BRUEsS0FBQTtRQUNBLE9BQUE7UUFDQSxNQUFBO1FBQ0EsTUFBQTtRQUNBLFNBQUE7VUFDQSxRQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOztVQUVBLFNBQUE7WUFDQSxXQUFBO1lBQ0EsWUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7O1NBR0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFpQkEsT0FBQSxpQkFBQSxVQUFBLFFBQUEsUUFBQTtNQUNBLElBQUEsVUFBQSxNQUFBO1FBQ0EsT0FBQTthQUNBLEVBQUEsT0FBQTs7TUFFQSxLQUFBO1FBQ0EsT0FBQTtRQUNBLE1BQUE7UUFDQSxNQUFBO1FBQ0EsU0FBQTtVQUNBLFFBQUE7WUFDQSxNQUFBO1lBQ0EsT0FBQTtZQUNBLFNBQUE7O1VBRUEsU0FBQTtZQUNBLFdBQUE7WUFDQSxZQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOzs7U0FHQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7SUFlQSxPQUFBLE9BQUEsYUFBQSxVQUFBLFdBQUE7TUFDQSxZQUFBLGlCQUFBLFdBQUEsT0FBQSxlQUFBO1FBQ0E7Ozs7OztJQU1BLE9BQUEsb0JBQUEsWUFBQTtNQUNBLFlBQUEsaUJBQUEsT0FBQSxXQUFBLE9BQUEsZUFBQTtRQUNBOzs7Ozs7Ozs7Ozs7QUNwa0JBLFFBQUEsT0FBQSxRQUFBLE9BQUEsQ0FBQSxtQkFBQSxVQUFBLGlCQUFBOztFQUVBLGdCQUFBLFdBQUE7SUFDQSxhQUFBLENBQUEsV0FBQSxXQUFBLFdBQUEsV0FBQSxXQUFBLFdBQUE7SUFDQSxZQUFBOzs7Q0FHQSxXQUFBLGlCQUFBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsUUFBQSxZQUFBOztNQUVBO1NBQ0E7U0FDQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUErR0E7U0FDQTtTQUNBLEtBQUE7Ozs7O01BS0EsT0FBQSxVQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsT0FBQSxNQUFBOzs7O01BSUEsTUFBQSxTQUFBLE9BQUEsU0FBQTtRQUNBO1VBQ0EsaUJBQUE7VUFDQSxzQkFBQTtVQUNBLDJCQUFBO1VBQ0EsYUFBQTtVQUNBLGtCQUFBO1VBQ0EsdUJBQUE7Ozs7O01BS0EsT0FBQSxtQkFBQSxVQUFBO1FBQ0EsS0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsTUFBQTtVQUNBLGtCQUFBO1VBQ0Esb0JBQUE7VUFDQSxtQkFBQTtVQUNBLGdCQUFBO2FBQ0EsVUFBQTtZQUNBO2VBQ0E7ZUFDQSxLQUFBLFVBQUE7Z0JBQ0EsV0FBQTs7Ozs7TUFLQSxPQUFBLG1CQUFBLFVBQUE7UUFDQSxLQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUE7VUFDQSxNQUFBO1VBQ0Esa0JBQUE7VUFDQSxvQkFBQTtVQUNBLG1CQUFBO1VBQ0EsZ0JBQUE7YUFDQSxVQUFBO1lBQ0E7ZUFDQTtlQUNBLEtBQUEsVUFBQTtnQkFDQSxXQUFBOzs7OztNQUtBLE9BQUEsdUJBQUEsVUFBQTtRQUNBO1dBQ0E7V0FDQSxRQUFBLFNBQUEsT0FBQTtZQUNBLEtBQUE7Y0FDQSxPQUFBO2NBQ0EsTUFBQTtjQUNBLE1BQUE7Y0FDQSxrQkFBQTtjQUNBLG9CQUFBO2NBQ0EsbUJBQUE7Y0FDQSxnQkFBQTtpQkFDQSxVQUFBOztnQkFFQTttQkFDQTttQkFDQSxLQUFBLFVBQUE7b0JBQ0EsV0FBQTs7Ozs7O01BTUEsT0FBQSxhQUFBLFdBQUE7UUFDQTtXQUNBO1dBQ0EsUUFBQSxTQUFBLE9BQUE7WUFDQSxLQUFBO2NBQ0EsT0FBQTtjQUNBLE1BQUE7Y0FDQSxNQUFBO2NBQ0Esa0JBQUE7Y0FDQSxvQkFBQTtjQUNBLG1CQUFBO2NBQ0EsZ0JBQUE7aUJBQ0EsVUFBQTs7Z0JBRUE7bUJBQ0E7bUJBQ0EsS0FBQSxVQUFBO29CQUNBLFdBQUE7Ozs7OztNQU1BLE9BQUEsaUJBQUEsV0FBQTtRQUNBO1dBQ0E7V0FDQSxRQUFBLFNBQUEsT0FBQTtZQUNBLEtBQUE7Y0FDQSxPQUFBO2NBQ0EsTUFBQTtjQUNBLE1BQUE7Y0FDQSxrQkFBQTtjQUNBLG9CQUFBO2NBQ0EsbUJBQUE7Y0FDQSxnQkFBQTtpQkFDQSxVQUFBOztnQkFFQTttQkFDQTttQkFDQSxLQUFBLFVBQUE7b0JBQ0EsV0FBQTs7Ozs7Ozs7Ozs7QUN4UEEsUUFBQSxPQUFBO0dBQ0EsV0FBQSxnQkFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBQSxRQUFBLE9BQUEsTUFBQSxZQUFBO01BQ0EsT0FBQSxlQUFBLEtBQUE7OztNQUdBOztNQUVBLFNBQUEsaUJBQUE7O1FBRUE7V0FDQSxJQUFBO1dBQ0EsS0FBQSxTQUFBLElBQUE7WUFDQSxJQUFBLFVBQUEsSUFBQTtZQUNBLElBQUEsUUFBQSxPQUFBLGFBQUEsTUFBQSxNQUFBLEtBQUE7O1lBRUEsSUFBQSxRQUFBLE9BQUE7Y0FDQSxPQUFBLGFBQUEsUUFBQSxTQUFBLFFBQUEsT0FBQTtjQUNBLE9BQUEsbUJBQUE7Ozs7Ozs7TUFPQSxPQUFBLGdCQUFBLFVBQUE7UUFDQTtXQUNBLGNBQUEsT0FBQSxhQUFBLEtBQUEsT0FBQSxhQUFBO1dBQ0EsS0FBQTs7O2FBR0E7Ozs7OztNQU1BLE9BQUEscUJBQUEsVUFBQTtRQUNBO1dBQ0EsbUJBQUEsT0FBQSxhQUFBLEtBQUEsT0FBQSxhQUFBO1dBQ0EsS0FBQTs7O2FBR0E7Ozs7OztNQU1BLE9BQUEsZ0JBQUEsVUFBQTs7UUFFQTtXQUNBLFVBQUEsT0FBQSxhQUFBLEtBQUEsT0FBQTtXQUNBLEtBQUE7OzthQUdBOzs7Ozs7Ozs7OztBQzVEQSxRQUFBLE9BQUEsT0FBQSxXQUFBLGtCQUFBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFNBQUEsUUFBQSxRQUFBLGNBQUEsYUFBQSxhQUFBO0lBQ0EsT0FBQSxRQUFBO0lBQ0EsT0FBQSxRQUFBOzs7Ozs7SUFNQSxFQUFBLGNBQUE7O0lBRUEsT0FBQSxlQUFBO0lBQ0EsT0FBQSxhQUFBLFdBQUEsaUJBQUE7TUFDQSxRQUFBO01BQ0EsY0FBQTtRQUNBLHFCQUFBOztNQUVBLFNBQUE7OztJQUdBLFNBQUEsV0FBQSxNQUFBO01BQ0EsT0FBQSxRQUFBLEtBQUE7TUFDQSxPQUFBLGNBQUEsS0FBQTtNQUNBLE9BQUEsV0FBQSxLQUFBOztNQUVBLElBQUEsSUFBQTtNQUNBLEtBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxLQUFBLFlBQUEsS0FBQTtRQUNBLEVBQUEsS0FBQTs7TUFFQSxPQUFBLFFBQUE7OztJQUdBLFlBQUEsUUFBQSxhQUFBLE1BQUEsYUFBQSxNQUFBLGFBQUEsT0FBQSxPQUFBO0tBQ0EsS0FBQTs7Ozs7SUFLQSxPQUFBLE9BQUEsYUFBQSxTQUFBLFdBQUE7TUFDQSxZQUFBLFFBQUEsYUFBQSxNQUFBLGFBQUEsTUFBQSxXQUFBLE9BQUEsZUFBQTtRQUNBOzs7Ozs7O0lBT0EsT0FBQSxvQkFBQSxZQUFBO01BQ0E7U0FDQSxRQUFBLGFBQUEsTUFBQSxhQUFBLE1BQUEsT0FBQSxXQUFBLE9BQUEsY0FBQSxPQUFBLGtCQUFBO1VBQ0E7Ozs7OztJQU1BLE9BQUEsV0FBQSxTQUFBLE1BQUE7TUFDQSxPQUFBLEdBQUEsbUJBQUE7UUFDQSxNQUFBO1FBQ0EsTUFBQSxhQUFBLFFBQUE7Ozs7SUFJQSxPQUFBLFNBQUEsU0FBQSxRQUFBLE1BQUE7TUFDQSxPQUFBOztNQUVBLE9BQUEsR0FBQSxrQkFBQTtRQUNBLElBQUEsS0FBQTs7Ozs7SUFLQSxPQUFBLGFBQUEsU0FBQSxRQUFBLE1BQUEsT0FBQTtNQUNBLE9BQUE7TUFDQSxLQUFBO1FBQ0EsU0FBQTtVQUNBLFFBQUE7WUFDQSxNQUFBO1lBQ0EsT0FBQTtZQUNBLFNBQUE7O1VBRUEsUUFBQTtZQUNBLFdBQUE7WUFDQSxZQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOzs7UUFHQSxZQUFBO1FBQ0EsTUFBQTtRQUNBLE1BQUEsNkJBQUEsS0FBQSxRQUFBLE9BQUE7UUFDQSxPQUFBO1NBQ0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBNkNBLE9BQUEsY0FBQSxTQUFBLFFBQUEsTUFBQSxPQUFBO01BQ0EsT0FBQTtNQUNBLEtBQUE7UUFDQSxTQUFBO1VBQ0EsUUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7VUFFQSxRQUFBO1lBQ0EsV0FBQTtZQUNBLFlBQUE7WUFDQSxNQUFBO1lBQ0EsT0FBQTtZQUNBLFNBQUE7OztRQUdBLFlBQUE7UUFDQSxNQUFBO1FBQ0EsTUFBQSw2QkFBQSxLQUFBLFFBQUEsT0FBQTtRQUNBLE9BQUE7U0FDQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQStDQSxPQUFBLGFBQUEsU0FBQSxRQUFBLE1BQUEsT0FBQTtNQUNBLE9BQUE7OztNQUdBLEtBQUE7UUFDQSxTQUFBO1VBQ0EsUUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7VUFFQSxRQUFBO1lBQ0EsV0FBQTtZQUNBLFlBQUE7WUFDQSxNQUFBO1lBQ0EsT0FBQTtZQUNBLFNBQUE7OztRQUdBLFlBQUE7UUFDQSxNQUFBO1FBQ0EsTUFBQSw2QkFBQSxLQUFBLFFBQUEsT0FBQTtRQUNBLE9BQUE7U0FDQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTRDQSxPQUFBLHVCQUFBLFdBQUE7TUFDQSxNQUFBLHFCQUFBLE9BQUEsTUFBQTtRQUNBOzs7TUFHQSxJQUFBLFVBQUEsRUFBQSxNQUFBLEtBQUE7O01BRUEsS0FBQTtRQUNBLE9BQUE7UUFDQSxNQUFBOzs7UUFHQSxNQUFBO1FBQ0EsU0FBQSxDQUFBLFVBQUE7UUFDQSxZQUFBO1NBQ0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXNCQSxPQUFBLHNCQUFBLFdBQUE7TUFDQSxNQUFBLHFCQUFBLE9BQUEsTUFBQTtRQUNBOzs7TUFHQSxJQUFBLFVBQUEsRUFBQSxNQUFBLEtBQUE7O01BRUEsS0FBQTtRQUNBLE9BQUE7UUFDQSxNQUFBOzs7UUFHQSxNQUFBO1FBQ0EsU0FBQSxDQUFBLFVBQUE7UUFDQSxZQUFBO1NBQ0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBcUJBLE9BQUEsY0FBQSxVQUFBO01BQ0EsSUFBQSxVQUFBLENBQUEsTUFBQSxVQUFBLFlBQUE7TUFDQSxJQUFBLE9BQUE7TUFDQSxZQUFBLFNBQUEsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUE0Q0EsT0FBQSxjQUFBLFNBQUEsUUFBQSxNQUFBLE9BQUE7TUFDQSxPQUFBOztNQUVBLElBQUEsQ0FBQSxLQUFBLE9BQUE7UUFDQSxLQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUEsd0JBQUEsS0FBQSxRQUFBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTtZQUNBLFFBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLFNBQUE7O1lBRUEsU0FBQTtjQUNBLE1BQUE7Y0FDQSxXQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOzs7V0FHQSxLQUFBOzs7Ozs7Ozs7OzthQVdBO1FBQ0EsWUFBQSxZQUFBLEtBQUEsS0FBQSxLQUFBOzs7Ozs7OztJQVFBLFNBQUEsV0FBQSxNQUFBO01BQ0EsSUFBQSxNQUFBO1FBQ0EsT0FBQSxPQUFBLE1BQUEsT0FBQTs7OztJQUlBLE9BQUEsV0FBQSxTQUFBLE1BQUE7TUFDQSxJQUFBLEtBQUEsT0FBQTtRQUNBLE9BQUE7O01BRUEsSUFBQSxLQUFBLE9BQUEsV0FBQTtRQUNBLE9BQUE7O01BRUEsSUFBQSxLQUFBLE9BQUEsWUFBQSxDQUFBLEtBQUEsT0FBQSxXQUFBO1FBQ0EsT0FBQTs7OztJQUlBLFNBQUEsV0FBQSxNQUFBO01BQ0EsT0FBQSxlQUFBO01BQ0EsT0FBQSxhQUFBLFdBQUEsaUJBQUE7TUFDQSxFQUFBLG9CQUFBLE1BQUE7OztJQUdBLFNBQUEsaUJBQUEsTUFBQTtNQUNBLE9BQUE7UUFDQTtVQUNBLE1BQUE7VUFDQSxRQUFBO1lBQ0E7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxXQUFBLEtBQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxXQUFBLEtBQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxXQUFBLEtBQUEsT0FBQSxjQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsV0FBQSxLQUFBLE9BQUEsZ0JBQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBOzs7O1FBSUE7VUFDQSxNQUFBO1VBQ0EsUUFBQTtZQUNBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQSxRQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQSxRQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQSxRQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQSxRQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQSxRQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQSxRQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQSxRQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQSxRQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQSxRQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQSxRQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQSxRQUFBOztZQUVBO2NBQ0EsS0FBQTtjQUNBLE9BQUEsS0FBQSxRQUFBOzs7O1FBSUE7VUFDQSxNQUFBO1VBQ0EsUUFBQTtZQUNBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQSxhQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQSxhQUFBO2NBQ0EsTUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsYUFBQTs7WUFFQTtjQUNBLEtBQUE7Y0FDQSxPQUFBLEtBQUEsYUFBQTs7OztRQUlBO1VBQ0EsTUFBQTtVQUNBLFFBQUE7WUFDQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsYUFBQTs7Ozs7OztJQU9BLFNBQUEsWUFBQTtNQUNBLEtBQUEsWUFBQSx3QkFBQTtNQUNBLE9BQUE7OztJQUdBLFNBQUEsUUFBQSxLQUFBO01BQ0EsS0FBQSxjQUFBLEtBQUEsU0FBQTs7O0lBR0EsT0FBQSxlQUFBLFVBQUE7O01BRUEsS0FBQSw4QkFBQTtRQUNBLFNBQUEsQ0FBQSxRQUFBLENBQUEsTUFBQSxTQUFBLE9BQUEsS0FBQSxTQUFBLE9BQUEsS0FBQSxDQUFBLE1BQUEsU0FBQSxPQUFBLEtBQUEsU0FBQTtRQUNBLFNBQUEsQ0FBQSxTQUFBLFNBQUEsWUFBQSxDQUFBLGFBQUEsb0JBQUEsTUFBQTtTQUNBLEtBQUE7Ozs7Ozs7O0lBUUEsT0FBQSxhQUFBOzs7QUN4bEJBLFFBQUEsT0FBQTtHQUNBLFFBQUEsWUFBQSxXQUFBO0dBQ0EsV0FBQSxZQUFBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsUUFBQSxXQUFBOztNQUVBLE9BQUEsYUFBQTs7OztBQ1BBLFFBQUEsT0FBQTtHQUNBLFdBQUEsYUFBQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFFBQUEsWUFBQTtNQUNBLE9BQUEsVUFBQTs7QUNMQSxRQUFBLE9BQUE7R0FDQSxXQUFBLG1CQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsVUFBQSxRQUFBLFlBQUEsUUFBQSxPQUFBLGFBQUEsVUFBQSxTQUFBLGFBQUEsa0JBQUE7OztNQUdBLE9BQUEsT0FBQSxZQUFBOzs7TUFHQSxPQUFBLGVBQUEsT0FBQSxLQUFBLE1BQUEsTUFBQSxLQUFBLE1BQUEsU0FBQSxLQUFBOzs7TUFHQSxJQUFBLE9BQUEsY0FBQTtRQUNBLE9BQUEsS0FBQSxRQUFBLFFBQUE7Ozs7TUFJQTtNQUNBOztNQUVBO01BQ0E7O01BRUEsT0FBQSxjQUFBLEtBQUEsUUFBQSxTQUFBLEtBQUE7O01BRUEsU0FBQSxrQkFBQTtRQUNBO1dBQ0EsSUFBQTtXQUNBLEtBQUEsVUFBQSxLQUFBO1lBQ0EsSUFBQSxVQUFBLElBQUE7WUFDQSxJQUFBLFFBQUEsT0FBQSxLQUFBLE1BQUEsTUFBQSxLQUFBOztZQUVBLElBQUEsUUFBQSxRQUFBO2NBQ0EsT0FBQSxLQUFBLFFBQUEsU0FBQSxRQUFBLE9BQUE7Y0FDQSxPQUFBLG1CQUFBOzs7O1FBSUE7V0FDQSxJQUFBO1dBQ0EsS0FBQSxVQUFBLEtBQUE7WUFDQSxPQUFBLFVBQUEsSUFBQSxLQUFBLE1BQUE7WUFDQSxPQUFBLFFBQUEsS0FBQTs7WUFFQSxJQUFBLFVBQUE7O1lBRUEsS0FBQSxJQUFBLEdBQUEsSUFBQSxPQUFBLFFBQUEsUUFBQSxLQUFBO2NBQ0EsT0FBQSxRQUFBLEtBQUEsT0FBQSxRQUFBLEdBQUE7Y0FDQSxRQUFBLEtBQUEsRUFBQSxPQUFBLE9BQUEsUUFBQTs7O1lBR0EsRUFBQTtlQUNBLE9BQUE7Z0JBQ0EsUUFBQTtnQkFDQSxPQUFBO2dCQUNBLFVBQUEsVUFBQSxRQUFBLFVBQUE7a0JBQ0EsT0FBQSxLQUFBLFFBQUEsU0FBQSxPQUFBLE1BQUE7Ozs7Ozs7TUFPQSxTQUFBLGtCQUFBO1FBQ0E7V0FDQSxJQUFBO1dBQ0EsS0FBQSxVQUFBLEtBQUE7WUFDQSxPQUFBLFVBQUEsSUFBQSxLQUFBLE1BQUE7WUFDQSxPQUFBLFFBQUEsS0FBQTs7WUFFQSxJQUFBLFVBQUE7O1lBRUEsS0FBQSxJQUFBLEdBQUEsSUFBQSxPQUFBLFFBQUEsUUFBQSxLQUFBO2NBQ0EsT0FBQSxRQUFBLEtBQUEsT0FBQSxRQUFBLEdBQUE7Y0FDQSxRQUFBLEtBQUEsRUFBQSxPQUFBLE9BQUEsUUFBQTs7O1lBR0EsRUFBQTtlQUNBLE9BQUE7Z0JBQ0EsUUFBQTtnQkFDQSxPQUFBO2dCQUNBLFVBQUEsVUFBQSxRQUFBLFVBQUE7a0JBQ0EsT0FBQSxLQUFBLFFBQUEsU0FBQSxPQUFBLE1BQUE7Ozs7Ozs7TUFPQSxTQUFBLGdCQUFBO1FBQ0E7V0FDQSxJQUFBO1dBQ0EsS0FBQSxVQUFBLEtBQUE7WUFDQSxPQUFBLFFBQUEsSUFBQSxLQUFBLE1BQUE7WUFDQSxPQUFBLE1BQUEsS0FBQTs7WUFFQSxJQUFBLFVBQUE7O1lBRUEsS0FBQSxJQUFBLEdBQUEsSUFBQSxPQUFBLE1BQUEsUUFBQSxLQUFBO2NBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxNQUFBLEdBQUE7Y0FDQSxRQUFBLEtBQUEsRUFBQSxPQUFBLE9BQUEsTUFBQTs7O1lBR0EsRUFBQTtlQUNBLE9BQUE7Z0JBQ0EsUUFBQTtnQkFDQSxPQUFBO2dCQUNBLFVBQUEsVUFBQSxRQUFBLFVBQUE7a0JBQ0EsT0FBQSxPQUFBLE9BQUEsTUFBQTs7OztRQUlBLElBQUEsT0FBQSxLQUFBLFFBQUEsVUFBQSxXQUFBO1VBQ0EsT0FBQSxhQUFBLE9BQUEsS0FBQSxRQUFBLE9BQUEsTUFBQSxLQUFBO1VBQ0EsT0FBQSxPQUFBLE9BQUEsS0FBQSxRQUFBLE9BQUEsTUFBQSxLQUFBOzs7OztNQUtBLFNBQUEsaUJBQUEsT0FBQSxNQUFBO1FBQ0EsT0FBQSxNQUFBLE9BQUE7Ozs7O01BS0EsU0FBQSxzQkFBQTtRQUNBLGlCQUFBLFNBQUEsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01Bd0JBLFNBQUEsWUFBQSxHQUFBOzs7UUFHQSxJQUFBLFdBQUE7UUFDQSxJQUFBLFlBQUEsS0FBQSxPQUFBLGtCQUFBLEVBQUEsV0FBQTs7O1FBR0EsSUFBQSxPQUFBLGNBQUEsS0FBQSxFQUFBLE9BQUEsS0FBQSxRQUFBLFNBQUEsT0FBQTthQUNBLEVBQUEsT0FBQSxLQUFBLFFBQUEsU0FBQSxPQUFBLGFBQUEsTUFBQSxPQUFBOztRQUVBO1dBQ0EsY0FBQSxRQUFBLGFBQUEsT0FBQSxLQUFBO1dBQ0EsS0FBQTs7Ozs7YUFLQTs7Ozs7O01BTUEsU0FBQSxVQUFBO1FBQ0EsT0FBQSxDQUFBLE9BQUEsS0FBQSxRQUFBOzs7TUFHQSxTQUFBLG1CQUFBO1FBQ0EsT0FBQSxTQUFBLEtBQUE7OztNQUdBLFNBQUEsbUJBQUE7O1FBRUEsSUFBQSxhQUFBLENBQUEsb0JBQUE7VUFDQSxPQUFBOztRQUVBLE9BQUE7OztNQUdBLFNBQUEsYUFBQTs7UUFFQSxFQUFBLEdBQUEsS0FBQSxTQUFBLE1BQUEsY0FBQSxVQUFBLE9BQUE7VUFDQSxPQUFBOzs7O1FBSUEsRUFBQSxZQUFBLEtBQUE7VUFDQSxJQUFBO1VBQ0EsUUFBQTtVQUNBLFFBQUE7WUFDQSxNQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Z0JBQ0E7a0JBQ0EsTUFBQTtrQkFDQSxRQUFBOzs7O1lBSUEsUUFBQTtjQUNBLFlBQUE7Y0FDQSxPQUFBO2dCQUNBO2tCQUNBLE1BQUE7a0JBQ0EsUUFBQTs7OztZQUlBLFFBQUE7Y0FDQSxZQUFBO2NBQ0EsT0FBQTtnQkFDQTtrQkFDQSxNQUFBO2tCQUNBLFFBQUE7Ozs7WUFJQSxNQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Z0JBQ0E7a0JBQ0EsTUFBQTtrQkFDQSxRQUFBOzs7O1lBSUEsUUFBQTtjQUNBLFlBQUE7Y0FDQSxPQUFBO2dCQUNBO2tCQUNBLE1BQUE7a0JBQ0EsUUFBQTs7OztZQUlBLG1CQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Z0JBQ0E7a0JBQ0EsTUFBQTtrQkFDQSxRQUFBOzs7O1lBSUEsT0FBQTtjQUNBLFlBQUE7Y0FDQSxPQUFBO2dCQUNBO2tCQUNBLE1BQUE7a0JBQ0EsUUFBQTs7OztZQUlBLE9BQUE7Y0FDQSxZQUFBO2NBQ0EsT0FBQTtnQkFDQTtrQkFDQSxNQUFBO2tCQUNBLFFBQUE7Ozs7WUFJQSxhQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Z0JBQ0E7a0JBQ0EsTUFBQTtrQkFDQSxRQUFBOzs7O1lBSUEsT0FBQTtjQUNBLFlBQUE7Y0FDQSxPQUFBO2dCQUNBO2tCQUNBLE1BQUE7a0JBQ0EsUUFBQTs7OztZQUlBLFVBQUE7Y0FDQSxZQUFBO2NBQ0EsT0FBQTtnQkFDQTtrQkFDQSxNQUFBO2tCQUNBLFFBQUE7Ozs7WUFJQSxVQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Z0JBQ0E7a0JBQ0EsTUFBQTtrQkFDQSxRQUFBOzs7O1lBSUEsUUFBQTtjQUNBLFlBQUE7Y0FDQSxPQUFBO2dCQUNBO2tCQUNBLE1BQUE7a0JBQ0EsUUFBQTs7OztZQUlBLFlBQUE7Y0FDQSxZQUFBO2NBQ0EsT0FBQTtnQkFDQTtrQkFDQSxNQUFBO2tCQUNBLFFBQUE7Ozs7WUFJQSxRQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Z0JBQ0E7a0JBQ0EsTUFBQTtrQkFDQSxRQUFBOzs7Ozs7OztNQVFBLE9BQUEsYUFBQSxZQUFBO1FBQ0EsSUFBQSxFQUFBLFlBQUEsS0FBQSxhQUFBOztVQUVBO2VBQ0E7VUFDQSxLQUFBLFVBQUEsbUNBQUE7Ozs7O0FDaFdBLFFBQUEsT0FBQTtHQUNBLFdBQUEsa0JBQUE7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFFBQUEsWUFBQSxRQUFBLE9BQUEsYUFBQSxTQUFBLGtCQUFBLGFBQUEsa0JBQUE7OztNQUdBLGlCQUFBLFNBQUEsS0FBQTs7Ozs7O01BTUEsaUJBQUEsU0FBQSxLQUFBOzs7Ozs7TUFNQSxTQUFBLFVBQUEsV0FBQTtRQUNBLEtBQUEsWUFBQSx5Q0FBQSxVQUFBLFFBQUEsWUFBQTtRQUNBLE9BQUE7Ozs7TUFJQSxTQUFBLFFBQUEsS0FBQTtRQUNBLEtBQUEsY0FBQSxLQUFBLFNBQUE7Ozs7TUFJQSxPQUFBLGlCQUFBLFNBQUEsVUFBQSxRQUFBLFNBQUE7UUFDQSxJQUFBLFFBQUE7VUFDQSxpQkFBQSxNQUFBLFVBQUEsWUFBQSxPQUFBLFVBQUE7YUFDQTtVQUNBLGlCQUFBLE1BQUEsVUFBQSxZQUFBLE9BQUE7Ozs7OztNQU1BLE9BQUEsZ0JBQUEsU0FBQSxXQUFBOztRQUVBLGlCQUFBLElBQUEsVUFBQSxLQUFBLEtBQUE7Ozs7Ozs7Ozs7TUFVQSxpQkFBQSxTQUFBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQThCQSxPQUFBLFdBQUEsU0FBQSxNQUFBOztRQUVBLElBQUEsS0FBQSxJQUFBLFlBQUEsS0FBQSxLQUFBO1VBQ0EsT0FBQTs7Ozs7Ozs7QUM1RkEsUUFBQSxPQUFBO0NBQ0EsV0FBQSxlQUFBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxTQUFBLFFBQUEsUUFBQSxjQUFBLFlBQUE7SUFDQSxFQUFBLFdBQUEsYUFBQSxTQUFBLE9BQUE7OztVQUdBLFlBQUEsSUFBQSxRQUFBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BK0NBLFNBQUEsTUFBQTtTQUNBLFNBQUEsV0FBQTs7OztJQUlBLE9BQUEsUUFBQTtJQUNBLE9BQUEsUUFBQTtJQUNBLE9BQUEsU0FBQTtJQUNBLE9BQUEsVUFBQTs7SUFFQSxPQUFBLFNBQUEsbUJBQUEsYUFBQTtJQUNBLE9BQUEsT0FBQSxPQUFBLGFBQUEsU0FBQTs7SUFFQSxTQUFBLG1CQUFBLE1BQUE7TUFDQSxJQUFBLE1BQUE7TUFDQSxJQUFBLENBQUEsTUFBQSxPQUFBO01BQ0EsS0FBQSxNQUFBLEtBQUEsUUFBQSxTQUFBLEVBQUEsQ0FBQSxJQUFBLEdBQUE7TUFDQSxPQUFBLENBQUEsS0FBQSxTQUFBLEdBQUEsR0FBQTs7O0lBR0EsU0FBQSxpQkFBQSxTQUFBO01BQ0EsSUFBQSxNQUFBO01BQ0EsS0FBQSxJQUFBLEtBQUEsU0FBQSxDQUFBLEdBQUEsT0FBQSxRQUFBLE1BQUEsV0FBQSxRQUFBLElBQUEsT0FBQSxFQUFBO01BQ0EsT0FBQSxDQUFBLElBQUEsU0FBQSxHQUFBLEdBQUEsSUFBQSxPQUFBLEVBQUEsSUFBQSxPQUFBOzs7Ozs7O0lBT0EsRUFBQSxjQUFBOztJQUVBLE9BQUEsZUFBQTtJQUNBLE9BQUEsYUFBQSxXQUFBLGlCQUFBO01BQ0EsUUFBQTtNQUNBLGNBQUE7UUFDQSxxQkFBQTs7TUFFQSxTQUFBOzs7SUFHQSxTQUFBLFdBQUEsTUFBQTtNQUNBLE9BQUEsUUFBQSxLQUFBO01BQ0EsT0FBQSxjQUFBLEtBQUE7TUFDQSxPQUFBLFdBQUEsS0FBQTs7TUFFQSxJQUFBLElBQUE7TUFDQSxLQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxZQUFBLEtBQUE7UUFDQSxFQUFBLEtBQUE7O01BRUEsT0FBQSxRQUFBOzs7SUFHQSxZQUFBLFFBQUEsYUFBQSxNQUFBLGFBQUEsTUFBQSxhQUFBLE9BQUEsT0FBQTtLQUNBLEtBQUE7Ozs7O0lBS0EsT0FBQSxPQUFBLGFBQUEsU0FBQSxXQUFBO01BQ0EsWUFBQSxRQUFBLGFBQUEsTUFBQSxhQUFBLE1BQUEsV0FBQSxPQUFBLGVBQUE7UUFDQTs7Ozs7OztJQU9BLE9BQUEsb0JBQUEsWUFBQTtNQUNBO1NBQ0EsUUFBQSxhQUFBLE1BQUEsYUFBQSxNQUFBLE9BQUEsV0FBQSxPQUFBLGVBQUE7VUFDQTs7Ozs7O0lBTUEsT0FBQSxXQUFBLFNBQUEsTUFBQTtNQUNBLE9BQUEsR0FBQSxtQkFBQTtRQUNBLE1BQUE7UUFDQSxNQUFBLGFBQUEsUUFBQTs7OztJQUlBLE9BQUEsVUFBQSxTQUFBLFFBQUEsTUFBQSxPQUFBO01BQ0EsT0FBQTs7TUFFQSxJQUFBLENBQUEsS0FBQSxPQUFBLFdBQUE7UUFDQSxLQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUEsK0JBQUEsS0FBQSxRQUFBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTtZQUNBLFFBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLFNBQUE7O1lBRUEsU0FBQTtjQUNBLFdBQUE7Y0FDQSxZQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOzs7V0FHQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7YUFlQTtRQUNBO1VBQ0E7VUFDQSxLQUFBLFFBQUEsT0FBQSw2QkFBQSxXQUFBLEtBQUEsT0FBQTtVQUNBOzs7OztJQUtBLFNBQUEsV0FBQSxNQUFBO01BQ0EsSUFBQSxNQUFBO1FBQ0EsT0FBQSxPQUFBLE1BQUEsT0FBQTs7OztJQUlBLE9BQUEsV0FBQSxTQUFBLE1BQUE7TUFDQSxJQUFBLEtBQUEsT0FBQTtRQUNBLE9BQUE7O01BRUEsSUFBQSxLQUFBLE9BQUEsV0FBQTtRQUNBLE9BQUE7O01BRUEsSUFBQSxLQUFBLE9BQUEsWUFBQSxDQUFBLEtBQUEsT0FBQSxXQUFBO1FBQ0EsT0FBQTs7OztJQUlBLFNBQUEsV0FBQSxNQUFBO01BQ0EsT0FBQSxlQUFBO01BQ0EsT0FBQSxhQUFBLFdBQUEsaUJBQUE7TUFDQSxFQUFBLG9CQUFBLE1BQUE7OztJQUdBLFNBQUEsaUJBQUEsTUFBQTtNQUNBLE9BQUE7UUFDQTtVQUNBLE1BQUE7VUFDQSxRQUFBO1lBQ0E7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxXQUFBLEtBQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxXQUFBLEtBQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxXQUFBLEtBQUEsT0FBQSxjQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsV0FBQSxLQUFBLE9BQUEsZ0JBQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBOzs7O1FBSUE7VUFDQSxNQUFBO1VBQ0EsUUFBQTtZQUNBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQSxRQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQSxRQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQSxRQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQSxRQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQSxRQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQSxRQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQSxRQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQSxRQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQSxRQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQSxRQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQSxRQUFBOzs7O1FBSUE7VUFDQSxNQUFBO1VBQ0EsUUFBQTtZQUNBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQSxhQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQSxhQUFBO2NBQ0EsTUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsYUFBQTs7OztRQUlBO1VBQ0EsTUFBQTtVQUNBLFFBQUE7WUFDQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsYUFBQTs7Ozs7O0lBTUEsT0FBQSxhQUFBOztBQzVUQSxRQUFBLE9BQUE7R0FDQSxXQUFBLG9CQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBQSxRQUFBLFlBQUEsUUFBQSxhQUFBLE9BQUEsWUFBQTs7O01BR0EsSUFBQSxPQUFBLFlBQUE7TUFDQSxPQUFBLE9BQUE7O01BRUEsT0FBQSxtQkFBQSxLQUFBLFFBQUEsS0FBQSxPQUFBOztNQUVBLE9BQUEsYUFBQSxNQUFBOztNQUVBOztNQUVBLE9BQUEsV0FBQSxLQUFBLE1BQUEsTUFBQSxLQUFBLFFBQUEsS0FBQSxNQUFBLEtBQUEsS0FBQTs7Ozs7TUFLQSxJQUFBLHNCQUFBO1FBQ0EsY0FBQTtRQUNBLFNBQUE7UUFDQSxTQUFBO1FBQ0EsVUFBQTtRQUNBLGVBQUE7OztNQUdBLElBQUEsS0FBQSxhQUFBLG9CQUFBO1FBQ0EsS0FBQSxhQUFBLG9CQUFBLFFBQUEsU0FBQSxZQUFBO1VBQ0EsSUFBQSxlQUFBLG9CQUFBO1lBQ0Esb0JBQUEsZUFBQTs7Ozs7TUFLQSxPQUFBLHNCQUFBOzs7O01BSUEsU0FBQSxZQUFBLEVBQUE7UUFDQSxJQUFBLGVBQUEsT0FBQSxLQUFBOztRQUVBLElBQUEsTUFBQTtRQUNBLE9BQUEsS0FBQSxPQUFBLHFCQUFBLFFBQUEsU0FBQSxJQUFBO1VBQ0EsSUFBQSxPQUFBLG9CQUFBLEtBQUE7WUFDQSxJQUFBLEtBQUE7OztRQUdBLGFBQUEsc0JBQUE7O1FBRUE7V0FDQSxtQkFBQSxLQUFBLEtBQUE7V0FDQSxLQUFBOzs7O2FBSUE7Ozs7O01BS0EsU0FBQSxZQUFBOztRQUVBLEVBQUEsWUFBQSxLQUFBO1VBQ0EsUUFBQTtZQUNBLE9BQUE7Y0FDQSxZQUFBO2NBQ0EsT0FBQTtnQkFDQTtrQkFDQSxNQUFBO2tCQUNBLFFBQUE7Ozs7WUFJQSxPQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Z0JBQ0E7a0JBQ0EsTUFBQTtrQkFDQSxRQUFBOzs7O1lBSUEsd0JBQUE7Y0FDQSxZQUFBO2NBQ0EsT0FBQTtnQkFDQTtrQkFDQSxNQUFBO2tCQUNBLFFBQUE7Ozs7WUFJQSxnQkFBQTtjQUNBLFlBQUE7Y0FDQSxPQUFBO2dCQUNBO2tCQUNBLE1BQUE7a0JBQ0EsUUFBQTs7Ozs7Ozs7TUFRQSxPQUFBLGFBQUEsVUFBQTtRQUNBLElBQUEsRUFBQSxZQUFBLEtBQUEsWUFBQTtVQUNBO2VBQ0E7VUFDQSxLQUFBLFVBQUEsbUNBQUE7Ozs7OztBQ25IQSxRQUFBLE9BQUE7R0FDQSxXQUFBLGlCQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFlBQUEsUUFBQSxNQUFBLGFBQUEsVUFBQSxPQUFBLGFBQUEsYUFBQSxZQUFBLFVBQUE7TUFDQSxJQUFBLFdBQUEsU0FBQTtNQUNBLElBQUEsT0FBQSxZQUFBO01BQ0EsT0FBQSxPQUFBO01BQ0EsT0FBQSxZQUFBLE1BQUEsV0FBQSxTQUFBO01BQ0EsT0FBQSxjQUFBLE1BQUEsV0FBQSxTQUFBOztNQUVBLE9BQUEsWUFBQTs7TUFFQSxLQUFBLElBQUEsT0FBQSxPQUFBLFdBQUE7UUFDQSxJQUFBLE9BQUEsVUFBQSxLQUFBLFNBQUEsbUJBQUE7VUFDQSxPQUFBLFVBQUEsT0FBQSxPQUFBLFVBQUEsS0FBQSxRQUFBLGtCQUFBLE1BQUEsV0FBQSxTQUFBOztRQUVBLElBQUEsT0FBQSxVQUFBLEtBQUEsU0FBQSx1QkFBQTtVQUNBLE9BQUEsVUFBQSxPQUFBLE9BQUEsVUFBQSxLQUFBLFFBQUEsc0JBQUEsTUFBQSxXQUFBLEtBQUEsT0FBQTs7Ozs7TUFLQSxJQUFBLFlBQUEsT0FBQSxZQUFBLE1BQUEsVUFBQTs7O01BR0EsSUFBQSxtQkFBQSxPQUFBLG1CQUFBLE1BQUEsUUFBQSxLQUFBLE9BQUE7O01BRUEsT0FBQSxZQUFBLFNBQUEsT0FBQTtRQUNBLElBQUEsT0FBQSxPQUFBO1FBQ0EsUUFBQTtVQUNBLEtBQUE7WUFDQSxPQUFBLENBQUEsS0FBQTtVQUNBLEtBQUE7WUFDQSxPQUFBLGFBQUEsS0FBQSxZQUFBLENBQUEsS0FBQSxPQUFBO1VBQ0EsS0FBQTtZQUNBLE9BQUEsYUFBQSxLQUFBLE9BQUEsb0JBQUEsQ0FBQSxLQUFBLE9BQUE7VUFDQSxLQUFBO1lBQ0EsT0FBQSxDQUFBLGFBQUEsQ0FBQSxLQUFBLE9BQUEsb0JBQUEsQ0FBQSxLQUFBLE9BQUE7VUFDQSxLQUFBO1lBQ0EsT0FBQSxDQUFBLGFBQUEsS0FBQSxPQUFBLG9CQUFBLENBQUEsS0FBQSxPQUFBO1VBQ0EsS0FBQTtZQUNBLE9BQUEsQ0FBQTtjQUNBLEtBQUEsT0FBQTtjQUNBLENBQUEsS0FBQSxPQUFBO2NBQ0EsQ0FBQSxLQUFBLE9BQUE7VUFDQSxLQUFBO1lBQ0EsT0FBQTtjQUNBLEtBQUEsT0FBQTtjQUNBLENBQUEsS0FBQSxPQUFBO2NBQ0EsQ0FBQSxLQUFBLE9BQUE7VUFDQSxLQUFBO1lBQ0EsT0FBQSxLQUFBLE9BQUEsWUFBQSxLQUFBLE9BQUEsYUFBQSxDQUFBLEtBQUEsT0FBQTtVQUNBLEtBQUE7WUFDQSxPQUFBLEtBQUEsT0FBQTs7UUFFQSxPQUFBOzs7TUFHQSxPQUFBLGVBQUEsQ0FBQSxhQUFBLEtBQUEsT0FBQSxvQkFBQSxDQUFBLEtBQUEsT0FBQTs7TUFFQSxPQUFBLGNBQUEsVUFBQTtRQUNBO1dBQ0E7V0FDQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BeUJBLElBQUEsWUFBQSxJQUFBLFNBQUE7TUFDQSxPQUFBLGlCQUFBLEtBQUEsWUFBQSxVQUFBLFNBQUEsU0FBQTtNQUNBLE9BQUEsbUJBQUEsS0FBQSxZQUFBLFVBQUEsU0FBQSxTQUFBO01BQ0EsT0FBQSxlQUFBLEtBQUEsWUFBQSxVQUFBLFNBQUEsU0FBQTs7TUFFQSxPQUFBLG1CQUFBLFVBQUE7O01BRUEsS0FBQTtRQUNBLE9BQUE7UUFDQSxNQUFBO1FBQ0EsTUFBQTtRQUNBLFNBQUE7VUFDQSxRQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOztVQUVBLFNBQUE7WUFDQSxNQUFBO1lBQ0EsT0FBQTtZQUNBLFNBQUE7WUFDQSxXQUFBOzs7U0FHQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUN6SEEsUUFBQSxPQUFBO0dBQ0EsV0FBQSxZQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsWUFBQSxRQUFBLE9BQUEsUUFBQSxVQUFBLE9BQUEsYUFBQSxXQUFBO01BQ0EsT0FBQSxVQUFBOztNQUVBLE9BQUEsYUFBQTs7TUFFQSxJQUFBLFdBQUEsU0FBQTtNQUNBLE9BQUEsWUFBQSxNQUFBLFVBQUE7Ozs7TUFJQSxJQUFBLFdBQUEsU0FBQTtNQUNBLE9BQUEsWUFBQSxNQUFBLFVBQUE7OztNQUdBLE9BQUEsYUFBQTs7TUFFQSxTQUFBLFlBQUE7UUFDQSxPQUFBLEdBQUE7OztNQUdBLFNBQUEsUUFBQSxLQUFBO1FBQ0EsT0FBQSxRQUFBLEtBQUE7OztNQUdBLFNBQUEsWUFBQTtRQUNBLE9BQUEsUUFBQTs7O01BR0EsT0FBQSxRQUFBLFVBQUE7UUFDQTtRQUNBLFlBQUE7VUFDQSxPQUFBLE9BQUEsT0FBQSxVQUFBLFdBQUE7OztNQUdBLE9BQUEsV0FBQSxVQUFBO1FBQ0E7UUFDQSxZQUFBO1VBQ0EsT0FBQSxPQUFBLE9BQUEsVUFBQSxXQUFBOzs7TUFHQSxPQUFBLGdCQUFBLFNBQUEsT0FBQTtRQUNBLE9BQUEsYUFBQTs7O01BR0EsT0FBQSxpQkFBQSxXQUFBO1FBQ0EsSUFBQSxRQUFBLE9BQUE7UUFDQSxZQUFBLGVBQUE7UUFDQSxLQUFBLGdCQUFBLDJDQUFBOzs7Ozs7TUFNQSxPQUFBLFVBQUE7Ozs7QUMvREEsUUFBQSxPQUFBO0dBQ0EsV0FBQSxhQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFFBQUEsT0FBQSxRQUFBLFVBQUEsT0FBQSxhQUFBLFdBQUE7O01BRUEsT0FBQSxhQUFBOzs7TUFHQSxJQUFBLFdBQUEsU0FBQTtNQUNBLE9BQUEsWUFBQSxNQUFBLFVBQUE7OztNQUdBLE9BQUEsYUFBQTs7TUFFQSxTQUFBLFlBQUE7UUFDQSxPQUFBLEdBQUE7OztNQUdBLFNBQUEsUUFBQSxLQUFBO1FBQ0EsT0FBQSxRQUFBLEtBQUE7OztNQUdBLFNBQUEsWUFBQTtRQUNBLE9BQUEsUUFBQTs7O01BR0EsT0FBQSxRQUFBLFVBQUE7UUFDQTtRQUNBLFlBQUE7VUFDQSxPQUFBLE9BQUEsT0FBQSxVQUFBLFdBQUE7OztNQUdBLE9BQUEsV0FBQSxVQUFBO1FBQ0E7UUFDQSxZQUFBO1VBQ0EsT0FBQSxPQUFBLE9BQUEsVUFBQSxXQUFBOzs7TUFHQSxPQUFBLGdCQUFBLFNBQUEsT0FBQTtRQUNBLE9BQUEsYUFBQTs7O01BR0EsT0FBQSxpQkFBQSxXQUFBO1FBQ0EsSUFBQSxRQUFBLE9BQUE7UUFDQSxZQUFBLGVBQUE7UUFDQSxLQUFBLGdCQUFBLDJDQUFBOzs7Ozs7QUNuREEsUUFBQSxPQUFBO0dBQ0EsV0FBQSxhQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFFBQUEsY0FBQSxRQUFBLFlBQUE7TUFDQSxJQUFBLFFBQUEsYUFBQTs7TUFFQSxPQUFBLFVBQUE7O01BRUEsT0FBQSxpQkFBQSxVQUFBO1FBQ0EsSUFBQSxXQUFBLE9BQUE7UUFDQSxJQUFBLFVBQUEsT0FBQTs7UUFFQSxJQUFBLGFBQUEsUUFBQTtVQUNBLE9BQUEsUUFBQTtVQUNBLE9BQUEsVUFBQTtVQUNBOzs7UUFHQSxZQUFBO1VBQ0E7VUFDQSxPQUFBO1VBQ0E7Ozs7O1VBS0E7Ozs7Ozs7QUM3QkEsUUFBQSxPQUFBO0dBQ0EsUUFBQSxZQUFBLFdBQUE7R0FDQSxXQUFBLGVBQUE7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsWUFBQSxRQUFBLGlCQUFBLE9BQUEsYUFBQSxTQUFBLFdBQUE7O01BRUEsSUFBQSxPQUFBLFdBQUE7O01BRUEsT0FBQSxhQUFBOztNQUVBLE9BQUEsbUJBQUEsTUFBQSxRQUFBLEtBQUEsT0FBQTs7O01BR0E7T0FDQTtPQUNBLEtBQUE7Ozs7TUFJQSxPQUFBLFNBQUEsVUFBQTtRQUNBLFlBQUE7OztNQUdBLE9BQUEsY0FBQTtNQUNBLE9BQUEsZ0JBQUEsVUFBQTtRQUNBLE9BQUEsY0FBQSxDQUFBLE9BQUE7Ozs7TUFJQSxFQUFBLFNBQUEsR0FBQSxTQUFBLFVBQUE7UUFDQSxPQUFBLGNBQUE7Ozs7Ozs7QUNsQ0EsUUFBQSxPQUFBO0dBQ0EsV0FBQSxZQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsVUFBQSxRQUFBLFFBQUEsVUFBQSxhQUFBLFVBQUEsT0FBQSxhQUFBLGFBQUEsTUFBQTs7TUFFQSxJQUFBLFdBQUEsU0FBQTs7TUFFQSxPQUFBLFlBQUEsTUFBQSxVQUFBOztNQUVBLE9BQUEsT0FBQSxZQUFBOztNQUVBLFNBQUEsYUFBQSxPQUFBLFFBQUE7UUFDQSxJQUFBLE9BQUE7UUFDQSxNQUFBLFFBQUE7Ozs7O1FBS0EsT0FBQTs7O01BR0EsU0FBQSxhQUFBLFVBQUE7UUFDQSxZQUFBLElBQUEsVUFBQSxLQUFBOzs7OztRQUtBLFFBQUEsSUFBQTtRQUNBLEVBQUEsb0JBQUEsTUFBQTs7O01BR0EsU0FBQSxpQkFBQSxNQUFBO1FBQ0EsT0FBQTtVQUNBO1lBQ0EsTUFBQTtZQUNBLFFBQUE7Y0FDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxRQUFBOztjQUVBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLFFBQUE7O2NBRUE7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsUUFBQTs7Y0FFQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxRQUFBOzs7Ozs7O01BT0EsU0FBQSxXQUFBLE1BQUE7UUFDQSxJQUFBLE1BQUE7VUFDQSxPQUFBLE9BQUEsTUFBQSxPQUFBOzs7O01BSUEsT0FBQSxlQUFBOzs7TUFHQSxPQUFBLFdBQUEsVUFBQSxNQUFBO1FBQ0EsSUFBQSxPQUFBO1FBQ0EsS0FBQSxhQUFBLFFBQUE7OztRQUdBLE9BQUE7OztNQUdBLFlBQUEsU0FBQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFpQ0EsT0FBQSxhQUFBLFlBQUE7O1FBRUEsV0FBQTtVQUNBLGFBQUEsT0FBQTtVQUNBLFNBQUEsQ0FBQSxFQUFBLElBQUEsWUFBQSxLQUFBLEtBQUEsTUFBQSxZQUFBLEtBQUEsUUFBQSxNQUFBLE9BQUEsT0FBQTtVQUNBLFFBQUEsRUFBQSxNQUFBLE9BQUEsV0FBQSxRQUFBLE9BQUEsYUFBQSxVQUFBLE9BQUEsZUFBQSxNQUFBLE9BQUE7VUFDQSxXQUFBOztRQUVBLFFBQUEsSUFBQTtRQUNBLFFBQUEsSUFBQSxPQUFBOztRQUVBLFlBQUEsT0FBQTtRQUNBLE9BQUE7Ozs7TUFJQSxPQUFBLGlCQUFBLFlBQUE7UUFDQSxPQUFBLGtCQUFBO1FBQ0EsT0FBQSxZQUFBO1FBQ0EsT0FBQSxjQUFBO1FBQ0EsT0FBQSxnQkFBQTtRQUNBLE9BQUEsWUFBQTtRQUNBLE9BQUEscUJBQUE7Ozs7TUFJQSxPQUFBLGVBQUEsVUFBQTtRQUNBLE9BQUEsbUJBQUE7Ozs7TUFJQSxPQUFBLGVBQUEsWUFBQTs7UUFFQSxTQUFBLE9BQUE7UUFDQSxlQUFBLE9BQUE7O1FBRUEsU0FBQSxDQUFBLEdBQUEsWUFBQSxLQUFBLEtBQUEsS0FBQSxZQUFBLEtBQUEsUUFBQSxNQUFBLE1BQUE7UUFDQSxZQUFBLEtBQUEsT0FBQSxTQUFBLE1BQUE7Ozs7OztVQU1BLE1BQUE7Ozs7Ozs7UUFPQSxPQUFBOzs7TUFHQSxPQUFBLFdBQUEsVUFBQSxNQUFBOztRQUVBLElBQUE7UUFDQSxNQUFBLFNBQUEsU0FBQSxjQUFBO1FBQ0EsT0FBQSxZQUFBOzs7UUFHQSxJQUFBLFNBQUEsU0FBQSxjQUFBO1FBQ0EsT0FBQSxXQUFBO1FBQ0EsT0FBQSxZQUFBO1FBQ0EsT0FBQSxRQUFBO1FBQ0EsT0FBQSxZQUFBOzs7UUFHQSxJQUFBLEtBQUEsT0FBQSxNQUFBO1VBQ0EsU0FBQSxTQUFBLGNBQUE7VUFDQSxPQUFBLFlBQUE7VUFDQSxPQUFBLFFBQUE7VUFDQSxPQUFBLFlBQUE7O1FBRUEsSUFBQSxLQUFBLE9BQUEsUUFBQTtVQUNBLFNBQUEsU0FBQSxjQUFBO1VBQ0EsT0FBQSxZQUFBO1VBQ0EsT0FBQSxRQUFBO1VBQ0EsT0FBQSxZQUFBOztRQUVBLElBQUEsS0FBQSxPQUFBLFVBQUE7VUFDQSxTQUFBLFNBQUEsY0FBQTtVQUNBLE9BQUEsWUFBQTtVQUNBLE9BQUEsUUFBQTtVQUNBLE9BQUEsWUFBQTs7UUFFQSxJQUFBLEtBQUEsT0FBQSxNQUFBO1VBQ0EsU0FBQSxTQUFBLGNBQUE7VUFDQSxPQUFBLFlBQUE7VUFDQSxPQUFBLFFBQUE7VUFDQSxPQUFBLFlBQUE7OztRQUdBLE9BQUEsV0FBQSxTQUFBLGNBQUEsR0FBQTtVQUNBLFFBQUEsRUFBQSxPQUFBOzs7UUFHQSxLQUFBO1VBQ0EsT0FBQTs7VUFFQSxTQUFBO1lBQ0EsU0FBQTs7V0FFQSxLQUFBLFlBQUE7O1VBRUEsVUFBQSxFQUFBLElBQUEsWUFBQSxLQUFBLEtBQUEsTUFBQSxZQUFBLEtBQUEsUUFBQSxNQUFBLE9BQUE7VUFDQSxRQUFBLElBQUEsS0FBQTs7VUFFQSxZQUFBLEtBQUEsS0FBQSxLQUFBLFNBQUEsTUFBQTs7Ozs7O1lBTUEsTUFBQTs7Ozs7OztVQU9BLE9BQUE7Ozs7O01BS0EsT0FBQSxlQUFBLFVBQUEsUUFBQSxRQUFBLE9BQUE7O1FBRUEsS0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBLDZCQUFBLE9BQUEsT0FBQTtVQUNBLE1BQUE7VUFDQSxTQUFBO1lBQ0EsUUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQTs7WUFFQSxTQUFBO2NBQ0EsV0FBQTtjQUNBLFlBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLFNBQUE7OztXQUdBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQTJCQSxPQUFBLGVBQUEsVUFBQSxRQUFBLFFBQUEsT0FBQTtRQUNBLEtBQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQSw2QkFBQSxPQUFBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTtZQUNBLFFBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLFNBQUE7O1lBRUEsU0FBQTtjQUNBLFdBQUE7Y0FDQSxZQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOzs7V0FHQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7O01BZ0JBLE9BQUEsdUJBQUEsVUFBQSxRQUFBLFFBQUEsT0FBQTtRQUNBLEtBQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQSw2QkFBQSxPQUFBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTtZQUNBLFFBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLFNBQUE7O1lBRUEsU0FBQTtjQUNBLFdBQUE7Y0FDQSxZQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOzs7V0FHQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUEyQkEsT0FBQSxhQUFBLFVBQUEsTUFBQTtRQUNBLEtBQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLE1BQUE7VUFDQSxTQUFBO1lBQ0EsUUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQTs7WUFFQSxTQUFBO2NBQ0EsV0FBQTtjQUNBLFlBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLFNBQUE7OztXQUdBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQThCQSxPQUFBLFlBQUEsVUFBQSxNQUFBO1FBQ0EsS0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUE7WUFDQSxRQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOztZQUVBLFNBQUE7Y0FDQSxXQUFBO2NBQ0EsWUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQTs7O1dBR0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUF1QkEsT0FBQSxpQkFBQSxVQUFBLE1BQUE7UUFDQSxLQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTtZQUNBLFFBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLFNBQUE7O1lBRUEsU0FBQTtjQUNBLFdBQUE7Y0FDQSxZQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOzs7V0FHQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUF3QkEsT0FBQSxrQkFBQSxVQUFBLFFBQUEsUUFBQTtRQUNBLElBQUEsVUFBQSxNQUFBO1VBQ0EsT0FBQTtlQUNBLEVBQUEsT0FBQTs7UUFFQSxLQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTtZQUNBLFFBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLFNBQUE7O1lBRUEsU0FBQTtjQUNBLFdBQUE7Y0FDQSxZQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOzs7V0FHQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztNQWlCQSxPQUFBLGlCQUFBLFVBQUEsUUFBQSxRQUFBO1FBQ0EsSUFBQSxVQUFBLE1BQUE7VUFDQSxPQUFBO2VBQ0EsRUFBQSxPQUFBOztRQUVBLEtBQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLE1BQUE7VUFDQSxTQUFBO1lBQ0EsUUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQTs7WUFFQSxTQUFBO2NBQ0EsV0FBQTtjQUNBLFlBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLFNBQUE7OztXQUdBLEtBQUE7Ozs7Ozs7Ozs7Ozs7OztNQWVBLE9BQUEsT0FBQSxhQUFBLFVBQUEsV0FBQTtRQUNBLFlBQUEsaUJBQUEsV0FBQSxPQUFBLGVBQUE7VUFDQTs7Ozs7O01BTUEsT0FBQSxvQkFBQSxZQUFBO1FBQ0EsWUFBQSxpQkFBQSxPQUFBLFdBQUEsT0FBQSxlQUFBO1VBQ0E7Ozs7Ozs7Ozs7OztBQ2hsQkEsUUFBQSxPQUFBO0dBQ0EsV0FBQSxjQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBQSxRQUFBLGNBQUEsWUFBQTtNQUNBLElBQUEsUUFBQSxhQUFBOztNQUVBLE9BQUEsVUFBQTs7TUFFQSxJQUFBLE9BQUE7UUFDQSxZQUFBLE9BQUE7VUFDQSxTQUFBLEtBQUE7WUFDQSxPQUFBLFVBQUE7WUFDQSxPQUFBLFVBQUE7O1VBRUEsU0FBQSxJQUFBO1lBQ0EsT0FBQSxVQUFBOzs7O0FBSUEiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdyZWcnLCBbXHJcbiAgJ3VpLnJvdXRlcicsXHJcbiAgJ2NoYXJ0LmpzJyxcclxuXSk7XHJcblxyXG5hcHBcclxuICAuY29uZmlnKFtcclxuICAgICckaHR0cFByb3ZpZGVyJyxcclxuICAgIGZ1bmN0aW9uKCRodHRwUHJvdmlkZXIpe1xyXG5cclxuICAgICAgLy8gQWRkIGF1dGggdG9rZW4gdG8gQXV0aG9yaXphdGlvbiBoZWFkZXJcclxuICAgICAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCgnQXV0aEludGVyY2VwdG9yJyk7XHJcblxyXG4gICAgfV0pXHJcbiAgLnJ1bihbXHJcbiAgICAnQXV0aFNlcnZpY2UnLFxyXG4gICAgJ1Nlc3Npb24nLFxyXG4gICAgZnVuY3Rpb24oQXV0aFNlcnZpY2UsIFNlc3Npb24pe1xyXG5cclxuICAgICAgLy8gU3RhcnR1cCwgbG9naW4gaWYgdGhlcmUncyAgYSB0b2tlbi5cclxuICAgICAgdmFyIHRva2VuID0gU2Vzc2lvbi5nZXRUb2tlbigpO1xyXG4gICAgICBpZiAodG9rZW4pe1xyXG4gICAgICAgIEF1dGhTZXJ2aWNlLmxvZ2luV2l0aFRva2VuKHRva2VuKTtcclxuICAgICAgfVxyXG5cclxuICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gICAgLmNvbnN0YW50KCdFVkVOVF9JTkZPJywge1xyXG4gICAgICAgIE5BTUU6ICdIYWNraXQgMjAyMCcsXHJcbiAgICB9KVxyXG4gICAgLmNvbnN0YW50KCdEQVNIQk9BUkQnLCB7XHJcbiAgICAgICAgVU5WRVJJRklFRDogJ1lvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhbiBlbWFpbCBhc2tpbmcgeW91IHZlcmlmeSB5b3VyIGVtYWlsLiBDbGljayB0aGUgbGluayBpbiB0aGUgZW1haWwgYW5kIHlvdSBjYW4gc3RhcnQgeW91ciBhcHBsaWNhdGlvbiEnLFxyXG4gICAgICAgIElOQ09NUExFVEVfVElUTEU6ICdZb3Ugc3RpbGwgbmVlZCB0byBjb21wbGV0ZSB5b3VyIGFwcGxpY2F0aW9uIScsXHJcbiAgICAgICAgSU5DT01QTEVURTogJ0lmIHlvdSBkbyBub3QgY29tcGxldGUgeW91ciBhcHBsaWNhdGlvbiBiZWZvcmUgdGhlIFtBUFBfREVBRExJTkVdLCB5b3Ugd2lsbCBub3QgYmUgY29uc2lkZXJlZCBmb3IgdGhlIGFkbWlzc2lvbnMgbG90dGVyeSEnLFxyXG4gICAgICAgIFNVQk1JVFRFRF9USVRMRTogJ1lvdXIgYXBwbGljYXRpb24gaGFzIGJlZW4gc3VibWl0dGVkIScsXHJcbiAgICAgICAgU1VCTUlUVEVEOiAnRmVlbCBmcmVlIHRvIGVkaXQgaXQgYXQgYW55IHRpbWUuIEhvd2V2ZXIsIG9uY2UgcmVnaXN0cmF0aW9uIGlzIGNsb3NlZCwgeW91IHdpbGwgbm90IGJlIGFibGUgdG8gZWRpdCBpdCBhbnkgZnVydGhlci5cXG5BZG1pc3Npb25zIHdpbGwgYmUgZGV0ZXJtaW5lZCBieSBhIHJhbmRvbSBsb3R0ZXJ5LiBQbGVhc2UgbWFrZSBzdXJlIHlvdXIgaW5mb3JtYXRpb24gaXMgYWNjdXJhdGUgYmVmb3JlIHJlZ2lzdHJhdGlvbiBpcyBjbG9zZWQhJyxcclxuICAgICAgICBDTE9TRURfQU5EX0lOQ09NUExFVEVfVElUTEU6ICdVbmZvcnR1bmF0ZWx5LCByZWdpc3RyYXRpb24gaGFzIGNsb3NlZCwgYW5kIHRoZSBsb3R0ZXJ5IHByb2Nlc3MgaGFzIGJlZ3VuLicsXHJcbiAgICAgICAgQ0xPU0VEX0FORF9JTkNPTVBMRVRFOiAnQmVjYXVzZSB5b3UgaGF2ZSBub3QgY29tcGxldGVkIHlvdXIgcHJvZmlsZSBpbiB0aW1lLCB5b3Ugd2lsbCBub3QgYmUgZWxpZ2libGUgZm9yIHRoZSBsb3R0ZXJ5IHByb2Nlc3MuJyxcclxuICAgICAgICBBRE1JVFRFRF9BTkRfQ0FOX0NPTkZJUk1fVElUTEU6ICdZb3UgbXVzdCBjb25maXJtIGJ5IFtDT05GSVJNX0RFQURMSU5FXS4nLFxyXG4gICAgICAgIEFETUlUVEVEX0FORF9DQU5OT1RfQ09ORklSTV9USVRMRTogJ1lvdXIgY29uZmlybWF0aW9uIGRlYWRsaW5lIG9mIFtDT05GSVJNX0RFQURMSU5FXSBoYXMgcGFzc2VkLicsXHJcbiAgICAgICAgQURNSVRURURfQU5EX0NBTk5PVF9DT05GSVJNOiAnQWx0aG91Z2ggeW91IHdlcmUgYWNjZXB0ZWQsIHlvdSBkaWQgbm90IGNvbXBsZXRlIHlvdXIgY29uZmlybWF0aW9uIGluIHRpbWUuXFxuVW5mb3J0dW5hdGVseSwgdGhpcyBtZWFucyB0aGF0IHlvdSB3aWxsIG5vdCBiZSBhYmxlIHRvIGF0dGVuZCB0aGUgZXZlbnQsIGFzIHdlIG11c3QgYmVnaW4gdG8gYWNjZXB0IG90aGVyIGFwcGxpY2FudHMgb24gdGhlIHdhaXRsaXN0LlxcbldlIGhvcGUgdG8gc2VlIHlvdSBhZ2FpbiBuZXh0IHllYXIhJyxcclxuICAgICAgICBDT05GSVJNRURfTk9UX1BBU1RfVElUTEU6ICdZb3UgY2FuIGVkaXQgeW91ciBjb25maXJtYXRpb24gaW5mb3JtYXRpb24gdW50aWwgW0NPTkZJUk1fREVBRExJTkVdJyxcclxuICAgICAgICBERUNMSU5FRDogJ1dlXFwncmUgc29ycnkgdG8gaGVhciB0aGF0IHlvdSB3b25cXCd0IGJlIGFibGUgdG8gbWFrZSBpdCB0byBIYWNraXQgMjAyMCEgOihcXG5NYXliZSBuZXh0IHllYXIhIFdlIGhvcGUgeW91IHNlZSB5b3UgYWdhaW4gc29vbi4nLFxyXG4gICAgfSlcclxuICAgIC5jb25zdGFudCgnVEVBTScse1xyXG4gICAgICAgIE5PX1RFQU1fUkVHX0NMT1NFRDogJ1VuZm9ydHVuYXRlbHksIGl0XFwncyB0b28gbGF0ZSB0byBlbnRlciB0aGUgbG90dGVyeSB3aXRoIGEgdGVhbS5cXG5Ib3dldmVyLCB5b3UgY2FuIHN0aWxsIGZvcm0gdGVhbXMgb24geW91ciBvd24gYmVmb3JlIG9yIGR1cmluZyB0aGUgZXZlbnQhJyxcclxuICAgIH0pO1xyXG4iLCJcclxuYW5ndWxhci5tb2R1bGUoJ3JlZycpXHJcbiAgLmNvbmZpZyhbXHJcbiAgICAnJHN0YXRlUHJvdmlkZXInLFxyXG4gICAgJyR1cmxSb3V0ZXJQcm92aWRlcicsXHJcbiAgICAnJGxvY2F0aW9uUHJvdmlkZXInLFxyXG4gICAgZnVuY3Rpb24oXHJcbiAgICAgICRzdGF0ZVByb3ZpZGVyLFxyXG4gICAgICAkdXJsUm91dGVyUHJvdmlkZXIsXHJcbiAgICAgICRsb2NhdGlvblByb3ZpZGVyKSB7XHJcblxyXG4gICAgLy8gRm9yIGFueSB1bm1hdGNoZWQgdXJsLCByZWRpcmVjdCB0byAvc3RhdGUxXHJcbiAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKFwiLzQwNFwiKTtcclxuICAgIFxyXG4gICAgLy8gU2V0IHVwIGRlIHN0YXRlc1xyXG4gICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgLnN0YXRlKCdsb2dpbicsIHtcclxuICAgICAgICB1cmw6IFwiL2xvZ2luXCIsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvbG9naW4vbG9naW4uaHRtbFwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIHJlcXVpcmVMb2dpbjogZmFsc2UsXHJcbiAgICAgICAgICByZXF1aXJlTG9nb3V0OiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICAnc2V0dGluZ3MnOiBmdW5jdGlvbihTZXR0aW5nc1NlcnZpY2Upe1xyXG4gICAgICAgICAgICByZXR1cm4gU2V0dGluZ3NTZXJ2aWNlLmdldFB1YmxpY1NldHRpbmdzKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICAuc3RhdGUoJ2hvbWUnLCB7XHJcbiAgICAgICAgdXJsOiBcIi9cIixcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9sb2dpbi9sb2dpbi5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ0xvZ2luQ3RybCcsXHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgcmVxdWlyZUxvZ2luOiBmYWxzZSxcclxuICAgICAgICAgIHJlcXVpcmVMb2dvdXQ6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICdzZXR0aW5ncyc6IGZ1bmN0aW9uKFNldHRpbmdzU2VydmljZSl7XHJcbiAgICAgICAgICAgIHJldHVybiBTZXR0aW5nc1NlcnZpY2UuZ2V0UHVibGljU2V0dGluZ3MoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcblxyXG4gICAgICAvLyAuc3RhdGUoJ2hvbWUnLCB7XHJcbiAgICAgIC8vICAgdXJsOiBcIi9cIixcclxuICAgICAgLy8gICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9ob21lL2hvbWUuaHRtbFwiLFxyXG4gICAgICAvLyAgIGNvbnRyb2xsZXI6ICdIb21lQ3RybCcsXHJcbiAgICAgIC8vICAgZGF0YToge1xyXG4gICAgICAvLyAgICAgcmVxdWlyZUxvZ2luOiBmYWxzZVxyXG4gICAgICAvLyAgIH0sXHJcbiAgICAgIC8vICAgcmVzb2x2ZToge1xyXG4gICAgICAvLyAgICAgJ3NldHRpbmdzJzogZnVuY3Rpb24oU2V0dGluZ3NTZXJ2aWNlKXtcclxuICAgICAgLy8gICAgICAgcmV0dXJuIFNldHRpbmdzU2VydmljZS5nZXRQdWJsaWNTZXR0aW5ncygpO1xyXG4gICAgICAvLyAgICAgfVxyXG4gICAgICAvLyAgIH1cclxuICAgICAgLy8gfSlcclxuXHJcbiAgICAgIC5zdGF0ZSgnYXBwJywge1xyXG4gICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAnJzoge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9iYXNlLmh0bWxcIixcclxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJCYXNlQ3RybFwiLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgICdzaWRlYmFyQGFwcCc6IHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3Mvc2lkZWJhci9zaWRlYmFyLmh0bWxcIixcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ1NpZGViYXJDdHJsJyxcclxuICAgICAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgICAgIHNldHRpbmdzOiBmdW5jdGlvbihTZXR0aW5nc1NlcnZpY2UpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBTZXR0aW5nc1NlcnZpY2UuZ2V0UHVibGljU2V0dGluZ3MoKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIHJlcXVpcmVMb2dpbjogdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgLnN0YXRlKCdhcHAuZGFzaGJvYXJkJywge1xyXG4gICAgICAgIHVybDogXCIvZGFzaGJvYXJkXCIsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvZGFzaGJvYXJkL2Rhc2hib2FyZC5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ0Rhc2hib2FyZEN0cmwnLFxyXG4gICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgIGN1cnJlbnRVc2VyOiBmdW5jdGlvbihVc2VyU2VydmljZSl7XHJcbiAgICAgICAgICAgIHJldHVybiBVc2VyU2VydmljZS5nZXRDdXJyZW50VXNlcigpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHNldHRpbmdzOiBmdW5jdGlvbihTZXR0aW5nc1NlcnZpY2Upe1xyXG4gICAgICAgICAgICByZXR1cm4gU2V0dGluZ3NTZXJ2aWNlLmdldFB1YmxpY1NldHRpbmdzKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgfSlcclxuICAgICAgLnN0YXRlKCdhcHAuYXBwbGljYXRpb24nLCB7XHJcbiAgICAgICAgdXJsOiBcIi9hcHBsaWNhdGlvblwiLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uLmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiAnQXBwbGljYXRpb25DdHJsJyxcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICByZXF1aXJlVmVyaWZpZWQ6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgIGN1cnJlbnRVc2VyOiBmdW5jdGlvbihVc2VyU2VydmljZSl7XHJcbiAgICAgICAgICAgIHJldHVybiBVc2VyU2VydmljZS5nZXRDdXJyZW50VXNlcigpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHNldHRpbmdzOiBmdW5jdGlvbihTZXR0aW5nc1NlcnZpY2Upe1xyXG4gICAgICAgICAgICByZXR1cm4gU2V0dGluZ3NTZXJ2aWNlLmdldFB1YmxpY1NldHRpbmdzKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICAuc3RhdGUoJ2FwcC5jb25maXJtYXRpb24nLCB7XHJcbiAgICAgICAgdXJsOiBcIi9jb25maXJtYXRpb25cIixcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb25maXJtYXRpb24vY29uZmlybWF0aW9uLmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiAnQ29uZmlybWF0aW9uQ3RybCcsXHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgcmVxdWlyZUFkbWl0dGVkOiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICBjdXJyZW50VXNlcjogZnVuY3Rpb24oVXNlclNlcnZpY2Upe1xyXG4gICAgICAgICAgICByZXR1cm4gVXNlclNlcnZpY2UuZ2V0Q3VycmVudFVzZXIoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgnYXBwLmNoYWxsZW5nZXMnLCB7XHJcbiAgICAgICAgdXJsOiBcIi9jaGFsbGVuZ2VzXCIsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvY2hhbGxlbmdlcy9jaGFsbGVuZ2VzLmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiAnQ2hhbGxlbmdlc0N0cmwnLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIHJlcXVpcmVWZXJpZmllZDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgY3VycmVudFVzZXI6IGZ1bmN0aW9uKFVzZXJTZXJ2aWNlKXtcclxuICAgICAgICAgICAgcmV0dXJuIFVzZXJTZXJ2aWNlLmdldEN1cnJlbnRVc2VyKCk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgc2V0dGluZ3M6IGZ1bmN0aW9uKFNldHRpbmdzU2VydmljZSl7XHJcbiAgICAgICAgICAgIHJldHVybiBTZXR0aW5nc1NlcnZpY2UuZ2V0UHVibGljU2V0dGluZ3MoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgnYXBwLnRlYW0nLCB7XHJcbiAgICAgICAgdXJsOiBcIi90ZWFtXCIsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvdGVhbS90ZWFtLmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiAnVGVhbUN0cmwnLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIHJlcXVpcmVWZXJpZmllZDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgY3VycmVudFVzZXI6IGZ1bmN0aW9uKFVzZXJTZXJ2aWNlKXtcclxuICAgICAgICAgICAgcmV0dXJuIFVzZXJTZXJ2aWNlLmdldEN1cnJlbnRVc2VyKCk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgc2V0dGluZ3M6IGZ1bmN0aW9uKFNldHRpbmdzU2VydmljZSl7XHJcbiAgICAgICAgICAgIHJldHVybiBTZXR0aW5nc1NlcnZpY2UuZ2V0UHVibGljU2V0dGluZ3MoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgnYXBwLmFkbWluJywge1xyXG4gICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAnJzoge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9hZG1pbi9hZG1pbi5odG1sXCIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdhZG1pbkN0cmwnXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICByZXF1aXJlQWRtaW46IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgnYXBwLmNoZWNraW4nLCB7XHJcbiAgICAgICAgdXJsOiAnL2NoZWNraW4nLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY2hlY2tpbi9jaGVja2luLmh0bWwnLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdDaGVja2luQ3RybCcsXHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgcmVxdWlyZVZvbHVudGVlcjogdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgLnN0YXRlKCdhcHAuYWRtaW4uc3RhdHMnLCB7XHJcbiAgICAgICAgdXJsOiBcIi9hZG1pblwiLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2FkbWluL3N0YXRzL3N0YXRzLmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiAnQWRtaW5TdGF0c0N0cmwnXHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgnYXBwLmFkbWluLm1haWwnLCB7XHJcbiAgICAgICAgdXJsOiBcIi9hZG1pbi9tYWlsXCIsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvYWRtaW4vbWFpbC9tYWlsLmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiAnQWRtaW5NYWlsQ3RybCdcclxuICAgICAgfSlcclxuICAgICAgLnN0YXRlKCdhcHAuYWRtaW4uY2hhbGxlbmdlcycsIHtcclxuICAgICAgICB1cmw6IFwiL2FkbWluL2NoYWxsZW5nZXNcIixcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9hZG1pbi9jaGFsbGVuZ2VzL2NoYWxsZW5nZXMuaHRtbFwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdhZG1pbkNoYWxsZW5nZXNDdHJsJ1xyXG4gICAgICB9KVxyXG4gICAgICAuc3RhdGUoJ2FwcC5hZG1pbi5jaGFsbGVuZ2UnLCB7XHJcbiAgICAgICAgdXJsOiBcIi9hZG1pbi9jaGFsbGVuZ2VzLzppZFwiLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2FkbWluL2NoYWxsZW5nZS9jaGFsbGVuZ2UuaHRtbFwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdhZG1pbkNoYWxsZW5nZUN0cmwnLFxyXG4gICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICdjaGFsbGVuZ2UnOiBmdW5jdGlvbigkc3RhdGVQYXJhbXMsIENoYWxsZW5nZVNlcnZpY2Upe1xyXG4gICAgICAgICAgICByZXR1cm4gQ2hhbGxlbmdlU2VydmljZS5nZXQoJHN0YXRlUGFyYW1zLmlkKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgnYXBwLmFkbWluLm1hcmtldGluZycsIHtcclxuICAgICAgICB1cmw6IFwiL2FkbWluL21hcmtldGluZ1wiLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2FkbWluL21hcmtldGluZy9tYXJrZXRpbmcuaHRtbFwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdhZG1pbk1hcmtldGluZ0N0cmwnXHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgnYXBwLmFkbWluLnVzZXJzJywge1xyXG4gICAgICAgIHVybDogXCIvYWRtaW4vdXNlcnM/XCIgK1xyXG4gICAgICAgICAgJyZwYWdlJyArXHJcbiAgICAgICAgICAnJnNpemUnICtcclxuICAgICAgICAgICcmcXVlcnknLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2FkbWluL3VzZXJzL3VzZXJzLmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiAnQWRtaW5Vc2Vyc0N0cmwnXHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgnYXBwLmFkbWluLnVzZXInLCB7XHJcbiAgICAgICAgdXJsOiBcIi9hZG1pbi91c2Vycy86aWRcIixcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9hZG1pbi91c2VyL3VzZXIuaHRtbFwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdBZG1pblVzZXJDdHJsJyxcclxuICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICAndXNlcic6IGZ1bmN0aW9uKCRzdGF0ZVBhcmFtcywgVXNlclNlcnZpY2Upe1xyXG4gICAgICAgICAgICByZXR1cm4gVXNlclNlcnZpY2UuZ2V0KCRzdGF0ZVBhcmFtcy5pZCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICAuc3RhdGUoJ2FwcC5hZG1pbi5zZXR0aW5ncycsIHtcclxuICAgICAgICB1cmw6IFwiL2FkbWluL3NldHRpbmdzXCIsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvYWRtaW4vc2V0dGluZ3Mvc2V0dGluZ3MuaHRtbFwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdBZG1pblNldHRpbmdzQ3RybCcsXHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgnYXBwLmFkbWluLnRlYW1zJywge1xyXG4gICAgICAgIHVybDogXCIvYWRtaW4vdGVhbXNcIixcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9hZG1pbi90ZWFtcy90ZWFtcy5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ0FkbWluVGVhbUN0cmwnLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIHJlcXVpcmVWZXJpZmllZDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgY3VycmVudFVzZXI6IGZ1bmN0aW9uKFVzZXJTZXJ2aWNlKXtcclxuICAgICAgICAgICAgcmV0dXJuIFVzZXJTZXJ2aWNlLmdldEN1cnJlbnRVc2VyKCk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgc2V0dGluZ3M6IGZ1bmN0aW9uKFNldHRpbmdzU2VydmljZSl7XHJcbiAgICAgICAgICAgIHJldHVybiBTZXR0aW5nc1NlcnZpY2UuZ2V0UHVibGljU2V0dGluZ3MoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgncmVzZXQnLCB7XHJcbiAgICAgICAgdXJsOiBcIi9yZXNldC86dG9rZW5cIixcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9yZXNldC9yZXNldC5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ1Jlc2V0Q3RybCcsXHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgcmVxdWlyZUxvZ2luOiBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgLnN0YXRlKCd2ZXJpZnknLCB7XHJcbiAgICAgICAgdXJsOiBcIi92ZXJpZnkvOnRva2VuXCIsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvdmVyaWZ5L3ZlcmlmeS5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ1ZlcmlmeUN0cmwnLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIHJlcXVpcmVMb2dpbjogZmFsc2VcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgnNDA0Jywge1xyXG4gICAgICAgIHVybDogXCIvNDA0XCIsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvNDA0Lmh0bWxcIixcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICByZXF1aXJlTG9naW46IGZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUoe1xyXG4gICAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgfSk7XHJcblxyXG4gIH1dKVxyXG4gIC5ydW4oW1xyXG4gICAgJyRyb290U2NvcGUnLFxyXG4gICAgJyRzdGF0ZScsXHJcbiAgICAnU2Vzc2lvbicsXHJcbiAgICBmdW5jdGlvbihcclxuICAgICAgJHJvb3RTY29wZSxcclxuICAgICAgJHN0YXRlLFxyXG4gICAgICBTZXNzaW9uICl7XHJcblxyXG4gICAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3VjY2VzcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AgPSAwO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMpIHtcclxuXHJcbiAgICAgICAgdmFyIHJlcXVpcmVMb2dpbiA9IHRvU3RhdGUuZGF0YS5yZXF1aXJlTG9naW47XHJcbiAgICAgICAgdmFyIHJlcXVpcmVMb2dvdXQgPSB0b1N0YXRlLmRhdGEucmVxdWlyZUxvZ291dDtcclxuICAgICAgICB2YXIgcmVxdWlyZUFkbWluID0gdG9TdGF0ZS5kYXRhLnJlcXVpcmVBZG1pbjtcclxuICAgICAgICB2YXIgcmVxdWlyZVZvbHVudGVlciA9IHRvU3RhdGUuZGF0YS5yZXF1aXJlVm9sdW50ZWVyO1xyXG4gICAgICAgIHZhciByZXF1aXJlVmVyaWZpZWQgPSB0b1N0YXRlLmRhdGEucmVxdWlyZVZlcmlmaWVkO1xyXG4gICAgICAgIHZhciByZXF1aXJlQWRtaXR0ZWQgPSB0b1N0YXRlLmRhdGEucmVxdWlyZUFkbWl0dGVkO1xyXG4gIFxyXG4gICAgICAgIGlmIChyZXF1aXJlTG9naW4gJiYgIVNlc3Npb24uZ2V0VG9rZW4oKSkge1xyXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICRzdGF0ZS5nbygnaG9tZScpO1xyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICBpZiAocmVxdWlyZUxvZ291dCAmJiBTZXNzaW9uLmdldFRva2VuKCkpIHtcclxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5kYXNoYm9hcmQnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHJlcXVpcmVBZG1pbiAmJiAhU2Vzc2lvbi5nZXRVc2VyKCkuYWRtaW4pIHtcclxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7ICAgICAgICAgICBcclxuICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmRhc2hib2FyZCcpO1xyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICBpZiAocmVxdWlyZVZvbHVudGVlciAmJiAhU2Vzc2lvbi5nZXRVc2VyKCkudm9sdW50ZWVyICYmIHJlcXVpcmVBZG1pbiAmJiAhU2Vzc2lvbi5nZXRVc2VyKCkuYWRtaW4pIHtcclxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7ICAgICAgICAgICBcclxuICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmRhc2hib2FyZCcpO1xyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICBpZiAocmVxdWlyZVZlcmlmaWVkICYmICFTZXNzaW9uLmdldFVzZXIoKS52ZXJpZmllZCkge1xyXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTsgICAgICAgICAgIFxyXG4gICAgICAgICAgJHN0YXRlLmdvKCdhcHAuZGFzaGJvYXJkJyk7XHJcbiAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgIGlmIChyZXF1aXJlQWRtaXR0ZWQgJiYgIVNlc3Npb24uZ2V0VXNlcigpLnN0YXR1cy5hZG1pdHRlZCkge1xyXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTsgICAgICAgICAgIFxyXG4gICAgICAgICAgJHN0YXRlLmdvKCdhcHAuZGFzaGJvYXJkJyk7XHJcbiAgICAgICAgfVxyXG4gIFxyXG5cclxuICAgICAgfSk7XHJcblxyXG4gICAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcclxuICAuZmFjdG9yeSgnQXV0aEludGVyY2VwdG9yJywgW1xyXG4gICAgJ1Nlc3Npb24nLFxyXG4gICAgZnVuY3Rpb24oU2Vzc2lvbil7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICByZXF1ZXN0OiBmdW5jdGlvbihjb25maWcpe1xyXG4gICAgICAgICAgICB2YXIgdG9rZW4gPSBTZXNzaW9uLmdldFRva2VuKCk7XHJcbiAgICAgICAgICAgIGlmICh0b2tlbil7XHJcbiAgICAgICAgICAgICAgY29uZmlnLmhlYWRlcnNbJ3gtYWNjZXNzLXRva2VuJ10gPSB0b2tlbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gY29uZmlnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5zZXJ2aWNlKCdTZXNzaW9uJywgW1xyXG4gICAgJyRyb290U2NvcGUnLFxyXG4gICAgJyR3aW5kb3cnLFxyXG4gICAgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHdpbmRvdyl7XHJcblxyXG4gICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbih0b2tlbiwgdXNlcil7XHJcbiAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLmp3dCA9IHRva2VuO1xyXG4gICAgICAkd2luZG93LmxvY2FsU3RvcmFnZS51c2VySWQgPSB1c2VyLl9pZDtcclxuICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2UuY3VycmVudFVzZXIgPSBKU09OLnN0cmluZ2lmeSh1c2VyKTtcclxuICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IHVzZXI7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuZGVzdHJveSA9IGZ1bmN0aW9uKG9uQ29tcGxldGUpe1xyXG4gICAgICBkZWxldGUgJHdpbmRvdy5sb2NhbFN0b3JhZ2Uuand0O1xyXG4gICAgICBkZWxldGUgJHdpbmRvdy5sb2NhbFN0b3JhZ2UudXNlcklkO1xyXG4gICAgICBkZWxldGUgJHdpbmRvdy5sb2NhbFN0b3JhZ2UuY3VycmVudFVzZXI7XHJcbiAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSBudWxsO1xyXG4gICAgICBpZiAob25Db21wbGV0ZSl7XHJcbiAgICAgICAgb25Db21wbGV0ZSgpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuZ2V0VG9rZW4gPSBmdW5jdGlvbigpe1xyXG4gICAgICByZXR1cm4gJHdpbmRvdy5sb2NhbFN0b3JhZ2Uuand0O1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmdldFVzZXJJZCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgIHJldHVybiAkd2luZG93LmxvY2FsU3RvcmFnZS51c2VySWQ7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuZ2V0VXNlciA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKCR3aW5kb3cubG9jYWxTdG9yYWdlLmN1cnJlbnRVc2VyKTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5zZXRVc2VyID0gZnVuY3Rpb24odXNlcil7XHJcbiAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLmN1cnJlbnRVc2VyID0gSlNPTi5zdHJpbmdpZnkodXNlcik7XHJcbiAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSB1c2VyO1xyXG4gICAgfTtcclxuXHJcbiAgfV0pOyIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5mYWN0b3J5KCdVdGlscycsIFtcclxuICAgIGZ1bmN0aW9uKCl7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgaXNSZWdPcGVuOiBmdW5jdGlvbihzZXR0aW5ncyl7XHJcbiAgICAgICAgICByZXR1cm4gRGF0ZS5ub3coKSA+IHNldHRpbmdzLnRpbWVPcGVuICYmIERhdGUubm93KCkgPCBzZXR0aW5ncy50aW1lQ2xvc2U7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBpc0FmdGVyOiBmdW5jdGlvbih0aW1lKXtcclxuICAgICAgICAgIHJldHVybiBEYXRlLm5vdygpID4gdGltZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZvcm1hdFRpbWU6IGZ1bmN0aW9uKHRpbWUpe1xyXG5cclxuICAgICAgICAgIGlmICghdGltZSl7XHJcbiAgICAgICAgICAgIHJldHVybiBcIkludmFsaWQgRGF0ZVwiO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGRhdGUgPSBuZXcgRGF0ZSh0aW1lKTtcclxuICAgICAgICAgIC8vIEhhY2sgZm9yIHRpbWV6b25lXHJcbiAgICAgICAgICByZXR1cm4gbW9tZW50KGRhdGUpLmZvcm1hdCgnZGRkZCwgTU1NTSBEbyBZWVlZLCBoOm1tIGEnKSArXHJcbiAgICAgICAgICAgIFwiIFwiICsgZGF0ZS50b1RpbWVTdHJpbmcoKS5zcGxpdCgnICcpWzJdO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcbiAgICB9XSk7XHJcbiIsIihmdW5jdGlvbigkKSB7XHJcbiAgICBqUXVlcnkuZm4uZXh0ZW5kKHtcclxuICAgICAgICBodG1sNV9xcmNvZGU6IGZ1bmN0aW9uKHFyY29kZVN1Y2Nlc3MsIHFyY29kZUVycm9yLCB2aWRlb0Vycm9yKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudEVsZW0gPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBoZWlnaHQgPSBjdXJyZW50RWxlbS5oZWlnaHQoKTtcclxuICAgICAgICAgICAgICAgIHZhciB3aWR0aCA9IGN1cnJlbnRFbGVtLndpZHRoKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGhlaWdodCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0ID0gMjUwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh3aWR0aCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGggPSAzMDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gdmFyIHZpZEVsZW0gPSAkKCc8dmlkZW8gd2lkdGg9XCInICsgd2lkdGggKyAncHhcIiBoZWlnaHQ9XCInICsgaGVpZ2h0ICsgJ3B4XCI+PC92aWRlbz4nKS5hcHBlbmRUbyhjdXJyZW50RWxlbSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmlkRWxlbSA9ICQoJzx2aWRlbyB3aWR0aD1cIicgKyB3aWR0aCArICdweFwiIGhlaWdodD1cIicgKyBoZWlnaHQgKyAncHhcIiBhdXRvcGxheSBwbGF5c2lubGluZT48L3ZpZGVvPicpLmFwcGVuZFRvKGN1cnJlbnRFbGVtKTtcclxuICAgICAgICAgICAgICAgIHZhciBjYW52YXNFbGVtID0gJCgnPGNhbnZhcyBpZD1cInFyLWNhbnZhc1wiIHdpZHRoPVwiJyArICh3aWR0aCAtIDIpICsgJ3B4XCIgaGVpZ2h0PVwiJyArIChoZWlnaHQgLSAyKSArICdweFwiIHN0eWxlPVwiZGlzcGxheTpub25lO1wiPjwvY2FudmFzPicpLmFwcGVuZFRvKGN1cnJlbnRFbGVtKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdmlkZW8gPSB2aWRFbGVtWzBdO1xyXG4gICAgICAgICAgICAgICAgdmFyIGNhbnZhcyA9IGNhbnZhc0VsZW1bMF07XHJcbiAgICAgICAgICAgICAgICB2YXIgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxvY2FsTWVkaWFTdHJlYW07XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHNjYW4gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobG9jYWxNZWRpYVN0cmVhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmRyYXdJbWFnZSh2aWRlbywgMCwgMCwgMzA3LCAyNTApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHFyY29kZS5kZWNvZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcXJjb2RlRXJyb3IoZSwgbG9jYWxNZWRpYVN0cmVhbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQuZGF0YShjdXJyZW50RWxlbVswXSwgXCJ0aW1lb3V0XCIsIHNldFRpbWVvdXQoc2NhbiwgNTAwKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQuZGF0YShjdXJyZW50RWxlbVswXSwgXCJ0aW1lb3V0XCIsIHNldFRpbWVvdXQoc2NhbiwgNTAwKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTsvL2VuZCBzbmFwc2hvdCBmdW5jdGlvblxyXG5cclxuICAgICAgICAgICAgICAgIHdpbmRvdy5VUkwgPSB3aW5kb3cuVVJMIHx8IHdpbmRvdy53ZWJraXRVUkwgfHwgd2luZG93Lm1velVSTCB8fCB3aW5kb3cubXNVUkw7XHJcbiAgICAgICAgICAgICAgICBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhID0gbmF2aWdhdG9yLmdldFVzZXJNZWRpYSB8fCBuYXZpZ2F0b3Iud2Via2l0R2V0VXNlck1lZGlhIHx8IG5hdmlnYXRvci5tb3pHZXRVc2VyTWVkaWEgfHwgbmF2aWdhdG9yLm1zR2V0VXNlck1lZGlhO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzdWNjZXNzQ2FsbGJhY2sgPSBmdW5jdGlvbihzdHJlYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyB2aWRlby5zcmMgPSAod2luZG93LlVSTCAmJiB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChzdHJlYW0pKSB8fCBzdHJlYW07XHJcbiAgICAgICAgICAgICAgICAgICAgdmlkZW8uc3JjT2JqZWN0ID0gc3RyZWFtO1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsTWVkaWFTdHJlYW0gPSBzdHJlYW07XHJcbiAgICAgICAgICAgICAgICAgICAgJC5kYXRhKGN1cnJlbnRFbGVtWzBdLCBcInN0cmVhbVwiLCBzdHJlYW0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2aWRlby5wbGF5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJC5kYXRhKGN1cnJlbnRFbGVtWzBdLCBcInRpbWVvdXRcIiwgc2V0VGltZW91dChzY2FuLCAxMDAwKSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIENhbGwgdGhlIGdldFVzZXJNZWRpYSBtZXRob2Qgd2l0aCBvdXIgY2FsbGJhY2sgZnVuY3Rpb25zXHJcbiAgICAgICAgICAgICAgICBpZiAobmF2aWdhdG9yLmdldFVzZXJNZWRpYSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEoe3ZpZGVvOiB7IGZhY2luZ01vZGU6IFwiZW52aXJvbm1lbnRcIiB9IH0sIHN1Y2Nlc3NDYWxsYmFjaywgZnVuY3Rpb24oZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmlkZW9FcnJvcihlcnJvciwgbG9jYWxNZWRpYVN0cmVhbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdOYXRpdmUgd2ViIGNhbWVyYSBzdHJlYW1pbmcgKGdldFVzZXJNZWRpYSkgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXIuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRGlzcGxheSBhIGZyaWVuZGx5IFwic29ycnlcIiBtZXNzYWdlIHRvIHRoZSB1c2VyXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcXJjb2RlLmNhbGxiYWNrID0gZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHFyY29kZVN1Y2Nlc3MocmVzdWx0LCBsb2NhbE1lZGlhU3RyZWFtKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0pOyAvLyBlbmQgb2YgaHRtbDVfcXJjb2RlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBodG1sNV9xcmNvZGVfc3RvcDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAvL3N0b3AgdGhlIHN0cmVhbSBhbmQgY2FuY2VsIHRpbWVvdXRzXHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmRhdGEoJ3N0cmVhbScpLmdldFZpZGVvVHJhY2tzKCkuZm9yRWFjaChmdW5jdGlvbih2aWRlb1RyYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlkZW9UcmFjay5zdG9wKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoJCh0aGlzKS5kYXRhKCd0aW1lb3V0JykpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufSkoalF1ZXJ5KTtcclxuXHJcbiIsImZ1bmN0aW9uIEVDQihjb3VudCxkYXRhQ29kZXdvcmRzKXt0aGlzLmNvdW50PWNvdW50LHRoaXMuZGF0YUNvZGV3b3Jkcz1kYXRhQ29kZXdvcmRzLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkNvdW50XCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5jb3VudH0pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkRhdGFDb2Rld29yZHNcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmRhdGFDb2Rld29yZHN9KX1mdW5jdGlvbiBFQ0Jsb2NrcyhlY0NvZGV3b3Jkc1BlckJsb2NrLGVjQmxvY2tzMSxlY0Jsb2NrczIpe3RoaXMuZWNDb2Rld29yZHNQZXJCbG9jaz1lY0NvZGV3b3Jkc1BlckJsb2NrLGVjQmxvY2tzMj90aGlzLmVjQmxvY2tzPW5ldyBBcnJheShlY0Jsb2NrczEsZWNCbG9ja3MyKTp0aGlzLmVjQmxvY2tzPW5ldyBBcnJheShlY0Jsb2NrczEpLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkVDQ29kZXdvcmRzUGVyQmxvY2tcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmVjQ29kZXdvcmRzUGVyQmxvY2t9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJUb3RhbEVDQ29kZXdvcmRzXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5lY0NvZGV3b3Jkc1BlckJsb2NrKnRoaXMuTnVtQmxvY2tzfSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiTnVtQmxvY2tzXCIsZnVuY3Rpb24oKXtmb3IodmFyIHRvdGFsPTAsaT0wO2k8dGhpcy5lY0Jsb2Nrcy5sZW5ndGg7aSsrKXRvdGFsKz10aGlzLmVjQmxvY2tzW2ldLmxlbmd0aDtyZXR1cm4gdG90YWx9KSx0aGlzLmdldEVDQmxvY2tzPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZWNCbG9ja3N9fWZ1bmN0aW9uIFZlcnNpb24odmVyc2lvbk51bWJlcixhbGlnbm1lbnRQYXR0ZXJuQ2VudGVycyxlY0Jsb2NrczEsZWNCbG9ja3MyLGVjQmxvY2tzMyxlY0Jsb2NrczQpe3RoaXMudmVyc2lvbk51bWJlcj12ZXJzaW9uTnVtYmVyLHRoaXMuYWxpZ25tZW50UGF0dGVybkNlbnRlcnM9YWxpZ25tZW50UGF0dGVybkNlbnRlcnMsdGhpcy5lY0Jsb2Nrcz1uZXcgQXJyYXkoZWNCbG9ja3MxLGVjQmxvY2tzMixlY0Jsb2NrczMsZWNCbG9ja3M0KTtmb3IodmFyIHRvdGFsPTAsZWNDb2Rld29yZHM9ZWNCbG9ja3MxLkVDQ29kZXdvcmRzUGVyQmxvY2ssZWNiQXJyYXk9ZWNCbG9ja3MxLmdldEVDQmxvY2tzKCksaT0wO2k8ZWNiQXJyYXkubGVuZ3RoO2krKyl7dmFyIGVjQmxvY2s9ZWNiQXJyYXlbaV07dG90YWwrPWVjQmxvY2suQ291bnQqKGVjQmxvY2suRGF0YUNvZGV3b3JkcytlY0NvZGV3b3Jkcyl9dGhpcy50b3RhbENvZGV3b3Jkcz10b3RhbCx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJWZXJzaW9uTnVtYmVyXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy52ZXJzaW9uTnVtYmVyfSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiQWxpZ25tZW50UGF0dGVybkNlbnRlcnNcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmFsaWdubWVudFBhdHRlcm5DZW50ZXJzfSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiVG90YWxDb2Rld29yZHNcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLnRvdGFsQ29kZXdvcmRzfSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiRGltZW5zaW9uRm9yVmVyc2lvblwiLGZ1bmN0aW9uKCl7cmV0dXJuIDE3KzQqdGhpcy52ZXJzaW9uTnVtYmVyfSksdGhpcy5idWlsZEZ1bmN0aW9uUGF0dGVybj1mdW5jdGlvbigpe3ZhciBkaW1lbnNpb249dGhpcy5EaW1lbnNpb25Gb3JWZXJzaW9uLGJpdE1hdHJpeD1uZXcgQml0TWF0cml4KGRpbWVuc2lvbik7Yml0TWF0cml4LnNldFJlZ2lvbigwLDAsOSw5KSxiaXRNYXRyaXguc2V0UmVnaW9uKGRpbWVuc2lvbi04LDAsOCw5KSxiaXRNYXRyaXguc2V0UmVnaW9uKDAsZGltZW5zaW9uLTgsOSw4KTtmb3IodmFyIG1heD10aGlzLmFsaWdubWVudFBhdHRlcm5DZW50ZXJzLmxlbmd0aCx4PTA7bWF4Png7eCsrKWZvcih2YXIgaT10aGlzLmFsaWdubWVudFBhdHRlcm5DZW50ZXJzW3hdLTIseT0wO21heD55O3krKykwPT14JiYoMD09eXx8eT09bWF4LTEpfHx4PT1tYXgtMSYmMD09eXx8Yml0TWF0cml4LnNldFJlZ2lvbih0aGlzLmFsaWdubWVudFBhdHRlcm5DZW50ZXJzW3ldLTIsaSw1LDUpO3JldHVybiBiaXRNYXRyaXguc2V0UmVnaW9uKDYsOSwxLGRpbWVuc2lvbi0xNyksYml0TWF0cml4LnNldFJlZ2lvbig5LDYsZGltZW5zaW9uLTE3LDEpLHRoaXMudmVyc2lvbk51bWJlcj42JiYoYml0TWF0cml4LnNldFJlZ2lvbihkaW1lbnNpb24tMTEsMCwzLDYpLGJpdE1hdHJpeC5zZXRSZWdpb24oMCxkaW1lbnNpb24tMTEsNiwzKSksYml0TWF0cml4fSx0aGlzLmdldEVDQmxvY2tzRm9yTGV2ZWw9ZnVuY3Rpb24oZWNMZXZlbCl7cmV0dXJuIHRoaXMuZWNCbG9ja3NbZWNMZXZlbC5vcmRpbmFsKCldfX1mdW5jdGlvbiBidWlsZFZlcnNpb25zKCl7cmV0dXJuIG5ldyBBcnJheShuZXcgVmVyc2lvbigxLG5ldyBBcnJheSxuZXcgRUNCbG9ja3MoNyxuZXcgRUNCKDEsMTkpKSxuZXcgRUNCbG9ja3MoMTAsbmV3IEVDQigxLDE2KSksbmV3IEVDQmxvY2tzKDEzLG5ldyBFQ0IoMSwxMykpLG5ldyBFQ0Jsb2NrcygxNyxuZXcgRUNCKDEsOSkpKSxuZXcgVmVyc2lvbigyLG5ldyBBcnJheSg2LDE4KSxuZXcgRUNCbG9ja3MoMTAsbmV3IEVDQigxLDM0KSksbmV3IEVDQmxvY2tzKDE2LG5ldyBFQ0IoMSwyOCkpLG5ldyBFQ0Jsb2NrcygyMixuZXcgRUNCKDEsMjIpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigxLDE2KSkpLG5ldyBWZXJzaW9uKDMsbmV3IEFycmF5KDYsMjIpLG5ldyBFQ0Jsb2NrcygxNSxuZXcgRUNCKDEsNTUpKSxuZXcgRUNCbG9ja3MoMjYsbmV3IEVDQigxLDQ0KSksbmV3IEVDQmxvY2tzKDE4LG5ldyBFQ0IoMiwxNykpLG5ldyBFQ0Jsb2NrcygyMixuZXcgRUNCKDIsMTMpKSksbmV3IFZlcnNpb24oNCxuZXcgQXJyYXkoNiwyNiksbmV3IEVDQmxvY2tzKDIwLG5ldyBFQ0IoMSw4MCkpLG5ldyBFQ0Jsb2NrcygxOCxuZXcgRUNCKDIsMzIpKSxuZXcgRUNCbG9ja3MoMjYsbmV3IEVDQigyLDI0KSksbmV3IEVDQmxvY2tzKDE2LG5ldyBFQ0IoNCw5KSkpLG5ldyBWZXJzaW9uKDUsbmV3IEFycmF5KDYsMzApLG5ldyBFQ0Jsb2NrcygyNixuZXcgRUNCKDEsMTA4KSksbmV3IEVDQmxvY2tzKDI0LG5ldyBFQ0IoMiw0MykpLG5ldyBFQ0Jsb2NrcygxOCxuZXcgRUNCKDIsMTUpLG5ldyBFQ0IoMiwxNikpLG5ldyBFQ0Jsb2NrcygyMixuZXcgRUNCKDIsMTEpLG5ldyBFQ0IoMiwxMikpKSxuZXcgVmVyc2lvbig2LG5ldyBBcnJheSg2LDM0KSxuZXcgRUNCbG9ja3MoMTgsbmV3IEVDQigyLDY4KSksbmV3IEVDQmxvY2tzKDE2LG5ldyBFQ0IoNCwyNykpLG5ldyBFQ0Jsb2NrcygyNCxuZXcgRUNCKDQsMTkpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQig0LDE1KSkpLG5ldyBWZXJzaW9uKDcsbmV3IEFycmF5KDYsMjIsMzgpLG5ldyBFQ0Jsb2NrcygyMCxuZXcgRUNCKDIsNzgpKSxuZXcgRUNCbG9ja3MoMTgsbmV3IEVDQig0LDMxKSksbmV3IEVDQmxvY2tzKDE4LG5ldyBFQ0IoMiwxNCksbmV3IEVDQig0LDE1KSksbmV3IEVDQmxvY2tzKDI2LG5ldyBFQ0IoNCwxMyksbmV3IEVDQigxLDE0KSkpLG5ldyBWZXJzaW9uKDgsbmV3IEFycmF5KDYsMjQsNDIpLG5ldyBFQ0Jsb2NrcygyNCxuZXcgRUNCKDIsOTcpKSxuZXcgRUNCbG9ja3MoMjIsbmV3IEVDQigyLDM4KSxuZXcgRUNCKDIsMzkpKSxuZXcgRUNCbG9ja3MoMjIsbmV3IEVDQig0LDE4KSxuZXcgRUNCKDIsMTkpKSxuZXcgRUNCbG9ja3MoMjYsbmV3IEVDQig0LDE0KSxuZXcgRUNCKDIsMTUpKSksbmV3IFZlcnNpb24oOSxuZXcgQXJyYXkoNiwyNiw0NiksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMiwxMTYpKSxuZXcgRUNCbG9ja3MoMjIsbmV3IEVDQigzLDM2KSxuZXcgRUNCKDIsMzcpKSxuZXcgRUNCbG9ja3MoMjAsbmV3IEVDQig0LDE2KSxuZXcgRUNCKDQsMTcpKSxuZXcgRUNCbG9ja3MoMjQsbmV3IEVDQig0LDEyKSxuZXcgRUNCKDQsMTMpKSksbmV3IFZlcnNpb24oMTAsbmV3IEFycmF5KDYsMjgsNTApLG5ldyBFQ0Jsb2NrcygxOCxuZXcgRUNCKDIsNjgpLG5ldyBFQ0IoMiw2OSkpLG5ldyBFQ0Jsb2NrcygyNixuZXcgRUNCKDQsNDMpLG5ldyBFQ0IoMSw0NCkpLG5ldyBFQ0Jsb2NrcygyNCxuZXcgRUNCKDYsMTkpLG5ldyBFQ0IoMiwyMCkpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDYsMTUpLG5ldyBFQ0IoMiwxNikpKSxuZXcgVmVyc2lvbigxMSxuZXcgQXJyYXkoNiwzMCw1NCksbmV3IEVDQmxvY2tzKDIwLG5ldyBFQ0IoNCw4MSkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDEsNTApLG5ldyBFQ0IoNCw1MSkpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDQsMjIpLG5ldyBFQ0IoNCwyMykpLG5ldyBFQ0Jsb2NrcygyNCxuZXcgRUNCKDMsMTIpLG5ldyBFQ0IoOCwxMykpKSxuZXcgVmVyc2lvbigxMixuZXcgQXJyYXkoNiwzMiw1OCksbmV3IEVDQmxvY2tzKDI0LG5ldyBFQ0IoMiw5MiksbmV3IEVDQigyLDkzKSksbmV3IEVDQmxvY2tzKDIyLG5ldyBFQ0IoNiwzNiksbmV3IEVDQigyLDM3KSksbmV3IEVDQmxvY2tzKDI2LG5ldyBFQ0IoNCwyMCksbmV3IEVDQig2LDIxKSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoNywxNCksbmV3IEVDQig0LDE1KSkpLG5ldyBWZXJzaW9uKDEzLG5ldyBBcnJheSg2LDM0LDYyKSxuZXcgRUNCbG9ja3MoMjYsbmV3IEVDQig0LDEwNykpLG5ldyBFQ0Jsb2NrcygyMixuZXcgRUNCKDgsMzcpLG5ldyBFQ0IoMSwzOCkpLG5ldyBFQ0Jsb2NrcygyNCxuZXcgRUNCKDgsMjApLG5ldyBFQ0IoNCwyMSkpLG5ldyBFQ0Jsb2NrcygyMixuZXcgRUNCKDEyLDExKSxuZXcgRUNCKDQsMTIpKSksbmV3IFZlcnNpb24oMTQsbmV3IEFycmF5KDYsMjYsNDYsNjYpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDMsMTE1KSxuZXcgRUNCKDEsMTE2KSksbmV3IEVDQmxvY2tzKDI0LG5ldyBFQ0IoNCw0MCksbmV3IEVDQig1LDQxKSksbmV3IEVDQmxvY2tzKDIwLG5ldyBFQ0IoMTEsMTYpLG5ldyBFQ0IoNSwxNykpLG5ldyBFQ0Jsb2NrcygyNCxuZXcgRUNCKDExLDEyKSxuZXcgRUNCKDUsMTMpKSksbmV3IFZlcnNpb24oMTUsbmV3IEFycmF5KDYsMjYsNDgsNzApLG5ldyBFQ0Jsb2NrcygyMixuZXcgRUNCKDUsODcpLG5ldyBFQ0IoMSw4OCkpLG5ldyBFQ0Jsb2NrcygyNCxuZXcgRUNCKDUsNDEpLG5ldyBFQ0IoNSw0MikpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDUsMjQpLG5ldyBFQ0IoNywyNSkpLG5ldyBFQ0Jsb2NrcygyNCxuZXcgRUNCKDExLDEyKSxuZXcgRUNCKDcsMTMpKSksbmV3IFZlcnNpb24oMTYsbmV3IEFycmF5KDYsMjYsNTAsNzQpLG5ldyBFQ0Jsb2NrcygyNCxuZXcgRUNCKDUsOTgpLG5ldyBFQ0IoMSw5OSkpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDcsNDUpLG5ldyBFQ0IoMyw0NikpLG5ldyBFQ0Jsb2NrcygyNCxuZXcgRUNCKDE1LDE5KSxuZXcgRUNCKDIsMjApKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigzLDE1KSxuZXcgRUNCKDEzLDE2KSkpLG5ldyBWZXJzaW9uKDE3LG5ldyBBcnJheSg2LDMwLDU0LDc4KSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigxLDEwNyksbmV3IEVDQig1LDEwOCkpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDEwLDQ2KSxuZXcgRUNCKDEsNDcpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigxLDIyKSxuZXcgRUNCKDE1LDIzKSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMiwxNCksbmV3IEVDQigxNywxNSkpKSxuZXcgVmVyc2lvbigxOCxuZXcgQXJyYXkoNiwzMCw1Niw4MiksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNSwxMjApLG5ldyBFQ0IoMSwxMjEpKSxuZXcgRUNCbG9ja3MoMjYsbmV3IEVDQig5LDQzKSxuZXcgRUNCKDQsNDQpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigxNywyMiksbmV3IEVDQigxLDIzKSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMiwxNCksbmV3IEVDQigxOSwxNSkpKSxuZXcgVmVyc2lvbigxOSxuZXcgQXJyYXkoNiwzMCw1OCw4NiksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMywxMTMpLG5ldyBFQ0IoNCwxMTQpKSxuZXcgRUNCbG9ja3MoMjYsbmV3IEVDQigzLDQ0KSxuZXcgRUNCKDExLDQ1KSksbmV3IEVDQmxvY2tzKDI2LG5ldyBFQ0IoMTcsMjEpLG5ldyBFQ0IoNCwyMikpLG5ldyBFQ0Jsb2NrcygyNixuZXcgRUNCKDksMTMpLG5ldyBFQ0IoMTYsMTQpKSksbmV3IFZlcnNpb24oMjAsbmV3IEFycmF5KDYsMzQsNjIsOTApLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDMsMTA3KSxuZXcgRUNCKDUsMTA4KSksbmV3IEVDQmxvY2tzKDI2LG5ldyBFQ0IoMyw0MSksbmV3IEVDQigxMyw0MikpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDE1LDI0KSxuZXcgRUNCKDUsMjUpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigxNSwxNSksbmV3IEVDQigxMCwxNikpKSxuZXcgVmVyc2lvbigyMSxuZXcgQXJyYXkoNiwyOCw1MCw3Miw5NCksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoNCwxMTYpLG5ldyBFQ0IoNCwxMTcpKSxuZXcgRUNCbG9ja3MoMjYsbmV3IEVDQigxNyw0MikpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDE3LDIyKSxuZXcgRUNCKDYsMjMpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxOSwxNiksbmV3IEVDQig2LDE3KSkpLG5ldyBWZXJzaW9uKDIyLG5ldyBBcnJheSg2LDI2LDUwLDc0LDk4KSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigyLDExMSksbmV3IEVDQig3LDExMikpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDE3LDQ2KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNywyNCksbmV3IEVDQigxNiwyNSkpLG5ldyBFQ0Jsb2NrcygyNCxuZXcgRUNCKDM0LDEzKSkpLG5ldyBWZXJzaW9uKDIzLG5ldyBBcnJheSg2LDMwLDU0LDc0LDEwMiksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNCwxMjEpLG5ldyBFQ0IoNSwxMjIpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQig0LDQ3KSxuZXcgRUNCKDE0LDQ4KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTEsMjQpLG5ldyBFQ0IoMTQsMjUpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxNiwxNSksbmV3IEVDQigxNCwxNikpKSxuZXcgVmVyc2lvbigyNCxuZXcgQXJyYXkoNiwyOCw1NCw4MCwxMDYpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDYsMTE3KSxuZXcgRUNCKDQsMTE4KSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoNiw0NSksbmV3IEVDQigxNCw0NikpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDExLDI0KSxuZXcgRUNCKDE2LDI1KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMzAsMTYpLG5ldyBFQ0IoMiwxNykpKSxuZXcgVmVyc2lvbigyNSxuZXcgQXJyYXkoNiwzMiw1OCw4NCwxMTApLG5ldyBFQ0Jsb2NrcygyNixuZXcgRUNCKDgsMTA2KSxuZXcgRUNCKDQsMTA3KSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoOCw0NyksbmV3IEVDQigxMyw0OCkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDcsMjQpLG5ldyBFQ0IoMjIsMjUpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigyMiwxNSksbmV3IEVDQigxMywxNikpKSxuZXcgVmVyc2lvbigyNixuZXcgQXJyYXkoNiwzMCw1OCw4NiwxMTQpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDEwLDExNCksbmV3IEVDQigyLDExNSkpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDE5LDQ2KSxuZXcgRUNCKDQsNDcpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigyOCwyMiksbmV3IEVDQig2LDIzKSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMzMsMTYpLG5ldyBFQ0IoNCwxNykpKSxuZXcgVmVyc2lvbigyNyxuZXcgQXJyYXkoNiwzNCw2Miw5MCwxMTgpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDgsMTIyKSxuZXcgRUNCKDQsMTIzKSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMjIsNDUpLG5ldyBFQ0IoMyw0NikpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDgsMjMpLG5ldyBFQ0IoMjYsMjQpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxMiwxNSksbmV3IEVDQigyOCwxNikpKSxuZXcgVmVyc2lvbigyOCxuZXcgQXJyYXkoNiwyNiw1MCw3NCw5OCwxMjIpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDMsMTE3KSxuZXcgRUNCKDEwLDExOCkpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDMsNDUpLG5ldyBFQ0IoMjMsNDYpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQig0LDI0KSxuZXcgRUNCKDMxLDI1KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTEsMTUpLG5ldyBFQ0IoMzEsMTYpKSksbmV3IFZlcnNpb24oMjksbmV3IEFycmF5KDYsMzAsNTQsNzgsMTAyLDEyNiksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNywxMTYpLG5ldyBFQ0IoNywxMTcpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigyMSw0NSksbmV3IEVDQig3LDQ2KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMSwyMyksbmV3IEVDQigzNywyNCkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDE5LDE1KSxuZXcgRUNCKDI2LDE2KSkpLG5ldyBWZXJzaW9uKDMwLG5ldyBBcnJheSg2LDI2LDUyLDc4LDEwNCwxMzApLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDUsMTE1KSxuZXcgRUNCKDEwLDExNikpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDE5LDQ3KSxuZXcgRUNCKDEwLDQ4KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTUsMjQpLG5ldyBFQ0IoMjUsMjUpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigyMywxNSksbmV3IEVDQigyNSwxNikpKSxuZXcgVmVyc2lvbigzMSxuZXcgQXJyYXkoNiwzMCw1Niw4MiwxMDgsMTM0KSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxMywxMTUpLG5ldyBFQ0IoMywxMTYpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigyLDQ2KSxuZXcgRUNCKDI5LDQ3KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNDIsMjQpLG5ldyBFQ0IoMSwyNSkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDIzLDE1KSxuZXcgRUNCKDI4LDE2KSkpLG5ldyBWZXJzaW9uKDMyLG5ldyBBcnJheSg2LDM0LDYwLDg2LDExMiwxMzgpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDE3LDExNSkpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDEwLDQ2KSxuZXcgRUNCKDIzLDQ3KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTAsMjQpLG5ldyBFQ0IoMzUsMjUpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxOSwxNSksbmV3IEVDQigzNSwxNikpKSxuZXcgVmVyc2lvbigzMyxuZXcgQXJyYXkoNiwzMCw1OCw4NiwxMTQsMTQyKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxNywxMTUpLG5ldyBFQ0IoMSwxMTYpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigxNCw0NiksbmV3IEVDQigyMSw0NykpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDI5LDI0KSxuZXcgRUNCKDE5LDI1KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTEsMTUpLG5ldyBFQ0IoNDYsMTYpKSksbmV3IFZlcnNpb24oMzQsbmV3IEFycmF5KDYsMzQsNjIsOTAsMTE4LDE0NiksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTMsMTE1KSxuZXcgRUNCKDYsMTE2KSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMTQsNDYpLG5ldyBFQ0IoMjMsNDcpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQig0NCwyNCksbmV3IEVDQig3LDI1KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNTksMTYpLG5ldyBFQ0IoMSwxNykpKSxuZXcgVmVyc2lvbigzNSxuZXcgQXJyYXkoNiwzMCw1NCw3OCwxMDIsMTI2LDE1MCksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTIsMTIxKSxuZXcgRUNCKDcsMTIyKSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMTIsNDcpLG5ldyBFQ0IoMjYsNDgpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigzOSwyNCksbmV3IEVDQigxNCwyNSkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDIyLDE1KSxuZXcgRUNCKDQxLDE2KSkpLG5ldyBWZXJzaW9uKDM2LG5ldyBBcnJheSg2LDI0LDUwLDc2LDEwMiwxMjgsMTU0KSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQig2LDEyMSksbmV3IEVDQigxNCwxMjIpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQig2LDQ3KSxuZXcgRUNCKDM0LDQ4KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNDYsMjQpLG5ldyBFQ0IoMTAsMjUpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigyLDE1KSxuZXcgRUNCKDY0LDE2KSkpLG5ldyBWZXJzaW9uKDM3LG5ldyBBcnJheSg2LDI4LDU0LDgwLDEwNiwxMzIsMTU4KSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxNywxMjIpLG5ldyBFQ0IoNCwxMjMpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigyOSw0NiksbmV3IEVDQigxNCw0NykpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDQ5LDI0KSxuZXcgRUNCKDEwLDI1KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMjQsMTUpLG5ldyBFQ0IoNDYsMTYpKSksbmV3IFZlcnNpb24oMzgsbmV3IEFycmF5KDYsMzIsNTgsODQsMTEwLDEzNiwxNjIpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDQsMTIyKSxuZXcgRUNCKDE4LDEyMykpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDEzLDQ2KSxuZXcgRUNCKDMyLDQ3KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNDgsMjQpLG5ldyBFQ0IoMTQsMjUpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQig0MiwxNSksbmV3IEVDQigzMiwxNikpKSxuZXcgVmVyc2lvbigzOSxuZXcgQXJyYXkoNiwyNiw1NCw4MiwxMTAsMTM4LDE2NiksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMjAsMTE3KSxuZXcgRUNCKDQsMTE4KSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoNDAsNDcpLG5ldyBFQ0IoNyw0OCkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDQzLDI0KSxuZXcgRUNCKDIyLDI1KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTAsMTUpLG5ldyBFQ0IoNjcsMTYpKSksbmV3IFZlcnNpb24oNDAsbmV3IEFycmF5KDYsMzAsNTgsODYsMTE0LDE0MiwxNzApLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDE5LDExOCksbmV3IEVDQig2LDExOSkpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDE4LDQ3KSxuZXcgRUNCKDMxLDQ4KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMzQsMjQpLG5ldyBFQ0IoMzQsMjUpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigyMCwxNSksbmV3IEVDQig2MSwxNikpKSl9ZnVuY3Rpb24gUGVyc3BlY3RpdmVUcmFuc2Zvcm0oYTExLGEyMSxhMzEsYTEyLGEyMixhMzIsYTEzLGEyMyxhMzMpe3RoaXMuYTExPWExMSx0aGlzLmExMj1hMTIsdGhpcy5hMTM9YTEzLHRoaXMuYTIxPWEyMSx0aGlzLmEyMj1hMjIsdGhpcy5hMjM9YTIzLHRoaXMuYTMxPWEzMSx0aGlzLmEzMj1hMzIsdGhpcy5hMzM9YTMzLHRoaXMudHJhbnNmb3JtUG9pbnRzMT1mdW5jdGlvbihwb2ludHMpe2Zvcih2YXIgbWF4PXBvaW50cy5sZW5ndGgsYTExPXRoaXMuYTExLGExMj10aGlzLmExMixhMTM9dGhpcy5hMTMsYTIxPXRoaXMuYTIxLGEyMj10aGlzLmEyMixhMjM9dGhpcy5hMjMsYTMxPXRoaXMuYTMxLGEzMj10aGlzLmEzMixhMzM9dGhpcy5hMzMsaT0wO21heD5pO2krPTIpe3ZhciB4PXBvaW50c1tpXSx5PXBvaW50c1tpKzFdLGRlbm9taW5hdG9yPWExMyp4K2EyMyp5K2EzMztwb2ludHNbaV09KGExMSp4K2EyMSp5K2EzMSkvZGVub21pbmF0b3IscG9pbnRzW2krMV09KGExMip4K2EyMip5K2EzMikvZGVub21pbmF0b3J9fSx0aGlzLnRyYW5zZm9ybVBvaW50czI9ZnVuY3Rpb24oeFZhbHVlcyx5VmFsdWVzKXtmb3IodmFyIG49eFZhbHVlcy5sZW5ndGgsaT0wO24+aTtpKyspe3ZhciB4PXhWYWx1ZXNbaV0seT15VmFsdWVzW2ldLGRlbm9taW5hdG9yPXRoaXMuYTEzKngrdGhpcy5hMjMqeSt0aGlzLmEzMzt4VmFsdWVzW2ldPSh0aGlzLmExMSp4K3RoaXMuYTIxKnkrdGhpcy5hMzEpL2Rlbm9taW5hdG9yLHlWYWx1ZXNbaV09KHRoaXMuYTEyKngrdGhpcy5hMjIqeSt0aGlzLmEzMikvZGVub21pbmF0b3J9fSx0aGlzLmJ1aWxkQWRqb2ludD1mdW5jdGlvbigpe3JldHVybiBuZXcgUGVyc3BlY3RpdmVUcmFuc2Zvcm0odGhpcy5hMjIqdGhpcy5hMzMtdGhpcy5hMjMqdGhpcy5hMzIsdGhpcy5hMjMqdGhpcy5hMzEtdGhpcy5hMjEqdGhpcy5hMzMsdGhpcy5hMjEqdGhpcy5hMzItdGhpcy5hMjIqdGhpcy5hMzEsdGhpcy5hMTMqdGhpcy5hMzItdGhpcy5hMTIqdGhpcy5hMzMsdGhpcy5hMTEqdGhpcy5hMzMtdGhpcy5hMTMqdGhpcy5hMzEsdGhpcy5hMTIqdGhpcy5hMzEtdGhpcy5hMTEqdGhpcy5hMzIsdGhpcy5hMTIqdGhpcy5hMjMtdGhpcy5hMTMqdGhpcy5hMjIsdGhpcy5hMTMqdGhpcy5hMjEtdGhpcy5hMTEqdGhpcy5hMjMsdGhpcy5hMTEqdGhpcy5hMjItdGhpcy5hMTIqdGhpcy5hMjEpfSx0aGlzLnRpbWVzPWZ1bmN0aW9uKG90aGVyKXtyZXR1cm4gbmV3IFBlcnNwZWN0aXZlVHJhbnNmb3JtKHRoaXMuYTExKm90aGVyLmExMSt0aGlzLmEyMSpvdGhlci5hMTIrdGhpcy5hMzEqb3RoZXIuYTEzLHRoaXMuYTExKm90aGVyLmEyMSt0aGlzLmEyMSpvdGhlci5hMjIrdGhpcy5hMzEqb3RoZXIuYTIzLHRoaXMuYTExKm90aGVyLmEzMSt0aGlzLmEyMSpvdGhlci5hMzIrdGhpcy5hMzEqb3RoZXIuYTMzLHRoaXMuYTEyKm90aGVyLmExMSt0aGlzLmEyMipvdGhlci5hMTIrdGhpcy5hMzIqb3RoZXIuYTEzLHRoaXMuYTEyKm90aGVyLmEyMSt0aGlzLmEyMipvdGhlci5hMjIrdGhpcy5hMzIqb3RoZXIuYTIzLHRoaXMuYTEyKm90aGVyLmEzMSt0aGlzLmEyMipvdGhlci5hMzIrdGhpcy5hMzIqb3RoZXIuYTMzLHRoaXMuYTEzKm90aGVyLmExMSt0aGlzLmEyMypvdGhlci5hMTIrdGhpcy5hMzMqb3RoZXIuYTEzLHRoaXMuYTEzKm90aGVyLmEyMSt0aGlzLmEyMypvdGhlci5hMjIrdGhpcy5hMzMqb3RoZXIuYTIzLHRoaXMuYTEzKm90aGVyLmEzMSt0aGlzLmEyMypvdGhlci5hMzIrdGhpcy5hMzMqb3RoZXIuYTMzKX19ZnVuY3Rpb24gRGV0ZWN0b3JSZXN1bHQoYml0cyxwb2ludHMpe3RoaXMuYml0cz1iaXRzLHRoaXMucG9pbnRzPXBvaW50c31mdW5jdGlvbiBEZXRlY3RvcihpbWFnZSl7dGhpcy5pbWFnZT1pbWFnZSx0aGlzLnJlc3VsdFBvaW50Q2FsbGJhY2s9bnVsbCx0aGlzLnNpemVPZkJsYWNrV2hpdGVCbGFja1J1bj1mdW5jdGlvbihmcm9tWCxmcm9tWSx0b1gsdG9ZKXt2YXIgc3RlZXA9TWF0aC5hYnModG9ZLWZyb21ZKT5NYXRoLmFicyh0b1gtZnJvbVgpO2lmKHN0ZWVwKXt2YXIgdGVtcD1mcm9tWDtmcm9tWD1mcm9tWSxmcm9tWT10ZW1wLHRlbXA9dG9YLHRvWD10b1ksdG9ZPXRlbXB9Zm9yKHZhciBkeD1NYXRoLmFicyh0b1gtZnJvbVgpLGR5PU1hdGguYWJzKHRvWS1mcm9tWSksZXJyb3I9LWR4Pj4xLHlzdGVwPXRvWT5mcm9tWT8xOi0xLHhzdGVwPXRvWD5mcm9tWD8xOi0xLHN0YXRlPTAseD1mcm9tWCx5PWZyb21ZO3ghPXRvWDt4Kz14c3RlcCl7dmFyIHJlYWxYPXN0ZWVwP3k6eCxyZWFsWT1zdGVlcD94Onk7aWYoMT09c3RhdGU/dGhpcy5pbWFnZVtyZWFsWCtyZWFsWSpxcmNvZGUud2lkdGhdJiZzdGF0ZSsrOnRoaXMuaW1hZ2VbcmVhbFgrcmVhbFkqcXJjb2RlLndpZHRoXXx8c3RhdGUrKywzPT1zdGF0ZSl7dmFyIGRpZmZYPXgtZnJvbVgsZGlmZlk9eS1mcm9tWTtyZXR1cm4gTWF0aC5zcXJ0KGRpZmZYKmRpZmZYK2RpZmZZKmRpZmZZKX1pZihlcnJvcis9ZHksZXJyb3I+MCl7aWYoeT09dG9ZKWJyZWFrO3krPXlzdGVwLGVycm9yLT1keH19dmFyIGRpZmZYMj10b1gtZnJvbVgsZGlmZlkyPXRvWS1mcm9tWTtyZXR1cm4gTWF0aC5zcXJ0KGRpZmZYMipkaWZmWDIrZGlmZlkyKmRpZmZZMil9LHRoaXMuc2l6ZU9mQmxhY2tXaGl0ZUJsYWNrUnVuQm90aFdheXM9ZnVuY3Rpb24oZnJvbVgsZnJvbVksdG9YLHRvWSl7dmFyIHJlc3VsdD10aGlzLnNpemVPZkJsYWNrV2hpdGVCbGFja1J1bihmcm9tWCxmcm9tWSx0b1gsdG9ZKSxzY2FsZT0xLG90aGVyVG9YPWZyb21YLSh0b1gtZnJvbVgpOzA+b3RoZXJUb1g/KHNjYWxlPWZyb21YLyhmcm9tWC1vdGhlclRvWCksb3RoZXJUb1g9MCk6b3RoZXJUb1g+PXFyY29kZS53aWR0aCYmKHNjYWxlPShxcmNvZGUud2lkdGgtMS1mcm9tWCkvKG90aGVyVG9YLWZyb21YKSxvdGhlclRvWD1xcmNvZGUud2lkdGgtMSk7dmFyIG90aGVyVG9ZPU1hdGguZmxvb3IoZnJvbVktKHRvWS1mcm9tWSkqc2NhbGUpO3JldHVybiBzY2FsZT0xLDA+b3RoZXJUb1k/KHNjYWxlPWZyb21ZLyhmcm9tWS1vdGhlclRvWSksb3RoZXJUb1k9MCk6b3RoZXJUb1k+PXFyY29kZS5oZWlnaHQmJihzY2FsZT0ocXJjb2RlLmhlaWdodC0xLWZyb21ZKS8ob3RoZXJUb1ktZnJvbVkpLG90aGVyVG9ZPXFyY29kZS5oZWlnaHQtMSksb3RoZXJUb1g9TWF0aC5mbG9vcihmcm9tWCsob3RoZXJUb1gtZnJvbVgpKnNjYWxlKSxyZXN1bHQrPXRoaXMuc2l6ZU9mQmxhY2tXaGl0ZUJsYWNrUnVuKGZyb21YLGZyb21ZLG90aGVyVG9YLG90aGVyVG9ZKSxyZXN1bHQtMX0sdGhpcy5jYWxjdWxhdGVNb2R1bGVTaXplT25lV2F5PWZ1bmN0aW9uKHBhdHRlcm4sb3RoZXJQYXR0ZXJuKXt2YXIgbW9kdWxlU2l6ZUVzdDE9dGhpcy5zaXplT2ZCbGFja1doaXRlQmxhY2tSdW5Cb3RoV2F5cyhNYXRoLmZsb29yKHBhdHRlcm4uWCksTWF0aC5mbG9vcihwYXR0ZXJuLlkpLE1hdGguZmxvb3Iob3RoZXJQYXR0ZXJuLlgpLE1hdGguZmxvb3Iob3RoZXJQYXR0ZXJuLlkpKSxtb2R1bGVTaXplRXN0Mj10aGlzLnNpemVPZkJsYWNrV2hpdGVCbGFja1J1bkJvdGhXYXlzKE1hdGguZmxvb3Iob3RoZXJQYXR0ZXJuLlgpLE1hdGguZmxvb3Iob3RoZXJQYXR0ZXJuLlkpLE1hdGguZmxvb3IocGF0dGVybi5YKSxNYXRoLmZsb29yKHBhdHRlcm4uWSkpO3JldHVybiBpc05hTihtb2R1bGVTaXplRXN0MSk/bW9kdWxlU2l6ZUVzdDIvNzppc05hTihtb2R1bGVTaXplRXN0Mik/bW9kdWxlU2l6ZUVzdDEvNzoobW9kdWxlU2l6ZUVzdDErbW9kdWxlU2l6ZUVzdDIpLzE0fSx0aGlzLmNhbGN1bGF0ZU1vZHVsZVNpemU9ZnVuY3Rpb24odG9wTGVmdCx0b3BSaWdodCxib3R0b21MZWZ0KXtyZXR1cm4odGhpcy5jYWxjdWxhdGVNb2R1bGVTaXplT25lV2F5KHRvcExlZnQsdG9wUmlnaHQpK3RoaXMuY2FsY3VsYXRlTW9kdWxlU2l6ZU9uZVdheSh0b3BMZWZ0LGJvdHRvbUxlZnQpKS8yfSx0aGlzLmRpc3RhbmNlPWZ1bmN0aW9uKHBhdHRlcm4xLHBhdHRlcm4yKXtyZXR1cm4geERpZmY9cGF0dGVybjEuWC1wYXR0ZXJuMi5YLHlEaWZmPXBhdHRlcm4xLlktcGF0dGVybjIuWSxNYXRoLnNxcnQoeERpZmYqeERpZmYreURpZmYqeURpZmYpfSx0aGlzLmNvbXB1dGVEaW1lbnNpb249ZnVuY3Rpb24odG9wTGVmdCx0b3BSaWdodCxib3R0b21MZWZ0LG1vZHVsZVNpemUpe3ZhciB0bHRyQ2VudGVyc0RpbWVuc2lvbj1NYXRoLnJvdW5kKHRoaXMuZGlzdGFuY2UodG9wTGVmdCx0b3BSaWdodCkvbW9kdWxlU2l6ZSksdGxibENlbnRlcnNEaW1lbnNpb249TWF0aC5yb3VuZCh0aGlzLmRpc3RhbmNlKHRvcExlZnQsYm90dG9tTGVmdCkvbW9kdWxlU2l6ZSksZGltZW5zaW9uPSh0bHRyQ2VudGVyc0RpbWVuc2lvbit0bGJsQ2VudGVyc0RpbWVuc2lvbj4+MSkrNztzd2l0Y2goMyZkaW1lbnNpb24pe2Nhc2UgMDpkaW1lbnNpb24rKzticmVhaztjYXNlIDI6ZGltZW5zaW9uLS07YnJlYWs7Y2FzZSAzOnRocm93XCJFcnJvclwifXJldHVybiBkaW1lbnNpb259LHRoaXMuZmluZEFsaWdubWVudEluUmVnaW9uPWZ1bmN0aW9uKG92ZXJhbGxFc3RNb2R1bGVTaXplLGVzdEFsaWdubWVudFgsZXN0QWxpZ25tZW50WSxhbGxvd2FuY2VGYWN0b3Ipe3ZhciBhbGxvd2FuY2U9TWF0aC5mbG9vcihhbGxvd2FuY2VGYWN0b3Iqb3ZlcmFsbEVzdE1vZHVsZVNpemUpLGFsaWdubWVudEFyZWFMZWZ0WD1NYXRoLm1heCgwLGVzdEFsaWdubWVudFgtYWxsb3dhbmNlKSxhbGlnbm1lbnRBcmVhUmlnaHRYPU1hdGgubWluKHFyY29kZS53aWR0aC0xLGVzdEFsaWdubWVudFgrYWxsb3dhbmNlKTtpZigzKm92ZXJhbGxFc3RNb2R1bGVTaXplPmFsaWdubWVudEFyZWFSaWdodFgtYWxpZ25tZW50QXJlYUxlZnRYKXRocm93XCJFcnJvclwiO3ZhciBhbGlnbm1lbnRBcmVhVG9wWT1NYXRoLm1heCgwLGVzdEFsaWdubWVudFktYWxsb3dhbmNlKSxhbGlnbm1lbnRBcmVhQm90dG9tWT1NYXRoLm1pbihxcmNvZGUuaGVpZ2h0LTEsZXN0QWxpZ25tZW50WSthbGxvd2FuY2UpLGFsaWdubWVudEZpbmRlcj1uZXcgQWxpZ25tZW50UGF0dGVybkZpbmRlcih0aGlzLmltYWdlLGFsaWdubWVudEFyZWFMZWZ0WCxhbGlnbm1lbnRBcmVhVG9wWSxhbGlnbm1lbnRBcmVhUmlnaHRYLWFsaWdubWVudEFyZWFMZWZ0WCxhbGlnbm1lbnRBcmVhQm90dG9tWS1hbGlnbm1lbnRBcmVhVG9wWSxvdmVyYWxsRXN0TW9kdWxlU2l6ZSx0aGlzLnJlc3VsdFBvaW50Q2FsbGJhY2spO3JldHVybiBhbGlnbm1lbnRGaW5kZXIuZmluZCgpfSx0aGlzLmNyZWF0ZVRyYW5zZm9ybT1mdW5jdGlvbih0b3BMZWZ0LHRvcFJpZ2h0LGJvdHRvbUxlZnQsYWxpZ25tZW50UGF0dGVybixkaW1lbnNpb24pe3ZhciBib3R0b21SaWdodFgsYm90dG9tUmlnaHRZLHNvdXJjZUJvdHRvbVJpZ2h0WCxzb3VyY2VCb3R0b21SaWdodFksZGltTWludXNUaHJlZT1kaW1lbnNpb24tMy41O251bGwhPWFsaWdubWVudFBhdHRlcm4/KGJvdHRvbVJpZ2h0WD1hbGlnbm1lbnRQYXR0ZXJuLlgsYm90dG9tUmlnaHRZPWFsaWdubWVudFBhdHRlcm4uWSxzb3VyY2VCb3R0b21SaWdodFg9c291cmNlQm90dG9tUmlnaHRZPWRpbU1pbnVzVGhyZWUtMyk6KGJvdHRvbVJpZ2h0WD10b3BSaWdodC5YLXRvcExlZnQuWCtib3R0b21MZWZ0LlgsYm90dG9tUmlnaHRZPXRvcFJpZ2h0LlktdG9wTGVmdC5ZK2JvdHRvbUxlZnQuWSxzb3VyY2VCb3R0b21SaWdodFg9c291cmNlQm90dG9tUmlnaHRZPWRpbU1pbnVzVGhyZWUpO3ZhciB0cmFuc2Zvcm09UGVyc3BlY3RpdmVUcmFuc2Zvcm0ucXVhZHJpbGF0ZXJhbFRvUXVhZHJpbGF0ZXJhbCgzLjUsMy41LGRpbU1pbnVzVGhyZWUsMy41LHNvdXJjZUJvdHRvbVJpZ2h0WCxzb3VyY2VCb3R0b21SaWdodFksMy41LGRpbU1pbnVzVGhyZWUsdG9wTGVmdC5YLHRvcExlZnQuWSx0b3BSaWdodC5YLHRvcFJpZ2h0LlksYm90dG9tUmlnaHRYLGJvdHRvbVJpZ2h0WSxib3R0b21MZWZ0LlgsYm90dG9tTGVmdC5ZKTtyZXR1cm4gdHJhbnNmb3JtfSx0aGlzLnNhbXBsZUdyaWQ9ZnVuY3Rpb24oaW1hZ2UsdHJhbnNmb3JtLGRpbWVuc2lvbil7dmFyIHNhbXBsZXI9R3JpZFNhbXBsZXI7cmV0dXJuIHNhbXBsZXIuc2FtcGxlR3JpZDMoaW1hZ2UsZGltZW5zaW9uLHRyYW5zZm9ybSl9LHRoaXMucHJvY2Vzc0ZpbmRlclBhdHRlcm5JbmZvPWZ1bmN0aW9uKGluZm8pe3ZhciB0b3BMZWZ0PWluZm8uVG9wTGVmdCx0b3BSaWdodD1pbmZvLlRvcFJpZ2h0LGJvdHRvbUxlZnQ9aW5mby5Cb3R0b21MZWZ0LG1vZHVsZVNpemU9dGhpcy5jYWxjdWxhdGVNb2R1bGVTaXplKHRvcExlZnQsdG9wUmlnaHQsYm90dG9tTGVmdCk7aWYoMT5tb2R1bGVTaXplKXRocm93XCJFcnJvclwiO3ZhciBkaW1lbnNpb249dGhpcy5jb21wdXRlRGltZW5zaW9uKHRvcExlZnQsdG9wUmlnaHQsYm90dG9tTGVmdCxtb2R1bGVTaXplKSxwcm92aXNpb25hbFZlcnNpb249VmVyc2lvbi5nZXRQcm92aXNpb25hbFZlcnNpb25Gb3JEaW1lbnNpb24oZGltZW5zaW9uKSxtb2R1bGVzQmV0d2VlbkZQQ2VudGVycz1wcm92aXNpb25hbFZlcnNpb24uRGltZW5zaW9uRm9yVmVyc2lvbi03LGFsaWdubWVudFBhdHRlcm49bnVsbDtpZihwcm92aXNpb25hbFZlcnNpb24uQWxpZ25tZW50UGF0dGVybkNlbnRlcnMubGVuZ3RoPjApZm9yKHZhciBib3R0b21SaWdodFg9dG9wUmlnaHQuWC10b3BMZWZ0LlgrYm90dG9tTGVmdC5YLGJvdHRvbVJpZ2h0WT10b3BSaWdodC5ZLXRvcExlZnQuWStib3R0b21MZWZ0LlksY29ycmVjdGlvblRvVG9wTGVmdD0xLTMvbW9kdWxlc0JldHdlZW5GUENlbnRlcnMsZXN0QWxpZ25tZW50WD1NYXRoLmZsb29yKHRvcExlZnQuWCtjb3JyZWN0aW9uVG9Ub3BMZWZ0Kihib3R0b21SaWdodFgtdG9wTGVmdC5YKSksZXN0QWxpZ25tZW50WT1NYXRoLmZsb29yKHRvcExlZnQuWStjb3JyZWN0aW9uVG9Ub3BMZWZ0Kihib3R0b21SaWdodFktdG9wTGVmdC5ZKSksaT00OzE2Pj1pO2k8PD0xKXthbGlnbm1lbnRQYXR0ZXJuPXRoaXMuZmluZEFsaWdubWVudEluUmVnaW9uKG1vZHVsZVNpemUsZXN0QWxpZ25tZW50WCxlc3RBbGlnbm1lbnRZLGkpO2JyZWFrfXZhciBwb2ludHMsdHJhbnNmb3JtPXRoaXMuY3JlYXRlVHJhbnNmb3JtKHRvcExlZnQsdG9wUmlnaHQsYm90dG9tTGVmdCxhbGlnbm1lbnRQYXR0ZXJuLGRpbWVuc2lvbiksYml0cz10aGlzLnNhbXBsZUdyaWQodGhpcy5pbWFnZSx0cmFuc2Zvcm0sZGltZW5zaW9uKTtyZXR1cm4gcG9pbnRzPW51bGw9PWFsaWdubWVudFBhdHRlcm4/bmV3IEFycmF5KGJvdHRvbUxlZnQsdG9wTGVmdCx0b3BSaWdodCk6bmV3IEFycmF5KGJvdHRvbUxlZnQsdG9wTGVmdCx0b3BSaWdodCxhbGlnbm1lbnRQYXR0ZXJuKSxuZXcgRGV0ZWN0b3JSZXN1bHQoYml0cyxwb2ludHMpfSx0aGlzLmRldGVjdD1mdW5jdGlvbigpe3ZhciBpbmZvPShuZXcgRmluZGVyUGF0dGVybkZpbmRlcikuZmluZEZpbmRlclBhdHRlcm4odGhpcy5pbWFnZSk7cmV0dXJuIHRoaXMucHJvY2Vzc0ZpbmRlclBhdHRlcm5JbmZvKGluZm8pfX1mdW5jdGlvbiBGb3JtYXRJbmZvcm1hdGlvbihmb3JtYXRJbmZvKXt0aGlzLmVycm9yQ29ycmVjdGlvbkxldmVsPUVycm9yQ29ycmVjdGlvbkxldmVsLmZvckJpdHMoZm9ybWF0SW5mbz4+MyYzKSx0aGlzLmRhdGFNYXNrPTcmZm9ybWF0SW5mbyx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJFcnJvckNvcnJlY3Rpb25MZXZlbFwiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZXJyb3JDb3JyZWN0aW9uTGV2ZWx9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJEYXRhTWFza1wiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZGF0YU1hc2t9KSx0aGlzLkdldEhhc2hDb2RlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZXJyb3JDb3JyZWN0aW9uTGV2ZWwub3JkaW5hbCgpPDwzfGRhdGFNYXNrfSx0aGlzLkVxdWFscz1mdW5jdGlvbihvKXt2YXIgb3RoZXI9bztyZXR1cm4gdGhpcy5lcnJvckNvcnJlY3Rpb25MZXZlbD09b3RoZXIuZXJyb3JDb3JyZWN0aW9uTGV2ZWwmJnRoaXMuZGF0YU1hc2s9PW90aGVyLmRhdGFNYXNrfX1mdW5jdGlvbiBFcnJvckNvcnJlY3Rpb25MZXZlbChvcmRpbmFsLGJpdHMsbmFtZSl7dGhpcy5vcmRpbmFsX1JlbmFtZWRfRmllbGQ9b3JkaW5hbCx0aGlzLmJpdHM9Yml0cyx0aGlzLm5hbWU9bmFtZSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJCaXRzXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5iaXRzfSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiTmFtZVwiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubmFtZX0pLHRoaXMub3JkaW5hbD1mdW5jdGlvbigpe3JldHVybiB0aGlzLm9yZGluYWxfUmVuYW1lZF9GaWVsZH19ZnVuY3Rpb24gQml0TWF0cml4KHdpZHRoLGhlaWdodCl7aWYoaGVpZ2h0fHwoaGVpZ2h0PXdpZHRoKSwxPndpZHRofHwxPmhlaWdodCl0aHJvd1wiQm90aCBkaW1lbnNpb25zIG11c3QgYmUgZ3JlYXRlciB0aGFuIDBcIjt0aGlzLndpZHRoPXdpZHRoLHRoaXMuaGVpZ2h0PWhlaWdodDt2YXIgcm93U2l6ZT13aWR0aD4+NTswIT0oMzEmd2lkdGgpJiZyb3dTaXplKyssdGhpcy5yb3dTaXplPXJvd1NpemUsdGhpcy5iaXRzPW5ldyBBcnJheShyb3dTaXplKmhlaWdodCk7Zm9yKHZhciBpPTA7aTx0aGlzLmJpdHMubGVuZ3RoO2krKyl0aGlzLmJpdHNbaV09MDt0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJXaWR0aFwiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMud2lkdGh9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJIZWlnaHRcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmhlaWdodH0pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkRpbWVuc2lvblwiLGZ1bmN0aW9uKCl7aWYodGhpcy53aWR0aCE9dGhpcy5oZWlnaHQpdGhyb3dcIkNhbid0IGNhbGwgZ2V0RGltZW5zaW9uKCkgb24gYSBub24tc3F1YXJlIG1hdHJpeFwiO3JldHVybiB0aGlzLndpZHRofSksdGhpcy5nZXRfUmVuYW1lZD1mdW5jdGlvbih4LHkpe3ZhciBvZmZzZXQ9eSp0aGlzLnJvd1NpemUrKHg+PjUpO3JldHVybiAwIT0oMSZVUlNoaWZ0KHRoaXMuYml0c1tvZmZzZXRdLDMxJngpKX0sdGhpcy5zZXRfUmVuYW1lZD1mdW5jdGlvbih4LHkpe3ZhciBvZmZzZXQ9eSp0aGlzLnJvd1NpemUrKHg+PjUpO3RoaXMuYml0c1tvZmZzZXRdfD0xPDwoMzEmeCl9LHRoaXMuZmxpcD1mdW5jdGlvbih4LHkpe3ZhciBvZmZzZXQ9eSp0aGlzLnJvd1NpemUrKHg+PjUpO3RoaXMuYml0c1tvZmZzZXRdXj0xPDwoMzEmeCl9LHRoaXMuY2xlYXI9ZnVuY3Rpb24oKXtmb3IodmFyIG1heD10aGlzLmJpdHMubGVuZ3RoLGk9MDttYXg+aTtpKyspdGhpcy5iaXRzW2ldPTB9LHRoaXMuc2V0UmVnaW9uPWZ1bmN0aW9uKGxlZnQsdG9wLHdpZHRoLGhlaWdodCl7aWYoMD50b3B8fDA+bGVmdCl0aHJvd1wiTGVmdCBhbmQgdG9wIG11c3QgYmUgbm9ubmVnYXRpdmVcIjtpZigxPmhlaWdodHx8MT53aWR0aCl0aHJvd1wiSGVpZ2h0IGFuZCB3aWR0aCBtdXN0IGJlIGF0IGxlYXN0IDFcIjt2YXIgcmlnaHQ9bGVmdCt3aWR0aCxib3R0b209dG9wK2hlaWdodDtpZihib3R0b20+dGhpcy5oZWlnaHR8fHJpZ2h0PnRoaXMud2lkdGgpdGhyb3dcIlRoZSByZWdpb24gbXVzdCBmaXQgaW5zaWRlIHRoZSBtYXRyaXhcIjtmb3IodmFyIHk9dG9wO2JvdHRvbT55O3krKylmb3IodmFyIG9mZnNldD15KnRoaXMucm93U2l6ZSx4PWxlZnQ7cmlnaHQ+eDt4KyspdGhpcy5iaXRzW29mZnNldCsoeD4+NSldfD0xPDwoMzEmeCl9fWZ1bmN0aW9uIERhdGFCbG9jayhudW1EYXRhQ29kZXdvcmRzLGNvZGV3b3Jkcyl7dGhpcy5udW1EYXRhQ29kZXdvcmRzPW51bURhdGFDb2Rld29yZHMsdGhpcy5jb2Rld29yZHM9Y29kZXdvcmRzLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIk51bURhdGFDb2Rld29yZHNcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLm51bURhdGFDb2Rld29yZHN9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJDb2Rld29yZHNcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmNvZGV3b3Jkc30pfWZ1bmN0aW9uIEJpdE1hdHJpeFBhcnNlcihiaXRNYXRyaXgpe3ZhciBkaW1lbnNpb249Yml0TWF0cml4LkRpbWVuc2lvbjtpZigyMT5kaW1lbnNpb258fDEhPSgzJmRpbWVuc2lvbikpdGhyb3dcIkVycm9yIEJpdE1hdHJpeFBhcnNlclwiO3RoaXMuYml0TWF0cml4PWJpdE1hdHJpeCx0aGlzLnBhcnNlZFZlcnNpb249bnVsbCx0aGlzLnBhcnNlZEZvcm1hdEluZm89bnVsbCx0aGlzLmNvcHlCaXQ9ZnVuY3Rpb24oaSxqLHZlcnNpb25CaXRzKXtyZXR1cm4gdGhpcy5iaXRNYXRyaXguZ2V0X1JlbmFtZWQoaSxqKT92ZXJzaW9uQml0czw8MXwxOnZlcnNpb25CaXRzPDwxfSx0aGlzLnJlYWRGb3JtYXRJbmZvcm1hdGlvbj1mdW5jdGlvbigpe2lmKG51bGwhPXRoaXMucGFyc2VkRm9ybWF0SW5mbylyZXR1cm4gdGhpcy5wYXJzZWRGb3JtYXRJbmZvO2Zvcih2YXIgZm9ybWF0SW5mb0JpdHM9MCxpPTA7Nj5pO2krKylmb3JtYXRJbmZvQml0cz10aGlzLmNvcHlCaXQoaSw4LGZvcm1hdEluZm9CaXRzKTtmb3JtYXRJbmZvQml0cz10aGlzLmNvcHlCaXQoNyw4LGZvcm1hdEluZm9CaXRzKSxmb3JtYXRJbmZvQml0cz10aGlzLmNvcHlCaXQoOCw4LGZvcm1hdEluZm9CaXRzKSxmb3JtYXRJbmZvQml0cz10aGlzLmNvcHlCaXQoOCw3LGZvcm1hdEluZm9CaXRzKTtmb3IodmFyIGo9NTtqPj0wO2otLSlmb3JtYXRJbmZvQml0cz10aGlzLmNvcHlCaXQoOCxqLGZvcm1hdEluZm9CaXRzKTtpZih0aGlzLnBhcnNlZEZvcm1hdEluZm89Rm9ybWF0SW5mb3JtYXRpb24uZGVjb2RlRm9ybWF0SW5mb3JtYXRpb24oZm9ybWF0SW5mb0JpdHMpLG51bGwhPXRoaXMucGFyc2VkRm9ybWF0SW5mbylyZXR1cm4gdGhpcy5wYXJzZWRGb3JtYXRJbmZvO3ZhciBkaW1lbnNpb249dGhpcy5iaXRNYXRyaXguRGltZW5zaW9uO2Zvcm1hdEluZm9CaXRzPTA7Zm9yKHZhciBpTWluPWRpbWVuc2lvbi04LGk9ZGltZW5zaW9uLTE7aT49aU1pbjtpLS0pZm9ybWF0SW5mb0JpdHM9dGhpcy5jb3B5Qml0KGksOCxmb3JtYXRJbmZvQml0cyk7Zm9yKHZhciBqPWRpbWVuc2lvbi03O2RpbWVuc2lvbj5qO2orKylmb3JtYXRJbmZvQml0cz10aGlzLmNvcHlCaXQoOCxqLGZvcm1hdEluZm9CaXRzKTtpZih0aGlzLnBhcnNlZEZvcm1hdEluZm89Rm9ybWF0SW5mb3JtYXRpb24uZGVjb2RlRm9ybWF0SW5mb3JtYXRpb24oZm9ybWF0SW5mb0JpdHMpLG51bGwhPXRoaXMucGFyc2VkRm9ybWF0SW5mbylyZXR1cm4gdGhpcy5wYXJzZWRGb3JtYXRJbmZvO3Rocm93XCJFcnJvciByZWFkRm9ybWF0SW5mb3JtYXRpb25cIn0sdGhpcy5yZWFkVmVyc2lvbj1mdW5jdGlvbigpe2lmKG51bGwhPXRoaXMucGFyc2VkVmVyc2lvbilyZXR1cm4gdGhpcy5wYXJzZWRWZXJzaW9uO3ZhciBkaW1lbnNpb249dGhpcy5iaXRNYXRyaXguRGltZW5zaW9uLHByb3Zpc2lvbmFsVmVyc2lvbj1kaW1lbnNpb24tMTc+PjI7aWYoNj49cHJvdmlzaW9uYWxWZXJzaW9uKXJldHVybiBWZXJzaW9uLmdldFZlcnNpb25Gb3JOdW1iZXIocHJvdmlzaW9uYWxWZXJzaW9uKTtmb3IodmFyIHZlcnNpb25CaXRzPTAsaWpNaW49ZGltZW5zaW9uLTExLGo9NTtqPj0wO2otLSlmb3IodmFyIGk9ZGltZW5zaW9uLTk7aT49aWpNaW47aS0tKXZlcnNpb25CaXRzPXRoaXMuY29weUJpdChpLGosdmVyc2lvbkJpdHMpO2lmKHRoaXMucGFyc2VkVmVyc2lvbj1WZXJzaW9uLmRlY29kZVZlcnNpb25JbmZvcm1hdGlvbih2ZXJzaW9uQml0cyksbnVsbCE9dGhpcy5wYXJzZWRWZXJzaW9uJiZ0aGlzLnBhcnNlZFZlcnNpb24uRGltZW5zaW9uRm9yVmVyc2lvbj09ZGltZW5zaW9uKXJldHVybiB0aGlzLnBhcnNlZFZlcnNpb247dmVyc2lvbkJpdHM9MDtmb3IodmFyIGk9NTtpPj0wO2ktLSlmb3IodmFyIGo9ZGltZW5zaW9uLTk7aj49aWpNaW47ai0tKXZlcnNpb25CaXRzPXRoaXMuY29weUJpdChpLGosdmVyc2lvbkJpdHMpO2lmKHRoaXMucGFyc2VkVmVyc2lvbj1WZXJzaW9uLmRlY29kZVZlcnNpb25JbmZvcm1hdGlvbih2ZXJzaW9uQml0cyksbnVsbCE9dGhpcy5wYXJzZWRWZXJzaW9uJiZ0aGlzLnBhcnNlZFZlcnNpb24uRGltZW5zaW9uRm9yVmVyc2lvbj09ZGltZW5zaW9uKXJldHVybiB0aGlzLnBhcnNlZFZlcnNpb247dGhyb3dcIkVycm9yIHJlYWRWZXJzaW9uXCJ9LHRoaXMucmVhZENvZGV3b3Jkcz1mdW5jdGlvbigpe3ZhciBmb3JtYXRJbmZvPXRoaXMucmVhZEZvcm1hdEluZm9ybWF0aW9uKCksdmVyc2lvbj10aGlzLnJlYWRWZXJzaW9uKCksZGF0YU1hc2s9RGF0YU1hc2suZm9yUmVmZXJlbmNlKGZvcm1hdEluZm8uRGF0YU1hc2spLGRpbWVuc2lvbj10aGlzLmJpdE1hdHJpeC5EaW1lbnNpb247ZGF0YU1hc2sudW5tYXNrQml0TWF0cml4KHRoaXMuYml0TWF0cml4LGRpbWVuc2lvbik7Zm9yKHZhciBmdW5jdGlvblBhdHRlcm49dmVyc2lvbi5idWlsZEZ1bmN0aW9uUGF0dGVybigpLHJlYWRpbmdVcD0hMCxyZXN1bHQ9bmV3IEFycmF5KHZlcnNpb24uVG90YWxDb2Rld29yZHMpLHJlc3VsdE9mZnNldD0wLGN1cnJlbnRCeXRlPTAsYml0c1JlYWQ9MCxqPWRpbWVuc2lvbi0xO2o+MDtqLT0yKXs2PT1qJiZqLS07Zm9yKHZhciBjb3VudD0wO2RpbWVuc2lvbj5jb3VudDtjb3VudCsrKWZvcih2YXIgaT1yZWFkaW5nVXA/ZGltZW5zaW9uLTEtY291bnQ6Y291bnQsY29sPTA7Mj5jb2w7Y29sKyspZnVuY3Rpb25QYXR0ZXJuLmdldF9SZW5hbWVkKGotY29sLGkpfHwoYml0c1JlYWQrKyxjdXJyZW50Qnl0ZTw8PTEsdGhpcy5iaXRNYXRyaXguZ2V0X1JlbmFtZWQoai1jb2wsaSkmJihjdXJyZW50Qnl0ZXw9MSksOD09Yml0c1JlYWQmJihyZXN1bHRbcmVzdWx0T2Zmc2V0KytdPWN1cnJlbnRCeXRlLGJpdHNSZWFkPTAsY3VycmVudEJ5dGU9MCkpO3JlYWRpbmdVcF49ITB9aWYocmVzdWx0T2Zmc2V0IT12ZXJzaW9uLlRvdGFsQ29kZXdvcmRzKXRocm93XCJFcnJvciByZWFkQ29kZXdvcmRzXCI7cmV0dXJuIHJlc3VsdH19ZnVuY3Rpb24gRGF0YU1hc2swMDAoKXt0aGlzLnVubWFza0JpdE1hdHJpeD1mdW5jdGlvbihiaXRzLGRpbWVuc2lvbil7Zm9yKHZhciBpPTA7ZGltZW5zaW9uPmk7aSsrKWZvcih2YXIgaj0wO2RpbWVuc2lvbj5qO2orKyl0aGlzLmlzTWFza2VkKGksaikmJmJpdHMuZmxpcChqLGkpfSx0aGlzLmlzTWFza2VkPWZ1bmN0aW9uKGksail7cmV0dXJuIDA9PShpK2omMSl9fWZ1bmN0aW9uIERhdGFNYXNrMDAxKCl7dGhpcy51bm1hc2tCaXRNYXRyaXg9ZnVuY3Rpb24oYml0cyxkaW1lbnNpb24pe2Zvcih2YXIgaT0wO2RpbWVuc2lvbj5pO2krKylmb3IodmFyIGo9MDtkaW1lbnNpb24+ajtqKyspdGhpcy5pc01hc2tlZChpLGopJiZiaXRzLmZsaXAoaixpKX0sdGhpcy5pc01hc2tlZD1mdW5jdGlvbihpLGope3JldHVybiAwPT0oMSZpKX19ZnVuY3Rpb24gRGF0YU1hc2swMTAoKXt0aGlzLnVubWFza0JpdE1hdHJpeD1mdW5jdGlvbihiaXRzLGRpbWVuc2lvbil7Zm9yKHZhciBpPTA7ZGltZW5zaW9uPmk7aSsrKWZvcih2YXIgaj0wO2RpbWVuc2lvbj5qO2orKyl0aGlzLmlzTWFza2VkKGksaikmJmJpdHMuZmxpcChqLGkpfSx0aGlzLmlzTWFza2VkPWZ1bmN0aW9uKGksail7cmV0dXJuIGolMz09MH19ZnVuY3Rpb24gRGF0YU1hc2swMTEoKXt0aGlzLnVubWFza0JpdE1hdHJpeD1mdW5jdGlvbihiaXRzLGRpbWVuc2lvbil7Zm9yKHZhciBpPTA7ZGltZW5zaW9uPmk7aSsrKWZvcih2YXIgaj0wO2RpbWVuc2lvbj5qO2orKyl0aGlzLmlzTWFza2VkKGksaikmJmJpdHMuZmxpcChqLGkpfSx0aGlzLmlzTWFza2VkPWZ1bmN0aW9uKGksail7cmV0dXJuKGkraiklMz09MH19ZnVuY3Rpb24gRGF0YU1hc2sxMDAoKXt0aGlzLnVubWFza0JpdE1hdHJpeD1mdW5jdGlvbihiaXRzLGRpbWVuc2lvbil7Zm9yKHZhciBpPTA7ZGltZW5zaW9uPmk7aSsrKWZvcih2YXIgaj0wO2RpbWVuc2lvbj5qO2orKyl0aGlzLmlzTWFza2VkKGksaikmJmJpdHMuZmxpcChqLGkpfSx0aGlzLmlzTWFza2VkPWZ1bmN0aW9uKGksail7cmV0dXJuIDA9PShVUlNoaWZ0KGksMSkrai8zJjEpfX1mdW5jdGlvbiBEYXRhTWFzazEwMSgpe3RoaXMudW5tYXNrQml0TWF0cml4PWZ1bmN0aW9uKGJpdHMsZGltZW5zaW9uKXtmb3IodmFyIGk9MDtkaW1lbnNpb24+aTtpKyspZm9yKHZhciBqPTA7ZGltZW5zaW9uPmo7aisrKXRoaXMuaXNNYXNrZWQoaSxqKSYmYml0cy5mbGlwKGosaSl9LHRoaXMuaXNNYXNrZWQ9ZnVuY3Rpb24oaSxqKXt2YXIgdGVtcD1pKmo7cmV0dXJuKDEmdGVtcCkrdGVtcCUzPT0wfX1mdW5jdGlvbiBEYXRhTWFzazExMCgpe3RoaXMudW5tYXNrQml0TWF0cml4PWZ1bmN0aW9uKGJpdHMsZGltZW5zaW9uKXtmb3IodmFyIGk9MDtkaW1lbnNpb24+aTtpKyspZm9yKHZhciBqPTA7ZGltZW5zaW9uPmo7aisrKXRoaXMuaXNNYXNrZWQoaSxqKSYmYml0cy5mbGlwKGosaSl9LHRoaXMuaXNNYXNrZWQ9ZnVuY3Rpb24oaSxqKXt2YXIgdGVtcD1pKmo7cmV0dXJuIDA9PSgoMSZ0ZW1wKSt0ZW1wJTMmMSl9fWZ1bmN0aW9uIERhdGFNYXNrMTExKCl7dGhpcy51bm1hc2tCaXRNYXRyaXg9ZnVuY3Rpb24oYml0cyxkaW1lbnNpb24pe2Zvcih2YXIgaT0wO2RpbWVuc2lvbj5pO2krKylmb3IodmFyIGo9MDtkaW1lbnNpb24+ajtqKyspdGhpcy5pc01hc2tlZChpLGopJiZiaXRzLmZsaXAoaixpKX0sdGhpcy5pc01hc2tlZD1mdW5jdGlvbihpLGope3JldHVybiAwPT0oKGkraiYxKStpKmolMyYxKX19ZnVuY3Rpb24gUmVlZFNvbG9tb25EZWNvZGVyKGZpZWxkKXt0aGlzLmZpZWxkPWZpZWxkLHRoaXMuZGVjb2RlPWZ1bmN0aW9uKHJlY2VpdmVkLHR3b1Mpe2Zvcih2YXIgcG9seT1uZXcgR0YyNTZQb2x5KHRoaXMuZmllbGQscmVjZWl2ZWQpLHN5bmRyb21lQ29lZmZpY2llbnRzPW5ldyBBcnJheSh0d29TKSxpPTA7aTxzeW5kcm9tZUNvZWZmaWNpZW50cy5sZW5ndGg7aSsrKXN5bmRyb21lQ29lZmZpY2llbnRzW2ldPTA7Zm9yKHZhciBkYXRhTWF0cml4PSExLG5vRXJyb3I9ITAsaT0wO3R3b1M+aTtpKyspe3ZhciBldmFsPXBvbHkuZXZhbHVhdGVBdCh0aGlzLmZpZWxkLmV4cChkYXRhTWF0cml4P2krMTppKSk7c3luZHJvbWVDb2VmZmljaWVudHNbc3luZHJvbWVDb2VmZmljaWVudHMubGVuZ3RoLTEtaV09ZXZhbCwwIT1ldmFsJiYobm9FcnJvcj0hMSl9aWYoIW5vRXJyb3IpZm9yKHZhciBzeW5kcm9tZT1uZXcgR0YyNTZQb2x5KHRoaXMuZmllbGQsc3luZHJvbWVDb2VmZmljaWVudHMpLHNpZ21hT21lZ2E9dGhpcy5ydW5FdWNsaWRlYW5BbGdvcml0aG0odGhpcy5maWVsZC5idWlsZE1vbm9taWFsKHR3b1MsMSksc3luZHJvbWUsdHdvUyksc2lnbWE9c2lnbWFPbWVnYVswXSxvbWVnYT1zaWdtYU9tZWdhWzFdLGVycm9yTG9jYXRpb25zPXRoaXMuZmluZEVycm9yTG9jYXRpb25zKHNpZ21hKSxlcnJvck1hZ25pdHVkZXM9dGhpcy5maW5kRXJyb3JNYWduaXR1ZGVzKG9tZWdhLGVycm9yTG9jYXRpb25zLGRhdGFNYXRyaXgpLGk9MDtpPGVycm9yTG9jYXRpb25zLmxlbmd0aDtpKyspe3ZhciBwb3NpdGlvbj1yZWNlaXZlZC5sZW5ndGgtMS10aGlzLmZpZWxkLmxvZyhlcnJvckxvY2F0aW9uc1tpXSk7aWYoMD5wb3NpdGlvbil0aHJvd1wiUmVlZFNvbG9tb25FeGNlcHRpb24gQmFkIGVycm9yIGxvY2F0aW9uXCI7cmVjZWl2ZWRbcG9zaXRpb25dPUdGMjU2LmFkZE9yU3VidHJhY3QocmVjZWl2ZWRbcG9zaXRpb25dLGVycm9yTWFnbml0dWRlc1tpXSl9fSx0aGlzLnJ1bkV1Y2xpZGVhbkFsZ29yaXRobT1mdW5jdGlvbihhLGIsUil7aWYoYS5EZWdyZWU8Yi5EZWdyZWUpe3ZhciB0ZW1wPWE7YT1iLGI9dGVtcH1mb3IodmFyIHJMYXN0PWEscj1iLHNMYXN0PXRoaXMuZmllbGQuT25lLHM9dGhpcy5maWVsZC5aZXJvLHRMYXN0PXRoaXMuZmllbGQuWmVybyx0PXRoaXMuZmllbGQuT25lO3IuRGVncmVlPj1NYXRoLmZsb29yKFIvMik7KXt2YXIgckxhc3RMYXN0PXJMYXN0LHNMYXN0TGFzdD1zTGFzdCx0TGFzdExhc3Q9dExhc3Q7aWYockxhc3Q9cixzTGFzdD1zLHRMYXN0PXQsckxhc3QuWmVybyl0aHJvd1wicl97aS0xfSB3YXMgemVyb1wiO3I9ckxhc3RMYXN0O2Zvcih2YXIgcT10aGlzLmZpZWxkLlplcm8sZGVub21pbmF0b3JMZWFkaW5nVGVybT1yTGFzdC5nZXRDb2VmZmljaWVudChyTGFzdC5EZWdyZWUpLGRsdEludmVyc2U9dGhpcy5maWVsZC5pbnZlcnNlKGRlbm9taW5hdG9yTGVhZGluZ1Rlcm0pO3IuRGVncmVlPj1yTGFzdC5EZWdyZWUmJiFyLlplcm87KXt2YXIgZGVncmVlRGlmZj1yLkRlZ3JlZS1yTGFzdC5EZWdyZWUsc2NhbGU9dGhpcy5maWVsZC5tdWx0aXBseShyLmdldENvZWZmaWNpZW50KHIuRGVncmVlKSxkbHRJbnZlcnNlKTtxPXEuYWRkT3JTdWJ0cmFjdCh0aGlzLmZpZWxkLmJ1aWxkTW9ub21pYWwoZGVncmVlRGlmZixzY2FsZSkpLHI9ci5hZGRPclN1YnRyYWN0KHJMYXN0Lm11bHRpcGx5QnlNb25vbWlhbChkZWdyZWVEaWZmLHNjYWxlKSl9cz1xLm11bHRpcGx5MShzTGFzdCkuYWRkT3JTdWJ0cmFjdChzTGFzdExhc3QpLHQ9cS5tdWx0aXBseTEodExhc3QpLmFkZE9yU3VidHJhY3QodExhc3RMYXN0KX12YXIgc2lnbWFUaWxkZUF0WmVybz10LmdldENvZWZmaWNpZW50KDApO2lmKDA9PXNpZ21hVGlsZGVBdFplcm8pdGhyb3dcIlJlZWRTb2xvbW9uRXhjZXB0aW9uIHNpZ21hVGlsZGUoMCkgd2FzIHplcm9cIjt2YXIgaW52ZXJzZT10aGlzLmZpZWxkLmludmVyc2Uoc2lnbWFUaWxkZUF0WmVybyksc2lnbWE9dC5tdWx0aXBseTIoaW52ZXJzZSksb21lZ2E9ci5tdWx0aXBseTIoaW52ZXJzZSk7cmV0dXJuIG5ldyBBcnJheShzaWdtYSxvbWVnYSl9LHRoaXMuZmluZEVycm9yTG9jYXRpb25zPWZ1bmN0aW9uKGVycm9yTG9jYXRvcil7dmFyIG51bUVycm9ycz1lcnJvckxvY2F0b3IuRGVncmVlO2lmKDE9PW51bUVycm9ycylyZXR1cm4gbmV3IEFycmF5KGVycm9yTG9jYXRvci5nZXRDb2VmZmljaWVudCgxKSk7Zm9yKHZhciByZXN1bHQ9bmV3IEFycmF5KG51bUVycm9ycyksZT0wLGk9MTsyNTY+aSYmbnVtRXJyb3JzPmU7aSsrKTA9PWVycm9yTG9jYXRvci5ldmFsdWF0ZUF0KGkpJiYocmVzdWx0W2VdPXRoaXMuZmllbGQuaW52ZXJzZShpKSxlKyspO2lmKGUhPW51bUVycm9ycyl0aHJvd1wiRXJyb3IgbG9jYXRvciBkZWdyZWUgZG9lcyBub3QgbWF0Y2ggbnVtYmVyIG9mIHJvb3RzXCI7cmV0dXJuIHJlc3VsdH0sdGhpcy5maW5kRXJyb3JNYWduaXR1ZGVzPWZ1bmN0aW9uKGVycm9yRXZhbHVhdG9yLGVycm9yTG9jYXRpb25zLGRhdGFNYXRyaXgpe2Zvcih2YXIgcz1lcnJvckxvY2F0aW9ucy5sZW5ndGgscmVzdWx0PW5ldyBBcnJheShzKSxpPTA7cz5pO2krKyl7Zm9yKHZhciB4aUludmVyc2U9dGhpcy5maWVsZC5pbnZlcnNlKGVycm9yTG9jYXRpb25zW2ldKSxkZW5vbWluYXRvcj0xLGo9MDtzPmo7aisrKWkhPWomJihkZW5vbWluYXRvcj10aGlzLmZpZWxkLm11bHRpcGx5KGRlbm9taW5hdG9yLEdGMjU2LmFkZE9yU3VidHJhY3QoMSx0aGlzLmZpZWxkLm11bHRpcGx5KGVycm9yTG9jYXRpb25zW2pdLHhpSW52ZXJzZSkpKSk7cmVzdWx0W2ldPXRoaXMuZmllbGQubXVsdGlwbHkoZXJyb3JFdmFsdWF0b3IuZXZhbHVhdGVBdCh4aUludmVyc2UpLHRoaXMuZmllbGQuaW52ZXJzZShkZW5vbWluYXRvcikpLGRhdGFNYXRyaXgmJihyZXN1bHRbaV09dGhpcy5maWVsZC5tdWx0aXBseShyZXN1bHRbaV0seGlJbnZlcnNlKSl9cmV0dXJuIHJlc3VsdH19ZnVuY3Rpb24gR0YyNTZQb2x5KGZpZWxkLGNvZWZmaWNpZW50cyl7aWYobnVsbD09Y29lZmZpY2llbnRzfHwwPT1jb2VmZmljaWVudHMubGVuZ3RoKXRocm93XCJTeXN0ZW0uQXJndW1lbnRFeGNlcHRpb25cIjt0aGlzLmZpZWxkPWZpZWxkO3ZhciBjb2VmZmljaWVudHNMZW5ndGg9Y29lZmZpY2llbnRzLmxlbmd0aDtpZihjb2VmZmljaWVudHNMZW5ndGg+MSYmMD09Y29lZmZpY2llbnRzWzBdKXtmb3IodmFyIGZpcnN0Tm9uWmVybz0xO2NvZWZmaWNpZW50c0xlbmd0aD5maXJzdE5vblplcm8mJjA9PWNvZWZmaWNpZW50c1tmaXJzdE5vblplcm9dOylmaXJzdE5vblplcm8rKztpZihmaXJzdE5vblplcm89PWNvZWZmaWNpZW50c0xlbmd0aCl0aGlzLmNvZWZmaWNpZW50cz1maWVsZC5aZXJvLmNvZWZmaWNpZW50cztlbHNle3RoaXMuY29lZmZpY2llbnRzPW5ldyBBcnJheShjb2VmZmljaWVudHNMZW5ndGgtZmlyc3ROb25aZXJvKTtmb3IodmFyIGk9MDtpPHRoaXMuY29lZmZpY2llbnRzLmxlbmd0aDtpKyspdGhpcy5jb2VmZmljaWVudHNbaV09MDtmb3IodmFyIGNpPTA7Y2k8dGhpcy5jb2VmZmljaWVudHMubGVuZ3RoO2NpKyspdGhpcy5jb2VmZmljaWVudHNbY2ldPWNvZWZmaWNpZW50c1tmaXJzdE5vblplcm8rY2ldfX1lbHNlIHRoaXMuY29lZmZpY2llbnRzPWNvZWZmaWNpZW50czt0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJaZXJvXCIsZnVuY3Rpb24oKXtyZXR1cm4gMD09dGhpcy5jb2VmZmljaWVudHNbMF19KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJEZWdyZWVcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmNvZWZmaWNpZW50cy5sZW5ndGgtMX0pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkNvZWZmaWNpZW50c1wiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuY29lZmZpY2llbnRzfSksdGhpcy5nZXRDb2VmZmljaWVudD1mdW5jdGlvbihkZWdyZWUpe3JldHVybiB0aGlzLmNvZWZmaWNpZW50c1t0aGlzLmNvZWZmaWNpZW50cy5sZW5ndGgtMS1kZWdyZWVdfSx0aGlzLmV2YWx1YXRlQXQ9ZnVuY3Rpb24oYSl7aWYoMD09YSlyZXR1cm4gdGhpcy5nZXRDb2VmZmljaWVudCgwKTt2YXIgc2l6ZT10aGlzLmNvZWZmaWNpZW50cy5sZW5ndGg7aWYoMT09YSl7Zm9yKHZhciByZXN1bHQ9MCxpPTA7c2l6ZT5pO2krKylyZXN1bHQ9R0YyNTYuYWRkT3JTdWJ0cmFjdChyZXN1bHQsdGhpcy5jb2VmZmljaWVudHNbaV0pO3JldHVybiByZXN1bHR9Zm9yKHZhciByZXN1bHQyPXRoaXMuY29lZmZpY2llbnRzWzBdLGk9MTtzaXplPmk7aSsrKXJlc3VsdDI9R0YyNTYuYWRkT3JTdWJ0cmFjdCh0aGlzLmZpZWxkLm11bHRpcGx5KGEscmVzdWx0MiksdGhpcy5jb2VmZmljaWVudHNbaV0pO3JldHVybiByZXN1bHQyfSx0aGlzLmFkZE9yU3VidHJhY3Q9ZnVuY3Rpb24ob3RoZXIpe2lmKHRoaXMuZmllbGQhPW90aGVyLmZpZWxkKXRocm93XCJHRjI1NlBvbHlzIGRvIG5vdCBoYXZlIHNhbWUgR0YyNTYgZmllbGRcIjtpZih0aGlzLlplcm8pcmV0dXJuIG90aGVyO2lmKG90aGVyLlplcm8pcmV0dXJuIHRoaXM7dmFyIHNtYWxsZXJDb2VmZmljaWVudHM9dGhpcy5jb2VmZmljaWVudHMsbGFyZ2VyQ29lZmZpY2llbnRzPW90aGVyLmNvZWZmaWNpZW50cztpZihzbWFsbGVyQ29lZmZpY2llbnRzLmxlbmd0aD5sYXJnZXJDb2VmZmljaWVudHMubGVuZ3RoKXt2YXIgdGVtcD1zbWFsbGVyQ29lZmZpY2llbnRzO3NtYWxsZXJDb2VmZmljaWVudHM9bGFyZ2VyQ29lZmZpY2llbnRzLGxhcmdlckNvZWZmaWNpZW50cz10ZW1wfWZvcih2YXIgc3VtRGlmZj1uZXcgQXJyYXkobGFyZ2VyQ29lZmZpY2llbnRzLmxlbmd0aCksbGVuZ3RoRGlmZj1sYXJnZXJDb2VmZmljaWVudHMubGVuZ3RoLXNtYWxsZXJDb2VmZmljaWVudHMubGVuZ3RoLGNpPTA7bGVuZ3RoRGlmZj5jaTtjaSsrKXN1bURpZmZbY2ldPWxhcmdlckNvZWZmaWNpZW50c1tjaV07Zm9yKHZhciBpPWxlbmd0aERpZmY7aTxsYXJnZXJDb2VmZmljaWVudHMubGVuZ3RoO2krKylzdW1EaWZmW2ldPUdGMjU2LmFkZE9yU3VidHJhY3Qoc21hbGxlckNvZWZmaWNpZW50c1tpLWxlbmd0aERpZmZdLGxhcmdlckNvZWZmaWNpZW50c1tpXSk7cmV0dXJuIG5ldyBHRjI1NlBvbHkoZmllbGQsc3VtRGlmZil9LHRoaXMubXVsdGlwbHkxPWZ1bmN0aW9uKG90aGVyKXtpZih0aGlzLmZpZWxkIT1vdGhlci5maWVsZCl0aHJvd1wiR0YyNTZQb2x5cyBkbyBub3QgaGF2ZSBzYW1lIEdGMjU2IGZpZWxkXCI7aWYodGhpcy5aZXJvfHxvdGhlci5aZXJvKXJldHVybiB0aGlzLmZpZWxkLlplcm87Zm9yKHZhciBhQ29lZmZpY2llbnRzPXRoaXMuY29lZmZpY2llbnRzLGFMZW5ndGg9YUNvZWZmaWNpZW50cy5sZW5ndGgsYkNvZWZmaWNpZW50cz1vdGhlci5jb2VmZmljaWVudHMsYkxlbmd0aD1iQ29lZmZpY2llbnRzLmxlbmd0aCxwcm9kdWN0PW5ldyBBcnJheShhTGVuZ3RoK2JMZW5ndGgtMSksaT0wO2FMZW5ndGg+aTtpKyspZm9yKHZhciBhQ29lZmY9YUNvZWZmaWNpZW50c1tpXSxqPTA7Ykxlbmd0aD5qO2orKylwcm9kdWN0W2kral09R0YyNTYuYWRkT3JTdWJ0cmFjdChwcm9kdWN0W2kral0sdGhpcy5maWVsZC5tdWx0aXBseShhQ29lZmYsYkNvZWZmaWNpZW50c1tqXSkpO3JldHVybiBuZXcgR0YyNTZQb2x5KHRoaXMuZmllbGQscHJvZHVjdCl9LHRoaXMubXVsdGlwbHkyPWZ1bmN0aW9uKHNjYWxhcil7aWYoMD09c2NhbGFyKXJldHVybiB0aGlzLmZpZWxkLlplcm87aWYoMT09c2NhbGFyKXJldHVybiB0aGlzO2Zvcih2YXIgc2l6ZT10aGlzLmNvZWZmaWNpZW50cy5sZW5ndGgscHJvZHVjdD1uZXcgQXJyYXkoc2l6ZSksaT0wO3NpemU+aTtpKyspcHJvZHVjdFtpXT10aGlzLmZpZWxkLm11bHRpcGx5KHRoaXMuY29lZmZpY2llbnRzW2ldLHNjYWxhcik7cmV0dXJuIG5ldyBHRjI1NlBvbHkodGhpcy5maWVsZCxwcm9kdWN0KX0sdGhpcy5tdWx0aXBseUJ5TW9ub21pYWw9ZnVuY3Rpb24oZGVncmVlLGNvZWZmaWNpZW50KXtpZigwPmRlZ3JlZSl0aHJvd1wiU3lzdGVtLkFyZ3VtZW50RXhjZXB0aW9uXCI7aWYoMD09Y29lZmZpY2llbnQpcmV0dXJuIHRoaXMuZmllbGQuWmVybztmb3IodmFyIHNpemU9dGhpcy5jb2VmZmljaWVudHMubGVuZ3RoLHByb2R1Y3Q9bmV3IEFycmF5KHNpemUrZGVncmVlKSxpPTA7aTxwcm9kdWN0Lmxlbmd0aDtpKyspcHJvZHVjdFtpXT0wO2Zvcih2YXIgaT0wO3NpemU+aTtpKyspcHJvZHVjdFtpXT10aGlzLmZpZWxkLm11bHRpcGx5KHRoaXMuY29lZmZpY2llbnRzW2ldLGNvZWZmaWNpZW50KTtyZXR1cm4gbmV3IEdGMjU2UG9seSh0aGlzLmZpZWxkLHByb2R1Y3QpfSx0aGlzLmRpdmlkZT1mdW5jdGlvbihvdGhlcil7aWYodGhpcy5maWVsZCE9b3RoZXIuZmllbGQpdGhyb3dcIkdGMjU2UG9seXMgZG8gbm90IGhhdmUgc2FtZSBHRjI1NiBmaWVsZFwiO2lmKG90aGVyLlplcm8pdGhyb3dcIkRpdmlkZSBieSAwXCI7Zm9yKHZhciBxdW90aWVudD10aGlzLmZpZWxkLlplcm8scmVtYWluZGVyPXRoaXMsZGVub21pbmF0b3JMZWFkaW5nVGVybT1vdGhlci5nZXRDb2VmZmljaWVudChvdGhlci5EZWdyZWUpLGludmVyc2VEZW5vbWluYXRvckxlYWRpbmdUZXJtPXRoaXMuZmllbGQuaW52ZXJzZShkZW5vbWluYXRvckxlYWRpbmdUZXJtKTtyZW1haW5kZXIuRGVncmVlPj1vdGhlci5EZWdyZWUmJiFyZW1haW5kZXIuWmVybzspe1xyXG4gICAgdmFyIGRlZ3JlZURpZmZlcmVuY2U9cmVtYWluZGVyLkRlZ3JlZS1vdGhlci5EZWdyZWUsc2NhbGU9dGhpcy5maWVsZC5tdWx0aXBseShyZW1haW5kZXIuZ2V0Q29lZmZpY2llbnQocmVtYWluZGVyLkRlZ3JlZSksaW52ZXJzZURlbm9taW5hdG9yTGVhZGluZ1Rlcm0pLHRlcm09b3RoZXIubXVsdGlwbHlCeU1vbm9taWFsKGRlZ3JlZURpZmZlcmVuY2Usc2NhbGUpLGl0ZXJhdGlvblF1b3RpZW50PXRoaXMuZmllbGQuYnVpbGRNb25vbWlhbChkZWdyZWVEaWZmZXJlbmNlLHNjYWxlKTtxdW90aWVudD1xdW90aWVudC5hZGRPclN1YnRyYWN0KGl0ZXJhdGlvblF1b3RpZW50KSxyZW1haW5kZXI9cmVtYWluZGVyLmFkZE9yU3VidHJhY3QodGVybSl9cmV0dXJuIG5ldyBBcnJheShxdW90aWVudCxyZW1haW5kZXIpfX1mdW5jdGlvbiBHRjI1NihwcmltaXRpdmUpe3RoaXMuZXhwVGFibGU9bmV3IEFycmF5KDI1NiksdGhpcy5sb2dUYWJsZT1uZXcgQXJyYXkoMjU2KTtmb3IodmFyIHg9MSxpPTA7MjU2Pmk7aSsrKXRoaXMuZXhwVGFibGVbaV09eCx4PDw9MSx4Pj0yNTYmJih4Xj1wcmltaXRpdmUpO2Zvcih2YXIgaT0wOzI1NT5pO2krKyl0aGlzLmxvZ1RhYmxlW3RoaXMuZXhwVGFibGVbaV1dPWk7dmFyIGF0MD1uZXcgQXJyYXkoMSk7YXQwWzBdPTAsdGhpcy56ZXJvPW5ldyBHRjI1NlBvbHkodGhpcyxuZXcgQXJyYXkoYXQwKSk7dmFyIGF0MT1uZXcgQXJyYXkoMSk7YXQxWzBdPTEsdGhpcy5vbmU9bmV3IEdGMjU2UG9seSh0aGlzLG5ldyBBcnJheShhdDEpKSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJaZXJvXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy56ZXJvfSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiT25lXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5vbmV9KSx0aGlzLmJ1aWxkTW9ub21pYWw9ZnVuY3Rpb24oZGVncmVlLGNvZWZmaWNpZW50KXtpZigwPmRlZ3JlZSl0aHJvd1wiU3lzdGVtLkFyZ3VtZW50RXhjZXB0aW9uXCI7aWYoMD09Y29lZmZpY2llbnQpcmV0dXJuIHplcm87Zm9yKHZhciBjb2VmZmljaWVudHM9bmV3IEFycmF5KGRlZ3JlZSsxKSxpPTA7aTxjb2VmZmljaWVudHMubGVuZ3RoO2krKyljb2VmZmljaWVudHNbaV09MDtyZXR1cm4gY29lZmZpY2llbnRzWzBdPWNvZWZmaWNpZW50LG5ldyBHRjI1NlBvbHkodGhpcyxjb2VmZmljaWVudHMpfSx0aGlzLmV4cD1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5leHBUYWJsZVthXX0sdGhpcy5sb2c9ZnVuY3Rpb24oYSl7aWYoMD09YSl0aHJvd1wiU3lzdGVtLkFyZ3VtZW50RXhjZXB0aW9uXCI7cmV0dXJuIHRoaXMubG9nVGFibGVbYV19LHRoaXMuaW52ZXJzZT1mdW5jdGlvbihhKXtpZigwPT1hKXRocm93XCJTeXN0ZW0uQXJpdGhtZXRpY0V4Y2VwdGlvblwiO3JldHVybiB0aGlzLmV4cFRhYmxlWzI1NS10aGlzLmxvZ1RhYmxlW2FdXX0sdGhpcy5tdWx0aXBseT1mdW5jdGlvbihhLGIpe3JldHVybiAwPT1hfHwwPT1iPzA6MT09YT9iOjE9PWI/YTp0aGlzLmV4cFRhYmxlWyh0aGlzLmxvZ1RhYmxlW2FdK3RoaXMubG9nVGFibGVbYl0pJTI1NV19fWZ1bmN0aW9uIFVSU2hpZnQobnVtYmVyLGJpdHMpe3JldHVybiBudW1iZXI+PTA/bnVtYmVyPj5iaXRzOihudW1iZXI+PmJpdHMpKygyPDx+Yml0cyl9ZnVuY3Rpb24gRmluZGVyUGF0dGVybihwb3NYLHBvc1ksZXN0aW1hdGVkTW9kdWxlU2l6ZSl7dGhpcy54PXBvc1gsdGhpcy55PXBvc1ksdGhpcy5jb3VudD0xLHRoaXMuZXN0aW1hdGVkTW9kdWxlU2l6ZT1lc3RpbWF0ZWRNb2R1bGVTaXplLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkVzdGltYXRlZE1vZHVsZVNpemVcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmVzdGltYXRlZE1vZHVsZVNpemV9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJDb3VudFwiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuY291bnR9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJYXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy54fSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiWVwiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMueX0pLHRoaXMuaW5jcmVtZW50Q291bnQ9ZnVuY3Rpb24oKXt0aGlzLmNvdW50Kyt9LHRoaXMuYWJvdXRFcXVhbHM9ZnVuY3Rpb24obW9kdWxlU2l6ZSxpLGope2lmKE1hdGguYWJzKGktdGhpcy55KTw9bW9kdWxlU2l6ZSYmTWF0aC5hYnMoai10aGlzLngpPD1tb2R1bGVTaXplKXt2YXIgbW9kdWxlU2l6ZURpZmY9TWF0aC5hYnMobW9kdWxlU2l6ZS10aGlzLmVzdGltYXRlZE1vZHVsZVNpemUpO3JldHVybiAxPj1tb2R1bGVTaXplRGlmZnx8bW9kdWxlU2l6ZURpZmYvdGhpcy5lc3RpbWF0ZWRNb2R1bGVTaXplPD0xfXJldHVybiExfX1mdW5jdGlvbiBGaW5kZXJQYXR0ZXJuSW5mbyhwYXR0ZXJuQ2VudGVycyl7dGhpcy5ib3R0b21MZWZ0PXBhdHRlcm5DZW50ZXJzWzBdLHRoaXMudG9wTGVmdD1wYXR0ZXJuQ2VudGVyc1sxXSx0aGlzLnRvcFJpZ2h0PXBhdHRlcm5DZW50ZXJzWzJdLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkJvdHRvbUxlZnRcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmJvdHRvbUxlZnR9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJUb3BMZWZ0XCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50b3BMZWZ0fSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiVG9wUmlnaHRcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLnRvcFJpZ2h0fSl9ZnVuY3Rpb24gRmluZGVyUGF0dGVybkZpbmRlcigpe3RoaXMuaW1hZ2U9bnVsbCx0aGlzLnBvc3NpYmxlQ2VudGVycz1bXSx0aGlzLmhhc1NraXBwZWQ9ITEsdGhpcy5jcm9zc0NoZWNrU3RhdGVDb3VudD1uZXcgQXJyYXkoMCwwLDAsMCwwKSx0aGlzLnJlc3VsdFBvaW50Q2FsbGJhY2s9bnVsbCx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJDcm9zc0NoZWNrU3RhdGVDb3VudFwiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuY3Jvc3NDaGVja1N0YXRlQ291bnRbMF09MCx0aGlzLmNyb3NzQ2hlY2tTdGF0ZUNvdW50WzFdPTAsdGhpcy5jcm9zc0NoZWNrU3RhdGVDb3VudFsyXT0wLHRoaXMuY3Jvc3NDaGVja1N0YXRlQ291bnRbM109MCx0aGlzLmNyb3NzQ2hlY2tTdGF0ZUNvdW50WzRdPTAsdGhpcy5jcm9zc0NoZWNrU3RhdGVDb3VudH0pLHRoaXMuZm91bmRQYXR0ZXJuQ3Jvc3M9ZnVuY3Rpb24oc3RhdGVDb3VudCl7Zm9yKHZhciB0b3RhbE1vZHVsZVNpemU9MCxpPTA7NT5pO2krKyl7dmFyIGNvdW50PXN0YXRlQ291bnRbaV07aWYoMD09Y291bnQpcmV0dXJuITE7dG90YWxNb2R1bGVTaXplKz1jb3VudH1pZig3PnRvdGFsTW9kdWxlU2l6ZSlyZXR1cm4hMTt2YXIgbW9kdWxlU2l6ZT1NYXRoLmZsb29yKCh0b3RhbE1vZHVsZVNpemU8PElOVEVHRVJfTUFUSF9TSElGVCkvNyksbWF4VmFyaWFuY2U9TWF0aC5mbG9vcihtb2R1bGVTaXplLzIpO3JldHVybiBNYXRoLmFicyhtb2R1bGVTaXplLShzdGF0ZUNvdW50WzBdPDxJTlRFR0VSX01BVEhfU0hJRlQpKTxtYXhWYXJpYW5jZSYmTWF0aC5hYnMobW9kdWxlU2l6ZS0oc3RhdGVDb3VudFsxXTw8SU5URUdFUl9NQVRIX1NISUZUKSk8bWF4VmFyaWFuY2UmJk1hdGguYWJzKDMqbW9kdWxlU2l6ZS0oc3RhdGVDb3VudFsyXTw8SU5URUdFUl9NQVRIX1NISUZUKSk8MyptYXhWYXJpYW5jZSYmTWF0aC5hYnMobW9kdWxlU2l6ZS0oc3RhdGVDb3VudFszXTw8SU5URUdFUl9NQVRIX1NISUZUKSk8bWF4VmFyaWFuY2UmJk1hdGguYWJzKG1vZHVsZVNpemUtKHN0YXRlQ291bnRbNF08PElOVEVHRVJfTUFUSF9TSElGVCkpPG1heFZhcmlhbmNlfSx0aGlzLmNlbnRlckZyb21FbmQ9ZnVuY3Rpb24oc3RhdGVDb3VudCxlbmQpe3JldHVybiBlbmQtc3RhdGVDb3VudFs0XS1zdGF0ZUNvdW50WzNdLXN0YXRlQ291bnRbMl0vMn0sdGhpcy5jcm9zc0NoZWNrVmVydGljYWw9ZnVuY3Rpb24oc3RhcnRJLGNlbnRlckosbWF4Q291bnQsb3JpZ2luYWxTdGF0ZUNvdW50VG90YWwpe2Zvcih2YXIgaW1hZ2U9dGhpcy5pbWFnZSxtYXhJPXFyY29kZS5oZWlnaHQsc3RhdGVDb3VudD10aGlzLkNyb3NzQ2hlY2tTdGF0ZUNvdW50LGk9c3RhcnRJO2k+PTAmJmltYWdlW2NlbnRlckoraSpxcmNvZGUud2lkdGhdOylzdGF0ZUNvdW50WzJdKyssaS0tO2lmKDA+aSlyZXR1cm4gTmFOO2Zvcig7aT49MCYmIWltYWdlW2NlbnRlckoraSpxcmNvZGUud2lkdGhdJiZzdGF0ZUNvdW50WzFdPD1tYXhDb3VudDspc3RhdGVDb3VudFsxXSsrLGktLTtpZigwPml8fHN0YXRlQ291bnRbMV0+bWF4Q291bnQpcmV0dXJuIE5hTjtmb3IoO2k+PTAmJmltYWdlW2NlbnRlckoraSpxcmNvZGUud2lkdGhdJiZzdGF0ZUNvdW50WzBdPD1tYXhDb3VudDspc3RhdGVDb3VudFswXSsrLGktLTtpZihzdGF0ZUNvdW50WzBdPm1heENvdW50KXJldHVybiBOYU47Zm9yKGk9c3RhcnRJKzE7bWF4ST5pJiZpbWFnZVtjZW50ZXJKK2kqcXJjb2RlLndpZHRoXTspc3RhdGVDb3VudFsyXSsrLGkrKztpZihpPT1tYXhJKXJldHVybiBOYU47Zm9yKDttYXhJPmkmJiFpbWFnZVtjZW50ZXJKK2kqcXJjb2RlLndpZHRoXSYmc3RhdGVDb3VudFszXTxtYXhDb3VudDspc3RhdGVDb3VudFszXSsrLGkrKztpZihpPT1tYXhJfHxzdGF0ZUNvdW50WzNdPj1tYXhDb3VudClyZXR1cm4gTmFOO2Zvcig7bWF4ST5pJiZpbWFnZVtjZW50ZXJKK2kqcXJjb2RlLndpZHRoXSYmc3RhdGVDb3VudFs0XTxtYXhDb3VudDspc3RhdGVDb3VudFs0XSsrLGkrKztpZihzdGF0ZUNvdW50WzRdPj1tYXhDb3VudClyZXR1cm4gTmFOO3ZhciBzdGF0ZUNvdW50VG90YWw9c3RhdGVDb3VudFswXStzdGF0ZUNvdW50WzFdK3N0YXRlQ291bnRbMl0rc3RhdGVDb3VudFszXStzdGF0ZUNvdW50WzRdO3JldHVybiA1Kk1hdGguYWJzKHN0YXRlQ291bnRUb3RhbC1vcmlnaW5hbFN0YXRlQ291bnRUb3RhbCk+PTIqb3JpZ2luYWxTdGF0ZUNvdW50VG90YWw/TmFOOnRoaXMuZm91bmRQYXR0ZXJuQ3Jvc3Moc3RhdGVDb3VudCk/dGhpcy5jZW50ZXJGcm9tRW5kKHN0YXRlQ291bnQsaSk6TmFOfSx0aGlzLmNyb3NzQ2hlY2tIb3Jpem9udGFsPWZ1bmN0aW9uKHN0YXJ0SixjZW50ZXJJLG1heENvdW50LG9yaWdpbmFsU3RhdGVDb3VudFRvdGFsKXtmb3IodmFyIGltYWdlPXRoaXMuaW1hZ2UsbWF4Sj1xcmNvZGUud2lkdGgsc3RhdGVDb3VudD10aGlzLkNyb3NzQ2hlY2tTdGF0ZUNvdW50LGo9c3RhcnRKO2o+PTAmJmltYWdlW2orY2VudGVySSpxcmNvZGUud2lkdGhdOylzdGF0ZUNvdW50WzJdKyssai0tO2lmKDA+ailyZXR1cm4gTmFOO2Zvcig7aj49MCYmIWltYWdlW2orY2VudGVySSpxcmNvZGUud2lkdGhdJiZzdGF0ZUNvdW50WzFdPD1tYXhDb3VudDspc3RhdGVDb3VudFsxXSsrLGotLTtpZigwPmp8fHN0YXRlQ291bnRbMV0+bWF4Q291bnQpcmV0dXJuIE5hTjtmb3IoO2o+PTAmJmltYWdlW2orY2VudGVySSpxcmNvZGUud2lkdGhdJiZzdGF0ZUNvdW50WzBdPD1tYXhDb3VudDspc3RhdGVDb3VudFswXSsrLGotLTtpZihzdGF0ZUNvdW50WzBdPm1heENvdW50KXJldHVybiBOYU47Zm9yKGo9c3RhcnRKKzE7bWF4Sj5qJiZpbWFnZVtqK2NlbnRlckkqcXJjb2RlLndpZHRoXTspc3RhdGVDb3VudFsyXSsrLGorKztpZihqPT1tYXhKKXJldHVybiBOYU47Zm9yKDttYXhKPmomJiFpbWFnZVtqK2NlbnRlckkqcXJjb2RlLndpZHRoXSYmc3RhdGVDb3VudFszXTxtYXhDb3VudDspc3RhdGVDb3VudFszXSsrLGorKztpZihqPT1tYXhKfHxzdGF0ZUNvdW50WzNdPj1tYXhDb3VudClyZXR1cm4gTmFOO2Zvcig7bWF4Sj5qJiZpbWFnZVtqK2NlbnRlckkqcXJjb2RlLndpZHRoXSYmc3RhdGVDb3VudFs0XTxtYXhDb3VudDspc3RhdGVDb3VudFs0XSsrLGorKztpZihzdGF0ZUNvdW50WzRdPj1tYXhDb3VudClyZXR1cm4gTmFOO3ZhciBzdGF0ZUNvdW50VG90YWw9c3RhdGVDb3VudFswXStzdGF0ZUNvdW50WzFdK3N0YXRlQ291bnRbMl0rc3RhdGVDb3VudFszXStzdGF0ZUNvdW50WzRdO3JldHVybiA1Kk1hdGguYWJzKHN0YXRlQ291bnRUb3RhbC1vcmlnaW5hbFN0YXRlQ291bnRUb3RhbCk+PW9yaWdpbmFsU3RhdGVDb3VudFRvdGFsP05hTjp0aGlzLmZvdW5kUGF0dGVybkNyb3NzKHN0YXRlQ291bnQpP3RoaXMuY2VudGVyRnJvbUVuZChzdGF0ZUNvdW50LGopOk5hTn0sdGhpcy5oYW5kbGVQb3NzaWJsZUNlbnRlcj1mdW5jdGlvbihzdGF0ZUNvdW50LGksail7dmFyIHN0YXRlQ291bnRUb3RhbD1zdGF0ZUNvdW50WzBdK3N0YXRlQ291bnRbMV0rc3RhdGVDb3VudFsyXStzdGF0ZUNvdW50WzNdK3N0YXRlQ291bnRbNF0sY2VudGVySj10aGlzLmNlbnRlckZyb21FbmQoc3RhdGVDb3VudCxqKSxjZW50ZXJJPXRoaXMuY3Jvc3NDaGVja1ZlcnRpY2FsKGksTWF0aC5mbG9vcihjZW50ZXJKKSxzdGF0ZUNvdW50WzJdLHN0YXRlQ291bnRUb3RhbCk7aWYoIWlzTmFOKGNlbnRlckkpJiYoY2VudGVySj10aGlzLmNyb3NzQ2hlY2tIb3Jpem9udGFsKE1hdGguZmxvb3IoY2VudGVySiksTWF0aC5mbG9vcihjZW50ZXJJKSxzdGF0ZUNvdW50WzJdLHN0YXRlQ291bnRUb3RhbCksIWlzTmFOKGNlbnRlckopKSl7Zm9yKHZhciBlc3RpbWF0ZWRNb2R1bGVTaXplPXN0YXRlQ291bnRUb3RhbC83LGZvdW5kPSExLG1heD10aGlzLnBvc3NpYmxlQ2VudGVycy5sZW5ndGgsaW5kZXg9MDttYXg+aW5kZXg7aW5kZXgrKyl7dmFyIGNlbnRlcj10aGlzLnBvc3NpYmxlQ2VudGVyc1tpbmRleF07aWYoY2VudGVyLmFib3V0RXF1YWxzKGVzdGltYXRlZE1vZHVsZVNpemUsY2VudGVySSxjZW50ZXJKKSl7Y2VudGVyLmluY3JlbWVudENvdW50KCksZm91bmQ9ITA7YnJlYWt9fWlmKCFmb3VuZCl7dmFyIHBvaW50PW5ldyBGaW5kZXJQYXR0ZXJuKGNlbnRlckosY2VudGVySSxlc3RpbWF0ZWRNb2R1bGVTaXplKTt0aGlzLnBvc3NpYmxlQ2VudGVycy5wdXNoKHBvaW50KSxudWxsIT10aGlzLnJlc3VsdFBvaW50Q2FsbGJhY2smJnRoaXMucmVzdWx0UG9pbnRDYWxsYmFjay5mb3VuZFBvc3NpYmxlUmVzdWx0UG9pbnQocG9pbnQpfXJldHVybiEwfXJldHVybiExfSx0aGlzLnNlbGVjdEJlc3RQYXR0ZXJucz1mdW5jdGlvbigpe3ZhciBzdGFydFNpemU9dGhpcy5wb3NzaWJsZUNlbnRlcnMubGVuZ3RoO2lmKDM+c3RhcnRTaXplKXRocm93XCJDb3VsZG4ndCBmaW5kIGVub3VnaCBmaW5kZXIgcGF0dGVybnNcIjtpZihzdGFydFNpemU+Myl7Zm9yKHZhciB0b3RhbE1vZHVsZVNpemU9MCxpPTA7c3RhcnRTaXplPmk7aSsrKXRvdGFsTW9kdWxlU2l6ZSs9dGhpcy5wb3NzaWJsZUNlbnRlcnNbaV0uRXN0aW1hdGVkTW9kdWxlU2l6ZTtmb3IodmFyIGF2ZXJhZ2U9dG90YWxNb2R1bGVTaXplL3N0YXJ0U2l6ZSxpPTA7aTx0aGlzLnBvc3NpYmxlQ2VudGVycy5sZW5ndGgmJnRoaXMucG9zc2libGVDZW50ZXJzLmxlbmd0aD4zO2krKyl7dmFyIHBhdHRlcm49dGhpcy5wb3NzaWJsZUNlbnRlcnNbaV07TWF0aC5hYnMocGF0dGVybi5Fc3RpbWF0ZWRNb2R1bGVTaXplLWF2ZXJhZ2UpPi4yKmF2ZXJhZ2UmJih0aGlzLnBvc3NpYmxlQ2VudGVycy5yZW1vdmUoaSksaS0tKX19cmV0dXJuIHRoaXMucG9zc2libGVDZW50ZXJzLkNvdW50PjMsbmV3IEFycmF5KHRoaXMucG9zc2libGVDZW50ZXJzWzBdLHRoaXMucG9zc2libGVDZW50ZXJzWzFdLHRoaXMucG9zc2libGVDZW50ZXJzWzJdKX0sdGhpcy5maW5kUm93U2tpcD1mdW5jdGlvbigpe3ZhciBtYXg9dGhpcy5wb3NzaWJsZUNlbnRlcnMubGVuZ3RoO2lmKDE+PW1heClyZXR1cm4gMDtmb3IodmFyIGZpcnN0Q29uZmlybWVkQ2VudGVyPW51bGwsaT0wO21heD5pO2krKyl7dmFyIGNlbnRlcj10aGlzLnBvc3NpYmxlQ2VudGVyc1tpXTtpZihjZW50ZXIuQ291bnQ+PUNFTlRFUl9RVU9SVU0pe2lmKG51bGwhPWZpcnN0Q29uZmlybWVkQ2VudGVyKXJldHVybiB0aGlzLmhhc1NraXBwZWQ9ITAsTWF0aC5mbG9vcigoTWF0aC5hYnMoZmlyc3RDb25maXJtZWRDZW50ZXIuWC1jZW50ZXIuWCktTWF0aC5hYnMoZmlyc3RDb25maXJtZWRDZW50ZXIuWS1jZW50ZXIuWSkpLzIpO2ZpcnN0Q29uZmlybWVkQ2VudGVyPWNlbnRlcn19cmV0dXJuIDB9LHRoaXMuaGF2ZU11bHRpcGx5Q29uZmlybWVkQ2VudGVycz1mdW5jdGlvbigpe2Zvcih2YXIgY29uZmlybWVkQ291bnQ9MCx0b3RhbE1vZHVsZVNpemU9MCxtYXg9dGhpcy5wb3NzaWJsZUNlbnRlcnMubGVuZ3RoLGk9MDttYXg+aTtpKyspe3ZhciBwYXR0ZXJuPXRoaXMucG9zc2libGVDZW50ZXJzW2ldO3BhdHRlcm4uQ291bnQ+PUNFTlRFUl9RVU9SVU0mJihjb25maXJtZWRDb3VudCsrLHRvdGFsTW9kdWxlU2l6ZSs9cGF0dGVybi5Fc3RpbWF0ZWRNb2R1bGVTaXplKX1pZigzPmNvbmZpcm1lZENvdW50KXJldHVybiExO2Zvcih2YXIgYXZlcmFnZT10b3RhbE1vZHVsZVNpemUvbWF4LHRvdGFsRGV2aWF0aW9uPTAsaT0wO21heD5pO2krKylwYXR0ZXJuPXRoaXMucG9zc2libGVDZW50ZXJzW2ldLHRvdGFsRGV2aWF0aW9uKz1NYXRoLmFicyhwYXR0ZXJuLkVzdGltYXRlZE1vZHVsZVNpemUtYXZlcmFnZSk7cmV0dXJuLjA1KnRvdGFsTW9kdWxlU2l6ZT49dG90YWxEZXZpYXRpb259LHRoaXMuZmluZEZpbmRlclBhdHRlcm49ZnVuY3Rpb24oaW1hZ2Upe3ZhciB0cnlIYXJkZXI9ITE7dGhpcy5pbWFnZT1pbWFnZTt2YXIgbWF4ST1xcmNvZGUuaGVpZ2h0LG1heEo9cXJjb2RlLndpZHRoLGlTa2lwPU1hdGguZmxvb3IoMyptYXhJLyg0Kk1BWF9NT0RVTEVTKSk7KE1JTl9TS0lQPmlTa2lwfHx0cnlIYXJkZXIpJiYoaVNraXA9TUlOX1NLSVApO2Zvcih2YXIgZG9uZT0hMSxzdGF0ZUNvdW50PW5ldyBBcnJheSg1KSxpPWlTa2lwLTE7bWF4ST5pJiYhZG9uZTtpKz1pU2tpcCl7c3RhdGVDb3VudFswXT0wLHN0YXRlQ291bnRbMV09MCxzdGF0ZUNvdW50WzJdPTAsc3RhdGVDb3VudFszXT0wLHN0YXRlQ291bnRbNF09MDtmb3IodmFyIGN1cnJlbnRTdGF0ZT0wLGo9MDttYXhKPmo7aisrKWlmKGltYWdlW2oraSpxcmNvZGUud2lkdGhdKTE9PSgxJmN1cnJlbnRTdGF0ZSkmJmN1cnJlbnRTdGF0ZSsrLHN0YXRlQ291bnRbY3VycmVudFN0YXRlXSsrO2Vsc2UgaWYoMD09KDEmY3VycmVudFN0YXRlKSlpZig0PT1jdXJyZW50U3RhdGUpaWYodGhpcy5mb3VuZFBhdHRlcm5Dcm9zcyhzdGF0ZUNvdW50KSl7dmFyIGNvbmZpcm1lZD10aGlzLmhhbmRsZVBvc3NpYmxlQ2VudGVyKHN0YXRlQ291bnQsaSxqKTtpZihjb25maXJtZWQpaWYoaVNraXA9Mix0aGlzLmhhc1NraXBwZWQpZG9uZT10aGlzLmhhdmVNdWx0aXBseUNvbmZpcm1lZENlbnRlcnMoKTtlbHNle3ZhciByb3dTa2lwPXRoaXMuZmluZFJvd1NraXAoKTtyb3dTa2lwPnN0YXRlQ291bnRbMl0mJihpKz1yb3dTa2lwLXN0YXRlQ291bnRbMl0taVNraXAsaj1tYXhKLTEpfWVsc2V7ZG8gaisrO3doaWxlKG1heEo+aiYmIWltYWdlW2oraSpxcmNvZGUud2lkdGhdKTtqLS19Y3VycmVudFN0YXRlPTAsc3RhdGVDb3VudFswXT0wLHN0YXRlQ291bnRbMV09MCxzdGF0ZUNvdW50WzJdPTAsc3RhdGVDb3VudFszXT0wLHN0YXRlQ291bnRbNF09MH1lbHNlIHN0YXRlQ291bnRbMF09c3RhdGVDb3VudFsyXSxzdGF0ZUNvdW50WzFdPXN0YXRlQ291bnRbM10sc3RhdGVDb3VudFsyXT1zdGF0ZUNvdW50WzRdLHN0YXRlQ291bnRbM109MSxzdGF0ZUNvdW50WzRdPTAsY3VycmVudFN0YXRlPTM7ZWxzZSBzdGF0ZUNvdW50WysrY3VycmVudFN0YXRlXSsrO2Vsc2Ugc3RhdGVDb3VudFtjdXJyZW50U3RhdGVdKys7aWYodGhpcy5mb3VuZFBhdHRlcm5Dcm9zcyhzdGF0ZUNvdW50KSl7dmFyIGNvbmZpcm1lZD10aGlzLmhhbmRsZVBvc3NpYmxlQ2VudGVyKHN0YXRlQ291bnQsaSxtYXhKKTtjb25maXJtZWQmJihpU2tpcD1zdGF0ZUNvdW50WzBdLHRoaXMuaGFzU2tpcHBlZCYmKGRvbmU9aGF2ZU11bHRpcGx5Q29uZmlybWVkQ2VudGVycygpKSl9fXZhciBwYXR0ZXJuSW5mbz10aGlzLnNlbGVjdEJlc3RQYXR0ZXJucygpO3JldHVybiBxcmNvZGUub3JkZXJCZXN0UGF0dGVybnMocGF0dGVybkluZm8pLG5ldyBGaW5kZXJQYXR0ZXJuSW5mbyhwYXR0ZXJuSW5mbyl9fWZ1bmN0aW9uIEFsaWdubWVudFBhdHRlcm4ocG9zWCxwb3NZLGVzdGltYXRlZE1vZHVsZVNpemUpe3RoaXMueD1wb3NYLHRoaXMueT1wb3NZLHRoaXMuY291bnQ9MSx0aGlzLmVzdGltYXRlZE1vZHVsZVNpemU9ZXN0aW1hdGVkTW9kdWxlU2l6ZSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJFc3RpbWF0ZWRNb2R1bGVTaXplXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5lc3RpbWF0ZWRNb2R1bGVTaXplfSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiQ291bnRcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmNvdW50fSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiWFwiLGZ1bmN0aW9uKCl7cmV0dXJuIE1hdGguZmxvb3IodGhpcy54KX0pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIllcIixmdW5jdGlvbigpe3JldHVybiBNYXRoLmZsb29yKHRoaXMueSl9KSx0aGlzLmluY3JlbWVudENvdW50PWZ1bmN0aW9uKCl7dGhpcy5jb3VudCsrfSx0aGlzLmFib3V0RXF1YWxzPWZ1bmN0aW9uKG1vZHVsZVNpemUsaSxqKXtpZihNYXRoLmFicyhpLXRoaXMueSk8PW1vZHVsZVNpemUmJk1hdGguYWJzKGotdGhpcy54KTw9bW9kdWxlU2l6ZSl7dmFyIG1vZHVsZVNpemVEaWZmPU1hdGguYWJzKG1vZHVsZVNpemUtdGhpcy5lc3RpbWF0ZWRNb2R1bGVTaXplKTtyZXR1cm4gMT49bW9kdWxlU2l6ZURpZmZ8fG1vZHVsZVNpemVEaWZmL3RoaXMuZXN0aW1hdGVkTW9kdWxlU2l6ZTw9MX1yZXR1cm4hMX19ZnVuY3Rpb24gQWxpZ25tZW50UGF0dGVybkZpbmRlcihpbWFnZSxzdGFydFgsc3RhcnRZLHdpZHRoLGhlaWdodCxtb2R1bGVTaXplLHJlc3VsdFBvaW50Q2FsbGJhY2spe3RoaXMuaW1hZ2U9aW1hZ2UsdGhpcy5wb3NzaWJsZUNlbnRlcnM9bmV3IEFycmF5LHRoaXMuc3RhcnRYPXN0YXJ0WCx0aGlzLnN0YXJ0WT1zdGFydFksdGhpcy53aWR0aD13aWR0aCx0aGlzLmhlaWdodD1oZWlnaHQsdGhpcy5tb2R1bGVTaXplPW1vZHVsZVNpemUsdGhpcy5jcm9zc0NoZWNrU3RhdGVDb3VudD1uZXcgQXJyYXkoMCwwLDApLHRoaXMucmVzdWx0UG9pbnRDYWxsYmFjaz1yZXN1bHRQb2ludENhbGxiYWNrLHRoaXMuY2VudGVyRnJvbUVuZD1mdW5jdGlvbihzdGF0ZUNvdW50LGVuZCl7cmV0dXJuIGVuZC1zdGF0ZUNvdW50WzJdLXN0YXRlQ291bnRbMV0vMn0sdGhpcy5mb3VuZFBhdHRlcm5Dcm9zcz1mdW5jdGlvbihzdGF0ZUNvdW50KXtmb3IodmFyIG1vZHVsZVNpemU9dGhpcy5tb2R1bGVTaXplLG1heFZhcmlhbmNlPW1vZHVsZVNpemUvMixpPTA7Mz5pO2krKylpZihNYXRoLmFicyhtb2R1bGVTaXplLXN0YXRlQ291bnRbaV0pPj1tYXhWYXJpYW5jZSlyZXR1cm4hMTtyZXR1cm4hMH0sdGhpcy5jcm9zc0NoZWNrVmVydGljYWw9ZnVuY3Rpb24oc3RhcnRJLGNlbnRlckosbWF4Q291bnQsb3JpZ2luYWxTdGF0ZUNvdW50VG90YWwpe3ZhciBpbWFnZT10aGlzLmltYWdlLG1heEk9cXJjb2RlLmhlaWdodCxzdGF0ZUNvdW50PXRoaXMuY3Jvc3NDaGVja1N0YXRlQ291bnQ7c3RhdGVDb3VudFswXT0wLHN0YXRlQ291bnRbMV09MCxzdGF0ZUNvdW50WzJdPTA7Zm9yKHZhciBpPXN0YXJ0STtpPj0wJiZpbWFnZVtjZW50ZXJKK2kqcXJjb2RlLndpZHRoXSYmc3RhdGVDb3VudFsxXTw9bWF4Q291bnQ7KXN0YXRlQ291bnRbMV0rKyxpLS07aWYoMD5pfHxzdGF0ZUNvdW50WzFdPm1heENvdW50KXJldHVybiBOYU47Zm9yKDtpPj0wJiYhaW1hZ2VbY2VudGVySitpKnFyY29kZS53aWR0aF0mJnN0YXRlQ291bnRbMF08PW1heENvdW50OylzdGF0ZUNvdW50WzBdKyssaS0tO2lmKHN0YXRlQ291bnRbMF0+bWF4Q291bnQpcmV0dXJuIE5hTjtmb3IoaT1zdGFydEkrMTttYXhJPmkmJmltYWdlW2NlbnRlckoraSpxcmNvZGUud2lkdGhdJiZzdGF0ZUNvdW50WzFdPD1tYXhDb3VudDspc3RhdGVDb3VudFsxXSsrLGkrKztpZihpPT1tYXhJfHxzdGF0ZUNvdW50WzFdPm1heENvdW50KXJldHVybiBOYU47Zm9yKDttYXhJPmkmJiFpbWFnZVtjZW50ZXJKK2kqcXJjb2RlLndpZHRoXSYmc3RhdGVDb3VudFsyXTw9bWF4Q291bnQ7KXN0YXRlQ291bnRbMl0rKyxpKys7aWYoc3RhdGVDb3VudFsyXT5tYXhDb3VudClyZXR1cm4gTmFOO3ZhciBzdGF0ZUNvdW50VG90YWw9c3RhdGVDb3VudFswXStzdGF0ZUNvdW50WzFdK3N0YXRlQ291bnRbMl07cmV0dXJuIDUqTWF0aC5hYnMoc3RhdGVDb3VudFRvdGFsLW9yaWdpbmFsU3RhdGVDb3VudFRvdGFsKT49MipvcmlnaW5hbFN0YXRlQ291bnRUb3RhbD9OYU46dGhpcy5mb3VuZFBhdHRlcm5Dcm9zcyhzdGF0ZUNvdW50KT90aGlzLmNlbnRlckZyb21FbmQoc3RhdGVDb3VudCxpKTpOYU59LHRoaXMuaGFuZGxlUG9zc2libGVDZW50ZXI9ZnVuY3Rpb24oc3RhdGVDb3VudCxpLGope3ZhciBzdGF0ZUNvdW50VG90YWw9c3RhdGVDb3VudFswXStzdGF0ZUNvdW50WzFdK3N0YXRlQ291bnRbMl0sY2VudGVySj10aGlzLmNlbnRlckZyb21FbmQoc3RhdGVDb3VudCxqKSxjZW50ZXJJPXRoaXMuY3Jvc3NDaGVja1ZlcnRpY2FsKGksTWF0aC5mbG9vcihjZW50ZXJKKSwyKnN0YXRlQ291bnRbMV0sc3RhdGVDb3VudFRvdGFsKTtpZighaXNOYU4oY2VudGVySSkpe2Zvcih2YXIgZXN0aW1hdGVkTW9kdWxlU2l6ZT0oc3RhdGVDb3VudFswXStzdGF0ZUNvdW50WzFdK3N0YXRlQ291bnRbMl0pLzMsbWF4PXRoaXMucG9zc2libGVDZW50ZXJzLmxlbmd0aCxpbmRleD0wO21heD5pbmRleDtpbmRleCsrKXt2YXIgY2VudGVyPXRoaXMucG9zc2libGVDZW50ZXJzW2luZGV4XTtpZihjZW50ZXIuYWJvdXRFcXVhbHMoZXN0aW1hdGVkTW9kdWxlU2l6ZSxjZW50ZXJJLGNlbnRlckopKXJldHVybiBuZXcgQWxpZ25tZW50UGF0dGVybihjZW50ZXJKLGNlbnRlckksZXN0aW1hdGVkTW9kdWxlU2l6ZSl9dmFyIHBvaW50PW5ldyBBbGlnbm1lbnRQYXR0ZXJuKGNlbnRlckosY2VudGVySSxlc3RpbWF0ZWRNb2R1bGVTaXplKTt0aGlzLnBvc3NpYmxlQ2VudGVycy5wdXNoKHBvaW50KSxudWxsIT10aGlzLnJlc3VsdFBvaW50Q2FsbGJhY2smJnRoaXMucmVzdWx0UG9pbnRDYWxsYmFjay5mb3VuZFBvc3NpYmxlUmVzdWx0UG9pbnQocG9pbnQpfXJldHVybiBudWxsfSx0aGlzLmZpbmQ9ZnVuY3Rpb24oKXtmb3IodmFyIHN0YXJ0WD10aGlzLnN0YXJ0WCxoZWlnaHQ9dGhpcy5oZWlnaHQsbWF4Sj1zdGFydFgrd2lkdGgsbWlkZGxlST1zdGFydFkrKGhlaWdodD4+MSksc3RhdGVDb3VudD1uZXcgQXJyYXkoMCwwLDApLGlHZW49MDtoZWlnaHQ+aUdlbjtpR2VuKyspe3ZhciBpPW1pZGRsZUkrKDA9PSgxJmlHZW4pP2lHZW4rMT4+MTotKGlHZW4rMT4+MSkpO3N0YXRlQ291bnRbMF09MCxzdGF0ZUNvdW50WzFdPTAsc3RhdGVDb3VudFsyXT0wO2Zvcih2YXIgaj1zdGFydFg7bWF4Sj5qJiYhaW1hZ2VbaitxcmNvZGUud2lkdGgqaV07KWorKztmb3IodmFyIGN1cnJlbnRTdGF0ZT0wO21heEo+ajspe2lmKGltYWdlW2oraSpxcmNvZGUud2lkdGhdKWlmKDE9PWN1cnJlbnRTdGF0ZSlzdGF0ZUNvdW50W2N1cnJlbnRTdGF0ZV0rKztlbHNlIGlmKDI9PWN1cnJlbnRTdGF0ZSl7aWYodGhpcy5mb3VuZFBhdHRlcm5Dcm9zcyhzdGF0ZUNvdW50KSl7dmFyIGNvbmZpcm1lZD10aGlzLmhhbmRsZVBvc3NpYmxlQ2VudGVyKHN0YXRlQ291bnQsaSxqKTtpZihudWxsIT1jb25maXJtZWQpcmV0dXJuIGNvbmZpcm1lZH1zdGF0ZUNvdW50WzBdPXN0YXRlQ291bnRbMl0sc3RhdGVDb3VudFsxXT0xLHN0YXRlQ291bnRbMl09MCxjdXJyZW50U3RhdGU9MX1lbHNlIHN0YXRlQ291bnRbKytjdXJyZW50U3RhdGVdKys7ZWxzZSAxPT1jdXJyZW50U3RhdGUmJmN1cnJlbnRTdGF0ZSsrLHN0YXRlQ291bnRbY3VycmVudFN0YXRlXSsrO2orK31pZih0aGlzLmZvdW5kUGF0dGVybkNyb3NzKHN0YXRlQ291bnQpKXt2YXIgY29uZmlybWVkPXRoaXMuaGFuZGxlUG9zc2libGVDZW50ZXIoc3RhdGVDb3VudCxpLG1heEopO2lmKG51bGwhPWNvbmZpcm1lZClyZXR1cm4gY29uZmlybWVkfX1pZigwIT10aGlzLnBvc3NpYmxlQ2VudGVycy5sZW5ndGgpcmV0dXJuIHRoaXMucG9zc2libGVDZW50ZXJzWzBdO3Rocm93XCJDb3VsZG4ndCBmaW5kIGVub3VnaCBhbGlnbm1lbnQgcGF0dGVybnNcIn19ZnVuY3Rpb24gUVJDb2RlRGF0YUJsb2NrUmVhZGVyKGJsb2Nrcyx2ZXJzaW9uLG51bUVycm9yQ29ycmVjdGlvbkNvZGUpe3RoaXMuYmxvY2tQb2ludGVyPTAsdGhpcy5iaXRQb2ludGVyPTcsdGhpcy5kYXRhTGVuZ3RoPTAsdGhpcy5ibG9ja3M9YmxvY2tzLHRoaXMubnVtRXJyb3JDb3JyZWN0aW9uQ29kZT1udW1FcnJvckNvcnJlY3Rpb25Db2RlLDk+PXZlcnNpb24/dGhpcy5kYXRhTGVuZ3RoTW9kZT0wOnZlcnNpb24+PTEwJiYyNj49dmVyc2lvbj90aGlzLmRhdGFMZW5ndGhNb2RlPTE6dmVyc2lvbj49MjcmJjQwPj12ZXJzaW9uJiYodGhpcy5kYXRhTGVuZ3RoTW9kZT0yKSx0aGlzLmdldE5leHRCaXRzPWZ1bmN0aW9uKG51bUJpdHMpe3ZhciBiaXRzPTA7aWYobnVtQml0czx0aGlzLmJpdFBvaW50ZXIrMSl7Zm9yKHZhciBtYXNrPTAsaT0wO251bUJpdHM+aTtpKyspbWFzays9MTw8aTtyZXR1cm4gbWFzazw8PXRoaXMuYml0UG9pbnRlci1udW1CaXRzKzEsYml0cz0odGhpcy5ibG9ja3NbdGhpcy5ibG9ja1BvaW50ZXJdJm1hc2spPj50aGlzLmJpdFBvaW50ZXItbnVtQml0cysxLHRoaXMuYml0UG9pbnRlci09bnVtQml0cyxiaXRzfWlmKG51bUJpdHM8dGhpcy5iaXRQb2ludGVyKzErOCl7Zm9yKHZhciBtYXNrMT0wLGk9MDtpPHRoaXMuYml0UG9pbnRlcisxO2krKyltYXNrMSs9MTw8aTtyZXR1cm4gYml0cz0odGhpcy5ibG9ja3NbdGhpcy5ibG9ja1BvaW50ZXJdJm1hc2sxKTw8bnVtQml0cy0odGhpcy5iaXRQb2ludGVyKzEpLHRoaXMuYmxvY2tQb2ludGVyKyssYml0cys9dGhpcy5ibG9ja3NbdGhpcy5ibG9ja1BvaW50ZXJdPj44LShudW1CaXRzLSh0aGlzLmJpdFBvaW50ZXIrMSkpLHRoaXMuYml0UG9pbnRlcj10aGlzLmJpdFBvaW50ZXItbnVtQml0cyU4LHRoaXMuYml0UG9pbnRlcjwwJiYodGhpcy5iaXRQb2ludGVyPTgrdGhpcy5iaXRQb2ludGVyKSxiaXRzfWlmKG51bUJpdHM8dGhpcy5iaXRQb2ludGVyKzErMTYpe2Zvcih2YXIgbWFzazE9MCxtYXNrMz0wLGk9MDtpPHRoaXMuYml0UG9pbnRlcisxO2krKyltYXNrMSs9MTw8aTt2YXIgYml0c0ZpcnN0QmxvY2s9KHRoaXMuYmxvY2tzW3RoaXMuYmxvY2tQb2ludGVyXSZtYXNrMSk8PG51bUJpdHMtKHRoaXMuYml0UG9pbnRlcisxKTt0aGlzLmJsb2NrUG9pbnRlcisrO3ZhciBiaXRzU2Vjb25kQmxvY2s9dGhpcy5ibG9ja3NbdGhpcy5ibG9ja1BvaW50ZXJdPDxudW1CaXRzLSh0aGlzLmJpdFBvaW50ZXIrMSs4KTt0aGlzLmJsb2NrUG9pbnRlcisrO2Zvcih2YXIgaT0wO2k8bnVtQml0cy0odGhpcy5iaXRQb2ludGVyKzErOCk7aSsrKW1hc2szKz0xPDxpO21hc2szPDw9OC0obnVtQml0cy0odGhpcy5iaXRQb2ludGVyKzErOCkpO3ZhciBiaXRzVGhpcmRCbG9jaz0odGhpcy5ibG9ja3NbdGhpcy5ibG9ja1BvaW50ZXJdJm1hc2szKT4+OC0obnVtQml0cy0odGhpcy5iaXRQb2ludGVyKzErOCkpO3JldHVybiBiaXRzPWJpdHNGaXJzdEJsb2NrK2JpdHNTZWNvbmRCbG9jaytiaXRzVGhpcmRCbG9jayx0aGlzLmJpdFBvaW50ZXI9dGhpcy5iaXRQb2ludGVyLShudW1CaXRzLTgpJTgsdGhpcy5iaXRQb2ludGVyPDAmJih0aGlzLmJpdFBvaW50ZXI9OCt0aGlzLmJpdFBvaW50ZXIpLGJpdHN9cmV0dXJuIDB9LHRoaXMuTmV4dE1vZGU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5ibG9ja1BvaW50ZXI+dGhpcy5ibG9ja3MubGVuZ3RoLXRoaXMubnVtRXJyb3JDb3JyZWN0aW9uQ29kZS0yPzA6dGhpcy5nZXROZXh0Qml0cyg0KX0sdGhpcy5nZXREYXRhTGVuZ3RoPWZ1bmN0aW9uKG1vZGVJbmRpY2F0b3Ipe2Zvcih2YXIgaW5kZXg9MDs7KXtpZihtb2RlSW5kaWNhdG9yPj5pbmRleD09MSlicmVhaztpbmRleCsrfXJldHVybiB0aGlzLmdldE5leHRCaXRzKHFyY29kZS5zaXplT2ZEYXRhTGVuZ3RoSW5mb1t0aGlzLmRhdGFMZW5ndGhNb2RlXVtpbmRleF0pfSx0aGlzLmdldFJvbWFuQW5kRmlndXJlU3RyaW5nPWZ1bmN0aW9uKGRhdGFMZW5ndGgpe3ZhciBsZW5ndGg9ZGF0YUxlbmd0aCxpbnREYXRhPTAsc3RyRGF0YT1cIlwiLHRhYmxlUm9tYW5BbmRGaWd1cmU9bmV3IEFycmF5KFwiMFwiLFwiMVwiLFwiMlwiLFwiM1wiLFwiNFwiLFwiNVwiLFwiNlwiLFwiN1wiLFwiOFwiLFwiOVwiLFwiQVwiLFwiQlwiLFwiQ1wiLFwiRFwiLFwiRVwiLFwiRlwiLFwiR1wiLFwiSFwiLFwiSVwiLFwiSlwiLFwiS1wiLFwiTFwiLFwiTVwiLFwiTlwiLFwiT1wiLFwiUFwiLFwiUVwiLFwiUlwiLFwiU1wiLFwiVFwiLFwiVVwiLFwiVlwiLFwiV1wiLFwiWFwiLFwiWVwiLFwiWlwiLFwiIFwiLFwiJFwiLFwiJVwiLFwiKlwiLFwiK1wiLFwiLVwiLFwiLlwiLFwiL1wiLFwiOlwiKTtkbyBpZihsZW5ndGg+MSl7aW50RGF0YT10aGlzLmdldE5leHRCaXRzKDExKTt2YXIgZmlyc3RMZXR0ZXI9TWF0aC5mbG9vcihpbnREYXRhLzQ1KSxzZWNvbmRMZXR0ZXI9aW50RGF0YSU0NTtzdHJEYXRhKz10YWJsZVJvbWFuQW5kRmlndXJlW2ZpcnN0TGV0dGVyXSxzdHJEYXRhKz10YWJsZVJvbWFuQW5kRmlndXJlW3NlY29uZExldHRlcl0sbGVuZ3RoLT0yfWVsc2UgMT09bGVuZ3RoJiYoaW50RGF0YT10aGlzLmdldE5leHRCaXRzKDYpLHN0ckRhdGErPXRhYmxlUm9tYW5BbmRGaWd1cmVbaW50RGF0YV0sbGVuZ3RoLT0xKTt3aGlsZShsZW5ndGg+MCk7cmV0dXJuIHN0ckRhdGF9LHRoaXMuZ2V0RmlndXJlU3RyaW5nPWZ1bmN0aW9uKGRhdGFMZW5ndGgpe3ZhciBsZW5ndGg9ZGF0YUxlbmd0aCxpbnREYXRhPTAsc3RyRGF0YT1cIlwiO2RvIGxlbmd0aD49Mz8oaW50RGF0YT10aGlzLmdldE5leHRCaXRzKDEwKSwxMDA+aW50RGF0YSYmKHN0ckRhdGErPVwiMFwiKSwxMD5pbnREYXRhJiYoc3RyRGF0YSs9XCIwXCIpLGxlbmd0aC09Myk6Mj09bGVuZ3RoPyhpbnREYXRhPXRoaXMuZ2V0TmV4dEJpdHMoNyksMTA+aW50RGF0YSYmKHN0ckRhdGErPVwiMFwiKSxsZW5ndGgtPTIpOjE9PWxlbmd0aCYmKGludERhdGE9dGhpcy5nZXROZXh0Qml0cyg0KSxsZW5ndGgtPTEpLHN0ckRhdGErPWludERhdGE7d2hpbGUobGVuZ3RoPjApO3JldHVybiBzdHJEYXRhfSx0aGlzLmdldDhiaXRCeXRlQXJyYXk9ZnVuY3Rpb24oZGF0YUxlbmd0aCl7dmFyIGxlbmd0aD1kYXRhTGVuZ3RoLGludERhdGE9MCxvdXRwdXQ9bmV3IEFycmF5O2RvIGludERhdGE9dGhpcy5nZXROZXh0Qml0cyg4KSxvdXRwdXQucHVzaChpbnREYXRhKSxsZW5ndGgtLTt3aGlsZShsZW5ndGg+MCk7cmV0dXJuIG91dHB1dH0sdGhpcy5nZXRLYW5qaVN0cmluZz1mdW5jdGlvbihkYXRhTGVuZ3RoKXt2YXIgbGVuZ3RoPWRhdGFMZW5ndGgsaW50RGF0YT0wLHVuaWNvZGVTdHJpbmc9XCJcIjtkb3tpbnREYXRhPWdldE5leHRCaXRzKDEzKTt2YXIgbG93ZXJCeXRlPWludERhdGElMTkyLGhpZ2hlckJ5dGU9aW50RGF0YS8xOTIsdGVtcFdvcmQ9KGhpZ2hlckJ5dGU8PDgpK2xvd2VyQnl0ZSxzaGlmdGppc1dvcmQ9MDtzaGlmdGppc1dvcmQ9NDA5NTY+PXRlbXBXb3JkKzMzMDg4P3RlbXBXb3JkKzMzMDg4OnRlbXBXb3JkKzQ5NDcyLHVuaWNvZGVTdHJpbmcrPVN0cmluZy5mcm9tQ2hhckNvZGUoc2hpZnRqaXNXb3JkKSxsZW5ndGgtLX13aGlsZShsZW5ndGg+MCk7cmV0dXJuIHVuaWNvZGVTdHJpbmd9LHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkRhdGFCeXRlXCIsZnVuY3Rpb24oKXtmb3IodmFyIG91dHB1dD1uZXcgQXJyYXksTU9ERV9OVU1CRVI9MSxNT0RFX1JPTUFOX0FORF9OVU1CRVI9MixNT0RFXzhCSVRfQllURT00LE1PREVfS0FOSkk9ODs7KXt2YXIgbW9kZT10aGlzLk5leHRNb2RlKCk7aWYoMD09bW9kZSl7aWYob3V0cHV0Lmxlbmd0aD4wKWJyZWFrO3Rocm93XCJFbXB0eSBkYXRhIGJsb2NrXCJ9aWYobW9kZSE9TU9ERV9OVU1CRVImJm1vZGUhPU1PREVfUk9NQU5fQU5EX05VTUJFUiYmbW9kZSE9TU9ERV84QklUX0JZVEUmJm1vZGUhPU1PREVfS0FOSkkpdGhyb3dcIkludmFsaWQgbW9kZTogXCIrbW9kZStcIiBpbiAoYmxvY2s6XCIrdGhpcy5ibG9ja1BvaW50ZXIrXCIgYml0OlwiK3RoaXMuYml0UG9pbnRlcitcIilcIjtpZihkYXRhTGVuZ3RoPXRoaXMuZ2V0RGF0YUxlbmd0aChtb2RlKSxkYXRhTGVuZ3RoPDEpdGhyb3dcIkludmFsaWQgZGF0YSBsZW5ndGg6IFwiK2RhdGFMZW5ndGg7c3dpdGNoKG1vZGUpe2Nhc2UgTU9ERV9OVU1CRVI6Zm9yKHZhciB0ZW1wX3N0cj10aGlzLmdldEZpZ3VyZVN0cmluZyhkYXRhTGVuZ3RoKSx0YT1uZXcgQXJyYXkodGVtcF9zdHIubGVuZ3RoKSxqPTA7ajx0ZW1wX3N0ci5sZW5ndGg7aisrKXRhW2pdPXRlbXBfc3RyLmNoYXJDb2RlQXQoaik7b3V0cHV0LnB1c2godGEpO2JyZWFrO2Nhc2UgTU9ERV9ST01BTl9BTkRfTlVNQkVSOmZvcih2YXIgdGVtcF9zdHI9dGhpcy5nZXRSb21hbkFuZEZpZ3VyZVN0cmluZyhkYXRhTGVuZ3RoKSx0YT1uZXcgQXJyYXkodGVtcF9zdHIubGVuZ3RoKSxqPTA7ajx0ZW1wX3N0ci5sZW5ndGg7aisrKXRhW2pdPXRlbXBfc3RyLmNoYXJDb2RlQXQoaik7b3V0cHV0LnB1c2godGEpO2JyZWFrO2Nhc2UgTU9ERV84QklUX0JZVEU6dmFyIHRlbXBfc2J5dGVBcnJheTM9dGhpcy5nZXQ4Yml0Qnl0ZUFycmF5KGRhdGFMZW5ndGgpO291dHB1dC5wdXNoKHRlbXBfc2J5dGVBcnJheTMpO2JyZWFrO2Nhc2UgTU9ERV9LQU5KSTp2YXIgdGVtcF9zdHI9dGhpcy5nZXRLYW5qaVN0cmluZyhkYXRhTGVuZ3RoKTtvdXRwdXQucHVzaCh0ZW1wX3N0cil9fXJldHVybiBvdXRwdXR9KX1HcmlkU2FtcGxlcj17fSxHcmlkU2FtcGxlci5jaGVja0FuZE51ZGdlUG9pbnRzPWZ1bmN0aW9uKGltYWdlLHBvaW50cyl7Zm9yKHZhciB3aWR0aD1xcmNvZGUud2lkdGgsaGVpZ2h0PXFyY29kZS5oZWlnaHQsbnVkZ2VkPSEwLG9mZnNldD0wO29mZnNldDxwb2ludHMuTGVuZ3RoJiZudWRnZWQ7b2Zmc2V0Kz0yKXt2YXIgeD1NYXRoLmZsb29yKHBvaW50c1tvZmZzZXRdKSx5PU1hdGguZmxvb3IocG9pbnRzW29mZnNldCsxXSk7aWYoLTE+eHx8eD53aWR0aHx8LTE+eXx8eT5oZWlnaHQpdGhyb3dcIkVycm9yLmNoZWNrQW5kTnVkZ2VQb2ludHMgXCI7bnVkZ2VkPSExLC0xPT14Pyhwb2ludHNbb2Zmc2V0XT0wLG51ZGdlZD0hMCk6eD09d2lkdGgmJihwb2ludHNbb2Zmc2V0XT13aWR0aC0xLG51ZGdlZD0hMCksLTE9PXk/KHBvaW50c1tvZmZzZXQrMV09MCxudWRnZWQ9ITApOnk9PWhlaWdodCYmKHBvaW50c1tvZmZzZXQrMV09aGVpZ2h0LTEsbnVkZ2VkPSEwKX1udWRnZWQ9ITA7Zm9yKHZhciBvZmZzZXQ9cG9pbnRzLkxlbmd0aC0yO29mZnNldD49MCYmbnVkZ2VkO29mZnNldC09Mil7dmFyIHg9TWF0aC5mbG9vcihwb2ludHNbb2Zmc2V0XSkseT1NYXRoLmZsb29yKHBvaW50c1tvZmZzZXQrMV0pO2lmKC0xPnh8fHg+d2lkdGh8fC0xPnl8fHk+aGVpZ2h0KXRocm93XCJFcnJvci5jaGVja0FuZE51ZGdlUG9pbnRzIFwiO251ZGdlZD0hMSwtMT09eD8ocG9pbnRzW29mZnNldF09MCxudWRnZWQ9ITApOng9PXdpZHRoJiYocG9pbnRzW29mZnNldF09d2lkdGgtMSxudWRnZWQ9ITApLC0xPT15Pyhwb2ludHNbb2Zmc2V0KzFdPTAsbnVkZ2VkPSEwKTp5PT1oZWlnaHQmJihwb2ludHNbb2Zmc2V0KzFdPWhlaWdodC0xLG51ZGdlZD0hMCl9fSxHcmlkU2FtcGxlci5zYW1wbGVHcmlkMz1mdW5jdGlvbihpbWFnZSxkaW1lbnNpb24sdHJhbnNmb3JtKXtmb3IodmFyIGJpdHM9bmV3IEJpdE1hdHJpeChkaW1lbnNpb24pLHBvaW50cz1uZXcgQXJyYXkoZGltZW5zaW9uPDwxKSx5PTA7ZGltZW5zaW9uPnk7eSsrKXtmb3IodmFyIG1heD1wb2ludHMubGVuZ3RoLGlWYWx1ZT15Ky41LHg9MDttYXg+eDt4Kz0yKXBvaW50c1t4XT0oeD4+MSkrLjUscG9pbnRzW3grMV09aVZhbHVlO3RyYW5zZm9ybS50cmFuc2Zvcm1Qb2ludHMxKHBvaW50cyksR3JpZFNhbXBsZXIuY2hlY2tBbmROdWRnZVBvaW50cyhpbWFnZSxwb2ludHMpO3RyeXtmb3IodmFyIHg9MDttYXg+eDt4Kz0yKXt2YXIgeHBvaW50PTQqTWF0aC5mbG9vcihwb2ludHNbeF0pK01hdGguZmxvb3IocG9pbnRzW3grMV0pKnFyY29kZS53aWR0aCo0LGJpdD1pbWFnZVtNYXRoLmZsb29yKHBvaW50c1t4XSkrcXJjb2RlLndpZHRoKk1hdGguZmxvb3IocG9pbnRzW3grMV0pXTtxcmNvZGUuaW1hZ2VkYXRhLmRhdGFbeHBvaW50XT1iaXQ/MjU1OjAscXJjb2RlLmltYWdlZGF0YS5kYXRhW3hwb2ludCsxXT1iaXQ/MjU1OjAscXJjb2RlLmltYWdlZGF0YS5kYXRhW3hwb2ludCsyXT0wLHFyY29kZS5pbWFnZWRhdGEuZGF0YVt4cG9pbnQrM109MjU1LGJpdCYmYml0cy5zZXRfUmVuYW1lZCh4Pj4xLHkpfX1jYXRjaChhaW9vYmUpe3Rocm93XCJFcnJvci5jaGVja0FuZE51ZGdlUG9pbnRzXCJ9fXJldHVybiBiaXRzfSxHcmlkU2FtcGxlci5zYW1wbGVHcmlkeD1mdW5jdGlvbihpbWFnZSxkaW1lbnNpb24scDFUb1gscDFUb1kscDJUb1gscDJUb1kscDNUb1gscDNUb1kscDRUb1gscDRUb1kscDFGcm9tWCxwMUZyb21ZLHAyRnJvbVgscDJGcm9tWSxwM0Zyb21YLHAzRnJvbVkscDRGcm9tWCxwNEZyb21ZKXt2YXIgdHJhbnNmb3JtPVBlcnNwZWN0aXZlVHJhbnNmb3JtLnF1YWRyaWxhdGVyYWxUb1F1YWRyaWxhdGVyYWwocDFUb1gscDFUb1kscDJUb1gscDJUb1kscDNUb1gscDNUb1kscDRUb1gscDRUb1kscDFGcm9tWCxwMUZyb21ZLHAyRnJvbVgscDJGcm9tWSxwM0Zyb21YLHAzRnJvbVkscDRGcm9tWCxwNEZyb21ZKTtyZXR1cm4gR3JpZFNhbXBsZXIuc2FtcGxlR3JpZDMoaW1hZ2UsZGltZW5zaW9uLHRyYW5zZm9ybSl9LFZlcnNpb24uVkVSU0lPTl9ERUNPREVfSU5GTz1uZXcgQXJyYXkoMzE4OTIsMzQyMzYsMzk1NzcsNDIxOTUsNDgxMTgsNTEwNDIsNTUzNjcsNTg4OTMsNjM3ODQsNjg0NzIsNzA3NDksNzYzMTEsNzkxNTQsODQzOTAsODc2ODMsOTIzNjEsOTYyMzYsMTAyMDg0LDEwMjg4MSwxMTA1MDcsMTEwNzM0LDExNzc4NiwxMTk2MTUsMTI2MzI1LDEyNzU2OCwxMzM1ODksMTM2OTQ0LDE0MTQ5OCwxNDUzMTEsMTUwMjgzLDE1MjYyMiwxNTgzMDgsMTYxMDg5LDE2NzAxNyksVmVyc2lvbi5WRVJTSU9OUz1idWlsZFZlcnNpb25zKCksVmVyc2lvbi5nZXRWZXJzaW9uRm9yTnVtYmVyPWZ1bmN0aW9uKHZlcnNpb25OdW1iZXIpe2lmKDE+dmVyc2lvbk51bWJlcnx8dmVyc2lvbk51bWJlcj40MCl0aHJvd1wiQXJndW1lbnRFeGNlcHRpb25cIjtyZXR1cm4gVmVyc2lvbi5WRVJTSU9OU1t2ZXJzaW9uTnVtYmVyLTFdfSxWZXJzaW9uLmdldFByb3Zpc2lvbmFsVmVyc2lvbkZvckRpbWVuc2lvbj1mdW5jdGlvbihkaW1lbnNpb24pe2lmKGRpbWVuc2lvbiU0IT0xKXRocm93XCJFcnJvciBnZXRQcm92aXNpb25hbFZlcnNpb25Gb3JEaW1lbnNpb25cIjt0cnl7cmV0dXJuIFZlcnNpb24uZ2V0VmVyc2lvbkZvck51bWJlcihkaW1lbnNpb24tMTc+PjIpfWNhdGNoKGlhZSl7dGhyb3dcIkVycm9yIGdldFZlcnNpb25Gb3JOdW1iZXJcIn19LFZlcnNpb24uZGVjb2RlVmVyc2lvbkluZm9ybWF0aW9uPWZ1bmN0aW9uKHZlcnNpb25CaXRzKXtmb3IodmFyIGJlc3REaWZmZXJlbmNlPTQyOTQ5NjcyOTUsYmVzdFZlcnNpb249MCxpPTA7aTxWZXJzaW9uLlZFUlNJT05fREVDT0RFX0lORk8ubGVuZ3RoO2krKyl7dmFyIHRhcmdldFZlcnNpb249VmVyc2lvbi5WRVJTSU9OX0RFQ09ERV9JTkZPW2ldO2lmKHRhcmdldFZlcnNpb249PXZlcnNpb25CaXRzKXJldHVybiB0aGlzLmdldFZlcnNpb25Gb3JOdW1iZXIoaSs3KTt2YXIgYml0c0RpZmZlcmVuY2U9Rm9ybWF0SW5mb3JtYXRpb24ubnVtQml0c0RpZmZlcmluZyh2ZXJzaW9uQml0cyx0YXJnZXRWZXJzaW9uKTtiZXN0RGlmZmVyZW5jZT5iaXRzRGlmZmVyZW5jZSYmKGJlc3RWZXJzaW9uPWkrNyxiZXN0RGlmZmVyZW5jZT1iaXRzRGlmZmVyZW5jZSl9cmV0dXJuIDM+PWJlc3REaWZmZXJlbmNlP3RoaXMuZ2V0VmVyc2lvbkZvck51bWJlcihiZXN0VmVyc2lvbik6bnVsbH0sUGVyc3BlY3RpdmVUcmFuc2Zvcm0ucXVhZHJpbGF0ZXJhbFRvUXVhZHJpbGF0ZXJhbD1mdW5jdGlvbih4MCx5MCx4MSx5MSx4Mix5Mix4Myx5Myx4MHAseTBwLHgxcCx5MXAseDJwLHkycCx4M3AseTNwKXt2YXIgcVRvUz10aGlzLnF1YWRyaWxhdGVyYWxUb1NxdWFyZSh4MCx5MCx4MSx5MSx4Mix5Mix4Myx5Myksc1RvUT10aGlzLnNxdWFyZVRvUXVhZHJpbGF0ZXJhbCh4MHAseTBwLHgxcCx5MXAseDJwLHkycCx4M3AseTNwKTtyZXR1cm4gc1RvUS50aW1lcyhxVG9TKX0sUGVyc3BlY3RpdmVUcmFuc2Zvcm0uc3F1YXJlVG9RdWFkcmlsYXRlcmFsPWZ1bmN0aW9uKHgwLHkwLHgxLHkxLHgyLHkyLHgzLHkzKXtyZXR1cm4gZHkyPXkzLXkyLGR5Mz15MC15MSt5Mi15MywwPT1keTImJjA9PWR5Mz9uZXcgUGVyc3BlY3RpdmVUcmFuc2Zvcm0oeDEteDAseDIteDEseDAseTEteTAseTIteTEseTAsMCwwLDEpOihkeDE9eDEteDIsZHgyPXgzLXgyLGR4Mz14MC14MSt4Mi14MyxkeTE9eTEteTIsZGVub21pbmF0b3I9ZHgxKmR5Mi1keDIqZHkxLGExMz0oZHgzKmR5Mi1keDIqZHkzKS9kZW5vbWluYXRvcixhMjM9KGR4MSpkeTMtZHgzKmR5MSkvZGVub21pbmF0b3IsbmV3IFBlcnNwZWN0aXZlVHJhbnNmb3JtKHgxLXgwK2ExMyp4MSx4My14MCthMjMqeDMseDAseTEteTArYTEzKnkxLHkzLXkwK2EyMyp5Myx5MCxhMTMsYTIzLDEpKX0sUGVyc3BlY3RpdmVUcmFuc2Zvcm0ucXVhZHJpbGF0ZXJhbFRvU3F1YXJlPWZ1bmN0aW9uKHgwLHkwLHgxLHkxLHgyLHkyLHgzLHkzKXtyZXR1cm4gdGhpcy5zcXVhcmVUb1F1YWRyaWxhdGVyYWwoeDAseTAseDEseTEseDIseTIseDMseTMpLmJ1aWxkQWRqb2ludCgpfTt2YXIgRk9STUFUX0lORk9fTUFTS19RUj0yMTUyMixGT1JNQVRfSU5GT19ERUNPREVfTE9PS1VQPW5ldyBBcnJheShuZXcgQXJyYXkoMjE1MjIsMCksbmV3IEFycmF5KDIwNzczLDEpLG5ldyBBcnJheSgyNDE4OCwyKSxuZXcgQXJyYXkoMjMzNzEsMyksbmV3IEFycmF5KDE3OTEzLDQpLG5ldyBBcnJheSgxNjU5MCw1KSxuZXcgQXJyYXkoMjAzNzUsNiksbmV3IEFycmF5KDE5MTA0LDcpLG5ldyBBcnJheSgzMDY2MCw4KSxuZXcgQXJyYXkoMjk0MjcsOSksbmV3IEFycmF5KDMyMTcwLDEwKSxuZXcgQXJyYXkoMzA4NzcsMTEpLG5ldyBBcnJheSgyNjE1OSwxMiksbmV3IEFycmF5KDI1MzY4LDEzKSxuZXcgQXJyYXkoMjc3MTMsMTQpLG5ldyBBcnJheSgyNjk5OCwxNSksbmV3IEFycmF5KDU3NjksMTYpLG5ldyBBcnJheSg1MDU0LDE3KSxuZXcgQXJyYXkoNzM5OSwxOCksbmV3IEFycmF5KDY2MDgsMTkpLG5ldyBBcnJheSgxODkwLDIwKSxuZXcgQXJyYXkoNTk3LDIxKSxuZXcgQXJyYXkoMzM0MCwyMiksbmV3IEFycmF5KDIxMDcsMjMpLG5ldyBBcnJheSgxMzY2MywyNCksbmV3IEFycmF5KDEyMzkyLDI1KSxuZXcgQXJyYXkoMTYxNzcsMjYpLG5ldyBBcnJheSgxNDg1NCwyNyksbmV3IEFycmF5KDkzOTYsMjgpLG5ldyBBcnJheSg4NTc5LDI5KSxuZXcgQXJyYXkoMTE5OTQsMzApLG5ldyBBcnJheSgxMTI0NSwzMSkpLEJJVFNfU0VUX0lOX0hBTEZfQllURT1uZXcgQXJyYXkoMCwxLDEsMiwxLDIsMiwzLDEsMiwyLDMsMiwzLDMsNCk7Rm9ybWF0SW5mb3JtYXRpb24ubnVtQml0c0RpZmZlcmluZz1mdW5jdGlvbihhLGIpe3JldHVybiBhXj1iLEJJVFNfU0VUX0lOX0hBTEZfQllURVsxNSZhXStCSVRTX1NFVF9JTl9IQUxGX0JZVEVbMTUmVVJTaGlmdChhLDQpXStCSVRTX1NFVF9JTl9IQUxGX0JZVEVbMTUmVVJTaGlmdChhLDgpXStCSVRTX1NFVF9JTl9IQUxGX0JZVEVbMTUmVVJTaGlmdChhLDEyKV0rQklUU19TRVRfSU5fSEFMRl9CWVRFWzE1JlVSU2hpZnQoYSwxNildK0JJVFNfU0VUX0lOX0hBTEZfQllURVsxNSZVUlNoaWZ0KGEsMjApXStCSVRTX1NFVF9JTl9IQUxGX0JZVEVbMTUmVVJTaGlmdChhLDI0KV0rQklUU19TRVRfSU5fSEFMRl9CWVRFWzE1JlVSU2hpZnQoYSwyOCldfSxGb3JtYXRJbmZvcm1hdGlvbi5kZWNvZGVGb3JtYXRJbmZvcm1hdGlvbj1mdW5jdGlvbihtYXNrZWRGb3JtYXRJbmZvKXt2YXIgZm9ybWF0SW5mbz1Gb3JtYXRJbmZvcm1hdGlvbi5kb0RlY29kZUZvcm1hdEluZm9ybWF0aW9uKG1hc2tlZEZvcm1hdEluZm8pO3JldHVybiBudWxsIT1mb3JtYXRJbmZvP2Zvcm1hdEluZm86Rm9ybWF0SW5mb3JtYXRpb24uZG9EZWNvZGVGb3JtYXRJbmZvcm1hdGlvbihtYXNrZWRGb3JtYXRJbmZvXkZPUk1BVF9JTkZPX01BU0tfUVIpfSxGb3JtYXRJbmZvcm1hdGlvbi5kb0RlY29kZUZvcm1hdEluZm9ybWF0aW9uPWZ1bmN0aW9uKG1hc2tlZEZvcm1hdEluZm8pe2Zvcih2YXIgYmVzdERpZmZlcmVuY2U9NDI5NDk2NzI5NSxiZXN0Rm9ybWF0SW5mbz0wLGk9MDtpPEZPUk1BVF9JTkZPX0RFQ09ERV9MT09LVVAubGVuZ3RoO2krKyl7dmFyIGRlY29kZUluZm89Rk9STUFUX0lORk9fREVDT0RFX0xPT0tVUFtpXSx0YXJnZXRJbmZvPWRlY29kZUluZm9bMF07aWYodGFyZ2V0SW5mbz09bWFza2VkRm9ybWF0SW5mbylyZXR1cm4gbmV3IEZvcm1hdEluZm9ybWF0aW9uKGRlY29kZUluZm9bMV0pO3ZhciBiaXRzRGlmZmVyZW5jZT10aGlzLm51bUJpdHNEaWZmZXJpbmcobWFza2VkRm9ybWF0SW5mbyx0YXJnZXRJbmZvKTtiZXN0RGlmZmVyZW5jZT5iaXRzRGlmZmVyZW5jZSYmKGJlc3RGb3JtYXRJbmZvPWRlY29kZUluZm9bMV0sYmVzdERpZmZlcmVuY2U9Yml0c0RpZmZlcmVuY2UpfXJldHVybiAzPj1iZXN0RGlmZmVyZW5jZT9uZXcgRm9ybWF0SW5mb3JtYXRpb24oYmVzdEZvcm1hdEluZm8pOm51bGx9LEVycm9yQ29ycmVjdGlvbkxldmVsLmZvckJpdHM9ZnVuY3Rpb24oYml0cyl7aWYoMD5iaXRzfHxiaXRzPj1GT1JfQklUUy5MZW5ndGgpdGhyb3dcIkFyZ3VtZW50RXhjZXB0aW9uXCI7cmV0dXJuIEZPUl9CSVRTW2JpdHNdfTt2YXIgTD1uZXcgRXJyb3JDb3JyZWN0aW9uTGV2ZWwoMCwxLFwiTFwiKSxNPW5ldyBFcnJvckNvcnJlY3Rpb25MZXZlbCgxLDAsXCJNXCIpLFE9bmV3IEVycm9yQ29ycmVjdGlvbkxldmVsKDIsMyxcIlFcIiksSD1uZXcgRXJyb3JDb3JyZWN0aW9uTGV2ZWwoMywyLFwiSFwiKSxGT1JfQklUUz1uZXcgQXJyYXkoTSxMLEgsUSk7RGF0YUJsb2NrLmdldERhdGFCbG9ja3M9ZnVuY3Rpb24ocmF3Q29kZXdvcmRzLHZlcnNpb24sZWNMZXZlbCl7aWYocmF3Q29kZXdvcmRzLmxlbmd0aCE9dmVyc2lvbi5Ub3RhbENvZGV3b3Jkcyl0aHJvd1wiQXJndW1lbnRFeGNlcHRpb25cIjtmb3IodmFyIGVjQmxvY2tzPXZlcnNpb24uZ2V0RUNCbG9ja3NGb3JMZXZlbChlY0xldmVsKSx0b3RhbEJsb2Nrcz0wLGVjQmxvY2tBcnJheT1lY0Jsb2Nrcy5nZXRFQ0Jsb2NrcygpLGk9MDtpPGVjQmxvY2tBcnJheS5sZW5ndGg7aSsrKXRvdGFsQmxvY2tzKz1lY0Jsb2NrQXJyYXlbaV0uQ291bnQ7Zm9yKHZhciByZXN1bHQ9bmV3IEFycmF5KHRvdGFsQmxvY2tzKSxudW1SZXN1bHRCbG9ja3M9MCxqPTA7ajxlY0Jsb2NrQXJyYXkubGVuZ3RoO2orKylmb3IodmFyIGVjQmxvY2s9ZWNCbG9ja0FycmF5W2pdLGk9MDtpPGVjQmxvY2suQ291bnQ7aSsrKXt2YXIgbnVtRGF0YUNvZGV3b3Jkcz1lY0Jsb2NrLkRhdGFDb2Rld29yZHMsbnVtQmxvY2tDb2Rld29yZHM9ZWNCbG9ja3MuRUNDb2Rld29yZHNQZXJCbG9jaytudW1EYXRhQ29kZXdvcmRzO3Jlc3VsdFtudW1SZXN1bHRCbG9ja3MrK109bmV3IERhdGFCbG9jayhudW1EYXRhQ29kZXdvcmRzLG5ldyBBcnJheShudW1CbG9ja0NvZGV3b3JkcykpfWZvcih2YXIgc2hvcnRlckJsb2Nrc1RvdGFsQ29kZXdvcmRzPXJlc3VsdFswXS5jb2Rld29yZHMubGVuZ3RoLGxvbmdlckJsb2Nrc1N0YXJ0QXQ9cmVzdWx0Lmxlbmd0aC0xO2xvbmdlckJsb2Nrc1N0YXJ0QXQ+PTA7KXt2YXIgbnVtQ29kZXdvcmRzPXJlc3VsdFtsb25nZXJCbG9ja3NTdGFydEF0XS5jb2Rld29yZHMubGVuZ3RoO2lmKG51bUNvZGV3b3Jkcz09c2hvcnRlckJsb2Nrc1RvdGFsQ29kZXdvcmRzKWJyZWFrO2xvbmdlckJsb2Nrc1N0YXJ0QXQtLX1sb25nZXJCbG9ja3NTdGFydEF0Kys7Zm9yKHZhciBzaG9ydGVyQmxvY2tzTnVtRGF0YUNvZGV3b3Jkcz1zaG9ydGVyQmxvY2tzVG90YWxDb2Rld29yZHMtZWNCbG9ja3MuRUNDb2Rld29yZHNQZXJCbG9jayxyYXdDb2Rld29yZHNPZmZzZXQ9MCxpPTA7c2hvcnRlckJsb2Nrc051bURhdGFDb2Rld29yZHM+aTtpKyspZm9yKHZhciBqPTA7bnVtUmVzdWx0QmxvY2tzPmo7aisrKXJlc3VsdFtqXS5jb2Rld29yZHNbaV09cmF3Q29kZXdvcmRzW3Jhd0NvZGV3b3Jkc09mZnNldCsrXTtmb3IodmFyIGo9bG9uZ2VyQmxvY2tzU3RhcnRBdDtudW1SZXN1bHRCbG9ja3M+ajtqKyspcmVzdWx0W2pdLmNvZGV3b3Jkc1tzaG9ydGVyQmxvY2tzTnVtRGF0YUNvZGV3b3Jkc109cmF3Q29kZXdvcmRzW3Jhd0NvZGV3b3Jkc09mZnNldCsrXTtmb3IodmFyIG1heD1yZXN1bHRbMF0uY29kZXdvcmRzLmxlbmd0aCxpPXNob3J0ZXJCbG9ja3NOdW1EYXRhQ29kZXdvcmRzO21heD5pO2krKylmb3IodmFyIGo9MDtudW1SZXN1bHRCbG9ja3M+ajtqKyspe3ZhciBpT2Zmc2V0PWxvbmdlckJsb2Nrc1N0YXJ0QXQ+aj9pOmkrMTtyZXN1bHRbal0uY29kZXdvcmRzW2lPZmZzZXRdPXJhd0NvZGV3b3Jkc1tyYXdDb2Rld29yZHNPZmZzZXQrK119cmV0dXJuIHJlc3VsdH0sRGF0YU1hc2s9e30sRGF0YU1hc2suZm9yUmVmZXJlbmNlPWZ1bmN0aW9uKHJlZmVyZW5jZSl7aWYoMD5yZWZlcmVuY2V8fHJlZmVyZW5jZT43KXRocm93XCJTeXN0ZW0uQXJndW1lbnRFeGNlcHRpb25cIjtyZXR1cm4gRGF0YU1hc2suREFUQV9NQVNLU1tyZWZlcmVuY2VdfSxEYXRhTWFzay5EQVRBX01BU0tTPW5ldyBBcnJheShuZXcgRGF0YU1hc2swMDAsbmV3IERhdGFNYXNrMDAxLG5ldyBEYXRhTWFzazAxMCxuZXcgRGF0YU1hc2swMTEsbmV3IERhdGFNYXNrMTAwLG5ldyBEYXRhTWFzazEwMSxuZXcgRGF0YU1hc2sxMTAsbmV3IERhdGFNYXNrMTExKSxHRjI1Ni5RUl9DT0RFX0ZJRUxEPW5ldyBHRjI1NigyODUpLEdGMjU2LkRBVEFfTUFUUklYX0ZJRUxEPW5ldyBHRjI1NigzMDEpLEdGMjU2LmFkZE9yU3VidHJhY3Q9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gYV5ifSxEZWNvZGVyPXt9LERlY29kZXIucnNEZWNvZGVyPW5ldyBSZWVkU29sb21vbkRlY29kZXIoR0YyNTYuUVJfQ09ERV9GSUVMRCksRGVjb2Rlci5jb3JyZWN0RXJyb3JzPWZ1bmN0aW9uKGNvZGV3b3JkQnl0ZXMsbnVtRGF0YUNvZGV3b3Jkcyl7Zm9yKHZhciBudW1Db2Rld29yZHM9Y29kZXdvcmRCeXRlcy5sZW5ndGgsY29kZXdvcmRzSW50cz1uZXcgQXJyYXkobnVtQ29kZXdvcmRzKSxpPTA7bnVtQ29kZXdvcmRzPmk7aSsrKWNvZGV3b3Jkc0ludHNbaV09MjU1JmNvZGV3b3JkQnl0ZXNbaV07dmFyIG51bUVDQ29kZXdvcmRzPWNvZGV3b3JkQnl0ZXMubGVuZ3RoLW51bURhdGFDb2Rld29yZHM7dHJ5e0RlY29kZXIucnNEZWNvZGVyLmRlY29kZShjb2Rld29yZHNJbnRzLG51bUVDQ29kZXdvcmRzKX1jYXRjaChyc2Upe3Rocm93IHJzZX1mb3IodmFyIGk9MDtudW1EYXRhQ29kZXdvcmRzPmk7aSsrKWNvZGV3b3JkQnl0ZXNbaV09Y29kZXdvcmRzSW50c1tpXX0sRGVjb2Rlci5kZWNvZGU9ZnVuY3Rpb24oYml0cyl7Zm9yKHZhciBwYXJzZXI9bmV3IEJpdE1hdHJpeFBhcnNlcihiaXRzKSx2ZXJzaW9uPXBhcnNlci5yZWFkVmVyc2lvbigpLGVjTGV2ZWw9cGFyc2VyLnJlYWRGb3JtYXRJbmZvcm1hdGlvbigpLkVycm9yQ29ycmVjdGlvbkxldmVsLGNvZGV3b3Jkcz1wYXJzZXIucmVhZENvZGV3b3JkcygpLGRhdGFCbG9ja3M9RGF0YUJsb2NrLmdldERhdGFCbG9ja3MoY29kZXdvcmRzLHZlcnNpb24sZWNMZXZlbCksdG90YWxCeXRlcz0wLGk9MDtpPGRhdGFCbG9ja3MuTGVuZ3RoO2krKyl0b3RhbEJ5dGVzKz1kYXRhQmxvY2tzW2ldLk51bURhdGFDb2Rld29yZHM7Zm9yKHZhciByZXN1bHRCeXRlcz1uZXcgQXJyYXkodG90YWxCeXRlcykscmVzdWx0T2Zmc2V0PTAsaj0wO2o8ZGF0YUJsb2Nrcy5sZW5ndGg7aisrKXt2YXIgZGF0YUJsb2NrPWRhdGFCbG9ja3Nbal0sY29kZXdvcmRCeXRlcz1kYXRhQmxvY2suQ29kZXdvcmRzLG51bURhdGFDb2Rld29yZHM9ZGF0YUJsb2NrLk51bURhdGFDb2Rld29yZHM7RGVjb2Rlci5jb3JyZWN0RXJyb3JzKGNvZGV3b3JkQnl0ZXMsbnVtRGF0YUNvZGV3b3Jkcyk7Zm9yKHZhciBpPTA7bnVtRGF0YUNvZGV3b3Jkcz5pO2krKylyZXN1bHRCeXRlc1tyZXN1bHRPZmZzZXQrK109Y29kZXdvcmRCeXRlc1tpXX12YXIgcmVhZGVyPW5ldyBRUkNvZGVEYXRhQmxvY2tSZWFkZXIocmVzdWx0Qnl0ZXMsdmVyc2lvbi5WZXJzaW9uTnVtYmVyLGVjTGV2ZWwuQml0cyk7cmV0dXJuIHJlYWRlcn0scXJjb2RlPXt9LHFyY29kZS5pbWFnZWRhdGE9bnVsbCxxcmNvZGUud2lkdGg9MCxxcmNvZGUuaGVpZ2h0PTAscXJjb2RlLnFyQ29kZVN5bWJvbD1udWxsLHFyY29kZS5kZWJ1Zz0hMSxxcmNvZGUuc2l6ZU9mRGF0YUxlbmd0aEluZm89W1sxMCw5LDgsOF0sWzEyLDExLDE2LDEwXSxbMTQsMTMsMTYsMTJdXSxxcmNvZGUuY2FsbGJhY2s9bnVsbCxxcmNvZGUuZGVjb2RlPWZ1bmN0aW9uKHNyYyl7aWYoMD09YXJndW1lbnRzLmxlbmd0aCl7dmFyIGNhbnZhc19xcj1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInFyLWNhbnZhc1wiKSxjb250ZXh0PWNhbnZhc19xci5nZXRDb250ZXh0KFwiMmRcIik7cmV0dXJuIHFyY29kZS53aWR0aD1jYW52YXNfcXIud2lkdGgscXJjb2RlLmhlaWdodD1jYW52YXNfcXIuaGVpZ2h0LHFyY29kZS5pbWFnZWRhdGE9Y29udGV4dC5nZXRJbWFnZURhdGEoMCwwLHFyY29kZS53aWR0aCxxcmNvZGUuaGVpZ2h0KSxxcmNvZGUucmVzdWx0PXFyY29kZS5wcm9jZXNzKGNvbnRleHQpLG51bGwhPXFyY29kZS5jYWxsYmFjayYmcXJjb2RlLmNhbGxiYWNrKHFyY29kZS5yZXN1bHQpLHFyY29kZS5yZXN1bHR9dmFyIGltYWdlPW5ldyBJbWFnZTtpbWFnZS5vbmxvYWQ9ZnVuY3Rpb24oKXt2YXIgY2FudmFzX3FyPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIiksY29udGV4dD1jYW52YXNfcXIuZ2V0Q29udGV4dChcIjJkXCIpLGNhbnZhc19vdXQ9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdXQtY2FudmFzXCIpO2lmKG51bGwhPWNhbnZhc19vdXQpe3ZhciBvdXRjdHg9Y2FudmFzX291dC5nZXRDb250ZXh0KFwiMmRcIik7b3V0Y3R4LmNsZWFyUmVjdCgwLDAsMzIwLDI0MCksb3V0Y3R4LmRyYXdJbWFnZShpbWFnZSwwLDAsMzIwLDI0MCl9Y2FudmFzX3FyLndpZHRoPWltYWdlLndpZHRoLGNhbnZhc19xci5oZWlnaHQ9aW1hZ2UuaGVpZ2h0LGNvbnRleHQuZHJhd0ltYWdlKGltYWdlLDAsMCkscXJjb2RlLndpZHRoPWltYWdlLndpZHRoLHFyY29kZS5oZWlnaHQ9aW1hZ2UuaGVpZ2h0O3RyeXtxcmNvZGUuaW1hZ2VkYXRhPWNvbnRleHQuZ2V0SW1hZ2VEYXRhKDAsMCxpbWFnZS53aWR0aCxpbWFnZS5oZWlnaHQpfWNhdGNoKGUpe3JldHVybiBxcmNvZGUucmVzdWx0PVwiQ3Jvc3MgZG9tYWluIGltYWdlIHJlYWRpbmcgbm90IHN1cHBvcnRlZCBpbiB5b3VyIGJyb3dzZXIhIFNhdmUgaXQgdG8geW91ciBjb21wdXRlciB0aGVuIGRyYWcgYW5kIGRyb3AgdGhlIGZpbGUhXCIsdm9pZChudWxsIT1xcmNvZGUuY2FsbGJhY2smJnFyY29kZS5jYWxsYmFjayhxcmNvZGUucmVzdWx0KSl9dHJ5e3FyY29kZS5yZXN1bHQ9cXJjb2RlLnByb2Nlc3MoY29udGV4dCl9Y2F0Y2goZSl7Y29uc29sZS5sb2coZSkscXJjb2RlLnJlc3VsdD1cImVycm9yIGRlY29kaW5nIFFSIENvZGVcIn1udWxsIT1xcmNvZGUuY2FsbGJhY2smJnFyY29kZS5jYWxsYmFjayhxcmNvZGUucmVzdWx0KX0saW1hZ2Uuc3JjPXNyY30scXJjb2RlLmRlY29kZV91dGY4PWZ1bmN0aW9uKHMpe3JldHVybiBkZWNvZGVVUklDb21wb25lbnQoZXNjYXBlKHMpKX0scXJjb2RlLnByb2Nlc3M9ZnVuY3Rpb24oY3R4KXt2YXIgc3RhcnQ9KG5ldyBEYXRlKS5nZXRUaW1lKCksaW1hZ2U9cXJjb2RlLmdyYXlTY2FsZVRvQml0bWFwKHFyY29kZS5ncmF5c2NhbGUoKSk7aWYocXJjb2RlLmRlYnVnKXtmb3IodmFyIHk9MDt5PHFyY29kZS5oZWlnaHQ7eSsrKWZvcih2YXIgeD0wO3g8cXJjb2RlLndpZHRoO3grKyl7dmFyIHBvaW50PTQqeCt5KnFyY29kZS53aWR0aCo0O3FyY29kZS5pbWFnZWRhdGEuZGF0YVtwb2ludF09KGltYWdlW3greSpxcmNvZGUud2lkdGhdLDApLHFyY29kZS5pbWFnZWRhdGEuZGF0YVtwb2ludCsxXT0oaW1hZ2VbeCt5KnFyY29kZS53aWR0aF0sMCkscXJjb2RlLmltYWdlZGF0YS5kYXRhW3BvaW50KzJdPWltYWdlW3greSpxcmNvZGUud2lkdGhdPzI1NTowfWN0eC5wdXRJbWFnZURhdGEocXJjb2RlLmltYWdlZGF0YSwwLDApfXZhciBkZXRlY3Rvcj1uZXcgRGV0ZWN0b3IoaW1hZ2UpLHFSQ29kZU1hdHJpeD1kZXRlY3Rvci5kZXRlY3QoKTtxcmNvZGUuZGVidWcmJmN0eC5wdXRJbWFnZURhdGEocXJjb2RlLmltYWdlZGF0YSwwLDApO2Zvcih2YXIgcmVhZGVyPURlY29kZXIuZGVjb2RlKHFSQ29kZU1hdHJpeC5iaXRzKSxkYXRhPXJlYWRlci5EYXRhQnl0ZSxzdHI9XCJcIixpPTA7aTxkYXRhLmxlbmd0aDtpKyspZm9yKHZhciBqPTA7ajxkYXRhW2ldLmxlbmd0aDtqKyspc3RyKz1TdHJpbmcuZnJvbUNoYXJDb2RlKGRhdGFbaV1bal0pO3ZhciBlbmQ9KG5ldyBEYXRlKS5nZXRUaW1lKCksdGltZT1lbmQtc3RhcnQ7cmV0dXJuIGNvbnNvbGUubG9nKHRpbWUpLHFyY29kZS5kZWNvZGVfdXRmOChzdHIpfSxxcmNvZGUuZ2V0UGl4ZWw9ZnVuY3Rpb24oeCx5KXtpZihxcmNvZGUud2lkdGg8eCl0aHJvd1wicG9pbnQgZXJyb3JcIjtpZihxcmNvZGUuaGVpZ2h0PHkpdGhyb3dcInBvaW50IGVycm9yXCI7cmV0dXJuIHBvaW50PTQqeCt5KnFyY29kZS53aWR0aCo0LHA9KDMzKnFyY29kZS5pbWFnZWRhdGEuZGF0YVtwb2ludF0rMzQqcXJjb2RlLmltYWdlZGF0YS5kYXRhW3BvaW50KzFdKzMzKnFyY29kZS5pbWFnZWRhdGEuZGF0YVtwb2ludCsyXSkvMTAwLHB9LHFyY29kZS5iaW5hcml6ZT1mdW5jdGlvbih0aCl7Zm9yKHZhciByZXQ9bmV3IEFycmF5KHFyY29kZS53aWR0aCpxcmNvZGUuaGVpZ2h0KSx5PTA7eTxxcmNvZGUuaGVpZ2h0O3krKylmb3IodmFyIHg9MDt4PHFyY29kZS53aWR0aDt4Kyspe3ZhciBncmF5PXFyY29kZS5nZXRQaXhlbCh4LHkpO3JldFt4K3kqcXJjb2RlLndpZHRoXT10aD49Z3JheT8hMDohMX1yZXR1cm4gcmV0fSxxcmNvZGUuZ2V0TWlkZGxlQnJpZ2h0bmVzc1BlckFyZWE9ZnVuY3Rpb24oaW1hZ2Upe2Zvcih2YXIgbnVtU3FydEFyZWE9NCxhcmVhV2lkdGg9TWF0aC5mbG9vcihxcmNvZGUud2lkdGgvbnVtU3FydEFyZWEpLGFyZWFIZWlnaHQ9TWF0aC5mbG9vcihxcmNvZGUuaGVpZ2h0L251bVNxcnRBcmVhKSxtaW5tYXg9bmV3IEFycmF5KG51bVNxcnRBcmVhKSxpPTA7bnVtU3FydEFyZWE+aTtpKyspe21pbm1heFtpXT1uZXcgQXJyYXkobnVtU3FydEFyZWEpO2Zvcih2YXIgaTI9MDtudW1TcXJ0QXJlYT5pMjtpMisrKW1pbm1heFtpXVtpMl09bmV3IEFycmF5KDAsMCl9Zm9yKHZhciBheT0wO251bVNxcnRBcmVhPmF5O2F5KyspZm9yKHZhciBheD0wO251bVNxcnRBcmVhPmF4O2F4Kyspe21pbm1heFtheF1bYXldWzBdPTI1NTtmb3IodmFyIGR5PTA7YXJlYUhlaWdodD5keTtkeSsrKWZvcih2YXIgZHg9MDthcmVhV2lkdGg+ZHg7ZHgrKyl7dmFyIHRhcmdldD1pbWFnZVthcmVhV2lkdGgqYXgrZHgrKGFyZWFIZWlnaHQqYXkrZHkpKnFyY29kZS53aWR0aF07dGFyZ2V0PG1pbm1heFtheF1bYXldWzBdJiYobWlubWF4W2F4XVtheV1bMF09dGFyZ2V0KSx0YXJnZXQ+bWlubWF4W2F4XVtheV1bMV0mJihtaW5tYXhbYXhdW2F5XVsxXT10YXJnZXQpfX1mb3IodmFyIG1pZGRsZT1uZXcgQXJyYXkobnVtU3FydEFyZWEpLGkzPTA7bnVtU3FydEFyZWE+aTM7aTMrKyltaWRkbGVbaTNdPW5ldyBBcnJheShudW1TcXJ0QXJlYSk7Zm9yKHZhciBheT0wO251bVNxcnRBcmVhPmF5O2F5KyspZm9yKHZhciBheD0wO251bVNxcnRBcmVhPmF4O2F4KyspbWlkZGxlW2F4XVtheV09TWF0aC5mbG9vcigobWlubWF4W2F4XVtheV1bMF0rbWlubWF4W2F4XVtheV1bMV0pLzIpO3JldHVybiBtaWRkbGV9LHFyY29kZS5ncmF5U2NhbGVUb0JpdG1hcD1mdW5jdGlvbihncmF5U2NhbGUpe2Zvcih2YXIgbWlkZGxlPXFyY29kZS5nZXRNaWRkbGVCcmlnaHRuZXNzUGVyQXJlYShncmF5U2NhbGUpLHNxcnROdW1BcmVhPW1pZGRsZS5sZW5ndGgsYXJlYVdpZHRoPU1hdGguZmxvb3IocXJjb2RlLndpZHRoL3NxcnROdW1BcmVhKSxhcmVhSGVpZ2h0PU1hdGguZmxvb3IocXJjb2RlLmhlaWdodC9zcXJ0TnVtQXJlYSksYml0bWFwPW5ldyBBcnJheShxcmNvZGUuaGVpZ2h0KnFyY29kZS53aWR0aCksYXk9MDtzcXJ0TnVtQXJlYT5heTtheSsrKWZvcih2YXIgYXg9MDtzcXJ0TnVtQXJlYT5heDtheCsrKWZvcih2YXIgZHk9MDthcmVhSGVpZ2h0PmR5O2R5KyspZm9yKHZhciBkeD0wO2FyZWFXaWR0aD5keDtkeCsrKWJpdG1hcFthcmVhV2lkdGgqYXgrZHgrKGFyZWFIZWlnaHQqYXkrZHkpKnFyY29kZS53aWR0aF09Z3JheVNjYWxlW2FyZWFXaWR0aCpheCtkeCsoYXJlYUhlaWdodCpheStkeSkqcXJjb2RlLndpZHRoXTxtaWRkbGVbYXhdW2F5XT8hMDohMTtcclxuICAgIHJldHVybiBiaXRtYXB9LHFyY29kZS5ncmF5c2NhbGU9ZnVuY3Rpb24oKXtmb3IodmFyIHJldD1uZXcgQXJyYXkocXJjb2RlLndpZHRoKnFyY29kZS5oZWlnaHQpLHk9MDt5PHFyY29kZS5oZWlnaHQ7eSsrKWZvcih2YXIgeD0wO3g8cXJjb2RlLndpZHRoO3grKyl7dmFyIGdyYXk9cXJjb2RlLmdldFBpeGVsKHgseSk7cmV0W3greSpxcmNvZGUud2lkdGhdPWdyYXl9cmV0dXJuIHJldH0sQXJyYXkucHJvdG90eXBlLnJlbW92ZT1mdW5jdGlvbihmcm9tLHRvKXt2YXIgcmVzdD10aGlzLnNsaWNlKCh0b3x8ZnJvbSkrMXx8dGhpcy5sZW5ndGgpO3JldHVybiB0aGlzLmxlbmd0aD0wPmZyb20/dGhpcy5sZW5ndGgrZnJvbTpmcm9tLHRoaXMucHVzaC5hcHBseSh0aGlzLHJlc3QpfTt2YXIgTUlOX1NLSVA9MyxNQVhfTU9EVUxFUz01NyxJTlRFR0VSX01BVEhfU0hJRlQ9OCxDRU5URVJfUVVPUlVNPTI7cXJjb2RlLm9yZGVyQmVzdFBhdHRlcm5zPWZ1bmN0aW9uKHBhdHRlcm5zKXtmdW5jdGlvbiBkaXN0YW5jZShwYXR0ZXJuMSxwYXR0ZXJuMil7cmV0dXJuIHhEaWZmPXBhdHRlcm4xLlgtcGF0dGVybjIuWCx5RGlmZj1wYXR0ZXJuMS5ZLXBhdHRlcm4yLlksTWF0aC5zcXJ0KHhEaWZmKnhEaWZmK3lEaWZmKnlEaWZmKX1mdW5jdGlvbiBjcm9zc1Byb2R1Y3RaKHBvaW50QSxwb2ludEIscG9pbnRDKXt2YXIgYlg9cG9pbnRCLngsYlk9cG9pbnRCLnk7cmV0dXJuKHBvaW50Qy54LWJYKSoocG9pbnRBLnktYlkpLShwb2ludEMueS1iWSkqKHBvaW50QS54LWJYKX12YXIgcG9pbnRBLHBvaW50Qixwb2ludEMsemVyb09uZURpc3RhbmNlPWRpc3RhbmNlKHBhdHRlcm5zWzBdLHBhdHRlcm5zWzFdKSxvbmVUd29EaXN0YW5jZT1kaXN0YW5jZShwYXR0ZXJuc1sxXSxwYXR0ZXJuc1syXSksemVyb1R3b0Rpc3RhbmNlPWRpc3RhbmNlKHBhdHRlcm5zWzBdLHBhdHRlcm5zWzJdKTtpZihvbmVUd29EaXN0YW5jZT49emVyb09uZURpc3RhbmNlJiZvbmVUd29EaXN0YW5jZT49emVyb1R3b0Rpc3RhbmNlPyhwb2ludEI9cGF0dGVybnNbMF0scG9pbnRBPXBhdHRlcm5zWzFdLHBvaW50Qz1wYXR0ZXJuc1syXSk6emVyb1R3b0Rpc3RhbmNlPj1vbmVUd29EaXN0YW5jZSYmemVyb1R3b0Rpc3RhbmNlPj16ZXJvT25lRGlzdGFuY2U/KHBvaW50Qj1wYXR0ZXJuc1sxXSxwb2ludEE9cGF0dGVybnNbMF0scG9pbnRDPXBhdHRlcm5zWzJdKToocG9pbnRCPXBhdHRlcm5zWzJdLHBvaW50QT1wYXR0ZXJuc1swXSxwb2ludEM9cGF0dGVybnNbMV0pLGNyb3NzUHJvZHVjdFoocG9pbnRBLHBvaW50Qixwb2ludEMpPDApe3ZhciB0ZW1wPXBvaW50QTtwb2ludEE9cG9pbnRDLHBvaW50Qz10ZW1wfXBhdHRlcm5zWzBdPXBvaW50QSxwYXR0ZXJuc1sxXT1wb2ludEIscGF0dGVybnNbMl09cG9pbnRDfTsiLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcclxuICAuZmFjdG9yeSgnQXV0aFNlcnZpY2UnLCBbXHJcbiAgICAnJGh0dHAnLFxyXG4gICAgJyRyb290U2NvcGUnLFxyXG4gICAgJyRzdGF0ZScsXHJcbiAgICAnJHdpbmRvdycsXHJcbiAgICAnU2Vzc2lvbicsXHJcbiAgICBmdW5jdGlvbigkaHR0cCwgJHJvb3RTY29wZSwgJHN0YXRlLCAkd2luZG93LCBTZXNzaW9uKSB7XHJcbiAgICAgIHZhciBhdXRoU2VydmljZSA9IHt9O1xyXG5cclxuICAgICAgZnVuY3Rpb24gbG9naW5TdWNjZXNzKGRhdGEsIGNiLCB2b2x1bnRlZXIpe1xyXG4gICAgICAgIC8vIFdpbm5lciB3aW5uZXIgeW91IGdldCBhIHRva2VuXHJcbiAgICAgICAgaWYoIXZvbHVudGVlcikge1Nlc3Npb24uY3JlYXRlKGRhdGEudG9rZW4sIGRhdGEudXNlcik7fVxyXG5cclxuICAgICAgICBpZiAoY2Ipe1xyXG4gICAgICAgICAgY2IoZGF0YS51c2VyKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGxvZ2luRmFpbHVyZShkYXRhLCBjYiwgdm9sdW50ZWVyKXtcclxuICAgICAgICBpZighdm9sdW50ZWVyKSB7JHN0YXRlLmdvKCdob21lJyk7fVxyXG4gICAgICAgIGlmIChjYikge1xyXG4gICAgICAgICAgY2IoZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBhdXRoU2VydmljZS5sb2dpbldpdGhQYXNzd29yZCA9IGZ1bmN0aW9uKGVtYWlsLCBwYXNzd29yZCwgb25TdWNjZXNzLCBvbkZhaWx1cmUpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHBcclxuICAgICAgICAgIC5wb3N0KCcvYXV0aC9sb2dpbicsIHtcclxuICAgICAgICAgICAgZW1haWw6IGVtYWlsLFxyXG4gICAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmRcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIGxvZ2luU3VjY2VzcyhyZXNwb25zZS5kYXRhLCBvblN1Y2Nlc3MpO1xyXG4gICAgICAgICAgfSwgcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBsb2dpbkZhaWx1cmUocmVzcG9uc2UuZGF0YSwgb25GYWlsdXJlKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgYXV0aFNlcnZpY2UubG9naW5XaXRoVG9rZW4gPSBmdW5jdGlvbih0b2tlbiwgb25TdWNjZXNzLCBvbkZhaWx1cmUpe1xyXG4gICAgICAgIHJldHVybiAkaHR0cFxyXG4gICAgICAgICAgLnBvc3QoJy9hdXRoL2xvZ2luJywge1xyXG4gICAgICAgICAgICB0b2tlbjogdG9rZW5cclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIGxvZ2luU3VjY2VzcyhyZXNwb25zZS5kYXRhLCBvblN1Y2Nlc3MpO1xyXG4gICAgICAgICAgfSwgcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDApIHtcclxuICAgICAgICAgICAgICBTZXNzaW9uLmRlc3Ryb3kobG9naW5GYWlsdXJlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBhdXRoU2VydmljZS5sb2dvdXQgPSBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gICAgICAgIC8vIENsZWFyIHRoZSBzZXNzaW9uXHJcbiAgICAgICAgU2Vzc2lvbi5kZXN0cm95KGNhbGxiYWNrKTtcclxuICAgICAgICAkc3RhdGUuZ28oJ2hvbWUnKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGF1dGhTZXJ2aWNlLnJlZ2lzdGVyID0gZnVuY3Rpb24oZW1haWwsIHBhc3N3b3JkLCBvblN1Y2Nlc3MsIG9uRmFpbHVyZSAsdm9sdW50ZWVyKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwXHJcbiAgICAgICAgICAucG9zdCgnL2F1dGgvcmVnaXN0ZXInLCB7XHJcbiAgICAgICAgICAgIGVtYWlsOiBlbWFpbCxcclxuICAgICAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkLFxyXG4gICAgICAgICAgICB2b2x1bnRlZXI6IHZvbHVudGVlcixcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIGxvZ2luU3VjY2VzcyhyZXNwb25zZS5kYXRhLCBvblN1Y2Nlc3MsIHZvbHVudGVlcik7XHJcbiAgICAgICAgICB9LCByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIGxvZ2luRmFpbHVyZShyZXNwb25zZS5kYXRhLCBvbkZhaWx1cmUsIHZvbHVudGVlcik7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGF1dGhTZXJ2aWNlLnZlcmlmeSA9IGZ1bmN0aW9uKHRva2VuLCBvblN1Y2Nlc3MsIG9uRmFpbHVyZSkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cFxyXG4gICAgICAgICAgLmdldCgnL2F1dGgvdmVyaWZ5LycgKyB0b2tlbilcclxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgU2Vzc2lvbi5zZXRVc2VyKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgICAgICAgICBpZiAob25TdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgb25TdWNjZXNzKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LCByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChvbkZhaWx1cmUpIHtcclxuICAgICAgICAgICAgICBvbkZhaWx1cmUocmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgYXV0aFNlcnZpY2UucmVzZW5kVmVyaWZpY2F0aW9uRW1haWwgPSBmdW5jdGlvbihvblN1Y2Nlc3MsIG9uRmFpbHVyZSl7XHJcbiAgICAgICAgcmV0dXJuICRodHRwXHJcbiAgICAgICAgICAucG9zdCgnL2F1dGgvdmVyaWZ5L3Jlc2VuZCcsIHtcclxuICAgICAgICAgICAgaWQ6IFNlc3Npb24uZ2V0VXNlcklkKClcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgYXV0aFNlcnZpY2Uuc2VuZFJlc2V0RW1haWwgPSBmdW5jdGlvbihlbWFpbCl7XHJcbiAgICAgICAgcmV0dXJuICRodHRwXHJcbiAgICAgICAgICAucG9zdCgnL2F1dGgvcmVzZXQnLCB7XHJcbiAgICAgICAgICAgIGVtYWlsOiBlbWFpbFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBhdXRoU2VydmljZS5yZXNldFBhc3N3b3JkID0gZnVuY3Rpb24odG9rZW4sIHBhc3MsIG9uU3VjY2Vzcywgb25GYWlsdXJlKXtcclxuICAgICAgICByZXR1cm4gJGh0dHBcclxuICAgICAgICAgIC5wb3N0KCcvYXV0aC9yZXNldC9wYXNzd29yZCcsIHtcclxuICAgICAgICAgICAgdG9rZW46IHRva2VuLFxyXG4gICAgICAgICAgICBwYXNzd29yZDogcGFzc1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC50aGVuKG9uU3VjY2Vzcywgb25GYWlsdXJlKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHJldHVybiBhdXRoU2VydmljZTtcclxuICAgIH1cclxuICBdKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpLmZhY3RvcnkoXCJDaGFsbGVuZ2VTZXJ2aWNlXCIsIFtcclxuICAgIFwiJGh0dHBcIixcclxuICAgIGZ1bmN0aW9uKCRodHRwKSB7XHJcbiAgICAgIHZhciBjaGFsbGVuZ2VzID0gXCIvYXBpL2NoYWxsZW5nZXNcIjtcclxuICAgICAgdmFyIGJhc2UgPSBjaGFsbGVuZ2VzICsgXCIvXCI7XHJcbiAgXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgIC8vIEJhc2ljIEFjdGlvbnNcclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICAgIGNyZWF0ZTogZnVuY3Rpb24oY0RhdGEpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoY2hhbGxlbmdlcyArIFwiL2NyZWF0ZVwiLCB7XHJcbiAgICAgICAgICAgICAgY0RhdGE6IGNEYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSxcclxuXHJcblxyXG4gICAgICAgIHVwZGF0ZTogZnVuY3Rpb24oaWQsIGNEYXRhKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL3VwZGF0ZVwiLCB7XHJcbiAgICAgICAgICAgICAgY0RhdGE6IGNEYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSxcclxuXHJcblxyXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvcmVtb3ZlXCIpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdldDogZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlICsgaWQpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXHJcbiAgICAgICAgZ2V0QWxsOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnZXRBbnN3ZXI6IGZ1bmN0aW9uKGlkKSB7XHJcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBpZCArIFwiL2Fuc3dlclwiKTtcclxuICAgICAgICB9LFxyXG5cclxuICBcclxuICAgICAgfTtcclxuICAgIH1cclxuICBdKTtcclxuICAiLCJhbmd1bGFyLm1vZHVsZSgncmVnJykuZmFjdG9yeShcIk1hcmtldGluZ1NlcnZpY2VcIiwgW1xyXG4gICAgXCIkaHR0cFwiLFxyXG4gICAgZnVuY3Rpb24oJGh0dHApIHtcclxuICAgICAgdmFyIG1hcmtldGluZyA9IFwiL2FwaS9tYXJrZXRpbmdcIjtcclxuICAgICAgdmFyIGJhc2UgPSBtYXJrZXRpbmcgKyBcIi9cIjtcclxuICBcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgLy8gQmFzaWMgQWN0aW9uc1xyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgICAgY3JlYXRlVGVhbTogZnVuY3Rpb24odGVhbURhdGEpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QobWFya2V0aW5nICsgXCIvY3JlYXRlVGVhbVwiLCB7XHJcbiAgICAgICAgICAgICAgdGVhbURhdGE6IHRlYW1EYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICBcclxuICAgICAgICBnZXRBbGw6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHNlbmRGcmllbmRJbnZpdGU6IGZ1bmN0aW9uKHVzZXJuYW1lLHRlYW1tYXRlKXtcclxuICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KG1hcmtldGluZyArIFwiL3NlbmRJbnZpdGVcIiwge1xyXG4gICAgICAgICAgICB1c2VybmFtZTogdXNlcm5hbWUsXHJcbiAgICAgICAgICAgIHRlYW1tYXRlOiB0ZWFtbWF0ZVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gIFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIF0pO1xyXG4gICIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKSBcclxuICAuZmFjdG9yeSgnU2V0dGluZ3NTZXJ2aWNlJywgW1xyXG4gICckaHR0cCcsXHJcbiAgZnVuY3Rpb24oJGh0dHApe1xyXG5cclxuICAgIHZhciBiYXNlID0gJy9hcGkvc2V0dGluZ3MvJztcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBnZXRQdWJsaWNTZXR0aW5nczogZnVuY3Rpb24oKXtcclxuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UpO1xyXG4gICAgICB9LFxyXG4gICAgICB1cGRhdGVSZWdpc3RyYXRpb25UaW1lczogZnVuY3Rpb24ob3BlbiwgY2xvc2Upe1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wdXQoYmFzZSArICd0aW1lcycsIHtcclxuICAgICAgICAgIHRpbWVPcGVuOiBvcGVuLFxyXG4gICAgICAgICAgdGltZUNsb3NlOiBjbG9zZSxcclxuICAgICAgICB9KTtcclxuICAgICAgfSxcclxuICAgICAgdXBkYXRlQ29uZmlybWF0aW9uVGltZTogZnVuY3Rpb24odGltZSl7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgJ2NvbmZpcm0tYnknLCB7XHJcbiAgICAgICAgICB0aW1lOiB0aW1lXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIHVwZGF0ZVN0YXJ0VGltZTogZnVuY3Rpb24odGltZSl7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgJ3RpbWVTdGFydCcsIHtcclxuICAgICAgICAgIHRpbWU6IHRpbWVcclxuICAgICAgICB9KTtcclxuICAgICAgfSxcclxuICAgICAgZ2V0V2hpdGVsaXN0ZWRFbWFpbHM6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlICsgJ3doaXRlbGlzdCcpO1xyXG4gICAgICB9LFxyXG4gICAgICB1cGRhdGVXaGl0ZWxpc3RlZEVtYWlsczogZnVuY3Rpb24oZW1haWxzKXtcclxuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyAnd2hpdGVsaXN0Jywge1xyXG4gICAgICAgICAgZW1haWxzOiBlbWFpbHNcclxuICAgICAgICB9KTtcclxuICAgICAgfSxcclxuICAgICAgdXBkYXRlV2FpdGxpc3RUZXh0OiBmdW5jdGlvbih0ZXh0KXtcclxuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyAnd2FpdGxpc3QnLCB7XHJcbiAgICAgICAgICB0ZXh0OiB0ZXh0XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIHVwZGF0ZUFjY2VwdGFuY2VUZXh0OiBmdW5jdGlvbih0ZXh0KXtcclxuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyAnYWNjZXB0YW5jZScsIHtcclxuICAgICAgICAgIHRleHQ6IHRleHRcclxuICAgICAgICB9KTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHVwZGF0ZUhvc3RTY2hvb2w6IGZ1bmN0aW9uKGhvc3RTY2hvb2wpe1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wdXQoYmFzZSArICdob3N0U2Nob29sJywge1xyXG4gICAgICAgICAgaG9zdFNjaG9vbDogaG9zdFNjaG9vbFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgdXBkYXRlQ29uZmlybWF0aW9uVGV4dDogZnVuY3Rpb24odGV4dCl7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgJ2NvbmZpcm1hdGlvbicsIHtcclxuICAgICAgICAgIHRleHQ6IHRleHRcclxuICAgICAgICB9KTtcclxuICAgICAgfSxcclxuICAgICAgdXBkYXRlQWxsb3dNaW5vcnM6IGZ1bmN0aW9uKGFsbG93TWlub3JzKXtcclxuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyAnbWlub3JzJywgeyBcclxuICAgICAgICAgIGFsbG93TWlub3JzOiBhbGxvd01pbm9ycyBcclxuICAgICAgICB9KTtcclxuICAgICAgfSxcclxuICAgIH07XHJcblxyXG4gIH1cclxuICBdKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpLmZhY3RvcnkoXCJTb2x2ZWRDVEZTZXJ2aWNlXCIsIFtcclxuICAgIFwiJGh0dHBcIixcclxuICAgIGZ1bmN0aW9uKCRodHRwKSB7XHJcbiAgICAgIHZhciBDVEYgPSBcIi9hcGkvQ1RGXCI7XHJcbiAgICAgIHZhciBiYXNlID0gQ1RGICsgXCIvXCI7XHJcbiAgXHJcblxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAvLyBCYXNpYyBBY3Rpb25zXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgICBzb2x2ZTogZnVuY3Rpb24oY2hhbGxlbmdlLCB1c2VyLCBhbnN3ZXIsIG9uU3VjY2Vzcywgb25GYWlsdXJlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KENURiArIFwiL3NvbHZlXCIsIHtcclxuICAgICAgICAgICAgICAgIGNoYWxsZW5nZTogY2hhbGxlbmdlLCBcclxuICAgICAgICAgICAgICAgIHVzZXIgOiB1c2VyLFxyXG4gICAgICAgICAgICAgICAgYW5zd2VyIDogYW5zd2VyLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgb25TdWNjZXNzKGNoYWxsZW5nZSk7XHJcbiAgICAgICAgICAgIH0sIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICBvbkZhaWx1cmUocmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICBcclxuICAgICAgICBnZXRBbGw6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KENURik7XHJcbiAgICAgICAgfSxcclxuICAgIFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIF0pO1xyXG4gICIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKS5mYWN0b3J5KFwiVGVhbVNlcnZpY2VcIiwgW1xyXG4gICAgXCIkaHR0cFwiLFxyXG4gICAgZnVuY3Rpb24oJGh0dHApIHtcclxuICAgICAgdmFyIHRlYW1zID0gXCIvYXBpL3RlYW1zXCI7XHJcbiAgICAgIHZhciBiYXNlID0gdGVhbXMgKyBcIi9cIjtcclxuICBcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgLy8gQmFzaWMgQWN0aW9uc1xyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgICAgY3JlYXRlOiBmdW5jdGlvbih0ZWFtRGF0YSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCh0ZWFtcyArIFwiL2NyZWF0ZVwiLCB7XHJcbiAgICAgICAgICAgICAgdGVhbURhdGE6IHRlYW1EYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdldEFsbDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHVwZGF0ZTogZnVuY3Rpb24oaWQsIGNEYXRhKSB7XHJcbiAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi91cGRhdGVcIiwge1xyXG4gICAgICAgICAgICBjRGF0YTogY0RhdGFcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGpvaW46IGZ1bmN0aW9uKGlkLCBuZXd1c2VyKSB7XHJcbiAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi91cGRhdGVqb2luZWRcIiwge1xyXG4gICAgICAgICAgICBuZXdqb2luUmVxdWVzdDogbmV3dXNlclxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgcmVtb3Zlam9pbjogZnVuY3Rpb24oaWQsIGluZGV4LCB1c2VyKSB7XHJcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBpZClcclxuICAgICAgICAgIC50aGVuKHRlYW0gPT4ge1xyXG4gICAgICAgICAgICB0ZWFtLmRhdGEuam9pblJlcXVlc3RzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIGlmICghKHVzZXI9PWZhbHNlKSl7XHJcbiAgICAgICAgICAgICAgJGh0dHAucG9zdCh0ZWFtcyArIFwiL3NlbmRSZWZ1c2VkVGVhbVwiLCB7XHJcbiAgICAgICAgICAgICAgICBpZDogdXNlci5pZCxcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi91cGRhdGVqb2luZWRcIiwge1xyXG4gICAgICAgICAgICAgIG5ld2pvaW5SZXF1ZXN0czogdGVhbS5kYXRhLmpvaW5SZXF1ZXN0c1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgYWNjZXB0TWVtYmVyOiBmdW5jdGlvbihpZCwgbmV3dXNlcixtYXhUZWFtU2l6ZSkge1xyXG4gICAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlICsgaWQpXHJcbiAgICAgICAgICAudGhlbih0ZWFtID0+IHtcclxuICAgICAgICAgICAgaWYgKHRlYW0uZGF0YS5tZW1iZXJzLmxlbmd0aD49bWF4VGVhbVNpemUpeyByZXR1cm4gJ21heFRlYW1TaXplJyB9XHJcblxyXG4gICAgICAgICAgICB0ZWFtLmRhdGEubWVtYmVycy5wdXNoKG5ld3VzZXIpXHJcbiAgICAgICAgICAgICRodHRwLnBvc3QodGVhbXMgKyBcIi9zZW5kQWNjZXB0ZWRUZWFtXCIsIHtcclxuICAgICAgICAgICAgICBpZDogbmV3dXNlci5pZCxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL3VwZGF0ZU1lbWJlcnNcIiwge1xyXG4gICAgICAgICAgICAgIG5ld01lbWJlcnM6IHRlYW0uZGF0YS5tZW1iZXJzLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgcmVtb3ZlbWVtYmVyOiBmdW5jdGlvbihpZCwgaW5kZXgsIHVzZXJJRCkge1xyXG4gICAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlICsgaWQpXHJcbiAgICAgICAgICAudGhlbih0ZWFtID0+IHtcclxuICAgICAgICAgICAgdmFyIHJlbW92ZWRVc2VyID0gdGVhbS5kYXRhLm1lbWJlcnNbaW5kZXhdXHJcbiAgICAgICAgICAgIGlmIChpbmRleD09MCl7cmV0dXJuIFwicmVtb3ZpbmdBZG1pblwifVxyXG4gICAgICAgICAgICB0ZWFtLmRhdGEubWVtYmVycy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICBpZiAoIXVzZXJJRCl7XHJcbiAgICAgICAgICAgICAgJGh0dHAucG9zdCh0ZWFtcyArIFwiL3NlbmRBZG1pblJlbW92ZWRUZWFtXCIsIHtcclxuICAgICAgICAgICAgICAgIGlkOiB0ZWFtLmRhdGEubWVtYmVyc1swXS5pZCxcclxuICAgICAgICAgICAgICAgIG1lbWJlcjogcmVtb3ZlZFVzZXIubmFtZVxyXG4gICAgICAgICAgICAgIH0pOyAgXHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICRodHRwLnBvc3QodGVhbXMgKyBcIi9zZW5kUmVtb3ZlZFRlYW1cIiwge1xyXG4gICAgICAgICAgICAgICAgaWQ6IHVzZXJJRCxcclxuICAgICAgICAgICAgICB9KTsgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL3VwZGF0ZU1lbWJlcnNcIiwge1xyXG4gICAgICAgICAgICAgIG5ld01lbWJlcnM6IHRlYW0uZGF0YS5tZW1iZXJzLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuXHJcblxyXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvcmVtb3ZlXCIpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdldDogZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZSArIGlkKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIFxyXG4gICAgICAgIHRvZ2dsZUNsb3NlVGVhbTogZnVuY3Rpb24oaWQsIHN0YXR1cykge1xyXG4gICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvdG9nZ2xlQ2xvc2VUZWFtXCIsIHtcclxuICAgICAgICAgICAgc3RhdHVzOiBzdGF0dXNcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHRvZ2dsZUhpZGVUZWFtOiBmdW5jdGlvbihpZCwgc3RhdHVzKSB7XHJcbiAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi90b2dnbGVIaWRlVGVhbVwiLCB7XHJcbiAgICAgICAgICAgIHN0YXR1czogc3RhdHVzXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnZXRTZWxlY3RlZFRlYW1zOiBmdW5jdGlvbih0ZXh0LHNraWxsc0ZpbHRlcnMpIHtcclxuICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoIHRlYW1zICsgXCI/XCIgKyAkLnBhcmFtKHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IHRleHQsXHJcbiAgICAgICAgICAgICAgICBzZWFyY2g6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBza2lsbHNGaWx0ZXJzOiBza2lsbHNGaWx0ZXJzID8gc2tpbGxzRmlsdGVycyA6IHt9XHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfSwgXHJcbiAgXHJcblxyXG5cclxuICAgICAgfTtcclxuICAgIH1cclxuICBdKTtcclxuICAiLCJhbmd1bGFyLm1vZHVsZShcInJlZ1wiKS5mYWN0b3J5KFwiVXNlclNlcnZpY2VcIiwgW1xyXG4gIFwiJGh0dHBcIixcclxuICBcIlNlc3Npb25cIixcclxuICBmdW5jdGlvbigkaHR0cCwgU2Vzc2lvbikge1xyXG4gICAgdmFyIHVzZXJzID0gXCIvYXBpL3VzZXJzXCI7XHJcbiAgICB2YXIgYmFzZSA9IHVzZXJzICsgXCIvXCI7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAvLyBCYXNpYyBBY3Rpb25zXHJcbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgZ2V0Q3VycmVudFVzZXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZSArIFNlc3Npb24uZ2V0VXNlcklkKCkpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgZ2V0OiBmdW5jdGlvbihpZCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZSArIGlkKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGdldEFsbDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGdldFBhZ2U6IGZ1bmN0aW9uKHBhZ2UsIHNpemUsIHRleHQsc3RhdHVzRmlsdGVycyxOb3RzdGF0dXNGaWx0ZXJzKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLmdldCggdXNlcnMgKyBcIj9cIiArICQucGFyYW0oe1xyXG4gICAgICAgICAgICAgIHRleHQ6IHRleHQsXHJcbiAgICAgICAgICAgICAgcGFnZTogcGFnZSA/IHBhZ2UgOiAwLFxyXG4gICAgICAgICAgICAgIHNpemU6IHNpemUgPyBzaXplIDogMjAsXHJcbiAgICAgICAgICAgICAgc3RhdHVzRmlsdGVyczogc3RhdHVzRmlsdGVycyA/IHN0YXR1c0ZpbHRlcnMgOiB7fSxcclxuICAgICAgICAgICAgICBOb3RzdGF0dXNGaWx0ZXJzOiBOb3RzdGF0dXNGaWx0ZXJzID8gTm90c3RhdHVzRmlsdGVycyA6IHt9XHJcblxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICB1cGRhdGVQcm9maWxlOiBmdW5jdGlvbihpZCwgcHJvZmlsZSkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wdXQoYmFzZSArIGlkICsgXCIvcHJvZmlsZVwiLCB7XHJcbiAgICAgICAgICBwcm9maWxlOiBwcm9maWxlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICB1cGRhdGVDb25maXJtYXRpb246IGZ1bmN0aW9uKGlkLCBjb25maXJtYXRpb24pIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyBpZCArIFwiL2NvbmZpcm1cIiwge1xyXG4gICAgICAgICAgY29uZmlybWF0aW9uOiBjb25maXJtYXRpb25cclxuICAgICAgICB9KTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHVwZGF0ZUFsbDogZnVuY3Rpb24oaWQsIHVzZXIpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyBpZCArIFwiL3VwZGF0ZWFsbFwiLCB7XHJcbiAgICAgICAgICB1c2VyOiB1c2VyXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBkZWNsaW5lQWRtaXNzaW9uOiBmdW5jdGlvbihpZCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL2RlY2xpbmVcIik7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgIC8vIEFkbWluIE9ubHlcclxuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgZ2V0U3RhdHM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZSArIFwic3RhdHNcIik7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZXRUZWFtU3RhdHM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZSArIFwidGVhbVN0YXRzXCIpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgYWRtaXRVc2VyOiBmdW5jdGlvbihpZCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL2FkbWl0XCIpO1xyXG4gICAgICB9LFxyXG4gICAgICByZWplY3RVc2VyOiBmdW5jdGlvbihpZCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL3JlamVjdFwiKTtcclxuICAgICAgfSxcclxuICAgICAgc29mdEFkbWl0dFVzZXI6IGZ1bmN0aW9uKGlkKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvc29mdEFkbWl0XCIpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgc29mdFJlamVjdFVzZXI6IGZ1bmN0aW9uKGlkKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvc29mdFJlamVjdFwiKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHNlbmRCYXNpY01haWw6IGZ1bmN0aW9uKGlkICwgZW1haWwpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi9zZW5kQmFzaWNNYWlsXCIsSlNPTi5zdHJpbmdpZnkoZW1haWwpKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGNoZWNrSW46IGZ1bmN0aW9uKGlkKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvY2hlY2tpblwiKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGNoZWNrT3V0OiBmdW5jdGlvbihpZCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL2NoZWNrb3V0XCIpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgcmVtb3ZlVXNlcjogZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi9yZW1vdmV1c2VyXCIpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgbWFrZUFkbWluOiBmdW5jdGlvbihpZCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL21ha2VhZG1pblwiKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHJlbW92ZUFkbWluOiBmdW5jdGlvbihpZCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL3JlbW92ZWFkbWluXCIpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgbWFzc1JlamVjdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIFwibWFzc1JlamVjdFwiKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGdldFJlamVjdGlvbkNvdW50OiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBcInJlamVjdGlvbkNvdW50XCIpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgZ2V0TGF0ZXJSZWplY3RlZENvdW50OiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBcImxhdGVyUmVqZWN0Q291bnRcIik7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBtYXNzUmVqZWN0UmVzdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIFwibWFzc1JlamVjdFJlc3RcIik7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZXRSZXN0UmVqZWN0aW9uQ291bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZSArIFwicmVqZWN0aW9uQ291bnRSZXN0XCIpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgcmVqZWN0OiBmdW5jdGlvbihpZCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL3JlamVjdFwiKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHNlbmRMYWdnZXJFbWFpbHM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBcInNlbmRsYWdlbWFpbHNcIik7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBzZW5kUmVqZWN0RW1haWxzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgXCJzZW5kUmVqZWN0RW1haWxzXCIpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgc2VuZFJlamVjdEVtYWlsc1Jlc3Q6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBcInNlbmRSZWplY3RFbWFpbHNSZXN0XCIpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgc2VuZFJlamVjdEVtYWlsOiBmdW5jdGlvbihpZCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL3JlamVjdEVtYWlsXCIpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgc2VuZFBhc3N3b3JkUmVzZXRFbWFpbDogZnVuY3Rpb24oZW1haWwpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgXCJzZW5kUmVzZXRFbWFpbFwiLCB7IGVtYWlsOiBlbWFpbCB9KTtcclxuICAgICAgfSxcclxuXHJcblxyXG5cclxuICAgIH07XHJcbiAgfVxyXG5dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXHJcbiAgLmNvbnRyb2xsZXIoJ2FkbWluQ2hhbGxlbmdlQ3RybCcsW1xyXG4gICAgJyRzY29wZScsXHJcbiAgICAnJGh0dHAnLFxyXG4gICAgJ2NoYWxsZW5nZScsXHJcbiAgICAnQ2hhbGxlbmdlU2VydmljZScsXHJcbiAgICBmdW5jdGlvbigkc2NvcGUsICRodHRwLCBjaGFsbGVuZ2UsIENoYWxsZW5nZVNlcnZpY2Upe1xyXG4gICAgICAkc2NvcGUuc2VsZWN0ZWRjaGFsbGVuZ2UgPSBjaGFsbGVuZ2UuZGF0YTtcclxuICAgICAgXHJcbiAgICAgIENoYWxsZW5nZVNlcnZpY2UuZ2V0QW5zd2VyKGNoYWxsZW5nZS5kYXRhLl9pZCkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkY2hhbGxlbmdlLmFuc3dlciA9IHJlc3BvbnNlLmRhdGEuYW5zd2VyO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgICRzY29wZS50b2dnbGVQYXNzd29yZCA9IGZ1bmN0aW9uICgpIHsgJHNjb3BlLnR5cGVQYXNzd29yZCA9ICEkc2NvcGUudHlwZVBhc3N3b3JkOyB9O1xyXG5cclxuXHJcbiAgICAgICRzY29wZS51cGRhdGVDaGFsbGVuZ2UgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIENoYWxsZW5nZVNlcnZpY2VcclxuICAgICAgICAgIC51cGRhdGUoJHNjb3BlLnNlbGVjdGVkY2hhbGxlbmdlLl9pZCwgJHNjb3BlLnNlbGVjdGVkY2hhbGxlbmdlKVxyXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAkc2VsZWN0ZWRjaGFsbGVuZ2UgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICBzd2FsKFwiVXBkYXRlZCFcIiwgXCJDaGFsbGVuZ2UgdXBkYXRlZC5cIiwgXCJzdWNjZXNzXCIpO1xyXG4gICAgICAgICAgfSwgcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBzd2FsKFwiT29wcywgeW91IGZvcmdvdCBzb21ldGhpbmcuXCIpO1xyXG4gICAgICAgICAgfSk7ICBcclxuICAgICAgfTtcclxuXHJcbiAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKFwicmVnXCIpLmNvbnRyb2xsZXIoXCJhZG1pbkNoYWxsZW5nZXNDdHJsXCIsIFtcclxuICBcIiRzY29wZVwiLFxyXG4gIFwiJHN0YXRlXCIsXHJcbiAgXCIkc3RhdGVQYXJhbXNcIixcclxuICBcIkNoYWxsZW5nZVNlcnZpY2VcIixcclxuICBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCBDaGFsbGVuZ2VTZXJ2aWNlKSB7XHJcblxyXG4gICAgJHNjb3BlLmNoYWxsZW5nZXMgPSBbXTtcclxuXHJcbiAgICAvLyBTZW1hbnRpYy1VSSBtb3ZlcyBtb2RhbCBjb250ZW50IGludG8gYSBkaW1tZXIgYXQgdGhlIHRvcCBsZXZlbC5cclxuICAgIC8vIFdoaWxlIHRoaXMgaXMgdXN1YWxseSBuaWNlLCBpdCBtZWFucyB0aGF0IHdpdGggb3VyIHJvdXRpbmcgd2lsbCBnZW5lcmF0ZVxyXG4gICAgLy8gbXVsdGlwbGUgbW9kYWxzIGlmIHlvdSBjaGFuZ2Ugc3RhdGUuIEtpbGwgdGhlIHRvcCBsZXZlbCBkaW1tZXIgbm9kZSBvbiBpbml0aWFsIGxvYWRcclxuICAgIC8vIHRvIHByZXZlbnQgdGhpcy5cclxuICAgICQoXCIudWkuZGltbWVyXCIpLnJlbW92ZSgpO1xyXG4gICAgLy8gUG9wdWxhdGUgdGhlIHNpemUgb2YgdGhlIG1vZGFsIGZvciB3aGVuIGl0IGFwcGVhcnMsIHdpdGggYW4gYXJiaXRyYXJ5IENoYWxsZW5nZS5cclxuXHJcbiAgICBmdW5jdGlvbiByZWZyZXNoUGFnZSgpIHtcclxuICAgICAgQ2hhbGxlbmdlU2VydmljZS5nZXRBbGwoKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAkc2NvcGUuY2hhbGxlbmdlcyA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlZnJlc2hQYWdlKCk7XHJcblxyXG4gICAgJHNjb3BlLmdvQ2hhbGxlbmdlID0gZnVuY3Rpb24oJGV2ZW50LCBjaGFsbGVuZ2UpIHtcclxuXHJcbiAgICAgICRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgJHN0YXRlLmdvKFwiYXBwLmFkbWluLmNoYWxsZW5nZVwiLCB7XHJcbiAgICAgICAgaWQ6IGNoYWxsZW5nZS5faWRcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgJHNjb3BlLmNyZWF0ZUNoYWxsZW5nZSA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgc3dhbChcIldyaXRlIHRoZSBjaGFsbGVuZ2UgdGl0bGU6XCIsIHtcclxuICAgICAgICBidXR0b25zOiB7Y2FuY2VsOiB7dGV4dDogXCJDYW5jZWxcIix2YWx1ZTogbnVsbCx2aXNpYmxlOiB0cnVlfSwgeWVzOiB7dGV4dDogXCJOZXh0IGlucHV0XCIsdmFsdWU6IHRydWUsdmlzaWJsZTogdHJ1ZX0gfSxcclxuICAgICAgICBjb250ZW50OiB7ZWxlbWVudDogXCJpbnB1dFwiLCBhdHRyaWJ1dGVzOiB7cGxhY2Vob2xkZXI6IFwiR2l2ZSB0aGlzIGNoYWxsZW5nZSBhIHNleHkgbmFtZS4uXCIsdHlwZTogXCJ0ZXh0XCJ9IH0sXHJcbiAgICAgIH0pXHJcbiAgICAgIC50aGVuKCh0aXRsZSkgPT4geyBpZiAoIXRpdGxlKSB7cmV0dXJuO31cclxuICAgICAgICBzd2FsKFwiRW50ZXIgdGhlIGNoYWxsZW5nZSBkZXNjcmlwdGlvbjpcIiwge1xyXG4gICAgICAgICAgYnV0dG9uczoge2NhbmNlbDoge3RleHQ6IFwiQ2FuY2VsXCIsdmFsdWU6IG51bGwsdmlzaWJsZTogdHJ1ZX0sIHllczoge3RleHQ6IFwiTmV4dCBpbnB1dFwiLHZhbHVlOiB0cnVlLHZpc2libGU6IHRydWV9IH0sXHJcbiAgICAgICAgICBjb250ZW50OiB7ZWxlbWVudDogXCJpbnB1dFwiLCBhdHRyaWJ1dGVzOiB7cGxhY2Vob2xkZXI6IFwiRGVzY3JpYmUgdGhpcyBjaGFsbGVuZ2Ugc28gdGhhdCBwZW9wbGUgY2FuIGdldCB0aGUgaWRlYS4uXCIsdHlwZTogXCJ0ZXh0XCJ9IH0sXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKChkZXNjcmlwdGlvbikgPT4geyBpZiAoIWRlc2NyaXB0aW9uKSB7cmV0dXJuO31cclxuICAgICAgICAgIHN3YWwoXCJFbnRlciB0aGUgY2hhbGxlbmdlIGRlcGVuZGVuY3kgKExJTkspOlwiLCB7XHJcbiAgICAgICAgICAgIGJ1dHRvbnM6IHtjYW5jZWw6IHt0ZXh0OiBcIkNhbmNlbFwiLHZhbHVlOiBudWxsLHZpc2libGU6IHRydWV9LCB5ZXM6IHt0ZXh0OiBcIk5leHQgaW5wdXRcIix2YWx1ZTogdHJ1ZSx2aXNpYmxlOiB0cnVlfSB9LFxyXG4gICAgICAgICAgICBjb250ZW50OiB7ZWxlbWVudDogXCJpbnB1dFwiLCBhdHRyaWJ1dGVzOiB7cGxhY2Vob2xkZXI6IFwiaHR0cDovL3d3dy5leGFtcGxlLmNvbS9DaGFsbGVuZ2U0Mi56aXBcIix0eXBlOiBcInRleHRcIn0gfSxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIC50aGVuKChkZXBlbmRlbmN5KSA9PiB7IGlmICghZGVwZW5kZW5jeSkge3JldHVybjt9XHJcbiAgICAgICAgICAgIHN3YWwoXCJFbnRlciB0aGUgYW5zd2VyOlwiLCB7XHJcbiAgICAgICAgICAgICAgYnV0dG9uczoge2NhbmNlbDoge3RleHQ6IFwiQ2FuY2VsXCIsdmFsdWU6IG51bGwsdmlzaWJsZTogdHJ1ZX0sIHllczoge3RleHQ6IFwiTmV4dCBpbnB1dFwiLHZhbHVlOiB0cnVlLHZpc2libGU6IHRydWV9IH0sXHJcbiAgICAgICAgICAgICAgY29udGVudDoge2VsZW1lbnQ6IFwiaW5wdXRcIiwgYXR0cmlidXRlczoge3BsYWNlaG9sZGVyOiBcInNoaGhoIHRoaXMgc2kgc3VwZXIgc2VjcmV0IGJyb1wiLHR5cGU6IFwidGV4dFwifSB9LFxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC50aGVuKChhbnN3ZXIpID0+IHsgaWYgKCFhbnN3ZXIpIHtyZXR1cm47fVxyXG4gICAgICAgICAgICAgIHN3YWwoXCJFbnRlciB0aGUgbnVtYmVyIG9mIHBvaW50cyBmb3IgdGhpcyBjaGFsbGVuZ2U6XCIsIHtcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtjYW5jZWw6IHt0ZXh0OiBcIkNhbmNlbFwiLHZhbHVlOiBudWxsLHZpc2libGU6IHRydWV9LCB5ZXM6IHt0ZXh0OiBcIk5leHQgaW5wdXRcIix2YWx1ZTogdHJ1ZSx2aXNpYmxlOiB0cnVlfSB9LFxyXG4gICAgICAgICAgICAgICAgY29udGVudDoge2VsZW1lbnQ6IFwiaW5wdXRcIiwgYXR0cmlidXRlczoge3BsYWNlaG9sZGVyOiBcIlBvaW50cyBhd2FyZGVkIHRvIGNoYWxsZW5nZSBzb2x2ZXJzXCIsdHlwZTogXCJudW1iZXJcIn0gfSxcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgLnRoZW4oKHBvaW50cykgPT4geyBpZiAoIXBvaW50cykge3JldHVybjt9XHJcbiAgXHJcbiAgICAgICAgICAgICAgICBjRGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgdGl0bGU6dGl0bGUsXHJcbiAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOmRlc2NyaXB0aW9uLFxyXG4gICAgICAgICAgICAgICAgICBkZXBlbmRlbmN5OmRlcGVuZGVuY3ksXHJcbiAgICAgICAgICAgICAgICAgIGFuc3dlcjphbnN3ZXIsXHJcbiAgICAgICAgICAgICAgICAgIHBvaW50czpwb2ludHMsXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBDaGFsbGVuZ2VTZXJ2aWNlLmNyZWF0ZShjRGF0YSkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJlZnJlc2hQYWdlKCk7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLnJlbW92ZUNoYWxsZW5nZSA9IGZ1bmN0aW9uKCRldmVudCwgY2hhbGxlbmdlLCBpbmRleCkge1xyXG4gICAgICAkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIHN3YWwoe1xyXG4gICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgIGNhbmNlbDoge1xyXG4gICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxyXG4gICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGFjY2VwdDoge1xyXG4gICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxyXG4gICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcclxuICAgICAgICAgICAgdGV4dDogXCJZZXMsIHJlbW92ZSB0aGVtXCIsXHJcbiAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkYW5nZXJNb2RlOiB0cnVlLFxyXG4gICAgICAgIGljb246IFwid2FybmluZ1wiLFxyXG4gICAgICAgIHRleHQ6IFwiWW91IGFyZSBhYm91dCB0byByZW1vdmUgXCIgKyBjaGFsbGVuZ2UudGl0bGUgKyBcIiFcIixcclxuICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiXHJcbiAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeWVzOiB7XHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcclxuICAgICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcclxuICAgICAgICAgICAgICB0ZXh0OiBcIlllcywgcmVtb3ZlIHRoaXMgY2hhbGxlbmdlXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHRydWUsXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZGFuZ2VyTW9kZTogdHJ1ZSxcclxuICAgICAgICAgIHRpdGxlOiBcIkFyZSB5b3Ugc3VyZT9cIixcclxuICAgICAgICAgIHRleHQ6IFwiUmVtZW1iZXIsIHRoaXMgcG93ZXIgaXMgYSBwcml2aWxlZ2UuXCIsXHJcbiAgICAgICAgICBpY29uOiBcIndhcm5pbmdcIlxyXG4gICAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgQ2hhbGxlbmdlU2VydmljZS5yZW1vdmUoY2hhbGxlbmdlLl9pZCkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICRzY29wZS5jaGFsbGVuZ2VzW2luZGV4XSA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgICAgXCJSZW1vdmVkXCIsXHJcbiAgICAgICAgICAgICAgcmVzcG9uc2UuZGF0YS50aXRsZSArIFwiIGhhcyBiZWVuIHJlbW92ZWQuXCIsXHJcbiAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgcmVmcmVzaFBhZ2UoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICB9XHJcbl0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZShcInJlZ1wiKS5jb250cm9sbGVyKFwiQWRtaW5NYWlsQ3RybFwiLCBbXHJcbiAgXCIkc2NvcGVcIixcclxuICBcIiRzdGF0ZVwiLFxyXG4gIFwiJHN0YXRlUGFyYW1zXCIsXHJcbiAgXCJVc2VyU2VydmljZVwiLFxyXG4gIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsIFVzZXJTZXJ2aWNlKSB7XHJcbiAgICAkc2NvcGUucGFnZXMgPSBbXTtcclxuICAgICRzY29wZS51c2VycyA9IFtdO1xyXG5cclxuICAgIC8vIFNlbWFudGljLVVJIG1vdmVzIG1vZGFsIGNvbnRlbnQgaW50byBhIGRpbW1lciBhdCB0aGUgdG9wIGxldmVsLlxyXG4gICAgLy8gV2hpbGUgdGhpcyBpcyB1c3VhbGx5IG5pY2UsIGl0IG1lYW5zIHRoYXQgd2l0aCBvdXIgcm91dGluZyB3aWxsIGdlbmVyYXRlXHJcbiAgICAvLyBtdWx0aXBsZSBtb2RhbHMgaWYgeW91IGNoYW5nZSBzdGF0ZS4gS2lsbCB0aGUgdG9wIGxldmVsIGRpbW1lciBub2RlIG9uIGluaXRpYWwgbG9hZFxyXG4gICAgLy8gdG8gcHJldmVudCB0aGlzLlxyXG4gICAgJChcIi51aS5kaW1tZXJcIikucmVtb3ZlKCk7XHJcbiAgICAvLyBQb3B1bGF0ZSB0aGUgc2l6ZSBvZiB0aGUgbW9kYWwgZm9yIHdoZW4gaXQgYXBwZWFycywgd2l0aCBhbiBhcmJpdHJhcnkgdXNlci5cclxuXHJcblxyXG5cclxuICAgIFVzZXJTZXJ2aWNlLmdldFBhZ2UoJHN0YXRlUGFyYW1zLnBhZ2UsICRzdGF0ZVBhcmFtcy5zaXplLCAkc3RhdGVQYXJhbXMucXVlcnksICRzY29wZS5zdGF0dXNGaWx0ZXJzKVxyXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAkc2NvcGUudXNlcnM9IHJlc3BvbnNlLmRhdGEudXNlcnM7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkc2NvcGUuc2VuZEVtYWlsID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBmaWx0ZXJlZFVzZXJzID0gJHNjb3BlLnVzZXJzLmZpbHRlcihcclxuICAgICAgICB1ID0+IHUudmVyaWZpZWRcclxuICAgICk7XHJcblxyXG4gICAgICBpZiAoJHNjb3BlLnN0YXR1c0ZpbHRlcnMuY29tcGxldGVkUHJvZmlsZSkge1xyXG4gICAgICAgIGZpbHRlcmVkVXNlcnMgPSBmaWx0ZXJlZFVzZXJzLmZpbHRlcihcclxuICAgICAgICAgIHUgPT4gdS5zdGF0dXMuY29tcGxldGVkUHJvZmlsZVxyXG4gICAgICApfVxyXG5cclxuICAgICAgaWYgKCRzY29wZS5zdGF0dXNGaWx0ZXJzLmFkbWl0dGVkKSB7XHJcbiAgICAgICAgZmlsdGVyZWRVc2VycyA9IGZpbHRlcmVkVXNlcnMuZmlsdGVyKFxyXG4gICAgICAgICAgdSA9PiB1LnN0YXR1cy5hZG1pdHRlZFxyXG4gICAgICApfVxyXG5cclxuICAgICAgaWYgKCRzY29wZS5zdGF0dXNGaWx0ZXJzLmNvbmZpcm1lZCkge1xyXG4gICAgICAgIGZpbHRlcmVkVXNlcnMgPSBmaWx0ZXJlZFVzZXJzLmZpbHRlcihcclxuICAgICAgICAgIHUgPT4gdS5zdGF0dXMuY29uZmlybWVkXHJcbiAgICAgICl9XHJcblxyXG4gICAgICBpZiAoJHNjb3BlLnN0YXR1c0ZpbHRlcnMuZGVjbGluZWQpIHtcclxuICAgICAgICBmaWx0ZXJlZFVzZXJzID0gZmlsdGVyZWRVc2Vycy5maWx0ZXIoXHJcbiAgICAgICAgICB1ID0+IHUuc3RhdHVzLmRlY2xpbmVkXHJcbiAgICAgICl9XHJcblxyXG4gICAgICBpZiAoJHNjb3BlLnN0YXR1c0ZpbHRlcnMuY2hlY2tlZEluKSB7XHJcbiAgICAgICAgZmlsdGVyZWRVc2VycyA9IGZpbHRlcmVkVXNlcnMuZmlsdGVyKFxyXG4gICAgICAgICAgdSA9PiB1LnN0YXR1cy5jaGVja2VkSW5cclxuICAgICAgKX1cclxuXHJcbiAgICAgIHZhciBtZXNzYWdlID0gJCh0aGlzKS5kYXRhKFwiY29uZmlybVwiKTtcclxuXHJcbiAgICAgIHN3YWwoe1xyXG4gICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXHJcbiAgICAgICAgdGV4dDogYFlvdSdyZSBhYm91dCB0byBzZW5kIHRoaXMgZW1haWwgdG8gJHtcclxuICAgICAgICAgIGZpbHRlcmVkVXNlcnMubGVuZ3RoXHJcbiAgICAgICAgfSBzZWxlY3RlZCB1c2VyKHMpLmAsXHJcbiAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgYnV0dG9uczogW1wiQ2FuY2VsXCIsIFwiWWVzLCBzZW5kIHRoZSBlbWFpbHNcIl0sXHJcbiAgICAgICAgZGFuZ2VyTW9kZTogdHJ1ZVxyXG4gICAgICB9KS50aGVuKHdpbGxTZW5kID0+IHtcclxuICAgICAgICBlbWFpbCA9IHsgc3ViamVjdDokc2NvcGUuc3ViamVjdCAsIHRpdGxlOiRzY29wZS50aXRsZSwgYm9keTokc2NvcGUuYm9keSB9XHJcblxyXG4gICAgICAgIGlmICh3aWxsU2VuZCkge1xyXG4gICAgICAgICAgaWYgKGZpbHRlcmVkVXNlcnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGZpbHRlcmVkVXNlcnMuZm9yRWFjaCh1c2VyID0+IHtcclxuICAgICAgICAgICAgICBVc2VyU2VydmljZS5zZW5kQmFzaWNNYWlsKHVzZXIuaWQsZW1haWwpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgICBcIlNlbmRpbmchXCIsXHJcbiAgICAgICAgICAgICAgYFNlbmRpbmcgZW1haWxzIHRvICR7XHJcbiAgICAgICAgICAgICAgICBmaWx0ZXJlZFVzZXJzLmxlbmd0aFxyXG4gICAgICAgICAgICAgIH0gdXNlcnMhYCxcclxuICAgICAgICAgICAgICBcInN1Y2Nlc3NcIlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc3dhbChcIldob29wc1wiLCBcIllvdSBjYW4ndCBzZW5kIG9yIGFjY2VwdCAwIHVzZXJzIVwiLCBcImVycm9yXCIpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICB9XHJcbl0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZShcInJlZ1wiKS5jb250cm9sbGVyKFwiYWRtaW5NYXJrZXRpbmdDdHJsXCIsIFtcclxuICBcIiRzY29wZVwiLFxyXG4gIFwiJHN0YXRlXCIsXHJcbiAgXCIkc3RhdGVQYXJhbXNcIixcclxuICBcIk1hcmtldGluZ1NlcnZpY2VcIixcclxuICBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCBNYXJrZXRpbmdTZXJ2aWNlKSB7XHJcblxyXG4gICAgLy8gU2VtYW50aWMtVUkgbW92ZXMgbW9kYWwgY29udGVudCBpbnRvIGEgZGltbWVyIGF0IHRoZSB0b3AgbGV2ZWwuXHJcbiAgICAvLyBXaGlsZSB0aGlzIGlzIHVzdWFsbHkgbmljZSwgaXQgbWVhbnMgdGhhdCB3aXRoIG91ciByb3V0aW5nIHdpbGwgZ2VuZXJhdGVcclxuICAgIC8vIG11bHRpcGxlIG1vZGFscyBpZiB5b3UgY2hhbmdlIHN0YXRlLiBLaWxsIHRoZSB0b3AgbGV2ZWwgZGltbWVyIG5vZGUgb24gaW5pdGlhbCBsb2FkXHJcbiAgICAvLyB0byBwcmV2ZW50IHRoaXMuXHJcbiAgICAkKFwiLnVpLmRpbW1lclwiKS5yZW1vdmUoKTtcclxuICAgIC8vIFBvcHVsYXRlIHRoZSBzaXplIG9mIHRoZSBtb2RhbCBmb3Igd2hlbiBpdCBhcHBlYXJzLCB3aXRoIGFuIGFyYml0cmFyeSB1c2VyLlxyXG5cclxuXHJcblxyXG5cclxuICAgICRzY29wZS5jcmVhdGVUZWFtcyA9IGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICBpZiAoJHNjb3BlLmJvZHkgJiYgJHNjb3BlLmV2ZW50KXtcclxuICAgICAgICBzd2FsKHtcclxuICAgICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXHJcbiAgICAgICAgICB0ZXh0OiBgWW91J3JlIGFib3V0IHRvIGFkZCB0aGVzZSB0ZWFtcyBlbWFpbHMgdG8gdGhlIG1hcmtldGluZyBkYXRhYmFzZWAsXHJcbiAgICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcclxuICAgICAgICAgIGJ1dHRvbnM6IFtcIkNhbmNlbFwiLCBcIlllcywgQWRkIHRlYW1zXCJdLFxyXG4gICAgICAgICAgZGFuZ2VyTW9kZTogdHJ1ZVxyXG4gICAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHZhciB0ZWFtcyA9ICRzY29wZS5ib2R5LnNwbGl0KCc7Jyk7XHJcbiAgICAgICAgICAgIHRlYW1zLmZvckVhY2godGVhbSA9PiB7XHJcbiAgICAgICAgICAgICAgdGVhbURhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICBldmVudDokc2NvcGUuZXZlbnQsXHJcbiAgICAgICAgICAgICAgICBtZW1iZXJzOnRlYW0ucmVwbGFjZSgnICcsJycpLnNwbGl0KCcsJylcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgTWFya2V0aW5nU2VydmljZS5jcmVhdGVUZWFtKHRlYW1EYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHN3YWwoXCJBZGRlZFwiLCBcIlRlYW1zIGFkZGVkIHRvIGRhdGFiYXNlLlwiLCBcInN1Y2Nlc3NcIik7XHJcbiAgICAgICAgICAgICRzY29wZS5ib2R5PVwiXCJcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBzd2FsKFwiRVJST1IhXCIsIFwiQWxsIGZpZWxkcyBhcmUgcmVxdWlyZWQuXCIsIFwiZXJyb3JcIik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgXHJcbiAgfVxyXG5dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXHJcbiAgLmNvbnRyb2xsZXIoJ0FkbWluU2V0dGluZ3NDdHJsJywgW1xyXG4gICAgJyRzY29wZScsXHJcbiAgICAnJHNjZScsXHJcbiAgICAnU2V0dGluZ3NTZXJ2aWNlJyxcclxuICAgIGZ1bmN0aW9uKCRzY29wZSwgJHNjZSwgU2V0dGluZ3NTZXJ2aWNlKXtcclxuXHJcbiAgICAgICRzY29wZS5zZXR0aW5ncyA9IHt9O1xyXG4gICAgICBTZXR0aW5nc1NlcnZpY2VcclxuICAgICAgICAuZ2V0UHVibGljU2V0dGluZ3MoKVxyXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgIHVwZGF0ZVNldHRpbmdzKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgZnVuY3Rpb24gdXBkYXRlU2V0dGluZ3Moc2V0dGluZ3Mpe1xyXG4gICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgIC8vIEZvcm1hdCB0aGUgZGF0ZXMgaW4gc2V0dGluZ3MuXHJcbiAgICAgICAgc2V0dGluZ3MudGltZU9wZW4gPSBuZXcgRGF0ZShzZXR0aW5ncy50aW1lT3Blbik7XHJcbiAgICAgICAgc2V0dGluZ3MudGltZUNsb3NlID0gbmV3IERhdGUoc2V0dGluZ3MudGltZUNsb3NlKTtcclxuICAgICAgICBzZXR0aW5ncy50aW1lQ29uZmlybSA9IG5ldyBEYXRlKHNldHRpbmdzLnRpbWVDb25maXJtKTtcclxuICAgICAgICBzZXR0aW5ncy50aW1lU3RhcnQgPSBuZXcgRGF0ZShzZXR0aW5ncy50aW1lU3RhcnQpO1xyXG5cclxuICAgICAgICAkc2NvcGUuc2V0dGluZ3MgPSBzZXR0aW5ncztcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gQWRkaXRpb25hbCBPcHRpb25zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICAkc2NvcGUudXBkYXRlQWxsb3dNaW5vcnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgU2V0dGluZ3NTZXJ2aWNlXHJcbiAgICAgICAgICAudXBkYXRlQWxsb3dNaW5vcnMoJHNjb3BlLnNldHRpbmdzLmFsbG93TWlub3JzKVxyXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAkc2NvcGUuc2V0dGluZ3MuYWxsb3dNaW5vcnMgPSByZXNwb25zZS5kYXRhLmFsbG93TWlub3JzO1xyXG4gICAgICAgICAgICBjb25zdCBzdWNjZXNzVGV4dCA9ICRzY29wZS5zZXR0aW5ncy5hbGxvd01pbm9ycyA/XHJcbiAgICAgICAgICAgICAgXCJNaW5vcnMgYXJlIG5vdyBhbGxvd2VkIHRvIHJlZ2lzdGVyLlwiIDpcclxuICAgICAgICAgICAgICBcIk1pbm9ycyBhcmUgbm8gbG9uZ2VyIGFsbG93ZWQgdG8gcmVnaXN0ZXIuXCJcclxuICAgICAgICAgICAgc3dhbChcIkxvb2tzIGdvb2QhXCIsIHN1Y2Nlc3NUZXh0LCBcInN1Y2Nlc3NcIik7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vIFdoaXRlbGlzdCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgU2V0dGluZ3NTZXJ2aWNlXHJcbiAgICAgICAgLmdldFdoaXRlbGlzdGVkRW1haWxzKClcclxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAkc2NvcGUud2hpdGVsaXN0ID0gcmVzcG9uc2UuZGF0YS5qb2luKFwiLCBcIik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICRzY29wZS51cGRhdGVXaGl0ZWxpc3QgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgU2V0dGluZ3NTZXJ2aWNlXHJcbiAgICAgICAgICAgIC51cGRhdGVXaGl0ZWxpc3RlZEVtYWlscygkc2NvcGUud2hpdGVsaXN0LnJlcGxhY2UoLyAvZywgJycpLnNwbGl0KCcsJykpXHJcbiAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICBzd2FsKCdXaGl0ZWxpc3QgdXBkYXRlZC4nKTtcclxuICAgICAgICAgICAgICAkc2NvcGUud2hpdGVsaXN0ID0gcmVzcG9uc2UuZGF0YS53aGl0ZWxpc3RlZEVtYWlscy5qb2luKFwiLCBcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAvLyBSZWdpc3RyYXRpb24gVGltZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgICRzY29wZS5mb3JtYXREYXRlID0gZnVuY3Rpb24oZGF0ZSl7XHJcbiAgICAgICAgaWYgKCFkYXRlKXtcclxuICAgICAgICAgIHJldHVybiBcIkludmFsaWQgRGF0ZVwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSGFjayBmb3IgdGltZXpvbmVcclxuICAgICAgICByZXR1cm4gbW9tZW50KGRhdGUpLmZvcm1hdCgnZGRkZCwgTU1NTSBEbyBZWVlZLCBoOm1tIGEnKSArXHJcbiAgICAgICAgICBcIiBcIiArIGRhdGUudG9UaW1lU3RyaW5nKCkuc3BsaXQoJyAnKVsyXTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vIFRha2UgYSBkYXRlIGFuZCByZW1vdmUgdGhlIHNlY29uZHMuXHJcbiAgICAgIGZ1bmN0aW9uIGNsZWFuRGF0ZShkYXRlKXtcclxuICAgICAgICByZXR1cm4gbmV3IERhdGUoXHJcbiAgICAgICAgICBkYXRlLmdldEZ1bGxZZWFyKCksXHJcbiAgICAgICAgICBkYXRlLmdldE1vbnRoKCksXHJcbiAgICAgICAgICBkYXRlLmdldERhdGUoKSxcclxuICAgICAgICAgIGRhdGUuZ2V0SG91cnMoKSxcclxuICAgICAgICAgIGRhdGUuZ2V0TWludXRlcygpXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgJHNjb3BlLnVwZGF0ZVJlZ2lzdHJhdGlvblRpbWVzID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAvLyBDbGVhbiB0aGUgZGF0ZXMgYW5kIHR1cm4gdGhlbSB0byBtcy5cclxuICAgICAgICB2YXIgb3BlbiA9IGNsZWFuRGF0ZSgkc2NvcGUuc2V0dGluZ3MudGltZU9wZW4pLmdldFRpbWUoKTtcclxuICAgICAgICB2YXIgY2xvc2UgPSBjbGVhbkRhdGUoJHNjb3BlLnNldHRpbmdzLnRpbWVDbG9zZSkuZ2V0VGltZSgpO1xyXG5cclxuICAgICAgICBpZiAob3BlbiA8IDAgfHwgY2xvc2UgPCAwIHx8IG9wZW4gPT09IHVuZGVmaW5lZCB8fCBjbG9zZSA9PT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgIHJldHVybiBzd2FsKCdPb3BzLi4uJywgJ1lvdSBuZWVkIHRvIGVudGVyIHZhbGlkIHRpbWVzLicsICdlcnJvcicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob3BlbiA+PSBjbG9zZSl7XHJcbiAgICAgICAgICBzd2FsKCdPb3BzLi4uJywgJ1JlZ2lzdHJhdGlvbiBjYW5ub3Qgb3BlbiBhZnRlciBpdCBjbG9zZXMuJywgJ2Vycm9yJyk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBTZXR0aW5nc1NlcnZpY2VcclxuICAgICAgICAgIC51cGRhdGVSZWdpc3RyYXRpb25UaW1lcyhvcGVuLCBjbG9zZSlcclxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgdXBkYXRlU2V0dGluZ3MocmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgICAgIHN3YWwoXCJMb29rcyBnb29kIVwiLCBcIlJlZ2lzdHJhdGlvbiBUaW1lcyBVcGRhdGVkXCIsIFwic3VjY2Vzc1wiKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgLy8gQ29uZmlybWF0aW9uIFRpbWUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgICRzY29wZS51cGRhdGVDb25maXJtYXRpb25UaW1lID0gZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgY29uZmlybUJ5ID0gY2xlYW5EYXRlKCRzY29wZS5zZXR0aW5ncy50aW1lQ29uZmlybSkuZ2V0VGltZSgpO1xyXG5cclxuICAgICAgICBTZXR0aW5nc1NlcnZpY2VcclxuICAgICAgICAgIC51cGRhdGVDb25maXJtYXRpb25UaW1lKGNvbmZpcm1CeSlcclxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgdXBkYXRlU2V0dGluZ3MocmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgICAgIHN3YWwoXCJTb3VuZHMgZ29vZCFcIiwgXCJDb25maXJtYXRpb24gRGF0ZSBVcGRhdGVkXCIsIFwic3VjY2Vzc1wiKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgLy8gRXZlbnQgU3RhcnQgVGltZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgJHNjb3BlLnVwZGF0ZVN0YXJ0VGltZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIHN0YXJ0QnkgPSBjbGVhbkRhdGUoJHNjb3BlLnNldHRpbmdzLnRpbWVTdGFydCkuZ2V0VGltZSgpO1xyXG5cclxuICAgICAgICBTZXR0aW5nc1NlcnZpY2VcclxuICAgICAgICAgIC51cGRhdGVTdGFydFRpbWUoc3RhcnRCeSlcclxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgdXBkYXRlU2V0dGluZ3MocmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgICAgIHN3YWwoXCJTb3VuZHMgZ29vZCFcIiwgXCJFdmVudCBTdGFydCBEYXRlIFVwZGF0ZWRcIiwgXCJzdWNjZXNzXCIpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG5cclxuICAgICAgLy8gQWNjZXB0YW5jZSAvIENvbmZpcm1hdGlvbiBUZXh0IC0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgIHZhciBjb252ZXJ0ZXIgPSBuZXcgc2hvd2Rvd24uQ29udmVydGVyKCk7XHJcblxyXG4gICAgICAkc2NvcGUubWFya2Rvd25QcmV2aWV3ID0gZnVuY3Rpb24odGV4dCl7XHJcbiAgICAgICAgcmV0dXJuICRzY2UudHJ1c3RBc0h0bWwoY29udmVydGVyLm1ha2VIdG1sKHRleHQpKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgICRzY29wZS51cGRhdGVXYWl0bGlzdFRleHQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciB0ZXh0ID0gJHNjb3BlLnNldHRpbmdzLndhaXRsaXN0VGV4dDtcclxuICAgICAgICBTZXR0aW5nc1NlcnZpY2VcclxuICAgICAgICAgIC51cGRhdGVXYWl0bGlzdFRleHQodGV4dClcclxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgc3dhbChcIkxvb2tzIGdvb2QhXCIsIFwiV2FpdGxpc3QgVGV4dCBVcGRhdGVkXCIsIFwic3VjY2Vzc1wiKTtcclxuICAgICAgICAgICAgdXBkYXRlU2V0dGluZ3MocmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgICRzY29wZS51cGRhdGVIb3N0U2Nob29sID0gZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgaG9zdFNjaG9vbCA9ICRzY29wZS5zZXR0aW5ncy5ob3N0U2Nob29sO1xyXG4gICAgICAgIFNldHRpbmdzU2VydmljZVxyXG4gICAgICAgICAgLnVwZGF0ZUhvc3RTY2hvb2woaG9zdFNjaG9vbClcclxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgc3dhbChcIkxvb2tzIGdvb2QhXCIsIFwiSG9zdCBTY2hvb2wgVXBkYXRlZFwiLCBcInN1Y2Nlc3NcIik7XHJcbiAgICAgICAgICAgIHVwZGF0ZVNldHRpbmdzKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgXHJcbiAgICAgICRzY29wZS51cGRhdGVBY2NlcHRhbmNlVGV4dCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIHRleHQgPSAkc2NvcGUuc2V0dGluZ3MuYWNjZXB0YW5jZVRleHQ7XHJcbiAgICAgICAgU2V0dGluZ3NTZXJ2aWNlXHJcbiAgICAgICAgICAudXBkYXRlQWNjZXB0YW5jZVRleHQodGV4dClcclxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgc3dhbChcIkxvb2tzIGdvb2QhXCIsIFwiQWNjZXB0YW5jZSBUZXh0IFVwZGF0ZWRcIiwgXCJzdWNjZXNzXCIpO1xyXG4gICAgICAgICAgICB1cGRhdGVTZXR0aW5ncyhyZXNwb25zZS5kYXRhKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgJHNjb3BlLnVwZGF0ZUNvbmZpcm1hdGlvblRleHQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciB0ZXh0ID0gJHNjb3BlLnNldHRpbmdzLmNvbmZpcm1hdGlvblRleHQ7XHJcbiAgICAgICAgU2V0dGluZ3NTZXJ2aWNlXHJcbiAgICAgICAgICAudXBkYXRlQ29uZmlybWF0aW9uVGV4dCh0ZXh0KVxyXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBzd2FsKFwiTG9va3MgZ29vZCFcIiwgXCJDb25maXJtYXRpb24gVGV4dCBVcGRhdGVkXCIsIFwic3VjY2Vzc1wiKTtcclxuICAgICAgICAgICAgdXBkYXRlU2V0dGluZ3MocmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICB9XSk7XHJcbiIsIlxyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3JlZycpXHJcbi5jb250cm9sbGVyKCdBZG1pblRlYW1DdHJsJywgW1xyXG4gICckc2NvcGUnLFxyXG4gICckc3RhdGUnLFxyXG4gICckdGltZW91dCcsXHJcbiAgJ2N1cnJlbnRVc2VyJyxcclxuICAnc2V0dGluZ3MnLFxyXG4gICdVdGlscycsXHJcbiAgJ1VzZXJTZXJ2aWNlJyxcclxuICAnVGVhbVNlcnZpY2UnLFxyXG4gICdURUFNJyxcclxuICBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUsICR0aW1lb3V0LCBjdXJyZW50VXNlciwgc2V0dGluZ3MsIFV0aWxzLCBVc2VyU2VydmljZSwgVGVhbVNlcnZpY2UsIFRFQU0pIHtcclxuICAgIC8vIEdldCB0aGUgY3VycmVudCB1c2VyJ3MgbW9zdCByZWNlbnQgZGF0YS4gXHJcbiAgICB2YXIgU2V0dGluZ3MgPSBzZXR0aW5ncy5kYXRhO1xyXG5cclxuICAgICRzY29wZS5yZWdJc09wZW4gPSBVdGlscy5pc1JlZ09wZW4oU2V0dGluZ3MpO1xyXG5cclxuICAgICRzY29wZS51c2VyID0gY3VycmVudFVzZXIuZGF0YTtcclxuXHJcbiAgICBmdW5jdGlvbiBpc1RlYW1NZW1iZXIodGVhbXMsIFVzZXJpZCkge1xyXG4gICAgICB2YXIgdGVzdCA9IGZhbHNlO1xyXG4gICAgICB0ZWFtcy5mb3JFYWNoKHRlYW0gPT4ge1xyXG4gICAgICAgIHRlYW0ubWVtYmVycy5mb3JFYWNoKG1lbWJlciA9PiB7XHJcbiAgICAgICAgICBpZiAobWVtYmVyLmlkID09IFVzZXJpZCkgdGVzdCA9IHRydWU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gdGVzdDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzZWxlY3RNZW1iZXIobWVtYmVySWQpIHtcclxuICAgICAgVXNlclNlcnZpY2UuZ2V0KG1lbWJlcklkKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICB1c2VyID0gcmVzcG9uc2UuZGF0YVxyXG4gICAgICAgICRzY29wZS5zZWxlY3RlZFVzZXIgPSB1c2VyO1xyXG4gICAgICAgICRzY29wZS5zZWxlY3RlZFVzZXIuc2VjdGlvbnMgPSBnZW5lcmF0ZVNlY3Rpb25zKHVzZXIpO1xyXG4gICAgICB9KTtcclxuICAgICAgY29uc29sZS5sb2codXNlcik7XHJcbiAgICAgICQoXCIubG9uZy51c2VyLm1vZGFsXCIpLm1vZGFsKFwic2hvd1wiKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZW5lcmF0ZVNlY3Rpb25zKHVzZXIpIHtcclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBuYW1lOiBcIlByb2ZpbGVcIixcclxuICAgICAgICAgIGZpZWxkczogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJHZW5kZXJcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmdlbmRlclxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJTY2hvb2xcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLnNjaG9vbFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJHaXRodWJcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmdpdGh1YlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJMaW5rZWRpblwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUubGlua2VkaW5cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIF1cclxuICAgICAgICB9LFxyXG4gICAgICBdO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGZvcm1hdFRpbWUodGltZSkge1xyXG4gICAgICBpZiAodGltZSkge1xyXG4gICAgICAgIHJldHVybiBtb21lbnQodGltZSkuZm9ybWF0KFwiTU1NTSBEbyBZWVlZLCBoOm1tOnNzIGFcIik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAkc2NvcGUuc2VsZWN0TWVtYmVyID0gc2VsZWN0TWVtYmVyO1xyXG5cclxuXHJcbiAgICAkc2NvcGUuaXNqb2luZWQgPSBmdW5jdGlvbiAodGVhbSkge1xyXG4gICAgICB2YXIgdGVzdCA9IGZhbHNlO1xyXG4gICAgICB0ZWFtLmpvaW5SZXF1ZXN0cy5mb3JFYWNoKG1lbWJlciA9PiB7XHJcbiAgICAgICAgaWYgKG1lbWJlci5pZCA9PSBjdXJyZW50VXNlci5kYXRhLl9pZCkgdGVzdCA9IHRydWU7XHJcbiAgICAgIH0pXHJcbiAgICAgIHJldHVybiB0ZXN0O1xyXG4gICAgfVxyXG5cclxuICAgIFRlYW1TZXJ2aWNlLmdldEFsbCgpLnRoZW4odGVhbXMgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyh0ZWFtcy5kYXRhKTtcclxuXHJcbiAgICAgICRzY29wZS5pc1RlYW1BZG1pbiA9IGZhbHNlO1xyXG4gICAgICAkc2NvcGUuaXNUZWFtTWVtYmVyID0gZmFsc2U7XHJcbiAgICAgIHRlYW1zLmRhdGEuZm9yRWFjaCh0ZWFtID0+IHtcclxuICAgICAgICB0ZWFtLmlzTWF4dGVhbSA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAodGVhbS5tZW1iZXJzLmxlbmd0aCA+PSBTZXR0aW5ncy5tYXhUZWFtU2l6ZSkge1xyXG4gICAgICAgICAgdGVhbS5pc0NvbG9zZWQgPSB0cnVlO1xyXG4gICAgICAgICAgdGVhbS5pc01heHRlYW0gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRlYW0ubWVtYmVyc1swXS5pZCA9PSBjdXJyZW50VXNlci5kYXRhLl9pZCkge1xyXG4gICAgICAgICAgdGVhbS5qb2luUmVxdWVzdHMuZm9yRWFjaChtZW1iZXIgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXNUZWFtTWVtYmVyKHRlYW1zLmRhdGEsIG1lbWJlci5pZCkpIHtcclxuICAgICAgICAgICAgICBtZW1iZXIudW5hdmFpbGFibGUgPSB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2UgeyBtZW1iZXIudW5hdmFpbGFibGUgPSBmYWxzZSB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgICRzY29wZS51c2VyQWRtaW5UZWFtID0gdGVhbTtcclxuICAgICAgICAgICRzY29wZS5pc1RlYW1BZG1pbiA9IHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRlYW0ubWVtYmVycy5mb3JFYWNoKG1lbWJlciA9PiB7XHJcbiAgICAgICAgICAgIGlmIChtZW1iZXIuaWQgPT0gY3VycmVudFVzZXIuZGF0YS5faWQpIHtcclxuICAgICAgICAgICAgICAkc2NvcGUudXNlck1lbWJlclRlYW0gPSB0ZWFtO1xyXG4gICAgICAgICAgICAgICRzY29wZS5pc1RlYW1NZW1iZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgXHJcbiAgICAgICRzY29wZS50ZWFtcyA9IHRlYW1zLmRhdGE7XHJcblxyXG4gICAgfSk7XHJcblxyXG5cclxuICAgICRzY29wZS5jcmVhdGVUZWFtID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgdGVhbURhdGEgPSB7XHJcbiAgICAgICAgZGVzY3JpcHRpb246ICRzY29wZS5uZXdUZWFtX2Rlc2NyaXB0aW9uLFxyXG4gICAgICAgIG1lbWJlcnM6IFt7IGlkOiBjdXJyZW50VXNlci5kYXRhLl9pZCwgbmFtZTogY3VycmVudFVzZXIuZGF0YS5wcm9maWxlLm5hbWUsIHNraWxsOiAkc2NvcGUubmV3VGVhbV9BZG1pbnNraWxsIH1dLFxyXG4gICAgICAgIHNraWxsczogeyBjb2RlOiAkc2NvcGUuc2tpbGxjb2RlLCBkZXNpZ246ICRzY29wZS5za2lsbGRlc2lnbiwgaGFyZHdhcmU6ICRzY29wZS5za2lsbGhhcmR3YXJlLCBpZGVhOiAkc2NvcGUuc2tpbGxpZGVhIH0sXHJcbiAgICAgICAgaXNDb2xvc2VkOiBmYWxzZSxcclxuICAgICAgfVxyXG4gICAgICBjb25zb2xlLmxvZyh0ZWFtRGF0YSk7XHJcbiAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5uZXdUZWFtX0FkbWluc2tpbGwpO1xyXG5cclxuICAgICAgVGVhbVNlcnZpY2UuY3JlYXRlKHRlYW1EYXRhKTtcclxuICAgICAgJHN0YXRlLnJlbG9hZCgpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgJHNjb3BlLlNob3djcmVhdGVUZWFtID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAkc2NvcGUuU2hvd05ld1RlYW1Gcm9tID0gdHJ1ZTtcclxuICAgICAgJHNjb3BlLnNraWxsY29kZSA9IHRydWVcclxuICAgICAgJHNjb3BlLnNraWxsZGVzaWduID0gdHJ1ZVxyXG4gICAgICAkc2NvcGUuc2tpbGxoYXJkd2FyZSA9IHRydWVcclxuICAgICAgJHNjb3BlLnNraWxsaWRlYSA9IHRydWVcclxuICAgICAgJHNjb3BlLm5ld1RlYW1fQWRtaW5za2lsbCA9IFwiY29kZVwiXHJcbiAgICB9XHJcblxyXG5cclxuICAgICRzY29wZS5TaG93Sm9pblRlYW0gPSBmdW5jdGlvbigpe1xyXG4gICAgICAkc2NvcGUuU2hvd0pvaW5UZWFtRnJvbSA9IHRydWU7ICBcclxuICAgIH1cclxuXHJcblxyXG4gICAgJHNjb3BlLmpvaW5UZWFtQ29kZSA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgIHRlYW1JRCA9ICRzY29wZS5uZXdUZWFtX0NvZGU7XHJcbiAgICAgIG5ld1RlYW1fc2tpbGw9ICRzY29wZS5uZXdUZWFtX3NraWxsO1xyXG5cclxuICAgICAgbmV3dXNlcj0ge2lkOmN1cnJlbnRVc2VyLmRhdGEuX2lkLCBuYW1lOmN1cnJlbnRVc2VyLmRhdGEucHJvZmlsZS5uYW1lLCBza2lsbDpuZXdUZWFtX3NraWxsfTtcclxuICAgICAgVGVhbVNlcnZpY2Uuam9pbih0ZWFtSUQsbmV3dXNlcik7IFxyXG4gICAgICBzd2FsKFxyXG4gICAgICAgIFwiSm9pbmVkXCIsXHJcbiAgICAgICAgXCJZb3UgaGF2ZSBhcHBsaWNlZCB0byBqb2luIHRoaXMgdGVhbSwgd2FpdCBmb3IgdGhlIFRlYW0tQWRtaW4gdG8gYWNjZXB0IHlvdXIgYXBwbGljYXRpb24uXCIsXHJcbiAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgKTsgIFxyXG4gICAgICAkc3RhdGUucmVsb2FkKCk7XHJcbiBcclxuICAgIH1cclxuICAgIFxyXG4gICAgJHNjb3BlLmpvaW5UZWFtID0gZnVuY3Rpb24gKHRlYW0pIHtcclxuXHJcbiAgICAgIHZhciB2YWx1ZTtcclxuICAgICAgY29uc3Qgc2VsZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2VsZWN0Jyk7XHJcbiAgICAgIHNlbGVjdC5jbGFzc05hbWUgPSAnc2VsZWN0LWN1c3RvbSdcclxuXHJcblxyXG4gICAgICB2YXIgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcbiAgICAgIG9wdGlvbi5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgIG9wdGlvbi5pbm5lckhUTUwgPSAnU2VsZWN0IGEgc2tpbGwnO1xyXG4gICAgICBvcHRpb24udmFsdWUgPSBcImNvZGVcIlxyXG4gICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQob3B0aW9uKTtcclxuXHJcblxyXG4gICAgICBpZiAodGVhbS5za2lsbHMuY29kZSkge1xyXG4gICAgICAgIG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xyXG4gICAgICAgIG9wdGlvbi5pbm5lckhUTUwgPSAnQ29kZSc7XHJcbiAgICAgICAgb3B0aW9uLnZhbHVlID0gXCJjb2RlXCJcclxuICAgICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQob3B0aW9uKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAodGVhbS5za2lsbHMuZGVzaWduKSB7XHJcbiAgICAgICAgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcbiAgICAgICAgb3B0aW9uLmlubmVySFRNTCA9ICdEZXNpZ24nO1xyXG4gICAgICAgIG9wdGlvbi52YWx1ZSA9IFwiZGVzaWduXCJcclxuICAgICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQob3B0aW9uKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAodGVhbS5za2lsbHMuaGFyZHdhcmUpIHtcclxuICAgICAgICBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcclxuICAgICAgICBvcHRpb24uaW5uZXJIVE1MID0gJ0hhcmR3YXJlJztcclxuICAgICAgICBvcHRpb24udmFsdWUgPSBcImhhcmR3YXJlXCJcclxuICAgICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQob3B0aW9uKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAodGVhbS5za2lsbHMuaWRlYSkge1xyXG4gICAgICAgIG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xyXG4gICAgICAgIG9wdGlvbi5pbm5lckhUTUwgPSAnSWRlYSc7XHJcbiAgICAgICAgb3B0aW9uLnZhbHVlID0gXCJpZGVhXCJcclxuICAgICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQob3B0aW9uKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgc2VsZWN0Lm9uY2hhbmdlID0gZnVuY3Rpb24gc2VsZWN0Q2hhbmdlZChlKSB7XHJcbiAgICAgICAgdmFsdWUgPSBlLnRhcmdldC52YWx1ZVxyXG4gICAgICB9XHJcblxyXG4gICAgICBzd2FsKHtcclxuICAgICAgICB0aXRsZTogXCJQbGVhc2Ugc2VsZWN0IHlvdXIgc2tpbGwgdG8gam9pblwiLFxyXG5cclxuICAgICAgICBjb250ZW50OiB7XHJcbiAgICAgICAgICBlbGVtZW50OiBzZWxlY3QsXHJcbiAgICAgICAgfVxyXG4gICAgICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgbmV3dXNlciA9IHsgaWQ6IGN1cnJlbnRVc2VyLmRhdGEuX2lkLCBuYW1lOiBjdXJyZW50VXNlci5kYXRhLnByb2ZpbGUubmFtZSwgc2tpbGw6IHZhbHVlIH07XHJcbiAgICAgICAgVGVhbVNlcnZpY2Uuam9pbih0ZWFtLl9pZCwgbmV3dXNlcik7XHJcbiAgICAgICAgc3dhbChcclxuICAgICAgICAgIFwiSm9pbmVkXCIsXHJcbiAgICAgICAgICBcIllvdSBoYXZlIGFwcGxpY2VkIHRvIGpvaW4gdGhpcyB0ZWFtLCB3YWl0IGZvciB0aGUgVGVhbS1BZG1pbiB0byBhY2NlcHQgeW91ciBhcHBsaWNhdGlvbi5cIixcclxuICAgICAgICAgIFwic3VjY2Vzc1wiXHJcbiAgICAgICAgKTtcclxuICAgICAgICAkc3RhdGUucmVsb2FkKCk7XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcblxyXG5cclxuICAgICRzY29wZS5hY2NlcHRNZW1iZXIgPSBmdW5jdGlvbiAodGVhbUlELCBtZW1iZXIsIGluZGV4KSB7XHJcblxyXG4gICAgICBzd2FsKHtcclxuICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxyXG4gICAgICAgIHRleHQ6IFwiWW91IGFyZSBhYm91dCB0byBhY2NlcHQgXCIgKyBtZW1iZXIubmFtZSArIFwiIHRvIHlvdXIgdGVhbSEgVGhpcyB3aWxsIHNlbmQgaGltIGEgbm90aWZpY2F0aW9uIGVtYWlsIGFuZCB3aWxsIHNob3cgaW4gdGhlIHB1YmxpYyB0ZWFtcyBwYWdlLlwiLFxyXG4gICAgICAgIGljb246IFwid2FybmluZ1wiLFxyXG4gICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgIGNhbmNlbDoge1xyXG4gICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxyXG4gICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGNoZWNrSW46IHtcclxuICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcclxuICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgIHRleHQ6IFwiWWVzLCBsZXQgaGltIGluXCIsXHJcbiAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFRlYW1TZXJ2aWNlLmFjY2VwdE1lbWJlcih0ZWFtSUQsIG1lbWJlciwgU2V0dGluZ3MubWF4VGVhbVNpemUpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgaWYgKHJlc3BvbnNlID09IFwibWF4VGVhbVNpemVcIikge1xyXG4gICAgICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgICAgIFwiRXJyb3JcIixcclxuICAgICAgICAgICAgICBcIk1heGltdW0gbnVtYmVyIG9mIG1lbWJlcnMgKFwiICsgU2V0dGluZ3MubWF4VGVhbVNpemUgKyBcIikgcmVhY2hlZFwiLFxyXG4gICAgICAgICAgICAgIFwiZXJyb3JcIlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgVGVhbVNlcnZpY2UucmVtb3Zlam9pbih0ZWFtSUQsIGluZGV4LCBmYWxzZSkudGhlbihyZXNwb25zZTIgPT4ge1xyXG4gICAgICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgICAgICBcIkFjY2VwdGVkXCIsXHJcbiAgICAgICAgICAgICAgICBtZW1iZXIubmFtZSArIFwiIGhhcyBiZWVuIGFjY2VwdGVkIHRvIHlvdXIgdGVhbS5cIixcclxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiXHJcbiAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgICRzY29wZS5yZWZ1c2VNZW1iZXIgPSBmdW5jdGlvbiAodGVhbUlELCBtZW1iZXIsIGluZGV4KSB7XHJcbiAgICAgIHN3YWwoe1xyXG4gICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXHJcbiAgICAgICAgdGV4dDogXCJZb3UgYXJlIGFib3V0IHRvIHJlZnVzZSBcIiArIG1lbWJlci5uYW1lICsgXCIgZnJvbSB5b3VyIHRlYW0hIFRoaXMgd2lsbCBzZW5kIGhpbSBhIG5vdGlmaWNhdGlvbiBlbWFpbC5cIixcclxuICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcclxuICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgdGV4dDogXCJDYW5jZWxcIixcclxuICAgICAgICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBjaGVja0luOiB7XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXHJcbiAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlLFxyXG4gICAgICAgICAgICB0ZXh0OiBcIlllcywgcmVmdXNlIGhpbVwiLFxyXG4gICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XHJcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBUZWFtU2VydmljZS5yZW1vdmVqb2luKHRlYW1JRCwgaW5kZXgsIG1lbWJlcikudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgICBcIlJlZnVzZWRcIixcclxuICAgICAgICAgICAgbWVtYmVyLm5hbWUgKyBcIiBoYXMgYmVlbiByZWZ1c2VkIGZyb20geW91ciB0ZWFtLlwiLFxyXG4gICAgICAgICAgICBcInN1Y2Nlc3NcIlxyXG4gICAgICAgICAgKTtcclxuICAgICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgICRzY29wZS5yZW1vdmVNZW1iZXJmcm9tVGVhbSA9IGZ1bmN0aW9uICh0ZWFtSUQsIG1lbWJlciwgaW5kZXgpIHtcclxuICAgICAgc3dhbCh7XHJcbiAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIixcclxuICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gcmVtb3ZlIFwiICsgbWVtYmVyLm5hbWUgKyBcIiBmcm9tIHlvdXIgdGVhbSEgVGhpcyB3aWxsIHNlbmQgaGltIGEgbm90aWZpY2F0aW9uIGVtYWlsLlwiLFxyXG4gICAgICAgIGljb246IFwid2FybmluZ1wiLFxyXG4gICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgIGNhbmNlbDoge1xyXG4gICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxyXG4gICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGNoZWNrSW46IHtcclxuICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcclxuICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgIHRleHQ6IFwiWWVzLCByZW1vdmUgaGltXCIsXHJcbiAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFRlYW1TZXJ2aWNlLnJlbW92ZW1lbWJlcih0ZWFtSUQsIGluZGV4LCBtZW1iZXIuaWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgaWYgKHJlc3BvbnNlID09IFwicmVtb3ZpbmdBZG1pblwiKSB7XHJcbiAgICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgICAgXCJFcnJvclwiLFxyXG4gICAgICAgICAgICAgIFwiWW91IGNhbid0IHJlbW92ZSB0aGUgVGVhbSBBZG1pbiwgQnV0IHlvdSBjYW4gY2xvc2UgdGhlIHRlYW0uXCIsXHJcbiAgICAgICAgICAgICAgXCJlcnJvclwiXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBUZWFtU2VydmljZS5yZW1vdmVqb2luKHRlYW1JRCwgaW5kZXgsIGZhbHNlKS50aGVuKHJlc3BvbnNlMiA9PiB7XHJcbiAgICAgICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgICAgIFwiUmVtb3ZlZFwiLFxyXG4gICAgICAgICAgICAgICAgbWVtYmVyLm5hbWUgKyBcIiBoYXMgYmVlbiByZW1vdmVkIGZyb20geW91ciB0ZWFtLlwiLFxyXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgJHNjb3BlLnJlbW92ZVRlYW0gPSBmdW5jdGlvbiAodGVhbSkge1xyXG4gICAgICBzd2FsKHtcclxuICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxyXG4gICAgICAgIHRleHQ6IFwiWW91IGFyZSBhYm91dCB0byByZW1vdmUgdGhpcyB0ZWFtIHdpdGggYWxsIGl0J3MgbWVtYmVycyEgVGhpcyB3aWxsIHNlbmQgdGhlbSBhIG5vdGlmaWNhdGlvbiBlbWFpbC4gWW91IG5lZWQgdG8gZmluZCBhbm90aGVyIHRlYW0gdG8gd29yayB3aXRoLlwiLFxyXG4gICAgICAgIGljb246IFwid2FybmluZ1wiLFxyXG4gICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgIGNhbmNlbDoge1xyXG4gICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxyXG4gICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGNoZWNrSW46IHtcclxuICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcclxuICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgIHRleHQ6IFwiWWVzLCByZW1vdmUgdGVhbVwiLFxyXG4gICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XHJcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZW1haWwgPSB7XHJcbiAgICAgICAgICBzdWJqZWN0OiBcIllvdXIgdGVhbSBoYXMgYmVlbiByZW1vdmVkXCIsXHJcbiAgICAgICAgICB0aXRsZTogXCJUaW1lIGZvciBhIGJhY2t1cCBwbGFuXCIsXHJcbiAgICAgICAgICBib2R5OiBcIlRoZSB0ZWFtIHlvdSBoYXZlIGJlZW4gcGFydCAoTWVtYmVyL3JlcXVlc3RlZCB0byBqb2luKSBvZiBoYXMgYmVlbiByZW1vdmVkLiBQbGVhc2UgY2hlY2sgeW91ciBkYXNoYm9hcmQgYW5kIHRyeSB0byBmaW5kIGFub3RoZXIgdGVhbSB0byB3b3JrIHdpdGggYmVmb3JlIHRoZSBoYWNrYXRob24gc3RhcnRzLlwiXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBUZWFtU2VydmljZS5yZW1vdmUodGVhbS5faWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgdGVhbS5tZW1iZXJzLmZvckVhY2godXNlciA9PiB7XHJcbiAgICAgICAgICAgIFVzZXJTZXJ2aWNlLnNlbmRCYXNpY01haWwodXNlci5pZCwgZW1haWwpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICB0ZWFtLmpvaW5SZXF1ZXN0cy5mb3JFYWNoKHVzZXIgPT4ge1xyXG4gICAgICAgICAgICBVc2VyU2VydmljZS5zZW5kQmFzaWNNYWlsKHVzZXIuaWQsIGVtYWlsKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgIFwiUmVtb3ZlZFwiLFxyXG4gICAgICAgICAgICBcIlRlYW0gaGFzIGJlZW4gcmVtb3ZlZC5cIixcclxuICAgICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAkc2NvcGUubGVhdmVUZWFtID0gZnVuY3Rpb24gKHRlYW0pIHtcclxuICAgICAgc3dhbCh7XHJcbiAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIixcclxuICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gbGVhdmUgeW91ciB0ZWFtISBUaGlzIHdpbGwgc2VuZCB0aGUgYWRtaW4gYSBub3RpZmljYXRpb24gZW1haWwuXCIsXHJcbiAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgY2FuY2VsOiB7XHJcbiAgICAgICAgICAgIHRleHQ6IFwiQ2FuY2VsXCIsXHJcbiAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgY2hlY2tJbjoge1xyXG4gICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxyXG4gICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcclxuICAgICAgICAgICAgdGV4dDogXCJZZXMsIHJlbW92ZSBoaW1cIixcclxuICAgICAgICAgICAgdmFsdWU6IHRydWUsXHJcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGluZGV4ID0gMDtcclxuICAgICAgICB0ZWFtLm1lbWJlcnMuZm9yRWFjaChtZW1iZXIgPT4ge1xyXG4gICAgICAgICAgaWYgKG1lbWJlci5pZCA9PSBjdXJyZW50VXNlci5kYXRhLl9pZCkge1xyXG4gICAgICAgICAgICBUZWFtU2VydmljZS5yZW1vdmVtZW1iZXIodGVhbS5faWQsIGluZGV4KS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgICAgICAgXCJSZW1vdmVkXCIsXHJcbiAgICAgICAgICAgICAgICBcIllvdSBoYXZlIHN1Y2Nlc3NmdWxseSBsZWZ0IHRoaXMgdGVhbS4gUGxlYXNlIGZpbmQgYW5vdGhlciB0ZWFtIG9yIGNyZWF0ZSB5b3VyIG93bi5cIixcclxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiXHJcbiAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGluZGV4Kys7XHJcbiAgICAgICAgfSlcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgICRzY29wZS5jYW5jZWxqb2luVGVhbSA9IGZ1bmN0aW9uICh0ZWFtKSB7XHJcbiAgICAgIHN3YWwoe1xyXG4gICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXHJcbiAgICAgICAgdGV4dDogXCJZb3UgYXJlIGFib3V0IHRvIGNhbmNlbCB5b3VyIHJlcXVlc3QgdG8gam9pbiB0aGlzIHRlYW0hXCIsXHJcbiAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgY2FuY2VsOiB7XHJcbiAgICAgICAgICAgIHRleHQ6IFwiTm9cIixcclxuICAgICAgICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBjaGVja0luOiB7XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXHJcbiAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlLFxyXG4gICAgICAgICAgICB0ZXh0OiBcIlllcywgQ2FuY2VsXCIsXHJcbiAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBpbmRleCA9IDA7XHJcblxyXG4gICAgICAgIHRlYW0uam9pblJlcXVlc3RzLmZvckVhY2gobWVtYmVyID0+IHtcclxuICAgICAgICAgIGlmIChtZW1iZXIuaWQgPT0gY3VycmVudFVzZXIuZGF0YS5faWQpIHtcclxuICAgICAgICAgICAgVGVhbVNlcnZpY2UucmVtb3Zlam9pbih0ZWFtLl9pZCwgaW5kZXgsIGZhbHNlKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgICAgICAgXCJSZW1vdmVkXCIsXHJcbiAgICAgICAgICAgICAgICBcIllvdSBoYXZlIHN1Y2Nlc3NmdWxseSBjYW5jZWxlZCB5b3UgcmVxdWVzdCB0byBqb2luIHRoaXMgdGVhbS4gUGxlYXNlIGZpbmQgYW5vdGhlciB0ZWFtIG9yIGNyZWF0ZSB5b3VyIG93bi5cIixcclxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiXHJcbiAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGluZGV4Kys7XHJcbiAgICAgICAgfSlcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgICRzY29wZS50b2dnbGVDbG9zZVRlYW0gPSBmdW5jdGlvbiAodGVhbUlELCBzdGF0dXMpIHtcclxuICAgICAgaWYgKHN0YXR1cyA9PSB0cnVlKSB7XHJcbiAgICAgICAgdGV4dCA9IFwiWW91IGFyZSBhYm91dCB0byBDbG9zZSB0aGlzIHRlYW0uIFRoaXMgd29uJ3QgYWxsb3cgb3RoZXIgbWVtYmVycyB0byBqb2luIHlvdXIgdGVhbSFcIlxyXG4gICAgICB9IGVsc2UgeyB0ZXh0ID0gXCJZb3UgYXJlIGFib3V0IHRvIHJlb3BlbiB0aGlzIHRlYW0uIFRoaXMgd2lsbCBhbGxvdyBvdGhlciBtZW1iZXJzIHRvIGpvaW4geW91ciB0ZWFtIVwiIH1cclxuXHJcbiAgICAgIHN3YWwoe1xyXG4gICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXHJcbiAgICAgICAgdGV4dDogdGV4dCxcclxuICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcclxuICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgdGV4dDogXCJOb1wiLFxyXG4gICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGNoZWNrSW46IHtcclxuICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcclxuICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgIHRleHQ6IFwiWWVzXCIsXHJcbiAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFRlYW1TZXJ2aWNlLnRvZ2dsZUNsb3NlVGVhbSh0ZWFtSUQsIHN0YXR1cykudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgICBcIkRvbmVcIixcclxuICAgICAgICAgICAgXCJPcGVyYXRpb24gc3VjY2Vzc2Z1bGx5IENvbXBsZXRlZC5cIixcclxuICAgICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgJHNjb3BlLnRvZ2dsZUhpZGVUZWFtID0gZnVuY3Rpb24gKHRlYW1JRCwgc3RhdHVzKSB7XHJcbiAgICAgIGlmIChzdGF0dXMgPT0gdHJ1ZSkge1xyXG4gICAgICAgIHRleHQgPSBcIllvdSBhcmUgYWJvdXQgdG8gSGlkZSB0aGlzIHRlYW0uIFRoaXMgd29uJ3QgYWxsb3cgb3RoZXIgbWVtYmVycyB0byBzZWUgeW91ciB0ZWFtIVwiXHJcbiAgICAgIH0gZWxzZSB7IHRleHQgPSBcIllvdSBhcmUgYWJvdXQgdG8gU2hvdyB0aGlzIHRlYW0uIFRoaXMgd2lsbCBhbGxvdyBvdGhlciBtZW1iZXJzIHRvIHNlZSB5b3VyIHRlYW0hXCIgfVxyXG5cclxuICAgICAgc3dhbCh7XHJcbiAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIixcclxuICAgICAgICB0ZXh0OiB0ZXh0LFxyXG4gICAgICAgIGljb246IFwid2FybmluZ1wiLFxyXG4gICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgIGNhbmNlbDoge1xyXG4gICAgICAgICAgICB0ZXh0OiBcIk5vXCIsXHJcbiAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgY2hlY2tJbjoge1xyXG4gICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxyXG4gICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcclxuICAgICAgICAgICAgdGV4dDogXCJZZXNcIixcclxuICAgICAgICAgICAgdmFsdWU6IHRydWUsXHJcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgVGVhbVNlcnZpY2UudG9nZ2xlSGlkZVRlYW0odGVhbUlELCBzdGF0dXMpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgXCJEb25lXCIsXHJcbiAgICAgICAgICAgIFwiT3BlcmF0aW9uIHN1Y2Nlc3NmdWxseSBDb21wbGV0ZWQuXCIsXHJcbiAgICAgICAgICAgIFwic3VjY2Vzc1wiXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAkc2NvcGUuJHdhdGNoKFwicXVlcnlUZXh0XCIsIGZ1bmN0aW9uIChxdWVyeVRleHQpIHtcclxuICAgICAgVGVhbVNlcnZpY2UuZ2V0U2VsZWN0ZWRUZWFtcyhxdWVyeVRleHQsICRzY29wZS5za2lsbHNGaWx0ZXJzKS50aGVuKFxyXG4gICAgICAgIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICRzY29wZS50ZWFtcyA9IHJlc3BvbnNlLmRhdGEudGVhbXM7XHJcbiAgICAgICAgfVxyXG4gICAgICApO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJHNjb3BlLmFwcGx5c2tpbGxzRmlsdGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBUZWFtU2VydmljZS5nZXRTZWxlY3RlZFRlYW1zKCRzY29wZS5xdWVyeVRleHQsICRzY29wZS5za2lsbHNGaWx0ZXJzKS50aGVuKFxyXG4gICAgICAgIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICRzY29wZS50ZWFtcyA9IHJlc3BvbnNlLmRhdGEudGVhbXM7XHJcbiAgICAgICAgfVxyXG4gICAgICApO1xyXG4gICAgfTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4gIH1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpIC5jb25maWcoWydDaGFydEpzUHJvdmlkZXInLCBmdW5jdGlvbiAoQ2hhcnRKc1Byb3ZpZGVyKSB7XHJcbiAgLy8gQ29uZmlndXJlIGFsbCBjaGFydHNcclxuICBDaGFydEpzUHJvdmlkZXIuc2V0T3B0aW9ucyh7XHJcbiAgICBjaGFydENvbG9yczogWycjOUI2NkZFJywgJyNGRjY0ODQnLCAnI0ZFQTAzRicsICcjRkJEMDREJywgJyM0REJGQzAnLCAnIzMzQTNFRicsICcjQ0FDQkNGJ10sXHJcbiAgICByZXNwb25zaXZlOiB0cnVlXHJcbiAgfSk7XHJcbn1dKVxyXG4uY29udHJvbGxlcignQWRtaW5TdGF0c0N0cmwnLFtcclxuICAgICckc2NvcGUnLFxyXG4gICAgJ1VzZXJTZXJ2aWNlJyxcclxuICAgIGZ1bmN0aW9uKCRzY29wZSwgVXNlclNlcnZpY2Upe1xyXG4gICAgICBcclxuICAgICAgVXNlclNlcnZpY2VcclxuICAgICAgICAuZ2V0U3RhdHMoKVxyXG4gICAgICAgIC50aGVuKHN0YXRzID0+IHtcclxuICAgICAgICAgICRzY29wZS5zdGF0cyA9IHN0YXRzLmRhdGE7IFxyXG5cclxuICAgICAgICAgIC8vIE1lYWxzIFxyXG4gICAgICAgICAgbGFiZWxzPVtdXHJcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0YXRzLmRhdGEubGl2ZS5tZWFsLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxhYmVscy5wdXNoKCdNZWFsICcrKGkrMSkpICAgICAgXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAkc2NvcGUubWVhbHMgPSB7IFxyXG4gICAgICAgICAgICBsYWJlbHMgOiBsYWJlbHMsXHJcbiAgICAgICAgICAgIHNlcmllcyA6IFsnTWVhbHMnXSxcclxuICAgICAgICAgICAgZGF0YSA6IHN0YXRzLmRhdGEubGl2ZS5tZWFsLFxyXG4gICAgICAgICAgICBvcHRpb25zIDoge1xyXG4gICAgICAgICAgICAgIFwic2NhbGVzXCI6e1xyXG4gICAgICAgICAgICAgICAgXCJ4QXhlc1wiOlt7XCJ0aWNrc1wiOntiZWdpbkF0WmVybzp0cnVlLG1heDpzdGF0cy5kYXRhLnRvdGFsfX1dXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRleHQ6ICdNZWFscyBDb25zdW1lZCdcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgICAvLyBXb3Jrc2hvcHMgXHJcbiAgICAgICAgICBsYWJlbHM9W11cclxuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RhdHMuZGF0YS5saXZlLndvcmtzaG9wLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxhYmVscy5wdXNoKCdXb3Jrc2hvcCAnKyhpKzEpKSAgICAgIFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgJHNjb3BlLndvcmtzaG9wcyA9IHsgXHJcbiAgICAgICAgICAgIGxhYmVscyA6IGxhYmVscyxcclxuICAgICAgICAgICAgc2VyaWVzIDogWydXb3Jrc2hvcHMnXSxcclxuICAgICAgICAgICAgZGF0YSA6IHN0YXRzLmRhdGEubGl2ZS53b3Jrc2hvcCxcclxuICAgICAgICAgICAgb3B0aW9uczp7XHJcbiAgICAgICAgICAgICAgZWxlbWVudHM6IHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IHtcclxuICAgICAgICAgICAgICAgICAgYm9yZGVyV2lkdGg6IDAuNSwgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgdGl0bGU6IHtcclxuICAgICAgICAgICAgICAgIGRpc3BsYXk6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB0ZXh0OiAnV29ya3Nob3BzIGF0dGVuZGFuY2UnXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIGNsdWJzXHJcbiAgICAgICAgICAkc2NvcGUuY2x1YnMgPSB7XHJcbiAgICAgICAgICAgIGxhYmVscyA6IHN0YXRzLmRhdGEuc291cmNlLmNsdWJzTGFiZWxzLFxyXG4gICAgICAgICAgICBzZXJpZXMgOiBbJ0NsdWJzJ10sXHJcbiAgICAgICAgICAgIGRhdGEgOiBzdGF0cy5kYXRhLnNvdXJjZS5jbHVicyxcclxuICAgICAgICAgICAgb3B0aW9uczp7XHJcbiAgICAgICAgICAgICAgZWxlbWVudHM6IHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IHtcclxuICAgICAgICAgICAgICAgICAgYm9yZGVyV2lkdGg6IDAuNSwgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgdGl0bGU6IHtcclxuICAgICAgICAgICAgICAgIGRpc3BsYXk6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB0ZXh0OiAnQXBwbGljYW50cyB2aWEgQ2x1YnMnXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICAgIGRpc3BsYXk6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JpZ2h0JyxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAvLyBHZXQgdGhlIG1vc3QgYWN0aXZlIGNsdWJcclxuICAgICAgICAgICB2YXIgYXJyID1zdGF0cy5kYXRhLnNvdXJjZS5jbHVic1xyXG4gICAgICAgICAgIHZhciBtYXggPSBhcnJbMF07XHJcbiAgICAgICAgICAgdmFyIG1heEluZGV4ID0gMDtcclxuICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICBpZiAoYXJyW2ldID4gbWF4KSB7XHJcbiAgICAgICAgICAgICAgICAgICBtYXhJbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICBtYXggPSBhcnJbaV07XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICRzY29wZS5maXJzdENsdWIgPSBzdGF0cy5kYXRhLnNvdXJjZS5jbHVic0xhYmVsc1ttYXhJbmRleF1cclxuXHJcbiAgICAgICBcclxuXHJcblxyXG4gICAgICAgICAgLy8gc291cmNlcyBcclxuICAgICAgICAgICRzY29wZS5zb3VyY2UgPSB7XHJcbiAgICAgICAgICAgIGxhYmVscyA6IFsnRmFjZWJvb2snLCdFbWFpbCcsJ0NsdWJzJ10sXHJcbiAgICAgICAgICAgIHNlcmllcyA6IFsnU291cmNlcyddLFxyXG4gICAgICAgICAgICBkYXRhIDogc3RhdHMuZGF0YS5zb3VyY2UuZ2VuZXJhbCxcclxuICAgICAgICAgICAgb3B0aW9uczp7XHJcbiAgICAgICAgICAgICAgZWxlbWVudHM6IHtcclxuICAgICAgICAgICAgICAgIGxpbmU6IHtcclxuICAgICAgICAgICAgICAgICAgYm9yZGVyV2lkdGg6IDAuNSwgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgdGl0bGU6IHtcclxuICAgICAgICAgICAgICAgIGRpc3BsYXk6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB0ZXh0OiAnQXBwbGljYW50cyBzb3VyY2VzJ1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdyaWdodCcsXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuXHJcblxyXG5cclxuICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgfSk7ICBcclxuXHJcblxyXG4gICAgICBVc2VyU2VydmljZVxyXG4gICAgICAgIC5nZXRUZWFtU3RhdHMoKVxyXG4gICAgICAgIC50aGVuKHRlYW1zdGF0cyA9PiB7XHJcbiAgICAgICAgICAkc2NvcGUudGVhbXN0YXRzID0gdGVhbXN0YXRzLmRhdGE7IFxyXG4gICAgICAgIH0pOyAgXHJcblxyXG5cclxuICAgICAgJHNjb3BlLmZyb21Ob3cgPSBmdW5jdGlvbihkYXRlKXtcclxuICAgICAgICByZXR1cm4gbW9tZW50KGRhdGUpLmZyb21Ob3coKTtcclxuICAgICAgfTtcclxuXHJcblxyXG4gICAgICBDaGFydC5kZWZhdWx0cy5nbG9iYWwuY29sb3JzID0gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJ3JnYmEoNTIsIDE1MiwgMjE5LCAwLjUpJyxcclxuICAgICAgICAgIHBvaW50QmFja2dyb3VuZENvbG9yOiAncmdiYSg1MiwgMTUyLCAyMTksIDAuNSknLFxyXG4gICAgICAgICAgcG9pbnRIb3ZlckJhY2tncm91bmRDb2xvcjogJ3JnYmEoMTUxLDE4NywyMDUsMC41KScsXHJcbiAgICAgICAgICBib3JkZXJDb2xvcjogJ3JnYmEoMCwwLDAsMCcsXHJcbiAgICAgICAgICBwb2ludEJvcmRlckNvbG9yOiAnI2ZmZicsXHJcbiAgICAgICAgICBwb2ludEhvdmVyQm9yZGVyQ29sb3I6ICdyZ2JhKDE1MSwxODcsMjA1LDAuNSknXHJcbiAgICAgICAgfVxyXG4gICAgICBdICAgICAgICBcclxuXHJcblxyXG4gICAgICAkc2NvcGUuc2VuZExhZ2dlckVtYWlscyA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICB0aXRsZTogXCJBcmUgeW91IHN1cmU/XCIsXHJcbiAgICAgICAgICB0ZXh0OiBcIlRoaXMgd2lsbCBzZW5kIGFuIGVtYWlsIHRvIGV2ZXJ5IHVzZXIgd2hvIGhhcyBub3Qgc3VibWl0dGVkIGFuIGFwcGxpY2F0aW9uLiBBcmUgeW91IHN1cmU/LlwiLFxyXG4gICAgICAgICAgdHlwZTogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlLFxyXG4gICAgICAgICAgY29uZmlybUJ1dHRvbkNvbG9yOiBcIiNERDZCNTVcIixcclxuICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiBcIlllcywgc2VuZC5cIixcclxuICAgICAgICAgIGNsb3NlT25Db25maXJtOiBmYWxzZVxyXG4gICAgICAgICAgfSwgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgVXNlclNlcnZpY2VcclxuICAgICAgICAgICAgICAuc2VuZExhZ2dlckVtYWlscygpXHJcbiAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHN3ZWV0QWxlcnQoJ1lvdXIgZW1haWxzIGhhdmUgYmVlbiBzZW50LicpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgJHNjb3BlLnNlbmRSZWplY3RFbWFpbHMgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgdGl0bGU6IFwiQXJlIHlvdSBzdXJlP1wiLFxyXG4gICAgICAgICAgdGV4dDogXCJUaGlzIHdpbGwgc2VuZCBhbiBlbWFpbCB0byBldmVyeSB1c2VyIHdobyBoYXMgYmVlbiByZWplY3RlZC4gQXJlIHlvdSBzdXJlP1wiLFxyXG4gICAgICAgICAgdHlwZTogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlLFxyXG4gICAgICAgICAgY29uZmlybUJ1dHRvbkNvbG9yOiBcIiNERDZCNTVcIixcclxuICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiBcIlllcywgc2VuZC5cIixcclxuICAgICAgICAgIGNsb3NlT25Db25maXJtOiBmYWxzZVxyXG4gICAgICAgICAgfSwgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgVXNlclNlcnZpY2VcclxuICAgICAgICAgICAgICAuc2VuZFJlamVjdEVtYWlscygpXHJcbiAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHN3ZWV0QWxlcnQoJ1lvdXIgZW1haWxzIGhhdmUgYmVlbiBzZW50LicpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgJHNjb3BlLnNlbmRSZWplY3RFbWFpbHNSZXN0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBVc2VyU2VydmljZVxyXG4gICAgICAgICAgLmdldExhdGVyUmVqZWN0ZWRDb3VudCgpXHJcbiAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihjb3VudCkge1xyXG4gICAgICAgICAgICBzd2FsKHtcclxuICAgICAgICAgICAgICB0aXRsZTogXCJBcmUgeW91IHN1cmU/XCIsXHJcbiAgICAgICAgICAgICAgdGV4dDogYFRoaXMgd2lsbCBzZW5kIHJlamVjdGlvbiBlbWFpbCB0byAke2NvdW50fSB1c2Vycy5gLFxyXG4gICAgICAgICAgICAgIHR5cGU6IFwid2FybmluZ1wiLFxyXG4gICAgICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXHJcbiAgICAgICAgICAgICAgY29uZmlybUJ1dHRvbkNvbG9yOiBcIiNERDZCNTVcIixcclxuICAgICAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogXCJZZXMsIHJlamVjdC5cIixcclxuICAgICAgICAgICAgICBjbG9zZU9uQ29uZmlybTogZmFsc2VcclxuICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpe1xyXG4gICAgXHJcbiAgICAgICAgICAgICAgICBVc2VyU2VydmljZVxyXG4gICAgICAgICAgICAgICAgICAuc2VuZFJlamVjdEVtYWlsc1Jlc3QoKVxyXG4gICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgIHN3ZWV0QWxlcnQoJ1lvdXIgZW1haWxzIGhhdmUgYmVlbiBzZW50LicpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9KVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgJHNjb3BlLm1hc3NSZWplY3QgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBVc2VyU2VydmljZVxyXG4gICAgICAgICAgLmdldFJlamVjdGlvbkNvdW50KClcclxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGNvdW50KSB7XHJcbiAgICAgICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgICAgIHRpdGxlOiBcIkFyZSB5b3Ugc3VyZT9cIixcclxuICAgICAgICAgICAgICB0ZXh0OiBgVGhpcyB3aWxsIHJlamVjdCAke2NvdW50fSB1c2Vycy5gLFxyXG4gICAgICAgICAgICAgIHR5cGU6IFwid2FybmluZ1wiLFxyXG4gICAgICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXHJcbiAgICAgICAgICAgICAgY29uZmlybUJ1dHRvbkNvbG9yOiBcIiNERDZCNTVcIixcclxuICAgICAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogXCJZZXMsIHJlamVjdC5cIixcclxuICAgICAgICAgICAgICBjbG9zZU9uQ29uZmlybTogZmFsc2VcclxuICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpe1xyXG4gICAgXHJcbiAgICAgICAgICAgICAgICBVc2VyU2VydmljZVxyXG4gICAgICAgICAgICAgICAgICAubWFzc1JlamVjdCgpXHJcbiAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgc3dlZXRBbGVydCgnTWFzcyBSZWplY3Rpb24gc3VjY2Vzc2Z1bC4nKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfSlcclxuICAgICAgfVxyXG5cclxuICAgICAgJHNjb3BlLm1hc3NSZWplY3RSZXN0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgVXNlclNlcnZpY2VcclxuICAgICAgICAgIC5nZXRSZXN0UmVqZWN0aW9uQ291bnQoKVxyXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oY291bnQpIHtcclxuICAgICAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICAgICAgdGl0bGU6IFwiQXJlIHlvdSBzdXJlP1wiLFxyXG4gICAgICAgICAgICAgIHRleHQ6IGBUaGlzIHdpbGwgcmVqZWN0ICR7Y291bnR9IHVzZXJzLmAsXHJcbiAgICAgICAgICAgICAgdHlwZTogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcclxuICAgICAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6IFwiI0RENkI1NVwiLFxyXG4gICAgICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiBcIlllcywgcmVqZWN0LlwiLFxyXG4gICAgICAgICAgICAgIGNsb3NlT25Db25maXJtOiBmYWxzZVxyXG4gICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCl7XHJcbiAgICBcclxuICAgICAgICAgICAgICAgIFVzZXJTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAgIC5tYXNzUmVqZWN0UmVzdCgpXHJcbiAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgc3dlZXRBbGVydCgnTWFzcyBSZWplY3Rpb24gc3VjY2Vzc2Z1bC4nKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfSlcclxuICAgICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgIH1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXHJcbiAgLmNvbnRyb2xsZXIoJ0FkbWluVXNlckN0cmwnLFtcclxuICAgICckc2NvcGUnLFxyXG4gICAgJyRodHRwJyxcclxuICAgICd1c2VyJyxcclxuICAgICdVc2VyU2VydmljZScsXHJcbiAgICBmdW5jdGlvbigkc2NvcGUsICRodHRwLCBVc2VyLCBVc2VyU2VydmljZSl7XHJcbiAgICAgICRzY29wZS5zZWxlY3RlZFVzZXIgPSBVc2VyLmRhdGE7XHJcblxyXG4gICAgICAvLyBQb3B1bGF0ZSB0aGUgc2Nob29sIGRyb3Bkb3duXHJcbiAgICAgIHBvcHVsYXRlU2Nob29scygpO1xyXG5cclxuICAgICAgZnVuY3Rpb24gcG9wdWxhdGVTY2hvb2xzKCl7XHJcblxyXG4gICAgICAgICRodHRwXHJcbiAgICAgICAgICAuZ2V0KCcvYXNzZXRzL3NjaG9vbHMuanNvbicpXHJcbiAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXMpe1xyXG4gICAgICAgICAgICB2YXIgc2Nob29scyA9IHJlcy5kYXRhO1xyXG4gICAgICAgICAgICB2YXIgZW1haWwgPSAkc2NvcGUuc2VsZWN0ZWRVc2VyLmVtYWlsLnNwbGl0KCdAJylbMV07XHJcblxyXG4gICAgICAgICAgICBpZiAoc2Nob29sc1tlbWFpbF0pe1xyXG4gICAgICAgICAgICAgICRzY29wZS5zZWxlY3RlZFVzZXIucHJvZmlsZS5zY2hvb2wgPSBzY2hvb2xzW2VtYWlsXS5zY2hvb2w7XHJcbiAgICAgICAgICAgICAgJHNjb3BlLmF1dG9GaWxsZWRTY2hvb2wgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgICAkc2NvcGUudXBkYXRlUHJvZmlsZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgVXNlclNlcnZpY2VcclxuICAgICAgICAgIC51cGRhdGVQcm9maWxlKCRzY29wZS5zZWxlY3RlZFVzZXIuX2lkLCAkc2NvcGUuc2VsZWN0ZWRVc2VyLnByb2ZpbGUpXHJcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICRzZWxlY3RlZFVzZXIgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICBzd2FsKFwiVXBkYXRlZCFcIiwgXCJQcm9maWxlIHVwZGF0ZWQuXCIsIFwic3VjY2Vzc1wiKTtcclxuICAgICAgICAgIH0sIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgc3dhbChcIk9vcHMsIHlvdSBmb3Jnb3Qgc29tZXRoaW5nLlwiKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuXHJcbiAgICAgICRzY29wZS51cGRhdGVDb25maXJtYXRpb24gPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIFVzZXJTZXJ2aWNlXHJcbiAgICAgICAgICAudXBkYXRlQ29uZmlybWF0aW9uKCRzY29wZS5zZWxlY3RlZFVzZXIuX2lkLCAkc2NvcGUuc2VsZWN0ZWRVc2VyLmNvbmZpcm1hdGlvbilcclxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgJHNlbGVjdGVkVXNlciA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgIHN3YWwoXCJVcGRhdGVkIVwiLCBcIkNvbmZpcm1hdGlvbiB1cGRhdGVkLlwiLCBcInN1Y2Nlc3NcIik7XHJcbiAgICAgICAgICB9LCByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHN3YWwoXCJPb3BzLCB5b3UgZm9yZ290IHNvbWV0aGluZy5cIik7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcblxyXG4gICAgICAkc2NvcGUudXBkYXRlQWxsVXNlciA9IGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgIFVzZXJTZXJ2aWNlXHJcbiAgICAgICAgICAudXBkYXRlQWxsKCRzY29wZS5zZWxlY3RlZFVzZXIuX2lkLCAkc2NvcGUuc2VsZWN0ZWRVc2VyKVxyXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAkc2VsZWN0ZWRVc2VyID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgc3dhbChcIlVwZGF0ZWQhXCIsIFwiQUxMIFByb2ZpbGUgdXBkYXRlZC5cIiwgXCJzdWNjZXNzXCIpO1xyXG4gICAgICAgICAgfSwgcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBzd2FsKFwiT29wcywgeW91IGZvcmdvdCBzb21ldGhpbmcuXCIpO1xyXG4gICAgICAgICAgfSk7ICBcclxuICAgICAgfTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZShcInJlZ1wiKS5jb250cm9sbGVyKFwiQWRtaW5Vc2Vyc0N0cmxcIiwgW1xyXG4gIFwiJHNjb3BlXCIsXHJcbiAgXCIkc3RhdGVcIixcclxuICBcIiRzdGF0ZVBhcmFtc1wiLFxyXG4gIFwiVXNlclNlcnZpY2VcIixcclxuICAnQXV0aFNlcnZpY2UnLFxyXG4gIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsIFVzZXJTZXJ2aWNlLCBBdXRoU2VydmljZSkge1xyXG4gICAgJHNjb3BlLnBhZ2VzID0gW107XHJcbiAgICAkc2NvcGUudXNlcnMgPSBbXTtcclxuXHJcbiAgICAvLyBTZW1hbnRpYy1VSSBtb3ZlcyBtb2RhbCBjb250ZW50IGludG8gYSBkaW1tZXIgYXQgdGhlIHRvcCBsZXZlbC5cclxuICAgIC8vIFdoaWxlIHRoaXMgaXMgdXN1YWxseSBuaWNlLCBpdCBtZWFucyB0aGF0IHdpdGggb3VyIHJvdXRpbmcgd2lsbCBnZW5lcmF0ZVxyXG4gICAgLy8gbXVsdGlwbGUgbW9kYWxzIGlmIHlvdSBjaGFuZ2Ugc3RhdGUuIEtpbGwgdGhlIHRvcCBsZXZlbCBkaW1tZXIgbm9kZSBvbiBpbml0aWFsIGxvYWRcclxuICAgIC8vIHRvIHByZXZlbnQgdGhpcy5cclxuICAgICQoXCIudWkuZGltbWVyXCIpLnJlbW92ZSgpO1xyXG4gICAgLy8gUG9wdWxhdGUgdGhlIHNpemUgb2YgdGhlIG1vZGFsIGZvciB3aGVuIGl0IGFwcGVhcnMsIHdpdGggYW4gYXJiaXRyYXJ5IHVzZXIuXHJcbiAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyID0ge307XHJcbiAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyLnNlY3Rpb25zID0gZ2VuZXJhdGVTZWN0aW9ucyh7XHJcbiAgICAgIHN0YXR1czogXCJcIixcclxuICAgICAgY29uZmlybWF0aW9uOiB7XHJcbiAgICAgICAgZGlldGFyeVJlc3RyaWN0aW9uczogW11cclxuICAgICAgfSxcclxuICAgICAgcHJvZmlsZTogXCJcIlxyXG4gICAgfSk7XHJcblxyXG4gICAgZnVuY3Rpb24gdXBkYXRlUGFnZShkYXRhKSB7XHJcbiAgICAgICRzY29wZS51c2VycyA9IGRhdGEudXNlcnM7XHJcbiAgICAgICRzY29wZS5jdXJyZW50UGFnZSA9IGRhdGEucGFnZTtcclxuICAgICAgJHNjb3BlLnBhZ2VTaXplID0gZGF0YS5zaXplO1xyXG5cclxuICAgICAgdmFyIHAgPSBbXTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLnRvdGFsUGFnZXM7IGkrKykge1xyXG4gICAgICAgIHAucHVzaChpKTtcclxuICAgICAgfVxyXG4gICAgICAkc2NvcGUucGFnZXMgPSBwO1xyXG4gICAgfVxyXG5cclxuICAgIFVzZXJTZXJ2aWNlLmdldFBhZ2UoJHN0YXRlUGFyYW1zLnBhZ2UsICRzdGF0ZVBhcmFtcy5zaXplLCAkc3RhdGVQYXJhbXMucXVlcnksICRzY29wZS5zdGF0dXNGaWx0ZXJzKVxyXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG5cclxuICAgICAgdXBkYXRlUGFnZShyZXNwb25zZS5kYXRhKTtcclxuICAgIH0pO1xyXG5cclxuICAgICRzY29wZS4kd2F0Y2goXCJxdWVyeVRleHRcIiwgZnVuY3Rpb24ocXVlcnlUZXh0KSB7XHJcbiAgICAgIFVzZXJTZXJ2aWNlLmdldFBhZ2UoJHN0YXRlUGFyYW1zLnBhZ2UsICRzdGF0ZVBhcmFtcy5zaXplLCBxdWVyeVRleHQsICRzY29wZS5zdGF0dXNGaWx0ZXJzKS50aGVuKFxyXG4gICAgICAgIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgIHVwZGF0ZVBhZ2UocmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICApO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgICRzY29wZS5hcHBseVN0YXR1c0ZpbHRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgVXNlclNlcnZpY2VcclxuICAgICAgICAuZ2V0UGFnZSgkc3RhdGVQYXJhbXMucGFnZSwgJHN0YXRlUGFyYW1zLnNpemUsICRzY29wZS5xdWVyeVRleHQsICRzY29wZS5zdGF0dXNGaWx0ZXJzLCRzY29wZS5Ob3RzdGF0dXNGaWx0ZXJzKS50aGVuKFxyXG4gICAgICAgICAgcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICB1cGRhdGVQYWdlKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgJHNjb3BlLmdvVG9QYWdlID0gZnVuY3Rpb24ocGFnZSkge1xyXG4gICAgICAkc3RhdGUuZ28oXCJhcHAuYWRtaW4udXNlcnNcIiwge1xyXG4gICAgICAgIHBhZ2U6IHBhZ2UsXHJcbiAgICAgICAgc2l6ZTogJHN0YXRlUGFyYW1zLnNpemUgfHwgMjBcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5nb1VzZXIgPSBmdW5jdGlvbigkZXZlbnQsIHVzZXIpIHtcclxuICAgICAgJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgJHN0YXRlLmdvKFwiYXBwLmFkbWluLnVzZXJcIiwge1xyXG4gICAgICAgIGlkOiB1c2VyLl9pZFxyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG5cclxuICAgICRzY29wZS5hY2NlcHRVc2VyID0gZnVuY3Rpb24oJGV2ZW50LCB1c2VyLCBpbmRleCkge1xyXG4gICAgICAkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIHN3YWwoe1xyXG4gICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgIGNhbmNlbDoge1xyXG4gICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxyXG4gICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGFjY2VwdDoge1xyXG4gICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxyXG4gICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcclxuICAgICAgICAgICAgdGV4dDogXCJZZXMsIGFjY2VwdCB0aGVtXCIsXHJcbiAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkYW5nZXJNb2RlOiB0cnVlLFxyXG4gICAgICAgIGljb246IFwid2FybmluZ1wiLFxyXG4gICAgICAgIHRleHQ6IFwiWW91IGFyZSBhYm91dCB0byBhY2NlcHQgXCIgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiIVwiLFxyXG4gICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCJcclxuICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XHJcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzd2FsKHtcclxuICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgY2FuY2VsOiB7XHJcbiAgICAgICAgICAgICAgdGV4dDogXCJDYW5jZWxcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHllczoge1xyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgdGV4dDogXCJZZXMsIGFjY2VwdCB0aGlzIHVzZXJcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBkYW5nZXJNb2RlOiB0cnVlLFxyXG4gICAgICAgICAgdGl0bGU6IFwiQXJlIHlvdSBzdXJlP1wiLFxyXG4gICAgICAgICAgdGV4dDpcclxuICAgICAgICAgICAgXCJZb3VyIGFjY291bnQgd2lsbCBiZSBsb2dnZWQgYXMgaGF2aW5nIGFjY2VwdGVkIHRoaXMgdXNlci4gXCIgK1xyXG4gICAgICAgICAgICBcIlJlbWVtYmVyLCB0aGlzIHBvd2VyIGlzIGEgcHJpdmlsZWdlLlwiLFxyXG4gICAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCJcclxuICAgICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBVc2VyU2VydmljZS5zb2Z0QWRtaXR0VXNlcih1c2VyLl9pZCkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICRzY29wZS51c2Vyc1tpbmRleF0gPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgICAgIFwiQWNjZXB0ZWRcIixcclxuICAgICAgICAgICAgICByZXNwb25zZS5kYXRhLnByb2ZpbGUubmFtZSArIFwiIGhhcyBiZWVuIGFkbWl0dGVkLlwiLFxyXG4gICAgICAgICAgICAgIFwic3VjY2Vzc1wiXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG5cclxuXHJcbiAgICAkc2NvcGUucmVqZWN0dFVzZXIgPSBmdW5jdGlvbigkZXZlbnQsIHVzZXIsIGluZGV4KSB7XHJcbiAgICAgICRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgc3dhbCh7XHJcbiAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgY2FuY2VsOiB7XHJcbiAgICAgICAgICAgIHRleHQ6IFwiQ2FuY2VsXCIsXHJcbiAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgYWNjZXB0OiB7XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXHJcbiAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlLFxyXG4gICAgICAgICAgICB0ZXh0OiBcIlllcywgcmVqZWN0IHRoZW1cIixcclxuICAgICAgICAgICAgdmFsdWU6IHRydWUsXHJcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGRhbmdlck1vZGU6IHRydWUsXHJcbiAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgdGV4dDogXCJZb3UgYXJlIGFib3V0IHRvIHJlamVjdCBcIiArIHVzZXIucHJvZmlsZS5uYW1lICsgXCIhXCIsXHJcbiAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIlxyXG4gICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzd2FsKHtcclxuICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgY2FuY2VsOiB7XHJcbiAgICAgICAgICAgICAgdGV4dDogXCJDYW5jZWxcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHllczoge1xyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgdGV4dDogXCJZZXMsIHJlamVjdCB0aGlzIHVzZXJcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBkYW5nZXJNb2RlOiB0cnVlLFxyXG4gICAgICAgICAgdGl0bGU6IFwiQXJlIHlvdSBzdXJlP1wiLFxyXG4gICAgICAgICAgdGV4dDpcclxuICAgICAgICAgICAgXCJZb3VyIGFjY291bnQgd2lsbCBiZSBsb2dnZWQgYXMgaGF2aW5nIHJlamVjdGVkIHRoaXMgdXNlci4gXCIgK1xyXG4gICAgICAgICAgICBcIlJlbWVtYmVyLCB0aGlzIHBvd2VyIGlzIGEgcHJpdmlsZWdlLlwiLFxyXG4gICAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCJcclxuICAgICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBVc2VyU2VydmljZS5zb2Z0UmVqZWN0VXNlcih1c2VyLl9pZCkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICRzY29wZS51c2Vyc1tpbmRleF0gPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgICAgIFwiUmVqZWN0ZWRcIixcclxuICAgICAgICAgICAgICByZXNwb25zZS5kYXRhLnByb2ZpbGUubmFtZSArIFwiIGhhcyBiZWVuIHJlamVjdGVkLlwiLFxyXG4gICAgICAgICAgICAgIFwic3VjY2Vzc1wiXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG5cclxuXHJcblxyXG4gICAgJHNjb3BlLnJlbW92ZVVzZXIgPSBmdW5jdGlvbigkZXZlbnQsIHVzZXIsIGluZGV4KSB7XHJcbiAgICAgICRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcblxyXG4gICAgICBzd2FsKHtcclxuICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgdGV4dDogXCJDYW5jZWxcIixcclxuICAgICAgICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBhY2NlcHQ6IHtcclxuICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcclxuICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgIHRleHQ6IFwiWWVzLCByZW1vdmUgdGhlbVwiLFxyXG4gICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGFuZ2VyTW9kZTogdHJ1ZSxcclxuICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcclxuICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gcmVtb3ZlIFwiICsgdXNlci5wcm9maWxlLm5hbWUgKyBcIiFcIixcclxuICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiXHJcbiAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeWVzOiB7XHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcclxuICAgICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcclxuICAgICAgICAgICAgICB0ZXh0OiBcIlllcywgcmVtb3ZlIHRoaXMgdXNlclwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGRhbmdlck1vZGU6IHRydWUsXHJcbiAgICAgICAgICB0aXRsZTogXCJBcmUgeW91IHN1cmU/XCIsXHJcbiAgICAgICAgICB0ZXh0OlxyXG4gICAgICAgICAgICBcIllvdXIgYWNjb3VudCB3aWxsIGJlIGxvZ2dlZCBhcyBoYXZpbmcgcmVtb3ZlZCB0aGlzIHVzZXIuIFwiICtcclxuICAgICAgICAgICAgXCJSZW1lbWJlciwgdGhpcyBwb3dlciBpcyBhIHByaXZpbGVnZS5cIixcclxuICAgICAgICAgIGljb246IFwid2FybmluZ1wiXHJcbiAgICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XHJcbiAgICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBVc2VyU2VydmljZS5yZW1vdmVVc2VyKHVzZXIuX2lkKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgJHNjb3BlLnVzZXJzW2luZGV4XSA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgICAgXCJSZW1vdmVkXCIsXHJcbiAgICAgICAgICAgICAgcmVzcG9uc2UuZGF0YS5wcm9maWxlLm5hbWUgKyBcIiBoYXMgYmVlbiByZW1vdmVkLlwiLFxyXG4gICAgICAgICAgICAgIFwic3VjY2Vzc1wiXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLnNlbmRBY2NlcHRhbmNlRW1haWxzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIGNvbnN0IGZpbHRlclNvZnRBY2NlcHRlZCA9ICRzY29wZS51c2Vycy5maWx0ZXIoXHJcbiAgICAgICAgdSA9PiB1LnN0YXR1cy5zb2Z0QWRtaXR0ZWQgJiYgIXUuc3RhdHVzLmFkbWl0dGVkXHJcbiAgICAgICk7XHJcblxyXG4gICAgICB2YXIgbWVzc2FnZSA9ICQodGhpcykuZGF0YShcImNvbmZpcm1cIik7XHJcblxyXG4gICAgICBzd2FsKHtcclxuICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxyXG4gICAgICAgIHRleHQ6IGBZb3UncmUgYWJvdXQgdG8gc2VuZCBhY2NlcHRhbmNlIGVtYWlscyAoYW5kIGFjY2VwdCkgJHtcclxuICAgICAgICAgIGZpbHRlclNvZnRBY2NlcHRlZC5sZW5ndGhcclxuICAgICAgICB9IHVzZXIocykuYCxcclxuICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcclxuICAgICAgICBidXR0b25zOiBbXCJDYW5jZWxcIiwgXCJZZXMsIGFjY2VwdCB0aGVtIGFuZCBzZW5kIHRoZSBlbWFpbHNcIl0sXHJcbiAgICAgICAgZGFuZ2VyTW9kZTogdHJ1ZVxyXG4gICAgICB9KS50aGVuKHdpbGxTZW5kID0+IHtcclxuICAgICAgICBpZiAod2lsbFNlbmQpIHtcclxuICAgICAgICAgIGlmIChmaWx0ZXJTb2Z0QWNjZXB0ZWQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGZpbHRlclNvZnRBY2NlcHRlZC5mb3JFYWNoKHVzZXIgPT4ge1xyXG4gICAgICAgICAgICAgIFVzZXJTZXJ2aWNlLmFkbWl0VXNlcih1c2VyLl9pZCk7IFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgICBcIlNlbmRpbmchXCIsXHJcbiAgICAgICAgICAgICAgYEFjY2VwdGluZyBhbmQgc2VuZGluZyBlbWFpbHMgdG8gJHtcclxuICAgICAgICAgICAgICAgIGZpbHRlclNvZnRBY2NlcHRlZC5sZW5ndGhcclxuICAgICAgICAgICAgICB9IHVzZXJzIWAsXHJcbiAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHN3YWwoXCJXaG9vcHNcIiwgXCJZb3UgY2FuJ3Qgc2VuZCBvciBhY2NlcHQgMCB1c2VycyFcIiwgXCJlcnJvclwiKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcblxyXG5cclxuICAgICRzY29wZS5zZW5kUmVqZWN0aW9uRW1haWxzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIGNvbnN0IGZpbHRlclNvZnRSZWplY3RlZCA9ICRzY29wZS51c2Vycy5maWx0ZXIoXHJcbiAgICAgICAgdSA9PiB1LnN0YXR1cy5zb2Z0UmVqZWN0ZWRcclxuICAgICAgKTtcclxuXHJcbiAgICAgIHZhciBtZXNzYWdlID0gJCh0aGlzKS5kYXRhKFwiY29uZmlybVwiKTtcclxuXHJcbiAgICAgIHN3YWwoe1xyXG4gICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXHJcbiAgICAgICAgdGV4dDogYFlvdSdyZSBhYm91dCB0byBzZW5kIHJlamVjdGlvbiBlbWFpbHMgKGFuZCByZWplY3QpICR7XHJcbiAgICAgICAgICBmaWx0ZXJTb2Z0UmVqZWN0ZWQubGVuZ3RoXHJcbiAgICAgICAgfSB1c2VyKHMpLmAsXHJcbiAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgYnV0dG9uczogW1wiQ2FuY2VsXCIsIFwiWWVzLCByZWplY3QgdGhlbSBhbmQgc2VuZCB0aGUgZW1haWxzXCJdLFxyXG4gICAgICAgIGRhbmdlck1vZGU6IHRydWVcclxuICAgICAgfSkudGhlbih3aWxsU2VuZCA9PiB7XHJcbiAgICAgICAgaWYgKHdpbGxTZW5kKSB7XHJcbiAgICAgICAgICBpZiAoZmlsdGVyU29mdFJlamVjdGVkLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBmaWx0ZXJTb2Z0UmVqZWN0ZWQuZm9yRWFjaCh1c2VyID0+IHtcclxuICAgICAgICAgICAgICBVc2VyU2VydmljZS5yZWplY3RVc2VyKHVzZXIuX2lkKTsgXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgICAgIFwiU2VuZGluZyFcIixcclxuICAgICAgICAgICAgICBgUmVqZWN0aW5nIGFuZCBzZW5kaW5nIGVtYWlscyB0byAke1xyXG4gICAgICAgICAgICAgICAgZmlsdGVyU29mdFJlamVjdGVkLmxlbmd0aFxyXG4gICAgICAgICAgICAgIH0gdXNlcnMhYCxcclxuICAgICAgICAgICAgICBcInN1Y2Nlc3NcIlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc3dhbChcIldob29wc1wiLCBcIllvdSBjYW4ndCBzZW5kIG9yIHJlamVjdCAwIHVzZXJzIVwiLCBcImVycm9yXCIpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAkc2NvcGUuZXhwb3J0VXNlcnMgPSBmdW5jdGlvbigpe1xyXG4gICAgICB2YXIgY29sdW1ucyA9IFtcIk7CsFwiLCBcIkdlbmRlclwiLCBcIkZ1bGwgTmFtZVwiLFwiU2Nob29sXCJdO1xyXG4gICAgICB2YXIgcm93cyA9IFtdO1xyXG4gICAgICBVc2VyU2VydmljZS5nZXRBbGwoKS50aGVuKHVzZXJzID0+IHtcclxuICAgICAgICB2YXIgaT0xO1xyXG4gICAgICAgIHVzZXJzLmRhdGEuZm9yRWFjaCh1c2VyID0+IHtcclxuICAgICAgICAgIHJvd3MucHVzaChbaSsrLHVzZXIucHJvZmlsZS5nZW5kZXIsdXNlci5wcm9maWxlLm5hbWUsdXNlci5wcm9maWxlLnNjaG9vbF0pXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdmFyIGRvYyA9IG5ldyBqc1BERigncCcsICdwdCcpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIHRvdGFsUGFnZXNFeHAgPSBcInt0b3RhbF9wYWdlc19jb3VudF9zdHJpbmd9XCI7XHJcblxyXG4gICAgICAgIHZhciBwYWdlQ29udGVudCA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIC8vIEhFQURFUlxyXG4gICAgICAgICAgICBkb2Muc2V0Rm9udFNpemUoMjApO1xyXG4gICAgICAgICAgICBkb2Muc2V0VGV4dENvbG9yKDQwKTtcclxuICAgICAgICAgICAgZG9jLnNldEZvbnRTdHlsZSgnbm9ybWFsJyk7XHJcbiAgICAgICAgICAgIC8vIGlmIChiYXNlNjRJbWcpIHtcclxuICAgICAgICAgICAgLy8gICAgIGRvYy5hZGRJbWFnZShiYXNlNjRJbWcsICdKUEVHJywgZGF0YS5zZXR0aW5ncy5tYXJnaW4ubGVmdCwgMTUsIDEwLCAxMCk7XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgZG9jLnRleHQoXCJQYXJ0aWNpcGFudHMgTGlzdFwiLCBkYXRhLnNldHRpbmdzLm1hcmdpbi5sZWZ0ICsgMTUsIDIyKTtcclxuICAgIFxyXG4gICAgICAgICAgICAvLyBGT09URVJcclxuICAgICAgICAgICAgdmFyIHN0ciA9IFwiUGFnZSBcIiArIGRhdGEucGFnZUNvdW50O1xyXG4gICAgICAgICAgICAvLyBUb3RhbCBwYWdlIG51bWJlciBwbHVnaW4gb25seSBhdmFpbGFibGUgaW4ganNwZGYgdjEuMCtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBkb2MucHV0VG90YWxQYWdlcyA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgc3RyID0gc3RyICsgXCIgb2YgXCIgKyB0b3RhbFBhZ2VzRXhwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRvYy5zZXRGb250U2l6ZSgxMCk7XHJcbiAgICAgICAgICAgIHZhciBwYWdlSGVpZ2h0ID0gZG9jLmludGVybmFsLnBhZ2VTaXplLmhlaWdodCB8fCBkb2MuaW50ZXJuYWwucGFnZVNpemUuZ2V0SGVpZ2h0KCk7XHJcbiAgICAgICAgICAgIGRvYy50ZXh0KHN0ciwgZGF0YS5zZXR0aW5ncy5tYXJnaW4ubGVmdCwgcGFnZUhlaWdodCAgLSAxMCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICBkb2MuYXV0b1RhYmxlKGNvbHVtbnMsIHJvd3MsIHtcclxuICAgICAgICAgICAgYWRkUGFnZUNvbnRlbnQ6IHBhZ2VDb250ZW50LFxyXG4gICAgICAgICAgICBtYXJnaW46IHt0b3A6IDMwfSxcclxuICAgICAgICAgICAgdGhlbWU6ICdncmlkJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmICh0eXBlb2YgZG9jLnB1dFRvdGFsUGFnZXMgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgIGRvYy5wdXRUb3RhbFBhZ2VzKHRvdGFsUGFnZXNFeHApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkb2Muc2F2ZSgnUGFydGljaXBhbnRzIExpc3QucGRmJyk7XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcblxyXG5cclxuICAgICRzY29wZS50b2dnbGVBZG1pbiA9IGZ1bmN0aW9uKCRldmVudCwgdXNlciwgaW5kZXgpIHtcclxuICAgICAgJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgaWYgKCF1c2VyLmFkbWluKSB7XHJcbiAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxyXG4gICAgICAgICAgdGV4dDogXCJZb3UgYXJlIGFib3V0IG1ha2UgXCIgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiIGFuIGFkbWluIVwiLFxyXG4gICAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgIGNhbmNlbDoge1xyXG4gICAgICAgICAgICAgIHRleHQ6IFwiQ2FuY2VsXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb25maXJtOiB7XHJcbiAgICAgICAgICAgICAgdGV4dDogXCJZZXMsIG1ha2UgdGhlbSBhbiBhZG1pblwiLFxyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHRydWUsXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XHJcbiAgICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBVc2VyU2VydmljZS5tYWtlQWRtaW4odXNlci5faWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAkc2NvcGUudXNlcnNbaW5kZXhdID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgc3dhbChcIk1hZGVcIiwgcmVzcG9uc2UuZGF0YS5wcm9maWxlLm5hbWUgKyBcIiBhbiBhZG1pbi5cIiwgXCJzdWNjZXNzXCIpO1xyXG4gICAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBVc2VyU2VydmljZS5yZW1vdmVBZG1pbih1c2VyLl9pZCkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAkc2NvcGUudXNlcnNbaW5kZXhdID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgIHN3YWwoXCJSZW1vdmVkXCIsIHJlc3BvbnNlLmRhdGEucHJvZmlsZS5uYW1lICsgXCIgYXMgYWRtaW5cIiwgXCJzdWNjZXNzXCIpO1xyXG4gICAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGZvcm1hdFRpbWUodGltZSkge1xyXG4gICAgICBpZiAodGltZSkge1xyXG4gICAgICAgIHJldHVybiBtb21lbnQodGltZSkuZm9ybWF0KFwiTU1NTSBEbyBZWVlZLCBoOm1tOnNzIGFcIik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAkc2NvcGUucm93Q2xhc3MgPSBmdW5jdGlvbih1c2VyKSB7XHJcbiAgICAgIGlmICh1c2VyLmFkbWluKSB7XHJcbiAgICAgICAgcmV0dXJuIFwiYWRtaW5cIjtcclxuICAgICAgfVxyXG4gICAgICBpZiAodXNlci5zdGF0dXMuY29uZmlybWVkKSB7XHJcbiAgICAgICAgcmV0dXJuIFwicG9zaXRpdmVcIjtcclxuICAgICAgfVxyXG4gICAgICBpZiAodXNlci5zdGF0dXMuYWRtaXR0ZWQgJiYgIXVzZXIuc3RhdHVzLmNvbmZpcm1lZCkge1xyXG4gICAgICAgIHJldHVybiBcIndhcm5pbmdcIjtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBzZWxlY3RVc2VyKHVzZXIpIHtcclxuICAgICAgJHNjb3BlLnNlbGVjdGVkVXNlciA9IHVzZXI7XHJcbiAgICAgICRzY29wZS5zZWxlY3RlZFVzZXIuc2VjdGlvbnMgPSBnZW5lcmF0ZVNlY3Rpb25zKHVzZXIpO1xyXG4gICAgICAkKFwiLmxvbmcudXNlci5tb2RhbFwiKS5tb2RhbChcInNob3dcIik7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVTZWN0aW9ucyh1c2VyKSB7XHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbmFtZTogXCJCYXNpYyBJbmZvXCIsXHJcbiAgICAgICAgICBmaWVsZHM6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiQ3JlYXRlZCBPblwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiBmb3JtYXRUaW1lKHVzZXIudGltZXN0YW1wKVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJMYXN0IFVwZGF0ZWRcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogZm9ybWF0VGltZSh1c2VyLmxhc3RVcGRhdGVkKVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJDb25maXJtIEJ5XCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IGZvcm1hdFRpbWUodXNlci5zdGF0dXMuY29uZmlybUJ5KSB8fCBcIk4vQVwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkNoZWNrZWQgSW5cIixcclxuICAgICAgICAgICAgICB2YWx1ZTogZm9ybWF0VGltZSh1c2VyLnN0YXR1cy5jaGVja0luVGltZSkgfHwgXCJOL0FcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJFbWFpbFwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmVtYWlsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIF1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6IFwiUHJvZmlsZVwiLFxyXG4gICAgICAgICAgZmllbGRzOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIk5hbWVcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLm5hbWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiR2VuZGVyXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5nZW5kZXJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiU2Nob29sXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5zY2hvb2xcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiR3JhZHVhdGlvbiBZZWFyXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5ncmFkdWF0aW9uWWVhclxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJIYWNrYXRob25zIHZpc2l0ZWRcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmhvd01hbnlIYWNrYXRob25zXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkRlc2NyaXB0aW9uXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5kZXNjcmlwdGlvblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJFc3NheVwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuZXNzYXlcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiTWFqb3JcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLm1ham9yXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkdpdGh1YlwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuZ2l0aHViXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkZhY2Vib29rXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5mYWNlYm9va1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJMaW5rZWRpblwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUubGlua2VkaW5cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6XCJDViBsaW5rXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5jdkxpbmtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIF1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6IFwiQ29uZmlybWF0aW9uXCIsXHJcbiAgICAgICAgICBmaWVsZHM6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiUGhvbmUgTnVtYmVyXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLnBob25lTnVtYmVyXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIk5lZWRzIEhhcmR3YXJlXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLndhbnRzSGFyZHdhcmUsXHJcbiAgICAgICAgICAgICAgdHlwZTogXCJib29sZWFuXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiSGFyZHdhcmUgUmVxdWVzdGVkXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLmhhcmR3YXJlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOlwiTmF0aW9uYWwgQ2FyZCBJRFwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5uYXRpb25hbENhcmRJRFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBuYW1lOiBcIlRyYXZlbFwiLFxyXG4gICAgICAgICAgZmllbGRzOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkFkZGl0aW9uYWwgTm90ZXNcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24ubm90ZXNcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgXVxyXG4gICAgICAgIH1cclxuICAgICAgXTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBvblN1Y2Nlc3MoKSB7XHJcbiAgICAgIHN3YWwoXCJVcGRhdGVkIVwiLCBcIk5ldyBWb2x1bnRlZXIgQWRkZWQuXCIsIFwic3VjY2Vzc1wiKTtcclxuICAgICAgJHN0YXRlLnJlbG9hZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG9uRXJyb3IoZGF0YSl7XHJcbiAgICAgIHN3YWwoXCJUcnkgYWdhaW4hXCIsIGRhdGEubWVzc2FnZSwgXCJlcnJvclwiKVxyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS5hZGRWb2x1bnRlZXIgPSBmdW5jdGlvbigpe1xyXG5cclxuICAgICAgc3dhbChcIldyaXRlIHRoZSBjaGFsbGVuZ2UgdGl0bGU6XCIsIHtcclxuICAgICAgICBidXR0b25zOiB7Y2FuY2VsOiB7dGV4dDogXCJDYW5jZWxcIix2YWx1ZTogbnVsbCx2aXNpYmxlOiB0cnVlfSwgeWVzOiB7dGV4dDogXCJJbnZpdGVcIix2YWx1ZTogdHJ1ZSx2aXNpYmxlOiB0cnVlfSB9LFxyXG4gICAgICAgIGNvbnRlbnQ6IHtlbGVtZW50OiBcImlucHV0XCIsIGF0dHJpYnV0ZXM6IHtwbGFjZWhvbGRlcjogXCJleGFtcGxlQGdtYWlsLmNvbVwiLHR5cGU6IFwidGV4dFwifSB9LFxyXG4gICAgICB9KS50aGVuKChtYWlsKSA9PiB7IGlmICghbWFpbCkge3JldHVybjt9IFxyXG4gICAgICAgIEF1dGhTZXJ2aWNlLnJlZ2lzdGVyKFxyXG4gICAgICAgICAgbWFpbCwgXCJoYWNrYXRob25cIiwgb25TdWNjZXNzLCBvbkVycm9yLCB0cnVlKVxyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG5cclxuXHJcbiAgICAkc2NvcGUuc2VsZWN0VXNlciA9IHNlbGVjdFVzZXI7XHJcbiAgfVxyXG5dKTsiLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcclxuICAuc2VydmljZSgnc2V0dGluZ3MnLCBmdW5jdGlvbigpIHt9KVxyXG4gIC5jb250cm9sbGVyKCdCYXNlQ3RybCcsIFtcclxuICAgICckc2NvcGUnLFxyXG4gICAgJ0VWRU5UX0lORk8nLFxyXG4gICAgZnVuY3Rpb24oJHNjb3BlLCBFVkVOVF9JTkZPKXtcclxuXHJcbiAgICAgICRzY29wZS5FVkVOVF9JTkZPID0gRVZFTlRfSU5GTztcclxuXHJcbiAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5jb250cm9sbGVyKCdhZG1pbkN0cmwnLCBbXHJcbiAgICAnJHNjb3BlJyxcclxuICAgICdVc2VyU2VydmljZScsXHJcbiAgICBmdW5jdGlvbigkc2NvcGUsIFVzZXJTZXJ2aWNlKXtcclxuICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xyXG4gICAgfV0pOyIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5jb250cm9sbGVyKCdBcHBsaWNhdGlvbkN0cmwnLCBbXHJcbiAgICAnJHNjb3BlJyxcclxuICAgICckcm9vdFNjb3BlJyxcclxuICAgICckc3RhdGUnLFxyXG4gICAgJyRodHRwJyxcclxuICAgICdjdXJyZW50VXNlcicsXHJcbiAgICAnc2V0dGluZ3MnLFxyXG4gICAgJ1Nlc3Npb24nLFxyXG4gICAgJ1VzZXJTZXJ2aWNlJyxcclxuICAgICdNYXJrZXRpbmdTZXJ2aWNlJyxcclxuICAgIGZ1bmN0aW9uICgkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgJGh0dHAsIGN1cnJlbnRVc2VyLCBzZXR0aW5ncywgU2Vzc2lvbiwgVXNlclNlcnZpY2UsIE1hcmtldGluZ1NlcnZpY2UpIHtcclxuXHJcbiAgICAgIC8vIFNldCB1cCB0aGUgdXNlclxyXG4gICAgICAkc2NvcGUudXNlciA9IGN1cnJlbnRVc2VyLmRhdGE7XHJcblxyXG4gICAgICAvLyBJcyB0aGUgc3R1ZGVudCBmcm9tIEhvc3RTY2hvb2w/XHJcbiAgICAgICRzY29wZS5pc0hvc3RTY2hvb2wgPSAkc2NvcGUudXNlci5lbWFpbC5zcGxpdCgnQCcpWzFdID09IHNldHRpbmdzLmRhdGEuaG9zdFNjaG9vbDtcclxuXHJcbiAgICAgIC8vIElmIHNvLCBkZWZhdWx0IHRoZW0gdG8gYWR1bHQ6IHRydWVcclxuICAgICAgaWYgKCRzY29wZS5pc0hvc3RTY2hvb2wpIHtcclxuICAgICAgICAkc2NvcGUudXNlci5wcm9maWxlLmFkdWx0ID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gUG9wdWxhdGUgdGhlIHNjaG9vbCBkcm9wZG93blxyXG4gICAgICBwb3B1bGF0ZVNjaG9vbHMoKTtcclxuICAgICAgX3NldHVwRm9ybSgpO1xyXG5cclxuICAgICAgcG9wdWxhdGVXaWxheWFzKCk7XHJcbiAgICAgIHBvcHVsYXRlQ2x1YnMoKTtcclxuXHJcbiAgICAgICRzY29wZS5yZWdJc0Nsb3NlZCA9IERhdGUubm93KCkgPiBzZXR0aW5ncy5kYXRhLnRpbWVDbG9zZTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIHBvcHVsYXRlU2Nob29scygpIHtcclxuICAgICAgICAkaHR0cFxyXG4gICAgICAgICAgLmdldCgnL2Fzc2V0cy9zY2hvb2xzLmpzb24nKVxyXG4gICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICB2YXIgc2Nob29scyA9IHJlcy5kYXRhO1xyXG4gICAgICAgICAgICB2YXIgZW1haWwgPSAkc2NvcGUudXNlci5lbWFpbC5zcGxpdCgnQCcpWzFdO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNjaG9vbHNbZW1haWxdKSB7XHJcbiAgICAgICAgICAgICAgJHNjb3BlLnVzZXIucHJvZmlsZS5zY2hvb2wgPSBzY2hvb2xzW2VtYWlsXS5zY2hvb2w7XHJcbiAgICAgICAgICAgICAgJHNjb3BlLmF1dG9GaWxsZWRTY2hvb2wgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJGh0dHBcclxuICAgICAgICAgIC5nZXQoJy9hc3NldHMvc2Nob29scy5jc3YnKVxyXG4gICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAkc2NvcGUuc2Nob29scyA9IHJlcy5kYXRhLnNwbGl0KCdcXG4nKTtcclxuICAgICAgICAgICAgJHNjb3BlLnNjaG9vbHMucHVzaCgnT3RoZXInKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gW107XHJcblxyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgJHNjb3BlLnNjaG9vbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAkc2NvcGUuc2Nob29sc1tpXSA9ICRzY29wZS5zY2hvb2xzW2ldLnRyaW0oKTtcclxuICAgICAgICAgICAgICBjb250ZW50LnB1c2goeyB0aXRsZTogJHNjb3BlLnNjaG9vbHNbaV0gfSlcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJCgnI3NjaG9vbC51aS5zZWFyY2gnKVxyXG4gICAgICAgICAgICAgIC5zZWFyY2goe1xyXG4gICAgICAgICAgICAgICAgc291cmNlOiBjb250ZW50LFxyXG4gICAgICAgICAgICAgICAgY2FjaGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBvblNlbGVjdDogZnVuY3Rpb24gKHJlc3VsdCwgcmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgJHNjb3BlLnVzZXIucHJvZmlsZS5zY2hvb2wgPSByZXN1bHQudGl0bGUudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuXHJcbiAgICAgIGZ1bmN0aW9uIHBvcHVsYXRlV2lsYXlhcygpIHtcclxuICAgICAgICAkaHR0cFxyXG4gICAgICAgICAgLmdldCgnL2Fzc2V0cy93aWxheWFzLmNzdicpXHJcbiAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICRzY29wZS53aWxheWFzID0gcmVzLmRhdGEuc3BsaXQoJ1xcbicpO1xyXG4gICAgICAgICAgICAkc2NvcGUud2lsYXlhcy5wdXNoKCdPdGhlcicpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCAkc2NvcGUud2lsYXlhcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICRzY29wZS53aWxheWFzW2ldID0gJHNjb3BlLndpbGF5YXNbaV0udHJpbSgpO1xyXG4gICAgICAgICAgICAgIGNvbnRlbnQucHVzaCh7IHRpdGxlOiAkc2NvcGUud2lsYXlhc1tpXSB9KVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkKCcjd2lsYXlhLnVpLnNlYXJjaCcpXHJcbiAgICAgICAgICAgICAgLnNlYXJjaCh7XHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6IGNvbnRlbnQsXHJcbiAgICAgICAgICAgICAgICBjYWNoZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG9uU2VsZWN0OiBmdW5jdGlvbiAocmVzdWx0LCByZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAkc2NvcGUudXNlci5wcm9maWxlLndpbGF5YSA9IHJlc3VsdC50aXRsZS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG5cclxuICAgICAgZnVuY3Rpb24gcG9wdWxhdGVDbHVicygpIHtcclxuICAgICAgICAkaHR0cFxyXG4gICAgICAgICAgLmdldCgnL2Fzc2V0cy9jbHVicy5jc3YnKVxyXG4gICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAkc2NvcGUuY2x1YnMgPSByZXMuZGF0YS5zcGxpdCgnXFxuJyk7XHJcbiAgICAgICAgICAgICRzY29wZS5jbHVicy5wdXNoKCdPdGhlcicpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCAkc2NvcGUuY2x1YnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAkc2NvcGUuY2x1YnNbaV0gPSAkc2NvcGUuY2x1YnNbaV0udHJpbSgpO1xyXG4gICAgICAgICAgICAgIGNvbnRlbnQucHVzaCh7IHRpdGxlOiAkc2NvcGUuY2x1YnNbaV0gfSlcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJCgnI2NsdWIudWkuc2VhcmNoJylcclxuICAgICAgICAgICAgICAuc2VhcmNoKHtcclxuICAgICAgICAgICAgICAgIHNvdXJjZTogY29udGVudCxcclxuICAgICAgICAgICAgICAgIGNhY2hlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgb25TZWxlY3Q6IGZ1bmN0aW9uIChyZXN1bHQsIHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICRzY29wZS5jbHViID0gcmVzdWx0LnRpdGxlLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKCRzY29wZS51c2VyLnByb2ZpbGUuc291cmNlICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgJHNjb3BlLlVzZXJTb3VyY2UgPSAkc2NvcGUudXNlci5wcm9maWxlLnNvdXJjZS5zcGxpdCgnIycpWzBdO1xyXG4gICAgICAgICAgJHNjb3BlLmNsdWIgPSAkc2NvcGUudXNlci5wcm9maWxlLnNvdXJjZS5zcGxpdCgnIycpWzFdO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuXHJcbiAgICAgIGZ1bmN0aW9uIHJlbW92ZUR1cGxpY2F0ZXMobXlBcnIsIHByb3ApIHtcclxuICAgICAgICByZXR1cm4gbXlBcnIuZmlsdGVyKChvYmosIHBvcywgYXJyKSA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gYXJyLm1hcChtYXBPYmogPT4gbWFwT2JqW3Byb3BdKS5pbmRleE9mKG9ialtwcm9wXSkgPT09IHBvcztcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gc2VuZE1hcmtldGluZ0VtYWlscygpIHtcclxuICAgICAgICBNYXJrZXRpbmdTZXJ2aWNlLmdldEFsbCgpLnRoZW4odGVhbXMgPT4ge1xyXG4gICAgICAgICAgdmFyIGVtYWlscyA9IFtdO1xyXG4gICAgICAgICAgdGVhbXMuZGF0YS5mb3JFYWNoKHRlYW0gPT4ge1xyXG4gICAgICAgICAgICB2YXIgaXNUZWFtbWF0ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0ZWFtLm1lbWJlcnMuZm9yRWFjaChtZW1iZXIgPT4ge1xyXG4gICAgICAgICAgICAgIGlmIChtZW1iZXIgPT0gY3VycmVudFVzZXIuZGF0YS5lbWFpbCkge1xyXG4gICAgICAgICAgICAgICAgaXNUZWFtbWF0ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaWYgKGlzVGVhbW1hdGUpIHtcclxuICAgICAgICAgICAgICB0ZWFtLm1lbWJlcnMuZm9yRWFjaChtZW1iZXIgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCEobWVtYmVyID09IGN1cnJlbnRVc2VyLmRhdGEuZW1haWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgIGVtYWlscy5wdXNoKHsgZW1haWw6IG1lbWJlciwgZXZlbnQ6IHRlYW0uZXZlbnQgfSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICByZW1vdmVEdXBsaWNhdGVzKGVtYWlscywgJ2VtYWlsJykuZm9yRWFjaCh0ZWFtbWF0ZSA9PiB7XHJcbiAgICAgICAgICAgIE1hcmtldGluZ1NlcnZpY2Uuc2VuZEZyaWVuZEludml0ZShjdXJyZW50VXNlci5kYXRhLnByb2ZpbGUubmFtZSwgdGVhbW1hdGUpXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcblxyXG5cclxuICAgICAgZnVuY3Rpb24gX3VwZGF0ZVVzZXIoZSkge1xyXG5cclxuICAgICAgICAvL0NoZWNrIGlmIFVzZXIncyBmaXJzdCBzdWJtaXNzaW9uXHJcbiAgICAgICAgdmFyIHNlbmRNYWlsID0gdHJ1ZTtcclxuICAgICAgICBpZiAoY3VycmVudFVzZXIuZGF0YS5zdGF0dXMuY29tcGxldGVkUHJvZmlsZSkgeyBzZW5kTWFpbCA9IGZhbHNlIH1cclxuXHJcbiAgICAgICAgLy8gR2V0IHVzZXIgU291cmNlXHJcbiAgICAgICAgaWYgKCRzY29wZS5Vc2VyU291cmNlICE9ICcyJykgeyAkc2NvcGUudXNlci5wcm9maWxlLnNvdXJjZSA9ICRzY29wZS5Vc2VyU291cmNlIH1cclxuICAgICAgICBlbHNlIHsgJHNjb3BlLnVzZXIucHJvZmlsZS5zb3VyY2UgPSAkc2NvcGUuVXNlclNvdXJjZSArIFwiI1wiICsgJHNjb3BlLmNsdWIgfVxyXG5cclxuICAgICAgICBVc2VyU2VydmljZVxyXG4gICAgICAgICAgLnVwZGF0ZVByb2ZpbGUoU2Vzc2lvbi5nZXRVc2VySWQoKSwgJHNjb3BlLnVzZXIucHJvZmlsZSlcclxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgc3dhbChcIkF3ZXNvbWUhXCIsIFwiWW91ciBhcHBsaWNhdGlvbiBoYXMgYmVlbiBzYXZlZC5cIiwgXCJzdWNjZXNzXCIpLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgICAgICAgIGlmIChzZW5kTWFpbCkgeyBzZW5kTWFya2V0aW5nRW1haWxzKCk7IH1cclxuICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAuZGFzaGJvYXJkXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0sIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgc3dhbChcIlVoIG9oIVwiLCBcIlNvbWV0aGluZyB3ZW50IHdyb25nLlwiLCBcImVycm9yXCIpO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBpc01pbm9yKCkge1xyXG4gICAgICAgIHJldHVybiAhJHNjb3BlLnVzZXIucHJvZmlsZS5hZHVsdDtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gbWlub3JzQXJlQWxsb3dlZCgpIHtcclxuICAgICAgICByZXR1cm4gc2V0dGluZ3MuZGF0YS5hbGxvd01pbm9ycztcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gbWlub3JzVmFsaWRhdGlvbigpIHtcclxuICAgICAgICAvLyBBcmUgbWlub3JzIGFsbG93ZWQgdG8gcmVnaXN0ZXI/XHJcbiAgICAgICAgaWYgKGlzTWlub3IoKSAmJiAhbWlub3JzQXJlQWxsb3dlZCgpKSB7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBfc2V0dXBGb3JtKCkge1xyXG4gICAgICAgIC8vIEN1c3RvbSBtaW5vcnMgdmFsaWRhdGlvbiBydWxlXHJcbiAgICAgICAgJC5mbi5mb3JtLnNldHRpbmdzLnJ1bGVzLmFsbG93TWlub3JzID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICByZXR1cm4gbWlub3JzVmFsaWRhdGlvbigpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIFNlbWFudGljLVVJIGZvcm0gdmFsaWQgYXRpb25cclxuICAgICAgICAkKCcudWkuZm9ybScpLmZvcm0oe1xyXG4gICAgICAgICAgb246ICdibHVyJyxcclxuICAgICAgICAgIGlubGluZTogdHJ1ZSxcclxuICAgICAgICAgIGZpZWxkczoge1xyXG4gICAgICAgICAgICBuYW1lOiB7XHJcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ25hbWUnLFxyXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXHJcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSBlbnRlciB5b3VyIG5hbWUuJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2Nob29sOiB7XHJcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ3NjaG9vbCcsXHJcbiAgICAgICAgICAgICAgcnVsZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcclxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIGVudGVyIHlvdXIgc2Nob29sIG5hbWUuJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgV2lsYXlhOiB7XHJcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ1dpbGF5YScsXHJcbiAgICAgICAgICAgICAgcnVsZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcclxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIGVudGVyIHlvdXIgd2lsYXlhIG5hbWUuJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeWVhcjoge1xyXG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICd5ZWFyJyxcclxuICAgICAgICAgICAgICBydWxlczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxyXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2Ugc2VsZWN0IHlvdXIgZ3JhZHVhdGlvbiB5ZWFyLidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdlbmRlcjoge1xyXG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdnZW5kZXInLFxyXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXHJcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSBzZWxlY3QgYSBnZW5kZXIuICdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGhvd01hbnlIYWNrYXRob25zOiB7XHJcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ2hvd01hbnlIYWNrYXRob25zJyxcclxuICAgICAgICAgICAgICBydWxlczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxyXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2Ugc2VsZWN0IGhvdyBtYW55IGhhY2thdGhvbnMgeW91IGhhdmUgYXR0ZW5kZWQuJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYWR1bHQ6IHtcclxuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnYWR1bHQnLFxyXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdhbGxvd01pbm9ycycsXHJcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1lvdSBtdXN0IGJlIGFuIGFkdWx0LCBvciBhbiBFU0kgc3R1ZGVudC4nXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdHVkeToge1xyXG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdzdHVkeScsXHJcbiAgICAgICAgICAgICAgcnVsZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcclxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIGVudGVyIHlvdXIgbWFqb3IgLidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB7XHJcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ2Rlc2NyaXB0aW9uJyxcclxuICAgICAgICAgICAgICBydWxlczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxyXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2UgZGVzY3JpYmUgeW91cnNlbGYgLidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVzc2F5OiB7XHJcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ2Vzc2F5JyxcclxuICAgICAgICAgICAgICBydWxlczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxyXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2UgdGVsbCB1cyBhYm91dCB5b3VyIG1vdGl2YXRpb24gLidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGxpbmtlZGluOiB7XHJcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ2xpbmtlZGluJyxcclxuICAgICAgICAgICAgICBydWxlczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAndXJsJyxcclxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgTGlua2VkaW4gVVJMIC4nXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmYWNlYm9vazoge1xyXG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdmYWNlYm9vaycsXHJcbiAgICAgICAgICAgICAgcnVsZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ3VybCcsXHJcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSBlbnRlciBhIHZhbGlkIEZhY2Vib29rIFVSTCAuJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2l0aHViOiB7XHJcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ2dpdGh1YicsXHJcbiAgICAgICAgICAgICAgcnVsZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ3VybCcsXHJcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSBlbnRlciBhIHZhbGlkIEdpdEh1YiBVUkwgLidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFVzZXJTb3VyY2U6IHtcclxuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnVXNlclNvdXJjZScsXHJcbiAgICAgICAgICAgICAgcnVsZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcclxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnSG93IGRpZCB5b3UgaGVhciBhYm91dCB1cyA/J1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY3ZMaW5rOiB7XHJcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ2N2TGluaycsXHJcbiAgICAgICAgICAgICAgcnVsZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ3VybCcsXHJcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1lvdSBtdXN0IGFkZCBhIGxpbmsgdG8geW91ciBDVi4nXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICRzY29wZS5zdWJtaXRGb3JtID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICgkKCcudWkuZm9ybScpLmZvcm0oJ2lzIHZhbGlkJykpIHtcclxuICAgICAgICAgIC8vICQoJy51aS5zdWJtaXQuYnV0dG9uJykuY2xpY2soKTtcclxuICAgICAgICAgIF91cGRhdGVVc2VyKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHN3YWwoXCJVaCBvaCFcIiwgXCJQbGVhc2UgRmlsbCBUaGUgUmVxdWlyZWQgRmllbGRzXCIsIFwiZXJyb3JcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG4gICAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcclxuICAuY29udHJvbGxlcignQ2hhbGxlbmdlc0N0cmwnLCBbXHJcbiAgICAnJHNjb3BlJyxcclxuICAgICckcm9vdFNjb3BlJyxcclxuICAgICckc3RhdGUnLFxyXG4gICAgJyRodHRwJyxcclxuICAgICdjdXJyZW50VXNlcicsXHJcbiAgICAnU2Vzc2lvbicsXHJcbiAgICAnQ2hhbGxlbmdlU2VydmljZScsXHJcbiAgICAnVXNlclNlcnZpY2UnLFxyXG4gICAgJ1NvbHZlZENURlNlcnZpY2UnLFxyXG4gICAgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsICRodHRwLCBjdXJyZW50VXNlciwgU2Vzc2lvbiwgQ2hhbGxlbmdlU2VydmljZSwgVXNlclNlcnZpY2UsIFNvbHZlZENURlNlcnZpY2UpIHtcclxuXHJcbiAgICAgIFxyXG4gICAgICBTb2x2ZWRDVEZTZXJ2aWNlLmdldEFsbCgpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgIHNvbHZlZENoYWxsZW5nZXM9IHJlc3BvbnNlLmRhdGEuZmlsdGVyKHMgPT4gcy51c2VyPT1jdXJyZW50VXNlci5kYXRhLl9pZClcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBcclxuXHJcbiAgICAgIENoYWxsZW5nZVNlcnZpY2UuZ2V0QWxsKCkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgJHNjb3BlLmNoYWxsZW5nZXMgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICB9KTtcclxuXHJcblxyXG5cclxuICAgICAgZnVuY3Rpb24gb25TdWNjZXNzKGNoYWxsZW5nZSkge1xyXG4gICAgICAgIHN3YWwoXCJBd2Vzb21lIVwiLCBcIlRoYXQncyBjb3JyZWN0LCBhbmQgeW91IGp1c3QgZWFybmVkICtcIisgY2hhbGxlbmdlLnBvaW50cyArXCIgcG9pbnRzLlwiLCBcInN1Y2Nlc3NcIilcclxuICAgICAgICAkc3RhdGUucmVsb2FkKClcclxuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIG9uRXJyb3IoZGF0YSl7XHJcbiAgICAgICAgc3dhbChcIlRyeSBhZ2FpbiFcIiwgZGF0YS5tZXNzYWdlLCBcImVycm9yXCIpIFxyXG4gICAgICB9XHJcblxyXG5cclxuICAgICAgJHNjb3BlLnNvbHZlQ2hhbGxlbmdlID0gZnVuY3Rpb24oY2hhbGxlbmdlLGFuc3dlciwgaXNlbnRlcikge1xyXG4gICAgICAgIGlmIChpc2VudGVyKXtcclxuICAgICAgICAgIFNvbHZlZENURlNlcnZpY2Uuc29sdmUoY2hhbGxlbmdlLGN1cnJlbnRVc2VyLGFuc3dlcixvblN1Y2Nlc3Msb25FcnJvcik7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICBTb2x2ZWRDVEZTZXJ2aWNlLnNvbHZlKGNoYWxsZW5nZSxjdXJyZW50VXNlcixhbnN3ZXIsb25TdWNjZXNzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIFxyXG4gICAgICAkc2NvcGUuc2hvd0NoYWxsZW5nZSA9IGZ1bmN0aW9uKGNoYWxsZW5nZSkge1xyXG5cclxuICAgICAgICBDaGFsbGVuZ2VTZXJ2aWNlLmdldChjaGFsbGVuZ2UuX2lkKS50aGVuKHJlc3BvbnNlID0+IHtcclxuXHJcbiAgICAgICAgICBzd2FsKHJlc3BvbnNlLmRhdGEudGl0bGUsIHJlc3BvbnNlLmRhdGEuZGVzY3JpcHRpb24pXHJcblxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgICAgIFNvbHZlZENURlNlcnZpY2UuZ2V0QWxsKCkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgYWxsQ2hhbGxlbmdlcz0gcmVzcG9uc2UuZGF0YVxyXG4gICAgICAgIHZhciBSZXN1bHQgPVtdXHJcblxyXG4gICAgICAgIGFsbENoYWxsZW5nZXMuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgIHVzZXJDaGFsbGVuZ2VzID0gYWxsQ2hhbGxlbmdlcy5maWx0ZXIocyA9PiBzLnVzZXI9PWVsZW1lbnQudXNlcilcclxuICAgICAgICAgIHZhciBwb2ludHNDb3VudCA9IDA7XHJcblxyXG4gICAgICAgICAgdXNlckNoYWxsZW5nZXMuZm9yRWFjaChjaGFsbGVuZ2UgPT4geyBwb2ludHNDb3VudCs9Y2hhbGxlbmdlLnBvaW50cyB9KTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgVXNlclNlcnZpY2UuZ2V0KGVsZW1lbnQudXNlcikudGhlbih1c2VyID0+e1xyXG5cclxuICAgICAgICAgICAgdmFyIGdyYWRlPVtdXHJcbiAgICAgICAgICAgIGdyYWRlWzIwMTldID0gXCIzQ1NcIlxyXG4gICAgICAgICAgICBncmFkZVsyMDIwXSA9IFwiMkNTXCJcclxuICAgICAgICAgICAgZ3JhZGVbMjAyMV0gPSBcIjFDU1wiXHJcbiAgICAgICAgICAgIGdyYWRlWzIwMjJdID0gXCIyQ1BcIlxyXG4gICAgICAgICAgICBncmFkZVsyMDIzXSA9IFwiMUNQXCJcclxuXHJcbiAgICAgICAgICAgIGlmIChwb2ludHNDb3VudD4wKSB7UmVzdWx0LnB1c2goeyBpZDp1c2VyLmRhdGEuX2lkLCBuYW1lOiB1c2VyLmRhdGEucHJvZmlsZS5uYW1lLCBncmFkZTogZ3JhZGVbdXNlci5kYXRhLnByb2ZpbGUuZ3JhZHVhdGlvblllYXJdICxwb2ludHM6IHBvaW50c0NvdW50fSl9XHJcblxyXG4gICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICBhbGxDaGFsbGVuZ2VzID0gYWxsQ2hhbGxlbmdlcy5maWx0ZXIocyA9PiBzLnVzZXIhPT1lbGVtZW50LnVzZXIpXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICRzY29wZS5SZXN1bHQgPSBSZXN1bHQ7XHJcbiAgICAgIH0pO1xyXG4gICAgXHJcblxyXG4gICAgICAkc2NvcGUucm93Q2xhc3MgPSBmdW5jdGlvbih1c2VyKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHVzZXIuaWQ9PWN1cnJlbnRVc2VyLmRhdGEuX2lkKSB7XHJcbiAgICAgICAgICByZXR1cm4gXCJhZG1pblwiO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuICBcclxuICAgICAgXHJcblxyXG4gICAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcclxuLmNvbnRyb2xsZXIoJ0NoZWNraW5DdHJsJywgW1xyXG4gICckc2NvcGUnLFxyXG4gICckc3RhdGUnLFxyXG4gICckc3RhdGVQYXJhbXMnLFxyXG4gICdVc2VyU2VydmljZScsXHJcbiAgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgVXNlclNlcnZpY2Upe1xyXG4gICAgJCgnI3JlYWRlcicpLmh0bWw1X3FyY29kZShmdW5jdGlvbih1c2VySUQpe1xyXG4gICAgICAgICAgLy9DaGFuZ2UgdGhlIGlucHV0IGZpZWxkcyB2YWx1ZSBhbmQgc2VuZCBwb3N0IHJlcXVlc3QgdG8gdGhlIGJhY2tlbmRcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgVXNlclNlcnZpY2UuZ2V0KHVzZXJJRCkudGhlbihyZXNwb25zZSA9PiB7XHJcblxyXG4gICAgICAgICAgICB1c2VyID1yZXNwb25zZS5kYXRhO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF1c2VyLnN0YXR1cy5jaGVja2VkSW4pIHtcclxuICAgICAgICAgICAgICBzd2FsKHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gY2hlY2sgaW4gXCIgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiIVwiLFxyXG4gICAgICAgICAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgICAgICAgIGNhbmNlbDoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IFwiQ2FuY2VsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBjaGVja0luOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcclxuICAgICAgICAgICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIlllcywgY2hlY2sgdGhlbSBpblwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgIFxyXG4gICAgICAgICAgICAgICAgVXNlclNlcnZpY2UuY2hlY2tJbih1c2VyLl9pZCkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICRzY29wZS5xdWVyeVRleHQgPSB1c2VyLmVtYWlsO1xyXG4gICAgICAgICAgICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgICAgICAgICAgIFwiQ2hlY2tlZCBpblwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHVzZXIucHJvZmlsZS5uYW1lICsgXCIgaGFzIGJlZW4gY2hlY2tlZCBpbi5cIixcclxuICAgICAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIlxyXG4gICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgICAgIFwiQWxyZWFkeSBjaGVja2VkSW5cIixcclxuICAgICAgICAgICAgICAgIHVzZXIucHJvZmlsZS5uYW1lICsgXCIgaGFzIGJlZW4gY2hlY2tlZC1pbiBhdDogXCIrIGZvcm1hdFRpbWUodXNlci5zdGF0dXMuY2hlY2tJblRpbWUpLFxyXG4gICAgICAgICAgICAgICAgXCJ3YXJuaW5nXCJcclxuICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0sXHJcbiAgICAgIGZ1bmN0aW9uKGVycm9yKXtcclxuICAgICAgfSwgZnVuY3Rpb24odmlkZW9FcnJvcil7XHJcbiAgICAgICAgLy90aGUgdmlkZW8gc3RyZWFtIGNvdWxkIGJlIG9wZW5lZFxyXG4gICAgICB9XHJcbiAgICApO1xyXG4gICAgJHNjb3BlLnBhZ2VzID0gW107XHJcbiAgICAkc2NvcGUudXNlcnMgPSBbXTtcclxuICAgICRzY29wZS5zb3J0QnkgPSAndGltZXN0YW1wJ1xyXG4gICAgJHNjb3BlLnNvcnREaXIgPSBmYWxzZVxyXG5cclxuICAgICRzY29wZS5maWx0ZXIgPSBkZXNlcmlhbGl6ZUZpbHRlcnMoJHN0YXRlUGFyYW1zLmZpbHRlcik7XHJcbiAgICAkc2NvcGUuZmlsdGVyLnRleHQgPSAkc3RhdGVQYXJhbXMucXVlcnkgfHwgXCJcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBkZXNlcmlhbGl6ZUZpbHRlcnModGV4dCkge1xyXG4gICAgICB2YXIgb3V0ID0ge307XHJcbiAgICAgIGlmICghdGV4dCkgcmV0dXJuIG91dDtcclxuICAgICAgdGV4dC5zcGxpdChcIixcIikuZm9yRWFjaChmdW5jdGlvbihmKXtvdXRbZl09dHJ1ZX0pO1xyXG4gICAgICByZXR1cm4gKHRleHQubGVuZ3RoPT09MCk/e306b3V0O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNlcmlhbGl6ZUZpbHRlcnMoZmlsdGVycykge1xyXG4gICAgICB2YXIgb3V0ID0gXCJcIjtcclxuICAgICAgZm9yICh2YXIgdiBpbiBmaWx0ZXJzKSB7aWYodHlwZW9mKGZpbHRlcnNbdl0pPT09XCJib29sZWFuXCImJmZpbHRlcnNbdl0pIG91dCArPSB2K1wiLFwiO31cclxuICAgICAgcmV0dXJuIChvdXQubGVuZ3RoPT09MCk/XCJcIjpvdXQuc3Vic3RyKDAsb3V0Lmxlbmd0aC0xKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBTZW1hbnRpYy1VSSBtb3ZlcyBtb2RhbCBjb250ZW50IGludG8gYSBkaW1tZXIgYXQgdGhlIHRvcCBsZXZlbC5cclxuICAgIC8vIFdoaWxlIHRoaXMgaXMgdXN1YWxseSBuaWNlLCBpdCBtZWFucyB0aGF0IHdpdGggb3VyIHJvdXRpbmcgd2lsbCBnZW5lcmF0ZVxyXG4gICAgLy8gbXVsdGlwbGUgbW9kYWxzIGlmIHlvdSBjaGFuZ2Ugc3RhdGUuIEtpbGwgdGhlIHRvcCBsZXZlbCBkaW1tZXIgbm9kZSBvbiBpbml0aWFsIGxvYWRcclxuICAgIC8vIHRvIHByZXZlbnQgdGhpcy5cclxuICAgICQoJy51aS5kaW1tZXInKS5yZW1vdmUoKTtcclxuICAgIC8vIFBvcHVsYXRlIHRoZSBzaXplIG9mIHRoZSBtb2RhbCBmb3Igd2hlbiBpdCBhcHBlYXJzLCB3aXRoIGFuIGFyYml0cmFyeSB1c2VyLlxyXG4gICAgJHNjb3BlLnNlbGVjdGVkVXNlciA9IHt9O1xyXG4gICAgJHNjb3BlLnNlbGVjdGVkVXNlci5zZWN0aW9ucyA9IGdlbmVyYXRlU2VjdGlvbnMoe1xyXG4gICAgICBzdGF0dXM6IFwiXCIsXHJcbiAgICAgIGNvbmZpcm1hdGlvbjoge1xyXG4gICAgICAgIGRpZXRhcnlSZXN0cmljdGlvbnM6IFtdXHJcbiAgICAgIH0sXHJcbiAgICAgIHByb2ZpbGU6IFwiXCJcclxuICAgIH0pO1xyXG5cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZVBhZ2UoZGF0YSkge1xyXG4gICAgICAkc2NvcGUudXNlcnMgPSBkYXRhLnVzZXJzO1xyXG4gICAgICAkc2NvcGUuY3VycmVudFBhZ2UgPSBkYXRhLnBhZ2U7XHJcbiAgICAgICRzY29wZS5wYWdlU2l6ZSA9IGRhdGEuc2l6ZTtcclxuXHJcbiAgICAgIHZhciBwID0gW107XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS50b3RhbFBhZ2VzOyBpKyspIHtcclxuICAgICAgICBwLnB1c2goaSk7XHJcbiAgICAgIH1cclxuICAgICAgJHNjb3BlLnBhZ2VzID0gcDtcclxuICAgIH1cclxuXHJcbiAgICBVc2VyU2VydmljZS5nZXRQYWdlKCRzdGF0ZVBhcmFtcy5wYWdlLCAkc3RhdGVQYXJhbXMuc2l6ZSwgJHN0YXRlUGFyYW1zLnF1ZXJ5LCAkc2NvcGUuc3RhdHVzRmlsdGVycylcclxuICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuXHJcbiAgICAgIHVwZGF0ZVBhZ2UocmVzcG9uc2UuZGF0YSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkc2NvcGUuJHdhdGNoKFwicXVlcnlUZXh0XCIsIGZ1bmN0aW9uKHF1ZXJ5VGV4dCkge1xyXG4gICAgICBVc2VyU2VydmljZS5nZXRQYWdlKCRzdGF0ZVBhcmFtcy5wYWdlLCAkc3RhdGVQYXJhbXMuc2l6ZSwgcXVlcnlUZXh0LCAkc2NvcGUuc3RhdHVzRmlsdGVycykudGhlbihcclxuICAgICAgICByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICB1cGRhdGVQYWdlKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAkc2NvcGUuYXBwbHlTdGF0dXNGaWx0ZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIFVzZXJTZXJ2aWNlXHJcbiAgICAgICAgLmdldFBhZ2UoJHN0YXRlUGFyYW1zLnBhZ2UsICRzdGF0ZVBhcmFtcy5zaXplLCAkc2NvcGUucXVlcnlUZXh0LCAkc2NvcGUuc3RhdHVzRmlsdGVycykudGhlbihcclxuICAgICAgICAgIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgdXBkYXRlUGFnZShyZXNwb25zZS5kYXRhKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG5cclxuICAgICRzY29wZS5nb1RvUGFnZSA9IGZ1bmN0aW9uKHBhZ2UpIHtcclxuICAgICAgJHN0YXRlLmdvKFwiYXBwLmFkbWluLnVzZXJzXCIsIHtcclxuICAgICAgICBwYWdlOiBwYWdlLFxyXG4gICAgICAgIHNpemU6ICRzdGF0ZVBhcmFtcy5zaXplIHx8IDIwXHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuY2hlY2tJbiA9IGZ1bmN0aW9uKCRldmVudCwgdXNlciwgaW5kZXgpIHtcclxuICAgICAgJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgaWYgKCF1c2VyLnN0YXR1cy5jaGVja2VkSW4pIHtcclxuICAgICAgICBzd2FsKHtcclxuICAgICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXHJcbiAgICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gY2hlY2sgaW4gXCIgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiIVwiLFxyXG4gICAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgIGNhbmNlbDoge1xyXG4gICAgICAgICAgICAgIHRleHQ6IFwiQ2FuY2VsXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjaGVja0luOiB7XHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcclxuICAgICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcclxuICAgICAgICAgICAgICB0ZXh0OiBcIlllcywgY2hlY2sgdGhlbSBpblwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgVXNlclNlcnZpY2UuY2hlY2tJbih1c2VyLl9pZCkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICRzY29wZS51c2Vyc1tpbmRleF0gPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgICAgIFwiQ2hlY2tlZCBpblwiLFxyXG4gICAgICAgICAgICAgIHJlc3BvbnNlLmRhdGEucHJvZmlsZS5uYW1lICsgXCIgaGFzIGJlZW4gY2hlY2tlZCBpbi5cIixcclxuICAgICAgICAgICAgICBcInN1Y2Nlc3NcIlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgXCJBbHJlYWR5IGNoZWNrZWRJblwiLFxyXG4gICAgICAgICAgdXNlci5wcm9maWxlLm5hbWUgKyBcIiBoYXMgYmVlbiBjaGVja2VkLWluIGF0OiBcIisgZm9ybWF0VGltZSh1c2VyLnN0YXR1cy5jaGVja0luVGltZSksXHJcbiAgICAgICAgICBcIndhcm5pbmdcIlxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gZm9ybWF0VGltZSh0aW1lKSB7XHJcbiAgICAgIGlmICh0aW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIG1vbWVudCh0aW1lKS5mb3JtYXQoXCJNTU1NIERvIFlZWVksIGg6bW06c3MgYVwiKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS5yb3dDbGFzcyA9IGZ1bmN0aW9uKHVzZXIpIHtcclxuICAgICAgaWYgKHVzZXIuYWRtaW4pIHtcclxuICAgICAgICByZXR1cm4gXCJhZG1pblwiO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh1c2VyLnN0YXR1cy5jb25maXJtZWQpIHtcclxuICAgICAgICByZXR1cm4gXCJwb3NpdGl2ZVwiO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh1c2VyLnN0YXR1cy5hZG1pdHRlZCAmJiAhdXNlci5zdGF0dXMuY29uZmlybWVkKSB7XHJcbiAgICAgICAgcmV0dXJuIFwid2FybmluZ1wiO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIHNlbGVjdFVzZXIodXNlcikge1xyXG4gICAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyID0gdXNlcjtcclxuICAgICAgJHNjb3BlLnNlbGVjdGVkVXNlci5zZWN0aW9ucyA9IGdlbmVyYXRlU2VjdGlvbnModXNlcik7XHJcbiAgICAgICQoXCIubG9uZy51c2VyLm1vZGFsXCIpLm1vZGFsKFwic2hvd1wiKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZW5lcmF0ZVNlY3Rpb25zKHVzZXIpIHtcclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBuYW1lOiBcIkJhc2ljIEluZm9cIixcclxuICAgICAgICAgIGZpZWxkczogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJDcmVhdGVkIE9uXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IGZvcm1hdFRpbWUodXNlci50aW1lc3RhbXApXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkxhc3QgVXBkYXRlZFwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiBmb3JtYXRUaW1lKHVzZXIubGFzdFVwZGF0ZWQpXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkNvbmZpcm0gQnlcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogZm9ybWF0VGltZSh1c2VyLnN0YXR1cy5jb25maXJtQnkpIHx8IFwiTi9BXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiQ2hlY2tlZCBJblwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiBmb3JtYXRUaW1lKHVzZXIuc3RhdHVzLmNoZWNrSW5UaW1lKSB8fCBcIk4vQVwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkVtYWlsXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuZW1haWxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbmFtZTogXCJQcm9maWxlXCIsXHJcbiAgICAgICAgICBmaWVsZHM6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiTmFtZVwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUubmFtZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJHZW5kZXJcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmdlbmRlclxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJTY2hvb2xcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLnNjaG9vbFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJHcmFkdWF0aW9uIFllYXJcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmdyYWR1YXRpb25ZZWFyXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkhhY2thdGhvbnMgdmlzaXRlZFwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuaG93TWFueUhhY2thdGhvbnNcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiRGVzY3JpcHRpb25cIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmRlc2NyaXB0aW9uXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkVzc2F5XCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5lc3NheVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJNYWpvclwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUubWFqb3JcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiR2l0aHViXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5naXRodWJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiRmFjZWJvb2tcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmZhY2Vib29rXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkxpbmtlZGluXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5saW5rZWRpblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBuYW1lOiBcIkNvbmZpcm1hdGlvblwiLFxyXG4gICAgICAgICAgZmllbGRzOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIlBob25lIE51bWJlclwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5waG9uZU51bWJlclxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJOZWVkcyBIYXJkd2FyZVwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi53YW50c0hhcmR3YXJlLFxyXG4gICAgICAgICAgICAgIHR5cGU6IFwiYm9vbGVhblwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkhhcmR3YXJlIFJlcXVlc3RlZFwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5oYXJkd2FyZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBuYW1lOiBcIlRyYXZlbFwiLFxyXG4gICAgICAgICAgZmllbGRzOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkFkZGl0aW9uYWwgTm90ZXNcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24ubm90ZXNcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgXVxyXG4gICAgICAgIH1cclxuICAgICAgXTtcclxuICAgIH1cclxuICAgICRzY29wZS5zZWxlY3RVc2VyID0gc2VsZWN0VXNlcjtcclxuICB9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXHJcbiAgLmNvbnRyb2xsZXIoJ0NvbmZpcm1hdGlvbkN0cmwnLCBbXHJcbiAgICAnJHNjb3BlJyxcclxuICAgICckcm9vdFNjb3BlJyxcclxuICAgICckc3RhdGUnLFxyXG4gICAgJ2N1cnJlbnRVc2VyJyxcclxuICAgICdVdGlscycsXHJcbiAgICAnVXNlclNlcnZpY2UnLFxyXG4gICAgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsIGN1cnJlbnRVc2VyLCBVdGlscywgVXNlclNlcnZpY2Upe1xyXG5cclxuICAgICAgLy8gU2V0IHVwIHRoZSB1c2VyXHJcbiAgICAgIHZhciB1c2VyID0gY3VycmVudFVzZXIuZGF0YTtcclxuICAgICAgJHNjb3BlLnVzZXIgPSB1c2VyO1xyXG5cclxuICAgICAgJHNjb3BlLnBhc3RDb25maXJtYXRpb24gPSBEYXRlLm5vdygpID4gdXNlci5zdGF0dXMuY29uZmlybUJ5O1xyXG5cclxuICAgICAgJHNjb3BlLmZvcm1hdFRpbWUgPSBVdGlscy5mb3JtYXRUaW1lO1xyXG5cclxuICAgICAgX3NldHVwRm9ybSgpO1xyXG5cclxuICAgICAgJHNjb3BlLmZpbGVOYW1lID0gdXNlci5faWQgKyBcIl9cIiArIHVzZXIucHJvZmlsZS5uYW1lLnNwbGl0KFwiIFwiKS5qb2luKFwiX1wiKTtcclxuXHJcbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgLy8gQWxsIHRoaXMganVzdCBmb3IgZGlldGFyeSByZXN0cmljdGlvbiBjaGVja2JveGVzIGZtbFxyXG5cclxuICAgICAgdmFyIGRpZXRhcnlSZXN0cmljdGlvbnMgPSB7XHJcbiAgICAgICAgJ1ZlZ2V0YXJpYW4nOiBmYWxzZSxcclxuICAgICAgICAnVmVnYW4nOiBmYWxzZSxcclxuICAgICAgICAnSGFsYWwnOiBmYWxzZSxcclxuICAgICAgICAnS29zaGVyJzogZmFsc2UsXHJcbiAgICAgICAgJ051dCBBbGxlcmd5JzogZmFsc2VcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGlmICh1c2VyLmNvbmZpcm1hdGlvbi5kaWV0YXJ5UmVzdHJpY3Rpb25zKXtcclxuICAgICAgICB1c2VyLmNvbmZpcm1hdGlvbi5kaWV0YXJ5UmVzdHJpY3Rpb25zLmZvckVhY2goZnVuY3Rpb24ocmVzdHJpY3Rpb24pe1xyXG4gICAgICAgICAgaWYgKHJlc3RyaWN0aW9uIGluIGRpZXRhcnlSZXN0cmljdGlvbnMpe1xyXG4gICAgICAgICAgICBkaWV0YXJ5UmVzdHJpY3Rpb25zW3Jlc3RyaWN0aW9uXSA9IHRydWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICRzY29wZS5kaWV0YXJ5UmVzdHJpY3Rpb25zID0gZGlldGFyeVJlc3RyaWN0aW9ucztcclxuXHJcbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIF91cGRhdGVVc2VyKGUpe1xyXG4gICAgICAgIHZhciBjb25maXJtYXRpb24gPSAkc2NvcGUudXNlci5jb25maXJtYXRpb247XHJcbiAgICAgICAgLy8gR2V0IHRoZSBkaWV0YXJ5IHJlc3RyaWN0aW9ucyBhcyBhbiBhcnJheVxyXG4gICAgICAgIHZhciBkcnMgPSBbXTtcclxuICAgICAgICBPYmplY3Qua2V5cygkc2NvcGUuZGlldGFyeVJlc3RyaWN0aW9ucykuZm9yRWFjaChmdW5jdGlvbihrZXkpe1xyXG4gICAgICAgICAgaWYgKCRzY29wZS5kaWV0YXJ5UmVzdHJpY3Rpb25zW2tleV0pe1xyXG4gICAgICAgICAgICBkcnMucHVzaChrZXkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbmZpcm1hdGlvbi5kaWV0YXJ5UmVzdHJpY3Rpb25zID0gZHJzO1xyXG5cclxuICAgICAgICBVc2VyU2VydmljZVxyXG4gICAgICAgICAgLnVwZGF0ZUNvbmZpcm1hdGlvbih1c2VyLl9pZCwgY29uZmlybWF0aW9uKVxyXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBzd2FsKFwiV29vIVwiLCBcIllvdSdyZSBjb25maXJtZWQhXCIsIFwic3VjY2Vzc1wiKS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAuZGFzaGJvYXJkXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0sIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgc3dhbChcIlVoIG9oIVwiLCBcIlNvbWV0aGluZyB3ZW50IHdyb25nLlwiLCBcImVycm9yXCIpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIF9zZXR1cEZvcm0oKXtcclxuICAgICAgICAvLyBTZW1hbnRpYy1VSSBmb3JtIHZhbGlkYXRpb25cclxuICAgICAgICAkKCcudWkuZm9ybScpLmZvcm0oe1xyXG4gICAgICAgICAgZmllbGRzOiB7XHJcbiAgICAgICAgICAgIHNoaXJ0OiB7XHJcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ3NoaXJ0JyxcclxuICAgICAgICAgICAgICBydWxlczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxyXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2UgZ2l2ZSB1cyBhIHNoaXJ0IHNpemUhJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcGhvbmU6IHtcclxuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAncGhvbmUnLFxyXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXHJcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSBlbnRlciBhIHBob25lIG51bWJlci4nXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzaWduYXR1cmVDb2RlT2ZDb25kdWN0OiB7XHJcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ3NpZ25hdHVyZUNvZGVPZkNvbmR1Y3QnLFxyXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXHJcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSB0eXBlIHlvdXIgZGlnaXRhbCBzaWduYXR1cmUuJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbmF0aW9uYWxDYXJkSUQ6IHtcclxuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnbmF0aW9uYWxDYXJkSUQnLFxyXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXHJcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSB0eXBlIHlvdXIgTmF0aW9uYWwgQ2FyZCBJRC4nXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkc2NvcGUuc3VibWl0Rm9ybSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgaWYgKCQoJy51aS5mb3JtJykuZm9ybSgnaXMgdmFsaWQnKSl7XHJcbiAgICAgICAgICBfdXBkYXRlVXNlcigpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzd2FsKFwiVWggb2ghXCIsIFwiUGxlYXNlIEZpbGwgVGhlIFJlcXVpcmVkIEZpZWxkc1wiLCBcImVycm9yXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuXHJcbiAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5jb250cm9sbGVyKCdEYXNoYm9hcmRDdHJsJywgW1xyXG4gICAgJyRyb290U2NvcGUnLFxyXG4gICAgJyRzY29wZScsXHJcbiAgICAnJHNjZScsXHJcbiAgICAnY3VycmVudFVzZXInLFxyXG4gICAgJ3NldHRpbmdzJyxcclxuICAgICdVdGlscycsXHJcbiAgICAnQXV0aFNlcnZpY2UnLFxyXG4gICAgJ1VzZXJTZXJ2aWNlJyxcclxuICAgICdFVkVOVF9JTkZPJyxcclxuICAgICdEQVNIQk9BUkQnLFxyXG4gICAgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHNjb3BlLCAkc2NlLCBjdXJyZW50VXNlciwgc2V0dGluZ3MsIFV0aWxzLCBBdXRoU2VydmljZSwgVXNlclNlcnZpY2UsIEVWRU5UX0lORk8sIERBU0hCT0FSRCl7XHJcbiAgICAgIHZhciBTZXR0aW5ncyA9IHNldHRpbmdzLmRhdGE7XHJcbiAgICAgIHZhciB1c2VyID0gY3VycmVudFVzZXIuZGF0YTtcclxuICAgICAgJHNjb3BlLnVzZXIgPSB1c2VyO1xyXG4gICAgICAkc2NvcGUudGltZUNsb3NlID0gVXRpbHMuZm9ybWF0VGltZShTZXR0aW5ncy50aW1lQ2xvc2UpO1xyXG4gICAgICAkc2NvcGUudGltZUNvbmZpcm0gPSBVdGlscy5mb3JtYXRUaW1lKFNldHRpbmdzLnRpbWVDb25maXJtKTtcclxuXHJcbiAgICAgICRzY29wZS5EQVNIQk9BUkQgPSBEQVNIQk9BUkQ7XHJcblxyXG4gICAgICBmb3IgKHZhciBtc2cgaW4gJHNjb3BlLkRBU0hCT0FSRCkge1xyXG4gICAgICAgIGlmICgkc2NvcGUuREFTSEJPQVJEW21zZ10uaW5jbHVkZXMoJ1tBUFBfREVBRExJTkVdJykpIHtcclxuICAgICAgICAgICRzY29wZS5EQVNIQk9BUkRbbXNnXSA9ICRzY29wZS5EQVNIQk9BUkRbbXNnXS5yZXBsYWNlKCdbQVBQX0RFQURMSU5FXScsIFV0aWxzLmZvcm1hdFRpbWUoU2V0dGluZ3MudGltZUNsb3NlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgkc2NvcGUuREFTSEJPQVJEW21zZ10uaW5jbHVkZXMoJ1tDT05GSVJNX0RFQURMSU5FXScpKSB7XHJcbiAgICAgICAgICAkc2NvcGUuREFTSEJPQVJEW21zZ10gPSAkc2NvcGUuREFTSEJPQVJEW21zZ10ucmVwbGFjZSgnW0NPTkZJUk1fREVBRExJTkVdJywgVXRpbHMuZm9ybWF0VGltZSh1c2VyLnN0YXR1cy5jb25maXJtQnkpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIElzIHJlZ2lzdHJhdGlvbiBvcGVuP1xyXG4gICAgICB2YXIgcmVnSXNPcGVuID0gJHNjb3BlLnJlZ0lzT3BlbiA9IFV0aWxzLmlzUmVnT3BlbihTZXR0aW5ncyk7XHJcblxyXG4gICAgICAvLyBJcyBpdCBwYXN0IHRoZSB1c2VyJ3MgY29uZmlybWF0aW9uIHRpbWU/XHJcbiAgICAgIHZhciBwYXN0Q29uZmlybWF0aW9uID0gJHNjb3BlLnBhc3RDb25maXJtYXRpb24gPSBVdGlscy5pc0FmdGVyKHVzZXIuc3RhdHVzLmNvbmZpcm1CeSk7XHJcblxyXG4gICAgICAkc2NvcGUuZGFzaFN0YXRlID0gZnVuY3Rpb24oc3RhdHVzKXtcclxuICAgICAgICB2YXIgdXNlciA9ICRzY29wZS51c2VyO1xyXG4gICAgICAgIHN3aXRjaCAoc3RhdHVzKSB7XHJcbiAgICAgICAgICBjYXNlICd1bnZlcmlmaWVkJzpcclxuICAgICAgICAgICAgcmV0dXJuICF1c2VyLnZlcmlmaWVkO1xyXG4gICAgICAgICAgY2FzZSAnb3BlbkFuZEluY29tcGxldGUnOlxyXG4gICAgICAgICAgICByZXR1cm4gcmVnSXNPcGVuICYmIHVzZXIudmVyaWZpZWQgJiYgIXVzZXIuc3RhdHVzLmNvbXBsZXRlZFByb2ZpbGU7XHJcbiAgICAgICAgICBjYXNlICdvcGVuQW5kU3VibWl0dGVkJzpcclxuICAgICAgICAgICAgcmV0dXJuIHJlZ0lzT3BlbiAmJiB1c2VyLnN0YXR1cy5jb21wbGV0ZWRQcm9maWxlICYmICF1c2VyLnN0YXR1cy5hZG1pdHRlZDtcclxuICAgICAgICAgIGNhc2UgJ2Nsb3NlZEFuZEluY29tcGxldGUnOlxyXG4gICAgICAgICAgICByZXR1cm4gIXJlZ0lzT3BlbiAmJiAhdXNlci5zdGF0dXMuY29tcGxldGVkUHJvZmlsZSAmJiAhdXNlci5zdGF0dXMuYWRtaXR0ZWQ7XHJcbiAgICAgICAgICBjYXNlICdjbG9zZWRBbmRTdWJtaXR0ZWQnOiAvLyBXYWl0bGlzdGVkIFN0YXRlXHJcbiAgICAgICAgICAgIHJldHVybiAhcmVnSXNPcGVuICYmIHVzZXIuc3RhdHVzLmNvbXBsZXRlZFByb2ZpbGUgJiYgIXVzZXIuc3RhdHVzLmFkbWl0dGVkO1xyXG4gICAgICAgICAgY2FzZSAnYWRtaXR0ZWRBbmRDYW5Db25maXJtJzpcclxuICAgICAgICAgICAgcmV0dXJuICFwYXN0Q29uZmlybWF0aW9uICYmXHJcbiAgICAgICAgICAgICAgdXNlci5zdGF0dXMuYWRtaXR0ZWQgJiZcclxuICAgICAgICAgICAgICAhdXNlci5zdGF0dXMuY29uZmlybWVkICYmXHJcbiAgICAgICAgICAgICAgIXVzZXIuc3RhdHVzLmRlY2xpbmVkO1xyXG4gICAgICAgICAgY2FzZSAnYWRtaXR0ZWRBbmRDYW5ub3RDb25maXJtJzpcclxuICAgICAgICAgICAgcmV0dXJuIHBhc3RDb25maXJtYXRpb24gJiZcclxuICAgICAgICAgICAgICB1c2VyLnN0YXR1cy5hZG1pdHRlZCAmJlxyXG4gICAgICAgICAgICAgICF1c2VyLnN0YXR1cy5jb25maXJtZWQgJiZcclxuICAgICAgICAgICAgICAhdXNlci5zdGF0dXMuZGVjbGluZWQ7XHJcbiAgICAgICAgICBjYXNlICdjb25maXJtZWQnOlxyXG4gICAgICAgICAgICByZXR1cm4gdXNlci5zdGF0dXMuYWRtaXR0ZWQgJiYgdXNlci5zdGF0dXMuY29uZmlybWVkICYmICF1c2VyLnN0YXR1cy5kZWNsaW5lZDtcclxuICAgICAgICAgIGNhc2UgJ2RlY2xpbmVkJzpcclxuICAgICAgICAgICAgcmV0dXJuIHVzZXIuc3RhdHVzLmRlY2xpbmVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkc2NvcGUuc2hvd1dhaXRsaXN0ID0gIXJlZ0lzT3BlbiAmJiB1c2VyLnN0YXR1cy5jb21wbGV0ZWRQcm9maWxlICYmICF1c2VyLnN0YXR1cy5hZG1pdHRlZDtcclxuXHJcbiAgICAgICRzY29wZS5yZXNlbmRFbWFpbCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgQXV0aFNlcnZpY2VcclxuICAgICAgICAgIC5yZXNlbmRWZXJpZmljYXRpb25FbWFpbCgpXHJcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHN3YWwoXCJDaGVjayB5b3VyIEluYm94IVwiLCBcIllvdXIgZW1haWwgaGFzIGJlZW4gc2VudC5cIiwgXCJzdWNjZXNzXCIpOyBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vICRzY29wZS5wcmludENvbmZpcm1hdGlvbiA9ZnVuY3Rpb24oSW1hZ2VVUkwpe1xyXG5cclxuICAgICAgLy8gICBodG1sMmNhbnZhcygkKCcjcXJDb2RlJyksIHtcclxuICAgICAgLy8gICAgIGFsbG93VGFpbnQ6IHRydWUsXHJcbiAgICAgIC8vICAgICBvbnJlbmRlcmVkOiBmdW5jdGlvbiAoY2FudmFzKSB7XHJcbiAgICAgIC8vICAgICAgICAgdmFyIGltZ0RhdGEgPSBjYW52YXMudG9EYXRhVVJMKFwiaW1hZ2UvanBlZ1wiLCAxLjApO1xyXG4gICAgICAvLyAgICAgICAgIHZhciBwZGYgPSBuZXcganNQREYoJ3AnLCAnbW0nLCAnYTAnKTtcclxuICBcclxuICAgICAgLy8gICAgICAgICBwZGYuYWRkSW1hZ2UoaW1nRGF0YSwgJ0pQRUcnLCAwLCAwKTtcclxuICAgICAgLy8gICAgICAgICBwZGYuc2F2ZShcIkN1cnJlbnQgRGF0YTIucGRmXCIpXHJcbiAgICAgIC8vICAgICB9XHJcbiAgICAgIC8vIH0pO1xyXG4gICAgICBcclxuICAgICAgLy8gfVxyXG5cclxuXHJcbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgIC8vIFRleHQhXHJcbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgIHZhciBjb252ZXJ0ZXIgPSBuZXcgc2hvd2Rvd24uQ29udmVydGVyKCk7XHJcbiAgICAgICRzY29wZS5hY2NlcHRhbmNlVGV4dCA9ICRzY2UudHJ1c3RBc0h0bWwoY29udmVydGVyLm1ha2VIdG1sKFNldHRpbmdzLmFjY2VwdGFuY2VUZXh0KSk7XHJcbiAgICAgICRzY29wZS5jb25maXJtYXRpb25UZXh0ID0gJHNjZS50cnVzdEFzSHRtbChjb252ZXJ0ZXIubWFrZUh0bWwoU2V0dGluZ3MuY29uZmlybWF0aW9uVGV4dCkpO1xyXG4gICAgICAkc2NvcGUud2FpdGxpc3RUZXh0ID0gJHNjZS50cnVzdEFzSHRtbChjb252ZXJ0ZXIubWFrZUh0bWwoU2V0dGluZ3Mud2FpdGxpc3RUZXh0KSk7XHJcblxyXG4gICAgICAkc2NvcGUuZGVjbGluZUFkbWlzc2lvbiA9IGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICBzd2FsKHtcclxuICAgICAgICB0aXRsZTogXCJXaG9hIVwiLFxyXG4gICAgICAgIHRleHQ6IFwiQXJlIHlvdSBzdXJlIHlvdSB3b3VsZCBsaWtlIHRvIGRlY2xpbmUgeW91ciBhZG1pc3Npb24/IFxcblxcbiBZb3UgY2FuJ3QgZ28gYmFjayFcIixcclxuICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcclxuICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgdGV4dDogXCJDYW5jZWxcIixcclxuICAgICAgICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBjb25maXJtOiB7XHJcbiAgICAgICAgICAgIHRleHQ6IFwiWWVzLCBJIGNhbid0IG1ha2UgaXRcIixcclxuICAgICAgICAgICAgdmFsdWU6IHRydWUsXHJcbiAgICAgICAgICAgIHZpc2libGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCJcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFVzZXJTZXJ2aWNlXHJcbiAgICAgICAgICAuZGVjbGluZUFkbWlzc2lvbih1c2VyLl9pZClcclxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgICRzY29wZS51c2VyID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH07XHJcbiAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcclxuICAuY29udHJvbGxlcignSG9tZUN0cmwnLCBbXHJcbiAgICAnJHJvb3RTY29wZScsXHJcbiAgICAnJHNjb3BlJyxcclxuICAgICckaHR0cCcsXHJcbiAgICAnJHN0YXRlJyxcclxuICAgICdzZXR0aW5ncycsXHJcbiAgICAnVXRpbHMnLFxyXG4gICAgJ0F1dGhTZXJ2aWNlJyxcclxuICAgICdFVkVOVF9JTkZPJyxcclxuICAgIGZ1bmN0aW9uKCRyb290U2NvcGUsICRzY29wZSwgJGh0dHAsICRzdGF0ZSwgc2V0dGluZ3MsIFV0aWxzLCBBdXRoU2VydmljZSwgRVZFTlRfSU5GTyl7XHJcbiAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAgICRzY29wZS5FVkVOVF9JTkZPID0gRVZFTlRfSU5GTztcclxuXHJcbiAgICAgIHZhciBTZXR0aW5ncyA9IHNldHRpbmdzLmRhdGE7XHJcbiAgICAgICRzY29wZS5yZWdJc09wZW4gPSBVdGlscy5pc1JlZ09wZW4oU2V0dGluZ3MpO1xyXG5cclxuXHJcbiAgICAgIC8vIElzIHJlZ2lzdHJhdGlvbiBvcGVuP1xyXG4gICAgICB2YXIgU2V0dGluZ3MgPSBzZXR0aW5ncy5kYXRhO1xyXG4gICAgICAkc2NvcGUucmVnSXNPcGVuID0gVXRpbHMuaXNSZWdPcGVuKFNldHRpbmdzKTtcclxuXHJcbiAgICAgIC8vIFN0YXJ0IHN0YXRlIGZvciBsb2dpblxyXG4gICAgICAkc2NvcGUubG9naW5TdGF0ZSA9ICdsb2dpbic7XHJcblxyXG4gICAgICBmdW5jdGlvbiBvblN1Y2Nlc3MoKSB7XHJcbiAgICAgICAgJHN0YXRlLmdvKCdhcHAuZGFzaGJvYXJkJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIG9uRXJyb3IoZGF0YSl7XHJcbiAgICAgICAgJHNjb3BlLmVycm9yID0gZGF0YS5tZXNzYWdlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiByZXNldEVycm9yKCl7XHJcbiAgICAgICAgJHNjb3BlLmVycm9yID0gbnVsbDtcclxuICAgICAgfVxyXG5cclxuICAgICAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24oKXtcclxuICAgICAgICByZXNldEVycm9yKCk7XHJcbiAgICAgICAgQXV0aFNlcnZpY2UubG9naW5XaXRoUGFzc3dvcmQoXHJcbiAgICAgICAgICAkc2NvcGUuZW1haWwsICRzY29wZS5wYXNzd29yZCwgb25TdWNjZXNzLCBvbkVycm9yKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgICRzY29wZS5yZWdpc3RlciA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgcmVzZXRFcnJvcigpO1xyXG4gICAgICAgIEF1dGhTZXJ2aWNlLnJlZ2lzdGVyKFxyXG4gICAgICAgICAgJHNjb3BlLmVtYWlsLCAkc2NvcGUucGFzc3dvcmQsIG9uU3VjY2Vzcywgb25FcnJvcik7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkc2NvcGUuc2V0TG9naW5TdGF0ZSA9IGZ1bmN0aW9uKHN0YXRlKSB7XHJcbiAgICAgICAgJHNjb3BlLmxvZ2luU3RhdGUgPSBzdGF0ZTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgICRzY29wZS5zZW5kUmVzZXRFbWFpbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBlbWFpbCA9ICRzY29wZS5lbWFpbDtcclxuICAgICAgICBBdXRoU2VydmljZS5zZW5kUmVzZXRFbWFpbChlbWFpbCk7XHJcbiAgICAgICAgc3dhbChcIkRvbid0IHN3ZWF0IVwiLCBcIkFuIGVtYWlsIHNob3VsZCBiZSBzZW50IHRvIHlvdSBzaG9ydGx5LlwiLCBcInN1Y2Nlc3NcIik7XHJcbiAgICAgIH07XHJcblxyXG5cclxuXHJcblxyXG4gICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xyXG5cclxuICAgIH1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXHJcbiAgLmNvbnRyb2xsZXIoJ0xvZ2luQ3RybCcsIFtcclxuICAgICckc2NvcGUnLFxyXG4gICAgJyRodHRwJyxcclxuICAgICckc3RhdGUnLFxyXG4gICAgJ3NldHRpbmdzJyxcclxuICAgICdVdGlscycsXHJcbiAgICAnQXV0aFNlcnZpY2UnLFxyXG4gICAgJ0VWRU5UX0lORk8nLFxyXG4gICAgZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCwgJHN0YXRlLCBzZXR0aW5ncywgVXRpbHMsIEF1dGhTZXJ2aWNlLCBFVkVOVF9JTkZPKXtcclxuXHJcbiAgICAgICRzY29wZS5FVkVOVF9JTkZPID0gRVZFTlRfSU5GTztcclxuXHJcbiAgICAgIC8vIElzIHJlZ2lzdHJhdGlvbiBvcGVuP1xyXG4gICAgICB2YXIgU2V0dGluZ3MgPSBzZXR0aW5ncy5kYXRhO1xyXG4gICAgICAkc2NvcGUucmVnSXNPcGVuID0gVXRpbHMuaXNSZWdPcGVuKFNldHRpbmdzKTtcclxuXHJcbiAgICAgIC8vIFN0YXJ0IHN0YXRlIGZvciBsb2dpblxyXG4gICAgICAkc2NvcGUubG9naW5TdGF0ZSA9ICdsb2dpbic7XHJcblxyXG4gICAgICBmdW5jdGlvbiBvblN1Y2Nlc3MoKSB7XHJcbiAgICAgICAgJHN0YXRlLmdvKCdhcHAuZGFzaGJvYXJkJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIG9uRXJyb3IoZGF0YSl7XHJcbiAgICAgICAgJHNjb3BlLmVycm9yID0gZGF0YS5tZXNzYWdlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiByZXNldEVycm9yKCl7XHJcbiAgICAgICAgJHNjb3BlLmVycm9yID0gbnVsbDtcclxuICAgICAgfVxyXG5cclxuICAgICAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24oKXtcclxuICAgICAgICByZXNldEVycm9yKCk7XHJcbiAgICAgICAgQXV0aFNlcnZpY2UubG9naW5XaXRoUGFzc3dvcmQoXHJcbiAgICAgICAgICAkc2NvcGUuZW1haWwsICRzY29wZS5wYXNzd29yZCwgb25TdWNjZXNzLCBvbkVycm9yKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgICRzY29wZS5yZWdpc3RlciA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgcmVzZXRFcnJvcigpO1xyXG4gICAgICAgIEF1dGhTZXJ2aWNlLnJlZ2lzdGVyKFxyXG4gICAgICAgICAgJHNjb3BlLmVtYWlsLCAkc2NvcGUucGFzc3dvcmQsIG9uU3VjY2Vzcywgb25FcnJvcik7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkc2NvcGUuc2V0TG9naW5TdGF0ZSA9IGZ1bmN0aW9uKHN0YXRlKSB7XHJcbiAgICAgICAgJHNjb3BlLmxvZ2luU3RhdGUgPSBzdGF0ZTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgICRzY29wZS5zZW5kUmVzZXRFbWFpbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBlbWFpbCA9ICRzY29wZS5lbWFpbDtcclxuICAgICAgICBBdXRoU2VydmljZS5zZW5kUmVzZXRFbWFpbChlbWFpbCk7XHJcbiAgICAgICAgc3dhbChcIkRvbid0IHN3ZWF0IVwiLCBcIkFuIGVtYWlsIHNob3VsZCBiZSBzZW50IHRvIHlvdSBzaG9ydGx5LlwiLCBcInN1Y2Nlc3NcIik7XHJcbiAgICAgIH07XHJcblxyXG4gICAgfVxyXG4gIF0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcclxuICAuY29udHJvbGxlcignUmVzZXRDdHJsJywgW1xyXG4gICAgJyRzY29wZScsXHJcbiAgICAnJHN0YXRlUGFyYW1zJyxcclxuICAgICckc3RhdGUnLFxyXG4gICAgJ0F1dGhTZXJ2aWNlJyxcclxuICAgIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlUGFyYW1zLCAkc3RhdGUsIEF1dGhTZXJ2aWNlKXtcclxuICAgICAgdmFyIHRva2VuID0gJHN0YXRlUGFyYW1zLnRva2VuO1xyXG5cclxuICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgJHNjb3BlLmNoYW5nZVBhc3N3b3JkID0gZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgcGFzc3dvcmQgPSAkc2NvcGUucGFzc3dvcmQ7XHJcbiAgICAgICAgdmFyIGNvbmZpcm0gPSAkc2NvcGUuY29uZmlybTtcclxuXHJcbiAgICAgICAgaWYgKHBhc3N3b3JkICE9PSBjb25maXJtKXtcclxuICAgICAgICAgICRzY29wZS5lcnJvciA9IFwiUGFzc3dvcmRzIGRvbid0IG1hdGNoIVwiO1xyXG4gICAgICAgICAgJHNjb3BlLmNvbmZpcm0gPSBcIlwiO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgQXV0aFNlcnZpY2UucmVzZXRQYXNzd29yZChcclxuICAgICAgICAgIHRva2VuLFxyXG4gICAgICAgICAgJHNjb3BlLnBhc3N3b3JkLFxyXG4gICAgICAgICAgbWVzc2FnZSA9PiB7XHJcbiAgICAgICAgICAgIHN3YWwoXCJOZWF0byFcIiwgXCJZb3VyIHBhc3N3b3JkIGhhcyBiZWVuIGNoYW5nZWQhXCIsIFwic3VjY2Vzc1wiKS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJob21lXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBkYXRhID0+IHtcclxuICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gZGF0YS5tZXNzYWdlO1xyXG4gICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG4gICAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcclxuICAuc2VydmljZSgnc2V0dGluZ3MnLCBmdW5jdGlvbigpIHt9KVxyXG4gIC5jb250cm9sbGVyKCdTaWRlYmFyQ3RybCcsIFtcclxuICAgICckcm9vdFNjb3BlJyxcclxuICAgICckc2NvcGUnLFxyXG4gICAgJ1NldHRpbmdzU2VydmljZScsXHJcbiAgICAnVXRpbHMnLFxyXG4gICAgJ0F1dGhTZXJ2aWNlJyxcclxuICAgICdTZXNzaW9uJyxcclxuICAgICdFVkVOVF9JTkZPJyxcclxuICAgIGZ1bmN0aW9uKCRyb290U2NvcGUsICRzY29wZSwgU2V0dGluZ3NTZXJ2aWNlLCBVdGlscywgQXV0aFNlcnZpY2UsIFNlc3Npb24sIEVWRU5UX0lORk8pe1xyXG5cclxuICAgICAgdmFyIHVzZXIgPSAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyO1xyXG5cclxuICAgICAgJHNjb3BlLkVWRU5UX0lORk8gPSBFVkVOVF9JTkZPO1xyXG5cclxuICAgICAgJHNjb3BlLnBhc3RDb25maXJtYXRpb24gPSBVdGlscy5pc0FmdGVyKHVzZXIuc3RhdHVzLmNvbmZpcm1CeSk7XHJcbiAgICAgIC8vJHNjb3BlLnBhc3RTYXRhcnQgPSBVdGlscy5pc0FmdGVyKHNldHRpbmdzLnRpbWVTdGFydCk7XHJcblxyXG4gICAgICBTZXR0aW5nc1NlcnZpY2VcclxuICAgICAgLmdldFB1YmxpY1NldHRpbmdzKClcclxuICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICRzY29wZS5wYXN0U2F0YXJ0ID0gVXRpbHMuaXNBZnRlcihyZXNwb25zZS5kYXRhLnRpbWVTdGFydClcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAkc2NvcGUubG9nb3V0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBBdXRoU2VydmljZS5sb2dvdXQoKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgICRzY29wZS5zaG93U2lkZWJhciA9IGZhbHNlO1xyXG4gICAgICAkc2NvcGUudG9nZ2xlU2lkZWJhciA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgJHNjb3BlLnNob3dTaWRlYmFyID0gISRzY29wZS5zaG93U2lkZWJhcjtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vIG9oIGdvZCBqUXVlcnkgaGFja1xyXG4gICAgICAkKCcuaXRlbScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgJHNjb3BlLnNob3dTaWRlYmFyID0gZmFsc2U7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIH1dKTtcclxuIiwiXHJcblxyXG5hbmd1bGFyLm1vZHVsZSgncmVnJylcclxuICAuY29udHJvbGxlcignVGVhbUN0cmwnLCBbXHJcbiAgICAnJHNjb3BlJyxcclxuICAgICckc3RhdGUnLFxyXG4gICAgJyR0aW1lb3V0JyxcclxuICAgICdjdXJyZW50VXNlcicsXHJcbiAgICAnc2V0dGluZ3MnLFxyXG4gICAgJ1V0aWxzJyxcclxuICAgICdVc2VyU2VydmljZScsXHJcbiAgICAnVGVhbVNlcnZpY2UnLFxyXG4gICAgJ1RFQU0nLFxyXG4gICAgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCAkdGltZW91dCwgY3VycmVudFVzZXIsIHNldHRpbmdzLCBVdGlscywgVXNlclNlcnZpY2UsIFRlYW1TZXJ2aWNlLCBURUFNKSB7XHJcbiAgICAgIC8vIEdldCB0aGUgY3VycmVudCB1c2VyJ3MgbW9zdCByZWNlbnQgZGF0YS5cclxuICAgICAgdmFyIFNldHRpbmdzID0gc2V0dGluZ3MuZGF0YTtcclxuXHJcbiAgICAgICRzY29wZS5yZWdJc09wZW4gPSBVdGlscy5pc1JlZ09wZW4oU2V0dGluZ3MpO1xyXG5cclxuICAgICAgJHNjb3BlLnVzZXIgPSBjdXJyZW50VXNlci5kYXRhO1xyXG5cclxuICAgICAgZnVuY3Rpb24gaXNUZWFtTWVtYmVyKHRlYW1zLCBVc2VyaWQpIHtcclxuICAgICAgICB2YXIgdGVzdCA9IGZhbHNlO1xyXG4gICAgICAgIHRlYW1zLmZvckVhY2godGVhbSA9PiB7XHJcbiAgICAgICAgICB0ZWFtLm1lbWJlcnMuZm9yRWFjaChtZW1iZXIgPT4ge1xyXG4gICAgICAgICAgICBpZiAobWVtYmVyLmlkID09IFVzZXJpZCkgdGVzdCA9IHRydWU7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGVzdDtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gc2VsZWN0TWVtYmVyKG1lbWJlcklkKSB7XHJcbiAgICAgICAgVXNlclNlcnZpY2UuZ2V0KG1lbWJlcklkKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgIHVzZXIgPSByZXNwb25zZS5kYXRhXHJcbiAgICAgICAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyID0gdXNlcjtcclxuICAgICAgICAgICRzY29wZS5zZWxlY3RlZFVzZXIuc2VjdGlvbnMgPSBnZW5lcmF0ZVNlY3Rpb25zKHVzZXIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHVzZXIpO1xyXG4gICAgICAgICQoXCIubG9uZy51c2VyLm1vZGFsXCIpLm1vZGFsKFwic2hvd1wiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gZ2VuZXJhdGVTZWN0aW9ucyh1c2VyKSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgbmFtZTogXCJQcm9maWxlXCIsXHJcbiAgICAgICAgICAgIGZpZWxkczogW1xyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwiR2VuZGVyXCIsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmdlbmRlclxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJTY2hvb2xcIixcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuc2Nob29sXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcIkdpdGh1YlwiLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5naXRodWJcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwiTGlua2VkaW5cIixcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUubGlua2VkaW5cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIF07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGZvcm1hdFRpbWUodGltZSkge1xyXG4gICAgICAgIGlmICh0aW1lKSB7XHJcbiAgICAgICAgICByZXR1cm4gbW9tZW50KHRpbWUpLmZvcm1hdChcIk1NTU0gRG8gWVlZWSwgaDptbTpzcyBhXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgJHNjb3BlLnNlbGVjdE1lbWJlciA9IHNlbGVjdE1lbWJlcjtcclxuXHJcblxyXG4gICAgICAkc2NvcGUuaXNqb2luZWQgPSBmdW5jdGlvbiAodGVhbSkge1xyXG4gICAgICAgIHZhciB0ZXN0ID0gZmFsc2U7XHJcbiAgICAgICAgdGVhbS5qb2luUmVxdWVzdHMuZm9yRWFjaChtZW1iZXIgPT4ge1xyXG4gICAgICAgICAgaWYgKG1lbWJlci5pZCA9PSBjdXJyZW50VXNlci5kYXRhLl9pZCkgdGVzdCA9IHRydWU7XHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gdGVzdDtcclxuICAgICAgfVxyXG5cclxuICAgICAgVGVhbVNlcnZpY2UuZ2V0QWxsKCkudGhlbih0ZWFtcyA9PiB7XHJcbiAgICAgICAgJHNjb3BlLmlzVGVhbUFkbWluID0gZmFsc2U7XHJcbiAgICAgICAgJHNjb3BlLmlzVGVhbU1lbWJlciA9IGZhbHNlO1xyXG4gICAgICAgIHRlYW1zLmRhdGEuZm9yRWFjaCh0ZWFtID0+IHtcclxuICAgICAgICAgIHRlYW0uaXNNYXh0ZWFtID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgaWYgKHRlYW0ubWVtYmVycy5sZW5ndGggPj0gU2V0dGluZ3MubWF4VGVhbVNpemUpIHtcclxuICAgICAgICAgICAgdGVhbS5pc0NvbG9zZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB0ZWFtLmlzTWF4dGVhbSA9IHRydWU7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKHRlYW0ubWVtYmVyc1swXS5pZCA9PSBjdXJyZW50VXNlci5kYXRhLl9pZCkge1xyXG4gICAgICAgICAgICB0ZWFtLmpvaW5SZXF1ZXN0cy5mb3JFYWNoKG1lbWJlciA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKGlzVGVhbU1lbWJlcih0ZWFtcy5kYXRhLCBtZW1iZXIuaWQpKSB7XHJcbiAgICAgICAgICAgICAgICBtZW1iZXIudW5hdmFpbGFibGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7IG1lbWJlci51bmF2YWlsYWJsZSA9IGZhbHNlIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICRzY29wZS51c2VyQWRtaW5UZWFtID0gdGVhbTtcclxuICAgICAgICAgICAgJHNjb3BlLmlzVGVhbUFkbWluID0gdHJ1ZTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRlYW0ubWVtYmVycy5mb3JFYWNoKG1lbWJlciA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKG1lbWJlci5pZCA9PSBjdXJyZW50VXNlci5kYXRhLl9pZCkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnVzZXJNZW1iZXJUZWFtID0gdGVhbTtcclxuICAgICAgICAgICAgICAgICRzY29wZS5pc1RlYW1NZW1iZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgICRzY29wZS50ZWFtcyA9IHRlYW1zLmRhdGE7XHJcblxyXG4gICAgICB9KTtcclxuXHJcblxyXG4gICAgICAkc2NvcGUuY3JlYXRlVGVhbSA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgdGVhbURhdGEgPSB7XHJcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJHNjb3BlLm5ld1RlYW1fZGVzY3JpcHRpb24sXHJcbiAgICAgICAgICBtZW1iZXJzOiBbeyBpZDogY3VycmVudFVzZXIuZGF0YS5faWQsIG5hbWU6IGN1cnJlbnRVc2VyLmRhdGEucHJvZmlsZS5uYW1lLCBza2lsbDogJHNjb3BlLm5ld1RlYW1fQWRtaW5za2lsbCB9XSxcclxuICAgICAgICAgIHNraWxsczogeyBjb2RlOiAkc2NvcGUuc2tpbGxjb2RlLCBkZXNpZ246ICRzY29wZS5za2lsbGRlc2lnbiwgaGFyZHdhcmU6ICRzY29wZS5za2lsbGhhcmR3YXJlLCBpZGVhOiAkc2NvcGUuc2tpbGxpZGVhIH0sXHJcbiAgICAgICAgICBpc0NvbG9zZWQ6IGZhbHNlLFxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmxvZyh0ZWFtRGF0YSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLm5ld1RlYW1fQWRtaW5za2lsbCk7XHJcblxyXG4gICAgICAgIFRlYW1TZXJ2aWNlLmNyZWF0ZSh0ZWFtRGF0YSk7XHJcbiAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xyXG4gICAgICB9O1xyXG5cclxuXHJcbiAgICAgICRzY29wZS5TaG93Y3JlYXRlVGVhbSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkc2NvcGUuU2hvd05ld1RlYW1Gcm9tID0gdHJ1ZTtcclxuICAgICAgICAkc2NvcGUuc2tpbGxjb2RlID0gdHJ1ZVxyXG4gICAgICAgICRzY29wZS5za2lsbGRlc2lnbiA9IHRydWVcclxuICAgICAgICAkc2NvcGUuc2tpbGxoYXJkd2FyZSA9IHRydWVcclxuICAgICAgICAkc2NvcGUuc2tpbGxpZGVhID0gdHJ1ZVxyXG4gICAgICAgICRzY29wZS5uZXdUZWFtX0FkbWluc2tpbGwgPSBcImNvZGVcIlxyXG4gICAgICB9XHJcblxyXG5cclxuICAgICAgJHNjb3BlLlNob3dKb2luVGVhbSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgJHNjb3BlLlNob3dKb2luVGVhbUZyb20gPSB0cnVlOyAgXHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgICAkc2NvcGUuam9pblRlYW1Db2RlID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICB0ZWFtSUQgPSAkc2NvcGUubmV3VGVhbV9Db2RlO1xyXG4gICAgICAgIG5ld1RlYW1fc2tpbGw9ICRzY29wZS5uZXdUZWFtX3NraWxsO1xyXG5cclxuICAgICAgICBuZXd1c2VyPSB7aWQ6Y3VycmVudFVzZXIuZGF0YS5faWQsIG5hbWU6Y3VycmVudFVzZXIuZGF0YS5wcm9maWxlLm5hbWUsIHNraWxsOm5ld1RlYW1fc2tpbGx9O1xyXG4gICAgICAgIFRlYW1TZXJ2aWNlLmpvaW4odGVhbUlELG5ld3VzZXIpLnRoZW4oIGU9PiAgICAgICAgIFxyXG4gICAgICAgICAgc3dhbChcclxuICAgICAgICAgIFwiSm9pbmVkXCIsXHJcbiAgICAgICAgICBcIllvdSBoYXZlIGFwcGxpY2VkIHRvIGpvaW4gdGhpcyB0ZWFtLCB3YWl0IGZvciB0aGUgVGVhbS1BZG1pbiB0byBhY2NlcHQgeW91ciBhcHBsaWNhdGlvbi5cIixcclxuICAgICAgICAgIFwic3VjY2Vzc1wiXHJcbiAgICAgICAgKVxyXG4gICAgICAgICkuY2F0Y2goZXJyPT4gXHJcbiAgICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgICBcIlRlYW0gbm90IGZvdW5kXCIsXHJcbiAgICAgICAgICAgIFwiVGhlIHRlYW0gY29kZSB5b3UgZW50ZXJlZCBkb2Vzbid0IGV4aXN0LlwiLFxyXG4gICAgICAgICAgICBcImVycm9yXCJcclxuICAgICAgICAgIClcclxuICAgICAgICAgICk7IFxyXG4gICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgJHNjb3BlLmpvaW5UZWFtID0gZnVuY3Rpb24gKHRlYW0pIHtcclxuXHJcbiAgICAgICAgdmFyIHZhbHVlO1xyXG4gICAgICAgIGNvbnN0IHNlbGVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlbGVjdCcpO1xyXG4gICAgICAgIHNlbGVjdC5jbGFzc05hbWUgPSAnc2VsZWN0LWN1c3RvbSdcclxuXHJcblxyXG4gICAgICAgIHZhciBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcclxuICAgICAgICBvcHRpb24uZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIG9wdGlvbi5pbm5lckhUTUwgPSAnU2VsZWN0IGEgc2tpbGwnO1xyXG4gICAgICAgIG9wdGlvbi52YWx1ZSA9IFwiY29kZVwiXHJcbiAgICAgICAgc2VsZWN0LmFwcGVuZENoaWxkKG9wdGlvbik7XHJcblxyXG5cclxuICAgICAgICBpZiAodGVhbS5za2lsbHMuY29kZSkge1xyXG4gICAgICAgICAgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcbiAgICAgICAgICBvcHRpb24uaW5uZXJIVE1MID0gJ0NvZGUnO1xyXG4gICAgICAgICAgb3B0aW9uLnZhbHVlID0gXCJjb2RlXCJcclxuICAgICAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChvcHRpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGVhbS5za2lsbHMuZGVzaWduKSB7XHJcbiAgICAgICAgICBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcclxuICAgICAgICAgIG9wdGlvbi5pbm5lckhUTUwgPSAnRGVzaWduJztcclxuICAgICAgICAgIG9wdGlvbi52YWx1ZSA9IFwiZGVzaWduXCJcclxuICAgICAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChvcHRpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGVhbS5za2lsbHMuaGFyZHdhcmUpIHtcclxuICAgICAgICAgIG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xyXG4gICAgICAgICAgb3B0aW9uLmlubmVySFRNTCA9ICdIYXJkd2FyZSc7XHJcbiAgICAgICAgICBvcHRpb24udmFsdWUgPSBcImhhcmR3YXJlXCJcclxuICAgICAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChvcHRpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGVhbS5za2lsbHMuaWRlYSkge1xyXG4gICAgICAgICAgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcbiAgICAgICAgICBvcHRpb24uaW5uZXJIVE1MID0gJ0lkZWEnO1xyXG4gICAgICAgICAgb3B0aW9uLnZhbHVlID0gXCJpZGVhXCJcclxuICAgICAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChvcHRpb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2VsZWN0Lm9uY2hhbmdlID0gZnVuY3Rpb24gc2VsZWN0Q2hhbmdlZChlKSB7XHJcbiAgICAgICAgICB2YWx1ZSA9IGUudGFyZ2V0LnZhbHVlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzd2FsKHtcclxuICAgICAgICAgIHRpdGxlOiBcIlBsZWFzZSBzZWxlY3QgeW91ciBza2lsbCB0byBqb2luXCIsXHJcblxyXG4gICAgICAgICAgY29udGVudDoge1xyXG4gICAgICAgICAgICBlbGVtZW50OiBzZWxlY3QsXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgbmV3dXNlciA9IHsgaWQ6IGN1cnJlbnRVc2VyLmRhdGEuX2lkLCBuYW1lOiBjdXJyZW50VXNlci5kYXRhLnByb2ZpbGUubmFtZSwgc2tpbGw6IHZhbHVlIH07XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyh0ZWFtLl9pZCk7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIFRlYW1TZXJ2aWNlLmpvaW4odGVhbS5faWQsIG5ld3VzZXIpLnRoZW4oIGU9PiAgICAgICAgIFxyXG4gICAgICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgICBcIkpvaW5lZFwiLFxyXG4gICAgICAgICAgICBcIllvdSBoYXZlIGFwcGxpY2VkIHRvIGpvaW4gdGhpcyB0ZWFtLCB3YWl0IGZvciB0aGUgVGVhbS1BZG1pbiB0byBhY2NlcHQgeW91ciBhcHBsaWNhdGlvbi5cIixcclxuICAgICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICAgIClcclxuICAgICAgICAgICkuY2F0Y2goZXJyPT4gXHJcbiAgICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgICAgXCJUZWFtIG5vdCBmb3VuZFwiLFxyXG4gICAgICAgICAgICAgIFwiVGhlIHRlYW0gY29kZSB5b3UgZW50ZXJlZCBkb2Vzbid0IGV4aXN0LlwiLFxyXG4gICAgICAgICAgICAgIFwiZXJyb3JcIlxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICAgICk7IFxyXG4gICAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgICAkc2NvcGUuYWNjZXB0TWVtYmVyID0gZnVuY3Rpb24gKHRlYW1JRCwgbWVtYmVyLCBpbmRleCkge1xyXG5cclxuICAgICAgICBzd2FsKHtcclxuICAgICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXHJcbiAgICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gYWNjZXB0IFwiICsgbWVtYmVyLm5hbWUgKyBcIiB0byB5b3VyIHRlYW0hIFRoaXMgd2lsbCBzZW5kIGhpbSBhIG5vdGlmaWNhdGlvbiBlbWFpbCBhbmQgd2lsbCBzaG93IGluIHRoZSBwdWJsaWMgdGVhbXMgcGFnZS5cIixcclxuICAgICAgICAgIGljb246IFwid2FybmluZ1wiLFxyXG4gICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2hlY2tJbjoge1xyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgdGV4dDogXCJZZXMsIGxldCBoaW0gaW5cIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgVGVhbVNlcnZpY2UuYWNjZXB0TWVtYmVyKHRlYW1JRCwgbWVtYmVyLCBTZXR0aW5ncy5tYXhUZWFtU2l6ZSkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZSA9PSBcIm1heFRlYW1TaXplXCIpIHtcclxuICAgICAgICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgICAgICAgXCJFcnJvclwiLFxyXG4gICAgICAgICAgICAgICAgXCJNYXhpbXVtIG51bWJlciBvZiBtZW1iZXJzIChcIiArIFNldHRpbmdzLm1heFRlYW1TaXplICsgXCIpIHJlYWNoZWRcIixcclxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIlxyXG4gICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgVGVhbVNlcnZpY2UucmVtb3Zlam9pbih0ZWFtSUQsIGluZGV4LCBmYWxzZSkudGhlbihyZXNwb25zZTIgPT4ge1xyXG4gICAgICAgICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgICAgICAgXCJBY2NlcHRlZFwiLFxyXG4gICAgICAgICAgICAgICAgICBtZW1iZXIubmFtZSArIFwiIGhhcyBiZWVuIGFjY2VwdGVkIHRvIHlvdXIgdGVhbS5cIixcclxuICAgICAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG5cclxuXHJcbiAgICAgICRzY29wZS5yZWZ1c2VNZW1iZXIgPSBmdW5jdGlvbiAodGVhbUlELCBtZW1iZXIsIGluZGV4KSB7XHJcbiAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxyXG4gICAgICAgICAgdGV4dDogXCJZb3UgYXJlIGFib3V0IHRvIHJlZnVzZSBcIiArIG1lbWJlci5uYW1lICsgXCIgZnJvbSB5b3VyIHRlYW0hIFRoaXMgd2lsbCBzZW5kIGhpbSBhIG5vdGlmaWNhdGlvbiBlbWFpbC5cIixcclxuICAgICAgICAgIGljb246IFwid2FybmluZ1wiLFxyXG4gICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2hlY2tJbjoge1xyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgdGV4dDogXCJZZXMsIHJlZnVzZSBoaW1cIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgVGVhbVNlcnZpY2UucmVtb3Zlam9pbih0ZWFtSUQsIGluZGV4LCBtZW1iZXIpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgICAgIFwiUmVmdXNlZFwiLFxyXG4gICAgICAgICAgICAgIG1lbWJlci5uYW1lICsgXCIgaGFzIGJlZW4gcmVmdXNlZCBmcm9tIHlvdXIgdGVhbS5cIixcclxuICAgICAgICAgICAgICBcInN1Y2Nlc3NcIlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuXHJcbiAgICAgICRzY29wZS5yZW1vdmVNZW1iZXJmcm9tVGVhbSA9IGZ1bmN0aW9uICh0ZWFtSUQsIG1lbWJlciwgaW5kZXgpIHtcclxuICAgICAgICBzd2FsKHtcclxuICAgICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXHJcbiAgICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gcmVtb3ZlIFwiICsgbWVtYmVyLm5hbWUgKyBcIiBmcm9tIHlvdXIgdGVhbSEgVGhpcyB3aWxsIHNlbmQgaGltIGEgbm90aWZpY2F0aW9uIGVtYWlsLlwiLFxyXG4gICAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgIGNhbmNlbDoge1xyXG4gICAgICAgICAgICAgIHRleHQ6IFwiQ2FuY2VsXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjaGVja0luOiB7XHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcclxuICAgICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcclxuICAgICAgICAgICAgICB0ZXh0OiBcIlllcywgcmVtb3ZlIGhpbVwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBUZWFtU2VydmljZS5yZW1vdmVtZW1iZXIodGVhbUlELCBpbmRleCwgbWVtYmVyLmlkKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlID09IFwicmVtb3ZpbmdBZG1pblwiKSB7XHJcbiAgICAgICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgICAgIFwiRXJyb3JcIixcclxuICAgICAgICAgICAgICAgIFwiWW91IGNhbid0IHJlbW92ZSB0aGUgVGVhbSBBZG1pbiwgQnV0IHlvdSBjYW4gY2xvc2UgdGhlIHRlYW0uXCIsXHJcbiAgICAgICAgICAgICAgICBcImVycm9yXCJcclxuICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIFRlYW1TZXJ2aWNlLnJlbW92ZWpvaW4odGVhbUlELCBpbmRleCwgZmFsc2UpLnRoZW4ocmVzcG9uc2UyID0+IHtcclxuICAgICAgICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgICAgICAgIFwiUmVtb3ZlZFwiLFxyXG4gICAgICAgICAgICAgICAgICBtZW1iZXIubmFtZSArIFwiIGhhcyBiZWVuIHJlbW92ZWQgZnJvbSB5b3VyIHRlYW0uXCIsXHJcbiAgICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAkc2NvcGUucmVtb3ZlVGVhbSA9IGZ1bmN0aW9uICh0ZWFtKSB7XHJcbiAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxyXG4gICAgICAgICAgdGV4dDogXCJZb3UgYXJlIGFib3V0IHRvIHJlbW92ZSB0aGlzIHRlYW0gd2l0aCBhbGwgaXQncyBtZW1iZXJzISBUaGlzIHdpbGwgc2VuZCB0aGVtIGEgbm90aWZpY2F0aW9uIGVtYWlsLiBZb3UgbmVlZCB0byBmaW5kIGFub3RoZXIgdGVhbSB0byB3b3JrIHdpdGguXCIsXHJcbiAgICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcclxuICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgY2FuY2VsOiB7XHJcbiAgICAgICAgICAgICAgdGV4dDogXCJDYW5jZWxcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNoZWNrSW46IHtcclxuICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxyXG4gICAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIHRleHQ6IFwiWWVzLCByZW1vdmUgdGVhbVwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZW1haWwgPSB7XHJcbiAgICAgICAgICAgIHN1YmplY3Q6IFwiWW91ciB0ZWFtIGhhcyBiZWVuIHJlbW92ZWRcIixcclxuICAgICAgICAgICAgdGl0bGU6IFwiVGltZSBmb3IgYSBiYWNrdXAgcGxhblwiLFxyXG4gICAgICAgICAgICBib2R5OiBcIlRoZSB0ZWFtIHlvdSBoYXZlIGJlZW4gcGFydCAoTWVtYmVyL3JlcXVlc3RlZCB0byBqb2luKSBvZiBoYXMgYmVlbiByZW1vdmVkLiBQbGVhc2UgY2hlY2sgeW91ciBkYXNoYm9hcmQgYW5kIHRyeSB0byBmaW5kIGFub3RoZXIgdGVhbSB0byB3b3JrIHdpdGggYmVmb3JlIHRoZSBoYWNrYXRob24gc3RhcnRzLlwiXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgVGVhbVNlcnZpY2UucmVtb3ZlKHRlYW0uX2lkKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgdGVhbS5tZW1iZXJzLmZvckVhY2godXNlciA9PiB7XHJcbiAgICAgICAgICAgICAgVXNlclNlcnZpY2Uuc2VuZEJhc2ljTWFpbCh1c2VyLmlkLCBlbWFpbCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0ZWFtLmpvaW5SZXF1ZXN0cy5mb3JFYWNoKHVzZXIgPT4ge1xyXG4gICAgICAgICAgICAgIFVzZXJTZXJ2aWNlLnNlbmRCYXNpY01haWwodXNlci5pZCwgZW1haWwpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgICAgXCJSZW1vdmVkXCIsXHJcbiAgICAgICAgICAgICAgXCJUZWFtIGhhcyBiZWVuIHJlbW92ZWQuXCIsXHJcbiAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgICAkc2NvcGUubGVhdmVUZWFtID0gZnVuY3Rpb24gKHRlYW0pIHtcclxuICAgICAgICBzd2FsKHtcclxuICAgICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXHJcbiAgICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gbGVhdmUgeW91ciB0ZWFtISBUaGlzIHdpbGwgc2VuZCB0aGUgYWRtaW4gYSBub3RpZmljYXRpb24gZW1haWwuXCIsXHJcbiAgICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcclxuICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgY2FuY2VsOiB7XHJcbiAgICAgICAgICAgICAgdGV4dDogXCJDYW5jZWxcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNoZWNrSW46IHtcclxuICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxyXG4gICAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIHRleHQ6IFwiWWVzLCByZW1vdmUgaGltXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHRydWUsXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XHJcbiAgICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHZhciBpbmRleCA9IDA7XHJcbiAgICAgICAgICB0ZWFtLm1lbWJlcnMuZm9yRWFjaChtZW1iZXIgPT4ge1xyXG4gICAgICAgICAgICBpZiAobWVtYmVyLmlkID09IGN1cnJlbnRVc2VyLmRhdGEuX2lkKSB7XHJcbiAgICAgICAgICAgICAgVGVhbVNlcnZpY2UucmVtb3ZlbWVtYmVyKHRlYW0uX2lkLCBpbmRleCkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgICAgICAgICBcIlJlbW92ZWRcIixcclxuICAgICAgICAgICAgICAgICAgXCJZb3UgaGF2ZSBzdWNjZXNzZnVsbHkgbGVmdCB0aGlzIHRlYW0uIFBsZWFzZSBmaW5kIGFub3RoZXIgdGVhbSBvciBjcmVhdGUgeW91ciBvd24uXCIsXHJcbiAgICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuXHJcbiAgICAgICRzY29wZS5jYW5jZWxqb2luVGVhbSA9IGZ1bmN0aW9uICh0ZWFtKSB7XHJcbiAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxyXG4gICAgICAgICAgdGV4dDogXCJZb3UgYXJlIGFib3V0IHRvIGNhbmNlbCB5b3VyIHJlcXVlc3QgdG8gam9pbiB0aGlzIHRlYW0hXCIsXHJcbiAgICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcclxuICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgY2FuY2VsOiB7XHJcbiAgICAgICAgICAgICAgdGV4dDogXCJOb1wiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2hlY2tJbjoge1xyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgdGV4dDogXCJZZXMsIENhbmNlbFwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB2YXIgaW5kZXggPSAwO1xyXG5cclxuICAgICAgICAgIHRlYW0uam9pblJlcXVlc3RzLmZvckVhY2gobWVtYmVyID0+IHtcclxuICAgICAgICAgICAgaWYgKG1lbWJlci5pZCA9PSBjdXJyZW50VXNlci5kYXRhLl9pZCkge1xyXG4gICAgICAgICAgICAgIFRlYW1TZXJ2aWNlLnJlbW92ZWpvaW4odGVhbS5faWQsIGluZGV4LCBmYWxzZSkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgICAgICAgICBcIlJlbW92ZWRcIixcclxuICAgICAgICAgICAgICAgICAgXCJZb3UgaGF2ZSBzdWNjZXNzZnVsbHkgY2FuY2VsZWQgeW91IHJlcXVlc3QgdG8gam9pbiB0aGlzIHRlYW0uIFBsZWFzZSBmaW5kIGFub3RoZXIgdGVhbSBvciBjcmVhdGUgeW91ciBvd24uXCIsXHJcbiAgICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuXHJcbiAgICAgICRzY29wZS50b2dnbGVDbG9zZVRlYW0gPSBmdW5jdGlvbiAodGVhbUlELCBzdGF0dXMpIHtcclxuICAgICAgICBpZiAoc3RhdHVzID09IHRydWUpIHtcclxuICAgICAgICAgIHRleHQgPSBcIllvdSBhcmUgYWJvdXQgdG8gQ2xvc2UgdGhpcyB0ZWFtLiBUaGlzIHdvbid0IGFsbG93IG90aGVyIG1lbWJlcnMgdG8gam9pbiB5b3VyIHRlYW0hXCJcclxuICAgICAgICB9IGVsc2UgeyB0ZXh0ID0gXCJZb3UgYXJlIGFib3V0IHRvIHJlb3BlbiB0aGlzIHRlYW0uIFRoaXMgd2lsbCBhbGxvdyBvdGhlciBtZW1iZXJzIHRvIGpvaW4geW91ciB0ZWFtIVwiIH1cclxuXHJcbiAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxyXG4gICAgICAgICAgdGV4dDogdGV4dCxcclxuICAgICAgICAgIGljb246IFwid2FybmluZ1wiLFxyXG4gICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgICB0ZXh0OiBcIk5vXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjaGVja0luOiB7XHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcclxuICAgICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcclxuICAgICAgICAgICAgICB0ZXh0OiBcIlllc1wiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBUZWFtU2VydmljZS50b2dnbGVDbG9zZVRlYW0odGVhbUlELCBzdGF0dXMpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgICAgIFwiRG9uZVwiLFxyXG4gICAgICAgICAgICAgIFwiT3BlcmF0aW9uIHN1Y2Nlc3NmdWxseSBDb21wbGV0ZWQuXCIsXHJcbiAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcblxyXG5cclxuICAgICAgJHNjb3BlLnRvZ2dsZUhpZGVUZWFtID0gZnVuY3Rpb24gKHRlYW1JRCwgc3RhdHVzKSB7XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PSB0cnVlKSB7XHJcbiAgICAgICAgICB0ZXh0ID0gXCJZb3UgYXJlIGFib3V0IHRvIEhpZGUgdGhpcyB0ZWFtLiBUaGlzIHdvbid0IGFsbG93IG90aGVyIG1lbWJlcnMgdG8gc2VlIHlvdXIgdGVhbSFcIlxyXG4gICAgICAgIH0gZWxzZSB7IHRleHQgPSBcIllvdSBhcmUgYWJvdXQgdG8gU2hvdyB0aGlzIHRlYW0uIFRoaXMgd2lsbCBhbGxvdyBvdGhlciBtZW1iZXJzIHRvIHNlZSB5b3VyIHRlYW0hXCIgfVxyXG5cclxuICAgICAgICBzd2FsKHtcclxuICAgICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXHJcbiAgICAgICAgICB0ZXh0OiB0ZXh0LFxyXG4gICAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgIGNhbmNlbDoge1xyXG4gICAgICAgICAgICAgIHRleHQ6IFwiTm9cIixcclxuICAgICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNoZWNrSW46IHtcclxuICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxyXG4gICAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIHRleHQ6IFwiWWVzXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHRydWUsXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XHJcbiAgICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFRlYW1TZXJ2aWNlLnRvZ2dsZUhpZGVUZWFtKHRlYW1JRCwgc3RhdHVzKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgICBcIkRvbmVcIixcclxuICAgICAgICAgICAgICBcIk9wZXJhdGlvbiBzdWNjZXNzZnVsbHkgQ29tcGxldGVkLlwiLFxyXG4gICAgICAgICAgICAgIFwic3VjY2Vzc1wiXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkc2NvcGUuJHdhdGNoKFwicXVlcnlUZXh0XCIsIGZ1bmN0aW9uIChxdWVyeVRleHQpIHtcclxuICAgICAgICBUZWFtU2VydmljZS5nZXRTZWxlY3RlZFRlYW1zKHF1ZXJ5VGV4dCwgJHNjb3BlLnNraWxsc0ZpbHRlcnMpLnRoZW4oXHJcbiAgICAgICAgICByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICRzY29wZS50ZWFtcyA9IHJlc3BvbnNlLmRhdGEudGVhbXM7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAkc2NvcGUuYXBwbHlza2lsbHNGaWx0ZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgVGVhbVNlcnZpY2UuZ2V0U2VsZWN0ZWRUZWFtcygkc2NvcGUucXVlcnlUZXh0LCAkc2NvcGUuc2tpbGxzRmlsdGVycykudGhlbihcclxuICAgICAgICAgIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgJHNjb3BlLnRlYW1zID0gcmVzcG9uc2UuZGF0YS50ZWFtcztcclxuICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgICB9O1xyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5jb250cm9sbGVyKCdWZXJpZnlDdHJsJywgW1xyXG4gICAgJyRzY29wZScsXHJcbiAgICAnJHN0YXRlUGFyYW1zJyxcclxuICAgICdBdXRoU2VydmljZScsXHJcbiAgICBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZVBhcmFtcywgQXV0aFNlcnZpY2Upe1xyXG4gICAgICB2YXIgdG9rZW4gPSAkc3RhdGVQYXJhbXMudG9rZW47XHJcblxyXG4gICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XHJcblxyXG4gICAgICBpZiAodG9rZW4pIHtcclxuICAgICAgICBBdXRoU2VydmljZS52ZXJpZnkodG9rZW4sXHJcbiAgICAgICAgICBmdW5jdGlvbih1c2VyKXtcclxuICAgICAgICAgICAgJHNjb3BlLnN1Y2Nlc3MgPSB0cnVlO1xyXG4gICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGZ1bmN0aW9uKGVycil7XHJcbiAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfV0pO1xyXG4iXX0=
