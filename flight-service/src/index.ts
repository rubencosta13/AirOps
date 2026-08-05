import 'dotenv/config';

import { server } from './server';

const start = async () => { 
    await server.listen({ port: 3000 })
}

start()

