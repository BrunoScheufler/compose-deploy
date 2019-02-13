/**
 * Returns ssh2-compatible connection options parsed from
 * compose-deploy custom environment variables, as well
 * as ssh-agent's SSH_AUTH_SOCK
 */
export function fromEnv() {
  const {
    SSH_AUTH_SOCK,
    COMPOSE_DEPLOY_SSH_PASSPHRASE,
    COMPOSE_DEPLOY_SSH_PASSWORD,
    COMPOSE_DEPLOY_SSH_USER,
    COMPOSE_DEPLOY_SSH_HOST,
    COMPOSE_DEPLOY_SSH_PORT
  } = process.env;

  return {
    host: COMPOSE_DEPLOY_SSH_HOST,
    port: COMPOSE_DEPLOY_SSH_PORT
      ? parseInt(COMPOSE_DEPLOY_SSH_PORT)
      : undefined,
    agent: SSH_AUTH_SOCK,
    username: COMPOSE_DEPLOY_SSH_USER,
    password: COMPOSE_DEPLOY_SSH_PASSWORD,
    passphrase: COMPOSE_DEPLOY_SSH_PASSPHRASE
  };
}
