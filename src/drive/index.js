

/* eslint-disable */

import local from './local'
import google from './google'

// determine provider based on env variable
let provider_name = process.env.VUE_APP_DRIVE_PROVIDER || "google"
let provider = null;
if (provider_name === "google")
  provider = google;
else if (provider_name === "local")
  provider = local;

// export provider
export default provider;

