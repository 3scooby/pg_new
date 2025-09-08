import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { PayoutStatus as PayoutStatusEnum } from '../types';

export interface PayoutAttributes {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: PayoutStatusEnum;
  token: string;
  upiId?: string | null;
  metadata?: Record<string, any> | null;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type PayoutCreationAttributes = Optional<
  PayoutAttributes,
  'id' | 'status' | 'upiId' | 'metadata' | 'createdAt' | 'updatedAt'
>;

class Payout extends Model<PayoutAttributes, PayoutCreationAttributes> implements PayoutAttributes {
  public id!: string;
  public userId!: string;
  public amount!: number;
  public currency!: string;
  public status!: PayoutStatusEnum;
  public token!: string;
  public upiId?: string | null;
  public metadata?: Record<string, any> | null;
  public expiresAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Payout.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0.01 }
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'INR',
      validate: { len: [3, 3] }
    },
    status: {
      type: DataTypes.ENUM('INITIATED'),
      allowNull: false,
      defaultValue: 'INITIATED'
    },
    token: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true
    },
    upiId: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'payouts',
    timestamps: true
  }
);

export default Payout;


