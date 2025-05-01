# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/GovernmentProcurement.js
```




<!-- 
   const commonjsOptionsInclude = resolved.build.commonjsOptions.include;                                                               const commonjsPluginDisabled = Array.isArray(commonjsOptionsInclude) && commonjsOptionsInclude.length === 0;                         optimizeDeps.noDiscovery = true;                                                                                                     optimizeDeps.include = void 0;                                                                                                       if (commonjsPluginDisabled) {                                                                                                          resolved.build.commonjsOptions.include = void 0;                                                                                   }                                                                                                                                    resolved.logger.warn(                                                                                                                  colors$1.yellow(`(!) Experimental ${optimizeDepsPath}optimizeDeps.disabled and deps pre-bundling during build were removed in Vite 5.1.                                                                                                                               To disable the deps optimizer, set ${optimizeDepsPath}optimizeDeps.noDiscovery to true and ${optimizeDepsPath}optimizeDeps.include as undefined or empty.                                                                                                                 Please remove ${optimizeDepsPath}optimizeDeps.disabled from your config.                                                             ${commonjsPluginDisabled ? "Empty config.build.commonjsOptions.include will be ignored to support CJS during build. This config should also be removed." : ""}
  `)                                                                                                                                       );                                                                                                                                 } else if (optimizeDepsDisabled === false || optimizeDepsDisabled === "build") {                                                       resolved.logger.warn(                                                                                                                  colors$1.yellow(`(!) Experimental ${optimizeDepsPath}optimizeDeps.disabled and deps pre-bundling during build were removed in Vite 5.1.
    Setting it to ${optimizeDepsDisabled} now has no effect.
    Please remove ${optimizeDepsPath}optimizeDeps.disabled from your config.
  `)
      );
    }
  }
}
what is this  -->