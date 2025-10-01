
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '@backend/(.*)': '<rootDir>/src/$1',
    },
};
