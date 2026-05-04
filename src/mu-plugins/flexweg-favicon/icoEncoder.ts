// Pure-JS encoder for the .ico container format. Wraps an arbitrary
// number of PNG payloads (one per icon size) into a single .ico binary
// per the Microsoft ICONDIR / ICONDIRENTRY spec:
//   https://en.wikipedia.org/wiki/ICO_(file_format)
//
// Layout:
//   ICONDIR (6 bytes):
//     reserved   uint16   0x0000
//     type       uint16   0x0001 (icon)
//     count      uint16   number of images
//   ICONDIRENTRY (16 bytes per image):
//     width      uint8    pixels (0 = 256)
//     height     uint8    pixels (0 = 256)
//     colors     uint8    palette colors (0 = no palette)
//     reserved   uint8    0
//     planes     uint16   color planes (1 for PNG payloads)
//     bpp        uint16   bits per pixel (32 for PNG payloads)
//     size       uint32   image data byte length
//     offset     uint32   image data offset from start of .ico file
//   [PNG payload 1]
//   [PNG payload 2]
//   …
//
// Modern Windows / browsers accept PNG-payload icons inside .ico files
// (added in Vista). Saves us writing a BMP encoder.

export interface IcoImage {
  // Pixel size on each axis (16, 32, 48, …). 256 must be encoded as 0
  // in the directory entry per the spec.
  size: number;
  // Raw bytes of the PNG file at this size.
  png: Uint8Array;
}

export function encodeIco(images: IcoImage[]): Uint8Array {
  if (images.length === 0) throw new Error("encodeIco: at least one image required.");

  const headerSize = 6;
  const entrySize = 16;
  const dirSize = headerSize + entrySize * images.length;
  const totalDataSize = images.reduce((acc, img) => acc + img.png.length, 0);
  const out = new Uint8Array(dirSize + totalDataSize);
  const view = new DataView(out.buffer);

  // ICONDIR
  view.setUint16(0, 0, true); // reserved
  view.setUint16(2, 1, true); // type = icon
  view.setUint16(4, images.length, true); // count

  // ICONDIRENTRY × N
  let dataOffset = dirSize;
  images.forEach((img, i) => {
    const entryOffset = headerSize + i * entrySize;
    const widthByte = img.size >= 256 ? 0 : img.size;
    const heightByte = img.size >= 256 ? 0 : img.size;
    out[entryOffset + 0] = widthByte;
    out[entryOffset + 1] = heightByte;
    out[entryOffset + 2] = 0; // colors (no palette)
    out[entryOffset + 3] = 0; // reserved
    view.setUint16(entryOffset + 4, 1, true); // planes
    view.setUint16(entryOffset + 6, 32, true); // bpp
    view.setUint32(entryOffset + 8, img.png.length, true); // size
    view.setUint32(entryOffset + 12, dataOffset, true); // offset

    out.set(img.png, dataOffset);
    dataOffset += img.png.length;
  });

  return out;
}
