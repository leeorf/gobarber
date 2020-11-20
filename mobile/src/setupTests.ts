/**
 *  In Test environment the AsyncStorage does not exist, because it relies on a
 * physical device to store data in the mobile database. And when we run our
 * tests, we are not running in a physical device. Thus we need to mock the
 * AsyncStorage
 */

import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';

jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);
