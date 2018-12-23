import TestSuite from './utils/TestSuite';
import {
  AudioTest,
  VideoTest,
  ConnectivityTest,
  VideoBandwidthTest,
  AudioBandwidthTest,
  SymmetricNatTest
} from './defaultTests';
import ERROR_CODES from './utils/testErrorCodes';

module.exports = {
  TestSuite,
  AudioTest,
  VideoTest,
  ConnectivityTest,
  VideoBandwidthTest,
  AudioBandwidthTest,
  SymmetricNatTest,
  ERROR_CODES
};
