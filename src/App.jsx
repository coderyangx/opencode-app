import React, { Component } from 'react'
import { View } from '@tarojs/components'

class App extends Component {
  render() {
    return (
      <View className='app'>
        {this.props.children}
      </View>
    )
  }
}

export default App
