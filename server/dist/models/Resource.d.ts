import mongoose from 'mongoose';
import { IResource } from '../types';
declare const Resource: mongoose.Model<IResource, {}, {}, {}, mongoose.Document<unknown, {}, IResource, {}, {}> & IResource & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Resource;
//# sourceMappingURL=Resource.d.ts.map