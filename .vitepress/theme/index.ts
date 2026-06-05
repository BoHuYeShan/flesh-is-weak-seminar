import DefaultTheme from 'vitepress/theme'
import SubmissionsPanel from './SubmissionsPanel.vue'
import './custom.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('SubmissionsPanel', SubmissionsPanel)
  }
}
