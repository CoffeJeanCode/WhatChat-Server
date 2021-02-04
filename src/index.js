import { app, server } from './app'

async function main() {
  await server.listen(app.get('port'))
  console.log('Server on port', app.get('port'))
}

main()
