module.exports = {
  "roots": [
      "<rootDir>/src"
  ],
  "transform": {
    "^.+\\.(css|less)$": "./styleMock.js",
    "^.+\\.tsx?$": "ts-jest",
  },
  // Setup Enzyme
  "snapshotSerializers": ["enzyme-to-json/serializer"],
  "setupFilesAfterEnv": ["<rootDir>/setupEnzyme.js"],
  "collectCoverage": true,
}

