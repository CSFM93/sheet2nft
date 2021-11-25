let runCommand = async(command) =>{
    try {
        await new Promise(function (myResolve, myReject) {
            const { exec } = require("child_process");
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    myReject();  
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    myReject(); 
                }
                console.log(`stdout: ${stdout}`);
                myResolve(); 
                return true
            });
        })
    } catch (error) {
        console.log(error)
    }

}



module.exports = { runCommand }