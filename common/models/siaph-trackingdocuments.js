'use strict';

module.exports = function (Siaphtrackingdocuments) {
    let request = require('request');
    let app = require('../../server/server');

    Siaphtrackingdocuments.afterRemote('create', function (ctx, modelInstance, next) {
        console.log(ctx.result, 'CTX');
        console.log(ctx.result.statusDisposisi, 'Status');
        let from = ctx.result.fromDoc;
        let to = ctx.result.toDoc;
        let docId = ctx.result.idDoc;

        if (ctx.result.statusDisposisi == 'Open') {
            let Siaphdepthrole = app.models.SiaphDepthrole;

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
                    'relation': '!=',
                    'value': result.id
                });
                let content = nameFrom + ' ' + 'Moved Document Disposisi For You ';
                sendMessage(dataFilter, content, data);
                console.log(content, 'Content');
            });
        }
        // } else if (ctx.result.statusDisposisi == 'Closed') {
        //     let Siaphdepthrole = app.models.SiaphDepthrole;

        //     console.log(docId, 'idDocnya')
        //     Siaphtrackingdocuments.find({
        //         where:
        //             { idDoc: docId }
        //     }, function (err, dataGet) {
        //         console.log('Data Doc', dataGet);
        //         console.log('Error', err);

        //          Siaphdepthrole.findById(from, function (err, result) {
        //             console.log(result, 'Data Deptrole');

        //             let nameFrom = result.nameRole;
        //             console.log(to, 'TO 2');
        //             let data = {
        //                 toDoc: to
        //             }

        //             let dataFilter = [];
        //             dataFilter.push({
        //                 'field': 'tag',
        //                 'key': 'userid',
        //                 'relation': '!=',
        //                 'value': result.id
        //             });
        //             let content = nameFrom + ' ' + 'Has Been Fully Approved Document';
        //             sendMessage(dataFilter, content, data);
        //             console.log(content, 'Content');
        //         });

        //     });
        // }

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
