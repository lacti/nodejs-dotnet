import type { AWS } from "@serverless/typescript";

const config: AWS = {
  service: "nodejs-dotnet-launcher",
  frameworkVersion: "2",
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    lambdaHashingVersion: "20201221",
    region: "ap-northeast-2",
    environment: {
      DOTNET_SYSTEM_GLOBALIZATION_INVARIANT: "1",
    },
  },
  custom: {
    scripts: {
      hooks: {
        "webpack:package:packageModules":
          "cp dotnet-bridge.tar.gz exodus-ps-bundle.tgz .webpack/service",
      },
    },
  },
  functions: {
    runBridge: {
      handler: "src/handler.runBridge",
      timeout: 29,
      events: [
        {
          httpApi: {
            path: "/runBridge",
            method: "get",
          },
        },
      ],
    },
  },
  plugins: ["serverless-plugin-scripts", "serverless-webpack"],
};

export = config;
