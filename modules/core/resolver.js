import { cloneElement, isValidElement, Children } from 'react'
import extractCSS from '../mixins/extractCSS'
import renderStaticStyles from './renderer'
import StyleContainer from '../api/StyleContainer'
import assignStyles from 'assign-styles'
import _ from 'lodash'

export function resolvePlugins(pluginInterface) {
  let { styles, config } = pluginInterface

  // Triggers plugin resolving
  // Uses the exact plugin lineup defined within Config
  config.plugins.forEach(plugin => styles = plugin({ ...pluginInterface, styles }))

  return styles
}

/**
 * Resolves provided styles into style objects
 * Processes those using a predefined plugin lineup
 * Maps the final style objects to the element
 * @param {Object} Component - wrapping React Component providing styles and elements
 * @param {Object} element - previously rendered React element
 * @param {Object} config - configuration containing plugins and plugin-specific configs
 */
export default function resolveStyles(Component, element, config) {
  if (element && element.props) {
    // early return if element itself is a Look component
    // it will be resolved anyways
    if (element.type && element.type._isLookEnhanced) {
      return element
    }

    let newProps = { ...element.props }
    Object.keys(newProps).forEach(property => {
      if (property === 'children') {
        return
      }

      // Resolving styles for elements passed by props
      // Skip children as they've been resolved already
      const propElement = newProps[property]
      if (isValidElement(propElement)) {
        newProps[property] = resolveStyles(Component, propElement, config)
        newProps._lookShouldUpdate = true
      }
    })

    if (newProps.children) {
      // resolving child styles recursively to make sure they will be rendered correctly
      newProps.children = resolveChildren(Component, newProps.children, config) // eslint-disable-line
    }


    if (newProps.className) {

      // static arguments that get passed to every plugin
      const staticPluginArguments = {
        resolve: resolvePlugins,
        StyleContainer,
        Component,
        newProps,
        element,
        config
      }

      newProps.className.split(' ').forEach(className => {
        let dynamicStyles = assignStyles({}, StyleContainer.dynamics.get(className))

        // Resolve plugins if there are dynamic styles to resolve
        // and plugins are provided via config
        if (dynamicStyles && config.plugins) {
          // Constructs the pluginInterface
          const pluginInterface = { ...staticPluginArguments, styles: dynamicStyles }
          const newStyles = assignStyles({}, resolvePlugins(pluginInterface))

          // Only apply styles if there are some
          if (!_.isEmpty(newStyles)) {
            const dynamicClassName = renderStaticStyles(newStyles, className + '-dynamic-')
            extractCSS({ value: dynamicClassName, newProps })
            newProps._lookShouldUpdate = true
          }
        }
      })
    }

    // Only actually clone if it is needed
    // If there are styles, children got resolved or props got resolved
    if (newProps.children !== element.props.children || newProps._lookShouldUpdate) {
      return cloneElement(element, newProps)
    }
  }

  return element
}

/**
 * Resolves provided styles for an elements children
 * @param {Object} Component - wrapping React Component providing looks and elements
 * @param {Array|string|number} children - children that get resolved
 * @param {Object} config - configuration containing plugins and plugin-specific configs
 */
function resolveChildren(Component, children, config) {
  // directly return primitive children
  if (_.isString(children) || _.isNumber(children)) {
    return children
  }

  if (children.type) {
    return resolveStyles(Component, children, config)
  }

  // if there are more than one child, iterate over them
  if (_.isArray(children)) {
    // flattening children prevents deeper nested children
    const flatChildren = _.flattenDeep(children)

    // recursively resolve styles for child elements if it is a valid React Component
    return Children.map(flatChildren, child => {
      if (isValidElement(child)) {
        return resolveStyles(Component, child, config)
      }
      return child
    })
  }
}
