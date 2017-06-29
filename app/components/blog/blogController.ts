
module myApp{

    'use-strict';

    export class BlogCtrl {
            static $inject =[
                '$http',
                '$scope',
                '$location',
                'BlogResource',
                '$stateParams',
                'Upload',
                'MediaResource',
                'toastService',
                '$state',
                '_',
                'config'
            ];

            posts:any = [];
            post:any = [];
            images:any = [];
            news:any = [];
            headers:any = [];
            tournaments:any =[];
            currentState:string;
            player:any;


        constructor(public $http:ng.IHttpService,
                        public $scope:ng.IScope,
                        public $location:any,
                        protected BlogResource:any,
                        protected $stateParams:any,
                        public Upload:any,
                    protected media:any,
                    protected Toast:any,
                    protected $state:any,
                    protected _:any,
                    protected config:any
        ){

            $scope.shareUrl = (postId:number) => {
                return config.basePath + 'post/'+ postId;
            } ;
            //youtube player
            function onYouTubeIframeAPIReady() {
                this.player = new YT.Player('player', {
                    height: '390',
                    width: '640',
                    videoId: 'M7lc1UVf-VE',
                    events: {
                        'onReady': onPlayerReady,
                        'onStateChange': onPlayerStateChange
                    }
                });
            }

            // 4. The API will call this function when the video player is ready.
            function onPlayerReady(event) {
                event.target.playVideo();
            }

            // 5. The API calls this function when the player's state changes.
            //    The function indicates that when playing a video (state=1),
            //    the player should play for six seconds and then stop.
            var done = false;
            function onPlayerStateChange(event) {
                if (event.data == YT.PlayerState.PLAYING && !done) {
                    setTimeout(stopVideo, 6000);
                    done = true;
                }
            }
            function stopVideo() {
                this.player.stopVideo();
            }
            // end of YT player
            $scope.methods = {};
            this.currentState =  $state.current.name;


            this.media.image.query({ postId:$stateParams['postId']}).$promise.then((response)=>{
                this.images = response;
            });
            if($stateParams['categoryId']) {
                this.BlogResource.post.getByType({type: this.$stateParams['categoryId']}).$promise.then((response) => {
                    this.posts = response;

                });
            }
            if($state.current.name == 'index') {
                //For front page, maybe we can change to pull trough one call
                this.BlogResource.post.getByType({type: 'news'}).$promise.then((response) => {
                    this.news = response;
                });

                this.BlogResource.post.getByType({type: 'header'}).$promise.then((response) => {
                    this.headers = response;
                });
                //-----
            }
            if($stateParams['postId']) {
                console.log('post');
                this.BlogResource.post.get({postId: $stateParams['postId']}).$promise.then((response) => {
                    this.post = response;
                });
            }
            $scope.conf = {
                thumbnails 	: 	true,
                thumbSize		: 	150,
                inline		: 	false,
                bubbles		: 	true,
                bubbleSize		: 	50,
                imgBubbles 	: 	true,
                bgClose		: 	false,
                imgAnim 		: 	'fadeup'
            };

            $scope.openGallery = () =>{
                $scope.methods.open();

            };
            // Similar to above function
            $scope.closeGallery = () =>{
                $scope.methods.close();

            };

            $scope.nextImg = () =>{
                $scope.methods.next();
            };

            $scope.prevImg = () =>{
                $scope.methods.prev();
            };


        }


        public goBack(){

            this.$state.go("blog");

        }


      }

      angular.module('myApp').controller('myApp.BlogCtrl', BlogCtrl);
}



