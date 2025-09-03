import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface TransactionAttributes {
    id: string;
    userId: string;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    gateway: 'stripe' | 'paypal' | 'razorpay';
    gatewayTransactionId?: string;
    description: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

export type TransactionCreationAttributes = Optional<
    TransactionAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'gatewayTransactionId' | 'metadata'
>;

class Transaction
    extends Model<TransactionAttributes, TransactionCreationAttributes>
    implements TransactionAttributes {
    public id!: string;
    public userId!: string;
    public amount!: number;
    public currency!: string;
    public status!: 'pending' | 'completed' | 'failed' | 'cancelled';
    public gateway!: 'stripe' | 'paypal' | 'razorpay';
    public gatewayTransactionId?: string;
    public description!: string;
    public metadata?: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Transaction.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: { min: 0.01 },
        },
        currency: {
            type: DataTypes.STRING(3),
            allowNull: false,
            defaultValue: 'USD',
            validate: { len: [3, 3] },
        },
        status: {
            type: DataTypes.ENUM('pending', 'completed', 'failed', 'cancelled'),
            allowNull: false,
            defaultValue: 'pending',
        },
        gateway: {
            type: DataTypes.ENUM('stripe', 'paypal', 'razorpay'),
            allowNull: false,
        },
        gatewayTransactionId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        metadata: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'transactions',
        timestamps: true,
    }
);

export default Transaction;
