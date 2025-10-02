// src/config/arcgis-config.ts
import esriConfig from '@arcgis/core/config';

// Configure ArcGIS to use local assets
esriConfig.assetsPath = './assets/@arcgis/core/assets';

// Set your Enterprise portal URL
esriConfig.portalUrl = "https://sig.anam.dz/portal";

// Configure CORS handling
esriConfig!.request!.interceptors!.push({
  urls: /^https:\/\/js\.arcgis\.com\/.*/,
  before: function (params: any) {
    // Add CORS headers for ArcGIS CDN
    params.requestOptions.headers = {
      ...params.requestOptions.headers,
      'mode': 'cors'
    };
    return params;
  }
});

export default esriConfig;