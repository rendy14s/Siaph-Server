'use strict';

module.exports = function (Siaphdocuments) {
    let request = require('request');
    let app = require('../../server/server');
   

    /**
     * Find Data Documents Filter FromDoc & toDoc
     */
    Siaphdocuments.remoteMethod(
        'getDataDocument', {
            accepts: [{
                arg: 'params',
                type: 'Object',
                required: true,
                http: { source: 'body' }
            }, {
                arg: "options",
                type: "object",
                http: "optionsFromRequest"
            }],
            returns: {
                arg: 'getDataDocument', type: 'array', root: true
            },
            http: {
                path: '/getDataDocument',
                verb: 'post'
            }
        });

    Siaphdocuments.getDataDocument = function (params, options, cb) {
        // console.log(params, 'Params Find');
        if (params !== null && params !== undefined) {
            Siaphdocuments.find({
                where: {
                    or: [
                        { fromDoc: params.fromDoc },
                        { toDoc: params.toDoc }
                    ]
                }
            }, function (err, dataGet) {

                console.log('Data', dataGet);
                if (err) {
                    cb(err);
                    console.log(err, 'Errornya');
                } else {
                    cb(null, dataGet);
                }
            });
        } else {
            console.log('Data Params Kosong');
        }
    }


    /**
     * Notifikasi Success Create Disposisi Letter
     */
    Siaphdocuments.afterRemote('create', function (ctx, modelInstance, next) {
        console.log('Proses', ctx.result);
        let Siaphdepthrole = app.models.SiaphDepthrole;
        let from = ctx.result.fromDoc;
        let to =  ctx.result.toDoc;
        console.log(to, 'TO 1');
        console.log(from, 'From')

        Siaphdepthrole.findById(from, function (err, result) {
            console.log(result, 'Data Deptrole');
            
            let nameFrom = result.nameRole;
            console.log(to, 'TO 2');
            let data = {
                toDoc: to
            }

            let dataFilter = [];
            dataFilter.push({
                'field': 'tag',
                'key': 'userid',
                'relation': '=',
                'value': result.id
            });
            let content = nameFrom + ',' + ' Created New Disposisi For You ';
            sendMessage(dataFilter, content, data);
            console.log(content, 'Content');
        });

        next();
    });

    var sendMessage = function (device, message, data) {

        var restKey = 'ODg1NzFjMGMtYmMxYS00NDVhLWFhMDUtMzA5Y2RjZWQ4NmJh';
        var appID = 'dba6c690-57d4-43e6-b894-7da32a5d9357';
        request(
            {
                method: 'POST',
                uri: 'https://onesignal.com/api/v1/notifications',
                headers: {
                    'authorization': 'Basic ' + restKey,
                    'content-type': 'application/json'
                },
                json: true,
                body: {
                    'app_id': appID,
                    'filters': device,
                    'data': data,
                    'contents': { en: message }
                }
            },
            function (error, response, body) {
                try {
                    if (!body.errors) {
                        console.log(body);
                    } else {
                        console.error('Error:', body.errors);
                    }
                } catch (err) {
                    console.log(err);
                }

            }
        )
    }
};
