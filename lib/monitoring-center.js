/**
 * Created by Ali on 8/13/2016.
 */
module.exports = {
    mcEndPointPath: "monitoring_center",

    listMonitoringCenters: function (callback) {
        req.is_get([this.mcEndPointPath], callback)
    },

    listMonitoringCentersWithOption: function (options, callback) {
        var path = this.mcEndPointPath;
        if (options) {
            path += "?";
            if (options.page) {
                path += "&page=" + options.page;
            }
            if (options.perPage) {
                path += "&per_page=" + options.perPage;
            }
            if (options.sort) {
                path += "&sort=" + options.sort;
            }
            if (options.query) {
                path += "&q=" + options.query;
            }
            if (options.fields) {
                path += "&fields=" + options.fields;
            }
        }

        req.is_get([path], callback)
    },

    getServerMonitoringCenterFixedPeriod: function (srv_id, period, callback) {
        var path = "?period=" + period;
        req.is_get([this.mcEndPointPath, srv_id, path], callback)
    },

    getServerMonitoringCenterCustomPeriod: function (srv_id, startDate, endDate, callback) {
        var path = "?period=CUSTOM";
        path += "&start_date=" + startDate + "&end_date=" + endDate;
        req.is_get([this.mcEndPointPath, srv_id, path], callback)
    },
};