import express from express;
import { analyzeCode } from "../src/controllers/analyze.controller";


export const getCode = async(req,res) =>{

}
export async function get2(req,res){
    return res.json().status(200); //OK
    return res.json().status(400) //Bad Request
    return res.json().status(401) //unauthorized
    return res.json().status(500) //inernal server error
}
 
async function get3(params) {
    
}
function get3 = async(request)