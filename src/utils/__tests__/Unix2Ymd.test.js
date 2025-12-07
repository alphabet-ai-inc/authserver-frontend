import { formatUnixTimestamp } from '../Unix2Ymd';

describe('formatUnixTimestamp', () => {
  test('formats a known unix timestamp correctly', () => {
    // 2024-01-02 03:04:05 UTC
    const unixTime = 1704164645;
    expect(formatUnixTimestamp(unixTime)).toBe('2024/01/02 03:04:05');
  });

  test('pads single digit values with zeros', () => {
    // 2023-03-04 05:06:07 UTC
    const unixTime = 1677906367;
    expect(formatUnixTimestamp(unixTime)).toBe('2023/03/04 05:06:07');
  });

  test('handles unix epoch (0)', () => {
    expect(formatUnixTimestamp(0)).toBe('1970/01/01 00:00:00');
  });
});