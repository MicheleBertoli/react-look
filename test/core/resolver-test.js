import { expect } from 'chai'
import React, { Component } from 'react'
import StyleSheet from '../../modules/api/StyleSheet'
import resolveStyles from '../../modules/core/resolver'
import look from '../../modules/core/enhancer'
import domPreset from '../../modules/presets/react-dom'


describe('Resolving children', () => {
  it('should return children if it is a string or number', () => {
    const Component = {
      state: { }
    }
    const child = 3
    const element = (<div>{child}</div>)
    const resolved = resolveStyles(Component, element, { })

    expect(resolved.props.children).to.eql(child)
  })

  it('should flatten the children', () => {
    const Component = {
      state: { }
    }
    const element = (<div>{[ 3, 4, [ 5, 6 ] ]}</div>)
    const resolved = resolveStyles(Component, element, { })

    expect(resolved.props.children).to.eql([ 3, 4, 5, 6 ])
  })
})

describe('Resolving styles', () => {
  it('should return the element if it is enhanced with Look', () => {
    class Comp extends Component {
      render() {
        return <div>foo</div>
      }
    }
    Comp = look(Comp)
    const el = <Comp />
    const resolved = resolveStyles(Comp, el, { })

    expect(resolved).to.eql(el)
  })

  it('should resolve props containg elements', () => {
    class Comp extends Component {
      render() {
        return <div>foo</div>
      }
    }

    const el = <Comp inner={<div></div>}/>
    const resolved = resolveStyles(Comp, el, { })
    expect(resolved.props._lookShouldUpdate).to.eql(true)
  })

  it('should keep inline styles', () => {
    class Comp extends Component {
      render() {
        return <div></div>
      }
    }
    Comp = look(Comp)
    const el = <div className="foo" style={{ color: 'red' }}>foo</div>
    const resolved = resolveStyles(Comp, el, { })

    expect(resolved.props.style).to.eql({ color: 'red' })
  })
})
