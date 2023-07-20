const{check,validationResult}=require("express-validator");

//Sign-up
router.post(
    "/register-user",
    [
        check("name")
        .not()
        .isEmpty()
        .isLength({min:3})
        .withMessage("Name must be atleast 3 characters long"),
        check("email","Email is required").not().isEmpty(),
        check("password","Password should be between 5 to 8 characters long")
        .not()
        .isEmpty()
        .isLength({min:5,max:8}),
    ],
    (req,res,next)=>{
        const errors=validationResult(req);
        const saltRounds=10;
        if(!errors.isEmpty()){
            return res.status(422).jsonp(errors.array());
        }else{
            bcrypt.genSalt(saltRounds,function(err,salt){
                bcrypt.hash(req.body.password,salt,(err,hash)=>{
                    const user=new userSchema({
                        name:req.body.name,
                        email: req.body.email,
                        password: hash,
                    });
                    user
                    .save()
                    .then((response)=>{
                        res.status(201).json({
                            message: "User successfully created!",
                            result: response,
                        });
                    })
                    .catch((error)=>{
                        res.status(500).json({
                            error:error,
                        });
                    });
                });
            });
        }
    }
);