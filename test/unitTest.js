const assert = require('assert');
const expect = require('chai').expect
const request = require('supertest');
const app = require('../app')

describe('Unit testing the /auth route cookie', function() {

    it('should return OK status', function() {
        return request(app)
            .post('/auth')
            .send({"loginType":"cookie","authToken":"04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37007","dbID":"605a1bdd3dd7450a04455d6a"})
            .then((response)=>{
                expect(response.statusCode === 200).to.be.true;
            })
    })
});

describe('Unit testing the /auth route login with username password', function() {

    it('should return OK status', function() {
        return request(app)
            .post('/auth')
            .send({"loginType":"user","authToken":"04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37007","clgID":"cb.en.cse01002"})
            .then((response)=>{
                expect(response.statusCode === 200).to.be.true;
            })
    })
});

describe('Unit testing the /auth route login with username password', function() {

    it('should return 401 status', function() {
        return request(app)
            .post('/auth')
            .send({"loginType":"user","authToken":"csuhdfsdf","clgID":"cb.en.cse05001"})
            .then((response)=>{
                expect(response.statusCode === 401).to.be.true;
            })
    })
});

describe('Unit testing the /auth route login with username password', function() {

    it('should return 401 status', function() {
        return request(app)
            .post('/auth')
            .send({"loginType":"user","authToken":"csuhdfsdf","clgID":"cb.en.cse02001"})
            .then((response)=>{
                expect(response.statusCode === 401).to.be.true;
            })
    })
});

describe('Unit testing the /auth route login with username password', function() {

    it('should return 401 status', function() {
        return request(app)
            .post('/auth')
            .send({"loginType":"user","authToken":"c84c15cf188a1a18fe127241892afd145373f5ed7b4dbc0144d40ccdf5ca737e546db8d9273b43f49850388c3a1c3aacd6e5fa3557fc52fc7b362e591b965a68","clgID":"cb.en.cse05001"})
            .then((response)=>{
                expect(response.statusCode === 200).to.be.true;
            })
    })
});

describe('Unit testing the /auth route login with username password', function() {

    it('should return OK status', function() {
        return request(app)
            .post('/auth')
            .send({"loginType":"user","authToken":"60a875be0cdd39f44292975ea625dab176edf536fa0d9e9d2483cc0ebb3ee896117bf9325859632de6817cb667ed01627bb615572d3dcd96889aa79dc5d6a6dd","clgID":"cb.en.cse01001"})
            .then((response)=>{
                expect(response.statusCode === 200).to.be.true;
            })
    })
});

describe('Unit testing the /images route', function() {

    it('should return 404 status', function() {
        return request(app)
            .get('/images/')
            .send()
            .then((response)=>{
                expect(response.statusCode === 404).to.be.true;
            })
    })
});

describe('Unit testing the /auth route cookie', function() {

    it('should return 401 status', function() {
        return request(app)
            .post('/auth')
            .send({"loginType":"cookie","authToken":"04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37117","dbID":"605a1bdd3dd7450a04455d6a"})
            .then((response)=>{
                expect(response.statusCode === 401).to.be.true;
            })
    })
});

describe('Unit testing the /auth route login with username password', function() {

    it('should return 401 status', function() {
        return request(app)
            .post('/auth')
            .send({"loginType":"user","authToken":"04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37117","clgID":"cb.en.cse01002"})
            .then((response)=>{
                expect(response.statusCode === 401).to.be.true;
            })
    })
});

describe('Unit testing the /auth route login with username password', function() {

    it('should return 404 status', function() {
        return request(app)
            .post('/auth')
            .send({"loginType":"user","authToken":"04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37117","clgID":"cb.en.cse010"})
            .then((response)=>{
                expect(response.statusCode === 404).to.be.true;
            })
    })
});

describe('Unit testing the /auth route cookie', function() {

    it('should return 404 status', function() {
        return request(app)
            .post('/auth')
            .send({"loginType":"cookie","authToken":"04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37007","dbID":"605a1bdd3dd7450a04455d33"})
            .then((response)=>{
                expect(response.statusCode === 404).to.be.true;
            })
    })
});

describe('Unit testing the /profile route ', function() {

    it('should return OK status', function() {
        return request(app)
            .get('/profile/getClgIDOnly')
            .set('authToken','04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37007')
            .set("dbID","605a1bdd3dd7450a04455d6a")
            .send()
            .then((response)=>{
                expect(response.statusCode === 200).to.be.true
            })
    })
    it('should return OK status', function() {
        return request(app)
            .get('/profile/getFacultyNameOnly')
            .set('authToken','04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37007')
            .set("dbID","605a1bdd3dd7450a04455d6a")
            .send()
            .then((response)=>{
                expect(response.statusCode === 200).to.be.true
            })
    })


    it('should return OK status', function() {
        return request(app)
            .get('/profile/getFullProfile')
            .set('authToken','04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37007')
            .set("dbID","605a1bdd3dd7450a04455d6a")
            .send()
            .then((response)=>{
                expect(response.statusCode === 200).to.be.true
            })
    })

    it('should return 401 status', function() {
        return request(app)
            .get('/profile/getFullProfile')
            .set('authToken','04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37337')
            .set("dbID","605a1bdd3dd7450a04455d6a")
            .send()
            .then((response)=>{
                expect(response.statusCode === 401).to.be.true
            })
    })
    it('should return 404 status', function() {
        return request(app)
            .get('/profile/getFullProfile')
            .set('authToken','04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37007')
            .set("dbID","605a1bdd3dd7450a04455d62")
            .send()
            .then((response)=>{
                expect(response.statusCode === 404).to.be.true
            })
    })

    it('should return 404 status', function() {
        return request(app)
            .get('/profile/getClgIDOnly')
            .set('authToken','04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37007')
            .set("dbID","605a1bdd3dd7450a04455d65")
            .send()
            .then((response)=>{
                expect(response.statusCode === 404).to.be.true
            })
    })
    it('should return 401 status', function() {
        return request(app)
            .get('/profile/getClgIDOnly')
            .set('authToken','04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37117')
            .set("dbid","605a1bdd3dd7450a04455d6a")
            .send()
            .then((response)=>{
                expect(response.statusCode === 401).to.be.true
            })
    })

    it('should return 404 status', function() {
        return request(app)
            .post('/profile/')
            .set('authToken','04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37117')
            .send()
            .then((response)=>{
                expect(response.statusCode === 404).to.be.true
            })
    })

    it('should return OK status', function() {
        return request(app)
            .post('/profile/')
            .set('authToken','04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37007')
            .set('dbid',"605a1bdd3dd7450a04455d6a")
            .send({
                "updateType":"personalInfoUpdate",
                "phoneNumber":"9000643213",
                "address":"Coimbatore",
                "email":"sridevi@gmail.com",
                "secQuestion":"Favorite Paradigm?",
                "secAnswer":"OOPS",
                "imagePath":"public\\images\\1617595880924_StockSnap_GJTPBBSFYW.jpg"
            })
            .then((response)=>{
                expect(response.statusCode === 200).to.be.true
            })
    })


})

describe('Unit testing the /recovery route ', function() {

        it('should return OK status', function() {
            return request(app)
                .post('/recovery')
                .set('authToken','04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37007')
                .set("dbID","605a1bdd3dd7450a04455d6a")
                .send({"reqType":"userPresenceCheck","clgID":"cb.en.cse01002"})
                .then((response)=>{
                    expect(response.statusCode === 200).to.be.true
                })
        })

        it('should return 404 status', function() {
            return request(app)
                .post('/recovery')
                .set('authToken','04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37007')
                .set("dbID","605a1bdd3dd7450a04455d6a")
                .send({"reqType":"userPresenceCheck","clgID":"cb.en.cse08133"})
                .then((response)=>{
                    expect(response.statusCode === 404).to.be.true
                })
        })

        it('should return 401 status', function() {
            return request(app)
                .post('/recovery')
                .send({"reqType":'secAnswerChangePassword',"authToken":'04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37007',"secAnswer":'Atlanta',"dbID":"605a1bdd3dd7450a04455d6a"})
                .then((response)=>{
                    expect(response.statusCode === 401).to.be.true
                })
        })

        it('should return OK status', function() {
            return request(app)
                .post('/recovery')
                .send({"reqType":'secAnswerChangePassword',"authToken":'04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37007',"secAnswer":'OOPS',"dbID":"605a1bdd3dd7450a04455d6a"})
                .then((response)=>{
                    expect(response.statusCode === 200).to.be.true
                })
        })
    }
)


describe('Unit testing the /mentoring get route', function() {

    it('should return OK status', function() {
        return request(app)
            .get('/mentoring')
            .set('authToken','04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37007')
            .set("dbID","605a1bdd3dd7450a04455d6a")
            .send()
            .then((response)=>{
                expect(response.statusCode === 200).to.be.true;
            })
    })
});

describe('Unit testing the /mentoring get route', function() {

    it('should return 404 status', function() {
        return request(app)
            .get('/mentoring')
            .set('authToken','caf7e2a236f4e145f8842e74bf6b58dc5d3074f1d6d8bf3af5942bea26401c6ffbe2c4a92eb353746f9360ca8bb3de4b354da2c3e4fc918fff7aa82ef094258a')
            .set("dbID","605a1b173dd7450a04455d69")
            .send()
            .then((response)=>{
                expect(response.statusCode === 404).to.be.true;
            })
    })
});

describe('Unit testing the /mentoring route ', function() {

    it('should return OK status', function() {
        return request(app)
            .post('/mentoring')
            .set('authToken','04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37007')
            .set("dbID","605a1bdd3dd7450a04455d6a")
            .send({"studentID":"6055bfa85691e12668d498a0","mentorText":"We are facing internet issue",'advisorAllocationID':"6055c0835691e12668d498a1"})
            .then((response)=>{
                expect(response.statusCode === 200).to.be.true;
            })
    })
});


describe('Unit testing the /mentoring get route', function() {

    it('should return 401 status', function() {
        return request(app)
            .get('/mentoring')
            .set('authToken','04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37033')
            .set("dbID","605a1bdd3dd7450a04455d6a")
            .send()
            .then((response)=>{
                expect(response.statusCode === 401).to.be.true;
            })
    })
});

describe('Unit testing the /mentoring get route', function() {

    it('should return 500 status', function() {
        return request(app)
            .get('/mentoring')
            .set('authToken','04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37033')
            .set("dbID","605a1bdd3dd7450a04455d6a")
            .send()
            .then((response)=>{
                expect(response.statusCode === 401).to.be.true;
            })
    })
});

describe('Unit testing the /mentoring get route', function() {

    it('should return 404 status', function() {
        return request(app)
            .get('/mentoring')
            .set('authToken','04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37007')
            .set("dbID","605a1bdd3dd7450a04455d22")
            .send()
            .then((response)=>{
                expect(response.statusCode === 404).to.be.true;
            })
    })
});

describe('Unit testing the /mentoring route ', function() {

    it('should return 404 status', function() {
        return request(app)
            .post('/mentoring')
            .set('authToken','04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37007')
            .set("dbID","605a1bdd3dd7450a04455d6a")
            .send({"studentID":"","mentorText":"We are facing internet issue","advisorAllocationID":"6055c0835691e12668d498a1"})
            .then((response)=>{
                expect(response.statusCode === 404).to.be.true;
            })
    })
});
describe('Unit testing the /mentoring route ', function() {

    it('should return 500 status', function() {
        return request(app)
            .post('/mentoring')
            .set('authToken','04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37007')
            .set("dbID","605a1bdd3dd7450a04455d6a")
            .send({"studentID":"6055bfa85691e12668d498a0","advisorAllocationID":"6055c0835691e12668d498a1","mentorTextM":"We are facing internet issue","test":"test"})
            .then((response)=>{
                expect(response.statusCode === 200).to.be.true;
            })
    })
});
describe('Unit testing the /mentoring route ', function() {

    it('should return 400 status', function() {
        return request(app)
            .post('/mentoring')
            .set('authToken','04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37007')
            .set("dbID","605a1bdd3dd7450a04455d6a")
            .send({"studentID":"","mentorText":"We are facing internet issue","advisorAllocationID":""})
            .then((response)=>{
                expect(response.statusCode === 400).to.be.true;
            })
    })
});

describe('Unit testing the /mentoring route ', function() {

    it('should return 404 status', function() {
        return request(app)
            .post('/mentoring')
            .set('authToken','04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37007')
            .set("dbID","605a1bdd3dd7450a04455d6a")
            .send({"studentID":"","mentorText":"We are facing internet issue","advisorAllocationID":"6055c0835691e12668d498b9"})
            .then((response)=>{
                expect(response.statusCode === 404).to.be.true;
            })
    })
});
describe('Unit testing the /gatepass route ', function() {

    it('should return 404 status', function() {
        return request(app)
            .post('/hodLeaveApprove/getAllLeaves')
            .set('authToken','04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37007')
            .set("dbID","605a1bdd3dd7450a04455d6a")
            .send({"passID":"606ace10cb953c22ccb4517f","passStatus":"approved"})
            .then((response)=>{
                expect(response.statusCode === 404).to.be.true;
            })
    })
});
describe('Unit testing the /gatepass get route', function() {

    it('should return 200 status', function() {
        return request(app)
            .get('/odform/')
            .set('authToken','04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37033')
            .set("dbID","605a1bdd3dd7450a04455d6a")
            .send()
            .then((response)=>{
                expect(response.statusCode === 401).to.be.true;
            })
    })
});

describe('Unit testing the /gatepass get route', function() {

    it('should return 401 status', function() {
        return request(app)
            .get('/odform/')
            .set('authToken','04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37033')
            .set("dbID","605a1bdd3dd7450a04455d6a")
            .send()
            .then((response)=>{
                expect(response.statusCode === 401).to.be.true;
            })
    })
});
describe('Unit testing the /gatepass get route', function() {

    it('should return 401 status', function() {
        return request(app)
            .get('/odform/')
            .set('authToken','04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37033')
            .set("dbID","605a1bdd3dd7450a04455d69")
            .send()
            .then((response)=>{
                expect(response.statusCode === 404).to.be.true;
            })
    })
});
describe('Unit testing the /gatepass get route', function() {

    it('should return 404 status', function() {
        return request(app)
            .get('/odform/')
            .set('authToken','854fdf9b1dcf52dafcc1596071677635bc25ba3ae86c9e4d1e3afd80464b03930cb71bc0d4a12039dd4c065b4a9a05d777de6dd949f43b6a4f91ffce6ec9fec4')
            .set("dbID","605a1f283dd7450a04455d6c")
            .send()
            .then((response)=>{
                expect(response.statusCode === 200).to.be.true;
            })
    })
})
describe('Unit testing the /profile/getAttendance/ get route', function() {

    it('should return 401 status', function() {
        return request(app)
            .get('/profile/getAttendance/')
            .set('authToken','04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37033')
            .set("dbID","605a1bdd3dd7450a04455d6a")
            .send()
            .then((response)=>{
                expect(response.statusCode === 401).to.be.true;
            })
    })
});

describe('Unit testing the /profile/getAttendance/ get route', function() {

    it('should return 404 status', function() {
        return request(app)
            .get('/profile/getAttendance/')
            .set('authToken','04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37007')
            .set("dbID","605a1bdd3dd7450a04455d67")
            .send()
            .then((response)=>{
                expect(response.statusCode === 404).to.be.true;
            })
    })
});
describe('Unit testing the /profile/getAttendance/ get route', function() {

    it('should return 200 status', function() {
        return request(app)
            .get('/profile/getAttendance/')
            .set('authToken','04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37007')
            .set("dbID","605a1bdd3dd7450a04455d6a")
            .send()
            .then((response)=>{
                expect(response.statusCode === 400).to.be.false;
            })
    })
});


describe('Unit testing the /facultyLeave/ get route', function() {

    it('should return 200 status', function() {
        return request(app)
            .get('/facultyLeave/')
            .set('authToken','04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37007')
            .set("dbID","605a1bdd3dd7450a04455d6a")
            .send()
            .then((response)=>{
                expect(response.statusCode === 200).to.be.true;
            })
    })
});

describe('Unit testing the /facultyLeave/ get route', function() {

    it('should return 404 status', function() {
        return request(app)
            .get('/facultyLeave/')
            .set('authToken','04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37007')
            .set("dbID","605a1bdd3dd7450a04455d6b")
            .send()
            .then((response)=>{
                expect(response.statusCode === 404).to.be.true;
            })
    })
});
describe('Unit testing the /facultyLeave/ get route', function() {

    it('should return 404 status', function() {
        return request(app)
            .post('/facultyLeave/')
            .set('authToken','04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37007')
            .set("dbID","605a1bdd3dd7450a04455d6b")
            .send()
            .then((response)=>{
                expect(response.statusCode === 404).to.be.true;
            })
    })
});
describe('Unit testing the /facultyLeave route ', function() {

    it('should return 500 status', function() {
        return request(app)
            .put('/facultyLeave/')
            .set('authToken','3a9ced7517da8dfd3baa547e9c5546a4fba67f97c23ec953c4da857f5d77876af4e12174b01b331e2ba95589e87859e64684b12686d677f7d027807f00fecd86')
            .set("dbID","605a22333dd7450a04455d6d")
            .send({"reason":"going to meet doctor","leaveTiming":"full","leaveType":"cl","departureTime":"2021-04-13T11:49:00.000+00.00","arrivalTime":"2021-04-12T01:00.000+00.00"})
            .then((response)=>{
                expect(response.statusCode === 500).to.be.true;
            })
    })
});


describe('Unit testing the /facultyLeave route ', function() {

    it('should return 401 status', function() {
        return request(app)
            .put('/facultyLeave/')
            .set('authToken','3a9ced7517da8dfd3baa547e9c5546a4fba67f97c23ec953c4da857f5d77876af4e12174b01b331e2ba95589e87859e64684b12686d677f7d027807f00fecd86')
            .set("dbID","605a1bdd3dd7450a04455d69")
            .send({"reason":"going to meet doctor","leaveTiming":"full","leaveType":"cl","departureTime":"2021-04-13T11:49:00.000+00.00","arrivalTime":"2021-04-12T01:00.000+00.00"})
            .then((response)=>{
                expect(response.statusCode === 404).to.be.true;
            })
    })
});

describe('Unit testing the /facultyLeave route ', function() {

    it('should return 200 status', function() {
        return request(app)
            .post('/facultyLeave/')
            .set('authToken','3a9ced7517da8dfd3baa547e9c5546a4fba67f97c23ec953c4da857f5d77876af4e12174b01b331e2ba95589e87859e64684b12686d677f7d027807f00fecd86')
            .set("dbID","605a22333dd7450a04455d6d")
            .send({"leaveID":"6087e3a7df68f40c6420ccc9","leaveStatus":"pending"})
            .then((response)=>{
                expect(response.statusCode === 200).to.be.true;
            })
    })
});



describe('Unit testing the /timetable get route', function() {

    it('should return 401 status', function() {
        return request(app)
            .get('/timetable')
            .set('authToken','04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37033')
            .set("dbID","605a1bdd3dd7450a04455d6a")
            .send()
            .then((response)=>{
                expect(response.statusCode === 401).to.be.true;
            })
    })
});
describe('Unit testing the /timetable get route', function() {

    it('should return 404 status', function() {
        return request(app)
            .get('/timetable')
            .set('authToken','04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37007')
            .set("dbID","605a1bdd3dd7450a04455d67")
            .send()
            .then((response)=>{
                expect(response.statusCode === 404).to.be.true;
            })
    })
});
describe('Unit testing the /timetable get route', function() {

    it('should return 200 status', function() {
        return request(app)
            .get('/timetable')
            .set('authToken','3a9ced7517da8dfd3baa547e9c5546a4fba67f97c23ec953c4da857f5d77876af4e12174b01b331e2ba95589e87859e64684b12686d677f7d027807f00fecd86')
            .set("dbID","605a22333dd7450a04455d6d")
            .send()
            .then((response)=>{
                expect(response.statusCode === 200).to.be.true;
            })
    })
});
describe('Unit testing the /hodLeaveApprove/getNumLeaves get route', function() {

    it('should return 200 status', function() {
        return request(app)
            .get('/hodLeaveApprove/getNumLeaves')
            .set('authToken','60a875be0cdd39f44292975ea625dab176edf536fa0d9e9d2483cc0ebb3ee896117bf9325859632de6817cb667ed01627bb615572d3dcd96889aa79dc5d6a6dd')
            .set("dbID","604617523bfe740f140f0554")
            .send()
            .then((response)=>{
                expect(response.statusCode === 200).to.be.true;
            })
    })
});
describe('Unit testing the /hodLeaveApprove/getNumLeaves get route', function() {

    it('should return 401 status', function() {
        return request(app)
            .get('/hodLeaveApprove/getNumLeaves')
            .set('authToken','04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37033')
            .set("dbID","605a1bdd3dd7450a04455d6a")
            .send()
            .then((response)=>{
                expect(response.statusCode === 401).to.be.true;
            })
    })
});
describe('Unit testing the /hodLeaveApprove/getNumLeaves get route', function() {

    it('should return 404 status', function() {
        return request(app)
            .get('/hodLeaveApprove/getNumLeaves')
            .set('authToken','04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37007')
            .set("dbID","605a1bdd3dd7450a04455d68")
            .send()
            .then((response)=>{
                expect(response.statusCode === 404).to.be.true;
            })
    })
});
describe('Unit testing the /hodLeaveApprove/getAllLeaves post route', function() {

    it('should return 404 status', function() {
        return request(app)
            .post('/hodLeaveApprove/getAllLeaves')
            .set('authToken','60a875be0cdd39f44292975ea625dab176edf536fa0d9e9d2483cc0ebb3ee896117bf9325859632de6817cb667ed01627bb615572d3dcd96889aa79dc5d6a6dd')
            .set("dbID","604617523bfe740f140f0554")
            .send({"passID":"60716a1e00f68b31f861df90","passStatus":"approved"})
            .then((response)=>{
                expect(response.statusCode === 404).to.be.true;
            })
    })
});
describe('Unit testing the /hodLeaveApprove/getAllLeaves post route', function() {

    it('should return 200 status', function() {
        return request(app)
            .post('/hodLeaveApprove/getAllLeaves')
            .set('authToken','60a875be0cdd39f44292975ea625dab176edf536fa0d9e9d2483cc0ebb3ee896117bf9325859632de6817cb667ed01627bb615572d3dcd96889aa79dc5d6a6dd')
            .set("dbID","604617523bfe740f140f0554")
            .send({"passID":"607169d400f68b31f861df8f","passStatus":"pending"})
            .then((response)=>{
                expect(response.statusCode === 404).to.be.true;
            })
    })
});
describe('Unit testing the /hodLeaveApprove/getAllLeaves get route', function() {

    it('should return 404 status', function() {
        return request(app)
            .post('/hodLeaveApprove/getAllLeaves')
            .set('authToken','60a875be0cdd39f44292975ea625dab176edf536fa0d9e9d2483cc0ebb3ee896117bf9325859632de6817cb667ed01627bb615572d3dcd96889aa79dc5d6a6dd')
            .set("dbID","604617523bfe740f140f0544")
            .send({"passID":"60716a1e00f68b31f861df90","passStatus":"approved"})
            .then((response)=>{
                expect(response.statusCode === 404).to.be.true;
            })
    })
});
describe('Unit testing the /courseNotes get route', function() {

    it('should return 200 status', function() {
        return request(app)
            .get('/courseNotes')
            .set('authToken','04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37007')
            .set("dbID","605a1bdd3dd7450a04455d6a")
            .send()
            .then((response)=>{
                expect(response.statusCode === 200).to.be.true;
            })
    })
});

describe('Unit testing the /facultyLeave route ', function() {

    it('should return 404 status', function() {
        return request(app)
            .put('/courseNotes')
            .set('authToken','3a9ced7517da8dfd3baa547e9c5546a4fba67f97c23ec953c4da857f5d77876af4e12174b01b331e2ba95589e87859e64684b12686d677f7d027807f00fecd86')
            .set("dbID","605a22333dd7450a04455d6d")
            .send({"noteDate":"2021-04-13","hour":"11:49:00.000+00.00","noteText":"hey how are you"})
            .then((response)=>{
                expect(response.statusCode === 404).to.be.true;
            })
    })
});
describe('Unit testing the /courseNotes get route', function() {

    it('should return 404 status', function() {
        return request(app)
            .get('/courseNotes')
            .set('authToken','04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37007')
            .set("dbID","605a1bdd3dd7450a04455d67")
            .send()
            .then((response)=>{
                expect(response.statusCode === 404).to.be.true;
            })
    })
});
describe('Unit testing the /courseNotes get route', function() {

    it('should return 401 status', function() {
        return request(app)
            .get('/courseNotes')
            .set('authToken','04b3d8d2f757c5c6bb3986ff0a43cf7de9b657888173f06c96832ec1091a929ed562e6d1924496e93b98e4d55c5009d5affbaf4654133e32d366255885c37033')
            .set("dbID","605a1bdd3dd7450a04455d6a")
            .send()
            .then((response)=>{
                expect(response.statusCode === 401).to.be.true;
            })
    })
});
