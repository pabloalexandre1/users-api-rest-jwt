var User = require("../models/User");
var PasswordToken = require("../models/PasswordToken");
var jwt = require("jsonwebtoken");
var bcrypt = require('bcrypt');

var secret = "ashusahusauhu";

class UserController {
    async index(req, res){
        var users = await User.findAll();
        res.json(users);
    }

    async create(req, res){

        var {name, email, password} = req.body;
        
        if(email === undefined){
            res.status(400);
            res.send({msg: "email vazio"});
            return;
        }

        var emailExists = await User.findEmail(email);

        if(emailExists){
            res.status(406);
            res.json({msg: "email invalido, já existe"});
            console.log(emailExists);
            return;
        }

        await User.new(name, email, password);
        res.send("cadastrado");
    }

    async findUser(req, res){
        var id = req.params.id;
        var user = await User.findById(id);
        if(user == undefined){
            res.status(404);
            res.json({msg: "erro aconteceu"});
        }else{
            res.json(user);
        }
    }

    async edit(req, res){
        var {id, name, role, email} = req.body;

        var result = await User.update(id, email, name, role);

        if(result != undefined){
            if(result.status){
                res.send("ok");
                res.status(200);
            }else{
                res.status(406);
                res.send(result.msg);
            }
        }else{
            res.status(406);
            res.send("ocorreu um erro");
        }
    }

    async remove(req, res){
        var id = req.params.id;
        var result = await User.delete(id);
        if(result.status){
            res.status(200);
            res.send("ok");
            console.log(result);
        }else{
            res.status(406);
            res.send("err");
            console.log(result);
        }
    }

    async recoverPassword(req, res){
        var email = req.body.email;
        var result = await PasswordToken.create(email);
        if(result.status == true){

            console.log("" + req.body.token);
            res.send("" + result.token);


        }else{
            res.status(406);
            console.log(result);
            res.send("erro");
        }
    }

    async changePassword(req, res){
        var token = req.body.token;
        var password = req.body.password;

        var isTokenValid = await PasswordToken.validate(token);

        if(isTokenValid.status){   
            await User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token);
            res.send("senha alterada com sucesso");
        }else{
            res.status(406);
            res.send("token invalido");
        }
    }
    
    async login(req, res){
        var {email, password} = req.body;

        var user = await User.findByEmail(email);
        if(user != undefined){
            try{
                var result = await bcrypt.compare(password, user[0].password);
                
                if(result){
                    var token = jwt.sign({email: user[0].email, role: user[0].role}, secret);

                    res.status(200);
                    res.json({token: token});
                }else{
                    res.status(406);
                    res.send("senha incorreta");
                }
            }catch(err){
                res.send(err);
            }
            
        }else{
                res.json({status: false});
        }   
    }
}

module.exports = new UserController;