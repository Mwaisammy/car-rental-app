import express from 'express'
import car from './car/car.router'
import insurance from './insurance/insurance.router'
import maintenance from './maintenance/maintenance.router'
import payment from './payment/payment.router'
import booking from './booking/booking.router'
import location from './location/location.router'
import reservation from './reservation/reservation.router'
import { customer } from './customer/customer.router'
import authentication from './auth/auth.router'
import joins from './joins/joins.router'
import { logger } from './middleware/loggers'
import { rateLimiterMiddleware } from './middleware/rateLimiter'
import cors from 'cors'


const initializeApp = () => {
    const app = express()
    app.use(cors({
        origin: 'http://localhost:5173',
        methods: ["GET","POST","PUT","DELETE"]

    }))


    //Middleware
    app.use(express.json())
    app.use(logger)
    app.use(rateLimiterMiddleware)
    
    
    
    //Routes
    car(app)
    insurance(app)
    maintenance(app)
    location(app)
    payment(app)
    booking(app)
    reservation(app)
    customer(app)
    authentication(app)
    joins(app)
    
    
    app.get('/', (req, res) => {
        res.send('Hello world')
    })


    return app

}

const app = initializeApp()
export default app
