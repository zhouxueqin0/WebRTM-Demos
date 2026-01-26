import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Index from '../index.vue'

describe('Index page', () => {
  it('renders login button', () => {
    const wrapper = mount(Index, {
      global: {
        stubs: {
          NuxtPage: true
        }
      }
    })
    expect(wrapper.find('button').text()).toBe('Login')
  })
})
