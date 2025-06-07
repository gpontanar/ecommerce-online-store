const jwt = require('jsonwebtoken');
// [SECTION] Environment Setup
require('dotenv').config();


// [SECTION] Token Creation
 

module.exports.createAccessToken = (user) => {
	// The data will be received from the registration form
	// When the user logs in, a token will be created with user's information
	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin
	};

	return jwt.sign(data, process.env.JWT_SECRET_KEY, {})

}

// [SECTION] Token Verification

module.exports.verify = (req, res, next) => {
	console.log(req.headers.authorization);

	let token = req.headers.authorization;

	if(typeof token === "undefined"){
		return res.status(403).send({ auth: "Failed.", message: "Action Forbidden" })
	}else{
		console.log(token);
		token = token.slice(7, token.length);
		console.log(token);

		// [SECTION] Token Decryption
	
		jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decodedToken){
			if(err){

				return res.status(403).send({
					auth: "Failed",
					// message: err.message
					message: "Action Forbidden"
				});
			
			}else{

				console.log("result from verify method:")
				console.log(decodedToken);

				// req.user = decodedToken.id;
				req.user = decodedToken;

				next();
			}
		})
	}
}

// [SECTION] Verify Admin

module.exports.verifyAdmin = (req, res, next) => {

	if(req.user.isAdmin){
		next();
	}else{
		return res.status(403).send({
			auth: "Failed",
			message: "Action Forbidden"
		})
	}

}

// [SECTION] Error Handler
// module.exports.errorHandler = (err, req, res, next) => {

// 	console.error(err);

// 	const statusCode = err.status || 500;
// 	const errorMessage = err.message || 'Internal Server Error'; 
// 	res.status(statusCode).json({
		
// 		error: {
// 			message: errorMessage,
// 			errorCode: err.code || 'SERVER_ERROR',
// 			details: err.details || null
// 		}

// 	})

// }
module.exports.errorHandler = (err, req, res, next) => {
	console.error(err);

	const statusCode = err.status || 500;
	const errorMessage = err.message || 'Internal Server Error';

	if (err.kind === 'ObjectId' && err.name === 'CastError') {
		return res.status(500).json({
			error: "Failed in Find",
			details: {
				stringValue: `"${err.value}"`,
				valueType: typeof err.value,
				kind: err.kind,
				value: err.value,
				path: err.path,
				reason: err.reason || {},
				name: err.name,
				message: err.message
			}
		});
	}

	res.status(statusCode).json({
		error: {
			message: errorMessage,
			errorCode: err.code || 'SERVER_ERROR',
			details: err.details || null
		}
	});
}

// [SECTION] Middleware to check if the user is authenticated
module.exports.isLoggedIn = (req, res, next) => {
	if(req.user){
		next();
	}else{
		res.sendStatus(401);
	}
}