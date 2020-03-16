var app = angular.module('reg', [
  'ui.router',
  'chart.js',
  'thatisuday.dropzone'
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
      updateEventTimes: function(start,end){
        return $http.put(base + 'eventtimes', {
          timeStart: start,
          timeEnd: end,
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
          return $http.post(base + id + "/joinTeam", {
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
            return $http.post(base + id + "/removeJoinTeam", {
              newjoinRequests: team.data.joinRequests
            });
          })
        },

        acceptMember: function(id, newuser,maxTeamSize) {
          return $http.get(base + id)
          .then(team => {

            if (team.data.members.length>=maxTeamSize){ return 'maxTeamSize' }
            $http.post(teams + "/sendAcceptedTeam", {
              id: newuser.id,
            });
            return $http.post(base + id + "/addMember", {
              newMember: newuser,
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
            return $http.post(base + id + "/removeMember", {
              newMembers: team.data.members,
              removeduserID: removedUser.id
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
  function ($http, Session) {
    var users = "/api/users";
    var base = users + "/";

    return {
      // ----------------------
      // Basic Actions
      // ----------------------
      getCurrentUser: function () {
        return $http.get(base + Session.getUserId());
      },

      get: function (id) {
        return $http.get(base + id);
      },

      getAll: function () {
        return $http.get(base);
      },

      getPage: function (page, size, text, statusFilters, NotstatusFilters) {
        return $http.get(users + "?" + $.param({
          text: text,
          page: page ? page : 0,
          size: size ? size : 20,
          statusFilters: statusFilters ? statusFilters : {},
          NotstatusFilters: NotstatusFilters ? NotstatusFilters : {}

        })
        );
      },

      uploadCV: function (files) {
        var fd = new FormData();
        fd.append("cv", files[0], "cv.pdf");
        return $http.post('https://cse.club/api/uploadCV', fd, {
          transformRequest: angular.identity,
          headers: { 'Content-Type': undefined }
        });
      },

      updateProfile: function (id, profile) {
        return $http.put(base + id + "/profile", {
          profile: profile
        });
      },

      updateConfirmation: function (id, confirmation) {
        return $http.put(base + id + "/confirm", {
          confirmation: confirmation
        });
      },

      updateAll: function (id, user) {
        return $http.put(base + id + "/updateall", {
          user: user
        });
      },

      declineAdmission: function (id) {
        return $http.post(base + id + "/decline");
      },

      // -------------------------
      // Admin Only
      // -------------------------

      getStats: function () {
        return $http.get(base + "stats");
      },

      getTeamStats: function () {
        return $http.get(base + "teamStats");
      },

      updatestats: function () {
        return $http.get(base + "updatestats");
      },

      admitUser: function (id) {
        return $http.post(base + id + "/admit");
      },
      rejectUser: function (id) {
        return $http.post(base + id + "/reject");
      },
      softAdmittUser: function (id) {
        return $http.post(base + id + "/softAdmit");
      },

      updateConfirmationTime: function (id) {
        return $http.post(base + id + "/updateconfirmby");
      },

      softRejectUser: function (id) {
        return $http.post(base + id + "/softReject");
      },

      sendBasicMail: function (id, email) {
        return $http.post(base + id + "/sendBasicMail", JSON.stringify(email));
      },

      checkIn: function (id) {
        return $http.post(base + id + "/checkin");
      },

      checkOut: function (id) {
        return $http.post(base + id + "/checkout");
      },

      removeUser: function (id) {
        return $http.post(base + id + "/removeuser");
      },

      removeteamfield: function (id) {
        return $http.post(base + id + "/removeteamfield");
      },

      makeAdmin: function (id) {
        return $http.post(base + id + "/makeadmin");
      },

      removeAdmin: function (id) {
        return $http.post(base + id + "/removeadmin");
      },

      massReject: function () {
        return $http.post(base + "massReject");
      },

      getRejectionCount: function () {
        return $http.get(base + "rejectionCount");
      },

      getLaterRejectedCount: function () {
        return $http.get(base + "laterRejectCount");
      },

      massRejectRest: function () {
        return $http.post(base + "massRejectRest");
      },

      getRestRejectionCount: function () {
        return $http.get(base + "rejectionCountRest");
      },

      reject: function (id) {
        return $http.post(base + id + "/reject");
      },

      sendLaggerEmails: function () {
        return $http.post(base + "sendlagemails");
      },

      sendRejectEmails: function () {
        return $http.post(base + "sendRejectEmails");
      },

      sendRejectEmailsRest: function () {
        return $http.post(base + "sendRejectEmailsRest");
      },

      sendRejectEmail: function (id) {
        return $http.post(base + id + "/rejectEmail");
      },

      sendPasswordResetEmail: function (email) {
        return $http.post(base + "sendResetEmail", { email: email });
      },



    };
  }
]);

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
          return moment(date).locale('en').format('dddd, MMMM Do YYYY, h:mm a') +
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
    'UserService',
    function($scope, $sce, SettingsService,UserService){

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
        settings.timeEnd = new Date(settings.timeEnd);

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
        return moment(date).locale('en').format('dddd, MMMM Do YYYY, h:mm a') +
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

      $scope.SuggestRegistrationTime = function (hours) {
        $scope.settings.timeClose = new Date( moment($scope.settings.timeOpen).add(hours, 'h'))
      }

      // Event Start Time -----------------------------

      $scope.updateEventTimes = function(){
        // Clean the dates and turn them to ms.
        var start = cleanDate($scope.settings.timeStart).getTime();
        var end = cleanDate($scope.settings.timeEnd).getTime();

        if (start < 0 || end < 0 || start === undefined || end === undefined){
          return swal('Oops...', 'You need to enter valid times.', 'error');
        }
        if (start >= end){
          swal('Oops...', 'Event cannot start after it ends.', 'error');
          return;
        }

        SettingsService
          .updateEventTimes(start, end)
          .then(response => {
            updateSettings(response.data);
            swal("Looks good!", "Event Times Updated", "success");
          });
      };

      $scope.SuggestStartTime = function (hours) {
        $scope.settings.timeEnd = new Date( moment($scope.settings.timeStart).add(hours, 'h'))
      }

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

      
      $scope.SuggestConfirmationTime = function (hours) {
        $scope.settings.timeConfirm = new Date( moment($scope.settings.timeStart).subtract(hours, 'h'))
      }

      $scope.updateConfirmationUsers = function(){
        var confirmBy = cleanDate($scope.settings.timeConfirm).getTime();

        SettingsService
          .updateConfirmationTime(confirmBy)
          .then(response => {
            updateSettings(response.data);
            // get all users soft admitted and update confirmation time foreach

            UserService.getPage(0, 0, "", {softAdmitted:true})
            .then(response => {
              console.log(response.data);
              response.data.users.forEach(user => {
                UserService.updateConfirmationTime(user._id)
              });
              //update confirmation time foreach
              swal("Sounds good!", "Confirmation Date Updated for all users", "success");            
            });

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

angular.module('reg') .config(['ChartJsProvider', function (ChartJsProvider) {
  // Configure all charts
  ChartJsProvider.setOptions({
    chartColors: ['#9B66FE', '#FF6484', '#FEA03F', '#FBD04D', '#4DBFC0', '#33A3EF', '#CACBCF'],
    responsive: true
  });
}])
.controller('AdminStatsCtrl',[
    '$scope',
    "$state",
    'UserService',
    function($scope, $state, UserService){
      
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
        return moment(date).locale('en').fromNow();
      };

      $scope.updatestats = function(){
        UserService.updatestats()
        $state.reload();
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

    $scope.acceptTeam = function (team) {
      team.members.forEach(user => {
        UserService.softAdmittUser(user.id);
      }).then(e=>{
        swal(
          "Done",
          "All users softAccepted.",
          "success"
        );  
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
  function ($scope, $state, $stateParams, UserService, AuthService) {
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
      $state.go("app.admin.users", {
        page: 0,
        size: $stateParams.size || 20
      });
      $scope.pages = p;
    }

    UserService.getPage($stateParams.page, $stateParams.size, $stateParams.query, $scope.statusFilters)
      .then(response => {

        updatePage(response.data);
      });

    $scope.$watch("queryText", function (queryText) {
      UserService.getPage($stateParams.page, $stateParams.size, queryText, $scope.statusFilters).then(
        response => {
          updatePage(response.data);
        }
      );
    });


    $scope.applyStatusFilter = function () {
      UserService
        .getPage($stateParams.page, $stateParams.size, $scope.queryText, $scope.statusFilters, $scope.NotstatusFilters).then(
          response => {
            updatePage(response.data);
          });
    };


    $scope.goToPage = function (page) {
      $state.go("app.admin.users", {
        page: page,
        size: $stateParams.size || 20
      });
    };

    $scope.goUser = function ($event, user) {
      $event.stopPropagation();

      $state.go("app.admin.user", {
        id: user._id
      });
    };


    $scope.acceptUser = function ($event, user, index) {
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



    $scope.rejecttUser = function ($event, user, index) {
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




    $scope.removeUser = function ($event, user, index) {
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

    $scope.sendAcceptanceEmails = function () {
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



    $scope.sendRejectionEmails = function () {
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


    $scope.exportUsers = function () {
      var columns = ["N°", "Gender", "Full Name", "School"];
      var rows = [];
      UserService.getAll().then(users => {
        var i = 1;
        users.data.forEach(user => {
          rows.push([i++, user.profile.gender, user.profile.name, user.profile.school])
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
          doc.text(str, data.settings.margin.left, pageHeight - 10);
        };

        doc.autoTable(columns, rows, {
          addPageContent: pageContent,
          margin: { top: 30 },
          theme: 'grid'
        });
        if (typeof doc.putTotalPages === 'function') {
          doc.putTotalPages(totalPagesExp);
        }
        doc.save('Participants List.pdf');
      })
    }


    $scope.toggleAdmin = function ($event, user, index) {
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
        UserService.getAll().then(response => {
          var count = 0;
          response.data.forEach(user => {
            if (user.admin) count++;
          });
          if (count > 1) {
            UserService.removeAdmin(user._id).then(response => {
              $scope.users[index] = response.data;
              swal("Removed", response.data.profile.name + " as admin", "success");
              $state.reload();
            });
          } else {
            swal("No other Admin", "You can't remove all admins.", "error");
          }
        })

      }
    };

    function formatTime(time) {
      if (time) {
        return moment(time).locale('en').format("MMMM Do YYYY, h:mm:ss a");
      }
    }

    $scope.rowClass = function (user) {
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
              name: "National Card ID",
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

    function onError(data) {
      swal("Try again!", data.message, "error")
    }

    $scope.addVolunteer = function () {

      swal("Write the volunteer email:", {
        buttons: { cancel: { text: "Cancel", value: null, visible: true }, confirm: { text: "Invite", value: true, visible: true } },
        content: { element: "input", attributes: { placeholder: "example@gmail.com", type: "text" } },
      }).then((mail) => {
        if (!mail) { return; }
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
  .config(["dropzoneOpsProvider", function (dropzoneOpsProvider) {
    dropzoneOpsProvider.setOptions({
      addRemoveLinks: true,
      url: 'https://cse.club/api/uploadCV',
      maxFilesize: '2',
      maxFiles : 1,
      paramName: 'cv',
      acceptedFiles: 'application/pdf',
    })
  }])
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

      $scope.dzCallbacks = {
        'addedfile': function (file) {
          console.log(file);
          $scope.newFile = file;
        },
        'success': function (file, xhr) {
          $scope.user.profile.cvLink = xhr.link ;
        },
      }
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

        // UserService.uploadCV(angular.element(document.querySelector('#cv'))[0].files).then(response => {
        //   console.log(response);
        //   $scope.user.profile.cvLink = response.data.link;

        // })

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
    $scope.statusFilters= {verified:true,completedProfile:true,admitted: true,confirmed:true}

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
        return moment(time).locale('en').format("MMMM Do YYYY, h:mm:ss a");
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
    function ($scope, $rootScope, $state, currentUser, Utils, UserService) {

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

      if (user.confirmation.dietaryRestrictions) {
        user.confirmation.dietaryRestrictions.forEach(function (restriction) {
          if (restriction in dietaryRestrictions) {
            dietaryRestrictions[restriction] = true;
          }
        });
      }

      $scope.dietaryRestrictions = dietaryRestrictions;

      // -------------------------------

      function _updateUser(e) {
        var confirmation = $scope.user.confirmation;
        // Get the dietary restrictions as an array
        var drs = [];
        Object.keys($scope.dietaryRestrictions).forEach(function (key) {
          if ($scope.dietaryRestrictions[key]) {
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
          })


        // }, response => {
        //   swal("Uh oh!", "Something went wrong. (File)", "error");
        // })




      }

      function _setupForm() {
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

      $scope.submitForm = function () {
        if ($('.ui.form').form('is valid')) {
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

        UserService.get(currentUser.data._id).then(user=>{
          console.log(user.data.team);
          
          if (typeof(user.data.team)=== "undefined") {
            TeamService.create(teamData);
            $state.reload();
          } else {
            swal(
              "You've another team",
              "You can't be part of two teams at the same time, please leave your current team to create another one.",
              "error"
            )
          }
        })
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
            body: "The team you have been part of (Member/requested to join) has been removed. Please check your dashboard and try to find another team to work with before the hackathon starts."
          }

          TeamService.remove(team._id).then(response => {
            team.members.forEach(user => {
              UserService.removeteamfield(user.id)
              if (user.id != currentUser.data._id) {
                UserService.sendBasicMail(user.id, email);
              }
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnN0YW50cy5qcyIsInJvdXRlcy5qcyIsImludGVyY2VwdG9ycy9BdXRoSW50ZXJjZXB0b3IuanMiLCJzZXJ2aWNlcy9BdXRoU2VydmljZS5qcyIsInNlcnZpY2VzL0NoYWxsZW5nZVNlcnZpY2UuanMiLCJzZXJ2aWNlcy9NYXJrZXRpbmdTZXJ2aWNlLmpzIiwic2VydmljZXMvU2V0dGluZ3NTZXJ2aWNlLmpzIiwic2VydmljZXMvU29sdmVkQ1RGU2VydmljZS5qcyIsInNlcnZpY2VzL1RlYW1TZXJ2aWNlLmpzIiwic2VydmljZXMvVXNlclNlcnZpY2UuanMiLCJtb2R1bGVzL1Nlc3Npb24uanMiLCJtb2R1bGVzL1V0aWxzLmpzIiwicXJzY2FubmVyL2h0bWw1LXFyY29kZS5taW4uanMiLCJxcnNjYW5uZXIvanNxcmNvZGUtY29tYmluZWQubWluLmpzIiwiYWRtaW4vY2hhbGxlbmdlL2FkbWluQ2hhbGxlbmdlQ3RybC5qcyIsImFkbWluL2NoYWxsZW5nZXMvYWRtaW5DaGFsbGVuZ2VzQ3RybC5qcyIsImFkbWluL21haWwvYWRtaW5NYWlsQ3RybC5qcyIsImFkbWluL21hcmtldGluZy9hZG1pbk1hcmtldGluZ0N0cmwuanMiLCJhZG1pbi9zZXR0aW5ncy9hZG1pblNldHRpbmdzQ3RybC5qcyIsImFkbWluL3N0YXRzL2FkbWluU3RhdHNDdHJsLmpzIiwiYWRtaW4vdGVhbXMvYWRtaW5UZWFtc0N0cmwuanMiLCJhZG1pbi91c2VyL2FkbWluVXNlckN0cmwuanMiLCJhZG1pbi91c2Vycy9hZG1pblVzZXJzQ3RybC5qcyIsIkJhc2VDdHJsLmpzIiwiYWRtaW4vYWRtaW5DdHJsLmpzIiwiYXBwbGljYXRpb24vYXBwbGljYXRpb25DdHJsLmpzIiwiY2hhbGxlbmdlcy9jaGFsbGVuZ2VzQ3RybC5qcyIsImNoZWNraW4vY2hlY2tpbkN0cmwuanMiLCJjb25maXJtYXRpb24vY29uZmlybWF0aW9uQ3RybC5qcyIsImRhc2hib2FyZC9kYXNoYm9hcmRDdHJsLmpzIiwiaG9tZS9Ib21lQ3RybC5qcyIsInJlc2V0L3Jlc2V0Q3RybC5qcyIsInNpZGViYXIvc2lkZWJhckN0cmwuanMiLCJsb2dpbi9sb2dpbkN0cmwuanMiLCJ0ZWFtL3RlYW1DdHJsLmpzIiwidmVyaWZ5L3ZlcmlmeUN0cmwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxNQUFBLFFBQUEsT0FBQSxPQUFBO0VBQ0E7RUFDQTtFQUNBOzs7QUFHQTtHQUNBLE9BQUE7SUFDQTtJQUNBLFNBQUEsY0FBQTs7O01BR0EsY0FBQSxhQUFBLEtBQUE7OztHQUdBLElBQUE7SUFDQTtJQUNBO0lBQ0EsU0FBQSxhQUFBLFFBQUE7OztNQUdBLElBQUEsUUFBQSxRQUFBO01BQ0EsSUFBQSxNQUFBO1FBQ0EsWUFBQSxlQUFBOzs7OztBQ3ZCQSxRQUFBLE9BQUE7S0FDQSxTQUFBLGNBQUE7UUFDQSxNQUFBOztLQUVBLFNBQUEsYUFBQTtRQUNBLFlBQUE7UUFDQSxrQkFBQTtRQUNBLFlBQUE7UUFDQSxpQkFBQTtRQUNBLFdBQUE7UUFDQSw2QkFBQTtRQUNBLHVCQUFBO1FBQ0EsZ0NBQUE7UUFDQSxtQ0FBQTtRQUNBLDZCQUFBO1FBQ0EsMEJBQUE7UUFDQSxVQUFBOztLQUVBLFNBQUEsT0FBQTtRQUNBLG9CQUFBOzs7O0FDbEJBLFFBQUEsT0FBQTtHQUNBLE9BQUE7SUFDQTtJQUNBO0lBQ0E7SUFDQTtNQUNBO01BQ0E7TUFDQSxtQkFBQTs7O0lBR0EsbUJBQUEsVUFBQTs7O0lBR0E7T0FDQSxNQUFBLFNBQUE7UUFDQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLFlBQUE7UUFDQSxNQUFBO1VBQ0EsY0FBQTtVQUNBLGVBQUE7O1FBRUEsU0FBQTtVQUNBLGdDQUFBLFNBQUEsZ0JBQUE7WUFDQSxPQUFBLGdCQUFBOzs7O09BSUEsTUFBQSxRQUFBO1FBQ0EsS0FBQTtRQUNBLGFBQUE7UUFDQSxZQUFBO1FBQ0EsTUFBQTtVQUNBLGNBQUE7VUFDQSxlQUFBOztRQUVBLFNBQUE7VUFDQSxnQ0FBQSxTQUFBLGdCQUFBO1lBQ0EsT0FBQSxnQkFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQW1CQSxNQUFBLE9BQUE7UUFDQSxPQUFBO1VBQ0EsSUFBQTtZQUNBLGFBQUE7WUFDQSxZQUFBOztVQUVBLGVBQUE7WUFDQSxhQUFBO1lBQ0EsWUFBQTtZQUNBLFNBQUE7Y0FDQSw4QkFBQSxTQUFBLGlCQUFBO2dCQUNBLE9BQUEsZ0JBQUE7Ozs7O1FBS0EsTUFBQTtVQUNBLGNBQUE7OztPQUdBLE1BQUEsaUJBQUE7UUFDQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLFlBQUE7UUFDQSxTQUFBO1VBQ0EsNkJBQUEsU0FBQSxZQUFBO1lBQ0EsT0FBQSxZQUFBOztVQUVBLDhCQUFBLFNBQUEsZ0JBQUE7WUFDQSxPQUFBLGdCQUFBOzs7O09BSUEsTUFBQSxtQkFBQTtRQUNBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsWUFBQTtRQUNBLE1BQUE7VUFDQSxpQkFBQTs7UUFFQSxTQUFBO1VBQ0EsNkJBQUEsU0FBQSxZQUFBO1lBQ0EsT0FBQSxZQUFBOztVQUVBLDhCQUFBLFNBQUEsZ0JBQUE7WUFDQSxPQUFBLGdCQUFBOzs7O09BSUEsTUFBQSxvQkFBQTtRQUNBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsWUFBQTtRQUNBLE1BQUE7VUFDQSxpQkFBQTs7UUFFQSxTQUFBO1VBQ0EsNkJBQUEsU0FBQSxZQUFBO1lBQ0EsT0FBQSxZQUFBOzs7O09BSUEsTUFBQSxrQkFBQTtRQUNBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsWUFBQTtRQUNBLE1BQUE7VUFDQSxpQkFBQTs7UUFFQSxTQUFBO1VBQ0EsNkJBQUEsU0FBQSxZQUFBO1lBQ0EsT0FBQSxZQUFBOztVQUVBLDhCQUFBLFNBQUEsZ0JBQUE7WUFDQSxPQUFBLGdCQUFBOzs7O09BSUEsTUFBQSxZQUFBO1FBQ0EsS0FBQTtRQUNBLGFBQUE7UUFDQSxZQUFBO1FBQ0EsTUFBQTtVQUNBLGlCQUFBOztRQUVBLFNBQUE7VUFDQSw2QkFBQSxTQUFBLFlBQUE7WUFDQSxPQUFBLFlBQUE7O1VBRUEsOEJBQUEsU0FBQSxnQkFBQTtZQUNBLE9BQUEsZ0JBQUE7Ozs7T0FJQSxNQUFBLGFBQUE7UUFDQSxPQUFBO1VBQ0EsSUFBQTtZQUNBLGFBQUE7WUFDQSxZQUFBOzs7UUFHQSxNQUFBO1VBQ0EsY0FBQTs7O09BR0EsTUFBQSxlQUFBO1FBQ0EsS0FBQTtRQUNBLGFBQUE7UUFDQSxZQUFBO1FBQ0EsTUFBQTtVQUNBLGtCQUFBOzs7T0FHQSxNQUFBLG1CQUFBO1FBQ0EsS0FBQTtRQUNBLGFBQUE7UUFDQSxZQUFBOztPQUVBLE1BQUEsa0JBQUE7UUFDQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLFlBQUE7O09BRUEsTUFBQSx3QkFBQTtRQUNBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsWUFBQTs7T0FFQSxNQUFBLHVCQUFBO1FBQ0EsS0FBQTtRQUNBLGFBQUE7UUFDQSxZQUFBO1FBQ0EsU0FBQTtVQUNBLGtEQUFBLFNBQUEsY0FBQSxpQkFBQTtZQUNBLE9BQUEsaUJBQUEsSUFBQSxhQUFBOzs7O09BSUEsTUFBQSx1QkFBQTtRQUNBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsWUFBQTs7T0FFQSxNQUFBLG1CQUFBO1FBQ0EsS0FBQTtVQUNBO1VBQ0E7VUFDQTtRQUNBLGFBQUE7UUFDQSxZQUFBOztPQUVBLE1BQUEsa0JBQUE7UUFDQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLFlBQUE7UUFDQSxTQUFBO1VBQ0Esd0NBQUEsU0FBQSxjQUFBLFlBQUE7WUFDQSxPQUFBLFlBQUEsSUFBQSxhQUFBOzs7O09BSUEsTUFBQSxzQkFBQTtRQUNBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsWUFBQTs7T0FFQSxNQUFBLG1CQUFBO1FBQ0EsS0FBQTtRQUNBLGFBQUE7UUFDQSxZQUFBO1FBQ0EsTUFBQTtVQUNBLGlCQUFBOztRQUVBLFNBQUE7VUFDQSw2QkFBQSxTQUFBLFlBQUE7WUFDQSxPQUFBLFlBQUE7O1VBRUEsOEJBQUEsU0FBQSxnQkFBQTtZQUNBLE9BQUEsZ0JBQUE7Ozs7T0FJQSxNQUFBLFNBQUE7UUFDQSxLQUFBO1FBQ0EsYUFBQTtRQUNBLFlBQUE7UUFDQSxNQUFBO1VBQ0EsY0FBQTs7O09BR0EsTUFBQSxVQUFBO1FBQ0EsS0FBQTtRQUNBLGFBQUE7UUFDQSxZQUFBO1FBQ0EsTUFBQTtVQUNBLGNBQUE7OztPQUdBLE1BQUEsT0FBQTtRQUNBLEtBQUE7UUFDQSxhQUFBO1FBQ0EsTUFBQTtVQUNBLGNBQUE7Ozs7SUFJQSxrQkFBQSxVQUFBO01BQ0EsU0FBQTs7OztHQUlBLElBQUE7SUFDQTtJQUNBO0lBQ0E7SUFDQTtNQUNBO01BQ0E7TUFDQSxTQUFBOztNQUVBLFdBQUEsSUFBQSx1QkFBQSxXQUFBO1NBQ0EsU0FBQSxLQUFBLFlBQUEsU0FBQSxnQkFBQSxZQUFBOzs7TUFHQSxXQUFBLElBQUEscUJBQUEsVUFBQSxPQUFBLFNBQUEsVUFBQTs7UUFFQSxJQUFBLGVBQUEsUUFBQSxLQUFBO1FBQ0EsSUFBQSxnQkFBQSxRQUFBLEtBQUE7UUFDQSxJQUFBLGVBQUEsUUFBQSxLQUFBO1FBQ0EsSUFBQSxtQkFBQSxRQUFBLEtBQUE7UUFDQSxJQUFBLGtCQUFBLFFBQUEsS0FBQTtRQUNBLElBQUEsa0JBQUEsUUFBQSxLQUFBOztRQUVBLElBQUEsZ0JBQUEsQ0FBQSxRQUFBLFlBQUE7VUFDQSxNQUFBO1VBQ0EsT0FBQSxHQUFBOzs7UUFHQSxJQUFBLGlCQUFBLFFBQUEsWUFBQTtVQUNBLE1BQUE7VUFDQSxPQUFBLEdBQUE7OztRQUdBLElBQUEsZ0JBQUEsQ0FBQSxRQUFBLFVBQUEsT0FBQTtVQUNBLE1BQUE7VUFDQSxPQUFBLEdBQUE7OztRQUdBLElBQUEsb0JBQUEsQ0FBQSxRQUFBLFVBQUEsYUFBQSxnQkFBQSxDQUFBLFFBQUEsVUFBQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLE9BQUEsR0FBQTs7O1FBR0EsSUFBQSxtQkFBQSxDQUFBLFFBQUEsVUFBQSxVQUFBO1VBQ0EsTUFBQTtVQUNBLE9BQUEsR0FBQTs7O1FBR0EsSUFBQSxtQkFBQSxDQUFBLFFBQUEsVUFBQSxPQUFBLFVBQUE7VUFDQSxNQUFBO1VBQ0EsT0FBQSxHQUFBOzs7Ozs7OztBQy9UQSxRQUFBLE9BQUE7R0FDQSxRQUFBLG1CQUFBO0lBQ0E7SUFDQSxTQUFBLFFBQUE7TUFDQSxPQUFBO1VBQ0EsU0FBQSxTQUFBLE9BQUE7WUFDQSxJQUFBLFFBQUEsUUFBQTtZQUNBLElBQUEsTUFBQTtjQUNBLE9BQUEsUUFBQSxvQkFBQTs7WUFFQSxPQUFBOzs7OztBQ1ZBLFFBQUEsT0FBQTtHQUNBLFFBQUEsZUFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLE9BQUEsWUFBQSxRQUFBLFNBQUEsU0FBQTtNQUNBLElBQUEsY0FBQTs7TUFFQSxTQUFBLGFBQUEsTUFBQSxJQUFBLFVBQUE7O1FBRUEsR0FBQSxDQUFBLFdBQUEsQ0FBQSxRQUFBLE9BQUEsS0FBQSxPQUFBLEtBQUE7O1FBRUEsSUFBQSxHQUFBO1VBQ0EsR0FBQSxLQUFBOzs7O01BSUEsU0FBQSxhQUFBLE1BQUEsSUFBQSxVQUFBO1FBQ0EsR0FBQSxDQUFBLFdBQUEsQ0FBQSxPQUFBLEdBQUE7UUFDQSxJQUFBLElBQUE7VUFDQSxHQUFBOzs7O01BSUEsWUFBQSxvQkFBQSxTQUFBLE9BQUEsVUFBQSxXQUFBLFdBQUE7UUFDQSxPQUFBO1dBQ0EsS0FBQSxlQUFBO1lBQ0EsT0FBQTtZQUNBLFVBQUE7O1dBRUEsS0FBQTs7YUFFQTs7Ozs7TUFLQSxZQUFBLGlCQUFBLFNBQUEsT0FBQSxXQUFBLFVBQUE7UUFDQSxPQUFBO1dBQ0EsS0FBQSxlQUFBO1lBQ0EsT0FBQTs7V0FFQSxLQUFBOzthQUVBOzs7Ozs7O01BT0EsWUFBQSxTQUFBLFNBQUEsVUFBQTs7UUFFQSxRQUFBLFFBQUE7UUFDQSxPQUFBLEdBQUE7OztNQUdBLFlBQUEsV0FBQSxTQUFBLE9BQUEsVUFBQSxXQUFBLFdBQUEsV0FBQTtRQUNBLE9BQUE7V0FDQSxLQUFBLGtCQUFBO1lBQ0EsT0FBQTtZQUNBLFVBQUE7WUFDQSxXQUFBOztXQUVBLEtBQUE7O2FBRUE7Ozs7O01BS0EsWUFBQSxTQUFBLFNBQUEsT0FBQSxXQUFBLFdBQUE7UUFDQSxPQUFBO1dBQ0EsSUFBQSxrQkFBQTtXQUNBLEtBQUE7Ozs7O2FBS0E7Ozs7Ozs7TUFPQSxZQUFBLDBCQUFBLFNBQUEsV0FBQSxVQUFBO1FBQ0EsT0FBQTtXQUNBLEtBQUEsdUJBQUE7WUFDQSxJQUFBLFFBQUE7Ozs7TUFJQSxZQUFBLGlCQUFBLFNBQUEsTUFBQTtRQUNBLE9BQUE7V0FDQSxLQUFBLGVBQUE7WUFDQSxPQUFBOzs7O01BSUEsWUFBQSxnQkFBQSxTQUFBLE9BQUEsTUFBQSxXQUFBLFVBQUE7UUFDQSxPQUFBO1dBQ0EsS0FBQSx3QkFBQTtZQUNBLE9BQUE7WUFDQSxVQUFBOztXQUVBLEtBQUEsV0FBQTs7O01BR0EsT0FBQTs7OztBQy9HQSxRQUFBLE9BQUEsT0FBQSxRQUFBLG9CQUFBO0lBQ0E7SUFDQSxTQUFBLE9BQUE7TUFDQSxJQUFBLGFBQUE7TUFDQSxJQUFBLE9BQUEsYUFBQTs7TUFFQSxPQUFBOzs7OztRQUtBLFFBQUEsU0FBQSxPQUFBO1lBQ0EsT0FBQSxNQUFBLEtBQUEsYUFBQSxXQUFBO2NBQ0EsT0FBQTs7Ozs7UUFLQSxRQUFBLFNBQUEsSUFBQSxPQUFBO1lBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBLFdBQUE7Y0FDQSxPQUFBOzs7OztRQUtBLFFBQUEsU0FBQSxJQUFBO1lBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7UUFHQSxLQUFBLFNBQUEsSUFBQTtZQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUE7OztRQUdBLFFBQUEsV0FBQTtZQUNBLE9BQUEsTUFBQSxJQUFBOzs7UUFHQSxXQUFBLFNBQUEsSUFBQTtVQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsS0FBQTs7Ozs7Ozs7QUN0Q0EsUUFBQSxPQUFBLE9BQUEsUUFBQSxvQkFBQTtJQUNBO0lBQ0EsU0FBQSxPQUFBO01BQ0EsSUFBQSxZQUFBO01BQ0EsSUFBQSxPQUFBLFlBQUE7O01BRUEsT0FBQTs7Ozs7UUFLQSxZQUFBLFNBQUEsVUFBQTtZQUNBLE9BQUEsTUFBQSxLQUFBLFlBQUEsZUFBQTtjQUNBLFVBQUE7Ozs7UUFJQSxRQUFBLFdBQUE7WUFDQSxPQUFBLE1BQUEsSUFBQTs7O1FBR0Esa0JBQUEsU0FBQSxTQUFBLFNBQUE7VUFDQSxPQUFBLE1BQUEsS0FBQSxZQUFBLGVBQUE7WUFDQSxVQUFBO1lBQ0EsVUFBQTs7Ozs7Ozs7QUN4QkEsUUFBQSxPQUFBO0dBQ0EsUUFBQSxtQkFBQTtFQUNBO0VBQ0EsU0FBQSxNQUFBOztJQUVBLElBQUEsT0FBQTs7SUFFQSxPQUFBO01BQ0EsbUJBQUEsVUFBQTtRQUNBLE9BQUEsTUFBQSxJQUFBOztNQUVBLHlCQUFBLFNBQUEsTUFBQSxNQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQSxTQUFBO1VBQ0EsVUFBQTtVQUNBLFdBQUE7OztNQUdBLHdCQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsY0FBQTtVQUNBLE1BQUE7OztNQUdBLGtCQUFBLFNBQUEsTUFBQSxJQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQSxjQUFBO1VBQ0EsV0FBQTtVQUNBLFNBQUE7OztNQUdBLHNCQUFBLFVBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBOztNQUVBLHlCQUFBLFNBQUEsT0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsYUFBQTtVQUNBLFFBQUE7OztNQUdBLG9CQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsWUFBQTtVQUNBLE1BQUE7OztNQUdBLHNCQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsY0FBQTtVQUNBLE1BQUE7Ozs7TUFJQSxrQkFBQSxTQUFBLFdBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBLGNBQUE7VUFDQSxZQUFBOzs7O01BSUEsd0JBQUEsU0FBQSxLQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQSxnQkFBQTtVQUNBLE1BQUE7OztNQUdBLG1CQUFBLFNBQUEsWUFBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsVUFBQTtVQUNBLGFBQUE7Ozs7Ozs7O0FDNURBLFFBQUEsT0FBQSxPQUFBLFFBQUEsb0JBQUE7SUFDQTtJQUNBLFNBQUEsT0FBQTtNQUNBLElBQUEsTUFBQTtNQUNBLElBQUEsT0FBQSxNQUFBOzs7TUFHQSxPQUFBOzs7OztRQUtBLE9BQUEsU0FBQSxXQUFBLE1BQUEsUUFBQSxXQUFBLFdBQUE7WUFDQSxPQUFBLE1BQUEsS0FBQSxNQUFBLFVBQUE7Z0JBQ0EsV0FBQTtnQkFDQSxPQUFBO2dCQUNBLFNBQUE7O2FBRUEsS0FBQTs7ZUFFQTs7Ozs7UUFLQSxRQUFBLFdBQUE7WUFDQSxPQUFBLE1BQUEsSUFBQTs7Ozs7OztBQzFCQSxRQUFBLE9BQUEsT0FBQSxRQUFBLGVBQUE7SUFDQTtJQUNBLFNBQUEsT0FBQTtNQUNBLElBQUEsUUFBQTtNQUNBLElBQUEsT0FBQSxRQUFBOztNQUVBLE9BQUE7Ozs7O1FBS0EsUUFBQSxTQUFBLFVBQUE7WUFDQSxPQUFBLE1BQUEsS0FBQSxRQUFBLFdBQUE7Y0FDQSxVQUFBOzs7O1FBSUEsUUFBQSxXQUFBO1VBQ0EsT0FBQSxNQUFBLElBQUE7OztRQUdBLFFBQUEsU0FBQSxJQUFBLE9BQUE7VUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUEsV0FBQTtZQUNBLE9BQUE7Ozs7UUFJQSxNQUFBLFNBQUEsSUFBQSxTQUFBO1VBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBLGFBQUE7WUFDQSxnQkFBQTs7OztRQUlBLFlBQUEsU0FBQSxJQUFBLE9BQUEsTUFBQTtVQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUE7V0FDQSxLQUFBOzs7Ozs7Ozs7Ozs7O1FBYUEsY0FBQSxTQUFBLElBQUEsUUFBQSxhQUFBO1VBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQTtXQUNBLEtBQUE7Ozs7Ozs7Ozs7OztRQVlBLGNBQUEsU0FBQSxJQUFBLE9BQUEsUUFBQTtVQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUE7V0FDQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBc0JBLFFBQUEsU0FBQSxJQUFBO1lBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7UUFHQSxLQUFBLFNBQUEsSUFBQTtVQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUE7OztRQUdBLGlCQUFBLFNBQUEsSUFBQSxRQUFBO1VBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBLG9CQUFBO1lBQ0EsUUFBQTs7OztRQUlBLGdCQUFBLFNBQUEsSUFBQSxRQUFBO1VBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBLG1CQUFBO1lBQ0EsUUFBQTs7OztRQUlBLGtCQUFBLFNBQUEsS0FBQSxlQUFBO1VBQ0EsT0FBQSxNQUFBLEtBQUEsUUFBQSxNQUFBLEVBQUEsTUFBQTtnQkFDQSxNQUFBO2dCQUNBLFFBQUE7Z0JBQ0EsZUFBQSxnQkFBQSxnQkFBQTs7Ozs7Ozs7Ozs7QUM5R0EsUUFBQSxPQUFBLE9BQUEsUUFBQSxlQUFBO0VBQ0E7RUFDQTtFQUNBLFVBQUEsT0FBQSxTQUFBO0lBQ0EsSUFBQSxRQUFBO0lBQ0EsSUFBQSxPQUFBLFFBQUE7O0lBRUEsT0FBQTs7OztNQUlBLGdCQUFBLFlBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBLFFBQUE7OztNQUdBLEtBQUEsVUFBQSxJQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQTs7O01BR0EsUUFBQSxZQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUE7OztNQUdBLFNBQUEsVUFBQSxNQUFBLE1BQUEsTUFBQSxlQUFBLGtCQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsUUFBQSxNQUFBLEVBQUEsTUFBQTtVQUNBLE1BQUE7VUFDQSxNQUFBLE9BQUEsT0FBQTtVQUNBLE1BQUEsT0FBQSxPQUFBO1VBQ0EsZUFBQSxnQkFBQSxnQkFBQTtVQUNBLGtCQUFBLG1CQUFBLG1CQUFBOzs7Ozs7TUFNQSxVQUFBLFVBQUEsT0FBQTtRQUNBLElBQUEsS0FBQSxJQUFBO1FBQ0EsR0FBQSxPQUFBLE1BQUEsTUFBQSxJQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsaUNBQUEsSUFBQTtVQUNBLGtCQUFBLFFBQUE7VUFDQSxTQUFBLEVBQUEsZ0JBQUE7Ozs7TUFJQSxlQUFBLFVBQUEsSUFBQSxTQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQSxLQUFBLFlBQUE7VUFDQSxTQUFBOzs7O01BSUEsb0JBQUEsVUFBQSxJQUFBLGNBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBLEtBQUEsWUFBQTtVQUNBLGNBQUE7Ozs7TUFJQSxXQUFBLFVBQUEsSUFBQSxNQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQSxLQUFBLGNBQUE7VUFDQSxNQUFBOzs7O01BSUEsa0JBQUEsVUFBQSxJQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7Ozs7O01BT0EsVUFBQSxZQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQTs7O01BR0EsY0FBQSxZQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQTs7O01BR0EsYUFBQSxZQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQTs7O01BR0EsV0FBQSxVQUFBLElBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUE7O01BRUEsWUFBQSxVQUFBLElBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUE7O01BRUEsZ0JBQUEsVUFBQSxJQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7TUFHQSx3QkFBQSxVQUFBLElBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUE7OztNQUdBLGdCQUFBLFVBQUEsSUFBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQTs7O01BR0EsZUFBQSxVQUFBLElBQUEsT0FBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQSxrQkFBQSxLQUFBLFVBQUE7OztNQUdBLFNBQUEsVUFBQSxJQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7TUFHQSxVQUFBLFVBQUEsSUFBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQTs7O01BR0EsWUFBQSxVQUFBLElBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUE7OztNQUdBLGlCQUFBLFVBQUEsSUFBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQTs7O01BR0EsV0FBQSxVQUFBLElBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUE7OztNQUdBLGFBQUEsVUFBQSxJQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7TUFHQSxZQUFBLFlBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBOzs7TUFHQSxtQkFBQSxZQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQTs7O01BR0EsdUJBQUEsWUFBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUE7OztNQUdBLGdCQUFBLFlBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBOzs7TUFHQSx1QkFBQSxZQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQTs7O01BR0EsUUFBQSxVQUFBLElBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUE7OztNQUdBLGtCQUFBLFlBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBOzs7TUFHQSxrQkFBQSxZQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQTs7O01BR0Esc0JBQUEsWUFBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUE7OztNQUdBLGlCQUFBLFVBQUEsSUFBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQTs7O01BR0Esd0JBQUEsVUFBQSxPQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxrQkFBQSxFQUFBLE9BQUE7Ozs7Ozs7OztBQ3pLQSxRQUFBLE9BQUE7R0FDQSxRQUFBLFdBQUE7SUFDQTtJQUNBO0lBQ0EsU0FBQSxZQUFBLFFBQUE7O0lBRUEsS0FBQSxTQUFBLFNBQUEsT0FBQSxLQUFBO01BQ0EsUUFBQSxhQUFBLE1BQUE7TUFDQSxRQUFBLGFBQUEsU0FBQSxLQUFBO01BQ0EsUUFBQSxhQUFBLGNBQUEsS0FBQSxVQUFBO01BQ0EsV0FBQSxjQUFBOzs7SUFHQSxLQUFBLFVBQUEsU0FBQSxXQUFBO01BQ0EsT0FBQSxRQUFBLGFBQUE7TUFDQSxPQUFBLFFBQUEsYUFBQTtNQUNBLE9BQUEsUUFBQSxhQUFBO01BQ0EsV0FBQSxjQUFBO01BQ0EsSUFBQSxXQUFBO1FBQ0E7Ozs7SUFJQSxLQUFBLFdBQUEsVUFBQTtNQUNBLE9BQUEsUUFBQSxhQUFBOzs7SUFHQSxLQUFBLFlBQUEsVUFBQTtNQUNBLE9BQUEsUUFBQSxhQUFBOzs7SUFHQSxLQUFBLFVBQUEsVUFBQTtNQUNBLE9BQUEsS0FBQSxNQUFBLFFBQUEsYUFBQTs7O0lBR0EsS0FBQSxVQUFBLFNBQUEsS0FBQTtNQUNBLFFBQUEsYUFBQSxjQUFBLEtBQUEsVUFBQTtNQUNBLFdBQUEsY0FBQTs7OztBQ3JDQSxRQUFBLE9BQUE7R0FDQSxRQUFBLFNBQUE7SUFDQSxVQUFBO01BQ0EsT0FBQTtRQUNBLFdBQUEsU0FBQSxTQUFBO1VBQ0EsT0FBQSxLQUFBLFFBQUEsU0FBQSxZQUFBLEtBQUEsUUFBQSxTQUFBOztRQUVBLFNBQUEsU0FBQSxLQUFBO1VBQ0EsT0FBQSxLQUFBLFFBQUE7O1FBRUEsWUFBQSxTQUFBLEtBQUE7O1VBRUEsSUFBQSxDQUFBLEtBQUE7WUFDQSxPQUFBOzs7VUFHQSxPQUFBLElBQUEsS0FBQTs7VUFFQSxPQUFBLE9BQUEsTUFBQSxPQUFBLE1BQUEsT0FBQTtZQUNBLE1BQUEsS0FBQSxlQUFBLE1BQUEsS0FBQTs7Ozs7O0FDbkJBLENBQUEsU0FBQSxHQUFBO0lBQ0EsT0FBQSxHQUFBLE9BQUE7UUFDQSxjQUFBLFNBQUEsZUFBQSxhQUFBLFlBQUE7WUFDQSxPQUFBLEtBQUEsS0FBQSxXQUFBO2dCQUNBLElBQUEsY0FBQSxFQUFBOztnQkFFQSxJQUFBLFNBQUEsWUFBQTtnQkFDQSxJQUFBLFFBQUEsWUFBQTs7Z0JBRUEsSUFBQSxVQUFBLE1BQUE7b0JBQ0EsU0FBQTs7O2dCQUdBLElBQUEsU0FBQSxNQUFBO29CQUNBLFFBQUE7Ozs7Z0JBSUEsSUFBQSxVQUFBLEVBQUEsbUJBQUEsUUFBQSxpQkFBQSxTQUFBLHFDQUFBLFNBQUE7Z0JBQ0EsSUFBQSxhQUFBLEVBQUEsb0NBQUEsUUFBQSxLQUFBLGtCQUFBLFNBQUEsS0FBQSx1Q0FBQSxTQUFBOztnQkFFQSxJQUFBLFFBQUEsUUFBQTtnQkFDQSxJQUFBLFNBQUEsV0FBQTtnQkFDQSxJQUFBLFVBQUEsT0FBQSxXQUFBO2dCQUNBLElBQUE7O2dCQUVBLElBQUEsT0FBQSxXQUFBO29CQUNBLElBQUEsa0JBQUE7d0JBQ0EsUUFBQSxVQUFBLE9BQUEsR0FBQSxHQUFBLEtBQUE7O3dCQUVBLElBQUE7NEJBQ0EsT0FBQTswQkFDQSxPQUFBLEdBQUE7NEJBQ0EsWUFBQSxHQUFBOzs7d0JBR0EsRUFBQSxLQUFBLFlBQUEsSUFBQSxXQUFBLFdBQUEsTUFBQTs7MkJBRUE7d0JBQ0EsRUFBQSxLQUFBLFlBQUEsSUFBQSxXQUFBLFdBQUEsTUFBQTs7OztnQkFJQSxPQUFBLE1BQUEsT0FBQSxPQUFBLE9BQUEsYUFBQSxPQUFBLFVBQUEsT0FBQTtnQkFDQSxVQUFBLGVBQUEsVUFBQSxnQkFBQSxVQUFBLHNCQUFBLFVBQUEsbUJBQUEsVUFBQTs7Z0JBRUEsSUFBQSxrQkFBQSxTQUFBLFFBQUE7O29CQUVBLE1BQUEsWUFBQTtvQkFDQSxtQkFBQTtvQkFDQSxFQUFBLEtBQUEsWUFBQSxJQUFBLFVBQUE7O29CQUVBLE1BQUE7b0JBQ0EsRUFBQSxLQUFBLFlBQUEsSUFBQSxXQUFBLFdBQUEsTUFBQTs7OztnQkFJQSxJQUFBLFVBQUEsY0FBQTtvQkFDQSxVQUFBLGFBQUEsQ0FBQSxPQUFBLEVBQUEsWUFBQSxtQkFBQSxpQkFBQSxTQUFBLE9BQUE7d0JBQ0EsV0FBQSxPQUFBOzt1QkFFQTtvQkFDQSxRQUFBLElBQUE7Ozs7Z0JBSUEsT0FBQSxXQUFBLFVBQUEsUUFBQTtvQkFDQSxjQUFBLFFBQUE7Ozs7UUFJQSxtQkFBQSxXQUFBO1lBQ0EsT0FBQSxLQUFBLEtBQUEsV0FBQTs7Z0JBRUEsRUFBQSxNQUFBLEtBQUEsVUFBQSxpQkFBQSxRQUFBLFNBQUEsWUFBQTtvQkFDQSxXQUFBOzs7Z0JBR0EsYUFBQSxFQUFBLE1BQUEsS0FBQTs7OztHQUlBOzs7QUNsRkEsU0FBQSxJQUFBLE1BQUEsY0FBQSxDQUFBLEtBQUEsTUFBQSxNQUFBLEtBQUEsY0FBQSxjQUFBLEtBQUEsaUJBQUEsUUFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLFFBQUEsS0FBQSxpQkFBQSxnQkFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLGdCQUFBLFNBQUEsU0FBQSxvQkFBQSxVQUFBLFVBQUEsQ0FBQSxLQUFBLG9CQUFBLG9CQUFBLFVBQUEsS0FBQSxTQUFBLElBQUEsTUFBQSxVQUFBLFdBQUEsS0FBQSxTQUFBLElBQUEsTUFBQSxXQUFBLEtBQUEsaUJBQUEsc0JBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxzQkFBQSxLQUFBLGlCQUFBLG1CQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsb0JBQUEsS0FBQSxZQUFBLEtBQUEsaUJBQUEsWUFBQSxVQUFBLENBQUEsSUFBQSxJQUFBLE1BQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxLQUFBLFNBQUEsT0FBQSxJQUFBLE9BQUEsS0FBQSxTQUFBLEdBQUEsT0FBQSxPQUFBLFFBQUEsS0FBQSxZQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsVUFBQSxTQUFBLFFBQUEsY0FBQSx3QkFBQSxVQUFBLFVBQUEsVUFBQSxVQUFBLENBQUEsS0FBQSxjQUFBLGNBQUEsS0FBQSx3QkFBQSx3QkFBQSxLQUFBLFNBQUEsSUFBQSxNQUFBLFVBQUEsVUFBQSxVQUFBLFdBQUEsSUFBQSxJQUFBLE1BQUEsRUFBQSxZQUFBLFVBQUEsb0JBQUEsU0FBQSxVQUFBLGNBQUEsRUFBQSxFQUFBLEVBQUEsU0FBQSxPQUFBLElBQUEsQ0FBQSxJQUFBLFFBQUEsU0FBQSxHQUFBLE9BQUEsUUFBQSxPQUFBLFFBQUEsY0FBQSxhQUFBLEtBQUEsZUFBQSxNQUFBLEtBQUEsaUJBQUEsZ0JBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxnQkFBQSxLQUFBLGlCQUFBLDBCQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsMEJBQUEsS0FBQSxpQkFBQSxpQkFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLGlCQUFBLEtBQUEsaUJBQUEsc0JBQUEsVUFBQSxDQUFBLE9BQUEsR0FBQSxFQUFBLEtBQUEsZ0JBQUEsS0FBQSxxQkFBQSxVQUFBLENBQUEsSUFBQSxVQUFBLEtBQUEsb0JBQUEsVUFBQSxJQUFBLFVBQUEsV0FBQSxVQUFBLFVBQUEsRUFBQSxFQUFBLEVBQUEsR0FBQSxVQUFBLFVBQUEsVUFBQSxFQUFBLEVBQUEsRUFBQSxHQUFBLFVBQUEsVUFBQSxFQUFBLFVBQUEsRUFBQSxFQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsS0FBQSx3QkFBQSxPQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLHdCQUFBLEdBQUEsRUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsR0FBQSxJQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsR0FBQSxHQUFBLEdBQUEsVUFBQSxVQUFBLEtBQUEsd0JBQUEsR0FBQSxFQUFBLEVBQUEsRUFBQSxHQUFBLE9BQUEsVUFBQSxVQUFBLEVBQUEsRUFBQSxFQUFBLFVBQUEsSUFBQSxVQUFBLFVBQUEsRUFBQSxFQUFBLFVBQUEsR0FBQSxHQUFBLEtBQUEsY0FBQSxJQUFBLFVBQUEsVUFBQSxVQUFBLEdBQUEsRUFBQSxFQUFBLEdBQUEsVUFBQSxVQUFBLEVBQUEsVUFBQSxHQUFBLEVBQUEsSUFBQSxXQUFBLEtBQUEsb0JBQUEsU0FBQSxRQUFBLENBQUEsT0FBQSxLQUFBLFNBQUEsUUFBQSxZQUFBLFNBQUEsZUFBQSxDQUFBLE9BQUEsSUFBQSxNQUFBLElBQUEsUUFBQSxFQUFBLElBQUEsTUFBQSxJQUFBLFNBQUEsRUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsUUFBQSxFQUFBLElBQUEsTUFBQSxFQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFFBQUEsRUFBQSxJQUFBLE1BQUEsRUFBQSxJQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxRQUFBLEVBQUEsSUFBQSxNQUFBLEVBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsUUFBQSxFQUFBLElBQUEsTUFBQSxFQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxRQUFBLEVBQUEsSUFBQSxNQUFBLEVBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsUUFBQSxFQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFFBQUEsRUFBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFFBQUEsRUFBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxJQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxJQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxJQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxJQUFBLEVBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxNQUFBLElBQUEsUUFBQSxHQUFBLElBQUEsTUFBQSxFQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsTUFBQSxJQUFBLFFBQUEsR0FBQSxJQUFBLE1BQUEsRUFBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLElBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxRQUFBLEdBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxNQUFBLElBQUEsU0FBQSxHQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsS0FBQSxJQUFBLFNBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxTQUFBLEdBQUEsSUFBQSxJQUFBLEdBQUEsSUFBQSxJQUFBLElBQUEsR0FBQSxPQUFBLFNBQUEscUJBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsQ0FBQSxLQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsSUFBQSxLQUFBLGlCQUFBLFNBQUEsT0FBQSxDQUFBLElBQUEsSUFBQSxJQUFBLE9BQUEsT0FBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsSUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLEdBQUEsRUFBQSxDQUFBLElBQUEsRUFBQSxPQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUEsR0FBQSxZQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxPQUFBLEdBQUEsQ0FBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsWUFBQSxPQUFBLEVBQUEsR0FBQSxDQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsS0FBQSxjQUFBLEtBQUEsaUJBQUEsU0FBQSxRQUFBLFFBQUEsQ0FBQSxJQUFBLElBQUEsRUFBQSxRQUFBLE9BQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxJQUFBLENBQUEsSUFBQSxFQUFBLFFBQUEsR0FBQSxFQUFBLFFBQUEsR0FBQSxZQUFBLEtBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxFQUFBLEtBQUEsSUFBQSxRQUFBLEdBQUEsQ0FBQSxLQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsWUFBQSxRQUFBLEdBQUEsQ0FBQSxLQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsY0FBQSxLQUFBLGFBQUEsVUFBQSxDQUFBLE9BQUEsSUFBQSxxQkFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsSUFBQSxLQUFBLElBQUEsS0FBQSxJQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUEsU0FBQSxNQUFBLENBQUEsT0FBQSxJQUFBLHFCQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxJQUFBLEtBQUEsSUFBQSxNQUFBLElBQUEsS0FBQSxJQUFBLE1BQUEsSUFBQSxLQUFBLElBQUEsTUFBQSxNQUFBLFNBQUEsZUFBQSxLQUFBLE9BQUEsQ0FBQSxLQUFBLEtBQUEsS0FBQSxLQUFBLE9BQUEsT0FBQSxTQUFBLFNBQUEsTUFBQSxDQUFBLEtBQUEsTUFBQSxNQUFBLEtBQUEsb0JBQUEsS0FBQSxLQUFBLHlCQUFBLFNBQUEsTUFBQSxNQUFBLElBQUEsSUFBQSxDQUFBLElBQUEsTUFBQSxLQUFBLElBQUEsSUFBQSxPQUFBLEtBQUEsSUFBQSxJQUFBLE9BQUEsR0FBQSxNQUFBLENBQUEsSUFBQSxLQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsS0FBQSxLQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsS0FBQSxJQUFBLElBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxPQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsT0FBQSxNQUFBLENBQUEsSUFBQSxFQUFBLE1BQUEsSUFBQSxNQUFBLEVBQUEsQ0FBQSxFQUFBLE1BQUEsSUFBQSxNQUFBLEVBQUEsQ0FBQSxFQUFBLE1BQUEsRUFBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLEdBQUEsSUFBQSxHQUFBLE1BQUEsQ0FBQSxJQUFBLE1BQUEsTUFBQSxFQUFBLEVBQUEsTUFBQSxNQUFBLEVBQUEsRUFBQSxHQUFBLEdBQUEsTUFBQSxLQUFBLE1BQUEsTUFBQSxNQUFBLE9BQUEsUUFBQSxRQUFBLEtBQUEsTUFBQSxNQUFBLE1BQUEsT0FBQSxRQUFBLFFBQUEsR0FBQSxNQUFBLENBQUEsSUFBQSxNQUFBLEVBQUEsTUFBQSxNQUFBLEVBQUEsTUFBQSxPQUFBLEtBQUEsS0FBQSxNQUFBLE1BQUEsTUFBQSxPQUFBLEdBQUEsT0FBQSxHQUFBLE1BQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxJQUFBLE1BQUEsR0FBQSxNQUFBLE9BQUEsSUFBQSxJQUFBLE9BQUEsSUFBQSxNQUFBLE9BQUEsSUFBQSxNQUFBLE9BQUEsS0FBQSxLQUFBLE9BQUEsT0FBQSxPQUFBLFNBQUEsS0FBQSxpQ0FBQSxTQUFBLE1BQUEsTUFBQSxJQUFBLElBQUEsQ0FBQSxJQUFBLE9BQUEsS0FBQSx5QkFBQSxNQUFBLE1BQUEsSUFBQSxLQUFBLE1BQUEsRUFBQSxTQUFBLE9BQUEsSUFBQSxPQUFBLEVBQUEsVUFBQSxNQUFBLE9BQUEsTUFBQSxVQUFBLFNBQUEsR0FBQSxVQUFBLE9BQUEsUUFBQSxNQUFBLENBQUEsT0FBQSxNQUFBLEVBQUEsUUFBQSxTQUFBLE9BQUEsU0FBQSxPQUFBLE1BQUEsR0FBQSxJQUFBLFNBQUEsS0FBQSxNQUFBLE1BQUEsQ0FBQSxJQUFBLE9BQUEsT0FBQSxPQUFBLE1BQUEsRUFBQSxFQUFBLFVBQUEsTUFBQSxPQUFBLE1BQUEsVUFBQSxTQUFBLEdBQUEsVUFBQSxPQUFBLFNBQUEsTUFBQSxDQUFBLE9BQUEsT0FBQSxFQUFBLFFBQUEsU0FBQSxPQUFBLFNBQUEsT0FBQSxPQUFBLEdBQUEsU0FBQSxLQUFBLE1BQUEsTUFBQSxDQUFBLFNBQUEsT0FBQSxPQUFBLFFBQUEsS0FBQSx5QkFBQSxNQUFBLE1BQUEsU0FBQSxVQUFBLE9BQUEsR0FBQSxLQUFBLDBCQUFBLFNBQUEsUUFBQSxhQUFBLENBQUEsSUFBQSxlQUFBLEtBQUEsaUNBQUEsS0FBQSxNQUFBLFFBQUEsR0FBQSxLQUFBLE1BQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxhQUFBLEdBQUEsS0FBQSxNQUFBLGFBQUEsSUFBQSxlQUFBLEtBQUEsaUNBQUEsS0FBQSxNQUFBLGFBQUEsR0FBQSxLQUFBLE1BQUEsYUFBQSxHQUFBLEtBQUEsTUFBQSxRQUFBLEdBQUEsS0FBQSxNQUFBLFFBQUEsSUFBQSxPQUFBLE1BQUEsZ0JBQUEsZUFBQSxFQUFBLE1BQUEsZ0JBQUEsZUFBQSxFQUFBLENBQUEsZUFBQSxnQkFBQSxJQUFBLEtBQUEsb0JBQUEsU0FBQSxRQUFBLFNBQUEsV0FBQSxDQUFBLE1BQUEsQ0FBQSxLQUFBLDBCQUFBLFFBQUEsVUFBQSxLQUFBLDBCQUFBLFFBQUEsYUFBQSxHQUFBLEtBQUEsU0FBQSxTQUFBLFNBQUEsU0FBQSxDQUFBLE9BQUEsTUFBQSxTQUFBLEVBQUEsU0FBQSxFQUFBLE1BQUEsU0FBQSxFQUFBLFNBQUEsRUFBQSxLQUFBLEtBQUEsTUFBQSxNQUFBLE1BQUEsUUFBQSxLQUFBLGlCQUFBLFNBQUEsUUFBQSxTQUFBLFdBQUEsV0FBQSxDQUFBLElBQUEscUJBQUEsS0FBQSxNQUFBLEtBQUEsU0FBQSxRQUFBLFVBQUEsWUFBQSxxQkFBQSxLQUFBLE1BQUEsS0FBQSxTQUFBLFFBQUEsWUFBQSxZQUFBLFVBQUEsQ0FBQSxxQkFBQSxzQkFBQSxHQUFBLEVBQUEsT0FBQSxFQUFBLFdBQUEsS0FBQSxFQUFBLFlBQUEsTUFBQSxLQUFBLEVBQUEsWUFBQSxNQUFBLEtBQUEsRUFBQSxLQUFBLFFBQUEsT0FBQSxXQUFBLEtBQUEsc0JBQUEsU0FBQSxxQkFBQSxjQUFBLGNBQUEsZ0JBQUEsQ0FBQSxJQUFBLFVBQUEsS0FBQSxNQUFBLGdCQUFBLHNCQUFBLG1CQUFBLEtBQUEsSUFBQSxFQUFBLGNBQUEsV0FBQSxvQkFBQSxLQUFBLElBQUEsT0FBQSxNQUFBLEVBQUEsY0FBQSxXQUFBLEdBQUEsRUFBQSxxQkFBQSxvQkFBQSxtQkFBQSxLQUFBLFFBQUEsSUFBQSxrQkFBQSxLQUFBLElBQUEsRUFBQSxjQUFBLFdBQUEscUJBQUEsS0FBQSxJQUFBLE9BQUEsT0FBQSxFQUFBLGNBQUEsV0FBQSxnQkFBQSxJQUFBLHVCQUFBLEtBQUEsTUFBQSxtQkFBQSxrQkFBQSxvQkFBQSxtQkFBQSxxQkFBQSxrQkFBQSxxQkFBQSxLQUFBLHFCQUFBLE9BQUEsZ0JBQUEsUUFBQSxLQUFBLGdCQUFBLFNBQUEsUUFBQSxTQUFBLFdBQUEsaUJBQUEsVUFBQSxDQUFBLElBQUEsYUFBQSxhQUFBLG1CQUFBLG1CQUFBLGNBQUEsVUFBQSxJQUFBLE1BQUEsa0JBQUEsYUFBQSxpQkFBQSxFQUFBLGFBQUEsaUJBQUEsRUFBQSxtQkFBQSxtQkFBQSxjQUFBLElBQUEsYUFBQSxTQUFBLEVBQUEsUUFBQSxFQUFBLFdBQUEsRUFBQSxhQUFBLFNBQUEsRUFBQSxRQUFBLEVBQUEsV0FBQSxFQUFBLG1CQUFBLG1CQUFBLGVBQUEsSUFBQSxVQUFBLHFCQUFBLDZCQUFBLElBQUEsSUFBQSxjQUFBLElBQUEsbUJBQUEsbUJBQUEsSUFBQSxjQUFBLFFBQUEsRUFBQSxRQUFBLEVBQUEsU0FBQSxFQUFBLFNBQUEsRUFBQSxhQUFBLGFBQUEsV0FBQSxFQUFBLFdBQUEsR0FBQSxPQUFBLFdBQUEsS0FBQSxXQUFBLFNBQUEsTUFBQSxVQUFBLFVBQUEsQ0FBQSxJQUFBLFFBQUEsWUFBQSxPQUFBLFFBQUEsWUFBQSxNQUFBLFVBQUEsWUFBQSxLQUFBLHlCQUFBLFNBQUEsS0FBQSxDQUFBLElBQUEsUUFBQSxLQUFBLFFBQUEsU0FBQSxLQUFBLFNBQUEsV0FBQSxLQUFBLFdBQUEsV0FBQSxLQUFBLG9CQUFBLFFBQUEsU0FBQSxZQUFBLEdBQUEsRUFBQSxXQUFBLEtBQUEsUUFBQSxJQUFBLFVBQUEsS0FBQSxpQkFBQSxRQUFBLFNBQUEsV0FBQSxZQUFBLG1CQUFBLFFBQUEsa0NBQUEsV0FBQSx3QkFBQSxtQkFBQSxvQkFBQSxFQUFBLGlCQUFBLEtBQUEsR0FBQSxtQkFBQSx3QkFBQSxPQUFBLEVBQUEsSUFBQSxJQUFBLGFBQUEsU0FBQSxFQUFBLFFBQUEsRUFBQSxXQUFBLEVBQUEsYUFBQSxTQUFBLEVBQUEsUUFBQSxFQUFBLFdBQUEsRUFBQSxvQkFBQSxFQUFBLEVBQUEsd0JBQUEsY0FBQSxLQUFBLE1BQUEsUUFBQSxFQUFBLHFCQUFBLGFBQUEsUUFBQSxJQUFBLGNBQUEsS0FBQSxNQUFBLFFBQUEsRUFBQSxxQkFBQSxhQUFBLFFBQUEsSUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxDQUFBLGlCQUFBLEtBQUEsc0JBQUEsV0FBQSxjQUFBLGNBQUEsR0FBQSxNQUFBLElBQUEsT0FBQSxVQUFBLEtBQUEsZ0JBQUEsUUFBQSxTQUFBLFdBQUEsaUJBQUEsV0FBQSxLQUFBLEtBQUEsV0FBQSxLQUFBLE1BQUEsVUFBQSxXQUFBLE9BQUEsT0FBQSxNQUFBLGlCQUFBLElBQUEsTUFBQSxXQUFBLFFBQUEsVUFBQSxJQUFBLE1BQUEsV0FBQSxRQUFBLFNBQUEsa0JBQUEsSUFBQSxlQUFBLEtBQUEsU0FBQSxLQUFBLE9BQUEsVUFBQSxDQUFBLElBQUEsS0FBQSxDQUFBLElBQUEscUJBQUEsa0JBQUEsS0FBQSxPQUFBLE9BQUEsS0FBQSx5QkFBQSxPQUFBLFNBQUEsa0JBQUEsV0FBQSxDQUFBLEtBQUEscUJBQUEscUJBQUEsUUFBQSxZQUFBLEVBQUEsR0FBQSxLQUFBLFNBQUEsRUFBQSxXQUFBLEtBQUEsaUJBQUEsdUJBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSx1QkFBQSxLQUFBLGlCQUFBLFdBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxXQUFBLEtBQUEsWUFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLHFCQUFBLFdBQUEsRUFBQSxVQUFBLEtBQUEsT0FBQSxTQUFBLEVBQUEsQ0FBQSxJQUFBLE1BQUEsRUFBQSxPQUFBLEtBQUEsc0JBQUEsTUFBQSxzQkFBQSxLQUFBLFVBQUEsTUFBQSxVQUFBLFNBQUEscUJBQUEsUUFBQSxLQUFBLEtBQUEsQ0FBQSxLQUFBLHNCQUFBLFFBQUEsS0FBQSxLQUFBLEtBQUEsS0FBQSxLQUFBLEtBQUEsS0FBQSxpQkFBQSxPQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsT0FBQSxLQUFBLGlCQUFBLE9BQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxPQUFBLEtBQUEsUUFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLHVCQUFBLFNBQUEsVUFBQSxNQUFBLE9BQUEsQ0FBQSxHQUFBLFNBQUEsT0FBQSxPQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUEsS0FBQSx5Q0FBQSxLQUFBLE1BQUEsTUFBQSxLQUFBLE9BQUEsT0FBQSxJQUFBLFFBQUEsT0FBQSxFQUFBLElBQUEsR0FBQSxRQUFBLFVBQUEsS0FBQSxRQUFBLFFBQUEsS0FBQSxLQUFBLElBQUEsTUFBQSxRQUFBLFFBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxFQUFBLEtBQUEsS0FBQSxPQUFBLElBQUEsS0FBQSxLQUFBLEdBQUEsRUFBQSxLQUFBLGlCQUFBLFFBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxRQUFBLEtBQUEsaUJBQUEsU0FBQSxVQUFBLENBQUEsT0FBQSxLQUFBLFNBQUEsS0FBQSxpQkFBQSxZQUFBLFVBQUEsQ0FBQSxHQUFBLEtBQUEsT0FBQSxLQUFBLE9BQUEsS0FBQSxtREFBQSxPQUFBLEtBQUEsUUFBQSxLQUFBLFlBQUEsU0FBQSxFQUFBLEVBQUEsQ0FBQSxJQUFBLE9BQUEsRUFBQSxLQUFBLFNBQUEsR0FBQSxHQUFBLE9BQUEsSUFBQSxFQUFBLFFBQUEsS0FBQSxLQUFBLFFBQUEsR0FBQSxLQUFBLEtBQUEsWUFBQSxTQUFBLEVBQUEsRUFBQSxDQUFBLElBQUEsT0FBQSxFQUFBLEtBQUEsU0FBQSxHQUFBLEdBQUEsS0FBQSxLQUFBLFNBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxLQUFBLFNBQUEsRUFBQSxFQUFBLENBQUEsSUFBQSxPQUFBLEVBQUEsS0FBQSxTQUFBLEdBQUEsR0FBQSxLQUFBLEtBQUEsU0FBQSxJQUFBLEdBQUEsSUFBQSxLQUFBLE1BQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxJQUFBLEtBQUEsS0FBQSxPQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxLQUFBLEtBQUEsR0FBQSxHQUFBLEtBQUEsVUFBQSxTQUFBLEtBQUEsSUFBQSxNQUFBLE9BQUEsQ0FBQSxHQUFBLEVBQUEsS0FBQSxFQUFBLEtBQUEsS0FBQSxtQ0FBQSxHQUFBLEVBQUEsUUFBQSxFQUFBLE1BQUEsS0FBQSxzQ0FBQSxJQUFBLE1BQUEsS0FBQSxNQUFBLE9BQUEsSUFBQSxPQUFBLEdBQUEsT0FBQSxLQUFBLFFBQUEsTUFBQSxLQUFBLE1BQUEsS0FBQSx3Q0FBQSxJQUFBLElBQUEsRUFBQSxJQUFBLE9BQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxPQUFBLEVBQUEsS0FBQSxRQUFBLEVBQUEsS0FBQSxNQUFBLEVBQUEsSUFBQSxLQUFBLEtBQUEsUUFBQSxHQUFBLEtBQUEsSUFBQSxHQUFBLElBQUEsU0FBQSxVQUFBLGlCQUFBLFVBQUEsQ0FBQSxLQUFBLGlCQUFBLGlCQUFBLEtBQUEsVUFBQSxVQUFBLEtBQUEsaUJBQUEsbUJBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxtQkFBQSxLQUFBLGlCQUFBLFlBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxZQUFBLFNBQUEsZ0JBQUEsVUFBQSxDQUFBLElBQUEsVUFBQSxVQUFBLFVBQUEsR0FBQSxHQUFBLFdBQUEsSUFBQSxFQUFBLFdBQUEsS0FBQSx3QkFBQSxLQUFBLFVBQUEsVUFBQSxLQUFBLGNBQUEsS0FBQSxLQUFBLGlCQUFBLEtBQUEsS0FBQSxRQUFBLFNBQUEsRUFBQSxFQUFBLFlBQUEsQ0FBQSxPQUFBLEtBQUEsVUFBQSxZQUFBLEVBQUEsR0FBQSxhQUFBLEVBQUEsRUFBQSxhQUFBLEdBQUEsS0FBQSxzQkFBQSxVQUFBLENBQUEsR0FBQSxNQUFBLEtBQUEsaUJBQUEsT0FBQSxLQUFBLGlCQUFBLElBQUEsSUFBQSxlQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxJQUFBLGVBQUEsS0FBQSxRQUFBLEVBQUEsRUFBQSxnQkFBQSxlQUFBLEtBQUEsUUFBQSxFQUFBLEVBQUEsZ0JBQUEsZUFBQSxLQUFBLFFBQUEsRUFBQSxFQUFBLGdCQUFBLGVBQUEsS0FBQSxRQUFBLEVBQUEsRUFBQSxnQkFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLGVBQUEsS0FBQSxRQUFBLEVBQUEsRUFBQSxnQkFBQSxHQUFBLEtBQUEsaUJBQUEsa0JBQUEsd0JBQUEsZ0JBQUEsTUFBQSxLQUFBLGlCQUFBLE9BQUEsS0FBQSxpQkFBQSxJQUFBLFVBQUEsS0FBQSxVQUFBLFVBQUEsZUFBQSxFQUFBLElBQUEsSUFBQSxLQUFBLFVBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxHQUFBLEtBQUEsSUFBQSxlQUFBLEtBQUEsUUFBQSxFQUFBLEVBQUEsZ0JBQUEsSUFBQSxJQUFBLEVBQUEsVUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLGVBQUEsS0FBQSxRQUFBLEVBQUEsRUFBQSxnQkFBQSxHQUFBLEtBQUEsaUJBQUEsa0JBQUEsd0JBQUEsZ0JBQUEsTUFBQSxLQUFBLGlCQUFBLE9BQUEsS0FBQSxpQkFBQSxLQUFBLCtCQUFBLEtBQUEsWUFBQSxVQUFBLENBQUEsR0FBQSxNQUFBLEtBQUEsY0FBQSxPQUFBLEtBQUEsY0FBQSxJQUFBLFVBQUEsS0FBQSxVQUFBLFVBQUEsbUJBQUEsVUFBQSxJQUFBLEVBQUEsR0FBQSxHQUFBLG1CQUFBLE9BQUEsUUFBQSxvQkFBQSxvQkFBQSxJQUFBLElBQUEsWUFBQSxFQUFBLE1BQUEsVUFBQSxHQUFBLEVBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxVQUFBLEVBQUEsR0FBQSxNQUFBLElBQUEsWUFBQSxLQUFBLFFBQUEsRUFBQSxFQUFBLGFBQUEsR0FBQSxLQUFBLGNBQUEsUUFBQSx5QkFBQSxhQUFBLE1BQUEsS0FBQSxlQUFBLEtBQUEsY0FBQSxxQkFBQSxVQUFBLE9BQUEsS0FBQSxjQUFBLFlBQUEsRUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLFVBQUEsRUFBQSxHQUFBLE1BQUEsSUFBQSxZQUFBLEtBQUEsUUFBQSxFQUFBLEVBQUEsYUFBQSxHQUFBLEtBQUEsY0FBQSxRQUFBLHlCQUFBLGFBQUEsTUFBQSxLQUFBLGVBQUEsS0FBQSxjQUFBLHFCQUFBLFVBQUEsT0FBQSxLQUFBLGNBQUEsS0FBQSxxQkFBQSxLQUFBLGNBQUEsVUFBQSxDQUFBLElBQUEsV0FBQSxLQUFBLHdCQUFBLFFBQUEsS0FBQSxjQUFBLFNBQUEsU0FBQSxhQUFBLFdBQUEsVUFBQSxVQUFBLEtBQUEsVUFBQSxVQUFBLFNBQUEsZ0JBQUEsS0FBQSxVQUFBLFdBQUEsSUFBQSxJQUFBLGdCQUFBLFFBQUEsdUJBQUEsVUFBQSxDQUFBLEVBQUEsT0FBQSxJQUFBLE1BQUEsUUFBQSxnQkFBQSxhQUFBLEVBQUEsWUFBQSxFQUFBLFNBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxFQUFBLEVBQUEsR0FBQSxFQUFBLENBQUEsR0FBQSxHQUFBLElBQUEsSUFBQSxJQUFBLE1BQUEsRUFBQSxVQUFBLE1BQUEsUUFBQSxJQUFBLElBQUEsRUFBQSxVQUFBLFVBQUEsRUFBQSxNQUFBLE1BQUEsSUFBQSxFQUFBLEVBQUEsSUFBQSxNQUFBLGdCQUFBLFlBQUEsRUFBQSxJQUFBLEtBQUEsV0FBQSxjQUFBLEVBQUEsS0FBQSxVQUFBLFlBQUEsRUFBQSxJQUFBLEtBQUEsYUFBQSxHQUFBLEdBQUEsV0FBQSxPQUFBLGdCQUFBLFlBQUEsU0FBQSxFQUFBLFlBQUEsSUFBQSxXQUFBLENBQUEsRUFBQSxHQUFBLGNBQUEsUUFBQSxlQUFBLEtBQUEsc0JBQUEsT0FBQSxRQUFBLFNBQUEsYUFBQSxDQUFBLEtBQUEsZ0JBQUEsU0FBQSxLQUFBLFVBQUEsQ0FBQSxJQUFBLElBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsS0FBQSxTQUFBLEVBQUEsSUFBQSxLQUFBLEtBQUEsRUFBQSxJQUFBLEtBQUEsU0FBQSxTQUFBLEVBQUEsRUFBQSxDQUFBLE9BQUEsSUFBQSxFQUFBLEVBQUEsSUFBQSxTQUFBLGFBQUEsQ0FBQSxLQUFBLGdCQUFBLFNBQUEsS0FBQSxVQUFBLENBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxVQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLEtBQUEsU0FBQSxFQUFBLElBQUEsS0FBQSxLQUFBLEVBQUEsSUFBQSxLQUFBLFNBQUEsU0FBQSxFQUFBLEVBQUEsQ0FBQSxPQUFBLElBQUEsRUFBQSxJQUFBLFNBQUEsYUFBQSxDQUFBLEtBQUEsZ0JBQUEsU0FBQSxLQUFBLFVBQUEsQ0FBQSxJQUFBLElBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsS0FBQSxTQUFBLEVBQUEsSUFBQSxLQUFBLEtBQUEsRUFBQSxJQUFBLEtBQUEsU0FBQSxTQUFBLEVBQUEsRUFBQSxDQUFBLE9BQUEsRUFBQSxHQUFBLEdBQUEsU0FBQSxhQUFBLENBQUEsS0FBQSxnQkFBQSxTQUFBLEtBQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxVQUFBLEVBQUEsSUFBQSxLQUFBLFNBQUEsRUFBQSxJQUFBLEtBQUEsS0FBQSxFQUFBLElBQUEsS0FBQSxTQUFBLFNBQUEsRUFBQSxFQUFBLENBQUEsTUFBQSxDQUFBLEVBQUEsR0FBQSxHQUFBLEdBQUEsU0FBQSxhQUFBLENBQUEsS0FBQSxnQkFBQSxTQUFBLEtBQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxVQUFBLEVBQUEsSUFBQSxLQUFBLFNBQUEsRUFBQSxJQUFBLEtBQUEsS0FBQSxFQUFBLElBQUEsS0FBQSxTQUFBLFNBQUEsRUFBQSxFQUFBLENBQUEsT0FBQSxJQUFBLFFBQUEsRUFBQSxHQUFBLEVBQUEsRUFBQSxJQUFBLFNBQUEsYUFBQSxDQUFBLEtBQUEsZ0JBQUEsU0FBQSxLQUFBLFVBQUEsQ0FBQSxJQUFBLElBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsS0FBQSxTQUFBLEVBQUEsSUFBQSxLQUFBLEtBQUEsRUFBQSxJQUFBLEtBQUEsU0FBQSxTQUFBLEVBQUEsRUFBQSxDQUFBLElBQUEsS0FBQSxFQUFBLEVBQUEsTUFBQSxDQUFBLEVBQUEsTUFBQSxLQUFBLEdBQUEsR0FBQSxTQUFBLGFBQUEsQ0FBQSxLQUFBLGdCQUFBLFNBQUEsS0FBQSxVQUFBLENBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxVQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLEtBQUEsU0FBQSxFQUFBLElBQUEsS0FBQSxLQUFBLEVBQUEsSUFBQSxLQUFBLFNBQUEsU0FBQSxFQUFBLEVBQUEsQ0FBQSxJQUFBLEtBQUEsRUFBQSxFQUFBLE9BQUEsSUFBQSxDQUFBLEVBQUEsTUFBQSxLQUFBLEVBQUEsSUFBQSxTQUFBLGFBQUEsQ0FBQSxLQUFBLGdCQUFBLFNBQUEsS0FBQSxVQUFBLENBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxVQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLEtBQUEsU0FBQSxFQUFBLElBQUEsS0FBQSxLQUFBLEVBQUEsSUFBQSxLQUFBLFNBQUEsU0FBQSxFQUFBLEVBQUEsQ0FBQSxPQUFBLElBQUEsQ0FBQSxFQUFBLEVBQUEsR0FBQSxFQUFBLEVBQUEsRUFBQSxJQUFBLFNBQUEsbUJBQUEsTUFBQSxDQUFBLEtBQUEsTUFBQSxNQUFBLEtBQUEsT0FBQSxTQUFBLFNBQUEsS0FBQSxDQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsVUFBQSxLQUFBLE1BQUEsVUFBQSxxQkFBQSxJQUFBLE1BQUEsTUFBQSxFQUFBLEVBQUEsRUFBQSxxQkFBQSxPQUFBLElBQUEscUJBQUEsR0FBQSxFQUFBLElBQUEsSUFBQSxXQUFBLENBQUEsRUFBQSxRQUFBLENBQUEsRUFBQSxFQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsQ0FBQSxJQUFBLEtBQUEsS0FBQSxXQUFBLEtBQUEsTUFBQSxJQUFBLFdBQUEsRUFBQSxFQUFBLElBQUEscUJBQUEscUJBQUEsT0FBQSxFQUFBLEdBQUEsS0FBQSxHQUFBLE9BQUEsUUFBQSxDQUFBLEdBQUEsR0FBQSxDQUFBLFFBQUEsSUFBQSxJQUFBLFNBQUEsSUFBQSxVQUFBLEtBQUEsTUFBQSxzQkFBQSxXQUFBLEtBQUEsc0JBQUEsS0FBQSxNQUFBLGNBQUEsS0FBQSxHQUFBLFNBQUEsTUFBQSxNQUFBLFdBQUEsR0FBQSxNQUFBLFdBQUEsR0FBQSxlQUFBLEtBQUEsbUJBQUEsT0FBQSxnQkFBQSxLQUFBLG9CQUFBLE1BQUEsZUFBQSxZQUFBLEVBQUEsRUFBQSxFQUFBLGVBQUEsT0FBQSxJQUFBLENBQUEsSUFBQSxTQUFBLFNBQUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxJQUFBLGVBQUEsSUFBQSxHQUFBLEVBQUEsU0FBQSxLQUFBLDBDQUFBLFNBQUEsVUFBQSxNQUFBLGNBQUEsU0FBQSxVQUFBLGdCQUFBLE1BQUEsS0FBQSxzQkFBQSxTQUFBLEVBQUEsRUFBQSxFQUFBLENBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQSxPQUFBLENBQUEsSUFBQSxLQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsTUFBQSxFQUFBLEVBQUEsRUFBQSxNQUFBLEtBQUEsTUFBQSxJQUFBLEVBQUEsS0FBQSxNQUFBLEtBQUEsTUFBQSxLQUFBLE1BQUEsS0FBQSxFQUFBLEtBQUEsTUFBQSxJQUFBLEVBQUEsUUFBQSxLQUFBLE1BQUEsRUFBQSxJQUFBLENBQUEsSUFBQSxVQUFBLE1BQUEsVUFBQSxNQUFBLFVBQUEsTUFBQSxHQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxFQUFBLE1BQUEsS0FBQSxLQUFBLG1CQUFBLEVBQUEsVUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLE1BQUEsS0FBQSx1QkFBQSxNQUFBLGVBQUEsTUFBQSxRQUFBLFdBQUEsS0FBQSxNQUFBLFFBQUEsd0JBQUEsRUFBQSxRQUFBLE1BQUEsUUFBQSxDQUFBLEVBQUEsTUFBQSxDQUFBLElBQUEsV0FBQSxFQUFBLE9BQUEsTUFBQSxPQUFBLE1BQUEsS0FBQSxNQUFBLFNBQUEsRUFBQSxlQUFBLEVBQUEsUUFBQSxZQUFBLEVBQUEsRUFBQSxjQUFBLEtBQUEsTUFBQSxjQUFBLFdBQUEsUUFBQSxFQUFBLEVBQUEsY0FBQSxNQUFBLG1CQUFBLFdBQUEsUUFBQSxFQUFBLEVBQUEsVUFBQSxPQUFBLGNBQUEsV0FBQSxFQUFBLEVBQUEsVUFBQSxPQUFBLGNBQUEsV0FBQSxJQUFBLGlCQUFBLEVBQUEsZUFBQSxHQUFBLEdBQUEsR0FBQSxpQkFBQSxLQUFBLDhDQUFBLElBQUEsUUFBQSxLQUFBLE1BQUEsUUFBQSxrQkFBQSxNQUFBLEVBQUEsVUFBQSxTQUFBLE1BQUEsRUFBQSxVQUFBLFNBQUEsT0FBQSxJQUFBLE1BQUEsTUFBQSxRQUFBLEtBQUEsbUJBQUEsU0FBQSxhQUFBLENBQUEsSUFBQSxVQUFBLGFBQUEsT0FBQSxHQUFBLEdBQUEsVUFBQSxPQUFBLElBQUEsTUFBQSxhQUFBLGVBQUEsSUFBQSxJQUFBLElBQUEsT0FBQSxJQUFBLE1BQUEsV0FBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLElBQUEsR0FBQSxVQUFBLEVBQUEsSUFBQSxHQUFBLGFBQUEsV0FBQSxLQUFBLE9BQUEsR0FBQSxLQUFBLE1BQUEsUUFBQSxHQUFBLEtBQUEsR0FBQSxHQUFBLFVBQUEsS0FBQSxzREFBQSxPQUFBLFFBQUEsS0FBQSxvQkFBQSxTQUFBLGVBQUEsZUFBQSxXQUFBLENBQUEsSUFBQSxJQUFBLEVBQUEsZUFBQSxPQUFBLE9BQUEsSUFBQSxNQUFBLEdBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxJQUFBLENBQUEsSUFBQSxJQUFBLFVBQUEsS0FBQSxNQUFBLFFBQUEsZUFBQSxJQUFBLFlBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLElBQUEsR0FBQSxJQUFBLFlBQUEsS0FBQSxNQUFBLFNBQUEsWUFBQSxNQUFBLGNBQUEsRUFBQSxLQUFBLE1BQUEsU0FBQSxlQUFBLEdBQUEsY0FBQSxPQUFBLEdBQUEsS0FBQSxNQUFBLFNBQUEsZUFBQSxXQUFBLFdBQUEsS0FBQSxNQUFBLFFBQUEsY0FBQSxhQUFBLE9BQUEsR0FBQSxLQUFBLE1BQUEsU0FBQSxPQUFBLEdBQUEsWUFBQSxPQUFBLFFBQUEsU0FBQSxVQUFBLE1BQUEsYUFBQSxDQUFBLEdBQUEsTUFBQSxjQUFBLEdBQUEsYUFBQSxPQUFBLEtBQUEsMkJBQUEsS0FBQSxNQUFBLE1BQUEsSUFBQSxtQkFBQSxhQUFBLE9BQUEsR0FBQSxtQkFBQSxHQUFBLEdBQUEsYUFBQSxHQUFBLENBQUEsSUFBQSxJQUFBLGFBQUEsRUFBQSxtQkFBQSxjQUFBLEdBQUEsYUFBQSxlQUFBLGVBQUEsR0FBQSxjQUFBLG1CQUFBLEtBQUEsYUFBQSxNQUFBLEtBQUEsaUJBQUEsQ0FBQSxLQUFBLGFBQUEsSUFBQSxNQUFBLG1CQUFBLGNBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxFQUFBLEtBQUEsYUFBQSxPQUFBLElBQUEsS0FBQSxhQUFBLEdBQUEsRUFBQSxJQUFBLElBQUEsR0FBQSxFQUFBLEdBQUEsS0FBQSxhQUFBLE9BQUEsS0FBQSxLQUFBLGFBQUEsSUFBQSxhQUFBLGFBQUEsVUFBQSxLQUFBLGFBQUEsYUFBQSxLQUFBLGlCQUFBLE9BQUEsVUFBQSxDQUFBLE9BQUEsR0FBQSxLQUFBLGFBQUEsS0FBQSxLQUFBLGlCQUFBLFNBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxhQUFBLE9BQUEsSUFBQSxLQUFBLGlCQUFBLGVBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxlQUFBLEtBQUEsZUFBQSxTQUFBLE9BQUEsQ0FBQSxPQUFBLEtBQUEsYUFBQSxLQUFBLGFBQUEsT0FBQSxFQUFBLFNBQUEsS0FBQSxXQUFBLFNBQUEsRUFBQSxDQUFBLEdBQUEsR0FBQSxFQUFBLE9BQUEsS0FBQSxlQUFBLEdBQUEsSUFBQSxLQUFBLEtBQUEsYUFBQSxPQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsSUFBQSxJQUFBLE9BQUEsRUFBQSxFQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsT0FBQSxNQUFBLGNBQUEsT0FBQSxLQUFBLGFBQUEsSUFBQSxPQUFBLE9BQUEsSUFBQSxJQUFBLFFBQUEsS0FBQSxhQUFBLEdBQUEsRUFBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLFFBQUEsTUFBQSxjQUFBLEtBQUEsTUFBQSxTQUFBLEVBQUEsU0FBQSxLQUFBLGFBQUEsSUFBQSxPQUFBLFNBQUEsS0FBQSxjQUFBLFNBQUEsTUFBQSxDQUFBLEdBQUEsS0FBQSxPQUFBLE1BQUEsTUFBQSxLQUFBLDBDQUFBLEdBQUEsS0FBQSxLQUFBLE9BQUEsTUFBQSxHQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUEsSUFBQSxvQkFBQSxLQUFBLGFBQUEsbUJBQUEsTUFBQSxhQUFBLEdBQUEsb0JBQUEsT0FBQSxtQkFBQSxPQUFBLENBQUEsSUFBQSxLQUFBLG9CQUFBLG9CQUFBLG1CQUFBLG1CQUFBLEtBQUEsSUFBQSxJQUFBLFFBQUEsSUFBQSxNQUFBLG1CQUFBLFFBQUEsV0FBQSxtQkFBQSxPQUFBLG9CQUFBLE9BQUEsR0FBQSxFQUFBLFdBQUEsR0FBQSxLQUFBLFFBQUEsSUFBQSxtQkFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLFdBQUEsRUFBQSxtQkFBQSxPQUFBLElBQUEsUUFBQSxHQUFBLE1BQUEsY0FBQSxvQkFBQSxFQUFBLFlBQUEsbUJBQUEsSUFBQSxPQUFBLElBQUEsVUFBQSxNQUFBLFVBQUEsS0FBQSxVQUFBLFNBQUEsTUFBQSxDQUFBLEdBQUEsS0FBQSxPQUFBLE1BQUEsTUFBQSxLQUFBLDBDQUFBLEdBQUEsS0FBQSxNQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUEsTUFBQSxLQUFBLElBQUEsSUFBQSxjQUFBLEtBQUEsYUFBQSxRQUFBLGNBQUEsT0FBQSxjQUFBLE1BQUEsYUFBQSxRQUFBLGNBQUEsT0FBQSxRQUFBLElBQUEsTUFBQSxRQUFBLFFBQUEsR0FBQSxFQUFBLEVBQUEsUUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLE9BQUEsY0FBQSxHQUFBLEVBQUEsRUFBQSxRQUFBLEVBQUEsSUFBQSxRQUFBLEVBQUEsR0FBQSxNQUFBLGNBQUEsUUFBQSxFQUFBLEdBQUEsS0FBQSxNQUFBLFNBQUEsT0FBQSxjQUFBLEtBQUEsT0FBQSxJQUFBLFVBQUEsS0FBQSxNQUFBLFVBQUEsS0FBQSxVQUFBLFNBQUEsT0FBQSxDQUFBLEdBQUEsR0FBQSxPQUFBLE9BQUEsS0FBQSxNQUFBLEtBQUEsR0FBQSxHQUFBLE9BQUEsT0FBQSxLQUFBLElBQUEsSUFBQSxLQUFBLEtBQUEsYUFBQSxPQUFBLFFBQUEsSUFBQSxNQUFBLE1BQUEsRUFBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLFFBQUEsR0FBQSxLQUFBLE1BQUEsU0FBQSxLQUFBLGFBQUEsR0FBQSxRQUFBLE9BQUEsSUFBQSxVQUFBLEtBQUEsTUFBQSxVQUFBLEtBQUEsbUJBQUEsU0FBQSxPQUFBLFlBQUEsQ0FBQSxHQUFBLEVBQUEsT0FBQSxLQUFBLDJCQUFBLEdBQUEsR0FBQSxZQUFBLE9BQUEsS0FBQSxNQUFBLEtBQUEsSUFBQSxJQUFBLEtBQUEsS0FBQSxhQUFBLE9BQUEsUUFBQSxJQUFBLE1BQUEsS0FBQSxRQUFBLEVBQUEsRUFBQSxFQUFBLFFBQUEsT0FBQSxJQUFBLFFBQUEsR0FBQSxFQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsUUFBQSxHQUFBLEtBQUEsTUFBQSxTQUFBLEtBQUEsYUFBQSxHQUFBLGFBQUEsT0FBQSxJQUFBLFVBQUEsS0FBQSxNQUFBLFVBQUEsS0FBQSxPQUFBLFNBQUEsTUFBQSxDQUFBLEdBQUEsS0FBQSxPQUFBLE1BQUEsTUFBQSxLQUFBLDBDQUFBLEdBQUEsTUFBQSxLQUFBLEtBQUEsY0FBQSxJQUFBLElBQUEsU0FBQSxLQUFBLE1BQUEsS0FBQSxVQUFBLEtBQUEsdUJBQUEsTUFBQSxlQUFBLE1BQUEsUUFBQSw4QkFBQSxLQUFBLE1BQUEsUUFBQSx3QkFBQSxVQUFBLFFBQUEsTUFBQSxRQUFBLENBQUEsVUFBQSxNQUFBO0lBQ0EsSUFBQSxpQkFBQSxVQUFBLE9BQUEsTUFBQSxPQUFBLE1BQUEsS0FBQSxNQUFBLFNBQUEsVUFBQSxlQUFBLFVBQUEsUUFBQSwrQkFBQSxLQUFBLE1BQUEsbUJBQUEsaUJBQUEsT0FBQSxrQkFBQSxLQUFBLE1BQUEsY0FBQSxpQkFBQSxPQUFBLFNBQUEsU0FBQSxjQUFBLG1CQUFBLFVBQUEsVUFBQSxjQUFBLE1BQUEsT0FBQSxJQUFBLE1BQUEsU0FBQSxZQUFBLFNBQUEsTUFBQSxVQUFBLENBQUEsS0FBQSxTQUFBLElBQUEsTUFBQSxLQUFBLEtBQUEsU0FBQSxJQUFBLE1BQUEsS0FBQSxJQUFBLElBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxLQUFBLFNBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxHQUFBLE1BQUEsR0FBQSxXQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsS0FBQSxTQUFBLEtBQUEsU0FBQSxJQUFBLEVBQUEsSUFBQSxJQUFBLElBQUEsTUFBQSxHQUFBLElBQUEsR0FBQSxFQUFBLEtBQUEsS0FBQSxJQUFBLFVBQUEsS0FBQSxJQUFBLE1BQUEsTUFBQSxJQUFBLElBQUEsSUFBQSxNQUFBLEdBQUEsSUFBQSxHQUFBLEVBQUEsS0FBQSxJQUFBLElBQUEsVUFBQSxLQUFBLElBQUEsTUFBQSxNQUFBLEtBQUEsaUJBQUEsT0FBQSxVQUFBLENBQUEsT0FBQSxLQUFBLE9BQUEsS0FBQSxpQkFBQSxNQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsTUFBQSxLQUFBLGNBQUEsU0FBQSxPQUFBLFlBQUEsQ0FBQSxHQUFBLEVBQUEsT0FBQSxLQUFBLDJCQUFBLEdBQUEsR0FBQSxZQUFBLE9BQUEsS0FBQSxJQUFBLElBQUEsYUFBQSxJQUFBLE1BQUEsT0FBQSxHQUFBLEVBQUEsRUFBQSxFQUFBLGFBQUEsT0FBQSxJQUFBLGFBQUEsR0FBQSxFQUFBLE9BQUEsYUFBQSxHQUFBLFlBQUEsSUFBQSxVQUFBLEtBQUEsZUFBQSxLQUFBLElBQUEsU0FBQSxFQUFBLENBQUEsT0FBQSxLQUFBLFNBQUEsSUFBQSxLQUFBLElBQUEsU0FBQSxFQUFBLENBQUEsR0FBQSxHQUFBLEVBQUEsS0FBQSwyQkFBQSxPQUFBLEtBQUEsU0FBQSxJQUFBLEtBQUEsUUFBQSxTQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxLQUFBLDZCQUFBLE9BQUEsS0FBQSxTQUFBLElBQUEsS0FBQSxTQUFBLEtBQUEsS0FBQSxTQUFBLFNBQUEsRUFBQSxFQUFBLENBQUEsT0FBQSxHQUFBLEdBQUEsR0FBQSxFQUFBLEVBQUEsR0FBQSxFQUFBLEVBQUEsR0FBQSxFQUFBLEVBQUEsS0FBQSxTQUFBLENBQUEsS0FBQSxTQUFBLEdBQUEsS0FBQSxTQUFBLElBQUEsTUFBQSxTQUFBLFFBQUEsT0FBQSxLQUFBLENBQUEsT0FBQSxRQUFBLEVBQUEsUUFBQSxLQUFBLENBQUEsUUFBQSxPQUFBLEdBQUEsQ0FBQSxNQUFBLFNBQUEsY0FBQSxLQUFBLEtBQUEsb0JBQUEsQ0FBQSxLQUFBLEVBQUEsS0FBQSxLQUFBLEVBQUEsS0FBQSxLQUFBLE1BQUEsRUFBQSxLQUFBLG9CQUFBLG9CQUFBLEtBQUEsaUJBQUEsc0JBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxzQkFBQSxLQUFBLGlCQUFBLFFBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxRQUFBLEtBQUEsaUJBQUEsSUFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLElBQUEsS0FBQSxpQkFBQSxJQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsSUFBQSxLQUFBLGVBQUEsVUFBQSxDQUFBLEtBQUEsU0FBQSxLQUFBLFlBQUEsU0FBQSxXQUFBLEVBQUEsRUFBQSxDQUFBLEdBQUEsS0FBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFlBQUEsS0FBQSxJQUFBLEVBQUEsS0FBQSxJQUFBLFdBQUEsQ0FBQSxJQUFBLGVBQUEsS0FBQSxJQUFBLFdBQUEsS0FBQSxxQkFBQSxPQUFBLEdBQUEsZ0JBQUEsZUFBQSxLQUFBLHFCQUFBLEVBQUEsTUFBQSxDQUFBLEdBQUEsU0FBQSxrQkFBQSxlQUFBLENBQUEsS0FBQSxXQUFBLGVBQUEsR0FBQSxLQUFBLFFBQUEsZUFBQSxHQUFBLEtBQUEsU0FBQSxlQUFBLEdBQUEsS0FBQSxpQkFBQSxhQUFBLFVBQUEsQ0FBQSxPQUFBLEtBQUEsYUFBQSxLQUFBLGlCQUFBLFVBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxVQUFBLEtBQUEsaUJBQUEsV0FBQSxVQUFBLENBQUEsT0FBQSxLQUFBLFdBQUEsU0FBQSxxQkFBQSxDQUFBLEtBQUEsTUFBQSxLQUFBLEtBQUEsZ0JBQUEsR0FBQSxLQUFBLFdBQUEsQ0FBQSxFQUFBLEtBQUEscUJBQUEsSUFBQSxNQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsR0FBQSxLQUFBLG9CQUFBLEtBQUEsS0FBQSxpQkFBQSx1QkFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLHFCQUFBLEdBQUEsRUFBQSxLQUFBLHFCQUFBLEdBQUEsRUFBQSxLQUFBLHFCQUFBLEdBQUEsRUFBQSxLQUFBLHFCQUFBLEdBQUEsRUFBQSxLQUFBLHFCQUFBLEdBQUEsRUFBQSxLQUFBLHVCQUFBLEtBQUEsa0JBQUEsU0FBQSxXQUFBLENBQUEsSUFBQSxJQUFBLGdCQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxJQUFBLENBQUEsSUFBQSxNQUFBLFdBQUEsR0FBQSxHQUFBLEdBQUEsTUFBQSxNQUFBLENBQUEsRUFBQSxpQkFBQSxNQUFBLEdBQUEsRUFBQSxnQkFBQSxNQUFBLENBQUEsRUFBQSxJQUFBLFdBQUEsS0FBQSxNQUFBLENBQUEsaUJBQUEsb0JBQUEsR0FBQSxZQUFBLEtBQUEsTUFBQSxXQUFBLEdBQUEsT0FBQSxLQUFBLElBQUEsWUFBQSxXQUFBLElBQUEscUJBQUEsYUFBQSxLQUFBLElBQUEsWUFBQSxXQUFBLElBQUEscUJBQUEsYUFBQSxLQUFBLElBQUEsRUFBQSxZQUFBLFdBQUEsSUFBQSxxQkFBQSxFQUFBLGFBQUEsS0FBQSxJQUFBLFlBQUEsV0FBQSxJQUFBLHFCQUFBLGFBQUEsS0FBQSxJQUFBLFlBQUEsV0FBQSxJQUFBLHFCQUFBLGFBQUEsS0FBQSxjQUFBLFNBQUEsV0FBQSxJQUFBLENBQUEsT0FBQSxJQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLEdBQUEsS0FBQSxtQkFBQSxTQUFBLE9BQUEsUUFBQSxTQUFBLHdCQUFBLENBQUEsSUFBQSxJQUFBLE1BQUEsS0FBQSxNQUFBLEtBQUEsT0FBQSxPQUFBLFdBQUEsS0FBQSxxQkFBQSxFQUFBLE9BQUEsR0FBQSxHQUFBLE1BQUEsUUFBQSxFQUFBLE9BQUEsUUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLEVBQUEsRUFBQSxPQUFBLElBQUEsS0FBQSxHQUFBLEdBQUEsQ0FBQSxNQUFBLFFBQUEsRUFBQSxPQUFBLFFBQUEsV0FBQSxJQUFBLFVBQUEsV0FBQSxLQUFBLElBQUEsR0FBQSxFQUFBLEdBQUEsV0FBQSxHQUFBLFNBQUEsT0FBQSxJQUFBLEtBQUEsR0FBQSxHQUFBLE1BQUEsUUFBQSxFQUFBLE9BQUEsUUFBQSxXQUFBLElBQUEsVUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLFdBQUEsR0FBQSxTQUFBLE9BQUEsSUFBQSxJQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUEsR0FBQSxNQUFBLFFBQUEsRUFBQSxPQUFBLFFBQUEsV0FBQSxLQUFBLElBQUEsR0FBQSxHQUFBLEtBQUEsT0FBQSxJQUFBLEtBQUEsS0FBQSxHQUFBLENBQUEsTUFBQSxRQUFBLEVBQUEsT0FBQSxRQUFBLFdBQUEsR0FBQSxVQUFBLFdBQUEsS0FBQSxJQUFBLEdBQUEsR0FBQSxNQUFBLFdBQUEsSUFBQSxTQUFBLE9BQUEsSUFBQSxLQUFBLEtBQUEsR0FBQSxNQUFBLFFBQUEsRUFBQSxPQUFBLFFBQUEsV0FBQSxHQUFBLFVBQUEsV0FBQSxLQUFBLElBQUEsR0FBQSxXQUFBLElBQUEsU0FBQSxPQUFBLElBQUEsSUFBQSxnQkFBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLE9BQUEsRUFBQSxLQUFBLElBQUEsZ0JBQUEsMEJBQUEsRUFBQSx3QkFBQSxJQUFBLEtBQUEsa0JBQUEsWUFBQSxLQUFBLGNBQUEsV0FBQSxHQUFBLEtBQUEsS0FBQSxxQkFBQSxTQUFBLE9BQUEsUUFBQSxTQUFBLHdCQUFBLENBQUEsSUFBQSxJQUFBLE1BQUEsS0FBQSxNQUFBLEtBQUEsT0FBQSxNQUFBLFdBQUEsS0FBQSxxQkFBQSxFQUFBLE9BQUEsR0FBQSxHQUFBLE1BQUEsRUFBQSxRQUFBLE9BQUEsUUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLEVBQUEsRUFBQSxPQUFBLElBQUEsS0FBQSxHQUFBLEdBQUEsQ0FBQSxNQUFBLEVBQUEsUUFBQSxPQUFBLFFBQUEsV0FBQSxJQUFBLFVBQUEsV0FBQSxLQUFBLElBQUEsR0FBQSxFQUFBLEdBQUEsV0FBQSxHQUFBLFNBQUEsT0FBQSxJQUFBLEtBQUEsR0FBQSxHQUFBLE1BQUEsRUFBQSxRQUFBLE9BQUEsUUFBQSxXQUFBLElBQUEsVUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLFdBQUEsR0FBQSxTQUFBLE9BQUEsSUFBQSxJQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUEsR0FBQSxNQUFBLEVBQUEsUUFBQSxPQUFBLFFBQUEsV0FBQSxLQUFBLElBQUEsR0FBQSxHQUFBLEtBQUEsT0FBQSxJQUFBLEtBQUEsS0FBQSxHQUFBLENBQUEsTUFBQSxFQUFBLFFBQUEsT0FBQSxRQUFBLFdBQUEsR0FBQSxVQUFBLFdBQUEsS0FBQSxJQUFBLEdBQUEsR0FBQSxNQUFBLFdBQUEsSUFBQSxTQUFBLE9BQUEsSUFBQSxLQUFBLEtBQUEsR0FBQSxNQUFBLEVBQUEsUUFBQSxPQUFBLFFBQUEsV0FBQSxHQUFBLFVBQUEsV0FBQSxLQUFBLElBQUEsR0FBQSxXQUFBLElBQUEsU0FBQSxPQUFBLElBQUEsSUFBQSxnQkFBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLE9BQUEsRUFBQSxLQUFBLElBQUEsZ0JBQUEsMEJBQUEsd0JBQUEsSUFBQSxLQUFBLGtCQUFBLFlBQUEsS0FBQSxjQUFBLFdBQUEsR0FBQSxLQUFBLEtBQUEscUJBQUEsU0FBQSxXQUFBLEVBQUEsRUFBQSxDQUFBLElBQUEsZ0JBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxRQUFBLEtBQUEsY0FBQSxXQUFBLEdBQUEsUUFBQSxLQUFBLG1CQUFBLEVBQUEsS0FBQSxNQUFBLFNBQUEsV0FBQSxHQUFBLGlCQUFBLEdBQUEsQ0FBQSxNQUFBLFdBQUEsUUFBQSxLQUFBLHFCQUFBLEtBQUEsTUFBQSxTQUFBLEtBQUEsTUFBQSxTQUFBLFdBQUEsR0FBQSxpQkFBQSxDQUFBLE1BQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxvQkFBQSxnQkFBQSxFQUFBLE1BQUEsQ0FBQSxFQUFBLElBQUEsS0FBQSxnQkFBQSxPQUFBLE1BQUEsRUFBQSxJQUFBLE1BQUEsUUFBQSxDQUFBLElBQUEsT0FBQSxLQUFBLGdCQUFBLE9BQUEsR0FBQSxPQUFBLFlBQUEsb0JBQUEsUUFBQSxTQUFBLENBQUEsT0FBQSxpQkFBQSxNQUFBLENBQUEsRUFBQSxPQUFBLEdBQUEsQ0FBQSxNQUFBLENBQUEsSUFBQSxNQUFBLElBQUEsY0FBQSxRQUFBLFFBQUEscUJBQUEsS0FBQSxnQkFBQSxLQUFBLE9BQUEsTUFBQSxLQUFBLHFCQUFBLEtBQUEsb0JBQUEseUJBQUEsT0FBQSxNQUFBLENBQUEsRUFBQSxNQUFBLENBQUEsR0FBQSxLQUFBLG1CQUFBLFVBQUEsQ0FBQSxJQUFBLFVBQUEsS0FBQSxnQkFBQSxPQUFBLEdBQUEsRUFBQSxVQUFBLEtBQUEsdUNBQUEsR0FBQSxVQUFBLEVBQUEsQ0FBQSxJQUFBLElBQUEsZ0JBQUEsRUFBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsaUJBQUEsS0FBQSxnQkFBQSxHQUFBLG9CQUFBLElBQUEsSUFBQSxRQUFBLGdCQUFBLFVBQUEsRUFBQSxFQUFBLEVBQUEsS0FBQSxnQkFBQSxRQUFBLEtBQUEsZ0JBQUEsT0FBQSxFQUFBLElBQUEsQ0FBQSxJQUFBLFFBQUEsS0FBQSxnQkFBQSxHQUFBLEtBQUEsSUFBQSxRQUFBLG9CQUFBLFNBQUEsR0FBQSxVQUFBLEtBQUEsZ0JBQUEsT0FBQSxHQUFBLE1BQUEsT0FBQSxLQUFBLGdCQUFBLE1BQUEsRUFBQSxJQUFBLE1BQUEsS0FBQSxnQkFBQSxHQUFBLEtBQUEsZ0JBQUEsR0FBQSxLQUFBLGdCQUFBLEtBQUEsS0FBQSxZQUFBLFVBQUEsQ0FBQSxJQUFBLElBQUEsS0FBQSxnQkFBQSxPQUFBLEdBQUEsR0FBQSxJQUFBLE9BQUEsRUFBQSxJQUFBLElBQUEscUJBQUEsS0FBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQSxJQUFBLE9BQUEsS0FBQSxnQkFBQSxHQUFBLEdBQUEsT0FBQSxPQUFBLGNBQUEsQ0FBQSxHQUFBLE1BQUEscUJBQUEsT0FBQSxLQUFBLFdBQUEsQ0FBQSxFQUFBLEtBQUEsTUFBQSxDQUFBLEtBQUEsSUFBQSxxQkFBQSxFQUFBLE9BQUEsR0FBQSxLQUFBLElBQUEscUJBQUEsRUFBQSxPQUFBLElBQUEsR0FBQSxxQkFBQSxRQUFBLE9BQUEsR0FBQSxLQUFBLDZCQUFBLFVBQUEsQ0FBQSxJQUFBLElBQUEsZUFBQSxFQUFBLGdCQUFBLEVBQUEsSUFBQSxLQUFBLGdCQUFBLE9BQUEsRUFBQSxFQUFBLElBQUEsRUFBQSxJQUFBLENBQUEsSUFBQSxRQUFBLEtBQUEsZ0JBQUEsR0FBQSxRQUFBLE9BQUEsZ0JBQUEsaUJBQUEsaUJBQUEsUUFBQSxxQkFBQSxHQUFBLEVBQUEsZUFBQSxNQUFBLENBQUEsRUFBQSxJQUFBLElBQUEsUUFBQSxnQkFBQSxJQUFBLGVBQUEsRUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsUUFBQSxLQUFBLGdCQUFBLEdBQUEsZ0JBQUEsS0FBQSxJQUFBLFFBQUEsb0JBQUEsU0FBQSxNQUFBLElBQUEsaUJBQUEsZ0JBQUEsS0FBQSxrQkFBQSxTQUFBLE1BQUEsQ0FBQSxJQUFBLFVBQUEsQ0FBQSxFQUFBLEtBQUEsTUFBQSxNQUFBLElBQUEsS0FBQSxPQUFBLE9BQUEsS0FBQSxPQUFBLE1BQUEsTUFBQSxLQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsY0FBQSxDQUFBLFNBQUEsT0FBQSxhQUFBLE1BQUEsVUFBQSxJQUFBLElBQUEsS0FBQSxDQUFBLEVBQUEsV0FBQSxJQUFBLE1BQUEsR0FBQSxFQUFBLE1BQUEsRUFBQSxLQUFBLEdBQUEsQ0FBQSxLQUFBLEdBQUEsTUFBQSxDQUFBLFdBQUEsR0FBQSxFQUFBLFdBQUEsR0FBQSxFQUFBLFdBQUEsR0FBQSxFQUFBLFdBQUEsR0FBQSxFQUFBLFdBQUEsR0FBQSxFQUFBLElBQUEsSUFBQSxhQUFBLEVBQUEsRUFBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLEdBQUEsTUFBQSxFQUFBLEVBQUEsT0FBQSxPQUFBLElBQUEsRUFBQSxlQUFBLGVBQUEsV0FBQSxxQkFBQSxHQUFBLElBQUEsRUFBQSxjQUFBLEdBQUEsR0FBQSxhQUFBLEdBQUEsS0FBQSxrQkFBQSxZQUFBLENBQUEsSUFBQSxVQUFBLEtBQUEscUJBQUEsV0FBQSxFQUFBLEdBQUEsR0FBQSxVQUFBLEdBQUEsTUFBQSxFQUFBLEtBQUEsV0FBQSxLQUFBLEtBQUEsbUNBQUEsQ0FBQSxJQUFBLFFBQUEsS0FBQSxjQUFBLFFBQUEsV0FBQSxLQUFBLEdBQUEsUUFBQSxXQUFBLEdBQUEsTUFBQSxFQUFBLEtBQUEsT0FBQSxDQUFBLEdBQUEsVUFBQSxLQUFBLEdBQUEsQ0FBQSxNQUFBLEVBQUEsRUFBQSxPQUFBLFFBQUEsSUFBQSxhQUFBLEVBQUEsV0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLE9BQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEVBQUEsYUFBQSxPQUFBLFdBQUEsRUFBQSxxQkFBQSxXQUFBLGdCQUFBLEdBQUEsS0FBQSxrQkFBQSxZQUFBLENBQUEsSUFBQSxVQUFBLEtBQUEscUJBQUEsV0FBQSxFQUFBLE1BQUEsWUFBQSxNQUFBLFdBQUEsR0FBQSxLQUFBLGFBQUEsS0FBQSxrQ0FBQSxJQUFBLFlBQUEsS0FBQSxxQkFBQSxPQUFBLE9BQUEsa0JBQUEsYUFBQSxJQUFBLGtCQUFBLGNBQUEsU0FBQSxpQkFBQSxLQUFBLEtBQUEsb0JBQUEsQ0FBQSxLQUFBLEVBQUEsS0FBQSxLQUFBLEVBQUEsS0FBQSxLQUFBLE1BQUEsRUFBQSxLQUFBLG9CQUFBLG9CQUFBLEtBQUEsaUJBQUEsc0JBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxzQkFBQSxLQUFBLGlCQUFBLFFBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxRQUFBLEtBQUEsaUJBQUEsSUFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLE1BQUEsS0FBQSxLQUFBLEtBQUEsaUJBQUEsSUFBQSxVQUFBLENBQUEsT0FBQSxLQUFBLE1BQUEsS0FBQSxLQUFBLEtBQUEsZUFBQSxVQUFBLENBQUEsS0FBQSxTQUFBLEtBQUEsWUFBQSxTQUFBLFdBQUEsRUFBQSxFQUFBLENBQUEsR0FBQSxLQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsWUFBQSxLQUFBLElBQUEsRUFBQSxLQUFBLElBQUEsV0FBQSxDQUFBLElBQUEsZUFBQSxLQUFBLElBQUEsV0FBQSxLQUFBLHFCQUFBLE9BQUEsR0FBQSxnQkFBQSxlQUFBLEtBQUEscUJBQUEsRUFBQSxNQUFBLENBQUEsR0FBQSxTQUFBLHVCQUFBLE1BQUEsT0FBQSxPQUFBLE1BQUEsT0FBQSxXQUFBLG9CQUFBLENBQUEsS0FBQSxNQUFBLE1BQUEsS0FBQSxnQkFBQSxJQUFBLE1BQUEsS0FBQSxPQUFBLE9BQUEsS0FBQSxPQUFBLE9BQUEsS0FBQSxNQUFBLE1BQUEsS0FBQSxPQUFBLE9BQUEsS0FBQSxXQUFBLFdBQUEsS0FBQSxxQkFBQSxJQUFBLE1BQUEsRUFBQSxFQUFBLEdBQUEsS0FBQSxvQkFBQSxvQkFBQSxLQUFBLGNBQUEsU0FBQSxXQUFBLElBQUEsQ0FBQSxPQUFBLElBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxHQUFBLEtBQUEsa0JBQUEsU0FBQSxXQUFBLENBQUEsSUFBQSxJQUFBLFdBQUEsS0FBQSxXQUFBLFlBQUEsV0FBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsSUFBQSxHQUFBLEtBQUEsSUFBQSxXQUFBLFdBQUEsS0FBQSxZQUFBLE1BQUEsQ0FBQSxFQUFBLE1BQUEsQ0FBQSxHQUFBLEtBQUEsbUJBQUEsU0FBQSxPQUFBLFFBQUEsU0FBQSx3QkFBQSxDQUFBLElBQUEsTUFBQSxLQUFBLE1BQUEsS0FBQSxPQUFBLE9BQUEsV0FBQSxLQUFBLHFCQUFBLFdBQUEsR0FBQSxFQUFBLFdBQUEsR0FBQSxFQUFBLFdBQUEsR0FBQSxFQUFBLElBQUEsSUFBQSxFQUFBLE9BQUEsR0FBQSxHQUFBLE1BQUEsUUFBQSxFQUFBLE9BQUEsUUFBQSxXQUFBLElBQUEsVUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLEVBQUEsR0FBQSxXQUFBLEdBQUEsU0FBQSxPQUFBLElBQUEsS0FBQSxHQUFBLEdBQUEsQ0FBQSxNQUFBLFFBQUEsRUFBQSxPQUFBLFFBQUEsV0FBQSxJQUFBLFVBQUEsV0FBQSxLQUFBLElBQUEsR0FBQSxXQUFBLEdBQUEsU0FBQSxPQUFBLElBQUEsSUFBQSxFQUFBLE9BQUEsRUFBQSxLQUFBLEdBQUEsTUFBQSxRQUFBLEVBQUEsT0FBQSxRQUFBLFdBQUEsSUFBQSxVQUFBLFdBQUEsS0FBQSxJQUFBLEdBQUEsR0FBQSxNQUFBLFdBQUEsR0FBQSxTQUFBLE9BQUEsSUFBQSxLQUFBLEtBQUEsR0FBQSxDQUFBLE1BQUEsUUFBQSxFQUFBLE9BQUEsUUFBQSxXQUFBLElBQUEsVUFBQSxXQUFBLEtBQUEsSUFBQSxHQUFBLFdBQUEsR0FBQSxTQUFBLE9BQUEsSUFBQSxJQUFBLGdCQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLE9BQUEsRUFBQSxLQUFBLElBQUEsZ0JBQUEsMEJBQUEsRUFBQSx3QkFBQSxJQUFBLEtBQUEsa0JBQUEsWUFBQSxLQUFBLGNBQUEsV0FBQSxHQUFBLEtBQUEsS0FBQSxxQkFBQSxTQUFBLFdBQUEsRUFBQSxFQUFBLENBQUEsSUFBQSxnQkFBQSxXQUFBLEdBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxRQUFBLEtBQUEsY0FBQSxXQUFBLEdBQUEsUUFBQSxLQUFBLG1CQUFBLEVBQUEsS0FBQSxNQUFBLFNBQUEsRUFBQSxXQUFBLEdBQUEsaUJBQUEsR0FBQSxDQUFBLE1BQUEsU0FBQSxDQUFBLElBQUEsSUFBQSxvQkFBQSxDQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsV0FBQSxJQUFBLEVBQUEsSUFBQSxLQUFBLGdCQUFBLE9BQUEsTUFBQSxFQUFBLElBQUEsTUFBQSxRQUFBLENBQUEsSUFBQSxPQUFBLEtBQUEsZ0JBQUEsT0FBQSxHQUFBLE9BQUEsWUFBQSxvQkFBQSxRQUFBLFNBQUEsT0FBQSxJQUFBLGlCQUFBLFFBQUEsUUFBQSxxQkFBQSxJQUFBLE1BQUEsSUFBQSxpQkFBQSxRQUFBLFFBQUEscUJBQUEsS0FBQSxnQkFBQSxLQUFBLE9BQUEsTUFBQSxLQUFBLHFCQUFBLEtBQUEsb0JBQUEseUJBQUEsT0FBQSxPQUFBLE1BQUEsS0FBQSxLQUFBLFVBQUEsQ0FBQSxJQUFBLElBQUEsT0FBQSxLQUFBLE9BQUEsT0FBQSxLQUFBLE9BQUEsS0FBQSxPQUFBLE1BQUEsUUFBQSxRQUFBLFFBQUEsR0FBQSxXQUFBLElBQUEsTUFBQSxFQUFBLEVBQUEsR0FBQSxLQUFBLEVBQUEsT0FBQSxLQUFBLE9BQUEsQ0FBQSxJQUFBLEVBQUEsU0FBQSxJQUFBLEVBQUEsTUFBQSxLQUFBLEdBQUEsRUFBQSxFQUFBLEtBQUEsR0FBQSxJQUFBLFdBQUEsR0FBQSxFQUFBLFdBQUEsR0FBQSxFQUFBLFdBQUEsR0FBQSxFQUFBLElBQUEsSUFBQSxFQUFBLE9BQUEsS0FBQSxHQUFBLENBQUEsTUFBQSxFQUFBLE9BQUEsTUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLGFBQUEsRUFBQSxLQUFBLEdBQUEsQ0FBQSxHQUFBLE1BQUEsRUFBQSxFQUFBLE9BQUEsT0FBQSxHQUFBLEdBQUEsYUFBQSxXQUFBLHFCQUFBLEdBQUEsR0FBQSxhQUFBLENBQUEsR0FBQSxLQUFBLGtCQUFBLFlBQUEsQ0FBQSxJQUFBLFVBQUEsS0FBQSxxQkFBQSxXQUFBLEVBQUEsR0FBQSxHQUFBLE1BQUEsVUFBQSxPQUFBLFVBQUEsV0FBQSxHQUFBLFdBQUEsR0FBQSxXQUFBLEdBQUEsRUFBQSxXQUFBLEdBQUEsRUFBQSxhQUFBLE9BQUEsV0FBQSxFQUFBLHFCQUFBLEdBQUEsY0FBQSxlQUFBLFdBQUEsZ0JBQUEsSUFBQSxHQUFBLEtBQUEsa0JBQUEsWUFBQSxDQUFBLElBQUEsVUFBQSxLQUFBLHFCQUFBLFdBQUEsRUFBQSxNQUFBLEdBQUEsTUFBQSxVQUFBLE9BQUEsV0FBQSxHQUFBLEdBQUEsS0FBQSxnQkFBQSxPQUFBLE9BQUEsS0FBQSxnQkFBQSxHQUFBLEtBQUEsMkNBQUEsU0FBQSxzQkFBQSxPQUFBLFFBQUEsdUJBQUEsQ0FBQSxLQUFBLGFBQUEsRUFBQSxLQUFBLFdBQUEsRUFBQSxLQUFBLFdBQUEsRUFBQSxLQUFBLE9BQUEsT0FBQSxLQUFBLHVCQUFBLHVCQUFBLEdBQUEsUUFBQSxLQUFBLGVBQUEsRUFBQSxTQUFBLElBQUEsSUFBQSxRQUFBLEtBQUEsZUFBQSxFQUFBLFNBQUEsSUFBQSxJQUFBLFVBQUEsS0FBQSxlQUFBLEdBQUEsS0FBQSxZQUFBLFNBQUEsUUFBQSxDQUFBLElBQUEsS0FBQSxFQUFBLEdBQUEsUUFBQSxLQUFBLFdBQUEsRUFBQSxDQUFBLElBQUEsSUFBQSxLQUFBLEVBQUEsRUFBQSxFQUFBLFFBQUEsRUFBQSxJQUFBLE1BQUEsR0FBQSxFQUFBLE9BQUEsT0FBQSxLQUFBLFdBQUEsUUFBQSxFQUFBLEtBQUEsQ0FBQSxLQUFBLE9BQUEsS0FBQSxjQUFBLE9BQUEsS0FBQSxXQUFBLFFBQUEsRUFBQSxLQUFBLFlBQUEsUUFBQSxLQUFBLEdBQUEsUUFBQSxLQUFBLFdBQUEsRUFBQSxFQUFBLENBQUEsSUFBQSxJQUFBLE1BQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxLQUFBLFdBQUEsRUFBQSxJQUFBLE9BQUEsR0FBQSxFQUFBLE9BQUEsS0FBQSxDQUFBLEtBQUEsT0FBQSxLQUFBLGNBQUEsUUFBQSxTQUFBLEtBQUEsV0FBQSxHQUFBLEtBQUEsZUFBQSxNQUFBLEtBQUEsT0FBQSxLQUFBLGVBQUEsR0FBQSxTQUFBLEtBQUEsV0FBQSxJQUFBLEtBQUEsV0FBQSxLQUFBLFdBQUEsUUFBQSxFQUFBLEtBQUEsV0FBQSxJQUFBLEtBQUEsV0FBQSxFQUFBLEtBQUEsWUFBQSxLQUFBLEdBQUEsUUFBQSxLQUFBLFdBQUEsRUFBQSxHQUFBLENBQUEsSUFBQSxJQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsS0FBQSxXQUFBLEVBQUEsSUFBQSxPQUFBLEdBQUEsRUFBQSxJQUFBLGVBQUEsQ0FBQSxLQUFBLE9BQUEsS0FBQSxjQUFBLFFBQUEsU0FBQSxLQUFBLFdBQUEsR0FBQSxLQUFBLGVBQUEsSUFBQSxnQkFBQSxLQUFBLE9BQUEsS0FBQSxlQUFBLFNBQUEsS0FBQSxXQUFBLEVBQUEsR0FBQSxLQUFBLGVBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxFQUFBLFNBQUEsS0FBQSxXQUFBLEVBQUEsR0FBQSxJQUFBLE9BQUEsR0FBQSxFQUFBLFFBQUEsR0FBQSxTQUFBLEtBQUEsV0FBQSxFQUFBLElBQUEsSUFBQSxlQUFBLENBQUEsS0FBQSxPQUFBLEtBQUEsY0FBQSxRQUFBLEdBQUEsU0FBQSxLQUFBLFdBQUEsRUFBQSxJQUFBLE9BQUEsS0FBQSxlQUFBLGdCQUFBLGVBQUEsS0FBQSxXQUFBLEtBQUEsV0FBQSxDQUFBLFFBQUEsR0FBQSxFQUFBLEtBQUEsV0FBQSxJQUFBLEtBQUEsV0FBQSxFQUFBLEtBQUEsWUFBQSxLQUFBLE9BQUEsR0FBQSxLQUFBLFNBQUEsVUFBQSxDQUFBLE9BQUEsS0FBQSxhQUFBLEtBQUEsT0FBQSxPQUFBLEtBQUEsdUJBQUEsRUFBQSxFQUFBLEtBQUEsWUFBQSxJQUFBLEtBQUEsY0FBQSxTQUFBLGNBQUEsQ0FBQSxJQUFBLElBQUEsTUFBQSxJQUFBLENBQUEsR0FBQSxlQUFBLE9BQUEsRUFBQSxNQUFBLFFBQUEsT0FBQSxLQUFBLFlBQUEsT0FBQSxxQkFBQSxLQUFBLGdCQUFBLFNBQUEsS0FBQSx3QkFBQSxTQUFBLFdBQUEsQ0FBQSxJQUFBLE9BQUEsV0FBQSxRQUFBLEVBQUEsUUFBQSxHQUFBLG9CQUFBLElBQUEsTUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsS0FBQSxHQUFBLEdBQUEsT0FBQSxFQUFBLENBQUEsUUFBQSxLQUFBLFlBQUEsSUFBQSxJQUFBLFlBQUEsS0FBQSxNQUFBLFFBQUEsSUFBQSxhQUFBLFFBQUEsR0FBQSxTQUFBLG9CQUFBLGFBQUEsU0FBQSxvQkFBQSxjQUFBLFFBQUEsT0FBQSxHQUFBLFNBQUEsUUFBQSxLQUFBLFlBQUEsR0FBQSxTQUFBLG9CQUFBLFNBQUEsUUFBQSxTQUFBLE9BQUEsR0FBQSxPQUFBLFNBQUEsS0FBQSxnQkFBQSxTQUFBLFdBQUEsQ0FBQSxJQUFBLE9BQUEsV0FBQSxRQUFBLEVBQUEsUUFBQSxHQUFBLEdBQUEsUUFBQSxHQUFBLFFBQUEsS0FBQSxZQUFBLElBQUEsSUFBQSxVQUFBLFNBQUEsS0FBQSxHQUFBLFVBQUEsU0FBQSxLQUFBLFFBQUEsR0FBQSxHQUFBLFFBQUEsUUFBQSxLQUFBLFlBQUEsR0FBQSxHQUFBLFVBQUEsU0FBQSxLQUFBLFFBQUEsR0FBQSxHQUFBLFNBQUEsUUFBQSxLQUFBLFlBQUEsR0FBQSxRQUFBLEdBQUEsU0FBQSxjQUFBLE9BQUEsR0FBQSxPQUFBLFNBQUEsS0FBQSxpQkFBQSxTQUFBLFdBQUEsQ0FBQSxJQUFBLE9BQUEsV0FBQSxRQUFBLEVBQUEsT0FBQSxJQUFBLE1BQUEsR0FBQSxRQUFBLEtBQUEsWUFBQSxHQUFBLE9BQUEsS0FBQSxTQUFBLGVBQUEsT0FBQSxHQUFBLE9BQUEsUUFBQSxLQUFBLGVBQUEsU0FBQSxXQUFBLENBQUEsSUFBQSxPQUFBLFdBQUEsUUFBQSxFQUFBLGNBQUEsR0FBQSxFQUFBLENBQUEsUUFBQSxZQUFBLElBQUEsSUFBQSxVQUFBLFFBQUEsSUFBQSxXQUFBLFFBQUEsSUFBQSxTQUFBLENBQUEsWUFBQSxHQUFBLFVBQUEsYUFBQSxFQUFBLGFBQUEsT0FBQSxTQUFBLE1BQUEsU0FBQSxNQUFBLFNBQUEsTUFBQSxlQUFBLE9BQUEsYUFBQSxjQUFBLGVBQUEsT0FBQSxHQUFBLE9BQUEsZUFBQSxLQUFBLGlCQUFBLFdBQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxPQUFBLElBQUEsTUFBQSxZQUFBLEVBQUEsc0JBQUEsRUFBQSxlQUFBLEVBQUEsV0FBQSxJQUFBLENBQUEsSUFBQSxLQUFBLEtBQUEsV0FBQSxHQUFBLEdBQUEsS0FBQSxDQUFBLEdBQUEsT0FBQSxPQUFBLEVBQUEsTUFBQSxLQUFBLG1CQUFBLEdBQUEsTUFBQSxhQUFBLE1BQUEsdUJBQUEsTUFBQSxnQkFBQSxNQUFBLFdBQUEsS0FBQSxpQkFBQSxLQUFBLGNBQUEsS0FBQSxhQUFBLFFBQUEsS0FBQSxXQUFBLElBQUEsR0FBQSxXQUFBLEtBQUEsY0FBQSxNQUFBLFdBQUEsRUFBQSxLQUFBLHdCQUFBLFdBQUEsT0FBQSxNQUFBLEtBQUEsWUFBQSxJQUFBLElBQUEsU0FBQSxLQUFBLGdCQUFBLFlBQUEsR0FBQSxJQUFBLE1BQUEsU0FBQSxRQUFBLEVBQUEsRUFBQSxFQUFBLFNBQUEsT0FBQSxJQUFBLEdBQUEsR0FBQSxTQUFBLFdBQUEsR0FBQSxPQUFBLEtBQUEsSUFBQSxNQUFBLEtBQUEsc0JBQUEsSUFBQSxJQUFBLFNBQUEsS0FBQSx3QkFBQSxZQUFBLEdBQUEsSUFBQSxNQUFBLFNBQUEsUUFBQSxFQUFBLEVBQUEsRUFBQSxTQUFBLE9BQUEsSUFBQSxHQUFBLEdBQUEsU0FBQSxXQUFBLEdBQUEsT0FBQSxLQUFBLElBQUEsTUFBQSxLQUFBLGVBQUEsSUFBQSxpQkFBQSxLQUFBLGlCQUFBLFlBQUEsT0FBQSxLQUFBLGtCQUFBLE1BQUEsS0FBQSxXQUFBLElBQUEsU0FBQSxLQUFBLGVBQUEsWUFBQSxPQUFBLEtBQUEsV0FBQSxPQUFBLFNBQUEsWUFBQSxHQUFBLFlBQUEsb0JBQUEsU0FBQSxNQUFBLE9BQUEsQ0FBQSxJQUFBLElBQUEsTUFBQSxPQUFBLE1BQUEsT0FBQSxPQUFBLE9BQUEsT0FBQSxDQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUEsT0FBQSxRQUFBLE9BQUEsUUFBQSxFQUFBLENBQUEsSUFBQSxFQUFBLEtBQUEsTUFBQSxPQUFBLFNBQUEsRUFBQSxLQUFBLE1BQUEsT0FBQSxPQUFBLElBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLE9BQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxPQUFBLEtBQUEsNkJBQUEsT0FBQSxDQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsT0FBQSxRQUFBLEVBQUEsT0FBQSxDQUFBLEdBQUEsR0FBQSxRQUFBLE9BQUEsUUFBQSxNQUFBLEVBQUEsT0FBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLEdBQUEsT0FBQSxPQUFBLEdBQUEsRUFBQSxPQUFBLENBQUEsR0FBQSxHQUFBLFNBQUEsT0FBQSxPQUFBLEdBQUEsT0FBQSxFQUFBLE9BQUEsQ0FBQSxHQUFBLE9BQUEsQ0FBQSxFQUFBLElBQUEsSUFBQSxPQUFBLE9BQUEsT0FBQSxFQUFBLFFBQUEsR0FBQSxPQUFBLFFBQUEsRUFBQSxDQUFBLElBQUEsRUFBQSxLQUFBLE1BQUEsT0FBQSxTQUFBLEVBQUEsS0FBQSxNQUFBLE9BQUEsT0FBQSxJQUFBLEdBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxPQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsT0FBQSxLQUFBLDZCQUFBLE9BQUEsQ0FBQSxFQUFBLENBQUEsR0FBQSxHQUFBLE9BQUEsUUFBQSxFQUFBLE9BQUEsQ0FBQSxHQUFBLEdBQUEsUUFBQSxPQUFBLFFBQUEsTUFBQSxFQUFBLE9BQUEsQ0FBQSxHQUFBLENBQUEsR0FBQSxHQUFBLE9BQUEsT0FBQSxHQUFBLEVBQUEsT0FBQSxDQUFBLEdBQUEsR0FBQSxTQUFBLE9BQUEsT0FBQSxHQUFBLE9BQUEsRUFBQSxPQUFBLENBQUEsS0FBQSxZQUFBLFlBQUEsU0FBQSxNQUFBLFVBQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxLQUFBLElBQUEsVUFBQSxXQUFBLE9BQUEsSUFBQSxNQUFBLFdBQUEsR0FBQSxFQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsQ0FBQSxJQUFBLElBQUEsSUFBQSxPQUFBLE9BQUEsT0FBQSxFQUFBLEdBQUEsRUFBQSxFQUFBLElBQUEsRUFBQSxHQUFBLEVBQUEsT0FBQSxHQUFBLENBQUEsR0FBQSxHQUFBLEdBQUEsT0FBQSxFQUFBLEdBQUEsT0FBQSxVQUFBLGlCQUFBLFFBQUEsWUFBQSxvQkFBQSxNQUFBLFFBQUEsR0FBQSxDQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLEdBQUEsRUFBQSxDQUFBLElBQUEsT0FBQSxFQUFBLEtBQUEsTUFBQSxPQUFBLElBQUEsS0FBQSxNQUFBLE9BQUEsRUFBQSxJQUFBLE9BQUEsTUFBQSxFQUFBLElBQUEsTUFBQSxLQUFBLE1BQUEsT0FBQSxJQUFBLE9BQUEsTUFBQSxLQUFBLE1BQUEsT0FBQSxFQUFBLEtBQUEsT0FBQSxVQUFBLEtBQUEsUUFBQSxJQUFBLElBQUEsRUFBQSxPQUFBLFVBQUEsS0FBQSxPQUFBLEdBQUEsSUFBQSxJQUFBLEVBQUEsT0FBQSxVQUFBLEtBQUEsT0FBQSxHQUFBLEVBQUEsT0FBQSxVQUFBLEtBQUEsT0FBQSxHQUFBLElBQUEsS0FBQSxLQUFBLFlBQUEsR0FBQSxFQUFBLElBQUEsTUFBQSxPQUFBLENBQUEsS0FBQSw2QkFBQSxPQUFBLE1BQUEsWUFBQSxZQUFBLFNBQUEsTUFBQSxVQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxRQUFBLFFBQUEsUUFBQSxRQUFBLFFBQUEsUUFBQSxRQUFBLFFBQUEsQ0FBQSxJQUFBLFVBQUEscUJBQUEsNkJBQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLFFBQUEsUUFBQSxRQUFBLFFBQUEsUUFBQSxRQUFBLFFBQUEsU0FBQSxPQUFBLFlBQUEsWUFBQSxNQUFBLFVBQUEsWUFBQSxRQUFBLG9CQUFBLElBQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsT0FBQSxPQUFBLE9BQUEsT0FBQSxPQUFBLE9BQUEsT0FBQSxPQUFBLE9BQUEsT0FBQSxPQUFBLE9BQUEsT0FBQSxPQUFBLE9BQUEsT0FBQSxRQUFBLFFBQUEsU0FBQSxnQkFBQSxRQUFBLG9CQUFBLFNBQUEsY0FBQSxDQUFBLEdBQUEsRUFBQSxlQUFBLGNBQUEsR0FBQSxLQUFBLG9CQUFBLE9BQUEsUUFBQSxTQUFBLGNBQUEsSUFBQSxRQUFBLGtDQUFBLFNBQUEsVUFBQSxDQUFBLEdBQUEsVUFBQSxHQUFBLEVBQUEsS0FBQSwwQ0FBQSxHQUFBLENBQUEsT0FBQSxRQUFBLG9CQUFBLFVBQUEsSUFBQSxHQUFBLE1BQUEsSUFBQSxDQUFBLEtBQUEsOEJBQUEsUUFBQSx5QkFBQSxTQUFBLFlBQUEsQ0FBQSxJQUFBLElBQUEsZUFBQSxXQUFBLFlBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxRQUFBLG9CQUFBLE9BQUEsSUFBQSxDQUFBLElBQUEsY0FBQSxRQUFBLG9CQUFBLEdBQUEsR0FBQSxlQUFBLFlBQUEsT0FBQSxLQUFBLG9CQUFBLEVBQUEsR0FBQSxJQUFBLGVBQUEsa0JBQUEsaUJBQUEsWUFBQSxlQUFBLGVBQUEsaUJBQUEsWUFBQSxFQUFBLEVBQUEsZUFBQSxnQkFBQSxPQUFBLEdBQUEsZUFBQSxLQUFBLG9CQUFBLGFBQUEsTUFBQSxxQkFBQSw2QkFBQSxTQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsQ0FBQSxJQUFBLEtBQUEsS0FBQSxzQkFBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsS0FBQSxLQUFBLHNCQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsS0FBQSxPQUFBLEtBQUEsTUFBQSxPQUFBLHFCQUFBLHNCQUFBLFNBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLENBQUEsT0FBQSxJQUFBLEdBQUEsR0FBQSxJQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxLQUFBLEdBQUEsSUFBQSxJQUFBLHFCQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsRUFBQSxFQUFBLElBQUEsSUFBQSxHQUFBLEdBQUEsSUFBQSxHQUFBLEdBQUEsSUFBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsR0FBQSxHQUFBLFlBQUEsSUFBQSxJQUFBLElBQUEsSUFBQSxJQUFBLENBQUEsSUFBQSxJQUFBLElBQUEsS0FBQSxZQUFBLElBQUEsQ0FBQSxJQUFBLElBQUEsSUFBQSxLQUFBLFlBQUEsSUFBQSxxQkFBQSxHQUFBLEdBQUEsSUFBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsSUFBQSxHQUFBLEdBQUEsR0FBQSxJQUFBLEdBQUEsR0FBQSxJQUFBLElBQUEsS0FBQSxxQkFBQSxzQkFBQSxTQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLE9BQUEsS0FBQSxzQkFBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsZ0JBQUEsSUFBQSxvQkFBQSxNQUFBLDBCQUFBLElBQUEsTUFBQSxJQUFBLE1BQUEsTUFBQSxHQUFBLElBQUEsTUFBQSxNQUFBLEdBQUEsSUFBQSxNQUFBLE1BQUEsR0FBQSxJQUFBLE1BQUEsTUFBQSxHQUFBLElBQUEsTUFBQSxNQUFBLEdBQUEsSUFBQSxNQUFBLE1BQUEsR0FBQSxJQUFBLE1BQUEsTUFBQSxHQUFBLElBQUEsTUFBQSxNQUFBLEdBQUEsSUFBQSxNQUFBLE1BQUEsR0FBQSxJQUFBLE1BQUEsTUFBQSxHQUFBLElBQUEsTUFBQSxNQUFBLElBQUEsSUFBQSxNQUFBLE1BQUEsSUFBQSxJQUFBLE1BQUEsTUFBQSxJQUFBLElBQUEsTUFBQSxNQUFBLElBQUEsSUFBQSxNQUFBLE1BQUEsSUFBQSxJQUFBLE1BQUEsTUFBQSxJQUFBLElBQUEsTUFBQSxLQUFBLElBQUEsSUFBQSxNQUFBLEtBQUEsSUFBQSxJQUFBLE1BQUEsS0FBQSxJQUFBLElBQUEsTUFBQSxLQUFBLElBQUEsSUFBQSxNQUFBLEtBQUEsSUFBQSxJQUFBLE1BQUEsSUFBQSxJQUFBLElBQUEsTUFBQSxLQUFBLElBQUEsSUFBQSxNQUFBLEtBQUEsSUFBQSxJQUFBLE1BQUEsTUFBQSxJQUFBLElBQUEsTUFBQSxNQUFBLElBQUEsSUFBQSxNQUFBLE1BQUEsSUFBQSxJQUFBLE1BQUEsTUFBQSxJQUFBLElBQUEsTUFBQSxLQUFBLElBQUEsSUFBQSxNQUFBLEtBQUEsSUFBQSxJQUFBLE1BQUEsTUFBQSxJQUFBLElBQUEsTUFBQSxNQUFBLEtBQUEsc0JBQUEsSUFBQSxNQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEdBQUEsa0JBQUEsaUJBQUEsU0FBQSxFQUFBLEVBQUEsQ0FBQSxPQUFBLEdBQUEsRUFBQSxzQkFBQSxHQUFBLEdBQUEsc0JBQUEsR0FBQSxRQUFBLEVBQUEsSUFBQSxzQkFBQSxHQUFBLFFBQUEsRUFBQSxJQUFBLHNCQUFBLEdBQUEsUUFBQSxFQUFBLEtBQUEsc0JBQUEsR0FBQSxRQUFBLEVBQUEsS0FBQSxzQkFBQSxHQUFBLFFBQUEsRUFBQSxLQUFBLHNCQUFBLEdBQUEsUUFBQSxFQUFBLEtBQUEsc0JBQUEsR0FBQSxRQUFBLEVBQUEsTUFBQSxrQkFBQSx3QkFBQSxTQUFBLGlCQUFBLENBQUEsSUFBQSxXQUFBLGtCQUFBLDBCQUFBLGtCQUFBLE9BQUEsTUFBQSxXQUFBLFdBQUEsa0JBQUEsMEJBQUEsaUJBQUEsc0JBQUEsa0JBQUEsMEJBQUEsU0FBQSxpQkFBQSxDQUFBLElBQUEsSUFBQSxlQUFBLFdBQUEsZUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLDBCQUFBLE9BQUEsSUFBQSxDQUFBLElBQUEsV0FBQSwwQkFBQSxHQUFBLFdBQUEsV0FBQSxHQUFBLEdBQUEsWUFBQSxpQkFBQSxPQUFBLElBQUEsa0JBQUEsV0FBQSxJQUFBLElBQUEsZUFBQSxLQUFBLGlCQUFBLGlCQUFBLFlBQUEsZUFBQSxpQkFBQSxlQUFBLFdBQUEsR0FBQSxlQUFBLGdCQUFBLE9BQUEsR0FBQSxlQUFBLElBQUEsa0JBQUEsZ0JBQUEsTUFBQSxxQkFBQSxRQUFBLFNBQUEsS0FBQSxDQUFBLEdBQUEsRUFBQSxNQUFBLE1BQUEsU0FBQSxPQUFBLEtBQUEsb0JBQUEsT0FBQSxTQUFBLE9BQUEsSUFBQSxFQUFBLElBQUEscUJBQUEsRUFBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLHFCQUFBLEVBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxxQkFBQSxFQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEscUJBQUEsRUFBQSxFQUFBLEtBQUEsU0FBQSxJQUFBLE1BQUEsRUFBQSxFQUFBLEVBQUEsR0FBQSxVQUFBLGNBQUEsU0FBQSxhQUFBLFFBQUEsUUFBQSxDQUFBLEdBQUEsYUFBQSxRQUFBLFFBQUEsZUFBQSxLQUFBLG9CQUFBLElBQUEsSUFBQSxTQUFBLFFBQUEsb0JBQUEsU0FBQSxZQUFBLEVBQUEsYUFBQSxTQUFBLGNBQUEsRUFBQSxFQUFBLEVBQUEsYUFBQSxPQUFBLElBQUEsYUFBQSxhQUFBLEdBQUEsTUFBQSxJQUFBLElBQUEsT0FBQSxJQUFBLE1BQUEsYUFBQSxnQkFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLGFBQUEsT0FBQSxJQUFBLElBQUEsSUFBQSxRQUFBLGFBQUEsR0FBQSxFQUFBLEVBQUEsRUFBQSxRQUFBLE1BQUEsSUFBQSxDQUFBLElBQUEsaUJBQUEsUUFBQSxjQUFBLGtCQUFBLFNBQUEsb0JBQUEsaUJBQUEsT0FBQSxtQkFBQSxJQUFBLFVBQUEsaUJBQUEsSUFBQSxNQUFBLG9CQUFBLElBQUEsSUFBQSw0QkFBQSxPQUFBLEdBQUEsVUFBQSxPQUFBLG9CQUFBLE9BQUEsT0FBQSxFQUFBLHFCQUFBLEdBQUEsQ0FBQSxJQUFBLGFBQUEsT0FBQSxxQkFBQSxVQUFBLE9BQUEsR0FBQSxjQUFBLDRCQUFBLE1BQUEsc0JBQUEsc0JBQUEsSUFBQSxJQUFBLDhCQUFBLDRCQUFBLFNBQUEsb0JBQUEsbUJBQUEsRUFBQSxFQUFBLEVBQUEsOEJBQUEsRUFBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsZ0JBQUEsRUFBQSxJQUFBLE9BQUEsR0FBQSxVQUFBLEdBQUEsYUFBQSxzQkFBQSxJQUFBLElBQUEsRUFBQSxvQkFBQSxnQkFBQSxFQUFBLElBQUEsT0FBQSxHQUFBLFVBQUEsK0JBQUEsYUFBQSxzQkFBQSxJQUFBLElBQUEsSUFBQSxPQUFBLEdBQUEsVUFBQSxPQUFBLEVBQUEsOEJBQUEsSUFBQSxFQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxnQkFBQSxFQUFBLElBQUEsQ0FBQSxJQUFBLFFBQUEsb0JBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxPQUFBLEdBQUEsVUFBQSxTQUFBLGFBQUEsc0JBQUEsT0FBQSxRQUFBLFNBQUEsR0FBQSxTQUFBLGFBQUEsU0FBQSxVQUFBLENBQUEsR0FBQSxFQUFBLFdBQUEsVUFBQSxFQUFBLEtBQUEsMkJBQUEsT0FBQSxTQUFBLFdBQUEsWUFBQSxTQUFBLFdBQUEsSUFBQSxNQUFBLElBQUEsWUFBQSxJQUFBLFlBQUEsSUFBQSxZQUFBLElBQUEsWUFBQSxJQUFBLFlBQUEsSUFBQSxZQUFBLElBQUEsWUFBQSxJQUFBLGFBQUEsTUFBQSxjQUFBLElBQUEsTUFBQSxLQUFBLE1BQUEsa0JBQUEsSUFBQSxNQUFBLEtBQUEsTUFBQSxjQUFBLFNBQUEsRUFBQSxFQUFBLENBQUEsT0FBQSxFQUFBLEdBQUEsUUFBQSxHQUFBLFFBQUEsVUFBQSxJQUFBLG1CQUFBLE1BQUEsZUFBQSxRQUFBLGNBQUEsU0FBQSxjQUFBLGlCQUFBLENBQUEsSUFBQSxJQUFBLGFBQUEsY0FBQSxPQUFBLGNBQUEsSUFBQSxNQUFBLGNBQUEsRUFBQSxFQUFBLGFBQUEsRUFBQSxJQUFBLGNBQUEsR0FBQSxJQUFBLGNBQUEsR0FBQSxJQUFBLGVBQUEsY0FBQSxPQUFBLGlCQUFBLEdBQUEsQ0FBQSxRQUFBLFVBQUEsT0FBQSxjQUFBLGdCQUFBLE1BQUEsSUFBQSxDQUFBLE1BQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLGlCQUFBLEVBQUEsSUFBQSxjQUFBLEdBQUEsY0FBQSxJQUFBLFFBQUEsT0FBQSxTQUFBLEtBQUEsQ0FBQSxJQUFBLElBQUEsT0FBQSxJQUFBLGdCQUFBLE1BQUEsUUFBQSxPQUFBLGNBQUEsUUFBQSxPQUFBLHdCQUFBLHFCQUFBLFVBQUEsT0FBQSxnQkFBQSxXQUFBLFVBQUEsY0FBQSxVQUFBLFFBQUEsU0FBQSxXQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsV0FBQSxPQUFBLElBQUEsWUFBQSxXQUFBLEdBQUEsaUJBQUEsSUFBQSxJQUFBLFlBQUEsSUFBQSxNQUFBLFlBQUEsYUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLFdBQUEsT0FBQSxJQUFBLENBQUEsSUFBQSxVQUFBLFdBQUEsR0FBQSxjQUFBLFVBQUEsVUFBQSxpQkFBQSxVQUFBLGlCQUFBLFFBQUEsY0FBQSxjQUFBLGtCQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsaUJBQUEsRUFBQSxJQUFBLFlBQUEsZ0JBQUEsY0FBQSxHQUFBLElBQUEsT0FBQSxJQUFBLHNCQUFBLFlBQUEsUUFBQSxjQUFBLFFBQUEsTUFBQSxPQUFBLFFBQUEsT0FBQSxHQUFBLE9BQUEsVUFBQSxLQUFBLE9BQUEsTUFBQSxFQUFBLE9BQUEsT0FBQSxFQUFBLE9BQUEsYUFBQSxLQUFBLE9BQUEsTUFBQSxDQUFBLEVBQUEsT0FBQSxxQkFBQSxDQUFBLENBQUEsR0FBQSxFQUFBLEVBQUEsR0FBQSxDQUFBLEdBQUEsR0FBQSxHQUFBLElBQUEsQ0FBQSxHQUFBLEdBQUEsR0FBQSxLQUFBLE9BQUEsU0FBQSxLQUFBLE9BQUEsT0FBQSxTQUFBLElBQUEsQ0FBQSxHQUFBLEdBQUEsVUFBQSxPQUFBLENBQUEsSUFBQSxVQUFBLFNBQUEsZUFBQSxhQUFBLFFBQUEsVUFBQSxXQUFBLE1BQUEsT0FBQSxPQUFBLE1BQUEsVUFBQSxNQUFBLE9BQUEsT0FBQSxVQUFBLE9BQUEsT0FBQSxVQUFBLFFBQUEsYUFBQSxFQUFBLEVBQUEsT0FBQSxNQUFBLE9BQUEsUUFBQSxPQUFBLE9BQUEsT0FBQSxRQUFBLFNBQUEsTUFBQSxPQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUEsUUFBQSxPQUFBLE9BQUEsSUFBQSxNQUFBLElBQUEsTUFBQSxNQUFBLE9BQUEsVUFBQSxDQUFBLElBQUEsVUFBQSxTQUFBLGNBQUEsVUFBQSxRQUFBLFVBQUEsV0FBQSxNQUFBLFdBQUEsU0FBQSxlQUFBLGNBQUEsR0FBQSxNQUFBLFdBQUEsQ0FBQSxJQUFBLE9BQUEsV0FBQSxXQUFBLE1BQUEsT0FBQSxVQUFBLEVBQUEsRUFBQSxJQUFBLEtBQUEsT0FBQSxVQUFBLE1BQUEsRUFBQSxFQUFBLElBQUEsS0FBQSxVQUFBLE1BQUEsTUFBQSxNQUFBLFVBQUEsT0FBQSxNQUFBLE9BQUEsUUFBQSxVQUFBLE1BQUEsRUFBQSxHQUFBLE9BQUEsTUFBQSxNQUFBLE1BQUEsT0FBQSxPQUFBLE1BQUEsT0FBQSxHQUFBLENBQUEsT0FBQSxVQUFBLFFBQUEsYUFBQSxFQUFBLEVBQUEsTUFBQSxNQUFBLE1BQUEsUUFBQSxNQUFBLEVBQUEsQ0FBQSxPQUFBLE9BQUEsT0FBQSxrSEFBQSxLQUFBLE1BQUEsT0FBQSxVQUFBLE9BQUEsU0FBQSxPQUFBLFNBQUEsR0FBQSxDQUFBLE9BQUEsT0FBQSxPQUFBLFFBQUEsU0FBQSxNQUFBLEVBQUEsQ0FBQSxRQUFBLElBQUEsR0FBQSxPQUFBLE9BQUEseUJBQUEsTUFBQSxPQUFBLFVBQUEsT0FBQSxTQUFBLE9BQUEsU0FBQSxNQUFBLElBQUEsS0FBQSxPQUFBLFlBQUEsU0FBQSxFQUFBLENBQUEsT0FBQSxtQkFBQSxPQUFBLEtBQUEsT0FBQSxRQUFBLFNBQUEsSUFBQSxDQUFBLElBQUEsTUFBQSxDQUFBLElBQUEsTUFBQSxVQUFBLE1BQUEsT0FBQSxrQkFBQSxPQUFBLGFBQUEsR0FBQSxPQUFBLE1BQUEsQ0FBQSxJQUFBLElBQUEsRUFBQSxFQUFBLEVBQUEsT0FBQSxPQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxFQUFBLE9BQUEsTUFBQSxJQUFBLENBQUEsSUFBQSxNQUFBLEVBQUEsRUFBQSxFQUFBLE9BQUEsTUFBQSxFQUFBLE9BQUEsVUFBQSxLQUFBLFFBQUEsTUFBQSxFQUFBLEVBQUEsT0FBQSxPQUFBLEdBQUEsT0FBQSxVQUFBLEtBQUEsTUFBQSxJQUFBLE1BQUEsRUFBQSxFQUFBLE9BQUEsT0FBQSxHQUFBLE9BQUEsVUFBQSxLQUFBLE1BQUEsR0FBQSxNQUFBLEVBQUEsRUFBQSxPQUFBLE9BQUEsSUFBQSxFQUFBLElBQUEsYUFBQSxPQUFBLFVBQUEsRUFBQSxHQUFBLElBQUEsU0FBQSxJQUFBLFNBQUEsT0FBQSxhQUFBLFNBQUEsU0FBQSxPQUFBLE9BQUEsSUFBQSxhQUFBLE9BQUEsVUFBQSxFQUFBLEdBQUEsSUFBQSxJQUFBLE9BQUEsUUFBQSxPQUFBLGFBQUEsTUFBQSxLQUFBLE9BQUEsU0FBQSxJQUFBLEdBQUEsRUFBQSxFQUFBLEVBQUEsS0FBQSxPQUFBLElBQUEsSUFBQSxJQUFBLEVBQUEsRUFBQSxFQUFBLEtBQUEsR0FBQSxPQUFBLElBQUEsS0FBQSxPQUFBLGFBQUEsS0FBQSxHQUFBLElBQUEsSUFBQSxJQUFBLENBQUEsSUFBQSxNQUFBLFVBQUEsS0FBQSxJQUFBLE1BQUEsT0FBQSxRQUFBLElBQUEsTUFBQSxPQUFBLFlBQUEsTUFBQSxPQUFBLFNBQUEsU0FBQSxFQUFBLEVBQUEsQ0FBQSxHQUFBLE9BQUEsTUFBQSxFQUFBLEtBQUEsY0FBQSxHQUFBLE9BQUEsT0FBQSxFQUFBLEtBQUEsY0FBQSxPQUFBLE1BQUEsRUFBQSxFQUFBLEVBQUEsT0FBQSxNQUFBLEVBQUEsRUFBQSxDQUFBLEdBQUEsT0FBQSxVQUFBLEtBQUEsT0FBQSxHQUFBLE9BQUEsVUFBQSxLQUFBLE1BQUEsR0FBQSxHQUFBLE9BQUEsVUFBQSxLQUFBLE1BQUEsSUFBQSxJQUFBLEdBQUEsT0FBQSxTQUFBLFNBQUEsR0FBQSxDQUFBLElBQUEsSUFBQSxJQUFBLElBQUEsTUFBQSxPQUFBLE1BQUEsT0FBQSxRQUFBLEVBQUEsRUFBQSxFQUFBLE9BQUEsT0FBQSxJQUFBLElBQUEsSUFBQSxFQUFBLEVBQUEsRUFBQSxPQUFBLE1BQUEsSUFBQSxDQUFBLElBQUEsS0FBQSxPQUFBLFNBQUEsRUFBQSxHQUFBLElBQUEsRUFBQSxFQUFBLE9BQUEsT0FBQSxJQUFBLEtBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxPQUFBLEtBQUEsT0FBQSwyQkFBQSxTQUFBLE1BQUEsQ0FBQSxJQUFBLElBQUEsWUFBQSxFQUFBLFVBQUEsS0FBQSxNQUFBLE9BQUEsTUFBQSxhQUFBLFdBQUEsS0FBQSxNQUFBLE9BQUEsT0FBQSxhQUFBLE9BQUEsSUFBQSxNQUFBLGFBQUEsRUFBQSxFQUFBLFlBQUEsRUFBQSxJQUFBLENBQUEsT0FBQSxHQUFBLElBQUEsTUFBQSxhQUFBLElBQUEsSUFBQSxHQUFBLEVBQUEsWUFBQSxHQUFBLEtBQUEsT0FBQSxHQUFBLElBQUEsSUFBQSxNQUFBLEVBQUEsR0FBQSxJQUFBLElBQUEsR0FBQSxFQUFBLFlBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxHQUFBLEVBQUEsWUFBQSxHQUFBLEtBQUEsQ0FBQSxPQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsSUFBQSxJQUFBLEdBQUEsRUFBQSxXQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsR0FBQSxFQUFBLFVBQUEsR0FBQSxLQUFBLENBQUEsSUFBQSxPQUFBLE1BQUEsVUFBQSxHQUFBLEdBQUEsQ0FBQSxXQUFBLEdBQUEsSUFBQSxPQUFBLE9BQUEsT0FBQSxPQUFBLElBQUEsSUFBQSxLQUFBLE9BQUEsSUFBQSxJQUFBLEdBQUEsUUFBQSxPQUFBLE9BQUEsSUFBQSxJQUFBLEtBQUEsT0FBQSxJQUFBLElBQUEsR0FBQSxTQUFBLElBQUEsSUFBQSxPQUFBLElBQUEsTUFBQSxhQUFBLEdBQUEsRUFBQSxZQUFBLEdBQUEsS0FBQSxPQUFBLElBQUEsSUFBQSxNQUFBLGFBQUEsSUFBQSxJQUFBLEdBQUEsRUFBQSxZQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsR0FBQSxFQUFBLFlBQUEsR0FBQSxLQUFBLE9BQUEsSUFBQSxJQUFBLEtBQUEsTUFBQSxDQUFBLE9BQUEsSUFBQSxJQUFBLEdBQUEsT0FBQSxJQUFBLElBQUEsSUFBQSxHQUFBLE9BQUEsUUFBQSxPQUFBLGtCQUFBLFNBQUEsVUFBQSxDQUFBLElBQUEsSUFBQSxPQUFBLE9BQUEsMkJBQUEsV0FBQSxZQUFBLE9BQUEsT0FBQSxVQUFBLEtBQUEsTUFBQSxPQUFBLE1BQUEsYUFBQSxXQUFBLEtBQUEsTUFBQSxPQUFBLE9BQUEsYUFBQSxPQUFBLElBQUEsTUFBQSxPQUFBLE9BQUEsT0FBQSxPQUFBLEdBQUEsRUFBQSxZQUFBLEdBQUEsS0FBQSxJQUFBLElBQUEsR0FBQSxFQUFBLFlBQUEsR0FBQSxLQUFBLElBQUEsSUFBQSxHQUFBLEVBQUEsV0FBQSxHQUFBLEtBQUEsSUFBQSxJQUFBLEdBQUEsRUFBQSxVQUFBLEdBQUEsS0FBQSxPQUFBLFVBQUEsR0FBQSxHQUFBLENBQUEsV0FBQSxHQUFBLElBQUEsT0FBQSxPQUFBLFVBQUEsVUFBQSxHQUFBLEdBQUEsQ0FBQSxXQUFBLEdBQUEsSUFBQSxPQUFBLE9BQUEsT0FBQSxJQUFBLElBQUEsQ0FBQSxFQUFBLENBQUE7SUFDQSxPQUFBLFFBQUEsT0FBQSxVQUFBLFVBQUEsQ0FBQSxJQUFBLElBQUEsSUFBQSxJQUFBLE1BQUEsT0FBQSxNQUFBLE9BQUEsUUFBQSxFQUFBLEVBQUEsRUFBQSxPQUFBLE9BQUEsSUFBQSxJQUFBLElBQUEsRUFBQSxFQUFBLEVBQUEsT0FBQSxNQUFBLElBQUEsQ0FBQSxJQUFBLEtBQUEsT0FBQSxTQUFBLEVBQUEsR0FBQSxJQUFBLEVBQUEsRUFBQSxPQUFBLE9BQUEsS0FBQSxPQUFBLEtBQUEsTUFBQSxVQUFBLE9BQUEsU0FBQSxLQUFBLEdBQUEsQ0FBQSxJQUFBLEtBQUEsS0FBQSxNQUFBLENBQUEsSUFBQSxNQUFBLEdBQUEsS0FBQSxRQUFBLE9BQUEsS0FBQSxPQUFBLEVBQUEsS0FBQSxLQUFBLE9BQUEsS0FBQSxLQUFBLEtBQUEsS0FBQSxNQUFBLEtBQUEsT0FBQSxJQUFBLFNBQUEsRUFBQSxZQUFBLEdBQUEsbUJBQUEsRUFBQSxjQUFBLEVBQUEsT0FBQSxrQkFBQSxTQUFBLFNBQUEsQ0FBQSxTQUFBLFNBQUEsU0FBQSxTQUFBLENBQUEsT0FBQSxNQUFBLFNBQUEsRUFBQSxTQUFBLEVBQUEsTUFBQSxTQUFBLEVBQUEsU0FBQSxFQUFBLEtBQUEsS0FBQSxNQUFBLE1BQUEsTUFBQSxPQUFBLFNBQUEsY0FBQSxPQUFBLE9BQUEsT0FBQSxDQUFBLElBQUEsR0FBQSxPQUFBLEVBQUEsR0FBQSxPQUFBLEVBQUEsTUFBQSxDQUFBLE9BQUEsRUFBQSxLQUFBLE9BQUEsRUFBQSxJQUFBLENBQUEsT0FBQSxFQUFBLEtBQUEsT0FBQSxFQUFBLElBQUEsSUFBQSxPQUFBLE9BQUEsT0FBQSxnQkFBQSxTQUFBLFNBQUEsR0FBQSxTQUFBLElBQUEsZUFBQSxTQUFBLFNBQUEsR0FBQSxTQUFBLElBQUEsZ0JBQUEsU0FBQSxTQUFBLEdBQUEsU0FBQSxJQUFBLEdBQUEsZ0JBQUEsaUJBQUEsZ0JBQUEsaUJBQUEsT0FBQSxTQUFBLEdBQUEsT0FBQSxTQUFBLEdBQUEsT0FBQSxTQUFBLElBQUEsaUJBQUEsZ0JBQUEsaUJBQUEsaUJBQUEsT0FBQSxTQUFBLEdBQUEsT0FBQSxTQUFBLEdBQUEsT0FBQSxTQUFBLEtBQUEsT0FBQSxTQUFBLEdBQUEsT0FBQSxTQUFBLEdBQUEsT0FBQSxTQUFBLElBQUEsY0FBQSxPQUFBLE9BQUEsUUFBQSxFQUFBLENBQUEsSUFBQSxLQUFBLE9BQUEsT0FBQSxPQUFBLE9BQUEsS0FBQSxTQUFBLEdBQUEsT0FBQSxTQUFBLEdBQUEsT0FBQSxTQUFBLEdBQUE7QUNGQSxRQUFBLE9BQUE7R0FDQSxXQUFBLHFCQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFFBQUEsT0FBQSxXQUFBLGlCQUFBO01BQ0EsT0FBQSxvQkFBQSxVQUFBOztNQUVBLGlCQUFBLFVBQUEsVUFBQSxLQUFBLEtBQUEsS0FBQTs7OztNQUlBLE9BQUEsaUJBQUEsWUFBQSxFQUFBLE9BQUEsZUFBQSxDQUFBLE9BQUE7OztNQUdBLE9BQUEsa0JBQUEsVUFBQTtRQUNBO1dBQ0EsT0FBQSxPQUFBLGtCQUFBLEtBQUEsT0FBQTtXQUNBLEtBQUE7OzthQUdBOzs7Ozs7O0FDdEJBLFFBQUEsT0FBQSxPQUFBLFdBQUEsdUJBQUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFNBQUEsUUFBQSxRQUFBLGNBQUEsa0JBQUE7O0lBRUEsT0FBQSxhQUFBOzs7Ozs7SUFNQSxFQUFBLGNBQUE7OztJQUdBLFNBQUEsY0FBQTtNQUNBLGlCQUFBLFNBQUEsS0FBQTs7Ozs7SUFLQTs7SUFFQSxPQUFBLGNBQUEsU0FBQSxRQUFBLFdBQUE7O01BRUEsT0FBQTtNQUNBLE9BQUEsR0FBQSx1QkFBQTtRQUNBLElBQUEsVUFBQTs7OztJQUlBLE9BQUEsa0JBQUEsV0FBQTs7TUFFQSxLQUFBLDhCQUFBO1FBQ0EsU0FBQSxDQUFBLFFBQUEsQ0FBQSxNQUFBLFNBQUEsT0FBQSxLQUFBLFNBQUEsT0FBQSxLQUFBLENBQUEsTUFBQSxhQUFBLE9BQUEsS0FBQSxTQUFBO1FBQ0EsU0FBQSxDQUFBLFNBQUEsU0FBQSxZQUFBLENBQUEsYUFBQSxvQ0FBQSxNQUFBOztPQUVBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUF3Q0EsT0FBQSxrQkFBQSxTQUFBLFFBQUEsV0FBQSxPQUFBO01BQ0EsT0FBQTtNQUNBLEtBQUE7UUFDQSxTQUFBO1VBQ0EsUUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7VUFFQSxRQUFBO1lBQ0EsV0FBQTtZQUNBLFlBQUE7WUFDQSxNQUFBO1lBQ0EsT0FBQTtZQUNBLFNBQUE7OztRQUdBLFlBQUE7UUFDQSxNQUFBO1FBQ0EsTUFBQSw2QkFBQSxVQUFBLFFBQUE7UUFDQSxPQUFBO1NBQ0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbkdBLFFBQUEsT0FBQSxPQUFBLFdBQUEsaUJBQUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFNBQUEsUUFBQSxRQUFBLGNBQUEsYUFBQTtJQUNBLE9BQUEsUUFBQTtJQUNBLE9BQUEsUUFBQTs7Ozs7O0lBTUEsRUFBQSxjQUFBOzs7OztJQUtBLFlBQUEsUUFBQSxhQUFBLE1BQUEsYUFBQSxNQUFBLGFBQUEsT0FBQSxPQUFBO0tBQ0EsS0FBQTs7OztJQUlBLE9BQUEsWUFBQSxXQUFBO01BQ0EsSUFBQSxnQkFBQSxPQUFBLE1BQUE7UUFDQTs7O01BR0EsSUFBQSxPQUFBLGNBQUEsa0JBQUE7UUFDQSxnQkFBQSxjQUFBO1VBQ0E7OztNQUdBLElBQUEsT0FBQSxjQUFBLFVBQUE7UUFDQSxnQkFBQSxjQUFBO1VBQ0E7OztNQUdBLElBQUEsT0FBQSxjQUFBLFdBQUE7UUFDQSxnQkFBQSxjQUFBO1VBQ0E7OztNQUdBLElBQUEsT0FBQSxjQUFBLFVBQUE7UUFDQSxnQkFBQSxjQUFBO1VBQ0E7OztNQUdBLElBQUEsT0FBQSxjQUFBLFdBQUE7UUFDQSxnQkFBQSxjQUFBO1VBQ0E7OztNQUdBLElBQUEsVUFBQSxFQUFBLE1BQUEsS0FBQTs7TUFFQSxLQUFBO1FBQ0EsT0FBQTtRQUNBLE1BQUE7OztRQUdBLE1BQUE7UUFDQSxTQUFBLENBQUEsVUFBQTtRQUNBLFlBQUE7U0FDQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDL0RBLFFBQUEsT0FBQSxPQUFBLFdBQUEsc0JBQUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLFNBQUEsUUFBQSxRQUFBLGNBQUEsa0JBQUE7Ozs7OztJQU1BLEVBQUEsY0FBQTs7Ozs7O0lBTUEsT0FBQSxjQUFBLFVBQUE7O01BRUEsSUFBQSxPQUFBLFFBQUEsT0FBQSxNQUFBO1FBQ0EsS0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUEsQ0FBQSxVQUFBO1VBQ0EsWUFBQTtXQUNBLEtBQUE7Ozs7Ozs7Ozs7Ozs7OztXQWVBO1FBQ0EsS0FBQSxVQUFBLDRCQUFBOzs7Ozs7Ozs7QUMxQ0EsUUFBQSxPQUFBO0dBQ0EsV0FBQSxxQkFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBQSxRQUFBLE1BQUEsZ0JBQUEsWUFBQTs7TUFFQSxPQUFBLFdBQUE7TUFDQTtTQUNBO1NBQ0EsS0FBQTs7OztNQUlBLFNBQUEsZUFBQSxTQUFBO1FBQ0EsT0FBQSxVQUFBOztRQUVBLFNBQUEsV0FBQSxJQUFBLEtBQUEsU0FBQTtRQUNBLFNBQUEsWUFBQSxJQUFBLEtBQUEsU0FBQTtRQUNBLFNBQUEsY0FBQSxJQUFBLEtBQUEsU0FBQTtRQUNBLFNBQUEsWUFBQSxJQUFBLEtBQUEsU0FBQTtRQUNBLFNBQUEsVUFBQSxJQUFBLEtBQUEsU0FBQTs7UUFFQSxPQUFBLFdBQUE7Ozs7O01BS0EsT0FBQSxvQkFBQSxZQUFBO1FBQ0E7V0FDQSxrQkFBQSxPQUFBLFNBQUE7V0FDQSxLQUFBOzs7Ozs7Ozs7OztNQVdBO1NBQ0E7U0FDQSxLQUFBOzs7O1FBSUEsT0FBQSxrQkFBQSxVQUFBO1VBQ0E7YUFDQSx3QkFBQSxPQUFBLFVBQUEsUUFBQSxNQUFBLElBQUEsTUFBQTthQUNBLEtBQUE7Ozs7Ozs7O01BUUEsT0FBQSxhQUFBLFNBQUEsS0FBQTtRQUNBLElBQUEsQ0FBQSxLQUFBO1VBQ0EsT0FBQTs7OztRQUlBLE9BQUEsT0FBQSxNQUFBLE9BQUEsTUFBQSxPQUFBO1VBQ0EsTUFBQSxLQUFBLGVBQUEsTUFBQSxLQUFBOzs7O01BSUEsU0FBQSxVQUFBLEtBQUE7UUFDQSxPQUFBLElBQUE7VUFDQSxLQUFBO1VBQ0EsS0FBQTtVQUNBLEtBQUE7VUFDQSxLQUFBO1VBQ0EsS0FBQTs7OztNQUlBLE9BQUEsMEJBQUEsVUFBQTs7UUFFQSxJQUFBLE9BQUEsVUFBQSxPQUFBLFNBQUEsVUFBQTtRQUNBLElBQUEsUUFBQSxVQUFBLE9BQUEsU0FBQSxXQUFBOztRQUVBLElBQUEsT0FBQSxLQUFBLFFBQUEsS0FBQSxTQUFBLGFBQUEsVUFBQSxVQUFBO1VBQ0EsT0FBQSxLQUFBLFdBQUEsa0NBQUE7O1FBRUEsSUFBQSxRQUFBLE1BQUE7VUFDQSxLQUFBLFdBQUEsNkNBQUE7VUFDQTs7O1FBR0E7V0FDQSx3QkFBQSxNQUFBO1dBQ0EsS0FBQTs7Ozs7O01BTUEsT0FBQSwwQkFBQSxVQUFBLE9BQUE7UUFDQSxPQUFBLFNBQUEsWUFBQSxJQUFBLE1BQUEsT0FBQSxPQUFBLFNBQUEsVUFBQSxJQUFBLE9BQUE7Ozs7O01BS0EsT0FBQSxtQkFBQSxVQUFBOztRQUVBLElBQUEsUUFBQSxVQUFBLE9BQUEsU0FBQSxXQUFBO1FBQ0EsSUFBQSxNQUFBLFVBQUEsT0FBQSxTQUFBLFNBQUE7O1FBRUEsSUFBQSxRQUFBLEtBQUEsTUFBQSxLQUFBLFVBQUEsYUFBQSxRQUFBLFVBQUE7VUFDQSxPQUFBLEtBQUEsV0FBQSxrQ0FBQTs7UUFFQSxJQUFBLFNBQUEsSUFBQTtVQUNBLEtBQUEsV0FBQSxxQ0FBQTtVQUNBOzs7UUFHQTtXQUNBLGlCQUFBLE9BQUE7V0FDQSxLQUFBOzs7Ozs7TUFNQSxPQUFBLG1CQUFBLFVBQUEsT0FBQTtRQUNBLE9BQUEsU0FBQSxVQUFBLElBQUEsTUFBQSxPQUFBLE9BQUEsU0FBQSxXQUFBLElBQUEsT0FBQTs7Ozs7TUFLQSxPQUFBLHlCQUFBLFVBQUE7UUFDQSxJQUFBLFlBQUEsVUFBQSxPQUFBLFNBQUEsYUFBQTs7UUFFQTtXQUNBLHVCQUFBO1dBQ0EsS0FBQTs7Ozs7OztNQU9BLE9BQUEsMEJBQUEsVUFBQSxPQUFBO1FBQ0EsT0FBQSxTQUFBLGNBQUEsSUFBQSxNQUFBLE9BQUEsT0FBQSxTQUFBLFdBQUEsU0FBQSxPQUFBOzs7TUFHQSxPQUFBLDBCQUFBLFVBQUE7UUFDQSxJQUFBLFlBQUEsVUFBQSxPQUFBLFNBQUEsYUFBQTs7UUFFQTtXQUNBLHVCQUFBO1dBQ0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQW1CQSxJQUFBLFlBQUEsSUFBQSxTQUFBOztNQUVBLE9BQUEsa0JBQUEsU0FBQSxLQUFBO1FBQ0EsT0FBQSxLQUFBLFlBQUEsVUFBQSxTQUFBOzs7TUFHQSxPQUFBLHFCQUFBLFVBQUE7UUFDQSxJQUFBLE9BQUEsT0FBQSxTQUFBO1FBQ0E7V0FDQSxtQkFBQTtXQUNBLEtBQUE7Ozs7OztNQU1BLE9BQUEsbUJBQUEsVUFBQTtRQUNBLElBQUEsYUFBQSxPQUFBLFNBQUE7UUFDQTtXQUNBLGlCQUFBO1dBQ0EsS0FBQTs7Ozs7OztNQU9BLE9BQUEsdUJBQUEsVUFBQTtRQUNBLElBQUEsT0FBQSxPQUFBLFNBQUE7UUFDQTtXQUNBLHFCQUFBO1dBQ0EsS0FBQTs7Ozs7O01BTUEsT0FBQSx5QkFBQSxVQUFBO1FBQ0EsSUFBQSxPQUFBLE9BQUEsU0FBQTtRQUNBO1dBQ0EsdUJBQUE7V0FDQSxLQUFBOzs7Ozs7OztBQ3hOQSxRQUFBLE9BQUEsUUFBQSxPQUFBLENBQUEsbUJBQUEsVUFBQSxpQkFBQTs7RUFFQSxnQkFBQSxXQUFBO0lBQ0EsYUFBQSxDQUFBLFdBQUEsV0FBQSxXQUFBLFdBQUEsV0FBQSxXQUFBO0lBQ0EsWUFBQTs7O0NBR0EsV0FBQSxpQkFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsUUFBQSxRQUFBLFlBQUE7O01BRUE7U0FDQTtTQUNBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQStHQTtTQUNBO1NBQ0EsS0FBQTs7Ozs7TUFLQSxPQUFBLFVBQUEsU0FBQSxLQUFBO1FBQ0EsT0FBQSxPQUFBLE1BQUEsT0FBQSxNQUFBOzs7TUFHQSxPQUFBLGNBQUEsVUFBQTtRQUNBLFlBQUE7UUFDQSxPQUFBOzs7TUFHQSxNQUFBLFNBQUEsT0FBQSxTQUFBO1FBQ0E7VUFDQSxpQkFBQTtVQUNBLHNCQUFBO1VBQ0EsMkJBQUE7VUFDQSxhQUFBO1VBQ0Esa0JBQUE7VUFDQSx1QkFBQTs7Ozs7TUFLQSxPQUFBLG1CQUFBLFVBQUE7UUFDQSxLQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUE7VUFDQSxNQUFBO1VBQ0Esa0JBQUE7VUFDQSxvQkFBQTtVQUNBLG1CQUFBO1VBQ0EsZ0JBQUE7YUFDQSxVQUFBO1lBQ0E7ZUFDQTtlQUNBLEtBQUEsVUFBQTtnQkFDQSxXQUFBOzs7OztNQUtBLE9BQUEsbUJBQUEsVUFBQTtRQUNBLEtBQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLE1BQUE7VUFDQSxrQkFBQTtVQUNBLG9CQUFBO1VBQ0EsbUJBQUE7VUFDQSxnQkFBQTthQUNBLFVBQUE7WUFDQTtlQUNBO2VBQ0EsS0FBQSxVQUFBO2dCQUNBLFdBQUE7Ozs7O01BS0EsT0FBQSx1QkFBQSxVQUFBO1FBQ0E7V0FDQTtXQUNBLFFBQUEsU0FBQSxPQUFBO1lBQ0EsS0FBQTtjQUNBLE9BQUE7Y0FDQSxNQUFBO2NBQ0EsTUFBQTtjQUNBLGtCQUFBO2NBQ0Esb0JBQUE7Y0FDQSxtQkFBQTtjQUNBLGdCQUFBO2lCQUNBLFVBQUE7O2dCQUVBO21CQUNBO21CQUNBLEtBQUEsVUFBQTtvQkFDQSxXQUFBOzs7Ozs7TUFNQSxPQUFBLGFBQUEsV0FBQTtRQUNBO1dBQ0E7V0FDQSxRQUFBLFNBQUEsT0FBQTtZQUNBLEtBQUE7Y0FDQSxPQUFBO2NBQ0EsTUFBQTtjQUNBLE1BQUE7Y0FDQSxrQkFBQTtjQUNBLG9CQUFBO2NBQ0EsbUJBQUE7Y0FDQSxnQkFBQTtpQkFDQSxVQUFBOztnQkFFQTttQkFDQTttQkFDQSxLQUFBLFVBQUE7b0JBQ0EsV0FBQTs7Ozs7O01BTUEsT0FBQSxpQkFBQSxXQUFBO1FBQ0E7V0FDQTtXQUNBLFFBQUEsU0FBQSxPQUFBO1lBQ0EsS0FBQTtjQUNBLE9BQUE7Y0FDQSxNQUFBO2NBQ0EsTUFBQTtjQUNBLGtCQUFBO2NBQ0Esb0JBQUE7Y0FDQSxtQkFBQTtjQUNBLGdCQUFBO2lCQUNBLFVBQUE7O2dCQUVBO21CQUNBO21CQUNBLEtBQUEsVUFBQTtvQkFDQSxXQUFBOzs7Ozs7Ozs7Ozs7O0FDM1BBLFFBQUEsT0FBQTtDQUNBLFdBQUEsaUJBQUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxVQUFBLFFBQUEsUUFBQSxVQUFBLGFBQUEsVUFBQSxPQUFBLGFBQUEsYUFBQSxNQUFBOztJQUVBLElBQUEsV0FBQSxTQUFBOztJQUVBLE9BQUEsWUFBQSxNQUFBLFVBQUE7O0lBRUEsT0FBQSxPQUFBLFlBQUE7O0lBRUEsU0FBQSxhQUFBLE9BQUEsUUFBQTtNQUNBLElBQUEsT0FBQTtNQUNBLE1BQUEsUUFBQTs7Ozs7TUFLQSxPQUFBOzs7SUFHQSxTQUFBLGFBQUEsVUFBQTtNQUNBLFlBQUEsSUFBQSxVQUFBLEtBQUE7Ozs7O01BS0EsUUFBQSxJQUFBO01BQ0EsRUFBQSxvQkFBQSxNQUFBOzs7SUFHQSxTQUFBLGlCQUFBLE1BQUE7TUFDQSxPQUFBO1FBQ0E7VUFDQSxNQUFBO1VBQ0EsUUFBQTtZQUNBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQSxRQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQSxRQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQSxRQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQSxRQUFBOzs7Ozs7O0lBT0EsT0FBQSxlQUFBOzs7SUFHQSxPQUFBLFdBQUEsVUFBQSxNQUFBO01BQ0EsSUFBQSxPQUFBO01BQ0EsS0FBQSxhQUFBLFFBQUE7OztNQUdBLE9BQUE7OztJQUdBLFlBQUEsU0FBQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQW1DQSxPQUFBLGFBQUEsWUFBQTs7TUFFQSxXQUFBO1FBQ0EsYUFBQSxPQUFBO1FBQ0EsU0FBQSxDQUFBLEVBQUEsSUFBQSxZQUFBLEtBQUEsS0FBQSxNQUFBLFlBQUEsS0FBQSxRQUFBLE1BQUEsT0FBQSxPQUFBO1FBQ0EsUUFBQSxFQUFBLE1BQUEsT0FBQSxXQUFBLFFBQUEsT0FBQSxhQUFBLFVBQUEsT0FBQSxlQUFBLE1BQUEsT0FBQTtRQUNBLFdBQUE7O01BRUEsUUFBQSxJQUFBO01BQ0EsUUFBQSxJQUFBLE9BQUE7O01BRUEsWUFBQSxPQUFBO01BQ0EsT0FBQTs7OztJQUlBLE9BQUEsaUJBQUEsWUFBQTtNQUNBLE9BQUEsa0JBQUE7TUFDQSxPQUFBLFlBQUE7TUFDQSxPQUFBLGNBQUE7TUFDQSxPQUFBLGdCQUFBO01BQ0EsT0FBQSxZQUFBO01BQ0EsT0FBQSxxQkFBQTs7OztJQUlBLE9BQUEsZUFBQSxVQUFBO01BQ0EsT0FBQSxtQkFBQTs7OztJQUlBLE9BQUEsZUFBQSxZQUFBOztNQUVBLFNBQUEsT0FBQTtNQUNBLGVBQUEsT0FBQTs7TUFFQSxTQUFBLENBQUEsR0FBQSxZQUFBLEtBQUEsS0FBQSxLQUFBLFlBQUEsS0FBQSxRQUFBLE1BQUEsTUFBQTtNQUNBLFlBQUEsS0FBQSxPQUFBO01BQ0E7UUFDQTtRQUNBO1FBQ0E7O01BRUEsT0FBQTs7OztJQUlBLE9BQUEsV0FBQSxVQUFBLE1BQUE7O01BRUEsSUFBQTtNQUNBLE1BQUEsU0FBQSxTQUFBLGNBQUE7TUFDQSxPQUFBLFlBQUE7OztNQUdBLElBQUEsU0FBQSxTQUFBLGNBQUE7TUFDQSxPQUFBLFdBQUE7TUFDQSxPQUFBLFlBQUE7TUFDQSxPQUFBLFFBQUE7TUFDQSxPQUFBLFlBQUE7OztNQUdBLElBQUEsS0FBQSxPQUFBLE1BQUE7UUFDQSxTQUFBLFNBQUEsY0FBQTtRQUNBLE9BQUEsWUFBQTtRQUNBLE9BQUEsUUFBQTtRQUNBLE9BQUEsWUFBQTs7TUFFQSxJQUFBLEtBQUEsT0FBQSxRQUFBO1FBQ0EsU0FBQSxTQUFBLGNBQUE7UUFDQSxPQUFBLFlBQUE7UUFDQSxPQUFBLFFBQUE7UUFDQSxPQUFBLFlBQUE7O01BRUEsSUFBQSxLQUFBLE9BQUEsVUFBQTtRQUNBLFNBQUEsU0FBQSxjQUFBO1FBQ0EsT0FBQSxZQUFBO1FBQ0EsT0FBQSxRQUFBO1FBQ0EsT0FBQSxZQUFBOztNQUVBLElBQUEsS0FBQSxPQUFBLE1BQUE7UUFDQSxTQUFBLFNBQUEsY0FBQTtRQUNBLE9BQUEsWUFBQTtRQUNBLE9BQUEsUUFBQTtRQUNBLE9BQUEsWUFBQTs7O01BR0EsT0FBQSxXQUFBLFNBQUEsY0FBQSxHQUFBO1FBQ0EsUUFBQSxFQUFBLE9BQUE7OztNQUdBLEtBQUE7UUFDQSxPQUFBOztRQUVBLFNBQUE7VUFDQSxTQUFBOztTQUVBLEtBQUEsWUFBQTs7UUFFQSxVQUFBLEVBQUEsSUFBQSxZQUFBLEtBQUEsS0FBQSxNQUFBLFlBQUEsS0FBQSxRQUFBLE1BQUEsT0FBQTtRQUNBLFlBQUEsS0FBQSxLQUFBLEtBQUE7UUFDQTtVQUNBO1VBQ0E7VUFDQTs7UUFFQSxPQUFBOzs7OztJQUtBLE9BQUEsZUFBQSxVQUFBLFFBQUEsUUFBQSxPQUFBOztNQUVBLEtBQUE7UUFDQSxPQUFBO1FBQ0EsTUFBQSw2QkFBQSxPQUFBLE9BQUE7UUFDQSxNQUFBO1FBQ0EsU0FBQTtVQUNBLFFBQUE7WUFDQSxNQUFBO1lBQ0EsT0FBQTtZQUNBLFNBQUE7O1VBRUEsU0FBQTtZQUNBLFdBQUE7WUFDQSxZQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOzs7U0FHQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUEyQkEsT0FBQSxlQUFBLFVBQUEsUUFBQSxRQUFBLE9BQUE7TUFDQSxLQUFBO1FBQ0EsT0FBQTtRQUNBLE1BQUEsNkJBQUEsT0FBQSxPQUFBO1FBQ0EsTUFBQTtRQUNBLFNBQUE7VUFDQSxRQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOztVQUVBLFNBQUE7WUFDQSxXQUFBO1lBQ0EsWUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7O1NBR0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7OztJQWdCQSxPQUFBLHVCQUFBLFVBQUEsUUFBQSxRQUFBLE9BQUE7TUFDQSxLQUFBO1FBQ0EsT0FBQTtRQUNBLE1BQUEsNkJBQUEsT0FBQSxPQUFBO1FBQ0EsTUFBQTtRQUNBLFNBQUE7VUFDQSxRQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOztVQUVBLFNBQUE7WUFDQSxXQUFBO1lBQ0EsWUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7O1NBR0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBMkJBLE9BQUEsYUFBQSxVQUFBLE1BQUE7TUFDQSxLQUFBO1FBQ0EsT0FBQTtRQUNBLE1BQUE7UUFDQSxNQUFBO1FBQ0EsU0FBQTtVQUNBLFFBQUE7WUFDQSxNQUFBO1lBQ0EsT0FBQTtZQUNBLFNBQUE7O1VBRUEsU0FBQTtZQUNBLFdBQUE7WUFDQSxZQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOzs7U0FHQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUE4QkEsT0FBQSxZQUFBLFVBQUEsTUFBQTtNQUNBLEtBQUE7UUFDQSxPQUFBO1FBQ0EsTUFBQTtRQUNBLE1BQUE7UUFDQSxTQUFBO1VBQ0EsUUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7VUFFQSxTQUFBO1lBQ0EsV0FBQTtZQUNBLFlBQUE7WUFDQSxNQUFBO1lBQ0EsT0FBQTtZQUNBLFNBQUE7OztTQUdBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBdUJBLE9BQUEsaUJBQUEsVUFBQSxNQUFBO01BQ0EsS0FBQTtRQUNBLE9BQUE7UUFDQSxNQUFBO1FBQ0EsTUFBQTtRQUNBLFNBQUE7VUFDQSxRQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOztVQUVBLFNBQUE7WUFDQSxXQUFBO1lBQ0EsWUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7O1NBR0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBd0JBLE9BQUEsa0JBQUEsVUFBQSxRQUFBLFFBQUE7TUFDQSxJQUFBLFVBQUEsTUFBQTtRQUNBLE9BQUE7YUFDQSxFQUFBLE9BQUE7O01BRUEsS0FBQTtRQUNBLE9BQUE7UUFDQSxNQUFBO1FBQ0EsTUFBQTtRQUNBLFNBQUE7VUFDQSxRQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOztVQUVBLFNBQUE7WUFDQSxXQUFBO1lBQ0EsWUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7O1NBR0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFpQkEsT0FBQSxpQkFBQSxVQUFBLFFBQUEsUUFBQTtNQUNBLElBQUEsVUFBQSxNQUFBO1FBQ0EsT0FBQTthQUNBLEVBQUEsT0FBQTs7TUFFQSxLQUFBO1FBQ0EsT0FBQTtRQUNBLE1BQUE7UUFDQSxNQUFBO1FBQ0EsU0FBQTtVQUNBLFFBQUE7WUFDQSxNQUFBO1lBQ0EsT0FBQTtZQUNBLFNBQUE7O1VBRUEsU0FBQTtZQUNBLFdBQUE7WUFDQSxZQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOzs7U0FHQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7SUFlQSxPQUFBLE9BQUEsYUFBQSxVQUFBLFdBQUE7TUFDQSxZQUFBLGlCQUFBLFdBQUEsT0FBQSxlQUFBO1FBQ0E7Ozs7OztJQU1BLE9BQUEsb0JBQUEsWUFBQTtNQUNBLFlBQUEsaUJBQUEsT0FBQSxXQUFBLE9BQUEsZUFBQTtRQUNBOzs7Ozs7SUFNQSxPQUFBLGFBQUEsVUFBQSxNQUFBO01BQ0EsS0FBQSxRQUFBLFFBQUE7O1NBRUEsS0FBQTs7Ozs7Ozs7Ozs7QUN0a0JBLFFBQUEsT0FBQTtHQUNBLFdBQUEsZ0JBQUE7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsUUFBQSxPQUFBLE1BQUEsWUFBQTtNQUNBLE9BQUEsZUFBQSxLQUFBOzs7TUFHQTs7TUFFQSxTQUFBLGlCQUFBOztRQUVBO1dBQ0EsSUFBQTtXQUNBLEtBQUEsU0FBQSxJQUFBO1lBQ0EsSUFBQSxVQUFBLElBQUE7WUFDQSxJQUFBLFFBQUEsT0FBQSxhQUFBLE1BQUEsTUFBQSxLQUFBOztZQUVBLElBQUEsUUFBQSxPQUFBO2NBQ0EsT0FBQSxhQUFBLFFBQUEsU0FBQSxRQUFBLE9BQUE7Y0FDQSxPQUFBLG1CQUFBOzs7Ozs7O01BT0EsT0FBQSxnQkFBQSxVQUFBO1FBQ0E7V0FDQSxjQUFBLE9BQUEsYUFBQSxLQUFBLE9BQUEsYUFBQTtXQUNBLEtBQUE7OzthQUdBOzs7Ozs7TUFNQSxPQUFBLHFCQUFBLFVBQUE7UUFDQTtXQUNBLG1CQUFBLE9BQUEsYUFBQSxLQUFBLE9BQUEsYUFBQTtXQUNBLEtBQUE7OzthQUdBOzs7Ozs7TUFNQSxPQUFBLGdCQUFBLFVBQUE7O1FBRUE7V0FDQSxVQUFBLE9BQUEsYUFBQSxLQUFBLE9BQUE7V0FDQSxLQUFBOzs7YUFHQTs7Ozs7Ozs7Ozs7QUM1REEsUUFBQSxPQUFBLE9BQUEsV0FBQSxrQkFBQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxVQUFBLFFBQUEsUUFBQSxjQUFBLGFBQUEsYUFBQTtJQUNBLE9BQUEsUUFBQTtJQUNBLE9BQUEsUUFBQTs7Ozs7O0lBTUEsRUFBQSxjQUFBOztJQUVBLE9BQUEsZUFBQTtJQUNBLE9BQUEsYUFBQSxXQUFBLGlCQUFBO01BQ0EsUUFBQTtNQUNBLGNBQUE7UUFDQSxxQkFBQTs7TUFFQSxTQUFBOzs7SUFHQSxTQUFBLFdBQUEsTUFBQTtNQUNBLE9BQUEsUUFBQSxLQUFBO01BQ0EsT0FBQSxjQUFBLEtBQUE7TUFDQSxPQUFBLFdBQUEsS0FBQTs7TUFFQSxJQUFBLElBQUE7TUFDQSxLQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxZQUFBLEtBQUE7UUFDQSxFQUFBLEtBQUE7O01BRUEsT0FBQSxHQUFBLG1CQUFBO1FBQ0EsTUFBQTtRQUNBLE1BQUEsYUFBQSxRQUFBOztNQUVBLE9BQUEsUUFBQTs7O0lBR0EsWUFBQSxRQUFBLGFBQUEsTUFBQSxhQUFBLE1BQUEsYUFBQSxPQUFBLE9BQUE7T0FDQSxLQUFBOzs7OztJQUtBLE9BQUEsT0FBQSxhQUFBLFVBQUEsV0FBQTtNQUNBLFlBQUEsUUFBQSxhQUFBLE1BQUEsYUFBQSxNQUFBLFdBQUEsT0FBQSxlQUFBO1FBQ0E7Ozs7Ozs7SUFPQSxPQUFBLG9CQUFBLFlBQUE7TUFDQTtTQUNBLFFBQUEsYUFBQSxNQUFBLGFBQUEsTUFBQSxPQUFBLFdBQUEsT0FBQSxlQUFBLE9BQUEsa0JBQUE7VUFDQTs7Ozs7O0lBTUEsT0FBQSxXQUFBLFVBQUEsTUFBQTtNQUNBLE9BQUEsR0FBQSxtQkFBQTtRQUNBLE1BQUE7UUFDQSxNQUFBLGFBQUEsUUFBQTs7OztJQUlBLE9BQUEsU0FBQSxVQUFBLFFBQUEsTUFBQTtNQUNBLE9BQUE7O01BRUEsT0FBQSxHQUFBLGtCQUFBO1FBQ0EsSUFBQSxLQUFBOzs7OztJQUtBLE9BQUEsYUFBQSxVQUFBLFFBQUEsTUFBQSxPQUFBO01BQ0EsT0FBQTtNQUNBLEtBQUE7UUFDQSxTQUFBO1VBQ0EsUUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7VUFFQSxRQUFBO1lBQ0EsV0FBQTtZQUNBLFlBQUE7WUFDQSxNQUFBO1lBQ0EsT0FBQTtZQUNBLFNBQUE7OztRQUdBLFlBQUE7UUFDQSxNQUFBO1FBQ0EsTUFBQSw2QkFBQSxLQUFBLFFBQUEsT0FBQTtRQUNBLE9BQUE7U0FDQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUE2Q0EsT0FBQSxjQUFBLFVBQUEsUUFBQSxNQUFBLE9BQUE7TUFDQSxPQUFBO01BQ0EsS0FBQTtRQUNBLFNBQUE7VUFDQSxRQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOztVQUVBLFFBQUE7WUFDQSxXQUFBO1lBQ0EsWUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7O1FBR0EsWUFBQTtRQUNBLE1BQUE7UUFDQSxNQUFBLDZCQUFBLEtBQUEsUUFBQSxPQUFBO1FBQ0EsT0FBQTtTQUNBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBK0NBLE9BQUEsYUFBQSxVQUFBLFFBQUEsTUFBQSxPQUFBO01BQ0EsT0FBQTs7O01BR0EsS0FBQTtRQUNBLFNBQUE7VUFDQSxRQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBOztVQUVBLFFBQUE7WUFDQSxXQUFBO1lBQ0EsWUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7O1FBR0EsWUFBQTtRQUNBLE1BQUE7UUFDQSxNQUFBLDZCQUFBLEtBQUEsUUFBQSxPQUFBO1FBQ0EsT0FBQTtTQUNBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBNENBLE9BQUEsdUJBQUEsWUFBQTtNQUNBLE1BQUEscUJBQUEsT0FBQSxNQUFBO1FBQ0E7OztNQUdBLElBQUEsVUFBQSxFQUFBLE1BQUEsS0FBQTs7TUFFQSxLQUFBO1FBQ0EsT0FBQTtRQUNBLE1BQUE7OztRQUdBLE1BQUE7UUFDQSxTQUFBLENBQUEsVUFBQTtRQUNBLFlBQUE7U0FDQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBc0JBLE9BQUEsc0JBQUEsWUFBQTtNQUNBLE1BQUEscUJBQUEsT0FBQSxNQUFBO1FBQ0E7OztNQUdBLElBQUEsVUFBQSxFQUFBLE1BQUEsS0FBQTs7TUFFQSxLQUFBO1FBQ0EsT0FBQTtRQUNBLE1BQUE7OztRQUdBLE1BQUE7UUFDQSxTQUFBLENBQUEsVUFBQTtRQUNBLFlBQUE7U0FDQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFxQkEsT0FBQSxjQUFBLFlBQUE7TUFDQSxJQUFBLFVBQUEsQ0FBQSxNQUFBLFVBQUEsYUFBQTtNQUNBLElBQUEsT0FBQTtNQUNBLFlBQUEsU0FBQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTRDQSxPQUFBLGNBQUEsVUFBQSxRQUFBLE1BQUEsT0FBQTtNQUNBLE9BQUE7O01BRUEsSUFBQSxDQUFBLEtBQUEsT0FBQTtRQUNBLEtBQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQSx3QkFBQSxLQUFBLFFBQUEsT0FBQTtVQUNBLE1BQUE7VUFDQSxTQUFBO1lBQ0EsUUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQTs7WUFFQSxTQUFBO2NBQ0EsTUFBQTtjQUNBLFdBQUE7Y0FDQSxZQUFBO2NBQ0EsT0FBQTtjQUNBLFNBQUE7OztXQUdBLEtBQUE7Ozs7Ozs7Ozs7O2FBV0E7UUFDQSxZQUFBLFNBQUEsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQW1CQSxTQUFBLFdBQUEsTUFBQTtNQUNBLElBQUEsTUFBQTtRQUNBLE9BQUEsT0FBQSxNQUFBLE9BQUEsTUFBQSxPQUFBOzs7O0lBSUEsT0FBQSxXQUFBLFVBQUEsTUFBQTtNQUNBLElBQUEsS0FBQSxPQUFBO1FBQ0EsT0FBQTs7TUFFQSxJQUFBLEtBQUEsT0FBQSxXQUFBO1FBQ0EsT0FBQTs7TUFFQSxJQUFBLEtBQUEsT0FBQSxZQUFBLENBQUEsS0FBQSxPQUFBLFdBQUE7UUFDQSxPQUFBOzs7O0lBSUEsU0FBQSxXQUFBLE1BQUE7TUFDQSxPQUFBLGVBQUE7TUFDQSxPQUFBLGFBQUEsV0FBQSxpQkFBQTtNQUNBLEVBQUEsb0JBQUEsTUFBQTs7O0lBR0EsU0FBQSxpQkFBQSxNQUFBO01BQ0EsT0FBQTtRQUNBO1VBQ0EsTUFBQTtVQUNBLFFBQUE7WUFDQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLFdBQUEsS0FBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLFdBQUEsS0FBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLFdBQUEsS0FBQSxPQUFBLGNBQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxXQUFBLEtBQUEsT0FBQSxnQkFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUE7Ozs7UUFJQTtVQUNBLE1BQUE7VUFDQSxRQUFBO1lBQ0E7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLFFBQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLFFBQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLFFBQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLFFBQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLFFBQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLFFBQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLFFBQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLFFBQUE7Ozs7UUFJQTtVQUNBLE1BQUE7VUFDQSxRQUFBO1lBQ0E7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLGFBQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLGFBQUE7Y0FDQSxNQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQSxhQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQSxhQUFBOzs7O1FBSUE7VUFDQSxNQUFBO1VBQ0EsUUFBQTtZQUNBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQSxhQUFBOzs7Ozs7O0lBT0EsU0FBQSxZQUFBO01BQ0EsS0FBQSxZQUFBLHdCQUFBO01BQ0EsT0FBQTs7O0lBR0EsU0FBQSxRQUFBLE1BQUE7TUFDQSxLQUFBLGNBQUEsS0FBQSxTQUFBOzs7SUFHQSxPQUFBLGVBQUEsWUFBQTs7TUFFQSxLQUFBLDhCQUFBO1FBQ0EsU0FBQSxFQUFBLFFBQUEsRUFBQSxNQUFBLFVBQUEsT0FBQSxNQUFBLFNBQUEsUUFBQSxTQUFBLEVBQUEsTUFBQSxVQUFBLE9BQUEsTUFBQSxTQUFBO1FBQ0EsU0FBQSxFQUFBLFNBQUEsU0FBQSxZQUFBLEVBQUEsYUFBQSxxQkFBQSxNQUFBO1NBQ0EsS0FBQTs7Ozs7Ozs7O0lBU0EsT0FBQSxhQUFBOzs7QUN4bEJBLFFBQUEsT0FBQTtHQUNBLFFBQUEsWUFBQSxXQUFBO0dBQ0EsV0FBQSxZQUFBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsUUFBQSxXQUFBOztNQUVBLE9BQUEsYUFBQTs7OztBQ1BBLFFBQUEsT0FBQTtHQUNBLFdBQUEsYUFBQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFFBQUEsWUFBQTtNQUNBLE9BQUEsVUFBQTs7QUNMQSxRQUFBLE9BQUE7R0FDQSwrQkFBQSxVQUFBLHFCQUFBO0lBQ0Esb0JBQUEsV0FBQTtNQUNBLGdCQUFBO01BQ0EsS0FBQTtNQUNBLGFBQUE7TUFDQSxXQUFBO01BQ0EsV0FBQTtNQUNBLGVBQUE7OztHQUdBLFdBQUEsbUJBQUE7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxVQUFBLFFBQUEsWUFBQSxRQUFBLE9BQUEsYUFBQSxVQUFBLFNBQUEsYUFBQSxrQkFBQTs7TUFFQSxPQUFBLGNBQUE7UUFDQSxhQUFBLFVBQUEsTUFBQTtVQUNBLFFBQUEsSUFBQTtVQUNBLE9BQUEsVUFBQTs7UUFFQSxXQUFBLFVBQUEsTUFBQSxLQUFBO1VBQ0EsT0FBQSxLQUFBLFFBQUEsU0FBQSxJQUFBOzs7O01BSUEsT0FBQSxPQUFBLFlBQUE7OztNQUdBLE9BQUEsZUFBQSxPQUFBLEtBQUEsTUFBQSxNQUFBLEtBQUEsTUFBQSxTQUFBLEtBQUE7OztNQUdBLElBQUEsT0FBQSxjQUFBO1FBQ0EsT0FBQSxLQUFBLFFBQUEsUUFBQTs7OztNQUlBO01BQ0E7O01BRUE7TUFDQTs7TUFFQSxPQUFBLGNBQUEsS0FBQSxRQUFBLFNBQUEsS0FBQTs7TUFFQSxTQUFBLGtCQUFBO1FBQ0E7V0FDQSxJQUFBO1dBQ0EsS0FBQSxVQUFBLEtBQUE7WUFDQSxJQUFBLFVBQUEsSUFBQTtZQUNBLElBQUEsUUFBQSxPQUFBLEtBQUEsTUFBQSxNQUFBLEtBQUE7O1lBRUEsSUFBQSxRQUFBLFFBQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQSxTQUFBLFFBQUEsT0FBQTtjQUNBLE9BQUEsbUJBQUE7Ozs7UUFJQTtXQUNBLElBQUE7V0FDQSxLQUFBLFVBQUEsS0FBQTtZQUNBLE9BQUEsVUFBQSxJQUFBLEtBQUEsTUFBQTtZQUNBLE9BQUEsUUFBQSxLQUFBOztZQUVBLElBQUEsVUFBQTs7WUFFQSxLQUFBLElBQUEsR0FBQSxJQUFBLE9BQUEsUUFBQSxRQUFBLEtBQUE7Y0FDQSxPQUFBLFFBQUEsS0FBQSxPQUFBLFFBQUEsR0FBQTtjQUNBLFFBQUEsS0FBQSxFQUFBLE9BQUEsT0FBQSxRQUFBOzs7WUFHQSxFQUFBO2VBQ0EsT0FBQTtnQkFDQSxRQUFBO2dCQUNBLE9BQUE7Z0JBQ0EsVUFBQSxVQUFBLFFBQUEsVUFBQTtrQkFDQSxPQUFBLEtBQUEsUUFBQSxTQUFBLE9BQUEsTUFBQTs7Ozs7OztNQU9BLFNBQUEsa0JBQUE7UUFDQTtXQUNBLElBQUE7V0FDQSxLQUFBLFVBQUEsS0FBQTtZQUNBLE9BQUEsVUFBQSxJQUFBLEtBQUEsTUFBQTtZQUNBLE9BQUEsUUFBQSxLQUFBOztZQUVBLElBQUEsVUFBQTs7WUFFQSxLQUFBLElBQUEsR0FBQSxJQUFBLE9BQUEsUUFBQSxRQUFBLEtBQUE7Y0FDQSxPQUFBLFFBQUEsS0FBQSxPQUFBLFFBQUEsR0FBQTtjQUNBLFFBQUEsS0FBQSxFQUFBLE9BQUEsT0FBQSxRQUFBOzs7WUFHQSxFQUFBO2VBQ0EsT0FBQTtnQkFDQSxRQUFBO2dCQUNBLE9BQUE7Z0JBQ0EsVUFBQSxVQUFBLFFBQUEsVUFBQTtrQkFDQSxPQUFBLEtBQUEsUUFBQSxTQUFBLE9BQUEsTUFBQTs7Ozs7OztNQU9BLFNBQUEsZ0JBQUE7UUFDQTtXQUNBLElBQUE7V0FDQSxLQUFBLFVBQUEsS0FBQTtZQUNBLE9BQUEsUUFBQSxJQUFBLEtBQUEsTUFBQTtZQUNBLE9BQUEsTUFBQSxLQUFBOztZQUVBLElBQUEsVUFBQTs7WUFFQSxLQUFBLElBQUEsR0FBQSxJQUFBLE9BQUEsTUFBQSxRQUFBLEtBQUE7Y0FDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLE1BQUEsR0FBQTtjQUNBLFFBQUEsS0FBQSxFQUFBLE9BQUEsT0FBQSxNQUFBOzs7WUFHQSxFQUFBO2VBQ0EsT0FBQTtnQkFDQSxRQUFBO2dCQUNBLE9BQUE7Z0JBQ0EsVUFBQSxVQUFBLFFBQUEsVUFBQTtrQkFDQSxPQUFBLE9BQUEsT0FBQSxNQUFBOzs7O1FBSUEsSUFBQSxPQUFBLEtBQUEsUUFBQSxVQUFBLFdBQUE7VUFDQSxPQUFBLGFBQUEsT0FBQSxLQUFBLFFBQUEsT0FBQSxNQUFBLEtBQUE7VUFDQSxPQUFBLE9BQUEsT0FBQSxLQUFBLFFBQUEsT0FBQSxNQUFBLEtBQUE7Ozs7O01BS0EsU0FBQSxpQkFBQSxPQUFBLE1BQUE7UUFDQSxPQUFBLE1BQUEsT0FBQTs7Ozs7TUFLQSxTQUFBLHNCQUFBO1FBQ0EsaUJBQUEsU0FBQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUF3QkEsU0FBQSxZQUFBLEdBQUE7OztRQUdBLElBQUEsV0FBQTtRQUNBLElBQUEsWUFBQSxLQUFBLE9BQUEsa0JBQUEsRUFBQSxXQUFBOzs7UUFHQSxJQUFBLE9BQUEsY0FBQSxLQUFBLEVBQUEsT0FBQSxLQUFBLFFBQUEsU0FBQSxPQUFBO2FBQ0EsRUFBQSxPQUFBLEtBQUEsUUFBQSxTQUFBLE9BQUEsYUFBQSxNQUFBLE9BQUE7Ozs7Ozs7O1FBUUE7V0FDQSxjQUFBLFFBQUEsYUFBQSxPQUFBLEtBQUE7V0FDQSxLQUFBOzs7OzthQUtBOzs7Ozs7TUFNQSxTQUFBLFVBQUE7UUFDQSxPQUFBLENBQUEsT0FBQSxLQUFBLFFBQUE7OztNQUdBLFNBQUEsbUJBQUE7UUFDQSxPQUFBLFNBQUEsS0FBQTs7O01BR0EsU0FBQSxtQkFBQTs7UUFFQSxJQUFBLGFBQUEsQ0FBQSxvQkFBQTtVQUNBLE9BQUE7O1FBRUEsT0FBQTs7O01BR0EsU0FBQSxhQUFBOztRQUVBLEVBQUEsR0FBQSxLQUFBLFNBQUEsTUFBQSxjQUFBLFVBQUEsT0FBQTtVQUNBLE9BQUE7Ozs7UUFJQSxFQUFBLFlBQUEsS0FBQTtVQUNBLElBQUE7VUFDQSxRQUFBO1VBQ0EsUUFBQTtZQUNBLE1BQUE7Y0FDQSxZQUFBO2NBQ0EsT0FBQTtnQkFDQTtrQkFDQSxNQUFBO2tCQUNBLFFBQUE7Ozs7WUFJQSxRQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Z0JBQ0E7a0JBQ0EsTUFBQTtrQkFDQSxRQUFBOzs7O1lBSUEsUUFBQTtjQUNBLFlBQUE7Y0FDQSxPQUFBO2dCQUNBO2tCQUNBLE1BQUE7a0JBQ0EsUUFBQTs7OztZQUlBLE1BQUE7Y0FDQSxZQUFBO2NBQ0EsT0FBQTtnQkFDQTtrQkFDQSxNQUFBO2tCQUNBLFFBQUE7Ozs7WUFJQSxRQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Z0JBQ0E7a0JBQ0EsTUFBQTtrQkFDQSxRQUFBOzs7O1lBSUEsbUJBQUE7Y0FDQSxZQUFBO2NBQ0EsT0FBQTtnQkFDQTtrQkFDQSxNQUFBO2tCQUNBLFFBQUE7Ozs7WUFJQSxPQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Z0JBQ0E7a0JBQ0EsTUFBQTtrQkFDQSxRQUFBOzs7O1lBSUEsT0FBQTtjQUNBLFlBQUE7Y0FDQSxPQUFBO2dCQUNBO2tCQUNBLE1BQUE7a0JBQ0EsUUFBQTs7OztZQUlBLGFBQUE7Y0FDQSxZQUFBO2NBQ0EsT0FBQTtnQkFDQTtrQkFDQSxNQUFBO2tCQUNBLFFBQUE7Ozs7WUFJQSxPQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Z0JBQ0E7a0JBQ0EsTUFBQTtrQkFDQSxRQUFBOzs7O1lBSUEsVUFBQTtjQUNBLFlBQUE7Y0FDQSxPQUFBO2dCQUNBO2tCQUNBLE1BQUE7a0JBQ0EsUUFBQTs7OztZQUlBLFVBQUE7Y0FDQSxZQUFBO2NBQ0EsT0FBQTtnQkFDQTtrQkFDQSxNQUFBO2tCQUNBLFFBQUE7Ozs7WUFJQSxRQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Z0JBQ0E7a0JBQ0EsTUFBQTtrQkFDQSxRQUFBOzs7O1lBSUEsWUFBQTtjQUNBLFlBQUE7Y0FDQSxPQUFBO2dCQUNBO2tCQUNBLE1BQUE7a0JBQ0EsUUFBQTs7Ozs7Ozs7TUFRQSxPQUFBLGFBQUEsWUFBQTtRQUNBLElBQUEsRUFBQSxZQUFBLEtBQUEsYUFBQTs7VUFFQTtlQUNBO1VBQ0EsS0FBQSxVQUFBLG1DQUFBOzs7OztBQ2hYQSxRQUFBLE9BQUE7R0FDQSxXQUFBLGtCQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBQSxRQUFBLFlBQUEsUUFBQSxPQUFBLGFBQUEsU0FBQSxrQkFBQSxhQUFBLGtCQUFBOzs7TUFHQSxpQkFBQSxTQUFBLEtBQUE7Ozs7OztNQU1BLGlCQUFBLFNBQUEsS0FBQTs7Ozs7O01BTUEsU0FBQSxVQUFBLFdBQUE7UUFDQSxLQUFBLFlBQUEseUNBQUEsVUFBQSxRQUFBLFlBQUE7UUFDQSxPQUFBOzs7O01BSUEsU0FBQSxRQUFBLEtBQUE7UUFDQSxLQUFBLGNBQUEsS0FBQSxTQUFBOzs7O01BSUEsT0FBQSxpQkFBQSxTQUFBLFVBQUEsUUFBQSxTQUFBO1FBQ0EsSUFBQSxRQUFBO1VBQ0EsaUJBQUEsTUFBQSxVQUFBLFlBQUEsT0FBQSxVQUFBO2FBQ0E7VUFDQSxpQkFBQSxNQUFBLFVBQUEsWUFBQSxPQUFBOzs7Ozs7TUFNQSxPQUFBLGdCQUFBLFNBQUEsV0FBQTs7UUFFQSxpQkFBQSxJQUFBLFVBQUEsS0FBQSxLQUFBOzs7Ozs7Ozs7O01BVUEsaUJBQUEsU0FBQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUE4QkEsT0FBQSxXQUFBLFNBQUEsTUFBQTs7UUFFQSxJQUFBLEtBQUEsSUFBQSxZQUFBLEtBQUEsS0FBQTtVQUNBLE9BQUE7Ozs7Ozs7O0FDNUZBLFFBQUEsT0FBQTtDQUNBLFdBQUEsZUFBQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsU0FBQSxRQUFBLFFBQUEsY0FBQSxZQUFBO0lBQ0EsRUFBQSxXQUFBLGFBQUEsU0FBQSxPQUFBOzs7VUFHQSxZQUFBLElBQUEsUUFBQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQStDQSxTQUFBLE1BQUE7U0FDQSxTQUFBLFdBQUE7Ozs7SUFJQSxPQUFBLFFBQUE7SUFDQSxPQUFBLFFBQUE7SUFDQSxPQUFBLFNBQUE7SUFDQSxPQUFBLFVBQUE7SUFDQSxPQUFBLGVBQUEsQ0FBQSxTQUFBLEtBQUEsaUJBQUEsS0FBQSxVQUFBLEtBQUEsVUFBQTs7SUFFQSxPQUFBLFNBQUEsbUJBQUEsYUFBQTtJQUNBLE9BQUEsT0FBQSxPQUFBLGFBQUEsU0FBQTs7SUFFQSxTQUFBLG1CQUFBLE1BQUE7TUFDQSxJQUFBLE1BQUE7TUFDQSxJQUFBLENBQUEsTUFBQSxPQUFBO01BQ0EsS0FBQSxNQUFBLEtBQUEsUUFBQSxTQUFBLEVBQUEsQ0FBQSxJQUFBLEdBQUE7TUFDQSxPQUFBLENBQUEsS0FBQSxTQUFBLEdBQUEsR0FBQTs7O0lBR0EsU0FBQSxpQkFBQSxTQUFBO01BQ0EsSUFBQSxNQUFBO01BQ0EsS0FBQSxJQUFBLEtBQUEsU0FBQSxDQUFBLEdBQUEsT0FBQSxRQUFBLE1BQUEsV0FBQSxRQUFBLElBQUEsT0FBQSxFQUFBO01BQ0EsT0FBQSxDQUFBLElBQUEsU0FBQSxHQUFBLEdBQUEsSUFBQSxPQUFBLEVBQUEsSUFBQSxPQUFBOzs7Ozs7O0lBT0EsRUFBQSxjQUFBOztJQUVBLE9BQUEsZUFBQTtJQUNBLE9BQUEsYUFBQSxXQUFBLGlCQUFBO01BQ0EsUUFBQTtNQUNBLGNBQUE7UUFDQSxxQkFBQTs7TUFFQSxTQUFBOzs7SUFHQSxTQUFBLFdBQUEsTUFBQTtNQUNBLE9BQUEsUUFBQSxLQUFBO01BQ0EsT0FBQSxjQUFBLEtBQUE7TUFDQSxPQUFBLFdBQUEsS0FBQTs7TUFFQSxJQUFBLElBQUE7TUFDQSxLQUFBLElBQUEsSUFBQSxHQUFBLElBQUEsS0FBQSxZQUFBLEtBQUE7UUFDQSxFQUFBLEtBQUE7O01BRUEsT0FBQSxRQUFBOzs7SUFHQSxZQUFBLFFBQUEsYUFBQSxNQUFBLGFBQUEsTUFBQSxhQUFBLE9BQUEsT0FBQTtLQUNBLEtBQUE7Ozs7SUFJQSxPQUFBLE9BQUEsYUFBQSxTQUFBLFdBQUE7TUFDQSxZQUFBLFFBQUEsYUFBQSxNQUFBLGFBQUEsTUFBQSxXQUFBLE9BQUEsZUFBQTtRQUNBOzs7Ozs7O0lBT0EsT0FBQSxvQkFBQSxZQUFBOztNQUVBO1NBQ0EsUUFBQSxhQUFBLE1BQUEsYUFBQSxNQUFBLE9BQUEsV0FBQSxPQUFBLGVBQUE7VUFDQTs7Ozs7O0lBTUEsT0FBQSxXQUFBLFNBQUEsTUFBQTtNQUNBLE9BQUEsR0FBQSxtQkFBQTtRQUNBLE1BQUE7UUFDQSxNQUFBLGFBQUEsUUFBQTs7OztJQUlBLE9BQUEsVUFBQSxTQUFBLFFBQUEsTUFBQSxPQUFBO01BQ0EsT0FBQTs7TUFFQSxJQUFBLENBQUEsS0FBQSxPQUFBLFdBQUE7UUFDQSxLQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUEsK0JBQUEsS0FBQSxRQUFBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTtZQUNBLFFBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLFNBQUE7O1lBRUEsU0FBQTtjQUNBLFdBQUE7Y0FDQSxZQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOzs7V0FHQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7YUFlQTtRQUNBO1VBQ0E7VUFDQSxLQUFBLFFBQUEsT0FBQSw2QkFBQSxXQUFBLEtBQUEsT0FBQTtVQUNBOzs7OztJQUtBLFNBQUEsV0FBQSxNQUFBO01BQ0EsSUFBQSxNQUFBO1FBQ0EsT0FBQSxPQUFBLE1BQUEsT0FBQSxNQUFBLE9BQUE7Ozs7SUFJQSxPQUFBLFdBQUEsU0FBQSxNQUFBO01BQ0EsSUFBQSxLQUFBLE9BQUE7UUFDQSxPQUFBOztNQUVBLElBQUEsS0FBQSxPQUFBLFdBQUE7UUFDQSxPQUFBOztNQUVBLElBQUEsS0FBQSxPQUFBLFlBQUEsQ0FBQSxLQUFBLE9BQUEsV0FBQTtRQUNBLE9BQUE7Ozs7SUFJQSxTQUFBLFdBQUEsTUFBQTtNQUNBLE9BQUEsZUFBQTtNQUNBLE9BQUEsYUFBQSxXQUFBLGlCQUFBO01BQ0EsRUFBQSxvQkFBQSxNQUFBOzs7SUFHQSxTQUFBLGlCQUFBLE1BQUE7TUFDQSxPQUFBO1FBQ0E7VUFDQSxNQUFBO1VBQ0EsUUFBQTtZQUNBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsV0FBQSxLQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsV0FBQSxLQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsV0FBQSxLQUFBLE9BQUEsY0FBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLFdBQUEsS0FBQSxPQUFBLGdCQUFBOztZQUVBO2NBQ0EsTUFBQTtjQUNBLE9BQUEsS0FBQTs7OztRQUlBO1VBQ0EsTUFBQTtVQUNBLFFBQUE7WUFDQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsUUFBQTs7OztRQUlBO1VBQ0EsTUFBQTtVQUNBLFFBQUE7WUFDQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsYUFBQTs7WUFFQTtjQUNBLE1BQUE7Y0FDQSxPQUFBLEtBQUEsYUFBQTtjQUNBLE1BQUE7O1lBRUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLGFBQUE7Ozs7UUFJQTtVQUNBLE1BQUE7VUFDQSxRQUFBO1lBQ0E7Y0FDQSxNQUFBO2NBQ0EsT0FBQSxLQUFBLGFBQUE7Ozs7OztJQU1BLE9BQUEsYUFBQTs7QUM3VEEsUUFBQSxPQUFBO0dBQ0EsV0FBQSxvQkFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFVBQUEsUUFBQSxZQUFBLFFBQUEsYUFBQSxPQUFBLGFBQUE7OztNQUdBLElBQUEsT0FBQSxZQUFBO01BQ0EsT0FBQSxPQUFBOztNQUVBLE9BQUEsbUJBQUEsS0FBQSxRQUFBLEtBQUEsT0FBQTs7TUFFQSxPQUFBLGFBQUEsTUFBQTs7TUFFQTs7TUFFQSxPQUFBLFdBQUEsS0FBQSxNQUFBLE1BQUEsS0FBQSxRQUFBLEtBQUEsTUFBQSxLQUFBLEtBQUE7Ozs7O01BS0EsSUFBQSxzQkFBQTtRQUNBLGNBQUE7UUFDQSxTQUFBO1FBQ0EsU0FBQTtRQUNBLFVBQUE7UUFDQSxlQUFBOzs7TUFHQSxJQUFBLEtBQUEsYUFBQSxxQkFBQTtRQUNBLEtBQUEsYUFBQSxvQkFBQSxRQUFBLFVBQUEsYUFBQTtVQUNBLElBQUEsZUFBQSxxQkFBQTtZQUNBLG9CQUFBLGVBQUE7Ozs7O01BS0EsT0FBQSxzQkFBQTs7OztNQUlBLFNBQUEsWUFBQSxHQUFBO1FBQ0EsSUFBQSxlQUFBLE9BQUEsS0FBQTs7UUFFQSxJQUFBLE1BQUE7UUFDQSxPQUFBLEtBQUEsT0FBQSxxQkFBQSxRQUFBLFVBQUEsS0FBQTtVQUNBLElBQUEsT0FBQSxvQkFBQSxNQUFBO1lBQ0EsSUFBQSxLQUFBOzs7UUFHQSxhQUFBLHNCQUFBOztRQUVBO1dBQ0EsbUJBQUEsS0FBQSxLQUFBO1dBQ0EsS0FBQTs7OzthQUlBOzs7Ozs7Ozs7Ozs7OztNQWNBLFNBQUEsYUFBQTs7UUFFQSxFQUFBLFlBQUEsS0FBQTtVQUNBLFFBQUE7WUFDQSxPQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Z0JBQ0E7a0JBQ0EsTUFBQTtrQkFDQSxRQUFBOzs7O1lBSUEsT0FBQTtjQUNBLFlBQUE7Y0FDQSxPQUFBO2dCQUNBO2tCQUNBLE1BQUE7a0JBQ0EsUUFBQTs7OztZQUlBLHdCQUFBO2NBQ0EsWUFBQTtjQUNBLE9BQUE7Z0JBQ0E7a0JBQ0EsTUFBQTtrQkFDQSxRQUFBOzs7O1lBSUEsZ0JBQUE7Y0FDQSxZQUFBO2NBQ0EsT0FBQTtnQkFDQTtrQkFDQSxNQUFBO2tCQUNBLFFBQUE7Ozs7Ozs7O01BUUEsT0FBQSxhQUFBLFlBQUE7UUFDQSxJQUFBLEVBQUEsWUFBQSxLQUFBLGFBQUE7VUFDQTtlQUNBO1VBQ0EsS0FBQSxVQUFBLG1DQUFBOzs7Ozs7QUM1SEEsUUFBQSxPQUFBO0dBQ0EsV0FBQSxpQkFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBQSxZQUFBLFFBQUEsTUFBQSxhQUFBLFVBQUEsT0FBQSxhQUFBLGFBQUEsWUFBQSxVQUFBO01BQ0EsSUFBQSxXQUFBLFNBQUE7TUFDQSxJQUFBLE9BQUEsWUFBQTtNQUNBLE9BQUEsT0FBQTtNQUNBLE9BQUEsWUFBQSxNQUFBLFdBQUEsU0FBQTtNQUNBLE9BQUEsY0FBQSxNQUFBLFdBQUEsU0FBQTs7TUFFQSxPQUFBLFlBQUE7O01BRUEsS0FBQSxJQUFBLE9BQUEsT0FBQSxXQUFBO1FBQ0EsSUFBQSxPQUFBLFVBQUEsS0FBQSxTQUFBLG1CQUFBO1VBQ0EsT0FBQSxVQUFBLE9BQUEsT0FBQSxVQUFBLEtBQUEsUUFBQSxrQkFBQSxNQUFBLFdBQUEsU0FBQTs7UUFFQSxJQUFBLE9BQUEsVUFBQSxLQUFBLFNBQUEsdUJBQUE7VUFDQSxPQUFBLFVBQUEsT0FBQSxPQUFBLFVBQUEsS0FBQSxRQUFBLHNCQUFBLE1BQUEsV0FBQSxLQUFBLE9BQUE7Ozs7O01BS0EsSUFBQSxZQUFBLE9BQUEsWUFBQSxNQUFBLFVBQUE7OztNQUdBLElBQUEsbUJBQUEsT0FBQSxtQkFBQSxNQUFBLFFBQUEsS0FBQSxPQUFBOztNQUVBLE9BQUEsWUFBQSxTQUFBLE9BQUE7UUFDQSxJQUFBLE9BQUEsT0FBQTtRQUNBLFFBQUE7VUFDQSxLQUFBO1lBQ0EsT0FBQSxDQUFBLEtBQUE7VUFDQSxLQUFBO1lBQ0EsT0FBQSxhQUFBLEtBQUEsWUFBQSxDQUFBLEtBQUEsT0FBQTtVQUNBLEtBQUE7WUFDQSxPQUFBLGFBQUEsS0FBQSxPQUFBLG9CQUFBLENBQUEsS0FBQSxPQUFBO1VBQ0EsS0FBQTtZQUNBLE9BQUEsQ0FBQSxhQUFBLENBQUEsS0FBQSxPQUFBLG9CQUFBLENBQUEsS0FBQSxPQUFBO1VBQ0EsS0FBQTtZQUNBLE9BQUEsQ0FBQSxhQUFBLEtBQUEsT0FBQSxvQkFBQSxDQUFBLEtBQUEsT0FBQTtVQUNBLEtBQUE7WUFDQSxPQUFBLENBQUE7Y0FDQSxLQUFBLE9BQUE7Y0FDQSxDQUFBLEtBQUEsT0FBQTtjQUNBLENBQUEsS0FBQSxPQUFBO1VBQ0EsS0FBQTtZQUNBLE9BQUE7Y0FDQSxLQUFBLE9BQUE7Y0FDQSxDQUFBLEtBQUEsT0FBQTtjQUNBLENBQUEsS0FBQSxPQUFBO1VBQ0EsS0FBQTtZQUNBLE9BQUEsS0FBQSxPQUFBLFlBQUEsS0FBQSxPQUFBLGFBQUEsQ0FBQSxLQUFBLE9BQUE7VUFDQSxLQUFBO1lBQ0EsT0FBQSxLQUFBLE9BQUE7O1FBRUEsT0FBQTs7O01BR0EsT0FBQSxlQUFBLENBQUEsYUFBQSxLQUFBLE9BQUEsb0JBQUEsQ0FBQSxLQUFBLE9BQUE7O01BRUEsT0FBQSxjQUFBLFVBQUE7UUFDQTtXQUNBO1dBQ0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQXlCQSxJQUFBLFlBQUEsSUFBQSxTQUFBO01BQ0EsT0FBQSxpQkFBQSxLQUFBLFlBQUEsVUFBQSxTQUFBLFNBQUE7TUFDQSxPQUFBLG1CQUFBLEtBQUEsWUFBQSxVQUFBLFNBQUEsU0FBQTtNQUNBLE9BQUEsZUFBQSxLQUFBLFlBQUEsVUFBQSxTQUFBLFNBQUE7O01BRUEsT0FBQSxtQkFBQSxVQUFBOztNQUVBLEtBQUE7UUFDQSxPQUFBO1FBQ0EsTUFBQTtRQUNBLE1BQUE7UUFDQSxTQUFBO1VBQ0EsUUFBQTtZQUNBLE1BQUE7WUFDQSxPQUFBO1lBQ0EsU0FBQTs7VUFFQSxTQUFBO1lBQ0EsTUFBQTtZQUNBLE9BQUE7WUFDQSxTQUFBO1lBQ0EsV0FBQTs7O1NBR0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7O0FDekhBLFFBQUEsT0FBQTtHQUNBLFdBQUEsWUFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFlBQUEsUUFBQSxPQUFBLFFBQUEsVUFBQSxPQUFBLGFBQUEsV0FBQTtNQUNBLE9BQUEsVUFBQTs7TUFFQSxPQUFBLGFBQUE7O01BRUEsSUFBQSxXQUFBLFNBQUE7TUFDQSxPQUFBLFlBQUEsTUFBQSxVQUFBOzs7O01BSUEsSUFBQSxXQUFBLFNBQUE7TUFDQSxPQUFBLFlBQUEsTUFBQSxVQUFBOzs7TUFHQSxPQUFBLGFBQUE7O01BRUEsU0FBQSxZQUFBO1FBQ0EsT0FBQSxHQUFBOzs7TUFHQSxTQUFBLFFBQUEsS0FBQTtRQUNBLE9BQUEsUUFBQSxLQUFBOzs7TUFHQSxTQUFBLFlBQUE7UUFDQSxPQUFBLFFBQUE7OztNQUdBLE9BQUEsUUFBQSxVQUFBO1FBQ0E7UUFDQSxZQUFBO1VBQ0EsT0FBQSxPQUFBLE9BQUEsVUFBQSxXQUFBOzs7TUFHQSxPQUFBLFdBQUEsVUFBQTtRQUNBO1FBQ0EsWUFBQTtVQUNBLE9BQUEsT0FBQSxPQUFBLFVBQUEsV0FBQTs7O01BR0EsT0FBQSxnQkFBQSxTQUFBLE9BQUE7UUFDQSxPQUFBLGFBQUE7OztNQUdBLE9BQUEsaUJBQUEsV0FBQTtRQUNBLElBQUEsUUFBQSxPQUFBO1FBQ0EsWUFBQSxlQUFBO1FBQ0EsS0FBQSxnQkFBQSwyQ0FBQTs7Ozs7O01BTUEsT0FBQSxVQUFBOzs7O0FDL0RBLFFBQUEsT0FBQTtHQUNBLFdBQUEsYUFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBQSxRQUFBLGNBQUEsUUFBQSxZQUFBO01BQ0EsSUFBQSxRQUFBLGFBQUE7O01BRUEsT0FBQSxVQUFBOztNQUVBLE9BQUEsaUJBQUEsVUFBQTtRQUNBLElBQUEsV0FBQSxPQUFBO1FBQ0EsSUFBQSxVQUFBLE9BQUE7O1FBRUEsSUFBQSxhQUFBLFFBQUE7VUFDQSxPQUFBLFFBQUE7VUFDQSxPQUFBLFVBQUE7VUFDQTs7O1FBR0EsWUFBQTtVQUNBO1VBQ0EsT0FBQTtVQUNBOzs7OztVQUtBOzs7Ozs7O0FDN0JBLFFBQUEsT0FBQTtHQUNBLFFBQUEsWUFBQSxXQUFBO0dBQ0EsV0FBQSxlQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFlBQUEsUUFBQSxpQkFBQSxPQUFBLGFBQUEsU0FBQSxXQUFBOztNQUVBLElBQUEsT0FBQSxXQUFBOztNQUVBLE9BQUEsYUFBQTs7TUFFQSxPQUFBLG1CQUFBLE1BQUEsUUFBQSxLQUFBLE9BQUE7OztNQUdBO09BQ0E7T0FDQSxLQUFBOzs7O01BSUEsT0FBQSxTQUFBLFVBQUE7UUFDQSxZQUFBOzs7TUFHQSxPQUFBLGNBQUE7TUFDQSxPQUFBLGdCQUFBLFVBQUE7UUFDQSxPQUFBLGNBQUEsQ0FBQSxPQUFBOzs7O01BSUEsRUFBQSxTQUFBLEdBQUEsU0FBQSxVQUFBO1FBQ0EsT0FBQSxjQUFBOzs7OztBQ3BDQSxRQUFBLE9BQUE7R0FDQSxXQUFBLGFBQUE7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsUUFBQSxPQUFBLFFBQUEsVUFBQSxPQUFBLGFBQUEsV0FBQTs7TUFFQSxPQUFBLGFBQUE7OztNQUdBLElBQUEsV0FBQSxTQUFBO01BQ0EsT0FBQSxZQUFBLE1BQUEsVUFBQTs7O01BR0EsT0FBQSxhQUFBOztNQUVBLFNBQUEsWUFBQTtRQUNBLE9BQUEsR0FBQTs7O01BR0EsU0FBQSxRQUFBLEtBQUE7UUFDQSxPQUFBLFFBQUEsS0FBQTs7O01BR0EsU0FBQSxZQUFBO1FBQ0EsT0FBQSxRQUFBOzs7TUFHQSxPQUFBLFFBQUEsVUFBQTtRQUNBO1FBQ0EsWUFBQTtVQUNBLE9BQUEsT0FBQSxPQUFBLFVBQUEsV0FBQTs7O01BR0EsT0FBQSxXQUFBLFVBQUE7UUFDQTtRQUNBLFlBQUE7VUFDQSxPQUFBLE9BQUEsT0FBQSxVQUFBLFdBQUE7OztNQUdBLE9BQUEsZ0JBQUEsU0FBQSxPQUFBO1FBQ0EsT0FBQSxhQUFBOzs7TUFHQSxPQUFBLGlCQUFBLFdBQUE7UUFDQSxJQUFBLFFBQUEsT0FBQTtRQUNBLFlBQUEsZUFBQTtRQUNBLEtBQUEsZ0JBQUEsMkNBQUE7Ozs7Ozs7O0FDakRBLFFBQUEsT0FBQTtHQUNBLFdBQUEsWUFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFVBQUEsUUFBQSxRQUFBLFVBQUEsYUFBQSxVQUFBLE9BQUEsYUFBQSxhQUFBLE1BQUE7O01BRUEsSUFBQSxXQUFBLFNBQUE7O01BRUEsT0FBQSxZQUFBLE1BQUEsVUFBQTs7TUFFQSxPQUFBLE9BQUEsWUFBQTs7TUFFQSxTQUFBLGFBQUEsT0FBQSxRQUFBO1FBQ0EsSUFBQSxPQUFBO1FBQ0EsTUFBQSxRQUFBOzs7OztRQUtBLE9BQUE7OztNQUdBLFNBQUEsYUFBQSxVQUFBO1FBQ0EsWUFBQSxJQUFBLFVBQUEsS0FBQTs7Ozs7UUFLQSxRQUFBLElBQUE7UUFDQSxFQUFBLG9CQUFBLE1BQUE7OztNQUdBLFNBQUEsaUJBQUEsTUFBQTtRQUNBLE9BQUE7VUFDQTtZQUNBLE1BQUE7WUFDQSxRQUFBO2NBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsUUFBQTs7Y0FFQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxRQUFBOztjQUVBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLFFBQUE7O2NBRUE7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsUUFBQTs7Ozs7OztNQU9BLE9BQUEsZUFBQTs7O01BR0EsT0FBQSxXQUFBLFVBQUEsTUFBQTtRQUNBLElBQUEsT0FBQTtRQUNBLEtBQUEsYUFBQSxRQUFBOzs7UUFHQSxPQUFBOzs7TUFHQSxZQUFBLFNBQUEsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BaUNBLE9BQUEsYUFBQSxZQUFBOztRQUVBLFdBQUE7VUFDQSxhQUFBLE9BQUE7VUFDQSxTQUFBLENBQUEsRUFBQSxJQUFBLFlBQUEsS0FBQSxLQUFBLE1BQUEsWUFBQSxLQUFBLFFBQUEsTUFBQSxPQUFBLE9BQUE7VUFDQSxRQUFBLEVBQUEsTUFBQSxPQUFBLFdBQUEsUUFBQSxPQUFBLGFBQUEsVUFBQSxPQUFBLGVBQUEsTUFBQSxPQUFBO1VBQ0EsV0FBQTs7O1FBR0EsWUFBQSxJQUFBLFlBQUEsS0FBQSxLQUFBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O01BaUJBLE9BQUEsaUJBQUEsWUFBQTtRQUNBLE9BQUEsa0JBQUE7UUFDQSxPQUFBLFlBQUE7UUFDQSxPQUFBLGNBQUE7UUFDQSxPQUFBLGdCQUFBO1FBQ0EsT0FBQSxZQUFBO1FBQ0EsT0FBQSxxQkFBQTs7OztNQUlBLE9BQUEsZUFBQSxVQUFBO1FBQ0EsT0FBQSxtQkFBQTs7OztNQUlBLE9BQUEsZUFBQSxZQUFBOztRQUVBLFNBQUEsT0FBQTtRQUNBLGVBQUEsT0FBQTs7UUFFQSxTQUFBLENBQUEsR0FBQSxZQUFBLEtBQUEsS0FBQSxLQUFBLFlBQUEsS0FBQSxRQUFBLE1BQUEsTUFBQTtRQUNBLFlBQUEsS0FBQSxPQUFBLFNBQUEsTUFBQTs7Ozs7O1VBTUEsTUFBQTs7Ozs7OztRQU9BLE9BQUE7OztNQUdBLE9BQUEsV0FBQSxVQUFBLE1BQUE7O1FBRUEsSUFBQTtRQUNBLE1BQUEsU0FBQSxTQUFBLGNBQUE7UUFDQSxPQUFBLFlBQUE7OztRQUdBLElBQUEsU0FBQSxTQUFBLGNBQUE7UUFDQSxPQUFBLFdBQUE7UUFDQSxPQUFBLFlBQUE7UUFDQSxPQUFBLFFBQUE7UUFDQSxPQUFBLFlBQUE7OztRQUdBLElBQUEsS0FBQSxPQUFBLE1BQUE7VUFDQSxTQUFBLFNBQUEsY0FBQTtVQUNBLE9BQUEsWUFBQTtVQUNBLE9BQUEsUUFBQTtVQUNBLE9BQUEsWUFBQTs7UUFFQSxJQUFBLEtBQUEsT0FBQSxRQUFBO1VBQ0EsU0FBQSxTQUFBLGNBQUE7VUFDQSxPQUFBLFlBQUE7VUFDQSxPQUFBLFFBQUE7VUFDQSxPQUFBLFlBQUE7O1FBRUEsSUFBQSxLQUFBLE9BQUEsVUFBQTtVQUNBLFNBQUEsU0FBQSxjQUFBO1VBQ0EsT0FBQSxZQUFBO1VBQ0EsT0FBQSxRQUFBO1VBQ0EsT0FBQSxZQUFBOztRQUVBLElBQUEsS0FBQSxPQUFBLE1BQUE7VUFDQSxTQUFBLFNBQUEsY0FBQTtVQUNBLE9BQUEsWUFBQTtVQUNBLE9BQUEsUUFBQTtVQUNBLE9BQUEsWUFBQTs7O1FBR0EsT0FBQSxXQUFBLFNBQUEsY0FBQSxHQUFBO1VBQ0EsUUFBQSxFQUFBLE9BQUE7OztRQUdBLEtBQUE7VUFDQSxPQUFBOztVQUVBLFNBQUE7WUFDQSxTQUFBOztXQUVBLEtBQUEsWUFBQTs7VUFFQSxVQUFBLEVBQUEsSUFBQSxZQUFBLEtBQUEsS0FBQSxNQUFBLFlBQUEsS0FBQSxRQUFBLE1BQUEsT0FBQTs7VUFFQSxZQUFBLEtBQUEsS0FBQSxLQUFBLFNBQUEsTUFBQTs7Ozs7O1lBTUEsTUFBQTs7Ozs7OztVQU9BLE9BQUE7Ozs7O01BS0EsT0FBQSxlQUFBLFVBQUEsUUFBQSxRQUFBLE9BQUE7O1FBRUEsS0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBLDZCQUFBLE9BQUEsT0FBQTtVQUNBLE1BQUE7VUFDQSxTQUFBO1lBQ0EsUUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQTs7WUFFQSxTQUFBO2NBQ0EsV0FBQTtjQUNBLFlBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLFNBQUE7OztXQUdBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQTJCQSxPQUFBLGVBQUEsVUFBQSxRQUFBLFFBQUEsT0FBQTtRQUNBLEtBQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQSw2QkFBQSxPQUFBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTtZQUNBLFFBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLFNBQUE7O1lBRUEsU0FBQTtjQUNBLFdBQUE7Y0FDQSxZQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOzs7V0FHQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7O01BZ0JBLE9BQUEsdUJBQUEsVUFBQSxRQUFBLFFBQUEsT0FBQTtRQUNBLEtBQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQSw2QkFBQSxPQUFBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTtZQUNBLFFBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLFNBQUE7O1lBRUEsU0FBQTtjQUNBLFdBQUE7Y0FDQSxZQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOzs7V0FHQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUEyQkEsT0FBQSxhQUFBLFVBQUEsTUFBQTtRQUNBLEtBQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLE1BQUE7VUFDQSxTQUFBO1lBQ0EsUUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQTs7WUFFQSxTQUFBO2NBQ0EsV0FBQTtjQUNBLFlBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLFNBQUE7OztXQUdBLEtBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQWlDQSxPQUFBLFlBQUEsVUFBQSxNQUFBO1FBQ0EsS0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUE7WUFDQSxRQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOztZQUVBLFNBQUE7Y0FDQSxXQUFBO2NBQ0EsWUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQTs7O1dBR0EsS0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUF1QkEsT0FBQSxpQkFBQSxVQUFBLE1BQUE7UUFDQSxLQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTtZQUNBLFFBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLFNBQUE7O1lBRUEsU0FBQTtjQUNBLFdBQUE7Y0FDQSxZQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOzs7V0FHQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUF3QkEsT0FBQSxrQkFBQSxVQUFBLFFBQUEsUUFBQTtRQUNBLElBQUEsVUFBQSxNQUFBO1VBQ0EsT0FBQTtlQUNBLEVBQUEsT0FBQTs7UUFFQSxLQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTtZQUNBLFFBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLFNBQUE7O1lBRUEsU0FBQTtjQUNBLFdBQUE7Y0FDQSxZQUFBO2NBQ0EsTUFBQTtjQUNBLE9BQUE7Y0FDQSxTQUFBOzs7V0FHQSxLQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztNQWlCQSxPQUFBLGlCQUFBLFVBQUEsUUFBQSxRQUFBO1FBQ0EsSUFBQSxVQUFBLE1BQUE7VUFDQSxPQUFBO2VBQ0EsRUFBQSxPQUFBOztRQUVBLEtBQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLE1BQUE7VUFDQSxTQUFBO1lBQ0EsUUFBQTtjQUNBLE1BQUE7Y0FDQSxPQUFBO2NBQ0EsU0FBQTs7WUFFQSxTQUFBO2NBQ0EsV0FBQTtjQUNBLFlBQUE7Y0FDQSxNQUFBO2NBQ0EsT0FBQTtjQUNBLFNBQUE7OztXQUdBLEtBQUE7Ozs7Ozs7Ozs7Ozs7OztNQWVBLE9BQUEsT0FBQSxhQUFBLFVBQUEsV0FBQTtRQUNBLFlBQUEsaUJBQUEsV0FBQSxPQUFBLGVBQUE7VUFDQTs7Ozs7O01BTUEsT0FBQSxvQkFBQSxZQUFBO1FBQ0EsWUFBQSxpQkFBQSxPQUFBLFdBQUEsT0FBQSxlQUFBO1VBQ0E7Ozs7Ozs7Ozs7OztBQ3RsQkEsUUFBQSxPQUFBO0dBQ0EsV0FBQSxjQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBQSxRQUFBLGNBQUEsWUFBQTtNQUNBLElBQUEsUUFBQSxhQUFBOztNQUVBLE9BQUEsVUFBQTs7TUFFQSxJQUFBLE9BQUE7UUFDQSxZQUFBLE9BQUE7VUFDQSxTQUFBLEtBQUE7WUFDQSxPQUFBLFVBQUE7WUFDQSxPQUFBLFVBQUE7O1VBRUEsU0FBQSxJQUFBO1lBQ0EsT0FBQSxVQUFBOzs7O0FBSUEiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdyZWcnLCBbXHJcbiAgJ3VpLnJvdXRlcicsXHJcbiAgJ2NoYXJ0LmpzJyxcclxuICAndGhhdGlzdWRheS5kcm9wem9uZSdcclxuXSk7XHJcblxyXG5hcHBcclxuICAuY29uZmlnKFtcclxuICAgICckaHR0cFByb3ZpZGVyJyxcclxuICAgIGZ1bmN0aW9uKCRodHRwUHJvdmlkZXIpe1xyXG5cclxuICAgICAgLy8gQWRkIGF1dGggdG9rZW4gdG8gQXV0aG9yaXphdGlvbiBoZWFkZXJcclxuICAgICAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCgnQXV0aEludGVyY2VwdG9yJyk7XHJcblxyXG4gICAgfV0pXHJcbiAgLnJ1bihbXHJcbiAgICAnQXV0aFNlcnZpY2UnLFxyXG4gICAgJ1Nlc3Npb24nLFxyXG4gICAgZnVuY3Rpb24oQXV0aFNlcnZpY2UsIFNlc3Npb24pe1xyXG5cclxuICAgICAgLy8gU3RhcnR1cCwgbG9naW4gaWYgdGhlcmUncyAgYSB0b2tlbi5cclxuICAgICAgdmFyIHRva2VuID0gU2Vzc2lvbi5nZXRUb2tlbigpO1xyXG4gICAgICBpZiAodG9rZW4pe1xyXG4gICAgICAgIEF1dGhTZXJ2aWNlLmxvZ2luV2l0aFRva2VuKHRva2VuKTtcclxuICAgICAgfVxyXG5cclxuICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gICAgLmNvbnN0YW50KCdFVkVOVF9JTkZPJywge1xyXG4gICAgICAgIE5BTUU6ICdIYWNraXQgMjAyMCcsXHJcbiAgICB9KVxyXG4gICAgLmNvbnN0YW50KCdEQVNIQk9BUkQnLCB7XHJcbiAgICAgICAgVU5WRVJJRklFRDogJ1lvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhbiBlbWFpbCBhc2tpbmcgeW91IHZlcmlmeSB5b3VyIGVtYWlsLiBDbGljayB0aGUgbGluayBpbiB0aGUgZW1haWwgYW5kIHlvdSBjYW4gc3RhcnQgeW91ciBhcHBsaWNhdGlvbiEnLFxyXG4gICAgICAgIElOQ09NUExFVEVfVElUTEU6ICdZb3Ugc3RpbGwgbmVlZCB0byBjb21wbGV0ZSB5b3VyIGFwcGxpY2F0aW9uIScsXHJcbiAgICAgICAgSU5DT01QTEVURTogJ0lmIHlvdSBkbyBub3QgY29tcGxldGUgeW91ciBhcHBsaWNhdGlvbiBiZWZvcmUgdGhlIFtBUFBfREVBRExJTkVdLCB5b3Ugd2lsbCBub3QgYmUgY29uc2lkZXJlZCBmb3IgdGhlIGFkbWlzc2lvbnMgbG90dGVyeSEnLFxyXG4gICAgICAgIFNVQk1JVFRFRF9USVRMRTogJ1lvdXIgYXBwbGljYXRpb24gaGFzIGJlZW4gc3VibWl0dGVkIScsXHJcbiAgICAgICAgU1VCTUlUVEVEOiAnRmVlbCBmcmVlIHRvIGVkaXQgaXQgYXQgYW55IHRpbWUuIEhvd2V2ZXIsIG9uY2UgcmVnaXN0cmF0aW9uIGlzIGNsb3NlZCwgeW91IHdpbGwgbm90IGJlIGFibGUgdG8gZWRpdCBpdCBhbnkgZnVydGhlci5cXG5BZG1pc3Npb25zIHdpbGwgYmUgZGV0ZXJtaW5lZCBieSBhIHJhbmRvbSBsb3R0ZXJ5LiBQbGVhc2UgbWFrZSBzdXJlIHlvdXIgaW5mb3JtYXRpb24gaXMgYWNjdXJhdGUgYmVmb3JlIHJlZ2lzdHJhdGlvbiBpcyBjbG9zZWQhJyxcclxuICAgICAgICBDTE9TRURfQU5EX0lOQ09NUExFVEVfVElUTEU6ICdVbmZvcnR1bmF0ZWx5LCByZWdpc3RyYXRpb24gaGFzIGNsb3NlZCwgYW5kIHRoZSBsb3R0ZXJ5IHByb2Nlc3MgaGFzIGJlZ3VuLicsXHJcbiAgICAgICAgQ0xPU0VEX0FORF9JTkNPTVBMRVRFOiAnQmVjYXVzZSB5b3UgaGF2ZSBub3QgY29tcGxldGVkIHlvdXIgcHJvZmlsZSBpbiB0aW1lLCB5b3Ugd2lsbCBub3QgYmUgZWxpZ2libGUgZm9yIHRoZSBsb3R0ZXJ5IHByb2Nlc3MuJyxcclxuICAgICAgICBBRE1JVFRFRF9BTkRfQ0FOX0NPTkZJUk1fVElUTEU6ICdZb3UgbXVzdCBjb25maXJtIGJ5IFtDT05GSVJNX0RFQURMSU5FXS4nLFxyXG4gICAgICAgIEFETUlUVEVEX0FORF9DQU5OT1RfQ09ORklSTV9USVRMRTogJ1lvdXIgY29uZmlybWF0aW9uIGRlYWRsaW5lIG9mIFtDT05GSVJNX0RFQURMSU5FXSBoYXMgcGFzc2VkLicsXHJcbiAgICAgICAgQURNSVRURURfQU5EX0NBTk5PVF9DT05GSVJNOiAnQWx0aG91Z2ggeW91IHdlcmUgYWNjZXB0ZWQsIHlvdSBkaWQgbm90IGNvbXBsZXRlIHlvdXIgY29uZmlybWF0aW9uIGluIHRpbWUuXFxuVW5mb3J0dW5hdGVseSwgdGhpcyBtZWFucyB0aGF0IHlvdSB3aWxsIG5vdCBiZSBhYmxlIHRvIGF0dGVuZCB0aGUgZXZlbnQsIGFzIHdlIG11c3QgYmVnaW4gdG8gYWNjZXB0IG90aGVyIGFwcGxpY2FudHMgb24gdGhlIHdhaXRsaXN0LlxcbldlIGhvcGUgdG8gc2VlIHlvdSBhZ2FpbiBuZXh0IHllYXIhJyxcclxuICAgICAgICBDT05GSVJNRURfTk9UX1BBU1RfVElUTEU6ICdZb3UgY2FuIGVkaXQgeW91ciBjb25maXJtYXRpb24gaW5mb3JtYXRpb24gdW50aWwgW0NPTkZJUk1fREVBRExJTkVdJyxcclxuICAgICAgICBERUNMSU5FRDogJ1dlXFwncmUgc29ycnkgdG8gaGVhciB0aGF0IHlvdSB3b25cXCd0IGJlIGFibGUgdG8gbWFrZSBpdCB0byBIYWNraXQgMjAyMCEgOihcXG5NYXliZSBuZXh0IHllYXIhIFdlIGhvcGUgeW91IHNlZSB5b3UgYWdhaW4gc29vbi4nLFxyXG4gICAgfSlcclxuICAgIC5jb25zdGFudCgnVEVBTScse1xyXG4gICAgICAgIE5PX1RFQU1fUkVHX0NMT1NFRDogJ1VuZm9ydHVuYXRlbHksIGl0XFwncyB0b28gbGF0ZSB0byBlbnRlciB0aGUgbG90dGVyeSB3aXRoIGEgdGVhbS5cXG5Ib3dldmVyLCB5b3UgY2FuIHN0aWxsIGZvcm0gdGVhbXMgb24geW91ciBvd24gYmVmb3JlIG9yIGR1cmluZyB0aGUgZXZlbnQhJyxcclxuICAgIH0pO1xyXG4iLCJcclxuYW5ndWxhci5tb2R1bGUoJ3JlZycpXHJcbiAgLmNvbmZpZyhbXHJcbiAgICAnJHN0YXRlUHJvdmlkZXInLFxyXG4gICAgJyR1cmxSb3V0ZXJQcm92aWRlcicsXHJcbiAgICAnJGxvY2F0aW9uUHJvdmlkZXInLFxyXG4gICAgZnVuY3Rpb24oXHJcbiAgICAgICRzdGF0ZVByb3ZpZGVyLFxyXG4gICAgICAkdXJsUm91dGVyUHJvdmlkZXIsXHJcbiAgICAgICRsb2NhdGlvblByb3ZpZGVyKSB7XHJcblxyXG4gICAgLy8gRm9yIGFueSB1bm1hdGNoZWQgdXJsLCByZWRpcmVjdCB0byAvc3RhdGUxXHJcbiAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKFwiLzQwNFwiKTtcclxuICAgIFxyXG4gICAgLy8gU2V0IHVwIGRlIHN0YXRlc1xyXG4gICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgLnN0YXRlKCdsb2dpbicsIHtcclxuICAgICAgICB1cmw6IFwiL2xvZ2luXCIsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvbG9naW4vbG9naW4uaHRtbFwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIHJlcXVpcmVMb2dpbjogZmFsc2UsXHJcbiAgICAgICAgICByZXF1aXJlTG9nb3V0OiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICAnc2V0dGluZ3MnOiBmdW5jdGlvbihTZXR0aW5nc1NlcnZpY2Upe1xyXG4gICAgICAgICAgICByZXR1cm4gU2V0dGluZ3NTZXJ2aWNlLmdldFB1YmxpY1NldHRpbmdzKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICAuc3RhdGUoJ2hvbWUnLCB7XHJcbiAgICAgICAgdXJsOiBcIi9cIixcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9sb2dpbi9sb2dpbi5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ0xvZ2luQ3RybCcsXHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgcmVxdWlyZUxvZ2luOiBmYWxzZSxcclxuICAgICAgICAgIHJlcXVpcmVMb2dvdXQ6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICdzZXR0aW5ncyc6IGZ1bmN0aW9uKFNldHRpbmdzU2VydmljZSl7XHJcbiAgICAgICAgICAgIHJldHVybiBTZXR0aW5nc1NlcnZpY2UuZ2V0UHVibGljU2V0dGluZ3MoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcblxyXG4gICAgICAvLyAuc3RhdGUoJ2hvbWUnLCB7XHJcbiAgICAgIC8vICAgdXJsOiBcIi9cIixcclxuICAgICAgLy8gICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9ob21lL2hvbWUuaHRtbFwiLFxyXG4gICAgICAvLyAgIGNvbnRyb2xsZXI6ICdIb21lQ3RybCcsXHJcbiAgICAgIC8vICAgZGF0YToge1xyXG4gICAgICAvLyAgICAgcmVxdWlyZUxvZ2luOiBmYWxzZVxyXG4gICAgICAvLyAgIH0sXHJcbiAgICAgIC8vICAgcmVzb2x2ZToge1xyXG4gICAgICAvLyAgICAgJ3NldHRpbmdzJzogZnVuY3Rpb24oU2V0dGluZ3NTZXJ2aWNlKXtcclxuICAgICAgLy8gICAgICAgcmV0dXJuIFNldHRpbmdzU2VydmljZS5nZXRQdWJsaWNTZXR0aW5ncygpO1xyXG4gICAgICAvLyAgICAgfVxyXG4gICAgICAvLyAgIH1cclxuICAgICAgLy8gfSlcclxuXHJcbiAgICAgIC5zdGF0ZSgnYXBwJywge1xyXG4gICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAnJzoge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9iYXNlLmh0bWxcIixcclxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJCYXNlQ3RybFwiLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgICdzaWRlYmFyQGFwcCc6IHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3Mvc2lkZWJhci9zaWRlYmFyLmh0bWxcIixcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ1NpZGViYXJDdHJsJyxcclxuICAgICAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgICAgIHNldHRpbmdzOiBmdW5jdGlvbihTZXR0aW5nc1NlcnZpY2UpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBTZXR0aW5nc1NlcnZpY2UuZ2V0UHVibGljU2V0dGluZ3MoKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIHJlcXVpcmVMb2dpbjogdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgLnN0YXRlKCdhcHAuZGFzaGJvYXJkJywge1xyXG4gICAgICAgIHVybDogXCIvZGFzaGJvYXJkXCIsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvZGFzaGJvYXJkL2Rhc2hib2FyZC5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ0Rhc2hib2FyZEN0cmwnLFxyXG4gICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgIGN1cnJlbnRVc2VyOiBmdW5jdGlvbihVc2VyU2VydmljZSl7XHJcbiAgICAgICAgICAgIHJldHVybiBVc2VyU2VydmljZS5nZXRDdXJyZW50VXNlcigpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHNldHRpbmdzOiBmdW5jdGlvbihTZXR0aW5nc1NlcnZpY2Upe1xyXG4gICAgICAgICAgICByZXR1cm4gU2V0dGluZ3NTZXJ2aWNlLmdldFB1YmxpY1NldHRpbmdzKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgfSlcclxuICAgICAgLnN0YXRlKCdhcHAuYXBwbGljYXRpb24nLCB7XHJcbiAgICAgICAgdXJsOiBcIi9hcHBsaWNhdGlvblwiLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uLmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiAnQXBwbGljYXRpb25DdHJsJyxcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICByZXF1aXJlVmVyaWZpZWQ6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgIGN1cnJlbnRVc2VyOiBmdW5jdGlvbihVc2VyU2VydmljZSl7XHJcbiAgICAgICAgICAgIHJldHVybiBVc2VyU2VydmljZS5nZXRDdXJyZW50VXNlcigpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHNldHRpbmdzOiBmdW5jdGlvbihTZXR0aW5nc1NlcnZpY2Upe1xyXG4gICAgICAgICAgICByZXR1cm4gU2V0dGluZ3NTZXJ2aWNlLmdldFB1YmxpY1NldHRpbmdzKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICAuc3RhdGUoJ2FwcC5jb25maXJtYXRpb24nLCB7XHJcbiAgICAgICAgdXJsOiBcIi9jb25maXJtYXRpb25cIixcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb25maXJtYXRpb24vY29uZmlybWF0aW9uLmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiAnQ29uZmlybWF0aW9uQ3RybCcsXHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgcmVxdWlyZUFkbWl0dGVkOiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICBjdXJyZW50VXNlcjogZnVuY3Rpb24oVXNlclNlcnZpY2Upe1xyXG4gICAgICAgICAgICByZXR1cm4gVXNlclNlcnZpY2UuZ2V0Q3VycmVudFVzZXIoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgnYXBwLmNoYWxsZW5nZXMnLCB7XHJcbiAgICAgICAgdXJsOiBcIi9jaGFsbGVuZ2VzXCIsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvY2hhbGxlbmdlcy9jaGFsbGVuZ2VzLmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiAnQ2hhbGxlbmdlc0N0cmwnLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIHJlcXVpcmVWZXJpZmllZDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgY3VycmVudFVzZXI6IGZ1bmN0aW9uKFVzZXJTZXJ2aWNlKXtcclxuICAgICAgICAgICAgcmV0dXJuIFVzZXJTZXJ2aWNlLmdldEN1cnJlbnRVc2VyKCk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgc2V0dGluZ3M6IGZ1bmN0aW9uKFNldHRpbmdzU2VydmljZSl7XHJcbiAgICAgICAgICAgIHJldHVybiBTZXR0aW5nc1NlcnZpY2UuZ2V0UHVibGljU2V0dGluZ3MoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgnYXBwLnRlYW0nLCB7XHJcbiAgICAgICAgdXJsOiBcIi90ZWFtXCIsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvdGVhbS90ZWFtLmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiAnVGVhbUN0cmwnLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIHJlcXVpcmVWZXJpZmllZDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgY3VycmVudFVzZXI6IGZ1bmN0aW9uKFVzZXJTZXJ2aWNlKXtcclxuICAgICAgICAgICAgcmV0dXJuIFVzZXJTZXJ2aWNlLmdldEN1cnJlbnRVc2VyKCk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgc2V0dGluZ3M6IGZ1bmN0aW9uKFNldHRpbmdzU2VydmljZSl7XHJcbiAgICAgICAgICAgIHJldHVybiBTZXR0aW5nc1NlcnZpY2UuZ2V0UHVibGljU2V0dGluZ3MoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgnYXBwLmFkbWluJywge1xyXG4gICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAnJzoge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9hZG1pbi9hZG1pbi5odG1sXCIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdhZG1pbkN0cmwnXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICByZXF1aXJlQWRtaW46IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgnYXBwLmNoZWNraW4nLCB7XHJcbiAgICAgICAgdXJsOiAnL2NoZWNraW4nLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY2hlY2tpbi9jaGVja2luLmh0bWwnLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdDaGVja2luQ3RybCcsXHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgcmVxdWlyZVZvbHVudGVlcjogdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgLnN0YXRlKCdhcHAuYWRtaW4uc3RhdHMnLCB7XHJcbiAgICAgICAgdXJsOiBcIi9hZG1pblwiLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2FkbWluL3N0YXRzL3N0YXRzLmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiAnQWRtaW5TdGF0c0N0cmwnXHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgnYXBwLmFkbWluLm1haWwnLCB7XHJcbiAgICAgICAgdXJsOiBcIi9hZG1pbi9tYWlsXCIsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvYWRtaW4vbWFpbC9tYWlsLmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiAnQWRtaW5NYWlsQ3RybCdcclxuICAgICAgfSlcclxuICAgICAgLnN0YXRlKCdhcHAuYWRtaW4uY2hhbGxlbmdlcycsIHtcclxuICAgICAgICB1cmw6IFwiL2FkbWluL2NoYWxsZW5nZXNcIixcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9hZG1pbi9jaGFsbGVuZ2VzL2NoYWxsZW5nZXMuaHRtbFwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdhZG1pbkNoYWxsZW5nZXNDdHJsJ1xyXG4gICAgICB9KVxyXG4gICAgICAuc3RhdGUoJ2FwcC5hZG1pbi5jaGFsbGVuZ2UnLCB7XHJcbiAgICAgICAgdXJsOiBcIi9hZG1pbi9jaGFsbGVuZ2VzLzppZFwiLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2FkbWluL2NoYWxsZW5nZS9jaGFsbGVuZ2UuaHRtbFwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdhZG1pbkNoYWxsZW5nZUN0cmwnLFxyXG4gICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICdjaGFsbGVuZ2UnOiBmdW5jdGlvbigkc3RhdGVQYXJhbXMsIENoYWxsZW5nZVNlcnZpY2Upe1xyXG4gICAgICAgICAgICByZXR1cm4gQ2hhbGxlbmdlU2VydmljZS5nZXQoJHN0YXRlUGFyYW1zLmlkKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgnYXBwLmFkbWluLm1hcmtldGluZycsIHtcclxuICAgICAgICB1cmw6IFwiL2FkbWluL21hcmtldGluZ1wiLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2FkbWluL21hcmtldGluZy9tYXJrZXRpbmcuaHRtbFwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdhZG1pbk1hcmtldGluZ0N0cmwnXHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgnYXBwLmFkbWluLnVzZXJzJywge1xyXG4gICAgICAgIHVybDogXCIvYWRtaW4vdXNlcnM/XCIgK1xyXG4gICAgICAgICAgJyZwYWdlJyArXHJcbiAgICAgICAgICAnJnNpemUnICtcclxuICAgICAgICAgICcmcXVlcnknLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2FkbWluL3VzZXJzL3VzZXJzLmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiAnQWRtaW5Vc2Vyc0N0cmwnXHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgnYXBwLmFkbWluLnVzZXInLCB7XHJcbiAgICAgICAgdXJsOiBcIi9hZG1pbi91c2Vycy86aWRcIixcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9hZG1pbi91c2VyL3VzZXIuaHRtbFwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdBZG1pblVzZXJDdHJsJyxcclxuICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICAndXNlcic6IGZ1bmN0aW9uKCRzdGF0ZVBhcmFtcywgVXNlclNlcnZpY2Upe1xyXG4gICAgICAgICAgICByZXR1cm4gVXNlclNlcnZpY2UuZ2V0KCRzdGF0ZVBhcmFtcy5pZCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICAuc3RhdGUoJ2FwcC5hZG1pbi5zZXR0aW5ncycsIHtcclxuICAgICAgICB1cmw6IFwiL2FkbWluL3NldHRpbmdzXCIsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvYWRtaW4vc2V0dGluZ3Mvc2V0dGluZ3MuaHRtbFwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdBZG1pblNldHRpbmdzQ3RybCcsXHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgnYXBwLmFkbWluLnRlYW1zJywge1xyXG4gICAgICAgIHVybDogXCIvYWRtaW4vdGVhbXNcIixcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9hZG1pbi90ZWFtcy90ZWFtcy5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ0FkbWluVGVhbUN0cmwnLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIHJlcXVpcmVWZXJpZmllZDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgY3VycmVudFVzZXI6IGZ1bmN0aW9uKFVzZXJTZXJ2aWNlKXtcclxuICAgICAgICAgICAgcmV0dXJuIFVzZXJTZXJ2aWNlLmdldEN1cnJlbnRVc2VyKCk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgc2V0dGluZ3M6IGZ1bmN0aW9uKFNldHRpbmdzU2VydmljZSl7XHJcbiAgICAgICAgICAgIHJldHVybiBTZXR0aW5nc1NlcnZpY2UuZ2V0UHVibGljU2V0dGluZ3MoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgncmVzZXQnLCB7XHJcbiAgICAgICAgdXJsOiBcIi9yZXNldC86dG9rZW5cIixcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9yZXNldC9yZXNldC5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ1Jlc2V0Q3RybCcsXHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgcmVxdWlyZUxvZ2luOiBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgLnN0YXRlKCd2ZXJpZnknLCB7XHJcbiAgICAgICAgdXJsOiBcIi92ZXJpZnkvOnRva2VuXCIsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvdmVyaWZ5L3ZlcmlmeS5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ1ZlcmlmeUN0cmwnLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIHJlcXVpcmVMb2dpbjogZmFsc2VcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIC5zdGF0ZSgnNDA0Jywge1xyXG4gICAgICAgIHVybDogXCIvNDA0XCIsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvNDA0Lmh0bWxcIixcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICByZXF1aXJlTG9naW46IGZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUoe1xyXG4gICAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgfSk7XHJcblxyXG4gIH1dKVxyXG4gIC5ydW4oW1xyXG4gICAgJyRyb290U2NvcGUnLFxyXG4gICAgJyRzdGF0ZScsXHJcbiAgICAnU2Vzc2lvbicsXHJcbiAgICBmdW5jdGlvbihcclxuICAgICAgJHJvb3RTY29wZSxcclxuICAgICAgJHN0YXRlLFxyXG4gICAgICBTZXNzaW9uICl7XHJcblxyXG4gICAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3VjY2VzcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AgPSAwO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMpIHtcclxuXHJcbiAgICAgICAgdmFyIHJlcXVpcmVMb2dpbiA9IHRvU3RhdGUuZGF0YS5yZXF1aXJlTG9naW47XHJcbiAgICAgICAgdmFyIHJlcXVpcmVMb2dvdXQgPSB0b1N0YXRlLmRhdGEucmVxdWlyZUxvZ291dDtcclxuICAgICAgICB2YXIgcmVxdWlyZUFkbWluID0gdG9TdGF0ZS5kYXRhLnJlcXVpcmVBZG1pbjtcclxuICAgICAgICB2YXIgcmVxdWlyZVZvbHVudGVlciA9IHRvU3RhdGUuZGF0YS5yZXF1aXJlVm9sdW50ZWVyO1xyXG4gICAgICAgIHZhciByZXF1aXJlVmVyaWZpZWQgPSB0b1N0YXRlLmRhdGEucmVxdWlyZVZlcmlmaWVkO1xyXG4gICAgICAgIHZhciByZXF1aXJlQWRtaXR0ZWQgPSB0b1N0YXRlLmRhdGEucmVxdWlyZUFkbWl0dGVkO1xyXG4gIFxyXG4gICAgICAgIGlmIChyZXF1aXJlTG9naW4gJiYgIVNlc3Npb24uZ2V0VG9rZW4oKSkge1xyXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICRzdGF0ZS5nbygnaG9tZScpO1xyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICBpZiAocmVxdWlyZUxvZ291dCAmJiBTZXNzaW9uLmdldFRva2VuKCkpIHtcclxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5kYXNoYm9hcmQnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHJlcXVpcmVBZG1pbiAmJiAhU2Vzc2lvbi5nZXRVc2VyKCkuYWRtaW4pIHtcclxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7ICAgICAgICAgICBcclxuICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmRhc2hib2FyZCcpO1xyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICBpZiAocmVxdWlyZVZvbHVudGVlciAmJiAhU2Vzc2lvbi5nZXRVc2VyKCkudm9sdW50ZWVyICYmIHJlcXVpcmVBZG1pbiAmJiAhU2Vzc2lvbi5nZXRVc2VyKCkuYWRtaW4pIHtcclxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7ICAgICAgICAgICBcclxuICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmRhc2hib2FyZCcpO1xyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICBpZiAocmVxdWlyZVZlcmlmaWVkICYmICFTZXNzaW9uLmdldFVzZXIoKS52ZXJpZmllZCkge1xyXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTsgICAgICAgICAgIFxyXG4gICAgICAgICAgJHN0YXRlLmdvKCdhcHAuZGFzaGJvYXJkJyk7XHJcbiAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgIGlmIChyZXF1aXJlQWRtaXR0ZWQgJiYgIVNlc3Npb24uZ2V0VXNlcigpLnN0YXR1cy5hZG1pdHRlZCkge1xyXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTsgICAgICAgICAgIFxyXG4gICAgICAgICAgJHN0YXRlLmdvKCdhcHAuZGFzaGJvYXJkJyk7XHJcbiAgICAgICAgfVxyXG4gIFxyXG5cclxuICAgICAgfSk7XHJcblxyXG4gICAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcclxuICAuZmFjdG9yeSgnQXV0aEludGVyY2VwdG9yJywgW1xyXG4gICAgJ1Nlc3Npb24nLFxyXG4gICAgZnVuY3Rpb24oU2Vzc2lvbil7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICByZXF1ZXN0OiBmdW5jdGlvbihjb25maWcpe1xyXG4gICAgICAgICAgICB2YXIgdG9rZW4gPSBTZXNzaW9uLmdldFRva2VuKCk7XHJcbiAgICAgICAgICAgIGlmICh0b2tlbil7XHJcbiAgICAgICAgICAgICAgY29uZmlnLmhlYWRlcnNbJ3gtYWNjZXNzLXRva2VuJ10gPSB0b2tlbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gY29uZmlnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5mYWN0b3J5KCdBdXRoU2VydmljZScsIFtcclxuICAgICckaHR0cCcsXHJcbiAgICAnJHJvb3RTY29wZScsXHJcbiAgICAnJHN0YXRlJyxcclxuICAgICckd2luZG93JyxcclxuICAgICdTZXNzaW9uJyxcclxuICAgIGZ1bmN0aW9uKCRodHRwLCAkcm9vdFNjb3BlLCAkc3RhdGUsICR3aW5kb3csIFNlc3Npb24pIHtcclxuICAgICAgdmFyIGF1dGhTZXJ2aWNlID0ge307XHJcblxyXG4gICAgICBmdW5jdGlvbiBsb2dpblN1Y2Nlc3MoZGF0YSwgY2IsIHZvbHVudGVlcil7XHJcbiAgICAgICAgLy8gV2lubmVyIHdpbm5lciB5b3UgZ2V0IGEgdG9rZW5cclxuICAgICAgICBpZighdm9sdW50ZWVyKSB7U2Vzc2lvbi5jcmVhdGUoZGF0YS50b2tlbiwgZGF0YS51c2VyKTt9XHJcblxyXG4gICAgICAgIGlmIChjYil7XHJcbiAgICAgICAgICBjYihkYXRhLnVzZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gbG9naW5GYWlsdXJlKGRhdGEsIGNiLCB2b2x1bnRlZXIpe1xyXG4gICAgICAgIGlmKCF2b2x1bnRlZXIpIHskc3RhdGUuZ28oJ2hvbWUnKTt9XHJcbiAgICAgICAgaWYgKGNiKSB7XHJcbiAgICAgICAgICBjYihkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGF1dGhTZXJ2aWNlLmxvZ2luV2l0aFBhc3N3b3JkID0gZnVuY3Rpb24oZW1haWwsIHBhc3N3b3JkLCBvblN1Y2Nlc3MsIG9uRmFpbHVyZSkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cFxyXG4gICAgICAgICAgLnBvc3QoJy9hdXRoL2xvZ2luJywge1xyXG4gICAgICAgICAgICBlbWFpbDogZW1haWwsXHJcbiAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgbG9naW5TdWNjZXNzKHJlc3BvbnNlLmRhdGEsIG9uU3VjY2Vzcyk7XHJcbiAgICAgICAgICB9LCByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIGxvZ2luRmFpbHVyZShyZXNwb25zZS5kYXRhLCBvbkZhaWx1cmUpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBhdXRoU2VydmljZS5sb2dpbldpdGhUb2tlbiA9IGZ1bmN0aW9uKHRva2VuLCBvblN1Y2Nlc3MsIG9uRmFpbHVyZSl7XHJcbiAgICAgICAgcmV0dXJuICRodHRwXHJcbiAgICAgICAgICAucG9zdCgnL2F1dGgvbG9naW4nLCB7XHJcbiAgICAgICAgICAgIHRva2VuOiB0b2tlblxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgbG9naW5TdWNjZXNzKHJlc3BvbnNlLmRhdGEsIG9uU3VjY2Vzcyk7XHJcbiAgICAgICAgICB9LCByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMCkge1xyXG4gICAgICAgICAgICAgIFNlc3Npb24uZGVzdHJveShsb2dpbkZhaWx1cmUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGF1dGhTZXJ2aWNlLmxvZ291dCA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgLy8gQ2xlYXIgdGhlIHNlc3Npb25cclxuICAgICAgICBTZXNzaW9uLmRlc3Ryb3koY2FsbGJhY2spO1xyXG4gICAgICAgICRzdGF0ZS5nbygnaG9tZScpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgYXV0aFNlcnZpY2UucmVnaXN0ZXIgPSBmdW5jdGlvbihlbWFpbCwgcGFzc3dvcmQsIG9uU3VjY2Vzcywgb25GYWlsdXJlICx2b2x1bnRlZXIpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHBcclxuICAgICAgICAgIC5wb3N0KCcvYXV0aC9yZWdpc3RlcicsIHtcclxuICAgICAgICAgICAgZW1haWw6IGVtYWlsLFxyXG4gICAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmQsXHJcbiAgICAgICAgICAgIHZvbHVudGVlcjogdm9sdW50ZWVyLFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgbG9naW5TdWNjZXNzKHJlc3BvbnNlLmRhdGEsIG9uU3VjY2Vzcywgdm9sdW50ZWVyKTtcclxuICAgICAgICAgIH0sIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgbG9naW5GYWlsdXJlKHJlc3BvbnNlLmRhdGEsIG9uRmFpbHVyZSwgdm9sdW50ZWVyKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgYXV0aFNlcnZpY2UudmVyaWZ5ID0gZnVuY3Rpb24odG9rZW4sIG9uU3VjY2Vzcywgb25GYWlsdXJlKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwXHJcbiAgICAgICAgICAuZ2V0KCcvYXV0aC92ZXJpZnkvJyArIHRva2VuKVxyXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBTZXNzaW9uLnNldFVzZXIocmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgICAgIGlmIChvblN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgICBvblN1Y2Nlc3MocmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgaWYgKG9uRmFpbHVyZSkge1xyXG4gICAgICAgICAgICAgIG9uRmFpbHVyZShyZXNwb25zZS5kYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBhdXRoU2VydmljZS5yZXNlbmRWZXJpZmljYXRpb25FbWFpbCA9IGZ1bmN0aW9uKG9uU3VjY2Vzcywgb25GYWlsdXJlKXtcclxuICAgICAgICByZXR1cm4gJGh0dHBcclxuICAgICAgICAgIC5wb3N0KCcvYXV0aC92ZXJpZnkvcmVzZW5kJywge1xyXG4gICAgICAgICAgICBpZDogU2Vzc2lvbi5nZXRVc2VySWQoKVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBhdXRoU2VydmljZS5zZW5kUmVzZXRFbWFpbCA9IGZ1bmN0aW9uKGVtYWlsKXtcclxuICAgICAgICByZXR1cm4gJGh0dHBcclxuICAgICAgICAgIC5wb3N0KCcvYXV0aC9yZXNldCcsIHtcclxuICAgICAgICAgICAgZW1haWw6IGVtYWlsXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGF1dGhTZXJ2aWNlLnJlc2V0UGFzc3dvcmQgPSBmdW5jdGlvbih0b2tlbiwgcGFzcywgb25TdWNjZXNzLCBvbkZhaWx1cmUpe1xyXG4gICAgICAgIHJldHVybiAkaHR0cFxyXG4gICAgICAgICAgLnBvc3QoJy9hdXRoL3Jlc2V0L3Bhc3N3b3JkJywge1xyXG4gICAgICAgICAgICB0b2tlbjogdG9rZW4sXHJcbiAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnRoZW4ob25TdWNjZXNzLCBvbkZhaWx1cmUpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgcmV0dXJuIGF1dGhTZXJ2aWNlO1xyXG4gICAgfVxyXG4gIF0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJykuZmFjdG9yeShcIkNoYWxsZW5nZVNlcnZpY2VcIiwgW1xyXG4gICAgXCIkaHR0cFwiLFxyXG4gICAgZnVuY3Rpb24oJGh0dHApIHtcclxuICAgICAgdmFyIGNoYWxsZW5nZXMgPSBcIi9hcGkvY2hhbGxlbmdlc1wiO1xyXG4gICAgICB2YXIgYmFzZSA9IGNoYWxsZW5nZXMgKyBcIi9cIjtcclxuICBcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgLy8gQmFzaWMgQWN0aW9uc1xyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgICAgY3JlYXRlOiBmdW5jdGlvbihjRGF0YSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChjaGFsbGVuZ2VzICsgXCIvY3JlYXRlXCIsIHtcclxuICAgICAgICAgICAgICBjRGF0YTogY0RhdGFcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgdXBkYXRlOiBmdW5jdGlvbihpZCwgY0RhdGEpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvdXBkYXRlXCIsIHtcclxuICAgICAgICAgICAgICBjRGF0YTogY0RhdGFcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbihpZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi9yZW1vdmVcIik7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbihpZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBpZCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBcclxuICAgICAgICBnZXRBbGw6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdldEFuc3dlcjogZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZSArIGlkICsgXCIvYW5zd2VyXCIpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gIFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIF0pO1xyXG4gICIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKS5mYWN0b3J5KFwiTWFya2V0aW5nU2VydmljZVwiLCBbXHJcbiAgICBcIiRodHRwXCIsXHJcbiAgICBmdW5jdGlvbigkaHR0cCkge1xyXG4gICAgICB2YXIgbWFya2V0aW5nID0gXCIvYXBpL21hcmtldGluZ1wiO1xyXG4gICAgICB2YXIgYmFzZSA9IG1hcmtldGluZyArIFwiL1wiO1xyXG4gIFxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAvLyBCYXNpYyBBY3Rpb25zXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgICBjcmVhdGVUZWFtOiBmdW5jdGlvbih0ZWFtRGF0YSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChtYXJrZXRpbmcgKyBcIi9jcmVhdGVUZWFtXCIsIHtcclxuICAgICAgICAgICAgICB0ZWFtRGF0YTogdGVhbURhdGFcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIFxyXG4gICAgICAgIGdldEFsbDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc2VuZEZyaWVuZEludml0ZTogZnVuY3Rpb24odXNlcm5hbWUsdGVhbW1hdGUpe1xyXG4gICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QobWFya2V0aW5nICsgXCIvc2VuZEludml0ZVwiLCB7XHJcbiAgICAgICAgICAgIHVzZXJuYW1lOiB1c2VybmFtZSxcclxuICAgICAgICAgICAgdGVhbW1hdGU6IHRlYW1tYXRlXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgXHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgXSk7XHJcbiAgIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpIFxyXG4gIC5mYWN0b3J5KCdTZXR0aW5nc1NlcnZpY2UnLCBbXHJcbiAgJyRodHRwJyxcclxuICBmdW5jdGlvbigkaHR0cCl7XHJcblxyXG4gICAgdmFyIGJhc2UgPSAnL2FwaS9zZXR0aW5ncy8nO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGdldFB1YmxpY1NldHRpbmdzOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIHVwZGF0ZVJlZ2lzdHJhdGlvblRpbWVzOiBmdW5jdGlvbihvcGVuLCBjbG9zZSl7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgJ3RpbWVzJywge1xyXG4gICAgICAgICAgdGltZU9wZW46IG9wZW4sXHJcbiAgICAgICAgICB0aW1lQ2xvc2U6IGNsb3NlLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG4gICAgICB1cGRhdGVDb25maXJtYXRpb25UaW1lOiBmdW5jdGlvbih0aW1lKXtcclxuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyAnY29uZmlybS1ieScsIHtcclxuICAgICAgICAgIHRpbWU6IHRpbWVcclxuICAgICAgICB9KTtcclxuICAgICAgfSxcclxuICAgICAgdXBkYXRlRXZlbnRUaW1lczogZnVuY3Rpb24oc3RhcnQsZW5kKXtcclxuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyAnZXZlbnR0aW1lcycsIHtcclxuICAgICAgICAgIHRpbWVTdGFydDogc3RhcnQsXHJcbiAgICAgICAgICB0aW1lRW5kOiBlbmQsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGdldFdoaXRlbGlzdGVkRW1haWxzOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZSArICd3aGl0ZWxpc3QnKTtcclxuICAgICAgfSxcclxuICAgICAgdXBkYXRlV2hpdGVsaXN0ZWRFbWFpbHM6IGZ1bmN0aW9uKGVtYWlscyl7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgJ3doaXRlbGlzdCcsIHtcclxuICAgICAgICAgIGVtYWlsczogZW1haWxzXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIHVwZGF0ZVdhaXRsaXN0VGV4dDogZnVuY3Rpb24odGV4dCl7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgJ3dhaXRsaXN0Jywge1xyXG4gICAgICAgICAgdGV4dDogdGV4dFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG4gICAgICB1cGRhdGVBY2NlcHRhbmNlVGV4dDogZnVuY3Rpb24odGV4dCl7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgJ2FjY2VwdGFuY2UnLCB7XHJcbiAgICAgICAgICB0ZXh0OiB0ZXh0XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICB1cGRhdGVIb3N0U2Nob29sOiBmdW5jdGlvbihob3N0U2Nob29sKXtcclxuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyAnaG9zdFNjaG9vbCcsIHtcclxuICAgICAgICAgIGhvc3RTY2hvb2w6IGhvc3RTY2hvb2xcclxuICAgICAgICB9KTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHVwZGF0ZUNvbmZpcm1hdGlvblRleHQ6IGZ1bmN0aW9uKHRleHQpe1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wdXQoYmFzZSArICdjb25maXJtYXRpb24nLCB7XHJcbiAgICAgICAgICB0ZXh0OiB0ZXh0XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIHVwZGF0ZUFsbG93TWlub3JzOiBmdW5jdGlvbihhbGxvd01pbm9ycyl7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgJ21pbm9ycycsIHsgXHJcbiAgICAgICAgICBhbGxvd01pbm9yczogYWxsb3dNaW5vcnMgXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICB9O1xyXG5cclxuICB9XHJcbiAgXSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKS5mYWN0b3J5KFwiU29sdmVkQ1RGU2VydmljZVwiLCBbXHJcbiAgICBcIiRodHRwXCIsXHJcbiAgICBmdW5jdGlvbigkaHR0cCkge1xyXG4gICAgICB2YXIgQ1RGID0gXCIvYXBpL0NURlwiO1xyXG4gICAgICB2YXIgYmFzZSA9IENURiArIFwiL1wiO1xyXG4gIFxyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgLy8gQmFzaWMgQWN0aW9uc1xyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgICAgc29sdmU6IGZ1bmN0aW9uKGNoYWxsZW5nZSwgdXNlciwgYW5zd2VyLCBvblN1Y2Nlc3MsIG9uRmFpbHVyZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChDVEYgKyBcIi9zb2x2ZVwiLCB7XHJcbiAgICAgICAgICAgICAgICBjaGFsbGVuZ2U6IGNoYWxsZW5nZSwgXHJcbiAgICAgICAgICAgICAgICB1c2VyIDogdXNlcixcclxuICAgICAgICAgICAgICAgIGFuc3dlciA6IGFuc3dlcixcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgIG9uU3VjY2VzcyhjaGFsbGVuZ2UpO1xyXG4gICAgICAgICAgICB9LCByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgb25GYWlsdXJlKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgXHJcbiAgICAgICAgZ2V0QWxsOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChDVEYpO1xyXG4gICAgICAgIH0sXHJcbiAgICBcclxuICAgICAgfTtcclxuICAgIH1cclxuICBdKTtcclxuICAiLCJhbmd1bGFyLm1vZHVsZSgncmVnJykuZmFjdG9yeShcIlRlYW1TZXJ2aWNlXCIsIFtcclxuICAgIFwiJGh0dHBcIixcclxuICAgIGZ1bmN0aW9uKCRodHRwKSB7XHJcbiAgICAgIHZhciB0ZWFtcyA9IFwiL2FwaS90ZWFtc1wiO1xyXG4gICAgICB2YXIgYmFzZSA9IHRlYW1zICsgXCIvXCI7XHJcbiAgXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgIC8vIEJhc2ljIEFjdGlvbnNcclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICAgIGNyZWF0ZTogZnVuY3Rpb24odGVhbURhdGEpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QodGVhbXMgKyBcIi9jcmVhdGVcIiwge1xyXG4gICAgICAgICAgICAgIHRlYW1EYXRhOiB0ZWFtRGF0YVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnZXRBbGw6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uKGlkLCBjRGF0YSkge1xyXG4gICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvdXBkYXRlXCIsIHtcclxuICAgICAgICAgICAgY0RhdGE6IGNEYXRhXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBqb2luOiBmdW5jdGlvbihpZCwgbmV3dXNlcikge1xyXG4gICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvam9pblRlYW1cIiwge1xyXG4gICAgICAgICAgICBuZXdqb2luUmVxdWVzdDogbmV3dXNlclxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgcmVtb3Zlam9pbjogZnVuY3Rpb24oaWQsIGluZGV4LCB1c2VyKSB7XHJcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBpZClcclxuICAgICAgICAgIC50aGVuKHRlYW0gPT4ge1xyXG4gICAgICAgICAgICB0ZWFtLmRhdGEuam9pblJlcXVlc3RzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIGlmICghKHVzZXI9PWZhbHNlKSl7XHJcbiAgICAgICAgICAgICAgJGh0dHAucG9zdCh0ZWFtcyArIFwiL3NlbmRSZWZ1c2VkVGVhbVwiLCB7XHJcbiAgICAgICAgICAgICAgICBpZDogdXNlci5pZCxcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi9yZW1vdmVKb2luVGVhbVwiLCB7XHJcbiAgICAgICAgICAgICAgbmV3am9pblJlcXVlc3RzOiB0ZWFtLmRhdGEuam9pblJlcXVlc3RzXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBhY2NlcHRNZW1iZXI6IGZ1bmN0aW9uKGlkLCBuZXd1c2VyLG1heFRlYW1TaXplKSB7XHJcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBpZClcclxuICAgICAgICAgIC50aGVuKHRlYW0gPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKHRlYW0uZGF0YS5tZW1iZXJzLmxlbmd0aD49bWF4VGVhbVNpemUpeyByZXR1cm4gJ21heFRlYW1TaXplJyB9XHJcbiAgICAgICAgICAgICRodHRwLnBvc3QodGVhbXMgKyBcIi9zZW5kQWNjZXB0ZWRUZWFtXCIsIHtcclxuICAgICAgICAgICAgICBpZDogbmV3dXNlci5pZCxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL2FkZE1lbWJlclwiLCB7XHJcbiAgICAgICAgICAgICAgbmV3TWVtYmVyOiBuZXd1c2VyLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgcmVtb3ZlbWVtYmVyOiBmdW5jdGlvbihpZCwgaW5kZXgsIHVzZXJJRCkge1xyXG4gICAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlICsgaWQpXHJcbiAgICAgICAgICAudGhlbih0ZWFtID0+IHtcclxuICAgICAgICAgICAgdmFyIHJlbW92ZWRVc2VyID0gdGVhbS5kYXRhLm1lbWJlcnNbaW5kZXhdXHJcbiAgICAgICAgICAgIGlmIChpbmRleD09MCl7cmV0dXJuIFwicmVtb3ZpbmdBZG1pblwifVxyXG4gICAgICAgICAgICB0ZWFtLmRhdGEubWVtYmVycy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICBpZiAoIXVzZXJJRCl7XHJcbiAgICAgICAgICAgICAgJGh0dHAucG9zdCh0ZWFtcyArIFwiL3NlbmRBZG1pblJlbW92ZWRUZWFtXCIsIHtcclxuICAgICAgICAgICAgICAgIGlkOiB0ZWFtLmRhdGEubWVtYmVyc1swXS5pZCxcclxuICAgICAgICAgICAgICAgIG1lbWJlcjogcmVtb3ZlZFVzZXIubmFtZVxyXG4gICAgICAgICAgICAgIH0pOyAgXHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICRodHRwLnBvc3QodGVhbXMgKyBcIi9zZW5kUmVtb3ZlZFRlYW1cIiwge1xyXG4gICAgICAgICAgICAgICAgaWQ6IHVzZXJJRCxcclxuICAgICAgICAgICAgICB9KTsgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL3JlbW92ZU1lbWJlclwiLCB7XHJcbiAgICAgICAgICAgICAgbmV3TWVtYmVyczogdGVhbS5kYXRhLm1lbWJlcnMsXHJcbiAgICAgICAgICAgICAgcmVtb3ZlZHVzZXJJRDogcmVtb3ZlZFVzZXIuaWRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uKGlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL3JlbW92ZVwiKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uKGlkKSB7XHJcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBpZCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBcclxuICAgICAgICB0b2dnbGVDbG9zZVRlYW06IGZ1bmN0aW9uKGlkLCBzdGF0dXMpIHtcclxuICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL3RvZ2dsZUNsb3NlVGVhbVwiLCB7XHJcbiAgICAgICAgICAgIHN0YXR1czogc3RhdHVzXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICB0b2dnbGVIaWRlVGVhbTogZnVuY3Rpb24oaWQsIHN0YXR1cykge1xyXG4gICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvdG9nZ2xlSGlkZVRlYW1cIiwge1xyXG4gICAgICAgICAgICBzdGF0dXM6IHN0YXR1c1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZ2V0U2VsZWN0ZWRUZWFtczogZnVuY3Rpb24odGV4dCxza2lsbHNGaWx0ZXJzKSB7XHJcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCB0ZWFtcyArIFwiP1wiICsgJC5wYXJhbSh7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiB0ZXh0LFxyXG4gICAgICAgICAgICAgICAgc2VhcmNoOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgc2tpbGxzRmlsdGVyczogc2tpbGxzRmlsdGVycyA/IHNraWxsc0ZpbHRlcnMgOiB7fVxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH0sIFxyXG4gIFxyXG5cclxuXHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgXSk7XHJcbiAgIiwiYW5ndWxhci5tb2R1bGUoXCJyZWdcIikuZmFjdG9yeShcIlVzZXJTZXJ2aWNlXCIsIFtcclxuICBcIiRodHRwXCIsXHJcbiAgXCJTZXNzaW9uXCIsXHJcbiAgZnVuY3Rpb24gKCRodHRwLCBTZXNzaW9uKSB7XHJcbiAgICB2YXIgdXNlcnMgPSBcIi9hcGkvdXNlcnNcIjtcclxuICAgIHZhciBiYXNlID0gdXNlcnMgKyBcIi9cIjtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgIC8vIEJhc2ljIEFjdGlvbnNcclxuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICBnZXRDdXJyZW50VXNlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZSArIFNlc3Npb24uZ2V0VXNlcklkKCkpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgZ2V0OiBmdW5jdGlvbiAoaWQpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBpZCk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZXRBbGw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgZ2V0UGFnZTogZnVuY3Rpb24gKHBhZ2UsIHNpemUsIHRleHQsIHN0YXR1c0ZpbHRlcnMsIE5vdHN0YXR1c0ZpbHRlcnMpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KHVzZXJzICsgXCI/XCIgKyAkLnBhcmFtKHtcclxuICAgICAgICAgIHRleHQ6IHRleHQsXHJcbiAgICAgICAgICBwYWdlOiBwYWdlID8gcGFnZSA6IDAsXHJcbiAgICAgICAgICBzaXplOiBzaXplID8gc2l6ZSA6IDIwLFxyXG4gICAgICAgICAgc3RhdHVzRmlsdGVyczogc3RhdHVzRmlsdGVycyA/IHN0YXR1c0ZpbHRlcnMgOiB7fSxcclxuICAgICAgICAgIE5vdHN0YXR1c0ZpbHRlcnM6IE5vdHN0YXR1c0ZpbHRlcnMgPyBOb3RzdGF0dXNGaWx0ZXJzIDoge31cclxuXHJcbiAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgdXBsb2FkQ1Y6IGZ1bmN0aW9uIChmaWxlcykge1xyXG4gICAgICAgIHZhciBmZCA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICAgIGZkLmFwcGVuZChcImN2XCIsIGZpbGVzWzBdLCBcImN2LnBkZlwiKTtcclxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnaHR0cHM6Ly9jc2UuY2x1Yi9hcGkvdXBsb2FkQ1YnLCBmZCwge1xyXG4gICAgICAgICAgdHJhbnNmb3JtUmVxdWVzdDogYW5ndWxhci5pZGVudGl0eSxcclxuICAgICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6IHVuZGVmaW5lZCB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICB1cGRhdGVQcm9maWxlOiBmdW5jdGlvbiAoaWQsIHByb2ZpbGUpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyBpZCArIFwiL3Byb2ZpbGVcIiwge1xyXG4gICAgICAgICAgcHJvZmlsZTogcHJvZmlsZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgdXBkYXRlQ29uZmlybWF0aW9uOiBmdW5jdGlvbiAoaWQsIGNvbmZpcm1hdGlvbikge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wdXQoYmFzZSArIGlkICsgXCIvY29uZmlybVwiLCB7XHJcbiAgICAgICAgICBjb25maXJtYXRpb246IGNvbmZpcm1hdGlvblxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgdXBkYXRlQWxsOiBmdW5jdGlvbiAoaWQsIHVzZXIpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyBpZCArIFwiL3VwZGF0ZWFsbFwiLCB7XHJcbiAgICAgICAgICB1c2VyOiB1c2VyXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBkZWNsaW5lQWRtaXNzaW9uOiBmdW5jdGlvbiAoaWQpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi9kZWNsaW5lXCIpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAvLyBBZG1pbiBPbmx5XHJcbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgIGdldFN0YXRzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlICsgXCJzdGF0c1wiKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGdldFRlYW1TdGF0czogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZSArIFwidGVhbVN0YXRzXCIpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgdXBkYXRlc3RhdHM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBcInVwZGF0ZXN0YXRzXCIpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgYWRtaXRVc2VyOiBmdW5jdGlvbiAoaWQpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi9hZG1pdFwiKTtcclxuICAgICAgfSxcclxuICAgICAgcmVqZWN0VXNlcjogZnVuY3Rpb24gKGlkKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvcmVqZWN0XCIpO1xyXG4gICAgICB9LFxyXG4gICAgICBzb2Z0QWRtaXR0VXNlcjogZnVuY3Rpb24gKGlkKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvc29mdEFkbWl0XCIpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgdXBkYXRlQ29uZmlybWF0aW9uVGltZTogZnVuY3Rpb24gKGlkKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvdXBkYXRlY29uZmlybWJ5XCIpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgc29mdFJlamVjdFVzZXI6IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL3NvZnRSZWplY3RcIik7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBzZW5kQmFzaWNNYWlsOiBmdW5jdGlvbiAoaWQsIGVtYWlsKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvc2VuZEJhc2ljTWFpbFwiLCBKU09OLnN0cmluZ2lmeShlbWFpbCkpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgY2hlY2tJbjogZnVuY3Rpb24gKGlkKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvY2hlY2tpblwiKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGNoZWNrT3V0OiBmdW5jdGlvbiAoaWQpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi9jaGVja291dFwiKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHJlbW92ZVVzZXI6IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL3JlbW92ZXVzZXJcIik7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICByZW1vdmV0ZWFtZmllbGQ6IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL3JlbW92ZXRlYW1maWVsZFwiKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIG1ha2VBZG1pbjogZnVuY3Rpb24gKGlkKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgXCIvbWFrZWFkbWluXCIpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgcmVtb3ZlQWRtaW46IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL3JlbW92ZWFkbWluXCIpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgbWFzc1JlamVjdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBcIm1hc3NSZWplY3RcIik7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZXRSZWplY3Rpb25Db3VudDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZSArIFwicmVqZWN0aW9uQ291bnRcIik7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZXRMYXRlclJlamVjdGVkQ291bnQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBcImxhdGVyUmVqZWN0Q291bnRcIik7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBtYXNzUmVqZWN0UmVzdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBcIm1hc3NSZWplY3RSZXN0XCIpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgZ2V0UmVzdFJlamVjdGlvbkNvdW50OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlICsgXCJyZWplY3Rpb25Db3VudFJlc3RcIik7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICByZWplY3Q6IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArIFwiL3JlamVjdFwiKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHNlbmRMYWdnZXJFbWFpbHM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgXCJzZW5kbGFnZW1haWxzXCIpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgc2VuZFJlamVjdEVtYWlsczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBcInNlbmRSZWplY3RFbWFpbHNcIik7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBzZW5kUmVqZWN0RW1haWxzUmVzdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBcInNlbmRSZWplY3RFbWFpbHNSZXN0XCIpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgc2VuZFJlamVjdEVtYWlsOiBmdW5jdGlvbiAoaWQpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyBcIi9yZWplY3RFbWFpbFwiKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHNlbmRQYXNzd29yZFJlc2V0RW1haWw6IGZ1bmN0aW9uIChlbWFpbCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBcInNlbmRSZXNldEVtYWlsXCIsIHsgZW1haWw6IGVtYWlsIH0pO1xyXG4gICAgICB9LFxyXG5cclxuXHJcblxyXG4gICAgfTtcclxuICB9XHJcbl0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcclxuICAuc2VydmljZSgnU2Vzc2lvbicsIFtcclxuICAgICckcm9vdFNjb3BlJyxcclxuICAgICckd2luZG93JyxcclxuICAgIGZ1bmN0aW9uKCRyb290U2NvcGUsICR3aW5kb3cpe1xyXG5cclxuICAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24odG9rZW4sIHVzZXIpe1xyXG4gICAgICAkd2luZG93LmxvY2FsU3RvcmFnZS5qd3QgPSB0b2tlbjtcclxuICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2UudXNlcklkID0gdXNlci5faWQ7XHJcbiAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLmN1cnJlbnRVc2VyID0gSlNPTi5zdHJpbmdpZnkodXNlcik7XHJcbiAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSB1c2VyO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmRlc3Ryb3kgPSBmdW5jdGlvbihvbkNvbXBsZXRlKXtcclxuICAgICAgZGVsZXRlICR3aW5kb3cubG9jYWxTdG9yYWdlLmp3dDtcclxuICAgICAgZGVsZXRlICR3aW5kb3cubG9jYWxTdG9yYWdlLnVzZXJJZDtcclxuICAgICAgZGVsZXRlICR3aW5kb3cubG9jYWxTdG9yYWdlLmN1cnJlbnRVc2VyO1xyXG4gICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gbnVsbDtcclxuICAgICAgaWYgKG9uQ29tcGxldGUpe1xyXG4gICAgICAgIG9uQ29tcGxldGUoKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmdldFRva2VuID0gZnVuY3Rpb24oKXtcclxuICAgICAgcmV0dXJuICR3aW5kb3cubG9jYWxTdG9yYWdlLmp3dDtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5nZXRVc2VySWQgPSBmdW5jdGlvbigpe1xyXG4gICAgICByZXR1cm4gJHdpbmRvdy5sb2NhbFN0b3JhZ2UudXNlcklkO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmdldFVzZXIgPSBmdW5jdGlvbigpe1xyXG4gICAgICByZXR1cm4gSlNPTi5wYXJzZSgkd2luZG93LmxvY2FsU3RvcmFnZS5jdXJyZW50VXNlcik7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuc2V0VXNlciA9IGZ1bmN0aW9uKHVzZXIpe1xyXG4gICAgICAkd2luZG93LmxvY2FsU3RvcmFnZS5jdXJyZW50VXNlciA9IEpTT04uc3RyaW5naWZ5KHVzZXIpO1xyXG4gICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gdXNlcjtcclxuICAgIH07XHJcblxyXG4gIH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcclxuICAuZmFjdG9yeSgnVXRpbHMnLCBbXHJcbiAgICBmdW5jdGlvbigpe1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGlzUmVnT3BlbjogZnVuY3Rpb24oc2V0dGluZ3Mpe1xyXG4gICAgICAgICAgcmV0dXJuIERhdGUubm93KCkgPiBzZXR0aW5ncy50aW1lT3BlbiAmJiBEYXRlLm5vdygpIDwgc2V0dGluZ3MudGltZUNsb3NlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaXNBZnRlcjogZnVuY3Rpb24odGltZSl7XHJcbiAgICAgICAgICByZXR1cm4gRGF0ZS5ub3coKSA+IHRpbWU7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmb3JtYXRUaW1lOiBmdW5jdGlvbih0aW1lKXtcclxuXHJcbiAgICAgICAgICBpZiAoIXRpbWUpe1xyXG4gICAgICAgICAgICByZXR1cm4gXCJJbnZhbGlkIERhdGVcIjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBkYXRlID0gbmV3IERhdGUodGltZSk7XHJcbiAgICAgICAgICAvLyBIYWNrIGZvciB0aW1lem9uZVxyXG4gICAgICAgICAgcmV0dXJuIG1vbWVudChkYXRlKS5sb2NhbGUoJ2VuJykuZm9ybWF0KCdkZGRkLCBNTU1NIERvIFlZWVksIGg6bW0gYScpICtcclxuICAgICAgICAgICAgXCIgXCIgKyBkYXRlLnRvVGltZVN0cmluZygpLnNwbGl0KCcgJylbMl07XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuICAgIH1dKTtcclxuIiwiKGZ1bmN0aW9uKCQpIHtcclxuICAgIGpRdWVyeS5mbi5leHRlbmQoe1xyXG4gICAgICAgIGh0bWw1X3FyY29kZTogZnVuY3Rpb24ocXJjb2RlU3VjY2VzcywgcXJjb2RlRXJyb3IsIHZpZGVvRXJyb3IpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50RWxlbSA9ICQodGhpcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGhlaWdodCA9IGN1cnJlbnRFbGVtLmhlaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHdpZHRoID0gY3VycmVudEVsZW0ud2lkdGgoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaGVpZ2h0ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQgPSAyNTA7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHdpZHRoID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aCA9IDMwMDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyB2YXIgdmlkRWxlbSA9ICQoJzx2aWRlbyB3aWR0aD1cIicgKyB3aWR0aCArICdweFwiIGhlaWdodD1cIicgKyBoZWlnaHQgKyAncHhcIj48L3ZpZGVvPicpLmFwcGVuZFRvKGN1cnJlbnRFbGVtKTtcclxuICAgICAgICAgICAgICAgIHZhciB2aWRFbGVtID0gJCgnPHZpZGVvIHdpZHRoPVwiJyArIHdpZHRoICsgJ3B4XCIgaGVpZ2h0PVwiJyArIGhlaWdodCArICdweFwiIGF1dG9wbGF5IHBsYXlzaW5saW5lPjwvdmlkZW8+JykuYXBwZW5kVG8oY3VycmVudEVsZW0pO1xyXG4gICAgICAgICAgICAgICAgdmFyIGNhbnZhc0VsZW0gPSAkKCc8Y2FudmFzIGlkPVwicXItY2FudmFzXCIgd2lkdGg9XCInICsgKHdpZHRoIC0gMikgKyAncHhcIiBoZWlnaHQ9XCInICsgKGhlaWdodCAtIDIpICsgJ3B4XCIgc3R5bGU9XCJkaXNwbGF5Om5vbmU7XCI+PC9jYW52YXM+JykuYXBwZW5kVG8oY3VycmVudEVsZW0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciB2aWRlbyA9IHZpZEVsZW1bMF07XHJcbiAgICAgICAgICAgICAgICB2YXIgY2FudmFzID0gY2FudmFzRWxlbVswXTtcclxuICAgICAgICAgICAgICAgIHZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgbG9jYWxNZWRpYVN0cmVhbTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgc2NhbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2NhbE1lZGlhU3RyZWFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQuZHJhd0ltYWdlKHZpZGVvLCAwLCAwLCAzMDcsIDI1MCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcXJjb2RlLmRlY29kZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBxcmNvZGVFcnJvcihlLCBsb2NhbE1lZGlhU3RyZWFtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJC5kYXRhKGN1cnJlbnRFbGVtWzBdLCBcInRpbWVvdXRcIiwgc2V0VGltZW91dChzY2FuLCA1MDApKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJC5kYXRhKGN1cnJlbnRFbGVtWzBdLCBcInRpbWVvdXRcIiwgc2V0VGltZW91dChzY2FuLCA1MDApKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9Oy8vZW5kIHNuYXBzaG90IGZ1bmN0aW9uXHJcblxyXG4gICAgICAgICAgICAgICAgd2luZG93LlVSTCA9IHdpbmRvdy5VUkwgfHwgd2luZG93LndlYmtpdFVSTCB8fCB3aW5kb3cubW96VVJMIHx8IHdpbmRvdy5tc1VSTDtcclxuICAgICAgICAgICAgICAgIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEgPSBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhIHx8IG5hdmlnYXRvci53ZWJraXRHZXRVc2VyTWVkaWEgfHwgbmF2aWdhdG9yLm1vekdldFVzZXJNZWRpYSB8fCBuYXZpZ2F0b3IubXNHZXRVc2VyTWVkaWE7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHN1Y2Nlc3NDYWxsYmFjayA9IGZ1bmN0aW9uKHN0cmVhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHZpZGVvLnNyYyA9ICh3aW5kb3cuVVJMICYmIHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKHN0cmVhbSkpIHx8IHN0cmVhbTtcclxuICAgICAgICAgICAgICAgICAgICB2aWRlby5zcmNPYmplY3QgPSBzdHJlYW07XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxNZWRpYVN0cmVhbSA9IHN0cmVhbTtcclxuICAgICAgICAgICAgICAgICAgICAkLmRhdGEoY3VycmVudEVsZW1bMF0sIFwic3RyZWFtXCIsIHN0cmVhbSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZpZGVvLnBsYXkoKTtcclxuICAgICAgICAgICAgICAgICAgICAkLmRhdGEoY3VycmVudEVsZW1bMF0sIFwidGltZW91dFwiLCBzZXRUaW1lb3V0KHNjYW4sIDEwMDApKTtcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ2FsbCB0aGUgZ2V0VXNlck1lZGlhIG1ldGhvZCB3aXRoIG91ciBjYWxsYmFjayBmdW5jdGlvbnNcclxuICAgICAgICAgICAgICAgIGlmIChuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmF2aWdhdG9yLmdldFVzZXJNZWRpYSh7dmlkZW86IHsgZmFjaW5nTW9kZTogXCJlbnZpcm9ubWVudFwiIH0gfSwgc3VjY2Vzc0NhbGxiYWNrLCBmdW5jdGlvbihlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWRlb0Vycm9yKGVycm9yLCBsb2NhbE1lZGlhU3RyZWFtKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ05hdGl2ZSB3ZWIgY2FtZXJhIHN0cmVhbWluZyAoZ2V0VXNlck1lZGlhKSBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3Nlci4nKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBEaXNwbGF5IGEgZnJpZW5kbHkgXCJzb3JyeVwiIG1lc3NhZ2UgdG8gdGhlIHVzZXJcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBxcmNvZGUuY2FsbGJhY2sgPSBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcXJjb2RlU3VjY2VzcyhyZXN1bHQsIGxvY2FsTWVkaWFTdHJlYW0pO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSk7IC8vIGVuZCBvZiBodG1sNV9xcmNvZGVcclxuICAgICAgICB9LFxyXG4gICAgICAgIGh0bWw1X3FyY29kZV9zdG9wOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIC8vc3RvcCB0aGUgc3RyZWFtIGFuZCBjYW5jZWwgdGltZW91dHNcclxuICAgICAgICAgICAgICAgICQodGhpcykuZGF0YSgnc3RyZWFtJykuZ2V0VmlkZW9UcmFja3MoKS5mb3JFYWNoKGZ1bmN0aW9uKHZpZGVvVHJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICB2aWRlb1RyYWNrLnN0b3AoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCgkKHRoaXMpLmRhdGEoJ3RpbWVvdXQnKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59KShqUXVlcnkpO1xyXG5cclxuIiwiZnVuY3Rpb24gRUNCKGNvdW50LGRhdGFDb2Rld29yZHMpe3RoaXMuY291bnQ9Y291bnQsdGhpcy5kYXRhQ29kZXdvcmRzPWRhdGFDb2Rld29yZHMsdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiQ291bnRcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmNvdW50fSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiRGF0YUNvZGV3b3Jkc1wiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZGF0YUNvZGV3b3Jkc30pfWZ1bmN0aW9uIEVDQmxvY2tzKGVjQ29kZXdvcmRzUGVyQmxvY2ssZWNCbG9ja3MxLGVjQmxvY2tzMil7dGhpcy5lY0NvZGV3b3Jkc1BlckJsb2NrPWVjQ29kZXdvcmRzUGVyQmxvY2ssZWNCbG9ja3MyP3RoaXMuZWNCbG9ja3M9bmV3IEFycmF5KGVjQmxvY2tzMSxlY0Jsb2NrczIpOnRoaXMuZWNCbG9ja3M9bmV3IEFycmF5KGVjQmxvY2tzMSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiRUNDb2Rld29yZHNQZXJCbG9ja1wiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZWNDb2Rld29yZHNQZXJCbG9ja30pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIlRvdGFsRUNDb2Rld29yZHNcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmVjQ29kZXdvcmRzUGVyQmxvY2sqdGhpcy5OdW1CbG9ja3N9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJOdW1CbG9ja3NcIixmdW5jdGlvbigpe2Zvcih2YXIgdG90YWw9MCxpPTA7aTx0aGlzLmVjQmxvY2tzLmxlbmd0aDtpKyspdG90YWwrPXRoaXMuZWNCbG9ja3NbaV0ubGVuZ3RoO3JldHVybiB0b3RhbH0pLHRoaXMuZ2V0RUNCbG9ja3M9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5lY0Jsb2Nrc319ZnVuY3Rpb24gVmVyc2lvbih2ZXJzaW9uTnVtYmVyLGFsaWdubWVudFBhdHRlcm5DZW50ZXJzLGVjQmxvY2tzMSxlY0Jsb2NrczIsZWNCbG9ja3MzLGVjQmxvY2tzNCl7dGhpcy52ZXJzaW9uTnVtYmVyPXZlcnNpb25OdW1iZXIsdGhpcy5hbGlnbm1lbnRQYXR0ZXJuQ2VudGVycz1hbGlnbm1lbnRQYXR0ZXJuQ2VudGVycyx0aGlzLmVjQmxvY2tzPW5ldyBBcnJheShlY0Jsb2NrczEsZWNCbG9ja3MyLGVjQmxvY2tzMyxlY0Jsb2NrczQpO2Zvcih2YXIgdG90YWw9MCxlY0NvZGV3b3Jkcz1lY0Jsb2NrczEuRUNDb2Rld29yZHNQZXJCbG9jayxlY2JBcnJheT1lY0Jsb2NrczEuZ2V0RUNCbG9ja3MoKSxpPTA7aTxlY2JBcnJheS5sZW5ndGg7aSsrKXt2YXIgZWNCbG9jaz1lY2JBcnJheVtpXTt0b3RhbCs9ZWNCbG9jay5Db3VudCooZWNCbG9jay5EYXRhQ29kZXdvcmRzK2VjQ29kZXdvcmRzKX10aGlzLnRvdGFsQ29kZXdvcmRzPXRvdGFsLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIlZlcnNpb25OdW1iZXJcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLnZlcnNpb25OdW1iZXJ9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJBbGlnbm1lbnRQYXR0ZXJuQ2VudGVyc1wiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYWxpZ25tZW50UGF0dGVybkNlbnRlcnN9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJUb3RhbENvZGV3b3Jkc1wiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudG90YWxDb2Rld29yZHN9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJEaW1lbnNpb25Gb3JWZXJzaW9uXCIsZnVuY3Rpb24oKXtyZXR1cm4gMTcrNCp0aGlzLnZlcnNpb25OdW1iZXJ9KSx0aGlzLmJ1aWxkRnVuY3Rpb25QYXR0ZXJuPWZ1bmN0aW9uKCl7dmFyIGRpbWVuc2lvbj10aGlzLkRpbWVuc2lvbkZvclZlcnNpb24sYml0TWF0cml4PW5ldyBCaXRNYXRyaXgoZGltZW5zaW9uKTtiaXRNYXRyaXguc2V0UmVnaW9uKDAsMCw5LDkpLGJpdE1hdHJpeC5zZXRSZWdpb24oZGltZW5zaW9uLTgsMCw4LDkpLGJpdE1hdHJpeC5zZXRSZWdpb24oMCxkaW1lbnNpb24tOCw5LDgpO2Zvcih2YXIgbWF4PXRoaXMuYWxpZ25tZW50UGF0dGVybkNlbnRlcnMubGVuZ3RoLHg9MDttYXg+eDt4KyspZm9yKHZhciBpPXRoaXMuYWxpZ25tZW50UGF0dGVybkNlbnRlcnNbeF0tMix5PTA7bWF4Pnk7eSsrKTA9PXgmJigwPT15fHx5PT1tYXgtMSl8fHg9PW1heC0xJiYwPT15fHxiaXRNYXRyaXguc2V0UmVnaW9uKHRoaXMuYWxpZ25tZW50UGF0dGVybkNlbnRlcnNbeV0tMixpLDUsNSk7cmV0dXJuIGJpdE1hdHJpeC5zZXRSZWdpb24oNiw5LDEsZGltZW5zaW9uLTE3KSxiaXRNYXRyaXguc2V0UmVnaW9uKDksNixkaW1lbnNpb24tMTcsMSksdGhpcy52ZXJzaW9uTnVtYmVyPjYmJihiaXRNYXRyaXguc2V0UmVnaW9uKGRpbWVuc2lvbi0xMSwwLDMsNiksYml0TWF0cml4LnNldFJlZ2lvbigwLGRpbWVuc2lvbi0xMSw2LDMpKSxiaXRNYXRyaXh9LHRoaXMuZ2V0RUNCbG9ja3NGb3JMZXZlbD1mdW5jdGlvbihlY0xldmVsKXtyZXR1cm4gdGhpcy5lY0Jsb2Nrc1tlY0xldmVsLm9yZGluYWwoKV19fWZ1bmN0aW9uIGJ1aWxkVmVyc2lvbnMoKXtyZXR1cm4gbmV3IEFycmF5KG5ldyBWZXJzaW9uKDEsbmV3IEFycmF5LG5ldyBFQ0Jsb2Nrcyg3LG5ldyBFQ0IoMSwxOSkpLG5ldyBFQ0Jsb2NrcygxMCxuZXcgRUNCKDEsMTYpKSxuZXcgRUNCbG9ja3MoMTMsbmV3IEVDQigxLDEzKSksbmV3IEVDQmxvY2tzKDE3LG5ldyBFQ0IoMSw5KSkpLG5ldyBWZXJzaW9uKDIsbmV3IEFycmF5KDYsMTgpLG5ldyBFQ0Jsb2NrcygxMCxuZXcgRUNCKDEsMzQpKSxuZXcgRUNCbG9ja3MoMTYsbmV3IEVDQigxLDI4KSksbmV3IEVDQmxvY2tzKDIyLG5ldyBFQ0IoMSwyMikpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDEsMTYpKSksbmV3IFZlcnNpb24oMyxuZXcgQXJyYXkoNiwyMiksbmV3IEVDQmxvY2tzKDE1LG5ldyBFQ0IoMSw1NSkpLG5ldyBFQ0Jsb2NrcygyNixuZXcgRUNCKDEsNDQpKSxuZXcgRUNCbG9ja3MoMTgsbmV3IEVDQigyLDE3KSksbmV3IEVDQmxvY2tzKDIyLG5ldyBFQ0IoMiwxMykpKSxuZXcgVmVyc2lvbig0LG5ldyBBcnJheSg2LDI2KSxuZXcgRUNCbG9ja3MoMjAsbmV3IEVDQigxLDgwKSksbmV3IEVDQmxvY2tzKDE4LG5ldyBFQ0IoMiwzMikpLG5ldyBFQ0Jsb2NrcygyNixuZXcgRUNCKDIsMjQpKSxuZXcgRUNCbG9ja3MoMTYsbmV3IEVDQig0LDkpKSksbmV3IFZlcnNpb24oNSxuZXcgQXJyYXkoNiwzMCksbmV3IEVDQmxvY2tzKDI2LG5ldyBFQ0IoMSwxMDgpKSxuZXcgRUNCbG9ja3MoMjQsbmV3IEVDQigyLDQzKSksbmV3IEVDQmxvY2tzKDE4LG5ldyBFQ0IoMiwxNSksbmV3IEVDQigyLDE2KSksbmV3IEVDQmxvY2tzKDIyLG5ldyBFQ0IoMiwxMSksbmV3IEVDQigyLDEyKSkpLG5ldyBWZXJzaW9uKDYsbmV3IEFycmF5KDYsMzQpLG5ldyBFQ0Jsb2NrcygxOCxuZXcgRUNCKDIsNjgpKSxuZXcgRUNCbG9ja3MoMTYsbmV3IEVDQig0LDI3KSksbmV3IEVDQmxvY2tzKDI0LG5ldyBFQ0IoNCwxOSkpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDQsMTUpKSksbmV3IFZlcnNpb24oNyxuZXcgQXJyYXkoNiwyMiwzOCksbmV3IEVDQmxvY2tzKDIwLG5ldyBFQ0IoMiw3OCkpLG5ldyBFQ0Jsb2NrcygxOCxuZXcgRUNCKDQsMzEpKSxuZXcgRUNCbG9ja3MoMTgsbmV3IEVDQigyLDE0KSxuZXcgRUNCKDQsMTUpKSxuZXcgRUNCbG9ja3MoMjYsbmV3IEVDQig0LDEzKSxuZXcgRUNCKDEsMTQpKSksbmV3IFZlcnNpb24oOCxuZXcgQXJyYXkoNiwyNCw0MiksbmV3IEVDQmxvY2tzKDI0LG5ldyBFQ0IoMiw5NykpLG5ldyBFQ0Jsb2NrcygyMixuZXcgRUNCKDIsMzgpLG5ldyBFQ0IoMiwzOSkpLG5ldyBFQ0Jsb2NrcygyMixuZXcgRUNCKDQsMTgpLG5ldyBFQ0IoMiwxOSkpLG5ldyBFQ0Jsb2NrcygyNixuZXcgRUNCKDQsMTQpLG5ldyBFQ0IoMiwxNSkpKSxuZXcgVmVyc2lvbig5LG5ldyBBcnJheSg2LDI2LDQ2KSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigyLDExNikpLG5ldyBFQ0Jsb2NrcygyMixuZXcgRUNCKDMsMzYpLG5ldyBFQ0IoMiwzNykpLG5ldyBFQ0Jsb2NrcygyMCxuZXcgRUNCKDQsMTYpLG5ldyBFQ0IoNCwxNykpLG5ldyBFQ0Jsb2NrcygyNCxuZXcgRUNCKDQsMTIpLG5ldyBFQ0IoNCwxMykpKSxuZXcgVmVyc2lvbigxMCxuZXcgQXJyYXkoNiwyOCw1MCksbmV3IEVDQmxvY2tzKDE4LG5ldyBFQ0IoMiw2OCksbmV3IEVDQigyLDY5KSksbmV3IEVDQmxvY2tzKDI2LG5ldyBFQ0IoNCw0MyksbmV3IEVDQigxLDQ0KSksbmV3IEVDQmxvY2tzKDI0LG5ldyBFQ0IoNiwxOSksbmV3IEVDQigyLDIwKSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoNiwxNSksbmV3IEVDQigyLDE2KSkpLG5ldyBWZXJzaW9uKDExLG5ldyBBcnJheSg2LDMwLDU0KSxuZXcgRUNCbG9ja3MoMjAsbmV3IEVDQig0LDgxKSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMSw1MCksbmV3IEVDQig0LDUxKSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoNCwyMiksbmV3IEVDQig0LDIzKSksbmV3IEVDQmxvY2tzKDI0LG5ldyBFQ0IoMywxMiksbmV3IEVDQig4LDEzKSkpLG5ldyBWZXJzaW9uKDEyLG5ldyBBcnJheSg2LDMyLDU4KSxuZXcgRUNCbG9ja3MoMjQsbmV3IEVDQigyLDkyKSxuZXcgRUNCKDIsOTMpKSxuZXcgRUNCbG9ja3MoMjIsbmV3IEVDQig2LDM2KSxuZXcgRUNCKDIsMzcpKSxuZXcgRUNCbG9ja3MoMjYsbmV3IEVDQig0LDIwKSxuZXcgRUNCKDYsMjEpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQig3LDE0KSxuZXcgRUNCKDQsMTUpKSksbmV3IFZlcnNpb24oMTMsbmV3IEFycmF5KDYsMzQsNjIpLG5ldyBFQ0Jsb2NrcygyNixuZXcgRUNCKDQsMTA3KSksbmV3IEVDQmxvY2tzKDIyLG5ldyBFQ0IoOCwzNyksbmV3IEVDQigxLDM4KSksbmV3IEVDQmxvY2tzKDI0LG5ldyBFQ0IoOCwyMCksbmV3IEVDQig0LDIxKSksbmV3IEVDQmxvY2tzKDIyLG5ldyBFQ0IoMTIsMTEpLG5ldyBFQ0IoNCwxMikpKSxuZXcgVmVyc2lvbigxNCxuZXcgQXJyYXkoNiwyNiw0Niw2NiksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMywxMTUpLG5ldyBFQ0IoMSwxMTYpKSxuZXcgRUNCbG9ja3MoMjQsbmV3IEVDQig0LDQwKSxuZXcgRUNCKDUsNDEpKSxuZXcgRUNCbG9ja3MoMjAsbmV3IEVDQigxMSwxNiksbmV3IEVDQig1LDE3KSksbmV3IEVDQmxvY2tzKDI0LG5ldyBFQ0IoMTEsMTIpLG5ldyBFQ0IoNSwxMykpKSxuZXcgVmVyc2lvbigxNSxuZXcgQXJyYXkoNiwyNiw0OCw3MCksbmV3IEVDQmxvY2tzKDIyLG5ldyBFQ0IoNSw4NyksbmV3IEVDQigxLDg4KSksbmV3IEVDQmxvY2tzKDI0LG5ldyBFQ0IoNSw0MSksbmV3IEVDQig1LDQyKSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNSwyNCksbmV3IEVDQig3LDI1KSksbmV3IEVDQmxvY2tzKDI0LG5ldyBFQ0IoMTEsMTIpLG5ldyBFQ0IoNywxMykpKSxuZXcgVmVyc2lvbigxNixuZXcgQXJyYXkoNiwyNiw1MCw3NCksbmV3IEVDQmxvY2tzKDI0LG5ldyBFQ0IoNSw5OCksbmV3IEVDQigxLDk5KSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoNyw0NSksbmV3IEVDQigzLDQ2KSksbmV3IEVDQmxvY2tzKDI0LG5ldyBFQ0IoMTUsMTkpLG5ldyBFQ0IoMiwyMCkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDMsMTUpLG5ldyBFQ0IoMTMsMTYpKSksbmV3IFZlcnNpb24oMTcsbmV3IEFycmF5KDYsMzAsNTQsNzgpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDEsMTA3KSxuZXcgRUNCKDUsMTA4KSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMTAsNDYpLG5ldyBFQ0IoMSw0NykpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDEsMjIpLG5ldyBFQ0IoMTUsMjMpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigyLDE0KSxuZXcgRUNCKDE3LDE1KSkpLG5ldyBWZXJzaW9uKDE4LG5ldyBBcnJheSg2LDMwLDU2LDgyKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQig1LDEyMCksbmV3IEVDQigxLDEyMSkpLG5ldyBFQ0Jsb2NrcygyNixuZXcgRUNCKDksNDMpLG5ldyBFQ0IoNCw0NCkpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDE3LDIyKSxuZXcgRUNCKDEsMjMpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigyLDE0KSxuZXcgRUNCKDE5LDE1KSkpLG5ldyBWZXJzaW9uKDE5LG5ldyBBcnJheSg2LDMwLDU4LDg2KSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigzLDExMyksbmV3IEVDQig0LDExNCkpLG5ldyBFQ0Jsb2NrcygyNixuZXcgRUNCKDMsNDQpLG5ldyBFQ0IoMTEsNDUpKSxuZXcgRUNCbG9ja3MoMjYsbmV3IEVDQigxNywyMSksbmV3IEVDQig0LDIyKSksbmV3IEVDQmxvY2tzKDI2LG5ldyBFQ0IoOSwxMyksbmV3IEVDQigxNiwxNCkpKSxuZXcgVmVyc2lvbigyMCxuZXcgQXJyYXkoNiwzNCw2Miw5MCksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMywxMDcpLG5ldyBFQ0IoNSwxMDgpKSxuZXcgRUNCbG9ja3MoMjYsbmV3IEVDQigzLDQxKSxuZXcgRUNCKDEzLDQyKSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTUsMjQpLG5ldyBFQ0IoNSwyNSkpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDE1LDE1KSxuZXcgRUNCKDEwLDE2KSkpLG5ldyBWZXJzaW9uKDIxLG5ldyBBcnJheSg2LDI4LDUwLDcyLDk0KSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQig0LDExNiksbmV3IEVDQig0LDExNykpLG5ldyBFQ0Jsb2NrcygyNixuZXcgRUNCKDE3LDQyKSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMTcsMjIpLG5ldyBFQ0IoNiwyMykpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDE5LDE2KSxuZXcgRUNCKDYsMTcpKSksbmV3IFZlcnNpb24oMjIsbmV3IEFycmF5KDYsMjYsNTAsNzQsOTgpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDIsMTExKSxuZXcgRUNCKDcsMTEyKSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMTcsNDYpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQig3LDI0KSxuZXcgRUNCKDE2LDI1KSksbmV3IEVDQmxvY2tzKDI0LG5ldyBFQ0IoMzQsMTMpKSksbmV3IFZlcnNpb24oMjMsbmV3IEFycmF5KDYsMzAsNTQsNzQsMTAyKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQig0LDEyMSksbmV3IEVDQig1LDEyMikpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDQsNDcpLG5ldyBFQ0IoMTQsNDgpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxMSwyNCksbmV3IEVDQigxNCwyNSkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDE2LDE1KSxuZXcgRUNCKDE0LDE2KSkpLG5ldyBWZXJzaW9uKDI0LG5ldyBBcnJheSg2LDI4LDU0LDgwLDEwNiksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNiwxMTcpLG5ldyBFQ0IoNCwxMTgpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQig2LDQ1KSxuZXcgRUNCKDE0LDQ2KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTEsMjQpLG5ldyBFQ0IoMTYsMjUpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigzMCwxNiksbmV3IEVDQigyLDE3KSkpLG5ldyBWZXJzaW9uKDI1LG5ldyBBcnJheSg2LDMyLDU4LDg0LDExMCksbmV3IEVDQmxvY2tzKDI2LG5ldyBFQ0IoOCwxMDYpLG5ldyBFQ0IoNCwxMDcpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQig4LDQ3KSxuZXcgRUNCKDEzLDQ4KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNywyNCksbmV3IEVDQigyMiwyNSkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDIyLDE1KSxuZXcgRUNCKDEzLDE2KSkpLG5ldyBWZXJzaW9uKDI2LG5ldyBBcnJheSg2LDMwLDU4LDg2LDExNCksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMTAsMTE0KSxuZXcgRUNCKDIsMTE1KSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMTksNDYpLG5ldyBFQ0IoNCw0NykpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDI4LDIyKSxuZXcgRUNCKDYsMjMpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigzMywxNiksbmV3IEVDQig0LDE3KSkpLG5ldyBWZXJzaW9uKDI3LG5ldyBBcnJheSg2LDM0LDYyLDkwLDExOCksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoOCwxMjIpLG5ldyBFQ0IoNCwxMjMpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigyMiw0NSksbmV3IEVDQigzLDQ2KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoOCwyMyksbmV3IEVDQigyNiwyNCkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDEyLDE1KSxuZXcgRUNCKDI4LDE2KSkpLG5ldyBWZXJzaW9uKDI4LG5ldyBBcnJheSg2LDI2LDUwLDc0LDk4LDEyMiksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMywxMTcpLG5ldyBFQ0IoMTAsMTE4KSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMyw0NSksbmV3IEVDQigyMyw0NikpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDQsMjQpLG5ldyBFQ0IoMzEsMjUpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxMSwxNSksbmV3IEVDQigzMSwxNikpKSxuZXcgVmVyc2lvbigyOSxuZXcgQXJyYXkoNiwzMCw1NCw3OCwxMDIsMTI2KSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQig3LDExNiksbmV3IEVDQig3LDExNykpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDIxLDQ1KSxuZXcgRUNCKDcsNDYpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxLDIzKSxuZXcgRUNCKDM3LDI0KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTksMTUpLG5ldyBFQ0IoMjYsMTYpKSksbmV3IFZlcnNpb24oMzAsbmV3IEFycmF5KDYsMjYsNTIsNzgsMTA0LDEzMCksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNSwxMTUpLG5ldyBFQ0IoMTAsMTE2KSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMTksNDcpLG5ldyBFQ0IoMTAsNDgpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxNSwyNCksbmV3IEVDQigyNSwyNSkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDIzLDE1KSxuZXcgRUNCKDI1LDE2KSkpLG5ldyBWZXJzaW9uKDMxLG5ldyBBcnJheSg2LDMwLDU2LDgyLDEwOCwxMzQpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDEzLDExNSksbmV3IEVDQigzLDExNikpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDIsNDYpLG5ldyBFQ0IoMjksNDcpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQig0MiwyNCksbmV3IEVDQigxLDI1KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMjMsMTUpLG5ldyBFQ0IoMjgsMTYpKSksbmV3IFZlcnNpb24oMzIsbmV3IEFycmF5KDYsMzQsNjAsODYsMTEyLDEzOCksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTcsMTE1KSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMTAsNDYpLG5ldyBFQ0IoMjMsNDcpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxMCwyNCksbmV3IEVDQigzNSwyNSkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDE5LDE1KSxuZXcgRUNCKDM1LDE2KSkpLG5ldyBWZXJzaW9uKDMzLG5ldyBBcnJheSg2LDMwLDU4LDg2LDExNCwxNDIpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDE3LDExNSksbmV3IEVDQigxLDExNikpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDE0LDQ2KSxuZXcgRUNCKDIxLDQ3KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMjksMjQpLG5ldyBFQ0IoMTksMjUpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxMSwxNSksbmV3IEVDQig0NiwxNikpKSxuZXcgVmVyc2lvbigzNCxuZXcgQXJyYXkoNiwzNCw2Miw5MCwxMTgsMTQ2KSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxMywxMTUpLG5ldyBFQ0IoNiwxMTYpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigxNCw0NiksbmV3IEVDQigyMyw0NykpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDQ0LDI0KSxuZXcgRUNCKDcsMjUpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQig1OSwxNiksbmV3IEVDQigxLDE3KSkpLG5ldyBWZXJzaW9uKDM1LG5ldyBBcnJheSg2LDMwLDU0LDc4LDEwMiwxMjYsMTUwKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxMiwxMjEpLG5ldyBFQ0IoNywxMjIpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQigxMiw0NyksbmV3IEVDQigyNiw0OCkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDM5LDI0KSxuZXcgRUNCKDE0LDI1KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMjIsMTUpLG5ldyBFQ0IoNDEsMTYpKSksbmV3IFZlcnNpb24oMzYsbmV3IEFycmF5KDYsMjQsNTAsNzYsMTAyLDEyOCwxNTQpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDYsMTIxKSxuZXcgRUNCKDE0LDEyMikpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDYsNDcpLG5ldyBFQ0IoMzQsNDgpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQig0NiwyNCksbmV3IEVDQigxMCwyNSkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDIsMTUpLG5ldyBFQ0IoNjQsMTYpKSksbmV3IFZlcnNpb24oMzcsbmV3IEFycmF5KDYsMjgsNTQsODAsMTA2LDEzMiwxNTgpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDE3LDEyMiksbmV3IEVDQig0LDEyMykpLG5ldyBFQ0Jsb2NrcygyOCxuZXcgRUNCKDI5LDQ2KSxuZXcgRUNCKDE0LDQ3KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNDksMjQpLG5ldyBFQ0IoMTAsMjUpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigyNCwxNSksbmV3IEVDQig0NiwxNikpKSxuZXcgVmVyc2lvbigzOCxuZXcgQXJyYXkoNiwzMiw1OCw4NCwxMTAsMTM2LDE2MiksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNCwxMjIpLG5ldyBFQ0IoMTgsMTIzKSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMTMsNDYpLG5ldyBFQ0IoMzIsNDcpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQig0OCwyNCksbmV3IEVDQigxNCwyNSkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDQyLDE1KSxuZXcgRUNCKDMyLDE2KSkpLG5ldyBWZXJzaW9uKDM5LG5ldyBBcnJheSg2LDI2LDU0LDgyLDExMCwxMzgsMTY2KSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigyMCwxMTcpLG5ldyBFQ0IoNCwxMTgpKSxuZXcgRUNCbG9ja3MoMjgsbmV3IEVDQig0MCw0NyksbmV3IEVDQig3LDQ4KSksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoNDMsMjQpLG5ldyBFQ0IoMjIsMjUpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigxMCwxNSksbmV3IEVDQig2NywxNikpKSxuZXcgVmVyc2lvbig0MCxuZXcgQXJyYXkoNiwzMCw1OCw4NiwxMTQsMTQyLDE3MCksbmV3IEVDQmxvY2tzKDMwLG5ldyBFQ0IoMTksMTE4KSxuZXcgRUNCKDYsMTE5KSksbmV3IEVDQmxvY2tzKDI4LG5ldyBFQ0IoMTgsNDcpLG5ldyBFQ0IoMzEsNDgpKSxuZXcgRUNCbG9ja3MoMzAsbmV3IEVDQigzNCwyNCksbmV3IEVDQigzNCwyNSkpLG5ldyBFQ0Jsb2NrcygzMCxuZXcgRUNCKDIwLDE1KSxuZXcgRUNCKDYxLDE2KSkpKX1mdW5jdGlvbiBQZXJzcGVjdGl2ZVRyYW5zZm9ybShhMTEsYTIxLGEzMSxhMTIsYTIyLGEzMixhMTMsYTIzLGEzMyl7dGhpcy5hMTE9YTExLHRoaXMuYTEyPWExMix0aGlzLmExMz1hMTMsdGhpcy5hMjE9YTIxLHRoaXMuYTIyPWEyMix0aGlzLmEyMz1hMjMsdGhpcy5hMzE9YTMxLHRoaXMuYTMyPWEzMix0aGlzLmEzMz1hMzMsdGhpcy50cmFuc2Zvcm1Qb2ludHMxPWZ1bmN0aW9uKHBvaW50cyl7Zm9yKHZhciBtYXg9cG9pbnRzLmxlbmd0aCxhMTE9dGhpcy5hMTEsYTEyPXRoaXMuYTEyLGExMz10aGlzLmExMyxhMjE9dGhpcy5hMjEsYTIyPXRoaXMuYTIyLGEyMz10aGlzLmEyMyxhMzE9dGhpcy5hMzEsYTMyPXRoaXMuYTMyLGEzMz10aGlzLmEzMyxpPTA7bWF4Pmk7aSs9Mil7dmFyIHg9cG9pbnRzW2ldLHk9cG9pbnRzW2krMV0sZGVub21pbmF0b3I9YTEzKngrYTIzKnkrYTMzO3BvaW50c1tpXT0oYTExKngrYTIxKnkrYTMxKS9kZW5vbWluYXRvcixwb2ludHNbaSsxXT0oYTEyKngrYTIyKnkrYTMyKS9kZW5vbWluYXRvcn19LHRoaXMudHJhbnNmb3JtUG9pbnRzMj1mdW5jdGlvbih4VmFsdWVzLHlWYWx1ZXMpe2Zvcih2YXIgbj14VmFsdWVzLmxlbmd0aCxpPTA7bj5pO2krKyl7dmFyIHg9eFZhbHVlc1tpXSx5PXlWYWx1ZXNbaV0sZGVub21pbmF0b3I9dGhpcy5hMTMqeCt0aGlzLmEyMyp5K3RoaXMuYTMzO3hWYWx1ZXNbaV09KHRoaXMuYTExKngrdGhpcy5hMjEqeSt0aGlzLmEzMSkvZGVub21pbmF0b3IseVZhbHVlc1tpXT0odGhpcy5hMTIqeCt0aGlzLmEyMip5K3RoaXMuYTMyKS9kZW5vbWluYXRvcn19LHRoaXMuYnVpbGRBZGpvaW50PWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBQZXJzcGVjdGl2ZVRyYW5zZm9ybSh0aGlzLmEyMip0aGlzLmEzMy10aGlzLmEyMyp0aGlzLmEzMix0aGlzLmEyMyp0aGlzLmEzMS10aGlzLmEyMSp0aGlzLmEzMyx0aGlzLmEyMSp0aGlzLmEzMi10aGlzLmEyMip0aGlzLmEzMSx0aGlzLmExMyp0aGlzLmEzMi10aGlzLmExMip0aGlzLmEzMyx0aGlzLmExMSp0aGlzLmEzMy10aGlzLmExMyp0aGlzLmEzMSx0aGlzLmExMip0aGlzLmEzMS10aGlzLmExMSp0aGlzLmEzMix0aGlzLmExMip0aGlzLmEyMy10aGlzLmExMyp0aGlzLmEyMix0aGlzLmExMyp0aGlzLmEyMS10aGlzLmExMSp0aGlzLmEyMyx0aGlzLmExMSp0aGlzLmEyMi10aGlzLmExMip0aGlzLmEyMSl9LHRoaXMudGltZXM9ZnVuY3Rpb24ob3RoZXIpe3JldHVybiBuZXcgUGVyc3BlY3RpdmVUcmFuc2Zvcm0odGhpcy5hMTEqb3RoZXIuYTExK3RoaXMuYTIxKm90aGVyLmExMit0aGlzLmEzMSpvdGhlci5hMTMsdGhpcy5hMTEqb3RoZXIuYTIxK3RoaXMuYTIxKm90aGVyLmEyMit0aGlzLmEzMSpvdGhlci5hMjMsdGhpcy5hMTEqb3RoZXIuYTMxK3RoaXMuYTIxKm90aGVyLmEzMit0aGlzLmEzMSpvdGhlci5hMzMsdGhpcy5hMTIqb3RoZXIuYTExK3RoaXMuYTIyKm90aGVyLmExMit0aGlzLmEzMipvdGhlci5hMTMsdGhpcy5hMTIqb3RoZXIuYTIxK3RoaXMuYTIyKm90aGVyLmEyMit0aGlzLmEzMipvdGhlci5hMjMsdGhpcy5hMTIqb3RoZXIuYTMxK3RoaXMuYTIyKm90aGVyLmEzMit0aGlzLmEzMipvdGhlci5hMzMsdGhpcy5hMTMqb3RoZXIuYTExK3RoaXMuYTIzKm90aGVyLmExMit0aGlzLmEzMypvdGhlci5hMTMsdGhpcy5hMTMqb3RoZXIuYTIxK3RoaXMuYTIzKm90aGVyLmEyMit0aGlzLmEzMypvdGhlci5hMjMsdGhpcy5hMTMqb3RoZXIuYTMxK3RoaXMuYTIzKm90aGVyLmEzMit0aGlzLmEzMypvdGhlci5hMzMpfX1mdW5jdGlvbiBEZXRlY3RvclJlc3VsdChiaXRzLHBvaW50cyl7dGhpcy5iaXRzPWJpdHMsdGhpcy5wb2ludHM9cG9pbnRzfWZ1bmN0aW9uIERldGVjdG9yKGltYWdlKXt0aGlzLmltYWdlPWltYWdlLHRoaXMucmVzdWx0UG9pbnRDYWxsYmFjaz1udWxsLHRoaXMuc2l6ZU9mQmxhY2tXaGl0ZUJsYWNrUnVuPWZ1bmN0aW9uKGZyb21YLGZyb21ZLHRvWCx0b1kpe3ZhciBzdGVlcD1NYXRoLmFicyh0b1ktZnJvbVkpPk1hdGguYWJzKHRvWC1mcm9tWCk7aWYoc3RlZXApe3ZhciB0ZW1wPWZyb21YO2Zyb21YPWZyb21ZLGZyb21ZPXRlbXAsdGVtcD10b1gsdG9YPXRvWSx0b1k9dGVtcH1mb3IodmFyIGR4PU1hdGguYWJzKHRvWC1mcm9tWCksZHk9TWF0aC5hYnModG9ZLWZyb21ZKSxlcnJvcj0tZHg+PjEseXN0ZXA9dG9ZPmZyb21ZPzE6LTEseHN0ZXA9dG9YPmZyb21YPzE6LTEsc3RhdGU9MCx4PWZyb21YLHk9ZnJvbVk7eCE9dG9YO3grPXhzdGVwKXt2YXIgcmVhbFg9c3RlZXA/eTp4LHJlYWxZPXN0ZWVwP3g6eTtpZigxPT1zdGF0ZT90aGlzLmltYWdlW3JlYWxYK3JlYWxZKnFyY29kZS53aWR0aF0mJnN0YXRlKys6dGhpcy5pbWFnZVtyZWFsWCtyZWFsWSpxcmNvZGUud2lkdGhdfHxzdGF0ZSsrLDM9PXN0YXRlKXt2YXIgZGlmZlg9eC1mcm9tWCxkaWZmWT15LWZyb21ZO3JldHVybiBNYXRoLnNxcnQoZGlmZlgqZGlmZlgrZGlmZlkqZGlmZlkpfWlmKGVycm9yKz1keSxlcnJvcj4wKXtpZih5PT10b1kpYnJlYWs7eSs9eXN0ZXAsZXJyb3ItPWR4fX12YXIgZGlmZlgyPXRvWC1mcm9tWCxkaWZmWTI9dG9ZLWZyb21ZO3JldHVybiBNYXRoLnNxcnQoZGlmZlgyKmRpZmZYMitkaWZmWTIqZGlmZlkyKX0sdGhpcy5zaXplT2ZCbGFja1doaXRlQmxhY2tSdW5Cb3RoV2F5cz1mdW5jdGlvbihmcm9tWCxmcm9tWSx0b1gsdG9ZKXt2YXIgcmVzdWx0PXRoaXMuc2l6ZU9mQmxhY2tXaGl0ZUJsYWNrUnVuKGZyb21YLGZyb21ZLHRvWCx0b1kpLHNjYWxlPTEsb3RoZXJUb1g9ZnJvbVgtKHRvWC1mcm9tWCk7MD5vdGhlclRvWD8oc2NhbGU9ZnJvbVgvKGZyb21YLW90aGVyVG9YKSxvdGhlclRvWD0wKTpvdGhlclRvWD49cXJjb2RlLndpZHRoJiYoc2NhbGU9KHFyY29kZS53aWR0aC0xLWZyb21YKS8ob3RoZXJUb1gtZnJvbVgpLG90aGVyVG9YPXFyY29kZS53aWR0aC0xKTt2YXIgb3RoZXJUb1k9TWF0aC5mbG9vcihmcm9tWS0odG9ZLWZyb21ZKSpzY2FsZSk7cmV0dXJuIHNjYWxlPTEsMD5vdGhlclRvWT8oc2NhbGU9ZnJvbVkvKGZyb21ZLW90aGVyVG9ZKSxvdGhlclRvWT0wKTpvdGhlclRvWT49cXJjb2RlLmhlaWdodCYmKHNjYWxlPShxcmNvZGUuaGVpZ2h0LTEtZnJvbVkpLyhvdGhlclRvWS1mcm9tWSksb3RoZXJUb1k9cXJjb2RlLmhlaWdodC0xKSxvdGhlclRvWD1NYXRoLmZsb29yKGZyb21YKyhvdGhlclRvWC1mcm9tWCkqc2NhbGUpLHJlc3VsdCs9dGhpcy5zaXplT2ZCbGFja1doaXRlQmxhY2tSdW4oZnJvbVgsZnJvbVksb3RoZXJUb1gsb3RoZXJUb1kpLHJlc3VsdC0xfSx0aGlzLmNhbGN1bGF0ZU1vZHVsZVNpemVPbmVXYXk9ZnVuY3Rpb24ocGF0dGVybixvdGhlclBhdHRlcm4pe3ZhciBtb2R1bGVTaXplRXN0MT10aGlzLnNpemVPZkJsYWNrV2hpdGVCbGFja1J1bkJvdGhXYXlzKE1hdGguZmxvb3IocGF0dGVybi5YKSxNYXRoLmZsb29yKHBhdHRlcm4uWSksTWF0aC5mbG9vcihvdGhlclBhdHRlcm4uWCksTWF0aC5mbG9vcihvdGhlclBhdHRlcm4uWSkpLG1vZHVsZVNpemVFc3QyPXRoaXMuc2l6ZU9mQmxhY2tXaGl0ZUJsYWNrUnVuQm90aFdheXMoTWF0aC5mbG9vcihvdGhlclBhdHRlcm4uWCksTWF0aC5mbG9vcihvdGhlclBhdHRlcm4uWSksTWF0aC5mbG9vcihwYXR0ZXJuLlgpLE1hdGguZmxvb3IocGF0dGVybi5ZKSk7cmV0dXJuIGlzTmFOKG1vZHVsZVNpemVFc3QxKT9tb2R1bGVTaXplRXN0Mi83OmlzTmFOKG1vZHVsZVNpemVFc3QyKT9tb2R1bGVTaXplRXN0MS83Oihtb2R1bGVTaXplRXN0MSttb2R1bGVTaXplRXN0MikvMTR9LHRoaXMuY2FsY3VsYXRlTW9kdWxlU2l6ZT1mdW5jdGlvbih0b3BMZWZ0LHRvcFJpZ2h0LGJvdHRvbUxlZnQpe3JldHVybih0aGlzLmNhbGN1bGF0ZU1vZHVsZVNpemVPbmVXYXkodG9wTGVmdCx0b3BSaWdodCkrdGhpcy5jYWxjdWxhdGVNb2R1bGVTaXplT25lV2F5KHRvcExlZnQsYm90dG9tTGVmdCkpLzJ9LHRoaXMuZGlzdGFuY2U9ZnVuY3Rpb24ocGF0dGVybjEscGF0dGVybjIpe3JldHVybiB4RGlmZj1wYXR0ZXJuMS5YLXBhdHRlcm4yLlgseURpZmY9cGF0dGVybjEuWS1wYXR0ZXJuMi5ZLE1hdGguc3FydCh4RGlmZip4RGlmZit5RGlmZip5RGlmZil9LHRoaXMuY29tcHV0ZURpbWVuc2lvbj1mdW5jdGlvbih0b3BMZWZ0LHRvcFJpZ2h0LGJvdHRvbUxlZnQsbW9kdWxlU2l6ZSl7dmFyIHRsdHJDZW50ZXJzRGltZW5zaW9uPU1hdGgucm91bmQodGhpcy5kaXN0YW5jZSh0b3BMZWZ0LHRvcFJpZ2h0KS9tb2R1bGVTaXplKSx0bGJsQ2VudGVyc0RpbWVuc2lvbj1NYXRoLnJvdW5kKHRoaXMuZGlzdGFuY2UodG9wTGVmdCxib3R0b21MZWZ0KS9tb2R1bGVTaXplKSxkaW1lbnNpb249KHRsdHJDZW50ZXJzRGltZW5zaW9uK3RsYmxDZW50ZXJzRGltZW5zaW9uPj4xKSs3O3N3aXRjaCgzJmRpbWVuc2lvbil7Y2FzZSAwOmRpbWVuc2lvbisrO2JyZWFrO2Nhc2UgMjpkaW1lbnNpb24tLTticmVhaztjYXNlIDM6dGhyb3dcIkVycm9yXCJ9cmV0dXJuIGRpbWVuc2lvbn0sdGhpcy5maW5kQWxpZ25tZW50SW5SZWdpb249ZnVuY3Rpb24ob3ZlcmFsbEVzdE1vZHVsZVNpemUsZXN0QWxpZ25tZW50WCxlc3RBbGlnbm1lbnRZLGFsbG93YW5jZUZhY3Rvcil7dmFyIGFsbG93YW5jZT1NYXRoLmZsb29yKGFsbG93YW5jZUZhY3RvcipvdmVyYWxsRXN0TW9kdWxlU2l6ZSksYWxpZ25tZW50QXJlYUxlZnRYPU1hdGgubWF4KDAsZXN0QWxpZ25tZW50WC1hbGxvd2FuY2UpLGFsaWdubWVudEFyZWFSaWdodFg9TWF0aC5taW4ocXJjb2RlLndpZHRoLTEsZXN0QWxpZ25tZW50WCthbGxvd2FuY2UpO2lmKDMqb3ZlcmFsbEVzdE1vZHVsZVNpemU+YWxpZ25tZW50QXJlYVJpZ2h0WC1hbGlnbm1lbnRBcmVhTGVmdFgpdGhyb3dcIkVycm9yXCI7dmFyIGFsaWdubWVudEFyZWFUb3BZPU1hdGgubWF4KDAsZXN0QWxpZ25tZW50WS1hbGxvd2FuY2UpLGFsaWdubWVudEFyZWFCb3R0b21ZPU1hdGgubWluKHFyY29kZS5oZWlnaHQtMSxlc3RBbGlnbm1lbnRZK2FsbG93YW5jZSksYWxpZ25tZW50RmluZGVyPW5ldyBBbGlnbm1lbnRQYXR0ZXJuRmluZGVyKHRoaXMuaW1hZ2UsYWxpZ25tZW50QXJlYUxlZnRYLGFsaWdubWVudEFyZWFUb3BZLGFsaWdubWVudEFyZWFSaWdodFgtYWxpZ25tZW50QXJlYUxlZnRYLGFsaWdubWVudEFyZWFCb3R0b21ZLWFsaWdubWVudEFyZWFUb3BZLG92ZXJhbGxFc3RNb2R1bGVTaXplLHRoaXMucmVzdWx0UG9pbnRDYWxsYmFjayk7cmV0dXJuIGFsaWdubWVudEZpbmRlci5maW5kKCl9LHRoaXMuY3JlYXRlVHJhbnNmb3JtPWZ1bmN0aW9uKHRvcExlZnQsdG9wUmlnaHQsYm90dG9tTGVmdCxhbGlnbm1lbnRQYXR0ZXJuLGRpbWVuc2lvbil7dmFyIGJvdHRvbVJpZ2h0WCxib3R0b21SaWdodFksc291cmNlQm90dG9tUmlnaHRYLHNvdXJjZUJvdHRvbVJpZ2h0WSxkaW1NaW51c1RocmVlPWRpbWVuc2lvbi0zLjU7bnVsbCE9YWxpZ25tZW50UGF0dGVybj8oYm90dG9tUmlnaHRYPWFsaWdubWVudFBhdHRlcm4uWCxib3R0b21SaWdodFk9YWxpZ25tZW50UGF0dGVybi5ZLHNvdXJjZUJvdHRvbVJpZ2h0WD1zb3VyY2VCb3R0b21SaWdodFk9ZGltTWludXNUaHJlZS0zKTooYm90dG9tUmlnaHRYPXRvcFJpZ2h0LlgtdG9wTGVmdC5YK2JvdHRvbUxlZnQuWCxib3R0b21SaWdodFk9dG9wUmlnaHQuWS10b3BMZWZ0LlkrYm90dG9tTGVmdC5ZLHNvdXJjZUJvdHRvbVJpZ2h0WD1zb3VyY2VCb3R0b21SaWdodFk9ZGltTWludXNUaHJlZSk7dmFyIHRyYW5zZm9ybT1QZXJzcGVjdGl2ZVRyYW5zZm9ybS5xdWFkcmlsYXRlcmFsVG9RdWFkcmlsYXRlcmFsKDMuNSwzLjUsZGltTWludXNUaHJlZSwzLjUsc291cmNlQm90dG9tUmlnaHRYLHNvdXJjZUJvdHRvbVJpZ2h0WSwzLjUsZGltTWludXNUaHJlZSx0b3BMZWZ0LlgsdG9wTGVmdC5ZLHRvcFJpZ2h0LlgsdG9wUmlnaHQuWSxib3R0b21SaWdodFgsYm90dG9tUmlnaHRZLGJvdHRvbUxlZnQuWCxib3R0b21MZWZ0LlkpO3JldHVybiB0cmFuc2Zvcm19LHRoaXMuc2FtcGxlR3JpZD1mdW5jdGlvbihpbWFnZSx0cmFuc2Zvcm0sZGltZW5zaW9uKXt2YXIgc2FtcGxlcj1HcmlkU2FtcGxlcjtyZXR1cm4gc2FtcGxlci5zYW1wbGVHcmlkMyhpbWFnZSxkaW1lbnNpb24sdHJhbnNmb3JtKX0sdGhpcy5wcm9jZXNzRmluZGVyUGF0dGVybkluZm89ZnVuY3Rpb24oaW5mbyl7dmFyIHRvcExlZnQ9aW5mby5Ub3BMZWZ0LHRvcFJpZ2h0PWluZm8uVG9wUmlnaHQsYm90dG9tTGVmdD1pbmZvLkJvdHRvbUxlZnQsbW9kdWxlU2l6ZT10aGlzLmNhbGN1bGF0ZU1vZHVsZVNpemUodG9wTGVmdCx0b3BSaWdodCxib3R0b21MZWZ0KTtpZigxPm1vZHVsZVNpemUpdGhyb3dcIkVycm9yXCI7dmFyIGRpbWVuc2lvbj10aGlzLmNvbXB1dGVEaW1lbnNpb24odG9wTGVmdCx0b3BSaWdodCxib3R0b21MZWZ0LG1vZHVsZVNpemUpLHByb3Zpc2lvbmFsVmVyc2lvbj1WZXJzaW9uLmdldFByb3Zpc2lvbmFsVmVyc2lvbkZvckRpbWVuc2lvbihkaW1lbnNpb24pLG1vZHVsZXNCZXR3ZWVuRlBDZW50ZXJzPXByb3Zpc2lvbmFsVmVyc2lvbi5EaW1lbnNpb25Gb3JWZXJzaW9uLTcsYWxpZ25tZW50UGF0dGVybj1udWxsO2lmKHByb3Zpc2lvbmFsVmVyc2lvbi5BbGlnbm1lbnRQYXR0ZXJuQ2VudGVycy5sZW5ndGg+MClmb3IodmFyIGJvdHRvbVJpZ2h0WD10b3BSaWdodC5YLXRvcExlZnQuWCtib3R0b21MZWZ0LlgsYm90dG9tUmlnaHRZPXRvcFJpZ2h0LlktdG9wTGVmdC5ZK2JvdHRvbUxlZnQuWSxjb3JyZWN0aW9uVG9Ub3BMZWZ0PTEtMy9tb2R1bGVzQmV0d2VlbkZQQ2VudGVycyxlc3RBbGlnbm1lbnRYPU1hdGguZmxvb3IodG9wTGVmdC5YK2NvcnJlY3Rpb25Ub1RvcExlZnQqKGJvdHRvbVJpZ2h0WC10b3BMZWZ0LlgpKSxlc3RBbGlnbm1lbnRZPU1hdGguZmxvb3IodG9wTGVmdC5ZK2NvcnJlY3Rpb25Ub1RvcExlZnQqKGJvdHRvbVJpZ2h0WS10b3BMZWZ0LlkpKSxpPTQ7MTY+PWk7aTw8PTEpe2FsaWdubWVudFBhdHRlcm49dGhpcy5maW5kQWxpZ25tZW50SW5SZWdpb24obW9kdWxlU2l6ZSxlc3RBbGlnbm1lbnRYLGVzdEFsaWdubWVudFksaSk7YnJlYWt9dmFyIHBvaW50cyx0cmFuc2Zvcm09dGhpcy5jcmVhdGVUcmFuc2Zvcm0odG9wTGVmdCx0b3BSaWdodCxib3R0b21MZWZ0LGFsaWdubWVudFBhdHRlcm4sZGltZW5zaW9uKSxiaXRzPXRoaXMuc2FtcGxlR3JpZCh0aGlzLmltYWdlLHRyYW5zZm9ybSxkaW1lbnNpb24pO3JldHVybiBwb2ludHM9bnVsbD09YWxpZ25tZW50UGF0dGVybj9uZXcgQXJyYXkoYm90dG9tTGVmdCx0b3BMZWZ0LHRvcFJpZ2h0KTpuZXcgQXJyYXkoYm90dG9tTGVmdCx0b3BMZWZ0LHRvcFJpZ2h0LGFsaWdubWVudFBhdHRlcm4pLG5ldyBEZXRlY3RvclJlc3VsdChiaXRzLHBvaW50cyl9LHRoaXMuZGV0ZWN0PWZ1bmN0aW9uKCl7dmFyIGluZm89KG5ldyBGaW5kZXJQYXR0ZXJuRmluZGVyKS5maW5kRmluZGVyUGF0dGVybih0aGlzLmltYWdlKTtyZXR1cm4gdGhpcy5wcm9jZXNzRmluZGVyUGF0dGVybkluZm8oaW5mbyl9fWZ1bmN0aW9uIEZvcm1hdEluZm9ybWF0aW9uKGZvcm1hdEluZm8pe3RoaXMuZXJyb3JDb3JyZWN0aW9uTGV2ZWw9RXJyb3JDb3JyZWN0aW9uTGV2ZWwuZm9yQml0cyhmb3JtYXRJbmZvPj4zJjMpLHRoaXMuZGF0YU1hc2s9NyZmb3JtYXRJbmZvLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkVycm9yQ29ycmVjdGlvbkxldmVsXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5lcnJvckNvcnJlY3Rpb25MZXZlbH0pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkRhdGFNYXNrXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5kYXRhTWFza30pLHRoaXMuR2V0SGFzaENvZGU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5lcnJvckNvcnJlY3Rpb25MZXZlbC5vcmRpbmFsKCk8PDN8ZGF0YU1hc2t9LHRoaXMuRXF1YWxzPWZ1bmN0aW9uKG8pe3ZhciBvdGhlcj1vO3JldHVybiB0aGlzLmVycm9yQ29ycmVjdGlvbkxldmVsPT1vdGhlci5lcnJvckNvcnJlY3Rpb25MZXZlbCYmdGhpcy5kYXRhTWFzaz09b3RoZXIuZGF0YU1hc2t9fWZ1bmN0aW9uIEVycm9yQ29ycmVjdGlvbkxldmVsKG9yZGluYWwsYml0cyxuYW1lKXt0aGlzLm9yZGluYWxfUmVuYW1lZF9GaWVsZD1vcmRpbmFsLHRoaXMuYml0cz1iaXRzLHRoaXMubmFtZT1uYW1lLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkJpdHNcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmJpdHN9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJOYW1lXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5uYW1lfSksdGhpcy5vcmRpbmFsPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMub3JkaW5hbF9SZW5hbWVkX0ZpZWxkfX1mdW5jdGlvbiBCaXRNYXRyaXgod2lkdGgsaGVpZ2h0KXtpZihoZWlnaHR8fChoZWlnaHQ9d2lkdGgpLDE+d2lkdGh8fDE+aGVpZ2h0KXRocm93XCJCb3RoIGRpbWVuc2lvbnMgbXVzdCBiZSBncmVhdGVyIHRoYW4gMFwiO3RoaXMud2lkdGg9d2lkdGgsdGhpcy5oZWlnaHQ9aGVpZ2h0O3ZhciByb3dTaXplPXdpZHRoPj41OzAhPSgzMSZ3aWR0aCkmJnJvd1NpemUrKyx0aGlzLnJvd1NpemU9cm93U2l6ZSx0aGlzLmJpdHM9bmV3IEFycmF5KHJvd1NpemUqaGVpZ2h0KTtmb3IodmFyIGk9MDtpPHRoaXMuYml0cy5sZW5ndGg7aSsrKXRoaXMuYml0c1tpXT0wO3RoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIldpZHRoXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy53aWR0aH0pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkhlaWdodFwiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuaGVpZ2h0fSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiRGltZW5zaW9uXCIsZnVuY3Rpb24oKXtpZih0aGlzLndpZHRoIT10aGlzLmhlaWdodCl0aHJvd1wiQ2FuJ3QgY2FsbCBnZXREaW1lbnNpb24oKSBvbiBhIG5vbi1zcXVhcmUgbWF0cml4XCI7cmV0dXJuIHRoaXMud2lkdGh9KSx0aGlzLmdldF9SZW5hbWVkPWZ1bmN0aW9uKHgseSl7dmFyIG9mZnNldD15KnRoaXMucm93U2l6ZSsoeD4+NSk7cmV0dXJuIDAhPSgxJlVSU2hpZnQodGhpcy5iaXRzW29mZnNldF0sMzEmeCkpfSx0aGlzLnNldF9SZW5hbWVkPWZ1bmN0aW9uKHgseSl7dmFyIG9mZnNldD15KnRoaXMucm93U2l6ZSsoeD4+NSk7dGhpcy5iaXRzW29mZnNldF18PTE8PCgzMSZ4KX0sdGhpcy5mbGlwPWZ1bmN0aW9uKHgseSl7dmFyIG9mZnNldD15KnRoaXMucm93U2l6ZSsoeD4+NSk7dGhpcy5iaXRzW29mZnNldF1ePTE8PCgzMSZ4KX0sdGhpcy5jbGVhcj1mdW5jdGlvbigpe2Zvcih2YXIgbWF4PXRoaXMuYml0cy5sZW5ndGgsaT0wO21heD5pO2krKyl0aGlzLmJpdHNbaV09MH0sdGhpcy5zZXRSZWdpb249ZnVuY3Rpb24obGVmdCx0b3Asd2lkdGgsaGVpZ2h0KXtpZigwPnRvcHx8MD5sZWZ0KXRocm93XCJMZWZ0IGFuZCB0b3AgbXVzdCBiZSBub25uZWdhdGl2ZVwiO2lmKDE+aGVpZ2h0fHwxPndpZHRoKXRocm93XCJIZWlnaHQgYW5kIHdpZHRoIG11c3QgYmUgYXQgbGVhc3QgMVwiO3ZhciByaWdodD1sZWZ0K3dpZHRoLGJvdHRvbT10b3AraGVpZ2h0O2lmKGJvdHRvbT50aGlzLmhlaWdodHx8cmlnaHQ+dGhpcy53aWR0aCl0aHJvd1wiVGhlIHJlZ2lvbiBtdXN0IGZpdCBpbnNpZGUgdGhlIG1hdHJpeFwiO2Zvcih2YXIgeT10b3A7Ym90dG9tPnk7eSsrKWZvcih2YXIgb2Zmc2V0PXkqdGhpcy5yb3dTaXplLHg9bGVmdDtyaWdodD54O3grKyl0aGlzLmJpdHNbb2Zmc2V0Kyh4Pj41KV18PTE8PCgzMSZ4KX19ZnVuY3Rpb24gRGF0YUJsb2NrKG51bURhdGFDb2Rld29yZHMsY29kZXdvcmRzKXt0aGlzLm51bURhdGFDb2Rld29yZHM9bnVtRGF0YUNvZGV3b3Jkcyx0aGlzLmNvZGV3b3Jkcz1jb2Rld29yZHMsdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiTnVtRGF0YUNvZGV3b3Jkc1wiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubnVtRGF0YUNvZGV3b3Jkc30pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkNvZGV3b3Jkc1wiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuY29kZXdvcmRzfSl9ZnVuY3Rpb24gQml0TWF0cml4UGFyc2VyKGJpdE1hdHJpeCl7dmFyIGRpbWVuc2lvbj1iaXRNYXRyaXguRGltZW5zaW9uO2lmKDIxPmRpbWVuc2lvbnx8MSE9KDMmZGltZW5zaW9uKSl0aHJvd1wiRXJyb3IgQml0TWF0cml4UGFyc2VyXCI7dGhpcy5iaXRNYXRyaXg9Yml0TWF0cml4LHRoaXMucGFyc2VkVmVyc2lvbj1udWxsLHRoaXMucGFyc2VkRm9ybWF0SW5mbz1udWxsLHRoaXMuY29weUJpdD1mdW5jdGlvbihpLGosdmVyc2lvbkJpdHMpe3JldHVybiB0aGlzLmJpdE1hdHJpeC5nZXRfUmVuYW1lZChpLGopP3ZlcnNpb25CaXRzPDwxfDE6dmVyc2lvbkJpdHM8PDF9LHRoaXMucmVhZEZvcm1hdEluZm9ybWF0aW9uPWZ1bmN0aW9uKCl7aWYobnVsbCE9dGhpcy5wYXJzZWRGb3JtYXRJbmZvKXJldHVybiB0aGlzLnBhcnNlZEZvcm1hdEluZm87Zm9yKHZhciBmb3JtYXRJbmZvQml0cz0wLGk9MDs2Pmk7aSsrKWZvcm1hdEluZm9CaXRzPXRoaXMuY29weUJpdChpLDgsZm9ybWF0SW5mb0JpdHMpO2Zvcm1hdEluZm9CaXRzPXRoaXMuY29weUJpdCg3LDgsZm9ybWF0SW5mb0JpdHMpLGZvcm1hdEluZm9CaXRzPXRoaXMuY29weUJpdCg4LDgsZm9ybWF0SW5mb0JpdHMpLGZvcm1hdEluZm9CaXRzPXRoaXMuY29weUJpdCg4LDcsZm9ybWF0SW5mb0JpdHMpO2Zvcih2YXIgaj01O2o+PTA7ai0tKWZvcm1hdEluZm9CaXRzPXRoaXMuY29weUJpdCg4LGosZm9ybWF0SW5mb0JpdHMpO2lmKHRoaXMucGFyc2VkRm9ybWF0SW5mbz1Gb3JtYXRJbmZvcm1hdGlvbi5kZWNvZGVGb3JtYXRJbmZvcm1hdGlvbihmb3JtYXRJbmZvQml0cyksbnVsbCE9dGhpcy5wYXJzZWRGb3JtYXRJbmZvKXJldHVybiB0aGlzLnBhcnNlZEZvcm1hdEluZm87dmFyIGRpbWVuc2lvbj10aGlzLmJpdE1hdHJpeC5EaW1lbnNpb247Zm9ybWF0SW5mb0JpdHM9MDtmb3IodmFyIGlNaW49ZGltZW5zaW9uLTgsaT1kaW1lbnNpb24tMTtpPj1pTWluO2ktLSlmb3JtYXRJbmZvQml0cz10aGlzLmNvcHlCaXQoaSw4LGZvcm1hdEluZm9CaXRzKTtmb3IodmFyIGo9ZGltZW5zaW9uLTc7ZGltZW5zaW9uPmo7aisrKWZvcm1hdEluZm9CaXRzPXRoaXMuY29weUJpdCg4LGosZm9ybWF0SW5mb0JpdHMpO2lmKHRoaXMucGFyc2VkRm9ybWF0SW5mbz1Gb3JtYXRJbmZvcm1hdGlvbi5kZWNvZGVGb3JtYXRJbmZvcm1hdGlvbihmb3JtYXRJbmZvQml0cyksbnVsbCE9dGhpcy5wYXJzZWRGb3JtYXRJbmZvKXJldHVybiB0aGlzLnBhcnNlZEZvcm1hdEluZm87dGhyb3dcIkVycm9yIHJlYWRGb3JtYXRJbmZvcm1hdGlvblwifSx0aGlzLnJlYWRWZXJzaW9uPWZ1bmN0aW9uKCl7aWYobnVsbCE9dGhpcy5wYXJzZWRWZXJzaW9uKXJldHVybiB0aGlzLnBhcnNlZFZlcnNpb247dmFyIGRpbWVuc2lvbj10aGlzLmJpdE1hdHJpeC5EaW1lbnNpb24scHJvdmlzaW9uYWxWZXJzaW9uPWRpbWVuc2lvbi0xNz4+MjtpZig2Pj1wcm92aXNpb25hbFZlcnNpb24pcmV0dXJuIFZlcnNpb24uZ2V0VmVyc2lvbkZvck51bWJlcihwcm92aXNpb25hbFZlcnNpb24pO2Zvcih2YXIgdmVyc2lvbkJpdHM9MCxpak1pbj1kaW1lbnNpb24tMTEsaj01O2o+PTA7ai0tKWZvcih2YXIgaT1kaW1lbnNpb24tOTtpPj1pak1pbjtpLS0pdmVyc2lvbkJpdHM9dGhpcy5jb3B5Qml0KGksaix2ZXJzaW9uQml0cyk7aWYodGhpcy5wYXJzZWRWZXJzaW9uPVZlcnNpb24uZGVjb2RlVmVyc2lvbkluZm9ybWF0aW9uKHZlcnNpb25CaXRzKSxudWxsIT10aGlzLnBhcnNlZFZlcnNpb24mJnRoaXMucGFyc2VkVmVyc2lvbi5EaW1lbnNpb25Gb3JWZXJzaW9uPT1kaW1lbnNpb24pcmV0dXJuIHRoaXMucGFyc2VkVmVyc2lvbjt2ZXJzaW9uQml0cz0wO2Zvcih2YXIgaT01O2k+PTA7aS0tKWZvcih2YXIgaj1kaW1lbnNpb24tOTtqPj1pak1pbjtqLS0pdmVyc2lvbkJpdHM9dGhpcy5jb3B5Qml0KGksaix2ZXJzaW9uQml0cyk7aWYodGhpcy5wYXJzZWRWZXJzaW9uPVZlcnNpb24uZGVjb2RlVmVyc2lvbkluZm9ybWF0aW9uKHZlcnNpb25CaXRzKSxudWxsIT10aGlzLnBhcnNlZFZlcnNpb24mJnRoaXMucGFyc2VkVmVyc2lvbi5EaW1lbnNpb25Gb3JWZXJzaW9uPT1kaW1lbnNpb24pcmV0dXJuIHRoaXMucGFyc2VkVmVyc2lvbjt0aHJvd1wiRXJyb3IgcmVhZFZlcnNpb25cIn0sdGhpcy5yZWFkQ29kZXdvcmRzPWZ1bmN0aW9uKCl7dmFyIGZvcm1hdEluZm89dGhpcy5yZWFkRm9ybWF0SW5mb3JtYXRpb24oKSx2ZXJzaW9uPXRoaXMucmVhZFZlcnNpb24oKSxkYXRhTWFzaz1EYXRhTWFzay5mb3JSZWZlcmVuY2UoZm9ybWF0SW5mby5EYXRhTWFzayksZGltZW5zaW9uPXRoaXMuYml0TWF0cml4LkRpbWVuc2lvbjtkYXRhTWFzay51bm1hc2tCaXRNYXRyaXgodGhpcy5iaXRNYXRyaXgsZGltZW5zaW9uKTtmb3IodmFyIGZ1bmN0aW9uUGF0dGVybj12ZXJzaW9uLmJ1aWxkRnVuY3Rpb25QYXR0ZXJuKCkscmVhZGluZ1VwPSEwLHJlc3VsdD1uZXcgQXJyYXkodmVyc2lvbi5Ub3RhbENvZGV3b3JkcykscmVzdWx0T2Zmc2V0PTAsY3VycmVudEJ5dGU9MCxiaXRzUmVhZD0wLGo9ZGltZW5zaW9uLTE7aj4wO2otPTIpezY9PWomJmotLTtmb3IodmFyIGNvdW50PTA7ZGltZW5zaW9uPmNvdW50O2NvdW50KyspZm9yKHZhciBpPXJlYWRpbmdVcD9kaW1lbnNpb24tMS1jb3VudDpjb3VudCxjb2w9MDsyPmNvbDtjb2wrKylmdW5jdGlvblBhdHRlcm4uZ2V0X1JlbmFtZWQoai1jb2wsaSl8fChiaXRzUmVhZCsrLGN1cnJlbnRCeXRlPDw9MSx0aGlzLmJpdE1hdHJpeC5nZXRfUmVuYW1lZChqLWNvbCxpKSYmKGN1cnJlbnRCeXRlfD0xKSw4PT1iaXRzUmVhZCYmKHJlc3VsdFtyZXN1bHRPZmZzZXQrK109Y3VycmVudEJ5dGUsYml0c1JlYWQ9MCxjdXJyZW50Qnl0ZT0wKSk7cmVhZGluZ1VwXj0hMH1pZihyZXN1bHRPZmZzZXQhPXZlcnNpb24uVG90YWxDb2Rld29yZHMpdGhyb3dcIkVycm9yIHJlYWRDb2Rld29yZHNcIjtyZXR1cm4gcmVzdWx0fX1mdW5jdGlvbiBEYXRhTWFzazAwMCgpe3RoaXMudW5tYXNrQml0TWF0cml4PWZ1bmN0aW9uKGJpdHMsZGltZW5zaW9uKXtmb3IodmFyIGk9MDtkaW1lbnNpb24+aTtpKyspZm9yKHZhciBqPTA7ZGltZW5zaW9uPmo7aisrKXRoaXMuaXNNYXNrZWQoaSxqKSYmYml0cy5mbGlwKGosaSl9LHRoaXMuaXNNYXNrZWQ9ZnVuY3Rpb24oaSxqKXtyZXR1cm4gMD09KGkraiYxKX19ZnVuY3Rpb24gRGF0YU1hc2swMDEoKXt0aGlzLnVubWFza0JpdE1hdHJpeD1mdW5jdGlvbihiaXRzLGRpbWVuc2lvbil7Zm9yKHZhciBpPTA7ZGltZW5zaW9uPmk7aSsrKWZvcih2YXIgaj0wO2RpbWVuc2lvbj5qO2orKyl0aGlzLmlzTWFza2VkKGksaikmJmJpdHMuZmxpcChqLGkpfSx0aGlzLmlzTWFza2VkPWZ1bmN0aW9uKGksail7cmV0dXJuIDA9PSgxJmkpfX1mdW5jdGlvbiBEYXRhTWFzazAxMCgpe3RoaXMudW5tYXNrQml0TWF0cml4PWZ1bmN0aW9uKGJpdHMsZGltZW5zaW9uKXtmb3IodmFyIGk9MDtkaW1lbnNpb24+aTtpKyspZm9yKHZhciBqPTA7ZGltZW5zaW9uPmo7aisrKXRoaXMuaXNNYXNrZWQoaSxqKSYmYml0cy5mbGlwKGosaSl9LHRoaXMuaXNNYXNrZWQ9ZnVuY3Rpb24oaSxqKXtyZXR1cm4gaiUzPT0wfX1mdW5jdGlvbiBEYXRhTWFzazAxMSgpe3RoaXMudW5tYXNrQml0TWF0cml4PWZ1bmN0aW9uKGJpdHMsZGltZW5zaW9uKXtmb3IodmFyIGk9MDtkaW1lbnNpb24+aTtpKyspZm9yKHZhciBqPTA7ZGltZW5zaW9uPmo7aisrKXRoaXMuaXNNYXNrZWQoaSxqKSYmYml0cy5mbGlwKGosaSl9LHRoaXMuaXNNYXNrZWQ9ZnVuY3Rpb24oaSxqKXtyZXR1cm4oaStqKSUzPT0wfX1mdW5jdGlvbiBEYXRhTWFzazEwMCgpe3RoaXMudW5tYXNrQml0TWF0cml4PWZ1bmN0aW9uKGJpdHMsZGltZW5zaW9uKXtmb3IodmFyIGk9MDtkaW1lbnNpb24+aTtpKyspZm9yKHZhciBqPTA7ZGltZW5zaW9uPmo7aisrKXRoaXMuaXNNYXNrZWQoaSxqKSYmYml0cy5mbGlwKGosaSl9LHRoaXMuaXNNYXNrZWQ9ZnVuY3Rpb24oaSxqKXtyZXR1cm4gMD09KFVSU2hpZnQoaSwxKStqLzMmMSl9fWZ1bmN0aW9uIERhdGFNYXNrMTAxKCl7dGhpcy51bm1hc2tCaXRNYXRyaXg9ZnVuY3Rpb24oYml0cyxkaW1lbnNpb24pe2Zvcih2YXIgaT0wO2RpbWVuc2lvbj5pO2krKylmb3IodmFyIGo9MDtkaW1lbnNpb24+ajtqKyspdGhpcy5pc01hc2tlZChpLGopJiZiaXRzLmZsaXAoaixpKX0sdGhpcy5pc01hc2tlZD1mdW5jdGlvbihpLGope3ZhciB0ZW1wPWkqajtyZXR1cm4oMSZ0ZW1wKSt0ZW1wJTM9PTB9fWZ1bmN0aW9uIERhdGFNYXNrMTEwKCl7dGhpcy51bm1hc2tCaXRNYXRyaXg9ZnVuY3Rpb24oYml0cyxkaW1lbnNpb24pe2Zvcih2YXIgaT0wO2RpbWVuc2lvbj5pO2krKylmb3IodmFyIGo9MDtkaW1lbnNpb24+ajtqKyspdGhpcy5pc01hc2tlZChpLGopJiZiaXRzLmZsaXAoaixpKX0sdGhpcy5pc01hc2tlZD1mdW5jdGlvbihpLGope3ZhciB0ZW1wPWkqajtyZXR1cm4gMD09KCgxJnRlbXApK3RlbXAlMyYxKX19ZnVuY3Rpb24gRGF0YU1hc2sxMTEoKXt0aGlzLnVubWFza0JpdE1hdHJpeD1mdW5jdGlvbihiaXRzLGRpbWVuc2lvbil7Zm9yKHZhciBpPTA7ZGltZW5zaW9uPmk7aSsrKWZvcih2YXIgaj0wO2RpbWVuc2lvbj5qO2orKyl0aGlzLmlzTWFza2VkKGksaikmJmJpdHMuZmxpcChqLGkpfSx0aGlzLmlzTWFza2VkPWZ1bmN0aW9uKGksail7cmV0dXJuIDA9PSgoaStqJjEpK2kqaiUzJjEpfX1mdW5jdGlvbiBSZWVkU29sb21vbkRlY29kZXIoZmllbGQpe3RoaXMuZmllbGQ9ZmllbGQsdGhpcy5kZWNvZGU9ZnVuY3Rpb24ocmVjZWl2ZWQsdHdvUyl7Zm9yKHZhciBwb2x5PW5ldyBHRjI1NlBvbHkodGhpcy5maWVsZCxyZWNlaXZlZCksc3luZHJvbWVDb2VmZmljaWVudHM9bmV3IEFycmF5KHR3b1MpLGk9MDtpPHN5bmRyb21lQ29lZmZpY2llbnRzLmxlbmd0aDtpKyspc3luZHJvbWVDb2VmZmljaWVudHNbaV09MDtmb3IodmFyIGRhdGFNYXRyaXg9ITEsbm9FcnJvcj0hMCxpPTA7dHdvUz5pO2krKyl7dmFyIGV2YWw9cG9seS5ldmFsdWF0ZUF0KHRoaXMuZmllbGQuZXhwKGRhdGFNYXRyaXg/aSsxOmkpKTtzeW5kcm9tZUNvZWZmaWNpZW50c1tzeW5kcm9tZUNvZWZmaWNpZW50cy5sZW5ndGgtMS1pXT1ldmFsLDAhPWV2YWwmJihub0Vycm9yPSExKX1pZighbm9FcnJvcilmb3IodmFyIHN5bmRyb21lPW5ldyBHRjI1NlBvbHkodGhpcy5maWVsZCxzeW5kcm9tZUNvZWZmaWNpZW50cyksc2lnbWFPbWVnYT10aGlzLnJ1bkV1Y2xpZGVhbkFsZ29yaXRobSh0aGlzLmZpZWxkLmJ1aWxkTW9ub21pYWwodHdvUywxKSxzeW5kcm9tZSx0d29TKSxzaWdtYT1zaWdtYU9tZWdhWzBdLG9tZWdhPXNpZ21hT21lZ2FbMV0sZXJyb3JMb2NhdGlvbnM9dGhpcy5maW5kRXJyb3JMb2NhdGlvbnMoc2lnbWEpLGVycm9yTWFnbml0dWRlcz10aGlzLmZpbmRFcnJvck1hZ25pdHVkZXMob21lZ2EsZXJyb3JMb2NhdGlvbnMsZGF0YU1hdHJpeCksaT0wO2k8ZXJyb3JMb2NhdGlvbnMubGVuZ3RoO2krKyl7dmFyIHBvc2l0aW9uPXJlY2VpdmVkLmxlbmd0aC0xLXRoaXMuZmllbGQubG9nKGVycm9yTG9jYXRpb25zW2ldKTtpZigwPnBvc2l0aW9uKXRocm93XCJSZWVkU29sb21vbkV4Y2VwdGlvbiBCYWQgZXJyb3IgbG9jYXRpb25cIjtyZWNlaXZlZFtwb3NpdGlvbl09R0YyNTYuYWRkT3JTdWJ0cmFjdChyZWNlaXZlZFtwb3NpdGlvbl0sZXJyb3JNYWduaXR1ZGVzW2ldKX19LHRoaXMucnVuRXVjbGlkZWFuQWxnb3JpdGhtPWZ1bmN0aW9uKGEsYixSKXtpZihhLkRlZ3JlZTxiLkRlZ3JlZSl7dmFyIHRlbXA9YTthPWIsYj10ZW1wfWZvcih2YXIgckxhc3Q9YSxyPWIsc0xhc3Q9dGhpcy5maWVsZC5PbmUscz10aGlzLmZpZWxkLlplcm8sdExhc3Q9dGhpcy5maWVsZC5aZXJvLHQ9dGhpcy5maWVsZC5PbmU7ci5EZWdyZWU+PU1hdGguZmxvb3IoUi8yKTspe3ZhciByTGFzdExhc3Q9ckxhc3Qsc0xhc3RMYXN0PXNMYXN0LHRMYXN0TGFzdD10TGFzdDtpZihyTGFzdD1yLHNMYXN0PXMsdExhc3Q9dCxyTGFzdC5aZXJvKXRocm93XCJyX3tpLTF9IHdhcyB6ZXJvXCI7cj1yTGFzdExhc3Q7Zm9yKHZhciBxPXRoaXMuZmllbGQuWmVybyxkZW5vbWluYXRvckxlYWRpbmdUZXJtPXJMYXN0LmdldENvZWZmaWNpZW50KHJMYXN0LkRlZ3JlZSksZGx0SW52ZXJzZT10aGlzLmZpZWxkLmludmVyc2UoZGVub21pbmF0b3JMZWFkaW5nVGVybSk7ci5EZWdyZWU+PXJMYXN0LkRlZ3JlZSYmIXIuWmVybzspe3ZhciBkZWdyZWVEaWZmPXIuRGVncmVlLXJMYXN0LkRlZ3JlZSxzY2FsZT10aGlzLmZpZWxkLm11bHRpcGx5KHIuZ2V0Q29lZmZpY2llbnQoci5EZWdyZWUpLGRsdEludmVyc2UpO3E9cS5hZGRPclN1YnRyYWN0KHRoaXMuZmllbGQuYnVpbGRNb25vbWlhbChkZWdyZWVEaWZmLHNjYWxlKSkscj1yLmFkZE9yU3VidHJhY3Qockxhc3QubXVsdGlwbHlCeU1vbm9taWFsKGRlZ3JlZURpZmYsc2NhbGUpKX1zPXEubXVsdGlwbHkxKHNMYXN0KS5hZGRPclN1YnRyYWN0KHNMYXN0TGFzdCksdD1xLm11bHRpcGx5MSh0TGFzdCkuYWRkT3JTdWJ0cmFjdCh0TGFzdExhc3QpfXZhciBzaWdtYVRpbGRlQXRaZXJvPXQuZ2V0Q29lZmZpY2llbnQoMCk7aWYoMD09c2lnbWFUaWxkZUF0WmVybyl0aHJvd1wiUmVlZFNvbG9tb25FeGNlcHRpb24gc2lnbWFUaWxkZSgwKSB3YXMgemVyb1wiO3ZhciBpbnZlcnNlPXRoaXMuZmllbGQuaW52ZXJzZShzaWdtYVRpbGRlQXRaZXJvKSxzaWdtYT10Lm11bHRpcGx5MihpbnZlcnNlKSxvbWVnYT1yLm11bHRpcGx5MihpbnZlcnNlKTtyZXR1cm4gbmV3IEFycmF5KHNpZ21hLG9tZWdhKX0sdGhpcy5maW5kRXJyb3JMb2NhdGlvbnM9ZnVuY3Rpb24oZXJyb3JMb2NhdG9yKXt2YXIgbnVtRXJyb3JzPWVycm9yTG9jYXRvci5EZWdyZWU7aWYoMT09bnVtRXJyb3JzKXJldHVybiBuZXcgQXJyYXkoZXJyb3JMb2NhdG9yLmdldENvZWZmaWNpZW50KDEpKTtmb3IodmFyIHJlc3VsdD1uZXcgQXJyYXkobnVtRXJyb3JzKSxlPTAsaT0xOzI1Nj5pJiZudW1FcnJvcnM+ZTtpKyspMD09ZXJyb3JMb2NhdG9yLmV2YWx1YXRlQXQoaSkmJihyZXN1bHRbZV09dGhpcy5maWVsZC5pbnZlcnNlKGkpLGUrKyk7aWYoZSE9bnVtRXJyb3JzKXRocm93XCJFcnJvciBsb2NhdG9yIGRlZ3JlZSBkb2VzIG5vdCBtYXRjaCBudW1iZXIgb2Ygcm9vdHNcIjtyZXR1cm4gcmVzdWx0fSx0aGlzLmZpbmRFcnJvck1hZ25pdHVkZXM9ZnVuY3Rpb24oZXJyb3JFdmFsdWF0b3IsZXJyb3JMb2NhdGlvbnMsZGF0YU1hdHJpeCl7Zm9yKHZhciBzPWVycm9yTG9jYXRpb25zLmxlbmd0aCxyZXN1bHQ9bmV3IEFycmF5KHMpLGk9MDtzPmk7aSsrKXtmb3IodmFyIHhpSW52ZXJzZT10aGlzLmZpZWxkLmludmVyc2UoZXJyb3JMb2NhdGlvbnNbaV0pLGRlbm9taW5hdG9yPTEsaj0wO3M+ajtqKyspaSE9aiYmKGRlbm9taW5hdG9yPXRoaXMuZmllbGQubXVsdGlwbHkoZGVub21pbmF0b3IsR0YyNTYuYWRkT3JTdWJ0cmFjdCgxLHRoaXMuZmllbGQubXVsdGlwbHkoZXJyb3JMb2NhdGlvbnNbal0seGlJbnZlcnNlKSkpKTtyZXN1bHRbaV09dGhpcy5maWVsZC5tdWx0aXBseShlcnJvckV2YWx1YXRvci5ldmFsdWF0ZUF0KHhpSW52ZXJzZSksdGhpcy5maWVsZC5pbnZlcnNlKGRlbm9taW5hdG9yKSksZGF0YU1hdHJpeCYmKHJlc3VsdFtpXT10aGlzLmZpZWxkLm11bHRpcGx5KHJlc3VsdFtpXSx4aUludmVyc2UpKX1yZXR1cm4gcmVzdWx0fX1mdW5jdGlvbiBHRjI1NlBvbHkoZmllbGQsY29lZmZpY2llbnRzKXtpZihudWxsPT1jb2VmZmljaWVudHN8fDA9PWNvZWZmaWNpZW50cy5sZW5ndGgpdGhyb3dcIlN5c3RlbS5Bcmd1bWVudEV4Y2VwdGlvblwiO3RoaXMuZmllbGQ9ZmllbGQ7dmFyIGNvZWZmaWNpZW50c0xlbmd0aD1jb2VmZmljaWVudHMubGVuZ3RoO2lmKGNvZWZmaWNpZW50c0xlbmd0aD4xJiYwPT1jb2VmZmljaWVudHNbMF0pe2Zvcih2YXIgZmlyc3ROb25aZXJvPTE7Y29lZmZpY2llbnRzTGVuZ3RoPmZpcnN0Tm9uWmVybyYmMD09Y29lZmZpY2llbnRzW2ZpcnN0Tm9uWmVyb107KWZpcnN0Tm9uWmVybysrO2lmKGZpcnN0Tm9uWmVybz09Y29lZmZpY2llbnRzTGVuZ3RoKXRoaXMuY29lZmZpY2llbnRzPWZpZWxkLlplcm8uY29lZmZpY2llbnRzO2Vsc2V7dGhpcy5jb2VmZmljaWVudHM9bmV3IEFycmF5KGNvZWZmaWNpZW50c0xlbmd0aC1maXJzdE5vblplcm8pO2Zvcih2YXIgaT0wO2k8dGhpcy5jb2VmZmljaWVudHMubGVuZ3RoO2krKyl0aGlzLmNvZWZmaWNpZW50c1tpXT0wO2Zvcih2YXIgY2k9MDtjaTx0aGlzLmNvZWZmaWNpZW50cy5sZW5ndGg7Y2krKyl0aGlzLmNvZWZmaWNpZW50c1tjaV09Y29lZmZpY2llbnRzW2ZpcnN0Tm9uWmVybytjaV19fWVsc2UgdGhpcy5jb2VmZmljaWVudHM9Y29lZmZpY2llbnRzO3RoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIlplcm9cIixmdW5jdGlvbigpe3JldHVybiAwPT10aGlzLmNvZWZmaWNpZW50c1swXX0pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkRlZ3JlZVwiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuY29lZmZpY2llbnRzLmxlbmd0aC0xfSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiQ29lZmZpY2llbnRzXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5jb2VmZmljaWVudHN9KSx0aGlzLmdldENvZWZmaWNpZW50PWZ1bmN0aW9uKGRlZ3JlZSl7cmV0dXJuIHRoaXMuY29lZmZpY2llbnRzW3RoaXMuY29lZmZpY2llbnRzLmxlbmd0aC0xLWRlZ3JlZV19LHRoaXMuZXZhbHVhdGVBdD1mdW5jdGlvbihhKXtpZigwPT1hKXJldHVybiB0aGlzLmdldENvZWZmaWNpZW50KDApO3ZhciBzaXplPXRoaXMuY29lZmZpY2llbnRzLmxlbmd0aDtpZigxPT1hKXtmb3IodmFyIHJlc3VsdD0wLGk9MDtzaXplPmk7aSsrKXJlc3VsdD1HRjI1Ni5hZGRPclN1YnRyYWN0KHJlc3VsdCx0aGlzLmNvZWZmaWNpZW50c1tpXSk7cmV0dXJuIHJlc3VsdH1mb3IodmFyIHJlc3VsdDI9dGhpcy5jb2VmZmljaWVudHNbMF0saT0xO3NpemU+aTtpKyspcmVzdWx0Mj1HRjI1Ni5hZGRPclN1YnRyYWN0KHRoaXMuZmllbGQubXVsdGlwbHkoYSxyZXN1bHQyKSx0aGlzLmNvZWZmaWNpZW50c1tpXSk7cmV0dXJuIHJlc3VsdDJ9LHRoaXMuYWRkT3JTdWJ0cmFjdD1mdW5jdGlvbihvdGhlcil7aWYodGhpcy5maWVsZCE9b3RoZXIuZmllbGQpdGhyb3dcIkdGMjU2UG9seXMgZG8gbm90IGhhdmUgc2FtZSBHRjI1NiBmaWVsZFwiO2lmKHRoaXMuWmVybylyZXR1cm4gb3RoZXI7aWYob3RoZXIuWmVybylyZXR1cm4gdGhpczt2YXIgc21hbGxlckNvZWZmaWNpZW50cz10aGlzLmNvZWZmaWNpZW50cyxsYXJnZXJDb2VmZmljaWVudHM9b3RoZXIuY29lZmZpY2llbnRzO2lmKHNtYWxsZXJDb2VmZmljaWVudHMubGVuZ3RoPmxhcmdlckNvZWZmaWNpZW50cy5sZW5ndGgpe3ZhciB0ZW1wPXNtYWxsZXJDb2VmZmljaWVudHM7c21hbGxlckNvZWZmaWNpZW50cz1sYXJnZXJDb2VmZmljaWVudHMsbGFyZ2VyQ29lZmZpY2llbnRzPXRlbXB9Zm9yKHZhciBzdW1EaWZmPW5ldyBBcnJheShsYXJnZXJDb2VmZmljaWVudHMubGVuZ3RoKSxsZW5ndGhEaWZmPWxhcmdlckNvZWZmaWNpZW50cy5sZW5ndGgtc21hbGxlckNvZWZmaWNpZW50cy5sZW5ndGgsY2k9MDtsZW5ndGhEaWZmPmNpO2NpKyspc3VtRGlmZltjaV09bGFyZ2VyQ29lZmZpY2llbnRzW2NpXTtmb3IodmFyIGk9bGVuZ3RoRGlmZjtpPGxhcmdlckNvZWZmaWNpZW50cy5sZW5ndGg7aSsrKXN1bURpZmZbaV09R0YyNTYuYWRkT3JTdWJ0cmFjdChzbWFsbGVyQ29lZmZpY2llbnRzW2ktbGVuZ3RoRGlmZl0sbGFyZ2VyQ29lZmZpY2llbnRzW2ldKTtyZXR1cm4gbmV3IEdGMjU2UG9seShmaWVsZCxzdW1EaWZmKX0sdGhpcy5tdWx0aXBseTE9ZnVuY3Rpb24ob3RoZXIpe2lmKHRoaXMuZmllbGQhPW90aGVyLmZpZWxkKXRocm93XCJHRjI1NlBvbHlzIGRvIG5vdCBoYXZlIHNhbWUgR0YyNTYgZmllbGRcIjtpZih0aGlzLlplcm98fG90aGVyLlplcm8pcmV0dXJuIHRoaXMuZmllbGQuWmVybztmb3IodmFyIGFDb2VmZmljaWVudHM9dGhpcy5jb2VmZmljaWVudHMsYUxlbmd0aD1hQ29lZmZpY2llbnRzLmxlbmd0aCxiQ29lZmZpY2llbnRzPW90aGVyLmNvZWZmaWNpZW50cyxiTGVuZ3RoPWJDb2VmZmljaWVudHMubGVuZ3RoLHByb2R1Y3Q9bmV3IEFycmF5KGFMZW5ndGgrYkxlbmd0aC0xKSxpPTA7YUxlbmd0aD5pO2krKylmb3IodmFyIGFDb2VmZj1hQ29lZmZpY2llbnRzW2ldLGo9MDtiTGVuZ3RoPmo7aisrKXByb2R1Y3RbaStqXT1HRjI1Ni5hZGRPclN1YnRyYWN0KHByb2R1Y3RbaStqXSx0aGlzLmZpZWxkLm11bHRpcGx5KGFDb2VmZixiQ29lZmZpY2llbnRzW2pdKSk7cmV0dXJuIG5ldyBHRjI1NlBvbHkodGhpcy5maWVsZCxwcm9kdWN0KX0sdGhpcy5tdWx0aXBseTI9ZnVuY3Rpb24oc2NhbGFyKXtpZigwPT1zY2FsYXIpcmV0dXJuIHRoaXMuZmllbGQuWmVybztpZigxPT1zY2FsYXIpcmV0dXJuIHRoaXM7Zm9yKHZhciBzaXplPXRoaXMuY29lZmZpY2llbnRzLmxlbmd0aCxwcm9kdWN0PW5ldyBBcnJheShzaXplKSxpPTA7c2l6ZT5pO2krKylwcm9kdWN0W2ldPXRoaXMuZmllbGQubXVsdGlwbHkodGhpcy5jb2VmZmljaWVudHNbaV0sc2NhbGFyKTtyZXR1cm4gbmV3IEdGMjU2UG9seSh0aGlzLmZpZWxkLHByb2R1Y3QpfSx0aGlzLm11bHRpcGx5QnlNb25vbWlhbD1mdW5jdGlvbihkZWdyZWUsY29lZmZpY2llbnQpe2lmKDA+ZGVncmVlKXRocm93XCJTeXN0ZW0uQXJndW1lbnRFeGNlcHRpb25cIjtpZigwPT1jb2VmZmljaWVudClyZXR1cm4gdGhpcy5maWVsZC5aZXJvO2Zvcih2YXIgc2l6ZT10aGlzLmNvZWZmaWNpZW50cy5sZW5ndGgscHJvZHVjdD1uZXcgQXJyYXkoc2l6ZStkZWdyZWUpLGk9MDtpPHByb2R1Y3QubGVuZ3RoO2krKylwcm9kdWN0W2ldPTA7Zm9yKHZhciBpPTA7c2l6ZT5pO2krKylwcm9kdWN0W2ldPXRoaXMuZmllbGQubXVsdGlwbHkodGhpcy5jb2VmZmljaWVudHNbaV0sY29lZmZpY2llbnQpO3JldHVybiBuZXcgR0YyNTZQb2x5KHRoaXMuZmllbGQscHJvZHVjdCl9LHRoaXMuZGl2aWRlPWZ1bmN0aW9uKG90aGVyKXtpZih0aGlzLmZpZWxkIT1vdGhlci5maWVsZCl0aHJvd1wiR0YyNTZQb2x5cyBkbyBub3QgaGF2ZSBzYW1lIEdGMjU2IGZpZWxkXCI7aWYob3RoZXIuWmVybyl0aHJvd1wiRGl2aWRlIGJ5IDBcIjtmb3IodmFyIHF1b3RpZW50PXRoaXMuZmllbGQuWmVybyxyZW1haW5kZXI9dGhpcyxkZW5vbWluYXRvckxlYWRpbmdUZXJtPW90aGVyLmdldENvZWZmaWNpZW50KG90aGVyLkRlZ3JlZSksaW52ZXJzZURlbm9taW5hdG9yTGVhZGluZ1Rlcm09dGhpcy5maWVsZC5pbnZlcnNlKGRlbm9taW5hdG9yTGVhZGluZ1Rlcm0pO3JlbWFpbmRlci5EZWdyZWU+PW90aGVyLkRlZ3JlZSYmIXJlbWFpbmRlci5aZXJvOyl7XHJcbiAgICB2YXIgZGVncmVlRGlmZmVyZW5jZT1yZW1haW5kZXIuRGVncmVlLW90aGVyLkRlZ3JlZSxzY2FsZT10aGlzLmZpZWxkLm11bHRpcGx5KHJlbWFpbmRlci5nZXRDb2VmZmljaWVudChyZW1haW5kZXIuRGVncmVlKSxpbnZlcnNlRGVub21pbmF0b3JMZWFkaW5nVGVybSksdGVybT1vdGhlci5tdWx0aXBseUJ5TW9ub21pYWwoZGVncmVlRGlmZmVyZW5jZSxzY2FsZSksaXRlcmF0aW9uUXVvdGllbnQ9dGhpcy5maWVsZC5idWlsZE1vbm9taWFsKGRlZ3JlZURpZmZlcmVuY2Usc2NhbGUpO3F1b3RpZW50PXF1b3RpZW50LmFkZE9yU3VidHJhY3QoaXRlcmF0aW9uUXVvdGllbnQpLHJlbWFpbmRlcj1yZW1haW5kZXIuYWRkT3JTdWJ0cmFjdCh0ZXJtKX1yZXR1cm4gbmV3IEFycmF5KHF1b3RpZW50LHJlbWFpbmRlcil9fWZ1bmN0aW9uIEdGMjU2KHByaW1pdGl2ZSl7dGhpcy5leHBUYWJsZT1uZXcgQXJyYXkoMjU2KSx0aGlzLmxvZ1RhYmxlPW5ldyBBcnJheSgyNTYpO2Zvcih2YXIgeD0xLGk9MDsyNTY+aTtpKyspdGhpcy5leHBUYWJsZVtpXT14LHg8PD0xLHg+PTI1NiYmKHhePXByaW1pdGl2ZSk7Zm9yKHZhciBpPTA7MjU1Pmk7aSsrKXRoaXMubG9nVGFibGVbdGhpcy5leHBUYWJsZVtpXV09aTt2YXIgYXQwPW5ldyBBcnJheSgxKTthdDBbMF09MCx0aGlzLnplcm89bmV3IEdGMjU2UG9seSh0aGlzLG5ldyBBcnJheShhdDApKTt2YXIgYXQxPW5ldyBBcnJheSgxKTthdDFbMF09MSx0aGlzLm9uZT1uZXcgR0YyNTZQb2x5KHRoaXMsbmV3IEFycmF5KGF0MSkpLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIlplcm9cIixmdW5jdGlvbigpe3JldHVybiB0aGlzLnplcm99KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJPbmVcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLm9uZX0pLHRoaXMuYnVpbGRNb25vbWlhbD1mdW5jdGlvbihkZWdyZWUsY29lZmZpY2llbnQpe2lmKDA+ZGVncmVlKXRocm93XCJTeXN0ZW0uQXJndW1lbnRFeGNlcHRpb25cIjtpZigwPT1jb2VmZmljaWVudClyZXR1cm4gemVybztmb3IodmFyIGNvZWZmaWNpZW50cz1uZXcgQXJyYXkoZGVncmVlKzEpLGk9MDtpPGNvZWZmaWNpZW50cy5sZW5ndGg7aSsrKWNvZWZmaWNpZW50c1tpXT0wO3JldHVybiBjb2VmZmljaWVudHNbMF09Y29lZmZpY2llbnQsbmV3IEdGMjU2UG9seSh0aGlzLGNvZWZmaWNpZW50cyl9LHRoaXMuZXhwPWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLmV4cFRhYmxlW2FdfSx0aGlzLmxvZz1mdW5jdGlvbihhKXtpZigwPT1hKXRocm93XCJTeXN0ZW0uQXJndW1lbnRFeGNlcHRpb25cIjtyZXR1cm4gdGhpcy5sb2dUYWJsZVthXX0sdGhpcy5pbnZlcnNlPWZ1bmN0aW9uKGEpe2lmKDA9PWEpdGhyb3dcIlN5c3RlbS5Bcml0aG1ldGljRXhjZXB0aW9uXCI7cmV0dXJuIHRoaXMuZXhwVGFibGVbMjU1LXRoaXMubG9nVGFibGVbYV1dfSx0aGlzLm11bHRpcGx5PWZ1bmN0aW9uKGEsYil7cmV0dXJuIDA9PWF8fDA9PWI/MDoxPT1hP2I6MT09Yj9hOnRoaXMuZXhwVGFibGVbKHRoaXMubG9nVGFibGVbYV0rdGhpcy5sb2dUYWJsZVtiXSklMjU1XX19ZnVuY3Rpb24gVVJTaGlmdChudW1iZXIsYml0cyl7cmV0dXJuIG51bWJlcj49MD9udW1iZXI+PmJpdHM6KG51bWJlcj4+Yml0cykrKDI8PH5iaXRzKX1mdW5jdGlvbiBGaW5kZXJQYXR0ZXJuKHBvc1gscG9zWSxlc3RpbWF0ZWRNb2R1bGVTaXplKXt0aGlzLng9cG9zWCx0aGlzLnk9cG9zWSx0aGlzLmNvdW50PTEsdGhpcy5lc3RpbWF0ZWRNb2R1bGVTaXplPWVzdGltYXRlZE1vZHVsZVNpemUsdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiRXN0aW1hdGVkTW9kdWxlU2l6ZVwiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZXN0aW1hdGVkTW9kdWxlU2l6ZX0pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkNvdW50XCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5jb3VudH0pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIlhcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLnh9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJZXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy55fSksdGhpcy5pbmNyZW1lbnRDb3VudD1mdW5jdGlvbigpe3RoaXMuY291bnQrK30sdGhpcy5hYm91dEVxdWFscz1mdW5jdGlvbihtb2R1bGVTaXplLGksail7aWYoTWF0aC5hYnMoaS10aGlzLnkpPD1tb2R1bGVTaXplJiZNYXRoLmFicyhqLXRoaXMueCk8PW1vZHVsZVNpemUpe3ZhciBtb2R1bGVTaXplRGlmZj1NYXRoLmFicyhtb2R1bGVTaXplLXRoaXMuZXN0aW1hdGVkTW9kdWxlU2l6ZSk7cmV0dXJuIDE+PW1vZHVsZVNpemVEaWZmfHxtb2R1bGVTaXplRGlmZi90aGlzLmVzdGltYXRlZE1vZHVsZVNpemU8PTF9cmV0dXJuITF9fWZ1bmN0aW9uIEZpbmRlclBhdHRlcm5JbmZvKHBhdHRlcm5DZW50ZXJzKXt0aGlzLmJvdHRvbUxlZnQ9cGF0dGVybkNlbnRlcnNbMF0sdGhpcy50b3BMZWZ0PXBhdHRlcm5DZW50ZXJzWzFdLHRoaXMudG9wUmlnaHQ9cGF0dGVybkNlbnRlcnNbMl0sdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiQm90dG9tTGVmdFwiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYm90dG9tTGVmdH0pLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIlRvcExlZnRcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLnRvcExlZnR9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJUb3BSaWdodFwiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudG9wUmlnaHR9KX1mdW5jdGlvbiBGaW5kZXJQYXR0ZXJuRmluZGVyKCl7dGhpcy5pbWFnZT1udWxsLHRoaXMucG9zc2libGVDZW50ZXJzPVtdLHRoaXMuaGFzU2tpcHBlZD0hMSx0aGlzLmNyb3NzQ2hlY2tTdGF0ZUNvdW50PW5ldyBBcnJheSgwLDAsMCwwLDApLHRoaXMucmVzdWx0UG9pbnRDYWxsYmFjaz1udWxsLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkNyb3NzQ2hlY2tTdGF0ZUNvdW50XCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5jcm9zc0NoZWNrU3RhdGVDb3VudFswXT0wLHRoaXMuY3Jvc3NDaGVja1N0YXRlQ291bnRbMV09MCx0aGlzLmNyb3NzQ2hlY2tTdGF0ZUNvdW50WzJdPTAsdGhpcy5jcm9zc0NoZWNrU3RhdGVDb3VudFszXT0wLHRoaXMuY3Jvc3NDaGVja1N0YXRlQ291bnRbNF09MCx0aGlzLmNyb3NzQ2hlY2tTdGF0ZUNvdW50fSksdGhpcy5mb3VuZFBhdHRlcm5Dcm9zcz1mdW5jdGlvbihzdGF0ZUNvdW50KXtmb3IodmFyIHRvdGFsTW9kdWxlU2l6ZT0wLGk9MDs1Pmk7aSsrKXt2YXIgY291bnQ9c3RhdGVDb3VudFtpXTtpZigwPT1jb3VudClyZXR1cm4hMTt0b3RhbE1vZHVsZVNpemUrPWNvdW50fWlmKDc+dG90YWxNb2R1bGVTaXplKXJldHVybiExO3ZhciBtb2R1bGVTaXplPU1hdGguZmxvb3IoKHRvdGFsTW9kdWxlU2l6ZTw8SU5URUdFUl9NQVRIX1NISUZUKS83KSxtYXhWYXJpYW5jZT1NYXRoLmZsb29yKG1vZHVsZVNpemUvMik7cmV0dXJuIE1hdGguYWJzKG1vZHVsZVNpemUtKHN0YXRlQ291bnRbMF08PElOVEVHRVJfTUFUSF9TSElGVCkpPG1heFZhcmlhbmNlJiZNYXRoLmFicyhtb2R1bGVTaXplLShzdGF0ZUNvdW50WzFdPDxJTlRFR0VSX01BVEhfU0hJRlQpKTxtYXhWYXJpYW5jZSYmTWF0aC5hYnMoMyptb2R1bGVTaXplLShzdGF0ZUNvdW50WzJdPDxJTlRFR0VSX01BVEhfU0hJRlQpKTwzKm1heFZhcmlhbmNlJiZNYXRoLmFicyhtb2R1bGVTaXplLShzdGF0ZUNvdW50WzNdPDxJTlRFR0VSX01BVEhfU0hJRlQpKTxtYXhWYXJpYW5jZSYmTWF0aC5hYnMobW9kdWxlU2l6ZS0oc3RhdGVDb3VudFs0XTw8SU5URUdFUl9NQVRIX1NISUZUKSk8bWF4VmFyaWFuY2V9LHRoaXMuY2VudGVyRnJvbUVuZD1mdW5jdGlvbihzdGF0ZUNvdW50LGVuZCl7cmV0dXJuIGVuZC1zdGF0ZUNvdW50WzRdLXN0YXRlQ291bnRbM10tc3RhdGVDb3VudFsyXS8yfSx0aGlzLmNyb3NzQ2hlY2tWZXJ0aWNhbD1mdW5jdGlvbihzdGFydEksY2VudGVySixtYXhDb3VudCxvcmlnaW5hbFN0YXRlQ291bnRUb3RhbCl7Zm9yKHZhciBpbWFnZT10aGlzLmltYWdlLG1heEk9cXJjb2RlLmhlaWdodCxzdGF0ZUNvdW50PXRoaXMuQ3Jvc3NDaGVja1N0YXRlQ291bnQsaT1zdGFydEk7aT49MCYmaW1hZ2VbY2VudGVySitpKnFyY29kZS53aWR0aF07KXN0YXRlQ291bnRbMl0rKyxpLS07aWYoMD5pKXJldHVybiBOYU47Zm9yKDtpPj0wJiYhaW1hZ2VbY2VudGVySitpKnFyY29kZS53aWR0aF0mJnN0YXRlQ291bnRbMV08PW1heENvdW50OylzdGF0ZUNvdW50WzFdKyssaS0tO2lmKDA+aXx8c3RhdGVDb3VudFsxXT5tYXhDb3VudClyZXR1cm4gTmFOO2Zvcig7aT49MCYmaW1hZ2VbY2VudGVySitpKnFyY29kZS53aWR0aF0mJnN0YXRlQ291bnRbMF08PW1heENvdW50OylzdGF0ZUNvdW50WzBdKyssaS0tO2lmKHN0YXRlQ291bnRbMF0+bWF4Q291bnQpcmV0dXJuIE5hTjtmb3IoaT1zdGFydEkrMTttYXhJPmkmJmltYWdlW2NlbnRlckoraSpxcmNvZGUud2lkdGhdOylzdGF0ZUNvdW50WzJdKyssaSsrO2lmKGk9PW1heEkpcmV0dXJuIE5hTjtmb3IoO21heEk+aSYmIWltYWdlW2NlbnRlckoraSpxcmNvZGUud2lkdGhdJiZzdGF0ZUNvdW50WzNdPG1heENvdW50OylzdGF0ZUNvdW50WzNdKyssaSsrO2lmKGk9PW1heEl8fHN0YXRlQ291bnRbM10+PW1heENvdW50KXJldHVybiBOYU47Zm9yKDttYXhJPmkmJmltYWdlW2NlbnRlckoraSpxcmNvZGUud2lkdGhdJiZzdGF0ZUNvdW50WzRdPG1heENvdW50OylzdGF0ZUNvdW50WzRdKyssaSsrO2lmKHN0YXRlQ291bnRbNF0+PW1heENvdW50KXJldHVybiBOYU47dmFyIHN0YXRlQ291bnRUb3RhbD1zdGF0ZUNvdW50WzBdK3N0YXRlQ291bnRbMV0rc3RhdGVDb3VudFsyXStzdGF0ZUNvdW50WzNdK3N0YXRlQ291bnRbNF07cmV0dXJuIDUqTWF0aC5hYnMoc3RhdGVDb3VudFRvdGFsLW9yaWdpbmFsU3RhdGVDb3VudFRvdGFsKT49MipvcmlnaW5hbFN0YXRlQ291bnRUb3RhbD9OYU46dGhpcy5mb3VuZFBhdHRlcm5Dcm9zcyhzdGF0ZUNvdW50KT90aGlzLmNlbnRlckZyb21FbmQoc3RhdGVDb3VudCxpKTpOYU59LHRoaXMuY3Jvc3NDaGVja0hvcml6b250YWw9ZnVuY3Rpb24oc3RhcnRKLGNlbnRlckksbWF4Q291bnQsb3JpZ2luYWxTdGF0ZUNvdW50VG90YWwpe2Zvcih2YXIgaW1hZ2U9dGhpcy5pbWFnZSxtYXhKPXFyY29kZS53aWR0aCxzdGF0ZUNvdW50PXRoaXMuQ3Jvc3NDaGVja1N0YXRlQ291bnQsaj1zdGFydEo7aj49MCYmaW1hZ2VbaitjZW50ZXJJKnFyY29kZS53aWR0aF07KXN0YXRlQ291bnRbMl0rKyxqLS07aWYoMD5qKXJldHVybiBOYU47Zm9yKDtqPj0wJiYhaW1hZ2VbaitjZW50ZXJJKnFyY29kZS53aWR0aF0mJnN0YXRlQ291bnRbMV08PW1heENvdW50OylzdGF0ZUNvdW50WzFdKyssai0tO2lmKDA+anx8c3RhdGVDb3VudFsxXT5tYXhDb3VudClyZXR1cm4gTmFOO2Zvcig7aj49MCYmaW1hZ2VbaitjZW50ZXJJKnFyY29kZS53aWR0aF0mJnN0YXRlQ291bnRbMF08PW1heENvdW50OylzdGF0ZUNvdW50WzBdKyssai0tO2lmKHN0YXRlQ291bnRbMF0+bWF4Q291bnQpcmV0dXJuIE5hTjtmb3Ioaj1zdGFydEorMTttYXhKPmomJmltYWdlW2orY2VudGVySSpxcmNvZGUud2lkdGhdOylzdGF0ZUNvdW50WzJdKyssaisrO2lmKGo9PW1heEopcmV0dXJuIE5hTjtmb3IoO21heEo+aiYmIWltYWdlW2orY2VudGVySSpxcmNvZGUud2lkdGhdJiZzdGF0ZUNvdW50WzNdPG1heENvdW50OylzdGF0ZUNvdW50WzNdKyssaisrO2lmKGo9PW1heEp8fHN0YXRlQ291bnRbM10+PW1heENvdW50KXJldHVybiBOYU47Zm9yKDttYXhKPmomJmltYWdlW2orY2VudGVySSpxcmNvZGUud2lkdGhdJiZzdGF0ZUNvdW50WzRdPG1heENvdW50OylzdGF0ZUNvdW50WzRdKyssaisrO2lmKHN0YXRlQ291bnRbNF0+PW1heENvdW50KXJldHVybiBOYU47dmFyIHN0YXRlQ291bnRUb3RhbD1zdGF0ZUNvdW50WzBdK3N0YXRlQ291bnRbMV0rc3RhdGVDb3VudFsyXStzdGF0ZUNvdW50WzNdK3N0YXRlQ291bnRbNF07cmV0dXJuIDUqTWF0aC5hYnMoc3RhdGVDb3VudFRvdGFsLW9yaWdpbmFsU3RhdGVDb3VudFRvdGFsKT49b3JpZ2luYWxTdGF0ZUNvdW50VG90YWw/TmFOOnRoaXMuZm91bmRQYXR0ZXJuQ3Jvc3Moc3RhdGVDb3VudCk/dGhpcy5jZW50ZXJGcm9tRW5kKHN0YXRlQ291bnQsaik6TmFOfSx0aGlzLmhhbmRsZVBvc3NpYmxlQ2VudGVyPWZ1bmN0aW9uKHN0YXRlQ291bnQsaSxqKXt2YXIgc3RhdGVDb3VudFRvdGFsPXN0YXRlQ291bnRbMF0rc3RhdGVDb3VudFsxXStzdGF0ZUNvdW50WzJdK3N0YXRlQ291bnRbM10rc3RhdGVDb3VudFs0XSxjZW50ZXJKPXRoaXMuY2VudGVyRnJvbUVuZChzdGF0ZUNvdW50LGopLGNlbnRlckk9dGhpcy5jcm9zc0NoZWNrVmVydGljYWwoaSxNYXRoLmZsb29yKGNlbnRlckopLHN0YXRlQ291bnRbMl0sc3RhdGVDb3VudFRvdGFsKTtpZighaXNOYU4oY2VudGVySSkmJihjZW50ZXJKPXRoaXMuY3Jvc3NDaGVja0hvcml6b250YWwoTWF0aC5mbG9vcihjZW50ZXJKKSxNYXRoLmZsb29yKGNlbnRlckkpLHN0YXRlQ291bnRbMl0sc3RhdGVDb3VudFRvdGFsKSwhaXNOYU4oY2VudGVySikpKXtmb3IodmFyIGVzdGltYXRlZE1vZHVsZVNpemU9c3RhdGVDb3VudFRvdGFsLzcsZm91bmQ9ITEsbWF4PXRoaXMucG9zc2libGVDZW50ZXJzLmxlbmd0aCxpbmRleD0wO21heD5pbmRleDtpbmRleCsrKXt2YXIgY2VudGVyPXRoaXMucG9zc2libGVDZW50ZXJzW2luZGV4XTtpZihjZW50ZXIuYWJvdXRFcXVhbHMoZXN0aW1hdGVkTW9kdWxlU2l6ZSxjZW50ZXJJLGNlbnRlckopKXtjZW50ZXIuaW5jcmVtZW50Q291bnQoKSxmb3VuZD0hMDticmVha319aWYoIWZvdW5kKXt2YXIgcG9pbnQ9bmV3IEZpbmRlclBhdHRlcm4oY2VudGVySixjZW50ZXJJLGVzdGltYXRlZE1vZHVsZVNpemUpO3RoaXMucG9zc2libGVDZW50ZXJzLnB1c2gocG9pbnQpLG51bGwhPXRoaXMucmVzdWx0UG9pbnRDYWxsYmFjayYmdGhpcy5yZXN1bHRQb2ludENhbGxiYWNrLmZvdW5kUG9zc2libGVSZXN1bHRQb2ludChwb2ludCl9cmV0dXJuITB9cmV0dXJuITF9LHRoaXMuc2VsZWN0QmVzdFBhdHRlcm5zPWZ1bmN0aW9uKCl7dmFyIHN0YXJ0U2l6ZT10aGlzLnBvc3NpYmxlQ2VudGVycy5sZW5ndGg7aWYoMz5zdGFydFNpemUpdGhyb3dcIkNvdWxkbid0IGZpbmQgZW5vdWdoIGZpbmRlciBwYXR0ZXJuc1wiO2lmKHN0YXJ0U2l6ZT4zKXtmb3IodmFyIHRvdGFsTW9kdWxlU2l6ZT0wLGk9MDtzdGFydFNpemU+aTtpKyspdG90YWxNb2R1bGVTaXplKz10aGlzLnBvc3NpYmxlQ2VudGVyc1tpXS5Fc3RpbWF0ZWRNb2R1bGVTaXplO2Zvcih2YXIgYXZlcmFnZT10b3RhbE1vZHVsZVNpemUvc3RhcnRTaXplLGk9MDtpPHRoaXMucG9zc2libGVDZW50ZXJzLmxlbmd0aCYmdGhpcy5wb3NzaWJsZUNlbnRlcnMubGVuZ3RoPjM7aSsrKXt2YXIgcGF0dGVybj10aGlzLnBvc3NpYmxlQ2VudGVyc1tpXTtNYXRoLmFicyhwYXR0ZXJuLkVzdGltYXRlZE1vZHVsZVNpemUtYXZlcmFnZSk+LjIqYXZlcmFnZSYmKHRoaXMucG9zc2libGVDZW50ZXJzLnJlbW92ZShpKSxpLS0pfX1yZXR1cm4gdGhpcy5wb3NzaWJsZUNlbnRlcnMuQ291bnQ+MyxuZXcgQXJyYXkodGhpcy5wb3NzaWJsZUNlbnRlcnNbMF0sdGhpcy5wb3NzaWJsZUNlbnRlcnNbMV0sdGhpcy5wb3NzaWJsZUNlbnRlcnNbMl0pfSx0aGlzLmZpbmRSb3dTa2lwPWZ1bmN0aW9uKCl7dmFyIG1heD10aGlzLnBvc3NpYmxlQ2VudGVycy5sZW5ndGg7aWYoMT49bWF4KXJldHVybiAwO2Zvcih2YXIgZmlyc3RDb25maXJtZWRDZW50ZXI9bnVsbCxpPTA7bWF4Pmk7aSsrKXt2YXIgY2VudGVyPXRoaXMucG9zc2libGVDZW50ZXJzW2ldO2lmKGNlbnRlci5Db3VudD49Q0VOVEVSX1FVT1JVTSl7aWYobnVsbCE9Zmlyc3RDb25maXJtZWRDZW50ZXIpcmV0dXJuIHRoaXMuaGFzU2tpcHBlZD0hMCxNYXRoLmZsb29yKChNYXRoLmFicyhmaXJzdENvbmZpcm1lZENlbnRlci5YLWNlbnRlci5YKS1NYXRoLmFicyhmaXJzdENvbmZpcm1lZENlbnRlci5ZLWNlbnRlci5ZKSkvMik7Zmlyc3RDb25maXJtZWRDZW50ZXI9Y2VudGVyfX1yZXR1cm4gMH0sdGhpcy5oYXZlTXVsdGlwbHlDb25maXJtZWRDZW50ZXJzPWZ1bmN0aW9uKCl7Zm9yKHZhciBjb25maXJtZWRDb3VudD0wLHRvdGFsTW9kdWxlU2l6ZT0wLG1heD10aGlzLnBvc3NpYmxlQ2VudGVycy5sZW5ndGgsaT0wO21heD5pO2krKyl7dmFyIHBhdHRlcm49dGhpcy5wb3NzaWJsZUNlbnRlcnNbaV07cGF0dGVybi5Db3VudD49Q0VOVEVSX1FVT1JVTSYmKGNvbmZpcm1lZENvdW50KyssdG90YWxNb2R1bGVTaXplKz1wYXR0ZXJuLkVzdGltYXRlZE1vZHVsZVNpemUpfWlmKDM+Y29uZmlybWVkQ291bnQpcmV0dXJuITE7Zm9yKHZhciBhdmVyYWdlPXRvdGFsTW9kdWxlU2l6ZS9tYXgsdG90YWxEZXZpYXRpb249MCxpPTA7bWF4Pmk7aSsrKXBhdHRlcm49dGhpcy5wb3NzaWJsZUNlbnRlcnNbaV0sdG90YWxEZXZpYXRpb24rPU1hdGguYWJzKHBhdHRlcm4uRXN0aW1hdGVkTW9kdWxlU2l6ZS1hdmVyYWdlKTtyZXR1cm4uMDUqdG90YWxNb2R1bGVTaXplPj10b3RhbERldmlhdGlvbn0sdGhpcy5maW5kRmluZGVyUGF0dGVybj1mdW5jdGlvbihpbWFnZSl7dmFyIHRyeUhhcmRlcj0hMTt0aGlzLmltYWdlPWltYWdlO3ZhciBtYXhJPXFyY29kZS5oZWlnaHQsbWF4Sj1xcmNvZGUud2lkdGgsaVNraXA9TWF0aC5mbG9vcigzKm1heEkvKDQqTUFYX01PRFVMRVMpKTsoTUlOX1NLSVA+aVNraXB8fHRyeUhhcmRlcikmJihpU2tpcD1NSU5fU0tJUCk7Zm9yKHZhciBkb25lPSExLHN0YXRlQ291bnQ9bmV3IEFycmF5KDUpLGk9aVNraXAtMTttYXhJPmkmJiFkb25lO2krPWlTa2lwKXtzdGF0ZUNvdW50WzBdPTAsc3RhdGVDb3VudFsxXT0wLHN0YXRlQ291bnRbMl09MCxzdGF0ZUNvdW50WzNdPTAsc3RhdGVDb3VudFs0XT0wO2Zvcih2YXIgY3VycmVudFN0YXRlPTAsaj0wO21heEo+ajtqKyspaWYoaW1hZ2VbaitpKnFyY29kZS53aWR0aF0pMT09KDEmY3VycmVudFN0YXRlKSYmY3VycmVudFN0YXRlKyssc3RhdGVDb3VudFtjdXJyZW50U3RhdGVdKys7ZWxzZSBpZigwPT0oMSZjdXJyZW50U3RhdGUpKWlmKDQ9PWN1cnJlbnRTdGF0ZSlpZih0aGlzLmZvdW5kUGF0dGVybkNyb3NzKHN0YXRlQ291bnQpKXt2YXIgY29uZmlybWVkPXRoaXMuaGFuZGxlUG9zc2libGVDZW50ZXIoc3RhdGVDb3VudCxpLGopO2lmKGNvbmZpcm1lZClpZihpU2tpcD0yLHRoaXMuaGFzU2tpcHBlZClkb25lPXRoaXMuaGF2ZU11bHRpcGx5Q29uZmlybWVkQ2VudGVycygpO2Vsc2V7dmFyIHJvd1NraXA9dGhpcy5maW5kUm93U2tpcCgpO3Jvd1NraXA+c3RhdGVDb3VudFsyXSYmKGkrPXJvd1NraXAtc3RhdGVDb3VudFsyXS1pU2tpcCxqPW1heEotMSl9ZWxzZXtkbyBqKys7d2hpbGUobWF4Sj5qJiYhaW1hZ2VbaitpKnFyY29kZS53aWR0aF0pO2otLX1jdXJyZW50U3RhdGU9MCxzdGF0ZUNvdW50WzBdPTAsc3RhdGVDb3VudFsxXT0wLHN0YXRlQ291bnRbMl09MCxzdGF0ZUNvdW50WzNdPTAsc3RhdGVDb3VudFs0XT0wfWVsc2Ugc3RhdGVDb3VudFswXT1zdGF0ZUNvdW50WzJdLHN0YXRlQ291bnRbMV09c3RhdGVDb3VudFszXSxzdGF0ZUNvdW50WzJdPXN0YXRlQ291bnRbNF0sc3RhdGVDb3VudFszXT0xLHN0YXRlQ291bnRbNF09MCxjdXJyZW50U3RhdGU9MztlbHNlIHN0YXRlQ291bnRbKytjdXJyZW50U3RhdGVdKys7ZWxzZSBzdGF0ZUNvdW50W2N1cnJlbnRTdGF0ZV0rKztpZih0aGlzLmZvdW5kUGF0dGVybkNyb3NzKHN0YXRlQ291bnQpKXt2YXIgY29uZmlybWVkPXRoaXMuaGFuZGxlUG9zc2libGVDZW50ZXIoc3RhdGVDb3VudCxpLG1heEopO2NvbmZpcm1lZCYmKGlTa2lwPXN0YXRlQ291bnRbMF0sdGhpcy5oYXNTa2lwcGVkJiYoZG9uZT1oYXZlTXVsdGlwbHlDb25maXJtZWRDZW50ZXJzKCkpKX19dmFyIHBhdHRlcm5JbmZvPXRoaXMuc2VsZWN0QmVzdFBhdHRlcm5zKCk7cmV0dXJuIHFyY29kZS5vcmRlckJlc3RQYXR0ZXJucyhwYXR0ZXJuSW5mbyksbmV3IEZpbmRlclBhdHRlcm5JbmZvKHBhdHRlcm5JbmZvKX19ZnVuY3Rpb24gQWxpZ25tZW50UGF0dGVybihwb3NYLHBvc1ksZXN0aW1hdGVkTW9kdWxlU2l6ZSl7dGhpcy54PXBvc1gsdGhpcy55PXBvc1ksdGhpcy5jb3VudD0xLHRoaXMuZXN0aW1hdGVkTW9kdWxlU2l6ZT1lc3RpbWF0ZWRNb2R1bGVTaXplLHRoaXMuX19kZWZpbmVHZXR0ZXJfXyhcIkVzdGltYXRlZE1vZHVsZVNpemVcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLmVzdGltYXRlZE1vZHVsZVNpemV9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJDb3VudFwiLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuY291bnR9KSx0aGlzLl9fZGVmaW5lR2V0dGVyX18oXCJYXCIsZnVuY3Rpb24oKXtyZXR1cm4gTWF0aC5mbG9vcih0aGlzLngpfSksdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiWVwiLGZ1bmN0aW9uKCl7cmV0dXJuIE1hdGguZmxvb3IodGhpcy55KX0pLHRoaXMuaW5jcmVtZW50Q291bnQ9ZnVuY3Rpb24oKXt0aGlzLmNvdW50Kyt9LHRoaXMuYWJvdXRFcXVhbHM9ZnVuY3Rpb24obW9kdWxlU2l6ZSxpLGope2lmKE1hdGguYWJzKGktdGhpcy55KTw9bW9kdWxlU2l6ZSYmTWF0aC5hYnMoai10aGlzLngpPD1tb2R1bGVTaXplKXt2YXIgbW9kdWxlU2l6ZURpZmY9TWF0aC5hYnMobW9kdWxlU2l6ZS10aGlzLmVzdGltYXRlZE1vZHVsZVNpemUpO3JldHVybiAxPj1tb2R1bGVTaXplRGlmZnx8bW9kdWxlU2l6ZURpZmYvdGhpcy5lc3RpbWF0ZWRNb2R1bGVTaXplPD0xfXJldHVybiExfX1mdW5jdGlvbiBBbGlnbm1lbnRQYXR0ZXJuRmluZGVyKGltYWdlLHN0YXJ0WCxzdGFydFksd2lkdGgsaGVpZ2h0LG1vZHVsZVNpemUscmVzdWx0UG9pbnRDYWxsYmFjayl7dGhpcy5pbWFnZT1pbWFnZSx0aGlzLnBvc3NpYmxlQ2VudGVycz1uZXcgQXJyYXksdGhpcy5zdGFydFg9c3RhcnRYLHRoaXMuc3RhcnRZPXN0YXJ0WSx0aGlzLndpZHRoPXdpZHRoLHRoaXMuaGVpZ2h0PWhlaWdodCx0aGlzLm1vZHVsZVNpemU9bW9kdWxlU2l6ZSx0aGlzLmNyb3NzQ2hlY2tTdGF0ZUNvdW50PW5ldyBBcnJheSgwLDAsMCksdGhpcy5yZXN1bHRQb2ludENhbGxiYWNrPXJlc3VsdFBvaW50Q2FsbGJhY2ssdGhpcy5jZW50ZXJGcm9tRW5kPWZ1bmN0aW9uKHN0YXRlQ291bnQsZW5kKXtyZXR1cm4gZW5kLXN0YXRlQ291bnRbMl0tc3RhdGVDb3VudFsxXS8yfSx0aGlzLmZvdW5kUGF0dGVybkNyb3NzPWZ1bmN0aW9uKHN0YXRlQ291bnQpe2Zvcih2YXIgbW9kdWxlU2l6ZT10aGlzLm1vZHVsZVNpemUsbWF4VmFyaWFuY2U9bW9kdWxlU2l6ZS8yLGk9MDszPmk7aSsrKWlmKE1hdGguYWJzKG1vZHVsZVNpemUtc3RhdGVDb3VudFtpXSk+PW1heFZhcmlhbmNlKXJldHVybiExO3JldHVybiEwfSx0aGlzLmNyb3NzQ2hlY2tWZXJ0aWNhbD1mdW5jdGlvbihzdGFydEksY2VudGVySixtYXhDb3VudCxvcmlnaW5hbFN0YXRlQ291bnRUb3RhbCl7dmFyIGltYWdlPXRoaXMuaW1hZ2UsbWF4ST1xcmNvZGUuaGVpZ2h0LHN0YXRlQ291bnQ9dGhpcy5jcm9zc0NoZWNrU3RhdGVDb3VudDtzdGF0ZUNvdW50WzBdPTAsc3RhdGVDb3VudFsxXT0wLHN0YXRlQ291bnRbMl09MDtmb3IodmFyIGk9c3RhcnRJO2k+PTAmJmltYWdlW2NlbnRlckoraSpxcmNvZGUud2lkdGhdJiZzdGF0ZUNvdW50WzFdPD1tYXhDb3VudDspc3RhdGVDb3VudFsxXSsrLGktLTtpZigwPml8fHN0YXRlQ291bnRbMV0+bWF4Q291bnQpcmV0dXJuIE5hTjtmb3IoO2k+PTAmJiFpbWFnZVtjZW50ZXJKK2kqcXJjb2RlLndpZHRoXSYmc3RhdGVDb3VudFswXTw9bWF4Q291bnQ7KXN0YXRlQ291bnRbMF0rKyxpLS07aWYoc3RhdGVDb3VudFswXT5tYXhDb3VudClyZXR1cm4gTmFOO2ZvcihpPXN0YXJ0SSsxO21heEk+aSYmaW1hZ2VbY2VudGVySitpKnFyY29kZS53aWR0aF0mJnN0YXRlQ291bnRbMV08PW1heENvdW50OylzdGF0ZUNvdW50WzFdKyssaSsrO2lmKGk9PW1heEl8fHN0YXRlQ291bnRbMV0+bWF4Q291bnQpcmV0dXJuIE5hTjtmb3IoO21heEk+aSYmIWltYWdlW2NlbnRlckoraSpxcmNvZGUud2lkdGhdJiZzdGF0ZUNvdW50WzJdPD1tYXhDb3VudDspc3RhdGVDb3VudFsyXSsrLGkrKztpZihzdGF0ZUNvdW50WzJdPm1heENvdW50KXJldHVybiBOYU47dmFyIHN0YXRlQ291bnRUb3RhbD1zdGF0ZUNvdW50WzBdK3N0YXRlQ291bnRbMV0rc3RhdGVDb3VudFsyXTtyZXR1cm4gNSpNYXRoLmFicyhzdGF0ZUNvdW50VG90YWwtb3JpZ2luYWxTdGF0ZUNvdW50VG90YWwpPj0yKm9yaWdpbmFsU3RhdGVDb3VudFRvdGFsP05hTjp0aGlzLmZvdW5kUGF0dGVybkNyb3NzKHN0YXRlQ291bnQpP3RoaXMuY2VudGVyRnJvbUVuZChzdGF0ZUNvdW50LGkpOk5hTn0sdGhpcy5oYW5kbGVQb3NzaWJsZUNlbnRlcj1mdW5jdGlvbihzdGF0ZUNvdW50LGksail7dmFyIHN0YXRlQ291bnRUb3RhbD1zdGF0ZUNvdW50WzBdK3N0YXRlQ291bnRbMV0rc3RhdGVDb3VudFsyXSxjZW50ZXJKPXRoaXMuY2VudGVyRnJvbUVuZChzdGF0ZUNvdW50LGopLGNlbnRlckk9dGhpcy5jcm9zc0NoZWNrVmVydGljYWwoaSxNYXRoLmZsb29yKGNlbnRlckopLDIqc3RhdGVDb3VudFsxXSxzdGF0ZUNvdW50VG90YWwpO2lmKCFpc05hTihjZW50ZXJJKSl7Zm9yKHZhciBlc3RpbWF0ZWRNb2R1bGVTaXplPShzdGF0ZUNvdW50WzBdK3N0YXRlQ291bnRbMV0rc3RhdGVDb3VudFsyXSkvMyxtYXg9dGhpcy5wb3NzaWJsZUNlbnRlcnMubGVuZ3RoLGluZGV4PTA7bWF4PmluZGV4O2luZGV4Kyspe3ZhciBjZW50ZXI9dGhpcy5wb3NzaWJsZUNlbnRlcnNbaW5kZXhdO2lmKGNlbnRlci5hYm91dEVxdWFscyhlc3RpbWF0ZWRNb2R1bGVTaXplLGNlbnRlckksY2VudGVySikpcmV0dXJuIG5ldyBBbGlnbm1lbnRQYXR0ZXJuKGNlbnRlckosY2VudGVySSxlc3RpbWF0ZWRNb2R1bGVTaXplKX12YXIgcG9pbnQ9bmV3IEFsaWdubWVudFBhdHRlcm4oY2VudGVySixjZW50ZXJJLGVzdGltYXRlZE1vZHVsZVNpemUpO3RoaXMucG9zc2libGVDZW50ZXJzLnB1c2gocG9pbnQpLG51bGwhPXRoaXMucmVzdWx0UG9pbnRDYWxsYmFjayYmdGhpcy5yZXN1bHRQb2ludENhbGxiYWNrLmZvdW5kUG9zc2libGVSZXN1bHRQb2ludChwb2ludCl9cmV0dXJuIG51bGx9LHRoaXMuZmluZD1mdW5jdGlvbigpe2Zvcih2YXIgc3RhcnRYPXRoaXMuc3RhcnRYLGhlaWdodD10aGlzLmhlaWdodCxtYXhKPXN0YXJ0WCt3aWR0aCxtaWRkbGVJPXN0YXJ0WSsoaGVpZ2h0Pj4xKSxzdGF0ZUNvdW50PW5ldyBBcnJheSgwLDAsMCksaUdlbj0wO2hlaWdodD5pR2VuO2lHZW4rKyl7dmFyIGk9bWlkZGxlSSsoMD09KDEmaUdlbik/aUdlbisxPj4xOi0oaUdlbisxPj4xKSk7c3RhdGVDb3VudFswXT0wLHN0YXRlQ291bnRbMV09MCxzdGF0ZUNvdW50WzJdPTA7Zm9yKHZhciBqPXN0YXJ0WDttYXhKPmomJiFpbWFnZVtqK3FyY29kZS53aWR0aCppXTspaisrO2Zvcih2YXIgY3VycmVudFN0YXRlPTA7bWF4Sj5qOyl7aWYoaW1hZ2VbaitpKnFyY29kZS53aWR0aF0paWYoMT09Y3VycmVudFN0YXRlKXN0YXRlQ291bnRbY3VycmVudFN0YXRlXSsrO2Vsc2UgaWYoMj09Y3VycmVudFN0YXRlKXtpZih0aGlzLmZvdW5kUGF0dGVybkNyb3NzKHN0YXRlQ291bnQpKXt2YXIgY29uZmlybWVkPXRoaXMuaGFuZGxlUG9zc2libGVDZW50ZXIoc3RhdGVDb3VudCxpLGopO2lmKG51bGwhPWNvbmZpcm1lZClyZXR1cm4gY29uZmlybWVkfXN0YXRlQ291bnRbMF09c3RhdGVDb3VudFsyXSxzdGF0ZUNvdW50WzFdPTEsc3RhdGVDb3VudFsyXT0wLGN1cnJlbnRTdGF0ZT0xfWVsc2Ugc3RhdGVDb3VudFsrK2N1cnJlbnRTdGF0ZV0rKztlbHNlIDE9PWN1cnJlbnRTdGF0ZSYmY3VycmVudFN0YXRlKyssc3RhdGVDb3VudFtjdXJyZW50U3RhdGVdKys7aisrfWlmKHRoaXMuZm91bmRQYXR0ZXJuQ3Jvc3Moc3RhdGVDb3VudCkpe3ZhciBjb25maXJtZWQ9dGhpcy5oYW5kbGVQb3NzaWJsZUNlbnRlcihzdGF0ZUNvdW50LGksbWF4Sik7aWYobnVsbCE9Y29uZmlybWVkKXJldHVybiBjb25maXJtZWR9fWlmKDAhPXRoaXMucG9zc2libGVDZW50ZXJzLmxlbmd0aClyZXR1cm4gdGhpcy5wb3NzaWJsZUNlbnRlcnNbMF07dGhyb3dcIkNvdWxkbid0IGZpbmQgZW5vdWdoIGFsaWdubWVudCBwYXR0ZXJuc1wifX1mdW5jdGlvbiBRUkNvZGVEYXRhQmxvY2tSZWFkZXIoYmxvY2tzLHZlcnNpb24sbnVtRXJyb3JDb3JyZWN0aW9uQ29kZSl7dGhpcy5ibG9ja1BvaW50ZXI9MCx0aGlzLmJpdFBvaW50ZXI9Nyx0aGlzLmRhdGFMZW5ndGg9MCx0aGlzLmJsb2Nrcz1ibG9ja3MsdGhpcy5udW1FcnJvckNvcnJlY3Rpb25Db2RlPW51bUVycm9yQ29ycmVjdGlvbkNvZGUsOT49dmVyc2lvbj90aGlzLmRhdGFMZW5ndGhNb2RlPTA6dmVyc2lvbj49MTAmJjI2Pj12ZXJzaW9uP3RoaXMuZGF0YUxlbmd0aE1vZGU9MTp2ZXJzaW9uPj0yNyYmNDA+PXZlcnNpb24mJih0aGlzLmRhdGFMZW5ndGhNb2RlPTIpLHRoaXMuZ2V0TmV4dEJpdHM9ZnVuY3Rpb24obnVtQml0cyl7dmFyIGJpdHM9MDtpZihudW1CaXRzPHRoaXMuYml0UG9pbnRlcisxKXtmb3IodmFyIG1hc2s9MCxpPTA7bnVtQml0cz5pO2krKyltYXNrKz0xPDxpO3JldHVybiBtYXNrPDw9dGhpcy5iaXRQb2ludGVyLW51bUJpdHMrMSxiaXRzPSh0aGlzLmJsb2Nrc1t0aGlzLmJsb2NrUG9pbnRlcl0mbWFzayk+PnRoaXMuYml0UG9pbnRlci1udW1CaXRzKzEsdGhpcy5iaXRQb2ludGVyLT1udW1CaXRzLGJpdHN9aWYobnVtQml0czx0aGlzLmJpdFBvaW50ZXIrMSs4KXtmb3IodmFyIG1hc2sxPTAsaT0wO2k8dGhpcy5iaXRQb2ludGVyKzE7aSsrKW1hc2sxKz0xPDxpO3JldHVybiBiaXRzPSh0aGlzLmJsb2Nrc1t0aGlzLmJsb2NrUG9pbnRlcl0mbWFzazEpPDxudW1CaXRzLSh0aGlzLmJpdFBvaW50ZXIrMSksdGhpcy5ibG9ja1BvaW50ZXIrKyxiaXRzKz10aGlzLmJsb2Nrc1t0aGlzLmJsb2NrUG9pbnRlcl0+PjgtKG51bUJpdHMtKHRoaXMuYml0UG9pbnRlcisxKSksdGhpcy5iaXRQb2ludGVyPXRoaXMuYml0UG9pbnRlci1udW1CaXRzJTgsdGhpcy5iaXRQb2ludGVyPDAmJih0aGlzLmJpdFBvaW50ZXI9OCt0aGlzLmJpdFBvaW50ZXIpLGJpdHN9aWYobnVtQml0czx0aGlzLmJpdFBvaW50ZXIrMSsxNil7Zm9yKHZhciBtYXNrMT0wLG1hc2szPTAsaT0wO2k8dGhpcy5iaXRQb2ludGVyKzE7aSsrKW1hc2sxKz0xPDxpO3ZhciBiaXRzRmlyc3RCbG9jaz0odGhpcy5ibG9ja3NbdGhpcy5ibG9ja1BvaW50ZXJdJm1hc2sxKTw8bnVtQml0cy0odGhpcy5iaXRQb2ludGVyKzEpO3RoaXMuYmxvY2tQb2ludGVyKys7dmFyIGJpdHNTZWNvbmRCbG9jaz10aGlzLmJsb2Nrc1t0aGlzLmJsb2NrUG9pbnRlcl08PG51bUJpdHMtKHRoaXMuYml0UG9pbnRlcisxKzgpO3RoaXMuYmxvY2tQb2ludGVyKys7Zm9yKHZhciBpPTA7aTxudW1CaXRzLSh0aGlzLmJpdFBvaW50ZXIrMSs4KTtpKyspbWFzazMrPTE8PGk7bWFzazM8PD04LShudW1CaXRzLSh0aGlzLmJpdFBvaW50ZXIrMSs4KSk7dmFyIGJpdHNUaGlyZEJsb2NrPSh0aGlzLmJsb2Nrc1t0aGlzLmJsb2NrUG9pbnRlcl0mbWFzazMpPj44LShudW1CaXRzLSh0aGlzLmJpdFBvaW50ZXIrMSs4KSk7cmV0dXJuIGJpdHM9Yml0c0ZpcnN0QmxvY2srYml0c1NlY29uZEJsb2NrK2JpdHNUaGlyZEJsb2NrLHRoaXMuYml0UG9pbnRlcj10aGlzLmJpdFBvaW50ZXItKG51bUJpdHMtOCklOCx0aGlzLmJpdFBvaW50ZXI8MCYmKHRoaXMuYml0UG9pbnRlcj04K3RoaXMuYml0UG9pbnRlciksYml0c31yZXR1cm4gMH0sdGhpcy5OZXh0TW9kZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLmJsb2NrUG9pbnRlcj50aGlzLmJsb2Nrcy5sZW5ndGgtdGhpcy5udW1FcnJvckNvcnJlY3Rpb25Db2RlLTI/MDp0aGlzLmdldE5leHRCaXRzKDQpfSx0aGlzLmdldERhdGFMZW5ndGg9ZnVuY3Rpb24obW9kZUluZGljYXRvcil7Zm9yKHZhciBpbmRleD0wOzspe2lmKG1vZGVJbmRpY2F0b3I+PmluZGV4PT0xKWJyZWFrO2luZGV4Kyt9cmV0dXJuIHRoaXMuZ2V0TmV4dEJpdHMocXJjb2RlLnNpemVPZkRhdGFMZW5ndGhJbmZvW3RoaXMuZGF0YUxlbmd0aE1vZGVdW2luZGV4XSl9LHRoaXMuZ2V0Um9tYW5BbmRGaWd1cmVTdHJpbmc9ZnVuY3Rpb24oZGF0YUxlbmd0aCl7dmFyIGxlbmd0aD1kYXRhTGVuZ3RoLGludERhdGE9MCxzdHJEYXRhPVwiXCIsdGFibGVSb21hbkFuZEZpZ3VyZT1uZXcgQXJyYXkoXCIwXCIsXCIxXCIsXCIyXCIsXCIzXCIsXCI0XCIsXCI1XCIsXCI2XCIsXCI3XCIsXCI4XCIsXCI5XCIsXCJBXCIsXCJCXCIsXCJDXCIsXCJEXCIsXCJFXCIsXCJGXCIsXCJHXCIsXCJIXCIsXCJJXCIsXCJKXCIsXCJLXCIsXCJMXCIsXCJNXCIsXCJOXCIsXCJPXCIsXCJQXCIsXCJRXCIsXCJSXCIsXCJTXCIsXCJUXCIsXCJVXCIsXCJWXCIsXCJXXCIsXCJYXCIsXCJZXCIsXCJaXCIsXCIgXCIsXCIkXCIsXCIlXCIsXCIqXCIsXCIrXCIsXCItXCIsXCIuXCIsXCIvXCIsXCI6XCIpO2RvIGlmKGxlbmd0aD4xKXtpbnREYXRhPXRoaXMuZ2V0TmV4dEJpdHMoMTEpO3ZhciBmaXJzdExldHRlcj1NYXRoLmZsb29yKGludERhdGEvNDUpLHNlY29uZExldHRlcj1pbnREYXRhJTQ1O3N0ckRhdGErPXRhYmxlUm9tYW5BbmRGaWd1cmVbZmlyc3RMZXR0ZXJdLHN0ckRhdGErPXRhYmxlUm9tYW5BbmRGaWd1cmVbc2Vjb25kTGV0dGVyXSxsZW5ndGgtPTJ9ZWxzZSAxPT1sZW5ndGgmJihpbnREYXRhPXRoaXMuZ2V0TmV4dEJpdHMoNiksc3RyRGF0YSs9dGFibGVSb21hbkFuZEZpZ3VyZVtpbnREYXRhXSxsZW5ndGgtPTEpO3doaWxlKGxlbmd0aD4wKTtyZXR1cm4gc3RyRGF0YX0sdGhpcy5nZXRGaWd1cmVTdHJpbmc9ZnVuY3Rpb24oZGF0YUxlbmd0aCl7dmFyIGxlbmd0aD1kYXRhTGVuZ3RoLGludERhdGE9MCxzdHJEYXRhPVwiXCI7ZG8gbGVuZ3RoPj0zPyhpbnREYXRhPXRoaXMuZ2V0TmV4dEJpdHMoMTApLDEwMD5pbnREYXRhJiYoc3RyRGF0YSs9XCIwXCIpLDEwPmludERhdGEmJihzdHJEYXRhKz1cIjBcIiksbGVuZ3RoLT0zKToyPT1sZW5ndGg/KGludERhdGE9dGhpcy5nZXROZXh0Qml0cyg3KSwxMD5pbnREYXRhJiYoc3RyRGF0YSs9XCIwXCIpLGxlbmd0aC09Mik6MT09bGVuZ3RoJiYoaW50RGF0YT10aGlzLmdldE5leHRCaXRzKDQpLGxlbmd0aC09MSksc3RyRGF0YSs9aW50RGF0YTt3aGlsZShsZW5ndGg+MCk7cmV0dXJuIHN0ckRhdGF9LHRoaXMuZ2V0OGJpdEJ5dGVBcnJheT1mdW5jdGlvbihkYXRhTGVuZ3RoKXt2YXIgbGVuZ3RoPWRhdGFMZW5ndGgsaW50RGF0YT0wLG91dHB1dD1uZXcgQXJyYXk7ZG8gaW50RGF0YT10aGlzLmdldE5leHRCaXRzKDgpLG91dHB1dC5wdXNoKGludERhdGEpLGxlbmd0aC0tO3doaWxlKGxlbmd0aD4wKTtyZXR1cm4gb3V0cHV0fSx0aGlzLmdldEthbmppU3RyaW5nPWZ1bmN0aW9uKGRhdGFMZW5ndGgpe3ZhciBsZW5ndGg9ZGF0YUxlbmd0aCxpbnREYXRhPTAsdW5pY29kZVN0cmluZz1cIlwiO2Rve2ludERhdGE9Z2V0TmV4dEJpdHMoMTMpO3ZhciBsb3dlckJ5dGU9aW50RGF0YSUxOTIsaGlnaGVyQnl0ZT1pbnREYXRhLzE5Mix0ZW1wV29yZD0oaGlnaGVyQnl0ZTw8OCkrbG93ZXJCeXRlLHNoaWZ0amlzV29yZD0wO3NoaWZ0amlzV29yZD00MDk1Nj49dGVtcFdvcmQrMzMwODg/dGVtcFdvcmQrMzMwODg6dGVtcFdvcmQrNDk0NzIsdW5pY29kZVN0cmluZys9U3RyaW5nLmZyb21DaGFyQ29kZShzaGlmdGppc1dvcmQpLGxlbmd0aC0tfXdoaWxlKGxlbmd0aD4wKTtyZXR1cm4gdW5pY29kZVN0cmluZ30sdGhpcy5fX2RlZmluZUdldHRlcl9fKFwiRGF0YUJ5dGVcIixmdW5jdGlvbigpe2Zvcih2YXIgb3V0cHV0PW5ldyBBcnJheSxNT0RFX05VTUJFUj0xLE1PREVfUk9NQU5fQU5EX05VTUJFUj0yLE1PREVfOEJJVF9CWVRFPTQsTU9ERV9LQU5KST04Ozspe3ZhciBtb2RlPXRoaXMuTmV4dE1vZGUoKTtpZigwPT1tb2RlKXtpZihvdXRwdXQubGVuZ3RoPjApYnJlYWs7dGhyb3dcIkVtcHR5IGRhdGEgYmxvY2tcIn1pZihtb2RlIT1NT0RFX05VTUJFUiYmbW9kZSE9TU9ERV9ST01BTl9BTkRfTlVNQkVSJiZtb2RlIT1NT0RFXzhCSVRfQllURSYmbW9kZSE9TU9ERV9LQU5KSSl0aHJvd1wiSW52YWxpZCBtb2RlOiBcIittb2RlK1wiIGluIChibG9jazpcIit0aGlzLmJsb2NrUG9pbnRlcitcIiBiaXQ6XCIrdGhpcy5iaXRQb2ludGVyK1wiKVwiO2lmKGRhdGFMZW5ndGg9dGhpcy5nZXREYXRhTGVuZ3RoKG1vZGUpLGRhdGFMZW5ndGg8MSl0aHJvd1wiSW52YWxpZCBkYXRhIGxlbmd0aDogXCIrZGF0YUxlbmd0aDtzd2l0Y2gobW9kZSl7Y2FzZSBNT0RFX05VTUJFUjpmb3IodmFyIHRlbXBfc3RyPXRoaXMuZ2V0RmlndXJlU3RyaW5nKGRhdGFMZW5ndGgpLHRhPW5ldyBBcnJheSh0ZW1wX3N0ci5sZW5ndGgpLGo9MDtqPHRlbXBfc3RyLmxlbmd0aDtqKyspdGFbal09dGVtcF9zdHIuY2hhckNvZGVBdChqKTtvdXRwdXQucHVzaCh0YSk7YnJlYWs7Y2FzZSBNT0RFX1JPTUFOX0FORF9OVU1CRVI6Zm9yKHZhciB0ZW1wX3N0cj10aGlzLmdldFJvbWFuQW5kRmlndXJlU3RyaW5nKGRhdGFMZW5ndGgpLHRhPW5ldyBBcnJheSh0ZW1wX3N0ci5sZW5ndGgpLGo9MDtqPHRlbXBfc3RyLmxlbmd0aDtqKyspdGFbal09dGVtcF9zdHIuY2hhckNvZGVBdChqKTtvdXRwdXQucHVzaCh0YSk7YnJlYWs7Y2FzZSBNT0RFXzhCSVRfQllURTp2YXIgdGVtcF9zYnl0ZUFycmF5Mz10aGlzLmdldDhiaXRCeXRlQXJyYXkoZGF0YUxlbmd0aCk7b3V0cHV0LnB1c2godGVtcF9zYnl0ZUFycmF5Myk7YnJlYWs7Y2FzZSBNT0RFX0tBTkpJOnZhciB0ZW1wX3N0cj10aGlzLmdldEthbmppU3RyaW5nKGRhdGFMZW5ndGgpO291dHB1dC5wdXNoKHRlbXBfc3RyKX19cmV0dXJuIG91dHB1dH0pfUdyaWRTYW1wbGVyPXt9LEdyaWRTYW1wbGVyLmNoZWNrQW5kTnVkZ2VQb2ludHM9ZnVuY3Rpb24oaW1hZ2UscG9pbnRzKXtmb3IodmFyIHdpZHRoPXFyY29kZS53aWR0aCxoZWlnaHQ9cXJjb2RlLmhlaWdodCxudWRnZWQ9ITAsb2Zmc2V0PTA7b2Zmc2V0PHBvaW50cy5MZW5ndGgmJm51ZGdlZDtvZmZzZXQrPTIpe3ZhciB4PU1hdGguZmxvb3IocG9pbnRzW29mZnNldF0pLHk9TWF0aC5mbG9vcihwb2ludHNbb2Zmc2V0KzFdKTtpZigtMT54fHx4PndpZHRofHwtMT55fHx5PmhlaWdodCl0aHJvd1wiRXJyb3IuY2hlY2tBbmROdWRnZVBvaW50cyBcIjtudWRnZWQ9ITEsLTE9PXg/KHBvaW50c1tvZmZzZXRdPTAsbnVkZ2VkPSEwKTp4PT13aWR0aCYmKHBvaW50c1tvZmZzZXRdPXdpZHRoLTEsbnVkZ2VkPSEwKSwtMT09eT8ocG9pbnRzW29mZnNldCsxXT0wLG51ZGdlZD0hMCk6eT09aGVpZ2h0JiYocG9pbnRzW29mZnNldCsxXT1oZWlnaHQtMSxudWRnZWQ9ITApfW51ZGdlZD0hMDtmb3IodmFyIG9mZnNldD1wb2ludHMuTGVuZ3RoLTI7b2Zmc2V0Pj0wJiZudWRnZWQ7b2Zmc2V0LT0yKXt2YXIgeD1NYXRoLmZsb29yKHBvaW50c1tvZmZzZXRdKSx5PU1hdGguZmxvb3IocG9pbnRzW29mZnNldCsxXSk7aWYoLTE+eHx8eD53aWR0aHx8LTE+eXx8eT5oZWlnaHQpdGhyb3dcIkVycm9yLmNoZWNrQW5kTnVkZ2VQb2ludHMgXCI7bnVkZ2VkPSExLC0xPT14Pyhwb2ludHNbb2Zmc2V0XT0wLG51ZGdlZD0hMCk6eD09d2lkdGgmJihwb2ludHNbb2Zmc2V0XT13aWR0aC0xLG51ZGdlZD0hMCksLTE9PXk/KHBvaW50c1tvZmZzZXQrMV09MCxudWRnZWQ9ITApOnk9PWhlaWdodCYmKHBvaW50c1tvZmZzZXQrMV09aGVpZ2h0LTEsbnVkZ2VkPSEwKX19LEdyaWRTYW1wbGVyLnNhbXBsZUdyaWQzPWZ1bmN0aW9uKGltYWdlLGRpbWVuc2lvbix0cmFuc2Zvcm0pe2Zvcih2YXIgYml0cz1uZXcgQml0TWF0cml4KGRpbWVuc2lvbikscG9pbnRzPW5ldyBBcnJheShkaW1lbnNpb248PDEpLHk9MDtkaW1lbnNpb24+eTt5Kyspe2Zvcih2YXIgbWF4PXBvaW50cy5sZW5ndGgsaVZhbHVlPXkrLjUseD0wO21heD54O3grPTIpcG9pbnRzW3hdPSh4Pj4xKSsuNSxwb2ludHNbeCsxXT1pVmFsdWU7dHJhbnNmb3JtLnRyYW5zZm9ybVBvaW50czEocG9pbnRzKSxHcmlkU2FtcGxlci5jaGVja0FuZE51ZGdlUG9pbnRzKGltYWdlLHBvaW50cyk7dHJ5e2Zvcih2YXIgeD0wO21heD54O3grPTIpe3ZhciB4cG9pbnQ9NCpNYXRoLmZsb29yKHBvaW50c1t4XSkrTWF0aC5mbG9vcihwb2ludHNbeCsxXSkqcXJjb2RlLndpZHRoKjQsYml0PWltYWdlW01hdGguZmxvb3IocG9pbnRzW3hdKStxcmNvZGUud2lkdGgqTWF0aC5mbG9vcihwb2ludHNbeCsxXSldO3FyY29kZS5pbWFnZWRhdGEuZGF0YVt4cG9pbnRdPWJpdD8yNTU6MCxxcmNvZGUuaW1hZ2VkYXRhLmRhdGFbeHBvaW50KzFdPWJpdD8yNTU6MCxxcmNvZGUuaW1hZ2VkYXRhLmRhdGFbeHBvaW50KzJdPTAscXJjb2RlLmltYWdlZGF0YS5kYXRhW3hwb2ludCszXT0yNTUsYml0JiZiaXRzLnNldF9SZW5hbWVkKHg+PjEseSl9fWNhdGNoKGFpb29iZSl7dGhyb3dcIkVycm9yLmNoZWNrQW5kTnVkZ2VQb2ludHNcIn19cmV0dXJuIGJpdHN9LEdyaWRTYW1wbGVyLnNhbXBsZUdyaWR4PWZ1bmN0aW9uKGltYWdlLGRpbWVuc2lvbixwMVRvWCxwMVRvWSxwMlRvWCxwMlRvWSxwM1RvWCxwM1RvWSxwNFRvWCxwNFRvWSxwMUZyb21YLHAxRnJvbVkscDJGcm9tWCxwMkZyb21ZLHAzRnJvbVgscDNGcm9tWSxwNEZyb21YLHA0RnJvbVkpe3ZhciB0cmFuc2Zvcm09UGVyc3BlY3RpdmVUcmFuc2Zvcm0ucXVhZHJpbGF0ZXJhbFRvUXVhZHJpbGF0ZXJhbChwMVRvWCxwMVRvWSxwMlRvWCxwMlRvWSxwM1RvWCxwM1RvWSxwNFRvWCxwNFRvWSxwMUZyb21YLHAxRnJvbVkscDJGcm9tWCxwMkZyb21ZLHAzRnJvbVgscDNGcm9tWSxwNEZyb21YLHA0RnJvbVkpO3JldHVybiBHcmlkU2FtcGxlci5zYW1wbGVHcmlkMyhpbWFnZSxkaW1lbnNpb24sdHJhbnNmb3JtKX0sVmVyc2lvbi5WRVJTSU9OX0RFQ09ERV9JTkZPPW5ldyBBcnJheSgzMTg5MiwzNDIzNiwzOTU3Nyw0MjE5NSw0ODExOCw1MTA0Miw1NTM2Nyw1ODg5Myw2Mzc4NCw2ODQ3Miw3MDc0OSw3NjMxMSw3OTE1NCw4NDM5MCw4NzY4Myw5MjM2MSw5NjIzNiwxMDIwODQsMTAyODgxLDExMDUwNywxMTA3MzQsMTE3Nzg2LDExOTYxNSwxMjYzMjUsMTI3NTY4LDEzMzU4OSwxMzY5NDQsMTQxNDk4LDE0NTMxMSwxNTAyODMsMTUyNjIyLDE1ODMwOCwxNjEwODksMTY3MDE3KSxWZXJzaW9uLlZFUlNJT05TPWJ1aWxkVmVyc2lvbnMoKSxWZXJzaW9uLmdldFZlcnNpb25Gb3JOdW1iZXI9ZnVuY3Rpb24odmVyc2lvbk51bWJlcil7aWYoMT52ZXJzaW9uTnVtYmVyfHx2ZXJzaW9uTnVtYmVyPjQwKXRocm93XCJBcmd1bWVudEV4Y2VwdGlvblwiO3JldHVybiBWZXJzaW9uLlZFUlNJT05TW3ZlcnNpb25OdW1iZXItMV19LFZlcnNpb24uZ2V0UHJvdmlzaW9uYWxWZXJzaW9uRm9yRGltZW5zaW9uPWZ1bmN0aW9uKGRpbWVuc2lvbil7aWYoZGltZW5zaW9uJTQhPTEpdGhyb3dcIkVycm9yIGdldFByb3Zpc2lvbmFsVmVyc2lvbkZvckRpbWVuc2lvblwiO3RyeXtyZXR1cm4gVmVyc2lvbi5nZXRWZXJzaW9uRm9yTnVtYmVyKGRpbWVuc2lvbi0xNz4+Mil9Y2F0Y2goaWFlKXt0aHJvd1wiRXJyb3IgZ2V0VmVyc2lvbkZvck51bWJlclwifX0sVmVyc2lvbi5kZWNvZGVWZXJzaW9uSW5mb3JtYXRpb249ZnVuY3Rpb24odmVyc2lvbkJpdHMpe2Zvcih2YXIgYmVzdERpZmZlcmVuY2U9NDI5NDk2NzI5NSxiZXN0VmVyc2lvbj0wLGk9MDtpPFZlcnNpb24uVkVSU0lPTl9ERUNPREVfSU5GTy5sZW5ndGg7aSsrKXt2YXIgdGFyZ2V0VmVyc2lvbj1WZXJzaW9uLlZFUlNJT05fREVDT0RFX0lORk9baV07aWYodGFyZ2V0VmVyc2lvbj09dmVyc2lvbkJpdHMpcmV0dXJuIHRoaXMuZ2V0VmVyc2lvbkZvck51bWJlcihpKzcpO3ZhciBiaXRzRGlmZmVyZW5jZT1Gb3JtYXRJbmZvcm1hdGlvbi5udW1CaXRzRGlmZmVyaW5nKHZlcnNpb25CaXRzLHRhcmdldFZlcnNpb24pO2Jlc3REaWZmZXJlbmNlPmJpdHNEaWZmZXJlbmNlJiYoYmVzdFZlcnNpb249aSs3LGJlc3REaWZmZXJlbmNlPWJpdHNEaWZmZXJlbmNlKX1yZXR1cm4gMz49YmVzdERpZmZlcmVuY2U/dGhpcy5nZXRWZXJzaW9uRm9yTnVtYmVyKGJlc3RWZXJzaW9uKTpudWxsfSxQZXJzcGVjdGl2ZVRyYW5zZm9ybS5xdWFkcmlsYXRlcmFsVG9RdWFkcmlsYXRlcmFsPWZ1bmN0aW9uKHgwLHkwLHgxLHkxLHgyLHkyLHgzLHkzLHgwcCx5MHAseDFwLHkxcCx4MnAseTJwLHgzcCx5M3Ape3ZhciBxVG9TPXRoaXMucXVhZHJpbGF0ZXJhbFRvU3F1YXJlKHgwLHkwLHgxLHkxLHgyLHkyLHgzLHkzKSxzVG9RPXRoaXMuc3F1YXJlVG9RdWFkcmlsYXRlcmFsKHgwcCx5MHAseDFwLHkxcCx4MnAseTJwLHgzcCx5M3ApO3JldHVybiBzVG9RLnRpbWVzKHFUb1MpfSxQZXJzcGVjdGl2ZVRyYW5zZm9ybS5zcXVhcmVUb1F1YWRyaWxhdGVyYWw9ZnVuY3Rpb24oeDAseTAseDEseTEseDIseTIseDMseTMpe3JldHVybiBkeTI9eTMteTIsZHkzPXkwLXkxK3kyLXkzLDA9PWR5MiYmMD09ZHkzP25ldyBQZXJzcGVjdGl2ZVRyYW5zZm9ybSh4MS14MCx4Mi14MSx4MCx5MS15MCx5Mi15MSx5MCwwLDAsMSk6KGR4MT14MS14MixkeDI9eDMteDIsZHgzPXgwLXgxK3gyLXgzLGR5MT15MS15MixkZW5vbWluYXRvcj1keDEqZHkyLWR4MipkeTEsYTEzPShkeDMqZHkyLWR4MipkeTMpL2Rlbm9taW5hdG9yLGEyMz0oZHgxKmR5My1keDMqZHkxKS9kZW5vbWluYXRvcixuZXcgUGVyc3BlY3RpdmVUcmFuc2Zvcm0oeDEteDArYTEzKngxLHgzLXgwK2EyMyp4Myx4MCx5MS15MCthMTMqeTEseTMteTArYTIzKnkzLHkwLGExMyxhMjMsMSkpfSxQZXJzcGVjdGl2ZVRyYW5zZm9ybS5xdWFkcmlsYXRlcmFsVG9TcXVhcmU9ZnVuY3Rpb24oeDAseTAseDEseTEseDIseTIseDMseTMpe3JldHVybiB0aGlzLnNxdWFyZVRvUXVhZHJpbGF0ZXJhbCh4MCx5MCx4MSx5MSx4Mix5Mix4Myx5MykuYnVpbGRBZGpvaW50KCl9O3ZhciBGT1JNQVRfSU5GT19NQVNLX1FSPTIxNTIyLEZPUk1BVF9JTkZPX0RFQ09ERV9MT09LVVA9bmV3IEFycmF5KG5ldyBBcnJheSgyMTUyMiwwKSxuZXcgQXJyYXkoMjA3NzMsMSksbmV3IEFycmF5KDI0MTg4LDIpLG5ldyBBcnJheSgyMzM3MSwzKSxuZXcgQXJyYXkoMTc5MTMsNCksbmV3IEFycmF5KDE2NTkwLDUpLG5ldyBBcnJheSgyMDM3NSw2KSxuZXcgQXJyYXkoMTkxMDQsNyksbmV3IEFycmF5KDMwNjYwLDgpLG5ldyBBcnJheSgyOTQyNyw5KSxuZXcgQXJyYXkoMzIxNzAsMTApLG5ldyBBcnJheSgzMDg3NywxMSksbmV3IEFycmF5KDI2MTU5LDEyKSxuZXcgQXJyYXkoMjUzNjgsMTMpLG5ldyBBcnJheSgyNzcxMywxNCksbmV3IEFycmF5KDI2OTk4LDE1KSxuZXcgQXJyYXkoNTc2OSwxNiksbmV3IEFycmF5KDUwNTQsMTcpLG5ldyBBcnJheSg3Mzk5LDE4KSxuZXcgQXJyYXkoNjYwOCwxOSksbmV3IEFycmF5KDE4OTAsMjApLG5ldyBBcnJheSg1OTcsMjEpLG5ldyBBcnJheSgzMzQwLDIyKSxuZXcgQXJyYXkoMjEwNywyMyksbmV3IEFycmF5KDEzNjYzLDI0KSxuZXcgQXJyYXkoMTIzOTIsMjUpLG5ldyBBcnJheSgxNjE3NywyNiksbmV3IEFycmF5KDE0ODU0LDI3KSxuZXcgQXJyYXkoOTM5NiwyOCksbmV3IEFycmF5KDg1NzksMjkpLG5ldyBBcnJheSgxMTk5NCwzMCksbmV3IEFycmF5KDExMjQ1LDMxKSksQklUU19TRVRfSU5fSEFMRl9CWVRFPW5ldyBBcnJheSgwLDEsMSwyLDEsMiwyLDMsMSwyLDIsMywyLDMsMyw0KTtGb3JtYXRJbmZvcm1hdGlvbi5udW1CaXRzRGlmZmVyaW5nPWZ1bmN0aW9uKGEsYil7cmV0dXJuIGFePWIsQklUU19TRVRfSU5fSEFMRl9CWVRFWzE1JmFdK0JJVFNfU0VUX0lOX0hBTEZfQllURVsxNSZVUlNoaWZ0KGEsNCldK0JJVFNfU0VUX0lOX0hBTEZfQllURVsxNSZVUlNoaWZ0KGEsOCldK0JJVFNfU0VUX0lOX0hBTEZfQllURVsxNSZVUlNoaWZ0KGEsMTIpXStCSVRTX1NFVF9JTl9IQUxGX0JZVEVbMTUmVVJTaGlmdChhLDE2KV0rQklUU19TRVRfSU5fSEFMRl9CWVRFWzE1JlVSU2hpZnQoYSwyMCldK0JJVFNfU0VUX0lOX0hBTEZfQllURVsxNSZVUlNoaWZ0KGEsMjQpXStCSVRTX1NFVF9JTl9IQUxGX0JZVEVbMTUmVVJTaGlmdChhLDI4KV19LEZvcm1hdEluZm9ybWF0aW9uLmRlY29kZUZvcm1hdEluZm9ybWF0aW9uPWZ1bmN0aW9uKG1hc2tlZEZvcm1hdEluZm8pe3ZhciBmb3JtYXRJbmZvPUZvcm1hdEluZm9ybWF0aW9uLmRvRGVjb2RlRm9ybWF0SW5mb3JtYXRpb24obWFza2VkRm9ybWF0SW5mbyk7cmV0dXJuIG51bGwhPWZvcm1hdEluZm8/Zm9ybWF0SW5mbzpGb3JtYXRJbmZvcm1hdGlvbi5kb0RlY29kZUZvcm1hdEluZm9ybWF0aW9uKG1hc2tlZEZvcm1hdEluZm9eRk9STUFUX0lORk9fTUFTS19RUil9LEZvcm1hdEluZm9ybWF0aW9uLmRvRGVjb2RlRm9ybWF0SW5mb3JtYXRpb249ZnVuY3Rpb24obWFza2VkRm9ybWF0SW5mbyl7Zm9yKHZhciBiZXN0RGlmZmVyZW5jZT00Mjk0OTY3Mjk1LGJlc3RGb3JtYXRJbmZvPTAsaT0wO2k8Rk9STUFUX0lORk9fREVDT0RFX0xPT0tVUC5sZW5ndGg7aSsrKXt2YXIgZGVjb2RlSW5mbz1GT1JNQVRfSU5GT19ERUNPREVfTE9PS1VQW2ldLHRhcmdldEluZm89ZGVjb2RlSW5mb1swXTtpZih0YXJnZXRJbmZvPT1tYXNrZWRGb3JtYXRJbmZvKXJldHVybiBuZXcgRm9ybWF0SW5mb3JtYXRpb24oZGVjb2RlSW5mb1sxXSk7dmFyIGJpdHNEaWZmZXJlbmNlPXRoaXMubnVtQml0c0RpZmZlcmluZyhtYXNrZWRGb3JtYXRJbmZvLHRhcmdldEluZm8pO2Jlc3REaWZmZXJlbmNlPmJpdHNEaWZmZXJlbmNlJiYoYmVzdEZvcm1hdEluZm89ZGVjb2RlSW5mb1sxXSxiZXN0RGlmZmVyZW5jZT1iaXRzRGlmZmVyZW5jZSl9cmV0dXJuIDM+PWJlc3REaWZmZXJlbmNlP25ldyBGb3JtYXRJbmZvcm1hdGlvbihiZXN0Rm9ybWF0SW5mbyk6bnVsbH0sRXJyb3JDb3JyZWN0aW9uTGV2ZWwuZm9yQml0cz1mdW5jdGlvbihiaXRzKXtpZigwPmJpdHN8fGJpdHM+PUZPUl9CSVRTLkxlbmd0aCl0aHJvd1wiQXJndW1lbnRFeGNlcHRpb25cIjtyZXR1cm4gRk9SX0JJVFNbYml0c119O3ZhciBMPW5ldyBFcnJvckNvcnJlY3Rpb25MZXZlbCgwLDEsXCJMXCIpLE09bmV3IEVycm9yQ29ycmVjdGlvbkxldmVsKDEsMCxcIk1cIiksUT1uZXcgRXJyb3JDb3JyZWN0aW9uTGV2ZWwoMiwzLFwiUVwiKSxIPW5ldyBFcnJvckNvcnJlY3Rpb25MZXZlbCgzLDIsXCJIXCIpLEZPUl9CSVRTPW5ldyBBcnJheShNLEwsSCxRKTtEYXRhQmxvY2suZ2V0RGF0YUJsb2Nrcz1mdW5jdGlvbihyYXdDb2Rld29yZHMsdmVyc2lvbixlY0xldmVsKXtpZihyYXdDb2Rld29yZHMubGVuZ3RoIT12ZXJzaW9uLlRvdGFsQ29kZXdvcmRzKXRocm93XCJBcmd1bWVudEV4Y2VwdGlvblwiO2Zvcih2YXIgZWNCbG9ja3M9dmVyc2lvbi5nZXRFQ0Jsb2Nrc0ZvckxldmVsKGVjTGV2ZWwpLHRvdGFsQmxvY2tzPTAsZWNCbG9ja0FycmF5PWVjQmxvY2tzLmdldEVDQmxvY2tzKCksaT0wO2k8ZWNCbG9ja0FycmF5Lmxlbmd0aDtpKyspdG90YWxCbG9ja3MrPWVjQmxvY2tBcnJheVtpXS5Db3VudDtmb3IodmFyIHJlc3VsdD1uZXcgQXJyYXkodG90YWxCbG9ja3MpLG51bVJlc3VsdEJsb2Nrcz0wLGo9MDtqPGVjQmxvY2tBcnJheS5sZW5ndGg7aisrKWZvcih2YXIgZWNCbG9jaz1lY0Jsb2NrQXJyYXlbal0saT0wO2k8ZWNCbG9jay5Db3VudDtpKyspe3ZhciBudW1EYXRhQ29kZXdvcmRzPWVjQmxvY2suRGF0YUNvZGV3b3JkcyxudW1CbG9ja0NvZGV3b3Jkcz1lY0Jsb2Nrcy5FQ0NvZGV3b3Jkc1BlckJsb2NrK251bURhdGFDb2Rld29yZHM7cmVzdWx0W251bVJlc3VsdEJsb2NrcysrXT1uZXcgRGF0YUJsb2NrKG51bURhdGFDb2Rld29yZHMsbmV3IEFycmF5KG51bUJsb2NrQ29kZXdvcmRzKSl9Zm9yKHZhciBzaG9ydGVyQmxvY2tzVG90YWxDb2Rld29yZHM9cmVzdWx0WzBdLmNvZGV3b3Jkcy5sZW5ndGgsbG9uZ2VyQmxvY2tzU3RhcnRBdD1yZXN1bHQubGVuZ3RoLTE7bG9uZ2VyQmxvY2tzU3RhcnRBdD49MDspe3ZhciBudW1Db2Rld29yZHM9cmVzdWx0W2xvbmdlckJsb2Nrc1N0YXJ0QXRdLmNvZGV3b3Jkcy5sZW5ndGg7aWYobnVtQ29kZXdvcmRzPT1zaG9ydGVyQmxvY2tzVG90YWxDb2Rld29yZHMpYnJlYWs7bG9uZ2VyQmxvY2tzU3RhcnRBdC0tfWxvbmdlckJsb2Nrc1N0YXJ0QXQrKztmb3IodmFyIHNob3J0ZXJCbG9ja3NOdW1EYXRhQ29kZXdvcmRzPXNob3J0ZXJCbG9ja3NUb3RhbENvZGV3b3Jkcy1lY0Jsb2Nrcy5FQ0NvZGV3b3Jkc1BlckJsb2NrLHJhd0NvZGV3b3Jkc09mZnNldD0wLGk9MDtzaG9ydGVyQmxvY2tzTnVtRGF0YUNvZGV3b3Jkcz5pO2krKylmb3IodmFyIGo9MDtudW1SZXN1bHRCbG9ja3M+ajtqKyspcmVzdWx0W2pdLmNvZGV3b3Jkc1tpXT1yYXdDb2Rld29yZHNbcmF3Q29kZXdvcmRzT2Zmc2V0KytdO2Zvcih2YXIgaj1sb25nZXJCbG9ja3NTdGFydEF0O251bVJlc3VsdEJsb2Nrcz5qO2orKylyZXN1bHRbal0uY29kZXdvcmRzW3Nob3J0ZXJCbG9ja3NOdW1EYXRhQ29kZXdvcmRzXT1yYXdDb2Rld29yZHNbcmF3Q29kZXdvcmRzT2Zmc2V0KytdO2Zvcih2YXIgbWF4PXJlc3VsdFswXS5jb2Rld29yZHMubGVuZ3RoLGk9c2hvcnRlckJsb2Nrc051bURhdGFDb2Rld29yZHM7bWF4Pmk7aSsrKWZvcih2YXIgaj0wO251bVJlc3VsdEJsb2Nrcz5qO2orKyl7dmFyIGlPZmZzZXQ9bG9uZ2VyQmxvY2tzU3RhcnRBdD5qP2k6aSsxO3Jlc3VsdFtqXS5jb2Rld29yZHNbaU9mZnNldF09cmF3Q29kZXdvcmRzW3Jhd0NvZGV3b3Jkc09mZnNldCsrXX1yZXR1cm4gcmVzdWx0fSxEYXRhTWFzaz17fSxEYXRhTWFzay5mb3JSZWZlcmVuY2U9ZnVuY3Rpb24ocmVmZXJlbmNlKXtpZigwPnJlZmVyZW5jZXx8cmVmZXJlbmNlPjcpdGhyb3dcIlN5c3RlbS5Bcmd1bWVudEV4Y2VwdGlvblwiO3JldHVybiBEYXRhTWFzay5EQVRBX01BU0tTW3JlZmVyZW5jZV19LERhdGFNYXNrLkRBVEFfTUFTS1M9bmV3IEFycmF5KG5ldyBEYXRhTWFzazAwMCxuZXcgRGF0YU1hc2swMDEsbmV3IERhdGFNYXNrMDEwLG5ldyBEYXRhTWFzazAxMSxuZXcgRGF0YU1hc2sxMDAsbmV3IERhdGFNYXNrMTAxLG5ldyBEYXRhTWFzazExMCxuZXcgRGF0YU1hc2sxMTEpLEdGMjU2LlFSX0NPREVfRklFTEQ9bmV3IEdGMjU2KDI4NSksR0YyNTYuREFUQV9NQVRSSVhfRklFTEQ9bmV3IEdGMjU2KDMwMSksR0YyNTYuYWRkT3JTdWJ0cmFjdD1mdW5jdGlvbihhLGIpe3JldHVybiBhXmJ9LERlY29kZXI9e30sRGVjb2Rlci5yc0RlY29kZXI9bmV3IFJlZWRTb2xvbW9uRGVjb2RlcihHRjI1Ni5RUl9DT0RFX0ZJRUxEKSxEZWNvZGVyLmNvcnJlY3RFcnJvcnM9ZnVuY3Rpb24oY29kZXdvcmRCeXRlcyxudW1EYXRhQ29kZXdvcmRzKXtmb3IodmFyIG51bUNvZGV3b3Jkcz1jb2Rld29yZEJ5dGVzLmxlbmd0aCxjb2Rld29yZHNJbnRzPW5ldyBBcnJheShudW1Db2Rld29yZHMpLGk9MDtudW1Db2Rld29yZHM+aTtpKyspY29kZXdvcmRzSW50c1tpXT0yNTUmY29kZXdvcmRCeXRlc1tpXTt2YXIgbnVtRUNDb2Rld29yZHM9Y29kZXdvcmRCeXRlcy5sZW5ndGgtbnVtRGF0YUNvZGV3b3Jkczt0cnl7RGVjb2Rlci5yc0RlY29kZXIuZGVjb2RlKGNvZGV3b3Jkc0ludHMsbnVtRUNDb2Rld29yZHMpfWNhdGNoKHJzZSl7dGhyb3cgcnNlfWZvcih2YXIgaT0wO251bURhdGFDb2Rld29yZHM+aTtpKyspY29kZXdvcmRCeXRlc1tpXT1jb2Rld29yZHNJbnRzW2ldfSxEZWNvZGVyLmRlY29kZT1mdW5jdGlvbihiaXRzKXtmb3IodmFyIHBhcnNlcj1uZXcgQml0TWF0cml4UGFyc2VyKGJpdHMpLHZlcnNpb249cGFyc2VyLnJlYWRWZXJzaW9uKCksZWNMZXZlbD1wYXJzZXIucmVhZEZvcm1hdEluZm9ybWF0aW9uKCkuRXJyb3JDb3JyZWN0aW9uTGV2ZWwsY29kZXdvcmRzPXBhcnNlci5yZWFkQ29kZXdvcmRzKCksZGF0YUJsb2Nrcz1EYXRhQmxvY2suZ2V0RGF0YUJsb2Nrcyhjb2Rld29yZHMsdmVyc2lvbixlY0xldmVsKSx0b3RhbEJ5dGVzPTAsaT0wO2k8ZGF0YUJsb2Nrcy5MZW5ndGg7aSsrKXRvdGFsQnl0ZXMrPWRhdGFCbG9ja3NbaV0uTnVtRGF0YUNvZGV3b3Jkcztmb3IodmFyIHJlc3VsdEJ5dGVzPW5ldyBBcnJheSh0b3RhbEJ5dGVzKSxyZXN1bHRPZmZzZXQ9MCxqPTA7ajxkYXRhQmxvY2tzLmxlbmd0aDtqKyspe3ZhciBkYXRhQmxvY2s9ZGF0YUJsb2Nrc1tqXSxjb2Rld29yZEJ5dGVzPWRhdGFCbG9jay5Db2Rld29yZHMsbnVtRGF0YUNvZGV3b3Jkcz1kYXRhQmxvY2suTnVtRGF0YUNvZGV3b3JkcztEZWNvZGVyLmNvcnJlY3RFcnJvcnMoY29kZXdvcmRCeXRlcyxudW1EYXRhQ29kZXdvcmRzKTtmb3IodmFyIGk9MDtudW1EYXRhQ29kZXdvcmRzPmk7aSsrKXJlc3VsdEJ5dGVzW3Jlc3VsdE9mZnNldCsrXT1jb2Rld29yZEJ5dGVzW2ldfXZhciByZWFkZXI9bmV3IFFSQ29kZURhdGFCbG9ja1JlYWRlcihyZXN1bHRCeXRlcyx2ZXJzaW9uLlZlcnNpb25OdW1iZXIsZWNMZXZlbC5CaXRzKTtyZXR1cm4gcmVhZGVyfSxxcmNvZGU9e30scXJjb2RlLmltYWdlZGF0YT1udWxsLHFyY29kZS53aWR0aD0wLHFyY29kZS5oZWlnaHQ9MCxxcmNvZGUucXJDb2RlU3ltYm9sPW51bGwscXJjb2RlLmRlYnVnPSExLHFyY29kZS5zaXplT2ZEYXRhTGVuZ3RoSW5mbz1bWzEwLDksOCw4XSxbMTIsMTEsMTYsMTBdLFsxNCwxMywxNiwxMl1dLHFyY29kZS5jYWxsYmFjaz1udWxsLHFyY29kZS5kZWNvZGU9ZnVuY3Rpb24oc3JjKXtpZigwPT1hcmd1bWVudHMubGVuZ3RoKXt2YXIgY2FudmFzX3FyPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicXItY2FudmFzXCIpLGNvbnRleHQ9Y2FudmFzX3FyLmdldENvbnRleHQoXCIyZFwiKTtyZXR1cm4gcXJjb2RlLndpZHRoPWNhbnZhc19xci53aWR0aCxxcmNvZGUuaGVpZ2h0PWNhbnZhc19xci5oZWlnaHQscXJjb2RlLmltYWdlZGF0YT1jb250ZXh0LmdldEltYWdlRGF0YSgwLDAscXJjb2RlLndpZHRoLHFyY29kZS5oZWlnaHQpLHFyY29kZS5yZXN1bHQ9cXJjb2RlLnByb2Nlc3MoY29udGV4dCksbnVsbCE9cXJjb2RlLmNhbGxiYWNrJiZxcmNvZGUuY2FsbGJhY2socXJjb2RlLnJlc3VsdCkscXJjb2RlLnJlc3VsdH12YXIgaW1hZ2U9bmV3IEltYWdlO2ltYWdlLm9ubG9hZD1mdW5jdGlvbigpe3ZhciBjYW52YXNfcXI9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKSxjb250ZXh0PWNhbnZhc19xci5nZXRDb250ZXh0KFwiMmRcIiksY2FudmFzX291dD1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm91dC1jYW52YXNcIik7aWYobnVsbCE9Y2FudmFzX291dCl7dmFyIG91dGN0eD1jYW52YXNfb3V0LmdldENvbnRleHQoXCIyZFwiKTtvdXRjdHguY2xlYXJSZWN0KDAsMCwzMjAsMjQwKSxvdXRjdHguZHJhd0ltYWdlKGltYWdlLDAsMCwzMjAsMjQwKX1jYW52YXNfcXIud2lkdGg9aW1hZ2Uud2lkdGgsY2FudmFzX3FyLmhlaWdodD1pbWFnZS5oZWlnaHQsY29udGV4dC5kcmF3SW1hZ2UoaW1hZ2UsMCwwKSxxcmNvZGUud2lkdGg9aW1hZ2Uud2lkdGgscXJjb2RlLmhlaWdodD1pbWFnZS5oZWlnaHQ7dHJ5e3FyY29kZS5pbWFnZWRhdGE9Y29udGV4dC5nZXRJbWFnZURhdGEoMCwwLGltYWdlLndpZHRoLGltYWdlLmhlaWdodCl9Y2F0Y2goZSl7cmV0dXJuIHFyY29kZS5yZXN1bHQ9XCJDcm9zcyBkb21haW4gaW1hZ2UgcmVhZGluZyBub3Qgc3VwcG9ydGVkIGluIHlvdXIgYnJvd3NlciEgU2F2ZSBpdCB0byB5b3VyIGNvbXB1dGVyIHRoZW4gZHJhZyBhbmQgZHJvcCB0aGUgZmlsZSFcIix2b2lkKG51bGwhPXFyY29kZS5jYWxsYmFjayYmcXJjb2RlLmNhbGxiYWNrKHFyY29kZS5yZXN1bHQpKX10cnl7cXJjb2RlLnJlc3VsdD1xcmNvZGUucHJvY2Vzcyhjb250ZXh0KX1jYXRjaChlKXtjb25zb2xlLmxvZyhlKSxxcmNvZGUucmVzdWx0PVwiZXJyb3IgZGVjb2RpbmcgUVIgQ29kZVwifW51bGwhPXFyY29kZS5jYWxsYmFjayYmcXJjb2RlLmNhbGxiYWNrKHFyY29kZS5yZXN1bHQpfSxpbWFnZS5zcmM9c3JjfSxxcmNvZGUuZGVjb2RlX3V0Zjg9ZnVuY3Rpb24ocyl7cmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChlc2NhcGUocykpfSxxcmNvZGUucHJvY2Vzcz1mdW5jdGlvbihjdHgpe3ZhciBzdGFydD0obmV3IERhdGUpLmdldFRpbWUoKSxpbWFnZT1xcmNvZGUuZ3JheVNjYWxlVG9CaXRtYXAocXJjb2RlLmdyYXlzY2FsZSgpKTtpZihxcmNvZGUuZGVidWcpe2Zvcih2YXIgeT0wO3k8cXJjb2RlLmhlaWdodDt5KyspZm9yKHZhciB4PTA7eDxxcmNvZGUud2lkdGg7eCsrKXt2YXIgcG9pbnQ9NCp4K3kqcXJjb2RlLndpZHRoKjQ7cXJjb2RlLmltYWdlZGF0YS5kYXRhW3BvaW50XT0oaW1hZ2VbeCt5KnFyY29kZS53aWR0aF0sMCkscXJjb2RlLmltYWdlZGF0YS5kYXRhW3BvaW50KzFdPShpbWFnZVt4K3kqcXJjb2RlLndpZHRoXSwwKSxxcmNvZGUuaW1hZ2VkYXRhLmRhdGFbcG9pbnQrMl09aW1hZ2VbeCt5KnFyY29kZS53aWR0aF0/MjU1OjB9Y3R4LnB1dEltYWdlRGF0YShxcmNvZGUuaW1hZ2VkYXRhLDAsMCl9dmFyIGRldGVjdG9yPW5ldyBEZXRlY3RvcihpbWFnZSkscVJDb2RlTWF0cml4PWRldGVjdG9yLmRldGVjdCgpO3FyY29kZS5kZWJ1ZyYmY3R4LnB1dEltYWdlRGF0YShxcmNvZGUuaW1hZ2VkYXRhLDAsMCk7Zm9yKHZhciByZWFkZXI9RGVjb2Rlci5kZWNvZGUocVJDb2RlTWF0cml4LmJpdHMpLGRhdGE9cmVhZGVyLkRhdGFCeXRlLHN0cj1cIlwiLGk9MDtpPGRhdGEubGVuZ3RoO2krKylmb3IodmFyIGo9MDtqPGRhdGFbaV0ubGVuZ3RoO2orKylzdHIrPVN0cmluZy5mcm9tQ2hhckNvZGUoZGF0YVtpXVtqXSk7dmFyIGVuZD0obmV3IERhdGUpLmdldFRpbWUoKSx0aW1lPWVuZC1zdGFydDtyZXR1cm4gY29uc29sZS5sb2codGltZSkscXJjb2RlLmRlY29kZV91dGY4KHN0cil9LHFyY29kZS5nZXRQaXhlbD1mdW5jdGlvbih4LHkpe2lmKHFyY29kZS53aWR0aDx4KXRocm93XCJwb2ludCBlcnJvclwiO2lmKHFyY29kZS5oZWlnaHQ8eSl0aHJvd1wicG9pbnQgZXJyb3JcIjtyZXR1cm4gcG9pbnQ9NCp4K3kqcXJjb2RlLndpZHRoKjQscD0oMzMqcXJjb2RlLmltYWdlZGF0YS5kYXRhW3BvaW50XSszNCpxcmNvZGUuaW1hZ2VkYXRhLmRhdGFbcG9pbnQrMV0rMzMqcXJjb2RlLmltYWdlZGF0YS5kYXRhW3BvaW50KzJdKS8xMDAscH0scXJjb2RlLmJpbmFyaXplPWZ1bmN0aW9uKHRoKXtmb3IodmFyIHJldD1uZXcgQXJyYXkocXJjb2RlLndpZHRoKnFyY29kZS5oZWlnaHQpLHk9MDt5PHFyY29kZS5oZWlnaHQ7eSsrKWZvcih2YXIgeD0wO3g8cXJjb2RlLndpZHRoO3grKyl7dmFyIGdyYXk9cXJjb2RlLmdldFBpeGVsKHgseSk7cmV0W3greSpxcmNvZGUud2lkdGhdPXRoPj1ncmF5PyEwOiExfXJldHVybiByZXR9LHFyY29kZS5nZXRNaWRkbGVCcmlnaHRuZXNzUGVyQXJlYT1mdW5jdGlvbihpbWFnZSl7Zm9yKHZhciBudW1TcXJ0QXJlYT00LGFyZWFXaWR0aD1NYXRoLmZsb29yKHFyY29kZS53aWR0aC9udW1TcXJ0QXJlYSksYXJlYUhlaWdodD1NYXRoLmZsb29yKHFyY29kZS5oZWlnaHQvbnVtU3FydEFyZWEpLG1pbm1heD1uZXcgQXJyYXkobnVtU3FydEFyZWEpLGk9MDtudW1TcXJ0QXJlYT5pO2krKyl7bWlubWF4W2ldPW5ldyBBcnJheShudW1TcXJ0QXJlYSk7Zm9yKHZhciBpMj0wO251bVNxcnRBcmVhPmkyO2kyKyspbWlubWF4W2ldW2kyXT1uZXcgQXJyYXkoMCwwKX1mb3IodmFyIGF5PTA7bnVtU3FydEFyZWE+YXk7YXkrKylmb3IodmFyIGF4PTA7bnVtU3FydEFyZWE+YXg7YXgrKyl7bWlubWF4W2F4XVtheV1bMF09MjU1O2Zvcih2YXIgZHk9MDthcmVhSGVpZ2h0PmR5O2R5KyspZm9yKHZhciBkeD0wO2FyZWFXaWR0aD5keDtkeCsrKXt2YXIgdGFyZ2V0PWltYWdlW2FyZWFXaWR0aCpheCtkeCsoYXJlYUhlaWdodCpheStkeSkqcXJjb2RlLndpZHRoXTt0YXJnZXQ8bWlubWF4W2F4XVtheV1bMF0mJihtaW5tYXhbYXhdW2F5XVswXT10YXJnZXQpLHRhcmdldD5taW5tYXhbYXhdW2F5XVsxXSYmKG1pbm1heFtheF1bYXldWzFdPXRhcmdldCl9fWZvcih2YXIgbWlkZGxlPW5ldyBBcnJheShudW1TcXJ0QXJlYSksaTM9MDtudW1TcXJ0QXJlYT5pMztpMysrKW1pZGRsZVtpM109bmV3IEFycmF5KG51bVNxcnRBcmVhKTtmb3IodmFyIGF5PTA7bnVtU3FydEFyZWE+YXk7YXkrKylmb3IodmFyIGF4PTA7bnVtU3FydEFyZWE+YXg7YXgrKyltaWRkbGVbYXhdW2F5XT1NYXRoLmZsb29yKChtaW5tYXhbYXhdW2F5XVswXSttaW5tYXhbYXhdW2F5XVsxXSkvMik7cmV0dXJuIG1pZGRsZX0scXJjb2RlLmdyYXlTY2FsZVRvQml0bWFwPWZ1bmN0aW9uKGdyYXlTY2FsZSl7Zm9yKHZhciBtaWRkbGU9cXJjb2RlLmdldE1pZGRsZUJyaWdodG5lc3NQZXJBcmVhKGdyYXlTY2FsZSksc3FydE51bUFyZWE9bWlkZGxlLmxlbmd0aCxhcmVhV2lkdGg9TWF0aC5mbG9vcihxcmNvZGUud2lkdGgvc3FydE51bUFyZWEpLGFyZWFIZWlnaHQ9TWF0aC5mbG9vcihxcmNvZGUuaGVpZ2h0L3NxcnROdW1BcmVhKSxiaXRtYXA9bmV3IEFycmF5KHFyY29kZS5oZWlnaHQqcXJjb2RlLndpZHRoKSxheT0wO3NxcnROdW1BcmVhPmF5O2F5KyspZm9yKHZhciBheD0wO3NxcnROdW1BcmVhPmF4O2F4KyspZm9yKHZhciBkeT0wO2FyZWFIZWlnaHQ+ZHk7ZHkrKylmb3IodmFyIGR4PTA7YXJlYVdpZHRoPmR4O2R4KyspYml0bWFwW2FyZWFXaWR0aCpheCtkeCsoYXJlYUhlaWdodCpheStkeSkqcXJjb2RlLndpZHRoXT1ncmF5U2NhbGVbYXJlYVdpZHRoKmF4K2R4KyhhcmVhSGVpZ2h0KmF5K2R5KSpxcmNvZGUud2lkdGhdPG1pZGRsZVtheF1bYXldPyEwOiExO1xyXG4gICAgcmV0dXJuIGJpdG1hcH0scXJjb2RlLmdyYXlzY2FsZT1mdW5jdGlvbigpe2Zvcih2YXIgcmV0PW5ldyBBcnJheShxcmNvZGUud2lkdGgqcXJjb2RlLmhlaWdodCkseT0wO3k8cXJjb2RlLmhlaWdodDt5KyspZm9yKHZhciB4PTA7eDxxcmNvZGUud2lkdGg7eCsrKXt2YXIgZ3JheT1xcmNvZGUuZ2V0UGl4ZWwoeCx5KTtyZXRbeCt5KnFyY29kZS53aWR0aF09Z3JheX1yZXR1cm4gcmV0fSxBcnJheS5wcm90b3R5cGUucmVtb3ZlPWZ1bmN0aW9uKGZyb20sdG8pe3ZhciByZXN0PXRoaXMuc2xpY2UoKHRvfHxmcm9tKSsxfHx0aGlzLmxlbmd0aCk7cmV0dXJuIHRoaXMubGVuZ3RoPTA+ZnJvbT90aGlzLmxlbmd0aCtmcm9tOmZyb20sdGhpcy5wdXNoLmFwcGx5KHRoaXMscmVzdCl9O3ZhciBNSU5fU0tJUD0zLE1BWF9NT0RVTEVTPTU3LElOVEVHRVJfTUFUSF9TSElGVD04LENFTlRFUl9RVU9SVU09MjtxcmNvZGUub3JkZXJCZXN0UGF0dGVybnM9ZnVuY3Rpb24ocGF0dGVybnMpe2Z1bmN0aW9uIGRpc3RhbmNlKHBhdHRlcm4xLHBhdHRlcm4yKXtyZXR1cm4geERpZmY9cGF0dGVybjEuWC1wYXR0ZXJuMi5YLHlEaWZmPXBhdHRlcm4xLlktcGF0dGVybjIuWSxNYXRoLnNxcnQoeERpZmYqeERpZmYreURpZmYqeURpZmYpfWZ1bmN0aW9uIGNyb3NzUHJvZHVjdFoocG9pbnRBLHBvaW50Qixwb2ludEMpe3ZhciBiWD1wb2ludEIueCxiWT1wb2ludEIueTtyZXR1cm4ocG9pbnRDLngtYlgpKihwb2ludEEueS1iWSktKHBvaW50Qy55LWJZKSoocG9pbnRBLngtYlgpfXZhciBwb2ludEEscG9pbnRCLHBvaW50Qyx6ZXJvT25lRGlzdGFuY2U9ZGlzdGFuY2UocGF0dGVybnNbMF0scGF0dGVybnNbMV0pLG9uZVR3b0Rpc3RhbmNlPWRpc3RhbmNlKHBhdHRlcm5zWzFdLHBhdHRlcm5zWzJdKSx6ZXJvVHdvRGlzdGFuY2U9ZGlzdGFuY2UocGF0dGVybnNbMF0scGF0dGVybnNbMl0pO2lmKG9uZVR3b0Rpc3RhbmNlPj16ZXJvT25lRGlzdGFuY2UmJm9uZVR3b0Rpc3RhbmNlPj16ZXJvVHdvRGlzdGFuY2U/KHBvaW50Qj1wYXR0ZXJuc1swXSxwb2ludEE9cGF0dGVybnNbMV0scG9pbnRDPXBhdHRlcm5zWzJdKTp6ZXJvVHdvRGlzdGFuY2U+PW9uZVR3b0Rpc3RhbmNlJiZ6ZXJvVHdvRGlzdGFuY2U+PXplcm9PbmVEaXN0YW5jZT8ocG9pbnRCPXBhdHRlcm5zWzFdLHBvaW50QT1wYXR0ZXJuc1swXSxwb2ludEM9cGF0dGVybnNbMl0pOihwb2ludEI9cGF0dGVybnNbMl0scG9pbnRBPXBhdHRlcm5zWzBdLHBvaW50Qz1wYXR0ZXJuc1sxXSksY3Jvc3NQcm9kdWN0Wihwb2ludEEscG9pbnRCLHBvaW50Qyk8MCl7dmFyIHRlbXA9cG9pbnRBO3BvaW50QT1wb2ludEMscG9pbnRDPXRlbXB9cGF0dGVybnNbMF09cG9pbnRBLHBhdHRlcm5zWzFdPXBvaW50QixwYXR0ZXJuc1syXT1wb2ludEN9OyIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5jb250cm9sbGVyKCdhZG1pbkNoYWxsZW5nZUN0cmwnLFtcclxuICAgICckc2NvcGUnLFxyXG4gICAgJyRodHRwJyxcclxuICAgICdjaGFsbGVuZ2UnLFxyXG4gICAgJ0NoYWxsZW5nZVNlcnZpY2UnLFxyXG4gICAgZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCwgY2hhbGxlbmdlLCBDaGFsbGVuZ2VTZXJ2aWNlKXtcclxuICAgICAgJHNjb3BlLnNlbGVjdGVkY2hhbGxlbmdlID0gY2hhbGxlbmdlLmRhdGE7XHJcbiAgICAgIFxyXG4gICAgICBDaGFsbGVuZ2VTZXJ2aWNlLmdldEFuc3dlcihjaGFsbGVuZ2UuZGF0YS5faWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICRzY29wZS5zZWxlY3RlZGNoYWxsZW5nZS5hbnN3ZXIgPSByZXNwb25zZS5kYXRhLmFuc3dlcjtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAkc2NvcGUudG9nZ2xlUGFzc3dvcmQgPSBmdW5jdGlvbiAoKSB7ICRzY29wZS50eXBlUGFzc3dvcmQgPSAhJHNjb3BlLnR5cGVQYXNzd29yZDsgfTtcclxuXHJcblxyXG4gICAgICAkc2NvcGUudXBkYXRlQ2hhbGxlbmdlID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBDaGFsbGVuZ2VTZXJ2aWNlXHJcbiAgICAgICAgICAudXBkYXRlKCRzY29wZS5zZWxlY3RlZGNoYWxsZW5nZS5faWQsICRzY29wZS5zZWxlY3RlZGNoYWxsZW5nZSlcclxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgJHNlbGVjdGVkY2hhbGxlbmdlID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgc3dhbChcIlVwZGF0ZWQhXCIsIFwiQ2hhbGxlbmdlIHVwZGF0ZWQuXCIsIFwic3VjY2Vzc1wiKTtcclxuICAgICAgICAgIH0sIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgc3dhbChcIk9vcHMsIHlvdSBmb3Jnb3Qgc29tZXRoaW5nLlwiKTtcclxuICAgICAgICAgIH0pOyAgXHJcbiAgICAgIH07XHJcblxyXG4gICAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZShcInJlZ1wiKS5jb250cm9sbGVyKFwiYWRtaW5DaGFsbGVuZ2VzQ3RybFwiLCBbXHJcbiAgXCIkc2NvcGVcIixcclxuICBcIiRzdGF0ZVwiLFxyXG4gIFwiJHN0YXRlUGFyYW1zXCIsXHJcbiAgXCJDaGFsbGVuZ2VTZXJ2aWNlXCIsXHJcbiAgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgQ2hhbGxlbmdlU2VydmljZSkge1xyXG5cclxuICAgICRzY29wZS5jaGFsbGVuZ2VzID0gW107XHJcblxyXG4gICAgLy8gU2VtYW50aWMtVUkgbW92ZXMgbW9kYWwgY29udGVudCBpbnRvIGEgZGltbWVyIGF0IHRoZSB0b3AgbGV2ZWwuXHJcbiAgICAvLyBXaGlsZSB0aGlzIGlzIHVzdWFsbHkgbmljZSwgaXQgbWVhbnMgdGhhdCB3aXRoIG91ciByb3V0aW5nIHdpbGwgZ2VuZXJhdGVcclxuICAgIC8vIG11bHRpcGxlIG1vZGFscyBpZiB5b3UgY2hhbmdlIHN0YXRlLiBLaWxsIHRoZSB0b3AgbGV2ZWwgZGltbWVyIG5vZGUgb24gaW5pdGlhbCBsb2FkXHJcbiAgICAvLyB0byBwcmV2ZW50IHRoaXMuXHJcbiAgICAkKFwiLnVpLmRpbW1lclwiKS5yZW1vdmUoKTtcclxuICAgIC8vIFBvcHVsYXRlIHRoZSBzaXplIG9mIHRoZSBtb2RhbCBmb3Igd2hlbiBpdCBhcHBlYXJzLCB3aXRoIGFuIGFyYml0cmFyeSBDaGFsbGVuZ2UuXHJcblxyXG4gICAgZnVuY3Rpb24gcmVmcmVzaFBhZ2UoKSB7XHJcbiAgICAgIENoYWxsZW5nZVNlcnZpY2UuZ2V0QWxsKCkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgJHNjb3BlLmNoYWxsZW5nZXMgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZWZyZXNoUGFnZSgpO1xyXG5cclxuICAgICRzY29wZS5nb0NoYWxsZW5nZSA9IGZ1bmN0aW9uKCRldmVudCwgY2hhbGxlbmdlKSB7XHJcblxyXG4gICAgICAkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICRzdGF0ZS5nbyhcImFwcC5hZG1pbi5jaGFsbGVuZ2VcIiwge1xyXG4gICAgICAgIGlkOiBjaGFsbGVuZ2UuX2lkXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS5jcmVhdGVDaGFsbGVuZ2UgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgIHN3YWwoXCJXcml0ZSB0aGUgY2hhbGxlbmdlIHRpdGxlOlwiLCB7XHJcbiAgICAgICAgYnV0dG9uczoge2NhbmNlbDoge3RleHQ6IFwiQ2FuY2VsXCIsdmFsdWU6IG51bGwsdmlzaWJsZTogdHJ1ZX0sIHllczoge3RleHQ6IFwiTmV4dCBpbnB1dFwiLHZhbHVlOiB0cnVlLHZpc2libGU6IHRydWV9IH0sXHJcbiAgICAgICAgY29udGVudDoge2VsZW1lbnQ6IFwiaW5wdXRcIiwgYXR0cmlidXRlczoge3BsYWNlaG9sZGVyOiBcIkdpdmUgdGhpcyBjaGFsbGVuZ2UgYSBzZXh5IG5hbWUuLlwiLHR5cGU6IFwidGV4dFwifSB9LFxyXG4gICAgICB9KVxyXG4gICAgICAudGhlbigodGl0bGUpID0+IHsgaWYgKCF0aXRsZSkge3JldHVybjt9XHJcbiAgICAgICAgc3dhbChcIkVudGVyIHRoZSBjaGFsbGVuZ2UgZGVzY3JpcHRpb246XCIsIHtcclxuICAgICAgICAgIGJ1dHRvbnM6IHtjYW5jZWw6IHt0ZXh0OiBcIkNhbmNlbFwiLHZhbHVlOiBudWxsLHZpc2libGU6IHRydWV9LCB5ZXM6IHt0ZXh0OiBcIk5leHQgaW5wdXRcIix2YWx1ZTogdHJ1ZSx2aXNpYmxlOiB0cnVlfSB9LFxyXG4gICAgICAgICAgY29udGVudDoge2VsZW1lbnQ6IFwiaW5wdXRcIiwgYXR0cmlidXRlczoge3BsYWNlaG9sZGVyOiBcIkRlc2NyaWJlIHRoaXMgY2hhbGxlbmdlIHNvIHRoYXQgcGVvcGxlIGNhbiBnZXQgdGhlIGlkZWEuLlwiLHR5cGU6IFwidGV4dFwifSB9LFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAudGhlbigoZGVzY3JpcHRpb24pID0+IHsgaWYgKCFkZXNjcmlwdGlvbikge3JldHVybjt9XHJcbiAgICAgICAgICBzd2FsKFwiRW50ZXIgdGhlIGNoYWxsZW5nZSBkZXBlbmRlbmN5IChMSU5LKTpcIiwge1xyXG4gICAgICAgICAgICBidXR0b25zOiB7Y2FuY2VsOiB7dGV4dDogXCJDYW5jZWxcIix2YWx1ZTogbnVsbCx2aXNpYmxlOiB0cnVlfSwgeWVzOiB7dGV4dDogXCJOZXh0IGlucHV0XCIsdmFsdWU6IHRydWUsdmlzaWJsZTogdHJ1ZX0gfSxcclxuICAgICAgICAgICAgY29udGVudDoge2VsZW1lbnQ6IFwiaW5wdXRcIiwgYXR0cmlidXRlczoge3BsYWNlaG9sZGVyOiBcImh0dHA6Ly93d3cuZXhhbXBsZS5jb20vQ2hhbGxlbmdlNDIuemlwXCIsdHlwZTogXCJ0ZXh0XCJ9IH0sXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAudGhlbigoZGVwZW5kZW5jeSkgPT4geyBpZiAoIWRlcGVuZGVuY3kpIHtyZXR1cm47fVxyXG4gICAgICAgICAgICBzd2FsKFwiRW50ZXIgdGhlIGFuc3dlcjpcIiwge1xyXG4gICAgICAgICAgICAgIGJ1dHRvbnM6IHtjYW5jZWw6IHt0ZXh0OiBcIkNhbmNlbFwiLHZhbHVlOiBudWxsLHZpc2libGU6IHRydWV9LCB5ZXM6IHt0ZXh0OiBcIk5leHQgaW5wdXRcIix2YWx1ZTogdHJ1ZSx2aXNpYmxlOiB0cnVlfSB9LFxyXG4gICAgICAgICAgICAgIGNvbnRlbnQ6IHtlbGVtZW50OiBcImlucHV0XCIsIGF0dHJpYnV0ZXM6IHtwbGFjZWhvbGRlcjogXCJzaGhoaCB0aGlzIHNpIHN1cGVyIHNlY3JldCBicm9cIix0eXBlOiBcInRleHRcIn0gfSxcclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbigoYW5zd2VyKSA9PiB7IGlmICghYW5zd2VyKSB7cmV0dXJuO31cclxuICAgICAgICAgICAgICBzd2FsKFwiRW50ZXIgdGhlIG51bWJlciBvZiBwb2ludHMgZm9yIHRoaXMgY2hhbGxlbmdlOlwiLCB7XHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiB7Y2FuY2VsOiB7dGV4dDogXCJDYW5jZWxcIix2YWx1ZTogbnVsbCx2aXNpYmxlOiB0cnVlfSwgeWVzOiB7dGV4dDogXCJOZXh0IGlucHV0XCIsdmFsdWU6IHRydWUsdmlzaWJsZTogdHJ1ZX0gfSxcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IHtlbGVtZW50OiBcImlucHV0XCIsIGF0dHJpYnV0ZXM6IHtwbGFjZWhvbGRlcjogXCJQb2ludHMgYXdhcmRlZCB0byBjaGFsbGVuZ2Ugc29sdmVyc1wiLHR5cGU6IFwibnVtYmVyXCJ9IH0sXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgIC50aGVuKChwb2ludHMpID0+IHsgaWYgKCFwb2ludHMpIHtyZXR1cm47fVxyXG4gIFxyXG4gICAgICAgICAgICAgICAgY0RhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgIHRpdGxlOnRpdGxlLFxyXG4gICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjpkZXNjcmlwdGlvbixcclxuICAgICAgICAgICAgICAgICAgZGVwZW5kZW5jeTpkZXBlbmRlbmN5LFxyXG4gICAgICAgICAgICAgICAgICBhbnN3ZXI6YW5zd2VyLFxyXG4gICAgICAgICAgICAgICAgICBwb2ludHM6cG9pbnRzLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgQ2hhbGxlbmdlU2VydmljZS5jcmVhdGUoY0RhdGEpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZWZyZXNoUGFnZSgpO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgICAgXHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5yZW1vdmVDaGFsbGVuZ2UgPSBmdW5jdGlvbigkZXZlbnQsIGNoYWxsZW5nZSwgaW5kZXgpIHtcclxuICAgICAgJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBzd2FsKHtcclxuICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgdGV4dDogXCJDYW5jZWxcIixcclxuICAgICAgICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBhY2NlcHQ6IHtcclxuICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcclxuICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgIHRleHQ6IFwiWWVzLCByZW1vdmUgdGhlbVwiLFxyXG4gICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGFuZ2VyTW9kZTogdHJ1ZSxcclxuICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcclxuICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gcmVtb3ZlIFwiICsgY2hhbGxlbmdlLnRpdGxlICsgXCIhXCIsXHJcbiAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIlxyXG4gICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzd2FsKHtcclxuICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgY2FuY2VsOiB7XHJcbiAgICAgICAgICAgICAgdGV4dDogXCJDYW5jZWxcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHllczoge1xyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgdGV4dDogXCJZZXMsIHJlbW92ZSB0aGlzIGNoYWxsZW5nZVwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGRhbmdlck1vZGU6IHRydWUsXHJcbiAgICAgICAgICB0aXRsZTogXCJBcmUgeW91IHN1cmU/XCIsXHJcbiAgICAgICAgICB0ZXh0OiBcIlJlbWVtYmVyLCB0aGlzIHBvd2VyIGlzIGEgcHJpdmlsZWdlLlwiLFxyXG4gICAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCJcclxuICAgICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIENoYWxsZW5nZVNlcnZpY2UucmVtb3ZlKGNoYWxsZW5nZS5faWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAkc2NvcGUuY2hhbGxlbmdlc1tpbmRleF0gPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgICAgIFwiUmVtb3ZlZFwiLFxyXG4gICAgICAgICAgICAgIHJlc3BvbnNlLmRhdGEudGl0bGUgKyBcIiBoYXMgYmVlbiByZW1vdmVkLlwiLFxyXG4gICAgICAgICAgICAgIFwic3VjY2Vzc1wiXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHJlZnJlc2hQYWdlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgfVxyXG5dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoXCJyZWdcIikuY29udHJvbGxlcihcIkFkbWluTWFpbEN0cmxcIiwgW1xyXG4gIFwiJHNjb3BlXCIsXHJcbiAgXCIkc3RhdGVcIixcclxuICBcIiRzdGF0ZVBhcmFtc1wiLFxyXG4gIFwiVXNlclNlcnZpY2VcIixcclxuICBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCBVc2VyU2VydmljZSkge1xyXG4gICAgJHNjb3BlLnBhZ2VzID0gW107XHJcbiAgICAkc2NvcGUudXNlcnMgPSBbXTtcclxuXHJcbiAgICAvLyBTZW1hbnRpYy1VSSBtb3ZlcyBtb2RhbCBjb250ZW50IGludG8gYSBkaW1tZXIgYXQgdGhlIHRvcCBsZXZlbC5cclxuICAgIC8vIFdoaWxlIHRoaXMgaXMgdXN1YWxseSBuaWNlLCBpdCBtZWFucyB0aGF0IHdpdGggb3VyIHJvdXRpbmcgd2lsbCBnZW5lcmF0ZVxyXG4gICAgLy8gbXVsdGlwbGUgbW9kYWxzIGlmIHlvdSBjaGFuZ2Ugc3RhdGUuIEtpbGwgdGhlIHRvcCBsZXZlbCBkaW1tZXIgbm9kZSBvbiBpbml0aWFsIGxvYWRcclxuICAgIC8vIHRvIHByZXZlbnQgdGhpcy5cclxuICAgICQoXCIudWkuZGltbWVyXCIpLnJlbW92ZSgpO1xyXG4gICAgLy8gUG9wdWxhdGUgdGhlIHNpemUgb2YgdGhlIG1vZGFsIGZvciB3aGVuIGl0IGFwcGVhcnMsIHdpdGggYW4gYXJiaXRyYXJ5IHVzZXIuXHJcblxyXG5cclxuXHJcbiAgICBVc2VyU2VydmljZS5nZXRQYWdlKCRzdGF0ZVBhcmFtcy5wYWdlLCAkc3RhdGVQYXJhbXMuc2l6ZSwgJHN0YXRlUGFyYW1zLnF1ZXJ5LCAkc2NvcGUuc3RhdHVzRmlsdGVycylcclxuICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgJHNjb3BlLnVzZXJzPSByZXNwb25zZS5kYXRhLnVzZXJzO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJHNjb3BlLnNlbmRFbWFpbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgZmlsdGVyZWRVc2VycyA9ICRzY29wZS51c2Vycy5maWx0ZXIoXHJcbiAgICAgICAgdSA9PiB1LnZlcmlmaWVkXHJcbiAgICApO1xyXG5cclxuICAgICAgaWYgKCRzY29wZS5zdGF0dXNGaWx0ZXJzLmNvbXBsZXRlZFByb2ZpbGUpIHtcclxuICAgICAgICBmaWx0ZXJlZFVzZXJzID0gZmlsdGVyZWRVc2Vycy5maWx0ZXIoXHJcbiAgICAgICAgICB1ID0+IHUuc3RhdHVzLmNvbXBsZXRlZFByb2ZpbGVcclxuICAgICAgKX1cclxuXHJcbiAgICAgIGlmICgkc2NvcGUuc3RhdHVzRmlsdGVycy5hZG1pdHRlZCkge1xyXG4gICAgICAgIGZpbHRlcmVkVXNlcnMgPSBmaWx0ZXJlZFVzZXJzLmZpbHRlcihcclxuICAgICAgICAgIHUgPT4gdS5zdGF0dXMuYWRtaXR0ZWRcclxuICAgICAgKX1cclxuXHJcbiAgICAgIGlmICgkc2NvcGUuc3RhdHVzRmlsdGVycy5jb25maXJtZWQpIHtcclxuICAgICAgICBmaWx0ZXJlZFVzZXJzID0gZmlsdGVyZWRVc2Vycy5maWx0ZXIoXHJcbiAgICAgICAgICB1ID0+IHUuc3RhdHVzLmNvbmZpcm1lZFxyXG4gICAgICApfVxyXG5cclxuICAgICAgaWYgKCRzY29wZS5zdGF0dXNGaWx0ZXJzLmRlY2xpbmVkKSB7XHJcbiAgICAgICAgZmlsdGVyZWRVc2VycyA9IGZpbHRlcmVkVXNlcnMuZmlsdGVyKFxyXG4gICAgICAgICAgdSA9PiB1LnN0YXR1cy5kZWNsaW5lZFxyXG4gICAgICApfVxyXG5cclxuICAgICAgaWYgKCRzY29wZS5zdGF0dXNGaWx0ZXJzLmNoZWNrZWRJbikge1xyXG4gICAgICAgIGZpbHRlcmVkVXNlcnMgPSBmaWx0ZXJlZFVzZXJzLmZpbHRlcihcclxuICAgICAgICAgIHUgPT4gdS5zdGF0dXMuY2hlY2tlZEluXHJcbiAgICAgICl9XHJcblxyXG4gICAgICB2YXIgbWVzc2FnZSA9ICQodGhpcykuZGF0YShcImNvbmZpcm1cIik7XHJcblxyXG4gICAgICBzd2FsKHtcclxuICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxyXG4gICAgICAgIHRleHQ6IGBZb3UncmUgYWJvdXQgdG8gc2VuZCB0aGlzIGVtYWlsIHRvICR7XHJcbiAgICAgICAgICBmaWx0ZXJlZFVzZXJzLmxlbmd0aFxyXG4gICAgICAgIH0gc2VsZWN0ZWQgdXNlcihzKS5gLFxyXG4gICAgICAgIGljb246IFwid2FybmluZ1wiLFxyXG4gICAgICAgIGJ1dHRvbnM6IFtcIkNhbmNlbFwiLCBcIlllcywgc2VuZCB0aGUgZW1haWxzXCJdLFxyXG4gICAgICAgIGRhbmdlck1vZGU6IHRydWVcclxuICAgICAgfSkudGhlbih3aWxsU2VuZCA9PiB7XHJcbiAgICAgICAgZW1haWwgPSB7IHN1YmplY3Q6JHNjb3BlLnN1YmplY3QgLCB0aXRsZTokc2NvcGUudGl0bGUsIGJvZHk6JHNjb3BlLmJvZHkgfVxyXG5cclxuICAgICAgICBpZiAod2lsbFNlbmQpIHtcclxuICAgICAgICAgIGlmIChmaWx0ZXJlZFVzZXJzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBmaWx0ZXJlZFVzZXJzLmZvckVhY2godXNlciA9PiB7XHJcbiAgICAgICAgICAgICAgVXNlclNlcnZpY2Uuc2VuZEJhc2ljTWFpbCh1c2VyLmlkLGVtYWlsKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgICAgXCJTZW5kaW5nIVwiLFxyXG4gICAgICAgICAgICAgIGBTZW5kaW5nIGVtYWlscyB0byAke1xyXG4gICAgICAgICAgICAgICAgZmlsdGVyZWRVc2Vycy5sZW5ndGhcclxuICAgICAgICAgICAgICB9IHVzZXJzIWAsXHJcbiAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHN3YWwoXCJXaG9vcHNcIiwgXCJZb3UgY2FuJ3Qgc2VuZCBvciBhY2NlcHQgMCB1c2VycyFcIiwgXCJlcnJvclwiKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgfVxyXG5dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoXCJyZWdcIikuY29udHJvbGxlcihcImFkbWluTWFya2V0aW5nQ3RybFwiLCBbXHJcbiAgXCIkc2NvcGVcIixcclxuICBcIiRzdGF0ZVwiLFxyXG4gIFwiJHN0YXRlUGFyYW1zXCIsXHJcbiAgXCJNYXJrZXRpbmdTZXJ2aWNlXCIsXHJcbiAgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgTWFya2V0aW5nU2VydmljZSkge1xyXG5cclxuICAgIC8vIFNlbWFudGljLVVJIG1vdmVzIG1vZGFsIGNvbnRlbnQgaW50byBhIGRpbW1lciBhdCB0aGUgdG9wIGxldmVsLlxyXG4gICAgLy8gV2hpbGUgdGhpcyBpcyB1c3VhbGx5IG5pY2UsIGl0IG1lYW5zIHRoYXQgd2l0aCBvdXIgcm91dGluZyB3aWxsIGdlbmVyYXRlXHJcbiAgICAvLyBtdWx0aXBsZSBtb2RhbHMgaWYgeW91IGNoYW5nZSBzdGF0ZS4gS2lsbCB0aGUgdG9wIGxldmVsIGRpbW1lciBub2RlIG9uIGluaXRpYWwgbG9hZFxyXG4gICAgLy8gdG8gcHJldmVudCB0aGlzLlxyXG4gICAgJChcIi51aS5kaW1tZXJcIikucmVtb3ZlKCk7XHJcbiAgICAvLyBQb3B1bGF0ZSB0aGUgc2l6ZSBvZiB0aGUgbW9kYWwgZm9yIHdoZW4gaXQgYXBwZWFycywgd2l0aCBhbiBhcmJpdHJhcnkgdXNlci5cclxuXHJcblxyXG5cclxuXHJcbiAgICAkc2NvcGUuY3JlYXRlVGVhbXMgPSBmdW5jdGlvbigpe1xyXG5cclxuICAgICAgaWYgKCRzY29wZS5ib2R5ICYmICRzY29wZS5ldmVudCl7XHJcbiAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxyXG4gICAgICAgICAgdGV4dDogYFlvdSdyZSBhYm91dCB0byBhZGQgdGhlc2UgdGVhbXMgZW1haWxzIHRvIHRoZSBtYXJrZXRpbmcgZGF0YWJhc2VgLFxyXG4gICAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgICBidXR0b25zOiBbXCJDYW5jZWxcIiwgXCJZZXMsIEFkZCB0ZWFtc1wiXSxcclxuICAgICAgICAgIGRhbmdlck1vZGU6IHRydWVcclxuICAgICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICB2YXIgdGVhbXMgPSAkc2NvcGUuYm9keS5zcGxpdCgnOycpO1xyXG4gICAgICAgICAgICB0ZWFtcy5mb3JFYWNoKHRlYW0gPT4ge1xyXG4gICAgICAgICAgICAgIHRlYW1EYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgZXZlbnQ6JHNjb3BlLmV2ZW50LFxyXG4gICAgICAgICAgICAgICAgbWVtYmVyczp0ZWFtLnJlcGxhY2UoJyAnLCcnKS5zcGxpdCgnLCcpXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIE1hcmtldGluZ1NlcnZpY2UuY3JlYXRlVGVhbSh0ZWFtRGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBzd2FsKFwiQWRkZWRcIiwgXCJUZWFtcyBhZGRlZCB0byBkYXRhYmFzZS5cIiwgXCJzdWNjZXNzXCIpO1xyXG4gICAgICAgICAgICAkc2NvcGUuYm9keT1cIlwiXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgc3dhbChcIkVSUk9SIVwiLCBcIkFsbCBmaWVsZHMgYXJlIHJlcXVpcmVkLlwiLCBcImVycm9yXCIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIFxyXG4gIH1cclxuXSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5jb250cm9sbGVyKCdBZG1pblNldHRpbmdzQ3RybCcsIFtcclxuICAgICckc2NvcGUnLFxyXG4gICAgJyRzY2UnLFxyXG4gICAgJ1NldHRpbmdzU2VydmljZScsXHJcbiAgICAnVXNlclNlcnZpY2UnLFxyXG4gICAgZnVuY3Rpb24oJHNjb3BlLCAkc2NlLCBTZXR0aW5nc1NlcnZpY2UsVXNlclNlcnZpY2Upe1xyXG5cclxuICAgICAgJHNjb3BlLnNldHRpbmdzID0ge307XHJcbiAgICAgIFNldHRpbmdzU2VydmljZVxyXG4gICAgICAgIC5nZXRQdWJsaWNTZXR0aW5ncygpXHJcbiAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgdXBkYXRlU2V0dGluZ3MocmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICBmdW5jdGlvbiB1cGRhdGVTZXR0aW5ncyhzZXR0aW5ncyl7XHJcbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgLy8gRm9ybWF0IHRoZSBkYXRlcyBpbiBzZXR0aW5ncy5cclxuICAgICAgICBzZXR0aW5ncy50aW1lT3BlbiA9IG5ldyBEYXRlKHNldHRpbmdzLnRpbWVPcGVuKTtcclxuICAgICAgICBzZXR0aW5ncy50aW1lQ2xvc2UgPSBuZXcgRGF0ZShzZXR0aW5ncy50aW1lQ2xvc2UpO1xyXG4gICAgICAgIHNldHRpbmdzLnRpbWVDb25maXJtID0gbmV3IERhdGUoc2V0dGluZ3MudGltZUNvbmZpcm0pO1xyXG4gICAgICAgIHNldHRpbmdzLnRpbWVTdGFydCA9IG5ldyBEYXRlKHNldHRpbmdzLnRpbWVTdGFydCk7XHJcbiAgICAgICAgc2V0dGluZ3MudGltZUVuZCA9IG5ldyBEYXRlKHNldHRpbmdzLnRpbWVFbmQpO1xyXG5cclxuICAgICAgICAkc2NvcGUuc2V0dGluZ3MgPSBzZXR0aW5ncztcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gQWRkaXRpb25hbCBPcHRpb25zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICAkc2NvcGUudXBkYXRlQWxsb3dNaW5vcnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgU2V0dGluZ3NTZXJ2aWNlXHJcbiAgICAgICAgICAudXBkYXRlQWxsb3dNaW5vcnMoJHNjb3BlLnNldHRpbmdzLmFsbG93TWlub3JzKVxyXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAkc2NvcGUuc2V0dGluZ3MuYWxsb3dNaW5vcnMgPSByZXNwb25zZS5kYXRhLmFsbG93TWlub3JzO1xyXG4gICAgICAgICAgICBjb25zdCBzdWNjZXNzVGV4dCA9ICRzY29wZS5zZXR0aW5ncy5hbGxvd01pbm9ycyA/XHJcbiAgICAgICAgICAgICAgXCJNaW5vcnMgYXJlIG5vdyBhbGxvd2VkIHRvIHJlZ2lzdGVyLlwiIDpcclxuICAgICAgICAgICAgICBcIk1pbm9ycyBhcmUgbm8gbG9uZ2VyIGFsbG93ZWQgdG8gcmVnaXN0ZXIuXCJcclxuICAgICAgICAgICAgc3dhbChcIkxvb2tzIGdvb2QhXCIsIHN1Y2Nlc3NUZXh0LCBcInN1Y2Nlc3NcIik7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vIFdoaXRlbGlzdCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgU2V0dGluZ3NTZXJ2aWNlXHJcbiAgICAgICAgLmdldFdoaXRlbGlzdGVkRW1haWxzKClcclxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAkc2NvcGUud2hpdGVsaXN0ID0gcmVzcG9uc2UuZGF0YS5qb2luKFwiLCBcIik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICRzY29wZS51cGRhdGVXaGl0ZWxpc3QgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgU2V0dGluZ3NTZXJ2aWNlXHJcbiAgICAgICAgICAgIC51cGRhdGVXaGl0ZWxpc3RlZEVtYWlscygkc2NvcGUud2hpdGVsaXN0LnJlcGxhY2UoLyAvZywgJycpLnNwbGl0KCcsJykpXHJcbiAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICBzd2FsKCdXaGl0ZWxpc3QgdXBkYXRlZC4nKTtcclxuICAgICAgICAgICAgICAkc2NvcGUud2hpdGVsaXN0ID0gcmVzcG9uc2UuZGF0YS53aGl0ZWxpc3RlZEVtYWlscy5qb2luKFwiLCBcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAvLyBSZWdpc3RyYXRpb24gVGltZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgICRzY29wZS5mb3JtYXREYXRlID0gZnVuY3Rpb24oZGF0ZSl7XHJcbiAgICAgICAgaWYgKCFkYXRlKXtcclxuICAgICAgICAgIHJldHVybiBcIkludmFsaWQgRGF0ZVwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSGFjayBmb3IgdGltZXpvbmVcclxuICAgICAgICByZXR1cm4gbW9tZW50KGRhdGUpLmxvY2FsZSgnZW4nKS5mb3JtYXQoJ2RkZGQsIE1NTU0gRG8gWVlZWSwgaDptbSBhJykgK1xyXG4gICAgICAgICAgXCIgXCIgKyBkYXRlLnRvVGltZVN0cmluZygpLnNwbGl0KCcgJylbMl07XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvLyBUYWtlIGEgZGF0ZSBhbmQgcmVtb3ZlIHRoZSBzZWNvbmRzLlxyXG4gICAgICBmdW5jdGlvbiBjbGVhbkRhdGUoZGF0ZSl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKFxyXG4gICAgICAgICAgZGF0ZS5nZXRGdWxsWWVhcigpLFxyXG4gICAgICAgICAgZGF0ZS5nZXRNb250aCgpLFxyXG4gICAgICAgICAgZGF0ZS5nZXREYXRlKCksXHJcbiAgICAgICAgICBkYXRlLmdldEhvdXJzKCksXHJcbiAgICAgICAgICBkYXRlLmdldE1pbnV0ZXMoKVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICRzY29wZS51cGRhdGVSZWdpc3RyYXRpb25UaW1lcyA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgLy8gQ2xlYW4gdGhlIGRhdGVzIGFuZCB0dXJuIHRoZW0gdG8gbXMuXHJcbiAgICAgICAgdmFyIG9wZW4gPSBjbGVhbkRhdGUoJHNjb3BlLnNldHRpbmdzLnRpbWVPcGVuKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgdmFyIGNsb3NlID0gY2xlYW5EYXRlKCRzY29wZS5zZXR0aW5ncy50aW1lQ2xvc2UpLmdldFRpbWUoKTtcclxuXHJcbiAgICAgICAgaWYgKG9wZW4gPCAwIHx8IGNsb3NlIDwgMCB8fCBvcGVuID09PSB1bmRlZmluZWQgfHwgY2xvc2UgPT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICByZXR1cm4gc3dhbCgnT29wcy4uLicsICdZb3UgbmVlZCB0byBlbnRlciB2YWxpZCB0aW1lcy4nLCAnZXJyb3InKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9wZW4gPj0gY2xvc2Upe1xyXG4gICAgICAgICAgc3dhbCgnT29wcy4uLicsICdSZWdpc3RyYXRpb24gY2Fubm90IG9wZW4gYWZ0ZXIgaXQgY2xvc2VzLicsICdlcnJvcicpO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgU2V0dGluZ3NTZXJ2aWNlXHJcbiAgICAgICAgICAudXBkYXRlUmVnaXN0cmF0aW9uVGltZXMob3BlbiwgY2xvc2UpXHJcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHVwZGF0ZVNldHRpbmdzKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgICAgICAgICBzd2FsKFwiTG9va3MgZ29vZCFcIiwgXCJSZWdpc3RyYXRpb24gVGltZXMgVXBkYXRlZFwiLCBcInN1Y2Nlc3NcIik7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgICRzY29wZS5TdWdnZXN0UmVnaXN0cmF0aW9uVGltZSA9IGZ1bmN0aW9uIChob3Vycykge1xyXG4gICAgICAgICRzY29wZS5zZXR0aW5ncy50aW1lQ2xvc2UgPSBuZXcgRGF0ZSggbW9tZW50KCRzY29wZS5zZXR0aW5ncy50aW1lT3BlbikuYWRkKGhvdXJzLCAnaCcpKVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBFdmVudCBTdGFydCBUaW1lIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICAkc2NvcGUudXBkYXRlRXZlbnRUaW1lcyA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgLy8gQ2xlYW4gdGhlIGRhdGVzIGFuZCB0dXJuIHRoZW0gdG8gbXMuXHJcbiAgICAgICAgdmFyIHN0YXJ0ID0gY2xlYW5EYXRlKCRzY29wZS5zZXR0aW5ncy50aW1lU3RhcnQpLmdldFRpbWUoKTtcclxuICAgICAgICB2YXIgZW5kID0gY2xlYW5EYXRlKCRzY29wZS5zZXR0aW5ncy50aW1lRW5kKS5nZXRUaW1lKCk7XHJcblxyXG4gICAgICAgIGlmIChzdGFydCA8IDAgfHwgZW5kIDwgMCB8fCBzdGFydCA9PT0gdW5kZWZpbmVkIHx8IGVuZCA9PT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgIHJldHVybiBzd2FsKCdPb3BzLi4uJywgJ1lvdSBuZWVkIHRvIGVudGVyIHZhbGlkIHRpbWVzLicsICdlcnJvcicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc3RhcnQgPj0gZW5kKXtcclxuICAgICAgICAgIHN3YWwoJ09vcHMuLi4nLCAnRXZlbnQgY2Fubm90IHN0YXJ0IGFmdGVyIGl0IGVuZHMuJywgJ2Vycm9yJyk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBTZXR0aW5nc1NlcnZpY2VcclxuICAgICAgICAgIC51cGRhdGVFdmVudFRpbWVzKHN0YXJ0LCBlbmQpXHJcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHVwZGF0ZVNldHRpbmdzKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgICAgICAgICBzd2FsKFwiTG9va3MgZ29vZCFcIiwgXCJFdmVudCBUaW1lcyBVcGRhdGVkXCIsIFwic3VjY2Vzc1wiKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgJHNjb3BlLlN1Z2dlc3RTdGFydFRpbWUgPSBmdW5jdGlvbiAoaG91cnMpIHtcclxuICAgICAgICAkc2NvcGUuc2V0dGluZ3MudGltZUVuZCA9IG5ldyBEYXRlKCBtb21lbnQoJHNjb3BlLnNldHRpbmdzLnRpbWVTdGFydCkuYWRkKGhvdXJzLCAnaCcpKVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBDb25maXJtYXRpb24gVGltZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgJHNjb3BlLnVwZGF0ZUNvbmZpcm1hdGlvblRpbWUgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciBjb25maXJtQnkgPSBjbGVhbkRhdGUoJHNjb3BlLnNldHRpbmdzLnRpbWVDb25maXJtKS5nZXRUaW1lKCk7XHJcblxyXG4gICAgICAgIFNldHRpbmdzU2VydmljZVxyXG4gICAgICAgICAgLnVwZGF0ZUNvbmZpcm1hdGlvblRpbWUoY29uZmlybUJ5KVxyXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICB1cGRhdGVTZXR0aW5ncyhyZXNwb25zZS5kYXRhKTtcclxuICAgICAgICAgICAgc3dhbChcIlNvdW5kcyBnb29kIVwiLCBcIkNvbmZpcm1hdGlvbiBEYXRlIFVwZGF0ZWRcIiwgXCJzdWNjZXNzXCIpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBcclxuICAgICAgJHNjb3BlLlN1Z2dlc3RDb25maXJtYXRpb25UaW1lID0gZnVuY3Rpb24gKGhvdXJzKSB7XHJcbiAgICAgICAgJHNjb3BlLnNldHRpbmdzLnRpbWVDb25maXJtID0gbmV3IERhdGUoIG1vbWVudCgkc2NvcGUuc2V0dGluZ3MudGltZVN0YXJ0KS5zdWJ0cmFjdChob3VycywgJ2gnKSlcclxuICAgICAgfVxyXG5cclxuICAgICAgJHNjb3BlLnVwZGF0ZUNvbmZpcm1hdGlvblVzZXJzID0gZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgY29uZmlybUJ5ID0gY2xlYW5EYXRlKCRzY29wZS5zZXR0aW5ncy50aW1lQ29uZmlybSkuZ2V0VGltZSgpO1xyXG5cclxuICAgICAgICBTZXR0aW5nc1NlcnZpY2VcclxuICAgICAgICAgIC51cGRhdGVDb25maXJtYXRpb25UaW1lKGNvbmZpcm1CeSlcclxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgdXBkYXRlU2V0dGluZ3MocmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgICAgIC8vIGdldCBhbGwgdXNlcnMgc29mdCBhZG1pdHRlZCBhbmQgdXBkYXRlIGNvbmZpcm1hdGlvbiB0aW1lIGZvcmVhY2hcclxuXHJcbiAgICAgICAgICAgIFVzZXJTZXJ2aWNlLmdldFBhZ2UoMCwgMCwgXCJcIiwge3NvZnRBZG1pdHRlZDp0cnVlfSlcclxuICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgICAgICAgICAgIHJlc3BvbnNlLmRhdGEudXNlcnMuZm9yRWFjaCh1c2VyID0+IHtcclxuICAgICAgICAgICAgICAgIFVzZXJTZXJ2aWNlLnVwZGF0ZUNvbmZpcm1hdGlvblRpbWUodXNlci5faWQpXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgLy91cGRhdGUgY29uZmlybWF0aW9uIHRpbWUgZm9yZWFjaFxyXG4gICAgICAgICAgICAgIHN3YWwoXCJTb3VuZHMgZ29vZCFcIiwgXCJDb25maXJtYXRpb24gRGF0ZSBVcGRhdGVkIGZvciBhbGwgdXNlcnNcIiwgXCJzdWNjZXNzXCIpOyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfTtcclxuICAgICAgXHJcbiAgICAgIC8vIEFjY2VwdGFuY2UgLyBDb25maXJtYXRpb24gVGV4dCAtLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICB2YXIgY29udmVydGVyID0gbmV3IHNob3dkb3duLkNvbnZlcnRlcigpO1xyXG5cclxuICAgICAgJHNjb3BlLm1hcmtkb3duUHJldmlldyA9IGZ1bmN0aW9uKHRleHQpe1xyXG4gICAgICAgIHJldHVybiAkc2NlLnRydXN0QXNIdG1sKGNvbnZlcnRlci5tYWtlSHRtbCh0ZXh0KSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkc2NvcGUudXBkYXRlV2FpdGxpc3RUZXh0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgdGV4dCA9ICRzY29wZS5zZXR0aW5ncy53YWl0bGlzdFRleHQ7XHJcbiAgICAgICAgU2V0dGluZ3NTZXJ2aWNlXHJcbiAgICAgICAgICAudXBkYXRlV2FpdGxpc3RUZXh0KHRleHQpXHJcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHN3YWwoXCJMb29rcyBnb29kIVwiLCBcIldhaXRsaXN0IFRleHQgVXBkYXRlZFwiLCBcInN1Y2Nlc3NcIik7XHJcbiAgICAgICAgICAgIHVwZGF0ZVNldHRpbmdzKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkc2NvcGUudXBkYXRlSG9zdFNjaG9vbCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIGhvc3RTY2hvb2wgPSAkc2NvcGUuc2V0dGluZ3MuaG9zdFNjaG9vbDtcclxuICAgICAgICBTZXR0aW5nc1NlcnZpY2VcclxuICAgICAgICAgIC51cGRhdGVIb3N0U2Nob29sKGhvc3RTY2hvb2wpXHJcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHN3YWwoXCJMb29rcyBnb29kIVwiLCBcIkhvc3QgU2Nob29sIFVwZGF0ZWRcIiwgXCJzdWNjZXNzXCIpO1xyXG4gICAgICAgICAgICB1cGRhdGVTZXR0aW5ncyhyZXNwb25zZS5kYXRhKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgIFxyXG4gICAgICAkc2NvcGUudXBkYXRlQWNjZXB0YW5jZVRleHQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciB0ZXh0ID0gJHNjb3BlLnNldHRpbmdzLmFjY2VwdGFuY2VUZXh0O1xyXG4gICAgICAgIFNldHRpbmdzU2VydmljZVxyXG4gICAgICAgICAgLnVwZGF0ZUFjY2VwdGFuY2VUZXh0KHRleHQpXHJcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHN3YWwoXCJMb29rcyBnb29kIVwiLCBcIkFjY2VwdGFuY2UgVGV4dCBVcGRhdGVkXCIsIFwic3VjY2Vzc1wiKTtcclxuICAgICAgICAgICAgdXBkYXRlU2V0dGluZ3MocmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgICRzY29wZS51cGRhdGVDb25maXJtYXRpb25UZXh0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgdGV4dCA9ICRzY29wZS5zZXR0aW5ncy5jb25maXJtYXRpb25UZXh0O1xyXG4gICAgICAgIFNldHRpbmdzU2VydmljZVxyXG4gICAgICAgICAgLnVwZGF0ZUNvbmZpcm1hdGlvblRleHQodGV4dClcclxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgc3dhbChcIkxvb2tzIGdvb2QhXCIsIFwiQ29uZmlybWF0aW9uIFRleHQgVXBkYXRlZFwiLCBcInN1Y2Nlc3NcIik7XHJcbiAgICAgICAgICAgIHVwZGF0ZVNldHRpbmdzKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJykgLmNvbmZpZyhbJ0NoYXJ0SnNQcm92aWRlcicsIGZ1bmN0aW9uIChDaGFydEpzUHJvdmlkZXIpIHtcclxuICAvLyBDb25maWd1cmUgYWxsIGNoYXJ0c1xyXG4gIENoYXJ0SnNQcm92aWRlci5zZXRPcHRpb25zKHtcclxuICAgIGNoYXJ0Q29sb3JzOiBbJyM5QjY2RkUnLCAnI0ZGNjQ4NCcsICcjRkVBMDNGJywgJyNGQkQwNEQnLCAnIzREQkZDMCcsICcjMzNBM0VGJywgJyNDQUNCQ0YnXSxcclxuICAgIHJlc3BvbnNpdmU6IHRydWVcclxuICB9KTtcclxufV0pXHJcbi5jb250cm9sbGVyKCdBZG1pblN0YXRzQ3RybCcsW1xyXG4gICAgJyRzY29wZScsXHJcbiAgICBcIiRzdGF0ZVwiLFxyXG4gICAgJ1VzZXJTZXJ2aWNlJyxcclxuICAgIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCBVc2VyU2VydmljZSl7XHJcbiAgICAgIFxyXG4gICAgICBVc2VyU2VydmljZVxyXG4gICAgICAgIC5nZXRTdGF0cygpXHJcbiAgICAgICAgLnRoZW4oc3RhdHMgPT4ge1xyXG4gICAgICAgICAgJHNjb3BlLnN0YXRzID0gc3RhdHMuZGF0YTsgXHJcblxyXG4gICAgICAgICAgLy8gTWVhbHMgXHJcbiAgICAgICAgICBsYWJlbHM9W11cclxuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RhdHMuZGF0YS5saXZlLm1lYWwubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGFiZWxzLnB1c2goJ01lYWwgJysoaSsxKSkgICAgICBcclxuICAgICAgICAgIH1cclxuICAgICAgICAgICRzY29wZS5tZWFscyA9IHsgXHJcbiAgICAgICAgICAgIGxhYmVscyA6IGxhYmVscyxcclxuICAgICAgICAgICAgc2VyaWVzIDogWydNZWFscyddLFxyXG4gICAgICAgICAgICBkYXRhIDogc3RhdHMuZGF0YS5saXZlLm1lYWwsXHJcbiAgICAgICAgICAgIG9wdGlvbnMgOiB7XHJcbiAgICAgICAgICAgICAgXCJzY2FsZXNcIjp7XHJcbiAgICAgICAgICAgICAgICBcInhBeGVzXCI6W3tcInRpY2tzXCI6e2JlZ2luQXRaZXJvOnRydWUsbWF4OnN0YXRzLmRhdGEudG90YWx9fV1cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdGV4dDogJ01lYWxzIENvbnN1bWVkJ1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBcclxuICAgICAgICAgIC8vIFdvcmtzaG9wcyBcclxuICAgICAgICAgIGxhYmVscz1bXVxyXG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGF0cy5kYXRhLmxpdmUud29ya3Nob3AubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGFiZWxzLnB1c2goJ1dvcmtzaG9wICcrKGkrMSkpICAgICAgXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAkc2NvcGUud29ya3Nob3BzID0geyBcclxuICAgICAgICAgICAgbGFiZWxzIDogbGFiZWxzLFxyXG4gICAgICAgICAgICBzZXJpZXMgOiBbJ1dvcmtzaG9wcyddLFxyXG4gICAgICAgICAgICBkYXRhIDogc3RhdHMuZGF0YS5saXZlLndvcmtzaG9wLFxyXG4gICAgICAgICAgICBvcHRpb25zOntcclxuICAgICAgICAgICAgICBlbGVtZW50czoge1xyXG4gICAgICAgICAgICAgICAgbGluZToge1xyXG4gICAgICAgICAgICAgICAgICBib3JkZXJXaWR0aDogMC41LCAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRleHQ6ICdXb3Jrc2hvcHMgYXR0ZW5kYW5jZSdcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gY2x1YnNcclxuICAgICAgICAgICRzY29wZS5jbHVicyA9IHtcclxuICAgICAgICAgICAgbGFiZWxzIDogc3RhdHMuZGF0YS5zb3VyY2UuY2x1YnNMYWJlbHMsXHJcbiAgICAgICAgICAgIHNlcmllcyA6IFsnQ2x1YnMnXSxcclxuICAgICAgICAgICAgZGF0YSA6IHN0YXRzLmRhdGEuc291cmNlLmNsdWJzLFxyXG4gICAgICAgICAgICBvcHRpb25zOntcclxuICAgICAgICAgICAgICBlbGVtZW50czoge1xyXG4gICAgICAgICAgICAgICAgbGluZToge1xyXG4gICAgICAgICAgICAgICAgICBib3JkZXJXaWR0aDogMC41LCAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRleHQ6ICdBcHBsaWNhbnRzIHZpYSBDbHVicydcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAncmlnaHQnLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgIC8vIEdldCB0aGUgbW9zdCBhY3RpdmUgY2x1YlxyXG4gICAgICAgICAgIHZhciBhcnIgPXN0YXRzLmRhdGEuc291cmNlLmNsdWJzXHJcbiAgICAgICAgICAgdmFyIG1heCA9IGFyclswXTtcclxuICAgICAgICAgICB2YXIgbWF4SW5kZXggPSAwO1xyXG4gICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgIGlmIChhcnJbaV0gPiBtYXgpIHtcclxuICAgICAgICAgICAgICAgICAgIG1heEluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgICAgIG1heCA9IGFycltpXTtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgJHNjb3BlLmZpcnN0Q2x1YiA9IHN0YXRzLmRhdGEuc291cmNlLmNsdWJzTGFiZWxzW21heEluZGV4XVxyXG5cclxuICAgICAgIFxyXG5cclxuXHJcbiAgICAgICAgICAvLyBzb3VyY2VzIFxyXG4gICAgICAgICAgJHNjb3BlLnNvdXJjZSA9IHtcclxuICAgICAgICAgICAgbGFiZWxzIDogWydGYWNlYm9vaycsJ0VtYWlsJywnQ2x1YnMnXSxcclxuICAgICAgICAgICAgc2VyaWVzIDogWydTb3VyY2VzJ10sXHJcbiAgICAgICAgICAgIGRhdGEgOiBzdGF0cy5kYXRhLnNvdXJjZS5nZW5lcmFsLFxyXG4gICAgICAgICAgICBvcHRpb25zOntcclxuICAgICAgICAgICAgICBlbGVtZW50czoge1xyXG4gICAgICAgICAgICAgICAgbGluZToge1xyXG4gICAgICAgICAgICAgICAgICBib3JkZXJXaWR0aDogMC41LCAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRleHQ6ICdBcHBsaWNhbnRzIHNvdXJjZXMnXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICAgIGRpc3BsYXk6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JpZ2h0JyxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICB9KTsgIFxyXG5cclxuXHJcbiAgICAgIFVzZXJTZXJ2aWNlXHJcbiAgICAgICAgLmdldFRlYW1TdGF0cygpXHJcbiAgICAgICAgLnRoZW4odGVhbXN0YXRzID0+IHtcclxuICAgICAgICAgICRzY29wZS50ZWFtc3RhdHMgPSB0ZWFtc3RhdHMuZGF0YTsgXHJcbiAgICAgICAgfSk7ICBcclxuXHJcblxyXG4gICAgICAkc2NvcGUuZnJvbU5vdyA9IGZ1bmN0aW9uKGRhdGUpe1xyXG4gICAgICAgIHJldHVybiBtb21lbnQoZGF0ZSkubG9jYWxlKCdlbicpLmZyb21Ob3coKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgICRzY29wZS51cGRhdGVzdGF0cyA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgVXNlclNlcnZpY2UudXBkYXRlc3RhdHMoKVxyXG4gICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIENoYXJ0LmRlZmF1bHRzLmdsb2JhbC5jb2xvcnMgPSBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAncmdiYSg1MiwgMTUyLCAyMTksIDAuNSknLFxyXG4gICAgICAgICAgcG9pbnRCYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDUyLCAxNTIsIDIxOSwgMC41KScsXHJcbiAgICAgICAgICBwb2ludEhvdmVyQmFja2dyb3VuZENvbG9yOiAncmdiYSgxNTEsMTg3LDIwNSwwLjUpJyxcclxuICAgICAgICAgIGJvcmRlckNvbG9yOiAncmdiYSgwLDAsMCwwJyxcclxuICAgICAgICAgIHBvaW50Qm9yZGVyQ29sb3I6ICcjZmZmJyxcclxuICAgICAgICAgIHBvaW50SG92ZXJCb3JkZXJDb2xvcjogJ3JnYmEoMTUxLDE4NywyMDUsMC41KSdcclxuICAgICAgICB9XHJcbiAgICAgIF0gICAgICAgIFxyXG5cclxuXHJcbiAgICAgICRzY29wZS5zZW5kTGFnZ2VyRW1haWxzID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBzd2FsKHtcclxuICAgICAgICAgIHRpdGxlOiBcIkFyZSB5b3Ugc3VyZT9cIixcclxuICAgICAgICAgIHRleHQ6IFwiVGhpcyB3aWxsIHNlbmQgYW4gZW1haWwgdG8gZXZlcnkgdXNlciB3aG8gaGFzIG5vdCBzdWJtaXR0ZWQgYW4gYXBwbGljYXRpb24uIEFyZSB5b3Ugc3VyZT8uXCIsXHJcbiAgICAgICAgICB0eXBlOiBcIndhcm5pbmdcIixcclxuICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXHJcbiAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6IFwiI0RENkI1NVwiLFxyXG4gICAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6IFwiWWVzLCBzZW5kLlwiLFxyXG4gICAgICAgICAgY2xvc2VPbkNvbmZpcm06IGZhbHNlXHJcbiAgICAgICAgICB9LCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBVc2VyU2VydmljZVxyXG4gICAgICAgICAgICAgIC5zZW5kTGFnZ2VyRW1haWxzKClcclxuICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgc3dlZXRBbGVydCgnWW91ciBlbWFpbHMgaGF2ZSBiZWVuIHNlbnQuJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkc2NvcGUuc2VuZFJlamVjdEVtYWlscyA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICB0aXRsZTogXCJBcmUgeW91IHN1cmU/XCIsXHJcbiAgICAgICAgICB0ZXh0OiBcIlRoaXMgd2lsbCBzZW5kIGFuIGVtYWlsIHRvIGV2ZXJ5IHVzZXIgd2hvIGhhcyBiZWVuIHJlamVjdGVkLiBBcmUgeW91IHN1cmU/XCIsXHJcbiAgICAgICAgICB0eXBlOiBcIndhcm5pbmdcIixcclxuICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXHJcbiAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6IFwiI0RENkI1NVwiLFxyXG4gICAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6IFwiWWVzLCBzZW5kLlwiLFxyXG4gICAgICAgICAgY2xvc2VPbkNvbmZpcm06IGZhbHNlXHJcbiAgICAgICAgICB9LCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBVc2VyU2VydmljZVxyXG4gICAgICAgICAgICAgIC5zZW5kUmVqZWN0RW1haWxzKClcclxuICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgc3dlZXRBbGVydCgnWW91ciBlbWFpbHMgaGF2ZSBiZWVuIHNlbnQuJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkc2NvcGUuc2VuZFJlamVjdEVtYWlsc1Jlc3QgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIFVzZXJTZXJ2aWNlXHJcbiAgICAgICAgICAuZ2V0TGF0ZXJSZWplY3RlZENvdW50KClcclxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGNvdW50KSB7XHJcbiAgICAgICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgICAgIHRpdGxlOiBcIkFyZSB5b3Ugc3VyZT9cIixcclxuICAgICAgICAgICAgICB0ZXh0OiBgVGhpcyB3aWxsIHNlbmQgcmVqZWN0aW9uIGVtYWlsIHRvICR7Y291bnR9IHVzZXJzLmAsXHJcbiAgICAgICAgICAgICAgdHlwZTogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcclxuICAgICAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6IFwiI0RENkI1NVwiLFxyXG4gICAgICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiBcIlllcywgcmVqZWN0LlwiLFxyXG4gICAgICAgICAgICAgIGNsb3NlT25Db25maXJtOiBmYWxzZVxyXG4gICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCl7XHJcbiAgICBcclxuICAgICAgICAgICAgICAgIFVzZXJTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAgIC5zZW5kUmVqZWN0RW1haWxzUmVzdCgpXHJcbiAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgc3dlZXRBbGVydCgnWW91ciBlbWFpbHMgaGF2ZSBiZWVuIHNlbnQuJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH0pXHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkc2NvcGUubWFzc1JlamVjdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIFVzZXJTZXJ2aWNlXHJcbiAgICAgICAgICAuZ2V0UmVqZWN0aW9uQ291bnQoKVxyXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oY291bnQpIHtcclxuICAgICAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICAgICAgdGl0bGU6IFwiQXJlIHlvdSBzdXJlP1wiLFxyXG4gICAgICAgICAgICAgIHRleHQ6IGBUaGlzIHdpbGwgcmVqZWN0ICR7Y291bnR9IHVzZXJzLmAsXHJcbiAgICAgICAgICAgICAgdHlwZTogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcclxuICAgICAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6IFwiI0RENkI1NVwiLFxyXG4gICAgICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiBcIlllcywgcmVqZWN0LlwiLFxyXG4gICAgICAgICAgICAgIGNsb3NlT25Db25maXJtOiBmYWxzZVxyXG4gICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCl7XHJcbiAgICBcclxuICAgICAgICAgICAgICAgIFVzZXJTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAgIC5tYXNzUmVqZWN0KClcclxuICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICBzd2VldEFsZXJ0KCdNYXNzIFJlamVjdGlvbiBzdWNjZXNzZnVsLicpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9KVxyXG4gICAgICB9XHJcblxyXG4gICAgICAkc2NvcGUubWFzc1JlamVjdFJlc3QgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBVc2VyU2VydmljZVxyXG4gICAgICAgICAgLmdldFJlc3RSZWplY3Rpb25Db3VudCgpXHJcbiAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihjb3VudCkge1xyXG4gICAgICAgICAgICBzd2FsKHtcclxuICAgICAgICAgICAgICB0aXRsZTogXCJBcmUgeW91IHN1cmU/XCIsXHJcbiAgICAgICAgICAgICAgdGV4dDogYFRoaXMgd2lsbCByZWplY3QgJHtjb3VudH0gdXNlcnMuYCxcclxuICAgICAgICAgICAgICB0eXBlOiBcIndhcm5pbmdcIixcclxuICAgICAgICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlLFxyXG4gICAgICAgICAgICAgIGNvbmZpcm1CdXR0b25Db2xvcjogXCIjREQ2QjU1XCIsXHJcbiAgICAgICAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6IFwiWWVzLCByZWplY3QuXCIsXHJcbiAgICAgICAgICAgICAgY2xvc2VPbkNvbmZpcm06IGZhbHNlXHJcbiAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKXtcclxuICAgIFxyXG4gICAgICAgICAgICAgICAgVXNlclNlcnZpY2VcclxuICAgICAgICAgICAgICAgICAgLm1hc3NSZWplY3RSZXN0KClcclxuICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICBzd2VldEFsZXJ0KCdNYXNzIFJlamVjdGlvbiBzdWNjZXNzZnVsLicpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9KVxyXG4gICAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgfV0pO1xyXG4iLCJcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4uY29udHJvbGxlcignQWRtaW5UZWFtQ3RybCcsIFtcclxuICAnJHNjb3BlJyxcclxuICAnJHN0YXRlJyxcclxuICAnJHRpbWVvdXQnLFxyXG4gICdjdXJyZW50VXNlcicsXHJcbiAgJ3NldHRpbmdzJyxcclxuICAnVXRpbHMnLFxyXG4gICdVc2VyU2VydmljZScsXHJcbiAgJ1RlYW1TZXJ2aWNlJyxcclxuICAnVEVBTScsXHJcbiAgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCAkdGltZW91dCwgY3VycmVudFVzZXIsIHNldHRpbmdzLCBVdGlscywgVXNlclNlcnZpY2UsIFRlYW1TZXJ2aWNlLCBURUFNKSB7XHJcbiAgICAvLyBHZXQgdGhlIGN1cnJlbnQgdXNlcidzIG1vc3QgcmVjZW50IGRhdGEuIFxyXG4gICAgdmFyIFNldHRpbmdzID0gc2V0dGluZ3MuZGF0YTtcclxuXHJcbiAgICAkc2NvcGUucmVnSXNPcGVuID0gVXRpbHMuaXNSZWdPcGVuKFNldHRpbmdzKTtcclxuXHJcbiAgICAkc2NvcGUudXNlciA9IGN1cnJlbnRVc2VyLmRhdGE7XHJcblxyXG4gICAgZnVuY3Rpb24gaXNUZWFtTWVtYmVyKHRlYW1zLCBVc2VyaWQpIHtcclxuICAgICAgdmFyIHRlc3QgPSBmYWxzZTtcclxuICAgICAgdGVhbXMuZm9yRWFjaCh0ZWFtID0+IHtcclxuICAgICAgICB0ZWFtLm1lbWJlcnMuZm9yRWFjaChtZW1iZXIgPT4ge1xyXG4gICAgICAgICAgaWYgKG1lbWJlci5pZCA9PSBVc2VyaWQpIHRlc3QgPSB0cnVlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIHRlc3Q7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2VsZWN0TWVtYmVyKG1lbWJlcklkKSB7XHJcbiAgICAgIFVzZXJTZXJ2aWNlLmdldChtZW1iZXJJZCkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgdXNlciA9IHJlc3BvbnNlLmRhdGFcclxuICAgICAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyID0gdXNlcjtcclxuICAgICAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyLnNlY3Rpb25zID0gZ2VuZXJhdGVTZWN0aW9ucyh1c2VyKTtcclxuICAgICAgfSk7XHJcbiAgICAgIGNvbnNvbGUubG9nKHVzZXIpO1xyXG4gICAgICAkKFwiLmxvbmcudXNlci5tb2RhbFwiKS5tb2RhbChcInNob3dcIik7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVTZWN0aW9ucyh1c2VyKSB7XHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbmFtZTogXCJQcm9maWxlXCIsXHJcbiAgICAgICAgICBmaWVsZHM6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiR2VuZGVyXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5nZW5kZXJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiU2Nob29sXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5zY2hvb2xcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiR2l0aHViXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5naXRodWJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiTGlua2VkaW5cIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmxpbmtlZGluXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfSxcclxuICAgICAgXTtcclxuICAgIH1cclxuXHJcbiAgICAkc2NvcGUuc2VsZWN0TWVtYmVyID0gc2VsZWN0TWVtYmVyO1xyXG5cclxuXHJcbiAgICAkc2NvcGUuaXNqb2luZWQgPSBmdW5jdGlvbiAodGVhbSkge1xyXG4gICAgICB2YXIgdGVzdCA9IGZhbHNlO1xyXG4gICAgICB0ZWFtLmpvaW5SZXF1ZXN0cy5mb3JFYWNoKG1lbWJlciA9PiB7XHJcbiAgICAgICAgaWYgKG1lbWJlci5pZCA9PSBjdXJyZW50VXNlci5kYXRhLl9pZCkgdGVzdCA9IHRydWU7XHJcbiAgICAgIH0pXHJcbiAgICAgIHJldHVybiB0ZXN0O1xyXG4gICAgfVxyXG5cclxuICAgIFRlYW1TZXJ2aWNlLmdldEFsbCgpLnRoZW4odGVhbXMgPT4ge1xyXG5cclxuICAgICAgJHNjb3BlLmlzVGVhbUFkbWluID0gZmFsc2U7XHJcbiAgICAgICRzY29wZS5pc1RlYW1NZW1iZXIgPSBmYWxzZTtcclxuICAgICAgdGVhbXMuZGF0YS5mb3JFYWNoKHRlYW0gPT4ge1xyXG4gICAgICAgIHRlYW0uaXNNYXh0ZWFtID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGlmICh0ZWFtLm1lbWJlcnMubGVuZ3RoID49IFNldHRpbmdzLm1heFRlYW1TaXplKSB7XHJcbiAgICAgICAgICB0ZWFtLmlzQ29sb3NlZCA9IHRydWU7XHJcbiAgICAgICAgICB0ZWFtLmlzTWF4dGVhbSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGVhbS5tZW1iZXJzWzBdLmlkID09IGN1cnJlbnRVc2VyLmRhdGEuX2lkKSB7XHJcbiAgICAgICAgICB0ZWFtLmpvaW5SZXF1ZXN0cy5mb3JFYWNoKG1lbWJlciA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpc1RlYW1NZW1iZXIodGVhbXMuZGF0YSwgbWVtYmVyLmlkKSkge1xyXG4gICAgICAgICAgICAgIG1lbWJlci51bmF2YWlsYWJsZSA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7IG1lbWJlci51bmF2YWlsYWJsZSA9IGZhbHNlIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgJHNjb3BlLnVzZXJBZG1pblRlYW0gPSB0ZWFtO1xyXG4gICAgICAgICAgJHNjb3BlLmlzVGVhbUFkbWluID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGVhbS5tZW1iZXJzLmZvckVhY2gobWVtYmVyID0+IHtcclxuICAgICAgICAgICAgaWYgKG1lbWJlci5pZCA9PSBjdXJyZW50VXNlci5kYXRhLl9pZCkge1xyXG4gICAgICAgICAgICAgICRzY29wZS51c2VyTWVtYmVyVGVhbSA9IHRlYW07XHJcbiAgICAgICAgICAgICAgJHNjb3BlLmlzVGVhbU1lbWJlciA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgICBcclxuICAgICAgJHNjb3BlLnRlYW1zID0gdGVhbXMuZGF0YTtcclxuXHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgJHNjb3BlLmNyZWF0ZVRlYW0gPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICB0ZWFtRGF0YSA9IHtcclxuICAgICAgICBkZXNjcmlwdGlvbjogJHNjb3BlLm5ld1RlYW1fZGVzY3JpcHRpb24sXHJcbiAgICAgICAgbWVtYmVyczogW3sgaWQ6IGN1cnJlbnRVc2VyLmRhdGEuX2lkLCBuYW1lOiBjdXJyZW50VXNlci5kYXRhLnByb2ZpbGUubmFtZSwgc2tpbGw6ICRzY29wZS5uZXdUZWFtX0FkbWluc2tpbGwgfV0sXHJcbiAgICAgICAgc2tpbGxzOiB7IGNvZGU6ICRzY29wZS5za2lsbGNvZGUsIGRlc2lnbjogJHNjb3BlLnNraWxsZGVzaWduLCBoYXJkd2FyZTogJHNjb3BlLnNraWxsaGFyZHdhcmUsIGlkZWE6ICRzY29wZS5za2lsbGlkZWEgfSxcclxuICAgICAgICBpc0NvbG9zZWQ6IGZhbHNlLFxyXG4gICAgICB9XHJcbiAgICAgIGNvbnNvbGUubG9nKHRlYW1EYXRhKTtcclxuICAgICAgY29uc29sZS5sb2coJHNjb3BlLm5ld1RlYW1fQWRtaW5za2lsbCk7XHJcblxyXG4gICAgICBUZWFtU2VydmljZS5jcmVhdGUodGVhbURhdGEpO1xyXG4gICAgICAkc3RhdGUucmVsb2FkKCk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAkc2NvcGUuU2hvd2NyZWF0ZVRlYW0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICRzY29wZS5TaG93TmV3VGVhbUZyb20gPSB0cnVlO1xyXG4gICAgICAkc2NvcGUuc2tpbGxjb2RlID0gdHJ1ZVxyXG4gICAgICAkc2NvcGUuc2tpbGxkZXNpZ24gPSB0cnVlXHJcbiAgICAgICRzY29wZS5za2lsbGhhcmR3YXJlID0gdHJ1ZVxyXG4gICAgICAkc2NvcGUuc2tpbGxpZGVhID0gdHJ1ZVxyXG4gICAgICAkc2NvcGUubmV3VGVhbV9BZG1pbnNraWxsID0gXCJjb2RlXCJcclxuICAgIH1cclxuXHJcblxyXG4gICAgJHNjb3BlLlNob3dKb2luVGVhbSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICRzY29wZS5TaG93Sm9pblRlYW1Gcm9tID0gdHJ1ZTsgIFxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAkc2NvcGUuam9pblRlYW1Db2RlID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgdGVhbUlEID0gJHNjb3BlLm5ld1RlYW1fQ29kZTtcclxuICAgICAgbmV3VGVhbV9za2lsbD0gJHNjb3BlLm5ld1RlYW1fc2tpbGw7XHJcblxyXG4gICAgICBuZXd1c2VyPSB7aWQ6Y3VycmVudFVzZXIuZGF0YS5faWQsIG5hbWU6Y3VycmVudFVzZXIuZGF0YS5wcm9maWxlLm5hbWUsIHNraWxsOm5ld1RlYW1fc2tpbGx9O1xyXG4gICAgICBUZWFtU2VydmljZS5qb2luKHRlYW1JRCxuZXd1c2VyKTsgXHJcbiAgICAgIHN3YWwoXHJcbiAgICAgICAgXCJKb2luZWRcIixcclxuICAgICAgICBcIllvdSBoYXZlIGFwcGxpY2VkIHRvIGpvaW4gdGhpcyB0ZWFtLCB3YWl0IGZvciB0aGUgVGVhbS1BZG1pbiB0byBhY2NlcHQgeW91ciBhcHBsaWNhdGlvbi5cIixcclxuICAgICAgICBcInN1Y2Nlc3NcIlxyXG4gICAgICApOyAgXHJcbiAgICAgICRzdGF0ZS5yZWxvYWQoKTtcclxuIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAkc2NvcGUuam9pblRlYW0gPSBmdW5jdGlvbiAodGVhbSkge1xyXG5cclxuICAgICAgdmFyIHZhbHVlO1xyXG4gICAgICBjb25zdCBzZWxlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWxlY3QnKTtcclxuICAgICAgc2VsZWN0LmNsYXNzTmFtZSA9ICdzZWxlY3QtY3VzdG9tJ1xyXG5cclxuXHJcbiAgICAgIHZhciBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcclxuICAgICAgb3B0aW9uLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgb3B0aW9uLmlubmVySFRNTCA9ICdTZWxlY3QgYSBza2lsbCc7XHJcbiAgICAgIG9wdGlvbi52YWx1ZSA9IFwiY29kZVwiXHJcbiAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChvcHRpb24pO1xyXG5cclxuXHJcbiAgICAgIGlmICh0ZWFtLnNraWxscy5jb2RlKSB7XHJcbiAgICAgICAgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcbiAgICAgICAgb3B0aW9uLmlubmVySFRNTCA9ICdDb2RlJztcclxuICAgICAgICBvcHRpb24udmFsdWUgPSBcImNvZGVcIlxyXG4gICAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChvcHRpb24pO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0ZWFtLnNraWxscy5kZXNpZ24pIHtcclxuICAgICAgICBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcclxuICAgICAgICBvcHRpb24uaW5uZXJIVE1MID0gJ0Rlc2lnbic7XHJcbiAgICAgICAgb3B0aW9uLnZhbHVlID0gXCJkZXNpZ25cIlxyXG4gICAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChvcHRpb24pO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0ZWFtLnNraWxscy5oYXJkd2FyZSkge1xyXG4gICAgICAgIG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xyXG4gICAgICAgIG9wdGlvbi5pbm5lckhUTUwgPSAnSGFyZHdhcmUnO1xyXG4gICAgICAgIG9wdGlvbi52YWx1ZSA9IFwiaGFyZHdhcmVcIlxyXG4gICAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChvcHRpb24pO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0ZWFtLnNraWxscy5pZGVhKSB7XHJcbiAgICAgICAgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcbiAgICAgICAgb3B0aW9uLmlubmVySFRNTCA9ICdJZGVhJztcclxuICAgICAgICBvcHRpb24udmFsdWUgPSBcImlkZWFcIlxyXG4gICAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChvcHRpb24pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzZWxlY3Qub25jaGFuZ2UgPSBmdW5jdGlvbiBzZWxlY3RDaGFuZ2VkKGUpIHtcclxuICAgICAgICB2YWx1ZSA9IGUudGFyZ2V0LnZhbHVlXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHN3YWwoe1xyXG4gICAgICAgIHRpdGxlOiBcIlBsZWFzZSBzZWxlY3QgeW91ciBza2lsbCB0byBqb2luXCIsXHJcblxyXG4gICAgICAgIGNvbnRlbnQ6IHtcclxuICAgICAgICAgIGVsZW1lbnQ6IHNlbGVjdCxcclxuICAgICAgICB9XHJcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICBuZXd1c2VyID0geyBpZDogY3VycmVudFVzZXIuZGF0YS5faWQsIG5hbWU6IGN1cnJlbnRVc2VyLmRhdGEucHJvZmlsZS5uYW1lLCBza2lsbDogdmFsdWUgfTtcclxuICAgICAgICBUZWFtU2VydmljZS5qb2luKHRlYW0uX2lkLCBuZXd1c2VyKTtcclxuICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgXCJKb2luZWRcIixcclxuICAgICAgICAgIFwiWW91IGhhdmUgYXBwbGljZWQgdG8gam9pbiB0aGlzIHRlYW0sIHdhaXQgZm9yIHRoZSBUZWFtLUFkbWluIHRvIGFjY2VwdCB5b3VyIGFwcGxpY2F0aW9uLlwiLFxyXG4gICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICApO1xyXG4gICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcclxuICAgICAgfSlcclxuICAgIH1cclxuXHJcblxyXG4gICAgJHNjb3BlLmFjY2VwdE1lbWJlciA9IGZ1bmN0aW9uICh0ZWFtSUQsIG1lbWJlciwgaW5kZXgpIHtcclxuXHJcbiAgICAgIHN3YWwoe1xyXG4gICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXHJcbiAgICAgICAgdGV4dDogXCJZb3UgYXJlIGFib3V0IHRvIGFjY2VwdCBcIiArIG1lbWJlci5uYW1lICsgXCIgdG8geW91ciB0ZWFtISBUaGlzIHdpbGwgc2VuZCBoaW0gYSBub3RpZmljYXRpb24gZW1haWwgYW5kIHdpbGwgc2hvdyBpbiB0aGUgcHVibGljIHRlYW1zIHBhZ2UuXCIsXHJcbiAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgY2FuY2VsOiB7XHJcbiAgICAgICAgICAgIHRleHQ6IFwiQ2FuY2VsXCIsXHJcbiAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgY2hlY2tJbjoge1xyXG4gICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxyXG4gICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcclxuICAgICAgICAgICAgdGV4dDogXCJZZXMsIGxldCBoaW0gaW5cIixcclxuICAgICAgICAgICAgdmFsdWU6IHRydWUsXHJcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgVGVhbVNlcnZpY2UuYWNjZXB0TWVtYmVyKHRlYW1JRCwgbWVtYmVyLCBTZXR0aW5ncy5tYXhUZWFtU2l6ZSkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICBpZiAocmVzcG9uc2UgPT0gXCJtYXhUZWFtU2l6ZVwiKSB7XHJcbiAgICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgICAgXCJFcnJvclwiLFxyXG4gICAgICAgICAgICAgIFwiTWF4aW11bSBudW1iZXIgb2YgbWVtYmVycyAoXCIgKyBTZXR0aW5ncy5tYXhUZWFtU2l6ZSArIFwiKSByZWFjaGVkXCIsXHJcbiAgICAgICAgICAgICAgXCJlcnJvclwiXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBUZWFtU2VydmljZS5yZW1vdmVqb2luKHRlYW1JRCwgaW5kZXgsIGZhbHNlKS50aGVuKHJlc3BvbnNlMiA9PiB7XHJcbiAgICAgICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgICAgIFwiQWNjZXB0ZWRcIixcclxuICAgICAgICAgICAgICAgIG1lbWJlci5uYW1lICsgXCIgaGFzIGJlZW4gYWNjZXB0ZWQgdG8geW91ciB0ZWFtLlwiLFxyXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgJHNjb3BlLnJlZnVzZU1lbWJlciA9IGZ1bmN0aW9uICh0ZWFtSUQsIG1lbWJlciwgaW5kZXgpIHtcclxuICAgICAgc3dhbCh7XHJcbiAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIixcclxuICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gcmVmdXNlIFwiICsgbWVtYmVyLm5hbWUgKyBcIiBmcm9tIHlvdXIgdGVhbSEgVGhpcyB3aWxsIHNlbmQgaGltIGEgbm90aWZpY2F0aW9uIGVtYWlsLlwiLFxyXG4gICAgICAgIGljb246IFwid2FybmluZ1wiLFxyXG4gICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgIGNhbmNlbDoge1xyXG4gICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxyXG4gICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGNoZWNrSW46IHtcclxuICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcclxuICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgIHRleHQ6IFwiWWVzLCByZWZ1c2UgaGltXCIsXHJcbiAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFRlYW1TZXJ2aWNlLnJlbW92ZWpvaW4odGVhbUlELCBpbmRleCwgbWVtYmVyKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgIFwiUmVmdXNlZFwiLFxyXG4gICAgICAgICAgICBtZW1iZXIubmFtZSArIFwiIGhhcyBiZWVuIHJlZnVzZWQgZnJvbSB5b3VyIHRlYW0uXCIsXHJcbiAgICAgICAgICAgIFwic3VjY2Vzc1wiXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgJHNjb3BlLnJlbW92ZU1lbWJlcmZyb21UZWFtID0gZnVuY3Rpb24gKHRlYW1JRCwgbWVtYmVyLCBpbmRleCkge1xyXG4gICAgICBzd2FsKHtcclxuICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxyXG4gICAgICAgIHRleHQ6IFwiWW91IGFyZSBhYm91dCB0byByZW1vdmUgXCIgKyBtZW1iZXIubmFtZSArIFwiIGZyb20geW91ciB0ZWFtISBUaGlzIHdpbGwgc2VuZCBoaW0gYSBub3RpZmljYXRpb24gZW1haWwuXCIsXHJcbiAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgY2FuY2VsOiB7XHJcbiAgICAgICAgICAgIHRleHQ6IFwiQ2FuY2VsXCIsXHJcbiAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgY2hlY2tJbjoge1xyXG4gICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxyXG4gICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcclxuICAgICAgICAgICAgdGV4dDogXCJZZXMsIHJlbW92ZSBoaW1cIixcclxuICAgICAgICAgICAgdmFsdWU6IHRydWUsXHJcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgVGVhbVNlcnZpY2UucmVtb3ZlbWVtYmVyKHRlYW1JRCwgaW5kZXgsIG1lbWJlci5pZCkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICBpZiAocmVzcG9uc2UgPT0gXCJyZW1vdmluZ0FkbWluXCIpIHtcclxuICAgICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgICBcIkVycm9yXCIsXHJcbiAgICAgICAgICAgICAgXCJZb3UgY2FuJ3QgcmVtb3ZlIHRoZSBUZWFtIEFkbWluLCBCdXQgeW91IGNhbiBjbG9zZSB0aGUgdGVhbS5cIixcclxuICAgICAgICAgICAgICBcImVycm9yXCJcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIFRlYW1TZXJ2aWNlLnJlbW92ZWpvaW4odGVhbUlELCBpbmRleCwgZmFsc2UpLnRoZW4ocmVzcG9uc2UyID0+IHtcclxuICAgICAgICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgICAgICAgXCJSZW1vdmVkXCIsXHJcbiAgICAgICAgICAgICAgICBtZW1iZXIubmFtZSArIFwiIGhhcyBiZWVuIHJlbW92ZWQgZnJvbSB5b3VyIHRlYW0uXCIsXHJcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIlxyXG4gICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICAkc2NvcGUucmVtb3ZlVGVhbSA9IGZ1bmN0aW9uICh0ZWFtKSB7XHJcbiAgICAgIHN3YWwoe1xyXG4gICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXHJcbiAgICAgICAgdGV4dDogXCJZb3UgYXJlIGFib3V0IHRvIHJlbW92ZSB0aGlzIHRlYW0gd2l0aCBhbGwgaXQncyBtZW1iZXJzISBUaGlzIHdpbGwgc2VuZCB0aGVtIGEgbm90aWZpY2F0aW9uIGVtYWlsLiBZb3UgbmVlZCB0byBmaW5kIGFub3RoZXIgdGVhbSB0byB3b3JrIHdpdGguXCIsXHJcbiAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgY2FuY2VsOiB7XHJcbiAgICAgICAgICAgIHRleHQ6IFwiQ2FuY2VsXCIsXHJcbiAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgY2hlY2tJbjoge1xyXG4gICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxyXG4gICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcclxuICAgICAgICAgICAgdGV4dDogXCJZZXMsIHJlbW92ZSB0ZWFtXCIsXHJcbiAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBlbWFpbCA9IHtcclxuICAgICAgICAgIHN1YmplY3Q6IFwiWW91ciB0ZWFtIGhhcyBiZWVuIHJlbW92ZWRcIixcclxuICAgICAgICAgIHRpdGxlOiBcIlRpbWUgZm9yIGEgYmFja3VwIHBsYW5cIixcclxuICAgICAgICAgIGJvZHk6IFwiVGhlIHRlYW0geW91IGhhdmUgYmVlbiBwYXJ0IChNZW1iZXIvcmVxdWVzdGVkIHRvIGpvaW4pIG9mIGhhcyBiZWVuIHJlbW92ZWQuIFBsZWFzZSBjaGVjayB5b3VyIGRhc2hib2FyZCBhbmQgdHJ5IHRvIGZpbmQgYW5vdGhlciB0ZWFtIHRvIHdvcmsgd2l0aCBiZWZvcmUgdGhlIGhhY2thdGhvbiBzdGFydHMuXCJcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFRlYW1TZXJ2aWNlLnJlbW92ZSh0ZWFtLl9pZCkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICB0ZWFtLm1lbWJlcnMuZm9yRWFjaCh1c2VyID0+IHtcclxuICAgICAgICAgICAgVXNlclNlcnZpY2Uuc2VuZEJhc2ljTWFpbCh1c2VyLmlkLCBlbWFpbCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHRlYW0uam9pblJlcXVlc3RzLmZvckVhY2godXNlciA9PiB7XHJcbiAgICAgICAgICAgIFVzZXJTZXJ2aWNlLnNlbmRCYXNpY01haWwodXNlci5pZCwgZW1haWwpO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgXCJSZW1vdmVkXCIsXHJcbiAgICAgICAgICAgIFwiVGVhbSBoYXMgYmVlbiByZW1vdmVkLlwiLFxyXG4gICAgICAgICAgICBcInN1Y2Nlc3NcIlxyXG4gICAgICAgICAgKTtcclxuICAgICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgICRzY29wZS5sZWF2ZVRlYW0gPSBmdW5jdGlvbiAodGVhbSkge1xyXG4gICAgICBzd2FsKHtcclxuICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxyXG4gICAgICAgIHRleHQ6IFwiWW91IGFyZSBhYm91dCB0byBsZWF2ZSB5b3VyIHRlYW0hIFRoaXMgd2lsbCBzZW5kIHRoZSBhZG1pbiBhIG5vdGlmaWNhdGlvbiBlbWFpbC5cIixcclxuICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcclxuICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgdGV4dDogXCJDYW5jZWxcIixcclxuICAgICAgICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBjaGVja0luOiB7XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXHJcbiAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlLFxyXG4gICAgICAgICAgICB0ZXh0OiBcIlllcywgcmVtb3ZlIGhpbVwiLFxyXG4gICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XHJcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgaW5kZXggPSAwO1xyXG4gICAgICAgIHRlYW0ubWVtYmVycy5mb3JFYWNoKG1lbWJlciA9PiB7XHJcbiAgICAgICAgICBpZiAobWVtYmVyLmlkID09IGN1cnJlbnRVc2VyLmRhdGEuX2lkKSB7XHJcbiAgICAgICAgICAgIFRlYW1TZXJ2aWNlLnJlbW92ZW1lbWJlcih0ZWFtLl9pZCwgaW5kZXgpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgICAgICBcIlJlbW92ZWRcIixcclxuICAgICAgICAgICAgICAgIFwiWW91IGhhdmUgc3VjY2Vzc2Z1bGx5IGxlZnQgdGhpcyB0ZWFtLiBQbGVhc2UgZmluZCBhbm90aGVyIHRlYW0gb3IgY3JlYXRlIHlvdXIgb3duLlwiLFxyXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaW5kZXgrKztcclxuICAgICAgICB9KVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgJHNjb3BlLmNhbmNlbGpvaW5UZWFtID0gZnVuY3Rpb24gKHRlYW0pIHtcclxuICAgICAgc3dhbCh7XHJcbiAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIixcclxuICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gY2FuY2VsIHlvdXIgcmVxdWVzdCB0byBqb2luIHRoaXMgdGVhbSFcIixcclxuICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcclxuICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgdGV4dDogXCJOb1wiLFxyXG4gICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGNoZWNrSW46IHtcclxuICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcclxuICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgIHRleHQ6IFwiWWVzLCBDYW5jZWxcIixcclxuICAgICAgICAgICAgdmFsdWU6IHRydWUsXHJcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGluZGV4ID0gMDtcclxuXHJcbiAgICAgICAgdGVhbS5qb2luUmVxdWVzdHMuZm9yRWFjaChtZW1iZXIgPT4ge1xyXG4gICAgICAgICAgaWYgKG1lbWJlci5pZCA9PSBjdXJyZW50VXNlci5kYXRhLl9pZCkge1xyXG4gICAgICAgICAgICBUZWFtU2VydmljZS5yZW1vdmVqb2luKHRlYW0uX2lkLCBpbmRleCwgZmFsc2UpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgICAgICBcIlJlbW92ZWRcIixcclxuICAgICAgICAgICAgICAgIFwiWW91IGhhdmUgc3VjY2Vzc2Z1bGx5IGNhbmNlbGVkIHlvdSByZXF1ZXN0IHRvIGpvaW4gdGhpcyB0ZWFtLiBQbGVhc2UgZmluZCBhbm90aGVyIHRlYW0gb3IgY3JlYXRlIHlvdXIgb3duLlwiLFxyXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaW5kZXgrKztcclxuICAgICAgICB9KVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgJHNjb3BlLnRvZ2dsZUNsb3NlVGVhbSA9IGZ1bmN0aW9uICh0ZWFtSUQsIHN0YXR1cykge1xyXG4gICAgICBpZiAoc3RhdHVzID09IHRydWUpIHtcclxuICAgICAgICB0ZXh0ID0gXCJZb3UgYXJlIGFib3V0IHRvIENsb3NlIHRoaXMgdGVhbS4gVGhpcyB3b24ndCBhbGxvdyBvdGhlciBtZW1iZXJzIHRvIGpvaW4geW91ciB0ZWFtIVwiXHJcbiAgICAgIH0gZWxzZSB7IHRleHQgPSBcIllvdSBhcmUgYWJvdXQgdG8gcmVvcGVuIHRoaXMgdGVhbS4gVGhpcyB3aWxsIGFsbG93IG90aGVyIG1lbWJlcnMgdG8gam9pbiB5b3VyIHRlYW0hXCIgfVxyXG5cclxuICAgICAgc3dhbCh7XHJcbiAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIixcclxuICAgICAgICB0ZXh0OiB0ZXh0LFxyXG4gICAgICAgIGljb246IFwid2FybmluZ1wiLFxyXG4gICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgIGNhbmNlbDoge1xyXG4gICAgICAgICAgICB0ZXh0OiBcIk5vXCIsXHJcbiAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgY2hlY2tJbjoge1xyXG4gICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxyXG4gICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcclxuICAgICAgICAgICAgdGV4dDogXCJZZXNcIixcclxuICAgICAgICAgICAgdmFsdWU6IHRydWUsXHJcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgVGVhbVNlcnZpY2UudG9nZ2xlQ2xvc2VUZWFtKHRlYW1JRCwgc3RhdHVzKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgIFwiRG9uZVwiLFxyXG4gICAgICAgICAgICBcIk9wZXJhdGlvbiBzdWNjZXNzZnVsbHkgQ29tcGxldGVkLlwiLFxyXG4gICAgICAgICAgICBcInN1Y2Nlc3NcIlxyXG4gICAgICAgICAgKTtcclxuICAgICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICAkc2NvcGUudG9nZ2xlSGlkZVRlYW0gPSBmdW5jdGlvbiAodGVhbUlELCBzdGF0dXMpIHtcclxuICAgICAgaWYgKHN0YXR1cyA9PSB0cnVlKSB7XHJcbiAgICAgICAgdGV4dCA9IFwiWW91IGFyZSBhYm91dCB0byBIaWRlIHRoaXMgdGVhbS4gVGhpcyB3b24ndCBhbGxvdyBvdGhlciBtZW1iZXJzIHRvIHNlZSB5b3VyIHRlYW0hXCJcclxuICAgICAgfSBlbHNlIHsgdGV4dCA9IFwiWW91IGFyZSBhYm91dCB0byBTaG93IHRoaXMgdGVhbS4gVGhpcyB3aWxsIGFsbG93IG90aGVyIG1lbWJlcnMgdG8gc2VlIHlvdXIgdGVhbSFcIiB9XHJcblxyXG4gICAgICBzd2FsKHtcclxuICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxyXG4gICAgICAgIHRleHQ6IHRleHQsXHJcbiAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgY2FuY2VsOiB7XHJcbiAgICAgICAgICAgIHRleHQ6IFwiTm9cIixcclxuICAgICAgICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBjaGVja0luOiB7XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXHJcbiAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlLFxyXG4gICAgICAgICAgICB0ZXh0OiBcIlllc1wiLFxyXG4gICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XHJcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBUZWFtU2VydmljZS50b2dnbGVIaWRlVGVhbSh0ZWFtSUQsIHN0YXR1cykudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgICBcIkRvbmVcIixcclxuICAgICAgICAgICAgXCJPcGVyYXRpb24gc3VjY2Vzc2Z1bGx5IENvbXBsZXRlZC5cIixcclxuICAgICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS4kd2F0Y2goXCJxdWVyeVRleHRcIiwgZnVuY3Rpb24gKHF1ZXJ5VGV4dCkge1xyXG4gICAgICBUZWFtU2VydmljZS5nZXRTZWxlY3RlZFRlYW1zKHF1ZXJ5VGV4dCwgJHNjb3BlLnNraWxsc0ZpbHRlcnMpLnRoZW4oXHJcbiAgICAgICAgcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgJHNjb3BlLnRlYW1zID0gcmVzcG9uc2UuZGF0YS50ZWFtcztcclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkc2NvcGUuYXBwbHlza2lsbHNGaWx0ZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIFRlYW1TZXJ2aWNlLmdldFNlbGVjdGVkVGVhbXMoJHNjb3BlLnF1ZXJ5VGV4dCwgJHNjb3BlLnNraWxsc0ZpbHRlcnMpLnRoZW4oXHJcbiAgICAgICAgcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgJHNjb3BlLnRlYW1zID0gcmVzcG9uc2UuZGF0YS50ZWFtcztcclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5hY2NlcHRUZWFtID0gZnVuY3Rpb24gKHRlYW0pIHtcclxuICAgICAgdGVhbS5tZW1iZXJzLmZvckVhY2godXNlciA9PiB7XHJcbiAgICAgICAgVXNlclNlcnZpY2Uuc29mdEFkbWl0dFVzZXIodXNlci5pZCk7XHJcbiAgICAgIH0pLnRoZW4oZT0+e1xyXG4gICAgICAgIHN3YWwoXHJcbiAgICAgICAgICBcIkRvbmVcIixcclxuICAgICAgICAgIFwiQWxsIHVzZXJzIHNvZnRBY2NlcHRlZC5cIixcclxuICAgICAgICAgIFwic3VjY2Vzc1wiXHJcbiAgICAgICAgKTsgIFxyXG4gICAgICB9KVxyXG4gICAgfVxyXG5cclxuICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5jb250cm9sbGVyKCdBZG1pblVzZXJDdHJsJyxbXHJcbiAgICAnJHNjb3BlJyxcclxuICAgICckaHR0cCcsXHJcbiAgICAndXNlcicsXHJcbiAgICAnVXNlclNlcnZpY2UnLFxyXG4gICAgZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCwgVXNlciwgVXNlclNlcnZpY2Upe1xyXG4gICAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyID0gVXNlci5kYXRhO1xyXG5cclxuICAgICAgLy8gUG9wdWxhdGUgdGhlIHNjaG9vbCBkcm9wZG93blxyXG4gICAgICBwb3B1bGF0ZVNjaG9vbHMoKTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIHBvcHVsYXRlU2Nob29scygpe1xyXG5cclxuICAgICAgICAkaHR0cFxyXG4gICAgICAgICAgLmdldCgnL2Fzc2V0cy9zY2hvb2xzLmpzb24nKVxyXG4gICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzKXtcclxuICAgICAgICAgICAgdmFyIHNjaG9vbHMgPSByZXMuZGF0YTtcclxuICAgICAgICAgICAgdmFyIGVtYWlsID0gJHNjb3BlLnNlbGVjdGVkVXNlci5lbWFpbC5zcGxpdCgnQCcpWzFdO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNjaG9vbHNbZW1haWxdKXtcclxuICAgICAgICAgICAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyLnByb2ZpbGUuc2Nob29sID0gc2Nob29sc1tlbWFpbF0uc2Nob29sO1xyXG4gICAgICAgICAgICAgICRzY29wZS5hdXRvRmlsbGVkU2Nob29sID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG5cclxuICAgICAgJHNjb3BlLnVwZGF0ZVByb2ZpbGUgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIFVzZXJTZXJ2aWNlXHJcbiAgICAgICAgICAudXBkYXRlUHJvZmlsZSgkc2NvcGUuc2VsZWN0ZWRVc2VyLl9pZCwgJHNjb3BlLnNlbGVjdGVkVXNlci5wcm9maWxlKVxyXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAkc2VsZWN0ZWRVc2VyID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgc3dhbChcIlVwZGF0ZWQhXCIsIFwiUHJvZmlsZSB1cGRhdGVkLlwiLCBcInN1Y2Nlc3NcIik7XHJcbiAgICAgICAgICB9LCByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHN3YWwoXCJPb3BzLCB5b3UgZm9yZ290IHNvbWV0aGluZy5cIik7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcblxyXG4gICAgICAkc2NvcGUudXBkYXRlQ29uZmlybWF0aW9uID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBVc2VyU2VydmljZVxyXG4gICAgICAgICAgLnVwZGF0ZUNvbmZpcm1hdGlvbigkc2NvcGUuc2VsZWN0ZWRVc2VyLl9pZCwgJHNjb3BlLnNlbGVjdGVkVXNlci5jb25maXJtYXRpb24pXHJcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICRzZWxlY3RlZFVzZXIgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICBzd2FsKFwiVXBkYXRlZCFcIiwgXCJDb25maXJtYXRpb24gdXBkYXRlZC5cIiwgXCJzdWNjZXNzXCIpO1xyXG4gICAgICAgICAgfSwgcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBzd2FsKFwiT29wcywgeW91IGZvcmdvdCBzb21ldGhpbmcuXCIpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG5cclxuICAgICAgJHNjb3BlLnVwZGF0ZUFsbFVzZXIgPSBmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICBVc2VyU2VydmljZVxyXG4gICAgICAgICAgLnVwZGF0ZUFsbCgkc2NvcGUuc2VsZWN0ZWRVc2VyLl9pZCwgJHNjb3BlLnNlbGVjdGVkVXNlcilcclxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgJHNlbGVjdGVkVXNlciA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgIHN3YWwoXCJVcGRhdGVkIVwiLCBcIkFMTCBQcm9maWxlIHVwZGF0ZWQuXCIsIFwic3VjY2Vzc1wiKTtcclxuICAgICAgICAgIH0sIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgc3dhbChcIk9vcHMsIHlvdSBmb3Jnb3Qgc29tZXRoaW5nLlwiKTtcclxuICAgICAgICAgIH0pOyAgXHJcbiAgICAgIH07XHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIH1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoXCJyZWdcIikuY29udHJvbGxlcihcIkFkbWluVXNlcnNDdHJsXCIsIFtcclxuICBcIiRzY29wZVwiLFxyXG4gIFwiJHN0YXRlXCIsXHJcbiAgXCIkc3RhdGVQYXJhbXNcIixcclxuICBcIlVzZXJTZXJ2aWNlXCIsXHJcbiAgJ0F1dGhTZXJ2aWNlJyxcclxuICBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgVXNlclNlcnZpY2UsIEF1dGhTZXJ2aWNlKSB7XHJcbiAgICAkc2NvcGUucGFnZXMgPSBbXTtcclxuICAgICRzY29wZS51c2VycyA9IFtdO1xyXG5cclxuICAgIC8vIFNlbWFudGljLVVJIG1vdmVzIG1vZGFsIGNvbnRlbnQgaW50byBhIGRpbW1lciBhdCB0aGUgdG9wIGxldmVsLlxyXG4gICAgLy8gV2hpbGUgdGhpcyBpcyB1c3VhbGx5IG5pY2UsIGl0IG1lYW5zIHRoYXQgd2l0aCBvdXIgcm91dGluZyB3aWxsIGdlbmVyYXRlXHJcbiAgICAvLyBtdWx0aXBsZSBtb2RhbHMgaWYgeW91IGNoYW5nZSBzdGF0ZS4gS2lsbCB0aGUgdG9wIGxldmVsIGRpbW1lciBub2RlIG9uIGluaXRpYWwgbG9hZFxyXG4gICAgLy8gdG8gcHJldmVudCB0aGlzLlxyXG4gICAgJChcIi51aS5kaW1tZXJcIikucmVtb3ZlKCk7XHJcbiAgICAvLyBQb3B1bGF0ZSB0aGUgc2l6ZSBvZiB0aGUgbW9kYWwgZm9yIHdoZW4gaXQgYXBwZWFycywgd2l0aCBhbiBhcmJpdHJhcnkgdXNlci5cclxuICAgICRzY29wZS5zZWxlY3RlZFVzZXIgPSB7fTtcclxuICAgICRzY29wZS5zZWxlY3RlZFVzZXIuc2VjdGlvbnMgPSBnZW5lcmF0ZVNlY3Rpb25zKHtcclxuICAgICAgc3RhdHVzOiBcIlwiLFxyXG4gICAgICBjb25maXJtYXRpb246IHtcclxuICAgICAgICBkaWV0YXJ5UmVzdHJpY3Rpb25zOiBbXVxyXG4gICAgICB9LFxyXG4gICAgICBwcm9maWxlOiBcIlwiXHJcbiAgICB9KTtcclxuXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVQYWdlKGRhdGEpIHtcclxuICAgICAgJHNjb3BlLnVzZXJzID0gZGF0YS51c2VycztcclxuICAgICAgJHNjb3BlLmN1cnJlbnRQYWdlID0gZGF0YS5wYWdlO1xyXG4gICAgICAkc2NvcGUucGFnZVNpemUgPSBkYXRhLnNpemU7XHJcblxyXG4gICAgICB2YXIgcCA9IFtdO1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEudG90YWxQYWdlczsgaSsrKSB7XHJcbiAgICAgICAgcC5wdXNoKGkpO1xyXG4gICAgICB9XHJcbiAgICAgICRzdGF0ZS5nbyhcImFwcC5hZG1pbi51c2Vyc1wiLCB7XHJcbiAgICAgICAgcGFnZTogMCxcclxuICAgICAgICBzaXplOiAkc3RhdGVQYXJhbXMuc2l6ZSB8fCAyMFxyXG4gICAgICB9KTtcclxuICAgICAgJHNjb3BlLnBhZ2VzID0gcDtcclxuICAgIH1cclxuXHJcbiAgICBVc2VyU2VydmljZS5nZXRQYWdlKCRzdGF0ZVBhcmFtcy5wYWdlLCAkc3RhdGVQYXJhbXMuc2l6ZSwgJHN0YXRlUGFyYW1zLnF1ZXJ5LCAkc2NvcGUuc3RhdHVzRmlsdGVycylcclxuICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG5cclxuICAgICAgICB1cGRhdGVQYWdlKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAkc2NvcGUuJHdhdGNoKFwicXVlcnlUZXh0XCIsIGZ1bmN0aW9uIChxdWVyeVRleHQpIHtcclxuICAgICAgVXNlclNlcnZpY2UuZ2V0UGFnZSgkc3RhdGVQYXJhbXMucGFnZSwgJHN0YXRlUGFyYW1zLnNpemUsIHF1ZXJ5VGV4dCwgJHNjb3BlLnN0YXR1c0ZpbHRlcnMpLnRoZW4oXHJcbiAgICAgICAgcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgdXBkYXRlUGFnZShyZXNwb25zZS5kYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgJHNjb3BlLmFwcGx5U3RhdHVzRmlsdGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBVc2VyU2VydmljZVxyXG4gICAgICAgIC5nZXRQYWdlKCRzdGF0ZVBhcmFtcy5wYWdlLCAkc3RhdGVQYXJhbXMuc2l6ZSwgJHNjb3BlLnF1ZXJ5VGV4dCwgJHNjb3BlLnN0YXR1c0ZpbHRlcnMsICRzY29wZS5Ob3RzdGF0dXNGaWx0ZXJzKS50aGVuKFxyXG4gICAgICAgICAgcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICB1cGRhdGVQYWdlKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAkc2NvcGUuZ29Ub1BhZ2UgPSBmdW5jdGlvbiAocGFnZSkge1xyXG4gICAgICAkc3RhdGUuZ28oXCJhcHAuYWRtaW4udXNlcnNcIiwge1xyXG4gICAgICAgIHBhZ2U6IHBhZ2UsXHJcbiAgICAgICAgc2l6ZTogJHN0YXRlUGFyYW1zLnNpemUgfHwgMjBcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5nb1VzZXIgPSBmdW5jdGlvbiAoJGV2ZW50LCB1c2VyKSB7XHJcbiAgICAgICRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgICRzdGF0ZS5nbyhcImFwcC5hZG1pbi51c2VyXCIsIHtcclxuICAgICAgICBpZDogdXNlci5faWRcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAkc2NvcGUuYWNjZXB0VXNlciA9IGZ1bmN0aW9uICgkZXZlbnQsIHVzZXIsIGluZGV4KSB7XHJcbiAgICAgICRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgc3dhbCh7XHJcbiAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgY2FuY2VsOiB7XHJcbiAgICAgICAgICAgIHRleHQ6IFwiQ2FuY2VsXCIsXHJcbiAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgYWNjZXB0OiB7XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXHJcbiAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlLFxyXG4gICAgICAgICAgICB0ZXh0OiBcIlllcywgYWNjZXB0IHRoZW1cIixcclxuICAgICAgICAgICAgdmFsdWU6IHRydWUsXHJcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGRhbmdlck1vZGU6IHRydWUsXHJcbiAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgdGV4dDogXCJZb3UgYXJlIGFib3V0IHRvIGFjY2VwdCBcIiArIHVzZXIucHJvZmlsZS5uYW1lICsgXCIhXCIsXHJcbiAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIlxyXG4gICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeWVzOiB7XHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcclxuICAgICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcclxuICAgICAgICAgICAgICB0ZXh0OiBcIlllcywgYWNjZXB0IHRoaXMgdXNlclwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGRhbmdlck1vZGU6IHRydWUsXHJcbiAgICAgICAgICB0aXRsZTogXCJBcmUgeW91IHN1cmU/XCIsXHJcbiAgICAgICAgICB0ZXh0OlxyXG4gICAgICAgICAgICBcIllvdXIgYWNjb3VudCB3aWxsIGJlIGxvZ2dlZCBhcyBoYXZpbmcgYWNjZXB0ZWQgdGhpcyB1c2VyLiBcIiArXHJcbiAgICAgICAgICAgIFwiUmVtZW1iZXIsIHRoaXMgcG93ZXIgaXMgYSBwcml2aWxlZ2UuXCIsXHJcbiAgICAgICAgICBpY29uOiBcIndhcm5pbmdcIlxyXG4gICAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgVXNlclNlcnZpY2Uuc29mdEFkbWl0dFVzZXIodXNlci5faWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAkc2NvcGUudXNlcnNbaW5kZXhdID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgICBcIkFjY2VwdGVkXCIsXHJcbiAgICAgICAgICAgICAgcmVzcG9uc2UuZGF0YS5wcm9maWxlLm5hbWUgKyBcIiBoYXMgYmVlbiBhZG1pdHRlZC5cIixcclxuICAgICAgICAgICAgICBcInN1Y2Nlc3NcIlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuXHJcblxyXG4gICAgJHNjb3BlLnJlamVjdHRVc2VyID0gZnVuY3Rpb24gKCRldmVudCwgdXNlciwgaW5kZXgpIHtcclxuICAgICAgJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBzd2FsKHtcclxuICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgdGV4dDogXCJDYW5jZWxcIixcclxuICAgICAgICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBhY2NlcHQ6IHtcclxuICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcclxuICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgIHRleHQ6IFwiWWVzLCByZWplY3QgdGhlbVwiLFxyXG4gICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGFuZ2VyTW9kZTogdHJ1ZSxcclxuICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcclxuICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gcmVqZWN0IFwiICsgdXNlci5wcm9maWxlLm5hbWUgKyBcIiFcIixcclxuICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiXHJcbiAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeWVzOiB7XHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcclxuICAgICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcclxuICAgICAgICAgICAgICB0ZXh0OiBcIlllcywgcmVqZWN0IHRoaXMgdXNlclwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGRhbmdlck1vZGU6IHRydWUsXHJcbiAgICAgICAgICB0aXRsZTogXCJBcmUgeW91IHN1cmU/XCIsXHJcbiAgICAgICAgICB0ZXh0OlxyXG4gICAgICAgICAgICBcIllvdXIgYWNjb3VudCB3aWxsIGJlIGxvZ2dlZCBhcyBoYXZpbmcgcmVqZWN0ZWQgdGhpcyB1c2VyLiBcIiArXHJcbiAgICAgICAgICAgIFwiUmVtZW1iZXIsIHRoaXMgcG93ZXIgaXMgYSBwcml2aWxlZ2UuXCIsXHJcbiAgICAgICAgICBpY29uOiBcIndhcm5pbmdcIlxyXG4gICAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgVXNlclNlcnZpY2Uuc29mdFJlamVjdFVzZXIodXNlci5faWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAkc2NvcGUudXNlcnNbaW5kZXhdID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgICBcIlJlamVjdGVkXCIsXHJcbiAgICAgICAgICAgICAgcmVzcG9uc2UuZGF0YS5wcm9maWxlLm5hbWUgKyBcIiBoYXMgYmVlbiByZWplY3RlZC5cIixcclxuICAgICAgICAgICAgICBcInN1Y2Nlc3NcIlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuXHJcblxyXG5cclxuICAgICRzY29wZS5yZW1vdmVVc2VyID0gZnVuY3Rpb24gKCRldmVudCwgdXNlciwgaW5kZXgpIHtcclxuICAgICAgJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuXHJcbiAgICAgIHN3YWwoe1xyXG4gICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgIGNhbmNlbDoge1xyXG4gICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxyXG4gICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGFjY2VwdDoge1xyXG4gICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxyXG4gICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcclxuICAgICAgICAgICAgdGV4dDogXCJZZXMsIHJlbW92ZSB0aGVtXCIsXHJcbiAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkYW5nZXJNb2RlOiB0cnVlLFxyXG4gICAgICAgIGljb246IFwid2FybmluZ1wiLFxyXG4gICAgICAgIHRleHQ6IFwiWW91IGFyZSBhYm91dCB0byByZW1vdmUgXCIgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiIVwiLFxyXG4gICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCJcclxuICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XHJcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgIGNhbmNlbDoge1xyXG4gICAgICAgICAgICAgIHRleHQ6IFwiQ2FuY2VsXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB5ZXM6IHtcclxuICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxyXG4gICAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIHRleHQ6IFwiWWVzLCByZW1vdmUgdGhpcyB1c2VyXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHRydWUsXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZGFuZ2VyTW9kZTogdHJ1ZSxcclxuICAgICAgICAgIHRpdGxlOiBcIkFyZSB5b3Ugc3VyZT9cIixcclxuICAgICAgICAgIHRleHQ6XHJcbiAgICAgICAgICAgIFwiWW91ciBhY2NvdW50IHdpbGwgYmUgbG9nZ2VkIGFzIGhhdmluZyByZW1vdmVkIHRoaXMgdXNlci4gXCIgK1xyXG4gICAgICAgICAgICBcIlJlbWVtYmVyLCB0aGlzIHBvd2VyIGlzIGEgcHJpdmlsZWdlLlwiLFxyXG4gICAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCJcclxuICAgICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIFVzZXJTZXJ2aWNlLnJlbW92ZVVzZXIodXNlci5faWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAkc2NvcGUudXNlcnNbaW5kZXhdID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgICBcIlJlbW92ZWRcIixcclxuICAgICAgICAgICAgICByZXNwb25zZS5kYXRhLnByb2ZpbGUubmFtZSArIFwiIGhhcyBiZWVuIHJlbW92ZWQuXCIsXHJcbiAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuc2VuZEFjY2VwdGFuY2VFbWFpbHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGNvbnN0IGZpbHRlclNvZnRBY2NlcHRlZCA9ICRzY29wZS51c2Vycy5maWx0ZXIoXHJcbiAgICAgICAgdSA9PiB1LnN0YXR1cy5zb2Z0QWRtaXR0ZWQgJiYgIXUuc3RhdHVzLmFkbWl0dGVkXHJcbiAgICAgICk7XHJcblxyXG4gICAgICB2YXIgbWVzc2FnZSA9ICQodGhpcykuZGF0YShcImNvbmZpcm1cIik7XHJcblxyXG4gICAgICBzd2FsKHtcclxuICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxyXG4gICAgICAgIHRleHQ6IGBZb3UncmUgYWJvdXQgdG8gc2VuZCBhY2NlcHRhbmNlIGVtYWlscyAoYW5kIGFjY2VwdCkgJHtcclxuICAgICAgICAgIGZpbHRlclNvZnRBY2NlcHRlZC5sZW5ndGhcclxuICAgICAgICAgIH0gdXNlcihzKS5gLFxyXG4gICAgICAgIGljb246IFwid2FybmluZ1wiLFxyXG4gICAgICAgIGJ1dHRvbnM6IFtcIkNhbmNlbFwiLCBcIlllcywgYWNjZXB0IHRoZW0gYW5kIHNlbmQgdGhlIGVtYWlsc1wiXSxcclxuICAgICAgICBkYW5nZXJNb2RlOiB0cnVlXHJcbiAgICAgIH0pLnRoZW4od2lsbFNlbmQgPT4ge1xyXG4gICAgICAgIGlmICh3aWxsU2VuZCkge1xyXG4gICAgICAgICAgaWYgKGZpbHRlclNvZnRBY2NlcHRlZC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgZmlsdGVyU29mdEFjY2VwdGVkLmZvckVhY2godXNlciA9PiB7XHJcbiAgICAgICAgICAgICAgVXNlclNlcnZpY2UuYWRtaXRVc2VyKHVzZXIuX2lkKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgICAgXCJTZW5kaW5nIVwiLFxyXG4gICAgICAgICAgICAgIGBBY2NlcHRpbmcgYW5kIHNlbmRpbmcgZW1haWxzIHRvICR7XHJcbiAgICAgICAgICAgICAgZmlsdGVyU29mdEFjY2VwdGVkLmxlbmd0aFxyXG4gICAgICAgICAgICAgIH0gdXNlcnMhYCxcclxuICAgICAgICAgICAgICBcInN1Y2Nlc3NcIlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc3dhbChcIldob29wc1wiLCBcIllvdSBjYW4ndCBzZW5kIG9yIGFjY2VwdCAwIHVzZXJzIVwiLCBcImVycm9yXCIpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuXHJcblxyXG4gICAgJHNjb3BlLnNlbmRSZWplY3Rpb25FbWFpbHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGNvbnN0IGZpbHRlclNvZnRSZWplY3RlZCA9ICRzY29wZS51c2Vycy5maWx0ZXIoXHJcbiAgICAgICAgdSA9PiB1LnN0YXR1cy5zb2Z0UmVqZWN0ZWRcclxuICAgICAgKTtcclxuXHJcbiAgICAgIHZhciBtZXNzYWdlID0gJCh0aGlzKS5kYXRhKFwiY29uZmlybVwiKTtcclxuXHJcbiAgICAgIHN3YWwoe1xyXG4gICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXHJcbiAgICAgICAgdGV4dDogYFlvdSdyZSBhYm91dCB0byBzZW5kIHJlamVjdGlvbiBlbWFpbHMgKGFuZCByZWplY3QpICR7XHJcbiAgICAgICAgICBmaWx0ZXJTb2Z0UmVqZWN0ZWQubGVuZ3RoXHJcbiAgICAgICAgICB9IHVzZXIocykuYCxcclxuICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcclxuICAgICAgICBidXR0b25zOiBbXCJDYW5jZWxcIiwgXCJZZXMsIHJlamVjdCB0aGVtIGFuZCBzZW5kIHRoZSBlbWFpbHNcIl0sXHJcbiAgICAgICAgZGFuZ2VyTW9kZTogdHJ1ZVxyXG4gICAgICB9KS50aGVuKHdpbGxTZW5kID0+IHtcclxuICAgICAgICBpZiAod2lsbFNlbmQpIHtcclxuICAgICAgICAgIGlmIChmaWx0ZXJTb2Z0UmVqZWN0ZWQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGZpbHRlclNvZnRSZWplY3RlZC5mb3JFYWNoKHVzZXIgPT4ge1xyXG4gICAgICAgICAgICAgIFVzZXJTZXJ2aWNlLnJlamVjdFVzZXIodXNlci5faWQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgICBcIlNlbmRpbmchXCIsXHJcbiAgICAgICAgICAgICAgYFJlamVjdGluZyBhbmQgc2VuZGluZyBlbWFpbHMgdG8gJHtcclxuICAgICAgICAgICAgICBmaWx0ZXJTb2Z0UmVqZWN0ZWQubGVuZ3RoXHJcbiAgICAgICAgICAgICAgfSB1c2VycyFgLFxyXG4gICAgICAgICAgICAgIFwic3VjY2Vzc1wiXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzd2FsKFwiV2hvb3BzXCIsIFwiWW91IGNhbid0IHNlbmQgb3IgcmVqZWN0IDAgdXNlcnMhXCIsIFwiZXJyb3JcIik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG5cclxuICAgICRzY29wZS5leHBvcnRVc2VycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIGNvbHVtbnMgPSBbXCJOwrBcIiwgXCJHZW5kZXJcIiwgXCJGdWxsIE5hbWVcIiwgXCJTY2hvb2xcIl07XHJcbiAgICAgIHZhciByb3dzID0gW107XHJcbiAgICAgIFVzZXJTZXJ2aWNlLmdldEFsbCgpLnRoZW4odXNlcnMgPT4ge1xyXG4gICAgICAgIHZhciBpID0gMTtcclxuICAgICAgICB1c2Vycy5kYXRhLmZvckVhY2godXNlciA9PiB7XHJcbiAgICAgICAgICByb3dzLnB1c2goW2krKywgdXNlci5wcm9maWxlLmdlbmRlciwgdXNlci5wcm9maWxlLm5hbWUsIHVzZXIucHJvZmlsZS5zY2hvb2xdKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZhciBkb2MgPSBuZXcganNQREYoJ3AnLCAncHQnKTtcclxuXHJcblxyXG4gICAgICAgIHZhciB0b3RhbFBhZ2VzRXhwID0gXCJ7dG90YWxfcGFnZXNfY291bnRfc3RyaW5nfVwiO1xyXG5cclxuICAgICAgICB2YXIgcGFnZUNvbnRlbnQgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgLy8gSEVBREVSXHJcbiAgICAgICAgICBkb2Muc2V0Rm9udFNpemUoMjApO1xyXG4gICAgICAgICAgZG9jLnNldFRleHRDb2xvcig0MCk7XHJcbiAgICAgICAgICBkb2Muc2V0Rm9udFN0eWxlKCdub3JtYWwnKTtcclxuICAgICAgICAgIC8vIGlmIChiYXNlNjRJbWcpIHtcclxuICAgICAgICAgIC8vICAgICBkb2MuYWRkSW1hZ2UoYmFzZTY0SW1nLCAnSlBFRycsIGRhdGEuc2V0dGluZ3MubWFyZ2luLmxlZnQsIDE1LCAxMCwgMTApO1xyXG4gICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgZG9jLnRleHQoXCJQYXJ0aWNpcGFudHMgTGlzdFwiLCBkYXRhLnNldHRpbmdzLm1hcmdpbi5sZWZ0ICsgMTUsIDIyKTtcclxuXHJcbiAgICAgICAgICAvLyBGT09URVJcclxuICAgICAgICAgIHZhciBzdHIgPSBcIlBhZ2UgXCIgKyBkYXRhLnBhZ2VDb3VudDtcclxuICAgICAgICAgIC8vIFRvdGFsIHBhZ2UgbnVtYmVyIHBsdWdpbiBvbmx5IGF2YWlsYWJsZSBpbiBqc3BkZiB2MS4wK1xyXG4gICAgICAgICAgaWYgKHR5cGVvZiBkb2MucHV0VG90YWxQYWdlcyA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICBzdHIgPSBzdHIgKyBcIiBvZiBcIiArIHRvdGFsUGFnZXNFeHA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBkb2Muc2V0Rm9udFNpemUoMTApO1xyXG4gICAgICAgICAgdmFyIHBhZ2VIZWlnaHQgPSBkb2MuaW50ZXJuYWwucGFnZVNpemUuaGVpZ2h0IHx8IGRvYy5pbnRlcm5hbC5wYWdlU2l6ZS5nZXRIZWlnaHQoKTtcclxuICAgICAgICAgIGRvYy50ZXh0KHN0ciwgZGF0YS5zZXR0aW5ncy5tYXJnaW4ubGVmdCwgcGFnZUhlaWdodCAtIDEwKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBkb2MuYXV0b1RhYmxlKGNvbHVtbnMsIHJvd3MsIHtcclxuICAgICAgICAgIGFkZFBhZ2VDb250ZW50OiBwYWdlQ29udGVudCxcclxuICAgICAgICAgIG1hcmdpbjogeyB0b3A6IDMwIH0sXHJcbiAgICAgICAgICB0aGVtZTogJ2dyaWQnXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBkb2MucHV0VG90YWxQYWdlcyA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgZG9jLnB1dFRvdGFsUGFnZXModG90YWxQYWdlc0V4cCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRvYy5zYXZlKCdQYXJ0aWNpcGFudHMgTGlzdC5wZGYnKTtcclxuICAgICAgfSlcclxuICAgIH1cclxuXHJcblxyXG4gICAgJHNjb3BlLnRvZ2dsZUFkbWluID0gZnVuY3Rpb24gKCRldmVudCwgdXNlciwgaW5kZXgpIHtcclxuICAgICAgJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgaWYgKCF1c2VyLmFkbWluKSB7XHJcbiAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxyXG4gICAgICAgICAgdGV4dDogXCJZb3UgYXJlIGFib3V0IG1ha2UgXCIgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiIGFuIGFkbWluIVwiLFxyXG4gICAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgIGNhbmNlbDoge1xyXG4gICAgICAgICAgICAgIHRleHQ6IFwiQ2FuY2VsXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb25maXJtOiB7XHJcbiAgICAgICAgICAgICAgdGV4dDogXCJZZXMsIG1ha2UgdGhlbSBhbiBhZG1pblwiLFxyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHRydWUsXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XHJcbiAgICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBVc2VyU2VydmljZS5tYWtlQWRtaW4odXNlci5faWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAkc2NvcGUudXNlcnNbaW5kZXhdID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgc3dhbChcIk1hZGVcIiwgcmVzcG9uc2UuZGF0YS5wcm9maWxlLm5hbWUgKyBcIiBhbiBhZG1pbi5cIiwgXCJzdWNjZXNzXCIpO1xyXG4gICAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBVc2VyU2VydmljZS5nZXRBbGwoKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgIHZhciBjb3VudCA9IDA7XHJcbiAgICAgICAgICByZXNwb25zZS5kYXRhLmZvckVhY2godXNlciA9PiB7XHJcbiAgICAgICAgICAgIGlmICh1c2VyLmFkbWluKSBjb3VudCsrO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBpZiAoY291bnQgPiAxKSB7XHJcbiAgICAgICAgICAgIFVzZXJTZXJ2aWNlLnJlbW92ZUFkbWluKHVzZXIuX2lkKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICAkc2NvcGUudXNlcnNbaW5kZXhdID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgICBzd2FsKFwiUmVtb3ZlZFwiLCByZXNwb25zZS5kYXRhLnByb2ZpbGUubmFtZSArIFwiIGFzIGFkbWluXCIsIFwic3VjY2Vzc1wiKTtcclxuICAgICAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc3dhbChcIk5vIG90aGVyIEFkbWluXCIsIFwiWW91IGNhbid0IHJlbW92ZSBhbGwgYWRtaW5zLlwiLCBcImVycm9yXCIpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGZvcm1hdFRpbWUodGltZSkge1xyXG4gICAgICBpZiAodGltZSkge1xyXG4gICAgICAgIHJldHVybiBtb21lbnQodGltZSkubG9jYWxlKCdlbicpLmZvcm1hdChcIk1NTU0gRG8gWVlZWSwgaDptbTpzcyBhXCIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgJHNjb3BlLnJvd0NsYXNzID0gZnVuY3Rpb24gKHVzZXIpIHtcclxuICAgICAgaWYgKHVzZXIuYWRtaW4pIHtcclxuICAgICAgICByZXR1cm4gXCJhZG1pblwiO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh1c2VyLnN0YXR1cy5jb25maXJtZWQpIHtcclxuICAgICAgICByZXR1cm4gXCJwb3NpdGl2ZVwiO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh1c2VyLnN0YXR1cy5hZG1pdHRlZCAmJiAhdXNlci5zdGF0dXMuY29uZmlybWVkKSB7XHJcbiAgICAgICAgcmV0dXJuIFwid2FybmluZ1wiO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIHNlbGVjdFVzZXIodXNlcikge1xyXG4gICAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyID0gdXNlcjtcclxuICAgICAgJHNjb3BlLnNlbGVjdGVkVXNlci5zZWN0aW9ucyA9IGdlbmVyYXRlU2VjdGlvbnModXNlcik7XHJcbiAgICAgICQoXCIubG9uZy51c2VyLm1vZGFsXCIpLm1vZGFsKFwic2hvd1wiKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZW5lcmF0ZVNlY3Rpb25zKHVzZXIpIHtcclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBuYW1lOiBcIkJhc2ljIEluZm9cIixcclxuICAgICAgICAgIGZpZWxkczogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJDcmVhdGVkIE9uXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IGZvcm1hdFRpbWUodXNlci50aW1lc3RhbXApXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkxhc3QgVXBkYXRlZFwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiBmb3JtYXRUaW1lKHVzZXIubGFzdFVwZGF0ZWQpXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkNvbmZpcm0gQnlcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogZm9ybWF0VGltZSh1c2VyLnN0YXR1cy5jb25maXJtQnkpIHx8IFwiTi9BXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiQ2hlY2tlZCBJblwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiBmb3JtYXRUaW1lKHVzZXIuc3RhdHVzLmNoZWNrSW5UaW1lKSB8fCBcIk4vQVwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkVtYWlsXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuZW1haWxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbmFtZTogXCJQcm9maWxlXCIsXHJcbiAgICAgICAgICBmaWVsZHM6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiTmFtZVwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUubmFtZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJHZW5kZXJcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmdlbmRlclxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJTY2hvb2xcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLnNjaG9vbFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJHcmFkdWF0aW9uIFllYXJcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmdyYWR1YXRpb25ZZWFyXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkhhY2thdGhvbnMgdmlzaXRlZFwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuaG93TWFueUhhY2thdGhvbnNcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiRGVzY3JpcHRpb25cIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmRlc2NyaXB0aW9uXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkVzc2F5XCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5lc3NheVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJNYWpvclwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUubWFqb3JcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIF1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6IFwiQ29uZmlybWF0aW9uXCIsXHJcbiAgICAgICAgICBmaWVsZHM6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiUGhvbmUgTnVtYmVyXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLnBob25lTnVtYmVyXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIk5lZWRzIEhhcmR3YXJlXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLndhbnRzSGFyZHdhcmUsXHJcbiAgICAgICAgICAgICAgdHlwZTogXCJib29sZWFuXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiSGFyZHdhcmUgUmVxdWVzdGVkXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLmhhcmR3YXJlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIk5hdGlvbmFsIENhcmQgSURcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24ubmF0aW9uYWxDYXJkSURcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbmFtZTogXCJUcmF2ZWxcIixcclxuICAgICAgICAgIGZpZWxkczogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJBZGRpdGlvbmFsIE5vdGVzXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLm5vdGVzXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIF1cclxuICAgICAgICB9XHJcbiAgICAgIF07XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gb25TdWNjZXNzKCkge1xyXG4gICAgICBzd2FsKFwiVXBkYXRlZCFcIiwgXCJOZXcgVm9sdW50ZWVyIEFkZGVkLlwiLCBcInN1Y2Nlc3NcIik7XHJcbiAgICAgICRzdGF0ZS5yZWxvYWQoKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBvbkVycm9yKGRhdGEpIHtcclxuICAgICAgc3dhbChcIlRyeSBhZ2FpbiFcIiwgZGF0YS5tZXNzYWdlLCBcImVycm9yXCIpXHJcbiAgICB9XHJcblxyXG4gICAgJHNjb3BlLmFkZFZvbHVudGVlciA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgIHN3YWwoXCJXcml0ZSB0aGUgdm9sdW50ZWVyIGVtYWlsOlwiLCB7XHJcbiAgICAgICAgYnV0dG9uczogeyBjYW5jZWw6IHsgdGV4dDogXCJDYW5jZWxcIiwgdmFsdWU6IG51bGwsIHZpc2libGU6IHRydWUgfSwgY29uZmlybTogeyB0ZXh0OiBcIkludml0ZVwiLCB2YWx1ZTogdHJ1ZSwgdmlzaWJsZTogdHJ1ZSB9IH0sXHJcbiAgICAgICAgY29udGVudDogeyBlbGVtZW50OiBcImlucHV0XCIsIGF0dHJpYnV0ZXM6IHsgcGxhY2Vob2xkZXI6IFwiZXhhbXBsZUBnbWFpbC5jb21cIiwgdHlwZTogXCJ0ZXh0XCIgfSB9LFxyXG4gICAgICB9KS50aGVuKChtYWlsKSA9PiB7XHJcbiAgICAgICAgaWYgKCFtYWlsKSB7IHJldHVybjsgfVxyXG4gICAgICAgIEF1dGhTZXJ2aWNlLnJlZ2lzdGVyKFxyXG4gICAgICAgICAgbWFpbCwgXCJoYWNrYXRob25cIiwgb25TdWNjZXNzLCBvbkVycm9yLCB0cnVlKVxyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG5cclxuXHJcbiAgICAkc2NvcGUuc2VsZWN0VXNlciA9IHNlbGVjdFVzZXI7XHJcbiAgfVxyXG5dKTsiLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcclxuICAuc2VydmljZSgnc2V0dGluZ3MnLCBmdW5jdGlvbigpIHt9KVxyXG4gIC5jb250cm9sbGVyKCdCYXNlQ3RybCcsIFtcclxuICAgICckc2NvcGUnLFxyXG4gICAgJ0VWRU5UX0lORk8nLFxyXG4gICAgZnVuY3Rpb24oJHNjb3BlLCBFVkVOVF9JTkZPKXtcclxuXHJcbiAgICAgICRzY29wZS5FVkVOVF9JTkZPID0gRVZFTlRfSU5GTztcclxuXHJcbiAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5jb250cm9sbGVyKCdhZG1pbkN0cmwnLCBbXHJcbiAgICAnJHNjb3BlJyxcclxuICAgICdVc2VyU2VydmljZScsXHJcbiAgICBmdW5jdGlvbigkc2NvcGUsIFVzZXJTZXJ2aWNlKXtcclxuICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xyXG4gICAgfV0pOyIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5jb25maWcoZnVuY3Rpb24gKGRyb3B6b25lT3BzUHJvdmlkZXIpIHtcclxuICAgIGRyb3B6b25lT3BzUHJvdmlkZXIuc2V0T3B0aW9ucyh7XHJcbiAgICAgIGFkZFJlbW92ZUxpbmtzOiB0cnVlLFxyXG4gICAgICB1cmw6ICdodHRwczovL2NzZS5jbHViL2FwaS91cGxvYWRDVicsXHJcbiAgICAgIG1heEZpbGVzaXplOiAnMicsXHJcbiAgICAgIG1heEZpbGVzIDogMSxcclxuICAgICAgcGFyYW1OYW1lOiAnY3YnLFxyXG4gICAgICBhY2NlcHRlZEZpbGVzOiAnYXBwbGljYXRpb24vcGRmJyxcclxuICAgIH0pXHJcbiAgfSlcclxuICAuY29udHJvbGxlcignQXBwbGljYXRpb25DdHJsJywgW1xyXG4gICAgJyRzY29wZScsXHJcbiAgICAnJHJvb3RTY29wZScsXHJcbiAgICAnJHN0YXRlJyxcclxuICAgICckaHR0cCcsXHJcbiAgICAnY3VycmVudFVzZXInLFxyXG4gICAgJ3NldHRpbmdzJyxcclxuICAgICdTZXNzaW9uJyxcclxuICAgICdVc2VyU2VydmljZScsXHJcbiAgICAnTWFya2V0aW5nU2VydmljZScsXHJcbiAgICBmdW5jdGlvbiAoJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsICRodHRwLCBjdXJyZW50VXNlciwgc2V0dGluZ3MsIFNlc3Npb24sIFVzZXJTZXJ2aWNlLCBNYXJrZXRpbmdTZXJ2aWNlKSB7XHJcblxyXG4gICAgICAkc2NvcGUuZHpDYWxsYmFja3MgPSB7XHJcbiAgICAgICAgJ2FkZGVkZmlsZSc6IGZ1bmN0aW9uIChmaWxlKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhmaWxlKTtcclxuICAgICAgICAgICRzY29wZS5uZXdGaWxlID0gZmlsZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgICdzdWNjZXNzJzogZnVuY3Rpb24gKGZpbGUsIHhocikge1xyXG4gICAgICAgICAgJHNjb3BlLnVzZXIucHJvZmlsZS5jdkxpbmsgPSB4aHIubGluayA7XHJcbiAgICAgICAgfSxcclxuICAgICAgfVxyXG4gICAgICAvLyBTZXQgdXAgdGhlIHVzZXJcclxuICAgICAgJHNjb3BlLnVzZXIgPSBjdXJyZW50VXNlci5kYXRhO1xyXG5cclxuICAgICAgLy8gSXMgdGhlIHN0dWRlbnQgZnJvbSBIb3N0U2Nob29sP1xyXG4gICAgICAkc2NvcGUuaXNIb3N0U2Nob29sID0gJHNjb3BlLnVzZXIuZW1haWwuc3BsaXQoJ0AnKVsxXSA9PSBzZXR0aW5ncy5kYXRhLmhvc3RTY2hvb2w7XHJcblxyXG4gICAgICAvLyBJZiBzbywgZGVmYXVsdCB0aGVtIHRvIGFkdWx0OiB0cnVlXHJcbiAgICAgIGlmICgkc2NvcGUuaXNIb3N0U2Nob29sKSB7XHJcbiAgICAgICAgJHNjb3BlLnVzZXIucHJvZmlsZS5hZHVsdCA9IHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFBvcHVsYXRlIHRoZSBzY2hvb2wgZHJvcGRvd25cclxuICAgICAgcG9wdWxhdGVTY2hvb2xzKCk7XHJcbiAgICAgIF9zZXR1cEZvcm0oKTtcclxuXHJcbiAgICAgIHBvcHVsYXRlV2lsYXlhcygpO1xyXG4gICAgICBwb3B1bGF0ZUNsdWJzKCk7XHJcblxyXG4gICAgICAkc2NvcGUucmVnSXNDbG9zZWQgPSBEYXRlLm5vdygpID4gc2V0dGluZ3MuZGF0YS50aW1lQ2xvc2U7XHJcblxyXG4gICAgICBmdW5jdGlvbiBwb3B1bGF0ZVNjaG9vbHMoKSB7XHJcbiAgICAgICAgJGh0dHBcclxuICAgICAgICAgIC5nZXQoJy9hc3NldHMvc2Nob29scy5qc29uJylcclxuICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgdmFyIHNjaG9vbHMgPSByZXMuZGF0YTtcclxuICAgICAgICAgICAgdmFyIGVtYWlsID0gJHNjb3BlLnVzZXIuZW1haWwuc3BsaXQoJ0AnKVsxXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzY2hvb2xzW2VtYWlsXSkge1xyXG4gICAgICAgICAgICAgICRzY29wZS51c2VyLnByb2ZpbGUuc2Nob29sID0gc2Nob29sc1tlbWFpbF0uc2Nob29sO1xyXG4gICAgICAgICAgICAgICRzY29wZS5hdXRvRmlsbGVkU2Nob29sID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICRodHRwXHJcbiAgICAgICAgICAuZ2V0KCcvYXNzZXRzL3NjaG9vbHMuY3N2JylcclxuICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgJHNjb3BlLnNjaG9vbHMgPSByZXMuZGF0YS5zcGxpdCgnXFxuJyk7XHJcbiAgICAgICAgICAgICRzY29wZS5zY2hvb2xzLnB1c2goJ090aGVyJyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IFtdO1xyXG5cclxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8ICRzY29wZS5zY2hvb2xzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgJHNjb3BlLnNjaG9vbHNbaV0gPSAkc2NvcGUuc2Nob29sc1tpXS50cmltKCk7XHJcbiAgICAgICAgICAgICAgY29udGVudC5wdXNoKHsgdGl0bGU6ICRzY29wZS5zY2hvb2xzW2ldIH0pXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICQoJyNzY2hvb2wudWkuc2VhcmNoJylcclxuICAgICAgICAgICAgICAuc2VhcmNoKHtcclxuICAgICAgICAgICAgICAgIHNvdXJjZTogY29udGVudCxcclxuICAgICAgICAgICAgICAgIGNhY2hlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgb25TZWxlY3Q6IGZ1bmN0aW9uIChyZXN1bHQsIHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICRzY29wZS51c2VyLnByb2ZpbGUuc2Nob29sID0gcmVzdWx0LnRpdGxlLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgICBmdW5jdGlvbiBwb3B1bGF0ZVdpbGF5YXMoKSB7XHJcbiAgICAgICAgJGh0dHBcclxuICAgICAgICAgIC5nZXQoJy9hc3NldHMvd2lsYXlhcy5jc3YnKVxyXG4gICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAkc2NvcGUud2lsYXlhcyA9IHJlcy5kYXRhLnNwbGl0KCdcXG4nKTtcclxuICAgICAgICAgICAgJHNjb3BlLndpbGF5YXMucHVzaCgnT3RoZXInKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gW107XHJcblxyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgJHNjb3BlLndpbGF5YXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAkc2NvcGUud2lsYXlhc1tpXSA9ICRzY29wZS53aWxheWFzW2ldLnRyaW0oKTtcclxuICAgICAgICAgICAgICBjb250ZW50LnB1c2goeyB0aXRsZTogJHNjb3BlLndpbGF5YXNbaV0gfSlcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJCgnI3dpbGF5YS51aS5zZWFyY2gnKVxyXG4gICAgICAgICAgICAgIC5zZWFyY2goe1xyXG4gICAgICAgICAgICAgICAgc291cmNlOiBjb250ZW50LFxyXG4gICAgICAgICAgICAgICAgY2FjaGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBvblNlbGVjdDogZnVuY3Rpb24gKHJlc3VsdCwgcmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgJHNjb3BlLnVzZXIucHJvZmlsZS53aWxheWEgPSByZXN1bHQudGl0bGUudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuXHJcbiAgICAgIGZ1bmN0aW9uIHBvcHVsYXRlQ2x1YnMoKSB7XHJcbiAgICAgICAgJGh0dHBcclxuICAgICAgICAgIC5nZXQoJy9hc3NldHMvY2x1YnMuY3N2JylcclxuICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmNsdWJzID0gcmVzLmRhdGEuc3BsaXQoJ1xcbicpO1xyXG4gICAgICAgICAgICAkc2NvcGUuY2x1YnMucHVzaCgnT3RoZXInKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gW107XHJcblxyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgJHNjb3BlLmNsdWJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgJHNjb3BlLmNsdWJzW2ldID0gJHNjb3BlLmNsdWJzW2ldLnRyaW0oKTtcclxuICAgICAgICAgICAgICBjb250ZW50LnB1c2goeyB0aXRsZTogJHNjb3BlLmNsdWJzW2ldIH0pXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICQoJyNjbHViLnVpLnNlYXJjaCcpXHJcbiAgICAgICAgICAgICAgLnNlYXJjaCh7XHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6IGNvbnRlbnQsXHJcbiAgICAgICAgICAgICAgICBjYWNoZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG9uU2VsZWN0OiBmdW5jdGlvbiAocmVzdWx0LCByZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAkc2NvcGUuY2x1YiA9IHJlc3VsdC50aXRsZS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIGlmICgkc2NvcGUudXNlci5wcm9maWxlLnNvdXJjZSAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICRzY29wZS5Vc2VyU291cmNlID0gJHNjb3BlLnVzZXIucHJvZmlsZS5zb3VyY2Uuc3BsaXQoJyMnKVswXTtcclxuICAgICAgICAgICRzY29wZS5jbHViID0gJHNjb3BlLnVzZXIucHJvZmlsZS5zb3VyY2Uuc3BsaXQoJyMnKVsxXTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgICBmdW5jdGlvbiByZW1vdmVEdXBsaWNhdGVzKG15QXJyLCBwcm9wKSB7XHJcbiAgICAgICAgcmV0dXJuIG15QXJyLmZpbHRlcigob2JqLCBwb3MsIGFycikgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIGFyci5tYXAobWFwT2JqID0+IG1hcE9ialtwcm9wXSkuaW5kZXhPZihvYmpbcHJvcF0pID09PSBwb3M7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIHNlbmRNYXJrZXRpbmdFbWFpbHMoKSB7XHJcbiAgICAgICAgTWFya2V0aW5nU2VydmljZS5nZXRBbGwoKS50aGVuKHRlYW1zID0+IHtcclxuICAgICAgICAgIHZhciBlbWFpbHMgPSBbXTtcclxuICAgICAgICAgIHRlYW1zLmRhdGEuZm9yRWFjaCh0ZWFtID0+IHtcclxuICAgICAgICAgICAgdmFyIGlzVGVhbW1hdGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGVhbS5tZW1iZXJzLmZvckVhY2gobWVtYmVyID0+IHtcclxuICAgICAgICAgICAgICBpZiAobWVtYmVyID09IGN1cnJlbnRVc2VyLmRhdGEuZW1haWwpIHtcclxuICAgICAgICAgICAgICAgIGlzVGVhbW1hdGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmIChpc1RlYW1tYXRlKSB7XHJcbiAgICAgICAgICAgICAgdGVhbS5tZW1iZXJzLmZvckVhY2gobWVtYmVyID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghKG1lbWJlciA9PSBjdXJyZW50VXNlci5kYXRhLmVtYWlsKSkge1xyXG4gICAgICAgICAgICAgICAgICBlbWFpbHMucHVzaCh7IGVtYWlsOiBtZW1iZXIsIGV2ZW50OiB0ZWFtLmV2ZW50IH0pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgcmVtb3ZlRHVwbGljYXRlcyhlbWFpbHMsICdlbWFpbCcpLmZvckVhY2godGVhbW1hdGUgPT4ge1xyXG4gICAgICAgICAgICBNYXJrZXRpbmdTZXJ2aWNlLnNlbmRGcmllbmRJbnZpdGUoY3VycmVudFVzZXIuZGF0YS5wcm9maWxlLm5hbWUsIHRlYW1tYXRlKVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG5cclxuXHJcbiAgICAgIGZ1bmN0aW9uIF91cGRhdGVVc2VyKGUpIHtcclxuXHJcbiAgICAgICAgLy9DaGVjayBpZiBVc2VyJ3MgZmlyc3Qgc3VibWlzc2lvblxyXG4gICAgICAgIHZhciBzZW5kTWFpbCA9IHRydWU7XHJcbiAgICAgICAgaWYgKGN1cnJlbnRVc2VyLmRhdGEuc3RhdHVzLmNvbXBsZXRlZFByb2ZpbGUpIHsgc2VuZE1haWwgPSBmYWxzZSB9XHJcblxyXG4gICAgICAgIC8vIEdldCB1c2VyIFNvdXJjZVxyXG4gICAgICAgIGlmICgkc2NvcGUuVXNlclNvdXJjZSAhPSAnMicpIHsgJHNjb3BlLnVzZXIucHJvZmlsZS5zb3VyY2UgPSAkc2NvcGUuVXNlclNvdXJjZSB9XHJcbiAgICAgICAgZWxzZSB7ICRzY29wZS51c2VyLnByb2ZpbGUuc291cmNlID0gJHNjb3BlLlVzZXJTb3VyY2UgKyBcIiNcIiArICRzY29wZS5jbHViIH1cclxuXHJcbiAgICAgICAgLy8gVXNlclNlcnZpY2UudXBsb2FkQ1YoYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjdicpKVswXS5maWxlcykudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgLy8gICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcbiAgICAgICAgLy8gICAkc2NvcGUudXNlci5wcm9maWxlLmN2TGluayA9IHJlc3BvbnNlLmRhdGEubGluaztcclxuXHJcbiAgICAgICAgLy8gfSlcclxuXHJcbiAgICAgICAgVXNlclNlcnZpY2VcclxuICAgICAgICAgIC51cGRhdGVQcm9maWxlKFNlc3Npb24uZ2V0VXNlcklkKCksICRzY29wZS51c2VyLnByb2ZpbGUpXHJcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHN3YWwoXCJBd2Vzb21lIVwiLCBcIllvdXIgYXBwbGljYXRpb24gaGFzIGJlZW4gc2F2ZWQuXCIsIFwic3VjY2Vzc1wiKS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICAgICAgICBpZiAoc2VuZE1haWwpIHsgc2VuZE1hcmtldGluZ0VtYWlscygpOyB9XHJcbiAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLmRhc2hib2FyZFwiKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9LCByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHN3YWwoXCJVaCBvaCFcIiwgXCJTb21ldGhpbmcgd2VudCB3cm9uZy5cIiwgXCJlcnJvclwiKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gaXNNaW5vcigpIHtcclxuICAgICAgICByZXR1cm4gISRzY29wZS51c2VyLnByb2ZpbGUuYWR1bHQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIG1pbm9yc0FyZUFsbG93ZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHNldHRpbmdzLmRhdGEuYWxsb3dNaW5vcnM7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIG1pbm9yc1ZhbGlkYXRpb24oKSB7XHJcbiAgICAgICAgLy8gQXJlIG1pbm9ycyBhbGxvd2VkIHRvIHJlZ2lzdGVyP1xyXG4gICAgICAgIGlmIChpc01pbm9yKCkgJiYgIW1pbm9yc0FyZUFsbG93ZWQoKSkge1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gX3NldHVwRm9ybSgpIHtcclxuICAgICAgICAvLyBDdXN0b20gbWlub3JzIHZhbGlkYXRpb24gcnVsZVxyXG4gICAgICAgICQuZm4uZm9ybS5zZXR0aW5ncy5ydWxlcy5hbGxvd01pbm9ycyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgcmV0dXJuIG1pbm9yc1ZhbGlkYXRpb24oKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBTZW1hbnRpYy1VSSBmb3JtIHZhbGlkIGF0aW9uXHJcbiAgICAgICAgJCgnLnVpLmZvcm0nKS5mb3JtKHtcclxuICAgICAgICAgIG9uOiAnYmx1cicsXHJcbiAgICAgICAgICBpbmxpbmU6IHRydWUsXHJcbiAgICAgICAgICBmaWVsZHM6IHtcclxuICAgICAgICAgICAgbmFtZToge1xyXG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICduYW1lJyxcclxuICAgICAgICAgICAgICBydWxlczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxyXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2UgZW50ZXIgeW91ciBuYW1lLidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNjaG9vbDoge1xyXG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdzY2hvb2wnLFxyXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXHJcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSBlbnRlciB5b3VyIHNjaG9vbCBuYW1lLidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFdpbGF5YToge1xyXG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdXaWxheWEnLFxyXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXHJcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSBlbnRlciB5b3VyIHdpbGF5YSBuYW1lLidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHllYXI6IHtcclxuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAneWVhcicsXHJcbiAgICAgICAgICAgICAgcnVsZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcclxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIHNlbGVjdCB5b3VyIGdyYWR1YXRpb24geWVhci4nXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnZW5kZXI6IHtcclxuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnZ2VuZGVyJyxcclxuICAgICAgICAgICAgICBydWxlczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxyXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2Ugc2VsZWN0IGEgZ2VuZGVyLiAnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBob3dNYW55SGFja2F0aG9uczoge1xyXG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdob3dNYW55SGFja2F0aG9ucycsXHJcbiAgICAgICAgICAgICAgcnVsZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcclxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIHNlbGVjdCBob3cgbWFueSBoYWNrYXRob25zIHlvdSBoYXZlIGF0dGVuZGVkLidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGFkdWx0OiB7XHJcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ2FkdWx0JyxcclxuICAgICAgICAgICAgICBydWxlczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnYWxsb3dNaW5vcnMnLFxyXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdZb3UgbXVzdCBiZSBhbiBhZHVsdCwgb3IgYW4gRVNJIHN0dWRlbnQuJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3R1ZHk6IHtcclxuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnc3R1ZHknLFxyXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXHJcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSBlbnRlciB5b3VyIG1ham9yIC4nXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjoge1xyXG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdkZXNjcmlwdGlvbicsXHJcbiAgICAgICAgICAgICAgcnVsZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcclxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIGRlc2NyaWJlIHlvdXJzZWxmIC4nXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlc3NheToge1xyXG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdlc3NheScsXHJcbiAgICAgICAgICAgICAgcnVsZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcclxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIHRlbGwgdXMgYWJvdXQgeW91ciBtb3RpdmF0aW9uIC4nXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBsaW5rZWRpbjoge1xyXG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdsaW5rZWRpbicsXHJcbiAgICAgICAgICAgICAgcnVsZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ3VybCcsXHJcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSBlbnRlciBhIHZhbGlkIExpbmtlZGluIFVSTCAuJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZmFjZWJvb2s6IHtcclxuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnZmFjZWJvb2snLFxyXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICd1cmwnLFxyXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBGYWNlYm9vayBVUkwgLidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdpdGh1Yjoge1xyXG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdnaXRodWInLFxyXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICd1cmwnLFxyXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBHaXRIdWIgVVJMIC4nXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBVc2VyU291cmNlOiB7XHJcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ1VzZXJTb3VyY2UnLFxyXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXHJcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ0hvdyBkaWQgeW91IGhlYXIgYWJvdXQgdXMgPydcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgJHNjb3BlLnN1Ym1pdEZvcm0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCQoJy51aS5mb3JtJykuZm9ybSgnaXMgdmFsaWQnKSkge1xyXG4gICAgICAgICAgLy8gJCgnLnVpLnN1Ym1pdC5idXR0b24nKS5jbGljaygpO1xyXG4gICAgICAgICAgX3VwZGF0ZVVzZXIoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc3dhbChcIlVoIG9oIVwiLCBcIlBsZWFzZSBGaWxsIFRoZSBSZXF1aXJlZCBGaWVsZHNcIiwgXCJlcnJvclwiKTtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcbiAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5jb250cm9sbGVyKCdDaGFsbGVuZ2VzQ3RybCcsIFtcclxuICAgICckc2NvcGUnLFxyXG4gICAgJyRyb290U2NvcGUnLFxyXG4gICAgJyRzdGF0ZScsXHJcbiAgICAnJGh0dHAnLFxyXG4gICAgJ2N1cnJlbnRVc2VyJyxcclxuICAgICdTZXNzaW9uJyxcclxuICAgICdDaGFsbGVuZ2VTZXJ2aWNlJyxcclxuICAgICdVc2VyU2VydmljZScsXHJcbiAgICAnU29sdmVkQ1RGU2VydmljZScsXHJcbiAgICBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgJGh0dHAsIGN1cnJlbnRVc2VyLCBTZXNzaW9uLCBDaGFsbGVuZ2VTZXJ2aWNlLCBVc2VyU2VydmljZSwgU29sdmVkQ1RGU2VydmljZSkge1xyXG5cclxuICAgICAgXHJcbiAgICAgIFNvbHZlZENURlNlcnZpY2UuZ2V0QWxsKCkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgc29sdmVkQ2hhbGxlbmdlcz0gcmVzcG9uc2UuZGF0YS5maWx0ZXIocyA9PiBzLnVzZXI9PWN1cnJlbnRVc2VyLmRhdGEuX2lkKVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIFxyXG5cclxuICAgICAgQ2hhbGxlbmdlU2VydmljZS5nZXRBbGwoKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAkc2NvcGUuY2hhbGxlbmdlcyA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgIH0pO1xyXG5cclxuXHJcblxyXG4gICAgICBmdW5jdGlvbiBvblN1Y2Nlc3MoY2hhbGxlbmdlKSB7XHJcbiAgICAgICAgc3dhbChcIkF3ZXNvbWUhXCIsIFwiVGhhdCdzIGNvcnJlY3QsIGFuZCB5b3UganVzdCBlYXJuZWQgK1wiKyBjaGFsbGVuZ2UucG9pbnRzICtcIiBwb2ludHMuXCIsIFwic3VjY2Vzc1wiKVxyXG4gICAgICAgICRzdGF0ZS5yZWxvYWQoKVxyXG5cclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gb25FcnJvcihkYXRhKXtcclxuICAgICAgICBzd2FsKFwiVHJ5IGFnYWluIVwiLCBkYXRhLm1lc3NhZ2UsIFwiZXJyb3JcIikgXHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgICAkc2NvcGUuc29sdmVDaGFsbGVuZ2UgPSBmdW5jdGlvbihjaGFsbGVuZ2UsYW5zd2VyLCBpc2VudGVyKSB7XHJcbiAgICAgICAgaWYgKGlzZW50ZXIpe1xyXG4gICAgICAgICAgU29sdmVkQ1RGU2VydmljZS5zb2x2ZShjaGFsbGVuZ2UsY3VycmVudFVzZXIsYW5zd2VyLG9uU3VjY2VzcyxvbkVycm9yKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgIFNvbHZlZENURlNlcnZpY2Uuc29sdmUoY2hhbGxlbmdlLGN1cnJlbnRVc2VyLGFuc3dlcixvblN1Y2Nlc3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgfVxyXG5cclxuICAgICAgXHJcbiAgICAgICRzY29wZS5zaG93Q2hhbGxlbmdlID0gZnVuY3Rpb24oY2hhbGxlbmdlKSB7XHJcblxyXG4gICAgICAgIENoYWxsZW5nZVNlcnZpY2UuZ2V0KGNoYWxsZW5nZS5faWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG5cclxuICAgICAgICAgIHN3YWwocmVzcG9uc2UuZGF0YS50aXRsZSwgcmVzcG9uc2UuZGF0YS5kZXNjcmlwdGlvbilcclxuXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgICAgU29sdmVkQ1RGU2VydmljZS5nZXRBbGwoKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICBhbGxDaGFsbGVuZ2VzPSByZXNwb25zZS5kYXRhXHJcbiAgICAgICAgdmFyIFJlc3VsdCA9W11cclxuXHJcbiAgICAgICAgYWxsQ2hhbGxlbmdlcy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgdXNlckNoYWxsZW5nZXMgPSBhbGxDaGFsbGVuZ2VzLmZpbHRlcihzID0+IHMudXNlcj09ZWxlbWVudC51c2VyKVxyXG4gICAgICAgICAgdmFyIHBvaW50c0NvdW50ID0gMDtcclxuXHJcbiAgICAgICAgICB1c2VyQ2hhbGxlbmdlcy5mb3JFYWNoKGNoYWxsZW5nZSA9PiB7IHBvaW50c0NvdW50Kz1jaGFsbGVuZ2UucG9pbnRzIH0pO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBVc2VyU2VydmljZS5nZXQoZWxlbWVudC51c2VyKS50aGVuKHVzZXIgPT57XHJcblxyXG4gICAgICAgICAgICB2YXIgZ3JhZGU9W11cclxuICAgICAgICAgICAgZ3JhZGVbMjAxOV0gPSBcIjNDU1wiXHJcbiAgICAgICAgICAgIGdyYWRlWzIwMjBdID0gXCIyQ1NcIlxyXG4gICAgICAgICAgICBncmFkZVsyMDIxXSA9IFwiMUNTXCJcclxuICAgICAgICAgICAgZ3JhZGVbMjAyMl0gPSBcIjJDUFwiXHJcbiAgICAgICAgICAgIGdyYWRlWzIwMjNdID0gXCIxQ1BcIlxyXG5cclxuICAgICAgICAgICAgaWYgKHBvaW50c0NvdW50PjApIHtSZXN1bHQucHVzaCh7IGlkOnVzZXIuZGF0YS5faWQsIG5hbWU6IHVzZXIuZGF0YS5wcm9maWxlLm5hbWUsIGdyYWRlOiBncmFkZVt1c2VyLmRhdGEucHJvZmlsZS5ncmFkdWF0aW9uWWVhcl0gLHBvaW50czogcG9pbnRzQ291bnR9KX1cclxuXHJcbiAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgIGFsbENoYWxsZW5nZXMgPSBhbGxDaGFsbGVuZ2VzLmZpbHRlcihzID0+IHMudXNlciE9PWVsZW1lbnQudXNlcilcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJHNjb3BlLlJlc3VsdCA9IFJlc3VsdDtcclxuICAgICAgfSk7XHJcbiAgICBcclxuXHJcbiAgICAgICRzY29wZS5yb3dDbGFzcyA9IGZ1bmN0aW9uKHVzZXIpIHtcclxuICAgICAgICBcclxuICAgICAgICBpZiAodXNlci5pZD09Y3VycmVudFVzZXIuZGF0YS5faWQpIHtcclxuICAgICAgICAgIHJldHVybiBcImFkbWluXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG4gIFxyXG4gICAgICBcclxuXHJcbiAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4uY29udHJvbGxlcignQ2hlY2tpbkN0cmwnLCBbXHJcbiAgJyRzY29wZScsXHJcbiAgJyRzdGF0ZScsXHJcbiAgJyRzdGF0ZVBhcmFtcycsXHJcbiAgJ1VzZXJTZXJ2aWNlJyxcclxuICBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCBVc2VyU2VydmljZSl7XHJcbiAgICAkKCcjcmVhZGVyJykuaHRtbDVfcXJjb2RlKGZ1bmN0aW9uKHVzZXJJRCl7XHJcbiAgICAgICAgICAvL0NoYW5nZSB0aGUgaW5wdXQgZmllbGRzIHZhbHVlIGFuZCBzZW5kIHBvc3QgcmVxdWVzdCB0byB0aGUgYmFja2VuZFxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBVc2VyU2VydmljZS5nZXQodXNlcklEKS50aGVuKHJlc3BvbnNlID0+IHtcclxuXHJcbiAgICAgICAgICAgIHVzZXIgPXJlc3BvbnNlLmRhdGE7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXVzZXIuc3RhdHVzLmNoZWNrZWRJbikge1xyXG4gICAgICAgICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIixcclxuICAgICAgICAgICAgICAgIHRleHQ6IFwiWW91IGFyZSBhYm91dCB0byBjaGVjayBpbiBcIiArIHVzZXIucHJvZmlsZS5uYW1lICsgXCIhXCIsXHJcbiAgICAgICAgICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgY2FuY2VsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogXCJDYW5jZWxcIixcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGNoZWNrSW46IHtcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IFwiWWVzLCBjaGVjayB0aGVtIGluXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgXHJcbiAgICAgICAgICAgICAgICBVc2VyU2VydmljZS5jaGVja0luKHVzZXIuX2lkKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICAgICAgJHNjb3BlLnF1ZXJ5VGV4dCA9IHVzZXIuZW1haWw7XHJcbiAgICAgICAgICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgICAgICAgICAgXCJDaGVja2VkIGluXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdXNlci5wcm9maWxlLm5hbWUgKyBcIiBoYXMgYmVlbiBjaGVja2VkIGluLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiXHJcbiAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgICAgICAgXCJBbHJlYWR5IGNoZWNrZWRJblwiLFxyXG4gICAgICAgICAgICAgICAgdXNlci5wcm9maWxlLm5hbWUgKyBcIiBoYXMgYmVlbiBjaGVja2VkLWluIGF0OiBcIisgZm9ybWF0VGltZSh1c2VyLnN0YXR1cy5jaGVja0luVGltZSksXHJcbiAgICAgICAgICAgICAgICBcIndhcm5pbmdcIlxyXG4gICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSxcclxuICAgICAgZnVuY3Rpb24oZXJyb3Ipe1xyXG4gICAgICB9LCBmdW5jdGlvbih2aWRlb0Vycm9yKXtcclxuICAgICAgICAvL3RoZSB2aWRlbyBzdHJlYW0gY291bGQgYmUgb3BlbmVkXHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgICAkc2NvcGUucGFnZXMgPSBbXTtcclxuICAgICRzY29wZS51c2VycyA9IFtdO1xyXG4gICAgJHNjb3BlLnNvcnRCeSA9ICd0aW1lc3RhbXAnXHJcbiAgICAkc2NvcGUuc29ydERpciA9IGZhbHNlXHJcbiAgICAkc2NvcGUuc3RhdHVzRmlsdGVycz0ge3ZlcmlmaWVkOnRydWUsY29tcGxldGVkUHJvZmlsZTp0cnVlLGFkbWl0dGVkOiB0cnVlLGNvbmZpcm1lZDp0cnVlfVxyXG5cclxuICAgICRzY29wZS5maWx0ZXIgPSBkZXNlcmlhbGl6ZUZpbHRlcnMoJHN0YXRlUGFyYW1zLmZpbHRlcik7XHJcbiAgICAkc2NvcGUuZmlsdGVyLnRleHQgPSAkc3RhdGVQYXJhbXMucXVlcnkgfHwgXCJcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBkZXNlcmlhbGl6ZUZpbHRlcnModGV4dCkge1xyXG4gICAgICB2YXIgb3V0ID0ge307XHJcbiAgICAgIGlmICghdGV4dCkgcmV0dXJuIG91dDtcclxuICAgICAgdGV4dC5zcGxpdChcIixcIikuZm9yRWFjaChmdW5jdGlvbihmKXtvdXRbZl09dHJ1ZX0pO1xyXG4gICAgICByZXR1cm4gKHRleHQubGVuZ3RoPT09MCk/e306b3V0O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNlcmlhbGl6ZUZpbHRlcnMoZmlsdGVycykge1xyXG4gICAgICB2YXIgb3V0ID0gXCJcIjtcclxuICAgICAgZm9yICh2YXIgdiBpbiBmaWx0ZXJzKSB7aWYodHlwZW9mKGZpbHRlcnNbdl0pPT09XCJib29sZWFuXCImJmZpbHRlcnNbdl0pIG91dCArPSB2K1wiLFwiO31cclxuICAgICAgcmV0dXJuIChvdXQubGVuZ3RoPT09MCk/XCJcIjpvdXQuc3Vic3RyKDAsb3V0Lmxlbmd0aC0xKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBTZW1hbnRpYy1VSSBtb3ZlcyBtb2RhbCBjb250ZW50IGludG8gYSBkaW1tZXIgYXQgdGhlIHRvcCBsZXZlbC5cclxuICAgIC8vIFdoaWxlIHRoaXMgaXMgdXN1YWxseSBuaWNlLCBpdCBtZWFucyB0aGF0IHdpdGggb3VyIHJvdXRpbmcgd2lsbCBnZW5lcmF0ZVxyXG4gICAgLy8gbXVsdGlwbGUgbW9kYWxzIGlmIHlvdSBjaGFuZ2Ugc3RhdGUuIEtpbGwgdGhlIHRvcCBsZXZlbCBkaW1tZXIgbm9kZSBvbiBpbml0aWFsIGxvYWRcclxuICAgIC8vIHRvIHByZXZlbnQgdGhpcy5cclxuICAgICQoJy51aS5kaW1tZXInKS5yZW1vdmUoKTtcclxuICAgIC8vIFBvcHVsYXRlIHRoZSBzaXplIG9mIHRoZSBtb2RhbCBmb3Igd2hlbiBpdCBhcHBlYXJzLCB3aXRoIGFuIGFyYml0cmFyeSB1c2VyLlxyXG4gICAgJHNjb3BlLnNlbGVjdGVkVXNlciA9IHt9O1xyXG4gICAgJHNjb3BlLnNlbGVjdGVkVXNlci5zZWN0aW9ucyA9IGdlbmVyYXRlU2VjdGlvbnMoe1xyXG4gICAgICBzdGF0dXM6IFwiXCIsXHJcbiAgICAgIGNvbmZpcm1hdGlvbjoge1xyXG4gICAgICAgIGRpZXRhcnlSZXN0cmljdGlvbnM6IFtdXHJcbiAgICAgIH0sXHJcbiAgICAgIHByb2ZpbGU6IFwiXCJcclxuICAgIH0pO1xyXG5cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZVBhZ2UoZGF0YSkge1xyXG4gICAgICAkc2NvcGUudXNlcnMgPSBkYXRhLnVzZXJzO1xyXG4gICAgICAkc2NvcGUuY3VycmVudFBhZ2UgPSBkYXRhLnBhZ2U7XHJcbiAgICAgICRzY29wZS5wYWdlU2l6ZSA9IGRhdGEuc2l6ZTtcclxuXHJcbiAgICAgIHZhciBwID0gW107XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS50b3RhbFBhZ2VzOyBpKyspIHtcclxuICAgICAgICBwLnB1c2goaSk7XHJcbiAgICAgIH1cclxuICAgICAgJHNjb3BlLnBhZ2VzID0gcDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgVXNlclNlcnZpY2UuZ2V0UGFnZSgkc3RhdGVQYXJhbXMucGFnZSwgJHN0YXRlUGFyYW1zLnNpemUsICRzdGF0ZVBhcmFtcy5xdWVyeSwgJHNjb3BlLnN0YXR1c0ZpbHRlcnMpXHJcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgIHVwZGF0ZVBhZ2UocmVzcG9uc2UuZGF0YSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkc2NvcGUuJHdhdGNoKFwicXVlcnlUZXh0XCIsIGZ1bmN0aW9uKHF1ZXJ5VGV4dCkge1xyXG4gICAgICBVc2VyU2VydmljZS5nZXRQYWdlKCRzdGF0ZVBhcmFtcy5wYWdlLCAkc3RhdGVQYXJhbXMuc2l6ZSwgcXVlcnlUZXh0LCAkc2NvcGUuc3RhdHVzRmlsdGVycykudGhlbihcclxuICAgICAgICByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICB1cGRhdGVQYWdlKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAkc2NvcGUuYXBwbHlTdGF0dXNGaWx0ZXIgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICBVc2VyU2VydmljZVxyXG4gICAgICAgIC5nZXRQYWdlKCRzdGF0ZVBhcmFtcy5wYWdlLCAkc3RhdGVQYXJhbXMuc2l6ZSwgJHNjb3BlLnF1ZXJ5VGV4dCwgJHNjb3BlLnN0YXR1c0ZpbHRlcnMpLnRoZW4oXHJcbiAgICAgICAgICByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHVwZGF0ZVBhZ2UocmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAkc2NvcGUuZ29Ub1BhZ2UgPSBmdW5jdGlvbihwYWdlKSB7XHJcbiAgICAgICRzdGF0ZS5nbyhcImFwcC5hZG1pbi51c2Vyc1wiLCB7XHJcbiAgICAgICAgcGFnZTogcGFnZSxcclxuICAgICAgICBzaXplOiAkc3RhdGVQYXJhbXMuc2l6ZSB8fCAyMFxyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmNoZWNrSW4gPSBmdW5jdGlvbigkZXZlbnQsIHVzZXIsIGluZGV4KSB7XHJcbiAgICAgICRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgIGlmICghdXNlci5zdGF0dXMuY2hlY2tlZEluKSB7XHJcbiAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxyXG4gICAgICAgICAgdGV4dDogXCJZb3UgYXJlIGFib3V0IHRvIGNoZWNrIGluIFwiICsgdXNlci5wcm9maWxlLm5hbWUgKyBcIiFcIixcclxuICAgICAgICAgIGljb246IFwid2FybmluZ1wiLFxyXG4gICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2hlY2tJbjoge1xyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgdGV4dDogXCJZZXMsIGNoZWNrIHRoZW0gaW5cIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIFVzZXJTZXJ2aWNlLmNoZWNrSW4odXNlci5faWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAkc2NvcGUudXNlcnNbaW5kZXhdID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgICBcIkNoZWNrZWQgaW5cIixcclxuICAgICAgICAgICAgICByZXNwb25zZS5kYXRhLnByb2ZpbGUubmFtZSArIFwiIGhhcyBiZWVuIGNoZWNrZWQgaW4uXCIsXHJcbiAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc3dhbChcclxuICAgICAgICAgIFwiQWxyZWFkeSBjaGVja2VkSW5cIixcclxuICAgICAgICAgIHVzZXIucHJvZmlsZS5uYW1lICsgXCIgaGFzIGJlZW4gY2hlY2tlZC1pbiBhdDogXCIrIGZvcm1hdFRpbWUodXNlci5zdGF0dXMuY2hlY2tJblRpbWUpLFxyXG4gICAgICAgICAgXCJ3YXJuaW5nXCJcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGZvcm1hdFRpbWUodGltZSkge1xyXG4gICAgICBpZiAodGltZSkge1xyXG4gICAgICAgIHJldHVybiBtb21lbnQodGltZSkubG9jYWxlKCdlbicpLmZvcm1hdChcIk1NTU0gRG8gWVlZWSwgaDptbTpzcyBhXCIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgJHNjb3BlLnJvd0NsYXNzID0gZnVuY3Rpb24odXNlcikge1xyXG4gICAgICBpZiAodXNlci5hZG1pbikge1xyXG4gICAgICAgIHJldHVybiBcImFkbWluXCI7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHVzZXIuc3RhdHVzLmNvbmZpcm1lZCkge1xyXG4gICAgICAgIHJldHVybiBcInBvc2l0aXZlXCI7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHVzZXIuc3RhdHVzLmFkbWl0dGVkICYmICF1c2VyLnN0YXR1cy5jb25maXJtZWQpIHtcclxuICAgICAgICByZXR1cm4gXCJ3YXJuaW5nXCI7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gc2VsZWN0VXNlcih1c2VyKSB7XHJcbiAgICAgICRzY29wZS5zZWxlY3RlZFVzZXIgPSB1c2VyO1xyXG4gICAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyLnNlY3Rpb25zID0gZ2VuZXJhdGVTZWN0aW9ucyh1c2VyKTtcclxuICAgICAgJChcIi5sb25nLnVzZXIubW9kYWxcIikubW9kYWwoXCJzaG93XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlU2VjdGlvbnModXNlcikge1xyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6IFwiQmFzaWMgSW5mb1wiLFxyXG4gICAgICAgICAgZmllbGRzOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkNyZWF0ZWQgT25cIixcclxuICAgICAgICAgICAgICB2YWx1ZTogZm9ybWF0VGltZSh1c2VyLnRpbWVzdGFtcClcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiTGFzdCBVcGRhdGVkXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IGZvcm1hdFRpbWUodXNlci5sYXN0VXBkYXRlZClcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiQ29uZmlybSBCeVwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiBmb3JtYXRUaW1lKHVzZXIuc3RhdHVzLmNvbmZpcm1CeSkgfHwgXCJOL0FcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJDaGVja2VkIEluXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IGZvcm1hdFRpbWUodXNlci5zdGF0dXMuY2hlY2tJblRpbWUpIHx8IFwiTi9BXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiRW1haWxcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5lbWFpbFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBuYW1lOiBcIlByb2ZpbGVcIixcclxuICAgICAgICAgIGZpZWxkczogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJOYW1lXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5uYW1lXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkdlbmRlclwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuZ2VuZGVyXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIlNjaG9vbFwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuc2Nob29sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkdyYWR1YXRpb24gWWVhclwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuZ3JhZHVhdGlvblllYXJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiSGFja2F0aG9ucyB2aXNpdGVkXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5ob3dNYW55SGFja2F0aG9uc1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJEZXNjcmlwdGlvblwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuZGVzY3JpcHRpb25cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiRXNzYXlcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmVzc2F5XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIk1ham9yXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5tYWpvclxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJHaXRodWJcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmdpdGh1YlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogXCJGYWNlYm9va1wiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuZmFjZWJvb2tcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiTGlua2VkaW5cIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmxpbmtlZGluXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIF1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6IFwiQ29uZmlybWF0aW9uXCIsXHJcbiAgICAgICAgICBmaWVsZHM6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiUGhvbmUgTnVtYmVyXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLnBob25lTnVtYmVyXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIk5lZWRzIEhhcmR3YXJlXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLndhbnRzSGFyZHdhcmUsXHJcbiAgICAgICAgICAgICAgdHlwZTogXCJib29sZWFuXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiSGFyZHdhcmUgUmVxdWVzdGVkXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLmhhcmR3YXJlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIF1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6IFwiVHJhdmVsXCIsXHJcbiAgICAgICAgICBmaWVsZHM6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiQWRkaXRpb25hbCBOb3Rlc1wiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5ub3Rlc1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfVxyXG4gICAgICBdO1xyXG4gICAgfVxyXG4gICAgJHNjb3BlLnNlbGVjdFVzZXIgPSBzZWxlY3RVc2VyO1xyXG4gIH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcclxuICAuY29udHJvbGxlcignQ29uZmlybWF0aW9uQ3RybCcsIFtcclxuICAgICckc2NvcGUnLFxyXG4gICAgJyRyb290U2NvcGUnLFxyXG4gICAgJyRzdGF0ZScsXHJcbiAgICAnY3VycmVudFVzZXInLFxyXG4gICAgJ1V0aWxzJyxcclxuICAgICdVc2VyU2VydmljZScsXHJcbiAgICBmdW5jdGlvbiAoJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsIGN1cnJlbnRVc2VyLCBVdGlscywgVXNlclNlcnZpY2UpIHtcclxuXHJcbiAgICAgIC8vIFNldCB1cCB0aGUgdXNlclxyXG4gICAgICB2YXIgdXNlciA9IGN1cnJlbnRVc2VyLmRhdGE7XHJcbiAgICAgICRzY29wZS51c2VyID0gdXNlcjtcclxuXHJcbiAgICAgICRzY29wZS5wYXN0Q29uZmlybWF0aW9uID0gRGF0ZS5ub3coKSA+IHVzZXIuc3RhdHVzLmNvbmZpcm1CeTtcclxuXHJcbiAgICAgICRzY29wZS5mb3JtYXRUaW1lID0gVXRpbHMuZm9ybWF0VGltZTtcclxuXHJcbiAgICAgIF9zZXR1cEZvcm0oKTtcclxuXHJcbiAgICAgICRzY29wZS5maWxlTmFtZSA9IHVzZXIuX2lkICsgXCJfXCIgKyB1c2VyLnByb2ZpbGUubmFtZS5zcGxpdChcIiBcIikuam9pbihcIl9cIik7XHJcblxyXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgIC8vIEFsbCB0aGlzIGp1c3QgZm9yIGRpZXRhcnkgcmVzdHJpY3Rpb24gY2hlY2tib3hlcyBmbWxcclxuXHJcbiAgICAgIHZhciBkaWV0YXJ5UmVzdHJpY3Rpb25zID0ge1xyXG4gICAgICAgICdWZWdldGFyaWFuJzogZmFsc2UsXHJcbiAgICAgICAgJ1ZlZ2FuJzogZmFsc2UsXHJcbiAgICAgICAgJ0hhbGFsJzogZmFsc2UsXHJcbiAgICAgICAgJ0tvc2hlcic6IGZhbHNlLFxyXG4gICAgICAgICdOdXQgQWxsZXJneSc6IGZhbHNlXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBpZiAodXNlci5jb25maXJtYXRpb24uZGlldGFyeVJlc3RyaWN0aW9ucykge1xyXG4gICAgICAgIHVzZXIuY29uZmlybWF0aW9uLmRpZXRhcnlSZXN0cmljdGlvbnMuZm9yRWFjaChmdW5jdGlvbiAocmVzdHJpY3Rpb24pIHtcclxuICAgICAgICAgIGlmIChyZXN0cmljdGlvbiBpbiBkaWV0YXJ5UmVzdHJpY3Rpb25zKSB7XHJcbiAgICAgICAgICAgIGRpZXRhcnlSZXN0cmljdGlvbnNbcmVzdHJpY3Rpb25dID0gdHJ1ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgJHNjb3BlLmRpZXRhcnlSZXN0cmljdGlvbnMgPSBkaWV0YXJ5UmVzdHJpY3Rpb25zO1xyXG5cclxuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgZnVuY3Rpb24gX3VwZGF0ZVVzZXIoZSkge1xyXG4gICAgICAgIHZhciBjb25maXJtYXRpb24gPSAkc2NvcGUudXNlci5jb25maXJtYXRpb247XHJcbiAgICAgICAgLy8gR2V0IHRoZSBkaWV0YXJ5IHJlc3RyaWN0aW9ucyBhcyBhbiBhcnJheVxyXG4gICAgICAgIHZhciBkcnMgPSBbXTtcclxuICAgICAgICBPYmplY3Qua2V5cygkc2NvcGUuZGlldGFyeVJlc3RyaWN0aW9ucykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICBpZiAoJHNjb3BlLmRpZXRhcnlSZXN0cmljdGlvbnNba2V5XSkge1xyXG4gICAgICAgICAgICBkcnMucHVzaChrZXkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbmZpcm1hdGlvbi5kaWV0YXJ5UmVzdHJpY3Rpb25zID0gZHJzO1xyXG5cclxuICAgICAgICBVc2VyU2VydmljZVxyXG4gICAgICAgICAgLnVwZGF0ZUNvbmZpcm1hdGlvbih1c2VyLl9pZCwgY29uZmlybWF0aW9uKVxyXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBzd2FsKFwiV29vIVwiLCBcIllvdSdyZSBjb25maXJtZWQhXCIsIFwic3VjY2Vzc1wiKS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAuZGFzaGJvYXJkXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0sIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgc3dhbChcIlVoIG9oIVwiLCBcIlNvbWV0aGluZyB3ZW50IHdyb25nLlwiLCBcImVycm9yXCIpO1xyXG4gICAgICAgICAgfSlcclxuXHJcblxyXG4gICAgICAgIC8vIH0sIHJlc3BvbnNlID0+IHtcclxuICAgICAgICAvLyAgIHN3YWwoXCJVaCBvaCFcIiwgXCJTb21ldGhpbmcgd2VudCB3cm9uZy4gKEZpbGUpXCIsIFwiZXJyb3JcIik7XHJcbiAgICAgICAgLy8gfSlcclxuXHJcblxyXG5cclxuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIF9zZXR1cEZvcm0oKSB7XHJcbiAgICAgICAgLy8gU2VtYW50aWMtVUkgZm9ybSB2YWxpZGF0aW9uXHJcbiAgICAgICAgJCgnLnVpLmZvcm0nKS5mb3JtKHtcclxuICAgICAgICAgIGZpZWxkczoge1xyXG4gICAgICAgICAgICBzaGlydDoge1xyXG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdzaGlydCcsXHJcbiAgICAgICAgICAgICAgcnVsZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcclxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIGdpdmUgdXMgYSBzaGlydCBzaXplISdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHBob25lOiB7XHJcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ3Bob25lJyxcclxuICAgICAgICAgICAgICBydWxlczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxyXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2UgZW50ZXIgYSBwaG9uZSBudW1iZXIuJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2lnbmF0dXJlQ29kZU9mQ29uZHVjdDoge1xyXG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdzaWduYXR1cmVDb2RlT2ZDb25kdWN0JyxcclxuICAgICAgICAgICAgICBydWxlczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxyXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2UgdHlwZSB5b3VyIGRpZ2l0YWwgc2lnbmF0dXJlLidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG5hdGlvbmFsQ2FyZElEOiB7XHJcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ25hdGlvbmFsQ2FyZElEJyxcclxuICAgICAgICAgICAgICBydWxlczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxyXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2UgdHlwZSB5b3VyIE5hdGlvbmFsIENhcmQgSUQuJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgJHNjb3BlLnN1Ym1pdEZvcm0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCQoJy51aS5mb3JtJykuZm9ybSgnaXMgdmFsaWQnKSkge1xyXG4gICAgICAgICAgX3VwZGF0ZVVzZXIoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc3dhbChcIlVoIG9oIVwiLCBcIlBsZWFzZSBGaWxsIFRoZSBSZXF1aXJlZCBGaWVsZHNcIiwgXCJlcnJvclwiKTtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcclxuICAuY29udHJvbGxlcignRGFzaGJvYXJkQ3RybCcsIFtcclxuICAgICckcm9vdFNjb3BlJyxcclxuICAgICckc2NvcGUnLFxyXG4gICAgJyRzY2UnLFxyXG4gICAgJ2N1cnJlbnRVc2VyJyxcclxuICAgICdzZXR0aW5ncycsXHJcbiAgICAnVXRpbHMnLFxyXG4gICAgJ0F1dGhTZXJ2aWNlJyxcclxuICAgICdVc2VyU2VydmljZScsXHJcbiAgICAnRVZFTlRfSU5GTycsXHJcbiAgICAnREFTSEJPQVJEJyxcclxuICAgIGZ1bmN0aW9uKCRyb290U2NvcGUsICRzY29wZSwgJHNjZSwgY3VycmVudFVzZXIsIHNldHRpbmdzLCBVdGlscywgQXV0aFNlcnZpY2UsIFVzZXJTZXJ2aWNlLCBFVkVOVF9JTkZPLCBEQVNIQk9BUkQpe1xyXG4gICAgICB2YXIgU2V0dGluZ3MgPSBzZXR0aW5ncy5kYXRhO1xyXG4gICAgICB2YXIgdXNlciA9IGN1cnJlbnRVc2VyLmRhdGE7XHJcbiAgICAgICRzY29wZS51c2VyID0gdXNlcjtcclxuICAgICAgJHNjb3BlLnRpbWVDbG9zZSA9IFV0aWxzLmZvcm1hdFRpbWUoU2V0dGluZ3MudGltZUNsb3NlKTtcclxuICAgICAgJHNjb3BlLnRpbWVDb25maXJtID0gVXRpbHMuZm9ybWF0VGltZShTZXR0aW5ncy50aW1lQ29uZmlybSk7XHJcblxyXG4gICAgICAkc2NvcGUuREFTSEJPQVJEID0gREFTSEJPQVJEO1xyXG5cclxuICAgICAgZm9yICh2YXIgbXNnIGluICRzY29wZS5EQVNIQk9BUkQpIHtcclxuICAgICAgICBpZiAoJHNjb3BlLkRBU0hCT0FSRFttc2ddLmluY2x1ZGVzKCdbQVBQX0RFQURMSU5FXScpKSB7XHJcbiAgICAgICAgICAkc2NvcGUuREFTSEJPQVJEW21zZ10gPSAkc2NvcGUuREFTSEJPQVJEW21zZ10ucmVwbGFjZSgnW0FQUF9ERUFETElORV0nLCBVdGlscy5mb3JtYXRUaW1lKFNldHRpbmdzLnRpbWVDbG9zZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoJHNjb3BlLkRBU0hCT0FSRFttc2ddLmluY2x1ZGVzKCdbQ09ORklSTV9ERUFETElORV0nKSkge1xyXG4gICAgICAgICAgJHNjb3BlLkRBU0hCT0FSRFttc2ddID0gJHNjb3BlLkRBU0hCT0FSRFttc2ddLnJlcGxhY2UoJ1tDT05GSVJNX0RFQURMSU5FXScsIFV0aWxzLmZvcm1hdFRpbWUodXNlci5zdGF0dXMuY29uZmlybUJ5KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBJcyByZWdpc3RyYXRpb24gb3Blbj9cclxuICAgICAgdmFyIHJlZ0lzT3BlbiA9ICRzY29wZS5yZWdJc09wZW4gPSBVdGlscy5pc1JlZ09wZW4oU2V0dGluZ3MpO1xyXG5cclxuICAgICAgLy8gSXMgaXQgcGFzdCB0aGUgdXNlcidzIGNvbmZpcm1hdGlvbiB0aW1lP1xyXG4gICAgICB2YXIgcGFzdENvbmZpcm1hdGlvbiA9ICRzY29wZS5wYXN0Q29uZmlybWF0aW9uID0gVXRpbHMuaXNBZnRlcih1c2VyLnN0YXR1cy5jb25maXJtQnkpO1xyXG5cclxuICAgICAgJHNjb3BlLmRhc2hTdGF0ZSA9IGZ1bmN0aW9uKHN0YXR1cyl7XHJcbiAgICAgICAgdmFyIHVzZXIgPSAkc2NvcGUudXNlcjtcclxuICAgICAgICBzd2l0Y2ggKHN0YXR1cykge1xyXG4gICAgICAgICAgY2FzZSAndW52ZXJpZmllZCc6XHJcbiAgICAgICAgICAgIHJldHVybiAhdXNlci52ZXJpZmllZDtcclxuICAgICAgICAgIGNhc2UgJ29wZW5BbmRJbmNvbXBsZXRlJzpcclxuICAgICAgICAgICAgcmV0dXJuIHJlZ0lzT3BlbiAmJiB1c2VyLnZlcmlmaWVkICYmICF1c2VyLnN0YXR1cy5jb21wbGV0ZWRQcm9maWxlO1xyXG4gICAgICAgICAgY2FzZSAnb3BlbkFuZFN1Ym1pdHRlZCc6XHJcbiAgICAgICAgICAgIHJldHVybiByZWdJc09wZW4gJiYgdXNlci5zdGF0dXMuY29tcGxldGVkUHJvZmlsZSAmJiAhdXNlci5zdGF0dXMuYWRtaXR0ZWQ7XHJcbiAgICAgICAgICBjYXNlICdjbG9zZWRBbmRJbmNvbXBsZXRlJzpcclxuICAgICAgICAgICAgcmV0dXJuICFyZWdJc09wZW4gJiYgIXVzZXIuc3RhdHVzLmNvbXBsZXRlZFByb2ZpbGUgJiYgIXVzZXIuc3RhdHVzLmFkbWl0dGVkO1xyXG4gICAgICAgICAgY2FzZSAnY2xvc2VkQW5kU3VibWl0dGVkJzogLy8gV2FpdGxpc3RlZCBTdGF0ZVxyXG4gICAgICAgICAgICByZXR1cm4gIXJlZ0lzT3BlbiAmJiB1c2VyLnN0YXR1cy5jb21wbGV0ZWRQcm9maWxlICYmICF1c2VyLnN0YXR1cy5hZG1pdHRlZDtcclxuICAgICAgICAgIGNhc2UgJ2FkbWl0dGVkQW5kQ2FuQ29uZmlybSc6XHJcbiAgICAgICAgICAgIHJldHVybiAhcGFzdENvbmZpcm1hdGlvbiAmJlxyXG4gICAgICAgICAgICAgIHVzZXIuc3RhdHVzLmFkbWl0dGVkICYmXHJcbiAgICAgICAgICAgICAgIXVzZXIuc3RhdHVzLmNvbmZpcm1lZCAmJlxyXG4gICAgICAgICAgICAgICF1c2VyLnN0YXR1cy5kZWNsaW5lZDtcclxuICAgICAgICAgIGNhc2UgJ2FkbWl0dGVkQW5kQ2Fubm90Q29uZmlybSc6XHJcbiAgICAgICAgICAgIHJldHVybiBwYXN0Q29uZmlybWF0aW9uICYmXHJcbiAgICAgICAgICAgICAgdXNlci5zdGF0dXMuYWRtaXR0ZWQgJiZcclxuICAgICAgICAgICAgICAhdXNlci5zdGF0dXMuY29uZmlybWVkICYmXHJcbiAgICAgICAgICAgICAgIXVzZXIuc3RhdHVzLmRlY2xpbmVkO1xyXG4gICAgICAgICAgY2FzZSAnY29uZmlybWVkJzpcclxuICAgICAgICAgICAgcmV0dXJuIHVzZXIuc3RhdHVzLmFkbWl0dGVkICYmIHVzZXIuc3RhdHVzLmNvbmZpcm1lZCAmJiAhdXNlci5zdGF0dXMuZGVjbGluZWQ7XHJcbiAgICAgICAgICBjYXNlICdkZWNsaW5lZCc6XHJcbiAgICAgICAgICAgIHJldHVybiB1c2VyLnN0YXR1cy5kZWNsaW5lZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgJHNjb3BlLnNob3dXYWl0bGlzdCA9ICFyZWdJc09wZW4gJiYgdXNlci5zdGF0dXMuY29tcGxldGVkUHJvZmlsZSAmJiAhdXNlci5zdGF0dXMuYWRtaXR0ZWQ7XHJcblxyXG4gICAgICAkc2NvcGUucmVzZW5kRW1haWwgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIEF1dGhTZXJ2aWNlXHJcbiAgICAgICAgICAucmVzZW5kVmVyaWZpY2F0aW9uRW1haWwoKVxyXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBzd2FsKFwiQ2hlY2sgeW91ciBJbmJveCFcIiwgXCJZb3VyIGVtYWlsIGhhcyBiZWVuIHNlbnQuXCIsIFwic3VjY2Vzc1wiKTsgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvLyAkc2NvcGUucHJpbnRDb25maXJtYXRpb24gPWZ1bmN0aW9uKEltYWdlVVJMKXtcclxuXHJcbiAgICAgIC8vICAgaHRtbDJjYW52YXMoJCgnI3FyQ29kZScpLCB7XHJcbiAgICAgIC8vICAgICBhbGxvd1RhaW50OiB0cnVlLFxyXG4gICAgICAvLyAgICAgb25yZW5kZXJlZDogZnVuY3Rpb24gKGNhbnZhcykge1xyXG4gICAgICAvLyAgICAgICAgIHZhciBpbWdEYXRhID0gY2FudmFzLnRvRGF0YVVSTChcImltYWdlL2pwZWdcIiwgMS4wKTtcclxuICAgICAgLy8gICAgICAgICB2YXIgcGRmID0gbmV3IGpzUERGKCdwJywgJ21tJywgJ2EwJyk7XHJcbiAgXHJcbiAgICAgIC8vICAgICAgICAgcGRmLmFkZEltYWdlKGltZ0RhdGEsICdKUEVHJywgMCwgMCk7XHJcbiAgICAgIC8vICAgICAgICAgcGRmLnNhdmUoXCJDdXJyZW50IERhdGEyLnBkZlwiKVxyXG4gICAgICAvLyAgICAgfVxyXG4gICAgICAvLyB9KTtcclxuICAgICAgXHJcbiAgICAgIC8vIH1cclxuXHJcblxyXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAvLyBUZXh0IVxyXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICB2YXIgY29udmVydGVyID0gbmV3IHNob3dkb3duLkNvbnZlcnRlcigpO1xyXG4gICAgICAkc2NvcGUuYWNjZXB0YW5jZVRleHQgPSAkc2NlLnRydXN0QXNIdG1sKGNvbnZlcnRlci5tYWtlSHRtbChTZXR0aW5ncy5hY2NlcHRhbmNlVGV4dCkpO1xyXG4gICAgICAkc2NvcGUuY29uZmlybWF0aW9uVGV4dCA9ICRzY2UudHJ1c3RBc0h0bWwoY29udmVydGVyLm1ha2VIdG1sKFNldHRpbmdzLmNvbmZpcm1hdGlvblRleHQpKTtcclxuICAgICAgJHNjb3BlLndhaXRsaXN0VGV4dCA9ICRzY2UudHJ1c3RBc0h0bWwoY29udmVydGVyLm1ha2VIdG1sKFNldHRpbmdzLndhaXRsaXN0VGV4dCkpO1xyXG5cclxuICAgICAgJHNjb3BlLmRlY2xpbmVBZG1pc3Npb24gPSBmdW5jdGlvbigpe1xyXG5cclxuICAgICAgc3dhbCh7XHJcbiAgICAgICAgdGl0bGU6IFwiV2hvYSFcIixcclxuICAgICAgICB0ZXh0OiBcIkFyZSB5b3Ugc3VyZSB5b3Ugd291bGQgbGlrZSB0byBkZWNsaW5lIHlvdXIgYWRtaXNzaW9uPyBcXG5cXG4gWW91IGNhbid0IGdvIGJhY2shXCIsXHJcbiAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgY2FuY2VsOiB7XHJcbiAgICAgICAgICAgIHRleHQ6IFwiQ2FuY2VsXCIsXHJcbiAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgY29uZmlybToge1xyXG4gICAgICAgICAgICB0ZXh0OiBcIlllcywgSSBjYW4ndCBtYWtlIGl0XCIsXHJcbiAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBVc2VyU2VydmljZVxyXG4gICAgICAgICAgLmRlY2xpbmVBZG1pc3Npb24odXNlci5faWQpXHJcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICAkc2NvcGUudXNlciA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG4gIH1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXHJcbiAgLmNvbnRyb2xsZXIoJ0hvbWVDdHJsJywgW1xyXG4gICAgJyRyb290U2NvcGUnLFxyXG4gICAgJyRzY29wZScsXHJcbiAgICAnJGh0dHAnLFxyXG4gICAgJyRzdGF0ZScsXHJcbiAgICAnc2V0dGluZ3MnLFxyXG4gICAgJ1V0aWxzJyxcclxuICAgICdBdXRoU2VydmljZScsXHJcbiAgICAnRVZFTlRfSU5GTycsXHJcbiAgICBmdW5jdGlvbigkcm9vdFNjb3BlLCAkc2NvcGUsICRodHRwLCAkc3RhdGUsIHNldHRpbmdzLCBVdGlscywgQXV0aFNlcnZpY2UsIEVWRU5UX0lORk8pe1xyXG4gICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XHJcblxyXG4gICAgICAkc2NvcGUuRVZFTlRfSU5GTyA9IEVWRU5UX0lORk87XHJcblxyXG4gICAgICB2YXIgU2V0dGluZ3MgPSBzZXR0aW5ncy5kYXRhO1xyXG4gICAgICAkc2NvcGUucmVnSXNPcGVuID0gVXRpbHMuaXNSZWdPcGVuKFNldHRpbmdzKTtcclxuXHJcblxyXG4gICAgICAvLyBJcyByZWdpc3RyYXRpb24gb3Blbj9cclxuICAgICAgdmFyIFNldHRpbmdzID0gc2V0dGluZ3MuZGF0YTtcclxuICAgICAgJHNjb3BlLnJlZ0lzT3BlbiA9IFV0aWxzLmlzUmVnT3BlbihTZXR0aW5ncyk7XHJcblxyXG4gICAgICAvLyBTdGFydCBzdGF0ZSBmb3IgbG9naW5cclxuICAgICAgJHNjb3BlLmxvZ2luU3RhdGUgPSAnbG9naW4nO1xyXG5cclxuICAgICAgZnVuY3Rpb24gb25TdWNjZXNzKCkge1xyXG4gICAgICAgICRzdGF0ZS5nbygnYXBwLmRhc2hib2FyZCcpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBvbkVycm9yKGRhdGEpe1xyXG4gICAgICAgICRzY29wZS5lcnJvciA9IGRhdGEubWVzc2FnZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gcmVzZXRFcnJvcigpe1xyXG4gICAgICAgICRzY29wZS5lcnJvciA9IG51bGw7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgcmVzZXRFcnJvcigpO1xyXG4gICAgICAgIEF1dGhTZXJ2aWNlLmxvZ2luV2l0aFBhc3N3b3JkKFxyXG4gICAgICAgICAgJHNjb3BlLmVtYWlsLCAkc2NvcGUucGFzc3dvcmQsIG9uU3VjY2Vzcywgb25FcnJvcik7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkc2NvcGUucmVnaXN0ZXIgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIHJlc2V0RXJyb3IoKTtcclxuICAgICAgICBBdXRoU2VydmljZS5yZWdpc3RlcihcclxuICAgICAgICAgICRzY29wZS5lbWFpbCwgJHNjb3BlLnBhc3N3b3JkLCBvblN1Y2Nlc3MsIG9uRXJyb3IpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgJHNjb3BlLnNldExvZ2luU3RhdGUgPSBmdW5jdGlvbihzdGF0ZSkge1xyXG4gICAgICAgICRzY29wZS5sb2dpblN0YXRlID0gc3RhdGU7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkc2NvcGUuc2VuZFJlc2V0RW1haWwgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgZW1haWwgPSAkc2NvcGUuZW1haWw7XHJcbiAgICAgICAgQXV0aFNlcnZpY2Uuc2VuZFJlc2V0RW1haWwoZW1haWwpO1xyXG4gICAgICAgIHN3YWwoXCJEb24ndCBzd2VhdCFcIiwgXCJBbiBlbWFpbCBzaG91bGQgYmUgc2VudCB0byB5b3Ugc2hvcnRseS5cIiwgXCJzdWNjZXNzXCIpO1xyXG4gICAgICB9O1xyXG5cclxuXHJcblxyXG5cclxuICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5jb250cm9sbGVyKCdSZXNldEN0cmwnLCBbXHJcbiAgICAnJHNjb3BlJyxcclxuICAgICckc3RhdGVQYXJhbXMnLFxyXG4gICAgJyRzdGF0ZScsXHJcbiAgICAnQXV0aFNlcnZpY2UnLFxyXG4gICAgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGVQYXJhbXMsICRzdGF0ZSwgQXV0aFNlcnZpY2Upe1xyXG4gICAgICB2YXIgdG9rZW4gPSAkc3RhdGVQYXJhbXMudG9rZW47XHJcblxyXG4gICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XHJcblxyXG4gICAgICAkc2NvcGUuY2hhbmdlUGFzc3dvcmQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciBwYXNzd29yZCA9ICRzY29wZS5wYXNzd29yZDtcclxuICAgICAgICB2YXIgY29uZmlybSA9ICRzY29wZS5jb25maXJtO1xyXG5cclxuICAgICAgICBpZiAocGFzc3dvcmQgIT09IGNvbmZpcm0pe1xyXG4gICAgICAgICAgJHNjb3BlLmVycm9yID0gXCJQYXNzd29yZHMgZG9uJ3QgbWF0Y2ghXCI7XHJcbiAgICAgICAgICAkc2NvcGUuY29uZmlybSA9IFwiXCI7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBBdXRoU2VydmljZS5yZXNldFBhc3N3b3JkKFxyXG4gICAgICAgICAgdG9rZW4sXHJcbiAgICAgICAgICAkc2NvcGUucGFzc3dvcmQsXHJcbiAgICAgICAgICBtZXNzYWdlID0+IHtcclxuICAgICAgICAgICAgc3dhbChcIk5lYXRvIVwiLCBcIllvdXIgcGFzc3dvcmQgaGFzIGJlZW4gY2hhbmdlZCFcIiwgXCJzdWNjZXNzXCIpLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgICAgICAgICRzdGF0ZS5nbyhcImhvbWVcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSBkYXRhLm1lc3NhZ2U7XHJcbiAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcbiAgICB9XSk7XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxyXG4gIC5zZXJ2aWNlKCdzZXR0aW5ncycsIGZ1bmN0aW9uKCkge30pXHJcbiAgLmNvbnRyb2xsZXIoJ1NpZGViYXJDdHJsJywgW1xyXG4gICAgJyRyb290U2NvcGUnLFxyXG4gICAgJyRzY29wZScsXHJcbiAgICAnU2V0dGluZ3NTZXJ2aWNlJyxcclxuICAgICdVdGlscycsXHJcbiAgICAnQXV0aFNlcnZpY2UnLFxyXG4gICAgJ1Nlc3Npb24nLFxyXG4gICAgJ0VWRU5UX0lORk8nLFxyXG4gICAgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHNjb3BlLCBTZXR0aW5nc1NlcnZpY2UsIFV0aWxzLCBBdXRoU2VydmljZSwgU2Vzc2lvbiwgRVZFTlRfSU5GTyl7XHJcblxyXG4gICAgICB2YXIgdXNlciA9ICRyb290U2NvcGUuY3VycmVudFVzZXI7XHJcblxyXG4gICAgICAkc2NvcGUuRVZFTlRfSU5GTyA9IEVWRU5UX0lORk87XHJcblxyXG4gICAgICAkc2NvcGUucGFzdENvbmZpcm1hdGlvbiA9IFV0aWxzLmlzQWZ0ZXIodXNlci5zdGF0dXMuY29uZmlybUJ5KTtcclxuICAgICAgLy8kc2NvcGUucGFzdFNhdGFydCA9IFV0aWxzLmlzQWZ0ZXIoc2V0dGluZ3MudGltZVN0YXJ0KTtcclxuXHJcbiAgICAgIFNldHRpbmdzU2VydmljZVxyXG4gICAgICAuZ2V0UHVibGljU2V0dGluZ3MoKVxyXG4gICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgJHNjb3BlLnBhc3RTYXRhcnQgPSBVdGlscy5pc0FmdGVyKHJlc3BvbnNlLmRhdGEudGltZVN0YXJ0KVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgICRzY29wZS5sb2dvdXQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIEF1dGhTZXJ2aWNlLmxvZ291dCgpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgJHNjb3BlLnNob3dTaWRlYmFyID0gZmFsc2U7XHJcbiAgICAgICRzY29wZS50b2dnbGVTaWRlYmFyID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAkc2NvcGUuc2hvd1NpZGViYXIgPSAhJHNjb3BlLnNob3dTaWRlYmFyO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgLy8gb2ggZ29kIGpRdWVyeSBoYWNrXHJcbiAgICAgICQoJy5pdGVtJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuICAgICAgICAkc2NvcGUuc2hvd1NpZGViYXIgPSBmYWxzZTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcclxuICAuY29udHJvbGxlcignTG9naW5DdHJsJywgW1xyXG4gICAgJyRzY29wZScsXHJcbiAgICAnJGh0dHAnLFxyXG4gICAgJyRzdGF0ZScsXHJcbiAgICAnc2V0dGluZ3MnLFxyXG4gICAgJ1V0aWxzJyxcclxuICAgICdBdXRoU2VydmljZScsXHJcbiAgICAnRVZFTlRfSU5GTycsXHJcbiAgICBmdW5jdGlvbigkc2NvcGUsICRodHRwLCAkc3RhdGUsIHNldHRpbmdzLCBVdGlscywgQXV0aFNlcnZpY2UsIEVWRU5UX0lORk8pe1xyXG5cclxuICAgICAgJHNjb3BlLkVWRU5UX0lORk8gPSBFVkVOVF9JTkZPO1xyXG5cclxuICAgICAgLy8gSXMgcmVnaXN0cmF0aW9uIG9wZW4/XHJcbiAgICAgIHZhciBTZXR0aW5ncyA9IHNldHRpbmdzLmRhdGE7XHJcbiAgICAgICRzY29wZS5yZWdJc09wZW4gPSBVdGlscy5pc1JlZ09wZW4oU2V0dGluZ3MpO1xyXG5cclxuICAgICAgLy8gU3RhcnQgc3RhdGUgZm9yIGxvZ2luXHJcbiAgICAgICRzY29wZS5sb2dpblN0YXRlID0gJ2xvZ2luJztcclxuXHJcbiAgICAgIGZ1bmN0aW9uIG9uU3VjY2VzcygpIHtcclxuICAgICAgICAkc3RhdGUuZ28oJ2FwcC5kYXNoYm9hcmQnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gb25FcnJvcihkYXRhKXtcclxuICAgICAgICAkc2NvcGUuZXJyb3IgPSBkYXRhLm1lc3NhZ2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIHJlc2V0RXJyb3IoKXtcclxuICAgICAgICAkc2NvcGUuZXJyb3IgPSBudWxsO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkc2NvcGUubG9naW4gPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIHJlc2V0RXJyb3IoKTtcclxuICAgICAgICBBdXRoU2VydmljZS5sb2dpbldpdGhQYXNzd29yZChcclxuICAgICAgICAgICRzY29wZS5lbWFpbCwgJHNjb3BlLnBhc3N3b3JkLCBvblN1Y2Nlc3MsIG9uRXJyb3IpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgJHNjb3BlLnJlZ2lzdGVyID0gZnVuY3Rpb24oKXtcclxuICAgICAgICByZXNldEVycm9yKCk7XHJcbiAgICAgICAgQXV0aFNlcnZpY2UucmVnaXN0ZXIoXHJcbiAgICAgICAgICAkc2NvcGUuZW1haWwsICRzY29wZS5wYXNzd29yZCwgb25TdWNjZXNzLCBvbkVycm9yKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgICRzY29wZS5zZXRMb2dpblN0YXRlID0gZnVuY3Rpb24oc3RhdGUpIHtcclxuICAgICAgICAkc2NvcGUubG9naW5TdGF0ZSA9IHN0YXRlO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgJHNjb3BlLnNlbmRSZXNldEVtYWlsID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGVtYWlsID0gJHNjb3BlLmVtYWlsO1xyXG4gICAgICAgIEF1dGhTZXJ2aWNlLnNlbmRSZXNldEVtYWlsKGVtYWlsKTtcclxuICAgICAgICBzd2FsKFwiRG9uJ3Qgc3dlYXQhXCIsIFwiQW4gZW1haWwgc2hvdWxkIGJlIHNlbnQgdG8geW91IHNob3J0bHkuXCIsIFwic3VjY2Vzc1wiKTtcclxuICAgICAgfTtcclxuXHJcbiAgICB9XHJcbiAgXSk7XHJcbiIsIlxyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3JlZycpXHJcbiAgLmNvbnRyb2xsZXIoJ1RlYW1DdHJsJywgW1xyXG4gICAgJyRzY29wZScsXHJcbiAgICAnJHN0YXRlJyxcclxuICAgICckdGltZW91dCcsXHJcbiAgICAnY3VycmVudFVzZXInLFxyXG4gICAgJ3NldHRpbmdzJyxcclxuICAgICdVdGlscycsXHJcbiAgICAnVXNlclNlcnZpY2UnLFxyXG4gICAgJ1RlYW1TZXJ2aWNlJyxcclxuICAgICdURUFNJyxcclxuICAgIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgJHRpbWVvdXQsIGN1cnJlbnRVc2VyLCBzZXR0aW5ncywgVXRpbHMsIFVzZXJTZXJ2aWNlLCBUZWFtU2VydmljZSwgVEVBTSkge1xyXG4gICAgICAvLyBHZXQgdGhlIGN1cnJlbnQgdXNlcidzIG1vc3QgcmVjZW50IGRhdGEuXHJcbiAgICAgIHZhciBTZXR0aW5ncyA9IHNldHRpbmdzLmRhdGE7XHJcblxyXG4gICAgICAkc2NvcGUucmVnSXNPcGVuID0gVXRpbHMuaXNSZWdPcGVuKFNldHRpbmdzKTtcclxuXHJcbiAgICAgICRzY29wZS51c2VyID0gY3VycmVudFVzZXIuZGF0YTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIGlzVGVhbU1lbWJlcih0ZWFtcywgVXNlcmlkKSB7XHJcbiAgICAgICAgdmFyIHRlc3QgPSBmYWxzZTtcclxuICAgICAgICB0ZWFtcy5mb3JFYWNoKHRlYW0gPT4ge1xyXG4gICAgICAgICAgdGVhbS5tZW1iZXJzLmZvckVhY2gobWVtYmVyID0+IHtcclxuICAgICAgICAgICAgaWYgKG1lbWJlci5pZCA9PSBVc2VyaWQpIHRlc3QgPSB0cnVlO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRlc3Q7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIHNlbGVjdE1lbWJlcihtZW1iZXJJZCkge1xyXG4gICAgICAgIFVzZXJTZXJ2aWNlLmdldChtZW1iZXJJZCkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICB1c2VyID0gcmVzcG9uc2UuZGF0YVxyXG4gICAgICAgICAgJHNjb3BlLnNlbGVjdGVkVXNlciA9IHVzZXI7XHJcbiAgICAgICAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyLnNlY3Rpb25zID0gZ2VuZXJhdGVTZWN0aW9ucyh1c2VyKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zb2xlLmxvZyh1c2VyKTtcclxuICAgICAgICAkKFwiLmxvbmcudXNlci5tb2RhbFwiKS5tb2RhbChcInNob3dcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlU2VjdGlvbnModXNlcikge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6IFwiUHJvZmlsZVwiLFxyXG4gICAgICAgICAgICBmaWVsZHM6IFtcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcIkdlbmRlclwiLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5nZW5kZXJcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IFwiU2Nob29sXCIsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLnNjaG9vbFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogXCJHaXRodWJcIixcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuZ2l0aHViXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcIkxpbmtlZGluXCIsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmxpbmtlZGluXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICBdO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkc2NvcGUuc2VsZWN0TWVtYmVyID0gc2VsZWN0TWVtYmVyO1xyXG5cclxuXHJcbiAgICAgICRzY29wZS5pc2pvaW5lZCA9IGZ1bmN0aW9uICh0ZWFtKSB7XHJcbiAgICAgICAgdmFyIHRlc3QgPSBmYWxzZTtcclxuICAgICAgICB0ZWFtLmpvaW5SZXF1ZXN0cy5mb3JFYWNoKG1lbWJlciA9PiB7XHJcbiAgICAgICAgICBpZiAobWVtYmVyLmlkID09IGN1cnJlbnRVc2VyLmRhdGEuX2lkKSB0ZXN0ID0gdHJ1ZTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiB0ZXN0O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBUZWFtU2VydmljZS5nZXRBbGwoKS50aGVuKHRlYW1zID0+IHtcclxuICAgICAgICAkc2NvcGUuaXNUZWFtQWRtaW4gPSBmYWxzZTtcclxuICAgICAgICAkc2NvcGUuaXNUZWFtTWVtYmVyID0gZmFsc2U7XHJcbiAgICAgICAgdGVhbXMuZGF0YS5mb3JFYWNoKHRlYW0gPT4ge1xyXG4gICAgICAgICAgdGVhbS5pc01heHRlYW0gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICBpZiAodGVhbS5tZW1iZXJzLmxlbmd0aCA+PSBTZXR0aW5ncy5tYXhUZWFtU2l6ZSkge1xyXG4gICAgICAgICAgICB0ZWFtLmlzQ29sb3NlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRlYW0uaXNNYXh0ZWFtID0gdHJ1ZTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAodGVhbS5tZW1iZXJzWzBdLmlkID09IGN1cnJlbnRVc2VyLmRhdGEuX2lkKSB7XHJcbiAgICAgICAgICAgIHRlYW0uam9pblJlcXVlc3RzLmZvckVhY2gobWVtYmVyID0+IHtcclxuICAgICAgICAgICAgICBpZiAoaXNUZWFtTWVtYmVyKHRlYW1zLmRhdGEsIG1lbWJlci5pZCkpIHtcclxuICAgICAgICAgICAgICAgIG1lbWJlci51bmF2YWlsYWJsZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHsgbWVtYmVyLnVuYXZhaWxhYmxlID0gZmFsc2UgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJHNjb3BlLnVzZXJBZG1pblRlYW0gPSB0ZWFtO1xyXG4gICAgICAgICAgICAkc2NvcGUuaXNUZWFtQWRtaW4gPSB0cnVlO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGVhbS5tZW1iZXJzLmZvckVhY2gobWVtYmVyID0+IHtcclxuICAgICAgICAgICAgICBpZiAobWVtYmVyLmlkID09IGN1cnJlbnRVc2VyLmRhdGEuX2lkKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUudXNlck1lbWJlclRlYW0gPSB0ZWFtO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmlzVGVhbU1lbWJlciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgJHNjb3BlLnRlYW1zID0gdGVhbXMuZGF0YTtcclxuXHJcbiAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICRzY29wZS5jcmVhdGVUZWFtID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICB0ZWFtRGF0YSA9IHtcclxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAkc2NvcGUubmV3VGVhbV9kZXNjcmlwdGlvbixcclxuICAgICAgICAgIG1lbWJlcnM6IFt7IGlkOiBjdXJyZW50VXNlci5kYXRhLl9pZCwgbmFtZTogY3VycmVudFVzZXIuZGF0YS5wcm9maWxlLm5hbWUsIHNraWxsOiAkc2NvcGUubmV3VGVhbV9BZG1pbnNraWxsIH1dLFxyXG4gICAgICAgICAgc2tpbGxzOiB7IGNvZGU6ICRzY29wZS5za2lsbGNvZGUsIGRlc2lnbjogJHNjb3BlLnNraWxsZGVzaWduLCBoYXJkd2FyZTogJHNjb3BlLnNraWxsaGFyZHdhcmUsIGlkZWE6ICRzY29wZS5za2lsbGlkZWEgfSxcclxuICAgICAgICAgIGlzQ29sb3NlZDogZmFsc2UsXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBVc2VyU2VydmljZS5nZXQoY3VycmVudFVzZXIuZGF0YS5faWQpLnRoZW4odXNlcj0+e1xyXG4gICAgICAgICAgY29uc29sZS5sb2codXNlci5kYXRhLnRlYW0pO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBpZiAodHlwZW9mKHVzZXIuZGF0YS50ZWFtKT09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgIFRlYW1TZXJ2aWNlLmNyZWF0ZSh0ZWFtRGF0YSk7XHJcbiAgICAgICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgICAgXCJZb3UndmUgYW5vdGhlciB0ZWFtXCIsXHJcbiAgICAgICAgICAgICAgXCJZb3UgY2FuJ3QgYmUgcGFydCBvZiB0d28gdGVhbXMgYXQgdGhlIHNhbWUgdGltZSwgcGxlYXNlIGxlYXZlIHlvdXIgY3VycmVudCB0ZWFtIHRvIGNyZWF0ZSBhbm90aGVyIG9uZS5cIixcclxuICAgICAgICAgICAgICBcImVycm9yXCJcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH07XHJcblxyXG5cclxuICAgICAgJHNjb3BlLlNob3djcmVhdGVUZWFtID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICRzY29wZS5TaG93TmV3VGVhbUZyb20gPSB0cnVlO1xyXG4gICAgICAgICRzY29wZS5za2lsbGNvZGUgPSB0cnVlXHJcbiAgICAgICAgJHNjb3BlLnNraWxsZGVzaWduID0gdHJ1ZVxyXG4gICAgICAgICRzY29wZS5za2lsbGhhcmR3YXJlID0gdHJ1ZVxyXG4gICAgICAgICRzY29wZS5za2lsbGlkZWEgPSB0cnVlXHJcbiAgICAgICAgJHNjb3BlLm5ld1RlYW1fQWRtaW5za2lsbCA9IFwiY29kZVwiXHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgICAkc2NvcGUuU2hvd0pvaW5UZWFtID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAkc2NvcGUuU2hvd0pvaW5UZWFtRnJvbSA9IHRydWU7ICBcclxuICAgICAgfVxyXG5cclxuXHJcbiAgICAgICRzY29wZS5qb2luVGVhbUNvZGUgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIHRlYW1JRCA9ICRzY29wZS5uZXdUZWFtX0NvZGU7XHJcbiAgICAgICAgbmV3VGVhbV9za2lsbD0gJHNjb3BlLm5ld1RlYW1fc2tpbGw7XHJcblxyXG4gICAgICAgIG5ld3VzZXI9IHtpZDpjdXJyZW50VXNlci5kYXRhLl9pZCwgbmFtZTpjdXJyZW50VXNlci5kYXRhLnByb2ZpbGUubmFtZSwgc2tpbGw6bmV3VGVhbV9za2lsbH07XHJcbiAgICAgICAgVGVhbVNlcnZpY2Uuam9pbih0ZWFtSUQsbmV3dXNlcikudGhlbiggZT0+ICAgICAgICAgXHJcbiAgICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgXCJKb2luZWRcIixcclxuICAgICAgICAgIFwiWW91IGhhdmUgYXBwbGljZWQgdG8gam9pbiB0aGlzIHRlYW0sIHdhaXQgZm9yIHRoZSBUZWFtLUFkbWluIHRvIGFjY2VwdCB5b3VyIGFwcGxpY2F0aW9uLlwiLFxyXG4gICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICApXHJcbiAgICAgICAgKS5jYXRjaChlcnI9PiBcclxuICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgIFwiVGVhbSBub3QgZm91bmRcIixcclxuICAgICAgICAgICAgXCJUaGUgdGVhbSBjb2RlIHlvdSBlbnRlcmVkIGRvZXNuJ3QgZXhpc3QuXCIsXHJcbiAgICAgICAgICAgIFwiZXJyb3JcIlxyXG4gICAgICAgICAgKVxyXG4gICAgICAgICAgKTsgXHJcbiAgICAgICAgJHN0YXRlLnJlbG9hZCgpO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICAkc2NvcGUuam9pblRlYW0gPSBmdW5jdGlvbiAodGVhbSkge1xyXG5cclxuICAgICAgICB2YXIgdmFsdWU7XHJcbiAgICAgICAgY29uc3Qgc2VsZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2VsZWN0Jyk7XHJcbiAgICAgICAgc2VsZWN0LmNsYXNzTmFtZSA9ICdzZWxlY3QtY3VzdG9tJ1xyXG5cclxuXHJcbiAgICAgICAgdmFyIG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xyXG4gICAgICAgIG9wdGlvbi5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgICAgb3B0aW9uLmlubmVySFRNTCA9ICdTZWxlY3QgYSBza2lsbCc7XHJcbiAgICAgICAgb3B0aW9uLnZhbHVlID0gXCJjb2RlXCJcclxuICAgICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQob3B0aW9uKTtcclxuXHJcblxyXG4gICAgICAgIGlmICh0ZWFtLnNraWxscy5jb2RlKSB7XHJcbiAgICAgICAgICBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcclxuICAgICAgICAgIG9wdGlvbi5pbm5lckhUTUwgPSAnQ29kZSc7XHJcbiAgICAgICAgICBvcHRpb24udmFsdWUgPSBcImNvZGVcIlxyXG4gICAgICAgICAgc2VsZWN0LmFwcGVuZENoaWxkKG9wdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0ZWFtLnNraWxscy5kZXNpZ24pIHtcclxuICAgICAgICAgIG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xyXG4gICAgICAgICAgb3B0aW9uLmlubmVySFRNTCA9ICdEZXNpZ24nO1xyXG4gICAgICAgICAgb3B0aW9uLnZhbHVlID0gXCJkZXNpZ25cIlxyXG4gICAgICAgICAgc2VsZWN0LmFwcGVuZENoaWxkKG9wdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0ZWFtLnNraWxscy5oYXJkd2FyZSkge1xyXG4gICAgICAgICAgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcbiAgICAgICAgICBvcHRpb24uaW5uZXJIVE1MID0gJ0hhcmR3YXJlJztcclxuICAgICAgICAgIG9wdGlvbi52YWx1ZSA9IFwiaGFyZHdhcmVcIlxyXG4gICAgICAgICAgc2VsZWN0LmFwcGVuZENoaWxkKG9wdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0ZWFtLnNraWxscy5pZGVhKSB7XHJcbiAgICAgICAgICBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcclxuICAgICAgICAgIG9wdGlvbi5pbm5lckhUTUwgPSAnSWRlYSc7XHJcbiAgICAgICAgICBvcHRpb24udmFsdWUgPSBcImlkZWFcIlxyXG4gICAgICAgICAgc2VsZWN0LmFwcGVuZENoaWxkKG9wdGlvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZWxlY3Qub25jaGFuZ2UgPSBmdW5jdGlvbiBzZWxlY3RDaGFuZ2VkKGUpIHtcclxuICAgICAgICAgIHZhbHVlID0gZS50YXJnZXQudmFsdWVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgdGl0bGU6IFwiUGxlYXNlIHNlbGVjdCB5b3VyIHNraWxsIHRvIGpvaW5cIixcclxuXHJcbiAgICAgICAgICBjb250ZW50OiB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQ6IHNlbGVjdCxcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICBuZXd1c2VyID0geyBpZDogY3VycmVudFVzZXIuZGF0YS5faWQsIG5hbWU6IGN1cnJlbnRVc2VyLmRhdGEucHJvZmlsZS5uYW1lLCBza2lsbDogdmFsdWUgfTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgVGVhbVNlcnZpY2Uuam9pbih0ZWFtLl9pZCwgbmV3dXNlcikudGhlbiggZT0+ICAgICAgICAgXHJcbiAgICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgIFwiSm9pbmVkXCIsXHJcbiAgICAgICAgICAgIFwiWW91IGhhdmUgYXBwbGljZWQgdG8gam9pbiB0aGlzIHRlYW0sIHdhaXQgZm9yIHRoZSBUZWFtLUFkbWluIHRvIGFjY2VwdCB5b3VyIGFwcGxpY2F0aW9uLlwiLFxyXG4gICAgICAgICAgICBcInN1Y2Nlc3NcIlxyXG4gICAgICAgICAgKVxyXG4gICAgICAgICAgKS5jYXRjaChlcnI9PiBcclxuICAgICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgICBcIlRlYW0gbm90IGZvdW5kXCIsXHJcbiAgICAgICAgICAgICAgXCJUaGUgdGVhbSBjb2RlIHlvdSBlbnRlcmVkIGRvZXNuJ3QgZXhpc3QuXCIsXHJcbiAgICAgICAgICAgICAgXCJlcnJvclwiXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICAgKTsgXHJcbiAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG5cclxuXHJcbiAgICAgICRzY29wZS5hY2NlcHRNZW1iZXIgPSBmdW5jdGlvbiAodGVhbUlELCBtZW1iZXIsIGluZGV4KSB7XHJcblxyXG4gICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIixcclxuICAgICAgICAgIHRleHQ6IFwiWW91IGFyZSBhYm91dCB0byBhY2NlcHQgXCIgKyBtZW1iZXIubmFtZSArIFwiIHRvIHlvdXIgdGVhbSEgVGhpcyB3aWxsIHNlbmQgaGltIGEgbm90aWZpY2F0aW9uIGVtYWlsIGFuZCB3aWxsIHNob3cgaW4gdGhlIHB1YmxpYyB0ZWFtcyBwYWdlLlwiLFxyXG4gICAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgIGNhbmNlbDoge1xyXG4gICAgICAgICAgICAgIHRleHQ6IFwiQ2FuY2VsXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjaGVja0luOiB7XHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcclxuICAgICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcclxuICAgICAgICAgICAgICB0ZXh0OiBcIlllcywgbGV0IGhpbSBpblwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBUZWFtU2VydmljZS5hY2NlcHRNZW1iZXIodGVhbUlELCBtZW1iZXIsIFNldHRpbmdzLm1heFRlYW1TaXplKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlID09IFwibWF4VGVhbVNpemVcIikge1xyXG4gICAgICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgICAgICBcIkVycm9yXCIsXHJcbiAgICAgICAgICAgICAgICBcIk1heGltdW0gbnVtYmVyIG9mIG1lbWJlcnMgKFwiICsgU2V0dGluZ3MubWF4VGVhbVNpemUgKyBcIikgcmVhY2hlZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiXHJcbiAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBUZWFtU2VydmljZS5yZW1vdmVqb2luKHRlYW1JRCwgaW5kZXgsIGZhbHNlKS50aGVuKHJlc3BvbnNlMiA9PiB7XHJcbiAgICAgICAgICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgICAgICAgICBcIkFjY2VwdGVkXCIsXHJcbiAgICAgICAgICAgICAgICAgIG1lbWJlci5uYW1lICsgXCIgaGFzIGJlZW4gYWNjZXB0ZWQgdG8geW91ciB0ZWFtLlwiLFxyXG4gICAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIlxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcblxyXG5cclxuICAgICAgJHNjb3BlLnJlZnVzZU1lbWJlciA9IGZ1bmN0aW9uICh0ZWFtSUQsIG1lbWJlciwgaW5kZXgpIHtcclxuICAgICAgICBzd2FsKHtcclxuICAgICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXHJcbiAgICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gcmVmdXNlIFwiICsgbWVtYmVyLm5hbWUgKyBcIiBmcm9tIHlvdXIgdGVhbSEgVGhpcyB3aWxsIHNlbmQgaGltIGEgbm90aWZpY2F0aW9uIGVtYWlsLlwiLFxyXG4gICAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgIGNhbmNlbDoge1xyXG4gICAgICAgICAgICAgIHRleHQ6IFwiQ2FuY2VsXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjaGVja0luOiB7XHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcclxuICAgICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcclxuICAgICAgICAgICAgICB0ZXh0OiBcIlllcywgcmVmdXNlIGhpbVwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBUZWFtU2VydmljZS5yZW1vdmVqb2luKHRlYW1JRCwgaW5kZXgsIG1lbWJlcikudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgICAgXCJSZWZ1c2VkXCIsXHJcbiAgICAgICAgICAgICAgbWVtYmVyLm5hbWUgKyBcIiBoYXMgYmVlbiByZWZ1c2VkIGZyb20geW91ciB0ZWFtLlwiLFxyXG4gICAgICAgICAgICAgIFwic3VjY2Vzc1wiXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG5cclxuICAgICAgJHNjb3BlLnJlbW92ZU1lbWJlcmZyb21UZWFtID0gZnVuY3Rpb24gKHRlYW1JRCwgbWVtYmVyLCBpbmRleCkge1xyXG4gICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIixcclxuICAgICAgICAgIHRleHQ6IFwiWW91IGFyZSBhYm91dCB0byByZW1vdmUgXCIgKyBtZW1iZXIubmFtZSArIFwiIGZyb20geW91ciB0ZWFtISBUaGlzIHdpbGwgc2VuZCBoaW0gYSBub3RpZmljYXRpb24gZW1haWwuXCIsXHJcbiAgICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcclxuICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgY2FuY2VsOiB7XHJcbiAgICAgICAgICAgICAgdGV4dDogXCJDYW5jZWxcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNoZWNrSW46IHtcclxuICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxyXG4gICAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIHRleHQ6IFwiWWVzLCByZW1vdmUgaGltXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHRydWUsXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XHJcbiAgICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFRlYW1TZXJ2aWNlLnJlbW92ZW1lbWJlcih0ZWFtSUQsIGluZGV4LCBtZW1iZXIuaWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2UgPT0gXCJyZW1vdmluZ0FkbWluXCIpIHtcclxuICAgICAgICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgICAgICAgXCJFcnJvclwiLFxyXG4gICAgICAgICAgICAgICAgXCJZb3UgY2FuJ3QgcmVtb3ZlIHRoZSBUZWFtIEFkbWluLCBCdXQgeW91IGNhbiBjbG9zZSB0aGUgdGVhbS5cIixcclxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIlxyXG4gICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgVGVhbVNlcnZpY2UucmVtb3Zlam9pbih0ZWFtSUQsIGluZGV4LCBmYWxzZSkudGhlbihyZXNwb25zZTIgPT4ge1xyXG4gICAgICAgICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgICAgICAgXCJSZW1vdmVkXCIsXHJcbiAgICAgICAgICAgICAgICAgIG1lbWJlci5uYW1lICsgXCIgaGFzIGJlZW4gcmVtb3ZlZCBmcm9tIHlvdXIgdGVhbS5cIixcclxuICAgICAgICAgICAgICAgICAgXCJzdWNjZXNzXCJcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG5cclxuXHJcbiAgICAgICRzY29wZS5yZW1vdmVUZWFtID0gZnVuY3Rpb24gKHRlYW0pIHtcclxuICAgICAgICBzd2FsKHtcclxuICAgICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXHJcbiAgICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gcmVtb3ZlIHRoaXMgdGVhbSB3aXRoIGFsbCBpdCdzIG1lbWJlcnMhIFRoaXMgd2lsbCBzZW5kIHRoZW0gYSBub3RpZmljYXRpb24gZW1haWwuIFlvdSBuZWVkIHRvIGZpbmQgYW5vdGhlciB0ZWFtIHRvIHdvcmsgd2l0aC5cIixcclxuICAgICAgICAgIGljb246IFwid2FybmluZ1wiLFxyXG4gICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgICB0ZXh0OiBcIkNhbmNlbFwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2hlY2tJbjoge1xyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgdGV4dDogXCJZZXMsIHJlbW92ZSB0ZWFtXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHRydWUsXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSkudGhlbih2YWx1ZSA9PiB7XHJcbiAgICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBlbWFpbCA9IHtcclxuICAgICAgICAgICAgc3ViamVjdDogXCJZb3VyIHRlYW0gaGFzIGJlZW4gcmVtb3ZlZFwiLFxyXG4gICAgICAgICAgICB0aXRsZTogXCJUaW1lIGZvciBhIGJhY2t1cCBwbGFuXCIsXHJcbiAgICAgICAgICAgIGJvZHk6IFwiVGhlIHRlYW0geW91IGhhdmUgYmVlbiBwYXJ0IG9mIChNZW1iZXIvcmVxdWVzdGVkIHRvIGpvaW4pIGhhcyBiZWVuIHJlbW92ZWQuIFBsZWFzZSBjaGVjayB5b3VyIGRhc2hib2FyZCBhbmQgdHJ5IHRvIGZpbmQgYW5vdGhlciB0ZWFtIHRvIHdvcmsgd2l0aCBiZWZvcmUgdGhlIGhhY2thdGhvbiBzdGFydHMuXCJcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBUZWFtU2VydmljZS5yZW1vdmUodGVhbS5faWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICB0ZWFtLm1lbWJlcnMuZm9yRWFjaCh1c2VyID0+IHtcclxuICAgICAgICAgICAgICBVc2VyU2VydmljZS5yZW1vdmV0ZWFtZmllbGQodXNlci5pZClcclxuICAgICAgICAgICAgICBpZiAodXNlci5pZCAhPSBjdXJyZW50VXNlci5kYXRhLl9pZCkge1xyXG4gICAgICAgICAgICAgICAgVXNlclNlcnZpY2Uuc2VuZEJhc2ljTWFpbCh1c2VyLmlkLCBlbWFpbCk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGVhbS5qb2luUmVxdWVzdHMuZm9yRWFjaCh1c2VyID0+IHtcclxuICAgICAgICAgICAgICBVc2VyU2VydmljZS5zZW5kQmFzaWNNYWlsKHVzZXIuaWQsIGVtYWlsKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBzd2FsKFxyXG4gICAgICAgICAgICAgIFwiUmVtb3ZlZFwiLFxyXG4gICAgICAgICAgICAgIFwiVGVhbSBoYXMgYmVlbiByZW1vdmVkLlwiLFxyXG4gICAgICAgICAgICAgIFwic3VjY2Vzc1wiXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG5cclxuICAgICAgJHNjb3BlLmxlYXZlVGVhbSA9IGZ1bmN0aW9uICh0ZWFtKSB7XHJcbiAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxyXG4gICAgICAgICAgdGV4dDogXCJZb3UgYXJlIGFib3V0IHRvIGxlYXZlIHlvdXIgdGVhbSEgVGhpcyB3aWxsIHNlbmQgdGhlIGFkbWluIGEgbm90aWZpY2F0aW9uIGVtYWlsLlwiLFxyXG4gICAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgIGNhbmNlbDoge1xyXG4gICAgICAgICAgICAgIHRleHQ6IFwiQ2FuY2VsXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjaGVja0luOiB7XHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcclxuICAgICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcclxuICAgICAgICAgICAgICB0ZXh0OiBcIlllcywgcmVtb3ZlIGhpbVwiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB2YXIgaW5kZXggPSAwO1xyXG4gICAgICAgICAgdGVhbS5tZW1iZXJzLmZvckVhY2gobWVtYmVyID0+IHtcclxuICAgICAgICAgICAgaWYgKG1lbWJlci5pZCA9PSBjdXJyZW50VXNlci5kYXRhLl9pZCkge1xyXG4gICAgICAgICAgICAgIFRlYW1TZXJ2aWNlLnJlbW92ZW1lbWJlcih0ZWFtLl9pZCwgaW5kZXgpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgICAgICAgXCJSZW1vdmVkXCIsXHJcbiAgICAgICAgICAgICAgICAgIFwiWW91IGhhdmUgc3VjY2Vzc2Z1bGx5IGxlZnQgdGhpcyB0ZWFtLiBQbGVhc2UgZmluZCBhbm90aGVyIHRlYW0gb3IgY3JlYXRlIHlvdXIgb3duLlwiLFxyXG4gICAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIlxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcclxuICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaW5kZXgrKztcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgICAkc2NvcGUuY2FuY2Vsam9pblRlYW0gPSBmdW5jdGlvbiAodGVhbSkge1xyXG4gICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIixcclxuICAgICAgICAgIHRleHQ6IFwiWW91IGFyZSBhYm91dCB0byBjYW5jZWwgeW91ciByZXF1ZXN0IHRvIGpvaW4gdGhpcyB0ZWFtIVwiLFxyXG4gICAgICAgICAgaWNvbjogXCJ3YXJuaW5nXCIsXHJcbiAgICAgICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgICAgIGNhbmNlbDoge1xyXG4gICAgICAgICAgICAgIHRleHQ6IFwiTm9cIixcclxuICAgICAgICAgICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNoZWNrSW46IHtcclxuICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiZGFuZ2VyLWJ1dHRvblwiLFxyXG4gICAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIHRleHQ6IFwiWWVzLCBDYW5jZWxcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdmFyIGluZGV4ID0gMDtcclxuXHJcbiAgICAgICAgICB0ZWFtLmpvaW5SZXF1ZXN0cy5mb3JFYWNoKG1lbWJlciA9PiB7XHJcbiAgICAgICAgICAgIGlmIChtZW1iZXIuaWQgPT0gY3VycmVudFVzZXIuZGF0YS5faWQpIHtcclxuICAgICAgICAgICAgICBUZWFtU2VydmljZS5yZW1vdmVqb2luKHRlYW0uX2lkLCBpbmRleCwgZmFsc2UpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgICAgICAgXCJSZW1vdmVkXCIsXHJcbiAgICAgICAgICAgICAgICAgIFwiWW91IGhhdmUgc3VjY2Vzc2Z1bGx5IGNhbmNlbGVkIHlvdSByZXF1ZXN0IHRvIGpvaW4gdGhpcyB0ZWFtLiBQbGVhc2UgZmluZCBhbm90aGVyIHRlYW0gb3IgY3JlYXRlIHlvdXIgb3duLlwiLFxyXG4gICAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIlxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcclxuICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaW5kZXgrKztcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgICAkc2NvcGUudG9nZ2xlQ2xvc2VUZWFtID0gZnVuY3Rpb24gKHRlYW1JRCwgc3RhdHVzKSB7XHJcbiAgICAgICAgaWYgKHN0YXR1cyA9PSB0cnVlKSB7XHJcbiAgICAgICAgICB0ZXh0ID0gXCJZb3UgYXJlIGFib3V0IHRvIENsb3NlIHRoaXMgdGVhbS4gVGhpcyB3b24ndCBhbGxvdyBvdGhlciBtZW1iZXJzIHRvIGpvaW4geW91ciB0ZWFtIVwiXHJcbiAgICAgICAgfSBlbHNlIHsgdGV4dCA9IFwiWW91IGFyZSBhYm91dCB0byByZW9wZW4gdGhpcyB0ZWFtLiBUaGlzIHdpbGwgYWxsb3cgb3RoZXIgbWVtYmVycyB0byBqb2luIHlvdXIgdGVhbSFcIiB9XHJcblxyXG4gICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgdGl0bGU6IFwiV2hvYSwgd2FpdCBhIG1pbnV0ZSFcIixcclxuICAgICAgICAgIHRleHQ6IHRleHQsXHJcbiAgICAgICAgICBpY29uOiBcIndhcm5pbmdcIixcclxuICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgY2FuY2VsOiB7XHJcbiAgICAgICAgICAgICAgdGV4dDogXCJOb1wiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2hlY2tJbjoge1xyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXItYnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgdGV4dDogXCJZZXNcIixcclxuICAgICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KS50aGVuKHZhbHVlID0+IHtcclxuICAgICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgVGVhbVNlcnZpY2UudG9nZ2xlQ2xvc2VUZWFtKHRlYW1JRCwgc3RhdHVzKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgc3dhbChcclxuICAgICAgICAgICAgICBcIkRvbmVcIixcclxuICAgICAgICAgICAgICBcIk9wZXJhdGlvbiBzdWNjZXNzZnVsbHkgQ29tcGxldGVkLlwiLFxyXG4gICAgICAgICAgICAgIFwic3VjY2Vzc1wiXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICRzdGF0ZS5yZWxvYWQoKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG5cclxuXHJcbiAgICAgICRzY29wZS50b2dnbGVIaWRlVGVhbSA9IGZ1bmN0aW9uICh0ZWFtSUQsIHN0YXR1cykge1xyXG4gICAgICAgIGlmIChzdGF0dXMgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgdGV4dCA9IFwiWW91IGFyZSBhYm91dCB0byBIaWRlIHRoaXMgdGVhbS4gVGhpcyB3b24ndCBhbGxvdyBvdGhlciBtZW1iZXJzIHRvIHNlZSB5b3VyIHRlYW0hXCJcclxuICAgICAgICB9IGVsc2UgeyB0ZXh0ID0gXCJZb3UgYXJlIGFib3V0IHRvIFNob3cgdGhpcyB0ZWFtLiBUaGlzIHdpbGwgYWxsb3cgb3RoZXIgbWVtYmVycyB0byBzZWUgeW91ciB0ZWFtIVwiIH1cclxuXHJcbiAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxyXG4gICAgICAgICAgdGV4dDogdGV4dCxcclxuICAgICAgICAgIGljb246IFwid2FybmluZ1wiLFxyXG4gICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgICB0ZXh0OiBcIk5vXCIsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjaGVja0luOiB7XHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImRhbmdlci1idXR0b25cIixcclxuICAgICAgICAgICAgICBjbG9zZU1vZGFsOiBmYWxzZSxcclxuICAgICAgICAgICAgICB0ZXh0OiBcIlllc1wiLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pLnRoZW4odmFsdWUgPT4ge1xyXG4gICAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBUZWFtU2VydmljZS50b2dnbGVIaWRlVGVhbSh0ZWFtSUQsIHN0YXR1cykudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHN3YWwoXHJcbiAgICAgICAgICAgICAgXCJEb25lXCIsXHJcbiAgICAgICAgICAgICAgXCJPcGVyYXRpb24gc3VjY2Vzc2Z1bGx5IENvbXBsZXRlZC5cIixcclxuICAgICAgICAgICAgICBcInN1Y2Nlc3NcIlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAkc3RhdGUucmVsb2FkKCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgJHNjb3BlLiR3YXRjaChcInF1ZXJ5VGV4dFwiLCBmdW5jdGlvbiAocXVlcnlUZXh0KSB7XHJcbiAgICAgICAgVGVhbVNlcnZpY2UuZ2V0U2VsZWN0ZWRUZWFtcyhxdWVyeVRleHQsICRzY29wZS5za2lsbHNGaWx0ZXJzKS50aGVuKFxyXG4gICAgICAgICAgcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAkc2NvcGUudGVhbXMgPSByZXNwb25zZS5kYXRhLnRlYW1zO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgJHNjb3BlLmFwcGx5c2tpbGxzRmlsdGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIFRlYW1TZXJ2aWNlLmdldFNlbGVjdGVkVGVhbXMoJHNjb3BlLnF1ZXJ5VGV4dCwgJHNjb3BlLnNraWxsc0ZpbHRlcnMpLnRoZW4oXHJcbiAgICAgICAgICByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICRzY29wZS50ZWFtcyA9IHJlc3BvbnNlLmRhdGEudGVhbXM7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgICAgfTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgfV0pO1xyXG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcclxuICAuY29udHJvbGxlcignVmVyaWZ5Q3RybCcsIFtcclxuICAgICckc2NvcGUnLFxyXG4gICAgJyRzdGF0ZVBhcmFtcycsXHJcbiAgICAnQXV0aFNlcnZpY2UnLFxyXG4gICAgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGVQYXJhbXMsIEF1dGhTZXJ2aWNlKXtcclxuICAgICAgdmFyIHRva2VuID0gJHN0YXRlUGFyYW1zLnRva2VuO1xyXG5cclxuICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgaWYgKHRva2VuKSB7XHJcbiAgICAgICAgQXV0aFNlcnZpY2UudmVyaWZ5KHRva2VuLFxyXG4gICAgICAgICAgZnVuY3Rpb24odXNlcil7XHJcbiAgICAgICAgICAgICRzY29wZS5zdWNjZXNzID0gdHJ1ZTtcclxuICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBmdW5jdGlvbihlcnIpe1xyXG4gICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1dKTtcclxuIl19
