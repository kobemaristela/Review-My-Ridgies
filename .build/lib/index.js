import { createRequire as topLevelCreateRequire } from 'module'
const require = topLevelCreateRequire(import.meta.url)
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// stacks/ApiStack.js
import { Api, use } from "@serverless-stack/resources";

// stacks/StorageStack.js
import { Bucket, Table } from "@serverless-stack/resources";
function StorageStack({ stack }) {
  const bucket = new Bucket(stack, "Photos");
  const profiles = new Table(stack, "Profiles", {
    fields: {
      profileId: "string",
      role: "string",
      photo: "string",
      likes: "number"
    },
    primaryIndex: { partitionKey: "profileId" }
  });
  const reviews = new Table(stack, "Reviews", {
    fields: {
      profileId: "string",
      reviewId: "string",
      body: "string"
    },
    primaryIndex: { partitionKey: "reviewId" }
  });
  return {
    profiles,
    reviews,
    bucket
  };
}
__name(StorageStack, "StorageStack");

// stacks/ApiStack.js
function ApiStack({ stack, app }) {
  const { profiles, reviews } = use(StorageStack);
  const profilesApi = new Api(stack, "ProfilesApi", {
    defaults: {
      function: {
        permissions: [profiles],
        environment: {
          PROFILES_NAME: profiles.tableName
        }
      }
    },
    routes: {
      "POST /profiles": "backend/profiles/functions/create.main"
    }
  });
  const reviewsApi = new Api(stack, "ReviewsApi", {
    defaults: {
      function: {
        permissions: [reviews],
        environment: {
          REVIEWS_NAME: reviews.tableName
        }
      }
    },
    routes: {
      "POST /reviews": "backend/reviews/functions/create.main"
    }
  });
  stack.addOutputs({
    ProfilesApiEndpoint: profilesApi.url
  });
  return {
    profilesApi
  };
}
__name(ApiStack, "ApiStack");

// stacks/index.js
function main(app) {
  app.setDefaultFunctionProps({
    runtime: "nodejs16.x",
    srcPath: "backend",
    bundle: {
      format: "esm"
    }
  });
  app.stack(StorageStack).stack(ApiStack);
}
__name(main, "main");
export {
  main as default
};
//# sourceMappingURL=index.js.map