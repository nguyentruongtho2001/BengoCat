import { createRouter, createWebHashHistory } from 'vue-router'

import Dashboard from './components/Dashboard.vue'
import Pomodoro from './components/Pomodoro.vue'
import SettingsGroup from './components/SettingsGroup.vue'
import StudyRoadmap from './components/StudyRoadmap.vue'
import QuickNotes from './components/QuickNotes.vue'
import Dictionary from './components/Dictionary.vue'
import Music from './components/Music.vue'
import CustomizeCat from './components/CustomizeCat.vue'
import ZenMode from './components/ZenMode.vue'
import Stats from './components/Stats.vue'
import Calendar from './components/Calendar.vue'

const routes = [
  { path: '/', component: Dashboard },
  { path: '/pomodoro', component: Pomodoro },
  { path: '/settings', component: SettingsGroup },
  { path: '/study-roadmap', component: StudyRoadmap },
  { path: '/quick-notes', component: QuickNotes },
  { path: '/dictionary', component: Dictionary },
  { path: '/music', component: Music },
  { path: '/customize-cat', component: CustomizeCat },
  { path: '/zen', component: ZenMode },
  { path: '/stats', component: Stats },
  { path: '/calendar', component: Calendar }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})
