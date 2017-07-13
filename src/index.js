import App from './App'

let app = new App()

window.addEventListener('load', () => {
  app.init()
})

if (module.hot) {
  module.hot.accept('./App', () => {
    app.devTear()
    const NextApp = require('./App').default // eslint-disable-line global-require
    app = new NextApp()
    app.init()
  })
}
