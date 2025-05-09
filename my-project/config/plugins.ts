export default () => ({
  upload: {
    config: {
      provider: 'local',
      providerOptions: {},
      actionOptions: {
        upload: {
          security: {
            // Allow public uploads without authentication
            allowedAuthenticatedUserRoles: [],
            allowedUnauthenticatedUserRoles: ['public'],
          },
        },
        uploadFiles: {
          security: {
            // Allow public uploads without authentication
            allowedAuthenticatedUserRoles: [],
            allowedUnauthenticatedUserRoles: ['public'],
          },
        },
      },
    },
  },
});
