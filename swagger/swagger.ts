import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Limitless API',
            version: '1.0.0',
            description: 'API for Limitless Holdings',
            contact: {
                name: 'Eder Hernández'
            },
            servers: [
                {
                    url: 'http://localhost:3001/api',
                    description: 'Local server'
                }
            ]
        }
    },
    apis: ['./src/routes/**/*.ts'], // Busca en todas las subcarpetas
};

const specs = swaggerJsdoc(options);
export default specs;