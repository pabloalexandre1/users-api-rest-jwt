var knex = require('../database/connection');
var bcrypt = require('bcrypt');
const PasswordToken = require('./PasswordToken');
class User {
    async new(name,email,password) {

        try{

            var hash = await bcrypt.hash(password, 10);
            await knex.insert({name, email, password: hash, role: 0}).table("users");

        }catch(err){
            console.log(err);
        }
        
    }

    async findEmail(email) {
        try{
            var result = await knex.select("*").from("users").where({email: email});
            
            if(result.length > 0){
                return true;
            }else{
                return false;
            }
        }catch(err){
            console.log(err);
        }
        
    }

    async findById(id){
        try{
            var result = await knex.select("*").from("users").where({idusers: id});
            
            if(result.length > 0){
                return result;
            }else{
                return [];
            }
        }catch(err){
            console.log(err);
        }
    }

    async findByEmail(email){
        try{
            var result = await knex.select("*").from("users").where({email: email});
            
            
            if(result.length > 0){
                return result;
            }else{
                return [];
            }
        }catch(err){
            console.log(err);
        }
    }

    async findAll(){
        try{
            var result = await knex.select(["idusers", "email", "name", "role"]).table("users");
            return result;
        }catch(err){
            console.log(err);
            return [];
        }
        
    }

    async update(id, email, name, role){
       var user =  await this.findById(id);
       if(user != undefined){
            var editUser = {};

            //verifying & saving email
            if(email != undefined){
                if(email != user.email){
                    var result = await this.findEmail(email);
                        
                    if(result == false){
                        editUser.email = email;
                    }else{
                        return {msg: "email já existe"};
                    }
                    
                }
            }
            //verifying & saving name
            if(name != undefined){
                editUser.name = name;
            }
            //verifying e saving role
            if(role != undefined){
                editUser.role = role;
            }
       }else{
            return {msg: "usuario não existe"};
       }

       try{
            await knex.update(editUser).where({idusers: id}).table("users");
            return {status: true};
       }catch(err){
            return {status: false, msg: `${err}`}
       }
       
    }

    async delete(id){
        var user = await this.findById(id);
        if(user != undefined){
            try{
                await knex.delete().where({idusers: id}).table("users");
                console.log(id);
                return {status: true};
            }catch(err){
                return {status: false, err}
            }
            
        }else{
            return {status: false, err: "o usuário não existe"};
        }
    }

    async changePassword(newPassword, id, token){
        var hash = await bcrypt.hash(newPassword, 10);
        try{
            await knex.update({password: hash}).where({idusers: id}).table("users");
            await PasswordToken.setUsed(token);
        }catch(err){
            console.log(err);
        }
        
    }
}

module.exports = new User();