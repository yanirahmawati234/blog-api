import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

interface PostAttributes {
    id: number;
    content: string;
    authorId: number;
    createdAt: Date;
    updatedAt: Date;
}

interface PostCreationAttributes extends Omit<PostAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
    public id!: number;
    public content!: string;
    public authorId!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
}

Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        authorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        createdAt: '',
        updatedAt: ''
    },
    {
        sequelize,
        modelName: 'Post',
        tableName: 'posts',
        timestamps: true,
    }
);

export default Post;
