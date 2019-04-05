



import config from '../config'


export function registerAddin(addin) {

  // merge config
  if (addin.config) {
    Object.keys(config).forEach(key => {
      config[key] = {
        ...config[key],
        ...addin.config[key]
      };
    });
  }


  
}