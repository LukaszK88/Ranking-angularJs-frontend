
module myApp {

    'use strict';

    PostTypeResource.$inject = [
        '$resource',
        'config'
    ];

    function PostTypeResource(
        $resource:any,
        config:any
    ){

        return $resource(
            config.API + 'types',
            {   },
            {

            });
    }

    angular.module('myApp')
        .factory('PostTypeResource', PostTypeResource);

}
