import {Errback, Request, Response, NextFunction } from "express"
import HttpStatusCode from "../types/HttpStatusCode"

let totalNumberOfErrors = 0;

const globalCatch = (err:Errback, req:Request, res:Response, next:NextFunction) => {
    console.error("Oops! Something is up with our server")
    console.log(err)
    totalNumberOfErrors += 1
    console.log("Total errors encountered : "+totalNumberOfErrors)
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({ errors: "Oops! Something is up with our server"})
}

export default globalCatch