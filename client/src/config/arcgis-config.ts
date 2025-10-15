// src/config/arcgis-config.ts
import esriConfig from '@arcgis/core/config';

// Serve ArcGIS assets locally from Vite's public folder. We placed
// `@arcgis/core/assets` contents under `client/public/assets`, so at runtime
// they are available at `/assets/...`.
esriConfig.assetsPath = '/assets';

// Set your Enterprise portal URL
esriConfig.portalUrl = 'https://sig.anam.dz/portal';

// Make sure common ArcGIS hosts are marked CORS-enabled
try {
  const req = esriConfig.request as any;
  req.corsEnabledServers = req.corsEnabledServers || [];
  const cors = req.corsEnabledServers as string[];
  ['sig.anam.dz','cdn.arcgis.com','js.arcgis.com','services.arcgisonline.com','server.arcgisonline.com','basemaps.arcgis.com','tiles.arcgis.com']
    .forEach(h => { if (!cors.includes(h)) cors.push(h); });
} catch {}

// Fallback to CDN assets if local assets are missing
// Optionally, you can set a fixed locale to reduce t9n lookups like `*_en.json`.
// esriConfig.locale = 'en';

export default esriConfig;
