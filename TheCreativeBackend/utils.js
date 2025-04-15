module.exports = {
    // get the term with respect to the current month
    getTerm: ()=>{
        const currentMonth = new Date().getMonth() + 1;
        if (currentMonth == 1 || currentMonth >= 8){
            return 1;
        }

        else{
            return 2;
        }
    },
    getCurrentMonth: ()=>{
        const months = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
        return months[new Date().getMonth()];
    }
}