# node-msbuild [![npm version](https://badge.fury.io/js/node-msbuild.svg)](https://badge.fury.io/js/node-msbuild)
Node Module for calling MSBuild

```js
    var msbuild = require('node-msbuild');

    // Initialize builder
    this.builder = new msbuild.MsBuild({
        MsBuildPath: "c:\\Program Files (x86)\\MSBuild\\14.0\\Bin\\msbuild.exe"
    });

    // Build options
    var options = {
        Rebuild: false,

SolutionFile: "MySolution.sln",
        // ... etc
    };

    //Run builds
    builder.build(options)
    .then(function(results){
        console.log("Called params : " + results.CmdLine);
        console.log("Result code: " + results.Code);

});
```

## Build options

### SolutionFile
**Required**

Type: *string*

Full path to the the solution file.

### Target
Type: *string*

Build target. If empty, whole solution will be built.

### Rebuild
Type: *boolean*

Rebuild solution.

### Silent
Type: *boolean*

Determines if the build process output should be piped into stdio.

### ErrorsOnly
Type: *boolean*

Determines if only error output should be visible.

### Configuration
Type: *string*

Build configuration that should be used

### Platform
Type: *string*

Selected build platform

### BuildProjectReferences
Type: *boolean*

Determines if project references will also be built

### ShowLogo
Type: *boolean*

Determines if the MS Build logo will be shown before build

### DeployOnBuild
Type: *boolean*

Determines if there should be a deploy after the build

### PublishProfile
Type: *string*

Publish profile name used when deploying
