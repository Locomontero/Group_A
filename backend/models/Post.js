const mongoose = require('mongoose')
const Schema = mongoose.Schema

let postSchema = new Schema({
	ra:{
		unique: true,
		type: Number
	},
	name:{
		required: true,
		type: String
	},
	cpf:{
		required: true,
		type: String
	},
	email:{
		required: true,
		type: String
	}
})

module.exports = mongoose.model('Post', postSchema)