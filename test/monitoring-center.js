/**
 * Created by Ali on 8/13/2016.
 */
var assert = require('assert');
var oneandone = require('../lib/liboneandone');
var helper = require('../test/testHelper');
var server = {};

describe('Monitoring center tests', function () {
    this.timeout(900000);

    before(function (done) {
        helper.authenticate(oneandone);
        helper.getRandomServerWithMonitoringPolicy(function (result) {
            if (result) {
                server = result;
                helper.checkServerReady(server, function () {
                    done();
                });
            }
        })
    });

    it('List Monitoring Centers', function (done) {
        oneandone.listMonitoringCenters(function (error, response, body) {
            helper.assertNoError(200, response, function (result) {
                assert(result);
            });
            assert.notEqual(response, null);
            assert.notEqual(body, null);
            var object = JSON.parse(body);
            assert(object.length > 0);
            done();
        });
    });

    it('List Monitoring Centers with options', function (done) {
        var options = {
            page: 1,
            perPage: 1
        };
        oneandone.listMonitoringCentersWithOption(options, function (error, response, body) {
            helper.assertNoError(200, response, function (result) {
                assert(result);
            });
            assert.notEqual(response, null);
            assert.notEqual(body, null);
            var object = JSON.parse(body);
            assert(object.length > 0);
            done();
        });
    });

    it('Get CustomPeriod', function (done) {
        var start_date = "2016-19-05T00:05:00Z";
        var end_date = "2016-19-07T00:05:00Z";
        oneandone.getServerMonitoringCenterCustomPeriod(server.id, start_date, end_date, function (error, response, body) {
            helper.assertNoError(200, response, function (result) {
                assert(result);
            });
            assert.notEqual(response, null);
            assert.notEqual(body, null);
            done();
        });
    });

    it('Get FixedPeriod', function (done) {
        oneandone.getServerMonitoringCenterFixedPeriod(server.id, oneandone.PeriodType.LAST_24H, function (error, response, body) {
            helper.assertNoError(200, response, function (result) {
                assert(result);
            });
            assert.notEqual(response, null);
            assert.notEqual(body, null);
            done();
        });
    });
});