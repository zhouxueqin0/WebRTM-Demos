import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import Login from '../Login.vue'

describe('Login.vue', () => {
  it('renders login button', () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: Login }]
    })
    
    const wrapper = mount(Login, {
      global: {
        plugins: [router]
      }
    })
    
    expect(wrapper.find('button').text()).toBe('Login')
  })
})
