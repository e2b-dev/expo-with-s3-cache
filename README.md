# E2B Expo Template with S3 cache sync

This is a template for building Expo apps with E2B and S3 build cache sync.

## Usage

> [!TIP]
> Full example code can be found in the [`example.ts`](example.ts) file in the root of the project.

Clone the repository and run the following commands to build the template and create a new sandbox:

1. Install dependencies

    ```bash
    bun install
    ```

2. Build the template

    ```bash
    bun build.ts
    ```

3. Create .env file with the following variables

    ```
    AWS_ACCESS_KEY_ID=""
    AWS_SECRET_ACCESS_KEY=""
    AWS_REGION=""
    AWS_ENDPOINT_URL=""
    AWS_BUCKET=""
    ```

    You can see all the variables supported by the script in the [`example.ts`](example.ts) file.

    > **Note**: By default, the Sandboxes are located in the `us-west1` GCP region. Consider placing your cache bucket in the same region or close by to avoid increased latency.

3. Create a new sandbox

    ```ts
    const sandbox = await Sandbox.create("expo-app");
    ```

4. Pull the caches, run "expo export", and push the resulting caches back to S3:

    ```ts
    const {
      AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY,
      AWS_REGION,
      AWS_ENDPOINT_URL,
      AWS_BUCKET,
    } = process.env;

    const result = await sandbox.commands.run(
      "scripts/cache-download.sh && npx expo export && scripts/cache-upload.sh",
      {
        envs: {
          AWS_ACCESS_KEY_ID,
          AWS_SECRET_ACCESS_KEY,
          AWS_REGION,
          AWS_ENDPOINT_URL,
          AWS_BUCKET,
        },
      }
    );
    ```

    > **Note**: The logs for cache downloads and uploads will be available under `/tmp/e2b-metro-cache-logs`.

5. When running the development server, you can use the following command to pull caches and run "expo start":

    ```ts
    const result = await sandbox.commands.run(
      "scripts/cache-download.sh && npx expo start && scripts/cache-upload.sh",
      {
        envs: {
          AWS_ACCESS_KEY_ID,
          AWS_SECRET_ACCESS_KEY,
          AWS_REGION,
          AWS_ENDPOINT_URL,
          AWS_BUCKET,
        },
      }
    );
    ```

    > **Note**: Updated caches will only be uploaded once the development server process **exited**.

    > **Note**: Consider using a different cache file for the development server to avoid conflicts with the build cache. You can do so by setting the `CACHE_FILENAME` environment variable to a different value.

## Stats

No caches:

```
iOS Bundled 35016ms node_modules/expo-router/entry.js (1303 modules)
Android Bundled 38713ms node_modules/expo-router/entry.js (1324 modules)
Static rendering is enabled. Learn more: https://docs.expo.dev/router/reference/static-rendering/
λ Bundled 27228ms node_modules/expo-router/node/render.js (1089 modules)
Web Bundled 27944ms node_modules/expo-router/entry.js (1073 modules)
```

With caches:

```
Android Bundled 7683ms node_modules/expo-router/entry.js (1296 modules)
iOS Bundled 11691ms node_modules/expo-router/entry.js (1311 modules)
Static rendering is enabled. Learn more: https://docs.expo.dev/router/reference/static-rendering/
λ Bundled 1088ms node_modules/expo-router/node/render.js (935 modules)
Web Bundled 1450ms node_modules/expo-router/entry.js (1059 modules)
```

| Target | Not Cached (ms) | Cached (ms) | Δ Saved (ms) | Improvement |
|---|---:|---:|---:|---:|
| iOS | 35,016 | 11,691 | 23,325 ms | 66.6% faster |
| Android | 38,713 | 7,683 | 31,030 ms | 80.1% faster |
| SSR (λ) | 27,228 | 1,088 | 26,140 ms | 96.0% faster |
| Web | 27,944 | 1,450 | 26,494 ms | 94.8% faster |
