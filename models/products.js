'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
        getName() {
            return this.name['en'] ?? this.name['hy'] ?? '';
        }
    }

    Product.init({
        // id: DataTypes.STRING,
        slug: DataTypes.STRING,
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        stock: DataTypes.STRING,
        brand_id: DataTypes.STRING,
        image: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Product',
        tableName: 'products',
        timestamps: false,
    });
    return Product;
};