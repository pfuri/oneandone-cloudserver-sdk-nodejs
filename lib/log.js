/**
 * Created by Ali on 8/16/2016.
 */
module.exports = {
    logEndPointPath: "logs",

    listLogsFixedPeriodWithOptions: function (period, options, callback) {
        var path = this.logEndPointPath + "?period=" + period;
        if (options) {
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

    listLogsCustomPeriodWithOptions: function (startDate, endDate, options, callback) {
        var path = this.logEndPointPath + "?period=CUSTOM";
        path += "&start_date=" + startDate + "&end_date=" + endDate;

        if (options) {
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

    getLog: function (log_id, callback) {
        req.is_get([this.logEndPointPath, log_id], callback)
    },
};
