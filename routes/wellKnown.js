'use strict';
var express = require('express');
var router = express.Router();

const knownDomainConfigurations = {
    "krillincr.com": 'https://manage.microsoft.com/EnrollmentServer/PostReportDeviceInfoForUEV2?aadTenantId=c92ec5da-f7ac-4033-a121-8ea0e5c36bc5'
}

const knownUserNameOverrides = {
    // Causes an error in the XSU by not providing aadTenantId/intuneAccountId
}

// Return the Intune XSU endpoint to begin UEv2
// The user-identifier query param is provided by iOS and will be the 
// email address that the user enters in Settings to start the enrollment process
// We will return different endpoints based on the domain in the email
// See knownDomainConfigurations for a list of valid domains
router.get('/com.apple.remotemanagement', function (req, res) {
    var email = req.query['user-identifier'];

    var domain = 'uetestapps.com';
    var userName = '';
    if (email && email.includes('@')) {
        userName = email.substring(0, email.indexOf('@')).toLowerCase();
        domain = email.substring(email.indexOf('@') + 1).toLowerCase();
    }

    var url = knownDomainConfigurations[domain];

    if (knownUserNameOverrides[userName]) {
        url = knownUserNameOverrides[userName];
    }

    res.json({
        'Servers': [
            {
                'Version': 'mdm-byod',
                'BaseURL': url
            }
        ]
    });
});

module.exports = router;
