import mongoose from 'mongoose';
import { IChatMessage } from '../types';
declare const ChatMessage: mongoose.Model<IChatMessage, {}, {}, {}, mongoose.Document<unknown, {}, IChatMessage, {}, {}> & IChatMessage & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default ChatMessage;
//# sourceMappingURL=ChatMessage.d.ts.map