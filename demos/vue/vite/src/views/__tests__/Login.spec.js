import { describe, it, expect, vi } from 'vitest'
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

  it('shows loading state when clicked', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: Login },
        { path: '/dashboard', component: { template: '<div>Dashboard</div>' } }
      ]
    })
    
    const wrapper = mount(Login, {
      global: {
        plugins: [router]
      }
    })
    
    const button = wrapper.find('button')
    await button.trigger('click')
    
    expect(button.text()).toBe('Loading...')
    expect(button.element.disabled).toBe(true)
  })
})
