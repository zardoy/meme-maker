/// <reference types="@zardoy/vit/twin-sc" />
/// <reference types="vite/client" />

import { renderToDom } from '@zardoy/react-util'
import 'tailwindcss/tailwind.css'
import App from './App'

renderToDom(<App />, {
    strictMode: false,
})
