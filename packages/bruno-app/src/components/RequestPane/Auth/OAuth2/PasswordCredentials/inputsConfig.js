const inputsConfig = [
  {
    key: 'accessTokenUrl',
    labelKey: 'OAUTH2.ACCESS_TOKEN_URL'
  },
  {
    key: 'username',
    labelKey: 'AUTH_FIELDS.USERNAME'
  },
  {
    key: 'password',
    labelKey: 'AUTH_FIELDS.PASSWORD',
    isSecret: true
  },
  {
    key: 'clientId',
    labelKey: 'OAUTH2.CLIENT_ID'
  },
  {
    key: 'clientSecret',
    labelKey: 'OAUTH2.CLIENT_SECRET',
    isSecret: true
  },
  {
    key: 'scope',
    labelKey: 'OAUTH2.SCOPE'
  }
];

export { inputsConfig };
