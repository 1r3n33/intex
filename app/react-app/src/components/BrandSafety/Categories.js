// BrandSafetyCategories is an helper class that allows sending/receiving
// brand safety category ids to/from the Intex exchange.
class BrandSafetyCategories {
  categories = {
    1: 'Military conflict',
    2: 'Obscenity',
    3: 'Drugs',
    4: 'Tobacco',
    5: 'Adult',
    6: 'Arms',
    7: 'Crime',
    8: 'Death/injury',
    9: 'Online piracy',
    10: 'Hate speech',
    11: 'Terrorism',
    12: 'Spam/harmful sites',
    13: 'Fake news'
  };

  // Encode array of brand safety category id to Intex exchange data format
  //
  // |Number of ids|Id 0     |Id 1     |Id 2     |...|Id *n*   |
  // |:-----------:|:-------:|:-------:|:-------:|:-:|:-------:|
  // |*4 bytes*    |*4 bytes*|*4 bytes*|*4 bytes*|...|*4 bytes*|
  //
  toBytes(ids) {
    const length = ids.length
    const buffer = new ArrayBuffer(4 * (1 + length));
    const data32 = new Int32Array(buffer);
    data32[0] = length;
    data32.set(ids, 1);
    return new Uint8Array(buffer);
  }

  // Decode Intex exchange hexadecimal string data format to array of brand safety category id
  // ie: 0x03000000090000000A0000000B000000 encodes 3 ids: 9, 10, 11
  //
  fromHexadecimalString(hex) {
    const dataHex = hex.substring(2); // remove 0x
    const data8 = Buffer.from(dataHex, 'hex');
    const data32 = new Int32Array(data8.buffer);
    return Array.from(data32).slice(1); // skip length
  }
}

export default BrandSafetyCategories;
