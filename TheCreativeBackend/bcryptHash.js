const bcrypt = require('bcrypt');

const saltRounds = 10;
module.exports = {
    hash: async(password)=>{
        // Hash the password before storing
        try {
            const hash = await bcrypt.hash(password, saltRounds);
            return hash;
        } catch (err) {
            console.error(err);
            throw err;
        }
        
    },
    compare: async (enteredPassword, hashedPassword)=>{
        try{  
            const result = await bcrypt.compare(enteredPassword, hashedPassword);
            return result;
        }catch(err){
            console.error(err);
            throw err
        }
        
    }
}

