const userModel = require("../model/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")



function registerController(){async (req,res)=>{
    const {username,email,password}=  req.body
    
    /*    const isusernameExsits = await userModel.findOne({username})

    if(isusernameExsits){
        return res.status(401).json({
          message:"already in use"
        })
    }

    const isEmailexsits = await userModel.findOne({email})

    if(isEmailexsits){
        return res.status(401).json({
          message:"already in use"
        })
    }
        */
    
    const isUserAlreadyExsists = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })
    if(isUserAlreadyExsists){
        return res.status(409).json({
            message:"User already exsists"+(isUserAlreadyExsists ===
             email?"email Already exsists":"username exsits")
        })
    }

const hash = await bcrypt.hash(password,10)

const user = userModel.create({
    username,
    email,
    password:hash,
    bio,
    ProfileImage
})

const token = jwt.sign({
    id:user._id,
    username:user.username
},process.env.JWT_SECRET)

res.cookie("jwt_token",token)

res.status(201).json({
    message:"User registered Successfully",
    user:{
        username:(await user).username,
        email:(await user).email,
        password:(await user).password,
        bio:(await user).bio,
        ProfileImage:(await user).ProfileImage

    }
})
}
}

function loginController(){async (req,res)=>{
    const{username,email,password} = req.body

    const user = await userModel.findOne({
        $or:[
            {
                username:username
            },
            {
                email:email
            }
        ]
    })
    if(!user){
        return res.status(404).json({
            message:"user not found"
        })
    }
   // {const hash = crypto.createHash('md5').update(password).diggest('hex')
    //const ispasswordValid = hash == user.password}
  const ispasswordValid = await bcrypt.compare(password,user.password)

   if(!ispasswordValid){
    return res.status(401).json({
        massage:"password is invalid"
    })
   }
   const token = jwt.sign({
    id:user._id ,
    username:user.username
     },process.env.JWT_SECRET,
     {expiresIn:'1d'})
     res.cookie ("token",token)

     res.status(200).json({
        message:"user logged in",
        user:{
            username:user.username,
            email:user.email,
            bio:user.bio,
            password:user.password,
            ProfileImage:user.ProfileImage
        }
     })

}}

const getMeController = async (req,res)=>{
    const userId = req.user.id
    const user = await userModel.findById(userId) 
    res.status(200).json({
        user:{
            username:user.username, 
            email:user.email,
            bio:user.bio,
            ProfileImage:user.ProfileImage
        }
    })
} 

module.exports = {registerController,
                    loginController,
                    getMeController
}