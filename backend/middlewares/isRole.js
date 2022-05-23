module.exports = function (roles = []){
	return function (req,res,next){
		if(roles.includes(req.user.role)) return next();
		
		res.status(403).json({
			status:"FAIL",
			data:{
				name:"FORBIDDEN",
				message:"You cannot access"
			}
		})
	}

}