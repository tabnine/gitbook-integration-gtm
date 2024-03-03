import {
  createIntegration,
  FetchPublishScriptEventCallback,
  RuntimeContext,
  RuntimeEnvironment
} from '@gitbook/runtime';

// eslint-disable-next-line import/extensions
import script from './script.raw.js';

type HubSpotRuntimeContext = RuntimeContext<
  RuntimeEnvironment<
    // eslint-disable-next-line @typescript-eslint/ban-types
    {},
    {
      script_loader_url?: string;
    }
  >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = (
  event,
  { environment }: HubSpotRuntimeContext
) => {
  const scriptLoaderURL =
    environment.spaceInstallation.configuration.script_loader_url;
  if (!scriptLoaderURL) {
    throw new Error(
      `The HubSpot Script Loader URL is missing from the configuration (ID: ${event.spaceId}).`
    );
  }

  return new Response(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
    script.replace('<TO_REPLACE_SCRIPT_LOADER_URL>', scriptLoaderURL),
    {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'max-age=604800'
      }
    }
  );
};

export default createIntegration<HubSpotRuntimeContext>({
  fetch_published_script: handleFetchEvent
});
