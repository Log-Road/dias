export const PASSWORD_REGEXP = new RegExp(
  /^(?=.*[a-zA-Z])(?=.*[!\/@#$%^*+=-])(?=.*[0-9]).{8,15}$/g,
);