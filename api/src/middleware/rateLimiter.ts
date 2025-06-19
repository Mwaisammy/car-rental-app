import { NextFunction, Request, Response } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
    points: 10, 
    duration: 60, 
})

export const rateLimiterMiddleware = async(req: Request, res: Response, next: NextFunction) => {
    try {
        await rateLimiter.consume(req.ip || "unknown" );
        console.log(`Rate limit passed for IP: ${req.ip}`)
        next()
        
    } catch (error) {
        res.status(429).json({
            message: 'Too many requests, please try again later.'
        })
    }
}