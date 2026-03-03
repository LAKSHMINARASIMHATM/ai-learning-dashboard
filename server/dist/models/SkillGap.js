"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const skillGapSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    skills: [
        {
            topic: { type: String, required: true },
            currentLevel: { type: Number, min: 0, max: 100, required: true },
            targetLevel: { type: Number, min: 0, max: 100, default: 100 },
            gap: { type: Number, min: 0, max: 100 },
            priority: {
                type: String,
                enum: ['high', 'medium', 'low'],
                default: 'medium',
            },
        },
    ],
    lastAssessmentDate: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
// Calculate gap before saving
skillGapSchema.pre('save', function (next) {
    this.skills.forEach((skill) => {
        skill.gap = skill.targetLevel - skill.currentLevel;
    });
    next();
});
const SkillGap = mongoose_1.default.model('SkillGap', skillGapSchema);
exports.default = SkillGap;
//# sourceMappingURL=SkillGap.js.map