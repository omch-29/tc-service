import express from express;
import { analyzeCode } from "../src/controllers/analyze.controller";



 
async function get3(params) {
    return res.status(200).json({message:"okay"});
}
const get5 = async(req,res) =>{

    return res.status(500).json({message: "int server error"});
}

module.export = {get5, get3};