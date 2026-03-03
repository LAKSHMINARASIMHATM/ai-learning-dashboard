import mongoose from 'mongoose';
import { IRefreshToken } from '../types';
declare const RefreshToken: mongoose.Model<IRefreshToken, {}, {}, {}, mongoose.Document<unknown, {}, IRefreshToken, {}, {}> & IRefreshToken & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default RefreshToken;
//# sourceMappingURL=RefreshToken.d.ts.map