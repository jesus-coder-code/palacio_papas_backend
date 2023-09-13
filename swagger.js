const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'palacio de las papas',
        description: 'api del palacio de las papas',
    },
    host: 'localhost:3000',
    schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(()=>{
    require('./app.js');
});