const PROTO_PATH = "../realties.proto"; 

const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});

const RealtyService = grpc.loadPackageDefinition(packageDefinition).RealtyService;
const client = new RealtyService(
    "localhost:30043",
    grpc.credentials.createInsecure()
);

module.exports = client;