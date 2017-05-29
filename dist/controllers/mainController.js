var myApp;
(function (myApp) {
    var MainCtrl = (function () {
        function MainCtrl($scope, $location, $auth, Toast, Auth, $mdDialog, $rootScope, $timeout, $window, Upload) {
            this.$scope = $scope;
            this.$location = $location;
            this.$auth = $auth;
            this.Toast = Toast;
            this.Auth = Auth;
            this.$mdDialog = $mdDialog;
            this.$rootScope = $rootScope;
            this.$timeout = $timeout;
            this.$window = $window;
            this.Upload = Upload;
            this.checkIfLoggedIn();
        }
        MainCtrl.prototype.upload = function (file) {
            this.Upload.upload({
                url: 'http://127.0.0.1:8000/api/storePhoto/' + this.$scope.currentUser.id,
                data: {
                    file: file
                }
            }).then(function (response) {
                console.log(response);
            });
        };
        MainCtrl.prototype.checkIfLoggedIn = function () {
            var _this = this;
            if (this.$auth.isAuthenticated()) {
                this.Auth.currentUser().then(function (data) {
                    _this.$scope.currentUser = data.data;
                    if (data.data.role === 2) {
                        _this.$scope.admin = true;
                    }
                    var fb = data.data.facebook_picture;
                    var google = data.data.google_picture;
                    if (data.data.image) {
                        _this.$scope.image = data.data.image;
                    }
                    else {
                        if (fb) {
                            _this.$scope.image = fb;
                        }
                        else if (google) {
                            _this.$scope.image = google;
                        }
                        else {
                            _this.$scope.image = _this.$location.$$protocol + '://' + _this.$location.$$host + '/img/profile_placeholder.png';
                        }
                    }
                });
            }
            else {
                this.$scope.currentUser = '';
            }
        };
        MainCtrl.prototype.passwordUpdate = function (user) {
            var _this = this;
            this.Auth.updateUserPassword(user).then(function (data) {
                _this.$timeout(function () {
                    _this.$window.location.reload();
                }, 2000);
                _this.Toast.makeToast('success', data.data.message);
            })["catch"](function (response) {
                _this.Toast.makeToast('error', response.data.error);
            });
        };
        MainCtrl.prototype.logout = function () {
            var _this = this;
            this.$auth.logout();
            this.$timeout(function () {
                _this.$location.path('/');
                _this.$window.location.reload();
            }, 2000);
            this.Toast.makeToast('error', 'You are being logged out, redirecting...');
        };
        MainCtrl.prototype.login = function (user) {
            var _this = this;
            this.$auth.login(user)
                .then(function (data) {
                _this.$timeout(function () {
                    _this.$location.path('/');
                    _this.$window.location.reload();
                }, 2000);
                _this.Toast.makeToast('success', data.data.message);
            })["catch"](function (error) {
                _this.Toast.makeToast('error', error.data.error);
            });
        };
        MainCtrl.prototype.authenticate = function (provider) {
            var _this = this;
            this.$auth.authenticate(provider).then(function (response) {
                _this.$timeout(function () {
                    _this.$location.path('/');
                    _this.$window.location.reload();
                }, 2000);
                _this.Toast.makeToast('success', response.data.message);
            })["catch"](function (response) {
                _this.Toast.makeToast('error', 'Something went wrong');
            });
        };
        return MainCtrl;
    }());
    MainCtrl.$inject = [
        '$scope',
        '$location',
        '$auth',
        'toastService',
        'auth',
        '$mdDialog',
        '$rootScope',
        '$timeout',
        '$window',
        'Upload'
    ];
    myApp.MainCtrl = MainCtrl;
    angular.module('myApp').controller('myApp.MainCtrl', MainCtrl);
})(myApp || (myApp = {}));
