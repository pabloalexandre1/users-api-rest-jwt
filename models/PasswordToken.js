var knex = require("../database/connection");
const { dateToString } = require("sqlstring");
var User = require("./User");

class PasswordToken {
    async create(email) {
        var user = await User.findByEmail(email);
        console.log(user[0].idusers);

        if(user != undefined){
            try{

                var token = Date.now();
                console.log(user);
                await knex.insert({
                    user_id: user[0].idusers,
                    used: 0,
                    token: token
                }).table("passwordtokens");

                return{status: true, token: token};
            }catch(err){
                console.log(err);
            }
            
        }else{
            return {status: false, err: "email não encontrado no banco de dados"}
        }
    }

    async validate(token){
        try{
            var result = await knex.select().where({token: token}).table("passwordtokens");

            if(result.length > 0){
                var tk = result[0];

                if(tk.used == 1){
                    return {status: false};
                }else{

                    return {status: true, token: tk};
                }
            }else{
                return {status: false};
            }
        }catch(err){
            console.log(err);
            return {status: false};
        }
    }

    async setUsed(token){
        await knex.update({used: 1}).where({token: token}).table("passwordtokens");
    }
    
}

module.exports = new PasswordToken();