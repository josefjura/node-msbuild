/// <reference path="../typings/tsd.d.ts" />
var childProcess = require('child_process');
var Q = require('q');
var MsBuild = (function () {
    function MsBuild(options) {
        this.options = options;
    }
    MsBuild.prototype.build = function (options) {
        var _this = this;
        var q = Q.defer();
        var cl = this.getCommandLine(options);
        var opts = { stdio: 'inherit' };
        if (options.Silent)
            opts.stdio = 'ignore';
        var build = childProcess.spawn(cl.File, cl.Params, opts);
        build.on('exit', function (code) {
            q.resolve({
                Code: code,
                CmdLine: _this.compose(options)
            });
        });
        return q.promise;
    };
    MsBuild.prototype.compose = function (options) {
        var cl = this.getCommandLine(options);
        return cl.File + " " + cl.Params.join(' ');
    };
    MsBuild.prototype.getCommandLine = function (options) {
        var commandText = "";
        var target = this.getTarget(options);
        var parameters = [options.SolutionFile, target];
        parameters.push('/p:BuildProjectReferences=' + options.BuildProjectReferences);
        if (!options.ShowLogo) {
            parameters.push('/nologo');
        }
        if (!options.Configuration) {
            options.Configuration = 'Debug';
        }
        parameters.push("/p:Configuration=" + options.Configuration);
        if (options.Platform) {
            parameters.push('/p:Platform=' + options.Platform);
        }
        if (options.ErrorsOnly)
            parameters.push('/clp:ErrorsOnly');
        return {
            File: this.options.MsBuildPath,
            Params: parameters
        };
    };
    MsBuild.prototype.getTarget = function (options) {
        if (options.Target) {
            var target = "/t:" + options.Target;
            if (options.Rebuild) {
                target += ":Rebuild";
            }
            return target;
        }
        else {
            if (options.Rebuild) {
                return "/t:Rebuild";
            }
        }
    };
    return MsBuild;
})();
exports.MsBuild = MsBuild;
