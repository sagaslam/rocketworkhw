// breakpointsConfig.js
import breakpointsLib from '/src/js/breakpoints.min.js'

const defaultConfig = {
  default: ['1681px', null],
  xlarge: ['1281px', '1680px'],
  large: ['981px', '1280px'],
  medium: ['737px', '980px'],
  small: ['481px', '736px'],
  xsmall: ['361px', '480px'],
  xxsmall: [null, '360px']
}

let initialized = false

export function initBreakpoints(config = defaultConfig) {
  if (!initialized) {
    breakpointsLib(config)
    initialized = true
  }
}

export const onBreakpoint = (query, callback) =>
  breakpointsLib.on(query, callback)

export const isBreakpoint = (query) => breakpointsLib.is(query)

export const getBreakpoint = () => breakpointsLib.get()
