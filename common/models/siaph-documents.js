'use strict';

module.exports = function (Siaphdocuments) {
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
                arg: 'getDataDocument', type: 'array',
            },
            http: {
                path: '/getDataDocument',
                verb: 'post'
            }
        });

    Siaphdocuments.getDataDocument = function (params, options, cb) {
        console.log(params, 'Params Find');
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
};
