const PROTO_PATH = "./realties.proto";

var grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});

var realtiesProto = grpc.loadPackageDefinition(packageDefinition);

const { v4: uuidv4 } = require("uuid");

const server = new grpc.Server();
const realties = [
    {
        id: "a68b823c-7ca6-44bc-b721-fb4d5312cafc",
        title: "Apartamento em Crateús",
        address: "Rua Professor Lisboa Rodrigues",
        type: "Apartamento",
        rooms: 3,
        garages: 0,
        built: 400.30,
        ground: 450.25,
        price: 3000
    },
    {
        id: "34415c7c-f82d-4e44-88ca-ae2a1aaa92b7",
        title: "Casa em Ararendá",
        address: "Centro de Ararendá",
        type: "Casa",
        rooms: 2,
        garages: 1,
        built: 320,
        ground: 601.3,
        price: 15000
    }
];

server.addService(realtiesProto.RealtyService.service, {
    getAll: (_, callback) => {
        callback(null, { realties });
    },

    get: (call, callback) => {
        let realty = realties.find(n => n.id == call.request.id);

        if (realty) {
            callback(null, realty);
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not found"
            });
        }
    },

    insert: (call, callback) => {
        let realty = call.request;
        
        realty.id = uuidv4();
        realties.push(realty);
        callback(null, realty);
    },

    update: (call, callback) => {
        let existingRealty = realties.find(n => n.id == call.request.id);

        if (existingRealty) {
            existingRealty.title = call.request.title;
            existingRealty.address = call.request.address;
            existingRealty.type = call.request.type;
            existingRealty.rooms = call.request.rooms;
            existingRealty.garages = call.request.garages;
            existingRealty.built = call.request.built;
            existingRealty.ground = call.request.ground;
            existingRealty.price = call.request.price;
            callback(null, existingRealty);
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not found"
            });
        }
    },

    remove: (call, callback) => {
        let existingRealtyIndex = realties.findIndex(
            n => n.id == call.request.id
        );

        if (existingRealtyIndex != -1) {
            realties.splice(existingRealtyIndex, 1);
            callback(null, {});
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not found"
            });
        }
    }
});

server.bind("127.0.0.1:30043", grpc.ServerCredentials.createInsecure());
console.log("Server running at http://127.0.0.1:30043");
server.start();