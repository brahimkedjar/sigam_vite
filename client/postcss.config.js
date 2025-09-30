import presetEnv from 'postcss-preset-env'
import flexbugs from 'postcss-flexbugs-fixes'

export default {
  plugins: [
    flexbugs(),
    presetEnv({ stage: 3 }),
  ],
}

