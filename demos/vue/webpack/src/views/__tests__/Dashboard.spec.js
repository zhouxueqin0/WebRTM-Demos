import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Dashboard from '../Dashboard.vue'

describe('Dashboard.vue', () => {
  it('renders Hello World', () => {
    const wrapper = mount(Dashboard)
    expect(wrapper.find('h1').text()).toBe('Hello World')
  })
})
