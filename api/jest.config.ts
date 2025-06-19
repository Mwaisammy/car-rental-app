import { Config } from 'jest'

const config: Config = {
    preset: 'ts-jest', //test using ts
    testEnvironment: 'node', //env test
    verbose: true,//show individual test results
    coverageDirectory: 'coverage', //directory for coverage reports
//     collectCoverage: true, //collect coverage information
//     collectCoverageFrom: [
//         '<rootDir>/src/**/*.ts'
//     ],
//     coveragePathIgnorePatterns: [
//     "/node_modules/",
//     "index.ts",
//     ".*\\.router\\.ts",
//     ".*\\.controller\\.ts",
//     ".*\\.schema\\.ts",
//     ".*\\.db\\.ts",
//     ".*\\.migrate\\.ts",
//     ".*\\.seed\\.ts", 
//     '<rootDir>/src/Drizzle/',
//     '<rootDir>/src/mailer/mailer.ts',
//     '<rootDir>/src/middleware/bearAuth.ts',
//   ]
    testTimeout: 30000
}

export default config

