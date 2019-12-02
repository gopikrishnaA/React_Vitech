
export const isProduction = () => process.env.NODE_ENV === 'production' ||
  process.env.NODE_ENV === 'uat' ||
  process.env.NODE_ENV === 'sit'
