import express from 'express'
import { GenerateProduct,SearchDate, SearchProduct,getSr,deleteProduct} from '../controllers/product.controller.js'
import { isAuthenticated } from '../middleware/isAuth.js'


const router = express.Router()



router.get("/sr", isAuthenticated, getSr)
router.post("/generate", isAuthenticated, GenerateProduct)
router.post("/searchDate",isAuthenticated , SearchDate)
router.post("/search", isAuthenticated, SearchProduct)
router.delete("/product/:SrNo",isAuthenticated,  deleteProduct)


export default router
