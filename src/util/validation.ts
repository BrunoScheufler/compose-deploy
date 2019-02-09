import * as yup from 'yup';
import { IConfig, IDeploymentTarget } from '../types';

export const configSchema = yup
  .object<IConfig>()
  .shape({
    name: yup.string().required(),
    targets: yup
      .array()
      .of(
        yup
          .object<IDeploymentTarget>()
          .shape({
            host: yup.string().required(),
            username: yup.string().required(),
            password: yup.string(),
            privateKeyFile: yup.string(),
            passphrase: yup.string()
          })
          .noUnknown(false)
          .required()
      )
      .required()
  })
  .noUnknown(true)
  .required();
