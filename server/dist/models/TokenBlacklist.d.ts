import { Model } from 'mongoose';
import { ITokenBlacklist } from '../types';
interface TokenBlacklistModel extends Model<ITokenBlacklist> {
    isBlacklisted(jti: string): Promise<boolean>;
}
declare const TokenBlacklist: TokenBlacklistModel;
export default TokenBlacklist;
//# sourceMappingURL=TokenBlacklist.d.ts.map