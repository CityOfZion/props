"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkOption = exports.InstanceAccessMode = exports.EventTypeEnum = void 0;
var EventTypeEnum;
(function (EventTypeEnum) {
    EventTypeEnum[EventTypeEnum["CollectionPointer"] = 0] = "CollectionPointer";
    EventTypeEnum[EventTypeEnum["InstanceCall"] = 1] = "InstanceCall";
    EventTypeEnum[EventTypeEnum["Value"] = 2] = "Value";
    EventTypeEnum[EventTypeEnum["CollectionSampleFrom"] = 3] = "CollectionSampleFrom";
})(EventTypeEnum = exports.EventTypeEnum || (exports.EventTypeEnum = {}));
var InstanceAccessMode;
(function (InstanceAccessMode) {
    InstanceAccessMode[InstanceAccessMode["ContractWhitelist"] = 0] = "ContractWhitelist";
    InstanceAccessMode[InstanceAccessMode["ContractWhiteListRestricted"] = 1] = "ContractWhiteListRestricted";
    InstanceAccessMode[InstanceAccessMode["Global"] = 2] = "Global";
})(InstanceAccessMode = exports.InstanceAccessMode || (exports.InstanceAccessMode = {}));
var NetworkOption;
(function (NetworkOption) {
    NetworkOption[NetworkOption["LocalNet"] = 0] = "LocalNet";
    NetworkOption[NetworkOption["TestNet"] = 1] = "TestNet";
    NetworkOption[NetworkOption["MainNet"] = 2] = "MainNet";
})(NetworkOption = exports.NetworkOption || (exports.NetworkOption = {}));
//# sourceMappingURL=interface.js.map