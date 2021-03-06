/**
 * Created by Ali on 8/1/2016.
 */
var assert = require('assert');
var oneandone = require('../lib/liboneandone');
var helper = require('../test/testHelper');
var server = {};
var currentIp = {};
var firewallPolicy = {};
var loadBalancer = {};
var appliance = {};
var dataCenter = {};

describe('Server Network tests', function () {
    this.timeout(900000);

    before(function (done) {
        helper.authenticate(oneandone);
        var options = {
            query: "ubuntu"
        };
        oneandone.listServerAppliancesWithOptions(options, function (error, response, body) {
            var res = JSON.parse(body);
            for (var i=0;i<res.length;i++){
                if(res[i].type=="IMAGE"){
                    appliance = res[i];
                    break;
                }
            }
            var options = {
                query: "us"
            };
            oneandone.listDatacentersWithOptions(options, function (error, response, body) {
                var res1 = JSON.parse(body);
                dataCenter = res1[0];
                var serverData = {
                    "name": "Node Server network test",
                    "description": "description",
                    "hardware": {
                        "vcore": 2,
                        "cores_per_processor": 1,
                        "ram": 2,
                        "hdds": [
                            {
                                "size": 40,
                                "is_main": true
                            },
                            {
                                "size": 20,
                                "is_main": false
                            }
                        ]
                    },
                    "appliance_id": appliance.id,
                    "datacenter_id": dataCenter.id
                };
                oneandone.createServer(serverData, function (error, response, body) {
                    helper.assertNoError(202, response, function (result) {
                        assert(result);
                    });
                    server = JSON.parse(body);
                    assert.notEqual(response, null);
                    assert.notEqual(body, null);
                    assert.equal(server.name, serverData.name)
                    done();
                });
            });
        });
    });

    removeServer = function (serverToRemove, callback) {
        if (serverToRemove.id) {
            helper.checkServerReady(serverToRemove, function () {
                oneandone.deleteServer(serverToRemove.id, false, function (error, response, body) {
                    helper.assertNoError(202, response, function (result) {
                        assert(result);
                    });
                    callback();
                });
            });
        }
        else {
            callback();
        }
    };

    removeIp = function (serverToRemove, ip_id, callback) {
        if (serverToRemove.id && ip_id) {
            helper.checkServerReady(serverToRemove, function () {
                var keepip = {
                    "keep_ip": false
                };
                oneandone.deleteIp(serverToRemove.id, ip_id, keepip, function (error, response, body) {
                    helper.assertNoError(202, response, function (result) {
                        assert(result);
                    });
                    callback();
                });
            });
        }
        else {
            callback();
        }
    };
    after(function (done) {
        removeServer(server, function () {
            done();
        });
    });

    it('Add Ip to the server', function (done) {
        ipData = {
            "type": "IPV4"
        };
        helper.checkServerReady(server, function () {
            oneandone.addIp(server.id, ipData, function (error, response, body) {
                helper.assertNoError(201, response, function (result) {
                    assert(result);
                });
                var result = JSON.parse(body);
                helper.checkServerReady(server, function () {
                    assert.notEqual(response, null);
                    assert.notEqual(body, null);
                    assert.notEqual(result, null);
                    done();
                });
            });
        });
    });

    it('List servers Ips', function (done) {
        oneandone.listIps(server.id, function (error, response, body) {
            helper.assertNoError(200, response, function (result) {
                assert(result);
            });
            assert.notEqual(response, null);
            assert.notEqual(body, null);
            var object = JSON.parse(body);
            currentIp = object[0];
            assert(object.length > 0);
            done();
        });
    });

    it('Get servers Ip', function (done) {
        oneandone.getIp(server.id, currentIp.id, function (error, response, body) {
            helper.assertNoError(200, response, function (result) {
                assert(result);
            });
            assert.notEqual(response, null);
            assert.notEqual(body, null);
            var object = JSON.parse(body);
            assert.equal(object.id, currentIp.id);
            done();
        });
    });

    it('Add Firewall Policy to an IP', function (done) {
        helper.checkServerReady(server, function () {
            oneandone.listFirewallPolicies(function (fpError, fpResponse, fpBody) {
                var object = JSON.parse(fpBody);
                firewallPolicyData = {
                    "id": object[0].id
                };
                oneandone.addFirewallPolicy(server.id, currentIp.id, firewallPolicyData, function (error, response, body) {
                    helper.checkServerReady(server, function () {
                        helper.assertNoError(202, response, function (result) {
                            assert(result);
                        });
                        assert.notEqual(body, null);
                        done();
                    });
                });
            });

        });
    });

    it('List ip FirewallPolicies', function (done) {
        helper.checkServerReady(server, function () {
            oneandone.listIpFirewallPolicies(server.id, currentIp.id, function (error, response, body) {
                helper.assertNoError(200, response, function (result) {
                    assert(result);
                });
                assert.notEqual(body, null);
                var object = JSON.parse(body);
                if (Array.isArray(object)) {
                    assert(object.length > 0);
                    firewallPolicy = object[0];
                } else {
                    firewallPolicy = object;
                }
                done();
            });
        });
    });

    it('Add LoadBalancer to an IP', function (done) {
        oneandone.listLoadBalancers(function (lbError, lbResponse, lbBody) {
            var loadBalancerId = JSON.parse(lbBody);
            loadBalancerData = {
                "load_balancer_id": loadBalancerId[0].id
            };
            helper.checkServerReady(server, function () {
                oneandone.addIpLoadBalancer(server.id, currentIp.id, loadBalancerData, function (error, response, body) {
                    helper.assertNoError(202, response, function (result) {
                        assert(result);
                    });
                    assert.notEqual(body, null);
                    done();
                });
            });
        });

    });

    it('List ip Load Balancers', function (done) {
        helper.checkServerReady(server, function () {
            oneandone.listIpLoadBalancer(server.id, currentIp.id, function (error, response, body) {
                helper.assertNoError(200, response, function (result) {
                    assert(result);
                });
                assert.notEqual(body, null);
                var object = JSON.parse(body);
                assert(object.length > 0);
                loadBalancer = object[0];
                done();
            });
        });
    });

    it('Remove Load Balancers from  an IP', function (done) {
        helper.checkServerReady(server, function () {
            oneandone.deleteIpLoadBalancer(server.id, currentIp.id, loadBalancer.id, function (error, response, body) {
                helper.assertNoError(202, response, function (result) {
                    assert(result);
                });
                assert.notEqual(response, null);
                assert.notEqual(body, null);
                done();
            });
        });
    });
});
