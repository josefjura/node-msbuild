/// <reference path="../typings/tsd.d.ts" />

import childProcess = require('child_process');
import Q = require('q');

export class MsBuild {
    private options: MSBuildOptions;

    constructor(options?: MSBuildOptions) {
        this.options = options;
    }

    build(options?: BuildOptions): Q.Promise<BuildResult> {
        var q = Q.defer<BuildResult>();
        var cl = this.getCommandLine(options);

        let opts = { stdio: 'inherit' }
        if (options.Silent)
            opts.stdio = 'ignore';

        var build = childProcess.spawn(cl.File, cl.Params, opts);

        build.on('exit', (code) => {
            q.resolve({
                Code: code,
                CmdLine: this.compose(options)
            });
        });

        return q.promise;
    }


    compose(options?: BuildOptions): string {
        var cl = this.getCommandLine(options);

        return cl.File + " " + cl.Params.join(' ');
    }

    private getCommandLine(options?: BuildOptions): CommandLineResult {
        let commandText = "";
        let target = this.getTarget(options);

        let parameters = [options.SolutionFile, target];

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

        if (options.DeployOnBuild) {
            parameters.push('/p:DeployOnBuild=' + options.DeployOnBuild);
        }

        if (options.PublishProfile) {
            parameters.push('/p:PublishProfile=' + options.PublishProfile);
        }

        return {
            File: this.options.MsBuildPath,
            Params: parameters
        }
    }

    private getTarget(options: BuildOptions): string {


        if (options.Target) {
            let target = "/t:" + options.Target;
            if (options.Rebuild) {
                target += ":Rebuild";
            }
            return target;
        } else {
            if (options.Rebuild) {
                return "/t:Rebuild";
            }
        }
    }
}

interface CommandLineResult {
    File: string;
    Params: string[];
}

export interface BuildResult {
    Code: number;
    CmdLine: string;
}

export interface MSBuildOptions {
    MsBuildPath?: string;
}

export interface BuildOptions {
    Target?: string;
    Rebuild?: boolean;
    Silent?: boolean;
    ErrorsOnly?: boolean;
    SolutionFile: string;
    Configuration?: string;
    Platform?: string;
    BuildProjectReferences?: boolean;
    ShowLogo?: boolean;
    DeployOnBuild?: boolean;
    PublishProfile?: string;
}
