<h1><img src="docs/res/logo.png" width=350></h1>

![TravisCI](https://travis-ci.org/rofrischmann/react-look.svg?branch=develop) [![Test Coverage](https://codeclimate.com/github/rofrischmann/react-look/badges/coverage.svg)](https://codeclimate.com/github/rofrischmann/react-look/coverage) [![Code Climate](https://codeclimate.com/github/rofrischmann/react-look/badges/gpa.svg)](https://codeclimate.com/github/rofrischmann/react-look)
[![npm version](https://badge.fury.io/js/react-look.svg)](http://badge.fury.io/js/react-look)
![Dependencies](https://david-dm.org/rofrischmann/react-look.svg)
![Gzipped Size](https://img.shields.io/badge/gzipped-~17k-brightgreen.svg)

**Look** is a modular, **plugin**-based and **feature-rich** styling library for [React](https://facebook.github.io/react/). <br>
It intelligently splits static and dynamic styles to maximize reusablility and performance.
It simplyfies how you are styling your Components.

> **Warning**: This README and the docs reference the 1.0.0 Version. **It does not support React Native by now** (coming soon). <br>Make sure to test it!

# Features
- ES2015 Classes & `React.createClass`
- stateless Components
- server-side rendering
- [plugin-based](docs/Plugins.md)
- [developer tools](docs/Plugins.md#developertools)
- Sass-like nesting
- [pseudo classes](docs/api/StyleSheet.md#pseudo-classes)
- [media queries](docs/api/StyleSheet.md#media-queries)
- [platform queries](docs/Mixins.md#platform-queries)
- [conditioned styles](docs/Mixins.md#stateful-conditions)
- [stateful values](docs/plugins/StatefulVaue.md)
- [fallback values](docs/plugins/FallbackValue.md)
- [extending](docs/Mixins.md#extend)
- [vendor prefixing](docs/plugins/Prefixer.md)
- [CSS](docs/api/StyleSheet.md##tocssstyles--scope-media-id), [font-face ](docs/api/StyleSheet.md#fontfontfamily-files--properties) & [keyframes API](docs/api/StyleSheet.md#keyframesframes--name)

# Documentation
The documentation contains information on every part of Look including usage guides and API reference.

**New to Look?**<br>
Make sure to check out the [Getting Started Guide](docs/GettingStarted.md) which provides a full guide on how to use Look. From installation, over configuration and up to even developer tooling.

#### Table of contents
1. [Getting Started](docs/GettingStarted.md)
	* 1.1. [Installation](docs/GettingStarted.md#1-installation)
	* 1.2. [First Component](docs/GettingStarted.md#2-first-component)
	* 1.3. [Stateless Components](docs/GettingStarted.md#3-stateless-components)
	* 1.4. [Pseudo classes](docs/GettingStarted.md#4-pseudo-classes)
	* 1.5. [Media queries](docs/GettingStarted.md#5-media-queries)
	* 1.6. [Mixins & Plugins](docs/GettingStarted.md#6-mixins--plugins)
	* 1.7. [Fallback values](docs/GettingStarted.md#7-fallback-values)
	* 1.8. [Vendor prefixes](docs/GettingStarted.md#8-vendor-prefixes)
	* 1.9. [Server-side rendering](docs/GettingStarted.md#9-server-side-rendering)
	* 1.10. [DevTools](docs/GettingStarted.md#10-devtools)
2. Registry
	* 2.1. [Plugins](docs/Plugins.md)
		* 2.1.1 [DevTools](docs/Plugins.md#devtools)
	* 2.2. [Mixins](docs/Mixins.md)
3. [API Reference](docs/api/)
	* 3.1. [Look](docs/api/Look.md)
	* 3.2. [StyleSheet](docs/api/StyleSheet.md)
	* 3.3. [LookRoot](docs/api/LookRoot.md)
	* 3.4. [StyleContainer](docs/api/StyleContainer.md)
4. [Guides](docs/guides/)
	* 4.1. [Upgrading Look](docs/guides/upgradeLook.md)
	* 4.2. [Configuring Look](docs/guides/configureLook.md)
	* 4.3. [Build your own: Mixin](docs/guides/customMixin.md)
	* 4.4. [Build your own: Plugin](docs/guides/customPlugin.md)
5. [FAQ](docs/FAQ.md)

# Example
```sh
npm install react-look
```
The syntax is quite similar to [Sass](http://sass-lang.com) and other React styling libraries. Use nested objects to define pseudo classes, media queries or conditioned styles. <br>


```javascript
import React, { Component, PropTypes } from 'react'
import look, { StyleSheet } from 'react-look'

class Header extends Component {
  static defaultProps = { size: 24 };
  static propTypes = { size: PropTypes.number.isRequired };
  state = { status: 'active' };

  render() {
    return (
      // Styles are basically applied using the `className` property
      <header className={styles.header}>
        <h1 className={styles.title}>
          {this.props.title}
        </h1>
      </header>
    )
  }
}

// generates classNames for each selector
const styles = StyleSheet.create({
  header: {
    transition: '200ms all linear',
    // Use media queries or pseudo classes
    // using nested style objects. Those get transformed
    // on the fly and can be nested endlessly.
    '@media (min-height: 800px)': {
      fontSize: 13,
      ':hover': {    
        fontSize: 15
      }
    },
		// You can also use mixins with the same selector.
		// They'll get split intelligently and evaluated on render
    'status=active': {             
      backgroundColor: 'green',
      'size>=20': {            
        backgroundColor: 'pink'       
      }
    }
  },
  title: {
    fontWeight: 800,
    // use functions to inject props, state or context values
    fontSize: (props, state, context) => props.size * state.zoom
  }
})

export default look(Header)
```

# Demo
Check out the provided examples for some special use cases. See them in action using the demo. You can easily run the examples on your own within the provided demo by just:
```sh
git clone --bare https://github.com/rofrischmann/react-look.git
npm install
npm run babel
# run this as a client-side only demo
npm run demo
# run this as a universal demo
npm run demo:universal
```

# License
**Look** is licensed under the [MIT License](http://opensource.org/licenses/MIT).<br>
Documentation is licensed under [Creative Common License](http://creativecommons.org/licenses/by/4.0/).<br>
Created with ♥ by [@rofrischmann](http://rofrischmann.de).

# Contributing
I would love to see people getting involved.<br>
If you have a feature request please create an issue. Also if you're even improving Look by any kind please don't be shy and send a pull request to let everyone benefit.

### Issues
If you're having any issue please let me know as fast as possible to find a solution a hopefully fix the issue. Try to add as much information as possible such as your environment, exact case, the line of actions to reproduce the issue.

### Pull Requests
If you are creating a pull request, try to use commit messages that are self-explanatory. Also always add some **tests** unless it's totally senseless (add a reason why it's senseless) and test your code before you commit so Travis won't throw errors.
