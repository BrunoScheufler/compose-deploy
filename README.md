# compose-deploy

> CLI to deploy docker-compose setups to remote servers using ssh

## about

Simply deploying a docker-compose setup can be a real struggle. Cloning and pulling the full project on your remote server every time you push some changes can be a real hassle when you're moving fast. Out of this problem, compose-deploy was created. Being a simple tool wrapping existing features of docker-compose and ssh2, it offers a straightforward approach to deploy your Compose files with unprecedented ease.

## installation & usage

To install compose-deploy from npm, simply run the following:

```bash
npm i -g compose-deploy
```

After you've downloaded the binary, you can initialize a new deployment project by running

```bash
compose-deploy init [directory of choice, optional]
```

This will create a configuration file named `compose-deploy.yml`, which contains all configuration options needed for managing deployment workflows and connecting to the remote server.

After you've configured your setup, simply execute `compose-deploy [up|deploy]`, and watch in delight as your application is deployed.

## how it works

In the first step, compose-deploy builds and pushes your Docker images needed for running the services defined in your Compose file. This is achieved by executing `docker-compose build` & `docker-compose push`. Afterwards, an SSH connection to your deployment targets is established, existing deployments of the same project are found and shut down (without removing persistent data like volumes), the current compose file is uploaded and launched. Simple as that, almost all of the processes described above already exist in docker-compose, making compose-deploy a really simple piece of software alltogether.

## faq

### Can I use private image registries?

Sure, since the complete process of building and pushing Docker images for your project is done by docker-compose itself, you can configure your docker-compose file like described in the [reference example](https://docs.docker.com/compose/reference/push/). Don't forget to log in to your registry of choice on the target server though, otherwise you might not be able to pull the built and pushed images.

### What about other features of docker-compose? Do I have to access my server every time I want to monitor my deployments?

Currently, there's no other way to access your deployments than by checking manually. However, one of the next updates will add support for using some common docker-compose features like log-viewing & command-execution on your remote without connecting manually, stay tuned for that!

## configuration

- `name` (string): The name of your deployment project
- `targets` (Target[]): A list of deployment targets (servers)
  - All options listed [here](https://github.com/mscdex/ssh2#client-methods) are supported
  - `privateKeyFile` can be used to supply the file path of your private key used for SSH auth
- `composeFile`: The path of your compose file (defaults to `docker-compose.yml` in your current working directory)

## license

This project is licensed under the [MIT License](LICENSE).
