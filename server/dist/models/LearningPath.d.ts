import mongoose from 'mongoose';
import { ILearningPath } from '../types';
declare const LearningPath: mongoose.Model<ILearningPath, {}, {}, {}, mongoose.Document<unknown, {}, ILearningPath, {}, {}> & ILearningPath & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default LearningPath;
//# sourceMappingURL=LearningPath.d.ts.map