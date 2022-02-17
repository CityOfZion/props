"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstanceAccessMode = exports.EventTypeEnum = void 0;
var EventTypeEnum;
(function (EventTypeEnum) {
    EventTypeEnum[EventTypeEnum["CollectionPointer"] = 0] = "CollectionPointer";
    EventTypeEnum[EventTypeEnum["ContractCall"] = 1] = "ContractCall";
    EventTypeEnum[EventTypeEnum["Value"] = 2] = "Value";
})(EventTypeEnum = exports.EventTypeEnum || (exports.EventTypeEnum = {}));
var InstanceAccessMode;
(function (InstanceAccessMode) {
    InstanceAccessMode[InstanceAccessMode["ContractWhitelist"] = 0] = "ContractWhitelist";
    InstanceAccessMode[InstanceAccessMode["ContractWhiteListRestricted"] = 1] = "ContractWhiteListRestricted";
    InstanceAccessMode[InstanceAccessMode["Global"] = 2] = "Global";
})(InstanceAccessMode = exports.InstanceAccessMode || (exports.InstanceAccessMode = {}));
//# sourceMappingURL=interface.js.map