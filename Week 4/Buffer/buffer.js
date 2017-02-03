const buff1 = Buffer.from("hello");
console.log(buff1);

const buff2 = Buffer.from([255,0,10,1024]);
console.log(buff2);

const buff3 = Buffer.alloc(5);
buff3.writeUInt8(10);
buff3.writeUInt8(16,1);
buff3.writeUInt8(32,4);

console.log(buff3);